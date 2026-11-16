import test from 'node:test';
import assert from 'node:assert/strict';
import {planRebind} from '../archive/tools/meta-foundation/registrar-rebind.mjs';
import {sourceFingerprint} from '../archive/tools/meta-foundation/source-delta.mjs';
const previous={id:1,content:'삼각형 ABC의 넓이를 구하여라.',choices:['1','2'],answer:'1',solution:'넓이는 밑변과 높이의 곱의 절반이다.',image:null};
const priorBlob='a'.repeat(40),at='2026-11-16T00:00:00.000Z';
const current={questionUid:'q1',sourceFingerprint:sourceFingerprint(previous),fieldStatus:{problemType:'approved_source'},metadataStatus:'approved_semantic_review',problemTypeKey:'PT',difficultyBucket:3};
const plan=(question,extras={})=>planRebind({current,previous,question,priorBlob,at,...extras});
for(const [label,question,action,cls,pending] of [
 ['unchanged',{...previous},'NONE','UNCHANGED',undefined],
 ['figure',{...previous,image:'new.svg'},'REBIND','FIGURE',undefined],
 ['notation',{...previous,content:previous.content+'\u200b'},'REBIND','NOTATION',undefined],
 ['solution',{...previous,solution:'다른 풀이이다.'},'REBIND','SOLUTION',['method']],
 ['stem',{...previous,content:'삼각형 ABC의 넓이를 모두 구하여라.'},'REBIND','STEM_EDIT',['stem']],
 ['answer',{...previous,answer:'2'},'REBIND','ANSWER',['answer']],
 ['replaced',{...previous,content:'주머니에서 빨간 공을 뽑을 확률을 계산하시오.'},'BLOCK','REPLACED',['stem','reclassification']],
 ['number',{...previous,id:2},'REFUSE','NUMBER_MISMATCH',undefined],
]) test(label,()=>{const before=structuredClone({current,previous,question});const r=plan(question);assert.equal(r.action,action);assert.equal(r.deltaClass,cls);assert.deepEqual(r.tags.reviewPending,pending);assert.deepEqual({current,previous,question},before);if(action==='BLOCK')assert.equal(r.tags.sourceDrift.metadataExcluded,true);});
test('answer filling is distinct, including numeric zero',()=>{const old={...previous,answer:''};const r=plan({...old,answer:0},{previous:old,current:{...current,sourceFingerprint:sourceFingerprint(old)}});assert.equal(r.action,'REBIND');assert.equal(r.tags.sourceDrift.class,'ANSWER_FILLED');assert.equal(r.tags.reviewPending,undefined);});
test('compound answer, method, figure and unknown key changes survive severity',()=>{const r=plan({...previous,answer:'2',solution:'다른 풀이',image:'new.svg',wide:true},{current:{...current,reviewPending:['prior']}});assert.equal(r.deltaClass,'ANSWER');assert.equal(r.tags.sourceDrift.figure,true);assert.deepEqual(r.tags.reviewPending,['prior','method','answer','other']);assert.deepEqual(r.tags.sourceDrift.otherChangedKeys,['wide']);});
test('missing history, wrong fingerprint and invalid blob refuse',()=>{assert.equal(plan(previous,{previous:null}).action,'REFUSE');assert.equal(plan(previous,{current:{...current,sourceFingerprint:'bad'}}).reason,'PRIOR_FINGERPRINT_MISMATCH');assert.equal(plan(previous,{priorBlob:'bad'}).reason,'PRIOR_BLOB_INVALID');});
test('sourceQuestionNo is also a strict number identity',()=>{assert.equal(plan({...previous,sourceQuestionNo:2},{previous:{...previous,sourceQuestionNo:1}}).action,'REFUSE');});
test('deterministic output and no approval mutation',()=>{const q={...previous,image:'new.svg'};assert.deepEqual(plan(q),plan(q));assert.deepEqual(Object.keys(plan(q).tags),['sourceDrift']);assert.equal(current.metadataStatus,'approved_semantic_review');});
