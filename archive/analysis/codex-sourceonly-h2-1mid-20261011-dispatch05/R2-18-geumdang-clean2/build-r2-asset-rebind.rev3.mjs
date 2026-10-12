import fs from 'node:fs';
import path from 'node:path';
import {sha256,physical,writeFresh} from '../../../tools/archive-codex-artifact-io.mjs';

const dir='archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/R2-18-geumdang-clean2';
const uid='18_금당고_1학기_중간_고2_확률과통계';
const assetDir=`archive/assets/images/${uid}`;
const oldBundleFile=`${dir}/R2.student-only.bundle.rev2.json`;
const currentBundleFile=`${dir}/R2.student-only.bundle.asset-rebind.rev3.json`;
const freezeFile=`${dir}/R2.original-freeze.json`;
const r1ReviewedFile=`archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/${uid}/R1_reviewed_current_assets.rev2.json`;
const oldEvidenceFile=`${dir}/R2.evidence.v2.rebind.rev2.bound.json`;
const oldEventFile=`${dir}/R2.complete.event.rebind.rev2.json`;
const currentEvidenceFile=`${dir}/R2.evidence.asset-rebind.rev4.draft.json`;
const parityFile=`${dir}/R2.student-parity.asset-rebind.rev4.json`;
const expectedSourceSha='808d84815eae068a30a2e8a8efa2209adb8dccd8abc4d779b2828b21c3c84301';
const expectedAssets={
  'q12.png':'00dcd64acc4a5a71809d15d6ea1ebd26c01bc6efc1db41389bd6b55a1ea37898',
  'q13.png':'d04453189b0546cd04493d755bc53b010ef1a00fb5fe88260d4d1115b15dbb86',
  'q11-solution.svg':'a9d318808d663ec05f758e0fa08ccd3c685afac6b03618d7a32d5bf9250de6e4',
  'q12-solution.svg':'f1b8e3ad99b5b8b81da65ba90684390550408176f7c3b80823f69472943edd50',
  'q13-solution.svg':'ac2bf5ea510a207e3203bbf6145185c648dcd609acbfb732c61e6ed089c9bd83',
};
const oldBundle=JSON.parse(fs.readFileSync(oldBundleFile,'utf8'));
const currentBundle=JSON.parse(fs.readFileSync(currentBundleFile,'utf8'));
const freeze=JSON.parse(fs.readFileSync(freezeFile,'utf8'));
const r1Reviewed=JSON.parse(fs.readFileSync(r1ReviewedFile,'utf8'));
const previous=JSON.parse(fs.readFileSync(oldEvidenceFile,'utf8'));
const oldEvent=physical(oldEventFile);
if(currentBundle.sourceRawSha256!==expectedSourceSha||oldBundle.sourceRawSha256!==expectedSourceSha)throw Error('SOURCE_SHA_MISMATCH');
if(currentBundle.questionCount!==22||JSON.stringify(currentBundle.qids)!==JSON.stringify(Array.from({length:22},(_,i)=>i+1)))throw Error('CURRENT_BUNDLE_DENOMINATOR_OR_ORDER_MISMATCH');
if(JSON.stringify(oldBundle.qids)!==JSON.stringify(currentBundle.qids))throw Error('OLD_CURRENT_QID_ORDER_DIFF');
const studentDiffs=[];
for(let i=0;i<22;i++){
  const a=oldBundle.rows[i],b=currentBundle.rows[i];
  if(a.qid!==b.qid||JSON.stringify(a.student)!==JSON.stringify(b.student)||a.studentPayloadSha256!==b.studentPayloadSha256)studentDiffs.push(a.qid);
  const ar=(a.assets||[]).map(x=>x.ref).sort(),br=(b.assets||[]).map(x=>x.ref).sort();
  if(JSON.stringify(ar)!==JSON.stringify(br))throw Error(`STUDENT_ASSET_REFERENCE_DIFF_Q${a.qid}`);
}
if(studentDiffs.length)throw Error('STUDENT_PAYLOAD_DIFF:'+studentDiffs.join(','));
if(freeze.stage!=='R2'||freeze.sourceRawSha256===expectedSourceSha||freeze.bundleAdapterProvenance?.answersRead!==false)throw Error('ORIGINAL_FREEZE_NOT_REUSABLE_OR_NOT_BLIND');
const reviews=new Map(r1Reviewed.map(x=>[x.ref,x]));
const bindings=Object.entries(expectedAssets).map(([name,want])=>{
  const ref=`assets/images/${uid}/${name}`;
  const file=path.resolve(assetDir,name),actual=physical(file);
  if(actual.sha256!==want)throw Error('RESTORED_ASSET_SHA_MISMATCH:'+name);
  const ack=reviews.get(ref);
  if(!ack||ack.sha256!==want||ack.reviewed!==true)throw Error('R1_CURRENT_ASSET_ACK_MISSING:'+name);
  return {kind:'CURRENT_ASSET',ref,sha256:want};
});
const oldStudentAssetMap=new Map(oldBundle.rows.flatMap(r=>(r.assets||[]).map(a=>[a.ref,a.sha256])));
const currentStudentAssetMap=new Map(currentBundle.rows.flatMap(r=>(r.assets||[]).map(a=>[a.ref,a.sha256])));
const changedStudentAssets=[...currentStudentAssetMap].filter(([ref,hash])=>oldStudentAssetMap.get(ref)!==hash).map(([ref,sha256])=>({ref,previousSha256:oldStudentAssetMap.get(ref)||null,currentSha256:sha256}));
if(changedStudentAssets.length!==1||changedStudentAssets[0].ref!==`assets/images/${uid}/q13.png`)throw Error('EXPECTED_Q13_ONLY_STUDENT_ASSET_RESTORE');
const parity={schemaVersion:'JS_ARCHIVE_R2_CURRENT_STUDENT_PARITY_V1',revision:4,oldBundle:physical(oldBundleFile),currentBundle:physical(currentBundleFile),originalFreeze:physical(freezeFile),sourceRawSha256:expectedSourceSha,qidOrderExact:true,questionCountExact:true,studentPayloadsExact:true,problemAssetRefsExact:true,problemAssetBytesExact:false,changedStudentAssets,changedStudentAssetsR1Reviewed:true,freezeReusableWithoutResolve:true,answersRead:false,changedSolutionAssets:bindings.filter(x=>x.ref.endsWith('.svg')).map(x=>({ref:x.ref,sha256:x.sha256,reviewedByR1:true}))};
writeFresh(parityFile,parity);
const evidence=structuredClone(previous);
evidence.currentStudentBundle=physical(currentBundleFile);
evidence.studentParityRebind={...physical(parityFile),revision:4,qidOrderExact:true,questionCountExact:true,studentPayloadsExact:true,problemAssetRefsExact:true,problemAssetBytesExact:false,freezeReusableWithoutResolve:true};
evidence.assetReads=currentBundle.rows.flatMap(row=>(row.assets||[]).map(a=>({qid:row.qid,...a}))).filter(a=>[12,13].includes(Number(a.qid))).map(a=>({ref:a.ref,sha256:a.sha256,opened:true,openedBy:'archive_r2',currentBundleSha256:physical(currentBundleFile).sha256}));
evidence.currentAssetBindings=bindings;
evidence.assetRebind={schemaVersion:'JS_ARCHIVE_R2_ASSET_REBIND_V1',revision:4,priorEvidence:physical(oldEvidenceFile),r1CurrentAssetReview:physical(r1ReviewedFile),reviewedAssetCount:bindings.length,bindings,changedStudentAssets,changedSolutionAssets:bindings.filter(x=>x.ref.endsWith('.svg')).map(x=>x.ref),originalFreezePreserved:physical(freezeFile),noResolve:true};
evidence.technicalRebind={schemaVersion:'JS_ARCHIVE_R2_TECHNICAL_REBIND_V1',revision:4,previousEvidence:physical(oldEvidenceFile),previousCompletionEvent:oldEvent,scope:{changedQids:[13],changedStudentFields:[],changedProblemAssets:[13],changedSolutionAssets:[11,12,13],changedBlindAnswers:[],reason:'Restored canonical target03 problem/solution assets after storage loss. q13 is a documented 300-DPI source-PDF recrop; q12 problem PNG bytes are exact recovery. Student payloads and all problem-image references are unchanged; R1 directly reviewed every current PNG/SVG. Original blind freeze remains preserved and is reused without re-solving.'},originalFreezePreserved:{...physical(freezeFile),reusedWithoutRefreeze:true},noResolve:true,nextStage:'R3'};
writeFresh(currentEvidenceFile,evidence);
console.log(JSON.stringify({parity:physical(parityFile),evidence:physical(currentEvidenceFile),changedStudentAssets,reviewedAssetCount:bindings.length,originalFreezePreserved:physical(freezeFile),rows:22,answersRead:false}));
