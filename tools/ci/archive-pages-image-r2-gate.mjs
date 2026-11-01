#!/usr/bin/env node
// Ordering gate between the R2 image copy (.github/workflows/r2-archive-assets-copy.yml) and the student Pages release
// (.github/workflows/archive-pages-release.yml, step `image_order`).
//
// The Pages package no longer carries archive/assets/images: exam images are loaded from Cloudflare R2
// (https://img.wangjiedu.com/exams/images/<key>, archive/archive-asset-base.js). A new exam's images are copied to R2 by
// a separate workflow that starts on the same push, so the student site must not go live until every image it can
// reference is already on R2. Otherwise students would see broken figures (the same-origin fallback has nothing to load).
//
// What it does:
//   1. release range = latest successful github-pages deployment .. HEAD (same base as worker_order); fallback
//      --fallback-base (the push's `before` SHA). The images added, copied, modified or renamed in that range
//      (git diff --diff-filter=ACMR, deletions are ignored) are the ones to verify.
//      Base unknown or not in the checkout => uncertain: verify EVERY image in HEAD (fail closed, never skip).
//   2. HEAD-request each one on the R2 host (200 = present). 404/403/5xx/network errors are "not yet".
//   3. Retry the missing ones every --interval-seconds up to --timeout-minutes (R2 copy still running), then fail.
//      A failed step keeps the previously published (verified) site live; Git main is not affected.
//   With no image change the gate passes at once without any network request.
//
//   GITHUB_TOKEN=... GITHUB_REPOSITORY=o/r node tools/ci/archive-pages-image-r2-gate.mjs \
//     [--image-prefix archive/assets/images] [--r2-base https://img.wangjiedu.com] [--fallback-base <sha>] \
//     [--timeout-minutes 14] [--interval-seconds 30] [--concurrency 16] [--all] [--evidence-file <path>] [--summary-file <md>]
//
// Presence only: the gate does not compare bytes. Changed files keep their R2 key, so a modified image that is already
// on R2 counts as present until the copy overwrites it (the copy runs on the same push; edge caching is not purged here).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { latestSuccessfulDeploymentSha, makeGet } from "./archive-pages-deploy-needed.mjs";

export const DEFAULT_IMAGE_PREFIX = "archive/assets/images";
export const DEFAULT_R2_BASE = "https://img.wangjiedu.com";
export const R2_KEY_PREFIX = "exams/images/";
const ZERO_SHA = /^0{40}$/;

// "archive/assets/images/<folder>/<file>" -> "https://img.wangjiedu.com/exams/images/<encoded folder>/<encoded file>"
// (the same mapping as resolveExamImageUrl in archive/archive-asset-base.js and the R2 copy's rclone destination).
export function r2UrlFor(file, { prefix = DEFAULT_IMAGE_PREFIX, r2Base = DEFAULT_R2_BASE } = {}) {
  const head = `${prefix.replace(/\/+$/, "")}/`;
  const normalized = String(file).replace(/\\/g, "/");
  if (!normalized.startsWith(head)) throw new Error(`not under ${head}: ${file}`);
  const key = normalized.slice(head.length);
  const parts = key.split("/");
  if (!key || parts.some(part => !part || part === "." || part === "..")) throw new Error(`unsafe image path: ${file}`);
  return `${r2Base.replace(/\/+$/, "")}/${R2_KEY_PREFIX}${parts.map(encodeURIComponent).join("/")}`;
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}
const splitZ = out => out.split("\0").filter(Boolean);

// Images touched in base..head (ACMR). { ok:false } when the range cannot be read (unknown or unreachable base).
export function gitChangedImages({ base, head = "HEAD", prefix = DEFAULT_IMAGE_PREFIX, cwd = process.cwd() }) {
  try {
    git(["cat-file", "-e", `${base}^{commit}`], cwd);
    const out = git(["diff", "--name-only", "-z", "--diff-filter=ACMR", `${base}`, head, "--", prefix], cwd);
    return { ok: true, files: splitZ(out).sort() };
  } catch (error) {
    return { ok: false, files: [], error: String(error.stderr || error.message || error).trim().slice(0, 200) };
  }
}

// Every image file of `head` (used when the release range is unknown).
export function gitAllImages({ head = "HEAD", prefix = DEFAULT_IMAGE_PREFIX, cwd = process.cwd() }) {
  try {
    return { ok: true, files: splitZ(git(["ls-tree", "-r", "-z", "--name-only", head, "--", prefix], cwd)).sort() };
  } catch (error) {
    return { ok: false, files: [], error: String(error.stderr || error.message || error).trim().slice(0, 200) };
  }
}

// Decides WHICH images must be on R2 before this release may deploy.
//   bases: candidate base SHAs in priority order (latest deployed SHA, push `before`); null/empty/zero entries are ignored.
//   changedSince(base) -> { ok, files };  all() -> { ok, files }
export function planImageCheck({ bases = [], changedSince, all, forceAll = false }) {
  if (forceAll) {
    const whole = all();
    return whole.ok
      ? { files: whole.files, uncertain: false, reason: `--all: verifying every image in HEAD (${whole.files.length})` }
      : { files: [], failed: true, uncertain: true, reason: `image list unreadable (${whole.error || "unknown"}); refusing to assume R2 is complete` };
  }
  for (const base of bases) {
    if (!base || ZERO_SHA.test(base)) continue;
    const result = changedSince(base);
    if (result.ok) {
      return {
        files: result.files, uncertain: false, base,
        reason: result.files.length
          ? `release range ${base.slice(0, 12)}..HEAD adds or changes ${result.files.length} exam image(s)`
          : `release range ${base.slice(0, 12)}..HEAD changes no exam image`
      };
    }
  }
  const whole = all();
  if (!whole.ok) return { files: [], failed: true, uncertain: true, reason: `release range unknown and the image list is unreadable (${whole.error || "unknown"}); refusing to assume R2 is complete` };
  return { files: whole.files, uncertain: true, reason: `release range unknown (no usable deployed SHA); verifying every exam image in HEAD (${whole.files.length})` };
}

// One HEAD request. "present" = HTTP 200. Anything else is "pending" (the copy may still be running) with a short reason.
export async function headCheck(url, { fetchImpl = fetch, timeoutMs = 20000 } = {}) {
  try {
    const response = await fetchImpl(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
    return response.status === 200 ? { present: true } : { present: false, detail: `HTTP ${response.status}` };
  } catch (error) {
    return { present: false, detail: `request failed: ${String(error?.cause?.code || error?.message || error).slice(0, 80)}` };
  }
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  const lanes = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, async () => {
    for (;;) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(lanes);
  return results;
}

// Bounded wait: checks `files` (repo paths) until all are present on R2 or the deadline passes.
// check(url) -> { present, detail }.  Returns { verdict: pass|timeout, checked, missing:[{file,url,detail}], rounds }.
export async function waitForImages({ files, urlFor, check, sleep, now, timeoutMs, intervalMs, concurrency = 16, log = () => {} }) {
  const deadline = now() + timeoutMs;
  let pending = files.map(file => ({ file, url: urlFor(file), detail: "not checked" }));
  let rounds = 0;
  for (;;) {
    rounds += 1;
    const results = await mapPool(pending, concurrency, async item => ({ item, result: await check(item.url) }));
    pending = results.filter(r => !r.result.present).map(r => ({ ...r.item, detail: r.result.detail || "missing" }));
    log(`round ${rounds}: ${files.length - pending.length}/${files.length} present on R2${pending.length ? `, ${pending.length} missing (e.g. ${pending[0].file}: ${pending[0].detail})` : ""}`);
    if (!pending.length) return { verdict: "pass", checked: files.length, missing: [], rounds };
    if (now() + intervalMs > deadline) return { verdict: "timeout", checked: files.length, missing: pending, rounds };
    await sleep(intervalMs);
  }
}

function parseArgs(argv) {
  const opt = {
    imagePrefix: DEFAULT_IMAGE_PREFIX, r2Base: DEFAULT_R2_BASE, fallbackBase: "", timeoutMinutes: 14, intervalSeconds: 30,
    concurrency: 16, all: false, evidenceFile: "", summaryFile: ""
  };
  const names = {
    "--image-prefix": "imagePrefix", "--r2-base": "r2Base", "--fallback-base": "fallbackBase", "--timeout-minutes": "timeoutMinutes",
    "--interval-seconds": "intervalSeconds", "--concurrency": "concurrency", "--evidence-file": "evidenceFile", "--summary-file": "summaryFile"
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--all") { opt.all = true; continue; }
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = ["timeoutMinutes", "intervalSeconds", "concurrency"].includes(key) ? Number(argv[i + 1]) : argv[i + 1];
    i += 1;
  }
  if (!(opt.timeoutMinutes > 0) || !(opt.intervalSeconds > 0) || !(opt.concurrency >= 1)) throw new Error("timeout, interval and concurrency must be positive numbers");
  return opt;
}

async function main() {
  const opt = parseArgs(process.argv.slice(2));
  const repo = process.env.GITHUB_REPOSITORY || "";
  const cwd = process.cwd();

  let deployed = null;
  if (!opt.all && repo && process.env.GITHUB_TOKEN) {
    const get = makeGet(process.env.GITHUB_TOKEN);
    for (let attempt = 1; attempt <= 3 && !deployed; attempt += 1) {
      try { deployed = await latestSuccessfulDeploymentSha(get, repo); }
      catch (error) { console.log(`deployed-SHA lookup attempt ${attempt} failed: ${String(error?.message || error).slice(0, 120)}`); if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt)); }
    }
  }
  const plan = planImageCheck({
    bases: [deployed, opt.fallbackBase], forceAll: opt.all,
    changedSince: base => gitChangedImages({ base, prefix: opt.imagePrefix, cwd }),
    all: () => gitAllImages({ prefix: opt.imagePrefix, cwd })
  });
  console.log(`image_order plan: images=${plan.files.length} uncertain=${Boolean(plan.uncertain)} (${plan.reason})`);

  const urlFor = file => r2UrlFor(file, { prefix: opt.imagePrefix, r2Base: opt.r2Base });
  let verdict = "IMAGE_ORDER_NOT_NEEDED", detail = plan.reason, failed = false;
  if (plan.failed) { verdict = "IMAGE_ORDER_FAIL"; failed = true; }
  else if (plan.files.length) {
    const result = await waitForImages({
      files: plan.files, urlFor, check: url => headCheck(url),
      sleep: ms => new Promise(r => setTimeout(r, ms)), now: Date.now,
      timeoutMs: opt.timeoutMinutes * 60000, intervalMs: opt.intervalSeconds * 1000, concurrency: opt.concurrency,
      log: m => console.log(`image_order ${m}`)
    });
    failed = result.verdict !== "pass";
    verdict = failed ? "IMAGE_ORDER_FAIL" : "IMAGE_ORDER_PASS";
    detail = failed
      ? `${plan.reason}. ${result.missing.length} of ${result.checked} still missing on ${opt.r2Base} after ${opt.timeoutMinutes} min: ${result.missing.slice(0, 5).map(m => `${m.file} (${m.detail})`).join("; ")}${result.missing.length > 5 ? "; ..." : ""}`
      : `${plan.reason}. All ${result.checked} are on ${opt.r2Base}`;
  }
  console.log(`${verdict}: ${detail}`);
  if (failed) {
    console.log(`::error title=Pages release waits for the R2 exam images::${detail}. The images must be on R2 before the student site goes live (Actions > R2 Archive Assets Copy > Run workflow on main, then re-run this release); the previously published student site stays live.`);
  }
  if (opt.evidenceFile) fs.appendFileSync(opt.evidenceFile, `image_order=${verdict}\n# ${detail}\n`);
  if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, `### R2 exam image ordering gate: ${verdict}\n\n${detail}\n\n`);
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.log(`::error title=Pages release waits for the R2 exam images::gate crashed: ${String(error?.message || error).slice(0, 200)}`);
    process.exit(1);
  });
}
