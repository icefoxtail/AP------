import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {discoverMiddleCatalog,discoverHashEntries,initialIssues,toolbarOcclusions,labelsOutsideCanvas,compareInitialGeometry,VIEWPORTS} from './middle-initial-figure-audit.mjs';
import {isProgressControl,needsInitialInteractionCheck,missingInteractionRisks} from './middle-initial-interactions.mjs';

test('initial inventory includes newly registered middle labs without a fixed scene list',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'middle-initial-catalog-'));
  try{
    const kit=path.join(root,'apmath/playground/next/kit'),labs=path.join(root,'apmath/playground/next/labs');
    fs.mkdirSync(kit,{recursive:true});fs.mkdirSync(labs,{recursive:true});
    const items=[{id:'g7-new',course:'g7',next:'next/labs/g7-new.html'},{id:'g8-new',course:'g8',next:'next/labs/g8-new.html'},{id:'g9-new',course:'g9',next:'next/labs/g9-new.html'},{id:'high',course:'h1'}];
    for(const item of items.slice(0,3))fs.writeFileSync(path.join(labs,item.id+'.html'),'<!doctype html>');
    fs.writeFileSync(path.join(kit,'apl-catalog.js'),'window.APLab={catalog:'+JSON.stringify({labs:items})+'};');
    assert.deepEqual(discoverMiddleCatalog(root).map(x=>x.id),['g7-new','g8-new','g9-new']);
    fs.unlinkSync(path.join(labs,'g8-new.html'));
    assert.throws(()=>discoverMiddleCatalog(root),/Missing registered lab/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('five prescribed viewports include the small mobile first screen',()=>{
  assert.deepEqual(VIEWPORTS.map(v=>[v.width,v.height]),[[1440,900],[820,1180],[1024,768],[390,844],[360,800]]);
});
test('hash-only registrations and aliases are discovered without a fixed ID list',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'middle-initial-hash-'));
  try{
    const labs=path.join(root,'apmath/playground/next/labs');fs.mkdirSync(labs,{recursive:true});
    fs.writeFileSync(path.join(labs,'g7-new.html'),`if ((oldHash.get('s') || '').split('@')[0] === 'old') {\n    oldHash.set('s', 'new@3');\n  }\n  const extra = (oldHash.get('s') || '').split('@')[0] === 'direct-only';`);
    assert.deepEqual(discoverHashEntries(root,'g7-new'),[{id:'old',expectedId:'new'},{id:'direct-only',expectedId:'direct-only'}]);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
const visible={id:'leaf',canvas:{width:800,height:600,cssWidth:800,cssHeight:600,visibleWidth:800,visibleHeight:600,display:'block',visibility:'visible',opacity:'1'},ink:20000,overflow:false,hintOverlap:0,katexErrors:[]};
test('an outer square with plenty of pixels cannot hide a missing required figure',()=>{
  assert.deepEqual(initialIssues(visible,'leaf',[],{status:'FAIL',failures:['required-leaf-arcs-missing']}),['required-leaf-arcs-missing']);
});
test('caught renderer errors and wrong scene routing fail independently of pixels',()=>{
  const issues=initialIssues(visible,'different',[{type:'console-error',message:'draw failed'}],{status:'NOT_APPLICABLE'});
  assert.ok(issues.includes('selected-scene-mismatch'));assert.ok(issues.includes('browser-error'));
});
test('first-screen geometry outside the viewport fails even with nonblank canvas',()=>{
  assert.ok(initialIssues({...visible,canvas:{...visible.canvas,visibleHeight:0}},'leaf',[],{status:'NOT_APPLICABLE'}).includes('canvas-outside-first-viewport'));
  assert.ok(initialIssues({...visible,canvas:{...visible.canvas,rendered:false}},'leaf',[],{status:'NOT_APPLICABLE'}).includes('canvas-not-visible'));
});
test('native slider clamping cannot disagree with the initial model',()=>{
  const sliders=[{key:'side',step:'1',value:'6',stateValue:8}];
  assert.ok(initialIssues({...visible,sliders},'leaf',[],{status:'NOT_APPLICABLE'}).includes('slider-model-mismatch:side'));
  assert.deepEqual(initialIssues({...visible,sliders:[{key:'side',step:'.1',value:'1.4',stateValue:Math.SQRT2}]},'leaf',[],{status:'NOT_APPLICABLE'}),[]);
});
test('text ink cannot replace all hidden or off-canvas geometry',()=>{
  assert.ok(initialIssues({...visible,geometry:[{method:'path',alpha:0}]},'leaf',[],{status:'NOT_APPLICABLE'}).includes('no-visible-geometry-command'));
  assert.ok(initialIssues({...visible,geometry:[{method:'circle',alpha:1,bounds:{left:900,right:1000,top:10,bottom:100}}]},'leaf',[],{status:'NOT_APPLICABLE'}).includes('geometry-outside-canvas'));
  assert.deepEqual(initialIssues({...visible,geometry:[{method:'path',alpha:1,bounds:{left:100,right:300,top:10,bottom:200}}]},'leaf',[],{status:'NOT_APPLICABLE'}),[]);
});
test('a partly hidden vertex letter fails even when the full figure is visible',()=>{
  const toolbar={left:400,right:680,top:450,bottom:490};
  const hiddenE={text:'E',left:410,right:420,top:440,bottom:453};
  const clearH={text:'H',left:380,right:390,top:440,bottom:453};
  assert.deepEqual(toolbarOcclusions([hiddenE,clearH],toolbar),[hiddenE]);
  assert.ok(initialIssues({...visible,labels:[hiddenE],toolbar},'leaf',[],{status:'NOT_APPLICABLE'}).includes('toolbar-covers-figure-label'));
  assert.deepEqual(initialIssues({...visible,labels:[clearH],toolbar},'leaf',[],{status:'NOT_APPLICABLE'}),[]);
});

test('the real clipped segment caption fails despite an intact circle and nonblank canvas',()=>{
  const canvas={...visible.canvas,cssWidth:683,cssHeight:414.875};
  const clipped={text:'① 호 AB 2π cm',left:326.459479,right:441.459479,top:-7.203897,bottom:6.796103};
  assert.deepEqual(labelsOutsideCanvas([clipped],canvas),[clipped]);
  assert.ok(initialIssues({...visible,canvas,labels:[clipped]},'leaf',[],{status:'NOT_APPLICABLE'}).includes('figure-label-clipped-by-canvas'));
  assert.deepEqual(labelsOutsideCanvas([{...clipped,top:8,bottom:22}],canvas),[]);
});

test('a sidebar handle cannot obscure a given arc length inside the canvas',()=>{
  const label={text:'호 3π cm',left:274.708789,right:343.708789,top:95.853446,bottom:109.853446};
  const handle={kind:'table-of-contents-handle',left:336,right:360,top:51,bottom:134};
  assert.ok(initialIssues({...visible,labels:[label],occluders:[handle]},'leaf',[],{status:'NOT_APPLICABLE'}).includes('overlay-covers-figure-label'));
  assert.deepEqual(initialIssues({...visible,labels:[{...label,left:240,right:309}],occluders:[handle]},'leaf',[],{status:'NOT_APPLICABLE'}),[]);
});

test('real interaction coverage includes new labs and cannot silently lose a repaired scene',()=>{
  assert.equal(needsInitialInteractionCheck('g7-new',{id:'new-first',index:0}),true);
  assert.equal(needsInitialInteractionCheck('g7-circle-sector',{id:'f1-lens',index:12}),true);
  assert.equal(needsInitialInteractionCheck('g7-new',{id:'second',index:1}),false);
  assert.ok(missingInteractionRisks('g7-circle-sector',[{id:'f1-star'}]).includes('f1-lens'));
  assert.deepEqual(missingInteractionRisks('g7-new',[{id:'new-first'}]),[]);
});

test('progress probes cover rolling, folds and nets while leaving ordinary side lengths alone',()=>{
  for(const label of ['움직여 보기','애니메이션','펼치기','진행률','분리','굴러간 정도','옆면 펼친 정도','왼쪽 반을 접기','돌려서 포개기'])assert.equal(isProgressControl(label),true,label);
  for(const label of ['반지름 r','삼각형의 높이','∠ABC'])assert.equal(isProgressControl(label),false,label);
});

test('reentry cannot silently shrink or move the initial figure while its inputs remain unchanged',()=>{
  const first={geometry:[{method:'circle',alpha:1,bounds:{left:300.69,right:722.31,top:53.14,bottom:474.76}}]};
  const moved={geometry:[{method:'circle',alpha:1,bounds:{left:312.49,right:710.51,top:53.82,bottom:451.84}}]};
  assert.equal(compareInitialGeometry(first,first).pass,true);
  assert.equal(compareInitialGeometry(first,moved).pass,false);
  assert.equal(compareInitialGeometry(first,moved).reason,'initial-geometry-framing-changed');
  assert.equal(compareInitialGeometry(first,{geometry:[]}).pass,false);
});
