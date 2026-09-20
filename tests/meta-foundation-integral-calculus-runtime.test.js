const assert = require("assert");
const fs = require("fs"); const path = require("path"); const C = require("../archive/archive2-core.js");
const root=path.resolve(__dirname,".."), readJson=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8")), readText=p=>fs.readFileSync(path.join(root,p),"utf8");
const sourceKey=(f,o)=>C.normalizeFile(f)+"#"+Number(o);
const runtime=readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json"), receipt=readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
const catalog=C.decodeCatalog(readJson("archive/data/archive2-catalog.json")), taxonomy=readJson("archive/data/meta-foundation/canonical/packs/integral-calculus/taxonomy.json");
const concepts=readJson("archive/data/meta-foundation/compiled/concept_registry.json");
assert.strictEqual(runtime.records.length,135); assert.strictEqual(runtime.taxonomyRows.length,15);
assert.strictEqual(new Set(runtime.records.map(r=>r.questionUid)).size,135); assert.strictEqual(new Set(runtime.records.map(r=>sourceKey(r.sourceArchiveFile,r.sourceOrdinal))).size,135);
assert.strictEqual(runtime.records.filter(r=>r.defaultSelectable===true).length,134);
assert.strictEqual(runtime.records.filter(r=>r.curriculumApplicability==="SUPPLEMENTARY_OUTSIDE_CORE").length,1);
assert.deepStrictEqual(Object.fromEntries([1,2,3,4,5].map(b=>[b,runtime.records.filter(r=>r.difficultyBucket===b).length])),{1:20,2:44,3:38,4:25,5:8});
assert.strictEqual(taxonomy.problemTypes.length,5); assert.strictEqual(taxonomy.templates.length,15);
for(const key of ["CC_FUNCTIONAL_EQUATION","CC_FUNCTION_CONTINUITY","CC_FUNCTION_EXTREMA","CC_FUNCTION_LIMIT","CC_FUNCTION_SYMMETRY","CC_ONE_TO_ONE_FUNCTION","CC_PERIODIC_FUNCTION","CC_FUNCTION_MONOTONICITY"]) assert(concepts.concepts.some(c=>c.conceptKey===key&&c.status==="ACTIVE"),"missing concept: "+key);
for(const key of ["CC_DIFFERENTIABILITY","CC_INVERSE_FUNCTION","CC_TANGENCY","CC_ABSOLUTE_VALUE_FUNCTION"]) assert(concepts.concepts.some(c=>c.conceptKey===key&&c.status==="ACTIVE"),"missing reused: "+key);
const bySource=new Map(catalog.records.map(r=>[sourceKey(r.sourceFile,r.sourceOrdinal),r])); let eligible=0,supplementary=0;
for(const overlay of runtime.records){const base=bySource.get(sourceKey(overlay.sourceArchiveFile,overlay.sourceOrdinal)); assert(base,"catalog source missing");
 assert.strictEqual(base.questionUid,overlay.questionUid,"catalog UID mismatch: "+overlay.questionUid);
 const merged={...base,...overlay,sourceFile:base.sourceFile,sourceOrdinal:base.sourceOrdinal,sourceQuestionNo:base.sourceQuestionNo,effectiveBrowseGrade:base.effectiveBrowseGrade,
 identityStatus:base.identityStatus,sourceStatus:base.sourceStatus,sourceFingerprint:base.sourceFingerprint,rawQuestionHash:base.rawQuestionHash,approvedSourceFingerprint:base.approvedSourceFingerprint,
 gradeConflict:base.gradeConflict,taxonomyStatus:"CONFIRMED",metadataConflicts:[],reviewStatus:"reviewed_pass"}; const gate=C.eligibility(merged);
 if(overlay.defaultSelectable===true){assert.strictEqual(gate.ok,true,overlay.questionUid+": "+gate.reasons.join(","));eligible++;}else{assert.deepStrictEqual(gate.reasons,["applicability"]);supplementary++;}}
assert.strictEqual(eligible,134); assert.strictEqual(supplementary,1);
const combined=[...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,...readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json").records,...runtime.records];
assert.strictEqual(combined.length,1598); assert.strictEqual(new Set(combined.map(r=>r.questionUid)).size,1598);
assert.strictEqual(new Set(combined.map(r=>sourceKey(r.sourceArchiveFile,r.sourceOrdinal))).size,1598);
assert(readText("archive/meta-foundation-runtime.js").includes("data/meta-foundation/runtime/integral-calculus-v1.json"));
assert.strictEqual(receipt.status,"PASS_INTEGRAL_CALCULUS_135_RUNTIME_JOIN"); assert.strictEqual(receipt.checked.combinedRuntimeRecords,1598);
console.log("PASS MathII integral Archive2 runtime bridge");