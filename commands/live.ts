import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { Command, CTX } from 'discord.js'
import { handleConnectionStatus } from '../structures/Player'

export class LiveCommand implements Command {
	name = 'live'
	description = 'Plays live Qur\'an radio.'
	voice = {
		joined: true
	}
	async run(ctx: CTX): Promise<unknown> {
		await ctx.deferReply()

		const connection = ctx.guild.connection ?? joinVoiceChannel({
			channelId: ctx.member.voice.channelId!,
			guildId: ctx.guild.id,
			adapterCreator: ctx.guild.voiceAdapterCreator,
			debug: false
		})

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 20e3)
		} catch {
			return ctx.followUp('Failed to connect...')
		}

		connection.subscribe(ctx.client.radio)

		handleConnectionStatus(connection)
	 	
		return ctx.followUp('Now playing **mp3quran.net radio**: *short recitations* (الإذاعة العامة - اذاعة متنوعة لمختلف القراء).')
	}
}