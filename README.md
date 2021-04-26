# apollo-link-queue-persist

Simple persistence for any queued Apollo queries when using [`helfer/apollo-link-queue`][0]. At initial build time, @helfer has not yet pulled in the changes required in `apollo-link-queue` so in order for this to work, you'll need to make use of our fork at [`@SocialAutoTransport/apollo-link-queue`][1]

Supports web and React Native. [See all storage providers.](#storage-providers)

[0]: https://github.com/helfer/apollo-link-queue
[1]: https://github.com/SocialAutoTransport/apollo-link-queue

## Basic Usage

To get started, simply pass your instance of QueueLink and an
[underlying storage provider](#storage-providers) to `persistQueue`.

By default, the contents of your Apollo link queue will be immediately restored
(asynchronously, see [how to persist data before rendering](#how-do-i-wait-for-the-cache-to-be-restored-before-rendering-my-app)), and will be persisted upon every write to the queue.

### Usage

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueue, AsyncStorageWrapper } from 'apollo-link-queue-persist';
import QueueLink from 'apollo-link-queue';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink} from '@apollo/client';

const queueLink = new QueueLink();

const client = new ApolloClient({
  link: ApolloLink.from([queueLink, httpLink]);,
  cache: new InMemoryCache(),
});

await persistQueue({
  queueLink,
  storage: AsyncStorage,
  client,
});
```

## Storage Providers

`apollo-link-queue-persist` provides wrappers for the following storage providers, with no additional dependencies:

| Storage provider | Platform	| Wrapper class	|
|---	|---	|---	|
| [`AsyncStorage`](https://github.com/react-native-async-storage/async-storage)*	| React Native	| `AsyncStorageWrapper`	|
| `window.localStorage`	| web	| `LocalStorageWrapper`	|
| `window.sessionStorage`	| web	| `SessionStorageWrapper`	|
| [`localForage`](https://github.com/localForage/localForage)	| web	| `LocalForageWrapper`	|
| [`Ionic storage`](https://ionicframework.com/docs/building/storage)	| web and mobile	| `IonicStorageWrapper`	|
| [`MMKV Storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage)	| React Native	| `MMKVStorageWrapper`	|

*`AsyncStorage`
[does not support](https://github.com/facebook/react-native/issues/12529#issuecomment-345326643)
individual values in excess of 2 MB on Android. If you set `maxSize` to more than 2 MB or to `false`, 
use a different storage provider, such as
[`react-native-mmkv-storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage) or 
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage).

### Using other storage providers

`apollo-link-queue-persist` supports stable versions of storage providers mentioned above. 
If you want to use other storage provider, or there's a breaking change in `next` version of supported provider,
you can create your own wrapper. For an example of a simple wrapper have a look at [`AsyncStorageWrapper`](./src/storageWrappers/AsyncStorageWrapper.ts). 

If you found that stable version of supported provider is no-longer compatible, please [submit an issue or a Pull Request](https://github.com/apollographql/apollo-cache-persist/blob/master/CONTRIBUTING.md#issues).