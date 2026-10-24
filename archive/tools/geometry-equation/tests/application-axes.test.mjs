import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const CAPABILITY='polynomial-spike-v1';
// 21 Jeil H1 mid q22: daily profit P(n)=-600(n-2)^2+38400 against the number of price cuts n in [0,10]: 0..10 on one axis, 0..38400 on the other.
const PROFIT={family:'polynomial',coefficients:['36000','2400','-600'],domain:[0,10],viewport:[0,10,0,40000],sourceDomain:{kind:'INTERVAL',range:[0,10]},requiredPoints:[{id:'V',x:2,y:38400}],applicationAxes:true,axisVariable:'n',axisTickValues:{x:[2,4,6,8,10],y:[10000,20000,30000]}};
// 24 Hyocheon H1 mid q11: the largest area S=(P/4)^2 a rectangle of perimeter P can have, with a line S=300.
const AREA={family:'polynomial',coefficients:['0','0','1/16'],domain:[0,130],viewport:[0,130,0,1100],sourceDomain:{kind:'INTERVAL',range:[0,130]},requiredPoints:[{id:'A',x:60,y:225},{id:'B',x:100,y:625},{id:'C',x:120,y:900}],lines:[{id:'l',slope:'0',intercept:'300',through:[]}],applicationAxes:true,axisVariable:'P',axisTickValues:{x:[20,40,60,80,100,120],y:[200,400,600,800,1000]}};

const frame=async graphPlan=>pythonWorker({action:'frame_graph',graphPlan});
const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};

test('application axes: each axis gets its own scale, far from one to one, and the ticks stay the author real values',async()=>{
  for(const graphPlan of [PROFIT,AREA]){
    const result=await frame(graphPlan);assert.equal(result.status,'OK',JSON.stringify(result.result));
    const fitted=result.result.graphPlan,[xmin,xmax,ymin,ymax]=fitted.viewport,canvas=fitted.plotCanvas;
    assert.equal(fitted.applicationAxes,true);assert.equal(fitted.overviewPolicy,'POLYNOMIAL_INTERVAL_OVERVIEW_v1');assert.deepEqual(fitted.axisTickValues,graphPlan.axisTickValues);
    const sx=canvas.width/(xmax-xmin),sy=canvas.height/(ymax-ymin);
    assert.ok(Math.abs(sy/sx-fitted.axisRatio)<1e-9&&fitted.axisRatio<.5,'ratio '+fitted.axisRatio);// not an equal-unit or squeezed figure
    assert.ok(xmin<0&&xmax>graphPlan.domain[1]&&ymin<0&&ymax>Math.max(...graphPlan.requiredPoints.map(point=>point.y)));
  }
});

test('application axes are refused unless the graph is a quadratic on a restricted interval with 1-2-5 ticks inside the view',async()=>{
  const refuse=async(mutate,code)=>{const plan=structuredClone(PROFIT);mutate(plan);const result=await frame(plan);assert.notEqual(result.status,'OK');assert.match(JSON.stringify(result.result),new RegExp(code));};
  await refuse(plan=>{plan.sourceDomain={kind:'ALL_REALS'};},'APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL');
  await refuse(plan=>{plan.coefficients=['0','0','1','1'];},'APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL');
  await refuse(plan=>{plan.applicationAxes='yes';},'INVALID_APPLICATION_AXES');
  await refuse(plan=>{plan.axisSqueeze=true;},'INVALID_APPLICATION_AXES');
  await refuse(plan=>{delete plan.axisTickValues;},'APPLICATION_AXES_TICKS_INVALID:x');
  await refuse(plan=>{plan.axisTickValues={x:[],y:[]};},'APPLICATION_AXES_TICKS_INVALID:x');
  await refuse(plan=>{plan.axisTickValues.y=[10000,20000,35000];},'APPLICATION_AXES_TICKS_INVALID:y');// not an arithmetic progression
  await refuse(plan=>{plan.axisTickValues.x=[3,6,9];},'APPLICATION_AXES_TICKS_INVALID:x');// step 3 is not 1, 2 or 5 times a power of ten
  await refuse(plan=>{plan.axisTickValues.y=[10000,20000,30000,90000];},'APPLICATION_AXES_TICKS_INVALID:y');
  // Without the flag a pure math graph keeps one scale (or at most a halved one): the profit curve is refused as too narrow.
  const plain=structuredClone(PROFIT);delete plain.applicationAxes;plain.axisTickValues={x:[],y:[]};
  const equal=await frame(plain);assert.notEqual(equal.status,'OK');assert.match(JSON.stringify(equal.result),/EQUAL_UNIT_CURVE_TOO_NARROW/);
});

test('L1 composes both application figures and the graph observer checks the declared per-axis scales and ticks',{timeout:900000},async()=>{
  const identity=assetIdentity('21_제일고_1학기_중간_고1_기출|22','SOLUTION_VISUAL');
  for(const graphPlan of [PROFIT,AREA]){
    const result=await frame(graphPlan);assert.equal(result.status,'OK');
    const plan={capability:CAPABILITY,caption:'응용 문제의 축',graphPlan:result.result.graphPlan,coordinatePlacement:'PANEL'};
    const model=await pythonWorker({action:'graph',graphPlan:plan.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
    const composed=await composeConstructionCandidate({plan,model:model.result,identity,typographyPolicy:policy});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');assert.equal(composed.graphAudit?.status??'PASS','PASS');
    // The observer refuses a plan whose ticks or scales are not the declared ones, even when it reaches it past the framer.
    const tampered={...plan,graphPlan:{...plan.graphPlan,axisTickValues:{x:[3,6,9],y:plan.graphPlan.axisTickValues.y}}};
    const bad=await composeConstructionCandidate({plan:tampered,model:model.result,identity,typographyPolicy:policy}).catch(error=>({status:'THROWN',detail:String(error.message)}));
    assert.ok(bad.status!=='COMPOSED'||bad.graphAudit?.status==='FAIL',JSON.stringify(bad.graphAudit??bad.detail));
  }
});
