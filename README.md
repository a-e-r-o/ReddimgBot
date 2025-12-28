# ReddimgBot

This project is a very strightforward Discord BOT using an older version of [Discordeno](https://github.com/discordeno/discordeno)

The program periodically fetches posts from subreddits using the Reddit APi and sends each posts link in a Discord channel. Posts are fetched without pagination and sorted by "hot". To avoid reposts, 50¹ new posts are fetch every 60¹ minutes and a post history mechanism ensures no post is sent twice in the same channel by registering the IDs of the last 100¹ posts sent in each channel.

This bot is intended to be used to post images (including galleries) and videos, it doesn't support text posts.

*1. Values presented above are examples, and configurable*

-----

## Requirements

1. [Deno.land runtime](https://deno.land/#installation)

## Setup

- Clone this repo
- Create a `config.yml` file at the root of the project
- File the config file following the exemples below
- Executing main.ts
  - `deno run --allow-net --allow-read --unstable main.ts`
  - Alternatively : at the root of the repo is bash script named `launch` which runs the bot and restarts it in case of crash

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

This is an exemple of a more advanced configuration, with 2 different topics (subreddits). Each one has channels associated to it, with override parameters.
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

---



