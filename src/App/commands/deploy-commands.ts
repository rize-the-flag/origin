import {SlashCommandBuilder} from '@discordjs/builders';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import Config from '../../../config.json' assert {type: "json"};

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('market').setDescription('Replies with server info!')
        .addSubcommand(subcommand => subcommand.setName('subscribe').setDescription('add item to queue')
            .addStringOption(option => option.setName('item').setDescription('item name').setRequired(true))
            .addStringOption(option => option.setName('enhance').setDescription('enhance level').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('unsubscribe').setDescription('delete item from queue')
            .addStringOption(option => option.setName('item').setDescription('item name').setRequired(true))
            .addStringOption(option => option.setName('enhance').setDescription('enhance level').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('watch-bs-awakening').setDescription('add V awa BS weapon to watcher queue'))
        .addSubcommand(subcommand => subcommand.setName('watch-bs-main').setDescription('add V main BS weapon to watcher queue'))
        .addSubcommand(subcommand => subcommand.setName('stop-watch').setDescription('stop watch'))
]
    .map(command => command.toJSON());

const rest = new REST({version: '9'}).setToken(Config.token);

rest.put(Routes.applicationGuildCommands(Config.clientId, Config.guildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);