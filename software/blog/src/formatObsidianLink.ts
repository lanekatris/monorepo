// import z from 'zod'
import { z } from 'astro:content'
import type { obsidianType } from './content/config.ts'

type ObsidianType = z.infer<typeof obsidianType>

export function formatObsidianLink(
	type: ObsidianType | undefined,
	fileName: string | undefined
): string | undefined {
	if (!type || !fileName) return undefined

	if (type === 'adventure') {
		return encodeURI(`obsidian://open?vault=lkat-vault&file=Adventures/${fileName}`)
	}
	return undefined
}
