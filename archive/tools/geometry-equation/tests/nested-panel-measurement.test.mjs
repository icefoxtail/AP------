import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {decodeMeasuredPanel,measuredLabelInventory,verifyMeasuredLabelInventory,withMeasuredPanels} from '../nested-panel-measurement.mjs';
import {analyzeRenderedLayout,collectRenderedLayout} from '../verify-rendered-layout.mjs';
import {renderPlan,validateProblemDisplaySegments} from '../production/render-plan.mjs';
const sha=svg=>'sha256:'+crypto.createHash('sha256').update(svg).digest('hex');
const image=(svg,id='p1-panel')=>`<image id="${id}" data-panel-svg-sha="${sha(svg)}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`;
const matrix={a:1,b:0,c:0,d:1,e:0,f:0},rect={x:0,y:0,width:300,height:240};
const leaf='<svg xmlns="http://www.w3.org/2000/svg"><g id="A" data-fragment-sha="glyph"/></svg>';
const outer='<svg xmlns="http://www.w3.org/2000/svg"><g id="caption" data-fragment-sha="caption"/>'+image(leaf)+'</svg>';
function sample(){return{labelMeasurements:[{id:'caption'},{id:'p1-panel/A'}],nestedPanelEvidence:[{sourceImageId:'p1-panel',inlineOverflow:'hidden',inlineViewportRectMode:'ACTUAL_CTM_PROJECTED_NATURAL_VIEWPORT',sourceSha256:sha(leaf),expectedLabelIds:['A'],measuredLabelIds:['A'],labelInventoryExact:true,inlineMatrix:matrix,expectedInlineMatrix:matrix,inlineRect:rect,sourceImageRect:rect,layout:{labelMeasurements:[{id:'A'}]}}]};}
test('panel bytes require canonical exact SHA-bound embedded SVG, not external URLs or mismatched bytes',()=>{
 const href='data:image/svg+xml;base64,'+Buffer.from(leaf).toString('base64');assert.equal(decodeMeasuredPanel({href,sha256:sha(leaf)}).svg,leaf);
 assert.throws(()=>decodeMeasuredPanel({href,sha256:sha(outer)}),/SHA_MISMATCH/);
 assert.throws(()=>decodeMeasuredPanel({href:'https://example.org/panel.svg',sha256:sha(leaf)}),/DATA_URI_REQUIRED/);
 const bad='<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>';
 assert.throws(()=>decodeMeasuredPanel({href:'data:image/svg+xml;base64,'+Buffer.from(bad).toString('base64'),sha256:sha(bad)}),/UNSUPPORTED_CONTENT/);
});
test('exact source inventory contains every inner glyph plus caption and rejects a silently omitted label',()=>{
 assert.deepEqual(measuredLabelInventory(outer).labels,['caption']);assert.deepEqual(verifyMeasuredLabelInventory(outer,sample()),{labelCount:2,panelCount:1});
 const omitted=sample();omitted.labelMeasurements.pop();assert.throws(()=>verifyMeasuredLabelInventory(outer,omitted),/INVENTORY_MISMATCH/);
 const nestedOmitted=sample();nestedOmitted.nestedPanelEvidence[0].layout.labelMeasurements=[];assert.throws(()=>verifyMeasuredLabelInventory(outer,nestedOmitted),/INVENTORY_MISMATCH/);
 const missing=sample();missing.nestedPanelEvidence=[];assert.throws(()=>verifyMeasuredLabelInventory(outer,missing),/EVIDENCE_MISSING/);
});
test('readback rejects source SHA, measured inventory and actual replay CTM/rect mismatches',()=>{
 for(const mutate of [r=>r.sourceSha256=sha(outer),r=>r.measuredLabelIds=[],r=>r.inlineMatrix={...matrix,a:.9},r=>r.inlineRect={...rect,width:298}]){
  const layout=sample();mutate(layout.nestedPanelEvidence[0]);assert.throws(()=>verifyMeasuredLabelInventory(outer,layout),/BINDING_MISMATCH|TRANSFORM_MISMATCH/);
 }
});
test('outline font metadata and font boundary CTMs are mandatory; policy values cannot replace observations',()=>{
 const layout={labelMeasurements:[{id:'A',font:'FROZEN_OUTLINE',baseFontPx:20,finalViewportCssFontPx:20}]};
 assert.throws(()=>verifyMeasuredLabelInventory(leaf,layout),/FONT_METADATA_REQUIRED/);
 layout.labelMeasurements[0].fontMeasurement={metadataFontPx:20,boundaries:[{kind:'FONT_UNITS',unitsPerEm:1000,matrix:{...matrix,a:.02,d:.02}}]};
 assert.deepEqual(verifyMeasuredLabelInventory(leaf,layout),{labelCount:1,panelCount:0});
 layout.labelMeasurements[0].finalViewportCssFontPx=25;assert.throws(()=>verifyMeasuredLabelInventory(leaf,layout),/OBSERVATION_MISMATCH/);
});
test('noncomposite measurement capture is returned unchanged and opens no replay DOM',async()=>{
 const capture={runtime:'playwright-chromium',synthetic:false,labels:[],geometry:[]};let calls=0;
 const page={evaluate:async()=>{calls++;return[];}};
 assert.equal(await withMeasuredPanels(page,'svg',{width:390,height:844},async()=>capture),capture);assert.equal(calls,1);
 assert.equal(Object.hasOwn(capture,'nestedPanels'),false);
});
test('nested panel bounds and geometry failures propagate through original panel analysis',()=>{
 const child={runtime:'playwright-chromium',synthetic:false,svg:{x:0,y:0,width:300,height:240},viewBox:{width:300,height:240},safeMargin:12,labels:[{id:'A',priority:0,client:{x:1,y:1,width:20,height:20},bbox:{width:20,height:20},missingGlyphCount:0}],geometry:[]};
 const capture={...child,problemMeasurement:true,labels:[],nestedPanels:[{sourceImageId:'p1-panel',capture:child}]},result=analyzeRenderedLayout(capture);
 assert.equal(result.status,'FAIL');assert.equal(result.CLIPPING,1);assert.ok(result.errors.some(e=>e.startsWith('NESTED_PANEL:p1-panel:')));assert.equal(result.labelMeasurements[0].id,'p1-panel/A');
});
test('problem displaySegments fail closed at exactly two endpoints, recursively, without mutating plans or solution acceptance',()=>{
 const valid={panels:[{plan:{displaySegments:[{id:'AB',refs:['A','B']}]}}]},before=JSON.stringify(valid);validateProblemDisplaySegments(valid,'PROBLEM_VISUAL');assert.equal(JSON.stringify(valid),before);
 for(const refs of [[],['A'],['A','B','C'],null]){const malformed={panels:[{plan:{displaySegments:[{id:'AB',refs}]}}]};assert.throws(()=>validateProblemDisplaySegments(malformed,'PROBLEM_VISUAL'),/REFS_EXACTLY_TWO_REQUIRED/);assert.doesNotThrow(()=>validateProblemDisplaySegments(malformed,'SOLUTION_VISUAL'));assert.doesNotThrow(()=>validateProblemDisplaySegments(malformed,undefined));}
});

test('production problem runner refuses a three-point segment before model/measurement/browser work',async t=>{
 const outDir=fs.mkdtempSync(path.join(os.tmpdir(),'problem-segment-guard-'));t.after(()=>fs.rmSync(outDir,{recursive:true,force:true}));
 const result=await renderPlan({item:{sourcePath:'archive/exams/original/technical-fixture.js',ordinal:1,dir:'badrefs',surface:'PROBLEM_VISUAL'},plan:{capability:'construction-spike-v1',caption:'기술 입력 검증',displaySegments:[{id:'bad',refs:['A','B','C']}]},outDir});
 assert.equal(result.status,'FAILED');assert.equal(result.stage,'read-plan');assert.match(result.detail,/PROBLEM_DISPLAY_SEGMENT_REFS_EXACTLY_TWO_REQUIRED/);assert.equal(fs.existsSync(path.join(outDir,'badrefs-problem.svg')),false);
});


test('default/solution collector body and analysis JSON remain equivalent to frozen immutable 2180ce31 evidence',()=>{
 const raw=fs.readFileSync(new URL('./fixtures/legacy-rendered-layout-2180ce31.json',import.meta.url),'utf8');
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),'4f6066a24b498efc918cb7e7a60fc37cedbde0d0b0a2eb56047155b99b6f511f');
 const fixture=JSON.parse(raw);
 assert.equal(fixture.provenance.commit,'2180ce315e014ba2bafa6813ced409091acee504');
 assert.equal(fixture.provenance.moduleSha256,'bf0f61545027b1ab217fb2773407ac45b1e24fd40b101995a707e5477998c52c');
 const current=fs.readFileSync(new URL('../verify-rendered-layout.mjs',import.meta.url),'utf8'),start=current.indexOf('async function collectDefaultRenderedLayout('),end=current.indexOf('async function collectDomLayout(',start),collector=current.slice(start,end),body=collector.slice(collector.indexOf('{'),collector.lastIndexOf('}')+1);
 assert.equal(crypto.createHash('sha256').update(body).digest('hex'),fixture.provenance.collectorBodySha256,'Default collector body must remain exact baseline bytes');
 assert.equal(fixture.cases.length,5);
 for(const sample of fixture.cases)assert.equal(JSON.stringify(analyzeRenderedLayout(sample.capture)),sample.expectedJson,sample.name);
});


test('only explicit PROBLEM_VISUAL selects nested inspection; omitted and solution options keep the exact two legacy evaluate calls',async()=>{
 for(const surface of [undefined,'SOLUTION_VISUAL','PROBLEM_VISUAL']){
  const calls=[],marker={unchanged:'raw default capture'};
  const page={viewportSize:()=>({width:390,height:844}),evaluate:async(fn,arg)=>{calls.push(fn.toString());return calls.length===1?undefined:calls.length===2?marker:[];}};
  const result=await collectRenderedLayout(page,undefined,{surface});assert.equal(result,marker);
  assert.equal(calls.length,surface==='PROBLEM_VISUAL'?3:2);assert.equal(calls[1].includes('problemMeasurement:true'),surface==='PROBLEM_VISUAL');
 }
});

test('problem text readiness counts actual nested glyphs with zero outer captions and rejects missing/loading nested glyphs',()=>{
 const child={runtime:'playwright-chromium',synthetic:false,problemMeasurement:true,publicationProfile:'fragment-publication-spike-v1',fontStatus:'loaded',svg:{x:0,y:0,width:300,height:240},viewBox:{width:300,height:240},safeMargin:12,labels:[{id:'A',kind:'COORDINATE_LABEL',priority:0,baseFontPx:20,effectiveFontPx:20,client:{x:60,y:60,width:20,height:20},bbox:{width:20,height:20},missingGlyphCount:0}],geometry:[]};
 const capture={...child,publicationProfile:null,labels:[],nestedPanels:[{sourceImageId:'p1-panel',capture:child}]};
 const result=analyzeRenderedLayout(capture);assert.equal(result.status,'PASS',JSON.stringify(result.errors));assert.equal(result.labelMeasurements.length,1);assert.equal(result.labelMeasurements[0].id,'p1-panel/A');
 const loading=structuredClone(capture);loading.nestedPanels[0].capture.fontStatus='loading';assert.ok(analyzeRenderedLayout(loading).errors.includes('PUBLICATION_TEXT_NOT_READY'));
 const omitted=structuredClone(capture);omitted.nestedPanels[0].capture.labels=[];assert.ok(analyzeRenderedLayout(omitted).errors.includes('PUBLICATION_TEXT_NOT_READY'));
});

test('problem 11 CSS px floor rejects standalone, outer-caption and captionless nested 8px glyphs at desktop, phone and tablet widths',()=>{
 for(const publicationViewport of [{width:1440,height:1000},{width:390,height:844},{width:768,height:1024}]){
  const leaf={runtime:'playwright-chromium',synthetic:false,problemMeasurement:true,publicationViewport,publicationProfile:'fragment-publication-spike-v1',fontStatus:'loaded',svg:{x:0,y:0,width:300,height:240},viewBox:{width:300,height:240},safeMargin:12,labels:[{id:'A',kind:'COORDINATE_LABEL',priority:0,baseFontPx:20,effectiveFontPx:8,client:{x:60,y:60,width:10,height:10},bbox:{width:10,height:10},missingGlyphCount:0}],geometry:[]};
  for(const publicationProfile of ['fragment-publication-spike-v1',null]){
   const single={...leaf,publicationProfile},nested={...leaf,publicationProfile,labels:[],nestedPanels:[{sourceImageId:'p1-panel',capture:single}]},caption={...single,labels:[{...single.labels[0],id:'caption',kind:'CAPTION'}]};
   for(const capture of [single,nested,caption]){const result=analyzeRenderedLayout(capture);assert.equal(result.status,'FAIL');assert.ok(result.errors.some(e=>e.includes('PUBLICATION_FONT_BELOW_11_CSS_PX')),JSON.stringify({publicationViewport,publicationProfile,result}));assert.ok(result.labelMeasurements.every(label=>label.finalViewportCssFontPx===8));}
  }
  const clear=structuredClone(leaf);clear.labels[0].effectiveFontPx=11;assert.equal(analyzeRenderedLayout(clear).status,'PASS');
  if(publicationViewport.width<1280){const legacy={...leaf};delete legacy.problemMeasurement;assert.equal(analyzeRenderedLayout(legacy).status,'PASS','The established default/solution mobile font condition stays unchanged');}
 }
});
