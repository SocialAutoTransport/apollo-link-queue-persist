import { ApolloClient, InMemoryCache } from '@apollo/client';
import QueueLink from '@SocialAutoTransport/apollo-link-queue';
import { ApolloPersistOptions, PersistedData } from './types';
export default class Queue<T> {
    queueLink: QueueLink;
    serialize: boolean;
    client: ApolloClient<InMemoryCache>;
    beforeRestore: any;
    onCompleted: any;
    onError: any;
    constructor(options: ApolloPersistOptions<T>);
    extract(): PersistedData<T>;
    restore(data: PersistedData<T>): void;
}
