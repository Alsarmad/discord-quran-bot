import fetch from 'node-fetch'
import RECITERS from './assets/reciters.json'

export function capitalize(text: string): string {
	return text.split(' ').map((str) => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ')
}

export async function getRecitersData(type: 'ayah' | 'surah' = 'surah') {
	const url = type !== 'ayah' ? 'http://mp3quran.net/api/_english.php' : 'https://api.mp3quran.net/verse/verse_en.json'
	const response = await fetch(url)

	if (response.ok)
		return await response.json() as {
			reciters: Record<string, string>[],
			reciters_verse: Record<string, string>[]
		}

	throw new Error('The api returned an invalid response, try again later')
}

export async function getReciters(type: 'page' | 'surah' | 'ayah'): Promise<{ [key: string]: string }[]> {
	if (type === 'page') {
		return Object.keys(RECITERS).map((name) => ({ name: capitalize(name) }))
	}

	const data = await getRecitersData(type)
	const temp: string[] = []

	if (type === 'ayah') {
		return data.reciters_verse
			.filter((obj) => !['0', ''].includes(obj.audio_url_bit_rate_128))
			.map((obj) => {
				return {
					name: obj.name,
					riwayah: obj.rewaya,
					mushaf_type: obj.musshaf_type,
					ayah_url: obj.audio_url_bit_rate_128
				}
			}).map((obj) => {
				if (!temp.includes(obj.mushaf_type)) {
					temp.push(obj.mushaf_type)
					obj.name = `${obj.name} - ${obj.mushaf_type}`
				}
				return obj
			})
	} else {
		return data.reciters
			.filter((obj) => Number(obj.count) >= 90)
			.map((obj) => ({
				name: obj.name,
				riwayah: obj.rewaya,
				server: obj.Server
			})).map((obj) => {
				if (!temp.includes(obj.riwayah)) {
					temp.push(obj.riwayah)
					obj.name = `${obj.name} - ${obj.riwayah}`
				}
				return obj
			})
	}
}



export async function getVerseCount(surah: number): Promise<number> {
	const response = await fetch(`http://api.quran.com/api/v3/chapters/${surah}`)

	if (response.ok) {
		const data = await response.json() as { chapter: { verses_count: string } }
		return Number(data.chapter.verses_count)
	}

	throw new Error('The api returned an invalid response, try again later')
}

export async function getSurah(surah: number): Promise<{
	name: string
	arabic_name: string
}> {
	const response = await fetch(`http://api.quran.com/api/v3/chapters/${surah}`)

	if (response.ok) {
		const data = await response.json() as {
			chapter: {
				name_simple: string,
				name_arabic: string
			}
		}

		return {
			name: data.chapter.name_simple,
			arabic_name: data.chapter.name_arabic
		}
	}

	throw new Error('The api returned an invalid response, try again later')
}


export async function getSurahNames(): Promise<{ [key: string]: string }> {
	const response = await fetch('http://api.quran.com/api/v3/chapters')

	if (response.ok) {
		const data = await response.json() as {
			chapters: [{ id: string, name_simple: string }]
		}

		const names: Record<string, string> = {}

		for (const surah of data.chapters) {
			names[surah.name_simple.toLowerCase()] = surah.id
		}

		return names
	}

	throw new Error('The api returned an invalid response, try again later')
}

export async function getSurahIdByName(name: string): Promise<string | null> {
	const names = await getSurahNames()
	return names[name] ?? null
}

export async function getPrayerTimes(location: string, method = 5, school = 0): Promise<{ [key: string]: string }> {
	const response = await fetch(`http://api.aladhan.com/timingsByAddress?address=${location}&method=${method}&school=${school}`, {
		headers: {
			'content-type': 'application/json'
		}
	})

	if (response.ok) {
		const data = await response.json() as {
			data: {
				timings: Record<string, string>,
				readable: string
			}
		}

		const times = data.data.timings
		return {
			fajr: times.Fajr,
			sunrise: times.Sunrise,
			dhuhr: times.Dhuhr,
			asr: times.Asr,
			maghrib: times.Maghrib,
			isha: times.Isha,
			imsak: times.Imsak,
			midnight: times.Midnight,
			date: data.data.readable
		}
	}

	throw new Error('The api returned an invalid response, try again later')
}