import { useVideoContext } from "components/player/context";
import MediaControl from "./components/mediaControl";

import {
    AiOutlineFullscreen,
    AiOutlineFullscreenExit,
} from "react-icons/ai";

export default function Fullscreen({ isVisible = false }) {
    const [fullscreen, setFullscreen] = useVideoContext("videoFullscreen");

    return <MediaControl
        variant="fullscreen"
        role="toggler"
        onClick={() => setFullscreen(prev => !prev)}
        isVisible={isVisible}
        animationDirection="y"
    >
        {fullscreen ? <AiOutlineFullscreenExit className="icon" /> : <AiOutlineFullscreen className="icon" />}
    </MediaControl>
}