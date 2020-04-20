# INDIBOT [![](https://img.shields.io/badge/Invite-Discord-blue)](https://discordapp.com/oauth2/authorize?client_id=437646177081622530&permissions=8&scope=bot)

Fourth iteration of the most obnoxious Discord bot (not anymore!)

Built with the [Discord-Akairo framework](https://github.com/discord-akairo/discord-akairo) and [Discord.js](https://discord.js.org).

## Overview

Back in 2017, I decided to mess around with what I considered (and still consider up to this date) a good library, Discord.js. It didn't do much, but I was happy with the result, even if it was useless. A year later, I asked myself if I could do a music bot, and surely I did, but it wasn't great. It kept crashing and was prone to errors since day one, as all commands were being executed in a single index.js file. That was INDIBOT `2.0`.

Yet another year passed by, and I decided add more stuff to the bot. I ended up adding a web module (which included a dashboard to modify guild settings and other stuff) and modernized how commands were executed. Sadly, it wasn't great, as it crashed even more than the old bot, and while the dashboard was great, it was completely unnecessary. That was INDIBOT `3.0`

That's why we are here. I would be lying if I didn't tell you that I decided to retake work on INDIBOT because of Discord adding [bot verification](https://support.discordapp.com/hc/es/articles/360040720412-Bot-Verification-and-Data-Whitelisting). As the old version kept crashing, I gave up maintaining it soon after deploying it, so it was down until today.

V4 was written from the ground up, so most of the issues involving the old codebase are gone. I decided to not include a web module this time, as it was inefficient. If someday the bot is in need of a web interface/dashboard, an API would probably be implemented instead of a fully fledged Express app.

But **most importantly**, INDIBOT is now open source 🎉! Since I kept getting bored of hosting the bot, releasing INDIBOT as OSS seems like the most benefitial option for both me and developers that want to dig into the code.

## Self-Hosting

> The following items are required: [**Discord Bot Account**](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) and [**Redis**](https://redis.io/)

> This section assumes that the user has basic knowledge of workflow in his/her machine (e.g: how to run a command shell). If not then ask everyone's bestfriend first, Google.

> **\$** denotes it should be executed at a command shell.

### Running

1. `$ git clone https://github.com/Indicardo/INDIBOT.git indibot && cd indibot`
2. [**Set up Redis**](https://redis.io/)
3. Modify .env.example with all your details, such as Discord Token, [Google API Key for YouTube](https://rapidapi.com/blog/how-to-get-youtube-api-key/) and Redis details.
4. `$ npm start`

## i18n

Remember I said that it's not obnoxious anymore? That's because it used to swear quite a bit. It doesn't anymore because it's now fully localized in English and Spanish. The best part is that you can add a locale or modify an existing one to say whatever you want! Check the `locales` folder under `src`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# License

> [**AGPL-3.0**](https://github.com/Indicardo/INDIBOT/blob/master/LICENSE)
