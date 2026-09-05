import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value === undefined ? null : value;
}

function fact(questionUid, independentAnswer, facts, evidence) {
  const payload = { questionUid, independentAnswer, facts };
  return {
    ...payload,
    expectedFactHash: sha(JSON.stringify(stable(payload))),
    status: 'SOURCE_ONLY_REVIEWED',
    reviewPass: 1,
    batchId: 'H15-SA-01-batch-001',
    evidence,
  };
}

const rows = [
  fact(
    'archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|1',
    '②',
    { operation: 'A-B', expectedExpression: '-x^2-3x+3', expectedChoiceIndex: 2 },
    'A-B=(x^2-2x+1)-(2x^2+x-2)=-x^2-3x+3',
  ),
  fact(
    'archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|7',
    '③',
    { identity: 'x^2-6x+1=0 => x+1/x=6', intermediate: 'x^3+1/x^3=6^3-3*6=198', expectedValue: 192, expectedChoiceIndex: 3 },
    'x^3-x-1/x+1/x^3=(x^3+1/x^3)-(x+1/x)=198-6=192',
  ),
  fact(
    'archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|8',
    '②',
    { doubleRoot: 'P(-2)=0 and P\'(−2)=0', coefficients: { a: 12, b: 16 }, quotient: 'Q(x)=x-4', q10: 6, expectedValue: 34, expectedChoiceIndex: 2 },
    'P=x^3-ax-b divisible by (x+2)^2 gives a=12,b=16,Q=x-4; 12+16+6=34',
  ),
  fact(
    'archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|15',
    '12',
    { operation: '(x^2+2x+3)^2', expectedCoefficient: { term: 'x', value: 12 } },
    'The x-term comes from 2*(2x)*3, so its coefficient is 12',
  ),
  fact(
    'archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js|23_매산고_1학기_중간_고1_기출|17',
    '216100',
    { operation: '53^3+21*53^2+147*53+443', expectedValue: 216100 },
    '148877+58989+7791+443=216100',
  ),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.existsSync(expectedPath)
  ? fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
  : [];
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '001_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-001', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-001', questionCount: rows.length, status: 'SOURCE_ONLY_REVIEWED', questionUids: rows.map((row) => row.questionUid) }, null, 2));
