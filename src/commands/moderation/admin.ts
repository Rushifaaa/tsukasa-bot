import { Message } from 'discord.js';
import { tsukasaConfig, ServerConfig } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const admin = (args: string[], msg: Message) => {
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json").toString());

    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> †git / Error -> ServerConfigs are not Created");
        return;
    }


    if (!args[0]) {
        msg.reply("Enter an ID, to grant a role permissions to manage this Bot.");
        return;
    }

    let newServerConfig: ServerConfig = {
        server_id: msg.guild.id,
        admin_id: args[0],
        autorole: {
            active: false,
        }
    }

    writeFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));
    msg.reply("I've updated the server config -> " + "`" + JSON.stringify(newServerConfig) + "`");

}
export default admin;