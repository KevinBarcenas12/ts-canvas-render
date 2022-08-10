import { useState, useId, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import _isMobile from 'util/mobile';
import { useVideoContext } from 'components/player/context';
import String from 'util/strings';
import type { Timer } from 'util/global';
import Fullscreen from './fullscreen';
import TogglePause from './playpause';
import Volume from './volume';
import Exit from './exit';
import TimeBar from './timebar';
import MediaControl from './components/mediaControl';

export default function Controls() {
    // Context
    const [paused, setPaused] = useVideoContext('videoPaused');
    const [, setFullscreen] = useVideoContext('videoFullscreen');
    const [, setCurrentTime] = useVideoContext('newCurrentTime');
    const [currentTime] = useVideoContext('videoCurrentTime');
    const [duration] = useVideoContext('videoDuration');
    // Component states
    const [visibleControls, setVisibleControls] = useState(true);
    const [, setHideTimeout] = useState<Timer>(null);
    const [movedTime, setMovedTime] = useState(0);
    const [showMovedTime, setShowMovedTime] = useState(false);
    const [, setMovedCleanUp] = useState<Timer>(null);

    useEffect(() => {
        if (paused) setVisibleControls(true);
        else {
            setHideTimeout(clearTimeout);
            setHideTimeout(setTimeout(() => setVisibleControls(false), 3000));
        }
    }, [paused]);

    // Constant variables
    const isMobile = _isMobile();
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
    const [timeWhenUpdated, setTimeWhenUpdated] = useState(currentTime);
    const [lClickCount, setLClickCount] = useState(0);
    const [rClickCount, setRClickCount] = useState(0);
    const [lClickCountDisplay, setLClickCountDisplay] = useState(lClickCount);
    const [rClickCountDisplay, setRClickCountDisplay] = useState(rClickCount);
    const [reseting, setReseting] = useState(false);
    const [, setGlobalReset] = useState<Timer>(null);

    const [isDisplaying, setDisplaying] = useState(false);
    const [, setDisplayClickTimeout] = useState<Timer>(null);

    // Handle click total count
    useEffect(() => {
        if (!reseting || globalClickCount === 0) return;
        setReseting(false);
        setGlobalReset(clearTimeout);
        setGlobalClickCount(0);
        setDisplayClickTimeout(clearTimeout);
        setTimeWhenUpdated(currentTime);
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
                if (paused && visibleControls) {
                    setHideTimeout(setTimeout(fn, Timeout.hideControls));
                }
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
        setCurrentTime(() => {
            const bwTime = lClickCount > 0 ? (lClickCount - 1) * 10 : 0;
            const fwTime = rClickCount > 0 ? (rClickCount - 1) * 10 : 0;
            const moved = fwTime - bwTime;
            const newTime = currentTime + moved;
            setMovedTime(() => {
                if (moved < 0 && currentTime + moved < 0) return parseInt(`${-currentTime}`, 10);
                if (moved > 0 && currentTime + moved > duration) return parseInt(`${duration}`, 10);
                return moved;
            });
            if (newTime > duration) return duration;
            if (newTime < 0) return 0;
            return newTime;
        });
    }, [reseting]); // eslint-disable-line react-hooks/exhaustive-deps

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
    }, [globalClickCount]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (globalClickCount === 0) {
            setDisplaying(false);
            return;
        }
        setLClickCountDisplay(lClickCount);
        setRClickCountDisplay(rClickCount);
        setDisplaying(true);
    }, [lClickCount, rClickCount]); // eslint-disable-line react-hooks/exhaustive-deps

    const ref = {
        main: useRef<HTMLDivElement>(null),
        left: useRef<HTMLDivElement>(null),
        right: useRef<HTMLDivElement>(null),
    };

    const getTimeToDisplay = (times: number, left = false, currentTime = timeWhenUpdated) => {
        if (times < 2) return 0;
        const time = --times * 10;
        if (left && currentTime - time < 0) return parseInt(`${currentTime}`, 10);
        if (!left && currentTime + time > duration) return parseInt(`${duration}`, 10);
        return time;
    };

    const TimeToDisplay = {
        left: -getTimeToDisplay(lClickCountDisplay, true),
        right: getTimeToDisplay(rClickCountDisplay),
    };

    return (
        <motion.div
            className="video__controls"
            onMouseMove={mouseMove}
            onMouseEnter={mouseMove}
            ref={ref.main}
            onClick={event => {
                const eq = (a: any, b: any) => a === b.current;
                const { target } = event;
                if (eq(target, ref.main) || eq(target, ref.left) || eq(target, ref.right)) {
                    setGlobalClickCount(prev => prev + 1);
                }
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
                    {String.getTimeExtended(TimeToDisplay.left)}
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
                    {movedTime > 0 ? 'Forward' : 'Backward'} {String.getTimeExtended(movedTime)}
                </MediaControl>
                {(isMobile) && (
                    <motion.div
                        className="click-handler left"
                        ref={ref.left}
                        onClick={() => setLClickCount(prev => prev + 1)}
                        key="left-click-handle"
                    />
                )}
                {(isMobile) && (
                    <motion.div
                        className="click-handler right"
                        ref={ref.right}
                        onClick={() => setRClickCount(prev => prev + 1)}
                        key="right-click-handle"
                    />
                )}
                <motion.div
                    className="prevent-controls-missclick"
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    );
}
