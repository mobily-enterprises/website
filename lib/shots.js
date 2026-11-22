// The product captures (src/assets/products): screenshots of vibe64.dev, mercbot.ai and the research
// diary, taken headless. Each has its address, its files (with a dark-scheme version when the site
// has one), its size and what it shows.
export const SHOTS = {
  vibe64: {
    url: "vibe64.dev",
    src: "/assets/products/vibe64-light.webp",
    dark: "/assets/products/vibe64-dark.webp",
    width: 1440,
    height: 900,
    alt: "The vibe64.dev home page: your own server in the cloud, with an AI coding workspace already set up.",
  },
  mercbot: {
    url: "mercbot.ai",
    src: "/assets/products/mercbot-home.webp",
    width: 1464,
    height: 840,
    alt: "A Mercbot home: a list of bots, each with its latest news, beside a chat with a new bot.",
  },
  "mercbot-phone": {
    src: "/assets/products/mercbot-phone.webp",
    width: 480,
    height: 900,
    alt: "Mercbot on a phone: a bot plans the week's dinners and waits for a yes before sending them to the family chat.",
  },
  research: {
    url: "research.mobilyenterprises.com",
    src: "/assets/products/research-diary.webp",
    width: 1440,
    height: 900,
    alt: "The AI Research Diary: dated technical records, each from hypothesis and experiment to evaluation and conclusion.",
  },
};

// A capture as a picture. `decorative` captures (beside text that already says the same) get an
// empty alt and load lazily.
export function shot(key, cls = "", decorative = false) {
  const s = SHOTS[key];
  if (!s) throw new Error(`No product capture named "${key}"`);
  const attrs = `width="${s.width}" height="${s.height}" alt="${decorative ? "" : s.alt}"${decorative ? ' loading="lazy"' : ""}`;
  const img = `<img${cls ? ` class="${cls}"` : ""} src="${s.src}" ${attrs}>`;
  return s.dark ? `<picture><source srcset="${s.dark}" media="(prefers-color-scheme: dark)">${img}</picture>` : img;
}

// A capture in a window frame: a bar with the site's address above the picture.
export function frame(key, cls = "") {
  const bar = `<div class="frame__bar" aria-hidden="true"><span class="frame__dots"><i></i><i></i><i></i></span><span class="frame__url">${SHOTS[key].url}</span></div>`;
  return `<figure class="frame${cls ? ` ${cls}` : ""}">${bar}${shot(key)}</figure>`;
}
