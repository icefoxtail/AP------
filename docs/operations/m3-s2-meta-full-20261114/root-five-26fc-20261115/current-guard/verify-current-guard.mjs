import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual as equal } from 'node:util';

const own=path.dirname(new URL(import.meta.url).pathname),root=own+'/fixture';
const prefix='docs/operations/m3-s2-meta-full-20261114/root-five-26fc-20261115/';
const head='8c80f9170995bbdeaf1416f31feef1e14bbb7e95',actual='a9ca41250739f7f43fcbfecbf4c54276cd72178a';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=x=>crypto.createHash('sha1').update(`blob ${x.length}\0`).update(x).digest('hex');
const read=p=>fs.readFileSync(root+'/'+p),json=p=>JSON.parse(read(p));
const git=(...a)=>execFileSync('git',a,{cwd:root,maxBuffer:100e6,stdio:['ignore','pipe','pipe']});
const checkedGit=(ref,p)=>{if(p.startsWith('archive/exams/')&&!p.startsWith('archive/exams/original/middle/m3/2mid/'))throw Error('Source out of assigned scope');return git('show',ref+':'+p);};
const save=(name,value)=>{const b=JSON.stringify(value,null,2)+'\n';fs.writeFileSync(own+'/'+name,b);return{path:own+'/'+name,sha256:sha(b)};};
const manifest=json(prefix+'final-release-manifest.json'),plan=json(prefix+'candidate-plan.json'),oldPlanner=json(prefix+'post-registration-planner.json');
assert.equal(sha(read(prefix+'final-release-manifest.json')),'91c7ddfa77a03244e6267c763147ce4e8aa14dcebe126fbe21194f97e5ae4f00');
assert.equal(git('rev-parse','HEAD').toString().trim(),head);
assert.equal(git('status','--porcelain','--untracked-files=no').length,0,'Initial sparse fixture must be clean');
const autoPath='archive/tools/meta-foundation/auto-register-merged-source.mjs',newGuardPath='archive/tools/meta-foundation/native-preserved-source-reuse.mjs';
const auto=await import(root+'/'+autoPath),active=await import(root+'/archive/tools/meta-foundation/active-registry.mjs');
const {registerReviewedExamV2}=await import(root+'/archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
const {REASSESSED_STUDENT_FIELDS}=await import(root+'/archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
const codeProof=[autoPath,newGuardPath,'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs','archive/tools/meta-foundation/reviewed-source-reassessment.mjs','archive/tools/meta-foundation/active-registry.mjs'].map(p=>{const b=read(p);assert(b.equals(checkedGit(head,p)));return{path:p,blobSha1:blob(b),sha256:sha(b)};});
assert.equal(codeProof[0].blobSha1,'b643f4c85ca20b5940291758d5233d5e9f727016');
assert.equal(codeProof[1].blobSha1,'0a8c0a5ce273f26694feb050bdabe155435ea4c6');
const beforeMetadata=json('archive/data/question_metadata.json'),identities=json('archive/data/question_identity_map.json');
assert.equal(sha(read('archive/data/question_metadata.json')),plan.metadataSha256);
assert.equal(sha(read('archive/data/question_identity_map.json')),plan.identitySha256);
const beforeMeta=new Map(beforeMetadata.records.map(r=>[r.questionUid,r])),identityByJoin=new Map(identities.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
const identityHash=sha(read('archive/data/question_identity_map.json'));
const runtime=()=>{const rows=new Map(),owners=new Map(),status=new Map();for(const n of fs.readdirSync(root+'/archive/data/meta-foundation/runtime').filter(x=>x.endsWith('.json')&&x!=='runtime-bridge-receipt.json')){const d=json('archive/data/meta-foundation/runtime/'+n);status.set(d.packId,d.status);for(const r of d.records||[]){assert(!rows.has(r.questionUid));rows.set(r.questionUid,r);owners.set(r.questionUid,d.packId);}}return{rows,owners,status};};
const beforeRuntime=runtime(),beforeRegistry=active.loadActiveMetaRegistry(root);
assert.equal(beforeRegistry.status,'ACTIVE'); assert.equal(beforeRegistry.errors.length,0);
const selected=new Set(manifest.selectedNewQuestionUids),preserved=new Set(manifest.preservedQuestionUids),allSelected=new Set([...selected,...preserved]);
assert.equal(selected.size,5);assert.equal(preserved.size,29);assert.equal(allSelected.size,34);
const sources=new Map(),inputProof=[];
for(const s of plan.sources){
 assert(s.path.startsWith('archive/exams/original/middle/m3/2mid/'));
 const source=s.path.slice(14),beforeBytes=checkedGit(actual,s.path),afterBytes=read(s.path);
 assert.equal(blob(beforeBytes),s.beforeBlobSha1);assert.equal(blob(afterBytes),s.afterBlobSha1);
 const beforeBank=auto.loadBank(beforeBytes.toString()),afterBank=auto.loadBank(afterBytes.toString());assert.equal(beforeBank.length,25);assert.equal(afterBank.length,25);
 for(let i=0;i<25;i++)for(const f of REASSESSED_STUDENT_FIELDS)assert(equal(beforeBank[i][f]??null,afterBank[i][f]??null));
 sources.set(source,{...s,source,beforeBytes,afterBytes,beforeBank,afterBank,previous:new Map([[actual,beforeBank]])});
 inputProof.push({examId:s.examId,source:s.path,beforeBlob:blob(beforeBytes),afterBlob:blob(afterBytes),studentPayloadsUnchanged:25});
}
for(const f of manifest.publishFiles){assert.equal(sha(read(f.path)),f.sha256);assert.equal(blob(read(f.path)),f.afterBlobSha1);}
const requests=manifest.requestManifest.map(s=>({spec:s,path:'.archive-meta-register/inbox/'+s.requestId+'.json',request:json('.archive-meta-register/inbox/'+s.requestId+'.json')}));
const registration=[];
for(const {spec,request,path:p}of requests){
 const dry=registerReviewedExamV2({root,request,write:false,verifyProjection:false});
 assert.equal(dry.status,'PASS');assert.equal(dry.replay,false);
 const write=registerReviewedExamV2({root,request,write:true,verifyProjection:false});
 assert.equal(write.status,'PASS');assert.equal(write.totalQuestions,spec.uidCount);assert.deepEqual(write.plannedPaths,dry.plannedPaths);
 const receiptBytes=read(spec.localReceipt.path),receipt=JSON.parse(receiptBytes);
 assert.equal(receipt.appliedRecords.length,spec.uidCount);
 registration.push({requestId:request.requestId,requestSha256:sha(read(p)),kind:spec.kind,uidCount:spec.uidCount,dry,write,receipt:{path:spec.localReceipt.path,sha256:sha(receiptBytes),expectedPreviousLocalSha256:spec.localReceipt.sha256,exactPreviousLocalReceipt:sha(receiptBytes)===spec.localReceipt.sha256}});
 save('current-registration-progress.json',{head,actual,completed:registration,actualRegistration:false});
 console.log(JSON.stringify({stage:'local-registration',request:request.requestId,count:spec.uidCount,receiptExact:sha(receiptBytes)===spec.localReceipt.sha256}));
}
assert.equal(registration.length,6);assert.equal(registration.reduce((n,r)=>n+r.uidCount,0),34);
const afterMeta=new Map(json('archive/data/question_metadata.json').records.map(r=>[r.questionUid,r])),afterRuntime=runtime(),afterRegistry=active.loadActiveMetaRegistry(root);
assert.equal(afterRegistry.status,'ACTIVE');assert.equal(afterRegistry.errors.length,0);assert.equal(sha(read('archive/data/question_identity_map.json')),identityHash);
let outsideMeta=0,outsideRuntime=0;for(const[uid,r]of beforeMeta)if(!allSelected.has(uid)){assert(equal(r,afterMeta.get(uid)));outsideMeta++;}for(const[uid,r]of beforeRuntime.rows)if(!allSelected.has(uid)){assert(equal(r,afterRuntime.rows.get(uid)));outsideRuntime++;}
const omit=r=>Object.fromEntries(Object.entries(r).filter(([k])=>!['metadataRevision','approvalEvidence'].includes(k)));
for(const uid of preserved){assert(equal(omit(beforeMeta.get(uid)),omit(afterMeta.get(uid))));assert(equal(omit(beforeRuntime.rows.get(uid)),omit(afterRuntime.rows.get(uid))));assert(beforeMeta.get(uid).approvalEvidence.every(e=>afterMeta.get(uid).approvalEvidence.includes(e)));}
const state=JSON.parse(checkedGit(actual,'.archive-meta-register/auto/state.json'));
const priorReceipts=new Map(),rows=[],errors=[];
const summary=p=>({status:p.status,reasons:p.reasons||[],metadataApprovalType:p.final?.metadataApprovalType??null,reviewStatus:p.final?.reviewStatus??null,changedFields:p.changedFields||[]});
for(const previousRow of oldPlanner.rows){
 const source=previousRow.sourceArchiveFile,s=sources.get(source),ordinal=previousRow.sourceOrdinal,i=ordinal-1;assert(s);
 const id=identityByJoin.get(source+'#'+ordinal);assert.equal(id.questionUid,previousRow.questionUid);
 const previousBase=previousRow.previousBase;
 assert([actual,'38448acfda686571f0f3dd4e5bedb2f14a78fd44'].includes(previousBase));
 if(!s.previous.has(previousBase))s.previous.set(previousBase,auto.loadBank(checkedGit(previousBase,s.path).toString()));
 const previous=s.previous.get(previousBase)[i],receiptPath=state.latestReceipts?.[id.questionUid];
 if(receiptPath&&!priorReceipts.has(receiptPath))priorReceipts.set(receiptPath,JSON.parse(checkedGit(actual,receiptPath)));
 const priorReceipt=receiptPath?priorReceipts.get(receiptPath):null;
 function planned(after){const reg=after?afterRegistry:beforeRegistry,meta=after?afterMeta:beforeMeta,rt=after?afterRuntime:beforeRuntime,bank=after?s.afterBank:s.beforeBank,raw=after?s.afterBytes:s.beforeBytes,owner=rt.owners.get(id.questionUid);return auto.planQuestion({question:bank[i],previous,current:meta.get(id.questionUid),identity:id,source,ordinal,registry:reg,validate:active.validateActiveMetaFields,runtimeOwner:owner,priorReceipt,nativeSource:{root,bytes:raw,bank,blobSha1:blob(raw),identityMap:identities,identityByJoin,runtimeRecord:rt.rows.get(id.questionUid),runtimeStatus:rt.status.get(owner)}});}
 const before=planned(false),after=planned(true),outsideApply=!allSelected.has(id.questionUid)&&before.status!=='APPLY'&&after.status==='APPLY';
 const protectedFields=['metadataStatus','metadataApprovalType','reviewStatus','standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','sourceFingerprint','contentFingerprint'];
 const protectedValuesChanged=allSelected.has(id.questionUid)&&after.final?protectedFields.filter(k=>!equal(afterMeta.get(id.questionUid)[k]??null,after.final[k]??null)):[];
 if(outsideApply)errors.push({questionUid:id.questionUid,ordinal,previousBase,reason:'NEW_APPLY_OUTSIDE_SELECTED34'});
 if(protectedValuesChanged.length)errors.push({questionUid:id.questionUid,ordinal,previousBase,reason:'REGISTERED_VALUES_CHANGED',fields:protectedValuesChanged});
 if(allSelected.has(id.questionUid)&&after.status!=='ALREADY_REGISTERED')errors.push({questionUid:id.questionUid,ordinal,previousBase,reason:'REGISTERED_NATIVE_NOT_RECOGNIZED',status:after.status,reasons:after.reasons||[]});
 if(!allSelected.has(id.questionUid)&&after.status!=='SUPPLEMENT_PENDING')errors.push({questionUid:id.questionUid,ordinal,previousBase,reason:'UNSELECTED_PENDING_CHANGED',status:after.status});
 rows.push({examId:s.examId,questionUid:id.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,selectedNew5:selected.has(id.questionUid),preserved29:preserved.has(id.questionUid),previousBase,route:previousRow.route,before:summary(before),after:summary(after),newOutsideApply:outsideApply,protectedValuesChanged,previous5cdbStatus:previousRow.after.status});
}
assert.equal(rows.length,150);assert.equal(new Set(rows.map(r=>r.questionUid)).size,75);
const counts={};for(const r of rows){counts[r.route]||={};counts[r.route][r.after.status]=(counts[r.route][r.after.status]||0)+1;}
const result={schemaVersion:'m3s2-five-current-native-preservation-guard-verification-v1',status:errors.length?'FAIL_CURRENT_GUARD':'PASS_CURRENT_GUARD_150',exactPr:2160,head,actualRegisteredBaseline:actual,codeProof,inputProof,originalManifest:{path:prefix+'final-release-manifest.json',sha256:sha(read(prefix+'final-release-manifest.json'))},previousPlanner:{path:prefix+'post-registration-planner.json',sha256:sha(read(prefix+'post-registration-planner.json')),codeMain:oldPlanner.codeMain},localOfficialRegistration:registration,requestCount:6,selectedNewUidCount:5,preservedExistingUidCount:29,sourceCount:3,sourceQuestionCount:75,variantChecks:rows.length,counts,rows,errors,outsideMetadataUnchanged:outsideMeta,outsideRuntimeUnchanged:outsideRuntime,identityRecordsUnchanged:identities.records.length,newApplyOutsideSelected:rows.filter(r=>r.newOutsideApply).length,registeredValueChanges:rows.filter(r=>r.protectedValuesChanged.length).length,exactOldLocalReceipts:registration.filter(r=>r.receipt.exactPreviousLocalReceipt).length,semanticOrMathReviewRepeated:false,newMathematicalQa:false,excludedM3S1SourceReads:0,sourceWrites:0,sharedWrites:0,remoteWrites:0,actualRegistration:'NOT_RUN',consumerProjection:'NOT_REBUILT_THIS_SCOPE; exact six-request PR CI verifies current projection/Consumer separately',fourSlot:'Existing75 same-source/student-payload proof reused; no new slot judgments'};
const ref=save('current-guard-150-result.json',result);console.log(JSON.stringify({...ref,status:result.status,counts,errors:errors.length,oldReceiptExactCount:result.exactOldLocalReceipts}));
process.exitCode=errors.length?1:0;
