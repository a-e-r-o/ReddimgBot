import { botId, DiscordenoMessage, sendMessage } from "./deps.ts";
import { Context } from "./types.ts";

export function ready(ctx: Context){
	console.log('\n=== Bot operationnal ===\n')

	// For each topic
	ctx.config.topics.forEach(async topic => {

		// Cache interval
		ctx.intervals.cache.set(
			topic.subreddit,			
			setInterval(()=>{
				ctx.manager.updateCache(
					topic,
					topic.fetchSize ?? ctx.config.fetchSize,
					topic.fetchInterval ?? ctx.config.fetchInterval
				)
			}, (topic.fetchInterval ?? ctx.config.fetchInterval)*60000)
		)

		// First cache update
		await ctx.manager.updateCache(
			topic,
			topic.fetchSize ?? ctx.config.fetchSize,
			topic.fetchInterval ?? ctx.config.fetchInterval
		)
		
		// For each channel in each topic
		topic.channels.forEach(channel => {
			
			// Send interval
			ctx.intervals.message.set	(
				channel.id,
				setInterval(()=>{
					const content = ctx.manager.getContent(
						channel.id,
						topic.subreddit,
						channel.histSize ?? ctx.config.histSize
					)
					sendMessage(channel.id, content)
				}, (channel.sendInterval ?? ctx.config.sendInterval)*60000)
			)
		})
	})
} 

// On message sent on a guild text channel
export function msgCreate(msg: DiscordenoMessage, ctx: Context){

	// If the bot is not mentionned, or if it's simply a reply, return
	if (!msg.mentionedMembers.find(x => x?.id == botId) || msg.referencedMessage?.id)
		return

	// If the channel Id isn't anywhere in the config, return
	const topic = ctx.config.topics.find(x => x.channels.find(y => y.id == msg.channelId))
	if (!topic)
		return
	const channel = topic.channels.find(y => y.id == msg.channelId)!

	// Message content (after removing mentions) contains a number
	let count = 1
	const clearedMsg = msg.content.replace(/<.+>/mg, '').trim()
	const arg = parseInt(clearedMsg)
	if (!isNaN(arg)) {
		if (arg > 0)
			count = arg
		
		if (arg > 10)
			count = 10
	}

	if (clearedMsg != '' && isNaN(arg))
		return

	for (let i = 0; i < count; i++) {
		const content = ctx.manager.getContent(
			msg.channelId,
			topic.subreddit,
			channel.histSize ?? ctx.config.histSize
		)
		try {
			sendMessage(channel.id, content)
		} catch(e){
			console.log('/// Error ///', new Date())
			console.log(e.message)
		}
	}
}