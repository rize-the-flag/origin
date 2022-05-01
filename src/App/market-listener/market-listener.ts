import {ISubscribedDiscordUser, IWaitQueueItem, MARKET_LISTENER_EVENTS, Nullable} from "../inc/types.js";
import {getItemByName, getWorldMarketWaitList, parseResponseData} from "../api.js";
import {eventEmitter} from "../eventEmitter.js";
import {assertIsDatabaseItem} from "../inc/guards.js";


export class MarketListener {

    private marketWaitQueue: Array<IWaitQueueItem> = [];
    private userWatchQueue: Array<ISubscribedDiscordUser> = [
/*        {
            id: '262865198669365250',
            items: [
                {
                    id: '11853',
                    enhance: '4',
                    name: {
                        "us": "Black Distortion Earring",
                        "de": "Ohrring der Schwarzen Verze",
                        "fr": "Boucle d'oreille de sombre",
                        "ru": "Серьги Черного распада",
                        "es": "Pendiente de la distorsión",
                        "sp": "Aretes de la Erosión Negra",
                        "pt": "Brincos de Corrosão Negra",
                        "jp": "黒い侵食のイヤリング",
                        "kr": "검은 침식의 귀걸이",
                        "tw": "黑暗侵蝕耳環",
                        "th": "ต่างหูพลังสีดำกัดกร่อน",
                        "tr": "Kara Çöküş Küpesi",
                        "id": "Black Distortion Earring"
                    },
                },
            ]
        }*/
    ];

    private timerId: NodeJS.Timer;

    constructor(private requestFrequency: number) {
        this.startWatch();
    }

    subscribe(discordUserId: string, itemName: string | null, enhance: string | null): void {
        if (!(itemName && enhance)) return;
        const user = this.userWatchQueue.find(x => discordUserId === x.id);
        const dbItem = getItemByName(itemName);
        assertIsDatabaseItem(dbItem);
        if (user) {
            user.items.push({id: dbItem.id.toString(), enhance: enhance, name: dbItem.locale_name});
        } else {
            this.userWatchQueue.push({
                id: discordUserId,
                items: [
                    {
                        id: dbItem.id.toString(),
                        enhance: enhance,
                        name: dbItem.locale_name
                    }
                ]
            })
        }
    }

    unsubscribe(discordUserId: string, itemName: string, enhance: string): void {
        const user = this.userWatchQueue.find(x => discordUserId === x.id);
        const dbItem = getItemByName(itemName);
        assertIsDatabaseItem(dbItem);
        if (!user || !dbItem) return;
        user.items = user.items.filter(x => x.id != dbItem.id.toString() && x.enhance!=enhance)
    }

    getNotifyUsersList(newItemsInMarketQueue: Array<IWaitQueueItem>) {
        if (newItemsInMarketQueue.length < 0) return null;
        return this.userWatchQueue.map(x => {
            const items = newItemsInMarketQueue.filter(y => x.items.some(z => z.id === y.id && z.enhance === y.enhance));
            return {
                ...x,
                items
            } as ISubscribedDiscordUser;
        }).filter(u => u.items.length > 0);
    }

    getNewItemsInMarketQueue(items: Array<IWaitQueueItem>) {
        return items.filter(x => (
            !!x.name && this.marketWaitQueue
                .every(y =>
                    y.name != x.name &&
                    y.enhance != x.enhance &&
                    y.date != x.date)
        ))
    }

    marketQueueAddItems(items: Array<IWaitQueueItem>) {
        if (items.length < 0) return null;
        return this.marketWaitQueue = [...this.marketWaitQueue, ...items];
    }

    sendUsersNotify(users: Nullable<Array<ISubscribedDiscordUser>>) {
        eventEmitter.emit(MARKET_LISTENER_EVENTS.NEW_USER_ITEM_REGISTERED, users);
    }

    sendNotifyAll(items: Nullable<Array<IWaitQueueItem>>) {
        eventEmitter.emit(MARKET_LISTENER_EVENTS.NEW_ITEM_REGISTERED, items);
    }

    cleanup() {

    }

    startWatch() {
        this.timerId = setInterval(async () => {
            const items = await getWorldMarketWaitList();
            const newItems = this.getNewItemsInMarketQueue(parseResponseData(items));
            const notifyList = this.getNotifyUsersList(newItems);
            this.marketQueueAddItems(newItems);
            this.sendNotifyAll(newItems);
            this.sendUsersNotify(notifyList);
        }, this.requestFrequency)
    }

    stopWatch() {
        clearInterval(this.timerId)
    }
}