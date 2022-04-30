import {Client, CommandInteraction, GuildChannel, Intents, TextChannel} from "discord.js";
import {ICommandHandler, ISubscribedDiscordUser, IWaitQueueItem, MARKET_LISTENER_EVENTS} from "./inc/types.js"
import {Ping} from "./commands/ping-cmd.js";
import {eventEmitter} from "./eventEmitter.js";
import Config from "../../config.json" assert {type: "json"};
import {WatcherCmd} from "./commands/watcher-cmd.js";

export class App {
    private client: Client;
    private auctionChannelId: string | undefined;
    private commandArgs: any [];

    private commands: Array<ICommandHandler<CommandInteraction>> = []

    constructor(config?: typeof Config) {
        this.commands.push(new Ping('ping'));
        this.commands.push(new WatcherCmd('market'))
        this.client = new Client({
            intents: Intents.FLAGS.GUILDS
        })
    }

    async init() {

        await this.client.once('ready', () => {
            console.log("BOT ready")
        });

        await this.client.login(Config.token);

        new Promise(resolve => setTimeout(() => resolve(true), 1000)).then(v => {
            this.auctionChannelId = this.client.channels.cache.find(value => {
                if (!(value instanceof TextChannel)) return false;
                console.log(value.name, Config.DiscordClient.defaultMsgChannel);
                return value.name == Config.DiscordClient.defaultMsgChannel;
            })?.id;
        })
    }

    startUserNotify() {
        eventEmitter.on(MARKET_LISTENER_EVENTS.NEW_USER_ITEM_REGISTERED, payload => {
            const users = (payload as Array<ISubscribedDiscordUser>);
            users.forEach(x => {
                x.items.forEach((y) => {
                    this.client.users.fetch(x.id)
                        .then(user => user.send(`${y.name['ru']}  ${y.enhance} ${y.date?.getMinutes()}:${y.date?.getSeconds()}`));
                })
            })
        })
    }

    startNotifyAll() {
        eventEmitter.on(MARKET_LISTENER_EVENTS.NEW_ITEM_REGISTERED, payload => {
            if (!this.auctionChannelId) return;
            const items = payload as Array<IWaitQueueItem>;
            const channel = this.client.channels.cache.find(x => x.id === this.auctionChannelId);
            if (channel instanceof TextChannel)
                items.forEach(x => channel.send(`${x.name[Config['MarketWatcher']['locale']]} ${x.enhance} ${x.date}`))
        })
    }

    use(args: any[]) {
        this.commandArgs = [...args];
    }

    async run() {
        await this.init();
        this.startUserNotify();
        this.startNotifyAll();

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            const {commandName} = interaction;
            if (
                interaction.channel instanceof TextChannel &&
                interaction.channel.id === this.auctionChannelId
            ) {
                this.commands.find(cmd => cmd.cmdName === commandName)?.handler(
                    interaction,
                    ...this.commandArgs
                );
            }
        })
    }
}

