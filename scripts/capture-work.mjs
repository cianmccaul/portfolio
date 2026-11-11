// Captures the card images in src/assets/work/ from the public demos.
// The demos run as a fictional clinic (Northbank Physio) with made-up data,
// so nothing in these screenshots is real patient information.
//
//   node scripts/capture-work.mjs
//
// Needs Playwright with Chromium. Every image is 16:10.
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
  const pane = await page.locator('article').filter({ hasText: "Why it's in" }).first().boundingBox();
  await page.screenshot({
    path: `${out}email-triage.png`,
    clip: { x: pane.x, y: pane.y, width: pane.width, height: Math.round(pane.width / 1.6) },
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

await browser.close();
