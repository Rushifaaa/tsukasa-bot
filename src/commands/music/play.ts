import { Message, VoiceChannel } from 'discord.js';
import ytdl = require('ytdl-core');
import { GuildData, tsukasaConfig, ServerConfig } from '../../main';
import * as YouTube from 'simple-youtube-api';
import { readFileSync } from 'fs';

export interface SongQueue {
    songs: Song[];
}

export interface Song {
    title: string;
    url: string;
}

const play = async (args: string[], msg: Message, guildObjects: Map<string, GuildData>): Promise<void> => {

    function playSong(guild: GuildData, vc: VoiceChannel, msg: Message): void {
        // Checking if a dispatcher is available
        if (guild.dispatcher) {
            return;
        }

        // Checking if the tsukasaConfig is available
        if (!tsukasaConfig) {
            msg.reply("the hoster of this bot, does not have a config!");
            return;
        }

        // Checking if the VoicChannel is available
        if (vc) {

            // Playing the song
            guild.dispatcher = vc.connection.playStream(ytdl(guild.songs[0].url, { filter: 'audioonly', quality: 'highestaudio' }))
                // On playsteam end
                .on('end', () => {

                    // Shifting the songs array
                    guild.songs.shift();
                    guild.dispatcher = null;

                    // Checking if songs are available
                    if (guild.songs.length === 0) {
                        msg.reply("no more songs, please give links! :heart:");
                        return;
                    } else {
                        // Playing the next song in the queue with the playsong function
                        playSong(guild, vc, msg);
                    }
                })

                // On playstream start
                .on('start', () => {
                    // If song title is available print song title else not
                    if (guild.songs[0].title) {

                        if (guild.lastChannel) {
                            guild.lastChannel.send(`Now Playing \`"${guild.songs[0].title}"\`.`);
                            return;
                        }

                        msg.reply("now playing -> " + guild.songs[0].title);
                        return;
                    }
                })

                // On playstream error log the error in the console
                .on('error', error => {
                    console.log(error);
                });

            // Getting the serverConfig
            const serverConfig: ServerConfig = JSON.parse(readFileSync(tsukasaConfig.dataFolder + "/" + msg.guild.id + "/config.json").toString());

            // Setting the volume from the ServerConfig
            if (serverConfig) {
                guild.dispatcher.setVolumeLogarithmic(serverConfig.volume);
            } else { 
                console.log("Cannot set volume: play.ts");
            }
            
        } else {
            msg.reply("You are not in a channel");
            return;
        }
    }

    // Checking if the "tsukasaConfig"(bot config) exist 
    if (!tsukasaConfig) {
        return;
    }

    // Initializing the Youtube library with the googlr api key given in the bot config
    const youtube = new YouTube(tsukasaConfig.googleApiKey);

    // Checking if the channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    // Getting the guild
    const guild = guildObjects.get(msg.guild.id);

    // Checking if guild is null
    if (!guild) {
        msg.reply("Guild not found!");
        return;
    }
 
    if (!guild.lastChannel) {
        guild.lastChannel = msg.channel;
    }

    // Getting the voice channel
    const voiceChannel = msg.member.voiceChannel;

    if (!msg.guild.me.voiceChannel) {
        msg.reply("I am not in a Channel darling! :heart:");
        return;
    }

    const perms = voiceChannel.permissionsFor(msg.client.user);

    // Checking if perms are null
    if (!perms) return;
    if (!perms.has("SPEAK")) {
        msg.reply("I dont have any permissions to speak in this channel!");
        return;
    }

    // Matching args[0] if it equals to a youtube playlist
    if (args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

        try {
            // Getting the Playlist
            const playlist = await youtube.getPlaylist(args[0]);
            // Gettings the videos from the playlist 
            const videos = await playlist.getVideos();

            msg.reply(`Fetching ${videos.length}... Could take some while :P :rofl:`);

            // Iterating through the videos
            for (const video of videos) {
                // Checking if the user stoped the audio stream
                if (guild.isStoped) {
                    guild.isStoped = false;
                    break;
                } else {
                    try {
                        // Getting the songinfo
                        const songInfo = await ytdl.getInfo(video.url);

                        // Creating new song object with the new title and new url
                        const newSong: Song = {
                            title: songInfo.title,
                            url: songInfo.video_url
                        };

                        // Pushing the new song into the guild songs array
                        guild.songs.push(newSong);

                        // Playing the song with the playSong function
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
    /*
        If There is no playlist it will play the song instantly... if a song is playing it will push it into the guild songs array
    */
    try {
        // Getting the song info
        const songInfo = await ytdl.getInfo(args[0]);

        // Creating new Song object
        const newSong: Song = {
            title: songInfo.title,
            url: songInfo.video_url
        };

        // Pushing the newSong into the guild songs array
        guild.songs.push(newSong);

        // Checking if the length is greather than or equals 1 to send current song that is playing
        if (guild.songs.length >= 1) {

            // Sending it into the last channel where the user issued the command
            if (guild.lastChannel) {
                guild.lastChannel.send(`The song \`"${newSong.title}"\` was added to the Queue.`);
                return;
            }

            msg.reply(`The song "${newSong.title}" was added to the Queue.`);
        }

        // Playing the song with the "playSong" function
        playSong(guild, voiceChannel, msg);

    } catch (error) {
        console.log(`An error occurred -> ${error}`);
    }

};
export default play;