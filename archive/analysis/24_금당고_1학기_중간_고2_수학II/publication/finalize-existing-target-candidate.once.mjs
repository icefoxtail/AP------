import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { readExam, sha256 } from '../../../tools/archive-codex-artifact-io.mjs';
import { gitBlobSha } from '../../../tools/archive-stage-validator-compat-v1.mjs';
import core from '../../../archive2-core.js';
import { makeTargetIdentityRows, makeTargetMetadataRows, verifyR1EvidenceBinding } from '../../../tools/prepare-target-registration-candidate.mjs';

const uid = '24_금당고_1학기_중간_고2_수학II';
const runId = 'codex-h2-1mid-20261010-batch-20261011';
const root = path.resolve(import.meta.dirname, '../../../..');
const relativeSource = `archive/exams/original/high/h2/1mid/${uid}.js`;
const sourceFile = path.join(root, relativeSource);
const publicationDir = path.join(root, 'archive/analysis', uid, 'publication');
const assignment = JSON.parse(fs.readFileSync(path.join(publicationDir, 'registration-assignment.json'), 'utf8'));
const proofManifest = JSON.parse(fs.readFileSync(path.join(publicationDir, 'current-stage-proof-set.json'), 'utf8'));
const candidateRoot = path.join(root, '.tmp/archive', runId, uid, 'candidate-root.rev8');
const candidateArchive = path.join(candidateRoot, 'archive');
const sourceFileNormalized = core.normalizeFile(relativeSource.replace(/^archive\/exams\//, ''));
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));

const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (head !== assignment.expectedHead || head !== '3cc491eb512b979b3b42fdc5503444b32bf4e2ff') throw new Error('CURRENT_PUBLICATION_HEAD_MISMATCH');
const exam = readExam(sourceFile);
if (sha256(exam.bytes) !== assignment.artifactRawSha256 || gitBlobSha(exam.bytes) !== assignment.validatorRawBufferBlobSha1) throw new Error('CURRENT_ASSIGNMENT_SOURCE_MISMATCH');
if (proofManifest.runId !== assignment.runId || proofManifest.examUid !== uid || proofManifest.artifactRawSha256 !== assignment.artifactRawSha256) throw new Error('CURRENT_STAGE_PROOF_MANIFEST_MISMATCH');

const r1Binding = verifyR1EvidenceBinding({
  root,
  evidencePath: assignment.r1EvidencePath,
  validationPath: assignment.r1ValidationPath,
  assignment,
  examUid: uid,
  bank: exam.questions,
});
const identityBasePath = path.join(candidateArchive, 'data/question_identity_map.json');
const metadataBasePath = path.join(candidateArchive, 'data/question_metadata.json');
const identityBase = readJson(identityBasePath);
const metadataBase = readJson(metadataBasePath);
const identityRows = makeTargetIdentityRows(sourceFileNormalized, exam.questions);
for (const row of identityRows) {
  if (typeof row.sourceQuestionNo === 'string' && /^\d+$/.test(row.sourceQuestionNo)) row.sourceQuestionNo = Number(row.sourceQuestionNo);
}
const previousIdentityRows = identityBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) === sourceFileNormalized).sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
if (previousIdentityRows.length !== identityRows.length || identityRows.some((row, index) => row.questionUid !== previousIdentityRows[index].questionUid)) throw new Error('TARGET_QUESTION_UIDS_NOT_PRESERVED');
identityBase.records = [...identityBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFileNormalized), ...identityRows]
  .sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
fs.writeFileSync(identityBasePath, JSON.stringify(identityBase, null, 2) + '\n');

const metadataRows = makeTargetMetadataRows({
  sourceFile: sourceFileNormalized,
  bank: exam.questions,
  identityRows,
  r1EvidencePath: assignment.r1EvidencePath,
  r1MetaDebtRows: r1Binding.metaDebtRows,
  r1MetaBindingPendingRows: [],
});
const physicalMetaFields = [
  'standardCourse', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit',
  'conceptClusterKey', 'problemTypeKey', 'templateKey', 'difficultyBucket', 'difficultyConfidence',
  'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability',
];
for (const row of metadataRows) {
  const ordinal = Number(row.sourceOrdinal);
  const question = exam.questions[ordinal - 1];
  const previous = metadataBase.records.find(existing => core.normalizeFile(existing.sourceArchiveFile) === sourceFileNormalized
    && Number(existing.sourceOrdinal) === ordinal);
  for (const field of physicalMetaFields) {
    if (!Object.prototype.hasOwnProperty.call(question, field) && Object.prototype.hasOwnProperty.call(row, field)) {
      if (previous && Object.prototype.hasOwnProperty.call(previous, field)) row[field] = previous[field];
      else delete row[field];
    }
  }
}
metadataBase.records = [...metadataBase.records.filter(row => core.normalizeFile(row.sourceArchiveFile) !== sourceFileNormalized), ...metadataRows]
  .sort((a, b) => String(a.questionUid).localeCompare(String(b.questionUid), 'en'));
fs.writeFileSync(metadataBasePath, JSON.stringify(metadataBase, null, 2) + '\n');

execFileSync(process.execPath, [path.join(candidateArchive, 'tools/build-question-index.mjs')], {
  cwd: candidateRoot,
  env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: candidateArchive, GEOMETRY_REPO_ROOT: candidateRoot },
  stdio: 'inherit',
});
execFileSync(process.execPath, [path.join(candidateArchive, 'tools/build-archive2-catalog.mjs')], { cwd: candidateRoot, stdio: 'inherit' });

const catalogPath = path.join(candidateArchive, 'data/archive2-catalog.json');
const catalogData = core.decodeCatalog(readJson(catalogPath));
delete catalogData.encoding;
delete catalogData.columns;
delete catalogData.strings;
const originalCatalog = core.decodeCatalog(readJson(path.join(root, 'archive/data/archive2-catalog.json')));
const originalCatalogByOrdinal = new Map(originalCatalog.records
  .filter(row => core.normalizeFile(row.sourceFile) === sourceFileNormalized)
  .map(row => [Number(row.sourceOrdinal), row]));
const metadataByOrdinal = new Map(metadataRows.map(row => [Number(row.sourceOrdinal), row]));
const directCatalogFields = [
  'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'conceptClusterKey',
  'problemTypeKey', 'templateKey', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag',
  'legacyLevelCompatibility', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
  'curriculumKey', 'courseKey', 'L1', 'L2', 'L3', 'L4', 'secondaryConceptKeys', 'curriculumApplicability',
];
for (const row of catalogData.records) {
  if (core.normalizeFile(row.sourceFile) !== sourceFileNormalized) continue;
  const metadata = metadataByOrdinal.get(Number(row.sourceOrdinal));
  const question = exam.questions[Number(row.sourceOrdinal) - 1];
  const original = originalCatalogByOrdinal.get(Number(row.sourceOrdinal));
  if (!metadata) throw new Error(`CATALOG_METADATA_ORDINAL_MISSING:q${row.sourceOrdinal}`);
  for (const field of directCatalogFields) {
    if (!Object.prototype.hasOwnProperty.call(question, field) || !Object.prototype.hasOwnProperty.call(metadata, field)) continue;
    const value = metadata[field];
    const meaningful = value !== null && value !== undefined
      && !(typeof value === 'string' && value.trim() === '')
      && !(Array.isArray(value) && value.length === 0);
    if (meaningful || Object.prototype.hasOwnProperty.call(original || {}, field)) row[field] = value;
  }
}
fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2) + '\n');

const indexWindow = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(candidateArchive, 'question-index.js'), 'utf8'), indexWindow, { timeout: 5000 });
const indexRows = indexWindow.window.questionIndex.filter(row => core.normalizeFile(row.sourceFile) === sourceFileNormalized);
const catalog = core.decodeCatalog(readJson(path.join(candidateArchive, 'data/archive2-catalog.json')));
const catalogRows = catalog.records.filter(row => core.normalizeFile(row.sourceFile) === sourceFileNormalized);
if (metadataRows.length !== exam.questions.length || indexRows.length !== exam.questions.length || catalogRows.length !== exam.questions.length) throw new Error('CANDIDATE_FULL_DENOMINATOR_MISMATCH');
console.log(JSON.stringify({
  status: 'EXISTING_TARGET_CANDIDATE_READY',
  examUid: uid,
  questionCount: exam.questions.length,
  rawSha256: assignment.artifactRawSha256,
  blobSha1: assignment.validatorRawBufferBlobSha1,
  r1MetaDebtQids: r1Binding.metaDebtRows.map(row => Number(row.qid)),
  targetRows: { identity: identityRows.length, metadata: metadataRows.length, index: indexRows.length, catalog: catalogRows.length },
  candidateRoot: path.relative(root, candidateRoot).replaceAll('\\', '/'),
  candidateRegistryHashes: Object.fromEntries(['archive/data/question_identity_map.json', 'archive/data/question_metadata.json', 'archive/question-index.js', 'archive/data/archive2-catalog.json'].map(file => [file, sha256(fs.readFileSync(path.join(candidateRoot, file)))])),
}));
