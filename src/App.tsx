import Frame from 'components/animated/frame';
import Input from 'components/input';
import Player from 'components/player';
import { FilesProvider, PlayerVisibleProvider } from 'context';

import './assets/index.css';
import './assets/main.scss';

function Layout() {
    return (
        <Frame animationDirection="y" variant="main-container">
            <Input />
            <Player />
        </Frame>
    );
}

function App() {
    return (
        <FilesProvider>
            <PlayerVisibleProvider>
                <Layout />
            </PlayerVisibleProvider>
        </FilesProvider>
    );
}

export default App;
