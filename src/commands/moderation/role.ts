import { Message } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';

const role = (args: string[], msg: Message) => {
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }
    
    if (!permissionCheck(msg)) {
        
        return;
    }
}
export default role;