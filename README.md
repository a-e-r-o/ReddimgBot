# N.E.O.N. Bot

*A bot to get all the good content from Reddit, without having to go on Reddit*<br>

### Instructions

Create a `config.yml` at the root of the project :

```yaml
token: 'bot secret token'
sendInterval: 30  # Default interval (in minutes) at which the bot will send content on Discord
fetchInterval: 60 # Default interval (in minutes) at which the bot will update its content cache with new Reddit posts
fetchSize: 50  # Default number of reddit posts fetched each time
histSize: 100 # Default Number of posts IDs that will be kept in memory (and in a json file) to avoid duplicate posts
channels: # List of channels the bot will send the images to
deleteReactCharCodes: # Charcode of the emojis to react with to make the bot delete his messages these correspond to ❌🚫⛔
  - 9940
  - 10060
  - 55357
topics:
	- subreddit: 'dankmemes' # The subreddit on which the bot will go to get content
		fetchInterval: 30 # Optionnal : overrides default config value
    fetchSize: 50 # Optionnal : overrides default config value
		deleteReactCharCodes: # Optionnal : overrides default config value
		- 55358
	  channels: # List of channels the content of this subreddit will be sent to
	  - id: '000000000000000000' # Channel ID
	  	sendInterval: 0.5 # Optionnal : overrides default config value
	    histSize: 20 # Optionnal : overrides default config value
``` 
*these values are merely an exemple, you may configure them the way you like*

### Once your `config.yml` is done, run the bot with this command :
```
deno run --allow-net --allow-read --allow-write --unstable main.ts
```