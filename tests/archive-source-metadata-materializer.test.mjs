import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { materializeReviewedSourceMetadata, SOURCE_METADATA_MANIFEST_SCHEMA, SOURCE_METADATA_FIELDS,
  M3_SOURCE_METADATA_PROFILE, M3_SOURCE_METADATA_FIELDS }
  from '../archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const hash = bytes => ({ blobSha1: blob(bytes), sha256: sha(bytes) });
const json = value => JSON.stringify(value, null, 2) + '\n';
const copy = value => structuredClone(value);
const SOURCE = 'archive/exams/original/middle/m2/2final/example.js';
const SOURCE_FILE = SOURCE.slice('archive/exams/'.length);
const IDENTITY = 'archive/data/question_identity_map.json';
const REQUEST = '.archive-meta-register/inbox/metadata-example.json';
const UID = 'qid_v1_' + '1'.repeat(64), OTHER_UID = 'qid_v1_' + '2'.repeat(64);
const CLI = fileURLToPath(new URL('../archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs', import.meta.url));
const defaultRender = bank => '// Immutable public source wrapper.\nwindow.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n';

function fixture(t, { transformBank, transformIdentity, render = defaultRender, sourceBytes, transformRequest, sourcePath = SOURCE } = {}) {
  const sourceFile = sourcePath.slice('archive/exams/'.length);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'metadata-materializer-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repoRoot = path.join(dir, 'repo'), outputRoot = path.join(dir, 'candidate-sources');
  fs.mkdirSync(repoRoot);
  const git = (...args) => execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'test'); git('config', 'user.email', 'test@example.invalid'); git('config', 'core.autocrlf', 'false');
  const put = (relative, bytes) => {
    const file = path.join(repoRoot, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
  };
  const bank = [
    { id: 1, questionUid: UID, content: 'Protected student question one.', choices: ['A', 'B'], answer: 1,
      solution: 'Protected original explanation.', image: 'original-question.svg', level: '중', difficultyBucket: 2,
      templateKey: 'TPL_OLD', renderHints: { caption: 'keep unchanged' } },
    { id: 2, questionUid: OTHER_UID, content: 'Protected unselected question.', choices: ['C', 'D'], answer: 2,
      solution: 'Unselected explanation.', level: '상', difficultyBucket: 4 },
  ];
  transformBank?.(bank);
  const identity = { schemaVersion: 'question-identity-map-v1', records: bank.map((q, i) => ({
    questionUid: i ? OTHER_UID : UID, sourceArchiveFile: sourceFile, sourceOrdinal: i + 1,
    sourceQuestionNo: String(i + 1), legacyQKey: sourceFile + '_' + (i + 1),
  })), lookup: { byQuestionUid: {}, bySourceFileAndOrdinal: { [sourceFile]: {} },
    bySourceFileAndQuestionNo: { [sourceFile]: {} }, byLegacyQKey: {} } };
  for (const row of identity.records) {
    identity.lookup.byQuestionUid[row.questionUid] = copy(row);
    identity.lookup.bySourceFileAndOrdinal[sourceFile][row.sourceOrdinal] = row.questionUid;
    identity.lookup.bySourceFileAndQuestionNo[sourceFile][row.sourceQuestionNo] = [row.questionUid];
    identity.lookup.byLegacyQKey[row.legacyQKey] = [row.questionUid];
  }
  transformIdentity?.(identity);
  const before = Buffer.from(sourceBytes ?? render(bank)), identityBytes = Buffer.from(json(identity));
  put(sourcePath, before); put(IDENTITY, identityBytes); git('add', '.'); git('commit', '-qm', 'immutable public source baseline');
  const baseCommit = git('rev-parse', 'HEAD');
  const after = { curriculum: '2015', courseKey: 'M2-2', templateKey: 'TPL_NEW', problemTypeKey: 'PT_RULE',
    crossConceptKeys: ['CC_RULE'], rpmL3: 'Rule', rpmL4: 'Apply', L1: 'Unit', L2: 'Subunit' };
  const operations = ['curriculum', 'courseKey', 'templateKey'].map(field => ({ field,
    beforePresent: Object.hasOwn(bank[0], field), afterPresent: true,
    before: Object.hasOwn(bank[0], field) ? bank[0][field] : null, after: after[field] }));
  const afterBank = copy(bank);
  for (const operation of operations) afterBank[0][operation.field] = operation.after;
  let afterBytes = Buffer.from(render(afterBank));
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'metadata-example',
    sourceArchiveFile: sourceFile, expectedSourceBlobSha1: blob(afterBytes), expectedQuestionCount: 2,
    scope: 'PARTIAL_UIDS', approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'test' },
    items: [{ questionUid: UID, sourceOrdinal: 1, before: {}, after }] };
  transformRequest?.(request);
  let requestBytes = Buffer.from(json(request));
  put(REQUEST, requestBytes); git('add', '.'); git('commit', '-qm', 'immutable metadata-only request');
  let inputCommit = git('rev-parse', 'HEAD');
  const manifest = { schemaVersion: SOURCE_METADATA_MANIFEST_SCHEMA, materializationId: 'test-metadata-materialization', baseCommit,
    identityRef: { path: IDENTITY, ...hash(identityBytes) }, requestRefs: [{ path: REQUEST, ...hash(requestBytes) }],
    outputScope: [sourcePath], files: [{ path: sourcePath, before: hash(before), after: hash(afterBytes), expectedQuestionCount: 2,
      changes: [{ questionUid: UID, sourceOrdinal: 1, requestIndex: 0, metadataFields: operations }] }] };
  const commitRequest = () => {
    requestBytes = Buffer.from(json(request)); put(REQUEST, requestBytes); git('add', REQUEST); git('commit', '-qm', 'exact request revision');
    inputCommit = git('rev-parse', 'HEAD'); manifest.requestRefs[0] = { path: REQUEST, ...hash(requestBytes) };
  };
  const setOperations = fields => {
    manifest.files[0].changes[0].metadataFields = fields;
    const changed = copy(bank);
    for (const op of fields) changed[0][op.field] = op.after;
    afterBytes = Buffer.from(render(changed)); manifest.files[0].after = hash(afterBytes);
    request.expectedSourceBlobSha1 = blob(afterBytes); commitRequest();
  };
  const setExpectedBytes = bytes => {
    afterBytes = Buffer.from(bytes); manifest.files[0].after = hash(afterBytes);
    request.expectedSourceBlobSha1 = blob(afterBytes); commitRequest();
  };
  const invoke = (extra = {}) => materializeReviewedSourceMetadata({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, ...extra });
  return { dir, repoRoot, outputRoot, git, put, bank, identity, before, request, manifest, invoke, commitRequest, sourcePath, sourceFile,
    setOperations, setExpectedBytes, get inputCommit() { return inputCommit; }, baseCommit, get afterBytes() { return afterBytes; } };
}

test('check reads immutable Git bytes and never emits source bodies or changes the working source', t => {
  const f = fixture(t); f.put(SOURCE, 'local unfinished source bytes\n');
  const before = f.git('status', '--porcelain'), report = f.invoke();
  assert.equal(report.status, 'CHECKED_CANDIDATE_REQUIRES_OFFICIAL_REGISTRATION');
  assert.equal(report.changedQuestionCount, 1); assert.equal(report.candidateSourceWrites, 0);
  assert.equal(report.repositorySourceWrites, 0); assert.equal(report.remoteWrites, 0);
  assert.equal(report.newApprovals, 0); assert.equal(report.registrationRequired, true);
  assert.equal(report.protectedStudentChanges, 0); assert.equal(report.legacyOrDifficultyChanges, 0);
  assert.doesNotMatch(JSON.stringify(report), /Protected|explanation/);
  assert.equal(fs.existsSync(f.outputRoot), false); assert.equal(f.git('status', '--porcelain'), before);
  assert.equal(fs.readFileSync(path.join(f.repoRoot, SOURCE), 'utf8'), 'local unfinished source bytes\n');
});

function m3Fixture(t, { mutateNative, rationaleInSource = false, render = defaultRender } = {}) {
  const f = fixture(t, { sourcePath: SOURCE.replace('/m2/', '/m3/'), render });
  f.manifest.transportProfile = M3_SOURCE_METADATA_PROFILE;
  const nativePath = 'docs/native-m3-review.json';
  const native = { schemaVersion: 'm3-s2-complete-semantic-review-v1', sourceArchiveFile: f.sourceFile, questionCount: 2,
    items: [{ questionUid: UID, ordinal: 1, after: rationaleInSource ? {} : {
      primaryMethod: 'Immutable native method', decisiveStep: 'Immutable native step' } }] };
  mutateNative?.(native);
  const nativeBytes = json(native); f.put(nativePath, nativeBytes); f.git('add', nativePath);
  if (rationaleInSource) {
    const nativeBank=copy(f.bank);Object.assign(nativeBank[0],{primaryMethod:'Immutable native method',decisiveStep:'Immutable native step'});
    f.put(f.sourcePath,defaultRender(nativeBank));f.git('add',f.sourcePath);
  }
  f.git('commit', '-qm', 'immutable M3 native metadata review');
  f.request.items[0].sourceReview = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: f.git('rev-parse', 'HEAD'),
    reviewPath: nativePath, reviewRef: { path: '.archive-meta-register/evidence/native-m3-review.json', sha256: sha(nativeBytes) } };
  Object.assign(f.request.items[0].after, { curriculumKey: '2015', courseKey: 'M3-2', conditionKeys: ['COND_POSITIVE'],
    primaryMethod: 'Immutable native method', decisiveStep: 'Immutable native step' });
  const values = { curriculum: '2015', curriculumKey: '2015', courseKey: 'M3-2', conditionKeys: ['COND_POSITIVE'],
    primaryMethod: 'Immutable native method', decisiveStep: 'Immutable native step', reviewStatus: 'reviewed_pass',
    tagStatus: 'reviewed_pass', tagConfidence: 'approved_final_qa', crossConceptKeys: ['CC_RULE'] };
  const operations = M3_SOURCE_METADATA_FIELDS.filter(field => !Object.hasOwn(f.bank[0], field)).map(field => ({ field,
    beforePresent: false, before: null, afterPresent: true, after: values[field] }));
  f.setOperations(operations);
  // Expected legacy output: append compact metadata members to the first
  // object, preserving every original student value and all other formatting.
  const additions = operations.map(op => '    ' + JSON.stringify(op.field) + ': ' + JSON.stringify(op.after)).join(',\n');
  f.setExpectedBytes(f.before.toString().replace('\n  },\n  {', ',\n' + additions + '\n  },\n  {'));
  return f;
}

test('explicit M3 profile transports only the ten source-bound metadata fields and retains student bytes', t => {
  const f = m3Fixture(t), report = f.invoke({ write: true });
  assert.equal(report.rows[0].selected[0].fields.length, 10);
  assert.equal(report.protectedStudentChanges, 0); assert.equal(report.legacyOrDifficultyChanges, 0);
  assert.equal(report.newApprovals, 0);
  assert.deepEqual(fs.readFileSync(path.join(f.outputRoot, f.sourcePath)), f.afterBytes);
  assert.deepEqual(fs.readFileSync(path.join(f.repoRoot, f.sourcePath)), f.before);
});

test('M3 rationale accepts an exact immutable review-commit source value when absent from the review row', t => {
  const f = m3Fixture(t, { rationaleInSource: true });
  const report=f.invoke({write:true});
  assert.equal(report.rows[0].selected[0].fields.length,10);
  assert.equal(report.newApprovals,0);assert.equal(report.protectedStudentChanges,0);
  assert.deepEqual(fs.readFileSync(path.join(f.outputRoot,f.sourcePath)),f.afterBytes);
});

test('M3 retains the legacy bare answer key and noncanonical student spacing without executing source', t => {
  const f=m3Fixture(t,{render:bank=>defaultRender(bank).replace('"answer": 1','answer: 1').replace('"choices": [\n      "A",\n      "B"\n    ]','"choices": ["A", "B"]')});
  const r=f.invoke({write:true});assert.equal(r.protectedStudentChanges,0);
  const output=fs.readFileSync(path.join(f.outputRoot,f.sourcePath));assert.deepEqual(output,f.afterBytes);
  assert.match(output.toString(),/answer: 1/);assert.match(output.toString(),/"choices": \["A", "B"\]/);
});

test('M3 handles a standalone examData wrapper and preserves its outer numeric spelling',t=>{
  const render=bank=>'window.examData = {\n  "totalScore": 100.0,\n  "totalQuestions": 2,\n  "questions": '+JSON.stringify(bank,null,2)+'\n};\n';
  const f=m3Fixture(t,{render});f.invoke({write:true});
  assert.deepEqual(fs.readFileSync(path.join(f.outputRoot,f.sourcePath)),f.afterBytes);
  assert.match(f.afterBytes.toString(),/100\.0/);
});

test('M3 source status remains bound to the explicit request with an existing TM template spelling',t=>{
  const f=m3Fixture(t);f.request.items[0].after.templateKey='TM_TANGENT_LENGTH';f.commitRequest();
  assert.equal(f.invoke().newApprovals,0);
  f.request.items[0].after.templateKey='UNREGISTERED_FREE_TEXT';f.commitRequest();
  assert.throws(()=>f.invoke(),/STATUS_REQUIRES_EXPLICIT_REQUEST_CLASSIFICATION/);
});

test('M3 retains both equal immutable legacy imageSize members byte for byte',t=>{
  const f=m3Fixture(t,{render:bank=>defaultRender(bank).replace('"image": "original-question.svg",','"image": "original-question.svg",\n    "imageSize": "full",\n    "imageSize": "full",')});
  f.invoke({write:true});assert.deepEqual(fs.readFileSync(path.join(f.outputRoot,f.sourcePath)),f.afterBytes);
  assert.equal((f.afterBytes.toString().match(/"imageSize": "full"/g)||[]).length,2);
});

for(const[name,transform,pattern]of[
  ['duplicate quoted and bare answer keys',s=>s.replace('"answer": 1','"answer": 1, answer: 2'),/SOURCE_DUPLICATE_PROPERTY/],
  ['an executable value',s=>s.replace('"answer": 1','"answer": (()=>1)()'),/SOURCE_LITERAL_JSON/],
  ['a different bare property name',s=>s.replace('"solution":','solution:'),/SOURCE_LITERAL_JSON/],
  ['a trailing object comma',s=>s.replace('\n  },\n  {',',\n  },\n  {'),/SOURCE_LITERAL_JSON/],
  ['a duplicate nested property',s=>s.replace('"caption": "keep unchanged"','"caption": "keep unchanged", "caption": "changed"'),/SOURCE_DUPLICATE_PROPERTY/],
  ['conflicting legacy imageSize members',s=>s.replace('"image": "original-question.svg",','"image": "original-question.svg", "imageSize": "full", "imageSize": "small",'),/SOURCE_DUPLICATE_PROPERTY/],
  ['duplicate writable metadata members',s=>s.replace('"templateKey": "TPL_OLD"','"templateKey": "TPL_OLD", "templateKey": "TPL_OLD"'),/SOURCE_DUPLICATE_PROPERTY/],
])test(`M3 static source parser refuses ${name}`,t=>{
  const f=m3Fixture(t,{render:bank=>transform(defaultRender(bank))});
  assert.throws(()=>f.invoke({write:true}),pattern);assert.equal(fs.existsSync(f.outputRoot),false);
});

test('the default M2 profile still refuses a bare answer key',t=>{
  const f=fixture(t,{render:bank=>defaultRender(bank).replace('"answer": 1','answer: 1')});
  assert.throws(()=>f.invoke(),/SOURCE_LITERAL_JSON/);assert.equal(fs.existsSync(f.outputRoot),false);
});

for (const [name, mutate, pattern] of [
  ['an unknown transport profile', f => { f.manifest.transportProfile = 'ANY_SOURCE'; }, /TRANSPORT_PROFILE/],
  ['a cross-grade course', f => { f.manifest.files[0].changes[0].metadataFields.find(x => x.field === 'courseKey').after = 'M2-2'; }, /FIELD_SCOPE/],
  ['an unregistered condition identifier', f => { f.manifest.files[0].changes[0].metadataFields.find(x => x.field === 'conditionKeys').after = ['FREE_TEXT']; }, /FIELD_SCOPE/],
  ['duplicate condition identifiers', f => { f.manifest.files[0].changes[0].metadataFields.find(x => x.field === 'conditionKeys').after = ['COND_POSITIVE', 'COND_POSITIVE']; }, /FIELD_SCOPE/],
  ['a missing native rationale claim', f => { delete f.request.items[0].sourceReview; f.commitRequest(); }, /M3_NATIVE_RATIONALE_REF/],
  ['a native review digest mismatch', f => { f.request.items[0].sourceReview.reviewRef.sha256 = 'f'.repeat(64); f.commitRequest(); }, /M3_NATIVE_RATIONALE_DOCUMENT/],
  ['a newly authored rationale', f => { const op=f.manifest.files[0].changes[0].metadataFields.find(x=>x.field==='primaryMethod'); op.after='New method'; f.request.items[0].after.primaryMethod=op.after; f.commitRequest(); }, /M3_NATIVE_RATIONALE_VALUE/],
  ['a solution renderer mutation', f => { f.manifest.files[0].changes[0].metadataFields.push({ field:'solutionImage',beforePresent:false,before:null,afterPresent:true,after:'new.svg' }); }, /FIELD_SCOPE/],
]) test(`M3 profile refuses ${name} before emitting a candidate`, t => {
  const f=m3Fixture(t);mutate(f);assert.throws(()=>f.invoke({write:true}),pattern);assert.equal(fs.existsSync(f.outputRoot),false);
});

for (const [name, mutateNative, pattern] of [
  ['another source', n=>{n.sourceArchiveFile='original/middle/m3/2mid/other.js';}, /M3_NATIVE_RATIONALE_DOCUMENT/],
  ['a wrong denominator', n=>{n.questionCount=3;}, /M3_NATIVE_RATIONALE_DOCUMENT/],
  ['a different UID', n=>{n.items[0].questionUid=OTHER_UID;}, /M3_NATIVE_RATIONALE_UID/],
  ['a different ordinal', n=>{n.items[0].ordinal=2;}, /M3_NATIVE_RATIONALE_UID/],
]) test(`M3 native rationale rejects ${name}`, t=>{
  const f=m3Fixture(t,{mutateNative});assert.throws(()=>f.invoke(),pattern);assert.equal(fs.existsSync(f.outputRoot),false);
});

test('write creates only the exact candidate source, and identical replay performs no writes', t => {
  const f = fixture(t), first = f.invoke({ write: true });
  const target = path.join(f.outputRoot, SOURCE), inode = fs.statSync(target).ino;
  assert.equal(first.candidateSourceWrites, 1); assert.deepEqual(fs.readFileSync(target), f.afterBytes);
  assert.equal(f.invoke({ write: true }).candidateSourceWrites, 0); assert.equal(fs.statSync(target).ino, inode);
  assert.deepEqual(fs.readFileSync(path.join(f.repoRoot, SOURCE)), f.before); assert.equal(f.git('status', '--porcelain'), '');
});

test('a materialization request cannot include an additional UID outside the exact source-change inventory',t=>{
  const f=fixture(t);
  f.request.items.push({...structuredClone(f.request.items[0]),questionUid:OTHER_UID,sourceOrdinal:2});f.commitRequest();
  assert.throws(()=>f.invoke({write:true}),/REQUEST_SELECTED_COVERAGE/);
  assert.equal(fs.existsSync(f.outputRoot),false);
});

test('only the existing unambiguous source-name legacy UID alias is accepted', t => {
  const f = fixture(t, { transformBank: bank => { bank[0].questionUid = 'example|1'; } });
  assert.equal(f.invoke().changedQuestionCount, 1);
});

test('static questionBank/questions alias chain is preserved exactly', t => {
  const f = fixture(t, { render: bank => 'window.questionBank = window.questions = ' + JSON.stringify(bank, null, 2) + ';\n' });
  f.invoke({ write: true }); assert.deepEqual(fs.readFileSync(path.join(f.outputRoot, SOURCE)), f.afterBytes);
});

test('examData JSON wrapper preserves its original numeric spelling and outer fields', t => {
  const f = fixture(t, { render: bank => 'window.examData = {\n  "totalQuestions": 2,\n  "score": 100.0,\n  "questions": '
    + JSON.stringify(bank, null, 2) + '\n};\n// immutable alias\nwindow.questionBank = window.examData.questions;\n' });
  f.invoke({ write: true }); const result = fs.readFileSync(path.join(f.outputRoot, SOURCE));
  assert.deepEqual(result, f.afterBytes); assert.match(result.toString(), /"score": 100\.0/);
});

test('all ten allowed values are carried by the exact FINAL_QA request without issuing approval', t => {
  const f = fixture(t), after = f.request.items[0].after;
  const values = { courseKey: after.courseKey, crossConceptKeys: after.crossConceptKeys, curriculum: after.curriculum,
    reviewStatus: 'reviewed_pass', rpmL3: after.rpmL3, rpmL4: after.rpmL4,
    rpmPath: { curriculum: after.curriculum, scope: after.courseKey, majorUnit: after.L1, midUnit: after.L2,
      l3: after.rpmL3, l4: after.rpmL4 }, tagConfidence: 'approved_final_qa', tagStatus: 'reviewed_pass', templateKey: after.templateKey };
  f.setOperations(SOURCE_METADATA_FIELDS.map(field => ({ field, beforePresent: Object.hasOwn(f.bank[0], field), afterPresent: true,
    before: Object.hasOwn(f.bank[0], field) ? f.bank[0][field] : null, after: values[field] })));
  const r = f.invoke({ write: true }); assert.equal(r.rows[0].selected[0].fields.length, 10); assert.equal(r.newApprovals, 0);
  assert.deepEqual(fs.readFileSync(path.join(f.outputRoot, SOURCE)), f.afterBytes);
});

const manifestNegatives = [
  ['student payload', f => { f.manifest.sourceBody = 'arbitrary source'; }, /MANIFEST_SHAPE/],
  ['generic patch', f => { f.manifest.patch = 'replace a string'; }, /MANIFEST_SHAPE/],
  ['unknown bypass flag', f => { f.manifest.allowUnsafe = true; }, /MANIFEST_SHAPE/],
  ['different trusted base', f => { f.manifest.baseCommit = 'f'.repeat(40); }, /MANIFEST_BINDING/],
  ['identity hash drift', f => { f.manifest.identityRef.sha256 = 'f'.repeat(64); }, /IDENTITY_HASH_DRIFT/],
  ['source before hash drift', f => { f.manifest.files[0].before.sha256 = 'f'.repeat(64); }, /SOURCE_BEFORE_HASH_DRIFT/],
  ['source after hash drift', f => { f.manifest.files[0].after.sha256 = 'f'.repeat(64); }, /SOURCE_AFTER_HASH_DRIFT/],
  ['request hash drift', f => { f.manifest.requestRefs[0].sha256 = 'f'.repeat(64); }, /REQUEST_HASH_DRIFT/],
  ['unsafe request path', f => { f.manifest.requestRefs[0].path = '../outside.json'; }, /REQUEST_PATH/],
  ['out of grade source', f => { f.manifest.files[0].path = SOURCE.replace('/m2/', '/m3/'); f.manifest.outputScope = [f.manifest.files[0].path]; }, /FILE_SCOPE/],
  ['different output scope', f => { f.manifest.outputScope = ['archive/exams/original/middle/m2/2final/other.js']; }, /OUTPUT_SCOPE/],
  ['duplicate source', f => { f.manifest.files.push(copy(f.manifest.files[0])); f.manifest.outputScope.push(SOURCE); }, /OUTPUT_SCOPE/],
  ['unknown UID', f => { f.manifest.files[0].changes[0].questionUid = 'qid_v1_' + '3'.repeat(64); }, /IDENTITY_UID_JOIN/],
  ['missing UID', f => { delete f.manifest.files[0].changes[0].questionUid; }, /CHANGE_SHAPE/],
  ['wrong ordinal', f => { f.manifest.files[0].changes[0].sourceOrdinal = 2; }, /IDENTITY_UID_JOIN/],
  ['wrong denominator', f => { f.manifest.files[0].expectedQuestionCount = 3; }, /SOURCE_DENOMINATOR/],
  ['duplicate selected UID', f => { f.manifest.files[0].changes.push(copy(f.manifest.files[0].changes[0])); }, /CHANGE_SCOPE/],
  ['duplicate metadata field', f => { const a = f.manifest.files[0].changes[0].metadataFields; a.push(copy(a[0])); }, /FIELD_SCOPE/],
  ['absent versus null', f => { f.manifest.files[0].changes[0].metadataFields[0].beforePresent = true; }, /FIELD_BEFORE/],
  ['wrong before value', f => { f.manifest.files[0].changes[0].metadataFields[2].before = 'TPL_OTHER'; }, /FIELD_BEFORE/],
  ['after differs from reviewed value', f => { f.manifest.files[0].changes[0].metadataFields[2].after = 'TPL_DIFFERENT'; }, /FIELD_REQUEST_BINDING/],
  ['field deletion', f => { f.manifest.files[0].changes[0].metadataFields[2].afterPresent = false; }, /FIELD_SCOPE/],
  ['wrong course type', f => { f.manifest.files[0].changes[0].metadataFields[1].after = ['M2-2']; }, /FIELD_SCOPE/],
  ['HTML in label', f => { f.manifest.files[0].changes[0].metadataFields.push({ field: 'rpmL3', beforePresent: false, before: null, afterPresent: true, after: '<script>bad</script>' }); }, /FIELD_SCOPE/],
];
for (const [name, mutate, pattern] of manifestNegatives) test(`manifest refuses ${name} before output`, t => {
  const f = fixture(t), before = f.git('status', '--porcelain'); mutate(f);
  assert.throws(() => f.invoke({ write: true }), pattern);
  assert.equal(fs.existsSync(f.outputRoot), false); assert.equal(f.git('status', '--porcelain'), before);
  assert.deepEqual(fs.readFileSync(path.join(f.repoRoot, SOURCE)), f.before);
});

for (const field of ['content', 'choices', 'answer', 'solution', 'image', 'questionUid', 'id', 'number', 'sourceOrdinal',
  'level', 'difficultyBucket', 'primaryMethod', 'decisiveStep']) test(`protected or unsupported field ${field} cannot be transported`, t => {
  const f = fixture(t);
  f.manifest.files[0].changes[0].metadataFields = [{ field, beforePresent: false, before: null, afterPresent: true, after: 'replacement' }];
  assert.throws(() => f.invoke({ write: true }), /FIELD_SCOPE/); assert.equal(fs.existsSync(f.outputRoot), false);
});

const requestNegatives = [
  ['audit approval', r => { r.approval.type = 'META_PIPELINE_AUDIT'; }, /REQUEST_SCOPE/],
  ['source preservation', r => { r.approval.sourceRebind = {}; }, /REQUEST_SCOPE/],
  ['identity repair mode', r => { r.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }, /REQUEST_SCOPE/],
  ['other source', r => { r.sourceArchiveFile = 'original/middle/m2/2final/other.js'; }, /REQUEST_SCOPE/],
  ['other candidate blob', r => { r.expectedSourceBlobSha1 = 'f'.repeat(40); }, /REQUEST_AFTER_SOURCE_BLOB/],
  ['other UID', r => { r.items[0].questionUid = OTHER_UID; }, /REQUEST_UID_BINDING/],
  ['duplicate UID', r => { r.items.push(copy(r.items[0])); }, /REQUEST_SELECTED_INVENTORY/],
  ['missing field carrier', r => { delete r.items[0].after.templateKey; }, /FIELD_NOT_EXPLICITLY_CARRIED_BY_REQUEST/],
];
for (const [name, mutate, pattern] of requestNegatives) test(`immutable request refuses ${name}`, t => {
  const f = fixture(t); mutate(f.request); f.commitRequest();
  assert.throws(() => f.invoke({ write: true }), pattern); assert.equal(fs.existsSync(f.outputRoot), false);
});

test('canonical UID lookup and source ordinal lookup must identify the same row', t => {
  const f = fixture(t, { transformIdentity: identity => { identity.lookup.bySourceFileAndOrdinal[SOURCE_FILE]['1'] = OTHER_UID; } });
  assert.throws(() => f.invoke(), /IDENTITY_LOOKUP_JOIN/);
});

test('unknown explicit source UID never falls through to an ordinal join', t => {
  const f = fixture(t, { transformBank: bank => { bank[0].questionUid = 'unverified-explicit-uid'; } });
  assert.throws(() => f.invoke(), /EXPLICIT_SOURCE_UID/);
});

test('dynamic JavaScript bank is rejected without executing it', t => {
  const f = fixture(t, { sourceBytes: 'window.questionBank = (() => { throw new Error("MUST_NOT_EXECUTE"); })();\n' });
  assert.throws(() => f.invoke(), /SOURCE_JSON_LITERAL_REQUIRED/); assert.equal(fs.existsSync(f.outputRoot), false);
});

test('dynamic examData values are rejected without evaluating the wrapper', t => {
  const f = fixture(t, { render: bank => 'window.examData = {"score": (() => 100)(), "questions": '
    + JSON.stringify(bank, null, 2) + '};\nwindow.questionBank = window.examData.questions;\n' });
  assert.throws(() => f.invoke(), /SOURCE_EXAM_DATA_JSON/);
});

test('noncanonical JSON with duplicate keys cannot be normalized silently', t => {
  const f = fixture(t, { sourceBytes: 'window.questionBank = [{"id":1,"id":2}];\n' });
  assert.throws(() => f.invoke(), /SOURCE_CANONICAL_JSON_LITERAL_REQUIRED/);
});

test('candidate output may not replace repository files or a repository ancestor', t => {
  const f = fixture(t);
  for (const outputRoot of [f.repoRoot, path.join(f.repoRoot, 'candidate'), f.dir, '/'])
    assert.throws(() => f.invoke({ outputRoot, write: true }), /OUTPUT_MUST_BE_ISOLATED/);
  assert.equal(f.git('status', '--porcelain'), '');
});

test('output symlink and symlinked parent directories are refused', t => {
  const f = fixture(t), destination = path.join(f.dir, 'destination'); fs.mkdirSync(destination);
  fs.symlinkSync(destination, f.outputRoot); assert.throws(() => f.invoke({ write: true }), /OUTPUT_SYMLINK/);
  assert.throws(() => f.invoke({ outputRoot: path.join(f.outputRoot, 'child'), write: true }), /OUTPUT_SYMLINK/);
  assert.deepEqual(fs.readdirSync(destination), []);
});

test('an existing different output is retained and cannot be overwritten', t => {
  const f = fixture(t); fs.mkdirSync(f.outputRoot); fs.writeFileSync(path.join(f.outputRoot, 'keep.txt'), 'owned by somebody else');
  assert.throws(() => f.invoke({ write: true }), /OUTPUT_ALREADY_DIFFERS/);
  assert.equal(fs.readFileSync(path.join(f.outputRoot, 'keep.txt'), 'utf8'), 'owned by somebody else');
});

test('CLI requires exact trusted commits and one explicit mode, and emits only the proof', t => {
  const f = fixture(t), manifestFile = path.join(f.dir, 'manifest.json'); fs.writeFileSync(manifestFile, json(f.manifest));
  const args = ['--repo-root', f.repoRoot, '--manifest', manifestFile, '--base-commit', f.baseCommit,
    '--input-commit', f.inputCommit, '--output-root', f.outputRoot];
  const missing = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
  assert.equal(missing.status, 1); assert.match(missing.stderr, /CLI_MODE/);
  const pass = spawnSync(process.execPath, [CLI, ...args, '--check'], { encoding: 'utf8' });
  assert.equal(pass.status, 0, pass.stderr); assert.equal(JSON.parse(pass.stdout).candidateSourceWrites, 0);
  assert.doesNotMatch(pass.stdout, /Protected|explanation/); assert.equal(fs.existsSync(f.outputRoot), false);
});

function m2PrimaryV3Fixture(t, { mutateNative, mutateWitness, mutateProof, mutateRequest, mutateOperations, profile = 'M2_NATIVE_PROPOSAL_V3' } = {}) {
  const f = fixture(t);
  f.manifest.transportProfile = profile;
  const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
  const nativePath = 'docs/native-m2-primary-review.json';
  const finalPath = '.archive-meta-register/evidence/m2-primary-finalization.json';
  const witnessPath = '.archive-meta-register/evidence/m2-primary-independent.json';
  const nativeCopy = '.archive-meta-register/evidence/m2-primary-native.json';
  const rpmPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const rpm = { id: 'RPM_PRIMARY_FIXTURE', curriculum: '2015', scope: 'M2-2', ownerPack: 'MIDDLE_GEOMETRY', rpmPath: { l3: 'Synthetic proof' } };
  const rpmBytes = json({ records: [rpm] });
  const primary = { standardCourse: '중2 수학', standardUnitKey: 'M2-05', subUnitKey: 'M2-05-QUADRILATERAL_PROPERTIES',
    problemTypeKey: 'PT_NEW_PROOF', templateKey: 'TPL_NEW_PROOF' };
  const proposal = { id: 'NEW-PRIMARY-1', type: 'NEW_PT', parent: `${rpm.id} / ${rpm.rpmPath.l3}`, supportingQuestionUids: [UID] };
  const native = { schemaVersion: 'm2-s2-meta-review-v1', examId: 'E054', sourceArchiveFile: f.sourceFile, reviewedQuestionCount: 2,
    proposals: [proposal], items: [{ questionUid: UID, sourceOrdinal: 1, rpmRecordId: rpm.id, proposalRefs: [proposal.id], after: {},
      activeDefinitionMatch: { problemTypeKey: null, templateKey: null, problemTypeStatus: null, templateStatus: null,
        templateParent: null, exactBindings: [] } }] };
  mutateNative?.(native);
  const nativeBytes = json(native);
  f.put(nativePath, nativeBytes); f.put(rpmPath, rpmBytes); f.git('add', nativePath, rpmPath);
  f.git('commit', '-qm', 'immutable synthetic native primary proposal');
  const nativeCommit = f.git('rev-parse', 'HEAD');
  const selection = { documentRef: { path: nativePath, sha256: sha(nativeBytes) }, index: 0,
    proposalSha256: sha(stable(native.proposals[0])), questionUid: UID, sourceOrdinal: 1, proposalId: proposal.id };
  const pt = { problemTypeKey: primary.problemTypeKey, status: 'ACTIVE', ownerPack: rpm.ownerPack, labelKo: 'Synthetic proof' };
  const tpl = { templateKey: primary.templateKey, parentProblemTypeKey: pt.problemTypeKey, status: 'ACTIVE', ownerPack: rpm.ownerPack };
  const match = { problemTypeKey: pt.problemTypeKey, curriculum: rpm.curriculum,
    standardCourse: primary.standardCourse, standardUnitKey: primary.standardUnitKey, subUnitKey: primary.subUnitKey };
  const binding = { ...match, status: 'ACTIVE', ownerPack: rpm.ownerPack, supportingQuestionUids: [UID], supportingItemCount: 1 };
  const taxonomy = 'archive/data/meta-foundation/canonical/packs/middle-geometry/taxonomy.json';
  const choice = { selection, disposition: 'ADD_ONLY', problemTypeDefinition: pt, definition: tpl, binding,
    problemTypeRegistryChange: { path: taxonomy, collection: 'problemTypes', match: { problemTypeKey: pt.problemTypeKey }, before: null, after: pt },
    registryChange: { path: taxonomy, collection: 'templates', match: { templateKey: tpl.templateKey }, before: null, after: tpl },
    bindingRegistryChange: { path: taxonomy.replace('taxonomy.json', 'bindings.json'), collection: 'bindings', match, before: null, after: binding } };
  const scope = { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newSourceContentEdits: 0 };
  const app = { examId: native.examId, questionUid: UID, sourceOrdinal: 1, sourcePath: f.sourcePath,
    nativeReviewRef: { commit: nativeCommit, path: nativePath, sha256: sha(nativeBytes) }, nativeItemStableSha256: sha(stable(native.items[0])),
    proposalSelections: [selection], sourceSnapshot: { commit: nativeCommit, path: f.sourcePath, sha256: sha(f.before) }, rendererAssets: [],
    reviewedPrimaryContext: primary, decisions: [choice], reviewer: 'Independent synthetic reviewer', reason: 'Exact unresolved primary proposal',
    newMathematicalQa: false, newMetadataApproval: false, difficultyChanged: false, nativeProtectedStudentFieldsChanges: [] };
  const witness = { schemaVersion: 'archive-independent-m2-native-definition-finalization-v1',
    decision: 'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS', reviewer: app.reviewer,
    ...scope, existingDefinitionsModified: 0, sourceWrites: 0, canonicalWrites: 0,
    officialCompilerResolverConsumerStillRequired: true, actualMainRegistrationClaimed: false, currentMainChecked: nativeCommit,
    approvedRegistryChanges: [choice.registryChange, choice.problemTypeRegistryChange, choice.bindingRegistryChange],
    rows: [{ ...app, nativeProposal: native.proposals[0], proposalSelection: selection, nativeAfter: native.items[0].after,
      nativeActiveDefinitionMatch: native.items[0].activeDefinitionMatch, decision: choice,
      nativeRpmContext: { path: rpmPath, sha256: sha(rpmBytes), record: rpm }, protectedPayloadFieldsUnchanged: true,
      newFullMathematicalQa: false, newReview2: false, newDifficultyJudgment: false, sourceWrites: 0 }] };
  mutateWitness?.(witness);
  const witnessBytes = json(witness), witnessRef = { path: witnessPath, sha256: sha(witnessBytes) };
  app.independentReviewRef = witnessRef;
  const proof = { schemaVersion: 'archive-independent-m2-native-proposal-disposition-v1',
    status: 'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING', scope, applications: [app] };
  mutateProof?.(proof);
  const proofBytes = json(proof), finalRef = { path: finalPath, sha256: sha(proofBytes) };
  f.put(finalPath, proofBytes); f.put(witnessPath, witnessBytes); f.git('add', finalPath, witnessPath);
  f.git('commit', '-qm', 'immutable synthetic independent primary finalization');
  const finalizationCommit = f.git('rev-parse', 'HEAD'), nativeRef = { path: nativeCopy, sha256: sha(nativeBytes) };
  const refs = [nativeRef, finalRef, witnessRef];
  f.request.approval.evidenceRefs = refs;
  const item = f.request.items[0]; Object.assign(item.after, primary); item.evidenceRefs = refs;
  item.sourceReview = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: nativeCommit,
    reviewPath: nativePath, reviewRef: nativeRef, proposalFinalization: { schemaVersion: 'archive-native-proposal-finalization-v3',
      finalizationCommit, finalizationRef: finalRef, proposalSelections: [selection] } };
  f.request.registryChanges = [choice.registryChange, choice.problemTypeRegistryChange, choice.bindingRegistryChange]
    .map(c => ({ ...structuredClone(c), evidenceRefs: [finalRef, witnessRef] }));
  mutateRequest?.(f.request);
  const operations = ['templateKey', 'problemTypeKey'].map(field => ({ field,
    beforePresent: Object.hasOwn(f.bank[0], field), before: f.bank[0][field] ?? null, afterPresent: true, after: primary[field] }));
  mutateOperations?.(operations);
  f.setOperations(operations);
  return f;
}

test('M2 named v3 profile transports an exact independently finalized unresolved PT and paired template only', t => {
  const f = m2PrimaryV3Fixture(t), result = f.invoke({ write: true });
  assert.equal(SOURCE_METADATA_FIELDS.includes('problemTypeKey'), false);
  assert.equal(SOURCE_METADATA_FIELDS.length, 10);
  assert.equal(result.newApprovals, 0); assert.equal(result.protectedStudentChanges, 0);
  assert.equal(result.legacyOrDifficultyChanges, 0); assert.equal(result.remoteWrites, 0);
  assert.deepEqual(fs.readFileSync(path.join(f.outputRoot, f.sourcePath)), f.afterBytes);
  assert.deepEqual(fs.readFileSync(path.join(f.repoRoot, f.sourcePath)), f.before);
});

for (const [label, options, error] of [
  ['default profile primary change', { profile: undefined }, /FIELD_SCOPE/],
  ['flag without original source review', { mutateRequest: r => { delete r.items[0].sourceReview; } }, /M2_V3_PRIMARY_REF/],
  ['wrong finalization version', { mutateRequest: r => { r.items[0].sourceReview.proposalFinalization.schemaVersion = 'archive-native-proposal-finalization-v2'; } }, /M2_V3_PRIMARY_REF/],
  ['unknown finalization field', { mutateRequest: r => { r.items[0].sourceReview.proposalFinalization.override = true; } }, /M2_V3_PRIMARY_SPEC_SHAPE/],
  ['wrong original proposal hash', { mutateRequest: r => { r.items[0].sourceReview.proposalFinalization.proposalSelections[0].proposalSha256 = 'e'.repeat(64); } }, /M2_V3_NATIVE_NEW_PT/],
  ['a previously decided native primary', { mutateNative: n => { n.items[0].after.problemTypeKey = 'PT_OLD'; } }, /M2_V3_NATIVE_PRIMARY_ALREADY_DECIDED/],
  ['nonempty original ACTIVE match', { mutateNative: n => { n.items[0].activeDefinitionMatch.problemTypeKey = 'PT_OLD'; } }, /M2_V3_NATIVE_PRIMARY_ALREADY_DECIDED/],
  ['different proposal type', { mutateNative: n => { n.proposals[0].type = 'CC'; } }, /M2_V3_NATIVE_NEW_PT/],
  ['new approval in the independent witness', { mutateWitness: w => { w.newMetadataApprovals = 1; } }, /M2_V3_INDEPENDENT_SCOPE/],
  ['changed original proposal in witness', { mutateWitness: w => { w.rows[0].nativeProposal = { ...w.rows[0].nativeProposal, parent: 'different' }; } }, /M2_V3_ORIGINAL_WITNESS/],
  ['wrong original native RPM scope', { mutateWitness: w => { w.rows[0].nativeRpmContext = { ...w.rows[0].nativeRpmContext,
    record: { ...w.rows[0].nativeRpmContext.record, scope: 'M3-2' } }; } }, /M2_V3_NATIVE_RPM_SCOPE/],
  ['different primary in final application', { mutateProof: p => { p.applications[0].reviewedPrimaryContext = { ...p.applications[0].reviewedPrimaryContext, problemTypeKey: 'PT_OTHER' }; } }, /M2_V3_PRIMARY_APPLICATION/],
  ['missing independent review reference', { mutateRequest: r => { r.items[0].evidenceRefs = r.items[0].evidenceRefs.slice(0, 2); } }, /M2_V3_EVIDENCE_UNBOUND/],
  ['missing paired template operation', { mutateOperations: ops => { ops.splice(0, 1); } }, /M2_V3_PRIMARY_OWNER_OR_BINDING/],
  ['missing primary registry definition', { mutateRequest: r => { r.registryChanges = r.registryChanges.filter(c => c.collection !== 'problemTypes'); } }, /M2_V3_EXACT_REGISTRY_CHANGE/],
  ['different definition owner', { mutateRequest: r => { r.registryChanges.find(c => c.collection === 'problemTypes').after.ownerPack = 'OTHER'; } }, /M2_V3_EXACT_REGISTRY_CHANGE/],
  ['different binding curriculum', { mutateRequest: r => { r.registryChanges.find(c => c.collection === 'bindings').after.curriculum = '2022'; } }, /M2_V3_EXACT_REGISTRY_CHANGE/],
  ['unbound registry evidence', { mutateRequest: r => { r.registryChanges[0].evidenceRefs = []; } }, /M2_V3_EXACT_REGISTRY_CHANGE/],
  ['duplicate requested primary definition', { mutateRequest: r => { r.registryChanges.push(structuredClone(r.registryChanges.find(c => c.collection === 'problemTypes'))); } }, /M2_V3_EXACT_REGISTRY_CHANGE/],
  ['unrelated source field under the profile', { mutateOperations: ops => { ops.push({ field: 'difficultyBucket', beforePresent: true, before: 2, afterPresent: true, after: 3 }); } }, /FIELD_SCOPE/],
]) test(`M2 named v3 primary transport rejects ${label}`, t => {
  const f = m2PrimaryV3Fixture(t, options);
  if (label === 'default profile primary change') delete f.manifest.transportProfile;
  assert.throws(() => f.invoke({ write: true }), error);
  assert.equal(fs.existsSync(f.outputRoot), false);
  assert.deepEqual(fs.readFileSync(path.join(f.repoRoot, f.sourcePath)), f.before);
});
