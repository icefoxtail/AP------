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

test("4: default persistent contention -> exactly 3 attempts, RETRY_EXHAUSTED, nothing forced away", t => {
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
  const r = f.run(["--regenerate", `${q(node)} ${q(noise)}`]); // omitted option retains the three-attempt default
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=RETRY_EXHAUSTED/);
  assert.match(r.output, /attempts=3/);
  assert.equal(fs.readFileSync(counter, "utf8").length, 2, "regenerate runs once per retry");
  const remoteTip = git(f.origin, "rev-parse", "main");
  assert.match(r.summary, /RETRY_EXHAUSTED/);
  assert.match(r.summary, /attempt 1: base `[0-9a-f]{40}`/);
  assert.match(r.summary, /attempt 3: base `[0-9a-f]{40}`/);
  assert.ok(r.summary.includes(remoteTip), "summary names the final remote SHA");
  assert.match(r.summary, /next action: .*Re-run this workflow via workflow_dispatch.*competing writer = [0-9a-f]+ test: competitor noise/s);
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

// --reapply-check: the single shortcut for a competing range that is provably unrelated to the producers.
function reapplyFixture(t) {
  const f = fixture(t);
  const marks = path.join(f.dir, "marks.jsonl"), mark = (name, extra = "") => `fs.appendFileSync(${JSON.stringify(marks)}, JSON.stringify({ name: ${JSON.stringify(name)}${extra} }) + "\\n");`;
  const script = (name, body) => { const p = path.join(f.tools, name); fs.writeFileSync(p, `import fs from "node:fs";\nimport { execFileSync } from "node:child_process";\n${body}\n`); return `${q(node)} ${q(p)}`; };
  const checkWith = code => script(`check-${code}.mjs`, `${mark("check", ", base: process.env.DERIVED_BASE_SHA, competitor: process.env.COMPETITOR_HEAD_SHA")}\nprocess.exit(${code});`);
  const regenerate = script("regen.mjs", `${mark("regenerate")}\nexecFileSync(${JSON.stringify(node)}, [${JSON.stringify(path.join(f.tools, "derive.mjs"))}, "."]);`);
  const verify = script("verify.mjs", `${mark("verify", ", base: process.env.DERIVED_BASE_SHA, head: process.env.DERIVED_HEAD_SHA")}`);
  const events = () => (fs.existsSync(marks) ? fs.readFileSync(marks, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse) : []);
  return { ...f, checkWith, regenerate, verify, events };
}

test("reapply-check exit 0: unrelated race re-applies the verified commit on the competitor tip, no regenerate, verify runs on the new range", t => {
  const f = reapplyFixture(t);
  f.competitorPush("competitor unrelated", () => fs.writeFileSync(path.join(f.competitor, "unrelated.txt"), "x\n"));
  const competitorTip = git(f.origin, "rev-parse", "main"), initialBase = git(f.runner, "rev-parse", "HEAD");
  f.derive(f.runner);
  const r = f.run(["--regenerate", f.regenerate, "--verify-command", f.verify, "--reapply-check", f.checkWith(0)]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.match(r.output, /attempts=2/);
  const ev = f.events();
  assert.ok(!ev.some(e => e.name === "regenerate"), "regenerate must not run");
  const check = ev.find(e => e.name === "check");
  assert.equal(check.base, initialBase);
  assert.equal(check.competitor, competitorTip);
  const verifies = ev.filter(e => e.name === "verify");
  assert.equal(verifies.length, 2, "verify ran for the first candidate and again on the new range");
  assert.equal(verifies[1].base, competitorTip);
  const tip = git(f.origin, "rev-parse", "main");
  assert.equal(verifies[1].head, tip);
  assert.equal(git(f.origin, "rev-parse", `${tip}^`), competitorTip, "pushed commit's parent is the competitor tip");
  assert.equal(f.originFile("out.txt"), "derived:v1", "derived content equals our verified output");
  assert.equal(f.originFile("unrelated.txt"), "x");
  assert.throws(() => f.originFile("inbox/r1.txt"), "consumed request stays deleted");
  assert.match(r.output, new RegExp(`registered_sha=${tip}`));
  assert.match(r.summary, /competitor range unrelated, re-applied verified derived commit/);
});

test("reapply-check exit 1: related race falls back to the existing regenerate path", t => {
  const f = reapplyFixture(t);
  f.competitorPush("competitor input v2", () => fs.writeFileSync(path.join(f.competitor, "input.txt"), "v2\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", f.regenerate, "--reapply-check", f.checkWith(1)]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.deepEqual(f.events().map(e => e.name), ["check", "regenerate"]);
  assert.equal(f.originFile("out.txt"), "derived:v2");
});

test("reapply-check exit 0 but the cherry-pick conflicts: abort, reset and regenerate", t => {
  const f = reapplyFixture(t);
  f.competitorPush("competitor edits the derived file", () => fs.writeFileSync(path.join(f.competitor, "out.txt"), "derived:competitor\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", f.regenerate, "--reapply-check", f.checkWith(0)]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.deepEqual(f.events().map(e => e.name), ["check", "regenerate"]);
  assert.equal(f.originFile("out.txt"), "derived:v1");
  assert.equal(git(f.runner, "status", "--porcelain"), "", "no conflict markers or half-finished cherry-pick left behind");
  assert.ok(!fs.existsSync(path.join(f.runner, ".git", "CHERRY_PICK_HEAD")));
});

test("reapply-check exit 0 but the re-applied commit stages a path outside --paths-file: reset and regenerate", t => {
  const f = reapplyFixture(t);
  f.competitorPush("competitor unrelated", () => fs.writeFileSync(path.join(f.competitor, "unrelated.txt"), "x\n"));
  f.derive(f.runner);
  fs.writeFileSync(path.join(f.runner, "extra.txt"), "not derived\n");
  git(f.runner, "add", "extra.txt"); // pre-staged outside the pathspecs, so it rides into the local commit
  const r = f.run(["--regenerate", f.regenerate, "--reapply-check", f.checkWith(0)]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.deepEqual(f.events().map(e => e.name), ["check", "regenerate"]);
  assert.throws(() => f.originFile("extra.txt"), "a path outside the derived pathspecs is never pushed");
  assert.equal(f.originFile("out.txt"), "derived:v1");
  assert.doesNotMatch(r.summary, /re-applied/);
});

test("fast-path attempt at the cap that loses the race again ends in RETRY_EXHAUSTED, never an unverified push", t => {
  const f = reapplyFixture(t);
  const marks = path.join(f.dir, "marks.jsonl"), verify = path.join(f.tools, "verify-race.mjs");
  // Second verification (the re-applied candidate) is when the competitor lands another commit, so the push is rejected.
  fs.writeFileSync(verify, `import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
fs.appendFileSync(${JSON.stringify(marks)}, JSON.stringify({ name: "verify" }) + "\\n");
const n = fs.readFileSync(${JSON.stringify(marks)}, "utf8").split("\\n").filter(l => l.includes('"verify"')).length;
if (n === 2) {
  const c = ${JSON.stringify(f.competitor)}, g = (...a) => execFileSync("git", a, { cwd: c, stdio: "ignore" });
  g("pull", "-q", "--ff-only", "origin", "main"); fs.writeFileSync(path.join(c, "second.txt"), "2\\n");
  g("add", "-A"); g("commit", "-q", "-m", "competitor second"); g("push", "-q", "origin", "HEAD:main");
}\n`);
  f.competitorPush("competitor unrelated", () => fs.writeFileSync(path.join(f.competitor, "unrelated.txt"), "x\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", f.regenerate, "--verify-command", `${q(node)} ${q(verify)}`, "--reapply-check", f.checkWith(0), "--max-attempts", "2"]);
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.output, /result=RETRY_EXHAUSTED/);
  assert.match(r.output, /attempts=2/);
  assert.match(r.output, /^registered_sha=$/m);
  assert.ok(!f.events().some(e => e.name === "regenerate"), "no regenerate at the cap");
  assert.ok(!f.originLog().includes("chore: derived [skip ci]"), "nothing of ours was pushed");
  assert.equal(f.originFile("inbox/r1.txt"), "request", "origin still holds the unconsumed seed state");
  assert.equal(f.originFile("out.txt"), "derived:v0");
});

test("without --reapply-check an unrelated race still regenerates exactly as before", t => {
  const f = reapplyFixture(t);
  f.competitorPush("competitor unrelated", () => fs.writeFileSync(path.join(f.competitor, "unrelated.txt"), "x\n"));
  f.derive(f.runner);
  const r = f.run(["--regenerate", f.regenerate]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.output, /result=PUSHED/);
  assert.deepEqual(f.events().map(e => e.name), ["regenerate"]);
  assert.doesNotMatch(r.summary, /re-applied/);
});

function repeatedVerifiedContention(t, { races, failAt = 0, maxAttempts = '6' }) {
  const f = fixture(t), proof = path.join(f.dir, 'verified-candidates.jsonl');
  const regenerated = path.join(f.dir, 'regenerate-count.txt'), checked = path.join(f.dir, 'related-check-count.txt');
  const verifier = path.join(f.tools, 'verify-with-contention.mjs');
  fs.writeFileSync(verifier, String.raw`import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
const g=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const base=process.env.DERIVED_BASE_SHA,head=process.env.DERIVED_HEAD_SHA;
if(g('.', 'rev-parse', head+'^')!==base)throw Error('EXACT_PARENT_REQUIRED');
const input=g('.', 'show', head+':input.txt'),output=g('.', 'show', head+':out.txt');
if(output!=='derived:'+input)throw Error('FRESH_DERIVATION_REQUIRED');
fs.appendFileSync(${JSON.stringify(proof)},JSON.stringify({base,head,input,output})+'\n');
const n=fs.readFileSync(${JSON.stringify(proof)},'utf8').trim().split('\n').length;
if(n===${failAt}){console.error('LATE_VERIFICATION_REFUSAL');process.exit(23);}
if(n<=${races}){const c=${JSON.stringify(f.competitor)};g(c,'pull','-q','--ff-only','origin','main');fs.writeFileSync(path.join(c,'input.txt'),'v'+(n+1)+'\n');g(c,'add','-A');g(c,'commit','-qm','competitor input '+(n+1));g(c,'push','-q','origin','HEAD:main');}
`);
  const regen = path.join(f.tools, 'counted-regenerate.mjs');
  fs.writeFileSync(regen, `import fs from 'node:fs';import {execFileSync} from 'node:child_process';fs.appendFileSync(${JSON.stringify(regenerated)},'x');execFileSync(${JSON.stringify(node)},[${JSON.stringify(path.join(f.tools,'derive.mjs'))},'.']);`);
  const check = path.join(f.tools, 'related-check.mjs');
  fs.writeFileSync(check, `import fs from 'node:fs';fs.appendFileSync(${JSON.stringify(checked)},'x');process.exit(1);`);
  f.derive(f.runner);
  const result = f.run(['--max-attempts',maxAttempts,'--verify-command',`${q(node)} ${q(verifier)}`,
    '--regenerate',`${q(node)} ${q(regen)}`,'--reapply-check',`${q(node)} ${q(check)}`]);
  const rows = fs.readFileSync(proof,'utf8').trim().split('\n').map(JSON.parse);
  return {...f,result,rows,regenerations:fs.existsSync(regenerated)?fs.readFileSync(regenerated,'utf8').length:0,
    relatedChecks:fs.existsSync(checked)?fs.readFileSync(checked,'utf8').length:0};
}

test('explicit six-attempt budget survives four input races and publishes only the fifth fully verified derivation', t => {
  const f = repeatedVerifiedContention(t, {races:4});
  assert.equal(f.result.status,0,f.result.stdout+f.result.stderr);
  assert.match(f.result.output,/result=PUSHED/);assert.match(f.result.output,/attempts=5/);
  assert.equal(f.regenerations,4);assert.equal(f.relatedChecks,4);
  assert.deepEqual(f.rows.map(r=>r.input),['v1','v2','v3','v4','v5']);
  assert.equal(new Set(f.rows.map(r=>r.base)).size,5,'each verification uses its new exact parent');
  const tip=git(f.origin,'rev-parse','main');assert.equal(tip,f.rows[4].head);
  assert.match(f.result.output,new RegExp(`registered_sha=${tip}`));
  assert.equal(f.originFile('out.txt'),'derived:v5');assert.equal(f.originFile('input.txt'),'v5');
  for(let i=2;i<=5;i++)assert.ok(f.originLog().includes('competitor input '+i),'every competitor commit survives');
  assert.throws(()=>f.originFile('inbox/r1.txt'),'only the verified derivation consumes the request');
});

test('explicit oversized attempt option remains capped at six and never reports an unregistered remote tip as success', t => {
  const f = repeatedVerifiedContention(t, {races:99,maxAttempts:'99'});
  assert.equal(f.result.status,1,f.result.stdout+f.result.stderr);
  assert.match(f.result.output,/result=RETRY_EXHAUSTED/);assert.match(f.result.output,/attempts=6/);
  assert.match(f.result.output,/^registered_sha=$/m);assert.equal(f.rows.length,6);
  assert.equal(f.regenerations,5);assert.equal(f.relatedChecks,5);
  assert.equal(f.originLog().filter(s=>s.startsWith('competitor input ')).length,6);
  assert.ok(!f.originLog().includes('chore: derived [skip ci]'));
  assert.equal(f.originFile('out.txt'),'derived:v0');assert.equal(f.originFile('input.txt'),'v7');
  assert.equal(f.originFile('inbox/r1.txt'),'request');
});

test('extra attempts still stop at a failed fourth candidate verification without pushing or certifying it', t => {
  const f = repeatedVerifiedContention(t, {races:3,failAt:4});
  assert.equal(f.result.status,1,f.result.stdout+f.result.stderr);
  assert.match(f.result.output,/result=VERIFICATION_FAILED/);assert.match(f.result.output,/attempts=4/);
  assert.match(f.result.output,/^registered_sha=$/m);assert.match(f.result.stderr,/LATE_VERIFICATION_REFUSAL/);
  assert.equal(f.rows.length,4);assert.equal(f.regenerations,3);assert.equal(f.relatedChecks,3);
  assert.ok(!f.originLog().includes('chore: derived [skip ci]'));
  assert.equal(f.originFile('out.txt'),'derived:v0');assert.equal(f.originFile('input.txt'),'v4');
  assert.equal(f.originFile('inbox/r1.txt'),'request');
});

// The workflow checkout predates an immutable evidence branch that a later main
// input references by exact commit/path/digest. Main history does not contain it.
function lateEvidenceFixture(t, {wrongDigest = false} = {}) {
  const f = fixture(t), reviewPath = 'review.json';
  git(f.competitor, 'checkout', '-q', '-b', 'review/late-evidence');
  const review = '{"schema":"fixture-immutable-review-v1","decision":"accepted"}\n';
  fs.writeFileSync(path.join(f.competitor, reviewPath), review);
  git(f.competitor, 'add', reviewPath); git(f.competitor, 'commit', '-qm', 'immutable review after worker checkout');
  const reviewCommit = git(f.competitor, 'rev-parse', 'HEAD');
  git(f.competitor, 'push', '-q', 'origin', 'HEAD:refs/heads/review/late-evidence');
  git(f.competitor, 'checkout', '-q', 'main');
  const digest = execFileSync(node, ['--input-type=module', '-e',
    'import {createHash} from "node:crypto";process.stdout.write(createHash("sha256").update(process.argv[1]).digest("hex"));', review], {encoding:'utf8'});
  const witness = {commit:reviewCommit, path:reviewPath, sha256:wrongDigest ? '0'.repeat(64) : digest};
  f.competitorPush('main references late immutable review', () => {
    fs.writeFileSync(path.join(f.competitor, 'input.txt'), 'v2\n');
    fs.writeFileSync(path.join(f.competitor, 'witness.json'), JSON.stringify(witness) + '\n');
  });
  const mainBefore = git(f.origin, 'rev-parse', 'main');
  assert.notEqual(spawnSync('git', ['merge-base','--is-ancestor',reviewCommit,mainBefore], {cwd:f.origin}).status, 0);
  assert.notEqual(spawnSync('git', ['cat-file','-e',reviewCommit], {cwd:f.runner}).status, 0,
    'the runner really lacks the new immutable commit');
  const observed = path.join(f.dir, 'immutable-observed.jsonl');
  const check = `import fs from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const g=(...a)=>execFileSync('git',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const verify=process.argv[2]==='verify',head=verify?process.env.DERIVED_HEAD_SHA:'HEAD';
if(verify&&g('rev-parse',head+'^')!==process.env.DERIVED_BASE_SHA)throw Error('EXACT_CANDIDATE_PARENT_REQUIRED');
let w=null;try{w=JSON.parse(g('show',head+':witness.json'));}catch{}
if(w){let raw;try{raw=execFileSync('git',['show',w.commit+':'+w.path],{stdio:['ignore','pipe','pipe']});}catch{console.error('IMMUTABLE_GIT_INPUT_UNAVAILABLE');process.exit(17);}
if(createHash('sha256').update(raw).digest('hex')!==w.sha256){console.error('IMMUTABLE_GIT_INPUT_HASH_MISMATCH');process.exit(18);}
if(JSON.parse(raw).schema!=='fixture-immutable-review-v1')throw Error('IMMUTABLE_SCHEMA_REFUSED');
if(fs.existsSync('review.json'))throw Error('EVIDENCE_BRANCH_MUST_NOT_BE_CHECKED_OUT');
fs.appendFileSync(${JSON.stringify(observed)},JSON.stringify({mode:verify?'verify':'regenerate',head,commit:w.commit,sha256:w.sha256})+'\\n');}
if(verify){if(g('show',head+':out.txt')!=='derived:'+g('show',head+':input.txt'))throw Error('STALE_DERIVED_OUTPUT');}
else execFileSync(${JSON.stringify(node)},[${JSON.stringify(path.join(f.tools,'derive.mjs'))},'.']);
`;
  const script = path.join(f.tools, 'validate-immutable-and-derive.mjs'); fs.writeFileSync(script, check);
  f.derive(f.runner);
  const options = ['--regenerate',`${q(node)} ${q(script)} regenerate`,'--verify-command',`${q(node)} ${q(script)} verify`];
  return {...f, reviewCommit, mainBefore, witness, options, observed};
}

test('late immutable evidence: default branch-only fetch still refuses a commit absent from main history', t => {
  const f = lateEvidenceFixture(t), result = f.run(f.options);
  assert.equal(result.status,1,result.stdout+result.stderr);
  assert.match(result.output,/result=REGENERATE_FAILED/);
  assert.match(result.stderr,/IMMUTABLE_GIT_INPUT_UNAVAILABLE/);
  assert.match(result.output,/^registered_sha=$/m);
  assert.equal(git(f.origin,'rev-parse','main'),f.mainBefore);
  assert.notEqual(spawnSync('git',['cat-file','-e',f.reviewCommit],{cwd:f.runner}).status,0);
  assert.equal(f.originFile('out.txt'),'derived:v0');
  assert.equal(f.originFile('inbox/r1.txt'),'request');
  t.diagnostic('default branch-only reproduces IMMUTABLE_GIT_INPUT_UNAVAILABLE; no registered SHA or remote derived write');
});

test('late immutable evidence: main all-heads opt-in hydrates exact evidence before regenerating and verifying the new candidate', t => {
  const f = lateEvidenceFixture(t), result = f.run([...f.options,'--race-fetch-scope','all-heads']);
  assert.equal(result.status,0,result.stdout+result.stderr);
  assert.match(result.output,/result=PUSHED/);assert.match(result.output,/attempts=2/);
  const tip=git(f.origin,'rev-parse','main');
  assert.equal(git(f.origin,'rev-parse',tip+'^'),f.mainBefore);
  assert.match(result.output,new RegExp(`registered_sha=${tip}`));
  assert.equal(f.originFile('out.txt'),'derived:v2');
  assert.deepEqual(JSON.parse(f.originFile('witness.json')),f.witness);
  assert.equal(git(f.runner,'rev-parse','refs/remotes/origin/review/late-evidence'),f.reviewCommit);
  assert.equal(git(f.origin,'rev-parse','refs/heads/review/late-evidence'),f.reviewCommit);
  assert.throws(()=>f.originFile('review.json'),'evidence tree is not merged into main');
  assert.throws(()=>f.originFile('inbox/r1.txt'),'only the exact verified derivation consumes the request');
  const checks=fs.readFileSync(f.observed,'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(checks.map(c=>c.mode),['regenerate','verify']);
  assert.ok(checks.every(c=>c.commit===f.reviewCommit&&c.sha256===f.witness.sha256));
  assert.equal(checks[1].head,tip);
});

test('late immutable evidence: all-heads hydration cannot approve a wrong immutable digest', t => {
  const f = lateEvidenceFixture(t,{wrongDigest:true}), result=f.run([...f.options,'--race-fetch-scope','all-heads']);
  assert.equal(result.status,1,result.stdout+result.stderr);
  assert.match(result.output,/result=REGENERATE_FAILED/);
  assert.match(result.stderr,/IMMUTABLE_GIT_INPUT_HASH_MISMATCH/);
  assert.equal(spawnSync('git',['cat-file','-e',f.reviewCommit],{cwd:f.runner}).status,0,'the evidence was hydrated, then its validator refused it');
  assert.match(result.output,/^registered_sha=$/m);
  assert.equal(git(f.origin,'rev-parse','main'),f.mainBefore);
  assert.equal(f.originFile('out.txt'),'derived:v0');
  assert.equal(f.originFile('inbox/r1.txt'),'request');
});

test('race fetch scope rejects unknown enum values and arbitrary refspecs before Git mutation', t => {
  const f=fixture(t), before=git(f.origin,'rev-parse','main');f.derive(f.runner);
  for(const invalid of ['','all','+refs/*:refs/remotes/origin/*','all-heads\n']){
    const result=f.run(['--race-fetch-scope',invalid]);
    assert.equal(result.status,2,result.stdout+result.stderr);
    assert.match(result.stderr,/race-fetch-scope must be branch or all-heads/);
    assert.equal(result.output,'');assert.equal(git(f.runner,'rev-parse','HEAD'),before);
    assert.equal(git(f.origin,'rev-parse','main'),before);
  }
});

test('all-heads race opt-in is limited to the main writer origin/main target', t => {
  const f=fixture(t), before=git(f.origin,'rev-parse','main');f.derive(f.runner);
  for(const extra of [['--remote','elsewhere'],['--branch','release']]){
    const result=f.run(['--race-fetch-scope','all-heads',...extra]);
    assert.equal(result.status,2,result.stdout+result.stderr);
    assert.match(result.stderr,/all-heads race fetch requires origin\/main/);
    assert.equal(result.output,'');assert.equal(git(f.runner,'rev-parse','HEAD'),before);
    assert.equal(git(f.origin,'rev-parse','main'),before);
  }
});

test('all-heads race opt-in does not fetch unrelated evidence when main never moves', t => {
  const f=lateEvidenceFixture(t);
  // Move the runner to the current input without fetching the separate review branch,
  // then use the fixture's source-only derivation to exercise the no-race path.
  git(f.runner,'fetch','--no-tags','origin','+refs/heads/main:refs/remotes/origin/main');
  git(f.runner,'reset','--hard','refs/remotes/origin/main');f.derive(f.runner);
  const result=f.run(['--race-fetch-scope','all-heads']);
  assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.output,/attempts=1/);
  assert.notEqual(spawnSync('git',['cat-file','-e',f.reviewCommit],{cwd:f.runner}).status,0);
  assert.notEqual(spawnSync('git',['rev-parse','--verify','refs/remotes/origin/review/late-evidence'],{cwd:f.runner}).status,0);
});
