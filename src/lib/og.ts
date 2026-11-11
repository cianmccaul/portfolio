/**
 * Open Graph images, drawn at build time with Satori and rasterised with
 * sharp. Satori can't read WOFF2 or OKLCH, so this uses static Inter WOFFs
 * (a build-only dependency) and the hex equivalents of the light tokens.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { monogramPath } from './monogram';
import { resume } from './resume';

const require = createRequire(import.meta.url);
const font = (weight: 400 | 600) =>
  readFile(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));

const color = { canvas: '#fbfcfd', ink: '#13161a', muted: '#51565b', line: '#dee2e5', accent: '#10777c' };

const mark = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="7" fill="${color.accent}"/><path d="${monogramPath}" fill="#fff"/></svg>`,
).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...props },
});

export interface OgCard {
  /** Small line above the title, e.g. "Case study". */
  kind?: string;
  title: string;
  description: string;
}

export async function renderOg(card: OgCard): Promise<Buffer> {
  const { basics } = resume;
  // Satori sizes boxes content-box, so the padding sits on an inner frame.
  const frame = el(
    'div',
    { flex: 1, flexDirection: 'column', justifyContent: 'space-between', margin: 72 },
    [
      el('div', { alignItems: 'center', gap: 20 }, [
        el('img', { width: 56, height: 56 }, undefined, { src: mark, width: 56, height: 56 }),
        el('div', { fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }, basics.name),
        el('div', { fontSize: 30, color: color.muted }, basics.label),
      ]),
      el('div', { flexDirection: 'column', gap: 20 }, [
        card.kind ? el('div', { fontSize: 30, color: color.muted }, card.kind) : null,
        el(
          'div',
          {
            fontSize: card.title.length > 28 ? 84 : 104,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            maxWidth: 1000,
          },
          card.title,
        ),
        el('div', { fontSize: 32, lineHeight: 1.4, color: color.muted, maxWidth: 940 }, card.description),
      ]),
      el(
        'div',
        { width: '100%', justifyContent: 'space-between', borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: color.line, paddingTop: 28, fontSize: 26, color: color.muted },
        [el('div', {}, new URL(basics.url).host), el('div', {}, `${basics.location.city}, Ireland`)],
      ),
    ],
  );
  const tree = el(
    'div',
    { width: 1200, height: 630, backgroundColor: color.canvas, color: color.ink, fontFamily: 'Inter' },
    frame,
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: await font(400), weight: 400, style: 'normal' },
      { name: 'Inter', data: await font(600), weight: 600, style: 'normal' },
    ],
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** The monogram as a full-bleed square, for touch icons. */
export const iconPng = (size: number): Promise<Buffer> =>
  sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="${color.accent}"/><path d="${monogramPath}" fill="#fff"/></svg>`,
    ),
    { density: 72 * (size / 24) },
  )
    .resize(size, size)
    .png()
    .toBuffer();
