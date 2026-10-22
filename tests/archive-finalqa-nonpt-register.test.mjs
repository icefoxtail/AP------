import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { registerFinalqaNonpt } from "../archive/tools/meta-foundation/register-finalqa-nonpt.mjs";
const EXAM="26_금당고_2학기_중간_고2_미적분I";
const SOURCE="original/high/h2/2mid/"+EXAM+".js";
const CAND="archive/data/meta-foundation/exam-scoped/"+EXAM+".json";
const META="archive/data/question_metadata.json";
const IDs="archive/data/question_identity_map.json";
const blob=b=>crypto.createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex");
const hash=s=>crypto.createHash("sha256").update(s).digest("hex");
const j=x=>JSON.stringify(x,null,2)+"\n";
function make(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"nonpt-geumdang-"));
 t.after(()=>fs.rmSync(root,{force:true,recursive:true}));
 const put=(p,v)=>{let full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof v==="string"?v:j(v));};
 const bank=Array.from({length:21},(_,i)=>({id:i+1,content:"question "+i,choices:["1","2","3","4","5"],answer:"①",solution:"solution "+i,image:null,standardCourse:"미적분I",level:"하",difficultyBucket:1,crossConceptKeys:[],conditionKeys:[],integrationPattern:"NONE"}));
 const src=`window.questionBank = ${JSON.stringify(bank)};\n`;
 put("archive/exams/"+SOURCE,src);
 const records=bank.map((q,i)=>{
   const n=i+1, questionUid="qid_v1_"+hash(SOURCE+"#"+n);
   const sourceFingerprint=hash(JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution,image:q.image}));
   const contentFingerprint=hash(JSON.stringify({content:q.content,choices:q.choices,image:q.image}));
   return {questionUid,sourceArchiveFile:SOURCE,sourceOrdinal:n,sourceFingerprint,contentFingerprint,
    reviewStatus:"review_required",metadataStatus:"registration_pending_semantic_review",L3:"",L4:"",level:"하",difficultyBucket:1};
 });
 const identity={records:records.map(({questionUid,sourceArchiveFile,sourceOrdinal,sourceFingerprint})=>({questionUid,sourceArchiveFile,sourceOrdinal,sourceFingerprint}))};
 const meta={records:[{questionUid:"unrelated",sourceArchiveFile:"not/this.js",sourceOrdinal:1,metadataStatus:"keep"},...records],counts:{records:22}};
 put(IDs,identity);put(META,meta);
 const cand={schemaVersion:"archive-exam-scoped-metadata-v1",examUid:EXAM,sourceArchiveFile:SOURCE,recordCount:21,sourceBlobSha:blob(Buffer.from(src)),status:"SEMANTIC_CANDIDATE__NOT_PRODUCTION_REGISTERED",
 records:records.map((x,i)=>({questionUid:x.questionUid,sourceOrdinal:i+1,sourceArchiveFile:SOURCE,sourceFingerprint:x.sourceFingerprint,
   disposition:i===2?"NOT_APPLICABLE_EXACT_RPM_PATH":"REGISTER_PENDING",
   rpmPrimaryRecordIds:i===2?[]:["H2-M2-RPM-053"],
   after:{curriculum:"2022",standardCourse:"미적분I",L1:"함수의 극한과 연속",L2:"함수의 연속",
    L3:i===2?"함수의 정의역":"함수의 극한",L4:i===2?"분모의 영점 제외와 구간 표현":"극한값 계산",
    level:"하",difficultyBucket:1,crossConceptKeys:[],conditionKeys:[],integrationPattern:"NONE"}}))};
 put(CAND,cand);
 const req={schemaVersion:"archive-finalqa-nonpt-register-request-v1",requestId:"geumdang26-calculus1-finalqa-nonpt-20261023",
  examUid:EXAM,sourceArchiveFile:SOURCE,expectedQuestionCount:21,candidatePath:CAND,
  expectedSourceBlobSha1:blob(Buffer.from(src)),expectedCandidateBlobSha1:blob(Buffer.from(j(cand))),
  expectedMetadataBlobSha1:blob(Buffer.from(j(meta))),approval:{type:"FINAL_QA",metadataReviewed:true,approvedBy:"USER_DIRECTED_FINALQA"},
  projectionPolicy:"NON_PT_SEMANTICS_ONLY__NO_PT_TPL_APPROVAL"};
 return {root,put,req,read:p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"))};
}
test("nonPT scoped 21 UID dry-run, registration, idempotent verification; unrelated unchanged",t=>{
 const x=make(t),before=x.read(META).records[0];
 const preview=registerFinalqaNonpt({root:x.root,request:x.req});
 assert.equal(preview.registeredRows,21);assert.equal(x.read(META).records[1].L3,"");
 const written=registerFinalqaNonpt({root:x.root,request:x.req,write:true});
 assert.equal(written.status,"PASS");assert.equal(x.read(META).records[3].L3,"함수의 정의역");
 assert.deepEqual(x.read(META).records[0],before);
 assert.equal(x.read(META).records[1].problemTypeKey,undefined);
 assert.equal(x.read(META).records[1].metadataStatus,"finalqa_nonpt_registered");
 assert.equal(registerFinalqaNonpt({root:x.root,request:x.req,verifyProjection:true}).mode,"IDEMPOTENT");
});
test("nonPT writer fails closed for changed shared before blob",t=>{
 const x=make(t);const meta=x.read(META);meta.records[1].level="상";x.put(META,meta);
 assert.throws(()=>registerFinalqaNonpt({root:x.root,request:x.req,write:true}),/stale-before metadata blob/);
});
test("nonPT writer refuses candidate Q03 missing true prerequisite provenance",t=>{
 const x=make(t);const candidate=x.read(CAND);candidate.records[2].after.L4="없는 값";x.put(CAND,candidate);
 x.req.expectedCandidateBlobSha1=blob(Buffer.from(j(candidate)));
 assert.throws(()=>registerFinalqaNonpt({root:x.root,request:x.req,write:true}),/q03 provenance drift/);
});
