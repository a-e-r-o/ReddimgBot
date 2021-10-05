import {Hist} from './types.ts'
import {existsSync} from './deps.ts'

const histDir = './hist'

export function readFullHist(): Map<bigint, string[]> {
	if (!existsSync(histDir))
		Deno.mkdirSync(histDir)
	const objHists = readPath(histDir) as Hist[]
	// JSON serialization doesn't handle big int, we had to convert when writing, so now we convert it back
	objHists.forEach(obj => obj.id = BigInt(obj.id))
	return new Map(objHists.map(i => [i.id, i.posts]))
}

export function writeHist(id: bigint, posts: string[]) {
	Deno.writeTextFileSync(
		Deno.realPathSync(histDir)+'/'+id.toString(), 
		// JSON serialization doesn't handle big int, we have to convert it
		JSON.stringify({
			id: id.toString(),
			posts: posts
		})
	)
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