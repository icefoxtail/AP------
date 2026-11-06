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
  const r = f.run(["--regenerate", `${q(node)} ${q(path.join(f.tools, "derive.mjs"))} .`]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=ALREADY_REFLECTED/);
  assert.match(r.output, new RegExp(`registered_sha=${git(f.origin, "rev-parse", "main")}`));
  assert.equal(f.originLog().length, before, "no extra commit may be pushed");
  assert.equal(git(f.runner, "rev-parse", "HEAD"), git(f.origin, "rev-parse", "main"));
  assert.equal(git(f.runner, "status", "--porcelain"), "");
  assert.match(r.summary, /ALREADY_REFLECTED/);
});

test("3b: unrelated competitor input change -> reset, regenerate on the new base, no stale overwrite", t => {
  const f = fixture(t);
  f.competitorPush("competitor input v2", () => fs.writeFileSync(path.join(f.competitor, "input.txt"), "v2\n"));
  f.derive(f.runner); // stale derivation from input v1
  assert.equal(fs.readFileSync(path.join(f.runner, "out.txt"), "utf8"), "derived:v1\n");
  const r = f.run(["--regenerate", `${q(node)} ${q(path.join(f.tools, "derive.mjs"))} .`]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.match(r.output, /attempts=2/);
  assert.match(r.output, new RegExp(`registered_sha=${git(f.origin, "rev-parse", "main")}`));
  assert.equal(f.originFile("out.txt"), "derived:v2", "origin must hold the derivation of the LATEST input");
  assert.equal(f.originFile("input.txt"), "v2");
  assert.ok(f.originLog().includes("competitor input v2"), "competitor commit preserved");
  assert.equal(git(f.runner, "rev-parse", "HEAD"), git(f.origin, "rev-parse", "main"));
  assert.throws(() => f.originFile("inbox/r1.txt"), "consumed request must stay deleted");
});

test("4: persistent contention -> exactly 3 attempts, RETRY_EXHAUSTED, nothing forced away", t => {
  const f = fixture(t);
  const counter = path.join(f.dir, "regen-count.txt");
  const noise = path.join(f.dir, "contend.mjs");
  // Each regenerate run derives on the new base and then lets the competitor push again.
  fs.writeFileSync(noise, `import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
const g = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: "ignore" });
execFileSync(${JSON.stringify(node)}, [${JSON.stringify(path.join(f.tools, "derive.mjs"))}, "."]);
fs.appendFileSync(${JSON.stringify(counter)}, "x");
const c = ${JSON.stringify(f.competitor)};
g(c, "pull", "-q", "--ff-only", "origin", "main");
fs.appendFileSync(path.join(c, "noise.txt"), "n\\n");
g(c, "add", "-A"); g(c, "commit", "-q", "-m", "competitor noise"); g(c, "push", "-q", "origin", "HEAD:main");\n`);
  f.competitorPush("competitor noise", () => fs.writeFileSync(path.join(f.competitor, "noise.txt"), "first\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", `${q(node)} ${q(noise)}`, "--max-attempts", "9"]); // hard cap is 3
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=RETRY_EXHAUSTED/);
  assert.match(r.output, /attempts=3/);
  assert.equal(fs.readFileSync(counter, "utf8").length, 2, "regenerate runs once per retry");
  const remoteTip = git(f.origin, "rev-parse", "main");
  assert.match(r.summary, /RETRY_EXHAUSTED/);
  assert.match(r.summary, /attempt 1: base `[0-9a-f]{40}`/);
  assert.match(r.summary, /attempt 3: base `[0-9a-f]{40}`/);
  assert.ok(r.summary.includes(remoteTip), "summary names the final remote SHA");
  assert.match(r.summary, /next action: Re-run this workflow via workflow_dispatch.*competing writer = [0-9a-f]+ test: competitor noise/s);
  const log = f.originLog();
  assert.equal(log.filter(s => s === "competitor noise").length, 3, "every competitor commit survives (no force push)");
  assert.equal(log.length, 4, "seed + 3 competitor commits, none of ours");
  assert.ok(!log.includes("chore: derived [skip ci]"));
});

test("regenerate failure on the new base -> REGENERATE_FAILED immediately, no retry", t => {
  const f = fixture(t);
  f.competitorPush("competitor input v2", () => fs.writeFileSync(path.join(f.competitor, "input.txt"), "v2\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", `${q(node)} -e "process.exit(3)"`]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=REGENERATE_FAILED/);
  assert.match(r.output, /^registered_sha=$/m, "failed regeneration never certifies the unregistered remote tip");
  assert.match(r.output, /attempts=1/);
  assert.match(r.summary, /next action: Regeneration\/validation failed on the new main base/);
  assert.equal(f.originFile("out.txt"), "derived:v0", "nothing stale was pushed");
});

test("push rejected although main did not move -> PUSH_REJECTED without regenerate", t => {
  const f = fixture(t);
  const hook = path.join(f.origin, "hooks", "pre-receive");
  fs.writeFileSync(hook, "#!/bin/sh\necho 'rejected by test hook' >&2\nexit 1\n", { mode: 0o755 });
  f.derive(f.runner);
  const r = f.run(["--regenerate", `${q(node)} -e "process.exit(9)"`]);
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

test('race regeneration rechecks each candidate against its own exact parent and head before push',t=>{
  const f=fixture(t),verify=path.join(f.tools,'verify-candidate.mjs'),proof=path.join(f.dir,'candidates.jsonl');
  fs.writeFileSync(verify,`import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const base=process.env.DERIVED_BASE_SHA,head=process.env.DERIVED_HEAD_SHA;
const g=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
if(g('rev-parse',head+'^')!==base)throw Error('EXACT_CANDIDATE_PARENT_REQUIRED');
fs.appendFileSync(${JSON.stringify(proof)},JSON.stringify({base,head,input:g('show',head+':input.txt')})+'\\n');\n`);
  const initial=git(f.runner,'rev-parse','HEAD');
  f.competitorPush('competitor input v2',()=>fs.writeFileSync(path.join(f.competitor,'input.txt'),'v2\n'));
  const competitor=git(f.origin,'rev-parse','main');f.derive(f.runner);
  const result=f.run(['--verify-command',`${q(node)} ${q(verify)}`,'--regenerate',`${q(node)} ${q(path.join(f.tools,'derive.mjs'))} .`]);
  assert.equal(result.status,0,result.stdout+result.stderr);
  const rows=fs.readFileSync(proof,'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(rows.length,2);assert.equal(rows[0].base,initial);assert.equal(rows[0].input,'v1');
  assert.equal(rows[1].base,competitor);assert.equal(rows[1].input,'v2');
  assert.equal(rows[1].head,git(f.origin,'rev-parse','main'));assert.match(result.output,new RegExp(`registered_sha=${rows[1].head}`));
});
