import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createCssVariablesTheme } from 'shiki/core';

// Code excerpts are coloured from the site's own tokens (see .astro-code in
// global.css), so they follow light and dark like everything else.
const codeTheme = createCssVariablesTheme({ name: 'tokens', variablePrefix: '--code-', fontStyle: false });

// Fully static output. `site` is the canonical origin; change it here when the
// custom domain is live. `format: 'directory'` keeps /links/index.html, the
// path printed on the business-card QR code.
export default defineConfig({
  site: 'https://cianmccaul.vercel.app',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/links/') && !page.includes('/directions/') })],
  markdown: { shikiConfig: { theme: codeTheme, wrap: false } },
  vite: { plugins: [tailwindcss()] },
});
