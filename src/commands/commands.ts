import * as Discord from 'discord.js';

export default class commands {

    msg: Discord.Message;
    prefix: string = "†";

    constructor(msg: Discord.Message) {
        this.msg = msg;
    }

    public commands() {
        this.ping();
        
    }

    private ping() {
        if (this.msg.content == this.prefix + "ping") {
            this.msg.reply("pong");
        }
    }
}