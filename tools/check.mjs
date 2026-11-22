// Checks the built site in _site:
// - no JavaScript: no .js files, no inline event handlers, no javascript: URLs, and no <script>
//   element except JSON-LD data blocks (which browsers never run), each holding valid JSON;
// - every internal link, asset and #fragment resolves;
// - every text colour pair the site uses reaches WCAG AA (4.5:1) in light, dark and both
//   high-contrast schemes;
// - with --external, every external link answers.
// Exits 1 when anything fails.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { contrast, roles, TEXT_PAIRS } from "../lib/colour.js";

const SITE = path.resolve("_site");
const ORIGIN = "https://mobilyenterprises.com";
const EXTERNAL = process.argv.includes("--external");
const TEXT = /\.(html|svg|xml|css|txt|json|webmanifest)$/i;
const problems = [];
const problem = (msg) => problems.push(msg);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(SITE)) {
  console.error("No _site folder: run `npm run build` first.");
  process.exit(1);
}
const files = walk(SITE);
const rel = (p) => path.relative(SITE, p);

// ---------- No JavaScript ----------
let scriptCount = 0;
let jsonLdCount = 0;
for (const file of files) {
  if (/\.(m?js|cjs)$/i.test(file)) problem(`JavaScript file shipped: ${rel(file)}`);
  if (!TEXT.test(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    scriptCount++;
    if (!/\btype\s*=\s*"application\/ld\+json"/i.test(m[1]) || /\bsrc\s*=/i.test(m[1])) {
      problem(`${rel(file)}: a <script> that is not a JSON-LD data block: <script${m[1]}>`);
      continue;
    }
    jsonLdCount++;
    try {
      JSON.parse(m[2]);
    } catch (error) {
      problem(`${rel(file)}: JSON-LD that is not valid JSON (${error.message})`);
    }
  }
  if ((text.match(/<script\b/gi) ?? []).length !== (text.match(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi) ?? []).length) {
    problem(`${rel(file)}: an unclosed <script>`);
  }
  for (const m of text.matchAll(/<[a-z][^>]*\son[a-z]+\s*=/gi)) problem(`${rel(file)}: inline event handler: ${m[0].slice(0, 80)}`);
  if (/javascript:/i.test(text)) problem(`${rel(file)}: a javascript: URL`);
}

// ---------- Links ----------
const pages = files.filter((f) => f.endsWith(".html"));
const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const text = readFileSync(file, "utf8");
    idsCache.set(file, new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}
// The file a site path serves, as GitHub Pages would.
function target(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const p = path.join(SITE, clean);
  if (clean.endsWith("/")) return path.join(p, "index.html");
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(path.join(p, "index.html"))) return path.join(p, "index.html");
  if (existsSync(`${p}.html`)) return `${p}.html`;
  return null;
}

const externals = new Map();
let internalCount = 0;
function checkRef(file, ref, pagePath) {
  if (!ref || /^(mailto|tel|data):/i.test(ref)) return;
  let url;
  try {
    url = new URL(ref, `${ORIGIN}${pagePath}`);
  } catch {
    problem(`${rel(file)}: unreadable URL ${ref}`);
    return;
  }
  if (url.origin !== ORIGIN) {
    if (!externals.has(url.href)) externals.set(url.href, rel(file));
    return;
  }
  internalCount++;
  const dest = target(url.pathname);
  if (!dest) return problem(`${rel(file)}: broken link ${ref}`);
  if (url.hash && dest.endsWith(".html") && !idsOf(dest).has(decodeURIComponent(url.hash.slice(1)))) {
    problem(`${rel(file)}: missing fragment ${ref}`);
  }
}

for (const file of pages) {
  const text = readFileSync(file, "utf8");
  let pagePath = `/${rel(file).split(path.sep).join("/")}`.replace(/index\.html$/, "");
  for (const m of text.matchAll(/\s(?:href|src)="([^"]*)"/g)) checkRef(file, m[1], pagePath);
  for (const m of text.matchAll(/\ssrcset="([^"]*)"/g)) for (const part of m[1].split(",")) checkRef(file, part.trim().split(/\s+/)[0], pagePath);
  for (const m of text.matchAll(/<meta\s+property="og:(?:image|url)"\s+content="([^"]*)"/g)) checkRef(file, m[1], pagePath);
  if (/\shref=""/.test(text)) problem(`${rel(file)}: an empty href`);
}
for (const file of files.filter((f) => f.endsWith(".css"))) {
  const text = readFileSync(file, "utf8");
  const pagePath = `/${rel(file).split(path.sep).join("/")}`;
  for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) if (!m[1].startsWith("#")) checkRef(file, m[1], pagePath);
}

// ---------- Contrast ----------
const schemes = [
  ["light", false, 0],
  ["dark", true, 0],
  ["light high contrast", false, 0.5],
  ["dark high contrast", true, 0.5],
];
const lowest = [];
for (const [label, isDark, level] of schemes) {
  const r = roles(isDark, { contrast: level });
  let min = Infinity;
  let minPair = "";
  const test = (fg, bg, name) => {
    const ratio = contrast(fg, bg);
    if (ratio < min) [min, minPair] = [ratio, name];
    if (ratio < 4.5) problem(`contrast ${label}: ${name} is ${ratio.toFixed(2)}:1, below 4.5:1`);
  };
  for (const [fg, bg] of TEXT_PAIRS) test(r[fg], r[bg], `${fg} on ${bg}`);
  lowest.push(`${label}: lowest ${min.toFixed(2)}:1 (${minPair})`);
}

// ---------- External links ----------
const externalResults = [];
if (EXTERNAL) {
  const results = await Promise.all(
    [...externals.keys()].map(async (href) => {
      const get = (method) =>
        fetch(href, { method, redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "User-Agent": "mobilyenterprises-website-link-check" } });
      try {
        let res = await get("HEAD");
        if (res.status >= 400) res = await get("GET");
        return [href, res.status];
      } catch (error) {
        return [href, `error: ${error.cause?.code ?? error.message}`];
      }
    }),
  );
  for (const [href, status] of results) {
    externalResults.push(`${status} ${href}`);
    if (typeof status !== "number" || status >= 400) problem(`external link ${href} (on ${externals.get(href)}) answered ${status}`);
  }
}

// ---------- Report ----------
console.log(`Checked ${files.length} files, ${pages.length} pages.`);
console.log(`Scripts: ${scriptCount} <script> element(s), all ${jsonLdCount} JSON-LD data; executable scripts: ${scriptCount - jsonLdCount}.`);
console.log(`Links: ${internalCount} internal references checked; ${externals.size} external links${EXTERNAL ? " fetched" : " (not fetched; use --external)"}.`);
for (const line of externalResults.sort()) console.log(`  ${line}`);
console.log("Contrast (WCAG AA needs 4.5:1):");
for (const line of lowest) console.log(`  ${line}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("All checks passed.");
