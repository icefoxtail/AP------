import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { globToRegExp, loadPatterns, pushTouchesPaths } from "../tools/ci/push-touches-paths.mjs";
import { nativeLanes, matches } from "../tools/ci/archive-registration-writer.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const triggerFile = path.join(repo, "tools/ci/archive-meta-register-trigger-paths.txt");
const read = rel => fs.readFileSync(path.join(repo, rel), "utf8");
const SCOPED = "archive/data/meta-foundation/exam-scoped/25_금당고_2학기_중간_고2_확률과통계.parent-links.json";
const entries = read("tools/ci/archive-meta-register-trigger-paths.txt").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));

test("the main writer receives every main push and retains all native reviewed input dependencies", () => {
  const yaml = read(".github/workflows/archive-main-auto-meta.yml");
  const push = /^  push:\n([\s\S]*?)(?=^  \S|^\S)/m.exec(yaml)?.[1];
  assert.ok(push, "the single main writer has a push entrypoint");
  assert.match(push, /branches: \[main\]/);
  assert.doesNotMatch(push, /paths(?:-ignore)?:/, "input fingerprints, not incomplete event filters, select native work");
  const reviewed = nativeLanes(repo).find(lane => lane.id === "reviewed");
  for (const entry of entries) {
    assert.ok(matches(entry.replaceAll("*", "request"), reviewed.inputs), `${entry} remains a reviewed lane dependency`);
  }
  const compatibility = read(".github/workflows/archive-reviewed-exam-meta-register.yml");
  assert.match(compatibility, /^on:\n  workflow_dispatch:\n/m);
  assert.doesNotMatch(compatibility, /^  (?:push|schedule|pull_request):/m);
  assert.match(compatibility, /gh workflow run archive-main-auto-meta\.yml/);
});

test("one writer retries the complete native transaction while Pages and compatibility dispatch do not write Git", () => {
  const register = read(".github/workflows/archive-main-auto-meta.yml");
  const compatibility = read(".github/workflows/archive-reviewed-exam-meta-register.yml");
  const pages = read(".github/workflows/archive-pages-release.yml");
  assert.equal((register.match(/node tools\/ci\/git-push-derived-with-retry\.mjs/g) || []).length, 1);
  assert.match(register, /--regenerate 'node tools\/ci\/archive-registration-writer\.mjs --work-dir "\$WRITER_WORK_DIR"'/);
  assert.doesNotMatch(register, /git push origin HEAD:main|--force|HEAD\^ HEAD/);
  for (const [name, text] of [["compatibility", compatibility], ["pages", pages]]) {
    assert.doesNotMatch(text, /git-push-derived-with-retry|git\s+(?:commit|push)\b|contents: write/, `${name} cannot persist shared registration output`);
    assert.doesNotMatch(text, /archive-pages-registration-derive\.sh|reviewed-meta-register-pass\.sh|archive\/build_db\.py/);
  }
  assert.deepEqual(nativeLanes(repo).find(lane => lane.id === "reviewed").commands,
    [{ program: "bash", args: ["tools/ci/reviewed-meta-register-pass.sh"], timeoutMs: 55 * 60000 }]);
});

test("the writer reuses preserved request copies for its final Consumer check before the atomic commit", t => {
  const pass = read("tools/ci/reviewed-meta-register-pass.sh");
  assert.ok(!pass.includes("verify-changed-uid-consumer-approval"), "the native per-request pass retains its isolation contract");
  assert.ok(pass.includes('work="$RUNNER_TEMP/archive-meta-register-pass"') && pass.includes('cp -- "$request" "$work/requests/'), "request copies are still saved for the later check");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "writer-request-copies-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const reviewed = nativeLanes(repo).find(lane => lane.id === "reviewed");
  const env = { RUNNER_TEMP: dir };
  assert.deepEqual(reviewed.finalCommands({ env }), [], "no invented request proof when the native pass has not run");
  fs.mkdirSync(path.join(dir, "archive-meta-register-pass/requests"), { recursive: true });
  fs.writeFileSync(path.join(dir, "archive-meta-register-pass/requests/fixture.json"), "{}\n");
  assert.equal(reviewed.alwaysFinal, true, "the final Consumer check cannot be omitted merely because this pass converged");
  assert.deepEqual(reviewed.finalCommands({ env }), [{ program: "bash", args: ["tools/ci/verify-registered-consumer-approval.sh"],
    env: { GITHUB_STEP_SUMMARY: "/dev/null" } }], "reuse the real gate without emitting its obsolete pre-commit registered SHA summary");
  const gate = read("tools/ci/verify-registered-consumer-approval.sh");
  for (const needle of ["archive-meta-register-pass/requests/*.json", "verify-changed-uid-consumer-approval.mjs", "--summary-file", "exit 1", "archive-meta-register-trigger-paths.txt"])
    assert.ok(gate.includes(needle), needle);
});

test("glob entries follow GitHub paths semantics ('*' never crosses '/')", () => {
  const re = globToRegExp(".archive-meta-register/inbox/*.json");
  assert.ok(re.test(".archive-meta-register/inbox/a.json"));
  assert.ok(!re.test(".archive-meta-register/inbox/sub/a.json"));
  assert.ok(!re.test(".archive-meta-register/inbox/a.txt"));
  assert.ok(!re.test("x.archive-meta-register/inbox/a.json"));
});

const push = commits => ({ before: "0".repeat(40), after: "1".repeat(40), commits });
const touches = (event, opts = {}) => pushTouchesPaths({ event, eventName: "push", patterns: loadPatterns(triggerFile, opts), ...opts, gitDiff: () => null });

test("push event detection uses the pushed commits, not HEAD^", () => {
  assert.equal(touches(push([{ added: [], modified: ["README.md"], removed: [] }])), false);
  assert.equal(touches(push([{ added: [".archive-meta-register/inbox/x.json"], modified: [], removed: [] }])), true);
  assert.equal(touches(push([{ added: [], modified: [SCOPED], removed: [] }])), true);
  assert.equal(touches(push([{ added: [], modified: [], removed: [SCOPED.normalize("NFD")] }])), true, "NFD/NFC file names compare equal");
  // Native literal-only scope detection excludes the request glob; inbox consumption has its own path.
  const inboxOnly = push([{ added: [".archive-meta-register/inbox/x.json"], modified: [], removed: [] }]);
  assert.equal(touches(inboxOnly, { literalOnly: true }), false);
  assert.equal(touches(push([{ added: [], modified: [SCOPED], removed: [] }]), { literalOnly: true }), true);
});

test("a possibly truncated or empty commit list falls back to git diff, then to the caller's safe default", () => {
  const many = push(Array.from({ length: 20 }, () => ({ added: [], modified: ["README.md"], removed: [] })));
  const opts = { patterns: loadPatterns(triggerFile), eventName: "push" };
  assert.equal(pushTouchesPaths({ event: many, ...opts, uncertain: true, gitDiff: () => null }), true, "register: assume scoped");
  assert.equal(pushTouchesPaths({ event: many, ...opts, uncertain: false, gitDiff: () => null }), false, "pages: do not defer on uncertainty");
  assert.equal(pushTouchesPaths({ event: many, ...opts, uncertain: false, gitDiff: () => [SCOPED] }), true, "diff proves a touch");
  assert.equal(pushTouchesPaths({ event: many, ...opts, uncertain: true, gitDiff: () => ["README.md"] }), false, "diff proves no touch");
  assert.equal(pushTouchesPaths({ event: push([]), ...opts, uncertain: true, gitDiff: () => null }), true);
  assert.equal(pushTouchesPaths({ event: null, eventName: "workflow_run", patterns: opts.patterns, nonPush: false }), false);
  assert.equal(pushTouchesPaths({ event: null, eventName: "workflow_run", patterns: opts.patterns, nonPush: true }), true);
});

test("CLI reads GITHUB_EVENT_PATH and prints true/false", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "push-paths-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const eventFile = path.join(dir, "event.json");
  const run = (event, name, extra = []) => {
    fs.writeFileSync(eventFile, JSON.stringify(event));
    const r = spawnSync(process.execPath, [path.join(repo, "tools/ci/push-touches-paths.mjs"), "--paths-file", triggerFile, ...extra],
      { encoding: "utf8", env: { ...process.env, GITHUB_EVENT_PATH: eventFile, GITHUB_EVENT_NAME: name } });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout.trim();
  };
  assert.equal(run(push([{ added: [], modified: [SCOPED], removed: [] }]), "push", ["--literal-only", "--uncertain", "true"]), "true");
  assert.equal(run(push([{ added: [], modified: ["README.md"], removed: [] }]), "push", ["--uncertain", "false"]), "false");
  assert.equal(run({}, "workflow_run", ["--uncertain", "true"]), "false");
});
