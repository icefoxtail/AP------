import path from 'node:path';
import { readExam, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';

const outputDir = import.meta.dirname;
const root = path.resolve(outputDir, '../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js');
const outputFile = path.join(outputDir, 'current-stored-difficulty-only.after-freeze.json');
const exam = readExam(sourceFile);
const fields = ['level', 'difficultyBucket', 'legacyLevelCompatibility'];
const rows = exam.questions.map(question => ({
  qid: Number(question.id),
  fields: Object.fromEntries(fields.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]])),
}));
const ref = writeFresh(outputFile, { schemaVersion: 'JS_ARCHIVE_STORED_DIFFICULTY_ONLY_V1', sourceRawSha256: exam.rawSha256, rows });
console.log(JSON.stringify({ ...ref, sourceRawSha256: exam.rawSha256, qidCount: rows.length, fieldNames: fields }));
