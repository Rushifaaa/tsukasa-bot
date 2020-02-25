import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';

const clearChat = async (args: string[], msg: Message): Promise<void> => {
    // Checking if channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    // Checking permission with the permissionCheck function
    if (!permissionCheck(msg)) {
        return;
    }

    // Checking if the sender has permission to manage messages
    if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
        msg.reply("you don't have permissions to do this!");
        return;
    }

    // Checking if the args[0] isn't null
    if (!args[0]) {
        msg.reply("you need to give me a number of messages that I should delete darling :heart:");
        return;
    }

    // Converting string to number
    const stringToNumber: number = +args[0];

    // Checking if "stringToNumber" is a number
    if (typeof (stringToNumber) == "number") {
        msg.reply("error to parse string into number!");
        return;
    }

    // Checking if string to number is lower equals than 50
    if (!(stringToNumber <= 50)) {
        msg.reply("don't delete more then 50 messages please, thanks :D :heart:");
        return;
    }

    try {
        // Trying to delete "stringToNumber" of messages
        await msg.channel.bulkDelete(stringToNumber);
        await msg.channel.send("I cleared " + stringToNumber + " messages :heart:");

    } catch (error) {
        // Logging the error
        console.log(error);
        msg.reply("an error occurred please note you can't delete messages that are older then 14 days");
    }
};
export default clearChat;