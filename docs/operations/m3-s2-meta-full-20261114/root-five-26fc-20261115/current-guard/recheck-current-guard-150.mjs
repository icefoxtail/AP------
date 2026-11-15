import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {isDeepStrictEqual as equal} from 'node:util';
const own=path.dirname(new URL(import.meta.url).pathname),root=own+'/fixture';
const head='8c80f9170995bbdeaf1416f31feef1e14bbb7e95',actual='a9ca41250739f7f43fcbfecbf4c54276cd72178a';
const prefix='docs/operations/m3-s2-meta-full-20261114/root-five-26fc-20261115/';
const read=p=>fs.readFileSync(root+'/'+p),json=p=>JSON.parse(read(p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const git=(...a)=>execFileSync('git',a,{cwd:root,maxBuffer:100e6,stdio:['ignore','pipe','pipe']});
const ref=p=>({path:p,sha256:sha(fs.readFileSync(own+'/'+p))});
const auto=await import(root+'/archive/tools/meta-foundation/auto-register-merged-source.mjs');
const active=await import(root+'/archive/tools/meta-foundation/active-registry.mjs');
const initial=JSON.parse(fs.readFileSync(own+'/current-guard-150-result.json'));
assert.equal(initial.head,head);assert.equal(initial.exactOldLocalReceipts,6);
assert.equal(git('rev-parse','HEAD').toString().trim(),head);
for(const c of initial.codeProof)assert.equal(sha(read(c.path)),c.sha256);
const manifest=json(prefix+'final-release-manifest.json'),plan=json(prefix+'candidate-plan.json'),oldPlanner=json(prefix+'post-registration-planner.json');
const registry=active.loadActiveMetaRegistry(root);assert.equal(registry.status,'ACTIVE');assert.equal(registry.errors.length,0);
const identities=json('archive/data/question_identity_map.json'),identityByJoin=new Map(identities.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
const metadata=new Map(json('archive/data/question_metadata.json').records.map(r=>[r.questionUid,r]));
const runtimeByUid=new Map(),runtimeOwner=new Map(),runtimeStatus=new Map();
const statePaths=['archive/data/question_metadata.json','archive/data/question_identity_map.json'];
for(const n of fs.readdirSync(root+'/archive/data/meta-foundation/runtime').filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')){
 const p='archive/data/meta-foundation/runtime/'+n,d=json(p);statePaths.push(p);runtimeStatus.set(d.packId,d.status);
 for(const r of d.records||[]){assert(!runtimeByUid.has(r.questionUid));runtimeByUid.set(r.questionUid,r);runtimeOwner.set(r.questionUid,d.packId);}
}
const stateBefore=statePaths.map(p=>({path:p,sha256:sha(read(p))}));
for(const r of initial.localOfficialRegistration)assert.equal(sha(read(r.receipt.path)),r.receipt.sha256);
for(const f of manifest.publishFiles)assert.equal(sha(read(f.path)),f.sha256);
const newSet=new Set(manifest.selectedNewQuestionUids),preserved=new Set(manifest.preservedQuestionUids),selected=new Set([...newSet,...preserved]);
const sources=new Map();
for(const s of plan.sources){assert(s.path.startsWith('archive/exams/original/middle/m3/2mid/'));const bytes=read(s.path),bank=auto.loadBank(bytes.toString());assert.equal(blob(bytes),s.afterBlobSha1);assert.equal(bank.length,25);sources.set(s.path.slice(14),{...s,bytes,bank,previous:new Map()});}
const state=JSON.parse(git('show',actual+':.archive-meta-register/auto/state.json')),priorReceipts=new Map();
const rows=[],errors=[];
for(const old of oldPlanner.rows){
 const source=old.sourceArchiveFile,s=sources.get(source),ordinal=old.sourceOrdinal,i=ordinal-1;assert(s);
 const identity=identityByJoin.get(source+'#'+ordinal);assert.equal(identity.questionUid,old.questionUid);
 assert([actual,'38448acfda686571f0f3dd4e5bedb2f14a78fd44'].includes(old.previousBase));
 if(!s.previous.has(old.previousBase))s.previous.set(old.previousBase,auto.loadBank(git('show',old.previousBase+':'+s.path).toString()));
 const previous=s.previous.get(old.previousBase)[i],receiptPath=state.latestReceipts?.[identity.questionUid];
 if(receiptPath&&!priorReceipts.has(receiptPath))priorReceipts.set(receiptPath,JSON.parse(git('show',actual+':'+receiptPath)));
 const owner=runtimeOwner.get(identity.questionUid),current=metadata.get(identity.questionUid);
 const planned=auto.planQuestion({question:s.bank[i],previous,current,identity,source,ordinal,registry,validate:active.validateActiveMetaFields,runtimeOwner:owner,priorReceipt:receiptPath?priorReceipts.get(receiptPath):null,nativeSource:{root,bytes:s.bytes,bank:s.bank,blobSha1:blob(s.bytes),identityMap:identities,identityByJoin,runtimeRecord:runtimeByUid.get(identity.questionUid),runtimeStatus:runtimeStatus.get(owner)}});
 const fields=['metadataStatus','metadataApprovalType','reviewStatus','standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','sourceFingerprint','contentFingerprint'];
 const changed=selected.has(identity.questionUid)&&planned.final?fields.filter(k=>!equal(current[k]??null,planned.final[k]??null)):[];
 if(changed.length)errors.push({questionUid:identity.questionUid,ordinal,previousBase:old.previousBase,reason:'REGISTERED_VALUES_CHANGED',fields:changed});
 const expected=selected.has(identity.questionUid)?'ALREADY_REGISTERED':'SUPPLEMENT_PENDING';
 if(planned.status!==expected)errors.push({questionUid:identity.questionUid,ordinal,previousBase:old.previousBase,reason:'UNEXPECTED_STATUS',expected,actual:planned.status,reasons:planned.reasons||[]});
 rows.push({examId:s.examId,questionUid:identity.questionUid,sourceArchiveFile:source,sourceOrdinal:ordinal,selectedNew5:newSet.has(identity.questionUid),preserved29:preserved.has(identity.questionUid),previousBase:old.previousBase,route:old.route,status:planned.status,reasons:planned.reasons||[],nativeReviewReceipt:planned.nativeReviewReceipt??null,newMetadataApprovals:planned.newMetadataApprovals??null,preservedMetadataApprovals:planned.preservedMetadataApprovals??null,protectedValuesChanged:changed,previous5cdbStatus:old.after.status});
}
assert.equal(rows.length,150);assert.equal(new Set(rows.map(r=>r.questionUid)).size,75);
for(const s of stateBefore)assert.equal(sha(read(s.path)),s.sha256);
const counts={};for(const r of rows){counts[r.route]||={};counts[r.route][r.status]=(counts[r.route][r.status]||0)+1;}
const result={schemaVersion:'m3s2-five-current-native-preservation-guard-verification-v2',status:errors.length?'FAIL_CURRENT_GUARD':'PASS_CURRENT_GUARD_150',exactPr:2160,head,actualRegisteredBaseline:actual,codeProof:initial.codeProof,inputProof:initial.inputProof,localOfficialRegistration:initial.localOfficialRegistration,requestCount:6,selectedNewUidCount:5,preservedExistingUidCount:29,sourceCount:3,sourceQuestionCount:75,variantChecks:150,counts,rows,errors,exactOldLocalReceipts:6,outsideMetadataUnchanged:initial.outsideMetadataUnchanged,outsideRuntimeUnchanged:initial.outsideRuntimeUnchanged,identityRecordsUnchanged:initial.identityRecordsUnchanged,newApplyOutsideSelected:rows.filter(r=>!r.selectedNew5&&!r.preserved29&&r.status==='APPLY').length,registeredValueChanges:rows.filter(r=>r.protectedValuesChanged.length).length,dependencyRepair:{initialIncompleteFixture:ref('current-guard-150-result.json'),representativeRawFailures:ref('ancestor-diagnosis-before-restoration.json'),exactHeadRestoration:ref('sparse-ancestor-evidence-restoration.json'),representativeAfter:ref('ancestor-diagnosis-after-restoration.json'),registrationRerun:false,codeChange:false},readOnlyPostState:stateBefore,semanticOrMathReviewRepeated:false,newMathematicalQa:false,excludedM3S1SourceReads:0,sourceWrites:0,sharedWrites:0,remoteWrites:0,actualRegistration:'NOT_RUN',consumerProjection:'Existing receipt values remain exact; current PR CI separately verifies projection/Consumer.',fourSlot:'Previous exact75 proof reused; no new judgments.'};
const b=JSON.stringify(result,null,2)+'\n',output=own+'/current-guard-150-complete-v2.json';fs.writeFileSync(output,b);
console.log(JSON.stringify({path:output,sha256:sha(b),status:result.status,counts,errors:errors.length}));process.exitCode=errors.length?1:0;
