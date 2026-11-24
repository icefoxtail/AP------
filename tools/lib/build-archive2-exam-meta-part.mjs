// The approved question metadata of ONE exam, as a small file (stage: exam-meta per exam, 2026-11-24).
//
// The original-exam window (archive/engine.html) opened for a class assignment (`submitQr=1` / `osqr=1`, which the issuing flow adds by itself)
// used to download the whole approved metadata copy (archive/data/question-metadata-browser-v1.json, about 4 MB compressed) and wait for it
// before the first question was drawn, to read three values per question (standardUnitKey, standardUnit, standardCourse: what the class
// registration sends to the server). This file cuts that copy into one file per exam, so the window downloads a few KB.
//
// What a per-exam file holds is exactly the records of that exam in the browser copy (same fields, same values, same order:
// BROWSER_RECORD_FIELDS of build-question-metadata-browser.mjs), so archive/question-meta.js builds the same lookup tables from it and
// mergeArchiveQuestionMetadata gives the same answer for every question of the exam. The file lives next to the catalog shards
// (archive/data/archive2-catalog-shards-v1/exam-meta/<key>.json) and names the release it belongs to (`indexVersion` of the shard index), so
// the window can tell a file of another release from the index it fetches with it and then reads the whole copy instead.
//
// Key: the first 32 hex digits of sha256 of the exam file name as question-meta.js normalizes it (sourceFile()), so the browser needs no list.
// A record belongs to the exam whose normalized name equals the record's own `sourceArchiveFile` (question-meta.js indexes records by that raw
// string and looks them up by the normalized name, so a record whose name is not normalized is not reachable today either).
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { BROWSER_RECORD_FIELDS } from './build-question-metadata-browser.mjs';

export const EXAM_META_SCHEMA = 'archive2-exam-meta-v1';
export const EXAM_META_DIR = 'exam-meta';
export const SIDECAR_PATH = 'archive/data/question_metadata.json';

// The same normalization as archive/question-meta.js sourceFile() (the test keeps them in step by running both).
export const normalizeExamFile = (value) => String(value || '').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').replace(/[?#].*$/, '').trim();
export const examMetaKey = (file) => crypto.createHash('sha256').update(normalizeExamFile(file), 'utf8').digest('hex').slice(0, 32);

// null when the assembled sidecar is not there (a checkout without it): the window then reads the whole copy as before.
export function examMetaExtras(root, catalog) {
  const file = path.join(root, SIDECAR_PATH);
  if (!fs.existsSync(file)) return null;
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(doc.records)) throw new Error('question metadata has no records');
  const keep = new Set(BROWSER_RECORD_FIELDS);
  const byFile = new Map();
  // every exam of the catalog gets a file, empty when it has no metadata ("no metadata" is an answer too, so the window need not read the whole copy)
  for (const exam of catalog.exams || []) byFile.set(normalizeExamFile(exam.file), []);
  for (const record of doc.records) {
    const slim = {};
    for (const key of Object.keys(record)) if (keep.has(key)) slim[key] = record[key];
    const name = String(record.sourceArchiveFile || '');
    if (name !== normalizeExamFile(name)) continue; // unreachable by the lookup, as today
    if (!byFile.has(name)) byFile.set(name, []);
    byFile.get(name).push(slim);
  }
  return { byFile };
}

// { index part, files: Map<relative path, Buffer> }, deterministic: files in key order, records in the sidecar's order.
export function projectExamMeta(extras, indexVersion) {
  const files = new Map();
  const entries = [...extras.byFile.entries()].map(([name, records]) => [examMetaKey(name), name, records]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  for (const [key, name, records] of entries) {
    if (files.has(`${EXAM_META_DIR}/${key}.json`)) throw new Error(`exam-meta key collision: ${key}`);
    files.set(`${EXAM_META_DIR}/${key}.json`, Buffer.from(`${JSON.stringify({ schemaVersion: EXAM_META_SCHEMA, indexVersion, sourceArchiveFile: name, records })}\n`, 'utf8'));
  }
  return { index: { schemaVersion: EXAM_META_SCHEMA, dir: EXAM_META_DIR, count: files.size, key: 'sha256(normalized sourceArchiveFile).hex.slice(0,32)' }, files };
}
