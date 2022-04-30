import {ICommandHandler} from "../inc/types";
import {CommandInteraction} from "discord.js";

export abstract class Command implements  ICommandHandler<CommandInteraction> {
    protected constructor(public readonly cmdName: string) {}
    abstract handler(...args: any[]): Promise<void>;
}
