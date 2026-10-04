import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const provenancePath = path.join(root, 'archive/evidence/alive-hold-replacements-20261004/original-slot-replacements.json');
const provenance = JSON.parse(fs.readFileSync(provenancePath, 'utf8'));
const cases = [
  { source: 'archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js', candidate: 'archive/exams/similar/high/h2/2final/19_순천여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [21] },
  { source: 'archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js', candidate: 'archive/exams/similar/high/h2/2final/21_매산여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [6, 20] },
  { source: 'archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js', candidate: 'archive/exams/similar/high/h2/2final/21_순천여고_2학기_기말_고2_수학II_ALIVE대체.js', qids: [8, 9, 10, 13, 15] },
];
const errors = [];
const sha = data => `sha256:${crypto.createHash('sha256').update(data).digest('hex')}`;
const norm = value => {
  if (Array.isArray(value)) return value.map(norm);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, norm(value[key])]));
  return value;
};
const load = relative => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { timeout: 1000 });
  return context.window;
};
const records = [];
for (const item of cases) {
  const actual = load(item.source), candidate = load(item.candidate);
  for (const qid of item.qids) {
    const row = actual.questionBank.find(question => question.id === qid);
    const expected = candidate.questionBank.find(question => question.id === qid);
    if (!row || !expected) { errors.push(`MISSING_QID:${item.source}/q${qid}`); continue; }
    const expectedImage = expected.image ? `assets/images/${actual.examTitle}/q${qid}.svg` : undefined;
    const projected = { ...expected, ...(expectedImage ? { image: expectedImage } : {}) };
    if (JSON.stringify(norm(row)) !== JSON.stringify(norm(projected))) errors.push(`SLOT_PARITY:${item.source}/q${qid}`);
    if (row.answer !== expected.answer || row.solution !== expected.solution) errors.push(`ANSWER_SOLUTION_PARITY:${item.source}/q${qid}`);
    if (row.image && !fs.existsSync(path.join(root, 'archive', row.image))) errors.push(`IMAGE_MISSING:${item.source}/q${qid}`);
    const sourceRecord = provenance.replacedQuestions.find(record => record.sourcePath === item.source && record.qid === qid);
    if (!sourceRecord) errors.push(`PROVENANCE_MISSING:${item.source}/q${qid}`);
    records.push({ sourcePath: item.source, qid, candidatePath: item.candidate, image: row.image || null, answer: row.answer, sourcePdfSha256: sourceRecord?.sourcePdfSha256 || null, sourceBeforeJsSha256: sourceRecord?.sourceBeforeJsSha256 || null, sourceAfterJsSha256: sourceRecord?.sourceAfterJsSha256 || null });
  }
}
const report = { schemaVersion: 'ALIVE_ORIGINAL_SLOT_REPLACEMENT_TECHNICAL_CHECK_v1', status: errors.length ? 'FAIL' : 'PASS', errors, replacementCount: records.length, records, provenanceSha256: sha(fs.readFileSync(provenancePath)) };
const output = path.join(root, 'archive/evidence/alive-hold-replacements-20261004/original-slot-technical-check.json');
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(JSON.stringify({ status: report.status, count: report.replacementCount, errors }) + '\n');
if (errors.length) process.exitCode = 1;
