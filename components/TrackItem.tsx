"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import type { Track } from "@/lib/data";

export default function TrackItem({ track, index, queue }: { track: Track; index: number; queue: Track[] }) {
  const { track: cur, isPlaying, play } = useAudio();
  const active = cur?.id === track.id;
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={() => play(track, queue)}
      className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white/10 ${active ? "bg-white/10" : ""}`}
    >
      <span className="grid w-6 place-items-center text-sm tabular-nums text-white/50">
        {active && isPlaying ? (
          <span className="flex h-4 items-end gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.i key={i} className="w-0.5 rounded bg-accent" animate={{ height: ["30%", "100%", "50%"] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
            ))}
          </span>
        ) : (
          <>
            <span className={active ? "hidden" : "group-hover:hidden"}>{index + 1}</span>
            <Play className={`h-4 w-4 fill-current ${active ? "block text-accent" : "hidden text-white group-hover:block"}`} />
          </>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[15px] font-medium ${active ? "text-accent" : ""}`}>{track.title}</span>
        <span className="block truncate text-sm text-white/50">{track.artist}</span>
      </span>
      <span className="rounded border border-white/20 px-1.5 text-[10px] font-semibold text-white/60">HD</span>
      <span className="w-10 text-right text-sm tabular-nums text-white/50">{track.duration}</span>
    </motion.button>
  );
}
