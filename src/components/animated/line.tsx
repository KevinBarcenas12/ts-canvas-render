import { useId } from "react";
import { motion } from "framer-motion";
import classnames from "classnames";

import { ElementAnimation } from "./animations";

interface Props {
    children: React.ReactNode;
    duration?: number;
    className?: string;
    variant?: string;
    id?: string;
    animate?: "width" | "height";
    truncate?: boolean;
}

export default function Line({
    children,
    duration: dur = 1,
    className,
    id,
    animate = "width",
    variant,
    truncate = false,
}: Props) {
    return <motion.div
        className={classnames("line", id)}
        id={variant}
        initial="initial"
        animate="animate"
        exit="exit"
        key={useId()}
        variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: .125, when: "beforeChildren" } },
            exit: { opacity: 0, transition: { duration: .125, when: "afterChildren" } },
        }}
    >
        <motion.span className={classnames("line__text", { truncate }, className)} id={id}>{children}</motion.span>
        <motion.div className="animation back-panel" variants={ElementAnimation(dur, true, animate)} />
        <motion.div className="animation front-panel" variants={ElementAnimation(dur, false, animate)} />
    </motion.div>
}