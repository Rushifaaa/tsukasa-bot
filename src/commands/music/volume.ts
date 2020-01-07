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

    let serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json").toString());

    const volumeValue = +args[0];

    if (!volumeValue) {
        msg.reply("please enter a number from 0 to 100.");
        return;
    }

    if (!(volumeValue <= 100)) {
        msg.reply("you cannot set a value aboth");
    }

    let newServerConfig: ServerConfig = {
        server_id: serverConfig.server_id,
        autorole: serverConfig.autorole,
        volume: volumeValue / 100,
        admin_id: serverConfig.admin_id,
        prefix: serverConfig.prefix
    }

    writeFileSync(tsukasaConfig.data_folder + "/" + msg.guild.id + "/config.json", JSON.stringify(newServerConfig));

    guild.dispatcher.setVolumeLogarithmic(newServerConfig.volume);

}
export default volume;