import { usePlayerVisible } from 'context';
import { useVideoContext } from 'components/player/context';

import { IoClose } from 'react-icons/io5';
import MediaControl from './components/mediaControl';

export default function Exit({ isVisible = false }): JSX.Element {
    const [, setShowPlayer] = usePlayerVisible();
    const [, setPaused] = useVideoContext('videoPaused');
    const [, setCurrentTime] = useVideoContext('videoCurrentTime');
    const [fullscreen] = useVideoContext('videoFullscreen');

    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (fullscreen) return <></>;

    return (
        <MediaControl
            onClick={() => {
                setShowPlayer(false);
                setPaused(true);
                setTimeout(() => setCurrentTime(0), 1000);
            }}
            role="toggler"
            variant="exit"
            isVisible={isVisible}
        >
            <IoClose className="icon" />
        </MediaControl>
    );
}
