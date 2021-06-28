import { CTX, Command } from 'discord.js'

export class PauseCommand implements Command {
	name = 'pause'
	description = 'Pauses/Resumes the bot.'
	voice = {
		playing: true
	}
	run(ctx: CTX): Promise<unknown> {
		const player = ctx.guild.player
		const isPaused = player.paused

		player.pause(!isPaused)

		return ctx.reply(isPaused ? ':arrow_forward: **Resumed**.' : ':pause_button: **Paused**.')
	}
}