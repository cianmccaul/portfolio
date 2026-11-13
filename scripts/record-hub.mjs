// Records the short walkthrough on the BodyMed Hub case study from the public
// demo (a fictional clinic: nothing in it is real), then encodes it as small,
// silent WebM and H.264 files. Needs Playwright with Chromium, and ffmpeg.
//
// The waitlist is filmed at work (offers sent, one booked), the same state as
// its screenshot in the tour. The demo never sends texts, so the top of its
// waitlist page says texts are switched off; that moment is cut out.
//
//   node scripts/record-hub.mjs
//
// Output: public/media/hub-walkthrough.webm and .mp4, 1200 × 750. Its poster is the
// hero screenshot (src/assets/work/hub-home.png), so re-capture that with
// `node scripts/capture-work.mjs hub` if the demo's home screen changes.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DEMO = 'https://cian-clinic-demo.vercel.app';
const out = new URL('../public/media/', import.meta.url).pathname;
const dir = mkdtempSync(join(tmpdir(), 'hub-walkthrough-'));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 750 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
  recordVideo: { dir, size: { width: 1200, height: 750 } },
});

// 1. Set the scene in a tab of its own (its recording is thrown away): the
// demo keeps its data in the browser, so the tab recorded next shares it.
// "Look for times now" offers open times to the made-up patients waiting,
// and one of them books through the link in their offer email.
{
  const setup = await context.newPage();
  await setup.goto(`${DEMO}/dashboard/waitlist`, { waitUntil: 'networkidle' });
  await setup.waitForTimeout(1200);
  await setup.getByRole('button', { name: 'Look for times now' }).click();
  await setup.waitForTimeout(2000);
  await setup.getByRole('button', { name: /^Inbox/ }).click();
  await setup.waitForTimeout(1200);
  const link = await setup.locator('a', { hasText: 'Book and pay' }).first().getAttribute('href');
  await setup.goto(DEMO + link, { waitUntil: 'networkidle' });
  await setup.waitForTimeout(1200);
  const boxes = setup.locator('main input[type=checkbox]');
  await boxes.nth(0).check(); // the cancellation policy
  await boxes.nth(1).check(); // the privacy agreement
  await setup.getByRole('button', { name: /^Pay €/ }).click();
  await setup.waitForTimeout(1500);
  await setup.getByRole('button', { name: /^Pay €/ }).last().click(); // the demo's pretend checkout
  await setup.waitForURL(/booking\/confirmed/);
  await setup.close();
}

// 2. The walkthrough itself.
const page = await context.newPage();
const t0 = Date.now();
const at = () => (Date.now() - t0) / 1000;
const pause = (ms) => page.waitForTimeout(ms);
const glide = async (to, ms = 1400) => {
  await page.evaluate(
    ([to, ms]) =>
      new Promise((done) => {
        const from = window.scrollY;
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / ms);
          window.scrollTo(0, from + (to - from) * (t * t * (3 - 2 * t)));
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      }),
    [to, ms],
  );
};
/** Page offset of the first element with this text. */
const top = (text) => page.getByText(text).first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

// Open on the Hub's home screen, the same frame as the poster.
await page.goto(`${DEMO}/dashboard`, { waitUntil: 'networkidle' });
const start = at();
await pause(1600);
await glide(520);
await pause(900);

// Reception: online bookings and their payments.
await page.goto(`${DEMO}/dashboard/bookings`, { waitUntil: 'networkidle' });
await pause(900);
await glide(560, 1600);
await pause(1500);

// The waitlist at work: offers out, one booked. The page opens at its top,
// where the demo (which never sends texts) says texts are switched off; that
// moment is cut from the film, which picks up once the page has moved down to
// the waitlist's own figures.
const cutFrom = at();
await page.goto(`${DEMO}/dashboard/waitlist`, { waitUntil: 'networkidle' });
await page.getByText('Since this started').first().waitFor();
await page.evaluate((y) => window.scrollTo(0, y), (await top('Since this started')) - 96);
await pause(150);
const cutTo = at();
await pause(1600);
await glide((await top('Ended in the last 14 days')) - 260, 1600);
await pause(1600);

// The KPI dashboard.
await page.goto(`${DEMO}/dashboard/kpis`, { waitUntil: 'networkidle' });
await pause(1300);
await glide(520, 1600);
await pause(1300);

// The patient's side: a booking, as far as choosing a time.
await page.goto(`${DEMO}/`, { waitUntil: 'networkidle' });
await pause(900);
await page.getByText('New patient').first().click();
await pause(900);
await page.getByText('Physiotherapy').first().click();
await pause(900);
await page.getByText('Physiotherapy - New Patient').first().click();
await pause(1300);
await page.getByText('Sarah Byrne').first().click();
await pause(2200);
const end = at();

await context.close();
await browser.close();

// The recorded tab's file (the setup tab's is the other one).
const files = readdirSync(dir).filter((name) => name.endsWith('.webm')).map((name) => join(dir, name));
const raw = files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
// Keep from the first frame of the home screen to the end, without the cut;
// 15 frames a second, no sound. Two files: WebM (VP9), and H.264 for the rest.
const keep = `between(t,${start.toFixed(2)},${end.toFixed(2)})*not(between(t,${(cutFrom - 0.1).toFixed(2)},${(cutTo + 0.3).toFixed(2)}))`;
const input = ['-y', '-loglevel', 'error', '-i', raw, '-an', '-vf', `fps=15,select='${keep}',setpts=N/15/TB,scale=1200:750:flags=lanczos`];
const encodes = {
  'hub-walkthrough.webm': ['-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1', '-pix_fmt', 'yuv420p'],
  'hub-walkthrough.mp4': ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
};
const seconds = end - start - (cutTo + 0.3 - (cutFrom - 0.1));
for (const [name, codec] of Object.entries(encodes)) {
  execFileSync('ffmpeg', [...input, ...codec, `${out}${name}`]);
  console.log(`${name}: about ${seconds.toFixed(1)} s, ${Math.round(statSync(`${out}${name}`).size / 1024)} KB`);
}
