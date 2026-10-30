// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E36): NORMAL_CURVE, the bell curve of N(mean, sd^2) drawn from the exact density, with marked positions, shaded areas (a tail when one end is null), the area labels the
// problem gives (a table value, a sum of table values, a letter for equal areas), symmetric pairs about a mean, framed curves (letters for mean and sd, drawn in σ units) and a z row.
// The independent observer re-derives the curves, ticks, shades and areas from the plan and checks the final SVG bytes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,110));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[result.code]).some(error=>error.startsWith(prefix));
const caught=result=>result.status!=='PASS';                                    // the observer fails the figure or refuses a plan that does not describe it

// 23 팔마고 q9: N(50, 4), 47 <= X <= 52 split at the mean, a z row
const split={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'50',sd:'2',label:'X'}],ticks:['47','50','52'],zAxis:true,
  shades:[{from:'47',to:'50'},{from:'50',to:'52'}],areaLabels:[{shade:0,text:'0.4332'},{shade:1,text:'0.3413'}]};
// 22 순천고 q7: two curves, two tails of equal area (a letter), the unknown position k
const twin={kind:'NORMAL_CURVE',span:'2.5',curves:[{id:'X',mean:'10',sd:'6',label:'X',meanLine:true},{id:'Y',mean:'28',sd:'6',label:'Y',meanLine:true}],
  ticks:['10','13',{x:'25',text:'k'},'28'],shades:[{curve:'X',from:null,to:'13'},{curve:'Y',from:'k',to:null,tone:2}],areaLabels:[{shade:0,text:'p'},{shade:1,text:'p'}]};
// 23 팔마고 q8: a framed curve (letters), a symmetric pair that is not the mean's own numbers
const framed={kind:'NORMAL_CURVE',curves:[{id:'X',mean:'m',sd:'σ'}],ticks:[{z:'-1',text:'17'},{z:'0'},{z:'1',text:'23'}],
  shades:[{from:null,to:'17'},{from:'23',to:null}],areaLabels:[{shade:0,text:'p'},{shade:1,text:'p'}],symmetry:[{pair:['17','23']}]};
// 23 팔마고 q17: three curves of one shape
const three={kind:'NORMAL_CURVE',curves:[{id:'A',mean:'0',sd:'5',label:'k=0'},{id:'B',mean:'5',sd:'5',label:'k=5',meanLine:true},{id:'C',mean:'10',sd:'5',label:'k=10'}],
  ticks:['0','5','10'],shades:[{curve:'A',from:'0',to:'10'},{curve:'C',from:'0',to:'10',tone:2}],symmetry:[{curve:'B',pair:['0','10']}]};

test('the engine derives the window, the sorted ticks with their texts and the exact areas',()=>{
  const m=solveStatChart(split);
  assert.equal(m.kind,'NORMAL_CURVE');assert.equal(m.framed,false);assert.deepEqual(m.window,{lo:'42',hi:'58'});
  assert.deepEqual(m.ticks.map(t=>[t.pos,t.text,t.z]),[['47','47','-1.5'],['50','50','0'],['52','52','1']]);
  assert.deepEqual(m.shades.map(s=>[s.from,s.to,s.label]),[['47','50','0.4332'],['50','52','0.3413']]);
  assert.ok(Math.abs(m.shades[0].area-0.433193)<1e-6&&Math.abs(m.shades[1].area-0.341345)<1e-6,'the areas are the integrals of the density');
  const t=solveStatChart(twin);
  assert.deepEqual(t.window,{lo:'-5',hi:'43'});assert.deepEqual(t.ticks.map(x=>x.text),['10','13','k','28']);   // k sits at 25: sorted by position
  assert.ok(Math.abs(t.shades[0].area-t.shades[1].area)<1e-5,'P(X<=13)=P(Y>=25) are equal areas');
  const f=solveStatChart(framed);
  assert.equal(f.framed,true);assert.deepEqual(f.window,{lo:'-4',hi:'4'});assert.deepEqual(f.ticks.map(x=>[x.pos,x.text]),[['-1','17'],['0','m'],['1','23']]);
  assert.deepEqual(f.symmetry,[{curve:'X',pair:['-1','1']}]);
  // a framed curve writes its own letters on the marks it is not told a text for
  const g=solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'m',sd:'σ'}],ticks:[{z:'-3'},{z:'0'},{z:'1.5'}]});
  assert.deepEqual(g.ticks.map(x=>x.text),['m-3σ','m','m+1.5σ']);
  const h=solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'20',sd:'σ'}],ticks:[{z:'-1.5',text:'k'},{z:'0'}],shades:[{from:'k',to:'20'}],areaLabels:[{shade:0,text:'0.4332'}]});
  assert.deepEqual(h.ticks.map(x=>x.text),['k','20']);
  // numeric ticks may also be given as a z offset of their curve
  assert.deepEqual(solveStatChart({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'320',sd:'8'}],ticks:[{z:'0.5'},'320']}).ticks.map(x=>x.pos),['320','324']);
  assert.ok(statChartSize(m).height>200);
});

test('normal-curve plans that cannot be drawn faithfully are refused with their codes',()=>{
  const c=(extra={})=>({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'50',sd:'2'}],ticks:['47','50','52'],...extra});
  refuse({kind:'NORMAL_CURVE'},'STAT_NORMAL_CURVE_INVALID');
  refuse(c({curves:[]}),'STAT_NORMAL_CURVE_INVALID');
  refuse(c({curves:[{id:'A',mean:'0',sd:'1'},{id:'B',mean:'1',sd:'1'},{id:'C',mean:'2',sd:'1'},{id:'D',mean:'3',sd:'1'}]}),'STAT_NORMAL_CURVE_INVALID');
  refuse(c({curves:[{id:'X',mean:'50',sd:'2'},{id:'X',mean:'51',sd:'2'}]}),'STAT_NORMAL_CURVE_INVALID');
  refuse(c({curves:[{id:'X',mean:'50',sd:'2',extra:1}]}),'STAT_NORMAL_CURVE_INVALID');
  refuse(c({curves:[{id:'X',mean:'50',sd:'0'}]}),'STAT_NORMAL_SD_INVALID');refuse(c({curves:[{id:'X',mean:'50',sd:'-2'}]}),'STAT_NORMAL_SD_INVALID');
  refuse(c({curves:[{id:'X',mean:'50',sd:'sigma'}]}),'STAT_NORMAL_PARAM_INVALID');refuse(c({curves:[{id:'X',mean:'',sd:'2'}]}),'STAT_NORMAL_PARAM_INVALID');
  refuse(c({curves:[{id:'X',mean:'m',sd:'σ'},{id:'Y',mean:'0',sd:'1'}],ticks:[{z:'0'}]}),'STAT_NORMAL_SYMBOLIC_MULTI');
  refuse(c({curves:[{id:'X',mean:'0',sd:'1'},{id:'Y',mean:'7',sd:'1'}],ticks:['0']}),'STAT_NORMAL_WINDOW_TOO_WIDE');                  // the means are more than 6 sd apart
  refuse(c({curves:[{id:'X',mean:'0',sd:'1'},{id:'Y',mean:'1',sd:'5'}],ticks:['0']}),'STAT_NORMAL_SD_RATIO');
  refuse(c({span:'2'}),'STAT_NORMAL_SPAN_INVALID');refuse(c({span:'6'}),'STAT_NORMAL_SPAN_INVALID');
  refuse(c({curves:[{id:'X',mean:'50',sd:'2',label:'<b>'}]}),'STAT_NORMAL_LABEL_INVALID');
  // the marked positions
  refuse(c({ticks:[]}),'STAT_NORMAL_TICK_INVALID');refuse(c({ticks:[{x:'1',z:'1'}]}),'STAT_NORMAL_TICK_INVALID');refuse(c({ticks:[{q:'1'}]}),'STAT_NORMAL_TICK_INVALID');
  refuse(c({ticks:Array.from({length:11},(_,i)=>String(42+i))}),'STAT_NORMAL_TICK_INVALID');
  refuse(c({ticks:['47','47']}),'STAT_NORMAL_TICK_DUPLICATE');refuse(c({ticks:[{x:'47',text:'k'},{x:'48',text:'k'}]}),'STAT_NORMAL_TICK_DUPLICATE');
  refuse(c({ticks:['70']}),'STAT_NORMAL_TICK_OUT_OF_WINDOW');
  refuse(c({ticks:[{x:'47',text:'48'}]}),'STAT_NORMAL_TICK_TEXT_MISMATCH');                                                      // a number as text must be the position
  refuse(c({ticks:[{x:'47',text:'a b'}]}),'STAT_NORMAL_TICK_TEXT_INVALID');
  refuse({kind:'NORMAL_CURVE',curves:[{id:'X',mean:'m',sd:'σ'}],ticks:[{x:'1'}]},'STAT_NORMAL_TICK_INVALID');                       // a framed curve has positions in z only
  // shades, labels, symmetry
  refuse(c({shades:[{from:null,to:null}]}),'STAT_NORMAL_SHADE_INVALID');refuse(c({shades:[{from:'47',to:'50',tone:3}]}),'STAT_NORMAL_SHADE_INVALID');
  refuse(c({shades:[{from:'52',to:'47'}]}),'STAT_NORMAL_SHADE_RANGE');refuse(c({shades:[{from:'47',to:'47'}]}),'STAT_NORMAL_SHADE_RANGE');
  refuse(c({shades:[{from:'48',to:'50'}]}),'STAT_NORMAL_BOUNDARY_NOT_TICKED');                                                   // a boundary must be a marked position
  refuse(c({shades:Array(7).fill({from:'47',to:'50'})}),'STAT_NORMAL_SHADE_INVALID');
  refuse(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'0.4000'}]}),'STAT_NORMAL_AREA_LABEL_MISMATCH');                // not the area under the curve
  refuse(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'0.5+0.1'}]}),'STAT_NORMAL_AREA_LABEL_MISMATCH');
  refuse(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:1,text:'p'}]}),'STAT_NORMAL_AREA_LABEL_INVALID');
  refuse(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'p'},{shade:0,text:'q'}]}),'STAT_NORMAL_AREA_LABEL_INVALID');
  refuse(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'area'}]}),'STAT_NORMAL_AREA_LABEL_INVALID');
  refuse(c({shades:[{from:'47',to:'50'},{from:'50',to:'52'}],areaLabels:[{shade:0,text:'p'},{shade:1,text:'p'}]}),'STAT_NORMAL_AREA_SYMBOL_UNEQUAL');   // one letter, two different areas
  assert.doesNotThrow(()=>solveStatChart(c({shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'0.5-0.0668'}]})));              // 0.4332 written as a difference of table values
  refuse(c({symmetry:[{pair:['47','52']}]}),'STAT_NORMAL_SYMMETRY_MISMATCH');refuse(c({symmetry:[{pair:['47']}]}),'STAT_NORMAL_SYMMETRY_INVALID');
  refuse(c({symmetry:[{pair:['47','47']}]}),'STAT_NORMAL_SYMMETRY_MISMATCH');
  assert.doesNotThrow(()=>solveStatChart(c({ticks:['48','50','52'],symmetry:[{pair:['48','52']}]})));
  refuse(c({ticks:['47','52'],curves:[{id:'X',mean:'50',sd:'2',meanLine:true}]}),'STAT_NORMAL_MEAN_NOT_TICKED');                  // the mean line needs its mark
  refuse(c({curves:[{id:'X',mean:'50',sd:'2'},{id:'Y',mean:'52',sd:'2'}],zAxis:true}),'STAT_NORMAL_Z_AXIS_AMBIGUOUS');
  refuse(c({zAxis:true,curves:[{id:'X',mean:'50',sd:'2',meanLine:false}],ticks:[{x:'47',hideZ:true}]}),'STAT_NORMAL_Z_AXIS_EMPTY');
  refuse(c({xLabel:'xx'}),'STAT_NORMAL_LABEL_INVALID');
  refuse(c({extra:1}),'STAT_CHART_PLAN_INVALID');
});

test('the observer passes normal-curve figures and catches each wrong curve, area, mark or label',async()=>{
  const browser=await launchBrowser();
  try{
    let n=0;
    const compose=async chart=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(7000+n++),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const edit=(svg,re,fn)=>{assert.ok(re.test(svg),String(re));return svg.replace(re,fn);};
    const bump=(svg,id,attr,delta)=>edit(svg,new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`),(m,head,x)=>head+(Number(x)+delta));

    // ---- one curve, two shaded halves, the z row
    let svg=await compose(split);
    let r=await pass(split,svg);assert.equal(r.observed.curves,1);assert.equal(r.observed.ticks,3);assert.deepEqual(r.observed.shades,[0.4332,0.3413]);
    assert.ok(Math.abs(r.observed.drawnAreas['0']-0.4332)<6e-4&&Math.abs(r.observed.drawnAreas['1']-0.3413)<6e-4,'the polygon areas are read back from the drawn geometry');
    // the plan against another figure
    assert.ok(caught(await audit({...split,curves:[{id:'X',mean:'50',sd:'2.5',label:'X'}],areaLabels:[]},svg)),'another sd');
    assert.ok(caught(await audit({...split,ticks:['47','50','53']},svg)),'another tick');
    assert.ok(caught(await audit({...split,shades:[{from:'47',to:'50'}],areaLabels:[{shade:0,text:'0.4332'}]},svg)),'a shade fewer');
    assert.ok(has(await audit({...split,zAxis:false},svg),'SC_NORMAL_LABEL_SET'),'a z row the plan does not ask for');
    // the curve: a vertex moved, the peak moved, a chord cut
    assert.ok(has(await audit(split,edit(svg,/(id="curve-X"[^>]*points="[^"]*? )(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)( )/,(m,a,x,y,b)=>`${a}${x},${Number(y)-3}${b}`)),'SC_NORMAL_CURVE_SHAPE'));
    assert.ok(has(await audit(split,edit(svg,/(id="curve-X"[^>]*points=")([^"]*)"/,(m,head,pts)=>head+pts.split(' ').filter((_,i)=>i%7!==3).join(' ')+'"')),'SC_NORMAL_CURVE_'),'vertices dropped: the chords no longer follow the density');
    // a shade: polygon vertex off the curve, a wrong tone, an edge moved, an edge removed
    assert.ok(has(await audit(split,edit(svg,/(id="shade-0"[^>]*points="[^"]*? )(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)( )/,(m,a,x,y,b)=>`${a}${x},${Number(y)-4}${b}`)),'SC_NORMAL_SHADE_CURVE:0'));
    assert.ok(has(await audit(split,svg.replace(/(id="shade-1"[^>]*) fill-opacity="[\d.]+"/,'$1 fill-opacity="0.34"')),'SC_NORMAL_SHADE_STYLE:1'));
    assert.ok(has(await audit(split,bump(svg,'edge-0-from','x1',2).replace(/(id="edge-0-from"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+2))),'SC_NORMAL_EDGE:0:from'));
    assert.ok(has(await audit(split,svg.replace(/<g data-layer="32"><line id="edge-1-to"[^>]*\/><\/g>/,'')),'SC_NORMAL_EDGE:1:to'));
    // the shade is moved wholesale to another interval: its area no longer matches the label (and the plan's boundary)
    assert.ok(caught(await audit({...split,shades:[{from:'47',to:'52'},{from:'50',to:'52'}],areaLabels:[{shade:1,text:'0.3413'}]},svg)));
    // a tick: moved, wrong text, wrong position claim
    assert.ok(has(await audit(split,bump(svg,'x-tick-2','x1',3).replace(/(id="x-tick-2"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)+3))),'SC_NORMAL_TICK_PLACE:2'));
    assert.ok(has(await audit(split,svg.replace(/(id="x-tick-1-label"[^>]*data-tex=")\\displaystyle 50/,'$1\\displaystyle 51')),'SC_NORMAL_LABEL_TEXT:x-tick-1-label'));
    assert.ok(!/data-pos=|data-from=|data-to=/.test(svg),'the figure carries no position values in its attributes: a mark that stands for an unknown (k) must not give its number away');
    assert.ok(has(await audit(split,svg.replace(/(id="z-tick-0-label"[^>]*data-tex=")\\displaystyle -1.5/,'$1\\displaystyle -2')),'SC_NORMAL_LABEL_TEXT:z-tick-0-label'));
    // the area label: another text, a label moved onto a line, a label removed
    assert.ok(has(await audit(split,svg.replace(/(id="area-0"[^>]*data-tex=")\\displaystyle 0.4332/,'$1\\displaystyle 0.4333')),'SC_NORMAL_LABEL_TEXT:area-0'));
    assert.ok(has(await audit(split,svg.replace('id="area-1" data-label-kind','id="area-9" data-label-kind')),'SC_NORMAL_LABEL_SET'),'a label renamed: the set of labels is no longer the plan\'s');
    assert.ok(has(await audit(split,edit(svg,/(id="area-0"[^>]*data-box=")([\d.-]+),([\d.-]+)/,(m,head,x)=>`${head}${x},${Number(m.split(',')[1])-80}`)),'SC_NORMAL_AREA_LABEL_OUTSIDE:0'),'a label with no leader outside its area');
    // the leader of the label that did not fit: its dot moved out of the area
    assert.ok(/id="area-1-dot"/.test(svg),'the 0.3413 label stands beside the curve with a leader and a dot');
    assert.ok(has(await audit(split,bump(svg,'area-1-dot','cx',60)),'SC_NORMAL_AREA_DOT_OUTSIDE:1'));
    assert.ok(has(await audit(split,svg.replace(/<g data-layer="60"><line id="area-1-leader"[^>]*\/><\/g>/,'')),'SC_NORMAL_AREA_LABEL_OUTSIDE:1'));
    assert.ok(has(await audit(split,bump(svg,'area-1-leader','y1',9)),'SC_NORMAL_AREA_LEADER:1'));
    // the mean line, stray lines
    assert.ok(has(await audit(split,svg.replace(/<g data-layer="28"><line id="mean-X"[^>]*\/><\/g>/,'')),'SC_NORMAL_MEAN_LINE:X'));
    assert.ok(has(await audit(split,svg.replace('</svg>','<g data-layer="30"><line id="stray" x1="0" y1="0" x2="9" y2="9" stroke="#111"/></g></svg>')),'SC_NORMAL_LINE_SET'));

    // ---- two curves with different styles, tails to the window ends, one letter for two equal areas
    svg=await compose(twin);
    r=await pass(twin,svg);assert.equal(r.observed.curves,2);
    assert.equal((svg.match(/stroke-dasharray="8 4"/g)||[]).length,1,'the second curve is dashed');
    assert.ok(caught(await audit({...twin,curves:[{id:'X',mean:'10',sd:'6',label:'X',meanLine:true},{id:'Y',mean:'28',sd:'7',label:'Y',meanLine:true}],areaLabels:[]},svg)),'another sd of the second curve');
    assert.ok(caught(await audit({...twin,ticks:['10','13',{x:'24',text:'k'},'28']},svg)),'k moved: the two tails are no longer equal');
    assert.ok(has(await audit(twin,svg.replace(/(id="curve-Y"[^>]*) stroke-dasharray="8 4"/,'$1')),'SC_NORMAL_CURVE_STYLE_SAME'));
    assert.ok(has(await audit(twin,svg.replace(/(id="shade-1"[^>]*points=")([\d.]+),/,(m,head,x)=>head+(Number(x)+5)+',')),'SC_NORMAL_SHADE_'),'the tail starts at another position');

    // ---- a framed curve: letters, the symmetric pair, a level line across the two tops
    svg=await compose(framed);
    r=await pass(framed,svg);
    assert.ok(/id="sym-0-bar"/.test(svg)&&/id="sym-0-a"/.test(svg));
    assert.ok(has(await audit(framed,bump(svg,'sym-0-bar','y1',3).replace(/(id="sym-0-bar"[^>]*? y2=")([\d.]+)/,(m,head,y)=>head+(Number(y)+3))),'SC_NORMAL_SYMMETRY_BAR:0'));
    assert.ok(has(await audit(framed,svg.replace(/<g data-layer="28"><line id="sym-0-a"[^>]*\/><\/g>/,'')),'SC_NORMAL_SYMMETRY_LINE:0:a'));
    assert.ok(has(await audit({...framed,symmetry:[]},svg),'SC_NORMAL_LINE_SET'),'a symmetry the plan does not ask for');

    // ---- three curves
    svg=await compose(three);
    r=await pass(three,svg);assert.equal(r.observed.curves,3);
    assert.equal(new Set([...svg.matchAll(/id="curve-[ABC]"[^>]*?stroke-dasharray="([^"]*)"|id="curve-A"/g)].map(m=>m[1]||'')).size,3,'three line styles');
  }finally{await browser.close();}
});
