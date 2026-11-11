/**
 * The single source of truth. Every fact on the site is read from
 * content/resume.json through this module, which validates it at build time:
 * a typo in a date or a missing link fails the build instead of shipping.
 */
import { z } from 'astro/zod';
import raw from '../../content/resume.json';

const partialDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD');
const url = z.url();
const step = z.object({ title: z.string(), detail: z.string() });

const schema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string(),
    headline: z.string(),
    summary: z.string(),
    email: z.email(),
    url,
    location: z.object({ city: z.string(), area: z.string().optional(), country: z.string().length(2) }),
    profiles: z.array(z.object({ network: z.string(), username: z.string(), url })),
    bio: z.array(z.string()),
  }),

  logistics: z.object({
    targetRole: z.string(),
    programme: z.object({ name: z.string(), startDate: partialDate, endDate: partialDate }).optional(),
    availableFrom: partialDate,
    availableUntil: partialDate.nullish(),
    relocate: z.object({ open: z.boolean(), regions: z.array(z.string()) }),
    workAuthorization: z.array(z.object({ region: z.string(), status: z.string(), label: z.string() })),
  }),

  metrics: z.array(
    z.object({
      id: z.string(),
      status: z.enum(['ready', 'todo']),
      value: z.string(),
      unit: z.string().optional(),
      label: z.string(),
      source: z.object({ label: z.string(), url }).optional(),
      how: z.string().optional(),
    }),
  ),

  work: z.array(
    z.object({
      company: z.string(),
      location: z.string().optional(),
      position: z.string(),
      startDate: partialDate,
      endDate: partialDate.nullish(),
      context: z.string().optional(),
      summary: z.string(),
      highlights: z.array(z.string()),
      stack: z.array(z.string()),
      caseStudy: z.string().optional(),
      approvedForPublic: z.boolean().optional(),
    }),
  ),

  suites: z.array(z.object({ id: z.string(), name: z.string(), summary: z.string() })),

  projects: z.array(
    z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/),
      name: z.string(),
      suite: z.string().optional(),
      featured: z.boolean(),
      caseStudy: z.boolean(),
      tagline: z.string(),
      description: z.string(),
      outcome: z.string().optional(),
      fact: z.string().optional(),
      // Factual bullets for the CV and case-study header.
      highlights: z.array(z.string()).optional(),
      role: z.string().optional(),
      client: z.string().optional(),
      liveSince: partialDate.optional(),
      stack: z.array(z.string()).min(1),
      // Always the exact repository, never the GitHub profile.
      repo: url.regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, 'Link the exact repository'),
      demo: url.optional(),
      live: url.optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      flow: z.array(step).optional(),
      failure: z.string().optional(),
      modules: z.array(step).optional(),
      guardRails: z.array(step).optional(),
    }),
  ),

  education: z.array(
    z.object({
      institution: z.string(),
      shortName: z.string().optional(),
      area: z.string(),
      startDate: partialDate,
      endDate: partialDate,
      durationYears: z.number().int().positive().optional(),
      notes: z.array(z.string()),
    }),
  ),

  awards: z.array(z.object({ title: z.string(), awarder: z.string(), date: partialDate, summary: z.string() })),
  skills: z.array(z.object({ name: z.string(), keywords: z.array(z.string()).min(1) })),
  interests: z.array(z.object({ name: z.string(), summary: z.string(), featured: z.boolean().optional() })),
  testimonials: z.array(
    z.object({ quote: z.string(), name: z.string(), role: z.string(), company: z.string(), permission: z.literal(true) }),
  ),
});

export type Resume = z.infer<typeof schema>;
export type Project = Resume['projects'][number];
export type Metric = Resume['metrics'][number];

export const resume: Resume = schema.parse(raw);

/* ── TODOs ──────────────────────────────────────────────────────────────── */

/** Content that hasn't been written yet is marked with a leading "TODO". */
export const isTodo = (text: string | undefined | null): boolean => !!text && text.trimStart().startsWith('TODO');

/**
 * Draft builds show every TODO, clearly marked, so nothing missing is hidden
 * from review. The production deployment never shows one: the section or line
 * is left out until the real content exists. Set SHOW_TODOS=false to preview
 * exactly what production will render.
 */
export const showTodos: boolean = process.env.SHOW_TODOS
  ? process.env.SHOW_TODOS !== 'false'
  : process.env.VERCEL_ENV !== 'production' && process.env.CF_PAGES_BRANCH !== 'main';

/** Strips the "TODO:" prefix for display inside a TODO marker. */
export const todoText = (text: string): string => text.replace(/^\s*TODO:?\s*/, '');

/* ── Derived views ──────────────────────────────────────────────────────── */

export const profile = (network: string) => resume.basics.profiles.find((p) => p.network === network);
export const project = (slug: string): Project => {
  const found = resume.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`No project "${slug}" in resume.json`);
  return found;
};
export const currentDegree = resume.education.find((e) => e.durationYears);
