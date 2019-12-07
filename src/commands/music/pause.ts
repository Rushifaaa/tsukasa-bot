import { Message } from 'discord.js';
import { GuildData } from '../../main';

const pause = (args: string[], msg: Message, guildData: Map<string, GuildData>) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    const guild = guildData.get(msg.guild.id);

    if (!guild) {
        msg.reply("Server not found!");
        return;
    }

    if (!guild.dispatcher) {
        msg.reply("No Stream is running.");
        return;
    }

    if (guild.dispatcher.paused) {
        msg.reply("Stream is already paused, darling :heart:");
        return;
    }

    guild.dispatcher.pause();
    msg.reply("I paused the stream for you, :heart:");
}
export default pause;