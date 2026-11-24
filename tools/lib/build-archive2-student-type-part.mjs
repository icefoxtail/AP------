// "같은 유형 문항" lookup for the STUDENT portal (유사 문항 풀어보기 for exams that have no similar paper, e.g. a made-up mock exam).
//
// The teacher's 오답 클리닉 "틀린 유형 기준" picks, for each wrong question, another question of the same type (세부 유형 TPL, else 유형 PT)
// with the type ladder of archive/archive2-derive.js, but it runs in the teacher's browser over the whole catalog. A student's phone cannot
// download that. This part cuts the SAME ladder facts (derive's candidate rows: type keys with the metaHint fallback, difficulty step, grade+unified
// subject "ck") into one small file per (grade, subject), plus one tiny index that says which exam file belongs to which shard:
//   student-type/index.json   { files: { "<exam file>": shard | [shards] }, shards: [{ ck, path, items }] }
//   student-type/<slug>.json  { ck, files[], keys[], items: [[fileIdx, ordinal, no, tplIdx, ptIdx, flags, bucket, uid64]] }
// A shard holds no question text, answer or explanation: the portal downloads only the exam JS file(s) of the few questions it picks (the same
// public files it already reads for 오답 다시 풀기), so nothing about a paper the student has not submitted is newly exposed.
//
// Rows are the ladder-eligible questions only (the same set a teacher mock exam is drawn from: verified identity, canonical path, usable difficulty step).
// A question outside it has no row: a wrong answer on it simply gets no same-type card.
// flags: 1 = TPL is an approved (formal) key, 2 = PT is formal, 4 = may be OFFERED to others (it has an answer and a real explanation).
// A row without flag 4 is kept so the type of a WRONG question is known even when the question itself is not offered.
// Files are in the shard index's folder (archive/data/archive2-catalog-shards-v1/student-type/), a release-build projection like exam-meta/ and svg-alt/.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { examQuestions } from './build-archive2-svg-alt-part.mjs';
import { normalizeExamFile } from './build-archive2-exam-meta-part.mjs';

export const STUDENT_TYPE_SCHEMA = 'archive2-student-type-v1';
export const STUDENT_TYPE_DIR = 'student-type';
export const FLAG_TPL_FORMAL = 1;
export const FLAG_PT_FORMAL = 2;
export const FLAG_OFFER = 4;
const UID = /^qid_v1_([a-f0-9]{64})$/;
const PLACEHOLDER_SOLUTION = /^\s*\[JS 기준 풀이\]/;
const GRADE_CODE = { 중1: 'm1', 중2: 'm2', 중3: 'm3', 고1: 'h1', 고2: 'h2', 고3: 'h3' };

const text = (value) => (value == null ? '' : String(value)).trim();

/** Answer present and an explanation that is not the stock placeholder (text or a figure). Same bar as the portal's own card (hasRealSolution). */
export function questionOffers(question) {
  if (!question || typeof question !== 'object') return false;
  if (!text(question.answer)) return false;
  const solution = text(question.solution);
  return (Boolean(solution) && !PLACEHOLDER_SOLUTION.test(solution)) || Boolean(text(question.solutionImage));
}

export function shardSlug(ck) {
  const [grade, subject] = String(ck).split('|');
  const slug = `${GRADE_CODE[grade] || 'x'}-${String(subject || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`;
  return /^[a-z0-9][a-z0-9_-]*$/.test(slug) && GRADE_CODE[grade] && subject
    ? slug : `k-${crypto.createHash('sha256').update(String(ck), 'utf8').digest('hex').slice(0, 16)}`;
}

/**
 * records: resolved catalog records. deps: { core, unified, derive, recs } (Archive2Core, Archive2UnifiedUnits, Archive2Derive, ClinicRecommendations).
 * readQuestions(file) -> question list of the exam file, or null when it cannot be read (its rows are then not offered).
 * Pure given those inputs. Returns { byCk: Map<ck, rows[]> } with rows in catalog order.
 */
export function studentTypeRows(records, projectionPolicy, deps, readQuestions) {
  const { core, unified: Unified, derive: Derive, recs } = deps;
  const fields = [...new Set([...(Array.isArray(core.META_FIELDS) ? core.META_FIELDS : []), ...(Array.isArray(core.OPTIONAL_METADATA_FIELDS) ? core.OPTIONAL_METADATA_FIELDS : [])])];
  const prepared = records.map((record) => {
    const canonicalMeta = {};
    for (const field of fields) if (Object.prototype.hasOwnProperty.call(record, field)) canonicalMeta[field] = record[field];
    return { ...record, canonicalMeta, canonicalMetaFields: fields };
  });
  const unified = Unified.buildIndex(prepared, { projectionPolicy });
  const index = Derive.buildDeriveIndex(prepared, {
    unified, projectionPolicy,
    eligible: (record) => recs.typeLadderEligible(record, core, ''),
  });
  const banks = new Map();
  const bankOf = (file) => {
    if (!banks.has(file)) { let list = null; try { list = readQuestions(file); } catch (error) { list = null; } banks.set(file, Array.isArray(list) ? list : null); }
    return banks.get(file);
  };
  const byCk = new Map();
  for (const record of records) {
    const cand = index.byUid.get(text(record.questionUid));
    if (!cand || !cand.ck || !cand.eligible || cand.bucket === null || !(cand.tpl || cand.pt)) continue;
    const match = UID.exec(text(record.questionUid));
    const ordinal = Number(record.sourceOrdinal);
    const file = normalizeExamFile(record.sourceFile);
    if (!match || !Number.isInteger(ordinal) || ordinal < 1 || !file) continue;
    let flags = (cand.tplFormal ? FLAG_TPL_FORMAL : 0) | (cand.ptFormal ? FLAG_PT_FORMAL : 0);
    const bank = bankOf(file);
    if (bank && questionOffers(bank[ordinal - 1])) flags |= FLAG_OFFER;
    if (!byCk.has(cand.ck)) byCk.set(cand.ck, []);
    byCk.get(cand.ck).push({ file, ordinal, no: text(record.sourceQuestionNo), tpl: cand.tpl, pt: cand.pt, flags, bucket: cand.bucket ?? 0, uid: match[1] });
  }
  return byCk;
}

/** Build-time extras: reads the exam files (for the "answer + explanation present" flag) from root/archive/exams. null when the inputs are missing. */
export function studentTypeExtras(root, catalog) {
  const require = createRequire(import.meta.url);
  const deps = {
    core: require(path.join(root, 'archive/archive2-core.js')),
    unified: require(path.join(root, 'archive/archive2-unified-units.js')),
    derive: require(path.join(root, 'archive/archive2-derive.js')),
    recs: require(path.join(root, 'apmath/js/clinic-recommendations.js')),
  };
  const readQuestions = (file) => examQuestions(fs.readFileSync(path.join(root, 'archive/exams', file), 'utf8'));
  return { byCk: studentTypeRows(catalog.records, catalog.projectionPolicy, deps, readQuestions) };
}

/** { index part, files: Map<relative path, Buffer> }, deterministic: shards in ck order, rows in catalog order. */
export function projectStudentType(extras, indexVersion) {
  const files = new Map();
  const shards = [];
  const fileShards = new Map();
  for (const ck of [...extras.byCk.keys()].sort()) {
    const rows = extras.byCk.get(ck);
    const fileList = []; const fileIdx = new Map();
    const keyList = []; const keyIdx = new Map();
    const keyOf = (key) => {
      if (!key) return -1;
      if (!keyIdx.has(key)) { keyIdx.set(key, keyList.length); keyList.push(key); }
      return keyIdx.get(key);
    };
    const items = rows.map((row) => {
      if (!fileIdx.has(row.file)) { fileIdx.set(row.file, fileList.length); fileList.push(row.file); }
      return [fileIdx.get(row.file), row.ordinal, row.no, keyOf(row.tpl), keyOf(row.pt), row.flags, row.bucket, row.uid];
    });
    const slug = shardSlug(ck);
    const rel = `${STUDENT_TYPE_DIR}/${slug}.json`;
    if (files.has(rel)) throw new Error(`student-type slug collision: ${slug}`);
    files.set(rel, Buffer.from(`${JSON.stringify({ schemaVersion: STUDENT_TYPE_SCHEMA, indexVersion, ck, files: fileList, keys: keyList, items })}\n`, 'utf8'));
    const shardNo = shards.length;
    shards.push({ ck, path: `${slug}.json`, items: items.length });
    for (const file of fileList) {
      if (!fileShards.has(file)) fileShards.set(file, []);
      fileShards.get(file).push(shardNo);
    }
  }
  const fileMap = {};
  for (const file of [...fileShards.keys()].sort()) { const list = fileShards.get(file); fileMap[file] = list.length === 1 ? list[0] : list; }
  files.set(`${STUDENT_TYPE_DIR}/index.json`, Buffer.from(`${JSON.stringify({ schemaVersion: STUDENT_TYPE_SCHEMA, indexVersion, shards, files: fileMap })}\n`, 'utf8'));
  return { index: { schemaVersion: STUDENT_TYPE_SCHEMA, dir: STUDENT_TYPE_DIR, count: files.size }, files };
}
