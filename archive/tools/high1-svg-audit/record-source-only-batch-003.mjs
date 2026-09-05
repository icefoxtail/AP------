import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-003', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|20', '16', { rewrite: '((x^2+7x+8)-2)((x^2+7x+8)+2)', squareForm: 'P=(x^2+7x+8)^2+(k-4)', k: 4, fOf1: 16 }, 'Let t=x^2+7x+8; (t-2)(t+2)=t^2-4, hence k=4 and f(1)=16.'),
  fact('archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js|23_여수여고_1학기_중간_고1_기출|1', '⑤', { coefficients: { a: 4, b: 0, c: 1 }, expectedValue: 5, expectedChoiceIndex: 5 }, '2A-3B=-4x^2+13xy-11y^2.'),
  fact('archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js|23_여수여고_1학기_중간_고1_기출|2', '①', { relation: 'x-y=1, xy=3/2', expectedValue: '11/2', expectedChoiceIndex: 1 }, 'x^3-y^3=(x-y)(x^2+xy+y^2)=4+xy; x^2+y^2-2xy=1 gives xy=3/2.'),
  fact('archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js|23_여수여고_1학기_중간_고1_기출|3', '⑤', { coefficients: { a: 4, b: 0, c: 1 }, expectedValue: 5, expectedChoiceIndex: 5 }, '(2x-1)(2x^2+x+1)=4x^3+x-1.'),
  fact('archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js|23_여수여고_1학기_중간_고1_기출|4', '②', { congruence: 'x^2=-1, x^4=1', remainder: 'x+7', expectedChoiceIndex: 2 }, 'Modulo x^2+1, A=2+(-3x)+4x+5=x+7.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '003_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-003', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-003', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
