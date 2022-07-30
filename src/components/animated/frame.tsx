import { useState, useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FrameAnimation } from "./animations";
import classNames from "classnames";

interface Props {
    animationDuration?: number;
    animationDirection?: "x" | "y";
    backwards?: boolean;
    isVisible?: boolean;
    className?: string;
    variant?: string;
    id?: string;
    children?: React.ReactNode;
};

export default function Frame({
    animationDuration: dur = 1,
    animationDirection: dir = "x",
    backwards = false, isVisible = true,
    className, id, variant,
    children,
}: Props) {
    let [ landscape, setLandscape ] = useState(window.screen.availWidth > window.screen.availHeight);

    useEffect(() => {
        const event = () => setLandscape(window.screen.availWidth > window.screen.availHeight);

        window.addEventListener("orientationchange", event);
        return () => window.removeEventListener("orientationchange", event);
    }, []);

    const key = {
        backPanel: useId(),
        frontPanel: useId(),
        container: useId(),
    };
    const animations = {
        backPanel: FrameAnimation(dur, false, dir, backwards, landscape),
        frontPanel: FrameAnimation(dur, true, dir, backwards, landscape),
    };

    return <motion.nav
        className="frame"
        initial="initial"
        id={variant}
        animate="animate"
        exit="exit"
        key={variant}
    >
        <AnimatePresence>
            {isVisible && <motion.div
                className="animation back-panel"
                key={key.backPanel}
                {...{...animations.backPanel}}
            />}
            {isVisible && <motion.div
                className="animation front-panel"
                key={key.frontPanel}
                {...{...animations.frontPanel}}
            />}
            {isVisible && <motion.div
                className={classNames("frame__container", className)}
                key={key.container}
                id={id}
                {...{...animations.frontPanel}}
            >
                {children}
            </motion.div>}
        </AnimatePresence>
    </motion.nav>
}