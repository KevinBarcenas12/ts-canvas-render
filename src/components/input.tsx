import { useEffect, useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    BsFileEarmarkArrowUp as UploadIcon,
    BsFileEarmarkCheck as CorrectFile,
    BsFileEarmarkX as IncorrectFile,
} from "react-icons/bs";

import { useFiles } from "context";
import { useModal } from "context";
import { usePlayerVisible } from "context";
import String from "util/strings";

import type { FileObject } from "context/types";
import Line from "components/animated/line";

export default function Input() {
    const [files, setFiles] = useFiles();
    const [, setModal] = useModal();
    const [playerVisible, setPlayerVisible] = usePlayerVisible();

    let [target, setTarget] = useState<File[]>([]);
    let [showCorrect, setShowCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        setPlayerVisible(files.list.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files.list]);

    useEffect(() => {
        if (target.length < 1) {
            setShowCorrect(null);
            return;
        }

        let fileList: File[] = [];
        let invalidList: string[] = [];

        for (let file of target) {
            if (!/^video/.test(file.type)) invalidList.push(file.name);
            fileList.push(file);
        }

        if (invalidList.length > 0) setModal(`Could not upload ${String.concat(invalidList, ", ")}`);
        let finalList: FileObject[] = [];
        // Create a converted list from files to the file object list
        finalList = fileList.map(file => {
            return {
                name: file.name,
                size: file.size,
                content: file,
                isValid: /^video/.test(file.type),
                thumbnail: ""
            }
        });
        finalList = finalList.map(file => {
            // Return if not playable type
            if (!file.isValid) {
                file.thumbnail = "/assets/images/invalid.png";
                return file;
            }

            // Create video thumbnail in half video-length
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file.content);
            video.preload = "metadata";
            video.load();
            video.currentTime = .001;
            video.onloadedmetadata = () => video.currentTime = video.duration / 2;
            video.onloadeddata = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    file.thumbnail = canvas.toDataURL("image/png");
                }
                URL.revokeObjectURL(video.src);
            }

            return file;
        });

        setFiles({
            list: finalList,
            index: 0,
            isValidFiles: () => finalList.filter(file => file.isValid).length > 0,
            getValidFiles: () => finalList.filter(file => file.isValid),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    useEffect(() => {
        if (!playerVisible) setShowCorrect(null);
    }, [playerVisible]);

    const Icon = () => {
        if (showCorrect === null) return <UploadIcon className="icon" />
        return showCorrect ? <CorrectFile className="icon" /> : <IncorrectFile className="icon" />;
    };

    const ShowButton = () => <span className="show-button" onClick={() => setPlayerVisible(true)}>
        Open Player
    </span>;

    const handleInput = (event: any) => setTarget(event.target.files);

    const length = files.getValidFiles().length;
    const key = useId();

    return <motion.div className="input">
        <motion.label>
            <input type="file" id="file" accept="video/*" multiple onInput={handleInput} hidden />
            <span className="line">Select file(s) <Icon /></span>
        </motion.label>
        <AnimatePresence>
            {files.isValidFiles() && <Line className="already-files" key={key}>
                {length} {length > 1 ? "files" : "file"} loaded <ShowButton />
            </Line>}
        </AnimatePresence>
    </motion.div>
}