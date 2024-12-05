import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { neon } from '@neondatabase/serverless'

export const obsidianType = z.enum(['adventure'])

const blog = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: 'src/content/blog'
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.string().array().optional(),
		obsidianLink: z.string().optional(),
		obsidianType: obsidianType.optional()
	})
})

const discGolfCourses = defineCollection({
	loader: file('src/data/courses.json'),
	schema: z.object({
		yearEstablished: z.number(),
		name: z.string()
	})
})

export const sql = neon(import.meta.env.DATABASE_URL)
const discs = defineCollection({
	loader: async () => {
		const response = await sql`select * from noco.disc order by number desc`
		const idk = response as { number: string }[]
		const f = idk.map((x) => ({
			...x,
			ID: x.number.toString(),
			id: x.number.toString()
		}))

		return f
	},
	schema: z.object({
		id: z.string(),
		status: z.string().optional().nullable(),
		brand: z.string().optional().nullable(),
		model: z.string().optional().nullable(),
		color: z.string().optional().nullable()
	})
})

const ticks = defineCollection({
	loader: async () => {
		const response = await sql`select * from kestra.ticks order by "Date" desc`
		return response.map((x) => ({
			...x,
			id: x['id'].toString()
		}))
	},
	schema: z.object({
		Date: z.date(),
		Route: z.string().optional().nullable(),
		Rating: z.string().optional().nullable(),
		Notes: z.string().optional().nullable(),
		url: z.string().optional().nullable(),
		Pitches: z.string().optional().nullable(),
		Location: z.string().optional().nullable(),
		'Avg Stars': z.string().optional().nullable(),
		'Your Stars': z.string().optional().nullable(),
		Style: z.string().optional().nullable(),
		'Lead Style': z.string().optional().nullable(),
		'Route Type': z.string().optional().nullable(),
		'Your Rating': z.string().optional().nullable(),
		Length: z.string().optional().nullable(),
		'Rating Code': z.string().optional().nullable(),
		id: z.string()
	})
})

export const collections = { blog, discGolfCourses, discs, ticks }
