import { Message } from 'discord.js';
import { TsukasaConfig, configFilePath } from '../main';
import { readFileSync } from 'fs';

const quit = (args: string[], msg: Message) => {
    try {
        const config: TsukasaConfig = JSON.parse(readFileSync(configFilePath).toString());

        console.log();

        if (msg.author.id === config.owner_id) return 1;

        msg.reply("You dont have permission for this command!");
    } catch (error) {
        console.log("Fix config file please, could be empty?", error);
    }
}
export default quit;