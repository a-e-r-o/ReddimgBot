export type RedditRes = {
	kind: string
	data: {
		modhash: string
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
		is_gallery: boolean
		media_metadata: Record<string, {m: string, id: string}>
		media: {
			reddit_video: {
				fallbacl_url: string
			}
		}
	}

	// reference JSON use media > reddit_video > fallback_url
	//https://www.reddit.com/r/space/comments/6u34g5/a_look_at_eclipses_through_history_and_why_people/.json
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

export function msToTime(ms: number) {
	const d = Math.floor(ms/86400000)
	ms -= d*86400000
	const h = Math.floor(ms/3600000)
	ms -= h*3600000
	const m = Math.floor(ms/60000)
	
	return `${d<1?'':(d<10?'0'+d:d)+'d:'}${h<1?'':(h<10?'0'+h:h)+'h:'}${m<1?'':(m<10?'0'+m:m)+'m'}`
}