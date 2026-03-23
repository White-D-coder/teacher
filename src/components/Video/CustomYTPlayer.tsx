'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import styles from './CustomYTPlayer.module.css';

interface CustomYTPlayerProps {
  videoId: string;
  title: string;
  onComplete?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const CustomYTPlayer: React.FC<CustomYTPlayerProps> = ({ videoId, title, onComplete }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef<boolean>(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlayerReady = (event: any) => {
    setIsReady(true);
    setDuration(event.target.getDuration());
    
    // Resume progress
    const savedProgress = localStorage.getItem(`video-progress-${videoId}`);
    if (savedProgress) {
      event.target.seekTo(parseFloat(savedProgress), true);
    }
  };

  const onPlayerStateChange = (event: any) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) setIsPlaying(true);
    else if (event.data === 2) setIsPlaying(false);
    else if (event.data === 0) {
      setIsPlaying(false);
      if (onComplete) onComplete();
    }
  };

  useEffect(() => {
    // Reset completion on video change
    hasCompletedRef.current = false;

    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        setProgress((current / total) * 100);
        
        // Save progress regularly
        localStorage.setItem(`video-progress-${videoId}`, current.toString());

        // Completion check (90%)
        if (total > 0 && current / total >= 0.9) {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            if (onComplete) onComplete();
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, onComplete]);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = (parseFloat(e.target.value) / 100) * duration;
    playerRef.current.seekTo(seekTo, true);
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className={styles.playerContainer} 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div id={`youtube-player-${videoId}`} className={styles.videoFrame}></div>
      
      {!isReady && <div className={styles.loader}>✨ Teacher AI is setting up the lesson...</div>}

      <div className={`${styles.controlsOverlay} ${showControls ? styles.visible : ''}`}>
        <div className={styles.topBar}>
          <h3>{title}</h3>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.progressContainer}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress} 
              onChange={handleSeek}
              className={styles.progressBar}
            />
          </div>

          <div className={styles.actions}>
            <div className={styles.leftActions}>
              <button onClick={togglePlay} className={styles.iconBtn}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={toggleMute} className={styles.iconBtn}>
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <span className={styles.timeLabel}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className={styles.rightActions}>
              <button onClick={() => playerRef.current.seekTo(0, true)} className={styles.iconBtn}>
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomYTPlayer;
