import React, { useEffect, useRef, useState } from 'react';
import styles from './RadioPlayer.module.css';

const metadataUrl = 'https://fallout.fm:8444/status-json.xsl';

const stations = [
  { name: 'Fallout.FM #1', url: 'https://fallout.fm:8444/falloutfm1.ogg' },
  { name: 'Fallout.FM #2', url: 'https://fallout.fm:8444/falloutfm2.ogg' },
  { name: 'Fallout.FM #3', url: 'https://fallout.fm:8444/falloutfm3.ogg' },
  { name: 'Fallout.FM #4', url: 'https://fallout.fm:8444/falloutfm4.ogg' },
  { name: 'Fallout.FM #5', url: 'https://fallout.fm:8444/falloutfm5.ogg' },
  { name: 'Fallout.FM #6', url: 'https://fallout.fm:8444/falloutfm6.ogg' },
  { name: 'Fallout.FM #7', url: 'https://fallout.fm:8444/falloutfm7.ogg' },
  { name: 'Fallout.FM #8', url: 'https://fallout.fm:8444/falloutfm8.ogg' },
  { name: 'Fallout.FM #9', url: 'https://fallout.fm:8444/falloutfm9.ogg' },
  { name: 'Fallout.FM #10', url: 'https://fallout.fm:8444/falloutfm10.ogg' },
];

const STORAGE_KEYS = {
  selectedStation: 'radio_station_index',
  wasPlaying: 'radio_was_playing',
  isExpanded: 'radio_is_expanded',
};

const RadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const savedIndex = parseInt(localStorage.getItem(STORAGE_KEYS.selectedStation) || '2');
  const savedWasPlaying = localStorage.getItem(STORAGE_KEYS.wasPlaying) === 'true';
  const savedExpanded = localStorage.getItem(STORAGE_KEYS.isExpanded);
  const defaultExpanded = savedExpanded === null ? true : savedExpanded === 'true';

  const [streamUrl, setStreamUrl] = useState(stations[savedIndex]?.url || stations[2].url);
  const [selectedIndex, setSelectedIndex] = useState(savedIndex);
  const [currentSong, setCurrentSong] = useState('Loading...');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = streamUrl;

    const tryResume = async () => {
      if (savedWasPlaying) {
        try {
          await audio.play();
          setIsReady(true);
        } catch {
          setIsReady(false);
        }
      }
    };

    tryResume();
  }, [streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      localStorage.setItem(STORAGE_KEYS.wasPlaying, 'true');
    };
    const handlePause = () => {
      localStorage.setItem(STORAGE_KEYS.wasPlaying, 'false');
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedStation, String(selectedIndex));
  }, [selectedIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.isExpanded, String(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch(metadataUrl);
        const data = await res.json();
        const sources = Array.isArray(data.icestats.source)
          ? data.icestats.source
          : [data.icestats.source];

        const matched = sources.find((s) => s.listenurl === streamUrl);

        if (matched?.metadata?.artist && matched?.metadata?.title) {
          setCurrentSong(`${matched.metadata.artist} – ${matched.metadata.title}`);
        } else if (matched?.title && matched?.artist) {
          setCurrentSong(`${matched.artist} – ${matched.title}`);
        } else {
          setCurrentSong(matched?.title || 'Live Stream');
        }
      } catch {
        setCurrentSong('Unable to load metadata');
      }
    };

    fetchMetadata();
    const interval = setInterval(fetchMetadata, 15000);
    return () => clearInterval(interval);
  }, [streamUrl]);

return (
  <div className={styles.playerContainer}>
    {/* Moved outside */}
    <button
      className={styles.expandToggle}
      onClick={() => setIsExpanded((prev) => !prev)}
      aria-label="Toggle Radio Player"
    >
      {isExpanded ? '˅' : '˄'}
    </button>

    <div className={styles.playerPopup}>
      <div className={isExpanded ? styles.expanded : styles.collapsed}>
        <strong>Now Playing</strong>
        <p className={styles.songTitle}>{currentSong}</p>

        <label className={styles.stationLabel}>
          <span>Station:</span>
          <select
            className={styles.stationSelect}
            value={selectedIndex}
            onChange={(e) => {
              const index = parseInt(e.target.value);
              setSelectedIndex(index);
              setStreamUrl(stations[index].url);
            }}
          >
            {stations.map((station, i) => (
              <option key={station.url} value={i}>
                {station.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <audio ref={audioRef} controls className={styles.audioPlayer} />
    </div>
  </div>
);
};

export default RadioPlayer;
