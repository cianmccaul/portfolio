import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Fully static output. `site` is the canonical origin; change it here when the
// custom domain is live. `format: 'directory'` keeps /links/index.html, the
// path printed on the business-card QR code.
export default defineConfig({
  site: 'https://cianmccaul.vercel.app',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
