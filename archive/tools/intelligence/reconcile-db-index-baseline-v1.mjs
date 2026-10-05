import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const dbPath = path.join(archiveDir, 'db.js');
const indexPath = path.join(archiveDir, 'question-index.js');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3');
const outputPath = path.join(outputDir, 'archive-db-index-reconciliation-v1.json');

const expectedStaleFiles = new Set([
  'similar/high/h1/2final/25_금당고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_금당고_2학기_기말_고1_확인.js',
  'similar/high/h1/2mid/25_금당고_2학기_중간_고1_심화.js',
  'similar/high/h1/2mid/25_금당고_2학기_중간_고1_확인.js',
  'similar/high/h1/2mid/25_매산고_2학기_중간_고1_심화.js',
  'similar/high/h1/2mid/25_매산고_2학기_중간_고1_확인.js',
  'similar/high/h1/2final/25_순천고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_순천고_2학기_기말_고1_확인.js',
  'similar/high/h1/2mid/25_순천고_2학기_중간_고1_심화.js',
  'similar/high/h1/2mid/25_순천고_2학기_중간_고1_확인.js',
  'similar/high/h1/2final/25_제일고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_제일고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_팔마고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_팔마고_2학기_기말_고1_확인.js',
  'similar/high/h1/2final/25_효천고_2학기_기말_고1_심화.js',
  'similar/high/h1/2final/25_효천고_2학기_기말_고1_확인.js'
]);

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^exams\//, '').trim();
}

function loadWindow(filePath) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window;
}

function readDb() {
  const window = loadWindow(dbPath);
  const exams = window.mainDB?.exams;
  if (!Array.isArray(exams)) throw new Error('db.js mainDB.exams is missing');
  return exams;
}

function readIndexCounts() {
  const window = loadWindow(indexPath);
  const records = window.questionIndex;
  if (!Array.isArray(records)) throw new Error('question-index.js questionIndex is missing');
  const counts = new Map();
  for (const record of records) {
    const file = normalize(record.sourceFile);
    counts.set(file, (counts.get(file) || 0) + 1);
  }
  return { records, counts };
}

function writeDb(exams) {
  const source = `window.mainDB = ${JSON.stringify({ exams }, null, 2)};\n`;
  fs.writeFileSync(dbPath, source, 'utf8');
  return source;
}

export function reconcileDbIndexBaselineV1() {
  const exams = readDb();
  const { records: indexRecords, counts: indexCounts } = readIndexCounts();
  const missing = exams.filter(record => !fs.existsSync(path.join(archiveDir, 'exams', ...normalize(record.file).split('/'))));
  const missingFiles = new Set(missing.map(record => normalize(record.file)));
  const unexpected = [...missingFiles].filter(file => !expectedStaleFiles.has(file));
  const expectedMissing = [...expectedStaleFiles].filter(file => missingFiles.has(file));
  if (unexpected.length || expectedMissing.length !== expectedStaleFiles.size || missingFiles.size !== expectedStaleFiles.size) {
    throw new Error(`unexpected missing DB files: ${JSON.stringify({ unexpected, missing: [...missingFiles], expectedMissing })}`);
  }
  const retained = exams.filter(record => !missingFiles.has(normalize(record.file)));
  const retainedFiles = new Set(retained.map(record => normalize(record.file)));
  const indexOnlyFiles = [...indexCounts.keys()].filter(file => !retainedFiles.has(file));
  const retainedWithoutIndex = [...retainedFiles].filter(file => !indexCounts.has(file));
  if (indexOnlyFiles.length || retainedWithoutIndex.length) {
    throw new Error(`retained DB/index file mismatch: ${JSON.stringify({ indexOnlyFiles, retainedWithoutIndex })}`);
  }
  const stable = {
    schemaVersion: 'archive-db-index-reconciliation-v1',
    decision: 'STALE_DB_REFERENCES_REMOVED',
    writes: { db: true, sourceJs: false, questionIndex: false, commit: false, push: false },
    sourcePolicy: 'Keep current 438-file operational original index scope; do not auto-import post-checkpoint similar files.',
    before: { dbFiles: exams.length, dbQuestionCount: exams.reduce((sum, record) => sum + Number(record.qCount || 0), 0), indexFiles: indexCounts.size, indexRecords: indexRecords.length },
    after: { dbFiles: retained.length, dbQuestionCount: retained.reduce((sum, record) => sum + Number(record.qCount || 0), 0), indexFiles: indexCounts.size, indexRecords: indexRecords.length },
    removedFiles: missing.map(record => ({ file: normalize(record.file), qCount: Number(record.qCount || 0), reason: 'DB reference points to an absent stale similar file; no source file deleted.' })),
    gates: { allRemovedFilesAbsent: true, retainedDbFilesMatchIndexFiles: true, sourceFilesDeleted: false }
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable, retained };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = reconcileDbIndexBaselineV1();
  const dbSource = writeDb(report.retained);
  const output = { ...report };
  delete output.retained;
  output.dbDigest = sha256(dbSource);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: output.digest, before: output.before, after: output.after, removedFiles: output.removedFiles.length }, null, 2));
}
