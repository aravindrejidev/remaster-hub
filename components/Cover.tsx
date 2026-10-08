"use client";
import type { ReactNode } from "react";
import { Disc3 } from "lucide-react";

export default function Cover({ color, src, className = "", children }: { color: string; src?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${color}, #1c1c1e 90%)` }}>
      <Disc3 className="absolute inset-0 m-auto h-1/3 w-1/3 text-white/25" />
      {src && <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
      {children}
    </div>
  );
}
