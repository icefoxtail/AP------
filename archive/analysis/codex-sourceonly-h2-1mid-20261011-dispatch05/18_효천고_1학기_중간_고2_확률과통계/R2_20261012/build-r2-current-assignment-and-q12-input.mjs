import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root='C:/Users/USER/Desktop/AP------';
const run=path.join(root,'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05');
const exam='18_효천고_1학기_중간_고2_확률과통계';
const evidence=path.join(run,exam);
const r2=path.join(evidence,'R2_20261012');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const put=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const current=path.join(root,'archive/exams/original/high/h2/1mid',exam+'.js');
const rawSha='dea2930646d4426dc6838639d308bd2accd83786f43d640f11d9b891feb2e037';
const blobSha='811978c5226a9294fbbe5f2ae6b40ad74aa4e1ca';
const oldAssignment=path.join(run,'target-05.assignment.json');
const bundle=JSON.parse(fs.readFileSync(path.join(r2,'R2.current-student.bundle.v2.json')));
if(bundle.sourceRawSha256!==rawSha||bundle.questionCount!==22)throw Error('CURRENT_STUDENT_BUNDLE_BINDING_MISMATCH');
const q12=bundle.rows.find(r=>r.qid===12);
if(!q12)throw Error('Q12_STUDENT_ROW_MISSING');
put(path.join(r2,'R2.q12-student.bundle.json'),{schemaVersion:'JS_ARCHIVE_STUDENT_BUNDLE_V2',sourceRawSha256:rawSha,sourceRawBlobSha1:blobSha,questionCount:1,qids:[12],rows:[q12],adapterProvenance:{sourceBundleSha256:sha(path.join(r2,'R2.current-student.bundle.v2.json')),scope:'qid-12-direct-replacement-only',answersRead:false,originalBundleMutated:false}});

const assetNames=['q03.png','q06.png','q07.png','q21.png'];
const assetBase=path.join(root,'archive/assets/images',exam);
const assetRows=assetNames.map(name=>{const p=path.join(assetBase,name);return {ref:'assets/images/'+exam+'/'+name,sha256:sha(p),opened:true,reviewScope:'restored-problem-image-current-dependency-integrity; no answer ressolve'};});
put(path.join(r2,'R2.current-asset-reads.q03-q06-q07-q21.json'),assetRows.map(({reviewScope,...row})=>row));

const assignment={
 schemaVersion:'JS_ARCHIVE_CODEX_CURRENT_SOURCE_ASSIGNMENT_V1',
 runId:'codex-sourceonly-h2-1mid-20261011-dispatch05',stage:'R2',examUid:exam,
 worktreeRootAbsolute:root,
 workingJsAbsolute:current,
 assetRootAbsolute:path.join(root,'archive'),
 evidenceRootAbsolute:evidence,
 expectedCurrentSource:{rawSha256:rawSha,rawBufferGitBlobSha1:blobSha},
 sourceOrigin:'ITEM_RECOVERY_q12',
 supersedesAssignmentByCurrentSourceOnly:path.join(evidence,'ITEM_RECOVERY_q12/R1_qid_review/R1_q12_restored.complete.event.json'),
 historicalAssignment:{path:oldAssignment,sha256:sha(oldAssignment),expectedSourceSha256:'1752d909f457dfee782397c9c961079eebefe5bd0f99fcee26580e337dd30cd9',preservedUnchanged:true},
 replacementAcceptanceEvent:{path:path.join(evidence,'ITEM_RECOVERY_q12/R1_qid_review/R1_q12_restored.complete.event.json'),sha256:'6728617048c45df33f1c7e0dadce5f2c1d44327397fcb10c7fcd87488c149ad4'},
 restorationReceipt:{path:path.join(evidence,'ASSET_RESTORATION_20261012/asset-restoration-receipt.json'),sha256:'7a37fe17b1673e69af4d57d9836dd0ced93b763ed17b269e5c752cf51ac6f88c'},
 currentStudentBundle:{path:path.join(r2,'R2.current-student.bundle.v2.json'),sha256:sha(path.join(r2,'R2.current-student.bundle.v2.json')),qidOrder:bundle.qids,questionCount:bundle.questionCount},
 scopedBlindStudentBundle:{path:path.join(r2,'R2.q12-student.bundle.json'),sha256:sha(path.join(r2,'R2.q12-student.bundle.json')),qids:[12]},
 currentRestoredAssets:assetRows.map(({reviewScope,...r})=>({path:path.join(assetBase,path.basename(r.ref)),...r})),
 priorFullFreeze:{path:path.join(r2,'R2.original-freeze.json'),sha256:sha(path.join(r2,'R2.original-freeze.json')),preserveImmutable:true},
 priorR2Evidence:{path:path.join(r2,'R2.evidence.rev2.json'),sha256:sha(path.join(r2,'R2.evidence.rev2.json')),reuseUnaffectedQidsOnly:true},
 nextRosterTarget:'NONE'
};
put(path.join(r2,'R2.current-source-assignment.rev1.json'),assignment);
console.log(JSON.stringify({assignmentPath:path.join(r2,'R2.current-source-assignment.rev1.json'),assignmentSha256:sha(path.join(r2,'R2.current-source-assignment.rev1.json')),scopedBundlePath:path.join(r2,'R2.q12-student.bundle.json'),scopedBundleSha256:sha(path.join(r2,'R2.q12-student.bundle.json')),assetReadsPath:path.join(r2,'R2.current-asset-reads.q03-q06-q07-q21.json'),assetReadsSha256:sha(path.join(r2,'R2.current-asset-reads.q03-q06-q07-q21.json'))},null,2));
