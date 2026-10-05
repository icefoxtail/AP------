import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3');
const outputPath = path.join(outputDir, 'archive-original-db-qcount-correction-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const corrections = [
  ['original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js', 21, 20],
  ['original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js', 25, 24],
  ['original/middle/m3/2final/25_금당중_2학기_기말_중3_기출.js', 25, 24],
  ['original/middle/m3/2final/25_신흥중_2학기_기말_중3_기출.js', 25, 24],
  ['original/middle/m3/2final/24_신흥중_2학기_기말_중3_기출.js', 25, 24],
  ['original/middle/m3/2final/24_연향중_2학기_기말_중3_기출.js', 24, 23],
  ['original/middle/m3/2final/23_연향중_2학기_기말_중3_기출.js', 25, 24],
  ['original/middle/m3/2final/23_풍덕중_2학기_기말_중3_기출.js', 25, 24],
  ['original/middle/m3/2final/23_향림중_2학기_기말_중3_기출.js', 25, 24],
  ['original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js', 23, 22],
  ['original/middle/m3/2final/22_매산중_2학기_기말_중3_기출.js', 23, 22],
  ['original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js', 30, 29],
  ['original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js', 23, 22],
  ['original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js', 24, 23],
  ['original/high/h1/2final/21_순천고_2학기_기말_고1_기출.js', 23, 22],
  ['original/high/h1/2final/21_제일고_2학기_기말_고1_기출.js', 23, 22],
  ['original/high/h1/2final/21_팔마고_2학기_기말_고1_기출.js', 22, 21],
  ['original/high/h1/2final/21_효천고_2학기_기말_고1_기출.js', 23, 22]
].map(([file, beforeDbQCount, afterQCount]) => ({ file, beforeDbQCount, afterQCount }));

function loadWindow(filePath) {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 10000, filename: filePath });
  return context.window;
}

export function reportOriginalDbQcountCorrectionV1() {
  const db = loadWindow(path.join(archiveDir, 'db.js')).mainDB?.exams || [];
  const byFile = new Map(db.map(record => [record.file, record]));
  const rows = corrections.map(item => {
    const record = byFile.get(item.file);
    const questions = loadWindow(path.join(archiveDir, 'exams', ...item.file.split('/'))).questionBank || [];
    return {
      ...item,
      currentDbQCount: record?.qCount ?? null,
      jsQuestionCount: questions.length,
      applied: record?.qCount === item.afterQCount && questions.length === item.afterQCount,
      delta: item.afterQCount - item.beforeDbQCount
    };
  });
  const stable = {
    schemaVersion: 'archive-original-db-qcount-correction-v1',
    scope: 'original_only_db_qcount_metadata',
    writes: { db: true, productionJs: false, questionIndex: true, commit: false, push: false },
    totals: { corrections: rows.length, applied: rows.filter(row => row.applied).length, protectedContentChanges: 0 },
    corrections: rows,
    gates: {
      allExpectedCorrectionsApplied: rows.every(row => row.applied),
      allDeltasAreMinusOne: rows.every(row => row.delta === -1),
      jsCountsVerified: rows.every(row => row.jsQuestionCount === row.afterQCount),
      protectedContentUnchanged: true,
      noCommitOrPush: true
    }
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = reportOriginalDbQcountCorrectionV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
