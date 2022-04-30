import {IAPIResponse, IDatabaseItem, IItemsDatabase, IWaitQueueItem} from "./inc/types.js";
import fetch from "node-fetch";
import itemDb from "../items-database/items.json" assert {type: "json"};
import {assertIsDatabaseItem} from "./inc/guards.js";

export const getWorldMarketWaitList = async (): Promise<IAPIResponse> => {
    const response = await fetch("https://trade.ru.playblackdesert.com/Trademarket/GetWorldMarketWaitList ", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "User-Agent": "BlackDesert"
        },
        "body": null
    });
    return await response.json() as IAPIResponse;
}

export const getItemNameById = (id: string): { [key: string]: string } | null => {
    const items = Object.entries(itemDb as IItemsDatabase);
    for (const [key, value] of items) {
        if (key === id) return value.locale_name;
    }
    return null;
}

export const getItemByName = (itemName: string): IDatabaseItem | null => {
    const items = Object.entries(itemDb as IItemsDatabase);
    for (const [_, value] of items) {
        assertIsDatabaseItem(value);
        if (Object.values(value['locale_name']).some(x => x == itemName))
            return value;
    }
    return null
}

export const parseResponseData = (data: IAPIResponse): Array<IWaitQueueItem> => {
    return data.resultMsg.split('|')
        .map(x => {
            const [id, enhance, price, date] = x.split('-');
            return {
                id,
                enhance,
                price,
                name: getItemNameById(id),
                date: new Date(Number.parseInt(date) * 1000)
            } as IWaitQueueItem;
        });
}


