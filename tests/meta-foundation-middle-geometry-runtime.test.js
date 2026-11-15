const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const Archive2Core = require("../archive/archive2-core.js");

async function main() {
const { loadBank, nativeReviewReceipt, activeBindingContext, sourceFingerprint, sourcePath } = await import("../archive/tools/meta-foundation/auto-register-merged-source.mjs");
const { loadActiveMetaRegistry, validateActiveMetaFields } = await import("../archive/tools/meta-foundation/active-registry.mjs");
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

const frozenRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.0");
const priorReviewedRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.2");
const currentReviewedRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.3");
const additionalReviewedRows = runtime.records.filter((row) => !["1.0.0", "1.0.2", "1.0.3"].includes(row.metaFoundationPackVersion));
assert.strictEqual(frozenRows.length, 904);
assert.strictEqual(priorReviewedRows.length, 47);
assert.strictEqual(currentReviewedRows.length, 24);
assert.strictEqual(frozenRows.filter((row) => row.metaFoundationL3Status === "FINAL").length, 897);
assert.strictEqual(frozenRows.filter((row) => row.metaFoundationL4Status === "FINAL").length, 878);
assert.strictEqual(frozenRows.filter((row) => row.metaFoundationL4Status === "EXPLICIT_HOLD").length, 19);
assert.strictEqual(frozenRows.filter((row) => row.metaFoundationL3Status === "ROUTE_OUT").length, 7);

const l3Evidence = readJson("archive/data/meta-foundation/evidence/middle-geometry/v1/l3_semantic_final_928.json").records;
const l4Evidence = readJson("archive/data/meta-foundation/evidence/middle-geometry/v1/l4_crossconcept_semantic_freeze_928.json").records;
assert.strictEqual(l3Evidence.length, 928);
assert.strictEqual(l4Evidence.length, 928);
assert.strictEqual(l3Evidence.filter((row) => row.l3ReviewStatus === "FINAL").length, runtime.counts.finalL3);
assert.strictEqual(l3Evidence.filter((row) => row.l3ReviewStatus === "OUT_OF_SCOPE_HOLD").length, runtime.counts.routeOut);
assert.strictEqual(l4Evidence.filter((row) => row.l4ReviewStatus === "FINAL").length, runtime.counts.finalL4);
assert.strictEqual(l4Evidence.filter((row) => row.l4ReviewStatus === "EXPLICIT_HOLD").length, runtime.counts.explicitL4Hold);

const currentQuestionMetadata = new Map(readJson("archive/data/question_metadata.json").records.map((row) => [row.questionUid, row]));
const identityByUid = new Map(readJson("archive/data/question_identity_map.json").records.map((row) => [row.questionUid, row]));
const registry = loadActiveMetaRegistry(root);
assert.strictEqual(registry.status, "ACTIVE", registry.errors.join("|"));
const nativeSources = new Map();
const nativeApprovals = new Map();
const nativeInputs = [];
function nativeInput(metadata, row) {
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
    registry, source, ordinal, runtimeOwner: runtime.packId,
    nativeSource: { ...sourceBinding, runtimeRecord: row, runtimeStatus: runtime.status }
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
  if (question.questionUid) assert.strictEqual(question.questionUid, identity.questionUid, label);
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
  const receiptPath = nativeReviewReceipt({ ...input, pt: context.pt, tpl: context.tpl });
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
for (const row of [...currentReviewedRows, ...additionalReviewedRows]) {
  const metadata = currentQuestionMetadata.get(row.questionUid);
  assert(metadata, row.questionUid);
  if (["FINAL_QA", "REVIEW2"].includes(metadata.metadataApprovalType)) {
    const input = nativeInput(metadata, row);
    nativeApprovals.set(row.questionUid, assertNativeApproval(input, row.questionUid));
    nativeInputs.push(input);
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

if (nativeInputs.length) {
  const input = nativeInputs[0];
  const rejects = (candidate, label) => {
    assert.throws(() => assertNativeApproval(candidate, label), { name: "AssertionError" }, label);
  };
  const cases = [
    ["approval flag without evidence", { current: { ...input.current, approvalEvidence: [] } }],
    ["metadata differs from receipt", { current: { ...input.current, fieldStatus: { ...input.current.fieldStatus, problemType: "manual_review_pending" } } }],
    ["different UID", { identity: { ...input.identity, questionUid: "unregistered-native-uid" } }],
    ["different source ordinal", { identity: { ...input.identity, sourceOrdinal: input.ordinal + 1 } }],
    ["template belongs to another problem type", { registry: { ...input.registry, templates: new Map(input.registry.templates).set(input.current.templateKey, { ...input.registry.templates.get(input.current.templateKey), parentProblemTypeKey: "PT_NOT_THE_REGISTERED_PARENT" }) } }],
    ["changed student payload", { question: { ...input.question, content: "changed student payload fixture" } }],
    ["different source bytes", { nativeSource: { ...input.nativeSource, bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } }],
    ["different Git blob", { nativeSource: { ...input.nativeSource, blobSha1: "0".repeat(40) } }],
    ["runtime differs from receipt", { nativeSource: { ...input.nativeSource, runtimeRecord: { ...input.nativeSource.runtimeRecord, tagStatus: "review_required" } } }],
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
      nativeApprovals.has(row.questionUid), row.questionUid);
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
