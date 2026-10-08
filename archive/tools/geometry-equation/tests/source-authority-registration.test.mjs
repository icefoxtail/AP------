import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {resolveQuestion} from '../production/resolve-request.mjs';
import {registerSourceAuthority} from '../production/register-source-authority.mjs';

function fixture(){
 const root=path.resolve('.tmp/archive/phase5-source-authority-test-'+crypto.randomUUID()+'/24_제일고_1학기_중간_고1_기출/fixtures');
 const sourcePath='archive/exams/original/high/h1/1mid/RegistryExam.js',archiveFile=sourcePath.slice('archive/exams/'.length);
 fs.mkdirSync(path.join(root,path.dirname(sourcePath)),{recursive:true});
 fs.writeFileSync(path.join(root,sourcePath),'window.questionBank=[{id:1,content:"source question",answer:"1",solution:"source solution"}];');
 fs.mkdirSync(path.join(root,'archive/data'),{recursive:true});
 const record={sourceArchiveFile:archiveFile,sourceOrdinal:1,questionUid:'qid_v1_'+crypto.createHash('sha256').update(archiveFile+'#1').digest('hex')};
 const map={schemaVersion:'question-identity-map-v1',identityAlgorithm:{version:'qid_v1'},records:[record]};
 const mapPath='archive/data/question_identity_map.json';fs.writeFileSync(path.join(root,mapPath),JSON.stringify(map));
 const options={targets:[{sourcePath,sourceQuestionOrdinal:1,group:'GEOMETRY'}],identityMapRef:fileRef(root,mapPath),decision:{authority:'DIRECT_USER_INSTRUCTION',request:'Controlled fixture: current source identity registration only.',scope:'CURRENT_SOURCE_IDENTITY_REGISTRATION_ONLY'}};
 return{root,sourcePath,map,mapPath,options};
}
test('registered map identity resolves through the unchanged current canonical resolver; source edits invalidate it',()=>{
 const f=fixture(),result=registerSourceAuthority(f.root,f.options),p='archive/data/registry.json';
 fs.writeFileSync(path.join(f.root,p),JSON.stringify(result.registry));
 const request={questionUid:'RegistryExam|1',sourceRegistryRef:fileRef(f.root,p)};
 const resolved=resolveQuestion(f.root,request);
 assert.equal(resolved.sourceRegistryEntry.sourceIdentityKey,'source-file:original/high/h1/1mid/RegistryExam.js');
 assert.equal(resolved.status,'VERIFIED_SOLUTION_AUTHORITY_REQUIRED');
 assert.equal(result.registration.engineQualification,false);
 assert.equal(result.migrations[0].legacyQuestionUid,f.map.records[0].questionUid);
 fs.appendFileSync(path.join(f.root,f.sourcePath),'\n// changed source');
 assert.throws(()=>resolveQuestion(f.root,request),/STALE_SOURCE_AUTHORITY/);
});
test('registration rejects absent user instruction, delegated draft authority, duplicate targets, absent ordinals, forged map UID and ambiguous exam names',()=>{
 const f=fixture();
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,decision:null}),/DECISION_REQUIRED/);
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,decision:{kind:'ROOT_DELEGATED',operator:'test operator',request:'old draft',scope:'not authority'}}),/DECISION_REQUIRED/);
 const alternate='archive/data/alternate-identity-map.json';fs.writeFileSync(path.join(f.root,alternate),JSON.stringify(f.map));
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,identityMapRef:fileRef(f.root,alternate)}),/CANONICAL_PATH_REQUIRED/);
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,targets:[...f.options.targets,...f.options.targets]}),/DUPLICATE_TARGET/);
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,targets:[{...f.options.targets[0],sourceQuestionOrdinal:2}]}),/TARGET_NOT_UNIQUE/);
 f.map.records[0].questionUid='qid_v1_forged';fs.writeFileSync(path.join(f.root,f.mapPath),JSON.stringify(f.map));
 assert.throws(()=>registerSourceAuthority(f.root,{...f.options,identityMapRef:fileRef(f.root,f.mapPath)}),/UID_MISMATCH/);
 const g=fixture();g.map.records.push({...g.map.records[0],sourceArchiveFile:'original/high/h1/2mid/RegistryExam.js'});fs.writeFileSync(path.join(g.root,g.mapPath),JSON.stringify(g.map));
 assert.throws(()=>registerSourceAuthority(g.root,{...g.options,identityMapRef:fileRef(g.root,g.mapPath)}),/ID_AMBIGUOUS/);
});
test('array position and question id must agree before ordinal identity is registered',()=>{
 const f=fixture();fs.writeFileSync(path.join(f.root,f.sourcePath),'window.questionBank=[{id:2,content:"source question"}];');
 assert.throws(()=>registerSourceAuthority(f.root,f.options),/ORDINAL_AND_QUESTION_ID_MISMATCH/);
});
