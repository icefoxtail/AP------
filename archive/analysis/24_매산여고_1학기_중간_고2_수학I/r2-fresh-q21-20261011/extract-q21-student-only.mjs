import fs from 'node:fs';
import path from 'node:path';
import { readExam, sha256, inside, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';
import { STUDENT_FIELDS, normalizeStudentBundle } from '../../../tools/archive-student-bundle.mjs';

const root = path.resolve(import.meta.dirname, '../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js');
const assetRoot = path.join(root, 'archive');
const output = path.join(import.meta.dirname, 'q21-current-student-only.json');
const exam = readExam(sourceFile);
const question = exam.questions.find(item => Number(item.id) === 21);
if (!question) throw new Error('Q21_NOT_FOUND');
const student = Object.fromEntries([...STUDENT_FIELDS].filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
if (Array.isArray(student.choices)) student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice)
  ? Object.fromEntries(Object.entries(choice).filter(([key]) => ['text', 'content', 'value', 'answer'].includes(key)))
  : choice);
const refs = new Set();
for (const value of [student.content, student.question, student.sharedContext, student.sharedMaterial, student.commonData, student.commonPassage, student.passage, student.table]) {
  if (typeof value === 'string') for (const match of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) refs.add(match[1]);
}
if (typeof student.image === 'string') refs.add(student.image);
const assets = [...refs].filter(ref => !/^(?:data:|#)/.test(ref)).map(ref => {
  const file = inside(assetRoot, ref);
  return { ref, path: file, sha256: sha256(fs.readFileSync(file)) };
});
const input = {
  schemaVersion: 'JS_ARCHIVE_SOURCE_STUDENT_PAYLOAD_V1',
  sourceRawSha256: exam.rawSha256,
  sourceRawBlobSha1: exam.rawBufferGitBlobSha1,
  questionCount: 1,
  qids: [21],
  rows: [{ qid: 21, student, assets }],
};
const bundle = normalizeStudentBundle(input, { inputFile: sourceFile, expectedSourceRawSha256: exam.rawSha256 });
console.log(JSON.stringify(writeFresh(output, bundle), null, 2));
