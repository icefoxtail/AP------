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
import { UNIT_PAST_SCHEMA, unitPastExtras } from './build-archive2-unit-past-part.mjs';
import { examMetaExtras, projectExamMeta } from './build-archive2-exam-meta-part.mjs';
import { svgAltExtras, projectSvgAlt } from './build-archive2-svg-alt-part.mjs';
import { studentTypeExtras, projectStudentType } from './build-archive2-student-type-part.mjs';

export const CATALOG_SHARDS_DIR = 'archive/data/archive2-catalog-shards-v1';
export const CATALOG_SHARDS_INDEX_PATH = `${CATALOG_SHARDS_DIR}/index.json`;
export const CATALOG_SHARDS_INDEX_SCHEMA = 'archive2-catalog-shards-v1';
export const CATALOG_SHARD_FILE_SCHEMA = 'archive2-catalog-shard-v2'; // v2 (stage 2-1): an optional `authority` part after `records`
// Registered files the shards are derived from (the release identity checks they are in the registered snapshot). The other
// ~675 inputs are bound by sha256 through the canonical input manifest, which loadInputBundle verifies file by file.
export const CATALOG_SHARDS_INPUTS = Object.freeze([
  'archive/data/archive2-catalog.json',
  'archive/data/archive2-canonical-input-manifest.json',
  'archive/data/meta-foundation/course-aliases.v1.json',
  // stage 2-3 (the unit-past part, build-archive2-unit-past-part.mjs): the legacy question index and the two scripts that merge the approved
  // metadata with the foundation runtime. The assembled sidecar (archive/data/question_metadata.json) is the assembly of registered shards that the
  // release identity already checks for the question-metadata browser copy, so it is not listed here (it is not a registered path).
  'archive/question-index.js',
  'archive/question-meta.js',
  'archive/meta-foundation-runtime.js',
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

// ---- the authority: what a screen needs to judge a record without the whole bundle -----------------------------------------
// STAGE 2-1. Whether a record may be used (Archive2Core.basicEligibility -> Archive2Canonical.validateBasicAssignment,
// Archive2Core.advancedEligible -> validateAdvancedAssignment) is decided against `canonicalAuthority`, which resolveCatalog
// builds from the whole bundle (about 42 MB in memory, 595 reviewed-exam-meta proofs and every runtime pack). The shards carry it in
// two parts so a screen that holds only some shards still gets the same answer for every record it holds:
//   - per shard, the `authority` part of the shard file: the exams of the shard, their source hashes, and the assignment rows of the
//     shard's questions, cut to the keys the validators read (an assignment row is about 3 KB with proof material; the validators
//     read about 20 keys). The identity table is NOT stored: validateBasicAssignment compares identityByUid[uid] with the record's own
//     questionUid / sourceFile / sourceOrdinal / identityStatus, so it is derived from the record (the builder checks, for every
//     record, that the derived entry equals the real one and lists the few that differ).
//   - once, `common.json`: the tables that do not depend on the question (grade/course allowlist, canonical parents and advanced
//     paths, problem type and binding keys, template parents, projection policy) and the catalog-level lists the screens read
//     (taxonomy, basic scope groups, filter options, health, PT/TPL labels). `basicScopeLinks` (1.35 MB, 355 KB gzip) is left out:
//     its only reader passes it to Archive2Core.basicScopeParent, which does not use it (a test keeps that true).
// The assembly (archive/archive2-catalog-shards.js, one file for the build and the browser) is the only code that turns these
// back into a canonicalAuthority; tests/archive2-catalog-shards-authority.test.js proves, on the real inputs, that every record
// gets the same basicEligibility and advancedEligible result as with the full authority.
export const CATALOG_COMMON_PATH = 'common.json';
export const CATALOG_COMMON_SCHEMA = 'archive2-catalog-common-v1';
export const CATALOG_FINDER_SCHEMA = 'archive2-catalog-finder-v1';
export const CATALOG_AUTHORITY_SCHEMA = 'archive2-catalog-shard-authority-v1';
export const AUTHORITY_UNUSED_CATALOG_KEYS = Object.freeze(['basicScopeLinks']); // shipped as [] (see the comment above)
// Keys of an assignment row the validators and screens read (validateBasicAssignment, validateAdvancedAssignment,
// assignmentEvidencePasses). The union of the basic and the advanced reads is kept for every row, so a row that is the same object
// in both tables is stored once. tests/archive2-catalog-shards-authority.test.js scans archive2-canonical.js for a read of
// another key.
export const AUTHORITY_ASSIGNMENT_FIELDS = Object.freeze([
  'questionUid', 'sourceFile', 'sourceOrdinal', 'grade', 'curriculumKey', 'courseKey', 'L1', 'L2',
  'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey', 'l4Disposition',
  'sourceFingerprint', 'assignmentFingerprint', 'approvalStatus', 'taxonomyVersion', 'store', 'reviewEvidence',
]);
export const AUTHORITY_REVIEW_EVIDENCE_FIELDS = Object.freeze(['status', 'reference', 'sha256', 'runtimeEvidenceReference', 'runtimeEvidenceSha']);
export const AUTHORITY_TEMPLATE_FIELDS = Object.freeze(['status', 'parentProblemTypeKey']);
// Catalog-level values of resolveCatalog that are NOT common: the records and exams are per shard, the source hashes follow the
// exams, the authority is rebuilt, and the encoded column dictionary (columns, strings, encoding) is leftover of decodeCatalog
// that no screen reads. Anything else the catalog gains is common by default.
export const COMMON_CATALOG_EXCLUDED_KEYS = Object.freeze([
  'records', 'exams', 'sourceHashes', 'sourceRawHashes', 'canonicalAuthority', 'columns', 'strings', 'encoding',
]);

const pick = (value, keys) => {
  const out = {};
  for (const key of keys) if (value && Object.hasOwn(value, key)) out[key] = value[key];
  return out;
};
export function projectAssignmentRow(row) {
  const out = pick(row, AUTHORITY_ASSIGNMENT_FIELDS);
  if (out.reviewEvidence && typeof out.reviewEvidence === 'object') out.reviewEvidence = pick(out.reviewEvidence, AUTHORITY_REVIEW_EVIDENCE_FIELDS);
  return out;
}
const sortedUnique = (values) => [...new Set(values)].sort();
const sortedKeys = (object) => Object.fromEntries(Object.entries(object).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)));
// What the validators read from the identity table: derived from the record itself (the same four values resolveCatalog writes).
// (the one definition is in archive/archive2-catalog-shards.js, which the browser runs too)
const { identityOfRecord } = createRequire(import.meta.url)('../../archive/archive2-catalog-shards.js');
export { identityOfRecord };

// The tables that do not depend on a question. `extras` = { labels, health } (computed from the bundle by buildCatalogShards).
export function projectCommon(catalog, extras = {}) {
  const authority = catalog.canonicalAuthority;
  const common = {
    schemaVersion: CATALOG_COMMON_SCHEMA,
    indexVersion: String(catalog.indexVersion || catalog.canonicalProjectionVersion || ''),
    identityDigest: catalog.identityDigest,
    authority: {
      taxonomyVersion: authority.taxonomyVersion,
      gradeCourses: authority.gradeCourses,
      canonicalParents: authority.canonicalParents,
      canonicalAdvancedPaths: authority.canonicalAdvancedPaths,
      projectionPolicy: authority.projectionPolicy,
      problemTypeKeys: sortedUnique(authority.problemTypeKeys || []),
      templatesByKey: Object.fromEntries(Object.entries(authority.templatesByKey || {}).map(([key, row]) => [key, pick(row, AUTHORITY_TEMPLATE_FIELDS)])),
      bindingKeys: sortedUnique(authority.bindingKeys || []),
    },
    catalog: {},
    labels: extras.labels || { problemTypes: {}, templates: {} },
  };
  const excluded = new Set(COMMON_CATALOG_EXCLUDED_KEYS);
  const unused = new Set(AUTHORITY_UNUSED_CATALOG_KEYS);
  for (const key of Object.keys(catalog)) if (!excluded.has(key)) common.catalog[key] = unused.has(key) ? [] : catalog[key];
  if (extras.health) common.catalog.health = extras.health;
  return common;
}

// The authority part of one shard file. recordsOfShard = the shard's catalog records (full, not slim); examsOfShard = its exams.
export function projectShardAuthority(catalog, indexVersion, recordsOfShard, examsOfShard) {
  const authority = catalog.canonicalAuthority;
  const fileSet = new Set(examsOfShard.map((exam) => exam.file));
  const sourceHashes = (catalog.sourceHashes || []).filter((entry) => fileSet.has(entry[0]));
  const assignments = {}; const advancedSame = []; const advancedOwn = {}; const identityOverrides = {};
  for (const record of recordsOfShard) {
    const uid = record.questionUid;
    const identity = authority.identityByUid?.[uid];
    if (identity && JSON.stringify(identity) !== JSON.stringify(identityOfRecord(record))) identityOverrides[uid] = identity;
    const rows = authority.assignmentsByUid?.[uid];
    const advanced = authority.advancedAssignmentsByUid?.[uid];
    if (Array.isArray(rows)) assignments[uid] = rows.map(projectAssignmentRow);
    if (Array.isArray(advanced)) {
      if (Array.isArray(rows) && advanced.length === rows.length && advanced.every((row, i) => row === rows[i] || JSON.stringify(row) === JSON.stringify(rows[i]))) advancedSame.push(uid);
      else advancedOwn[uid] = advanced.map(projectAssignmentRow);
    }
  }
  return {
    schemaVersion: CATALOG_AUTHORITY_SCHEMA,
    exams: examsOfShard, sourceHashes, assignments, advancedSame, advancedOwn, identityOverrides,
  };
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
  // every spelling that resolves to a bucket, so a screen can put a name that is not an exam (a generated question's subject) into the same course
  const spellings = new Map();
  const add = (name, bucket) => {
    buckets.set(bucket.key, bucket); byName.set(canonical(name), bucket);
    if (!spellings.has(bucket.key)) spellings.set(bucket.key, new Set());
    const group = spelling.get(compact(name));
    for (const member of group ? group.members : [name]) spellings.get(bucket.key).add(compact(member));
  };
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
  return {
    bucketOf: (name) => byName.get(canonical(name)) || null,
    all: () => [...buckets.values()],
    namesOf: (key) => [...(spellings.get(key) || [])].sort(),
  };
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

const shardFileText = (key, indexVersion, lines, authority, unit) =>
  `{"schemaVersion":${JSON.stringify(CATALOG_SHARD_FILE_SCHEMA)},"key":${JSON.stringify(key)},"indexVersion":${JSON.stringify(indexVersion)},"records":[\n${lines.join(',\n')}\n]${authority ? `,"authority":${JSON.stringify(authority)}` : ''}${unit ? `,"unit":${JSON.stringify(unit)}` : ''}}\n`;
const sha256Hex = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

// catalog: the object resolveCatalog returns (or any object with .records, .exams, .indexVersion, .identityDigest).
// Pure: the same catalog and alias document give the same bytes.
export function projectCatalogShards(catalog, aliasDoc, { limit = SHARD_RAW_LIMIT_BYTES, extras = {} } = {}) {
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
    if (!group) { group = { exam, lines: [], records: [], bytes: 0 }; entry.groups.set(file, group); }
    const line = JSON.stringify(slimRecord(record));
    group.lines.push(line);
    group.records.push(record);
    group.bytes += byteLength(line) + 2;
  });
  const entries = [...bucketGroups.values()].sort((a, b) => a.firstRank - b.firstRank);
  const files = new Map(); // relative path inside the shard dir -> Buffer
  const shards = []; const courses = []; const examShard = {};
  const pending = []; // shards in order: { key, bucket, part, lines, records }
  let recordTotal = 0;
  for (const { bucket, groups } of entries) {
    // `names`: every spelling of the course's name (문제은행 검색 puts a generated question, which has a subject but no exam, into the course of that name)
    const names = bucket.kind === 'course' ? buckets.namesOf(bucket.key) : [];
    const course = { key: bucket.key, label: bucket.label, kind: bucket.kind, ...(bucket.grade ? { grade: bucket.grade } : {}), ...(names.length ? { names } : {}), shards: [] };
    for (const part of splitBucketFiles(groups, limit)) {
      const key = `${bucket.key}${part.suffix}`;
      if (!SHARD_KEY_PATTERN.test(key)) throw new Error(`shard key is not a plain file name: ${key}`);
      pending.push({
        key, bucket, part,
        lines: part.files.flatMap((file) => groups.get(file).lines),
        records: part.files.flatMap((file) => groups.get(file).records),
      });
      for (const file of part.files) examShard[file] = key;
      course.shards.push(key);
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
  // The keys of examShard are in the catalog's exam order (the order the whole catalog lists its exams and, inside it, its questions).
  // A screen that holds several shards puts the questions back in that order (assembleCatalog), so a list built from some shards is in
  // the same order as the list built from all of them (replacement candidates of one year come in that order).
  const examShardInCatalogOrder = {};
  for (const exam of catalog.exams) if (examShard[exam.file] !== undefined) examShardInCatalogOrder[exam.file] = examShard[exam.file];
  for (const file of Object.keys(examShard)) if (!(file in examShardInCatalogOrder)) examShardInCatalogOrder[file] = examShard[file];
  // STAGE 2-1: when the catalog carries a canonicalAuthority, each shard file also holds the authority part of its own questions
  // (exams, source hashes, assignment rows), and one common file holds the tables that do not depend on a question. Measured on the
  // real catalog: the same bytes after gzip as a separate file per shard (7.44 MB against 7.44 MB) and one request fewer per shard,
  // so the part is inside the shard file.
  const withAuthority = Boolean(catalog.canonicalAuthority);
  if (withAuthority) for (const exam of catalog.exams) if (!examShard[exam.file]) throw new Error(`exam has no shard: ${exam.file}`);
  for (const { key, bucket, part, lines, records } of pending) {
    const authority = withAuthority
      ? projectShardAuthority(catalog, indexVersion, records, catalog.exams.filter((exam) => examShard[exam.file] === key))
      : null;
    // STAGE 2-3: the two inputs 단원별 기출 joins (see build-archive2-unit-past-part.mjs), one entry per record of this shard, in its order
    let unit = null;
    if (extras.unitPast) {
      const rows = records.map((record) => extras.unitPast.rowOf(record));
      unit = { schemaVersion: UNIT_PAST_SCHEMA, index: rows.map((row) => row[0]), meta: rows.map((row) => row[1]) };
    }
    const content = Buffer.from(shardFileText(key, indexVersion, lines, authority, unit), 'utf8');
    const rel = `shard-${key}.json`;
    files.set(rel, content);
    shards.push({
      key, course: bucket.key, label: bucket.label, path: rel, sha256: sha256Hex(content), bytes: content.length,
      records: lines.length, exams: part.files.length, ...(part.split ? { split: part.split } : {}),
      // STAGE 2-4: the browse grades this shard has questions for (exactly Archive2Core.browseGradeMatchesRecord, so a 고2 screen knows which
      // shards hold what it lists, including 고3 questions it shows through the subject projection). The screen reads this, not a rule of its own.
      ...(extras.browseGradesOf ? { browseGrades: [...new Set(records.flatMap((record) => extras.browseGradesOf(record)))].sort() } : {}),
    });
    recordTotal += lines.length;
  }
  let commonInfo = null;
  if (withAuthority) {
    const common = projectCommon(catalog, extras);
    if (extras.unitPast) common.unitPast = extras.unitPast.common;
    if (extras.finder) common.finder = extras.finder;
    // source hashes of files that belong to no exam of the catalog stay common (none today), so no entry is lost
    const examFiles = new Set(catalog.exams.map((exam) => exam.file));
    const loose = (catalog.sourceHashes || []).filter((entry) => !examFiles.has(entry[0]));
    if (loose.length) common.catalog.sourceHashes = loose;
    const content = Buffer.from(`${JSON.stringify(common)}\n`, 'utf8');
    files.set(CATALOG_COMMON_PATH, content);
    commonInfo = { path: CATALOG_COMMON_PATH, sha256: sha256Hex(content), bytes: content.length };
  }
  // the approved metadata of each exam (original-exam window, class registration): one small file per exam, see build-archive2-exam-meta-part.mjs
  const examMetaPart = extras.examMeta ? projectExamMeta(extras.examMeta, indexVersion) : null;
  if (examMetaPart) for (const [rel, content] of examMetaPart.files) files.set(rel, content);
  // the figure names of each exam (original-exam and problem-sheet windows): one small file per exam, see build-archive2-svg-alt-part.mjs
  const svgAltPart = extras.svgAlt ? projectSvgAlt(extras.svgAlt, indexVersion) : null;
  if (svgAltPart) for (const [rel, content] of svgAltPart.files) files.set(rel, content);
  // the same-type lookup of the student portal (유사 문항 풀어보기 without a similar paper): see build-archive2-student-type-part.mjs
  const studentTypePart = extras.studentType ? projectStudentType(extras.studentType, indexVersion) : null;
  if (studentTypePart) for (const [rel, content] of studentTypePart.files) files.set(rel, content);
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
    examShard: examShardInCatalogOrder,
    ...(commonInfo ? { common: commonInfo, authoritySchema: CATALOG_AUTHORITY_SCHEMA } : {}),
    ...(extras.unitPast ? { unitPastSchema: UNIT_PAST_SCHEMA } : {}),
    ...(examMetaPart ? { examMeta: examMetaPart.index } : {}),
    ...(svgAltPart ? { svgAlt: svgAltPart.index } : {}),
    ...(studentTypePart ? { studentType: studentTypePart.index } : {}),
  };
  const indexContent = Buffer.from(`${JSON.stringify(index)}\n`, 'utf8');
  return { index, indexContent, files, rawLimit: limit };
}

// ---- the real inputs: the same loader and resolver the screens run --------------------------------------------------
// loadInputBundle checks the sha256 of every input file concurrently (crypto.subtle.digest) and stores each parsed file in
// `resources` when ITS check finishes, so the key order of `resources` is the completion order of those async digests. That order
// differs from run to run, and resolveCatalog builds some lists (the 2022 taxonomy rows in catalog.taxonomy, so common.json and
// the index's common digest) in that key order. The release identity and the site build each build the shards in their own
// process, so the same registered snapshot gave two different common.json files and the seal refused the package. The browser
// ignores the order (it never compares bytes); the build must not. Sorted keys give one order for one set of inputs.
export function withOrderedResources(bundle) {
  const resources = {};
  for (const key of Object.keys(bundle.resources || {}).sort()) resources[key] = bundle.resources[key];
  return { ...bundle, resources };
}

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
  const bundle = withOrderedResources(await canonical.loadInputBundle(fetcher, 'https://shards.invalid/archive/workspace.html'));
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
  const { catalog, bundle, canonical } = await loadResolvedCatalog(root);
  const extras = catalogExtras(root, catalog, bundle);
  // STAGE 2-3: what 단원별 기출 needs next to the records (null when the assembled metadata sidecar is not there: that screen then keeps the whole bundle)
  const unitPast = await unitPastExtras(root, { catalog, bundle, canonical, core: createRequire(import.meta.url)(path.join(root, 'archive/archive2-core.js')) });
  if (unitPast) extras.unitPast = unitPast;
  const examMeta = examMetaExtras(root, catalog);
  if (examMeta) extras.examMeta = examMeta;
  extras.svgAlt = svgAltExtras(root, catalog);
  // a failure here must not take the teacher shards down: the student portal then simply has no same-type entry
  try { extras.studentType = studentTypeExtras(root, catalog); } catch (error) { console.warn(`student-type part skipped: ${error?.message || error}`); }
  const projection = projectCatalogShards(catalog, readJsonFile(root, COURSE_ALIASES_PATH), { limit, extras });
  const entries = [{
    path: CATALOG_SHARDS_INDEX_PATH, content: projection.indexContent, bytes: projection.indexContent.length, sourceBytes: 0,
    reasons: ['catalog shard index (derived from the registered catalog and canonical input manifest)'], catalogShardInputs: [...CATALOG_SHARDS_INPUTS],
  }];
  for (const [rel, content] of [...projection.files.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const reason = rel === CATALOG_COMMON_PATH
      ? 'catalog common tables (authority tables and catalog-level lists that do not depend on a question)'
      : rel.startsWith('svg-alt/')
        ? 'alternative texts of the figures of one exam (original-exam and problem-sheet windows), the records of the svg accessibility index for that exam'
      : rel.startsWith('student-type/')
        ? 'same-type question lookup of the student portal (type keys and exam positions only, no question text), derived from the catalog records'
      : rel.startsWith('exam-meta/')
        ? 'approved question metadata of one exam (original-exam window, class registration), the records of the browser copy for that exam'
        : 'catalog shard (resolved question records of one grade or subject, without screen-unused columns, with the authority part of its questions)';
    entries.push({
      path: `${CATALOG_SHARDS_DIR}/${rel}`, content, bytes: content.length, sourceBytes: 0,
      reasons: [reason], catalogShardInputs: [...CATALOG_SHARDS_INPUTS],
    });
  }
  return { entries, index: projection.index, files: projection.files, catalog, bundle, canonical };
}

// Values the browser computes next to resolveCatalog (archive/meta-foundation-runtime.js), computed here once for the whole catalog:
// the PT/TPL label tables of the foundation taxonomy, and the health block (strict-eligible count and per-reason tally, from the
// same Archive2Core.basicEligibility the screens run).
const BROWSE_GRADES = Object.freeze(['중1', '중2', '중3', '고1', '고2', '고3']);
export function catalogExtras(root, catalog, bundle) {
  const require = createRequire(import.meta.url);
  const core = require(path.join(root, 'archive/archive2-core.js'));
  const taxonomy = bundle?.resources?.['data/meta-foundation/compiled/taxonomy_registry.json'] || {};
  const labels = {
    problemTypes: Object.fromEntries((taxonomy.problemTypes || []).filter((row) => row.status === 'ACTIVE').map((row) => [row.problemTypeKey, row.canonicalLabelKo])),
    templates: Object.fromEntries((taxonomy.templates || []).filter((row) => row.status === 'ACTIVE').map((row) => [row.templateKey, { label: row.canonicalLabelKo, parentProblemTypeKey: row.parentProblemTypeKey }])),
  };
  let automatic = 0; const exclusionReasons = {};
  for (const record of catalog.records) {
    const result = core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority });
    if (result.ok) automatic += 1;
    for (const reason of result.reasons) exclusionReasons[reason] = (exclusionReasons[reason] || 0) + 1;
  }
  const built = catalog.health || {};
  const browseGradesOf = (record) => BROWSE_GRADES.filter((grade) => core.browseGradeMatchesRecord(record, grade, catalog.projectionPolicy));
  return { labels, browseGradesOf, finder: finderPart(root, catalog), health: { exams: built.exams, questions: built.questions, metadataRecords: built.metadataRecords, automatic, exclusionReasons } };
}

// ---- 학교별 기출(찾기) 표: what the school finder reads of the records, per exam (2026-11-24, 조각 3단계) ----------------------------------
// The finder lists EXAMS. Which exams a grade / curriculum / course / subject filter keeps, and which exams a search word finds in the
// questions' L1-L4 names, depends on the records of each exam. Those are computed here once, with the browser's own functions
// (Archive2Core.buildFinderIndex, Archive2UnifiedUnits.buildIndex / examSubjects, normalizeSearch) over the same slim records the shards
// carry, so the finder can answer from this table without any shard (archive/archive2-catalog-shards.js assembleFinder turns it back
// into the shapes the finder reads). Arrays are parallel to `files` (catalog exam order); every set is sorted and the label dictionary
// is in first-use order of the catalog's records, so two builds give the same bytes.
//   identity[i]  = [courseKeys, curriculumKeys, sourceGrades, subjectProjections, subjectCurriculumPairs] of exam i (buildFinderIndex)
//   subjects[i]  = the unified subjects the exam's questions fall in (examSubjects), null when none
//   labels / labelsByExam[i] = distinct normalized "L1 L2 L3 L4 + parent L1 L2" texts of the exam's questions (indexes into labels)
//   uidChars     = the characters question uids are made of: a search word made only of them could match a uid, which is not in this table
export function finderPart(root, catalog) {
  const require = createRequire(import.meta.url);
  const core = require(path.join(root, 'archive/archive2-core.js'));
  const Unified = require(path.join(root, 'archive/archive2-unified-units.js'));
  const records = catalog.records.map(slimRecord);
  const finderIndex = core.buildFinderIndex({ ...catalog, records });
  const unified = Unified.buildIndex(records, { projectionPolicy: catalog.projectionPolicy });
  const subjectsOf = Unified.examSubjects(unified);
  const sorted = (set) => [...set].sort();
  const files = catalog.exams.map((exam) => exam.file);
  const identity = files.map((file) => {
    const row = finderIndex.get(core.normalizeFile(file));
    return row ? [sorted(row.courseKeys), sorted(row.curriculumKeys), sorted(row.sourceGrades), sorted(row.subjectProjections), sorted(row.subjectCurriculumPairs)] : null;
  });
  const subjects = files.map((file) => { const set = subjectsOf.get(core.normalizeFile(file)); return set && set.size ? sorted(set) : null; });
  const dictionary = new Map();
  const byFile = new Map();
  const uidChars = new Set();
  for (const record of records) {
    for (const char of core.normalizeSearch(record.questionUid)) uidChars.add(char);
    const entry = unified.byUid.get(record.questionUid);
    const parent = entry?.rpmParentStatus === 'EXACT' ? entry.rpmParent : null;
    const text = core.normalizeSearch([record.L1, record.L2, record.L3, record.L4, parent?.L1, parent?.L2].filter(Boolean).join(' '));
    if (!text) continue;
    if (!dictionary.has(text)) dictionary.set(text, dictionary.size);
    let set = byFile.get(record.sourceFile);
    if (!set) byFile.set(record.sourceFile, (set = new Set()));
    set.add(dictionary.get(text));
  }
  return {
    schemaVersion: CATALOG_FINDER_SCHEMA,
    files, identity, subjects,
    labels: [...dictionary.keys()],
    labelsByExam: files.map((file) => [...(byFile.get(file) || [])].sort((a, b) => a - b)),
    uidChars: sorted(uidChars).join(''),
  };
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
  for (const entry of built.entries) {
    const out = path.join(target, path.relative(CATALOG_SHARDS_DIR, entry.path)); // exam-meta/<key>.json sits in a folder of its own
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, entry.content);
  }
  let rawTotal = 0; let gzTotal = 0;
  console.log('shard'.padEnd(34), 'records'.padStart(8), 'exams'.padStart(6), 'raw'.padStart(11), 'gzip'.padStart(10));
  for (const shard of built.index.shards) {
    const gz = gzipBytes(built.files.get(shard.path)); rawTotal += shard.bytes; gzTotal += gz;
    console.log(shard.key.padEnd(34), String(shard.records).padStart(8), String(shard.exams).padStart(6), String(shard.bytes).padStart(11), String(gz).padStart(10));
  }
  console.log('total'.padEnd(34), String(built.index.recordCount).padStart(8), String(built.index.examCount).padStart(6), String(rawTotal).padStart(11), String(gzTotal).padStart(10));
  const commonFile = built.index.common && built.files.get(built.index.common.path);
  if (commonFile) console.log(`${built.index.common.path} ${commonFile.length} bytes (gzip ${gzipBytes(commonFile)}): the tables every shard needs, fetched once per page`);
  console.log(`index.json ${built.entries[0].bytes} bytes (gzip ${gzipBytes(built.entries[0].content)}); built in ${((Date.now() - started) / 1000).toFixed(1)} s -> ${target}`);
}
