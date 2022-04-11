import type { Guild } from 'discord.js'

export const guildCreate = async (guild: Guild): Promise<void> => {
	const commands = [...guild.client.commands.values()]
	await guild.commands.set(commands)
}