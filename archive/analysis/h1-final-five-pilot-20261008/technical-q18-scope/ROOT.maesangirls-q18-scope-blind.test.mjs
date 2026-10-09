import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { physical, sha256 } from '../../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS } from '../../../tools/archive-student-bundle.mjs';
import { discloseQ18Scope, freezeQ18Scope, preflightQ18Scope } from '../ROOT.maesangirls-q18-scope-blind.mjs';

const FULL = Array.from({ length: 22 }, (_, index) => index + 1);
const RUN = 'h1-final-five-pilot-20261008';
const UID = '21_매산여고_1학기_기말_고1_기출';
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); return physical(file); };

function fixture(stage = 'R1') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-q18-scope-'));
  const ev = path.join(root, 'archive/analysis', UID, RUN);
  const sourcePath = path.join(root, '.tmp/archive', RUN, UID, `${UID}.js`);
  const assetRoot = path.join(path.dirname(sourcePath), 'assets');
  const oldBundlePath = path.join(path.dirname(sourcePath), `${stage}.student-bundle.old.json`);
  const currentBundlePath = path.join(path.dirname(sourcePath), 'ITEM_RECOVERY.q18.student-bundle.current.json');
  const originalFreezePath = path.join(ev, `${stage}.original-full-freeze.opaque.json`);
  const rootDecisionPath = path.join(ev, 'ROOT.item-recovery.decision.json');
  const recoveryPath = path.join(ev, 'ITEM_RECOVERY.q18.non-target-invariance.json');
  const sessionPath = path.join(ev, `${stage}.fresh-q18-session.json`);
  const assetReadsPath = path.join(ev, `${stage}.q18.asset-reads.json`);
  const assignmentPath = path.join(ev, `${stage}.q18-scope.assignment.json`);
  const rosterPath = path.join(root, 'archive/analysis', RUN, 'ROOT.roster.json');
  const freezePath = path.join(ev, `${stage}.q18.scope-freeze.json`);
  const disclosurePath = path.join(ev, `${stage}.q18.postfreeze-disclosure.json`);
  const authorityPath = path.join(ev, `${stage}.q18.scope-authority.json`);
  const reviewerIdentity = { role: `archive_${stage.toLowerCase()}`, reviewerId: `/root/${stage.toLowerCase()}_maesangirls_q18_clean` };
  const priorReviewerId = `/root/${stage.toLowerCase()}_maesangirls2021_five`;
  const oldSourceRawSha256 = stage === 'R1' ? '7'.repeat(64) : 'b'.repeat(64);
  const oldSourceRawBlobSha1 = stage === 'R1' ? '7'.repeat(40) : 'b'.repeat(40);
  const preRecoverySourceSha256 = 'b'.repeat(64);
  const assets = new Map();
  fs.mkdirSync(ev, { recursive: true });
  const assetRefs = ['assets/images/' + UID + '/q18.png', 'assets/images/' + UID + '/q18-solution.svg'];
  for (const ref of assetRefs) {
    const bytes = Buffer.from(`synthetic-q18-${path.basename(ref)}`), file = path.join(assetRoot, ...ref.split('/'));
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
    assets.set(ref, { ref, path: file, sha256: sha256(bytes) });
  }
  const oldRows = [], currentRows = [];
  for (const qid of FULL) {
    const base = { id: qid, content: qid === 18 ? 'old q18 source body' : `unchanged-student-${qid}`, choices: ['A', 'B', 'C', 'D', 'E'], layoutTag: '', wide: false };
    const current = qid === 18 ? { ...base, content: 'recovered q18 source body' } : structuredClone(base);
    const rowAssets = qid === 18 ? [...assets.values()] : [];
    if (qid === 18) { base.image = assets.get(assetRefs[0]).ref; current.image = assets.get(assetRefs[0]).ref; }
    oldRows.push({ qid, student: base, assets: rowAssets }); currentRows.push({ qid, student: current, assets: rowAssets });
  }
  const sourceBytes = Buffer.from(`window.examTitle=${JSON.stringify(UID)};\nwindow.questionBank=${JSON.stringify(currentRows.map(row => ({
    ...row.student, answer: `SYNTHETIC_STORED_${row.qid}`, solution: `SYNTHETIC_SOLUTION_${row.qid}`, explanation: `SYNTHETIC_EXPLANATION_${row.qid}`,
    decisiveStep: `SYNTHETIC_STEP_${row.qid}`, standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '평면좌표',
    subUnitKey: 'H15-SA-09-CIRCLE', subUnit: '원의 방정식', problemTypeKey: 'PT_CIRCLE', templateKey: 'TPL_CIRCLE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  })))};\n`);
  fs.writeFileSync(sourcePath, sourceBytes);
  const currentSourceRawSha256 = sha256(sourceBytes), currentSourceRawBlobSha1 = gitBlob(sourceBytes);
  const oldBundle = { schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256: oldSourceRawSha256, sourceRawBlobSha1: oldSourceRawBlobSha1, questionCount: 22, qids: FULL, whitelist: [...STUDENT_FIELDS], rows: oldRows, adapterProvenance: { answersRead: false, studentFieldsDropped: [] }, extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true } };
  const currentBundle = { schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256: currentSourceRawSha256, sourceRawBlobSha1: currentSourceRawBlobSha1, questionCount: 22, qids: FULL, whitelist: [...STUDENT_FIELDS], rows: currentRows, adapterProvenance: { answersRead: false, studentFieldsDropped: [] }, extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true } };
  const oldBundleRef = writeJson(oldBundlePath, oldBundle), currentBundleRef = writeJson(currentBundlePath, currentBundle);
  const originalFreezeBytes = Buffer.from(`OPAQUE_OLD_FREEZE_ANSWER_SENTINEL_${stage}`);
  fs.writeFileSync(originalFreezePath, originalFreezeBytes);
  const originalFreezeRef = physical(originalFreezePath);
  const rootDecision = { schemaVersion: 'ROOT_POST_R2_BOUNDED_ITEM_RECOVERY_DECISION_V1', runId: RUN, examUid: UID, decisionAuthority: 'ROOT_DELEGATED', scopeQids: [18], source: { sha256: preRecoverySourceSha256 }, r1Evidence: { status: 'HOLD' }, r2Evidence: { status: 'HOLD' }, remainingAfterR2: true, sourceHoldRecordedInEvidence: true, physicalItemStatusNotPresent: true, sourceJudgmentByRoot: true, decision: 'q18-only recovery authorized' };
  const decisionRef = writeJson(rootDecisionPath, rootDecision);
  const recovery = { schemaVersion: 'JS_ARCHIVE_ITEM_RECOVERY_NON_TARGET_INVARIANCE_V1', runId: RUN, examUid: UID, sourceBeforeRecoveryRawSha256: preRecoverySourceSha256, currentSourceRawSha256, allowedQids: [18], nonTargetQids: FULL.filter(qid => qid !== 18), nonTargetQidCount: 21, nonTargetMutationCount: 0, currentQuestionCount: 22, changedQids: [18] };
  const recoveryRef = writeJson(recoveryPath, recovery);
  const session = { schemaVersion: 'ROOT_FRESH_Q18_SCOPE_REVIEW_SESSION_V1', runId: RUN, examUid: UID, stage, reviewerIdentity, forkTurns: 'none', scopeQids: [18], sourceRawSha256: currentSourceRawSha256, studentBundleSha256: currentBundleRef.sha256 };
  const sessionRef = writeJson(sessionPath, session);
  const assetProof = { schemaVersion: 'ROOT_Q18_SCOPE_ASSET_READS_V1', runId: RUN, examUid: UID, stage, reviewerIdentity, rows: [...assets.values()].map(asset => ({ qid: 18, ref: asset.ref, sha256: asset.sha256, opened: true, openedAt: '2026-10-08T05:00:00.000Z' })) };
  const assetProofRef = writeJson(assetReadsPath, assetProof);
  const roster = { runId: RUN, locked: true, rows: [{ examUid: UID, productionPath: `archive/exams/original/high/h1/1final/${UID}.js` }] };
  const rosterRef = writeJson(rosterPath, roster);
  const assignment = { runId: RUN, examUid: UID, stage, executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', workingJsAbsolute: sourcePath, workingJsPrefreezePermission: 'HASH_ONLY_NO_TEXT_OR_PARSE', expectedSourceRawSha256: currentSourceRawSha256, expectedSourceRawBufferGitBlobSha1: currentSourceRawBlobSha1, studentBundleAbsolute: currentBundlePath, studentBundleSha256: currentBundleRef.sha256, questionCount: 22, fullQidOrder: FULL, scopeQids: [18], assetRootAbsolute: assetRoot };
  const assignmentRef = writeJson(assignmentPath, assignment);
  const authority = { schemaVersion: 'ROOT_MAESANGIRLS_Q18_SCOPE_BLIND_AUTHORITY_V1', decisionAuthority: 'ROOT_DIRECTED_ITEM_RECOVERY', runId: RUN, examUid: UID, stage,
    scopeQids: [18], fullQidOrder: FULL, invalidOriginalQids: [18], reusableCurrentBaselineQids: FULL.filter(qid => qid !== 18),
    rootDecision: { proof: { path: rootDecisionPath, sha256: decisionRef.sha256 }, decisionAuthority: 'ROOT_DELEGATED', scopeQids: [18], remainingAfterR2: true },
    lockedRoster: { path: rosterPath, sha256: rosterRef.sha256 }, assignment: { path: assignmentPath, sha256: assignmentRef.sha256 },
    freshReviewer: { reviewerIdentity, forkTurns: 'none', sessionProof: { path: sessionPath, sha256: sessionRef.sha256 } },
    source: { path: sourcePath, rawSha256: currentSourceRawSha256, rawBufferGitBlobSha1: currentSourceRawBlobSha1 },
    oldBundle: { path: oldBundlePath, sha256: oldBundleRef.sha256, sourceRawSha256: oldSourceRawSha256, sourceRawBlobSha1: oldSourceRawBlobSha1 },
    currentBundle: { path: currentBundlePath, sha256: currentBundleRef.sha256 },
    originalFreeze: { path: originalFreezePath, sha256: originalFreezeRef.sha256, stage, sourceRawSha256: oldSourceRawSha256, reviewerId: priorReviewerId, opaque: true },
    sourceRecoveryProvenance: { path: recoveryPath, sha256: recoveryRef.sha256 }, scopeDependenciesQids: [18], scopedAssetReadProof: { path: assetReadsPath, sha256: assetProofRef.sha256 },
    assetRootAbsolute: assetRoot, evidenceRootAbsolute: ev, scopeFreezeOutputAbsolute: freezePath, postfreezeDisclosureOutputAbsolute: disclosurePath };
  writeJson(authorityPath, authority);
  const answersPath = path.join(ev, `${stage}.q18.fresh-answers.json`);
  writeJson(answersPath, { schemaVersion: 'ROOT_FRESH_Q18_SCOPE_ANSWERS_V1', reviewerIdentity, answers: [{ qid: 18, independentAnswer: 'fresh-synthetic-q18', reasoning: 'fresh-synthetic-q18 reasoning' }] });
  return { root, ev, stage, sourcePath, currentBundlePath, originalFreezePath, authorityPath, answersPath, freezePath, disclosurePath, recoveryPath, assetReadsPath, reviewerIdentity };
}

test('preflights R1/R2 with full 22-qid bundles and q18-only current source change', t => {
  for (const stage of ['R1', 'R2']) {
    const f = fixture(stage); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
    const result = preflightQ18Scope({ root: f.root, authorityFile: f.authorityPath });
    assert.equal(result.stage, stage); assert.deepEqual(result.scopeQids, [18]); assert.equal(result.fullQidOrder.length, 22);
    assert.deepEqual(result.changedStudentQids, [18]); assert.equal(result.unchangedStudentQids.length, 21);
    assert.equal(result.rawSourceJsRead, false); assert.equal(result.oldFreezeParsed, false);
  }
});

test('freezes one q18 answer and discloses only q18 fields while leaving HOLD resolution to reviewers', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const oldFreezeSha = physical(f.originalFreezePath).sha256;
  const result = freezeQ18Scope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  const freeze = JSON.parse(fs.readFileSync(f.freezePath, 'utf8'));
  assert.equal(result.status, 'FRESH_Q18_SCOPE_FREEZE_ONLY'); assert.deepEqual(freeze.scopeQids, [18]);
  assert.equal(freeze.fullQuestionCount, 22); assert.deepEqual(freeze.answers.map(row => row.qid), [18]);
  assert.equal(freeze.stagePass, false); assert.equal(freeze.dispatcherSlotReleased, false); assert.equal(physical(f.originalFreezePath).sha256, oldFreezeSha);
  assert.equal(JSON.stringify(freeze).includes('OPAQUE_OLD_FREEZE_ANSWER_SENTINEL'), false);
  assert.throws(() => freezeQ18Scope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }));
  const disclosureResult = discloseQ18Scope({ root: f.root, authorityFile: f.authorityPath, freezeFile: f.freezePath, freezeSha256: result.freeze.sha256 });
  const disclosure = JSON.parse(fs.readFileSync(f.disclosurePath, 'utf8'));
  assert.deepEqual(disclosure.rows.map(row => row.qid), [18]);
  assert.equal(disclosure.rows[0].storedFields.answer, 'SYNTHETIC_STORED_18');
  assert.equal(JSON.stringify(disclosure).includes('SYNTHETIC_STORED_17'), false);
  assert.equal(JSON.stringify(disclosure).includes('SYNTHETIC_SOLUTION_19'), false);
  assert.equal(JSON.stringify(disclosure).includes('OPAQUE_OLD_FREEZE_ANSWER_SENTINEL'), false);
  assert.equal(disclosure.fullStudentParity, 'EXACT_22_QID_BANK'); assert.equal(disclosure.stagePassClaimed, false);
  assert.deepEqual(disclosureResult.disclosedQids, [18]);
});

test('rejects outside-qid mutation, missing scoped/SVG-dependent asset ack, and mismatched source SHA', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const current = JSON.parse(fs.readFileSync(f.currentBundlePath, 'utf8'));
  current.rows.find(row => row.qid === 17).student.content = 'outside q18 changed';
  const currentRef = writeJson(f.currentBundlePath, current);
  const assignmentPath = path.join(f.ev, `${f.stage}.q18-scope.assignment.json`);
  const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8')); assignment.studentBundleSha256 = currentRef.sha256;
  const assignmentRef = writeJson(assignmentPath, assignment);
  const auth = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8')); auth.currentBundle = { path: currentRef.path, sha256: currentRef.sha256 }; auth.assignment.sha256 = assignmentRef.sha256;
  writeJson(f.authorityPath, auth);
  assert.throws(() => preflightQ18Scope({ root: f.root, authorityFile: f.authorityPath }), /ONLY_Q18_STUDENT_OR_ASSET_PAYLOAD_MAY_CHANGE/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const proofPath = second.assetReadsPath, proof = JSON.parse(fs.readFileSync(proofPath, 'utf8')); proof.rows.pop();
  const proofRef = writeJson(proofPath, proof), auth2 = JSON.parse(fs.readFileSync(second.authorityPath, 'utf8')); auth2.scopedAssetReadProof.sha256 = proofRef.sha256;
  writeJson(second.authorityPath, auth2);
  assert.throws(() => preflightQ18Scope({ root: second.root, authorityFile: second.authorityPath }), /Q18_REQUIRED_ASSETS_ACTUALLY_OPENED/);

  const svgMissing = fixture(); t.after(() => fs.rmSync(svgMissing.root, { recursive: true, force: true }));
  const bundlePath = svgMissing.currentBundlePath, bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  const svgAsset = bundle.rows.find(row => row.qid === 18).assets.find(asset => asset.ref.endsWith('.svg'));
  const svgFile = path.join(svgMissing.root, '.tmp/archive', RUN, UID, 'assets', ...svgAsset.ref.split('/'));
  const svgBytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><image href="q18-child.png"/></svg>');
  fs.writeFileSync(svgFile, svgBytes); svgAsset.sha256 = sha256(svgBytes);
  const bundleRef = writeJson(bundlePath, bundle);
  const svgAssignmentPath = path.join(svgMissing.ev, `${svgMissing.stage}.q18-scope.assignment.json`);
  const svgAssignment = JSON.parse(fs.readFileSync(svgAssignmentPath, 'utf8')); svgAssignment.studentBundleSha256 = bundleRef.sha256;
  const svgAssignmentRef = writeJson(svgAssignmentPath, svgAssignment);
  const svgAuth = JSON.parse(fs.readFileSync(svgMissing.authorityPath, 'utf8'));
  svgAuth.currentBundle = { path: bundlePath, sha256: bundleRef.sha256 }; svgAuth.assignment.sha256 = svgAssignmentRef.sha256;
  writeJson(svgMissing.authorityPath, svgAuth);
  assert.throws(() => preflightQ18Scope({ root: svgMissing.root, authorityFile: svgMissing.authorityPath }), /STUDENT_SVG_DEPENDENCY_MISSING/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  const auth3 = JSON.parse(fs.readFileSync(third.authorityPath, 'utf8')); auth3.source.rawSha256 = '0'.repeat(64);
  writeJson(third.authorityPath, auth3);
  assert.throws(() => preflightQ18Scope({ root: third.root, authorityFile: third.authorityPath }), /ASSIGNMENT_CURRENT_SOURCE_BINDING_MISMATCH/);
});

test('rejects wrong stage reviewer, extra answer rows, missing Root decision, and qid loss', t => {
  const f = fixture('R1'); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const authority = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8')); authority.freshReviewer.reviewerIdentity.role = 'archive_create';
  writeJson(f.authorityPath, authority);
  assert.throws(() => preflightQ18Scope({ root: f.root, authorityFile: f.authorityPath }), /FRESH_R1_R2_REVIEWER_REQUIRED/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const answers = JSON.parse(fs.readFileSync(second.answersPath, 'utf8')); answers.answers.push({ qid: 17, independentAnswer: 'synthetic', reasoning: 'synthetic' });
  writeJson(second.answersPath, answers);
  assert.throws(() => freezeQ18Scope({ root: second.root, authorityFile: second.authorityPath, answersFile: second.answersPath }), /EXACT_ONE_Q18_ANSWER_REQUIRED/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  fs.rmSync(path.join(third.ev, 'ROOT.item-recovery.decision.json'), { force: true });
  assert.throws(() => preflightQ18Scope({ root: third.root, authorityFile: third.authorityPath }), /ENOENT|ROOT_DECISION_PROOF/);

  const fourth = fixture(); t.after(() => fs.rmSync(fourth.root, { recursive: true, force: true }));
  const bundlePath = fourth.currentBundlePath, bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  bundle.rows.pop(); bundle.qids.pop(); bundle.questionCount = 21;
  const bundleRef = writeJson(bundlePath, bundle), assignmentPath = path.join(fourth.ev, `${fourth.stage}.q18-scope.assignment.json`);
  const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8')); assignment.studentBundleSha256 = bundleRef.sha256;
  const assignmentRef = writeJson(assignmentPath, assignment), auth4 = JSON.parse(fs.readFileSync(fourth.authorityPath, 'utf8'));
  auth4.currentBundle = { path: bundleRef.path, sha256: bundleRef.sha256 }; auth4.assignment.sha256 = assignmentRef.sha256;
  writeJson(fourth.authorityPath, auth4);
  assert.throws(() => preflightQ18Scope({ root: fourth.root, authorityFile: fourth.authorityPath }), /FULL_22_QID_STUDENT_BUNDLE_REQUIRED/);
});

test('rejects stale postfreeze source/bundle and freeze overwrite attempts', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const frozen = freezeQ18Scope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  assert.throws(() => freezeQ18Scope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }));
  fs.appendFileSync(f.sourcePath, '\n// changed after freeze\n');
  assert.throws(() => discloseQ18Scope({ root: f.root, authorityFile: f.authorityPath, freezeFile: f.freezePath, freezeSha256: frozen.freeze.sha256 }), /Q18_POSTFREEZE_SOURCE_SHA_MISMATCH/);
});
