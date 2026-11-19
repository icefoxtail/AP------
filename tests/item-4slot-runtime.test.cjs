'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const consumer=require('../archive/item-4slot.js');
const source='original/high/h2/2final/fixture.js',rel='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'four-slot-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v));};
 const bank=[{id:1,content:'Find x',choices:['a','b'],answer:'a',solution:'Compute x'}, {id:2,content:'Find y',choices:[],answer:'y',solution:'Compute y'}];
 const js=()=> 'window.questionBank='+JSON.stringify(bank)+';';
 const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'x'},{id:2,ko:'y'},{id:3,ko:'method'}]};
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js()),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'work/4slot',commit:'a'.repeat(40),path:'out/fixture.4slot.json'},reviewedBy:{agent:'existing-reviewer',at:'2026-11-05',sampled:[1]},items:bank.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};
 let identity={records:[]};
 function sync(){identity.records=bank.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q)}));save('archive/data/question_identity_map.json',identity);save('archive/exams/'+source,js());}
 const write=()=>{save(rel,data);save('docs/architecture/4slot/term-dictionary-v1.5.json',dict);sync();};write();
 return {root,save,bank,data,dict,js,sync,write,get identity(){return identity;}};
}
test('existing compact is registered and the consumer returns all four slots',t=>{const f=fixture(t),{index}=mod.build(f.root);assert.equal(index.counts.registered,2);assert.equal(index.counts.pending,0);assert.equal(mod.verify(index).verified,2);assert.deepEqual(consumer.createIndex(index).get(uid(1)).method,[3]);assert.deepEqual(index.files[0].reviewedBy,f.data.reviewedBy);});
test('writes only the derived index and second run is byte-identical',t=>{const f=fixture(t),before=fs.readFileSync(path.join(f.root,rel));assert.equal(mod.run(f.root,{write:true}).changed,true);assert.equal(mod.run(f.root,{write:true}).changed,false);assert.equal(mod.run(f.root,{check:true}).changed,false);assert.deepEqual(fs.readFileSync(path.join(f.root,rel)),before);});
test('metadata-only source change reuses historical student payload',t=>{const f=fixture(t),old=f.js();f.bank[0].problemTypeKey='new';f.sync();const {index}=mod.build(f.root,{readBlob:()=>old});assert.equal(index.counts.registered,2);assert.equal(index.records[0].sourceBinding,'UNCHANGED_STUDENT_PAYLOAD');});
test('one changed solution isolates just that ordinal, never rewrites slots',t=>{const f=fixture(t),old=f.js();f.bank[0].solution='Different reasoning';f.sync();const {index}=mod.build(f.root,{readBlob:()=>old});assert.equal(index.counts.registered,1);assert.equal(index.records[0].sourceQuestionNo,'2');assert.equal(index.pending[0].reason,'STALE_STUDENT_PAYLOAD');});
test('one registered renderer sidecar preserves unrelated payload and asset baselines',t=>{
 const adapter=require('../tools/4slot/registered-renderer-continuity.cjs'),original=adapter.verify;
 t.after(()=>{adapter.verify=original;});
 const f=fixture(t);f.bank[0].image='assets/old.svg';f.bank[1].image='assets/neighbor.svg';
 f.save('archive/assets/old.svg','<svg>old</svg>');f.save('archive/assets/neighbor.svg','<svg>neighbor</svg>');
 f.data.sourceGitBlobSha=mod.blob(f.js());f.write();const historical=f.js(),before=mod.build(f.root).index;
 const compactBytes=fs.readFileSync(path.join(f.root,rel));
 f.bank[0].image='assets/current.svg';f.save('archive/assets/current.svg','<svg>reviewed replacement</svg>');f.save('archive/assets/neighbor.svg','<svg>unreviewed changed neighbor</svg>');f.sync();
 const sidecar='.archive-meta-register/4slot-renderer-continuity/selected.json';
 f.save(sidecar,{sourceArchiveFile:source,questionUid:uid(1),sourceOrdinal:1,receiptRef:{path:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/selected.json'}});
 f.save('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/selected.json',{approval:{evidenceRefs:[]}});
 let calls=0;adapter.verify=(root,entry)=>{calls++;assert.equal(entry.questionUid,uid(1));return{status:'PASS'};};
 const one=mod.build(f.root,{previous:before,readBlob:()=>historical});
 assert.equal(one.index.records.length,1);assert.equal(one.index.records[0].questionUid,uid(1));assert.equal(one.index.records[0].sourceBinding,'REGISTERED_RENDERER_CONTINUITY');
 assert.equal(mod.verify(one.index).verified,1);
 const api=consumer.createIndex(one.index);assert.deepEqual(api.get(uid(1)).method,[3]);
 assert.deepEqual(api.find({method:[3]},{dictionaryVersion:f.dict.dictionaryVersion}).map(r=>r.questionUid),[uid(1)]);
 assert.ok(Object.isFrozen(api.get(uid(1)).rendererContinuityRef));
 for(const change of [{rendererContinuityRef:undefined},{rendererContinuityRef:{path:sidecar,sha256:'bad'}},{rendererContinuityRef:{path:sidecar,sha256:['a'.repeat(64)]}},{rendererContinuityRef:{path:sidecar+'/../other.json',sha256:'a'.repeat(64)}},{independentReviewClaim:true}]){
   const invalid=structuredClone(one.index);Object.assign(invalid.records[0],change);assert.throws(()=>consumer.createIndex(invalid),/FOUR_SLOT_RENDERER_CONTINUITY_REF_INVALID/);
 }
 assert.equal(one.index.pending.find(p=>p.ordinal===2).reason,'STALE_ASSET_BYTES');
 assert.deepEqual(one.index.files[0].baselineAssetDigests,before.files[0].baselineAssetDigests);
 assert.deepEqual(one.index.files[0].baselinePayloadHashes,before.files[0].baselinePayloadHashes);
 assert.deepEqual(fs.readFileSync(path.join(f.root,rel)),compactBytes);
 assert.equal(mod.build(f.root,{previous:one.index,readBlob:()=>historical}).stats.reusedFiles,1);assert.equal(calls,1);
 // Receipt removal must invalidate the cache and fail only the selected UID.
 fs.rmSync(path.join(f.root,'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/selected.json'));
 adapter.verify=()=>{calls++;throw Error('REGISTERED_RENDERER_CONTINUITY_INVALID:receipt missing');};
 const two=mod.build(f.root,{previous:one.index,readBlob:()=>historical}).index;
 assert.equal(calls,2);assert.equal(two.records.length,0);
 assert.equal(two.pending.find(p=>p.ordinal===2).reason,'STALE_ASSET_BYTES');
 assert.match(two.pending.find(p=>p.ordinal===1).reason,/receipt missing/);
 assert.deepEqual(two.files[0].baselineAssetDigests,before.files[0].baselineAssetDigests);
});
test('missing historical source never silently rebinds stale records',t=>{const f=fixture(t);f.data.sourceGitBlobSha='b'.repeat(40);f.write();const {index}=mod.build(f.root,{readBlob:()=>null});assert.equal(index.counts.registered,0);assert.ok(index.pending.every(r=>r.reason==='SOURCE_BASELINE_UNAVAILABLE'));});
test('persisted baseline supports later changes without Git history',t=>{const f=fixture(t);mod.run(f.root,{write:true});f.bank[0].tags=['new'];f.sync();assert.equal(mod.build(f.root,{readBlob:()=>null}).index.counts.registered,2);});
test('unknown term is isolated, valid question still registers',t=>{const f=fixture(t);f.data.items[0].method=[999];f.write();const {index}=mod.build(f.root);assert.equal(index.counts.registered,1);assert.match(index.pending[0].reason,/INVALID_TERM/);});
test('retired term never becomes active automatically',t=>{const f=fixture(t);f.dict.terms[2].status='RETIRED';f.write();assert.equal(mod.build(f.root).index.counts.registered,0);});
test('dictionary version is discovered, not hard-coded to v1.5',t=>{const f=fixture(t);f.data.dictionaryVersion='term-dict-v1.6-2026-11-05';f.dict.dictionaryVersion=f.data.dictionaryVersion;f.write();assert.equal(mod.build(f.root).index.counts.registered,2);});
test('an unknown dictionary produces explicit debt',t=>{const f=fixture(t);f.data.dictionaryVersion='unknown';f.write();assert.match(mod.build(f.root).index.pending[0].reason,/DICTIONARY_VERSION_UNKNOWN/);});
test('candidate terms and provenance survive without manufacturing dictionary entries',t=>{const f=fixture(t);f.data.items[0].candidates=['new candidate'];f.write();const {index}=mod.build(f.root);assert.equal(index.counts.withCandidates,1);assert.deepEqual(index.records[0].candidates,['new candidate']);assert.equal(index.records[0].independentReviewClaim,false);assert.deepEqual(index.files[0].evidence,f.data.evidence);});
test('duplicate ordinal does not bind either duplicate',t=>{const f=fixture(t);f.data.items.push({...f.data.items[0]});f.write();const {index}=mod.build(f.root);assert.equal(index.counts.registered,1);assert.ok(index.pending.some(x=>x.reason.includes('DUPLICATE_ORDINAL')));});
test('empty required slot remains pending',t=>{const f=fixture(t);f.data.items[0].goal=[];f.write();assert.match(mod.build(f.root).index.pending[0].reason,/REQUIRED_SLOT_EMPTY/);});
test('missing review reference is never invented',t=>{const f=fixture(t);delete f.data.reviewedBy;f.write();assert.equal(mod.build(f.root).index.counts.registered,0);});
test('canonical identity UID is reused instead of minted',t=>{const f=fixture(t);f.identity.records[0].questionUid=uid(99);f.save('archive/data/question_identity_map.json',f.identity);assert.ok(mod.build(f.root).index.records.some(r=>r.questionUid===uid(99)));});
test('duplicate UID outside this exam invalidates cached joins too',t=>{const f=fixture(t);mod.run(f.root,{write:true});f.identity.records.push({...f.identity.records[0],sourceArchiveFile:'other.js'});f.save('archive/data/question_identity_map.json',f.identity);assert.equal(mod.build(f.root).index.counts.registered,1);});
test('historical identity fingerprint does not override exact reviewed compact freshness',t=>{const f=fixture(t);f.identity.records[0].sourceFingerprint='0'.repeat(64);f.save('archive/data/question_identity_map.json',f.identity);const x=mod.build(f.root).index;assert.equal(x.counts.registered,2);assert.equal(x.counts.identityFingerprintHistorical,1);assert.equal(x.records[0].sourceBinding,'EXACT_BLOB');});
test('printed number and canonical array ordinal are not confused',t=>{const f=fixture(t);f.bank[0].id=10;f.bank[1].id=20;f.data.items[0].ordinal=10;f.data.items[1].ordinal=20;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();const r=mod.build(f.root).index.records[0];assert.equal(r.sourceOrdinal,1);assert.equal(r.sourceQuestionNo,'10');});
test('missing compact item is visible without blocking the other row',t=>{const f=fixture(t);f.data.items.pop();f.write();const {index}=mod.build(f.root);assert.equal(index.counts.registered,1);assert.equal(index.pending[0].reason,'FOUR_SLOT_ITEM_MISSING');});
test('deleting compact input removes stale index entries',t=>{const f=fixture(t);mod.run(f.root,{write:true});fs.unlinkSync(path.join(f.root,rel));assert.equal(mod.run(f.root,{write:true}).counts.registered,0);});
test('path traversal and absolute paths are rejected',t=>{const f=fixture(t);for(const rel of ['../outside','/etc/passwd','archive/../secret','x\\y'])assert.throws(()=>mod.safe(f.root,rel));});
test('source symlinks cannot escape checkout',t=>{const f=fixture(t);const file=path.join(f.root,'archive/exams/'+source);fs.unlinkSync(file);fs.symlinkSync('/etc/passwd',file);assert.match(mod.build(f.root).index.pending[0].reason,/SYMLINK_OUTSIDE_ROOT/);});
test('evaluation is bounded and supports native examData',()=>{assert.equal(mod.loadBank('window.examData={questions:[{number:1,question:"test"}]};')[0].number,1);assert.throws(()=>mod.loadBank('while(true){}'),/timed out/);});
test('consumer queries require dictionary version and preserve slot distinctions',t=>{const f=fixture(t),api=consumer.createIndex(mod.build(f.root).index);assert.throws(()=>api.find({given:[1]}),/DICTIONARY_REQUIRED/);assert.equal(api.find({goal:[1]},{dictionaryVersion:f.dict.dictionaryVersion}).length,0);assert.equal(api.find({given:[1],method:[3]},{dictionaryVersion:f.dict.dictionaryVersion}).length,2);assert.throws(()=>api.find({fake:[1]},{dictionaryVersion:f.dict.dictionaryVersion}),/QUERY_INVALID/);});
test('local asset change stays pending across unrelated future source changes',t=>{const f=fixture(t);f.bank[0].image='assets/images/a.png';f.data.sourceGitBlobSha=mod.blob(f.js());f.save('archive/assets/images/a.png','original');f.write();mod.run(f.root,{write:true});f.save('archive/assets/images/a.png','changed');let result=mod.run(f.root,{write:true});assert.equal(result.counts.registered,1);f.bank[1].tags=['harmless'];f.sync();result=mod.run(f.root,{write:true});assert.equal(result.counts.registered,1);assert.ok(result.pendingItems.some(p=>p.reason==='STALE_ASSET_BYTES'));});
test('Git historical blob comparison works with a real local commit',t=>{const f=fixture(t);execFileSync('git',['init','-q',f.root]);execFileSync('git',['-C',f.root,'add','.']);execFileSync('git',['-C',f.root,'-c','user.name=Test','-c','user.email=test@example.invalid','commit','-qm','fixture']);f.bank[0].level='상';f.sync();assert.equal(mod.build(f.root).index.counts.registered,2);});

test('independent check detects corrupt cached output instead of verifying itself',t=>{const f=fixture(t);mod.run(f.root,{write:true});const p=path.join(f.root,mod.OUTPUT),index=JSON.parse(fs.readFileSync(p));index.records[0].method=[1];f.save(mod.OUTPUT,index);assert.throws(()=>mod.run(f.root,{check:true}),/FOUR_SLOT_RUNTIME_DRIFT/);});
test('a registered subset with stale rows is reported as supplementation, not full PASS',t=>{const f=fixture(t);f.data.items[0].method=[999];f.write();assert.equal(mod.run(f.root).status,'PASS_WITH_SUPPLEMENTS');});

test('explicit invalid identity state is not treated as native unstated state',t=>{const f=fixture(t);f.identity.records[0].status='INVALID';f.save('archive/data/question_identity_map.json',f.identity);assert.equal(mod.build(f.root).index.counts.registered,1);});

test('historical identity cannot waive changed compact student payload',t=>{const f=fixture(t),old=f.js();f.bank[0].solution='Changed';f.sync();f.identity.records[0].sourceFingerprint='0'.repeat(64);f.save('archive/data/question_identity_map.json',f.identity);assert.equal(mod.build(f.root,{readBlob:()=>old}).index.counts.registered,1);});
test('native numbered schema supports unstated legacy printed number',t=>{const f=fixture(t);delete f.bank[0].id;f.bank[0].number=10;f.data.items[0].ordinal=10;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();f.identity.records[0].sourceQuestionNo='';f.save('archive/data/question_identity_map.json',f.identity);const x=mod.build(f.root).index;assert.equal(x.counts.registered,2);assert.equal(x.records[0].sourceOrdinal,1);assert.equal(x.records[0].sourceQuestionNo,'10');});
test('explicit wrong printed number remains a hard join defect',t=>{const f=fixture(t);f.identity.records[0].sourceQuestionNo='9';f.save('archive/data/question_identity_map.json',f.identity);assert.equal(mod.build(f.root).index.pending[0].reason,'IDENTITY_NUMBER_MISMATCH');});

test('string source IDs use explicit printed numbers while retaining canonical raw ID',t=>{const f=fixture(t);f.bank[0].id='q01';f.bank[0].number=1;f.bank[1].id='s01';f.bank[1].number=2;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();const x=mod.build(f.root).index;assert.equal(x.counts.registered,2);assert.equal(x.records[0].sourceOrdinal,1);assert.equal(x.records[0].sourceQuestionNo,'q01');assert.equal(x.records[1].sourceDisplayNumber,2);assert.equal(x.records[1].sourceQuestionNo,'s01');});
test('string source ID mismatch is not waived by matching printed number',t=>{const f=fixture(t);f.bank[0].id='q01';f.bank[0].number=1;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();f.identity.records[0].sourceQuestionNo='wrong';f.save('archive/data/question_identity_map.json',f.identity);assert.equal(mod.build(f.root).index.pending[0].reason,'IDENTITY_NUMBER_MISMATCH');});
test('conflicting numeric id and number remain ambiguous',t=>{const f=fixture(t);f.bank[0].number=99;f.data.sourceGitBlobSha=mod.blob(f.js());f.write();assert.match(mod.build(f.root).index.pending[0].reason,/AMBIGUOUS_SOURCE_NUMBER/);});
test('string identifier without explicit printed number is not guessed',t=>{const f=fixture(t);f.bank[0].id='q01';f.data.sourceGitBlobSha=mod.blob(f.js());f.write();assert.match(mod.build(f.root).index.pending[0].reason,/SOURCE_NUMBER_MISSING/);});

function reconcileFixture(f){
 f.bank[0].questionUid=uid(77);f.data.sourceGitBlobSha=mod.blob(f.js());f.write();
 f.data.identityReconciliation={schemaVersion:'4slot-orphan-uid-reconciliation-v1',sourceGitBlobSha:f.data.sourceGitBlobSha,records:[{sourceOrdinal:1,sourceQuestionNo:'1',embeddedQuestionUid:uid(77),questionUid:uid(1),sourceFingerprint:mod.identityHash(f.bank[0])}]};f.save(rel,f.data);
}
test('orphan embedded UID without exact reconciliation stays pending',t=>{const f=fixture(t);f.bank[0].questionUid=uid(77);f.data.sourceGitBlobSha=mod.blob(f.js());f.write();assert.equal(mod.build(f.root).index.pending[0].reason,'SOURCE_UID_CONFLICT');});
test('explicit reconciliation binds unchanged fingerprint to existing canonical UID',t=>{const f=fixture(t);reconcileFixture(f);const r=mod.build(f.root).index;assert.equal(r.counts.registered,2);assert.equal(r.records[0].questionUid,uid(1));assert.equal(r.records[0].sourceUidBinding,'VERIFIED_ORPHAN_UID_RECONCILIATION');});
for(const fault of ['fingerprint','blob','canonical','used','duplicate','number'])test('orphan reconciliation rejects '+fault,t=>{const f=fixture(t);reconcileFixture(f);const p=f.data.identityReconciliation.records[0];if(fault==='fingerprint')p.sourceFingerprint='0'.repeat(64);if(fault==='blob')f.data.identityReconciliation.sourceGitBlobSha='a'.repeat(40);if(fault==='canonical')p.questionUid=uid(2);if(fault==='number')p.sourceQuestionNo='2';if(fault==='duplicate')f.data.identityReconciliation.records.push({...p});if(fault==='used'){f.identity.records.push({...f.identity.records[0],questionUid:uid(77),sourceArchiveFile:'other.js'});f.save('archive/data/question_identity_map.json',f.identity);}f.save(rel,f.data);assert.equal(mod.build(f.root).index.counts.registered,1);});

test('extractor supports native questionBank question text and string-ID aliases',t=>{const f=fixture(t),E=require('../tools/4slot/exam-items.cjs');f.bank[0]={id:'q01',number:1,question:'native text',solution:'native solution',choices:[]};f.save('archive/exams/'+source,f.js());const rows=E.loadExam(path.join(f.root,'archive/exams/'+source));assert.equal(rows[0].stem,'native text');assert.equal(E.itemLookup(rows).get('q01').ordinal,1);assert.equal(E.itemLookup(rows).get('1').sourceId,'q01');});
test('extractor supports examData questions with id and no number',t=>{const f=fixture(t),E=require('../tools/4slot/exam-items.cjs');f.save('archive/exams/'+source,'window.examData={questions:[{id:7,content:"native",solution:"proof"}]};');const rows=E.loadExam(path.join(f.root,'archive/exams/'+source));assert.equal(rows[0].ordinal,7);assert.equal(rows[0].stem,'native');});
test('source alias collisions are rejected rather than first-matched',()=>{const E=require('../tools/4slot/exam-items.cjs');assert.throws(()=>E.itemLookup([{ordinal:1,aliases:['same']},{ordinal:2,aliases:['same']}]),/AMBIGUOUS_SOURCE_ALIAS/);});
test('compact conversion requires explicit alias mapping for string IDs',()=>{const I=require('../tools/4slot/import-4slot.cjs');const it={sourceOrdinal:'s01',format:'서술',slots:{}};assert.throws(()=>I.compactItem(it,new Map()),/UNRESOLVED_SOURCE_ORDINAL/);assert.equal(I.compactItem(it,new Map(),new Map([['s01',{ordinal:21}]] )).ordinal,21);});

function nativeMethodHold(f) {
 const heldSource='original/middle/m1/1mid/hold-fixture.js', heldRel='archive/data/item-4slot/'+heldSource.replace(/\.js$/,'.4slot.json');
 fs.rmSync(path.join(f.root,rel));
 f.data.sourceArchiveFile=heldSource;
 f.identity.records.forEach(r=>{r.sourceArchiveFile=heldSource;});
 f.save('archive/data/question_identity_map.json',f.identity);
 f.save('archive/exams/'+heldSource,f.js());
 const proofPath='docs/operations/fixture-native-review.json', nativePath='docs/operations/original-review.json', commit='a'.repeat(40);
 const proof={schemaVersion:'m1-s1-independent-exam-review-v1',workKey:'M1-S1-META-FULL',sourceArchiveFile:heldSource,reviewer:f.data.reviewedBy.agent,samples:[{ordinal:1,questionUid:uid(1),result:'PARTIAL_METHOD_EVIDENCE_DEBT',notes:'Existing derivation is incomplete; source evidence is needed.'}]};
 const raw=JSON.stringify(proof),sha256=mod.sha(raw);f.save(proofPath,raw);
 f.data.evidence.independentReview={commit,path:nativePath,sha256};
 f.data.items[0].registrationHold={schemaVersion:'4slot-native-review-hold-v1',reason:'PARTIAL_METHOD_EVIDENCE_DEBT',questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,evidence:{commit,path:proofPath,nativePath,sha256},nextAction:'Obtain and review the missing derivation.'};
 const save=()=>f.save(heldRel,f.data);save();return {save,proof,proofPath,heldRel};
}
test('native method hold preserves the denominator and registers only the valid neighbor',t=>{const f=fixture(t),h=nativeMethodHold(f),x=mod.build(f.root).index;assert.equal(x.counts.items,2);assert.equal(x.counts.registered,1);assert.equal(x.records[0].questionUid,uid(2));assert.equal(x.pending[0].questionUid,uid(1));assert.equal(x.pending[0].reason,'EXPLICIT_REVIEW_HOLD:PARTIAL_METHOD_EVIDENCE_DEBT');assert.equal(mod.verify(x).status,'PASS_WITH_SUPPLEMENTS');assert.equal(consumer.createIndex(x).get(uid(1)),null);});
for(const fault of ['uid','ordinal','reason','reference','sha','missing','native-decision','next-action'])test('explicit hold rejects '+fault+' without registering the held UID',t=>{const f=fixture(t),h=nativeMethodHold(f),hold=f.data.items[0].registrationHold;if(fault==='uid')hold.questionUid=uid(2);if(fault==='ordinal')hold.sourceOrdinal=2;if(fault==='reason')hold.reason='ACCEPTED';if(fault==='reference')hold.evidence.commit='b'.repeat(40);if(fault==='sha')f.save(h.proofPath,JSON.stringify({...h.proof,at:'changed'}));if(fault==='missing')fs.rmSync(path.join(f.root,h.proofPath));if(fault==='native-decision'){h.proof.samples[0].result='ACCEPTED';const raw=JSON.stringify(h.proof);f.save(h.proofPath,raw);hold.evidence.sha256=mod.sha(raw);f.data.evidence.independentReview.sha256=hold.evidence.sha256;}if(fault==='next-action')delete hold.nextAction;h.save();const x=mod.build(f.root).index;assert.equal(x.counts.registered,1);assert.match(x.pending[0].reason,/INVALID_REGISTRATION_HOLD/);assert.equal(x.records[0].questionUid,uid(2));});
test('explicit hold does not waive a missing required method slot',t=>{const f=fixture(t),h=nativeMethodHold(f);f.data.items[0].method=[];h.save();assert.match(mod.build(f.root).index.pending[0].reason,/REQUIRED_SLOT_EMPTY:method/);});
test('hold evidence changes invalidate cached native decisions',t=>{const f=fixture(t),h=nativeMethodHold(f);mod.run(f.root,{write:true});f.save(h.proofPath,JSON.stringify({...h.proof,changed:true}));assert.match(mod.build(f.root).index.pending[0].reason,/HOLD_EVIDENCE_SHA_MISMATCH/);});

function nativeM2SourceHold(f) {
 const s='original/middle/m2/2mid/hold-fixture.js',p='archive/data/item-4slot/'+s.replace(/\.js$/,'.4slot.json');fs.rmSync(path.join(f.root,rel));f.data.sourceArchiveFile=s;f.identity.records.forEach(r=>{r.sourceArchiveFile=s;});f.save('archive/data/question_identity_map.json',f.identity);f.save('archive/exams/'+s,f.js());
 const e='E041',commit='b'.repeat(40),prefix='archive/data/meta-review/m2-s2-20261114/exams/'+e+'/',copy='docs/operations/fixture-m2/',fields=['method evidence'],tuple={sourceOrdinal:1,questionUid:uid(1)};
 const review={schemaVersion:'m2-s2-meta-review-v1',examId:e,owner:'A',sourceArchiveFile:s,sourceGitBlobSha:f.data.sourceGitBlobSha,items:[{...tuple,metadataRegistrationStatus:'BLOCKED_SOURCE_EVIDENCE',sourceContentStatus:'SOURCE_HOLD',unresolvedFields:fields}]};
 const independent={schemaVersion:'m2-s2-independent-sample-v1',examId:e,author:'A',examiner:'B',sourceArchiveFile:s,sourceGitBlobSha:f.data.sourceGitBlobSha};
 const slots={schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:s,sourceGitBlobSha:f.data.sourceGitBlobSha,items:[tuple]};
 const acceptance={schemaVersion:'m2-s2-root-acceptance-v1',examId:e,owner:'A',reviewer:'ROOT',sampleReviewer:'B',sourceGitBlobSha:f.data.sourceGitBlobSha,semanticReviewStatus:'PRO_REVIEW_COMPLETE_WITH_UNRESOLVED',unresolvedItems:[{...tuple,fields}]};
 const h={schemaVersion:'4slot-native-review-hold-v1',reason:'SOURCE_EVIDENCE_UNRESOLVED',...tuple,sourceQuestionNo:'1',ordinal:1,sourceContentStatus:'SOURCE_HOLD',unresolvedFields:fields,nextAction:'Obtain the missing original proof body.'};
 const refs=[['review','reviewEvidence','review',review],['independentSample','independentEvidence','independent-sample',independent],['fourSlot','fourSlotEvidence','four-slot',slots],['rootAcceptance','evidence','root-acceptance',acceptance]];
 function save(){f.data.evidence.nativeHoldReview={};for(const [key,field,file,doc]of refs){if(key==='rootAcceptance'){acceptance.reviewSha256=h.reviewEvidence.sha256;acceptance.fourSlotSha256=h.fourSlotEvidence.sha256;acceptance.independentSampleSha256=h.independentEvidence.sha256;}const raw=JSON.stringify(doc),ref={commit,path:copy+file+'.json',nativePath:prefix+file+'.json',sha256:mod.sha(raw)};f.save(ref.path,raw);h[field]=ref;f.data.evidence.nativeHoldReview[key]={commit,path:ref.nativePath,sha256:ref.sha256};}f.data.items[0].registrationHold=h;f.save(p,f.data);}
 save();return{h,save,review,independent,slots,acceptance,p};
}
test('M2 native unresolved source evidence remains pending while its valid neighbor registers',t=>{const f=fixture(t),h=nativeM2SourceHold(f),x=mod.build(f.root).index;assert.equal(x.counts.items,2);assert.equal(x.counts.registered,1);assert.equal(x.pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_EVIDENCE_UNRESOLVED');assert.equal(x.records[0].questionUid,uid(2));});
for(const fault of ['accepted-item','unlisted-item','wrong-source','self-review','fields','uid','missing-proof','root-hash'])test('M2 native hold refuses '+fault+' without approving the row',t=>{const f=fixture(t),h=nativeM2SourceHold(f);if(fault==='accepted-item')h.review.items[0].metadataRegistrationStatus='REGISTERED';if(fault==='unlisted-item')h.acceptance.unresolvedItems=[];if(fault==='wrong-source')h.review.sourceArchiveFile='original/middle/m3/1mid/forbidden.js';if(fault==='self-review'){h.independent.examiner='A';h.acceptance.sampleReviewer='A';}if(fault==='fields')h.review.items[0].unresolvedFields=['unrelated'];if(fault==='uid')h.review.items[0].questionUid=uid(2);h.save();if(fault==='missing-proof')fs.rmSync(path.join(f.root,h.h.reviewEvidence.path));if(fault==='root-hash'){h.acceptance.reviewSha256='0'.repeat(64);const raw=JSON.stringify(h.acceptance);f.save(h.h.evidence.path,raw);h.h.evidence.sha256=mod.sha(raw);f.data.evidence.nativeHoldReview.rootAcceptance.sha256=h.h.evidence.sha256;f.save(h.p,f.data);}const x=mod.build(f.root).index;assert.equal(x.counts.registered,1);assert.match(x.pending[0].reason,/INVALID_REGISTRATION_HOLD/);assert.equal(x.records[0].questionUid,uid(2));});
test('M2 hold cannot waive an empty goal or method',t=>{const f=fixture(t),h=nativeM2SourceHold(f);f.data.items[0].method=[];h.save();assert.match(mod.build(f.root).index.pending[0].reason,/REQUIRED_SLOT_EMPTY:method/);});

// The private intake is exercised with synthetic text only. The author and the
// independent review are real files outside the repository, not hash-only claims.
const partial=require('../tools/4slot/partial-submission.cjs');
const importer=require('../tools/4slot/import-4slot.cjs');
const validator=require('../tools/4slot/validate-4slot.cjs');
function privatePartialFixture(t) {
 const f=fixture(t),privateDir=fs.mkdtempSync(path.join(os.tmpdir(),'four-slot-private-'));
 t.after(()=>fs.rmSync(privateDir,{recursive:true,force:true}));
 fs.rmSync(path.join(f.root,rel));
 f.dict.dictionaryVersion='term-dict-v1.6-2026-11-15';
 f.bank[0].content='Find x using method';f.sync();
 const dictPath='docs/architecture/4slot/term-dictionary-v1.6.json';f.save(dictPath,f.dict);
 execFileSync('git',['init','-q',f.root]);execFileSync('git',['-C',f.root,'add','.']);
 execFileSync('git',['-C',f.root,'-c','user.name=Test','-c','user.email=test@example.invalid','commit','-qm','public source and dictionary']);
 const item={questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:1,format:'단일 정답',slots:{given:[{term:'x',src:'stem',quote:'x'}],goal:[{term:'x',src:'stem',quote:'Find x'}],method:[{term:'method',src:'stem',quote:'using method',evidenceType:'IMPLIED',justification:'Synthetic private role explanation.'}],condition:[]}};
 const compact={ordinal:1,format:item.format,given:[1],goal:[1],method:[3],condition:[],candidates:[]};
 const candidate={author:'fixture-author',authoredAtUtc:'2026-11-15T00:00:00Z',provisionalItem:item,canonicalTermIdVector:{given:[1],goal:[1],method:[3],condition:[]},vectorSha256:'a'.repeat(64)};
 const review={schemaVersion:'q22-private-independent-current-source-vector-review-v2',author:candidate.author,reviewer:'fixture-reviewer',reviewedAtUtc:'2026-11-15T01:00:00Z',decision:partial.DECISION,candidateSha256:null,vectorSha256:candidate.vectorSha256,questionUid:uid(1),sourceOrdinal:1,sourceBlob:mod.blob(f.js()),dictionaryBlob:mod.blob(fs.readFileSync(path.join(f.root,dictPath))),scope:{sourceExamDenominator:2,reviewedVectorCount:1,unsubmittedCount:1,otherUidApprovals:0},approvalBoundaries:{fourSlotVectorReviewAccepted:true,fullSemanticFinalQaIssued:false,nativeMetadataApprovalIssued:false,newMathQa:0,sourceChanges:0},validatorBoundary:{currentSourceQuoteChecks:3,sourceQuoteFailures:0},quoteChecks:partial.SLOTS.flatMap(s=>item.slots[s].map((e,i)=>({candidateEntryPointer:`/provisionalItem/slots/${s}/${i}`,quoteSha256:mod.sha(e.quote),literalPresent:true})))};
 const input={schemaVersion:'q22-accepted-private-vector-input-v1',classification:'PRIVATE_NOT_FOR_PUBLIC_GIT',status:'ACCEPTED_VECTOR_ONLY_PENDING_FORMAL_PARTIAL_SUBMISSION_CONTRACT',sourceArchiveFile:source,sourceGitBlobSha:review.sourceBlob,sourceRawSha256:mod.sha(f.js()),dictionaryVersion:f.dict.dictionaryVersion,dictionaryGitBlob:review.dictionaryBlob,sourceDenominator:2,selected:[{questionUid:uid(1),sourceOrdinal:1}],unsubmitted:[{questionUid:uid(2),sourceOrdinal:2,reason:'UNSUBMITTED_NO_APPROVAL_NO_REGISTRATION'}],items:[item],candidates:[],author:{identity:candidate.author},independentReview:{identity:review.reviewer,decision:review.decision,reviewedAtUtc:review.reviewedAtUtc},publicCompactItem:{},newMathQa:0,newSemanticApproval:0,sourceChanges:0,unsubmittedApprovals:0,unsubmittedRegistrations:0};
 function privateSave(name,doc){const file=path.join(privateDir,name),raw=JSON.stringify(doc)+'\n';fs.writeFileSync(file,raw);return{path:file,sha256:mod.sha(raw)};}
 function savePrivate(){const a=privateSave('candidate.json',candidate);input.author.candidatePath=a.path;input.author.candidateSha256=a.sha256;review.candidateSha256=a.sha256;Object.assign(input.independentReview,privateSave('review.json',review));Object.assign(input.publicCompactItem,privateSave('compact-item.json',compact));return privateSave('accepted-input.json',input).path;}
 const inputPath=savePrivate(),args={root:f.root,inputPath,reviewer:review.reviewer,requestId:'synthetic-partial',expectedCompactSha256:'NONE'};
 const submit=(options={})=>importer.importPrivatePartial({...args,...options});
 const submission=()=>({schemaVersion:'archive-meta-4slot-v0',sourceArchiveFile:source,sourceGitBlobSha:input.sourceGitBlobSha,dictionaryVersion:input.dictionaryVersion,judgedBy:{agent:candidate.author,at:candidate.authoredAtUtc},items:input.items,candidates:[],selfCheck:{},scope:partial.SCOPE,expectedQuestionCount:input.sourceDenominator,selected:input.selected.map(r=>({...r,sourceQuestionNo:String(f.bank[r.sourceOrdinal-1]?.id)})),unsubmitted:input.unsubmitted.map(({reason,...r})=>({...r,sourceQuestionNo:String(f.bank[r.sourceOrdinal-1]?.id)}))});
 return {...f,privateDir,inputPath,input,candidate,review,item,compact,args,submit,submission,savePrivate,dictPath};
}
test('full coverage remains strict while an explicit canonical partial partition validates only its selection',t=>{
 const f=privatePartialFixture(t),d=f.submission(),full=structuredClone(d);for(const k of ['scope','expectedQuestionCount','selected','unsubmitted'])delete full[k];
 assert.ok(validator.validateData(full,{root:f.root}).fail.includes('#2 missing'));
 const v=validator.validateData(d,{root:f.root});assert.deepEqual(v.fail,[]);assert.equal(v.stats.unsubmitted,1);assert.equal(v.stats.completeExam,false);
});
test('private import emits safe IDs and spans; unsubmitted rows are absent from every consumer operation',t=>{
 const f=privatePartialFixture(t),sourceBefore=fs.readFileSync(path.join(f.root,'archive/exams/'+source)),identityBefore=fs.readFileSync(path.join(f.root,'archive/data/question_identity_map.json'));
 const dry=f.submit();assert.equal(dry.write,false);assert.equal(fs.existsSync(path.join(f.root,rel)),false);
 const r=f.submit({write:true}),x=mod.build(f.root).index,api=consumer.createIndex(x);assert.equal(r.selected,1);assert.equal(r.completeExam,false);assert.equal(x.counts.items,1);assert.equal(x.counts.registered,1);assert.equal(x.counts.pending,1);assert.equal(x.files[0].expectedQuestionCount,2);assert.equal(x.files[0].completeExam,false);assert.equal(x.files[0].status,'SUPPLEMENT_PENDING');assert.equal(x.pending[0].reason,'NOT_SUBMITTED');assert.equal(x.pending[0].questionUid,uid(2));assert.equal(mod.verify(x).status,'PASS_WITH_SUPPLEMENTS');
 assert.deepEqual(api.get(uid(1)).method,[3]);assert.equal(api.get(uid(2)),null);assert.equal(api.hasTerm(uid(2),'method',3,f.dict.dictionaryVersion),false);assert.deepEqual(api.find({method:[3]},{dictionaryVersion:f.dict.dictionaryVersion}).map(x=>x.questionUid),[uid(1)]);
 const published=fs.readFileSync(path.join(f.root,r.compact.path),'utf8')+fs.readFileSync(path.join(f.root,r.receipt.path),'utf8');for(const literal of ['Synthetic private role explanation.','using method','Find x',f.privateDir])assert.equal(published.includes(literal),false);
 assert.deepEqual(fs.readFileSync(path.join(f.root,'archive/exams/'+source)),sourceBefore);assert.deepEqual(fs.readFileSync(path.join(f.root,'archive/data/question_identity_map.json')),identityBefore);
 assert.equal(f.submit({expectedCompactSha256:r.compact.sha256,write:true}).replay,true);
 assert.throws(()=>f.submit({write:true}),/COMPACT_CAS_MISMATCH/);
});
for(const fault of ['duplicate','missing','superset','wrong-uid','wrong-number','denominator','extra-item'])test('explicit partial partition refuses '+fault,t=>{
 const f=privatePartialFixture(t),d=f.submission();if(fault==='duplicate')d.unsubmitted[0]={...d.selected[0]};if(fault==='missing')d.unsubmitted=[];if(fault==='superset')d.unsubmitted.push({questionUid:uid(3),sourceOrdinal:3,sourceQuestionNo:'3'});if(fault==='wrong-uid')d.selected[0].questionUid=uid(9);if(fault==='wrong-number')d.selected[0].sourceQuestionNo='2';if(fault==='denominator')d.expectedQuestionCount=3;if(fault==='extra-item')d.items.push({...d.items[0],questionUid:uid(2),sourceOrdinal:2});
 assert.ok(validator.validateData(d,{root:f.root}).fail.some(x=>x.startsWith('PARTIAL_4SLOT:')));
});
for(const fault of ['reviewer','self-review','quote-hash','vector','review-scope','missing-review','private-inside-repo','source-drift','dictionary-drift'])test('private intake refuses '+fault+' before writing a compact',t=>{
 const f=privatePartialFixture(t),options={write:true};
 if(fault==='reviewer')options.reviewer='other-reviewer';if(fault==='self-review'){f.review.author=f.review.reviewer;f.candidate.author=f.review.reviewer;f.input.author.identity=f.review.reviewer;f.savePrivate();}if(fault==='quote-hash'){f.review.quoteChecks[0].quoteSha256='0'.repeat(64);f.savePrivate();}if(fault==='vector'){f.candidate.canonicalTermIdVector.method=[2];f.savePrivate();}if(fault==='review-scope'){f.review.approvalBoundaries.fourSlotVectorReviewAccepted=false;f.savePrivate();}if(fault==='missing-review')fs.rmSync(f.input.independentReview.path);if(fault==='private-inside-repo'){const p=path.join(f.root,'private.json');fs.copyFileSync(f.inputPath,p);options.inputPath=p;}if(fault==='source-drift'){f.bank[0].content+=' changed';f.sync();}if(fault==='dictionary-drift'){f.dict.terms[2].ko='changed';f.save(f.dictPath,f.dict);}
 assert.throws(()=>f.submit(options));assert.equal(fs.existsSync(path.join(f.root,rel)),false);
});
test('an explicit matching CAS cannot replace a different existing compact or immutable receipt',t=>{
 const f=privatePartialFixture(t),r=f.submit({write:true}),p=path.join(f.root,rel),other=JSON.stringify({...r.output,reviewedBy:{...r.output.reviewedBy,agent:'another-reviewer'}});fs.writeFileSync(p,other);
 assert.throws(()=>f.submit({write:true,expectedCompactSha256:mod.sha(other)}),/EXISTING_COMPACT_CONFLICT/);assert.equal(fs.readFileSync(p,'utf8'),other);
 fs.rmSync(p);fs.appendFileSync(path.join(f.root,r.receipt.path),' ');assert.throws(()=>f.submit({write:true}),/EXISTING_RECEIPT_CONFLICT/);
});
for(const fault of ['receipt-sha','quote-span','vector','reviewer','unsubmitted','raw-prose','source-drift','dictionary-drift'])test('runtime rechecks public partial evidence and rejects '+fault+' even with a cached index',t=>{
 const f=privatePartialFixture(t),r=f.submit({write:true});mod.run(f.root,{write:true});const d=r.output,receipt=r.publicReceipt;
 if(fault==='receipt-sha')fs.appendFileSync(path.join(f.root,r.receipt.path),' ');
 else if(fault==='source-drift'){f.bank[0].content+=' changed';f.sync();}
 else if(fault==='dictionary-drift'){f.dict.terms[2].ko='changed';f.save(f.dictPath,f.dict);}
 else {if(fault==='quote-span')receipt.items[0].quoteBindings[0].offsetCodepoints++;if(fault==='vector')d.items[0].method=[2];if(fault==='reviewer')receipt.acceptance.reviewer='another-reviewer';if(fault==='unsubmitted')d.unsubmitted[0].questionUid=uid(9);if(fault==='raw-prose')receipt.privateQuote='not allowed';const raw=JSON.stringify(receipt)+'\n';f.save(r.receipt.path,raw);d.evidence.receipt.sha256=mod.sha(raw);f.save(rel,importer.serialize(d));}
 const x=mod.build(f.root).index;assert.equal(x.counts.registered,0);assert.match(x.pending[0].reason,/PARTIAL_4SLOT:/);assert.equal(consumer.createIndex(x).get(uid(1)),null);
});
test('the written index is in the one row-per-line text form and the check accepts only that form',t=>{const f=fixture(t),p=path.join(f.root,mod.OUTPUT),{item4SlotIndexText}=require('../tools/4slot/item-4slot-index-format.cjs');mod.run(f.root,{write:true});const text=fs.readFileSync(p,'utf8');assert.equal(text,item4SlotIndexText(JSON.parse(text)));assert(text.split('\n').length>4);fs.writeFileSync(p,JSON.stringify(JSON.parse(text))+'\n');assert.throws(()=>mod.run(f.root,{check:true}),/FOUR_SLOT_RUNTIME_DRIFT/);});
