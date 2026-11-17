import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// R2 bills each write-class request (Class A). User decision 2026-11-17: this workflow must NEVER compare, list or
// copy the whole image folder. These checks keep that contract: every rclone call names its files explicitly,
// push uploads only changed images, a manual run uploads one exam folder, and when nothing can be decided the job
// fails instead of widening to "everything".
const repo = fileURLToPath(new URL("..", import.meta.url));
const read = file => fs.readFileSync(path.join(repo, file), "utf8");
const workflow = read(".github/workflows/r2-archive-assets-copy.yml");
const scriptText = read("tools/ci/r2-changed-images.sh");
const stripComments = text => text.split("\n").filter(line => !/^\s*#/.test(line)).join("\n");
const code = stripComments(workflow);
const scriptCode = stripComments(scriptText);

// Every `rclone <name>` invocation (the continued command lines up to the first line without a trailing backslash).
function rcloneCommands(name = "\\w+") {
  const lines = code.split("\n");
  const commands = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!new RegExp(`\\brclone ${name}\\b`).test(lines[i])) continue;
    let text = lines[i];
    while (/\\\s*$/.test(lines[i]) && i + 1 < lines.length) { i += 1; text += `\n${lines[i]}`; }
    commands.push(text);
  }
  return commands;
}

test("no whole-folder comparison, listing or sync exists anywhere in the workflow or the helper script", () => {
  for (const [label, text] of [["workflow", code], ["script", scriptCode]]) {
    assert.doesNotMatch(text, /--fast-list/, `${label}: --fast-list`);
    assert.doesNotMatch(text, /mode=full/, `${label}: mode=full`);
    assert.doesNotMatch(text, /compare every image/i, `${label}: full-compare fallback text`);
    assert.doesNotMatch(text, /\brclone\s+(sync|bisync|move|moveto|lsf|ls|lsl|lsd|lsjson|size|tree|ncdu|dedupe|cleanup|purge|delete|deletefile)\b/, `${label}: forbidden rclone command`);
  }
  assert.doesNotMatch(code, /workflow_dispatch:\s*\n\s*push:/, "dispatch must declare its folder input");
});

test("every rclone call names its files explicitly and never walks the bucket or the folder", () => {
  const all = rcloneCommands().filter(command => !/^\s*rclone version\b/.test(command.trim()) && !/rclone version/.test(command.split("\n")[0]));
  const copies = rcloneCommands("copy");
  const checks = rcloneCommands("check");
  assert.equal(copies.length, 1, "exactly one upload command");
  assert.equal(checks.length, 1, "exactly one read-back command");
  assert.equal(all.length, copies.length + checks.length, "no other rclone verbs besides install/version, copy and check");
  for (const command of all) {
    assert.match(command, /--files-from0 "\$PLAN_LIST"/, command);
    assert.match(command, /--no-traverse/, command);
    assert.match(command, /r2-ap-assets:\$\{R2_BUCKET\}\/exams\/images/, "same key layout the Pages release gate checks");
  }
  for (const command of copies) {
    assert.match(command, /--no-update-modtime/, command);
    assert.match(command, /--checksum/, command);
  }
  assert.match(checks[0], /--one-way/);
  // The exact source/destination shape the Pages release gate test also looks for.
  assert.match(code, /rclone copy archive\/assets\/images "r2-ap-assets:\$\{R2_BUCKET\}\/exams\/images"/);
});

test("manual run takes a required `folder` input; its value reaches the shell only through env", () => {
  assert.match(workflow, /workflow_dispatch:\n\s+inputs:\n\s+folder:\n(?:\s+(?:description|type):[^\n]*\n)*\s+required: true\n/, "folder is required");
  const uses = workflow.match(/github\.event\.inputs\.folder/g) || [];
  assert.equal(uses.length, 1, "referenced once");
  assert.match(workflow, /^\s+FOLDER_INPUT: \$\{\{ github\.event\.inputs\.folder \}\}$/m, "passed as an env value, not spliced into a script");
  assert.doesNotMatch(code.replace(/^\s+FOLDER_INPUT: .*$/m, ""), /\$\{\{[^}]*inputs/, "no ${{ }} input expansion inside run scripts");
});

test("the push base order is last successful run, then this push's before, then a hard failure; limits live in one env block", () => {
  assert.match(code, /actions\/workflows\/r2-archive-assets-copy\.yml\/runs\?branch=main&status=success/);
  assert.match(code, /PUSH_BEFORE: \$\{\{ github\.event\.before \}\}/);
  assert.match(code, /actions: read/);
  const plan = code.slice(code.indexOf("Plan upload"));
  assert.ok(plan.indexOf("status=success") < plan.indexOf('before="${PUSH_BEFORE'), "(a) before (b)");
  assert.match(plan, /fallback to this push only \(\$\{why\}\)/, "the (a)->(b) fallback leaves a reason in the log line");
  assert.match(plan, /fail_plan "could not decide which images changed/);
  assert.ok(plan.includes("어떤 이미지가 바뀌었는지 정하지 못해 올리지 않았음. 수동 실행에서 폴더를 지정해 올릴 것"));
  assert.equal((workflow.match(/^\s+R2_MAX_IMAGES_PUSH: "\d+"$/gm) || []).length, 1);
  assert.equal((workflow.match(/^\s+R2_MAX_IMAGES_FOLDER: "\d+"$/gm) || []).length, 1);
});

test("run scripts are safe under bash -eo pipefail: nothing pipes into an early-closing head", () => {
  assert.doesNotMatch(code, /\|\s*head\b/, "`| head` dies with SIGPIPE (141) when the producer writes more than head reads");
  assert.doesNotMatch(workflow, /-e and pipefail are off|no -e/i);
});

// ---- a plan-step helper that runs the REAL run block of a step under `bash -eo pipefail` -------------------------------
function stepRun(stepName) {
  const lines = workflow.split("\n");
  const at = lines.findIndex(line => line.includes(`name: ${stepName}`));
  assert.ok(at >= 0, stepName);
  const start = lines.findIndex((line, i) => i > at && /^\s+run: \|\s*$/.test(line));
  const body = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].trim() !== "" && !/^ {10}/.test(lines[i])) break;
    body.push(lines[i].slice(10));
  }
  return `${body.join("\n")}\n`;
}
const limits = {
  R2_MAX_IMAGES_PUSH: workflow.match(/R2_MAX_IMAGES_PUSH: "(\d+)"/)[1],
  R2_MAX_IMAGES_FOLDER: workflow.match(/R2_MAX_IMAGES_FOLDER: "(\d+)"/)[1]
};

test("log preview of a 3,000-entry list exits 0 under bash -eo pipefail", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-preview-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const list = path.join(dir, "list.z");
  fs.writeFileSync(list, Array.from({ length: 3000 }, (_, i) => `folder/q${i}.png\0`).join(""));
  const planRun = stepRun("Plan upload");
  const preview = planRun.split("\n").filter(line => /head -z -n 20 "\$list"/.test(line));
  assert.equal(preview.length, 1, "one preview command in the plan step");
  const result = spawnSync("bash", ["-eo", "pipefail", "-c", `list=${JSON.stringify(list.replace(/\\/g, "/"))}\n${preview[0]}\necho done`],
    { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim().split("\n").length, 21, "20 preview lines + done");
});

// ---- the real plan step against temporary git repositories --------------------------------------------------------------
function git(cwd, args) {
  const result = spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.test", "-c", "core.autocrlf=false", ...args],
    { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, `git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}
function commit(cwd, message) {
  git(cwd, ["add", "-A"]);
  git(cwd, ["commit", "-q", "-m", message]);
  return git(cwd, ["rev-parse", "HEAD"]);
}
function write(cwd, file, text) {
  const full = path.join(cwd, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}
const names = file => fs.readFileSync(file, "utf8").split("\0").filter(Boolean).sort();
const script = path.join(repo, "tools/ci/r2-changed-images.sh");
function runScript(cwd, args, env = {}) {
  return spawnSync("bash", [script, ...args], { cwd, encoding: "utf8", env: { ...process.env, ...env } });
}
const FOLDER = "25_풍덕중_2학기_기말_중3_기출";

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-plan-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q"]);
  write(dir, `archive/assets/images/${FOLDER}/q 1(a).png`, "v1");
  write(dir, `archive/assets/images/${FOLDER}/keep.png`, "keep");
  write(dir, "archive/assets/images/other/z.png", "z");
  const a = commit(dir, "base");
  write(dir, `archive/assets/images/${FOLDER}/q 1(a).png`, "v2");
  write(dir, "archive/assets/images/other/new.png", "n");
  const b = commit(dir, "change");
  const bin = path.join(dir, "bin");
  write(dir, "bin/gh", '#!/usr/bin/env bash\n[ -z "${GH_FAKE_SHA:-}" ] || echo "$GH_FAKE_SHA"\n');
  fs.chmodSync(path.join(bin, "gh"), 0o755);
  const plan = path.join(dir, "plan.sh");
  fs.writeFileSync(plan, stepRun("Plan upload"));
  return { dir, a, b, bin, plan };
}
function runPlan(fx, env) {
  const temp = path.join(fx.dir, "runner-temp");
  fs.rmSync(temp, { recursive: true, force: true });
  fs.mkdirSync(temp);
  const summary = path.join(temp, "summary.md");
  const output = path.join(temp, "output.txt");
  fs.writeFileSync(summary, "");
  fs.writeFileSync(output, "");
  const result = spawnSync("bash", ["-eo", "pipefail", fx.plan], {
    cwd: fx.dir,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${fx.bin}${path.delimiter}${process.env.PATH}`,
      RUNNER_TEMP: temp, GITHUB_STEP_SUMMARY: summary, GITHUB_OUTPUT: output,
      GITHUB_REPOSITORY: "o/r", GH_TOKEN: "x", GH_FAKE_SHA: "", FOLDER_INPUT: "", PUSH_BEFORE: "", GITHUB_SHA: fx.b,
      ...limits, ...env
    }
  });
  return { ...result, list: path.join(temp, "changed-images.z"), summary: fs.readFileSync(summary, "utf8"), output: fs.readFileSync(output, "utf8") };
}
function installScript(fx) {
  const target = path.join(fx.dir, "tools/ci/r2-changed-images.sh");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(script, target);
}

test("plan (a): uses the last successful run's head as the base", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_SHA: fx.a, PUSH_BEFORE: fx.b });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=push images_to_check=2 \(changed since last successful run /);
  assert.deepEqual(names(r.list), [`${FOLDER}/q 1(a).png`, "other/new.png"].sort());
  assert.match(r.output, /mode=push\ncount=2\n/);
});

test("plan (b): without a last successful run it falls back to this push's before and says so", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_SHA: "", PUSH_BEFORE: fx.a });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=push images_to_check=2 \(fallback to this push only \(no earlier successful run found\)/);
  assert.match(r.stdout, /earlier unsuccessful runs may be missing/);
  assert.equal(names(r.list).length, 2);
});

test("plan (c): when no base can be diffed the job fails, uploads nothing and never selects everything", t => {
  const fx = fixture(t);
  installScript(fx);
  const unknown = "1".repeat(40);
  for (const env of [
    { GH_FAKE_SHA: "", PUSH_BEFORE: "" },
    { GH_FAKE_SHA: "", PUSH_BEFORE: "0".repeat(40) },
    { GH_FAKE_SHA: unknown, PUSH_BEFORE: unknown }
  ]) {
    const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", ...env });
    assert.notEqual(r.status, 0, JSON.stringify(env));
    assert.equal(fs.existsSync(r.list), false, "no file list");
    assert.doesNotMatch(r.output, /mode=/, "no outputs, so the copy step is skipped");
    assert.match(r.stdout, /R2 plan: mode=none images_to_check=0 \(could not decide which images changed/);
    assert.ok(r.summary.includes("어떤 이미지가 바뀌었는지 정하지 못해 올리지 않았음. 수동 실행에서 폴더를 지정해 올릴 것"));
  }
});

test("plan: a push over the safety limit fails instead of uploading or widening", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_SHA: fx.a, R2_MAX_IMAGES_PUSH: "1" });
  assert.notEqual(r.status, 0);
  assert.equal(fs.existsSync(r.list), false);
  assert.match(r.stdout, /more than 1 images changed; nothing uploaded/);
});

test("plan: workflow_dispatch uploads exactly the tracked images of the named folder", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", FOLDER_INPUT: FOLDER });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=folder images_to_check=2 \(manual run: folder /);
  assert.deepEqual(names(r.list), [`${FOLDER}/keep.png`, `${FOLDER}/q 1(a).png`].sort());
  const tooMany = runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", FOLDER_INPUT: FOLDER, R2_MAX_IMAGES_FOLDER: "1" });
  assert.notEqual(tooMany.status, 0);
  assert.equal(fs.existsSync(tooMany.list), false);
});

test("plan: rejected folder inputs fail without a list and never run injected shell text", t => {
  const fx = fixture(t);
  installScript(fx);
  for (const folder of ["", "..", "../other", "other/..", "/etc", "C:\\x", FOLDER + "/", "a/b", " " + FOLDER, ".hidden", "no-such-folder", `x"; touch pwned; "`, "$(touch pwned)"]) {
    const r = runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", FOLDER_INPUT: folder });
    assert.notEqual(r.status, 0, JSON.stringify(folder));
    assert.equal(fs.existsSync(r.list), false, JSON.stringify(folder));
    assert.equal(fs.existsSync(path.join(fx.dir, "pwned")), false, "input is data, not shell");
  }
});

// ---- the list builder -----------------------------------------------------------------------------------------------
test("changed-image list: exact relative names with Korean, spaces and parentheses; deletions and other paths are not listed", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-changed-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q"]);
  const folder = "25_매산고_1학기_기말_고2_수학I";
  write(dir, `archive/assets/images/${folder}/q 1(a).png`, "v1");
  write(dir, `archive/assets/images/${folder}/keep.png`, "keep");
  write(dir, "archive/assets/images/old/gone.png", "gone");
  write(dir, "archive/assets/images/old/renamed-from.png", "rename me");
  const a = commit(dir, "base");

  write(dir, `archive/assets/images/${folder}/q 1(a).png`, "v2 modified");
  write(dir, `archive/assets/images/${folder}/해설 그림 (2).png`, "new");
  write(dir, "archive/assets/images/new folder/q'1.png", "quote");
  fs.rmSync(path.join(dir, "archive/assets/images/old/gone.png"));
  fs.renameSync(path.join(dir, "archive/assets/images/old/renamed-from.png"), path.join(dir, "archive/assets/images/old/renamed-to.png"));
  write(dir, "archive/exams/not-an-image.js", "x");
  const b = commit(dir, "change");

  const out = path.join(dir, "list.z");
  const result = runScript(dir, [a, b, out]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(names(out), [
    "new folder/q'1.png",
    "old/renamed-to.png",
    `${folder}/q 1(a).png`,
    `${folder}/해설 그림 (2).png`
  ].sort());
  assert.ok(!fs.readFileSync(out, "utf8").includes("\n"), "entries are NUL separated only");

  // A range covering several commits keeps every change (no first-parent loss).
  write(dir, "archive/assets/images/later/z.png", "z");
  const c = commit(dir, "later");
  const wide = path.join(dir, "wide.z");
  assert.equal(runScript(dir, [a, c, wide]).status, 0);
  assert.equal(names(wide).length, 5);
  const narrow = path.join(dir, "narrow.z");
  assert.equal(runScript(dir, [b, c, narrow]).status, 0);
  assert.deepEqual(names(narrow), ["later/z.png"]);

  // Same commit: empty list, success.
  const same = path.join(dir, "same.z");
  assert.equal(runScript(dir, [c, c, same]).status, 0);
  assert.equal(fs.readFileSync(same, "utf8"), "");

  // Over the limit: refused (exit 3), no list, nothing truncated.
  const big = path.join(dir, "big.z");
  const over = runScript(dir, [a, c, big], { R2_MAX_IMAGES: "4" });
  assert.equal(over.status, 3, over.stderr);
  assert.equal(fs.existsSync(big), false);
  assert.equal(fs.existsSync(`${big}.part`), false);
});

test("changed-image list fails (never an empty success) for unreadable ranges", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-changed-bad-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q"]);
  write(dir, "archive/assets/images/a/q.png", "1");
  const head = commit(dir, "one");
  const out = path.join(dir, "list.z");
  assert.notEqual(runScript(dir, ["not-a-sha", head, out]).status, 0);
  assert.notEqual(runScript(dir, [head, "0".repeat(40), out]).status, 0);
  // Unknown base and no remote to fetch it from: must fail, not report "no images".
  const unknown = runScript(dir, ["1".repeat(40), head, out]);
  assert.notEqual(unknown.status, 0);
  assert.equal(fs.existsSync(out), false, "no list is produced for a range that could not be read");
  assert.equal(fs.existsSync(`${out}.part`), false);
});

test("folder list: git-tracked images of one folder with exact names; bad folder names are rejected", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-folder-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q"]);
  write(dir, `archive/assets/images/${FOLDER}/q 1(a).png`, "1");
  write(dir, `archive/assets/images/${FOLDER}/해설/그림 (2).png`, "2");
  write(dir, "archive/assets/images/other/z.png", "z");
  commit(dir, "base");
  write(dir, `archive/assets/images/${FOLDER}/untracked.png`, "u");
  const out = path.join(dir, "list.z");
  const ok = runScript(dir, ["--folder", FOLDER, out]);
  assert.equal(ok.status, 0, ok.stderr);
  assert.deepEqual(names(out), [`${FOLDER}/q 1(a).png`, `${FOLDER}/해설/그림 (2).png`].sort(), "tracked only, relative to the image root");
  fs.rmSync(out);
  const codes = new Map([["", 4], ["..", 4], ["../other", 4], ["a/b", 4], ["/abs", 4], [".hidden", 4], ["x:y", 4], [`${FOLDER} `, 4], ["missing", 5], ["*", 5]]);
  for (const [folder, status] of codes) {
    const r = runScript(dir, ["--folder", folder, out]);
    assert.equal(r.status, status, `${JSON.stringify(folder)}: ${r.stderr}`);
    assert.equal(fs.existsSync(out), false, JSON.stringify(folder));
  }
  const over = runScript(dir, ["--folder", FOLDER, out], { R2_MAX_IMAGES: "1" });
  assert.equal(over.status, 3);
  assert.equal(fs.existsSync(out), false);
});

// ---- unchanged contracts -----------------------------------------------------------------------------------------------
test("runs are serialized without cancelling an upload in progress", () => {
  assert.match(workflow, /\nconcurrency:\n\s+group: r2-archive-assets-copy\n\s+cancel-in-progress: false\n/);
  assert.doesNotMatch(workflow, /cancel-in-progress: true/);
});

test("rclone is pinned to an exact version with a checksum and is not installed from the moving install script", () => {
  assert.match(workflow, /RCLONE_VERSION: v\d+\.\d+\.\d+\n/);
  assert.match(workflow, /RCLONE_ZIP_SHA256: [0-9a-f]{64}\n/);
  assert.match(code, /sha256sum -c -/);
  assert.doesNotMatch(code, /install\.sh/);
});

test("the run log carries what was planned and uploaded, and nothing secret; the policy is stated at the top", () => {
  assert.match(code, /R2 plan: mode=\$\{mode\} images_to_check=\$\{count\}/);
  assert.match(code, /R2 copy: mode=\$\{PLAN_MODE\} requested=\$\{PLAN_COUNT\} uploaded=\$\{uploaded\} server_side_copies=\$\{server_side\} mtime_updates=\$\{mtime_updates\}/);
  assert.doesNotMatch(code, /-vv|--dump|--progress/, "no debug dumps (headers, keys) and no progress spam");
  assert.doesNotMatch(code, /echo[^\n]*(SECRET|ACCESS_KEY)/);
  assert.match(workflow, /# [^\n]*2026-11-17[^\n]*Class A/);
});

test("push trigger shape the other release tests rely on is unchanged", () => {
  assert.match(workflow, /\n  push:\n\s+branches:\s*\[main\]/);
  assert.match(workflow, /paths:\n\s+- "archive\/assets\/images\/\*\*"/);
  assert.match(workflow, /on:\n  workflow_dispatch:/);
});
