// 2026-11-23: an Archive evidence row that names a target is judged on the TARGET question, not on the whole exam page.
// The verdict rules are tested on fabricated page states; one real Chrome run checks the page fields (local only).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {recordArchiveEvidence,judgeArchivePage} from '../record-visual-browser-evidence.mjs';
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
function build(name,{wideId,asset=false}){
  const raw=fs.readFileSync(path.join(root,SOURCE),'utf8'),bank=loadBank(raw);
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
  const info={id:name,sourcePath:SOURCE,sourceSha256:sha256(fs.readFileSync(path.join(root,SOURCE))),candidatePath:rel(candidate),candidateSha256:sha256(Buffer.from(text,'utf8')),questionCount:bank.length,assets:assetInfo?[assetInfo]:[]};
  const row={...info,mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(SOURCE.replace(/^archive\//,''))};
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
