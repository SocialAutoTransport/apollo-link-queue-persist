import { ApolloLink } from '@apollo/client/link/core';
import { QueueLink } from '@SocialAutoTransport/apollo-link-queue';
import { ApolloPersistOptions, PersistedData } from './types';
export default class Queue<T> {
    queueLink: QueueLink<T>;
    serialize: boolean;
    client: ApolloLink;
    constructor(options: ApolloPersistOptions<T>);
    extract(): PersistedData<T>;
    restore(data: PersistedData<T>): void;
}
