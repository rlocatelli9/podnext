import Image from 'next/image';
import React, { useContext, useEffect, useRef } from 'react';
import {PlayerContext} from '../../contexts/PlayerContext'
import Slider from 'rc-slider';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';

const Player: React.FC = () => {

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodesList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay,
    setPlayingState
  } = useContext(PlayerContext);

  useEffect(() => {
    if(!audioRef.current)  return;

    if(isPlaying) audioRef.current.play();
    else audioRef.current.pause();
    
  },[isPlaying])

  const episode = episodesList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592} 
            height={592} 
            src={episode.thumbnail} 
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>

        </div>
      ) : (
         <div className={styles.emptyPlayer}>
         <strong>Selecione um podcast para ouvir</strong>
       </div>
      )}

     

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progressBar}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                trackStyle={{backgroundColor: '#04D361'}}
                railStyle={{backgroundColor: '#9F75FF'}}
                handleStyle={{backgroundColor: '#04D361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Voltar" />
          </button>
          <button type="button" onClick={() => togglePlay()} className={styles.playButton} disabled={!episode}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Player;