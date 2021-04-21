import QueuePersistor from './QueuePersistor';
import { ApolloPersistOptions } from './types';

export default <T>(options: ApolloPersistOptions<T>) => {
  const persistor = new QueuePersistor(options);
  return persistor.restore();
};