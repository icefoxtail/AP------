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
import { REVIEW2_SOURCE_OVERRIDE_FIELDS, loadResolvedConsumerCatalog, registerReviewedExamV2, verifyIdentityFingerprintConsumer } from "./reviewed-exam-registration-v2.mjs";
import { isAuditPreservation } from "./native-audit-preservation.mjs";
import { REVIEWED_META_VALUE_FIELDS } from "./reviewed-meta-value-fields.mjs";
import { isPartialSubsetPreservation } from "./native-partial-subset-preservation.mjs";
import { APPROVED_RENDERER_PRESERVATION } from "./native-approved-renderer-preservation.mjs";
import { bindDifficulty5Source, isTextBoundDraft, registerDifficulty5, sourceTextUnchangedSinceRequest } from "./register-difficulty5.mjs";
import { registerBasicScopeRebind } from "./register-basic-scope-rebind.mjs";
import { BASIC_PRESERVATION_SCHEMA } from "./reviewed-basic-preservation.mjs";
import { NATIVE_BASIC_HOLD_SCHEMA, NATIVE_BASIC_HOLD_REASON } from "./native-basic-hold-preservation.mjs";
import { NATIVE_BASIC_PARENT_SCHEMA } from "./reviewed-native-basic-parent.mjs";
import { BINDING_COURSE_CORRECTION_SCHEMA, BINDING_COURSE_CORRECTION_SCHEMA_V2, verifyBindingCourseCorrectionWithConsumer } from "./register-binding-course-correction.mjs";

import { isNativeAuthorityCorrection, registerNativeAuthorityCorrection, verifyNativeAuthorityCorrectionConsumer } from "./native-authority-correction.mjs";
import { DIRECT_JUDGMENT, FIELD_SCOPE_TYPE_ONLY, TYPE_FIELD_STATUS } from "./register-type-judgment.mjs";
import { TEXT_BOUND_REVIEW_TYPES, reviewedSourceTextUnchanged } from "./text-binding-lib.mjs";

const require = createRequire(import.meta.url);
const SCHEMA = {
  PINPOINT: "archive-finalqa-pinpoint-register-request-v1",
  NONPT: "archive-finalqa-nonpt-register-request-v1",
  V2: "archive-reviewed-exam-meta-register-request-v2",
  LEGACY: "archive-reviewed-exam-meta-register-request-v1",
  SCOPED_LINKS: "archive2-reviewed-basic-source-links-exam-scoped-v1",
  DIFF5: "archive-difficulty5-register-request-v1",
  BASIC_PARENT_CORRECTION: "archive-basic-parent-correction-request-v1",
  BASIC_REBIND: "archive-basic-scope-rebind-request-v1",
};
const DIFFICULTY_FIELDS = Object.freeze(["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"]);
const GENERATED_INDEX = "archive/data/generated-lite-consumer/v1/index.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
// Full metadata, identity and runtime records are checked by the official v2
// replay below. These are the approved values exposed by the canonical page;
// legacy labels/level remain bound to their exact native runtime instead of
// being relabelled as the canonical basic projection.
const PRESERVED_CONSUMER_FIELDS = ["curriculumKey", "courseKey", "standardCourse", "standardUnitKey", "subUnitKey",
  "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "difficultyBucket"];
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
const isInlinePlaceholder = value => value === null || value === undefined || value === "" || value === "UNKNOWN";
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
  if (schema === BINDING_COURSE_CORRECTION_SCHEMA_V2) {
    if (!doc.requestId || !Array.isArray(doc.sourceSnapshots) || !doc.sourceSnapshots.length ||
        doc.sourceSnapshots.some(s => !/^original\/middle\/m1\/(?:1|2)(?:mid|final)\/[^/\\\0]+\.js$/.test(s.sourceArchiveFile || '') ||
          !/^[a-f0-9]{40}$/.test(s.expectedSourceBlobSha1 || '')) ||
        !Array.isArray(doc.preservedConsumers) || !doc.preservedConsumers.length)
      fail("INVALID_REQUEST", "binding correction v2 needs its derived source snapshots and preserved consumers");
    // One attributable unit per request. Different exams can share ordinals;
    // their UIDs and source snapshots remain separate within this unit.
    return { kind: "binding-course-correction", exam: doc.requestId, sourceFile: null,
      sourceSnapshots: doc.sourceSnapshots, request: doc,
      rows: doc.preservedConsumers.map(r => ({ ordinal: r.sourceOrdinal, uid: r.questionUid, sourceFile: r.sourceArchiveFile, unchanged: false })) };
  }
  if (schema === BINDING_COURSE_CORRECTION_SCHEMA) {
    if (!doc.sourceArchiveFile || !Array.isArray(doc.preservedConsumers) || !doc.preservedConsumers.length)
      fail("INVALID_REQUEST", "binding correction needs its exact preserved consumer set");
    return { kind: "binding-course-correction", exam: doc.sourceArchiveFile, sourceFile: doc.sourceArchiveFile,
      expectedBlob: doc.expectedSourceBlobSha1, request: doc,
      rows: doc.preservedConsumers.map(r => ({ ordinal: r.sourceOrdinal, uid: r.questionUid, unchanged: false })) };
  }
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
    if (isNativeAuthorityCorrection(doc)) {
      if (doc.scope !== "PARTIAL_UIDS" || doc.approval?.type !== "AUTHORITY_CORRECTION" || doc.approval.metadataReviewed !== false ||
          !Number.isSafeInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount < 1 || !doc.items.length ||
          doc.registryChanges?.length || doc.approval.sourceRebind) fail("INVALID_REQUEST", "explicit authority withdrawal scope required");
      return { kind: "native-authority-withdrawal", exam: doc.examUid, sourceFile: doc.sourceArchiveFile,
        expectedBlob: doc.expectedSourceBlobSha1, expectedQuestionCount: doc.expectedQuestionCount, request: doc,
        rows: doc.items.map(item => ({ ordinal: item.sourceOrdinal, uid: item.questionUid, unchanged: false })) };
    }
    if (schema === SCHEMA.V2 && doc.approval?.type === DIRECT_JUDGMENT) {
      // Type fields only: the claim is that the consumer now shows the judged PT/TPL as approved facets (metaHint*).
      if (doc.scope !== "PARTIAL_UIDS" || doc.fieldScope !== FIELD_SCOPE_TYPE_ONLY || doc.approval.metadataReviewed !== true ||
          !Number.isSafeInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount < 1 || !doc.items.length || doc.items.length > doc.expectedQuestionCount)
        fail("INVALID_REQUEST", "direct type judgment requires its PARTIAL_UIDS TYPE_ONLY scope");
      const rows = doc.items.map(item => {
        if (!item?.questionUid || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1 || item.sourceOrdinal > doc.expectedQuestionCount ||
            typeof item.after?.problemTypeKey !== "string" || !item.after.problemTypeKey.trim())
          fail("INVALID_REQUEST", "direct type judgment item needs questionUid, sourceOrdinal and after.problemTypeKey");
        return { ordinal: item.sourceOrdinal, uid: item.questionUid, unchanged: false, gated: false,
          expect: { problemTypeKey: item.after.problemTypeKey, templateKey: typeof item.after.templateKey === "string" ? item.after.templateKey.trim() : "" } };
      });
      if (new Set(rows.map(r => r.uid)).size !== rows.length || new Set(rows.map(r => r.ordinal)).size !== rows.length)
        fail("INVALID_REQUEST", "direct type judgment UID/ordinal scope is ambiguous");
      return { kind: "direct-type-judgment", approvalType: DIRECT_JUDGMENT, exam: doc.examUid || doc.sourceArchiveFile, sourceFile: doc.sourceArchiveFile,
        expectedBlob: doc.expectedSourceBlobSha1, expectedQuestionCount: doc.expectedQuestionCount, request: doc, rows };
    }
    if (schema === SCHEMA.V2 && doc.registrationMode !== undefined) {
      if (doc.registrationMode !== "IDENTITY_FINGERPRINT_ONLY" || doc.scope !== "PARTIAL_UIDS" ||
          doc.approval?.type !== "FINAL_QA" || doc.approval.metadataReviewed !== true ||
          !Number.isSafeInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount < 1 || !doc.items.length ||
          doc.items.length > doc.expectedQuestionCount || doc.registryChanges?.length || doc.approval.sourceRebind || doc.approval.rendererPreservation !== undefined)
        fail("INVALID_REQUEST", "identity repair requires its explicit scope and creates no metadata approval");
      const rows = doc.items.map(item => {
        if (!item.questionUid || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1 || item.sourceOrdinal > doc.expectedQuestionCount ||
            [item.before, item.after].some(values => !values || Array.isArray(values) || Object.keys(values).sort().join(",") !== "contentFingerprint,sourceFingerprint") ||
            !same(item.before, item.after) || Object.values(item.after).some(value => !/^[a-f0-9]{64}$/.test(value || "")) ||
            !/^[a-f0-9]{64}$/.test(item.identityBefore?.sourceFingerprint || "") ||
            item.identityBefore.sourceFingerprint === item.after.sourceFingerprint)
          fail("INVALID_REQUEST", "identity repair must preserve exact current metadata fingerprints");
        return { ordinal: item.sourceOrdinal, uid: item.questionUid, unchanged: false, expect: item.after };
      });
      if (new Set(rows.map(r => r.uid)).size !== rows.length || new Set(rows.map(r => r.ordinal)).size !== rows.length)
        fail("INVALID_REQUEST", "identity repair UID/ordinal scope is ambiguous");
      return { kind: "identity-fingerprint-repair", exam: doc.examUid || doc.sourceArchiveFile,
        sourceFile: doc.sourceArchiveFile, expectedBlob: doc.expectedSourceBlobSha1, expectedQuestionCount: doc.expectedQuestionCount, rows };
    }
    if (schema === SCHEMA.V2 && (doc.approval?.sourceRebind !== undefined || doc.approval?.rendererPreservation !== undefined)) {
      const audit = doc.approval.type === "META_PIPELINE_AUDIT" &&
        isAuditPreservation(doc.approval);
      const partial = doc.scope === "PARTIAL_UIDS";
      const renderer = doc.approval.rendererPreservation !== undefined;
      const rendererValid = renderer && partial && doc.approval.sourceRebind === undefined &&
        doc.approval.rendererPreservation?.schemaVersion === APPROVED_RENDERER_PRESERVATION;
      if ((!audit && doc.approval.type !== "FINAL_QA") || (renderer ? !rendererValid : !doc.approval.sourceRebind ||
          typeof doc.approval.sourceRebind !== "object" || Array.isArray(doc.approval.sourceRebind) ||
          (!audit && !(partial && isPartialSubsetPreservation(doc)) && doc.approval.sourceRebind.schemaVersion !== undefined)) ||
          doc.approval.metadataReviewed !== true || doc.registryChanges?.length ||
          (doc.scope !== undefined && !partial) ||
          !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(doc.requestId || "") ||
          !Number.isSafeInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount < 1 ||
          !doc.items.length || doc.items.length > doc.expectedQuestionCount ||
          (!partial && doc.items.length !== doc.expectedQuestionCount))
        fail("INVALID_REQUEST", "native approval preservation requires its exact existing approval and selected scope");
      const rows = doc.items.map(item => {
        if (!item?.questionUid || !Number.isSafeInteger(item.sourceOrdinal) || item.sourceOrdinal < 1 ||
            item.sourceOrdinal > doc.expectedQuestionCount ||
            [item.before, item.after].some(values => !values || typeof values !== "object" || Array.isArray(values) || Object.keys(values).length) ||
            item.identityBefore !== undefined || item.rebind !== undefined || item.sourceReview !== undefined || item.typeHold !== undefined)
          fail("INVALID_REQUEST", "native approval preservation cannot change values or add another registration mode");
        return { ordinal: item.sourceOrdinal, uid: item.questionUid, unchanged: false, gated: true };
      });
      if (new Set(rows.map(r => r.uid)).size !== rows.length || new Set(rows.map(r => r.ordinal)).size !== rows.length)
        fail("INVALID_REQUEST", "native approval preservation UID/ordinal scope is ambiguous");
      return { kind: "native-approval-preservation", approvalType: doc.approval.type, exam: doc.examUid || doc.sourceArchiveFile,
        sourceFile: doc.sourceArchiveFile, expectedBlob: doc.expectedSourceBlobSha1,
        expectedQuestionCount: doc.expectedQuestionCount, request: doc, rows };
    }
    const rows = doc.items.map(item => {
      if (!item?.after || typeof item.after !== "object") fail("INVALID_REQUEST", `item #${item?.sourceOrdinal} has no after`);
      // The consumer is asked only about values the registrar stores and the page shows. A field outside the registrar's value contract is
      // never stored (it is reported in the receipt), and rpmPrimaryRecordId is a crosswalk pointer the page does not expose (it reads null).
      const claimed = Object.fromEntries(Object.entries(item.after).filter(([k]) => REVIEWED_META_VALUE_FIELDS.includes(k) && k !== "rpmPrimaryRecordId"));
      // A row whose after equals its before (and repairs no identity fingerprint) changes nothing: skipped, but counted.
      const unchanged = Object.keys(claimed).every(k => same(item.before?.[k], claimed[k])) && item.identityBefore === undefined;
      // REVIEW2 type-hold item: the consumer deliberately publishes no assignment, PT/TPL or value columns for it yet (they stay in the
      // registrar's own checks and, once grouped, in the output layer), so only the source binding is verified here. Any other item is unchanged.
      if (item.typeHold === true && doc.approval?.type === "REVIEW2")
        return { ordinal: item.sourceOrdinal, uid: item.questionUid, expect: {}, fingerprint: item.after.sourceFingerprint, unchanged, gated: false };
      return { ordinal: item.sourceOrdinal, uid: item.questionUid, expect: claimed, fingerprint: item.after.sourceFingerprint, unchanged,
        gated: touchesAssignment(changedKeys(item.before, claimed)) };
    });
    return { kind: schema === SCHEMA.V2 ? "reviewed-exam-v2" : "finalqa-pinpoint-v1", approvalType: doc.approval?.type || null, exam: doc.examUid || doc.sourceArchiveFile,
      sourceFile: doc.sourceArchiveFile, expectedBlob: doc.expectedSourceBlobSha1, rows };
  }
  if (schema === SCHEMA.BASIC_REBIND || schema === SCHEMA.BASIC_PARENT_CORRECTION) {
    const correction = schema === SCHEMA.BASIC_PARENT_CORRECTION;
    const preservation = doc.approval?.sourceReview !== undefined;
    const nativeParent = doc.approval?.sourceReview?.schemaVersion === NATIVE_BASIC_PARENT_SCHEMA;
    if (!Array.isArray(doc.items) || !doc.sourceArchiveFile) fail("INVALID_REQUEST", "rebind request needs sourceArchiveFile and items[]");
    if (preservation && (correction || ![BASIC_PRESERVATION_SCHEMA, NATIVE_BASIC_HOLD_SCHEMA, NATIVE_BASIC_PARENT_SCHEMA].includes(doc.approval.sourceReview?.schemaVersion) ||
        doc.approval.type !== "BASIC_SCOPE_REBIND" || doc.scope !== undefined || doc.registrationMode !== undefined ||
        !Number.isSafeInteger(doc.expectedQuestionCount) || doc.expectedQuestionCount < 1 || !doc.items.length ||
        doc.items.length > doc.expectedQuestionCount || new Set(doc.items.map(i => i.questionUid)).size !== doc.items.length ||
        new Set(doc.items.map(i => i.sourceOrdinal)).size !== doc.items.length || doc.items.some(i => !Number.isSafeInteger(i.sourceOrdinal)
          || i.sourceOrdinal < 1 || i.sourceOrdinal > doc.expectedQuestionCount || !i.questionUid || !i.basicParent)))
      fail("INVALID_REQUEST", "basic preservation requires its exact selected scope");
    // A rebind changes no metadata value: the claim is only that the question is approved again in the consumer
    // (gated: canonical assignment APPROVED/PASS) and is bound to the current bytes (both fingerprints).
    const rows = doc.items.map(item => {
      if (!item?.after?.sourceFingerprint || !item.after.contentFingerprint) fail("INVALID_REQUEST", `item #${item?.sourceOrdinal} has no after fingerprints`);
      return { ordinal: item.sourceOrdinal, uid: item.questionUid, expect: correction ? {
        L1: item.basicParent.L1, L2: item.basicParent.L2,
        standardUnitKey: item.parentAfter.standardUnitKey, subUnitKey: item.parentAfter.subUnitKey,
      } : {}, fingerprint: item.after.sourceFingerprint,
        bodyFingerprint: item.after.contentFingerprint, unchanged: false, gated: true };
    });
    return { kind: nativeParent ? "basic-parent-registration" : preservation ? "basic-approval-preservation" : correction ? "basic-parent-correction" : "basic-scope-rebind",
      approvalType: doc.approval?.type || null, exam: doc.examUid || doc.sourceArchiveFile,
      ...(preservation ? { request: doc, expectedQuestionCount: doc.expectedQuestionCount } : {}),
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
  if (schema === SCHEMA.DIFF5) {
    const gemini = doc.gemini || {};
    const sourceFile = normalizeFile(gemini.sourceArchiveFile || doc.sourceArchiveFile);
    if (!sourceFile) fail("INVALID_REQUEST", "diff5 request needs sourceArchiveFile");
    const items = gemini.items || doc.items || [];
    if (!Array.isArray(items) || !items.length) fail("INVALID_REQUEST", "diff5 request needs items[]");
    if (doc.approval || (doc.registryChanges?.length ?? 0)) fail("INVALID_REQUEST", "diff5 request cannot carry semantic approval or registry changes");
    const rows = items.map(item => {
      if (!item?.after || typeof item.after !== "object" || Array.isArray(item.after) ||
          Object.keys(item.after).some(field => !DIFFICULTY_FIELDS.includes(field)))
        fail("INVALID_REQUEST", `item #${item?.ordinal} is not difficulty-only`);
      const expect = { difficultyBucket: item.after.difficultyBucket };
      return {
        ordinal: item.ordinal,
        uid: item.questionUid,
        expect,
        unchanged: false,
        gated: false
      };
    });
    return {
      kind: "difficulty5-ratings",
      request: doc,
      approvalType: null,
      exam: gemini.requestId || sourceFile,
      sourceFile,
      expectedBlob: gemini.latestBlobSha || doc.latestBlobSha,
      textBoundDraft: isTextBoundDraft(doc),
      rows
    };
  }
  return fail("UNSUPPORTED_REQUEST_SCHEMA", `${file}: schemaVersion=${JSON.stringify(schema)}`);
}

export function loadConsumer(root) {
  const catalog = loadResolvedConsumerCatalog(root);
  const records = catalog.records;
  const ProblemBankMeta = require("../../problem-bank-meta.js");
  const generated = JSON.parse(fs.readFileSync(path.join(root, GENERATED_INDEX), "utf8"));
  const shaByFile = new Map(catalog.sourceHashes || []);
  // Exactly what archive/problem-bank-search.html does.
  const sourceRows = records.map(row => ({ ...row, currentSourceJsSha256: shaByFile.get(row.sourceFile) || "" }));
  const inventory = ProblemBankMeta.buildIndex(sourceRows, generated.records, { excludedHoldUids: generated.userDisabledUids || [] });
  // Archive2's resolver intentionally keeps basic L1/L2 and item tags in its
  // catalog rows. The deeper L3/L4 and legacy level for reviewed META_PIPELINE
  // registrations are owned by the digest-bound Meta Foundation runtime.
  // Read only runtime files named by the same canonical input manifest that
  // loadResolvedConsumerCatalog has already digest-checked.
  const inputManifest = JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-canonical-input-manifest.json"), "utf8"));
  const runtimePaths = (inputManifest.files || []).map(row => row.path)
    .filter(file => typeof file === "string" && file.startsWith("data/meta-foundation/runtime/") && file.endsWith(".json") &&
      !file.endsWith("/runtime-bridge-receipt.json"));
  const runtimeByUid = new Map();
  for (const relative of runtimePaths) {
    const runtime = JSON.parse(fs.readFileSync(path.join(root, "archive", relative), "utf8"));
    for (const row of runtime.records || []) {
      if (!row?.questionUid) continue;
      const list = runtimeByUid.get(row.questionUid) || [];
      list.push(row);
      runtimeByUid.set(row.questionUid, list);
    }
  }
  const runtimePacks = new Map((catalog.metaFoundationRuntime?.packs || []).map(pack => [pack.packId, pack]));
  return {
    ProblemBankMeta, inventory, catalog,
    resolvedBySource: new Map(records.map(r => [`${normalizeFile(r.sourceFile)}#${Number(r.sourceOrdinal)}`, r])),
    pageByUid: new Map(inventory.map(r => [r.uid, r])),
    runtimeByUid, runtimePacks,
  };
}

function findMetaPipelineRuntime(consumer, unit, row, resolved) {
  const candidates = (consumer.runtimeByUid.get(resolved.questionUid) || []).filter(runtime => {
    const pack = consumer.runtimePacks.get(runtime.metaFoundationPackId);
    return runtime.sourceArchiveFile === unit.sourceFile && Number(runtime.sourceOrdinal) === Number(row.ordinal) &&
      runtime.metadataRevision === resolved.metadataRevision && runtime.metadataApprovalType === "META_PIPELINE_AUDIT" &&
      runtime.metaFoundationStatus === "ACTIVE" && pack && pack.packVersion === runtime.metaFoundationPackVersion;
  });
  return candidates.length === 1 ? candidates[0] : null;
}

// The official registrar owns normalization and reviewed-correction authority. A D5
// Consumer claim first replays that exact read-only kernel against current canonical
// metadata/identity/source. No source tag or semantic approval is changed here.
function verifiedDifficultyRows(root, unit, consumer) {
  const proof = registerDifficulty5({ root, request: unit.request, write: false, verifyProjection: true });
  if (proof.status !== "PASS" || !["verify-projection", "verify-reviewed-correction"].includes(proof.mode) ||
      proof.requestId !== unit.request.gemini.requestId || proof.sourceArchiveFile !== unit.sourceFile ||
      // A text-bound draft (every item carries the stem+choices fingerprint) is bound per question, so another question's edit changing the
      // whole-file blob is not a mismatch; the registrar's own per-item fingerprint check already ran above. Anything else keeps the blob check.
      // A text-bound draft (every item carries the stem+choices fingerprint) is bound per question, so another question's edit changing the
      // whole-file blob is not a mismatch; the registrar's own per-item fingerprint check already ran above. Anything else keeps the blob check.
      (proof.sourceBlobSha !== unit.expectedBlob && !unit.textBoundDraft && !sourceTextUnchangedSinceRequest({ root, request: unit.request, sourceBytes: fs.readFileSync(path.join(root, "archive/exams", unit.sourceFile)) }).ok) || proof.summary?.written !== false || proof.summary?.changedFields !== 0 ||
      proof.summary?.VERIFIED !== unit.rows.length || proof.summary?.total !== unit.rows.length ||
      proof.summary?.APPLY !== 0 || proof.summary?.CONFLICT !== 0 || proof.summary?.SKIP_INVALID !== 0 ||
      proof.ptTpl !== "UNTOUCHED_NOT_IN_SCOPE" || !Array.isArray(proof.items) || proof.items.length !== unit.rows.length ||
      new Set(proof.items.map(item => item.questionUid)).size !== unit.rows.length ||
      new Set(proof.items.map(item => item.ordinal)).size !== unit.rows.length)
    throw Error("official difficulty projection/scope mismatch");
  if (!consumer.difficultyMetadataByUid) {
    const records = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8")).records;
    consumer.difficultyMetadataByUid = new Map();
    for (const record of records || []) {
      const list = consumer.difficultyMetadataByUid.get(record.questionUid) || [];
      list.push(record); consumer.difficultyMetadataByUid.set(record.questionUid, list);
    }
  }
  const bank = loadBank(root, unit.sourceFile);
  return unit.rows.map(row => {
    const checked = proof.items.find(item => item.questionUid === row.uid && item.ordinal === row.ordinal);
    const matches = consumer.difficultyMetadataByUid.get(row.uid) || [], meta = matches[0];
    if (!checked || checked.decision !== "VERIFIED" || matches.length !== 1 ||
        meta.sourceArchiveFile !== unit.sourceFile || meta.sourceOrdinal !== row.ordinal ||
        // The registrar writes legacyLevelCompatibility only for a row that still has a legacy level; a request without a level
        // carries three fields. Every field the registrar reports is compared; the three core fields are always required.
        !DIFFICULTY_FIELDS.every(field => own(checked.after, field) ? same(meta[field], checked.after[field]) : field === "legacyLevelCompatibility"))
      throw Error(`official difficulty metadata/UID mismatch: ${row.uid}`);
    const source = bank[row.ordinal - 1];
    if (!source) throw Error(`difficulty source ordinal missing: ${row.uid}`);
    const values = Object.fromEntries(DIFFICULTY_FIELDS.filter(field => own(checked.after, field)).map(field => [field, checked.after[field] ?? null]));
    const semanticPending = !meta.metadataApprovalType &&
      ["registration_only_pending_review", "registration_pending_semantic_review"].includes(meta.metadataStatus) &&
      // A direct type judgment (type fields only) is not a semantic review of the row: its other fields stay pending.
      ["manual_review_pending", TYPE_FIELD_STATUS].includes(meta.fieldStatus?.problemType) && ["manual_review_pending", TYPE_FIELD_STATUS].includes(meta.fieldStatus?.template) &&
      meta.tagConfidence === "registration_only" && meta.tagStatus === "registration_only_pending_review";
    return { ...row, difficultyProjection: { values, binding: checked.consumerBinding, semanticPending,
      ordinaryNormalization: proof.mode === "verify-projection" && !unit.request.reviewedCorrection,
      currentTags: { tagConfidence: meta.tagConfidence, tagStatus: meta.tagStatus },
      sourceAnnotations: Object.fromEntries(["tagConfidence", "tagStatus", ...DIFFICULTY_FIELDS].map(field => [field, source[field] ?? null])) } };
  });
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
  // REVIEW2 may also register a judged tag/difficulty value over the exam file's inline value; the registrar records the source value in receipt.sourceValueOverrides.
  // REVIEW2 (two independent judgments): the exam file's own review annotation (e.g. SELF_CHECKED) differs from the registrar-forced
  // reviewed_pass by design; it is kept in the exam file and is not a metadata conflict. Every other conflicting field still refuses.
  const difficulty = unit.kind === "difficulty5-ratings" ? row.difficultyProjection : null;
  if (unit.kind === "difficulty5-ratings") {
    if (!difficulty) return { ...out, reason: "VALUE_MISMATCH", detail: "official difficulty projection missing" };
    // Some auxiliary D5 fields are not exposed by the page. Their exact current
    // metadata equivalence is already proven above; any exposed canonical value
    // must agree too, while the bucket still takes the real page/query path below.
    const mismatched = DIFFICULTY_FIELDS.filter(field => own(difficulty.values, field) && own(resolved, field) && !same(resolved[field], difficulty.values[field]));
    if (mismatched.length) return { ...out, reason: "VALUE_MISMATCH", detail: "official difficulty tuple != canonical consumer: " + mismatched.join(",") };
  }
  // The fields this request changes: what the difficulty registrar reported, or the two type fields of a type-only request.
  // A typed (reviewed) correction keeps the strict rule: every conflict blocks.
  const requestFields = difficulty?.ordinaryNormalization ? Object.keys(difficulty.values) : unit.kind === "direct-type-judgment" ? ["problemTypeKey", "templateKey"] : null;
  const blockingConflicts = (resolved.metadataConflicts || []).filter(field => {
    if (unit.approvalType === "REVIEW2" && (field === "reviewStatus" || REVIEW2_SOURCE_OVERRIDE_FIELDS.includes(field))) return false;
    let reason = null;
    if (difficulty?.semanticPending && ["tagConfidence", "tagStatus"].includes(field) &&
        same(resolved[field], difficulty.currentTags[field]) && difficulty.sourceAnnotations[field] !== null &&
        !same(difficulty.sourceAnnotations[field], difficulty.currentTags[field]))
      reason = "SEMANTIC_REVIEW_PENDING_UNCHANGED";
    if (field === "legacyLevelCompatibility" && difficulty?.ordinaryNormalization &&
        same(resolved[field], difficulty.values[field]) && difficulty.sourceAnnotations[field] !== null &&
        !same(difficulty.sourceAnnotations[field], difficulty.values[field]))
      reason = "OFFICIAL_D5_LEGACY_COMPATIBILITY_NORMALIZATION";
    // A difficulty or direct type request blocks only on the fields it changes. An older disagreement between the exam file's own
    // inline value and the registered value in a field this request does not touch was not made by this request and is not removed
    // by refusing it: it stays visible as an advisory. Other request kinds keep refusing every conflict.
    if (!reason && requestFields && field !== "foundationTaxonomy" && !requestFields.includes(field)) reason = "NOT_CHANGED_BY_THIS_REQUEST";
    // In a field the difficulty request registers, an inline placeholder (empty, null or UNKNOWN) is not a value that disagrees.
    // A real inline value (1..5 or a legacy word) that differs from the registered value is still refused.
    if (!reason && difficulty?.ordinaryNormalization && DIFFICULTY_FIELDS.includes(field) && isInlinePlaceholder(difficulty.sourceAnnotations[field]))
      reason = "INLINE_PLACEHOLDER_REPLACED";
    if (!reason) return true;
    (out.metadataConflictAdvisories ||= []).push({ field, reason, sourceValue: difficulty?.sourceAnnotations?.[field] ?? null,
      canonicalValue: resolved[field], semanticApproval: false });
    return false;
  });
  if (blockingConflicts.length)
    return { ...out, reason: "METADATA_CONFLICT", detail: blockingConflicts.join(",") };
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
  const metaPipelineRuntime = unit.approvalType === "META_PIPELINE_AUDIT" &&
    ["level", "L3", "L4"].some(field => Object.hasOwn(row.expect, field))
    ? findMetaPipelineRuntime(consumer, unit, row, resolved) : null;
  if (unit.approvalType === "META_PIPELINE_AUDIT" &&
      ["level", "L3", "L4"].some(field => Object.hasOwn(row.expect, field)) && !metaPipelineRuntime)
    return { ...out, reason: "META_PIPELINE_RUNTIME_MISSING", detail: `no unique active runtime row for ${uid}` };
  const mismatches = [];
  const queryFilters = {};
  for (const [field, expected] of Object.entries(row.expect)) {
    const name = FIELD_ALIAS[field] || field;
    // While the canonical assignment is pending resolveCatalog blanks the governed fields; this request does
    // not change them (otherwise the row would have failed above), so they are not part of its claim.
    if (out.assignmentPending && ASSIGNMENT_GOVERNED.has(name)) continue;
    if (metaPipelineRuntime && ["level", "L3", "L4"].includes(name)) {
      if (!same(metaPipelineRuntime[name], expected)) mismatches.push(`${field}: request ${JSON.stringify(expected)} != Meta Foundation runtime ${JSON.stringify(metaPipelineRuntime[name] ?? null)}`);
      continue;
    }
    if (metaPipelineRuntime && name === "integrationPattern" && !own(resolved, name)) {
      if (!same(metaPipelineRuntime[name], expected)) mismatches.push(field + ": request " + JSON.stringify(expected) + " != Meta Foundation runtime " + JSON.stringify(metaPipelineRuntime[name] ?? null));
      continue;
    }
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

// Direct type judgment: the official registrar replay proves the registered type fields; the consumer must then show them as
// approved facets. A row whose stored fingerprints no longer match the current question (binding "stale") is displayed only when its
// stem and choices are provably unchanged ("text": rebind record, "type": this judgment's own text/content fingerprint, see
// docs/agents/metadata.md "메타 결속 지문 범위"); otherwise its type is recorded but not displayed by design, reported, not failed.
function checkTypeRow(consumer, unit, row) {
  const key = `${normalizeFile(unit.sourceFile)}#${Number(row.ordinal)}`;
  const resolved = consumer.resolvedBySource.get(key);
  if (!resolved) return { reason: "ROW_MISSING_IN_RESOLVED_CATALOG", detail: key };
  const out = { uid: resolved.questionUid };
  if (row.uid !== resolved.questionUid) return { ...out, reason: "UID_MISMATCH", detail: `request ${row.uid} != consumer ${resolved.questionUid}` };
  const typeConflicts = (resolved.metadataConflicts || []).filter(field => ["problemTypeKey", "templateKey", "foundationTaxonomy"].includes(field));
  if (typeConflicts.length) return { ...out, reason: "METADATA_CONFLICT", detail: typeConflicts.join(",") };
  if (!consumer.pageByUid.get(resolved.questionUid)) return { ...out, reason: "NOT_IN_PROBLEM_BANK_INDEX" };
  if (!resolved.metaBinding) return { ...out, typeNotDisplayed: resolved.metaBinding || "stale" };
  const status = String(resolved.metaHintStatus || "");
  const mismatches = [];
  if (!same(resolved.metaHintPT, row.expect.problemTypeKey)) mismatches.push(`problemTypeKey: request ${JSON.stringify(row.expect.problemTypeKey)} != consumer ${JSON.stringify(resolved.metaHintPT ?? null)}`);
  if (!same(resolved.metaHintTPL || "", row.expect.templateKey)) mismatches.push(`templateKey: request ${JSON.stringify(row.expect.templateKey)} != consumer ${JSON.stringify(resolved.metaHintTPL ?? null)}`);
  if (status[1] !== "A") mismatches.push(`PT facet is not approved (metaHintStatus=${JSON.stringify(status)})`);
  if (row.expect.templateKey && status[2] !== "A") mismatches.push(`TPL facet is not approved (metaHintStatus=${JSON.stringify(status)})`);
  return mismatches.length ? { ...out, reason: "VALUE_MISMATCH", detail: mismatches.join("; ") } : out;
}

function preservedNativeRows(root, unit, consumer) {
  const count = unit.rows.length, request = unit.request;
  // This is the real read-only registrar, not a second implementation of its
  // preservation contract. It verifies source/Git/evidence, the original audit
  // (or FINAL_QA) approval, full current metadata/identity/runtime and replay.
  const proof = registerReviewedExamV2({ root, request, write: false, verifyProjection: true });
  if (proof.status !== "PASS" || proof.requestId !== request.requestId || proof.totalQuestions !== count ||
      proof.replay !== true || !Array.isArray(proof.plannedPaths) || proof.plannedPaths.length ||
      proof.consumerSearchStatus !== "STATIC_VALUES_VERIFIED" || proof.newMetadataApprovals !== 0 ||
      proof.preservedMetadataApprovals !== count ||
      (request.scope === "PARTIAL_UIDS" ? proof.scope !== request.scope || proof.partialUidCount !== count ||
        proof.expectedQuestionCount !== unit.expectedQuestionCount : proof.scope !== undefined || proof.partialUidCount !== undefined))
    throw Error("native approval preservation replay/scope mismatch");
  const receiptPath = RECEIPTS + request.requestId + ".json";
  const receipt = JSON.parse(fs.readFileSync(path.join(root, receiptPath), "utf8"));
  if (receipt.newMetadataApprovals !== 0 || receipt.preservedMetadataApprovals !== count ||
      receipt.totalQuestions !== count || receipt.approval?.type !== unit.approvalType ||
      !same(receipt.approval.sourceRebind, request.approval.sourceRebind) ||
      !same(receipt.approval.rendererPreservation, request.approval.rendererPreservation) ||
      loadBank(root, unit.sourceFile).length !== unit.expectedQuestionCount)
    throw Error("native approval preservation receipt/denominator mismatch");
  for (const records of [receipt.appliedRecords, receipt.runtimeRecords]) {
    if (!Array.isArray(records) || records.length !== count || new Set(records.map(r => r.questionUid)).size !== count ||
        new Set(records.map(r => r.sourceOrdinal)).size !== count || records.some(record =>
          record.sourceArchiveFile !== unit.sourceFile || record.metadataApprovalType !== unit.approvalType ||
          !unit.rows.some(row => row.uid === record.questionUid && row.ordinal === record.sourceOrdinal)))
      throw Error("native approval preservation receipt UID/ordinal scope mismatch");
  }
  const byUid = new Map(receipt.appliedRecords.map(record => [record.questionUid, record]));
  for (const record of receipt.runtimeRecords) {
    const actual = consumer.runtimeByUid.get(record.questionUid) || [];
    if (actual.length !== 1 || !same(actual[0], record))
      throw Error("native approval preservation consumer runtime drift: " + record.questionUid);
  }
  return unit.rows.map(row => {
    const record = byUid.get(row.uid);
    if (PRESERVED_CONSUMER_FIELDS.some(field => !own(record, field)) ||
        !/^[a-f0-9]{64}$/.test(record.sourceFingerprint || "") || !/^[a-f0-9]{64}$/.test(record.contentFingerprint || ""))
      throw Error("native approval preservation accepted values missing: " + row.uid);
    return { ...row, expect: Object.fromEntries(PRESERVED_CONSUMER_FIELDS.map(field => [field, record[field]])),
      fingerprint: record.sourceFingerprint, bodyFingerprint: record.contentFingerprint };
  });
}

function preservedBasicRows(root, unit, consumer) {
  const request = unit.request, count = unit.rows.length;
  const nativeParent = unit.kind === "basic-parent-registration";
  const proof = registerBasicScopeRebind({ root, request, verifyProjection: true });
  if (proof.status !== "PASS" || proof.requestId !== request.requestId || proof.replay !== true ||
      proof.consumerSearchStatus !== "STATIC_VALUES_VERIFIED" || proof.totalQuestions !== count ||
      proof.expectedQuestionCount !== unit.expectedQuestionCount || proof.newMetadataApprovals !== (nativeParent ? count : 0) || proof.advancedApprovals !== 0 ||
      proof.metadataValuesChanged !== false || proof.preservedMetadataApprovals !== (nativeParent ? 0 : count) ||
      nativeParent && (proof.newBasicParentApprovals !== count || proof.newDifficultyJudgments !== 0 || proof.newBlindReviews !== 0 || proof.newReview2 !== 0) || !same(proof.plannedPaths, []))
    throw Error("basic preservation official replay/scope mismatch");
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8"));
  return unit.rows.map(row => {
    const matches = metadata.records.filter(r => r.questionUid === row.uid);
    if (matches.length !== 1) throw Error("basic preservation current metadata scope mismatch");
    const runtime = consumer.runtimeByUid.get(row.uid) || [];
    if (request.approval.sourceReview.schemaVersion === NATIVE_BASIC_HOLD_SCHEMA) {
      const bindings = (proof.heldRuntimeBindings || []).filter(record => record.questionUid === row.uid);
      const stableHash = value => crypto.createHash("sha256").update(JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
        ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v)).digest("hex");
      if (bindings.length !== runtime.length || bindings.length > 1 || runtime.some(record => !bindings.some(binding => binding.recordSha256 === stableHash(record))) ||
          !same((proof.metaOnlyHoldReasons || []).filter(record => record.questionUid === row.uid), [{ questionUid: row.uid, reason: NATIVE_BASIC_HOLD_REASON }]))
        throw Error("basic preservation explicit held runtime drift");
    } else if (runtime.length) throw Error("basic preservation current metadata/runtime scope mismatch");
    const item = request.items.find(i => i.questionUid === row.uid), record = matches[0];
    // The official replay above checks the entire protected metadata/identity
    // row. The current canonical resolver and actual page query below must
    // additionally retain this exact existing basic parent and byte binding.
    return { ...row, expect: {
      curriculumKey: item.basicParent.curriculumKey, courseKey: item.basicParent.courseKey,
      L1: item.basicParent.L1, L2: item.basicParent.L2,
      standardCourse: record.standardCourse, standardUnitKey: record.standardUnitKey, subUnitKey: record.subUnitKey,
    } };
  });
}

export function verifyChangedUidConsumerApproval({ root, requestPaths = [], scopedPaths = [] }) {
  let mainSha = "UNKNOWN";
  try { mainSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); } catch { /* not a git checkout */ }
  const result = { status: "PASS", mainSha, counts: { changed: 0, checked: 0, passed: 0, skippedUnchanged: 0 }, exams: [], failures: [], unobservedFields: [], solverOnlyRevisions: [], assignmentPending: [], metadataConflictAdvisories: [] };
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
    let rows = unit.rows.filter(r => !r.unchanged);
    summary.skippedUnchanged = unit.rows.length - rows.length;
    summary.changed = rows.length;
    result.counts.skippedUnchanged += summary.skippedUnchanged;
    result.counts.changed += rows.length;
    if (!consumer) continue;
    let sourceBound = true;
    const sourceBindings = unit.sourceSnapshots || [{ sourceArchiveFile: unit.sourceFile, expectedSourceBlobSha1: unit.expectedBlob }];
    for (const binding of sourceBindings) {
      try {
        const sourcePath = `archive/exams/${normalizeFile(binding.sourceArchiveFile)}`;
        const blob = unit.kind === "difficulty5-ratings"
          ? bindDifficulty5Source(fs.readFileSync(path.join(root, sourcePath)), binding.expectedSourceBlobSha1).sha
          : gitBlobSha1(root, sourcePath);
        // A direct type judgment is verified per question by its replay below (stem + choices), not by the file blob.
        // A draft difficulty request whose items all carry textBindingFingerprint is verified per question by the registrar, not by the file blob.
        // A plain reviewed-exam-v2 REVIEW2/FINAL_QA request is bound to the stem + choices of its questions (same predicate as the registrar).
        const textBoundReview = unit.kind === "reviewed-exam-v2" && TEXT_BOUND_REVIEW_TYPES.includes(unit.approvalType) &&
          binding.expectedSourceBlobSha1 !== blob &&
          reviewedSourceTextUnchanged({ root, expectedBlobSha1: binding.expectedSourceBlobSha1, currentBytes: fs.readFileSync(path.join(root, sourcePath)),
            ordinals: unit.rows.map(r => r.ordinal).filter(Number.isInteger) }).ok;
        // Scoped parent links are bound per record to the question body (sourceBodyFingerprint, checked by the rows below), not to the file blob.
        if (binding.expectedSourceBlobSha1 !== blob && unit.kind !== "direct-type-judgment" && unit.kind !== "scoped-parent-links" && !unit.textBoundDraft && !textBoundReview) {
          sourceBound = false;
          result.failures.push({ exam: unit.exam, qid: "-", uid: "-", reason: "SOURCE_BLOB_MISMATCH", detail: `${unit.sourceSnapshots ? binding.sourceArchiveFile + ': ' : ''}request ${binding.expectedSourceBlobSha1 ?? null} != worktree ${blob}` });
        }
      } catch (error) {
        sourceBound = false;
        result.failures.push({ exam: unit.exam, qid: "-", uid: "-", reason: "SOURCE_UNREADABLE", detail: error.message });
      }
    }
    if (!sourceBound) continue;
    if (unit.kind === "difficulty5-ratings") {
      summary.approvalCreated = false; summary.newMetadataApprovals = 0; summary.semanticApproval = false;
      try { rows = verifiedDifficultyRows(root, unit, consumer); summary.officialDifficultyTuplesVerified = rows.length; }
      catch (error) {
        summary.checked = rows.length; result.counts.checked += rows.length;
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "VALUE_MISMATCH", detail: "official difficulty projection failed: " + error.message });
        continue;
      }
    }
    if (unit.kind === "native-authority-withdrawal") {
      summary.checked = rows.length; result.counts.checked += rows.length;
      summary.approvalCreated = false; summary.newMetadataApprovals = 0; summary.withdrawnMetadataApprovals = 0;
      summary.expectedQuestionCount = unit.expectedQuestionCount;
      try {
        const replay = registerNativeAuthorityCorrection({ root, request: unit.request, write: false });
        if (replay.status !== "PASS" || replay.replay !== true || replay.newMetadataApprovals !== 0 ||
            replay.totalQuestions !== rows.length || replay.plannedPaths.length) throw Error("authority withdrawal replay mismatch");
        const proof = verifyNativeAuthorityCorrectionConsumer({ root, request: unit.request, catalog: consumer.catalog });
        summary.passed = rows.length; result.counts.passed += rows.length;
        summary.withdrawnMetadataApprovals = proof.withdrawnMetadataApprovals;
        summary.authorityHolds = proof.checkedAuthorityHolds;
      } catch (error) {
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "AUTHORITY_WITHDRAWAL_MISMATCH", detail: error.message });
      }
      continue;
    }
    if (unit.kind === "native-approval-preservation") {
      summary.approvalCreated = false; summary.newMetadataApprovals = 0;
      summary.preservedMetadataApprovals = 0; summary.approvalType = unit.approvalType;
      summary.expectedQuestionCount = unit.expectedQuestionCount;
      try { rows = preservedNativeRows(root, unit, consumer); }
      catch (error) {
        summary.checked = rows.length; result.counts.checked += rows.length;
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "NATIVE_PRESERVATION_MISMATCH", detail: error.message });
        continue;
      }
    }
    if (["basic-approval-preservation", "basic-parent-registration"].includes(unit.kind)) {
      const nativeParent = unit.kind === "basic-parent-registration";
      summary.approvalCreated = false; summary.newMetadataApprovals = 0; summary.advancedApprovals = 0;
      if (nativeParent) { summary.newBasicParentApprovals = 0; summary.newDifficultyJudgments = 0; summary.newBlindReviews = 0; summary.newReview2 = 0; }
      summary.preservedMetadataApprovals = 0; summary.expectedQuestionCount = unit.expectedQuestionCount;
      try { rows = preservedBasicRows(root, unit, consumer); }
      catch (error) {
        summary.checked = rows.length; result.counts.checked += rows.length;
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "BASIC_PRESERVATION_MISMATCH", detail: error.message });
        continue;
      }
    }
    if (unit.kind === "identity-fingerprint-repair") {
      summary.checked = rows.length; result.counts.checked += rows.length;
      summary.approvalCreated = false; summary.newMetadataApprovals = 0;
      try {
        if (loadBank(root, unit.sourceFile).length !== unit.expectedQuestionCount) throw Error("identity repair source denominator mismatch");
        const identities = JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_identity_map.json"), "utf8")).records;
        const bindings = rows.map(row => {
          const matches = identities.filter(id => id.questionUid === row.uid);
          if (matches.length !== 1 || matches[0].sourceArchiveFile !== unit.sourceFile || matches[0].sourceOrdinal !== row.ordinal ||
              matches[0].sourceFingerprint !== row.expect.sourceFingerprint) throw Error(`identity repair current identity mismatch: ${row.uid}`);
          return { questionUid: row.uid, sourceArchiveFile: unit.sourceFile, sourceOrdinal: row.ordinal, ...row.expect };
        });
        const proof = verifyIdentityFingerprintConsumer(root, bindings, consumer.catalog);
        summary.identityBindings = proof.identityBindings;
        summary.passed = rows.length; result.counts.passed += rows.length;
      } catch (error) {
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "IDENTITY_BINDING_MISMATCH", detail: error.message });
      }
      continue;
    }
    if (unit.kind === "direct-type-judgment") {
      summary.approvalCreated = false; summary.newMetadataApprovals = 0; summary.directTypeApprovals = 0; summary.typeNotDisplayed = 0;
      summary.expectedQuestionCount = unit.expectedQuestionCount;
      try {
        const replay = registerReviewedExamV2({ root, request: unit.request, write: false, verifyProjection: true });
        if (replay.status !== "PASS" || replay.replay !== true || replay.fieldScope !== FIELD_SCOPE_TYPE_ONLY || replay.typeApprovals !== rows.length ||
            replay.newMetadataApprovals !== 0 || replay.plannedPaths.length) throw Error("direct type judgment replay/scope mismatch");
      } catch (error) {
        summary.checked = rows.length; result.counts.checked += rows.length;
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-", reason: "VALUE_MISMATCH", detail: "official type judgment replay failed: " + error.message });
        continue;
      }
      for (const row of rows) {
        summary.checked++; result.counts.checked++;
        const checked = checkTypeRow(consumer, unit, row);
        if (checked.reason) result.failures.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid || row.uid || "-", reason: checked.reason, detail: checked.detail || "" });
        else { summary.passed++; result.counts.passed++; if (checked.typeNotDisplayed) summary.typeNotDisplayed++; else summary.directTypeApprovals++; }
      }
      continue;
    }
    if (unit.kind === "binding-course-correction") {
      // This operation creates no approval. Its gate is exact preservation of
      // every runtime consumer in the pack, including existing non-approvals.
      // Do not route it through checkRow's "approved now" requirement or count
      // it as an unchanged/skipped exam.
      summary.checked = rows.length; result.counts.checked += rows.length;
      try {
        const preservation = verifyBindingCourseCorrectionWithConsumer({ root, request: unit.request, consumer });
        summary.passed = rows.length; result.counts.passed += rows.length;
        summary.preservedRuntimeUids = preservation.checkedRuntimeUids;
        summary.approvalCreated = false;
      } catch (error) {
        result.failures.push({ exam: unit.exam, qid: rows[0]?.ordinal ?? "-", uid: rows[0]?.uid ?? "-",
          reason: "VALUE_MISMATCH", detail: error.message });
      }
      continue;
    }
    for (const row of rows) {
      summary.checked++; result.counts.checked++;
      const checked = checkRow(consumer, unit, row);
      if (checked.reason) result.failures.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid || row.uid || "-", reason: checked.reason, detail: checked.detail || "" });
      else { summary.passed++; result.counts.passed++; }
      if (checked.assignmentPending && !checked.reason) result.assignmentPending.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid, reason: checked.assignmentPending });
      for (const advisory of checked.metadataConflictAdvisories || [])
        result.metadataConflictAdvisories.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid, ...advisory });
      if (checked.solverOnlyRevision) result.solverOnlyRevisions.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid });
      if (checked.unobserved?.length) result.unobservedFields.push({ exam: unit.exam, qid: row.ordinal, uid: checked.uid, fields: checked.unobserved });
    }
    if (["native-approval-preservation", "basic-approval-preservation"].includes(unit.kind)) summary.preservedMetadataApprovals = summary.passed;
    if (unit.kind === "basic-parent-registration") {
      summary.newBasicParentApprovals = summary.passed;
      summary.newMetadataApprovals = summary.passed;
      summary.approvalCreated = summary.passed > 0;
    }
  }
  if (result.failures.length || result.counts.checked !== result.counts.changed) result.status = "FAIL";
  return result;
}

export function renderSummary(result) {
  const c = result.counts;
  const preservation = result.exams.some(e => ["binding-course-correction", "identity-fingerprint-repair", "native-approval-preservation", "basic-approval-preservation", "native-authority-withdrawal"].includes(e.kind));
  const difficulty = result.exams.some(e => e.kind === "difficulty5-ratings");
  const typeJudgment = result.exams.some(e => e.kind === "direct-type-judgment");
  const verification = preservation || difficulty || typeJudgment;
  const lines = [verification ? "### Changed-UID consumer verification" : "### Changed-UID effective consumer approval", ""];
  if (result.status === "PASS") {
    lines.push(`PASS: changed ${c.passed}/${c.changed} ${verification ? "verified" : "approved"} (checked ${c.checked}, skippedUnchanged ${c.skippedUnchanged}), main \`${result.mainSha}\`.`);
    if (preservation) lines.push("These operations verify consumer state and create no new metadata or exam approval.");
    if (difficulty) lines.push("D5 rows verify the official four-field difficulty projection and the page bucket/query; they do not grant semantic, PT/TPL or source approval.");
  } else {
    lines.push(`FAIL: changed ${c.changed}, checked ${c.checked}, passed ${c.passed}, skippedUnchanged ${c.skippedUnchanged}, main \`${result.mainSha}\`.`, "",
      "| exam | QID | UID | reason |", "| --- | --- | --- | --- |");
    for (const f of result.failures) lines.push(`| ${f.exam} | ${f.qid} | ${f.uid} | ${f.reason}${f.detail ? `: ${String(f.detail).replace(/\|/g, "\\|")}` : ""} |`);
  }
  for (const e of result.exams) lines.push("", `- ${e.kind} \`${e.exam}\`: changed ${e.changed}, checked ${e.checked}, passed ${e.passed}, skippedUnchanged ${e.skippedUnchanged}`);
  for (const e of result.exams.filter(e => e.kind === "binding-course-correction"))
    lines.push(`  Preserved runtime consumers: ${e.preservedRuntimeUids ?? 0}; new approvals: 0.`);
  for (const e of result.exams.filter(e => e.kind === "identity-fingerprint-repair"))
    lines.push(`  Verified identity bindings: ${e.identityBindings ?? 0}; new approvals: 0.`);
  for (const e of result.exams.filter(e => e.kind === "native-approval-preservation"))
    lines.push(`  Preserved ${e.approvalType} approvals: ${e.preservedMetadataApprovals ?? 0}; new approvals: 0; source questions: ${e.expectedQuestionCount}.`);
  for (const e of result.exams.filter(e => e.kind === "basic-approval-preservation"))
    lines.push(`  Preserved basic approvals: ${e.preservedMetadataApprovals ?? 0}; new approvals: 0; advanced approvals: 0; source questions: ${e.expectedQuestionCount}.`);
  for (const e of result.exams.filter(e => e.kind === "basic-parent-registration"))
    lines.push(`  New basic parent approvals: ${e.newBasicParentApprovals ?? 0}; preserved prior parents: 0; advanced approvals: 0; source questions: ${e.expectedQuestionCount}.`);
  for (const e of result.exams.filter(e => e.kind === "native-authority-withdrawal"))
    lines.push(`  Unsupported approvals withdrawn: ${e.withdrawnMetadataApprovals ?? 0}; explicit authority holds: ${e.authorityHolds ?? 0}; new approvals: 0.`);
  for (const e of result.exams.filter(e => e.kind === "direct-type-judgment"))
    lines.push(`  Direct type judgments shown as approved facets: ${e.directTypeApprovals ?? 0}; recorded but not shown (stem or choices changed since the row was registered): ${e.typeNotDisplayed ?? 0}; unit/difficulty/other approvals: 0.`);
  if (result.assignmentPending?.length) {
    const byExam = new Map();
    for (const r of result.assignmentPending) byExam.set(r.exam, [...(byExam.get(r.exam) || []), `Q${r.qid}`]);
    lines.push("", `Informational: ${result.assignmentPending.length} row(s) with canonical L1/L2 assignment not approved; outside this request's changed fields: ${[...byExam].map(([exam, qids]) => `${exam} ${qids.join(", ")}`).join("; ")}.`);
  }
  for (const row of result.metadataConflictAdvisories || [])
    lines.push(`Retained annotation conflict: ${row.exam} Q${row.qid} ${row.field}: ${row.reason}; no semantic approval.`);
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
  // stdout can be a pipe (the PR proof parses this JSON). Allow its queued
  // writes to drain before exiting; process.exit() can truncate large batches.
  process.exitCode = result.status === "PASS" ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
