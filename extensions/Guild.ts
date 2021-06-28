import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice'
import { Structures } from 'discord.js'
import { Player } from '../structures'

class Guild extends Structures.get('Guild') {
	readonly player = new Player()

	get connection() {
		const connection = getVoiceConnection(this.id)

		if (connection && connection.state.status !== VoiceConnectionStatus.Disconnected) 
			return connection

		return null
	}
}

Structures.extend('Guild', () => Guild)