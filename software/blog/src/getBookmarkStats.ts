import { sql } from './content.config.ts'

export default async function getBookmarkStats() {
	const idk = await sql`select count(*) ::int count
												from models.bookmark`
	// console.log(idk)

	return {
		count: idk[0]['count']
	}
}
