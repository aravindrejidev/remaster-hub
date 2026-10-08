"use client";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ChevronDown, Pause, Play, SkipBack, SkipForward, Volume1, Volume2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { fmt } from "@/lib/data";
import Cover from "./Cover";

const Range = ({ value, max, label, onChange }: { value: number; max: number; label: string; onChange: (v: number) => void }) => (
  <input
    type="range" aria-label={label} min={0} max={max || 1} step="any" value={value}
    onChange={(e) => onChange(+e.target.value)}
    className="range w-full cursor-pointer"
    style={{ "--p": `${max ? (value / max) * 100 : 0}%` } as CSSProperties}
  />
);

const modes = [
  { id: "original", label: "Original (Low-Res)", spec: "Source recording" },
  { id: "remastered", label: "FL Studio Remastered (HD)", spec: "24-bit / 48kHz" },
] as const;

export default function PlayerModal() {
  const { track, isPlaying, time, duration, volume, version, expanded, toggle, step, seek, setVolume, setVersion, setExpanded } = useAudio();
  const drag = useDragControls();
  return (
    <AnimatePresence>
      {expanded && track && (
        <motion.div
          key="player"
          drag="y" dragControls={drag} dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, i) => { if (i.offset.y > 120) setExpanded(false); }}
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-base"
          style={{ backgroundImage: "linear-gradient(180deg, color-mix(in srgb, var(--glow) 45%, transparent), #0d0d0d 75%)" }}
        >
          <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-8">
            <div className="flex items-center py-3">
              <button aria-label="Close player" onClick={() => setExpanded(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <ChevronDown className="h-5 w-5" />
              </button>
              <div onPointerDown={(e) => drag.start(e)} className="flex flex-1 touch-none justify-center py-2">
                <span className="h-1.5 w-10 rounded-full bg-white/30" />
              </div>
              <span className="w-9" />
            </div>

            <motion.div
              animate={{ scale: isPlaying ? 1 : 0.82 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="rounded-2xl"
              style={{ boxShadow: "0 40px 120px -30px var(--glow)" }}
            >
              <Cover color={track.color} src={track.cover} className="aspect-square w-full rounded-2xl" />
            </motion.div>

            <div className="mt-8 min-w-0">
              <h2 className="truncate text-2xl font-bold">{track.title}</h2>
              <p className="truncate text-lg text-white/60">{track.artist}</p>
            </div>

            {track.original ? (
            <div className="glass mt-6 flex rounded-2xl p-1" role="group" aria-label="Audio version">
              {modes.map((m) => (
                <button key={m.id} onClick={() => setVersion(m.id)} aria-pressed={version === m.id} className="relative flex-1 rounded-xl px-2 py-2.5 text-center">
                  {version === m.id && (
                    <motion.span
                      layoutId="ab-pill"
                      transition={{ type: "spring", damping: 26, stiffness: 320 }}
                      className={`absolute inset-0 rounded-xl ${m.id === "remastered" ? "bg-accent" : "bg-white/20"}`}
                    />
                  )}
                  <span className="relative block text-[13px] font-semibold leading-tight">{m.label}</span>
                  <span className="relative block text-[11px] text-white/70">{m.id === "remastered" ? track.quality : m.spec}</span>
                </button>
              ))}
            </div>
            ) : (
              <div className="glass mt-6 rounded-2xl p-3 text-center text-sm font-semibold">{track.spec}</div>
            )}

            <div className="mt-6">
              <Range label="Seek" value={time} max={duration} onChange={seek} />
              <div className="mt-1.5 flex justify-between text-xs tabular-nums text-white/50">
                <span>{fmt(time)}</span>
                <span>-{fmt(duration - time)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-8">
              <button aria-label="Previous track" onClick={() => step(-1)}><SkipBack className="h-8 w-8 fill-white" /></button>
              <motion.button whileTap={{ scale: 0.9 }} aria-label={isPlaying ? "Pause" : "Play"} onClick={toggle} className="grid h-16 w-16 place-items-center rounded-full bg-white text-black">
                {isPlaying ? <Pause className="h-7 w-7 fill-black" /> : <Play className="h-7 w-7 translate-x-0.5 fill-black" />}
              </motion.button>
              <button aria-label="Next track" onClick={() => step(1)}><SkipForward className="h-8 w-8 fill-white" /></button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-white/60">
              <Volume1 className="h-4 w-4 shrink-0" />
              <Range label="Volume" value={volume} max={1} onChange={setVolume} />
              <Volume2 className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
