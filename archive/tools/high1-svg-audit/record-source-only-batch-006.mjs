import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence, status = 'SOURCE_ONLY_REVIEWED') => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status, reviewPass: 1, batchId: 'H15-SA-01-batch-006', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|3', '②', { sum: 'x+y=2', product: 'xy=-1', expectedValue: 14, expectedChoiceIndex: 2 }, 'x^3+y^3=(x+y)^3-3xy(x+y)=8+6=14.'),
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|8', '③', { quotient: 'x^2+2', remainder: 1, expectedChoiceIndex: 3 }, '2x^3-x^2+4x-1=(2x-1)(x^2+2)+1.'),
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|13', 'SOURCE_REVIEW', { reason: 'R is not defined in content; likely the remainder after division by x+1, but source definition is absent', reconstructedValue: 7 }, 'P=(x^3+x)(x+3)+x+5; dividing the reconstructed P by x+1 gives R=0 and Q(1)=7, but R must be source-confirmed.', 'SOURCE_REVIEW'),
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|14', '③', { squareForm: '(x^2+x-9)^2', k: 9, expectedChoiceIndex: 3 }, 'Product expands to x^4+2x^3-17x^2-18x+72; adding 9 makes (x^2+x-9)^2.'),
  fact('archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js|24_여수고_1학기_중간_고1_기출|17', '②', { shiftedForm: '(x-1)^3+(x-1)^2+2(x-1)-2', coefficients: { a: 1, b: 1, c: 2, d: -2 }, expectedValue: -4, expectedChoiceIndex: 2 }, 'Set t=x-1; P=t^3+t^2+2t-2, so abcd=-4.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '006_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-006', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-006', questionCount: rows.length, sourceReviewCount: rows.filter((row) => row.status === 'SOURCE_REVIEW').length }, null, 2));
