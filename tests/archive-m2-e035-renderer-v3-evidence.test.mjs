import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {e035Fixture,fixturePng,fixtureViewportEvidenceV3,sha} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';

test('v3 authenticates only the declared floor CSS plus0.001 original PNG quantizer',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem'),cap=c.capture,height=120.9995;
    cap.content.height=height;cap.question.height=height;cap.tiles[0].clip.height=height;cap.tiles[0].relativeInterval=[0,height];
    cap.coverage={requiredInterval:[0,height],coveredInterval:[0,height],complete:true};fixtureViewportEvidenceV3(c);
    const raw=fixturePng(cap.content.width,121),shot=c.screenshots[0];f.put(path.posix.dirname(f.technicalPath)+'/'+shot.path,raw);Object.assign(shot,{sha256:sha(raw),bytes:raw.length});
  });
  f.reseal('visual',v=>{v.records.find(r=>r.caseId==='mobile-problem').coverageReview.screenshots=structuredClone(f.technical.cases.find(c=>c.caseId==='mobile-problem').screenshots);});
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.pixelRule,'FLOOR_CSS_PX_PLUS_0_001');
});

test('v3 retains the original complete two-tile solution coverage and exact32 overlap guard',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  const sync=()=>f.reseal('visual',v=>{v.records.find(r=>r.caseId==='mobile-solution').coverageReview.screenshots=structuredClone(f.technical.cases.find(c=>c.caseId==='mobile-solution').screenshots);});
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-solution'),cap=c.capture,first=cap.tiles[0];
    cap.content.height=cap.question.height=820;cap.tileCount=2;cap.coverage={requiredInterval:[0,820],coveredInterval:[0,820],complete:true};
    first.relativeInterval=[0,762];first.clip.height=762;
    const second=structuredClone(first);Object.assign(second,{tileIndex:2,relativeInterval:[730,820],filename:'e035-solution-mobile-tile-02.png',scroll:{x:0,y:730},scrollOperations:1});second.clip.height=90;
    cap.tiles.push(second);cap.scrollAfter={x:0,y:730};cap.scrollOperations=1;
    c.screenshots=cap.tiles.map(tile=>{const raw=fixturePng(350,tile.clip.height),relative=path.posix.dirname(f.technicalPath)+'/'+tile.filename;f.put(relative,raw);if(!f.allLivePaths.includes(relative))f.allLivePaths.push(relative);return{tileIndex:tile.tileIndex,path:tile.filename,sha256:sha(raw),bytes:raw.length};});
    fixtureViewportEvidenceV3(c);
  });sync();
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.originalTileCount,5);
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-solution'),tile=c.capture.tiles[1];
    tile.relativeInterval[0]=731;tile.clip.y=51;tile.clip.height=89;fixtureViewportEvidenceV3(c);
    const raw=fixturePng(350,89),shot=c.screenshots[1];f.put(path.posix.dirname(f.technicalPath)+'/'+shot.path,raw);Object.assign(shot,{sha256:sha(raw),bytes:raw.length});
  });sync();
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/original scroll tile binding or coverage changed/);
});

for(const [name,mutate,pattern] of [
  ['full-page capture',(_v,s)=>{s.fullPage=true;},/original v3 viewport screenshot/],
  ['document API coordinates',(_v,s)=>{s.coordinateSystem='DOCUMENT_CSS_PIXELS';},/original v3 viewport screenshot/],
  ['different screenshot API',(_v,s)=>{s.api='CDP_CAPTURE_SCREENSHOT';},/original v3 viewport screenshot/],
  ['device-pixel scale',(_v,s)=>{s.scale='device';},/original v3 viewport screenshot/],
  ['capture-role document clip',(_v,s)=>{s.documentClipRole='CAPTURE_ROI';},/original v3 viewport screenshot/],
  ['round or range quantizer',(_v,s)=>{s.pixelRule='ROUND_OR_FLOOR';},/original v3 viewport screenshot/],
  ['different per-tile driver',(_v,s)=>{s.playwrightVersion='1.62.2';},/original v3 viewport screenshot/],
  ['postprocessed image',(_v,s)=>{s.postprocessing=true;},/original v3 viewport screenshot/],
  ['invented original PNG size',(_v,s)=>{s.pngDimensions.height++;},/v3 screenshot ROI, origin/],
  ['v2 schema with v3 measurements',v=>{v.schemaVersion='archive-e035-current-renderer-student-ui-technical-v2';},/four actual current student UI cases/],
  ['undeclared verifier flag',v=>{v.verified=true;},/four actual current student UI cases/],
])test('truthfully resealed v3 screenshot evidence rejects '+name,t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});f.reseal('technical',v=>mutate(v,v.cases.find(c=>c.caseId==='mobile-problem').capture.tiles[0].screenshotEvidence));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),pattern);
});

test('v3 rejects changed original PNG bytes even when screenshot references are truthfully re-sealed',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem'),shot=c.screenshots[0],raw=fixturePng(349,120);
    f.put(path.posix.dirname(f.technicalPath)+'/'+shot.path,raw);Object.assign(shot,{sha256:sha(raw),bytes:raw.length});
  });
  f.reseal('visual',v=>{v.records.find(r=>r.caseId==='mobile-problem').coverageReview.screenshots=structuredClone(f.technical.cases.find(c=>c.caseId==='mobile-problem').screenshots);});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/original UI tile bytes or pixel dimensions changed/);
});

for(const [name,mutate] of [
  ['glyph HOLD',r=>{r.glyphsLegible=false;}],
  ['incomplete solution',r=>{r.completeSolutionCoverage=false;}],
  ['missing tile observation',r=>{r.coverageReview.screenshots=[];}],
])test('v3 keeps independent '+name+' fail-closed',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});f.reseal('visual',v=>mutate(v.records.find(r=>r.caseId==='mobile-solution')));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/missing or contradictory|independent observation of every original scroll tile/);
});
