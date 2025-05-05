import { type TAG_TYPE } from './content.config.ts'

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

// todo: load from directory
// todo: validate the pages as subpages and zod valdiates
export const FILES = [
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
		type: 'dgpt-winners-json',
		filename: 'dgpt-winners.json',
		pages: ['/disc-golf']
	},
	{
		type: 'dgpt-winners-csv',
		filename: 'dgpt-winners.csv',
		pages: ['/disc-golf']
	}
]

export function getFileDownloadPath(fileName: string) {
	return `/${fileName}`
}
