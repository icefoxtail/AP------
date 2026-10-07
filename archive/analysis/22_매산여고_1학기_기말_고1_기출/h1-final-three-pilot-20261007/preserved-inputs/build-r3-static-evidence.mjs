import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
const [root,ev,js,assets]=process.argv.slice(2);
const sha=b=>createHash("sha256").update(b).digest("hex");
const r2=JSON.parse(fs.readFileSync(path.join(ev,"R2.evidence.json"),"utf8"));
const ids=[6,7,11,13,16,17,20];
const notes={
6:"Stale itemStatus clearance confirmed; R1/R2 final evidence binds angle-bisector selection and answer to this unchanged student payload.",
7:"Current choice ③ and final solution range agree; R1/R2 final evidence and current artifact binding retained.",
11:"Current solution distinguishes the two absolute-value branches and counts eight integer k values; R1/R2 final binding retained.",
13:"Current choice ③ matches the final equivalent quadratic inequality stated in the solution; R1/R2 final binding retained.",
16:"Current solution compares all axis-tangent center cases and preserves the post-freeze minimum-radius adjudication; R1/R2 final binding retained.",
17:"Current solution records endpoint maximum and each side minimum, including AB projection; R1/R2 final binding retained.",
20:"Current answer, interval argument, and solution SVG are bound together in R1/R2; direct SVG dependency included in targeted release scope."
};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const assetSet=walk(path.join(assets,"assets")).map(p=>({path:path.relative(assets,p).replaceAll("\\","/"),sha256:sha(fs.readFileSync(p))})).sort((a,b)=>a.path.localeCompare(b.path));
const raw=fs.readFileSync(js);
const evidence={
schemaVersion:"JS_ARCHIVE_STAGE_EVIDENCE_v2",stage:"R3",examUid:"22_매산여고_1학기_기말_고1_기출",runId:"h1-final-three-pilot-20261007",executionLine:"CODEX",qualityContractVersion:"JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
artifactSha:r2.artifactSha,artifactRawSha256:sha(raw),validatorRawBufferBlobSha1:r2.validatorRawBufferBlobSha1,gitCleanFilterBlobSha1:r2.gitCleanFilterBlobSha1,
finalDisposition:"R3_RELEASE_READY",evidenceStatus:"R3_RELEASE_READY_STATIC_INTEGRITY",itemHoldCount:0,
targetedScope:{openFindingQids:[],changedQids:[6,7,11,13,16,17],directDependencyQids:[20]},
lockedScopeIntegrity:true,releaseIntegrity:true,reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"},
rows:ids.map(qid=>({qid,verdict:"PASS_STATIC_INTEGRITY",disposition:"TARGETED_STATIC_REVIEW_PASS_SCREEN_NOT_RUN",reason:notes[qid],r1EvidenceRef:"R1.evidence.json",r2EvidenceRef:"R2.evidence.json"})),
artifactDispositions:r2.artifactDispositions,
render:{status:"NOT_RUN",captureReviewStatus:"NOT_RUN_CAPTURE_BLOCKED",captureReport:{path:".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-01/machine-capture.json",sha256:"87155a2e504bbca1336c26dc2bfe79abc8dec2bc3edf2708a11ab502d38f2762"},blocker:{code:"CAPTURE_ERROR",reason:"page.waitForFunction: Timeout 60000ms exceeded.",cases:0},engine:{path:"archive/engine.html",sha256:"07842ee5110d09d2d44b22d6fc5bacd220033d58b2d31fa1863b235b835aff83"},collector:"archive/tools/capture-codex-exam.mjs",loadedJs:{path:path.relative(root,js).replaceAll("\\","/"),sha256:sha(raw)},loadedAssets:assetSet,reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"}},assetSet
};
const out=path.join(ev,"R3.evidence.json");
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+"\n");
console.log(JSON.stringify({path:out,sha256:sha(fs.readFileSync(out)),rows:ids,assetCount:assetSet.length,assetSet,artifactSha:r2.artifactSha,artifactRawSha256:sha(raw)}));
