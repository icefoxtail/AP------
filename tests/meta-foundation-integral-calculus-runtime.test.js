// Historical overlay source-readiness counts are distinct from current canonical release gates.
const { catalog: canonicalCatalog } = require("./helpers/archive2-scope-harness.cjs");
const { assertCanonicalRuntimeGate, runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const C = require("../archive/archive2-core.js");
const root = path.resolve(__dirname, "..");
const readJson = p => JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const sourceKey = (file, ordinal) => C.normalizeFile(file) + "#" + Number(ordinal);
const runtime = readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const catalog = C.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
assert.strictEqual(runtime.packId,"INTEGRAL_CALCULUS");
assert.strictEqual(runtime.records.length,126);
assert.strictEqual(runtime.taxonomyRows.length,15);
assert.strictEqual(runtime.counts.catalogUidDirectJoin,53);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin,73);
assert.strictEqual(runtime.counts.defaultSelectable,125);
assert.strictEqual(runtime.counts.supplementary,1);
assert.strictEqual(new Set(runtime.records.map(r=>r.questionUid)).size,126);
assert.strictEqual(new Set(runtime.records.map(r=>sourceKey(r.sourceArchiveFile,r.sourceOrdinal))).size,126);
assert.strictEqual(runtime.records.filter(r=>r.catalogIdentityRepairVerified===true).length,73);
const bySource = new Map(catalog.records.map(r=>[sourceKey(r.sourceFile,r.sourceOrdinal),r]));
let direct=0,repaired=0,sourceReady=0,supplementary=0,sourceHold=0;
for(const overlay of runtime.records){
  const base=bySource.get(sourceKey(overlay.sourceArchiveFile,overlay.sourceOrdinal));
  assert(base,"catalog source row missing: "+overlay.sourceArchiveFile+"#"+overlay.sourceOrdinal);
  const repair=base.questionUid!==overlay.questionUid;
  if(repair){assert.strictEqual(base.questionUid,"");assert.strictEqual(overlay.catalogIdentityRepairVerified,true);repaired++;} else direct++;
  const merged={...base,...overlay,sourceFile:base.sourceFile,sourceOrdinal:base.sourceOrdinal,sourceQuestionNo:base.sourceQuestionNo,effectiveBrowseGrade:base.effectiveBrowseGrade,identityStatus:repair?"VERIFIED":base.identityStatus,sourceStatus:repair?"VERIFIED":base.sourceStatus,sourceFingerprint:base.sourceFingerprint,rawQuestionHash:base.rawQuestionHash,approvedSourceFingerprint:base.approvedSourceFingerprint,gradeConflict:base.gradeConflict,taxonomyStatus:"CONFIRMED",metadataConflicts:[],reviewStatus:"reviewed_pass"};
  const gate=assertCanonicalRuntimeGate(overlay, canonicalCatalog);
  if(!repair && base.sourceStatus!=="VERIFIED"){assert.strictEqual(gate.ok,false);assert(gate.reasons.includes("source_release"));sourceHold++;} else if(overlay.curriculumApplicability==="SUPPLEMENTARY_OUTSIDE_CORE"){assert.strictEqual(gate.ok,false);assert.strictEqual(overlay.defaultSelectable, false);supplementary++;} else {sourceReady++;}
}
assert.strictEqual(direct+repaired,126);assert.strictEqual(sourceReady,124);assert.strictEqual(supplementary,1);assert.strictEqual(sourceHold,1);
const combined=[...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,...readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json").records,...runtime.records,...readJson("archive/data/meta-foundation/runtime/derivative-v1.json").records];
assert.strictEqual(combined.length,1978);
assert.strictEqual(new Set(combined.map(r=>r.questionUid)).size,combined.length);
assert.strictEqual(new Set(combined.map(r=>sourceKey(r.sourceArchiveFile,r.sourceOrdinal))).size,combined.length);
assert.strictEqual(receipt.checked.combinedRuntimeRecords,runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueUid,runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueSourceIdentity,runtimeRecordCount);
assert.strictEqual(receipt.checked.integralCalculusRuntimeRecords,126);
assert.strictEqual(receipt.checked.integralCalculusAutomaticEligibleExpected,124);
console.log("PASS MathII integral Archive2 runtime bridge");
