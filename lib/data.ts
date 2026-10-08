import library from "./library.json";

export type Track = {
  id: string; title: string; artist: string; album: string; albumId: string; year?: number; genre?: string;
  duration: string; color: string; cover?: string; original?: string; remastered: string;
  spec: string; quality: string; details: [string, string][];
};
export type Album = { id: string; title: string; decade: string; artist: string; year?: number; color: string; cover?: string };

// shape written by scripts/meta.mjs
type Raw = {
  id: string; albumId: string; file: string; original?: string; cover?: string; title: string; artist: string;
  album: string; year?: number; genre?: string; seconds: number; bits: number; rate: number; details: [string, string][];
};

export const fmt = (s: number) =>
  isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

export const tracks: Track[] = (library as unknown as Raw[]).map((r) => {
  const khz = +(r.rate / 1000).toFixed(1);
  return {
    id: r.id, title: r.title, artist: r.artist, album: r.album, albumId: r.albumId, year: r.year, genre: r.genre,
    duration: fmt(r.seconds), color: "#fa2d48", cover: r.cover, original: r.original, remastered: r.file,
    spec: `${r.bits}-bit / ${khz}kHz ${r.bits >= 24 ? "HD" : "Lossless"} Remaster`,
    quality: `${r.bits}-bit / ${khz}kHz FLAC`,
    details: r.details,
  };
});

export const albums: Album[] = [...new Map(tracks.map((t) => [t.albumId, t])).values()].map((t) => ({
  id: t.albumId, title: t.album, artist: t.artist, year: t.year, cover: t.cover, color: t.color,
  decade: t.year ? (t.year >= 2000 ? `${Math.floor(t.year / 10) * 10}s` : `${Math.floor(t.year / 10) % 10}0s`) : "",
}));

export const getAlbum = (id: string) => albums.find((a) => a.id === id);
export const albumTracks = (id: string) => tracks.filter((t) => t.albumId === id);
