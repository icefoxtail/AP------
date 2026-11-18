#!/usr/bin/env node
// Converts single-model draft judgment ledgers (meta-judgment-ledger-v1, difficulty items) into difficulty registration requests
// for the existing difficulty lane (register-difficulty5.mjs, schema archive-difficulty5-register-request-v1) with
// approvalType DRAFT_SINGLE_MODEL. Nothing is judged or repaired here: the ledger's bucket, confidence and boundary are copied as they are.
//
//   node archive/tools/meta-foundation/build-draft-difficulty-requests.mjs --ledgers <dir> [--state <STATE.json>] \
//        [--exams a.js,b.js | --exams-file <file>] [--limit N] [--out <repo root>] [--registrar-dry-run] [--skipped-out <file>] [--include-receipt-rows]
//
// Without --out nothing is written (the summary is printed). With --out <dir> the request files go to
// <dir>/.archive-meta-register/inbox/. Requests are NOT meant to be committed: rerun this command on a fresh main right before
// registration (deterministic: same inputs give byte-identical files). --state keeps only exams the runner marked "done".
//
// Machine checks only (docs/agents/metadata.md, "단일 모델 초안 등급"): the value is an integer 1..5 with a valid confidence and
// boundary; the question exists and the UID <-> source ordinal join holds; the stem and choices are what they were when judged
// (ledger stemChoicesSha256); a row that already has a 1..5 number is never overwritten. Nothing else drops an item.
// The binding recorded in the request is the text-v1 fingerprint of stem + choices (archive/question-binding.js).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { SCHEMA, DRAFT_SINGLE_MODEL, registerDifficulty5 } from "./register-difficulty5.mjs";
import { textFingerprint } from "./text-binding-lib.mjs";

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export const LEDGER_SCHEMA = "meta-judgment-ledger-v1";
export const INBOX_DIR = ".archive-meta-register/inbox";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const CONFIDENCE = new Set(["high", "medium", "low"]);
const BOUNDARY = new Set(["B12", "B23", "B34", "B45"]);
const sha256 = v => crypto.createHash("sha256").update(v).digest("hex");
const blobSha = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const json = v => JSON.stringify(v, null, 2) + "\n";
const isBucket = v => Number.isInteger(v) && v >= 1 && v <= 5;

// Same formula as the judging runner's stemChoicesHash (it wrote the ledger's stemChoicesSha256): the stem without figure tags,
// whitespace collapsed, and the choices as text. Used only to tell whether the question text is the one that was judged.
const stemOf = q => {
  if (typeof q?.content === "string" && q.content.trim()) return q.content;
  if (typeof q?.question === "string" && q.question.trim()) return q.question;
  if (typeof q?.stem === "string" && q.stem.trim()) return q.stem;
  return typeof q?.content === "string" ? q.content : "";
};
export function judgedStemChoicesSha256(q) {
  const stem = stemOf(q).replace(/<(img|svg|figure|picture)[\s\S]*?(<\/\1>|\/?>)/gi, "").replace(/<p>\s*<\/p>/g, "").replace(/\s+/g, " ").trim();
  const choices = Array.isArray(q.choices) ? q.choices.map(c => String(c)) : null;
  return sha256(JSON.stringify({ stem, choices }));
}
export const textBindingSha256 = textFingerprint;

// Same bank lookup as the registrar (register-difficulty5.mjs parseBank).
function parseBank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions;
  if (!Array.isArray(bank)) throw new Error("question bank missing in source");
  return JSON.parse(JSON.stringify(bank));
}
const lfBlobSha = bytes => blobSha(bytes.includes(0x0d) ? Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"), "utf8") : bytes);

// ctx: { metaByUid, idByUid, readSource(file) -> Buffer|null }
// Returns { request|null, skipped: [{questionUid, ordinal, reason}], stats }.
export function planExamRequest({ ledger, ledgerName, ledgerBytes, ctx, includeReceiptRows = false }) {
  const skipped = [], stats = { requested: 0, eligible: 0, alreadyFilled: 0 };
  const skip = (item, reason) => skipped.push({ exam: ledger?.sourceArchiveFile ?? ledgerName, questionUid: item?.questionUid ?? null, ordinal: item?.ordinal ?? null, reason });
  if (ledger?.schemaVersion !== LEDGER_SCHEMA || ledger.draftGrade !== true || typeof ledger.model !== "string" || !ledger.model.trim() ||
      typeof ledger.sourceArchiveFile !== "string" || !Array.isArray(ledger.items)) {
    skip(null, "LEDGER_SCHEMA");
    return { request: null, skipped, stats };
  }
  const source = ledger.sourceArchiveFile.normalize("NFC");
  const wanted = ledger.items.filter(item => item?.requested?.difficulty === true);
  stats.requested = wanted.length;
  if (!wanted.length) return { request: null, skipped, stats };
  const bytes = ctx.readSource(source);
  let bank = null;
  if (!bytes) wanted.forEach(item => skip(item, "SOURCE_FILE_MISSING"));
  else try { bank = parseBank(bytes); } catch { wanted.forEach(item => skip(item, "SOURCE_BANK_UNREADABLE")); }
  if (!bank) return { request: null, skipped, stats };

  const items = [], seen = new Set();
  for (const item of wanted) {
    const n = item.ordinal, uid = item.questionUid;
    if (item.status === "dropped" || !isBucket(item.difficultyBucket)) { skip(item, item.status === "dropped" ? "LEDGER_DROPPED:" + (item.dropReason ?? "") : "NO_VALID_DIFFICULTY_VALUE"); continue; }
    const confidence = typeof item.confidence === "string" ? item.confidence.toLowerCase() : null;
    if (!CONFIDENCE.has(confidence)) { skip(item, "CONFIDENCE_NOT_HIGH_MEDIUM_LOW"); continue; }
    const boundary = item.boundary === null || item.boundary === undefined ? "NONE" : item.boundary;
    if (boundary !== "NONE" && !BOUNDARY.has(boundary)) { skip(item, "BOUNDARY_INVALID"); continue; }
    if (!Number.isInteger(n) || n < 1 || n > bank.length || seen.has(n) || seen.has(uid)) { skip(item, "ORDINAL_OUT_OF_BANK_OR_DUPLICATE"); continue; }
    const rec = ctx.metaByUid.get(uid), id = ctx.idByUid.get(uid);
    if (!rec || !id) { skip(item, "QUESTION_NOT_IN_METADATA"); continue; }
    if (rec.sourceArchiveFile !== source || rec.sourceOrdinal !== n || id.sourceArchiveFile !== source || id.sourceOrdinal !== n) { skip(item, "UID_ORDINAL_MISMATCH"); continue; }
    const q = bank[n - 1];
    if (judgedStemChoicesSha256(q) !== item.stemChoicesSha256) { skip(item, "STEM_OR_CHOICES_CHANGED_SINCE_JUDGED"); continue; }
    const binding = textFingerprint(q);
    if (!binding) { skip(item, "STEM_EMPTY"); continue; }
    if (isBucket(rec.difficultyBucket)) { stats.alreadyFilled++; skip(item, "ALREADY_HAS_DIFFICULTY"); continue; }
    if (/^approved/i.test(String(rec.fieldStatus?.difficulty ?? "")) && rec.fieldStatus.difficulty !== "approved_source") { skip(item, "APPROVED_STATUS_NOT_OVERWRITTEN"); continue; }
    // A row with a registration receipt is replayed against that receipt byte for byte; changing its status would read as drift.
    if (!includeReceiptRows && (rec.metadataApprovalType || (rec.approvalEvidence || []).some(ref => /evidence\/reviewed-exam-meta\/v1\//.test(ref)))) { skip(item, "RECEIPT_ROW_HELD"); continue; }
    seen.add(n); seen.add(uid);
    // Integer 1..5 only: the request carries no level (user decision 2026-11-18); the lane writes legacyLevelCompatibility only when the row already has one.
    items.push({ ordinal: n, questionUid: uid,
      after: { difficultyBucket: item.difficultyBucket, difficultyConfidence: confidence, difficultyBoundaryFlag: boundary },
      textBindingFingerprint: binding });
  }
  stats.eligible = items.length;
  if (!items.length) return { request: null, skipped, stats };
  items.sort((a, b) => a.ordinal - b.ordinal);
  const request = {
    schemaVersion: SCHEMA, approvalType: DRAFT_SINGLE_MODEL, judge: ledger.model,
    resultSource: { ledger: ledgerName, ledgerSha256: sha256(ledgerBytes), createdAt: ledger.createdAt ?? null, sourceHeadSha: ledger.sourceHeadSha ?? null },
    gemini: { schemaVersion: "v1", requestId: "draft-difficulty-" + ledgerName.replace(/\.json$/, ""), createdAt: ledger.createdAt ?? null,
      sourceArchiveFile: source, latestBlobSha: lfBlobSha(bytes), items } };
  return { request, skipped, stats };
}

export function loadContext(root) {
  const metaDoc = JSON.parse(fs.readFileSync(path.join(root, META), "utf8"));
  const ids = JSON.parse(fs.readFileSync(path.join(root, IDENTITY), "utf8"));
  return { metaByUid: new Map(metaDoc.records.map(r => [r.questionUid, r])), idByUid: new Map(ids.records.map(r => [r.questionUid, r])),
    readSource: file => { const full = path.join(root, "archive/exams", file); return fs.existsSync(full) ? fs.readFileSync(full) : null; } };
}

function main() {
  const argv = process.argv.slice(2);
  const opt = name => { const i = argv.indexOf("--" + name); return i < 0 ? undefined : (argv[i + 1] === undefined || argv[i + 1].startsWith("--") ? true : argv[i + 1]); };
  const root = opt("repo-root") ? path.resolve(String(opt("repo-root"))) : here;
  if (!opt("ledgers") || opt("ledgers") === true) throw new Error("--ledgers <dir> required");
  const dir = path.resolve(String(opt("ledgers")));
  let names = fs.readdirSync(dir).filter(n => n.endsWith(".json")).sort();
  if (opt("state") && opt("state") !== true) {
    const state = JSON.parse(fs.readFileSync(path.resolve(String(opt("state"))), "utf8")).exams || {};
    names = names.filter(n => state[n.replace(/\.json$/, "")]?.status === "done");
  }
  const examsArg = opt("exams") && opt("exams") !== true ? String(opt("exams")).split(",") : opt("exams-file") && opt("exams-file") !== true ? fs.readFileSync(String(opt("exams-file")), "utf8").split("\n").map(s => s.trim()).filter(Boolean) : null;
  if (examsArg) { const want = new Set(examsArg.map(e => e.normalize("NFC").replace(/\\/g, "/").replace(/^(?:\.?\/)?(?:archive\/)?exams\//, ""))); names = names.filter(n => want.has(JSON.parse(fs.readFileSync(path.join(dir, n), "utf8")).sourceArchiveFile?.normalize("NFC"))); }
  if (opt("limit") && opt("limit") !== true) names = names.slice(0, Number(opt("limit")));
  const ctx = loadContext(root);
  const includeReceiptRows = Boolean(opt("include-receipt-rows"));
  const summary = { ledgers: names.length, withDifficultyItems: 0, requestedItems: 0, requests: 0, registrable: 0, alreadyFilled: 0, dropped: 0, byReason: {}, refusedFiles: [], registrar: null };
  const skippedAll = [], written = [];
  const reg = { APPLY: 0, ALREADY_REGISTERED: 0, CONFLICT: 0, SKIP_INVALID: 0 };
  for (const name of names) {
    const bytes = fs.readFileSync(path.join(dir, name));
    const { request, skipped, stats } = planExamRequest({ ledger: JSON.parse(bytes.toString("utf8")), ledgerName: name, ledgerBytes: bytes, ctx, includeReceiptRows });
    summary.requestedItems += stats.requested; if (stats.requested) summary.withDifficultyItems++;
    summary.alreadyFilled += stats.alreadyFilled;
    let usable = request;
    if (request && opt("registrar-dry-run")) {
      try {
        const result = registerDifficulty5({ root, request });
        for (const key of Object.keys(reg)) reg[key] += result.summary[key] || 0;
      } catch (error) {
        summary.refusedFiles.push({ file: request.gemini.sourceArchiveFile, message: String(error.message).slice(0, 200) });
        skipped.push(...request.gemini.items.map(i => ({ exam: request.gemini.sourceArchiveFile, questionUid: i.questionUid, ordinal: i.ordinal, reason: "REGISTRAR_REFUSED_FILE" })));
        usable = null;
      }
    }
    for (const row of skipped) summary.byReason[row.reason.split(":")[0]] = (summary.byReason[row.reason.split(":")[0]] || 0) + 1;
    skippedAll.push(...skipped);
    if (usable) {
      summary.requests++; summary.registrable += usable.gemini.items.length;
      if (opt("out") && opt("out") !== true) {
        const file = path.join(path.resolve(String(opt("out"))), INBOX_DIR, "diff5-" + usable.gemini.requestId + ".json");
        fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, json(usable), "utf8"); written.push(file);
      }
    }
  }
  summary.dropped = skippedAll.filter(r => !["ALREADY_HAS_DIFFICULTY"].includes(r.reason)).length;
  if (opt("registrar-dry-run")) summary.registrar = reg;
  if (written.length) summary.written = written.length;
  if (opt("skipped-out") && opt("skipped-out") !== true) fs.writeFileSync(path.resolve(String(opt("skipped-out"))), json(skippedAll), "utf8");
  console.log(json(summary));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
