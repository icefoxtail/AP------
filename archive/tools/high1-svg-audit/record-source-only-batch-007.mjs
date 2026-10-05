import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-007', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js|24_한영고_1학기_중간_고1_기출|1', '①', { coefficients: { a: 4, b: -6, c: -6 }, expectedValue: -8, expectedChoiceIndex: 1 }, 'From 2A+B=S and A-B=D, A+2B=S-D=4x^2-6xy-6y^2.'),
  fact('archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js|24_한영고_1학기_중간_고1_기출|2', '③', { expectedValue: 40, expectedChoiceIndex: 3 }, 'x^3+y^3=(x+y)^3-3xy(x+y)=64-24=40.'),
  fact('archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js|24_한영고_1학기_중간_고1_기출|12', '④', { shiftedForm: '(x-2)^3+2(x-2)^2-(x-2)-7', coefficients: { a: 1, b: 2, c: -1, d: -7 }, expectedValue: 9, expectedChoiceIndex: 4 }, 'Set t=x-2; P=t^3+2t^2-t-7, so ab+cd=2+7=9.'),
  fact('archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js|24_한영고_1학기_중간_고1_기출|15', '10x+9', { quotient: '2x+2', remainder: '8x+7', placeholders: { 가: 2, 나: '2x', 다: '8x+7' }, expectedValue: '10x+9' }, 'Long division gives 2x+(가)=2x+2, intermediate 2x^2+2x+5, and remainder 8x+7.'),
  fact('archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js|25_강남여고_1학기_중간_고1_기출|1', '②', { expectedExpression: 'x^2-3x+1', expectedChoiceIndex: 2 }, '2A+B=x^2-3x+1.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '007_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-007', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-007', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
