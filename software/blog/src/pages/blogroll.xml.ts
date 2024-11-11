import { getRssOpml } from '../getRssOpml.ts'

export async function GET() {
	const xml = await getRssOpml()
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
