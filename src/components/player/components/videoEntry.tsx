import { motion } from "framer-motion";
import Line from "components/animated/line";
import String from "util/strings";
import SmallFrame from "components/animated/small-frame";
import { useEffect, useState } from "react";
import { useFiles } from "context";
import { BsArrowLeft } from "react-icons/bs";

export default function VideoEntry({ index: currentIndex }: { index: number }) {
    const [{ index, list }, setFiles] = useFiles();
    const current = list[currentIndex];
    const [currentSrc, setCurrentSrc] = useState(current.thumbnail);

    useEffect(() => {setCurrentSrc(current.thumbnail)}, [current.thumbnail]);

    return <motion.div className="video-entry" onClick={() => setFiles(prev => ({...prev, index: currentIndex }))}>
        <motion.div className="thumbnail">
            <SmallFrame>
                <img src={currentSrc} alt={current.name} />
            </SmallFrame>
        </motion.div>
        <motion.div className="information">
            <Line truncate className="file name">File Name: {current.name}</Line>
            <Line truncate className="file title">File Title: {String.getTitle(current.name)}</Line>
            <Line truncate className="file size">File Size {String.getSize(current.size)}</Line>
            {current.isValid && <Line truncate className="file codec">Video Codec: {current.codec}</Line>}
        </motion.div>
        <motion.div className="current-selection">
            {index === currentIndex && <motion.div layoutId="current-selection"><BsArrowLeft className="icon" /></motion.div>}
        </motion.div>
    </motion.div>
}