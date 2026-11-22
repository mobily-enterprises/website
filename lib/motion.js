// Material 3 Expressive motion: springs, turned into CSS linear() easing curves at build time.
// Each spring is a damping ratio and a stiffness (mass 1), as in the M3 expressive motion scheme.
// Spatial springs move things and may overshoot; effects springs (colour, opacity) never do.
export const SPRINGS = {
  "fast-spatial": { damping: 0.6, stiffness: 800 },
  "default-spatial": { damping: 0.8, stiffness: 380 },
  "slow-spatial": { damping: 0.8, stiffness: 200 },
  "fast-effects": { damping: 1, stiffness: 3800 },
  "default-effects": { damping: 1, stiffness: 1600 },
  "slow-effects": { damping: 1, stiffness: 800 },
};

// Fallbacks for browsers without linear(): M3's standard easing curves.
const FALLBACK = {
  spatial: "cubic-bezier(0.27, 1.06, 0.18, 1)",
  effects: "cubic-bezier(0.31, 0.94, 0.34, 1)",
};

// The position of a spring released from 0 toward 1 at time t (seconds).
function position({ damping: z, stiffness: k }, t) {
  const w = Math.sqrt(k);
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  return 1 - Math.exp(-w * t) * (1 + w * t);
}

// How long the spring takes to settle within 0.2% of its target, and stay there.
function settleTime(spring) {
  let last = 0;
  for (let t = 0; t <= 3; t += 0.001) if (Math.abs(1 - position(spring, t)) > 0.002) last = t;
  return last;
}

export function springs() {
  return Object.entries(SPRINGS).map(([name, spring]) => {
    const duration = settleTime(spring);
    const steps = 56;
    const values = [];
    for (let i = 0; i <= steps; i++) {
      const v = i === steps ? 1 : position(spring, (duration * i) / steps);
      values.push(Number(v.toFixed(4)));
    }
    return {
      name,
      duration: Math.round(duration * 1000),
      easing: `linear(${values.join(", ")})`,
      fallback: name.endsWith("spatial") ? FALLBACK.spatial : FALLBACK.effects,
    };
  });
}
