import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const assignment=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const receipt=JSON.parse(fs.readFileSync(path.join(assignment.evidenceRootAbsolute,'R1.fresh.q2-image-null-normalization.correction-receipt.json'),'utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const bytes=fs.readFileSync(assignment.workingJsAbsolute),rawSha=sha(bytes),blobSha=blob(bytes);
if(rawSha!==receipt.correctedCandidate.rawSha256||blobSha!==receipt.correctedCandidate.blobSha1)throw new Error('CORRECTED_CANDIDATE_BINDING_MISMATCH');
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(bytes.toString('utf8'),sandbox,{filename:assignment.workingJsAbsolute,timeout:5000});
const bank=sandbox.window.questionBank||sandbox.window.questions;
if(!Array.isArray(bank)||bank.length!==24)throw new Error('FULL_QID_DENOMINATOR_MISMATCH');
const qids=Array.from({length:24},(_,i)=>i+1), assets=new Map(), questions=[];
for(let i=0;i<bank.length;i++){
 const q=bank[i],id=Number(q.id);if(id!==qids[i])throw new Error('QID_ORDER_OR_ID_MISMATCH:'+id);
 if(typeof q.content!=='string'||!Array.isArray(q.choices))throw new Error('STUDENT_FIELDS_MISSING:'+id);
 const image=q.image??null;let assetSha256=null;
 if(image){const assetPath=path.resolve(assignment.assetRootAbsolute,image),assetRoot=path.resolve(assignment.assetRootAbsolute)+path.sep;if(!assetPath.startsWith(assetRoot))throw new Error('ASSET_PATH_ESCAPE:'+id);const b=fs.readFileSync(assetPath),h=sha(b);if(!b.length)throw new Error('EMPTY_ASSET:'+id);assetSha256=h;const prior=assets.get(image);if(prior&&(prior.sha256!==h||prior.bytes!==b.length))throw new Error('SAME_REF_BYTES_DIVERGE:'+image);assets.set(image,{ref:image,sha256:h,bytes:b.length});}
 const payload={id,content:q.content,choices:q.choices,image,assetSha256};questions.push({...payload,payloadSha256:sha(Buffer.from(JSON.stringify(payload),'utf8'))});
}
const q2=bank.find(q=>Number(q.id)===2);if(Object.hasOwn(q2,'image'))throw new Error('Q2_IMAGE_PROPERTY_STILL_PRESENT');
const oldBundle=JSON.parse(fs.readFileSync(assignment.studentBundleAbsolute,'utf8'));
if(sha(fs.readFileSync(assignment.studentBundleAbsolute))!==assignment.studentBundleSha256)throw new Error('OLD_BUNDLE_CHANGED_OR_MISMATCH');
for(let qid=1;qid<=24;qid++){
 const old=oldBundle.questions.find(q=>q.id===qid),now=questions.find(q=>q.id===qid);
 if(old.content!==now.content||JSON.stringify(old.choices)!==JSON.stringify(now.choices)||((old.image??null)!==now.image))throw new Error('STUDENT_FIELDS_CHANGED_Q'+qid);
}
for(const [qid,expected] of [[10,'21cd346bfa799230787c82e2cecf9e396d8f76eab80d56e48bfa964b6131547d'],[13,'8a20320138e0e70a1fc9f4f3c73a4551bc93838ea6b41d0f71090110a4f3defe']]){const q=questions.find(q=>q.id===qid);if(q.assetSha256!==expected)throw new Error('TARGET_ASSET_BINDING_MISMATCH:'+qid);}
const sourceRosterSha=sha(fs.readFileSync(assignment.sourceRosterAbsolute));if(sourceRosterSha!==assignment.sourceRosterSha256)throw new Error('SOURCE_ROSTER_SHA_MISMATCH');
const bundle={schemaVersion:'JS_ARCHIVE_CURRENT_STUDENT_ONLY_BUNDLE_V1',examUid:assignment.examUid,sourceStage:'R1_POSTFREEZE_TECHNICAL_CORRECTION',qualityContractVersion:assignment.qualityContractVersion,executionLine:'CODEX',sourceArtifactSha:blobSha,sourceRawSha256:rawSha,sourceRosterSha256:sourceRosterSha,qids,questions,assets:[...assets.values()]};
const forbidden=['answer','solution','Meta','meta','difficulty','storedAnswer','verdict','reviewStatus'];if(questions.some(q=>Object.keys(q).some(k=>forbidden.includes(k)))||Object.keys(bundle).some(k=>forbidden.includes(k)))throw new Error('NON_STUDENT_FIELD_IN_BUNDLE');
const out=path.join(assignment.evidenceRootAbsolute,'handoff','R1-R2.student-only-bundle.after-q2-image-null-normalization.json');fs.writeFileSync(out,JSON.stringify(bundle,null,2)+'\n','utf8');
const outBytes=fs.readFileSync(out),outSha=sha(outBytes),written=JSON.parse(outBytes);
for(const q of written.questions){const p={id:q.id,content:q.content,choices:q.choices,image:q.image,assetSha256:q.assetSha256};if(sha(Buffer.from(JSON.stringify(p),'utf8'))!==q.payloadSha256)throw new Error('WRITTEN_PAYLOAD_HASH_FAIL:'+q.id);}
console.log(JSON.stringify({bundlePath:out,bundleSha256:outSha,candidateRawSha256:rawSha,candidateBlobSha1:blobSha,qidCount:written.qids.length,assetCount:written.assets.length,payloadHashes:'24/24',assetBytesAndSha:'verified',answerSolutionMetaFields:'absent',q2Image:null,q10AssetSha256:written.questions.find(q=>q.id===10).assetSha256,q13AssetSha256:written.questions.find(q=>q.id===13).assetSha256,oldBundlePreserved:true},null,2));
