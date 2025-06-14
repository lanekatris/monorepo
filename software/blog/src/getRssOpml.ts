export async function getRssOpml() {
	const response = await fetch('http://100.99.14.109:8663/v1/export', {
		headers: {
			'X-Auth-Token': import.meta.env.MINIFLUX_API_KEY
		}
	})

	return response.text()
}
