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
	subreddit: string
	interval: number
	fetchAmount: number
	replaceWord: string
	triggerWord: string
	histSize: number
	channels: string[]
}
export function checkConfig(value: Config): boolean{
	return (
		typeof value.token == 'string' &&
		typeof value.subreddit == 'string' &&
		typeof value.interval == 'number' &&
		typeof value.fetchAmount == 'number' &&
		typeof value.replaceWord == 'string' &&
		typeof value.triggerWord == 'string' &&
		typeof value.histSize == 'number' &&
		typeof value.channels == 'object'
	)
}

export type Hist = {
	id: string
	posts: string[]
}