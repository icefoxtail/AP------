// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1 POINTS rows in middle-school notation: Hangul consonant names (ㄱ..ㅎ), unnamed points, a hidden value per point,
// up to 8 points a row, graduated axes (subdivisions), no highlighted segment (band:false) and no axis-end variable (axisVariable:false).
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {solveNumberLine,composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,expandNumberLineFigure} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const sub=(from,to,parts)=>({from,to,parts});
// 25 동산중 2학기 중간 중1 q12: -4..+4, 3/4/2/3 equal parts, five Hangul-named points; the asked point (ㄴ) and the integer one (ㄱ) carry no value.
const q12={axisVariable:false,rows:[{kind:'POINTS',band:false,subdivisions:[sub('-3','-2',3),sub('-1','0',4),sub('1','2',2),sub('3','4',3)],
  points:[{id:'ㄱ',value:'-4',showValue:false},{id:'ㄴ',value:'-8/3',showValue:false},{id:'ㄷ',value:'-3/4'},{id:'ㄹ',value:'3/2'},{id:'ㅁ',value:'10/3'}]}]};
// 25 동산중 q14: three points without names or axis variable
const q14={axisVariable:false,rows:[{kind:'POINTS',band:false,points:[{id:'A',value:'-7',hideName:true},{id:'B',value:'-2',name:null},{id:'O',value:'0',hideName:true}]}]};
const points=(...list)=>({rows:[{kind:'POINTS',points:list}]});
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`marks-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const without=(object,key)=>Object.fromEntries(Object.entries(object).filter(([name])=>name!==key));
const plainRow=numberLine=>({...numberLine,rows:[without(numberLine.rows[0],'subdivisions')]});

test('the engine solves the graduated axis exactly: every integer of the range, the equal parts of the subdivided units',()=>{
  const m=solveNumberLineFigure(q12),row=m.rows[0];
  assert.equal(m.axisVariable,false);assert.equal(row.band,false);
  assert.deepEqual(row.scale.integers,['-4','-3','-2','-1','0','1','2','3','4']);
  assert.deepEqual(row.scale.minor.map(tick=>tick.value),['-8/3','-7/3','-3/4','-1/2','-1/4','3/2','10/3','11/3']);
  assert.deepEqual(row.points.map(point=>[point.id,point.jamoName,!!point.hideValue]),[['ㄱ','ㄱ',true],['ㄴ','ㄴ',true],['ㄷ','ㄷ',false],['ㄹ','ㄹ',false],['ㅁ','ㅁ',false]]);
  // the range of integer ticks follows the points as well as the subdivisions
  const wide=solveNumberLineFigure(points({id:'A',value:'-9/2'},{id:'B',value:'1/3'}));
  assert.equal(wide.rows[0].scale,undefined);
  const w=solveNumberLineFigure({rows:[{kind:'POINTS',subdivisions:[sub('0','1',2)],points:[{id:'A',value:'-9/2'},{id:'B',value:'1/3'}]}]});
  assert.deepEqual(w.rows[0].scale.integers,['-5','-4','-3','-2','-1','0','1']);
  // a name of null or hideName:true draws no name; a letter id with a Hangul name is the Hangul letter
  const m14=solveNumberLineFigure(q14);assert.deepEqual(m14.rows[0].points.map(point=>!!point.hideName),[true,true,true]);
  const named=solveNumberLineFigure(points({id:'A',value:'1',name:'ㅎ'},{id:'B',value:'2'}));
  assert.equal(named.rows[0].points[0].jamoName,'ㅎ');assert.equal(named.rows[0].points[1].jamoName,undefined);
  assert.equal(solveNumberLine(q12).schemaVersion,m.schemaVersion);
  // the model of a plan without the new fields carries none of them
  const old=solveNumberLineFigure({rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'}]}]});
  assert.ok(!('axisVariable' in old)&&!('band' in old.rows[0])&&!('scale' in old.rows[0])&&old.rows[0].points.every(point=>!('hideName' in point)&&!('jamoName' in point)&&!('hideValue' in point)));
});

test('plans that cannot be drawn faithfully are refused with their codes',()=>{
  const one=extra=>points({id:'A',value:'1',...extra},{id:'B',value:'2'});
  assert.throws(()=>solveNumberLineFigure(one({name:'가'})),code('NUMBER_LINE_POINT_NAME_INVALID'));
  assert.throws(()=>solveNumberLineFigure(one({name:'ㄱㄴ'})),code('NUMBER_LINE_POINT_NAME_INVALID'));
  assert.throws(()=>solveNumberLineFigure(one({name:'A'})),code('NUMBER_LINE_POINT_NAME_INVALID'));
  assert.throws(()=>solveNumberLineFigure(one({name:'ㄱ',hideName:true})),code('NUMBER_LINE_POINT_NAME_INVALID'));
  assert.throws(()=>solveNumberLineFigure(one({hideName:'yes'})),code('NUMBER_LINE_POINT_NAME_INVALID'));
  assert.throws(()=>solveNumberLineFigure(one({showValue:0})),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>solveNumberLineFigure(points({id:'ㄱ',value:'1'},{id:'B',value:'2',name:'ㄱ'})),code('NUMBER_LINE_POINT_NAME_DUPLICATE'));
  assert.throws(()=>solveNumberLineFigure(points({id:'a',value:'1'},{id:'B',value:'2'})),code('NUMBER_LINE_POINTS_INVALID'));
  assert.throws(()=>solveNumberLineFigure(points(...'ABCDEFGHI'.split('').map((id,i)=>({id,value:String(i)})))),code('NUMBER_LINE_POINTS_INVALID'));
  assert.doesNotThrow(()=>solveNumberLineFigure(points(...'ABCDEFGH'.split('').map((id,i)=>({id,value:String(i)})))));
  assert.throws(()=>solveNumberLineFigure({axisVariable:'no',rows:[]}),code('NUMBER_LINE_AXIS_VARIABLE_INVALID'));
  assert.throws(()=>solveNumberLineFigure({...q14,rows:[{...q14.rows[0],band:'no'}]}),code('NUMBER_LINE_ROWS_INVALID'));
  const withSubs=subdivisions=>solveNumberLineFigure({rows:[{kind:'POINTS',subdivisions,points:[{id:'A',value:'0'},{id:'B',value:'3'}]}]});
  assert.doesNotThrow(()=>withSubs([sub('0','1',2)]));
  for(const bad of [[],[sub('0','1',1)],[sub('0','1',11)],[sub('0','1',2.5)],[sub('1','1',2)],[sub('2','1',2)],[sub('0','2',2),sub('1','3',2)],[sub('0','1',2),sub('0','1',3)],
    [sub('0.5','1',2)],[sub(0,1,2)],[{from:'0',to:'1'}],[{from:'0',to:'1',parts:3,extra:1}],[sub('0','100',2)],'x'])
    assert.throws(()=>withSubs(bad),code('NUMBER_LINE_SUBDIVISIONS_INVALID'),JSON.stringify(bad));
  assert.doesNotThrow(()=>withSubs([sub('0','1',2),sub('1','2',3)]));
  // subdivisions belong to a POINTS row only
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:null,hi:{value:'1',state:'OPEN'}}],subdivisions:[sub('0','1',2)]}]}),code('NUMBER_LINE_SUBDIVISIONS_INVALID'));
  // a display name cannot be given to a Hangul id through pointNames
  assert.throws(()=>expandNumberLineFigure({capability:'number-line-figure-v1',numberLine:q12,pointNames:{'ㄱ':'A'},caption:'c',sourceConditions:[],newVisualInformation:[]}),error=>error.message.startsWith('POINT_NAME_TARGET_UNKNOWN'));
});

test('a graduated axis with Hangul names composes and the independent observer recomputes ticks, names and hidden values',async()=>{
  const composed=await compose(q12,'q12');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.ok(svg.includes('data-axis-variable="false"')&&!svg.includes('data-label-role="variable"')&&!svg.includes('data-role="solution-band"'));
  assert.equal((svg.match(/data-role="tick"/g)||[]).length,9);assert.equal((svg.match(/data-role="subtick"/g)||[]).length,8);
  assert.equal((svg.match(/data-label-role="point-name"/g)||[]).length,5);assert.equal((svg.match(/data-label-role="point-value"/g)||[]).length,3);
  assert.ok(svg.includes('data-text="ㄴ"')&&svg.includes('data-value-shown="false"'));
  const pass=await audit(svg,q12);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // a hidden value written, a shown value missing
  assert.ok(has(await audit(svg,{...q12,rows:[{...q12.rows[0],points:q12.rows[0].points.map(point=>point.id==='ㄴ'?{id:'ㄴ',value:'-8/3'}:point)}]}),'NL_POINT_LABEL_COUNT:ㄴ'));
  const hideD={...q12,rows:[{...q12.rows[0],points:q12.rows[0].points.map(point=>point.id==='ㄷ'?{...point,showValue:false}:point)}]};
  const shown=await audit(svg,hideD);assert.ok(has(shown,'NL_POINT_VALUE_SHOWN:ㄷ')&&has(shown,'NL_POINT_VALUE_FLAG:ㄷ'));
  // a value label written for the hidden point (a copy of ㄷ's label moved onto ㄴ) is caught even when the counts agree elsewhere
  const copy=svg.replace(/(id="r1-pt-u3134-name"[^>]*?data-label-role=")point-name/,'$1point-value');
  assert.notEqual(copy,svg);assert.ok(has(await audit(copy,q12),'NL_POINT_VALUE_SHOWN:ㄴ'));
  // the equal parts: other parts in the plan, a moved tick, a missing tick, a stray tick, a minor tick as long as a major one
  const parts=(from,to,n)=>({...q12,rows:[{...q12.rows[0],subdivisions:q12.rows[0].subdivisions.map(item=>item.from===from?{from,to,parts:n}:item)}]});
  assert.ok(has(await audit(svg,parts('-3','-2',4)),'NL_SCALE_MINOR'));
  assert.ok(has(await audit(svg,parts('-3','-2',2)),'NL_SCALE_MINOR'));
  assert.ok(has(await audit(svg.replace(/(id="r1-subtick-m3d4"[^>]*?x1=")([\d.]+)("[^>]*?x2=")([\d.]+)/,(m,a,x,b,y)=>a+(Number(x)+6)+b+(Number(y)+6)),q12),'NL_SCALE_MINOR_POSITION'));
  assert.ok(has(await audit(svg.replace(/<g data-layer="30"><line id="r1-subtick-m7d3"[^>]*\/><\/g>/,''),q12),'NL_SCALE_MINOR_SET'));
  assert.ok(has(await audit(svg.replace(/<g data-layer="30"><line id="r1-tick-2"[^>]*\/><\/g>/,''),q12),'NL_SCALE_MAJOR_SET'));
  assert.ok(has(await audit(svg.replace(/(id="r1-subtick-m1d2"[^>]*?y1=")([\d.]+)("[^>]*?y2=")([\d.]+)/,(m,a,y1,b,y2)=>a+(Number(y1)-3)+b+(Number(y2)+3)),q12),'NL_SCALE_MINOR_NOT_SHORTER'));
  assert.ok(has(await audit(svg,plainRow(q12)),'NL_UNEXPECTED_TICK'));
  // a point moved to the wrong place, a Hangul name read as another letter, the axis variable expected
  assert.ok(has(await audit(svg.replace(/(id="r1-pt-u3137"[^>]*?cx=")([\d.]+)/,(m,head,x)=>head+(Number(x)+8)),q12),'NL_POINT_POSITION:ㄷ'));
  assert.ok(has(await audit(svg.replace('data-text="ㄷ"','data-text="ㄹ"'),q12),'NL_POINT_NAME_LABEL:ㄷ'));
  assert.ok(has(await audit(svg,without(q12,'axisVariable')),'NL_VARIABLE_LABEL_COUNT'));
  assert.ok(has(await audit(svg,{...q12,rows:[without(q12.rows[0],'band')]}),'NL_BAND_MISSING'));
  // the value of a point is written above its name on a graduated axis
  assert.ok(svg.indexOf('id="r1-pt-u3137-value"')>0);
});

test('unnamed points and hidden axis variable: values below the axis, no names, no highlighted segment',async()=>{
  const composed=await compose(q14,'q14');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const svg=composed.svg;
  assert.ok(!svg.includes('data-label-role="point-name"')&&!svg.includes('data-label-role="variable"')&&!svg.includes('data-role="solution-band"')&&!svg.includes('data-role="tick"'));
  assert.equal((svg.match(/data-label-role="point-value"/g)||[]).length,3);
  const pass=await audit(svg,q14);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  const named={...q14,rows:[{...q14.rows[0],points:q14.rows[0].points.map(point=>({id:point.id,value:point.value}))}]};
  assert.ok(has(await audit(svg,named),'NL_POINT_LABEL_COUNT'));
  assert.ok(has(await audit(svg,{...q14,rows:[without(q14.rows[0],'band')]}),'NL_BAND_MISSING'));
  // the two figure heights differ only by what is drawn: no name zone without names
  const withNames=await compose(points({id:'A',value:'-7'},{id:'B',value:'-2'},{id:'O',value:'0'}),'q14named');
  assert.equal(withNames.status,'COMPOSED');
  const height=text=>Number(/viewBox="0 0 \d+ ([\d.]+)"/.exec(text)[1]);
  assert.ok(height(svg)<height(withNames.svg));
});

test('a plan without the new fields draws exactly as before',async()=>{
  const division={rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['1','2']}}]}]};
  const composed=await compose(division,'division');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!/data-scale|data-value-shown|data-axis-variable|data-role="subtick"/.test(composed.svg));
  assert.ok(composed.svg.includes('data-role="solution-band"')&&composed.svg.includes('data-label-role="variable"'));
  assert.equal((await audit(composed.svg,division)).status,'PASS');
});

test('eight points fit a row; ticks that are too close are refused with their code',async()=>{
  const row=points(...[['ㄱ','-3'],['ㄴ','-2'],['ㄷ','-1'],['ㄹ','0'],['ㅁ','1'],['ㅂ','2'],['ㅅ','3'],['ㅇ','4']].map(([id,value])=>({id,value,showValue:false})));
  const composed=await compose({axisVariable:false,rows:[{...row.rows[0],band:false,subdivisions:[sub('-3','4',2)]}]},'eight');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const dense=await compose({rows:[{kind:'POINTS',subdivisions:[sub('-8','8',10)],points:[{id:'A',value:'-8'},{id:'B',value:'8'}]}]},'dense');
  assert.equal(dense.status,'NUMBER_LINE_TICKS_TOO_DENSE');
  const crowded=await compose({rows:[{kind:'POINTS',points:[{id:'A',value:'0'},{id:'B',value:'1/20'}]}]},'crowded');
  assert.equal(crowded.status,'NUMBER_LINE_LABELS_TOO_CLOSE');
});
