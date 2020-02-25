import { Message } from 'discord.js';
import { ServerConfig, tsukasaConfig, prefix } from '../../main';
import { readFileSync, writeFileSync } from 'fs';
import permissionCheck from '../../utility/permissionCheck';

const autorole = (args: string[], msg: Message): boolean | void => {
    // Checking if channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    // Calling the permissionCheck function
    if (!permissionCheck(msg)) {
        return;
    }

    // Checking if the tsukasa config (bot config) exist
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return false;
    }

    // Getting the server config
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    // Checking if the server config is available
    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> " + prefix + "git / Error -> ServerConfigs are not Created");
        return false;
    }

    // Checking if args[0] is null
    if (!args[0]) {
        msg.reply("please enter a subcommand.");
        msg.channel.send("†autorole role [role_id] AND †autorole activate \"true\" or \"false\"", { code: true });
        msg.channel.send("role -> Sets a given default role that will assign to every user that joins. AND activate -> Activates/Deactivates the `role on join` feature with `false` or `true`.");
        return;
    }

    // Checking if args[0] equals "role"
    if (args[0] === "role") {
        if (!args[1]) {
            msg.reply("please enter `†autorole role [role_id]` -> [role_id] should be the role that will be assigned to a new user on this server (when the user joins).");
            return;
        }

        // Creating new server config with old values except roleId
        const newServerConfig: ServerConfig = {
            serverId: msg.guild.id,
            adminId: serverConfig.adminId,
            autorole: {
                active: serverConfig.autorole.active,
                roleId: args[1]
            },
            volume: serverConfig.volume
        };

        // Writing the "newServerConfig" to the server config
        writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));
        msg.reply("default role was set.");
        return;
    }

    // Checking if roleId exist in the server config
    if (!serverConfig.autorole.roleId) {
        msg.reply("please write `†autorole role [role_id]` role_id should be the id of the role.");
        return;
    }

    // Checking if args[0] equals "active"
    if (args[0] === "activate") {
        if (!args[1]) {
            msg.reply("please write †autorole activate `true` to activate and `false` to deactivate");
            return;
        }

        let shouldActivate = false;

        // Checking if args[1] equals "true"
        if (args[1] === "true") {
            shouldActivate = true;
        } else if (args[1] === "false") {
            shouldActivate = false;
        } else {
            msg.reply("please just write `true` or `false`");
        }

        // Creating the new server config with old values except active(boolean)
        const newServerConfig: ServerConfig = {
            serverId: msg.guild.id,
            adminId: serverConfig.adminId,
            autorole: {
                active: shouldActivate,
                roleId: serverConfig.autorole.roleId
            },
            volume: serverConfig.volume
        };

        // Writing the "newServerConfig" to the server config
        writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));

    }

};
export default autorole;