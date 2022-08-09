import classNames from "classnames";
import Line from "components/animated/line";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useId, useState } from "react";
import String from "util/strings";

interface Props {
    children?: React.ReactNode;
    id?: string;
    title: string;
    initialOpen?: boolean;
    variant?: string;
}

export default function Expandable({
    children,
    id,
    title = "Expandable",
    initialOpen = false,
    variant
}: Props) {
    const [open, setOpen] = useState(initialOpen);
    const key = useId();

    return <LayoutGroup id={id}>
        <motion.div layout className={classNames("expandable", { open })} id={variant}>
            <motion.div layout className="expandable__title" onClick={() => setOpen(prev => !prev)}>
                <Line truncate id={id}>{String.capitalize(title)}</Line>
            </motion.div>
            <AnimatePresence>
                {open && <motion.div layout key={key} className="expandable__container" id={id}>
                    {children}
                </motion.div>}
            </AnimatePresence>
        </motion.div>
    </LayoutGroup>
}