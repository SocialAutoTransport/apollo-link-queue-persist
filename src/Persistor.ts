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

  constructor(
    { queue, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>,
  ) {
    const { maxSize = 1024 * 1024 } = options;

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
    } catch (error) {
      throw error;
    }
  }

  async restore(): Promise<void> {
    try {
      const data = await this.storage.read();

      if (data != null) {
        await this.queue.restore(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async purge(): Promise<void> {
    try {
      await this.storage.purge();
    } catch (error) {
      throw error;
    }
  }
}