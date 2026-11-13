// Controlled unit-only data. These tests never launch a browser, render a
// student figure, publish a source or manufacture a capture/quality receipt.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {bytesSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {loadPublishedProblemCapture,publishedCaptureMatrix,publishedCompanionPath,verifyPublishedTarget,verifyPublishedCaptureRows,capturePublishedProblemManifest} from '../production/published-problem-capture.mjs';
const prefix='archive/tools/geometry-equation/ops/problem-figures/unit-published/';
function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'published-capture-unit-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const write=(name,value)=>{const absolute=path.join(root,name);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,typeof value==='string'||Buffer.isBuffer(value)?value:JSON.stringify(value));return fileRef(root,name);};
 const sourcePath='archive/exams/original/middle/m1/2mid/unit-published.js',bank=Array.from({length:23},(_,index)=>({id:index+1,content:'Unit-only given data',answer:'protected-unit-data',solution:'protected-unit-data',...(index<19?{image:`assets/images/unit-published/q${String(index+1).padStart(2,'0')}-problem.svg`,imageSize:'full',imageAlt:'unit-caption-'+(index+1)}:{})}));
 const saveSource=()=>write(sourcePath,'window.questionBank='+JSON.stringify(bank)+';');let sourceRef=saveSource();
 const manifest={schemaVersion:'PROBLEM_FIGURE_MANIFEST_v1',items:[]},items=[];
 for(let ordinal=1;ordinal<=19;ordinal++){
  const imageRef=write('archive/'+bank[ordinal-1].image,'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480"><text id="A">A</text></svg>');
  const planRef=write(prefix+`q${ordinal}/plan.json`,{capability:'construction-spike-v1',caption:bank[ordinal-1].imageAlt,mathPlan:{}});
  manifest.items.push({item:{sourcePath,ordinal,dir:'q'+ordinal,surface:'PROBLEM_VISUAL'},planPath:`q${ordinal}/plan.json`,sourceSha256:sourceRef.sha256,planSha256:planRef.sha256,sourceImageSha256:imageRef.sha256});items.push({ordinal,svgRef:imageRef});
 }
 const manifestPath=prefix+'manifest.json',companionPath=prefix+'published.json';
 const companion={schemaVersion:'PUBLISHED_PROBLEM_CAPTURE_v1',manifestRef:write(manifestPath,manifest),sourceRef,items};
 const save=()=>write(companionPath,companion);save();
 const syncSource=()=>{sourceRef=saveSource();companion.sourceRef=sourceRef;for(const entry of manifest.items)entry.sourceSha256=sourceRef.sha256;companion.manifestRef=write(manifestPath,manifest);save();};
 return {root,write,sourcePath,bank,sourceRef,manifest,manifestPath,companionPath,companion,save,syncSource,load:()=>loadPublishedProblemCapture(manifestPath,{root})};
}
test('closed source/manifest refs bind the exact selected 19 question set and canonical static image links without modifying inputs',t=>{
 const f=fixture(t),sourceBefore=fs.readFileSync(path.join(f.root,f.sourcePath)),loaded=f.load();assert.equal(loaded.status,'PUBLISHED_INPUTS_BOUND');assert.equal(loaded.items.length,19);assert.equal(loaded.questionCount,23);assert.equal(loaded.productionAuthorized,false);assert.equal(loaded.qualityReview,'NOT_RUN');assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),sourceBefore);assert.equal(fs.existsSync(path.join(f.root,'.tmp')),false);
 assert.equal(publishedCompanionPath(f.manifestPath),f.companionPath);
});
test('absent companion is explicit NOT_REQUESTED, while dangling/ordinary symlink companions are rejected',t=>{
 const f=fixture(t),absolute=path.join(f.root,f.companionPath);fs.unlinkSync(absolute);assert.equal(f.load().status,'NOT_REQUESTED');
 fs.symlinkSync(path.join(f.root,'missing.json'),absolute);assert.throws(f.load,/PUBLISHED_PATH_REDIRECT/);fs.unlinkSync(absolute);
 const target=f.write(prefix+'same-bytes.json',f.companion);fs.symlinkSync(path.join(f.root,target.path),absolute);assert.throws(f.load,/PUBLISHED_PATH_REDIRECT/);
});
test('arbitrary fields, mode/command inputs, source refs and extra/missing/duplicate questions fail closed',t=>{
 const f=fixture(t),original=structuredClone(f.companion);
 for(const change of [c=>c.command='echo forbidden',c=>c.sourceRef.url='https://example.invalid',c=>c.items.pop(),c=>c.items.push(c.items[0]),c=>c.items[1]=structuredClone(c.items[0]),c=>c.items[0].ordinal=23,c=>c.items[0].argv=['x']]){
  Object.keys(f.companion).forEach(k=>delete f.companion[k]);Object.assign(f.companion,structuredClone(original));change(f.companion);f.save();assert.throws(f.load,/PUBLISHED_SCHEMA|PUBLISHED_REF_SCHEMA|PUBLISHED_ITEM|PUBLISHED_QUESTION_SET/);
 }
});
test('stale source/manifest/image bytes and mismatched linked fields cannot pass merely by declaring an accepted SHA',t=>{
 const f=fixture(t);f.companion.sourceRef.sha256='sha256:'+'0'.repeat(64);f.save();assert.throws(f.load,/PUBLISHED_REF_STALE/);
 f.companion.sourceRef=f.sourceRef;f.companion.manifestRef.sha256='sha256:'+'0'.repeat(64);f.save();assert.throws(f.load,/PUBLISHED_REF_STALE/);
 f.companion.manifestRef=fileRef(f.root,f.manifestPath);f.companion.items[0].svgRef.sha256='sha256:'+'0'.repeat(64);f.save();assert.throws(f.load,/PUBLISHED_REF_STALE/);
});
test('canonical image URL, size and alt must match the current static bank and selected plan',t=>{
 for(const [field,value,code] of [['image','https://example.invalid/q01-problem.svg','PROBLEM_SOURCE_IMAGE_REQUIRED'],['image','assets/images/unit-published/q02-problem.svg','PUBLISHED_CANONICAL_IMAGE_LINK'],['imageSize','medium','PUBLISHED_IMAGE_FIELDS'],['imageAlt','different-alt','PUBLISHED_IMAGE_FIELDS']]){
  const f=fixture(t);f.bank[0][field]=value;f.syncSource();assert.throws(f.load,new RegExp(code));
 }
});
test('external, traversal, alternative image paths, cross-source sets and redirected assets are rejected',t=>{
 const f=fixture(t),original=structuredClone(f.companion);
 for(const value of ['/tmp/figure.svg','../figure.svg','archive/assets/images/other/q01-problem.svg','archive\\assets\\x.svg']){f.companion.items[0].svgRef.path=value;f.save();assert.throws(f.load,/PUBLISHED_CANONICAL_IMAGE_LINK/);}
 Object.assign(f.companion,structuredClone(original));f.companion.sourceRef=f.write('archive/exams/original/other.js',fs.readFileSync(path.join(f.root,f.sourcePath)));f.save();assert.throws(f.load,/PUBLISHED_SOURCE_SET/);
 Object.assign(f.companion,structuredClone(original));f.save();const ref=f.companion.items[0].svgRef,asset=path.join(f.root,ref.path),copy=f.write(prefix+'same.svg',fs.readFileSync(asset));fs.unlinkSync(asset);fs.symlinkSync(path.join(f.root,copy.path),asset);assert.throws(f.load,/PATH_ESCAPE|REDIRECT/);
 assert.throws(()=>publishedCompanionPath('/tmp/manifest.json'),/MANIFEST_SCOPE/);assert.throws(()=>publishedCompanionPath(prefix+'../x/manifest.json'),/MANIFEST_SCOPE/);
});
test('data-only matrix repeats all 19 exact assets in three fixed problem viewports and cannot select an operational output path',t=>{
 const f=fixture(t),loaded=f.load(),runRelative='.tmp/archive/published-unit/unit-published/published-capture',matrix=publishedCaptureMatrix(loaded,{runRelative,engineSha256:'sha256:'+'a'.repeat(64)});
 assert.equal(matrix.sources.length,1);assert.equal(matrix.rows.length,3);assert.deepEqual(matrix.rows.map(r=>[r.viewport,r.width,r.height]),[['desktop',1440,1000],['mobile',390,844],['tablet',768,1024]]);
 for(const row of matrix.rows){assert.equal(row.assets.length,19);assert.equal(row.candidateSha256,loaded.sourceRef.sha256.slice(7));assert.equal(row.problemEnvelope,true);assert.equal(row.requireLocalResources,true);assert.equal(row.mode,'exam');for(const a of row.assets){assert.equal(a.surface,'PROBLEM_VISUAL');assert.ok(a.path.startsWith(runRelative+'/input-snapshots/'));}}
 assert.throws(()=>publishedCaptureMatrix(loaded,{runRelative:'archive/assets/images/output',engineSha256:'sha256:'+'a'.repeat(64)}),/MATRIX_INPUT/);
});
function unitTarget(loaded){
 const item=loaded.items[0],src='http://127.0.0.1:1234/archive/'+item.archivePath,rect={x:40,y:50,width:300,height:200},target={id:item.identity.assetId,surface:'PROBLEM_VISUAL',problemWrapper:true,loaded:true,sizeClass:'full',naturalWidth:720,naturalHeight:480,rect,wrapperRect:rect,qBoxRect:{x:30,y:30,width:320,height:300},src,sourceRef:item.expectedSourceRef};
 const layout={id:item.identity.assetId,status:'PASS',svgSha256:item.svgRef.sha256.slice(7),measurementMode:'ISOLATED_SVG_REPLAY_AT_ACTUAL_ARCHIVE_IMAGE_SIZE',renderedContainer:rect,labelMeasurements:[{id:'A',kind:'POINT_NAME',font:'serif',baseFontPx:20,finalViewportCssFontPx:12,client:{x:60,y:60,width:10,height:12}}],errors:[],missingGlyphCount:0,labelCollisionCount:0,criticalCollisionCount:0,clippedTextCount:0,overflowCount:0};
 return {fixtureClassification:'UNIT_ONLY_NOT_BROWSER_EVIDENCE',network:{localOrigin:'http://127.0.0.1:1234'},state:{targets:[target]},layouts:[layout],responses:[{url:src,status:200,sha256:item.svgRef.sha256.slice(7),bytes:item.svgRef.bytes}]};
}
test('target readback rejects fabricated PASS with a wrong response, natural size, source slot, missing glyphs, subfloor fonts or overflow',t=>{
 const f=fixture(t),loaded=f.load(),item=loaded.items[0],svg=fs.readFileSync(path.join(f.root,item.svgRef.path));const clean=unitTarget(loaded);assert.equal(verifyPublishedTarget(clean,item,svg).minimumCssFontPx,12);
 for(const change of [r=>r.responses[0].sha256='0'.repeat(64),r=>r.responses[0].bytes++,r=>r.responses[0].status=404,r=>r.responses.push({...r.responses[0]}),r=>r.state.targets[0].naturalWidth=100,r=>r.state.targets[0].sourceRef='wrong-question',r=>r.state.targets[0].rect={x:0,y:0,width:999,height:999},r=>r.layouts[0].labelMeasurements=[],r=>r.layouts[0].labelMeasurements[0].finalViewportCssFontPx=10.99,r=>r.layouts[0].overflowCount=1,r=>r.layouts.push({...r.layouts[0]})]){const row=structuredClone(clean);change(row);assert.throws(()=>verifyPublishedTarget(row,item,svg),/PUBLISHED_|INVENTORY_MISMATCH/);}
});
test('full readback refuses a changed matrix before accepting caller row claims',t=>{
 const f=fixture(t),loaded=f.load(),engine=f.write('archive/engine.html','<!doctype html><title>UNIT ONLY</title>'),runRelative='.tmp/archive/published-unit/unit-published/published-capture',matrix=publishedCaptureMatrix(loaded,{runRelative,engineSha256:engine.sha256});matrix.rows[0].width=1;
 assert.throws(()=>verifyPublishedCaptureRows(loaded,matrix,{root:f.root,runRelative}),/MATRIX_BINDING/);
});
test('capture refuses path-bearing run ids before loading any source or opening a browser',async()=>{
 await assert.rejects(capturePublishedProblemManifest(prefix+'manifest.json',{runId:'../../archive/assets'}),/PUBLISHED_RUN_ID_INVALID/);
});

test('examData-only canonical JS is accepted as exact source bytes; final matrix never appends a questionBank alias',t=>{
 const f=fixture(t),source=f.write(f.sourcePath,'window.examData='+JSON.stringify({title:'Unit-only bank',questions:f.bank})+';');f.companion.sourceRef=source;for(const entry of f.manifest.items)entry.sourceSha256=source.sha256;f.companion.manifestRef=f.write(f.manifestPath,f.manifest);f.save();
 const loaded=f.load(),matrix=publishedCaptureMatrix(loaded,{runRelative:'.tmp/archive/published-unit/unit-published/published-capture',engineSha256:'sha256:'+'a'.repeat(64)});assert.equal(loaded.questionCount,23);assert.equal(matrix.sources[0].sourceSha256,source.sha256.slice(7));assert.equal(matrix.sources[0].candidateSha256,matrix.sources[0].sourceSha256);assert.doesNotMatch(fs.readFileSync(path.join(f.root,f.sourcePath),'utf8'),/questionBank/);
});
test('full readback rejects status-only row claims with external network, wrong viewport, missing target or unbound reader',t=>{
 const f=fixture(t),loaded=f.load(),engine=f.write('archive/engine.html','<!doctype html><title>UNIT ONLY</title>'),runRelative='.tmp/archive/published-unit/unit-published/published-capture',matrix=publishedCaptureMatrix(loaded,{runRelative,engineSha256:engine.sha256});
 for(const ref of [loaded.sourceRef,...loaded.items.map(item=>item.svgRef)])f.write(runRelative+'/input-snapshots/'+ref.path,fs.readFileSync(path.join(f.root,ref.path)));
 const rowPath=runRelative+'/archive-render/final-linked/published-exam-exam-desktop.json';
 const row={fixtureClassification:'UNIT_ONLY_NOT_BROWSER_EVIDENCE',status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'unit-only',mode:'exam',viewport:'desktop',sourceSha256:loaded.sourceRef.sha256.slice(7),candidateSha256:loaded.sourceRef.sha256.slice(7),engineSha256:engine.sha256.slice(7),errors:[],network:{policy:'LOCAL_ONLY',localOrigin:'http://127.0.0.1:1234',externalRequests:[]},url:'http://127.0.0.1:1234/archive/engine.html',state:{questionBlocks:23,solutionVisualCount:0,horizontalOverflow:false,allImagesLoaded:true,viewportGeometry:{innerWidth:1440,innerHeight:1000,screenWidth:1440,documentScrollWidth:1440,bodyScrollWidth:1440,documentClientWidth:1440,bodyClientWidth:1440},targets:Array.from({length:19},()=>({}))},layouts:Array.from({length:19},()=>({}))};
 for(const change of [r=>r.network.policy='DEFAULT',r=>r.network.externalRequests.push({url:'https://example.invalid'}),r=>r.state.viewportGeometry.innerWidth=390,r=>delete r.state.viewportGeometry.bodyScrollWidth,r=>r.state.targets.pop()]){const altered=structuredClone(row);change(altered);f.write(rowPath,altered);assert.throws(()=>verifyPublishedCaptureRows(loaded,matrix,{root:f.root,runRelative}),/PUBLISHED_ACTUAL_ROW_REQUIRED|PUBLISHED_TARGET_INVENTORY/);}
 f.write(rowPath,row);assert.throws(()=>verifyPublishedCaptureRows(loaded,matrix,{root:f.root,runRelative}),/PROBLEM_READER_ENVELOPE_EVIDENCE_INVALID/);
});
