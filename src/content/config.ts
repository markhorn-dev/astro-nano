import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional()
  }),
});


const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    statusRating: z.union([
      z.undefined(),
      z.literal('in-progress'),
      z.literal('on-hold'),
      z.literal('completed'),
      z.literal('delayed'),
      z.literal('upcoming'),
      z.literal('cancelled'),
      z.literal('under-review'),
      z.literal('needs-attention'),
      z.literal('awaiting-feedback'),
      z.literal('testing-phase'),
      z.literal('polishing'),
    ]),
    timeInvestmentRating: z.union([z.literal("low"), z.literal("medium"), z.literal("high")]),
    necessityRating: z.union([z.literal("low"), z.literal("medium"), z.literal("high")]),
    categories: z.array(z.union([
      z.literal('Gardening'),
      z.literal('Cooking & Baking'),
      z.literal('Software'),
      z.literal('Data Analysis and Machine Learning'),
      z.literal('Hardware & Repairs'),
    ]))
  }),
});

export const collections = { blog, work, projects };
