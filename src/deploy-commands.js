"use strict";
exports.__esModule = true;
var builders_1 = require("@discordjs/builders");
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var config_json_1 = require("../config.json");
var commands = [
    new builders_1.SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new builders_1.SlashCommandBuilder().setName('market').setDescription('Replies with server info!')
        .addSubcommand(function (subcommand) { return subcommand.setName('subscribe').setDescription('add item to queue')
        .addStringOption(function (option) { return option.setName('item').setDescription('item name').setRequired(true); })
        .addStringOption(function (option) { return option.setName('enhance').setDescription('enhance level').setRequired(true); }); })
        .addSubcommand(function (subcommand) { return subcommand.setName('unsubscribe').setDescription('delete item from queue')
        .addStringOption(function (option) { return option.setName('item').setDescription('item name').setRequired(true); })
        .addStringOption(function (option) { return option.setName('enhance').setDescription('enhance level').setRequired(true); }); })
        .addSubcommand(function (subcommand) { return subcommand.setName('watch-bs-awakening').setDescription('add V awa BS weapon to watcher queue'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('watch-bs-main').setDescription('add V main BS weapon to watcher queue'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('stop-watch').setDescription('stop watch'); })
]
    .map(function (command) { return command.toJSON(); });
var rest = new rest_1.REST({ version: '9' }).setToken(config_json_1["default"].token);
rest.put(v9_1.Routes.applicationGuildCommands(config_json_1["default"].clientId, config_json_1["default"].guildId), { body: commands })
    .then(function () { return console.log('Successfully registered application commands.'); })["catch"](console.error);
