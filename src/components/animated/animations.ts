const EXTRA_TIME = .5;

export function FrameAnimation(
    duration: number = 1,
    front = false,
    direction: "x" | "y" = "y",
    backwards = false,
    landscape = false,
) {
    const position = backwards ? "-100%" : "100%";
    return {
        initial: { [direction]: position },
        animate: {
            [direction]: "0%",
            transition: {
                duration: landscape ? duration : duration + EXTRA_TIME,
                staggerChildren: .25,
                staggerDirection: 1,
                when: "beforeChildren",
                delay: front ? duration / 10 : 0,
                ease: [ .5, 0, 0, 1 ],
            }
        },
        exit: {
            [direction]: position,
            transition: {
                duration: landscape ? duration : duration + EXTRA_TIME,
                staggerChildren: .25,
                staggerDirection: -1,
                when: "afterChildren",
                delay: !front ? duration / 10 : 0,
                ease: [ 1, 0, .5, 1 ],
            }
        }
    }
}

export function ElementAnimation(
    duration = 1,
    front = false, 
    direction: ("width" | "height") = "width"
) {
    return {
        initial: { [direction]: '100%' },
        animate: {
            [direction]: 0,
            transition: {
                duration: duration,
                ease: [.5, 0, 0, 1],
                delay: front ? duration / 5 : 0,
            }
        },
        exit: {
            [direction]: '100%',
            transition: {
                duration: duration,
                ease: [1, 0, .5, 1],
                delay: front ? 0 : duration / 5,
            }
        }
    };
}