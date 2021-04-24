import '../styles/global.scss';
import styles from '../styles/app.module.scss';

import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';
import { useCallback, useContext, useState } from 'react';


function MyApp({ Component, pageProps }) {
  const [episodesList, setEpisodesList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((episode) => {
    setEpisodesList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying(oldState => !oldState);
  }, [])

  const setPlayingState = useCallback((state:boolean) => {
    setIsPlaying(state);
  }, [])

  return (
    <PlayerContext.Provider  value={{episodesList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
