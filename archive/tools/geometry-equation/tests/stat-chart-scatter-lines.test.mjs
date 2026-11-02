// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (G16): SCATTER general straight lines (refLines kind LINE: ax+by=c), half-plane regions (regions kind HALF_PLANE), recoloured points (pointGroups) and the trend arrow
// (trendArrow). The observer re-derives the clipped lines, the polygons, the point colours and the arrow from the plan's own numbers; a plan without these fields draws what it always drew.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(-140));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>(result.errors??[result.code]).some(error=>error.startsWith(prefix));
const POINTS=[[3,2],[3,3],[4,3],[4,6],[5,6],[5,4],[6,7],[6,8],[7,8],[7,5],[8,10],[8,9],[9,8],[9,5],[10,9]].map(([x,y])=>({x:String(x),y:String(y)}));
const base={kind:'SCATTER',points:POINTS,xRange:['0','10'],yRange:['0','10'],xStep:'1',yStep:'1',labelEvery:2,xTitle:'읽기',yTitle:'듣기'};
const g=extra=>({...base,...extra});
const line=(a,b,c,more={})=>({kind:'LINE',a,b,c,...more});
const half=(a,b,c,side,more={})=>({kind:'HALF_PLANE',a,b,c,side,...more});

test('the engine cuts lines and half planes by the plotted range exactly and counts the points on a side',()=>{
  const m=solveStatChart(g({refLines:[line(1,1,14,{label:'x+y=14',style:'DASHED'}),line('-1','1','2'),line('1/2',0,'3')],regions:[half(1,1,14,'GE',{markPoints:true,countLabel:true,countUnit:'명'})]}));
  assert.deepEqual(m.refLines[0],{type:'LINE',a:'1',b:'1',c:'14',label:'x+y=14',style:'DASHED',from:['4','10'],to:['10','4']});
  assert.deepEqual([m.refLines[1].from,m.refLines[1].to],[['0','2'],['8','10']]);
  assert.deepEqual([m.refLines[2].from,m.refLines[2].to],[['6','0'],['6','10']],'x/2=3 is the vertical line x=6');
  assert.deepEqual(m.regions[0].polygon,[['10','4'],['10','10'],['4','10']],'x+y>=14 keeps the triangle (4,10) (10,10) (10,4)');
  assert.equal(m.regions[0].count,7);assert.equal(m.regions[0].edge,null,'a closed side draws no edge of its own');
  const gt=solveStatChart(g({regions:[half(1,1,14,'GT')]})).regions[0];
  assert.equal(gt.count,5);assert.deepEqual(gt.edge,[['4','10'],['10','4']]);                                       // x+y>14: (7,8) (8,10) (8,9) (9,8) (10,9)
  assert.equal(solveStatChart(g({regions:[half(1,1,12,'LE')]})).regions[0].count,7);                           // x+y<=12: (3,2) (3,3) (4,3) (4,6) (5,6) (5,4) (7,5)
  assert.deepEqual(solveStatChart(g({regions:[half(1,0,5,'GE')]})).regions[0].polygon.length,4,'a vertical boundary keeps a rectangle');
  // the same line written with other multiples is the same line (no duplicates)
  refuse(g({refLines:[line(1,1,14),line(2,2,28)]}),'STAT_SCATTER_GUIDE_INVALID');
  // a plan without the new fields has none of their keys in its model
  const plain=solveStatChart(base);assert.ok(!('refLines' in plain)&&!('regions' in plain)&&!('pointGroups' in plain)&&!('trendArrow' in plain));
});

test('the engine colours points and finds the trend arrow from the data',()=>{
  const m=solveStatChart(g({pointGroups:[{points:[[8,10],[8,9]],color:'BLUE',label:'상위'},{points:[[3,2]],color:'WARM'}],trendArrow:{direction:'UP'}}));
  assert.deepEqual(m.pointGroups,[{color:'BLUE',label:'상위',points:[10,11]},{color:'WARM',label:null,points:[0]}]);
  assert.equal(m.trendArrow.direction,'UP');assert.ok(Number(m.trendArrow.from[0])<Number(m.trendArrow.to[0]));assert.deepEqual([m.trendArrow.from[0],m.trendArrow.to[0]],['3','10']);
  const down=solveStatChart({kind:'SCATTER',points:[[1,9],[2,7],[3,6],[4,3],[5,2]].map(([x,y])=>({x:String(x),y:String(y)})),xRange:['0','6'],yRange:['0','10'],trendArrow:{direction:'DOWN'}});
  assert.equal(down.trendArrow.direction,'DOWN');
});

test('lines, regions, point colours and arrows that cannot be drawn faithfully are refused with their codes',()=>{
  for(const bad of [line(0,0,3),line(1,1,30),line(1,1,-2),line(0,1,11),line(1,0,0.5+11),line(1,1,0),line('x',1,2),line(1,1,14,{label:'가'}),line(1,1,14,{label:'x'.repeat(15)}),line(1,1,14,{style:'DOTTED'}),line(1,1,14,{extra:1}),{kind:'RAY',a:1,b:1,c:2}])
    refuse(g({refLines:[bad]}),'STAT_SCATTER_LINE_INVALID');                                                      // a=b=0, outside the range, only a corner (x+y=0), bad numbers, label, style, keys
  refuse(g({regions:[half(0,0,3,'GE')]}),'STAT_SCATTER_LINE_INVALID');refuse(g({regions:[half(1,1,30,'GE')]}),'STAT_SCATTER_LINE_INVALID');
  for(const bad of [half(1,1,14,'EQ'),half(1,1,14),{...half(1,1,14,'GE'),tone:3},{...half(1,1,14,'GE'),countUnit:'명'},{...half(1,1,14,'GE'),extra:1},{kind:'CIRCLE',a:1,b:1,c:2}])
    refuse(g({regions:[bad]}),'STAT_SCATTER_REGION_INVALID');
  refuse(g({regions:[half(1,1,2,'LE')]}),'STAT_SCATTER_REGION_EMPTY');                                           // x+y<=2: a corner triangle with no point in it
  refuse(g({regions:[half(1,1,3,'LT')]}),'STAT_SCATTER_REGION_EMPTY');                                           // x+y<3: no point
  refuse(g({pointGroups:[{points:[[1,1]],color:'BLUE'}]}),'STAT_SCATTER_GROUP_POINT_UNKNOWN');
  for(const bad of [[],[{points:[[3,2]],color:'RED'}],[{points:[],color:'BLUE'}],[{points:[[3,2]]}],[{points:[[3,2]],color:'BLUE',label:'아주아주아주긴이름'}],[{points:[[3]],color:'BLUE'}],[{points:[[3,2]],color:'BLUE'},{points:[[3,2]],color:'ROSE'}],[{points:[[3,2]],color:'BLUE',x:1}]])
    refuse(g({pointGroups:bad}),'STAT_SCATTER_GROUP_INVALID');
  refuse(g({trendArrow:{direction:'DOWN'}}),'STAT_SCATTER_TREND_MISMATCH');
  for(const bad of [{direction:'SIDEWAYS'},{},{direction:'UP',x:1}])refuse(g({trendArrow:bad}),'STAT_SCATTER_TREND_INVALID');
  refuse({...base,points:POINTS.slice(0,2),trendArrow:{direction:'UP'}},'STAT_SCATTER_TREND_INVALID');
  refuse({...base,points:[{x:'3',y:'1'},{x:'3',y:'5'},{x:'3',y:'9'}],trendArrow:{direction:'UP'}},'STAT_SCATTER_TREND_INVALID');   // every x the same: no slope
});

test('the observer passes lines, half planes, colours and the trend arrow and catches each wrong one',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(8000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const bump=(svg,id,attr,delta)=>{const re=new RegExp(`(id="${id}"[^>]*? ${attr}=")(-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x)=>head+(Number(x)+delta));};
    const top9=[[10,9],[8,10],[9,8],[8,9],[7,8],[9,5],[6,8],[6,7],[7,5]];
    const chart=g({refLines:[line(1,1,12,{label:'x+y=12'}),line(-1,1,2,{style:'DASHED'})],regions:[half(1,1,12,'GE',{markPoints:true,countLabel:true,countUnit:'명'})],pointGroups:[{points:top9,color:'BLUE',label:'상위 9명'}]});
    const svg=await compose(chart,1);
    let r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));
    assert.equal((svg.match(/fill="#1f5fa8"/g)||[]).length,top9.length+1,'nine blue points and the legend dot');
    // lines
    assert.ok(has(await audit(chart,bump(svg,'ref-0','x1',5)),'SC_SCATTER_REF_PLACE:0'));
    assert.ok(has(await audit({...chart,refLines:[line(1,1,13,{label:'x+y=12'}),chart.refLines[1]]},svg),'SC_SCATTER_REF_'),'a different line');
    assert.ok(has(await audit({...chart,refLines:[chart.refLines[0],line(-1,1,2)]},svg),'SC_SCATTER_REF_STYLE:1'),'dashed vs solid');
    assert.ok(has(await audit({...chart,refLines:[line(1,1,12,{label:'x+y=13'}),chart.refLines[1]]},svg),'SC_SCATTER_REF_LABEL:0'));
    assert.ok(has(await audit({...chart,refLines:[chart.refLines[0],{...chart.refLines[1],label:'y-x=2'}]},svg),'SC_SCATTER_REF_LABEL:1'),'a label the figure does not carry');
    // half plane
    assert.ok(has(await audit({...chart,regions:[half(1,1,13,'GE',{markPoints:true,countLabel:true,countUnit:'명'})]},svg),'SC_SCATTER_'),'another boundary');
    assert.ok(has(await audit({...chart,regions:[half(1,1,12,'LE',{markPoints:true,countLabel:true,countUnit:'명'})]},svg),'SC_SCATTER_'),'the other side');
    const polygon=/<polygon id="region-0"[^>]*points="([^"]+)"/.exec(svg)[1];
    assert.ok(has(await audit(chart,svg.replace(polygon,polygon.replace(/^([\d.]+),([\d.]+)/,(m,x,y)=>`${Number(x)+9},${y}`))),'SC_SCATTER_REGION_PLACE:0'));
    assert.ok(has(await audit({...chart,regions:[half(1,1,12,'GE',{markPoints:true,countLabel:true,countUnit:'명',tone:2})]},svg),'SC_SCATTER_REGION_STYLE:0'));
    // colours
    assert.ok(has(await audit({...chart,pointGroups:[{points:top9.slice(1),color:'BLUE',label:'상위 9명'}]},svg),'SC_POINT_COLOR'),'a point of the group missing from the plan');
    assert.ok(has(await audit({...chart,pointGroups:[{points:top9,color:'ROSE',label:'상위 9명'}]},svg),'SC_POINT_COLOR'),'another colour');
    assert.ok(has(await audit({...chart,pointGroups:[{points:top9,color:'BLUE',label:'합격'}]},svg),'SC_SCATTER_LEGEND_MISSING:0'));
    assert.ok(has(await audit({...chart,pointGroups:[{points:top9,color:'BLUE'}]},svg),'SC_SCATTER_LEGEND_UNEXPECTED:0'));
    assert.ok(has(await audit({...chart,pointGroups:[{points:[[1,1]],color:'BLUE'}]},svg),'STAT_SCATTER_GROUP_POINT_UNKNOWN'));
    assert.ok(has(await audit({...chart,pointGroups:undefined},svg),'SC_POINT_COLOR'));
    assert.ok(has(await audit(chart,bump(svg,'pt-10','r',-1)),'SC_POINT_RADIUS:10'));
    // a strict side draws its dotted edge
    const strict={...chart,regions:[half(1,1,12,'GT')],pointGroups:undefined};
    const svg2=await compose(strict,2);assert.equal((await audit(strict,svg2)).status,'PASS');assert.ok(/id="region-0-edge"/.test(svg2));
    assert.ok(has(await audit({...strict,regions:[half(1,1,12,'GE')]},svg2),'SC_SCATTER_REGION_EDGE_UNEXPECTED:0'));
    assert.ok(has(await audit(strict,svg2.replace(/<g data-layer="36"><line id="region-0-edge"[^>]*\/><\/g>/,'')),'SC_SCATTER_REGION_EDGE_MISSING:0'));
    // the trend arrow
    const up=g({trendArrow:{direction:'UP'}});
    const svg3=await compose(up,3);assert.equal((await audit(up,svg3)).status,'PASS');
    assert.ok(has(await audit(up,bump(svg3,'trend-arrow','y1',6)),'SC_SCATTER_TREND_PLACE'));
    assert.ok(has(await audit(up,svg3.replace(/(id="trend-arrow-head"[^>]*points=")([\d.]+),([\d.]+)/,(m,h,x,y)=>`${h}${Number(x)+5},${y}`)),'SC_SCATTER_TREND_HEAD'));
    assert.ok(has(await audit(g({}),svg3),'SC_SCATTER_TREND_UNEXPECTED'));
    assert.ok(has(await audit({...up,trendArrow:{direction:'DOWN'}},svg3),'STAT_SCATTER_TREND_MISMATCH'));
    // a plain scatter plot carries none of the new elements
    const plain=await compose(base,4);assert.ok(!/ref-line|trend-arrow|legend|#1f5fa8|region-/.test(plain));
    assert.ok(has(await audit(chart,plain),'SC_'),'the marks of the plan are missing from a plain figure');
  }finally{await browser.close();}
});
