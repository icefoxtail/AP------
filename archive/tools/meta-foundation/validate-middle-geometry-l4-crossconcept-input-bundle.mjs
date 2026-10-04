import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Source from '../../archive2-source.js';

const ROOT = process.cwd();
const dir = path.join(ROOT, 'archive/data/meta-foundation/evidence/middle-geometry/v1');
const bundlePath = path.join(dir, 'l4_crossconcept_decision_input_bundle_928.json');
const l3Path = path.join(dir, 'l3_semantic_final_928.json');
const reportPath = path.join(dir, 'l4_crossconcept_input_bundle_validation.json');

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const normalize = value => value.replace(/\r\n/g, '\n');
const digestText = value => crypto.createHash('sha256').update(value).digest('hex');
const fail = (code, message, details = {}) => ({code, message, details});
const failures = [];
const l3 = readJson(l3Path);
const bundle = readJson(bundlePath);
const l3ByUid = new Map(l3.records.map(r => [r.questionUid, r]));

const forbiddenTopKeys = ['templateKey', 'l4DecisionStatus', 'crossConceptKeys', 'crossConceptEvidence', 'candidateTemplateKey', 'templateHintKey', 'crossConceptHints', 'relationalMetadata'];
for (const key of forbiddenTopKeys) {
  if (Object.hasOwn(bundle, key)) failures.push(fail('FORBIDDEN_CANDIDATE_INPUT', 'bundle top-level contains forbidden semantic decision field', {key}));
}
if (bundle.status !== 'SOURCE_AND_SOLUTION_INPUT_FROZEN') failures.push(fail('INVALID_BUNDLE_STATUS', 'input bundle status is not frozen'));
if (bundle.records.length !== 928) failures.push(fail('DENOMINATOR_MISMATCH', 'bundle rows must equal 928', {actual: bundle.records.length}));
if (bundle.denominator?.mapped !== 921 || bundle.denominator?.routeOut !== 7) failures.push(fail('DENOMINATOR_MISMATCH', 'bundle mapped/route-out mismatch', {denominator: bundle.denominator}));

const uidSet = new Set();
const sourceSet = new Set();
const banks = new Map();
for (const record of bundle.records) {
  const parent = l3ByUid.get(record.questionUid);
  if (!parent) {
    failures.push(fail('L3_PARENT_MISSING', 'bundle UID missing from L3 authority', {questionUid: record.questionUid}));
    continue;
  }
  uidSet.add(record.questionUid);
  sourceSet.add(record.sourceArchiveFile + '#' + record.sourceOrdinal);
  if (record.sourceFingerprint !== parent.sourceFingerprint) failures.push(fail('SOURCE_FINGERPRINT_MISMATCH', 'bundle/L3 fingerprint mismatch', {questionUid: record.questionUid}));
  if (record.problemTypeKey !== parent.problemTypeKey) failures.push(fail('L3_PARENT_MISMATCH', 'bundle L3 differs from final L3 authority', {questionUid: record.questionUid}));
  if (record.sourceReadStatus !== 'SOURCE_AND_SOLUTION_READ') failures.push(fail('MISSING_SOURCE_READ_STATUS', 'source read status missing', {questionUid: record.questionUid}));
  if (record.semanticReviewStatus !== 'READY_FOR_ISOLATED_SEMANTIC_DECISION') failures.push(fail('INVALID_SEMANTIC_STATUS', 'input bundle has invalid semantic status', {questionUid: record.questionUid}));
  for (const key of forbiddenTopKeys) if (Object.hasOwn(record, key)) failures.push(fail('FORBIDDEN_CANDIDATE_INPUT', 'bundle row contains forbidden candidate/decision field', {questionUid: record.questionUid, key}));
  const expectedBundleSha = digestText(JSON.stringify({
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceArchiveFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceQuestionNo: record.sourceQuestionNo,
    sourceFingerprint: record.sourceFingerprint,
    contentHash: record.contentHash,
    solutionHash: record.solutionHash,
    problemTypeKey: record.problemTypeKey
  }));
  if (record.inputBundleSha !== expectedBundleSha) failures.push(fail('INPUT_BUNDLE_HASH_MISMATCH', 'inputBundleSha mismatch', {questionUid: record.questionUid}));
  if (!banks.has(record.sourceArchiveFile)) {
    try {
      const relative = path.join('archive/exams', record.sourceArchiveFile);
      banks.set(record.sourceArchiveFile, Source.evaluate(normalize(fs.readFileSync(relative, 'utf8')), record.sourceArchiveFile));
    } catch (error) {
      failures.push(fail('SOURCE_LOAD_FAIL', 'source JS could not be loaded', {sourceArchiveFile: record.sourceArchiveFile, error: String(error)}));
      continue;
    }
  }
  const question = banks.get(record.sourceArchiveFile)?.[record.sourceOrdinal - 1];
  if (!question) {
    failures.push(fail('SOURCE_ORDINAL_MISSING', 'source ordinal missing', {questionUid: record.questionUid}));
    continue;
  }
  const actualFingerprint = await Source.fingerprint(question);
  const actualContentHash = digestText(JSON.stringify(question.content ?? null));
  const actualSolutionHash = digestText(JSON.stringify(question.solution ?? null));
  if (actualFingerprint !== record.sourceFingerprint) failures.push(fail('SOURCE_DRIFT', 'source fingerprint drift', {questionUid: record.questionUid, expected: record.sourceFingerprint, actual: actualFingerprint}));
  if (actualContentHash !== record.contentHash) failures.push(fail('CONTENT_HASH_MISMATCH', 'content hash mismatch', {questionUid: record.questionUid}));
  if (actualSolutionHash !== record.solutionHash) failures.push(fail('SOLUTION_HASH_MISMATCH', 'solution hash mismatch', {questionUid: record.questionUid}));
}
if (uidSet.size !== 928) failures.push(fail('UID_COVERAGE_FAIL', 'UID uniqueness/coverage failed', {actual: uidSet.size}));
if (sourceSet.size !== 928) failures.push(fail('SOURCE_COVERAGE_FAIL', 'source identity uniqueness/coverage failed', {actual: sourceSet.size}));

const report = {
  schemaVersion: 'middle-geometry-l4-crossconcept-input-bundle-validation-v1',
  status: failures.length ? 'FAIL' : 'PASS',
  bundlePath: 'archive/data/meta-foundation/evidence/middle-geometry/v1/l4_crossconcept_decision_input_bundle_928.json',
  authority: {
    l3: 'archive/data/meta-foundation/evidence/middle-geometry/v1/l3_semantic_final_928.json',
    source: 'archive/exams current source JS',
    excludedInputs: bundle.authority?.excludedInputs || []
  },
  rows: bundle.records.length,
  uidUnique: uidSet.size === 928,
  sourceIdentityUnique: sourceSet.size === 928,
  sourceFilesChecked: banks.size,
  failures
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
