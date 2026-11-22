#!/usr/bin/env node
// Converts direct type-judgment result tables (PICK lines) into DIRECT_JUDGMENT / TYPE_ONLY registration requests
// (archive-reviewed-exam-meta-register-request-v2, lane: register-type-judgment.mjs), one request per exam.
//
//   node archive/tools/meta-foundation/build-type-judgment-requests.mjs --results <git ref> [--results <git ref>...] \
//        [--results-dir <local dir>] [--exams a.js,b.js | --exams-file <file>] [--limit N] [--out <repo root>] [--dry-run] [--summary-global] [--skipped-out <file>]
//        [--allow-pack-scope-additions] [--include-receipt-rows] [--judged-base <git ref> | auto (default) | none]
//        [--replace-draft-types]   (a draft type value (blank/manual_review_pending/projection_unmaterialized) that differs from the judgment is replaced, in separate "tr-" requests)
//        [--max-requests N]   (write only the first N requests in registration order = one batch; run again on the main that holds it for the next)
//        [--bundles <git ref> | --bundles-dir <dir>] [--bundles-only]   (new PT/TPL keys from the NEW_KEY bundle tables; implies --allow-pack-scope-additions)
//
// Without --out (or with --dry-run) nothing is written: only the summary is printed. With --out <dir> the request files go to
// <dir>/.archive-meta-register/inbox/ and their evidence ledgers to <dir>/archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/.
//
// Rules (docs/agents/metadata.md, "유형(PT/TPL) 판정은 직접 판정 결과를 정본으로 받는다"):
// - The judged PT/TPL are copied as they are; nothing is repaired or guessed. Only questions whose type is still EMPTY in the
//   canonical metadata become items. `before`, fingerprints, blob and UIDs are read from the current working tree, so the same
//   command can be run again on a fresh main (deterministic: same inputs give byte-identical files).
// - Every skipped result line is counted by reason in the summary (no silent drops). The registrar's own dry run stays the
//   final check; this tool mirrors its type-lane gates so that requests are not wasted on rows it would refuse.
// - HOLD lines are not handled here (held lines have no judgment). NEW_KEY lines are handled only with --bundles <ref> (new-type-keys.mjs):
//   the bundle tables turn them into requests that carry add-only registryChanges for the new keys; without it they stay skipped.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DIRECT_JUDGMENT, DECISION_DOCUMENT, typeFieldHoldsRegisteredValue } from "./register-type-judgment.mjs";
import { isLegacyPathFormulaUid } from "./reviewed-exam-registration-v2.mjs";
import { isUnambiguousLegacySourceUidAlias } from "../intelligence/question-identity-contract.mjs";
import { loadCourseAliases, makeCourseAliases } from "./course-aliases.mjs";
import { readBundleTables, prepareNewKeys } from "./new-type-keys.mjs";
import { createGradeBindings, GRADE_BINDING_REASONS, loadTagMaster, loadCourseGroupNames } from "./grade-bindings.mjs";
import { classifyMetaBinding, textFingerprint } from "./text-binding-lib.mjs";
import { createRequire } from "node:module";
// Text binding of a question (stem + choices; archive/question-binding.js, decision "메타 결속 지문 범위"): used to see whether the
// question text changed since it was judged. The one definition lives in that module.
const QuestionBinding = createRequire(import.meta.url)("../../question-binding.js");

export const REQUEST_SCHEMA = "archive-reviewed-exam-meta-register-request-v2";
export const LEDGER_SCHEMA = "archive-type-direct-judgment-ledger-v1";
export const DECISION_SECTION = "CURRENT — 유형(PT/TPL) 판정은 직접 판정 결과를 정본으로 받는다 (2026-11-17, 사용자 결정)";
export const INBOX_DIR = ".archive-meta-register/inbox";
export const EVIDENCE_DIR = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const RESULTS_PREFIX = "docs/plans/archive-one-route-upgrade";
// Same book twice in the carrier branch: the registered book uses 비상교육_미적분1 only.
const EXCLUDED_RESULT_FILES = new Set(["비상_미적분1.jsonl"]);
const OVERWRITABLE_STATUS = new Set(["", "manual_review_pending", "projection_unmaterialized"]);
const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const sha256 = v => crypto.createHash("sha256").update(v).digest("hex");
const sha1 = v => crypto.createHash("sha1").update(v).digest("hex");
const json = v => JSON.stringify(v, null, 2) + "\n";
const text = v => typeof v === "string" ? v.trim() : "";
const empty = v => v === null || v === undefined || v === "";
const compact = v => String(v ?? "").normalize("NFC").replace(/\s/g, "");
export const normalizeExam = v => String(v || "").normalize("NFC").replace(/\\/g, "/").replace(/^\.?\/?archive\/exams\//, "").replace(/^\.?\/?exams\//, "");
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });

// ---------------------------------------------------------------- result tables
export function parseJsonl(content, label = "jsonl") {
  const rows = [];
  content.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    try { rows.push(JSON.parse(line)); } catch { throw new Error(`BROKEN_JSONL_LINE:${label}:${i + 1}`); }
  });
  return rows;
}
const listFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? listFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]);
// sources: { ref } (read through git) or { dir } (plain folder, used by tests). Every row gets _source { branch, commit, file }.
export function readResultTables(root, sources) {
  const rows = [], commits = [];
  for (const source of sources) {
    const files = [];
    if (source.ref) {
      const commit = git(root, "rev-parse", `${source.ref}^{commit}`).trim();
      const branch = source.ref.replace(/^refs\/remotes\/origin\//, "").replace(/^origin\//, "");
      commits.push({ ref: source.ref, commit });
      for (const file of git(root, "ls-tree", "-r", "--name-only", commit, "--", source.prefix || RESULTS_PREFIX).split("\n").filter(Boolean))
        if (/\/type-results-[a-z]+\/[^/]+\.jsonl$/.test(file) && !EXCLUDED_RESULT_FILES.has(path.posix.basename(file)))
          files.push({ file, branch, commit, read: () => git(root, "show", `${commit}:${file}`) });
    } else {
      for (const file of listFiles(source.dir)) if (/\.jsonl$/.test(file) && !EXCLUDED_RESULT_FILES.has(path.basename(file)))
        files.push({ file: path.relative(source.dir, file).replaceAll("\\", "/"), branch: source.branch || "local", commit: source.commit || "0".repeat(40), read: () => fs.readFileSync(file, "utf8") });
    }
    for (const f of files.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0)))
      for (const row of parseJsonl(f.read(), f.file)) rows.push({ ...row, _source: { branch: f.branch, commit: f.commit, file: f.file } });
  }
  return { rows, commits };
}

// ---------------------------------------------------------------- registry and scope
export function loadRegistry(root) {
  const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const tax = read("archive/data/meta-foundation/compiled/taxonomy_registry.json");
  const bindings = read("archive/data/meta-foundation/compiled/curriculum_bindings.json").bindings.filter(b => b.status === "ACTIVE");
  const packs = new Map(), packFiles = new Map();
  const dir = path.join(root, "archive/data/meta-foundation/canonical/packs");
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name, "pack.json");
    if (fs.existsSync(file)) { const p = JSON.parse(fs.readFileSync(file, "utf8")); packs.set(p.packId, p); packFiles.set(p.packId, `archive/data/meta-foundation/canonical/packs/${name}/pack.json`); }
  }
  return { ...makeRegistry({ problemTypes: tax.problemTypes, templates: tax.templates, bindings, packs }), packFiles };
}
export function makeRegistry({ problemTypes, templates, bindings, packs }) {
  const bindingsByPt = new Map();
  for (const b of bindings) { if (!bindingsByPt.has(b.problemTypeKey)) bindingsByPt.set(b.problemTypeKey, []); bindingsByPt.get(b.problemTypeKey).push(b); }
  return { pt: new Map(problemTypes.map(p => [p.problemTypeKey, p])), tpl: new Map(templates.map(p => [p.templateKey, p])), bindingsByPt, packs };
}

export const pathGrade = file => /^(?:original|similar|types)\/(?:middle|high)\/([mh][123])\//.exec(file)?.[1] || "";
const pathYear = file => { const m = /(?:^|\/)(\d{2})_/.exec(file); return m ? 2000 + Number(m[1]) : 0; };
export function curriculumGuess(row) {
  const unit = String(row.standardUnitKey || "");
  const fam = unit.match(/^(H15|H22)-/i)?.[1]?.toUpperCase();
  if (fam) return fam === "H15" ? "2015" : "2022";
  const g = Number(pathGrade(row.sourceArchiveFile).slice(1) || 0), y = pathYear(row.sourceArchiveFile);
  return g && y ? (y - g + 1 >= 2025 ? "2022" : "2015") : "";
}
// A row without a course of its own is placed by its exam folder; the grades come from the alias data's group grades.
function pathGrades(row) {
  const g = pathGrade(row.sourceArchiveFile);
  if (g === "m1") return ["중1"];
  if (g === "m2") return ["중2"];
  if (g === "m3") return ["중3"];
  if (g === "h1") return ["고1"];
  if (g === "h2" || g === "h3") return ["고2", "고3"];
  return [];
}
// The strict lane needs: scope.curriculum equals the row's (when it has one; not for a successor course), scope.standardCourse is
// the row's course, another spelling of it or its successor (course-aliases.v1.json), and an ACTIVE binding of the PT in exactly that
// curriculum/course inside the owner pack's declared scope. A pack that does not declare the binding's scope yet is widened by an
// append-only pack change when `allowPackAdditions` is set (returned as `packAddition`); otherwise the row is skipped.
const GRADES = ["중1", "중2", "중3", "고1", "고2", "고3"];
export function chooseScope(registry, aliases, row, ptKey, { allowPackAdditions = false } = {}) {
  const all = registry.bindingsByPt.get(ptKey) || [];
  if (!all.length) return { skip: "SCOPE_PT_HAS_NO_BINDING" };
  const rowCur = text(row.curriculum) || text(row.curriculumKey), rowCourse = text(row.standardCourse) || text(row.courseKey);
  let pool, relation = "same";
  // Keys of a grade at or below the exam's (aliases.reach: units moved between grades, prerequisite content); of those, the highest grade wins.
  const reachPool = course => {
    const hits = all.filter(b => aliases.reach(course, b.standardCourse, { sourceArchiveFile: row.sourceArchiveFile, problemTypeKey: ptKey }) === "reach");
    const top = Math.max(-1, ...hits.map(b => GRADES.indexOf(aliases.gradeOf(b.standardCourse))));
    return hits.filter(b => GRADES.indexOf(aliases.gradeOf(b.standardCourse)) === top);
  };
  if (rowCourse) {
    const kinds = new Map(all.map(b => [b, aliases.relation(rowCourse, b.standardCourse)]));
    // Relations are tried in order (same/alias, successor, reach); a relation whose bindings all belong to another curriculum than the row's
    // (e.g. a 2015 row that carries the 2022 course name) does not end the search: the next relation can still name the row's own curriculum.
    const sameKinds = all.filter(b => ["same", "alias"].includes(kinds.get(b)));
    const attempts = [
      [sameKinds, sameKinds.some(b => kinds.get(b) === "alias") && !sameKinds.some(b => kinds.get(b) === "same") ? "alias" : "same"],
      [all.filter(b => kinds.get(b) === "successor"), "successor"],
      // reach is only for courses that stand in no other relation (the registrar tries same/alias/successor first and never reaches then)
      [reachPool(rowCourse).filter(b => !kinds.get(b)), "reach"],
    ].filter(([p]) => p.length);
    if (!attempts.length) return { skip: "SCOPE_PT_BOUND_TO_OTHER_COURSE" };
    const fit = attempts.find(([p, rel]) => !rowCur || ["successor", "reach"].includes(rel) || p.some(b => b.curriculum === rowCur)) || attempts[0];
    [pool, relation] = fit;
  } else {
    const grades = pathGrades(row);
    if (!grades.length) return { skip: "SCOPE_ROW_COURSE_UNKNOWN" };
    pool = all.filter(b => grades.includes(aliases.gradeOf(b.standardCourse)));
    if (!pool.length) { pool = reachPool(""); relation = "reach"; }
    if (!pool.length) return { skip: "SCOPE_PT_BOUND_TO_OTHER_COURSE" };
  }
  // The row's curriculum is compared with the binding's, except for a successor or reach course (it lives in another curriculum/grade).
  let candidates = rowCur && !["successor", "reach"].includes(relation) ? pool.filter(b => b.curriculum === rowCur) : pool;
  if (!candidates.length) return { skip: "SCOPE_CURRICULUM_MISMATCH" };
  const declared = b => { const pack = registry.packs.get(b.ownerPack || registry.pt.get(b.problemTypeKey)?.ownerPack); return pack && pack.curricula.includes(b.curriculum) && pack.standardCourses.includes(b.standardCourse); };
  let packAddition = null;
  if (!candidates.some(declared)) {
    if (!allowPackAdditions) return { skip: "SCOPE_PACK_DOES_NOT_DECLARE_COURSE" };
  } else candidates = candidates.filter(declared);
  const guess = rowCur || curriculumGuess(row);
  candidates = candidates.slice().sort((a, b) => (Number(b.curriculum === guess) - Number(a.curriculum === guess)) || a.curriculum.localeCompare(b.curriculum) ||
    a.standardCourse.localeCompare(b.standardCourse, "ko"));
  const chosen = candidates[0];
  if (!declared(chosen)) {
    const packId = chosen.ownerPack || registry.pt.get(chosen.problemTypeKey)?.ownerPack, pack = registry.packs.get(packId);
    if (!pack) return { skip: "SCOPE_OWNER_PACK_MISSING" };
    packAddition = { packId, curricula: pack.curricula.includes(chosen.curriculum) ? [] : [chosen.curriculum],
      standardCourses: pack.standardCourses.includes(chosen.standardCourse) ? [] : [chosen.standardCourse] };
  }
  return { scope: { curriculum: chosen.curriculum, standardCourse: chosen.standardCourse }, relation, ...(packAddition ? { packAddition } : {}) };
}

// ---------------------------------------------------------------- source helpers (same formulas as the registrar)
export function loadBank(sourceText, name = "source") {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(sourceText, ctx, { timeout: 5000, filename: name });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || !bank.length) throw new Error("SOURCE_BANK_MISSING");
  return bank;
}
export function sourceFingerprints(q) {
  const content = { content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null };
  return { sourceFingerprint: sha256(JSON.stringify({ content: content.content, choices: content.choices, answer: q.answer ?? null, solution: q.solution ?? null, image: content.image })),
    contentFingerprint: sha256(JSON.stringify(content)) };
}
const gitBlob = (root, rel, bytes) => fs.existsSync(path.join(root, ".git"))
  ? execFileSync("git", ["hash-object", "--path", rel, "--stdin"], { cwd: root, input: bytes, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim()
  : sha1(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]));

// ---------------------------------------------------------------- planning
const SKIP_ORDER = ["DUPLICATE_RESULT_LINE", "DECISION_NEW_KEY_NOT_HANDLED", "DECISION_HOLD", "DECISION_UNKNOWN"];
// ctx: { records: Map uid->row, identity: Map uid->identity, identityCountBySource: Map, registry, readBank(file) -> {bank, bytes}, blobOf(file, bytes) }
export function planRequests({ ctx, resultRows, exams = null, limit = null, approvedBy, judge = "dots", allowPackAdditions = false, includeReceiptRows = false, replaceDraft = false, approveSameDraft = false, excludeUids = null }) {
  const skipped = [], stats = { judgedBase: { checked: 0, unverified: 0, changedKept: 0 }, gradeBindingRows: 0 };
  const aliases = ctx.aliases || makeCourseAliases(null);
  const skip = (row, reason, extra = {}) => skipped.push({ uid: row.uid, exam: row.exam ?? null, no: row.no ?? null, decision: row.decision ?? null, reason, ...extra });
  const wanted = exams ? new Set(exams.map(normalizeExam)) : null;
  const taken = new Set(); // a question one result line already put into a request: its other lines are duplicates (a line that was held or skipped does not take it)
  const candidates = new Map(); // exam -> rows
  for (const row of resultRows) {
    if (row._skip) { skip(row, row._skip); continue; } // decided by the new-key bundles (--bundles), see new-type-keys.mjs
    if (row.decision === "NEW_KEY") { skip(row, "DECISION_NEW_KEY_NOT_HANDLED"); continue; }
    if (row.decision === "HOLD") { skip(row, "DECISION_HOLD"); continue; }
    if (row.decision !== "PICK") { skip(row, "DECISION_UNKNOWN"); continue; }
    const m = ctx.records.get(row.uid);
    if (!m) { skip(row, "ROW_NOT_IN_CANONICAL_METADATA"); continue; }
    if (excludeUids?.has(row.uid)) { skip(row, "ALREADY_IN_OTHER_REQUEST"); continue; } // --exclude-uids: a question another pending request already carries
    if (normalizeExam(row.exam) !== normalizeExam(m.sourceArchiveFile)) { skip(row, "ROW_EXAM_DIFFERS_FROM_CANONICAL"); continue; }
    const file = normalizeExam(m.sourceArchiveFile);
    if (wanted && !wanted.has(file)) continue; // outside the requested exams: not a skip, not counted
    if (!candidates.has(file)) candidates.set(file, []);
    candidates.get(file).push({ row, m });
  }
  let examList = [...candidates.keys()].sort();
  if (limit !== null) examList = examList.slice(0, limit);
  const requests = [], files = new Map(), prepared = [];
  for (const file of examList) {
    const entries = candidates.get(file).sort((a, b) => a.m.sourceOrdinal - b.m.sourceOrdinal);
    let source;
    try { source = ctx.readBank(file); } catch (error) { for (const { row } of entries) skip(row, "SOURCE_BANK_UNREADABLE"); continue; }
    const { bank, bytes } = source;
    const examRows = ctx.rowsBySource.get(file) || [];
    if (examRows.length !== bank.length) { for (const { row } of entries) skip(row, "EXAM_ROW_COUNT_DIFFERS_FROM_SOURCE"); continue; }
    if ((ctx.identityCountBySource.get(file) || 0) !== bank.length) { for (const { row } of entries) skip(row, "EXAM_IDENTITY_COUNT_DIFFERS_FROM_SOURCE"); continue; }
    const items = [];
    for (let { row, m } of entries) {
      if (taken.has(row.uid)) { skip(row, "DUPLICATE_RESULT_LINE"); continue; }
      // A status is a tag on a value: a field with no value has nothing to protect, whatever its tag says (approved_* on an empty field is fillable).
      // 등록부에 없는 옛 키로 채워진 칸은 지킬 값이 없는 칸과 같다(register-type-judgment.mjs typeFieldHoldsRegisteredValue, 등록기와 같은 함수). before는 현재 값 그대로 적는다.
      const holds = { pt: typeFieldHoldsRegisteredValue(ctx.registry, "problemType", m.problemTypeKey), tpl: typeFieldHoldsRegisteredValue(ctx.registry, "template", m.templateKey) };
      const status = { pt: holds.pt ? String(m.fieldStatus?.problemType ?? "") : "", tpl: holds.tpl ? String(m.fieldStatus?.template ?? "") : "" };
      let replace = false;
      if (holds.pt || holds.tpl || /^approved/i.test(status.pt) || /^approved/i.test(status.tpl)) {
        // --replace-draft-types: a value that is only a draft (both status fields overwritable) and differs from the judgment is replaced;
        // an approved or adjudicated value stays (counted with its own reason, the list of "differs from dots"); a value equal to the judgment needs nothing.
        const present = holds.pt || holds.tpl;
        if (!replaceDraft || !present) { skip(row, "TYPE_ALREADY_PRESENT"); continue; }
        const same = (m.problemTypeKey ?? "") === row.pt && (empty(row.tpl) || (m.templateKey ?? "") === row.tpl);
        // approveSameDraft: a draft value (e.g. mirrored from the exam source by the registration sync) that equals the judgment is registered
        // as the direct judgment too (the lane only records status + rationale; the value is unchanged).
        if (same && !approveSameDraft) { skip(row, "TYPE_ALREADY_PRESENT"); continue; }
        if (!OVERWRITABLE_STATUS.has(status.pt) || !OVERWRITABLE_STATUS.has(status.tpl)) {
          skip(row, "TYPE_KEPT_DIFFERS_FROM_JUDGMENT", { existing: { pt: m.problemTypeKey ?? "", tpl: m.templateKey ?? "", ptStatus: status.pt, tplStatus: status.tpl, approval: m.metadataApprovalType ?? "", revision: m.metadataRevision ?? "" }, judged: { pt: row.pt, tpl: text(row.tpl) } });
          continue;
        }
        replace = true;
      }
      if (!OVERWRITABLE_STATUS.has(status.pt) || !OVERWRITABLE_STATUS.has(status.tpl)) { skip(row, "TYPE_STATUS_NOT_OVERWRITABLE"); continue; }
      // 값이 있으면 보인다(2026-11-20): 행 HOLD와 승인 영수증(metadataApprovalType)은 유형 판정을 거르는 이유가 아니다. 이 길은 유형 두 칸만 쓰고
      // 다른 칸과 영수증은 건드리지 않는다(등록기 register-type-judgment.mjs). --include-receipt-rows는 예전 호출을 위해 받기만 한다.
      const pt = ctx.registry.pt.get(row.pt);
      if (!pt || pt.status !== "ACTIVE") { skip(row, "PT_NOT_ACTIVE_IN_REGISTRY"); continue; }
      const tplKey = text(row.tpl);
      if (tplKey) {
        const tpl = ctx.registry.tpl.get(tplKey);
        if (!tpl || tpl.status !== "ACTIVE") { skip(row, "TPL_NOT_ACTIVE_IN_REGISTRY"); continue; }
        if (tpl.parentProblemTypeKey !== row.pt) { skip(row, "TPL_PARENT_DIFFERS_FROM_PT"); continue; }
      }
      const rationale = text(row.step);
      if (rationale.length < 6 || /^(?:-|none|null|n\/a|tbd|todo|\?+)$/i.test(rationale)) { skip(row, "RATIONALE_MISSING"); continue; }
      const q = bank[m.sourceOrdinal - 1], id = ctx.identity.get(row.uid);
      if (!q) { skip(row, "SOURCE_QUESTION_MISSING"); continue; }
      // The result line's own question number must be this row's ordinal (a shifted table would put a type on the wrong question).
      if (row.no !== undefined && row.no !== null && Number(row.no) !== m.sourceOrdinal) { skip(row, "RESULT_NO_DIFFERS_FROM_SOURCE_ORDINAL", { ordinal: m.sourceOrdinal }); continue; }
      // 판정 뒤 발문·보기가 바뀌었어도 유형은 그대로 쓴다(2026-11-22, 학원 원장 결정: 원문 오류 수정은 최소 수정이라 풀이 유형이 달라지지 않는다).
      // 요청은 현재 발문·보기에 묶이고(textBindingFingerprint는 현재 문항), 바뀐 문항은 건수와 원장 줄의 stemChangedSinceJudgment로 남는다.
      // judgedQ: the question as the judge saw it when it can be found; otherwise (unverified, counted) the current one.
      let judgedQ = q, changedSinceJudgment = false;
      if (ctx.judgedBank) {
        const old = ctx.judgedBank(row, file)?.[m.sourceOrdinal - 1];
        if (!old) stats.judgedBase.unverified++;
        else {
          stats.judgedBase.checked++;
          if (QuestionBinding.bindingSerialize(old) !== QuestionBinding.bindingSerialize(q)) { stats.judgedBase.changedKept++; changedSinceJudgment = true; }
        }
      }
      if (!id || id.sourceArchiveFile !== m.sourceArchiveFile || id.sourceOrdinal !== m.sourceOrdinal) { skip(row, "IDENTITY_DIFFERS_FROM_ROW"); continue; }
      if (q.questionUid && q.questionUid !== row.uid && !isLegacyPathFormulaUid(q.questionUid, m.sourceArchiveFile, m.sourceOrdinal) &&
          !isUnambiguousLegacySourceUidAlias({ question: q, sourceArchiveFile: m.sourceArchiveFile, sourceOrdinal: m.sourceOrdinal, identityRecord: id, identityMap: ctx.identityDoc, bank })) { skip(row, "SOURCE_UID_DIFFERS_FROM_ROW"); continue; }
      // 시험지 JS에 적힌 유형이 판정과 달라도 거절하지 않는다(2026-11-20, 등록된 판정이 우선; 적힌 값은 등록기가 typeApproval.examEmbeddedType에 기록한다).
      let picked = chooseScope(ctx.registry, aliases, m, row.pt, { allowPackAdditions });
      // 같은 형태의 키가 다른 학년·교육과정에 있으면 그 키를 쓰고 이 문항의 학년 연결을 add-only로 더한다(2026-11-22, grade-bindings.mjs).
      if (picked.skip && GRADE_BINDING_REASONS.has(picked.skip) && ctx.gradeBindings) {
        const made = ctx.gradeBindings.plan(m, row, row.pt);
        if (made.skip === null) { /* no tag master in this context: the old reason stands */ }
        else if (made.skip) { skip(row, made.skip, { was: picked.skip }); continue; }
        else { picked = made; stats.gradeBindingRows++; }
      }
      if (picked.skip) { skip(row, picked.skip); continue; }
      const textFp = textFingerprint(judgedQ);
      if (!textFp) { skip(row, "STEM_EMPTY"); continue; }
      taken.add(row.uid);
      items.push({ row, m, scope: picked.scope, textFp, rationale, tplKey, relation: picked.relation, packAddition: picked.packAddition || null, gradeBinding: picked.gradeBinding || null, changedSinceJudgment, replace });
    }
    // Replacements of draft values never share a request with the blank-field registrations (they are held back as the last batch).
    for (const replace of [false, true]) {
      const part = items.filter(i => i.replace === replace);
      if (part.length) prepared.push({ file, bank, bytes, items: part, replace });
    }
  }
  // One pack change per pack carries every value the whole batch needs (a later request would see the already widened pack).
  const additions = new Map();
  for (const { items } of prepared) for (const { packAddition } of items) if (packAddition) {
    const e = additions.get(packAddition.packId) || { curricula: new Set(), standardCourses: new Set() };
    packAddition.curricula.forEach(v => e.curricula.add(v)); packAddition.standardCourses.forEach(v => e.standardCourses.add(v));
    additions.set(packAddition.packId, e);
  }
  // New keys (--bundles): their add-only registryChanges ride on the request that sorts first, next to the pack scope additions.
  const keyChanges = ctx.newKeys ? ctx.newKeys.finalize(prepared.flatMap(p => p.items)) : null;
  // Grade bindings (existing key, this row's grade): add-only bindings.json rows, carried by the same first request as the pack and key changes.
  const gradeChanges = ctx.gradeBindings ? ctx.gradeBindings.finalize(prepared.flatMap(p => p.items)) : [];
  const fills = prepared.filter(p => !p.replace);
  const carrierFile = keyChanges?.registryChanges.length || gradeChanges.length ? fills[0]?.file : additions.size ? fills.find(p => p.items.some(i => i.packAddition))?.file : null;
  for (const { file, bank, bytes, items, replace: replacing } of prepared) {
    // Result source: the table file that holds most of this exam's judged lines (ties: path order).
    const bySource = new Map();
    for (const { row } of items) { const k = JSON.stringify(row._source); bySource.set(k, (bySource.get(k) || 0) + 1); }
    const best = [...bySource].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
    const resultSource = JSON.parse(best);
    const core = items.map(({ row, m }) => ({ uid: row.uid, o: m.sourceOrdinal, pt: row.pt, tpl: text(row.tpl), step: text(row.step) }));
    // The carrier of the pack changes sorts before every other request ("tc" < "td"): the inbox is registered in name order.
    const carrier = file === carrierFile && !replacing;
    const requestId = `${carrier ? "tc" : replacing ? "tr" : "td"}-${sha1(file).slice(0, 12)}-${sha256(JSON.stringify(core)).slice(0, 8)}`;
    // The judge named on a result line (default passed judge or dots); a request whose lines name different judges is recorded as "mixed".
    const judges = [...new Set(items.map(({ row }) => text(row.judge) || judge || "dots"))];
    const effectiveJudge = judges.length === 1 ? judges[0] : "mixed";
    const ledger = { schemaVersion: LEDGER_SCHEMA, requestId, sourceArchiveFile: file, judge: effectiveJudge, resultSource,
      rule: "유형(PT/TPL)은 직접 판정 1회를 정본으로 받는다 (docs/agents/metadata.md, 2026-11-17 사용자 결정)",
      rows: items.map(({ row, m, changedSinceJudgment, gradeBinding }) => ({ questionUid: row.uid, sourceOrdinal: m.sourceOrdinal, decision: row._decision ?? row.decision, problemTypeKey: row.pt, templateKey: text(row.tpl) || null,
        step: row.step ?? null, note: row.note ?? null, figure: row.figure ?? null, check: row.check ?? null, resultFile: row._source.file,
        ...(changedSinceJudgment ? { stemChangedSinceJudgment: true } : {}), ...(gradeBinding ? { gradeBindingAdded: true } : {}) })),
      ...(carrier ? { packScopeAdditions: [...additions].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([packId, e]) => ({ packId, curricula: [...e.curricula].sort(), standardCourses: [...e.standardCourses].sort() })),
        ...(gradeChanges.length ? { gradeBindingAdditions: gradeChanges.map(c => ({ problemTypeKey: c.after.problemTypeKey, curriculum: c.after.curriculum, standardCourse: c.after.standardCourse, standardUnitKey: c.after.standardUnitKey, subUnitKey: c.after.subUnitKey ?? null })) } : {}) } : {}) };
    const ledgerText = json(ledger), ledgerPath = `${EVIDENCE_DIR}/${requestId}.type-ledger.json`;
    const ref = { path: ledgerPath, sha256: sha256(ledgerText) };
    files.set(ledgerPath, ledgerText);
    const request = { schemaVersion: REQUEST_SCHEMA, requestId, examUid: path.posix.basename(file, ".js"), scope: "PARTIAL_UIDS", fieldScope: "TYPE_ONLY",
      sourceArchiveFile: file, expectedSourceBlobSha1: ctx.blobOf(file, bytes), expectedQuestionCount: bank.length,
      approval: { type: DIRECT_JUDGMENT, metadataReviewed: true, reviewPassCount: 1, approvedBy, judge: effectiveJudge,
        decisionRef: { document: DECISION_DOCUMENT, section: DECISION_SECTION }, resultSource, evidenceRefs: [ref] },
      ...(carrier ? { registryChanges: [...[...additions].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([packId, e]) => {
        const before = ctx.registry.packs.get(packId);
        return { path: ctx.registry.packFiles.get(packId), before: structuredClone(before),
          after: { ...structuredClone(before), curricula: [...before.curricula, ...[...e.curricula].sort()], standardCourses: [...before.standardCourses, ...[...e.standardCourses].sort()] }, evidenceRefs: [ref] };
      }), ...(keyChanges?.registryChanges || []).map(change => ({ ...change, evidenceRefs: [ref] })), ...gradeChanges.map(change => ({ ...change, evidenceRefs: [ref] }))] } : {}),
      items: items.map(({ row, m, scope, textFp, rationale, tplKey }) => ({ questionUid: row.uid, sourceOrdinal: m.sourceOrdinal,
        before: { problemTypeKey: empty(m.problemTypeKey) ? "" : m.problemTypeKey, templateKey: empty(m.templateKey) ? "" : m.templateKey },
        after: { problemTypeKey: row.pt, ...(tplKey ? { templateKey: tplKey } : {}) },
        rationale, scope, textBindingFingerprint: textFp, evidenceRefs: [ref] })) };
    requests.push(request);
    files.set(`${INBOX_DIR}/${requestId}.json`, json(request));
  }
  if (keyChanges) stats.newKeys = { counts: keyChanges.counts, createdPtUsed: keyChanges.usedPt, createdTplUsed: keyChanges.usedTpl,
    createdPtUnused: keyChanges.unusedCreatedPt, createdTplUnused: keyChanges.unusedCreatedTpl, packScopeAdditions: [...additions].length };
  return { requests, files, skipped, stats };
}

export function summarize({ requests, skipped, resultLines, commits = [], head = null }) {
  const bySkip = {};
  for (const s of skipped) bySkip[s.reason] = (bySkip[s.reason] || 0) + 1;
  const sorted = Object.fromEntries(Object.entries(bySkip).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));
  return { main: head, results: commits, resultLines, exams: requests.length, items: requests.reduce((n, r) => n + r.items.length, 0),
    skippedLines: skipped.length, skippedByReason: sorted,
    requests: requests.map(r => ({ requestId: r.requestId, exam: r.sourceArchiveFile, items: r.items.length })) };
}

// ---------------------------------------------------------------- "selectable by type" metric (mirrors the catalog's metaHint gate)
// The catalog (build-archive2-catalog.mjs buildMetaHint) exposes a recorded PT/TPL to 문제지 만들기 (archive2-core.js metaFacetsOf: type filter and
// the same-type spread) only when the row is bound to the question's CURRENT stem+choices+image (row.contentFingerprint equals the source's),
// the PT is an ACTIVE registered key, the TPL is ACTIVE with that PT as parent, (a row-level taxonomy HOLD no longer hides it).
// This replicates that gate (the real builder has no temporary-output mode); it is an estimate until the builder itself is run.
export function typeSelectable(ctx, examFiles, plannedByUid = new Map()) {
  const out = { exams: 0, rows: 0, selectableBefore: 0, selectableAfter: 0, plannedRows: 0, plannedSelectable: 0 };
  for (const file of examFiles) {
    let source; try { source = ctx.readBank(file); } catch { continue; }
    out.exams++;
    for (const m of ctx.rowsBySource.get(file) || []) {
      const q = source.bank[m.sourceOrdinal - 1];
      if (!q) continue;
      out.rows++;
      // Bound = the row's metadata is about today's stem+choices (the catalog rule). A planned type is bound by its own judgment, which the
      // converter only emits for questions whose stem+choices still equal the judged text.
      const bound = Boolean(classifyMetaBinding({ meta: m, question: q, assignmentFingerprint: sourceFingerprints(q).contentFingerprint, rebinds: ctx.rebinds ?? null }));
      // A TPL that fails its check is dropped by the catalog while the PT stays; the PT facet is what 유형 filter and the spread use.
      const visible = (pt, isBound) => isBound && Boolean(text(pt)) && ctx.registry.pt.get(text(pt))?.status === "ACTIVE";
      const planned = plannedByUid.get(m.questionUid);
      const before = visible(m.problemTypeKey, bound);
      if (before) out.selectableBefore++;
      const after = planned ? visible(planned.pt, true) : before;
      if (after) out.selectableAfter++;
      if (planned) { out.plannedRows++; if (after) out.plannedSelectable++; }
    }
  }
  return out;
}

// ---------------------------------------------------------------- judged base (was the question text changed since it was judged?)
// `ref` is a git ref, or "auto": the merge base of HEAD and the commit the result table was read from (the exam as the judge saw it).
// An exam that cannot be read at the base is not a change: it is counted as unverified, the row stays.
export function makeJudgedBank(root, ref) {
  const baseOf = new Map(), banks = new Map();
  return (row, file) => {
    let base = ref;
    if (ref === "auto") {
      const commit = row._source?.commit;
      if (!commit || /^0+$/.test(commit)) return null;
      if (!baseOf.has(commit)) { try { baseOf.set(commit, git(root, "merge-base", "HEAD", commit).trim()); } catch { baseOf.set(commit, null); } }
      base = baseOf.get(commit);
      if (!base) return null;
    }
    const key = `${base}:${file}`;
    if (!banks.has(key)) {
      try { banks.set(key, loadBank(git(root, "show", `${base}:archive/exams/${file}`), file)); } catch { banks.set(key, null); }
    }
    return banks.get(key);
  };
}

// ---------------------------------------------------------------- repository context
export function loadContext(root) {
  root = fs.realpathSync(root);
  const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const meta = read("archive/data/question_metadata.json");
  const identityDoc = read("archive/data/question_identity_map.json");
  const rowsBySource = new Map(), identityCountBySource = new Map();
  for (const r of meta.records) { if (!rowsBySource.has(r.sourceArchiveFile)) rowsBySource.set(r.sourceArchiveFile, []); rowsBySource.get(r.sourceArchiveFile).push(r); }
  for (const r of identityDoc.records) identityCountBySource.set(r.sourceArchiveFile, (identityCountBySource.get(r.sourceArchiveFile) || 0) + 1);
  const decisionDoc = fs.readFileSync(path.join(root, DECISION_DOCUMENT), "utf8");
  if (!decisionDoc.includes(DECISION_SECTION)) throw new Error(`DECISION_SECTION_MISSING:${DECISION_DOCUMENT}`);
  return { root, records: new Map(meta.records.map(r => [r.questionUid, r])), identity: new Map(identityDoc.records.map(r => [r.questionUid, r])), identityDoc,
    rowsBySource, identityCountBySource, registry: loadRegistry(root), aliases: loadCourseAliases(root), judgedBank: null,
    master: loadTagMaster(root), courseNames: loadCourseGroupNames(root),
    readBank(file) {
      const rel = `archive/exams/${file}`;
      const bytes = fs.readFileSync(path.join(root, rel));
      return { bank: loadBank(bytes.toString("utf8"), file), bytes };
    },
    blobOf: (file, bytes) => gitBlob(root, `archive/exams/${file}`, bytes) };
}

// ---------------------------------------------------------------- CLI
export function parseCli(argv) {
  const args = { results: [], resultsDir: [], exams: null, examsFile: null, limit: null, out: null, dryRun: false, summaryGlobal: false, skippedOut: null, root: here, allowPackAdditions: false, includeReceiptRows: false, judgedBase: "auto", bundles: null, bundlesDir: null, bundlesOnly: false, replaceDraft: false, maxRequests: null,
    approvedBy: "사용자 결정 2026-11-17: 유형(PT/TPL)은 dots 직접 판정 1회를 정본으로 받는다 (docs/agents/metadata.md CURRENT). 판정 근거 문장은 증거 원장에 있다." };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const value = () => { if (i + 1 >= argv.length || argv[i + 1].startsWith("--")) throw new Error(`MISSING_VALUE:${k}`); return argv[++i]; };
    if (k === "--results") args.results.push(value());
    else if (k === "--results-dir") args.resultsDir.push(value());
    else if (k === "--exams") args.exams = value().split(",").map(s => s.trim()).filter(Boolean);
    else if (k === "--exams-file") args.examsFile = value();
    else if (k === "--limit") { args.limit = Number(value()); if (!Number.isInteger(args.limit) || args.limit < 1) throw new Error("INVALID_LIMIT"); }
    else if (k === "--out") args.out = value();
    else if (k === "--skipped-out") args.skippedOut = value();
    else if (k === "--root") args.root = value();
    else if (k === "--dry-run") args.dryRun = true;
    else if (k === "--summary-global") args.summaryGlobal = true;
    else if (k === "--allow-pack-scope-additions") args.allowPackAdditions = true;
    else if (k === "--include-receipt-rows") args.includeReceiptRows = true;
    else if (k === "--judged-base") { const v = value(); args.judgedBase = v === "none" ? null : v; }
    else if (k === "--approve-same-draft") { args.approveSameDraft = true; args.replaceDraft = true; }
    else if (k === "--judge") args.judge = value();
    else if (k === "--approved-by") args.approvedBy = value();
    else if (k === "--bundles") args.bundles = value();
    else if (k === "--bundles-dir") args.bundlesDir = value();
    else if (k === "--bundles-only") args.bundlesOnly = true;
    else if (k === "--owner-pack") { const [b, pack] = value().split("="); if (!b || !pack) throw new Error("INVALID_OWNER_PACK"); (args.ownerPackByBundle ||= new Map()).set(b, pack); }
    else if (k === "--replace-draft-types") args.replaceDraft = true;
    else if (k === "--exclude-uids") args.excludeUidsFile = value();
    else if (k === "--max-requests") { args.maxRequests = Number(value()); if (!Number.isInteger(args.maxRequests) || args.maxRequests < 1) throw new Error("INVALID_MAX_REQUESTS"); }
    else throw new Error(`INVALID_ARGUMENT:${k}`);
  }
  if (!args.results.length && !args.resultsDir.length) throw new Error("RESULTS_REQUIRED");
  if (args.examsFile) args.exams = [...(args.exams || []), ...fs.readFileSync(args.examsFile, "utf8").split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"))];
  return args;
}
export function run(args) {
  const ctx = loadContext(args.root);
  const { rows: resultRows, commits } = readResultTables(ctx.root, [...args.results.map(ref => ({ ref })), ...args.resultsDir.map(dir => ({ dir }))]);
  if (args.judgedBase) ctx.judgedBank = makeJudgedBank(ctx.root, args.judgedBase);
  // New PT/TPL keys: the NEW_KEY bundle tables turn NEW_KEY lines (and PT-only lines that need a new template) into ordinary PICK lines of
  // keys that exist only in a copy of the registry; the requests carry the add-only registryChanges that make them real.
  let planCtx = ctx, rows = resultRows, newKeys = null, bundleOrigin = null;
  if (args.bundles || args.bundlesDir) {
    const tables = readBundleTables(ctx.root, args.bundles ? { ref: args.bundles } : { dir: path.resolve(args.bundlesDir) });
    bundleOrigin = tables.origin;
    newKeys = prepareNewKeys({ ctx, tables, resultRows, env: { curriculumGuess, pathGrade }, opts: { bundlesOnly: args.bundlesOnly, ownerPackByBundle: args.ownerPackByBundle } });
    planCtx = { ...newKeys.ctx, newKeys: { finalize: newKeys.finalize } };
    rows = newKeys.rows;
    args.allowPackAdditions = true;
  }
  // existing key + this row's grade binding (grade-bindings.mjs): sees the registry as the new-key step left it
  planCtx = { ...planCtx, gradeBindings: createGradeBindings({ ctx: planCtx, env: { curriculumGuess, pathGrade } }) };
  const built = planRequests({ ctx: planCtx, resultRows: rows, exams: args.exams, limit: args.limit, approvedBy: args.approvedBy, judge: args.judge || "dots",
    allowPackAdditions: args.allowPackAdditions, includeReceiptRows: args.includeReceiptRows, replaceDraft: args.replaceDraft, approveSameDraft: Boolean(args.approveSameDraft),
    excludeUids: args.excludeUidsFile ? new Set(fs.readFileSync(args.excludeUidsFile, "utf8").split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"))) : null });
  // One batch = the first N requests in registration (file name) order; the rest are left for the next run on a main that holds this batch.
  if (args.maxRequests) {
    const keep = new Set(built.requests.map(r => r.requestId).sort().slice(0, args.maxRequests));
    built.requests = built.requests.filter(r => keep.has(r.requestId));
    for (const key of [...built.files.keys()]) if (!keep.has(/([^/]+?)(?:\.type-ledger)?\.json$/.exec(key)[1])) built.files.delete(key);
  }
  let head = null;
  try { head = git(ctx.root, "rev-parse", "HEAD").trim(); } catch { /* not a git checkout */ }
  const summary = summarize({ requests: built.requests, skipped: built.skipped, resultLines: resultRows.length, commits, head });
  summary.options = { allowPackScopeAdditions: args.allowPackAdditions, includeReceiptRows: args.includeReceiptRows, judgedBase: args.judgedBase,
    bundles: args.bundles || args.bundlesDir || null, bundlesOnly: args.bundlesOnly, replaceDraftTypes: args.replaceDraft, maxRequests: args.maxRequests };
  if (newKeys) summary.newKeys = { bundleTables: bundleOrigin, bundles: { pt: newKeys.stats.ptBundles, tpl: newKeys.stats.tplBundles }, lines: newKeys.stats.lines, ...built.stats.newKeys };
  if (args.judgedBase) summary.judgedBaseCheck = built.stats.judgedBase; // unverified = judged-time exam not found: the current question is used and counted here; changedKept = stem/choices changed since the judgment, type kept
  summary.gradeBindingRows = built.stats.gradeBindingRows;
  const planned = new Map(built.requests.flatMap(r => r.items.map(i => [i.questionUid, { pt: i.after.problemTypeKey, tpl: i.after.templateKey || "" }])));
  summary.typeSelectable = { scope: "requested exams", estimate: "catalog metaHint gate replicated; builder not run", ...typeSelectable(planCtx, built.requests.map(r => r.sourceArchiveFile), planned) };
  if (args.summaryGlobal) summary.typeSelectableAllExams = { scope: "every exam in canonical metadata", ...typeSelectable(planCtx, [...ctx.rowsBySource.keys()].sort(), planned) };
  const write = Boolean(args.out) && !args.dryRun;
  if (write) {
    const out = path.resolve(args.out);
    for (const [rel, content] of built.files) { const full = path.join(out, rel); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, content, "utf8"); }
  }
  if (args.skippedOut) fs.writeFileSync(path.resolve(args.skippedOut), built.skipped.map(s => JSON.stringify(s)).join("\n") + (built.skipped.length ? "\n" : ""), "utf8");
  return { summary: { ...summary, written: write ? built.files.size : 0, dryRun: !write }, built, ctx };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.stdout.write(json(run(parseCli(process.argv.slice(2))).summary)); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
