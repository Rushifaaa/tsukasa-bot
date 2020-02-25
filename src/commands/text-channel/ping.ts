import { Message } from 'discord.js';

const ping = (args: string[], msg: Message): void => {
    msg.channel.send("pong :heart:");
};
export default ping;