import { usePlayerVisible } from "context";
import Frame from "components/animated/frame";
import Video from "./video";
import Info from "./info";
import Entries from "./entries";
import { LayoutGroup, motion } from "framer-motion";
import classNames from "classnames";

export default function Player() {
    const [isVisible] = usePlayerVisible();

    return <Frame
        animationDirection="x"
        backwards
        isVisible={isVisible}
        className={classNames("video", "container")}
        variant="video-player"
    >
        <motion.div className="content-container">
            <Video />
            <LayoutGroup id="video-information">
                <Info />
                <motion.div className="extra-container">
                    <Entries />
                </motion.div>
            </LayoutGroup>
        </motion.div>
    </Frame>
}