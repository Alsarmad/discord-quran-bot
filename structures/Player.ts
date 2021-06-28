import {
	AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState,
	joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus
} from '@discordjs/voice'
import type { StageChannel, VoiceChannel } from 'discord.js'


function wait(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time).unref())
}


export function handleConnectionStatus(connection: VoiceConnection) {
	let readyLock = false

	connection.removeAllListeners()
	connection.on('stateChange', async (_, newState) => {
		if (newState.status === VoiceConnectionStatus.Disconnected) {
			if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
				try {
					await entersState(connection, VoiceConnectionStatus.Connecting, 5_000)
				} catch {
					connection.destroy()
				}
			} else if (connection.rejoinAttempts < 5) {
				await wait((connection.rejoinAttempts + 1) * 5_000)
				connection.rejoin()
			} else {
				connection.destroy()
			}
		} else if (
			!readyLock &&
			(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
		) {
			readyLock = true
			try {
				await entersState(connection, VoiceConnectionStatus.Ready, 20_000)
			} catch {
				if (connection.state.status !== VoiceConnectionStatus.Destroyed) connection.destroy()
			} finally {
				readyLock = false
			}
		}
	})
}


export class Player {
	audioPlayer = createAudioPlayer({ debug: false })
	connection: VoiceConnection | null = null

	get paused(): boolean {
		return this.audioPlayer.state.status === AudioPlayerStatus.Paused
	}

	get connected(): boolean | null {
		return this.connection && this.connection.state.status === VoiceConnectionStatus.Ready
	}

	get disconnected(): boolean {
		return [VoiceConnectionStatus.Destroyed, VoiceConnectionStatus.Disconnected].includes(this.connection?.state.status!)
	}

	get playing(): boolean | null {		
		return this.connected && this.audioPlayer.state.status !== AudioPlayerStatus.Idle
	}

	async play(url: string): Promise<void> {
		if (!this.connected) throw new Error('No Connection...')

		try {
			const resource = createAudioResource(url, { inputType: StreamType.Arbitrary })
			this.audioPlayer.play(resource)
			this.connection!.subscribe(this.audioPlayer)
		} catch (error) {
			console.error(error)
		}
	}

	async connect(channel: VoiceChannel | StageChannel): Promise<void> {
		const connection = this.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			debug: false
		})

		await entersState(connection, VoiceConnectionStatus.Ready, 20e3)

		connection.subscribe(this.audioPlayer)
		connection.on('stateChange', (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Destroyed) this.stop()
		})

		handleConnectionStatus(connection)
	}

	stop(): void {
		this.audioPlayer.stop(true)
	}

	leave(): void {
		this.connection?.disconnect()
	}

	pause(pause = true): boolean {
		return pause ? this.audioPlayer.pause(true) : this.audioPlayer.unpause()
	}
}