import { YAML } from "./deps.ts";
import { PostsManager } from "./postsManager.ts";

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
				fallback_url: string
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
		value.topics != undefined
	)
}

export function parseConfig(path: string): Config {
	const config = YAML.parse(Deno.readTextFileSync(path)) as Config
	// YAML doesn't support Bigint, so we have to convert heach channel ID from string to bigInt
	config.topics.forEach(topic => {
		topic.channels.forEach(channel => {
			channel.id = BigInt(channel.id);
		})
	})
	return config
}

export type Hist = {
	id: bigint
	posts: string[]
}

export type TopicConfig = {
	subreddit: string
	fetchSize?: number
	fetchInterval?: number
	channels: ChannelConfig[]
}

export type ChannelConfig = {
	id: bigint
	sendInterval?: number
	histSize?: number
	deleteReactCharCodes?: number[]
}

export type Context = {
	config: Config
	intervals: {message: Map<bigint, number>, cache: Map<string, number>}
	manager: PostsManager
}

export function msToTime(ms: number) {
	const d = Math.floor(ms/86400000)
	ms -= d*86400000
	const h = Math.floor(ms/3600000)
	ms -= h*3600000
	const m = Math.floor(ms/60000)
	
	return `${d<1?'':(d<10?'0'+d:d)+'d:'}${h<1?'':(h<10?'0'+h:h)+'h:'}${m<1?'':(m<10?'0'+m:m)+'m'}`
}