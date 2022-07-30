import { usePlayerVisible } from "context";
import Frame from "components/animated/frame";
import Video from "./video";
import Info from "./info";

export default function Player() {
    const [isVisible] = usePlayerVisible();

    return <Frame animationDirection="x" backwards isVisible={isVisible} className="video" variant="video-player">
        <Video />
        <Info />
        {/* <FileList /> */}
    </Frame>
}