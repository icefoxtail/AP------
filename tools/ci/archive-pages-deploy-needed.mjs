#!/usr/bin/env node
// Self-heal probe for .github/workflows/archive-pages-release.yml (scheduled runs only).
//
// A cancelled or timed-out release run can leave main ahead of the live site (its `[skip ci]`
// registration commit is never deployed and nothing triggers a new run). A scheduled run asks this probe
// whether the latest successful github-pages deployment already serves main; if so the expensive
// build is skipped. Every other event (push, workflow_run, workflow_dispatch) always builds.
//
// The deployment API records the SHA that triggered the deploy, while the build job then pushes a
// `chore(archive): sync registration artifacts [skip ci]` commit on top and deploys that registered
// tree. So "deployed SHA is an ancestor of main and every commit after it is such a bot sync commit"
// also means the live site already serves main. Any doubt (API error, no deployment, other commits)
// answers needed=true: it is always safe to build, the release gate decides whether to deploy.
//
//   GITHUB_TOKEN=... GITHUB_REPOSITORY=o/r node tools/ci/archive-pages-deploy-needed.mjs [--main-sha <sha>]
// Writes needed=true|false and reason=... to $GITHUB_OUTPUT.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const SYNC_SUBJECT = /^chore\(archive\): sync registration artifacts \[skip ci\]/;
const BOT = "github-actions[bot]";

export async function latestSuccessfulDeploymentSha(get, repo) {
  const deployments = await get(`/repos/${repo}/deployments?environment=github-pages&per_page=20`);
  for (const d of (Array.isArray(deployments) ? deployments : []).slice(0, 10)) {
    const statuses = await get(`/repos/${repo}/deployments/${d.id}/statuses?per_page=1`);
    if (Array.isArray(statuses) && statuses[0] && statuses[0].state === "success") return d.sha;
  }
  return null;
}

export async function decideDeployNeeded({ get, repo, eventName, mainSha }) {
  if (eventName !== "schedule") return { needed: true, reason: `event ${eventName} always builds` };
  try {
    const deployedSha = await latestSuccessfulDeploymentSha(get, repo);
    if (!deployedSha) return { needed: true, reason: "no successful github-pages deployment found" };
    if (deployedSha === mainSha) return { needed: false, reason: `live site already serves main ${mainSha}` };
    const cmp = await get(`/repos/${repo}/compare/${deployedSha}...${mainSha}?per_page=100`);
    const commits = Array.isArray(cmp?.commits) ? cmp.commits : [];
    if (cmp?.status !== "ahead" || !commits.length || Number(cmp.total_commits) !== commits.length) {
      return { needed: true, reason: `deployed ${deployedSha} is not a fully listed ancestor of main (${cmp?.status || "unknown"})` };
    }
    const foreign = commits.filter(c => !(SYNC_SUBJECT.test(String(c.commit?.message || "").split("\n")[0]) && c.commit?.author?.name === BOT));
    if (foreign.length) return { needed: true, reason: `${foreign.length} commit(s) after deployed ${deployedSha} are not registration syncs` };
    return { needed: false, reason: `only registration sync commits follow deployed ${deployedSha}; main ${mainSha} is already served` };
  } catch (error) {
    return { needed: true, reason: `probe failed (${String(error.message || error).slice(0, 120)}); building to be safe` };
  }
}

function makeGet(token) {
  return async route => {
    const res = await fetch(`https://api.github.com${route}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) throw new Error(`GET ${route.split("?")[0]} -> HTTP ${res.status}`);
    return res.json();
  };
}

async function main() {
  const args = process.argv.slice(2);
  const mainSha = args[0] === "--main-sha" && args[1] ? args[1] : execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const result = await decideDeployNeeded({
    get: makeGet(process.env.GITHUB_TOKEN || ""), repo: process.env.GITHUB_REPOSITORY || "", eventName: process.env.GITHUB_EVENT_NAME || "", mainSha
  });
  console.log(`needed=${result.needed} (${result.reason})`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `needed=${result.needed}\nreason=${result.reason.replace(/[\r\n]/g, " ")}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
