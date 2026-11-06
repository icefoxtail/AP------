'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const G=require('./archive2-output-strict-gate.cjs');
const hash='a'.repeat(64), otherHash='b'.repeat(64);
const copy=value=>JSON.parse(JSON.stringify(value));
function clean() {
  return {pass:true,outcome:{ok:true},questionCount:1,qpp:4,mode:'sol',expectedOrder:['uid1'],sourceOrder:['uid1'],inputUids:['uid1'],
    mathErrors:0,unrenderedMath:0,mathCount:1,bodyHash:hash,firstBoxMs:1,pageCount:1,blockCount:1,
    images:[{loaded:true,sourceHash:hash,width:100,height:70}],pages:[{width:794,height:1122,textHash:hash,images:[],blocks:[{sourceRef:'uid1',textHash:hash,x:1,y:2,width:100,height:50}]}],
    inputHash:hash,mathMarkupHash:hash,mathGeometry:[{width:12,height:8}],clippingCount:0,pageOverflowCount:0,continuationCount:0,pageErrors:[],
    printPreflight:{ok:true,outputParity:{bodyHash:hash,pages:1,coordinateTolerancePx:1}},publicMs:5,operationMath:{calls:1,totalMs:2},cdp:{LayoutDurationMs:1,LayoutCount:1}};
}
const spec={id:'synthetic',kind:'original',questions:1,qpp:4};
function pdf(row) {
  row.pdf={generated:true,pageCount:1,mediaBoxes:[[0,0,595,842]],raster:{renderer:'Poppler pdftoppm',dpi:96,textSha256:hash,textBytes:12,pages:[{page:1,width:794,height:1123,rgbSha256:hash}]},
    screenParity:{bodyHash:row.bodyHash,pages:1,coordinateTolerancePx:1},afterPrintState:{snapshotId:'s',mode:row.mode,snapshotMode:row.mode,committedMode:row.mode,runtimeBusy:false,fontsStatus:'loaded',renderOutcomeOk:true,activeRootMatches:true,attemptCount:1}};return row;
}
test('complete clean synthetic output passes the pure readiness and parity validators',()=>{
  const row=clean();G.validateCleanRow(row,spec);G.assertParity(row,copy(row));G.assertPdf(pdf(row),copy(row));
});
test('clipping never passes even with success and parity flags',()=>{
  for(const field of ['clippingCount','pageOverflowCount']) {const row=clean();row[field]=1;assert.throws(()=>G.validateCleanRow(row,spec),/OUTPUT_CLIPPING/);}
});
test('missing questions, changed order, or incomplete images cannot pass',()=>{
  for(const mutate of [r=>r.questionCount=0,r=>r.sourceOrder=['other'],r=>r.inputUids=[],r=>r.images[0].loaded=false]) {const row=clean();mutate(row);assert.throws(()=>G.validateCleanRow(row,spec));}
});
test('math, print, and browser readiness are independent of pass flags',()=>{
  for(const mutate of [r=>r.mathErrors=1,r=>r.unrenderedMath=1,r=>r.printPreflight.outputParity.bodyHash=otherHash,r=>r.pageErrors=['error'],r=>r.mathGeometry=[]]) {
    const row=clean();mutate(row);assert.throws(()=>G.validateCleanRow(row,spec));
  }
});
test('same forged comparison pass cannot conceal body, source, math or image changes',()=>{
  for(const mutate of [r=>r.bodyHash=otherHash,r=>r.inputHash=otherHash,r=>r.mathMarkupHash=otherHash,r=>r.images[0].sourceHash=otherHash,r=>r.inputUids=['other']]) {
    const row=clean(),changed=copy(row);mutate(changed);assert.throws(()=>G.assertParity(row,changed),/OUTPUT_PARITY_CHANGED/);
  }
});
test('one-pixel geometry tolerance is retained but larger shifts fail',()=>{
  const row=clean(),changed=copy(row);changed.pages[0].blocks[0].x+=1;G.assertParity(row,changed);
  changed.pages[0].blocks[0].x+=.1;assert.throws(()=>G.assertParity(row,changed),/BLOCK_GEOMETRY_CHANGED/);
});
test('changed continuation, page content, or math geometry fails',()=>{
  for(const mutate of [r=>r.continuationCount=1,r=>r.pages[0].textHash=otherHash,r=>r.mathGeometry[0].width+=2]) {
    const row=clean(),changed=copy(row);mutate(changed);assert.throws(()=>G.assertParity(row,changed));
  }
});
test('PDF evidence needs every page, RGB hashes, text, and stable post-print state',()=>{
  for(const mutate of [r=>r.pdf.raster.pages=[],r=>r.pdf.raster.pages[0].rgbSha256=otherHash,r=>r.pdf.raster.textSha256=otherHash,r=>r.pdf.afterPrintState.runtimeBusy=true]) {
    const row=pdf(clean()),changed=copy(row);mutate(changed);assert.throws(()=>G.assertPdf(row,changed));
  }
});
function matrix() {
  const item={purpose:'performance',fixture:'synthetic',repeat:1,network:'normal',operation:'cold-sol',labels:['baseline','current']};
  return {plan:{measurements:[item]},rows:item.labels.map(label=>({...item,label})),pairs:[{...item,pass:true}],coverage:{complete:true,plannedRows:2,observedRows:2,plannedPairs:1,observedPairs:1,missingRows:[],missingPairs:[],duplicateRows:[],duplicatePairs:[]}};
}
test('exact planned row and pair identities pass',()=>{const m=matrix();G.validateCoverage(m.rows,m.pairs,m.plan,m.coverage);});
test('duplicates or renamed rows fail even with the same denominator',()=>{
  for(const mutate of [m=>m.rows[1]=copy(m.rows[0]),m=>m.rows[1].operation='renamed',m=>m.pairs[0].fixture='wrong']) {
    const m=matrix();mutate(m);assert.throws(()=>G.validateCoverage(m.rows,m.pairs,m.plan,m.coverage),/IDENTITY_COVERAGE_CHANGED/);
  }
});
test('no blocked or missing row can hide behind complete=true',()=>{
  for(const mutate of [m=>m.coverage.missingRows=[{}],m=>m.coverage.duplicatePairs=[{}],m=>m.coverage.observedRows=1]) {
    const m=matrix();mutate(m);assert.throws(()=>G.validateCoverage(m.rows,m.pairs,m.plan,m.coverage));
  }
});
test('invalid current SHA is rejected before loading any evidence',()=>{assert.throws(()=>G.qualify({}, {}, 'main'),/CURRENT_SHA_REQUIRED/);});
