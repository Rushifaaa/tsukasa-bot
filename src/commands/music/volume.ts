import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { GuildData } from '../../main';

const volume = (args: string[], msg: Message, guildData: Map<string, GuildData>) => {

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

    const volumeValue = +args[0];
    if (!volumeValue) {
        msg.reply("please enter a number from 0 to 100.");
        return;
    }

    guild.dispatcher.setVolumeLogarithmic(volumeValue / 100.0);

}
export default volume;