import { useVideoContext } from "components/player/context";
import MediaControl from "./components/mediaControl";
import {
    IoPlay,
    IoPause,
} from "react-icons/io5";

export default function TogglePause({ isVisible = false }) {
    const [isPaused, setPaused] = useVideoContext("videoPaused");

    return <MediaControl
        animationDirection="y"
        isVisible={isVisible}
        role="toggler"
        variant="playpause"
        onClick={() => setPaused(prev => !prev)}
    >
        {!isPaused ? <IoPause className="icon" /> : <IoPlay className="icon" />}
    </MediaControl>
}