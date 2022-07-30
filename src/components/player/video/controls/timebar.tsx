import { useVideoContext } from "components/player/context";
import { useDeferredValue, useEffect, useState } from "react";
import MediaControl from "./components/mediaControl";
import Timestamp from "./components/timestamp";
import Track from "./components/track";

export default function TimeBar({ isVisible = false }) {
    const [currentTime] = useVideoContext("videoCurrentTime");
    const [duration] = useVideoContext("videoDuration");
    const [, setNewCurrentTime] = useVideoContext("newCurrentTime");

    const [input, setInput] = useState(0);
    const deferedTime = useDeferredValue(input)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(parseInt(e.target.value));
    };

    useEffect(() => {
        setNewCurrentTime(input);
    }, [deferedTime]);

    return <MediaControl 
        isVisible={isVisible} 
        role="slider" 
        variant="timebar"
        animationDirection="y"
    >
        <Timestamp time={currentTime} variant="current-time" />
        <Track
            value={currentTime}
            max={duration}
            className="time-track"
            onChange={handleChange}
        />
        <Timestamp time={currentTime - duration} variant="remaining-time" />
    </MediaControl>
}