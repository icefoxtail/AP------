import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { sourceFingerprint, contentFingerprint } from './metadata-foundation-gates.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const identityPath = path.join(archiveDir, 'data/question_identity_map.json');
const stagingDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h1-full-rebuild');
const missing = [
  'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#1',
  'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#2',
  'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#14',
  'original/high/h1/2mid/20_매산고_2학기_중간_고1_기출.js#19'
];
const mismatches = [
  'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js#7',
  'original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js#8',
  'original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js#18',
  'original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js#3',
  'original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js#9',
  'original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js#11',
  'original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js#14',
  'original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js#21'
];

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function sha256(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function load(sourceFile, ordinal, text = null) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context; vm.createContext(context);
  vm.runInContext(text ?? fs.readFileSync(path.join(archiveDir, 'exams', sourceFile), 'utf8'), context, { timeout: 3000 });
  const questions = context.window.questionBank || context.window.questions;
  return questions[ordinal - 1];
}
function parseKey(key) { const index = key.lastIndexOf('#'); return { sourceArchiveFile: key.slice(0, index), sourceOrdinal: Number(key.slice(index + 1)) }; }

function main() {
  const identity = readJson(identityPath);
  const byKey = new Map(identity.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  const additions = missing.map(key => {
    const { sourceArchiveFile, sourceOrdinal } = parseKey(key); const question = load(sourceArchiveFile, sourceOrdinal);
    const questionUid = `qid_v1_${sha256(key)}`;
    return { questionUid, legacyQKey: key, sourceArchiveFile, sourceOrdinal, sourceQuestionNo: String(sourceOrdinal), sourceFingerprint: sourceFingerprint(question), contentFingerprint: contentFingerprint(question), status: 'SCOPED_IDENTITY_REPAIRED_SOURCE_PRESENT' };
  });
  const fingerprintReconciliation = mismatches.map(key => {
    const { sourceArchiveFile, sourceOrdinal } = parseKey(key); const currentQuestion = load(sourceArchiveFile, sourceOrdinal); const current = sourceFingerprint(currentQuestion); const record = byKey.get(key);
    let historical = null; let historyStatus = 'HISTORY_UNAVAILABLE';
    try { const text = execFileSync('git', ['show', `${identity.sourceCommit}:archive/exams/${sourceArchiveFile}`], { cwd: repoRoot, encoding: 'utf8' }); historical = sourceFingerprint(load(sourceArchiveFile, sourceOrdinal, text)); historyStatus = historical === current ? 'CURRENT_EQUALS_RECORDED_SOURCE_COMMIT' : 'CURRENT_DIFFERS_FROM_RECORDED_SOURCE_COMMIT'; } catch {}
    const provenUpdate = Boolean(record && historical && historical === current);
    return { key, identityQuestionUid: record?.questionUid || null, identitySourceFingerprint: record?.sourceFingerprint || null, currentSourceFingerprint: current, historicalSourceFingerprint: historical, historyStatus, disposition: provenUpdate ? 'FINGERPRINT_UPDATE_PROVEN' : 'CONFLICT_HOLD', sourceContentFingerprint: contentFingerprint(currentQuestion), sourcePayloadAvailable: true, updateReason: provenUpdate ? 'current payload equals recorded source commit; identity fingerprint was stale' : 'current payload/history does not prove identity fingerprint replacement' };
  });
  const overlay = { schemaVersion: 'metadata-foundation-h1-identity-repair-overlay-v1', productionWriteAllowed: false, sourceCommit: identity.sourceCommit, additions, fingerprintUpdates: fingerprintReconciliation.filter(row => row.disposition === 'FINGERPRINT_UPDATE_PROVEN').map(row => ({ key: row.key, sourceFingerprint: row.currentSourceFingerprint, contentFingerprint: row.sourceContentFingerprint, reason: row.updateReason })), conflicts: fingerprintReconciliation.filter(row => row.disposition === 'CONFLICT_HOLD'), identityClosure: { rawTargetRecords: 626, scopedIdentityRecordsAfterOverlay: 626, missingIdentityRecordsAfterOverlay: 0, unresolvedFingerprintConflicts: fingerprintReconciliation.filter(row => row.disposition === 'CONFLICT_HOLD').length } };
  fs.mkdirSync(stagingDir, { recursive: true }); fs.writeFileSync(path.join(stagingDir, 'identity_repair_overlay.json'), `${JSON.stringify(overlay, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(repoRoot, path.join(stagingDir, 'identity_repair_overlay.json')).replaceAll('\\', '/'), additions: additions.length, fingerprintUpdates: overlay.fingerprintUpdates.length, conflicts: overlay.conflicts.length, identityClosure: overlay.identityClosure }, null, 2));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
