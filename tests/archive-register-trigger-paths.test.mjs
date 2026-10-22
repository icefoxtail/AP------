import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { globToRegExp, loadPatterns, pushTouchesPaths } from "../tools/ci/push-touches-paths.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const triggerFile = path.join(repo, "tools/ci/archive-meta-register-trigger-paths.txt");
const read = rel => fs.readFileSync(path.join(repo, rel), "utf8");
const SCOPED = "archive/data/meta-foundation/exam-scoped/25_금당고_2학기_중간_고2_확률과통계.parent-links.json";
const entries = read("tools/ci/archive-meta-register-trigger-paths.txt").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));

test("the register workflow's on.push.paths is exactly the shared trigger path list", () => {
  const yaml = read(".github/workflows/archive-reviewed-exam-meta-register.yml");
  const block = /^ {4}paths:\n((?: {6}- .*\n)+)/m.exec(yaml);
  assert.ok(block, "on.push.paths block present");
  const declared = block[1].trim().split("\n").map(l => l.replace(/^ *- /, "").replace(/^"|"$/g, ""));
  assert.deepEqual(declared.sort(), [...entries].sort());
});

test("workflows route every main write through the race-safe helper and share one trigger list", () => {
  const register = read(".github/workflows/archive-reviewed-exam-meta-register.yml");
  const pages = read(".github/workflows/archive-pages-release.yml");
  for (const [name, text] of [["register", register], ["pages", pages]]) {
    assert.ok(text.includes("tools/ci/git-push-derived-with-retry.mjs"), `${name} uses the push helper`);
    assert.ok(!/git push origin HEAD:main/.test(text), `${name} has no bare git push`);
    assert.ok(!/--force|HEAD\^ HEAD/.test(text), `${name} neither forces nor reads HEAD^ of a moving checkout`);
    assert.ok(text.includes("tools/ci/push-touches-paths.mjs"), `${name} detects touched paths from the push event`);
    assert.ok(text.includes("archive-meta-register-trigger-paths.txt"), `${name} reads the shared trigger list`);
  }
  assert.ok(register.includes("bash tools/ci/reviewed-meta-register-pass.sh"), "retries re-run the full registration pass");
  assert.ok(pages.includes("tools/ci/archive-pages-registration-derive.sh all"), "Pages retries re-derive and re-verify");
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
  // The inbox glob is a trigger for Pages deferral but not a "scoped" input for the register workflow.
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
