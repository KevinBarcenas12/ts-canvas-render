import { motion } from "framer-motion"
import String from "util/strings";
import classNames from "classnames";

export default function Timestamp({ time, variant }: { time: number, variant?: string }) {
    return <motion.div className={classNames("timestamp", variant)}>
        {String.getTime(time)}
    </motion.div>
}