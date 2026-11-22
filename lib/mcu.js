// Loads Google's @material/material-color-utilities. Its 0.4.0 release ships ten relative imports
// without their ".js" extension, which bundlers accept but Node's ES modules don't. This hook adds
// the extension for that package only, then loads it.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, next) {
    const inPackage = context.parentURL?.includes("/@material/material-color-utilities/");
    if (inPackage && /^\.\.?\//.test(specifier) && !specifier.endsWith(".js")) {
      return next(`${specifier}.js`, context);
    }
    return next(specifier, context);
  },
});

export default await import("@material/material-color-utilities");
