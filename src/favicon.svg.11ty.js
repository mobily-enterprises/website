// The favicon: the logo, as a standalone SVG.
import { logoSvg } from "../lib/art.js";

export default class {
  data() {
    return { permalink: "/favicon.svg", eleventyExcludeFromCollections: true };
  }

  render() {
    return logoSvg({ id: "favicon", size: 48, standalone: true });
  }
}
