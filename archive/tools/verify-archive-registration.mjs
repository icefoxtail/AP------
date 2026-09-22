import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const archiveDir = path.join(root, 'archive');
const normalizeFile = core.normalizeFile;

function loadDb() {
  const file = path.join(archiveDir, 'db.js');
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file, timeout: 3000 });
  const exams = ctx.window.mainDB?.exams;
  if (!Array.isArray(exams)) throw new Error('window.mainDB.exams missing');
  return exams;
}
function groupByFile(rows, field) {
  const map = new Map();
  for (const row of rows || []) {
    const file = normalizeFile(row[field]);
    if (!map.has(file)) map.set(file, []);
    map.get(file).push(row);
  }
  return map;
}

const exams = loadDb();
const identity = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'question_identity_map.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'question_metadata.json'), 'utf8'));
const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'archive2-catalog.json'), 'utf8')));

const identityByFile = groupByFile(identity.records, 'sourceArchiveFile');
const metadataByUid = new Map((metadata.records || []).map(r => [r.questionUid, r]));
const catalogRecordsByFile = groupByFile(catalog.records, 'sourceFile');
const catalogExamByFile = new Map((catalog.exams || []).map(e => [normalizeFile(e.file), e]));
const dbFiles = new Set();
let questionCount = 0;
let pendingSemantic = 0;

for (const exam of exams) {
  const file = normalizeFile(exam.file);
  if (!file || dbFiles.has(file)) throw new Error('duplicate/blank db exam file: ' + file);
  dbFiles.add(file);
  const expected = Number(exam.qCount);
  if (!Number.isInteger(expected) || expected < 1) throw new Error('invalid qCount: ' + file);

  const ids = (identityByFile.get(file) || []).sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  const records = (catalogRecordsByFile.get(file) || []).sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  if (!catalogExamByFile.has(file)) throw new Error('Archive2 exam missing: ' + file);
  if (ids.length !== expected) throw new Error('identity qCount mismatch: ' + file + ' ' + ids.length + ' != ' + expected);
  if (records.length !== expected) throw new Error('catalog qCount mismatch: ' + file + ' ' + records.length + ' != ' + expected);

  for (let i = 0; i < expected; i += 1) {
    const id = ids[i];
    const record = records[i];
    if (Number(id.sourceOrdinal) !== i + 1 || Number(record.sourceOrdinal) !== i + 1) {
      throw new Error('source ordinal mismatch: ' + file + '#' + (i + 1));
    }
    if (!id.questionUid || record.questionUid !== id.questionUid) {
      throw new Error('catalog/identity UID mismatch: ' + file + '#' + (i + 1));
    }
    const meta = metadataByUid.get(id.questionUid);
    if (!meta) throw new Error('metadata missing: ' + id.questionUid);
    if (record.identityStatus !== 'VERIFIED') throw new Error('catalog identity unresolved: ' + id.questionUid);
    if (meta.reviewStatus === 'review_required' || meta.metadataStatus === 'registration_pending_semantic_review') {
      pendingSemantic += 1;
    }
  }
  questionCount += expected;
}

const catalogFiles = new Set((catalog.exams || []).map(e => normalizeFile(e.file)));
if (catalogFiles.size !== dbFiles.size || [...dbFiles].some(file => !catalogFiles.has(file))) {
  throw new Error('db/catalog exam set mismatch');
}
if ((identity.records || []).length !== (metadata.records || []).length) {
  throw new Error('identity/metadata global cardinality mismatch');
}
if (catalog.health?.exams !== exams.length) throw new Error('catalog health exam count mismatch');
if (catalog.health?.questions !== questionCount) throw new Error('catalog health question count mismatch');

console.log(JSON.stringify({
  status: 'PASS',
  exams: exams.length,
  questions: questionCount,
  identityRecords: identity.records.length,
  metadataRecords: metadata.records.length,
  catalogRecords: catalog.records.length,
  pendingSemantic
}, null, 2));
