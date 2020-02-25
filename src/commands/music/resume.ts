import { Message } from 'discord.js';
import { GuildData } from '../../main';

const resume = (args: string[], msg: Message, guildData: Map<string, GuildData>): void => {
    // Checking if channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Getting the guild
    const guild = guildData.get(msg.guild.id);

    // Checking if guild is available
    if (!guild) {
        msg.reply("Server not found!");
        return;
    }

    // Checking if playstream is null
    if (!guild.dispatcher) {
        msg.reply("No Stream is running.");
        return;
    }

    // Checking if playstream is paused
    if (guild.dispatcher.paused) {
        guild.dispatcher.resume();
        msg.reply("Resuming the stream :heart:");
        return;
    }

    msg.reply("Nothing to resume, darling :heart:");
};
export default resume;