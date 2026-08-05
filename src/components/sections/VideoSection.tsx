"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VIDEO_SECTION } from "@/data/content";
import { fadeInUp, fadeIn } from "@/lib/animations";
import { useInView } from "@/hooks";
import { Maximize, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { isSmartTV } from "@/lib/device";

interface VideoSectionProps {
  onInViewChange?: (inView: boolean) => void;
}

export default function VideoSection({ onInViewChange }: VideoSectionProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [tvMode, setTvMode] = useState(false);
  const [started, setStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      try {
        videoRef.current.muted = muted;
        await videoRef.current.play();
        setPlaying(true);
        setStarted(true);
      } catch {
        // Retry muted if unmuted autoplay/play is blocked
        videoRef.current.muted = true;
        setMuted(true);
        try {
          await videoRef.current.play();
          setPlaying(true);
          setStarted(true);
        } catch {
          // User gesture required again
        }
      }
    }
  };

  const handleSmartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void togglePlay(e);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !progressContainerRef.current) return;

    const rect = progressContainerRef.current.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );

    videoRef.current.currentTime = percent * videoRef.current.duration;
    setProgress(percent * 100);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const controlsVisible = showControls || tvMode || !playing;

  return (
    <section
      id="video"
      className="relative bg-black py-0"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-video rounded-full bg-netflix-red/40 blur-[120px] transition-opacity duration-1000"
        style={{ opacity: playing ? 0.6 : 0 }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-8 pb-8 pt-20 md:px-16">
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
          className="mt-2 text-sm text-white/60"
        >
          {VIDEO_SECTION.subtitle}
        </motion.p>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-5xl px-0 md:px-8 pb-20">
        <div
          ref={containerRef}
          className="group relative aspect-video w-full cursor-pointer bg-black overflow-hidden ring-1 ring-white/10 md:rounded-lg md:shadow-2xl"
          onClick={handleSmartClick}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(playing ? false : true)}
        >
          <video
            ref={videoRef}
            src={VIDEO_SECTION.videoUrl}
            poster={VIDEO_SECTION.posterImage}
            className="h-full w-full object-contain bg-black"
            playsInline
            preload="metadata"
            controls={false}
            muted={muted}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setPlaying(false)}
          />

          {!started && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
              <button
                type="button"
                onClick={(e) => void togglePlay(e)}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-95 md:h-24 md:w-24"
                aria-label="Play birthday video"
              >
                <Play fill="currentColor" size={tvMode ? 40 : 32} className="ml-1" />
              </button>
              <p className="font-display text-sm tracking-[0.25em] text-white uppercase md:text-base">
                Tap to play
              </p>
            </div>
          )}

          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
              controlsVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-4 transition-opacity duration-300 md:px-6 md:pb-6 ${
              controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              ref={progressContainerRef}
              className="group/scrub relative mb-4 h-2 w-full cursor-pointer md:h-2.5"
              onClick={handleProgressScrub}
            >
              <div className="absolute inset-x-0 top-1/2 h-full -translate-y-1/2 bg-white/30" />
              <div
                className="absolute left-0 top-1/2 h-full -translate-y-1/2 bg-netflix-red"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-5 md:gap-6">
                <button
                  onClick={(e) => void togglePlay(e)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <Pause fill="currentColor" size={28} />
                  ) : (
                    <Play fill="currentColor" size={28} />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                </button>

                <span className="font-display text-xs tracking-wider text-white/90 md:text-sm">
                  {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                  {formatTime(duration)}
                </span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-95"
                aria-label="Fullscreen"
              >
                <Maximize size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
