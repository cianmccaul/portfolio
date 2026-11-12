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

/**
 * Sign-offs still needed before some facts can be published. Each switch is
 * false until the person concerned has approved; anything tagged with that
 * switch is marked "pending approval" in draft builds and left out of
 * production and the PDF until it is true.
 */
const approvals = z.object({ bodymedMetrics: z.boolean() });
const approvalKey = approvals.keyof();

/**
 * A line of text on the site or CV. A plain string, or an object when it
 * needs approval, has a shorter CV form, or has a fallback to show while its
 * approval is pending.
 */
const line = z.union([
  z.string(),
  z.object({
    text: z.string(),
    approval: approvalKey.optional(),
    /** Shown instead while approval is pending. */
    fallback: z.string().optional(),
    /** A shorter form for the CV, or false to leave it off the CV. */
    cv: z.union([z.string(), z.literal(false)]).optional(),
  }),
]);

const schema = z.object({
  approvals,
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
    /** One line on how the work gets built, for the About page. */
    buildNote: z.string().optional(),
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
      /** Needs this sign-off before it is published. */
      approval: approvalKey.optional(),
      /** Takes the first places in the proof strip once it can be shown. */
      lead: z.boolean().optional(),
      value: z.string(),
      unit: z.string().optional(),
      label: z.string(),
      note: z.string().optional(),
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
      /** Earlier positions at the same employer, newest first. */
      earlier: z.array(z.object({ position: z.string(), startDate: partialDate, endDate: partialDate })).optional(),
      context: z.string().optional(),
      summary: z.string(),
      /** A shorter form, for the CV, where related roles share one entry. */
      brief: z.string().optional(),
      highlights: z.array(line),
      /** Numbers behind the highlights. `approx` marks an estimate, not a measured figure. */
      metrics: z
        .array(z.object({ label: z.string(), value: z.string(), approx: z.boolean().optional(), note: z.string().optional() }))
        .optional(),
      stack: z.array(z.string()),
      caseStudy: z.string().optional(),
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
      outcome: line.optional(),
      fact: z.string().optional(),
      // Factual bullets for the CV.
      highlights: z.array(line).optional(),
      role: z.string().optional(),
      client: z.string().optional(),
      liveSince: partialDate.optional(),
      stack: z.array(z.string()).min(1),
      // Always the exact repository, never the GitHub profile.
      repo: url.regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, 'Link the exact repository'),
      demo: url.optional(),
      /** One line under the links, e.g. that a demo is safe to try. */
      demoNote: z.string().optional(),
      live: url.optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      imageCaption: z.string().optional(),
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

  awards: z.array(
    z.object({ title: z.string(), awarder: z.string(), date: partialDate, role: z.string().optional(), summary: z.string() }),
  ),
  skills: z.array(z.object({ name: z.string(), keywords: z.array(z.string()).min(1) })),
  interests: z.array(z.object({ name: z.string(), summary: z.string(), featured: z.boolean().optional() })),
  testimonials: z.array(
    z.object({ quote: z.string(), name: z.string(), role: z.string(), company: z.string(), permission: z.literal(true) }),
  ),
});

export type Resume = z.infer<typeof schema>;
export type Project = Resume['projects'][number];
export type Metric = Resume['metrics'][number];
export type Role = Resume['work'][number];
export type Line = z.infer<typeof line>;
export type Approval = z.infer<typeof approvalKey>;

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
  : process.env.VERCEL_ENV !== 'production';

/** Strips the "TODO:" prefix for display inside a TODO marker. */
export const todoText = (text: string): string => text.replace(/^\s*TODO:?\s*/, '');

/* ── Approvals ──────────────────────────────────────────────────────────── */

export const isApproved = (key: Approval | undefined): boolean => !key || resume.approvals[key];

/** A line ready to render. `pending` lines only exist in draft builds. */
export interface Shown {
  text: string;
  pending: boolean;
}

/**
 * Resolves lines for display on the site or the CV. TODOs are left out (they
 * have their own marker), unapproved lines are swapped for their fallback in
 * production, and in draft builds they are also returned with pending: true
 * so reviewers can see them.
 */
export function shown(items: readonly Line[] | undefined, where: 'site' | 'cv' = 'site'): Shown[] {
  const out: Shown[] = [];
  for (const item of items ?? []) {
    if (typeof item === 'string') {
      if (!isTodo(item)) out.push({ text: item, pending: false });
      continue;
    }
    if (where === 'cv' && item.cv === false) continue;
    const text = where === 'cv' && typeof item.cv === 'string' ? item.cv : item.text;
    if (isApproved(item.approval)) {
      out.push({ text, pending: false });
      continue;
    }
    if (item.fallback) out.push({ text: item.fallback, pending: false });
    if (showTodos) out.push({ text, pending: true });
  }
  return out;
}

/** The TODO strings in a list of lines. */
export const todos = (items: readonly Line[] | undefined): string[] =>
  (items ?? []).filter((item): item is string => typeof item === 'string' && isTodo(item));

/** A role's whole span at one employer, from the earliest position it lists. */
export const roleSpan = (role: Role): { startDate: string; endDate: string | null | undefined } => ({
  startDate: [role.startDate, ...(role.earlier ?? []).map((e) => e.startDate)].sort()[0]!,
  endDate: role.endDate,
});

/** Metrics that may be published now. */
export const publishedMetrics = (): Metric[] =>
  resume.metrics.filter((m) => m.status === 'ready' && isApproved(m.approval));

/** Metrics waiting for a sign-off: listed in draft builds only. */
export const pendingMetrics = (): Metric[] =>
  showTodos ? resume.metrics.filter((m) => m.status === 'ready' && !isApproved(m.approval)) : [];

/* ── Derived views ──────────────────────────────────────────────────────── */

export const profile = (network: string) => resume.basics.profiles.find((p) => p.network === network);
export const project = (slug: string): Project => {
  const found = resume.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`No project "${slug}" in resume.json`);
  return found;
};
export const currentDegree = resume.education.find((e) => e.durationYears);
