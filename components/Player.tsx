import React, { useEffect, useState, useRef } from 'react';
import { Movie, EPGProgram, StreamItem } from '../types';
import { Icons, MOCK_EPG, PLAYBACK_CONFIG } from '../constants';

interface PlayerProps {
  content: Movie | EPGProgram | StreamItem;
  onClose: () => void;
}

const Player: React.FC<PlayerProps> = ({ content, onClose }) => {
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(PLAYBACK_CONFIG.SPEED_NORMAL);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Synchronized data extraction (Matching PlayerActivity.kt)
  const title = content.title;
  const description = 'description' in content ? content.description : '';
  const category = 'category' in content ? content.category : ('channelName' in content ? content.channelName : 'Cinema');
  const isLive = 'isLive' in content ? content.isLive : ('start' in content && content.start === 'LIVE');
  const isFree = 'isFree' in content ? content.isFree : true;
  const streamUrl = content.streamUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const displayDuration = 'duration' in content ? content.duration : null;

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      console.error(`Wake Lock Error: ${err}`);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    requestWakeLock();

    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout.current) window.clearTimeout(controlsTimeout.current);
      controlsTimeout.current = window.setTimeout(() => setShowControls(false), 5000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
        else onClose();
      }
      if (e.key === ' ') togglePlayback();
      if (e.key === 'ArrowLeft') skip(-10);
      if (e.key === 'ArrowRight') skip(10);
      handleMouseMove();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setError(`Playback Error: Unable to load stream. (${title})`);
  };

  return (
    <div 
      ref={playerContainerRef}
      className="fixed inset-0 z-[150] bg-black flex flex-col group cursor-none hover:cursor-default overflow-hidden"
    >
      {/* Video Layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => { setIsPlaying(true); setIsLoading(false); }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={handleError}
        >
          <source src={streamUrl} type={streamUrl.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'} />
        </video>

        {/* Buffering Indicator (Matching StyledPlayerView loadingIndicator) */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">Buffering...</p>
          </div>
        )}

        {/* Error State (Matching tvError center view) */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-12 text-center z-30">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 text-red-600">
              <Icons.X />
            </div>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Transmission Failed</h2>
            <p className="text-zinc-500 max-w-md mb-8">{error}</p>
            <button onClick={onClose} className="px-8 py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all">Back to Home</button>
          </div>
        )}
      </div>

      {/* Top HUD Controls (Synchronized with Android controlsLayout) */}
      <div className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-700 z-40 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {/* Back Button and Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/5 shadow-lg">
                <Icons.ArrowBack />
              </button>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tighter uppercase italic">{title}</h1>
                  {isLive && <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-black uppercase tracking-widest animate-pulse shadow-lg">LIVE</span>}
                  {isFree && <span className="px-2 py-0.5 bg-red-600/20 text-red-500 border border-red-600/30 rounded text-[9px] font-black uppercase tracking-widest">FREE</span>}
                </div>
              </div>
            </div>

            <button onClick={toggleFullscreen} className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all border border-white/5 shadow-lg">
              <Icons.Fullscreen />
            </button>
          </div>

          {/* Category and Duration Row */}
          <div className="flex items-center gap-4">
            <span className="bg-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-300 border border-white/5">{category}</span>
            {!isLive && displayDuration && <span className="text-zinc-500 text-xs font-bold tracking-widest italic">{displayDuration}</span>}
          </div>

          {/* Description (Matching tvDescription) */}
          <p className="text-zinc-400 text-sm font-medium line-clamp-2 max-w-3xl hidden md:block leading-relaxed border-l-2 border-red-600/30 pl-4">{description}</p>
        </div>
      </div>

      {/* Bottom Playback Controls (Synchronized with activity_player.xml bottom bar) */}
      <div className={`absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-700 transform z-40 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Progress Bar (Only for VOD) */}
          {!isLive && (
            <div onClick={seek} className="relative h-2 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm group/progress hover:h-3 transition-all">
              <div className="absolute top-0 left-0 h-full bg-red-600 shadow-[0_0_20px_rgba(229,9,20,0.9)]" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <div className="flex items-center justify-center gap-12">
            <button onClick={() => skip(-10)} className="text-zinc-500 hover:text-white transition-all transform hover:scale-125 active:scale-90 p-4 rounded-full hover:bg-white/5">
              <Icons.Rewind />
            </button>
            <button onClick={togglePlayback} className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-2xl">
              {isPlaying ? <Icons.Pause /> : <Icons.Play />}
            </button>
            <button onClick={() => skip(10)} className="text-zinc-500 hover:text-white transition-all transform hover:scale-125 active:scale-90 p-4 rounded-full hover:bg-white/5">
              <Icons.Forward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;