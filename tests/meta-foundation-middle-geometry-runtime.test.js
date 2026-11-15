const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const Archive2Core = require("../archive/archive2-core.js");

async function main() {
const { loadBank, nativeReviewReceipt, activeBindingContext, sourceFingerprint, sourcePath } = await import("../archive/tools/meta-foundation/auto-register-merged-source.mjs");
const { loadActiveMetaRegistry, validateActiveMetaFields } = await import("../archive/tools/meta-foundation/active-registry.mjs");
const { isUnambiguousLegacySourceUidAlias } = await import("../archive/tools/intelligence/question-identity-contract.mjs");
const { loadConsumer } = await import("../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs");
const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sourceKey = (file, ordinal) => Archive2Core.normalizeFile(file) + "#" + Number(ordinal);
const runtimePath = "archive/data/meta-foundation/runtime/middle-geometry-v1.json";
const catalog = Archive2Core.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const bridge = fs.readFileSync(path.join(root, "archive/meta-foundation-runtime.js"), "utf8");
assert(bridge.includes("data/meta-foundation/runtime/middle-geometry-v1.json"));
assert(bridge.includes("Canonical.resolveCatalog"));
const runtime = readJson(runtimePath);
const taxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const concepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const conditions = readJson("archive/data/meta-foundation/compiled/condition_registry.json");
const bindings = readJson("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const runtimeReceipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");

assert.strictEqual(runtime.status, "ACTIVE");
assert.strictEqual(runtime.packId, "MIDDLE_GEOMETRY");
const pack = readJson("archive/data/meta-foundation/canonical/packs/middle-geometry/pack.json");
assert.strictEqual(runtime.packVersion, pack.packVersion);
assert.strictEqual(runtime.counts.records, runtime.records.length);
assert.strictEqual(runtime.counts.finalL3, 921);
assert.strictEqual(runtime.counts.finalL4, 901);
assert.strictEqual(runtime.counts.explicitL4Hold, 20);
assert.strictEqual(runtime.counts.routeOut, 7);
assert.strictEqual(runtimeReceipt.checked.combinedRuntimeRecords, runtimeRecordCount);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueUid, runtimeRecordCount);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueSourceIdentity, runtimeRecordCount);
assert.strictEqual(runtime.counts.catalogUidDirectJoin, runtime.records.length);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 0);
assert.strictEqual(runtimeReceipt.checked.middleGeometryCatalogJoin, runtime.records.length);
assert.strictEqual(runtimeReceipt.checked.middleGeometryCatalogJoinMismatch, 0);
assert.strictEqual(runtimeReceipt.checked.metaFoundationRuntimePackCount, 11);
assert.strictEqual(runtime.counts.automaticEligibleExpected, runtime.records.filter((row) => row.runtimeSelectable).length);
assert.strictEqual(runtime.counts.defaultSelectable, runtime.records.filter((row) => row.defaultSelectable).length);
assert.strictEqual(new Set(runtime.records.map((row) => row.questionUid)).size, runtime.records.length);
assert.strictEqual(new Set(runtime.records.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, runtime.records.length);

// These are immutable historical UID cohorts, not counts of rows that must
// keep an old pack version forever. A fresh reviewed registration may replace
// a row; it must preserve that UID/source and prove its new approval below.
// Official source-readiness refresh updates counts and the bridge receipt, not
// these approval rows. Current source release is checked by the canonical gate
// below, so a source HOLD never inherits release from this historical digest.
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const cohortBytes = fs.readFileSync(path.join(root, "tests/fixtures/middle-geometry-runtime-cohorts-20261115.json"));
assert.strictEqual(sha256(cohortBytes), "74553daa7085f25652405f5bad95d8a7c269dfcce3e14017eab135746ed3fdc9");
const historical = JSON.parse(cohortBytes);
assert.strictEqual(historical.schemaVersion, "middle-geometry-runtime-historical-cohorts-v1");
assert.deepStrictEqual(historical.columns, ["questionUid", "sourceIndex", "sourceOrdinal", "metaFoundationL3Status", "metaFoundationL4Status", "runtimeRecordSha256"]);
assert.deepStrictEqual(Object.keys(historical.cohorts), ["1.0.0", "1.0.2", "1.0.3"]);
assert.strictEqual(historical.cohorts["1.0.0"].length, 904);
assert.strictEqual(historical.cohorts["1.0.2"].length, 47);
assert.strictEqual(historical.cohorts["1.0.3"].length, 24);
assert.strictEqual(historical.cohorts["1.0.0"].filter(row => row[3] === "FINAL").length, 897);
assert.strictEqual(historical.cohorts["1.0.0"].filter(row => row[4] === "FINAL").length, 878);
assert.strictEqual(historical.cohorts["1.0.0"].filter(row => row[4] === "EXPLICIT_HOLD").length, 19);
assert.strictEqual(historical.cohorts["1.0.0"].filter(row => row[3] === "ROUTE_OUT").length, 7);
const historicalByUid = new Map();
for (const [version, rows] of Object.entries(historical.cohorts)) for (const row of rows) {
  const [uid, sourceIndex, ordinal, , , digest] = row;
  assert(!historicalByUid.has(uid), uid);
  assert(/^qid_v1_[a-f0-9]{64}$/.test(uid) && /^[a-f0-9]{64}$/.test(digest), uid);
  assert(Number.isSafeInteger(sourceIndex) && historical.sources[sourceIndex], uid);
  assert(Number.isSafeInteger(ordinal) && ordinal > 0, uid);
  historicalByUid.set(uid, { version, source: historical.sources[sourceIndex], ordinal, digest });
}
const activeRuntimeByUid = new Map();
for (const file of Archive2Core.Canonical.RUNTIME_INPUT_PATHS) {
  const document = readJson("archive/" + file);
  for (const row of document.records) {
    const entries = activeRuntimeByUid.get(row.questionUid) || [];
    entries.push({ row, packId: document.packId, status: document.status });
    activeRuntimeByUid.set(row.questionUid, entries);
  }
}

const l3Evidence = readJson("archive/data/meta-foundation/evidence/middle-geometry/v1/l3_semantic_final_928.json").records;
const l4Evidence = readJson("archive/data/meta-foundation/evidence/middle-geometry/v1/l4_crossconcept_semantic_freeze_928.json").records;
assert.strictEqual(l3Evidence.length, 928);
assert.strictEqual(l4Evidence.length, 928);
assert.strictEqual(l3Evidence.filter((row) => row.l3ReviewStatus === "FINAL").length, runtime.counts.finalL3);
assert.strictEqual(l3Evidence.filter((row) => row.l3ReviewStatus === "OUT_OF_SCOPE_HOLD").length, runtime.counts.routeOut);
assert.strictEqual(l4Evidence.filter((row) => row.l4ReviewStatus === "FINAL").length, runtime.counts.finalL4);
assert.strictEqual(l4Evidence.filter((row) => row.l4ReviewStatus === "EXPLICIT_HOLD").length, runtime.counts.explicitL4Hold);

const currentQuestionMetadata = new Map(readJson("archive/data/question_metadata.json").records.map((row) => [row.questionUid, row]));
const identityMap = readJson("archive/data/question_identity_map.json");
const identityByUid = new Map(identityMap.records.map((row) => [row.questionUid, row]));
const identityByJoin = new Map(identityMap.records.map((row) => [sourceKey(row.sourceArchiveFile, row.sourceOrdinal), row]));
const registry = loadActiveMetaRegistry(root);
assert.strictEqual(registry.status, "ACTIVE", registry.errors.join("|"));
const nativeSources = new Map();
const nativeApprovals = new Map();
const nativeInputs = [];
const historicalHeldApprovals = new Map();
const historicalHeldInputs = [];
let currentConsumer;
function nativeInput(metadata, row, owner = runtime) {
  const source = sourcePath(metadata.sourceArchiveFile);
  if (!nativeSources.has(source)) {
    const relative = "archive/exams/" + source;
    const bytes = fs.readFileSync(path.join(root, relative));
    nativeSources.set(source, {
      root, bytes, bank: loadBank(bytes.toString("utf8"), relative),
      blobSha1: execFileSync("git", ["hash-object", "--path", relative, "--stdin"],
        { cwd: root, input: bytes, encoding: "utf8" }).trim()
    });
  }
  const sourceBinding = nativeSources.get(source);
  const ordinal = Number(metadata.sourceOrdinal);
  const question = sourceBinding.bank[ordinal - 1];
  assert(question, metadata.questionUid);
  return {
    question, previous: question, current: metadata, identity: identityByUid.get(metadata.questionUid),
    registry, source, ordinal, runtimeOwner: owner.packId,
    nativeSource: { ...sourceBinding, identityMap, identityByJoin, runtimeRecord: row, runtimeStatus: owner.status }
  };
}
function assertNativeApproval(input, label) {
  const { question, previous, current, identity, source, ordinal } = input;
  // The read-only receipt verifier normally follows these planQuestion identity guards.
  assert(identity && current, label);
  assert.strictEqual(identity.questionUid, current.questionUid, label);
  assert.strictEqual(identity.sourceArchiveFile, source, label);
  assert.strictEqual(current.sourceArchiveFile, source, label);
  assert.strictEqual(Number(identity.sourceOrdinal), ordinal, label);
  assert.strictEqual(Number(current.sourceOrdinal), ordinal, label);
  if (question.questionUid && question.questionUid !== identity.questionUid)
    assert(isUnambiguousLegacySourceUidAlias({ question, sourceArchiveFile: source, sourceOrdinal: ordinal,
      identityRecord: identity, identityMap: input.nativeSource.identityMap, bank: input.nativeSource.bank }), label);
  if (identity.status) assert.strictEqual(identity.status, "VERIFIED", label);
  assert.strictEqual(String(current.sourceQuestionNo), String(identity.sourceQuestionNo), label);
  // Legacy sources can restart displayed sourceQuestionNo values for an essay section.
  // Bind that label to the accepted runtime display; metadata/identity use the global number.
  assert.strictEqual(String(input.nativeSource.runtimeRecord.sourceQuestionNo), String(question.sourceQuestionNo ?? question.id ?? ""), label);
  if (previous) assert.strictEqual(String(previous.sourceQuestionNo ?? previous.id ?? ""), String(question.sourceQuestionNo ?? question.id ?? ""), label);
  assert.strictEqual(identity.sourceFingerprint, sourceFingerprint(question), label);
  assert.strictEqual(current.sourceFingerprint, sourceFingerprint(question), label);
  assert.notStrictEqual(current.metadataStatus, "SOURCE_HOLD", label);

  // This proves the existing classification/approval, not eligibility to produce new metadata.
  // Validate only classification fields here; optional enum/difficulty debt remains subject to
  // planQuestion's unchanged producer checks and is not declared valid by this test.
  const classification = Object.fromEntries([
    "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
    "standardUnitKey", "subUnitKey", "sourceArchiveFile"
  ].map(key => [key, current[key]]));
  const check = validateActiveMetaFields(classification, input.registry, { requireFields: false });
  assert.strictEqual(check.status, "VALIDATED", label + ": " + check.errors.join("|"));
  assert.strictEqual(check.activeBinding, true, label);
  const context = activeBindingContext({ candidate: current, check, registry: input.registry, runtimeOwner: input.runtimeOwner });
  assert(!context.reason, label + ": " + context.reason);
  const receiptPath = nativeReviewReceipt({ ...input, pt: context.pt, tpl: context.tpl, ownerPack: context.ownerPack });
  assert(receiptPath, label + ": native receipt was not verified");
  assert(current.approvalEvidence.includes(receiptPath), label);
  const receipt = JSON.parse(fs.readFileSync(path.join(input.nativeSource.root, receiptPath), "utf8"));
  const registeredIdentity = receipt.appliedIdentityRecords.filter(row => row.questionUid === identity.questionUid);
  assert.strictEqual(registeredIdentity.length, 1, label);
  assert.deepStrictEqual(registeredIdentity[0], identity, label);
  assert.strictEqual(current.metadataApprovalType, input.nativeSource.runtimeRecord.metadataApprovalType, label);
  assert.deepStrictEqual(current.fieldStatus, input.nativeSource.runtimeRecord.fieldStatus, label);
  return receiptPath;
}

function activeNativeContext(input, label) {
  const classification = Object.fromEntries([
    "problemTypeKey", "templateKey", "curriculum", "curriculumKey", "standardCourse",
    "standardUnitKey", "subUnitKey", "sourceArchiveFile"
  ].map(key => [key, input.current[key]]));
  const check = validateActiveMetaFields(classification, input.registry, { requireFields: false });
  assert.strictEqual(check.status, "VALIDATED", label + ": " + check.errors.join("|"));
  assert.strictEqual(check.activeBinding, true, label);
  const context = activeBindingContext({ candidate: input.current, check, registry: input.registry, runtimeOwner: input.runtimeOwner });
  assert(!context.reason, label + ": " + context.reason);
  return context;
}

// A changed source does not erase its byte-bound historical approval. It must
// also never inherit that approval as current verified metadata. This fallback
// proves both facts; an unreadable, changed or unproved old receipt still fails.
function assertHistoricalNativeHeld(input, label, consumer = currentConsumer || (currentConsumer = loadConsumer(root))) {
  const { current, identity, source, ordinal, question, nativeSource } = input;
  const context = activeNativeContext(input, label);
  assert.strictEqual(nativeReviewReceipt({ ...input, ...context }), null, label + ": current native approval must be rejected");
  assert.strictEqual(nativeSource.root, root, label);
  assert.strictEqual(nativeSource.runtimeStatus, "ACTIVE", label);
  assert(Buffer.isBuffer(nativeSource.bytes), label);
  const relative = "archive/exams/" + source;
  assert.deepStrictEqual(fs.readFileSync(path.join(root, relative)), nativeSource.bytes, label + ": current source bytes");
  assert.strictEqual(execFileSync("git", ["hash-object", "--path", relative, "--stdin"],
    { cwd: root, input: nativeSource.bytes, encoding: "utf8" }).trim(), nativeSource.blobSha1, label);
  const currentBank = loadBank(nativeSource.bytes.toString("utf8"), relative);
  assert.deepStrictEqual(currentBank, nativeSource.bank, label);
  assert.deepStrictEqual(currentBank[ordinal - 1], question, label);
  assert.deepStrictEqual(input.previous, question, label + ": current-only cursor required");
  assert(["FINAL_QA", "REVIEW2"].includes(current.metadataApprovalType), label);
  const requestId = String(current.metadataRevision || "").match(/:exam-(?:final_qa|review2)-v2:([A-Za-z0-9][A-Za-z0-9_-]{0,100})$/)?.[1];
  assert(requestId, label);
  const receiptPath = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/" + requestId + ".json";
  assert(current.approvalEvidence.includes(receiptPath), label);
  const receipt = readJson(receiptPath);
  assert.strictEqual(receipt.requestId, requestId, label);
  assert.strictEqual(receipt.sourceArchiveFile, source, label);
  assert.strictEqual(receipt.approval.type, current.metadataApprovalType, label);
  for (const [rows, actual, field] of [
    [receipt.appliedRecords, current, "metadata"],
    [receipt.runtimeRecords, nativeSource.runtimeRecord, "runtime"],
    [receipt.appliedIdentityRecords, identity, "identity"]
  ]) {
    const selected = rows.filter(row => row.questionUid === current.questionUid);
    assert.strictEqual(selected.length, 1, label + ": exact historical " + field);
    assert.deepStrictEqual(selected[0], actual, label + ": exact historical " + field);
  }
  assert(/^[a-f0-9]{40}$/.test(receipt.sourceBlobSha1), label);
  assert.notStrictEqual(receipt.sourceBlobSha1, nativeSource.blobSha1, label);
  const oldBytes = execFileSync("git", ["cat-file", "blob", receipt.sourceBlobSha1], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
  assert.strictEqual(sha256(oldBytes), receipt.sourceRawSha256, label);
  assert.strictEqual(execFileSync("git", ["hash-object", "--path", relative, "--stdin"],
    { cwd: root, input: oldBytes, encoding: "utf8" }).trim(), receipt.sourceBlobSha1, label);
  const oldBank = loadBank(oldBytes.toString("utf8"), relative);
  assert.strictEqual(oldBank.length, receipt.expectedQuestionCount ?? receipt.totalQuestions, label);
  assert.strictEqual(oldBank.length, currentBank.length, label);
  const oldQuestion = oldBank[ordinal - 1];
  assert(oldQuestion, label);
  assert.notDeepStrictEqual(question, oldQuestion, label + ": unchanged selections require an actual preservation receipt");
  const oldIdentities = new Map(receipt.appliedIdentityRecords.map(row => [row.questionUid, row]));
  const oldIdentityMap = { ...nativeSource.identityMap,
    records: nativeSource.identityMap.records.map(row => oldIdentities.get(row.questionUid) || row) };
  const oldIdentityByJoin = new Map(nativeSource.identityByJoin);
  for (const row of oldIdentities.values()) oldIdentityByJoin.set(sourceKey(row.sourceArchiveFile, row.sourceOrdinal), row);
  const historicalInput = { ...input, question: oldQuestion, previous: oldQuestion,
    nativeSource: { ...nativeSource, bytes: oldBytes, blobSha1: receipt.sourceBlobSha1, bank: oldBank,
      identityMap: oldIdentityMap, identityByJoin: oldIdentityByJoin } };
  assert.strictEqual(assertNativeApproval(historicalInput, label + ": immutable historical approval"), receiptPath, label);

  const resolved = consumer.resolvedBySource.get(sourceKey(source, ordinal));
  const page = consumer.pageByUid.get(current.questionUid);
  assert(resolved && page, label + ": current Consumer row required");
  assert.strictEqual(resolved.questionUid, current.questionUid, label);
  assert.strictEqual(page.uid, current.questionUid, label);
  assert.strictEqual(resolved.sourceFingerprint, sourceFingerprint(question), label);
  assert.strictEqual(page.verifiedEligible, false, label);
  assert.strictEqual(page.automatic, false, label);
  for (const field of ["problemTypeKey", "templateKey", "rpmPrimaryRecordId", "L1", "L2", "L3", "L4",
    "rpmL1", "rpmL2", "rpmL3", "rpmL4"]) assert.strictEqual(page[field], null, label + ": " + field);
  const gate = Archive2Core.eligibility(resolved, { catalog: consumer.catalog });
  assert.strictEqual(gate.ok, false, label);
  if (page.metaProjectionFailureReason === "DISPLAY_PROJECTION_FINGERPRINT_MISMATCH") {
    assert.notStrictEqual(sourceFingerprint(question), current.sourceFingerprint, label);
    assert.strictEqual(resolved.sourceStatus, "HOLD", label);
    assert(gate.reasons.includes("source_release"), label);
  } else {
    // The legacy fingerprint omits the alternate question field. A whole
    // question delta is already proved above. This second observed policy must
    // independently block its current metadata; a generic null is insufficient.
    assert.strictEqual(page.metaProjectionFailureReason, "DISPLAY_PROJECTION_COURSE_NOT_ALLOWED", label);
    assert.strictEqual(sourceFingerprint(question), current.sourceFingerprint, label);
    assert.strictEqual(resolved.sourceStatus, "VERIFIED", label);
    assert(gate.reasons.includes("taxonomy"), label);
    assert(gate.reasons.includes("course_namespace_invalid"), label);
  }
  assert.strictEqual(consumer.ProblemBankMeta.query([page], {}, { profile: "VERIFIED" }).length, 0, label);
  // Original raw-source manual/general selection is a separate user policy.
  // directSelectable/defaultSelectable are deliberately not approval indicators.
  return receiptPath;
}

function assertCurrentOrHistoricalNative(input, label, remember) {
  const uid = input.current.questionUid;
  if (nativeReviewReceipt({ ...input, ...activeNativeContext(input, label) })) {
    const receiptPath = assertNativeApproval(input, label);
    if (remember) {
      nativeApprovals.set(uid, receiptPath);
      if (!nativeInputs.some(existing => existing.current.questionUid === uid)) nativeInputs.push(input);
    }
    return { current: true, receiptPath };
  }
  const receiptPath = assertHistoricalNativeHeld(input, label);
  if (remember) {
    historicalHeldApprovals.set(uid, receiptPath);
    if (!historicalHeldInputs.some(existing => existing.current.questionUid === uid)) historicalHeldInputs.push(input);
  }
  return { current: false, receiptPath };
}

function assertHeldRejectionCases(input, consumer) {
  const cases = [
    ["changed historical metadata", { current: { ...input.current, tagStatus: "review_required" } }],
    ["changed historical runtime", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, tagStatus: "review_required" } } }],
    ["changed historical identity", { identity: { ...input.identity, sourceFingerprint: "unproved" } }],
    ["changed current question", { question: { ...input.question, content: "unproved current payload" } }],
    ["changed current bytes", { nativeSource: { ...input.nativeSource,
      bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } }],
    ["changed current Git blob", { nativeSource: { ...input.nativeSource, blobSha1: "0".repeat(40) } }],
    ["missing historical approval evidence", { current: { ...input.current, approvalEvidence: [] } }],
    ["unproved cursor", { previous: { ...input.previous, answer: "unproved cursor" } }]
  ];
  for (const [label, change] of cases) assert.throws(() => assertHistoricalNativeHeld({ ...input, ...change }, label, consumer),
    { name: "AssertionError" }, label);
  const uid = input.current.questionUid, page = consumer.pageByUid.get(uid);
  const changedPage = fields => ({ ...consumer, pageByUid: new Map(consumer.pageByUid).set(uid, { ...page, ...fields }) });
  const exposed = [
    ["current verified approval exposure", changedPage({ verifiedEligible: true })],
    ["current automatic selection exposure", changedPage({ automatic: true })],
    ["current classification exposure", changedPage({ problemTypeKey: input.current.problemTypeKey })],
    ["current RPM exposure", changedPage({ rpmPrimaryRecordId: "unproved-rpm" })],
    ["current RPM group exposure", changedPage({ rpmL4: "unproved-rpm-label" })],
    ["unproved projection rejection", changedPage({ metaProjectionFailureReason: "unproved-null" })],
    ["inconsistent current source release", { ...consumer, resolvedBySource: new Map(consumer.resolvedBySource)
      .set(sourceKey(input.source, input.ordinal), { ...consumer.resolvedBySource.get(sourceKey(input.source, input.ordinal)),
        sourceStatus: consumer.resolvedBySource.get(sourceKey(input.source, input.ordinal)).sourceStatus === "VERIFIED" ? "HOLD" : "VERIFIED" }) }]
  ];
  for (const [label, candidate] of exposed) assert.throws(() => assertHistoricalNativeHeld(input, label, candidate),
    { name: "AssertionError" }, label);
  return cases.length + exposed.length;
}

function verifyHistoricalCohorts(index, remember = false) {
  let unchanged = 0, reviewedTransitions = 0, currentHeldTransitions = 0;
  for (const [uid, baseline] of historicalByUid) {
    const entries = index.get(uid) || [];
    assert.strictEqual(entries.length, 1, "historical runtime UID missing/duplicated: " + uid);
    const entry = entries[0], row = entry.row;
    assert.strictEqual(sourceKey(row.sourceArchiveFile, row.sourceOrdinal), sourceKey(baseline.source, baseline.ordinal), uid);
    if (sha256(stable(row)) === baseline.digest && entry.packId === "MIDDLE_GEOMETRY" && entry.status === "ACTIVE") {
      assert.strictEqual(row.metaFoundationPackVersion, baseline.version, uid);
      unchanged += 1;
      continue;
    }
    // A flag or version string is insufficient. Prove a current native approval,
    // or the exact immutable historical approval plus its rejected current
    // Consumer use. The latter never enters the current nativeApprovals map.
    const metadata = currentQuestionMetadata.get(uid);
    // The production verifier also supports exact preservation of an existing
    // META_PIPELINE_AUDIT. It replays the immutable prior audit and reviewed D5
    // receipt; the approval kind alone never authorizes a historical transition.
    assert(metadata && ["FINAL_QA", "REVIEW2", "META_PIPELINE_AUDIT"].includes(metadata.metadataApprovalType), uid);
    const input = nativeInput(metadata, row, entry);
    const verified = assertCurrentOrHistoricalNative(input, "historical reviewed transition: " + uid, remember);
    if (!verified.current) currentHeldTransitions += 1;
    reviewedTransitions += 1;
  }
  assert.strictEqual(unchanged + reviewedTransitions, historicalByUid.size);
  return { unchanged, reviewedTransitions, currentHeldTransitions };
}
const preservedCohorts = verifyHistoricalCohorts(activeRuntimeByUid, true);
const currentReviewedRows = historical.cohorts["1.0.3"].map(([uid]) => activeRuntimeByUid.get(uid)[0]);
const additionalReviewedRows = runtime.records.filter(row => !historicalByUid.has(row.questionUid))
  .map(row => ({ row, packId: runtime.packId, status: runtime.status }));
for (const entry of [...currentReviewedRows, ...additionalReviewedRows]) {
  const row = entry.row;
  const metadata = currentQuestionMetadata.get(row.questionUid);
  assert(metadata, row.questionUid);
  if (["FINAL_QA", "REVIEW2"].includes(metadata.metadataApprovalType) || nativeApprovals.has(row.questionUid)) {
    const input = nativeInput(metadata, row, entry);
    assertCurrentOrHistoricalNative(input, row.questionUid, true);
  } else {
    assert.strictEqual(metadata.metadataApprovalType, "META_PIPELINE_AUDIT", row.questionUid);
    assert(metadata.approvalEvidence.some((file) => file.endsWith(".source-parity.json")), row.questionUid);
  }
  assert.strictEqual(metadata.metadataStatus, "approved_semantic_review", row.questionUid);
  assert.strictEqual(metadata.sourceArchiveFile, row.sourceArchiveFile, row.questionUid);
  assert.strictEqual(Number(metadata.sourceOrdinal), Number(row.sourceOrdinal), row.questionUid);
  assert.strictEqual(metadata.metadataRevision, row.metadataRevision, row.questionUid);
  assert.strictEqual(metadata.sourceFingerprint, row.sourceFingerprint, row.questionUid);
  assert.strictEqual(row.sourceFingerprint, row.approvedSourceFingerprint, row.questionUid);
  assert.strictEqual(metadata.l3Disposition, row.l3Disposition, row.questionUid);
  assert.strictEqual(metadata.l4Disposition, row.l4Disposition, row.questionUid);
  assert.strictEqual(metadata.problemTypeKey, row.problemTypeKey, row.questionUid);
  assert.strictEqual(metadata.templateKey, row.templateKey, row.questionUid);
  assert.deepStrictEqual(metadata.crossConceptKeys, row.crossConceptKeys);
  assert.deepStrictEqual(metadata.conditionKeys, row.conditionKeys);
}

const historicalUid = historical.cohorts["1.0.0"][0][0];
const historicalEntry = activeRuntimeByUid.get(historicalUid)[0];
const invalidCohortCases = [
  ["missing historical UID", []],
  ["duplicate historical UID", [historicalEntry, historicalEntry]],
  ["historical source ordinal drift", [{ ...historicalEntry, row: { ...historicalEntry.row, sourceOrdinal: historicalEntry.row.sourceOrdinal + 1 } }]],
  ["unproved historical version change", [{ ...historicalEntry, row: { ...historicalEntry.row, metaFoundationPackVersion: "999.0.0" } }]],
  ["unproved historical classification change", [{ ...historicalEntry, row: { ...historicalEntry.row, templateKey: "TPL_UNREVIEWED_COHORT_CHANGE" } }]],
];
for (const [label, entries] of invalidCohortCases) {
  const invalid = new Map(activeRuntimeByUid).set(historicalUid, entries);
  assert.throws(() => verifyHistoricalCohorts(invalid), { name: "AssertionError" }, label);
}
console.log(`PASS historical cohorts 904/47/24: ${preservedCohorts.unchanged} unchanged, ${preservedCohorts.reviewedTransitions} byte-bound historical transitions (${preservedCohorts.currentHeldTransitions} currently unavailable for verified metadata); ${invalidCohortCases.length} rejected corruptions`);

if (historicalHeldInputs.length) {
  const representatives = new Map();
  for (const input of historicalHeldInputs) {
    const reason = currentConsumer.pageByUid.get(input.current.questionUid).metaProjectionFailureReason;
    if (!representatives.has(reason)) representatives.set(reason, input);
  }
  let rejected = 0;
  for (const input of representatives.values()) rejected += assertHeldRejectionCases(input, currentConsumer);
  console.log(`PASS ${historicalHeldInputs.length} immutable historical approvals with current native/verified/automatic use rejected; ${rejected} rejected corruptions across ${representatives.size} observed denial policies`);
}

const reviewedInput = nativeInputs.find(input => ["FINAL_QA", "REVIEW2"].includes(input.current.metadataApprovalType));
if (reviewedInput) {
  const input = reviewedInput;
  const rejects = (candidate, label) => {
    assert.throws(() => assertNativeApproval(candidate, label), { name: "AssertionError" }, label);
  };
  const cases = [
    ["approval flag without evidence", { current: { ...input.current, approvalEvidence: [] } }],
    ["metadata differs from receipt", { current: { ...input.current, fieldStatus: { ...input.current.fieldStatus, problemType: "manual_review_pending" } } }],
    ["different UID", { identity: { ...input.identity, questionUid: "unregistered-native-uid" } }],
    ["unknown explicit source UID", { question: { ...input.question, questionUid: "unregistered-explicit-source-uid" } }],
    ["different source ordinal", { identity: { ...input.identity, sourceOrdinal: input.ordinal + 1 } }],
    ["template belongs to another problem type", { registry: { ...input.registry, templates: new Map(input.registry.templates).set(input.current.templateKey, { ...input.registry.templates.get(input.current.templateKey), parentProblemTypeKey: "PT_NOT_THE_REGISTERED_PARENT" }) } }],
    ["changed student payload", { question: { ...input.question, content: "changed student payload fixture" } }],
    ["different source bytes", { nativeSource: { ...input.nativeSource, bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } }],
    ["different Git blob", { nativeSource: { ...input.nativeSource, blobSha1: "0".repeat(40) } }],
    ["runtime differs from receipt", { nativeSource: { ...input.nativeSource, runtimeRecord: { ...input.nativeSource.runtimeRecord, tagStatus: "review_required" } } }],
    ["runtime version differs from receipt", { nativeSource: { ...input.nativeSource, runtimeRecord: { ...input.nativeSource.runtimeRecord, metaFoundationPackVersion: "999.0.0" } } }],
    ["inactive runtime", { nativeSource: { ...input.nativeSource, runtimeStatus: "INACTIVE" } }]
  ];
  for (const [label, changes] of cases) rejects({ ...input, ...changes }, label);

  // Copy an existing approval, never issue a new one. Prove that a readable proof file with
  // changed bytes is rejected even when its receipt and all metadata flags remain intact.
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-native-proof-"));
  try {
    const receiptPath = nativeApprovals.get(input.current.questionUid);
    const receipt = readJson(receiptPath);
    for (const relative of [receiptPath, ...receipt.approval.evidenceRefs.map(ref => ref.path)]) {
      const target = path.resolve(fixtureRoot, relative);
      assert(target.startsWith(fixtureRoot + path.sep), relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const fixture = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    assertNativeApproval(fixture, "unchanged copied native proof");
    fs.appendFileSync(path.join(fixtureRoot, receipt.approval.evidenceRefs[0].path), "\n");
    rejects(fixture, "approval proof SHA drift");
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log(`PASS ${nativeInputs.length} byte-bound native approvals and ${cases.length + 1} rejection cases`);
}

const preservedAuditInputs = nativeInputs.filter(input => input.current.metadataApprovalType === "META_PIPELINE_AUDIT");
for (const input of preservedAuditInputs) {
  const changes = [
    { current: { ...input.current, approvalEvidence: [] } },
    { current: { ...input.current, metadataApprovalType: "FINAL_QA" } },
    { current: { ...input.current, metadataRevision: input.current.metadataRevision + ":unproved" } },
    { current: { ...input.current, fieldStatus: { ...input.current.fieldStatus, problemType: "approved_final_qa" } } },
    { nativeSource: { ...input.nativeSource, bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } },
    { nativeSource: { ...input.nativeSource, runtimeRecord: { ...input.nativeSource.runtimeRecord, metadataApprovalType: "FINAL_QA" } } },
    { nativeSource: { ...input.nativeSource, runtimeStatus: "INACTIVE" } }
  ];
  for (const change of changes) assert.throws(() => assertNativeApproval({ ...input, ...change }, "audit preservation corruption"),
    { name: "AssertionError" });
}
console.log(`PASS ${preservedAuditInputs.length} exact historical audit preservations; ${preservedAuditInputs.length * 7} rejected corruptions`);

const byUid = new Map(catalog.records.map((row) => [row.questionUid, row]));
const bySource = new Map(catalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
assert.strictEqual(runtime.records.filter((row) => {
  const direct = byUid.get(row.questionUid);
  const source = bySource.get(sourceKey(row.sourceArchiveFile, row.sourceOrdinal));
  return direct && source && direct.questionUid === source.questionUid &&
    sourceKey(direct.sourceFile, direct.sourceOrdinal) === sourceKey(row.sourceArchiveFile, row.sourceOrdinal);
}).length, runtime.records.length);

const activePT = new Map(taxonomy.problemTypes.filter((row) => row.status === "ACTIVE").map((row) => [row.problemTypeKey, row]));
const bindingKeys = new Set(bindings.bindings.map((row) => [row.curriculum, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join("|")));
const activeTemplates = new Map(taxonomy.templates.filter((row) => row.status === "ACTIVE").map((row) => [row.templateKey, row]));
const activeConcepts = new Set(concepts.concepts.filter((row) => row.status === "ACTIVE").map((row) => row.conceptKey));
const activeConditions = new Set(conditions.conditions.filter((row) => row.status === "ACTIVE").map((row) => row.conditionKey));
for (const row of runtime.records) {
  if (row.metaFoundationL3Status === "FINAL") {
    assert(bindingKeys.has([row.curriculumKey, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join("|")), row.questionUid);
  }
  if (row.metaFoundationL3Status === "ROUTE_OUT") {
    assert.strictEqual(row.problemTypeKey, null);
    assert.strictEqual(row.templateKey, null);
    assert.strictEqual(row.defaultSelectable, false);
  } else {
    assert(activePT.has(row.problemTypeKey), row.problemTypeKey);
    if (row.metaFoundationL4Status === "FINAL") {
      assert(activeTemplates.has(row.templateKey), row.templateKey);
      assert.strictEqual(activeTemplates.get(row.templateKey).parentProblemTypeKey, row.problemTypeKey);
  } else if (row.metaFoundationL4Status === "EXPLICIT_HOLD") {
    assert.strictEqual(row.templateKey, null);
    assert.strictEqual(row.defaultSelectable, false);
  } else {
    assert(["1.0.2", "1.0.3"].includes(row.metaFoundationPackVersion) ||
      currentQuestionMetadata.get(row.questionUid)?.metadataApprovalType === "META_PIPELINE_AUDIT" ||
      nativeApprovals.has(row.questionUid) || historicalHeldApprovals.has(row.questionUid), row.questionUid);
    assert.strictEqual(row.l4Disposition, "ASSIGNED", row.questionUid);
    assert(activeTemplates.has(row.templateKey), row.templateKey);
    }
  }
  for (const key of row.crossConceptKeys || []) assert(activeConcepts.has(key), key);
  for (const key of row.conditionKeys || []) assert(activeConditions.has(key), key);
  if (row.reviewStatus === "manual_review") assert.strictEqual(row.defaultSelectable, false, row.questionUid);
}

const uid513 = "qid_v1_e4ba2b9da32f044d69365ba770f627de7a5c507022acc721246243608a99f94a";
const q513 = runtime.records.find((row) => row.questionUid === uid513);
assert(q513);
assert.strictEqual(q513.standardUnitKey, "M3-05");
assert.strictEqual(q513.subUnitKey, "M3-05-TRIG_RATIO_APPLICATION");
assert.strictEqual(q513.problemTypeKey, "PT_TRIG_RATIO_APPLICATION");
assert.strictEqual(q513.templateKey, "TPL_TRIG_APPLICATION_DIRECT_MEASURE");

const globalRuntime = [
  "geometry-equations-v1.json", "sets-propositions-v1.json", "functions-graphs-v1.json",
  "limit-continuity-v1.json", "integral-calculus-v1.json", "derivative-v1.json",
  "probability-statistics-v1.json", "middle-geometry-v1.json"
].flatMap((name) => readJson("archive/data/meta-foundation/runtime/" + name).records);
assert.strictEqual(new Set(globalRuntime.map((row) => row.questionUid)).size, globalRuntime.length);
assert.strictEqual(new Set(globalRuntime.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, globalRuntime.length);

const maesan = catalog.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_기출.js"));
assert.strictEqual(maesan.length, 23);

console.log("PASS Middle Geometry production runtime, canonical joins, HOLD/ROUTE_OUT policy, and Archive2 join");


  const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');
  const { data: overlaid, runtime: liveRuntime } = await productionCatalog();
  const runtimeUids = new Set(runtime.records.map(row => row.questionUid));
  const liveRows = liveRuntime.records.filter(row => runtimeUids.has(row.questionUid));
  assert.deepStrictEqual(JSON.parse(JSON.stringify(liveRows)), runtime.records);
  const joined = overlaid.records.filter(row => runtimeUids.has(row.questionUid));
  assert.strictEqual(joined.length, runtime.records.length);
  assert.strictEqual(new Set(joined.map((row) => row.questionUid)).size, runtime.records.length);
  assert.strictEqual(new Set(joined.map((row) => sourceKey(row.sourceFile, row.sourceOrdinal))).size, runtime.records.length);
  const { catalog: canonicalCatalog } = require('./helpers/archive2-scope-harness.cjs');
  const expected = new Map(canonicalCatalog.records.map(row => [row.questionUid, row]));
  for (const row of joined) {
    const currentGate = Archive2Core.eligibility(row, { catalog: overlaid });
    assert.deepStrictEqual(currentGate, Archive2Core.eligibility(expected.get(row.questionUid), { catalog: canonicalCatalog }));
    assert.strictEqual(Archive2Core.eligibility(row).ok, false);
  }
  assert.strictEqual(overlaid.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_기출.js")).length, 23);
  console.log(`PASS live Meta Foundation bridge preserves ${runtime.records.length} runtime overlays and joins`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
