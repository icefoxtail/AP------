import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { evaluateGate } from "../tools/ci/archive-pages-release-gate.mjs";
import { probe } from "../tools/ci/archive-pages-deploy-needed.mjs";

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

test('Pages consumes verified registration and keeps student availability required',()=>{
  assert.ok((/--advisory (\S+)/.exec(workflow)||[])[1]?.split(',').includes('chrome_generated_bank'));
  assert.ok(gateRequired.includes('registered'));
  assert.match(steps.find(step => step.id === 'registered').text, /archive-registration-writer\.mjs --check/);
  assert.ok(gateRequired.includes('staged_site_chrome'));
  assert.doesNotMatch(workflow.slice(workflow.indexOf('id: staged_site_chrome'),workflow.indexOf('id: worker_order')),/check-generated-bank-browser\.cjs/);
  assert.ok(gateRequired.includes('selection_tests'));
  assert.equal(evaluateGate({steps:{selection_tests:{outcome:'success'},chrome_generated_bank:{outcome:'failure'}},required:['selection_tests'],advisory:['chrome_generated_bank']}).pass,true);
  assert.equal(evaluateGate({steps:{selection_tests:{outcome:'failure'},chrome_generated_bank:{outcome:'success'}},required:['selection_tests'],advisory:['chrome_generated_bank']}).pass,false);
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

test("workflow: every required verification has a bounded real outcome; continued failures reach the gate", () => {
  assert.deepEqual(gateRequired, ["registered", "package_shards", "identity", "selection_tests", "chrome_geumdang", "chrome_qid9_student",
    "mock_qa", "archive2_runtime", "pages_build", "staged_site_chrome", "worker_order", "image_order", "snapshot_guard"]);
  for (const id of gateRequired) {
    const step = steps.find(s => s.id === id);
    assert.ok(step, `required step id ${id} exists`);
    assert.ok(step.timeout > 0 && step.timeout <= 15, `${id} has a bounded step timeout`);
  }
  // Any other continue-on-error step must be explicitly classified: required, or advisory.
  const advisory = (/--advisory (\S+)/.exec(workflow) || [])[1].split(",");
  for (const step of steps.filter(s => s.continueOnError)) {
    assert.ok(step.id && (gateRequired.includes(step.id) || advisory.includes(step.id)), `continue-on-error step "${step.name}" must be gated or advisory`);
    assert.ok(step.timeout > 0, `"${step.name}" has a step timeout`);
  }
});

test("workflow: the gate follows every verification, precedes the Pages artifact, and evidence upload stays always()", () => {
  const index = id => steps.findIndex(s => s.id === id);
  for (const id of gateRequired) assert.ok(index(id) >= 0 && index(id) < index("release_gate"), `${id} runs before the gate`);
  assert.ok(gateStep && !gateStep.continueOnError, "the gate itself must be able to fail the job");
  const evidence = steps.findIndex(s => /upload-artifact@/.test(s.text));
  const pages = steps.findIndex(s => /upload-pages-artifact@/.test(s.text));
  assert.ok(index("release_gate") < pages, "no Pages artifact is uploaded before the gate passed");
  assert.ok(index("release_gate") < index("release_receipt") && index("release_receipt") < pages, "exact receipt is sealed after the gate and before upload");
  assert.match(steps[evidence].text, /if: always\(\)/);
  assert.ok(!/continue-on-error/.test(steps[pages].text));
  assert.match(workflow, /\n {4}needs: build\n/, "deploy requires the whole build job");
  assert.ok(!/\n {2}deploy:[\s\S]*if: always\(\)/.test(workflow.slice(workflow.indexOf("\n  deploy:\n"))), "deploy cannot run after a failed build");
});

test("workflow: timeouts, schedule self-heal and permissions", () => {
  assert.match(workflow, /\n {2}schedule:\n {4}- cron: '17 \*\/3 \* \* \*'/);
  assert.match(workflow, /\n {2}deployments: read\n/);
  assert.match(workflow, /needs\.build\.outputs\.ready == 'true' && needs\.build\.outputs\.needed == 'true'/);
  assert.match(workflow, /node tools\/ci\/archive-pages-deploy-needed\.mjs/);
  assert.match(workflow, /\n {4}timeout-minutes: 45\n/);
  assert.match(workflow, /fetch-depth: 0/, "full history stays: runtime diff and historic blob reads need it");
  assert.match(workflow, /\n {2}contents: read\n/);
  assert.doesNotMatch(buildJob, /pages: write|id-token: write|contents: write|git (?:commit|push)|git-push-derived-with-retry/);
  assert.match(buildJob, /persist-credentials: false/);
  assert.match(buildJob, /ref: \$\{\{ inputs\.registered_main_sha \|\| github\.sha \}\}/);
  assert.doesNotMatch(buildJob, /ref: main|git fetch/);
});

function blockScript(text) {
  const lines = text.split("\n"), start = lines.indexOf("        run: |");
  assert.ok(start >= 0, "workflow step uses an inspectable shell block");
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !line.startsWith("          ")) break;
    body.push(line.slice(10));
  }
  return body.join("\n");
}

test("real workflow gate only accepts Archive skips with explicit matching proof; any failed outcome still blocks", t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "pages-real-gate-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const reused = ["selection_tests", "chrome_geumdang", "chrome_qid9_student", "mock_qa", "archive2_runtime"];
  const base = Object.fromEntries(gateRequired.map(id => [id, { outcome: "success", conclusion: "success" }]));
  const run = (archiveNeeded, outcomes) => spawnSync("bash", ["-e", "-o", "pipefail", "-c", blockScript(gateStep.text)], {
    cwd: repo, encoding: "utf8", env: { ...process.env, STEPS_JSON: JSON.stringify(outcomes), ARCHIVE_NEEDED: archiveNeeded,
      RELEASE_EVIDENCE_DIR: directory, GITHUB_STEP_SUMMARY: path.join(directory, "summary.md") }
  });
  const skipped = { ...base, ...Object.fromEntries(reused.map(id => [id, { outcome: "skipped" }])) };
  assert.equal(run("false", skipped).status, 0, "verified identical Archive inputs permit only declared skips");
  for (const uncertain of ["true", "", "unknown"]) assert.equal(run(uncertain, skipped).status, 1, `no proof for ${uncertain}`);
  for (const failed of ["identity", "registered", "image_order", "worker_order", "snapshot_guard", "selection_tests"]) {
    const result = run("false", { ...base, [failed]: { outcome: "failure", conclusion: "success" } });
    assert.equal(result.status, 1, `${failed}: continue-on-error conclusion cannot mask the failed outcome`);
  }
  for (const id of reused) assert.match(steps.find(step => step.id === id).text, /steps\.identity\.outputs\.archive_needed != 'false'/);
  for (const id of ["pages_build", "staged_site_chrome", "worker_order", "image_order", "snapshot_guard"])
    assert.doesNotMatch(steps.find(step => step.id === id).text, /archive_needed/, `${id} is never bypassed by Archive-only reuse`);
});

test("identity process crashes still collect diagnostics, and its real failure stays required at the final gate", () => {
  const identity = steps.find(step => step.id === "identity");
  assert.equal(identity.continueOnError, true);
  assert.ok(gateRequired.includes("identity"));
  assert.match(workflow, /needed: \$\{\{ steps\.identity\.outputs\.needed \|\| 'true' \}\}/);
  assert.match(steps.find(step => step.id === "pages_build").text, /steps\.identity\.outputs\.needed != 'false'/);
});

// Probe failures request validation on every event; reusable content identities are exercised in
// archive-pages-release-identity.test.mjs, including exact Git/packaged-byte fixtures.
const probeScript = path.join(repo, "tools/ci/archive-pages-deploy-needed.mjs");
const runProbeScript = (t, eventName, extraEnv = {}) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "deploy-needed-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const out = path.join(dir, "output.txt");
  const result = spawnSync(process.execPath, [probeScript], { cwd: dir, encoding: "utf8",
    env: { PATH: process.env.PATH, GITHUB_EVENT_NAME: eventName, GITHUB_OUTPUT: out, GIT_CEILING_DIRECTORIES: path.dirname(dir), ...extraEnv } });
  return { ...result, output: fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "" };
};

test("probe: failed input discovery never skips checks on any event", async () => {
  for (const eventName of ["push", "schedule", "workflow_run", "workflow_dispatch", ""]) {
    const result = await probe({ env: { GITHUB_EVENT_NAME: eventName }, headSha: () => { throw new Error("not a git repository"); } });
    assert.equal(result.needed, true, eventName);
    assert.equal(result.archiveNeeded, true, eventName);
    assert.match(result.reason, /probe crashed.*not a git repository/);
  }
  const unknown = await probe({ args: ["--unknown", "x"] });
  assert.equal(unknown.needed, true);
  assert.equal(unknown.archiveNeeded, true);
});

test("probe CLI: missing checkout or unwritable output cannot become a skipped build", t => {
  for (const eventName of ["push", "schedule", "workflow_dispatch"]) {
    const result = runProbeScript(t, eventName, { GITHUB_REPOSITORY: "o/r" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.output, /^needed=true\narchive_needed=true\n/);
    assert.match(result.output, /reason=probe crashed/);
  }
  const unwritable = runProbeScript(t, "push", { GITHUB_OUTPUT: path.join(os.tmpdir(), "does-not-exist-dir", "x", "out.txt") });
  assert.equal(unwritable.status, 0, "workflow must also treat a missing output as validation needed");
});
