const { runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Archive2Core = require("../archive/archive2-core.js");

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
assert.strictEqual(runtime.packVersion, "1.0.3");
assert.strictEqual(runtime.records.length, 975);
assert.strictEqual(runtime.counts.records, 975);
assert.strictEqual(runtime.counts.finalL3, 921);
assert.strictEqual(runtime.counts.finalL4, 901);
assert.strictEqual(runtime.counts.explicitL4Hold, 20);
assert.strictEqual(runtime.counts.routeOut, 7);
assert.strictEqual(runtimeReceipt.checked.combinedRuntimeRecords, runtimeRecordCount);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueUid, runtimeRecordCount);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueSourceIdentity, runtimeRecordCount);
assert.strictEqual(runtime.counts.catalogUidDirectJoin, 975);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 0);
assert.strictEqual(runtimeReceipt.checked.middleGeometryCatalogJoin, 975);
assert.strictEqual(runtimeReceipt.checked.middleGeometryCatalogJoinMismatch, 0);
assert.strictEqual(runtimeReceipt.checked.metaFoundationRuntimePackCount, 11);
assert.strictEqual(runtime.counts.automaticEligibleExpected, 71);
assert.strictEqual(runtime.counts.defaultSelectable, 209);
assert.strictEqual(runtime.records.filter((row) => row.defaultSelectable).length, 209);
assert.strictEqual(new Set(runtime.records.map((row) => row.questionUid)).size, 975);
assert.strictEqual(new Set(runtime.records.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, 975);

const frozenRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.0");
const priorReviewedRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.2");
const currentReviewedRows = runtime.records.filter((row) => row.metaFoundationPackVersion === "1.0.3");
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
for (const row of currentReviewedRows) {
  const metadata = currentQuestionMetadata.get(row.questionUid);
  assert(metadata, row.questionUid);
  assert.strictEqual(metadata.metadataApprovalType, "META_PIPELINE_AUDIT", row.questionUid);
  assert.strictEqual(metadata.metadataStatus, "approved_semantic_review", row.questionUid);
  assert.strictEqual(metadata.sourceArchiveFile, row.sourceArchiveFile, row.questionUid);
  assert.strictEqual(Number(metadata.sourceOrdinal), Number(row.sourceOrdinal), row.questionUid);
  assert.strictEqual(metadata.metadataRevision, row.metadataRevision, row.questionUid);
  assert.strictEqual(metadata.sourceFingerprint, row.sourceFingerprint, row.questionUid);
  assert.strictEqual(row.sourceFingerprint, row.approvedSourceFingerprint, row.questionUid);
  assert(metadata.approvalEvidence.some((file) => file.endsWith(".source-parity.json")), row.questionUid);
  assert.strictEqual(metadata.l3Disposition, row.l3Disposition, row.questionUid);
  assert.strictEqual(metadata.l4Disposition, row.l4Disposition, row.questionUid);
  assert.strictEqual(metadata.problemTypeKey, row.problemTypeKey, row.questionUid);
  assert.strictEqual(metadata.templateKey, row.templateKey, row.questionUid);
  assert.deepStrictEqual(metadata.crossConceptKeys, row.crossConceptKeys);
  assert.deepStrictEqual(metadata.conditionKeys, row.conditionKeys);
}

const byUid = new Map(catalog.records.map((row) => [row.questionUid, row]));
const bySource = new Map(catalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
assert.strictEqual(runtime.records.filter((row) => {
  const direct = byUid.get(row.questionUid);
  const source = bySource.get(sourceKey(row.sourceArchiveFile, row.sourceOrdinal));
  return direct && source && direct.questionUid === source.questionUid &&
    sourceKey(direct.sourceFile, direct.sourceOrdinal) === sourceKey(row.sourceArchiveFile, row.sourceOrdinal);
}).length, 975);

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
    assert(["1.0.2", "1.0.3"].includes(row.metaFoundationPackVersion), row.questionUid);
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


(async () => {
  const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');
  const { data: overlaid, runtime: liveRuntime } = await productionCatalog();
  const runtimeUids = new Set(runtime.records.map(row => row.questionUid));
  const liveRows = liveRuntime.records.filter(row => runtimeUids.has(row.questionUid));
  assert.deepStrictEqual(JSON.parse(JSON.stringify(liveRows)), runtime.records);
  const joined = overlaid.records.filter(row => runtimeUids.has(row.questionUid));
  assert.strictEqual(joined.length, 975);
  assert.strictEqual(new Set(joined.map((row) => row.questionUid)).size, 975);
  assert.strictEqual(new Set(joined.map((row) => sourceKey(row.sourceFile, row.sourceOrdinal))).size, 975);
  const { catalog: canonicalCatalog } = require('./helpers/archive2-scope-harness.cjs');
  const expected = new Map(canonicalCatalog.records.map(row => [row.questionUid, row]));
  for (const row of joined) {
    const currentGate = Archive2Core.eligibility(row, { catalog: overlaid });
    assert.deepStrictEqual(currentGate, Archive2Core.eligibility(expected.get(row.questionUid), { catalog: canonicalCatalog }));
    assert.strictEqual(Archive2Core.eligibility(row).ok, false);
  }
  assert.strictEqual(overlaid.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_기출.js")).length, 23);
  console.log("PASS live Meta Foundation bridge preserves 975 runtime overlays and joins");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
