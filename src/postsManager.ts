import {RedditPost, RedditRes, Hist} from './types.ts'
import {writeHist, readFullHist} from './hist.ts'

export class PostsManager {

	// Record = all channel histories
	public record: Map<string, string[]>
	// Cache = reddit posts already fecthed, mapped by subreddit
	public cache: Map<string, RedditPost[]>

	constructor(record = new Map<string, Hist>()){
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

	public async updateCache(subreddit: string, fetchAmount: number): Promise<void> {
		const res = await fetch (`https://api.reddit.com/r/${subreddit}/top.json?sort=hot&limit=${fetchAmount}`)
		const resContent = (await res.json()) as RedditRes
		const posts = resContent.data.children as RedditPost[]
		this.cache.set(subreddit, posts)
	}
}