// Preserve an existing audit approval across source metadata transport and an
// explicitly reviewed difficulty correction. This never performs a new audit.
import fs from "node:fs";
import { META_FILE, questionMetadataBytesAt } from "./question-metadata-format.mjs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { REASSESSED_STUDENT_FIELDS } from "./reviewed-source-reassessment.mjs";
import { loadUnitOrders, UNIT_MASTER_PATH } from "../archive-unit-order.mjs";
import { AUDIT_SOURCE_PRESERVATION_SCHEMA, loadAuditSourcePreservation, planAuditSourcePreservation,
  assertAuditSourcePreservationReceipt } from "./native-audit-source-preservation.mjs";

export const AUDIT_PRESERVATION_SCHEMA = "archive-native-audit-preservation-v1";
export const PRESERVED_DIFFICULTY_FIELDS = Object.freeze([
  "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"
]);
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const PARENT_LINKS = "archive/data/basic-scope-parent-links.json";
const RPM_MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const blobSha = value => crypto.createHash("sha1").update("blob " + value.length + "\0").update(value).digest("hex");
const fail = message => { throw new Error("audit preservation: " + message); };
const text = value => typeof value === "string" && value.trim();
const pick = (row, fields) => Object.fromEntries(fields.map(k => [k, row?.[k] ?? null]));
const fingerprint = q => sha(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
  answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
const contentFingerprint = q => sha(JSON.stringify({ content: q.content ?? null,
  choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
const SOURCE_VALUES = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level",
  "curriculum", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey",
  "crossConceptKeys", "conditionKeys", "integrationPattern", "secondaryConceptKeys", "primaryMethod", "decisiveStep",
  "rpmPrimaryId", "rpmPrimaryPath", "rpmL1", "rpmL2", "rpmL3", "rpmL4", ...PRESERVED_DIFFICULTY_FIELDS];
const TRANSPORT_FIELDS = new Set(["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit",
  "standardUnitOrder", "category", "level", ...PRESERVED_DIFFICULTY_FIELDS, "solution"]);
const FIXED_STUDENT_FIELDS = REASSESSED_STUDENT_FIELDS.filter(k => k !== "solution");
const immutableGit = new Map();
const immutableJson = new Map();

function localPath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes("\\") || /[\x00-\x1f]/.test(relative) ||
      relative.split("/").some(p => !p || p === "." || p === "..")) fail("unsafe evidence path");
  const full = path.resolve(root, relative), base = path.resolve(root);
  for (let p = full; p !== base; p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("symlink evidence path");
  return full;
}
function git(root, args) {
  const key = stable([path.resolve(root), args]);
  if (!immutableGit.has(key)) {
    try { immutableGit.set(key, execFileSync("git", args, { cwd: root, maxBuffer: 128 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] })); }
    catch { fail("immutable Git evidence unavailable"); }
  }
  return immutableGit.get(key);
}
function commit(root, value) {
  if (!SHA1.test(value || "") || git(root, ["rev-parse", "--verify", value + "^{commit}"]).toString().trim() !== value)
    fail("exact prior/review commit required");
}
function gitJson(root, revision, relative) {
  const key = stable([path.resolve(root), revision, relative]);
  if (!immutableJson.has(key)) immutableJson.set(key, JSON.parse(relative === META_FILE ? questionMetadataBytesAt(root, revision).toString("utf8") : git(root, ["show", revision + ":" + relative])));
  return immutableJson.get(key);
}
function parseBank(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || !bank.length) fail("source bank missing");
  return JSON.parse(JSON.stringify(bank));
}
function unique(rows, key, label) {
  if (!Array.isArray(rows)) fail(label + " missing");
  const map = new Map();
  for (const row of rows) {
    const value = row?.[key];
    if (value == null || map.has(value)) fail(label + " missing/duplicate");
    map.set(value, row);
  }
  return map;
}
function readRef(root, ref, refs) {
  if (!ref || !SHA256.test(ref.sha256 || "") || !refs?.some(r => r.path === ref.path && r.sha256 === ref.sha256))
    fail("explicit SHA-bound evidence reference required");
  const bytes = fs.readFileSync(localPath(root, ref.path));
  if (sha(bytes) !== ref.sha256) fail("evidence SHA drift: " + ref.path);
  return { bytes, data: JSON.parse(bytes.toString("utf8")) };
}
// Read a historical dependency from its exact Git tree. Absence is different
// from an unavailable blob: only an actually consumed difficulty inbox path may
// use the raw bytes sealed in that immutable preservation receipt.
function historicalFile(root, revision, relative) {
  localPath(root, relative);
  const entries = git(root, ["ls-tree", "-z", revision, "--", relative]).toString("utf8").split("\0").filter(Boolean);
  if (!entries.length) return null;
  if (entries.length !== 1) fail("historical evidence path is ambiguous");
  const [header, name] = entries[0].split("\t"), [mode, type] = header.split(" ");
  if (name !== relative || type !== "blob" || !["100644", "100755"].includes(mode))
    fail("historical evidence is not a regular Git file");
  return git(root, ["show", revision + ":" + relative]);
}
function historicalRequest(root, revision, receipt) {
  const snapshot = receipt.auditPreservation?.requestSnapshot;
  if (!isAuditPreservation(receipt.approval) || !snapshot || !equal(snapshot.approval, receipt.approval) ||
      receipt.requestSha256 !== sha(stable(snapshot))) fail("historical preservation request snapshot mismatch");
  const bytes = historicalFile(root, revision, receipt.approval.sourceRebind.requestPath);
  if (bytes && !equal(JSON.parse(bytes.toString("utf8")), snapshot))
    fail("historical preservation request differs from Git input");
  return snapshot;
}
function historicalEvidence(root, revision, ref, refs, receipt, request) {
  if (!ref || !SHA256.test(ref.sha256 || "") || !refs?.some(r => r.path === ref.path && r.sha256 === ref.sha256))
    fail("historical SHA-bound evidence reference required");
  let bytes = historicalFile(root, revision, ref.path);
  if (bytes === null) {
    if (!equal(ref, request.approval.sourceRebind.difficultyRequestRef))
      fail("historical non-inbox evidence missing from Git");
    const sealed = receipt.auditPreservation?.difficultyRequestSnapshot;
    if (!ref.path.startsWith(".archive-meta-register/inbox/") || sealed?.path !== ref.path ||
        sealed.sha256 !== ref.sha256 || typeof sealed.rawUtf8 !== "string")
      fail("historical consumed difficulty snapshot missing");
    bytes = Buffer.from(sealed.rawUtf8, "utf8");
  }
  if (sha(bytes) !== ref.sha256) fail("historical evidence SHA drift: " + ref.path);
  return bytes;
}

export function isAuditPreservation(approval) {
  return approval?.type === "META_PIPELINE_AUDIT" &&
    [AUDIT_PRESERVATION_SCHEMA, AUDIT_SOURCE_PRESERVATION_SCHEMA].includes(approval.sourceRebind?.schemaVersion);
}
// An older v2 audit retained the source's partial tag and omitted reviewStatus.
// This exact status tuple is an existing approval, not a new reviewed_pass. Its
// preservation path below permits only the four separately reviewed D5 fields.
function isSourceApprovedPartialAudit(row) {
  return row != null && !Object.hasOwn(row, "reviewStatus") && row.tagStatus === "approved_subunit_concept_partial" &&
    equal(row.fieldStatus, {
      standardUnit: "approved_meta_pipeline_audit", subUnit: "approved_meta_pipeline_audit",
      concept: "approved_meta_pipeline_audit", problemType: "approved_meta_pipeline_audit",
      template: "approved_meta_pipeline_audit", crossConcept: "approved_meta_pipeline_audit",
      condition: "approved_meta_pipeline_audit", difficulty: "approved_source"
    });
}
export function isPreservableAuditRecord(row) {
  return row?.metadataApprovalType === "META_PIPELINE_AUDIT" && row.metadataStatus === "approved_semantic_review" &&
    (row.reviewStatus === "review_required" && row.tagStatus === "review_required" || isSourceApprovedPartialAudit(row)) &&
    ["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept"].every(k =>
      row.fieldStatus?.[k] === "approved_meta_pipeline_audit") &&
    !Object.values(row.fieldStatus || {}).includes("manual_review_pending") && row.metaFoundationStatus === "ACTIVE";
}

// Successful inbox requests are consumed by the main writer. A receipt keeps the
// exact input bytes so a later run verifies the same evidence after that removal.
// An existing file always wins and must still match; snapshots cannot hide drift.
export function readPreservedAuditEvidence(root, request, ref) {
  if (!isAuditPreservation(request.approval) || !SHA256.test(ref?.sha256 || "") ||
      !request.approval.evidenceRefs?.some(r => r.path === ref.path && r.sha256 === ref.sha256))
    fail("preserved evidence reference mismatch");
  const full = localPath(root, ref.path);
  if (fs.existsSync(full)) {
    const bytes = fs.readFileSync(full);
    if (sha(bytes) !== ref.sha256) fail("preserved evidence file drift");
    return bytes;
  }
  if (!equal(ref, request.approval.sourceRebind.difficultyRequestRef)) fail("only consumed difficulty input has a sealed snapshot");
  const receipt = JSON.parse(fs.readFileSync(localPath(root, RECEIPTS + request.requestId + ".json"), "utf8"));
  if (receipt.requestSha256 !== sha(stable(request)) || !equal(receipt.approval, request.approval) ||
      !equal(receipt.auditPreservation?.requestSnapshot, request)) fail("consumed evidence receipt/request mismatch");
  const snapshot = receipt.auditPreservation.difficultyRequestSnapshot;
  if (snapshot?.path !== ref.path || snapshot.sha256 !== ref.sha256 || typeof snapshot.rawUtf8 !== "string" ||
      sha(snapshot.rawUtf8) !== ref.sha256) fail("consumed difficulty raw SHA mismatch");
  return Buffer.from(snapshot.rawUtf8, "utf8");
}

function preservationSelection(request, questionCount) {
  const partial = request.scope === "PARTIAL_UIDS";
  if (request.scope !== undefined && !partial || !Number.isSafeInteger(questionCount) || questionCount < 1 ||
      request.expectedQuestionCount !== questionCount) fail("preservation scope/source denominator mismatch");
  const patches = unique(request.items, "questionUid", "request UID");
  if (!patches.size || patches.size > questionCount || !partial && patches.size !== questionCount)
    fail("preservation selected UID denominator mismatch");
  const ordinals = unique(request.items, "sourceOrdinal", "request ordinal");
  if ([...ordinals.keys()].some(n => !Number.isSafeInteger(n) || n < 1 || n > questionCount))
    fail("preservation selected ordinal outside source");
  return { partial, patches, selectedCount: patches.size };
}

// The original full receipt is immutable at priorCommit and was bound to that
// exact source. A full request keeps every UID; explicit PARTIAL_UIDS keeps only
// its exact subset. Neither path changes classification or QA. The independently
// reviewed difficulty input must still cover the entire source bank.
export function loadAuditPreservation({ root, request, bytes, bank, _historical = null }) {
  if (request.approval?.sourceRebind?.schemaVersion === AUDIT_SOURCE_PRESERVATION_SCHEMA)
    return loadAuditSourcePreservation({ root, request, bytes, bank, _historical }, {
      load: loadAuditPreservation, plan: planPreservedAuditRecord,
      assertReceipt: assertAuditPreservationReceipt, assertRepair: assertPreservedAuditRepair });
  const approval = request.approval, spec = approval?.sourceRebind, source = request.sourceArchiveFile;
  if (!isAuditPreservation(approval) || request.registrationMode !== undefined ||
      request.registryChanges?.length || !text(approval.approvedBy) || approval.metadataReviewed !== true)
    fail("requires existing META_PIPELINE_AUDIT without registry changes");
  const { patches } = preservationSelection(request, bank.length);
  if (Object.keys(spec).some(k => !["schemaVersion", "requestPath", "priorCommit", "priorReceiptRef", "difficultyRequestRef", "solutionRepair", "consumerParentRef"].includes(k)))
    fail("unknown preservation option");
  if (!spec.requestPath?.startsWith(".archive-meta-register/inbox/")) fail("explicit preservation inbox path required");
  const requestFile = localPath(root, spec.requestPath);
  const boundRequest = _historical ? historicalRequest(root, _historical.commit, _historical.receipt)
    : fs.existsSync(requestFile) ? JSON.parse(fs.readFileSync(requestFile, "utf8"))
      : readAuditPreservationRequest(root, JSON.parse(fs.readFileSync(localPath(root, RECEIPTS + request.requestId + ".json"), "utf8")));
  if (!equal(boundRequest, request)) fail("preservation request differs from its bound input");
  const ref = spec.priorReceiptRef, refs = approval.evidenceRefs;
  const readBoundBytes = (evidence, evidenceRefs = refs) => _historical
    ? historicalEvidence(root, _historical.commit, evidence, evidenceRefs, _historical.receipt, request)
    : (() => {
      if (!evidence || !SHA256.test(evidence.sha256 || "") ||
          !evidenceRefs?.some(r => r.path === evidence.path && r.sha256 === evidence.sha256))
        fail("explicit SHA-bound evidence reference required");
      const raw = fs.readFileSync(localPath(root, evidence.path));
      if (sha(raw) !== evidence.sha256) fail("evidence SHA drift: " + evidence.path);
      return raw;
    })();
  const readBound = (evidence, evidenceRefs = refs) => {
    const raw = readBoundBytes(evidence, evidenceRefs);
    return { bytes: raw, data: JSON.parse(raw.toString("utf8")) };
  };
  if (!ref?.path?.startsWith(RECEIPTS) || ref.path.slice(RECEIPTS.length).includes("/") || !ref.path.endsWith(".json"))
    fail("prior native receipt path required");
  const prior = readBound(ref).data;
  commit(root, spec.priorCommit);
  if (sha(git(root, ["show", spec.priorCommit + ":" + ref.path])) !== ref.sha256)
    fail("prior receipt differs from its Git commit");
  if (prior.schemaVersion !== "archive-reviewed-exam-meta-registration-v2" ||
      prior.metadataRegistrationStatus !== "REGISTERED" || prior.approval?.type !== "META_PIPELINE_AUDIT" ||
      prior.approval.metadataReviewed !== true || !text(prior.approval.approvedBy) || !SHA256.test(prior.requestSha256 || "") ||
      !["meta-pipeline-audit-approval-v1", "meta-pipeline-audit-approval-v2", "meta-pipeline-audit-approval-v3", "meta-pipeline-audit-approval-v4"]
        .includes(prior.approval.metaPipelineAudit?.schemaVersion) ||
      prior.scope !== undefined || prior.registrationMode !== undefined ||
      prior.examFinalQaStatus !== "NOT_EVALUATED_BY_REGISTRAR" || prior.examUid !== request.examUid ||
      prior.sourceArchiveFile !== source || prior.requestId !== path.basename(ref.path, ".json") ||
      prior.totalQuestions !== bank.length || request.expectedQuestionCount !== bank.length ||
      !equal(approval.metaPipelineAudit, prior.approval.metaPipelineAudit))
    fail("prior full audit approval/scope mismatch");
  const oldBytes = git(root, ["show", spec.priorCommit + ":archive/exams/" + source]);
  if (blobSha(oldBytes) !== prior.sourceBlobSha1 || sha(oldBytes) !== prior.sourceRawSha256 ||
      prior.sourceRawSha256 === sha(bytes)) fail("prior source binding mismatch or unnecessary rebind");
  const oldBank = parseBank(oldBytes);
  if (oldBank.length !== bank.length) fail("prior source denominator mismatch");
  const records = unique(prior.appliedRecords, "questionUid", "prior metadata UID");
  const identities = unique(prior.appliedIdentityRecords, "questionUid", "prior identity UID");
  const runtimes = unique(prior.runtimeRecords, "questionUid", "prior runtime UID");
  if ([records, identities, runtimes].some(m => m.size !== bank.length) ||
      new Set(prior.appliedRecords.map(r => r.sourceOrdinal)).size !== bank.length)
    fail("whole-exam UID denominator mismatch");
  for (const [uid, patch] of patches) {
    if ([records.get(uid), identities.get(uid), runtimes.get(uid)].some(row =>
      !row || row.sourceArchiveFile !== source || row.sourceOrdinal !== patch.sourceOrdinal))
      fail("selected UID/ordinal is not in the original full audit: " + uid);
  }
  const masterRef = refs.find(r => r.path === MASTER);
  const master = readBound(masterRef).data;
  if (!Array.isArray(master)) fail("current canonical master must be bound");
  // A full preservation receipt is a prior state only after its original audit,
  // historical source, sealed request/D5 input and every applied value have been
  // replayed without reading mutable current source or ignoring revision/evidence.
  const preservedPrior = isAuditPreservation(prior.approval)
    ? verifyHistoricalPreservation({ root, receipt: prior, receiptRef: ref, priorCommit: spec.priorCommit,
      bytes: oldBytes, bank: oldBank, seen: _historical?.seen || [] }) : null;
  // The master can gain unrelated keys after the original audit. Re-resolve its
  // exact current keys below; every original non-master evidence file stays sealed.
  for (const evidence of prior.approval.evidenceRefs || []) {
    localPath(root, evidence.path);
    if (!SHA256.test(evidence.sha256 || "")) fail("prior evidence SHA missing");
    if (evidence.path !== MASTER && sha(preservedPrior
      ? historicalEvidence(root, spec.priorCommit, evidence, prior.approval.evidenceRefs, prior, preservedPrior.request)
      : git(root, ["show", spec.priorCommit + ":" + evidence.path])) !== evidence.sha256)
      fail("prior audit evidence differs from its Git commit");
  }
  if (!prior.approval.evidenceRefs?.length) fail("prior audit evidence missing");
  // A preserved prior carries its immediate receipt; the recursive historical
  // replay above verifies these original audit refs at their original commit.
  if (!preservedPrior) for (const key of ["auditPackageRef", "manifestRef", "sourceParityRef"]) {
    const evidence = prior.approval.metaPipelineAudit[key];
    if (!evidence || !prior.approval.evidenceRefs.some(r => r.path === evidence.path && r.sha256 === evidence.sha256))
      fail("original audit evidence reference missing");
  }
  const difficultyRef = spec.difficultyRequestRef;
  if (!difficultyRef?.path?.startsWith(".archive-meta-register/inbox/")) fail("official difficulty request reference required");
  const difficultyBytes = _historical ? readBoundBytes(difficultyRef) : readPreservedAuditEvidence(root, request, difficultyRef);
  const difficulty = JSON.parse(difficultyBytes.toString("utf8")), correction = difficulty.reviewedCorrection;
  if (difficulty.schemaVersion !== "archive-difficulty5-register-request-v1" ||
      difficulty.gemini?.sourceArchiveFile !== source || difficulty.gemini.latestBlobSha !== request.expectedSourceBlobSha1 ||
      correction?.schemaVersion !== "archive-difficulty5-reviewed-correction-v1")
    fail("reviewed difficulty source/request mismatch");
  const difficultyProof = readBound({ path: correction.evidencePath, sha256: correction.evidenceSha256 }).data;
  if (difficultyProof.schemaVersion !== correction.schemaVersion) fail("difficulty proof schema mismatch");
  const changes = unique(correction.rows, "questionUid", "difficulty correction UID");
  const difficultyItems = unique(difficulty.gemini.items, "questionUid", "difficulty request UID");
  const proofRows = unique(difficultyProof.rows.filter(r => r.sourceArchiveFile === source), "questionUid", "difficulty evidence UID");
  if ([changes, difficultyItems, proofRows].some(m => m.size !== bank.length)) fail("difficulty whole-exam UID denominator mismatch");
  let repair = null;
  if (spec.solutionRepair) {
    const value = spec.solutionRepair;
    if (Object.keys(value).some(k => !["ref", "reviewCommit", "reviewPath"].includes(k))) fail("unknown solution repair option");
    repair = readBound(value.ref).data;
    commit(root, value.reviewCommit); localPath(root, value.reviewPath);
    if (sha(git(root, ["show", value.reviewCommit + ":" + value.reviewPath])) !== value.ref.sha256 ||
        repair.schemaVersion !== "archive-source-solution-repair-v1" || repair.status !== "NARROW_REPAIR_REVIEWED" ||
        !Array.isArray(repair.rows)) fail("immutable narrow solution review mismatch");
  }
  const context = { root, request, prior, ref, records, identities, runtimes, patches, oldBank, bank, master,
    changes, difficultyItems, proofRows, difficulty, difficultyBytes, difficultyRef, repair, repairedUids: new Set(),
    readBound, readBoundBytes, historical: _historical };
  context.consumerParents = loadPreservedConsumerParents(context);
  return context;
}

function verifyHistoricalPreservation({ root, receipt, receiptRef, priorCommit, bytes, bank, seen }) {
  const key = priorCommit + ":" + receiptRef.path + ":" + receiptRef.sha256;
  if (seen.includes(key) || seen.length >= 16) fail("preservation history cycle or depth limit");
  const request = historicalRequest(root, priorCommit, receipt);
  if (request.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2" ||
      request.scope !== undefined || receipt.scope !== undefined || request.registrationMode !== undefined)
    fail("only a full historical preservation may be the prior audit");
  assertAuditPreservationReceipt(receipt, request, bytes, bank.length);
  // Historical inputs are authenticated even when the new request does not need
  // their particular field. An existing Git file always wins over a sealed copy.
  for (const refs of [request.approval.evidenceRefs, ...request.items.map(item => item.evidenceRefs)]) {
    if (!Array.isArray(refs) || !refs.length) fail("historical item evidence missing");
    for (const ref of refs) historicalEvidence(root, priorCommit, ref, refs, receipt, request);
  }
  const context = loadAuditPreservation({ root, request, bytes, bank,
    _historical: { commit: priorCommit, receipt, seen: [...seen, key] } });
  if (!equal(receipt.metaPipelineAudit, context.prior.metaPipelineAudit))
    fail("historical original audit summary changed");
  const identities = unique(receipt.appliedIdentityRecords, "questionUid", "historical identity UID");
  const runtimes = unique(receipt.runtimeRecords, "questionUid", "historical runtime UID");
  for (const current of receipt.appliedRecords) {
    const kept = planPreservedAuditRecord(context, { current, identity: identities.get(current.questionUid),
      runtime: runtimes.get(current.questionUid), question: bank[current.sourceOrdinal - 1], ordinal: current.sourceOrdinal,
      receiptPath: receiptRef.path, replay: true });
    assertPreservedAuditRepair(receipt, kept);
  }
  return { request };
}

// Historical raw audit L1/L2 can predate the already published basic-parent
// projection. Preserve the raw approval and prove that exact prior projection
// separately; a matching label without its UID, fingerprints and keys is never
// sufficient. This does not grant a new parent or alter a registered value.
function loadPreservedConsumerParents(context) {
  const { root, request, prior, ref, records, patches } = context;
  const parentRef = request.approval.sourceRebind.consumerParentRef;
  if (!parentRef) return new Map();
  if (!parentRef.path?.startsWith(RECEIPTS) || !parentRef.path.endsWith(".parent-preservation.json"))
    fail("consumer parent proof path invalid");
  const proof = context.readBound(parentRef).data;
  if (proof.schemaVersion !== "archive-native-audit-consumer-parent-preservation-v1" ||
      proof.sourceArchiveFile !== request.sourceArchiveFile || proof.expectedQuestionCount !== prior.totalQuestions ||
      !equal(proof.priorReceiptRef, ref) || proof.parentLinks?.path !== PARENT_LINKS ||
      !SHA256.test(proof.parentLinks?.sha256 || "") || !SHA1.test(proof.parentLinks?.blobSha1 || ""))
    fail("consumer parent proof binding invalid");
  commit(root, proof.priorConsumerCommit);
  if (sha(git(root, ["show", proof.priorConsumerCommit + ":" + ref.path])) !== ref.sha256 ||
      sha(git(root, ["show", proof.priorConsumerCommit + ":archive/exams/" + request.sourceArchiveFile])) !== prior.sourceRawSha256)
    fail("consumer parent snapshot differs from original audit/source");
  const linksBytes = git(root, ["show", proof.priorConsumerCommit + ":" + PARENT_LINKS]);
  const links = gitJson(root, proof.priorConsumerCommit, PARENT_LINKS);
  if (sha(linksBytes) !== proof.parentLinks.sha256 || blobSha(linksBytes) !== proof.parentLinks.blobSha1 ||
      links.schemaVersion !== "archive2-basic-scope-parent-links-v1" || links.status !== "DERIVED_READ_ONLY" ||
      links.authority?.source !== RPM_MASTER || !SHA256.test(links.authority?.sha256 || "") ||
      sha(git(root, ["show", proof.priorConsumerCommit + ":" + RPM_MASTER])) !== links.authority.sha256)
    fail("consumer parent immutable authority mismatch");
  const priorMetadata = gitJson(root, proof.priorConsumerCommit, "archive/data/question_metadata.json");
  const parents = unique(proof.records, "questionUid", "consumer parent UID");
  if (!parents.size || parents.size > patches.size || [...parents.keys()].some(uid => !patches.has(uid)))
    fail("consumer parent UID outside preserved selection");
  const fields = ["sourceOrdinal", "standardCourse", "standardUnitKey", "subUnitKey", "curriculumKey", "courseKey", "sourceFingerprint", "contentFingerprint"];
  for (const [uid, parent] of parents) {
    const old = records.get(uid), saved = priorMetadata.records?.filter(r => r.questionUid === uid);
    const matches = links.sourceParents?.filter(r => r.questionUid === uid);
    if (!isSourceApprovedPartialAudit(old) || !equal(saved, [old]) || matches?.length !== 1 ||
        fields.some(k => !equal(parent[k], old[k])) ||
        Object.keys(parent).some(k => !["questionUid", "grade", "L1", "L2", ...fields].includes(k)))
      fail("consumer parent prior UID/keys/approval mismatch: " + uid);
    const linked = matches[0];
    if (linked.sourceFingerprint !== old.sourceFingerprint || linked.assignmentFingerprint !== old.contentFingerprint ||
        ["grade", "curriculumKey", "courseKey", "L1", "L2"].some(k => !text(parent[k]) || parent[k] !== linked[k]))
      fail("consumer parent differs from prior source-bound projection: " + uid);
  }
  return parents;
}

export function preservedAuditConsumerParent(context, record, consumer) {
  const parent = context?.consumerParents?.get(record.questionUid);
  if (!parent) return null;
  const assignment = consumer?.assignmentEvidence;
  if (!isSourceApprovedPartialAudit(record) || assignment?.store !== "question_metadata+basic_scope_parent_links" ||
      assignment.approvalStatus !== "APPROVED" || assignment.reviewEvidence?.status !== "PASS" ||
      consumer.canonicalAssignmentReasons?.length || consumer.metadataConflicts?.length ||
      consumer.questionUid !== record.questionUid || consumer.sourceFile !== record.sourceArchiveFile ||
      consumer.sourceOrdinal !== record.sourceOrdinal || assignment.questionUid !== record.questionUid ||
      assignment.sourceFile !== record.sourceArchiveFile || assignment.sourceOrdinal !== record.sourceOrdinal ||
      assignment.sourceFingerprint !== record.contentFingerprint || assignment.assignmentFingerprint !== record.contentFingerprint ||
      consumer.assignmentFingerprint !== record.contentFingerprint ||
      assignment.reviewEvidence.reviewedSourceFingerprint !== record.sourceFingerprint ||
      assignment.reviewEvidence.sourceRevision !== record.metadataRevision ||
      !context.records.get(record.questionUid)?.approvalEvidence?.includes(assignment.reviewEvidence.reference) ||
      ["standardCourse", "standardUnitKey", "subUnitKey", "curriculumKey", "courseKey"].some(k =>
        !equal(consumer[k], record[k]) || !equal(assignment[k], record[k])) ||
      ["grade", "curriculumKey", "courseKey", "L1", "L2"].some(k => assignment[k] !== parent[k]))
    fail("consumer parent current approved projection mismatch: " + record.questionUid);
  return { grade: parent.grade, curriculumKey: parent.curriculumKey, courseKey: parent.courseKey, L1: parent.L1, L2: parent.L2 };
}

export function planPreservedAuditRecord(context, { current, identity, runtime, question, ordinal, receiptPath, replay = false }) {
  if (context.sourceOnly === true)
    return planAuditSourcePreservation(context, { current, identity, runtime, question, ordinal, receiptPath, replay });
  const { request, prior, records, identities, runtimes, oldBank, master, changes, difficultyItems, proofRows } = context;
  const uid = current.questionUid, old = records.get(uid), oldId = identities.get(uid), oldRuntime = runtimes.get(uid);
  const patch = context.patches.get(uid), beforeQuestion = oldBank[ordinal - 1], change = changes.get(uid);
  if (!old || !oldId || !oldRuntime || !patch || !change || !isPreservableAuditRecord(old) ||
      [old, oldId, oldRuntime].some(r => r.sourceArchiveFile !== request.sourceArchiveFile || r.sourceOrdinal !== ordinal) ||
      patch.sourceOrdinal !== ordinal || !equal(patch.before, {}) || !equal(patch.after, {}) ||
      Object.keys(patch).some(k => !["questionUid", "sourceOrdinal", "before", "after", "reason", "evidenceRefs"].includes(k)) ||
      !text(patch.reason) || !old.approvalEvidence?.includes(context.ref.path) ||
      oldRuntime.sourceIdentity !== request.sourceArchiveFile + "#" + ordinal ||
      old.sourceFingerprint !== fingerprint(beforeQuestion) || old.contentFingerprint !== contentFingerprint(beforeQuestion) ||
      oldId.sourceFingerprint !== old.sourceFingerprint || oldRuntime.approvedSourceFingerprint !== old.sourceFingerprint)
    fail("prior UID/identity/runtime or unchanged-value contract mismatch: " + uid);
  const proof = proofRows.get(uid), difficultyItem = difficultyItems.get(uid);
  if (change.ordinal !== ordinal || proof?.ordinal !== ordinal || difficultyItem?.ordinal !== ordinal ||
      change.refreshBinding !== false || !["CORRECT", "KEEP"].includes(change.decision) ||
      !equal(change.before, proof.before) || !equal(change.after, proof.after) || change.decision !== proof.decision ||
      change.reason !== proof.reason || !text(change.reason) || !equal(difficultyItem.after, change.after) ||
      change.sourceFingerprint !== fingerprint(question) || change.contentFingerprint !== contentFingerprint(question) ||
      proof.sourceFingerprint !== change.sourceFingerprint || proof.contentFingerprint !== change.contentFingerprint ||
      change.before?.sourceFingerprint !== old.sourceFingerprint || change.before?.contentFingerprint !== old.contentFingerprint ||
      change.before?.level !== old.level ||
      PRESERVED_DIFFICULTY_FIELDS.some(k => !equal(change.before?.[k] ?? null, old[k] ?? null)))
    fail("difficulty correction is not the exact prior-to-current reviewed result: " + uid);
  const expected = { ...structuredClone(old), ...structuredClone(change.after) };
  const sourceApprovedPartial = isSourceApprovedPartialAudit(old);
  if (sourceApprovedPartial && (prior.approval.metaPipelineAudit.schemaVersion !== "meta-pipeline-audit-approval-v2" ||
      request.approval.sourceRebind.solutionRepair))
    fail("source-approved partial status requires its original v2 audit and difficulty-only source change");
  for (const key of Object.keys(change.after || {}))
    if (!PRESERVED_DIFFICULTY_FIELDS.includes(key)) fail("difficulty correction changes a non-difficulty value");
  if (!equal(pick(beforeQuestion, FIXED_STUDENT_FIELDS), pick(question, FIXED_STUDENT_FIELDS)))
    fail("student inputs or numbering changed: " + uid);
  for (const key of new Set([...Object.keys(beforeQuestion), ...Object.keys(question)]))
    if (!equal(beforeQuestion[key], question[key]) &&
        !(sourceApprovedPartial ? PRESERVED_DIFFICULTY_FIELDS.includes(key) : TRANSPORT_FIELDS.has(key)))
      fail("unreviewed source field changed: " + uid + "." + key);
  const unit = master.find(r => r.key === old.standardUnitKey && r.keyType === "standardUnitKey" && ["active", "ACTIVE"].includes(r.status));
  const sub = master.find(r => r.key === old.subUnitKey && r.keyType === "subUnitKey" && ["active", "ACTIVE"].includes(r.status));
  if (!unit || !sub || (sub.standardUnitKey || sub.parentKey) !== unit.key) fail("exact canonical basic keys missing");
  for (const key of SOURCE_VALUES) {
    if (!Object.hasOwn(question, key) || equal(question[key], expected[key])) continue;
    // Old source placeholders can differ from the already approved sidecar.
    // Keep that exact prior source/sidecar relationship; no changed source value,
    // new classification, or altered approval/debt is accepted by this branch.
    if (sourceApprovedPartial && !PRESERVED_DIFFICULTY_FIELDS.includes(key) &&
        Object.hasOwn(beforeQuestion, key) && equal(question[key], beforeQuestion[key])) continue;
    if (key === "standardUnit" && question[key] === unit.labelKo || key === "subUnit" && question[key] === sub.labelKo) continue;
    fail("source/approved value mismatch: " + uid + "." + key);
  }
  if (!equal(question.category, beforeQuestion.category) && question.category !== unit.labelKo)
    fail("source category is not the exact canonical unit label");
  if (!equal(question.standardUnitOrder, beforeQuestion.standardUnitOrder)) {
    const orderRef = request.approval.evidenceRefs.find(r => r.path === UNIT_MASTER_PATH);
    if (!orderRef || sha(context.readBoundBytes(orderRef)) !== orderRef.sha256 ||
        sha(fs.readFileSync(localPath(context.root, orderRef.path))) !== orderRef.sha256)
      fail("unit-order authority must be SHA-bound at the current and historical input");
    if (loadUnitOrders(context.root).orders.get(old.standardUnitKey)?.order !== question.standardUnitOrder)
      fail("source unit order differs from canonical authority");
  }
  let repair = null;
  if (!equal(beforeQuestion.solution, question.solution)) {
    const rows = context.repair?.rows.filter(r => r.sourceArchiveFile === request.sourceArchiveFile && r.questionUid === uid);
    repair = rows?.length === 1 ? rows[0] : null;
    if (!repair || repair.ordinal !== ordinal || !equal(repair.changedFields, ["solution"]) ||
        !SHA1.test(repair.beforeSourceBlobSha || "") || !SHA1.test(repair.afterSourceBlobSha || "") ||
        repair.beforeSolutionSha256 !== sha(beforeQuestion.solution) || repair.afterSolutionSha256 !== sha(question.solution) ||
        !text(repair.reason) || !text(repair.reviewScope) || !text(repair.reviewers?.author) ||
        !text(repair.reviewers?.independent) || repair.reviewers.author === repair.reviewers.independent)
      fail("exact independently reviewed solution repair required: " + uid);
    const before = parseBank(git(context.root, ["cat-file", "blob", repair.beforeSourceBlobSha]));
    const after = parseBank(git(context.root, ["cat-file", "blob", repair.afterSourceBlobSha]));
    if (before.length !== oldBank.length || after.length !== oldBank.length ||
        !equal(pick(before[ordinal - 1], REASSESSED_STUDENT_FIELDS), pick(beforeQuestion, REASSESSED_STUDENT_FIELDS)) ||
        !equal(pick(after[ordinal - 1], REASSESSED_STUDENT_FIELDS), pick(question, REASSESSED_STUDENT_FIELDS)))
      fail("solution repair Git source mismatch: " + uid);
    context.repairedUids.add(uid);
  }
  const final = { ...expected, sourceFingerprint: fingerprint(question), contentFingerprint: contentFingerprint(question),
    approvalEvidence: [...new Set([...(old.approvalEvidence || []), receiptPath])],
    metadataRevision: "meta-foundation:" + old.metaFoundationPackId + "@" + old.metaFoundationPackVersion +
      ":exam-meta_pipeline_audit-v2:" + request.requestId };
  const identityAfter = { ...oldId, sourceFingerprint: final.sourceFingerprint };
  const runtimeAfter = { ...oldRuntime, ...final, sourceQuestionNo: oldRuntime.sourceQuestionNo,
    sourceIdentity: oldRuntime.sourceIdentity, approvedSourceFingerprint: final.sourceFingerprint };
  if (!equal(current, replay ? final : expected) || !equal(identity, replay ? identityAfter : oldId) ||
      !equal(runtime, replay ? runtimeAfter : oldRuntime))
    fail("current metadata/identity/runtime differs from the preserved state: " + uid);
  return { final, identityAfter, runtimeAfter, prior: old, oldId, priorQuestion: beforeQuestion,
    fingerprintRepair: repair ? { questionUid: uid, sourceOrdinal: ordinal,
      metadataBefore: { sourceFingerprint: old.sourceFingerprint, contentFingerprint: old.contentFingerprint },
      identityBefore: { sourceFingerprint: oldId.sourceFingerprint },
      after: { sourceFingerprint: final.sourceFingerprint, contentFingerprint: final.contentFingerprint },
      auditPreservation: { priorReceiptRef: context.ref, solutionRepair: request.approval.sourceRebind.solutionRepair } } : null };
}

export function assertAuditPreservationReceipt(receipt, request, bytes, questionCount) {
  if (request.approval?.sourceRebind?.schemaVersion === AUDIT_SOURCE_PRESERVATION_SCHEMA)
    return assertAuditSourcePreservationReceipt(receipt, request, bytes, questionCount);
  const { partial, patches, selectedCount: count } = preservationSelection(request, questionCount);
  if (receipt.schemaVersion !== "archive-reviewed-exam-meta-registration-v2" || receipt.metadataRegistrationStatus !== "REGISTERED" ||
      receipt.requestId !== request.requestId || receipt.requestSha256 !== sha(stable(request)) ||
      !equal(receipt.approval, request.approval) || receipt.sourceArchiveFile !== request.sourceArchiveFile ||
      receipt.sourceBlobSha1 !== request.expectedSourceBlobSha1 || receipt.sourceRawSha256 !== sha(bytes) ||
      receipt.registrationMode !== undefined ||
      (partial ? receipt.scope !== request.scope || receipt.partialUidCount !== count || receipt.expectedQuestionCount !== questionCount
        : receipt.scope !== undefined || receipt.partialUidCount !== undefined) ||
      receipt.totalQuestions !== count || receipt.newMetadataApprovals !== 0 ||
      receipt.preservedMetadataApprovals !== count || receipt.examFinalQaStatus !== "NOT_EVALUATED_BY_REGISTRAR")
    fail("preservation receipt binding/count drift");
  const records = unique(receipt.appliedRecords, "questionUid", "preserved receipt UID");
  const ids = unique(receipt.appliedIdentityRecords, "questionUid", "preserved receipt identity");
  const runtimes = unique(receipt.runtimeRecords, "questionUid", "preserved receipt runtime");
  const repairs = unique(receipt.fingerprintRepairs, "questionUid", "preserved receipt fingerprint repair");
  const summary = receipt.auditPreservation;
  if ([records, ids, runtimes].some(m => m.size !== count) ||
      [records, ids, runtimes].some(m => [...m].some(([uid, row]) => !patches.has(uid) ||
        row.sourceOrdinal !== patches.get(uid).sourceOrdinal || row.sourceArchiveFile !== request.sourceArchiveFile)) ||
      [...ids.keys(), ...runtimes.keys(), ...repairs.keys()].some(uid => !records.has(uid)) ||
      new Set(receipt.appliedRecords.map(r => r.sourceOrdinal)).size !== count ||
      receipt.registryChanges?.length || summary?.schemaVersion !== AUDIT_PRESERVATION_SCHEMA ||
      summary.preservedApprovalType !== "META_PIPELINE_AUDIT" || summary.newMetadataApprovals !== 0 ||
      summary.preservedMetadataApprovals !== count || summary.solutionFingerprintRepairs !== repairs.size ||
      !equal(summary.difficultyRequestRef, request.approval.sourceRebind.difficultyRequestRef) ||
      !equal(summary.requestSnapshot, request) ||
      summary.difficultyRequestSnapshot?.path !== summary.difficultyRequestRef.path ||
      summary.difficultyRequestSnapshot?.sha256 !== summary.difficultyRequestRef.sha256 ||
      typeof summary.difficultyRequestSnapshot?.rawUtf8 !== "string" ||
      sha(summary.difficultyRequestSnapshot.rawUtf8) !== summary.difficultyRequestRef.sha256)
    fail("preservation receipt UID/provenance/repair count drift");
}

export function assertPreservedAuditRepair(receipt, kept) {
  const found = receipt.fingerprintRepairs.filter(r => r.questionUid === kept.final.questionUid);
  if (!equal(found, kept.fingerprintRepair ? [kept.fingerprintRepair] : []))
    fail("preservation fingerprint repair differs from immutable review");
}

export function readAuditPreservationRequest(root, receipt) {
  const spec = receipt?.approval?.sourceRebind;
  if (!isAuditPreservation(receipt?.approval) || !spec.requestPath?.startsWith(".archive-meta-register/inbox/"))
    fail("explicit preservation request path required");
  const file = localPath(root, spec.requestPath);
  const request = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : receipt.auditPreservation?.requestSnapshot;
  if (!request || !equal(request, receipt.auditPreservation?.requestSnapshot)) fail("preserved request snapshot missing/drift");
  if (receipt.requestSha256 !== sha(stable(request)) || !equal(receipt.approval, request.approval))
    fail("preservation request differs from receipt");
  return request;
}

// A difficulty request is replayable after its exact result was carried by an
// audit-preservation receipt that also rebound a reviewed solution fingerprint.
// It cannot use a naked current fingerprint or another request's approval.
export function verifyPreservedAuditDifficulty({ root, difficulty, current, identity, bank }) {
  for (const relative of current.approvalEvidence || []) {
    if (typeof relative !== "string" || !relative.startsWith(RECEIPTS) || !relative.endsWith(".json")) continue;
    try {
      const receipt = JSON.parse(fs.readFileSync(localPath(root, relative), "utf8"));
      if (!isAuditPreservation(receipt.approval)) continue;
      const request = readAuditPreservationRequest(root, receipt);
      if (relative !== RECEIPTS + request.requestId + ".json") continue;
      const bytes = fs.readFileSync(localPath(root, "archive/exams/" + request.sourceArchiveFile));
      assertAuditPreservationReceipt(receipt, request, bytes, bank.length);
      const context = loadAuditPreservation({ root, request, bytes, bank });
      if (!equal(context.difficulty, difficulty)) continue;
      const registered = unique(receipt.appliedRecords, "questionUid", "registered metadata UID");
      const registeredIds = unique(receipt.appliedIdentityRecords, "questionUid", "registered identity UID");
      const registeredRuntime = unique(receipt.runtimeRecords, "questionUid", "registered runtime UID");
      if ([registered, registeredIds, registeredRuntime].some(m => m.size !== context.patches.size) ||
          !equal(registered.get(current.questionUid), current) || !equal(registeredIds.get(current.questionUid), identity))
        continue;
      if (!/^[A-Z][A-Z0-9_]*$/.test(current.metaFoundationPackId || "")) continue;
      const runtimeRoot = "archive/data/meta-foundation/runtime";
      const runtimes = fs.readdirSync(localPath(root, runtimeRoot)).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json")
        .flatMap(n => {
          const doc = JSON.parse(fs.readFileSync(localPath(root, runtimeRoot + "/" + n), "utf8"));
          return (doc.records || []).filter(r => r.questionUid === current.questionUid).map(row => ({ doc, row }));
        });
      if (runtimes.length !== 1 || runtimes[0].doc.status !== "ACTIVE" ||
          runtimes[0].doc.packId !== current.metaFoundationPackId ||
          !equal(registeredRuntime.get(current.questionUid), runtimes[0].row)) continue;
      const runtime = [runtimes[0].row];
      const kept = planPreservedAuditRecord(context, { current, identity, runtime: runtime[0], question: bank[current.sourceOrdinal - 1],
        ordinal: current.sourceOrdinal, receiptPath: relative, replay: true });
      assertPreservedAuditRepair(receipt, kept);
      return true;
    } catch { /* Unavailable or stale preservation evidence never excuses the original binding guard. */ }
  }
  return false;
}
