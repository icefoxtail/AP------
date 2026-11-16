import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { preparePrRegistration, registrationInputsChanged } from '../tools/ci/archive-pr-registration-prepare.mjs';
import { applyNativeRequests } from '../tools/ci/archive-pr-native-preview.mjs';

function fixture(t, changedFile = 'archive/exams/original/new.js') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-registration-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  write('tools/ci/archive-pages-registration.paths', 'archive/db.js\narchive/data/meta-foundation/runtime/*.json\n');
  write('archive/db.js', 'old projection\n');
  git('add', '--', 'tools/ci/archive-pages-registration.paths', 'archive/db.js'); git('commit', '-qm', 'baseline');
  const baseSha = git('rev-parse', 'HEAD');
  git('switch', '-qc', 'source-pr');
  write(changedFile, 'new input\n'); git('add', '--', changedFile); git('commit', '-qm', 'change');
  const headSha = git('rev-parse', 'HEAD');
  const event = { pull_request: { base: { sha: baseSha }, head: { sha: headSha } } };
  const commands = [];
  const run = (command, args) => {
    if (command === 'git') {
      const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
      if (result.status !== 0) throw new Error(result.stderr || `git failed: ${args}`);
      return result.stdout;
    }
    commands.push([command, ...args]);
    if (command === 'python3') write('archive/db.js', 'fresh projection\n');
    return '';
  };
  const prepare = extra => preparePrRegistration({ root, eventName: 'pull_request', event, expectedSha: headSha, run, ...extra });
  return { root, write, git, baseSha, headSha, event, commands, run, prepare };
}

test('only registration inputs require a temporary projection; unknown scope is conservative', () => {
  for (const file of ['archive/exams/original/new.js', 'archive/assets/images/a.svg', 'archive/data/question_metadata.json',
    'archive/data/meta-foundation/canonical/pack.json', 'archive/tools/build-archive2-catalog.mjs',
    '.archive-meta-register/inbox/native-v2.json', '.archive-meta-register/auto/run-scopes/phase1.json', 'tools/ci/archive-pr-native-preview.mjs']) {
    assert.equal(registrationInputsChanged([file]), true, file);
  }
  for (const paths of [[], ['apmath/playground/labs/a.html'], ['.github/workflows/ci.yml'], ['docs/architecture/notes.md']]) {
    assert.equal(registrationInputsChanged(paths), false);
  }
  assert.equal(registrationInputsChanged(null), true);
});

test('source PR prepares the official materializer and builder without changing the head', t => {
  const f = fixture(t);
  const result = f.prepare();
  assert.equal(result.state, 'PREPARED');
  assert.deepEqual(f.commands.map(c => c.slice(1)), [
    ['archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs', '--write'], ['archive/build_db.py'],
  ]);
  assert.equal(result.baseSha, f.baseSha); assert.equal(result.headSha, f.headSha);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
  assert.equal(f.git('rev-list', '--count', `${f.baseSha}..HEAD`), '1');
  assert.deepEqual(result.generatedPaths, ['archive/db.js']);
});

test('workflow-only PR and non-source events do not run registration', t => {
  const f = fixture(t, '.github/workflows/ci.yml');
  assert.equal(f.prepare().state, 'NO_OP');
  assert.equal(f.prepare({ eventName: 'workflow_run' }).state, 'NO_OP');
  assert.equal(f.commands.length, 0);
});

test('source push uses its fixed before/after snapshot for temporary generation', t => {
  const f = fixture(t);
  const result = f.prepare({ eventName: 'push', event: { before: f.baseSha, after: f.headSha } });
  assert.equal(result.state, 'PREPARED');
  assert.equal(result.inputHeadSha, f.headSha);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
  assert.equal(f.commands.length, 2);
});

test('an unrelated main move does not change the PR event input', t => {
  const f = fixture(t);
  f.git('switch', '-q', 'main'); f.write('unrelated.txt', 'later merge\n');
  f.git('add', '--', 'unrelated.txt'); f.git('commit', '-qm', 'unrelated main move');
  f.git('update-ref', 'refs/remotes/origin/main', 'HEAD'); f.git('switch', '-q', 'source-pr');
  assert.equal(f.prepare().baseSha, f.baseSha);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
});

test('missing or mismatched event identities fail before generation', t => {
  const f = fixture(t);
  assert.throws(() => f.prepare({ event: {} }), /exact base and head/);
  assert.throws(() => f.prepare({ expectedSha: f.baseSha }), /does not match/);
  const unrelated = { pull_request: { base: { sha: 'a'.repeat(40) }, head: { sha: f.headSha } } };
  assert.throws(() => f.prepare({ event: unrelated }));
  assert.equal(f.commands.length, 0);
});

test('dirty work and generator failure are not hidden', t => {
  const f = fixture(t);
  f.write('uncommitted.txt', 'preserve me');
  assert.throws(() => f.prepare(), /clean CI checkout/);
  assert.equal(f.commands.length, 0);
  fs.unlinkSync(path.join(f.root, 'uncommitted.txt'));
  assert.throws(() => f.prepare({ run: (command, args) => {
    if (command === 'python3') throw new Error('builder failure');
    return f.run(command, args);
  } }), /builder failure/);
});

test('a first fixed-point failure reuses generated runtime bytes in the same checkout', t => {
  const f = fixture(t);
  const runtimePath = 'archive/data/meta-foundation/runtime/middle-geometry-v1.json';
  let builds = 0;
  const result = f.prepare({ run: (command, args) => {
    const output = f.run(command, args);
    if (command === 'python3') {
      builds += 1;
      if (builds === 1) {
        f.write(runtimePath, '{"catalogUidDirectJoin":24}\n');
        throw new Error('Archive2 canonical input digest mismatch: data/meta-foundation/runtime/middle-geometry-v1.json');
      }
      assert.equal(fs.readFileSync(path.join(f.root, runtimePath), 'utf8'), '{"catalogUidDirectJoin":24}\n');
    }
    return output;
  } });
  assert.equal(result.state, 'PREPARED');
  assert.equal(builds, 2);
  assert.equal(f.commands.filter(c => c[1] === 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs').length, 1);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
  assert.deepEqual(result.generatedPaths, [runtimePath, 'archive/db.js']);
});

test('a repeated builder failure is fatal after exactly one recovery attempt', t => {
  const f = fixture(t);
  let builds = 0;
  assert.throws(() => f.prepare({ run: (command, args) => {
    if (command === 'python3') {
      builds += 1;
      throw new Error(`persistent builder failure ${builds}`);
    }
    return f.run(command, args);
  } }), /persistent builder failure 2/);
  assert.equal(builds, 2);
  assert.equal(f.git('rev-parse', 'HEAD'), f.headSha);
});

test('fixed-point recovery still refuses a source mutation from the failed first build', t => {
  const f = fixture(t);
  let builds = 0;
  assert.throws(() => f.prepare({ run: (command, args) => {
    const output = f.run(command, args);
    if (command === 'python3' && ++builds === 1) {
      f.write('archive/exams/original/new.js', 'unexpected source mutation');
      throw new Error('first generation failed after a source write');
    }
    return output;
  } }), /changed non-derived files: archive\/exams\/original\/new.js/);
  assert.equal(builds, 2);
});

test('source mutation by a generator fails the derived scope guard', t => {
  const f = fixture(t);
  assert.throws(() => f.prepare({ run: (command, args) => {
    const result = f.run(command, args);
    if (command === 'python3') f.write('archive/exams/original/new.js', 'unexpected change');
    return result;
  } }), /changed non-derived files: archive\/exams\/original\/new.js/);
});


test('unknown Archive data/tool dependencies and preparation versions require a build', () => {
  for (const file of [
    'archive/data/master_tables/js_archive_tag_master.json',
    'archive/tools/mixed-verification-codec.mjs',
    'archive/tools/intelligence/build-question-identity-runtime.mjs',
    'archive/data/textbook-source-manifest-v1.json',
    'tools/ci/archive-pr-registration-prepare.mjs',
    'tools/ci/archive-pages-registration.paths',
    'tools/ci/push-touches-paths.mjs',
    'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
    'archive/archive2-source.js',
    'archive/unit-past-exams-core.js',
  ]) assert.equal(registrationInputsChanged([file]), true, file);
});


test('clean unrelated code-only push with no fixed pending inbox retains its no-op path', t => {
  const f = fixture(t, 'tests/unrelated.test.js');
  const result = f.prepare({ eventName: 'push', event: { before: f.baseSha, after: f.headSha } });
  assert.equal(result.state, 'NO_OP'); assert.deepEqual(result.pendingRequestPaths, []);
  assert.equal(f.commands.length, 0);
});

function scopedFixture(t){
  const f=fixture(t),source='original/middle/m3/1mid/excluded.js';
  const meta='archive/data/question_metadata.json',identity='archive/data/question_identity_map.json';
  const runtime='archive/data/meta-foundation/runtime/middle3-v1.json',four='archive/data/item-4slot-index.json';
  const put=(file,value)=>f.write(file,JSON.stringify(value)+'\n');
  const row={questionUid:'excluded_uid',sourceArchiveFile:source,sourceOrdinal:1,value:'preserve'};
  for(const file of [meta,identity,runtime])put(file,{records:[row]});
  put(four,{records:[row],pending:[],files:[{path:'archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json'),inputHash:'a'.repeat(64)}],builderSha256:'b'.repeat(64)});
  put('.archive-meta-register/auto/state.json',{pending:{[source+'#1']:{sourceArchiveFile:source,lastReasons:['keep']}}});
  const inbox='.archive-meta-register/inbox/other-schema.json';put(inbox,{schemaVersion:'fixture-other-owner'});
  put('.archive-meta-register/auto/run-scopes/fixture-phase1.json',{schemaVersion:'archive-semantic-run-scope-v1',scopeId:'fixture-pr-scope',phase:'phase1',
    excludedSourcePrefixes:['original/middle/m3/1final/','original/middle/m3/1mid/'],
    inboxBindings:[{path:inbox,sha256:createHash('sha256').update(fs.readFileSync(path.join(f.root,inbox))).digest('hex')}]});
  f.write('tools/ci/archive-pages-registration.paths',['archive/db.js',meta,identity,runtime,four,'.archive-meta-register/auto/state.json'].join('\n')+'\n');
  f.git('add','-A');f.git('commit','-qm','scoped fixture');const headSha=f.git('rev-parse','HEAD');f.event.pull_request.head.sha=headSha;
  return {...f,source,meta,identity,runtime,four,put,headSha,
    prepare:extra=>f.prepare({expectedSha:headSha,...extra})};
}

test('PR common native entry and final builder guard preserve the active excluded snapshot',t=>{
  const f=scopedFixture(t),result=f.prepare();
  assert.equal(result.semanticRunScope.binding.active,true);
  assert.equal(result.semanticRunScope.excludedRows.semanticUnchanged,true);
  assert.equal(result.semanticRunScope.excludedRows.exactRowsUnchanged,true);
  assert.equal(result.semanticRunScope.excludedRows.cacheRekey,null);
});
for(const fileKey of ['meta','identity','runtime','four'])test('PR preparation refuses excluded '+fileKey+' mutation after native application',t=>{
  const f=scopedFixture(t);
  assert.throws(()=>f.prepare({run:(program,args)=>{
    const value=f.run(program,args);
    if(program==='python3'){
      const d=JSON.parse(fs.readFileSync(path.join(f.root,f[fileKey]),'utf8'));
      if(fileKey==='four'){d.builderSha256='c'.repeat(64);d.files[0].inputHash='d'.repeat(64);}
      else d.records[0].value='changed';
      f.put(f[fileKey],d);
    }
    return value;
  }}),/EXCLUDED_ROW_MUTATION/);
});

for(const guard of [true,false])test('the shared native application entry enforces exclusions with path guard='+guard,t=>{
  const f=scopedFixture(t),receipt='archive/data/fixture-receipt.json';
  const request={path:'.archive-meta-register/inbox/fixture-native.json',requestId:'fixture-native',questionCount:1,receiptPath:receipt};
  let writes=0;
  const run=(_program,args)=>{
    if(args.includes('--write')){
      writes++;const d=JSON.parse(fs.readFileSync(path.join(f.root,f.meta),'utf8'));d.records[0].value='wrong native side effect';f.put(f.meta,d);f.put(receipt,{fixture:true});
    }
    return JSON.stringify({status:'PASS',requestId:request.requestId,totalQuestions:1,replay:false,plannedPaths:[f.meta,receipt].sort()});
  };
  assert.throws(()=>applyNativeRequests({root:f.root,requests:[request],run,guard}),/EXCLUDED_ROW_MUTATION/);
  assert.equal(writes,1,'native result is not certified after an excluded side effect');
});
