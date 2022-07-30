import classNames from "classnames";
import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    role?: "toggler" | "slider" | "text";
    variant?: string;
    onClick?: () => void;
    isVisible?: boolean;
    animationDirection?: "x" | "y";
    cancelAnimation?: boolean;
    backwards?: boolean;
    className?: string;
};

export default function MediaControl({
    children,
    role = undefined,
    variant = undefined,
    onClick = () => {},
    isVisible = true,
    animationDirection: direction = "x",
    cancelAnimation = false,
    backwards = false,
    className,
}: Props) {
    let pos = backwards ? "-100%" : "100%";
    let animations: any = {
        initial: { [direction]: pos, opacity: 0 },
        animate: { [direction]: isVisible ? "0%" : pos, opacity: isVisible ? 1 : 0 },
        exit: { [direction]: pos, opacity: 0 },
    };
    return <motion.div
        role={role}
        className={classNames(className, "media-control")}
        id={variant}
        onClick={onClick}
        {...(cancelAnimation ? {} : animations)}
        transition={{ ease: [ .5, 0, 0, 1 ], duration: .5 }}
    >
        {children}
    </motion.div>
}