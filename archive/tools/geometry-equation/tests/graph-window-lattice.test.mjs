// E13 lattice points and E22 author display window / coordinate and length labels / line labels that move, on the single-curve graph path.
// The first group has no Chrome (frame -> model -> spec); the second renders the three real figures end to end through renderPlan
// (Chrome: run with --test-concurrency=1). Observer unit tests (including tampering) are in test_graph_window_lattice.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const base={family:'rational',numerator:['8','0'],denominator:['0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[0.8,9],viewport:[-0.5,9,-0.5,9]};
const LATTICE={capability:'rational-spike-v1',graphPlan:{...base,axisTickValues:{x:[1,2,3,4,5,6,7,8],y:[1,2,3,4,5,6,7,8]},displayWindow:[-1,9,-1,9],formulaLabel:'y=8/x',
  overlays:{latticePoints:{region:'BELOW_CURVE',xRange:[1,7],yMin:1,strict:true,counts:true}}},
  caption:'y=8/x의 그래프 아래쪽에서 xy<8을 만족하는 자연수 좌표 점을 x=1, 2, …, 7인 열마다 세면 7+3+2+1+1+1+1=16개이다.'};
const SQUARE={capability:'rational-spike-v1',graphPlan:{family:'rational',numerator:['42','0'],denominator:['0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-8,8],viewport:[-8,8,-8,8],
  displayWindow:[-9,3,-10,2],formulaLabel:'y=42/x',
  overlays:{points:[{id:'A',x:'-6',y:'-3',coordinates:true,labelDirection:'NW'},{id:'B',curveX:'-6',coordinates:true,labelDirection:'SW'},{id:'C',x:'-2',y:'-7',coordinates:true,labelDirection:'SE'},
    {id:'D',x:'-2',y:'-3',coordinates:true,labelDirection:'NE'},{id:'O',x:'0',y:'0'}],
    segments:[{id:'sAB',from:'A',to:'B',length:true,labelDirection:'W'},{id:'sBC',from:'B',to:'C'},{id:'sCD',from:'C',to:'D'},{id:'sDA',from:'D',to:'A',length:true,labelDirection:'N'},{id:'sOA',from:'O',to:'A'}]}},
  pointNames:{A:'A',B:'B',C:'C',D:'D',O:'O'},caption:'한 변이 4인 정사각형 ABCD에서 A(-6,-3)은 y=x/2 위에 있고, B(-6,-7)은 y=42/x 위에 있다.'};

const frame=async plan=>{
  const framed=await pythonWorker({action:'frame_graph',graphPlan:plan.graphPlan});assert.equal(framed.status,'OK',JSON.stringify(framed.result));
  const model=await pythonWorker({action:'graph',graphPlan:framed.result.graphPlan});assert.equal(model.status,'OK',JSON.stringify(model.result));
  return {framed:framed.result.graphPlan,spec:specFor({...plan,graphPlan:framed.result.graphPlan},model.result,'e13e22-test')};
};

test('the lattice reaches the spec as small unnamed dots and one count label per column',async()=>{
  const {spec}=await frame(LATTICE);
  const dots=spec.objects.filter(object=>object.id.startsWith('overlay-lattice-x')&&object.kind==='POINT');
  assert.equal(dots.length,16);
  assert.ok(dots.every(dot=>dot.name===null&&dot.markerRadius===2.4));
  assert.deepEqual(dots.find(dot=>dot.id==='overlay-lattice-x1y7').at,[1,7]);
  const counts=spec.objects.filter(object=>object.id.startsWith('overlay-lattice-count-x'));
  assert.deepEqual(counts.map(object=>object.text),['7','3','2','1','1','1','1']);
  // there is room below the x-axis in this window: the counts form a row under their columns
  assert.ok(counts.every(object=>object.at[1]===0&&object.directions.join()==='S'));
});

test('the window is the frame: axes as an object, tick values on a 1/2/5 grid when the plan names none, the formula where it is emptiest',async()=>{
  const plan={...LATTICE,graphPlan:{...LATTICE.graphPlan,overlays:{latticePoints:{region:'BELOW_CURVE',xRange:[1,7],yMin:1}}}};
  delete plan.graphPlan.axisTickValues;
  const {framed,spec}=await frame(plan);
  assert.deepEqual(framed.viewport.slice(0,2),[-1,9]);assert.equal(framed.plotCanvas.width,448);
  assert.deepEqual(spec.axes,{x:true,y:true});
  assert.deepEqual(spec.displayFacts.axisTickValues,{x:['2','4','6','8'],y:['2','4','6','8']});
  const formula=spec.objects.find(object=>object.id==='formula');
  assert.ok(formula.at[0]>2&&formula.at[1]>2,'the formula label stands in the empty upper right, not at the frame edge: '+formula.at);
  assert.equal(spec.objects.some(object=>object.id.startsWith('overlay-lattice-count-x')),false);
});

test('coordinate labels, segment lengths and unnamed points become exact label objects',async()=>{
  const plan={...SQUARE,graphPlan:{...SQUARE.graphPlan,overlays:{...SQUARE.graphPlan.overlays,points:[...SQUARE.graphPlan.overlays.points,{id:'X',x:'-4',y:'-1',unnamed:true},{id:'Y',x:'-3',y:'-1',unnamed:true,coordinates:true}]}}};
  const {spec}=await frame(plan);
  const byId=id=>spec.objects.find(object=>object.id===id);
  assert.equal(byId('A-coordinates').kind,'EQUATION_LABEL');assert.equal(byId('A-coordinates').text,'A(-6,-3)');assert.deepEqual(byId('A-coordinates').directions.slice(0,2),['NW','N']);
  assert.equal(byId('A').name,null);assert.equal(byId('O').name,'O');assert.equal(byId('X').name,null);
  assert.equal(byId('Y-coordinates').kind,'COORDINATE_LABEL');assert.deepEqual(byId('Y-coordinates').exact,['-3','-1']);
  assert.equal(byId('overlay-segment-sAB-length').text,'4');assert.equal(byId('overlay-segment-sAB-length').lineOwned,true);assert.equal(byId('overlay-segment-sAB-length').target,'overlay-segment-sAB');
  assert.equal(byId('overlay-segment-sBC-length'),undefined);
});

test('an overlay line label carries alternate anchors on its own line for the layout fallback',async()=>{
  const plan={capability:'rational-spike-v1',graphPlan:{family:'rational',numerator:['24','0'],denominator:['0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-24,24],viewport:[-24,24,-24,24],axisTickValues:{x:[],y:[]},formulaLabel:'y=24/x',
    overlays:{lines:[{id:'g',slope:'3/2',intercept:'0',label:'y=ax'},{id:'d',slope:'-7/2',intercept:'0',label:'y=cx'},{id:'v',x:'4'}]}},caption:'세 직선'};
  const {spec,framed}=await frame(plan);
  for(const id of ['g','d','v']){
    const label=spec.objects.find(object=>object.id==='overlay-line-'+id+'-equation');
    assert.equal(label.lineFallback,true);assert.ok(label.alternateAt.length>=3,id);
    const line=framed.overlaysFeatures.lines.find(row=>row.id===id);
    for(const [x,y] of label.alternateAt){
      assert.ok(x>framed.viewport[0]&&x<framed.viewport[1]&&y>framed.viewport[2]&&y<framed.viewport[3]);
      assert.ok(line.kind==='VERTICAL'?Math.abs(x-line.xValue)<1e-6:Math.abs(y-(line.slopeValue*x+line.interceptValue))<1e-6,'alternate anchor lies on its line: '+id);
    }
  }
});

test('axis titles reach the spec as displayFacts and are checked',async()=>{
  const plan={capability:'rational-spike-v1',graphPlan:{...base,viewport:[-1,9,-1,9],domain:[0.8,9],axisTickValues:{x:[],y:[]},displayWindow:[-1,9,-1,9],axisTitles:{x:'시간(분)',y:'거리(km)'}},caption:'제목이 붙은 축'};
  const {spec}=await frame(plan);
  assert.deepEqual(spec.displayFacts.axisTitles,{x:'시간(분)',y:'거리(km)'});
  const bad=async(titles,code)=>{
    const untitled={...plan.graphPlan};delete untitled.axisTitles;
    const {framed}=await frame({...plan,graphPlan:untitled});
    const model=await pythonWorker({action:'graph',graphPlan:framed});
    assert.throws(()=>specFor({...plan,graphPlan:{...framed,axisTitles:titles}},model.result,'axis-title-test'),new RegExp(code));
  };
  await bad({x:'$x$'},'AXIS_TITLE_INVALID:x');
  await bad({x:' 시간'},'AXIS_TITLE_INVALID:x');
  await bad({x:'가나다라마바사아자차카'},'AXIS_TITLE_INVALID:x');
  await bad({z:'가'},'AXIS_TITLES_INVALID');
  await bad({},'AXIS_TITLES_INVALID');
  await bad([],'AXIS_TITLES_INVALID');
});

test('refusals carry explicit codes',async()=>{
  const refuse=async graphPlan=>{const result=await pythonWorker({action:'frame_graph',graphPlan});assert.equal(result.status,'ERROR');return result.result.code;};
  assert.equal(await refuse({...LATTICE.graphPlan,displayWindow:[1,9,-1,9]}),'DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN');
  assert.equal(await refuse({...LATTICE.graphPlan,overlays:{latticePoints:{region:'BELOW_CURVE',xRange:[1,7],yMin:1,yMax:3}}}),'OVERLAY_LATTICE_BOUND_INVALID');
  assert.equal(await refuse({...LATTICE.graphPlan,overlays:{points:[{id:'P',x:'1',y:'1',coordinates:true,labelDirection:'UP'}]}}),'OVERLAY_LABEL_DIRECTION_INVALID:P');
});

test('the contract text and the guide state the new fields and their refusal codes',()=>{
  const text=contractText();
  for(const word of ['latticePoints','displayWindow','coordinates','length','labelDirection','unnamed','axisTitles','AXIS_TITLE_INVALID','OVERLAY_LATTICE_TOO_MANY','DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN','OVERLAY_COORDINATES_REQUIRE_INTEGERS','OVERLAY_SEGMENT_LENGTH_UNSUPPORTED'])assert.ok(text.includes(word),'contract text lacks '+word);
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const word of ['latticePoints','displayWindow','격자점','표시 창'])assert.ok(guide.includes(word),'guide lacks '+word);
});

const render=async(plan,name,item)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`e13e22-${name}-`));
  const result=await renderPlan({item:{...item,dir:'fig'},plan,outDir:out});
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  return fs.readFileSync(path.join(out,'fig-solution.svg'),'utf8');
};

test('q14: the sixteen lattice points and the column counts render, observed independently',{timeout:600000},async()=>{
  const svg=await render(LATTICE,'lattice',{sourcePath:'archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js',ordinal:14});
  assert.equal([...svg.matchAll(/<circle id="overlay-lattice-x\d+y\d+"/g)].length,16);
  assert.equal([...svg.matchAll(/<g id="overlay-lattice-count-x\d+"/g)].length,7);
});

test('q22: the square in a zoomed window with coordinates and side lengths renders',{timeout:600000},async()=>{
  const svg=await render(SQUARE,'square',{sourcePath:'archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js',ordinal:22});
  for(const id of ['A-coordinates','B-coordinates','C-coordinates','D-coordinates','overlay-segment-sAB-length','overlay-segment-sDA-length'])assert.ok(svg.includes(`id="${id}"`),id);
});

const LINES={capability:'rational-spike-v1',graphPlan:{family:'rational',numerator:['24','0'],denominator:['0','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-24,24],viewport:[-24,24,-24,24],
  displayWindow:[-9,13,-17,13],formulaLabel:'y=24/x',axisTickValues:{x:[],y:[]},
  overlays:{lines:[{id:'h',slope:'-1/2',intercept:'0'},{id:'g',slope:'3/2',intercept:'0',label:'y=ax'},{id:'d',slope:'-7/2',intercept:'0',label:'y=cx'},{id:'v',x:'4'}],
    points:[{id:'A',curveX:'4',coordinates:true},{id:'B',intersect:['h','v'],coordinates:true},{id:'C',intersect:['d','v'],coordinates:true},{id:'O',x:'0',y:'0'}],
    polygons:[{id:'tAC',points:['O','A','C'],fill:'LIGHT'},{id:'tAB',points:['O','A','B'],fill:'MEDIUM'}],segments:[{id:'sOA',from:'O',to:'A'},{id:'sOC',from:'O',to:'C'}]}},
  pointNames:{A:'A',B:'B',C:'C',O:'O'},caption:'직선 x=4 위의 세 점 A, B, C와 삼각형 AOB, AOC'};

test('q20: four lines (two steep ones through the origin) get their equations beside them, next to a polygon edge drawn over x=4',{timeout:600000},async()=>{
  const svg=await render(LINES,'lines',{sourcePath:'archive/exams/original/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학.js',ordinal:20});
  for(const id of ['h','g','d','v'])assert.ok(svg.includes(`id="overlay-line-${id}-equation"`),id);
  for(const id of ['A','B','C'])assert.ok(svg.includes(`id="${id}-coordinates"`),id);
});

test('q19: a trigonometric graph with Korean axis titles renders',{timeout:600000},async()=>{
  const plan={capability:'trigonometric-spike-v1',graphPlan:{family:'trigonometric',function:'COS',ratePi:'1/10',coefficients:['-27/2','33/2'],phasePi:'0',sourceDomain:{kind:'INTERVAL',range:['0','60'],states:['CLOSED','CLOSED']},
    domain:[0,60],viewport:[0,60,0,33],referenceLines:[{id:'h',y:'20',intersectionCount:6},{id:'m',y:'30',intersectionCount:3}],axisTickValues:{x:['10','20','30','40','50'],y:[]},axisTitles:{x:'시간(분)',y:'높이(m)'}},
    caption:'관람차의 높이는 10분, 30분, 50분에 최고 30m가 되고, 높이 20m인 경우는 60분 동안 6번이다.'};
  const svg=await render(plan,'titles',{sourcePath:'archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js',ordinal:19});
  assert.ok(svg.includes('id="axis-x"')&&svg.includes('data-text="시간(분)"'));assert.ok(svg.includes('data-text="높이(m)"'));
});
