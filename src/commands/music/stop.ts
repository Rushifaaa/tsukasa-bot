import { Message } from 'discord.js';
import { GuildData } from '../../main';

const stop = (args: string[], msg: Message, guildObjects: Map<string, GuildData>) => {
    const guild = guildObjects.get(msg.guild.id);

    if (!guild) {
        msg.reply("Server not found!");
        return;
    }

    if (!guild.dispatcher) return;
    guild.dispatcher.end();
    guild.dispatcher = null;
    //guild.songs = [];

}
export default stop;