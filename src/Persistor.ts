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

  constructor(
    { log, queue, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>,
  ) {
    const { maxSize = 1024 * 1024 } = options;

    this.log = log;
    this.queue = queue;
    this.storage = storage;
    this.paused = false;

    if (maxSize) {
      this.maxSize = maxSize;
    }
  }

  async persist(): Promise<void> {
    try {
      const data = this.queue.extract();

      if (
        this.maxSize != null &&
        typeof data === 'string' &&
        data.length > this.maxSize &&
        !this.paused
      ) {
        await this.purge();
        this.paused = true;
        return;
      }

      if (this.paused) {
        return;
      }

      await this.storage.write(data);

      this.log.info(
        typeof data === 'string'
          ? `Persisted queue of size ${data.length} characters`
          : 'Persisted queue',
      );
    } catch (error) {
      this.log.error('Error persisting queue', error);
      throw error;
    }
  }

  async restore(): Promise<void> {
    try {
      const data = await this.storage.read();

      if (data != null) {
        await this.queue.restore(data);

        this.log.info(
          typeof data === 'string'
            ? `Restored queue of size ${data.length} characters`
            : 'Restored queue',
        );
      } else {
        this.log.info('No stored queue to restore');
      }
    } catch (error) {
      this.log.error('Error restoring queue', error);
      throw error;
    }
  }

  async purge(): Promise<void> {
    try {
      await this.storage.purge();
      this.log.info('Purged queue storage');
    } catch (error) {
      this.log.error('Error purging queue storage', error);
      throw error;
    }
  }
}