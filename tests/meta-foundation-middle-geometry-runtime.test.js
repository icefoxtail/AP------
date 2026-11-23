const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const Archive2Core = require("../archive/archive2-core.js");

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
const { judgeLockedMaster, RPM_MASTER_PATH } = await import("../archive/tools/meta-foundation/rpm-master-add-only.mjs");
const { isUnambiguousLegacySourceUidAlias } = await import("../archive/tools/intelligence/question-identity-contract.mjs");
const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sourceKey = (file, ordinal) => Archive2Core.normalizeFile(file) + "#" + Number(ordinal);
const runtimePath = "archive/data/meta-foundation/runtime/middle-geometry-v1.json";
// complete rows: approvedSourceFingerprint and the evidence columns are in the evidence file, not the downloaded catalog
const catalog = require("../archive/tools/archive2-catalog-evidence.cjs").readCatalog({ root });
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
const { sourceChangedSinceReview } = require("./helpers/source-changed-since-review.cjs");
const nativeSources = new Map();
const nativeApprovals = new Map(), issuedApprovals = new Map();
const nativeInputs = [];
// 지금 원본·영수증으로 Native 검증이 통과하지 않는 문항(원본이 영수증 이후 정상 수정됨 등)은 재등록 대기로 센다.
// 2026-11-18 사용자 결정: 발급 당시 판본·렌더러 표를 현재 원본과 대조하는 보존 검사는 없앴다(실패 아님).
const staleSourceUids = new Set(), operationalBlockUids = new Set();
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

// 원본은 영수증과 같은데 운영 검증기(nativeReviewReceipt)가 거절하는 문항(렌더러·UI 연속성 고정 등 운영 쪽 조건)은 Native 통과로 세지 않는다.
// 대신 영수증 자체의 무결성만 여기서 직접 증명한다(렌더러·엔진 바이트는 보지 않는다): 영수증 형식·상태, 원본 지문, 증거 해시,
// 적용 행·런타임 행·신원 행이 현재 값과 같음, 메타 개정 문자열. 하나라도 어긋나면 실패다.
// LOCKED RPM 마스터는 추가 전용이므로 영수증이 고정한 옛 판본(git 이력상 실제 판본)을 현재 마스터가 그대로 포함하면 인증한다.
// 판정은 운영 검증기와 같은 한 벌(rpm-master-add-only.mjs)을 쓴다. 마스터 외 증거 파일은 여전히 바이트 일치만 허용한다.
function assertReceiptIntegrity(input, label) {
  const { current, identity, source, ordinal } = input, { bytes, blobSha1, runtimeRecord } = input.nativeSource;
  const prefix = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
  const found = (current.approvalEvidence || []).filter(ref => typeof ref === "string" && ref.startsWith(prefix) && ref.endsWith(".json"))
    .map(ref => ({ ref, receipt: JSON.parse(fs.readFileSync(path.join(input.nativeSource.root, ref), "utf8")) }))
    .filter(row => row.receipt.schemaVersion === "archive-reviewed-exam-meta-registration-v2");
  assert(found.length >= 1, label + ": no registered receipt in approvalEvidence");
  const { ref, receipt } = found[0], approval = receipt.approval;
  assert.strictEqual(ref, prefix + receipt.requestId + ".json", label);
  assert.strictEqual(receipt.metadataRegistrationStatus, "REGISTERED", label);
  assert.strictEqual(receipt.sourceArchiveFile, source, label);
  assert.strictEqual(receipt.sourceRawSha256, sha256(bytes), label);
  assert.strictEqual(receipt.sourceBlobSha1, blobSha1, label);
  assert.strictEqual(approval.type, current.metadataApprovalType, label);
  assert.strictEqual(approval.metadataReviewed, true, label);
  assert(String(approval.approvedBy || "").trim(), label);
  if (approval.type === "REVIEW2") assert.strictEqual(approval.reviewPassCount, 2, label);
  assert(Array.isArray(approval.evidenceRefs) && approval.evidenceRefs.length, label);
  for (const evidence of approval.evidenceRefs) {
    const currentSha = sha256(fs.readFileSync(path.join(input.nativeSource.root, evidence.path)));
    if (currentSha !== evidence.sha256 && evidence.path === RPM_MASTER_PATH && input.nativeSource.root === root
      && judgeLockedMaster({ root, pinnedSha256: evidence.sha256 }).ok) continue;
    assert.strictEqual(currentSha, evidence.sha256, label + ": evidence bytes drifted");
  }
  const one = (rows, what) => { const hit = rows.filter(row => row.questionUid === current.questionUid); assert.strictEqual(hit.length, 1, label + ": " + what); return hit[0]; };
  assert.deepStrictEqual(one(receipt.appliedRecords, "applied record"), current, label);
  assert.deepStrictEqual(one(receipt.runtimeRecords, "runtime record"), runtimeRecord, label);
  assert.deepStrictEqual(one(receipt.appliedIdentityRecords, "identity record"), identity, label);
  assert.strictEqual(Number(one(receipt.appliedRecords, "applied record").sourceOrdinal), ordinal, label);
  return ref;
}
function assertReviewedState(input, label) {
  try {
    return { receiptPath: assertNativeApproval(input, label), currentNativeReady: true };
  } catch (error) {
    if (!(error instanceof assert.AssertionError)) throw error;
    // 원본 시험지가 영수증 이후 정상 수정되어 어긋난 문항만 재등록 대기로 센다(실패 아님).
    // 영수증이 현재 원본과 같은데 어긋나는 것(영수증 누락·위조, 신원/행 불일치, 잘못된 결합, 증거 해시 불일치)은 그대로 실패한다.
    if (sourceChangedSinceReview(input)) return { receiptPath: null, currentNativeReady: false, staleSource: true };
    if (!["FINAL_QA", "REVIEW2"].includes(input.current.metadataApprovalType)) throw error;
    return { receiptPath: assertReceiptIntegrity(input, label), currentNativeReady: false, operationalBlock: true, nativeError: error.message };
  }
}
function rememberReviewedState(input, state) {
  if (state.staleSource) { staleSourceUids.add(input.current.questionUid); return; }
  const uid = input.current.questionUid;
  issuedApprovals.set(uid, state.receiptPath);
  if (state.operationalBlock) { operationalBlockUids.add(uid); return; }
  nativeApprovals.set(uid, state.receiptPath);
  if (!nativeInputs.some(value => value.current.questionUid === uid)) nativeInputs.push(input);
}

function verifyHistoricalCohorts(index, remember = false) {
  let unchanged = 0, reviewedTransitions = 0, currentNativeReady = 0, staleSource = 0, operationalBlock = 0;
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
    if (state.staleSource) staleSource += 1; else if (state.operationalBlock) operationalBlock += 1; else currentNativeReady += 1;
    reviewedTransitions += 1;
  }
  assert.strictEqual(unchanged + reviewedTransitions, historicalByUid.size);
  assert.strictEqual(currentNativeReady + staleSource + operationalBlock, reviewedTransitions);
  return { unchanged, reviewedTransitions, currentNativeReady, staleSource, operationalBlock };
}
// Approval kinds an additional runtime row may carry besides FINAL_QA/REVIEW2 (handled by the
// native reviewed-state path): an explicit set, anything else (unknown or empty) fails.
// META_PIPELINE_AUDIT keeps its existing requirements. For MAIN_MERGE only check that the
// runtime row and the canonical metadata agree on the approval type and the same question.
// MAIN_MERGE의 상태·영수증 계약은 등록기(auto-register-merged-source.mjs)가 강제한다. 여기서 다시 조이지 않는다(2026-11-18 사용자 결정: 값이 있으면 쓴다, 막는 것은 실제 결함뿐).
function assertAdditionalRowApproval(metadata, row) {
  const uid = row.questionUid;
  const type = metadata.metadataApprovalType;
  assert(["META_PIPELINE_AUDIT", "MAIN_MERGE"].includes(type), "unsupported additional-row approval type " + type + ": " + uid);
  if (type === "META_PIPELINE_AUDIT") {
    assert.strictEqual(metadata.metadataStatus, "approved_semantic_review", uid);
    assert((metadata.approvalEvidence || []).some((file) => file.endsWith(".source-parity.json")), uid);
    return;
  }
  assert.strictEqual(metadata.questionUid, uid);
  assert.strictEqual(row.metadataApprovalType, type, uid);
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

console.log(`REREGISTRATION_PENDING source-edited=${staleSourceUids.size} receipt-verified-but-native-refused=${operationalBlockUids.size}`);
// 음성 사례는 영수증이 현재 원본과 맞는(재등록 대기가 아닌) 문항으로 건다. 재등록 대기 문항은 분류가 거절되지 않는다.
const historicalUid = nativeInputs.map(input => input.current.questionUid).find(uid => historicalByUid.has(uid) &&
  historical.cohorts["1.0.0"].some(row => row[0] === uid) && sha256(stable(activeRuntimeByUid.get(uid)[0].row)) !== historicalByUid.get(uid).digest) || historical.cohorts["1.0.0"][0][0];
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
console.log(`PASS historical cohorts 904/47/24: ${preservedCohorts.unchanged} unchanged, ${preservedCohorts.reviewedTransitions} issued transitions (${preservedCohorts.currentNativeReady} current Native READY, ${preservedCohorts.staleSource} awaiting re-registration after a source edit, ${preservedCohorts.operationalBlock} receipt-verified but refused by the production Native verifier); ${invalidCohortCases.length} rejected corruptions`);

const reviewedInput = nativeInputs.find(input => ["FINAL_QA", "REVIEW2"].includes(input.current.metadataApprovalType));
assert(reviewedInput, "at least one current Native FINAL_QA/REVIEW2 positive is required; re-registration-pending rows cannot substitute");
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

// 발급 보존(retained) 구간 삭제(2026-11-18 사용자 결정): 발급 당시 관찰한 원본 판본·렌더러 표를 현재 원본과 대조하는 검사였다.
// 원본·엔진은 계속 바뀌므로 과거 판본 표와 같아야 한다는 비교는 만들지 않는다.

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
      issuedApprovals.has(row.questionUid) || staleSourceUids.has(row.questionUid), row.questionUid);
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
} else if (!staleSourceUids.has(uid513)) {
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
