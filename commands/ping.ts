import { CTX, Command } from 'discord.js'

export class PingCommand implements Command {
	name = 'ping'
	description = 'ping?'
	run(ctx: CTX): Promise<unknown> {
		return ctx.reply('Pong!')
	}
}