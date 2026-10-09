'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),base='archive/generated/lite/v1/2022/H1/H22-C-06-INEQUALITY/';
const js=fs.readFileSync(path.join(root,base+'shards/batch-BSG26-B02-q11.js'),'utf8'),context={window:{}};
vm.runInNewContext(js,context);const questions=context.window.questionBank;
const metadata=JSON.parse(fs.readFileSync(path.join(root,base+'metadata/batch-BSG26-B02-q11.json')));
const ext=JSON.parse(fs.readFileSync(path.join(root,base+'extension-l3/registry.json')));
const db=JSON.parse(fs.readFileSync(path.join(root,'archive/data/generated-lite-consumer/v1/index.json')));
const shard=JSON.parse(fs.readFileSync(path.join(root,'archive/data/generated-lite-consumer/v1/shards/H22-C-06-INEQUALITY/bokseong-2026-1final-batch-BSG26-B02-q11.json')));
test('q11 all nine released without legacy hold leakage',()=>{
 assert.equal(db.approvedCount,331);assert.equal(db.approvedBySchool['복성고'],191);assert.equal(db.approvedBySchool['효천고'],92);
 assert.equal(db.excludedHoldUids.length,17);assert.equal(shard.records.length,9);assert.equal(questions.length,9);
 const uid=new Set(db.records.map(x=>x.uid));assert.equal(uid.size,331);
 for(const x of shard.records){assert.ok(uid.has(x.generatedUid));assert.ok(!db.excludedHoldUids.includes(x.generatedUid));}
});
test('three exact RPM mappings and six local EXT mappings are unambiguous',()=>{
 const rpm={A03:'H1-RPM-184',A06:'H1-RPM-184',A09:'H1-RPM-185'};
 let nRpm=0,nExt=0;for(let i=0;i<9;i++){const q=questions[i],m=metadata[i],c=shard.records[i],code=q.uid.slice(-3);
 assert.equal(m.uid,q.uid);assert.equal(c.generatedUid,q.uid);assert.equal(c.question.answer,q.answer);assert.equal(c.question.content,q.content);
 assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);assert.ok(q.solution.includes('정답은 '+q.answer+'이다.'));
 assert.ok(m.studentSupplyEligible&&m.consumerDbRegistered);
 if(rpm[code]){nRpm++;assert.equal(q.rpmRecordId,rpm[code]);assert.equal(c.rpmPrimary.recordId,rpm[code]);}
 else{nExt++;assert.equal(q.extensionL3Id,'EXT-H1-BSG26-ABS-PIECEWISE-L3');assert.equal(c.rpmPrimary,null);assert.equal(m.canonicalPromoted,false);}
 assert.ok(!['H1-RPM-182','H1-RPM-183'].includes(q.rpmRecordId));
 }
 assert.equal(nRpm,3);assert.equal(nExt,6);
 const reg=ext.candidates[0];assert.equal(reg.reviewStatus,'SEMANTIC_REVIEWED');assert.equal(reg.canonicalPromoted,false);assert.equal(reg.exampleUids.length,6);
});
