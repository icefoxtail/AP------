#!/usr/bin/env node
// Pushes generated ("derived") data to a shared branch without ever forcing, merging or rebasing.
//
// Single-writer rule: the derived paths (--paths-file) are written only by this registrar, and their content is a pure
// function of the inputs it computed them from. So when another commit moved the branch while we were computing,
// we do NOT compute again. If the competing range did not touch any derived path, we write the very same derived files
// as one new commit whose parent is the new tip (a fast-forward push) and the files keep the content that was
// computed and verified on our base. The derived state records which inputs each lane was proven for, so the next
// registration run, which every competing push already queued, sees the newer inputs as not yet registered and
// computes them from the latest main. Nothing is lost and nothing is computed twice.
// If the competing range DID touch a derived path, nothing is pushed: result HANDED_OVER, and the next run starts
// from the latest main.
//
// A candidate is always checked by --verify-command (DERIVED_BASE_SHA=<its parent>, DERIVED_HEAD_SHA=<candidate>)
// before it is pushed. If the competitor already published an identical tree, that is success without a commit.
//
//   node tools/ci/git-push-derived-with-retry.mjs --paths-file <file> --message <msg> [--remote origin] \
//     [--branch main] [--max-attempts 3] [--summary-file <md>] [--label <name>] \
//     [--verify-command "<candidate check before each push>"]
//
// --paths-file: git pathspecs relative to the repository root, one per line
//               ('#' comments and blank lines ignored). Only these are staged/cleaned.
// Environment: writes result/main_sha/registered_sha/attempts/overlaid to $GITHUB_OUTPUT when set. The caller
// configures git user.name/user.email. Run it from the repository root.
// main_sha is the observed remote tip; registered_sha is the exact verified tree's commit.
// They differ when another main commit lands after a successful push. Publish registered_sha only, and only
// after checking that its required proofs match its own tree (overlaid=true means the tree holds inputs newer
// than the ones the derived files were computed from).
// Success (exit 0): PUSHED (also when written onto a newer tip), ALREADY_CURRENT, ALREADY_REFLECTED.
// Failure (exit 1): PUSH_REJECTED (remote did not move), HANDED_OVER (a competing commit touched a derived path),
// RETRY_EXHAUSTED (the tip kept moving between our write and our push), READBACK_MISMATCH, FETCH_FAILED,
// COMMIT_FAILED, STAGE_FAILED, VERIFICATION_FAILED.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DEFAULT_ATTEMPTS = 3;
const HARD_CAP = 6;
const SUCCESS = new Set(["PUSHED", "ALREADY_CURRENT", "ALREADY_REFLECTED"]);

function parseArgs(argv) {
  const opt = { remote: "origin", branch: "main", maxAttempts: DEFAULT_ATTEMPTS, label: "derived data", verifyCommand: "", summaryFile: "", pathsFile: "", message: "" };
  const names = { "--paths-file": "pathsFile", "--message": "message", "--remote": "remote", "--branch": "branch",
    "--max-attempts": "maxAttempts", "--summary-file": "summaryFile", "--label": "label", "--verify-command": "verifyCommand" };
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = argv[i + 1];
  }
  opt.maxAttempts = Math.min(HARD_CAP, Math.max(1, Number.parseInt(opt.maxAttempts, 10) || DEFAULT_ATTEMPTS));
  if (!opt.pathsFile || !opt.message) throw new Error("--paths-file and --message are required");
  return opt;
}

export function pushDerivedWithRetry(opt, { cwd = process.cwd(), log = console.log } = {}) {
  const pathspecs = fs.readFileSync(opt.pathsFile, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));
  if (!pathspecs.length) throw new Error("paths file has no pathspecs");
  const remoteRef = `${opt.remote}/${opt.branch}`;
  const git = (args, extra = {}) => {
    const r = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, ...extra });
    return { status: r.status ?? 1, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim(), raw: r.stdout || "" };
  };
  const rev = ref => { const r = git(["rev-parse", "--verify", "--quiet", ref]); return r.status === 0 ? r.stdout : ""; };
  const isAncestor = (a, b) => git(["merge-base", "--is-ancestor", a, b]).status === 0;
  const fetch = () => git(["fetch", "--no-tags", opt.remote, `+refs/heads/${opt.branch}:refs/remotes/${remoteRef}`]);
  const attempts = [];
  const outcome = (result, extra = {}) => {
    const mainSha = extra.mainSha || rev(remoteRef) || rev("HEAD");
    return { result, ok: SUCCESS.has(result), attempts: attempts.length, mainSha, registeredSha: "", attemptLog: attempts, overlaid: attempts.some(a => a.overlaid), ...extra };
  };
  const competitor = () => {
    const r = git(["log", "-1", "--format=%h %an: %s", remoteRef]);
    return r.status === 0 ? r.stdout : "unknown";
  };

  while (true) {
    const attempt = { n: attempts.length + 1, base: rev("HEAD"), pushed: "", remoteAfter: "", cause: "", overlaid: false };
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
      if (opt.verifyCommand) {
        const verified = spawnSync(opt.verifyCommand, { cwd, shell: true, stdio: "inherit",
          env: { ...process.env, DERIVED_BASE_SHA: attempt.base, DERIVED_HEAD_SHA: attempt.pushed } });
        attempt.verification = { base: attempt.base, head: attempt.pushed, exitCode: verified.status, signal: verified.signal };
        if ((verified.status ?? 1) !== 0) {
          attempt.cause = "candidate verification failed before push";
          return outcome("VERIFICATION_FAILED", { error: `verification command exited ${verified.status ?? verified.signal} for ${attempt.base}..${attempt.pushed}` });
        }
      }
      const push = git(["push", opt.remote, `HEAD:${opt.branch}`]); // never --force
      if (push.status === 0) {
        const fetched = fetch();
        if (fetched.status !== 0) return outcome("FETCH_FAILED", { error: fetched.stderr });
        const remote = rev(remoteRef);
        attempt.remoteAfter = remote;
        if (remote === attempt.pushed) {
          attempt.cause = attempt.overlaid ? "pushed on top of the newer tip" : "pushed";
          if (git(["diff", "--quiet", attempt.pushed, remote, "--", ...pathspecs]).status !== 0) return outcome("READBACK_MISMATCH", { error: "remote tip differs from pushed commit for the derived paths" });
          return outcome("PUSHED", { mainSha: remote, registeredSha: attempt.pushed });
        }
        if (isAncestor(attempt.pushed, remote)) {
          attempt.cause = "pushed; another writer advanced the branch afterwards";
          return outcome("PUSHED", { mainSha: remote, registeredSha: attempt.pushed, note: `pushed commit ${attempt.pushed} is an ancestor of remote tip ${remote}` });
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
      // Nothing of ours to write: the derived tree already equals our base. Whatever moved the branch is the next run's input.
      if (remote === attempt.base) { attempt.cause = "nothing to commit; local HEAD equals remote tip"; return outcome("ALREADY_CURRENT", { mainSha: remote, registeredSha: remote }); }
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
      return outcome("ALREADY_REFLECTED", { mainSha: remote, registeredSha: remote, treeSha: theirTree });
    }
    if (!staged) { // moved while we had nothing to write: nothing to hand over either, the next run reads the new tip
      git(["reset", "--hard", "-q", remoteRef]);
      return outcome("ALREADY_CURRENT", { mainSha: remote, registeredSha: attempt.base, note: "nothing to write; the branch moved on and the next run reads it" });
    }
    if (attempts.length >= opt.maxAttempts) return outcome("RETRY_EXHAUSTED", { competitor: competitor() });

    // Did the competing range touch anything this registrar owns?
    const owned = git(["diff", "--name-only", "--no-renames", "-z", attempt.base, remote, "--", ...pathspecs]);
    const touched = owned.raw.split("\0").filter(Boolean);
    if (owned.status !== 0) return outcome("FETCH_FAILED", { error: `cannot compare ${attempt.base}..${remote}: ${owned.stderr}` });
    if (touched.length) {
      attempt.cause += `${attempt.cause ? "; " : ""}a competing commit changed ${touched.length} registrar-owned path(s): ${touched.slice(0, 5).join(", ")}`;
      git(["reset", "--hard", "-q", remoteRef]);
      return outcome("HANDED_OVER", { competitor: competitor(), touched: touched.slice(0, 20) });
    }

    // Write the same derived files onto the new tip. Added and modified files take the exact blobs of our verified commit;
    // deleted files are removed. The competing range left every one of these paths as it was on our base.
    const changes = git(["diff", "--name-status", "--no-renames", "-z", attempt.base, attempt.pushed]).raw.split("\0").filter(Boolean);
    const writes = [], removes = [];
    for (let i = 0; i + 1 < changes.length; i += 2) (changes[i] === "D" ? removes : writes).push(changes[i + 1]);
    git(["reset", "--hard", "-q", remoteRef]);
    let failed = "";
    for (let i = 0; i < writes.length && !failed; i += 200) {
      const r = git(["--literal-pathspecs", "checkout", attempt.pushed, "--", ...writes.slice(i, i + 200)]);
      if (r.status !== 0) failed = r.stderr;
    }
    for (let i = 0; i < removes.length && !failed; i += 200) {
      const r = git(["--literal-pathspecs", "rm", "-q", "-f", "--ignore-unmatch", "--", ...removes.slice(i, i + 200)]);
      if (r.status !== 0) failed = r.stderr;
    }
    if (failed) { git(["reset", "--hard", "-q", remoteRef]); return outcome("STAGE_FAILED", { error: `writing the derived files onto ${remote}: ${failed}` }); }
    attempt.overlaid = true;
    attempt.cause += `${attempt.cause ? "; " : ""}competing range left every registrar-owned path alone, writing the same derived files onto the new tip`;
    log(`[${opt.label}] attempt ${attempt.n} lost the race to ${remote}; competing range touched no registrar-owned path, writing the verified derived files onto the new tip`);
    // The files are staged (as the loop expects); the next pass commits them on the new tip, verifies and pushes.
  }
}

const NEXT_ACTION = {
  HANDED_OVER: r => `Nothing was pushed. A commit that landed first changed registrar-owned paths (${(r.touched || []).slice(0, 3).join(", ") || "see attempt log"}), so this result is not written on top of it. The next registration run starts from the latest main and computes it; competing writer = ${r.competitor}.`,
  RETRY_EXHAUSTED: r => `Nothing was pushed; main moved again each time between writing and pushing. The next registration run starts from the latest main; competing writer = ${r.competitor}.`,
  PUSH_REJECTED: () => "The push was rejected although main did not move (permissions, branch protection or network). Fix the cause in the error above, then re-run this workflow via workflow_dispatch.",
  READBACK_MISMATCH: () => "The remote branch does not hold the pushed derived data; inspect the remote history, then re-run via workflow_dispatch.",
  FETCH_FAILED: () => "Could not fetch the remote branch; check network/credentials, then re-run via workflow_dispatch.",
  COMMIT_FAILED: () => "git commit failed; check that git user.name/user.email are configured before this step.",
  STAGE_FAILED: () => "git add failed for the derived pathspecs; check the paths file.",
  VERIFICATION_FAILED: () => "The candidate failed its pre-push technical check; no candidate was pushed in this attempt. Fix the reported defect, then re-run the workflow.",
};

export function renderSummary(opt, r) {
  const lines = [`### Derived data push: ${opt.label}`, "", `- result: **${r.result}**${r.ok ? "" : " (FAILED)"}`, `- attempts: ${r.attempts} of ${opt.maxAttempts}`];
  for (const a of r.attemptLog) lines.push(`- attempt ${a.n}: base \`${a.base || "-"}\`, pushed \`${a.pushed || "-"}\`, remote after \`${a.remoteAfter || "-"}\`, cause: ${a.cause || "-"}`);
  lines.push(`- final remote \`${opt.remote}/${opt.branch}\`: \`${r.mainSha || "-"}\``);
  if (r.registeredSha) lines.push(`- exact registered commit: \`${r.registeredSha}\``);
  if (r.overlaid) lines.push("- written onto a newer main tip: the derived files were computed on an older base; lanes whose inputs changed since are not registered yet and the next run computes them");
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
  try { opt = parseArgs(process.argv.slice(2)); } catch (error) { console.error(`${error.message}\nusage: git-push-derived-with-retry.mjs --paths-file <f> --message <m> [--verify-command <cmd>] [--remote origin] [--branch main] [--max-attempts 3] [--summary-file <md>] [--label <name>]`); process.exit(2); }
  let result;
  try { result = pushDerivedWithRetry(opt); } catch (error) { result = { result: "STAGE_FAILED", ok: false, attempts: 0, mainSha: "", registeredSha: "", attemptLog: [], overlaid: false, error: error.message }; }
  console.log(`[${opt.label}] result=${result.result} attempts=${result.attempts} main_sha=${result.mainSha} registered_sha=${result.registeredSha} overlaid=${result.overlaid}${result.error ? ` error=${result.error}` : ""}`);
  if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, renderSummary(opt, result), "utf8");
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `result=${result.result}\nmain_sha=${result.mainSha}\nregistered_sha=${result.registeredSha}\nattempts=${result.attempts}\noverlaid=${result.overlaid}\n`, "utf8");
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
