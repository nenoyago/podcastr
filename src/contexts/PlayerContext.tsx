import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodes: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (episodes: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

interface PlayerContextProviderProps {
  children: ReactNode;
};

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodes([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(episodes: Episode[], index: number) {
    setEpisodes(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  
  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || ((currentEpisodeIndex + 1) < episodes.length);

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodes.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodes([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      episodes,
      currentEpisodeIndex,
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList,
      setPlayingState,
      clearPlayerState,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious
    }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext);