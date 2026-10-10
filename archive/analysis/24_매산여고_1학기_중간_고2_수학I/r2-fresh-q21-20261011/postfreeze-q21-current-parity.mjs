import fs from 'node:fs';
import path from 'node:path';
import { readExam, sha256, physical, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';
import { STUDENT_FIELDS, normalizeStudentBundle } from '../../../tools/archive-student-bundle.mjs';

const root = path.resolve(import.meta.dirname, '../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js');
const bundleFile = path.join(import.meta.dirname, 'full-current-student-only.bundle.json');
const q21BundleFile = path.join(import.meta.dirname, 'q21-current-student-only.json');
const freezeFile = path.join(import.meta.dirname, 'q21-original-freeze.json');
const output = path.join(import.meta.dirname, 'q21-postfreeze-disclosure.json');
const exam = readExam(sourceFile);
const bundle = normalizeStudentBundle(JSON.parse(fs.readFileSync(bundleFile)), { inputFile: sourceFile, expectedSourceRawSha256: exam.rawSha256 });
if (bundle.rows.length !== exam.questions.length || bundle.qids.length !== exam.questions.length) throw new Error('FULL_CURRENT_STUDENT_DENOMINATOR_REQUIRED');
for (let i = 0; i < exam.questions.length; i++) {
  const q = exam.questions[i], row = bundle.rows[i];
  if (Number(q.id) !== row.qid) throw new Error('CURRENT_QID_ORDER_CHANGED:' + row.qid);
  const current = Object.fromEntries([...STUDENT_FIELDS].filter(k => Object.hasOwn(q, k)).map(k => [k, q[k]]));
  if (Array.isArray(current.choices)) current.choices = current.choices.map(c => c && typeof c === 'object' && !Array.isArray(c)
    ? Object.fromEntries(Object.entries(c).filter(([k]) => ['text', 'content', 'value', 'answer'].includes(k))) : c);
  if (JSON.stringify(current) !== JSON.stringify(row.student)) throw new Error('CURRENT_STUDENT_INPUT_PARITY_FAILED:' + row.qid);
}
const freeze = JSON.parse(fs.readFileSync(freezeFile));
const q21Bundle = normalizeStudentBundle(JSON.parse(fs.readFileSync(q21BundleFile)), { inputFile: sourceFile, expectedSourceRawSha256: exam.rawSha256 });
if (freeze.stage !== 'R2' || freeze.sourceRawSha256 !== exam.rawSha256 || freeze.rows?.length !== 1 || freeze.rows[0].qid !== 21) throw new Error('FRESH_Q21_FREEZE_BINDING_INVALID');
if (freeze.studentBundle?.sha256 !== physical(q21BundleFile).sha256 || q21Bundle.rows[0].studentPayloadSha256 !== bundle.rows.find(r => r.qid === 21).studentPayloadSha256) throw new Error('FRESH_Q21_STUDENT_BUNDLE_BINDING_INVALID');
const q = exam.questions.find(item => Number(item.id) === 21);
const fields = ['answer', 'solution', 'explanation', 'sol', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'decisiveStep'];
const value = {
  schemaVersion: 'JS_ARCHIVE_POSTFREEZE_DISCLOSURE_V2',
  originalFreeze: physical(freezeFile),
  studentBundle: physical(bundleFile),
  q21StudentBundle: physical(q21BundleFile),
  sourceRawSha256: exam.rawSha256,
  sourceRawBufferBlobSha1: exam.rawBufferGitBlobSha1,
  originalFreezeSourceRawSha256: freeze.sourceRawSha256,
  studentParity: 'EXACT',
  fullDenominatorParity: { questionCount: exam.questions.length, qids: bundle.qids },
  disclosedQids: [21],
  rows: [{ qid: 21, ...Object.fromEntries(fields.filter(k => Object.hasOwn(q, k)).map(k => [k, q[k]])) }],
  disclosedAt: new Date().toISOString(),
};
console.log(JSON.stringify(writeFresh(output, value), null, 2));
