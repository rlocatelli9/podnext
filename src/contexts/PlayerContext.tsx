import {createContext, ReactNode, useCallback, useMemo, useRef, useState} from 'react'

interface Episode {
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
}

interface PlayerContextProps {
  episodesList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (list: Array<Episode>, index:number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextProps);


export const PlayerContextProvider = ({children}: PlayerContextProviderProps ) => {
  const [episodesList, setEpisodesList] = useState<Array<Episode>>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodesList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, [])

  const playList = useCallback((list: Array<Episode>, index:number) => {
    setEpisodesList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }, [])

  const togglePlay = useCallback(() => {
    setIsPlaying(oldState => !oldState);
  }, [])

  const toggleLoop = useCallback(() => {
    setIsLooping(oldState => !oldState);
  }, [])

  const toggleShuffle = useCallback(() => {
    setIsShuffling(oldState => oldState ? false : true);
    console.log('toggleShuffle: ', isShuffling)
  }, [])

  const setPlayingState = useCallback((state:boolean) => {
    setIsPlaying(state);
  }, [])

  
  const hasPrevious = useMemo(() => currentEpisodeIndex > 0, [currentEpisodeIndex])
  const hasNext = useMemo(() => isShuffling || currentEpisodeIndex < (episodesList.length -1), [
    currentEpisodeIndex, 
    episodesList,
    isShuffling
  ])

  const playNext = useCallback(() => {
    console.log('isShuffling: ', isShuffling)
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodesList.length)
      console.log('nextRandomEpisodeIndex: ', nextRandomEpisodeIndex)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext) {
      setCurrentEpisodeIndex(oldState => oldState + 1);
    }    
  },[currentEpisodeIndex, hasNext, isShuffling, episodesList])

  const playPrevious = useCallback(() =>{
    if(hasPrevious) setCurrentEpisodeIndex(oldState => oldState - 1);    
  },[currentEpisodeIndex, hasPrevious])

  const clearPlayerState = useCallback(() => {
    setEpisodesList([]);
    setCurrentEpisodeIndex(0);
  }, [episodesList, currentEpisodeIndex]);

  return (
    <PlayerContext.Provider 
      value={{
        episodesList, 
        currentEpisodeIndex, 
        play, 
        playList,
        isPlaying, 
        togglePlay, 
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}