import {RedditPost, RedditRes, TopicConfig} from './types.ts'
import {writeHist, readFullHist} from './historyManager.ts'
import {sendMessage} from './deps.ts'

export class PostsManager {

	// Record = all channel histories
	public record: Map<bigint, string[]>
	// Cache = reddit posts already fecthed, mapped by subreddit
	public cache: Map<string, RedditPost[]>

	constructor(){
		this.record = readFullHist()
		this.cache = new Map<string, RedditPost[]>()
	}


	public getContent(channelID: bigint, subreddit: string, histSize:number): string {
		let selectedPost: RedditPost | undefined
		const hist = this.record.get(channelID) || []

		// If there is at least one post cached for this subreddit
		if ((this.cache.get(subreddit)?.length ?? 0) > 0) {
			// Get a post that is not already in history
			for (const post of this.cache.get(subreddit)!) {
				if (!hist.includes(post.data.id)){
					selectedPost = post
					hist.push(post.data.id)
					break
				}
			}
		}
	
		// Delete posts in history beyond max history size
		while (hist.length > histSize){
			hist.shift()
		}
	
		// Update record
		this.record.set(channelID, hist)
		writeHist(channelID, hist)
	
		if (!selectedPost){
			console.log(`No new image found. Subreddit:${subreddit};Channel:${channelID}`)
			return ''
		}

		if (selectedPost.data.is_gallery)
			return this.formatGalleryMsg(selectedPost)

		if (selectedPost.data.post_hint	== "hosted:video")
			return 'https://reddit.com/' + selectedPost.data.permalink
	
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
			console.log('/// Error fetching data ///', new Date())
			console.log(e.message)
			
			try {
				for (const channel of topic.channels){
					sendMessage(channel.id, `\`\`\`fix\nAn error occured while fetching content from Reddit for Subreddit : "${topic.subreddit}". Retrying in ${fetchInterval} minutes\`\`\``)
				}
			} catch(_) {
				console.log('/// Error sending message ///', new Date())
				console.log(e.message)
			}
		}
	}

	private formatGalleryMsg(post: RedditPost): string {
		try {
			const firstImgMeta = Object.entries(post.data.media_metadata)[0][1]
			const mediaType = firstImgMeta.m.replace(/.+\//gm, '')
			const count = Object.entries(post.data.media_metadata).length
			const link = 'https://i.redd.it/'+firstImgMeta.id+'.'+mediaType
			
			return `*(${count} images) : ||${post.data.url}||*\n${link}`
		} catch {
			return 'Could not retrive data from gallery : '+post.data.url
		}
	}
}