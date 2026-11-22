// The logo and the share image's background, drawn in code from the brand constants in colour.js.
import { brand } from "./colour.js";
import { svgPath } from "./shapes.js";

// A four-pointed spark centred at x, y with radius r.
const spark = (x, y, r) => {
  const k = r * 0.16;
  return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`;
};

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

// The share image's drawing, 1200 x 630, without its words (raster.js adds them as glyph paths):
// a glow of the brand colour into its dark ink, a faint ring, and the logo's cookie shape with its
// spark, large on the right.
export function ogBackground() {
  const b = brand();
  return [
    `<defs>`,
    `<radialGradient id="glow" cx="0.8" cy="0.3" r="0.75"><stop offset="0" stop-color="${b.glow}"/><stop offset="1" stop-color="${b.ink}" stop-opacity="0"/></radialGradient>`,
    `<linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.tile1}"/><stop offset="1" stop-color="${b.tile2}"/></linearGradient>`,
    `</defs>`,
    `<rect width="1200" height="630" fill="${b.ink}"/>`,
    `<rect width="1200" height="630" fill="url(#glow)"/>`,
    `<circle cx="960" cy="315" r="250" fill="none" stroke="${b.ring}" stroke-width="2" opacity="0.25"/>`,
    `<path d="${svgPath("cookie-9", 960, 315, 170, 10)}" fill="url(#tile)"/>`,
    `<path d="${spark(960, 315, 70)}" fill="${b.spark}"/>`,
  ].join("");
}
