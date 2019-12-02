import { Message } from "discord.js";
import ping from "./src/commands/ping";
import join from "./src/commands/join";
import disconnect from "./src/commands/disconnect";

export class Command {

    constructor(readonly name: string, readonly aliases: string[], readonly func: (args: string[], msg: Message) => number | Promise<any> | void) {
        //EMPTY....
    }

    invoke(args: string[], msg: Message): number {
        const ret = this.func(args, msg);
        if(typeof(ret) !== "number") return 0;
        return ret;
    }
}

export const commands = [
    new Command("ping", [], ping),
    new Command("join", [], join),
    new Command("disconnect", ["dc"], disconnect)
];