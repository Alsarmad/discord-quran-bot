import type { Client } from 'discord.js'
import { createAudioResource, StreamType } from '@discordjs/voice'

const STREAM_URL = 'https://qurango.net/radio/tarateel'

export const ready = async (client: Client): Promise<void> => {
	console.log('Connected')
	console.log(client.user!.tag)

	client.user!.setPresence({
		activities: [{
			name: ' إذا قرأ القرآن فاستمعوا له وأنصتوا لعلكم ترحمون',
			type: 'LISTENING'
		}],
		status: 'idle'
	})

	const promises: Promise<unknown>[] = []
	const commands = client.commands.array()

	for (const guild of client.guilds.cache.values()) {
		promises.push(guild.commands.set(commands))
	}

	await Promise.all(promises)

	const resource = createAudioResource(STREAM_URL, { inputType: StreamType.Arbitrary })

	client.radio.play(resource)
}