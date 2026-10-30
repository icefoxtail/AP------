import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Runs the real `reg_commit` step script of the Pages release workflow against a stub push helper and a
// throwaway git repo. A lost push race (RETRY_EXHAUSTED) or main moving after the push must not fail the
// required step (busy merge periods would otherwise freeze the student site); any other helper failure must.

const repo = fileURLToPath(new URL("..", import.meta.url));
const workflow = fs.readFileSync(path.join(repo, ".github/workflows/archive-pages-release.yml"), "utf8");
// Same step splitting as tests/archive-pages-release-gate.test.mjs (no YAML dependency in this repo).
const buildJob = workflow.slice(workflow.indexOf("\n  build:\n"), workflow.indexOf("\n  deploy:\n"));
const stepText = buildJob.split(/\n(?=      - )/).find(text => /^\s*(?:- )?id: reg_commit$/m.test(text));
function blockScript(text) {
  const lines = text.split("\n");
  const start = lines.findIndex(line => line === "        run: |");
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !line.startsWith("          ")) break;
    body.push(line.slice(10));
  }
  return body.join("\n");
}
const regCommit = stepText && {
  run: blockScript(stepText),
  continueOnError: /^ {8}continue-on-error: true$/m.test(stepText),
  condition: (/^ {8}if: (.+)$/m.exec(stepText) || [])[1] || ""
};

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}

function sandbox({ helperResult, helperExit, advanceRemote = false }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reg-commit-"));
  const remote = path.join(root, "remote.git");
  const work = path.join(root, "work");
  const evidence = path.join(root, "evidence");
  fs.mkdirSync(evidence);
  git(root, "init", "-q", "--bare", "-b", "main", remote);
  git(root, "init", "-q", "-b", "main", work);
  git(work, "config", "user.email", "t@example.invalid");
  git(work, "config", "user.name", "t");
  fs.writeFileSync(path.join(work, "a.txt"), "a\n");
  git(work, "add", "a.txt");
  git(work, "commit", "-q", "-m", "base");
  git(work, "remote", "add", "origin", remote);
  git(work, "push", "-q", "origin", "main");
  if (advanceRemote) {
    const other = path.join(root, "other");
    git(root, "clone", "-q", remote, other);
    git(other, "config", "user.email", "o@example.invalid");
    git(other, "config", "user.name", "o");
    fs.writeFileSync(path.join(other, "b.txt"), "b\n");
    git(other, "add", "b.txt");
    git(other, "commit", "-q", "-m", "competitor");
    git(other, "push", "-q", "origin", "main");
  }
  fs.mkdirSync(path.join(work, "tools/ci"), { recursive: true });
  fs.writeFileSync(path.join(work, "tools/ci/git-push-derived-with-retry.mjs"),
    `console.log("[Pages registration sync] result=${helperResult} attempts=3 main_sha=x");\nprocess.exit(${helperExit});\n`);
  const summary = path.join(root, "summary.md");
  const run = spawnSync("bash", ["-c", regCommit.run], {
    cwd: work, encoding: "utf8",
    env: { ...process.env, RELEASE_EVIDENCE_DIR: evidence, GITHUB_STEP_SUMMARY: summary, GITHUB_SHA: git(work, "rev-parse", "HEAD") }
  });
  const context = fs.existsSync(path.join(evidence, "context.txt")) ? fs.readFileSync(path.join(evidence, "context.txt"), "utf8") : "";
  fs.rmSync(root, { recursive: true, force: true });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr, context };
}

test("reg_commit step exists, is required-gated and still only runs on main pushes", () => {
  assert.ok(regCommit, "reg_commit step");
  assert.equal(regCommit.continueOnError, true);
  assert.match(regCommit.condition, /github\.event_name == 'push'/);
  assert.match(regCommit.run, /git-push-derived-with-retry\.mjs/);
});

test("a lost push race (RETRY_EXHAUSTED) is a warning, not a failure, and is recorded as deferred", () => {
  const r = sandbox({ helperResult: "RETRY_EXHAUSTED", helperExit: 1 });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /::warning title=Registration commit deferred::/);
  assert.match(r.context, /registration_commit=deferred_race/);
});

test("any other helper failure still fails the required step", () => {
  for (const result of ["REGENERATE_FAILED", "PUSH_REJECTED"]) {
    const r = sandbox({ helperResult: result, helperExit: 1 });
    assert.equal(r.status, 1, `${result} must fail`);
    assert.doesNotMatch(r.context, /deferred_race/);
  }
});

test("a successful push records the registration SHAs; main moving afterwards is only a warning", () => {
  const same = sandbox({ helperResult: "PUSHED", helperExit: 0 });
  assert.equal(same.status, 0, same.stderr);
  assert.match(same.context, /registration_commit_sha=/);
  assert.doesNotMatch(same.stdout, /::warning/);
  const moved = sandbox({ helperResult: "PUSHED", helperExit: 0, advanceRemote: true });
  assert.equal(moved.status, 0, moved.stderr);
  assert.match(moved.stdout, /::warning title=main advanced after registration::/);
  assert.match(moved.context, /registration_remote_main_sha=/);
});
