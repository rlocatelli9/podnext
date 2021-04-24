import { useContext } from 'react';
import {PlayerContext} from '../contexts/PlayerContext'

function usePlayer () {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer deve ser usado com um PlayerContextProvider');
  }
  return context;
}

export default usePlayer;