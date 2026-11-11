// Prints the text of a PDF. CI uses it to tell whether the CV actually
// changed: the PDF's bytes differ on every run, its words don't.
//   node scripts/pdf-text.mjs public/Cian-McCaul-CV.pdf
import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdf = await getDocument({ data: new Uint8Array(await readFile(process.argv[2])) }).promise;
for (let i = 1; i <= pdf.numPages; i++) {
  const content = await (await pdf.getPage(i)).getTextContent();
  console.log(content.items.map((item) => item.str).join(' '));
}
