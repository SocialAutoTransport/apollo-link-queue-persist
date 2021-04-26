import Log from './Log';
import Queue from './Queue';
import Storage from './Storage';
import Persistor from './Persistor';
import QueueLink from '@SocialAutoTransport/apollo-link-queue';

import { ApolloPersistOptions, LogLine } from './types';

export default class QueuePersistor<T> {
  log: Log<T>;
  queue: Queue<T>;
  storage: Storage<T>;
  persistor: Persistor<T>;

  constructor(options: ApolloPersistOptions<T>) {
    if (!options.queueLink) {
      throw new Error(
        'In order to persist your Apollo Link Queue, you need to pass in a link queue instance. ' +
          'Please see https://github.com/helfer/apollo-link-queue for more information.'
      );
    }

    if (!options.storage) {
      throw new Error(
        'In order to persist your Apollo Link Queue, you need to pass in an underlying storage provider. ' +
          'Please see https://github.com/SocialAutoTransport/apollo-link-queue-persist#storage-providers'
      );
    }

    const log = new Log(options);
    const queue = new Queue(options);
    const storage = new Storage(options);
    const persistor = new Persistor({ log, queue, storage }, options);

    this.log = log;
    this.queue = queue;
    this.storage = storage;
    this.persistor = persistor;

    QueueLink.addLinkQueueEventListener("any", "enqueue", (item: any) => {
      this.log.info('QueueLink listener (any, enqueued) fired', item);
      this.persistor.persist();
    });

    QueueLink.addLinkQueueEventListener("any", "dequeue", (item: any) => {
      this.log.info('QueueLink listener (any, dequeue) fired', item);
      this.persistor.persist();
    });
  }

  /**
   * Manual persistence controls.
   */

  persist(): Promise<void> {
    return this.persistor.persist();
  }

  restore(): Promise<void> {
    return this.persistor.restore();
  }

  purge(): Promise<void> {
    return this.persistor.purge();
  }

  /**
   * Info accessor.
   */

  getLogs(print = false): Array<LogLine> | void {
    if (print) {
      this.log.tailLogs();
    } else {
      return this.log.getLogs();
    }
  }

  getSize(): Promise<number | null> {
    return this.storage.getSize();
  }
}