import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { tsukasaConfig, ServerConfig } from '../../main';
import { readFileSync } from 'fs';

const prefix = (args: string[], msg: Message) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    if (!permissionCheck(msg)) {
        return;
    }

    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return false;
    }

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json").toString());

    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> " + prefix + "git / Error -> ServerConfigs are not Created");
        return false;
    }

    if (!args[0]) {
        msg.reply("you can use " + serverConfig.prefix ? serverConfig.prefix : prefix + "prefix change [new_prefix] to change the Prefix.");
        return;
    }


    



}
export default prefix;