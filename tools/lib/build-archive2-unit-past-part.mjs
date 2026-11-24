// The part of a catalog shard that 단원별 기출 (archive/unit-past-exams.html) needs on top of the catalog records (stage 2-3).
//
// Today that screen downloads the whole question list twice over: question-index.js (every question of every grade, 11.6 MB) and the
// whole catalog bundle (about 20 MB) with the approved-metadata sidecar. It joins them in the browser (joinApprovedMetadata in
// archive/unit-past-exams.js) and then counts and picks from the joined rows. The catalog records alone are NOT enough to rebuild that
// join: the screen's unit and sub-unit come from the legacy question index, and the concept / difficulty / default-selectable values come from
// the approved metadata sidecar merged with the foundation runtime (they differ from the catalog's own values for about 5,000 questions).
//
// So this file computes, for every catalog record, exactly the two inputs the join reads, from the SAME sources the screen reads today:
//   index: the columns of the question-index.js row of that question that the screen reads (INDEX_COLUMNS)
//   meta:  the row window.ARCHIVE_QUESTION_METADATA holds for it after archive/question-meta.js and archive/meta-foundation-runtime.js
//          ran (the sidecar row merged with the foundation runtime), cut to the fields the join reads (META_FIELDS)
// The meta rows are not recomputed here: the two browser scripts themselves are run in a sandbox, so there is one definition of the merge.
// The shard stores them next to its records (`unit.index[i]`, `unit.meta[i]` belong to `records[i]`); the screen puts them back into the
// shapes the join takes (archive/archive2-catalog-shards.js unitPastRows) and runs the join unchanged.
//
// Inputs: archive/question-index.js (registered), archive/data/question_metadata.json (the assembly of the registered metadata shards, the
// same input as the question-metadata browser copy). Without the assembled sidecar nothing is stored and the screen keeps the whole-bundle path.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const UNIT_PAST_SCHEMA = 'archive2-catalog-unit-past-v1';
export const QUESTION_INDEX_PATH = 'archive/question-index.js';
export const QUESTION_META_PATH = 'archive/question-meta.js';
export const FOUNDATION_RUNTIME_PATH = 'archive/meta-foundation-runtime.js';
export const SIDECAR_PATH = 'archive/data/question_metadata.json';

// question-index.js columns the screen reads (unit-past-exams.js, unit-past-exams-core.js, archive2-unit-tree.js). The text columns
// (contentText, choicesText, tags) and the image flags are never read there; the exam header columns (school ... examType) are per exam.
export const INDEX_COLUMNS = Object.freeze([
  'id', 'standardUnit', 'standardUnitKey', 'subUnitKey', 'subUnit', 'level', 'school', 'schoolKey', 'examYear', 'semester', 'examType',
]);
// Fields of the merged metadata row that joinApprovedMetadata and validateMetaFoundationSelection read (tests/archive2-catalog-shards-unit-past
// .test.js keeps this list in step with the screen). metadataStatus is written onto the joined row but nothing reads it.
export const META_FIELDS = Object.freeze([
  'questionUid', 'question_uid',
  'subUnitKey', 'sub_unit_key', 'standardUnitKey', 'standard_unit_key', 'subUnit', 'sub_unit',
  'problemTypeKey', 'problem_type_key', 'templateKey', 'template_key', 'L3', 'L4',
  'difficultyBucket', 'defaultSelectable', 'metadataRevision',
  'metaFoundationStatus', 'metaFoundationPackId', 'curriculumKey', 'courseKey', 'L1', 'L2',
]);
const SCOPE_FIELDS = ['curriculumKey', 'courseKey', 'L1', 'L2'];
const TAXONOMY_FIELDS = [...SCOPE_FIELDS, 'problemTypeKey', 'templateKey'];

const pickFields = (row, fields) => {
  const out = {};
  for (const field of fields) if (row && Object.hasOwn(row, field) && row[field] !== undefined) out[field] = row[field];
  return out;
};

export function readQuestionIndex(root) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, QUESTION_INDEX_PATH), 'utf8'), sandbox, { filename: QUESTION_INDEX_PATH });
  if (!Array.isArray(sandbox.window.questionIndex)) throw new Error('question-index.js did not define questionIndex');
  return sandbox.window.questionIndex;
}

// Runs archive/question-meta.js and archive/meta-foundation-runtime.js the way a page does, on the bundle and catalog the builder already
// holds (no second download or second resolve). Returns what they leave on `window`.
export async function runBrowserMetadataScripts(root, { catalog, bundle, canonical, core }) {
  const sandbox = {
    console, URL, TextDecoder, crypto: globalThis.crypto, setTimeout, clearTimeout, Promise,
    document: { baseURI: 'https://shards.invalid/archive/unit-past-exams.html' },
    // question-meta.js asks for the browser copy first and falls back to the full sidecar: only the full one exists here
    fetch: async (url) => {
      const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/+/, ''));
      if (!/archive\/data\/question_metadata\.json$/.test(rel)) return { ok: false, status: 404 };
      const bytes = fs.readFileSync(path.join(root, SIDECAR_PATH));
      return { ok: true, status: 200, json: async () => JSON.parse(new TextDecoder('utf-8').decode(bytes)) };
    },
  };
  sandbox.window = sandbox;
  // The runtime script calls these two; they get the bundle and catalog already loaded (it also writes `health` onto its copy of the catalog).
  sandbox.Archive2Canonical = { ...canonical, loadInputBundle: async () => bundle, resolveCatalog: () => ({ ...catalog }) };
  sandbox.Archive2Core = core;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, QUESTION_META_PATH), 'utf8'), sandbox, { filename: QUESTION_META_PATH });
  vm.runInContext(fs.readFileSync(path.join(root, FOUNDATION_RUNTIME_PATH), 'utf8'), sandbox, { filename: FOUNDATION_RUNTIME_PATH });
  await sandbox.__ARCHIVE_METADATA_READY__;
  await sandbox.__META_FOUNDATION_RUNTIME_READY__;
  const sidecar = sandbox.ARCHIVE_QUESTION_METADATA;
  if (!sidecar || !Array.isArray(sidecar.records) || !sidecar.records.length) throw new Error('the metadata scripts left no sidecar records');
  return {
    metaRecords: sidecar.records,
    runtime: sandbox.ARCHIVE_META_FOUNDATION_RUNTIME,
    subUnitLabels: sandbox.ARCHIVE_SUBUNIT_LABELS,
    labels: sandbox.ARCHIVE_META_FOUNDATION_LABELS,
  };
}

// The same lookups the screen's join makes for a question-index row: file#ordinal first, then the question number. The builder only keeps
// the first, so it refuses a row the join would have found another way.
const normFile = (value) => String(value || '').replace(/\\/g, '/');
const parseNo = (value) => {
  if (typeof value === 'number') return Number.isInteger(value) && value > 0 ? value : null;
  if (typeof value === 'string') { const match = value.match(/\d+/); if (match) { const n = Number(match[0]); return Number.isInteger(n) && n > 0 ? n : null; } }
  return null;
};

// -> { common, rowOf(record) } where rowOf returns [indexTuple|null, metaObject|null] and `common` is what the screen needs once per page.
export async function unitPastExtras(root, ctx) {
  if (!fs.existsSync(path.join(root, SIDECAR_PATH))) return null; // no assembled sidecar: the screen keeps the whole-bundle path
  const { catalog } = ctx;
  const questionIndex = readQuestionIndex(root);
  const { metaRecords, runtime, subUnitLabels } = await runBrowserMetadataScripts(root, ctx);
  const recordByKey = new Map(catalog.records.map((record) => [`${record.sourceFile}#${record.sourceOrdinal}`, record]));
  const metaByKey = new Map(metaRecords.map((meta) => [`${normFile(meta.sourceArchiveFile)}#${meta.sourceOrdinal}`, meta]));
  const metaByNo = new Map();
  for (const meta of metaRecords) {
    const file = normFile(meta.sourceArchiveFile);
    if (meta.sourceQuestionNo === undefined) continue;
    const no = parseNo(meta.sourceQuestionNo);
    if (no !== null) metaByNo.set(`${file}#id:${no}`, meta);
    metaByNo.set(`${file}#id:${meta.sourceQuestionNo}`, meta);
  }
  const indexByKey = new Map();
  for (const row of questionIndex) {
    const key = `${normFile(row.sourceFile)}#${row.sourceOrdinal}`;
    if (!recordByKey.has(key)) throw new Error(`question-index.js row has no catalog record: ${key}`);
    if (indexByKey.has(key)) throw new Error(`question-index.js lists a question twice: ${key}`);
    indexByKey.set(key, row);
    // a row the screen's join would find by question number only is not representable here (never happens today)
    if (!metaByKey.has(key)) {
      const byNo = metaByNo.get(`${normFile(row.sourceFile)}#id:${parseNo(row.id)}`) || metaByNo.get(`${normFile(row.sourceFile)}#id:${row.id}`);
      if (byNo) throw new Error(`question-index.js row is joined to its metadata by question number, not by position: ${key}`);
    }
  }
  const common = {
    schemaVersion: UNIT_PAST_SCHEMA,
    indexColumns: [...INDEX_COLUMNS],
    runtime: {
      ownedScopes: (runtime.ownedScopes || []).map((row) => pickFields(row, SCOPE_FIELDS)),
      taxonomyRows: (runtime.taxonomyRows || []).map((row) => pickFields(row, TAXONOMY_FIELDS)),
    },
    subUnitLabels,
  };
  return {
    common,
    rowOf(record) {
      const key = `${record.sourceFile}#${record.sourceOrdinal}`;
      const indexRow = indexByKey.get(key);
      const meta = metaByKey.get(key);
      let metaOut = null;
      if (meta) {
        metaOut = pickFields(meta, META_FIELDS);
        if (metaOut.questionUid === record.questionUid) metaOut.questionUid = true; // the screen puts the record's own uid back
      }
      return [indexRow ? INDEX_COLUMNS.map((column) => (indexRow[column] === undefined ? null : indexRow[column])) : null, metaOut];
    },
  };
}
