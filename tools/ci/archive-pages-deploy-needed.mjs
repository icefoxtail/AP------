#!/usr/bin/env node
// Compare effective student output on EVERY event. Commit subjects and unrelated main movement
// are not evidence that a package was published. A missing/unreadable receipt always requests checks.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { compareReleaseIdentity, computeReleaseIdentity, RELEASE_RECEIPT, validateReleaseIdentity } from "./archive-pages-release-identity.mjs";

// Kept for the independent APMS Worker and R2 ordering gates.
export async function latestSuccessfulDeploymentSha(get, repo, { readLive = readLiveReceipt,
  configuredURL = process.env.ARCHIVE_PAGES_RELEASE_RECEIPT_URL || "", allowLegacy = true } = {}) {
  try {
    const live = await readLive(receiptUrl({ repo, configured: configuredURL }));
    // The Actions deployment SHA can be the dispatch tip, not the registered checkout. Once a
    // receipt exists it is the only valid source of that exact deployed snapshot.
    return validateReleaseIdentity(live, { requireGate: true }) ? live.registeredMainSHA : null;
  } catch (error) {
    // A confirmed 404 is the pre-receipt deployment format. Timeout, malformed JSON and invalid
    // new receipts are unknown, never permission to use a possibly newer trigger SHA.
    if (error?.status !== 404) return null;
  }
  // R2 byte-identity validation cannot reuse a legacy presence-only image gate.
  // Keep the old deployment fallback available to the independent Worker gate.
  if (!allowLegacy) return null;
  const deployments = await get(`/repos/${repo}/deployments?environment=github-pages&per_page=20`);
  for (const d of (Array.isArray(deployments) ? deployments : []).slice(0, 10)) {
    const statuses = await get(`/repos/${repo}/deployments/${d.id}/statuses?per_page=1`);
    if (Array.isArray(statuses) && statuses[0] && statuses[0].state === "success") return d.sha;
  }
  return null;
}

export function makeGet(token) {
  return async route => {
    const res = await fetch(`https://api.github.com${route}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) throw new Error(`GET ${route.split("?")[0]} -> HTTP ${res.status}`);
    return res.json();
  };
}

export function receiptUrl({ repo, configured = "" }) {
  if (configured) {
    const parsed = new URL(configured);
    if (!["https:", "http:"].includes(parsed.protocol) || parsed.username || parsed.password)
      throw new Error("release receipt URL must be an HTTP(S) URL without credentials");
    return parsed.href;
  }
  const [owner, name, extra] = String(repo || "").split("/");
  if (!owner || !name || extra || !/^[a-z0-9_.-]+$/i.test(owner) || !/^[a-z0-9_.-]+$/i.test(name))
    throw new Error("GITHUB_REPOSITORY is missing or invalid");
  const sitePath = name.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "" : `${encodeURIComponent(name)}/`;
  return `https://${owner.toLowerCase()}.github.io/${sitePath}${RELEASE_RECEIPT}`;
}

export async function readLiveReceipt(url, { fetchImpl = fetch, timeoutMs = 20000 } = {}) {
  const response = await fetchImpl(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(timeoutMs) });
  if (response.status !== 200) {
    const error = new Error(`live release receipt HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const chunks = [];
  let bytes = 0;
  if (!response.body) throw new Error("live release receipt has no body");
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > 16384) throw new Error("live release receipt is unexpectedly large");
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function releaseAncestry({ candidateSHA, liveSHA, sourceRoot = process.cwd() }) {
  if (candidateSHA === liveSHA) return "equal";
  for (const sha of [candidateSHA, liveSHA]) execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], { cwd: sourceRoot, stdio: ["ignore", "pipe", "pipe"] });
  const ancestor = (before, after) => {
    try { execFileSync("git", ["merge-base", "--is-ancestor", before, after], { cwd: sourceRoot, stdio: ["ignore", "pipe", "pipe"] }); return true; }
    catch (error) { if (error.status === 1) return false; throw error; }
  };
  if (ancestor(candidateSHA, liveSHA)) return "superseded";
  if (ancestor(liveSHA, candidateSHA)) return "forward";
  return "diverged";
}

function unknownLiveIdentity({ candidate, fixedMainSHA, reason }) {
  const current = SHA.test(String(fixedMainSHA || "")) && candidate.registeredMainSHA === fixedMainSHA;
  return { needed: true, archiveNeeded: true, blocked: !current, status: current ? "VALIDATE" : "BLOCKED",
    reason: current
      ? `${reason}; candidate equals fixed fetched main ${fixedMainSHA}; full checks required, no validation result is reused`
      : `${reason}; registered ${candidate.registeredMainSHA} is not the fixed fetched main ${fixedMainSHA || "(unavailable)"}; refusing to replace a possibly newer student site` };
}

const SHA = /^[a-f0-9]{40}$/;

export async function decideDeployNeeded({ candidate, readLive, fixedMainSHA = "",
  compareSnapshots = ({ candidateSHA, liveSHA }) => candidateSHA === liveSHA ? "equal" : "unknown" }) {
  let live;
  try { live = await readLive(); }
  catch (error) {
    return unknownLiveIdentity({ candidate, fixedMainSHA,
      reason: `live identity unknown (${String(error?.message || error).slice(0, 160)})` });
  }
  if (!validateReleaseIdentity(live, { requireGate: true })) return unknownLiveIdentity({ candidate, fixedMainSHA,
    reason: "no valid successful live release receipt" });
  let relation;
  try { relation = compareSnapshots({ candidateSHA: candidate.registeredMainSHA, liveSHA: live.registeredMainSHA }); }
  catch (error) { relation = `unknown (${String(error.message || error).slice(0, 120)})`; }
  if (relation === "superseded") return { needed: false, archiveNeeded: true, blocked: false, status: "SUPERSEDED",
    reason: `SUPERSEDED: registered ${candidate.registeredMainSHA} is older than published ${live.registeredMainSHA}; no validation result is reused` };
  if (!["equal", "forward"].includes(relation)) return { needed: true, archiveNeeded: true, blocked: true, status: "BLOCKED",
    reason: `published registered SHA ancestry is ${relation}; refusing to replace a possibly newer student site` };
  const result = compareReleaseIdentity(candidate, live);
  return { ...result, blocked: false, status: result.needed ? "VALIDATE" : "NO_OP" };
}

function parseArgs(argv) {
  const names = { "--registered-main-sha": "registeredMainSHA", "--main-sha": "registeredMainSHA", "--identity-file": "identityFile",
    "--receipt-url": "receiptURL", "--root": "sourceRoot", "--manifest": "manifestPath" };
  const opt = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || !argv[i + 1]) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = argv[i + 1];
  }
  return opt;
}

// Unknown input, Git, network or parser state always means validation is needed. No event bypasses
// this content comparison, and an empty output must also default to true in the workflow.
export async function probe({ args = [], env = process.env, sourceRoot = process.cwd(),
  headSha = root => execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(),
  fetchedMainSha = root => execFileSync("git", ["rev-parse", "--verify", "refs/remotes/origin/main"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(),
  computeIdentity = computeReleaseIdentity, readLive = readLiveReceipt } = {}) {
  let candidate, fixedMainSHA = "";
  try {
    const opt = parseArgs(args);
    const root = path.resolve(opt.sourceRoot || sourceRoot);
    const registeredMainSHA = opt.registeredMainSHA || headSha(root);
    // Read the checkout's fetched ref exactly once. Never fetch moving main or
    // switch the package snapshot to answer whether an unknown live site is newer.
    try { fixedMainSHA = fetchedMainSha(root); } catch { fixedMainSHA = ""; }
    candidate = await computeIdentity({ sourceRoot: root, registeredMainSHA, ...(opt.manifestPath ? { manifestPath: opt.manifestPath } : {}) });
    if (opt.identityFile) {
      fs.mkdirSync(path.dirname(path.resolve(opt.identityFile)), { recursive: true });
      fs.writeFileSync(opt.identityFile, `${JSON.stringify(candidate)}\n`);
    }
    const url = receiptUrl({ repo: env.GITHUB_REPOSITORY, configured: opt.receiptURL || env.ARCHIVE_PAGES_RELEASE_RECEIPT_URL || "" });
    return await decideDeployNeeded({ candidate, fixedMainSHA, readLive: () => readLive(url),
      compareSnapshots: pair => releaseAncestry({ ...pair, sourceRoot: root }) });
  } catch (error) {
    if (candidate) return unknownLiveIdentity({ candidate, fixedMainSHA,
      reason: `probe crashed (${String(error?.message || error).slice(0, 160)})` });
    return { needed: true, archiveNeeded: true, blocked: false, status: "VALIDATE", reason: `probe crashed (${String(error?.message || error).slice(0, 160)}); checks required` };
  }
}

async function main() {
  const result = await probe({ args: process.argv.slice(2) });
  console.log(`needed=${result.needed} archive_needed=${result.archiveNeeded} status=${result.status} (${result.reason})`);
  try {
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
      `needed=${result.needed}\narchive_needed=${result.archiveNeeded}\nblocked=${result.blocked}\nstatus=${result.status}\nreason=${result.reason.replace(/[\r\n]/g, " ")}\n`);
  } catch (error) { console.error(`could not write GITHUB_OUTPUT: ${error?.message || error}`); }
  if (result.blocked) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(); } catch (error) { console.log(`needed=true archive_needed=true (probe crashed: ${String(error?.message || error).slice(0, 120)})`); }
}
