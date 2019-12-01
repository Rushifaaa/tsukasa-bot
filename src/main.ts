import { Client, Role } from 'discord.js';
import commands from './commands/commands';

require('dotenv').config();

const tsukasa = new Client();


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

tsukasa.on('guildMemberAdd', member => {
   member.addRole("508733818547601447").then(() => {
       console.log("Added Role to user" + member.displayName);
   }).catch(err => {
       console.log("An error occurred! -> " + err)
   });
});

tsukasa.on('message', msg => {
    new commands(msg, tsukasa).commands()
});

tsukasa.login(process.env.TOKEN);
