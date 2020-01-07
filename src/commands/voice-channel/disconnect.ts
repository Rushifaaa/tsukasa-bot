import { Message } from 'discord.js';
import { GuildData } from '../../main';

const disconnect = (args: string[], msg: Message, guildObjects: Map<string, GuildData>) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    const guild = guildObjects.get(msg.guild.id);

    if (msg.member.voiceChannel || msg.guild.voiceConnection) {
        if (msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {

            if (!guild) {
                msg.reply("Guild not found!");
                return;
            }

            msg.reply("see you, my darling!! :p :heart:");

            guild.isStoped = true;
            guild.songs = [];
            guild.dispatcher = null;
            msg.member.voiceChannel.leave();
            return;
        }
        msg.reply("you need to be in the same channel with me, darling! :heart:");
    } else {
        msg.reply("I need to be in a channel for that!");
    }
}
export default disconnect;