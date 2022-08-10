import { useState, useCallback, useEffect } from 'react';

export default function useElementDimensions({ liveMeasure = false }) {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    });

    const [node, setNode] = useState<HTMLElement | null>(null);
    const ref = useCallback((refNode: (HTMLElement | null)) => setNode(refNode), []);

    useEffect(() => {
        if (!node) return;
        const handleResize = () => {
            setDimensions({
                width: node.getBoundingClientRect().width,
                height: node.getBoundingClientRect().height,
            });
        };
        if (!liveMeasure) return;
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        // eslint-disable-next-line consistent-return
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [node, liveMeasure]);

    return [ref, dimensions];
}
