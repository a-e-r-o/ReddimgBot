# N.E.O.N. Bot

### A bot to get all the good content from Reddit, without having to go on Reddit

*This bot is intended to be used to post images and videos, it doesn't support text posts yet.*

What it does is : it fetches posts from defined subreddits using the Reddit APi and send messages with the links of the posts in a Discord channel. Posts are fetched without pagination and sorted by "hot", so to avoid repetitions a bunch of new posts are fetch regularly.

There is also a post history mechanism which registers the last few posts sent in each channel, so that no image is posted twice in the same channel.

-----

## Setup

- Install Deno on your environment [(official instructions here)](https://deno.land/#installation)
- Clone this repo with the following command
```bash
git clone https://gitlab.com/AeroCloud/neonbot.git
```
- Create a `config.yml` file at the root of the project (see section below for exmeples)

-----

## Config files exemples

This is the most basic exemple.

Each hour, 50 posts are fetched. Every 10 minutes a new post is sent in the channel determined.

```yaml
token: '{paste your bot secret token here}'
sendInterval: 10  # Default interval (in minutes) at which the bot will send content on Discord
fetchInterval: 60 # Default interval (in minutes) at which the bot will update its content cache with new Reddit posts
fetchSize: 50  # Default number of reddit posts fetched each time
histSize: 200 # Default Number of posts IDs that will be kept in memory (and in a json file) to avoid duplicate posts
topics:
  - subreddit: 'pixelart' # The subreddit on which the bot will go to get content
    channels: # List of channels the content of this subreddit will be sent to
      - id: '000000000000000002' # Channel ID
```

This is an exemple of a more advanced configuration, with 2 different topics (subreddits). Each one has channels associated to it, along with some custom parameters.
```yaml
token: '{paste your bot secret token here}'
sendInterval: 30  # Default interval (in minutes) at which the bot will send content on Discord
fetchInterval: 60 # Default interval (in minutes) at which the bot will update its content cache with new Reddit posts
fetchSize: 50  # Default number of reddit posts fetched each time
histSize: 100 # Default Number of posts IDs that will be kept in memory (and in a json file) to avoid duplicate posts
topics:
  - subreddit: 'dankmemes' # The subreddit on which the bot will go to get content
    fetchInterval: 30 # Optionnal : overrides default config value
    fetchSize: 50 # Optionnal : overrides default config value
    channels: # List of channels the content of this subreddit will be sent to
    - id: '000000000000000001' # Channel ID
      sendInterval: 5 # Optionnal : overrides default config value
      histSize: 20 # Optionnal : overrides default config value

  - subreddit: '196' # The subreddit on which the bot will go to get content
    channels: # List of channels the content of this subreddit will be sent to
    - id: '000000000000000002' # Channel ID
    - id: '000000000000000003' # Channel ID
```

-----

**Starting the bot :** <br>
Once you have cloned the repo and made sure you have installed Deno
```bash
deno run --allow-net --allow-read --unstable main.ts
```
The repo also contains a bash script simply called `launch` which simply runs the bot and restarts it if it crashes for whatever reasons. <br>
To use this script, make it executable and execute it in a bash shell. <br>
```bash
chmod +x launch.sh
./launch.sh
```
*I recommend using [tmux](https://www.redhat.com/sysadmin/introduction-tmux-linux) to keep the bot running in the background wihtout needing to keep your shell opened*