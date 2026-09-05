import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-009', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js|25_금당고_1학기_중간_고1_기출|7', '①', { expanded: 'x^3-x^2+x+3', x2Coefficient: -1, expectedChoiceIndex: 1 }, 'Expand; the x^2 coefficient is -2+1=-1.'),
  fact('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js|25_금당고_1학기_중간_고1_기출|8', '⑤', { allCoefficientSum: 24, constant: -3, excludingConstant: 27, expectedChoiceIndex: 5 }, 'At x=1 the product is 6*4=24; the constant is 3*(-1)=-3, so nonconstant sum is 27.'),
  fact('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js|25_금당고_1학기_중간_고1_기출|17', '④', { recurrence: 'S_n=3S_(n-1)-S_(n-2)', sequence: [2, 3, 7, 18, 47, 123, 322, 843], expectedValue: 843, expectedChoiceIndex: 4 }, 'x+1/x=3; recurrence yields x^7+1/x^7=843.'),
  fact('archive/exams/original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js|21_금당고_2학기_기말_고1_기출|1', '⑤', { termCount: 2 * 3, expectedValue: 6, expectedChoiceIndex: 5 }, 'Each of the 2 terms in (a+b) multiplies each of the 3 terms in (x+y+z), giving 6 terms.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '009_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-009', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-009', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
