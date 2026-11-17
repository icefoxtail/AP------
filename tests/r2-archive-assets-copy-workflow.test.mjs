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

test("manual run takes a required `mode` (folder|catch_up) and an optional `folder`; both reach the shell only through env", () => {
  assert.match(workflow, /workflow_dispatch:\n\s+inputs:\n\s+mode:\n(?:\s+(?:description|type|default):[^\n]*\n)*\s+required: true\n(?:\s+(?:type|default):[^\n]*\n)*\s+options:\n\s+- folder\n\s+- catch_up\n/, "mode is a required choice");
  assert.match(workflow, /\n {6}folder:\n\s+description:[^\n]*\n\s+required: false\n/, "folder is needed only for mode=folder; the script validates it");
  assert.match(workflow, /^\s+FOLDER_INPUT: \$\{\{ github\.event\.inputs\.folder \}\}$/m);
  assert.match(workflow, /^\s+MODE_INPUT: \$\{\{ github\.event\.inputs\.mode \}\}$/m);
  assert.equal((workflow.match(/github\.event\.inputs\.folder/g) || []).length, 1, "folder referenced once");
  const scripts = code.replace(/^\s+(FOLDER_INPUT|MODE_INPUT): .*$/gm, "").replace(/^run-name: .*$/m, "");
  assert.doesNotMatch(scripts, /\$\{\{[^}]*inputs/, "no ${{ }} input expansion inside run scripts");
});

test("run-name carries the mode but never the folder text", () => {
  const runName = workflow.match(/^run-name: (.*)$/m);
  assert.ok(runName, "run-name exists");
  assert.match(runName[1], /R2 image copy \(\$\{\{ github\.event_name == 'push' && 'push' \|\| github\.event\.inputs\.mode \}\}\)/);
  assert.doesNotMatch(runName[1], /inputs\.folder/);
  assert.ok(scriptText.includes('"R2 image copy (catch_up)"'), "the base lookup keys on the same name");
});

test("the base is the newest successful push or catch_up run (folder runs excluded), then this push's before, then a hard failure", () => {
  assert.match(code, /actions\/workflows\/r2-archive-assets-copy\.yml\/runs\?branch=main&status=success&per_page=30/);
  assert.match(code, /\| bash tools\/ci\/r2-changed-images\.sh --pick-base/);
  assert.match(code, /PUSH_BEFORE: \$\{\{ github\.event\.before \}\}/);
  assert.match(code, /actions: read/);
  // Only event=push or a workflow_dispatch named exactly "(catch_up)" qualifies; folder runs never do.
  assert.match(scriptCode, /run\.event === "push" \|\| \(run\.event === "workflow_dispatch" && \(run\.display_title === catchUpTitle/);
  assert.doesNotMatch(scriptCode, /\(folder\)/, "no folder run name is accepted");
  const plan = code.slice(code.indexOf("Plan upload"));
  assert.ok(plan.indexOf("pick_base ||") < plan.indexOf('before="${PUSH_BEFORE'), "(a) before (b)");
  assert.match(plan, /fallback to this push only \(\$\{why\}\)/, "the (a)->(b) fallback leaves a reason in the log line");
  assert.match(plan, /fail_plan "could not decide which images changed/);
  assert.ok(plan.includes("어떤 이미지가 바뀌었는지 정하지 못해 올리지 않았음. 수동 실행 mode=folder로 폴더를 지정하거나, 원인을 고친 뒤 mode=catch_up으로 올릴 것"));
  assert.ok(plan.includes("수동 실행 mode=catch_up으로 올릴 것"), "an over-limit push points to catch_up");
  assert.equal((workflow.match(/^\s+R2_MAX_IMAGES_PUSH: "\d+"$/gm) || []).length, 1);
  assert.equal((workflow.match(/^\s+R2_MAX_IMAGES_FOLDER: "\d+"$/gm) || []).length, 1);
  assert.equal((workflow.match(/^\s+R2_MAX_IMAGES_CATCH_UP: "10000"$/gm) || []).length, 1);
  assert.match(code, /no_check_bucket = true/);
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
  R2_MAX_IMAGES_FOLDER: workflow.match(/R2_MAX_IMAGES_FOLDER: "(\d+)"/)[1],
  R2_MAX_IMAGES_CATCH_UP: workflow.match(/R2_MAX_IMAGES_CATCH_UP: "(\d+)"/)[1]
};
// What `gh api .../runs?...&per_page=30` returns (newest first); the fake gh prints it and the real --pick-base reads it.
const RUN_PUSH = sha => ({ event: "push", display_title: "Merge pull request #1", head_sha: sha });
const RUN_CATCH_UP = sha => ({ event: "workflow_dispatch", display_title: "R2 image copy (catch_up)", head_sha: sha });
const RUN_FOLDER = sha => ({ event: "workflow_dispatch", display_title: "R2 image copy (folder)", head_sha: sha });
const RUN_OLD_MANUAL = sha => ({ event: "workflow_dispatch", display_title: "R2 Archive Assets Copy", head_sha: sha });
const runsJson = runs => JSON.stringify({ workflow_runs: runs });

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
  write(dir, "bin/gh", '#!/usr/bin/env bash\n[ -z "${GH_FAKE_RUNS:-}" ] || printf "%s" "$GH_FAKE_RUNS"\n');
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
      GITHUB_REPOSITORY: "o/r", GH_TOKEN: "x", GH_FAKE_RUNS: "", MODE_INPUT: "", FOLDER_INPUT: "", PUSH_BEFORE: "", GITHUB_SHA: fx.b, GITHUB_REF: "refs/heads/main",
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

const PICK_FAIL_KO = "어떤 이미지가 바뀌었는지 정하지 못해 올리지 않았음. 수동 실행 mode=folder로 폴더를 지정하거나, 원인을 고친 뒤 mode=catch_up으로 올릴 것";
const noOutput = r => {
  assert.notEqual(r.status, 0);
  assert.equal(fs.existsSync(r.list), false, "no file list");
  assert.doesNotMatch(r.output, /mode=/, "no outputs, so the copy step is skipped");
};

test("plan (a): a push uses the newest successful push run's head as the base", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), PUSH_BEFORE: fx.b });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=push images_to_check=2 \(changed since last successful run /);
  assert.deepEqual(names(r.list), [`${FOLDER}/q 1(a).png`, "other/new.png"].sort());
  assert.match(r.output, /mode=push\ncount=2\n/);
});

test("plan: a successful FOLDER run is never the base; a catch_up or push success is", t => {
  const fx = fixture(t);
  installScript(fx);
  const push = extra => runPlan(fx, { GITHUB_EVENT_NAME: "push", PUSH_BEFORE: "", GH_FAKE_RUNS: runsJson(extra) });
  // (a) A newer successful folder run (and an old-style manual run) sit in front of an older push success.
  // Using the folder run's sha (= HEAD) as base would find "nothing changed"; the push success must win.
  const skipped = push([RUN_FOLDER(fx.b), RUN_OLD_MANUAL(fx.b), RUN_PUSH(fx.a)]);
  assert.equal(skipped.status, 0, skipped.stdout + skipped.stderr);
  assert.match(skipped.stdout, /images_to_check=2 \(changed since last successful run /);
  // Only folder runs: no base at all, so (b) does not apply (no before) and the job fails.
  noOutput(push([RUN_FOLDER(fx.b), RUN_OLD_MANUAL(fx.a)]));
  // (b) A newer catch_up success IS the base (HEAD here, so nothing is left to upload).
  const viaCatchUp = push([RUN_FOLDER(fx.a), RUN_CATCH_UP(fx.b), RUN_PUSH(fx.a)]);
  assert.equal(viaCatchUp.status, 0, viaCatchUp.stdout + viaCatchUp.stderr);
  assert.match(viaCatchUp.stdout, /R2 plan: mode=push images_to_check=0 /);
  // (c) A newer push success wins over an older catch_up success.
  const viaPush = push([RUN_PUSH(fx.b), RUN_CATCH_UP(fx.a)]);
  assert.equal(viaPush.status, 0, viaPush.stdout + viaPush.stderr);
  assert.match(viaPush.stdout, /R2 plan: mode=push images_to_check=0 /);
  const older = push([RUN_CATCH_UP(fx.a), RUN_PUSH(fx.b)]);
  assert.match(older.stdout, /R2 plan: mode=push images_to_check=2 /, "list order = newest first: the catch_up run is the newest here");
});

test("plan (b): without a usable base run a push falls back to its own before and says so", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_RUNS: "", PUSH_BEFORE: fx.a });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=push images_to_check=2 \(fallback to this push only \(no earlier successful run found\)/);
  assert.match(r.stdout, /earlier unsuccessful runs may be missing/);
  assert.equal(names(r.list).length, 2);
  const onlyFolder = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_RUNS: runsJson([RUN_FOLDER(fx.b)]), PUSH_BEFORE: fx.a });
  assert.equal(onlyFolder.status, 0, "falls to (b), not to the folder run");
  assert.match(onlyFolder.stdout, /images_to_check=2 \(fallback to this push only/);
});

test("plan (c): when no base can be diffed the push fails, uploads nothing and never selects everything", t => {
  const fx = fixture(t);
  installScript(fx);
  const unknown = "1".repeat(40);
  for (const env of [
    { GH_FAKE_RUNS: "", PUSH_BEFORE: "" },
    { GH_FAKE_RUNS: "", PUSH_BEFORE: "0".repeat(40) },
    { GH_FAKE_RUNS: runsJson([RUN_PUSH(unknown)]), PUSH_BEFORE: unknown },
    { GH_FAKE_RUNS: "not json", PUSH_BEFORE: "" }
  ]) {
    const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", ...env });
    noOutput(r);
    assert.match(r.stdout, /R2 plan: mode=none images_to_check=0 \(could not decide which images changed/);
    assert.ok(r.summary.includes(PICK_FAIL_KO));
  }
});

test("plan: a push over the safety limit fails and tells to run catch_up", t => {
  const fx = fixture(t);
  installScript(fx);
  const r = runPlan(fx, { GITHUB_EVENT_NAME: "push", GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), R2_MAX_IMAGES_PUSH: "1" });
  noOutput(r);
  assert.match(r.stdout, /more than 1 images changed; nothing uploaded/);
  assert.ok(r.summary.includes("수동 실행 mode=catch_up으로 올릴 것"));
});

test("plan: catch_up uploads the changed list since the base; no base, a bad diff, a limit or a non-main ref fail without a list", t => {
  const fx = fixture(t);
  installScript(fx);
  const catchUp = env => runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", MODE_INPUT: "catch_up", ...env });
  const ok = catchUp({ GH_FAKE_RUNS: runsJson([RUN_FOLDER(fx.b), RUN_PUSH(fx.a)]) });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, /R2 plan: mode=catch_up images_to_check=2 \(changed since last successful push\/catch_up run /);
  assert.deepEqual(names(ok.list), [`${FOLDER}/q 1(a).png`, "other/new.png"].sort());
  assert.match(ok.output, /mode=catch_up\ncount=2\n/);
  // (d) no base: fail, no fallback to the push's before.
  for (const env of [{ GH_FAKE_RUNS: "" }, { GH_FAKE_RUNS: runsJson([RUN_FOLDER(fx.a)]) }, { GH_FAKE_RUNS: runsJson([RUN_PUSH("1".repeat(40))]) }]) {
    const r = catchUp({ ...env, PUSH_BEFORE: fx.a });
    noOutput(r);
    assert.match(r.stdout, /could not decide which images changed/);
    assert.ok(r.summary.includes(PICK_FAIL_KO));
  }
  // (e) over the catch_up limit.
  const big = catchUp({ GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), R2_MAX_IMAGES_CATCH_UP: "1" });
  noOutput(big);
  assert.match(big.stdout, /more than 1 images changed; nothing uploaded/);
  // Only on main.
  noOutput(catchUp({ GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), GITHUB_REF: "refs/heads/other" }));
});

test("plan: mode=folder uploads exactly the tracked images of the named folder and is not a base", t => {
  const fx = fixture(t);
  installScript(fx);
  const folder = env => runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", MODE_INPUT: "folder", GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), ...env });
  const r = folder({ FOLDER_INPUT: FOLDER });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /R2 plan: mode=folder images_to_check=2 \(manual run: folder .*never used as a base\)/);
  assert.deepEqual(names(r.list), [`${FOLDER}/keep.png`, `${FOLDER}/q 1(a).png`].sort(), "the push base is not consulted for a folder run");
  assert.match(r.output, /mode=folder\ncount=2\n/);
  noOutput(folder({ FOLDER_INPUT: FOLDER, R2_MAX_IMAGES_FOLDER: "1" }));
});

test("plan: mode=folder with an empty or rejected folder, and an unknown mode, fail without a list; input text never runs as shell", t => {
  const fx = fixture(t);
  installScript(fx);
  const run = env => runPlan(fx, { GITHUB_EVENT_NAME: "workflow_dispatch", GH_FAKE_RUNS: runsJson([RUN_PUSH(fx.a)]), ...env });
  for (const folder of ["", "..", "../other", "other/..", "/etc", "C:\\x", FOLDER + "/", "a/b", " " + FOLDER, ".hidden", "no-such-folder", `x"; touch pwned; "`, "$(touch pwned)"]) {
    const r = run({ MODE_INPUT: "folder", FOLDER_INPUT: folder });
    noOutput(r);
    assert.equal(fs.existsSync(path.join(fx.dir, "pwned")), false, "input is data, not shell");
  }
  for (const mode of ["", "full", "folder; touch pwned"]) {
    noOutput(run({ MODE_INPUT: mode, FOLDER_INPUT: FOLDER }));
    assert.equal(fs.existsSync(path.join(fx.dir, "pwned")), false);
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
  assert.match(workflow, /R2_RCLONE_VERSION: v\d+\.\d+\.\d+\n/);
  assert.match(workflow, /R2_RCLONE_ZIP_SHA256: [0-9a-f]{64}\n/);
  assert.match(code, /sha256sum -c -/);
  assert.doesNotMatch(code, /install\.sh/);
});

// rclone reads every RCLONE_<FLAG> environment variable as its own command-line flag. RCLONE_VERSION=v1.76.0 became
// `--version v1.76.0` and run 44099228641 failed in the install step. No RCLONE_* variable may be defined in the
// workflow or the helper script. Allow-list: none (the remote is configured by a config file, not RCLONE_CONFIG_*).
const ALLOWED_RCLONE_ENV = new Set();

test("no variable named RCLONE_* is defined anywhere the rclone process could inherit it", () => {
  const definitions = [];
  for (const [label, text] of [["workflow", code], ["script", scriptCode]]) {
    for (const line of text.split("\n")) {
      // YAML env keys (`  RCLONE_X: value`), shell assignments, and `echo RCLONE_X=... >> $GITHUB_ENV`.
      for (const match of line.matchAll(/(?:^|[\s"'{;|&(])(RCLONE_[A-Za-z0-9_]*)(?=\s*[:=])/g)) {
        if (!ALLOWED_RCLONE_ENV.has(match[1])) definitions.push(`${label}: ${match[1]} in "${line.trim()}"`);
      }
      for (const match of line.matchAll(/\b(?:export|declare\s+-x|typeset\s+-x)\s+(RCLONE_[A-Za-z0-9_]*)/g)) {
        if (!ALLOWED_RCLONE_ENV.has(match[1])) definitions.push(`${label}: export ${match[1]}`);
      }
    }
  }
  assert.deepEqual(definitions, []);
  assert.doesNotMatch(code, /GITHUB_ENV[^\n]*RCLONE_|RCLONE_[^\n]*GITHUB_ENV/, "nothing exported through GITHUB_ENV");
});

test("the Install rclone final command runs with the job env and a rclone that rejects any RCLONE_* variable", () => {
  const lines = workflow.split("\n");
  // Job-level env: simple `KEY: value` lines between `    env:` and `    steps:`; secrets are replaced by dummies.
  const envStart = lines.findIndex(line => /^    env:\s*$/.test(line));
  const stepsStart = lines.findIndex(line => /^    steps:\s*$/.test(line));
  assert.ok(envStart > 0 && stepsStart > envStart);
  const env = {};
  for (const line of lines.slice(envStart + 1, stepsStart)) {
    const m = /^      ([A-Za-z_][A-Za-z0-9_]*): (.*)$/.exec(line);
    if (m) env[m[1]] = /\$\{\{/.test(m[2]) ? "dummy" : m[2].replace(/^"(.*)"$/, "$1");
  }
  // The Install rclone step has no step-level env, so the process sees exactly the job env.
  const stepStart = lines.findIndex(line => /- name: Install rclone \(pinned\)/.test(line));
  assert.ok(stepStart > stepsStart);
  let stepEnd = lines.findIndex((line, i) => i > stepStart && /^      (- name:|#)/.test(line));
  if (stepEnd < 0) stepEnd = lines.length;
  const step = lines.slice(stepStart, stepEnd).join("\n");
  assert.doesNotMatch(step, /\n        env:/, "the install step must stay env-free so the job env is what it sees");
  const runLines = step.split("\n").filter(line => /^          \S/.test(line));
  const last = runLines[runLines.length - 1].trim();
  assert.match(last, /^rclone version\b/);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fake-rclone-"));
  try {
    const fake = path.join(dir, "rclone");
    fs.writeFileSync(fake, [
      "#!/bin/sh",
      "for name in $(env | cut -d= -f1); do",
      "  case \"$name\" in",
      "    RCLONE_*) echo \"CRITICAL: Invalid value when setting --version from environment variable $name\" >&2; exit 1 ;;",
      "  esac",
      "done",
      "echo \"rclone v0.0.0-fake\"",
      "echo \"- os/version: fake\"",
      ""
    ].join("\n"), { mode: 0o755 });
    const childEnv = { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}` };
    for (const key of Object.keys(childEnv)) if (key.startsWith("RCLONE_")) delete childEnv[key];
    Object.assign(childEnv, env);
    const result = spawnSync("bash", ["-eo", "pipefail", "-c", last], { env: childEnv, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /rclone v0\.0\.0-fake/);

    // The fake really is strict: the old variable name makes it fail.
    const bad = spawnSync("bash", ["-eo", "pipefail", "-c", last], { env: { ...childEnv, RCLONE_VERSION: "v1.76.0" }, encoding: "utf8" });
    assert.notEqual(bad.status, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the plan step has what a real runner needs: GH_TOKEN for gh, actions:read, and the gh run listing", () => {
  assert.match(workflow, /\npermissions:\n\s+contents: read\n\s+actions: read\n/);
  assert.match(workflow, /id: plan[\s\S]*?env:\n\s+GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(code, /gh api "repos\/\$\{GITHUB_REPOSITORY\}\/actions\/workflows\/r2-archive-assets-copy\.yml\/runs/);
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
