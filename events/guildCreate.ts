import type { Guild } from 'discord.js'

export const guildCreate = async (guild: Guild): Promise<void> => {
	await guild.commands.set(guild.client.commands.array())
}