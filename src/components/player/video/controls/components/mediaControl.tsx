import classNames from 'classnames';
import { motion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    role?: 'toggler' | 'slider' | 'text';
    variant?: string;
    onClick?: () => void;
    isVisible?: boolean;
    animationDirection?: 'x' | 'y';
    cancelAnimation?: boolean;
    backwards?: boolean;
    className?: string;
}

export default function MediaControl({
    children,
    role = undefined,
    variant = undefined,
    onClick = () => {},
    isVisible = true,
    animationDirection: direction = 'x',
    cancelAnimation = false,
    backwards = false,
    className,
}: Props) {
    const position = backwards ? '-100%' : '100%';
    const animations: any = {
        initial: { [direction]: position, opacity: 0 },
        animate: { [direction]: isVisible ? '0%' : position, opacity: isVisible ? 1 : 0 },
        exit: { [direction]: position, opacity: 0 },
    };
    const animation = cancelAnimation ? { initial: {}, animate: {}, exit: {} } : animations;
    return (
        <motion.div
            role={role}
            className={classNames(className, 'media-control')}
            id={variant}
            onClick={onClick}
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{ ease: [ 0.5, 0, 0, 1 ], duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
