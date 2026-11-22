// After each build: the PNG icons and the Open Graph share image, rendered from the same SVG
// drawings (and the brand colours) as the logo. Words in the share image are drawn as glyph paths
// from the site's own Roboto Flex, so rendering needs no installed fonts. fontkit draws variable
// glyphs only from TrueType, so the site's WOFF2 file is decompressed to TrueType first.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import * as fontkit from "fontkit";
import wawoff2 from "wawoff2";
import { logoSvg, ogBackground } from "./art.js";
import { brand } from "./colour.js";

const FONT_FILE = new URL("../src/assets/fonts/roboto-flex-latin.woff2", import.meta.url);

function png(svg, width) {
  return new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: false } })
    .render()
    .asPng();
}

// The glyph outlines of a line of text, as one SVG path, with its baseline starting at x, y.
function textPath(font, text, { x, y, size, wght = 400, wdth = 100, fill }) {
  const face = font.getVariation({ wght, wdth, opsz: Math.min(144, Math.max(8, size)) });
  const run = face.layout(text);
  const scale = size / face.unitsPerEm;
  let pen = x;
  let d = "";
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    d += glyph.path
      .scale(scale, -scale)
      .translate(pen + pos.xOffset * scale, y - pos.yOffset * scale)
      .toSVG();
    pen += pos.xAdvance * scale;
  });
  return `<path d="${d}" fill="${fill}"/>`;
}

export async function shareImageSvg() {
  const font = fontkit.create(Buffer.from(await wawoff2.decompress(readFileSync(FONT_FILE))));
  const b = brand();
  const words = [
    textPath(font, "Mobily", { x: 76, y: 318, size: 104, wght: 560, fill: b.text }),
    textPath(font, "Enterprises", { x: 76, y: 428, size: 104, wght: 560, fill: b.text }),
    textPath(font, "Software where people and AI", { x: 80, y: 500, size: 36, wght: 420, fill: b.textSoft }),
    textPath(font, "work together.", { x: 80, y: 546, size: 36, wght: 420, fill: b.textSoft }),
  ];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`,
    ogBackground(),
    `<g transform="translate(80 70)">${logoSvg({ id: "og", size: 112, standalone: true })}</g>`,
    words.join(""),
    `</svg>`,
  ].join("");
}

export async function writeRasters(outputDir) {
  writeFileSync(path.join(outputDir, "og.png"), png(await shareImageSvg(), 1200));
  writeFileSync(path.join(outputDir, "favicon-32.png"), png(logoSvg({ id: "f32", size: 32, standalone: true }), 32));
  writeFileSync(
    path.join(outputDir, "apple-touch-icon.png"),
    png(logoSvg({ id: "touch", size: 180, square: true, standalone: true }), 180),
  );
}
