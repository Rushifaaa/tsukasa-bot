import * as Discord from 'discord.js';

export default class commands {

    msg: Discord.Message;
    prefix: string = "†";

    constructor(msg: Discord.Message, client: Discord.Client) {
        this.msg = msg;
    }

    public commands() {
        this.ping();
        this.voiceChannel();
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
}