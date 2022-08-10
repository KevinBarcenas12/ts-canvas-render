import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import Canvas from './canvas';
import Controls from './controls';
import { useVideoContext, VideoContext } from '../context';

function VideoComponent() {
    const [fullscreen, setFullscreen] = useVideoContext('videoFullscreen');

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (fullscreen && document.fullscreenElement == null) {
            ref.current.requestFullscreen();
            window.screen.orientation.lock('landscape');
        }
        if (!fullscreen && document.fullscreenElement != null) {
            document.exitFullscreen();
            window.screen.orientation.unlock();
        }
    }, [fullscreen]);

    useEffect(() => {
        const measureFullscreen = () => setFullscreen(document.fullscreenElement != null);

        window.addEventListener('fullscreenchange', measureFullscreen);
        window.addEventListener('webkitfullscreenchange', measureFullscreen);
        window.addEventListener('mozfullscreenchange', measureFullscreen);
        window.addEventListener('MSFullscreenChange', measureFullscreen);
        window.addEventListener('msfullscreenchange', measureFullscreen);
        return () => {
            window.removeEventListener('fullscreenchange', measureFullscreen);
            window.removeEventListener('webkitfullscreenchange', measureFullscreen);
            window.removeEventListener('mozfullscreenchange', measureFullscreen);
            window.removeEventListener('MSFullscreenChange', measureFullscreen);
            window.removeEventListener('msfullscreenchange', measureFullscreen);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <motion.div className="video__player" ref={ref}>
            <Canvas />
            <Controls />
        </motion.div>
    );
}

export default function Video() {
    return (
        <VideoContext>
            <VideoComponent />
        </VideoContext>
    );
}
