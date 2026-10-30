// Chrome-using (composes the figures): run with --test-concurrency=1.
// stat-chart-figure-v1 (E34): a frequency chart whose legend or x title needs more room than the standard frame widens the frame (the size is worked out from the model with the
// typesetter and the policy's font size, never squeezed), a y title wider than the room left of the axis starts at the frame's edge, and an axis title of 15 to 28 characters is
// broken at its space into two lines. The independent observer re-derives the lines from the plan.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveStatChart,statChartSize,composeStatChartFigure,FIGURE_CAPABILITY} from '../production/stat-chart-v1.mjs';

const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),code(expected),expected+' '+JSON.stringify(chart).slice(0,90));
const plan=chart=>({capability:FIGURE_CAPABILITY,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const wire=chart=>JSON.parse(JSON.stringify(chart));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
// 23 연향중 2학기 기말 중1 q19: two named series; the legend reads 수영(50명) and 볼링(40명)
const polygon={kind:'FREQUENCY_POLYGON',yKind:'RELATIVE',boundaries:['10','20','30','40','50','60','70'],
  series:[{name:'수영(50명)',relativeFrequencies:['0.02','0.10','0.18','0.28','0.26','0.16']},{name:'볼링(40명)',relativeFrequencies:['0.10','0.20','0.25','0.30','0.10','0.05']}],
  highlightPoints:[{series:0,class:3,showValue:true}],xTitle:'연령(세)',yTitle:'상대도수',grid:true};
const longTitles={kind:'HISTOGRAM',boundaries:['0','10','20','30','40'],series:[{frequencies:[3,7,5,2]}],xTitle:'하루 평균 운동 시간 측정값(분)',yTitle:'학생 수가 가장 많은 도수(명)',grid:true};

test('the engine keeps long axis titles whole in its model and refuses titles that cannot be broken',()=>{
  const m=solveStatChart(longTitles);
  assert.equal(m.xTitle,'하루 평균 운동 시간 측정값(분)');assert.equal(m.yTitle,'학생 수가 가장 많은 도수(명)');
  for(const bad of ['가나다라마바사아자차카타파하가','가나다라마바사아자차카타파하가 나다','나다 가나다라마바사아자차카타파하가',' 가나다라마바사 아자차카타파하','가나다라마바사 아자차카타파하 ','가나다라마바  사아자차카타파하','x'.repeat(29)])
    refuse({...longTitles,yTitle:bad},'STAT_TITLE_INVALID');
  for(const good of ['도수(명)','가나다라마바사아자차카타파하','가나다라마바사 아자차카타파하가나','가나다라마바사 아자차카타파하가나다라'])assert.doesNotThrow(()=>solveStatChart({...longTitles,xTitle:good}),good);
  // other chart kinds keep their 14 characters
  refuse({kind:'SCATTER',points:[{x:'1',y:'1'}],xRange:['0','10'],yRange:['0','10'],xTitle:'가나다라마바사 아자차카타파하가나'},'STAT_TITLE_INVALID');
});

test('the frame is as wide as its labels need and the size is known before composing',()=>{
  const plain=statChartSize(solveStatChart({...polygon,series:[{name:'A',relativeFrequencies:polygon.series[0].relativeFrequencies},{name:'B',relativeFrequencies:polygon.series[1].relativeFrequencies}]}));
  assert.equal(plain.width,548,'a chart that fits keeps the standard frame');
  const named=statChartSize(solveStatChart(polygon));
  assert.ok(named.width>548&&named.height===plain.height,'a long legend widens the frame only');
  assert.ok(statChartSize(solveStatChart(polygon),{fontPx:26}).width>named.width,'a larger font needs more room');
  const long=statChartSize(solveStatChart({...longTitles,xTitle:'가나다라마바사아자차카타파하'}));
  assert.ok(long.width>600);
  const wrapped=statChartSize(solveStatChart(longTitles)),single=statChartSize(solveStatChart({...longTitles,yTitle:'도수(명)'}));
  assert.ok(wrapped.height>single.height-1&&wrapped.height>=single.height+25,'a two-line y title takes a line of room above the axis: '+wrapped.height+' vs '+single.height);
});

test('the observer passes widened frames and broken titles, and catches each one wrong',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(chart,n)=>{
      const composed=await composeStatChartFigure({plan:plan(wire(chart)),model:solveStatChart(chart),identity:assetIdentity('26_테스트|'+(5000+n),'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
      return composed.svg;
    };
    const audit=async(chart,svg)=>(await pythonWorker({chart:wire(chart),svg},{script:observer})).result;
    const pass=async(chart,svg)=>{const r=await audit(chart,svg);assert.equal(r.status,'PASS',JSON.stringify(r.errors));return r;};
    const sizeOf=svg=>[Number(/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)[1]),Number(/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)[2])];
    const boxOf=(svg,id)=>new RegExp(`id="${id}"[^>]*data-box="([\\d.]+),([\\d.]+),([\\d.]+),([\\d.]+)"`).exec(svg).slice(1).map(Number);

    // ---- the legend 수영(50명) / 볼링(40명): the frame is the size the model said, every legend text inside it
    let svg=await compose(polygon,1);
    await pass(polygon,svg);
    assert.deepEqual(sizeOf(svg),[statChartSize(solveStatChart(polygon),{fontPx:20}).width,statChartSize(solveStatChart(polygon),{fontPx:20}).height]);
    for(const id of ['legend-0','legend-1']){const [x,,w]=boxOf(svg,id);assert.ok(x+w<=sizeOf(svg)[0]-12+0.01,id);}
    assert.match(svg,/id="legend-0"[^>]*data-text="수영\(50명\)"/);
    assert.ok(has(await audit({...polygon,series:[{...polygon.series[0],name:'수영 50'},polygon.series[1]]},svg),'SC_LEGEND_NAMES'));

    // ---- two-line titles: the x title beside the arrow, the y title above the axis
    svg=await compose(longTitles,2);
    await pass(longTitles,svg);
    assert.match(svg,/id="x-title"[^>]*data-text="하루 평균 운동"/);assert.match(svg,/id="x-title-2"[^>]*data-text="시간 측정값\(분\)"/);
    assert.match(svg,/id="y-title"[^>]*data-text="학생 수가 가장"/);assert.match(svg,/id="y-title-2"[^>]*data-text="많은 도수\(명\)"/);
    // the lines are two labels one under the other
    const [,y1,,h1]=boxOf(svg,'y-title'),[,y2]=boxOf(svg,'y-title-2');assert.ok(y2>=y1+h1-0.01);
    // another title, a missing second line, a stray second line, a title of one line asked for
    assert.ok(has(await audit({...longTitles,xTitle:'하루 평균 운동 시간 측정값(초)'},svg),'SC_TITLE_MISMATCH:x-title-2'));
    assert.ok(has(await audit({...longTitles,xTitle:'하루 평균 운동시간 측정값(분)'},svg),'SC_TITLE_MISMATCH:x-title'));
    assert.ok(has(await audit(longTitles,svg.replace(/<g data-layer="90"><g id="y-title-2".*?(?=<g data-layer="90">|<\/svg>$)/,'')),'SC_TITLE_MISMATCH:y-title-2'));
    assert.ok(has(await audit({...longTitles,xTitle:'도수(명)'},svg),'SC_TITLE_UNEXPECTED:x-title-2'));
    assert.ok(has(await audit({...longTitles,yTitle:'도수(명)'},svg),'SC_TITLE_UNEXPECTED:y-title-2'));
    assert.equal((await audit({...longTitles,xTitle:'가'.repeat(15)+' '+'나'.repeat(14)},svg)).code,'STAT_TITLE_INVALID');

    // ---- a single title of 14 characters wider than the room left of the axis starts at the frame's edge; a wide x title widens the frame
    const wide={...longTitles,xTitle:'가나다라마바사아자차카타파하',yTitle:'가나다라마바사아자차카타파하'};
    svg=await compose(wide,3);
    await pass(wide,svg);
    assert.ok(boxOf(svg,'y-title')[0]>=12-0.01&&boxOf(svg,'y-title')[0]<14,'the y title starts at the safe margin');
    assert.ok(sizeOf(svg)[0]>=boxOf(svg,'x-title')[0]+boxOf(svg,'x-title')[2]+12-0.01);
    assert.ok(sizeOf(svg)[0]>548);
    // a chart whose labels fit keeps the standard frame and one label per title
    const plain=await compose({...longTitles,xTitle:'시간(분)',yTitle:'도수(명)'},4);
    assert.equal(sizeOf(plain)[0],548);assert.ok(!/id="x-title-2"|id="y-title-2"/.test(plain));
  }finally{await browser.close();}
});
