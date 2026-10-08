import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {physical,writeFresh,inside} from '../../tools/archive-codex-artifact-io.mjs';
import {validateCodexRenderReceipt} from '../../tools/archive-codex-closeout-v2.mjs';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const run='archive-2026-1mid-nine-20261008',base=path.join(root,'archive/analysis',run);
const row=JSON.parse(fs.readFileSync(path.join(base,'roster.json')))[Number(process.argv[2])-1];
const dir=row.evidenceRootAbsolute,packet=JSON.parse(fs.readFileSync(path.join(dir,'R3.assignment.json')));
const captureHead=packet.expectedHead,currentHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const approved=packet.approvedCapture;
for(const [file,expected] of [[approved.engineAbsolute,approved.engineSha256],[approved.currentCssAbsolute,approved.currentCssSha256],[approved.runnerAbsolute,approved.runnerSha256]])if(physical(file).sha256!==expected)throw Error('APPROVED_RENDER_INPUT_DRIFT');
const source=physical(row.workingJsAbsolute),production=physical(inside(root,row.productionRelativePath));
if(source.sha256!==packet.artifactRawSha256||production.sha256!==source.sha256)throw Error('SOURCE_RENDER_INPUT_DRIFT');
for(const asset of packet.requiredAssets)if(physical(asset.path).sha256!==asset.sha256||physical(inside(root,'archive/'+asset.ref)).sha256!==asset.sha256)throw Error('ASSET_RENDER_INPUT_DRIFT');
const engine=fs.readFileSync(approved.engineAbsolute,'utf8'),staticPaths=new Set(['archive/engine.html','archive/archive2-preview-mobile.css']);
for(const match of engine.matchAll(/<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["']([^"']+)["']/gi)){
 const ref=match[1].split('?')[0];if(/^(?:https?:|data:|#)/.test(ref))continue;
 const relative=path.posix.normalize('archive/'+ref);if(fs.existsSync(inside(root,relative)))staticPaths.add(relative);
}
const changed=execFileSync('git',['diff','--name-only',captureHead,currentHead,'--',...staticPaths,'archive/vendor'],{encoding:'utf8'}).trim();
if(changed)throw Error('STATIC_RENDER_DEPENDENCY_CHANGED:'+changed);
const receiptPath=path.join(dir,'ROOT.production.render.receipt.json'),receipt=JSON.parse(fs.readFileSync(receiptPath));
const result=validateCodexRenderReceipt({receipt,root,artifactSha:packet.validatorRawBufferBlobSha1,assets:packet.requiredAssets.map(a=>({ref:a.ref,sha256:a.sha256})),qids:packet.allowedQids||packet.qids});
if(!result.ok)throw Error('EXISTING_ACTUAL_RENDER_RECEIPT_INVALID:'+result.issues.join(','));
console.log(JSON.stringify(writeFresh(path.join(dir,'ROOT.render-inputs-unchanged-rebase-proof.json'),{
 schemaVersion:'ROOT_UNCHANGED_RENDER_INPUT_REBASE_BINDING_V1',examUid:row.examUid,decisionAuthority:'ROOT_DELEGATED',
 disposition:'VALID_PRIOR_ACTUAL_R3_RECEIPT_REUSED_FOR_UNCHANGED_RENDER_INPUTS',captureHead,currentHead,
 source,production,engine:physical(approved.engineAbsolute),css:physical(approved.currentCssAbsolute),runner:physical(approved.runnerAbsolute),
 staticDependencies:[...staticPaths].map(relativePath=>({relativePath,...physical(inside(root,relativePath))})),vendorTreeGitChanges:[],
 assets:packet.requiredAssets,priorActualR3RenderReceipt:physical(receiptPath),normalRenderReceiptValidation:{ok:true},
 newCapturePerformed:false,newScreenReviewAsserted:false,newRenderPassAsserted:false,
 registrationChangesAreBoundSeparatelyByCurrentTargetProjectionAndNonTargetInvariance:true
})));
