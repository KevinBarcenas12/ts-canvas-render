import { useState, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { FrameAnimation } from './animations';

interface Props {
    animationDuration?: number;
    animationDirection?: 'x' | 'y';
    backwards?: boolean;
    isVisible?: boolean;
    className?: string;
    variant?: string;
    id?: string;
    children?: React.ReactNode;
}

export default function Frame({
    animationDuration: dur = 1,
    animationDirection: dir = 'x',
    backwards = false, isVisible = true,
    className, id, variant,
    children,
}: Props) {
    const getLandscape = () => window.screen.availWidth > window.screen.availHeight;
    const [ landscape, setLandscape ] = useState(getLandscape());

    useEffect(() => {
        const event = () => setLandscape(getLandscape());
        window.addEventListener('orientationchange', event);
        return () => window.removeEventListener('orientationchange', event);
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

    return (
        <motion.nav
            className="frame"
            initial="initial"
            id={variant}
            animate="animate"
            exit="exit"
            key={variant}
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="animation back-panel"
                        key={key.backPanel}
                        initial={animations.backPanel.initial}
                        animate={animations.backPanel.animate}
                        exit={animations.backPanel.exit}
                    />
                )}
                {isVisible && (
                    <motion.div
                        className="animation front-panel"
                        key={key.frontPanel}
                        initial={animations.frontPanel.initial}
                        animate={animations.frontPanel.animate}
                        exit={animations.frontPanel.exit}
                    />
                )}
                {isVisible && (
                    <motion.div
                        className={classNames('frame__container', className)}
                        key={key.container}
                        id={id}
                        initial={animations.frontPanel.initial}
                        animate={animations.frontPanel.animate}
                        exit={animations.frontPanel.exit}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
