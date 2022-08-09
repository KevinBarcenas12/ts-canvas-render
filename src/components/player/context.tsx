import React, { createContext, useContext, useEffect, useState } from "react";
import type {
    Action,
    ProviderObj,
    UpdaterObj,
    ContextList,
    useContextHook,
    RefreshRates,
    Context,
    ContextUpdater,
    Dimensions,
} from "./types";

const CurrentTime           = createContext<number>(0);
const CurrentTimeUpdater    = createContext<Action<number>>(() => {});

const NewCurrentTime        = createContext<number>(0);
const NewCurrentTimeUpdater = createContext<Action<number>>(() => {});

const MovedTime             = createContext<number>(0);
const MovedTimeUpdater      = createContext<Action<number>>(() => {});

const VideoVolume           = createContext<number>(1);
const VideoVolumeUpdater    = createContext<Action<number>>(() => {});

const VideoDuration         = createContext<number>(0);
const VideoDurationUpdater  = createContext<Action<number>>(() => {});

const VideoPaused           = createContext<boolean>(true);
const VideoPausedUpdater    = createContext<Action<boolean>>(() => {});

const VideoMuted            = createContext<boolean>(false);
const VideoMutedUpdater     = createContext<Action<boolean>>(() => {});

const VideoLoop             = createContext<boolean>(false);
const VideoLoopUpdater      = createContext<Action<boolean>>(() => {});

const VideoFullscreen       = createContext<boolean>(false);
const VideoFullscreenUpdater= createContext<Action<boolean>>(() => {});

const VideoRefreshRate      = createContext<RefreshRates>(24);
const VideoRefreshRateUpdater= createContext<Action<RefreshRates>>(() => {});

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

export function useVideoContext<T extends keyof ContextList>(key: T): useContextHook<ContextList[T]> {
    return [
        useContext(Provider[key]),
        useContext(Updater[key]),
    ]
}

type ContextProviderProps<T> = {
    hook: useContextHook<T>;
    Upd: ContextUpdater<T>;
    Val: Context<T>;
    children: React.ReactNode;
};
function ContextProvider<Key extends keyof ContextList>({ hook, Upd, Val, children }: ContextProviderProps<ContextList[Key]>) {
    const [ value, setter ] = hook;
    return <Val.Provider value={value}>
        <Upd.Provider value={setter}>
            {children}
        </Upd.Provider>
    </Val.Provider>
}

function ContextElement({ element, children }: { element: any, children: React.ReactNode }): JSX.Element {
    const length = Object.keys(element).length;
    if (element == null) return <>{children}</>;

    for (let key in element) {
        const { [key]: current, ...rest } = element;
        if (current == null) return <></>;
        const [ hook, value, updater ] = current;
        return <ContextProvider
            Upd={updater}
            Val={value}
            hook={hook}
        >
            {length > 1 ? <ContextElement element={rest}>{children}</ContextElement> : children}
        </ContextProvider>
    }
    return <></>
}

export function VideoContext({ children }: { children: React.ReactNode }): JSX.Element {
    localStorage.setItem("refreshRate", JSON.stringify({ refreshRate: 24 }));

    localStorage.getItem("volume") == null && localStorage.setItem("volume", JSON.stringify({ volume: 1, muted: false }));
    localStorage.getItem("refreshRate") == null && localStorage.setItem("refreshRate", JSON.stringify({ refreshRate: 24 }));

    const local_volume = JSON.parse(localStorage.getItem("volume") as string) || { volume: 1, muted: false };
    const local_refreshRate = JSON.parse(localStorage.getItem("refreshRate") as string) || { refreshRate: 24 };

    let [volume, setVolume] = useState(local_volume.volume as number);
    let [refreshRate, setRefreshRate] = useState(local_refreshRate.refresRate as RefreshRates);
    let [muted, setMuted] = useState(false);

    useEffect(() => { localStorage.setItem("volume", JSON.stringify({ volume, muted })) }, [volume, muted]);
    useEffect(() => { localStorage.setItem("refreshRate", JSON.stringify({ refreshRate })) }, [refreshRate]);

    const props = {
        currentTime: [useState(0), CurrentTime, CurrentTimeUpdater],
        newCurrentTime: [useState(0), NewCurrentTime, NewCurrentTimeUpdater],
        movedTime: [useState(0), MovedTime, MovedTimeUpdater],
        videoVolume: [[volume, setVolume], VideoVolume, VideoVolumeUpdater],
        videoDuration: [useState(0), VideoDuration, VideoDurationUpdater],
        videoPaused: [useState(true), VideoPaused, VideoPausedUpdater],
        videoMuted: [[muted, setMuted], VideoMuted, VideoMutedUpdater],
        videoLoop: [useState(false), VideoLoop, VideoLoopUpdater],
        videoFullscreen: [useState(false), VideoFullscreen, VideoFullscreenUpdater],
        refreshRate: [[refreshRate, setRefreshRate], VideoRefreshRate, VideoRefreshRateUpdater],
        videoDimensions: [useState<Dimensions>({ width: 0, height: 0 }), VideoDimensions, VideoDimensionsUpdater],
    };

    return <ContextElement element={props}>{children}</ContextElement>
}