'use strict';
// Adapter wiring only: verifier stubs do not create visual/native authority.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const{execFileSync}=require('node:child_process');
const m1=require('../tools/4slot/m1s2-problem-renderer-continuity.cjs'),m3=require('../tools/4slot/m3s2-layout-continuity.cjs');
const builder=require('../tools/4slot/build-4slot-runtime.cjs'),consumer=require('../archive/item-4slot.js');
const m3subject={questionUid:m3.UID,sourceArchiveFile:m3.SOURCE,sourceOrdinal:m3.ORDINAL};
const uid=n=>'qid_v1_'+n.toString(16).padStart(64,'0');
function fixture(t,subjects,kind){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'m1-m3-wire-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const source=subjects[0].sourceArchiveFile,sf='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json'),size=24;
 const save=(p,v)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,typeof v==='string'?v:JSON.stringify(v)+'\n');};
 const bank=Array.from({length:size},(_,i)=>({id:i+1,content:'SYNTHETIC',answer:'SYNTHETIC',solution:'SYNTHETIC'}));
 for(const s of subjects)bank[s.sourceOrdinal-1].image='assets/images/old.png';
 const js=()=> 'window.questionBank='+JSON.stringify(bank)+';\n';save(sf,js());save('archive/assets/images/old.png','ORIGINAL_SYNTHETIC');save('archive/assets/images/new.svg','<svg/>');
 const dict={dictionaryVersion:'synthetic-v1',terms:[{id:1,ko:'SYNTHETIC GIVEN',status:'ACTIVE'},{id:2,ko:'SYNTHETIC GOAL',status:'ACTIVE'},{id:3,ko:'SYNTHETIC METHOD',status:'ACTIVE'}]};save('docs/architecture/4slot/term-dictionary-v1.5.json',dict);
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:builder.blob(js()),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'fixture',commit:'a'.repeat(40),path:'synthetic.json'},reviewedBy:{agent:'synthetic',at:'2026-11-16',sampled:subjects.map(s=>s.sourceOrdinal)},items:bank.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};save(cp,data);
 const identity={records:bank.map((q,i)=>({questionUid:subjects.find(s=>s.sourceOrdinal===i+1)?.questionUid||uid(200+i),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:builder.identityHash(q),status:'VERIFIED'}))};save('archive/data/question_identity_map.json',identity);save('archive/data/question_metadata.json',{records:[]});
 execFileSync('git',['init','-q',root]);execFileSync('git',['-C',root,'add','.']);execFileSync('git',['-C',root,'-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','synthetic']);
 for(const s of subjects){if(kind==='m1')bank[s.sourceOrdinal-1].image='assets/images/new.svg';else bank[s.sourceOrdinal-1].content='<div>SYNTHETIC</div>';}
 save(sf,js());
 const active={m1:[],m3:[]},counts={m1:0,m3:0};
 const add=(s,k)=>{const p=(k==='m1'?m1.DIR:m3.DIR)+'/'+s.questionUid+'.json';save(p,s);const h=builder.sha(fs.readFileSync(path.join(root,p)));return{...s,path:p,sha256:h,digests:[[p,h]]};};
 active[kind]=subjects.map(s=>add(s,kind));
 for(const[k,route]of[['m1',m1],['m3',m3]]){const c=route.collect,v=route.verify;t.after(()=>{route.collect=c;route.verify=v;});route.collect=()=>active[k].length?new Map([[source,active[k]]]):new Map();route.verify=(_,e)=>{counts[k]++;return{ref:{path:e.path,sha256:e.sha256},observed:[]};};}
 return{root,source,sf,cp,save,data,bank,active,counts,add,size,subjects};
}
test('M3 adapter emits only its own fixed tuple and leaves other vectors intact',t=>{const f=fixture(t,[m3subject],'m3'),x=builder.build(f.root).index;assert.equal(x.records.length,24);assert.equal(f.counts.m3,1);assert.equal(f.counts.m1,0);assert.equal(consumer.createIndex(x).get(m3.UID).sourceBinding,m3.BINDING);assert(x.records.filter(r=>r.questionUid!==m3.UID).every(r=>r.sourceBinding==='UNCHANGED_STUDENT_PAYLOAD'));});
test('M3 layout cannot waive a changed asset even after adapter success',t=>{const f=fixture(t,[m3subject],'m3'),first=builder.build(f.root).index;f.save('archive/assets/images/old.png','DIFFERENT_SYNTHETIC');const x=builder.build(f.root,{previous:first}).index;assert(!x.records.some(r=>r.questionUid===m3.UID));assert.match(x.pending.find(p=>p.ordinal===16)?.reason||'',/STALE_ASSET_BYTES/);});
for(const kind of ['m1','m3'])test(kind+' selected row refuses the other typed authority',t=>{const s=kind==='m1'?m1.SUBJECTS[0]:m3subject,f=fixture(t,[s],kind);f.active[kind==='m1'?'m3':'m1']=[f.add(s,kind==='m1'?'m3':'m1')];const x=builder.build(f.root).index;assert(!x.records.some(r=>r.questionUid===s.questionUid));assert.equal(f.counts.m1+f.counts.m3,0);assert.match(x.pending.find(p=>p.ordinal===s.sourceOrdinal)?.reason||'',/MISSING_OR_MIXED/);});
for(const kind of ['m1','m3'])test(kind+' prior claim survives malformed compact then missing sidecar',t=>{const s=kind==='m1'?m1.SUBJECTS[0]:m3subject,f=fixture(t,[s],kind),first=builder.build(f.root).index;f.save(f.cp,'{');const failed=builder.build(f.root,{previous:first}).index;assert.equal(failed.records.length,0);f.active[kind]=[];f.save(f.cp,f.data);const final=builder.build(f.root,{previous:failed}).index;assert(!final.records.some(r=>r.questionUid===s.questionUid));assert.match(final.pending.find(p=>p.ordinal===s.sourceOrdinal)?.reason||'',/MISSING_OR_MIXED/);});
test('removing one M1 sibling claim is not forgotten when another remains',t=>{const pair=m1.SUBJECTS.filter(s=>['P10','P11'].includes(s.observationId)),f=fixture(t,pair,'m1'),first=builder.build(f.root).index;f.active.m1=[f.active.m1[1]];const second=builder.build(f.root,{previous:first}).index,third=builder.build(f.root,{previous:second}).index;for(const x of[second,third]){assert(!x.records.some(r=>r.questionUid===pair[0].questionUid));assert(x.records.some(r=>r.questionUid===pair[1].questionUid));assert.equal(x.files[0].m1ProblemContinuityClaims.length,2);assert.match(x.pending.find(p=>p.ordinal===pair[0].sourceOrdinal)?.reason||'',/MISSING_OR_MIXED/);}});
test('M3 consumer refuses a mixed M1 reference and preserves review false',t=>{const f=fixture(t,[m3subject],'m3'),x=builder.build(f.root).index,r=x.records.find(r=>r.questionUid===m3.UID);assert.equal(r.independentReviewClaim,false);r.m1ProblemContinuityRef={path:m1.DIR+'/'+m3.UID+'.json',sha256:'a'.repeat(64)};assert.throws(()=>consumer.createIndex(x),/M1S2_PROBLEM_CONTINUITY_REF_UNEXPECTED/);});

for(const kind of ['m1','m3'])test(kind+' positive claim retains byte-identical write/check replay',t=>{const s=kind==='m1'?m1.SUBJECTS[0]:m3subject,f=fixture(t,[s],kind);assert.equal(builder.run(f.root,{write:true}).changed,true);assert.equal(builder.run(f.root,{check:true}).changed,false);assert.equal(builder.run(f.root,{write:true}).changed,false);});
