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

const uid = '24_강남여고_1학기_중간_고2_확률과통계';
const runId = 'codex-h2-1mid-20261010-batch-20261011';
const root = path.resolve(import.meta.dirname, '../../../..');
const relativeSource = `archive/exams/original/high/h2/1mid/${uid}.js`;
const sourceFile = path.join(root, relativeSource);
const sourceOnlyEvidencePath = `archive/analysis/source-only-h2-1mid-20261010/${uid}.evidence.json`;
const r1EvidencePath = `archive/analysis/${uid}/r1/r1-stage-evidence-final-complete.json`;
const r1ValidationPath = `archive/analysis/${uid}/r1/r1-generic-v2-report-final-complete.json`;
const r2EvidencePath = `archive/analysis/${uid}/r2-clean-20261011/r2-evidence.json`;
const r2ValidationPath = `archive/analysis/${uid}/r2-clean-20261011/r2-generic-validator.raw.json`;
const r3EvidencePath = `archive/analysis/${uid}/r3/r3-evidence.json`;
const r3ValidationPath = `archive/analysis/${uid}/r3/r3-generic-v2-report.raw.json`;
const renderReceiptPath = `archive/analysis/${uid}/r3/render/codex-render-receipt.json`;
const rosterPath = 'archive/analysis/h2-1mid-20261010-codex/ROOT.locked-roster.json';
const publicationDir = path.join(root, 'archive/analysis', uid, 'publication');
const assignmentPath = path.join(publicationDir, 'registration-assignment.json');
const proofManifestPath = path.join(publicationDir, 'current-stage-proof-set.json');
const candidateRoot = path.join(root, '.tmp/archive', runId, uid, 'candidate-root.rev3');

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const physical = relative => ({ path: relative, sha256: sha256(fs.readFileSync(path.join(root, relative))) });
const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (head !== '3cc491eb512b979b3b42fdc5503444b32bf4e2ff') throw new Error(`PUBLICATION_HEAD_DRIFT:${head}`);
if (fs.existsSync(candidateRoot)) throw new Error('FRESH_CANDIDATE_ROOT_REQUIRED');

const roster = readJson(path.join(root, rosterPath));
const rosterRow = roster.roster.find(row => row.examUid === uid);
if (!rosterRow || rosterRow.productionPath !== relativeSource) throw new Error('LOCKED_ROSTER_TARGET_MISMATCH');
const sourceOnly = readJson(path.join(root, sourceOnlyEvidencePath));
const sourceBytes = fs.readFileSync(sourceFile);
const exam = readExam(sourceFile);
const sourceRawSha256 = sha256(sourceBytes);
const sourceGitBlobSha1 = gitBlobSha(sourceBytes);
if (sourceRawSha256 !== 'ecee767fcb6acc72edf09d04f42fde304ab5d19ba3197aed8983eccce7548acd'
  || sourceGitBlobSha1 !== '07f19f63015354c56496ec101cee644e6e0ad91a') throw new Error('CURRENT_TARGET_SOURCE_BINDING_MISMATCH');
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
    { path: `archive/analysis/${uid}/create/create-evidence-final.json`, sha256: physical(`archive/analysis/${uid}/create/create-evidence-final.json`).sha256 },
    { path: r1ValidationPath, sha256: assignment.r1ValidationSha256 },
    { path: r2ValidationPath, sha256: assignment.r2ValidationSha256 },
    { path: r3ValidationPath, sha256: assignment.r3ValidationSha256 },
    { path: renderReceiptPath, sha256: assignment.renderReceiptSha256 },
    { path: `archive/analysis/${uid}/r2/r2-failed-prefreeze-assignment-hint.json`, sha256: physical(`archive/analysis/${uid}/r2/r2-failed-prefreeze-assignment-hint.json`).sha256 },
    { path: `archive/analysis/${uid}/r1/r1-failed-visual-binding-attempt-source.js`, sha256: physical(`archive/analysis/${uid}/r1/r1-failed-visual-binding-attempt-source.js`).sha256 },
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
for (const relative of ['data', 'exams']) fs.cpSync(path.join(root, 'archive', relative), path.join(candidateArchive, relative), { recursive: true });
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
