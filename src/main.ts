import { Client } from 'discord.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { commands } from '../command';

require('dotenv').config();

const tsukasa = new Client();
const configFilePath = __dirname + "/../config.json";
const prefix = "†";

interface TsukasaConfig {
    token: string;
}

tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);

    //TODO: Make json file for each server that uses Bot

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
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    let args = msg.content.slice(prefix.length).trim().split(/ +/s);
    let commandName = args.shift().toLowerCase();

    let commandFound = false;
    for (const cmd of commands) {
        if (cmd.name == commandName || cmd.aliases.includes(commandName)) {
            commandFound = true
            cmd.invoke(args, msg);
            break;
        }
    }
    if (!commandFound) {
        msg.reply("this command is not Supported. If you wish to support this command, write me an issue on GitHub -> †git ");
    }
});

async function startServer() {
    let newConfig: TsukasaConfig = {
        token: "TOKEN"
    };

    if (!existsSync(configFilePath)) {
        writeFileSync(configFilePath, JSON.stringify(newConfig));
        console.log("Config file was created, please set up!")
        return;
    }

    try {
        const config: TsukasaConfig = JSON.parse(readFileSync(configFilePath).toString());
        tsukasa.login(config.token);
    } catch (error) {
        console.log("Fix config file please, could be empty?", error);
    }
}

startServer()

