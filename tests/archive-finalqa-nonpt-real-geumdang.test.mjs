import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { registerFinalqaNonpt } from "../archive/tools/meta-foundation/register-finalqa-nonpt.mjs";

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const EXAM="26_금당고_2학기_중간_고2_미적분I";
const SOURCE="original/high/h2/2mid/"+EXAM+".js";
const CAND="archive/data/meta-foundation/exam-scoped/"+EXAM+".json";
const META="archive/data/question_metadata.json";
const IDENTITY="archive/data/question_identity_map.json";
const blob=b=>crypto.createHash("sha1").update("blob "+b.length+"\0").update(b).digest("hex");
const hash=b=>crypto.createHash("sha256").update(b).digest("hex");
const j=x=>JSON.stringify(x,null,2)+"\n";
const fp=q=>hash(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
const body=q=>hash(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
test("real 21-question source: repair only audited q19 stale metadata/identity fingerprints",t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"geumdang-real-nonpt-"));
 t.after(()=>fs.rmSync(root,{force:true,recursive:true}));
 const put=(p,data)=>{let full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,data)};
 for(const p of [CAND,"archive/exams/"+SOURCE,"archive/data/meta-foundation/compiled/concept_registry.json","archive/data/meta-foundation/compiled/condition_registry.json"])
   put(p,fs.readFileSync(path.join(repo,p)));
 const src=fs.readFileSync(path.join(root,"archive/exams",SOURCE));
 const ctx={window:{},console:{log(){},warn(){},error(){}}};vm.createContext(ctx);vm.runInContext(src.toString("utf8"),ctx);
 const bank=ctx.window.questionBank;
 const cand=JSON.parse(fs.readFileSync(path.join(root,CAND),"utf8"));
 assert.equal(cand.records.length,21);
 const rows=cand.records.map((item,i)=>({
   questionUid:item.questionUid,sourceArchiveFile:SOURCE,sourceOrdinal:i+1,
   sourceFingerprint:i===18?"b9a65d7b05d1a31ae5b12fe00e06c4cfdbb78ee165850e0af7002e0e1428bf35":fp(bank[i]),
   contentFingerprint:body(bank[i]),reviewStatus:"review_required",
   metadataStatus:"registration_pending_semantic_review",L3:"",L4:""
 }));
 const identity={records:rows.map(r=>({questionUid:r.questionUid,sourceArchiveFile:SOURCE,
    sourceOrdinal:r.sourceOrdinal,sourceFingerprint:r.sourceFingerprint}))};
 const meta={records:[{sourceArchiveFile:"unrelated/example.js",sourceOrdinal:1,questionUid:"unrelated"} ,...rows],counts:{records:22}};
 put(META,j(meta));put(IDENTITY,j(identity));
 const req={schemaVersion:"archive-finalqa-nonpt-register-request-v1",requestId:"geumdang26-calculus1-finalqa-nonpt-20261023",
  examUid:EXAM,sourceArchiveFile:SOURCE,expectedQuestionCount:21,
  expectedSourceBlobSha1:blob(src),candidatePath:CAND,
  expectedCandidateBlobSha1:blob(fs.readFileSync(path.join(root,CAND))),
  expectedMetadataBlobSha1:blob(Buffer.from(j(meta))),
  approval:{type:"FINAL_QA",metadataReviewed:true,approvedBy:"USER_DIRECTED_FINALQA"},
  projectionPolicy:"NON_PT_SEMANTICS_ONLY__NO_PT_TPL_APPROVAL"};
 const result=registerFinalqaNonpt({root,request:req,write:true});
 assert.equal(result.status,"PASS");assert.deepEqual(result.fingerprintRepairs,[19]);
 const after=JSON.parse(fs.readFileSync(path.join(root,META),"utf8"));
 const afterIds=JSON.parse(fs.readFileSync(path.join(root,IDENTITY),"utf8"));
 assert.deepEqual(after.records[0],meta.records[0]);assert.equal(after.records[19].sourceFingerprint,fp(bank[18]));
 assert.equal(afterIds.records[18].sourceFingerprint,fp(bank[18]));
 assert.equal(after.records[21].L3,cand.records[20].after.L3);
 assert.equal(after.records[19].problemTypeKey,undefined);
 assert.equal(registerFinalqaNonpt({root,request:req,verifyProjection:true}).status,"PASS");
});
