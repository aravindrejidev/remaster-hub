import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AudioProvider } from "@/context/AudioContext";
import Header from "@/components/Header";
import MiniPlayer from "@/components/MiniPlayer";
import PlayerModal from "@/components/PlayerModal";

export const metadata: Metadata = {
  title: "Retro Remaster — HD restorations by Aravind Reji",
  description: "Old retro songs restored to 24-bit HD audio with FL Studio.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base font-sans text-white antialiased">
        <AudioProvider>
          <div className="ambient" />
          <Header />
          {children}
          <MiniPlayer />
          <PlayerModal />
        </AudioProvider>
      </body>
    </html>
  );
}
