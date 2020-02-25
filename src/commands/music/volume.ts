import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { GuildData, ServerConfig, tsukasaConfig } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const volume = (args: string[], msg: Message, guildData: Map<string, GuildData>): void => {

    // Checking if the tsukasa config is available
    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Checking the permission with the "permissionCheck" function
    if (!permissionCheck(msg)) {
        return;
    }

    // Checking args[0] if it is null
    if (!args[0]) {
        msg.reply("you can set the volume from 0 to 100 - `†volume 20`");
        return;
    }

    // Getting the guild 
    const guild = guildData.get(msg.guild.id);

    // Checking if the guild is available
    if (!guild) {
        msg.reply("server config not found, please contact the developer `†git`");
        return;
    }

    // Checking if a dispatcher is not available
    if (!guild.dispatcher) {
        msg.reply("no stream is now running!");
        return;
    }

    // getting the server config
    const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    // convertig the string to a number
    const volumeValue = +args[0];

    // Checking if volumeValue is a number
    if (typeof (volumeValue) == "number") {
        msg.reply("please enter a number from 0 to 100.");
        return;
    }

    // Checking if volumeValue is lowerOrEqual 100
    if (!(volumeValue <= 100)) {
        msg.reply("you cannot set a value aboth");
    }

    // Creating the new server config with the old values except the volume
    const newServerConfig: ServerConfig = {
        serverId: serverConfig.serverId,
        autorole: serverConfig.autorole,
        volume: volumeValue / 100,
        adminId: serverConfig.adminId,
        prefix: serverConfig.prefix
    };

    // Writing the "newServerConfig" to the server config file
    writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));

    // Setting the volume with the given value
    guild.dispatcher.setVolumeLogarithmic(newServerConfig.volume);

};
export default volume;