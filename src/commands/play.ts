import { Message } from 'discord.js';
import ytdl = require('ytdl-core');
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

export interface SongQueue {
    songs: Song[] | null;
}

export interface Song {
    title: string;
    url: string;
}

export var newSongQueue: SongQueue = {
    songs: []
}

const play = (args: string[], msg: Message) => {



    if (!existsSync(__dirname + "/../../" + msg.guild.name)) {

        mkdirSync(__dirname + "/../../" + msg.guild.name);

        if (!existsSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json")) {
            writeFileSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json", JSON.stringify(newSongQueue));
            console.log("SongQueue file was created!")
            return;
        }
    }

    //TODO: duplicated code

    if (!existsSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json")) {

        var newSong: Song = {
            title: "0",
            url: args[0]
        }

        newSongQueue.songs.push(newSong);

        writeFileSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json", JSON.stringify(newSongQueue));
        console.log("SongQueue file was created!")
    }

    if (existsSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json")) {

        var newSong: Song = {
            title: "0",
            url: args[0]
        }

        newSongQueue.songs.push(newSong);

        writeFileSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json", JSON.stringify(newSongQueue));

        const songQueue: SongQueue = JSON.parse(readFileSync(__dirname + "/../../" + msg.guild.name + "/songQueue.json").toString());

        if (songQueue.songs === []) {
            msg.reply("No songs");
            return;
        }


        for (const song of songQueue.songs) {

        }
        /*
        var voiceChannel = msg.member.voiceChannel;

        if (!msg.guild.me.voiceChannel) {
            msg.reply("I am not in a Channel darling! :heart:");
        }

        msg.reply(args.toString());

        var perms = voiceChannel.permissionsFor(msg.client.user);
        if (!perms.has("SPEAK")) {
            msg.reply("I dont have any permissions to speak in this channel!");
        }

        const dispatcher = voiceChannel.connection.playStream(ytdl(args[0]))
            .on('end', () => {
                msg.reply("No music");
            })
            .on('error', error => {
                console.log(error);
            });

        dispatcher.setVolumeLogarithmic(100 / 100);
        */
    }


}
export default play;