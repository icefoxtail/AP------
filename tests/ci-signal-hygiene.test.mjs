import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { planCiRun, hasVerdictOrIsRunning, testJobRan } from "../tools/ci/ci-tip-plan.mjs";

// S16 - CI signal hygiene. These tests pin the behaviour that makes a red CI mean something:
//  * the untested tip of main (bot commit pushed with GITHUB_TOKEN, never triggers `push`) gets a CI run,
//  * that extra run is loop-free and never duplicates an existing verdict,
//  * the derived Meta Foundation artifacts are refreshed by the same pipeline that refreshes the receipts.
const repo = fileURLToPath(new URL("..", import.meta.url));
const read = file => fs.readFileSync(path.join(repo, file), "utf8");
const ci = read(".github/workflows/ci.yml");

const TIP = "a".repeat(40);
const OLD = "b".repeat(40);
const PARENT = "c".repeat(40);
const run = (id, over = {}) => ({ id, head_sha: TIP, status: "completed", conclusion: "success", event: "push", ...over });
const fakeGet = ({ tip = TIP, runs = [], jobs = {}, parent = PARENT, fail = null } = {}) => {
  const calls = [];
  const get = async route => {
    calls.push(route);
    if (fail && route.includes(fail)) throw new Error("GitHub 500 " + route);
    if (route.includes("/git/ref/heads/main")) return { object: { sha: tip } };
    if (route.includes("/actions/workflows/ci.yml/runs")) return { workflow_runs: runs };
    const jobsMatch = /\/actions\/runs\/(\d+)\/jobs/.exec(route);
    if (jobsMatch) return { jobs: jobs[jobsMatch[1]] || [] };
    if (route.includes("/commits/")) return { parents: [{ sha: parent }] };
    throw new Error("unexpected route " + route);
  };
  return { get, calls };
};
const plan = (fake, extra = {}) => planCiRun({ get: fake.get, repo: "o/r", eventName: "workflow_run", runHeadSha: OLD, currentRunId: "900", ...extra });

test("non-workflow_run events always run and override nothing", async () => {
  for (const eventName of ["push", "pull_request", "workflow_dispatch"]) {
    const fake = fakeGet();
    const result = await planCiRun({ get: fake.get, repo: "o/r", eventName, runHeadSha: "", currentRunId: "1" });
    assert.deepEqual([result.run, result.checkoutRef, result.baseSha], [true, "", ""]);
    assert.equal(fake.calls.length, 0, "no API traffic for normal events");
  }
});

test("the bot-committed tip has no CI run -> re-test it, auditing the commit range since the finished pipeline", async () => {
  const result = await plan(fakeGet({ runs: [] }));
  assert.equal(result.run, true);
  assert.equal(result.checkoutRef, TIP);
  assert.equal(result.baseSha, OLD);
});

test("a tip that already has a push verdict (success or failure) is not tested twice", async () => {
  for (const conclusion of ["success", "failure", "timed_out"]) {
    const result = await plan(fakeGet({ runs: [run(1, { conclusion })] }));
    assert.equal(result.run, false, conclusion);
  }
});

test("a queued or running CI run for the tip also counts (no duplicate, no loop)", async () => {
  for (const status of ["queued", "in_progress", "waiting", "pending"]) {
    const result = await plan(fakeGet({ runs: [run(1, { status, conclusion: null })] }));
    assert.equal(result.run, false, status);
  }
});

test("cancelled, skipped, stale and startup-failed runs never produced a verdict", async () => {
  for (const conclusion of ["cancelled", "skipped", "stale", "startup_failure", "neutral", null]) {
    const result = await plan(fakeGet({ runs: [run(1, { conclusion })] }));
    assert.equal(result.run, true, String(conclusion));
  }
});

test("the planning run itself and runs for other SHAs are ignored", async () => {
  const runs = [run(900, { status: "in_progress", conclusion: null }), run(2, { head_sha: OLD })];
  assert.equal((await plan(fakeGet({ runs }))).run, true);
});

test("a finished workflow_run CI run counts only when its test job really ran", async () => {
  const noop = run(5, { event: "workflow_run", conclusion: "success" });
  const skipped = fakeGet({ runs: [noop], jobs: { 5: [{ name: "plan", conclusion: "success" }, { name: "test", conclusion: "skipped" }] } });
  assert.equal((await plan(skipped)).run, true, "a green no-op run must not hide an untested tip");
  const tested = fakeGet({ runs: [noop], jobs: { 5: [{ name: "plan", conclusion: "success" }, { name: "test", conclusion: "failure" }] } });
  assert.equal((await plan(tested)).run, false, "a real re-test verdict (even red) is a verdict");
  assert.equal(await testJobRan(async () => ({ jobs: [] }), noop), false);
});

test("when the finished pipeline ran on the tip itself the footprint base is the tip's parent", async () => {
  const result = await plan(fakeGet(), { runHeadSha: TIP });
  assert.equal(result.run, true);
  assert.equal(result.baseSha, PARENT);
});

test("probe failures fail open: CI runs rather than silently skipping the only verdict", async () => {
  for (const fail of ["/git/ref/heads/main", "/actions/workflows/ci.yml/runs", "/commits/"]) {
    const result = await plan(fakeGet({ fail }), fail === "/commits/" ? { runHeadSha: TIP } : {});
    assert.equal(result.run, true, fail);
    assert.equal(result.checkoutRef, "");
  }
});

test("hasVerdictOrIsRunning is case-insensitive on SHAs and tolerates junk", async () => {
  assert.equal(await hasVerdictOrIsRunning([null, undefined, run(1, { head_sha: TIP.toUpperCase() })], { tipSha: TIP, currentRunId: "9" }), true);
  assert.equal(await hasVerdictOrIsRunning(undefined, { tipSha: TIP, currentRunId: "9" }), false);
});

test("ci.yml: loop-free workflow_run trigger, planned checkout, unique non-cancelling groups for normal events", () => {
  assert.match(ci, /workflow_run:\s*\n\s+workflows: \[Archive Pages Release, Archive Reviewed Exam Meta Register\]\s*\n\s+types: \[completed\]\s*\n\s+branches: \[main\]/);
  // CI must never be a trigger source of itself.
  assert.doesNotMatch(/workflows:\s*\[[^\]]*\bCI\b[^\]]*\]/.exec(ci)?.[0] || "", /\bCI\b/);
  assert.match(ci, /group: \$\{\{ github\.event_name == 'workflow_run' && 'ci-main-tip' \|\| format\('ci-\{0\}-\{1\}', github\.event_name, github\.run_id\) \}\}/);
  // A second workflow_run for the same tip must never cancel an in-flight re-test: the planner counts that run as
  // "the tip is being tested", so cancelling it could leave the tip untested.
  assert.match(ci, /\n  cancel-in-progress: false\n/);
  assert.doesNotMatch(ci, /cancel-in-progress: (?!false\b)/);
  assert.match(ci, /\n  plan:\n/);
  assert.match(ci, /needs: plan\n\s+if: needs\.plan\.outputs\.run == 'true'/);
  assert.match(ci, /ref: \$\{\{ needs\.plan\.outputs\.checkout_ref \}\}\n\s+fetch-depth: 0/);
  assert.match(ci, /PLAN_BASE_SHA: \$\{\{ needs\.plan\.outputs\.base_sha \}\}/);
  assert.match(ci, /github\.event_name == 'workflow_run'\n/);
});

test("ci.yml: the unchanged gates are still all present (no test, guard or step was removed)", () => {
  for (const needle of [
    "node --check", "node tools/skills/verify-skills.mjs --json", "node --test tests/git-growth.test.mjs",
    "node --test tests/archive-cold-evidence.test.mjs tests/evidence-authority-v1.test.mjs tests/archive-analysis-recovery.test.mjs",
    "node tools/check-git-growth.mjs --base \"$base_ref\" --head HEAD", "run: node tools/run-tests.js", "timeout-minutes: 10"
  ]) assert.ok(ci.includes(needle), needle);
});

test("ci.yml: skills verification on push / re-test compares with the tested commit, not a moving origin/main", () => {
  assert.match(ci, /\[\[ "\$EVENT_NAME" == "push" \|\| "\$EVENT_NAME" == "workflow_run" \|\| "\$EVENT_NAME" == "workflow_dispatch" \]\]/);
  assert.match(ci, /node tools\/skills\/verify-skills\.mjs --json --upstream HEAD/);
  // Pull requests keep the strict "contains latest origin/main" comparison.
  assert.match(ci, /else\n\s+node tools\/skills\/verify-skills\.mjs --json\n/);
});

test("Pages derive refreshes Meta Foundation compiled artifacts first, never blocking the release on a canonical defect", () => {
  const derive = read("tools/ci/archive-pages-registration-derive.sh");
  const order = [derive.indexOf("refresh_meta_foundation_compiled\n  node archive/tools/meta-foundation/materialize"),
    derive.indexOf("python archive/build_db.py")];
  assert.ok(order[0] > 0 && order[1] > order[0], "compile --write must run before the catalog / manifest / readiness rebuild");
  assert.match(derive, /compile-meta-foundation\.mjs --write/);
  assert.match(derive, /::warning title=Meta Foundation compile::/);
  assert.match(derive, /return 0\n\}/);
  const paths = read("tools/ci/archive-pages-registration.paths").split("\n").map(line => line.trim()).filter(Boolean);
  for (const entry of ["archive/data/meta-foundation/compiled/*.json", "archive/data/meta-foundation/canonical/registry_index.json",
    "archive/data/meta-foundation/evidence/geometry-equations/v1/*.json", "archive/data/meta-foundation/runtime/*.json"]) {
    assert.ok(paths.includes(entry), entry);
  }
  const release = read(".github/workflows/archive-pages-release.yml");
  const allowed = /allowed='([^']+)'/.exec(release)[1];
  const regex = new RegExp(allowed);
  for (const file of [
    "archive/data/meta-foundation/compiled/curriculum_bindings.json",
    "archive/data/meta-foundation/canonical/registry_index.json",
    "archive/data/meta-foundation/evidence/geometry-equations/v1/promotion_receipt.json",
    "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json"
  ]) assert.ok(regex.test(file), file);
  assert.equal(regex.test("archive/data/meta-foundation/canonical/packs/derivative/pack.json"), false, "canonical sources stay human-owned");
});

// ---- Guard changed Git objects: a transient planner failure must not be a false red -------------------------------
const guardStep = (() => {
  const from = ci.indexOf("      - name: Guard changed Git objects against footprint growth");
  const to = ci.indexOf("      - name: Run tests");
  const block = ci.slice(from, to);
  const run = block.slice(block.indexOf("        run: |\n") + "        run: |\n".length);
  return run.split("\n").map(line => line.replace(/^ {10}/, "")).join("\n");
})();

function guardFixture(t, commits = 3) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ci-guard-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => spawnSync("git", args, { cwd: dir, encoding: "utf8" });
  git("init", "-q", "--initial-branch=main");
  for (const [k, v] of [["user.name", "t"], ["user.email", "t@example.invalid"], ["commit.gpgsign", "false"]]) git("config", k, v);
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  fs.writeFileSync(path.join(dir, "tools/git-history-rewrite-policy.v1.json"), "{}\n");
  fs.writeFileSync(path.join(dir, "tools/check-git-growth.mjs"), "import fs from 'node:fs'; fs.writeFileSync('growth-args.txt', process.argv.slice(2).join(' '));\n");
  const shas = [];
  for (let i = 0; i < commits; i += 1) {
    fs.writeFileSync(path.join(dir, `f${i}.txt`), String(i));
    git("add", "-A"); git("commit", "-q", "-m", `c${i}`);
    shas.push(git("rev-parse", "HEAD").stdout.trim());
  }
  const run = env => {
    fs.rmSync(path.join(dir, "growth-args.txt"), { force: true });
    const r = spawnSync("bash", ["-c", guardStep], { cwd: dir, encoding: "utf8", env: { PATH: process.env.PATH, GITHUB_REF: "refs/heads/main", ...env } });
    return { ...r, args: fs.existsSync(path.join(dir, "growth-args.txt")) ? fs.readFileSync(path.join(dir, "growth-args.txt"), "utf8") : null };
  };
  return { shas, run };
}

test("guard step: workflow_run uses the planned base when it is a reachable commit", t => {
  const f = guardFixture(t);
  const r = f.run({ EVENT_NAME: "workflow_run", PLAN_BASE_SHA: f.shas[0] });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.args, `--base ${f.shas[0]} --head HEAD`);
});

test("guard step: workflow_run with an empty planned base (probe failed) falls back to the tip's first parent", t => {
  const f = guardFixture(t);
  const r = f.run({ EVENT_NAME: "workflow_run", PLAN_BASE_SHA: "" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.args, `--base ${f.shas[1]} --head HEAD`);
  assert.match(r.stdout, /::warning title=CI re-test footprint base::/);
});

test("guard step: a malformed or unreachable planned base also falls back to the first parent; a root tip stays fail-closed", t => {
  const f = guardFixture(t);
  for (const base of ["not-a-sha", "f".repeat(40)]) {
    const r = f.run({ EVENT_NAME: "workflow_run", PLAN_BASE_SHA: base });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.args, `--base ${f.shas[1]} --head HEAD`, base);
  }
  const root = guardFixture(t, 1);
  const r = root.run({ EVENT_NAME: "workflow_run", PLAN_BASE_SHA: "" });
  assert.equal(r.status, 2);
  assert.equal(r.args, null, "no audit ran");
  assert.match(r.stderr, /no usable footprint base SHA/);
});

test("guard step: push / dispatch fail-closed semantics are unchanged", t => {
  const f = guardFixture(t);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: "0".repeat(40) }).status, 2);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: f.shas[0] }).args, `--base ${f.shas[0]} --head HEAD`);
  assert.equal(f.run({ EVENT_NAME: "workflow_dispatch", MANUAL_BASE_SHA: "" }).status, 2);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: "e".repeat(40) }).status, 2, "an unavailable push base still refuses");
});
