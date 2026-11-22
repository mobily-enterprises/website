// The site's one stylesheet: the generated design tokens, then the hand-written styles in
// src/styles, in this order.
import { readFileSync } from "node:fs";
import { tokensCss } from "../../lib/tokens.js";

const PARTS = ["base", "components", "layout", "pages", "motion"];

export default class {
  data() {
    return { permalink: "/assets/site.css", eleventyExcludeFromCollections: true };
  }

  render() {
    const styles = PARTS.map((name) => readFileSync(new URL(`../styles/${name}.css`, import.meta.url), "utf8"));
    return [tokensCss(), ...styles].join("\n\n");
  }
}
