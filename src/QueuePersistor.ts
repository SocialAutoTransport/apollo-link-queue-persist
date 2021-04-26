import Queue from './Queue';
import Storage from './Storage';
import Persistor from './Persistor';
import QueueLink from '@SocialAutoTransport/apollo-link-queue';

import { ApolloPersistOptions } from './types';

export default class QueuePersistor<T> {
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

    const queue = new Queue(options);
    const storage = new Storage(options);
    const persistor = new Persistor({ queue, storage }, options);

    this.queue = queue;
    this.storage = storage;
    this.persistor = persistor;

    QueueLink.addLinkQueueEventListener("any", "enqueue", (item: any) => {
      console.log('QueuePersistor: mutation enqueued', item);
      this.persistor.persist();
    });

    QueueLink.addLinkQueueEventListener("any", "dequeue", (item: any) => {
      console.log('QueuePersistor: mutation dequeued', item);
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
}