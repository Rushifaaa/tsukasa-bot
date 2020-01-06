import { Message, VoiceChannel, VoiceConnection } from 'discord.js';

const join = async (args: string[], msg: Message) => {

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }
    
    const voiceChannel: VoiceChannel = msg.member.voiceChannel;
    if (voiceChannel) {
        //TODO: perms permissions.has("CONNECT")?
        voiceChannel.join()
            .then(() => {
                msg.reply("now I'm in the channel where you are! :heart:");
            })
            .catch(err => {
                msg.reply(err);
            });
    } else {
        msg.reply('you need to join a voice channel first!');
    }
}
export default join;