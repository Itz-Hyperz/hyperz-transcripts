# Hyperz-Transcripts

A simple DiscordJS V13 HTML Transcript NPM Module.

---

## Support

* [Discord](https://hyperz.net/discord)

* [Website](https://hyperz.net/)

---

## Installation

`npm i hyperz-transcripts@latest`

---

# Example Code

```javascript
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    partials: ["CHANNEL", "MESSAGE", "REACTIONS"],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});
const htc = require('hyperz-transcripts');
const htcore = new htc(false); // Boolean for debug mode

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if(message.content.startsWith(`!transcript`)) {
        let transcriptChannel = await client.channels.cache.get('TRANSCRIPT_LOGS_CHANNEL_ID')
        htcore.transcript({ message: message, channel: transcriptChannel  });
    }
});

client.login('TOKEN_HERE')
```

---

# Credits

- Created by [@Hyperz](https://hyperz.net/discord)