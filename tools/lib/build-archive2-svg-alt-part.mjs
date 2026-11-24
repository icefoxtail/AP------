// The alternative-text records (archive/data/svg-accessibility-index.js) of ONE exam, as a small file (stage: engine-open-lighter, 2026-11-24).
//
// The original-exam window (archive/engine.html) and the problem-sheet window (archive/mixed_engine.html) used to download the whole compiled index
// (about 7 MB raw, 1.4 MB compressed: the Korean names of every figure of every exam) as a parser-blocking script, and window.onload, which starts
// loading the exam, waited for it. A phone on a slow network sat 11 seconds before the exam file was even asked for. The window needs the records of the
// figures this exam draws (question.image / question.solutionImage, what archive/render-authority.js and the legacy renderers look up), so this
// file cuts the index into one file per exam.
//
// What a per-exam file holds: every record of the index whose normalized assetRef (APSvgAccessibility.normalizeAssetRef, the very function the
// resolver keys its table with) is one of the figures the exam names, in the index's own record order, and `refs`, the list of all figures the exam
// names (also those without a record). The window reads `refs` to prove the file covers every figure it is about to draw; a figure the file does not
// cover (an edited question, a file of another release) sends it to the whole index, so the answer of the resolver never changes.
// The file names the release it belongs to (`indexVersion` of the shard index), as the exam-meta files do (build-archive2-exam-meta-part.mjs), and
// uses the same key: first 32 hex digits of sha256 of the exam file name as question-meta.js normalizes it.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { examMetaKey, normalizeExamFile } from './build-archive2-exam-meta-part.mjs';

export const SVG_ALT_SCHEMA = 'archive2-svg-alt-v1';
export const SVG_ALT_DIR = 'svg-alt';
export const SVG_ALT_INDEX_PATH = 'archive/data/svg-accessibility-index.js';
export const SVG_ALT_RESOLVER_PATH = 'archive/svg-accessibility.js';

// The questions of an exam file the way archive/engine.html reads them (window.questionBank, else window.examData.questions / .problems).
export function examQuestions(source) {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(source, sandbox, { timeout: 20000 });
  const bank = sandbox.window.questionBank || sandbox.window.examData;
  return Array.isArray(bank) ? bank : (bank && (bank.questions || bank.problems)) || [];
}

export function svgAltExtras(root, catalog) {
  const require = createRequire(import.meta.url);
  const resolver = require(path.join(root, SVG_ALT_RESOLVER_PATH));
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root, SVG_ALT_INDEX_PATH), 'utf8'), sandbox, { timeout: 60000 });
  const records = sandbox.APSvgAccessibilityIndex && sandbox.APSvgAccessibilityIndex.records;
  if (!Array.isArray(records)) throw new Error('svg accessibility index has no records');
  const keyed = records.map((record) => [resolver.normalizeAssetRef(record && record.assetRef), record]);
  const byRef = new Map();
  for (const [key, record] of keyed) {
    if (!key) continue;
    if (!byRef.has(key)) byRef.set(key, []);
    byRef.get(key).push(record);
  }
  const order = new Map(records.map((record, i) => [record, i]));
  const exams = new Map();
  for (const exam of catalog.exams || []) {
    const name = normalizeExamFile(exam.file);
    if (!name || exams.has(name)) continue;
    const file = path.join(root, 'archive/exams', name);
    let questions = [];
    try { questions = examQuestions(fs.readFileSync(file, 'utf8')); } catch (error) { continue; } // an exam the builder cannot read gets no file: its window reads the whole index
    const refs = new Set();
    for (const question of questions) {
      for (const field of ['image', 'solutionImage']) {
        const ref = question && typeof question[field] === 'string' ? resolver.normalizeAssetRef(question[field]) : '';
        if (ref) refs.add(ref);
      }
    }
    const used = [];
    for (const ref of refs) for (const record of byRef.get(ref) || []) used.push(record);
    used.sort((a, b) => order.get(a) - order.get(b));
    exams.set(name, { refs: [...refs].sort(), records: used });
  }
  return { exams };
}

// { index part, files: Map<relative path, Buffer> }, deterministic: files in key order.
export function projectSvgAlt(extras, indexVersion) {
  const files = new Map();
  const entries = [...extras.exams.entries()].map(([name, part]) => [examMetaKey(name), name, part]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  for (const [key, name, part] of entries) {
    const rel = `${SVG_ALT_DIR}/${key}.json`;
    if (files.has(rel)) throw new Error(`svg-alt key collision: ${key}`);
    files.set(rel, Buffer.from(`${JSON.stringify({ schemaVersion: SVG_ALT_SCHEMA, indexVersion, sourceArchiveFile: name, refs: part.refs, records: part.records })}\n`, 'utf8'));
  }
  return { index: { schemaVersion: SVG_ALT_SCHEMA, dir: SVG_ALT_DIR, count: files.size, key: 'sha256(normalized sourceArchiveFile).hex.slice(0,32)' }, files };
}
