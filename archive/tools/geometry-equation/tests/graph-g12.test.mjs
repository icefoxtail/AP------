// G12: the spec objects of graph callouts, colour groups, hidden key points, the discontinuous curve name / axis variable, the rational asymptote label and the
// coordinate-pair display name. No Chrome: framing, the model spec and the semantic engine's primitives are the unit boundary.
import test from 'node:test';import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {parsePointName,pointNameModel,pointNameTex,pointNameText} from '../production/point-names.mjs';
import {expectedNameTokens,planNameExpectations} from '../production/point-name-observer.mjs';

const prepare=async plan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  const full={...plan,graphPlan:framed.result.graphPlan};return {framed:framed.result.graphPlan,spec:specFor(full,model.result,'g12-test')};
};
const cubic=extra=>({capability:'piecewise-polynomial-spike-v1',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['3','-2','0','1']}],sourceDomain:{kind:'ALL_REALS'},axisTickValues:{x:[],y:[]},
  requiredPoints:[{id:'M',x:'-sqrt(6)/3',y:'3+4*sqrt(6)/9',marker:'NONE'},{id:'N',x:'sqrt(6)/3',y:'3-4*sqrt(6)/9'}],coordinateBand:{hide:['M','N']},
  overlays:{lines:[{id:'t',slope:'1',intercept:'1',color:'WARM'}],points:[{id:'A',curveX:'1',unnamed:true},{id:'B',curveX:'-1',unnamed:true},{id:'C',x:'0',y:'0',unnamed:true}],
    segments:[{id:'s',from:'A',to:'B',color:'BLUE'}],polygons:[{id:'T',points:['A','B','C'],fill:'VIOLET'}],
    callouts:[{id:'ca',point:'A',text:'접점',direction:'SE'},{id:'cn',point:'N',text:'f(a)',direction:'E'}]}},caption:'g12',...extra});

test('callouts become leader-only labels owned by their dot, and a hidden key point draws nothing',async()=>{
  const {spec}=await prepare(cubic());
  const text=spec.objects.find(object=>object.id==='overlay-callout-ca'),math=spec.objects.find(object=>object.id==='overlay-callout-cn');
  assert.deepEqual([text.kind,text.target,text.ringLeader,text.leaderOnly,text.labelKind,text.text],['EQUATION_LABEL','A',true,true,'TEXT','접점']);
  assert.equal(text.directions[0],'SE');
  assert.deepEqual([math.target,math.labelKind,math.text],['required-point-2',undefined,'f(a)']);
  const hidden=spec.objects.find(object=>object.id==='required-point-1');
  assert.deepEqual([hidden.kind,hidden.marker,hidden.name],['POINT','NONE',null]);
  assert.ok(!spec.objects.some(object=>object.id.startsWith('required-point-1-')));
  // the curve is sampled exactly at the callout dot so the layout takes the curve through it as the dot's own stroke
  const curve=spec.objects.find(object=>object.kind==='FUNCTION_GRAPH');assert.ok(curve.criticalX.includes(1));
});

test('colours reach the engine primitives: line, segment, polygon tint plus outline, curve',async()=>{
  const {spec}=await prepare(cubic({graphPlan:{...cubic().graphPlan,curveColor:'GREEN'}}));
  const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const primitive=id=>response.result.prepared.primitives.find(row=>row.id===id);
  assert.equal(primitive('overlay-line-t').stroke,'#b85c00');assert.equal(primitive('overlay-line-t').strokeWidth,2.4);
  assert.equal(primitive('overlay-segment-s').stroke,'#1f5fa8');
  assert.deepEqual([primitive('overlay-polygon-T-fill').fill,primitive('overlay-polygon-T-fill').fillOpacity],['#a78bdb',0.42]);
  assert.equal(primitive('overlay-polygon-T').stroke,'#6b46b3');
  assert.equal(primitive('f-piece-1-branch-0').stroke,'#2e7d32');
});

test('a colour that is not in the palette is refused with its code',async()=>{
  const bad=cubic();bad.graphPlan.overlays.lines[0].color='RED';
  const framed=await pythonWorker({action:'frame_graph',graphPlan:bad.graphPlan});
  assert.equal(framed.status,'ERROR');assert.equal(framed.result.code,'OVERLAY_COLOR_INVALID:t');
});

test('without a colour field the overlay keeps its gray tint and black strokes',async()=>{
  const plain=cubic();delete plain.graphPlan.overlays.lines[0].color;delete plain.graphPlan.overlays.segments[0].color;plain.graphPlan.overlays.polygons[0].fill='LIGHT';delete plain.graphPlan.overlays.callouts;
  const {spec}=await prepare(plain);const response=await pythonWorker({action:'prepare',spec});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const primitive=id=>response.result.prepared.primitives.find(row=>row.id===id);
  assert.equal(primitive('overlay-line-t').stroke,undefined);assert.equal(primitive('overlay-polygon-T-fill').fill,'#e4e7ec');assert.equal(primitive('overlay-polygon-T-fill').fillOpacity,undefined);
});

test('a discontinuous curve name follows nameLabel and axisVariable',async()=>{
  const plan={capability:'piecewise-discontinuous-spike-v1',graphPlan:{family:'piecewise-discontinuous',functionName:'g',pieces:[{coefficients:['2'],domain:[null,-2],end:'OPEN'},{coefficients:['1'],domain:[-2,null],start:'OPEN'}],
    jumpValues:[{x:'-2',y:'1'}],requiredPoints:[],axisTickValues:{x:[-2],y:[1,2]},axisVariable:'m',nameLabel:{at:'END',side:'ABOVE'}},caption:'g12'};
  const {framed,spec}=await prepare(plan);const name=spec.objects.find(object=>object.id==='main-curve-name');
  assert.equal(name.text,'g(m)');assert.equal(spec.displayFacts.axisVariable,'m');
  const plain=structuredClone(plan);delete plain.graphPlan.nameLabel;delete plain.graphPlan.axisVariable;
  const base=await prepare(plain);
  const old=base.spec.objects.find(object=>object.id==='main-curve-name');assert.equal(old.text,'g(x)');assert.ok(name.at[0]>old.at[0]);   // END is right of the old place near the left end
  assert.equal(framed.nameLabel.at,'END');
});

test('the rational asymptote label moves to the end of its line, away from the curve',async()=>{
  const plan=at=>({capability:'rational-spike-v1',graphPlan:{family:'rational',numerator:['0','6'],denominator:['-2','3'],sourceDomain:{kind:'ALL_REALS'},domain:[-6,10],viewport:[-6,10,-4,8],axisTickValues:{x:[],y:[]},...(at?{asymptoteLabelAt:at}:{})},caption:'g12'});
  const label=async at=>(await prepare(plan(at))).spec.objects.find(object=>object.id==='horizontal-asymptote-label');
  const old=await label(undefined),end=await label('END'),start=await label('START');
  assert.ok(old.at[1]>2);assert.equal(old.directions,undefined);                                          // the old place (above the line, no direction list) is unchanged
  assert.ok(end.at[0]>old.at[0]&&end.at[1]===2);assert.deepEqual(end.directions[0],'S');                 // the curve is above the line at the right end, so the label goes below
  assert.ok(start.at[0]<old.at[0]);assert.deepEqual(start.directions[0],'N');                            // and above it at the left end
});

test('a coordinate-pair display name is read as a name and keeps its glyphs',()=>{
  assert.deepEqual(parsePointName('(2,k)'),{coord:['2','k']});assert.deepEqual(parsePointName('( a , -1 )'),{coord:['a','-1']});
  for(const bad of ['(2,3)','(2,)','2,k','(2,kk)','(2,k','(1000,k)','P_1x'])assert.equal(parsePointName(bad)===null||bad==='P_1x'&&parsePointName(bad)===null,true,bad);
  assert.equal(pointNameTex(parsePointName('(2,k)')),'(2,k)');assert.equal(pointNameText(parsePointName('(a,-1)')),'(a,-1)');
  assert.equal(parsePointName('T_1').letter,'T');                                                          // the old names are untouched
  assert.deepEqual(expectedNameTokens('(2,k)').map(token=>token.c),['28','32','2C','1D458','29']);
  assert.deepEqual(expectedNameTokens('(a,-1)').map(token=>token.c),['28','1D44E','2C','2212','31','29']);
  assert.equal(expectedNameTokens('(2,3)'),null);
  const model=pointNameModel({pointNames:{P:'(2,k)',Q:'Q'}},['P','Q']);
  assert.equal(model.coord('P'),true);assert.equal(model.coord('Q'),false);assert.equal(model.tex('P'),'(2,k)');
  assert.throws(()=>pointNameModel({pointNames:{P:'(2,3)'}},['P']),/POINT_DISPLAY_NAME_INVALID:P/);
});

test('a hidden key point and a callout owner are left out of the name read-back',()=>{
  const plan={graphPlan:{requiredPoints:[{id:'M',x:0,y:0,marker:'NONE'},{id:'N',x:1,y:1}],overlays:{points:[{id:'P'}]}},pointNames:{M:'M',N:'N',P:'(2,k)'}};
  assert.deepEqual(planNameExpectations(plan),[{owner:'required-point-2',name:'N'},{owner:'P',name:'(2,k)'}]);
});
