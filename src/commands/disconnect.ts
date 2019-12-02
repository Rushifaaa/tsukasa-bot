import { Message } from 'discord.js';
import { newSongQueue } from './play';

const disconnect = (args: string[], msg: Message) => {
    if (msg.member.voiceChannel && msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {
        msg.reply("see you, my darling!! :p :heart:");
        newSongQueue.songs = [];
        msg.member.voiceChannel.leave();
    } else {
        msg.reply("you need to be in the same channel with me, darling! :heart:");
    }
}
export default disconnect;