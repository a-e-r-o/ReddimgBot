export type RedditRes = {
	kind: string
	data: {
		modmash: string
		dist: number
		children: RedditPost[]
	}
}

export type RedditPost = {
	kind: string
	data: {
		title: string
		url: string
		permalink: string
		id: string
	}
}

export type Config = {
	token: string
	sendInterval: number
	fetchInterval: number
	fetchSize: number
	histSize: number
	topics: TopicConfig[]
	deleteReactCharCodes: number[]
}

export function checkConfig(value: Config): boolean {
	return (
		typeof value.token == 'string' &&
		typeof value.sendInterval == 'number' &&
		typeof value.fetchInterval == 'number' &&
		typeof value.fetchSize == 'number' &&
		typeof value.histSize == 'number' &&
		value.deleteReactCharCodes.length > 0 &&
		value.topics != undefined
	)
}

export type Hist = {
	id: string
	posts: string[]
}

export type TopicConfig = {
	subreddit: string
	fetchSize?: number
	fetchInterval?: number
	channels: ChannelConfig[]
}

export type ChannelConfig = {
	id: string
	sendInterval?: number
	histSize?: number
	deleteReactCharCodes?: number[]
}