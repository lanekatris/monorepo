export async function getRssOpml() {
	const response = await fetch('http://192.168.86.100:8663/v1/export', {
		headers: {
			'X-Auth-Token': import.meta.env.MINIFLUX_API_KEY
		}
	})

	return response.text()
}
