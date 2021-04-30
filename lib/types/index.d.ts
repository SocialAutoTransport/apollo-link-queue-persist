import { ApolloClient, InMemoryCache } from "@apollo/client";
import QueueLink from "@SocialAutoTransport/apollo-link-queue";
export declare type LogLevel = "log" | "warn" | "error";
export declare type LogLine = [LogLevel, any[]];
export declare type TriggerUninstallFunction = () => void;
export declare type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;
export declare type PersistedData<T> = T | string | null;
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
    beforeRestore: any;
    onCompleted: any;
    onError: any;
}
