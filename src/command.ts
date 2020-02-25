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
import autorole from './commands/moderation/autorole';
import admin from "./commands/moderation/admin";
import clearChat from './commands/moderation/clearChat';
import volume from "./commands/music/volume";
import skip from "./commands/music/skip";
import role from "./commands/moderation/role";

export class Command {
    
    constructor(readonly name: string, readonly aliases: string[], readonly func: (args: string[], msg: Message, guildData: Map<string, GuildData>) => number | Promise<any> | void | boolean) {
        //EMPTY....
    }

    invoke(args: string[], msg: Message, guildData: Map<string, GuildData>): number {
        const ret = this.func(args, msg, guildData);
        if (typeof (ret) !== "number") return 0;
        return ret;
    }
}

export const commands = [
    //TODO: Help command
    new Command("role", [], role),
    new Command("ping", ["test"], ping),
    new Command("join", ["j"], join),
    new Command("stop", ["st"], stop),
    new Command("admin", [], admin),
    new Command("pause", [], pause),
    new Command("play", ["p"], play),
    new Command("volume", [], volume),
    new Command("skip", [], skip),
    new Command("resume", ["re"], resume),
    new Command("autorole", ["ar"], autorole),
    new Command("clearchat", ["cc"], clearChat),
    new Command("disconnect", ["dc"], disconnect),
    new Command("git", ["dev", "developer"], git),
    new Command("quit", ["q", "destroy", "terminate"], quit)
];