import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {e035Fixture,fixturePng,fixtureViewportEvidence,sha} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';
import {validateReviewedSourceReassessment} from '../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';

for(const [name,kind,mutate,pattern] of [
  ['unresolved repaired observation','positive',v=>{v.continuity.noNewGivenConditions=false;},/actual independent renderer observation/],
  ['native author impersonates independent observer','positive',(v,f)=>{v.observer=f.nativeDoc.owner;},/actual independent renderer observation/],
  ['missing written context reading','positive',v=>{v.observed.currentWrittenSolutionRead=false;},/actual independent renderer observation/],
  ['new semantic approval claim','positive',v=>{v.newMathematicalQa=true;},/actual independent renderer observation/],
  ['wrong observation asset despite a fresh document digest','positive',v=>{v.currentAssets.solution=v.currentAssets.problem;},/renderer inventory differs/],
  ['missing actual UI case','technical',v=>{v.cases.pop();},/four actual current student UI cases/],
  ['unknown execution environment','technical',v=>{v.executionOwner='UNOBSERVED_BROWSER';},/four actual current student UI cases/],
  ['source overlay','technical',v=>{v.sourceOverlayCount=1;},/four actual current student UI cases/],
  ['different full storage bank','technical',v=>{v.transportMetadata.mixedQuestionsSha256='0'.repeat(64);},/actual unchanged full-bank/],
  ['missing served current asset','technical',v=>{v.servedFiles=v.servedFiles.filter(r=>r.path!==v.currentAssets.solution.path);},/student asset absent/],
  ['DOM mutation','technical',v=>{v.cases[0].capture.domWrites=1;},/complete unchanged student scroll coverage/],
  ['pending render state','technical',v=>{v.cases[0].readiness='WAITING';},/missing or contradictory four-case/],
  ['solution hidden in solution view','technical',v=>{v.cases.find(c=>c.view==='solution').solutionNodes=0;},/missing or contradictory four-case/],
  ['incomplete scroll coverage','technical',v=>{v.cases[0].capture.coverage.complete=false;},/complete unchanged student scroll coverage/],
  ['font failure','technical',v=>{v.cases[0].fontStatus='loading';},/missing or contradictory four-case/],
  ['same UI producer and independent observer','visual',(v,f)=>{v.observer=f.technical.producer;},/separate independent observation/],
  ['incomplete solution observation','visual',v=>{v.records.find(r=>r.view==='solution').completeSolutionCoverage=false;},/missing or contradictory four-case/],
  ['unread original UI tile','visual',v=>{v.records[0].coverageReview.screenshots=[];},/independent observation of every original scroll tile/],
])test('truthfully re-sealed E035 evidence rejects '+name,t=>{
  const f=e035Fixture(t);f.reseal(kind,v=>mutate(v,f));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),pattern);
});

test('an original HOLD cannot be replaced by a fresh positive stamp on the same path',t=>{
  const f=e035Fixture(t);f.reseal('negative',v=>{v.decision='RETAIN_EXISTING_APPROVED_METADATA';v.continuity.givenGeometryRelationsPreserved=true;v.observations.unresolvedIssue=null;});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/actual independent renderer observation/);
});

test('actual capture raw bytes remain fresh after a warm successful validation',t=>{
  const f=e035Fixture(t);validateM2E035RendererContinuity(f.args);
  const capture=f.positive.renderedViews.find(v=>v.phase==='current'&&v.role==='solution').captureRef;
  f.put(capture.path,fixturePng(121,100));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/bound live evidence or source changed/);
});

test('re-sealing a changed PNG header cannot impersonate the original UI tile',t=>{
  const f=e035Fixture(t),shot=f.technical.cases[0].screenshots[0],p=path.posix.dirname(f.technicalPath)+'/'+shot.path;
  const bytes=fixturePng(10,10);f.put(p,bytes);
  f.reseal('technical',v=>{Object.assign(v.cases[0].screenshots[0],{sha256:sha(bytes),bytes:bytes.length});});
  f.reseal('visual',v=>{v.records[0].coverageReview.screenshots=structuredClone(f.technical.cases[0].screenshots);});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/original UI tile bytes or pixel dimensions changed/);
});

test('supported Chromium fractional CSS clips bind their original integer-floor PNG dimensions',t=>{
  const f=e035Fixture(t);
  f.reseal('technical',v=>{
    const c=v.cases[0],cap=c.capture;
    for(const r of [cap.content,cap.question,cap.tiles[0].clip]){r.width+=0.3125;r.height+=0.890625;}
    cap.coverage.requiredInterval[1]+=0.890625;cap.coverage.coveredInterval[1]+=0.890625;cap.tiles[0].relativeInterval[1]+=0.890625;
    fixtureViewportEvidence(c);
  });
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.caseCount,4);
});

test('a truthful 318-pixel mobile PNG never proves an unclipped 650-pixel CSS request',t=>{
  const f=e035Fixture(t),c=f.technical.cases.find(c=>c.caseId==='mobile-problem'),shot=c.screenshots[0];
  const bytes=fixturePng(318,120);f.put(path.posix.dirname(f.technicalPath)+'/'+shot.path,bytes);
  f.reseal('technical',v=>{
    const c=v.cases.find(c=>c.caseId==='mobile-problem');
    for(const r of [c.capture.content,c.capture.question,c.capture.tiles[0].clip])r.width=650.92578;
    Object.assign(c.screenshots[0],{sha256:sha(bytes),bytes:bytes.length});
    const scale=c.viewport.width/786;
    fixtureViewportEvidence(c,{layoutViewport:{width:786,height:Math.ceil(c.viewport.height/scale)},visualViewport:{width:786,height:c.viewport.height/scale,offsetLeft:0,offsetTop:0,scale}});
  });
  f.reseal('visual',v=>{v.records.find(r=>r.caseId==='mobile-problem').coverageReview.screenshots=structuredClone(c.screenshots);});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/original UI tile bytes or pixel dimensions changed/);
});

test('preserved HOLD capture is mandatory even after independent repaired evidence exists',t=>{
  const f=e035Fixture(t),capture=f.negative.renderedViews.find(v=>v.phase==='current'&&v.role==='solution').captureRef;
  fs.unlinkSync(path.join(f.root,capture.path));
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/bound live evidence or source missing/);
});

test('same-path repair cannot also change an unrelated geometric element',t=>{
  const f=e035Fixture(t,{repairExtraXml:'<circle cx="20" cy="20" r="4"/>'});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/repair must remove one line and add one text node only/);
});

test('same-path repair cannot introduce a numerical value',t=>{
  const f=e035Fixture(t,{repairAddedText:'AD = 15'});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/repair must remove one line and add one text node only/);
});

for(const [name,element] of [
  ['Unicode namespaced script','<한글:script xmlns:한글="http://www.w3.org/2000/svg">x</한글:script>'],
  ['animated color','<animateColor attributeName="fill" to="red"/>'],
  ['CSS escape','<path style="fill:u\\72l(external.svg)"/>'],
  ['XML entity','<text>&#65;</text>'],
  ['external image','<image href="other.png"/>'],
])test('E035 static assets reject '+name+' with truthful current hashes',t=>{
  const f=e035Fixture(t,{currentSolutionSvg:'<svg xmlns="http://www.w3.org/2000/svg">'+element+'</svg>'});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/SVG/);
});

test('a native content HOLD is checked before any renderer comparison view',t=>{
  const f=e035Fixture(t,{nativeRowDelta:{contentDebt:[{type:'SOURCE_REVIEW_PENDING'}]}});
  assert.throws(()=>validateReviewedSourceReassessment(f.args),/native review retains an explicit source\/content\/difficulty hold/);
});
