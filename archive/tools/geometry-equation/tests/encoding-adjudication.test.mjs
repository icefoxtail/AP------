import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {createSolutionEncodingAdjudication,validateSolutionEncodingAdjudication} from '../production/encoding-adjudication.mjs';
function fixture(){
 const root=path.resolve('.tmp/archive/phase5-encoding-test-'+crypto.randomUUID()+'/22_금당고_1학기_기말_고1_기출/fixtures');
 const sourcePath='archive/exams/original/high/h1/1mid/EncodingExam.js';fs.mkdirSync(path.join(root,path.dirname(sourcePath)),{recursive:true});
 const question={id:1,content:'두 점 A(6,5), B(2,-1)에서 같은 거리에 있는 x축 위의 점 P의 좌표를 (a,b)라고 할 때, a+b의 값은?',choices:['-5','-3','3','5','7'],answer:'⑤',solution:'a=7, b=0, a+b=7'};
 fs.writeFileSync(path.join(root,sourcePath),'window.questionBank='+JSON.stringify([question])+';');
 const source={content:question.content,choices:question.choices,sourceImageRequired:false};
 const write=(name,value)=>{fs.writeFileSync(path.join(root,name),JSON.stringify(value));return fileRef(root,name);};
 const blind={contextId:'unit-blind',output:{status:'PASS'},inputPacket:{visibility:'SOURCE_ONLY',source},payload:{recomputedAnswer:'3 (③)',reasoning:'PA²=PB² gives a=7, b=0. The answer is 7, ⑤.'}};
 const blindDecisionRef=write('blind.json',blind);
 const compare={contextId:'unit-compare',output:{status:'FAIL'},inputPacket:{visibility:'COMPARE_ONLY',blindDecisionRef,independentDecision:blind.payload}};
 const compareRef=write('compare.json',compare);
 const original={reviewContract:'BLIND_FREEZE_COMPARE_v1',output:{status:'FAIL'},blindDecisionRef,compareRef,payload:{...blind.payload},policySha256:'unit-policy',inputBindingSha256:'unit-input'};
 const originalVerificationRef=write('original.json',original);
 return{root,sourcePath,question,request:{questionUid:'EncodingExam|1',originalVerificationRef,sourceRef:fileRef(root,sourcePath),policySha256:'unit-policy',inputBindingSha256:'unit-input',decision:{authority:'DIRECT_USER_INSTRUCTION',request:'Controlled fixture: proven answer-encoding correction only.',scope:'ANSWER_ENCODING_ONLY'}}};
}
test('field-only encoding correction independently recomputes source distances and preserves failed freeze bytes',()=>{
 const f=fixture(),before=fileRef(f.root,'blind.json'),record=createSolutionEncodingAdjudication(f.root,f.request);
 assert.equal(record.payload.recomputedAnswer,'7 (⑤)');assert.equal(record.proof.residual,0);
 assert.equal(record.originalProviderComparisonStatus,'FAIL');assert.deepEqual(fileRef(f.root,'blind.json'),before);
 assert.ok(validateSolutionEncodingAdjudication(f.root,record,'unit-policy','unit-input'));
 assert.equal(validateSolutionEncodingAdjudication(f.root,{...record,proof:{...record.proof,value:3}},'unit-policy','unit-input'),false);
 assert.equal(validateSolutionEncodingAdjudication(f.root,record,'changed-policy','unit-input'),false);
 assert.throws(()=>createSolutionEncodingAdjudication(f.root,{...f.request,decision:null}),/DECISION_REQUIRED/);
 assert.throws(()=>createSolutionEncodingAdjudication(f.root,{...f.request,decision:{kind:'ROOT_DELEGATED',request:'old draft',scope:'ANSWER_ENCODING_ONLY'}}),/DECISION_REQUIRED/);
});
test('encoding correction cannot turn an incorrect stored source answer into a pass',()=>{
 const f=fixture();f.question.answer='③';fs.writeFileSync(path.join(f.root,f.sourcePath),'window.questionBank='+JSON.stringify([f.question])+';');
 assert.throws(()=>createSolutionEncodingAdjudication(f.root,{...f.request,sourceRef:fileRef(f.root,f.sourcePath)}),/NOT_A_FIELD_ONLY_ERROR/);
});
