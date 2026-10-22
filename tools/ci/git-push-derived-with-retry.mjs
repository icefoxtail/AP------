#!/usr/bin/env node
// Pushes generated ("derived") data to a shared branch without ever forcing or merging.
//
// The derived files are a pure function of the checked-in inputs, so when another
// writer moved the branch first we do NOT rebase/merge our stale output: we reset to
// the new tip, re-run the caller's regenerate-and-validate command on that base, and
// push the fresh result (at most 3 attempts, hard cap). If the competitor already
// published an identical tree, that is success without any extra commit.
//
//   node tools/ci/git-push-derived-with-retry.mjs --paths-file <file> --message <msg> \
//     [--regenerate "<command run through the platform shell>"] [--remote origin] \
//     [--branch main] [--max-attempts 3] [--summary-file <md>] [--label <name>]
//
// --paths-file: git pathspecs relative to the repository root, one per line
//               ('#' comments and blank lines ignored). Only these are staged/cleaned.
// Environment: writes result/main_sha/attempts to $GITHUB_OUTPUT when set. The caller
// configures git user.name/user.email. Run it from the repository root.
// Success (exit 0): PUSHED (also after a successful retry), ALREADY_CURRENT, ALREADY_REFLECTED.
// Failure (exit 1): PUSH_REJECTED (remote did not move), REGENERATE_FAILED, RETRY_EXHAUSTED,
// READBACK_MISMATCH, FETCH_FAILED, COMMIT_FAILED, STAGE_FAILED, NO_REGENERATE.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HARD_CAP = 3;
const SUCCESS = new Set(["PUSHED", "ALREADY_CURRENT", "ALREADY_REFLECTED"]);

function parseArgs(argv) {
  const opt = { remote: "origin", branch: "main", maxAttempts: HARD_CAP, label: "derived data", regenerate: "", summaryFile: "", pathsFile: "", message: "" };
  const names = { "--paths-file": "pathsFile", "--regenerate": "regenerate", "--message": "message", "--remote": "remote", "--branch": "branch",
    "--max-attempts": "maxAttempts", "--summary-file": "summaryFile", "--label": "label" };
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = argv[i + 1];
  }
  opt.maxAttempts = Math.min(HARD_CAP, Math.max(1, Number.parseInt(opt.maxAttempts, 10) || HARD_CAP));
  if (!opt.pathsFile || !opt.message) throw new Error("--paths-file and --message are required");
  return opt;
}

export function pushDerivedWithRetry(opt, { cwd = process.cwd(), log = console.log } = {}) {
  const pathspecs = fs.readFileSync(opt.pathsFile, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));
  if (!pathspecs.length) throw new Error("paths file has no pathspecs");
  const remoteRef = `${opt.remote}/${opt.branch}`;
  const git = (args, extra = {}) => {
    const r = spawnSync("git", args, { cwd, encoding: "utf8", ...extra });
    return { status: r.status ?? 1, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
  };
  const rev = ref => { const r = git(["rev-parse", "--verify", "--quiet", ref]); return r.status === 0 ? r.stdout : ""; };
  const isAncestor = (a, b) => git(["merge-base", "--is-ancestor", a, b]).status === 0;
  const fetch = () => git(["fetch", "--no-tags", opt.remote, `+refs/heads/${opt.branch}:refs/remotes/${remoteRef}`]);
  const attempts = [];
  const outcome = (result, extra = {}) => {
    const mainSha = extra.mainSha || rev(remoteRef) || rev("HEAD");
    return { result, ok: SUCCESS.has(result), attempts: attempts.length, mainSha, attemptLog: attempts, ...extra };
  };
  const competitor = () => {
    const r = git(["log", "-1", "--format=%h %an: %s", remoteRef]);
    return r.status === 0 ? r.stdout : "unknown";
  };

  while (true) {
    const attempt = { n: attempts.length + 1, base: rev("HEAD"), pushed: "", remoteAfter: "", cause: "" };
    attempts.push(attempt);

    for (const spec of pathspecs) {
      const add = git(["add", "-A", "--", spec]);
      // A pathspec with no tracked/untracked match (e.g. an inbox directory that no longer exists) is not an error.
      if (add.status !== 0 && !/did not match any files/.test(add.stderr)) return outcome("STAGE_FAILED", { error: add.stderr });
    }
    const staged = git(["diff", "--cached", "--quiet"]).status !== 0;
    const fetchedBefore = !staged ? fetch() : null;
    if (fetchedBefore && fetchedBefore.status !== 0) return outcome("FETCH_FAILED", { error: fetchedBefore.stderr });

    if (staged) {
      const commit = git(["commit", "-q", "-m", opt.message]);
      if (commit.status !== 0) return outcome("COMMIT_FAILED", { error: commit.stderr || commit.stdout });
      attempt.pushed = rev("HEAD");
      const push = git(["push", opt.remote, `HEAD:${opt.branch}`]); // never --force
      if (push.status === 0) {
        const fetched = fetch();
        if (fetched.status !== 0) return outcome("FETCH_FAILED", { error: fetched.stderr });
        const remote = rev(remoteRef);
        attempt.remoteAfter = remote;
        if (remote === attempt.pushed) {
          attempt.cause = "pushed";
          if (git(["diff", "--quiet", attempt.pushed, remote, "--", ...pathspecs]).status !== 0) return outcome("READBACK_MISMATCH", { error: "remote tip differs from pushed commit for the derived paths" });
          return outcome("PUSHED", { mainSha: remote });
        }
        if (isAncestor(attempt.pushed, remote)) {
          attempt.cause = "pushed; another writer advanced the branch afterwards";
          return outcome("PUSHED", { mainSha: remote, note: `pushed commit ${attempt.pushed} is an ancestor of remote tip ${remote}` });
        }
        attempt.cause = "push reported success but the pushed commit is not on the remote branch";
        return outcome("READBACK_MISMATCH", { error: attempt.cause });
      }
      attempt.cause = `push rejected: ${push.stderr.split(/\r?\n/).filter(Boolean).slice(-8).join(" | ")}`;
      const fetched = fetch();
      if (fetched.status !== 0) return outcome("FETCH_FAILED", { error: `${attempt.cause}; fetch: ${fetched.stderr}` });
    }

    const remote = rev(remoteRef);
    attempt.remoteAfter = remote;
    if (!staged) {
      if (remote === attempt.base) { attempt.cause = "nothing to commit; local HEAD equals remote tip"; return outcome("ALREADY_CURRENT", { mainSha: remote }); }
      attempt.cause = "nothing to commit but the remote branch moved";
    }
    // Non-race failure: the remote did not move past our base, so retrying cannot help.
    const moved = remote !== attempt.base && !isAncestor(remote, attempt.base);
    if (!moved) return outcome("PUSH_REJECTED", { error: attempt.cause || "remote branch did not move past our base" });

    const ourTree = rev("HEAD^{tree}"), theirTree = rev(`${remoteRef}^{tree}`);
    if (ourTree && ourTree === theirTree) {
      git(["reset", "--hard", "-q", remoteRef]);
      attempt.cause += attempt.cause ? "; " : "";
      attempt.cause += "remote tip already contains an identical tree";
      return outcome("ALREADY_REFLECTED", { mainSha: remote, treeSha: theirTree });
    }
    if (attempts.length >= opt.maxAttempts) return outcome("RETRY_EXHAUSTED", { competitor: competitor() });
    if (!opt.regenerate) return outcome("NO_REGENERATE", { error: "branch moved and no --regenerate command was given", competitor: competitor() });

    git(["reset", "--hard", "-q", remoteRef]);
    for (const spec of pathspecs) git(["clean", "-fdq", "--", spec]); // stale untracked output only inside the pathspecs
    log(`[${opt.label}] attempt ${attempt.n} lost the race to ${remote}; regenerating on the new base`);
    const regenerate = spawnSync(opt.regenerate, { cwd, shell: true, stdio: "inherit" });
    if ((regenerate.status ?? 1) !== 0) {
      attempt.cause += "; regenerate failed on the new base";
      return outcome("REGENERATE_FAILED", { error: `regenerate command exited ${regenerate.status ?? regenerate.signal} on base ${remote}`, competitor: competitor() });
    }
  }
}

const NEXT_ACTION = {
  RETRY_EXHAUSTED: r => `Re-run this workflow via workflow_dispatch after main settles; competing writer = ${r.competitor}.`,
  PUSH_REJECTED: () => "The push was rejected although main did not move (permissions, branch protection or network). Fix the cause in the error above, then re-run this workflow via workflow_dispatch.",
  REGENERATE_FAILED: r => `Regeneration/validation failed on the new main base (${r.error}). Read the step log above, fix the input data it names, then re-run via workflow_dispatch. Competing writer = ${r.competitor}.`,
  NO_REGENERATE: r => `Main moved first and no regenerate command is configured; re-run via workflow_dispatch. Competing writer = ${r.competitor}.`,
  READBACK_MISMATCH: () => "The remote branch does not hold the pushed derived data; inspect the remote history, then re-run via workflow_dispatch.",
  FETCH_FAILED: () => "Could not fetch the remote branch; check network/credentials, then re-run via workflow_dispatch.",
  COMMIT_FAILED: () => "git commit failed; check that git user.name/user.email are configured before this step.",
  STAGE_FAILED: () => "git add failed for the derived pathspecs; check the paths file.",
};

export function renderSummary(opt, r) {
  const lines = [`### Derived data push: ${opt.label}`, "", `- result: **${r.result}**${r.ok ? "" : " (FAILED)"}`, `- attempts: ${r.attempts} of ${opt.maxAttempts}`];
  for (const a of r.attemptLog) lines.push(`- attempt ${a.n}: base \`${a.base || "-"}\`, pushed \`${a.pushed || "-"}\`, remote after \`${a.remoteAfter || "-"}\`, cause: ${a.cause || "-"}`);
  lines.push(`- final remote \`${opt.remote}/${opt.branch}\`: \`${r.mainSha || "-"}\``);
  if (r.note) lines.push(`- note: ${r.note}`);
  if (r.treeSha) lines.push(`- identical tree already on remote: \`${r.treeSha}\``);
  if (!r.ok) {
    if (r.error) lines.push(`- error: ${r.error}`);
    lines.push(`- next action: ${(NEXT_ACTION[r.result] || (() => "Inspect the step log, then re-run via workflow_dispatch."))(r)}`);
  }
  return lines.join("\n") + "\n";
}

function main() {
  let opt;
  try { opt = parseArgs(process.argv.slice(2)); } catch (error) { console.error(`${error.message}\nusage: git-push-derived-with-retry.mjs --paths-file <f> --message <m> [--regenerate <cmd>] [--remote origin] [--branch main] [--max-attempts 3] [--summary-file <md>] [--label <name>]`); process.exit(2); }
  let result;
  try { result = pushDerivedWithRetry(opt); } catch (error) { result = { result: "STAGE_FAILED", ok: false, attempts: 0, mainSha: "", attemptLog: [], error: error.message }; }
  console.log(`[${opt.label}] result=${result.result} attempts=${result.attempts} main_sha=${result.mainSha}${result.error ? ` error=${result.error}` : ""}`);
  if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, renderSummary(opt, result), "utf8");
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `result=${result.result}\nmain_sha=${result.mainSha}\nattempts=${result.attempts}\n`, "utf8");
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
