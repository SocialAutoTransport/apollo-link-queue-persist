import { ApolloClient, InMemoryCache } from "@apollo/client";
import QueueLink from "@SocialAutoTransport/apollo-link-queue";

export type LogLevel = "log" | "warn" | "error";

export type LogLine = [LogLevel, any[]];

export type TriggerUninstallFunction = () => void;

export type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;

export type PersistedData<T> = T | string | null;

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T | null> | T | null;
  setItem: (key: string, value: T) => Promise<T> | Promise<void> | void | T;
  removeItem: (key: string) => Promise<T> | Promise<void> | void;
}

export interface ApolloPersistOptions<TSerialized> {
  queueLink: QueueLink;
  storage: PersistentStorage<PersistedData<TSerialized>>;
  trigger?: "write" | "background" | TriggerFunction | false;
  debounce?: number;
  key?: string;
  serialize?: boolean;
  maxSize?: number | false;
  debug?: boolean;
  client: ApolloClient<InMemoryCache>;
}
