// The research diary's latest records, read at build time from its repository's `_research/`
// folder with the GitHub contents API. The site ships no JavaScript: the list is baked into the
// Research page when it is built. If the API can't be reached, or answers with anything unexpected,
// the build carries on with no records and the page shows only its "Read the research diary" button.
// DIARY_OFFLINE=1 skips the request (to build, or check, the fallback).
import { parse } from "yaml";
import site from "./site.js";

const API = "https://api.github.com/repos/mobily-enterprises/research-diary/contents/_research";
const RECORD = /^RD-\d{4}-\d{3}[a-z0-9-]*\.md$/i;
const LATEST = 6;
const RESULTS = { supported: "Supported", rejected: "Rejected", inconclusive: "Inconclusive" };

// Jekyll's default slug for a record's file name, as in the diary's /research/:name/ permalinks.
const slug = (name) =>
  name
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function getJson(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "mobilyenterprises-website-build",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.json();
}

function frontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) throw new Error("no front matter");
  return parse(m[1]) ?? {};
}

// The diary's projects, by the slug its records name.
const PROJECTS = {
  "agent-reliability": "Agent reliability",
  "file-city": "File City",
  "program-source": "Program source",
};

const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : "");

async function record(file) {
  const body = await getJson(file.url);
  if (body.encoding !== "base64" || typeof body.content !== "string") throw new Error(`${file.name}: no content`);
  const fm = frontMatter(Buffer.from(body.content, "base64").toString("utf8"));
  if (fm.example === true) return null;
  const title = str(fm.title);
  if (!title) return null;
  const project = str(fm.project);
  return {
    id: str(fm.id) || file.name.slice(0, 11).toUpperCase(),
    title,
    summary: str(fm.summary),
    project,
    projectLabel: PROJECTS[project] ?? "",
    result: RESULTS[str(fm.result).toLowerCase()] ?? "",
    date: str(fm.ended) || str(fm.started),
    url: new URL(`research/${slug(file.name)}/`, site.diaryUrl).href,
  };
}

export default async function () {
  if (process.env.DIARY_OFFLINE === "1") return { available: false, entries: [] };
  try {
    const list = await getJson(API);
    if (!Array.isArray(list)) throw new Error("the folder listing is not a list");
    const files = list
      .filter((f) => f && f.type === "file" && RECORD.test(f.name))
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, LATEST);
    const entries = (await Promise.all(files.map(record))).filter(Boolean);
    return { available: entries.length > 0, entries };
  } catch (error) {
    console.warn(`[diary] Building without the diary's records: ${error.message}`);
    return { available: false, entries: [] };
  }
}
