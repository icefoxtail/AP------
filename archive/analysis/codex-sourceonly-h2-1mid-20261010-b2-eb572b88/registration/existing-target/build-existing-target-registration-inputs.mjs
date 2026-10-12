import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import core from '../../../../archive2-core.js';
import { gitBlobSha } from '../../../../tools/archive-stage-validator-compat-v1.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../..');
const relRoot='archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration/existing-target';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const configs=[
 {examUid:'24_순천고_1학기_중간_고2_확률과통계',production:'archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_확률과통계.js',r1:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R1.evidence.negative-golden-rebound.rev3.current-source-bound.json',r1Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R1.generic.latest-main.rev2.json',r2:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R2.evidence.current-source-bound.json',r2Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R2.generic.latest-main.json',r3:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R3.evidence.current-bound.json',r3Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R3.generic.latest-main.json',preserved:['archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R1.rebound-prebind.json','archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천고_고2_확통/R2.rebound-prebind.json']},
 {examUid:'24_순천여고_1학기_중간_고2_수학I',production:'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_수학I.js',r1:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R1.final-production-rebind/R1.final-production.evidence.negative-bound.rev1.json',r1Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R1.final-production-rebind/R1.final-production.generic.latest-main.rev3.json',r2:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R2.final-production-rebind/R2.evidence.v2.rev2.json',r2Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R2.final-production-rebind/R2.generic.latest-main.json',r3:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R3.evidence.bound.rev1.json',r3Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R3.generic.latest-main.json',preserved:['archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R1.rebound-prebind.json','archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/R3_24_순천여고_고2_수학I/R2.rebound-prebind.json']},
 {examUid:'24_순천여고_1학기_중간_고2_확률과통계',production:'archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_확률과통계.js',r1:'archive/analysis/r1_suncheon_yeo_prob/R1.q22.question-only.combined-v2-evidence.main-rebind3.bound.json',r1Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/R1.generic.latest-main.rev2.json',r2:'archive/analysis/r2_suncheon_yeo_prob/R2.q22-candidate-combined.evidence.rev2.json',r2Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/R2.generic.latest-main.json',r3:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/R3_20261011/R3.evidence.durable.release.json',r3Report:'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/R3_20261011/R3.generic.latest-main.json',preserved:['archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/history/original-source.js','archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/question-only-q22/history/original-q22-hold.json']},
];
const head=execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
for(const c of configs){
 const outDir=path.join(root,relRoot,c.examUid); if(fs.existsSync(outDir)) throw new Error('FRESH_TARGET_REGISTRATION_INPUT_DIR_REQUIRED:'+c.examUid); fs.mkdirSync(outDir,{recursive:true});
 const source=fs.readFileSync(path.join(root,c.production)); const sourceRawSha256=sha(source),sourceBlobSha1=gitBlobSha(source);
 const currentProofManifestPath=path.relative(root,path.join(outDir,'current-stage-proof-set.json')).replaceAll('\\','/');
 const originalProofs=[];
 const snapshotRelative=`${relRoot}/${c.examUid}/original-source-from-origin-main.js`;
 const baseline=execFileSync('git',['-C',root,'show',`origin/main:${c.production}`]);
 fs.writeFileSync(path.join(root,snapshotRelative),baseline);
 originalProofs.push({path:snapshotRelative,sha256:sha(baseline)});
 for(const p of c.preserved){const full=path.join(root,p);if(fs.existsSync(full))originalProofs.push({path:p,sha256:sha(fs.readFileSync(full))});}
 const proofs=[];for(const [stage,evidencePath,reportPath] of [['R1',c.r1,c.r1Report],['R2',c.r2,c.r2Report],['R3',c.r3,c.r3Report]]){
  const evidenceBytes=fs.readFileSync(path.join(root,evidencePath)); const report=JSON.parse(fs.readFileSync(path.join(root,reportPath),'utf8'));
  if(report.ok!==true||report.disposition!=='PASS'||report.qualityContractVersion!=='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006'||report.executionLine!=='CODEX')throw new Error('CURRENT_STAGE_REPORT_NOT_PASS:'+stage+':'+c.examUid);
  proofs.push({stage,path:evidencePath,sha256:sha(evidenceBytes)});
 }
 const proofManifest={schemaVersion:'JS_ARCHIVE_CURRENT_STAGE_PROOF_SET_V1',runId:'codex-sourceonly-h2-1mid-20261010-b2-eb572b88',examUid:c.examUid,productionRelativePath:c.production,artifactRawSha256:sourceRawSha256,artifactBlobSha1:sourceBlobSha1,proofs,originalProofs};
 const proofBytes=Buffer.from(JSON.stringify(proofManifest,null,2)+'\n');fs.writeFileSync(path.join(outDir,'current-stage-proof-set.json'),proofBytes);
 const examBox={window:{}};vm.runInNewContext(source.toString('utf8'),examBox,{filename:c.production,timeout:5000});const bank=examBox.window.questionBank||examBox.window.questions;
 const refs=new Set(); for(const q of bank){for(const v of [q.image,q.solutionImage])if(typeof v==='string'&&v.startsWith('assets/'))refs.add(v);for(const field of ['content','solution'])for(const m of String(q[field]||'').matchAll(/(?:src|href)=["'](assets\/[^"']+)["']/gi))refs.add(m[1]);}
 const releaseAssets=[...refs].sort().map(ref=>({ref,sha256:sha(fs.readFileSync(path.join(root,'archive',ref)))}));
 const assignment={schemaVersion:'JS_ARCHIVE_EXISTING_TARGET_REGISTRATION_ASSIGNMENT_V1',runId:proofManifest.runId,examUid:c.examUid,expectedHead:head,productionRelativePath:c.production,artifactRawSha256:sourceRawSha256,validatorRawBufferBlobSha1:sourceBlobSha1,questionCount:bank.length,currentStageProofManifestPath:currentProofManifestPath,currentStageProofManifestSha256:sha(proofBytes),releaseAssets,r1EvidencePath:c.r1,r1EvidenceSha256:sha(fs.readFileSync(path.join(root,c.r1))),r1ValidationPath:c.r1Report,r1ValidationSha256:sha(fs.readFileSync(path.join(root,c.r1Report)))};
 fs.writeFileSync(path.join(outDir,'assignment.json'),JSON.stringify(assignment,null,2)+'\n');
 fs.writeFileSync(path.join(outDir,'input-build.receipt.json'),JSON.stringify({schemaVersion:'ROOT_EXISTING_TARGET_REGISTRATION_INPUTS_V1',examUid:c.examUid,expectedHead:head,source:{path:c.production,rawSha256:sourceRawSha256,gitBlobSha1:sourceBlobSha1,questionCount:bank.length},proofManifest:{path:currentProofManifestPath,sha256:sha(proofBytes),proofs},preservedProofs:originalProofs,releaseAssetCount:releaseAssets.length,assignmentPath:path.relative(root,path.join(outDir,'assignment.json')).replaceAll('\\','/')},null,2)+'\n');
 console.log(c.examUid,JSON.stringify({rawSha256:sourceRawSha256,blob:sourceBlobSha1,proofs:proofs.map(x=>x.stage),releaseAssets:releaseAssets.length,out:path.relative(root,outDir).replaceAll('\\','/')}));
}
