import { GraphQLRequest } from '@apollo/client/link/core';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import QueueLink, { OperationQueueEntry } from '@SocialAutoTransport/apollo-link-queue';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Queue<T> {
  queueLink: QueueLink;
  serialize: boolean;
  client: ApolloClient<InMemoryCache>;
  beforeRestore: any;
  onCompleted: any;
  onError: any;

  constructor(options: ApolloPersistOptions<T>) {
    const { queueLink, serialize = true, client, beforeRestore, onCompleted, onError} = options;

    this.queueLink = queueLink;
    this.serialize = serialize;
    this.client = client;
    this.beforeRestore = beforeRestore;
    this.onCompleted = onCompleted;
    this.onError = onError;
  }
  
  extract(): PersistedData<T> {
      let data: PersistedData<T> = '';

      // Convert each Operation to a GraphQLRequest so we aren't persisting functions
      const entries = this.queueLink.getQueue().map((entry: OperationQueueEntry): GraphQLRequest => {
        let context = entry.operation.getContext();
        //Exclude cache which prevents serialization
        context.cache = undefined;
        context.getCacheKey = undefined;
        return {
          query: entry.operation.query,
          variables: entry.operation.variables,
          operationName: entry.operation.operationName,
          context: context,
          extensions: entry.operation.extensions,
        }
      });

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
      parsedData.map(graphqlRequest => {
        let workingGraphqlRequest = {...graphqlRequest};
        try {
          workingGraphqlRequest = this.beforeRestore(workingGraphqlRequest);
        } catch (error) {}
        const { query, variables, context } = (workingGraphqlRequest as unknown) as GraphQLRequest;
        if (this.queueLink.isType(query, 'mutation')) {
          this.client.mutate({mutation: query, variables, context})
          .then(response => {
            if (this.onCompleted) this.onCompleted(workingGraphqlRequest, response);
          })
          .catch(error => {
            if (this.onError) this.onError(workingGraphqlRequest, error);
          });
        } else {
          this.client.query({query, variables, context})
          .then(response => {
            if (this.onCompleted) this.onCompleted(workingGraphqlRequest, response);
          })
          .catch(error => {
            if (this.onError) this.onError(workingGraphqlRequest, error);
          });
        }
      });
    }
  }
}