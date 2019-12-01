import * as Discord from 'discord.js';
require('dotenv').config();

const tsukasa = new Discord.Client();


tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);
    
    tsukasa.user.setPresence({
        status: "dnd",
        afk: true,
		game: {
			name: "how lucifer creates me",
			url: "https://github.com/Rushifaaa/tsukasa-bot",
			type: "WATCHING"
		}
    });
});

tsukasa.on('message', msg => {
});

tsukasa.login(process.env.TOKEN);
