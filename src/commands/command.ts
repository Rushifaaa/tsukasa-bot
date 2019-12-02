import { Message } from "discord.js";
//import {ping} from "./ping";

export class Command {

    constructor(readonly name: string, readonly aliases: string[], readonly func: (args: string[], msg: Message) => number | void) {
        //EMPTY....
    }

    invoke(args: string[], msg: Message): number {
        const ret = this.func(args, msg);
        if (typeof (ret) !== "number") return 0;
        return ret;
    }
}

export const commands = [new Command("ping", [], (args: string[], msg: Message) => { msg.reply("pong"); })];