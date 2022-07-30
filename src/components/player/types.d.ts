import type { Dispatch, SetStateAction } from "react";
import React from "react";

export type Action<T> = Dispatch<SetStateAction<T>>;
export type useContextHook<T> = [T, Action<T>];
export type ProviderObj = { [key in keyof ContextList]: React.Context<ContextList[key]> };
export type UpdaterObj = { [key in keyof ContextList]: React.Context<Action<ContextList[key]>> };

export type Context<T> = React.Context<T>;
export type ContextUpdater<T> = React.Context<Action<T>>;

type RefreshRates = 24 | 29.97 | 30 | 48 | 59.9 | 60;

export interface ContextList {
    // Time
    videoCurrentTime: number;
    newCurrentTime: number;
    movedTime: number;
    videoDuration: number;
    // Volume
    videoVolume: number;
    videoMuted: boolean;
    // Controls
    videoPaused: boolean;
    videoLoop: boolean;
    videoFullscreen: boolean;
    // Refresh rate
    refreshRate: RefreshRates;
};