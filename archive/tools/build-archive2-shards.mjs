#!/usr/bin/env node
// Archive 2.0 shard builder (stage 1: builder + equivalence checks only; nothing ships it yet).
//
// The teacher screens currently download ~620 input files and assemble the catalog in the browser
// (archive2-canonical.js loadInputBundle -> resolveCatalog). This tool runs that SAME code once, in
// node, over the local git tree and writes small independent pieces:
//
//   index.json               projection version, input manifest digest, and every piece with sha256/bytes
//   exams.json               exam list (columns the home/finder screens read) + source and exam-meta digests
//   catalog/<grade>-<term>[-<subject>].json   slim catalog rows (one exam never spans two pieces)
//   exam-meta/<sha256(sourceFile)>.json       question_metadata fields the original-exam screen reads
//
// It only READS inputs. Input reading (readBuildInputs / readQuestionMetadata) and piece writing
// (writeShardFiles) are separate functions so a later source change (canonical metadata stored as
// exam pieces) only has to replace the reading part. It never reads git history (no blobs of old
// commits), so a shallow checkout is enough.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import core from "../archive2-core.js";

export const SHARD_BUILDER_VERSION = "archive2-shards-v1";
export const INDEX_SCHEMA = "archive2-shards-index-v1";
export const EXAMS_SCHEMA = "archive2-shards-exams-v1";
export const CATALOG_SHARD_SCHEMA_ROWS = "archive2-catalog-shard-rows-v1";
export const CATALOG_SHARD_SCHEMA_RECORDS = "archive2-catalog-shard-records-v1";
export const EXAM_META_SCHEMA = "archive2-exam-meta-v1";
export const DEFAULT_OUT_DIR = "archive/data/archive2-shards/v1";
export const CATALOG_SHARD_FORMATS = Object.freeze(["rows", "records"]);
// Measured on the real catalog (rows vs one record per line): gzip within 4% of each other, brotli equal,
// "records" parses+materializes faster and is lossless for any value, so it is the default.
export const DEFAULT_CATALOG_FORMAT = "records";
// A catalog piece larger than this (UTF-8 bytes of the encoded file) is split by exam subject.
export const CATALOG_SPLIT_BYTES = 500_000;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const QUESTION_METADATA_PATH = "archive/data/question_metadata.json";
const INPUT_MANIFEST_PATH = "archive/data/archive2-canonical-input-manifest.json";

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const normalizedText = (source) => source.replace(/^﻿/, "").replace(/\r\n/g, "\n");

// ---------------------------------------------------------------------------------------------
// What the pieces keep. These are explicit lists; tests/archive2-shards-builder.test.mjs recomputes
// the property names the teacher screens read (static scan, an upper bound) and fails when a screen
// starts to read a name that is dropped here.
// ---------------------------------------------------------------------------------------------

// Top-level catalog record columns that no teacher-screen script reads. Everything else is kept.
// (assignmentFingerprint, reviewedMiddleParentKey, legacyLevel, sourceQuestionNo, ... are read by the
// canonical validators / key resolver / screens and are NOT in this list.)
export const SLIM_DROPPED_COLUMNS = Object.freeze([
  "approvedSourceFingerprint", // approval bookkeeping of the registrar, not a screen value
  "canonicalAssignmentReasons", // build-time diagnosis text
  "canonicalProjectionVersion", // identical on every row; the index carries it once
  "metaProjectionFailureReason", // build-time diagnosis text
  "rawQuestionHash",
  "rawTaxonomy",
  "sourceGradeReason",
  "sourceGradeStatus",
  "sourceQualityHold",
  "sourceReviewStatus",
  "taxonomyStatus",
]);

// Nested evidence objects keep their shape but lose sub-keys no screen script reads
// (e.g. metadataAssignmentEvidence.evidenceRefs is 4.9 MB of proof file paths).
export const SLIM_DROPPED_NESTED = Object.freeze({
  metadataAssignmentEvidence: Object.freeze(["assignmentFingerprint", "evidenceDigest", "evidenceRefs", "registrationUpdateReviewProof"]),
  metaProjection: Object.freeze(["parentBinding"]),
});
// Same idea one level deeper (metaProjection.sourceBinding is 5.9 MB; the card reads only
// catalogSourceJsSha256 and bindingMode from it).
export const SLIM_DROPPED_NESTED_DEEP = Object.freeze({
  "metaProjection.sourceBinding": Object.freeze(["approvedSourceFingerprint", "assignmentFingerprint", "evidenceRefs", "registrationReview", "sourceRawSha256"]),
});

// Columns that are kept no matter what a static scan finds (validators and resolvers read them by
// computed name or through the canonical authority).
export const SLIM_REQUIRED_COLUMNS = Object.freeze([
  "questionUid", "sourceFile", "sourceOrdinal", "sourceQuestionNo", "sourceFingerprint", "assignmentFingerprint",
  "reviewedMiddleParentKey", "legacyLevel", "difficultyBucket", "year", "identityStatus", "sourceIntegrityStatus",
  "sourceStatus", "sourceGrade", "effectiveBrowseGrade", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4",
  "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey",
]);

// Exam list columns not read by any screen script.
export const EXAM_DROPPED_COLUMNS = Object.freeze(["automaticCount", "rangeEndUnitOrder", "rangeStartUnitOrder"]);

// question_metadata record fields the original-exam screen reads: the join keys question-meta.js
// indexes records by, and the fields mergeArchiveQuestionMetadata copies/compares.
export const EXAM_META_JOIN_FIELDS = Object.freeze(["questionUid", "sourceArchiveFile", "sourceOrdinal"]);
export const EXAM_META_FIELDS = Object.freeze([
  ...EXAM_META_JOIN_FIELDS,
  "curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "secondaryConceptKeys", "curriculumApplicability",
  "defaultSelectable", "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit",
  "conceptClusterKey", "problemTypeKey", "templateKey", "difficultyBucket", "difficultyConfidence",
  "difficultyBoundaryFlag", "legacyLevelCompatibility", "tagConfidence", "tagStatus", "reviewStatus",
  "metadataStatus", "metadataRevision",
]);

// ---------------------------------------------------------------------------------------------
// Input reading (replace this part when the canonical inputs change shape)
// ---------------------------------------------------------------------------------------------

function readRootText(rootDir, relativePath) {
  return normalizedText(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

// The ONE place question_metadata is read. Returns the parsed document.
export function readQuestionMetadata(rootDir = root) {
  return JSON.parse(readRootText(rootDir, QUESTION_METADATA_PATH));
}

// Reads only the local working tree. `fetchInputText` mirrors the browser fetcher contract used by
// loadInputBundle: "/archive/<path>" is under archive/, any other path is under the repo root.
export function readBuildInputs(rootInput = root) {
  const rootDir = path.resolve(rootInput);
  const manifestText = readRootText(rootDir, INPUT_MANIFEST_PATH);
  return {
    rootDir,
    manifestText,
    inputManifestSha256: sha256(manifestText),
    questionMetadata: readQuestionMetadata(rootDir),
    fetchInputText(requestUrl) {
      const pathname = decodeURIComponent(new URL(requestUrl).pathname);
      const isArchivePath = pathname.startsWith("/archive/");
      const relativePath = isArchivePath ? path.posix.join("archive", pathname.slice("/archive/".length)) : pathname.replace(/^\//, "");
      const target = path.resolve(rootDir, relativePath);
      if (target !== rootDir && !target.startsWith(rootDir + path.sep))
        throw new Error("Archive2 shard builder input path escaped the repository root");
      return normalizedText(fs.readFileSync(target, "utf8"));
    },
  };
}

// ---------------------------------------------------------------------------------------------
// Assembly: the browser's own code path, run once in node
// ---------------------------------------------------------------------------------------------

export async function assembleCatalog(inputs) {
  const Canonical = core.Canonical;
  const fetcher = async (requestUrl) => {
    const body = inputs.fetchInputText(requestUrl);
    return { ok: true, status: 200, text: async () => body };
  };
  const versionBundle = await Canonical.loadInputBundle(fetcher, "https://archive2-builder.invalid/archive/");
  const catalog = Canonical.resolveCatalog({ versionBundle });
  return { catalog, projectionVersion: versionBundle.projectionVersion };
}

// ---------------------------------------------------------------------------------------------
// Encoding helpers (pure)
// ---------------------------------------------------------------------------------------------

const GRADE_CODE = Object.freeze({ 중1: "m1", 중2: "m2", 중3: "m3", 고1: "h1", 고2: "h2", 고3: "h3" });
const termSlot = (exam) => {
  const slot = `${exam.semester ?? ""}${exam.examType ?? ""}`;
  return ["1mid", "1final", "2mid", "2final"].includes(slot) ? slot : "etc";
};
export const examMetaPath = (sourceFile) => `exam-meta/${sha256(sourceFile)}.json`;
const normalizeFile = (file) => core.normalizeFile(file);

function dropKeys(value, keys) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const out = {};
  for (const key of Object.keys(value)) if (!keys.includes(key)) out[key] = value[key];
  return out;
}

// Catalog record -> slim record (undefined values are dropped, exactly like JSON would).
export function slimRecord(record) {
  const out = {};
  for (const key of Object.keys(record)) {
    if (SLIM_DROPPED_COLUMNS.includes(key) || record[key] === undefined) continue;
    let value = record[key];
    if (SLIM_DROPPED_NESTED[key]) value = dropKeys(value, SLIM_DROPPED_NESTED[key]);
    for (const [deepPath, keys] of Object.entries(SLIM_DROPPED_NESTED_DEEP)) {
      const [outer, inner] = deepPath.split(".");
      if (outer === key && value && typeof value === "object" && value[inner] && typeof value[inner] === "object")
        value = { ...value, [inner]: dropKeys(value[inner], keys) };
    }
    out[key] = value;
  }
  return out;
}

function compareStrings(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

// "rows": {columns:[...], rows:[[...]]}, one row per line. Absent value -> null (so no kept column may
// hold a null itself; checked). "records": one record object per line (lossless for any value).
export function encodeCatalogShard(header, records, format = DEFAULT_CATALOG_FORMAT) {
  if (!CATALOG_SHARD_FORMATS.includes(format)) throw new Error(`unknown catalog shard format: ${format}`);
  const head = JSON.stringify(header).slice(0, -1);
  if (format === "records")
    return `${head},"schemaVersion":"${CATALOG_SHARD_SCHEMA_RECORDS}","records":[\n${records.map((r) => JSON.stringify(r)).join(",\n")}\n]}\n`;
  const columns = [...new Set(records.flatMap((r) => Object.keys(r)))].sort(compareStrings);
  const rows = records.map((record) => columns.map((column) => {
    const value = record[column];
    if (value === null) throw new Error(`catalog column ${column} holds null; rows format cannot tell it from absent`);
    return value === undefined ? null : value;
  }));
  return `${head},"schemaVersion":"${CATALOG_SHARD_SCHEMA_ROWS}","columns":${JSON.stringify(columns)},"rows":[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]}\n`;
}

// Inverse of encodeCatalogShard (what a screen would do after JSON.parse).
export function decodeCatalogShard(text) {
  const doc = JSON.parse(text);
  if (doc.schemaVersion === CATALOG_SHARD_SCHEMA_RECORDS) return { header: doc, records: doc.records };
  if (doc.schemaVersion !== CATALOG_SHARD_SCHEMA_ROWS) throw new Error("unknown catalog shard schema");
  const records = doc.rows.map((row) => {
    const record = {};
    doc.columns.forEach((column, index) => { if (row[index] !== null) record[column] = row[index]; });
    return record;
  });
  return { header: doc, records };
}

// ---------------------------------------------------------------------------------------------
// Piece building (pure: same inputs -> same bytes, no clock, no commit id)
// ---------------------------------------------------------------------------------------------

export function buildShardFiles({ catalog, projectionVersion, inputManifestSha256, questionMetadata, format = DEFAULT_CATALOG_FORMAT }) {
  const files = new Map();
  const exams = [...catalog.exams].sort((a, b) => compareStrings(normalizeFile(a.file), normalizeFile(b.file)));
  const examByFile = new Map(exams.map((exam) => [normalizeFile(exam.file), exam]));
  const jsSha = new Map((catalog.sourceHashes || []).map(([file, sha]) => [normalizeFile(file), String(sha).toLowerCase()]));
  const rawSha = new Map((catalog.sourceRawHashes || []).map(([file, sha]) => [normalizeFile(file), String(sha).toLowerCase()]));

  // --- exam-meta pieces (every sourceArchiveFile in question_metadata; lossless for the kept fields)
  const metaByFile = new Map();
  for (const record of questionMetadata.records || []) {
    const file = normalizeFile(record.sourceArchiveFile);
    if (!metaByFile.has(file)) metaByFile.set(file, []);
    metaByFile.get(file).push(record);
  }
  const examMetaSha = new Map();
  for (const file of [...metaByFile.keys()].sort(compareStrings)) {
    const rows = metaByFile.get(file)
      .map((record) => Object.fromEntries(EXAM_META_FIELDS.filter((field) => Object.hasOwn(record, field)).map((field) => [field, record[field]])))
      .sort((a, b) => (Number(a.sourceOrdinal) - Number(b.sourceOrdinal)) || compareStrings(String(a.questionUid), String(b.questionUid)));
    const text = `{"schemaVersion":"${EXAM_META_SCHEMA}","sourceFile":${JSON.stringify(file)},"records":[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]}\n`;
    const piecePath = examMetaPath(file);
    files.set(piecePath, text);
    examMetaSha.set(file, sha256(text));
  }

  // --- catalog pieces: one exam never spans two pieces
  const recordsByFile = new Map();
  for (const record of catalog.records) {
    const file = normalizeFile(record.sourceFile);
    if (!recordsByFile.has(file)) recordsByFile.set(file, []);
    recordsByFile.get(file).push(record);
  }
  const gradeOf = (file) => {
    const exam = examByFile.get(file);
    return String(exam?.effectiveBrowseGrade || exam?.grade || recordsByFile.get(file)?.[0]?.effectiveBrowseGrade || "");
  };
  const groups = new Map();
  for (const file of [...recordsByFile.keys()].sort(compareStrings)) {
    const grade = gradeOf(file);
    const term = examByFile.has(file) ? termSlot(examByFile.get(file)) : "etc";
    const key = `${GRADE_CODE[grade] || "x"}-${term}`;
    if (!groups.has(key)) groups.set(key, { key, grade, term, files: [] });
    groups.get(key).files.push(file);
  }
  const catalogKeyByFile = new Map();
  const catalogIndex = [];
  const emit = (key, grade, term, subject, fileList) => {
    const records = fileList.flatMap((file) => [...recordsByFile.get(file)]
      .sort((a, b) => (Number(a.sourceOrdinal) - Number(b.sourceOrdinal)) || compareStrings(String(a.questionUid), String(b.questionUid)))
      .map(slimRecord));
    const header = { key, grade, term, ...(subject === undefined ? {} : { subject }) };
    const text = encodeCatalogShard(header, records, format);
    return { key, grade, term, subject, fileList, records, text };
  };
  for (const group of [...groups.values()].sort((a, b) => compareStrings(a.key, b.key))) {
    let pieces = [emit(group.key, group.grade, group.term, undefined, group.files)];
    if (Buffer.byteLength(pieces[0].text) > CATALOG_SPLIT_BYTES) {
      const bySubject = new Map();
      for (const file of group.files) {
        const subject = String(examByFile.get(file)?.subject ?? "");
        if (!bySubject.has(subject)) bySubject.set(subject, []);
        bySubject.get(subject).push(file);
      }
      if (bySubject.size > 1)
        pieces = [...bySubject.keys()].sort(compareStrings).map((subject) =>
          emit(`${group.key}-${sha256(subject).slice(0, 8)}`, group.grade, group.term, subject, bySubject.get(subject)));
    }
    for (const piece of pieces) {
      const piecePath = `catalog/${piece.key}.json`;
      files.set(piecePath, piece.text);
      for (const file of piece.fileList) catalogKeyByFile.set(file, piece.key);
      catalogIndex.push({
        key: piece.key, grade: piece.grade, term: piece.term,
        ...(piece.subject === undefined ? {} : { subject: piece.subject }),
        path: piecePath, sha256: sha256(piece.text), bytes: Buffer.byteLength(piece.text), records: piece.records.length,
      });
    }
  }

  // --- exams.json
  const examColumns = [...new Set(exams.flatMap((exam) => Object.keys(exam)))].filter((c) => !EXAM_DROPPED_COLUMNS.includes(c)).sort(compareStrings);
  const extraColumns = ["catalogKey", "examMetaSha256", "rawSha256", "sha256"];
  const examRows = exams.map((exam) => {
    const file = normalizeFile(exam.file);
    const row = examColumns.map((column) => {
      const value = column === "file" ? file : exam[column];
      if (value === null) throw new Error(`exam column ${column} holds null; rows format cannot tell it from absent`);
      return value === undefined ? null : value;
    });
    row.push(catalogKeyByFile.get(file) ?? null, examMetaSha.get(file) ?? null, rawSha.get(file) ?? null, jsSha.get(file) ?? null);
    return row;
  });
  const examsText = `{"schemaVersion":"${EXAMS_SCHEMA}","columns":${JSON.stringify([...examColumns, ...extraColumns])},"rows":[\n${examRows.map((r) => JSON.stringify(r)).join(",\n")}\n]}\n`;
  files.set("exams.json", examsText);

  // --- index.json (no commit id, no clock)
  const index = {
    schemaVersion: INDEX_SCHEMA,
    projectionVersion,
    inputManifestSha256,
    exams: { path: "exams.json", sha256: sha256(examsText), bytes: Buffer.byteLength(examsText) },
    catalog: catalogIndex,
    examMeta: { dir: "exam-meta/", count: examMetaSha.size },
  };
  files.set("index.json", JSON.stringify(index) + "\n");
  return files;
}

// ---------------------------------------------------------------------------------------------
// Output (separate from reading and building)
// ---------------------------------------------------------------------------------------------

export function writeShardFiles(files, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const sub of ["catalog", "exam-meta"]) {
    const dir = path.join(outDir, sub);
    fs.mkdirSync(dir, { recursive: true });
    for (const name of fs.readdirSync(dir)) // stale pieces of an older build; only inside the two piece folders
      if (name.endsWith(".json") && !files.has(`${sub}/${name}`)) fs.rmSync(path.join(dir, name));
  }
  for (const [relative, text] of files) fs.writeFileSync(path.join(outDir, relative), text);
}

export async function buildArchive2Shards({ rootDir = root, format = DEFAULT_CATALOG_FORMAT } = {}) {
  const inputs = readBuildInputs(rootDir);
  const { catalog, projectionVersion } = await assembleCatalog(inputs);
  const files = buildShardFiles({ catalog, projectionVersion, inputManifestSha256: inputs.inputManifestSha256, questionMetadata: inputs.questionMetadata, format });
  return { files, catalog, projectionVersion, inputs };
}

async function main(argv) {
  const arg = (name, fallback) => {
    const at = argv.indexOf(name);
    return at >= 0 ? argv[at + 1] : fallback;
  };
  const rootDir = path.resolve(arg("--root", root));
  const outDir = path.resolve(rootDir, arg("--out", DEFAULT_OUT_DIR));
  const format = arg("--format", DEFAULT_CATALOG_FORMAT);
  const started = Date.now();
  const { files } = await buildArchive2Shards({ rootDir, format });
  writeShardFiles(files, outDir);
  const bytes = [...files.values()].reduce((sum, text) => sum + Buffer.byteLength(text), 0);
  console.log(`archive2 shards: ${files.size} files, ${bytes} bytes -> ${outDir} (${Date.now() - started} ms, peak RSS ${Math.round(process.resourceUsage().maxRSS / 1024)} MB)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => { console.error(error.stack || error.message); process.exit(1); });
}
