// Theme facts the page templates need: the browser bar colours for light and dark.
import { roles } from "../../lib/colour.js";

export default {
  themeColor: { light: roles(false).surface, dark: roles(true).surface },
};
