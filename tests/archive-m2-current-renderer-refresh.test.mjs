import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { m2RefreshFixture } from './helpers/m2-current-renderer-refresh-fixture.mjs';
import { sha, stable } from './helpers/m2-current-renderer-fixture.mjs';
import { validateM2CurrentRendererContinuity, hasImmutableM2CurrentRendererClaim } from '../archive/tools/meta-foundation/reviewed-m2-current-renderer-continuity.mjs';
import { validateReviewedSourceReassessment } from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import { registerReviewedExamV2 } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import { planQuestion } from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';

test('tall refresh binds raw direct observations and still replays the existing retained authority', t => {
  const f = m2RefreshFixture(t), before = stable(f.current), result = validateReviewedSourceReassessment(f.args);
  assert.equal(result.m2RendererContinuity.mode, 'DIRECT_NATIVE_TO_TALL');
  assert.equal(result.m2RendererContinuity.reviewer, f.raw.reviewer);
  assert.equal(result.m2RendererContinuity.observedAt, f.raw.observedAtUtc);
  assert.equal(result.m2RendererContinuity.answerAndSolutionFieldsByteComparedOnly, true);
  assert.equal(result.retainedNativeFields.inferredValues, false);
  assert.equal(stable(f.current), before);
  f.tables.tpl.get('TPL_EXISTING').parentProblemTypeKey = 'UNREVIEWED';
  assert.throws(() => validateReviewedSourceReassessment(f.args), /retained|ACTIVE/);
});

test('exact v1 reuse replays its single original leaf and retains its reviewer and observation time', t => {
  const f = m2RefreshFixture(t, { mode: 'reuse' }), result = validateReviewedSourceReassessment(f.args);
  assert.equal(result.m2RendererContinuity.mode, 'REUSE_EXACT_V1_OBSERVATION');
  assert.equal(result.m2RendererContinuity.newObservation, false);
  assert.equal(result.m2RendererContinuity.reviewer, f.witness.reviewer);
  assert.equal(result.m2RendererContinuity.observedAt, f.witness.observedAt);
  assert.equal(result.m2RendererContinuity.priorV1Proof.reviewRef.sha256, f.refreshRow.priorV1Proof.reviewRef.sha256);
  assert.equal(result.m2RendererContinuity.suppliesMetadataValues, false);
});

const directMutations = [
  ['no direct actual view', f => { f.rawRow.assets[1].actuallyViewed = false; }],
  ['changed direct current asset anchor', f => { f.rawRow.assets[1].ref.sha256 = 'a'.repeat(64); }],
  ['duplicated direct asset phase', f => { f.rawRow.assets[1] = structuredClone(f.rawRow.assets[0]); }],
  ['wrong native source anchor', f => { f.rawRow.nativeSourceRef.commit = f.witnessRow.currentSourceRef.commit; }],
  ['wrong observed current source anchor', f => { f.rawRow.observedCurrentSourceRef = structuredClone(f.rawRow.nativeSourceRef); }],
  ['changed whole source denominator', f => { f.refreshRow.expectedQuestionCount = 2; }],
  ['new unsupported given observed', f => { f.rawRow.observations.newUnsupportedConditionObserved = true; }],
  ['unread stem', f => { f.rawRow.stemAndChoicesRead = false; }],
  ['new math assertion', f => { f.refresh.newMathematicalQa = true; }],
  ['raw metadata approval assertion', f => { f.raw.newMetadataApprovals = 1; }],
  ['full-exam observation assertion', f => { f.raw.fullExamIndependentReview = true; }],
  ['invented answer observation', f => { f.rawRow.answerAndSolutionFieldsByteComparedOnly = false; }],
  ['non-independent observer', f => { f.raw.reviewer = f.request.approval.approvedBy; }],
  ['unknown QA key', f => { f.refresh.qaPassed = true; }],
];
for (const [label, mutate] of directMutations) test('truthfully rebound direct refresh rejects ' + label, t => {
  const f = m2RefreshFixture(t); mutate(f); f.refreshReseal();
  assert.throws(() => validateReviewedSourceReassessment(f.args));
});

for (const extraDelta of [{ imageSize: 'full' }, { imageSize: {} }, { answer: 'changed' }, { content: 'changed' }, { problemTypeKey: 'OTHER' }])
  test('tall raw observation cannot enlarge the exact presentation transition ' + Object.keys(extraDelta)[0], t => {
    const f = m2RefreshFixture(t, { extraDelta });
    assert.throws(() => validateReviewedSourceReassessment(f.args));
  });

for (const currentSvg of [
  '<svg><animate attributeName="x"/></svg>', '<svg><s:set xmlns:s="http://www.w3.org/2000/svg"/></svg>',
  '<svg><한:script xmlns:한="http://www.w3.org/2000/svg">x</한:script></svg>',
  '<?xml-stylesheet href="https://example.invalid/x.css"?><svg/>', '<svg><style>@import "https://example.invalid/x.css";</style></svg>',
  '<svg><style>@keyframes m {to {opacity:0}}</style></svg>', '<svg><path style="animation:pulse 1s infinite"/></svg>',
  '<svg><path style="fill:u\\72l(https://example.invalid/x.svg)"/></svg>',
  '<svg><path style="fill:&#117;rl(https://example.invalid/x.svg)"/></svg>',
  '<svg xml:base="https://example.invalid/x.svg"><use href="#shape"/></svg>',
]) test('truthfully bound refresh SVG rejects dynamic or encoded dependencies ' + currentSvg.slice(0, 32), t => {
  const f = m2RefreshFixture(t, { currentSvg });
  assert.throws(() => validateReviewedSourceReassessment(f.args));
});

const reuseMutations = [
  ['new observation label', f => { f.refresh.newObservation = true; }],
  ['row new observation label', f => { f.refreshRow.newObservation = true; }],
  ['recursive refresh parent', f => { f.refreshRow.priorV1Proof = structuredClone(f.patch.sourceReview.m2RendererProof); }],
  ['changed original row SHA', f => { f.refreshRow.priorObservationRowSha256 = 'a'.repeat(64); }],
  ['changed approved after', f => { f.patch.after.problemTypeKey = 'UNAPPROVED'; f.args.final.problemTypeKey = 'UNAPPROVED'; }],
  ['missing original live witness', f => { fs.unlinkSync(path.join(f.root, f.oldV1Path)); }],
  ['current whole-object metadata change', f => {
    f.current.courseKey = 'M3-2'; f.put(f.sourcePath, f.source(f.current)); const commit = f.commit();
    f.refreshRow.currentSourceRef = f.sourceRef(commit, f.current); f.request.expectedSourceBlobSha1 = f.refreshRow.currentSourceRef.gitBlobSha1;
  }],
  ['current student-body change', f => {
    f.current.content += ' changed'; f.put(f.sourcePath, f.source(f.current)); const commit = f.commit();
    f.refreshRow.currentSourceRef = f.sourceRef(commit, f.current); f.request.expectedSourceBlobSha1 = f.refreshRow.currentSourceRef.gitBlobSha1;
  }],
  ['changed observed current SVG with truthful new hash', f => {
    fs.appendFileSync(path.join(f.root, f.newAsset), ' '); const commit = f.commit();
    f.refreshRow.currentSourceRef = f.sourceRef(commit, f.current);
    const row = f.refreshRow.currentAssets.find(row => row.path === f.newAsset);
    row.gitBlobSha1 = f.git('rev-parse', `${commit}:${row.path}`); row.sha256 = sha(fs.readFileSync(path.join(f.root, row.path)));
  }],
];
for (const [label, mutate] of reuseMutations) test('v1 observation reuse rejects ' + label, t => {
  const f = m2RefreshFixture(t, { mode: 'reuse' }); mutate(f); f.refreshReseal();
  assert.throws(() => validateReviewedSourceReassessment(f.args));
});

for (const mode of ['tall', 'reuse']) test('refresh evidence must be explicitly bound on approval and selected item: ' + mode, t => {
  const f = m2RefreshFixture(t, { mode });
  f.patch.evidenceRefs = f.patch.evidenceRefs.filter(ref => ref.path !== f.witnessPath);
  assert.throws(() => validateM2CurrentRendererContinuity(f.args), /bind approval and selected item/);
});

const productionUrl = name => new URL('../archive/tools/meta-foundation/' + name, import.meta.url).href;
function coldPlan(f, c) {
  const input = { root: f.root, question: c.question, previous: c.previous, current: c.current, identity: c.identity,
    runtimeRecord: c.nativeSource.runtimeRecord, runtimeStatus: c.nativeSource.runtimeStatus, source: c.source, ordinal: c.ordinal,
    runtimeOwner: c.runtimeOwner, blobSha1: c.nativeSource.blobSha1, sourcePath: f.sourcePath };
  const inputPath = path.join(f.root, 'cold-probe.json'); fs.writeFileSync(inputPath, JSON.stringify(input));
  const script = `import fs from 'node:fs'; import {planQuestion} from ${JSON.stringify(productionUrl('auto-register-merged-source.mjs'))};
    import {loadActiveMetaRegistry,validateActiveMetaFields} from ${JSON.stringify(productionUrl('active-registry.mjs'))};
    const x=JSON.parse(fs.readFileSync(process.argv[1])); const registry=loadActiveMetaRegistry(x.root);
    const nativeSource={root:x.root,bytes:fs.readFileSync(x.root+'/'+x.sourcePath),blobSha1:x.blobSha1,bank:[x.question],
      runtimeRecord:x.runtimeRecord,runtimeStatus:x.runtimeStatus,identityByJoin:new Map([[x.source+'#'+x.ordinal,x.identity]]),identityMap:{records:[x.identity]}};
    process.stdout.write(JSON.stringify([x.previous,x.question].map(previous=>{const r=planQuestion({...x,previous,registry,validate:validateActiveMetaFields,nativeSource});return{status:r.status,native:r.nativeReviewReceipt,final:r.final};})));`;
  return JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script, inputPath], { maxBuffer: 1024 * 1024 }).toString());
}

for (const mode of ['tall', 'reuse']) test('official writer seals refresh and refuses committed combined stripping in warm and cold cursors: ' + mode, t => {
  const f = m2RefreshFixture(t, { mode, writer: true }), sourceBefore = fs.readFileSync(path.join(f.root, f.sourcePath));
  const dry = registerReviewedExamV2({ root: f.root, request: f.request }); assert.equal(dry.status, 'PASS');
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, 'PASS');
  const replay = registerReviewedExamV2({ root: f.root, request: f.request }); assert.equal(replay.replay, true); assert.deepEqual(replay.plannedPaths, []);
  const c = f.runtimeContext(); assert.equal(planQuestion(c).status, 'ALREADY_REGISTERED');
  assert.ok(coldPlan(f, c).every(result => result.status === 'ALREADY_REGISTERED'));
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), sourceBefore);
  fs.appendFileSync(path.join(f.root, f.sourcePath), '// Unbound source-file change must use the ordinary preservation contract.\n');
  assert.equal(planQuestion(f.runtimeContext()).status, 'SUPPLEMENT_PENDING');
  fs.writeFileSync(path.join(f.root, f.sourcePath), sourceBefore);
  const bindingPath = c.receipt.outputDigests.find(row => row.path.endsWith('.source-review-binding.json')).path;
  delete c.receipt.fingerprintRepairs;
  c.receipt.outputDigests = c.receipt.outputDigests.filter(row => row.path !== bindingPath);
  for (const row of [c.current, c.nativeSource.runtimeRecord, ...c.receipt.appliedRecords, ...c.receipt.runtimeRecords]) {
    row.approvalEvidence = []; delete row.metadataRevision;
  }
  c.receipt.approval.evidenceRefs = [];
  for (const relative of [bindingPath, f.witnessPath, ...(mode === 'reuse' ? [f.oldV1Path] : [f.rawPath])])
    fs.unlinkSync(path.join(f.root, relative));
  f.put(c.receiptPath, c.receipt); f.commit();
  assert.equal(hasImmutableM2CurrentRendererClaim({ root: f.root, current: c.current, runtimeRecord: c.nativeSource.runtimeRecord }), true);
  for (const previous of [c.previous, structuredClone(c.question)]) {
    const result = planQuestion({ ...c, previous }); assert.equal(result.status, 'SUPPLEMENT_PENDING');
    assert.equal(result.nativeReviewReceipt, undefined); assert.equal(result.final, undefined);
  }
  for (const result of coldPlan(f, c)) {
    assert.equal(result.status, 'SUPPLEMENT_PENDING'); assert.equal(result.native, undefined); assert.equal(result.final, undefined);
  }
});

for (const mode of ['tall', 'reuse']) test('an exact source-only descendant preserves the complete refresh proof obligation: ' + mode, t => {
  const f = m2RefreshFixture(t, { mode, writer: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const c = f.runtimeContext(), priorRef = { path: c.receiptPath, sha256: sha(fs.readFileSync(path.join(f.root, c.receiptPath))) },
    sidecar = c.receipt.outputDigests.find(row => row.path.endsWith('.source-review-binding.json'));
  fs.appendFileSync(path.join(f.root, f.sourcePath), '// Later source formatting only; selected whole object stays identical.\n');
  const request = { schemaVersion: f.request.schemaVersion, requestId: 'synthetic-refresh-source-only-child', examUid: f.request.examUid,
    sourceArchiveFile: f.request.sourceArchiveFile, scope: 'PARTIAL_UIDS', expectedQuestionCount: 1,
    expectedSourceBlobSha1: f.git('hash-object', '-w', f.sourcePath),
    approval: { type: 'FINAL_QA', metadataReviewed: true, approvedBy: 'synthetic-child-author', sourceRebind: { priorReceiptRef: priorRef },
      evidenceRefs: [priorRef, sidecar, ...f.request.approval.evidenceRefs] }, registryChanges: [],
    items: [{ questionUid: 'uid1', sourceOrdinal: 1, before: {}, after: {}, reason: 'Synthetic complete unchanged cohort only.',
      evidenceRefs: [priorRef, sidecar, ...f.patch.evidenceRefs] }] };
  assert.equal(registerReviewedExamV2({ root: f.root, request, write: true }).status, 'PASS');
  const receiptPath = c.receiptPath.replace(f.request.requestId, request.requestId), receipt = f.read(receiptPath),
    next = { ...c, current: receipt.appliedRecords[0], identity: receipt.appliedIdentityRecords[0], nativeSource: { ...c.nativeSource,
      bytes: fs.readFileSync(path.join(f.root, f.sourcePath)), blobSha1: request.expectedSourceBlobSha1, runtimeRecord: receipt.runtimeRecords[0] } };
  assert.equal(planQuestion(next).nativeReviewReceipt, receiptPath);
  fs.unlinkSync(path.join(f.root, mode === 'reuse' ? f.oldV1Path : f.rawPath));
  assert.equal(planQuestion(next).status, 'SUPPLEMENT_PENDING');
});
