import { getCollection } from 'astro:content'
import { type Scorecard, sql } from '../content.config.ts'
import dgptWinners from '../../public/dgpt-winners.json'

export async function GET() {
	const discs = await getCollection('discs') //, (x) => x.data.status === 'In Bag')
	const rounds = (await getCollection('feed')).reduce((acc: Scorecard[], x) => {
		if (x.data.type === 'scorecard' && x.data.data.scorecard) {
			acc.push(x.data.data.scorecard)
		}
		return acc
	}, [])

	const allPosts = await getCollection('blog')
	const sortedPosts = allPosts.sort(
		(a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
	)

	const filteredPosts = sortedPosts.filter((post) => post.data.tags?.includes('disc-golf'))

	const idk = await sql`select count::int
												from models.obsidian_tags
												where tag = 'disc-found'`

	return new Response(
		JSON.stringify(
			{
				name: 'Disc golf service entry api',
				version: '2025.06',
				pdgaNumber: 236863,
				karma: idk[0].count,
				links: [
					{
						name: 'PDGA',
						link: 'https://www.pdga.com/player/236863'
					},
					{
						name: 'Disc golf landing page',
						link: '/disc-golf'
					},
					{
						name: 'Disc golf gear',
						link: '/loadouts'
					},
					{
						name: 'All US disc golf courses',
						link: '/courses.json'
					},

					{
						name: 'All US disc golf courses',
						link: '/courses.csv'
					},
					{
						name: 'Preview your udisc rounds stats',
						link: '/disc-golf/udisc-stat-previewer'
					},
					{
						name: 'Upload udisc rounds to ingest into DB',
						link: 'http://server1:8090/ui/flows/edit/dev/uploadUdiscScorecard'
					},
					{
						name: 'Add disc',
						link: 'https://noco.lkat.io/dashboard/#/nc/p_egch5370h5zwqh/md_6b9re04oo9qvyv'
					},
					{
						name: 'DGPT winners json',
						link: '/dgpt-winners.json'
					},
					...filteredPosts.map((post) => ({
						name: post.data.title,
						tags: ['blog'],
						link: `/blog/${post.id}`
					}))
				],
				discs: discs.map((d) => d.data),
				rounds,
				dgptWinners
			},
			null,
			2
		),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	)
}
