import 'dotenv/config'

import { Client, Intents } from './structures'
import config from './config'

import { createServer } from 'http'

createServer((_req, res) => {
    res.write('Hello')
    res.end()
}).listen(process.env.PORT ?? 8080)


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

process
    .on('uncaughtException', (err) => console.error(`Uncaught Exception: ${err.stack}`))
    .on('unhandledRejection', (error) => console.error('Unhandled Rejection', error))
    .on('warning', (warn) => console.warn(warn))