// S21: automatic, test-gated deploy of the APMS Worker + the Pages ordering gate.
// Structure tests read the real workflow files; the bundled-module set is recomputed with esbuild from the
// Worker's actual imports so the push filter / gate paths cannot drift from what wrangler bundles.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  evaluateRuns, gitLastTouch, loadPathspecs, planWorkerWait, waitForWorkerDeploy, WORKER_DEPLOY_WORKFLOW
} from "../tools/ci/apms-worker-deploy-gate.mjs";
import { parseDeployInfo } from "../tools/ci/apms-worker-deploy-summary.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const read = rel => fs.readFileSync(path.join(repo, rel), "utf8");
const deploy = read(".github/workflows/apms-worker-deploy.yml");
const pages = read(".github/workflows/archive-pages-release.yml");
const testGate = read("tools/ci/apms-worker-test-gate.sh");
const pathsFile = path.join(repo, "tools/ci/apms-worker-bundle-paths.txt");
const WORKER_DIR = "apmath/worker-backup/worker";

// ---- bundled-module set, recomputed from the Worker's real import graph -----------------------------------------
async function bundledInputs() {
  const requireWorker = createRequire(path.join(repo, WORKER_DIR, "package.json"));
  const { build } = requireWorker("esbuild");
  const result = await build({
    absWorkingDir: path.join(repo, WORKER_DIR), entryPoints: [path.join(repo, WORKER_DIR, "index.js")], bundle: true, write: false, metafile: true, format: "esm",
    platform: "neutral", conditions: ["workerd", "worker", "browser"], packages: "external", external: ["cloudflare:*"], logLevel: "silent"
  });
  return Object.keys(result.metafile.inputs).map(f => path.relative(repo, path.resolve(repo, WORKER_DIR, f)).split(path.sep).join("/"));
}

const pushPaths = () => {
  const block = /\n {4}paths:\n((?: {6}- .+\n)+)/.exec(deploy);
  assert.ok(block, "push has a paths filter");
  return block[1].trim().split("\n").map(l => l.replace(/^\s*- /, "").replace(/^"|"$/g, ""));
};

test("path filters equal the modules wrangler really bundles (cannot drift)", async () => {
  const inputs = await bundledInputs();
  assert.ok(inputs.includes(`${WORKER_DIR}/index.js`) && inputs.length > 40, "the real import graph was bundled");
  const outside = inputs.filter(f => !f.startsWith("apmath/worker-backup/")).sort();
  assert.ok(outside.length >= 5 && outside.every(f => /^archive\/[^/]+\.js$/.test(f)), `shared modules are archive/*.js: ${outside}`);
  const listed = loadPathspecs(pathsFile);
  assert.deepEqual(listed.filter(p => p !== "apmath/worker-backup/**").sort(), outside, "gate paths file == bundled shared modules");
  assert.ok(listed.includes("apmath/worker-backup/**"), "the Worker directory itself is listed");
  assert.ok(inputs.filter(f => f.startsWith("apmath/worker-backup/")).every(f => f.startsWith(`${WORKER_DIR}/`)));
  assert.deepEqual([...pushPaths()].sort(), [".github/workflows/apms-worker-deploy.yml", ...listed].sort(), "push filter == gate paths + the workflow file");
  assert.ok(!listed.includes(".github/workflows/apms-worker-deploy.yml"), "editing only the deploy workflow never holds back Pages");
  for (const f of outside) assert.ok(fs.existsSync(path.join(repo, f)), `${f} exists`);
});

// ---- deploy workflow structure -----------------------------------------------------------------------------------
const stepsOf = text => text.slice(text.indexOf("\n    steps:\n")).split(/\n(?=      - )/).slice(1).map(t => ({
  text: t,
  name: (/name: (.+)/.exec(t) || [])[1] || (/uses: (\S+)/.exec(t) || [])[1] || ""
}));

test("deploy workflow: triggers, permissions, concurrency, main-only", () => {
  const head = deploy.slice(deploy.indexOf("\non:\n"), deploy.indexOf("\njobs:\n"));
  assert.match(head, /\n {2}workflow_dispatch:\n/);
  assert.match(head, /\n {2}push:\n {4}branches: \[main\]\n {4}paths:/);
  for (const forbidden of ["pull_request", "schedule:", "workflow_run", "pull_request_target"]) assert.ok(!head.includes(forbidden), `no ${forbidden} trigger`);
  assert.match(head, /\npermissions:\n {2}contents: read\n/);
  assert.ok(!/(contents|actions|id-token|deployments|packages): write/.test(deploy), "no write permission");
  assert.match(deploy, /\nconcurrency:\n {2}group: apms-worker-deploy\n {2}cancel-in-progress: false\n/);
  assert.match(deploy, /\n {4}if: github\.ref == 'refs\/heads\/main'\n/, "a dispatch from another branch cannot deploy");
});

test("deploy workflow: tests and bundle check run before wrangler deploy; credentials only on the deploy step", () => {
  const steps = stepsOf(deploy);
  const idx = re => steps.findIndex(s => re.test(s.text));
  const checkout = idx(/actions\/checkout@/), creds = idx(/Require Cloudflare credentials/), install = idx(/npm ci --prefix apmath\/worker-backup\/worker/);
  const gate = idx(/bash tools\/ci\/apms-worker-test-gate\.sh/), dry = idx(/wrangler deploy --dry-run/), real = idx(/npx wrangler deploy --keep-vars/);
  assert.ok(checkout >= 0 && checkout < creds && creds < install && install < gate && gate < dry && dry < real, "order: checkout, credentials, npm ci, test gate, dry-run, deploy");
  assert.ok(steps.slice(real + 1).every(s => !/wrangler deploy/.test(s.text)), "deploy is the last wrangler call");
  for (const s of steps) {
    const usesToken = /secrets\.CLOUDFLARE_API_TOKEN/.test(s.text);
    assert.equal(usesToken, /Require Cloudflare credentials|Deploy the Worker/.test(s.name), `only the credential check and the deploy step see the token: ${s.name}`);
  }
  const realStep = steps[real].text;
  assert.match(realStep, /CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.match(realStep, /CLOUDFLARE_ACCOUNT_ID: \$\{\{ secrets\.R2_ACCOUNT_ID \}\}/);
  assert.match(realStep, /working-directory: apmath\/worker-backup\/worker/);
  assert.match(realStep, /--keep-vars/, "dashboard variables such as ALLOWED_ORIGINS survive the deploy");
  assert.ok(!/continue-on-error/.test(deploy), "no step may fail open");
  assert.match(steps[creds].text, /::error title=APMS Worker deploy blocked::missing GitHub Actions secret/);
  assert.match(steps[creds].text, /exit 1/);
  assert.match(steps[idx(/apms-worker-deploy-summary\.mjs/)].text, /GITHUB_STEP_SUMMARY/);
  assert.match(deploy, /node-version: '22'/);
});

test("deploy workflow: never migrates D1, runs SQL or touches other Workers", () => {
  const live = deploy.split("\n").filter(l => !/^\s*#/.test(l)).join("\n");
  for (const forbidden of [/migrations/i, /\bd1 execute\b/, /wrangler d1\b/, /\.sql\b/, /workers\/wangji/, /wrangler (secret|delete|rollback|workflows)\b/, /--remote\b/]) {
    assert.ok(!forbidden.test(live), `workflow must not contain ${forbidden}`);
  }
  assert.ok(!/migrations|wrangler d1|\bd1 execute\b/i.test(fs.readFileSync(path.join(repo, "tools/ci/apms-worker-test-gate.sh"), "utf8").replace(/^\s*#.*$/gm, "")), "test gate runs no migration");
});

test("worker test gate script: runs real syntax + miniflare/workerd runtime tests, every referenced test exists", () => {
  assert.match(testGate, /node --check "\$W\/index\.js"/);
  assert.match(testGate, /node --check "\$W\/backup-workflow\.js"/);
  const referenced = [...testGate.matchAll(/\btests\/[\w.-]+\.(?:mjs|cjs|js)\b/g)].map(m => m[0]);
  for (const mustRun of ["tests/archive2-worker-runtime.mjs", "tests/archive-saved-papers-runtime.mjs", "tests/archive2-ux-retrieval-d1.test.mjs", "tests/apmath-omr-result-identity.test.mjs", "tests/apms-result-clinic-uid-bridge.test.mjs", "tests/archive2-original-source-verification-shard.test.mjs"]) {
    assert.ok(referenced.includes(mustRun), `${mustRun} is in the gate`);
  }
  for (const f of new Set(referenced)) assert.ok(fs.existsSync(path.join(repo, f)), `${f} exists`);
  assert.match(testGate, /exit 1/);
  assert.ok(!/\|\| true|continue-on-error|skip|quarantin/i.test(testGate.replace(/^\s*#.*$/gm, "")), "nothing is skipped or ignored");
});

test("registered in the CI runner", () => {
  assert.match(read("tools/run-tests.js"), /tests\/apms-worker-deploy\.test\.mjs/);
});

// ---- Pages workflow integration ----------------------------------------------------------------------------------
test("Pages release: worker_order is a required, bounded, gate-listed step and the token can read Actions", () => {
  const build = pages.slice(pages.indexOf("\n  build:\n"), pages.indexOf("\n  deploy:\n"));
  const steps = build.split(/\n(?=      - )/).slice(1);
  const step = steps.find(s => /id: worker_order/.test(s));
  assert.ok(step, "worker_order step exists");
  assert.match(step, /continue-on-error: true/);
  const timeout = Number(/timeout-minutes: (\d+)/.exec(step)[1]);
  assert.ok(timeout > 0 && timeout <= 15);
  const waitMin = Number(/--timeout-minutes (\d+)/.exec(step)[1]);
  assert.ok(waitMin > 0 && waitMin < timeout, "wait is bounded below the step cap");
  assert.match(step, /node tools\/ci\/apms-worker-deploy-gate\.mjs/);
  assert.match(step, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(pages, /\n {2}actions: read\n/);
  const required = (/--required (\S+)/.exec(pages) || [])[1].split(",");
  assert.ok(required.includes("worker_order"), "worker_order is a REQUIRED gate entry");
  assert.ok(!(/--skip-ok (\S+)/.exec(pages) || [])[1].split(",").includes("worker_order"), "it may not be skipped");
  const index = id => steps.findIndex(s => new RegExp(`id: ${id}\\b`).test(s));
  assert.ok(index("worker_order") > index("staged_site_chrome") && index("worker_order") < index("release_gate"));
  assert.ok(index("release_gate") < steps.findIndex(s => /upload-pages-artifact@/.test(s)), "Pages artifact is uploaded only after the gate");
  assert.match(pages, /\n {4}needs: build\n/);
  // merge independence: the ordering gate lives only in the Pages workflow; the CI workflow never waits for it.
  assert.ok(!/apms-worker-deploy/.test(read(".github/workflows/ci.yml")));
});

// ---- ordering-gate decision logic with a fake API ----------------------------------------------------------------
const SHA = n => String(n).padStart(40, "0");
const T = SHA(1);           // newest Worker-touching commit
const AFTER = SHA(2);       // descendant of T
const BEFORE = SHA(9);      // not a descendant of T
const ancestry = new Map([[`${T}>${AFTER}`, true]]);
const isAncestor = async (a, b) => a === b || ancestry.get(`${a}>${b}`) === true;
const run = (id, sha, status, conclusion = null, extra = {}) => ({ id, head_sha: sha, head_branch: "main", status, conclusion, created_at: `2026-10-30T00:00:${String(id).padStart(2, "0")}Z`, html_url: `https://x/runs/${id}`, ...extra });

test("evaluateRuns: success on the touching commit or a descendant passes; unrelated runs are ignored", async () => {
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "success")], lastTouch: T, isAncestor })).verdict, "pass");
  assert.equal((await evaluateRuns({ runs: [run(1, AFTER, "completed", "success")], lastTouch: T, isAncestor })).verdict, "pass", "a newer deploy contains the change");
  const old = await evaluateRuns({ runs: [run(1, BEFORE, "completed", "success")], lastTouch: T, isAncestor });
  assert.equal(old.verdict, "wait", "a deploy of an older SHA does not contain the change");
  assert.equal((await evaluateRuns({ runs: [], lastTouch: T, isAncestor })).verdict, "wait");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "success", { head_branch: "other" })], lastTouch: T, isAncestor })).verdict, "wait", "only main runs count");
});

test("evaluateRuns: active runs wait, failures fail, a later success beats an earlier failure", async () => {
  assert.equal((await evaluateRuns({ runs: [run(1, T, "in_progress")], lastTouch: T, isAncestor })).verdict, "wait");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "queued")], lastTouch: T, isAncestor })).verdict, "wait");
  const failed = await evaluateRuns({ runs: [run(1, T, "completed", "failure")], lastTouch: T, isAncestor });
  assert.equal(failed.verdict, "fail");
  assert.match(failed.detail, /failure/);
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "cancelled")], lastTouch: T, isAncestor })).verdict, "fail", "a cancelled run proves nothing was deployed");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "timed_out")], lastTouch: T, isAncestor })).verdict, "fail");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "failure"), run(2, AFTER, "completed", "success")], lastTouch: T, isAncestor })).verdict, "pass");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "failure"), run(2, AFTER, "in_progress")], lastTouch: T, isAncestor })).verdict, "wait", "a retry in flight is awaited, not failed");
  assert.equal((await evaluateRuns({ runs: [run(1, T, "completed", "cancelled"), run(2, AFTER, "completed", "success")], lastTouch: T, isAncestor })).verdict, "pass", "pending run replaced by a newer one");
});

test("planWorkerWait: no Worker change in the release range means no wait; unknown base fails closed", () => {
  const none = planWorkerWait({ base: "b".repeat(40), lastTouch: () => ({ ok: true, sha: "" }) });
  assert.deepEqual([none.needed, none.uncertain], [false, false]);
  const changed = planWorkerWait({ base: "b".repeat(40), lastTouch: () => ({ ok: true, sha: T }) });
  assert.deepEqual([changed.needed, changed.uncertain, changed.lastTouch], [true, false, T]);
  const calls = [];
  const unreachable = planWorkerWait({ base: "b".repeat(40), lastTouch: b => { calls.push(b); return b ? { ok: false } : { ok: true, sha: T }; } });
  assert.deepEqual([unreachable.needed, unreachable.uncertain, unreachable.lastTouch, calls.length], [true, true, T, 2]);
  const noBase = planWorkerWait({ base: null, lastTouch: b => ({ ok: true, sha: b ? "x" : T }) });
  assert.deepEqual([noBase.needed, noBase.uncertain, noBase.lastTouch], [true, true, T]);
  const blind = planWorkerWait({ base: null, lastTouch: () => ({ ok: false }) });
  assert.equal(blind.needed, true);
  assert.equal(blind.lastTouch, "", "unreadable history still waits (and the CLI fails it)");
});

function fakeClock() {
  let t = 0;
  return { now: () => t, sleep: async ms => { t += ms; } };
}

test("waitForWorkerDeploy: waits through queued/running to success, bounded", async () => {
  const clock = fakeClock();
  const states = [[], [run(1, T, "queued")], [run(1, T, "in_progress")], [run(1, T, "completed", "success")]];
  let n = 0;
  const r = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => states[Math.min(n++, states.length - 1)], isAncestor, ...clock, timeoutMs: 14 * 60000, intervalMs: 20000 });
  assert.equal(r.verdict, "pass");
  assert.equal(n, 4);
  assert.equal(clock.now(), 60000);
});

test("waitForWorkerDeploy: failure stops at once; never-started and stuck runs time out; API errors are retried", async () => {
  let clock = fakeClock(), n = 0;
  const failed = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => { n++; return [run(1, T, "completed", "failure")]; }, isAncestor, ...clock, timeoutMs: 840000, intervalMs: 20000 });
  assert.deepEqual([failed.verdict, n, clock.now()], ["fail", 1, 0]);

  clock = fakeClock(); n = 0;
  const never = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => { n++; return []; }, isAncestor, ...clock, timeoutMs: 840000, intervalMs: 20000 });
  assert.equal(never.verdict, "timeout");
  assert.match(never.detail, /timed out after 14 min/);
  assert.ok(clock.now() <= 840000 && n >= 40, "polls until the deadline and never beyond it");

  clock = fakeClock();
  const stuck = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => [run(1, T, "in_progress")], isAncestor, ...clock, timeoutMs: 120000, intervalMs: 20000 });
  assert.equal(stuck.verdict, "timeout");
  assert.match(stuck.detail, /in_progress/);

  clock = fakeClock(); n = 0;
  const flaky = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => { if (n++ < 2) throw new Error("HTTP 502"); return [run(1, T, "completed", "success")]; }, isAncestor, ...clock, timeoutMs: 840000, intervalMs: 20000 });
  assert.equal(flaky.verdict, "pass");
  clock = fakeClock();
  const down = await waitForWorkerDeploy({ lastTouch: T, listRuns: async () => { throw new Error("HTTP 500"); }, isAncestor, ...clock, timeoutMs: 60000, intervalMs: 20000 });
  assert.equal(down.verdict, "timeout", "a dead API fails closed at the deadline");
  assert.match(down.detail, /Actions API error/);
});

// ---- real git: the release range decides whether to wait ---------------------------------------------------------
test("gitLastTouch: finds the newest Worker-touching commit in the release range, only", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "worker-order-"));
  try {
    const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" } }).trim();
    const commit = (file, content, msg) => { fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true }); fs.writeFileSync(path.join(dir, file), content); git("add", file); git("commit", "-q", "-m", msg); return git("rev-parse", "HEAD"); };
    git("init", "-q", "-b", "main");
    const pathspecs = ["apmath/worker-backup/**", "archive/archive2-core.js"];
    const c1 = commit("README.md", "a", "init");
    const c2 = commit("archive/data/other.json", "{}", "data only");
    assert.deepEqual(gitLastTouch({ base: c1, pathspecs, cwd: dir }), { ok: true, sha: "" }, "data/doc commits do not wait");
    const c3 = commit("apmath/worker-backup/worker/routes/x.js", "export {}", "worker route");
    const c4 = commit("archive/archive2-core.js", "module.exports={}", "shared module");
    const c5 = commit("archive/data/more.json", "{}", "data again");
    assert.equal(gitLastTouch({ base: c2, pathspecs, cwd: dir }).sha, c4, "newest touching commit wins");
    assert.equal(gitLastTouch({ base: c4, pathspecs, cwd: dir }).sha, "", "range after the last Worker change is clean");
    assert.equal(gitLastTouch({ base: null, pathspecs, cwd: dir }).sha, c4, "whole history fallback");
    assert.equal(gitLastTouch({ base: "f".repeat(40), pathspecs, cwd: dir }).ok, false, "unknown base is reported, not treated as clean");
    assert.ok(c5 && c3);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("gate CLI: refuses an empty path list and writes no pass without the Actions API", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "worker-order-cli-"));
  try {
    const empty = path.join(dir, "empty.txt");
    fs.writeFileSync(empty, "# nothing\n");
    const r = spawnSync(process.execPath, ["tools/ci/apms-worker-deploy-gate.mjs", "--paths-file", empty], { cwd: repo, encoding: "utf8", env: { PATH: process.env.PATH, GITHUB_TOKEN: "", GITHUB_REPOSITORY: "" } });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /::error title=Pages release waits for the APMS Worker::gate crashed: .*lists no paths/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("constants and deploy summary parsing", () => {
  assert.equal(WORKER_DEPLOY_WORKFLOW, "apms-worker-deploy.yml");
  assert.ok(fs.existsSync(path.join(repo, ".github/workflows", WORKER_DEPLOY_WORKFLOW)));
  const ndjson = [JSON.stringify({ type: "wrangler-session", version: 1 }), JSON.stringify({ type: "deploy", version: 1, worker_name: "ap-math-os-v2612", version_id: "11111111-2222-3333-4444-555555555555" })].join("\n");
  assert.deepEqual(parseDeployInfo(ndjson, ""), { versionId: "11111111-2222-3333-4444-555555555555", workerName: "ap-math-os-v2612", source: "wrangler-output" });
  assert.equal(parseDeployInfo("", "Uploaded\nCurrent Version ID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee\n").versionId, "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
  assert.equal(parseDeployInfo("garbage", "nothing"), null);
});
