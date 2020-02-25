import { Message } from 'discord.js';
import { tsukasaConfig, ServerConfig, prefix } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const admin = (args: string[], msg: Message) => {
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> " + prefix + "git / Error -> ServerConfigs are not Created");
        return;
    }


    if (!args[0]) {
        msg.reply("Enter an ID, to grant a role permissions to manage this Bot.");
        return;
    }

    let newServerConfig: ServerConfig = {
        serverId: msg.guild.id,
        adminId: args[0],
        autorole: {
            active: false,
        },
        volume: serverConfig.volume
    }

    writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));
    msg.reply("I've updated the server config -> " + "`" + JSON.stringify(newServerConfig) + "`");

}
export default admin;