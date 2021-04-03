import {botID, startBot, Intents, sendMessage, Message, deleteMessage, deleteMessageByID, YAML} from './deps.ts'
import {RedditRes, Config, RedditPost, checkConfig} from './types.ts'
import {readFullHist, writeHist} from './io.ts'

const config = YAML.parse(Deno.readTextFileSync(Deno.realPathSync('./config.yml'))) as Config
const token: string = config.token
const channels: string[] = config.channels

if(!checkConfig(config))
	throw '/!\\ config.yml incorrect or missing'

startBot({
	token: token,
	intents: [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES],
	eventHandlers: {
		ready: ready,
		messageCreate: msgCreate
	}
})

const fullHist: Map<string, string[]> = readFullHist()
let posts: RedditPost[] = []

function ready() {
	console.log('\n/≡≡≡/ Bot operationnal \\≡≡≡\\')
	
	broadcastContent()

	setInterval(()=>{
		broadcastContent()
	}, config.interval * 60000)
}

async function fetchPosts(): Promise<RedditPost[]> {
	const res = await fetch (`https://api.reddit.com/r/${config.subreddit}/top.json?sort=hot&limit=${config.fetchAmount}`)
	const resContent = (await res.json()) as RedditRes
	const posts = resContent.data.children as RedditPost[]
	return posts
}

function getContent(channelID: string): string {
	let selectedPost: RedditPost | undefined
	const currentHist: string[] = fullHist.get(channelID) ?? []
	
	for (const post of posts) {
		if (!currentHist.includes(post.data.id)){
			selectedPost = post
			currentHist.push(post.data.id)
			break
		}
	}

	while (currentHist.length > config.histSize){
		currentHist.shift()
	}
	fullHist.set(channelID, currentHist)
	writeHist(channelID, currentHist)

	if (!selectedPost)
		return '\`\`\`fix\nCannot find any new images\`\`\`'

	return selectedPost.data.url
}

async function broadcastContent(){
	try {
		posts = await fetchPosts()
	} catch(e) {
		handleError(e as Error)
	}

	for (const channelID of channels){
		sendMessage(channelID, getContent(channelID))
	}
}

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
		if (msg.content.match(config.triggerWord)){
			sendMessage(msg.channelID, getContent(msg.channelID))
		}
		return
	}
}

function handleError(e: Error) {
	console.log('== Error ==', new Date())
	console.log(e.message)

	for (const channel of channels){
		sendMessage(channel, '\`\`\`fix\nAn error occured while fetching data from Reddit\`\`\`')
	}
}