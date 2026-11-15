import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { NATIVE_REQUEST_SCHEMA, DIFFICULTY_REQUEST_SCHEMA, selectNativeRequests, orderNativeRequests, applyNativeRequests,
  validateNativePreview, verifyNativeRequests, selectPendingNativeRequests, pendingNativeRequestPaths } from '../tools/ci/archive-pr-native-preview.mjs';
import { CI_WORKFLOW_PATH, REGISTRATION_CHECKS, prRegistrationProofNeeded,
  producePrRegistrationProof, validateLocalRegistrationProof,
} from '../tools/ci/archive-pr-registration-proof.mjs';

import { preparePrRegistration } from '../tools/ci/archive-pr-registration-prepare.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const copy = value => structuredClone(value);
const REQUEST = '.archive-meta-register/inbox/own-reviewed-exam.json';
const OTHER = '.archive-meta-register/inbox/other-owner-course.json';
const SOURCE = 'archive/exams/original/native.js';
const EVIDENCE = 'docs/operations/own-native-proof.json';
const DIFFICULTY_REQUEST = '.archive-meta-register/inbox/zz-reviewed-difficulty.json';
const DIFFICULTY_EVIDENCE = '.archive-meta-register/evidence/own-difficulty.json';
const META = 'archive/data/question_metadata.json';
const IDENTITY = 'archive/data/question_identity_map.json';
const BASIC_LINKS = 'archive/data/basic-scope-source-links.json';
const AUTHORITY = 'archive/data/meta-foundation/canonical/fixture/pack.json';
const RECEIPT = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/own-reviewed-exam.json';
const PLANNED = [META, AUTHORITY, RECEIPT].sort();
const ALLOWED = [/^archive\/db\.js$/, /^archive\/data\/question_metadata\.json$/,
  /^archive\/data\/archive2-(?:catalog|canonical-input-manifest)\.json$/];

function fixture(t, { partial = false, identityOnly = false, difficultyOnly = false, pairedDifficulty = false, auditPreservation = false, finalQaPreservation = false, basicPreservation = false, otherOwner = true, mutateRequest } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-preview-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text, target = root) => {
    fs.mkdirSync(path.dirname(path.join(target, file)), { recursive: true });
    fs.writeFileSync(path.join(target, file), text);
  };
  const git = (...args) => {
    const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  for (const file of [...REGISTRATION_CHECKS.map(c => c.file), CI_WORKFLOW_PATH,
    'archive/build_db.py', 'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs',
    'archive/tools/meta-foundation/compile-meta-foundation.mjs',
    'archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs',
    'archive/tools/meta-foundation/register-difficulty5.mjs',
    'archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs',
    'archive/tools/build-archive2-catalog.mjs', 'tools/ci/archive-pr-registration-prepare.mjs',
    'tools/ci/archive-pr-registration-proof.mjs', 'tools/ci/archive-pr-native-preview.mjs',
    'tools/ci/push-touches-paths.mjs']) write(file, '// fixed checker\n');
  write('tools/ci/archive-pages-registration.paths', [
    'archive/db.js', META, 'archive/data/archive2-catalog.json',
    'archive/data/archive2-canonical-input-manifest.json',
  ].join('\n') + '\n');
  write(SOURCE, 'window.questions = '+JSON.stringify(Array.from({length:partial?24:1},(_,i)=>({id:i+1})))+';\n');
  write(EVIDENCE, json({ reviewed: 'fixture approval evidence, without student content' }));
  write(DIFFICULTY_EVIDENCE, json({ schemaVersion: 'archive-difficulty5-reviewed-correction-v1', rows: [] }));
  write(META, json({ records: [{ questionUid: 'fixture', before: true }] }));
  write(IDENTITY, json({ records: [{ questionUid: 'fixture', sourceFingerprint: 'old' }] }));
  write(BASIC_LINKS, json({ records: [] }));
  write(AUTHORITY, json({ version: 'before' }));
  if (otherOwner) write(OTHER, json({ schemaVersion: 'standalone-course-fixture', requestId: 'other-owner-course' }));
  write('archive/db.js', 'old projection\n');
  write('archive/data/archive2-catalog.json', json({ projection: 'old' }));
  const manifest = target => write('archive/data/archive2-canonical-input-manifest.json', json({
    schemaVersion: 'archive2-canonical-input-manifest-v1', files: [
      { path: 'data/archive2-catalog.json', sha256: sha(fs.readFileSync(path.join(target, 'archive/data/archive2-catalog.json'))) },
    ],
  }), target);
  manifest(root);
  git('add', '.'); git('commit', '-qm', 'fixed base including other owner inbox');
  const baseSha = git('rev-parse', 'HEAD');
  const evidenceRef = { path: EVIDENCE, sha256: sha(fs.readFileSync(path.join(root, EVIDENCE))) };
  const difficultyRequest = { schemaVersion: DIFFICULTY_REQUEST_SCHEMA,
    gemini: { schemaVersion: 'v1', requestId: 'own-reviewed-difficulty', sourceArchiveFile: 'original/native.js',
      latestBlobSha: git('rev-parse', `HEAD:${SOURCE}`), items: [{ questionUid: 'fixture', ordinal: partial ? 5 : 1,
        before: { level: '중' }, after: { difficultyBucket: 2, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' } }] },
    reviewedCorrection: { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', approvalRef: 'fixed reviewed fixture',
      evidencePath: DIFFICULTY_EVIDENCE, evidenceSha256: sha(fs.readFileSync(path.join(root, DIFFICULTY_EVIDENCE))), rows: [] } };
  if (auditPreservation && partial) {
    const first = difficultyRequest.gemini.items[0];
    difficultyRequest.gemini.items = Array.from({ length: 24 }, (_, i) => ({ ...copy(first), ordinal: i + 1,
      questionUid: i + 1 === first.ordinal ? first.questionUid : 'whole-source-' + (i + 1) }));
  }
  const request = difficultyOnly ? difficultyRequest : { schemaVersion: NATIVE_REQUEST_SCHEMA, requestId: 'own-reviewed-exam',
    sourceArchiveFile: 'original/native.js', expectedSourceBlobSha1: git('rev-parse', `HEAD:${SOURCE}`),
    expectedQuestionCount: partial ? 24 : 1, ...(partial ? {scope:'PARTIAL_UIDS'} : {}),
    ...(identityOnly ? {registrationMode:'IDENTITY_FINGERPRINT_ONLY'} : {}),
    approval: { type: 'FINAL_QA', evidenceRefs: [evidenceRef] },
    registryChanges: [], items: [{ questionUid: 'fixture', sourceOrdinal: partial ? 5 : 1, evidenceRefs: [evidenceRef] }],
  };
  if (auditPreservation) {
    request.approval.type = 'META_PIPELINE_AUDIT';
    request.approval.sourceRebind = { schemaVersion: 'archive-native-audit-preservation-v1', requestPath: REQUEST,
      difficultyRequestRef: { path: DIFFICULTY_REQUEST, sha256: sha(json(difficultyRequest)) } };
  }
  if (finalQaPreservation) {
    Object.assign(request.approval, { metadataReviewed: true, approvedBy: 'fixture existing approval preservation',
      sourceRebind: { priorReceiptRef: evidenceRef } });
    Object.assign(request.items[0], { before: {}, after: {} });
  }
  if (basicPreservation) {
    request.schemaVersion = 'archive-basic-scope-rebind-request-v1'; delete request.scope; delete request.registryChanges;
    request.approval.type = 'BASIC_SCOPE_REBIND'; request.approval.sourceReview = { schemaVersion: 'archive-basic-scope-current-source-preservation-v1' };
    request.items[0].after = { sourceFingerprint: 'a'.repeat(64), contentFingerprint: 'b'.repeat(64) };
    difficultyRequest.reviewedCorrection.rows = [{ questionUid: 'fixture', ordinal: partial ? 5 : 1, before: request.items[0].after }];
  }
  mutateRequest?.(request);
  write(REQUEST, json(request));
  if (pairedDifficulty) write(DIFFICULTY_REQUEST, json(difficultyRequest));
  git('add', '--', REQUEST, ...(pairedDifficulty ? [DIFFICULTY_REQUEST] : [])); git('commit', '-qm', 'own request only');
  const headSha = git('rev-parse', 'HEAD'), repo = 'owner/repository';
  const event = { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
    number: 17, base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
  } };
  const calls = [], hook = {};
  const run = (program, args, target = root) => {
    calls.push({ program, args, root: target });
    if (program === 'git') {
      const r = spawnSync(program, args, { cwd: target, encoding: 'utf8' });
      if (r.status !== 0) throw Error(`FIXTURE_GIT:${r.stderr}`); return r.stdout;
    }
    if (args[0].endsWith('/register-reviewed-exam-meta-source.mjs')) {
      const requestPath = args[args.indexOf('--request') + 1];
      assert.equal(requestPath, REQUEST, 'an unchanged other-owner inbox must not run');
      const req = JSON.parse(fs.readFileSync(path.join(target, requestPath), 'utf8'));
      const replay = fs.existsSync(path.join(target, RECEIPT));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry-run';
      hook[phase]?.(target);
      if (phase === 'projection' && !replay) throw Error('FIXTURE_RECEIPT_REQUIRED');
      const identityRepair=req.registrationMode==='IDENTITY_FINGERPRINT_ONLY';
      const basic=req.approval.sourceReview?.schemaVersion==='archive-basic-scope-current-source-preservation-v1';
      const result = { status: 'PASS', requestId: req.requestId, totalQuestions: req.items.length, replay,
        ...(req.scope==='PARTIAL_UIDS'?{scope:req.scope,partialUidCount:req.items.length,expectedQuestionCount:req.expectedQuestionCount}:{}),
        ...(identityRepair?{registrationMode:req.registrationMode,metadataChanged:false,newMetadataApprovals:0,
          ...(phase==='projection'?{consumerLanes:{identityBindings:req.items.length,newMetadataApprovals:0}}:{})}:{}),
        ...(req.approval.sourceRebind?{newMetadataApprovals:0,preservedMetadataApprovals:req.items.length}:{}),
        ...(basic?{newMetadataApprovals:0,preservedMetadataApprovals:req.items.length,advancedApprovals:0,metadataValuesChanged:false,expectedQuestionCount:req.expectedQuestionCount}:{}),
        plannedPaths: replay ? [] : identityRepair ? [IDENTITY, RECEIPT].sort() : basic ? [META,IDENTITY,BASIC_LINKS,RECEIPT].sort() : PLANNED,
        consumerSearchStatus: phase === 'projection' ? identityRepair ? 'IDENTITY_BINDINGS_VERIFIED' : 'STATIC_VALUES_VERIFIED' : 'NOT_RUN' };
      if (phase === 'write' && !replay) {
        if(identityRepair)write(IDENTITY,json({records:[{questionUid:'fixture',sourceFingerprint:'current'}]}),target);
        else {
          const metadata = auditPreservation || basic ? JSON.parse(fs.readFileSync(path.join(target, META), 'utf8'))
            : { records: [{ questionUid: 'fixture' }] };
          Object.assign(metadata.records[0], { after: true }); write(META, json(metadata), target);
          if (basic) { write(IDENTITY,json({records:[{questionUid:'fixture',sourceFingerprint:'current'}]}),target);write(BASIC_LINKS,json({records:[{questionUid:'fixture'}]}),target); }
          else write(AUTHORITY, json({ version: 'after' }), target);
        }
        write(RECEIPT, json({ requestSha256: sha(fs.readFileSync(path.join(target, REQUEST))), source: req.expectedSourceBlobSha1 }), target);
        hook.afterWrite?.(target);
      }
      return json(hook.result?.(phase, result, target) || result);
    }
    if (args[0].endsWith('/register-difficulty5.mjs')) {
      const requestPath = args[args.indexOf('--request') + 1];
      assert.equal(requestPath, difficultyOnly ? REQUEST : DIFFICULTY_REQUEST);
      const req = JSON.parse(fs.readFileSync(path.join(target, requestPath), 'utf8'));
      const phase = args.includes('--verify-projection') ? 'projection' : args.includes('--write') ? 'write' : 'dry-run';
      hook.difficultyPhase?.(phase, target);
      const meta = JSON.parse(fs.readFileSync(path.join(target, META), 'utf8'));
      const replay = meta.records[0].difficultyBucket === 2, verify = phase === 'projection';
      if (verify && !replay) throw Error('FIXTURE_DIFFICULTY_NOT_APPLIED');
      const count = req.gemini.items.length, changedFields = !verify && !replay ? 4 * count : 0;
      const result = { status: 'PASS', mode: verify ? 'verify-reviewed-correction' : phase === 'write' ? 'write-reviewed-correction' : 'dry-run-reviewed-correction',
        requestId: req.gemini.requestId, sourceArchiveFile: req.gemini.sourceArchiveFile, sourceBlobSha: req.gemini.latestBlobSha,
        items: req.gemini.items.map(item => ({ questionUid: item.questionUid, ordinal: item.ordinal })),
        summary: { total: count, APPLY: !verify && !replay ? count : 0, ALREADY_REGISTERED: !verify && replay ? count : 0,
          SKIP_INVALID: 0, CONFLICT: 0, VERIFIED: verify ? count : 0, changedFields, written: phase === 'write' && changedFields > 0 },
        ptTpl: 'UNTOUCHED_NOT_IN_SCOPE' };
      if (phase === 'write' && !replay) {
        Object.assign(meta.records[0], req.gemini.items[0].after); write(META, json(meta), target);
        hook.afterDifficultyWrite?.(target);
      }
      return json(hook.difficultyResult?.(phase, result, target) || result);
    }
    if (args[0].endsWith('/verify-changed-uid-consumer-approval.mjs')) {
      hook.consumer?.(target);
      const files=[REQUEST,...(pairedDifficulty?[DIFFICULTY_REQUEST]:[])];
      const exams=files.map(file=>{const req=JSON.parse(fs.readFileSync(path.join(target,file),'utf8'));
        const identityRepair=req.registrationMode==='IDENTITY_FINGERPRINT_ONLY';
        const preservation=Boolean(req.approval?.sourceRebind);
        const count=(req.gemini?.items||req.items).length;
        const basic=Boolean(req.approval?.sourceReview);
        return { file, kind: req.schemaVersion===DIFFICULTY_REQUEST_SCHEMA?'difficulty5-ratings':identityRepair?'identity-fingerprint-repair':basic?'basic-approval-preservation':preservation?'native-approval-preservation':'reviewed-exam-v2',
          exam:req.gemini?.requestId||req.examUid||req.sourceArchiveFile,
          sourceFile:'original/native.js',changed:count,checked:count,passed:count,skippedUnchanged:0,
          ...(identityRepair?{approvalCreated:false,newMetadataApprovals:0,identityBindings:1}:{}),
          ...(preservation?{approvalCreated:false,newMetadataApprovals:0,preservedMetadataApprovals:1,
            approvalType:req.approval.type,expectedQuestionCount:req.expectedQuestionCount}:{}),
          ...(basic?{approvalCreated:false,newMetadataApprovals:0,advancedApprovals:0,preservedMetadataApprovals:1,expectedQuestionCount:req.expectedQuestionCount}:{}) };});
      const total=exams.reduce((n,e)=>n+e.changed,0);
      return json(hook.consumerResult || { status: 'PASS', counts: { changed: total, checked: total, passed: total, skippedUnchanged: 0 },
        exams,
        failures: [], unobservedFields: [], assignmentPending: hook.assignmentPending || [] });
    }
    if (program === 'python3') {
      write('archive/db.js', 'new projection\n', target);
      write('archive/data/archive2-catalog.json', json({ projection: 'new' }), target); manifest(target);
    }
    return '';
  };
  const options = { root, repo, event, expectedSha: headSha, runId: 41, runAttempt: 1, run };
  const selected = () => selectNativeRequests({ root, baseSha, headSha });
  const produce = () => producePrRegistrationProof(options);
  const validate = proof => validateLocalRegistrationProof({ ...options, proof });
  const native = preview => validateNativePreview({ root, baseSha, headSha, preview, run, allowedGenerated: ALLOWED });
  const snapshot = () => {
    const records = [];
    const walk = dir => { for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name === '.git') continue;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full); else records.push([path.relative(root, full), sha(fs.readFileSync(full))]);
    } };
    walk(root); return { status: git('status', '--porcelain', '--untracked-files=all'), files: records.sort() };
  };
  const assertShadowsRemoved = () => { for (const call of calls) if (call.root !== root) assert.equal(fs.existsSync(call.root), false, call.root); };
  return { root, write, git, baseSha, headSha, request, selected, produce, validate, native, snapshot,
    assertShadowsRemoved, calls, hook, run };
}

test('inbox-only PR selects its fixed v2 request and leaves unchanged course inbox untouched', t => {
  const f = fixture(t), beforeHead = f.git('rev-parse', 'HEAD');
  assert.equal(prRegistrationProofNeeded([REQUEST]), true);
  assert.deepEqual(f.selected().map(r => r.path), [REQUEST]);
  const other = fs.readFileSync(path.join(f.root, OTHER)), proof = f.produce();
  assert.equal(proof.status, 'PASS');
  assert.deepEqual(proof.nativePreview.plans[0].plannedPaths, PLANNED);
  assert.deepEqual(proof.nativePreview.checks.map(c => c.id), ['native-projection', 'native-consumer']);
  assert.deepEqual(fs.readFileSync(path.join(f.root, OTHER)), other);
  assert.equal(fs.existsSync(path.join(f.root, REQUEST)), true, 'preview never consumes its inbox');
  assert.equal(f.git('rev-parse', 'HEAD'), beforeHead);
  const before = f.snapshot();
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before, 'successful local reuse is read-only');
  f.assertShadowsRemoved();
  const actualWrites = f.calls.filter(c => c.root === f.root && c.args.includes('--write') && c.args[0].endsWith('/register-reviewed-exam-meta-source.mjs'));
  assert.equal(actualWrites.length, 1, 'verify-local writes only its isolated shadow');
});

test('basic preservation keeps its full source denominator and requires exact rebind before paired difficulty', t => {
  const f = fixture(t, { basicPreservation: true, partial: true, pairedDifficulty: true });
  const selected = f.selected(), basic = selected.find(r => r.kind === 'basic-approval-preservation'), difficulty = selected.find(r => r.kind === 'difficulty5-ratings');
  assert.equal(basic.questionCount, 1); assert.equal(basic.sourceQuestionCount, 24);
  assert.deepEqual(orderNativeRequests([difficulty,basic]).map(r => r.path),[REQUEST,DIFFICULTY_REQUEST]);
  const proof = f.produce();
  const consumer = proof.nativePreview.checks.find(c => c.id === 'native-consumer');
  assert.deepEqual(consumer.preservedBasicApprovals,{requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,advancedApprovals:0});
  assert.equal(f.validate(proof).reusable,true);
});

test('basic preservation dependency refuses stale before fingerprints, changed source and ambiguous ownership', t => {
  const f=fixture(t,{basicPreservation:true,pairedDifficulty:true}),selected=f.selected();
  const basic=selected.find(r=>r.kind==='basic-approval-preservation'),difficulty=selected.find(r=>r.kind==='difficulty5-ratings');
  const bad=copy(difficulty);bad.difficultyBeforeBindings[0].sourceFingerprint='0'.repeat(64);
  assert.throws(()=>orderNativeRequests([bad,basic]),/BASIC_DEPENDENCY_FINGERPRINT/);
  const missing=copy(difficulty);missing.difficultyBeforeBindings=[];
  assert.throws(()=>orderNativeRequests([missing,basic]),/BASIC_DEPENDENCY_FINGERPRINT/);
  const source=copy(difficulty);source.source.sha256='0'.repeat(64);
  assert.throws(()=>orderNativeRequests([source,basic]),/BASIC_DEPENDENCY_SOURCE/);
  const duplicate=copy(basic);duplicate.path=OTHER;
  assert.throws(()=>orderNativeRequests([basic,duplicate,difficulty]),/BASIC_DEPENDENCY_AMBIGUOUS/);
});

test('basic preservation proof rejects new approvals, missing preserved counts, foreign outputs and informational assignment debt', t => {
  for(const field of ['newMetadataApprovals','advancedApprovals','preservedMetadataApprovals','expectedQuestionCount']) {
    const f=fixture(t,{basicPreservation:true});
    f.hook.result=(phase,result)=>({...result,[field]:field==='preservedMetadataApprovals'?0:99});
    assert.throws(()=>f.produce(),/DRY_RUN_NOT_PASS/);
  }
  const bad=fixture(t,{basicPreservation:true});
  bad.hook.result=(phase,result)=>({...result,plannedPaths:phase==='dry-run'?[...result.plannedPaths,AUTHORITY]:result.plannedPaths});
  assert.throws(()=>bad.produce(),/BASIC_PRESERVATION_OUTPUT_SCOPE/);
  const pending=fixture(t,{basicPreservation:true,pairedDifficulty:true});
  pending.hook.assignmentPending=[{exam:'own-reviewed-difficulty',qid:1,uid:'fixture',reason:'assignment_missing'}];
  assert.throws(()=>pending.produce(),/CONSUMER_NOT_PASS/);
});

test('partial preview binds one selected UID separately from its 24-question fixed source',t=>{
  const f=fixture(t,{partial:true}),selected=f.selected();
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  assert.equal(selected[0].scope,'PARTIAL_UIDS');
  assert.deepEqual(selected[0].selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  const proof=f.produce(),before=f.snapshot();
  assert.equal(proof.status,'PASS');assert.equal(f.validate(proof).reusable,true);
  assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
  const forged=copy(proof.nativePreview);forged.requests[0].selectedItems[0].questionUid='foreign';
  assert.throws(()=>f.native(forged),/INPUT_MANIFEST_MISMATCH/);
});

test('partial selection rejects malformed scope, duplicate UIDs/ordinals and a false source denominator',t=>{
  const cases=[
    [r=>{delete r.scope;},/QUESTION_COUNT/],
    [r=>{r.scope='OTHER';},/REQUEST_SCOPE/],
    [r=>{r.expectedQuestionCount=23;},/SOURCE_DENOMINATOR/],
    [r=>{r.items=[];},/QUESTION_COUNT/],
    [r=>{r.items[0].sourceOrdinal=25;},/SELECTED_UID_SCOPE/],
    [r=>{r.items[0].sourceOrdinal=1.5;},/SELECTED_UID_SCOPE/],
    [r=>{r.items.push({...r.items[0],sourceOrdinal:6});},/SELECTED_UID_SCOPE/],
    [r=>{r.items.push({...r.items[0],questionUid:'other'});},/SELECTED_UID_SCOPE/],
    [r=>{r.registrationMode='UNKNOWN';},/REGISTRATION_MODE/],
  ];
  for(const [mutateRequest,error] of cases) {
    const f=fixture(t,{partial:true,mutateRequest});assert.throws(()=>f.selected(),error);
  }
});

test('partial dry-run, write and projection each bind both denominators and the explicit scope',t=>{
  for(const phase of ['dry-run','write','projection'])for(const mutation of [
    r=>({...r,totalQuestions:24}),r=>({...r,partialUidCount:2}),r=>({...r,expectedQuestionCount:1}),r=>({...r,scope:undefined}),
  ]) {
    const f=fixture(t,{partial:true});f.hook.result=(p,result)=>p===phase?mutation(result):result;
    assert.throws(()=>f.produce(),phase==='dry-run'?/DRY_RUN_NOT_PASS/:phase==='write'?/WRITE_PLAN_MISMATCH/:/PROJECTION_NOT_VERIFIED/);
  }
});

test('partial Consumer counts cannot substitute the whole exam or omit the selected UID',t=>{
  for(const count of [0,24]) {
    const f=fixture(t,{partial:true}),counts={changed:count,checked:count,passed:count,skippedUnchanged:0};
    f.hook.consumerResult={status:'PASS',counts,exams:[{file:REQUEST,kind:'reviewed-exam-v2',sourceFile:'original/native.js',...counts}],
      failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
});

test('identity-only preview verifies exact bindings while preserving metadata and creating no approval',t=>{
  const f=fixture(t,{partial:true,identityOnly:true}),beforeMeta=fs.readFileSync(path.join(f.root,META));
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.equal(proof.nativePreview.requests[0].kind,'identity-fingerprint-repair');
  assert.deepEqual(fs.readFileSync(path.join(f.root,META)),beforeMeta);
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('identity-only preview rejects a semantic approval result, missing bindings or a mislabeled Consumer result',t=>{
  for(const mutate of [
    r=>({...r,consumerSearchStatus:'STATIC_VALUES_VERIFIED'}),r=>({...r,newMetadataApprovals:1}),
    r=>({...r,metadataChanged:true}),r=>({...r,consumerLanes:{identityBindings:24,newMetadataApprovals:0}}),
  ]) {
    const f=fixture(t,{partial:true,identityOnly:true});f.hook.result=(p,r)=>p==='projection'?mutate(r):r;
    assert.throws(()=>f.produce(),/PROJECTION_NOT_VERIFIED/);
  }
  for(const change of [{kind:'reviewed-exam-v2'},{newMetadataApprovals:1},{approvalCreated:true},{identityBindings:24}]) {
    const f=fixture(t,{partial:true,identityOnly:true});
    f.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},exams:[{
      file:REQUEST,kind:'identity-fingerprint-repair',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
      newMetadataApprovals:0,approvalCreated:false,identityBindings:1,...change}],failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
});

test('reviewed difficulty preview binds selected UIDs and evidence without creating a semantic receipt', t => {
  const f=fixture(t,{partial:true,difficultyOnly:true}),selected=f.selected();
  assert.equal(selected[0].kind,'difficulty5-ratings');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  assert.deepEqual(selected[0].selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  assert.deepEqual(selected[0].evidence.map(r=>r.path),[DIFFICULTY_EVIDENCE]);
  assert.equal(selected[0].receiptPath,undefined);
  const identity=fs.readFileSync(path.join(f.root,IDENTITY)),authority=fs.readFileSync(path.join(f.root,AUTHORITY));
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans,[{requestPath:REQUEST,replay:false,plannedPaths:[META]}]);
  assert.equal(fs.existsSync(path.join(f.root,RECEIPT)),false);
  assert.deepEqual(fs.readFileSync(path.join(f.root,IDENTITY)),identity);
  assert.deepEqual(fs.readFileSync(path.join(f.root,AUTHORITY)),authority);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
  fs.appendFileSync(path.join(f.root,DIFFICULTY_EVIDENCE),'\n');
  assert.throws(()=>f.validate(proof),/EVIDENCE_DRIFT/);
});

test('identity repair and reviewed difficulty run in the same preview before strict projection', t => {
  const f=fixture(t,{partial:true,identityOnly:true,pairedDifficulty:true});
  f.hook.projection=target=>assert.equal(JSON.parse(fs.readFileSync(path.join(target,META),'utf8')).records[0].difficultyBucket,2);
  assert.deepEqual(f.selected().map(r=>r.kind),['identity-fingerprint-repair','difficulty5-ratings']);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.plannedPaths),[[IDENTITY,RECEIPT].sort(),[META]]);
  const writes=f.calls.filter(c=>c.root===f.root&&c.args.includes('--write')&&/register-(reviewed-exam-meta-source|difficulty5)\.mjs$/.test(c.args[0]));
  assert.equal(writes.length,2);assert.match(writes[0].args[0],/register-reviewed-exam-meta-source/);assert.match(writes[1].args[0],/register-difficulty5/);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);f.assertShadowsRemoved();
});

test('audit preservation follows its exact difficulty input in apply, projection and shadow replay', t => {
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true});
  const assertDifficultyApplied=target=>assert.equal(JSON.parse(fs.readFileSync(path.join(target,META),'utf8')).records[0].difficultyBucket,2);
  for(const phase of ['dry-run','write','projection'])f.hook[phase]=assertDifficultyApplied;
  assert.deepEqual(f.selected().map(r=>r.path),[DIFFICULTY_REQUEST,REQUEST]);
  const proof=f.produce();
  assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.requestPath),[DIFFICULTY_REQUEST,REQUEST]);
  assert.deepEqual(proof.nativePreview.requests[1].sourceRebind,
    {schemaVersion:'archive-native-audit-preservation-v1',difficultyRequestRef:f.request.approval.sourceRebind.difficultyRequestRef});
  assert.equal(proof.nativePreview.requests[1].kind,'native-approval-preservation');
  assert.equal(proof.nativePreview.requests[1].preservedApprovalType,'META_PIPELINE_AUDIT');
  f.validate(proof);
  assertDifficultyApplied(f.root);
  for(const target of new Set(f.calls.map(c=>c.root))) {
    const writes=f.calls.filter(c=>c.root===target&&c.args.includes('--write')&&c.args.includes('--request'));
    if(!writes.length)continue;
    assert.deepEqual(writes.map(c=>c.args[c.args.indexOf('--request')+1]),[DIFFICULTY_REQUEST,REQUEST]);
  }
  f.assertShadowsRemoved();
});

test('partial audit preview preserves its selected count and whole-source D5 dependency through shadow and Consumer proof', t => {
  const f=fixture(t,{partial:true,pairedDifficulty:true,auditPreservation:true}),[difficulty,audit]=f.selected();
  assert.equal(difficulty.questionCount,24);assert.equal(difficulty.sourceQuestionCount,24);
  assert.equal(audit.scope,'PARTIAL_UIDS');assert.equal(audit.questionCount,1);assert.equal(audit.sourceQuestionCount,24);
  assert.deepEqual(audit.selectedItems,[{questionUid:'fixture',sourceOrdinal:5}]);
  const proof=f.produce();assert.equal(proof.status,'PASS');
  assert.deepEqual(proof.nativePreview.plans.map(p=>p.requestPath),[DIFFICULTY_REQUEST,REQUEST]);
  assert.deepEqual(proof.nativePreview.checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['META_PIPELINE_AUDIT']});
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
});

test('partial audit preview refuses a narrowed whole-source D5 dependency or substituted selected UID',t=>{
  const f=fixture(t,{partial:true,pairedDifficulty:true,auditPreservation:true}),selected=f.selected();
  for(const mutate of [
    d=>{d.sourceQuestionCount=1;},d=>{d.questionCount=1;},d=>{d.selectedItems=d.selectedItems.slice(0,23);},
    d=>{d.selectedItems[23].sourceOrdinal=23;},d=>{d.selectedItems[23].sourceOrdinal=25;},
    d=>{d.selectedItems[23].questionUid=d.selectedItems[22].questionUid;},
  ]){const bad=copy(selected);mutate(bad[0]);assert.throws(()=>orderNativeRequests(bad),/AUDIT_DEPENDENCY_DENOMINATOR/);}
  const replaced=copy(selected);replaced[0].selectedItems.find(i=>i.sourceOrdinal===5).questionUid='another-UID';
  assert.throws(()=>orderNativeRequests(replaced),/AUDIT_DEPENDENCY_UID_SCOPE/);
  assert.equal(f.calls.length,0);
});

test('FINAL_QA partial source preservation verifies selected approval separately from the full source count', t => {
  const f=fixture(t,{partial:true,finalQaPreservation:true}),proof=f.produce();
  assert.equal(proof.status,'PASS');
  const [request]=proof.nativePreview.requests;
  assert.equal(request.kind,'native-approval-preservation');assert.equal(request.preservedApprovalType,'FINAL_QA');
  assert.equal(request.questionCount,1);assert.equal(request.sourceQuestionCount,24);
  assert.equal(f.validate(proof).reusable,true);f.assertShadowsRemoved();
  const checks=verifyNativeRequests({root:f.root,requests:f.selected(),run:f.run});
  assert.deepEqual(checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['FINAL_QA']});
});

test('preservation refuses claimed new approvals or missing preservation counts in every official phase', t => {
  for(const phase of ['dry-run','write','projection'])for(const change of [
    {newMetadataApprovals:1},{preservedMetadataApprovals:0},{preservedMetadataApprovals:24},
    {newMetadataApprovals:undefined},{preservedMetadataApprovals:undefined},
  ]) {
    const f=fixture(t,{partial:true,finalQaPreservation:true});
    f.hook.result=(p,r)=>p===phase?{...r,...change}:r;
    assert.throws(()=>f.produce(),/DRY_RUN_NOT_PASS|WRITE_PLAN_MISMATCH|PROJECTION_NOT_VERIFIED/);
  }
});

test('preservation Consumer cannot skip the selected UID, promote its type, or claim another scope', t => {
  for(const change of [
    {kind:'reviewed-exam-v2'},{newMetadataApprovals:1},{approvalCreated:true},{preservedMetadataApprovals:0},
    {preservedMetadataApprovals:24},{preservedMetadataApprovals:undefined},{approvalType:'REVIEW2'},
    {expectedQuestionCount:1},{expectedQuestionCount:undefined},{changed:0,checked:0,passed:0,skippedUnchanged:1},
  ]) {
    const f=fixture(t,{partial:true,finalQaPreservation:true});
    const exam={file:REQUEST,kind:'native-approval-preservation',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
      newMetadataApprovals:0,approvalCreated:false,preservedMetadataApprovals:1,approvalType:'FINAL_QA',expectedQuestionCount:24,...change};
    f.hook.consumerResult={status:'PASS',counts:Object.fromEntries(['changed','checked','passed','skippedUnchanged'].map(k=>[k,exam[k]])),
      exams:[exam],failures:[],unobservedFields:[],assignmentPending:[]};
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
  }
  const f=fixture(t,{partial:true,finalQaPreservation:true});
  f.hook.assignmentPending=[{exam:'original/native.js',qid:5,uid:'fixture',reason:'assignment_missing'}];
  assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
});

test('audit dependency ordering leaves unrelated requests in their original order', t => {
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true}),[difficulty,audit]=f.selected();
  const unrelated=copy(audit);delete unrelated.sourceRebind;unrelated.path='.archive-meta-register/inbox/unrelated.json';
  const identity=copy(unrelated);identity.path='.archive-meta-register/inbox/identity.json';identity.kind='identity-fingerprint-repair';
  identity.scope='PARTIAL_UIDS';identity.registrationMode='IDENTITY_FINGERPRINT_ONLY';
  assert.deepEqual(orderNativeRequests([identity,audit,unrelated,difficulty]).map(r=>r.path),
    [identity.path,unrelated.path,difficulty.path,audit.path]);
  assert.deepEqual(orderNativeRequests([unrelated,identity,difficulty]).map(r=>r.path),
    [unrelated.path,identity.path,difficulty.path]);
  const calls=[];
  applyNativeRequests({root:f.root,requests:[audit,difficulty],run:(...args)=>{calls.push(args);return f.run(...args);}});
  assert.equal(calls[0][1][calls[0][1].indexOf('--request')+1],DIFFICULTY_REQUEST);
});

for(const [name,mutation,error] of [
  ['missing selected request',r=>{r.approval.sourceRebind.difficultyRequestRef.path=OTHER;},/AUDIT_DEPENDENCY_NOT_SELECTED/],
  ['incorrect raw SHA',r=>{r.approval.sourceRebind.difficultyRequestRef.sha256='0'.repeat(64);},/AUDIT_DEPENDENCY_SHA/],
  ['self dependency',r=>{r.approval.sourceRebind.difficultyRequestRef.path=REQUEST;},/AUDIT_DEPENDENCY_KIND/],
  ['non-inbox reference',r=>{r.approval.sourceRebind.difficultyRequestRef.path=EVIDENCE;},/AUDIT_DEPENDENCY_REF/],
  ['unsafe reference',r=>{r.approval.sourceRebind.difficultyRequestRef.path='.archive-meta-register/inbox/../zz-reviewed-difficulty.json';},/AUDIT_DEPENDENCY_REF/],
  ['different approval kind',r=>{r.approval.type='FINAL_QA';},/AUDIT_DEPENDENCY_SCOPE/],
  ['different subtype',r=>{r.approval.sourceRebind.schemaVersion='other-preservation';},/AUDIT_DEPENDENCY_SCOPE/],
  ['different own request path',r=>{r.approval.sourceRebind.requestPath=DIFFICULTY_REQUEST;},/AUDIT_DEPENDENCY_SCOPE/],
  ['unsupported preservation scope',r=>{r.scope='PARTIAL_EXAM';},/AUDIT_DEPENDENCY_SCOPE/],
])test(`audit dependency rejects ${name}`,t=>{
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true,mutateRequest:mutation});
  assert.throws(()=>f.selected(),error);
  assert.equal(f.calls.length,0);
});

test('audit dependency never selects an unchanged request or accepts another source',t=>{
  const f=fixture(t,{pairedDifficulty:true,auditPreservation:true}),selected=f.selected();
  assert.throws(()=>orderNativeRequests(selected.filter(r=>r.path!==DIFFICULTY_REQUEST)),/AUDIT_DEPENDENCY_NOT_SELECTED/);
  for(const field of ['path','blobSha1','sha256']) {
    const changed=copy(selected);changed[0].source[field]+='different';
    assert.throws(()=>orderNativeRequests(changed),/AUDIT_DEPENDENCY_SOURCE/);
  }
  assert.throws(()=>orderNativeRequests([...selected,selected[0]]),/DUPLICATE_REQUEST_PATH/);
  const cyclic=copy(selected);cyclic[0].sourceRebind=copy(cyclic[1].sourceRebind);
  cyclic[0].sourceRebind.difficultyRequestRef.path=cyclic[1].path;
  assert.throws(()=>orderNativeRequests(cyclic),/AUDIT_DEPENDENCY_SCOPE/);
});

test('reviewed difficulty refuses malformed selected scope, unbound evidence and incomplete official results', t => {
  for(const [mutateRequest,error] of [
    [r=>{r.gemini.items.push({...r.gemini.items[0],ordinal:6});},/SELECTED_UID_SCOPE/],
    [r=>{r.gemini.items[0].ordinal=25;},/SOURCE_DENOMINATOR/],
    [r=>{r.reviewedCorrection.evidenceSha256='0'.repeat(64);},/EVIDENCE_DRIFT/],
    [r=>{r.gemini.latestBlobSha='0'.repeat(40);},/SOURCE_NOT_FIXED/],
    [r=>{r.reviewedCorrection.schemaVersion='unreviewed';},/DIFFICULTY_APPROVAL/],
  ]){const f=fixture(t,{partial:true,difficultyOnly:true,mutateRequest});assert.throws(()=>f.selected(),error);}
  for(const phase of ['dry-run','write','projection'])for(const mutation of [
    r=>({...r,summary:{...r.summary,total:24}}),
    r=>({...r,summary:{...r.summary,CONFLICT:1}}),
    r=>({...r,ptTpl:'APPROVED'}),
    r=>({...r,items:[{questionUid:'foreign',ordinal:5}]}),
  ]){
    const f=fixture(t,{partial:true,difficultyOnly:true});f.hook.difficultyResult=(p,r)=>p===phase?mutation(r):r;
    assert.throws(()=>f.produce(),/DIFFICULTY_RESULT_(NOT_PASS|UID_SCOPE)/);
  }
});

test('reviewed difficulty cannot write identity or canonical authority and consumer cannot omit the request', t => {
  for(const file of [SOURCE,IDENTITY,AUTHORITY]){
    const f=fixture(t,{difficultyOnly:true});f.hook.afterDifficultyWrite=target=>f.write(file,'undeclared write\n',target);
    assert.throws(()=>f.produce(),/UNDECLARED_NATIVE_OUTPUT/);
  }
  const f=fixture(t,{partial:true,identityOnly:true,pairedDifficulty:true});
  f.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},exams:[{
    file:REQUEST,kind:'identity-fingerprint-repair',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0,
    newMetadataApprovals:0,approvalCreated:false,identityBindings:1}],failures:[],unobservedFields:[],assignmentPending:[]};
  assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
});

test('difficulty-only proof preserves exactly attributed informational assignments and zero advanced approvals', t => {
  const f=fixture(t,{partial:true,difficultyOnly:true});
  f.hook.assignmentPending=[{exam:'own-reviewed-difficulty',qid:5,uid:'fixture',reason:'assignment_missing'}];
  const proof=f.produce(),info=proof.nativePreview.checks.find(c=>c.id==='native-consumer').difficultyOnly;
  assert.equal(info.newAdvancedMetadataApprovals,0);
  assert.equal(info.informationalAssignmentPendingCount,1);
  assert.deepEqual(info.informationalAssignmentPendingByRequest,[{requestPath:REQUEST,questionCount:1}]);
  assert.match(info.informationalAssignmentPendingSha256,/^[a-f0-9]{64}$/);
  const before=f.snapshot();assert.equal(f.validate(proof).reusable,true);assert.deepEqual(f.snapshot(),before);
  const forged=copy(proof.nativePreview);delete forged.checks[1].difficultyOnly;
  assert.throws(()=>f.native(forged),/CHECKS_INCOMPLETE/);
  f.assertShadowsRemoved();
});

test('informational assignment allowance refuses wrong/missing scope, other reasons, duplicates and native overlaps', t => {
  const pending={exam:'own-reviewed-difficulty',qid:5,uid:'fixture',reason:'assignment_missing'};
  for(const mutation of [
    r=>({...r,exam:'other-exam'}),r=>({...r,qid:6}),r=>({...r,uid:'other-uid'}),
    r=>({...r,reason:'approval_failed'}),r=>({...r,reason:undefined}),r=>({...r,qid:undefined}),r=>({...r,uid:undefined}),
  ]){const f=fixture(t,{partial:true,difficultyOnly:true});f.hook.assignmentPending=[mutation(pending)];assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);}
  const duplicate=fixture(t,{partial:true,difficultyOnly:true});duplicate.hook.assignmentPending=[pending,pending];
  assert.throws(()=>duplicate.produce(),/CONSUMER_NOT_PASS/);
  for(const identityOnly of [false,true]){
    const f=fixture(t,{partial:true,identityOnly});
    f.hook.assignmentPending=[{...pending,exam:'original/native.js'}];
    assert.throws(()=>f.produce(),/CONSUMER_NOT_PASS/);
    const overlap=fixture(t,{partial:true,identityOnly,pairedDifficulty:true});
    overlap.hook.assignmentPending=[pending];assert.throws(()=>overlap.produce(),/CONSUMER_NOT_PASS/);
  }
  const missing=fixture(t,{partial:true,difficultyOnly:true});
  missing.hook.consumerResult={status:'PASS',counts:{changed:1,checked:1,passed:1,skippedUnchanged:0},
    exams:[{file:REQUEST,kind:'difficulty5-ratings',exam:'own-reviewed-difficulty',sourceFile:'original/native.js',changed:1,checked:1,passed:1,skippedUnchanged:0}],failures:[],unobservedFields:[]};
  assert.throws(()=>missing.produce(),/CONSUMER_NOT_PASS/);
});

for (const [label, file, message] of [
  ['request', REQUEST, /REQUEST_NOT_FIXED/], ['approval evidence', EVIDENCE, /EVIDENCE_DRIFT/],
  ['source', SOURCE, /SOURCE_NOT_FIXED/],
]) test(`${label} raw SHA drift cannot reuse a proof`, t => {
  const f = fixture(t), proof = f.produce();
  fs.appendFileSync(path.join(f.root, file), '\n');
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), message);
  assert.deepEqual(f.snapshot(), before, 'a rejected reuse must not mutate current inputs or native output');
  f.assertShadowsRemoved();
});

test('official writer cannot change source or an undeclared canonical output', t => {
  for (const file of [SOURCE, 'archive/data/meta-foundation/canonical/unrelated.json']) {
    const f = fixture(t); f.hook.afterWrite = target => f.write(file, 'undeclared write\n', target);
    assert.throws(() => f.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  }
});

test('dry-run must be read-only and official stage failures never yield a proof', t => {
  const mutating = fixture(t);
  mutating.hook['dry-run'] = target => mutating.write(AUTHORITY, 'illegal dry-run mutation\n', target);
  assert.throws(() => mutating.produce(), /UNDECLARED_NATIVE_OUTPUT/);
  for (const phase of ['dry-run', 'write', 'projection', 'consumer']) {
    const f = fixture(t); f.hook[phase] = () => { throw Error(`OFFICIAL_${phase}_FAILED`); };
    assert.throws(() => f.produce(), new RegExp(`OFFICIAL_${phase}_FAILED`));
  }
});

test('denominator and projection outcome are required beyond a PASS label', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 1, checked: 0, passed: 0, skippedUnchanged: 0 },
    failures: [], unobservedFields: [], assignmentPending: [] };
  assert.throws(() => f.produce(), /CONSUMER_NOT_PASS/);
  const g = fixture(t); g.hook.result = (phase, result) => phase === 'projection' ? { ...result, consumerSearchStatus: 'NOT_RUN' } : result;
  assert.throws(() => g.produce(), /PROJECTION_NOT_VERIFIED/);
});

test('official KEEP counts are accepted only with complete per-request projection and Consumer denominators', t => {
  const f = fixture(t);
  f.hook.consumerResult = { status: 'PASS', counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 },
    exams: [{ file: REQUEST, kind: 'reviewed-exam-v2', sourceFile: 'original/native.js', changed: 0, checked: 0, passed: 0, skippedUnchanged: 1 }],
    failures: [], unobservedFields: [], assignmentPending: [] };
  const proof = f.produce();
  assert.equal(f.validate(proof).reusable, true);
  f.hook.consumerResult.exams[0].sourceFile = 'original/other.js';
  const before = f.snapshot();
  assert.throws(() => f.validate(proof), /CONSUMER_NOT_PASS/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('a forged allowlist and refreshed output hashes cannot authorize an unrelated canonical file', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const extra = 'archive/data/meta-foundation/canonical/unrelated.json'; f.write(extra, 'forged\n');
  forged.plans[0].plannedPaths.push(extra); forged.plans[0].plannedPaths.sort();
  forged.outputs.push({ path: extra, sha256: sha('forged\n'), sizeBytes: 7 }); forged.outputs.sort((a, b) => a.path.localeCompare(b.path));
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before, 'failed shadow re-plan cannot mutate actual checkout');
  f.assertShadowsRemoved();
});

test('new native authority bytes must match official HEAD re-plan despite a rewritten manifest', t => {
  const f = fixture(t), proof = f.produce(), forged = copy(proof.nativePreview);
  const bytes = 'forged authority\n'; f.write(AUTHORITY, bytes);
  Object.assign(forged.outputs.find(r => r.path === AUTHORITY), { sha256: sha(bytes), sizeBytes: Buffer.byteLength(bytes) });
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /NATIVE_AUTHORITY_OUTPUT_DRIFT/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('missing planned output and projection failure reject reuse without checkout mutation or leaked shadow', t => {
  const f = fixture(t), proof = f.produce(), missing = copy(proof.nativePreview);
  missing.outputs = missing.outputs.filter(r => r.path !== RECEIPT);
  let before = f.snapshot();
  assert.throws(() => f.native(missing), /OUTPUT_MANIFEST_MISMATCH/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
  f.hook.projection = () => { throw Error('PROJECTION_FAILED_DURING_REUSE'); };
  before = f.snapshot();
  assert.throws(() => f.validate(proof), /PROJECTION_FAILED_DURING_REUSE/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('shadow registration failure cleans independent files and never writes the real checkout', t => {
  const f = fixture(t), proof = f.produce(), before = f.snapshot();
  f.hook.afterWrite = target => { if (target !== f.root) throw Error('SHADOW_WRITE_FAILED'); };
  assert.throws(() => f.validate(proof), /SHADOW_WRITE_FAILED/);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});

test('post-state replay does not replace the initial official output plan with an empty list', t => {
  const f = fixture(t), proof = f.produce(), requests = f.selected();
  assert.deepEqual(applyNativeRequests({ root: f.root, requests, run: f.run }), [
    { requestPath: REQUEST, replay: true, plannedPaths: [] },
  ]);
  const forged = copy(proof.nativePreview); forged.plans[0] = { requestPath: REQUEST, replay: true, plannedPaths: [] };
  forged.outputs = [];
  const before = f.snapshot();
  assert.throws(() => f.native(forged), /PLAN_MANIFEST_MISMATCH/);
  assert.equal(f.validate(proof).reusable, true);
  assert.deepEqual(f.snapshot(), before); f.assertShadowsRemoved();
});


function laterCodePush(f) {
  const baseSha = f.git('rev-parse', 'HEAD');
  f.write('tests/unrelated-code.test.js', '// subsequent code push while the native writer is pending\n');
  f.git('add', '--', 'tests/unrelated-code.test.js'); f.git('commit', '-qm', 'later code-only push');
  const headSha = f.git('rev-parse', 'HEAD');
  return { root: f.root, eventName: 'push', event: { before: baseSha, after: headSha }, expectedSha: headSha, run: f.run };
}

function laterCodePr(f) {
  const baseSha=f.git('rev-parse','HEAD');
  // This checker change ordinarily needs no archive materialization. An exact
  // inherited preservation still has to supply a coherent temporary receipt.
  f.write(CI_WORKFLOW_PATH,'// subsequent code-only PR while registration is pending\n');
  f.git('add','--',CI_WORKFLOW_PATH);f.git('commit','-qm','later code-only PR');
  const headSha=f.git('rev-parse','HEAD'),repo='owner/repository';
  return {root:f.root,repo,event:{number:17,repository:{id:101,full_name:repo},pull_request:{
    number:17,base:{sha:baseSha,repo:{id:101}},head:{sha:headSha,repo:{id:101}}}},
    expectedSha:headSha,runId:41,runAttempt:1,run:f.run};
}

test('code-only PR preserves an exact inherited partial FINAL_QA approval through the official projection and Consumer',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  const baseSha=options.event.pull_request.base.sha,headSha=options.expectedSha;
  const beforeRequest=fs.readFileSync(path.join(f.root,REQUEST)),other=fs.readFileSync(path.join(f.root,OTHER));
  const selected=selectNativeRequests({root:f.root,baseSha,headSha});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST]);
  assert.deepEqual(selected[0].inheritedPreservation,{baseSha,requestSha256:sha(beforeRequest)});
  assert.equal(selected[0].kind,'native-approval-preservation');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  const proof=producePrRegistrationProof(options);
  assert.equal(proof.preparation.state,'PREPARED');assert.deepEqual(proof.nativePreview.requests,selected);
  assert.deepEqual(proof.nativePreview.checks.find(c=>c.id==='native-consumer').preservedNativeApprovals,
    {requests:1,preservedMetadataApprovals:1,newMetadataApprovals:0,approvalTypes:['FINAL_QA']});
  assert.equal(validateLocalRegistrationProof({...options,proof}).reusable,true);
  assert.deepEqual(fs.readFileSync(path.join(f.root,REQUEST)),beforeRequest,'preview never consumes the inherited request');
  assert.deepEqual(fs.readFileSync(path.join(f.root,OTHER)),other,'unrelated inherited requests stay untouched');
  assert.equal(f.git('rev-parse','HEAD'),headSha);f.assertShadowsRemoved();
});

for(const [name,mutate]of [
  ['a nonempty semantic before',r=>{r.items[0].before={templateKey:'OLD'};}],
  ['a nonempty semantic after',r=>{r.items[0].after={templateKey:'NEW'};}],
  ['registry additions',r=>{r.registryChanges=[{path:AUTHORITY,after:{status:'ACTIVE'}}];}],
  ['full-exam scope',r=>{delete r.scope;}],
  ['another approval type',r=>{r.approval.type='REVIEW2';}],
  ['an unreviewed approval',r=>{r.approval.metadataReviewed=false;}],
  ['an audit dependency',r=>{r.approval.sourceRebind.schemaVersion='archive-native-audit-preservation-v1';}],
  ['an item fingerprint repair',r=>{r.items[0].rebind={priorSourceBlobSha1:'a'.repeat(40)};}],
  ['an item source reassessment',r=>{r.items[0].sourceReview={reviewCommit:'a'.repeat(40)};}],
  ['identity-only mode',r=>{r.registrationMode='IDENTITY_FINGERPRINT_ONLY';}],
])test(`code-only PR does not adopt inherited preservation with ${name}`,t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true,mutateRequest:mutate}),options=laterCodePr(f);
  assert.deepEqual(selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:options.expectedSha}),[]);
  assert.equal(f.calls.filter(c=>c.program!=='git').length,0);
});

test('inherited preservation rejects working-copy request drift and a changed source snapshot',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  const select=()=>selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:options.expectedSha});
  const original=fs.readFileSync(path.join(f.root,REQUEST));
  f.write(REQUEST,original.toString()+'\n');assert.throws(select,/REQUEST_NOT_FIXED/);f.write(REQUEST,original);
  f.write(SOURCE,fs.readFileSync(path.join(f.root,SOURCE),'utf8')+'\n');
  f.git('add','--',SOURCE);f.git('commit','-qm','later source change without a reviewed rebind');
  options.expectedSha=f.git('rev-parse','HEAD');
  assert.throws(select,/SOURCE_NOT_FIXED/);assert.equal(f.calls.filter(c=>c.program!=='git').length,0);
});

test('changed preservation keeps ordinary changed-input ownership and cannot masquerade as inherited',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  f.write(REQUEST,json({...f.request,items:f.request.items.map(item=>({...item,reason:'changed request input'}))}));
  f.git('add','--',REQUEST);f.git('commit','-qm','changed preservation input');
  const selected=selectNativeRequests({root:f.root,baseSha:options.event.pull_request.base.sha,headSha:f.git('rev-parse','HEAD')});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST]);assert.equal(selected[0].inheritedPreservation,undefined);
});

test('working-copy forgery and deleted inherited requests cannot expand the fixed preservation selection',t=>{
  const ordinary=fixture(t,{partial:true}),ordinaryPr=laterCodePr(ordinary),forged=copy(ordinary.request);
  Object.assign(forged.approval,{type:'FINAL_QA',metadataReviewed:true,approvedBy:'forged local dispatcher',
    sourceRebind:{priorReceiptRef:forged.approval.evidenceRefs[0]}});
  Object.assign(forged.items[0],{before:{},after:{}});ordinary.write(REQUEST,json(forged));
  ordinary.write('.archive-meta-register/inbox/untracked-preservation.json',json({...forged,requestId:'untracked'}));
  assert.deepEqual(selectNativeRequests({root:ordinary.root,baseSha:ordinaryPr.event.pull_request.base.sha,headSha:ordinaryPr.expectedSha}),[]);
  const preserved=fixture(t,{partial:true,finalQaPreservation:true}),preservedPr=laterCodePr(preserved);
  fs.unlinkSync(path.join(preserved.root,REQUEST));
  assert.throws(()=>selectNativeRequests({root:preserved.root,baseSha:preservedPr.event.pull_request.base.sha,headSha:preservedPr.expectedSha}),/ENOENT/);
  preserved.git('add','--',REQUEST);preserved.git('commit','-qm','remove the inherited request');
  assert.deepEqual(selectNativeRequests({root:preserved.root,baseSha:preservedPr.event.pull_request.base.sha,headSha:preserved.git('rev-parse','HEAD')}),[]);
  assert.equal([...ordinary.calls,...preserved.calls].filter(c=>c.program!=='git').length,0);
});

test('inherited preservation cannot bypass an official registrar refusal or claim a new approval',t=>{
  const f=fixture(t,{partial:true,finalQaPreservation:true}),options=laterCodePr(f);
  f.hook['dry-run']=()=>{throw Error('FIXTURE_SELECTED_QUESTION_CHANGED');};
  assert.throws(()=>producePrRegistrationProof(options),/SELECTED_QUESTION_CHANGED/);
  assert.equal(f.calls.filter(c=>c.args.includes('--write')).length,0);
  delete f.hook['dry-run'];f.hook.result=(_phase,result)=>({...result,newMetadataApprovals:1});
  assert.throws(()=>producePrRegistrationProof(options),/DRY_RUN_NOT_PASS/);
  assert.equal(f.calls.filter(c=>c.args.includes('--write')).length,0);
});

test('main code-only push applies the fixed pending inbox then checks projection and typed Consumer without consuming it', t => {
  const f = fixture(t, { partial: true, otherOwner: false });
  const options = laterCodePush(f), headSha = options.expectedSha;
  assert.deepEqual(selectNativeRequests({ root: f.root, baseSha: options.event.before, headSha }), [],
    'the same code-only PR still owns no unchanged request');
  const requests = selectPendingNativeRequests({ root: f.root, headSha });
  assert.deepEqual(requests.map(r => r.path), [REQUEST]);
  assert.equal(requests[0].questionCount, 1); assert.equal(requests[0].sourceQuestionCount, 24);
  const input = fs.readFileSync(path.join(f.root, REQUEST)), phases = [];
  f.hook.result = (phase, result) => { phases.push(phase); return result; };
  f.hook.projection = target => assert.equal(JSON.parse(fs.readFileSync(path.join(target, 'archive/data/archive2-catalog.json'))).projection, 'new');
  const result = preparePrRegistration(options);
  assert.equal(result.state, 'PREPARED');
  assert.deepEqual(result.pendingRequestPaths, [REQUEST]);
  assert.deepEqual(result.nativePreview.requests, requests);
  assert.deepEqual(result.nativePreview.checks.map(c => c.id), ['native-projection', 'native-consumer']);
  assert.deepEqual(phases, ['dry-run', 'write', 'projection']);
  assert.ok(result.nativePreview.outputs.some(r => r.path === RECEIPT));
  assert.deepEqual(fs.readFileSync(path.join(f.root, REQUEST)), input, 'only the production writer consumes inbox files');
  assert.equal(f.git('rev-parse', 'HEAD'), headSha, 'temporary verification creates no commit');
});

test('main pending inventory is exact HEAD, excluding later untracked and nested inbox files', t => {
  const f = fixture(t, { otherOwner: false });
  f.write('.archive-meta-register/inbox/untracked.json', json({ schemaVersion: NATIVE_REQUEST_SCHEMA }));
  f.write('.archive-meta-register/inbox/nested/child.json', '{}');
  assert.deepEqual(pendingNativeRequestPaths({ root: f.root, headSha: f.headSha }), [REQUEST]);
  assert.deepEqual(selectPendingNativeRequests({ root: f.root, headSha: f.headSha }).map(r => r.path), [REQUEST]);
  assert.throws(() => pendingNativeRequestPaths({ root: f.root, headSha: 'main' }), /PENDING_SNAPSHOT_SHA/);
  f.write(REQUEST, json({ ...f.request, requestId: 'uncommitted-replacement' }));
  assert.throws(() => selectPendingNativeRequests({ root: f.root, headSha: f.headSha }), /REQUEST_NOT_FIXED/);
});

test('unknown pending main schemas fail before any write while unchanged other-owner PR isolation remains intact', t => {
  const f = fixture(t), options = laterCodePush(f);
  assert.deepEqual(selectNativeRequests({ root: f.root, baseSha: options.event.before, headSha: options.expectedSha }), []);
  assert.throws(() => preparePrRegistration(options), /PENDING_SCHEMA_UNSUPPORTED/);
  assert.equal(f.calls.filter(c => c.program !== 'git').length, 0);
  assert.equal(fs.existsSync(path.join(f.root, RECEIPT)), false);
});

test('pending main requests reject missing or stale committed source and immutable evidence', t => {
  for (const variant of ['missing-source', 'changed-source', 'changed-evidence']) {
    const f = fixture(t, { otherOwner: false });
    if (variant === 'missing-source') f.git('rm', '--', SOURCE);
    else f.write(variant === 'changed-source' ? SOURCE : EVIDENCE, variant === 'changed-source' ? 'window.questions=[{id:1,changed:true}];' : '{"changed":true}');
    f.git('add', '-u'); f.git('commit', '-qm', variant);
    const options = laterCodePush(f);
    assert.throws(() => preparePrRegistration(options), /MISSING_FILE|SOURCE_NOT_FIXED|EVIDENCE_DRIFT/, variant);
    assert.equal(f.calls.filter(c => c.program !== 'git').length, 0, variant);
  }
});

test('main temporary preview rejects actual projection and Consumer failures rather than continuing the suite', t => {
  for (const failure of ['projection', 'consumer']) {
    const f = fixture(t, { otherOwner: false }), options = laterCodePush(f);
    if (failure === 'projection') f.hook.result = (phase, result) => phase === 'projection' ? { ...result, consumerSearchStatus: 'NOT_RUN' } : result;
    else f.hook.consumerResult = { status: 'FAIL', counts: {}, failures: ['consumer defect'] };
    assert.throws(() => preparePrRegistration(options), failure === 'projection' ? /PROJECTION_NOT_VERIFIED/ : /CONSUMER_NOT_PASS/);
    assert.equal(f.git('rev-parse', 'HEAD'), options.expectedSha);
    assert.equal(fs.existsSync(path.join(f.root, REQUEST)), true);
  }
});

test('main pending audit subset keeps the full D5 dependency and its established order', t => {
  const f = fixture(t, { partial: true, auditPreservation: true, pairedDifficulty: true, otherOwner: false });
  const options = laterCodePush(f), selected = selectPendingNativeRequests({ root: f.root, headSha: options.expectedSha });
  assert.deepEqual(selected.map(r => r.path), [DIFFICULTY_REQUEST, REQUEST]);
  assert.equal(selected[0].questionCount, 24); assert.equal(selected[1].questionCount, 1);
  const result = preparePrRegistration(options);
  assert.equal(result.state, 'PREPARED');
  assert.equal(result.nativePreview.checks[1].preservedNativeApprovals.newMetadataApprovals, 0);
});

test('main fixed pending snapshot preserves exact basic-before-D5 order and zero new approvals',t=>{
  const f=fixture(t,{partial:true,basicPreservation:true,pairedDifficulty:true,otherOwner:false});
  const options=laterCodePush(f),selected=selectPendingNativeRequests({root:f.root,headSha:options.expectedSha});
  assert.deepEqual(selected.map(r=>r.path),[REQUEST,DIFFICULTY_REQUEST]);
  assert.equal(selected[0].kind,'basic-approval-preservation');
  assert.equal(selected[0].questionCount,1);assert.equal(selected[0].sourceQuestionCount,24);
  const result=preparePrRegistration(options);assert.equal(result.state,'PREPARED');
  assert.equal(result.nativePreview.checks[1].preservedBasicApprovals.newMetadataApprovals,0);
  assert.equal(result.nativePreview.checks[1].preservedBasicApprovals.advancedApprovals,0);
  assert.equal(f.git('rev-parse','HEAD'),options.expectedSha);
  assert.ok(fs.existsSync(path.join(f.root,REQUEST))&&fs.existsSync(path.join(f.root,DIFFICULTY_REQUEST)));
});
