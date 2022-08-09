import Frame from 'components/animated/frame';
import Input from 'components/input';
import Player from 'components/player';
import { FilesProvider, PlayerVisibleProvider } from 'context';
import { Fragment } from 'react';

import "./assets/index.css";
import "./assets/main.scss";

function Layout() {
  return <Fragment>
    <Frame animationDirection="y" variant="main-container">
      <Input />
      <Player />
    </Frame>
  </Fragment>
}

function App() {
  return <Fragment>
    <FilesProvider>
      <PlayerVisibleProvider>
        <Layout />
      </PlayerVisibleProvider>
    </FilesProvider>
  </Fragment>
}

export default App;