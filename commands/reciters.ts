import { getReciters } from '../utils'
import { Command, CTX, MessageActionRow, MessageButton } from 'discord.js'
import arabic2franko from 'arabic2franko'
import Fuse from 'fuse.js'
import ms from 'ms'

const isArabic = (str: string) => /^[\u0621-\u064A0-9 ]+$/i.test(str)
const BUTTONS = new MessageActionRow({
	components: [
		new MessageButton()
			.setStyle('PRIMARY')
			.setCustomId('⬅️')
			.setLabel('Back')
			.setEmoji('⬅️'),
		new MessageButton()
			.setCustomId('➡️')
			.setStyle('PRIMARY')
			.setLabel('Next')
			.setEmoji('➡️')
	]
})

export class RecitersCommand implements Command {
	name = 'reciters'
	description = 'Sends the lists of reciters for `/play`.'
	options = [{
		name: 'for',
		type: 'STRING' as const,
		description: 'Reciters for?',
		choices: [{
			name: 'ayah',
			value: 'ayah'
		}, {
			name: 'page',
			value: 'page'
		}, {
			name: 'surah',
			value: 'surah'
		}],
		required: true
	}, {
		name: 'name',
		type: 'STRING' as const,
		description: 'Reciter name',
		required: false
	}]

	async run(ctx: CTX): Promise<void> {
		await ctx.deferReply()

		const type = ctx.options.getString('for', true)
		const name = ctx.options.getString('name', false)

		let reciters = await getReciters(type as 'page' | 'ayah' | 'surah')

		if (name) {
			const fuse = new Fuse(reciters, { 
				keys: ['name'],
				findAllMatches: true
			})
			
			reciters = fuse.search(isArabic(name) ? arabic2franko(name) : name).map(({ item }) => item)

			if (!reciters.length) {
				return void ctx.followUp('**Not Found!**')
			}
		}

		const max = Math.floor(Math.ceil(reciters.length / 10))
		const pages: { [key: string]: string }[][] = []

		for (let i = 0; i < max; i++) pages.push(reciters.slice(i, i + 10))

		let page = pages[0], i = 0

		const msg = await ctx.followUp({
			content: `**Page:** ${i + 1}/${max}\n\n${this.formatReciters(page)}`,
			components: [BUTTONS]
		})

		const collector = ctx.channel.createMessageComponentCollector({
			time: ms('5 minutes'),
			idle: ms('2 minutes'),
			filter: (button) => button.message.id === msg.id && button.user.id === ctx.user.id
		})

		collector.on('collect', async (interaction) => {
			await interaction.deferUpdate()

			if (interaction.customId === '➡️') {
				if (i === max) return
				i++
			} else if (interaction.customId === '⬅️') {
				if (i === 0) return
				i--
			} else return

			page = pages[i]

			await ctx.channel.messages.edit(msg.id, {
				content: `**Page:** ${i + 1}/${max}\n\n${this.formatReciters(page)}`,
			})
		})

		collector.on('end', () => void ctx.channel.messages.edit(msg.id, { components: [] }))
	}

	formatReciters(reciters: { [key: string]: string }[]): string {
		return reciters.map((reciter) => `• ${reciter.name}`).join('\n')
	}
}