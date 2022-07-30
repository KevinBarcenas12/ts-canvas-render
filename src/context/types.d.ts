import type { Dispatch, SetStateAction } from "react";

export type Action<T> = Dispatch<SetStateAction<T>>;

export type ContextHook<T> = [T, Action<T>];

export interface FileObject {
    readonly name: string;
    readonly size: number;
    readonly isValid: boolean;
    readonly content: File;
    thumbnail: string;
}