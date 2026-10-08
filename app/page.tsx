"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftRight, Disc3, Pause, Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { tracks } from "@/lib/data";
import Cover from "@/components/Cover";
import TrackItem from "@/components/TrackItem";

export default function Home() {
  const { track: cur, isPlaying, play, setExpanded } = useAudio();
  const t = tracks[0];

  if (!t)
    return (
      <div className="glass mx-auto mt-10 max-w-md rounded-3xl p-10 text-center">
        <Disc3 className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-bold">No remasters yet</h1>
        <p className="mt-2 text-sm text-white/60">Upload a FLAC file to public/audio/remastered/ and redeploy.</p>
      </div>
    );

  const playing = cur?.id === t.id && isPlaying;
  const rows: [string, string][] = [["Format", t.quality], ["Duration", t.duration], ...t.details];

  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center gap-8 sm:flex-row sm:items-end">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 22 }}
          className="w-full max-w-xs shrink-0 rounded-2xl sm:w-72"
          style={{ boxShadow: "0 40px 120px -30px var(--glow)" }}
        >
          <Cover color={t.color} src={t.cover} className="aspect-square w-full rounded-2xl" />
        </motion.div>
        <div className="min-w-0 text-center sm:text-left">
          <p className="text-sm font-medium text-white/60">Remaster of the week</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">{t.title}</h1>
          <p className="mt-2 text-xl text-white/70">{t.artist}</p>
          <p className="mt-1 text-white/50">
            <Link href={`/album/${t.albumId}`} className="underline-offset-4 hover:underline">{t.album}</Link>
            {t.year ? `, ${t.year}` : ""}
          </p>
          <span className="glass mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium">{t.spec}</span>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => play(t, tracks)} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black">
              {playing ? <Pause className="h-5 w-5 fill-black" /> : <Play className="h-5 w-5 fill-black" />}
              {playing ? "Pause" : "Play"}
            </motion.button>
            {t.original && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { if (cur?.id !== t.id) play(t, tracks); setExpanded(true); }}
                className="glass flex items-center gap-2 rounded-full px-6 py-3 font-semibold"
              >
                <ArrowLeftRight className="h-5 w-5" /> Compare with original
              </motion.button>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Track details</h2>
        <dl className="glass grid gap-x-10 rounded-2xl px-5 py-2 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 border-b border-white/10 py-3 text-sm">
              <dt className="text-white/50">{k}</dt>
              <dd className="min-w-0 break-words text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {tracks.length > 1 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold">All remasters</h2>
          <div className="glass rounded-2xl p-2">
            {tracks.map((x, i) => <TrackItem key={x.id} track={x} index={i} queue={tracks} />)}
          </div>
        </section>
      )}
    </div>
  );
}
