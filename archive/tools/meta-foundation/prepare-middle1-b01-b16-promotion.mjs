#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const relRoot = 'archive/_generated/intelligence/phase1/middle1-foundation';
const globalRel = `${relRoot}/global`;
const abs = (p) => path.join(root, p);
const readJson = (p) => JSON.parse(fs.readFileSync(abs(p), 'utf8'));
const readJsonl = (p) => fs.readFileSync(abs(p), 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(abs(p))).digest('hex');
const fail = (x) => { throw new Error(x); };

const progress = readJson(`${relRoot}/M1_PROGRESS.json`);
const inventory = readJson(`${relRoot}/M1_EXAM_INVENTORY_31.json`);
const identity = readJson('archive/data/question_identity_map.json');
const metadata = readJson('archive/data/question_metadata.json');
const registry = readJson(`${relRoot}/M1_CUMULATIVE_TAXONOMY_REGISTRY.json`);
const promotionReceiptPath = `${globalRel}/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json`;
const promotionReceipt = fs.existsSync(abs(promotionReceiptPath)) ? readJson(promotionReceiptPath) : null;
const ids = new Map(identity.records.map((r) => [r.questionUid, r]));
const metas = new Map(metadata.records.map((r) => [r.questionUid, r]));
const errors = [];
const rows = [];
const batches = [];
const seenUid = new Set();
const seenSource = new Set();

for (let batchNo = 1; batchNo <= 16; batchNo += 1) {
  const exam = inventory.exams.find((e) => e.batchNo === batchNo) || fail(`inventory batch ${batchNo}`);
  const progressRow = progress.batches.find((e) => e.batchNo === batchNo) || fail(`progress batch ${batchNo}`);
  const base = exam.artifactPath;
  const inv = readJson(`${base}/INVENTORY.json`);
  const semantic = readJsonl(`${base}/CONSENSUS.jsonl`);
  const difficulty = readJsonl(`${base}/DIFFICULTY_FINAL.jsonl`);
  const receipt = readJson(`${base}/WRITEBACK_RECEIPT.json`);
  const validation = readJson(`${base}/VALIDATION.json`);
  const byDiff = new Map(difficulty.map((d) => [d.questionUid, d]));
  const sourceFile = `archive/exams/${exam.sourceArchiveFile}`;
  const sourceSha = sha(sourceFile);
  const promotedFile = promotionReceipt?.fileReceipts?.find((r) => r.batchNo === batchNo);
  const receiptClosure = receipt.closureQuestionCount ?? receipt.questionCount;
  for (const [name, count] of [
    ['inventory', exam.questionRowCount], ['semantic', semantic.length],
    ['difficulty', difficulty.length], ['writebackClosure', receiptClosure],
    ['validatorInput', validation.counts.inputRows], ['progress', progressRow.denominator],
  ]) if (count !== exam.questionRowCount) errors.push(`B${batchNo}:${name}:${count}/${exam.questionRowCount}`);
  if (inv.batchNo !== batchNo || receipt.batchNo !== batchNo || validation.batchNo !== batchNo) errors.push(`B${batchNo}:number`);
  if (validation.failures.length || !validation.status.startsWith('SCOPED_BATCH_CLOSED')) errors.push(`B${batchNo}:validator`);
  if (receipt.changedQuestionCount + (receipt.routeOutSkippedCount || 0) + (receipt.holdSkippedCount || 0) !== exam.questionRowCount) errors.push(`B${batchNo}:writebackPartition`);
  if (sourceSha !== receipt.writtenSourceSha256 && !(promotedFile?.beforeSha256 === receipt.writtenSourceSha256 && promotedFile?.afterSha256 === sourceSha)) errors.push(`B${batchNo}:sourceSha`);
  if (new Set(semantic.map((r) => r.questionUid)).size !== semantic.length || byDiff.size !== difficulty.length) errors.push(`B${batchNo}:localDuplicateUid`);
  for (const s of semantic) {
    const d = byDiff.get(s.questionUid);
    const id = ids.get(s.questionUid);
    const meta = metas.get(s.questionUid);
    const sourceIdentity = `${s.sourceArchiveFile}#${s.sourceOrdinal}`;
    if (!d || !id || !meta) errors.push(`B${batchNo}:missingJoin:${s.questionUid}`);
    if (seenUid.has(s.questionUid)) errors.push(`duplicateUid:${s.questionUid}`);
    if (seenSource.has(sourceIdentity)) errors.push(`duplicateSource:${sourceIdentity}`);
    seenUid.add(s.questionUid); seenSource.add(sourceIdentity);
    if (s.sourceArchiveFile !== exam.sourceArchiveFile || id?.sourceArchiveFile !== s.sourceArchiveFile || id?.sourceOrdinal !== s.sourceOrdinal || meta?.sourceArchiveFile !== s.sourceArchiveFile || meta?.sourceOrdinal !== s.sourceOrdinal) errors.push(`identity:${s.questionUid}`);
    if (s.sourceFingerprint !== id?.sourceFingerprint || s.sourceFingerprint !== meta?.sourceFingerprint || s.sourceFingerprint !== d?.sourceFingerprint) errors.push(`fingerprint:${s.questionUid}`);
    if (d?.sourceOrdinal !== s.sourceOrdinal) errors.push(`difficultyOrdinal:${s.questionUid}`);
    rows.push({
      batchNo, questionUid: s.questionUid, sourceArchiveFile: s.sourceArchiveFile,
      sourceOrdinal: s.sourceOrdinal, sourceFingerprint: s.sourceFingerprint,
      sourceIdentityFingerprint: s.sourceIdentityFingerprint,
      inputBundleSha: s.inputBundleSha, contentHash: s.contentHash,
      choicesHash: s.choicesHash, solutionHash: s.solutionHash,
      reviewStatus: s.reviewStatus, standardUnitKey: s.standardUnitKey,
      subUnitKey: s.subUnitKey, primaryMethod: s.primaryMethod,
      decisiveStep: s.decisiveStep, semanticReason: s.semanticReason,
      problemTypeKey: s.problemTypeKey, l3SemanticReason: s.l3SemanticReason,
      templateKey: s.templateKey, l4SemanticReason: s.l4SemanticReason,
      crossConceptKeys: s.crossConceptKeys || [], crossConceptReasons: s.crossConceptReasons || [],
      conditionKeys: s.conditionKeys || [], conditionReasons: s.conditionReasons || [],
      integrationPattern: s.integrationPattern,
      difficultyBucket: d?.difficultyBucket, difficultyConfidence: d?.difficultyConfidence,
      difficultyBoundaryFlag: d?.difficultyBoundaryFlag,
      legacyLevelCompatibility: d?.legacyLevelCompatibility,
      difficultyReviewStatus: d?.reviewStatus,
    });
  }
  batches.push({batchNo, sourceArchiveFile: exam.sourceArchiveFile, questionCount: semantic.length,
    uniqueUidCount: new Set(semantic.map((r) => r.questionUid)).size,
    consensusSha256: sha(`${base}/CONSENSUS.jsonl`),
    difficultySha256: sha(`${base}/DIFFICULTY_FINAL.jsonl`),
    writebackSha256: sha(`${base}/WRITEBACK_RECEIPT.json`),
    validationSha256: sha(`${base}/VALIDATION.json`),
    sourceJsSha256: receipt.writtenSourceSha256, artifactPath: base});
}

const mapped = rows.filter((r) => !['HOLD', 'ROUTE_OUT', 'SOURCE_BLOCK'].includes(r.reviewStatus));
const hold = rows.filter((r) => r.reviewStatus === 'HOLD');
const routeOut = rows.filter((r) => r.reviewStatus === 'ROUTE_OUT');
const unique = (values) => [...new Set(values)].sort();
const output = {
  schemaVersion: 'm1-b01-b16-global-compression-input-v1',
  sourceBranch: 'codex/meta-foundation/middle1', sourceHead: '011fc49279d24503b0162c5612f03add8a68a12c',
  baseMainSha: inventory.baseMainSha,
  counts: {batches: batches.length, rawRows: rows.length, uniqueUid: seenUid.size,
    uniqueSourceIdentity: seenSource.size, mappedRows: mapped.length,
    semanticHold: hold.length, routeOut: routeOut.length,
    candidateL3: unique(mapped.map((r) => r.problemTypeKey)).length,
    candidateL4: unique(mapped.map((r) => r.templateKey)).length,
    candidateCrossConcept: unique(mapped.flatMap((r) => r.crossConceptKeys)).length,
    difficultyCovered: rows.filter((r) => Number.isInteger(r.difficultyBucket) || r.difficultyBucket === 'UNKNOWN').length,
    writebackChanged: batches.reduce((n, b) => n + readJson(`${b.artifactPath}/WRITEBACK_RECEIPT.json`).changedQuestionCount, 0)},
  registryCounts: registry.counts,
  batches, rows, failures: errors,
};
fs.mkdirSync(abs(globalRel), {recursive:true});
fs.writeFileSync(abs(`${globalRel}/B01_B16_GLOBAL_COMPRESSION_INPUT.json`), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({counts: output.counts, failures: errors.slice(0, 20), failureCount: errors.length}, null, 2));
if (errors.length) process.exitCode = 1;
