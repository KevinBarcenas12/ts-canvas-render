import { useVideoContext } from 'components/player/context';
import {
    IoVolumeMute,
    IoVolumeHigh,
    IoVolumeMedium,
    IoVolumeLow,
} from 'react-icons/io5';
import MediaControl from './components/mediaControl';
import Track from './components/track';

function Icon() {
    const [volume] = useVideoContext('videoVolume');
    const [muted] = useVideoContext('videoMuted');

    if (muted || volume === 0) return <IoVolumeMute className="icon volume-button" />;

    if (volume > 0.75) return <IoVolumeHigh className="icon volume-button" />;
    if (volume > 0.5) return <IoVolumeMedium className="icon volume-button" />;
    return <IoVolumeLow className="icon volume-button" />;
}

function VolumeInput() {
    const [volume, setVolume] = useVideoContext('videoVolume');

    return (
        <Track
            value={volume * 100}
            step={1}
            max={100}
            onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
        />
    );
}

export default function Volume({ isVisible = false }) {
    const [, setMuted] = useVideoContext('videoMuted');

    return (
        <MediaControl
            isVisible={isVisible}
            variant="volume"
            role="slider"
            animationDirection="y"
        >
            <MediaControl
                cancelAnimation
                variant="volume__toggler"
                role="toggler"
                onClick={() => setMuted(prev => !prev)}
            >
                <Icon />
            </MediaControl>
            <VolumeInput />
        </MediaControl>
    );
}
