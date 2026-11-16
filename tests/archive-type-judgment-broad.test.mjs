import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fixture} from './fixtures/type-judgment/context.mjs';
import {buildOptions,buildWorkload,runCli} from '../archive/tools/type-judgment/options.mjs';
import {buildAliasEvidence} from '../archive/tools/type-judgment/alias-evidence.mjs';

function middle() {
 const {context,exam}=fixture();
 context.master=new Map(['M3-01','M3-02'].map(key=>[key,{key,keyType:'standardUnitKey',status:'active'}]));
 context.master.set('M3-01-S',{key:'M3-01-S',keyType:'subUnitKey',parentKey:'M3-01',status:'active'});
 context.registry.bindingRows=[{curriculum:'2015',standardCourse:'중3 수학',standardUnitKey:'M3-01',subUnitKey:'M3-01-S',problemTypeKey:'PT_A',status:'ACTIVE',ownerPack:'P'}];
 context.packs.get('P').standardCourses=['중3 수학'];
 context.records=[{...context.records[0],standardCourse:'중3',standardUnitKey:'M3-01',subUnitKey:'M3-01-S',sourceArchiveFile:'original/middle/m3/1mid/a.js'}];
 context.courseAliasEvidence=buildAliasEvidence(context);
 exam.rows[0].metadata=context.records[0];exam.questions[0].standardUnitKey='M3-01';exam.questions[0].subUnitKey='M3-01-S';
 return {context,exam};
}
test('same-unit observed aliases expose candidates with binding debt, never invented global aliases',()=>{
 const {context}=middle(),scope={curriculum:'2015',course:'중3',unit:'M3-01',sub:'M3-01-S'};
 const result=buildOptions(context,scope);assert.equal(result.candidates[0].bindingStatus,'ALIAS');assert.equal(result.candidates[0].stage,1);
 assert.equal(buildOptions(context,{...scope,course:'만든 별칭'}).candidates.length,0);
 assert.equal(buildOptions(context,{...scope,sourceArchiveFile:'original/middle/m2/1mid/a.js'}).status,'SCOPE_EVIDENCE_CONFLICT');
});
test('approved actual unit usage is the third fallback and never promotes status',()=>{
 const {context}=middle();context.registry.bindingRows=[];
 const before=JSON.stringify(context.records),scope={curriculum:'2015',course:'중3',unit:'M3-01',sub:'M3-01-S'};
 const result=buildOptions(context,scope);assert.equal(result.candidates[0].bindingStatus,'USED_IN_UNIT');assert.equal(result.candidates[0].stage,3);
 context.records[0].fieldStatus.problemType='manual_review_pending';assert.equal(buildOptions(context,scope).candidates.length,0);
 assert.ok(before.includes('approved_source'));
});
test('explicit crosswalk leaf equivalence supplies second-stage cross-curriculum candidates only',t=>{
 const {context}=middle();const root=fs.mkdtempSync(path.join(os.tmpdir(),'type-cross-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));context.root=root;
 const dir=path.join(root,'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0');fs.mkdirSync(dir,{recursive:true});
 const rpmPath={majorUnit:'A',midUnit:'B',l3:'C',l4:'D'};
 fs.writeFileSync(path.join(dir,'middle3.json'),JSON.stringify({records:[
 {id:'old',curriculum:'2015',scope:'중3',standardUnitKey:'M3-01',rpmPath,bindingStatus:'ACTIVE'},
 {id:'new',curriculum:'2022',scope:'중3 수학',standardUnitKey:'M3-02',rpmPath,bindingStatus:'ACTIVE'}]}));
 context.registry.bindingRows=[{curriculum:'2022',standardCourse:'중3 수학',standardUnitKey:'M3-02',problemTypeKey:'PT_B',status:'ACTIVE',ownerPack:'P'}];context.packs.get('P').curricula.push('2022');
 context.courseAliasEvidence=buildAliasEvidence(context);
 const result=buildOptions(context,{curriculum:'2015',course:'중3',unit:'M3-01',sub:null});
 assert.equal(result.candidates[0].key,'PT_B');assert.equal(result.candidates[0].bindingStatus,'CROSS_CURRICULUM');assert.equal(result.candidates[0].stage,2);
});
test('PT then TPL output suppresses long definitions until the chosen PT stage',()=>{
 const {context}=middle(),scope={curriculum:'2015',course:'중3',unit:'M3-01',sub:null};
 const pt=buildOptions(context,scope,{stage:'pt'});assert.equal(pt.candidates[0].templates.length,0);assert.equal(pt.candidates[0].templateCount,2);
 const tpl=buildOptions(context,scope,{stage:'tpl',pt:'PT_A'});assert.equal(tpl.candidates[0].templates.length,2);
 assert.equal(buildOptions(context,scope,{stage:'tpl',pt:'PT_NO'}).status,'PT_NOT_IN_CANDIDATE_POOL');
 assert.throws(()=>runCli(['--pool','exact']),/INVALID_ARGUMENT/);
});
test('workload exposes override/inline provenance and checks resulting active units',()=>{
 const {context,exam}=middle();exam.rows[0].metadata.subUnitKey='INVALID';
 assert.equal(Object.values(buildWorkload(context,exam).optionSets)[0].status,'INVALID_CANONICAL_SCOPE');
 const inline=buildWorkload(context,exam,{units:'inline'});assert.equal(inline.rows[0].unitSource,'INLINE');assert.equal(Object.values(inline.optionSets)[0].candidates.length,1);
 const override=buildWorkload(context,exam,{units:{q1:{standardUnitKey:'M3-01',subUnitKey:'M3-01-S'}}});assert.equal(override.rows[0].unitSource,'OVERRIDE');
});

test('EXACT evidence remains its actual row when a later broad alias binds the same PT',()=>{
 const {context}=middle();context.registry.bindingRows.push({...context.registry.bindingRows[0],subUnitKey:null});
 const result=buildOptions(context,{curriculum:'2015',course:'중3 수학',unit:'M3-01',sub:'M3-01-S'});
 assert.equal(result.candidates[0].bindingStatus,'EXACT');assert.equal(result.candidates[0].evidence.sub,'M3-01-S');
});
