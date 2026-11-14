// Captures the card images in src/assets/work/ from the public demos.
// The demos run as a fictional clinic (Northbank Physio) with made-up data,
// so nothing in these screenshots is real patient information.
//
//   node scripts/capture-work.mjs                 everything
//   node scripts/capture-work.mjs hub pulsepay    only the named groups
//   node scripts/capture-work.mjs --mobile more   only the phone captures
//   (groups: triage, chatbot, more, hub, pulsepay)
//
// The chatbot, PulsePay, More projects and Hub groups are also taken on a
// phone (390 × 520 at 3×) and saved as NAME-mobile.png, which the site shows
// below 640 px (see src/lib/images.ts).
//
// Needs Playwright with Chromium. Images are 16:10 unless noted.
//
// Not captured here: the three phone screenshots in the clinic band
// (clinic-step-treatment.png, clinic-step-practitioner.png,
// clinic-booking-phone.png). Replace those files by hand; the site crops them
// from the top, so any phone screenshot of the right step will fit.
import { chromium } from 'playwright';

const out = new URL('../src/assets/work/', import.meta.url).pathname;
const args = process.argv.slice(2);
const mobileOnly = args.includes('--mobile');
const only = args.filter((arg) => arg !== '--mobile');
// Each size as [suffix, width, height, scale]; the phone is NAME-mobile.png.
const PHONE = ['-mobile', 390, 520, 3];
const sizes = (desktop) => (mobileOnly ? [PHONE] : [['', ...desktop], PHONE]);
const want = (group) => only.length === 0 || only.includes(group);
const browser = await chromium.launch();
const open = async (width, height, deviceScaleFactor) => {
  const phone = width < 640;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    isMobile: phone,
    hasTouch: phone,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  return context.newPage();
};

// AI email triage: an email that tripped the red-flag safety check.
if (want('triage') && !mobileOnly) {
  const page = await open(1240, 760, 3);
  await page.goto('https://cian-email-triage.vercel.app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(6000); // the sample inbox sorts itself on load
  await page.getByText('Pins and needles getting worse').first().click();
  await page.waitForTimeout(1200);
  // The detail pane has a rounded corner over the demo's colour wash; a flat
  // white page keeps that corner out of the crop.
  await page.addStyleTag({ content: 'html, body { background: #fff !important } [class*="wash"] { display: none !important }' });
  const article = page.locator('article').filter({ hasText: "Why it's in" }).first();
  const pane = await article.boundingBox();
  // End below the safety check, halfway to the next heading, so the picture
  // stops at a clean boundary instead of cutting "Their message" in half.
  const safety = await article.getByText('Safety check:').locator('xpath=..').boundingBox();
  const next = await article.getByText('Their message').first().boundingBox();
  const bottom = (safety.y + safety.height + next.y) / 2;
  await page.screenshot({
    path: `${out}email-triage.png`,
    clip: { x: pane.x, y: pane.y, width: pane.width, height: Math.round(bottom - pane.y) },
  });
}

// Clinic chatbot: asked who is best for a back injury. The whole page is
// kept so the "made-up clinic" banner stays in shot.
if (want('chatbot')) {
  for (const [suffix, ...size] of sizes([1120, 700, 2])) {
    const page = await open(...size);
    await page.goto('https://physio-chatbot.vercel.app', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Chat with us' }).first().click();
    await page.waitForTimeout(1200);
    await page.getByText("Who's best for my injury?").click();
    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `${out}clinic-chatbot${suffix}.png` });
  }
}

// More projects: the first screen of each live site, 16:10, saved at 1920 px.
// DesignRoom is opened in demo mode (nothing is saved or emailed) with its
// intro skipped, so the showroom itself is in shot.
if (want('more')) {
  const sharp = (await import('sharp')).default;
  const sites = [
    ['designroom', 'https://cm-studio-designroom.vercel.app/?demo=1', async (page) => page.getByText(/skip intro/i).first().click()],
    ['house-prices', 'https://irish-house-prices.vercel.app'],
    ['deme-housepainting', 'https://deme-housepainting.vercel.app'],
  ];
  for (const [name, url, prepare] of sites) {
    for (const [suffix, ...size] of sizes([1280, 800, 2])) {
      const page = await open(...size);
      await page.goto(url, { waitUntil: 'networkidle' });
      if (prepare) await prepare(page).catch(() => {});
      await page.waitForTimeout(3000);
      const shot = sharp(await page.screenshot());
      await (suffix ? shot : shot.resize(1920, 1200)).png({ compressionLevel: 9 }).toFile(`${out}${name}${suffix}.png`);
    }
  }
}

// BodyMed Hub: the tour on its case study, from the public demo. The demo is
// the production interface running as a fictional clinic, so every name and
// figure in shot is made up. 1200 × 750 at 2×. Nothing is ever taken from the
// real Hub.
if (want('hub')) {
  const DEMO = 'https://cian-clinic-demo.vercel.app';
  // Put the first element with this text `offset` px below the top of the window.
  const bring = async (page, text, offset) => {
    const box = await page.getByText(text).first().boundingBox();
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), box.y + (await page.evaluate(() => window.scrollY)) - offset);
    await page.waitForTimeout(400);
  };
  const chooseTime = async (page, path) => {
    await page.goto(DEMO + path, { waitUntil: 'networkidle' });
    await page.getByText('New patient').first().click();
    await page.waitForTimeout(600);
    await page.getByText('Physiotherapy').first().click();
    await page.waitForTimeout(800);
    await page.getByText('Physiotherapy - New Patient').first().click();
    await page.waitForTimeout(1200);
    await page.getByText('Sarah Byrne').first().click();
    await page.waitForTimeout(1800);
    await page.getByRole('button', { name: /\d{1,2}:\d{2}(am|pm)/ }).first().click();
    await page.waitForTimeout(400);
  };

  // Every stop is taken twice: at desktop size, and on a phone (saved as
  // NAME-mobile.png, which the site shows below 640 px), so the tour is
  // readable on a small screen instead of a shrunken desktop.
  for (const [suffix, size] of [['', [1200, 750, 2]], ['-mobile', [390, 520, 3]]].filter(([suffix]) => suffix || !mobileOnly)) {
    const phone = suffix !== '';
    const fresh = async () => {
      const context = await browser.newContext({
        viewport: { width: size[0], height: size[1] },
        deviceScaleFactor: size[2],
        isMobile: phone,
        hasTouch: phone,
        colorScheme: 'light',
        reducedMotion: 'reduce',
      });
      return context.newPage();
    };
    const shot = (page, name) => page.screenshot({ path: `${out}hub-${name}${suffix}.png` });

    // The patient's side: step 3 of 5, choosing a time.
    {
      const page = await fresh();
      await chooseTime(page, '/');
      if (phone) await bring(page, 'Step 3 of 5', 90);
      else await page.evaluate(() => window.scrollTo(0, 0));
      await shot(page, 'booking');
    }
    // Reception: the list of online bookings, each with its payment.
    {
      const page = await fresh();
      await page.goto(`${DEMO}/dashboard/bookings`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await bring(page, /^08:00/, phone ? 90 : 120);
      await shot(page, 'bookings');
    }
    // A phone booking for a made-up caller, at the step where reception sends a pay link.
    {
      const page = await fresh();
      await chooseTime(page, '/dashboard/book');
      await page.getByRole('button', { name: /^continue$/i }).first().click();
      await page.waitForTimeout(900);
      const caller = { firstName: 'Niamh', lastName: 'Brennan', email: 'niamh.brennan@example.com', phone: '083 555 0142', dateOfBirth: '2', 'dateOfBirth-month': '4', 'dateOfBirth-year': '1988', address: '12 Example Road, Dublin 3', gpName: 'None' };
      for (const [id, value] of Object.entries(caller)) await page.locator(`#${id}`).fill(value);
      await page.getByRole('button', { name: /^continue$/i }).first().click();
      await page.waitForTimeout(1500);
      await page.getByText('Email them a payment link').first().click();
      await page.waitForTimeout(600);
      if (phone) await bring(page, 'How will the patient pay?', 90);
      else await bring(page, 'Review and take payment', 150);
      await shot(page, 'phone');
    }
    // The waitlist at work, using only the demo's own controls: "Look for
    // times now" offers open times to the made-up patients waiting, then one
    // of them books through the link in their offer email. The demo always
    // has texts switched off (it sends nothing), so the frame starts at the
    // waitlist's own figures, below that demo-only notice.
    {
      const page = await fresh();
      await page.goto(`${DEMO}/dashboard/waitlist`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await page.getByRole('button', { name: 'Look for times now' }).click();
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: /^Inbox/ }).click();
      await page.waitForTimeout(1200);
      const link = await page.locator('a', { hasText: 'Book and pay' }).first().getAttribute('href');
      await page.goto(DEMO + link, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const boxes = page.locator('main input[type=checkbox]');
      await boxes.nth(0).check(); // the cancellation policy
      await boxes.nth(1).check(); // the privacy agreement
      await page.getByRole('button', { name: /^Pay €/ }).click();
      await page.waitForTimeout(1500);
      // The demo's pretend checkout: test card already filled in, "Everything works".
      await page.getByRole('button', { name: /^Pay €/ }).last().click();
      await page.waitForURL(/booking\/confirmed/);
      await page.goto(`${DEMO}/dashboard/waitlist`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await bring(page, 'Since this started', phone ? 24 : 104);
      await shot(page, 'waitlist');
    }

    // The staff home screen (for the case study's hero) and three areas shown from their headings.
    for (const [name, path, heading] of [['home', '', 'Hello Demo'], ['kpis', '/kpis', 'Clinic KPIs'], ['appointments', '/appointments', 'Appointments'], ['help', '/help', 'Guides']]) {
      const page = await fresh();
      await page.goto(`${DEMO}/dashboard${path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      if (phone) await bring(page, heading, 90);
      await shot(page, name);
    }
  }
}

// PulsePay: the demo's first screen, a fictional clinic with made-up therapists.
if (want('pulsepay')) {
  for (const [suffix, ...size] of sizes([1200, 750, 2])) {
    const page = await open(...size);
    await page.goto('https://cian-pulsepay-demo.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}pulsepay${suffix}.png` });
  }
}

await browser.close();
