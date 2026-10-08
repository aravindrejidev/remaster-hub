"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipForward } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import Cover from "./Cover";

export default function MiniPlayer() {
  const { track, isPlaying, toggle, step, time, duration, expanded, setExpanded, version } = useAudio();
  const btn = "grid h-10 w-10 place-items-center rounded-full hover:bg-white/10";
  return (
    <AnimatePresence>
      {track && !expanded && (
        <motion.div
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          onClick={() => setExpanded(true)}
          className="glass-strong fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl cursor-pointer items-center gap-3 overflow-hidden rounded-2xl p-2.5 pr-4 shadow-2xl"
        >
          <Cover color={track.color} src={track.cover} className="h-12 w-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{track.title}</p>
            <p className="truncate text-xs text-white/50">{track.artist}, {version === "remastered" ? "HD Remaster" : "Original"}</p>
          </div>
          <button aria-label={isPlaying ? "Pause" : "Play"} className={btn} onClick={(e) => { e.stopPropagation(); toggle(); }}>
            {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
          </button>
          <button aria-label="Next track" className={btn} onClick={(e) => { e.stopPropagation(); step(1); }}>
            <SkipForward className="h-5 w-5 fill-white" />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
            <div className="h-full bg-accent" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
