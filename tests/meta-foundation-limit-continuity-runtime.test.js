// Historical overlay source-readiness counts are distinct from current canonical release gates.
const { catalog: canonicalCatalog } = require("./helpers/archive2-scope-harness.cjs");
const { assertCanonicalRuntimeGate, runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const C = require("../archive/archive2-core.js");

const root = path.resolve(__dirname, "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const readText = (p) => fs.readFileSync(path.join(root, p), "utf8");
const sourceKey = (file, ordinal) => C.normalizeFile(file) + "#" + Number(ordinal);

const runtime = readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const catalog = C.decodeCatalog(readJson("archive/data/archive2-catalog.json"));

assert.strictEqual(runtime.packId, "LIMIT_CONTINUITY");
// 하한(기준일 2026-11-02): 등록이 늘면 자연히 증가하므로 정확한 개수 대신 "줄어들지 않음"만 검사한다.
const total = runtime.records.length;
assert(total >= 184, `limit/continuity runtime records shrank: ${total}`);
assert.strictEqual(
  runtime.records.filter((r) => r.standardUnitKey === "H15-M2-01").length +
  runtime.records.filter((r) => r.standardUnitKey === "H15-M2-02").length, total);
assert.strictEqual(new Set(runtime.records.map((r) => r.questionUid)).size, total);
assert.strictEqual(new Set(runtime.records.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, total);
assert.strictEqual(runtime.records.filter((r) => r.catalogIdentityRepairVerified === true).length, 3);
assert.strictEqual(runtime.counts.catalogUidDirectJoin, 181);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, 3);
assert.strictEqual(runtime.counts.automaticEligibleExpected, 133);
assert.strictEqual(runtime.counts.difficultyDeferred, 0);
assert(runtime.taxonomyRows.length >= 33, `limit/continuity taxonomy rows shrank: ${runtime.taxonomyRows.length}`);
assert.strictEqual(new Set(runtime.records.map((r) => r.problemTypeKey)).size, 10);
assert.strictEqual(new Set(runtime.records.map((r) => r.templateKey)).size, 31);
const limitRows = runtime.records.filter((r) => r.standardUnitKey === "H15-M2-01");
const limitDistribution = Object.fromEntries([1,2,3,4,5].map((bucket) => [bucket, limitRows.filter((r) => r.difficultyBucket === bucket).length]));
assert.deepStrictEqual(limitDistribution, { 1: 24, 2: 24, 3: 32, 4: 21, 5: 3 });
assert.strictEqual(limitRows.filter((r) => r.metaFoundationDifficultyStatus === "FRESH_BLIND_RECHECK_PASS").length, 104);
assert.strictEqual(limitRows.filter((r) => ["high","medium","low"].includes(r.difficultyConfidence)).length, 104);
assert.strictEqual(limitRows.filter((r) => ["NONE","B12","B23","B34","B45"].includes(r.difficultyBoundaryFlag)).length, 104);
assert.strictEqual(limitRows.filter((r) => ["NORMAL","BORDERLINE_ACCEPTABLE","STRONG_CONFLICT"].includes(r.legacyLevelCompatibility)).length, 104);
assert.strictEqual(runtime.runtimeVersion, "LIMIT_CONTINUITY@1.1.0/runtime-bridge-v4");


const compiledTaxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const compiledConcepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const ptLabels = new Map(compiledTaxonomy.problemTypes.map((r) => [r.problemTypeKey, r.canonicalLabelKo]));
const tplLabels = new Map(compiledTaxonomy.templates.map((r) => [r.templateKey, r.canonicalLabelKo]));
assert.strictEqual(ptLabels.has("PT_LIMIT_ORDER_SQUEEZE"), false);
assert.strictEqual(ptLabels.get("PT_LIMIT_VALUE_CALC"), "함수의 극한값 계산");
assert.strictEqual(tplLabels.get("TPL_LIMIT_SQUEEZE"), "함수의 대소 관계를 이용한 극한값 계산");
assert.strictEqual(tplLabels.get("TPL_PIECEWISE_RANGE_STITCH_BIJECTION"), "조각함수의 일대일대응 조건");
for (const key of ["CC_ABSOLUTE_VALUE_FUNCTION","CC_GREATEST_INTEGER_FUNCTION","CC_INVERSE_FUNCTION","CC_DERIVATIVE_VALUE","CC_DIFFERENTIABILITY","CC_SINE_LAW","CC_ZERO_MULTIPLICITY","CC_RADICAL_EXPRESSION","CC_ROOT_INTERSECTION_COUNT_FUNCTION","CC_FUNCTION_SYMMETRY"]) {
  assert(compiledConcepts.concepts.some((r) => r.conceptKey === key && r.status === "ACTIVE"), key);
}
const activeConceptKeys = new Set(compiledConcepts.concepts.filter((r) => r.status === "ACTIVE").map((r) => r.conceptKey));
assert.strictEqual(runtime.records.filter((r) => (r.crossConceptKeys || []).some((key) => !activeConceptKeys.has(key))).length, 0);

const bySource = new Map(catalog.records.map((r) => [sourceKey(r.sourceFile, r.sourceOrdinal), r]));
let direct = 0;
let repaired = 0;
let sourceReadyLimit = 0;
let sourceReadyContinuity = 0;
let sourceHoldLimit = 0;
let sourceHoldContinuity = 0;

for (const overlay of runtime.records) {
  const base = bySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  assert(base, "catalog source row missing: " + overlay.sourceArchiveFile + "#" + overlay.sourceOrdinal);
  const identityRepair = base.questionUid !== overlay.questionUid;
  if (identityRepair) {
    assert.strictEqual(base.questionUid, "");
    assert.strictEqual(overlay.catalogIdentityRepairVerified, true);
    repaired += 1;
  } else {
    direct += 1;
  }
  const merged = {
    ...base,
    ...overlay,
    sourceFile: base.sourceFile,
    sourceOrdinal: base.sourceOrdinal,
    sourceQuestionNo: base.sourceQuestionNo,
    effectiveBrowseGrade: base.effectiveBrowseGrade,
    identityStatus: identityRepair ? "VERIFIED" : base.identityStatus,
    sourceStatus: identityRepair ? "VERIFIED" : base.sourceStatus,
    sourceFingerprint: base.sourceFingerprint,
    rawQuestionHash: base.rawQuestionHash,
    approvedSourceFingerprint: base.approvedSourceFingerprint,
    gradeConflict: base.gradeConflict,
    taxonomyStatus: "CONFIRMED",
    metadataConflicts: [],
    reviewStatus: "reviewed_pass"
  };
  const gate = assertCanonicalRuntimeGate(overlay, canonicalCatalog);
  const held = !identityRepair && base.sourceStatus !== "VERIFIED";
  if (held) assert(gate.reasons.includes("source_release"), overlay.questionUid);

  if (overlay.standardUnitKey === "H15-M2-01") {
    if (held) sourceHoldLimit += 1; else sourceReadyLimit += 1;
  } else {
    if (held) sourceHoldContinuity += 1; else sourceReadyContinuity += 1;
  }
}

assert.strictEqual(direct + repaired, total);
assert.strictEqual(sourceReadyLimit + sourceReadyContinuity + sourceHoldLimit + sourceHoldContinuity, total);

assert.strictEqual(C.finderCourseGrade("수학II", "2015"), "고2");
assert.strictEqual(C.finderCourseGrade("수학II", "2022"), "고3");
assert(C.finderCourseKeys(runtime.taxonomyRows, { grade: "고2", curriculumKey: "2015" }).has("수학II"));

const workspace = readText("archive/archive2-workspace.js");
assert(/C\.subjectProjectionOptions\(filters\.grade\)/.test(workspace));
assert(/C\.finderMatches\(/.test(workspace));

const bridge = readText("archive/meta-foundation-runtime.js");
assert(bridge.includes("data/meta-foundation/runtime/limit-continuity-v1.json"));
assert(bridge.includes("Canonical.resolveCatalog"));
assert(bridge.includes("META_FOUNDATION_MULTI/runtime-bridge-v5:"));

const combined = [
  ...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,
  ...runtime.records,
  ...readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/derivative-v1.json").records
];
// 하한(기준일 2026-11-02): 여섯 팩 합계. 등록이 늘면 자연히 증가한다.
assert(combined.length >= 2122, `combined runtime records shrank: ${combined.length}`);
const byPack = receipt.checked.existingRuntimeRecordsByPack;
assert.strictEqual(combined.length, ["GEOMETRY_EQUATIONS", "SETS_PROPOSITIONS", "FUNCTIONS_GRAPHS", "LIMIT_CONTINUITY", "INTEGRAL_CALCULUS", "DERIVATIVE"]
  .reduce((sum, id) => sum + byPack[id], 0));
assert.strictEqual(new Set(combined.map((r) => r.questionUid)).size, combined.length);
assert.strictEqual(new Set(combined.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, combined.length);

assert.strictEqual(receipt.status, "ACTIVE");
assert.strictEqual(receipt.checked.combinedRuntimeRecords, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueUid, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueSourceIdentity, runtimeRecordCount);
assert.strictEqual(receipt.checked.limitContinuityCatalogJoin, total);
assert.strictEqual(receipt.checked.limitContinuityCatalogJoinMismatch, 0);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoin, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoinMismatch, 0);
assert.strictEqual(receipt.checked.limitContinuityAutomaticEligibleExpected, 133);
assert(receipt.invariants.includes("Archive2 Finder and Compose grade routing treat 2015 수학II as 고2."));

console.log("PASS MathII limit/continuity Archive2 runtime bridge");
