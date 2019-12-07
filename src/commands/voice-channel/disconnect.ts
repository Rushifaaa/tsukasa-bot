import { Message } from 'discord.js';
import { newSongQueue } from '../music/play';

const disconnect = (args: string[], msg: Message) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }
    
    if (msg.member.voiceChannel || msg.guild.voiceConnection) {
        if (msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {
            msg.reply("see you, my darling!! :p :heart:");
            newSongQueue.songs = [];
            msg.member.voiceChannel.leave();
            return;
        }
        msg.reply("you need to be in the same channel with me, darling! :heart:");
    } else {
        msg.reply("I need to be in a channel for that!");
    }
}
export default disconnect;