import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createCssVariablesTheme } from 'shiki/core';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Code excerpts are coloured from the site's own tokens (see .astro-code in
// global.css), so they follow light and dark like everything else.
const codeTheme = createCssVariablesTheme({ name: 'tokens', variablePrefix: '--code-', fontStyle: false });

// Photos behind an approval switch in content/resume.json. While a switch is
// off, its photo's module resolves to an empty one, so the image is never part
// of the build: not optimised, not copied, not referenced. Import it as
// `virtual:approved-photo/<name>`; the default export is the image or undefined.
const approvals = JSON.parse(readFileSync(new URL('./content/resume.json', import.meta.url), 'utf8')).approvals ?? {};
const gatedPhotos = { awards: { approval: 'awardsPhoto', file: './src/assets/photos/bodymed-awards.jpg' } };
function approvedPhotos() {
  const prefix = 'virtual:approved-photo/';
  return {
    name: 'approved-photos',
    enforce: 'pre',
    resolveId(id) {
      if (!id.startsWith(prefix)) return null;
      const photo = gatedPhotos[id.slice(prefix.length)];
      if (!photo) throw new Error(`Unknown gated photo "${id}"`);
      return approvals[photo.approval] ? fileURLToPath(new URL(photo.file, import.meta.url)) : `\0${id}`;
    },
    load(id) {
      return id.startsWith(`\0${prefix}`) ? 'export default undefined;' : null;
    },
  };
}

// Fully static output. `site` is the canonical origin; change it here when the
// custom domain is live. `format: 'directory'` keeps /links/index.html, the
// path printed on the business-card QR code.
export default defineConfig({
  site: 'https://cianmccaul.vercel.app',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/links/') })],
  markdown: { shikiConfig: { theme: codeTheme, wrap: false } },
  vite: { plugins: [approvedPhotos(), tailwindcss()] },
});
