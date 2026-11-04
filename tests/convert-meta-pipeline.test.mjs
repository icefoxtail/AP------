import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {runBatch} from '../tools/convert-meta-pipeline.mjs';

test('batch conversion preserves source bytes, isolates SHA failures, and writes valid v2 JSON',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'meta-converter-')),out=path.join(root,'staging');
 const put=(p,x)=>{const full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,typeof x==='string'?x:JSON.stringify(x));return full;};
 try{
 const source='window.questionBank=[{id:1,content:"x?",answer:"1",solution:"x=1"}];';
 const sourcePath=put('archive/exams/original/exam.js',source),driveSource=put('drive.js',source);
 const hash=crypto.createHash('sha256').update(source).digest('hex');
 put('archive/data/question_metadata.json',{records:[{questionUid:'uid1',sourceOrdinal:1,sourceArchiveFile:'original/exam.js',standardCourse:'수학',curriculum:'2015',L1:'단원',L2:'소단원'}]});
 put('archive/data/question_identity_map.json',{records:[{questionUid:'uid1',sourceOrdinal:1,sourceArchiveFile:'original/exam.js'}]});
 put('docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',{records:[{curriculum:'2015',scope:'수학',majorUnit:'단원',midUnit:'소단원'}]});
 const audit=put('audit.json',{schemaVersion:'ALIVE_META_AUDIT_ATOMIC_v3',examTitle:'exam',sourceDriveId:'drive',sourceSha256:hash,records:[{questionId:1,difficulty:{bucket:1,confidence:'high'},problemTypeKey:'PT_A',templateKey:'TPL_A',crossConceptKeys:[]}]});
 const manifest=put('manifest.json',{examTitle:'exam',sourceFileDriveId:'drive',sourceSha256:hash,recordsToBind:[{questionId:1}]});
 const classification=put('classification.json',{examTitle:'exam',sourceDriveId:'drive',sourceSha256:hash,records:[{questionId:1}]});
 const spec={requestId:'fixture',sourceArchiveFile:'original/exam.js',driveSource,audit,manifest,classification};
 assert.equal(runBatch({root,out,batch:{packages:[spec]}})[0].status,'DRY_RUN');assert.equal(fs.existsSync(out),false);
 const broken=put('bad.js',source+' ');
 const results=runBatch({root,out,write:true,batch:{packages:[{...spec,requestId:'bad',driveSource:broken},spec]}});
 assert.equal(results[0].reason,'AUDIT_DRIVE_SHA_MISMATCH');assert.equal(results[1].status,'CONVERTED');
 const request=JSON.parse(fs.readFileSync(path.join(out,'.archive-meta-register/inbox/fixture.json'),'utf8'));
 assert.equal(request.schemaVersion,'archive-reviewed-exam-meta-register-request-v2');assert.equal(request.items[0].questionUid,'uid1');assert.equal(request.items[0].before.L3,null);
 assert.equal(fs.readFileSync(sourcePath,'utf8'),source);
 assert.deepEqual(fs.readFileSync(audit),fs.readFileSync(path.join(out,request.approval.metaPipelineAudit.auditPackageRef.path)));
 assert.equal(fs.existsSync(path.join(out,'.archive-meta-register/inbox/bad.json')),false);
 const repeat=runBatch({root,out,batch:{packages:[spec,spec]}});assert.equal(repeat[1].reason,'DUPLICATE_REQUEST_ID');
 put('archive/data/question_identity_map.json',{records:[{questionUid:'wrong',sourceOrdinal:1,sourceArchiveFile:'original/exam.js'}]});
 assert.match(runBatch({root,out,batch:{packages:[spec]}})[0].reason,/UID_MISMATCH/);
 put('archive/data/question_identity_map.json',{records:[{questionUid:'uid1',sourceOrdinal:1,sourceArchiveFile:'original/exam.js'}]});
 const drift='window.questionBank=[{id:1,content:"x?",answer:"1",solution:"x=1",difficultyBucket:2}];';
 const driftSource=put('difficulty-updated.js',drift),driftSha=crypto.createHash('sha256').update(drift).digest('hex');
 for(const pth of ['audit.json','manifest.json','classification.json']){const obj=JSON.parse(fs.readFileSync(path.join(root,pth),'utf8'));obj.sourceSha256=driftSha;fs.writeFileSync(path.join(root,pth),JSON.stringify(obj));}
 const afterDifficulty=runBatch({root,out,batch:{packages:[{...spec,requestId:'difficulty-only-drift',driveSource:driftSource}]}});
 assert.equal(afterDifficulty[0].status,'DRY_RUN',JSON.stringify(afterDifficulty));
 const solution='window.questionBank=[{id:1,content:"x?",answer:"1",solution:"x=2",difficultyBucket:2}];';
 const solutionSource=put('solution-updated.js',solution),solutionSha=crypto.createHash('sha256').update(solution).digest('hex');
 for(const pth of ['audit.json','manifest.json','classification.json']){const obj=JSON.parse(fs.readFileSync(path.join(root,pth),'utf8'));obj.sourceSha256=solutionSha;fs.writeFileSync(path.join(root,pth),JSON.stringify(obj));}
 const afterSolution=runBatch({root,out,batch:{packages:[{...spec,requestId:'solution-drift',driveSource:solutionSource}]}});
 assert.equal(afterSolution[0].status,'DRY_RUN');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
