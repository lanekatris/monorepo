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
