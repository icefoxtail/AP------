import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// R2 bills each write-class request. The copy workflow must not re-touch every exam image on each push.
// These checks keep that contract: push uploads only changed images, every copy skips mtime refreshes,
// the full comparison is manual/fallback only, and no image can be skipped between runs.
const repo = fileURLToPath(new URL("..", import.meta.url));
const read = file => fs.readFileSync(path.join(repo, file), "utf8");
const workflow = read(".github/workflows/r2-archive-assets-copy.yml");
const code = workflow.split("\n").filter(line => !/^\s*#/.test(line)).join("\n");

// Every `rclone copy` invocation (the continued command lines up to the first line without a trailing backslash).
function rcloneCommands(name) {
  const lines = code.split("\n");
  const commands = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!new RegExp(`\\brclone ${name} `).test(lines[i])) continue;
    let text = lines[i];
    while (/\\\s*$/.test(lines[i]) && i + 1 < lines.length) { i += 1; text += `\n${lines[i]}`; }
    commands.push(text);
  }
  return commands;
}

test("every rclone copy skips mtime refresh and compares by checksum", () => {
  const copies = rcloneCommands("copy");
  assert.equal(copies.length, 2, "one push-mode copy and one full-compare copy");
  for (const command of copies) {
    assert.match(command, /--no-update-modtime/, command);
    assert.match(command, /--checksum/, command);
    assert.match(command, /r2-ap-assets:\$\{R2_BUCKET\}\/exams\/images/, "same key layout the Pages release gate checks");
  }
});

test("a push uploads only the listed files; the whole-tree copy is full mode only", () => {
  const [listed, whole] = rcloneCommands("copy");
  assert.match(listed, /--files-from0 "\$PLAN_LIST"/);
  assert.match(listed, /--no-traverse/);
  assert.doesNotMatch(whole, /--files-from/);
  assert.match(whole, /--fast-list/);
  // The listed copy sits in the PLAN_MODE=push branch, the whole-tree copy in its else branch.
  const body = code.slice(code.indexOf("Copy archive image assets"));
  const iPush = body.indexOf('if [ "$PLAN_MODE" = push ]');
  const iListed = body.indexOf("--files-from0");
  const iElse = body.indexOf("\n          else\n");
  const iWhole = body.indexOf("--fast-list");
  assert.ok(iPush >= 0 && iPush < iListed && iListed < iElse && iElse < iWhole, "push branch first, whole-tree copy only in else");
  // Only a manual run or a failed plan reaches the whole-tree branch.
  assert.match(code, /GITHUB_EVENT_NAME[^\n]*!= "push"/);
  assert.match(code, /mode=full\n/);
  assert.equal((code.match(/mode=push/g) || []).length >= 1, true);
});

test("the plan diffs against the last SUCCESSFUL run, never only the push's own before", () => {
  assert.match(code, /actions\/workflows\/r2-archive-assets-copy\.yml\/runs\?branch=main&status=success/);
  assert.doesNotMatch(code, /github\.event\.before/, "a replaced or failed run would otherwise leave its images behind");
  assert.match(code, /bash tools\/ci\/r2-changed-images\.sh "\$base" "\$GITHUB_SHA" "\$list"/);
  assert.match(code, /actions: read/);
  // Fallbacks pick the full comparison, never "nothing to do".
  for (const reason of ["no earlier successful run found: compare every image", "could not diff against"])
    assert.ok(code.includes(reason), reason);
});

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

test("the run log carries what was requested and uploaded, and nothing secret", () => {
  assert.match(code, /R2 plan: mode=\$\{mode\} images_to_check=\$\{count\}/);
  assert.match(code, /R2 copy: mode=\$\{PLAN_MODE\} requested=\$\{PLAN_COUNT\} uploaded=\$\{uploaded\}/);
  assert.doesNotMatch(code, /-vv|--dump|--progress/, "no debug dumps (headers, keys) and no progress spam");
  assert.doesNotMatch(code, /echo[^\n]*(SECRET|ACCESS_KEY)/);
});

test("the post-upload check reads back only the uploaded files instead of listing every prefix", () => {
  const checks = rcloneCommands("check");
  assert.equal(checks.length, 1);
  assert.match(checks[0], /--files-from0 "\$PLAN_LIST"/);
  assert.match(checks[0], /--one-way/);
  assert.doesNotMatch(code, /rclone lsf/);
});

test("trigger shape the other release tests rely on is unchanged", () => {
  assert.match(workflow, /workflow_dispatch:\s*\n\s*push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /paths:\n\s+- "archive\/assets\/images\/\*\*"/);
});

// ---- the changed-image list, on a real repository --------------------------------------------------------------------
const script = path.join(repo, "tools/ci/r2-changed-images.sh");
function git(cwd, args, input) {
  const result = spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.test", "-c", "core.autocrlf=false", ...args],
    { cwd, encoding: "utf8", input });
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
function runScript(cwd, base, head, out) {
  return spawnSync("bash", [script, base, head, out], { cwd, encoding: "utf8" });
}
const names = file => fs.readFileSync(file, "utf8").split("\0").filter(Boolean).sort();

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
  const result = runScript(dir, a, b, out);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(names(out), [
    "new folder/q'1.png",
    "old/renamed-to.png",
    `${folder}/q 1(a).png`,
    `${folder}/해설 그림 (2).png`
  ].sort());
  assert.ok(!fs.readFileSync(out, "utf8").includes("\n"), "entries are NUL separated only");

  // A merge-like range covering several commits keeps every change (no first-parent loss).
  write(dir, "archive/assets/images/later/z.png", "z");
  const c = commit(dir, "later");
  const wide = path.join(dir, "wide.z");
  assert.equal(runScript(dir, a, c, wide).status, 0);
  assert.equal(names(wide).length, 5);
  const narrow = path.join(dir, "narrow.z");
  assert.equal(runScript(dir, b, c, narrow).status, 0);
  assert.deepEqual(names(narrow), ["later/z.png"]);

  // Same commit: empty list, success.
  const same = path.join(dir, "same.z");
  assert.equal(runScript(dir, c, c, same).status, 0);
  assert.equal(fs.readFileSync(same, "utf8"), "");
});

test("changed-image list fails (so the workflow falls back to the full comparison) for unreadable ranges", t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "r2-changed-bad-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q"]);
  write(dir, "archive/assets/images/a/q.png", "1");
  const head = commit(dir, "one");
  const out = path.join(dir, "list.z");
  assert.notEqual(runScript(dir, "not-a-sha", head, out).status, 0);
  assert.notEqual(runScript(dir, head, "0".repeat(40), out).status, 0);
  // Unknown base and no remote to fetch it from: must fail, not report "no images".
  const unknown = runScript(dir, "1".repeat(40), head, out);
  assert.notEqual(unknown.status, 0);
  assert.equal(fs.existsSync(out), false, "no list is produced for a range that could not be read");
});
