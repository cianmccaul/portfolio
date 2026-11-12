// Records the short walkthrough on the BodyMed Hub case study from the public
// demo (a fictional clinic: nothing in it is real), then encodes it as a
// small, silent H.264 file. Needs Playwright with Chromium, and ffmpeg.
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
const page = await context.newPage();
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

// Open on the Hub's home screen, the same frame as the poster.
await page.goto(`${DEMO}/dashboard`, { waitUntil: 'networkidle' });
const started = Date.now();
await pause(1600);
await glide(520);
await pause(900);

// Reception: online bookings and their payments.
await page.goto(`${DEMO}/dashboard/bookings`, { waitUntil: 'networkidle' });
await pause(900);
await glide(560, 1600);
await pause(1500);

// The waitlist.
await page.goto(`${DEMO}/dashboard/waitlist`, { waitUntil: 'networkidle' });
await pause(1300);
await glide(360, 1200);
await pause(1100);

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

// The loop then starts again on the Hub's home screen.
const seconds = (Date.now() - started) / 1000;

await context.close();
await browser.close();

const raw = join(dir, readdirSync(dir).find((name) => name.endsWith('.webm')));
// Trim the blank lead-in before the first page, 15 frames a second, no sound.
// Two files: WebM (VP9) for browsers that play it, H.264 for the rest.
const input = ['-y', '-loglevel', 'error', '-sseof', `-${seconds.toFixed(2)}`, '-i', raw, '-an', '-vf', 'fps=15,scale=1200:750:flags=lanczos'];
const encodes = {
  'hub-walkthrough.webm': ['-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1', '-pix_fmt', 'yuv420p'],
  'hub-walkthrough.mp4': ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
};
for (const [name, codec] of Object.entries(encodes)) {
  execFileSync('ffmpeg', [...input, ...codec, `${out}${name}`]);
  console.log(`${name}: ${seconds.toFixed(1)} s, ${Math.round(statSync(`${out}${name}`).size / 1024)} KB`);
}
