import { Message } from "discord.js";
import ping from "./commands/text-channel/ping";
import join from "./commands/voice-channel/join";
import disconnect from "./commands/voice-channel/disconnect";
import git from "./commands/text-channel/git";
import quit from "./commands/voice-channel/quit";
import play from "./commands/music/play";
import { GuildData } from "./main";
import stop from "./commands/music/stop";
import pause from "./commands/music/pause";
import resume from "./commands/music/resume";

export class Command {

    constructor(readonly name: string, readonly aliases: string[], readonly func: (args: string[], msg: Message, guildData: Map<string, GuildData>) => number | Promise<any> | void) {
        //EMPTY....
    }

    invoke(args: string[], msg: Message, guildData: Map<string, GuildData>): number {
        const ret = this.func(args, msg, guildData);
        if (typeof (ret) !== "number") return 0;
        return ret;
    }
}

export const commands = [
    new Command("ping", [], ping),
    new Command("join", [], join),
    new Command("play", [], play),
    new Command("pause", [], pause),
    new Command("resume", [], resume),
    new Command("stop", [], stop),
    new Command("disconnect", ["dc"], disconnect),
    new Command("git", ["dev", "developer"], git),
    new Command("quit", ["q", "destroy", "terminate"], quit)
];