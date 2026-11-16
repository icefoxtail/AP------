'use strict';
// Synthetic transport tests only. Actual figure/UI acceptance is separate,
// immutable evidence; these tests do not generate or replace that authority.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const{execFileSync}=require('node:child_process');
const route=require('../tools/4slot/m1s2-problem-renderer-continuity.cjs');
const ui=require('../tools/4slot/m1s2-problem-renderer-ui.cjs');
const builder=require('../tools/4slot/build-4slot-runtime.cjs');
const consumer=require('../archive/item-4slot.js');
const subject=route.SUBJECTS[0],uid=n=>'qid_v1_'+n.toString(16).padStart(64,'0');
const clone=x=>JSON.parse(JSON.stringify(x));
const failPattern=/M1S2_PROBLEM_CONTINUITY_NON_PROBLEM_IMAGE_CHANGE/;

test('closed scope is seven exact M1S2 tuples and excludes solution/text cases',()=>{
 assert.equal(route.SUBJECTS.length,7);assert.equal(new Set(route.SUBJECTS.map(r=>r.questionUid)).size,7);
 assert.deepEqual(route.SUBJECTS.map(r=>r.observationId),['P04','P08','P10','P11','P12','P13','P14']);
 assert(route.SUBJECTS.every(r=>/^original\/middle\/m1\/2(?:mid|final)\//.test(r.sourceArchiveFile)));
});
test('image pointer and presentation may change while the entire other object remains exact',()=>{
 const before={id:13,content:'SYNTHETIC CONTENT',answer:'SYNTHETIC ANSWER',solution:'SYNTHETIC SOLUTION',image:'assets/old.png',imageAlt:'old',imageSize:60};
 const after={...before,image:'assets/current.svg',imageAlt:'current',imageSize:80};
 assert.deepEqual(route.problemOnlyChange(before,after),['image','imageAlt','imageSize']);
});
for(const key of ['content','question','choices','answer','solution','solutionImage','id','number','questionType','questionUid','tags','difficulty','approval','imageCaption','layoutTag']){
 test('whole-question constraint rejects '+key,()=>{const before={id:13,image:'assets/old.png'},after={...before,image:'assets/current.svg',[key]:'changed'};assert.throws(()=>route.problemOnlyChange(before,after),failPattern);});
}
test('presentation alone is not an image-continuity claim',()=>assert.throws(()=>route.problemOnlyChange({image:'assets/old.png'},{image:'assets/old.png',imageSize:80}),failPattern));
for(const image of ['https://example.invalid/a.png','data:image/png;base64,AAAA','<svg/>'])test('asset closure rejects remote or inline image '+image.split(':')[0],()=>assert.throws(()=>route.sourceRefs({image}),/REMOTE_OR_INLINE_ASSET/));

function coverage(){
 const png={tileIndex:1,path:'synthetic-desktop.png',sha256:'a'.repeat(64),bytes:12};
 const c={schemaVersion:'archive-problem-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,overlapCssPixels:32,tileCount:1,
 content:{x:20,y:30,width:300,height:200},question:{x:20,y:30,width:300,height:200},viewport:{width:1365,height:1000},visibleChildren:3,
 coverage:{requiredInterval:[0,200],coveredInterval:[0,200],complete:true},tiles:[{tileIndex:1,relativeInterval:[0,200],filename:png.path,clip:{x:20,y:30,width:300,height:200},scroll:{x:0,y:0},scrollOperations:0,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:3,foreignContentHits:0,domSha256:'b'.repeat(64)}],
 scrollBefore:{x:0,y:0},scrollAfter:{x:0,y:0},scrollOperations:0,domSha256:'b'.repeat(64),feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};
 return{c,s:[png],viewport:{width:1365,height:1000}};
}
test('standard original-tile coverage is accepted without changing viewport',()=>{const f=coverage();ui.coverage(f.c,f.s,f.viewport);});
for(const[name,change]of[
 ['two-child bypass',c=>{c.visibleChildren=2;}],['CSS mutation',c=>{c.cssWrites=1;}],['DOM mutation',c=>{c.domWrites=1;}],
 ['viewport change',c=>{c.viewportChanges=1;}],['composite image',c=>{c.compositeImageCreated=true;}],['partial coverage',c=>{c.coverage.coveredInterval[1]=150;}],
 ['foreign content',c=>{c.tiles[0].foreignContentHits=1;}],['obstruction',c=>{c.tiles[0].obstructionsIntersectingClip=1;}],
 ['wrong screenshot',c=>{c.tiles[0].filename='other.png';}],['DOM drift',c=>{c.tiles[0].domSha256='c'.repeat(64);}]
])test('capture refuses '+name,()=>{const f=coverage();change(f.c);assert.throws(()=>ui.coverage(f.c,f.s,f.viewport),/M1S2_PROBLEM_UI_/);});
test('technical failure cannot be accepted as visual evidence',()=>assert.throws(()=>ui.verify({reader:{json:()=>({status:'FAIL'})},doc:{}}),/M1S2_PROBLEM_UI_TECHNICAL/));

function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'m1s2-problem-wire-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const source=subject.sourceArchiveFile,sf='archive/exams/'+source,cp='archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json');
 const save=(p,v)=>{const target=path.join(root,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof v==='string'?v:JSON.stringify(v)+'\n');};
 const bank=Array.from({length:14},(_,i)=>({id:i+1,content:'SYNTHETIC',answer:'SYNTHETIC',solution:'SYNTHETIC'}));bank[12].image='assets/images/old.png';
 const js=()=> 'window.questionBank='+JSON.stringify(bank)+';\n';save(sf,js());save('archive/assets/images/old.png','SYNTHETIC_PNG');save('archive/assets/images/new.svg','<svg xmlns="http://www.w3.org/2000/svg"/>');
 const dict={dictionaryVersion:'synthetic-v1',terms:[{id:1,ko:'SYNTHETIC GIVEN',status:'ACTIVE'},{id:2,ko:'SYNTHETIC GOAL',status:'ACTIVE'},{id:3,ko:'SYNTHETIC METHOD',status:'ACTIVE'}]};save('docs/architecture/4slot/term-dictionary-v1.5.json',dict);
 const data={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:source,sourceGitBlobSha:builder.blob(js()),dictionaryVersion:dict.dictionaryVersion,evidence:{branch:'fixture',commit:'a'.repeat(40),path:'synthetic.json'},reviewedBy:{agent:'synthetic',at:'2026-11-16',sampled:[13]},items:bank.map(q=>({ordinal:q.id,format:'단일 정답',given:[1],goal:[2],method:[3],condition:[],candidates:[]}))};save(cp,data);
 const identity={records:bank.map((q,i)=>({questionUid:i===12?subject.questionUid:uid(i+100),sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:String(q.id),sourceFingerprint:builder.identityHash(q),status:'VERIFIED'}))};save('archive/data/question_identity_map.json',identity);save('archive/data/question_metadata.json',{records:[]});
 execFileSync('git',['init','-q',root]);execFileSync('git',['-C',root,'add','.']);execFileSync('git',['-C',root,'-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-qm','synthetic original']);
 bank[12].image='assets/images/new.svg';save(sf,js());
 const sidecar=route.DIR+'/'+subject.questionUid+'.json';save(sidecar,subject);
 return{root,source,sf,cp,save,bank,identity,data,sidecar};
}
function wire(t){const f=fixture(t),original=route.verify;let calls=0;route.verify=(root,entry)=>{calls++;return{ref:{path:entry.path,sha256:entry.sha256},observed:[]};};t.after(()=>{route.verify=original;});return{...f,calls:()=>calls};}
test('builder uses the explicit adapter only for the selected row and consumer preserves vectors',t=>{
 const f=wire(t),x=builder.build(f.root).index,row=x.records.find(r=>r.questionUid===subject.questionUid);
 assert.equal(x.records.length,14);assert.equal(f.calls(),1);assert.equal(row.sourceBinding,route.BINDING);assert.equal(row.independentReviewClaim,false);assert.deepEqual(row.method,[3]);
 assert.equal(consumer.createIndex(x).get(subject.questionUid).m1ProblemContinuityRef.path,f.sidecar);
 assert(x.records.filter(r=>r.questionUid!==subject.questionUid).every(r=>r.sourceBinding==='UNCHANGED_STUDENT_PAYLOAD'));
});
test('a removed claim does not reuse the positive cache or revive on repeated builds',t=>{
 const f=wire(t),first=builder.build(f.root).index;fs.unlinkSync(path.join(f.root,f.sidecar));
 const second=builder.build(f.root,{previous:first}).index,third=builder.build(f.root,{previous:second}).index;
 for(const x of [second,third]){assert(!x.records.some(r=>r.questionUid===subject.questionUid));assert.match(x.pending.find(p=>p.ordinal===13)?.reason||'',/CLAIM_MISSING_OR_MIXED/);assert.equal(x.records.length,13);}
});
test('current typed validation runs even when source/cache bytes repeat',t=>{const f=wire(t),first=builder.build(f.root).index;route.verify=()=>{throw Error('SYNTHETIC_LIVE_EVIDENCE_DRIFT');};const x=builder.build(f.root,{previous:first}).index;assert.equal(x.records.length,13);assert.match(x.pending.find(p=>p.ordinal===13).reason,/LIVE_EVIDENCE_DRIFT/);});
test('a second continuity marker cannot share the selected row',t=>{const f=wire(t),V=require('../tools/4slot/existing-registered-vector-continuity.cjs'),old=V.collect;t.after(()=>{V.collect=old;});V.collect=()=>new Map([[f.source,[{...subject,digests:[]}]]]);const x=builder.build(f.root).index;assert.equal(f.calls(),0);assert.equal(x.records.length,13);assert.match(x.pending.find(p=>p.ordinal===13)?.reason||'',/MISSING_OR_MIXED/);});
test('canonical UID mismatch remains rejected after successful wiring',t=>{const f=wire(t);f.bank[12].questionUid=uid(99);f.save(f.sf,'window.questionBank='+JSON.stringify(f.bank)+';');const x=builder.build(f.root).index;assert.equal(x.records.length,13);assert.match(x.pending.find(p=>p.ordinal===13)?.reason||'',/SOURCE_UID_CONFLICT/);});
test('explicit item hold is not converted into an approval by adapter output',t=>{const f=wire(t);f.data.items[12].registrationHold={};f.save(f.cp,f.data);const x=builder.build(f.root).index;assert.equal(x.records.length,13);assert.match(x.pending.find(p=>p.ordinal===13)?.reason||'',/REGISTRATION_HOLD/);});
for(const[name,mutate]of[['foreign source',r=>{r.sourceArchiveFile='original/middle/m1/2final/foreign.js';}],['foreign UID',r=>{r.questionUid=uid(777);r.m1ProblemContinuityRef.path=route.DIR+'/'+r.questionUid+'.json';}],['wrong ordinal',r=>{r.sourceOrdinal++;}],['extra ref key',r=>{r.m1ProblemContinuityRef.override=true;}],['positive review claim',r=>{r.independentReviewClaim=true;}],['missing ref',r=>{delete r.m1ProblemContinuityRef;}],['unexpected ref',r=>{r.sourceBinding='EXACT_BLOB';}]]){
 test('consumer refuses '+name,t=>{const f=wire(t),x=builder.build(f.root).index,one=clone(x.records.find(r=>r.questionUid===subject.questionUid));mutate(one);assert.throws(()=>consumer.createIndex({...x,records:[one]}),/M1S2_PROBLEM_CONTINUITY/);});
}

function assetFixture(){
 const commit='a'.repeat(40),prior={image:'assets/old.png',solutionImage:'assets/unchanged-solution.svg'},current={...prior,image:'assets/current.svg'};
 const bytes=new Map([['archive/assets/old.png',Buffer.from('ORIGINAL_SYNTHETIC_PNG')],['archive/assets/current.svg',Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')],['archive/assets/unchanged-solution.svg',Buffer.from('<svg><image href="data:image/svg+xml;base64,U1lOVEhFVElD"/></svg>')]]);
 const ref=(p,c)=>({...(c?{commit:c}:{}),path:p,gitBlobSha1:route.blob(bytes.get(p)),sha256:route.sha(bytes.get(p)),bytes:bytes.get(p).length});
 const doc={priorSourceRef:{commit},priorAssets:[ref('archive/assets/old.png',commit),ref('archive/assets/unchanged-solution.svg',commit)],currentAssets:[ref('archive/assets/current.svg'),ref('archive/assets/unchanged-solution.svg')]};
 const calls=[],reader={read:(r,live=false)=>{calls.push({path:r.path,commit:r.commit||null,live});const b=bytes.get(r.path);assert(b);assert.equal(route.blob(b),r.gitBlobSha1);assert.equal(route.sha(b),r.sha256);assert.equal(b.length,r.bytes);return b;}};
 return{doc,prior,current,bytes,ref,reader,calls};
}
test('unchanged issued non-problem asset is exact authenticated opaque bytes',()=>{const f=assetFixture();route.verifyAssetContinuity(f.reader,f.doc,f.prior,f.current);assert(f.calls.some(r=>r.path.endsWith('unchanged-solution.svg')&&r.commit));assert(f.calls.some(r=>r.path.endsWith('unchanged-solution.svg')&&r.live));});
for(const [name,mutate] of [
 ['different non-problem reference',f=>{f.doc.currentAssets[1].sha256='0'.repeat(64);}],
 ['missing non-problem reference',f=>{f.doc.currentAssets.pop();}],
 ['extra non-problem reference',f=>{f.doc.currentAssets.push({...f.doc.currentAssets[1],path:'archive/assets/extra.svg'});}],
 ['changed inherited live bytes',f=>{f.bytes.set('archive/assets/unchanged-solution.svg',Buffer.from('CHANGED'));}]
])test('opaque prior-asset continuity rejects '+name,()=>{const f=assetFixture();mutate(f);assert.throws(()=>route.verifyAssetContinuity(f.reader,f.doc,f.prior,f.current));});
for(const [name,svg] of [['inline data','<svg><image href="data:image/svg+xml;base64,U1lOVEhFVElD"/></svg>'],['external reference','<svg><image href="https://example.invalid/x.png"/></svg>'],['active SVG','<svg><script>synthetic()</script></svg>']])test('new problem renderer still rejects '+name,()=>{const f=assetFixture();f.bytes.set('archive/assets/current.svg',Buffer.from(svg));f.doc.currentAssets[0]=f.ref('archive/assets/current.svg');assert.throws(()=>route.verifyAssetContinuity(f.reader,f.doc,f.prior,f.current),/EXTERNAL_NESTED_ASSET|ACTIVE_SVG/);});
