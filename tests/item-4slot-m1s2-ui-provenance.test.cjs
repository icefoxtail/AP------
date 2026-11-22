'use strict';
// Synthetic Git trees and generated data exercise provenance, not visual QA.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const{execFileSync}=require('node:child_process');
const route=require('../tools/4slot/m1s2-problem-renderer-continuity.cjs');
const ui=require('../tools/4slot/m1s2-problem-renderer-ui.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));
function gitFixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'m1-ui-provenance-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const save=(p,b)=>{const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,b);};
 const run=(...a)=>execFileSync('git',['-C',root,...a],{stdio:['ignore','pipe','pipe']}).toString().trim();
 const commit=()=>{run('add','.');run('-c','user.name=Synthetic','-c','user.email=fixture@example.invalid','commit','-qm','synthetic');return run('rev-parse','HEAD');};
 save('archive/data/question_metadata.json','{"records":[]}');save('archive/data/question_identity_map.json','{"records":[]}');
 const sub=route.SUBJECTS[0];save(route.DIR+'/'+sub.questionUid+'.json',JSON.stringify(sub));save('runtime.js','original runtime');
 run('init','-q');const before=commit();save('runtime.js','current runtime');save('capture-only.js','current-only implementation');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jk3kAAAAASUVORK5CYII=','base64');save('proof/original.png',png);save('proof/not-png.png','SYNTHETIC NON-PNG');const current=commit();
 const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);
 const reader=route.collect(root,{safe:(r,p)=>path.join(r,p),walk,sha:route.sha}).get(sub.sourceArchiveFile)[0].reader;
 const ref=(p,c=current)=>{const b=execFileSync('git',['-C',root,'show',c+':'+p]);return{commit:c,path:p,gitBlobSha1:route.blob(b),sha256:route.sha(b),bytes:b.length};};
 const ancestor=(a,b)=>run('merge-base','--is-ancestor',a,b);
 return{root,save,run,before,current,reader,ref,ancestor,png};
}
test('immutable capture commit and current identical bytes both authenticate',t=>{const f=gitFixture(t);assert.equal(ui.capturedRef(f.reader,f.ref('capture-only.js'),f.current,true).toString(),'current-only implementation');});
test('a capture path added only after the claimed checkout is refused',t=>{const f=gitFixture(t),r={...f.ref('capture-only.js'),commit:f.before};assert.throws(()=>ui.capturedRef(f.reader,r,f.before,true),/GIT_PATH_BINDING/);});
test('an absent capture commit is refused even when current bytes match',t=>{const f=gitFixture(t),c='f'.repeat(40);assert.throws(()=>ui.capturedRef(f.reader,{...f.ref('capture-only.js'),commit:c},c,true),/GIT_INPUT_UNAVAILABLE/);});
test('a different declared capture checkout is refused',t=>{const f=gitFixture(t);assert.throws(()=>ui.capturedRef(f.reader,f.ref('capture-only.js'),f.before,true),/CAPTURE_COMMIT/);});
test('historical runtime bytes never replace current runtime equality',t=>{const f=gitFixture(t),r=f.ref('runtime.js',f.before);assert.equal(ui.capturedRef(f.reader,r,f.before).toString(),'original runtime');assert.throws(()=>ui.capturedRef(f.reader,r,f.before,true),/GIT_PATH_BINDING/);});
test('raw screenshot is read from its exact Git path and live regular file',t=>{const f=gitFixture(t),r=f.ref('proof/original.png');ui.capturedArtifacts(f.reader,[r],[{path:'original.png',sha256:r.sha256,bytes:r.bytes}],f.ancestor);});
for(const[name,mutate]of[
 ['missing original PNG',f=>fs.unlinkSync(path.join(f.root,'proof/original.png'))],
 ['replaced original PNG',f=>f.save('proof/original.png',Buffer.from('changed'))],
 ['symlink instead of original PNG',f=>{fs.unlinkSync(path.join(f.root,'proof/original.png'));fs.symlinkSync('not-png.png',path.join(f.root,'proof/original.png'));}]
])test('screenshot refuses '+name,t=>{const f=gitFixture(t),r=f.ref('proof/original.png');mutate(f);assert.throws(()=>ui.capturedArtifacts(f.reader,[r],[{path:'original.png',sha256:r.sha256,bytes:r.bytes}],f.ancestor));});
test('declared PNG inventory cannot stand in for the actual bytes',t=>{const f=gitFixture(t),r=f.ref('proof/not-png.png');assert.throws(()=>ui.capturedArtifacts(f.reader,[r],[{path:'not-png.png',sha256:r.sha256,bytes:r.bytes}],f.ancestor),/PNG_BYTES/);});
for(const name of ['missing ref','duplicate ref','wrong digest','wrong filename'])test('screenshot rejects '+name,t=>{const f=gitFixture(t),r=f.ref('proof/original.png'),a={path:'original.png',sha256:r.sha256,bytes:r.bytes};let refs=[r];if(name==='missing ref')refs=[];if(name==='duplicate ref')refs=[r,r];if(name==='wrong digest')a.sha256='0'.repeat(64);if(name==='wrong filename')a.path='other.png';assert.throws(()=>ui.capturedArtifacts(f.reader,refs,[a],f.ancestor),/PNG_REF/);});
const s=route.SUBJECTS[0],row={questionUid:s.questionUid,sourceArchiveFile:s.sourceArchiveFile,sourceOrdinal:s.sourceOrdinal,metadataRevision:'preserved'};
test('unrelated generated MD and ID rows may change without changing selected authority',()=>{for(const kind of ['METADATA','IDENTITY'])ui.selectedDataRows({records:[row,{questionUid:'outside',revision:1}]},{records:[{questionUid:'outside',revision:2},clone(row)]},[s],kind);});
for(const kind of ['METADATA','IDENTITY'])for(const[name,mutate]of[['missing',r=>r.splice(0,1)],['duplicate',r=>r.push(clone(r[0]))],['changed selected row',r=>{r[0].metadataRevision='changed';}],['changed selected source',r=>{r[0].sourceArchiveFile='other';}],['changed selected ordinal',r=>{r[0].sourceOrdinal++;}]])test(kind+' rejects '+name,()=>{const current=[clone(row)];mutate(current);assert.throws(()=>ui.selectedDataRows({records:[row]},{records:current},[s],kind),/M1S2_PROBLEM_UI_/);});
function svg(records){return Buffer.from("(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze("+JSON.stringify({schemaVersion:'SVG_STUDENT_ACCESSIBILITY_V1',records})+");\n}(typeof window !== 'undefined' ? window : globalThis));\n");}
const record={assetRef:'assets/selected.svg',visualRole:'problem',titleKo:'SYNTHETIC',answerHintFree:true},assets=new Set(['archive/assets/selected.svg']);
test('unrelated SVG records may advance while the whole selected record remains exact',()=>ui.svgContinuity(svg([record]),svg([record,{...record,assetRef:'assets/outside.svg',titleKo:'OTHER'}]),assets));
for(const[name,mutate]of[['missing selected record',r=>r.splice(0,1)],['changed selected record',r=>{r[0].titleKo='changed';}],['changed selected role',r=>{r[0].visualRole='solution';}],['duplicate selected record',r=>r.push(clone(r[0]))],['duplicate outside record',r=>r.push({...r[0],assetRef:'assets/outside.svg'},{...r[0],assetRef:'assets/outside.svg'})]])test('SVG continuity rejects '+name,()=>{const rows=[clone(record)];mutate(rows);assert.throws(()=>ui.svgContinuity(svg([record]),svg(rows),assets),/SVG_INDEX/);});
test('SVG index accepts only JSON in its fixed wrapper and executes no input',()=>{assert.throws(()=>ui.svgRecords(Buffer.from('globalThis.__bad=true;'+svg([record])),assets),/SVG_INDEX_WRAPPER/);assert.throws(()=>ui.svgRecords(svg([record]).subarray(0,60),assets),/SVG_INDEX_WRAPPER/);assert.equal(globalThis.__bad,undefined);});
test('SVG alias paths cannot hide a duplicate resolved asset',()=>assert.throws(()=>ui.svgRecords(svg([record,{...record,assetRef:'assets/x/../selected.svg'}]),assets),/SVG_INDEX_PATH/));

const currentRef=({commit,...ref})=>ref;
test('visual review immutable technical publication authenticates while sidecar remains current-only',t=>{const f=gitFixture(t),r=f.ref('capture-only.js');ui.visualTechnicalRef(f.reader,r,currentRef(r),f.ancestor);});
test('visual review current-only technical reference remains byte-authenticated',t=>{const f=gitFixture(t),r=currentRef(f.ref('capture-only.js'));ui.visualTechnicalRef(f.reader,r,r,f.ancestor);});
test('visual technical pin cannot claim a Git tree without the captured file',t=>{const f=gitFixture(t),r=f.ref('capture-only.js');assert.throws(()=>ui.visualTechnicalRef(f.reader,{...r,commit:f.before},currentRef(r),f.ancestor),/GIT_PATH_BINDING/);});
test('visual technical pin cannot claim an unavailable publication commit',t=>{const f=gitFixture(t),r=f.ref('capture-only.js');assert.throws(()=>ui.visualTechnicalRef(f.reader,{...r,commit:'e'.repeat(40)},currentRef(r),f.ancestor));});
test('visual technical reference cannot disagree with sidecar path or digest',t=>{const f=gitFixture(t),r=f.ref('capture-only.js');for(const mismatch of [{...currentRef(r),path:'runtime.js'},{...currentRef(r),sha256:'0'.repeat(64)}])assert.throws(()=>ui.visualTechnicalRef(f.reader,r,mismatch,f.ancestor),/VISUAL_TECHNICAL_REF/);});
test('visual technical historical pin does not waive a changed live file',t=>{const f=gitFixture(t),r=f.ref('capture-only.js');f.save('capture-only.js','changed after review');assert.throws(()=>ui.visualTechnicalRef(f.reader,r,currentRef(r),f.ancestor),/LIVE_BYTES_CHANGED/);});

const SVG_INDEX='archive/data/svg-accessibility-index.js';
function generatedSvgFixture(t){
 const f=gitFixture(t);f.save(SVG_INDEX,svg([record]));f.run('add',SVG_INDEX);
 f.run('-c','user.name=Synthetic','-c','user.email=fixture@example.invalid','commit','-qm','synthetic captured SVG data');
 const capture=f.run('rev-parse','HEAD'),captured=f.ref(SVG_INDEX,capture);
 const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);
 const reader=route.collect(f.root,{safe:(r,p)=>path.join(r,p),walk,sha:route.sha}).get(route.SUBJECTS[0].sourceArchiveFile)[0].reader;
 const stage=rows=>{const bytes=svg(rows);f.save(SVG_INDEX,bytes);f.run('add',SVG_INDEX);return bytes;};
 const check=()=>ui.svgContinuity(ui.capturedRef(reader,captured,capture),ui.currentData(reader,SVG_INDEX),assets);
 return{...f,reader,capture,captured,stage,check};
}
test('generated SVG accepts staged outside-row updates before the writer commits',t=>{
 const f=generatedSvgFixture(t),bytes=f.stage([record,{...record,assetRef:'assets/outside.svg',titleKo:'OTHER'}]);
 assert.equal(f.run('rev-parse','HEAD'),f.capture);assert.notEqual(route.blob(bytes),f.captured.gitBlobSha1);
 const liveRef={path:SVG_INDEX,gitBlobSha1:route.blob(bytes),sha256:route.sha(bytes),bytes:bytes.length};
 assert.throws(()=>f.reader.read(liveRef,true),/GIT_PATH_BINDING/);
 f.check();assert.equal(f.reader.observed.get(SVG_INDEX),route.sha(bytes));assert.equal(f.run('rev-parse','HEAD'),f.capture);
});
for(const[name,rows]of[
 ['selected record changed',[{...record,titleKo:'CHANGED'}]],
 ['selected record missing',[]],
 ['selected record duplicated',[record,clone(record)]],
 ['outside record duplicated',[record,{...record,assetRef:'assets/outside.svg'},{...record,assetRef:'assets/outside.svg'}]]
])test('generated SVG rejects '+name+' before commit',t=>{const f=generatedSvgFixture(t);f.stage(rows);assert.throws(f.check,/SVG_INDEX/);});
test('generated SVG never treats another current Git input as generated data',t=>{
 let reads=0;assert.throws(()=>ui.currentData({local:()=>{reads++;return Buffer.from('ignored');}},'runtime.js'),/GENERATED_DATA_PATH/);assert.equal(reads,0);
});
test('generated SVG retains regular-file and no-symlink protection',t=>{
 const f=generatedSvgFixture(t),target=path.join(f.root,SVG_INDEX);f.save('other-svg.js',svg([record]));fs.unlinkSync(target);fs.symlinkSync(path.join(f.root,'other-svg.js'),target);
 assert.throws(f.check,/SYMLINK/);fs.unlinkSync(target);fs.mkdirSync(target);assert.throws(f.check,/NOT_REGULAR/);
});
test('generated SVG still rejects a forged captured Git pin',t=>{
 const f=generatedSvgFixture(t),bytes=f.stage([record,{...record,assetRef:'assets/outside.svg'}]);
 const forged={...f.captured,gitBlobSha1:route.blob(bytes),sha256:route.sha(bytes),bytes:bytes.length};
 assert.throws(()=>ui.capturedRef(f.reader,forged,f.capture),/GIT_PATH_BINDING/);
});
test('generated SVG current data still requires the exact non-executable wrapper',t=>{
 const f=generatedSvgFixture(t);f.save(SVG_INDEX,Buffer.concat([Buffer.from('globalThis.__m1GeneratedBad=true;'),svg([record])]));f.run('add',SVG_INDEX);
 assert.throws(f.check,/SVG_INDEX_WRAPPER/);assert.equal(globalThis.__m1GeneratedBad,undefined);
});
