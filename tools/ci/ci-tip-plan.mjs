#!/usr/bin/env node
// Plan job for .github/workflows/ci.yml (S16: CI signal hygiene).
//
// Why: derived registration data is committed to main by github-actions[bot] with GITHUB_TOKEN. GitHub never
// starts a `push` workflow for a GITHUB_TOKEN push, so the tip of main (the bot's fixed-up commit) was never
// tested while the human commit before it - carrying stale derived files - went red. A red CI then carried no
// signal. The `workflow_run` trigger of ci.yml (fired when Archive Pages Release / Archive Reviewed Exam Meta
// Register finish, i.e. right after the bot pushed) uses this planner to test exactly that untested tip.
//
// Decision for event `workflow_run`:
//   * tip = current main SHA (API).
//   * run=false when another CI run for that exact SHA already exists and is queued, running or finished
//     (success/failure/timed_out/...). Cancelled, skipped, stale and startup-failed runs do not count: they
//     never produced a verdict. This is what keeps the trigger loop-free and cheap: every normal push already
//     has its own push-event run, so the extra run only happens for tips that have no verdict.
//   * run=true otherwise; base = the SHA the finished workflow ran on (the footprint guard audits
//     base..tip, i.e. exactly the bot commit(s)); if that equals the tip, the tip's first parent.
// Probe failure: run=true with empty checkout_ref/base_sha; the workflow falls back to the tip's first parent
// as footprint base (see `Guard changed Git objects`), never to a red run for a transient API error.
// Any other event: run=true, nothing is overridden (checkout_ref and base_sha stay empty).
//
//   GITHUB_TOKEN=... GITHUB_REPOSITORY=o/r EVENT_NAME=workflow_run WORKFLOW_RUN_HEAD_SHA=<sha> \
//     node tools/ci/ci-tip-plan.mjs
// Writes run=true|false, checkout_ref, base_sha and reason to $GITHUB_OUTPUT. Probe failures fail open
// (run=true): running CI twice is harmless, silently skipping the only verdict for a tip is not.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const SHA = /^[0-9a-f]{40}$/i;
// A conclusion that is a verdict about the tip. Anything else (cancelled, skipped, stale, startup_failure,
// neutral, missing) left the tip untested.
const VERDICT_CONCLUSIONS = new Set(["success", "failure", "timed_out", "action_required"]);

// A completed run of event `workflow_run` is only a verdict when its `test` job really ran: when this planner
// decides "no run" the workflow still finishes green (plan succeeded, test skipped) and must not count.
export async function testJobRan(getJobs, run) {
  const listing = await getJobs(run);
  const job = (Array.isArray(listing?.jobs) ? listing.jobs : []).find(j => j.name === "test");
  return !!job && ["success", "failure", "timed_out"].includes(job.conclusion);
}

export async function hasVerdictOrIsRunning(runs, { tipSha, currentRunId, getJobs }) {
  for (const run of Array.isArray(runs) ? runs : []) {
    if (!run || String(run.id) === String(currentRunId)) continue;
    if (String(run.head_sha || "").toLowerCase() !== tipSha.toLowerCase()) continue;
    if (run.status && run.status !== "completed") return true;
    if (!VERDICT_CONCLUSIONS.has(run.conclusion)) continue;
    if (run.event !== "workflow_run") return true;
    if (await testJobRan(getJobs, run)) return true;
  }
  return false;
}

export async function planCiRun({ get, repo, eventName, runHeadSha, currentRunId }) {
  if (eventName !== "workflow_run") {
    return { run: true, checkoutRef: "", baseSha: "", reason: `event ${eventName} always runs` };
  }
  try {
    const ref = await get(`/repos/${repo}/git/ref/heads/main`);
    const tipSha = String(ref?.object?.sha || "");
    if (!SHA.test(tipSha)) throw new Error("main ref has no commit SHA");
    const listing = await get(`/repos/${repo}/actions/workflows/ci.yml/runs?head_sha=${tipSha}&per_page=50`);
    if (await hasVerdictOrIsRunning(listing?.workflow_runs, { tipSha, currentRunId, getJobs: run => get(`/repos/${repo}/actions/runs/${run.id}/jobs?per_page=30`) })) {
      return { run: false, checkoutRef: tipSha, baseSha: "", reason: `main tip ${tipSha} already has a CI run` };
    }
    let baseSha = SHA.test(String(runHeadSha || "")) ? String(runHeadSha) : "";
    if (!baseSha || baseSha.toLowerCase() === tipSha.toLowerCase()) {
      const commit = await get(`/repos/${repo}/commits/${tipSha}`);
      baseSha = String(commit?.parents?.[0]?.sha || "");
    }
    if (!SHA.test(baseSha)) throw new Error("no usable footprint base for the main tip");
    return { run: true, checkoutRef: tipSha, baseSha, reason: `main tip ${tipSha} has no CI verdict; auditing ${baseSha}..${tipSha}` };
  } catch (error) {
    // checkout_ref stays empty (the default ref of a workflow_run is the main tip) and base_sha stays empty: the
    // `Guard changed Git objects` step then falls back to the checked-out tip's first parent instead of failing.
    return { run: true, checkoutRef: "", baseSha: "", reason: `probe failed (${String(error.message || error).slice(0, 120)}); running CI to be safe` };
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  const get = async route => {
    const response = await fetch(`https://api.github.com${route}`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(30000)
    });
    if (!response.ok) throw new Error(`GitHub ${response.status} ${route}`);
    return response.json();
  };
  const plan = await planCiRun({
    get,
    repo,
    eventName: process.env.EVENT_NAME || "",
    runHeadSha: process.env.WORKFLOW_RUN_HEAD_SHA || "",
    currentRunId: process.env.GITHUB_RUN_ID || ""
  });
  console.log(JSON.stringify(plan));
  const lines = [
    `run=${plan.run}`,
    `checkout_ref=${plan.checkoutRef}`,
    `base_sha=${plan.baseSha}`,
    `reason=${plan.reason.replace(/[\r\n]+/g, " ")}`
  ];
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join("\n") + "\n");
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `CI plan: ${plan.reason}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
