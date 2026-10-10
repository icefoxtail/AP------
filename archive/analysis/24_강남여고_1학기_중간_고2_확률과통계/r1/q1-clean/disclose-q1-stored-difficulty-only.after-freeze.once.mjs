import path from 'node:path';
import { readExam, writeFresh } from '../../../../tools/archive-codex-artifact-io.mjs';

const outputDir = import.meta.dirname;
const root = path.resolve(outputDir, '../../../../..');
const sourceFile = path.join(root, 'archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_확률과통계.js');
const outputFile = path.join(outputDir, 'q1-current-stored-difficulty-only.after-freeze.json');
const exam = readExam(sourceFile);
const rows = exam.questions.filter(question => Number(question.id) === 1);
if (rows.length !== 1) throw new Error(`Q1_UNIQUE_SOURCE_REQUIRED:${rows.length}`);
const keys = ['level', 'difficultyBucket', 'legacyLevelCompatibility'];
const fields = Object.fromEntries(keys.filter(key => Object.hasOwn(rows[0], key)).map(key => [key, rows[0][key]]));
const ref = writeFresh(outputFile, { schemaVersion: 'JS_ARCHIVE_Q1_STORED_DIFFICULTY_ONLY_V1', qid: 1, sourceRawSha256: exam.rawSha256, fields });
console.log(JSON.stringify({ ...ref, qid: 1, sourceRawSha256: exam.rawSha256, fieldNames: Object.keys(fields) }));
