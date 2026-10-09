'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),archive=path.join(root,'archive');
const index=JSON.parse(fs.readFileSync(path.join(archive,'data/generated-lite-consumer/v1/index.json'),'utf8'));
const b04=index.records.filter(x=>x.uid.startsWith('ALITE-BSG26-B04R2-'));
const b05=index.records.filter(x=>x.uid.startsWith('ALITE-BSG26-B05R2-Q21-'));
const all=[...b04,...b05],hold=Array.from({length:10},(_,i)=>'ALITE-BSG26-B05R2-Q22-S'+String(i+1).padStart(2,'0'));
const original='archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js';
function sha(buf){const b=Buffer.isBuffer(buf)?buf:Buffer.from(buf);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')}
function fp(q){const s=JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution});let n=14695981039346656037n;for(let i=0;i<s.length;i++)n=BigInt.asUintN(64,(n^BigInt(s.charCodeAt(i)))*1099511628211n);return 'fnv1a64-utf16:'+n.toString(16).padStart(16,'0')}
test('B04 26 and B05 Q21 9 are uniquely registered, while Q22 10 HOLD never become selectable',()=>{
 assert.equal(index.approvedCount,323);
 assert.equal(index.records.length,323);
 assert.equal(index.approvedBySchool['효천고'],92);
 assert.equal(index.approvedBySchool['복성고'],191);
 assert.equal(b04.length,26);assert.equal(b05.length,9);assert.equal(all.length,35);
 assert.ok(all.every(x=>x.consumerSelectable&&x.approval==='USER_DIRECTED_OPERATING_APPROVED'));
 assert.equal(new Set(index.records.map(x=>x.uid)).size,323);
 assert.equal(hold.filter(x=>index.excludedHoldUids.includes(x)).length,0);
 assert.equal(hold.filter(x=>index.records.some(r=>r.uid===x)).length,10);
 assert.equal(hold.filter(x=>all.some(r=>r.uid===x)).length,0);
 assert.equal(sha(fs.readFileSync(path.join(root,original))),'8266fa476906e9134b94f23e803bd3b2fb26ece4');
});
test('35 registered UIDs bind exact Git blobs, source/meta, 23 five-choice and 12 subjective math items',()=>{
 const memo=new Map(), metadata=new Map(), source=new Map();
 let objective=0,subjective=0;
 const positions={'①':0,'②':0,'③':0,'④':0,'⑤':0};
 for(const row of all){
  const file=path.join(archive,row.shard);
  const bytes=fs.readFileSync(file);
  assert.equal(sha(bytes),row.consumerShardGitSha,row.uid);
  const shard=memo.get(row.shard)||JSON.parse(bytes);
  memo.set(row.shard,shard);
  assert.equal(shard.schemaVersion,'ALIVE_GENERATED_CONSUMER_SHARD_V1');
  const entries=shard.records.filter(x=>x.generatedUid===row.uid&&x.localOrdinal===row.localOrdinal);
  assert.equal(entries.length,1,row.uid);
  const r=entries[0],q=r.question;
  assert.equal(r.sourceKind,'generated');
  assert.equal(r.sourceExamBlobSha,row.sourceExamBlobSha);
  assert.equal(r.contentFingerprint,row.contentFingerprint);
  assert.equal(fp(q),row.contentFingerprint);
  assert.equal(q.uid,row.uid);
  assert.equal(q.subUnitKey,row.l2);
  assert.equal(row.rpmL3,r.rpmPrimary.l3);
  assert.equal(row.rpmL4,r.rpmPrimary.l4);
  assert.equal(row.rpmRecordId,r.rpmPrimary.recordId);
  assert.equal(row.sourceShardGitSha,r.sourceShardGitSha);
  assert.equal(row.shardGitBlobSha,row.consumerShardGitSha);
  assert.equal(row.sourceExamPath,original);
  assert.equal(row.reviewStatus,'USER_DIRECTED_OPERATING_APPROVAL_FORMAL_BLIND_NOT_CLAIMED');
  assert.ok(['하','중','상'].includes(q.level));
  assert.ok([2,3,4].includes(q.difficultyBucket));
  assert.ok(q.content.length&&q.solution.length&&q.answer.length);
  if(q.choices.length===5){
   objective++;positions[q.answer]++;
   assert.equal(q.questionType,'객관식');
   assert.equal(new Set(q.choices).size,5);
   assert.ok('①②③④⑤'.includes(q.answer));
   assert.ok(q.solution.endsWith('정답은 '+q.answer+'이다.'));
  }else{
   subjective++;
   assert.equal(q.choices.length,0);
   assert.ok(['서술형','주관식','단답형'].includes(q.questionType));
   assert.ok(q.solution.includes('따라서'));
  }
  const srcPath=path.join(root,r.sourceShard);
  const srcBytes=fs.readFileSync(srcPath);
  assert.equal(sha(srcBytes),r.sourceShardGitSha,row.uid);
  let src=source.get(r.sourceShard);
  if(!src){const context={window:{}};vm.runInNewContext(srcBytes.toString('utf8'),context,{timeout:1000});src=context.window.questionBank;source.set(r.sourceShard,src)}
  const q0=src.find(x=>x.uid===row.uid);
  assert.ok(q0,row.uid);
  assert.equal(q0.content,q.content);
  assert.deepEqual(Array.from(q0.choices),Array.from(q.choices));
  assert.equal(q0.answer,q.answer);assert.equal(q0.solution,q.solution);
  const metaPath=r.sourceShard.replace('/shards/','/metadata/').replace(/\.js$/,'.json');
  let m=metadata.get(metaPath);
  if(!m){m=JSON.parse(fs.readFileSync(path.join(root,metaPath),'utf8'));metadata.set(metaPath,m)}
  const mr=m.find(x=>x.uid===row.uid);
  assert.equal(mr?.targetSubUnitKey,row.l2);
  assert.equal(mr?.rpmCrosswalkId,row.rpmRecordId);
  assert.equal(mr?.studentSupplyEligible,true);
  assert.equal(mr?.consumerDbRegistered,true);
  assert.equal(mr?.reviewApprovalStatus,'OPERATING_APPROVED_USER_OVERRIDE_FORMAL_BLIND_NOT_CERTIFIED');
 }
 assert.equal(memo.size,5);
 assert.equal(source.size,5);
 assert.equal(metadata.size,5);
 assert.equal(objective,23);assert.equal(subjective,12);
 assert.deepEqual(positions,{'①':4,'②':5,'③':8,'④':4,'⑤':2});
});
test('B04 q23 matrix-route metadata uses existing RPM multiplication and B05 q21 repaired set typography is intact',()=>{
 const q23=all.filter(x=>x.sourceQid===23);
 assert.equal(q23.length,8);
 assert.ok(q23.every(x=>x.rpmRecordId==='H1-RPM-201'&&x.rpmL3==='행렬의 연산'&&x.rpmL4==='행렬의 곱셈'));
 const table=all.find(x=>x.uid==='ALITE-BSG26-B04R2-Q23-S01');
 assert.ok(table);
 const data=JSON.parse(fs.readFileSync(path.join(archive,table.shard),'utf8'));
 const q=data.records.find(x=>x.generatedUid===table.uid).question;
 assert.ok(q.content.includes('<table class="question-table">')&&q.content.includes('출발'));
 const item=all.find(x=>x.uid==='ALITE-BSG26-B05R2-Q21-S07');
 assert.ok(item);
 const bank=JSON.parse(fs.readFileSync(path.join(archive,item.shard),'utf8'));
 const fixed=bank.records.find(x=>x.generatedUid===item.uid).question;
 assert.ok(fixed.solution.includes('$\\{1,2\\}$'),'the math set braces must be visible');
 assert.equal(fixed.choices.length,0);
});
