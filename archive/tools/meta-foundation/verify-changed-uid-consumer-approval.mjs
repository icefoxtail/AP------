#!/usr/bin/env node
// Read-only gate: every UID changed by a merged small registration JSON must be
// effectively approved in the SAME consumer path the student search page uses:
//   Archive2Canonical.loadInputBundle -> resolveCatalog({versionBundle})
//   -> ProblemBankMeta.buildIndex(catalog.records + currentSourceJsSha256,
//        generated-lite-consumer index, {excludedHoldUids}).
// Raw archive2-catalog.json values alone never count as PASS. This tool never
// writes repository data files; it only appends to --summary-file when given.
//
// Usage:
//   node archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs \
//     [--request <json>]... [--scoped <json>]... [--summary-file <md>] [--root <dir>]
// Exit 0 = PASS, 1 = FAIL (or any unreadable/unsupported input), 2 = usage error.
//
// Effective-field mapping (verified empirically against the real consumer):
//   Each changed field is looked up, in order, on (1) the ProblemBankMeta.buildIndex
//   row the page filters on, (2) the resolveCatalog row, (3) the resolved row's
//   assignmentEvidence (the digest-bound approved assignment). The first object
//   that OWNS the key wins; a key owned by none is reported under
//   `unobservedFields` (not a failure: the consumer simply does not expose it).
//   - request `curriculum`/`curriculumKey` -> row.curriculumKey; `courseKey` -> row.courseKey
//   - `L1..L4` -> the resolveCatalog row's L1..L4 (effective value) AND shown by the page as
//     `L1..L4` (basic parent links; = rpmL*) or `nativeL1..nativeL4` (reviewed v2 registrations;
//     ProblemBankMeta.project() overwrites the page's L1..L4 with rpmL*, null for natives)
//   - problemTypeKey/templateKey/crossConceptKeys/conditionKeys/integrationPattern/
//     difficultyBucket/level/standard* /subUnit* -> same-named row field
//   - sourceFingerprint -> row.sourceFingerprint; contentFingerprint/defaultSelectable/
//     curriculumApplicability -> assignmentEvidence (receipt-bound accepted record)
// Approved-assignment marker exposed by resolveCatalog for an effective UID:
//   row.canonicalAssignmentReasons === []  AND
//   row.assignmentEvidence.approvalStatus === "APPROVED" AND
//   row.assignmentEvidence.reviewEvidence.status === "PASS"
//   (anything else leaves canonicalAssignmentReasons non-empty and blanks L1/L2/...).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { isDeepStrictEqual } from "node:util";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadResolvedConsumerCatalog } from "./reviewed-exam-registration-v2.mjs";

const require = createRequire(import.meta.url);
const SCHEMA = {
  PINPOINT: "archive-finalqa-pinpoint-register-request-v1",
  NONPT: "archive-finalqa-nonpt-register-request-v1",
  V2: "archive-reviewed-exam-meta-register-request-v2",
  LEGACY: "archive-reviewed-exam-meta-register-request-v1",
  SCOPED_LINKS: "archive2-reviewed-basic-source-links-exam-scoped-v1",
};
const GENERATED_INDEX = "archive/data/generated-lite-consumer/v1/index.json";
// Fields the page can filter on; used for the final "UID is returned by the page query" proof.
const QUERY_FIELDS = ["standardCourse", "standardUnitKey", "subUnitKey", "L1", "L2", "L3", "L4", "nativeL1", "nativeL2", "nativeL3", "nativeL4",
  "problemTypeKey", "templateKey", "integrationPattern", "difficultyBucket"];
const LABEL_FIELDS = new Set(["L1", "L2", "L3", "L4"]);
// Fields resolveCatalog blanks when no approved canonical assignment exists for the UID
// (archive2-canonical.js, the `else` branches that reset curriculumKey ... subUnit to "").
// The approved-assignment marker only matters for requests that change one of these.
const ASSIGNMENT_GOVERNED = new Set(["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey",
  "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit"]);
const changedKeys = (before, after) => Object.keys(after).filter(k => !same(before?.[k], after[k]));
const touchesAssignment = keys => keys.some(k => ASSIGNMENT_GOVERNED.has(FIELD_ALIAS[k] || k));
const FIELD_ALIAS = { curriculum: "curriculumKey" };
const nfc = value => typeof value === "string" ? value.normalize("NFC") : value;
const same = (a, b) => isDeepStrictEqual(nfc(a) ?? null, nfc(b) ?? null);
const own = (o, k) => Boolean(o) && typeof o === "object" && Object.hasOwn(o, k);
const normalizeFile = value => String(value || "").normalize("NFC").replace(/\\/g, "/").replace(/^\.?\/?archive\/exams\//, "").replace(/^\.?\/?exams\//, "").replace(/^\/+/, "");

class UnitError extends Error { constructor(reason, detail) { super(detail || reason); this.reason = reason; this.detail = detail || ""; } }

function gitBlobSha1(root, relative) {
  const bytes = fs.readFileSync(path.join(root, relative));
  if (fs.existsSync(path.join(root, ".git")))
    return execFileSync("git", ["hash-object", "--path", relative, "--stdin"], { cwd: root, input: bytes, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  return crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}

function loadBank(root, source) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, "archive/exams", source), "utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank)) throw new UnitError("SOURCE_BANK_UNAVAILABLE", source);
  return bank;
}

// The set of UIDs a request changes, derived only from the small JSON itself
// (plus the legacy registrar's own definition: every row of the source exam).
function deriveUnit(root, doc, file, catalogRowsOf) {
  const fail = (reason, detail) => { throw new UnitError(reason, detail); };
  const schema = doc?.schemaVersion;
  if (schema === SCHEMA.SCOPED_LINKS) {
    if (!Array.isArray(doc.records) || !doc.sourceArchiveFile) fail("INVALID_REQUEST", "scoped links need sourceArchiveFile and records[]");
    if (Number.isInteger(doc.recordCount) && doc.recordCount !== doc.records.length) fail("INVALID_REQUEST", "scoped recordCount mismatch");
    return { kind: "scoped-parent-links", exam: doc.sourceArchiveFile, sourceFile: doc.sourceArchiveFile, expectedBlob: doc.expectedSourceBlobSha1,
      rows: doc.records.map(r => {
        if (r.sourceFile !== doc.sourceArchiveFile) fail("INVALID_REQUEST", `record sourceFile differs at ordinal ${r.sourceOrdinal}`);
        // build-basic-scope-parent-links.mjs binds a scoped link to the question BODY
        // (sourceBodyFingerprint == assignmentFingerprint) and recomputes the full
        // sourceFingerprint from the current question: solver-only revisions after
        // the review (answer/solution edits) legitimately change the full fingerprint.
        // So the body fingerprint is the hard binding; a full-fingerprint difference is
        // reported as informational `solverOnlyRevisions`, never as a failure.
        return { ordinal: r.sourceOrdinal, bodyFingerprint: r.sourceBodyFingerprint, fullFingerprint: r.sourceFingerprint,
          gated: true, expect: { curriculumKey: r.curriculumKey, courseKey: r.courseKey, L1: r.L1, L2: r.L2 } };
      }) };
  }
  if (schema === SCHEMA.PINPOINT || schema === SCHEMA.V2) {
    if (!Array.isArray(doc.items) || !doc.sourceArchiveFile) fail("INVALID_REQUEST", "request needs sourceArchiveFile and items[]");
    const rows = doc.items.map(item => {
      if (!item?.after || typeof item.after !== "object") fail("INVALID_REQUEST", `item #${item?.sourceOrdinal} has no after`);
      // A row whose after equals its before (and repairs no identity fingerprint) changes nothing: skipped, but counted.
      const unchanged = Object.keys(item.after).every(k => same(item.before?.[k], item.after[k])) && item.identityBefore === undefined;
      return { ordinal: item.sourceOrdinal, uid: item.questionUid, expect: item.after, fingerprint: item.after.sourceFingerprint, unchanged,
        gated: touchesAssignment(changedKeys(item.before, item.after)) };
    });
    return { kind: schema === SCHEMA.V2 ? "reviewed-exam-v2" : "finalqa-pinpoint-v1", exam: doc.examUid || doc.sourceArchiveFile,
      sourceFile: doc.sourceArchiveFile, expectedBlob: doc.expectedSourceBlobSha1, rows };
  }
  if (schema === SCHEMA.NONPT) {
    if (doc.examUid !== "26_금당고_2학기_중간_고2_미적분I" ||
        doc.candidatePath !== "archive/data/meta-foundation/exam-scoped/26_금당고_2학기_중간_고2_미적분I.json")
      fail("INVALID_REQUEST", "nonPT scope is one bound 21-question exam");
    const candidate = JSON.parse(fs.readFileSync(path.join(root, doc.candidatePath), "utf8"));
    if (candidate.sourceBlobSha !== doc.expectedSourceBlobSha1 ||
        candidate.records?.length !== 21 || doc.expectedQuestionCount !== 21)
      fail("INVALID_REQUEST", "nonPT candidate/source scope drift");
    return {
      kind: "finalqa-nonpt-semantics", exam: doc.examUid, sourceFile: doc.sourceArchiveFile,
      expectedBlob: doc.expectedSourceBlobSha1,
      rows: candidate.records.map(r => ({
        ordinal: r.sourceOrdinal, uid: r.questionUid,
        gated: false, unchanged: false,
        // Do not claim PT/TPL or canonical advanced assignment. The public consumer must
        // actually expose these semantic values before this verification can pass.
        expect: { L1:r.after.L1, L2:r.after.L2, L3:r.after.L3, L4:r.after.L4,
          difficultyBucket:r.after.difficultyBucket, level:r.after.level }
      }))
    };
  }
  if (schema === SCHEMA.LEGACY) {
    const sourceFile = normalizeFile(doc.sourceArchiveFile);
    if (!sourceFile) fail("INVALID_REQUEST", "legacy request needs sourceArchiveFile");
    const bank = loadBank(root, sourceFile);
    if (Number.isInteger(doc.expectedQuestionCount) && doc.expectedQuestionCount !== bank.length) fail("INVALID_REQUEST", "legacy expectedQuestionCount differs from source");
    // registerLegacy's own UID set and source/metadata parity fields.
    return { kind: "reviewed-exam-v1-legacy", exam: doc.examUid || sourceFile, sourceFile, expectedBlob: doc.expectedSourceBlobSha1,
      rows: bank.map((q, i) => ({ ordinal: i + 1, gated: true, expect: { standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey,
        problemTypeKey: q.problemTypeKey, templateKey: q.templateKey, crossConceptKeys: q.crossConceptKeys || [], conditionKeys: q.conditionKeys || [],
        integrationPattern: q.integrationPattern || "NONE", difficultyBucket: q.difficultyBucket } })) };
  }
  return fail("UNSUPPORTED_REQUEST_SCHEMA", `${file}: schemaVersion=${JSON.stringify(schema)}`);
}

function loadConsumer(root) {
  const catalog = loadResolvedConsumerCatalog(root);
  const records = catalog.records;
  const ProblemBankMeta = require("../../problem-bank-meta.js");
  const generated = JSON.parse(fs.readFileSync(path.join(root, GENERATED_INDEX), "utf8"));
  const shaByFile = new Map(catalog.sourceHashes || []);
  // Exactly what archive/problem-bank-search.html does.
  const sourceRows = records.map(row => ({ ...row, currentSourceJsSha256: shaByFile.get(row.sourceFile) || "" }));
  const inventory = ProblemBankMeta.buildIndex(sourceRows, generated.records, { excludedHoldUids: generated.userDisabledUids || [] });
  return {
    ProblemBankMeta, inventory,
    resolvedBySource: new Map(records.map(r => [`${normalizeFile(r.sourceFile)}#${Number(r.sourceOrdinal)}`, r])),
    pageByUid: new Map(inventory.map(r => [r.uid, r])),
  };
}

function checkRow(consumer, unit, row) {
  const key = `${normalizeFile(unit.sourceFile)}#${Number(row.ordinal)}`;
  const resolved = consumer.resolvedBySource.get(key);
  if (!resolved) return { reason: "ROW_MISSING_IN_RESOLVED_CATALOG", detail: key };
  const uid = resolved.questionUid;
  const out = { uid, unobserved: [] };
  if (row.uid !== undefined && row.uid !== uid) return { ...out, reason: "UID_MISMATCH", detail: `request ${row.uid} != consumer ${uid}` };
  if (row.fingerprint !== undefined && row.fingerprint !== resolved.sourceFingerprint)
    return { ...out, reason: "SOURCE_FINGERPRINT_MISMATCH", detail: `request ${row.fingerprint} != consumer ${resolved.sourceFingerprint}` };
  if (row.bodyFingerprint !== undefined && row.bodyFingerprint !== resolved.assignmentFingerprint)
    return { ...out, reason: "BODY_FINGERPRINT_MISMATCH", detail: `request ${row.bodyFingerprint} != consumer assignmentFingerprint ${resolved.assignmentFingerprint}` };
  if (row.fullFingerprint !== undefined && row.fullFingerprint !== resolved.sourceFingerprint) out.solverOnlyRevision = true;
  if (Array.isArray(resolved.metadataConflicts) && resolved.metadataConflicts.length)
    return { ...out, reason: "METADATA_CONFLICT", detail: resolved.metadataConflicts.join(",") };
  const evidence = resolved.assignmentEvidence;
  const reasons = resolved.canonicalAssignmentReasons;
  if (!Array.isArray(reasons) || reasons.length || evidence?.approvalStatus !== "APPROVED" || evidence?.reviewEvidence?.status !== "PASS") {
    const detail = `reasons=${JSON.stringify(reasons ?? null)} approvalStatus=${evidence?.approvalStatus ?? null} reviewEvidence=${evidence?.reviewEvidence?.status ?? null}`;
    // The marker gates only requests that change assignment-governed fields (or scoped parent links).
    // Otherwise a missing canonical assignment is a pre-existing catalog gap outside this request:
    // record it as informational and keep verifying everything the request does change.
    if (row.gated) return { ...out, reason: "NOT_APPROVED_IN_CONSUMER", detail };
    out.assignmentPending = Array.isArray(reasons) && reasons.length ? reasons.join(",") : detail;
  }
  const page = consumer.pageByUid.get(uid);
  if (!page) return { ...out, reason: "NOT_IN_PROBLEM_BANK_INDEX" };
  if (page.directSelectable !== true) return { ...out, reason: "NOT_DIRECT_SELECTABLE" };
  const mismatches = [];
  const queryFilters = {};
  for (const [field, expected] of Object.entries(row.expect)) {
    const name = FIELD_ALIAS[field] || field;
    // While the canonical assignment is pending resolveCatalog blanks the governed fields; this request does
    // not change them (otherwise the row would have failed above), so they are not part of its claim.
    if (out.assignmentPending && ASSIGNMENT_GOVERNED.has(name)) continue;
    if (LABEL_FIELDS.has(name)) {
      // ProblemBankMeta.project() overwrites the page row's L1..L4 with rpmL1..L4 (null for
      // natively registered rows), so the page shows reviewed labels as nativeL1..nativeL4 there
      // and as L1/L2 for basic parent links. The effective value is the resolveCatalog row's;
      // the page must additionally expose it under one of the two names.
      if (!own(resolved, name) || !same(resolved[name], expected)) { mismatches.push(`${field}: request ${JSON.stringify(expected)} != consumer ${JSON.stringify(resolved[name] ?? null)}`); continue; }
      const shownAs = [name, "native" + name].find(k => same(page[k], expected));
      if (!shownAs) mismatches.push(`${field}: effective ${JSON.stringify(expected)} is not shown by the page (${name}=${JSON.stringify(page[name] ?? null)}, native${name}=${JSON.stringify(page["native" + name] ?? null)})`);
      else queryFilters[shownAs] = expected;
      continue;
    }
    const holder = [page, resolved, evidence].find(o => own(o, name));
    if (!holder) { out.unobserved.push(field); continue; }
    if (!same(holder[name], expected)) mismatches.push(`${field}: request ${JSON.stringify(expected)} != consumer ${JSON.stringify(holder[name] ?? null)}`);
    else if (QUERY_FIELDS.includes(name) && holder === page && expected !== null && expected !== undefined && expected !== "" && !Array.isArray(expected)) queryFilters[name] = expected;
  }
  if (mismatches.length) return { ...out, reason: "VALUE_MISMATCH", detail: mismatches.join("; ") };
  if (Object.keys(queryFilters).length && !consumer.ProblemBankMeta.query(consumer.inventory, queryFilters).some(r => r.uid === uid))
    return { ...out, reason: "NOT_RETURNED_BY_PAGE_QUERY", detail: JSON.stringify(queryFilters) };
  return out;
}

export function verifyChangedUidConsumerApproval({ root, requestPaths = [], scopedPaths = [] }) {
  let mainSha = "UNKNOWN";
  try { mainSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); } catch { /* not a git checkout */ }
  const result = { status: "PASS", mainSha, counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 0 }, exams: [], failures: [], unobservedFields: [], solverOnlyRevisions: [], assignmentPending: [] };
  const inputs = [...requestPaths, ...scopedPaths];
  if (!inputs.length) { result.status = "FAIL"; result.failures.push({ exam: "-", qid: "-", uid: "-", reason: "NO_INPUT", detail: "no --request/--scoped given" }); return result; }
  const units = [];
  for (const file of inputs) {
    try {
      const doc = JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
      units.push({ file, unit: deriveUnit(root, doc, file) });
    } catch (error) {
      const reason = error instanceof UnitError ? error.reason : "REQUEST_UNREADABLE";
      result.failures.push({ exam: file, qid: "-", uid: "-", reason, detail: error.detail || error.message });
    }
  }
  let consumer = null;
  if (units.length) {
    try { consumer = loadConsumer(root); } catch (error) {
      result.failures.push({ exam: "-", qid: "-", uid: "-", reason: "CONSUMER_LOAD_FAILED", detail: error.message });
    }
  }
  for (const { file, unit } of units) {
    const summary = { file, kind: unit.kind, exam: unit.exam, sourceFile: unit.sourceFile, changed: 0, checked: 0, passed: 0, skippedUnchanged: 0 };
    result.exams.push(summary);
    const rows = unit.rows.filter(r => !r.unchanged);
    summary.skippedUnchanged = unit.rows.length - rows.length;
    summary.changed = rows.length;
    result.counts.skippedUnchanged += summary.skippedUnchanged;
    result.counts.changed += rows.length;
    if (!consumer) continue;
    let sourceBound = true;
    try {
      const blob = gitBlobSha1(root, `archive/exams/${normalizeFile(unit.sourceFile)}`);
      if (unit.expectedBlob !== blob) {
        sourceBound = false;
        result.failures.push({ exam: unit.exam, qid: "-", uid: "-", reason: "SOURCE_BLOB_MISMATCH", detail: `request ${unit.expectedBlob ?? null} != worktree ${blob}` });
      }
    } catch (error) {
      sourceBound = false;
      result.failures.push({ exam: unit.exam, qid: "-", uid: "-", reason: "SOURCE_UNREADABLE", detail: error.message });
    }
    if (!sourceBound) continue;
    for (const row of rows) {
      summary.checked++; result.counts.checked++;
      const checked = checkRow(consumer, unit, row);
      if (checked.reason) result.failures.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid || row.uid || "-", reason: checked.reason, detail: checked.detail || "" });
      else { summary.passed++; result.counts.passed++; }
      if (checked.assignmentPending && !checked.reason) result.assignmentPending.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid, reason: checked.assignmentPending });
      if (checked.solverOnlyRevision) result.solverOnlyRevisions.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid });
      if (checked.unobserved?.length) result.unobservedFields.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid, fields: checked.unobserved });
    }
  }
  if (result.failures.length || result.counts.checked !== result.counts.changed) result.status = "FAIL";
  return result;
}

export function renderSummary(result) {
  const c = result.counts;
  const lines = ["### Changed-UID effective consumer approval", ""];
  if (result.status === "PASS") {
    lines.push(`PASS: changed ${c.passed}/${c.changed} approved (checked ${c.checked}, skippedUnchanged ${c.skippedUnchanged}), main \`${result.mainSha}\`.`);
  } else {
    lines.push(`FAIL: changed ${c.changed}, checked ${c.checked}, passed ${c.passed}, skippedUnchanged ${c.skippedUnchanged}, main \`${result.mainSha}\`.`, "",
      "| exam | QID | UID | reason |", "| --- | --- | --- | --- |");
    for (const f of result.failures) lines.push(`| ${f.exam} | ${f.qid} | ${f.uid} | ${f.reason}${f.detail ? `: ${String(f.detail).replace(/\|/g, "\\|")}` : ""} |`);
  }
  for (const e of result.exams) lines.push("", `- ${e.kind} \`${e.exam}\`: changed ${e.changed}, checked ${e.checked}, passed ${e.passed}, skippedUnchanged ${e.skippedUnchanged}`);
  if (result.assignmentPending?.length) {
    const byExam = new Map();
    for (const r of result.assignmentPending) byExam.set(r.exam, [...(byExam.get(r.exam) || []), `Q${r.qid}`]);
    lines.push("", `Informational: ${result.assignmentPending.length} row(s) with canonical L1/L2 assignment not approved; outside this request's changed fields: ${[...byExam].map(([exam, qids]) => `${exam} ${qids.join(", ")}`).join("; ")}.`);
  }
  if (result.solverOnlyRevisions?.length) lines.push("", `Solver-only revisions since review (body fingerprint still bound; informational): ${result.solverOnlyRevisions.map(r => `Q${r.qid}`).join(", ")}.`);
  if (result.unobservedFields.length) lines.push("", `Fields not exposed by the consumer (informational): ${result.unobservedFields.length} row(s).`);
  return lines.join("\n") + "\n";
}

function main() {
  const args = process.argv.slice(2);
  const opt = { request: [], scoped: [], root: process.cwd(), summary: null };
  for (let i = 0; i < args.length; i++) {
    const flag = args[i], value = args[i + 1];
    if (flag === "--request" && value) { opt.request.push(value); i++; }
    else if (flag === "--scoped" && value) { opt.scoped.push(value); i++; }
    else if (flag === "--summary-file" && value) { opt.summary = value; i++; }
    else if (flag === "--root" && value) { opt.root = path.resolve(value); i++; }
    else { console.error(`usage: ${path.basename(fileURLToPath(import.meta.url))} [--request <json>]... [--scoped <json>]... [--summary-file <md>] [--root <dir>]`); process.exit(2); }
  }
  let result;
  try { result = verifyChangedUidConsumerApproval({ root: opt.root, requestPaths: opt.request, scopedPaths: opt.scoped }); }
  catch (error) {
    result = { status: "FAIL", mainSha: "UNKNOWN", counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 0 }, exams: [], unobservedFields: [], solverOnlyRevisions: [], assignmentPending: [],
      failures: [{ exam: "-", qid: "-", uid: "-", reason: "CHECKER_ERROR", detail: error.stack || error.message }] };
  }
  console.log(JSON.stringify(result, null, 2));
  if (opt.summary) fs.appendFileSync(opt.summary, renderSummary(result), "utf8");
  process.exit(result.status === "PASS" ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
