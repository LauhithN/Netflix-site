"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYLIST, PLAYLIST_CONFIG, type Track } from "@/data/playlist";

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isVideoDucking?: boolean;
}

export default function MusicPlayer({
  isPlaying,
  onToggle,
  isVideoDucking,
}: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(PLAYLIST_CONFIG.defaultVolume);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showExpanded, setShowExpanded] = useState(false);
  const [shuffled, setShuffled] = useState(PLAYLIST_CONFIG.shuffle);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);

  // We use any to avoid importing Howl types directly in scope to prevent potential TS errors if types mismatch
  const howlRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // 1. Shuffle Init
  useEffect(() => {
    if (PLAYLIST_CONFIG.shuffle) {
      const order = PLAYLIST.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setShuffleOrder(order);
    } else {
      setShuffleOrder(PLAYLIST.map((_, i) => i));
    }
  }, []);

  // 2. Load Track
  const loadTrack = useCallback(
    async (index: number, autoPlay: boolean) => {
      howlRef.current?.stop();
      howlRef.current?.unload();
      clearInterval(progressTimerRef.current);

      const { Howl } = await import("howler");
      const track = PLAYLIST[index];

      howlRef.current = new Howl({
        src: [track.file],
        volume: muted ? 0 : volume,
        html5: true,
        loop: false,
        onplay: () => {
          setPlaying(true);
          progressTimerRef.current = setInterval(() => {
            if (!howlRef.current) return;
            const seek = howlRef.current.seek() as number;
            const dur = howlRef.current.duration() || 1;
            setProgress((seek / dur) * 100);
            setDuration(dur);
          }, 500);
        },
        onpause: () => {
          setPlaying(false);
          clearInterval(progressTimerRef.current);
        },
        onstop: () => {
          setPlaying(false);
          setProgress(0);
          clearInterval(progressTimerRef.current);
        },
        onend: () => {
          clearInterval(progressTimerRef.current);
          if (PLAYLIST_CONFIG.autoAdvance) {
            // Need to wrap goNext in a way that captures latest state
            // The safest approach here is firing an event or using refs, but calling a function directly works if bounded correctly
            // However, to avoid dependency cycles, we handle the simple next logic directly:
            setShuffleOrder((prevOrder) => {
              const pos = prevOrder.indexOf(index);
              const nextPos = (pos + 1) % prevOrder.length;
              const nextIdx = prevOrder[nextPos];
              setCurrentTrackIndex(nextIdx);
              setProgress(0);
              // autoPlay next track
              setTimeout(() => loadTrack(nextIdx, true), 10);
              return prevOrder;
            });
          } else {
            setPlaying(false);
          }
        },
        onloaderror: (_: any, err: any) =>
          console.warn("Track load error:", track.title, err),
      });

      if (autoPlay) howlRef.current.play();
    },
    [muted, volume]
  );

  // 3. Mount load
  useEffect(() => {
    loadTrack(0, false);
    return () => {
      howlRef.current?.unload();
      clearInterval(progressTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // 4. Handle Video Ducking and External Prop
  useEffect(() => {
    if (isVideoDucking) {
      howlRef.current?.volume(0.05);
    } else {
      howlRef.current?.volume(muted ? 0 : volume);
    }
  }, [isVideoDucking, muted, volume]);

  useEffect(() => {
    if (isPlaying !== playing) {
      if (isPlaying) {
        if (howlRef.current) howlRef.current.play();
        else loadTrack(currentTrackIndex, true);
      } else {
        howlRef.current?.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Controls
  const togglePlay = () => {
    onToggle(); // Notify app layout
    if (playing) {
      howlRef.current?.pause();
    } else {
      if (howlRef.current) howlRef.current.play();
      else loadTrack(currentTrackIndex, true);
    }
  };

  const goNext = () => {
    if (shuffleOrder.length === 0) return;
    const pos = shuffleOrder.indexOf(currentTrackIndex);
    const nextPos = (pos + 1) % shuffleOrder.length;
    const nextIdx = shuffleOrder[nextPos];
    setCurrentTrackIndex(nextIdx);
    setProgress(0);
    loadTrack(nextIdx, true);
  };

  const goPrev = () => {
    if (shuffleOrder.length === 0) return;
    if (progress > 5) {
      howlRef.current?.seek(0);
      setProgress(0);
      return;
    }
    const pos = shuffleOrder.indexOf(currentTrackIndex);
    const prevPos =
      (pos - 1 + shuffleOrder.length) % shuffleOrder.length;
    const prevIdx = shuffleOrder[prevPos];
    setCurrentTrackIndex(prevIdx);
    setProgress(0);
    loadTrack(prevIdx, true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    loadTrack(index, true);
    if (!isPlaying) onToggle(); // Update external state to true
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (howlRef.current) howlRef.current.volume(next ? 0 : volume);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (!muted && howlRef.current) howlRef.current.volume(v);
  };

  const toggleShuffle = () => {
    const next = !shuffled;
    setShuffled(next);
    if (next) {
      const order = PLAYLIST.map((_, i) => i).filter(
        (i) => i !== currentTrackIndex
      );
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      setShuffleOrder([currentTrackIndex, ...order]);
    } else {
      setShuffleOrder(PLAYLIST.map((_, i) => i));
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!howlRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    howlRef.current.seek(newTime);
    setProgress(percent * 100);
  };

  // Prevent rendering if playlist is empty
  if (PLAYLIST.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[70] transition-all duration-300 md:bottom-10 md:right-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      {/* Expanded Panel */}
      <AnimatePresence>
        {showExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="absolute bottom-16 right-0 w-64 overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl md:bottom-14"
          >
            {/* Track Info */}
            <div className="border-b border-white/10 px-4 pb-3 pt-4">
              <div className="mb-1 flex items-center gap-3">
                <span className="text-xl">{currentTrack.emoji || "🎵"}</span>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-body text-sm font-medium text-white">
                    {currentTrack.title}
                  </p>
                  <p className="truncate font-body text-xs text-white/40">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-3">
              <div
                className="mb-2 relative h-1.5 cursor-pointer rounded-full bg-white/15"
                onClick={handleSeek}
              >
                <div
                  className="h-full rounded-full bg-[#E50914] transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-white/40">
                <span>{formatTime((progress / 100) * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between px-5 pb-4 pt-1">
              <button
                className="text-base transition-colors"
                style={{ color: shuffled ? "#E50914" : "rgba(255,255,255,0.4)" }}
                onClick={toggleShuffle}
                title="Shuffle"
              >
                ⇄
              </button>
              <button
                className="text-xl text-white/60 transition-colors hover:text-white"
                onClick={goPrev}
                title="Previous Track"
              >
                ⏮
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E50914] text-xl text-white shadow-lg shadow-red-500/20"
              >
                {playing ? "⏸" : "▶"}
              </motion.button>
              <button
                className="text-xl text-white/60 transition-colors hover:text-white"
                onClick={goNext}
                title="Next Track"
              >
                ⏭
              </button>
              <button
                className="text-sm transition-colors text-white/40 hover:text-white/80"
                onClick={toggleMute}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? "🔇" : "🔊"}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 px-5 pb-4">
              <span className="text-[10px] font-bold tracking-wider text-white/30">
                VOL
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="music-volume-slider flex-1"
                style={{ accentColor: "#E50914", height: "3px" }}
              />
            </div>

            {/* Playlist List */}
            <div className="max-h-40 overflow-y-auto border-t border-white/10 bg-black/40 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {PLAYLIST.map((track, i) => {
                const isCurrent = i === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(i)}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                    style={{
                      backgroundColor: isCurrent
                        ? "rgba(229,9,20,0.15)"
                        : "transparent",
                    }}
                  >
                    <span className="text-sm opacity-80">{track.emoji || "🎵"}</span>
                    <div className="flex-1 overflow-hidden">
                      <p
                        className="truncate font-body text-xs font-medium"
                        style={{
                          color: isCurrent ? "#E50914" : "rgba(255,255,255,0.8)",
                        }}
                      >
                        {track.title}
                      </p>
                      <p className="truncate font-body text-[10px] text-white/40">
                        {track.artist}
                      </p>
                    </div>
                    {isCurrent && playing && (
                      <span className="text-[10px] text-[#E50914] animate-pulse">
                        ▶
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Button */}
      <motion.button
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/85 backdrop-blur-md shadow-2xl transition-all hover:bg-black hover:border-white/30"
        onClick={() => setShowExpanded((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {playing ? (
          <span className="flex h-4 items-end gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="eq-bar eq-bar--active"
                style={{ animationDelay: `${i * 0.13}s` }}
              />
            ))}
          </span>
        ) : (
          <span className="text-lg text-white/80">♪</span>
        )}
      </motion.button>
    </motion.div>
  );
}
