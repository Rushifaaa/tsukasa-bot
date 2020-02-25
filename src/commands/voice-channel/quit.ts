import { Message } from 'discord.js';
import { TsukasaConfig, configFilePath } from '../../main';
import { readFileSync } from 'fs';

const quit = (_args: string[], msg: Message): void | number => {

    // Checking if the Channel type is dm
    if (msg.channel.type === "dm") {
        msg.channel.send("Is just available on a Server!");
        return;
    }

    try {
        // Getting the tsukasa config
        const config: TsukasaConfig = JSON.parse(readFileSync(configFilePath).toString());

        // Checking the author id of the message with the owner id of the config and leaving the voice channel
        if (msg.author.id === config.ownerId) {
            msg.member.voiceChannel.leave();
            return 1;
        }

        msg.reply("You dont have permission for this command!");
    } catch (error) {
        console.log("Fix config file please, could be empty?", error);
    }
};
export default quit;