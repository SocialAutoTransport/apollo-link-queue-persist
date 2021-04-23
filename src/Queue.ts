import { GraphQLRequest } from '@apollo/client/link/core';
import { ApolloClient } from 'apollo-client';
import { QueueLink, OperationQueueEntry } from '@SocialAutoTransport/apollo-link-queue';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Queue<T> {
  queueLink: QueueLink<T>;
  serialize: boolean;
  client: ApolloClient;

  constructor(options: ApolloPersistOptions<T>) {
    const { queueLink, serialize = true, client } = options;

    this.queueLink = queueLink;
    this.serialize = serialize;
    this.client = client;
  }
  
  extract(): PersistedData<T> {
      let data: PersistedData<T> = '';

      // Convert each Operation to a GraphQLRequest so we aren't persisting functions
      const entries = this.queueLink.getQueue().map((entry: OperationQueueEntry): GraphQLRequest => ({
        query: entry.operation.query,
        variables: entry.operation.variables,
        operationName: entry.operation.operationName,
        context: entry.operation.getContext(),
        extensions: entry.operation.extensions,
      }));

      if (this.serialize) {
        data = JSON.stringify(entries) as string;
      }

      return data;
  }

  restore(data: PersistedData<T>): void {
    let parsedData: GraphQLRequest[] = null;

    if (this.serialize && typeof data === 'string') {
      parsedData = JSON.parse(data);
    } else {
      //parsedData = data as GraphQLRequest[]
    }

    if (parsedData != null) {
      for (const graphqlRequest in parsedData) {
        const { query, variables, context } = graphqlRequest as GraphQLRequest;
        if (this.queueLink.isType(query, 'mutation')) {
          this.client.mutate({mutation: query, variables, context});
        } else {
          this.client.query({query, variables, context});
        }
      }
    }
  }
}