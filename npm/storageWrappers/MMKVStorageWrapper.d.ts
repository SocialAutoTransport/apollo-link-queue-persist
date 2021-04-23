import { PersistentStorage } from '../types';
export declare class MMKVStorageWrapper implements PersistentStorage<string> {
    private storage;
    constructor(storage: any);
    getItem(key: string): string | Promise<string | null> | null;
    removeItem(key: string): void | Promise<void>;
    setItem(key: string, value: string): void | Promise<void>;
}
