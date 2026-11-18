const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const Archive2Core = require("../archive/archive2-core.js");
const { createIssuedApprovalObserver, readOriginalNativeSource, assertOriginalNativeSourceBytes,
  readRhsOriginalNativeSource, assertRhsOriginalNativeSourceBytes,
  readOriginalReceiptSource, assertOriginalReceiptSourceBytes, assertM2E006TypedProfile } = require("./helpers/middle-geometry-issued-approval.cjs");

// Node rejects a string as the second assert.throws argument (ERR_AMBIGUOUS_ARGUMENT) whenever the thrown
// message equals that string, and otherwise treats it only as a failure message. The
// negative cases therefore pass a validator: the refusal must be a real Error (an
// AssertionError, fs or git refusal), never a TypeError/ReferenceError/SyntaxError/RangeError
// produced by a broken fixture, and the case label stays the not-thrown failure message.
const isRefusalError = error => error instanceof Error &&
  !(error instanceof TypeError || error instanceof ReferenceError || error instanceof SyntaxError || error instanceof RangeError);

async function main() {
const { loadBank, nativeReviewReceipt, planQuestion, activeBindingContext, sourceFingerprint, sourcePath } = await import("../archive/tools/meta-foundation/auto-register-merged-source.mjs");
const { loadActiveMetaRegistry, validateActiveMetaFields } = await import("../archive/tools/meta-foundation/active-registry.mjs");
const { isUnambiguousLegacySourceUidAlias } = await import("../archive/tools/intelligence/question-identity-contract.mjs");
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

const metadataRows = readJson("archive/data/question_metadata.json").records;
const currentQuestionMetadata = new Map(metadataRows.map((row) => [row.questionUid, row]));
assert.strictEqual(currentQuestionMetadata.size, metadataRows.length, "metadata UID must be unique");
assert.strictEqual(new Set(metadataRows.map(row => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size,
  metadataRows.length, "metadata source identity must be unique");
const identityMap = readJson("archive/data/question_identity_map.json");
const identityByUid = new Map(identityMap.records.map((row) => [row.questionUid, row]));
const identityByJoin = new Map(identityMap.records.map((row) => [sourceKey(row.sourceArchiveFile, row.sourceOrdinal), row]));
assert.strictEqual(identityByUid.size, identityMap.records.length, "identity UID must be unique");
assert.strictEqual(identityByJoin.size, identityMap.records.length, "identity source identity must be unique");
const registry = loadActiveMetaRegistry(root);
assert.strictEqual(registry.status, "ACTIVE", registry.errors.join("|"));
const nativeSources = new Map();
// Current Native success is kept separate from historical issued-state retention.
const nativeApprovals = new Map(), issuedApprovals = new Map(), retainedApprovals = new Map();
const nativeInputs = [], retainedInputs = [];
const issuedObserverApi = {
  nativeReviewReceipt, planQuestion, validateActiveMetaFields, activeBindingContext,
  loadBank, sourceFingerprint, isUnambiguousLegacySourceUidAlias,
  currentRows(uid) {
    const entries = activeRuntimeByUid.get(uid) || [];
    assert.strictEqual(entries.length, 1, "retained source-pair runtime UID must be unique");
    return { metadata: currentQuestionMetadata.get(uid), identity: identityByUid.get(uid),
      runtime: entries[0].row, runtimeStatus: entries[0].status, runtimeOwner: entries[0].packId };
  }
};
const issuedObserver = createIssuedApprovalObserver(issuedObserverApi);
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

function assertReviewedState(input, label) {
  try {
    return { receiptPath: assertNativeApproval(input, label), currentNativeReady: true };
  } catch (error) {
    if (!(error instanceof assert.AssertionError)) throw error;
    // This is an independently checked issued-state assertion, not a Native
    // fallback approval. Unknown nulls, changed evidence/rows/owners and new
    // post-anchor approvals still throw. The original producer must refuse.
    const retained = issuedObserver.assertBlocked(input, label);
    return { receiptPath: retained.receiptPath, currentNativeReady: false, retained };
  }
}
function rememberReviewedState(input, state) {
  const uid = input.current.questionUid;
  issuedApprovals.set(uid, state.receiptPath);
  if (state.currentNativeReady) {
    assert(!retainedApprovals.has(uid), "current readiness changed during read-only test: " + uid);
    nativeApprovals.set(uid, state.receiptPath);
    if (!nativeInputs.some(value => value.current.questionUid === uid)) nativeInputs.push(input);
  } else {
    assert(!nativeApprovals.has(uid), "current readiness changed during read-only test: " + uid);
    retainedApprovals.set(uid, state.retained);
    if (!retainedInputs.some(value => value.current.questionUid === uid)) retainedInputs.push(input);
  }
}

function verifyHistoricalCohorts(index, remember = false) {
  let unchanged = 0, reviewedTransitions = 0, currentNativeReady = 0, retainedBlocked = 0;
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
    // A flag or version is insufficient. Current Native reuse must pass the
    // original verifier. Retention after the observed renderer change additionally
    // requires immutable issued receipt/evidence and exact current MD/ID/runtime;
    // it is counted separately and never grants current source reuse.
    const metadata = currentQuestionMetadata.get(uid);
    // The production verifier also supports exact preservation of an existing
    // META_PIPELINE_AUDIT. It replays the immutable prior audit and reviewed D5
    // receipt; the approval kind alone never authorizes a historical transition.
    assert(metadata && ["FINAL_QA", "REVIEW2", "META_PIPELINE_AUDIT"].includes(metadata.metadataApprovalType), uid);
    const input = nativeInput(metadata, row, entry);
    const state = assertReviewedState(input, "historical reviewed transition: " + uid);
    if (remember) rememberReviewedState(input, state);
    if (state.currentNativeReady) currentNativeReady += 1; else retainedBlocked += 1;
    reviewedTransitions += 1;
  }
  assert.strictEqual(unchanged + reviewedTransitions, historicalByUid.size);
  assert.strictEqual(currentNativeReady + retainedBlocked, reviewedTransitions);
  return { unchanged, reviewedTransitions, currentNativeReady, retainedBlocked };
}
// Approval kinds an additional runtime row may carry besides FINAL_QA/REVIEW2 (handled by the
// native reviewed-state path). MAIN_MERGE is the automatic registrar's ordinary path for a
// merged exam source (auto-register-merged-source.mjs): it records registered_merged_source /
// review_required and claims no independent review. The allowed kinds are this explicit set;
// each needs its own paired status and evidence, and any other combination is refused.
const AUTO_RECEIPT_DIR = ".archive-meta-register/auto/receipts/";
function assertAdditionalRowApproval(metadata, row) {
  const uid = row.questionUid;
  const type = metadata.metadataApprovalType;
  assert(["META_PIPELINE_AUDIT", "MAIN_MERGE"].includes(type), "unsupported additional-row approval type " + type + ": " + uid);
  if (type === "META_PIPELINE_AUDIT") {
    assert.strictEqual(metadata.metadataStatus, "approved_semantic_review", uid);
    assert((metadata.approvalEvidence || []).some((file) => file.endsWith(".source-parity.json")), uid);
    return;
  }
  assert.strictEqual(metadata.metadataStatus, "registered_merged_source", uid);
  assert.strictEqual(metadata.reviewStatus, "review_required", uid);
  assert.strictEqual(metadata.metadataRegistrationStatus, "REGISTERED", uid);
  assert.strictEqual(metadata.metadataRegistrationBasis, "MAIN_MERGED_EXPLICIT_METADATA", uid);
  assert.strictEqual(row.metadataApprovalType, "MAIN_MERGE", uid);
  const receiptPaths = (metadata.registrationEvidence || []).filter((file) => file.startsWith(AUTO_RECEIPT_DIR));
  assert.strictEqual(receiptPaths.length, 1, "MAIN_MERGE row needs exactly one auto-registrar receipt: " + uid);
  const receipt = readJson(receiptPaths[0]);
  assert.strictEqual(receiptPaths[0], AUTO_RECEIPT_DIR + receipt.requestId + ".json", uid);
  assert.strictEqual(receipt.questionUid, uid);
  assert.strictEqual(receipt.approvalBasis, "MAIN_MERGED_EXPLICIT_METADATA", uid);
  assert.strictEqual(receipt.independentReviewClaim, false, uid);
  assert.strictEqual(receipt.metadataRegistrationStatus, "REGISTERED", uid);
  assert.strictEqual(metadata.metadataRevision, "archive-main-merge-meta-v1:" + receipt.requestId, uid);
}

const preservedCohorts = verifyHistoricalCohorts(activeRuntimeByUid, true);
const currentReviewedRows = historical.cohorts["1.0.3"].map(([uid]) => activeRuntimeByUid.get(uid)[0]);
const additionalReviewedRows = runtime.records.filter(row => !historicalByUid.has(row.questionUid))
  .map(row => ({ row, packId: runtime.packId, status: runtime.status }));
for (const entry of [...currentReviewedRows, ...additionalReviewedRows]) {
  const row = entry.row;
  const metadata = currentQuestionMetadata.get(row.questionUid);
  assert(metadata, row.questionUid);
  if (["FINAL_QA", "REVIEW2"].includes(metadata.metadataApprovalType) || issuedApprovals.has(row.questionUid)) {
    const input = nativeInput(metadata, row, entry);
    rememberReviewedState(input, assertReviewedState(input, row.questionUid));
    assert.strictEqual(metadata.metadataStatus, "approved_semantic_review", row.questionUid);
  } else {
    assertAdditionalRowApproval(metadata, row);
  }
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
console.log(`PASS historical cohorts 904/47/24: ${preservedCohorts.unchanged} unchanged, ${preservedCohorts.reviewedTransitions} issued transitions (${preservedCohorts.currentNativeReady} current Native READY, ${preservedCohorts.retainedBlocked} retained approval/current reuse BLOCKED); ${invalidCohortCases.length} rejected corruptions`);

const reviewedInput = nativeInputs.find(input => ["FINAL_QA", "REVIEW2"].includes(input.current.metadataApprovalType));
assert(reviewedInput, "at least one current Native FINAL_QA/REVIEW2 positive is required; retained BLOCKED rows cannot substitute");
{
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
  let copiedDependencyRejections = 0;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-native-proof-"));
  try {
    // Preserved approvals replay their immutable Git ancestry as well as the
    // copied evidence files. Give this isolated fixture read-only access to the
    // same object history; its proof bytes remain independent mutable copies.
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"] });
    const receiptPath = nativeApprovals.get(input.current.questionUid);
    const receipt = readJson(receiptPath);
    // A preservation receipt also verifies its predecessor's evidence. Copy the
    // declared receipt closure so the positive fixture has the same immutable
    // inputs as the real checkout; all proof bytes remain independent copies.
    const copiedProofs = new Map();
    const nativeReceiptPrefix = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
    const copyProof = (relative, expectedSha256, depth = 0) => {
      const target = path.resolve(fixtureRoot, relative);
      assert(target.startsWith(fixtureRoot + path.sep), relative);
      const original = path.resolve(root, relative);
      assert(original.startsWith(root + path.sep), relative);
      const bytes = fs.readFileSync(original);
      const digest = sha256(bytes);
      if (expectedSha256 !== undefined) assert.strictEqual(digest, expectedSha256, relative);
      if (copiedProofs.has(relative)) {
        assert.strictEqual(copiedProofs.get(relative).digest, digest, relative);
        return;
      }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(original, target);
      assert.strictEqual(sha256(fs.readFileSync(target)), digest, relative);
      const document = relative.startsWith(nativeReceiptPrefix) && relative.endsWith(".json")
        ? JSON.parse(bytes) : null;
      const nativeReceipt = document?.schemaVersion === "archive-reviewed-exam-meta-registration-v2";
      copiedProofs.set(relative, { digest, depth, nativeReceipt });
      if (nativeReceipt) {
        for (const ref of document.approval.evidenceRefs) copyProof(ref.path, ref.sha256, depth + 1);
      }
    };
    copyProof(receiptPath);
    const fixture = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    assertNativeApproval(fixture, "unchanged copied native proof");
    const inheritedProof = [...copiedProofs].find(([, value]) => value.depth > 1 && !value.nativeReceipt);
    if (inheritedProof) {
      const inheritedPath = path.join(fixtureRoot, inheritedProof[0]);
      const originalBytes = fs.readFileSync(inheritedPath);
      fs.appendFileSync(inheritedPath, "\n");
      rejects(fixture, "predecessor approval proof SHA drift");
      copiedDependencyRejections += 1;
      fs.writeFileSync(inheritedPath, originalBytes);
      assertNativeApproval(fixture, "restored copied native proof");
    }
    fs.appendFileSync(path.join(fixtureRoot, receipt.approval.evidenceRefs[0].path), "\n");
    rejects(fixture, "approval proof SHA drift");
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log(`PASS ${nativeInputs.length} byte-bound native approvals and ${cases.length + 1 + copiedDependencyRejections} rejection cases`);
}

const uiRetainedInputs = retainedInputs.filter(input => retainedApprovals.get(input.current.questionUid).kind === "ISSUED_TYPED_UI");
if (uiRetainedInputs.length) {
  const input = uiRetainedInputs[0], baseline = retainedApprovals.get(input.current.questionUid);
  const rejectsRetained = (candidate, label) =>
    assert.throws(() => issuedObserver.assertRetained(candidate, label), { name: "AssertionError" }, label);
  const cases = [
    ["retained metadata whole changed", { current: { ...input.current, fieldStatus: { ...input.current.fieldStatus, problemType: "manual_review_pending" } } }],
    ["retained approval kind changed", { current: { ...input.current, metadataApprovalType: input.current.metadataApprovalType === "REVIEW2" ? "FINAL_QA" : "REVIEW2" } }],
    ["retained evidence list removed", { current: { ...input.current, approvalEvidence: [] } }],
    ["retained identity whole changed", { identity: { ...input.identity, sourceFingerprint: "0".repeat(64) } }],
    ["retained UID changed", { identity: { ...input.identity, questionUid: "qid_v1_" + "0".repeat(64) } }],
    ["retained ordinal changed", { identity: { ...input.identity, sourceOrdinal: input.ordinal + 1 } }],
    ["retained duplicate identity", { nativeSource: { ...input.nativeSource,
      identityMap: { ...input.nativeSource.identityMap, records: [...input.nativeSource.identityMap.records, input.identity] } } }],
    ["retained runtime whole changed", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, metadataRevision: input.nativeSource.runtimeRecord.metadataRevision + ":changed" } } }],
    ["retained runtime version changed", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, metaFoundationPackVersion: "999.0.0" } } }],
    ["retained runtime owner changed", { runtimeOwner: "MIDDLE1" }],
    ["retained inactive runtime", { nativeSource: { ...input.nativeSource, runtimeStatus: "INACTIVE" } }],
    ["retained ACTIVE owner changed", { registry: { ...input.registry,
      templates: new Map(input.registry.templates).set(input.current.templateKey,
        { ...input.registry.templates.get(input.current.templateKey), ownerPack: "NOT_THE_ISSUED_OWNER" }) } }],
    ["retained ACTIVE binding ambiguous", { registry: { ...input.registry,
      bindingRows: [...input.registry.bindingRows, baseline.context.binding] } }],
    ["retained unissued receipt revision", { current: { ...input.current,
      metadataRevision: input.current.metadataRevision + "-not-issued-in-anchor" } }]
  ];
  for (const [label, changes] of cases) rejectsRetained({ ...input, ...changes }, label);
  // A current Native positive cannot be recounted as an accepted null or BLOCKED
  // result. The helper never supplies a receipt to the production registration path.
  assert.throws(() => issuedObserver.assertBlocked(reviewedInput, "current Native positive cannot become retained BLOCKED"));

  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-retained-proof-"));
  try {
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"] });
    // Only already-read exact dependencies of this issued row are copied.
    // No global registry, metadata, identity or runtime is generated or rewritten.
    for (const relative of baseline.readPaths) {
      const target = path.resolve(fixtureRoot, relative);
      assert(target.startsWith(fixtureRoot + path.sep), relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const candidate = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    const copiedInputs = issuedObserver.assertKnownInputs(candidate, "unchanged copied declared-input closure");
    assert.deepStrictEqual(copiedInputs.authenticatedDrifts, baseline.authenticatedDrifts,
      "the negative fixture keeps the same exact known renderer differences");
    const evidencePath = baseline.receipt.approval.evidenceRefs[0].path;
    const evidenceFile = path.join(fixtureRoot, evidencePath), originalEvidence = fs.readFileSync(evidenceFile);
    fs.appendFileSync(evidenceFile, "\n");
    rejectsRetained(candidate, "retained evidence bytes changed");
    fs.writeFileSync(evidenceFile, originalEvidence);
    issuedObserver.assertRetained(candidate, "restored copied retained proof");
    const receiptFile = path.join(fixtureRoot, baseline.receiptPath), originalReceipt = fs.readFileSync(receiptFile);
    fs.appendFileSync(receiptFile, "\n");
    rejectsRetained(candidate, "retained receipt bytes changed");
    fs.writeFileSync(receiptFile, originalReceipt);
    const bindingFile = path.join(fixtureRoot, baseline.bindingPath), originalBinding = fs.readFileSync(bindingFile);
    fs.appendFileSync(bindingFile, "\n");
    rejectsRetained(candidate, "retained typed binding bytes changed");
    fs.writeFileSync(bindingFile, originalBinding);
    fs.unlinkSync(evidenceFile);
    fs.symlinkSync(path.join(root, evidencePath), evidenceFile);
    rejectsRetained(candidate, "retained same-byte evidence symlink");
    fs.unlinkSync(evidenceFile);
    fs.writeFileSync(evidenceFile, originalEvidence);
    issuedObserver.assertKnownInputs(candidate, "restored declared-input closure before unknown-drift negatives");
    const refusesUnknownDependency = label => assert.throws(
      () => issuedObserver.assertKnownInputs(candidate, label), isRefusalError, label);
    const cssPaths = [
      "archive/archive2-reader-controls.css",
      "archive/css/js-archive-theme-override.css"
    ];
    const cssDrifts = baseline.authenticatedDrifts.filter(value => cssPaths.includes(value.path));
    assert.deepStrictEqual(cssDrifts.map(value => value.path).sort(), cssPaths,
      "both exact observed CSS changes belong to this issued technical inventory");
    for (const drift of cssDrifts) {
      const file = path.join(fixtureRoot, drift.path), currentBytes = fs.readFileSync(file);
      assert.strictEqual(sha256(currentBytes), drift.current.sha256, drift.path);
      fs.appendFileSync(file, "\n");
      assert.throws(() => issuedObserver.assertKnownInputs(candidate, "unobserved CSS edition"),
        /unknown live renderer change/, "a known path does not permit changed CSS bytes");
      fs.writeFileSync(file, currentBytes);
      const capturedBytes = execFileSync("git", ["-C", root, "cat-file", "blob", drift.captured.gitBlobSha1],
        { stdio: ["ignore", "pipe", "pipe"] });
      assert.strictEqual(sha256(capturedBytes), drift.captured.sha256, drift.path);
      fs.writeFileSync(file, capturedBytes);
      assert.throws(() => issuedObserver.assertKnownInputs(candidate, "captured CSS restored in current fixture"),
        /unknown live renderer change/, "old CSS cannot masquerade as the exact observed current edition");
      fs.writeFileSync(file, currentBytes);
    }
    const fontPath = baseline.declaredInputs.fontPaths.find(relative => relative.endsWith(".woff2"));
    const assetPath = baseline.declaredInputs.assetPaths[0];
    assert(fontPath && assetPath, "actual issued typed UI must declare a font and an asset");
    for (const [kind, relative] of [["font", fontPath], ["asset", assetPath]]) {
      const file = path.join(fixtureRoot, relative), original = fs.readFileSync(file);
      fs.unlinkSync(file);
      refusesUnknownDependency("known renderer drift plus unknown " + kind + " deletion");
      fs.writeFileSync(file, original);
      fs.appendFileSync(file, "\n");
      refusesUnknownDependency("known renderer drift plus unknown " + kind + " byte change");
      fs.writeFileSync(file, original);
      fs.unlinkSync(file);
      fs.symlinkSync(path.join(root, relative), file);
      refusesUnknownDependency("known renderer drift plus same-byte " + kind + " symlink");
      fs.unlinkSync(file);
      fs.writeFileSync(file, original);
    }
    const fontParent = path.dirname(path.join(fixtureRoot, fontPath)), savedParent = fontParent + ".retained-negative";
    fs.renameSync(fontParent, savedParent);
    fs.symlinkSync(savedParent, fontParent, "dir");
    refusesUnknownDependency("known renderer drift plus same-byte parent-directory symlink");
    fs.unlinkSync(fontParent); fs.renameSync(savedParent, fontParent);
    const masterFile = path.join(fixtureRoot, "archive/data/master_tables/js_archive_tag_master.json");
    const masterBytes = fs.readFileSync(masterFile);
    fs.appendFileSync(masterFile, "\n");
    refusesUnknownDependency("known renderer drift plus unknown master change");
    fs.writeFileSync(masterFile, masterBytes);
    const svgFile = path.join(fixtureRoot, "archive/data/svg-accessibility-index.js"), svgBytes = fs.readFileSync(svgFile);
    fs.appendFileSync(svgFile, "\n");
    refusesUnknownDependency("known renderer drift plus unknown generated-index wrapper");
    fs.writeFileSync(svgFile, svgBytes);
    fs.unlinkSync(svgFile); fs.symlinkSync(path.join(root, "archive/data/svg-accessibility-index.js"), svgFile);
    refusesUnknownDependency("known renderer drift plus same-byte generated-index symlink");
    fs.unlinkSync(svgFile); fs.writeFileSync(svgFile, svgBytes);
    const restoredInputs = issuedObserver.assertKnownInputs(candidate, "restored entire copied input closure");
    assert.deepStrictEqual(restoredInputs.declaredInputs, baseline.declaredInputs);
    assert.deepStrictEqual(restoredInputs.authenticatedDrifts, baseline.authenticatedDrifts);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log("PASS " + uiRetainedInputs.length + " immutable typed-UI issued approvals retained; current Native reuse BLOCKED, new approvals 0; " +
    (cases.length + 19) + " rejected corruptions");
}
// This is the separate M2 E006 two-item UI schema, not the M3 E00612
// original-receipt cohort. Test its closed evidence-pair bridge independently.
const m2E006Inputs = retainedInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).typedProfile === "EXACT_M2_E006_Q3_Q21");
assert.deepStrictEqual(m2E006Inputs.map(input => input.ordinal).sort((a, b) => a - b), [3, 21]);
let m2E006Negatives = 0;
for (const input of m2E006Inputs) {
  const kept = retainedApprovals.get(input.current.questionUid);
  const repair = kept.receipt.fingerprintRepairs.find(row => row.questionUid === input.current.questionUid);
  const profile = assertM2E006TypedProfile(input, kept, repair);
  assert.strictEqual(profile.questionUid, input.current.questionUid);
  assert.strictEqual(kept.declaredInputs.inventorySize, 109);
  assert.strictEqual(kept.declaredInputs.selectedSvg.assetPaths.length, 1);
  assert(kept.originalE006Inputs.length > 0);
  const reject = (candidate, retained, proof, label) => {
    assert.throws(() => assertM2E006TypedProfile(candidate, retained, proof), isRefusalError, label);
    m2E006Negatives++;
  };
  reject({ ...input, source: input.source.replace("/m2/", "/m3/") }, kept, repair, "M3 E006 is not M2 E006");
  reject({ ...input, ordinal: input.ordinal + 1 }, kept, repair, "only the exact two ordinals");
  reject({ ...input, current: { ...input.current, questionUid: "qid_v1_" + "0".repeat(64) } },
    kept, repair, "unknown UID cannot use the E006 UI evidence pair");
  reject(input, { ...kept, receipt: { ...kept.receipt, requestId: kept.receipt.requestId + "-unknown" } },
    repair, "no new receipt profile");
  reject(input, { ...kept, live: relative => Buffer.concat([kept.live(relative), Buffer.from("\n")]) },
    repair, "changed issued receipt bytes");
  reject(input, { ...kept, sourceChangedSinceAnchor: true }, repair, "no E006 source-edition exemption");
  reject({ ...input, nativeSource: { ...input.nativeSource, bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } },
    kept, repair, "changed current whole source");
  reject({ ...input, nativeSource: { ...input.nativeSource, bank: input.nativeSource.bank.slice(1) } },
    kept, repair, "changed bank denominator");
  for (const change of [
    proof => { proof.m2E006ProblemContinuity.ui.technicalRef.sha256 = "0".repeat(64); },
    proof => { proof.m2E006ProblemContinuity.ui.visualRef.path += ".other"; },
    proof => { proof.m2E006ProblemContinuity.ui.technicalRef.commit = profile.technicalRef.commit; },
    proof => { proof.m2E006ProblemContinuity.nativeReviewedSource.gitBlobSha1 = "0".repeat(40); },
    proof => { proof.m2E006ProblemContinuity.nativeAssets[0].sha256 = "0".repeat(64); },
    proof => { proof.m2E006ProblemContinuity.ui.logicalCases = 48; }
  ]) {
    const sourceReview = structuredClone(repair.sourceReview); change(sourceReview);
    reject(input, kept, { ...repair, sourceReview }, "the original whole typed proof cannot change");
  }
}
{
  const input = m2E006Inputs[0], baseline = retainedApprovals.get(input.current.questionUid);
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-e006-dependencies-"));
  try {
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" } });
    for (const relative of baseline.readPaths) {
      const target = path.join(fixtureRoot, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const candidate = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    issuedObserver.assertKnownInputs(candidate, "complete exact E006 input copy");
    const repair = baseline.receipt.fingerprintRepairs.find(row => row.questionUid === input.current.questionUid);
    const originalAsset = repair.sourceReview.m2E006ProblemContinuity.nativeAssets.find(ref => ref.path.endsWith(".png"));
    assert(originalAsset, "old native renderer remains a required live input");
    const target = path.join(fixtureRoot, originalAsset.path), bytes = fs.readFileSync(target);
    fs.unlinkSync(target);
    assert.throws(() => issuedObserver.assertKnownInputs(candidate, "known renderer plus absent original asset"));
    fs.writeFileSync(target, Buffer.concat([bytes, Buffer.from("\n")]));
    assert.throws(() => issuedObserver.assertKnownInputs(candidate, "known renderer plus changed original asset"));
    fs.unlinkSync(target); fs.symlinkSync(path.join(root, originalAsset.path), target);
    assert.throws(() => issuedObserver.assertKnownInputs(candidate, "known renderer plus same-byte original-asset symlink"));
    fs.unlinkSync(target); fs.writeFileSync(target, bytes);
    const restored = issuedObserver.assertKnownInputs(candidate, "restored original E006 asset and full closure");
    assert.deepStrictEqual(restored.originalE006Inputs, baseline.originalE006Inputs);
    m2E006Negatives += 3;
  } finally { fs.rmSync(fixtureRoot, { recursive: true, force: true }); }
}
console.log("PASS fixed M2 E006 Q3/Q21 issued-UI retention inputs, current Native remains BLOCKED; " +
  m2E006Negatives + " closed-profile/dependency negatives; new approvals 0");

const sourceRetainedInputs = retainedInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).kind === "EXACT_E017_Q11_Q15_SOURCE_PRESERVATION");
if (sourceRetainedInputs.length) {
  const input = sourceRetainedInputs[0], baseline = retainedApprovals.get(input.current.questionUid);
  const rejects = (candidate, label) => assert.throws(() => issuedObserver.assertKnownInputs(candidate, label), isRefusalError, label);
  const changedBank = structuredClone(input.nativeSource.bank);
  changedBank[input.ordinal - 1] = { ...changedBank[input.ordinal - 1], content: "unapproved selected-source fixture" };
  const cases = [
    ["source-pair metadata whole changed", { current: { ...input.current, fieldStatus: { ...input.current.fieldStatus, problemType: "manual_review_pending" } } }],
    ["source-pair identity UID changed", { identity: { ...input.identity, questionUid: "qid_v1_" + "f".repeat(64) } }],
    ["source-pair runtime whole changed", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, metaFoundationPackVersion: "999.0.0" } } }],
    ["source-pair approval evidence removed", { current: { ...input.current, approvalEvidence: [] } }],
    ["source-pair ACTIVE owner changed", { runtimeOwner: "MIDDLE1" }],
    ["source-pair ordinal changed", { identity: { ...input.identity, sourceOrdinal: input.ordinal + 1 } }],
    ["source-pair unissued child revision", { current: { ...input.current,
      metadataRevision: input.current.metadataRevision + "-unissued" } }],
    ["source-pair question and bank do not match actual source bytes", {
      question: changedBank[input.ordinal - 1], previous: changedBank[input.ordinal - 1],
      nativeSource: { ...input.nativeSource, bank: changedBank } }]
  ];
  for (const [label, changes] of cases) rejects({ ...input, ...changes }, label);
  const otherUid = baseline.declaredInputs.selectedSource.subjects
    .find(value => value.questionUid !== input.current.questionUid).questionUid;
  const other = issuedObserverApi.currentRows(otherUid);
  const companionChanges = [
    { metadata: { ...other.metadata, metadataRevision: other.metadata.metadataRevision + ":changed" } },
    { identity: { ...other.identity, sourceFingerprint: "0".repeat(64) } },
    { runtime: { ...other.runtime, tagStatus: "review_required" } },
    { runtimeOwner: "MIDDLE1" }
  ];
  for (const changes of companionChanges) {
    const observer = createIssuedApprovalObserver({ ...issuedObserverApi, currentRows(uid) {
      const actual = issuedObserverApi.currentRows(uid);
      return uid === otherUid ? { ...actual, ...changes } : actual;
    } });
    assert.throws(() => observer.assertKnownInputs(input, "the other member of the issued pair must also remain exact"));
  }
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-source-pair-"));
  let fileRejections = 0;
  try {
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"] });
    for (const relative of baseline.readPaths) {
      const target = path.resolve(fixtureRoot, relative);
      assert(target.startsWith(fixtureRoot + path.sep), relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const candidate = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    const copied = issuedObserver.assertKnownInputs(candidate, "unchanged copied source-pair proof closure");
    assert.deepStrictEqual(copied.declaredInputs, baseline.declaredInputs);
    const refuseFile = (value, label) => { rejects(value, label); fileRejections += 1; };
    const priorPath = baseline.receipt.approval.sourceRebind.priorReceiptRef.path;
    const priorFile = path.join(fixtureRoot, priorPath), priorBytes = fs.readFileSync(priorFile);
    const prior = JSON.parse(priorBytes), originalSourceBytes = readOriginalNativeSource(fixtureRoot, prior);
    assert.strictEqual(sha256(originalSourceBytes), baseline.declaredInputs.originalNativeSource.sha256);
    assert.throws(() => assertOriginalNativeSourceBytes(
      Buffer.concat([originalSourceBytes, Buffer.from("\n")]), prior),
      /ISSUED_RETENTION:ORIGINAL_NATIVE_SOURCE_BYTES/, "original Native source byte tampering must be rejected");
    fileRejections += 1;
    const missingObjectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-prior-object-"));
    try {
      execFileSync("git", ["init", "--quiet", missingObjectRoot], { stdio: ["ignore", "pipe", "pipe"] });
      assert.throws(() => readOriginalNativeSource(missingObjectRoot, prior),
        /Command failed: git cat-file blob/, "missing immutable original Native source must be rejected");
      fileRejections += 1;
    } finally {
      fs.rmSync(missingObjectRoot, { recursive: true, force: true });
    }
    fs.appendFileSync(priorFile, "\n");
    refuseFile(candidate, "changed exact original Native receipt");
    fs.writeFileSync(priorFile, priorBytes);
    const evidencePath = baseline.declaredInputs.priorEvidencePaths[0];
    const evidenceFile = path.join(fixtureRoot, evidencePath), evidenceBytes = fs.readFileSync(evidenceFile);
    fs.appendFileSync(evidenceFile, "\n");
    refuseFile(candidate, "changed terminal original Native evidence");
    fs.writeFileSync(evidenceFile, evidenceBytes);
    fs.unlinkSync(evidenceFile);
    refuseFile(candidate, "missing terminal original Native evidence");
    fs.symlinkSync(path.join(root, evidencePath), evidenceFile);
    refuseFile(candidate, "same-byte terminal original Native evidence symlink");
    fs.unlinkSync(evidenceFile); fs.writeFileSync(evidenceFile, evidenceBytes);
    const masterFile = path.join(fixtureRoot, "archive/data/master_tables/js_archive_tag_master.json");
    const masterBytes = fs.readFileSync(masterFile);
    fs.appendFileSync(masterFile, "\n");
    refuseFile(candidate, "source-pair master drift cannot hide behind known source change");
    fs.writeFileSync(masterFile, masterBytes);
    const sourceRelative = "archive/exams/" + input.source, sourceFile = path.join(fixtureRoot, sourceRelative);
    const sourceBytes = fs.readFileSync(sourceFile), unknownBytes = Buffer.concat([sourceBytes, Buffer.from("\n")]);
    const blobOf = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
    fs.writeFileSync(sourceFile, unknownBytes);
    refuseFile({ ...candidate, nativeSource: { ...candidate.nativeSource, bytes: unknownBytes, blobSha1: blobOf(unknownBytes) } },
      "an unobserved source edition is not a known source CAS block");
    fs.writeFileSync(sourceFile, sourceBytes);
    const issuedBytes = execFileSync("git", ["show", "f9e49a0e0c18f18c63f31d7547bd504f07a821c6:" + sourceRelative],
      { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    const issuedBank = loadBank(issuedBytes.toString("utf8"), sourceRelative);
    fs.writeFileSync(sourceFile, issuedBytes);
    refuseFile({ ...candidate, question: issuedBank[input.ordinal - 1], previous: issuedBank[input.ordinal - 1],
      nativeSource: { ...candidate.nativeSource, bytes: issuedBytes, blobSha1: blobOf(issuedBytes), bank: issuedBank } },
      "old issued source bytes cannot masquerade as a current observed BLOCKED result");
    fs.writeFileSync(sourceFile, sourceBytes);
    const restored = issuedObserver.assertKnownInputs(candidate, "restored source-pair proof closure");
    assert.deepStrictEqual(restored.declaredInputs, baseline.declaredInputs);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
  console.log("PASS " + sourceRetainedInputs.length +
    " exact issued Q11/Q15 approvals retained with current source reuse BLOCKED; " +
    (cases.length + companionChanges.length + fileRejections) + " rejected corruptions; new approvals 0");
}
const rhsRetainedInputs = retainedInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).kind === "EXACT_E017_Q2_ISSUED_RHS_SOURCE_BLOCK");
if (rhsRetainedInputs.length) {
  assert.strictEqual(rhsRetainedInputs.length, 1, "the observed RHS source block is one fixed issued UID");
  const input = rhsRetainedInputs[0], baseline = retainedApprovals.get(input.current.questionUid);
  assert.strictEqual(input.current.questionUid, "qid_v1_3f70e51fcbb651f7504dcf0e38089c9f103e4a361cb99d3b8ec9d3c0e9547bc9");
  assert.strictEqual(input.ordinal, 2);
  assert.strictEqual(baseline.proof.currentNativeReady, false);
  assert.strictEqual(baseline.declaredInputs.originalSolutionUi.currentUiContinuity, "NOT_ASSERTED");
  const rejects = (candidate, label) => assert.throws(() => issuedObserver.assertKnownInputs(candidate, label), isRefusalError, label);
  const changedBank = structuredClone(input.nativeSource.bank);
  changedBank[1] = { ...changedBank[1], content: "unknown selected question fixture" };
  const cases = [
    ["RHS retained metadata whole changed", { current: { ...input.current, tagStatus: "unreviewed" } }],
    ["RHS retained identity UID changed", { identity: { ...input.identity, questionUid: "qid_v1_" + "0".repeat(64) } }],
    ["RHS retained runtime whole changed", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, metadataRevision: input.nativeSource.runtimeRecord.metadataRevision + ":changed" } } }],
    ["RHS original evidence removed", { current: { ...input.current, approvalEvidence: [] } }],
    ["RHS owner changed", { runtimeOwner: "MIDDLE1" }],
    ["RHS ordinal changed", { ordinal: 3 }],
    ["RHS unissued receipt", { current: { ...input.current, metadataRevision: input.current.metadataRevision + "-unissued" } }],
    ["RHS unknown source bank hidden behind observed byte pins", { question: changedBank[1], previous: changedBank[1],
      nativeSource: { ...input.nativeSource, bank: changedBank } }]
  ];
  for (const [label, changes] of cases) rejects({ ...input, ...changes }, label);

  let fileRejections = 0, protocolRejections = 0;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-rhs-retention-"));
  try {
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"] });
    for (const relative of baseline.readPaths) {
      const target = path.resolve(fixtureRoot, relative);
      assert(target.startsWith(fixtureRoot + path.sep), relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const candidate = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    const copied = issuedObserver.assertKnownInputs(candidate, "unchanged copied exact RHS authority closure");
    assert.deepStrictEqual(copied.declaredInputs, baseline.declaredInputs);
    assert.deepStrictEqual(copied.authenticatedDrifts, baseline.authenticatedDrifts);
    const refuse = (value, label) => { rejects(value, label); fileRejections += 1; };
    const nativeSourceBytes = readRhsOriginalNativeSource(fixtureRoot);
    assert.strictEqual(sha256(nativeSourceBytes), baseline.declaredInputs.originalNativeSource.sha256);
    assert.throws(() => assertRhsOriginalNativeSourceBytes(
      Buffer.concat([nativeSourceBytes, Buffer.from("\n")])), /RHS_ORIGINAL_SOURCE_BYTES/,
      "changed original Native source cannot hide behind the current whole-source refusal");
    fileRejections += 1;
    const emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-rhs-missing-object-"));
    try {
      execFileSync("git", ["init", "--quiet", emptyRoot], { stdio: ["ignore", "pipe", "pipe"] });
      assert.throws(() => readRhsOriginalNativeSource(emptyRoot),
        /Command failed: git|RHS_ORIGINAL_SOURCE_PATH/, "the original Native source must exist in the caller's Git context");
      fileRejections += 1;
    } finally { fs.rmSync(emptyRoot, { recursive: true, force: true }); }

    const documentPaths = [baseline.receiptPath, baseline.bindingPath,
      "docs/operations/m2-e017-rhs-continuity-20261116/final-ui-binding-r1.json",
      ".archive-meta-register/evidence/m2s2-display21-current626-20261116/e017-native-review.json"];
    for (const relative of documentPaths) {
      assert(baseline.readPaths.has(relative), relative);
      const file = path.join(fixtureRoot, relative), bytes = fs.readFileSync(file);
      fs.appendFileSync(file, "\n");
      refuse(candidate, "known source block plus changed original RHS authority: " + relative);
      fs.writeFileSync(file, bytes);
    }
    const reviewRelative = documentPaths[3], reviewFile = path.join(fixtureRoot, reviewRelative);
    const reviewBytes = fs.readFileSync(reviewFile);
    fs.unlinkSync(reviewFile);
    refuse(candidate, "known source block plus missing original Native review");
    fs.symlinkSync(path.join(root, reviewRelative), reviewFile);
    refuse(candidate, "same-byte original Native review symlink");
    fs.unlinkSync(reviewFile); fs.writeFileSync(reviewFile, reviewBytes);

    for (const relative of baseline.declaredInputs.assetPaths) {
      const file = path.join(fixtureRoot, relative), bytes = fs.readFileSync(file);
      fs.unlinkSync(file);
      refuse(candidate, "known source block plus missing original RHS asset");
      fs.writeFileSync(file, Buffer.concat([bytes, Buffer.from("\n")]));
      refuse(candidate, "known source block plus changed original RHS asset");
      fs.unlinkSync(file); fs.symlinkSync(path.join(root, relative), file);
      refuse(candidate, "same-byte original RHS asset symlink");
      fs.unlinkSync(file); fs.writeFileSync(file, bytes);
    }
    const masterFile = path.join(fixtureRoot, "archive/data/master_tables/js_archive_tag_master.json");
    const masterBytes = fs.readFileSync(masterFile);
    fs.appendFileSync(masterFile, "\n");
    refuse(candidate, "RHS current master drift is not an observed source change");
    fs.writeFileSync(masterFile, masterBytes);
    const sourceRelative = "archive/exams/" + input.source, sourceFile = path.join(fixtureRoot, sourceRelative);
    const sourceBytes = fs.readFileSync(sourceFile), unknownBytes = Buffer.concat([sourceBytes, Buffer.from("\n")]);
    const blobOf = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
    fs.writeFileSync(sourceFile, unknownBytes);
    refuse({ ...candidate, nativeSource: { ...candidate.nativeSource, bytes: unknownBytes, blobSha1: blobOf(unknownBytes) } },
      "RHS unobserved source bytes are rejected");
    fs.writeFileSync(sourceFile, sourceBytes);
    fs.unlinkSync(sourceFile); fs.symlinkSync(path.join(root, sourceRelative), sourceFile);
    refuse(candidate, "same-byte observed source symlink is rejected");
    fs.unlinkSync(sourceFile); fs.writeFileSync(sourceFile, sourceBytes);
    const issuedBytes = execFileSync("git", ["show", "f9e49a0e0c18f18c63f31d7547bd504f07a821c6:" + sourceRelative],
      { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    const issuedBank = loadBank(issuedBytes.toString("utf8"), sourceRelative);
    fs.writeFileSync(sourceFile, issuedBytes);
    refuse({ ...candidate, question: issuedBank[1], previous: issuedBank[1],
      nativeSource: { ...candidate.nativeSource, bytes: issuedBytes, blobSha1: blobOf(issuedBytes), bank: issuedBank } },
      "old issued source is not an observed current RHS BLOCKED condition");
    fs.writeFileSync(sourceFile, sourceBytes);

    // These explicit protocol doubles exercise only the refusal gate. They
    // cannot issue metadata or replace the real Native/plan calls above.
    const basePlan = { status: "SUPPLEMENT_PENDING", reasons: [baseline.expectedPlanReason],
      questionUid: input.current.questionUid, sourceArchiveFile: input.source, sourceOrdinal: input.ordinal };
    const protocolCases = [
      ["current Native receipt cannot be counted as BLOCKED", {
        nativeReviewReceipt: () => baseline.receiptPath, planQuestion: () => basePlan }],
      ["unknown RHS refusal stays a failure", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, reasons: ["UNKNOWN_NATIVE_INPUT_FAILURE"] }) }],
      ["RHS refusal cannot become already registered", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, status: "ALREADY_REGISTERED" }) }],
      ["RHS refusal cannot carry generated metadata", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, final: { metadataApprovalType: "FINAL_QA" } }) }]
    ];
    for (const [label, overrides] of protocolCases) {
      const observer = createIssuedApprovalObserver({ ...issuedObserverApi, ...overrides });
      assert.throws(() => observer.assertBlocked(candidate, label), isRefusalError, label);
      protocolRejections += 1;
    }
    const restored = issuedObserver.assertKnownInputs(candidate, "restored entire original RHS input closure");
    assert.deepStrictEqual(restored.declaredInputs, baseline.declaredInputs);
    assert.deepStrictEqual(restored.authenticatedDrifts, baseline.authenticatedDrifts);
  } finally { fs.rmSync(fixtureRoot, { recursive: true, force: true }); }
  console.log("PASS exact issued RHS1 approval retained with current source reuse BLOCKED; " +
    (cases.length + fileRejections + protocolRejections) +
    " rejected corruptions; current Native approvals 0; current UI continuity NOT_ASSERTED");
}
const originalReceiptInputs = retainedInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).kind === "EXACT_ISSUED_ORIGINAL_RECEIPT_SOURCE_BLOCK");
assert.strictEqual(originalReceiptInputs.length, 23, "the actual observed original-receipt scope must remain twenty-three");
assert.strictEqual(originalReceiptInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).expectedPlanReason === "CANONICAL_LABELS_MISSING").length, 20);
assert.strictEqual(originalReceiptInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).expectedPlanReason === "IDENTITY_SOURCE_FINGERPRINT_MISMATCH").length, 3);
const originalGroups = new Map();
for (const input of originalReceiptInputs) {
  const proof = retainedApprovals.get(input.current.questionUid);
  const key = proof.declaredInputs.originalRequestId;
  originalGroups.set(key, [...(originalGroups.get(key) || []), input]);
  assert.strictEqual(proof.proof.currentNativeReady, false);
  assert.strictEqual(proof.proof.currentPlan.status, "SUPPLEMENT_PENDING");
  assert.deepStrictEqual(proof.proof.currentPlan.reasons, [proof.expectedPlanReason]);
  assert.strictEqual(proof.proof.newMetadataApprovals, 0);
}
assert.deepStrictEqual([...originalGroups.values()].map(rows => rows.length).sort((a, b) => a - b), [1, 10, 12]);
const e006OriginalInputs = originalGroups.get("m3s2-e006-residual-current410-r8-20261116");
assert.deepStrictEqual(e006OriginalInputs.map(input => input.ordinal).sort((a, b) => a - b),
  [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 21, 22], "only the actual E006 twelve may enter the added source block");
for (const input of e006OriginalInputs) {
  const kept = retainedApprovals.get(input.current.questionUid);
  assert.strictEqual(kept.expectedPlanReason,
    input.ordinal === 3 ? "IDENTITY_SOURCE_FINGERPRINT_MISMATCH" : "CANONICAL_LABELS_MISSING");
  assert.strictEqual(kept.declaredInputs.actualReadonlyObservation.snapshot,
    "90ba4c2c3ce042b0bee4d68588ce83aa37e3f95f");
  assert.strictEqual(kept.declaredInputs.actualReadonlyObservation.report.gitBlobSha1,
    "d4f20db9affab008ad98ace5cff40f6bacff990e");
  assert.strictEqual(kept.proof.currentNativeReady, false);
}
let originalReceiptRejections = 0;
for (const inputs of originalGroups.values()) {
  const input = inputs.find(value => value.ordinal === 4) || inputs[0];
  const baseline = retainedApprovals.get(input.current.questionUid);
  const refuses = (candidate, label) => {
    assert.throws(() => issuedObserver.assertKnownInputs(candidate, label), isRefusalError, label);
    originalReceiptRejections += 1;
  };
  for (const [label, change] of [
    ["original metadata whole change", { current: { ...input.current, tagStatus: "unreviewed" } }],
    ["original identity UID change", { identity: { ...input.identity, questionUid: "qid_v1_" + "0".repeat(64) } }],
    ["original runtime whole change", { nativeSource: { ...input.nativeSource,
      runtimeRecord: { ...input.nativeSource.runtimeRecord, metadataRevision: "UNISSUED" } } }],
    ["original ACTIVE owner change", { runtimeOwner: "MIDDLE1" }],
    ["original unissued revision", { current: { ...input.current,
      metadataRevision: input.current.metadataRevision + "-unissued" } }]
  ]) refuses({ ...input, ...change }, label);
  const other = inputs.find(value => value.current.questionUid !== input.current.questionUid) || input;
  const changedCurrentMember = createIssuedApprovalObserver({ ...issuedObserverApi, currentRows(uid) {
    const value = issuedObserverApi.currentRows(uid);
    return uid === other.current.questionUid
      ? { ...value, metadata: { ...value.metadata, reviewStatus: "unreviewed" } } : value;
  } });
  assert.throws(() => changedCurrentMember.assertKnownInputs(input,
    "all members of the original receipt must retain their complete current approval"));
  originalReceiptRejections += 1;

  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-geometry-original-receipt-"));
  try {
    execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", "--local", root, fixtureRoot],
      { stdio: ["ignore", "pipe", "pipe"] });
    for (const relative of baseline.readPaths) {
      const target = path.join(fixtureRoot, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, relative), target);
    }
    const candidate = { ...input, nativeSource: { ...input.nativeSource, root: fixtureRoot } };
    const copied = issuedObserver.assertKnownInputs(candidate, "exact copied original receipt input closure");
    assert.deepStrictEqual(copied.declaredInputs, baseline.declaredInputs);
    assert.deepStrictEqual(copied.authenticatedDrifts, baseline.authenticatedDrifts);
    const paths = [...new Set([baseline.receiptPath, ...baseline.receipt.approval.evidenceRefs.map(ref => ref.path)])];
    for (const relative of paths) {
      assert(baseline.readPaths.has(relative), relative);
      const file = path.join(fixtureRoot, relative), bytes = fs.readFileSync(file);
      fs.appendFileSync(file, "\n");
      refuses(candidate, "known source change cannot hide changed issued evidence: " + relative);
      fs.writeFileSync(file, bytes);
    }
    const firstEvidence = baseline.receipt.approval.evidenceRefs[0].path;
    const evidenceFile = path.join(fixtureRoot, firstEvidence), evidenceBytes = fs.readFileSync(evidenceFile);
    fs.unlinkSync(evidenceFile);
    refuses(candidate, "missing original evidence must fail");
    fs.symlinkSync(path.join(root, firstEvidence), evidenceFile);
    refuses(candidate, "same-byte original evidence symlink must fail");
    fs.unlinkSync(evidenceFile); fs.writeFileSync(evidenceFile, evidenceBytes);

    // The absence of a binding is accepted only through a byte-pinned original
    // receipt. A forged receipt with a newly declared binding cannot qualify.
    const receiptFile = path.join(fixtureRoot, baseline.receiptPath), receiptBytes = fs.readFileSync(receiptFile);
    const forged = JSON.parse(receiptBytes);
    forged.outputDigests.push({ path: baseline.receiptPath.replace(/\.json$/, ".source-review-binding.json"),
      sha256: "0".repeat(64) });
    fs.writeFileSync(receiptFile, JSON.stringify(forged, null, 2) + "\n");
    refuses(candidate, "original receipt cannot acquire a forged typed output");
    fs.writeFileSync(receiptFile, receiptBytes);

    const masterFile = path.join(fixtureRoot, "archive/data/master_tables/js_archive_tag_master.json");
    const masterBytes = fs.readFileSync(masterFile);
    fs.appendFileSync(masterFile, "\n");
    refuses(candidate, "unknown current MASTER drift must fail");
    fs.writeFileSync(masterFile, masterBytes);
    const sourceRelative = "archive/exams/" + input.source, sourceFile = path.join(fixtureRoot, sourceRelative);
    const sourceBytes = fs.readFileSync(sourceFile), unknownBytes = Buffer.concat([sourceBytes, Buffer.from("\n")]);
    const blobOf = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
    fs.writeFileSync(sourceFile, unknownBytes);
    refuses({ ...candidate, nativeSource: { ...candidate.nativeSource, bytes: unknownBytes, blobSha1: blobOf(unknownBytes) } },
      "unobserved original source bytes must fail");
    fs.writeFileSync(sourceFile, sourceBytes);
    fs.unlinkSync(sourceFile);
    refuses(candidate, "missing current source must fail");
    fs.symlinkSync(path.join(root, sourceRelative), sourceFile);
    refuses(candidate, "same-byte current source symlink must fail");
    fs.unlinkSync(sourceFile); fs.writeFileSync(sourceFile, sourceBytes);
    const issuedBytes = execFileSync("git", ["show", "f9e49a0e0c18f18c63f31d7547bd504f07a821c6:" + sourceRelative],
      { cwd: root, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    const issuedBank = loadBank(issuedBytes.toString("utf8"), sourceRelative);
    fs.writeFileSync(sourceFile, issuedBytes);
    refuses({ ...candidate, question: issuedBank[input.ordinal - 1], previous: issuedBank[input.ordinal - 1],
      nativeSource: { ...candidate.nativeSource, bytes: issuedBytes, blobSha1: blobOf(issuedBytes), bank: issuedBank } },
      "old source restoration cannot be described as the observed current block");
    fs.writeFileSync(sourceFile, sourceBytes);

    for (let index = 0; index < baseline.declaredInputs.originalSources.length; index++) {
      const raw = readOriginalReceiptSource(root, baseline.declaredInputs.originalRequestId, index);
      assert.throws(() => assertOriginalReceiptSourceBytes(Buffer.concat([raw, Buffer.from("\n")]),
        baseline.declaredInputs.originalRequestId, index), /ORIGINAL_RECEIPT_SOURCE_BYTES/);
      originalReceiptRejections += 1;
      const emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "middle-original-receipt-missing-object-"));
      try {
        execFileSync("git", ["init", "--quiet", emptyRoot], { stdio: ["ignore", "pipe", "pipe"] });
        assert.throws(() => readOriginalReceiptSource(emptyRoot, baseline.declaredInputs.originalRequestId, index),
          /Command failed: git/, "original immutable source must exist in the caller Git context");
        originalReceiptRejections += 1;
      } finally { fs.rmSync(emptyRoot, { recursive: true, force: true }); }
    }
    assert.throws(() => readOriginalReceiptSource(fixtureRoot, "UNDECLARED_RECEIPT", 0),
      /FIXED_ORIGINAL_RECEIPT/);
    originalReceiptRejections += 1;

    // These doubles test refusal-shape handling only. The actual twenty-three Native
    // and planQuestion calls were already made above from untouched production.
    const basePlan = { status: "SUPPLEMENT_PENDING", reasons: [baseline.expectedPlanReason],
      questionUid: input.current.questionUid, sourceArchiveFile: input.source, sourceOrdinal: input.ordinal };
    const differentKnownReason = baseline.expectedPlanReason === "CANONICAL_LABELS_MISSING"
      ? "IDENTITY_SOURCE_FINGERPRINT_MISMATCH" : "CANONICAL_LABELS_MISSING";
    for (const [label, overrides] of [
      ["original positive Native cannot become an accepted null", {
        nativeReviewReceipt: () => baseline.receiptPath, planQuestion: () => basePlan }],
      ["original unknown refusal is not accepted", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, reasons: ["UNKNOWN_FAILURE"] }) }],
      ["another known profile's refusal is not accepted", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, reasons: [differentKnownReason] }) }],
      ["an additional known refusal is not accepted", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, reasons: [...basePlan.reasons, differentKnownReason] }) }],
      ["ordinary APPLY is not an observed refusal", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, status: "APPLY" }) }],
      ["ordinary ALREADY_REGISTERED is not an observed refusal", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, status: "ALREADY_REGISTERED" }) }],
      ["original refusal cannot carry generated metadata", {
        nativeReviewReceipt: () => null, planQuestion: () => ({ ...basePlan, final: { metadataApprovalType: "FINAL_QA" } }) }]
    ]) {
      const observer = createIssuedApprovalObserver({ ...issuedObserverApi, ...overrides });
      assert.throws(() => observer.assertBlocked(candidate, label), isRefusalError, label);
      originalReceiptRejections += 1;
    }
    const restored = issuedObserver.assertKnownInputs(candidate, "restored complete original receipt closure");
    assert.deepStrictEqual(restored.declaredInputs, baseline.declaredInputs);
    assert.deepStrictEqual(restored.authenticatedDrifts, baseline.authenticatedDrifts);
  } finally { fs.rmSync(fixtureRoot, { recursive: true, force: true }); }
}
console.log("PASS retained issued original receipt23 whole approvals with current Native BLOCKED; " +
  originalReceiptRejections + " rejected corruptions; current Native approvals 0; new metadata approvals 0");

console.log("CURRENT_NATIVE_READINESS " + JSON.stringify({
  ready: nativeApprovals.size, blockedRetained: retainedApprovals.size,
  blocked: [...retainedApprovals.values()].map(value => ({
    questionUid: value.proof.questionUid, sourceArchiveFile: value.proof.sourceArchiveFile,
    sourceOrdinal: value.proof.sourceOrdinal, status: value.proof.currentReadiness,
    readinessBasis: value.proof.readinessBasis,
    reasons: value.proof.currentPlan.reasons,
    changedDeclaredInputs: value.proof.authenticatedDrifts.map(row => row.path),
    sourceChangedSinceIssuedAnchor: value.proof.sourceChangedSinceAnchor,
    currentDisplayQuality: value.proof.currentDisplayQuality, newMetadataApprovals: 0
  })).sort((a, b) => a.questionUid.localeCompare(b.questionUid))
}));

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
      ["META_PIPELINE_AUDIT", "MAIN_MERGE"].includes(currentQuestionMetadata.get(row.questionUid)?.metadataApprovalType) ||
      issuedApprovals.has(row.questionUid), row.questionUid);
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
// The current classification must match its exact issued receipt and ACTIVE
// binding. Current Native readiness remains a separate result above.
const q513ReceiptPath = issuedApprovals.get(uid513);
if (q513ReceiptPath) {
  const applied = readJson(q513ReceiptPath).appliedRecords.filter(row => row.questionUid === uid513);
  assert.strictEqual(applied.length, 1, uid513);
  assert.strictEqual(applied[0].sourceArchiveFile, historicalByUid.get(uid513).source, uid513);
  assert.strictEqual(Number(applied[0].sourceOrdinal), historicalByUid.get(uid513).ordinal, uid513);
  assert.deepStrictEqual(applied[0], currentQuestionMetadata.get(uid513), uid513);
  assert.strictEqual(q513.templateKey, applied[0].templateKey, uid513);
} else {
  assert.strictEqual(q513.templateKey, "TPL_TRIG_APPLICATION_DIRECT_MEASURE");
}

const globalRuntime = [
  "geometry-equations-v1.json", "sets-propositions-v1.json", "functions-graphs-v1.json",
  "limit-continuity-v1.json", "integral-calculus-v1.json", "derivative-v1.json",
  "probability-statistics-v1.json", "middle-geometry-v1.json"
].flatMap((name) => readJson("archive/data/meta-foundation/runtime/" + name).records);
assert.strictEqual(new Set(globalRuntime.map((row) => row.questionUid)).size, globalRuntime.length);
assert.strictEqual(new Set(globalRuntime.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, globalRuntime.length);

const maesan = catalog.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_기출.js"));
assert.strictEqual(maesan.length, 23);

console.log("PASS Middle Geometry retained runtime approval, canonical joins, HOLD/ROUTE_OUT policy, and Archive2 join; current Native readiness reported separately");


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
