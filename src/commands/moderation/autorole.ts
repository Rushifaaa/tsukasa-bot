import { Message } from 'discord.js';
import { ServerConfig, tsukasaConfig } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const autorole = (args: string[], msg: Message) => {
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json").toString());

    if (!serverConfig) {
        msg.reply("please contact the Developer. Developer -> †git / Error -> ServerConfigs are not Created");
        return;
    }

    if (!serverConfig.admin_id) {
        msg.reply("please set a role to grant permissions for managing this bot. †admin [role_id] -> [role_id] should be the id of the role that should manage this Bot.")
        return;
    }


    if (!msg.member.roles.has(serverConfig.admin_id)) {
        msg.reply(msg.member.roles.get(serverConfig.admin_id));
        msg.reply("you don't have permissions to perform this command!");
        return;
    }

    if (!args[0]) {
        msg.reply("please enter a subcommand.")
        msg.channel.send("†autorole role [role_id] AND †autorole activate \"true\" or \"false\"", { code: true });
        msg.channel.send("role -> Sets a given default role that will assign to every user that joins. AND activate -> Activates/Deactivates the `role on join` feature with `false` or `true`.");
        return;
    }

    if (args[0] === "role") {
        if (!args[1]) {
            msg.reply("please enter `†autorole role [role_id]` -> [role_id] should be the role that will be assigned to a new user on this server (when the user joins).");
            return;
        }

        let newServerConfig: ServerConfig = {
            server_id: msg.guild.id,
            admin_id: serverConfig.admin_id,
            autorole: {
                active: serverConfig.autorole.active,
                role_id: args[1]
            }
        }

        writeFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));
        msg.reply("default role was set.");
        return;
    }

    if (!serverConfig.autorole.role_id) {
        msg.reply("please write `†autorole role [role_id]` role_id should be the id of the role.");
        return;
    }

    if (args[0] === "activate") {
        if (!args[1]) {
            msg.reply("please write †autorole activate `true` to activate and `false` to deactivate");
            return;
        }

        let shouldActivate = false

        if (args[1] === "true") {
            shouldActivate = true;
        } else if (args[1] === "false") {
            shouldActivate = false;
        } else {
            msg.reply("please just write `true` or `false`");
        }

        let newServerConfig: ServerConfig = {
            server_id: msg.guild.id,
            admin_id: serverConfig.admin_id,
            autorole: {
                active: shouldActivate,
                role_id: serverConfig.autorole.role_id
            }
        }

        writeFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));

    }

}
export default autorole;