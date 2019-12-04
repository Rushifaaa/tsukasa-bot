import { Message } from 'discord.js';
import { tsukasaConfig, ServerConfig } from '../../main';
import { readFileSync } from 'fs';
import permissionCheck from '../../utility/permissionCheck';

const clearChat = async (args: string[], msg: Message) => {
    if (!permissionCheck(msg)) {
        return;
    }

    if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
        msg.reply("you don't have permissions to do this!");
        return;
    }

    if (!args[0]) {
        msg.reply("you need to give me a number of messages that I should delete darling :heart:");
        return;
    }

    const stringToNumber: number = +args[0];

    if (!stringToNumber) {
        msg.reply("error to parse string into number!");
        return;
    }

    await msg.channel.bulkDelete(stringToNumber);
    await msg.channel.send("I cleared " + stringToNumber + " messages :heart:");
    msg.delete(5000);

}
export default clearChat;