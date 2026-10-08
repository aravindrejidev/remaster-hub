// Build-time step: reads tags + embedded cover art from FLAC files in public/audio/remastered
// and writes lib/library.json. Optional original: public/audio/original/<same file name>.<any audio ext>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = (...p) => path.join(root, "public", ...p);
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.codePointAt(0)) >>> 0, 7).toString(36);
const slug = (s) => s.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "n" + hash(s);
const first = (tags, ...keys) => { for (const k of keys) if (tags[k]?.length) return tags[k].join(", "); };
const base = (f) => f.replace(/\.[^.]+$/, "").toLowerCase();

function readFlac(file) {
  const fd = fs.openSync(file, "r");
  let pos = 0;
  const read = (n) => {
    const b = Buffer.alloc(n);
    const got = fs.readSync(fd, b, 0, n, pos);
    pos += got;
    return got === n ? b : null;
  };
  try {
    const head = read(10);
    pos = head && head.toString("latin1", 0, 3) === "ID3"
      ? 10 + (((head[6] & 127) << 21) | ((head[7] & 127) << 14) | ((head[8] & 127) << 7) | (head[9] & 127)) + (head[5] & 16 ? 10 : 0)
      : 0;
    if (read(4)?.toString("latin1") !== "fLaC") return null;
    const out = { tags: {}, picture: null, bits: 0, rate: 0, seconds: 0 };
    for (let last = false; !last; ) {
      const h = read(4);
      if (!h) break;
      last = !!(h[0] & 128);
      const type = h[0] & 127;
      const len = h.readUIntBE(1, 3);
      if (type !== 0 && type !== 4 && type !== 6) { pos += len; continue; }
      const d = read(len);
      if (!d) break;
      if (type === 0) {
        out.rate = (d[10] << 12) | (d[11] << 4) | (d[12] >> 4);
        out.bits = (((d[12] & 1) << 4) | (d[13] >> 4)) + 1;
        out.seconds = ((d[13] & 15) * 2 ** 32 + d.readUInt32BE(14)) / out.rate;
      } else if (type === 4) {
        let o = 4 + d.readUInt32LE(0);
        const n = d.readUInt32LE(o);
        o += 4;
        for (let i = 0; i < n && o + 4 <= d.length; i++) {
          const l = d.readUInt32LE(o);
          o += 4;
          const kv = d.toString("utf8", o, o + l);
          o += l;
          const eq = kv.indexOf("=");
          if (eq > 0) (out.tags[kv.slice(0, eq).toUpperCase()] ??= []).push(kv.slice(eq + 1));
        }
      } else {
        const kind = d.readUInt32BE(0);
        let o = 4;
        const ml = d.readUInt32BE(o);
        o += 4;
        const mime = d.toString("latin1", o, o + ml);
        o += ml;
        o += 4 + d.readUInt32BE(o) + 16; // description + width/height/depth/colors
        const n = d.readUInt32BE(o);
        o += 4;
        if (!out.picture || (kind === 3 && out.picture.kind !== 3)) out.picture = { kind, mime, data: d.subarray(o, o + n) };
      }
    }
    return out;
  } finally {
    fs.closeSync(fd);
  }
}

const remDir = dir("audio", "remastered");
const origDir = dir("audio", "original");
const files = fs.existsSync(remDir) ? fs.readdirSync(remDir).filter((f) => /\.flac$/i.test(f)).sort() : [];
const origs = fs.existsSync(origDir) ? fs.readdirSync(origDir).filter((f) => /\.(flac|mp3|m4a|aac|ogg|opus|wav|webm)$/i.test(f)) : [];
const items = [];

files.forEach((f, i) => {
  const info = readFlac(path.join(remDir, f));
  if (!info) return console.warn(`[meta] skipped ${f}: not a valid FLAC`);
  const t = info.tags;
  const name = f.replace(/\.flac$/i, "");
  const id = slug(name);
  const album = first(t, "ALBUM") ?? "Singles";
  const year = parseInt(first(t, "DATE", "YEAR", "ORIGINALDATE", "ORIGINALYEAR") ?? "", 10) || undefined;
  const genre = first(t, "GENRE");

  fs.mkdirSync(dir("covers"), { recursive: true });
  let cover;
  const pic = info.picture;
  if (pic) {
    const ext = /png/i.test(pic.mime) ? "png" : /webp/i.test(pic.mime) ? "webp" : "jpg";
    fs.writeFileSync(dir("covers", `${id}.${ext}`), pic.data);
    cover = `/covers/${id}.${ext}`;
  } else {
    const ext = ["jpg", "jpeg", "png", "webp"].find((e) => fs.existsSync(dir("covers", `${id}.${e}`)));
    if (ext) cover = `/covers/${id}.${ext}`;
  }

  const orig = origs.find((o) => base(o) === base(f));
  items.push({
    id,
    albumId: slug(album),
    file: `/audio/remastered/${encodeURIComponent(f)}`,
    original: orig ? `/audio/original/${encodeURIComponent(orig)}` : undefined,
    cover,
    title: first(t, "TITLE") ?? name,
    artist: first(t, "ARTIST", "ALBUMARTIST", "PERFORMER") ?? "Unknown artist",
    album,
    year,
    genre,
    seconds: Math.round(info.seconds),
    bits: info.bits,
    rate: info.rate,
    details: [
      ["Album", album], ["Year", year], ["Genre", genre], ["Composer", first(t, "COMPOSER")],
      ["Lyricist", first(t, "LYRICIST")], ["Label", first(t, "LABEL", "ORGANIZATION", "PUBLISHER")],
      ["Comment", first(t, "COMMENT", "DESCRIPTION")],
    ].filter(([, v]) => v).map(([k, v]) => [k, String(v)]),
  });
});

fs.writeFileSync(path.join(root, "lib", "library.json"), JSON.stringify(items, null, 2));
console.log(`[meta] ${items.length} track(s) -> lib/library.json`);
