import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {specFor} from '../production/phase2.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {analyzeRenderedLayout,captureAtDisplaySize} from '../verify-rendered-layout.mjs';

const observer=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const source={
  family:'rational', numerator:['-3','2'], denominator:['-2','1'],
  sourceDomain:{kind:'ALL_REALS'}, domain:[-2,6], viewport:[-2,6,-2,6], equalUnits:true,
};
const options={asymptoteOnly:true,hideLabels:['formula']};
const run=async(action,graphPlan)=>{
  const reply=await pythonWorker({action,graphPlan});
  assert.equal(reply.status,'OK',JSON.stringify(reply.result));
  return reply.result;
};

test('asymptote-only rejects unsupported families and conflicting label instructions',async()=>{
  for(const [overrides,code] of [
    [{family:'polynomial'},'ASYMPTOTE_ONLY_REQUIRES_RATIONAL'],
    [{asymptoteOnly:false},'ASYMPTOTE_ONLY_INVALID'],
    [{numerator:['1','0']},'ASYMPTOTE_ONLY_REQUIRES_LINEAR_NUMERATOR'],
    [{numerator:['-4','2']},'ASYMPTOTE_ONLY_REQUIRES_VERTICAL_POLE'],
    [{hideLabels:undefined},'ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS'],
    [{axisTickValues:{x:[1],y:[]}},'ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS'],
    [{hideLabels:['formula','asymptotes']},'ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS'],
    [{verticalAsymptoteLabelAt:'NONE'},'ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS'],
    [{overlays:{points:[{id:'A',x:'3',y:'3'}]}},'ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS'],
  ]){
    const graphPlan=JSON.parse(JSON.stringify({...source,...options,...overrides}));
    const reply=await pythonWorker({action:'frame_graph',graphPlan});
    assert.equal(reply.status,'ERROR');
    assert.equal(reply.result.code,code);
  }
});

test('asymptote-only keeps both branches and exact displayed labels in PROBLEM_VISUAL',async()=>{
  const normal=(await run('frame_graph',source)).graphPlan;
  const normalSpec=specFor({capability:'rational-spike-v1',graphPlan:normal,caption:'유리함수 그래프'},null,'normal');
  assert.equal(normalSpec.axes,true);
  assert.deepEqual(normalSpec.objects.map(object=>object.kind),['FUNCTION_GRAPH','EQUATION_LABEL','GRAPH_ANNOTATION','GRAPH_ANNOTATION']);

  const identity=assetIdentity('25_효천고_2학기_기말_고1_유사|13','PROBLEM_VISUAL','problem-figure');
  const browser=await launchBrowser();
  try{
    for(const [input,text] of [
      [{...source,...options},['y=2','x=2']],
      [{...source,...options,numerator:['5/2','-3/2'],denominator:['-5/2','1']},['y=-3/2','x=5/2']],
    ]){
      const graphPlan=(await run('frame_graph',input)).graphPlan;
      const plan={capability:'rational-spike-v1',graphPlan,caption:'두 점근선과 유리함수의 개형',
        accessibilityDescription:'두 점선과 곡선의 두 가지가 표시되어 있다.'};
      const model=await run('graph',graphPlan);
      const spec=specFor(plan,model,identity.assetId);
      assert.equal(spec.axes,false);
      assert.deepEqual(spec.objects.slice(1).map(object=>object.text),text);
      const displayScale=320/spec.viewport.width;
      const typographyPolicy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:23,displayScale,fontFloorCssPx:11};
      let finalTransform;
      const worker=async(payload,workerOptions)=>{
        const reply=await pythonWorker(payload,workerOptions);
        if(payload.action==='build'&&reply.status==='OK'){
          const {aspectPolicy,...frame}=reply.result.witness.coordinateModel;
          finalTransform={...frame,displayScale:1};
        }
        return reply;
      };
      const result=await composeConstructionCandidate({plan,model,identity,typographyPolicy,browser,worker});
      assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));
      assert.equal(result.renderedLayout.status,'PASS');
      assert.match(result.svg,/<svg [^>]*role="img"/);
      assert.match(result.svg,/<title id="visual-title">두 점근선과 유리함수의 개형<\/title>/);
      assert.match(result.svg,/<desc id="visual-desc">두 점선과 곡선의 두 가지가 표시되어 있다.<\/desc>/);
      assert.doesNotMatch(result.svg,/data-role="(?:axis|tick)"|id="formula"/);

      const audit=async(svg,transform)=>{
        const reply=await pythonWorker({action:'graphAudit',graphPlan,svg,transform},{script:observer,timeoutMs:45000});
        assert.equal(reply.status,'OK',JSON.stringify(reply.result));
        return reply.result;
      };
      const auditUntampered=await audit(result.svg,finalTransform);
      assert.equal(auditUntampered.status,'PASS',JSON.stringify(auditUntampered.errors));
      const withAxis=result.svg.replace('</title>','</title><line data-role="axis" x1="0" x2="10" y1="0" y2="0"/>');
      assert.ok((await audit(withAxis,finalTransform)).errors.includes('RATIONAL_ASYMPTOTE_ONLY_AXES_OR_TICKS_PRESENT'));
      const withFormula=result.svg.replace('id="vertical-asymptote-label"','id="formula"');
      assert.ok((await audit(withFormula,finalTransform)).errors.includes('RATIONAL_ASYMPTOTE_ONLY_LABEL_INVENTORY_MISMATCH'));
      const wrongGlyph=result.svg.replace(/(id="vertical-asymptote-label"[\s\S]*?<path data-c=")[A-F0-9]+/,(_,prefix)=>prefix+'41');
      assert.notEqual(wrongGlyph,result.svg);
      assert.ok((await audit(wrongGlyph,finalTransform)).errors.includes('RATIONAL_ASYMPTOTE_ONLY_LABEL_MISMATCH:vertical-asymptote-label'));
      assert.ok((await audit(model.svg,model.transform)).errors.includes('RATIONAL_ASYMPTOTE_ONLY_LABEL_INVENTORY_MISMATCH'));

      const page=await browser.newPage({viewport:{width:320,height:Math.ceil(spec.viewport.height*displayScale)}});
      try{
        const display={width:320,height:spec.viewport.height*displayScale};
        const layout=analyzeRenderedLayout(await captureAtDisplaySize(page,result.svg,display,{publicationViewport:{width:1440,height:1000}}));
        assert.equal(layout.status,'PASS',JSON.stringify(layout.errors));
        assert.equal(layout.labelMeasurements.length,2);
        assert.ok(layout.labelMeasurements.every(label=>label.kind==='EQUATION_LABEL'&&label.finalViewportCssFontPx>=11));
      }finally{await page.close();}
    }
  }finally{await browser.close();}
});
