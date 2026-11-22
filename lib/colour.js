// The one colour module. Every interface colour role is generated here at build time from SEED,
// with Google's Material colour utilities (the 2025 Material 3 colour spec). Every other colour
// (artwork, the logo, the favicon and the share image) is also defined here, from the same seed or
// from a product's own colour harmonised toward it. Templates and CSS only ever use the roles this
// module emits; no other file holds a literal colour.
import mcu from "./mcu.js";

const { argbFromHex, Blend, Hct, hexFromArgb, SchemeFidelity, SchemeTonalSpot, TonalPalette } = mcu;

// The one decision. Change it and every role, scheme, artwork, logo and share image follows.
// A vivid, clean blue: the same hue as the blue vibe64.dev and mercbot.ai share (#3f5f90), with
// more colour, so the company and its products read as one family.
export const SEED = "#1B6EF3";

// The scheme style for the interface: Fidelity keeps the seed's own colour in the primary roles
// (the primary container is the seed itself) while surfaces stay near-white and near-black.
const BRAND_SCHEME = SchemeFidelity;
const KIND_SCHEME = SchemeTonalSpot;
const SPEC = "2025";

// Kinds of content, each with its own named colour role. Products keep their own brand colour,
// harmonised a little toward the seed so the three sit together.
export const KINDS = {
  // Vibe64's own blue: the Vibe64 card, page header and artwork.
  vibe64: { source: "#1867C0", label: "Vibe64" },
  // Mercbot's own orange: the Mercbot card, page header and artwork.
  mercbot: { source: "#FD690F", label: "Mercbot" },
  // Research: the Research card, page header and the diary cards.
  research: { source: "#0F8A6C", label: "Research" },
};

// The research diary's projects, each a kind of its own for the diary cards' artwork.
export const PROJECT_KINDS = {
  "agent-reliability": { source: "#0F8A6C", label: "Agent reliability" },
  "file-city": { source: "#2F7FB5", label: "File City" },
  "program-source": { source: "#7A5BD0", label: "Program source" },
};

const argb = (hex) => argbFromHex(hex);
const hex = (n) => hexFromArgb(n);
const kebab = (name) => name.replace(/_/g, "-");

function scheme(Variant, sourceHex, isDark, contrast = 0) {
  return new Variant(Hct.fromInt(argb(sourceHex)), isDark, contrast, SPEC);
}

// Every Material 3 colour role for the seed, as { "on-primary": "#rrggbb", ... }.
export function roles(isDark, { seed = SEED, contrast = 0 } = {}) {
  const s = scheme(BRAND_SCHEME, seed, isDark, contrast);
  const out = {};
  for (const color of s.colors.allColors) {
    if (!color) continue;
    out[kebab(color.name)] = hex(color.getArgb(s));
  }
  return out;
}

// A kind's harmonised source colour.
export function kindSource(source, seed = SEED) {
  return hex(Blend.harmonize(argb(source), argb(seed)));
}

// A kind's roles: its colour, its container and the colours written on them, plus its artwork
// palette (two gradient colours, an accent used once per drawing, and a light colour).
export function kindRoles(source, isDark, { seed = SEED, contrast = 0 } = {}) {
  const harmonised = kindSource(source, seed);
  const s = scheme(KIND_SCHEME, harmonised, isDark, contrast);
  const c = s.colors;
  const h = Hct.fromInt(argb(harmonised));
  const art = TonalPalette.fromHueAndChroma(h.hue, Math.max(h.chroma, 48));
  const artShift = TonalPalette.fromHueAndChroma((h.hue + 28) % 360, Math.max(h.chroma, 48));
  const accent = TonalPalette.fromHueAndChroma((h.hue + 300) % 360, 40);
  return {
    color: hex(c.primary().getArgb(s)),
    "on-color": hex(c.onPrimary().getArgb(s)),
    container: hex(c.primaryContainer().getArgb(s)),
    "on-container": hex(c.onPrimaryContainer().getArgb(s)),
    "container-high": hex(c.secondaryContainer().getArgb(s)),
    "on-container-high": hex(c.onSecondaryContainer().getArgb(s)),
    "art-1": hex(art.tone(isDark ? 30 : 38)),
    "art-2": hex(artShift.tone(isDark ? 42 : 56)),
    "art-accent": hex(accent.tone(isDark ? 82 : 88)),
    "art-light": hex(art.tone(isDark ? 92 : 97)),
  };
}

// The brand's own constants: the logo tile, its mark and the share image's dark ink. They stay the
// same in light and dark, as a logo does.
export function brand(seed = SEED) {
  const h = Hct.fromInt(argb(seed));
  const p = TonalPalette.fromHueAndChroma(h.hue, Math.max(h.chroma, 60));
  const deep = TonalPalette.fromHueAndChroma((h.hue + 330) % 360, Math.max(h.chroma, 60));
  const accent = TonalPalette.fromHueAndChroma((h.hue + 60) % 360, 56);
  const ink = TonalPalette.fromHueAndChroma(h.hue, 14);
  return {
    // Logo and favicon tile gradient, top left to bottom right.
    tile1: hex(p.tone(52)),
    tile2: hex(deep.tone(30)),
    // The mark's light core (left arch) and its accent (right arch and spark).
    core: hex(p.tone(98)),
    accent: hex(accent.tone(86)),
    spark: hex(accent.tone(94)),
    // Share image: dark ink background, a glow of the brand colour and its writing.
    ink: hex(ink.tone(8)),
    glow: hex(p.tone(34)),
    ring: hex(p.tone(70)),
    text: hex(ink.tone(98)),
    textSoft: hex(p.tone(86)),
  };
}

// WCAG contrast ratio of two hex colours.
export function contrast(a, b) {
  const lum = (h) => {
    const n = parseInt(h.slice(1), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

// The writing-on-background pairs the site uses, for the contrast check: [text role, background role].
export const TEXT_PAIRS = [
  ["on-surface", "surface"],
  ["on-surface-variant", "surface"],
  ["on-surface", "surface-container-low"],
  ["on-surface-variant", "surface-container-low"],
  ["on-surface", "surface-container"],
  ["on-surface-variant", "surface-container"],
  ["on-surface", "surface-container-high"],
  ["on-surface-variant", "surface-container-high"],
  ["on-surface-variant", "surface-container-highest"],
  ["primary", "surface"],
  ["primary", "surface-container-low"],
  ["on-primary", "primary"],
  ["on-primary-container", "primary-container"],
  ["on-secondary-container", "secondary-container"],
  ["on-tertiary-container", "tertiary-container"],
  ["on-tertiary", "tertiary"],
  ["inverse-on-surface", "inverse-surface"],
  ["inverse-primary", "inverse-surface"],
];
export const KIND_TEXT_PAIRS = [
  ["on-color", "color"],
  ["on-container", "container"],
  ["on-container-high", "container-high"],
  ["color", "surface"],
];
