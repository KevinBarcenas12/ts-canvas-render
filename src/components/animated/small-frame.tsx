import { useId } from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames';

import { ElementAnimation } from './animations';

interface Props {
    children?: React.ReactNode;
    duration?: number;
    className?: string;
    variant?: string;
    id?: string;
    animate?: 'width' | 'height';
}

export default function SmallFrame({
    children,
    duration: dur = 1,
    className,
    id,
    animate = 'width',
    variant,
}: Props) {
    return (
        <motion.div
            className="small-frame"
            id={variant}
            role="text"
            initial="initial"
            animate="animate"
            exit="exit"
            key={useId()}
            variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: 0.125, when: 'beforeChildren' } },
                exit: { opacity: 0, transition: { duration: 0.125, when: 'afterChildren' } },
            }}
        >
            <motion.div className={classnames('small-frame__container', className)} id={id}>
                {children}
            </motion.div>
            <motion.div className="animation back-panel" variants={ElementAnimation(dur, true, animate)} />
            <motion.div className="animation front-panel" variants={ElementAnimation(dur, false, animate)} />
        </motion.div>
    );
}
