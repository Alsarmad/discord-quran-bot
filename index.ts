import 'dotenv/config'

import { Client, Intents } from './structures'
import config from './config'

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	restTimeOffset: 0
})

console.log(`Loaded a ${client.load('commands')} command.`)
console.log(`Loaded a ${client.load('events')} event.`)

void client.login(config.token)