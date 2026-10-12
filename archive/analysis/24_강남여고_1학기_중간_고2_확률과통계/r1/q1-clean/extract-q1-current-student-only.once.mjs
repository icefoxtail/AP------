import fs from 'node:fs';
import path from 'node:path';
import { readExam, sha256, inside, writeFresh } from '../../../../tools/archive-codex-artifact-io.mjs';
import { STUDENT_FIELDS, normalizeStudentBundle } from '../../../../tools/archive-student-bundle.mjs';

const outputDir = import.meta.dirname;
const root = path.resolve(outputDir, '../../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js');
const assetRoot = path.join(root, 'archive');
const output = path.join(outputDir, 'current-student-only.bundle.json');
const exam = readExam(sourceFile);
const matches = exam.questions.filter(question => Number(question.id) === 1);
if (matches.length !== 1) throw new Error(`Q1_UNIQUE_SOURCE_REQUIRED:${matches.length}`);
const question = matches[0];
const student = Object.fromEntries([...STUDENT_FIELDS].filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
if (Array.isArray(student.choices)) {
  student.choices = student.choices.map(choice => choice && typeof choice === 'object' && !Array.isArray(choice)
    ? Object.fromEntries(Object.entries(choice).filter(([key]) => ['text', 'content', 'value', 'answer'].includes(key)))
    : choice);
}
const references = new Set();
for (const value of [student.content, student.question, student.sharedContext, student.sharedMaterial, student.commonData, student.commonPassage, student.passage, student.table]) {
  if (typeof value === 'string') for (const match of value.matchAll(/<(?:img|image)\b[^>]*?(?:src|href|xlink:href)\s*=\s*["']([^"']+)/gi)) references.add(match[1]);
}
if (typeof student.image === 'string') references.add(student.image);
const assets = [...references].filter(ref => !/^(?:data:|#)/.test(ref)).map(ref => {
  const file = inside(assetRoot, ref);
  return { ref, path: file, sha256: sha256(fs.readFileSync(file)) };
});
const input = {
  schemaVersion: 'JS_ARCHIVE_SOURCE_STUDENT_PAYLOAD_V1',
  sourceRawSha256: exam.rawSha256,
  sourceRawBlobSha1: exam.rawBufferGitBlobSha1,
  questionCount: 1,
  qids: [1],
  rows: [{ qid: 1, student, assets }],
};
const bundle = normalizeStudentBundle(input, { inputFile: sourceFile, expectedSourceRawSha256: exam.rawSha256 });
const outputRef = writeFresh(output, bundle);
console.log(JSON.stringify({ ...outputRef, questionCount: bundle.questionCount, qids: bundle.qids, sourceRawSha256: exam.rawSha256, sourceRawBlobSha1: exam.rawBufferGitBlobSha1 }));
