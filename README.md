# ecchibot

*Not much it is, but honest work, it is*<br>
*Hmmm look at anime girls, I must*

Create a `config.yml` at the root of the project :
```yaml
token: 'bot secret token'
subreddit: 'ecchi'
interval: 30
fetchAmount: 50
replaceWord: 'bad'
triggerWord: 'horny'
channels: 
- 000000000000000000
``` 
- `subreddit ` indicate the subreddit on which the bot will go to get the images.
- `interval` interval in minute between each post
- `fetchAmount` number of reddit post fetched each time - *the more frequently you post the more you should fetch*
- `replaceword` is used to indicate to the bot that an image should be replaced. Reply to a message from the bot with this word and it will delete the image and post a new one.
- `triggerword` is used to trigger manually the bot to post a new image. Mention the bot with this word in your message.
- `channels` the list of channel IDs the bot will send the images to

To run the bot once your `config.yml` is done :
```
deno run --allow-net --allow-read --allow-write --unstable main.ts
```