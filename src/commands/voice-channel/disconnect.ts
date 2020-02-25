import { Message } from 'discord.js';
import { GuildData } from '../../main';

const disconnect = (args: string[], msg: Message, guildObjects: Map<string, GuildData>): void => {

    // Checking if the channel type is dm 
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Getting the guild
    const guild = guildObjects.get(msg.guild.id);

    // Checking if the bot is in a voicechannel or has a voice connection
    if (msg.member.voiceChannel || msg.guild.voiceConnection) {
        // Checking if the user is in the same channel as the bot
        if (msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {

            // Checking if guld is available
            if (!guild) {
                msg.reply("Guild not found!");
                return;
            }

            
            msg.reply("see you, my darling!! :p :heart:");
            /**
             * Setting the isStoped boolean to true
             * Setting the songs array to an empty array
             * Setting the dispatcher to null
             * Leaving the channel
             */
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
};
export default disconnect;