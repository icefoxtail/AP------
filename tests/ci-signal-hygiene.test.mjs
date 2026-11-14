import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { planCiRun } from "../tools/ci/ci-tip-plan.mjs";

// Ordinary CI uses the fixed event snapshot. The single writer validates each
// derived candidate before push; completion events must not re-test moving main.
const repo = fileURLToPath(new URL("..", import.meta.url));
const read = file => fs.readFileSync(path.join(repo, file), "utf8");
const ci = read(".github/workflows/ci.yml");
const TIP = "a".repeat(40);
const OLD = "b".repeat(40);
const PARENT = "c".repeat(40);
const eventFor = (name, base = OLD) => name === "pull_request"
  ? { pull_request: { base: { sha: base }, head: { sha: PARENT } } }
  : name === "push" ? { before: base, after: TIP } : { inputs: { base_sha: base } };

test("ordinary events bind the exact checkout and their own immutable base without API discovery", async () => {
  for (const eventName of ["push", "pull_request", "workflow_dispatch"]) {
    const event = eventFor(eventName);
    const options = { eventName, sha: TIP, event, get: () => { throw Error("no main or API lookup is allowed"); } };
    const result = await planCiRun(options);
    assert.deepEqual([result.run, result.checkoutRef, result.baseSha], [true, TIP, OLD]);
    // Old workflow_run fields and a later moving-main observation are not inputs.
    assert.deepEqual(await planCiRun({ ...options, runHeadSha: PARENT, latestMainSha: PARENT }), result);
    assert.deepEqual(event, eventFor(eventName), "planning does not rewrite the event");
  }
});

test("PR planning keeps the tested merge SHA rather than substituting its source head", async () => {
  const result = await planCiRun({ eventName: "pull_request", sha: TIP.toUpperCase(), event: eventFor("pull_request", OLD.toUpperCase()) });
  assert.equal(result.checkoutRef, TIP);
  assert.notEqual(result.checkoutRef, PARENT);
  assert.equal(result.baseSha, OLD);
});

test("retired workflow_run and unknown events fail instead of creating another main-tip verdict", async () => {
  for (const eventName of ["workflow_run", "schedule", "repository_dispatch", "", undefined]) {
    await assert.rejects(planCiRun({ eventName, sha: TIP, event: eventFor("push") }), /unsupported CI event/);
  }
});

test("missing or malformed checkout/base identities fail without a first-parent or latest-main fallback", async () => {
  for (const value of [undefined, "", "main", "origin/main", "0".repeat(40), "f".repeat(39), TIP + "\n", null]) {
    await assert.rejects(planCiRun({ eventName: "push", sha: value, event: eventFor("push") }), /CI checkout requires/);
    for (const eventName of ["push", "pull_request", "workflow_dispatch"]) {
      const event = eventFor(eventName, value === undefined ? "" : value);
      await assert.rejects(planCiRun({ eventName, sha: TIP, event }), /event base requires/);
    }
  }
  for (const event of [undefined, null, [], "not a payload"]) {
    await assert.rejects(planCiRun({ eventName: "push", sha: TIP, event }), /event payload/);
  }
});

function plannerFixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ci-fixed-plan-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const eventPath = path.join(dir, "event.json"), output = path.join(dir, "output"), summary = path.join(dir, "summary.md");
  const run = ({ event = eventFor("push"), eventName = "push", sha = TIP, extra = {}, raw } = {}) => {
    fs.writeFileSync(eventPath, raw ?? JSON.stringify(event));
    fs.rmSync(output, { force: true }); fs.rmSync(summary, { force: true });
    const result = spawnSync(process.execPath, [path.join(repo, "tools/ci/ci-tip-plan.mjs")], { cwd: dir, encoding: "utf8",
      env: { PATH: process.env.PATH, EVENT_NAME: eventName, GITHUB_SHA: sha, GITHUB_EVENT_PATH: eventPath,
        GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary, ...extra } });
    return { ...result, output: fs.existsSync(output) ? fs.readFileSync(output, "utf8") : "",
      summary: fs.existsSync(summary) ? fs.readFileSync(summary, "utf8") : "" };
  };
  return { run };
}

test("planner CLI emits fixed refs from the event file and supports GITHUB_EVENT_NAME without credentials", t => {
  const f = plannerFixture(t);
  const r = f.run({ event: eventFor("pull_request"), eventName: "", extra: { GITHUB_EVENT_NAME: "pull_request" } });
  assert.equal(r.status, 0, r.stderr);
  const plan = JSON.parse(r.stdout);
  assert.deepEqual([plan.run, plan.checkoutRef, plan.baseSha], [true, TIP, OLD]);
  assert.match(r.output, new RegExp(`^run=true\\ncheckout_ref=${TIP}\\nbase_sha=${OLD}\\nreason=`, "m"));
  assert.match(r.summary, /CI plan: fixed pull_request snapshot/);
  assert.equal(f.run({ extra: { GITHUB_EVENT_NAME: "workflow_run" } }).status, 0, "explicit EVENT_NAME takes precedence");
});

test("planner CLI publishes no success outputs for retired events, malformed JSON or unavailable identities", t => {
  const f = plannerFixture(t);
  for (const options of [{ eventName: "workflow_run" }, { raw: "{" }, { sha: "main" },
    { event: {} }, { extra: { GITHUB_EVENT_PATH: "" } }]) {
    const r = f.run(options);
    assert.notEqual(r.status, 0, JSON.stringify(options));
    assert.equal(r.output, ""); assert.equal(r.summary, "");
  }
});

test("ci.yml: fixed event planning retains check names and never starts a derived-tip workflow_run", () => {
  const header = ci.slice(0, ci.indexOf("\njobs:\n"));
  assert.doesNotMatch(header, /^\s+workflow_run:/m);
  assert.match(header, /group: .*github\.run_id/);
  assert.match(header, /\n  cancel-in-progress: false\n/);
  const planner = ci.slice(ci.indexOf("\n  plan:\n"), ci.indexOf("\n  test:\n"));
  assert.match(planner, /sparse-checkout: tools\/ci/);
  assert.match(planner, /persist-credentials: false/);
  const plannerRef = /^\s+ref: (.+)$/m.exec(planner)?.[1];
  assert.ok(plannerRef === undefined || plannerRef === "${{ github.sha }}", "planner comes from the fixed event checkout");
  assert.doesNotMatch(planner, /GITHUB_TOKEN:|GH_TOKEN:|WORKFLOW_RUN_HEAD_SHA:|actions: read/);
  for (const name of ["run", "checkout_ref", "base_sha"]) {
    assert.ok(planner.includes(`${name}: ` + '${{ steps.plan.outputs.' + name + ' }}'));
  }
  assert.match(ci, /needs: plan\n\s+if: needs\.plan\.outputs\.run == 'true'/);
  assert.match(ci, /ref: \$\{\{ needs\.plan\.outputs\.checkout_ref \}\}\n\s+fetch-depth: 0/);
  assert.doesNotMatch(ci, /ci-main-tip|PLAN_BASE_SHA|WORKFLOW_RUN_HEAD_SHA/);
});

test("ci.yml: scoped execution retains the existing blocking gates for their affected inputs", () => {
  for (const needle of [
    "node --check", "node tools/skills/verify-skills.mjs --json", "node --test tests/git-growth.test.mjs",
    "node --test tests/archive-cold-evidence.test.mjs tests/evidence-authority-v1.test.mjs tests/archive-analysis-recovery.test.mjs",
    "node tools/check-git-growth.mjs --base \"$base_ref\" --head HEAD", "run: node tools/run-tests.js", "timeout-minutes: 30"
  ]) assert.ok(ci.includes(needle), needle);
});

test("ci.yml: skills verification uses the exact PR event base while non-PR runs check their tested commit", () => {
  assert.match(ci, /PR_BASE_SHA: \$\{\{ github\.event\.pull_request\.base\.sha \}\}/);
  assert.match(ci, /node tools\/skills\/verify-skills\.mjs --json --upstream "\$PR_BASE_SHA"/);
  assert.match(ci, /node tools\/skills\/verify-skills\.mjs --json --upstream HEAD/);
  assert.doesNotMatch(ci, /git fetch --no-tags origin main/);
  assert.doesNotMatch(ci, /base_ref=origin\/main/);
});

test("Native registration keeps compiled-artifact isolation; Pages never regenerates shared outputs", () => {
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
  assert.doesNotMatch(release, /archive-pages-registration-derive\.sh|git commit|git push|reg_commit/);
  assert.match(release, /archive-registration-writer\.mjs --check/);
  assert.match(release, /build-archive2-catalog\.mjs --package-only/);
  const writer = read("tools/ci/archive-registration-writer.mjs");
  assert.match(writer, /specs\(root,'tools\/ci\/archive-pages-registration\.paths'\)/);
  assert.match(writer, /archive-pages-registration-derive\.sh','materialize'/);
  const pattern = glob => new RegExp('^' + glob.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  for (const file of [
    "archive/data/meta-foundation/compiled/curriculum_bindings.json",
    "archive/data/meta-foundation/canonical/registry_index.json",
    "archive/data/meta-foundation/evidence/geometry-equations/v1/promotion_receipt.json",
    "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json"
  ]) assert.ok(paths.some(entry => pattern(entry).test(file)), file);
  assert.equal(paths.some(entry => pattern(entry).test("archive/data/meta-foundation/canonical/packs/derivative/pack.json")), false,
    "canonical sources stay outside the shared output allowlist");
});

// ---- Run the real ordinary-event footprint shell against isolated Git history. -------------------------------
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
  return { shas, run, dir };
}

test("guard step: retired workflow_run and unknown events stop before any footprint claim", t => {
  const f = guardFixture(t);
  for (const eventName of ["workflow_run", "schedule", "repository_dispatch", ""]) {
    const r = f.run({ EVENT_NAME: eventName, PLAN_BASE_SHA: f.shas[0], BEFORE_SHA: f.shas[0],
      PR_BASE_SHA: f.shas[0], MANUAL_BASE_SHA: f.shas[0] });
    assert.equal(r.status, 2, r.stderr);
    assert.equal(r.args, null, "a retired event cannot be converted to a manual or first-parent audit");
  }
});

test("guard step: a PR audits its event base, independent of a later remote-main move", t => {
  const f = guardFixture(t);
  const r = f.run({ EVENT_NAME: "pull_request", PR_BASE_SHA: f.shas[0] });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.args, `--base ${f.shas[0]} --head HEAD`);
  for (const base of ['', 'origin/main', 'f'.repeat(40)]) {
    const invalid = f.run({ EVENT_NAME: "pull_request", PR_BASE_SHA: base });
    assert.notEqual(invalid.status, 0, base);
    assert.equal(invalid.args, null, "no audit can claim an unavailable event base");
  }
});

test("guard step: a PR whose event base is stale audits against the base tip its test-merge was built on", t => {
  const f = guardFixture(t);
  const git = (...args) => { const r = spawnSync("git", args, { cwd: f.dir, encoding: "utf8" }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  const [staleBase] = f.shas;
  git("switch", "-q", "-c", "pr"); fs.writeFileSync(path.join(f.dir, "pr.txt"), "pr"); git("add", "-A"); git("commit", "-q", "-m", "pr");
  const prHead = git("rev-parse", "HEAD");
  git("switch", "-q", "--detach", f.shas[2]);
  fs.writeFileSync(path.join(f.dir, "later-main.txt"), "main moved"); git("add", "-A"); git("commit", "-q", "-m", "main moved");
  const mainTip = git("rev-parse", "HEAD");
  git("merge", "-q", "--no-ff", "-m", "test merge", prHead);
  const r = f.run({ EVENT_NAME: "pull_request", PR_BASE_SHA: staleBase });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.args, `--base ${mainTip} --head HEAD`, "the stale PR_BASE_SHA must not decide the audited range");
  assert.notEqual(r.args, `--base ${staleBase} --head HEAD`);
});

test("skills: later unrelated main commits reproduce the old failure but do not invalidate the fixed PR base", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ci-skills-base-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => {
    const r = spawnSync('git', args, { cwd: dir, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true }); fs.writeFileSync(path.join(dir, file), text); };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid'); git('config', 'commit.gpgsign', 'false');
  write('tools/skills/verify-skills.mjs', read('tools/skills/verify-skills.mjs'));
  write('tools/skills/manifest.json', JSON.stringify({ schemaVersion: 1, source: 'repository', upstream: 'origin/main', canonicalRoots: ['.agents/skills'], skills: [
    { name: 'demo', path: '.agents/skills/demo', scope: 'fixture', status: 'active', requiredFiles: ['SKILL.md'] }
  ] }));
  write('.agents/skills/demo/SKILL.md', '---\nname: demo\ndescription: fixture\n---\n');
  git('add', '--', 'tools/skills', '.agents/skills'); git('commit', '-qm', 'base');
  const base = git('rev-parse', 'HEAD');
  git('switch', '-qc', 'pr'); write('source.js', 'void 0;\n'); git('add', '--', 'source.js'); git('commit', '-qm', 'PR');
  git('switch', '-q', 'main'); write('unrelated.txt', 'later merge'); git('add', '--', 'unrelated.txt'); git('commit', '-qm', 'main moved');
  const later = git('rev-parse', 'HEAD');
  git('update-ref', 'refs/remotes/origin/main', later); git('switch', '-q', 'pr');
  const verify = (...args) => spawnSync(process.execPath, ['tools/skills/verify-skills.mjs', '--json', ...args], { cwd: dir, encoding: 'utf8' });
  const moving = verify();
  assert.equal(moving.status, 1, moving.stdout); assert.match(moving.stdout, /branch does not contain the latest origin\/main/);
  const pinned = verify('--upstream', base);
  assert.equal(pinned.status, 0, pinned.stdout); assert.equal(JSON.parse(pinned.stdout).upstream.commit, base);
  assert.equal(verify('--upstream', later).status, 1, 'a base outside the checked snapshot still fails');
  write('.agents/skills/demo/SKILL.md', '---\nname: wrong\ndescription: broken fixture\n---\n');
  git('add', '--', '.agents/skills/demo/SKILL.md'); git('commit', '-qm', 'invalid skill');
  const invalid = verify('--upstream', base);
  assert.equal(invalid.status, 1, invalid.stdout); assert.match(invalid.stdout, /skill name mismatch/);
});

test("guard step: unusable fixed bases never fall back to the first parent or moving main", t => {
  const f = guardFixture(t);
  for (const eventName of ["pull_request", "push", "workflow_dispatch"]) {
    for (const base of ["", "not-a-sha", "0".repeat(40), "f".repeat(40)]) {
      const r = f.run({ EVENT_NAME: eventName, PR_BASE_SHA: base, BEFORE_SHA: base, MANUAL_BASE_SHA: base });
      assert.equal(r.status, 2, `${eventName} ${base}: ${r.stderr}`);
      assert.equal(r.args, null, "no complete event-bound audit can run without its base");
    }
  }
});

test("guard step: push / dispatch fail-closed semantics are unchanged", t => {
  const f = guardFixture(t);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: "0".repeat(40) }).status, 2);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: f.shas[0] }).args, `--base ${f.shas[0]} --head HEAD`);
  assert.equal(f.run({ EVENT_NAME: "workflow_dispatch", MANUAL_BASE_SHA: "" }).status, 2);
  assert.equal(f.run({ EVENT_NAME: "workflow_dispatch", MANUAL_BASE_SHA: f.shas[0] }).args, `--base ${f.shas[0]} --head HEAD`);
  assert.equal(f.run({ EVENT_NAME: "workflow_dispatch", MANUAL_BASE_SHA: f.shas[0], GITHUB_REF: "refs/heads/other" }).status, 2);
  assert.equal(f.run({ EVENT_NAME: "push", BEFORE_SHA: "e".repeat(40) }).status, 2, "an unavailable push base still refuses");
});

test("writer persistence runs the real candidate footprint command before the local-remote push", async t => {
  const workflow = read(".github/workflows/archive-main-auto-meta.yml");
  const step = workflow.split(/(?=^      - )/m).find(block => /^        id: persist$/m.test(block));
  assert.ok(step?.includes("        run: |\n"), "the writer persistence script must be present");
  const script = step.slice(step.indexOf("        run: |\n") + "        run: |\n".length)
    .split("\n").map(line => line.replace(/^ {10}/, "")).join("\n");
  for (const failure of [false, true]) {
    await t.test(failure ? "failed footprint refuses the push" : "successful footprint binds the candidate's parent and head", sub => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ci-writer-footprint-"));
      sub.after(() => fs.rmSync(dir, { recursive: true, force: true }));
      const runner = path.join(dir, "runner"), origin = path.join(dir, "origin.git"), work = path.join(dir, "writer-work");
      fs.mkdirSync(runner); fs.mkdirSync(work);
      const git = (cwd, ...args) => {
        const r = spawnSync("git", args, { cwd, encoding: "utf8" });
        assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
      };
      git(dir, "init", "-q", "--bare", "--initial-branch=main", origin);
      git(runner, "init", "-q", "--initial-branch=main");
      for (const [key, value] of [["user.name", "fixture"], ["user.email", "fixture@example.invalid"], ["commit.gpgsign", "false"]]) {
        git(runner, "config", key, value);
      }
      git(runner, "remote", "add", "origin", origin);
      fs.mkdirSync(path.join(runner, "tools/ci"), { recursive: true });
      fs.writeFileSync(path.join(runner, "tools/ci/git-push-derived-with-retry.mjs"), read("tools/ci/git-push-derived-with-retry.mjs"));
      // The real workflow and push helper call this probe. Size policy itself is
      // covered by git-growth.test.mjs; here the failure and exact range must reach the push gate.
      fs.writeFileSync(path.join(runner, "tools/check-git-growth.mjs"),
        "import fs from 'node:fs'; fs.writeFileSync(process.env.FOOTPRINT_TRACE, JSON.stringify(process.argv.slice(2))); process.exit(Number(process.env.FOOTPRINT_EXIT));\n");
      fs.writeFileSync(path.join(runner, "derived.json"), '{"version":0}\n');
      git(runner, "add", "-A"); git(runner, "commit", "-qm", "seed"); git(runner, "push", "-q", "origin", "HEAD:main");
      const base = git(runner, "rev-parse", "HEAD");
      fs.writeFileSync(path.join(runner, "derived.json"), '{"version":1}\n');
      fs.writeFileSync(path.join(work, "commit.paths"), "derived.json\n");
      const output = path.join(work, "outputs"), trace = path.join(work, "footprint.json");
      const result = spawnSync("bash", ["-c", script], { cwd: runner, encoding: "utf8", env: {
        PATH: process.env.PATH, WRITER_WORK_DIR: work, GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: path.join(work, "summary.md"),
        FOOTPRINT_TRACE: trace, FOOTPRINT_EXIT: failure ? "7" : "0"
      } });
      const candidate = git(runner, "rev-parse", "HEAD");
      assert.notEqual(candidate, base, "the helper created a candidate to verify");
      assert.deepEqual(JSON.parse(fs.readFileSync(trace, "utf8")), ["--base", base, "--head", candidate]);
      const published = git(origin, "rev-parse", "main"), outputs = fs.readFileSync(output, "utf8");
      assert.equal(result.status, failure ? 1 : 0, result.stdout + result.stderr);
      assert.equal(published, failure ? base : candidate);
      assert.ok(outputs.includes(`result=${failure ? "VERIFICATION_FAILED" : "PUSHED"}\n`));
      assert.ok(outputs.includes(`registered_sha=${failure ? "" : candidate}\n`));
    });
  }
});
