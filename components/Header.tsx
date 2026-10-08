"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Disc3 } from "lucide-react";

const links = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }];

export default function Header() {
  const path = usePathname();
  return (
    <header className="glass fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Disc3 className="h-5 w-5 text-accent" /> Retro Remaster
        </Link>
        <nav className="flex gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="relative rounded-full px-4 py-1.5 text-sm text-white/70 transition hover:text-white">
              {path === l.href && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
