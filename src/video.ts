import { readerFromStreamReader } from "https://deno.land/std@0.80.0/io/mod.ts";
import {sendMessage, CreateMessage, DiscordenoMessage, Embed, EmbedVideo, startBot, Intents} from './deps.ts'

startBot({
	token: 'ODQ0OTQ2NjkxMTY5ODQ1MjY4.YKZz7Q.IUE5hx-goy7ic-aLGYKwupA5Jjg',
	intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions],
	eventHandlers: {ready: main}
})

async function main(){
	console.log('/// start ///')
	const a = await download('https://v.redd.it/a7p2kpeni4gz/DASH_9_6_M?source=fallback')
}

async function download(url: string){
	/*
	const rsp = await fetch('https://v.redd.it/a7p2kpeni4gz/DASH_9_6_M?source=fallback');
	const rdr=rsp.body!.getReader();
	if(rdr) {
	    const r=readerFromStreamReader(rdr);
	    //const f=await Deno.open('./downloadedFile.mp4', {create: true, write: true});
			
			var b = new Blob();
			rdr.read().then(
				(_)=>{ 
					console.log(_)
					if (_.value != undefined)
						b = new Blob([_.value])
				}
			)
			console.log(b)
	    //await Deno.copy(r, f);
	    //f.close();
	}

	const res = await fetch(url);	
	if (res.body == null)
		return
	
	let base = new Uint8Array();*/

	/*const res = await fetch('https://v.redd.it/3hsn3n1dimr71/DASH_1080.mp4?source=fallback');
	//const res = await fetch('https://v.redd.it/a7p2kpeni4gz/audio?source=fallback');
	
	let ooo: Uint8Array[] = [];
	for await(const chunk of res.body!) {
    //await Deno.writeAll(file, chunk);
		ooo.push(chunk)
	}
	let blob = new Blob(ooo);

	console.log('brah')*/

	/*
	const a: CreateMessage = {
		file: {
			blob: blob,
			name: 'video.mp4'
		},
		content: 'test'
	}*/

	const a: CreateMessage = {
		embeds: [
			{
				title: 'Sigma',
				type: "video",
				video: {
					//url: 'https://sd.redditsave.com/download.php?permalink=https://reddit.com/r/shitposting/comments/q1uuga/oh_no/&video_url=https://v.redd.it/hhv7ch8gfmr71/DASH_480.mp4?source=fallback&audio_url=https://v.redd.it/hhv7ch8gfmr71/DASH_audio.mp4?source=fallback',
					url: 'https://cdn.discordapp.com/attachments/763053037332725790/893786495461261322/video0-16-5.mp4',
					height: 400,
					width: 300
				}
			}
		]
	}


	// 'https://sd.redditsave.com/download.php?permalink=https://reddit.com/r/shitposting/comments/q1uuga/oh_no/&video_url=https://v.redd.it/hhv7ch8gfmr71/DASH_480.mp4?source=fallback&audio_url=https://v.redd.it/hhv7ch8gfmr71/DASH_audio.mp4?source=fallback'

	await sendMessage(BigInt('894866731514855425'), a)
	console.log('bruh')
}