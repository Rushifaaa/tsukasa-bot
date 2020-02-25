import { Message, Collection, Role } from 'discord.js';
import permissionCheck from '../../utility/permissionCheck';

enum Subcommands {
    List = "list",
    Add = "add",
    Remove = "remove",
}

const role = (args: string[], msg: Message): void => {
    if (msg.channel.type === "dm") {
        msg.channel.send("You can't use this command in a dm!");
        return;
    }

    if (!permissionCheck(msg)) {
        msg.channel.send("You don't have the permission to perform this command!");
        return;
    }

    if (args[0] == Subcommands.List) {
        msg.channel.send("I'll list all available roles on this guild...");
        const roles: Collection<string, Role> = msg.guild.roles;

        const rolesName: string[] = [];
        roles.forEach(role => {
            rolesName.push(role.name);
        });

        msg.channel.send(rolesName);

    } else if (args[0] == Subcommands.Add) {
        // TODO: DO SOMETHING
    } else if (args[0] == Subcommands.Remove) {
        // TODO: DO SOMETHING
    }
}
export default role;