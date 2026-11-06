import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Keep the existing CI entry, now guarding the retirement of Pages' Git writer. The shared writer's
// retry/race behavior belongs to its own helper tests; Pages only accepts its exact verified snapshot.
const repo = fileURLToPath(new URL("..", import.meta.url));
const workflow = fs.readFileSync(path.join(repo, ".github/workflows/archive-pages-release.yml"), "utf8");
const buildJob = workflow.slice(workflow.indexOf("\n  build:\n"), workflow.indexOf("\n  deploy:\n"));
const step = id => buildJob.split(/\n(?=      - )/).find(text => new RegExp(`^\\s*(?:- )?id: ${id}$`, "m").test(text));
function blockScript(text) {
  const lines = text.split("\n"), start = lines.indexOf("        run: |");
  assert.ok(start >= 0, "workflow uses an inspectable shell block");
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !line.startsWith("          ")) break;
    body.push(line.slice(10));
  }
  return body.join("\n");
}

function sandbox(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pages-registered-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.invalid", "-c", "commit.gpgsign=false", ...args], { cwd: root, encoding: "utf8" }).trim();
  git("init", "-q", "-b", "main");
  fs.writeFileSync(path.join(root, "source.js"), "window.example = 1;\n");
  fs.writeFileSync(path.join(root, ".gitignore"), "evidence/\n");
  fs.mkdirSync(path.join(root, "tools/ci"), { recursive: true });
  fs.writeFileSync(path.join(root, "tools/ci/archive-registration-writer.mjs"), `
    import fs from 'node:fs';
    const args = process.argv.slice(2);
    if (!args.includes('--check') || args.includes('--write')) throw new Error('read-only check required');
    const directory = args[args.indexOf('--work-dir') + 1];
    fs.mkdirSync(directory, {recursive:true});
    const publishable = process.env.FIXTURE_PUBLISHABLE === 'true';
    fs.writeFileSync(directory + '/report.json', JSON.stringify({publishable, status:publishable ? 'CURRENT' : 'REGISTRATION_NEEDED'}));
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'publishable=' + publishable + '\\n');
  `);
  git("add", "-A"); git("commit", "-qm", "registered snapshot");
  const sha = git("rev-parse", "HEAD");
  git("update-ref", "refs/remotes/origin/main", sha);
  const evidence = path.join(root, "evidence"); fs.mkdirSync(evidence);
  const run = (id, extra = {}) => spawnSync("bash", ["-e", "-o", "pipefail", "-c", blockScript(step(id))], {
    cwd: root, encoding: "utf8", env: { ...process.env, REGISTERED_MAIN_SHA: sha,
      GITHUB_EVENT_NAME: "workflow_dispatch", GITHUB_RUN_ID: "fixture", GITHUB_RUN_ATTEMPT: "1",
      GITHUB_WORKFLOW_REF: "o/r/.github/workflows/archive-pages-release.yml@refs/heads/main", GITHUB_SERVER_URL: "https://github.com", GITHUB_REPOSITORY: "o/r",
      RELEASE_EVIDENCE_DIR: evidence, GITHUB_STEP_SUMMARY: path.join(evidence, "summary.md"),
      GITHUB_OUTPUT: path.join(evidence, "outputs.txt"), REQUESTED_REGISTERED_SHA: "", ...extra }
  });
  return { root, git, sha, evidence, run };
}

test("Pages has no shared-data Git writer, write credential, or moving-main checkout", () => {
  assert.match(workflow, /\npermissions:\n  contents: read/);
  assert.match(buildJob, /persist-credentials: false/);
  assert.doesNotMatch(buildJob, /id: reg_commit|git (?:add|commit|push|fetch)|git-push-derived-with-retry|archive-pages-registration-derive\.sh/);
  assert.match(step("registered"), /archive-registration-writer\.mjs --check/);
  assert.match(step("package_shards"), /build-archive2-catalog\.mjs --package-only/);
  assert.match(step("archive2_runtime"), /check-archive2-runtime\.cjs --registered/);
  assert.doesNotMatch(buildJob, /(?:compile-qid9-main-source|auto-register-approved-qid9|rebuild-main-source-consumer)\.mjs --write/);
  assert.match(buildJob, /ref: \$\{\{ inputs\.registered_main_sha \|\| github\.sha \}\}/);
});

test("exact dispatch with stale registration fails; scheduled recovery records DEFERRED and cannot publish", t => {
  const f = sandbox(t);
  const dispatch = f.run("registered", { FIXTURE_PUBLISHABLE: "false", REQUESTED_REGISTERED_SHA: f.sha });
  assert.equal(dispatch.status, 1, dispatch.stdout + dispatch.stderr);
  assert.match(dispatch.stderr, /DEFERRED_REGISTRATION/);
  const recovery = f.run("registered", { FIXTURE_PUBLISHABLE: "false", REQUESTED_REGISTERED_SHA: "" });
  assert.equal(recovery.status, 0, recovery.stdout + recovery.stderr);
  assert.match(fs.readFileSync(path.join(f.evidence, "summary.md"), "utf8"), /DEFERRED_REGISTRATION: REGISTRATION_NEEDED/);
  assert.match(fs.readFileSync(path.join(f.evidence, "outputs.txt"), "utf8"), /publishable=false/);
  assert.match(workflow, /if: needs\.build\.outputs\.ready == 'true' && needs\.build\.outputs\.needed == 'true'/);
  assert.equal(f.git("rev-parse", "HEAD"), f.sha);
  assert.equal(f.git("diff", "--name-only", "HEAD"), "");
});

test("verified registration check is read-only and the snapshot guard rejects staged source mutation", t => {
  const f = sandbox(t);
  const current = f.run("registered", { FIXTURE_PUBLISHABLE: "true", REQUESTED_REGISTERED_SHA: f.sha });
  assert.equal(current.status, 0, current.stderr);
  assert.match(fs.readFileSync(path.join(f.evidence, "outputs.txt"), "utf8"), /publishable=true/);
  assert.equal(f.run("snapshot_guard").status, 0);
  fs.writeFileSync(path.join(f.root, "source.js"), "unexpected source mutation\n");
  f.git("add", "source.js");
  const mutation = f.run("snapshot_guard");
  assert.notEqual(mutation.status, 0, "staged and unstaged source edits cannot reach upload");
  assert.equal(f.git("rev-parse", "HEAD"), f.sha, "Pages makes no Git commit");
});

test("context binds an exact main ancestor while unrelated newer main does not invalidate the fixed snapshot", t => {
  const f = sandbox(t);
  fs.writeFileSync(path.join(f.root, "unrelated.txt"), "another maintainer's merge\n");
  f.git("add", "unrelated.txt"); f.git("commit", "-qm", "later main");
  const newer = f.git("rev-parse", "HEAD");
  f.git("update-ref", "refs/remotes/origin/main", newer);
  assert.notEqual(f.run("context").status, 0, "wrong checked-out commit is rejected");
  f.git("checkout", "-q", "--detach", f.sha);
  const fixed = f.run("context");
  assert.equal(fixed.status, 0, `exact registered ancestor remains valid despite unrelated main movement: ${fixed.stderr}`);
  assert.equal(f.run("snapshot_guard").status, 0);
  const evidence = fs.readFileSync(path.join(f.evidence, "context.txt"), "utf8");
  assert.match(evidence, new RegExp(`source_sha=${f.sha}`));
  assert.doesNotMatch(evidence, new RegExp(`source_sha=${newer}`));
  assert.notEqual(f.run("context", { REGISTERED_MAIN_SHA: "main" }).status, 0, "moving refs are not valid release identities");
});
