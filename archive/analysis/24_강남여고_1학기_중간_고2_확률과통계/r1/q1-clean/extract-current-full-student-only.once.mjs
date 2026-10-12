import fs from 'node:fs';
import path from 'node:path';
import { readExam, sha256, inside, physical, writeFresh } from '../../../../tools/archive-codex-artifact-io.mjs';
import { STUDENT_FIELDS, normalizeStudentBundle } from '../../../../tools/archive-student-bundle.mjs';

const root = path.resolve(import.meta.dirname, '../../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js');
const assetRoot = path.join(root, 'archive');
const output = path.join(import.meta.dirname, 'current-full-student-only.bundle.json');
const exam = readExam(sourceFile);
const rows = exam.questions.map(question => {
  const qid = Number(question.id);
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
  return { qid, student, assets };
});

const input = {
  schemaVersion: 'JS_ARCHIVE_SOURCE_STUDENT_PAYLOAD_V1',
  sourceRawSha256: exam.rawSha256,
  sourceRawBlobSha1: exam.rawBufferGitBlobSha1,
  questionCount: rows.length,
  qids: rows.map(row => row.qid),
  rows,
};
const bundle = normalizeStudentBundle(input, { inputFile: sourceFile, expectedSourceRawSha256: exam.rawSha256 });
const outputRef = writeFresh(output, bundle);
console.log(JSON.stringify({ ...outputRef, questionCount: bundle.questionCount, qids: bundle.qids, sourceRawSha256: exam.rawSha256, sourceRawBlobSha1: exam.rawBufferGitBlobSha1 }));

