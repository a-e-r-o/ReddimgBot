import {startBot, Intents, sendMessage, Message, deleteMessage, deleteMessageByID, YAML} from './src/deps.ts'
import {Config, checkConfig, topicConfig, channelConfig} from './src/types.ts'
import {PostsManager} from './src/postsManager.ts'

const config: Config = YAML.parse(Deno.readTextFileSync(Deno.realPathSync('./config.yml'))) as Config
const token: string = config.token
const topics: topicConfig[] = config.topics

if(!checkConfig(config))
	throw '/!\\ config.yml incorrect or missing'

startBot({
	token: token,
	intents: [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES],
	eventHandlers: {
		ready: ready,
		//messageCreate: msgCreate
	}
})

const intervals = {message: new Map<string, number>(), cache: new Map<string, number>()}
const manager: PostsManager = new PostsManager()

// Ready
function ready() {
	console.log('\n=== Bot operationnal ===')
	init()
}

function init(){
	// For each topic
	topics.forEach(topic => {
		
		// For each channel in each topic
		topic.channels.forEach(async channel => {
			
			// Send interval
			intervals.message.set	(
				channel.id,
				setInterval(()=>{
					const content = manager.getContent(channel.id, topic.subreddit, config.histSize)
					sendMessage(channel.id, content)
				}, (channel.interval ?? config.interval)*60000)
			)

			// Cache interval
			intervals.cache.set(
				channel.id,			
				setInterval(()=>{
					try {
						manager.updateCache(topic.subreddit, config.fetchAmount)
					} catch(e) {
						handleError(e as Error)
					}
				}, (channel.interval ?? config.interval)*60000)
			)
			
			// First round
			await manager.updateCache(topic.subreddit, config.fetchAmount)
			const content = manager.getContent(channel.id, topic.subreddit, config.histSize)
			sendMessage(channel.id, content)
		});
	})
} 

// Error
function handleError(e: Error) {
	console.log('== Error ==', new Date())
	console.log(e.message)

	/*
	for (const channel of channels){
		sendMessage(channel.id, '\`\`\`fix\nAn error occured while fetching data from Reddit\`\`\`')
	}
	*/
}

/*
// Messages
async function msgCreate(msg: Message){
	if (!channels.includes(msg.channelID))
		return
	
	if (msg.referencedMessageID?.author.id === botID){
		if (msg.content.match(config.replaceWord)){
			await deleteMessageByID(msg.channelID, msg.referencedMessageID?.id)
			setTimeout(async()=>{
				await deleteMessage(msg)
				sendMessage(msg.channelID, getContent(msg.channelID))
			},1000) // timeout to avoid ghost message when deleted just after being sent
		}
		return
	}

	if (msg.mentionedMembers.find(x => x?.id === botID)){
		sendMessage(msg.channelID, getContent(msg.channelID, fullHist.get(msg.channelID))
		return
	}
}*/