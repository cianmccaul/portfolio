import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Case studies. Each file in content/work/ is named after a project slug in
 * resume.json, which supplies the title, stack and links. The file holds what
 * only a case study needs: the three-line summary and the write-up itself.
 */
const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './content/work' }),
  schema: z.object({
    /** Order on the site and in "next case study". */
    order: z.number(),
    description: z.string(),
    tldr: z.object({
      problem: z.string(),
      approach: z.string(),
      result: z.string(),
      /** What the result line is still missing. Shown in draft builds only. */
      resultTodo: z.string().optional(),
    }),
    team: z.string(),
    timeline: z.string().optional(),
    timelineTodo: z.string().optional(),
    /** Sign-off still needed before launch. Shown in draft builds only. */
    approvalTodo: z.string().optional(),
  }),
});

export const collections = { work };
