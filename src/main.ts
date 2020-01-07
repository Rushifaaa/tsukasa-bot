import { Client, StreamDispatcher, Guild, TextChannel, GroupDMChannel, DMChannel } from 'discord.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { commands } from './command';
import { Song } from './commands/music/play';

const tsukasa = new Client();

export const configFilePath = __dirname + "/../config.json";
export const prefix = "†";
export let tsukasaConfig: TsukasaConfig | null = null;
export const guildObjects = new Map<string, GuildData>();

export interface GuildData {
    dispatcher: StreamDispatcher | null;
    songs: Song[];
    isStoped: boolean;
    lastChannel?: TextChannel | DMChannel | GroupDMChannel | null;
}

export interface TsukasaConfig {
    token: string;
    owner_id: string;
    data_folder: string;
    google_api_key: string;
}

export interface ServerConfig {
    server_id: string;
    admin_id?: string | null;
    autorole: {
        active: boolean;
        role_id?: string;
    };
    volume: number;
    prefix?: string | null;

}

tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);

    tsukasa.guilds.forEach(guild => {
        guildObjects.set(guild.id, {
            dispatcher: null,
            isStoped: false,
            songs: []
        });

        let config: ServerConfig = {
            server_id: guild.id,
            admin_id: null,
            autorole: {
                active: false
            },
            volume: 0.15,
            prefix: null
        }

        //TODO: Music Default Channel where bot writes his messages for next song

        createFolders(tsukasaConfig, guild, config);

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
        isStoped: false,
        songs: []
    });
})

tsukasa.on('guildMemberAdd', async member => {
    if (!tsukasaConfig) return;
    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + member.guild.id + "/config.json").toString());
    console.log(serverConfig);

    if (!serverConfig.autorole.active) return;
    if (!serverConfig.autorole.role_id) return;

    try {
        const guildMember = await member.addRole(serverConfig.autorole.role_id);
        console.log("Autorole:", guildMember);
    } catch (err) {
        console.log("An error occurred! -> " + err);
    }

    member.user.send("Test");
});

tsukasa.on('message', msg => {
    if (!tsukasaConfig) return;
    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + msg.member.guild.id + "/config.json").toString());

    let args = msg.content.slice(prefix.length).trim().split(/ +/s);

    if (!serverConfig.prefix) {
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;
        args = msg.content.slice(prefix.length).trim().split(/ +/s);
    } else {
        if (!msg.content.startsWith(serverConfig.prefix) || msg.author.bot) return;
        args = msg.content.slice(serverConfig.prefix.length).trim().split(/ +/s);
    }


    let commandName = args.shift();
    if (!commandName) return;
    commandName = commandName.toLowerCase();

    let commandFound = false;
    for (const cmd of commands) {

        if (cmd.name !== commandName && !cmd.aliases.includes(commandName)) continue;

        commandFound = true
        const retNumber = cmd.invoke(args, msg, guildObjects);
        console.log(`The user ${msg.author.id}/${msg.author.username} executed the command "${commandName}" with args: ${args[0] ? args[0] : "null"}.`);
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
        owner_id: "Your Discord-ID",
        data_folder: "Please enter a desired path for the data folder",
        google_api_key: "Please enter a google API key for playlist support"
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

function createFolders(tsukasaConfig: TsukasaConfig | null, guild: Guild, config: ServerConfig) {

    if (tsukasaConfig) {
        if (tsukasaConfig.data_folder) {
            if (!existsSync(tsukasaConfig.data_folder)) {

                console.log("Data folder not found... Creating one..");
                mkdirSync(tsukasaConfig.data_folder);
                console.log("Data Folder created!");

                // recursive
                createFolders(tsukasaConfig, guild, config);
            } else {

                if (!existsSync(tsukasaConfig.data_folder + "/" + guild.id)) {
                    mkdirSync(tsukasaConfig.data_folder + "/" + guild.id);
                    writeFileSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("The Folder for", '\x1b[36m%s\x1b[0m', guild.name + "/" + guild.id, "\x1b[0m", "was successfully created!");
                    return;
                }

                if (!existsSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json")) {
                    writeFileSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("The Config file for", '\x1b[36m%s\x1b[0m', guild.name + "/" + guild.id, "\x1b[0m", "was successfully created!");
                    return;
                }

            }

        } else {
            console.log("No path found -> " + tsukasaConfig.data_folder);
        }
    } else {
        console.log("Bot config not found... please contact the developer!");
    }

}

startServer()