'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),source='archive/generated/lite/v1/2022/H1/H22-C-06-SYSTEM/shards/batch-BSG26-B05R2-q22.js';
const metadata='archive/generated/lite/v1/2022/H1/H22-C-06-SYSTEM/metadata/batch-BSG26-B05R2-q22.json';
const consumer='archive/data/generated-lite-consumer/v1/shards/H22-C-06-SYSTEM/bokseong-2026-1final-B05-q22.json';
const index=JSON.parse(fs.readFileSync(path.join(root,'archive/data/generated-lite-consumer/v1/index.json')));
const context={window:{}},sourceBytes=fs.readFileSync(path.join(root,source));
vm.runInNewContext(sourceBytes.toString('utf8'),context,{timeout:1500});
const questions=context.window.questionBank,meta=JSON.parse(fs.readFileSync(path.join(root,metadata))),consumerBytes=fs.readFileSync(path.join(root,consumer)),shard=JSON.parse(consumerBytes),rows=index.records.filter(x=>x.uid.startsWith('ALITE-BSG26-B05R2-Q22-'));
function sha(b){return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')}
function fp(q){const s=JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution});let n=14695981039346656037n;for(let i=0;i<s.length;i++)n=BigInt.asUintN(64,(n^BigInt(s.charCodeAt(i)))*1099511628211n);return 'fnv1a64-utf16:'+n.toString(16).padStart(16,'0')}
test('ten q22 registered; prior 273 unchanged and only two historical holds excluded',()=>{
 assert.equal(index.approvedCount,345);assert.equal(index.records.length,345);assert.equal(index.approvedBySchool['복성고'],191);assert.equal(index.approvedBySchool['효천고'],92);
 assert.equal(index.excludedHoldUids.length,3);assert.equal(rows.length,10);assert.equal(shard.records.length,10);assert.equal(new Set(index.records.map(x=>x.uid)).size,345);
 assert.ok(rows.every(r=>!index.excludedHoldUids.includes(r.uid)&&r.consumerSelectable));
 assert.equal(sha(fs.readFileSync(path.join(root,'archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js'))),'8266fa476906e9134b94f23e803bd3b2fb26ece4');
});
test('ten subjective q22 items use math-compatible answers and exact source/consumer/meta projection',()=>{
 const math=['8','5','3','3','5','12','7','2','2','3'];const rpm=['H1-RPM-185','H1-RPM-185','H1-RPM-185','H1-RPM-185','H1-RPM-185','H1-RPM-184','H1-RPM-181','H1-RPM-185','H1-RPM-185','H1-RPM-185'];
 assert.equal(questions.length,10);assert.equal(meta.length,10);for(let i=0;i<10;i++){const q=questions[i],r=rows[i],m=meta[i],c=shard.records[i];assert.equal(q.uid,r.uid);assert.equal(m.uid,q.uid);assert.equal(c.generatedUid,q.uid);assert.equal(q.questionType,'서술형');assert.equal(q.choices.length,0);assert.equal(q.answer,'$'+math[i]+'$');assert.equal(r.rpmRecordId,rpm[i]);assert.equal(c.rpmPrimary.recordId,rpm[i]);
 assert.equal(c.question.content,q.content);assert.equal(c.question.answer,q.answer);assert.equal(c.question.solution,q.solution);assert.equal(fp(q),r.contentFingerprint);assert.equal(fp(q),c.contentFingerprint);
 assert.equal(r.sourceShardGitSha,sha(sourceBytes));assert.equal(r.consumerShardGitSha,sha(consumerBytes));assert.equal(m.consumerDbRegistered,true);assert.equal(m.studentSupplyEligible,true);
 assert.equal(r.reviewStatus,'USER_DIRECTED_OPERATING_APPROVAL_FORMAL_BLIND_NOT_CERTIFIED');}
});
