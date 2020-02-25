import { Message } from 'discord.js';
import { GuildData } from '../../main';

const stop = (args: string[], msg: Message, guildObjects: Map<string, GuildData>): void => {
    // Getting the guild
    const guild = guildObjects.get(msg.guild.id);

    // Checking if the guild is available
    if (!guild) {
        msg.reply("Server not found!");
        return;
    }

    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Checking if dispatcher is available
    if (!guild.dispatcher) return;

    /*
    
        Ending the dispatcher,
        setting the dispatcher to null
        setting the isStoped boolean to true
        setting the songs array to an empty array

    */
    guild.dispatcher.end();
    guild.dispatcher = null;
    guild.isStoped = true;
    guild.songs = [];

};
export default stop;