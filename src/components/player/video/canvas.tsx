/* eslint-disable react-hooks/exhaustive-deps */
import { useFiles } from "context";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useVideoContext } from "../context";

export default function Canvas() {
    const [currentTime, setCurrentTime] = useVideoContext("videoCurrentTime");
    const [newCurrentTime] = useVideoContext("newCurrentTime");
    const [, setDuration] = useVideoContext("videoDuration");
    const [paused, setPaused] = useVideoContext("videoPaused");
    const [muted] = useVideoContext("videoMuted");
    const [volume] = useVideoContext("videoVolume");
    const [, setMovedTime] = useVideoContext("movedTime");
    const [loop] = useVideoContext("videoLoop");
    const [refreshRate] = useVideoContext("refreshRate");
    const [{index, ...files}] = useFiles();
    
    const [video, setVideo] = useState(document.createElement("video"));
    const [, setRenderInterval] = useState<any>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    
    const FPS = 1000 / refreshRate;

    const drawInCanvas = (image: HTMLVideoElement = video) => {
        if (!canvas.current) return;
        const ctx = canvas.current.getContext("2d", { colorSpace: "srgb" });
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, canvas.current.width, canvas.current.height);
    };
    const Render = () => { if (!video.paused) drawInCanvas(); };

    useEffect(() => {
        if (files.list.length === 0) return;
        setPaused(true);
        setVideo(_ => {
            URL.revokeObjectURL(video.src);
            const newVideo = document.createElement("video");
            newVideo.src = URL.createObjectURL(files.list[index].content);
            // newVideo.autoplay = true;
            newVideo.load();
            newVideo.currentTime = .001;
            newVideo.onloadedmetadata = () => {
                setDuration(newVideo.duration);
                if (!canvas.current) return;
                const current = canvas.current;
                current.width = newVideo.videoWidth;
                current.height = newVideo.videoHeight;
                current.style.setProperty('--width', `${newVideo.videoWidth}`);
                current.style.setProperty('--height', `${newVideo.videoHeight}`);
            }
            newVideo.onloadeddata = () => drawInCanvas(newVideo);
            return newVideo;
        });
    }, [index, files.list]);

    useEffect(() => {
        const eventCurrentTime = () => setCurrentTime(video.currentTime);
        const eventPause = () => setPaused(true);
        const eventPlay = () => setPaused(false);
        Render();
        
        video.addEventListener("timeupdate", eventCurrentTime);
        video.addEventListener("pause", eventPause);
        video.addEventListener("play", eventPlay);
        return () => {
            video.removeEventListener("timeupdate", eventCurrentTime);
            video.removeEventListener("pause", eventPause);
            video.removeEventListener("play", eventPlay);
        }
    }, [video]);

    useEffect(() => { video.muted = muted; }, [muted, video]);
    useEffect(() => {
        if (paused) {
            video.pause();
            setRenderInterval(clearInterval);
            return;
        }
        video.play();
        setRenderInterval(setInterval(Render, refreshRate));
    }, [paused, video]);
    useEffect(() => {
        setMovedTime(newCurrentTime - currentTime);
        setCurrentTime(newCurrentTime);
        video.currentTime = newCurrentTime;
        video.ontimeupdate = () => {
            drawInCanvas();
            video.ontimeupdate = null;
        };
    }, [newCurrentTime]);
    useEffect(() => { video.loop = loop }, [loop, video]);
    useEffect(() => { if (!paused) setRenderInterval(setInterval(Render, FPS)); }, [refreshRate]);
    useEffect(() => { video.volume = volume }, [volume, video]);

    return <motion.canvas ref={canvas} />
}