import { Command, CTX } from 'discord.js'
import EVERYAYAH_RECITERS from '../assets/reciters.json'
import * as utils from '../utils'

const PAGE_LIMIT = 604
const SURAH_LIMIT = 114

const toID = (str: string | number) => String(str).padStart(3, '0')

export class PlayCommand implements Command {
	name = 'play'
	description = 'Plays a surah, ayah or page from the mushaf.'
	options = [{
		name: 'ayah',
		type: 'SUB_COMMAND' as const,
		description: 'Plays a ayah (Example: /play ayah 1:6 hani al-rifai)',
		options: [{
			name: 'surah',
			type: 'INTEGER' as const,
			description: 'The surah number (Example: 1 for al-fatihah)',
			required: true
		}, {
			name: 'ayah',
			type: 'INTEGER' as const,
			description: 'The ayah number',
			required: true
		}, {
			name: 'reciter',
			type: 'STRING' as const,
			description: 'The reciter name',
			required: false
		}]
	}, {
		name: 'surah',
		type: 'SUB_COMMAND' as const,
		description: 'Plays a surah (Example: /play surah 1 Mishary Alafasi)',
		options: [{
			name: 'surah',
			type: 'STRING' as const,
			description: 'The surah number/name (Example: 1 or al-fatihah)',
			required: true
		}, {
			name: 'reciter',
			type: 'STRING' as const,
			description: 'The reciter name',
			required: false
		}]
	}, {
		name: 'page',
		type: 'SUB_COMMAND' as const,
		description: 'Plays a page (Example: /play page 342 hani al-rifai)',
		options: [{
			name: 'page',
			type: 'INTEGER' as const,
			description: 'The page number',
			required: true
		}, {
			name: 'reciter',
			type: 'STRING' as const,
			description: 'The reciter name',
			required: false
		}]
	}]
	voice = {
		connected: true
	}
	
	async run(ctx: CTX): Promise<void> {
		await ctx.deferReply()

		const commandName = ctx.options.getSubcommand(true) as 'page' | 'surah' | 'ayah'

		try {
			await this[commandName]?.(ctx)
		} catch (error) {
			if (typeof error === 'string') ctx.followUp(error)
			else console.error(error)
		}
	}

	async surah(ctx: CTX) {
		const reciter = (ctx.options.get('reciter')?.value as string ?? 'Mishary Alafasi').toLowerCase()
		let surah: string | number | null = ctx.options.get('surah')!.value as string

		if (isNaN(Number(surah))) {
			surah = await utils.getSurahIdByName(surah.toLowerCase())
		}

		surah = Number(surah)

		if (!surah || isNaN(surah) || surah < 0 || surah > SURAH_LIMIT) throw [
			'**Surah not found.** Use the surah\'s name or number. Examples: ',
			'`/play surah al-fatihah`',
			'`/play surah 1`'
		].join('\n\n')


		const reciters = await utils.getReciters('surah')
		const reciterInfo = reciters.find((obj) => obj.name.toLowerCase() === reciter)

		if (!reciterInfo)
			throw '**Couldn\'t find reciter!** Type `/reciters surah` for a list of available reciters.'

		const url = `${reciterInfo.server}/${toID(surah)}.mp3`

		ctx.client.getPlayer(ctx.guild.id).play(url)

		const {
			name,
			arabic_name
		} = await utils.getSurah(surah)

		return ctx.followUp(`🆔 | **Surah:** ${name} (${arabic_name})\n🗣️ | **Reciter:** ${reciterInfo.name}\n👤 | **Riwayah**: *${reciterInfo.riwayah}*`)
	}

	async page(ctx: CTX) {
		const page = ctx.options.getInteger('page', true)
		const reciter = (ctx.options.getString('reciter') ?? 'mishary al-afasy').toLowerCase()

		if (page < 0 || page > PAGE_LIMIT) 
			throw '**Sorry, the page must be between 1 and 604.**'
		if (!(reciter in EVERYAYAH_RECITERS)) 
			throw '**Couldn\'t find reciter!** Type `/reciters page` for a list of available reciters.'

		const pageId = toID(page)
		const url = `https://everyayah.com/data/${EVERYAYAH_RECITERS[reciter as keyof typeof EVERYAYAH_RECITERS]}/PageMp3s/Page${pageId}.mp3`

		ctx.client.getPlayer(ctx.guild.id).play(url)

		return ctx.followUp({
			files: [`https://www.searchtruth.org/quran/images2/large/page-${pageId}.jpeg`],
			content: `🗣️ | **Reciter:** ${utils.capitalize(reciter)}\n🆔 | **Page**: ${page}`
		})
	}
	
	async ayah(ctx: CTX) {
		const surah = ctx.options.getInteger('surah', true)
		const ayah = ctx.options.getInteger('ayah', true)
		const reciter = (ctx.options.getString('reciter') ?? 'Mishary Alafasi').toLowerCase()

		if (surah < 0 || surah > SURAH_LIMIT) throw [
			'**Surah not found.** Use the surah\'s number. Examples: ',
			'`/play ayah surah: 1 ayah: 6`'
		].join('\n\n')

		const verseCount = await utils.getVerseCount(surah)

		if (ayah > verseCount) throw `**There are only ${verseCount} verses in this surah.**`

		const reciterInfo = (await utils.getReciters('ayah')).find((obj) => obj.name.toLowerCase() === reciter)

		if (!reciterInfo)
			throw '**Couldn\'t find reciter!** Type `/reciters ayah` for a list of available reciters.'


		const url = `${reciterInfo.ayah_url}/${toID(surah)}${toID(ayah)}.mp3`

		ctx.client.getPlayer(ctx.guild.id).play(url)

		const {
			name,
			arabic_name
		} = await utils.getSurah(surah)

		return ctx.followUp({
			files: [`https://everyayah.com/data/QuranText_jpg/${surah}_${ayah}.jpg`],
			content: `🆔 | **Surah:** ${name} (${arabic_name}), Ayah ${ayah}.\n🗣️ | **Reciter:** ${reciterInfo.name} *(${reciterInfo.mushaf_type})*\n👤 | **Riwayah**: *${reciterInfo.riwayah}*`
		})
	}
}