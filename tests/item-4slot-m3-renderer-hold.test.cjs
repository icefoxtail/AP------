'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const mod=require('../tools/4slot/build-4slot-runtime.cjs');
const consumer=require('../archive/item-4slot.js');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const uid=n=>'qid_v1_'+String(n).padStart(64,'0');
function fixture(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'m3-renderer-hold-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v));};
 const git=(...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const commit=message=>{git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm',message);return git('rev-parse','HEAD').trim();};
 const source='original/middle/m3/2mid/renderer-fixture.js',rel='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json'),asset='archive/assets/images/renderer-fixture/q1-solution.svg';
 const bank=[{id:1,content:'Question one',choices:[],answer:'one',solution:'An unchanged solution',solutionImage:asset.slice(8)},{id:2,content:'Question two',choices:[],answer:'two',solution:'An unchanged neighbor'}];
 const js=()=>'window.questionBank='+JSON.stringify(bank)+';';
 const dict={dictionaryVersion:'term-dict-v1.5-2026-11-04',terms:[{id:1,ko:'given'},{id:2,ko:'goal'},{id:3,ko:'method'}]};
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:mod.blob(js()),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'review/fixture',commit:'a'.repeat(40),path:'review.json'},reviewedBy:{agent:'fixture-reviewer',at:'2026-11-15',sampled:[1]},items:bank.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};
 const identity={records:bank.map((q,i)=>({questionUid:uid(i+1),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:mod.identityHash(q)}))};
 const supPath='docs/operations/fixture/renderer-supersession.json',proofPath='docs/operations/fixture/renderer-hold.json';
 const sup={schemaVersion:'archive-m3s2-four-slot-renderer-supersession-v1',status:'ONE_UID_WITHHELD_PENDING_EXACT_SOURCE_CORRECTION',questionUid:uid(1),sourceOrdinal:1,sourceArchiveFile:source,operationalHold:{heldUidCount:1,omittedOrdinals:[1]},revokedEvidence:{commit:'a'.repeat(40),path:'old-review.json',sha256:'b'.repeat(64),reviewStatus:'PASS_SCOPED_RENDERER_CONTINUITY'}};
 save('archive/exams/'+source,js());save(asset,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L2 2"/></svg>');save(supPath,sup);
 git('init','-q');const sourceCommit=commit('immutable source and negative supersession');
 const supersessionEvidence={commit:sourceCommit,path:supPath,sha256:mod.sha(fs.readFileSync(path.join(root,supPath)))};
 const proof={schemaVersion:'m3-s2-renderer-correction-registration-hold-v1',reason:'SOURCE_RENDERER_CORRECTION_PENDING',decision:'WITHHOLD_REGISTRATION',heldUidCount:1,replacesInterimMissingRow:true,newSemanticApprovals:0,newDifficultyApprovals:0,sourceWrites:0,reviewer:data.reviewedBy.agent,nextAction:'Publish the independently reviewed correction, then rebind only this item.',questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,sourceArchiveFile:source,fingerprintContract:'4slot-student-payload-v1',studentPayloadSha256:mod.payloadHash(bank[0]),sourceFingerprint:mod.identityHash(bank[0]),originalCompactRowSha256:mod.sha(stable(data.items[0])),sourceRef:{commit:sourceCommit,path:'archive/exams/'+source,gitBlobSha1:data.sourceGitBlobSha,sha256:mod.sha(js())},supersessionEvidence,revokedEvidence:sup.revokedEvidence,incorrectRenderer:{role:'solutionImage',path:asset,sha256:mod.sha(fs.readFileSync(path.join(root,asset)))}};
 save(proofPath,proof);const proofCommit=commit('immutable current-item hold');
 const ref={commit:proofCommit,path:proofPath,sha256:mod.sha(fs.readFileSync(path.join(root,proofPath)))};
 data.evidence.nativeHoldReview={rendererCorrection:ref,supersession:supersessionEvidence};
 data.items[0].registrationHold={schemaVersion:'4slot-native-review-hold-v1',reason:proof.reason,questionUid:uid(1),sourceOrdinal:1,sourceQuestionNo:'1',ordinal:1,studentPayloadSha256:proof.studentPayloadSha256,sourceFingerprint:proof.sourceFingerprint,sourceGitBlobSha:data.sourceGitBlobSha,evidence:ref,supersessionEvidence,nextAction:proof.nextAction};
 const write=()=>{save(rel,data);save('docs/architecture/4slot/term-dictionary-v1.5.json',dict);save('archive/data/question_identity_map.json',identity);};write();
 function resign(){save(proofPath,proof);const ref={commit:commit('changed proof fixture'),path:proofPath,sha256:mod.sha(fs.readFileSync(path.join(root,proofPath)))};data.items[0].registrationHold.evidence=ref;data.evidence.nativeHoldReview.rendererCorrection=ref;write();}
 return {root,save,git,commit,source,rel,asset,bank,js,data,proof,proofPath,sup,supPath,identity,write,resign};
}
function heldOnly(f){const built=mod.build(f.root);assert.equal(built.index.counts.items,2);assert.equal(built.index.records.length,1);assert.equal(built.index.records[0].questionUid,uid(2));assert.equal(consumer.createIndex(built.index).get(uid(1)),null);return built.index;}
test('M3 renderer hold keeps all valid slot rows and excludes exactly one UID',t=>{const f=fixture(t),before=JSON.stringify(f.data.items[0]),index=heldOnly(f);assert.equal(index.pending[0].reason,'EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING');assert.equal(index.pending[0].questionUid,uid(1));assert.equal(mod.verify(index).verified,1);assert.equal(JSON.stringify(f.data.items[0]),before);});
for(const fault of ['uid','ordinal','number','empty-next-action','wrong-commit','proof-bytes','supersession-bytes','missing-proof','wrong-scope','empty-method','slot-substitution','asset-bytes','unrelated-source-field'])test('M3 renderer hold fails closed for '+fault,t=>{
 const f=fixture(t),h=f.data.items[0].registrationHold;
 if(fault==='uid')h.questionUid=uid(2);
 if(fault==='ordinal')h.sourceOrdinal=2;
 if(fault==='number')h.sourceQuestionNo='2';
 if(fault==='empty-next-action')h.nextAction='';
 if(fault==='wrong-commit'){h.evidence={...h.evidence,commit:'f'.repeat(40)};f.data.evidence.nativeHoldReview.rendererCorrection=h.evidence;}
 if(fault==='proof-bytes')f.save(f.proofPath,{...f.proof,changed:true});
 if(fault==='supersession-bytes')f.save(f.supPath,{...f.sup,changed:true});
 if(fault==='missing-proof')fs.unlinkSync(path.join(f.root,f.proofPath));
 if(fault==='wrong-scope'){f.data.sourceArchiveFile=f.source.replace('m3/2mid','m2/2mid');const rel='archive/data/item-4slot/'+f.data.sourceArchiveFile.replace(/\.js$/,'.4slot.json');f.save('archive/exams/'+f.data.sourceArchiveFile,f.js());f.identity.records.forEach(r=>{r.sourceArchiveFile=f.data.sourceArchiveFile;});f.save(rel,f.data);fs.unlinkSync(path.join(f.root,f.rel));f.save('archive/data/question_identity_map.json',f.identity);const index=mod.build(f.root).index;assert.equal(index.records.length,1);assert.match(index.pending[0].reason,/UNSUPPORTED_HOLD_SCOPE/);return;}
 if(fault==='empty-method')f.data.items[0].method=[];
 if(fault==='slot-substitution')f.data.items[0].method=[2];
 if(fault==='asset-bytes')f.save(f.asset,'<svg>corrected but not yet rebound</svg>');
 if(fault==='unrelated-source-field'){f.bank[1].tagStatus='new';f.save('archive/exams/'+f.source,f.js());}
 f.write();const index=heldOnly(f);assert.ok(index.pending[0].reason.includes('INVALID_REGISTRATION_HOLD')||index.pending[0].reason.includes('REQUIRED_SLOT_EMPTY'));
});
for(const fault of ['new-approval','wrong-decision','payload','proof-uid','source-ref','renderer-role','different-supersession'])test('an immutable but invalid M3 proof cannot grant registration: '+fault,t=>{
 const f=fixture(t);
 if(fault==='new-approval')f.proof.newSemanticApprovals=1;
 if(fault==='wrong-decision')f.proof.decision='REGISTER';
 if(fault==='payload')f.proof.studentPayloadSha256='0'.repeat(64);
 if(fault==='proof-uid')f.proof.questionUid=uid(2);
 if(fault==='source-ref')f.proof.sourceRef.path=f.proof.sourceRef.path.replace('renderer-fixture','other');
 if(fault==='renderer-role')f.proof.incorrectRenderer.role='problemImage';
 if(fault==='different-supersession')f.proof.revokedEvidence={...f.proof.revokedEvidence,sha256:'0'.repeat(64)};
 f.resign();assert.match(heldOnly(f).pending[0].reason,/INVALID_REGISTRATION_HOLD/);
});
test('changed held solution is stale before any explicit hold is considered',t=>{const f=fixture(t);f.bank[0].solution='Changed';f.save('archive/exams/'+f.source,f.js());assert.equal(heldOnly(f).pending[0].reason,'STALE_STUDENT_PAYLOAD');});
test('cached hold observes changes in its second immutable evidence file',t=>{const f=fixture(t);mod.run(f.root,{write:true});f.save(f.supPath,{...f.sup,changed:true});const index=heldOnly(f);assert.match(index.pending[0].reason,/HOLD_EVIDENCE_SHA_MISMATCH:supersession/);});
