import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {acceptPendingSupplement,registerRequests,difficultyWriteConflicts} from '../tools/ci/register-reviewed-meta-requests.mjs';
import {verifyStudentAccess,semanticFailuresAreSupplementary} from '../archive/tools/meta-foundation/verify-meta-pipeline-student-access.mjs';

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
  assert.equal(verifyStudentAccess(root,req).status,'PASS');
  assert.deepEqual(verifyStudentAccess(root,req).supplements,['1:SOLUTION_PENDING']);
  fs.writeFileSync(sourcePath,'window.questionBank=[{id:1,content:"",solution:""}];');
  assert.equal(verifyStudentAccess(root,req).status,'FAIL');
  fs.writeFileSync(sourcePath,'window.questionBank=[{id:1,content:"Question",solution:"Solution",image:"assets/missing.svg"}];');
  assert.match(verifyStudentAccess(root,req).failures[0],/ASSET_MISSING/);
  fs.writeFileSync(sourcePath,'window.questionBank=[{id:1,content:"Question",choices:["A"],solution:"",solutionImage:"assets/missing-solution.svg"}];');
  const solutionAsset=verifyStudentAccess(root,req);
  assert.equal(solutionAsset.status,'PASS');
  assert.deepEqual(solutionAsset.supplements,['1:SOLUTION_ASSET_PENDING:assets/missing-solution.svg']);
  assert.equal(verifyStudentAccess(root,{...req,sourceArchiveFile:'../../outside.js'}).status,'FAIL');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('legacy META_PIPELINE requests cannot overwrite another difficulty writer',()=>{
 const doc={approval:{type:'META_PIPELINE_AUDIT'},items:[{questionUid:'u',after:{difficultyBucket:1,problemTypeKey:'PT_A'}}]};
 const meta={records:[{questionUid:'u',difficultyBucket:5}]};
 assert.deepEqual(difficultyWriteConflicts(doc,meta),['u.difficultyBucket']);
 assert.deepEqual(difficultyWriteConflicts({...doc,approval:{type:'REVIEW2'}},meta),[]);
 assert.deepEqual(difficultyWriteConflicts({...doc,items:[{questionUid:'u',after:{problemTypeKey:'PT_A'}}]},meta),[]);
});

test('image-only choices require a matching reviewed image and evidence hash',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'visual-choice-'));
 try{
  for(const dir of ['archive/exams/original','archive/assets/images/exam','archive/data/meta-foundation/evidence'])fs.mkdirSync(path.join(root,dir),{recursive:true});
  fs.writeFileSync(path.join(root,'archive/engine.html'),'engine');
  fs.writeFileSync(path.join(root,'archive/exams/original/exam.js'),'window.questionBank=[{id:1,questionType:"객관식",content:"Question",choices:[],image:"assets/images/exam/q1.png"}];');
  const img=Buffer.from('image-bytes'), imagePath='assets/images/exam/q1.png';fs.writeFileSync(path.join(root,'archive',imagePath),img);
  const req={requestId:'v1',sourceArchiveFile:'original/exam.js',expectedQuestionCount:1,items:[{sourceOrdinal:1,questionUid:'uid1'}]};
  assert.match(verifyStudentAccess(root,req).failures.join(','),/CHOICES_EMPTY/);
  const proof={schemaVersion:'archive-visual-choice-review-v1',requestId:'v1',sourceArchiveFile:req.sourceArchiveFile,records:[{sourceOrdinal:1,questionUid:'uid1',imagePath,imageSha256:crypto.createHash('sha256').update(img).digest('hex'),choiceCount:5,visualReview:'CHOICES_1_TO_5_PRESENT',reviewer:'DIRECT_REVIEW'}]};
  const rel='archive/data/meta-foundation/evidence/review.json',bytes=Buffer.from(JSON.stringify(proof));fs.writeFileSync(path.join(root,rel),bytes);
  req.studentAccessEvidenceRef={path:rel,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
  assert.equal(verifyStudentAccess(root,req).status,'PASS');
  fs.writeFileSync(path.join(root,'archive',imagePath),'changed');assert.match(verifyStudentAccess(root,req).failures.join(','),/CHOICES_EMPTY/);
  fs.writeFileSync(path.join(root,rel),'{}');assert.match(verifyStudentAccess(root,req).failures.join(','),/STUDENT_ACCESS_EVIDENCE_SHA_MISMATCH/);
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});

test('legacy image basename resolves only to its unique displayed existing image',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'asset-alias-'));
 try{
  fs.mkdirSync(path.join(root,'archive/exams/original'),{recursive:true});fs.mkdirSync(path.join(root,'archive/assets/images/exam'),{recursive:true});
  fs.writeFileSync(path.join(root,'archive/engine.html'),'engine');fs.writeFileSync(path.join(root,'archive/assets/images/exam/q1.png'),'image');
  const f=path.join(root,'archive/exams/original/exam.js'),req={sourceArchiveFile:'original/exam.js',expectedQuestionCount:1};
  fs.writeFileSync(f,'window.questionBank=[{content:"Question",image:"assets/images/exam/q1.png",images:["q1.png"]}];');
  assert.equal(verifyStudentAccess(root,req).status,'PASS');
  fs.writeFileSync(f,'window.questionBank=[{content:"Question",image:"assets/images/exam/q1.png",images:["q2.png"]}];');
  assert.match(verifyStudentAccess(root,req).failures.join(','),/ASSET_MISSING:q2.png/);
  fs.writeFileSync(f,'window.questionBank=[{content:"Question",image:"assets/images/exam/missing.png",images:["missing.png"]}];');
  assert.match(verifyStudentAccess(root,req).failures.join(','),/ASSET_MISSING/);
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});

test('consumer infrastructure failures are not swallowed as metadata supplements',()=>{
 assert.equal(semanticFailuresAreSupplementary({status:'FAIL',failures:[{reason:'NOT_APPROVED_IN_CONSUMER'}]}),true);
 for(const reason of ['CONSUMER_LOAD_FAILED','CHECKER_ERROR','UID_MISMATCH','SOURCE_UNREADABLE'])assert.equal(semanticFailuresAreSupplementary({status:'FAIL',failures:[{reason}]}),false);
 assert.equal(semanticFailuresAreSupplementary({status:'FAIL',failures:[]}),false);
});
