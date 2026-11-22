// Artwork drawn in code: one cover renderer for every kind of content, the logo, and the share
// image. Motifs are data drawn by one renderer, so a new kind is new data, not new code. Each cover
// is seeded by its item (a product name, a diary record id), so the same item always draws the same
// art and two items of one kind differ a little. Covers take their colours from the page's theme
// (classes styled by the stylesheet), so they follow light and dark; the logo and the share image
// use the brand constants from colour.js.
import { brand, kindRoles, KINDS, PROJECT_KINDS } from "./colour.js";
import { svgPath } from "./shapes.js";

// mulberry32 over an FNV-1a hash of "kind:seed".
export function randomFor(kind, seed) {
  let h = 2166136261;
  for (const c of `${kind}:${seed}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  let s = h >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let n = Math.imul(s ^ (s >>> 15), 1 | s);
    n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

// A four-pointed spark centred at x, y with radius r.
const spark = (x, y, r) => {
  const k = r * 0.16;
  return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`;
};

// Motifs in a local box of about -100..100 around the motif's centre. paint: light, accent, ink
// (fills) or stroke-light, stroke-accent (strokes, with sw as the width). The accent is the focal
// point, used once.
const MOTIFS = {
  // Vibe64: an editor window with a prompt and a cursor, and an agent's spark.
  vibe64: {
    backdrop: "cookie-9",
    parts: [
      { el: "rect", x: -96, y: -70, width: 192, height: 140, rx: 32, paint: "stroke-light", sw: 13 },
      { el: "path", d: "M-58 -24-24 4-58 32", paint: "stroke-light", sw: 15 },
      { el: "path", d: "M-6 32H44", paint: "stroke-light", sw: 15, opacity: 0.6 },
      { el: "path", d: spark(86, -78, 38), paint: "accent" },
    ],
  },
  // Mercbot: a home with a person's speech bubble and a bot's.
  mercbot: {
    backdrop: "flower",
    parts: [
      { el: "path", d: "M-104 96V-4L0-94 104-4V96Z", paint: "stroke-light", sw: 12, opacity: 0.45 },
      { el: "rect", x: -80, y: -36, width: 108, height: 62, rx: 31, paint: "light" },
      { el: "path", d: "M-60 18-74 46-38 24Z", paint: "light" },
      { el: "rect", x: -14, y: 22, width: 108, height: 62, rx: 31, paint: "accent" },
      { el: "path", d: "M70 76 86 100 50 82Z", paint: "accent" },
      { el: "circle", cx: 16, cy: 53, r: 7.5, paint: "ink" },
      { el: "circle", cx: 40, cy: 53, r: 7.5, paint: "ink" },
      { el: "circle", cx: 64, cy: 53, r: 7.5, paint: "ink" },
    ],
  },
  // Research: agents as nodes, with work routed between them on an orbit.
  research: {
    backdrop: "sunny",
    parts: [
      { el: "ellipse", cx: 0, cy: 0, rx: 118, ry: 44, rotate: -18, paint: "stroke-light", sw: 7, opacity: 0.35 },
      { el: "path", d: "M-64 44 0-56 68 38Z", paint: "stroke-light", sw: 10, opacity: 0.6 },
      { el: "circle", cx: -64, cy: 44, r: 24, paint: "light" },
      { el: "circle", cx: 68, cy: 38, r: 24, paint: "light" },
      { el: "circle", cx: 0, cy: -56, r: 30, paint: "accent" },
    ],
  },
  // Agent reliability: a loop of checks around a lens.
  "agent-reliability": {
    backdrop: "cookie-12",
    parts: [
      { el: "path", d: "M80 -10A80 80 0 1 1 52-62", paint: "stroke-light", sw: 13, opacity: 0.55 },
      { el: "path", d: "M30-78 56-64 50-34", paint: "stroke-light", sw: 13, opacity: 0.55 },
      { el: "circle", cx: -6, cy: 0, r: 34, paint: "stroke-light", sw: 13 },
      { el: "path", d: "M20 26 44 50", paint: "stroke-accent", sw: 16 },
    ],
  },
  // File City: source files standing as city blocks.
  "file-city": {
    backdrop: "square",
    parts: [
      { el: "path", d: "M-118 88H118", paint: "stroke-light", sw: 10, opacity: 0.5 },
      { el: "rect", x: -104, y: 8, width: 34, height: 80, rx: 10, paint: "light", opacity: 0.7 },
      { el: "rect", x: -60, y: -46, width: 34, height: 134, rx: 10, paint: "light" },
      { el: "rect", x: -16, y: -8, width: 34, height: 96, rx: 10, paint: "light", opacity: 0.8 },
      { el: "rect", x: 28, y: -88, width: 34, height: 176, rx: 10, paint: "accent" },
      { el: "rect", x: 72, y: 22, width: 34, height: 66, rx: 10, paint: "light", opacity: 0.7 },
    ],
  },
  // Program source: a page of plain words turning into code.
  "program-source": {
    backdrop: "soft-burst",
    parts: [
      { el: "rect", x: -104, y: -82, width: 118, height: 164, rx: 22, paint: "light" },
      { el: "path", d: "M-80-46H-12M-80-18H-24M-80 10H-12M-80 38H-44", paint: "stroke-ink", sw: 11 },
      { el: "path", d: "M58-44 36 0 58 44", paint: "stroke-light", sw: 14, opacity: 0.8 },
      { el: "path", d: "M86-44 108 0 86 44", paint: "stroke-accent", sw: 14 },
    ],
  },
};

const PAINT = {
  light: (p) => `class="art-light"`,
  accent: (p) => `class="art-accent"`,
  ink: (p) => `class="art-ink"`,
  "stroke-light": (p) => `class="art-s-light" stroke-width="${p.sw}"`,
  "stroke-accent": (p) => `class="art-s-accent" stroke-width="${p.sw}"`,
  "stroke-ink": (p) => `class="art-s-ink" stroke-width="${p.sw}"`,
};

const n = (v) => Number(v.toFixed(1));

function part(p) {
  const opacity = p.opacity ? ` opacity="${p.opacity}"` : "";
  const paint = PAINT[p.paint](p);
  switch (p.el) {
    case "rect":
      return `<rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" rx="${p.rx}" ${paint}${opacity}/>`;
    case "circle":
      return `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" ${paint}${opacity}/>`;
    case "ellipse":
      return `<ellipse cx="${p.cx}" cy="${p.cy}" rx="${p.rx}" ry="${p.ry}" transform="rotate(${p.rotate})" ${paint}${opacity}/>`;
    default:
      return `<path d="${p.d}" ${paint}${opacity}/>`;
  }
}

export const COVER_KINDS = Object.keys(MOTIFS);

// A 2:1 cover for an item of a kind, cropped to fill its box. Decorative: the item's title carries
// the meaning. `place` is "right" (leaves room for text on the left) or "center".
export function cover(kind, seed, place = "right") {
  const motif = MOTIFS[kind] ?? MOTIFS.research;
  const r = randomFor(kind, seed);
  const id = `art-${kind}-${String(seed).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${place}`;
  const angle = n(-25 + r() * 50);
  const cx = n((place === "center" ? 400 : 520) + (r() - 0.5) * 70);
  const cy = n(200 + (r() - 0.5) * 36);
  const scale = n(1.12 + r() * 0.16);
  const tilt = n(-6 + r() * 12);
  const backdropRotate = n(r() * 90);
  const dots = [];
  const count = 5 + Math.floor(r() * 4);
  for (let i = 0; i < count; i++) {
    dots.push(
      `<circle cx="${n(r() * 800)}" cy="${n(r() * 400)}" r="${n(6 + r() * 22)}" class="art-light" opacity="${n(0.1 + r() * 0.14)}"/>`,
    );
  }
  return [
    `<svg class="art art--${kind}" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">`,
    `<defs><linearGradient id="${id}" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" class="art-stop-1"/><stop offset="1" class="art-stop-2"/></linearGradient></defs>`,
    `<rect width="800" height="400" fill="url(#${id})"/>`,
    dots.join(""),
    `<path d="${svgPath(motif.backdrop, cx - 30, cy, 230, backdropRotate)}" class="art-light" opacity="0.13"/>`,
    `<g transform="translate(${cx} ${cy}) rotate(${tilt}) scale(${scale})">`,
    motif.parts.map(part).join(""),
    `</g></svg>`,
  ].join("");
}

// The logo: a cookie-shaped tile in the brand gradient with an "m" of two arches (a light core and
// an accent) and an AI spark. `id` keeps its gradient unique on a page.
export function logoSvg({ id = "logo", size = 40, square = false, label = "", standalone = false } = {}) {
  const b = brand();
  const tile = square
    ? `<rect width="48" height="48" fill="url(#${id}-g)"/>`
    : `<path d="${svgPath("cookie-9", 24, 24, 24)}" fill="url(#${id}-g)"/>`;
  const scale = square ? ` transform="translate(24 24) scale(.82) translate(-24 -24)"` : "";
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  const open = standalone
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">`
    : `<svg class="logo" viewBox="0 0 48 48" width="${size}" height="${size}" ${a11y} focusable="false">`;
  return [
    open,
    `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.tile1}"/><stop offset="1" stop-color="${b.tile2}"/></linearGradient></defs>`,
    tile,
    `<g${scale} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.8">`,
    `<path d="M24 22a4.75 4.75 0 0 1 9.5 0v9.5" stroke="${b.accent}"/>`,
    `<path d="M14.5 31.5V22a4.75 4.75 0 0 1 9.5 0v9.5" stroke="${b.core}"/>`,
    `</g>`,
    `<path${scale} d="${spark(36, 13, 5.2)}" fill="${b.spark}"/>`,
    `</svg>`,
  ].join("");
}

// The share image's drawing, 1200 x 630, without its words (raster.js adds them as glyph paths).
export function ogBackground() {
  const b = brand();
  const k = (kind) => kindRoles((KINDS[kind] ?? PROJECT_KINDS[kind]).source, false);
  const v = k("vibe64");
  const m = k("mercbot");
  const rs = k("research");
  const r = randomFor("og", "mobilyenterprises");
  const bubbles = [];
  for (let i = 0; i < 9; i++) {
    bubbles.push(
      `<circle cx="${n(r() * 1200)}" cy="${n(r() * 630)}" r="${n(6 + r() * 26)}" fill="${b.textSoft}" opacity="${n(0.05 + r() * 0.09)}"/>`,
    );
  }
  return [
    `<defs>`,
    `<radialGradient id="glow" cx="0.78" cy="0.2" r="0.8"><stop offset="0" stop-color="${b.glow}"/><stop offset="1" stop-color="${b.ink}" stop-opacity="0"/></radialGradient>`,
    `<linearGradient id="gv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${v["art-1"]}"/><stop offset="1" stop-color="${v["art-2"]}"/></linearGradient>`,
    `<linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m["art-1"]}"/><stop offset="1" stop-color="${m["art-2"]}"/></linearGradient>`,
    `<linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${rs["art-1"]}"/><stop offset="1" stop-color="${rs["art-2"]}"/></linearGradient>`,
    `</defs>`,
    `<rect width="1200" height="630" fill="${b.ink}"/>`,
    `<rect width="1200" height="630" fill="url(#glow)"/>`,
    `<circle cx="1010" cy="330" r="300" fill="none" stroke="${b.ring}" stroke-width="3" opacity="0.22"/>`,
    bubbles.join(""),
    `<path d="${svgPath("cookie-9", 1000, 190, 150, 8)}" fill="url(#gv)"/>`,
    `<path d="${svgPath("clover-4", 860, 455, 118, 20)}" fill="url(#gm)"/>`,
    `<path d="${svgPath("sunny", 1100, 470, 96, 0)}" fill="url(#gr)"/>`,
    `<path d="${spark(1000, 190, 52)}" fill="${v["art-light"]}"/>`,
  ].join("");
}
