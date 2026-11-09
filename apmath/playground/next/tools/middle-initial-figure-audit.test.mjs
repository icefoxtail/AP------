import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {discoverMiddleCatalog,discoverHashEntries,initialIssues,VIEWPORTS} from './middle-initial-figure-audit.mjs';

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
});
test('native slider clamping cannot disagree with the initial model',()=>{
  const sliders=[{key:'side',step:'1',value:'6',stateValue:8}];
  assert.ok(initialIssues({...visible,sliders},'leaf',[],{status:'NOT_APPLICABLE'}).includes('slider-model-mismatch:side'));
  assert.deepEqual(initialIssues({...visible,sliders:[{key:'side',step:'.1',value:'1.4',stateValue:Math.SQRT2}]},'leaf',[],{status:'NOT_APPLICABLE'}),[]);
});
