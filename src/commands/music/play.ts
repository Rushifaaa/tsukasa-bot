import { Message, VoiceChannel, StreamDispatcher } from 'discord.js';
import ytdl = require('ytdl-core');
import { GuildData, tsukasaConfig } from '../../main';
import * as YouTube from 'simple-youtube-api';

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

const play = async (args: string[], msg: Message, guildObjects: Map<string, GuildData>) => {

    if (!tsukasaConfig) {
        return;
    }

    const youtube = new YouTube(tsukasaConfig.google_api_key);

    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    const guild = guildObjects.get(msg.guild.id);

    if (!guild) {
        msg.reply("Guild not found!");
        return;
    }

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

    if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

        try {
            const playlist = await youtube.getPlaylist(args[0]);
            const videos = await playlist.getVideos();

            msg.reply(`Fetching ${videos.length}... Could take some while :P :rofl:`);

            for (const video of videos) {
                if (guild.isStoped) {
                    guild.isStoped = false;
                    break;
                } else {
                    try {
                        var songInfo = await ytdl.getInfo(video.url);

                        var newSong: Song = {
                            title: songInfo.title,
                            url: songInfo.video_url
                        }

                        guild.songs.push(newSong);

                        playSong(guild, voiceChannel, msg);
                    } catch (error) {
                        console.log(`An error occurred -> ${error}`);
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }

        return;
    } else {
        console.log("Link does not match to an Playlist on YouTube");
    }

    try {
        var songInfo = await ytdl.getInfo(args[0]);

        var newSong: Song = {
            title: songInfo.title,
            url: songInfo.video_url
        }

        guild.songs.push(newSong);

        playSong(guild, voiceChannel, msg);
    } catch (error) {
        console.log(`An error occurred -> ${error}`);
    }

}

function playSong(guild: GuildData, vc: VoiceChannel, msg: Message) {
    if (guild.dispatcher) {
        return;
    }

    msg.guild.client.user.setPresence({
        afk: false,
        status: "dnd",
        game: {
            name: guild.songs[0].title,
            type: "STREAMING",
            url: guild.songs[0].url
        }
    })

    if (vc) {
        guild.dispatcher = vc.connection.playStream(ytdl(guild.songs[0].url, { filter: 'audioonly', quality: 'highestaudio' }))
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
                if (guild.songs[0].title !== undefined) {
                    msg.reply("now playing -> " + guild.songs[0].title);
                }
            })
            .on('error', error => {
                console.log(error);
            });
        guild.dispatcher.setVolumeLogarithmic(50.0 / 100.0);
    } else {
        msg.reply("You are not in a channel");
        return;
    }
}

export default play;