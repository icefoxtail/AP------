// 문항별 중단원 지정표(archive/data/archive2-middle-parent-assignments.json) 읽기·검증·판정 원장 변환 공용 모듈.
// 카탈로그 빌더(build-archive2-catalog.mjs)와 변환 도구(build-middle-parent-assignments.mjs)와 테스트가 같이 쓴다.
// 정본은 지정표 파일 하나이고, 카탈로그의 reviewedMiddleParentKey는 거기서 파생된다(빌더 --check가 불일치를 잡는다).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const SCHEMA_VERSION = "archive2-middle-parent-assignments-v1";
export const ASSIGNMENTS_RELATIVE_PATH = "archive/data/archive2-middle-parent-assignments.json";
export const COLUMNS = Object.freeze(["questionUid", "parentIndex", "assignmentFingerprint", "contentFingerprint", "confidence", "round"]);
export const OTHER_BIG_UNIT = "OTHER_BIG_UNIT";
export const NOT_IN_2022 = "NOT_IN_2022";
const UID_PATTERN = /^qid_v1_[0-9a-f]{64}$/;
const HEX64 = /^[0-9a-f]{64}$/;

export const loadToc = () => require("../rpm-middle-toc.js");

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

// 지정표 파일 안의 문항 기록을 uid 지도로 푼다. 형식이 틀리면 예외를 던진다.
export function readAssignments(root) {
  const file = path.join(root, ASSIGNMENTS_RELATIVE_PATH);
  if (!fs.existsSync(file)) return null;
  const doc = JSON.parse(fs.readFileSync(file, "utf8"));
  return { doc, byUid: indexAssignments(doc) };
}

export function indexAssignments(doc) {
  if (!doc || doc.schemaVersion !== SCHEMA_VERSION) throw new Error("중단원 지정표 형식이 맞지 않습니다.");
  if (JSON.stringify(doc.columns) !== JSON.stringify(COLUMNS)) throw new Error("중단원 지정표 열 정의가 맞지 않습니다.");
  const byUid = new Map();
  for (const row of doc.rows) {
    const [uid, parentIndex, assignmentFingerprint, contentFingerprint, confidence, round] = row;
    if (byUid.has(uid)) throw new Error(`중단원 지정표에 같은 문항이 두 번 있습니다: ${uid}`);
    byUid.set(uid, { parentKey: doc.parents[parentIndex], assignmentFingerprint, contentFingerprint, confidence, round });
  }
  return byUid;
}

// 카탈로그 기록 하나에 지정표를 적용할지 정한다. 본문(발문·보기·그림) 지문이 판정 당시와 같을 때만 쓴다.
// 반환: { key } 적용, { stale: true } 지문이 달라 무시, null 지정표에 없음/키가 정본이 아님.
export function applyAssignment(assignment, record, toc) {
  if (!assignment) return null;
  const parent = toc.parent(assignment.parentKey);
  const gradeKey = toc.gradeKey(record.effectiveBrowseGrade || record.sourceGrade);
  if (!parent || !gradeKey || parent.gradeKey !== gradeKey) return null;
  if (!record.assignmentFingerprint || assignment.assignmentFingerprint !== record.assignmentFingerprint) return { stale: true };
  return { key: assignment.parentKey };
}

// 지정표 문서 검증(결함 조건만 본다: 정본 키 아님, 깨진 참조, 중복, 형식). 개수는 고정하지 않는다.
// catalogByUid가 있으면 uid가 카탈로그에 있고 학년이 맞는지도 본다.
export function validateAssignments(doc, { toc = loadToc(), catalogByUid = null } = {}) {
  const errors = [];
  const stale = [];
  let byUid;
  try { byUid = indexAssignments(doc); } catch (error) { return { errors: [error.message], stale, rows: 0 }; }
  const seenParents = new Set();
  doc.parents.forEach((key, index) => {
    if (seenParents.has(key)) errors.push(`parents에 같은 키가 두 번 있습니다: ${key}`);
    seenParents.add(key);
    if (!toc.parent(key)) errors.push(`parents[${index}]가 정본 중단원 키가 아닙니다: ${key}`);
  });
  let previous = "";
  for (const row of doc.rows) {
    const [uid, parentIndex, assignmentFp, contentFp] = row;
    if (!UID_PATTERN.test(uid)) errors.push(`questionUid 형식이 맞지 않습니다: ${uid}`);
    if (uid <= previous) errors.push(`rows는 questionUid 순서로 정렬돼야 합니다: ${uid}`);
    previous = uid;
    if (!Number.isInteger(parentIndex) || parentIndex < 0 || parentIndex >= doc.parents.length) { errors.push(`parentIndex가 범위 밖입니다: ${uid}`); continue; }
    if (!HEX64.test(assignmentFp) || !HEX64.test(contentFp)) errors.push(`지문 형식이 맞지 않습니다: ${uid}`);
    if (catalogByUid) {
      const record = catalogByUid.get(uid);
      if (!record) { errors.push(`카탈로그에 없는 questionUid입니다: ${uid}`); continue; }
      const parent = toc.parent(doc.parents[parentIndex]);
      const gradeKey = toc.gradeKey(record.effectiveBrowseGrade || record.sourceGrade);
      if (parent && parent.gradeKey !== gradeKey) errors.push(`문항 학년과 중단원 학년이 다릅니다: ${uid}`);
      if (record.assignmentFingerprint !== assignmentFp) stale.push(uid);
    }
  }
  return { errors, stale, rows: byUid.size };
}

const normalizeName = (value) => String(value || "").replace(/^\s*중\s*[123]\s*/, "").replace(/\s+/g, "");

// OTHER_BIG_UNIT 행을 정본 중단원 키 하나로 푼다. 학년 접두어·공백 차이만 맞추고, 정확히 하나로 정해질 때만 푼다.
// 문항의 학년(카탈로그)은 바꾸지 않으므로 다른 학년을 가리키면 못 푼 것으로 둔다.
export function resolveOtherBigUnit(row, gradeLabel, toc) {
  const suggestedParent = normalizeName(row.suggestParent);
  if (!suggestedParent) return { reason: "NO_SUGGESTED_PARENT" };
  const prefix = String(row.suggestBigUnit || "").match(/^\s*(중\s*[123])/);
  if (prefix && prefix[1].replace(/\s+/g, "") !== gradeLabel) return { reason: "SUGGESTED_GRADE_DIFFERS" };
  const bigUnit = normalizeName(row.suggestBigUnit);
  const units = toc.units(gradeLabel);
  const candidates = [];
  for (const unit of units) {
    if (bigUnit && normalizeName(unit.name) !== bigUnit) continue;
    for (const parentKey of unit.parentKeys) {
      const parent = toc.parent(parentKey);
      if (parent && normalizeName(parent.L2) === suggestedParent) candidates.push(parentKey);
    }
  }
  if (bigUnit && !units.some((unit) => normalizeName(unit.name) === bigUnit)) return { reason: "SUGGESTED_BIG_UNIT_UNKNOWN" };
  if (candidates.length === 1) return { parentKey: candidates[0] };
  return { reason: candidates.length ? "SUGGESTED_PARENT_AMBIGUOUS" : "SUGGESTED_PARENT_UNKNOWN" };
}

// 판정 원장 행들(final.jsonl 형식)을 지정표 문서로 바꾼다.
// 반환: { doc, unresolved: [{ questionUid, reason, ... }], skipped: { notIn2022 } }
export function buildAssignmentsDocument(ledgerRows, { catalogByUid, toc = loadToc(), basis }) {
  const accepted = new Map();
  const unresolved = [];
  const skipped = { notIn2022: 0 };
  const seen = new Set();
  const fail = (row, reason, extra = {}) => unresolved.push({ questionUid: row.uid, sourceFile: row.sourceFile, no: row.no, reason, suggestBigUnit: row.suggestBigUnit || "", suggestParent: row.suggestParent || "", ...extra });
  for (const row of ledgerRows) {
    if (seen.has(row.uid)) throw new Error(`판정 원장에 같은 문항이 두 번 있습니다: ${row.uid}`);
    seen.add(row.uid);
    if (row.parentKey === NOT_IN_2022) { skipped.notIn2022 += 1; continue; }
    const record = catalogByUid.get(row.uid);
    if (!record) { fail(row, "UID_NOT_IN_CATALOG"); continue; }
    const gradeLabel = record.effectiveBrowseGrade || record.sourceGrade;
    if (record.sourceFingerprint !== row.contentFingerprint) { fail(row, "CONTENT_CHANGED_SINCE_JUDGMENT"); continue; }
    let parentKey = row.parentKey;
    if (parentKey === OTHER_BIG_UNIT) {
      const resolved = resolveOtherBigUnit(row, gradeLabel, toc);
      if (!resolved.parentKey) { fail(row, resolved.reason); continue; }
      parentKey = resolved.parentKey;
    }
    const parent = toc.parent(parentKey);
    if (!parent) { fail(row, "KEY_NOT_CANONICAL", { parentKey }); continue; }
    if (parent.gradeKey !== toc.gradeKey(gradeLabel)) { fail(row, "PARENT_GRADE_DIFFERS", { parentKey }); continue; }
    accepted.set(row.uid, { parentKey, assignmentFingerprint: record.assignmentFingerprint, contentFingerprint: row.contentFingerprint, confidence: row.confidence || "", round: row.round || "" });
  }
  const uids = [...accepted.keys()].sort();
  const parentOrder = toc.parents("").map((parent) => parent.parentKey);
  const used = new Set([...accepted.values()].map((value) => value.parentKey));
  const parents = parentOrder.filter((key) => used.has(key));
  const parentIndex = new Map(parents.map((key, index) => [key, index]));
  const doc = {
    schemaVersion: SCHEMA_VERSION,
    status: "DERIVED_FROM_REVIEWED_LEDGER",
    description: "문항별 중단원 지정표. 옛 소단원 키가 2022 중단원 둘 이상에 걸치거나 키가 없는 중등 문항을, 문항을 읽고 정한 중단원 하나에 잇는다. 단원 표(Archive2UnitTree)는 카탈로그의 reviewedMiddleParentKey로 이 값을 읽고, 문항 본문 지문(assignmentFingerprint)이 판정 당시와 같을 때만 쓴다. 옛 키·크로스워크·봉인 문서는 바꾸지 않는다.",
    basis,
    fingerprintField: "assignmentFingerprint",
    parents,
    columns: [...COLUMNS],
    rows: uids.map((uid) => {
      const value = accepted.get(uid);
      return [uid, parentIndex.get(value.parentKey), value.assignmentFingerprint, value.contentFingerprint, value.confidence, value.round];
    }),
  };
  return { doc, unresolved, skipped };
}
