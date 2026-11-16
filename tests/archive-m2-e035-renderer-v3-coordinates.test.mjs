import test from 'node:test';
import assert from 'node:assert/strict';
import {e035Fixture,fixtureViewportEvidenceV3} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';

const allShapes=(c,fn)=>{
  const cap=c.capture;
  for(const value of [cap.viewportEvidence.beforeScroll,cap.viewportEvidence.afterScroll,...cap.tiles.flatMap(t=>[t.screenshotEvidence.metricsBefore,t.screenshotEvidence.metricsAfter])])fn(value);
};

test('synthetic E035 v3 accepts exact scrolled viewport coordinates without capture scroll restoration',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-solution'),cap=c.capture,tile=cap.tiles[0];
    cap.content.y+=100;cap.question.y+=100;tile.scroll.y=100;tile.scrollOperations=1;cap.scrollAfter.y=100;cap.scrollOperations=1;
    fixtureViewportEvidenceV3(c);
  });
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.caseCount,4);
});

for(const [name,mutate,pattern] of [
  ['layout and visual divergence',c=>{fixtureViewportEvidenceV3(c,{layoutViewport:{width:786,height:1688},visualViewport:{width:786,height:1688,offsetLeft:0,offsetTop:0,scale:.5}});},/exact v3 viewport measurements/],
  ['client-only divergence',c=>{allShapes(c,m=>m.documentClient.width++);},/exact v3 viewport measurements/],
  ['screen-only divergence',c=>{allShapes(c,m=>m.screen.height++);},/exact v3 viewport measurements/],
  ['fractional visual width drift',c=>{allShapes(c,m=>{m.visualViewport.width-=.001;});},/must be identical/],
  ['non-unit scale even below the old tolerance',c=>{allShapes(c,m=>{m.visualViewport.scale+=.000001;});},/must be identical/],
  ['nonzero visual offset even below the old tolerance',c=>{allShapes(c,m=>{m.visualViewport.offsetLeft=.001;});},/must be identical/],
  ['non-unit device pixel ratio',c=>{allShapes(c,m=>{m.devicePixelRatio=2;});},/exact v3 viewport measurements/],
  ['post-capture scroll drift',c=>{c.capture.tiles[0].screenshotEvidence.metricsAfter.visualViewport.pageTop++;},/original v3 viewport screenshot/],
  ['self-consistent but wrong visual page origin',c=>{for(const m of [c.capture.tiles[0].screenshotEvidence.metricsBefore,c.capture.tiles[0].screenshotEvidence.metricsAfter])m.visualViewport.pageTop=.001;},/v3 screenshot ROI, origin/],
  ['viewport context substitution',c=>{c.viewport.width=1280;c.viewport.height=900;fixtureViewportEvidenceV3(c);},/exact E035 student context presets/],
  ['removed mobile emulation',c=>{c.capture.viewportEvidence.isMobile=false;c.capture.viewportEvidence.hasTouch=false;},/v3 browser viewport or layout changed/],
  ['unknown viewport metric',c=>{allShapes(c,m=>{m.verified=true;});},/exact v3 viewport measurements/],
  ['different recorded viewport clip',c=>{c.capture.tiles[0].screenshotEvidence.viewportClip.x++;},/original v3 viewport screenshot/],
  ['different derived document clip',c=>{c.capture.tiles[0].screenshotEvidence.documentClip.y++;},/v3 screenshot ROI, origin/],
])test('truthfully resealed v3 geometry rejects '+name,t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});f.reseal('technical',v=>mutate(v.cases.find(c=>c.caseId==='mobile-problem')));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),pattern);
});

test('v3 rejects a fully resealed offscreen ROI rather than capturing beyond the visible viewport',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem'),cap=c.capture;
    cap.content.x=100;cap.question.x=100;cap.tiles[0].clip.x=100;fixtureViewportEvidenceV3(c);
  });
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/v3 screenshot ROI, origin/);
});
