import Line from "components/animated/line";
import { useFiles } from "context";
import String from "util/strings";
import Expandable from "./components/expandable";

export default function Info() {
    const [{ index, list }] = useFiles();
    const { name, size } = list[index];
    return <Expandable variant="info" id="video-info" title={String.getTitle(name)}>
        <Line>File name: {name}</Line>
        <Line>File title: {String.getTitle(name)}</Line>
        <Line>File size: {String.getSize(size)}</Line>
    </Expandable>;
}