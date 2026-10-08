export type Track = { id: string; title: string; artist: string; albumId: string; duration: string; color: string; cover?: string; original: string; remastered: string };
export type Album = { id: string; title: string; decade: string; artist: string; year: number; color: string; cover?: string };

export const SPEC = "24-bit / 48kHz HD Remaster";

export const albums: Album[] = [
  { id: "70s-classics", title: "70s Classics", decade: "70s", artist: "Various Artists", year: 1975, color: "#f97316" },
  { id: "80s-hits", title: "80s Hits", decade: "80s", artist: "Various Artists", year: 1985, color: "#ec4899" },
  { id: "90s-nostalgia", title: "90s Nostalgia", decade: "90s", artist: "Various Artists", year: 1995, color: "#22d3ee" },
];

const mk = (n: number, a: Album, title: string, duration: string): Track => ({
  id: `${a.id}-${n}`, title, artist: "Retro Artist", albumId: a.id, duration, color: a.color,
  original: `/audio/original/${a.id}-${n}.mp3`,
  remastered: `/audio/remastered/${a.id}-${n}.mp3`,
});

export const tracks: Track[] = [
  mk(1, albums[0], "Golden Highway", "3:42"), mk(2, albums[0], "Velvet Nights", "4:05"),
  mk(1, albums[1], "Neon Heartbeat", "3:55"), mk(2, albums[1], "Midnight Cassette", "4:12"),
  mk(1, albums[2], "Pager Dreams", "3:31"), mk(2, albums[2], "Summer Dial-Up", "4:20"),
];

export const getAlbum = (id: string) => albums.find((a) => a.id === id);
export const albumTracks = (id: string) => tracks.filter((t) => t.albumId === id);
export const fmt = (s: number) =>
  isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";
