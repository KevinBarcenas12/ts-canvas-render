/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-multi-spaces */
import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
    Action,
    ProviderObj,
    UpdaterObj,
    ContextList,
    useContextHook,
    RefreshRates,
    Context,
    Dimensions,
    useStateHook,
} from './types';

const CurrentTime               = createContext<number>(0);
const CurrentTimeUpdater        = createContext<Action<number>>(() => {});

const NewCurrentTime            = createContext<number>(0);
const NewCurrentTimeUpdater     = createContext<Action<number>>(() => {});

const MovedTime                 = createContext<number>(0);
const MovedTimeUpdater          = createContext<Action<number>>(() => {});

const VideoVolume               = createContext<number>(1);
const VideoVolumeUpdater        = createContext<Action<number>>(() => {});

const VideoDuration             = createContext<number>(0);
const VideoDurationUpdater      = createContext<Action<number>>(() => {});

const VideoPaused               = createContext<boolean>(true);
const VideoPausedUpdater        = createContext<Action<boolean>>(() => {});

const VideoMuted                = createContext<boolean>(false);
const VideoMutedUpdater         = createContext<Action<boolean>>(() => {});

const VideoLoop                 = createContext<boolean>(false);
const VideoLoopUpdater          = createContext<Action<boolean>>(() => {});

const VideoFullscreen           = createContext<boolean>(false);
const VideoFullscreenUpdater    = createContext<Action<boolean>>(() => {});

const VideoRefreshRate          = createContext<RefreshRates>(24);
const VideoRefreshRateUpdater   = createContext<Action<RefreshRates>>(() => {});

const VideoDimensions = createContext<Dimensions>({ width: 0, height: 0 });
const VideoDimensionsUpdater = createContext<Action<Dimensions>>(() => {});

const Provider: ProviderObj = {
    videoCurrentTime: CurrentTime,
    newCurrentTime: NewCurrentTime,
    movedTime: MovedTime,
    videoVolume: VideoVolume,
    videoDuration: VideoDuration,
    videoPaused: VideoPaused,
    videoMuted: VideoMuted,
    videoLoop: VideoLoop,
    videoFullscreen: VideoFullscreen,
    refreshRate: VideoRefreshRate,
    videoDimensions: VideoDimensions,
};
const Updater: UpdaterObj = {
    videoCurrentTime: CurrentTimeUpdater,
    newCurrentTime: NewCurrentTimeUpdater,
    movedTime: MovedTimeUpdater,
    videoVolume: VideoVolumeUpdater,
    videoDuration: VideoDurationUpdater,
    videoPaused: VideoPausedUpdater,
    videoMuted: VideoMutedUpdater,
    videoLoop: VideoLoopUpdater,
    videoFullscreen: VideoFullscreenUpdater,
    refreshRate: VideoRefreshRateUpdater,
    videoDimensions: VideoDimensionsUpdater,
};

type useVideoContext<T extends keyof ContextList> = useContextHook<ContextList[T]>;
export function useVideoContext<T extends keyof ContextList>(key: T): useVideoContext<T> {
    return [
        useContext(Provider[key]),
        useContext(Updater[key]),
    ];
}

interface ContextProviderProps<T extends keyof ContextList> {
    Hook: useStateHook<ContextList[T]>;
    Value: Context<ContextList[T]>;
    Updater: Context<Action<ContextList[T]>>;
    children: React.ReactNode;
    key: T;
}
function ContextProvider<T extends keyof ContextList>({
    Hook: [value, setter], Updater,
    Value, children, key,
}: ContextProviderProps<T>) {
    return (
        <Updater.Provider value={setter} key={key}>
            <Value.Provider value={value}>
                {children}
            </Value.Provider>
        </Updater.Provider>
    );
}

type ContextObject = {
    [key in keyof ContextList]: [
        useStateHook<ContextList[key]>,
        Context<ContextList[key]>,
        Context<Action<ContextList[key]>>
    ]
}
interface ContextProps<T = void> {
    element: Partial<ContextObject>;
    children: React.ReactNode;
    key: T;
}
function ContextElement<T extends keyof ContextList>({ element, children, key }: ContextProps<T>) {
    key = Object.keys(element)[0] as T;
    const { [key]: current, ...rest } = element;
    if (current == null) return (<>{children}</>);
    const [ Hook, Value, Updater ] = current;
    return (
        Object.keys(rest).length > 0 ? (
            <ContextProvider
                key={key}
                Hook={Hook}
                Updater={Updater}
                Value={Value}
            >
                {children}
            </ContextProvider>
        ) : (<>{children}</>)
    );
}

export function VideoContext({ children }: { children: React.ReactNode }): JSX.Element {
    if (localStorage.getItem('volume') == null) {
        localStorage.setItem('volume', JSON.stringify({ volume: 1, muted: false }));
    }
    if (localStorage.getItem('refreshRate') == null) {
        localStorage.setItem('refreshRate', JSON.stringify({ refreshRate: 24 }));
    }

    const LOCAL_VOLUME = JSON.parse(localStorage.getItem('volume') as string) || { volume: 1, muted: false };
    const LOCAL_REFRESHRATE = JSON.parse(localStorage.getItem('refreshRate') as string) || { refreshRate: 24 };

    const [volume, setVolume] = useState(LOCAL_VOLUME.volume as number);
    const [refreshRate, setRefreshRate] = useState(LOCAL_REFRESHRATE.refresRate as RefreshRates);
    const [muted, setMuted] = useState(false);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

    useEffect(() => { localStorage.setItem('volume', JSON.stringify({ volume, muted })); }, [volume, muted]);
    useEffect(() => { localStorage.setItem('refreshRate', JSON.stringify({ refreshRate })); }, [refreshRate]);

    const props: ContextProps['element'] = {
        videoCurrentTime: [useState(0), CurrentTime, CurrentTimeUpdater],
        newCurrentTime: [useState(0), NewCurrentTime, NewCurrentTimeUpdater],
        movedTime: [useState(0), MovedTime, MovedTimeUpdater],
        videoVolume: [[volume, setVolume], VideoVolume, VideoVolumeUpdater],
        videoDuration: [useState(0), VideoDuration, VideoDurationUpdater],
        videoPaused: [useState<boolean>(true), VideoPaused, VideoPausedUpdater],
        videoMuted: [[muted, setMuted], VideoMuted, VideoMutedUpdater],
        videoLoop: [useState<boolean>(false), VideoLoop, VideoLoopUpdater],
        videoFullscreen: [useState<boolean>(false), VideoFullscreen, VideoFullscreenUpdater],
        refreshRate: [[refreshRate, setRefreshRate], VideoRefreshRate, VideoRefreshRateUpdater],
        videoDimensions: [[dimensions, setDimensions], VideoDimensions, VideoDimensionsUpdater],
    };

    return <ContextElement element={props} key={null as any}>{children}</ContextElement>;
}
