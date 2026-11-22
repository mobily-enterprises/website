// Material 3 Expressive shapes, described as data: each is a radius around its centre for every
// angle. The same description draws a CSS clip-path polygon (every shape has the same number of
// points, so any two morph into each other with a plain CSS transition) and a smooth SVG path for
// artwork. All shapes fit their box, with angle 0 at the top.

const POLYGON_POINTS = 120;
const PATH_POINTS = 72;

// Lobes: n bumps, the valleys at rMin; k < 1 gives fat lobes and tight valleys, k > 1 points.
const lobed = (n, rMin, k) => (a) => rMin + (1 - rMin) * ((1 + Math.cos(n * a)) / 2) ** k;
// A rounded square (a superellipse); its sides touch the box.
const squircle = (p) => (a) => (Math.abs(Math.cos(a)) ** p + Math.abs(Math.sin(a)) ** p) ** (-1 / p);

export const SHAPES = {
  circle: () => 1,
  square: squircle(5),
  "cookie-4": lobed(4, 0.8, 0.75),
  "cookie-6": lobed(6, 0.84, 0.75),
  "cookie-9": lobed(9, 0.88, 0.75),
  "cookie-12": lobed(12, 0.9, 0.75),
  "clover-4": lobed(4, 0.52, 0.4),
  "clover-8": lobed(8, 0.7, 0.45),
  sunny: lobed(8, 0.82, 1.1),
  "very-sunny": lobed(8, 0.68, 1.4),
  "soft-burst": lobed(10, 0.8, 1.6),
  flower: lobed(8, 0.64, 0.6),
};

function points(name, count) {
  const r = SHAPES[name];
  if (!r) throw new Error(`Unknown shape ${name}`);
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const radius = r(a);
    out.push([Math.sin(a) * radius, -Math.cos(a) * radius]);
  }
  return out;
}

// polygon(...) in percentages of the element's box, for clip-path.
export function polygon(name) {
  const pts = points(name, POLYGON_POINTS).map(
    ([x, y]) => `${(50 + 50 * x).toFixed(1)}% ${(50 + 50 * y).toFixed(1)}%`,
  );
  return `polygon(${pts.join(",")})`;
}

const f = (n) => Number(n.toFixed(2));

// A smooth closed SVG path (Catmull-Rom through the shape's points) at cx, cy with the given
// radius and rotation in degrees.
export function svgPath(name, cx, cy, radius, rotate = 0) {
  const t = (rotate * Math.PI) / 180;
  const pts = points(name, PATH_POINTS).map(([x, y]) => [
    cx + radius * (x * Math.cos(t) - y * Math.sin(t)),
    cy + radius * (x * Math.sin(t) + y * Math.cos(t)),
  ]);
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}
