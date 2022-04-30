import {CommandInteraction} from "discord.js";
import {Command} from "./command.js"

export class Ping extends Command{
    async handler (interaction: CommandInteraction): Promise<void> {
        console.log()
        await interaction.deferReply();
        try {
            await interaction.user.send('hello');
            console.log(interaction.user.id);
        } catch (e) {
            console.log(e);
        }

        await interaction.editReply(`@${interaction.user.username} reply with pong`);
    }

    constructor(public readonly cmdName: string) {
        super(cmdName);
    }
}