"use client";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";
import { albumTracks, getAlbum, SPEC } from "@/lib/data";
import Cover from "@/components/Cover";
import TrackItem from "@/components/TrackItem";

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { play } = useAudio();
  const album = getAlbum(id);
  if (!album) return notFound();
  const list = albumTracks(id);

  return (
    <div>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl" style={{ boxShadow: `0 30px 100px -30px ${album.color}` }}
        >
          <Cover color={album.color} src={album.cover} className="h-60 w-60 rounded-2xl sm:h-64 sm:w-64">
            <span className="absolute bottom-3 left-4 text-5xl font-black text-white/90">{album.decade}</span>
          </Cover>
        </motion.div>
        <div className="text-center sm:text-left">
          <span className="glass inline-block rounded-full px-3 py-1 text-xs font-medium">{SPEC}</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{album.title}</h1>
          <p className="mt-1 text-white/60">{album.artist}, {album.year}, {list.length} tracks</p>
          <button onClick={() => play(list[0], list)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold">
            <Play className="h-5 w-5 fill-white" /> Play
          </button>
        </div>
      </div>

      <div className="glass mt-10 rounded-2xl p-2">
        {list.map((t, i) => <TrackItem key={t.id} track={t} index={i} queue={list} />)}
      </div>
    </div>
  );
}
