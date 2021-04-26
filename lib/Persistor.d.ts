import Log from './Log';
import Storage from './Storage';
import Queue from './Queue';
import { ApolloPersistOptions } from './types';
export interface PersistorConfig<T> {
    log: Log<T>;
    queue: Queue<T>;
    storage: Storage<T>;
}
export default class Persistor<T> {
    log: Log<T>;
    queue: Queue<T>;
    storage: Storage<T>;
    maxSize?: number;
    paused: boolean;
    constructor({ log, queue, storage }: PersistorConfig<T>, options: ApolloPersistOptions<T>);
    persist(): Promise<void>;
    restore(): Promise<void>;
    purge(): Promise<void>;
}
