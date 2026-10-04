import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const oldPrefix = 'archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js|23_한영고_1학기_중간_고1_기출|';
const newPrefix = 'archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js|2023_한영고_1학기_중간_고1_수학상|';
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const rows = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
for (const row of rows) {
  if (row.batchId !== 'H15-SA-01-batch-005' || !row.questionUid.startsWith(oldPrefix)) continue;
  row.questionUid = `${newPrefix}${row.questionUid.slice(oldPrefix.length)}`;
  const payload = { questionUid: row.questionUid, independentAnswer: row.independentAnswer, facts: row.facts };
  row.expectedFactHash = sha(JSON.stringify(stable(payload)));
}
fs.writeFileSync(expectedPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
const batchPath = path.join(REPORT, 'source_only_batches', '005_H15-SA-01.json');
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
for (const row of batch.rows) {
  if (!row.questionUid.startsWith(oldPrefix)) continue;
  row.questionUid = `${newPrefix}${row.questionUid.slice(oldPrefix.length)}`;
  const payload = { questionUid: row.questionUid, independentAnswer: row.independentAnswer, facts: row.facts };
  row.expectedFactHash = sha(JSON.stringify(stable(payload)));
}
fs.writeFileSync(batchPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ correctedBatch: batch.batchId, correctedRows: batch.rows.filter((row) => row.questionUid.startsWith(newPrefix)).length }, null, 2));
