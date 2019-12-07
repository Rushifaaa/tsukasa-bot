import { Message, DiscordAPIError } from 'discord.js';
import { tsukasaConfig, ServerConfig } from '../../main';
import { readFileSync } from 'fs';
import permissionCheck from '../../utility/permissionCheck';

const clearChat = async (args: string[], msg: Message) => {
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }
    
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

    if (!(stringToNumber < 50)) {
        msg.reply("don't delete more then 50 messages please, thanks :D :heart:");
        return;
    }

    try {

        await msg.channel.bulkDelete(stringToNumber);
        await msg.channel.send("I cleared " + stringToNumber + " messages :heart:");

    } catch (error) {
        console.log(error);
        msg.reply("an error occurred please note you can't delete messages that are older then 14 days");
    }
}
export default clearChat;