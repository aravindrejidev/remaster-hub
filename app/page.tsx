"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { albums, tracks, SPEC } from "@/lib/data";
import Cover from "@/components/Cover";

export default function Home() {
  const { play } = useAudio();
  const hero = tracks[0];
  const recent = [...tracks].reverse();
  return (
    <div className="space-y-14">
      <section className="overflow-hidden rounded-3xl p-8 sm:p-12" style={{ background: `linear-gradient(120deg, ${hero.color}cc, #1c1c1e 80%)` }}>
        <p className="text-sm font-medium text-white/70">Remaster of the week</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">{hero.title}</h1>
        <p className="mt-2 text-lg text-white/70">{hero.artist}</p>
        <span className="glass mt-5 inline-block rounded-full px-3 py-1 text-xs font-medium">{SPEC}</span>
        <div className="mt-8">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={() => play(hero, tracks)} className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black">
            <Play className="h-5 w-5 fill-black" /> Play
          </motion.button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Browse by decade</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {albums.map((a) => (
            <motion.div key={a.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href={`/album/${a.id}`} className="block">
                <Cover color={a.color} src={a.cover} className="aspect-[16/10] rounded-2xl">
                  <span className="absolute bottom-3 left-4 text-5xl font-black tracking-tight text-white/90">{a.decade}</span>
                </Cover>
                <p className="mt-2 font-semibold">{a.title}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recently restored</h2>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {recent.map((t) => (
            <motion.button key={t.id} whileHover={{ y: -4 }} onClick={() => play(t, tracks)} className="group text-left">
              <div className="relative">
                <Cover color={t.color} src={t.cover} className="aspect-square rounded-xl shadow-lg" />
                <span className="absolute bottom-2 right-2 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-accent opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <Play className="h-5 w-5 fill-white" />
                </span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold">{t.title}</p>
              <p className="truncate text-xs text-white/50">{t.artist}</p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
