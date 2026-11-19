// Reference lines of a piecewise-polynomial figure (referenceLines) name themselves at their own right end, never as rows of a header band on top of the figure
// (several equations stacked there cannot be told apart, and their order can read as the reverse of the lines). Composed and rendered end to end through renderPlan
// (Chrome: run with --test-concurrency=1). Also: an overlay point whose coordinates find no room is tied to its point by a leader instead of failing the figure.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const QUARTIC={capability:'piecewise-polynomial-spike-v1',caption:'사차함수의 그래프와 두 수평선이 만나는 점을 나타낸 그림이다.',graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['12','24','22','8','1']}],breakpoints:[],
  sourceDomain:{kind:'ALL_REALS'},domain:[-4,0],viewport:[-4,0,2,13],
  requiredPoints:[{id:'E0',x:'-3',y:'3'},{id:'E1',x:'-2',y:'4'},{id:'E2',x:'-1',y:'3'}],axisTickValues:{x:[],y:[]},
  referenceLines:[{id:'lower',y:'3',intersectionX:['-3','-1']},{id:'upper',y:'4',intersectionX:['-2-sqrt(2)','-2','-2+sqrt(2)']}]}};
const EXP={capability:'exponential-affine-spike-v1',caption:'지수함수와 두 수평선, 한 점의 함숫값을 나타낸 그림이다.',graphPlan:{family:'exponential-affine',base:'2',coefficients:['1','1','2'],sourceDomain:{kind:'ALL_REALS'},
  domain:[-3,3],viewport:[-3,3.5,-0.5,10],axisTickValues:{x:[],y:[]},
  overlays:{lines:[{id:'l5',slope:'0',intercept:'5',label:'y=5'},{id:'l3',slope:'0',intercept:'3',label:'y=3'}],points:[{id:'P',curveX:'-1',coordinates:true}]}}};
const QUADRATIC={capability:'polynomial-spike-v1',caption:'이차함수의 그래프와 꼭짓점을 지나는 직선 두 개를 나타낸 그림이다.',graphPlan:{family:'polynomial',coefficients:['0','-2','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-1,3],viewport:[-1,3,-2,5],
  requiredPoints:[{id:'V',x:1,y:-1},{id:'O',x:0,y:0}],axisTickValues:{x:[],y:[]},
  lines:[{id:'t',slope:'0',intercept:'-1',through:['V'],tangentAt:'V'},{id:'m',slope:'-1',intercept:'0',through:['O']}]}};
const item=(ordinal,exam='22_복성고_2학기_기말_고2_수학II',dir='rl')=>({sourcePath:`archive/exams/original/high/h2/2final/${exam}.js`,ordinal,dir});
const render=async(plan,it)=>{const out=fs.mkdtempSync(path.join(os.tmpdir(),'ref-line-labels-'));const result=await renderPlan({item:it,plan,outDir:out});return {result,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,it.dir+'-solution.svg'),'utf8'):''};};
const attr=(tag,name)=>tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

test('referenceLines labels stand at the right end of their own lines, in the order of the lines',{timeout:600000},async()=>{
  const {result,svg}=await render(QUARTIC,item(15));
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const lineY=id=>Number(attr(svg.match(new RegExp(`<line [^>]*id="line-${id}"[^>]*>`))[0],'y1'));
  const labelAt=id=>{const tag=svg.match(new RegExp(`<g id="line-${id}-equation"[^>]*>`))?.[0];assert.ok(tag,'label '+id);const m=/translate\(([-\d.]+) ([-\d.]+)\)/.exec(attr(tag,'transform'));return {x:Number(m[1]),y:Number(m[2])};};
  const lowerLine=lineY('lower'),upperLine=lineY('upper');
  assert.ok(upperLine<lowerLine,'the line y=4 is drawn above y=3');
  const lower=labelAt('lower'),upper=labelAt('upper');
  // each label is within 60 px (vertically) of its own line and nearer its own line than the other one
  assert.ok(Math.abs(lower.y-lowerLine)<60&&Math.abs(upper.y-upperLine)<60,JSON.stringify({lower,upper,lowerLine,upperLine}));
  assert.ok(Math.abs(lower.y-lowerLine)<Math.abs(lower.y-upperLine),'the label of y=3 belongs to y=3');
  assert.ok(Math.abs(upper.y-upperLine)<Math.abs(upper.y-lowerLine),'the label of y=4 belongs to y=4');
  assert.ok(upper.y<lower.y,'the labels keep the order of the lines');
  // not in a header band on top of the figure: both stand at the height of the lines, not above the plot
  assert.ok(upper.y>upperLine-70,'no header row');
});

test('the coordinates of an overlay point with no free place beside it are tied to the point by a leader',{timeout:600000},async()=>{
  const {result,svg}=await render(EXP,item(15,undefined,'ex'));
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const leader=svg.match(/<line [^>]*data-owner-label="P-coordinates"[^>]*>/)?.[0];
  assert.ok(leader,'a leader ties the coordinates to P');assert.equal(attr(leader,'data-role'),'leader');assert.equal(attr(leader,'data-owner'),'P');
  assert.ok(svg.includes('id="P-coordinates"'),'the label is kept');
});

test('graphPlan.lines of a polynomial (header band figure) name themselves at the end of their lines too',{timeout:600000},async()=>{
  const {result,svg}=await render(QUADRATIC,item(15,undefined,'pl'));
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  const lineY=id=>Number(attr(svg.match(new RegExp(`<line [^>]*id="line-${id}"[^>]*>`))[0],'y1'));
  const at=id=>{const tag=svg.match(new RegExp(`<g id="line-${id}-equation"[^>]*>`))?.[0];assert.ok(tag,'label '+id);const m=/translate\(([-\d.]+) ([-\d.]+)\)/.exec(attr(tag,'transform'));return {x:Number(m[1]),y:Number(m[2])};};
  const width=Number(svg.match(/<svg [^>]*viewBox="0 0 ([\d.]+)/)[1]);
  const tangent=at('t');
  assert.ok(Math.abs(tangent.y-lineY('t'))<60,'the label of the horizontal line stands beside it');
  assert.ok(tangent.x>width*.6,'at the right end of the line');
});
