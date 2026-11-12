import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg, type OgCard } from '../../lib/og';
import { project, resume } from '../../lib/resume';
import { hub, hubProject } from '../../lib/hub';

/** One social image per page, built with the site. */
export const getStaticPaths: GetStaticPaths = async () => {
  const { basics } = resume;
  const pages: Record<string, OgCard> = {
    home: { title: basics.headline, description: basics.summary.replace(/\*\*/g, '') },
    about: { title: 'About', description: basics.bio[0] ?? basics.label },
    cv: { title: 'CV', description: 'One page, in HTML and as a PDF, generated from the same data as this site.' },
    colophon: { title: 'Colophon', description: 'How this site is built: type, colour, motion, and the numbers it is held to.' },
  };
  pages[`work-${hub.slug}`] = { kind: 'Case study', title: hubProject.name, description: hubProject.tagline };
  for (const entry of await getCollection('work')) {
    const item = project(entry.id);
    pages[`work-${entry.id}`] = { kind: 'Case study', title: item.name, description: item.tagline };
  }
  return Object.entries(pages).map(([slug, card]) => ({ params: { slug }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOg(props.card as OgCard)), { headers: { 'Content-Type': 'image/png' } });
