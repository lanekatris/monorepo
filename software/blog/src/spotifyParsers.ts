import podcastHistory from './data/spotify-2024/StreamingHistory_podcast_0.json'
import musicHistory from './data/spotify-2024/StreamingHistory_music_0.json'

function d(input: { name: string; msPlayed: number }[]) {
	const groupedPodcasts: Record<string, number> = {}

	input.forEach(({ name, msPlayed }) => {
		if (groupedPodcasts[name]) {
			groupedPodcasts[name] += msPlayed
		} else {
			groupedPodcasts[name] = msPlayed
		}
	})

	// Convert to an array and sort by totalMsPlayed in descending order
	const sortedPodcasts = Object.entries(groupedPodcasts)
		.map(([name, totalMsPlayed]) => ({ name, totalMsPlayed }))
		.sort((a, b) => b.totalMsPlayed - a.totalMsPlayed)

	return sortedPodcasts
}

export function parseStreamingHistory() {
	// most listened to podcasts
	// const groupedPodcasts: Record<string, number> = {}
	//
	// podcastHistory.forEach(({ podcastName, msPlayed }) => {
	// 	if (groupedPodcasts[podcastName]) {
	// 		groupedPodcasts[podcastName] += msPlayed
	// 	} else {
	// 		groupedPodcasts[podcastName] = msPlayed
	// 	}
	// })
	//
	// // Convert to an array and sort by totalMsPlayed in descending order
	// const sortedPodcasts = Object.entries(groupedPodcasts)
	// 	.map(([podcastName, totalMsPlayed]) => ({ podcastName, totalMsPlayed }))
	// 	.sort((a, b) => b.totalMsPlayed - a.totalMsPlayed)
	//
	// const groupedArtists: Record<string, number> = {}
	//
	// musicHistory.forEach(({ artistName, msPlayed }) => {
	// 	if (groupedArtists[artistName]) {
	// 		groupedArtists[artistName] += msPlayed
	// 	} else {
	// 		groupedArtists[artistName] = msPlayed
	// 	}
	// })
	//
	// // Convert to an array and sort by totalMsPlayed in descending order
	// const sortedArtists = Object.entries(groupedArtists)
	// 	.map(([artistName, totalMsPlayed]) => ({ artistName, totalMsPlayed }))
	// 	.sort((a, b) => b.totalMsPlayed - a.totalMsPlayed)

	const idk = d(podcastHistory.map((x) => ({ name: x.podcastName, msPlayed: x.msPlayed })))
	const idk2 = d(musicHistory.map((x) => ({ name: x.artistName, msPlayed: x.msPlayed })))
	const idk3 = d(musicHistory.map((x) => ({ name: x.trackName, msPlayed: x.msPlayed }))).map(
		(x) => ({
			...x,
			more: musicHistory.find((y) => y.trackName === x.name)
		})
	)
	return {
		uniquePodcasts: idk,
		uniqueArtists: idk2,
		uniqueTracks: idk3
	}
}
