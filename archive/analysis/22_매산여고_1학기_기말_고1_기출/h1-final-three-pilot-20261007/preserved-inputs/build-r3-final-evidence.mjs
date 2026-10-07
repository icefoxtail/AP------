import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
const [root,ev,asset,js]=process.argv.slice(2);
const sha=b=>createHash("sha256").update(b).digest("hex");
const r2Path=path.join(ev,"R2.evidence.json"),r1Path=path.join(ev,"R1.evidence.json");
const r1ReportPath=path.join(ev,"R1.validator.q4-formatting-final.raw.json"),r2ReportPath=path.join(ev,"R2.validator.raw.json");
const r2=JSON.parse(fs.readFileSync(r2Path,"utf8"));
const raw=fs.readFileSync(js),assetDir=path.join(asset,"assets");
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(d,x.name)):[path.join(d,x.name)]);
const assetSet=walk(assetDir).map(p=>({path:path.relative(asset,p).replaceAll("\\","/"),sha256:sha(fs.readFileSync(p))})).sort((a,b)=>a.path.localeCompare(b.path));
const notes={
4:"The source-backed delimiters and line breaks repair the original q4 MathJax error and q4 horizontal overflow; PDF words/math tokens, choices, answer and solution are unchanged. All six actual cases show q4 without clipping.",
6:"R1/R2 final closure clears the stale q6 item status; angle-bisector answer and solution render fully.",
7:"Current choice ③ and solution range render completely with the final choice label.",
11:"Two absolute-value branches and the eight integer k values remain readable with no clipping.",
13:"Choice ③ and final equivalent quadratic inequality are visible; no flow or clipping issue.",
16:"Minimum-radius case comparison, post-freeze adjudication and final choice fit within the solution card.",
17:"Endpoint maximum and four segment minima, including AB projection, are visible in the solution flow.",
20:"Answer range, interval proof and direct solution-SVG dependency render completely."
};
const ids=[4,6,7,11,13,16,17,20];
const r1Bytes=fs.readFileSync(r1Path),r2Bytes=fs.readFileSync(r2Path);
const r1vBytes=fs.readFileSync(r1ReportPath),r2vBytes=fs.readFileSync(r2ReportPath);
const capturePath=".tmp/archive/h1-final-three-pilot-20261007/22_매산여고_1학기_기말_고1_기출/capture-04/machine-capture.json";
const captureBytes=fs.readFileSync(path.resolve(root,capturePath));
const capture=JSON.parse(captureBytes.toString("utf8"));
const reviewPath="archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R3.capture-review.json";
const reviewBytes=fs.readFileSync(path.resolve(root,reviewPath));
const evOut={
schemaVersion:"JS_ARCHIVE_STAGE_EVIDENCE_v2",stage:"R3",examUid:"22_매산여고_1학기_기말_고1_기출",runId:"h1-final-three-pilot-20261007",
executionLine:"CODEX",qualityContractVersion:"JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006",
artifactSha:r2.artifactSha,artifactRawSha256:sha(raw),validatorRawBufferBlobSha1:r2.validatorRawBufferBlobSha1,gitCleanFilterBlobSha1:r2.gitCleanFilterBlobSha1,
finalDisposition:"R3_RELEASE_READY",evidenceStatus:"R3_RELEASE_READY",itemHoldCount:0,itemHoldQids:[],denominator:22,
targetedScope:{openFindingQids:[],changedQids:[4,6,7,11,13,16,17],directDependencyQids:[20]},
lockedScopeIntegrity:true,releaseIntegrity:true,
reviewerIdentity:{role:"archive_r3",reviewerId:"/root/r3_maesan2022"},
rows:ids.map(qid=>({qid,verdict:"PASS",disposition:"TARGETED_RENDER_REVIEW_PASS",reason:notes[qid],r1EvidenceRef:"R1.evidence.json",r2EvidenceRef:"R2.evidence.json",captureReviewRef:"R3.capture-review.json"})),
artifactDispositions:r2.artifactDispositions,
upstreamBindings:{
 R1:{evidence:{path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R1.evidence.json",sha256:sha(r1Bytes)},validator:{path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R1.validator.q4-formatting-final.raw.json",sha256:sha(r1vBytes)},artifactSha:r2.artifactSha},
 R2:{evidence:{path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R2.evidence.json",sha256:sha(r2Bytes)},validator:{path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R2.validator.raw.json",sha256:sha(r2vBytes)},artifactSha:r2.artifactSha}
},
render:{status:"ACTUAL_CAPTURE_REVIEW_PASS",captureReport:{path:capturePath,sha256:sha(captureBytes)},captureReview:{path:reviewPath,sha256:sha(reviewBytes)},engine:{path:"archive/engine.html",sha256:capture.engine.sha256},collector:"archive/tools/capture-codex-exam.mjs",loadedJs:capture.loadedJs,caseIds:capture.cases.map(c=>c.id),allQids:capture.qids,reviewedQidsPerCase:22,allMathJaxErrors:capture.cases.every(c=>c.metrics.mathErrors===0),allAssetsDecoded:capture.cases.every(c=>c.metrics.images.every(i=>i.decoded)),allCasesMechanicalPass:capture.cases.every(c=>c.mechanicalStatus==="PASS"),failedAttemptLedger:{path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R3.render-attempt-ledger.json",sha256:"bd82ea7faa58edc78f097fc26630b08ddba114812472e51afaebe26969ebd57d"}},
repairs:[
 {path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R3.q4-math-encoding-repair.json",sha256:"a25af3e1900b5eeb470f26fde088b15ab8eb922102837aa2d1ac69a87c99c730"},
 {path:"archive/analysis/22_매산여고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R3.q4-math-layout-repair.json",sha256:"d81f04c5f83ae527b520d4a2ce6658d31b53ee167b7dc5a18dbfb6f3acdc982b"}
],
assets:assetSet
};
if(capture.artifactSha!==evOut.artifactSha||capture.loadedJs.sha256!==sha(raw))throw Error("CAPTURE_ARTIFACT_BINDING_MISMATCH");
if(capture.cases.length!==6||!evOut.render.allCasesMechanicalPass||!evOut.render.allMathJaxErrors||!evOut.render.allAssetsDecoded)throw Error("CAPTURE_CASE_INTEGRITY_FAIL");
const out=path.join(ev,"R3.evidence.json");fs.writeFileSync(out,JSON.stringify(evOut,null,2)+"\n");
console.log(JSON.stringify({path:out,evidenceSha256:sha(fs.readFileSync(out)),artifactSha:evOut.artifactSha,artifactRawSha256:evOut.artifactRawSha256,rows:ids,assetCount:assetSet.length,r1EvidenceSha256:sha(r1Bytes),r1ValidatorSha256:sha(r1vBytes),r2EvidenceSha256:sha(r2Bytes),r2ValidatorSha256:sha(r2vBytes),captureReportSha256:evOut.render.captureReport.sha256}));
