export interface AudiobookshelfLibraryResponse {
	results: Result[]
	total: number
	limit: number
	page: number
	sortDesc: boolean
	mediaType: MediaType
	minified: boolean
	collapseseries: boolean
	include: string
	offset: number
}

export enum MediaType {
	Podcast = 'podcast'
}

export interface Result {
	id: string
	ino: string
	oldLibraryItemId: null
	libraryId: string
	folderId: string
	path: string
	relPath: string
	isFile: boolean
	mtimeMs: number
	ctimeMs: number
	birthtimeMs: number
	addedAt: number
	updatedAt: number
	isMissing: boolean
	isInvalid: boolean
	mediaType: MediaType
	media: Media
	numFiles: number
	size: number
}

export interface Media {
	id: string
	metadata: Metadata
	coverPath: string
	tags: any[]
	numEpisodes: number
	autoDownloadEpisodes: boolean
	autoDownloadSchedule: AutoDownloadSchedule
	lastEpisodeCheck: number
	maxEpisodesToKeep: number
	maxNewEpisodesToDownload: number
	size: number
}

export enum AutoDownloadSchedule {
	The0 = '0 * * * *',
	The00 = '0 0 * * *'
}

export interface Metadata {
	title: string
	author: string
	description: string
	releaseDate: Date
	genres: string[]
	feedUrl: string
	imageUrl: string
	itunesPageUrl: string
	itunesId: null
	itunesArtistId: null | string
	explicit: boolean
	language: Language
	type: Type | null
	titleIgnorePrefix: string
}

export enum Language {
	Empty = '',
	En = 'en',
	EnUS = 'en-US',
	EnUs = 'en-us'
}

export enum Type {
	Episodic = 'episodic',
	Serial = 'serial'
}
