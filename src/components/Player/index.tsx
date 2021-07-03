import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodes,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  } = usePlayer();

  const episode = episodes[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Playing now" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      { episode
        ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              alt={episode.title}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) :
        (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode
              ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                />
              )
              : (
                <div className={styles.emptySlider} />
              )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
            disabled={!episode || episodes.length === 1}
          >
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Previous" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
              ? <img src="/pause.svg" alt="Pause" />
              : <img src="/play.svg" alt="Play" />
            }
          </button>
          <button type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Next" />
          </button>
          <button
            type="button"
            className={isLooping ? styles.isActive : ''}
            onClick={toggleLoop}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repeat" />
          </button>
        </div>
      </footer>
    </div>
  );
}