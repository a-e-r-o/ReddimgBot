# N.E.O.N. Bot

*A bot to get all the good content from Reddit, without having to go on Reddit*<br>

### Instructions

Create a `config.yml` at the root of the project :

```yaml
token: 'bot secret token'
interval: 30  # Default interval (in minutes) between each post
fetchAmount: 50  # Default number of reddit posts fetched each time
histSize: 100 # Default Number of posts IDs that will be kept in memory (and in a json file) to avoid duplicate posts
channels: # List of channels the bot will send the images to
- id: '000000000000000000' # Channel ID
	subreddit: 'dankmemes' # The subreddit on which the bot will go to get the images for this channel
	# Optionnal values that override the ones listed above for this particular channel
	interval: 5
  fetchAmount: 50
  histSize: 20
``` 
*these values are merely the default ones, you may configure them the way you like*

### Once your `config.yml` is done, run the bot with this command :
```
deno run --allow-net --allow-read --allow-write --unstable main.ts
```