import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';
import { GuildData } from '../../main';

const skip = (args: string[], msg: Message, guildData: Map<string, GuildData>): void => {

    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Checking the permission with the "permissionCheck" function
    if (!permissionCheck(msg)) {
        return;
    }

    // Getting the guild
    const guild = guildData.get(msg.guild.id);

    // Checking if the Guild is available
    if (!guild) {
        msg.reply("server config not found, please contact the developer `†git`");
        return;
    }

    // Checking if the dispatcher is null
    if (!guild.dispatcher) {
        msg.reply("no stream is now running!");
        return;
    }

    // Ending the playstream
    guild.dispatcher.end();

};
export default skip;