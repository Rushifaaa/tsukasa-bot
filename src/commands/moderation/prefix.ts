import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { tsukasaConfig, ServerConfig } from '../../main';
import { readFileSync } from 'fs';

const prefix = (args: string[], msg: Message): boolean | void => {

    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    // Checking permission with the permissionCheck function
    if (!permissionCheck(msg)) {
        return;
    }

    // Checking if the tsukasa config(bot config) is available
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return false;
    }

    // Getting the serverConfig
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    // Checking the serverConfig if it is available
    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> " + prefix + "git / Error -> ServerConfigs are not Created");
        return false;
    }

    // Checking args[0] if it is null
    if (!args[0]) {
        msg.reply("you can use " + serverConfig.prefix ? serverConfig.prefix : prefix + "prefix change [new_prefix] to change the Prefix.");
        return;
    }

};
export default prefix;