import { CTX, Command, MessageEmbed, ApplicationCommandOptionData } from 'discord.js'
import { Client } from '../structures'

const ICON_URL = 'https://cdn.discordapp.com/app-icons/706134327200841870/e6bb860daa7702ea70e6d6e29c3d36f6.png'

export class HelpCommand implements Command {
	name = 'help'
	description = 'Lists all commands'
	options = [{
		name: 'command',
		type: 'STRING' as const,
		description: 'Command info?',
		required: false
	}]
	run(ctx: CTX): Promise<unknown> {
		const commandName = ctx.options.getString('command', false)?.toLowerCase()
		const command = ctx.client.commands.get(commandName)

		const embed = new MessageEmbed()
			.setThumbnail(ICON_URL)
			.setColor('#2f3136')

		if (command) {
			embed
				.setTitle(`/${command.name}`)
				.setDescription(command.description)
				.addField('Usage: ', this.formatOptions(command.name, command.options))
		} else {
			const commands = (ctx.client as Client).commands.map((cmd) => `• \`/${cmd.name}\` - ${cmd.description}`).join('\n')

			embed
				.setDescription('**Use `/help <command>` for more information about a command.**\nExample: `/help play`\n\n')
				.addField('Overview', commands)
		}

		return ctx.reply({ embeds: [embed], ephemeral: true })
	}

	formatOptions(name = '', options: ApplicationCommandOptionData[] = []) {
		let output = ''

		for (const option of options) {
			output += `• /${name} `

			if (option.type === 'SUB_COMMAND') {
				for (const subOption of option.options ?? []) {
					output += subOption.required === false ? `[${subOption.name}]` : `<${subOption.name}>` 
					output += ' '
				}
				output += '\n'
			} else {
				output += option.required === false ? `[${option.name}]` : `<${option.name}>` 
				output += ' '
			}
		}

		return output || `• /${name}`
	}
}