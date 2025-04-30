export interface AudiobookshelfResponse {
	total: number
	numPages: number
	page: number
	itemsPerPage: number
	sessions: Session[]
	userId: string
}

export interface Session {
	id: string
	userId: string
	libraryId: string
	libraryItemId: string
	bookId: null | string
	episodeId: null | string
	mediaType: MediaType
	mediaMetadata: MediaMetadata
	chapters: any[]
	displayTitle: string
	displayAuthor: string
	coverPath: string
	duration: number
	playMethod: number
	mediaPlayer: MediaPlayer
	deviceInfo: DeviceInfo
	serverVersion: ServerVersion
	date: Date
	dayOfWeek: DayOfWeek
	timeListening: number
	startTime: number
	currentTime: number
	startedAt: number
	updatedAt: number
}

export enum DayOfWeek {
	Friday = 'Friday',
	Monday = 'Monday',
	Saturday = 'Saturday',
	Sunday = 'Sunday',
	Thursday = 'Thursday',
	Tuesday = 'Tuesday',
	Wednesday = 'Wednesday'
}

export interface DeviceInfo {
	id: string
	userId: string
	deviceId: DeviceID
	ipAddress: IPAddress
	clientVersion: ClientVersion
	manufacturer?: Manufacturer
	model?: Model
	sdkVersion?: string
	clientName: ClientName
	deviceName: DeviceName
	browserName?: BrowserName
	browserVersion?: BrowserVersion
	osName?: OSName
	osVersion?: OSVersion
}

export enum BrowserName {
	Chrome = 'Chrome'
}

export enum BrowserVersion {
	The135000 = '135.0.0.0'
}

export enum ClientName {
	AbsAndroid = 'Abs Android',
	AbsWeb = 'Abs Web'
}

export enum ClientVersion {
	The0981Beta = '0.9.81-beta',
	The2200 = '2.20.0'
}

export enum DeviceID {
	The31YZovUF3VGqQMGU2WKc = '31y-zovUF3vGqQMGU2wKc',
	The3Dbb94Cb7A181C36 = '3dbb94cb7a181c36'
}

export enum DeviceName {
	GooglePixel6Pro = 'Google Pixel 6 Pro',
	LinuxX8664Chrome = 'Linux x86_64 Chrome'
}

export enum IPAddress {
	Ffff100867824 = '::ffff:100.86.78.24',
	Ffff1921688632 = '::ffff:192.168.86.32'
}

export enum Manufacturer {
	Google = 'Google'
}

export enum Model {
	Pixel6Pro = 'Pixel 6 Pro'
}

export enum OSName {
	Linux = 'Linux'
}

export enum OSVersion {
	X8664 = 'x86_64'
}

export interface MediaMetadata {
	title: string
	subtitle?: null
	authors?: Author[]
	narrators?: any[]
	series?: any[]
	genres: string[]
	publishedYear?: string
	publishedDate?: null
	publisher?: null
	description: string
	isbn?: null
	asin?: null
	language: Language | null
	explicit: boolean
	abridged?: boolean
	author?: string
	releaseDate?: Date
	feedUrl?: string
	imageUrl?: string
	itunesPageUrl?: string
	itunesId?: null
	itunesArtistId?: null | string
	type?: Type | null
}

export interface Author {
	id: string
	name: string
}

export enum Language {
	Empty = '',
	En = 'en',
	EnUS = 'en-US',
	EnUs = 'en-us'
}

export enum Type {
	Episodic = 'episodic'
}

export enum MediaPlayer {
	ExoPlayer = 'exo-player',
	Html5 = 'html5'
}

export enum MediaType {
	Book = 'book',
	Podcast = 'podcast'
}

export enum ServerVersion {
	The2195 = '2.19.5',
	The2200 = '2.20.0'
}
