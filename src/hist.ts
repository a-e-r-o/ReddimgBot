import {Hist} from './types.ts'
import {existsSync} from './deps.ts'

const histDir = './hist'

export function readFullHist(): Map<string, string[]> {
	if (!existsSync(histDir))
		Deno.mkdirSync(histDir)
	const objHists = readPath(histDir) as Hist[]
	return new Map(objHists.map(i => [i.id, i.posts]))
}

export function writeHist(id: string, posts: string[]) {
	const histObj: Hist = {
		id: id,
		posts: posts
	}
	Deno.writeTextFileSync(Deno.realPathSync(histDir)+'/'+id, JSON.stringify(histObj))
}

function readPath(path: string): Record<string, unknown>[] {
	const staticPath = Deno.realPathSync(path)
	const files = Deno.readDirSync(staticPath)
	const objects: Record<string, unknown>[] = []

	for (const file of files) {
		if (!file.name || !file.isFile) continue

		const subResult = Deno.readTextFileSync(staticPath+'/'+file.name)
		const result: Record<string, unknown> = JSON.parse(subResult)

		objects.push(result)
	}

	return objects
}