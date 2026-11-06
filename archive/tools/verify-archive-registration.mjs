import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const normalizeFile = core.normalizeFile;

function loadDb(archiveDir) {
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

function listOriginalSourceFiles(sourceRoot) {
  if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    throw new Error('original source directory missing: ' + sourceRoot);
  }
  const files = [];
  function visit(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) files.push(absolute);
    }
  }
  visit(sourceRoot);
  return files.map(file => normalizeFile(path.relative(path.dirname(sourceRoot), file)));
}

export function verifyRegistration({ root = repositoryRoot, sources = null } = {}) {
const archiveDir = path.join(root, 'archive');
const selected = sources === null ? null : new Set(sources.map(normalizeFile));
if (selected && (!selected.size || [...selected].some(file => !file.startsWith('original/') || file.includes('..')))) {
  throw new Error('scoped registration requires explicit original source paths');
}
const allExams = loadDb(archiveDir);
const exams = selected ? allExams.filter(exam => selected.has(normalizeFile(exam.file))) : allExams;
if (selected) for (const file of selected) {
  if (!exams.some(exam => normalizeFile(exam.file) === file)) throw new Error('requested source missing from DB: ' + file);
  if (!fs.existsSync(path.join(archiveDir, 'exams', file))) throw new Error('requested source file missing: ' + file);
}
const identity = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'question_identity_map.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'question_metadata.json'), 'utf8'));
const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(archiveDir, 'data', 'archive2-catalog.json'), 'utf8')));

const identityByFile = groupByFile(identity.records, 'sourceArchiveFile');
const metadataByUid = new Map((metadata.records || []).map(r => [r.questionUid, r]));
const uidCounts = rows => {
  const counts = new Map();
  for (const row of rows || []) counts.set(row.questionUid, (counts.get(row.questionUid) || 0) + 1);
  return counts;
};
const identityUidCounts = uidCounts(identity.records);
const metadataUidCounts = uidCounts(metadata.records);
const catalogUidCounts = uidCounts(catalog.records);
const catalogRecordsByFile = groupByFile(catalog.records, 'sourceFile');
const catalogExamByFile = new Map((catalog.exams || []).map(e => [normalizeFile(e.file), e]));
const dbFiles = new Set();
const originalSourceFiles = selected ? [...selected] : listOriginalSourceFiles(path.join(archiveDir, 'exams', 'original'));
const originalSourceFileSet = new Set(originalSourceFiles);
const dbOriginalFileSet = new Set(exams
  .map(exam => normalizeFile(exam.file))
  .filter(file => file.startsWith('original/')));
if (!originalSourceFiles.length) throw new Error('original source inventory is empty');
const sourceMissingFromDb = [...originalSourceFileSet].filter(file => !dbOriginalFileSet.has(file)).sort();
const dbOriginalMissingSource = [...dbOriginalFileSet].filter(file => !originalSourceFileSet.has(file)).sort();
if (sourceMissingFromDb.length || dbOriginalMissingSource.length) {
  const sample = (label, files) => files.length
    ? `${label}=${files.length} [${files.slice(0, 10).join(', ')}${files.length > 10 ? ', ...' : ''}]`
    : `${label}=0`;
  throw new Error(
    'original source/DB inventory mismatch: ' +
    sample('source missing from db', sourceMissingFromDb) + '; ' +
    sample('db original missing source', dbOriginalMissingSource),
  );
}
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
  if (selected && catalog.exams.filter(exam => normalizeFile(exam.file) === file).length !== 1) throw new Error('duplicate Archive2 exam: ' + file);
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
    if (selected && [identityUidCounts, metadataUidCounts, catalogUidCounts].some(counts => counts.get(id.questionUid) !== 1)) {
      throw new Error('duplicate/missing UID across registration projections: ' + id.questionUid);
    }
    const meta = metadataByUid.get(id.questionUid);
    if (!meta) throw new Error('metadata missing: ' + id.questionUid);
    if (selected && (normalizeFile(meta.sourceArchiveFile) !== file || Number(meta.sourceOrdinal) !== i + 1)) {
      throw new Error('metadata/source UID binding mismatch: ' + id.questionUid);
    }
    if (record.identityStatus !== 'VERIFIED') throw new Error('catalog identity unresolved: ' + id.questionUid);
    if (meta.reviewStatus === 'review_required' || meta.metadataStatus === 'registration_pending_semantic_review') {
      pendingSemantic += 1;
    }
  }
  questionCount += expected;
}

if (!selected) {
const catalogFiles = new Set((catalog.exams || []).map(e => normalizeFile(e.file)));
if (catalogFiles.size !== dbFiles.size || [...dbFiles].some(file => !catalogFiles.has(file))) {
  throw new Error('db/catalog exam set mismatch');
}
if ((identity.records || []).length !== (metadata.records || []).length) {
  throw new Error('identity/metadata global cardinality mismatch');
}
if (catalog.health?.exams !== exams.length) throw new Error('catalog health exam count mismatch');
if (catalog.health?.questions !== questionCount) throw new Error('catalog health question count mismatch');

}

return {
  status: 'PASS',
  scope: selected ? 'selected-original-sources' : 'full-registration',
  ...(selected ? { sources: [...selected].sort() } : {}),
  originalSourceExams: originalSourceFileSet.size,
  exams: exams.length,
  questions: questionCount,
  identityRecords: selected ? questionCount : identity.records.length,
  metadataRecords: selected ? questionCount : metadata.records.length,
  catalogRecords: selected ? questionCount : catalog.records.length,
  pendingSemantic
};
}

function main() {
  const args = process.argv.slice(2);
  const sources = [];
  for (let i = 0; i < args.length; i += 2) {
    if (args[i] !== '--source' || !args[i + 1]) throw new Error('usage: verify-archive-registration.mjs [--source original/...js ...]');
    sources.push(args[i + 1]);
  }
  console.log(JSON.stringify(verifyRegistration({ sources: sources.length ? sources : null }), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
