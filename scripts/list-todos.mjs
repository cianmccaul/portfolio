// Lists everything the site is still waiting for: TODOs in resume.json, the
// case studies and the page templates, and sign-offs not yet given.
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

// Sign-offs: everything tagged with a switch that is still false stays out of production.
const covers = {
  bodymedMetrics: 'the BodyMed launch figures, on the site and the CV',
  awardsPhoto: 'the BodyMed team photo from the 2026 Irish Healthcare Centre Awards (not built at all until then)',
};
for (const [key, approved] of Object.entries(resume.approvals ?? {})) {
  if (!approved) found.push([`approvals.${key}`, `Pending approval: ${covers[key] ?? 'everything tagged with it'}. Set to true once approved.`]);
}

// The BodyMed Hub case study keeps its TODOs under keys named todo or …Todo.
const hub = JSON.parse(readFileSync(new URL('../content/hub.json', import.meta.url), 'utf8'));
(function walk(value, path) {
  if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${path}[${i}]`));
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === 'string' && /todo$/i.test(key)) found.push([`hub.json ${path}.${key}`.replace(' .', ' '), child]);
      else walk(child, path ? `${path}.${key}` : key);
    }
  }
})(hub, '');

// Case studies: <Todo ... text="..."> blocks and *Todo: lines in the front matter.
const workDir = new URL('../content/work/', import.meta.url);
for (const file of readdirSync(workDir).filter((name) => name.endsWith('.mdx'))) {
  const source = readFileSync(new URL(file, workDir), 'utf8');
  for (const match of source.matchAll(/<Todo[^>]*\btext="([^"]+)"/g)) found.push([`work/${file}`, match[1]]);
  for (const match of source.matchAll(/^\s*\w*Todo:\s*(.+)$/gm)) found.push([`work/${file}`, match[1]]);
}

// Page templates: TODOs written straight into a page, such as the portrait.
const pagesDir = new URL('../src/pages/', import.meta.url);
for (const file of readdirSync(pagesDir).filter((name) => name.endsWith('.astro'))) {
  const source = readFileSync(new URL(file, pagesDir), 'utf8');
  for (const match of source.matchAll(/<Todo[^>]*?\btext="([^"]+)"/gs)) found.push([`src/pages/${file}`, match[1]]);
}

for (const [path, text] of found) console.log(`${path}\n    ${text}\n`);
console.log(`${found.length} item${found.length === 1 ? '' : 's'} outstanding. See docs/todo-content.md.`);
if (process.argv.includes('--strict') && found.length > 0) process.exit(1);
