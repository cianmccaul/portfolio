// Derived crops of the screenshots in src/assets/work/: the same pixels, cut
// to a smaller region, never recoloured or redrawn. A file named
// NAME-mobile.png is used in place of NAME.png on screens under 640 px wide
// (see src/lib/images.ts).
//
//   node scripts/crop-work.mjs
import sharp from 'sharp';

const dir = new URL('../src/assets/work/', import.meta.url).pathname;
const crops = [
  // Jarvis: the Ask Jarvis panel, with the incident row behind it and the chat
  // button, so it still reads as part of the dashboard.
  { from: 'jarvis-dashboard-approve.png', to: 'jarvis-dashboard-approve-mobile.png', left: 2210, top: 372, width: 800, height: 1218 },
];

for (const { from, to, ...region } of crops) {
  await sharp(`${dir}${from}`).extract(region).png({ compressionLevel: 9 }).toFile(`${dir}${to}`);
  console.log(`${to}: ${region.width} × ${region.height} from ${from}`);
}
