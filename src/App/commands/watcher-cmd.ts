import {CommandInteraction} from "discord.js";
import {Command} from "./command.js"
import {MarketListener} from "../market-listener/market-listener.js";

export class WatcherCmd extends Command {

    private bsAwakeningList: string[] = [
        "Двуручный меч Черной звезды",
        "Коса Черной звезды",
        "Ручная пушка Черной звезды",
        "Стихийный клинок Черной звезды",
        "Чанбон Черной звезды",
        "Копье Черной звезды",
        "Глефа Черной звезды",
        "Змеиное копье Черной звезды",
        "Клинки асуров Черной звезды",
        "Чакрам Черной звезды",
        "Сферы природы Черной звезды",
        "Сферы стихий Черной звезды",
        "Ведиант Черной звезды",
        "Боевые наручи Черной звезды",
        "Цестус Черной звезды",
        "Клинки крови Черной звезды",
        "Великий лук Черной звезды",
        "Йордун Черной звезды",
        "Двойная глефа Черной звезды",
        "Стинг Черной звезды",
        "Кибелиус Черной звезды",
        "Патрака Черной Звезды"
    ]
    private bsMainList = [
        "Меч Черной звезды",
        "Лук Черной звезды",
        "Талисман Черной звезды",
        "Топор Черной звезды",
        "Клинок Черной звезды",
        "Катана Черной звезды",
        "Посох Черной звезды",
        "Крейг-мессер Черной звезды",
        "Боевые перчатки Черной звезды",
        "Маятник Черной звезды",
        "Арбалет Черной звезды",
        "Флоранг Черной звезды",
        "Секира Черной звезды",
        "Шамшир Черной звезды",
        "Моргенштерн Черной звезды",
        "Каив Черной звезды",
        "Сэренака Черной звезды",
        "Слэйер Черной звезды",
    ]

    async handler(...args: any[]): Promise<void> {

        const watcher = args.find(x => x instanceof MarketListener) as MarketListener;
        const interaction = args.find(x => x instanceof CommandInteraction) as CommandInteraction;
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case 'subscribe':
                watcher.subscribe(
                    interaction.user.id,
                    interaction.options.getString('item'),
                    interaction.options.getString('enhance')
                )
                break;
            case 'watch-bs-awakening':
                this.bsAwakeningList.forEach(x => watcher.subscribe(interaction.user.id, x, '20'))
                break;
            case 'watch-bs-main':
                this.bsMainList.forEach(x => watcher.subscribe(interaction.user.id, x, '20'))
                break;
            case 'unsubscribe':
                const item = interaction.options.getString('item');
                const enhance = interaction.options.getString('enhance');
                if (!item || !enhance) return
                watcher.unsubscribe(
                    interaction.user.id,
                    item,
                    enhance
                )
                break;
            default:
                throw new Error('not found');
        }
        await interaction.editReply(`item added`);
    }

    constructor(public readonly cmdName: string) {
        super(cmdName);
    }
}