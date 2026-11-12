/**
 * The BodyMed Hub case study's content, read from content/hub.json and
 * checked at build time. Facts shared with the rest of the site (name, links,
 * live date) still come from the project entry in resume.json.
 */
import { z } from 'astro/zod';
import data from '../../content/hub.json';
import { project } from './resume';

const approval = z.enum(['bodymedMetrics']);
const step = z.object({
  title: z.string(),
  detail: z.string(),
  exit: z.object({ when: z.string(), then: z.string() }).optional(),
});

const schema = z.object({
  slug: z.string(),
  description: z.string(),
  /** Sign-off still needed before launch. Shown in draft builds only. */
  approvalTodo: z.string().optional(),
  hero: z.object({ image: z.string(), alt: z.string(), caption: z.string() }),
  stats: z.array(z.object({ value: z.string(), unit: z.string() })).length(3),
  smallStats: z.array(z.string()),
  replaced: z.object({
    lede: z.string(),
    rows: z.array(z.object({ before: z.string(), after: z.string() })),
    pending: z.object({ approval, text: z.string(), todo: z.string() }).optional(),
  }),
  modules: z.object({
    lede: z.string(),
    groups: z.array(
      z.object({
        name: z.string(),
        modules: z.array(z.object({ name: z.string(), status: z.enum(['live', 'built']), line: z.string() })),
      }),
    ),
  }),
  tour: z.object({
    lede: z.string(),
    note: z.string(),
    stops: z.array(z.object({ image: z.string(), title: z.string(), caption: z.string(), alt: z.string() })),
  }),
  architecture: z.object({
    lede: z.string(),
    people: z.array(z.string()),
    hub: z.object({ name: z.string(), stack: z.string(), host: z.string() }),
    services: z.array(z.object({ name: z.string(), role: z.string() })),
    jobs: z.array(z.object({ when: z.string(), what: z.array(z.string()) })),
  }),
  timeline: z.object({
    lede: z.string(),
    start: z.string(),
    events: z.array(
      z.object({ date: z.string(), until: z.string().optional(), label: z.string(), milestone: z.boolean().optional() }),
    ),
  }),
  dives: z.object({
    lede: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        problem: z.string(),
        options: z.array(z.string()).optional(),
        chose: z.string(),
        tradeoff: z.string(),
        rules: z.array(z.object({ term: z.string(), value: z.string() })).optional(),
        pipeline: z.object({ caption: z.string(), steps: z.array(step) }).optional(),
      }),
    ),
  }),
  built: z.object({ statement: z.string(), detail: z.string() }),
  results: z.object({
    lines: z.array(z.string()),
    pending: z.object({ approval, intro: z.string(), lines: z.array(z.string()) }).optional(),
    next: z.string(),
    todo: z.string().optional(),
  }),
  reflection: z.array(z.string()),
  reflectionTodo: z.string().optional(),
});

export const hub = schema.parse(data);
export const hubProject = project(hub.slug);

const all = hub.modules.groups.flatMap((group) => group.modules);
export const moduleCount = { all: all.length, live: all.filter((m) => m.status === 'live').length };
/** How many scheduled jobs the diagram lists. It has to agree with the headline stat. */
export const jobCount = hub.architecture.jobs.reduce((n, job) => n + job.what.length, 0);
