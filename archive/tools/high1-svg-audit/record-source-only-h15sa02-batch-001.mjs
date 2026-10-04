import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-02-batch-001', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|3', '①', { coefficients: { a: -2, b: -12 }, expectedValue: -14, expectedChoiceIndex: 1 }, '(x-3)(2x+4)=2x^2-2x-12.'),
  fact('archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|4', '③', { remainder: -9, expectedChoiceIndex: 3 }, 'R=f(3)=9-15-3=-9.'),
  fact('archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|9', '④', { k: -2, a: -33, b: 59, expectedValue: 24, expectedChoiceIndex: 4 }, 'Coefficient comparison in f(x+k) gives k=-2,a=-33,b=59; k+a+b=24.'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|2', '④', { coefficients: { a: 1, b: 4, c: 3 }, expectedValue: 8, expectedChoiceIndex: 4 }, 'With t=x-1, x^2+2x=t^2+4t+3.'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|17', '③', { remainder: '2x+3', expectedValue: 5, expectedChoiceIndex: 3 }, 'The requested coefficient sum is 2+3=5.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '001_H15-SA-02.json'), `${JSON.stringify({ batchId: 'H15-SA-02-batch-001', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-02-batch-001', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
