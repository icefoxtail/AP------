import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const helper = fileURLToPath(new URL("../tools/ci/git-push-derived-with-retry.mjs", import.meta.url));
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const node = process.execPath;
const q = p => `"${p}"`;

// Temp bare "origin" + a "runner" clone (the workflow) + a "competitor" clone (the other writer).
// Derived data: out.txt is a pure function of input.txt; consumed requests live in inbox/.
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "push-derived-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const origin = path.join(dir, "origin.git"), runner = path.join(dir, "runner"), competitor = path.join(dir, "competitor");
  git(dir, "init", "-q", "--bare", "--initial-branch=main", origin);
  const clone = target => {
    git(dir, "clone", "-q", "-c", "core.autocrlf=false", origin, target);
    for (const [k, v] of [["user.name", "test"], ["user.email", "test@example.invalid"], ["core.autocrlf", "false"]]) git(target, "config", k, v);
  };
  clone(runner);
  fs.mkdirSync(path.join(runner, "inbox"));
  fs.writeFileSync(path.join(runner, "input.txt"), "v1\n");
  fs.writeFileSync(path.join(runner, "inbox/r1.txt"), "request\n");
  fs.writeFileSync(path.join(runner, "out.txt"), "derived:v0\n");
  git(runner, "add", "-A"); git(runner, "commit", "-q", "-m", "seed"); git(runner, "push", "-q", "origin", "HEAD:main");
  clone(competitor);
  const tools = path.join(dir, "tools"); fs.mkdirSync(tools);
  // derive.mjs <repo>: out.txt = f(input.txt); consume (delete) the inbox requests.
  fs.writeFileSync(path.join(tools, "derive.mjs"), `import fs from "node:fs"; import path from "node:path";
const repo = path.resolve(process.argv[2]);
fs.writeFileSync(path.join(repo, "out.txt"), "derived:" + fs.readFileSync(path.join(repo, "input.txt"), "utf8").trim() + "\\n");
fs.rmSync(path.join(repo, "inbox"), { recursive: true, force: true });\n`);
  fs.writeFileSync(path.join(dir, "paths.txt"), "# derived outputs\nout.txt\ninbox/\nnever-existing-dir/\n");
  const derive = repoDir => execFileSync(node, [path.join(tools, "derive.mjs"), repoDir]);
  const competitorPush = (message, mutate) => {
    git(competitor, "pull", "-q", "--ff-only", "origin", "main");
    mutate();
    git(competitor, "add", "-A"); git(competitor, "commit", "-q", "-m", message); git(competitor, "push", "-q", "origin", "HEAD:main");
  };
  const run = (extra = []) => {
    const out = path.join(dir, "github-output.txt"), summary = path.join(dir, "summary.md");
    fs.rmSync(out, { force: true }); fs.rmSync(summary, { force: true });
    const r = spawnSync(node, [helper, "--paths-file", path.join(dir, "paths.txt"), "--message", "chore: derived [skip ci]",
      "--summary-file", summary, "--label", "test", ...extra], { cwd: runner, encoding: "utf8", env: { ...process.env, GITHUB_OUTPUT: out } });
    return { ...r, output: fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "", summary: fs.existsSync(summary) ? fs.readFileSync(summary, "utf8") : "" };
  };
  const originLog = () => git(origin, "log", "--format=%s", "main").split("\n");
  return { dir, origin, runner, competitor, tools, derive, competitorPush, run, originLog, originFile: name => git(origin, "show", `main:${name}`) };
}



test("3a: competitor already pushed the identical derived tree -> ALREADY_REFLECTED without an extra commit", t => {
  const f = fixture(t);
  f.competitorPush("competitor derived", () => f.derive(f.competitor)); // same derivation, pushed first
  f.derive(f.runner);
  const before = f.originLog().length;
  const r = f.run([]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=ALREADY_REFLECTED/);
  assert.match(r.output, new RegExp(`registered_sha=${git(f.origin, "rev-parse", "main")}`));
  assert.equal(f.originLog().length, before, "no extra commit may be pushed");
  assert.equal(git(f.runner, "rev-parse", "HEAD"), git(f.origin, "rev-parse", "main"));
  assert.equal(git(f.runner, "status", "--porcelain"), "");
  assert.match(r.summary, /ALREADY_REFLECTED/);
});

test("race with a competitor that left every derived path alone: no recomputation, one fast-forward push on top of the competitor, our files byte-identical", t => {
  const f = fixture(t);
  f.competitorPush("competitor input v2", () => fs.writeFileSync(path.join(f.competitor, "input.txt"), "v2\n"));
  const competitorTip = git(f.origin, "rev-parse", "main");
  f.derive(f.runner); // computed on input v1, before the competitor landed
  const ours = fs.readFileSync(path.join(f.runner, "out.txt"), "utf8");
  assert.equal(ours, "derived:v1\n");
  const r = f.run([]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.match(r.output, /attempts=2/);
  assert.match(r.output, /overlaid=true/);
  const tip = git(f.origin, "rev-parse", "main");
  assert.match(r.output, new RegExp(`registered_sha=${tip}`));
  assert.equal(git(f.origin, "rev-parse", `${tip}^`), competitorTip, "our commit is a child of the competitor tip (fast-forward)");
  assert.equal(f.originFile("input.txt"), "v2", "the competitor's change is kept");
  assert.equal(f.originFile("out.txt"), "derived:v1", "the derived file is exactly what was computed, not recomputed");
  assert.equal(git(f.origin, "ls-tree", "-r", "--name-only", tip, "--", "inbox"), "", "consumed requests stay removed");
  assert.equal(git(f.runner, "status", "--porcelain"), "");
  assert.equal(f.originLog().filter(s => s === "chore: derived [skip ci]").length, 1, "exactly one push of ours");
  assert.match(r.summary, /written onto a newer main tip/);
  assert.match(r.summary, /writing the same derived files onto the new tip/);
});

test("race with a competitor that touched a derived path: nothing is pushed, HANDED_OVER, the competitor's file is untouched", t => {
  const f = fixture(t);
  f.competitorPush("competitor edits a derived file", () => fs.writeFileSync(path.join(f.competitor, "out.txt"), "derived:by-someone-else\n"));
  const before = git(f.origin, "rev-parse", "main");
  f.derive(f.runner);
  const r = f.run([]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=HANDED_OVER/);
  assert.match(r.output, /^registered_sha=$/m, "a handed-over result is never certified");
  assert.equal(git(f.origin, "rev-parse", "main"), before, "main is exactly what the competitor left");
  assert.equal(f.originLog().length, 2);
  assert.match(r.summary, /next action: Nothing was pushed\. A commit that landed first changed registrar-owned paths \(out\.txt\)/);
});

test("a competitor that added a request to the inbox counts as touching a derived path", t => {
  const f = fixture(t);
  f.competitorPush("competitor adds a request", () => fs.writeFileSync(path.join(f.competitor, "inbox/r2.txt"), "request two\n"));
  f.derive(f.runner);
  const r = f.run([]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=HANDED_OVER/);
  assert.equal(f.originLog().filter(s => s === "chore: derived [skip ci]").length, 0);
});

test("repeated races: every attempt stays cheap, every candidate is verified against its own exact parent, and the attempts are capped", t => {
  const f = fixture(t), verify = path.join(f.tools, "verify-and-contend.mjs"), proof = path.join(f.dir, "candidates.jsonl");
  // The check runs before each push; the first two runs let another writer land a commit right afterwards.
  fs.writeFileSync(verify, `import fs from "node:fs"; import { execFileSync } from "node:child_process";
const base = process.env.DERIVED_BASE_SHA, head = process.env.DERIVED_HEAD_SHA;
const g = (cwd, ...a) => execFileSync("git", a, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
if (g(".", "rev-parse", head + "^") !== base) throw Error("EXACT_CANDIDATE_PARENT_REQUIRED");
fs.appendFileSync(${JSON.stringify(proof)}, JSON.stringify({ base, head }) + "\\n");
const n = fs.readFileSync(${JSON.stringify(proof)}, "utf8").trim().split("\\n").length;
if (n <= 2) {
  const c = ${JSON.stringify(f.competitor)};
  g(c, "pull", "-q", "--ff-only", "origin", "main");
  fs.appendFileSync(c + "/noise.txt", "n" + n + "\\n");
  g(c, "add", "-A"); g(c, "commit", "-q", "-m", "competitor noise " + n); g(c, "push", "-q", "origin", "HEAD:main");
}\n`);
  f.derive(f.runner);
  const r = f.run(["--verify-command", `${q(node)} ${q(verify)}`, "--max-attempts", "4"]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.match(r.output, /attempts=3/);
  const rows = fs.readFileSync(proof, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(rows.length, 3);
  for (let i = 1; i < rows.length; i++) assert.notEqual(rows[i].base, rows[i - 1].base, "each attempt sits on the newer competitor tip");
  assert.equal(git(f.origin, "rev-parse", `${rows[2].head}^`), rows[2].base);
  assert.equal(git(f.origin, "log", "--format=%s", "-3", "main").split("\n").filter(s => s.startsWith("competitor noise")).length, 2);
  assert.equal(f.originFile("out.txt"), "derived:v1");
});

test("persistent contention ends in RETRY_EXHAUSTED at the cap with nothing of ours pushed and nothing forced away", t => {
  const f = fixture(t), verify = path.join(f.tools, "always-contend.mjs");
  fs.writeFileSync(verify, `import fs from "node:fs"; import { execFileSync } from "node:child_process";
const g = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: "ignore" });
const c = ${JSON.stringify(f.competitor)};
g(c, "pull", "-q", "--ff-only", "origin", "main");
fs.appendFileSync(c + "/noise.txt", "n\\n");
g(c, "add", "-A"); g(c, "commit", "-q", "-m", "competitor noise"); g(c, "push", "-q", "origin", "HEAD:main");\n`);
  f.competitorPush("competitor noise", () => fs.writeFileSync(path.join(f.competitor, "noise.txt"), "first\n"));
  f.derive(f.runner);
  const r = f.run(["--verify-command", `${q(node)} ${q(verify)}`]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=RETRY_EXHAUSTED/);
  assert.match(r.output, /attempts=3/);
  const log = f.originLog();
  assert.ok(!log.includes("chore: derived [skip ci]"));
  assert.equal(log.filter(s => s === "competitor noise").length, 4, "every competitor commit survives (no force push)");
  assert.match(r.summary, /next action: Nothing was pushed; main moved again each time/);
});

test("push rejected although main did not move -> PUSH_REJECTED", t => {
  const f = fixture(t);
  const hook = path.join(f.origin, "hooks", "pre-receive");
  fs.writeFileSync(hook, "#!/bin/sh\necho 'rejected by test hook' >&2\nexit 1\n", { mode: 0o755 });
  f.derive(f.runner);
  const r = f.run([]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSH_REJECTED/);
  assert.match(r.output, /attempts=1/);
  assert.match(r.summary, /rejected by test hook/);
  assert.match(r.summary, /next action: The push was rejected although main did not move/);
});

test("nothing to commit and local HEAD equals remote -> ALREADY_CURRENT", t => {
  const f = fixture(t);
  f.derive(f.runner);
  git(f.runner, "add", "-A"); git(f.runner, "commit", "-q", "-m", "pre-derived"); git(f.runner, "push", "-q", "origin", "HEAD:main");
  f.derive(f.runner);
  const r = f.run([]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=ALREADY_CURRENT/);
  assert.match(r.output, new RegExp(`registered_sha=${git(f.origin, "rev-parse", "main")}`));
});

test("nothing of ours to write while the branch moved: ALREADY_CURRENT on our own base, the competitor's commit is the next run's input", t => {
  const f = fixture(t);
  f.derive(f.runner);
  git(f.runner, "add", "-A"); git(f.runner, "commit", "-q", "-m", "pre-derived"); git(f.runner, "push", "-q", "origin", "HEAD:main");
  const base = git(f.runner, "rev-parse", "HEAD");
  f.competitorPush("competitor input v2", () => fs.writeFileSync(path.join(f.competitor, "input.txt"), "v2\n"));
  f.derive(f.runner);
  const r = f.run([]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=ALREADY_CURRENT/);
  assert.match(r.output, new RegExp(`registered_sha=${base}`));
  assert.equal(f.originFile("input.txt"), "v2");
});

test("main advances after a successful push: registered_sha remains the verified commit, not the new tip", t => {
  const f = fixture(t), hook = path.join(f.origin, "hooks", "post-receive");
  const hookIndex = path.join(f.dir, "hook-index");
  // Advance the bare remote inside post-receive, before the push helper's readback fetch.
  // The new tip changes the source, so substituting it for our verified commit would publish mixed versions.
  fs.writeFileSync(hook, `#!${node}\nconst fs=require('node:fs'),{execFileSync}=require('node:child_process');
const [,pushed,ref]=fs.readFileSync(0,'utf8').trim().split(/\\s+/);
if(ref!=='refs/heads/main')process.exit(0);
const env={...process.env,GIT_INDEX_FILE:${JSON.stringify(hookIndex)}};
const g=(args,input)=>execFileSync('git',args,{encoding:'utf8',env,input}).trim();
g(['read-tree',pushed]);
const blob=g(['hash-object','-w','--stdin'],'v2-after-push\\n');
g(['update-index','--cacheinfo','100644',blob,'input.txt']);
const tree=g(['write-tree']);
const next=g(['-c','user.name=competitor','-c','user.email=competitor@example.invalid','commit-tree',tree,'-p',pushed], 'competitor immediately after push\\n');
g(['update-ref',ref,next,pushed]);\n`, {mode:0o755});
  f.derive(f.runner);
  const result=f.run([]);
  assert.equal(result.status,0,result.stdout+result.stderr);
  const outputs=Object.fromEntries(result.output.trim().split('\n').map(line=>line.split('=')));
  assert.equal(outputs.result,'PUSHED');
  assert.equal(outputs.registered_sha,git(f.runner,'rev-parse','HEAD'));
  assert.equal(outputs.main_sha,git(f.origin,'rev-parse','main'));
  assert.notEqual(outputs.registered_sha,outputs.main_sha);
  assert.equal(git(f.origin,'show',`${outputs.registered_sha}:input.txt`),'v1');
  assert.equal(f.originFile('input.txt'),'v2-after-push');
  assert.match(result.summary,/another writer advanced the branch afterwards/);
  assert.ok(result.summary.includes(`exact registered commit: \`${outputs.registered_sha}\``));
});

test('candidate technical check failure refuses every remote write and returns no registered SHA', t=>{
  const f=fixture(t),verify=path.join(f.tools,'refuse-candidate.mjs'),proof=path.join(f.dir,'candidate.json');
  fs.writeFileSync(verify,`import fs from 'node:fs';
fs.writeFileSync(${JSON.stringify(proof)},JSON.stringify({base:process.env.DERIVED_BASE_SHA,head:process.env.DERIVED_HEAD_SHA}));
console.error('FIXTURE_GROWTH_LIMIT_EXCEEDED');process.exit(23);\n`);
  const before=git(f.origin,'rev-parse','main');f.derive(f.runner);
  const result=f.run(['--verify-command',`${q(node)} ${q(verify)}`]);
  assert.equal(result.status,1,result.stdout+result.stderr);assert.match(result.output,/result=VERIFICATION_FAILED/);
  assert.match(result.output,/^registered_sha=$/m);assert.equal(git(f.origin,'rev-parse','main'),before);
  const candidate=JSON.parse(fs.readFileSync(proof,'utf8'));
  assert.equal(candidate.base,before);assert.equal(candidate.head,git(f.runner,'rev-parse','HEAD'));
  assert.equal(git(f.runner,'rev-parse',candidate.head+'^'),candidate.base);assert.equal(f.originLog().length,1);
  assert.match(result.summary,/candidate failed its pre-push technical check/);
});

test("the removed options are refused instead of silently ignored", t => {
  const f = fixture(t);
  for (const flag of ["--regenerate", "--reapply-check", "--race-fetch-scope"]) {
    const r = f.run([flag, "x"]);
    assert.equal(r.status, 2, flag);
    assert.match(r.stderr, /unknown or valueless argument/);
  }
});

test("an attempt count above the hard cap is capped at six", t => {
  const f = fixture(t), verify = path.join(f.tools, "always-contend-2.mjs");
  fs.writeFileSync(verify, `import fs from "node:fs"; import { execFileSync } from "node:child_process";
const g = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: "ignore" });
const c = ${JSON.stringify(f.competitor)};
g(c, "pull", "-q", "--ff-only", "origin", "main");
fs.appendFileSync(c + "/noise.txt", "n\\n");
g(c, "add", "-A"); g(c, "commit", "-q", "-m", "competitor noise"); g(c, "push", "-q", "origin", "HEAD:main");\n`);
  f.derive(f.runner);
  const r = f.run(["--verify-command", `${q(node)} ${q(verify)}`, "--max-attempts", "99"]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=RETRY_EXHAUSTED/);
  assert.match(r.output, /attempts=6/);
});
