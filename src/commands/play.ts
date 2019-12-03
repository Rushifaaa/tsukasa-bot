import { Message, VoiceChannel, StreamDispatcher } from 'discord.js';
import ytdl = require('ytdl-core');
import { GuildObject } from '../main';

export interface SongQueue {
    songs: Song[];
}

export interface Song {
    title: string;
    url: string;
}

export let newSongQueue: SongQueue = {
    songs: []
}

const play = async (args: string[], msg: Message, guildObjects: Map<string, GuildObject>) => {
    const guild = guildObjects.get(msg.guild.id);
    if (!guild) {
        msg.reply("Guild not found!");
        return;
    }

    var songInfo = await ytdl.getInfo(args[0]);

    var newSong: Song = {
        title: songInfo.title,
        url: songInfo.video_url
    }

    guild.songs.push(newSong);

    const voiceChannel = msg.member.voiceChannel;

    if (!msg.guild.me.voiceChannel) {
        msg.reply("I am not in a Channel darling! :heart:");
        return;
    }

    const perms = voiceChannel.permissionsFor(msg.client.user);

    if (!perms) return;
    if (!perms.has("SPEAK")) {
        msg.reply("I dont have any permissions to speak in this channel!");
        return;
    }

    playSong(guild, voiceChannel, msg);

}

function playSong(guild: GuildObject, vc: VoiceChannel, msg: Message) {
    if (guild.dispatcher) {
        return;
    }

    guild.dispatcher = vc.connection.playStream(ytdl(guild.songs[0].url, { filter: 'audioonly' }))
        .on('end', () => {

            guild.songs.shift();
            guild.dispatcher = null;
            if (guild.songs.length === 0) {
                msg.reply("no more songs, please give links! :heart:");
                return;
            } else {
                playSong(guild, vc, msg);
            }
        })
        .on('start', () => {
            msg.reply("now playing -> " + guild.songs[0].title);
        })
        .on('error', error => {
            console.log(error);
        });
    guild.dispatcher.setVolumeLogarithmic(100 / 100);
}

export default play;