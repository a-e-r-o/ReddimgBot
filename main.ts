import {startBot, Intents, sendMessage, DiscordenoMessage, YAML, botId, editBotStatus, DiscordActivityTypes} from './src/deps.ts'
import {Config, checkConfig, TopicConfig, msToTime} from './src/types.ts'
import {PostsManager} from './src/postsManager.ts'

const config: Config = YAML.parse(Deno.readTextFileSync(Deno.realPathSync('./config.yml'))) as Config
const token: string = config.token
const topics: TopicConfig[] = config.topics

window.addEventListener("unhandledrejection", event => {
	event.preventDefault()
  console.log(`${event}`)
})

if(!checkConfig(config))
	throw '/!\\ config.yml incorrect or missing'

startBot({
	token: token,
	intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions],
	eventHandlers: {
		ready: init,
		messageCreate: msgCreate
	}
})

const intervals = {
	message: new Map<string, number>(),
	cache: new Map<string, number>()
}
const manager: PostsManager = new PostsManager()

// Ready
function init(){
	console.log('\n=== Bot operationnal ===\n')

	const startTime = new Date();
	setInterval(()=>{
		editBotStatus(
			{
				status: 'online', 
				activities: [
					{
						createdAt: (new Date()).getTime(),
						type: DiscordActivityTypes.Game,
						name: `Uptime ${msToTime((new Date().getTime() - startTime.getTime()))}`
					}
				]
			}
		)
	}, 120000)

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
					sendMessage(BigInt(channel.id), content)
				}, (channel.sendInterval ?? config.sendInterval)*60000)
			)
		})
	})
} 

// On message sent on a guild text channel
function msgCreate(msg: DiscordenoMessage){

	// If the bot is not mentionned, or if it's simply a reply, return
	if (!msg.mentionedMembers.find(x => x?.id == botId) || msg.referencedMessage?.id)
		return

	// If the channel Id isn't anywhere in the config, return
	const topic = topics.find(x => x.channels.find(y => y.id == msg.channelId.toString()))
	if (!topic)
		return
	const channel = topic.channels.find(y => y.id == msg.channelId.toString())!

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
			msg.channelId.toString(),
			topic.subreddit,
			channel.histSize ?? config.histSize
		)
		try {
			sendMessage(BigInt(channel.id), content)
		} catch(e){
			console.log('/// Error ///', new Date())
			console.log(e.message)
		}
	}
}
