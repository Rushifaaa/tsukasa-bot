import { Message } from 'discord.js';

const disconnect = (args: string[], msg: Message) => {
    msg.reply("Disconnect incoming!");
}
export default disconnect;