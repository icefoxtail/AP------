import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createProjectionPhase, requireProjectionPhase, projectionInput, projectionPhaseSummary,
  projectionSnapshot, closeProjectionPhase } from '../archive/tools/meta-foundation/reviewed-projection-phase.mjs';
import { verifyProjectionRequests, REQUEST_TIMEOUT_MS } from '../tools/ci/verify-reviewed-projection-requests.mjs';

const MODULE = fileURLToPath(new URL('../archive/tools/meta-foundation/reviewed-projection-phase.mjs', import.meta.url));
const V2 = 'archive-reviewed-exam-meta-register-request-v2';
function fixture(t, behaviors = ['ok']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'projection-phase-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, s) => { const f = path.join(root, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
  put('archive/data/input.json', '{"records":[{"id":1}]}');
  put('.gitignore', 'archive/data/ignored/\n');
  const requests = behaviors.map((behavior, i) => {
    const p = `.archive-meta-register/inbox/${i}.json`; put(p, JSON.stringify({ schemaVersion: V2, behavior })); return p;
  });
  // This is an explicit protocol stub. The separate v2 tests compare actual
  // Native/Consumer replays with and without the issued input context.
  put('fixture-worker.mjs', `import fs from 'node:fs';import {execFileSync} from 'node:child_process';
import {createProjectionPhase,projectionPhaseSummary,projectionInput,closeProjectionPhase} from ${JSON.stringify('file://' + MODULE)};
const root=process.argv[3],expected=process.argv[4],phase=createProjectionPhase(root,expected);
process.send({type:'ready',snapshotSha256:projectionPhaseSummary(phase,root).snapshot.sha256});
process.on('message',m=>{
 if(m.type==='close'){try{process.send({type:'closed',summary:closeProjectionPhase(phase,root)},()=>{if(process.connected)process.disconnect();});}catch(e){process.send({type:'fatal',error:e.message});}return;}
 const d=JSON.parse(fs.readFileSync(m.request,'utf8'));
 if(d.behavior==='exit-before-start')process.exit(9);
 process.send({type:'start',index:m.index,request:m.request,sha256:m.sha256});
 const input=projectionInput(phase,root,'json:archive/data/input.json',()=>JSON.parse(fs.readFileSync('archive/data/input.json','utf8')));
 if(input.records[0].id!==1)throw new Error('wrong fixture input');
 if(d.behavior==='crash')process.exit(7);
 if(d.behavior==='hang')while(true){}
 if(d.behavior==='dirty-crash'){fs.writeFileSync('archive/data/input.json','changed');process.exit(7);}
 if(d.behavior==='mutate')fs.writeFileSync('archive/data/input.json','changed');
 if(d.behavior==='ref-change')execFileSync('git',['update-ref','refs/heads/fixture-new','HEAD']);
 if(d.behavior==='missing-start')return process.send({type:'result',index:m.index+1,request:m.request,ok:true});
 process.send({type:'result',index:m.index,request:m.request,ok:d.behavior!=='refuse',error:d.behavior==='refuse'?'fixture refusal':null});
});`);
  git('add', '-A'); git('commit', '-qm', 'fixture');
  return { root, put, git, requests, workerPath: path.join(root, 'fixture-worker.mjs') };
}

test('issued context shares immutable inputs only and closes permanently', t => {
  const f = fixture(t), p = createProjectionPhase(f.root); let loads = 0;
  const load = () => { loads++; return { records: [{ id: 1 }], byId: new Map([[1, { id: 1 }]]) }; };
  const one = projectionInput(p, f.root, 'canonical-tables', load);
  assert.equal(projectionInput(p, f.root, 'canonical-tables', load), one); assert.equal(loads, 1);
  assert.throws(() => { one.records[0].id = 2; }, TypeError);
  assert.throws(() => one.byId.set(2, {}), /mutate shared input/);
  assert.throws(() => Map.prototype.set.call(one.byId, 2, {}), TypeError);
  one.byId.forEach((value, key, map) => { assert.equal(map, one.byId); assert.throws(() => map.delete(key), /mutate shared input/); });
  const callbackThis = { tag: 'map context' };
  one.byId.forEach(function(value, key, map) { assert.equal(this, callbackThis); assert.equal(map, one.byId); }, callbackThis);
  assert.equal(one.byId.valueOf(), one.byId);
  assert.throws(() => projectionInput(p, f.root, 'native-pass', () => true), /outside allowlist/);
  assert.equal(closeProjectionPhase(p, f.root).cachedVerdicts, 0);
  assert.throws(() => projectionInput(p, f.root, 'canonical-tables', load), /closed/);
});
test('retained input factory objects and Set prototype calls cannot mutate cached inputs', t => {
  const f = fixture(t), p = createProjectionPhase(f.root), original = { rows: [{ id: 1 }], set: new Set([{ id: 1 }]), sparse: Array(3) };
  const input = projectionInput(p, f.root, 'canonical-tables', () => original);
  original.rows[0].id = 9; original.set.clear();
  assert.equal(input.rows[0].id, 1); assert.equal(input.set.size, 1);
  assert.equal(input.sparse.length, 3); assert.equal(0 in input.sparse, false);
  assert.throws(() => Set.prototype.clear.call(input.set), TypeError);
  input.set.forEach((v, k, set) => { assert.equal(v, k); assert.equal(set, input.set); assert.throws(() => set.clear(), /mutate shared input/); });
  closeProjectionPhase(p, f.root);
});
test('foreign, forged, write and nonprojection contexts are refused', t => {
  const f = fixture(t), other = fixture(t), p = createProjectionPhase(f.root);
  assert.throws(() => requireProjectionPhase({}, { root: f.root, write: false, verifyProjection: true }), /unissued/);
  assert.throws(() => requireProjectionPhase(p, { root: other.root, write: false, verifyProjection: true }), /foreign-root/);
  assert.throws(() => requireProjectionPhase(p, { root: f.root, write: true, verifyProjection: true }), /read-only/);
  assert.throws(() => requireProjectionPhase(p, { root: f.root, write: false, verifyProjection: false }), /read-only/);
  closeProjectionPhase(p, f.root);
});
for (const mutation of ['raw', 'ignored-generated', 'index', 'refs', 'head', 'new-file', 'remove-file'])
test('phase closing rejects actual ' + mutation + ' mutation', t => {
  const f = fixture(t), p = createProjectionPhase(f.root);
  if (mutation === 'raw') f.put('archive/data/input.json', '{"records":[{"id":2}]}');
  if (mutation === 'ignored-generated') f.put('archive/data/ignored/x.json', '{}');
  if (mutation === 'index') { f.put('archive/data/input.json', 'changed'); f.git('add', '-A'); }
  if (mutation === 'refs') f.git('update-ref', 'refs/heads/new-ref', 'HEAD');
  if (mutation === 'head') f.git('commit', '--allow-empty', '-qm', 'another snapshot');
  if (mutation === 'new-file') f.put('new.json', '{}');
  if (mutation === 'remove-file') fs.unlinkSync(path.join(f.root, 'archive/data/input.json'));
  assert.throws(() => closeProjectionPhase(p, f.root), /input changed/);
});
test('snapshot is byte-bound even when file size and mtime are restored', t => {
  const f = fixture(t), file = path.join(f.root, 'archive/data/input.json'), st = fs.statSync(file), before = projectionSnapshot(f.root);
  f.put('archive/data/input.json', fs.readFileSync(file, 'utf8').replace('1', '2'));
  fs.utimesSync(file, st.atime, st.mtime);
  assert.notEqual(projectionSnapshot(f.root).sha256, before.sha256);
});
test('actual worker boundary preserves ordered refusals and one input load', async t => {
  const f = fixture(t, ['ok', 'refuse', 'ok']), before = projectionSnapshot(f.root);
  const report = await verifyProjectionRequests(f);
  assert.equal(report.status, 'PASS_WITH_REQUEST_REFUSALS');
  assert.deepEqual(report.checks.map(x => x.status), ['PASS', 'REFUSED', 'PASS']);
  assert.deepEqual(report.consumerCandidates, [f.requests[0], f.requests[2]]);
  assert.equal(report.workerCount, 1); assert.equal(report.workerPhases[0].inputLoads['json:archive/data/input.json'], 1);
  assert.equal(projectionSnapshot(f.root).sha256, before.sha256);
});
for (const behavior of ['crash', 'hang']) test('worker ' + behavior + ' refuses only the active request then uses a fresh context', async t => {
  const f = fixture(t, ['ok', behavior, 'ok']), before = projectionSnapshot(f.root);
  const report = await verifyProjectionRequests({ ...f, requestTimeoutMs: 500 });
  assert.deepEqual(report.checks.map(x => x.status), ['PASS', 'REFUSED', 'PASS']);
  assert.equal(report.workerCount, 2); assert.equal(report.checks[1].failureKind, 'WORKER_STOPPED');
  assert.equal(report.workerPhases[0].status, 'STOPPED');
  assert.equal(report.workerPhases[1].inputLoads['json:archive/data/input.json'], 1);
  assert.equal(projectionSnapshot(f.root).sha256, before.sha256);
});
for (const behavior of ['mutate', 'ref-change', 'dirty-crash', 'missing-start', 'exit-before-start'])
test('worker ' + behavior + ' cannot be hidden as an ordinary request refusal', async t => {
  const f = fixture(t, ['ok', behavior, 'ok']);
  await assert.rejects(verifyProjectionRequests(f), e => {
    assert.equal(e.projectionReport.status, 'FAIL');
    if (behavior === 'dirty-crash' || behavior === 'exit-before-start') assert.equal(e.projectionReport.completedRequests, 1);
    return true;
  });
});
test('malformed request remains a phase error; no worker can infer approval', async t => {
  const f = fixture(t); f.put(f.requests[0], '{');
  await assert.rejects(verifyProjectionRequests(f), e => e.projectionReport.status === 'FAIL' && e.projectionReport.workerCount === 0);
});
test('production CLI has a fixed watchdog and no environment override', () => {
  assert.equal(REQUEST_TIMEOUT_MS, 600000);
  const source = fs.readFileSync(new URL('../tools/ci/verify-reviewed-projection-requests.mjs', import.meta.url), 'utf8');
  assert.match(source, /verifyProjectionRequests\(\{ root, requests: args\.slice\(7\) \}\)/);
  assert.doesNotMatch(source, /process\.env\.[A-Z_]*(?:TIMEOUT|WORKER_PATH)/);
});
