import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])] )) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence) => { const payload = { questionUid, independentAnswer, facts }; return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status: 'SOURCE_ONLY_REVIEWED', reviewPass: 1, batchId: 'H15-SA-01-batch-004', evidence }; };

const rows = [
  fact('archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js|23_여수여고_1학기_중간_고1_기출|19', 'MULTI_PART', { identities: ['(x+y)^3', '(x-y)^3', '(x+y+z)^2', '(x+y)(x^2-xy+y^2)', '(x-y)(x^2+xy+y^2)'], factorizations: ['(x+2y-3z)^2', '(2x-1)^3', '(x-3)(x^2+3x+9)'] }, 'Eight requested identities/factorizations independently expanded and matched.'),
  fact('archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js|23_여천고_1학기_중간_고1_기출|1', '④', { coefficients: { a: 0, b: -5, c: 7 }, expectedValue: 2, expectedChoiceIndex: 4 }, 'With S=A+B and D=A-B, B-2A=(-S-3D)/2=-5xy+7y^2.'),
  fact('archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js|23_여천고_1학기_중간_고1_기출|3', '⑤', { quotient: '3xQ(x)+r', remainder: 'r/3', expectedChoiceIndex: 5 }, 'xP=x(3x-1)Q+rx=(x-1/3)(3xQ+r)+r/3.'),
  fact('archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js|23_여천고_1학기_중간_고1_기출|4', '④', { xy: -6, expectedChoiceIndex: 4 }, 'x^3-y^3=(x-y)^3+3xy(x-y); -27=27+9xy gives xy=-6.'),
  fact('archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js|23_충무고_1학기_중간_고1_기출|5', '①', { xy: -1, expectedValue: 52, expectedChoiceIndex: 1 }, '(x-y)^2=16=x^2+y^2-2xy=14-2xy gives xy=-1; x^3-y^3=64+12xy=52.'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '004_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-004', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-004', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED' }, null, 2));
