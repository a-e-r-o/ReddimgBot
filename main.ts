import {startBot, Intents, sendMessage, Message, deleteMessage, deleteMessageByID, YAML, botID, MessageReactionUncachedPayload, ReactionPayload} from './src/deps.ts'
import {Config, checkConfig, TopicConfig, ChannelConfig} from './src/types.ts'
import {PostsManager} from './src/postsManager.ts'

const config: Config = YAML.parse(Deno.readTextFileSync(Deno.realPathSync('./config.yml'))) as Config
const token: string = config.token
const topics: TopicConfig[] = config.topics

if(!checkConfig(config))
	throw '/!\\ config.yml incorrect or missing'

startBot({
	token: token,
	intents: [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES, Intents.GUILD_MESSAGE_REACTIONS],
	eventHandlers: {
		ready: ready,
		messageCreate: msgCreate,
		reactionAdd: reactionAdd
	}
})

const intervals = {
	message: new Map<string, number>(),
	cache: new Map<string, number>()
}
const manager: PostsManager = new PostsManager()

// Ready
function ready() {
	console.log('\n=== Bot operationnal ===\n')
	init()
}

function init(){
	// For each topic
	topics.forEach(async topic => {

		// Cache interval
		intervals.cache.set(
			topic.subreddit,			
			setInterval(()=>{
				manager.updateCache(
					topic,
					topic.fetchSize ?? config.fetchSize,
					topic.fetchInterval ?? config.fetchInterval
				)
			}, (topic.fetchInterval ?? config.fetchInterval)*60000)
		)

		// First cache update
		await manager.updateCache(
			topic,
			topic.fetchSize ?? config.fetchSize,
			topic.fetchInterval ?? config.fetchInterval
		)
		
		// For each channel in each topic
		topic.channels.forEach(channel => {
			
			// Send interval
			intervals.message.set	(
				channel.id,
				setInterval(()=>{
					const content = manager.getContent(
						channel.id,
						topic.subreddit,
						channel.histSize ?? config.histSize
					)
					sendMessage(channel.id, content)
				}, (channel.sendInterval ?? config.sendInterval)*60000)
			)
		})
	})
} 

// On message sent on a guild text channel
function msgCreate(msg: Message){

	// If the bot is not mentionned, or if it's simply a reply, return
	if (!msg.mentionedMembers.find(x => x?.id == botID) || msg.referencedMessageID)
		return

	// If the channel Id isn't anywhere in the config, return
	const topic = topics.find(x => x.channels.find(y => y.id == msg.channelID))
	if (!topic)
		return
	const channel = topic.channels.find(y => y.id == msg.channelID)!

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
		const content = manager.getContent(
			msg.channelID,
			topic.subreddit,
			channel.histSize ?? config.histSize
		)
		sendMessage(channel.id, content)
	}
}

function reactionAdd(
	payload: MessageReactionUncachedPayload,
	emoji: ReactionPayload,
	userID: string,
	message?: Message | undefined)
{
	if (message?.author.id != botID)
		return

	// Get channel and topic
	const topic = topics.find(x => x.channels.find(y => y.id == message.channelID))
	if (!topic)
		return
	const channel = topic.channels.find(y => y.id == message.channelID)!
		
	// Test if correct emoji
	const charPoint = emoji.name?.codePointAt(0) || 0
	const ref = channel.deleteReactCharCodes || config.deleteReactCharCodes
	Deno.writeTextFileSync('test.json', (emoji.name?.codePointAt(0)?.toString() || ''));
	if (!ref.includes(charPoint))
		return
	
	// timeout to avoid "ghost message" when deleted to quickly after being sent
	setTimeout(()=>{
		deleteMessage(message)
	}, 500)
}

/*
if (msg.referencedMessageID?.author.id === botID){
	if (msg.content.match(config.replaceWord)){
		await deleteMessageByID(msg.channelID, msg.referencedMessageID?.id)
		
	}
	return
}
*/