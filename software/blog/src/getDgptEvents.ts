import * as cheerio from 'cheerio'

// import { DGPT_RESPONSE } from './pages/disc-golf/dgpt-response.ts'

interface DgptEvent {
	id: string
	eventName: string
	winners: string[]
}

const formData = new URLSearchParams()
formData.append('action', 'rk_get_schedule_items')
formData.append('range', 'past')
formData.append('year', '2025')
formData.append('classification', 'all')

export async function getDgptEvents() {
	const response = await fetch('https://www.dgpt.com/wp-admin/admin-ajax.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formData.toString()
	})
	const body = await response.text()
	const $ = cheerio.load(body)

	const dgptEvents: DgptEvent[] = []

	$('.vc-schedule__item').each((_, element) => {
		const eventName = $(element)
			.find('.vc-schedule__item-title')
			.text()
			.replace(/\t/g, '')
			.replace(/\n/g, ' ')
		const players: string[] = []

		$(element)
			.find('.vc-schedule__item--winner')
			.each((_, el2) => {
				players.push($(el2).find('.vc-schedule__item--winner_name').text())
			})

		dgptEvents.push({
			id: eventName,
			eventName,
			winners: players
		})
	})

	return dgptEvents
}
