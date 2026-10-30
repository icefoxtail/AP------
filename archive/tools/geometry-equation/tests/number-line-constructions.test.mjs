// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1 (E35): compass constructions (numberLine.constructions) and exact surd values of marked points. The engine recomputes the radius and the landing
// points exactly; the independent observer re-derives the circle (centre, radius, landing point, sweep) from the plan and checks the final SVG.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,numberLineFigureSpec,figureLayout,expandNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`construction-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const clone=value=>JSON.parse(JSON.stringify(value));
const pts=(list,extra={})=>({kind:'POINTS',points:list.map(([id,value,more])=>({id,value,...(more||{})})),...extra});
const con=(id,center,radius,side,...hits)=>({id,center,radius:{value:radius},arc:{side},hits:hits.map(([hit,branch])=>({id:hit,branch}))});

// 21 금당중 1학기 중간 중3 q21 (golden item29): arcs round A(-5) and C(1) with the radii 2*sqrt(5) and sqrt(5) land on P and Q.
const item29={rows:[pts([['A','-5'],['P','-5+2*sqrt(5)'],['C','1'],['Q','1+sqrt(5)']])],
  constructions:[con('cA','A','2*sqrt(5)','RIGHT',['P','RIGHT']),con('cC','C','sqrt(5)','RIGHT',['Q','RIGHT'])]};
// a compass round the origin cuts the line on both sides: -sqrt(2) and sqrt(2)
const both={axisVariable:false,rows:[pts([['L','-sqrt(2)'],['O','0',{hideName:true}],['R','sqrt(2)']])],constructions:[con('k','O','sqrt(2)','BOTH',['L','LEFT'],['R','RIGHT'])]};
// an integer radius round a fractional centre, leftwards
const left={rows:[pts([['A','3/2'],['B','-3/2'],['C','4']])],constructions:[con('x','A','3','LEFT',['B','LEFT'])]};

test('the engine keeps the radius and the landing points exact; a plan without constructions has none in its model',()=>{
  const m=solveNumberLineFigure(item29);
  assert.deepEqual(m.rows[0].points.map(point=>[point.id,point.value,point.tex]),[['A','-5','-5'],['P','-5+2*sqrt(5)','-5+2\\sqrt{5}'],['C','1','1'],['Q','1+sqrt(5)','1+\\sqrt{5}']]);
  assert.deepEqual(m.rows[0].constructions.map(c=>[c.id,c.center,c.radius.value,c.side,c.hits]),[['cA','A','2*sqrt(5)','RIGHT',[{id:'P',branch:'RIGHT'}]],['cC','C','sqrt(5)','RIGHT',[{id:'Q',branch:'RIGHT'}]]]);
  const b=solveNumberLineFigure(both);
  assert.deepEqual(b.rows[0].constructions[0].hits,[{id:'L',branch:'LEFT'},{id:'R',branch:'RIGHT'}]);
  const l=solveNumberLineFigure(left);
  assert.equal(l.rows[0].constructions[0].radius.value,'3');
  const plain=solveNumberLineFigure({rows:[pts([['A','-2'],['B','4']])]});
  assert.ok(!('constructions' in plain.rows[0]));
  // surd values of marked points are exact and ordered exactly: sqrt(2) and 1+sqrt(2) and 3 on one line
  const surd=solveNumberLineFigure({rows:[pts([['A','sqrt(2)'],['B','-1+sqrt(2)'],['C','3']])]});
  assert.deepEqual(surd.rows[0].points.map(point=>[point.value,point.tex]),[['sqrt(2)','\\sqrt{2}'],['-1+sqrt(2)','-1+\\sqrt{2}'],['3','3']]);
  // the plan's own keys: the golden plan shape is accepted by the one-panel composite expansion
  const expanded=expandNumberLineFigure({capability:'number-line-figure-v1',numberLine:item29,numberLineCaption:{text:'옮긴 호'},caption:'c',sourceConditions:[],newVisualInformation:[]});
  assert.equal(expanded.panels[0].plan.numberLine.constructions.length,2);
});

test('the layout keeps room over a row with arcs and a plan without them keeps its height',()=>{
  const plain=figureLayout(solveNumberLineFigure({rows:[item29.rows[0]]})),withArcs=figureLayout(solveNumberLineFigure(item29));
  assert.ok(withArcs.height>plain.height+30,'the head grows by the room of the tallest arc');
  assert.ok(withArcs.rows[0].axisY>plain.rows[0].axisY+30);
});

test('constructions that cannot be drawn faithfully are refused with their codes',()=>{
  const plan=(cons,rows=[pts([['A','0'],['P','4'],['Q','-4'],['C','9']])])=>solveNumberLineFigure({rows,constructions:cons});
  const good=con('c1','A','4','RIGHT',['P','RIGHT']);
  assert.doesNotThrow(()=>plan([good]));
  for(const bad of [[],'x',7,null,[good,good],[{...good,extra:1}],[{...good,id:'A1'}],[{...good,id:'x-y'}],[good,good,good,good,good].map((c,i)=>({...c,id:'c'+i}))])assert.throws(()=>plan(bad),code('NUMBER_LINE_CONSTRUCTION_INVALID'),JSON.stringify(bad));
  assert.throws(()=>plan([good],[{kind:'SET',pieces:[{lo:{value:'0',state:'OPEN'},hi:{value:'1',state:'OPEN'}}]}]),code('NUMBER_LINE_CONSTRUCTION_NEEDS_POINTS_ROW'));
  const two=[pts([['A','0'],['P','4']]),pts([['A','0'],['P','4']])];
  assert.throws(()=>plan([good],two),code('NUMBER_LINE_CONSTRUCTION_ROW_AMBIGUOUS'));
  assert.doesNotThrow(()=>plan([{...good,row:2}],two));
  for(const row of [0,3,'1',1.5])assert.throws(()=>plan([{...good,row}],two),code('NUMBER_LINE_CONSTRUCTION_ROW_INVALID'),String(row));
  assert.throws(()=>plan([{...good,row:1}],[{kind:'SET',pieces:[{lo:{value:'0',state:'OPEN'},hi:{value:'1',state:'OPEN'}}]},pts([['A','0'],['P','4']])]),code('NUMBER_LINE_CONSTRUCTION_ROW_INVALID'));
  // the centre and every hit are drawn numeric points of the row, and a hit is not the centre
  for(const bad of [con('c1','Z','4','RIGHT',['P','RIGHT']),con('c1','A','4','RIGHT',['Z','RIGHT']),con('c1','A','4','RIGHT',['A','RIGHT']),con('c1',7,'4','RIGHT',['P','RIGHT'])])assert.throws(()=>plan([bad]),code('NUMBER_LINE_CONSTRUCTION_POINT_UNKNOWN'),JSON.stringify(bad));
  for(const bad of ['0','-4','1.5','four','sqrt(-1)',4,null])assert.throws(()=>plan([{...good,radius:{value:bad}}]),code('NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID'),JSON.stringify(bad));
  assert.throws(()=>plan([{...good,radius:{value:'4',unit:1}}]),code('NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID'));
  assert.throws(()=>plan([{...good,radius:'4'}]),code('NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID'));
  for(const bad of [{side:'UP'},{side:'right'},{},{side:'RIGHT',extra:1},'RIGHT',null])assert.throws(()=>plan([{...good,arc:bad}]),code('NUMBER_LINE_CONSTRUCTION_ARC_INVALID'),JSON.stringify(bad));
  // the hit must be exactly centre +- radius: 4 is right of 0 by 4, not by 3 and not on the left
  assert.throws(()=>plan([con('c1','A','3','RIGHT',['P','RIGHT'])]),code('NUMBER_LINE_CONSTRUCTION_HIT_MISMATCH'));
  assert.throws(()=>plan([con('c1','A','4','LEFT',['P','LEFT'])]),code('NUMBER_LINE_CONSTRUCTION_HIT_MISMATCH'));
  assert.doesNotThrow(()=>plan([con('c1','A','4','LEFT',['Q','LEFT'])]));
  // the sides the arc covers need their hits: BOTH needs two, LEFT or RIGHT exactly its own
  assert.doesNotThrow(()=>plan([con('c1','A','4','BOTH',['P','RIGHT'],['Q','LEFT'])]));
  for(const bad of [con('c1','A','4','BOTH',['P','RIGHT']),con('c1','A','4','RIGHT',['Q','LEFT']),con('c1','A','4','RIGHT',['P','RIGHT'],['Q','LEFT']),con('c1','A','4','BOTH',['P','RIGHT'],['P','RIGHT']),{...good,hits:[]},{...good,hits:'P'}])assert.throws(()=>plan([bad]),code('NUMBER_LINE_CONSTRUCTION_HITS_INCOMPLETE'),JSON.stringify(bad));
  // an exact surd radius lands exactly: sqrt(8) is 2*sqrt(2); sqrt(3) is not sqrt(2) (different radicals are told apart on 40 decimals, never confused); a radius and a centre with different radicals
  // can not be added exactly
  assert.doesNotThrow(()=>solveNumberLineFigure({rows:[pts([['A','0'],['P','2*sqrt(2)']])],constructions:[con('c1','A','sqrt(8)','RIGHT',['P','RIGHT'])]}));
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','0'],['P','sqrt(3)']])],constructions:[con('c1','A','sqrt(2)','RIGHT',['P','RIGHT'])]}),code('NUMBER_LINE_CONSTRUCTION_HIT_MISMATCH'));
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','sqrt(2)'],['P','sqrt(3)+sqrt(2)']])],constructions:[con('c1','A','sqrt(3)','RIGHT',['P','RIGHT'])]}),code('NUMBER_LINE_RADICALS_MIXED'));
  // the points of one row may use different radicals (the spiral): ordered exactly, a coincidence still detected
  const spiral=solveNumberLineFigure({rows:[pts([['P','sqrt(3)'],['O','0'],['Q','sqrt(2)'],['R','-sqrt(5)'],['S','1+sqrt(2)']])]});
  assert.deepEqual(spiral.rows[0].points.map(point=>point.value),['sqrt(3)','0','sqrt(2)','-sqrt(5)','1+sqrt(2)']);
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','sqrt(8)'],['B','2*sqrt(2)']])]}),code('NUMBER_LINE_POINTS_COINCIDE'));
  // arcs go over the row: a span above it has no room
  assert.throws(()=>plan([good],[pts([['A','0'],['P','4'],['Q','-4']],{spans:[{from:'A',to:'P',style:'ARROW'}]})]),code('NUMBER_LINE_CONSTRUCTION_SPAN_ABOVE'));
  assert.doesNotThrow(()=>plan([good],[pts([['A','0'],['P','4'],['Q','-4']],{spans:[{from:'A',to:'P'}]})]));
  // an arc can not be round a letter point or land on one
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','0'],['P','4']]),{kind:'POINTS',points:[{id:'a',between:['0','1']},{id:'B',value:'1'},{id:'C',value:'0'}]}],constructions:[{...good,row:2,center:'a'}]}),code('NUMBER_LINE_CONSTRUCTION_POINT_UNKNOWN'));
  // a surd point that is not a division endpoint
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'sqrt(2)'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['1','2']}}]}]}),code('NUMBER_LINE_DIVISION_INVALID'));
});

test('an arc too small to see is refused when the figure is laid out',()=>{
  const tiny={rows:[pts([['A','0'],['P','1/100'],['C','9']])],constructions:[con('c1','A','1/100','RIGHT',['P','RIGHT'])]};
  const model=solveNumberLineFigure(tiny);
  assert.throws(()=>numberLineFigureSpec({capability:'number-line-v1',numberLine:tiny},model),code('NUMBER_LINE_CONSTRUCTION_ARC_TOO_SMALL'));
});

test('golden item29: two arcs round A and C land on P and Q, the surd labels read back, the observer re-derives every circle',async()=>{
  const composed=await compose(item29,'item29');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="construction-arc"/g)||[]).length,2);
  assert.match(svg,/id="r1-con-cA-right"[^>]*data-center="A" data-hit="P" data-branch="RIGHT" data-radius="2\*sqrt\(5\)"/);
  assert.match(svg,/id="r1-con-cC-right"[^>]*data-center="C" data-hit="Q" data-branch="RIGHT" data-radius="sqrt\(5\)"/);
  assert.ok(svg.includes('data-tex="\\displaystyle -5+2\\sqrt{5}"')&&svg.includes('data-tex="\\displaystyle 1+\\sqrt{5}"'),'the surd labels');
  assert.ok(!/data-tex="\\displaystyle -?\d*\.\d/.test(svg),'no decimal value is written');
  const pass=await audit(svg,item29);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // geometry, read independently from the SVG: the arc of cA is the circle of radius 2*sqrt(5) units round A, starting on the line at P
  const attr=(tag,name)=>Number((new RegExp(`${name}="([-\\d.e]+)"`)).exec(tag)[1]);
  const dot=id=>svg.match(new RegExp(`<circle id="r1-pt-${id}"[^>]*>`))[0];
  const arc=svg.match(/<path id="r1-con-cA-right"[^>]*>/)[0],[,x0,y0,rx,,,x1,y1]=/ d="M ([\d.]+) ([\d.]+) A ([\d.]+) ([\d.]+) 0 0 ([01]) ([\d.]+) ([\d.]+)"/.exec(arc).map(Number);
  const root=svg.match(/<svg[^>]*>/)[0],unit=(attr(root,'data-px-right')-attr(root,'data-px-left'))/(attr(root,'data-unit-right')-attr(root,'data-unit-left'));
  assert.ok(Math.abs(rx-2*Math.sqrt(5)*unit)<0.01,'radius in px');
  assert.ok(Math.abs(x0-attr(dot('P'),'cx'))<0.01&&Math.abs(y0-attr(dot('P'),'cy'))<0.01,'starts on the line at P');
  assert.ok(Math.abs(Math.hypot(x1-attr(dot('A'),'cx'),y1-attr(dot('A'),'cy'))-rx)<0.02,'ends on the same circle round A');
  assert.ok(y1<y0-20,'rises over the line');
});

test('tamper: a wrong radius, centre, landing point, sweep, label side or a missing arc make the observer fail',async()=>{
  const {svg}=await compose(item29,'tamper');
  const pathOf=id=>new RegExp(`(<path id="${id}"[^>]*? d=")M ([\\d.]+) ([\\d.]+) A ([\\d.]+) ([\\d.]+) 0 0 ([01]) ([\\d.]+) ([\\d.]+)(")`);
  const change=(id,fn)=>svg.replace(pathOf(id),(m,head,x0,y0,rx,ry,sweep,x1,y1,tail)=>{const v=fn({x0:+x0,y0:+y0,rx:+rx,ry:+ry,sweep,x1:+x1,y1:+y1});return `${head}M ${v.x0} ${v.y0} A ${v.rx} ${v.ry} 0 0 ${v.sweep} ${v.x1} ${v.y1}${tail}`;});
  const cA='r1-con-cA-right';
  assert.ok(has(await audit(change(cA,v=>({...v,rx:v.rx+3,ry:v.ry+3})),item29),'NL_CONSTRUCTION_ARC_RADIUS'));
  assert.ok(has(await audit(change(cA,v=>({...v,x0:v.x0+4})),item29),'NL_CONSTRUCTION_ARC_NOT_AT_HIT'));
  assert.ok(has(await audit(change(cA,v=>({...v,x1:v.x1-6})),item29),'NL_CONSTRUCTION_ARC_CENTER'));
  assert.ok(has(await audit(change(cA,v=>({...v,sweep:v.sweep==='0'?'1':'0'})),item29),'NL_CONSTRUCTION_ARC_SWEEP'));
  assert.ok(has(await audit(change(cA,v=>({...v,y1:v.y0+10})),item29),'NL_CONSTRUCTION_ARC_'),'an arc dipping under the line is not an arc over it');
  assert.ok(has(await audit(svg.replace(/<g data-layer="50"><path id="r1-con-cC-right"[^>]*\/><\/g>/,''),item29),'NL_CONSTRUCTION_ARC_COUNT'));
  // the arc says other things than the plan: its centre, its hit, its radius text
  assert.ok(has(await audit(svg.replace('data-center="A"','data-center="C"'),item29),'NL_CONSTRUCTION_ARC_ATTRIBUTES'));
  assert.ok(has(await audit(svg.replace('data-radius="2*sqrt(5)"','data-radius="sqrt(20)+1"'),item29),'NL_CONSTRUCTION_ARC_RADIUS_TEXT'));
  // the landing dot moved off the arc's start, or its value text changed
  assert.ok(has(await audit(svg.replace(/(<circle id="r1-pt-P"[^>]*? cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+6)),item29),'NL_CONSTRUCTION_ARC_NOT_AT_HIT'));
  assert.ok(has(await audit(svg.replace('data-value="-5+2*sqrt(5)"','data-value="-5+sqrt(21)"'),item29),'NL_POINT_VALUE'));
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-P-value"[^>]*?data-tex=")[^"]*/,'$1\\displaystyle -5+\\sqrt{21}'),item29),'NL_POINT_VALUE_LABEL'));
  // the name of the landing point must stand on the side away from the arc, not over it
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-P-name"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)-20)),item29),'NL_CONSTRUCTION_NAME_SIDE'));
  // the plan decides: another radius makes the landing point wrong; another centre likewise; none asks for no arc
  const radius=clone(item29);radius.constructions[0].radius.value='sqrt(20)+1';
  const wrongRadius=await audit(svg,radius);
  assert.ok(has(wrongRadius,'NL_CONSTRUCTION_HIT_VALUE')&&has(wrongRadius,'NL_CONSTRUCTION_ARC_RADIUS'));
  const centre=clone(item29);centre.constructions[0].center='C';
  assert.ok(has(await audit(svg,centre),'NL_CONSTRUCTION_HIT_VALUE'));
  const none=clone(item29);delete none.constructions;
  assert.ok(has(await audit(svg,none),'NL_CONSTRUCTION_ARC_COUNT'));
  const equal=await audit(svg,item29);assert.equal(equal.status,'PASS');
});

test('an arc on both sides, an integer radius to the left and surd point values compose, label sides follow the arcs, the observer passes',async()=>{
  const b=await compose(both,'both');
  assert.equal(b.status,'COMPOSED',JSON.stringify(b.detail));assert.equal(b.renderedLayout.status,'PASS');
  assert.equal((b.svg.match(/data-role="construction-arc"/g)||[]).length,2);
  assert.match(b.svg,/id="r1-con-k-left"/);assert.match(b.svg,/id="r1-con-k-right"/);
  assert.equal((await audit(b.svg,both)).status,'PASS');
  // the left landing point's name stands to the left of its dot, the right one's to the right
  const box=id=>{const m=new RegExp(`id="${id}"[^>]*?transform="translate\\(([-\\d.]+) ([-\\d.]+)\\)"`).exec(b.svg);return +m[1];};
  const cx=id=>+new RegExp(`<circle id="${id}"[^>]*? cx="([-\\d.]+)"`).exec(b.svg)[1];
  assert.ok(box('r1-pt-R-name')>=cx('r1-pt-R'));assert.ok(box('r1-pt-L-name')<cx('r1-pt-L'));
  const l=await compose(left,'left');
  assert.equal(l.status,'COMPOSED',JSON.stringify(l.detail));assert.match(l.svg,/id="r1-con-x-left"/);
  assert.equal((await audit(l.svg,left)).status,'PASS');
  const surd={rows:[pts([['A','sqrt(2)'],['B','-1+sqrt(2)'],['C','3']])]};
  const s=await compose(surd,'surd');
  assert.equal(s.status,'COMPOSED',JSON.stringify(s.detail));
  assert.ok(s.svg.includes('data-tex="\\displaystyle \\sqrt{2}"')&&s.svg.includes('data-tex="\\displaystyle -1+\\sqrt{2}"'));
  assert.equal((await audit(s.svg,surd)).status,'PASS');
  assert.ok(has(await audit(s.svg.replace('data-value="sqrt(2)"','data-value="sqrt(3)"'),surd),'NL_POINT_VALUE'));
  assert.ok(has(await audit(s.svg.replace(/(<circle id="r1-pt-A"[^>]*? cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+5)),surd),'NL_POINT_POSITION'));
});

test('an arc that runs through a label or another dot is refused when composing',async()=>{
  // the arc round 0 of radius 4 rises over 4, bending left. A point so near its landing point that the arc starts on its dot:
  const onDot={rows:[pts([['A','0',{hideName:true,showValue:false}],['P','4',{hideName:true,showValue:false}],['D','39/10',{hideName:true,showValue:false}],['C','-3']])],constructions:[con('c1','A','4','RIGHT',['P','RIGHT'])]};
  assert.equal((await compose(onDot,'on-dot')).status,'NUMBER_LINE_CONSTRUCTION_ARC_ON_DOT');
  // a value written high over a point left of the landing point is crossed by the arc
  const onLabel={rows:[pts([['A','0'],['P','4'],['D','18/5',{valueSide:'ABOVE'}],['C','-3']])],constructions:[con('c1','A','4','RIGHT',['P','RIGHT'])]};
  assert.equal((await compose(onLabel,'on-label')).status,'NUMBER_LINE_CONSTRUCTION_ARC_ON_LABEL');
});

// The source of the radius (item29's own picture): the segments AB and CD on a lattice that stands on the line, one cell one unit; the arcs run from their ends down to P and Q.
const withSource={axisVariable:false,rows:[pts([['A','-5'],['P','-5+2*sqrt(5)',{showValue:false}],['C','1'],['Q','1+sqrt(5)',{showValue:false}]],{band:false})],
  constructions:[{...con('cA','A','2*sqrt(5)','RIGHT',['P','RIGHT']),source:{grid:true,from:[-5,0],to:[-1,2],toName:'B'}},{...con('cC','C','sqrt(5)','RIGHT',['Q','RIGHT']),source:{grid:true,from:[1,0],to:[3,1],toName:'D'}}]};
// the textbook square: the diagonal of the unit square is sqrt(2); the arc round 0 runs from the end of the diagonal down to sqrt(2) (and a plain arc on the other side)
const square={axisVariable:false,rows:[pts([['L','-sqrt(2)',{hideName:true}],['O','0',{hideName:true}],['R','sqrt(2)',{hideName:true}]],{band:false})],
  constructions:[{...con('k','O','sqrt(2)','BOTH',['L','LEFT'],['R','RIGHT']),source:{grid:true,from:[0,0],to:[1,1]}}]};

test('a source grid: the engine checks the segment length against the radius exactly and keeps room for the lattice',()=>{
  const m=solveNumberLineFigure(withSource);
  assert.deepEqual(m.rows[0].constructions.map(c=>c.source),[{from:[-5,0],to:[-1,2],toName:'B'},{from:[1,0],to:[3,1],toName:'D'}]);
  assert.ok(figureLayout(m).rows[0].head>=figureLayout(solveNumberLineFigure({...withSource,constructions:withSource.constructions.map(({source,...rest})=>rest)})).rows[0].head,'a lattice needs at least the head of its arcs');
  // a source given as integer strings, the unit square, a source without the end's name
  assert.doesNotThrow(()=>solveNumberLineFigure({...square}));
  const strings=clone(withSource);strings.constructions[0].source.from=['-5','0'];strings.constructions[0].source.to=['-1','2'];assert.doesNotThrow(()=>solveNumberLineFigure(strings));
  assert.ok(!('toName' in solveNumberLineFigure(square).rows[0].constructions[0].source));
});

test('sources that cannot be drawn faithfully are refused with their codes',()=>{
  const make=source=>solveNumberLineFigure({...withSource,constructions:[{...withSource.constructions[0],source}]});
  const good=withSource.constructions[0].source;
  assert.doesNotThrow(()=>make(good));
  for(const bad of ['x',7,null,[],{...good,grid:false},{...good,grid:'yes'},{from:good.from,to:good.to},{...good,extra:1},{...good,from:[-4,0]},{...good,from:[-5,1]},{...good,from:[-5]},{...good,from:'-5,0'},{...good,to:[-1,0]},{...good,to:[-5,2]},{...good,to:[-1,-2]},{...good,to:[-1.5,2]},{...good,to:[-1,'two']},{...good,to:[11,2]},{...good,to:[-1,13]},{...good,toName:'b'},{...good,toName:'A'},{...good,toName:'P'},{...good,toName:7},{...good,toName:'BC'}])
    assert.throws(()=>make(bad),code('NUMBER_LINE_CONSTRUCTION_SOURCE_INVALID'),JSON.stringify(bad));
  // the segment of the picture must be the radius exactly: (4,2) is 2*sqrt(5), (4,3) is 5
  for(const to of [[-1,3],[-2,2],[0,2]])assert.throws(()=>make({...good,to}),code('NUMBER_LINE_CONSTRUCTION_SOURCE_LENGTH_MISMATCH'),JSON.stringify(to));
  // a centre that is not an integer, a letter point or a surd cannot stand on the lattice
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','3/2'],['P','7/2']])],constructions:[{...con('k','A','2','RIGHT',['P','RIGHT']),source:{grid:true,from:[1,0],to:[1,2]}}]}),code('NUMBER_LINE_CONSTRUCTION_SOURCE_INVALID'));
  // a lattice as high as its segment: too tall to draw
  assert.throws(()=>numberLineFigureSpec({capability:'number-line-v1',numberLine:tall},solveNumberLineFigure(tall)),code('NUMBER_LINE_CONSTRUCTION_SOURCE_TOO_TALL'));
});
const tall={rows:[pts([['O','0'],['R','13']])],constructions:[{...con('k','O','13','RIGHT',['R','RIGHT']),source:{grid:true,from:[0,0],to:[5,12]}}]};

test('item29 with its source grids composes; the observer recomputes the segments, the lattice and the arcs that end on them',async()=>{
  const composed=await compose(withSource,'source');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="source-segment"/g)||[]).length,2);
  assert.equal((svg.match(/data-role="grid-line"/g)||[]).length,(5+2)+(3+1),'verticals and horizontals of the 4x2 and the 2x1 lattice');
  assert.match(svg,/id="r1-src-cA" data-role="source-segment"[^>]*data-from="-5,0" data-to="-1,2"/);
  assert.ok(svg.includes('data-tex="B"')&&svg.includes('data-tex="D"'));
  assert.equal((await audit(svg,withSource)).status,'PASS');
  // the arc round A ends on B: its end is the end of the segment
  const seg=svg.match(/<line id="r1-src-cA"[^>]*>/)[0],arc=svg.match(/<path id="r1-con-cA-right"[^>]*>/)[0];
  const x2=+/ x2="([\d.]+)"/.exec(seg)[1],y2=+/ y2="([\d.]+)"/.exec(seg)[1];
  const [,x1,y1]=/ d="M [\d.]+ [\d.]+ A [\d.]+ [\d.]+ 0 0 [01] ([\d.]+) ([\d.]+)"/.exec(arc).map(Number);
  assert.ok(Math.abs(x1-x2)<0.01&&Math.abs(y1-y2)<0.01);
  const sq=await compose(square,'square');
  assert.equal(sq.status,'COMPOSED',JSON.stringify(sq.detail));
  assert.equal((await audit(sq.svg,square)).status,'PASS');
});

test('tamper: a wrong segment, lattice, arc end, length or name make the observer fail',async()=>{
  const {svg}=await compose(withSource,'source-tamper');
  const bad=async(mutated,plan,prefix,message)=>assert.ok(has(await audit(mutated,plan),prefix),message||prefix);
  const segment=id=>new RegExp(`(<line id="${id}" data-role="source-segment"[^>]*? )(x1|y1|x2|y2)="([\\d.]+)"`);
  await bad(svg.replace(segment('r1-src-cA'),(m,head,name,value)=>head+name+'="'+(Number(value)+5)+'"'),withSource,'NL_CONSTRUCTION_SOURCE_SEGMENT');
  await bad(svg.replace(/<line id="r1-src-cA-v-?\w+" data-role="grid-line"[^>]*\/>/,''),withSource,'NL_CONSTRUCTION_SOURCE_GRID_COUNT');
  await bad(svg.replace(/(<line id="r1-src-cA-h1"[^>]*? y1=")([\d.]+)/,(m,head,y)=>head+(Number(y)-3)),withSource,'NL_CONSTRUCTION_SOURCE_GRID_LINE');
  await bad(svg.replace('data-to="-1,2"','data-to="-1,3"'),withSource,'NL_CONSTRUCTION_SOURCE_ATTRIBUTES');
  // the arc no longer ends on the segment's end
  await bad(svg.replace(/(<path id="r1-con-cA-right"[^>]*? d="M [\d.]+ [\d.]+ A [\d.]+ [\d.]+ 0 0 [01] )([\d.]+)/,(m,head,x)=>head+(Number(x)+4)),withSource,'NL_CONSTRUCTION_ARC_NOT_AT_SOURCE');
  // the name of the end: wrong letter, moved over the lattice
  await bad(svg.replace('data-tex="B"','data-tex="E"'),withSource,'NL_CONSTRUCTION_SOURCE_NAME');
  await bad(svg.replace(/(id="r1-src-cA-name"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)-30)),withSource,'NL_CONSTRUCTION_SOURCE_NAME_PLACE');
  // the centre's name must keep off the lattice (the segment leaves its dot to the right)
  await bad(svg.replace(/(id="r1-pt-A-name"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)+14)),withSource,'NL_CONSTRUCTION_NAME_SIDE');
  // the plan says other things: another length, no source at all, a source that does not start at the centre
  const longer=clone(withSource);longer.constructions[0].source.to=[-1,3];
  await bad(svg,longer,'NL_CONSTRUCTION_SOURCE_LENGTH');
  const none=clone(withSource);delete none.constructions[1].source;
  await bad(svg,none,'NL_CONSTRUCTION_SOURCE_COUNT');
  const off=clone(withSource);off.constructions[0].source.from=[-4,0];
  await bad(svg,off,'NL_CONSTRUCTION_SOURCE_PLAN');
  const noName=clone(withSource);delete noName.constructions[0].source.toName;
  await bad(svg,noName,'NL_CONSTRUCTION_SOURCE_NAME_UNEXPECTED');
  assert.equal((await audit(svg,withSource)).status,'PASS');
});

// A chained construction (21 금당중 1학기 중간 중3 q9): the diagonal OA of the unit square is the radius of the first arc (to P); a perpendicular BP=1 is raised at P; the hypotenuse OB is the radius of the second arc (to Q).
const spiral={axisVariable:false,rows:[pts([['O','0'],['P','sqrt(2)',{showValue:false}],['Q','sqrt(3)',{showValue:false}]],{band:false})],
  constructions:[{...con('c1','O','sqrt(2)','RIGHT',['P','RIGHT']),source:{grid:true,from:[0,0],to:[1,1],toName:'A'}},{...con('c2','O','sqrt(3)','RIGHT',['Q','RIGHT']),source:{perpendicular:{at:'P',height:'1',toName:'B'}}}]};

test('a chained construction: the perpendicular and the hypotenuse of its right triangle are checked exactly, points may use different radicals',()=>{
  const m=solveNumberLineFigure(spiral);
  assert.deepEqual(m.rows[0].constructions[1].source,{perpendicular:{at:'P',height:{value:'1',approx:1},toName:'B'}});
  assert.deepEqual(m.rows[0].points.map(point=>point.tex),['0','\\sqrt{2}','\\sqrt{3}']);
  assert.ok(figureLayout(m).rows[0].head>=figureLayout(solveNumberLineFigure({...spiral,constructions:spiral.constructions.map(({source,...rest})=>rest)})).rows[0].head);
  // a surd height: the right triangle 1, sqrt(3), 2
  assert.doesNotThrow(()=>solveNumberLineFigure({rows:[pts([['O','0'],['A','1'],['R','2']])],constructions:[{...con('k','O','2','RIGHT',['R','RIGHT']),source:{perpendicular:{at:'A',height:'sqrt(3)'}}}]}));
  const refuse=(source,codeName)=>assert.throws(()=>solveNumberLineFigure({...spiral,constructions:[spiral.constructions[0],{...spiral.constructions[1],source}]}),code(codeName),JSON.stringify(source));
  const good=spiral.constructions[1].source;
  for(const bad of [{perpendicular:'P'},{perpendicular:{at:'P'}},{perpendicular:{...good.perpendicular,extra:1}},{...good,grid:true},{perpendicular:{...good.perpendicular,at:'Z'}},{perpendicular:{...good.perpendicular,at:'O'}},{perpendicular:{...good.perpendicular,at:7}},
    {perpendicular:{...good.perpendicular,height:'0'}},{perpendicular:{...good.perpendicular,height:'-1'}},{perpendicular:{...good.perpendicular,height:'1.5'}},{perpendicular:{...good.perpendicular,toName:'a'}},{perpendicular:{...good.perpendicular,toName:'A'}},{perpendicular:{...good.perpendicular,toName:'Q'}},{perpendicular:{...good.perpendicular,toName:7}}])
    refuse(bad,'NUMBER_LINE_CONSTRUCTION_SOURCE_INVALID');
  // the hypotenuse must be the radius exactly: sqrt(2+1) is sqrt(3), not sqrt(2+4) nor 2
  for(const height of ['2','sqrt(2)','1/2'])refuse({perpendicular:{...good.perpendicular,height}},'NUMBER_LINE_CONSTRUCTION_SOURCE_LENGTH_MISMATCH');
  refuse({perpendicular:{at:'Q',height:'1'}},'NUMBER_LINE_CONSTRUCTION_SOURCE_LENGTH_MISMATCH');
  // one end name is written once, whatever source it belongs to
  assert.throws(()=>solveNumberLineFigure({...spiral,constructions:[spiral.constructions[0],{...spiral.constructions[1],source:{perpendicular:{...good.perpendicular,toName:'A'}}}]}),code('NUMBER_LINE_CONSTRUCTION_SOURCE_INVALID'));
  // too tall to draw
  const tall2={rows:[pts([['O','0'],['A','5'],['R','13']])],constructions:[{...con('k','O','13','RIGHT',['R','RIGHT']),source:{perpendicular:{at:'A',height:'12'}}}]};
  assert.throws(()=>numberLineFigureSpec({capability:'number-line-v1',numberLine:tall2},solveNumberLineFigure(tall2)),code('NUMBER_LINE_CONSTRUCTION_SOURCE_TOO_TALL'));
});

test('the chained construction composes: both arcs end on their sources, the right angle is marked, the observer recomputes it all',async()=>{
  const composed=await compose(spiral,'spiral');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  for(const role of ['source-perpendicular','source-hypotenuse','source-right-angle','source-segment'])assert.equal((svg.match(new RegExp(`data-role="${role}"`,'g'))||[]).length,1,role);
  assert.match(svg,/id="r1-src-c2-perp" data-role="source-perpendicular"[^>]*data-at="P" data-height="1"/);
  assert.ok(svg.includes('data-tex="A"')&&svg.includes('data-tex="B"'));
  assert.equal((await audit(svg,spiral)).status,'PASS');
  // the second arc ends on the tip of the perpendicular
  const perp=svg.match(/<line id="r1-src-c2-perp"[^>]*>/)[0],arc=svg.match(/<path id="r1-con-c2-right"[^>]*>/)[0];
  const x2=+/ x2="([\d.]+)"/.exec(perp)[1],y2=+/ y2="([\d.]+)"/.exec(perp)[1];
  const [,x1,y1]=/ d="M [\d.]+ [\d.]+ A [\d.]+ [\d.]+ 0 0 [01] ([\d.]+) ([\d.]+)"/.exec(arc).map(Number);
  assert.ok(Math.abs(x1-x2)<0.01&&Math.abs(y1-y2)<0.01);
});

test('tamper: a wrong perpendicular, hypotenuse, right angle, height or name make the observer fail',async()=>{
  const {svg}=await compose(spiral,'spiral-tamper');
  const bad=async(mutated,plan,prefix)=>assert.ok(has(await audit(mutated,plan),prefix),prefix);
  const attr=(id,name,fn)=>svg.replace(new RegExp(`(<line id="${id}"[^>]*? ${name}=")([\\d.]+)`),(m,head,value)=>head+fn(Number(value)));
  await bad(attr('r1-src-c2-perp','y2',v=>v+6),spiral,'NL_CONSTRUCTION_SOURCE_SEGMENT');
  await bad(attr('r1-src-c2-hyp','x1',v=>v+6),spiral,'NL_CONSTRUCTION_SOURCE_SEGMENT');
  await bad(svg.replace(/(<path id="r1-src-c2-right"[^>]*? d="M )([\d.]+)/,(m,head,x)=>head+(Number(x)-4)),spiral,'NL_CONSTRUCTION_SOURCE_RIGHT_ANGLE');
  await bad(svg.replace('data-height="1"','data-height="2"'),spiral,'NL_CONSTRUCTION_SOURCE_ATTRIBUTES');
  await bad(svg.replace('data-at="P"','data-at="Q"'),spiral,'NL_CONSTRUCTION_SOURCE_ATTRIBUTES');
  await bad(svg.replace(/<path id="r1-src-c2-right"[^>]*\/>/,''),spiral,'NL_CONSTRUCTION_SOURCE_MISSING');
  await bad(svg.replace(/(<path id="r1-con-c2-right"[^>]*? d="M [\d.]+ [\d.]+ A [\d.]+ [\d.]+ 0 0 [01] [\d.]+ )([\d.]+)/,(m,head,y)=>head+(Number(y)+5)),spiral,'NL_CONSTRUCTION_ARC_NOT_AT_SOURCE');
  await bad(svg.replace('data-tex="B"','data-tex="C"'),spiral,'NL_CONSTRUCTION_SOURCE_NAME');
  await bad(svg.replace(/(id="r1-src-c2-name"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)-30)),spiral,'NL_CONSTRUCTION_SOURCE_NAME_PLACE');
  const taller=clone(spiral);taller.constructions[1].source.perpendicular.height='2';
  await bad(svg,taller,'NL_CONSTRUCTION_SOURCE_LENGTH');
  const elsewhere=clone(spiral);elsewhere.constructions[1].source.perpendicular.at='Q';
  await bad(svg,elsewhere,'NL_CONSTRUCTION_SOURCE_LENGTH');
  const none=clone(spiral);delete none.constructions[1].source;
  await bad(svg,none,'NL_CONSTRUCTION_SOURCE_COUNT');
  assert.equal((await audit(svg,spiral)).status,'PASS');
});

test('a lattice line through the name of another point is refused when composing',async()=>{
  const crossed={rows:[pts([['A','-5'],['E','-3'],['P','-5+2*sqrt(5)',{showValue:false}]],{band:false})],constructions:[{...con('cA','A','2*sqrt(5)','RIGHT',['P','RIGHT']),source:{grid:true,from:[-5,0],to:[-1,2]}}]};
  assert.equal((await compose(crossed,'crossed')).status,'NUMBER_LINE_CONSTRUCTION_SOURCE_ON_LABEL');
});

test('a plan without constructions or letter points draws exactly as before',async()=>{
  const plain={rows:[pts([['A','-2'],['B','4']])]};
  const composed=await compose(plain,'plain');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!/construction|data-symbol|tick-mark/.test(composed.svg));
  assert.ok(/data-value="-2"/.test(composed.svg));
  assert.equal((await audit(composed.svg,plain)).status,'PASS');
});
