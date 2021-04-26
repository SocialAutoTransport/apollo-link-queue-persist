import Log from './Log';
import Queue from './Queue';
import Storage from './Storage';
import Persistor from './Persistor';
import { ApolloPersistOptions, LogLine } from './types';
export default class QueuePersistor<T> {
    log: Log<T>;
    queue: Queue<T>;
    storage: Storage<T>;
    persistor: Persistor<T>;
    constructor(options: ApolloPersistOptions<T>);
    persist(): Promise<void>;
    restore(): Promise<void>;
    purge(): Promise<void>;
    getLogs(print?: boolean): Array<LogLine> | void;
    getSize(): Promise<number | null>;
}
