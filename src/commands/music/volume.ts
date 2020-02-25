import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { GuildData, ServerConfig, tsukasaConfig } from '../../main';
import { readFileSync, writeFileSync } from 'fs';

const volume = (args: string[], msg: Message, guildData: Map<string, GuildData>) => {

    if (!tsukasaConfig) {
        msg.reply("the hoster of this bot, does not have a config!");
        return;
    }

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    if (!permissionCheck(msg)) {
        return;
    }

    if (!args[0]) {
        msg.reply("you can set the volume from 0 to 100 - `†volume 20`");
        return;
    }

    const guild = guildData.get(msg.guild.id);

    if (!guild) {
        msg.reply("server config not found, please contact the developer `†git`");
        return;
    }

    if (!guild.dispatcher) {
        msg.reply("no stream is now running!");
        return;
    }

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

    const volumeValue = +args[0];

    if (!volumeValue) {
        msg.reply("please enter a number from 0 to 100.");
        return;
    }

    if (!(volumeValue <= 100)) {
        msg.reply("you cannot set a value aboth");
    }

    let newServerConfig: ServerConfig = {
        serverId: serverConfig.serverId,
        autorole: serverConfig.autorole,
        volume: volumeValue / 100,
        adminId: serverConfig.adminId,
        prefix: serverConfig.prefix
    }

    writeFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));

    guild.dispatcher.setVolumeLogarithmic(newServerConfig.volume);

}
export default volume;