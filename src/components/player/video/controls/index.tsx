/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useId, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion"
import Fullscreen from "./fullscreen"
import TogglePause from "./playpause"
import Volume from "./volume"
import Exit from "./exit";
import TimeBar from "./timebar";
import mob from "util/mobile";
import { useVideoContext } from "components/player/context";
import String from "util/strings";
import MediaControl from "./components/mediaControl";

export default function Controls() {
    // Context
    const [paused, setPaused] = useVideoContext("videoPaused");
    const [, setFullscreen] = useVideoContext("videoFullscreen");
    const [, setCurrentTime] = useVideoContext("newCurrentTime");
    const [currentTime] = useVideoContext("videoCurrentTime");
    const [duration] = useVideoContext("videoDuration");
    // Component states
    const [visibleControls, setVisibleControls] = useState(true);
    const [, setHideTimeout] = useState<any>(null);
    const [movedTime, setMovedTime] = useState(0);
    const [showMovedTime, setShowMovedTime] = useState(false);
    const [, setMovedCleanUp] = useState<any>(null);

    useEffect(() => {
        if (paused) setVisibleControls(true);
        else {
            setHideTimeout(clearTimeout);
            setHideTimeout(setTimeout(() => setVisibleControls(false), 3000));
        }
    }, [paused]);

    // Constant variables
    const isMobile = mob();
    const Timeout = {
        iddleClick: 300,
        hideControls: 2000,
        hideCounter: 1000,
    };
    const key = {
        togglePause: useId(),
        volume: useId(),
        fullscreen: useId(),
        exit: useId(),
        timebar: useId(),
    };

    // Desktop movement handler
    const mouseMove = () => {
        if (isMobile) return;

        setVisibleControls(true);

        setHideTimeout(clearInterval);
        const fn = () => setVisibleControls(false);
        if (!paused) setHideTimeout(setTimeout(fn, Timeout.hideControls));
    };

    // Global click handler
    const [globalClickCount, setGlobalClickCount] = useState(0);
    const [lClickCount, setLClickCount] = useState(0);
    const [rClickCount, setRClickCount] = useState(0);
    const [lClickCountDisplay, setLClickCountDisplay] = useState(lClickCount);
    const [rClickCountDisplay, setRClickCountDisplay] = useState(rClickCount);
    const [reseting, setReseting] = useState(false);
    const [, setGlobalReset] = useState<any>(null);

    const [isDisplaying, setDisplaying] = useState(false);
    const [, setDisplayClickTimeout] = useState<any>(null);

    // Handle click total count
    useEffect(() => {
        if (!reseting || globalClickCount === 0) return;
        setReseting(false);

        setGlobalReset(clearTimeout);
        setGlobalClickCount(0);
        setDisplayClickTimeout(clearTimeout);
        if (globalClickCount > 1) {
            setShowMovedTime(true);
            setMovedCleanUp(clearTimeout);
            const fn = () => setShowMovedTime(false);
            setMovedCleanUp(setTimeout(fn, Timeout.hideCounter * 2));
        }
        setDisplayClickTimeout(setTimeout(() => {
            setLClickCount(0);
            setRClickCount(0);
        }, Timeout.hideCounter));

        if (globalClickCount === 1) {
            if (isMobile) {
                setVisibleControls(prev => !prev);
                setHideTimeout(clearTimeout);
                const fn = () => setVisibleControls(false);
                if (paused && visibleControls)
                    setHideTimeout(setTimeout(fn, Timeout.hideControls));
                return;
            }
            setPaused(prev => !prev);
            setVisibleControls(true);
            setHideTimeout(clearTimeout);
            const fn = () => setVisibleControls(false);
            if (paused) setHideTimeout(setTimeout(fn, Timeout.hideControls));
            return;
        }

        if (globalClickCount === 2 && !isMobile) {
            setFullscreen(prev => !prev);
            return;
        }

        setCurrentTime(_ => {
            const bwTime = lClickCount > 0 ? (lClickCount - 1) * 10 : 0;
            const fwTime = rClickCount > 0 ? (rClickCount - 1) * 10 : 0;
            const newTime = currentTime + (fwTime - bwTime);
            setMovedTime(fwTime - bwTime);
            if (newTime > duration) return duration;
            if (newTime < 0) return 0;
            return newTime;
        });
    }, [reseting]);

    // Handle click count timeout to reset
    useEffect(() => {
        if (globalClickCount === 0) return;

        if (globalClickCount === 2 && !isMobile) {
            setGlobalReset(clearTimeout);
            setReseting(true);
            return;
        }

        if (globalClickCount >= 2) {
            setDisplaying(true);
        }

        setGlobalReset(clearTimeout);
        setGlobalReset(setTimeout(() => setReseting(true), Timeout.iddleClick));
    }, [globalClickCount]);

    useEffect(() => {
        if (globalClickCount === 0) {
            setDisplaying(false);
            return;
        }
        setLClickCountDisplay(lClickCount);
        setRClickCountDisplay(rClickCount);
        setDisplaying(true);
    }, [lClickCount, rClickCount]);

    const ref = {
        main: useRef<HTMLDivElement>(null),
        left: useRef<HTMLDivElement>(null),
        right: useRef<HTMLDivElement>(null),
    };

    const TimeToDisplay = {
        left: lClickCountDisplay > 0 ? (lClickCountDisplay - 1) * 10 : 0,
        right: rClickCountDisplay > 0 ? (rClickCountDisplay - 1) * 10 : 0,
    };

    return <motion.div
        className="video__controls"
        onMouseMove={mouseMove}
        onMouseEnter={mouseMove}
        ref={ref.main}
        onClick={event => {
            const eq = (a: any, b: any) => a === b.current;
            const target = event.target;
            if (eq(target, ref.main) || eq(target, ref.left) || eq(target, ref.right))
                setGlobalClickCount(prev => prev + 1);
        }}
    >
        <AnimatePresence>
            <MediaControl
                animationDirection="x"
                isVisible={lClickCountDisplay > 1 && isDisplaying}
                role="text"
                key="left-time"
                variant="left-time"
            >
                {String.getTimeExtended(-TimeToDisplay.left)}
            </MediaControl>
            <MediaControl
                animationDirection="x"
                isVisible={rClickCountDisplay > 1 && isDisplaying}
                role="text"
                key="right-time"
                variant="right-time"
                backwards
            >
                {String.getTimeExtended(TimeToDisplay.right)}
            </MediaControl>
            <MediaControl
                isVisible={showMovedTime}
                role="text"
                key="moved-time"
                variant="moved-time"
            >
                {movedTime > 0 ? "Forward" : "Backward"} {String.getTimeExtended(movedTime)}
            </MediaControl>
            {(visibleControls && isMobile) && <motion.div
                className="click-handler left"
                ref={ref.left}
                onClick={() => setLClickCount(prev => prev + 1)}
                key="left-click-handle"
            />}
            {(visibleControls && isMobile) && <motion.div
                className="click-handler right"
                ref={ref.right}
                onClick={() => setRClickCount(prev => prev + 1)}
                key="right-click-handle"
            />}
            <motion.div
                className="prevent-controls-missclick"
                onClick={() => {}}
                key="prevent-controls-missclick"
            />
            <TogglePause isVisible={visibleControls} key={key.togglePause} />
            <Fullscreen isVisible={visibleControls} key={key.fullscreen} />
            <Volume isVisible={visibleControls} key={key.volume} />
            <Exit isVisible={visibleControls} key={key.exit} />
            <TimeBar isVisible={visibleControls} key={key.timebar} />
        </AnimatePresence>
    </motion.div>
}