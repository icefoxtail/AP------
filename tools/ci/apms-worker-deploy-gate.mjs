#!/usr/bin/env node
// Ordering gate between the APMS Worker deploy (.github/workflows/apms-worker-deploy.yml) and the student Pages
// release (.github/workflows/archive-pages-release.yml). Owner/orchestrator decision 2026-10-30: when a release
// changes a file the Worker bundles (e.g. the source-verification index rows the Worker reads), the Worker must
// be deployed BEFORE Pages publishes data from the same main commit, because an old Worker cannot read new rows.
//
// The release range is "latest successful github-pages deployment .. HEAD". When that range touches no
// Worker-bundled path (tools/ci/apms-worker-bundle-paths.txt) nothing waits. Otherwise the gate polls the
// Actions API (bounded) until an apms-worker-deploy run for a SHA that CONTAINS the newest Worker-touching
// commit has succeeded. A failed/cancelled run, or no success before the deadline, fails the gate so the
// Pages deploy job never runs and the existing good site stays live. Git main merges are not affected.
//
//   GITHUB_TOKEN=... GITHUB_REPOSITORY=o/r node tools/ci/apms-worker-deploy-gate.mjs \
//     [--paths-file tools/ci/apms-worker-bundle-paths.txt] [--timeout-minutes 14] [--interval-seconds 20] \
//     [--evidence-file <path>] [--summary-file <md>]
//
// "Contains" = the run SHA equals the newest Worker-touching commit or descends from it (GitHub compare API), so
// a newer successful run also satisfies an older commit that GitHub replaced in the pending-run queue.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { latestSuccessfulDeploymentSha, makeGet } from "./archive-pages-deploy-needed.mjs";

export const WORKER_DEPLOY_WORKFLOW = "apms-worker-deploy.yml";
const ACTIVE = new Set(["queued", "in_progress", "waiting", "pending", "requested"]);

export function loadPathspecs(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));
}

// Newest commit in base..HEAD (or in all of HEAD's history when base is null) that touches a Worker path.
// Returns { ok: true, sha: "" } when none does. A git failure (unknown base) is { ok: false }.
export function gitLastTouch({ base, pathspecs, cwd = process.cwd(), head = "HEAD" }) {
  try {
    const range = base ? `${base}..${head}` : head;
    const out = execFileSync("git", ["log", "-1", "--format=%H", range, "--", ...pathspecs.map(p => `:(glob)${p}`)],
      { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    return { ok: true, sha: out };
  } catch (error) {
    return { ok: false, sha: "", error: String(error.stderr || error.message || error).trim().slice(0, 200) };
  }
}

// Decides whether this release has to wait for a Worker deploy.
//   lastTouch(base|null) -> { ok, sha }.  Unknown/unreachable base => uncertain: fall back to the newest
//   Worker-touching commit in the whole history and wait for a deploy that contains it (fail closed).
export function planWorkerWait({ base, lastTouch }) {
  if (base) {
    const r = lastTouch(base);
    if (r.ok) {
      return r.sha
        ? { needed: true, uncertain: false, lastTouch: r.sha, reason: `release range ${base.slice(0, 12)}..HEAD changes Worker-bundled files (newest: ${r.sha.slice(0, 12)})` }
        : { needed: false, uncertain: false, lastTouch: "", reason: `release range ${base.slice(0, 12)}..HEAD changes no Worker-bundled file` };
    }
  }
  const whole = lastTouch(null);
  if (!whole.ok || !whole.sha) {
    return { needed: true, uncertain: true, lastTouch: "", reason: "release range unknown and Worker history unreadable; refusing to assume the Worker is current" };
  }
  return { needed: true, uncertain: true, lastTouch: whole.sha, reason: `release range unknown (no usable deployed SHA); requiring a Worker deploy that contains the newest Worker-touching commit ${whole.sha.slice(0, 12)}` };
}

// One look at the run list. runs: workflow_runs (any order). isAncestor(a, b): a is b or an ancestor of b.
export async function evaluateRuns({ runs, lastTouch, isAncestor }) {
  const candidates = [];
  for (const run of (Array.isArray(runs) ? runs : []).slice(0, 30)) {
    if (!run || !run.head_sha || (run.head_branch && run.head_branch !== "main")) continue;
    if (run.head_sha === lastTouch || await isAncestor(lastTouch, run.head_sha)) candidates.push(run);
  }
  const success = candidates.find(r => r.status === "completed" && r.conclusion === "success");
  if (success) return { verdict: "pass", run: success, detail: `Worker deploy run ${success.id} (${success.head_sha.slice(0, 12)}) succeeded` };
  const active = candidates.find(r => ACTIVE.has(r.status));
  if (active) return { verdict: "wait", run: active, detail: `Worker deploy run ${active.id} (${active.head_sha.slice(0, 12)}) is ${active.status}` };
  if (candidates.length) {
    const latest = [...candidates].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
    return { verdict: "fail", run: latest, detail: `Worker deploy run ${latest.id} (${latest.head_sha.slice(0, 12)}) ended ${latest.conclusion || latest.status}${latest.html_url ? ` - ${latest.html_url}` : ""}` };
  }
  return { verdict: "wait", run: null, detail: `no apms-worker-deploy run for a SHA containing ${lastTouch.slice(0, 12)} yet` };
}

// Bounded poll. Transient API errors are retried until the deadline. Returns { verdict: pass|fail|timeout, ... }.
export async function waitForWorkerDeploy({ lastTouch, listRuns, isAncestor, sleep, now, timeoutMs, intervalMs, log = () => {} }) {
  const deadline = now() + timeoutMs;
  let last = { detail: "not polled" };
  for (;;) {
    try {
      last = await evaluateRuns({ runs: await listRuns(), lastTouch, isAncestor });
      log(`${last.verdict}: ${last.detail}`);
      if (last.verdict === "pass" || last.verdict === "fail") return last;
    } catch (error) {
      last = { verdict: "wait", run: null, detail: `Actions API error: ${String(error?.message || error).slice(0, 160)}` };
      log(`wait: ${last.detail}`);
    }
    if (now() + intervalMs > deadline) return { ...last, verdict: "timeout", detail: `timed out after ${Math.round(timeoutMs / 60000)} min; last state: ${last.detail}` };
    await sleep(intervalMs);
  }
}

function makeApi(token, repo) {
  const get = makeGet(token);
  const cache = new Map();
  return {
    get,
    listRuns: () => get(`/repos/${repo}/actions/workflows/${WORKER_DEPLOY_WORKFLOW}/runs?branch=main&per_page=50`).then(r => r?.workflow_runs || []),
    isAncestor: async (a, b) => {
      if (a === b) return true;
      const key = `${a}...${b}`;
      if (!cache.has(key)) {
        const r = await get(`/repos/${repo}/compare/${a}...${b}?per_page=1`);
        cache.set(key, r?.status === "ahead" || r?.status === "identical");
      }
      return cache.get(key);
    }
  };
}

function parseArgs(argv) {
  const opt = { pathsFile: "tools/ci/apms-worker-bundle-paths.txt", timeoutMinutes: 14, intervalSeconds: 20, evidenceFile: "", summaryFile: "" };
  const names = { "--paths-file": "pathsFile", "--timeout-minutes": "timeoutMinutes", "--interval-seconds": "intervalSeconds", "--evidence-file": "evidenceFile", "--summary-file": "summaryFile" };
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = key.endsWith("Minutes") || key.endsWith("Seconds") ? Number(argv[i + 1]) : argv[i + 1];
  }
  if (!(opt.timeoutMinutes > 0) || !(opt.intervalSeconds > 0)) throw new Error("timeout and interval must be positive numbers");
  return opt;
}

async function main() {
  const opt = parseArgs(process.argv.slice(2));
  const repo = process.env.GITHUB_REPOSITORY || "";
  const api = makeApi(process.env.GITHUB_TOKEN || "", repo);
  const pathspecs = loadPathspecs(opt.pathsFile);
  if (!pathspecs.length) throw new Error(`${opt.pathsFile} lists no paths; refusing to pass an empty gate`);

  let base = null;
  for (let attempt = 1; attempt <= 3 && !base; attempt++) {
    try { base = await latestSuccessfulDeploymentSha(api.get, repo); }
    catch (error) { console.log(`deployed-SHA lookup attempt ${attempt} failed: ${String(error?.message || error).slice(0, 120)}`); if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt)); }
  }
  const plan = planWorkerWait({ base, lastTouch: b => gitLastTouch({ base: b, pathspecs }) });
  console.log(`worker_order plan: needed=${plan.needed} uncertain=${plan.uncertain} (${plan.reason})`);

  let verdict = "WORKER_ORDER_NOT_NEEDED", detail = plan.reason, failed = false;
  if (plan.needed) {
    if (!plan.lastTouch) { verdict = "WORKER_ORDER_FAIL"; detail = plan.reason; failed = true; }
    else {
      const result = await waitForWorkerDeploy({
        lastTouch: plan.lastTouch, listRuns: api.listRuns, isAncestor: api.isAncestor,
        sleep: ms => new Promise(r => setTimeout(r, ms)), now: Date.now,
        timeoutMs: opt.timeoutMinutes * 60000, intervalMs: opt.intervalSeconds * 1000, log: m => console.log(`worker_order ${m}`)
      });
      failed = result.verdict !== "pass";
      verdict = failed ? "WORKER_ORDER_FAIL" : "WORKER_ORDER_PASS";
      detail = `${plan.reason}. ${result.detail}`;
    }
  }
  console.log(`${verdict}: ${detail}`);
  if (failed) {
    console.log(`::error title=Pages release waits for the APMS Worker::${detail}. The Worker must be deployed first (Actions > APMS Worker Deploy > Run workflow on main after fixing the cause); the previously published student site stays live.`);
  }
  if (opt.evidenceFile) fs.appendFileSync(opt.evidenceFile, `worker_order=${verdict}\n# ${detail}\n`);
  if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, `### APMS Worker ordering gate: ${verdict}\n\n${detail}\n\n`);
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.log(`::error title=Pages release waits for the APMS Worker::gate crashed: ${String(error?.message || error).slice(0, 200)}`);
    process.exit(1);
  });
}
