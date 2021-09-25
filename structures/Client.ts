import '../extensions/Guild'

import { Client as DiscordClient, Collection, Command as BaseCommand } from 'discord.js'
import { createAudioPlayer } from '@discordjs/voice'

import * as commands from '../commands'
import * as events from '../events'
import { Player } from '.'


export class Client extends DiscordClient {
	commands = new Collection<string, BaseCommand>()
	players = new Collection<string, Player>()
	radio = createAudioPlayer({ debug: false })

	getPlayer(guildId: string): Player {
		let player = this.players.get(guildId)

		if (!player) {
			player = new Player()
			this.players.set(guildId, player)
		}

		return player
	}

	load(type: 'commands' | 'events'): number {
		if (type === 'commands') {
			
			for (const Command of Object.values(commands)) {
				const command = new Command()
				this.commands.set(command.name, command)
			}

			return this.commands.size
		} else {
			let count = 0
			
			for (const [eventName, event] of Object.entries(events)) {
				this.on(eventName, (...args) => 
					(event as (...args: unknown[]) => void)(...args, this)
				)
				count++
			}

			return count
		}
	}
}

export { Intents } from 'discord.js'