'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),archive=path.join(root,'archive'),index=JSON.parse(fs.readFileSync(path.join(archive,'data/generated-lite-consumer/v1/index.json'),'utf8'));
const rows=index.records.filter(r=>r.uid.startsWith('ALITE-BSG26-B06-'));
const original='archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js';
function gitSha(bytes){const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')}
function fp(q){const s=JSON.stringify({content:q.content,choices:q.choices,answer:q.answer,solution:q.solution});let n=14695981039346656037n;for(let i=0;i<s.length;i++)n=BigInt.asUintN(64,(n^BigInt(s.charCodeAt(i)))*1099511628211n);return 'fnv1a64-utf16:'+n.toString(16).padStart(16,'0')}
function sourceBank(file){const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{timeout:1000});return ctx.window.questionBank}
function originalPng(q){const file=path.join(archive,'assets/images/26_복성고_1학기_기말_고1_기출/'+q+'.png');return fs.readFileSync(file)}
test('B06 25 new UIDs registered without disrupting 165 original approvals or 12 prior HOLD UID exclusions',()=>{
 assert.equal(index.approvedCount,index.records.length);assert.equal(index.records.filter(x=>['복성고','효천고','팔마고'].includes(x.school)).length,454);
 assert.equal(index.records.length,index.approvedCount);
 assert.equal(index.approvedBySchool['효천고'],92);
 assert.equal(index.approvedBySchool['복성고'],191);
 assert.equal(rows.length,25);
 assert.equal(rows.filter(r=>r.uid.includes('-Q18-')).length,10);
 assert.equal(rows.filter(r=>r.uid.includes('-Q19-')).length,15);
 assert.equal(new Set(index.records.map(r=>r.uid)).size,index.records.length);
 assert.ok(index.records.slice(0,92).every(r=>r.school==='효천고'));
 assert.ok(index.records.slice(92,130).every(r=>r.uid.startsWith('ALITE-BSG26-B03-')));
 assert.ok(index.records.slice(130,165).every(r=>r.uid.startsWith('ALITE-BSG26-B04R2-')||r.uid.startsWith('ALITE-BSG26-B05R2-')));
 assert.ok(index.records.slice(165,190).every(r=>r.uid.startsWith('ALITE-BSG26-B06-')));
 assert.equal(index.excludedHoldUids.length,2);
 assert.equal(index.excludedHoldUids.filter(u=>u.includes('B05R2-Q22')).length,0);
 assert.ok(index.excludedHoldUids.every(uid=>!index.records.some(r=>r.uid===uid)));
 assert.equal(gitSha(fs.readFileSync(path.join(root,original))),'8266fa476906e9134b94f23e803bd3b2fb26ece4');
});
test('25 approved records resolve to source+metadata, exact answer and solution and SHA-bound consumer projection',()=>{
 const sources=new Map(),metas=new Map(),consumers=new Map();
 let mc=0,subj=0,svg=new Set();const histogram={'①':0,'②':0,'③':0,'④':0,'⑤':0};
 for(const row of rows){
  assert.ok(row.shard.startsWith('data/generated-lite-consumer/v1/shards/'));
  const raw=fs.readFileSync(path.join(archive,row.shard));
  assert.equal(gitSha(raw),row.consumerShardGitSha,row.uid);
  const body=consumers.get(row.shard)||JSON.parse(raw);
  consumers.set(row.shard,body);
  assert.equal(body.schemaVersion,'ALIVE_GENERATED_CONSUMER_SHARD_V1');
  const matches=body.records.filter(r=>r.generatedUid===row.uid&&r.localOrdinal===row.localOrdinal);
  assert.equal(matches.length,1,row.uid);
  const got=matches[0],q=got.question;
  assert.equal(got.sourceKind,'generated');
  assert.equal(got.sourceExamBlobSha,row.sourceExamBlobSha);
  assert.equal(got.sourceShardGitSha,row.sourceShardGitSha);
  assert.equal(got.contentFingerprint,row.contentFingerprint);
  assert.equal(fp(q),row.contentFingerprint);
  assert.equal(q.uid,row.uid);
  assert.equal(row.sourceExamPath,original);
  assert.equal(q.image,row.imagePath);
  assert.equal(row.imagePath,got.consumerImagePath);
  assert.equal(row.imageGitBlobSha,got.consumerImageGitSha);
  assert.equal(row.rpmRecordId,got.rpmPrimary.recordId);
  assert.equal(row.rpmL3,got.rpmPrimary.l3);
  assert.equal(row.rpmL4,got.rpmPrimary.l4);
  assert.equal(row.reviewStatus,'REVIEW_PASS');
  assert.equal(got.reviewStatus,'REVIEW_PASS');
  assert.equal(row.approval,'REVIEW_APPROVED');
  assert.ok(row.consumerSelectable);
  assert.equal(row.reviewFinalArtifactSha,got.reviewApprovalMainSha);
  assert.ok(/^assets\/generated-lite\/ALITE-[A-Za-z0-9-]+\.svg$/.test(q.image));
  const image=fs.readFileSync(path.join(archive,q.image));assert.equal(gitSha(image),row.imageGitBlobSha);
  const art=image.toString('utf8');
  assert.ok(art.includes('<svg')&&art.includes('</svg>'),row.uid);
  svg.add(q.image);
  let source=sources.get(got.sourceShard);
  if(!source){assert.equal(gitSha(fs.readFileSync(path.join(root,got.sourceShard))),got.sourceShardGitSha);source=sourceBank(got.sourceShard);sources.set(got.sourceShard,source)}
  const rawQ=source.find(x=>x.uid===row.uid);
  assert.ok(rawQ,row.uid);
  for(const fld of ['content','answer','solution','level','difficultyBucket'])assert.equal(q[fld],rawQ[fld],row.uid+':'+fld);
  assert.deepEqual(Array.from(q.choices),Array.from(rawQ.choices),row.uid);
  assert.equal(q.imageAlt&&q.imageAlt.length>0,true);
  const metaPath=got.sourceShard.replace('/shards/','/metadata/').replace(/\.js$/,'.json');
  let m=metas.get(metaPath);
  if(!m){m=JSON.parse(fs.readFileSync(path.join(root,metaPath),'utf8'));metas.set(metaPath,m)}
  const mr=m.find(x=>x.uid===row.uid);
  assert.ok(mr);
  assert.equal(mr.studentSupplyEligible,true);
  assert.equal(mr.consumerDbRegistered,true);
  assert.equal(mr.rpmCrosswalkId,row.rpmRecordId);
  assert.equal(mr.answerPosition,q.choices.length?'①②③④⑤'.indexOf(q.answer)+1:null);
  assert.ok(q.content&&!q.content.includes('**'));
  assert.ok(q.solution);
  if(q.choices.length){
   mc++;histogram[q.answer]++;
   assert.equal(q.choices.length,5);
   assert.equal(new Set(q.choices).size,5);
   assert.ok(q.solution.endsWith('정답은 '+q.answer+'이다.'),row.uid);
  }else{subj++;assert.ok(['단답형','서술형'].includes(q.questionType));}
 }
 assert.equal(sources.size,2);assert.equal(metas.size,2);assert.equal(consumers.size,2);assert.equal(svg.size,9);
 assert.equal(mc,23);assert.equal(subj,2);
 assert.deepEqual(histogram,{'①':1,'②':9,'③':7,'④':3,'⑤':3});
});
test('both original q18/q19 source PNG pixels remain bit-identical in approved inline-SVG projection',()=>{
 const expected=[['q18','31246479479fa431b60c8d53621bbf6aeeab5486'],['q19','97b751794a9acd56a8cc04309c4dbcb5b132914d']];
 for(const [q,sha]of expected){
  const wrapper=fs.readFileSync(path.join(archive,'assets/generated-lite/ALITE-BSG26-B06-ORIGINAL-'+q.toUpperCase()+'.svg'));
  assert.equal(gitSha(wrapper),sha);
  const xml=wrapper.toString('utf8'),m=xml.match(/href="data:image\/png;base64,([a-zA-Z0-9+/=]+)"/);
  assert.ok(m,q);assert.deepEqual(Buffer.from(m[1],'base64'),originalPng(q));
 }
});
test('q19 2 reviewer-authored inverse problems and S03 actual RPM reflect corrected mathematics',()=>{
 const rows19=JSON.parse(fs.readFileSync(path.join(archive,'data/generated-lite-consumer/v1/shards/H22-C-08-COUNTING_PRINCIPLE/bokseong-2026-1final-B06-q19.json')));
 const bySuffix=s=>rows19.records.find(x=>x.generatedUid.endsWith('-'+s));
 let a=bySuffix('S01'),b=bySuffix('S15'),c=bySuffix('S03');
 assert.ok(a&&b&&c);
 assert.ok(a.question.content.includes('$2016$가지'));
 assert.equal(a.question.answer,'⑤');
 assert.ok(b.question.content.includes('1000가지 이상'));
 assert.equal(b.question.answer,'④');
 assert.equal(a.question.choices[4],'$8$');
 assert.equal(b.question.choices[3],'$7$');
 assert.equal(8*7*6*6,2016);
 assert.equal(7*6*5*5,1050);
 assert.equal(6*5*4*4,480);
 assert.equal(c.rpmPrimary.recordId,'H1-RPM-187');
 assert.equal(c.rpmPrimary.l4,'단계별 선택');
});
