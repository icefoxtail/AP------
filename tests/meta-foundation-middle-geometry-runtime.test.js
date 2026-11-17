const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const Archive2Core = require("../archive/archive2-core.js");
const { createIssuedApprovalObserver, readOriginalNativeSource, assertOriginalNativeSourceBytes } = require("./helpers/middle-geometry-issued-approval.cjs");

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
      () => issuedObserver.assertKnownInputs(candidate, label), label);
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
const sourceRetainedInputs = retainedInputs.filter(input =>
  retainedApprovals.get(input.current.questionUid).kind === "EXACT_E017_Q11_Q15_SOURCE_PRESERVATION");
if (sourceRetainedInputs.length) {
  const input = sourceRetainedInputs[0], baseline = retainedApprovals.get(input.current.questionUid);
  const rejects = (candidate, label) => assert.throws(() => issuedObserver.assertKnownInputs(candidate, label), label);
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
      currentQuestionMetadata.get(row.questionUid)?.metadataApprovalType === "META_PIPELINE_AUDIT" ||
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
