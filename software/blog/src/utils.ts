import { type TAG_TYPE } from './content.config.ts'

export function isDev() {
	return process.env.NODE_ENV === 'development'
}

export function tagUrl(tag: TAG_TYPE) {
	return `/tags/${tag}`
}
