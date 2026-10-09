'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const dir='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2026/26_복성고_SOURCE_PENDING/';
const srcOriginal='archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js';
const originalSha='8266fa476906e9134b94f23e803bd3b2fb26ece4';
const index=JSON.parse(fs.readFileSync(path.join(root,'archive/data/generated-lite-consumer/v1/index.json'),'utf8'));
const frozen=[...JSON.parse(fs.readFileSync(path.join(root,dir+'B01_A1_STUDENT_ONLY_INDEPENDENT_FREEZE_20261009.json'),'utf8')).items,...JSON.parse(fs.readFileSync(path.join(root,dir+'B02_A1_STUDENT_ONLY_INDEPENDENT_FREEZE_20261009.json'),'utf8')).items];
const comparison=JSON.parse(fs.readFileSync(path.join(root,dir+'B01_B02_A2_INDEPENDENT_COMPARE_20261009.json'),'utf8'));
const approved=index.records.filter(r=>r.uid.startsWith('ALITE-BSG26-B01R2-')||r.uid.startsWith('ALITE-BSG26-B02-'));
const frozenMap=new Map(frozen.map(q=>[q.uid,q]));
function gitSha(bytes){const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')}
function fingerprint(q){const s=JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution});let n=14695981039346656037n;for(let i=0;i<s.length;i++)n=BigInt.asUintN(64,(n^BigInt(s.charCodeAt(i)))*1099511628211n);return 'fnv1a64-utf16:'+n.toString(16).padStart(16,'0')}
test('B01+B02 student-first A1 83 frozen, A2 83 exact; 83 registered with approved q11 semantics',()=>{
 assert.equal(frozen.length,83);assert.equal(frozenMap.size,83);
 assert.equal(comparison.scope,83);assert.equal(comparison.mathMismatch,0);assert.equal(comparison.storedAnswerAgreement,83);
 assert.equal(index.approvedCount,338);assert.equal(index.records.length,338);
 assert.equal(index.approvedBySchool['복성고'],191);assert.equal(index.approvedBySchool['효천고'],92);
 assert.equal(approved.length,83);
 assert.equal(approved.filter(x=>x.uid.includes('B01R2')).length,45);
 assert.equal(approved.filter(x=>x.uid.includes('B02')).length,38);
 const hold=Array.from({length:9},(_,i)=>'ALITE-BSG26-B02-Q11-A'+String(i+1).padStart(2,'0'));
 assert.equal(hold.filter(x=>index.excludedHoldUids.includes(x)).length,0);
 assert.ok(hold.every(x=>index.records.some(r=>r.uid===x)));
 assert.equal(new Set(index.records.map(r=>r.uid)).size,338);
 assert.equal(gitSha(fs.readFileSync(path.join(root,srcOriginal))),originalSha);
});
test('74 review-approved consumer rows bind SHA-exact source JS, metadata, 5-option independent solution and original question',()=>{
 const shards=new Map(),sources=new Map(),meta=new Map();
 const hist={'①':0,'②':0,'③':0,'④':0,'⑤':0};
 for(const row of approved){
  const bytes=fs.readFileSync(path.join(root,'archive',row.shard));
  assert.equal(gitSha(bytes),row.consumerShardGitSha,row.uid);
  if(!shards.has(row.shard))shards.set(row.shard,JSON.parse(bytes));
  const body=shards.get(row.shard);
  assert.equal(body.schemaVersion,'ALIVE_GENERATED_CONSUMER_SHARD_V1');
  const matches=body.records.filter(x=>x.generatedUid===row.uid&&x.localOrdinal===row.localOrdinal);
  assert.equal(matches.length,1,row.uid);
  const item=matches[0],q=item.question,f=frozenMap.get(row.uid);
  assert.ok(f,row.uid);
  assert.equal(item.sourceShardGitSha,row.sourceShardGitSha);
  assert.equal(item.l2,row.l2);assert.equal(q.subUnitKey,row.l2);
  assert.equal(q.uid,row.uid);assert.equal(q.content,f.studentInput.content);
  assert.deepEqual(q.choices,f.studentInput.choices);
  assert.equal(q.answer,'①②③④⑤'[f.independentAnswer.choiceIndex-1]);
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  assert.ok(q.solution.includes('정답은 '+q.answer+'이다.'),row.uid);
  assert.equal(fingerprint(q),row.contentFingerprint);
  assert.equal(item.contentFingerprint,row.contentFingerprint);
  assert.equal(row.sourceExamBlobSha,originalSha);assert.equal(row.consumerSelectable,true);
  assert.equal(row.approval,'REVIEW_APPROVED');assert.equal(row.reviewStatus,'REVIEW_PASS');
  hist[q.answer]++;
  const sourcePath=item.sourceShard;
  if(!sources.has(sourcePath)){
   const sb=fs.readFileSync(path.join(root,sourcePath));
   assert.equal(gitSha(sb),row.sourceShardGitSha,row.uid);
   const win={window:{}};vm.runInNewContext(sb.toString('utf8'),win,{timeout:1200});
   sources.set(sourcePath,win.window.questionBank);
  }
  const source=sources.get(sourcePath).find(x=>x.uid===row.uid);
  assert.ok(source,row.uid);
  for(const field of ['content','answer','solution'])assert.equal(source[field],q[field],row.uid+' '+field);
  assert.deepEqual(Array.from(source.choices),q.choices);
  const metaPath=sourcePath.replace('/shards/','/metadata/').replace(/\.js$/,'.json');
  if(!meta.has(metaPath))meta.set(metaPath,JSON.parse(fs.readFileSync(path.join(root,metaPath),'utf8')));
  const m=meta.get(metaPath).find(x=>x.uid===row.uid);
  assert.ok(m&&m.studentSupplyEligible&&m.consumerDbRegistered,row.uid);
  assert.equal(m.independentMathReview,'PASS_STUDENT_FIRST_A1_A2',row.uid);
  assert.ok(['REVIEW_APPROVED_A1_A2_20261009','REVIEW_APPROVED_20261009'].includes(m.reviewApprovalStatus),row.uid);
  assert.equal(m.rpmCrosswalkId||undefined,row.rpmRecordId||undefined,row.uid);
 }
 assert.equal(shards.size,12);assert.equal(sources.size,12);assert.equal(meta.size,12);
 assert.deepEqual(hist,{'①':12,'②':14,'③':25,'④':23,'⑤':9});
});
