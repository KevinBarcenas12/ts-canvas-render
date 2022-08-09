import { useFiles } from "context";
import { LayoutGroup } from "framer-motion";
import Expandable from "./components/expandable";
import VideoEntry from "./components/videoEntry";

export default function Entries() {
    const [files] = useFiles();

    return <Expandable title="Selected file(s)" variant="list" id="file-list">
        <LayoutGroup id="file-list">
            {files.list.map((_, index) => <VideoEntry index={index} key={index} />)}
        </LayoutGroup>
    </Expandable>
}