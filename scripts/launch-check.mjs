// The launch gate. Builds the site exactly as production does (TODOs and
// unapproved content left out) into a temporary folder, then fails if
// anything a visitor or a search engine would see isn't ready:
//
//   - TODO or "Pending approval" text (or their markers) on any page
//   - an internal link, image, script or anchor that doesn't resolve
//   - the CV PDF not exactly one page of extractable text, or with a TODO
//   - JSON-LD that doesn't parse or is missing what its type needs
//   - a page without a title, description, canonical URL or social image
//   - an image without alt text, a labelled SVG without a title, a video
//     without a label
//   - old names that must not come back, an approval switched on while part
//     of what it publishes still waits for a check, and a photo whose
//     approval is off turning up in the build
//
// Approval switches that are off are listed as warnings: they keep things
// out of production on purpose, so they don't fail the check.
//
//   npm run launch-check
//
// It changes nothing in the repository. Exit code 1 means "not ready".
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const resume = JSON.parse(read('content/resume.json'));
const hub = JSON.parse(read('content/hub.json'));
const vercel = JSON.parse(read('vercel.json'));
const site = /site:\s*'([^']+)'/.exec(read('astro.config.mjs'))[1].replace(/\/$/, '');

// What each approval switch holds back, for the warnings at the end.
const APPROVAL_NOTES = {
  bodymedMetrics: 'The BodyMed launch figures (14.5%, 90%) are left out of the site and the CV.',
  awardsPhoto: 'The BodyMed team photo from the 2026 Irish Healthcare Centre Awards is not built.',
};
// Photos that must not be in the build while their switch is off.
const GATED_PHOTOS = { awardsPhoto: /bodymed-awards/ };

const results = [];
const check = (name, problems) => {
  results.push({ name, problems });
  console.log(`${problems.length ? '✗' : '✓'} ${name}${problems.length ? ` (${problems.length})` : ''}`);
  for (const problem of problems.slice(0, 25)) console.log(`    ${problem}`);
  if (problems.length > 25) console.log(`    … and ${problems.length - 25} more`);
};

// ── Build as production ──────────────────────────────────────────────────
const out = mkdtempSync(join(tmpdir(), 'launch-check-'));
console.log(`Building the production site into ${out} …`);
try {
  execFileSync('npx', ['astro', 'build', '--outDir', out], {
    cwd: root,
    env: { ...process.env, VERCEL_ENV: 'production', SHOW_TODOS: '' },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
} catch {
  console.error('✗ The production build failed.');
  process.exit(1);
}

// ── A small HTML reader ──────────────────────────────────────────────────
const TAG = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
const ATTR = /([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[e.toLowerCase()],
  );
function tags(html) {
  const list = [];
  for (const m of html.matchAll(TAG)) {
    const attrs = {};
    for (const a of m[3].matchAll(ATTR)) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
    list.push({ close: !!m[1], name: m[2].toLowerCase(), attrs, index: m.index, end: m.index + m[0].length });
  }
  return list;
}
const visibleText = (html) =>
  decode(
    html
      .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(TAG, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' '),
  ).replace(/\s+/g, ' ');

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
})(out);
const pages = files.filter((f) => f.endsWith('.html')).map((file) => {
  const html = readFileSync(file, 'utf8');
  const url = '/' + relative(out, file).replace(/index\.html$/, '');
  return { file, url, html, tags: tags(html), text: visibleText(html) };
});
console.log(`${pages.length} pages built.\n`);

// ── 1. Nothing unfinished ────────────────────────────────────────────────
{
  const problems = [];
  for (const page of pages) {
    for (const m of page.text.matchAll(/.{0,40}\b(TODO|Pending approval)\b.{0,40}/gi)) problems.push(`${page.url}: “${m[0].trim()}”`);
    for (const t of page.tags) {
      const cls = ` ${t.attrs.class ?? ''} `;
      if (/ (todo|pending) /.test(cls)) problems.push(`${page.url}: a <${t.name} class="${t.attrs.class}"> marker`);
      for (const key of ['content', 'alt', 'title', 'aria-label']) if (/\bTODO\b/.test(t.attrs[key] ?? '')) problems.push(`${page.url}: TODO in ${key}="${t.attrs[key]}"`);
    }
    for (const m of page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) if (/\bTODO\b/.test(m[1])) problems.push(`${page.url}: TODO in JSON-LD`);
  }
  check('No TODO or pending-approval text reaches production', problems);
}

// ── 2. Internal links resolve ────────────────────────────────────────────
{
  const problems = [];
  const redirects = (vercel.redirects ?? []).map((r) => new RegExp(`^${r.source.replace(/:path\*/, '.*').replace(/:[a-z]+/gi, '[^/]+')}/?$`));
  const idsOf = new Map(pages.map((p) => [p.url, new Set(p.tags.map((t) => t.attrs.id).filter(Boolean))]));
  const resolve = (path) => {
    if (redirects.some((r) => r.test(path))) return { redirect: true };
    const clean = decodeURIComponent(path);
    const candidates = clean.endsWith('/') ? [clean + 'index.html'] : [clean, clean + '/index.html', clean + '.html'];
    for (const c of candidates) if (existsSync(join(out, c)) && statSync(join(out, c)).isFile()) return { page: c.endsWith('index.html') ? c.replace(/index\.html$/, '') : c };
    return null;
  };
  for (const page of pages) {
    const refs = [];
    for (const t of page.tags) {
      if (t.close) continue;
      if (t.name === 'a' && t.attrs.href !== undefined) refs.push(t.attrs.href);
      if (['img', 'script', 'source', 'video'].includes(t.name) && t.attrs.src) refs.push(t.attrs.src);
      if (t.name === 'source' && t.attrs['data-src']) refs.push(t.attrs['data-src']);
      if (t.name === 'link' && t.attrs.href && /icon|manifest|preload|stylesheet/.test(t.attrs.rel ?? '')) refs.push(t.attrs.href);
      for (const set of [t.attrs.srcset]) if (set) for (const part of set.split(',')) refs.push(part.trim().split(/\s+/)[0]);
    }
    for (const ref of refs) {
      if (!ref || /^(mailto:|tel:|data:|javascript:)/.test(ref)) continue;
      let url;
      try {
        url = new URL(ref, site + page.url);
      } catch {
        problems.push(`${page.url}: can't read the link “${ref}”`);
        continue;
      }
      if (url.origin !== new URL(site).origin) continue;
      if (url.pathname === page.url && !url.hash && ref.startsWith('#')) continue;
      const target = resolve(url.pathname);
      if (!target) {
        problems.push(`${page.url}: ${ref} → not found`);
        continue;
      }
      if (url.hash && target.page !== undefined) {
        const id = decodeURIComponent(url.hash.slice(1));
        const ids = idsOf.get(target.page.startsWith('/') ? target.page : '/' + target.page) ?? idsOf.get(url.pathname);
        if (id && ids && !ids.has(id)) problems.push(`${page.url}: ${ref} → no element with id “${id}”`);
      }
    }
  }
  if (!existsSync(join(out, 'links/index.html'))) problems.push('/links/index.html is missing: the QR code on the business card points there.');
  check('Every internal link, image and anchor resolves', [...new Set(problems)]);
}

// ── 3. The CV PDF ────────────────────────────────────────────────────────
{
  const problems = [];
  const name = `${resume.basics.name.replace(/\s+/g, '-')}-CV.pdf`;
  const path = join(out, name);
  if (!existsSync(path)) problems.push(`${name} is not in the build. Run npm run cv.`);
  else {
    const pdf = await getDocument({ data: new Uint8Array(readFileSync(path)) }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) text += (await (await pdf.getPage(i)).getTextContent()).items.map((item) => item.str).join(' ') + ' ';
    if (pdf.numPages !== 1) problems.push(`It is ${pdf.numPages} pages; it must be exactly one.`);
    if (text.replace(/\s+/g, '').length < 1500) problems.push(`Only ${text.replace(/\s+/g, '').length} characters of text could be extracted: it may be an image.`);
    if (!text.includes(resume.basics.name)) problems.push('The name is not in its extractable text.');
    if (/\bTODO\b|Pending approval/i.test(text)) problems.push('It contains TODO or “Pending approval”.');
  }
  check('The CV PDF is one page of extractable text', problems);
}

// ── 4. JSON-LD ───────────────────────────────────────────────────────────
{
  const problems = [];
  const absolute = (v) => typeof v === 'string' && /^https:\/\//.test(v);
  const need = {
    ProfilePage: (d) => d.mainEntity?.['@type'] === 'Person' && d.mainEntity.name && absolute(d.mainEntity.url),
    Person: (d) => d.name && absolute(d.url),
    Article: (d) => d.headline && d.author && absolute(d.url),
    BreadcrumbList: (d) => Array.isArray(d.itemListElement) && d.itemListElement.every((item, i) => item.position === i + 1 && item.name && absolute(item.item)),
  };
  for (const page of pages) {
    for (const m of page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let data;
      try {
        data = JSON.parse(m[1]);
      } catch (e) {
        problems.push(`${page.url}: does not parse (${e.message})`);
        continue;
      }
      if (data['@context'] !== 'https://schema.org') problems.push(`${page.url}: @context is not https://schema.org`);
      const ok = need[data['@type']];
      if (!ok) problems.push(`${page.url}: unexpected @type ${data['@type']}`);
      else if (!ok(data)) problems.push(`${page.url}: ${data['@type']} is missing a required field`);
    }
  }
  check('JSON-LD parses and has what each type needs', problems);
}

// ── 5. Titles, descriptions, canonical URLs, social images ──────────────
{
  const problems = [];
  for (const page of pages) {
    const meta = (key, value) => page.tags.find((t) => t.name === 'meta' && t.attrs[key] === value)?.attrs.content;
    const title = /<title>([\s\S]*?)<\/title>/.exec(page.html)?.[1]?.trim();
    const canonical = page.tags.find((t) => t.name === 'link' && t.attrs.rel === 'canonical')?.attrs.href;
    const image = meta('property', 'og:image');
    if (!title) problems.push(`${page.url}: no <title>`);
    const description = meta('name', 'description');
    if (!description || description.length < 40) problems.push(`${page.url}: no meta description, or one under 40 characters`);
    if (!canonical || !canonical.startsWith(site + '/')) problems.push(`${page.url}: canonical URL missing or not on ${site}`);
    for (const key of ['og:title', 'og:description', 'og:url']) if (!meta('property', key)) problems.push(`${page.url}: no ${key}`);
    if (!image) problems.push(`${page.url}: no og:image`);
    else if (!image.startsWith(site + '/') || !existsSync(join(out, new URL(image).pathname))) problems.push(`${page.url}: og:image ${image} is not built`);
  }
  check('Every page has a title, description, canonical URL and social image', problems);
}

// ── 6. Alt text ──────────────────────────────────────────────────────────
{
  const problems = [];
  for (const page of pages) {
    for (const [i, t] of page.tags.entries()) {
      if (t.close) continue;
      if (t.name === 'img') {
        if (t.attrs.alt === undefined) problems.push(`${page.url}: <img src="${t.attrs.src}"> has no alt attribute`);
        else if (!t.attrs.alt.trim() && t.attrs['aria-hidden'] !== 'true' && t.attrs.role !== 'presentation') problems.push(`${page.url}: <img src="${t.attrs.src}"> has empty alt text but isn't marked decorative`);
      }
      if (t.name === 'svg' && t.attrs.role === 'img') {
        const next = page.tags.slice(i + 1, i + 4).map((n) => n.name);
        if (!next.includes('title') && !t.attrs['aria-label']) problems.push(`${page.url}: an <svg role="img"> has no <title> or aria-label`);
      }
      if (t.name === 'video' && !t.attrs['aria-label'] && !t.attrs.title) problems.push(`${page.url}: a <video> has no aria-label`);
    }
  }
  check('Every image has alt text', problems);
}

// ── 7. Names and switches ────────────────────────────────────────────────
{
  const problems = [];
  // Names retired when the clinic platform became BodyMed Hub. The public
  // demo's repository is still called clinic-platform-demo, which is fine.
  for (const page of pages) {
    if (/\bclinic platform\b/i.test(page.text.replace(/clinic-platform-demo/g, ''))) problems.push(`${page.url}: says “clinic platform”; the project is BodyMed Hub`);
    for (const t of page.tags) if (t.name === 'a' && /\/work\/clinic-platform\b/.test(t.attrs.href ?? '')) problems.push(`${page.url}: links to /work/clinic-platform (redirects; link /work/bodymed-hub/)`);
  }
  // The Hub's three headline numbers must say the same thing everywhere.
  const tests = hub.stats.find((s) => s.unit === 'tests')?.value;
  const routes = hub.stats.find((s) => s.unit === 'API routes')?.value;
  const hubLine = resume.work.flatMap((w) => w.highlights ?? []).map((h) => (typeof h === 'string' ? h : h.text)).find((h) => /API routes/.test(h)) ?? '';
  if (tests && !hubLine.includes(`${tests} tests`)) problems.push(`resume.json's BodyMed line doesn't say ${tests} tests, as hub.json does`);
  if (routes && !hubLine.includes(`${routes} API routes`)) problems.push(`resume.json's BodyMed line doesn't say ${routes} API routes, as hub.json does`);
  // Turning an approval on publishes everything tagged with it at once.
  if (resume.approvals?.bodymedMetrics && hub.replaced?.pending?.todo)
    problems.push(`approvals.bodymedMetrics is on, but hub.json still asks: “${hub.replaced.pending.todo}” Confirm it and remove the todo first.`);
  // A photo behind a switch that is off must not be in the build at all.
  for (const [approval, pattern] of Object.entries(GATED_PHOTOS)) {
    if (resume.approvals?.[approval]) continue;
    const leaked = files.filter((f) => pattern.test(f)).map((f) => relative(out, f));
    if (leaked.length) problems.push(`approvals.${approval} is off, but the build contains ${leaked.slice(0, 3).join(', ')}`);
  }
  check('Retired names, shared figures and approval switches', problems);
}

// ── Pending approvals (warnings, not failures) ───────────────────────────
// Each switch that is off keeps something out of production on purpose.
const pending = Object.entries(resume.approvals ?? {}).filter(([, on]) => !on).map(([key]) => key);
if (pending.length) {
  console.log('');
  for (const key of pending) console.log(`⚠ Pending approval: approvals.${key} is off. ${APPROVAL_NOTES[key] ?? 'What it covers stays out of production.'}`);
}

rmSync(out, { recursive: true, force: true });
const failed = results.filter((r) => r.problems.length);
const waiting = pending.length ? ` (${pending.length} approval${pending.length === 1 ? '' : 's'} pending)` : '';
console.log(failed.length ? `\nNot ready: ${failed.length} of ${results.length} checks failed.` : `\nReady to launch: all ${results.length} checks passed${waiting}.`);
process.exit(failed.length ? 1 : 0);
