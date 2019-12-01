import * as Discord from 'discord.js';
require('dotenv').config();

const tsukasa = new Discord.Client();


tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);
});

tsukasa.on('message', msg => {
});

tsukasa.login(process.env.TOKEN);
