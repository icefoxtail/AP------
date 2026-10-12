import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { readExam, sha256, writeFresh, artifactSnapshot } from '../../../tools/archive-codex-artifact-io.mjs';
import { gitBlobSha } from '../../../tools/archive-stage-validator-compat-v1.mjs';
import core from '../../../archive2-core.js';
import {
  makeTargetIdentityRows,
  makeTargetMetadataRows,
  verifyR1EvidenceBinding,
} from '../../../tools/prepare-target-registration-candidate.mjs';

const uid = '24_순천고_1학기_중간_고2_수학I';
const runId = 'codex-h2-1mid-20261010-batch-20261011';
const root = path.resolve(import.meta.dirname, '../../../..');
const relativeSource = `archive/exams/original/high/h2/1mid/${uid}.js`;
const sourceFile = path.join(root, relativeSource);
const sourceOnlyEvidencePath = 'archive/analysis/source-only-h2-1mid-20261010-b2/24_순천고_1학기_중간_고2_수학I.evidence.json';
const createEvidencePath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/CREATE_20261011_CODEX/CREATE.evidence.final-bound.json';
const r1EvidencePath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R1_20261011_CODEX/R1.evidence.json';
const r1ValidationPath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R1_20261011_CODEX/R1.generic-validator.raw.json';
const r2EvidencePath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R2_20261011_CODEX/R2.evidence.json';
const r2ValidationPath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R2_20261011_CODEX/R2.generic-validator.raw.json';
const r3EvidencePath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R3_20261011_CODEX/R3.evidence.durable.json';
const r3ValidationPath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R3_20261011_CODEX/R3.generic-validator.durable.raw.json';
const renderReceiptPath = 'archive/analysis/h2-1mid-20261010-codex/24_순천고_1학기_중간_고2_수학I/R3_20261011_CODEX/R3.render-receipt.durable.json';
const rosterPath = 'archive/analysis/h2-1mid-20261010-codex/ROOT.locked-roster.json';
const publicationDir = path.join(root, 'archive/analysis', uid, 'publication');
const assignmentPath = path.join(publicationDir, 'registration-assignment.current-source.json');
const proofManifestPath = path.join(publicationDir, 'current-stage-proof-set.current-source.json');
const candidateRoot = path.join(root, '.tmp/archive', runId, uid, 'candidate-root.registration-current');

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const physical = relative => ({ path: relative, sha256: sha256(fs.readFileSync(path.join(root, relative))) });
const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (head !== '3cc491eb512b979b3b42fdc5503444b32bf4e2ff') throw new Error(`PUBLICATION_HEAD_DRIFT:${head}`);
if (!fs.existsSync(path.join(candidateRoot, 'archive/data/question_identity_map.json')) || !fs.existsSync(path.join(candidateRoot, 'archive/exams'))) throw new Error('PREPARED_CANDIDATE_ROOT_REQUIRED');

const roster = readJson(path.join(root, rosterPath));
const rosterRow = roster.roster.find(row => row.examUid === uid);
if (!rosterRow || rosterRow.productionPath !== relativeSource) throw new Error('LOCKED_ROSTER_TARGET_MISMATCH');
const sourceOnly = readJson(path.join(root, sourceOnlyEvidencePath));
const sourceBytes = fs.readFileSync(sourceFile);
const exam = readExam(sourceFile);
const sourceRawSha256 = sha256(sourceBytes);
const sourceGitBlobSha1 = gitBlobSha(sourceBytes);
if (sourceRawSha256 !== '8c403b10678e331f5c613f093e14aa6d42b95cccd9a1a160751f828453ce3933' || sourceGitBlobSha1 !== '594665e575b3ff0bcfe8af9469cf79bd1c5ff418') throw new Error('CURRENT_TARGET_SOURCE_BINDING_MISMATCH');
if (sourceOnly.source?.sha256 && sourceOnly.source.sha256 !== rosterRow.sourceRawSha256) throw new Error('SOURCE_ONLY_BASELINE_BINDING_MISMATCH');

const r1Report = readJson(path.join(root, r1ValidationPath));
const releaseSnapshot = artifactSnapshot({
  sourceFile,
  evidenceFile: path.join(root, r3EvidencePath),
  assetRoot: path.join(root, 'archive'),
  questions: exam.questions,
});
if (releaseSnapshot.issues.length) throw new Error(`CURRENT_RELEASE_ASSET_SET_INVALID:${releaseSnapshot.issues.join('|')}`);
const assignment = {
  runId,
  examUid: uid,
  productionRelativePath: relativeSource,
  expectedHead: head,
  artifactRawSha256: sourceRawSha256,
  validatorRawBufferBlobSha1: sourceGitBlobSha1,
  questionCount: exam.questions.length,
  releaseAssets: releaseSnapshot.assets.map(asset => ({ ref: asset.ref, sha256: asset.sha256 })),
  lockedRosterPath: rosterPath,
  lockedRosterSha256: sha256(fs.readFileSync(path.join(root, rosterPath))),
  sourceOnlyEvidencePath,
  sourceOnlyEvidenceSha256: sha256(fs.readFileSync(path.join(root, sourceOnlyEvidencePath))),
  r1EvidencePath,
  r1EvidenceSha256: sha256(fs.readFileSync(path.join(root, r1EvidencePath))),
  r1EvidenceReferencePath: r1Report.evidenceRef,
  r1ValidationPath,
  r1ValidationSha256: sha256(fs.readFileSync(path.join(root, r1ValidationPath))),
  r2EvidencePath,
  r2EvidenceSha256: sha256(fs.readFileSync(path.join(root, r2EvidencePath))),
  r2ValidationPath,
  r2ValidationSha256: sha256(fs.readFileSync(path.join(root, r2ValidationPath))),
  r3EvidencePath,
  r3EvidenceSha256: sha256(fs.readFileSync(path.join(root, r3EvidencePath))),
  r3ValidationPath,
  r3ValidationSha256: sha256(fs.readFileSync(path.join(root, r3ValidationPath))),
  renderReceiptPath,
  renderReceiptSha256: sha256(fs.readFileSync(path.join(root, renderReceiptPath))),
};

const proofManifest = {
  schemaVersion: 'JS_ARCHIVE_CURRENT_STAGE_PROOF_SET_V1',
  runId,
  examUid: uid,
  productionRelativePath: relativeSource,
  artifactRawSha256: sourceRawSha256,
  artifactBlobSha1: sourceGitBlobSha1,
  proofs: [
    { stage: 'R1', path: r1EvidencePath, sha256: assignment.r1EvidenceSha256 },
    { stage: 'R2', path: r2EvidencePath, sha256: assignment.r2EvidenceSha256 },
    { stage: 'R3', path: r3EvidencePath, sha256: assignment.r3EvidenceSha256 },
  ],
  originalProofs: [
    { path: sourceOnlyEvidencePath, sha256: assignment.sourceOnlyEvidenceSha256 },
    { path: createEvidencePath, sha256: physical(createEvidencePath).sha256 },
    { path: r1EvidencePath, sha256: assignment.r1EvidenceSha256 },
    { path: r1ValidationPath, sha256: assignment.r1ValidationSha256 },
    { path: r2EvidencePath, sha256: assignment.r2EvidenceSha256 },
    { path: r2ValidationPath, sha256: assignment.r2ValidationSha256 },
    { path: r3EvidencePath, sha256: assignment.r3EvidenceSha256 },
    { path: r3ValidationPath, sha256: assignment.r3ValidationSha256 },
    { path: renderReceiptPath, sha256: assignment.renderReceiptSha256 },
  ],
};
assignment.currentStageProofManifestPath = path.relative(root, proofManifestPath).replaceAll('\\', '/');
assignment.currentStageProofManifestSha256 = sha256(Buffer.from(JSON.stringify(proofManifest, null, 2) + '\n', 'utf8'));
const assignmentBytes = Buffer.from(JSON.stringify(assignment, null, 2) + '\n', 'utf8');
const proofBytes = Buffer.from(JSON.stringify(proofManifest, null, 2) + '\n', 'utf8');
const writeOrVerifyFresh = (file, bytes, expectedSha) => {
  if (fs.existsSync(file)) {
    const actualSha = sha256(fs.readFileSync(file));
    if (actualSha !== expectedSha) throw new Error(`EXISTING_ASSIGNMENT_BYTES_DIFFER:${path.relative(root, file)}`);
    return { path: file, sha256: actualSha };
  }
  return writeFresh(file, JSON.parse(bytes.toString('utf8')));
};
const assignmentRef = writeOrVerifyFresh(assignmentPath, assignmentBytes, sha256(assignmentBytes));
const proofRef = writeOrVerifyFresh(proofManifestPath, proofBytes, assignment.currentStageProofManifestSha256);
if (proofRef.sha256 !== assignment.currentStageProofManifestSha256) throw new Error('PROOF_MANIFEST_WRITE_SHA_MISMATCH');

fs.mkdirSync(candidateRoot, { recursive: true });
const candidateArchive = path.join(candidateRoot, 'archive');
fs.mkdirSync(candidateArchive, { recursive: true });

for (const relative of [
  'db.js', 'archive2-core.js', 'problem-bank-meta.js', 'question-index.js', 'question-index-report.md',
  'question-index-audit.md', 'question-identity.js',
  'tools/build-question-index.mjs', 'tools/build-archive2-catalog.mjs',
]) {
  const source = path.join(root, 'archive', relative), target = path.join(candidateArchive, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

const sourceFileNormalized = core.normalizeFile(relativeSource.replace(/^archive\/exams\//, ''));
const identityBase = readJson(path.join(candidateArchive, 'data/question_identity_map.json'));
const oldTargetIdentity = identityBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFileNormalized);
const identityRows = makeTargetIdentityRows(sourceFileNormalized, exam.questions);
const oldTargetIdentityOrdered = [...oldTargetIdentity].sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
for (let index = 0; index < identityRows.length; index++) identityRows[index].sourceQuestionNo = oldTargetIdentityOrdered[index]?.sourceQuestionNo;
if (oldTargetIdentity.length !== identityRows.length || identityRows.some((row, index) => row.questionUid !== oldTargetIdentity.sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal))[index]?.questionUid)) {
  throw new Error('EXISTING_TARGET_UID_IDENTITY_NOT_STABLE');
}
identityBase.records = [...identityBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFileNormalized), ...identityRows]
  .sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
fs.writeFileSync(path.join(candidateArchive, 'data/question_identity_map.json'), JSON.stringify(identityBase, null, 2) + '\n');

const identityHead = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const r1Binding = verifyR1EvidenceBinding({
  root,
  evidencePath: r1EvidencePath,
  validationPath: r1ValidationPath,
  assignment,
  examUid: uid,
  bank: exam.questions,
});
const metadataBase = readJson(path.join(candidateArchive, 'data/question_metadata.json'));
const metadataRows = makeTargetMetadataRows({
  sourceFile: sourceFileNormalized,
  bank: exam.questions,
  identityRows,
  r1EvidencePath,
  r1MetaDebtRows: r1Binding.metaDebtRows,
  r1MetaBindingPendingRows: [],
});
const existingTargetMetadataRows = metadataBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFileNormalized)
  .sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
const targetMetaFields = ['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','conceptClusterKey','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','curriculumKey','courseKey','L1','L2','L3','L4','secondaryConceptKeys','curriculumApplicability','projectionStatus'];
for (let index = 0; index < metadataRows.length; index++) {
  const sourceQuestion = exam.questions[index], currentRow = existingTargetMetadataRows[index], candidateRow = metadataRows[index];
  for (const field of targetMetaFields) {
    if ((!Object.prototype.hasOwnProperty.call(sourceQuestion, field) || sourceQuestion[field] === undefined) && Object.prototype.hasOwnProperty.call(currentRow, field)) {
      candidateRow[field] = JSON.parse(JSON.stringify(currentRow[field]));
    }
  }
}
metadataBase.records = [...metadataBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFileNormalized), ...metadataRows]
  .sort((a, b) => String(a.questionUid).localeCompare(String(b.questionUid), 'en'));
fs.writeFileSync(path.join(candidateArchive, 'data/question_metadata.json'), JSON.stringify(metadataBase, null, 2) + '\n');

execFileSync(process.execPath, [path.join(candidateArchive, 'tools/build-question-index.mjs')], {
  cwd: candidateRoot,
  env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: candidateArchive, GEOMETRY_REPO_ROOT: candidateRoot },
  stdio: 'inherit',
});
execFileSync(process.execPath, [path.join(candidateArchive, 'tools/build-archive2-catalog.mjs')], { cwd: candidateRoot, stdio: 'inherit' });

const indexWindow = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(candidateArchive, 'question-index.js'), 'utf8'), indexWindow, { timeout: 5000 });
const indexRows = (indexWindow.window.questionIndex || []).filter(row => core.normalizeFile(row.sourceFile) === sourceFileNormalized);
const catalog = core.decodeCatalog(readJson(path.join(candidateArchive, 'data/archive2-catalog.json')));
const catalogRows = catalog.records.filter(row => core.normalizeFile(row.sourceFile) === sourceFileNormalized);
if (indexRows.length !== exam.questions.length || catalogRows.length !== exam.questions.length) throw new Error('CANDIDATE_PROJECTION_DENOMINATOR_MISMATCH');
console.log(JSON.stringify({
  status: 'CANDIDATE_READY_FOR_EXISTING_TARGET_UPDATE_PLAN',
  root,
  head: identityHead,
  examUid: uid,
  questionCount: exam.questions.length,
  source: { path: relativeSource, rawSha256: sourceRawSha256, gitBlobSha1: sourceGitBlobSha1 },
  r1MetaDebtRows: r1Binding.metaDebtRows.length,
  currentStageProofManifest: { path: assignment.currentStageProofManifestPath, sha256: proofRef.sha256 },
  assignment: assignmentRef,
  candidateRoot: path.relative(root, candidateRoot).replaceAll('\\', '/'),
  candidateTargetRows: { identity: identityRows.length, metadata: metadataRows.length, index: indexRows.length, catalog: catalogRows.length },
  candidateEligibility: catalogRows.reduce((counts, row) => { const key = String(row.semanticDisposition || 'UNSET'); counts[key] = (counts[key] || 0) + 1; return counts; }, {}),
}));

