import {RedditPost, RedditRes, TopicConfig} from './types.ts'
import {writeHist, readFullHist} from './hist.ts'
import {sendMessage} from './deps.ts'

export class PostsManager {

	// Record = all channel histories
	public record: Map<string, string[]>
	// Cache = reddit posts already fecthed, mapped by subreddit
	public cache: Map<string, RedditPost[]>

	constructor(){
		this.record = readFullHist()
		this.cache = new Map<string, RedditPost[]>()
	}


	public getContent(channelID: string, subreddit: string, histSize:number): string {
		let selectedPost: RedditPost | undefined
		const hist = this.record.get(channelID) || []
		
		// Get a post that is not already in history
		for (const post of this.cache.get(subreddit)!) {
			if (!hist.includes(post.data.id)){
				selectedPost = post
				hist.push(post.data.id)
				break
			}
		}
	
		// Delete posts in history beyond max history size
		while (hist.length > histSize){
			hist.shift()
		}
	
		// Update record
		this.record.set(channelID, hist)
		writeHist(channelID, hist)
	
		if (!selectedPost)
			return '\`\`\`fix\nCannot find any new images\`\`\`'
	
		return selectedPost.data.url
	}

	public async updateCache(topic: TopicConfig, fetchAmount: number, fetchInterval: number): Promise<void> {
		try {
			const res = await fetch (`https://api.reddit.com/r/${topic.subreddit}/top.json?sort=hot&limit=${fetchAmount}`)
			const resContent = (await res.json()) as RedditRes
			const posts = resContent.data.children as RedditPost[]
			this.cache.set(topic.subreddit, posts)
		} catch (e) {
			// Error
			console.log('== Error ==', new Date())
			console.log(e.message)
			
			for (const channel of topic.channels){
				sendMessage(channel.id, `\`\`\`fix\nAn error occured while fetching content from Reddit for Subreddit : "${topic.subreddit}". Retrying in ${fetchInterval} minutes\`\`\``)
			}
		}
	}
}