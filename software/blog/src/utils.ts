import { type TAG_TYPE } from './content.config.ts'
import path from 'path'
import fs from 'fs'

export function isDev() {
	return process.env.NODE_ENV === 'development'
}

export function tagUrl(tag: TAG_TYPE) {
	return `/tags/${tag}`
}

// @ts-ignore
export function convertToCSV(jsonData) {
	if (!jsonData.length) return ''

	const headers = Object.keys(jsonData[0]).join(',') + '\n'
	// @ts-ignore
	const rows = jsonData.map((row) => Object.values(row).join(',')).join('\n')

	return headers + rows
}

export const FILE_URLS = {
	PODCAST_JSON: '/podcasts.json'
}

export type DownloadableFile = 'ticks.json'

// todo: load from directory
// todo: validate the pages as subpages and zod valdiates
export const FILES = [
	{
		type: 'blog_rss',
		filename: 'rss.xml',
		pages: [],
		notes: 'Blog RSS feed for this site'
	},
	{
		type: 'podcast_json',
		filename: 'podcasts.json',
		pages: ['/podroll'],
		notes: 'It is using this Audiobookshelf api: TODO. There is a subarray of the data.'
	},
	{
		type: 'podcast_opml',
		filename: 'podcasts.opml',
		pages: ['/podroll']
	},
	{
		type: 'volleyball-csv',
		filename: '2025-volleyball-data.csv',
		pages: ['/2025-volleyball']
	},
	{
		type: 'volleyball-ics',
		filename: '2025-volleyball.ics',
		pages: ['/2025-volleyball']
	},
	{
		type: 'blogroll-csv',
		filename: 'blogroll.xml',
		pages: ['/blogroll']
	},
	{
		type: 'disc-golf-api',
		filename: 'disc-golf.json',
		pages: ['/disc-golf']
	},
	{
		type: 'dgpt-winners-json',
		filename: 'dgpt-winners.json',
		pages: ['/disc-golf']
	},
	{
		type: 'dgpt-winners-csv',
		filename: 'dgpt-winners.csv',
		pages: ['/disc-golf']
	},
	{
		type: 'feed-json',
		filename: 'feed.json',
		pages: ['/feed']
	},
	{
		type: 'ticks.json',
		filename: 'ticks.json',
		pages: ['/ticks']
	},
	{
		type: 'courses.json',
		filename: 'courses.json',
		pages: ['/disc-golf'],
		notes: `Updated on 2025-05-18. 7,474 unique courses vs 8,085 mentioned on the website. Took 4.43 minutes to generate.`
	},
	{
		type: 'courses.csv',
		filename: 'courses.csv',
		pages: ['/disc-golf'],
		notes: `Updated on 2025-05-18. 7,474 unique courses vs 8,085 mentioned on the website. Took 4.43 minutes to generate.`
	}
]

export function getFileDownloadPath(fileName: string) {
	return `/${fileName}`
}

export function createADownloadableJsonFile(fileName: DownloadableFile, data: any) {
	fs.writeFileSync(path.join('public', fileName), JSON.stringify(data, null, 2))
}
