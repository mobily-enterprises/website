import { cover, logoSvg } from "./lib/art.js";
import { icon } from "./lib/icons.js";
import { writeRasters } from "./lib/raster.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  eleventyConfig.addShortcode("icon", (name, label) => icon(name, label));
  eleventyConfig.addShortcode("cover", (kind, seed, place) => cover(kind, seed, place));
  eleventyConfig.addShortcode("logo", (id, size = 40) => logoSvg({ id, size }));

  // JSON for a JSON-LD block, with "<" escaped so the data can never close its element.
  eleventyConfig.addFilter("jsonLd", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));

  // Non-breaking spaces, so a phone number never wraps.
  eleventyConfig.addFilter("nbsp", (value) => String(value).replace(/ /g, "&nbsp;"));

  // "2026-09-20" -> "20 September 2026"
  eleventyConfig.addFilter("longDate", (value) => {
    const d = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  });

  eleventyConfig.on("eleventy.after", ({ directories }) => writeRasters(directories.output));
}

export const config = {
  dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
  templateFormats: ["njk", "11ty.js"],
  htmlTemplateEngine: "njk",
};
