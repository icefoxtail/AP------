import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-005', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js|23_충무고_1학기_중간_고1_기출|7', '①', { sum: 'a+b=4', product: 'ab=7', expectedValue: -20, expectedChoiceIndex: 1 }, 'x^3 coefficient gives a+b=4; x^2 coefficient gives ab=7; a^3+b^3=4^3-3*7*4=-20.'),
  fact('archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js|2023_한영고_1학기_중간_고1_수학상|1', '②', { expectedValue: 8, expectedChoiceIndex: 2 }, 'A+B=2x^2+8x+7, so a=8.'),
  fact('archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js|2023_한영고_1학기_중간_고1_수학상|4', '①', { expectedValue: 11, expectedChoiceIndex: 1 }, 'a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=9+2=11.'),
  fact('archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js|2023_한영고_1학기_중간_고1_수학상|19', '6', { squareForm: '(x^2-5x+5)^2', k: 1, fOf5: 5, expectedValue: 6 }, 'Product expands to x^4-10x^3+35x^2-50x+24; adding k=1 gives (x^2-5x+5)^2 and k+f(5)=6.'),
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|1', '④', { reduction: 'A+2B-2(C+B)=A-2C', expectedExpression: '3x^2+2x-5', expectedChoiceIndex: 4 }, 'A-2C=(x^2+4x-1)-2(-x^2+x+2)=3x^2+2x-5.'),
];

// Correct the first row's deliberate intermediate note by recording the exact answer for q1.
rows[1].independentAnswer = '②';
rows[1].facts.expectedValue = 8;
rows[1].facts.expectedChoiceIndex = 2;
rows[1].evidence = 'A+B=2x^2+8x+7, so a=8, which is choice ②.';
rows[1].expectedFactHash = sha(JSON.stringify(stable({ questionUid: rows[1].questionUid, independentAnswer: rows[1].independentAnswer, facts: rows[1].facts })));

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '005_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-005', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-005', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
