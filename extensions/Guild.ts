import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice'
import { BaseGuild } from 'discord.js'
import { Player } from '../structures'


class Guild extends BaseGuild {
	readonly player = new Player()

	get connection() {
		const connection = getVoiceConnection(this.id)

		if (connection && connection.state.status !== VoiceConnectionStatus.Disconnected) {
			return connection
		}

		return null
	}
}

for (const [name, prop] of Object.entries(Object.getOwnPropertyDescriptors(Guild.prototype))) {
    Object.defineProperty(BaseGuild.prototype, name, prop)
}