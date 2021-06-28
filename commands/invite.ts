import { CTX, Command, Permissions } from 'discord.js'

export class InviteCommand implements Command {
	name = 'invite'
	description = 'Invite me to your server!'
	run(ctx: CTX): Promise<unknown> {
		const invite = ctx.client.generateInvite({
			permissions: [
				Permissions.FLAGS.ADD_REACTIONS,
				Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
				Permissions.FLAGS.EMBED_LINKS,
				Permissions.FLAGS.SPEAK,
				Permissions.FLAGS.CONNECT,
				Permissions.FLAGS.VIEW_CHANNEL
			],
			additionalScopes: ['applications.commands']
		})
		return ctx.reply({ content: `[**Click Here!**](${invite})`, ephemeral: true })
	}
}