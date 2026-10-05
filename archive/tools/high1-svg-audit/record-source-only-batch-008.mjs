import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-008', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js|25_강남여고_1학기_중간_고1_기출|5', '②', { telescoping: '(x^2-4)(x^2+4)(x^4+16)=x^8-256', expectedChoiceIndex: 2 }, 'The product is (x^4-16)(x^4+16)=x^8-2^8.'),
  fact('archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js|25_강남여고_1학기_중간_고1_기출|16', '④', { unionVolume: '3x^2y-3x^3+x^3=3x^2(y-x)', expectedChoiceIndex: 4 }, 'Three prism volumes minus three pairwise central cubes plus one triple central cube.'),
  fact('archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js|25_강남여고_1학기_중간_고1_기출|17', '⑤', { faceAreas: [3, 9, 27], dimensions: [3, 1, 9], expectedValue: 13, expectedChoiceIndex: 5 }, 'abc=sqrt(3*9*27)=27; (a,b,c)=(3,1,9), sum=13.'),
  fact('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js|25_금당고_1학기_중간_고1_기출|2', '⑤', { expectedExpression: 'x^3+8', expectedChoiceIndex: 5 }, '(x+2)(x^2-2x+4)=x^3+8.'),
  fact('archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js|25_금당고_1학기_중간_고1_기출|3', '③', { reduction: '-A+2B-(-2A+3B)=A-B', expectedExpression: 'xy', expectedChoiceIndex: 3 }, 'A-B=xy.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '008_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-008', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-008', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
