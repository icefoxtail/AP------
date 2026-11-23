// Catalog shards: the resolved Archive 2.0 question catalog, cut into pieces a screen can fetch one at a time.
//
// Today every teacher screen that needs the question list (문제지 만들기, 학교 모의고사, 단원별 기출, 문제은행 검색) downloads
// the whole catalog: archive2-catalog.json plus the 595 reviewed-exam-meta proofs, the runtime packs and the classification
// registries, about 21 MB over about 670 requests, and then runs resolveCatalog() in the browser. The pool keeps growing.
// This builder runs the SAME loader and resolver (archive/archive2-canonical.js, read only) once in Node, drops the record
// columns no screen reads, and writes the records as shards: middle school by grade, high school by subject (the 2015 and
// 2022 courses of one subject in one shard, from archive/data/meta-foundation/course-aliases.v1.json). A shard that is
// still too big is split by semester, then by year. An exam is never split across shards.
//
// STAGE 1 (this file): the shards are built, shipped and checked; no screen reads them yet. Nothing here changes what the
// screens do today. Like archive/data/exam-list-v1.json (tools/lib/build-exam-list.mjs) and the question-metadata browser
// copy (tools/lib/build-question-metadata-browser.mjs) the output is a release-build projection: it is not in git and it is
// not an authority. The authority stays archive2-catalog.json + the canonical input manifest; the index carries the same
// projection version string the screens send to the server as index_version, so a shard set always names the inputs it
// was built from.
//
// WHY THE BUILD MAY FAIL WITHOUT STOPPING THE RELEASE: the question-metadata browser copy (#2778) stops the build when it
// cannot be made, because a screen already reads it. No screen reads the shards yet, so a shard failure must not keep a
// student-site release from going out: tools/build-archive-pages-site.mjs `addCatalogShards` catches the failure, prints a
// warning and ships the site without shards (the release identity is computed with the same function, so it agrees).
// Make it a hard failure in the same change that makes a screen read the shards.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const CATALOG_SHARDS_DIR = 'archive/data/archive2-catalog-shards-v1';
export const CATALOG_SHARDS_INDEX_PATH = `${CATALOG_SHARDS_DIR}/index.json`;
export const CATALOG_SHARDS_INDEX_SCHEMA = 'archive2-catalog-shards-v1';
export const CATALOG_SHARD_FILE_SCHEMA = 'archive2-catalog-shard-v1';
// Registered files the shards are derived from (the release identity checks they are in the registered snapshot). The other
// ~675 inputs are bound by sha256 through the canonical input manifest, which loadInputBundle verifies file by file.
export const CATALOG_SHARDS_INPUTS = Object.freeze([
  'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
  'archive/data/meta-foundation/course-aliases.v1.json',
]);
export const COURSE_ALIASES_PATH = 'archive/data/meta-foundation/course-aliases.v1.json';
export const CANONICAL_JS_PATH = 'archive/archive2-canonical.js';

// A shard whose records serialize to more than this many bytes (before compression) is split. Measured: the catalog's records
// compress 10.5:1 to 12:1 (worst shard 0.095), so 18 MB is at most about 1.7 MB gzip, under the 2 MB target for one shard
// (docs/agents/archive2-code.md). The split is decided on raw bytes, not on a gzip result, so two builds on different zlib
// versions cut the same way.
export const SHARD_RAW_LIMIT_BYTES = 18_000_000;
export const SHARD_GZIP_TARGET_BYTES = 2 * 1024 * 1024;

// ---- the slim record -------------------------------------------------------------------------------------------------
// A record column is dropped only when NO browser script reads it by name (tests/archive2-catalog-shards.test.js scans
// archive/*, archive/js/*, apmath/js/* for every name below and fails when one is read). Everything else is kept as it is, so a
// column the catalog gains later is kept until someone proves it unread and lists it here.
export const DROPPED_RECORD_FIELDS = Object.freeze([
  'sourceGradeStatus', 'sourceGradeReason', // written by resolveCatalog next to sourceGrade; only sourceGrade is read
  'legacyLevel', // the old 하/중/상 word; screens read difficultyBucket (AGENTS.md: level words are not used)
  'rawQuestionHash', // content hash of the raw question text; screens and the Worker use sourceFingerprint
  'taxonomyStatus', 'canonicalAssignmentReasons', 'metaProjectionFailureReason', 'sourceReviewStatus', 'sourceQualityHold',
  'rawTaxonomy', // the unverified path before approval; screens read unverifiedTaxonomy (kept)
]);
// Review-evidence columns that some screen reads a few keys of: only those keys are kept, in their original order. The rest is
// proof material (evidence file lists, hashes already present as sourceFingerprint, review notes) that no screen shows.
export const PROJECTED_RECORD_FIELDS = Object.freeze({
  // problem-bank-meta.js: record.assignmentEvidence?.reviewEvidence?.reference / .sha256 (registered projection check)
  assignmentEvidence: Object.freeze({ reviewEvidence: Object.freeze(['reference', 'sha256']) }),
  // problem-bank-meta.js (metadataRevision, rpmMetadata, fieldStatus), rpm-middle-toc.js (rpmMetadata, sourceFingerprint),
  // archive2-unified-units.js (rpmMetadata.rpmCurriculum), problem-bank-search.html (fieldStatus)
  metadataAssignmentEvidence: Object.freeze(['fieldStatus', 'metadataRevision', 'rpmMetadata', 'sourceFingerprint']),
});

function project(value, spec) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const out = {};
  for (const key of Object.keys(value)) {
    if (Array.isArray(spec)) { if (spec.includes(key)) out[key] = value[key]; }
    else if (Object.hasOwn(spec, key)) out[key] = project(value[key], spec[key]);
  }
  return out;
}

export function slimRecord(record) {
  const dropped = new Set(DROPPED_RECORD_FIELDS);
  const out = {};
  for (const key of Object.keys(record)) {
    if (dropped.has(key)) continue;
    out[key] = Object.hasOwn(PROJECTED_RECORD_FIELDS, key) ? project(record[key], PROJECTED_RECORD_FIELDS[key]) : record[key];
  }
  return out;
}

// ---- which shard an exam belongs to ----------------------------------------------------------------------------------
const compact = (value) => String(value ?? '').normalize('NFC').replace(/\s/g, '');
const keyOfGroupId = (id) => String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// aliasDoc = archive/data/meta-foundation/course-aliases.v1.json. Returns bucketOf(courseName) -> { key, label } | null.
// Successor groups (the same subject under the 2015 and 2022 names: 수학I / 대수, 수학(상·하) / 공통수학1·2 ...) are one bucket;
// a high-school spelling group that is in no successor group (확률과 통계, 기하) is a bucket of its own. Nothing is inferred.
export function makeCourseBuckets(aliasDoc) {
  const spelling = new Map();
  for (const group of aliasDoc?.spellingGroups || []) for (const member of group.members || []) spelling.set(compact(member), group);
  const canonical = (value) => { const g = spelling.get(compact(value)); return g ? compact(g.members[0]) : compact(value); };
  const byName = new Map();
  const buckets = new Map();
  const add = (name, bucket) => { buckets.set(bucket.key, bucket); byName.set(canonical(name), bucket); };
  for (const group of aliasDoc?.successorGroups || []) {
    const bucket = { key: keyOfGroupId(group.id), label: group.subject || group.id };
    for (const courses of Object.values(group.curricula || {})) for (const course of courses) add(course, bucket);
  }
  for (const group of aliasDoc?.spellingGroups || []) {
    if (!/^고/.test(group.grade || '')) continue;
    if (byName.has(canonical(group.members[0]))) continue;
    const bucket = { key: keyOfGroupId(group.id), label: group.members[0] };
    for (const member of group.members) add(member, bucket);
  }
  return { bucketOf: (name) => byName.get(canonical(name)) || null, all: () => [...buckets.values()] };
}

const MIDDLE_GRADES = ['중1', '중2', '중3'];
export const OTHER_SHARD = Object.freeze({ key: 'etc', label: '기타' });
const SHARD_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// One exam -> its bucket { key, label, kind }. Middle school: its grade. High school: the course bucket of the first name that
// resolves (registered primary course, then the exam's subject, then the subject without the file-name "c" suffix, then the
// course ranges); a 고1 exam that names no course is the 고1 common-course bucket. Anything else (textbook sets and
// type sets with no course name, unknown subjects) is the "기타" shard, so no record is dropped.
export function bucketOfExam(exam, buckets, highCommonBucket) {
  const grade = String(exam?.grade || exam?.sourceGrade || '');
  if (MIDDLE_GRADES.includes(grade)) return { key: `m${grade.slice(1)}`, label: grade, kind: 'grade', grade };
  const subject = String(exam?.subject || '');
  const names = [exam?.primaryStandardCourse, subject, subject.replace(/c$/, ''), ...(exam?.courseRanges || []).map((range) => range?.standardCourse)];
  for (const name of names) {
    if (!String(name || '').trim()) continue;
    const bucket = buckets.bucketOf(name);
    if (bucket) return { ...bucket, kind: 'course' };
  }
  if (grade === '고1' && highCommonBucket) return { ...highCommonBucket, kind: 'course' };
  return { ...OTHER_SHARD, kind: 'other' };
}

// ---- partition and split ---------------------------------------------------------------------------------------------
const byteLength = (text) => Buffer.byteLength(text, 'utf8');

// groups: Map<exam file, { exam, lines: string[], bytes }>. Returns [{ suffix, split, files }]; one entry when it fits.
export function splitBucketFiles(groups, limit = SHARD_RAW_LIMIT_BYTES) {
  const files = [...groups.keys()];
  const total = files.reduce((sum, file) => sum + groups.get(file).bytes, 0);
  if (total <= limit) return [{ suffix: '', split: null, files }];
  const semesterOf = (file) => { const s = String(groups.get(file).exam?.semester ?? '').trim(); return /^[12]$/.test(s) ? s : '0'; };
  const parts = new Map();
  for (const file of files) { const s = semesterOf(file); if (!parts.has(s)) parts.set(s, []); parts.get(s).push(file); }
  const out = [];
  for (const [semester, part] of [...parts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const partBytes = part.reduce((sum, file) => sum + groups.get(file).bytes, 0);
    const base = { suffix: `-s${semester}`, split: { by: 'semester', semester } };
    if (partBytes <= limit) { out.push({ ...base, files: part }); continue; }
    // still too big: year bands, newest first, filled up to the limit (an exam stays whole)
    const years = (file) => Number(groups.get(file).exam?.year) || 0;
    const ordered = [...part].sort((a, b) => years(b) - years(a) || (a < b ? -1 : a > b ? 1 : 0));
    let band = []; let bandBytes = 0; const bands = [];
    const flush = () => { if (band.length) bands.push(band); band = []; bandBytes = 0; };
    for (let i = 0; i < ordered.length; i += 1) {
      const file = ordered[i]; const size = groups.get(file).bytes;
      // never cut inside one year: all exams of a year go together unless the year alone is over the limit
      if (band.length && bandBytes + size > limit && years(file) !== years(band[band.length - 1])) flush();
      band.push(file); bandBytes += size;
    }
    flush();
    for (const members of bands) {
      const ys = members.map(years).filter(Boolean);
      const from = Math.min(...ys); const to = Math.max(...ys);
      out.push({ suffix: `${base.suffix}-y${from}${to === from ? '' : `-${to}`}`, split: { by: 'semester+year', semester, yearFrom: from, yearTo: to }, files: members });
    }
  }
  return out;
}

const shardFileText = (key, indexVersion, lines) =>
  `{"schemaVersion":${JSON.stringify(CATALOG_SHARD_FILE_SCHEMA)},"key":${JSON.stringify(key)},"indexVersion":${JSON.stringify(indexVersion)},"records":[\n${lines.join(',\n')}\n]}\n`;
const sha256Hex = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

// catalog: the object resolveCatalog returns (or any object with .records, .exams, .indexVersion, .identityDigest).
// Pure: the same catalog and alias document give the same bytes.
export function projectCatalogShards(catalog, aliasDoc, { limit = SHARD_RAW_LIMIT_BYTES } = {}) {
  if (!Array.isArray(catalog?.records) || !catalog.records.length) throw new Error('catalog has no records');
  if (!Array.isArray(catalog.exams) || !catalog.exams.length) throw new Error('catalog has no exams');
  const indexVersion = String(catalog.indexVersion || catalog.canonicalProjectionVersion || '');
  if (!/^archive2-canonical-v1:[a-f0-9]{64}$/.test(indexVersion)) throw new Error('catalog has no projection version');
  if (!/^[0-9a-f]{64}$/.test(String(catalog.identityDigest || ''))) throw new Error('catalog has no identityDigest');
  const buckets = makeCourseBuckets(aliasDoc);
  const highCommon = buckets.all().find((bucket) => bucket.key === 'high1-common') || null;
  const examByFile = new Map(catalog.exams.map((exam) => [exam.file, exam]));
  // records -> exam groups, in catalog order
  const bucketGroups = new Map(); // bucket key -> { bucket, groups: Map<file, {exam, lines, bytes}>, firstRank }
  catalog.records.forEach((record, rank) => {
    const file = record.sourceFile;
    const exam = examByFile.get(file) || { file, grade: record.sourceGrade, subject: record.subject, semester: '', year: record.year };
    const bucket = bucketOfExam(exam, buckets, highCommon);
    let entry = bucketGroups.get(bucket.key);
    if (!entry) { entry = { bucket, groups: new Map(), firstRank: rank }; bucketGroups.set(bucket.key, entry); }
    let group = entry.groups.get(file);
    if (!group) { group = { exam, lines: [], bytes: 0 }; entry.groups.set(file, group); }
    const line = JSON.stringify(slimRecord(record));
    group.lines.push(line);
    group.bytes += byteLength(line) + 2;
  });
  const entries = [...bucketGroups.values()].sort((a, b) => a.firstRank - b.firstRank);
  const files = new Map(); // relative path inside the shard dir -> Buffer
  const shards = []; const courses = []; const examShard = {};
  let recordTotal = 0;
  for (const { bucket, groups } of entries) {
    const course = { key: bucket.key, label: bucket.label, kind: bucket.kind, ...(bucket.grade ? { grade: bucket.grade } : {}), shards: [] };
    for (const part of splitBucketFiles(groups, limit)) {
      const key = `${bucket.key}${part.suffix}`;
      if (!SHARD_KEY_PATTERN.test(key)) throw new Error(`shard key is not a plain file name: ${key}`);
      const lines = part.files.flatMap((file) => groups.get(file).lines);
      const content = Buffer.from(shardFileText(key, indexVersion, lines), 'utf8');
      const rel = `shard-${key}.json`;
      files.set(rel, content);
      for (const file of part.files) examShard[file] = key;
      shards.push({
        key, course: bucket.key, label: bucket.label, path: rel, sha256: sha256Hex(content), bytes: content.length,
        records: lines.length, exams: part.files.length, ...(part.split ? { split: part.split } : {}),
      });
      course.shards.push(key);
      recordTotal += lines.length;
    }
    courses.push(course);
  }
  // exams with no question rows (none today) still name their shard, so a screen never has to guess
  const firstShardOf = new Map(courses.map((course) => [course.key, course.shards[0]]));
  for (const exam of catalog.exams) {
    if (examShard[exam.file]) continue;
    const bucket = bucketOfExam(exam, buckets, highCommon);
    const shard = firstShardOf.get(bucket.key);
    if (shard) examShard[exam.file] = shard;
  }
  const index = {
    schemaVersion: CATALOG_SHARDS_INDEX_SCHEMA,
    recordSchema: CATALOG_SHARD_FILE_SCHEMA,
    indexVersion,
    catalogIdentityDigest: catalog.identityDigest,
    recordCount: recordTotal,
    examCount: catalog.exams.length,
    // what the screens do NOT get: columns dropped, and evidence columns cut to the keys a screen reads
    droppedRecordFields: [...DROPPED_RECORD_FIELDS],
    projectedRecordFields: JSON.parse(JSON.stringify(PROJECTED_RECORD_FIELDS)),
    // how to use: a course's `shards` lists every piece of it; examShard names the one shard an exam's questions are in.
    courses,
    shards,
    examShard,
  };
  const indexContent = Buffer.from(`${JSON.stringify(index)}\n`, 'utf8');
  return { index, indexContent, files, rawLimit: limit };
}

// ---- the real inputs: the same loader and resolver the screens run --------------------------------------------------
export async function loadResolvedCatalog(root) {
  const require = createRequire(import.meta.url);
  const canonical = require(path.join(root, CANONICAL_JS_PATH));
  const decoder = new TextDecoder('utf-8'); // like fetch().text(): a UTF-8 BOM is dropped, so the file hashes match the manifest
  // The browser's base URL is <site>/archive/workspace.html; the manifest paths ("data/...", "../docs/...") resolve against it.
  const fetcher = async (url) => {
    const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/+/, ''));
    const file = path.resolve(root, rel);
    if (path.relative(root, file).startsWith('..')) return { ok: false, status: 403 };
    let bytes;
    try { bytes = fs.readFileSync(file); } catch { return { ok: false, status: 404 }; }
    return { ok: true, status: 200, text: async () => decoder.decode(bytes) };
  };
  const bundle = await canonical.loadInputBundle(fetcher, 'https://shards.invalid/archive/workspace.html');
  const catalog = canonical.resolveCatalog({ versionBundle: bundle });
  return { catalog, bundle, canonical };
}

function readJsonFile(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

export async function buildCatalogShards(root, { limit = SHARD_RAW_LIMIT_BYTES } = {}) {
  for (const input of CATALOG_SHARDS_INPUTS) {
    if (!fs.statSync(path.join(root, input), { throwIfNoEntry: false })?.isFile()) throw new Error(`catalog shards input is missing: ${input}`);
  }
  const { catalog } = await loadResolvedCatalog(root);
  const projection = projectCatalogShards(catalog, readJsonFile(root, COURSE_ALIASES_PATH), { limit });
  const entries = [{
    path: CATALOG_SHARDS_INDEX_PATH, content: projection.indexContent, bytes: projection.indexContent.length, sourceBytes: 0,
    reasons: ['catalog shard index (derived from the registered catalog and canonical input manifest)'], catalogShardInputs: [...CATALOG_SHARDS_INPUTS],
  }];
  for (const [rel, content] of [...projection.files.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    entries.push({
      path: `${CATALOG_SHARDS_DIR}/${rel}`, content, bytes: content.length, sourceBytes: 0,
      reasons: ['catalog shard (resolved question records of one grade or subject, without screen-unused columns)'], catalogShardInputs: [...CATALOG_SHARDS_INPUTS],
    });
  }
  return { entries, index: projection.index, files: projection.files, catalog };
}

export const gzipBytes = (buffer) => zlib.gzipSync(buffer, { level: 6 }).length;

// `node tools/lib/build-archive2-catalog-shards.mjs --write [dir]` writes a git-ignored local copy (default
// archive/data/archive2-catalog-shards-v1/) and prints the size table.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const flag = process.argv.indexOf('--write');
  const target = process.argv[flag + 1] && !process.argv[flag + 1].startsWith('--') ? path.resolve(process.argv[flag + 1]) : path.join(root, CATALOG_SHARDS_DIR);
  const started = Date.now();
  const built = await buildCatalogShards(root);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
  for (const entry of built.entries) fs.writeFileSync(path.join(target, path.basename(entry.path)), entry.content);
  let rawTotal = 0; let gzTotal = 0;
  console.log('shard'.padEnd(34), 'records'.padStart(8), 'exams'.padStart(6), 'raw'.padStart(11), 'gzip'.padStart(10));
  for (const shard of built.index.shards) {
    const gz = gzipBytes(built.files.get(shard.path)); rawTotal += shard.bytes; gzTotal += gz;
    console.log(shard.key.padEnd(34), String(shard.records).padStart(8), String(shard.exams).padStart(6), String(shard.bytes).padStart(11), String(gz).padStart(10));
  }
  console.log('total'.padEnd(34), String(built.index.recordCount).padStart(8), String(built.index.examCount).padStart(6), String(rawTotal).padStart(11), String(gzTotal).padStart(10));
  console.log(`index.json ${built.entries[0].bytes} bytes (gzip ${gzipBytes(built.entries[0].content)}); built in ${((Date.now() - started) / 1000).toFixed(1)} s -> ${target}`);
}
