import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { evaluateGate } from "../tools/ci/archive-pages-release-gate.mjs";
import { decideDeployNeeded, SYNC_SUBJECT } from "../tools/ci/archive-pages-deploy-needed.mjs";

const repo = fileURLToPath(new URL("..", import.meta.url));
const workflow = fs.readFileSync(path.join(repo, ".github/workflows/archive-pages-release.yml"), "utf8");
const gateScript = path.join(repo, "tools/ci/archive-pages-release-gate.mjs");

// Split the build job into its steps (each starts with "      - " at the steps indent).
const buildJob = workflow.slice(workflow.indexOf("\n  build:\n"), workflow.indexOf("\n  deploy:\n"));
const steps = buildJob.split(/\n(?=      - )/).slice(1).map(text => ({
  text,
  id: (/^\s*(?:- )?id: (\S+)/m.exec(text) || [])[1] || null,
  name: (/name: (.+)/.exec(text) || [])[1] || null,
  continueOnError: /^ {8}continue-on-error: true$/m.test(text),
  timeout: Number((/^ {8}timeout-minutes: (\d+)$/m.exec(text) || [])[1] || 0)
}));
const gateRequired = (/--required (\S+)/.exec(workflow) || [])[1].split(",");
const gateStep = steps.find(s => s.id === "release_gate");

test("gate semantics: only success passes; skipped passes only where allowed; missing step fails", () => {
  const ok = evaluateGate({ steps: { a: { outcome: "success" }, b: { outcome: "skipped" } }, required: ["a", "b"], skipOk: ["b"] });
  assert.equal(ok.pass, true);
  assert.equal(evaluateGate({ steps: { a: { outcome: "failure" } }, required: ["a"] }).pass, false);
  assert.equal(evaluateGate({ steps: { a: { outcome: "cancelled" } }, required: ["a"] }).pass, false);
  assert.equal(evaluateGate({ steps: { a: { outcome: "skipped" } }, required: ["a"] }).pass, false);
  assert.equal(evaluateGate({ steps: {}, required: ["a"] }).failures[0].outcome, "not_reached");
  const adv = evaluateGate({ steps: { a: { outcome: "success" }, c: { outcome: "failure" } }, required: ["a"], advisory: ["c"] });
  assert.equal(adv.pass, true, "advisory failures never block");
  assert.equal(adv.rows.find(r => r.id === "c").ok, false);
});

test("gate CLI exits 1 on a failed required step, 0 on success, 1 on unreadable context; writes evidence", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pages-gate-"));
  try {
    const evidence = path.join(dir, "context.txt");
    const run = (steps, extra = []) => spawnSync(process.execPath, [gateScript, "--required", "x,y", "--evidence-file", evidence, ...extra], { env: { ...process.env, STEPS_JSON: steps }, encoding: "utf8" });
    const good = run(JSON.stringify({ x: { outcome: "success" }, y: { outcome: "success" } }));
    assert.equal(good.status, 0, good.stdout + good.stderr);
    const bad = run(JSON.stringify({ x: { outcome: "success" }, y: { outcome: "failure" } }));
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /::error title=Release gate blocked deploy::required step y outcome=failure/);
    assert.equal(run("not json").status, 1);
    assert.equal(spawnSync(process.execPath, [gateScript], { env: { ...process.env, STEPS_JSON: "{}" }, encoding: "utf8" }).status, 1, "no --required list is refused");
    const text = fs.readFileSync(evidence, "utf8");
    assert.match(text, /release_gate=RELEASE_GATE_PASS/);
    assert.match(text, /release_gate=RELEASE_GATE_FAIL/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("workflow: every gate-required id is a real continue-on-error step with a timeout, nothing is skipped silently", () => {
  assert.ok(gateRequired.length >= 16);
  for (const id of gateRequired) {
    const step = steps.find(s => s.id === id);
    assert.ok(step, `required step id ${id} exists`);
    assert.ok(step.continueOnError, `${id} keeps continue-on-error so diagnostics still run`);
    assert.ok(step.timeout > 0 && step.timeout <= 15, `${id} has a bounded step timeout`);
  }
  for (const id of ["reg_materialize", "reg_verify", "reg_commit", "archive2_runtime", "staged_site_chrome", "mock_qa", "selection_tests"]) {
    assert.ok(gateRequired.includes(id), `${id} is required`);
  }
  assert.match(workflow, /--skip-ok reg_commit/);
  // Any other continue-on-error step must be explicitly classified: required, or advisory.
  const advisory = (/--advisory (\S+)/.exec(workflow) || [])[1].split(",");
  for (const step of steps.filter(s => s.continueOnError)) {
    assert.ok(step.id && (gateRequired.includes(step.id) || advisory.includes(step.id)), `continue-on-error step "${step.name}" must be gated or advisory`);
    assert.ok(step.timeout > 0, `"${step.name}" has a step timeout`);
  }
});

test("workflow: the gate follows every verification, precedes the Pages artifact, and evidence upload stays always()", () => {
  const index = id => steps.findIndex(s => s.id === id);
  for (const id of [...gateRequired, "main_sha_confirm", "pages_build"]) assert.ok(index(id) >= 0 && index(id) < index("release_gate"), `${id} runs before the gate`);
  assert.ok(gateStep && !gateStep.continueOnError, "the gate itself must be able to fail the job");
  const evidence = steps.findIndex(s => /upload-artifact@/.test(s.text));
  const pages = steps.findIndex(s => /upload-pages-artifact@/.test(s.text));
  assert.ok(index("release_gate") < pages, "no Pages artifact is uploaded before the gate passed");
  assert.match(steps[evidence].text, /if: always\(\)/);
  assert.ok(!/continue-on-error/.test(steps[pages].text));
  assert.match(workflow, /\n {4}needs: build\n/, "deploy requires the whole build job");
  assert.ok(!/\n {2}deploy:[\s\S]*if: always\(\)/.test(workflow.slice(workflow.indexOf("\n  deploy:\n"))), "deploy cannot run after a failed build");
});

test("workflow: timeouts, schedule self-heal and permissions", () => {
  assert.match(workflow, /\n {2}schedule:\n {4}- cron: '17 \*\/3 \* \* \*'/);
  assert.match(workflow, /\n {2}deployments: read\n/);
  assert.match(workflow, /needs\.registration-ready\.outputs\.needed == 'true'/);
  assert.match(workflow, /node tools\/ci\/archive-pages-deploy-needed\.mjs/);
  assert.match(workflow, /\n {4}timeout-minutes: 45\n/);
  assert.match(workflow, /fetch-depth: 0/, "full history stays: runtime diff and historic blob reads need it");
});

const SHA_D = "d".repeat(40), SHA_M = "e".repeat(40);
const syncCommit = { commit: { message: "chore(archive): sync registration artifacts [skip ci]\n\nbody", author: { name: "github-actions[bot]" } } };
const fakeGet = ({ deployments = [{ id: 1, sha: SHA_D }], state = "success", cmp = null, fail = false } = {}) => async route => {
  if (fail) throw new Error("HTTP 500");
  if (route.includes("/deployments?")) return deployments;
  if (route.includes("/statuses")) return [{ state }];
  if (route.includes("/compare/")) return cmp;
  throw new Error("unexpected " + route);
};

test("self-heal probe: only scheduled runs may skip, and only when the live site already serves main", async () => {
  const base = { repo: "o/r", mainSha: SHA_M };
  for (const eventName of ["push", "workflow_run", "workflow_dispatch"]) {
    assert.equal((await decideDeployNeeded({ ...base, eventName, get: fakeGet({ deployments: [{ id: 1, sha: SHA_M }] }) })).needed, true, eventName);
  }
  const sched = { ...base, eventName: "schedule" };
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ deployments: [{ id: 1, sha: SHA_M }] }) })).needed, false);
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ state: "failure" }) })).needed, true, "a failed deployment is not a live site");
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ deployments: [] }) })).needed, true);
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ fail: true }) })).needed, true, "API trouble builds to be safe");
  const onlySync = { status: "ahead", total_commits: 1, commits: [syncCommit] };
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ cmp: onlySync }) })).needed, false, "registration sync commits after the deployed SHA are already served");
  const foreign = { status: "ahead", total_commits: 2, commits: [syncCommit, { commit: { message: "feat: new exam", author: { name: "someone" } } }] };
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ cmp: foreign }) })).needed, true, "an undeployed content commit forces a build");
  const spoof = { status: "ahead", total_commits: 1, commits: [{ commit: { message: "chore(archive): sync registration artifacts [skip ci]", author: { name: "human" } } }] };
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ cmp: spoof }) })).needed, true, "only the bot's sync commits count");
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ cmp: { status: "diverged", total_commits: 1, commits: [syncCommit] } }) })).needed, true);
  assert.equal((await decideDeployNeeded({ ...sched, get: fakeGet({ cmp: { status: "ahead", total_commits: 150, commits: [syncCommit] } }) })).needed, true, "truncated compare is not trusted");
  assert.ok(SYNC_SUBJECT.test("chore(archive): sync registration artifacts [skip ci]"));
});
