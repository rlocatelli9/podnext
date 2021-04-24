import {createContext} from 'react'

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
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextProps);
