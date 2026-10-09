import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {readExam,physical,sha256,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {verifyCompletion} from '../../tools/archive-codex-stage-kit.mjs';
import {validateCodexRenderReceipt} from '../../tools/archive-codex-closeout-v2.mjs';
import {buildStageState,consumeCodexRenderPass} from '../../tools/archive-stage-runtime-v2.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim(),run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const [target,eventRelative,eventSha,receiptRelative]=process.argv.slice(2),row=JSON.parse(fs.readFileSync(path.join(base,'roster.json'))).find(r=>r.examUid===target);
if(!row)throw Error('LOCKED_ROSTER_TARGET_REQUIRED');
const eventFile=inside(root,eventRelative),verified=verifyCompletion({root,eventFile,expectedEventSha256:eventSha}),event=JSON.parse(fs.readFileSync(eventFile));
if(event.stage!=='R3'||event.examUid!==target)throw Error('CURRENT_R3_COMPLETION_REQUIRED');
const source=readExam(row.workingJsAbsolute),receiptFile=inside(root,receiptRelative),receipt=JSON.parse(fs.readFileSync(receiptFile));
const assets=event.physicalSnapshot.assets.map(a=>({ref:a.ref,sha256:a.sha256})),qids=source.questions.map(q=>Number(q.id));
const renderIntake=consumeCodexRenderPass({state:buildStageState({stage:'RENDER',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX'}),receipt,root,artifactSha:source.rawBufferGitBlobSha1,assets,qids});
writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.render.intake.json'),{schemaVersion:'ROOT_ACTUAL_RENDER_INTAKE_V1',runId:run,examUid:target,receipt:physical(receiptFile),state:renderIntake.state,reviewerIdentity:receipt.r3ReviewerIdentity});
const mappings=[],relative=f=>path.relative(root,f).replaceAll('\\','/'),copyExact=(from,to)=>{
 const sourceFile=inside(root,from),dest=inside(root,to),bytes=fs.readFileSync(sourceFile);
 if(fs.existsSync(dest)&&sha256(fs.readFileSync(dest))!==sha256(bytes))throw Error('PRODUCTION_OR_DURABLE_TARGET_OVERLAP:'+to);
 fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest))fs.writeFileSync(dest,bytes,{flag:'wx'});
 const origin=physical(sourceFile),final=physical(dest);if(origin.sha256!==final.sha256)throw Error('PROMOTION_BYTES_MISMATCH');mappings.push({original:origin,final});return {path:relative(dest),sha256:final.sha256};
};
const production=inside(root,row.productionRelativePath);
copyExact(row.workingJsAbsolute,row.productionRelativePath);
for(const asset of event.physicalSnapshot.assets)copyExact(asset.path,'archive/'+asset.ref);
const durable=path.join(row.evidenceRootAbsolute,'render/durable'),rendered=structuredClone(receipt);
rendered.loadedJs={path:row.productionRelativePath,sha256:source.rawSha256};
const copyWitness=(ref,name)=>{if(!ref?.path||!ref.sha256)throw Error('PHYSICAL_WITNESS_REQUIRED');const sourceFile=inside(root,ref.path);if(physical(sourceFile).sha256!==ref.sha256)throw Error('WITNESS_SHA_CHANGED');return copyExact(sourceFile,path.join(durable,name));};
if(receipt.captureReport)rendered.captureReport=copyWitness(receipt.captureReport,'machine-capture.original.json');
if(receipt.review)rendered.review=copyWitness(receipt.review,'R3.capture-review.original.json');
for(const c of rendered.cases){
 for(let i=0;i<c.captures.length;i++)c.captures[i].image=copyWitness(c.captures[i].image,c.id.replace('/','-')+'-'+i+'.png');
 for(const asset of c.loadedAssets)asset.file={path:'archive/'+asset.ref,sha256:asset.sha256};
}
rendered.technicalPromotionProvenance={operation:'BYTE_IDENTICAL_PATH_PROMOTION',originalReceipt:physical(receiptFile),originalReviewerIdentityPreserved:true,sourceSemanticBytesChanged:false,assetBytesChanged:false,mappings};
const finalGate=validateCodexRenderReceipt({receipt:rendered,root,artifactSha:source.rawBufferGitBlobSha1,assets,qids});if(!finalGate.ok)throw Error('PROMOTED_RENDER_GATE_FAIL:'+finalGate.issues.join(','));
const finalReceipt=writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.production.render.receipt.json'),rendered);
writeFresh(path.join(row.evidenceRootAbsolute,'ROOT.promotion.receipt.json'),{schemaVersion:'ROOT_EXAM_BYTE_IDENTICAL_PROMOTION_V1',runId:run,examUid:target,stage:'PUBLICATION_READY',r3Event:physical(eventFile),workingJs:physical(row.workingJsAbsolute),productionJs:physical(production),artifactSha:source.rawBufferGitBlobSha1,renderReceipt:finalReceipt,assets,qids,mappings,gate:finalGate,createdAt:new Date().toISOString()});
console.log(JSON.stringify({examUid:target,status:'PRODUCTION_READY_NOT_COMMITTED',productionRelativePath:row.productionRelativePath,artifactSha:source.rawBufferGitBlobSha1,renderReceipt:finalReceipt,assets,qids}));
