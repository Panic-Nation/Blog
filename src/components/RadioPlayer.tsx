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

const RadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [streamUrl, setStreamUrl] = useState(stations[2].url);
  const [currentSong, setCurrentSong] = useState('Loading...');
  const [isExpanded, setIsExpanded] = useState(true);

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
      <button
        className={styles.expandToggle}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label="Toggle Radio Player"
      >
        {isExpanded ? '˅' : '˄'}
      </button>

      <div className={styles.playerPopup}>
        {isExpanded && (
          <div className={styles.expanded}>
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
        )}

        <audio ref={audioRef} src={streamUrl} controls className={styles.audioPlayer} />
      </div>
    </div>
  );
};

export default RadioPlayer;
