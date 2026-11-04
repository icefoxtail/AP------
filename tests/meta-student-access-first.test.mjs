import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {acceptPendingSupplement,registerRequests} from '../tools/ci/register-reviewed-meta-requests.mjs';
import {verifyStudentAccess} from '../archive/tools/meta-foundation/verify-meta-pipeline-student-access.mjs';

test('usable exam gets provisional metadata approval without changing difficulty or solution',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'student-first-'));
 try {
  fs.mkdirSync(path.join(root,'archive/exams/original'),{recursive:true});
  fs.mkdirSync(path.join(root,'.archive-meta-register/inbox'),{recursive:true});
  fs.writeFileSync(path.join(root,'archive/engine.html'),'<html>engine</html>');
  const source='window.questionBank=[{id:1,content:"Question",solution:"latest solution",difficultyBucket:5}];';
  const sourcePath=path.join(root,'archive/exams/original/exam.js');fs.writeFileSync(sourcePath,source);
  const req={requestId:'example',examUid:'exam',sourceArchiveFile:'original/exam.js',expectedQuestionCount:1,approval:{type:'META_PIPELINE_AUDIT'},items:[{after:{difficultyBucket:1}}]};
  const input=path.join(root,'.archive-meta-register/inbox/example.json');fs.writeFileSync(input,JSON.stringify(req));
  const result=acceptPendingSupplement({root},input,'PARENT_REFERENCE_REQUIRED');
  assert.equal(result.metadataApprovalStatus,'USER_APPROVED_PENDING_SUPPLEMENT');
  assert.equal(result.releaseStatus,'APPROVED');assert.equal(result.metadataVerificationStatus,'NOT_VERIFIED');
  assert.equal(fs.readFileSync(sourcePath,'utf8'),source);assert.equal(fs.existsSync(input),false);
  assert.ok(fs.existsSync(path.join(root,'.archive-meta-register/pending-supplement/example.receipt.json')));
  fs.writeFileSync(input,JSON.stringify(req));
  const next=path.join(root,'.archive-meta-register/inbox/next.json');fs.writeFileSync(next,JSON.stringify({...req,requestId:'next'}));
  fs.writeFileSync(path.join(root,'registrar.mjs'),'if(process.argv.join(" ").includes("example.json")){console.error("Error: parent missing");process.exit(1)}');
  const batch=registerRequests({root,registrar:'registrar.mjs',guardPathsFile:'absent.paths',rejectedDir:'.archive-meta-register/rejected',requests:[input,next]},{log(){}});
  assert.equal(batch.applied.length,1);assert.equal(batch.pendingSupplement.length,1);assert.equal(batch.rejected.length,0);
  assert.equal(fs.readFileSync(sourcePath,'utf8'),source);
  fs.writeFileSync(sourcePath,'window.questionBank=[{id:1,content:"Question",solution:""}];');
  assert.equal(verifyStudentAccess(root,req).status,'FAIL');
  fs.writeFileSync(sourcePath,'window.questionBank=[{id:1,content:"Question",solution:"Solution",image:"assets/missing.svg"}];');
  assert.match(verifyStudentAccess(root,req).failures[0],/ASSET_MISSING/);
  assert.equal(verifyStudentAccess(root,{...req,sourceArchiveFile:'../../outside.js'}).status,'FAIL');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
