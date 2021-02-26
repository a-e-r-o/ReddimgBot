// deps
import {botID, startBot, Intents, sendMessage, Message, deleteMessage, deleteMessageByID} from 'https://deno.land/x/discordeno@10.3.0/mod.ts'
import {parse} from 'https://deno.land/std@0.85.0/encoding/yaml.ts'
// types
import {RedditRes, Config} from './types.ts'

const config = parse(Deno.readTextFileSync(Deno.realPathSync('./config.yml'))) as Config
let token: string = config.token
let channels: string[] = config.channels

if(!token || ! channels)
	throw '/!\\ Incorrect config.yml'

startBot({
	token: token,
	intents: [Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.DIRECT_MESSAGES],
	eventHandlers: {
		ready: ready,
		messageCreate: msgCreate
	}
})

const imgsHistory: string[] = []

function ready() {
	console.log('\n≡≡ LewdBot is now operationnal ≡≡\n')
	setInterval(sendImg, 3600000)
}

async function sendImg(){
	let msgContent: string
	try {
		msgContent = await getImgLink()
	} catch(e) {
		if (typeof(e) === 'string'){
			msgContent = `\`\`\`fix\n${e}\`\`\``
		} else {
			msgContent = `\`\`\`diff\n- Error : ${e.toString()}\`\`\``
		}
	}
	for (const channelId of channels){
		await sendMessage(channelId, msgContent)
	}
}

async function getImgLink(): Promise<string> {
	const res = await fetch ('https://api.reddit.com/r/ecchi/top.json?sort=hot&limit=30') 
	const resContent = (await res.json()) as RedditRes

	let imgLink: string | undefined
	for (const pst of resContent.data.children) {
		if (!imgsHistory.includes(pst.data.url)){
			imgLink = pst.data.url
			imgsHistory.push(imgLink)
			break
		}
	}
	if (imgsHistory.length > 40)
		imgsHistory.shift()

	if (imgLink == undefined)
		throw 'Cannot find any new images'

	return imgLink
}

async function msgCreate(msg: Message){
	if (!channels.includes(msg.channelID))
		return
	
	if (msg.referencedMessageID?.author.id === botID){
		if (msg.content.match('loli')){
			await deleteMessageByID(msg.channelID, msg.referencedMessageID?.id)
			setTimeout(async()=>{
				await deleteMessage(msg)
				await sendImg()
			},1000) // timeout to avoid ghost message when deleted just after being sent
		}
		return
	}

	if (msg.mentionedMembers.find(x => x?.id === botID)){
		if (msg.content.match('horny')){
			sendImg()
		}
		return
	}
}