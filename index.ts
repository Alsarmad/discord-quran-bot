import 'dotenv/config'
import { createServer } from 'http'
import { Client, Intents } from './structures'
import config from './config'


const isHeroku = process.env._?.indexOf("heroku") !== -1
const isReplIt = !!process.env.REPL_ID

if (isHeroku || isReplIt) {
    const port = process.env.PORT ?? 8080
    console.log('Start listening on port:', port)
    createServer((_req, res) => {
        res.write('Pong!')
        res.end()
    }).listen(port)
}


const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
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