import path from 'node:path';
import { readExam, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';

const outputDir = import.meta.dirname;
const root = path.resolve(outputDir, '../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js');
const outputFile = path.join(outputDir, 'current-stored-level-only.after-freeze.json');
const exam = readExam(sourceFile);
const rows = exam.questions.map(question => ({ qid: Number(question.id), level: Object.hasOwn(question, 'level') ? question.level : null }));
const ref = writeFresh(outputFile, { schemaVersion: 'JS_ARCHIVE_STORED_LEVEL_ONLY_V1', sourceRawSha256: exam.rawSha256, rows });
console.log(JSON.stringify({ ...ref, sourceRawSha256: exam.rawSha256, qidCount: rows.length }));
