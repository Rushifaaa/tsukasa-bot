import { Client, StreamDispatcher } from 'discord.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { commands } from './command';
import { Song } from './commands/music/play';
//webhook test
const tsukasa = new Client();
export const configFilePath = __dirname + "/../config.json";
export let tsukasaConfig: TsukasaConfig | null = null;
const prefix = "†";
export const guildObjects = new Map<string, GuildData>();

export interface GuildData {
    dispatcher: StreamDispatcher | null;
    songs: Song[];
}

export interface TsukasaConfig {
    token: string;
    owner_id: string;
    data_folder: string;
    google_api_key: string;
}

export interface ServerConfig {
    server_id: string;
    admin_id?: string;
    autorole: {
        active: boolean;
        role_id?: string;
    };

}

tsukasa.on('ready', () => {
    console.log(`Logged in as ${tsukasa.user.tag}`);

    tsukasa.guilds.forEach(guild => {
        guildObjects.set(guild.id, {
            dispatcher: null,
            songs: []
        });

        let config: ServerConfig = {
            server_id: guild.id,
            autorole: {
                active: false
            }
        }
        //TODO: Music Default Channel where bot writes his messages for next song

        if (tsukasaConfig) {
            if (tsukasaConfig.data_folder) {
                if (!existsSync(tsukasaConfig.data_folder + "/" + guild.id)) {
                    mkdirSync(tsukasaConfig.data_folder + "/" + guild.id)
                    writeFileSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("Server Config for" + guild.name + "/" + guild.id + " was successfully created!");
                    return;
                }
                if (!existsSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json")) {
                    writeFileSync(tsukasaConfig.data_folder + "/" + guild.id + "/config.json", JSON.stringify(config));
                    console.log("Server Config for" + guild.name + "/" + guild.id + " was successfully created!");
                    return;
                }
            } else {
                console.log("No path found -> " + tsukasaConfig.data_folder);
            }
        }
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
    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + member.guild.id + "/config.json").toString());
    console.log(serverConfig);

    if (!serverConfig.autorole.active) return;
    if (!serverConfig.autorole.role_id) return;

    member.addRole(serverConfig.autorole.role_id).then(() => {
        console.log("Added Role to user" + member.displayName);
    }).catch(err => {
        console.log("An error occurred! -> " + err)
    });

    member.user.send("Test");
});

tsukasa.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    let args = msg.content.slice(prefix.length).trim().split(/ +/s);
    let commandName = args.shift();
    if (!commandName) return;
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

startServer()

