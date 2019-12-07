import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { GuildData } from '../../main';

const skip = (args: string[], msg: Message, guildData: Map<string, GuildData>) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }
    
    if (!permissionCheck(msg)) {
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

    guild.dispatcher.end();

}
export default skip;