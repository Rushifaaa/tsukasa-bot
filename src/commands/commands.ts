import * as Discord from 'discord.js';
import { } from 'ytdl-core';
import ytdl = require('ytdl-core');

export default class commands {

    msg: Discord.Message;
    prefix: string = "†";
    queue = new Map();
    serverQueue = null

    constructor(msg: Discord.Message, client: Discord.Client) {
        this.msg = msg;
    }

    public commands() {
        this.ping();
        this.voiceChannel();
        this.play();
    }

    private ping() {
        if (this.msg.content == this.prefix + "ping") {
            this.msg.reply("pong!");
        }
    }

    private addRole() {

    }

    private voiceChannel() {
        if (!this.msg.guild) return;

        if (this.msg.content === this.prefix + 'join') {
            if (this.msg.member.voiceChannel) {
                this.msg.member.voiceChannel.join()
                    .then(connection => {
                        this.msg.reply('Now I am connected to the Channel where you are :P :heart: !');
                    })
                    .catch(console.log);
            } else {
                this.msg.reply('You need to join a voice channel first!');
            }
        } else if (this.msg.content === this.prefix + 'disconnect') {
            if (this.msg.member.voiceChannel) {
                this.msg.member.voiceChannel.leave()
                this.msg.reply('Now I am Leaving see you darling :P :heart:!');
            } else {
                this.msg.reply('You need to be in the same channel!');
            }
        }
    }

    private async play() {
        this.serverQueue = this.queue.get(this.msg.guild.id);

        var args = this.msg.content.slice(this.prefix.length).trim().split(/ +/s);
        var command = args.shift().toLowerCase();

        if (command === "play") {
            console.log("###ARGS[0] -> ", args[0])
            if (!args[0]) return this.msg.reply("Please enter a vailid link!");

            const argsLink = this.msg.content.split(" ");

            const voiceChannel = this.msg.member.voiceChannel;

            if (!voiceChannel) return this.msg.reply("You need to be in a Channel!");
            const permission = voiceChannel.permissionsFor(this.msg.client.user);

            if (!permission.has("CONNECT") && !permission.has("SPEAK")) {
                return this.msg.channel.send("I need permission to Join and Speak in a Channel!");
            }

            const songInfo = await ytdl.getInfo(argsLink[1]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url
            }

            if (!this.serverQueue) {
                const queueConstruct = {
                    textChannel: this.msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                };
                this.queue.set(this.msg.guild.id, queueConstruct);

                queueConstruct.songs.push(song);


                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    //TODO: Play song!

                    this.playSong(this.msg.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.log(error);
                    this.queue.delete(this.msg.guild.id);
                    return this.msg.channel.send("There was an error playing -> " + "`" + error + "`");
                }
            } else {
                this.serverQueue.songs.push(song);
                return this.msg.channel.send(`${song.title} has been added successfully to the queue. :heart:`);
            }
        }
    }

    private playSong(guild: Discord.Guild, song: any) {
        const serverQueue = this.queue.get(this.msg.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(this.msg.guild.id);
            return;
        }

        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () => {
                serverQueue.songs.shift();
                this.playSong(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.log(error);
            });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }
}