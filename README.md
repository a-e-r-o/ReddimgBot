# ecchibot

*Not much it is, but honest work, it is*<br>
*Hmmm look at anime girls, I must*

Create a `config.yml` at the root of the project :

```yaml
token: 'bot secret token'
subreddit: 'ecchi' # Indicate the subreddit on which the bot will go to get the images.
interval: 30  # Interval (in minutes) between each post
fetchAmount: 50  # Number of reddit posts fetched each time - the more frequently you post the more you should fetch
replaceWord: 'bad' # Word to indicate that an image should be replaced. Reply to a message from the bot with this word and it will delete the image and post a new one.
triggerWord: 'horny' # Word used to trigger manually the bot to post a new image. Mention the bot with this word in your message.
histSize: 100 # Number of posts IDs that will be kept in memory (and in a json file) to avoid duplicate posts
channels: # List of channel IDs the bot will send the images to
- 000000000000000000
``` 
*these values are merely the default ones, you may configure them the way you like*

### Once your `config.yml` is done, run the bot with this command :
```
deno run --allow-net --allow-read --allow-write --unstable main.ts
```