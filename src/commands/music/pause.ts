import { Message } from 'discord.js';
import { GuildData } from '../../main';

const pause = (args: string[], msg: Message, guildData: Map<string, GuildData>): void => {
    
    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Getting the guild
    const guild = guildData.get(msg.guild.id);

    // Checking if guild is null
    if (!guild) {
        msg.reply("Server not found!");
        return;
    }

    // Checking if guild dispatcher is null
    if (!guild.dispatcher) {
        msg.reply("No Stream is running.");
        return;
    }

    // Checking if audio stream is paused
    if (guild.dispatcher.paused) {
        msg.reply("Stream is already paused, darling :heart:");
        return;
    }

    // Pausing the audio stream
    guild.dispatcher.pause();
    msg.reply("I paused the stream for you, :heart:");

};
export default pause;