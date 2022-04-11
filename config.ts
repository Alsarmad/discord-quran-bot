import { Config } from '@types'

export default <Config> {
	token: process.env.DISCORD_TOKEN || 'YOUR_TOKEN_HERE'
}