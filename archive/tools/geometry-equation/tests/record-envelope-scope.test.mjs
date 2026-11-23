// 2026-11-23: an Archive evidence row that names a target is judged on the TARGET question, not on the whole exam page.
// The verdict rules are tested on fabricated page states; one real Chrome run checks the page fields (local only).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {phoneFailureReasons,splitPhoneErrors,bankResponseMatches} from '../production/construction-archive-capture-v1.mjs';
import {recordArchiveEvidence,judgeArchivePage,judgeArchiveTarget} from '../record-visual-browser-evidence.mjs';
import {loadBank,bankAliasSuffix} from '../build-visual-render-matrix.mjs';
import {sha256} from '../verify-visual-engine-static.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const SOURCE='archive/exams/original/high/h2/1final/20_제일고_1학기_기말_고2_확률과통계.js';
const EXAM=path.posix.basename(SOURCE,'.js');
// a block 3000 px wide: the question box scrolls (the page clips it, the page itself does not overflow)
const WIDE='<div style="width:3000px;height:8px;background:#ccc"></div>';
const rel=file=>path.relative(root,file).split(path.sep).join("/");
const runId='envscope-'+crypto.randomUUID().slice(0,8);
const runRoot=path.join(root,'.tmp/archive',runId);
test.after(()=>fs.rmSync(runRoot,{recursive:true,force:true}));

// A copy of the exam in which question `wideId` carries a wide block, and (when asset) question 1 shows a solution figure.
function build(name,{wideId,asset=false,source=SOURCE}){
  const EXAM=path.posix.basename(source,'.js');
  const raw=fs.readFileSync(path.join(root,source),'utf8'),bank=loadBank(raw);
  const patch=[];
  if(wideId!==undefined)patch.push(`Object.assign(window.questionBank.find(q=>q.id===${wideId}),{content:window.questionBank.find(q=>q.id===${wideId}).content+${JSON.stringify(WIDE)}});`);
  const run=path.join(runRoot,EXAM,name);fs.mkdirSync(run,{recursive:true});
  let assetInfo;
  if(asset){
    const archivePath=`assets/images/${EXAM}/q01-solution.svg`,file=path.join(run,archivePath);fs.mkdirSync(path.dirname(file),{recursive:true});
    fs.writeFileSync(file,'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="320" viewBox="0 0 384 320"><rect width="384" height="320" fill="#fff"/><circle cx="192" cy="160" r="100" fill="none" stroke="#000"/></svg>');
    patch.push(`Object.assign(window.questionBank.find(q=>q.id===1),{solutionImage:${JSON.stringify(archivePath)},solutionImageSize:'large',solutionImageAlt:'figure'});`);
    assetInfo={id:'target-figure',path:rel(file),archivePath,sha256:sha256(fs.readFileSync(file)),questionId:1};
  }
  const text=raw+bankAliasSuffix(raw)+'\n;'+patch.join('\n')+'\n';
  const candidate=path.join(run,EXAM+'.js');fs.writeFileSync(candidate,text);
  const info={id:name,sourcePath:source,sourceSha256:sha256(fs.readFileSync(path.join(root,source))),candidatePath:rel(candidate),candidateSha256:sha256(Buffer.from(text,'utf8')),questionCount:bank.length,assets:assetInfo?[assetInfo]:[]};
  const row={...info,mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(source.replace(/^archive\//,''))};
  return {run,info,row};
}
async function record(name,options,rowPatch){
  const b=build(name,options);
  const row={...b.row,...rowPatch};
  fs.writeFileSync(path.join(b.run,'archive-render-matrix.json'),JSON.stringify({synthetic:false,measurementOnly:true,engineSha256:sha256(fs.readFileSync(path.join(root,'archive/engine.html'))),sources:[b.info],rows:[row]},null,2));
  const summary=await recordArchiveEvidence({run:b.run,attempt:'attempt-01',blockExternalRequests:true});
  const file=path.join(b.run,'archive-render/attempt-01',`${name}-sol-desktop.json`);
  return {summary,row:JSON.parse(fs.readFileSync(file,'utf8'))};
}

const okState=(extra={})=>({questionBlocks:4,pageCount:1,mathJaxReady:true,errorText:'',horizontalOverflow:false,allImagesLoaded:true,failedImages:[],targets:[],...extra});
const figureItem={questionCount:4,assets:[{id:'a'}],envelopeTargets:[]},probeItem={questionCount:4,assets:[],envelopeTargets:[{id:'p'}]},pageItem={questionCount:4,assets:[],envelopeTargets:[]};

test('judgeArchivePage: a row with a target is not failed by what is wrong elsewhere on the exam page; it is noted',()=>{
  for(const item of [figureItem,probeItem]){
    const state=okState({horizontalOverflow:true,allImagesLoaded:false,questionBlocks:3,failedImages:[{src:'x/y/other.png',inTargetBox:false}]});
    const verdict=judgeArchivePage(state,item);
    assert.deepEqual(verdict.errors,[]);
    assert.deepEqual(verdict.pageNotes.map(note=>note.code).sort(),['ARCHIVE_HORIZONTAL_OVERFLOW','ARCHIVE_IMAGE_LOAD_FAIL','ARCHIVE_QCOUNT_FAIL']);
    assert.ok(verdict.pageNotes.every(note=>note.scope==='EXAM'));
  }
});

test('judgeArchivePage: a row with no target keeps judging the whole page',()=>{
  const verdict=judgeArchivePage(okState({horizontalOverflow:true,allImagesLoaded:false,questionBlocks:3}),pageItem);
  assert.deepEqual(verdict.errors,['ARCHIVE_QCOUNT_FAIL','ARCHIVE_HORIZONTAL_OVERFLOW','ARCHIVE_IMAGE_LOAD_FAIL']);assert.deepEqual(verdict.pageNotes,[]);
});

test('judgeArchivePage: a page that did not render at all, and the target box overflowing, still fail',()=>{
  assert.deepEqual(judgeArchivePage(okState({pageCount:0}),figureItem).errors,['ARCHIVE_RENDER_NOT_READY']);
  const over=judgeArchivePage(okState({targets:[{id:'a',boxOverflow:{scrollOverflowPx:40,imageOutsidePx:0}}]}),figureItem);
  assert.deepEqual(over.errors,['TARGET_HORIZONTAL_OVERFLOW:a']);
  const out=judgeArchivePage(okState({targets:[{id:'a',boxOverflow:{scrollOverflowPx:0,imageOutsidePx:12}}]}),figureItem);
  assert.deepEqual(out.errors,['TARGET_HORIZONTAL_OVERFLOW:a']);
  const fine=judgeArchivePage(okState({targets:[{id:'a',boxOverflow:{scrollOverflowPx:1,imageOutsidePx:2}}]}),figureItem);
  assert.deepEqual(fine.errors,[]);
});

test('judgeArchivePage: a picture of the target question that did not load is a TARGET_BOX note, not a failure of the figure',()=>{
  const verdict=judgeArchivePage(okState({allImagesLoaded:false,failedImages:[{src:'q/own.png',inTargetBox:true}]}),figureItem);
  assert.deepEqual(verdict.errors,[]);
  assert.deepEqual(verdict.pageNotes.filter(note=>note.scope==='TARGET_BOX').map(note=>note.images),[['q/own.png']]);
});

test('real Chrome: the page reports the target box overflow numbers and a figure on a normal page has none (the page clips a wide block, so the box check is the net behind the page own overflow gate)',async()=>{
  const {row}=await record('fig-normal',{wideId:2,asset:true},{});
  const target=row.state.targets[0];
  assert.equal(target.loaded,true);
  assert.ok(Number.isFinite(target.boxOverflow.scrollOverflowPx)&&Number.isFinite(target.boxOverflow.imageOutsidePx));
  assert.ok(target.boxOverflow.imageOutsidePx<=2);
  assert.equal(row.errors.some(code=>String(code).startsWith('TARGET_HORIZONTAL_OVERFLOW')),false,JSON.stringify(row.errors));
  assert.ok(Array.isArray(row.state.failedImages)&&Array.isArray(row.state.targetBoxOverflows));
});

test('judgeArchiveTarget: each target of one exam is judged on its own',()=>{
  const state=okState({allImagesLoaded:false,failedImages:[{src:'q/a.png',inTargetBox:true,targetIds:['a']}],targets:[{id:'a',boxOverflow:{scrollOverflowPx:0,imageOutsidePx:0}},{id:'b',boxOverflow:{scrollOverflowPx:30,imageOutsidePx:0}}]});
  const item={questionCount:4,assets:[{id:'a'},{id:'b'}],envelopeTargets:[]};
  assert.deepEqual(judgeArchiveTarget(state,item,'a').errors,[]);
  assert.deepEqual(judgeArchiveTarget(state,item,'a').pageNotes.map(note=>[note.targetId,note.images]),[['a',['q/a.png']]]);
  assert.deepEqual(judgeArchiveTarget(state,item,'b').errors,['TARGET_HORIZONTAL_OVERFLOW:b']);
  assert.deepEqual(judgeArchiveTarget(state,item,'b').pageNotes,[]);
  assert.deepEqual(judgeArchivePage(state,item).errors,['TARGET_HORIZONTAL_OVERFLOW:b']);
});

test('phoneFailureReasons: each phone error becomes one short reason, blocking ones first, the first goes behind ARCHIVE_PHONE_DISPLAY_FAIL:',()=>{
  const id='va-1';
  assert.deepEqual(phoneFailureReasons([`${id}:LABEL_OVERLAP:A:B`,`${id}:TEXT_CLIPPED:A`,'TARGET_OUTSIDE_SCREEN:'+id],id),['TARGET_OUTSIDE_SCREEN','TEXT_CLIPPED','LABEL_OVERLAP']);
  assert.deepEqual(phoneFailureReasons(['TARGET_SVG_LOAD_FAIL:'+id],id),['IMAGE_LOAD_FAIL']);
  assert.deepEqual(phoneFailureReasons(['TARGET_HORIZONTAL_OVERFLOW:'+id,`${id}:LABEL_GEOMETRY_COLLISION:A:g`,`${id}:LABEL_GEOMETRY_COLLISION:B:g`],id),['TARGET_HORIZONTAL_OVERFLOW','LABEL_GEOMETRY_COLLISION']);
  assert.deepEqual(phoneFailureReasons(['page.waitForFunction: Error: timeout'],id),['PAGE_ERROR']);
});

const BOM_SOURCE='archive/exams/original/high/h2/2mid/22_효천고_2학기_중간_고2_확률과통계.js';
const hex=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
test('bankResponseMatches: one leading UTF-8 BOM is ignored, every other byte difference still refuses',()=>{
  const body=Buffer.from('window.questionBank=[{id:1}];','utf8'),bom=Buffer.from([0xef,0xbb,0xbf]);
  const withBom=Buffer.concat([bom,body]),sha=bytes=>'sha256:'+hex(bytes);
  assert.equal(bankResponseMatches(sha(body),body),true);                                         // plain file
  assert.equal(bankResponseMatches(sha(withBom),withBom),true);                                   // the received bytes keep the BOM
  assert.equal(bankResponseMatches(sha(body),withBom),true);                                      // the received bytes lost exactly one BOM
  assert.equal(bankResponseMatches(sha(Buffer.concat([body,Buffer.from(' ')])),withBom),false);   // another byte differs
  assert.equal(bankResponseMatches(sha(Buffer.from('window.questionBank=[{id:2}];')),withBom),false);
  assert.equal(bankResponseMatches(sha(body),Buffer.concat([bom,bom,body])),false);               // a second BOM is not forgiven
  assert.equal(bankResponseMatches(sha(withBom),body),false);                                     // a BOM the file does not have is not invented
  assert.equal(bankResponseMatches(null,withBom),false);assert.equal(bankResponseMatches('not-a-hash',body),false);
});

test('real Chrome: the exam JS of a file that starts with a BOM reaches the page without the BOM (what bankResponseMatches forgives)',async()=>{
  const bytes=fs.readFileSync(path.join(root,BOM_SOURCE));
  assert.deepEqual([...bytes.subarray(0,3)],[0xef,0xbb,0xbf],'the fixture exam really starts with a BOM');
  const {row}=await record('bom-bank',{source:BOM_SOURCE},{envelopeTargets:[{id:'probe',questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:['full']}]});
  const text=fs.readFileSync(path.join(runRoot,path.posix.basename(BOM_SOURCE,'.js'),'bom-bank',path.posix.basename(BOM_SOURCE)));
  const wanted=BOM_SOURCE.slice("archive/".length),received=row.responses.filter(response=>decodeURIComponent(new URL(response.url).pathname).endsWith(wanted));
  assert.equal(received.length,1);
  assert.equal(bankResponseMatches('sha256:'+received[0].sha256,text),true,'the received bank matches the written one up to the BOM');
});

test('splitPhoneErrors: on the phone a cut-off or a failed measurement blocks, geometry spacing observers are only noted (they were judged on the desktop)',()=>{
  const id='va-1';
  const {blocking,notes}=splitPhoneErrors([`${id}:TICK_LABEL_OWNER_LEADER_END_MISMATCH:t`,`${id}:TICK_LABEL_ALONG_AXIS_MISALIGNMENT:t`,`${id}:LABEL_OVERLAP:A:B`,`${id}:LEADER_NEAR_GEOMETRY:l:g`,`${id}:TEXT_CLIPPED:A`,`${id}:GEOMETRY_VIEWPORT_CLIPPING:g`,`${id}:MISSING_GLYPH`.replace(id+':',''),'TARGET_SVG_LOAD_FAIL:'+id,'TARGET_OUTSIDE_SCREEN:'+id,'ACTUAL_LOADED_ASSET_SHA_MISMATCH:'+id,'Error: page crashed'],id);
  assert.deepEqual(notes.map(text=>text.split(':')[1]),['TICK_LABEL_OWNER_LEADER_END_MISMATCH','TICK_LABEL_ALONG_AXIS_MISALIGNMENT','LABEL_OVERLAP','LEADER_NEAR_GEOMETRY']);
  assert.deepEqual(blocking,[`${id}:TEXT_CLIPPED:A`,`${id}:GEOMETRY_VIEWPORT_CLIPPING:g`,'MISSING_GLYPH','TARGET_SVG_LOAD_FAIL:'+id,'TARGET_OUTSIDE_SCREEN:'+id,'ACTUAL_LOADED_ASSET_SHA_MISMATCH:'+id,'Error: page crashed']);
});
