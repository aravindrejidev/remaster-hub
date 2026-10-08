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
  // ambient glow = average colour of the cover art (falls back to the accent colour)
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--glow", track?.color ?? "#fa2d48");
    if (!track?.cover) return;
    let dead = false;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 8;
      const x = c.getContext("2d");
      if (!x || dead) return;
      x.drawImage(img, 0, 0, 8, 8);
      const d = x.getImageData(0, 0, 8, 8).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      root.setProperty("--glow", `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`);
    };
    img.src = track.cover;
    return () => { dead = true; };
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

  const ver: Version = track?.original ? version : "remastered";

  return (
    <AudioCtx.Provider
      value={{ track, isPlaying, time, duration, volume, version: ver, expanded, play, toggle, step, seek, setVolume, setVersion, setExpanded }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <audio
        ref={ref}
        src={track ? (ver === "original" ? track.original : track.remastered) : undefined}
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
