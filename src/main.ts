import { Client, Guild, TextChannel, GroupDMChannel, DMChannel, StreamDispatcher } from 'discord.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { commands } from './command';
import { Song } from './commands/music/play';

const tsukasa = new Client();

// The Path for the config File
export const configFilePath = __dirname + "/../config.json";

// Default Prefix
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
    ownerId: string;
    dataFolder: string;
    googleApiKey: string;
}

export interface ServerConfig {
    serverId: string;
    adminId?: string | null;
    autorole: {
        active: boolean;
        role_id?: string;
    };
    volume: number;
    prefix?: string | null;

}

async function startServer(): Promise<void> {

    // Checking if the config file exists
    if (!existsSync(configFilePath)) {

        // Creating new TsukasaConfig
        const newConfig: TsukasaConfig = {
            token: "TOKEN",
            ownerId: "Your Discord-ID",
            dataFolder: "Please enter a desired path for the data folder",
            googleApiKey: "Please enter a google API key for playlist support"
        };

        // Writing the File to the Filepath
        writeFileSync(configFilePath, JSON.stringify(newConfig));
        console.log("Config file was created, please set up!");
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

function createFolders(tsukasaConfig: TsukasaConfig | null, guild: Guild, config: ServerConfig): void {

    // Checking if the tsukasaConfig exists
    if (tsukasaConfig) {
        // Checking if the User wrote a path to the Data folder
        if (tsukasaConfig.dataFolder) {
            // If the data folder does not exist it will make one
            if (!existsSync(tsukasaConfig.dataFolder)) {

                console.log("Data folder not found... Creating one..");
                mkdirSync(tsukasaConfig.dataFolder);
                console.log("Data Folder created!");

                // recursive
                createFolders(tsukasaConfig, guild, config);

            } else { // If the data folder does exist it will create the guild folders

                // Checking if the guild folder doesn't exist to create one
                if (!existsSync(tsukasaConfig.dataFolder + "/" + guild.id)) {
                    mkdirSync(tsukasaConfig.dataFolder + "/" + guild.id);
                    writeFileSync(tsukasaConfig.dataFolder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("The Folder for", guild.name + "/" + guild.id, "\x1b[0m", "was successfully created!");
                    return;
                }

                // Checking if the config file doesn't exist to create one
                if (!existsSync(tsukasaConfig.dataFolder + "/" + guild.id + "/config.json")) {
                    writeFileSync(tsukasaConfig.dataFolder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("The Config file for", '\x1b[36m%s\x1b[0m', guild.name + "/" + guild.id, "\x1b[0m", "was successfully created!");
                    return;
                }

            }

        } else {
            console.log("No path found -> " + tsukasaConfig.dataFolder);
        }
    } else {
        console.log("Bot config not found... please contact the developer!");
    }

}

tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);

    // Setting for every Guild empty GuildObjects and ServerConfig
    tsukasa.guilds.forEach(guild => {
        guildObjects.set(guild.id, {
            dispatcher: null,
            isStoped: false,
            songs: []
        });

        const config: ServerConfig = {
            serverId: guild.id,
            adminId: null,
            autorole: {
                active: false
            },
            volume: 0.15,
            prefix: null
        };

        //TODO: Music Default Channel where bot writes his messages for next song

        // Calling the method to create Folders 
        createFolders(tsukasaConfig, guild, config);

    });

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
});

tsukasa.on('guildMemberAdd', async member => {
    if (!tsukasaConfig) return;
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + member.guild.id + "/config.json").toString());
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
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.member.guild.id + "/config.json").toString());

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

        commandFound = true;
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

startServer();