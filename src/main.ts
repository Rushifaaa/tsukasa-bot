import { Client, StreamDispatcher } from 'discord.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { commands } from './command';
import { Song } from './commands/play';

const tsukasa = new Client();
export const configFilePath = __dirname + "/../config.json";
export let tsukasaConfig: TsukasaConfig | null = null;
const prefix = "†";
export const guildObjects = new Map<string, GuildObject>();

export interface GuildObject {
    dispatcher: StreamDispatcher | null;
    songs: Song[];
}

export interface TsukasaConfig {
    token: string;
    owner_id: string;
    autorole: {
        active: boolean;
        role_id: string;
    },
    data_folder: string;
}

tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);

    tsukasa.guilds.forEach(guild => {
        guildObjects.set(guild.id, {
            dispatcher: null,
            songs: []
        });
    })

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

tsukasa.on("guildCreate", guild => {
    guildObjects.set(guild.id, {
        dispatcher: null,
        songs: []
    });
})

tsukasa.on('guildMemberAdd', member => {
    if (!tsukasaConfig) return;

    if (!tsukasaConfig.autorole.active) return;

    //TODO: Wirte command to activate autorole or deactivate (with serverConfig)

    member.addRole(tsukasaConfig.autorole.role_id).then(() => {
        console.log("Added Role to user" + member.displayName);
    }).catch(err => {
        console.log("An error occurred! -> " + err)
    });
});

tsukasa.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    let args = msg.content.slice(prefix.length).trim().split(/ +/s);
    let commandName = args.shift();
    if(!commandName) return;
    commandName = commandName.toLowerCase();

    let commandFound = false;
    for (const cmd of commands) {

        if (cmd.name !== commandName && !cmd.aliases.includes(commandName)) continue;

        commandFound = true
        const retNumber = cmd.invoke(args, msg, guildObjects);
        if (retNumber === 1) {
            tsukasa.destroy();
        }
        break;
    }
    if (!commandFound) {
        msg.reply("this command is not Supported. If you wish to support this command, write me an issue on GitHub -> †git ");
    }
});

async function startServer() {
    let newConfig: TsukasaConfig = {
        token: "TOKEN",
        owner_id: "YOUR ID !!!IMPORTANT!!!",
        autorole: {
            active: false,
            role_id: "Enter default role id"
        },
        data_folder: "Please enter a desired path for the data folder"
    };

    if (!existsSync(configFilePath)) {
        writeFileSync(configFilePath, JSON.stringify(newConfig));
        console.log("Config file was created, please set up!")
        return;
    }

    try {
        tsukasaConfig = JSON.parse(readFileSync(configFilePath).toString());
        if (!tsukasaConfig) return;

        tsukasa.login(tsukasaConfig.token);
    } catch (error) {
        console.log("Fix config file please, could be empty?", error);
    }
}

startServer()

