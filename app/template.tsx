"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// template.tsx re-mounts on every navigation, giving a page transition while the layout (and audio) persists.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-6xl px-4 pb-40 pt-24"
    >
      {children}
    </motion.main>
  );
}
