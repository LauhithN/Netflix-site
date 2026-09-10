"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Maximize, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { VIDEO_SECTION } from "@/data/content";
import { fadeInUp, fadeIn } from "@/lib/animations";
import { useInView, useCoarsePointer } from "@/hooks";
import { isSmartTV } from "@/lib/device";
import { cn, clamp } from "@/lib/utils";

interface VideoSectionProps {
  onInViewChange?: (inView: boolean) => void;
}

/** With a mouse, controls fade this long after the pointer stops moving. */
const CONTROLS_IDLE_MS = 2600;

/** iPhone Safari only exposes fullscreen on the <video> element itself. */
type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoSection({ onInViewChange }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [tvMode, setTvMode] = useState(false);
  const [started, setStarted] = useState(false);
  const coarse = useCoarsePointer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);

  const { ref: sectionRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    setTvMode(isSmartTV());
  }, []);

  // Pause when scrolled away — never autoplay (TV/Safari friendly)
  useEffect(() => {
    if (!videoRef.current) return;

    if (!inView && playing) {
      videoRef.current.pause();
      setPlaying(false);
    }

    onInViewChange?.(inView && playing);
  }, [inView, playing, onInViewChange]);

  useEffect(
    () => () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    },
    []
  );

  /** Any pointer activity shows the controls; with a mouse they fade after a short idle. */
  const handleActivity = useCallback(() => {
    setShowControls(true);
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    if (coarse || tvMode) return;
    idleTimer.current = window.setTimeout(() => setShowControls(false), CONTROLS_IDLE_MS);
  }, [coarse, tvMode]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const togglePlay = async (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
      setShowControls(true);
      return;
    }

    try {
      video.muted = muted;
      await video.play();
    } catch {
      // Unmuted playback blocked — retry muted, which browsers allow after a gesture
      video.muted = true;
      setMuted(true);
      try {
        await video.play();
      } catch {
        return; // needs another user gesture
      }
    }
    setPlaying(true);
    setStarted(true);
    handleActivity();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const seekToFraction = (fraction: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    const f = clamp(fraction, 0, 1);
    video.currentTime = f * video.duration;
    setCurrentTime(video.currentTime);
    setProgress(f * 100);
  };

  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    seekToFraction((e.clientX - rect.left) / rect.width);
  };

  const handleProgressKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;
    const step = 5 / video.duration;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seekToFraction(video.currentTime / video.duration + step);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekToFraction(video.currentTime / video.duration - step);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current as FullscreenVideo | null;
    if (!container || !video) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
      return;
    }
    if (typeof container.requestFullscreen === "function") {
      container.requestFullscreen().catch(() => video.webkitEnterFullscreen?.());
    } else {
      video.webkitEnterFullscreen?.();
    }
  };

  // Before the first play only the big play button is shown; afterwards the bar
  // stays visible on touch/TV and auto-hides while playing with a mouse.
  const controlsVisible = started && (!playing || coarse || tvMode || showControls);
  const iconSize = tvMode ? 32 : 26;

  return (
    <section
      id="video"
      className="relative bg-black"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-video w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-netflix-red/40 blur-[120px] transition-opacity duration-1000"
        style={{ opacity: playing ? 0.6 : 0 }}
        aria-hidden="true"
      />

      {/* Header — centred so it lines up with the player below at every width */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-20 text-center md:px-16">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-netflix-red"
        >
          {VIDEO_SECTION.badge}
        </motion.p>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-4xl tracking-wide text-white md:text-6xl"
        >
          {VIDEO_SECTION.title.toUpperCase()}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-3 font-body text-sm text-white/70 md:text-base"
        >
          {VIDEO_SECTION.subtitle}
        </motion.p>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-5xl pb-20 md:px-8">
        <div
          ref={containerRef}
          className={cn(
            "group/video relative aspect-video w-full cursor-pointer overflow-hidden bg-black ring-1 ring-white/10 md:rounded-lg md:shadow-2xl",
            playing && !controlsVisible && "cursor-none"
          )}
          onClick={(e) => void togglePlay(e)}
          onMouseMove={handleActivity}
          onMouseEnter={handleActivity}
          onMouseLeave={() => {
            if (playing) setShowControls(false);
          }}
        >
          {/* Blurred poster backdrop: a portrait poster fills the frame instead of sitting in black bars */}
          {!started && (
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-2xl"
              style={{ backgroundImage: `url(${VIDEO_SECTION.posterImage})` }}
            />
          )}

          <video
            ref={videoRef}
            src={VIDEO_SECTION.videoUrl}
            poster={VIDEO_SECTION.posterImage}
            className="relative h-full w-full object-contain"
            playsInline
            preload="metadata"
            muted={muted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setShowControls(true);
            }}
          />

          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35">
              <button
                type="button"
                onClick={(e) => void togglePlay(e)}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-95 md:h-24 md:w-24"
                aria-label="Play birthday video"
              >
                <Play fill="currentColor" size={tvMode ? 40 : 32} className="ml-1" aria-hidden="true" />
              </button>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-white md:text-base">
                {coarse ? "Tap to play" : "Click to play"}
              </p>
            </div>
          )}

          {started && (
            <>
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300",
                  controlsVisible ? "opacity-100" : "opacity-0"
                )}
                aria-hidden="true"
              />

              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-4 transition-opacity duration-300 md:px-6 md:pb-6",
                  controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scrubber (tall hit area, slim bar) */}
                <div
                  ref={progressRef}
                  role="slider"
                  tabIndex={0}
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  onClick={handleProgressScrub}
                  onKeyDown={handleProgressKey}
                  className="group/scrub relative mb-3 h-5 w-full cursor-pointer"
                >
                  <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/30 transition-[height] group-hover/scrub:h-2" />
                  <div
                    className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-netflix-red transition-[height] group-hover/scrub:h-2"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={(e) => void togglePlay(e)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? (
                        <Pause fill="currentColor" size={iconSize} aria-hidden="true" />
                      ) : (
                        <Play fill="currentColor" size={iconSize} className="ml-0.5" aria-hidden="true" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted ? <VolumeX size={iconSize} aria-hidden="true" /> : <Volume2 size={iconSize} aria-hidden="true" />}
                    </button>

                    <span className="font-body text-xs tabular-nums tracking-wider text-white/90 md:text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                    aria-label="Fullscreen"
                  >
                    <Maximize size={22} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
