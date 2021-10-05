import {startBot, Intents} from './src/deps.ts'
import {Config, checkConfig, parseConfig, Context} from './src/types.ts'
import {PostsManager} from './src/postsManager.ts'
import {ready, msgCreate} from './src/handlers.ts'

const cfg: Config = parseConfig(Deno.realPathSync('./config.yml'))
const ctx: Context = {
	config: cfg,
	intervals: { message: new Map<bigint, number>(), cache: new Map<string, number>()},
	manager: new PostsManager()
}

if(!checkConfig(cfg))
	throw '/!\\ config.yml incorrect or missing'

startBot({
	token: cfg.token,
	intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions],
	eventHandlers: {
		ready: ()=>{
			ready(ctx)
		},
		messageCreate: (msg)=>{
			msgCreate(msg,ctx)
		}
	}
})
