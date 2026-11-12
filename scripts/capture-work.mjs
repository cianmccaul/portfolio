// Captures the card images in src/assets/work/ from the public demos.
// The demos run as a fictional clinic (Northbank Physio) with made-up data,
// so nothing in these screenshots is real patient information.
//
//   node scripts/capture-work.mjs
//
// Needs Playwright with Chromium. Images are 16:10 unless noted.
//
// Not captured here: the three phone screenshots in the clinic band
// (clinic-step-treatment.png, clinic-step-practitioner.png,
// clinic-booking-phone.png). Replace those files by hand; the site crops them
// from the top, so any phone screenshot of the right step will fit.
import { chromium } from 'playwright';

const out = new URL('../src/assets/work/', import.meta.url).pathname;
const browser = await chromium.launch();
const open = async (width, height, deviceScaleFactor) => {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  return context.newPage();
};

// AI email triage: an email that tripped the red-flag safety check.
{
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
{
  const page = await open(1120, 700, 2);
  await page.goto('https://physio-chatbot.vercel.app', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Chat with us' }).first().click();
  await page.waitForTimeout(1200);
  await page.getByText("Who's best for my injury?").click();
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${out}clinic-chatbot.png` });
}

// More projects: the first screen of each live site, 16:10, saved at 1920 px.
// DesignRoom is opened in demo mode (nothing is saved or emailed) with its
// intro skipped, so the showroom itself is in shot.
{
  const sharp = (await import('sharp')).default;
  const sites = [
    ['designroom', 'https://cm-studio-designroom.vercel.app/?demo=1', async (page) => page.getByText(/skip intro/i).first().click()],
    ['house-prices', 'https://irish-house-prices.vercel.app'],
    ['deme-housepainting', 'https://deme-housepainting.vercel.app'],
  ];
  for (const [name, url, prepare] of sites) {
    const page = await open(1280, 800, 2);
    await page.goto(url, { waitUntil: 'networkidle' });
    if (prepare) await prepare(page).catch(() => {});
    await page.waitForTimeout(3000);
    await sharp(await page.screenshot()).resize(1920, 1200).png({ compressionLevel: 9 }).toFile(`${out}${name}.png`);
  }
}

await browser.close();
