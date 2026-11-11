// Lists everything in content/ that is still marked TODO: resume.json and the
// case studies in content/work/.
//   npm run todos            list them
//   npm run todos -- --strict   also exit 1 if any remain (for the launch gate)
import { readFileSync, readdirSync } from 'node:fs';

const resume = JSON.parse(readFileSync(new URL('../content/resume.json', import.meta.url), 'utf8'));
const found = [];

(function walk(value, path) {
  if (typeof value === 'string') {
    if (value.trimStart().startsWith('TODO')) found.push([path, value]);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walk(child, path ? `${path}.${key}` : key);
  }
})(resume, '');

if (resume.testimonials.length === 0) found.push(['testimonials', 'TODO: none yet']);

// Case studies: <Todo ... text="..."> blocks and *Todo: lines in the front matter.
const workDir = new URL('../content/work/', import.meta.url);
for (const file of readdirSync(workDir).filter((name) => name.endsWith('.mdx'))) {
  const source = readFileSync(new URL(file, workDir), 'utf8');
  for (const match of source.matchAll(/<Todo[^>]*\btext="([^"]+)"/g)) found.push([`work/${file}`, match[1]]);
  for (const match of source.matchAll(/^\s*\w*Todo:\s*(.+)$/gm)) found.push([`work/${file}`, match[1]]);
}

for (const [path, text] of found) console.log(`${path}\n    ${text}\n`);
console.log(`${found.length} TODO${found.length === 1 ? '' : 's'} in content/. See docs/todo-content.md.`);
if (process.argv.includes('--strict') && found.length > 0) process.exit(1);
