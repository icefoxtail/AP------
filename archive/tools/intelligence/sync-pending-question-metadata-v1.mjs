import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const metadataPath = path.join(archiveDir, 'data', 'question_metadata.json');
const identityPath = path.join(archiveDir, 'data', 'question_identity_map.json');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalizeFile = value => String(value || '').normalize('NFC').replace(/\\/g, '/')
  .replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').trim();
const sourceFingerprint = q => sha256(JSON.stringify({
  content: q?.content ?? null,
  choices: Array.isArray(q?.choices) ? q.choices : null,
  answer: q?.answer ?? null,
  solution: q?.solution ?? null,
  image: q?.image ?? null
}));
const contentFingerprint = q => sha256(JSON.stringify({
  content: q?.content ?? null,
  choices: Array.isArray(q?.choices) ? q.choices : null,
  image: q?.image ?? null
}));
const text = value => String(value ?? '').trim();

const banks = new Map();
function loadBank(sourceFile) {
  const file = normalizeFile(sourceFile);
  if (banks.has(file)) return banks.get(file);
  const full = path.join(archiveDir, 'exams', file);
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(full, 'utf8'), ctx, { filename: full, timeout: 3000 });
  const bank = ctx.window.questions || ctx.window.questionBank || ctx.questions || ctx.questionBank;
  if (!Array.isArray(bank)) throw new Error('questions array not found: ' + file);
  banks.set(file, bank);
  return bank;
}
function stringArray(value) {
  return [...new Set((Array.isArray(value) ? value : []).map(text).filter(Boolean))];
}
function integerBucket(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function pendingRecord(identityRecord, question) {
  const difficultyBucket = integerBucket(question?.difficultyBucket);
  const row = {
    questionUid: identityRecord.questionUid,
    sourceArchiveFile: normalizeFile(identityRecord.sourceArchiveFile),
    sourceOrdinal: Number(identityRecord.sourceOrdinal),
    sourceQuestionNo: identityRecord.sourceQuestionNo ?? question?.id ?? null,
    sourceFingerprint: sourceFingerprint(question),
    contentFingerprint: contentFingerprint(question),
    standardCourse: text(question?.standardCourse || question?.course),
    standardUnitKey: text(question?.standardUnitKey),
    standardUnit: text(question?.standardUnit),
    subUnitKey: text(question?.subUnitKey || question?.sub_unit_key),
    subUnit: text(question?.subUnit || question?.sub_unit),
    conceptClusterKey: text(question?.conceptClusterKey),
    problemTypeKey: text(question?.problemTypeKey || question?.typeKey),
    templateKey: text(question?.templateKey),
    crossConceptKeys: stringArray(question?.crossConceptKeys),
    secondaryConceptKeys: stringArray(question?.secondaryConceptKeys),
    conditionKeys: stringArray(question?.conditionKeys),
    integrationPattern: text(question?.integrationPattern),
    tagConfidence: 'review_required',
    tagStatus: 'review_required',
    reviewStatus: 'review_required',
    metadataStatus: 'registration_pending_semantic_review',
    fieldStatus: {
      standardUnit: question?.standardUnitKey ? 'approved_source' : 'manual_review_pending',
      subUnit: question?.subUnitKey ? 'approved_source' : 'manual_review_pending',
      concept: 'manual_review_pending',
      problemType: 'manual_review_pending',
      template: 'manual_review_pending',
      difficulty: difficultyBucket ? 'source_unreviewed' : 'manual_review_pending'
    },
    metadataRevision: 'archive-registration-sync-v1',
    approvalEvidence: ['archive/tools/intelligence/sync-pending-question-metadata-v1.mjs']
  };
  if (difficultyBucket) row.difficultyBucket = difficultyBucket;
  return row;
}

function main() {
  const identityRaw = fs.readFileSync(identityPath, 'utf8');
  const identity = JSON.parse(identityRaw);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const identityByUid = new Map((identity.records || []).map(r => [r.questionUid, r]));
  const byUid = new Map((metadata.records || []).map(r => [r.questionUid, r]));

  for (const uid of byUid.keys()) {
    if (!identityByUid.has(uid)) throw new Error('metadata row without canonical identity: ' + uid);
  }

  let added = 0;
  const addedFiles = new Set();
  for (const identityRecord of identity.records || []) {
    if (byUid.has(identityRecord.questionUid)) continue;
    const bank = loadBank(identityRecord.sourceArchiveFile);
    const question = bank[Number(identityRecord.sourceOrdinal) - 1];
    if (!question) throw new Error(
      'source ordinal missing: ' + identityRecord.sourceArchiveFile + '#' + identityRecord.sourceOrdinal
    );
    const currentFingerprint = sourceFingerprint(question);
    if (identityRecord.sourceFingerprint && identityRecord.sourceFingerprint !== currentFingerprint) {
      throw new Error('new identity/source fingerprint mismatch: ' + identityRecord.questionUid);
    }
    byUid.set(identityRecord.questionUid, pendingRecord(identityRecord, question));
    added += 1;
    addedFiles.add(normalizeFile(identityRecord.sourceArchiveFile));
  }

  if (!added) {
    if (byUid.size !== (identity.records || []).length) throw new Error('metadata/identity cardinality mismatch');
    console.log(JSON.stringify({ status: 'NO_CHANGE', records: byUid.size, added: 0 }, null, 2));
    return;
  }

  const records = [...byUid.values()].sort((a, b) => String(a.questionUid).localeCompare(String(b.questionUid), 'en'));
  const sourceKeys = new Set(records.map(r => normalizeFile(r.sourceArchiveFile) + '#' + Number(r.sourceOrdinal)));
  if (records.length !== identity.records.length || sourceKeys.size !== records.length) {
    throw new Error('metadata cardinality/source join gate failed');
  }

  const counts = {
    ...(metadata.counts || {}),
    records: records.length,
    uidUnique: new Set(records.map(r => r.questionUid)).size === records.length,
    sourceJoinUnique: sourceKeys.size === records.length,
    semanticallyReviewed: records.filter(r =>
      r.reviewStatus === 'reviewed_pass' ||
      r.metadataStatus === 'approved_semantic_review' ||
      r.metadataStatus === 'approved_exam_meta_source'
    ).length,
    explicitProblemTypeHolds: records.filter(r => r.fieldStatus?.problemType === 'manual_review_pending').length,
    explicitTemplateHolds: records.filter(r => r.fieldStatus?.template === 'manual_review_pending').length,
    explicitDifficultyHolds: records.filter(r => r.fieldStatus?.difficulty === 'manual_review_pending').length
  };

  const next = {
    ...metadata,
    generatedAt: new Date().toISOString(),
    sourceDigests: {
      ...(metadata.sourceDigests || {}),
      identityMap: sha256(identityRaw)
    },
    consistency: {
      ...(metadata.consistency || {}),
      sourceFingerprintFailures: Number(metadata.consistency?.sourceFingerprintFailures || 0),
      sourceClassificationConflicts: Number(metadata.consistency?.sourceClassificationConflicts || 0),
      productionValuesWinOnMerge: true
    },
    counts,
    records,
    registrationSync: {
      schemaVersion: 'archive-registration-metadata-sync-v1',
      added,
      addedFiles: [...addedFiles].sort((a, b) => a.localeCompare(b, 'en'))
    }
  };
  delete next.digest;
  next.digest = sha256(JSON.stringify(next));
  fs.writeFileSync(metadataPath, JSON.stringify(next, null, 2) + '\n', 'utf8');

  console.log(JSON.stringify({
    status: 'UPDATED',
    total: records.length,
    added,
    addedFiles: next.registrationSync.addedFiles,
    digest: next.digest
  }, null, 2));
}
main();
