import { Message } from 'discord.js';

const ping = (args: string[], msg: Message) => {
    msg.reply("pong <3");
}
export default ping;