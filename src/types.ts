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
	interval: number
	fetchAmount: number
	histSize: number
	topics: topicConfig[]
}

export function checkConfig(value: Config): boolean {
	return (
		typeof value.token == 'string' &&
		typeof value.interval == 'number' &&
		typeof value.fetchAmount == 'number' &&
		typeof value.histSize == 'number' &&
		value.topics != undefined
	)
}

export type Hist = {
	id: string
	posts: string[]
}

export type topicConfig = {
	subreddit: string
	channels: channelConfig[]
}

export type channelConfig = {
	id: string
	interval?: number
	fetchAmount?: number
	histSize?: number
}