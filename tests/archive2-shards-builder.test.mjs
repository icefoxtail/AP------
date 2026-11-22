// Archive 2.0 shard builder: equivalence checks against the browser's own resolver output.
// One test builds the shards twice into temp folders (nothing is left in the repository) and every
// assertion shares those builds. Assertions state defect conditions, never counts of operating data.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test, before, after } from "node:test";
import { fileURLToPath } from "node:url";
import core from "../archive/archive2-core.js";
import {
  CATALOG_SPLIT_BYTES, EXAM_DROPPED_COLUMNS, EXAM_META_FIELDS, EXAM_META_JOIN_FIELDS, SLIM_DROPPED_COLUMNS,
  SLIM_DROPPED_NESTED, SLIM_DROPPED_NESTED_DEEP, SLIM_REQUIRED_COLUMNS, assembleCatalog, buildArchive2Shards,
  buildShardFiles, decodeCatalogShard, encodeCatalogShard, examMetaPath, readBuildInputs, writeShardFiles,
} from "../archive/tools/build-archive2-shards.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const normalizeFile = (file) => core.normalizeFile(file);
const compareStrings = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

let first, second, tmpA, tmpB, inputs, assembled;

before(async () => {
  tmpA = fs.mkdtempSync(path.join(os.tmpdir(), "archive2-shards-a-"));
  tmpB = fs.mkdtempSync(path.join(os.tmpdir(), "archive2-shards-b-"));
  first = await buildArchive2Shards({ rootDir: root });
  writeShardFiles(first.files, tmpA);
  // Second full build: re-read inputs and re-run the resolver, then compare bytes.
  second = await buildArchive2Shards({ rootDir: root });
  writeShardFiles(second.files, tmpB);
  inputs = first.inputs;
  assembled = { catalog: first.catalog, projectionVersion: first.projectionVersion };
});
after(() => {
  for (const dir of [tmpA, tmpB]) if (dir) fs.rmSync(dir, { recursive: true, force: true });
});

const readPiece = (relative) => fs.readFileSync(path.join(tmpA, relative), "utf8");

// --- static scan: property names the teacher screens read (upper bound) ------------------------
function accessedNames(source) {
  const names = new Set();
  for (const m of source.matchAll(/\??\.([A-Za-z_$][A-Za-z0-9_$]*)/g)) names.add(m[1]);
  for (const m of source.matchAll(/["'`]([A-Za-z_$][A-Za-z0-9_$]*)["'`]/g)) names.add(m[1]);
  for (const m of source.matchAll(/(?:const|let|var)\s*\{([^{}]*)\}\s*=/g))
    for (const part of m[1].split(",")) {
      const name = part.split(":")[0].trim().replace(/=.*$/, "").trim();
      if (/^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
    }
  return names;
}
const PAGES = ["workspace", "index", "unit-past-exams", "problem-bank-search"];
function pageScriptFiles() {
  const files = new Set();
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(root, "archive", `${page}.html`), "utf8");
    files.add(`${page}.html`);
    for (const m of html.matchAll(/<script[^>]*src="([^"]*)"/g)) {
      const src = m[1].replace(/\?.*$/, "");
      // archive2-canonical.js is scanned separately (only its browser-side validators matter).
      if (!/^https?:/.test(src) && src !== "archive2-canonical.js" && fs.existsSync(path.join(root, "archive", src))) files.add(src);
    }
  }
  return [...files].sort(compareStrings);
}
function scriptReads() {
  const reads = new Map();
  for (const file of pageScriptFiles()) {
    for (const name of accessedNames(fs.readFileSync(path.join(root, "archive", file), "utf8"))) {
      if (!reads.has(name)) reads.set(name, new Set());
      reads.get(name).add(file);
    }
  }
  return reads;
}
// archive2-canonical.js: the validators run in the browser; everything from the issued-parent
// display repair on is resolveCatalog (build time only).
function canonicalBrowserReads() {
  const text = fs.readFileSync(path.join(root, "archive/archive2-canonical.js"), "utf8");
  const cut = text.indexOf("const ISSUED_PARENT_DISPLAY_SCOPE");
  assert.ok(cut > 0, "canonical build-time marker moved; update this test");
  return accessedNames(text.slice(0, cut));
}

test("two full builds produce byte-identical files", () => {
  assert.deepEqual([...first.files.keys()].sort(), [...second.files.keys()].sort());
  for (const [relative, text] of first.files) assert.equal(second.files.get(relative), text, `${relative} differs between builds`);
  const onDisk = (dir) => [
    ...["index.json", "exams.json"],
    ...fs.readdirSync(path.join(dir, "catalog")).map((n) => `catalog/${n}`),
    ...fs.readdirSync(path.join(dir, "exam-meta")).map((n) => `exam-meta/${n}`),
  ].sort();
  assert.deepEqual(onDisk(tmpA), [...first.files.keys()].sort());
  for (const relative of first.files.keys())
    assert.equal(fs.readFileSync(path.join(tmpA, relative), "utf8"), fs.readFileSync(path.join(tmpB, relative), "utf8"));
  for (const text of first.files.values()) assert.ok(!text.includes("\r"), "LF only");
});

test("index points at existing pieces whose sha256 and bytes match, with no volatile values", () => {
  const index = JSON.parse(readPiece("index.json"));
  assert.equal(index.schemaVersion, "archive2-shards-index-v1");
  assert.deepEqual(Object.keys(index).sort(), ["catalog", "examMeta", "exams", "inputManifestSha256", "projectionVersion", "schemaVersion"]);
  assert.ok(Buffer.byteLength(readPiece("index.json")) <= 64 * 1024, "index must stay small enough to fetch first");
  const check = (entry) => {
    assert.ok(fs.existsSync(path.join(tmpA, entry.path)), `${entry.path} missing`);
    const bytes = fs.readFileSync(path.join(tmpA, entry.path));
    assert.equal(bytes.length, entry.bytes, `${entry.path} bytes`);
    assert.equal(sha256(bytes), entry.sha256, `${entry.path} sha256`);
  };
  check(index.exams);
  const seen = new Set();
  for (const entry of index.catalog) {
    check(entry);
    assert.ok(!seen.has(entry.path), "duplicate catalog path");
    seen.add(entry.path);
    assert.equal(decodeCatalogShard(readPiece(entry.path)).records.length, entry.records);
  }
  const catalogOnDisk = fs.readdirSync(path.join(tmpA, "catalog")).map((n) => `catalog/${n}`).sort();
  assert.deepEqual(catalogOnDisk, [...seen].sort(), "every catalog file is indexed");
  const metaFiles = fs.readdirSync(path.join(tmpA, "exam-meta"));
  assert.equal(index.examMeta.count, metaFiles.length);
  assert.equal(index.examMeta.dir, "exam-meta/");
  // no commit id / clock anywhere
  const flat = JSON.stringify(index);
  assert.ok(!/"(commit|sha|head|generatedAt|builtAt|time|date)"\s*:/i.test(flat));
  assert.ok(!/20\d\d-\d\d-\d\dT/.test(flat));
});

test("index projectionVersion equals the value the screen computes from the input manifest", async () => {
  const index = JSON.parse(readPiece("index.json"));
  const manifestText = fs.readFileSync(path.join(root, "archive/data/archive2-canonical-input-manifest.json"), "utf8").replace(/\r\n/g, "\n");
  const manifest = JSON.parse(manifestText);
  const computed = await core.Canonical.computeProjectionVersion(manifest.files, core.Canonical.RESOLVER_VERSION);
  assert.equal(index.projectionVersion, computed);
  assert.equal(index.projectionVersion, manifest.projectionVersion);
  assert.equal(assembled.projectionVersion, manifest.projectionVersion);
  assert.equal(index.inputManifestSha256, sha256(manifestText));
  // catalog rows carry canonicalProjectionVersion (dropped from the pieces); it must be that same value
  assert.ok(first.catalog.records.every((r) => r.canonicalProjectionVersion === index.projectionVersion));
});

test("catalog pieces equal the resolveCatalog result column by column for every question", () => {
  const index = JSON.parse(readPiece("index.json"));
  const resolved = first.catalog.records;
  const shardRecords = new Map();
  const pieceOfFile = new Map();
  for (const entry of index.catalog) {
    const { header, records } = decodeCatalogShard(readPiece(entry.path));
    assert.equal(header.key, entry.key);
    for (const record of records) {
      assert.ok(!shardRecords.has(record.questionUid), `duplicate uid ${record.questionUid}`);
      shardRecords.set(record.questionUid, record);
      const file = normalizeFile(record.sourceFile);
      if (pieceOfFile.has(file)) assert.equal(pieceOfFile.get(file), entry.key, `exam ${file} spans two pieces`);
      pieceOfFile.set(file, entry.key);
    }
  }
  assert.equal(shardRecords.size, resolved.length, "every resolved question is in exactly one piece");
  const clean = (value, drop) => Object.fromEntries(Object.entries(value).filter(([k, v]) => !drop.includes(k) && v !== undefined));
  for (const original of resolved) {
    const slim = shardRecords.get(original.questionUid);
    assert.ok(slim, `missing ${original.questionUid}`);
    for (const dropped of SLIM_DROPPED_COLUMNS) assert.ok(!(dropped in slim), `${dropped} must be absent`);
    const keptKeys = Object.keys(original).filter((k) => !SLIM_DROPPED_COLUMNS.includes(k) && original[k] !== undefined).sort();
    assert.deepEqual(Object.keys(slim).sort(), keptKeys, `columns of ${original.questionUid}`);
    for (const key of keptKeys) {
      let expected = original[key];
      if (SLIM_DROPPED_NESTED[key]) expected = clean(expected, SLIM_DROPPED_NESTED[key]);
      for (const [deepPath, keys] of Object.entries(SLIM_DROPPED_NESTED_DEEP)) {
        const [outer, inner] = deepPath.split(".");
        if (outer === key && expected?.[inner] && typeof expected[inner] === "object") expected = { ...expected, [inner]: clean(expected[inner], keys) };
      }
      assert.deepEqual(slim[key], expected, `${key} of ${original.questionUid}`);
    }
  }
});

test("exam-meta pieces equal question_metadata for the read fields, every record", () => {
  const records = inputs.questionMetadata.records;
  const byFile = new Map();
  for (const record of records) {
    assert.equal(record.sourceArchiveFile, normalizeFile(record.sourceArchiveFile), "metadata file names are normalized");
    if (!byFile.has(record.sourceArchiveFile)) byFile.set(record.sourceArchiveFile, []);
    byFile.get(record.sourceArchiveFile).push(record);
  }
  let covered = 0;
  for (const [file, list] of byFile) {
    const relative = examMetaPath(file);
    assert.equal(relative, `exam-meta/${sha256(file)}.json`);
    const doc = JSON.parse(readPiece(relative));
    assert.equal(doc.sourceFile, file);
    assert.equal(doc.records.length, list.length);
    const byUid = new Map(doc.records.map((r) => [r.questionUid, r]));
    for (const record of list) {
      const piece = byUid.get(record.questionUid);
      assert.ok(piece, `exam-meta lacks ${record.questionUid}`);
      const expected = Object.fromEntries(EXAM_META_FIELDS.filter((f) => Object.hasOwn(record, f)).map((f) => [f, record[f]]));
      assert.deepEqual(piece, expected);
      for (const key of Object.keys(piece)) assert.ok(EXAM_META_FIELDS.includes(key));
      covered += 1;
    }
  }
  assert.equal(covered, records.length, "every metadata record is in some piece");
  assert.equal(fs.readdirSync(path.join(tmpA, "exam-meta")).length, byFile.size);
});

test("exams.json equals the catalog exams and sourceHashes, and links pieces by sha256", () => {
  const doc = JSON.parse(readPiece("exams.json"));
  assert.equal(doc.schemaVersion, "archive2-shards-exams-v1");
  const rows = doc.rows.map((row) => Object.fromEntries(doc.columns.map((c, i) => [c, row[i]])));
  const exams = first.catalog.exams;
  assert.equal(rows.length, exams.length);
  const rowByFile = new Map(rows.map((r) => [r.file, r]));
  const jsSha = new Map(first.catalog.sourceHashes.map(([f, s]) => [normalizeFile(f), s]));
  const rawSha = new Map((first.catalog.sourceRawHashes || []).map(([f, s]) => [normalizeFile(f), s]));
  const index = JSON.parse(readPiece("index.json"));
  const pieceByKey = new Map(index.catalog.map((e) => [e.key, e]));
  for (const exam of exams) {
    const file = normalizeFile(exam.file);
    const row = rowByFile.get(file);
    assert.ok(row, `exams.json lacks ${file}`);
    for (const [key, value] of Object.entries(exam)) {
      if (EXAM_DROPPED_COLUMNS.includes(key) || key === "file" || value === undefined) continue;
      assert.deepEqual(row[key], value, `${key} of ${file}`);
    }
    for (const dropped of EXAM_DROPPED_COLUMNS) assert.ok(!doc.columns.includes(dropped));
    assert.equal(row.sha256, jsSha.get(file) ?? null);
    assert.equal(row.rawSha256, rawSha.get(file) ?? null);
    if (row.examMetaSha256 !== null) assert.equal(row.examMetaSha256, sha256(readPiece(examMetaPath(file))));
    if (row.catalogKey !== null) assert.ok(pieceByKey.has(row.catalogKey));
  }
});

test("a piece larger than the split limit holds one subject only (it could not be split further)", () => {
  const index = JSON.parse(readPiece("index.json"));
  const exams = new Map(first.catalog.exams.map((e) => [normalizeFile(e.file), e]));
  for (const entry of index.catalog) {
    if (entry.bytes <= CATALOG_SPLIT_BYTES) continue;
    const subjects = new Set(decodeCatalogShard(readPiece(entry.path)).records.map((r) => String(exams.get(normalizeFile(r.sourceFile))?.subject ?? "")));
    assert.ok(entry.subject !== undefined || subjects.size <= 1, `${entry.key} is oversized yet splittable by subject`);
  }
});

test("columns the screens read are inside the slim columns (static scan, upper bound)", () => {
  const reads = scriptReads();
  const canonicalReads = canonicalBrowserReads();
  const index = JSON.parse(readPiece("index.json"));
  const slimColumns = new Set();
  for (const entry of index.catalog) for (const r of decodeCatalogShard(readPiece(entry.path)).records) for (const k of Object.keys(r)) slimColumns.add(k);
  const universe = new Set(first.catalog.records.flatMap((r) => Object.keys(r)));
  // every record column some screen script or browser validator reads is present in the pieces
  for (const name of universe) {
    if (reads.has(name) || canonicalReads.has(name)) assert.ok(slimColumns.has(name), `column ${name} is read by ${[...(reads.get(name) || ["archive2-canonical.js"])].join(",")} but missing from the pieces`);
  }
  for (const name of SLIM_REQUIRED_COLUMNS) assert.ok(slimColumns.has(name), `required column ${name} missing`);
  // dropped columns are read by nobody
  for (const name of SLIM_DROPPED_COLUMNS) {
    assert.ok(!reads.has(name), `dropped column ${name} is read by ${[...(reads.get(name) || [])].join(",")}`);
    assert.ok(!canonicalReads.has(name), `dropped column ${name} is read by archive2-canonical.js browser code`);
    assert.ok(!slimColumns.has(name));
  }
  // dropped nested keys are read by no screen script
  for (const [column, keys] of Object.entries(SLIM_DROPPED_NESTED))
    for (const key of keys) assert.ok(!reads.has(key), `${column}.${key} dropped but read by ${[...(reads.get(key) || [])].join(",")}`);
  for (const [deep, keys] of Object.entries(SLIM_DROPPED_NESTED_DEEP))
    for (const key of keys) assert.ok(!reads.has(key), `${deep}.${key} dropped but read by ${[...(reads.get(key) || [])].join(",")}`);
  // exam list columns
  const examColumns = new Set(first.catalog.exams.flatMap((e) => Object.keys(e)));
  for (const name of EXAM_DROPPED_COLUMNS) assert.ok(!reads.has(name), `dropped exam column ${name} is read`);
  const kept = JSON.parse(readPiece("exams.json")).columns;
  for (const name of examColumns) if (reads.has(name)) assert.ok(kept.includes(name), `exam column ${name} missing from exams.json`);
});

test("exam-meta keeps every field the original-exam screen reads from question_metadata", () => {
  const source = fs.readFileSync(path.join(root, "archive/question-meta.js"), "utf8");
  const mergeList = /for \(const field of \[([^\]]*)\]\)/.exec(source);
  assert.ok(mergeList, "question-meta.js merge field list moved; update this test");
  const mergeFields = [...mergeList[1].matchAll(/'([A-Za-z0-9_]+)'/g)].map((m) => m[1]);
  assert.ok(mergeFields.length > 10);
  for (const field of mergeFields) assert.ok(EXAM_META_FIELDS.includes(field), `merge field ${field} missing from exam-meta`);
  // join keys question-meta.js indexes the sidecar by
  for (const key of EXAM_META_JOIN_FIELDS) assert.ok(source.includes(`record.${key}`), `question-meta.js no longer reads record.${key}`);
  // fields meta-foundation-runtime.js reads from the base record
  const runtime = fs.readFileSync(path.join(root, "archive/meta-foundation-runtime.js"), "utf8");
  for (const field of ["difficultyBucket", "subUnit"]) {
    assert.ok(runtime.includes(`base.${field}`) || runtime.includes(`base && base.${field}`));
    assert.ok(EXAM_META_FIELDS.includes(field));
  }
});

test("the builder reads the working tree only (no git history, no network)", () => {
  const source = fs.readFileSync(path.join(root, "archive/tools/build-archive2-shards.mjs"), "utf8");
  assert.ok(!/child_process|execSync|spawnSync|fetch\(/.test(source));
  assert.ok(!/\bgit\b.*\b(show|cat-file|log)\b/.test(source));
});

test("catalog piece encodings round-trip and the rows format rejects an ambiguous null", () => {
  const records = [{ a: 1, b: "x", c: { d: [1, 2] } }, { a: 2, b: "y" }];
  for (const format of ["rows", "records"]) {
    const text = encodeCatalogShard({ key: "k" }, records, format);
    assert.deepEqual(decodeCatalogShard(text).records, records);
    assert.ok(text.endsWith("\n") && !text.includes("\r"));
  }
  assert.throws(() => encodeCatalogShard({ key: "k" }, [{ a: null }], "rows"), /null/);
  assert.deepEqual(decodeCatalogShard(encodeCatalogShard({ key: "k" }, [{ a: null }], "records")).records, [{ a: null }]);
});

test("building from inputs does not modify any input file", async () => {
  const watched = ["archive/data/archive2-catalog.json", "archive/data/archive2-canonical-input-manifest.json",
    "archive/data/question_metadata.json", "archive/data/archive2-item-review-overrides.json"];
  const stat = (file) => { const s = fs.statSync(path.join(root, file)); return `${s.size}:${s.mtimeMs}`; };
  const before = watched.map(stat);
  buildShardFiles({ catalog: assembled.catalog, projectionVersion: assembled.projectionVersion,
    inputManifestSha256: inputs.inputManifestSha256, questionMetadata: inputs.questionMetadata });
  assert.deepEqual(watched.map(stat), before);
  // the input reader is a plain function over a root path
  assert.equal(typeof readBuildInputs, "function");
  assert.equal(typeof assembleCatalog, "function");
});
