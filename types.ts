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
	replaceWord: string
	triggerWord: string
	interval: number
	fetchAmount: number
	channels: string[]
}

export type Hist = {
	id: string
	posts: string[]
}