export interface ICommandHandler<T> {
    readonly cmdName: string;
    handler: (
        ...args: any
    ) => Promise<void>
}


export interface IWaitQueueItem {
    id: string;
    enhance: string;
    date?: Date;
    name: {
        [key: string]: string;
    },
}

export interface ISubscribedDiscordUser {
    id: string;
    items: Array<IWaitQueueItem>;
}

export interface IAPIResponse {
    resultMsg: string;
    resultCode: number;
}


export interface IDatabaseItem {
    id: number;
    locale_default: string;
    grade: number;
    locale_name: {
        [key: string]: string,
    }
}

export interface IItemsDatabase {
    [key: string]: IDatabaseItem
}

export enum MARKET_LISTENER_EVENTS {
    NEW_ITEM_REGISTERED = 'NEW_ITEM_REGISTERED',
    NEW_USER_ITEM_REGISTERED = 'NEW_USER_ITEM_REGISTERED'
}

export enum APIEndpoints {
    GetWorldMarketWaitList = "GetWorldMarketWaitList"
}

export type Nullable<T> = T | null;