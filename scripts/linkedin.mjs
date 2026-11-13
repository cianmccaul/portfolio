// Writes docs/linkedin.md: LinkedIn copy generated from content/resume.json,
// so the profile and the site say the same thing. Run it after changing
// resume.json, then paste the sections into LinkedIn.
//
//   npm run linkedin
//
// It exits with an error if a section is over LinkedIn's limit.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const resume = JSON.parse(readFileSync(`${root}content/resume.json`, 'utf8'));
const hub = JSON.parse(readFileSync(`${root}content/hub.json`, 'utf8'));
const site = /site:\s*'([^']+)'/.exec(readFileSync(`${root}astro.config.mjs`, 'utf8'))[1].replace(/\/$/, '');
const { basics, logistics, approvals = {} } = resume;
const now = new Date();

// ── Dates, the same way the site writes them ─────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parse = (d) => ({ year: Number(d.slice(0, 4)), month: d.length >= 7 ? Number(d.slice(5, 7)) : undefined });
const month = (d) => (parse(d).month ? `${MONTHS[parse(d).month - 1]} ${parse(d).year}` : String(parse(d).year));
const isPast = (d) => {
  const p = parse(d);
  return p.year * 12 + (p.month ?? 12) - 1 < now.getFullYear() * 12 + now.getMonth();
};
const range = (start, end) => `${month(start)} – ${end && isPast(end) ? month(end) : end ? `${month(end)} (expected)` : 'Present'}`;

// ── Lines: plain, pending approval, or not written yet ───────────────────
const PENDING = '[Pending approval: hidden on the site until the owner signs off. Leave it off LinkedIn until then.]';
const isTodo = (s) => typeof s === 'string' && s.trimStart().startsWith('TODO');
const lines = (items = []) =>
  items
    .filter((item) => !isTodo(item))
    .map((item) => {
      if (typeof item === 'string') return item;
      const approved = !item.approval || approvals[item.approval];
      return approved ? item.text : `${PENDING} ${item.text}`;
    });
const todos = (items = []) => items.filter(isTodo);

// ── Sections ─────────────────────────────────────────────────────────────
const availability = `${MONTHS[parse(logistics.availableFrom).month - 1]}–${MONTHS[parse(logistics.availableUntil).month - 1]} ${parse(logistics.availableUntil).year}`;
const hubProject = resume.projects.find((p) => p.slug === hub.slug);

// The footer's wording: "Open to software engineering internships".
const openTo = `Open to ${logistics.targetRole.toLowerCase().replace(/intern$/, 'internships')}`;
const headline = [basics.label, `Built ${hubProject.name}, the system ${resume.work[0].company} runs on`, `${openTo}, ${availability}`].join(' · ');

// The CV's wording: "Available Jan–Sep 2028 (DCU INTRA placement)", in full.
const lookingFor = [
  `Available ${LONG[parse(logistics.availableFrom).month - 1]} to ${LONG[parse(logistics.availableUntil).month - 1]} ${parse(logistics.availableUntil).year}${logistics.programme ? ` (${logistics.programme.name})` : ''}.`,
  logistics.relocate.open ? 'Happy to relocate.' : '',
  logistics.workAuthorization.map((a) => `${a.label}.`).join(' '),
]
  .filter(Boolean)
  .join(' ');

const about = [
  ...basics.bio,
  basics.buildNote,
  lookingFor,
  `Portfolio, case studies and CV: ${site}`,
  `Email: ${basics.email}`,
]
  .filter(Boolean)
  .join('\n\n');

const experience = [];
for (const role of resume.work) {
  const positions = [{ title: role.position, start: role.startDate, end: role.endDate }, ...(role.earlier ?? []).map((e) => ({ title: e.position, start: e.startDate, end: e.endDate }))];
  const bullets = lines(role.highlights);
  // Up to four bullets. A role with fewer facts on record uses its summary;
  // nothing is padded out.
  const use = bullets.length >= 2 ? bullets.slice(0, 4) : [role.summary, ...bullets].slice(0, 4);
  experience.push({ role, positions, bullets: use, todo: todos(role.highlights) });
}

const featured = [
  { title: `${basics.name}: portfolio`, url: site, note: 'Selected work, experience and the CV.' },
  { title: `${hubProject.name}: case study`, url: `${site}/work/${hub.slug}/`, note: hubProject.tagline },
  ...resume.projects.filter((p) => p.caseStudy && p.slug !== hub.slug).map((p) => ({ title: `${p.name}: case study`, url: `${site}/work/${p.slug}/`, note: p.tagline })),
  { title: 'CV (PDF, one page)', url: `${site}/${basics.name.replace(/\s+/g, '-')}-CV.pdf`, note: 'Generated from the same data as the site.' },
];

const skills = resume.skills.flatMap((group) => group.keywords);

// ── Limits ───────────────────────────────────────────────────────────────
const problems = [];
if (headline.length > 220) problems.push(`Headline is ${headline.length} characters; LinkedIn allows 220.`);
if (about.length > 2600) problems.push(`About is ${about.length} characters; LinkedIn allows 2,600.`);
for (const e of experience) for (const b of e.bullets) if (b.length > 2000) problems.push(`${e.role.company}: a bullet is over 2,000 characters.`);

// ── Write ────────────────────────────────────────────────────────────────
const md = [];
md.push('# LinkedIn');
md.push('');
md.push('Generated from `content/resume.json` by `npm run linkedin`. Don’t edit this file: change resume.json and run it again, then paste each section into LinkedIn. Lines marked **[Pending approval]** are hidden on the site until the BodyMed owner signs off; leave them off LinkedIn until then too.');
md.push('');
md.push(`## Headline (${headline.length} of 220 characters)`);
md.push('');
md.push('```text');
md.push(headline);
md.push('```');
md.push('');
md.push(`## About (${about.length.toLocaleString('en-IE')} of 2,600 characters)`);
md.push('');
md.push('```text');
md.push(about);
md.push('```');
md.push('');
md.push('## Experience');
md.push('');
md.push('LinkedIn: **Add profile section → Core → Add position**. Where one company has two titles, add the second as another position at the same company, and LinkedIn groups them.');
for (const { role, positions, bullets, todo } of experience) {
  md.push('');
  md.push(`### ${role.company}${role.context ? ` (${role.context})` : ''}`);
  md.push('');
  for (const p of positions) md.push(`- **Title:** ${p.title} · **Dates:** ${range(p.start, p.end)}`);
  md.push(`- **Location:** ${role.location ?? '—'}`);
  if (role.stack?.length) md.push(`- **Skills:** ${role.stack.join(', ')}`);
  md.push('');
  md.push('```text');
  for (const b of bullets) md.push(`• ${b}`);
  md.push('```');
  for (const t of todo) md.push(`\n> Not on LinkedIn yet, as on the site: ${t.replace(/^TODO:?\s*/, '')}`);
}
md.push('');
md.push('## Education');
for (const e of resume.education) {
  md.push('');
  md.push(`### ${e.institution}`);
  md.push('');
  md.push(`- **Degree / qualification:** ${e.area}`);
  md.push(`- **Dates:** ${parse(e.startDate).year} – ${parse(e.endDate).year}${isPast(e.endDate) ? '' : ` (expected ${month(e.endDate)})`}`);
  const notes = e.notes.filter((n) => !isTodo(n));
  if (notes.length) md.push(`- **Grade / activities:** ${notes.join(' ')}`);
}
md.push('');
md.push('## Honors & awards');
for (const a of resume.awards) {
  md.push('');
  md.push(`- **${a.title}** · ${a.awarder} · ${month(a.date)}${a.role ? ` · ${a.role}` : ''}`);
  md.push(`  ${a.summary}`);
}
md.push('');
md.push('## Featured');
md.push('');
md.push('LinkedIn: **Add profile section → Recommended → Add featured → Add a link**, in this order.');
md.push('');
for (const f of featured) md.push(`1. **${f.title}**: ${f.url}  \n   ${f.note}`);
md.push('');
md.push('## Skills');
md.push('');
md.push('Pin the first three as top skills.');
md.push('');
md.push(skills.join(' · '));
md.push('');
md.push('## Contact info');
md.push('');
md.push(`- **Website:** ${site} (type: Portfolio)`);
md.push(`- **Email:** ${basics.email}`);
md.push(`- **Location:** ${basics.location.city}, Ireland`);
md.push('');

writeFileSync(`${root}docs/linkedin.md`, md.join('\n'));
console.log(`docs/linkedin.md: headline ${headline.length}/220, About ${about.length}/2600, ${experience.length} experience entries, ${featured.length} featured links.`);
if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}
