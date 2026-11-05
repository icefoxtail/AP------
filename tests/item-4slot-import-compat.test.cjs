'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const {loadExam}=require('../tools/4slot/exam-items.cjs');
const {compactItem}=require('../tools/4slot/import-4slot.cjs');
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'four-slot-named-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const source='original/middle/m3/fixture.js',rel='archive/data/item-4slot/'+source.replace('.js','.4slot.json');
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v));};
 const bank=[{id:'q01',question:'first',solution:'first solution'},{id:'s01',question:'second',solution:'second solution'}];
 const js=()=> 'window.questionBank='+JSON.stringify(bank)+';';
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js()),dictionaryVersion:'test-v1',evidence:{branch:'work',commit:'a'.repeat(40),path:'out.json'},reviewedBy:{agent:'reviewer',at:'2026-11-05',sampled:[]},items:bank.map((q,i)=>({ordinal:i+1,sourceQuestionNo:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};
 const identity={records:bank.map((q,i)=>({questionUid:'qid_v1_'+String(i+1).padStart(64,'0'),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:q.id}))};
 const write=()=>{save('archive/exams/'+source,js());save(rel,data);save('archive/data/question_identity_map.json',identity);save('docs/architecture/4slot/term-dictionary-v1.5.json',{dictionaryVersion:'test-v1',terms:[{id:1,ko:'given'},{id:2,ko:'goal'},{id:3,ko:'method'}]});};write();return{root,source,bank,data,identity,save,write,js};
}
test('q01 and s01 bind to existing distinct physical UIDs',t=>{const f=fixture(t),x=mod.build(f.root).index;assert.equal(x.counts.registered,2);assert.equal(x.counts.pending,0);assert.deepEqual(x.records.map(r=>r.sourceQuestionNo),['q01','s01']);assert.deepEqual(x.records.map(r=>r.sourceOrdinal),[1,2]);});
test('named source number cannot point at another physical ordinal',t=>{const f=fixture(t);f.data.items[0].ordinal=2;f.write();assert.ok(mod.build(f.root).index.pending.some(r=>/NAMED_ORDINAL_MISMATCH/.test(r.reason)));});
test('duplicate named source number remains rejected',t=>{const f=fixture(t);f.bank[1].id='q01';f.write();assert.match(mod.build(f.root).index.pending[0].reason,/AMBIGUOUS_SOURCE_NUMBER/);});
test('named compact duplicate labels cannot silently alias one UID',t=>{const f=fixture(t);f.data.items[1].sourceQuestionNo='q01';f.write();assert.equal(mod.build(f.root).index.counts.registered,0);});
test('named label disagreement with identity remains rejected',t=>{const f=fixture(t);f.identity.records[0].sourceQuestionNo='q99';f.write();assert.equal(mod.build(f.root).index.counts.registered,1);});
test('named replay is byte-identical and independently checked',t=>{const f=fixture(t);assert.equal(mod.run(f.root,{write:true}).changed,true);assert.equal(mod.run(f.root,{write:true}).changed,false);assert.equal(mod.run(f.root,{check:true}).changed,false);});
test('native questionBank.question is not mistaken for an empty stem',t=>{const f=fixture(t);assert.equal(loadExam(path.join(f.root,'archive/exams/'+f.source))[0].stem,'first');});
test('examData id/content fallback retains authored number and stem',t=>{const f=fixture(t);f.save('native.js','window.examData={questions:[{id:"s01",content:"native stem"}]};');const x=loadExam(path.join(f.root,'native.js'));assert.equal(x[0].ordinal,'s01');assert.equal(x[0].stem,'native stem');});
test('compact named conversion requires explicit physical mapping',()=>{const it={sourceOrdinal:'q01',format:'단일 정답',slots:{given:[],goal:[],method:[],condition:[]}};assert.throws(()=>compactItem(it,new Map()),/NAMED_SOURCE_POSITION_REQUIRED/);const x=compactItem(it,new Map(),{sourcePosition:2});assert.equal(x.ordinal,2);assert.equal(x.sourceQuestionNo,'q01');});
test('legacy numeric compact serialization stays unchanged',()=>{const x=compactItem({sourceOrdinal:10,format:'단일 정답',slots:{}},new Map(),{sourcePosition:1});assert.equal(x.ordinal,10);assert.equal(Object.hasOwn(x,'sourceQuestionNo'),false);});
test('numeric authored number maps explicitly to native id in dual-number schema',()=>{const x=compactItem({sourceOrdinal:22,format:'서술',slots:{}},new Map(),{sourcePosition:22,sourceQuestionNo:'s01'});assert.equal(x.ordinal,22);assert.equal(x.sourceQuestionNo,'s01');});
function reconcile(f){const q=f.bank[0],id=f.identity.records[0];q.questionUid='unregistered-local-id';id.sourceFingerprint=mod.identityHash(q);f.data.sourceGitBlobSha=mod.blob(f.js());f.data.items[0].uidReconciliation={basis:'EXACT_IDENTITY_SOURCE_FINGERPRINT',legacyUid:q.questionUid,canonicalUid:id.questionUid,sourceFingerprint:id.sourceFingerprint};f.write();}
test('explicit unused author UID reconciliation requires exact identity fingerprint',t=>{const f=fixture(t);reconcile(f);const x=mod.build(f.root).index;assert.equal(x.counts.registered,2);assert.equal(x.records[0].uidReconciliation.legacyUid,'unregistered-local-id');});
test('mismatched source UID without an explicit reconciliation is still rejected',t=>{const f=fixture(t);reconcile(f);delete f.data.items[0].uidReconciliation;f.write();assert.equal(mod.build(f.root).index.counts.registered,1);});
test('reconciliation cannot impersonate another existing canonical UID',t=>{const f=fixture(t);reconcile(f);const alias=f.identity.records[1].questionUid;f.bank[0].questionUid=alias;f.data.items[0].uidReconciliation.legacyUid=alias;f.identity.records[0].sourceFingerprint=mod.identityHash(f.bank[0]);f.data.items[0].uidReconciliation.sourceFingerprint=f.identity.records[0].sourceFingerprint;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();assert.equal(mod.build(f.root).index.counts.registered,1);});
test('source drift cannot reuse an old UID reconciliation',t=>{const f=fixture(t);reconcile(f);f.bank[0].solution='changed';f.data.sourceGitBlobSha=mod.blob(f.js());f.write();assert.equal(mod.build(f.root).index.counts.registered,1);});
