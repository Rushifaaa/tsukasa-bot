import { Message, VoiceChannel, StreamDispatcher } from 'discord.js';
import ytdl = require('ytdl-core');
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
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

    console.log(guild.songs);

    playSong(guild, voiceChannel);

}

function playSong(guild: GuildObject, vc: VoiceChannel) {
    if (guild.dispatcher) {
        return;
    }

    guild.dispatcher = vc.connection.playStream(ytdl(guild.songs[0].url))
        .on('end', () => {

            guild.songs.shift();

            if (guild.songs.length === 0) {
                guild.dispatcher = null
            } else {
                playSong(guild, vc);
            }
        })
        .on('error', error => {
            console.log(error);
        });
    guild.dispatcher.setVolumeLogarithmic(100 / 100);
}

export default play;