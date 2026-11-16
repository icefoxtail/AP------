import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {auditedSubsetCcFixture} from './helpers/audited-subset-cc-fixture.mjs';
import {registerReviewedExamV2} from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {nativeReviewReceipt,planQuestion} from '../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {hasAuditSubsetCcClaim} from '../archive/tools/meta-foundation/audited-subset-cross-concept-append.mjs';
const META='archive/data/question_metadata.json',RUNTIME='archive/data/meta-foundation/runtime/new-course-v1.json';
const moduleUrl=new URL('../archive/tools/meta-foundation/auto-register-merged-source.mjs',import.meta.url).href;
const registryUrl=new URL('../archive/tools/meta-foundation/active-registry.mjs',import.meta.url).href;
function args(f,caughtUp=false){const a=f.nativeArgs(f.ordinal);if(caughtUp)a.previous=structuredClone(a.question);return a;}
function cold(f,a){
 const file=path.join(f.root,'cold-subset-args.json');
 fs.writeFileSync(file,JSON.stringify(a,(_,v)=>v instanceof Map?{__map:[...v]}:v instanceof Set?{__set:[...v]}:v));
 const code=`import fs from 'node:fs';import {nativeReviewReceipt,planQuestion} from ${JSON.stringify(moduleUrl)};import {validateActiveMetaFields} from ${JSON.stringify(registryUrl)};
 const a=JSON.parse(fs.readFileSync(process.argv[1]),(_,v)=>v?.__map?new Map(v.__map):v?.__set?new Set(v.__set):v?.type==='Buffer'&&Array.isArray(v.data)?Buffer.from(v.data):v);
 a.validate=validateActiveMetaFields;const p=planQuestion(a);process.stdout.write(JSON.stringify({native:nativeReviewReceipt(a),status:p.status,reasons:p.reasons}));`;
 try{return JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',code,file],{encoding:'utf8',timeout:15000,maxBuffer:65536}));}
 finally{fs.unlinkSync(file);}
}
function erase(f,{restoreSource=false,drift=null,commit=false}={}){
 for(const p of[META,RUNTIME]){
  const d=f.read(p),old=p===META?f.prior.appliedRecords:f.prior.runtimeRecords;
  for(const r of d.records){const prior=old.find(x=>x.questionUid===r.questionUid);if(!prior)continue;
   delete r.crossConceptApprovalComponents;delete r.metadataRevision;r.approvalEvidence=structuredClone(prior.approvalEvidence);
   if(drift)drift(r,p);
  }f.put(p,d);
 }
 for(const p of[f.bindingPath,f.registeredPath,f.requestPath])if(fs.existsSync(path.join(f.root,p)))fs.unlinkSync(path.join(f.root,p));
 if(restoreSource){f.bank.splice(0,f.bank.length,...structuredClone(f.currentBank));f.writeBank();}
 if(commit)f.checkpoint('committed complete current subset claim stripping');
}
for(const[label,options]of[
 ['all local markers and proof files erased',{}],
 ['proof deletion committed with source union retained',{commit:true}],
 ['source restored and committed while added CC survives',{restoreSource:true,commit:true}],
 ['source restored with unrelated rationale drift',{restoreSource:true,commit:true,drift:r=>{r.primaryMethod='unapproved method';}}],
 ['source restored with forged ordinary kind and revision',{restoreSource:true,commit:true,drift:r=>{r.metadataApprovalType='FINAL_QA';r.metadataRevision='meta-foundation:NEW_COURSE@1.0.0:exam-final_qa-v2:unissued';r.metadataStatus='approved_semantic_review';r.reviewStatus='reviewed_pass';r.tagStatus='reviewed_pass';}}],
 ['only runtime retains the appended CC',{restoreSource:true,commit:true,drift:(r,p)=>{if(p===META)r.crossConceptKeys=['CC_NEW'];}}],
 ['only metadata retains the appended CC',{restoreSource:true,commit:true,drift:(r,p)=>{if(p===RUNTIME)r.crossConceptKeys=['CC_NEW'];}}],
])test('warm and cold automatic reuse reject '+label,t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});
 assert.equal(nativeReviewReceipt(args(f)),f.registeredPath);assert.equal(hasAuditSubsetCcClaim({root:f.root,current:args(f).current,runtimeRecord:args(f).nativeSource.runtimeRecord}),true);
 erase(f,options);
 for(const caughtUp of[false,true]){
  const a=args(f,caughtUp);assert.equal(nativeReviewReceipt(a),null);const p=planQuestion(a);assert.equal(p.status,'SUPPLEMENT_PENDING');
  const result=cold(f,a);assert.equal(result.native,null);assert.equal(result.status,'SUPPLEMENT_PENDING');
 }
});

test('a fully restored original current audit subset reuses only its actual old authority',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});erase(f,{restoreSource:true,commit:true});
 for(const[p,prior]of[[META,f.prior.appliedRecords],[RUNTIME,f.prior.runtimeRecords]]){
  const d=f.read(p);d.records=d.records.map(r=>structuredClone(prior.find(x=>x.questionUid===r.questionUid)||r));f.put(p,d);
 }
 for(const n of f.auditOrdinals){const a=f.nativeArgs(n);assert.equal(nativeReviewReceipt(a),f.priorPath);assert.equal(planQuestion(a).status,'ALREADY_REGISTERED');}
});

test('live peer mutation invalidates current reuse even after a previous successful check',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});assert.equal(nativeReviewReceipt(args(f)),f.registeredPath);
 const d=f.read(META);d.records[3].difficultyBucket=5;f.put(META,d);
 assert.equal(nativeReviewReceipt(args(f)),null);assert.equal(planQuestion(args(f)).status,'SUPPLEMENT_PENDING');
});

test('an unavailable Git HEAD cannot excuse stripped audit component evidence',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});erase(f,{restoreSource:true});
 fs.renameSync(path.join(f.root,'.git'),path.join(f.root,'.git-saved'));
 try{assert.equal(nativeReviewReceipt(args(f)),null);assert.equal(planQuestion(args(f)).status,'SUPPLEMENT_PENDING');}
 finally{fs.renameSync(path.join(f.root,'.git-saved'),path.join(f.root,'.git'));}
});

test('a merge that drops an issuing parent tree cannot remove its audit subset obligation',t=>{
 const f=auditedSubsetCcFixture(t);registerReviewedExamV2({root:f.root,request:f.request,write:true});const issued=f.checkpoint('issued subset receipt and component binding');
 const git=(...a)=>execFileSync('git',a,{cwd:f.root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 git('checkout','--detach',f.currentCommit);const other=git('rev-parse','HEAD');
 f.bank.splice(0,f.bank.length,...structuredClone(f.currentBank));
 // Commit a truthful merged deletion tree while retaining the issued parent.
 for(const[p,rows]of[[META,f.read(META).records],[RUNTIME,f.read(RUNTIME).records]]){
  const d=f.read(p);d.records=rows.map(r=>r.sourceOrdinal===f.ordinal?{...r,crossConceptKeys:['CC_NEW','CC_APPEND']}:r);f.put(p,d);
 }
 git('add','-A');const tree=git('write-tree'),merge=git('commit-tree',tree,'-p',other,'-p',issued,'-m','merge preserves old tree but not component files');git('reset','--soft',merge);
 assert.equal(hasAuditSubsetCcClaim({root:f.root,current:args(f).current,runtimeRecord:args(f).nativeSource.runtimeRecord}),true);
 assert.equal(nativeReviewReceipt(args(f)),null);assert.equal(planQuestion(args(f)).status,'SUPPLEMENT_PENDING');
 assert.equal(cold(f,args(f,true)).status,'SUPPLEMENT_PENDING');
});
