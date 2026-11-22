'use strict';
// Per-request isolation of the reviewed-meta registration pass (tools/ci/register-reviewed-meta-requests.mjs).
// A request the registrar refuses must be fail-closed and visible for that request only; it must never block
// the other inbox requests (head-of-line blocking seen on main since 2026-10-26).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const repo = path.resolve(__dirname, '..');
const script = path.join(repo, 'tools/ci/register-reviewed-meta-requests.mjs');
const read = rel => fs.readFileSync(path.join(repo, rel), 'utf8');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Fake registrar: request JSON { behavior: "ok" | "fail" | "dirty-fail" }.
const REGISTRAR = `
const fs = require('node:fs'); const path = require('node:path');
const args = process.argv.slice(2); const req = args[args.indexOf('--request') + 1];
if (!args.includes('--write')) process.exit(3);
const body = JSON.parse(fs.readFileSync(req, 'utf8')); const name = path.basename(req, '.json');
if (body.behavior !== 'fail') fs.mkdirSync('derived', { recursive: true });
if (body.behavior === 'dirty-fail') fs.writeFileSync('derived/partial-' + name + '.out', 'half written');
if (body.behavior === 'ok') { fs.writeFileSync('derived/' + name + '.out', 'applied ' + name + '\\n'); console.log(JSON.stringify({ status: 'PASS' })); process.exit(0); }
console.error('at fake (registrar.js:1:1)\\nError: before mismatch: qid_v1_' + name + '.standardCourse');
process.exit(1);
`;

function fixture(t, behaviors) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'register-isolation-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '--initial-branch=main');
  for (const [k, v] of [['user.name', 'test'], ['user.email', 'test@example.invalid'], ['core.autocrlf', 'false']]) git(dir, 'config', k, v);
  fs.mkdirSync(path.join(dir, '.archive-meta-register/inbox'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'tools/ci'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'registrar.js'), REGISTRAR);
  fs.writeFileSync(path.join(dir, 'tools/ci/commit.paths'), '# fixture\n.archive-meta-register/inbox/\n.archive-meta-register/rejected/\nderived/\n');
  for (const [name, behavior] of Object.entries(behaviors))
    fs.writeFileSync(path.join(dir, '.archive-meta-register/inbox', name + '.json'), JSON.stringify({ behavior, name }, null, 2) + '\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'seed');
  const requests = Object.keys(behaviors).sort().map(n => `.archive-meta-register/inbox/${n}.json`);
  const run = () => {
    const summary = path.join(dir, 'summary.md');
    const r = spawnSync(process.execPath, [script, '--root', dir, '--registrar', 'registrar.js', '--guard-paths-file', 'tools/ci/commit.paths',
      '--applied-file', path.join(dir, 'applied.txt'), '--rejected-file', path.join(dir, 'rejected.txt'), '--summary-file', summary, '--', ...requests],
      { cwd: dir, encoding: 'utf8', env: { ...process.env, GITHUB_ACTIONS: 'true' } });
    const lines = f => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean) : []);
    return { ...r, applied: lines('applied.txt'), rejected: lines('rejected.txt'), summary: fs.existsSync(summary) ? fs.readFileSync(summary, 'utf8') : '' };
  };
  const exists = rel => fs.existsSync(path.join(dir, rel));
  return { dir, run, exists, readJson: rel => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8')) };
}

function registryDependencyFixture(t, { providerBehavior = 'ok' } = {}) {
  const f = fixture(t, { '00-consumer': 'ok', '10-unrelated': 'ok', '99-provider': providerBehavior });
  const key = { curriculum: '2015', standardCourse: '중2 수학', standardUnitKey: 'M2-06',
    subUnitKey: 'M2-06-PARALLEL_LENGTH_RATIO', problemTypeKey: 'PT_QUADRILATERAL_PROPERTIES' };
  const put = (name, value) => fs.writeFileSync(path.join(f.dir, '.archive-meta-register/inbox', name + '.json'), JSON.stringify(value));
  put('00-consumer', { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', behavior: 'ok',
    items: [{ questionUid: 'consumer', sourceOrdinal: 1, after: key }] });
  put('99-provider', { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', behavior: providerBehavior,
    items: [{ questionUid: 'provider', sourceOrdinal: 1, after: key }],
    registryChanges: [{ path: 'archive/data/meta-foundation/canonical/packs/middle2/bindings.json', collection: 'bindings',
      match: key, before: null, after: { ...key, status: 'ACTIVE', ownerPack: 'MIDDLE2' } }] });
  git(f.dir, 'add', '-A'); git(f.dir, 'commit', '-qm', 'binding provider after consumer in filename order');
  return f;
}

const GEOMETRY_PACK = 'archive/data/meta-foundation/canonical/packs/geometry-equations';
const GEOMETRY_KEY = { curriculum: '2015', standardCourse: 'geometry fixture', standardUnitKey: 'GEOM',
  subUnitKey: 'GEOM-EXISTING', problemTypeKey: 'PT_EXISTING_GEOMETRY' };
function geometryDependencyFixture(t, { providerBehavior = 'ok', secondProviderBehavior, auditConsumer = false } = {}) {
  const behaviors = { '00-consumer': 'ok', '10-unrelated': 'ok', '99-provider': providerBehavior,
    ...(secondProviderBehavior ? { '98-second-provider': secondProviderBehavior } : {}) };
  const f = fixture(t, behaviors);
  const put = (rel, value) => {
    const file = path.join(f.dir, rel); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
  };
  const consumerPath = '.archive-meta-register/inbox/00-consumer.json', providerPath = '.archive-meta-register/inbox/99-provider.json';
  const provider = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', behavior: providerBehavior,
    items: [{ questionUid: 'geometry-provider', sourceOrdinal: 1, after: { ...GEOMETRY_KEY, standardCourse: 'other fixture' } }],
    registryChanges: [{ path: `${GEOMETRY_PACK}/taxonomy.json`, collection: 'templates',
      match: { templateKey: 'TPL_NEW' }, before: null,
      after: { templateKey: 'TPL_NEW', parentProblemTypeKey: GEOMETRY_KEY.problemTypeKey, status: 'ACTIVE' } }] };
  put(consumerPath, { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', behavior: 'ok',
    ...(auditConsumer ? { approval: { type: 'META_PIPELINE_AUDIT' } } : {}),
    items: [{ questionUid: 'geometry-consumer', sourceOrdinal: 1, after: GEOMETRY_KEY }] });
  put(providerPath, provider);
  const secondProviderPath = '.archive-meta-register/inbox/98-second-provider.json';
  if (secondProviderBehavior) {
    const second = structuredClone(provider); second.behavior = secondProviderBehavior;
    second.items[0].questionUid = 'second-provider';
    second.registryChanges[0].match.templateKey = second.registryChanges[0].after.templateKey = 'TPL_SECOND';
    put(secondProviderPath, second);
  }
  put(`${GEOMETRY_PACK}/pack.json`, { packId: 'GEOMETRY_EQUATIONS', canonicalStatus: 'ACTIVE', packVersion: '1.0.2' });
  put(`${GEOMETRY_PACK}/bindings.json`, { ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE',
    bindings: [{ ...GEOMETRY_KEY, ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE' }] });
  git(f.dir, 'add', '-A'); git(f.dir, 'commit', '-qm', 'immutable geometry provider and existing consumer');
  return { ...f, put, consumerPath, providerPath, secondProviderPath };
}

test('main geometry version attaches the fixed context to ordering and the applied-dependency graph', t => {
  const f = geometryDependencyFixture(t), r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json', f.providerPath, f.consumerPath]);
  assert.deepEqual(r.rejected, []);
});

for (const auditConsumer of [false, true]) test(`main geometry version provider refusal prevents consumer execution: audit=${auditConsumer}`, t => {
  const f = geometryDependencyFixture(t, { providerBehavior: 'fail', auditConsumer }), r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json']);
  assert.deepEqual(r.rejected, [f.providerPath, f.consumerPath]);
  assert.equal(f.exists('derived/00-consumer.out'), false);
  assert.equal(f.exists('.archive-meta-register/pending-supplement'), false);
  assert.match(f.readJson('.archive-meta-register/rejected/00-consumer.rejection.json').error, /REGISTRY_DEPENDENCY_NOT_APPLIED/);
});

test('main geometry version waits for all providers and preserves refusal isolation', t => {
  const good = geometryDependencyFixture(t, { secondProviderBehavior: 'ok' }), passed = good.run();
  assert.equal(passed.status, 0, passed.stderr);
  assert.deepEqual(passed.applied, ['.archive-meta-register/inbox/10-unrelated.json', good.secondProviderPath, good.providerPath, good.consumerPath]);
  const bad = geometryDependencyFixture(t, { secondProviderBehavior: 'fail' }), refused = bad.run();
  assert.equal(refused.status, 0, refused.stderr);
  assert.deepEqual(refused.applied, ['.archive-meta-register/inbox/10-unrelated.json', bad.providerPath]);
  assert.deepEqual(refused.rejected, [bad.secondProviderPath, bad.consumerPath]);
  assert.equal(bad.exists('derived/00-consumer.out'), false);
});

test('main geometry version ordering uses immutable HEAD despite generated worktree changes', t => {
  const f = geometryDependencyFixture(t);
  f.put(`${GEOMETRY_PACK}/pack.json`, { packId: 'GEOMETRY_EQUATIONS', canonicalStatus: 'ACTIVE', packVersion: '1.0.3' });
  f.put(`${GEOMETRY_PACK}/bindings.json`, { ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE', bindings: [] });
  const r = f.run(); assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json', f.providerPath, f.consumerPath]);
});

test('main geometry version rejects missing immutable canonical inputs before any registrar', t => {
  const f = geometryDependencyFixture(t);
  git(f.dir, 'rm', '-q', `${GEOMETRY_PACK}/bindings.json`); git(f.dir, 'commit', '-qm', 'remove canonical binding input');
  f.put(`${GEOMETRY_PACK}/bindings.json`, { ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE',
    bindings: [{ ...GEOMETRY_KEY, ownerPack: 'GEOMETRY_EQUATIONS', status: 'ACTIVE' }] });
  const r = f.run(); assert.equal(r.status, 1);
  assert.deepEqual(r.applied, []); assert.equal(f.exists('derived'), false);
  assert.match(r.stderr, /PR_NATIVE_PREVIEW:GIT_INPUT_MISSING:/);
});

test('main geometry version retains cycle refusal across an ordinary binding dependency', t => {
  const f = geometryDependencyFixture(t), consumer = f.readJson(f.consumerPath), provider = f.readJson(f.providerPath);
  const key = { ...GEOMETRY_KEY, standardCourse: 'other fixture' };
  consumer.registryChanges = [{ path: 'archive/data/meta-foundation/canonical/packs/middle2/bindings.json',
    collection: 'bindings', match: key, before: null, after: { ...key, status: 'ACTIVE', ownerPack: 'MIDDLE2' } }];
  f.put(f.consumerPath, consumer); f.put(f.providerPath, provider);
  git(f.dir, 'add', '-A'); git(f.dir, 'commit', '-qm', 'mixed binding and geometry version cycle');
  const r = f.run(); assert.equal(r.status, 1); assert.match(r.stderr, /REGISTRY_DEPENDENCY_CYCLE/);
  assert.deepEqual(r.applied, []); assert.equal(f.exists('derived'), false);
});

test('main geometry version rejects ambiguous immutable ACTIVE bindings before any registrar', t => {
  const f = geometryDependencyFixture(t), bindings = f.readJson(`${GEOMETRY_PACK}/bindings.json`);
  bindings.bindings.push(structuredClone(bindings.bindings[0])); f.put(`${GEOMETRY_PACK}/bindings.json`, bindings);
  git(f.dir, 'add', '-A'); git(f.dir, 'commit', '-qm', 'ambiguous immutable geometry binding');
  const r = f.run(); assert.equal(r.status, 1); assert.match(r.stderr, /REGISTRY_VERSION_AMBIGUOUS/);
  assert.deepEqual(r.applied, []); assert.equal(f.exists('derived'), false);
});

test('main provider-free ordering retains its non-Git synthetic path', async t => {
  const f = fixture(t, { a: 'ok', b: 'ok' }); fs.rmSync(path.join(f.dir, '.git'), { recursive: true, force: true });
  const { orderedRequestPaths } = await import(require('node:url').pathToFileURL(script).href);
  const requests = ['.archive-meta-register/inbox/b.json', '.archive-meta-register/inbox/a.json'];
  assert.deepEqual(orderedRequestPaths({ root: f.dir, requests }), requests);
});

test('main add-only binding provider executes before its exact dependent request', t => {
  const f = registryDependencyFixture(t), r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json',
    '.archive-meta-register/inbox/99-provider.json', '.archive-meta-register/inbox/00-consumer.json']);
  assert.deepEqual(r.rejected, []);
});

test('a refused binding provider blocks only its exact consumer and cannot create approval', t => {
  const f = registryDependencyFixture(t, { providerBehavior: 'fail' }), r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json']);
  assert.deepEqual(r.rejected, ['.archive-meta-register/inbox/99-provider.json', '.archive-meta-register/inbox/00-consumer.json']);
  assert.equal(f.exists('derived/00-consumer.out'), false);
  assert.match(f.readJson('.archive-meta-register/rejected/00-consumer.rejection.json').error, /REGISTRY_DEPENDENCY_NOT_APPLIED/);
});

test('an audit consumer cannot turn a refused binding dependency into provisional approval', t => {
  const f = registryDependencyFixture(t, { providerBehavior: 'fail' });
  const relative = '.archive-meta-register/inbox/00-consumer.json', request = f.readJson(relative);
  request.approval = { type: 'META_PIPELINE_AUDIT' };
  fs.writeFileSync(path.join(f.dir, relative), JSON.stringify(request));
  const r = f.run(); assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/10-unrelated.json']);
  assert.equal(f.exists('.archive-meta-register/pending-supplement'), false);
  assert.match(f.readJson('.archive-meta-register/rejected/00-consumer.rejection.json').error, /REGISTRY_DEPENDENCY_NOT_APPLIED/);
});

for (const mode of ['duplicate', 'cycle']) test(`main rejects a ${mode} binding graph before invoking any registrar`, t => {
  const f = registryDependencyFixture(t), relative = '.archive-meta-register/inbox/99-provider.json', provider = f.readJson(relative);
  if (mode === 'duplicate') provider.registryChanges.push(structuredClone(provider.registryChanges[0]));
  else {
    const consumerPath = '.archive-meta-register/inbox/00-consumer.json', consumer = f.readJson(consumerPath);
    const change = structuredClone(provider.registryChanges[0]);
    change.match.problemTypeKey = 'PT_SECOND'; change.after.problemTypeKey = 'PT_SECOND';
    consumer.registryChanges = [change]; provider.items[0].after = structuredClone(change.match);
    fs.writeFileSync(path.join(f.dir, consumerPath), JSON.stringify(consumer));
  }
  fs.writeFileSync(path.join(f.dir, relative), JSON.stringify(provider));
  const r = f.run(); assert.equal(r.status, 1);
  assert.match(r.stderr, mode === 'duplicate' ? /REGISTRY_DEPENDENCY_AMBIGUOUS/ : /REGISTRY_DEPENDENCY_CYCLE/);
  assert.deepEqual(r.applied, []); assert.equal(f.exists('derived'), false);
});

test('a refused first request does not block the remaining requests (head-of-line fix)', t => {
  const f = fixture(t, { '16-first-bad': 'fail', '17-good': 'ok', '18-also-bad': 'fail', '19-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/17-good.json', '.archive-meta-register/inbox/19-good.json']);
  assert.deepEqual(r.rejected, ['.archive-meta-register/inbox/16-first-bad.json', '.archive-meta-register/inbox/18-also-bad.json']);
  for (const good of ['17-good', '19-good']) {
    assert.ok(f.exists(`derived/${good}.out`), `${good} was applied`);
    assert.ok(f.exists(`.archive-meta-register/inbox/${good}.json`), `${good} stays in the inbox until the pass consumes it`);
  }
  for (const bad of ['16-first-bad', '18-also-bad']) {
    assert.ok(!f.exists(`derived/${bad}.out`), `${bad} applied nothing (fail-closed)`);
    assert.ok(!f.exists(`.archive-meta-register/inbox/${bad}.json`), `${bad} left the inbox`);
    assert.ok(f.exists(`.archive-meta-register/rejected/${bad}.json`), `${bad} request kept for the meta owner`);
  }
});

test('the rejection is tracked, exact, deterministic and visible', t => {
  const f = fixture(t, { '16-first-bad': 'fail', '17-good': 'ok' });
  const r = f.run();
  const record = f.readJson('.archive-meta-register/rejected/16-first-bad.rejection.json');
  assert.equal(record.schemaVersion, 'archive-reviewed-meta-register-rejection-v1');
  assert.equal(record.request, '16-first-bad.json');
  assert.equal(record.error, 'Error: before mismatch: qid_v1_16-first-bad.standardCourse');
  assert.equal(record.registrarExitCode, 1);
  assert.match(record.requestSha256, /^[0-9a-f]{64}$/);
  assert.equal(record.requestSha256, require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.json'))).digest('hex'));
  assert.ok(!Object.keys(record).some(k => /time|date|sha1|base/i.test(k.replace('requestSha256', ''))), 'no run-specific fields, so a regenerate retry reproduces identical bytes');
  assert.match(r.stdout, /::error title=Reviewed meta request rejected \(registrar\)::16-first-bad\.json: Error: before mismatch/);
  assert.match(r.summary, /applied: \*\*1\*\*, rejected: \*\*1\*\*/);
  assert.match(r.summary, /\| `16-first-bad\.json` \| Error: before mismatch: qid_v1_16-first-bad\.standardCourse \|/);
  // Re-running on a fresh checkout of the same base yields byte-identical rejection records.
  const first = fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.rejection.json'), 'utf8');
  git(f.dir, 'checkout', '-q', '--', '.'); git(f.dir, 'clean', '-fdq');
  f.run();
  assert.equal(fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.rejection.json'), 'utf8'), first);
});

test('every request refused: pass still finishes, nothing is applied, all are recorded', t => {
  const f = fixture(t, { a: 'fail', b: 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, []);
  assert.equal(r.rejected.length, 2);
  assert.ok(!f.exists('derived'), 'no registration output');
  assert.deepEqual(fs.readdirSync(path.join(f.dir, '.archive-meta-register/inbox')), []);
});

test('a refusal that changed the tree breaks isolation: abort with exit 2, later requests untouched', t => {
  const f = fixture(t, { '1-good': 'ok', '2-dirty': 'dirty-fail', '3-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 2);
  assert.match(r.stderr, /per-request isolation cannot be proven/);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/1-good.json']);
  assert.ok(!f.exists('derived/3-good.out'), 'processing stopped after the dirtied tree');
  assert.ok(f.exists('.archive-meta-register/inbox/2-dirty.json'), 'the dirtying request is left in place, not recorded as a clean rejection');
});

test('a fixed re-submission supersedes the earlier rejection record', t => {
  const f = fixture(t, { 'x-request': 'fail' });
  f.run();
  assert.ok(f.exists('.archive-meta-register/rejected/x-request.rejection.json'));
  fs.writeFileSync(path.join(f.dir, '.archive-meta-register/inbox/x-request.json'), JSON.stringify({ behavior: 'ok' }));
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/x-request.json']);
  assert.ok(!f.exists('.archive-meta-register/rejected/x-request.rejection.json'));
  assert.ok(!f.exists('.archive-meta-register/rejected/x-request.json'));
});

function auditDependencyFixture(t, { difficultyBehavior = 'ok', auditBehavior = 'ok', partial = false } = {}) {
  const f=fixture(t,{'00-preserve':auditBehavior,'10-unrelated':'ok','99-difficulty':difficultyBehavior});
  const put=(rel,value)=>{fs.mkdirSync(path.dirname(path.join(f.dir,rel)),{recursive:true});fs.writeFileSync(path.join(f.dir,rel),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
  const source='archive/exams/original/dependency.js',count=partial?3:1,
    body='window.questions='+JSON.stringify(Array.from({length:count},(_,i)=>({id:i+1})))+';\n';
  put(source,body);
  const blob=require('node:crypto').createHash('sha1').update(`blob ${Buffer.byteLength(body)}\0`).update(body).digest('hex');
  const difficultyPath='.archive-meta-register/inbox/99-difficulty.json',auditPath='.archive-meta-register/inbox/00-preserve.json';
  const difficulty={schemaVersion:'archive-difficulty5-register-request-v1',behavior:difficultyBehavior,
    gemini:{schemaVersion:'v1',sourceArchiveFile:'original/dependency.js',latestBlobSha:blob,
      items:Array.from({length:count},(_,i)=>({questionUid:'fixture-'+(i+1),ordinal:i+1}))},
    reviewedCorrection:{schemaVersion:'archive-difficulty5-reviewed-correction-v1'}};
  put(difficultyPath,difficulty);
  const digest=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(f.dir,difficultyPath))).digest('hex');
  const audit={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',behavior:auditBehavior,
    sourceArchiveFile:'original/dependency.js',expectedSourceBlobSha1:blob,expectedQuestionCount:count,
    ...(partial?{scope:'PARTIAL_UIDS'}:{}),items:[{questionUid:'fixture-'+(partial?2:1),sourceOrdinal:partial?2:1}],
    approval:{type:'META_PIPELINE_AUDIT',sourceRebind:{schemaVersion:'archive-native-audit-preservation-v1',
      requestPath:auditPath,difficultyRequestRef:{path:difficultyPath,sha256:digest}}}};
  put(auditPath,audit);git(f.dir,'add','-A');git(f.dir,'commit','-qm','bind audit dependency inputs');
  return {...f,put,audit,difficulty,auditPath,difficultyPath,source};
}

function basicDependencyFixture(t,{behavior='ok',stale=false,newParent=false}={}){
  const f=fixture(t,{'00-difficulty':'ok','10-unrelated':'ok','99-basic-preserve':behavior});
  const put=(rel,value)=>{fs.mkdirSync(path.dirname(path.join(f.dir,rel)),{recursive:true});fs.writeFileSync(path.join(f.dir,rel),typeof value==='string'?value:JSON.stringify(value)+'\n');};
  const source='archive/exams/original/basic.js',body='window.questions=[{id:1}];\n';put(source,body);
  const blob=require('node:crypto').createHash('sha1').update(`blob ${Buffer.byteLength(body)}\0`).update(body).digest('hex');
  const fingerprints={sourceFingerprint:'a'.repeat(64),contentFingerprint:'b'.repeat(64)},uid='fixture';
  const basicPath='.archive-meta-register/inbox/99-basic-preserve.json',difficultyPath='.archive-meta-register/inbox/00-difficulty.json';
  put(basicPath,{schemaVersion:'archive-basic-scope-rebind-request-v1',behavior,sourceArchiveFile:'original/basic.js',expectedSourceBlobSha1:blob,expectedQuestionCount:1,
    approval:{type:'BASIC_SCOPE_REBIND',sourceReview:{schemaVersion:newParent?'archive-reviewed-native-basic-parent-v1':'archive-basic-scope-current-source-preservation-v1'}},
    items:[{questionUid:uid,sourceOrdinal:1,after:fingerprints}]});
  put(difficultyPath,{schemaVersion:'archive-difficulty5-register-request-v1',behavior:'ok',
    gemini:{schemaVersion:'v1',sourceArchiveFile:'original/basic.js',latestBlobSha:blob,items:[{questionUid:uid,ordinal:1}]},
    reviewedCorrection:{schemaVersion:'archive-difficulty5-reviewed-correction-v1',rows:[{questionUid:uid,ordinal:1,before:stale?{...fingerprints,sourceFingerprint:'0'.repeat(64)}:fingerprints}]}});
  git(f.dir,'add','-A');git(f.dir,'commit','-qm','bind basic preservation before reviewed difficulty');
  return{...f,basicPath,difficultyPath};
}

test('main uses exact basic-before-D5 dependency despite reversed filenames',t=>{
  const f=basicDependencyFixture(t),r=f.run();assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.basicPath,f.difficultyPath]);assert.deepEqual(r.rejected,[]);
});
test('main orders a new BASIC parent before exact D5 and propagates its refusal without changing unrelated requests',t=>{
  const f=basicDependencyFixture(t,{newParent:true}),r=f.run();assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.basicPath,f.difficultyPath]);assert.deepEqual(r.rejected,[]);
  const bad=basicDependencyFixture(t,{newParent:true,behavior:'fail'}),refused=bad.run();assert.equal(refused.status,0,refused.stderr);
  assert.deepEqual(refused.applied,['.archive-meta-register/inbox/10-unrelated.json']);assert.deepEqual(refused.rejected,[bad.basicPath,bad.difficultyPath]);
});
test('refused basic preservation prevents its paired D5 and keeps unrelated registration',t=>{
  const f=basicDependencyFixture(t,{behavior:'fail'}),r=f.run();assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json']);assert.deepEqual(r.rejected,[f.basicPath,f.difficultyPath]);
  assert.match(f.readJson('.archive-meta-register/rejected/00-difficulty.rejection.json').error,/BASIC_DEPENDENCY_NOT_APPLIED/);
  assert.ok(!f.exists('derived/00-difficulty.out'));assert.ok(!f.exists('.archive-meta-register/pending-supplement'));
});
test('stale basic-to-D5 fingerprint declaration is rejected before either registrar runs',t=>{
  const f=basicDependencyFixture(t,{stale:true}),r=f.run();assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json']);assert.deepEqual(r.rejected,[f.basicPath,f.difficultyPath]);
  assert.match(f.readJson('.archive-meta-register/rejected/99-basic-preserve.rejection.json').error,/BASIC_DEPENDENCY_FINGERPRINT/);
});

test('main registrar uses exact D5 dependency order despite reversed inbox names and preserves unrelated order',t=>{
  const f=auditDependencyFixture(t),r=f.run();
  assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.difficultyPath,f.auditPath]);
  assert.deepEqual(r.rejected,[]);assert.ok(f.exists('derived/00-preserve.out'));
});

test('main partial audit uses its full source D5 denominator and preserves the selected UID subset',t=>{
  const f=auditDependencyFixture(t,{partial:true}),r=f.run();
  assert.equal(r.status,0,r.stderr);assert.deepEqual(r.rejected,[]);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.difficultyPath,f.auditPath]);
});

for(const [name,mutate,reason] of [
  ['narrowed D5 denominator',f=>{f.difficulty.gemini.items=f.difficulty.gemini.items.slice(1,2);},/AUDIT_DEPENDENCY_DENOMINATOR/],
  ['substituted selected UID',f=>{f.audit.items[0].questionUid='another-uid';},/AUDIT_DEPENDENCY_UID_SCOPE/],
  ['selected count substituted for source count',f=>{f.audit.expectedQuestionCount=1;},/AUDIT_DEPENDENCY_SOURCE_DENOMINATOR/],
])test(`main partial audit rejects ${name} before the preservation writer`,t=>{
  const f=auditDependencyFixture(t,{partial:true});mutate(f);f.put(f.difficultyPath,f.difficulty);
  f.audit.approval.sourceRebind.difficultyRequestRef.sha256=require('node:crypto').createHash('sha256')
    .update(fs.readFileSync(path.join(f.dir,f.difficultyPath))).digest('hex');f.put(f.auditPath,f.audit);
  const r=f.run();assert.equal(r.status,0,r.stderr);assert.deepEqual(r.rejected,[f.auditPath]);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.difficultyPath]);
  assert.match(f.readJson('.archive-meta-register/rejected/00-preserve.rejection.json').error,reason);
  assert.ok(!f.exists('derived/00-preserve.out'));
});

test('a refused difficulty dependency cannot run preservation or become a provisional approval',t=>{
  const f=auditDependencyFixture(t,{difficultyBehavior:'fail'}),r=f.run();
  assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json']);
  assert.deepEqual(r.rejected,[f.difficultyPath,f.auditPath]);
  assert.ok(!f.exists('derived/00-preserve.out'));
  assert.ok(!f.exists('.archive-meta-register/pending-supplement'));
  assert.match(f.readJson('.archive-meta-register/rejected/00-preserve.rejection.json').error,/AUDIT_DEPENDENCY_NOT_APPLIED/);
});

test('a refused audit preservation retains rejection semantics after its valid D5 dependency applies',t=>{
  const f=auditDependencyFixture(t,{auditBehavior:'fail'}),r=f.run();
  assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.difficultyPath]);
  assert.deepEqual(r.rejected,[f.auditPath]);assert.ok(!f.exists('.archive-meta-register/pending-supplement'));
});

for(const [name,mutate,reason] of [
  ['raw request SHA drift',f=>{f.audit.approval.sourceRebind.difficultyRequestRef.sha256='0'.repeat(64);f.put(f.auditPath,f.audit);},/AUDIT_DEPENDENCY_SHA/],
  ['missing selected dependency',f=>{f.audit.approval.sourceRebind.difficultyRequestRef.path='.archive-meta-register/inbox/other-owner.json';f.put(f.auditPath,f.audit);},/AUDIT_DEPENDENCY_NOT_SELECTED/],
  ['actual source byte drift',f=>f.put(f.source,'window.questions=[{id:2}];\n'),/AUDIT_DEPENDENCY_SOURCE_NOT_FIXED/],
  ['provisional approval substitution',f=>{f.audit.approval.type='FINAL_QA';f.put(f.auditPath,f.audit);},/AUDIT_DEPENDENCY_SCOPE/],
])test(`main dependency validation isolates ${name} without running preservation`,t=>{
  const f=auditDependencyFixture(t);mutate(f);const r=f.run();
  assert.equal(r.status,0,r.stderr);assert.deepEqual(r.rejected,[f.auditPath]);
  assert.deepEqual(r.applied,['.archive-meta-register/inbox/10-unrelated.json',f.difficultyPath]);
  assert.match(f.readJson('.archive-meta-register/rejected/00-preserve.rejection.json').error,reason);
  assert.ok(!f.exists('derived/00-preserve.out'));
  assert.ok(!f.exists(f.auditPath));assert.ok(f.exists(f.difficultyPath));
  assert.ok(!f.exists('.archive-meta-register/pending-supplement'));
});

test('the pass and workflow wiring use the isolating registrar and keep the single-writer design', () => {
  const pass = read('tools/ci/reviewed-meta-register-pass.sh');
  assert.ok(pass.includes('isolate=tools/ci/register-reviewed-meta-requests.mjs') && pass.includes('node "$isolate" --applied-file'), 'requests are registered through the isolating script');
  assert.ok(!/for request in "\$\{reqs\[@\]\}"; do\s*\n\s*node archive\/tools\/meta-foundation\/register-reviewed-exam-meta-source\.mjs[^\n]*--write/.test(pass), 'no unguarded fail-fast registrar loop');
  assert.ok(pass.includes('for request in "${applied[@]}"; do rm -f -- "$request"; done'), 'only applied requests are consumed');
  assert.ok(pass.includes('verify-reviewed-projection-requests.mjs') && pass.includes('--candidates-file') && pass.includes('-- "${applied[@]}"'), 'only applied requests enter the read-only projection phase');
  assert.ok(pass.includes('for round in 1 2; do'), 'bounded to two registration rounds');
  assert.ok(pass.indexOf('compile-meta-foundation.mjs --write') > 0 && pass.indexOf('compile-meta-foundation.mjs --write') < pass.indexOf('compile-meta-foundation.mjs --canonical-only-check'),
    'derived compiled data is written by the single writer before its parity gate (a stale base must not block every request)');
  const paths = read('tools/ci/archive-meta-register-commit.paths').split(/\r?\n/);
  assert.ok(paths.includes('.archive-meta-register/rejected/'), 'rejection records are committed by the single writer');
  const trigger = read('tools/ci/archive-meta-register-trigger-paths.txt');
  assert.ok(!trigger.includes('rejected'), 'a rejection record is not a new native registration request');
  const writer = read('tools/ci/archive-registration-writer.mjs');
  assert.match(writer, /cmd\('bash','tools\/ci\/reviewed-meta-register-pass\.sh'\)/);
  assert.match(writer, /cmd\('bash','tools\/ci\/verify-registered-consumer-approval\.sh'\)/);
  const workflow = read('.github/workflows/archive-main-auto-meta.yml');
  assert.ok(workflow.includes('node tools/ci/archive-registration-writer.mjs') && workflow.includes('tools/ci/git-push-derived-with-retry.mjs'));
  assert.ok(!read('.github/workflows/archive-reviewed-exam-meta-register.yml').includes('reviewed-meta-register-pass.sh'), 'compatibility dispatch cannot become a second request consumer');
});

// ---- reject / reset modes ---------------------------------------------------------------------------------
test('--reject records an already-applied request, --reset-derived restores every registration path but inbox/rejected', t => {
  const f = fixture(t, { 'a-good': 'ok', 'b-good': 'ok' });
  assert.equal(f.run().status, 0);
  assert.ok(f.exists('derived/a-good.out'));
  const run = (...args) => spawnSync(process.execPath, [script, '--root', f.dir, '--guard-paths-file', 'tools/ci/commit.paths', ...args], { cwd: f.dir, encoding: 'utf8' });
  assert.equal(run('--reset-derived').status, 0);
  assert.ok(!f.exists('derived/a-good.out') && !f.exists('derived'), 'derived output removed');
  assert.ok(f.exists('.archive-meta-register/inbox/a-good.json'), 'inbox untouched by the reset');
  const r = run('--reject', '.archive-meta-register/inbox/b-good.json', '--stage', 'projection-verify', '--error', 'Error: Consumer metadata mismatch: x.curriculumKey');
  assert.equal(r.status, 0, r.stderr);
  const rec = f.readJson('.archive-meta-register/rejected/b-good.rejection.json');
  assert.equal(rec.stage, 'projection-verify');
  assert.equal(rec.error, 'Error: Consumer metadata mismatch: x.curriculumKey');
  assert.ok(!f.exists('.archive-meta-register/inbox/b-good.json') && f.exists('.archive-meta-register/rejected/b-good.json'));
});

// ---- the whole pass with stubbed heavy steps ---------------------------------------------------------------
// Real tools/ci pass + isolating script; the registrar, build_db and validators are stubs driven by request JSON:
//   behavior ok | fail (registrar refuses) | verify-fail (applies, then projection verification refuses)
//   verify-fail-silent (refuses with exit 7 and no "Error:" line) | verify-fail-assert ("AssertionError [ERR_ASSERTION]: ..." only)
//   verifyNeeds: "<name>" (verification refuses when derived/<name>.out is absent)
function passFixture(t, behaviors, { buildFailOnce = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'register-pass-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '--initial-branch=main');
  for (const [k, v] of [['user.name', 'test'], ['user.email', 'test@example.invalid'], ['core.autocrlf', 'false']]) git(dir, 'config', k, v);
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text); };
  // Copy the real preview module with its relative static imports.
  // Heavy execution steps are still replaced by the explicit stubs below.
  const copied = new Set();
  const copyModule = rel => {
    rel = path.posix.normalize(rel);
    assert.ok(!path.posix.isAbsolute(rel) && rel !== '..' && !rel.startsWith('../'), 'fixture module stays inside the repository');
    if (copied.has(rel)) return;
    copied.add(rel);
    const text = read(rel); put(rel, text);
    if (!/\.[cm]?js$/.test(rel)) return;
    const staticImports = /\b(?:import|export)\s+(?:[^'";()]*?\s+from\s*)?['"](\.{1,2}\/[^'"]+)['"]/g;
    const staticRequires = /\brequire\s*\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g;
    for (const pattern of [staticImports, staticRequires]) for (const match of text.matchAll(pattern))
      copyModule(path.posix.join(path.posix.dirname(rel), match[1]));
  };
  for (const rel of ['tools/ci/reviewed-meta-register-pass.sh', 'tools/ci/register-reviewed-meta-requests.mjs', 'tools/ci/archive-pr-native-preview.mjs', 'tools/ci/collect-reviewed-consumer-refusals.mjs', 'tools/ci/archive-meta-register-commit.paths', 'archive/tools/meta-foundation/verify-meta-pipeline-student-access.mjs',
    'archive/tools/meta-foundation/native-authority-correction.mjs', 'archive/tools/meta-foundation/reviewed-runtime-summary.mjs'])
    put(rel, read(rel));
  copyModule('tools/ci/archive-pr-native-preview.mjs');
  // Keep the real generation entrypoint; only its heavy Python child is stubbed.
  copyModule('tools/ci/archive-registration-build-db.mjs');
  copyModule('tools/ci/verify-reviewed-projection-requests.mjs');
  // The real registration paths plus `derived/`, where the stub registrar writes its output.
  put('tools/ci/archive-meta-register-commit.paths', read('tools/ci/archive-meta-register-commit.paths') + 'derived/\n');
  put('derived/.keep', '');
  put('tools/bin/python', '#!/bin/sh\nexec node "$@"\n'); fs.chmodSync(path.join(dir, 'tools/bin/python'), 0o755);
  for (const rel of ['tests/archive-reviewed-exam-registration-v2.test.mjs', 'tests/archive-reviewed-projection-phase.test.mjs', 'tests/archive-finalqa-nonpt-register.test.mjs', 'tests/archive-finalqa-nonpt-real-geumdang.test.mjs'])
    put(rel, "import test from 'node:test'; test('stub', () => {});\n");
  put('archive/build_db.py', `const fs = require('node:fs'); const n = Number(fs.existsSync('build.count') ? fs.readFileSync('build.count', 'utf8') : 0) + 1; fs.writeFileSync('build.count', String(n));
${buildFailOnce ? "if (n === 1) { console.error('first build does not converge'); process.exit(1); }" : ''}
`);
  for (const rel of ['archive/tools/verify-archive-registration.mjs', 'archive/tools/build-archive2-catalog.mjs', 'archive/tools/meta-foundation/compile-meta-foundation.mjs'])
    put(rel, '');
  put('archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs', `import fs from 'node:fs'; import path from 'node:path';
const args = process.argv.slice(2); const req = args[args.indexOf('--request') + 1]; const body = JSON.parse(fs.readFileSync(req, 'utf8'));
const name = path.basename(req, '.json');
if (args.includes('--verify-projection')) {
  const missing = body.verifyNeeds && !fs.existsSync('derived/' + body.verifyNeeds + '.out');
  if (body.behavior === 'verify-fail-silent' && fs.existsSync('derived/' + name + '.out')) { process.stderr.write('no error line here\\n'); process.exit(7); }
  if (body.behavior === 'verify-fail-assert' && fs.existsSync('derived/' + name + '.out')) { console.error('AssertionError [ERR_ASSERTION]: projection differs'); process.exit(1); }
  if ((body.behavior === 'verify-fail' && fs.existsSync('derived/' + name + '.out')) || missing) { console.error('at x (y:1:1)\\nError: Consumer metadata mismatch: qid_' + name + '.curriculumKey'); process.exit(1); }
  process.exit(0);
}
if (body.behavior === 'fail') { console.error('Error: before mismatch: qid_' + name + '.standardCourse'); process.exit(1); }
fs.mkdirSync('derived', { recursive: true }); fs.writeFileSync('derived/' + name + '.out', 'applied\\n'); console.log('{}');
`);
  // The real phase/supervisor invokes a synchronous v2 verifier in its worker.
  // Keep the heavy verifier stub explicit; exits exercise the real IPC boundary.
  put('archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs', `import fs from 'node:fs';import assert from 'node:assert/strict';
export function registerReviewedExamV2({ request: body }) {
  const name=body.fixtureName, missing=body.verifyNeeds&&!fs.existsSync('derived/'+body.verifyNeeds+'.out');
  if(body.behavior==='verify-fail-silent'&&fs.existsSync('derived/'+name+'.out'))process.exit(7);
  if(body.behavior==='verify-fail-assert'&&fs.existsSync('derived/'+name+'.out'))assert.fail('projection differs');
  if((body.behavior==='verify-fail'&&fs.existsSync('derived/'+name+'.out'))||missing)throw new Error('Consumer metadata mismatch: qid_'+name+'.curriculumKey');
  return {status:'PASS'};
}
`);
  put('archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs', `import fs from 'node:fs'; import path from 'node:path';
export function verifyChangedUidConsumerApproval({ requestPaths }) {
  const exams = [], failures = [];
  for (const file of requestPaths) {
    const body = JSON.parse(fs.readFileSync(file, 'utf8')), exam = path.basename(file, '.json');
    exams.push({ file, exam, changed: 1, checked: 1, passed: 1 });
    if (body.behavior === 'consumer-global-fail') failures.push({ exam: '-', reason: 'CONSUMER_LOAD_FAILED', detail: 'manifest digest drift' });
    else if (body.behavior === 'consumer-fail' || (body.consumerNeeds && !fs.existsSync('derived/' + body.consumerNeeds + '.out'))) {
      failures.push({ exam, qid: 1, uid: 'fixture-' + exam, reason: 'VALUE_MISMATCH', detail: 'request 2 != consumer 3' });
      exams.at(-1).passed = 0;
    }
  }
  return { status: failures.length ? 'FAIL' : 'PASS', exams, failures,
    counts: { changed: exams.length, checked: exams.length, passed: exams.length - failures.length } };
}
`);
  for (const [name, body] of Object.entries(behaviors))
    put(`.archive-meta-register/inbox/${name}.json`, JSON.stringify({ schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', fixtureName: name, approval: { type: 'FINAL_QA' }, ...(typeof body === 'string' ? { behavior: body } : body) }, null, 2) + '\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'seed');
  const exists = rel => fs.existsSync(path.join(dir, rel));
  const run = () => {
    const summary = path.join(dir, 'summary.md'); fs.rmSync(summary, { force: true });
    const runner = fs.mkdtempSync(path.join(os.tmpdir(), 'register-pass-evidence-')); t.after(() => fs.rmSync(runner, { recursive: true, force: true }));
    const r = spawnSync('bash', ['tools/ci/reviewed-meta-register-pass.sh'], { cwd: dir, encoding: 'utf8',
      env: { ...process.env, PATH: path.join(dir, 'tools/bin') + path.delimiter + process.env.PATH, RUNNER_TEMP: runner, GITHUB_STEP_SUMMARY: summary, ARCHIVE_META_SCOPED: 'false' } });
    return { ...r, evidenceRoot: runner, copies: fs.existsSync(path.join(runner, 'archive-meta-register-pass/requests')) ? fs.readdirSync(path.join(runner, 'archive-meta-register-pass/requests')).sort() : [],
      builds: exists('build.count') ? Number(fs.readFileSync(path.join(dir, 'build.count'), 'utf8')) : 0,
      inbox: fs.readdirSync(path.join(dir, '.archive-meta-register/inbox')).sort() };
  };
  return { dir, run, exists, readJson: rel => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8')) };
}

test('pass: registrar refusals are isolated and the rest is built once, consumed and kept for the final Consumer check', t => {
  const f = passFixture(t, { '16-first-bad': 'fail', '17-good': 'ok', '19-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 1, 'a single shared build when nothing fails verification');
  assert.deepEqual(r.inbox, [], 'applied requests consumed, refused one moved out');
  assert.deepEqual(r.copies, ['17-good.json', '19-good.json'], 'only applied requests are checked for changed-UID approval after the push');
  assert.ok(f.exists('derived/17-good.out') && f.exists('derived/19-good.out') && !f.exists('derived/16-first-bad.out'));
  assert.equal(f.readJson('.archive-meta-register/rejected/16-first-bad.rejection.json').stage, 'registrar');
});

test('pass: a request refused by the projection verification is rejected and the others are redone without it (round 2)', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-verify-bad': 'verify-fail', '3-good': 'ok', '4-registrar-bad': 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2, 'one rebuild after dropping the refused request');
  assert.ok(f.exists('derived/1-good.out') && f.exists('derived/3-good.out'));
  assert.ok(!f.exists('derived/2-verify-bad.out'), 'the verification-refused request was undone, not left half applied');
  const rec = f.readJson('.archive-meta-register/rejected/2-verify-bad.rejection.json');
  assert.equal(rec.stage, 'projection-verify');
  assert.equal(rec.error, 'Error: Consumer metadata mismatch: qid_2-verify-bad.curriculumKey');
  assert.equal(f.readJson('.archive-meta-register/rejected/4-registrar-bad.rejection.json').stage, 'registrar');
  assert.deepEqual(r.inbox, []);
  assert.deepEqual(r.copies, ['1-good.json', '3-good.json']);
  assert.match(r.stdout + fs.readFileSync(path.join(f.dir, 'summary.md'), 'utf8'), /REJECTED \(projection-verify\)/);
});

test('pass: still fail-closed when the second round is refused too (no endless isolation)', t => {
  const f = passFixture(t, { 'x-bad': 'verify-fail', 'y-needs-x': { behavior: 'ok', verifyNeeds: 'x-bad' } });
  const r = f.run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /still refuses 1 request\(s\) after the second round/);
  assert.equal(r.builds, 2);
  assert.ok(f.exists('.archive-meta-register/inbox/y-needs-x.json'), 'nothing was consumed by the failed pass');
});

test('pass: actual consumer refusals are rolled back and recorded before valid requests are consumed', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-consumer-bad': 'consumer-fail', '3-projection-bad': 'verify-fail' });
  const original = fs.readFileSync(path.join(f.dir, '.archive-meta-register/inbox/2-consumer-bad.json'));
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2);
  assert.ok(f.exists('derived/1-good.out'));
  assert.ok(!f.exists('derived/2-consumer-bad.out') && !f.exists('derived/3-projection-bad.out'));
  assert.deepEqual(fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/2-consumer-bad.json')), original);
  const rejection = f.readJson('.archive-meta-register/rejected/2-consumer-bad.rejection.json');
  assert.equal(rejection.stage, 'consumer-verify');
  assert.match(rejection.error, /VALUE_MISMATCH Q1: request 2 != consumer 3/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(r.evidenceRoot,'archive-meta-register-pass/consumer-preflight-1.json'),'utf8')).status, 'FAIL');
  assert.equal(JSON.parse(fs.readFileSync(path.join(r.evidenceRoot,'archive-meta-register-pass/consumer-preflight-2.json'),'utf8')).status, 'PASS');
  assert.deepEqual(r.inbox, []);
  assert.deepEqual(r.copies, ['1-good.json'], 'only actually verified requests reach the independent final gate');
});

test('pass: global consumer failure stops the pass without rejecting or consuming requests', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-global': 'consumer-global-fail' });
  const r = f.run();
  assert.equal(r.status, 1, r.stdout + r.stderr);
  assert.match(r.stderr, /Non-isolatable consumer failure: CONSUMER_LOAD_FAILED/);
  assert.equal(r.builds, 1);
  assert.deepEqual(r.inbox, ['1-good.json', '2-global.json']);
  assert.deepEqual(r.copies, []);
  assert.ok(!f.exists('.archive-meta-register/rejected/2-global.json'));
});

test('pass: actual consumer must still pass after the second rebuild', t => {
  const f = passFixture(t, { 'x-bad': 'consumer-fail', 'y-needs-x': { behavior: 'ok', consumerNeeds: 'x-bad' } });
  const r = f.run();
  assert.equal(r.status, 1);
  assert.equal(r.builds, 2);
  assert.match(r.stderr, /still refuses 1 request\(s\) after the second round/);
  assert.deepEqual(r.inbox, ['y-needs-x.json']);
  assert.deepEqual(r.copies, []);
});

test('pass: build_db may need one re-run to reach its fixed point, then the pass is green', t => {
  const f = passFixture(t, { 'only-good': 'ok' }, { buildFailOnce: true });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2);
  assert.match(r.stdout, /build_db did not converge on the first run/);
});

test('pass: provisional META_PIPELINE approval keeps the request for student access verification', t => {
  const f = passFixture(t, { 'pending-meta': { behavior:'fail', approval:{type:'META_PIPELINE_AUDIT'},sourceArchiveFile:'original/a.js',expectedQuestionCount:1 } });
  fs.mkdirSync(path.join(f.dir,'archive/exams/original'),{recursive:true});
  fs.writeFileSync(path.join(f.dir,'archive/engine.html'),'<html>engine</html>');
  fs.writeFileSync(path.join(f.dir,'archive/exams/original/a.js'),'window.questionBank=[{id:1,content:"Question",solution:"Current solution"}];');
  const r=f.run();
  assert.equal(r.status,0,r.stdout+r.stderr);
  assert.deepEqual(r.copies,['pending-meta.json']);
  const receipt=f.readJson('.archive-meta-register/pending-supplement/pending-meta.receipt.json');
  assert.equal(receipt.releaseStatus,'APPROVED');
  assert.equal(receipt.metadataVerificationStatus,'NOT_VERIFIED');
  assert.equal(r.builds,0);
});

for (const behavior of ['fail', 'verify-fail']) test(`pass: refused source-only audit preservation is never provisional: ${behavior}`, t => {
  const request = { behavior, approval: { type: 'META_PIPELINE_AUDIT', metadataReviewed: true,
    approvedBy: 'existing FULL audit subset', sourceRebind: { schemaVersion: 'archive-native-audit-source-preservation-v1',
      requestPath: '.archive-meta-register/inbox/2-preserve.json', priorCommit: 'a'.repeat(40),
      priorReceiptRef: { path: 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/prior-full.json', sha256: 'b'.repeat(64) } } },
    sourceArchiveFile: 'original/a.js', expectedQuestionCount: 2, scope: 'PARTIAL_UIDS', registryChanges: [],
    items: [{ questionUid: 'kept', sourceOrdinal: 1, before: {}, after: {}, reason: 'unchanged source-only subset' }] };
  const f = passFixture(t, { '1-good': 'ok', '2-preserve': request });
  fs.mkdirSync(path.join(f.dir, 'archive/exams/original'), { recursive: true });
  fs.writeFileSync(path.join(f.dir, 'archive/engine.html'), '<html>engine</html>');
  fs.writeFileSync(path.join(f.dir, 'archive/exams/original/a.js'),
    'window.questionBank=[{id:1,content:"Question one",solution:"Existing solution one"},{id:2,content:"Question two",solution:"Existing solution two"}];');
  const r = f.run(); assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(r.copies, ['1-good.json']);
  assert.equal(f.exists('.archive-meta-register/pending-supplement'), false);
  assert.equal(f.exists('derived/2-preserve.out'), false);
  assert.equal(f.readJson('.archive-meta-register/rejected/2-preserve.rejection.json').stage,
    behavior === 'fail' ? 'registrar' : 'projection-verify');
});

test('pass: every request refused -> green, nothing built, rejections recorded', t => {
  const f = passFixture(t, { a: 'fail', b: 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 0);
  assert.deepEqual(fs.readdirSync(path.join(f.dir, '.archive-meta-register/rejected')).sort(), ['a.json', 'a.rejection.json', 'b.json', 'b.rejection.json']);
});

test('pass: a projection refusal that prints no recognisable Error line is still isolated per request (no abort under set -e)', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-silent': 'verify-fail-silent', '3-assert': 'verify-fail-assert', '4-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2, 'one rebuild after dropping both refused requests');
  assert.ok(f.exists('derived/1-good.out') && f.exists('derived/4-good.out'));
  assert.ok(!f.exists('derived/2-silent.out') && !f.exists('derived/3-assert.out'), 'refused requests were undone');
  const silent = f.readJson('.archive-meta-register/rejected/2-silent.rejection.json');
  assert.equal(silent.stage, 'projection-verify');
  assert.equal(silent.error, 'consumer projection verification failed (exit status 7)');
  const assertion = f.readJson('.archive-meta-register/rejected/3-assert.rejection.json');
  assert.equal(assertion.stage, 'projection-verify');
  assert.equal(assertion.error, 'consumer projection verification failed (exit status 1)', 'AssertionError [ERR_...] does not match the Error: pattern, so the generic message is used');
  assert.deepEqual(r.inbox, []);
  assert.deepEqual(r.copies, ['1-good.json', '4-good.json']);
});
