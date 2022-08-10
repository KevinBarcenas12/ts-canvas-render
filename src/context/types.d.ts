import type { Dispatch, SetStateAction } from 'react';

export type Action<T> = Dispatch<SetStateAction<T>>;

export type ContextHook<T> = [T, Action<T>];
