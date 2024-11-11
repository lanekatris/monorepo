import { defineCollection, z } from 'astro:content'

export const obsidianType = z.enum(['adventure'])

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.string().array().optional(),
		obsidianLink: z.string().optional(),
		obsidianType: obsidianType.optional()
	})
})

export const collections = { blog }
