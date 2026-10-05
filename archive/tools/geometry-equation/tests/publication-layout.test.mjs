import assert from 'node:assert/strict';
import test from 'node:test';
import {analyzeRenderedLayout,captureAtDisplaySize} from '../verify-rendered-layout.mjs';
function sample(){return{runtime:'playwright-chromium',synthetic:false,publicationProfile:'geometry-publication-v1',fontStatus:'loaded',svg:{x:0,y:0,width:384,height:384},viewBox:{width:384,height:384},safeMargin:32,labels:[{id:'A-name',kind:'POINT_NAME',priority:1,baseFontPx:16,effectiveFontPx:13,client:{x:70,y:70,width:12,height:16},bbox:{width:12,height:16},missingGlyphCount:0}],geometry:[]};}

test('stroke edge touching text fails even when the centerline misses',()=>{
  const c=sample();
  c.geometry=[{id:'AB',kind:'line',points:[[40,69],[110,69]],strokeWidthPx:4,client:{x:40,y:69,width:70,height:0}}];
  assert.ok(analyzeRenderedLayout(c).errors.includes('LABEL_GEOMETRY_COLLISION:A-name:AB'));
});
test('circle stroke edge touching text fails even when its centerline misses',()=>{
  const c=sample();
  c.geometry=[{id:'circle',kind:'circle',at:[50,78],radius:19,strokeWidthPx:4,client:{x:31,y:59,width:38,height:38}}];
  assert.ok(analyzeRenderedLayout(c).errors.includes('LABEL_GEOMETRY_COLLISION:A-name:circle'));
});
test('render result preserves per-label final CSS font evidence',()=>{
  const result=analyzeRenderedLayout(sample());
  assert.equal(result.labelMeasurements[0].finalViewportCssFontPx,13);
  assert.equal(result.labelMeasurements[0].id,'A-name');
});
test('publication explanatory text also obeys the mobile font floor',()=>{
  const c=sample();c.labels.push({...c.labels[0],id:'note',kind:'GRAPH_ANNOTATION',effectiveFontPx:8,client:{x:110,y:70,width:20,height:10}});
  assert.ok(analyzeRenderedLayout(c).errors.includes('PUBLICATION_FONT_BELOW_11_CSS_PX:note'));
});
test('publication text needs an actual effective CSS font floor',()=>{const c=sample();assert.equal(analyzeRenderedLayout(c).status,'PASS');c.labels[0].effectiveFontPx=10.99;assert.ok(analyzeRenderedLayout(c).errors.some(e=>e.startsWith('PUBLICATION_FONT_BELOW')));});
test('publication mixed point/numeric base sizes fail',()=>{const c=sample();c.labels.push({...c.labels[0],id:'length',kind:'LENGTH_LABEL',baseFontPx:14,client:{x:100,y:100,width:12,height:16}});assert.ok(analyzeRenderedLayout(c).errors.includes('PUBLICATION_BASE_FONT_INCONSISTENT'));});
test('publication empty/skeleton labels cannot pass',()=>{const c=sample();c.labels=[];assert.equal(analyzeRenderedLayout(c).status,'FAIL');});
test('publication unready fonts cannot pass',()=>{const c=sample();c.fontStatus='loading';assert.equal(analyzeRenderedLayout(c).status,'FAIL');});
test('publication nonfinite label bounds fail closed',()=>{const c=sample();c.labels[0].client.width=NaN;assert.equal(analyzeRenderedLayout(c).status,'FAIL');});
test('display replay requires a nonzero real image size',async()=>{await assert.rejects(captureAtDisplaySize(null,'<svg/>',{width:0,height:50}),/DISPLAY_SIZE/);await assert.rejects(captureAtDisplaySize(null,'<svg/>',{width:NaN,height:50}),/DISPLAY_SIZE/);});
test('own region exit is allowed, unrelated crossing remains a failure',()=>{const c=sample();c.labels[0].client={x:250,y:250,width:12,height:16};c.geometry=[{id:'r',kind:'region',points:[[50,50],[150,50],[150,150],[50,150],[50,50]],client:{x:50,y:50,width:100,height:100}},{id:'edge',kind:'line',points:[[150,50],[150,150]],client:{x:150,y:50,width:0,height:100}},{id:'lead',kind:'leader',owner:'r',ownerKind:'REGION',points:[[120,100],[180,100]],client:{x:120,y:100,width:60,height:0}}];assert.equal(analyzeRenderedLayout(c).status,'PASS');c.geometry.push({id:'other',kind:'line',points:[[170,50],[170,150]],client:{x:170,y:50,width:0,height:100}});assert.ok(analyzeRenderedLayout(c).errors.includes('LEADER_CROSSING:lead:other'));});
