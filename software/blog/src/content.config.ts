import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { neon } from '@neondatabase/serverless'
import { feedLoader } from '@ascorbic/feed-loader'
import type { AudiobookshelfResponse, Session } from './audiobookshelf-types'

export const obsidianType = z.enum(['adventure'])

const tags = z.enum([
	'goal',
	'project',
	'disc-golf',
	'sql',
	'climb',
	'truck',
	'rpi',
	'dad',
	'adventure',
	'iot',
	'hardware',
	'notebook',
	'edc',
	'music',
	'spotify',
	'homelab',
	'volleyball',
	'movie',
	'lego',
	'website',
	'data',
	'audiobookshelf',
	'obsidian'
])

export type TAG_TYPE = z.infer<typeof tags>
const blog = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: 'src/content/blog'
	}),
	schema: z
		.object({
			title: z.string(),
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.string().optional(),
			tags: tags.array().optional(),
			obsidianLink: z.string().optional(),
			obsidianType: obsidianType.optional(),
			draft: z.boolean().optional(),
			slug: z.string().optional()
		})
		.strict()
})

const page = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: 'src/content/pages'
	}),
	schema: z
		.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			tags: tags.array().optional()
			// relatedPages: z.array(reference('page')).optional()
		})
		.strict()
})

const discGolfCourses = defineCollection({
	loader: file('public/courses.json'),
	schema: z.object({
		yearEstablished: z.number(),
		name: z.string()
	})
})

export const sql = neon(import.meta.env.DATABASE_URL)
const discs = defineCollection({
	loader: async () => {
		const response = await sql`select *
															 from noco.disc
															 order by number desc`
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
		color: z.string().optional().nullable(),
		notes: z.string().optional().nullable()
	})
})

const scorecardZod = z.object({
	coursename: z.string(),
	'+/-': z.number(),
	startdate: z.coerce.date(),
	new_course: z.boolean(),
	layoutname: z.string(),
	total: z.number(),
	streak: z.boolean(),
	roundrating: z.number().optional().nullable()
})
export type Scorecard = z.infer<typeof scorecardZod>

const discZod = z.object({
	brand: z.string(),
	color: z.string().optional().nullable(),
	model: z.string().optional().nullable(),
	plastic: z.string().optional().nullable(),
	number: z.number(),
	weight: z.number().optional().nullable(),
	price: z.number().optional().nullable()
})

const FEED = z.object({
	id: z.string(),
	type: z.enum(['scorecard', 'disc', 'adventure', 'podcast-completed', 'memo', 'lost-disc']),
	date: z.date(),
	data: z.object({
		scorecard: scorecardZod.optional(),
		memo: z.object({ html: z.string() }).optional(),
		disc: discZod.optional(),
		lostDisc: discZod.optional(),
		adventure: z
			.object({
				adventure_type: z.string()
			})
			.optional(),
		podcast: z
			.object({
				displayTitle: z.string(),
				displayAuthor: z.string()
			})
			.optional()
	})
})

export type FEED_TYPE = z.infer<typeof FEED>

const feed = defineCollection({
	loader: async () => {
		const response = await sql`select *
															 from models.feed
															 order by date desc`
		const idk = response as FEED_TYPE[]

		const sessionsResponse = await fetch(
			'http://server1.local:13378/api/sessions?itemsPerPage=10000&user=7e4b6e43-1722-4bb0-adde-9a572f945388',
			{
				headers: {
					Authorization: import.meta.env.AUDIOBOOKSHELF_KEY
				}
			}
		)
		console.log('sessions response', sessionsResponse.ok)
		const sessionsData: AudiobookshelfResponse = await sessionsResponse.json()

		const sessions = sessionsData.sessions.reduce((map, session) => {
			if (session.mediaType === 'book') return map

			if (!map.has(session.displayTitle)) {
				map.set(session.displayTitle, session)
			}
			return map
		}, new Map<string, Session>())

		const sessionsAsFeed: FEED_TYPE[] = Array.from(sessions.values()).map((session) => ({
			id: session.libraryItemId,
			type: 'podcast-completed',
			date: new Date(session.date),
			data: {
				podcast: {
					displayTitle: session.displayTitle,
					displayAuthor: session.displayAuthor
				}
			}
		}))

		console.log(idk[0], sessionsAsFeed[0])

		const all = [...idk, ...sessionsAsFeed]
		// no point, doesn't work
		// all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		return all
	},
	schema: FEED
})

const ticks = defineCollection({
	loader: async () => {
		const response = await sql`select *
															 from kestra.ticks
															 order by "Date" desc`
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

const memos = defineCollection({
	loader: feedLoader({
		url: 'https://memo.lkat.io/u/Lane/rss.xml'
	})
})

export const collections = { blog, discGolfCourses, discs, ticks, page, feed, memos }
