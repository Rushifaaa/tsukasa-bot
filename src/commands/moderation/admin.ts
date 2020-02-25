import { Message } from 'discord.js';
import { tsukasaConfig, ServerConfig, prefix } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const admin = (args: string[], msg: Message): void => {
    // Checking if Channel Type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    // Checking if tsukasa config exist
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    // Getting server config
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    // Checking if server config does exist
    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> " + prefix + "git / Error -> ServerConfigs are not Created");
        return;
    }

    // Checking for args -> prefix+command args[0] args[1] ...
    if (!args[0]) {
        msg.reply("Enter an ID, to grant a role permissions to manage this Bot.");
        return;
    }

    // Writing new ServerConfig with old values except the adminId
    const newServerConfig: ServerConfig = {
        serverId: msg.guild.id,
        adminId: args[0],
        autorole: {
            active: false,
        },
        volume: serverConfig.volume
    };

    // Writing the "newServerConfig" to the server config file
    writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));
    msg.reply("I've updated the server config -> " + "`" + JSON.stringify(newServerConfig) + "`");

};
export default admin;