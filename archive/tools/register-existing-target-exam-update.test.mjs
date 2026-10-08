import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import core from '../archive2-core.js';
import { gitBlobSha } from './archive-stage-validator-compat-v1.mjs';
import { buildExistingTargetUpdate, validateCurrentProofChain } from './prepare-existing-target-registration-update.mjs';
import { canonicalContentFingerprint, makeTargetIdentityRows } from './prepare-target-registration-candidate.mjs';
import { applyExistingTargetOutputs, buildExistingTargetMerge, REGISTRY_PATHS } from './register-existing-target-exam-update.mjs';

const realRepo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value);
const write = (root, relative, value) => {
  const file = path.join(root, ...relative.split('/'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.isBuffer(value) ? value : String(value));
  return file;
};
const target = 'original/middle/m3/2mid/demo.js';
const nonTarget = 'original/middle/m3/2mid/other.js';
const question = {
  id: 1, level: '중', category: 'fixture', originalCategory: 'fixture', questionType: 'objective', layoutTag: 'default', tags: ['fixture'], wide: false,
  content: '다음 중 맞는 것을 고르시오.', choices: ['가', '나'], answer: '가', solution: '조건에 따라\n가를 고른다.',
  standardCourse: '중등수학', standardUnitKey: 'M3-U01', standardUnit: '단원', standardUnitOrder: 2,
  subUnitKey: 'M3-U01-S02', subUnit: '소단원2', subUnitConfidence: 'high', subUnitClassificationDepth: 'unit',
  problemTypeKey: 'M3-P01', templateKey: 'M3-T01', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
  difficultyBucket: 2, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
};
const qUid = makeTargetIdentityRows(target, [question])[0].questionUid;
const nonTargetUid = 'qid_v1_fixture_other_q1';
const targetId = { ...makeTargetIdentityRows(target, [question])[0], sourceFingerprint: 'old-source-fingerprint' };
const otherId = { questionUid: nonTargetUid, sourceArchiveFile: nonTarget, sourceOrdinal: 1, sourceQuestionNo: '1', legacyQKey: nonTarget + '_1', sourceFingerprint: 'other-source-fingerprint' };
const metaRow = id => ({ ...id, contentFingerprint: 'content-' + id.questionUid, standardCourse: '중등수학', standardUnitKey: 'M3-U01', standardUnit: '단원', subUnitKey: 'M3-U01-S01', subUnit: '소단원1', subUnitConfidence: 'high', subUnitClassificationDepth: 'unit', standardUnitOrder: 99, problemTypeKey: 'M3-P01', templateKey: 'M3-T01', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE', metadataStatus: 'approved_semantic_review', reviewStatus: 'reviewed_pass', fieldStatus: { standardUnit: 'approved_classification', subUnit: 'approved_classification', problemType: 'approved_classification', template: 'approved_classification', difficulty: 'approved_source' }, approvalEvidence: ['prior-r1-proof-ref'] });
const indexRow = (file, uid, current = false) => ({ sourceFile: file, sourceOrdinal: 1, sourceQuestionNo: '1', questionUid: uid, qKey: file + '_1', id: 1, level: '중', standardUnit: '단원', standardUnitKey: 'M3-U01', subUnitKey: current ? 'M3-U01-S02' : 'M3-U01-S01', subUnit: current ? '소단원2' : '소단원1', standardCourse: '중등수학', tags: ['fixture'], hasImage: false, hasSolutionImage: false, contentText: '다음 중 맞는 것을 고르시오.' });
function catalogRow(file, id) {
  const evidence = { questionUid: id.questionUid, sourceFile: file, sourceOrdinal: 1, sourceFingerprint: id.sourceFingerprint, assignmentFingerprint: canonicalContentFingerprint(question), metadataStatus: 'approved_semantic_review', fieldStatus: metaRow(id).fieldStatus, evidenceRefs: ['prior-r1-proof-ref'], evidenceDigest: 'classification-digest', metadataRevision: 'fixture-v1' };
  return { sourceFile: file, sourceOrdinal: 1, sourceQuestionNo: '1', questionUid: id.questionUid, sourceGrade: '중3', sourceGradeStatus: 'VALID', sourceGradeReason: '', effectiveBrowseGrade: '중3', school: 'Demo', year: 2026, subject: '중등수학', topic: '단원', examAxis: '2-mid', contentType: '기출', difficultyBucket: 2, tagConfidence: 'high', tagStatus: 'approved', metadataRevision: 'fixture-v1', legacyLevel: '중', legacyStandardUnitKey: 'M3-U01', legacySubUnitKey: 'M3-U01-S01', identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceFingerprint: id.sourceFingerprint, assignmentFingerprint: evidence.assignmentFingerprint, rawQuestionHash: 'raw-' + id.questionUid, approvedSourceFingerprint: id.sourceFingerprint, metadataAssignmentEvidence: evidence, sourceStatus: 'VERIFIED', taxonomyStatus: 'UNKNOWN', metadataConflicts: [], gradeConflict: false, unverifiedTaxonomy: null, canonicalAssignmentReasons: [], courseFamilies: [], curriculumKey: '', courseKey: '', L1: '', L2: '', L3: '', L4: '', standardCourse: '중등수학', standardUnitKey: 'M3-U01', standardUnit: '단원', subUnitKey: 'M3-U01-S01', subUnit: '소단원1', automatic: false };
}

function fixture({ metaPass = true, candidateSubUnitKey = question.subUnitKey } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-existing-target-apply-'));
  const source = 'window.examTitle="Demo";window.questionBank=' + json([question]) + ';';
  write(root, 'archive/exams/' + target, source);
  write(root, 'archive/exams/' + nonTarget, 'window.examTitle="Other";window.questionBank=' + json([{ ...question, id: 1 }]) + ';');
  const testAsset = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>');
  write(root, 'archive/assets/images/demo.svg', testAsset);
  write(root, 'archive/db.js', 'window.mainDB={exams:[' + json({ file: target, grade: '중3', qCount: 1, runtimeIndex: 17 }) + ',' + json({ file: nonTarget, grade: '중3', qCount: 1, runtimeIndex: 18 }) + ']};');
  const targetMetadata = metaRow(targetId), otherMetadata = metaRow(otherId);
  write(root, 'archive/data/question_identity_map.json', json({ schemaVersion: 'question-identity-map-v1', sourceCommit: '', records: [targetId, otherId], lookup: {}, stats: {}, identityDigest: 'prior', generatedAt: 'prior' }));
  write(root, 'archive/data/question_metadata.json', json({ schemaVersion: 'question-metadata-v1', sourceDigests: { completeClassification: 'classification-digest' }, counts: {}, records: [targetMetadata, otherMetadata], digest: 'prior' }));
  write(root, 'archive/question-index.js', 'window.questionIndex=' + json([indexRow(target, qUid), indexRow(nonTarget, nonTargetUid)]) + ';');
  const targetCatalog = catalogRow(target, targetId), otherCatalog = catalogRow(nonTarget, otherId);
  write(root, 'archive/data/archive2-catalog.json', json({ schemaVersion: 'archive2-catalog-v1', taxonomy: [], sourceHashes: [[target, 'old-source'], [nonTarget, 'other-source']], exams: [{ file: target, grade: '중3', automaticCount: 0 }, { file: nonTarget, grade: '중3', automaticCount: 0 }], records: [targetCatalog, otherCatalog], health: { exams: 2, questions: 2 } }));
  write(root, 'archive/question-identity.js', 'window.questionIdentity={files:[' + json(target) + ',' + json(nonTarget) + '],byUid:{' + json(qUid) + ':[0,1,"1"],' + json(nonTargetUid) + ':[1,1,"1"]},byFile:{"0":{"o":{"1":' + json(qUid) + '},"n":{"1":[' + json(qUid) + ']}},"1":{"o":{"1":' + json(nonTargetUid) + '},"n":{"1":[' + json(nonTargetUid) + ']}}}};');
  write(root, 'archive/question-index-report.md', '- 시험지 수(db.js): 2\n- 시험지 파일 수: 2\n- 원본 문항 수(중복 제거 전): 2\n- 최종 인덱스 문항 수(중복 제거 후): 2\n- db.js 크기: 100\n- 시험지 JS 총 크기: 200\n- 인덱스 크기: 300\n');
  write(root, 'archive/question-index-audit.md', 'audit\n');
  write(root, 'archive/data/archive2-canonical-input-manifest.json', '{}');
  write(root, 'archive/data/archive2-canonical-projection-policy.json', json({ gradeCourseAllowlist: [] }));
  for (const relative of core.Canonical.RUNTIME_INPUT_PATHS) write(root, 'archive/' + relative, json({ generatedFrom: {} }));
  const requiredInputs = core.Canonical.manifestInputPathsFromRuntimePacks(core.Canonical.RUNTIME_INPUT_PATHS.map(() => ({ generatedFrom: {} })), () => false);
  for (const relative of requiredInputs) {
    const file = path.resolve(root, 'archive', relative);
    if (!fs.existsSync(file)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, '{}'); }
  }
  write(root, 'archive/data/archive2-item-review-overrides.json', '{}');

  for (const golden of JSON.parse(fs.readFileSync(path.join(realRepo, 'archive/data/codex-quality-calibration-registry-v2.json'), 'utf8')).goldenPaths) {
    write(root, golden, fs.readFileSync(path.join(realRepo, golden)));
  }
  const goldenRegistryPath = 'archive/data/codex-quality-calibration-registry-v2.json';
  write(root, goldenRegistryPath, fs.readFileSync(path.join(realRepo, goldenRegistryPath)));
  const negativePath = 'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md';
  write(root, negativePath, fs.readFileSync(path.join(realRepo, negativePath)));

  execFileSync('git', ['init', root], { stdio: 'ignore' });
  execFileSync('git', ['-C', root, 'config', 'user.email', 'fixture@example.invalid']);
  execFileSync('git', ['-C', root, 'config', 'user.name', 'Fixture']);
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', ['-C', root, 'commit', '-m', 'fixture baseline']);
  const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const sourceBytes = fs.readFileSync(path.join(root, 'archive/exams', target));
  const assignment = { runId: 'run-fixture', examUid: 'demo', expectedHead: head, productionRelativePath: 'archive/exams/' + target, artifactRawSha256: hash(sourceBytes), validatorRawBufferBlobSha1: gitBlobSha(sourceBytes), releaseAssets: [{ ref: 'assets/images/demo.svg', sha256: hash(testAsset) }] };
  const blob = assignment.validatorRawBufferBlobSha1;
  const goldenPaths = JSON.parse(fs.readFileSync(path.join(root, goldenRegistryPath), 'utf8')).goldenPaths.slice(0, 2);
  const sample = goldenPaths.map(goldenPath => {
    const bytes = fs.readFileSync(path.join(root, goldenPath)), box = { window: {} };
    vm.runInNewContext(bytes.toString('utf8'), box);
    const items = box.window.questionBank.filter(item => item.solution && !item.solutionImage).slice(0, 2).map(item => ({ qid: item.id, observation: 'fixture sample read', solutionSha256: hash(Buffer.from(String(item.solution), 'utf8')), axes: ['SOLUTION_LAYOUT'] }));
    const visual = box.window.questionBank.find(item => item.solutionImage && !(item.id === 18 && goldenPath.includes('제일고')));
    if (visual) {
      const visualBytes = fs.readFileSync(path.join(realRepo, 'archive', visual.solutionImage));
      write(root, 'archive/' + visual.solutionImage, visualBytes);
      items.push({ qid: visual.id, observation: 'fixture visual sample read', solutionSha256: hash(Buffer.from(String(visual.solution), 'utf8')), visualSha256: hash(visualBytes), axes: ['SOLUTION_LAYOUT', 'VISUAL_SEMANTIC_PARITY'] });
    }
    return { path: goldenPath, sha256: hash(bytes), items };
  });
  const negativeBytes = fs.readFileSync(path.join(root, negativePath));
  const proofs = [];
  const proofEvidence = {
    R1: { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R1', examUid: 'demo', artifactSha: blob, qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', goldenCalibrationReviewed: true, goldenCalibrationSet: goldenPaths, goldenCalibration: { samples: sample, negativeSample: { path: negativePath, sha256: hash(Buffer.from(negativeBytes.toString('utf8'), 'utf8')), observation: 'fixture negative sample read' } }, rows: [{ qid: 1, independentAnswer: '가', independentAnswerFrozenBeforeStoredAnswer: true, storedAnswer: '가', compareResult: 'MATCH', verdict: 'PASS', smallBoardContinuityStatus: 'PASS', solutionSha256: hash(Buffer.from(question.solution, 'utf8')), axisEvidence: { META: { status: metaPass ? 'PASS' : 'PENDING' } } }] },
    R2: { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R2', examUid: 'demo', artifactSha: blob, qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', rows: [{ qid: 1, blindAnswer: '가', blindAnswerFrozenBeforeR1AndStoredAnswer: true, compareResult: 'MATCH', verdict: 'PASS' }] },
    R3: { schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2', stage: 'R3', examUid: 'demo', artifactSha: blob, qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006', executionLine: 'CODEX', targetedScope: { openFindingQids: [1], changedQids: [], directDependencyQids: [] }, lockedScopeIntegrity: true, releaseIntegrity: true, rows: [{ qid: 1, verdict: 'PASS' }], artifactDispositions: { artifactSha: blob, rows: [{ qid: 1, artifactSha: blob, metaDisposition: 'CURRENT_FIELDS_RETAINED' }] } },
  };
  for (const stage of ['R1', 'R2', 'R3']) {
    const relativePath = 'archive/analysis/run-fixture/' + stage + '.json';
    const bytes = Buffer.from(JSON.stringify(proofEvidence[stage]), 'utf8');
    write(root, relativePath, bytes);
    proofs.push({ stage, path: relativePath, sha256: hash(bytes) });
  }
  const originalPath = 'archive/analysis/run-fixture/original-R1.json';
  const originalBytes = Buffer.from('{"historicalProof":"preserve"}\n');
  write(root, originalPath, originalBytes);
  const manifestPath = 'archive/analysis/run-fixture/current-stage-proofs.json';
  const proofManifest = { schemaVersion: 'JS_ARCHIVE_CURRENT_STAGE_PROOF_SET_V1', runId: assignment.runId, examUid: assignment.examUid, productionRelativePath: assignment.productionRelativePath, artifactRawSha256: assignment.artifactRawSha256, artifactBlobSha1: blob, proofs, originalProofs: [{ path: originalPath, sha256: hash(originalBytes) }] };
  const manifestBytes = Buffer.from(JSON.stringify(proofManifest), 'utf8');
  write(root, manifestPath, manifestBytes);
  assignment.currentStageProofManifestPath = manifestPath;
  assignment.currentStageProofManifestSha256 = hash(manifestBytes);
  const candidateRoot = path.join(root, '.tmp/archive/run-fixture/demo/canonical');
  const currentFingerprint = makeTargetIdentityRows(target, [question])[0].sourceFingerprint;
  const candidateIdentity = { ...targetId, sourceFingerprint: currentFingerprint };
  const candidateMetadata = { ...targetMetadata, sourceFingerprint: currentFingerprint, contentFingerprint: canonicalContentFingerprint(question), standardUnitOrder: question.standardUnitOrder, subUnitKey: candidateSubUnitKey, subUnit: question.subUnit };
  const candidateCatalog = { ...targetCatalog, sourceFingerprint: currentFingerprint, rawQuestionHash: hash(Buffer.from(JSON.stringify(question), 'utf8')), subUnitKey: question.subUnitKey, subUnit: question.subUnit, metadataAssignmentEvidence: { ...targetCatalog.metadataAssignmentEvidence, sourceFingerprint: currentFingerprint, assignmentFingerprint: canonicalContentFingerprint(question) } };
  write(candidateRoot, 'archive/db.js', fs.readFileSync(path.join(root, 'archive/db.js')));
  write(candidateRoot, 'archive/data/question_identity_map.json', json({ ...JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_identity_map.json'), 'utf8')), records: [candidateIdentity, otherId] }));
  write(candidateRoot, 'archive/data/question_metadata.json', json({ ...JSON.parse(fs.readFileSync(path.join(root, 'archive/data/question_metadata.json'), 'utf8')), records: [candidateMetadata, otherMetadata] }));
  write(candidateRoot, 'archive/question-index.js', 'window.questionIndex=' + json([indexRow(target, qUid, true), indexRow(nonTarget, nonTargetUid)]) + ';');
  write(candidateRoot, 'archive/data/archive2-catalog.json', json({ ...JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8')), records: [candidateCatalog, otherCatalog] }));
  const plan = buildExistingTargetUpdate({ root, assignment, candidateRoot, preservedProofs: proofManifest.originalProofs });
  plan.currentStageProofs = validateCurrentProofChain({ root, assignment, proofManifest, proofManifestPath: manifestPath });
  write(root, 'archive/analysis/run-fixture/assignment.json', JSON.stringify(assignment));
  write(root, 'archive/analysis/run-fixture/update-plan.json', JSON.stringify(plan));
  return { root, assignment, proofManifest, manifestPath, candidateRoot, plan, target, originalPath, currentFingerprint };
}

test('validates the actual current R1/R2/R3 evidence and creates a full existing-target merge plan', async () => {
  const f = fixture();
  try {
    const before = Object.fromEntries(REGISTRY_PATHS.map(relative => [relative, hash(fs.readFileSync(path.join(f.root, relative)))]));
    const merge = await buildExistingTargetMerge({ root: f.root, assignment: f.assignment, plan: f.plan, candidateRoot: f.candidateRoot, proofManifestPath: f.manifestPath });
    assert.equal(merge.receipt.status, 'MERGE_VALIDATED_NOT_APPLIED');
    assert.deepEqual(merge.receipt.currentStageProofs.stages.map(row => row.stage).sort(), ['R1', 'R2', 'R3']);
    assert.equal(merge.receipt.nonTargetInvariance.checked, true);
    assert.equal(merge.receipt.semanticMetaDisposition, 'CURRENT_R1_META_BOUND_PHYSICAL_DELTA_NO_APPROVAL_PROMOTION');
    assert.deepEqual(merge.receipt.metaDelta[0].changedFields.sort(), ['standardUnitOrder', 'subUnitKey', 'subUnit'].sort());
    assert.deepEqual(f.plan.currentStageProofs.r1MetaPassQids, [1]);
    assert.equal(f.plan.originalTargetMetadata[0].standardUnitOrder, 99);
    assert.equal(f.plan.originalTargetMetadata[0].subUnitKey, 'M3-U01-S01');
    const mergedMeta = JSON.parse(merge.outputs.get('archive/data/question_metadata.json').toString('utf8'));
    const targetMeta = mergedMeta.records.find(row => row.questionUid === qUid);
    assert.equal(targetMeta.standardUnitOrder, 2);
    assert.equal(targetMeta.subUnitKey, 'M3-U01-S02');
    assert.equal(targetMeta.metadataStatus, 'registration_pending_semantic_review');
    assert.equal(targetMeta.reviewStatus, 'review_required');
    assert.equal(targetMeta.fieldStatus.standardUnit, 'manual_review_pending');
    assert.equal(targetMeta.fieldStatus.subUnit, 'manual_review_pending');
    assert.equal(targetMeta.fieldStatus.problemType, 'manual_review_pending');
    assert.equal(targetMeta.fieldStatus.template, 'manual_review_pending');
    assert.equal(targetMeta.fieldStatus.difficulty, 'manual_review_pending');
    assert.deepEqual(targetMeta.approvalEvidence, []);
    const indexWindow = { window: {} };
    vm.runInNewContext(merge.outputs.get('archive/question-index.js').toString('utf8'), indexWindow);
    const mergedIndex = indexWindow.window.questionIndex;
    assert.equal(mergedIndex.find(row => row.questionUid === qUid).subUnitKey, 'M3-U01-S02');
    const mergedCatalog = core.decodeCatalog(JSON.parse(merge.outputs.get('archive/data/archive2-catalog.json').toString('utf8')));
    const targetCatalog = mergedCatalog.records.find(row => row.questionUid === qUid);
    assert.equal(targetCatalog.subUnitKey, 'M3-U01-S02');
    assert.equal(targetCatalog.automatic, false);
    assert.equal(targetCatalog.defaultSelectable, false);
    assert.equal(targetCatalog.semanticDisposition, 'HOLD');
    assert.equal(targetCatalog.approvedSourceFingerprint, '');
    assert.equal(targetCatalog.metadataAssignmentEvidence.metadataStatus, 'registration_pending_semantic_review');
    assert.deepEqual(targetCatalog.metadataAssignmentEvidence.evidenceRefs, []);
    assert.equal(targetCatalog.metadataAssignmentEvidence.registrationUpdateReviewProof.r1MetaPass, true);
    assert.equal(targetCatalog.metadataAssignmentEvidence.registrationUpdateReviewProof.currentPhysicalMeta.standardUnitOrder, 2);
    assert.equal(targetCatalog.metadataAssignmentEvidence.registrationUpdateReviewProof.currentPhysicalMeta.subUnitKey, 'M3-U01-S02');
    assert.equal(mergedCatalog.health.automatic || 0, 0);
    const result = applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/dry-run', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath });
    assert.equal(result.receipt.status, 'MERGE_VALIDATED_NOT_APPLIED');
    for (const relative of REGISTRY_PATHS) assert.equal(hash(fs.readFileSync(path.join(f.root, relative))), before[relative]);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects unreviewed or non-source-parity Meta deltas while preserving the original row snapshot', async () => {
  const unreviewed = fixture({ metaPass: false });
  try {
    assert.deepEqual(unreviewed.plan.currentStageProofs.r1MetaPassQids, []);
    await assert.rejects(buildExistingTargetMerge({ root: unreviewed.root, assignment: unreviewed.assignment, plan: unreviewed.plan, candidateRoot: unreviewed.candidateRoot, proofManifestPath: unreviewed.manifestPath }), /TARGET_META_DELTA_REQUIRES_CURRENT_R1_META_PASS/);
  } finally { fs.rmSync(unreviewed.root, { recursive: true, force: true }); }

  const staleCandidate = fixture({ candidateSubUnitKey: 'M3-U01-STALE' });
  try {
    await assert.rejects(buildExistingTargetMerge({ root: staleCandidate.root, assignment: staleCandidate.assignment, plan: staleCandidate.plan, candidateRoot: staleCandidate.candidateRoot, proofManifestPath: staleCandidate.manifestPath }), /CANDIDATE_META_SOURCE_PARITY_MISMATCH/);
  } finally { fs.rmSync(staleCandidate.root, { recursive: true, force: true }); }
});

test('separate preparation and registration CLIs validate proofs, default to dry-run, and apply only with --apply', () => {
  const f = fixture();
  try {
    const prepareCli = fileURLToPath(new URL('./prepare-existing-target-registration-update.mjs', import.meta.url));
    const applyCli = fileURLToPath(new URL('./register-existing-target-exam-update.mjs', import.meta.url));
    const assignmentPath = 'archive/analysis/run-fixture/assignment.json';
    write(f.root, assignmentPath, JSON.stringify(f.assignment));
    const planPath = 'archive/analysis/run-fixture/cli-update-plan.json';
    const prepared = JSON.parse(execFileSync(process.execPath, [prepareCli, '--root', f.root, '--assignment', assignmentPath, '--candidate-root', f.candidateRoot, '--proof-manifest', f.manifestPath, '--output', planPath], { encoding: 'utf8' }));
    assert.equal(prepared.status, 'UPDATE_CANDIDATE_READY_NOT_APPLIED');
    const commonArgs = ['--root', f.root, '--assignment', assignmentPath, '--plan', planPath, '--plan-sha256', prepared.outputSha256, '--candidate-root', f.candidateRoot, '--proof-manifest', f.manifestPath];
    const dryRun = JSON.parse(execFileSync(process.execPath, [applyCli, ...commonArgs, '--output-dir', '.tmp/archive/run-fixture/demo/cli-dry-run'], { encoding: 'utf8' }));
    assert.equal(dryRun.status, 'MERGE_VALIDATED_NOT_APPLIED');
    assert.equal(dryRun.sharedFilesWritten, false);
    const applied = JSON.parse(execFileSync(process.execPath, [applyCli, ...commonArgs, '--output-dir', '.tmp/archive/run-fixture/demo/cli-apply', '--apply'], { encoding: 'utf8' }));
    assert.equal(applied.status, 'APPLIED_PENDING_VALIDATORS');
    assert.equal(applied.sharedFilesWritten, true);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('applies only after explicit authorization and preserves all non-target records and runtime tuples', async () => {
  const f = fixture();
  try {
    const base = JSON.parse(fs.readFileSync(path.join(f.root, 'archive/data/question_identity_map.json'), 'utf8'));
    const merge = await buildExistingTargetMerge({ root: f.root, assignment: f.assignment, plan: f.plan, candidateRoot: f.candidateRoot, proofManifestPath: f.manifestPath });
    const result = applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/apply', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath, apply: true });
    assert.equal(result.receipt.status, 'APPLIED_PENDING_VALIDATORS');
    assert.equal(result.receipt.apply.sharedFilesWritten, true);
    const after = JSON.parse(fs.readFileSync(path.join(f.root, 'archive/data/question_identity_map.json'), 'utf8'));
    assert.deepEqual(after.records.filter(row => row.sourceArchiveFile === nonTarget), base.records.filter(row => row.sourceArchiveFile === nonTarget));
    assert.equal(after.records.find(row => row.questionUid === qUid).sourceFingerprint, f.currentFingerprint);
    assert.equal(JSON.parse(fs.readFileSync(path.join(f.root, 'archive/analysis/run-fixture/original-R1.json'), 'utf8')).historicalProof, 'preserve');
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects registry baseline drift before applying and rolls back only writes it started', async () => {
  const f = fixture();
  try {
    const merge = await buildExistingTargetMerge({ root: f.root, assignment: f.assignment, plan: f.plan, candidateRoot: f.candidateRoot, proofManifestPath: f.manifestPath });
    const changedPath = path.join(f.root, 'archive/data/question_metadata.json');
    const original = fs.readFileSync(changedPath);
    fs.writeFileSync(changedPath, Buffer.concat([original, Buffer.from(' ')]));
    assert.throws(() => applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/drift', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath, apply: true }), /APPLY_BASELINE_CHANGED/);
    fs.writeFileSync(changedPath, original);
    const before = Object.fromEntries(REGISTRY_PATHS.map(relative => [relative, hash(fs.readFileSync(path.join(f.root, relative)))]));
    let renames = 0;
    assert.throws(() => applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/rollback', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath, apply: true, renameFile: (from, to) => { renames++; if (renames === 2) throw new Error('fixture injected rename failure'); return fs.renameSync(from, to); } }), /fixture injected rename failure/);
    for (const relative of REGISTRY_PATHS) assert.equal(hash(fs.readFileSync(path.join(f.root, relative))), before[relative]);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects source or released-asset drift after merge planning and before any write', async () => {
  const f = fixture();
  try {
    const merge = await buildExistingTargetMerge({ root: f.root, assignment: f.assignment, plan: f.plan, candidateRoot: f.candidateRoot, proofManifestPath: f.manifestPath });
    const sourcePath = path.join(f.root, 'archive/exams', f.target);
    const originalSource = fs.readFileSync(sourcePath);
    fs.writeFileSync(sourcePath, Buffer.concat([originalSource, Buffer.from(' ')]));
    assert.throws(() => applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/source-drift', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath, apply: true }), /SOURCE_CHANGED_BEFORE_APPLY/);
    fs.writeFileSync(sourcePath, originalSource);
    const assetPath = path.join(f.root, 'archive/assets/images/demo.svg');
    const originalAsset = fs.readFileSync(assetPath);
    fs.writeFileSync(assetPath, Buffer.concat([originalAsset, Buffer.from(' ')]));
    assert.throws(() => applyExistingTargetOutputs({ root: f.root, outputDir: '.tmp/archive/run-fixture/demo/asset-drift', outputs: merge.outputs, plan: f.plan, receipt: merge.receipt, assignment: f.assignment, proofManifestPath: f.manifestPath, apply: true }), /ASSET_CHANGED_BEFORE_APPLY/);
    assert.equal(fs.existsSync(path.join(f.root, '.tmp/archive/run-fixture/demo/asset-drift')), false);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test('rejects caller-supplied arbitrary stage proof hashes that do not pass current validators', () => {
  const f = fixture();
  try {
    const badManifest = { ...f.proofManifest, proofs: f.proofManifest.proofs.map(row => row.stage === 'R2' ? { ...row, sha256: '0'.repeat(64) } : row) };
    const bytes = Buffer.from(JSON.stringify(badManifest));
    const manifestPath = 'archive/analysis/run-fixture/bad-proof-set.json';
    write(f.root, manifestPath, bytes);
    f.assignment.currentStageProofManifestPath = manifestPath;
    f.assignment.currentStageProofManifestSha256 = hash(bytes);
    assert.throws(() => validateCurrentProofChain({ root: f.root, assignment: f.assignment, proofManifest: badManifest, proofManifestPath: manifestPath }), /CURRENT_STAGE_PROOF_SHA_MISMATCH/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});
