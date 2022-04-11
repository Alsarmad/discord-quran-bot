[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/TheMaestro1s/quran-bot)
[![Run on Repl.it](https://repl.it/badge/github/TheMaestro1s/quran-bot)](https://repl.it/github/TheMaestro1s/quran-bot)

# Quran bot

A simple bot that can play recitations of surahs, ayahs and mushaf pages from the Qur'an in voice chat, along with a live audio stream from Makkah. It currently supports 120+ reciters.


## 📌 Features
- Plays *ayah*, *surah* and *page* (`/play`)
- Supports 120+ reciters
- Accepts arabic reciter names (thanks to [arabic2franko](https://github.com/ahmadfathy97/arabic2franko))
- Islamic prayertimes (`/prayertimes`)
- Reading the quran (`/mushaf`)
- Live quran radio (`/live`)
- Check out `/help` command to see the full list!

## 🪄 Easy Deploy

- [repl.it](https://repl.it/github/TheMaestro1s/quran-bot)
- [heroku](https://heroku.com/deploy?template=https://github.com/TheMaestro1s/quran-bot)



## ⚙️ Setup (Advanced)

1. Download the [zip](https://github.com/TheMaestro1s/quran-bot.git) file and extract it
2. Go inside `quran-bot` folder
3. Create a file named `.env` add put the following in:

```
DISCORD_TOKEN=your-discord-token-here
```


4. Open the terminal and do the following:

```bash
$ npm install
$ npm start
```
5. That's it! open an [issue](https://github.com/TheMaestro1s/quran-bot/issues) if you need help!

## 🔌 Sources

 - [mp3quran.net](http://mp3quran.net/) for the surah recitations, ayah recitations and Qur'an radio.
 - [everyayah.com](https://everyayah.com/) for the page recitations.
 - [haramain.info](http://www.haramain.info/) for the live Makkah audio.


### 📝 License
Refer to the [LICENSE](LICENSE) file.