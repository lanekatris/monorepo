import { query } from '../db.ts'

export default async function getBookmarkStats() {
	const idk = await query(`select count(*) ::int count
												from models.bookmark`)
	// console.log(idk)

	return {
		count: idk[0]['count']
	}
}
