const assert = require("assert");
const fs = require("fs");
const path = require("path");
const C = require("../archive/archive2-core.js");
const root = path.resolve(__dirname, "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const sourceKey = (file, ordinal) => C.normalizeFile(file) + "#" + Number(ordinal);
const runtime = readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const catalog = C.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const concepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const taxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
assert.strictEqual(runtime.packId, "INTEGRAL_CALCULUS");
assert.strictEqual(runtime.packVersion, "1.0.0");
assert.strictEqual(runtime.records.length, 135);
assert.strictEqual(runtime.taxonomyRows.length, 15);
assert.strictEqual(runtime.counts.defaultSelectable, 134);
assert.strictEqual(runtime.counts.supplementary, 1);
assert.strictEqual(runtime.counts.automaticEligibleExpected, 134);
assert.strictEqual(new Set(runtime.records.map((r) => r.questionUid)).size, 135);
assert.strictEqual(new Set(runtime.records.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, 135);
assert.deepStrictEqual(Object.fromEntries([1,2,3,4,5].map((b) => [b, runtime.records.filter((r) => r.difficultyBucket === b).length])), { 1: 20, 2: 44, 3: 38, 4: 25, 5: 8 });
const bySource = new Map(catalog.records.map((r) => [sourceKey(r.sourceFile, r.sourceOrdinal), r]));
let eligible = 0, supplementary = 0;
for (const overlay of runtime.records) {
  const base = bySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  assert(base, "catalog source row missing: " + overlay.sourceArchiveFile + "#" + overlay.sourceOrdinal);
  assert.strictEqual(base.questionUid, overlay.questionUid, "catalog UID mismatch: " + overlay.questionUid);
  const merged = {...base,...overlay,sourceFile:base.sourceFile,sourceOrdinal:base.sourceOrdinal,sourceQuestionNo:base.sourceQuestionNo,effectiveBrowseGrade:base.effectiveBrowseGrade,identityStatus:base.identityStatus,sourceStatus:base.sourceStatus,sourceFingerprint:base.sourceFingerprint,rawQuestionHash:base.rawQuestionHash,approvedSourceFingerprint:base.approvedSourceFingerprint,gradeConflict:base.gradeConflict,taxonomyStatus:"CONFIRMED",metadataConflicts:[],reviewStatus:"reviewed_pass"};
  const gate=C.eligibility(merged);
  if(overlay.defaultSelectable){assert.strictEqual(gate.ok,true,overlay.questionUid+": "+gate.reasons.join(","));eligible++;}
  else{assert.strictEqual(overlay.curriculumApplicability,"SUPPLEMENTARY_OUTSIDE_CORE");assert(gate.reasons.includes("applicability"));supplementary++;}
}
assert.strictEqual(eligible,134); assert.strictEqual(supplementary,1);
assert(taxonomy.problemTypes.some((x)=>x.problemTypeKey==="PT_DEFINITE_INTEGRAL_FUNCTION_RELATION"));
assert(taxonomy.templates.some((x)=>x.templateKey==="TPL_INTEGRAL_DEFINED_FUNCTION_ANALYSIS"));
for(const key of ["CC_FUNCTIONAL_EQUATION","CC_FUNCTION_CONTINUITY","CC_FUNCTION_EXTREMA","CC_FUNCTION_LIMIT","CC_FUNCTION_SYMMETRY","CC_ONE_TO_ONE_FUNCTION","CC_PERIODIC_FUNCTION","CC_FUNCTION_MONOTONICITY"]) assert(concepts.concepts.some((x)=>x.conceptKey===key),key);
assert.strictEqual(receipt.status,"PASS_INTEGRAL_CALCULUS_135_CATALOG_JOIN");
assert.strictEqual(receipt.checked.integralCalculusRuntimeRecords,135);
assert.strictEqual(receipt.checked.integralCalculusAutomaticEligibleExpected,134);
assert.strictEqual(receipt.checked.combinedRuntimeRecords,1598);
console.log("PASS MathII integral Meta Foundation Archive2 runtime bridge");
