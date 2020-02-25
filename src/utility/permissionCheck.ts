import { Message } from "discord.js";
import { tsukasaConfig, ServerConfig } from "../main";
import { readFileSync } from "fs";

const permissionCheck = (msg: Message): boolean => {

    // Checking if tsukasa config (bot config) is available
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return false;
    }

    // Getting the server config
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    // Checking if the server config is available
    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> †git / Error -> ServerConfigs are not Created");
        return false;
    }

    // Checking if the amdinId is available in the config
    if (!serverConfig.adminId) {
        msg.reply("please set a role to grant permissions for managing this bot. †admin [role_id] -> [role_id] should be the id of the role that should manage this Bot.");
        return false;
    }

    // Checking if the user that sent the message has the id as in the server config
    if (!msg.member.roles.has(serverConfig.adminId)) {
        msg.reply(msg.member.roles.get(serverConfig.adminId));
        msg.reply("you don't have permissions to perform this command!");
        return false;
    }

    return true;
};
export default permissionCheck;