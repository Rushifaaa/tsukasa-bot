import { Message } from 'discord.js';
import { GuildData } from '../../main';

const resume = (args: string[], msg: Message, guildData: Map<string, GuildData>) => {

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
        guild.dispatcher.resume();
        msg.reply("Resuming the stream :heart:");
        return;
    }

    msg.reply("Nothing to resume, darling :heart:");
}
export default resume;