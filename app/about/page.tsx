"use client";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AtSign, Camera, Filter, MessageCircle, MoveHorizontal, Send, SlidersHorizontal, Sparkles, Waves } from "lucide-react";

const steps = [
  { icon: Waves, title: "Noise Reduction", text: "Hiss, hum and crackle are profiled and removed without dulling the performance." },
  { icon: Filter, title: "Frequency Isolation", text: "Problem bands are isolated so vocals and instruments can be treated separately." },
  { icon: SlidersHorizontal, title: "EQ Balancing", text: "Lost highs and thin lows are restored for a natural, balanced spectrum." },
  { icon: MoveHorizontal, title: "Stereo Widening", text: "Narrow, mono-like mixes gain depth and space while staying phase-safe." },
  { icon: Sparkles, title: "Final Mastering", text: "Limiting and loudness tuning, exported as 24-bit / 48kHz HD audio." },
];

const socials = [
  { icon: AtSign, label: "X (Twitter)", href: "https://x.com/Aravind_3000" },
  { icon: MessageCircle, label: "Reddit", href: "https://www.reddit.com/u/gh9aravind_3000/s/VSYQ1NAKld" },
  { icon: Camera, label: "Instagram", href: "https://www.instagram.com/gh9aravind_3000?stkn=MWtxdWNvaGU2YXhvMg==" },
];

export default function About() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Created by Aravind Reji</h1>
        <h2 className="mt-8 text-2xl font-bold">The mission</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
          Old retro songs deserve to be heard the way they were meant to sound. With modern DSP and FL Studio mastering techniques, I restore low-clarity recordings: rebuilding the frequency spectrum, removing noise and delivering 24-bit HD audio, so timeless music keeps reaching new listeners.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="glass rounded-2xl p-5">
              <s.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-semibold">{i + 1}. {s.title}</h3>
              <p className="mt-1 text-sm text-white/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Connect</h2>
        <div className="flex flex-wrap gap-3">
          {socials.map((s) => (
            <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -3 }} className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
              <s.icon className="h-4 w-4" /> {s.label}
            </motion.a>
          ))}
        </div>
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Request a remaster</h2>
        <p className="mt-1 text-sm text-white/60">Share a song and its YouTube link. I will try to restore it next.</p>
        <form onSubmit={submit} className="mt-5 max-w-lg space-y-3">
          <input name="song" required placeholder="Song name and artist" className="field" />
          <input name="link" required type="url" placeholder="https://www.youtube.com/watch?v=..." className="field" />
          <input name="name" placeholder="Your name (optional)" className="field" />
          <button disabled={state === "sending"} className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold disabled:opacity-50">
            <Send className="h-4 w-4" /> {state === "sending" ? "Sending..." : "Send request"}
          </button>
          {state === "sent" && <p className="text-sm text-green-400">Request sent. Thank you!</p>}
          {state === "error" && <p className="text-sm text-red-400">Could not send the request. Check the YouTube link and try again.</p>}
        </form>
      </section>
    </div>
  );
}
