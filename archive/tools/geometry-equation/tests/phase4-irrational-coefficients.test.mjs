import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';

const CAPABILITY='piecewise-polynomial-spike-v1';
// 26 Maesan H1 mid q11: y=x^2+kx+5 touches y=-3x+2 for k=-3+2*sqrt(3); the contact point T is a key point with irrational coordinates.
const TANGENT={family:'piecewise-polynomial',pieces:[{coefficients:['5','-3+2*sqrt(3)','1']}],sourceDomain:{kind:'ALL_REALS'},referenceLines:[{id:'l',slope:'-3',intercept:'2',intersectionX:['-sqrt(3)']}],requiredPoints:[{id:'V',x:'3/2-sqrt(3)',y:'-1/4+3*sqrt(3)'},{id:'T',x:'-sqrt(3)',y:'2+3*sqrt(3)'}],axisTickValues:{x:[],y:[]}};
// 24 Maesan H1 mid q23: the line of slope 6-2*sqrt(7) touches the right piece (irrational slope and intercept); the other crossing is a nested radical.
const BOUNDARY={family:'piecewise-polynomial',pieces:[{coefficients:['0','4','2']},{coefficients:['0','-2','-1']}],breakpoints:[{x:'-2',y:'0'}],sourceDomain:{kind:'ALL_REALS'},referenceLines:[{id:'l',slope:'6-2*sqrt(7)',intercept:'23-8*sqrt(7)',intersectionX:['(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2','-4+sqrt(7)']}],requiredPoints:[{id:'A',x:-2,y:0},{id:'T',x:'-4+sqrt(7)',y:'-15+6*sqrt(7)'},{id:'V',x:-1,y:1}],axisTickValues:{x:[],y:[]}};
// 23 Maesan H1 mid q11: horizontal line y=-11+4*sqrt(7) touching y=x^2+(-4+2*sqrt(7))x at its vertex.
const HORIZONTAL={family:'piecewise-polynomial',pieces:[{coefficients:['0','-4+2*sqrt(7)','1']}],sourceDomain:{kind:'ALL_REALS'},referenceLines:[{id:'l',y:'-11+4*sqrt(7)',intersectionX:['2-sqrt(7)']}],requiredPoints:[{id:'V',x:'2-sqrt(7)',y:'-11+4*sqrt(7)'},{id:'O',x:0,y:0},{id:'B',x:'4-2*sqrt(7)',y:0}],axisTickValues:{x:[],y:[]}};
// 24 Hyocheon H1 mid q22: a=2-sqrt(2) on [0,2], the surd end value and the two level lines.
const INTERVAL={family:'piecewise-polynomial',pieces:[{coefficients:['4-2*sqrt(2)','4-2*sqrt(2)','-1']}],sourceDomain:{kind:'INTERVAL',range:[0,2]},referenceLines:[{id:'M',y:'10-6*sqrt(2)',intersectionX:['2-sqrt(2)']},{id:'m',y:'8-6*sqrt(2)',intersectionX:['2']}],requiredPoints:[{id:'V',x:'2-sqrt(2)',y:'10-6*sqrt(2)'}],axisTickValues:{x:[],y:[]}};

async function framed(graphPlan,extra={}){
  const frame=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(frame.status,'OK',JSON.stringify(frame.result));
  const plan={capability:CAPABILITY,caption:'무리수 계수의 포물선',graphPlan:frame.result.graphPlan,...extra};
  const model=await pythonWorker({action:'graph',graphPlan:plan.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {plan,model:model.result};
}

test('the author contract names the irrational form, its error codes and the one-radical limit',()=>{
  const source=fs.readFileSync(new URL('../production/phase2.mjs',import.meta.url),'utf8');
  const fragments=[...source.matchAll(/extendedContract\+='([^']*)';/g)].map(match=>match[1]).join('');
  for(const text of ['p+q*sqrt(r)','PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED','PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED','PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED'])assert.ok(fragments.includes(text),text);
});

test('spec: surd coefficients are one parenthesised factor, the line label writes the surd slope and intercept, key points carry exact coordinates',async()=>{
  const b=await framed(BOUNDARY,{coordinatePlacement:'PANEL'}),spec=specFor(b.plan,b.model,'irrational-fixture');
  const line=spec.objects.find(object=>object.id==='line-l');
  assert.ok(Math.abs(line.coefficients[0]-(6-2*Math.sqrt(7)))<1e-12&&line.coefficients[1]===-1&&Math.abs(line.coefficients[2]-(23-8*Math.sqrt(7)))<1e-12);
  assert.equal(spec.objects.find(object=>object.id==='line-l-equation').text,'y=(6-2*sqrt(7))*x+(23-8*sqrt(7))');
  const tangent=await framed(TANGENT,{coordinatePlacement:'PANEL'}),tspec=specFor(tangent.plan,tangent.model,'irrational-fixture');
  assert.equal(tspec.objects.find(object=>object.id==='f-piece-1').expression,'x^2+(-3+2*sqrt(3))*x+5');
  const label=tspec.objects.find(object=>object.id==='required-point-2-coordinate-panel');
  assert.equal(label.text,'T(-sqrt(3),2+3*sqrt(3))');
  const prepared=(await pythonWorker({action:'prepare',spec:tspec})).result;
  assert.ok(prepared.labels.find(item=>item.id==='required-point-2-coordinate-panel').tex.includes('\\sqrt{3}'));
});

test('the engine refuses what is not p+q*sqrt(r), a second radical, a surd formula and a wrong key point',async()=>{
  const refuse=async(mutate,code)=>{const plan=structuredClone(TANGENT);mutate(plan);const result=await pythonWorker({action:'frame_graph',graphPlan:plan});assert.notEqual(result.status,'OK');assert.match(JSON.stringify(result.result),new RegExp(code));};
  await refuse(plan=>{plan.pieces[0].coefficients[1]='sqrt(2)+sqrt(3)';},'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED');
  await refuse(plan=>{plan.pieces[0].coefficients[1]='sqrt(sqrt(3))';},'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED');
  await refuse(plan=>{plan.referenceLines[0].intercept='2+sqrt(2)';},'PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED');
  await refuse(plan=>{plan.formula='x^2+5';},'PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED');
  await refuse(plan=>{plan.requiredPoints[1].y='3+3*sqrt(3)';},'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:T');
  await refuse(plan=>{plan.referenceLines[0].intersectionX=['sqrt(3)'];},'PIECEWISE_POLY_INTERSECTION_MISMATCH:l');
});

test('L1 composes the four irrational fixtures and the final SVG passes the static, layout and graph observers',{timeout:900000},async()=>{
  const identity=assetIdentity('26_매산고_1학기_중간_고1_기출c|11','SOLUTION_VISUAL');
  const policy={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass:'full',displayScale:0.5823,cssTargetFontPx:12.25,fontFloorCssPx:11,comfortCssPx:.25,minimumBaseFontPx:21,maximumBaseFontPx:32,baseFontPx:21.1,rounding:'CEIL_TO_TENTH_BASE_PX'};
  for(const graphPlan of [TANGENT,BOUNDARY,HORIZONTAL,INTERVAL]){
    const {plan,model}=await framed(graphPlan,{coordinatePlacement:'PANEL'});
    const composed=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
    assert.equal(composed.graphAudit?.status??'PASS','PASS');
  }
});
