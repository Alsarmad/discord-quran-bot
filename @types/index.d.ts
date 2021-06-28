import { Player } from '../structures'
import { AudioPlayer, VoiceConnection } from '@discordjs/voice'

declare module 'discord.js' {

	interface Command extends ApplicationCommandData {
		voice?: {
			connected?: boolean
			playing?: boolean
			joined?: boolean
		}
		run(ctx: CTX): Awaited<void | unknown>
	}

	interface CTX extends CommandInteraction {
		guild: Guild
		channel: TextChannel | NewsChannel
		member: GuildMember
	}

	interface Client {
		commands: Collection<string, Command>
		radio: AudioPlayer
	}

	interface Interaction {
		isCommand(): this is CTX
	}

	interface Guild {
		player: Player
		connection: VoiceConnection | null
	}
}

type Config = Readonly<{
	token: string
}>