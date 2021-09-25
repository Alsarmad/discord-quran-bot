import { CTX, Command } from 'discord.js'

export class StopCommand implements Command {
	name = 'stop'
	description = 'Disconnects the bot from voice/stage.'
	run(ctx: CTX): Promise<unknown> {
		const player = ctx.guild.player

		if (player.connected) {
			player.stop()
			return ctx.reply(':white_check_mark: **Successfully disconnected.**')
		} else {
			return ctx.reply({
				content: "I'm not connected...",
				ephemeral: true
			})
		}
	}
}