import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import usePlayer from '../../hooks/usePlayer';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

const Player: React.FC = () => {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodesList, 
    currentEpisodeIndex, 
    isPlaying,
    togglePlay,
    setPlayingState,
    playPrevious,
    playNext,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  useEffect(() => {
    if(!audioRef.current)  return;

    if(isPlaying) audioRef.current.play();
    else audioRef.current.pause();
    
  },[isPlaying])

  const setupProgressListener = useCallback(() => {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }, [audioRef]);

  const handleSeek = useCallback((amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }, [setProgress]);

  const handleEpisodeEndend = useCallback(() => {
    if(hasNext) playNext();
    else clearPlayerState();
  }, [hasNext, playNext, clearPlayerState]);

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
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: '#04D361'}}
                railStyle={{backgroundColor: '#9F75FF'}}
                handleStyle={{backgroundColor: '#04D361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEndend}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodesList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button 
            type="button" 
            disabled={!episode || !hasPrevious} 
            onClick={() => playPrevious()}>
            <img src="/play-previous.svg" alt="Voltar" />
          </button>
          <button type="button" onClick={() => togglePlay()} className={styles.playButton} disabled={!episode}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button 
            type="button" 
            disabled={!episode || !hasNext} 
            onClick={playNext}>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button 
            type="button" 
            disabled={!episode} 
            onClick={toggleLoop}
            className={ isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Player;