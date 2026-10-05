import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) : value === undefined ? null : value;
const fact = (questionUid, independentAnswer, facts, evidence, status = 'SOURCE_ONLY_REVIEWED') => {
  const payload = { questionUid, independentAnswer, facts };
  return { ...payload, expectedFactHash: sha(JSON.stringify(stable(payload))), status, reviewPass: 1, batchId: 'H15-SA-01-batch-002', evidence };
};

const rows = [
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|1', '③', { reduction: '2A-(A-B)=A+B', expectedExpression: '-x^2-8x+11', expectedChoiceIndex: 3 }, '2A-(A-B)=A+B=(-2x^2-3x+5)+(x^2-5x+6)=-x^2-8x+11'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|4', 'SOURCE_REVIEW', { reason: 'c is referenced in the assembly-division process but is not defined in content and no image is attached', expectedChoiceIndex: null }, 'Source-only pass cannot determine a,b,c without the missing division-process data', 'SOURCE_REVIEW'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|9', '⑤', { sums: { aPlusB: -2, aTimesB: -1, a5PlusB5: -82 }, mixedTerm: -2, expectedValue: -84, expectedChoiceIndex: 5 }, 'Use S_n=(a+b)S_(n-1)-ab S_(n-2): S5=-82; a^2b^3+a^3b^2=(ab)^2(a+b)=-2; total=-84'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|10', '③', { modulus: 250, reducedBase: 2, power: 2 ** 10, remainder: 24, expectedChoiceIndex: 3 }, '1002≡2 (mod 250), so 1002^10≡2^10=1024≡24 (mod 250)'),
  fact('archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js|23_부영여고_1학기_중간_고1_기출|19', '6', { quotient: 'x+3', coefficientA: 6, expectedValue: 6 }, '(x^2-2x+2)(x+3)=x^3+x^2-4x+6'),
];

const expectedPath = path.join(REPORT, '05_expected_facts.jsonl');
const prior = fs.readFileSync(expectedPath, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const byUid = new Map(prior.map((row) => [row.questionUid, row]));
for (const row of rows) byUid.set(row.questionUid, row);
fs.writeFileSync(expectedPath, `${[...byUid.values()].map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
fs.mkdirSync(path.join(REPORT, 'source_only_batches'), { recursive: true });
fs.writeFileSync(path.join(REPORT, 'source_only_batches', '002_H15-SA-01.json'), `${JSON.stringify({ batchId: 'H15-SA-01-batch-002', reviewPass: 1, questionCount: rows.length, rows }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ batchId: 'H15-SA-01-batch-002', questionCount: rows.length, sourceReviewCount: rows.filter((row) => row.status === 'SOURCE_REVIEW').length }, null, 2));
