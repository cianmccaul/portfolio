import type { APIRoute } from 'astro';
import { resume } from '../lib/resume';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: resume.basics.name,
      short_name: resume.basics.name.split(' ')[0],
      description: resume.basics.label,
      start_url: '/',
      display: 'browser',
      background_color: '#fbfcfd',
      theme_color: '#10777c',
      icons: [192, 512].map((size) => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
