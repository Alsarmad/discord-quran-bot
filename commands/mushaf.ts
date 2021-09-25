import { Command, CTX, MessageActionRow, MessageButton } from 'discord.js'
import ms from 'ms'

const PAGE_LIMIT = 604
const BUTTONS = new MessageActionRow({
	components: [
		new MessageButton()
			.setStyle('PRIMARY')
			.setCustomId('⬅️')
			.setLabel('Back')
			.setEmoji('⬅️'),
		new MessageButton()
			.setStyle('DANGER')
			.setCustomId('⏹️')
			.setLabel('Stop')
			.setEmoji('⏹️'),
		new MessageButton()
			.setCustomId('➡️')
			.setStyle('PRIMARY')
			.setLabel('Next')
			.setEmoji('➡️')
	]
})

const toPageLink = (page: number) => `https://surahquran.com/img/pages-quran/page${String(page).padStart(3, '0')}.png`

export class MushafCommand implements Command {
	name = 'mushaf'
	description = 'Browse Quran pages.'
	options = [{
		name: 'page',
		type: 'INTEGER' as const,
		description: 'Page number',
		required: false
	}]

	async run(ctx: CTX): Promise<void> {
		let page = ctx.options.getInteger('page', false) ?? 1

		if (page < 0 || page > PAGE_LIMIT) return ctx.reply({
			content: '**Sorry, the page must be between 1 and 604.**',
			ephemeral: true
		})

		const msg = await ctx.reply({
			files: [toPageLink(page)],
			content: `Page: **${page}/${PAGE_LIMIT}**`,
			components: [BUTTONS]
		}).then(() => ctx.fetchReply())

		const collector = ctx.channel.createMessageComponentCollector({
			filter: (button) => button.message.id === msg.id && button.user.id === ctx.user.id,
			time: ms('1 hour'),
			idle: ms('15 minute')
		})

		collector.on('collect', async (interaction) => {
			await interaction.deferUpdate()

			if (interaction.customId === '➡️') {
				if (page === PAGE_LIMIT) return
				page++
			} else if (interaction.customId === '⬅️') {
				if (page === 1) return
				page--
			} else if (interaction.customId === '⏹️') {
				return collector.stop()
			} else return

			await ctx.channel.messages.edit(msg.id, {
				attachments: [],
				files: [toPageLink(page)],
				content: `Page: **${page}/${PAGE_LIMIT}**`,
			})
		})

		collector.on('end', () => void ctx.channel.messages.edit(msg.id, { components: [] }))
	}
}