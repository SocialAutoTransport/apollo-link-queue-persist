import Storage from './Storage';
import Queue from './Queue';
import { ApolloPersistOptions } from './types';
export interface PersistorConfig<T> {
    queue: Queue<T>;
    storage: Storage<T>;
}
export default class Persistor<T> {
    queue: Queue<T>;
    storage: Storage<T>;
    maxSize?: number;
    paused: boolean;
    constructor({ queue, storage }: PersistorConfig<T>, options: ApolloPersistOptions<T>);
    persist(): Promise<void>;
    restore(): Promise<void>;
    purge(): Promise<void>;
}
