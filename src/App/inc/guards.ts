import {IDatabaseItem} from "./types.js";

export function assertIsDatabaseItem(value: IDatabaseItem | any): asserts value is IDatabaseItem {
    if (
        !!value &&
        typeof value === 'object' &&
        'id' in value &&
        'locale_name' in value
    ) return;
    throw new Error(`Not a database item: ${value}`);
}
