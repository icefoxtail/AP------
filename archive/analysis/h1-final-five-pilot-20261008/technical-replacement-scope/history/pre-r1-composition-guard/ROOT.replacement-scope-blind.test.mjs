import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { physical, sha256 } from '../../../tools/archive-codex-artifact-io.mjs';
import { normalizeStudentBundle, STUDENT_FIELDS } from '../../../tools/archive-student-bundle.mjs';
import { discloseReplacementScope, freezeReplacementScope, preflightReplacementScope } from '../ROOT.replacement-scope-blind.mjs';

const FULL = Array.from({ length: 20 }, (_, index) => index + 1);
const SCOPE = [17, 20];
const RUN = 'h1-final-five-pilot-20261008';
const UID = '21_매산고_1학기_기말_고1_기출';
const gitBlob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); return physical(file); };

function fixture(stage = 'R1') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-replacement-scope-'));
  const ev = path.join(root, 'archive/analysis', UID, RUN);
  const sourcePath = path.join(root, '.tmp/archive', RUN, UID, `${UID}.js`);
  const assetRoot = path.join(path.dirname(sourcePath), 'assets');
  const oldBundlePath = path.join(path.dirname(sourcePath), 'student-bundle.old.json');
  const currentBundlePath = path.join(path.dirname(sourcePath), 'student-bundle.current.json');
  const originalFreezePath = path.join(ev, `${stage}.original-full-freeze.opaque.json`);
  const recoveryProofPath = path.join(ev, 'ROOT.item-recovery-source-provenance.json');
  const sessionProofPath = path.join(ev, `${stage}.fresh-review-session.json`);
  const assetReadPath = path.join(ev, `${stage}.scope-asset-reads.json`);
  const assignmentPath = path.join(ev, `${stage}.replacement-scope.assignment.json`);
  const rosterPath = path.join(root, 'archive/analysis', RUN, 'ROOT.roster.json');
  const freezePath = path.join(ev, `${stage}.q17-q20.scope-freeze.json`);
  const disclosurePath = path.join(ev, `${stage}.q17-q20.postfreeze-disclosure.json`);
  const authorityPath = path.join(ev, `${stage}.replacement-scope.authority.json`);
  const reviewerIdentity = { role: `archive_${stage.toLowerCase()}`, reviewerId: `/root/${stage.toLowerCase()}_maesan2021_replacement_1720` };
  const previousReviewerId = `/root/${stage.toLowerCase()}_maesan2021_five`;
  const oldSourceBytes = Buffer.from('synthetic E2 original 20-qid JS preimage bytes');
  const oldSourceRawSha = sha256(oldSourceBytes), oldSourceBlob = gitBlob(oldSourceBytes);
  const sourceRawSha = '4'.repeat(64);
  const sourceBlob = '9'.repeat(40);
  const assets = new Map();
  fs.mkdirSync(ev, { recursive: true });
  for (const qid of SCOPE) {
    const ref = `assets/images/${UID}/q${qid}.png`;
    const bytes = Buffer.from(`replacement-scope-asset-${qid}`);
    const file = path.join(assetRoot, ...ref.split('/'));
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
    assets.set(qid, { ref, path: file, sha256: sha256(bytes) });
  }
  const oldRows = [], currentRows = [];
  for (const qid of FULL) {
    const base = { id: qid, content: SCOPE.includes(qid) ? `old-source-body-${qid}` : `unchanged-student-${qid}`, choices: ['A', 'B', 'C', 'D', 'E'], layoutTag: '', wide: false };
    const next = SCOPE.includes(qid) ? { ...base, content: `recovered-source-body-${qid}` } : structuredClone(base);
    if (SCOPE.includes(qid)) { base.image = assets.get(qid).ref; next.image = assets.get(qid).ref; }
    const rowAssets = SCOPE.includes(qid) ? [assets.get(qid)] : [];
    oldRows.push({ qid, student: base, assets: rowAssets });
    currentRows.push({ qid, student: next, assets: rowAssets });
  }
  const sourceBytes = Buffer.from(`window.examTitle=${JSON.stringify(UID)};\nwindow.questionBank=${JSON.stringify(currentRows.map(row => ({
    ...row.student, answer: `SYNTHETIC_STORED_${row.qid}`, solution: `SYNTHETIC_SOLUTION_${row.qid}`, explanation: `SYNTHETIC_EXPLANATION_${row.qid}`,
    decisiveStep: `SYNTHETIC_STEP_${row.qid}`, standardCourse: '수학(상)', standardUnitKey: 'H15-SA-09', standardUnit: '평면좌표',
    subUnitKey: 'H15-SA-09-CIRCLE', subUnit: '원의 방정식', problemTypeKey: 'PT_CIRCLE', templateKey: 'TPL_CIRCLE',
    difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
  })))};\n`);
  fs.writeFileSync(sourcePath, sourceBytes);
  const currentRawSha = sha256(sourceBytes), currentBlob = gitBlob(sourceBytes);
  const oldBundle = { schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256: oldSourceRawSha, sourceRawBlobSha1: oldSourceBlob, questionCount: 20, qids: FULL, whitelist: [...STUDENT_FIELDS], rows: oldRows, adapterProvenance: { answersRead: false, studentFieldsDropped: [] }, extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true } };
  const currentBundle = { schemaVersion: 'JS_ARCHIVE_STUDENT_BUNDLE_V2', sourceRawSha256: currentRawSha, sourceRawBlobSha1: currentBlob, questionCount: 20, qids: FULL, whitelist: [...STUDENT_FIELDS], rows: currentRows, adapterProvenance: { answersRead: false, studentFieldsDropped: [] }, extractionProvenance: { answersDisclosed: false, studentFieldsExactParity: true } };
  const oldBundleRef = writeJson(oldBundlePath, oldBundle), currentBundleRef = writeJson(currentBundlePath, currentBundle);
  const originalFreezeBytes = Buffer.from(JSON.stringify({ rows: [{ qid: 17, independentAnswer: 'SYNTHETIC_OLD_FREEZE_SENTINEL' }] }));
  fs.writeFileSync(originalFreezePath, originalFreezeBytes);
  const originalFreezeRef = physical(originalFreezePath);
  const recovery = { schemaVersion: 'ROOT_ITEM_RECOVERY_SOURCE_PROVENANCE_V1', runId: RUN, examUid: UID, disposition: 'ROOT_SOURCE_RECOVERY_Q17_Q20_ONLY', scopeQids: SCOPE, changedQids: SCOPE, fullQuestionCount: 20, oldSourceRawSha256: oldSourceRawSha, sourceRawSha256: currentRawSha, sourceRawBufferGitBlobSha1: currentBlob };
  const recoveryRef = writeJson(recoveryProofPath, recovery);
  const session = { schemaVersion: 'ROOT_FRESH_REPLACEMENT_SCOPE_SESSION_V1', runId: RUN, examUid: UID, stage, reviewerIdentity, forkTurns: 'none', scopeQids: SCOPE, sourceRawSha256: currentRawSha, studentBundleSha256: currentBundleRef.sha256 };
  const sessionRef = writeJson(sessionProofPath, session);
  const assetProof = { schemaVersion: 'ROOT_REPLACEMENT_SCOPE_ASSET_READS_V1', runId: RUN, examUid: UID, stage, reviewerIdentity, rows: SCOPE.map(qid => ({ qid, ref: assets.get(qid).ref, sha256: assets.get(qid).sha256, opened: true, openedAt: '2026-10-08T03:00:00.000Z' })) };
  const assetProofRef = writeJson(assetReadPath, assetProof);
  const roster = { runId: RUN, locked: true, rows: [{ examUid: UID, productionPath: `archive/exams/original/high/h1/1final/${UID}.js` }] };
  const rosterRef = writeJson(rosterPath, roster);
  const assignment = { runId: RUN, examUid: UID, stage, executionLine: 'CODEX', qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', workingJsAbsolute: sourcePath, workingJsPrefreezePermission: 'HASH_ONLY_NO_TEXT_OR_PARSE', expectedSourceRawSha256: currentRawSha, expectedSourceRawBufferGitBlobSha1: currentBlob, studentBundleAbsolute: currentBundlePath, studentBundleSha256: currentBundleRef.sha256, questionCount: 20, fullQidOrder: FULL, scopeQids: SCOPE, assetRootAbsolute: assetRoot };
  const assignmentRef = writeJson(assignmentPath, assignment);
  const authority = {
    schemaVersion: 'ROOT_REPLACEMENT_SCOPE_BLIND_AUTHORITY_V1', decisionAuthority: 'ROOT_DIRECTED_ITEM_RECOVERY', runId: RUN, examUid: UID, stage,
    scopeQids: SCOPE, expectedQidOrder: FULL, invalidOriginalQids: SCOPE, reuseOriginalQids: FULL.filter(qid => !SCOPE.includes(qid)),
    rootDecision: { decisionAuthority: 'ROOT_DIRECTED_ITEM_RECOVERY', scopeQids: SCOPE, remainingAfterR2: true },
    lockedRoster: { path: rosterPath, sha256: rosterRef.sha256 }, assignment: { path: assignmentPath, sha256: assignmentRef.sha256 },
    freshReviewer: { reviewerIdentity, forkTurns: 'none', sessionProof: { path: sessionProofPath, sha256: sessionRef.sha256 } },
    source: { path: sourcePath, rawSha256: currentRawSha, rawBufferGitBlobSha1: currentBlob },
    currentBundle: { path: currentBundlePath, sha256: currentBundleRef.sha256 },
    oldBundle: { path: oldBundlePath, sha256: oldBundleRef.sha256, sourceRawSha256: oldSourceRawSha, sourceRawBlobSha1: oldSourceBlob },
    originalFreeze: { path: originalFreezePath, sha256: originalFreezeRef.sha256, stage, sourceRawSha256: oldSourceRawSha, reviewerId: previousReviewerId, opaque: true },
    sourceRecoveryProvenance: { path: recoveryProofPath, sha256: recoveryRef.sha256 }, scopeDependenciesQids: SCOPE,
    scopedAssetReadProof: { path: assetReadPath, sha256: assetProofRef.sha256 }, assetRootAbsolute: assetRoot,
    evidenceRootAbsolute: ev, scopeFreezeOutputAbsolute: freezePath, postfreezeDisclosureOutputAbsolute: disclosurePath,
  };
  writeJson(authorityPath, authority);
  const answersPath = path.join(ev, `${stage}.replacement-scope.answers.json`);
  const answers = { schemaVersion: 'ROOT_FRESH_REPLACEMENT_SCOPE_ANSWERS_V1', reviewerIdentity, answers: SCOPE.map(qid => ({ qid, independentAnswer: `fresh-synthetic-${qid}`, reasoning: `fresh-synthetic-reasoning-${qid}` })) };
  writeJson(answersPath, answers);
  return { root, ev, stage, sourcePath, currentBundlePath, originalFreezePath, recoveryProofPath, assetReadPath, authorityPath, answersPath, freezePath, disclosurePath, reviewerIdentity };
}

test('preflights R1 and R2 against a full 20-qid bundle while scoping the fresh review to q17/q20', t => {
  for (const stage of ['R1', 'R2']) {
    const f = fixture(stage); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
    const result = preflightReplacementScope({ root: f.root, authorityFile: f.authorityPath });
    assert.equal(result.status, 'PREFLIGHT_PASS_NOT_FROZEN');
    assert.equal(result.stage, stage);
    assert.deepEqual(result.scopeQids, SCOPE);
    assert.deepEqual(result.fullQidOrder, FULL);
    assert.deepEqual(result.changedStudentQids, SCOPE);
    assert.equal(result.unchangedStudentQids.length, 18);
    assert.equal(result.oldFreezeParsed, false);
    assert.equal(result.rawSourceJsRead, false);
  }
});

test('freezes exactly two fresh answers with a full denominator and no stage-pass or dispatcher claim', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const oldHash = physical(f.originalFreezePath).sha256;
  const frozen = freezeReplacementScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  const value = JSON.parse(fs.readFileSync(f.freezePath, 'utf8'));
  assert.deepEqual(value.scopeQids, SCOPE);
  assert.equal(value.fullQuestionCount, 20);
  assert.deepEqual(value.answers.map(row => row.qid), SCOPE);
  assert.equal(value.originalFullFreezeOpaque.payloadParsed, false);
  assert.equal(value.stagePass, false);
  assert.equal(value.qualityVerdictCreated, false);
  assert.equal(value.dispatcherSlotReleased, false);
  assert.equal(JSON.stringify(value).includes('SYNTHETIC_OLD_FREEZE_SENTINEL'), false);
  assert.equal(physical(f.originalFreezePath).sha256, oldHash);
  assert.throws(() => freezeReplacementScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath }));
  assert.equal(frozen.status, 'FRESH_REPLACEMENT_SCOPE_FREEZE_ONLY');
});

test('postfreeze disclosure verifies all 20 source rows and emits only q17/q20 answer fields and assets', t => {
  const f = fixture('R2'); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const frozen = freezeReplacementScope({ root: f.root, authorityFile: f.authorityPath, answersFile: f.answersPath });
  const result = discloseReplacementScope({ root: f.root, authorityFile: f.authorityPath, freezeFile: f.freezePath, freezeSha256: frozen.freeze.sha256 });
  const disclosure = JSON.parse(fs.readFileSync(f.disclosurePath, 'utf8'));
  assert.deepEqual(disclosure.rows.map(row => row.qid), SCOPE);
  assert.equal(disclosure.rows[0].storedFields.answer, 'SYNTHETIC_STORED_17');
  assert.equal(disclosure.rows[1].storedFields.answer, 'SYNTHETIC_STORED_20');
  assert.equal(JSON.stringify(disclosure).includes('SYNTHETIC_STORED_16'), false);
  assert.equal(JSON.stringify(disclosure).includes('SYNTHETIC_SOLUTION_16'), false);
  assert.equal(disclosure.fullStudentParity, 'EXACT_20_QID_BANK');
  assert.equal(disclosure.stagePassClaimed, false);
  assert.deepEqual(result.disclosedQids, SCOPE);
});

test('rejects outside-qid payload mutation, missing scoped assets, and missing ROOT recovery admission proof', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const bundle = JSON.parse(fs.readFileSync(f.currentBundlePath, 'utf8'));
  bundle.rows.find(row => row.qid === 16).student.content = 'changed outside recovery scope';
  const bundleRef = writeJson(f.currentBundlePath, bundle);
  const assignment = JSON.parse(fs.readFileSync(path.join(f.ev, 'R1.replacement-scope.assignment.json'), 'utf8'));
  assignment.studentBundleSha256 = bundleRef.sha256;
  const assignmentRef = writeJson(path.join(f.ev, 'R1.replacement-scope.assignment.json'), assignment);
  const auth = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
  auth.currentBundle.sha256 = bundleRef.sha256; auth.assignment.sha256 = assignmentRef.sha256;
  writeJson(f.authorityPath, auth);
  assert.throws(() => preflightReplacementScope({ root: f.root, authorityFile: f.authorityPath }), /ONLY_Q17_Q20_STUDENT_OR_ASSET_PAYLOAD_MAY_CHANGE/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const proof = JSON.parse(fs.readFileSync(second.assetReadPath, 'utf8')); proof.rows = proof.rows.filter(row => row.qid !== 20);
  const proofRef = writeJson(second.assetReadPath, proof);
  const auth2 = JSON.parse(fs.readFileSync(second.authorityPath, 'utf8')); auth2.scopedAssetReadProof.sha256 = proofRef.sha256;
  writeJson(second.authorityPath, auth2);
  assert.throws(() => preflightReplacementScope({ root: second.root, authorityFile: second.authorityPath }), /SCOPED_ASSET_ACK_SET_MISMATCH/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  fs.rmSync(third.recoveryProofPath, { force: true });
  assert.throws(() => preflightReplacementScope({ root: third.root, authorityFile: third.authorityPath }), /ENOENT|SOURCE_RECOVERY_PROVENANCE/);
});

test('allows q17/q20 asset replacement while requiring all 18 outside-scope asset hashes to stay exact', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const current = JSON.parse(fs.readFileSync(f.currentBundlePath, 'utf8'));
  const asset = current.rows.find(row => row.qid === 17).assets[0];
  const newBytes = Buffer.from('new-synthetic-q17-replacement-image');
  fs.writeFileSync(asset.path, newBytes);
  asset.sha256 = sha256(newBytes);
  const bundleRef = writeJson(f.currentBundlePath, current);
  const assignmentPath = path.join(f.ev, 'R1.replacement-scope.assignment.json');
  const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8'));
  assignment.studentBundleSha256 = bundleRef.sha256;
  const assignmentRef = writeJson(assignmentPath, assignment);
  const authority = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
  authority.currentBundle.sha256 = bundleRef.sha256;
  authority.assignment.sha256 = assignmentRef.sha256;
  const readProof = JSON.parse(fs.readFileSync(f.assetReadPath, 'utf8'));
  readProof.rows.find(row => row.qid === 17).sha256 = asset.sha256;
  const readProofRef = writeJson(f.assetReadPath, readProof);
  authority.scopedAssetReadProof.sha256 = readProofRef.sha256;
  const sessionProof = JSON.parse(fs.readFileSync(path.join(f.ev, 'R1.fresh-review-session.json'), 'utf8'));
  sessionProof.studentBundleSha256 = bundleRef.sha256;
  const sessionRef = writeJson(path.join(f.ev, 'R1.fresh-review-session.json'), sessionProof);
  authority.freshReviewer.sessionProof.sha256 = sessionRef.sha256;
  writeJson(f.authorityPath, authority);
  const result = preflightReplacementScope({ root: f.root, authorityFile: f.authorityPath });
  assert.deepEqual(result.changedStudentQids, SCOPE);
  assert.equal(result.unchangedStudentQids.length, 18);
});

test('rejects wrong reviewer role, three answers, and source-SHA rebind attempts', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const authority = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8'));
  authority.freshReviewer.reviewerIdentity.role = 'archive_create';
  writeJson(f.authorityPath, authority);
  assert.throws(() => preflightReplacementScope({ root: f.root, authorityFile: f.authorityPath }), /FRESH_R1_OR_R2_REVIEWER_REQUIRED/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const packet = JSON.parse(fs.readFileSync(second.answersPath, 'utf8'));
  packet.answers.push({ qid: 16, independentAnswer: 'synthetic-extra', reasoning: 'synthetic-extra' });
  writeJson(second.answersPath, packet);
  assert.throws(() => freezeReplacementScope({ root: second.root, authorityFile: second.authorityPath, answersFile: second.answersPath }), /EXACT_Q17_Q20_ANSWERS_REQUIRED/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  const auth = JSON.parse(fs.readFileSync(third.authorityPath, 'utf8')); auth.source.rawSha256 = '0'.repeat(64);
  writeJson(third.authorityPath, auth);
  assert.throws(() => preflightReplacementScope({ root: third.root, authorityFile: third.authorityPath }), /ASSIGNMENT_CURRENT_SOURCE_SHA_BINDING_MISMATCH/);
});

test('rejects full qid loss, scope overwrite, and source or current bundle drift after freeze', t => {
  const f = fixture(); t.after(() => fs.rmSync(f.root, { recursive: true, force: true }));
  const bundle = JSON.parse(fs.readFileSync(f.currentBundlePath, 'utf8'));
  bundle.rows = bundle.rows.filter(row => row.qid !== 16); bundle.qids = FULL.filter(qid => qid !== 16); bundle.questionCount = 19;
  const bundleRef = writeJson(f.currentBundlePath, bundle);
  const assignmentPath = path.join(f.ev, 'R1.replacement-scope.assignment.json');
  const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8')); assignment.studentBundleSha256 = bundleRef.sha256;
  const assignmentRef = writeJson(assignmentPath, assignment);
  const auth = JSON.parse(fs.readFileSync(f.authorityPath, 'utf8')); auth.currentBundle.sha256 = bundleRef.sha256; auth.assignment.sha256 = assignmentRef.sha256;
  writeJson(f.authorityPath, auth);
  assert.throws(() => preflightReplacementScope({ root: f.root, authorityFile: f.authorityPath }), /STUDENT_DENOMINATOR_MISMATCH|FULL_20_QID_BUNDLE_REQUIRED/);

  const second = fixture(); t.after(() => fs.rmSync(second.root, { recursive: true, force: true }));
  const frozen = freezeReplacementScope({ root: second.root, authorityFile: second.authorityPath, answersFile: second.answersPath });
  assert.throws(() => freezeReplacementScope({ root: second.root, authorityFile: second.authorityPath, answersFile: second.answersPath }));
  fs.appendFileSync(second.sourcePath, '\n// postfreeze source mutation\n');
  assert.throws(() => discloseReplacementScope({ root: second.root, authorityFile: second.authorityPath, freezeFile: second.freezePath, freezeSha256: frozen.freeze.sha256 }), /POSTFREEZE_CURRENT_SOURCE_SHA_MISMATCH/);

  const third = fixture(); t.after(() => fs.rmSync(third.root, { recursive: true, force: true }));
  const frozen3 = freezeReplacementScope({ root: third.root, authorityFile: third.authorityPath, answersFile: third.answersPath });
  const changed = JSON.parse(fs.readFileSync(third.currentBundlePath, 'utf8')); changed.rows.find(row => row.qid === 17).student.content = 'changed after scope freeze';
  writeJson(third.currentBundlePath, changed);
  assert.throws(() => discloseReplacementScope({ root: third.root, authorityFile: third.authorityPath, freezeFile: third.freezePath, freezeSha256: frozen3.freeze.sha256 }), /SAFE_STUDENT_BUNDLE_SHA256_MISMATCH/);
});
