import Frame from 'components/animated/frame';
import Input from 'components/input';
import Player from 'components/player';
import { FilesProvider, PlayerVisibleProvider } from 'context';
import React from 'react';

import "./assets/index.css";
import "./assets/main.scss";

function Layout() {
  return <React.Fragment>
    <Frame animationDirection="y" variant="main-container">
      <Input />
      <Player />
    </Frame>
  </React.Fragment>
}

function App() {
  return <React.Fragment>
    <FilesProvider>
      <PlayerVisibleProvider>
        <Layout />
      </PlayerVisibleProvider>
    </FilesProvider>
  </React.Fragment>
}

export default App;