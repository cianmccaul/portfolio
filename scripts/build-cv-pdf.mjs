// Prints /cv/ from the built site to a one-page A4 PDF, then checks it.
//
//   npm run build && npm run cv
//
// Writes public/<Name>-CV.pdf (served by the site) and copies it into dist/.
// Fails if the PDF is not exactly one page, if its text can't be extracted
// (which is what applicant tracking systems do), or if any TODO leaked in.
import { createServer } from 'node:http';
import { copyFile, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const resume = JSON.parse(await readFile(join(root, 'content/resume.json'), 'utf8'));
const fileName = `${resume.basics.name.replace(/\s+/g, '-')}-CV.pdf`;
const output = join(root, 'public', fileName);

// A minimal static server for dist/.
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };
const server = createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (path.endsWith('/')) path += 'index.html';
    const file = join(dist, path);
    if (!file.startsWith(dist)) throw new Error('outside dist');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

try {
  await stat(join(dist, 'cv/index.html'));
} catch {
  server.close();
  throw new Error('dist/cv/index.html not found. Run "npm run build" first.');
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  await page.goto(`${origin}/cv/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: output, format: 'A4', preferCSSPageSize: true, tagged: true });
} finally {
  await browser.close();
  server.close();
}

// ── Checks ────────────────────────────────────────────────────────────────
const pdf = await getDocument({ data: new Uint8Array(await readFile(output)) }).promise;
let text = '';
for (let i = 1; i <= pdf.numPages; i++) {
  const content = await (await pdf.getPage(i)).getTextContent();
  text += content.items.map((item) => item.str).join(' ') + '\n';
}

const problems = [];
if (pdf.numPages !== 1) problems.push(`The CV is ${pdf.numPages} pages. It must be exactly one.`);
for (const expected of [resume.basics.name, resume.basics.email, 'Experience', 'Projects', 'Education', 'Skills']) {
  if (!text.includes(expected)) problems.push(`"${expected}" is missing from the extracted text.`);
}
if (/TODO/.test(text)) problems.push('A TODO leaked into the PDF.');

if (problems.length > 0) {
  console.error(`${fileName} failed its checks:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

await copyFile(output, join(dist, fileName));
const { size } = await stat(output);
console.log(`${fileName}: 1 page, ${Math.round(size / 1024)} KB, ${text.trim().split(/\s+/).length} words of extractable text.`);
