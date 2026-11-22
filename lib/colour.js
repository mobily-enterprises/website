// The one colour module. Every interface colour role is generated here at build time from SEED,
// with Google's Material colour utilities (the 2025 Material 3 colour spec). The few other colours
// (the logo, the favicon and the share image) are also defined here, from the same seed. Templates
// and CSS only ever use the roles this module emits; no other file holds a literal colour.
import mcu from "./mcu.js";

const { argbFromHex, Hct, hexFromArgb, SchemeFidelity, TonalPalette } = mcu;

// The one decision. Change it and every role, scheme, logo and share image follows.
// A vivid, clean blue: the same hue as the blue vibe64.dev and mercbot.ai share (#3f5f90), with
// more colour, so the company and its products read as one family.
export const SEED = "#1B6EF3";

// The scheme style for the interface: Fidelity keeps the seed's own colour in the primary roles
// (the primary container is the seed itself) while surfaces stay near-white and near-black.
const BRAND_SCHEME = SchemeFidelity;
const SPEC = "2025";

const argb = (hex) => argbFromHex(hex);
const hex = (n) => hexFromArgb(n);
const kebab = (name) => name.replace(/_/g, "-");


// Every Material 3 colour role for the seed, as { "on-primary": "#rrggbb", ... }.
export function roles(isDark, { seed = SEED, contrast = 0 } = {}) {
  const s = new BRAND_SCHEME(Hct.fromInt(argb(seed)), isDark, contrast, SPEC);
  const out = {};
  for (const color of s.colors.allColors) {
    if (!color) continue;
    out[kebab(color.name)] = hex(color.getArgb(s));
  }
  return out;
}

// The brand's own constants: the logo tile, its mark and the share image's dark ink. They stay the
// same in light and dark, as a logo does.
export function brand(seed = SEED) {
  const h = Hct.fromInt(argb(seed));
  const p = TonalPalette.fromHueAndChroma(h.hue, Math.max(h.chroma, 60));
  const deep = TonalPalette.fromHueAndChroma((h.hue + 330) % 360, Math.max(h.chroma, 60));
  const accent = TonalPalette.fromHueAndChroma((h.hue + 340) % 360, 48);
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
  ["inverse-on-surface", "inverse-surface"],
  ["inverse-primary", "inverse-surface"],
];
