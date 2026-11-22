// The generated part of the stylesheet: Material 3 colour roles for light, dark and high
// contrast (from colour.js), each kind's roles, spring easing curves (from motion.js) and the
// expressive shapes as clip-path polygons (from shapes.js).
import { KINDS, kindRoles, PROJECT_KINDS, roles } from "./colour.js";
import { springs } from "./motion.js";
import { polygon, SHAPES } from "./shapes.js";

const ALL_KINDS = { ...KINDS, ...PROJECT_KINDS };
const KIND_ROLE_NAMES = Object.keys(kindRoles("#336699", false));

function colourBlock(isDark, contrast) {
  const lines = Object.entries(roles(isDark, { contrast })).map(
    ([name, value]) => `  --md-sys-color-${name}: ${value};`,
  );
  for (const [kind, { source }] of Object.entries(ALL_KINDS)) {
    for (const [name, value] of Object.entries(kindRoles(source, isDark, { contrast }))) {
      lines.push(`  --kind-${kind}-${name}: ${value};`);
    }
  }
  return lines.join("\n");
}

function kindClasses() {
  return Object.keys(ALL_KINDS)
    .map((kind) => {
      const body = KIND_ROLE_NAMES.map((name) => `  --k-${name}: var(--kind-${kind}-${name});`).join("\n");
      return `.kind-${kind},\n.art--${kind} {\n${body}\n}`;
    })
    .join("\n");
}

function motionBlock() {
  const list = springs();
  const fallback = {
    "fast-spatial": 350, "default-spatial": 500, "slow-spatial": 650,
    "fast-effects": 150, "default-effects": 200, "slow-effects": 300,
  };
  const base = list
    .map(
      (s) =>
        `  --md-sys-motion-spring-${s.name}: ${s.fallback};\n  --md-sys-motion-spring-${s.name}-duration: ${fallback[s.name]}ms;`,
    )
    .join("\n");
  const spring = list
    .map(
      (s) =>
        `    --md-sys-motion-spring-${s.name}: ${s.easing};\n    --md-sys-motion-spring-${s.name}-duration: ${s.duration}ms;`,
    )
    .join("\n");
  return `:root {\n${base}\n}\n@supports (transition-timing-function: linear(0, 1)) {\n  :root {\n${spring}\n  }\n}`;
}

function shapeBlock() {
  const lines = Object.keys(SHAPES).map((name) => `  --md-shape-${name}: ${polygon(name)};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function tokensCss() {
  return [
    "/* Generated at build time from lib/colour.js, lib/motion.js and lib/shapes.js. */",
    `:root {\n  color-scheme: light dark;\n${colourBlock(false, 0)}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root {\n${colourBlock(true, 0)}\n  }\n}`,
    `@media (prefers-contrast: more) {\n  :root {\n${colourBlock(false, 0.5)}\n  }\n}`,
    `@media (prefers-contrast: more) and (prefers-color-scheme: dark) {\n  :root {\n${colourBlock(true, 0.5)}\n  }\n}`,
    kindClasses(),
    motionBlock(),
    shapeBlock(),
  ].join("\n\n");
}
