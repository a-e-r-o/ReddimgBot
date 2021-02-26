export type RedditRes = {
	kind: string
	data: {
		modmash: string
		dist: number
		children: {
			kind: string
			data: {
				title: string
				url: string
				permalink: string
				id: string
			}
		}[]
	}
}

export type Config = {
	token: string
	channels: string[]
}