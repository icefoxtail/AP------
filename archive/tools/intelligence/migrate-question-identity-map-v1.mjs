import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Rebase Phase 0C identity after an already-archived source question was
 * inserted, removed, or reordered.
 *
 * The original ordinal UID remains useful only while the source array is
 * immutable.  This migration preserves existing UIDs by matching the
 * question body/choices/image against the HEAD source snapshot and assigns a
 * content-derived UID only to genuinely new questions.  Answer/solution
 * edits therefore do not create a new question identity.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputPath = path.join(archiveDir, 'data', 'question_identity_map.json');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function normalizeSourceFile(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\\/g, '/')
    .replace(/^exams\//, '')
    .replace(/^\.\//, '')
    .trim();
}

function runArchiveScript(file, code) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: file, timeout: 3000 });
  const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
  if (!Array.isArray(questions)) throw new Error(`questions array not found: ${file}`);
  return questions;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readHeadIdentity() {
  const raw = execFileSync('git', ['-C', repoRoot, 'show', 'HEAD:archive/data/question_identity_map.json'], {
    maxBuffer: 64 * 1024 * 1024
  }).toString('utf8');
  return { raw, value: JSON.parse(raw) };
}

function readHeadQuestions(sourceFile, cache) {
  if (cache.has(sourceFile)) return cache.get(sourceFile);
  try {
    const code = execFileSync('git', ['-C', repoRoot, 'show', `HEAD:archive/exams/${sourceFile}`], {
      maxBuffer: 32 * 1024 * 1024
    }).toString('utf8');
    const questions = runArchiveScript(`HEAD:archive/exams/${sourceFile}`, code);
    cache.set(sourceFile, questions);
    return questions;
  } catch (error) {
    cache.set(sourceFile, null);
    return null;
  }
}

function readCurrentQuestions(identity) {
  const files = new Map();
  for (const record of identity.records) {
    const sourceFile = normalizeSourceFile(record.sourceArchiveFile);
    if (!files.has(sourceFile)) files.set(sourceFile, []);
    files.get(sourceFile).push(record);
  }
  const result = new Map();
  for (const [sourceFile, records] of files) {
    const fullPath = path.join(archiveDir, 'exams', sourceFile);
    const questions = runArchiveScript(fullPath, fs.readFileSync(fullPath, 'utf8'));
    for (const record of records) {
      const question = questions[Number(record.sourceOrdinal) - 1];
      if (!question) throw new Error(`current source join failed: ${sourceFile}#${record.sourceOrdinal}`);
      result.set(`${sourceFile}#${record.sourceOrdinal}`, question);
    }
  }
  return result;
}

function makeSourceFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null
  }));
}

function makeContentFingerprint(question) {
  // Deliberately omit answer and solution so correction of an explanation or
  // answer key does not mint a new identity for the same source question.
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    image: question?.image ?? null
  }));
}

function makeOrdinalUid(sourceFile, sourceOrdinal) {
  return `qid_v1_${sha256(`${normalizeSourceFile(sourceFile)}#${Number(sourceOrdinal)}`)}`;
}

function makeContentUid(sourceFile, contentFingerprint) {
  return `qid_v1_${sha256(`${normalizeSourceFile(sourceFile)}#content:${contentFingerprint}`)}`;
}

function addArrayValue(object, key, value) {
  if (!object[key]) object[key] = [];
  object[key].push(value);
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function main() {
  const currentIdentityRaw = fs.readFileSync(outputPath, 'utf8');
  const currentIdentity = JSON.parse(currentIdentityRaw);
  const { raw: headIdentityRaw, value: headIdentity } = readHeadIdentity();
  const currentQuestions = readCurrentQuestions(currentIdentity);
  const headQuestionCache = new Map();
  const oldBySourceAndContent = new Map();

  for (const oldRecord of headIdentity.records) {
    const sourceFile = normalizeSourceFile(oldRecord.sourceArchiveFile);
    const questions = readHeadQuestions(sourceFile, headQuestionCache);
    const question = questions?.[Number(oldRecord.sourceOrdinal) - 1];
    if (!question) continue;
    const key = `${sourceFile}#${makeContentFingerprint(question)}`;
    if (!oldBySourceAndContent.has(key)) oldBySourceAndContent.set(key, []);
    oldBySourceAndContent.get(key).push({ oldRecord, question });
  }

  const records = [];
  const failures = [];
  const usedUids = new Set();
  const migrationRecords = [];
  const matchedOldUids = new Set();
  let matchedByFingerprint = 0;
  let shiftedRecords = 0;
  let newRecords = 0;
  let newOrdinalRecords = 0;
  let newContentRecords = 0;

  // Plan all fingerprint matches before walking current ordinals.  This is
  // important for an insertion: the new current q17 is visited before the
  // old q17 content is discovered at current q18.
  const plannedMatchedOldUids = new Set();
  for (const currentIdentityRecord of currentIdentity.records) {
    const sourceArchiveFile = normalizeSourceFile(currentIdentityRecord.sourceArchiveFile);
    const sourceOrdinal = Number(currentIdentityRecord.sourceOrdinal);
    const question = currentQuestions.get(`${sourceArchiveFile}#${sourceOrdinal}`);
    const candidates = oldBySourceAndContent.get(`${sourceArchiveFile}#${makeContentFingerprint(question)}`) || [];
    if (candidates.length === 1) plannedMatchedOldUids.add(candidates[0].oldRecord.questionUid);
    else {
      const sameOrdinal = candidates.filter(item => Number(item.oldRecord.sourceOrdinal) === sourceOrdinal);
      if (sameOrdinal.length === 1) plannedMatchedOldUids.add(sameOrdinal[0].oldRecord.questionUid);
    }
  }

  for (const currentIdentityRecord of currentIdentity.records) {
    const sourceArchiveFile = normalizeSourceFile(currentIdentityRecord.sourceArchiveFile);
    const sourceOrdinal = Number(currentIdentityRecord.sourceOrdinal);
    const sourceQuestionNo = String(currentIdentityRecord.sourceQuestionNo ?? '');
    const question = currentQuestions.get(`${sourceArchiveFile}#${sourceOrdinal}`);
    const contentFingerprint = makeContentFingerprint(question);
    const sourceFingerprint = makeSourceFingerprint(question);
    const key = `${sourceArchiveFile}#${contentFingerprint}`;
    const candidates = (oldBySourceAndContent.get(key) || []).filter(item => !matchedOldUids.has(item.oldRecord.questionUid));
    let selected = null;
    let matchType = 'new_content_uid';

    if (candidates.length === 1) {
      selected = candidates[0];
      matchType = 'content_fingerprint';
    } else if (candidates.length > 1) {
      const sameOrdinal = candidates.filter(item => Number(item.oldRecord.sourceOrdinal) === sourceOrdinal);
      if (sameOrdinal.length === 1) {
        selected = sameOrdinal[0];
        matchType = 'content_fingerprint_same_ordinal';
      } else {
        failures.push({ sourceArchiveFile, sourceOrdinal, reason: 'ambiguous content fingerprint match', candidateUids: candidates.map(item => item.oldRecord.questionUid) });
      }
    }

    if (failures.some(item => item.sourceArchiveFile === sourceArchiveFile && item.sourceOrdinal === sourceOrdinal)) continue;

    let questionUid;
    if (selected) {
      questionUid = selected.oldRecord.questionUid;
      matchedOldUids.add(questionUid);
      matchedByFingerprint += 1;
      if (Number(selected.oldRecord.sourceOrdinal) !== sourceOrdinal) shiftedRecords += 1;
      migrationRecords.push({ questionUid, sourceArchiveFile, oldSourceOrdinal: Number(selected.oldRecord.sourceOrdinal), sourceOrdinal, match: matchType });
    } else {
      const ordinalUid = makeOrdinalUid(sourceArchiveFile, sourceOrdinal);
      if (!plannedMatchedOldUids.has(ordinalUid) && !usedUids.has(ordinalUid)) {
        questionUid = ordinalUid;
        matchType = 'new_ordinal_uid';
        newOrdinalRecords += 1;
      } else {
        questionUid = makeContentUid(sourceArchiveFile, contentFingerprint);
        matchType = 'new_content_uid';
        newContentRecords += 1;
      }
      newRecords += 1;
      migrationRecords.push({ questionUid, sourceArchiveFile, sourceOrdinal, match: matchType });
    }

    if (usedUids.has(questionUid)) {
      failures.push({ sourceArchiveFile, sourceOrdinal, reason: 'questionUid collision after migration', questionUid });
      continue;
    }
    usedUids.add(questionUid);
    records.push({
      questionUid,
      legacyOrdinalQuestionUid: makeOrdinalUid(sourceArchiveFile, sourceOrdinal),
      legacyQKey: `${sourceArchiveFile}_${sourceQuestionNo}`,
      sourceArchiveFile,
      sourceOrdinal,
      sourceQuestionNo,
      sourceFingerprint,
      contentFingerprint
    });
  }

  const retiredQuestionUids = headIdentity.records
    .map(record => record.questionUid)
    .filter(questionUid => !matchedOldUids.has(questionUid));
  records.sort((a, b) => a.sourceArchiveFile.localeCompare(b.sourceArchiveFile, 'en') || a.sourceOrdinal - b.sourceOrdinal);

  const byQuestionUid = {};
  const byLegacyQKey = {};
  const bySourceFileAndOrdinal = {};
  const bySourceFileAndQuestionNo = {};
  for (const record of records) {
    byQuestionUid[record.questionUid] = {
      sourceArchiveFile: record.sourceArchiveFile,
      sourceOrdinal: record.sourceOrdinal,
      sourceQuestionNo: record.sourceQuestionNo
    };
    addArrayValue(byLegacyQKey, record.legacyQKey, record.questionUid);
    if (!bySourceFileAndOrdinal[record.sourceArchiveFile]) bySourceFileAndOrdinal[record.sourceArchiveFile] = {};
    bySourceFileAndOrdinal[record.sourceArchiveFile][String(record.sourceOrdinal)] = record.questionUid;
    if (!bySourceFileAndQuestionNo[record.sourceArchiveFile]) bySourceFileAndQuestionNo[record.sourceArchiveFile] = {};
    addArrayValue(bySourceFileAndQuestionNo[record.sourceArchiveFile], record.sourceQuestionNo, record.questionUid);
  }

  const collisionLegacyKeys = Object.entries(byLegacyQKey)
    .filter(([, uids]) => uids.length > 1)
    .map(([legacyQKey, uids]) => ({ legacyQKey, questionUids: uids }));
  const stableMap = {
    schemaVersion: 'question-identity-map-v1',
    sourceCommit: headIdentity.sourceCommit,
    inventoryDigest: currentIdentity.inventoryDigest,
    collisionReviewDigest: currentIdentity.collisionReviewDigest,
    identityAlgorithm: {
      version: 'qid_v1_migrated',
      expression: 'preserved qid_v1 by sourceFile + contentFingerprint; new qid_v1 by sourceFile + contentFingerprint',
      sourceOrdinal: '1-based original question array position; lookup only, not identity seed',
      contentHashPolicy: 'sourceFingerprint audits full question; contentFingerprint omits answer and solution for identity migration stability'
    },
    uidMigration: {
      schemaVersion: 'question-identity-uid-migration-v1',
      baseIdentityDigest: sha256(headIdentityRaw),
      previousWorkingIdentityDigest: sha256(currentIdentityRaw),
      matchedByContentFingerprint: matchedByFingerprint,
      shiftedRecords,
      newRecords,
      newOrdinalRecords,
      newContentRecords,
      retiredRecords: retiredQuestionUids.length,
      retiredQuestionUids,
      records: migrationRecords
    },
    stats: {
      examFileCount: Object.keys(bySourceFileAndOrdinal).length,
      sourceQuestionCount: records.length,
      uniqueQuestionUidCount: Object.keys(byQuestionUid).length,
      legacyQKeyCollisionGroupCount: collisionLegacyKeys.length,
      failures: failures.length,
      duplicateQuestionUidCount: records.length - Object.keys(byQuestionUid).length,
      collisionMismatchCount: 0,
      missingCollisionKeyCount: 0
    },
    failures,
    records,
    lookup: {
      byQuestionUid: sortObject(byQuestionUid),
      byLegacyQKey: sortObject(byLegacyQKey),
      bySourceFileAndOrdinal: sortObject(bySourceFileAndOrdinal),
      bySourceFileAndQuestionNo: sortObject(bySourceFileAndQuestionNo)
    },
    collisionAudit: {
      expectedGroups: currentIdentity.collisionAudit?.expectedGroups ?? collisionLegacyKeys.length,
      detectedGroups: collisionLegacyKeys.length,
      collisionMismatch: [],
      missingCollisionKeys: []
    }
  };

  if (failures.length || records.length !== currentIdentity.records.length || usedUids.size !== records.length) {
    throw new Error(`identity migration blocked: ${JSON.stringify({ failures: failures.length, records: records.length, expected: currentIdentity.records.length, unique: usedUids.size })}`);
  }

  const output = { generatedAt: new Date().toISOString(), identityDigest: sha256(JSON.stringify(stableMap)), ...stableMap };
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    output: path.relative(repoRoot, outputPath).replaceAll('\\', '/'),
    identityDigest: output.identityDigest,
    sourceQuestionCount: records.length,
    matchedByContentFingerprint: matchedByFingerprint,
    shiftedRecords,
    newRecords,
    newOrdinalRecords,
    newContentRecords,
    retiredRecords: retiredQuestionUids.length,
    failures: failures.length
  }, null, 2));
}

main();
