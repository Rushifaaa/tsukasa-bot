import { Message } from 'discord.js';
import ytdl = require('ytdl-core');

const play = (args: string[], msg: Message) => {
    if (!msg.guild.me.voiceChannel) {
        msg.reply("I am not in a Channel darling! :heart:");
    }

    msg.reply(args.toString());

    const dispatcher = msg.member.voiceChannel.connection.playStream(ytdl(args[0]))
        .on('end', () => {
            msg.reply("No music");
        })
        .on('error', error => {
            console.log(error);
        });
    dispatcher.setVolumeLogarithmic(100 / 100);
}
export default play;