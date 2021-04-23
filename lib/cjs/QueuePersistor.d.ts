import Queue from './Queue';
import Storage from './Storage';
import Persistor from './Persistor';
import { ApolloPersistOptions } from './types';
export default class QueuePersistor<T> {
    queue: Queue<T>;
    storage: Storage<T>;
    persistor: Persistor<T>;
    constructor(options: ApolloPersistOptions<T>);
    persist(): Promise<void>;
    restore(): Promise<void>;
    purge(): Promise<void>;
}
