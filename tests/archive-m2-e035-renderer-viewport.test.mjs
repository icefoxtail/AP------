import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {e035Fixture,fixturePng,fixtureViewportEvidence,sha} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';

test('E035 v2 accepts a complete visible CSS tile with distinct 390-context and 786-layout widths',t=>{
  const f=e035Fixture(t);
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem'),cap=c.capture,clip={x:20,y:50,width:650.92578,height:120.75};
    cap.content={...clip};cap.question={...clip};cap.tiles[0].clip={...clip};cap.tiles[0].relativeInterval=[0,clip.height];
    cap.coverage={requiredInterval:[0,clip.height],coveredInterval:[0,clip.height],complete:true};
    const scale=390/786;fixtureViewportEvidence(c,{layoutViewport:{width:786,height:Math.ceil(c.viewport.height/scale)},visualViewport:{width:786,height:c.viewport.height/scale,offsetLeft:0,offsetTop:0,scale}});
    const raw=fixturePng(650,120),shot=c.screenshots[0];f.put(path.posix.dirname(f.technicalPath)+'/'+shot.path,raw);Object.assign(shot,{sha256:sha(raw),bytes:raw.length});
  });
  f.reseal('visual',v=>{v.records.find(r=>r.caseId==='mobile-problem').coverageReview.screenshots=structuredClone(f.technical.cases.find(c=>c.caseId==='mobile-problem').screenshots);});
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.caseCount,4);
});

test('E035 v2 authenticates a scrolled visible tile in document coordinates without a viewport change',t=>{
  const f=e035Fixture(t);
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-solution'),cap=c.capture,tile=cap.tiles[0];
    cap.content.y+=100;cap.question.y+=100;tile.scroll.y=100;tile.scrollOperations=1;cap.scrollAfter.y=100;cap.scrollOperations=1;
    fixtureViewportEvidence(c);
  });
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.caseCount,4);
});

for(const [viewport,width,height] of [['mobile',1280,900],['desktop',390,844]])
test('E035 v2 rejects truthfully rebound fake '+viewport+' '+width+' context',t=>{
  const f=e035Fixture(t);
  f.reseal('technical',v=>{
    for(const c of v.cases.filter(c=>c.viewport.name===viewport)){
      c.viewport.width=width;c.viewport.height=height;fixtureViewportEvidence(c);
    }
  });
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact E035 student context presets required/);
});

const bothMetrics=(c,fn)=>{const s=c.capture.tiles[0].screenshotEvidence;fn(s.metricsBefore);s.metricsAfter=structuredClone(s.metricsBefore);};
for(const [name,mutate,pattern] of [
  ['v1 capture substitution',(v,c)=>{v.schemaVersion='archive-e035-current-renderer-student-ui-technical-v1';},/four actual current student UI cases/],
  ['omitted context-layout evidence',(_v,c)=>{delete c.capture.viewportEvidence;},/explicit E035 v2 viewport evidence/],
  ['wrong coordinate system',(_v,c)=>{c.capture.coordinateSystem='PHYSICAL_PIXELS';},/explicit E035 v2 viewport evidence/],
  ['changed browser viewport',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.contextViewportAfter.width++;},/original document-coordinate screenshot/],
  ['layout shape changed during scrolling',(_v,c)=>{c.capture.viewportEvidence.afterScroll.layoutViewport.width++;},/browser viewport or layout changed/],
  ['document client changed during capture',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.metricsAfter.documentClient.height++;},/original document-coordinate screenshot/],
  ['mobile emulation removed',(_v,c)=>{c.capture.viewportEvidence.isMobile=false;c.capture.viewportEvidence.hasTouch=false;},/browser viewport or layout changed/],
  ['DPR changed',(_v,c)=>{c.capture.viewportEvidence.deviceScaleFactor=2;},/browser viewport or layout changed/],
  ['scale does not fit the context',(_v,c)=>{for(const s of [c.capture.viewportEvidence.beforeScroll,c.capture.viewportEvidence.afterScroll])s.visualViewport.scale=2;},/visual viewport does not map/],
  ['visual origin drift',(_v,c)=>{bothMetrics(c,m=>{m.visualViewport.pageTop+=0.1;});},/screenshot ROI is clipped, offscreen/],
  ['different document clip',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.documentClip.x++;},/screenshot ROI is clipped, offscreen/],
  ['viewport-only screenshot API',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.fullPage=false;},/original document-coordinate screenshot/],
  ['device-pixel screenshot scale',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.scale='device';},/original document-coordinate screenshot/],
  ['postprocessed screenshot',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.postprocessing=true;},/original document-coordinate screenshot/],
  ['invented full PNG dimensions',(_v,c)=>{c.capture.tiles[0].screenshotEvidence.pngDimensions.width++;},/screenshot ROI is clipped, offscreen/],
  ['unknown metric field',(_v,c)=>{bothMetrics(c,m=>{m.syntheticWaiver=true;});},/exact current viewport measurements/],
])test('truthfully re-sealed E035 v2 geometry rejects '+name,t=>{
  const f=e035Fixture(t);f.reseal('technical',v=>mutate(v,v.cases.find(c=>c.caseId==='mobile-problem')));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),pattern);
});

test('a tile within the layout viewport is rejected when it leaves the actual visual viewport',t=>{
  const f=e035Fixture(t);
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem'),scale=390/300;
    fixtureViewportEvidence(c,{layoutViewport:{width:390,height:c.viewport.height},visualViewport:{width:300,height:c.viewport.height/scale,offsetLeft:0,offsetTop:0,scale}});
  });
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/screenshot ROI is clipped, offscreen/);
});
