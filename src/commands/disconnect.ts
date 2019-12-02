import { Message } from 'discord.js';

const disconnect = (args: string[], msg: Message) => {
    if (msg.member.voiceChannel && msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {
        msg.reply("see you, my darling!! :p :heart:");
        msg.member.voiceChannel.leave();
    } else {
        msg.reply("you need to be in the same channel with me, darling! :heart:");
    }
}
export default disconnect;