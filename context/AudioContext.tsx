"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { tracks, type Track } from "@/lib/data";

export type Version = "original" | "remastered";

type Ctx = {
  track: Track | null; isPlaying: boolean; time: number; duration: number; volume: number;
  version: Version; expanded: boolean;
  play: (t: Track, queue?: Track[]) => void; toggle: () => void; step: (d: 1 | -1) => void;
  seek: (s: number) => void; setVolume: (v: number) => void; setVersion: (v: Version) => void;
  setExpanded: (e: boolean) => void;
};

const AudioCtx = createContext<Ctx | null>(null);

export const useAudio = () => {
  const c = useContext(AudioCtx);
  if (!c) throw new Error("useAudio must be used inside <AudioProvider>");
  return c;
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLAudioElement>(null);
  const queue = useRef<Track[]>(tracks);
  // where the next loaded source should start (keeps position when A/B switching)
  const resume = useRef({ time: 0, play: true });

  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [version, setVer] = useState<Version>("remastered");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { if (ref.current) ref.current.volume = volume; }, [volume]);
  useEffect(() => {
    document.documentElement.style.setProperty("--glow", track?.color ?? "#fa2d48");
  }, [track]);

  const toggle = () => {
    const a = ref.current;
    if (!a || !track) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const play = (t: Track, q?: Track[]) => {
    if (q) queue.current = q;
    if (t.id === track?.id) return toggle();
    resume.current = { time: 0, play: true };
    setTrack(t);
  };

  const step = (d: 1 | -1) => {
    const q = queue.current;
    const i = q.findIndex((t) => t.id === track?.id);
    const n = q[(i + d + q.length) % q.length];
    if (n && n.id !== track?.id) {
      resume.current = { time: 0, play: true };
      setTrack(n);
    }
  };

  const seek = (s: number) => {
    if (ref.current) ref.current.currentTime = s;
    setTime(s);
  };

  const setVersion = (v: Version) => {
    if (v === version) return;
    const a = ref.current;
    resume.current = { time: a?.currentTime ?? 0, play: !!a && !a.paused };
    setVer(v);
  };

  return (
    <AudioCtx.Provider
      value={{ track, isPlaying, time, duration, volume, version, expanded, play, toggle, step, seek, setVolume, setVersion, setExpanded }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <audio
        ref={ref}
        src={track?.[version]}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          setDuration(a.duration);
          a.currentTime = resume.current.time;
          if (resume.current.play) a.play().catch(() => {});
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => step(1)}
      />
    </AudioCtx.Provider>
  );
}
