import { Message } from 'discord.js';

const ping = (args: string[], msg: Message) => {
    msg.channel.send("pong :heart:");
    //msg.author.send("pong :heart: -> PM");
}
export default ping;