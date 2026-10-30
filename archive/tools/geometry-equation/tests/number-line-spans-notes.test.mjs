// Chrome-using (composes number-line figure panels): run with --test-concurrency=1.
// number-line-figure-v1 (E34): hideSetLabel (a SET row's own inequality label left out), parameter.hideNote (the "a=... 일 때의 그림" note left out), a fraction value in the
// note written as a small stacked fraction that fits the one-line note, Hangul-word point names, valueSide (a point's value above its name) and spans (a brace or an arrow
// for the distance between two points). The independent observer recomputes all of it from the plan and checks the final SVG.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {composeNumberLinePanel} from '../production/quadratic-inequality-chain-v1.mjs';
import {solveNumberLineFigure,figureLayout} from '../production/number-line-v1.mjs';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const compose=async(numberLine,tag)=>composeNumberLinePanel({plan:{capability:'number-line-v1',numberLine},model:solveNumberLineFigure(numberLine),identity:assetIdentity(`spans-${tag}|1`,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy});
const audit=async(svg,numberLine)=>(await pythonWorker({numberLine,svg},{script:observer})).result;
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const clone=value=>JSON.parse(JSON.stringify(value));
const open=value=>({value,state:'OPEN'}),closed=value=>({value,state:'CLOSED'});
const pts=(list,extra={})=>({kind:'POINTS',points:list.map(([id,value,more])=>({id,value,...(more||{})})),...extra});

// 19 연향중 1학기 중간 중1 q9: 뉴욕 -5, 그리니치 0, 두바이 4; the time difference is the distance between the two ends (the answer is not written).
const cities={axisVariable:false,rows:[pts([['A','-5',{name:'뉴욕'}],['B','0',{name:'그리니치'}],['C','4',{name:'두바이'}]],{spans:[{from:'A',to:'C',label:'시차'}]})]};
// every style: brace above and below, an arrow, a double arrow, a value above its name
const styles={axisVariable:false,rows:[
  pts([['A','-1',{name:'수현',valueSide:'ABOVE'}],['B','0',{hideName:true}],['C','9',{name:'태호',valueSide:'ABOVE'}]],{spans:[{from:'A',to:'C',label:'두 수의 차'},{from:'B',to:'C',label:'+9',style:'ARROW'}]}),
  pts([['D','-1'],['E','9'],['F','4']],{band:false,spans:[{from:'E',to:'D',style:'DOUBLE_ARROW',side:'BELOW',label:'x'},{from:'D',to:'F',style:'BRACE',side:'ABOVE'}]})]};
// 26 왕의중 1학기 중간 중2 q18: the second end moves with a; the sample value (which would give the answer) is not written
const moving={parameter:{name:'a',value:'2',hideNote:true},rows:[
  {kind:'SET',pieces:[{lo:closed('-3/2'),hi:null}]},
  {kind:'SET',pieces:[{lo:{param:{mul:'-1',add:'1/2'},state:'CLOSED'},hi:null}]}]};
// 25 왕운중 1학기 중간 중2 q20: x<n at n=1/2; the note carries a fraction; the inequality label is left out
const fractionNote={parameter:{name:'n',value:'1/2'},rows:[{kind:'SET',pieces:[{lo:null,hi:{param:{mul:'1',add:'0'},state:'OPEN'}}],integerPoints:{range:['-2','2']},hideSetLabel:true}]};

test('the engine solves the new fields; a plan without them has none of them in its model',()=>{
  const m=solveNumberLineFigure(cities);
  assert.deepEqual(m.rows[0].spans,[{from:'A',to:'C',style:'BRACE',side:'BELOW',label:'시차',labelKind:'TEXT'}]);
  assert.deepEqual(m.rows[0].points.map(point=>point.jamoName),['뉴욕','그리니치','두바이']);
  const s=solveNumberLineFigure(styles);
  assert.deepEqual(s.rows[0].spans.map(span=>[span.style,span.side,span.labelKind]),[['BRACE','BELOW','TEXT'],['ARROW','ABOVE','MATH']]);
  assert.deepEqual(s.rows[1].spans.map(span=>[span.style,span.side,span.label]),[['DOUBLE_ARROW','BELOW','x'],['BRACE','ABOVE',undefined]]);
  assert.deepEqual(s.rows[0].points.map(point=>point.valueSide),['ABOVE',undefined,'ABOVE']);
  const h=solveNumberLineFigure(moving);
  assert.deepEqual(h.parameter,{name:'a',value:'2',hideNote:true});
  assert.equal(solveNumberLineFigure(fractionNote).rows[0].hideSetLabel,true);
  const old=solveNumberLineFigure({parameter:{name:'a',value:'2'},rows:[{kind:'SET',pieces:[{lo:{param:{mul:'1',add:'0'},state:'OPEN'},hi:null}]},pts([['A','1'],['B','3']])]});
  assert.deepEqual(old.parameter,{name:'a',value:'2'});
  assert.ok(old.rows.every(row=>!('hideSetLabel' in row)&&!('spans' in row))&&old.rows[1].points.every(point=>!('valueSide' in point)));
  // BELOW is the default side of a value: it is not recorded, so the model of a plan that spells it out is the old one
  const spelled=solveNumberLineFigure({rows:[pts([['A','1',{valueSide:'BELOW'}],['B','3']])]});
  assert.ok(spelled.rows[0].points.every(point=>!('valueSide' in point)));
});

test('the layout reserves a band for each span and takes back the rows of a hidden label and a hidden note',()=>{
  const plain=figureLayout(solveNumberLineFigure({rows:[pts([['A','-5',{name:'뉴욕'}],['C','4',{name:'두바이'}]])]}));
  const below=figureLayout(solveNumberLineFigure({rows:[pts([['A','-5',{name:'뉴욕'}],['C','4',{name:'두바이'}]],{spans:[{from:'A',to:'C'}]})]}));
  const above=figureLayout(solveNumberLineFigure({rows:[pts([['A','-5',{name:'뉴욕'}],['C','4',{name:'두바이'}]],{spans:[{from:'A',to:'C',style:'ARROW'}]})]}));
  assert.ok(below.height>plain.height+40&&Math.abs(below.height-above.height)<0.01);
  assert.equal(below.rows[0].axisY,plain.rows[0].axisY,'a span under the row moves nothing above it');
  assert.ok(above.rows[0].axisY>plain.rows[0].axisY+40,'a span over the row pushes the axis down');
  const note=solveNumberLineFigure({parameter:{name:'a',value:'1'},rows:[{kind:'SET',pieces:[{lo:{param:{mul:'1',add:'0'},state:'OPEN'},hi:null}]}]});
  const hidden=solveNumberLineFigure({parameter:{name:'a',value:'1',hideNote:true},rows:[{kind:'SET',pieces:[{lo:{param:{mul:'1',add:'0'},state:'OPEN'},hi:null}]}]});
  assert.ok(figureLayout(note).height>figureLayout(hidden).height+30);
});

test('plans that cannot be drawn faithfully are refused with their codes',()=>{
  const withSpans=spans=>solveNumberLineFigure({rows:[pts([['A','1'],['B','8'],['C','3']],{spans})]});
  assert.doesNotThrow(()=>withSpans([{from:'A',to:'B'}]));
  for(const bad of [[],'x',[{from:'A',to:'B'},{from:'B',to:'A'}],[{from:'A',to:'B',style:'CURL'}],[{from:'A',to:'B',side:'LEFT'}],[{from:'A',to:'B',extra:1}],[{from:'A',to:'B'},{from:'A',to:'C'},{from:'B',to:'C'},{from:'C',to:'A'}],7,null])
    assert.throws(()=>withSpans(bad),code('NUMBER_LINE_SPANS_INVALID'),JSON.stringify(bad));
  for(const bad of [[{from:'A',to:'Z'}],[{from:'A',to:'A'}],[{from:'Q',to:'B'}],[{from:1,to:2}],[{to:'B'}]])assert.throws(()=>withSpans(bad),code('NUMBER_LINE_SPAN_POINT_UNKNOWN'),JSON.stringify(bad));
  for(const good of ['시차','두 수의 차','4+5','x','a=3'])assert.doesNotThrow(()=>withSpans([{from:'A',to:'B',label:good}]),good);
  for(const bad of ['',' 시차','시차 ','시  차','시차4','열글자를넘는라벨입니다','a b','x\\y','x*y',7,null,'4+5가'])assert.throws(()=>withSpans([{from:'A',to:'B',label:bad}]),code('NUMBER_LINE_SPAN_LABEL_INVALID'),JSON.stringify(bad));
  // spans belong to a POINTS row; the other new row and parameter fields are checked too
  assert.throws(()=>solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:open('1'),hi:open('3')}],spans:[]}]}),code('NUMBER_LINE_ROWS_INVALID'));
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','1'],['B','2']],{hideSetLabel:true})]}),code('NUMBER_LINE_ROWS_INVALID'));
  for(const bad of ['yes',1,null])assert.throws(()=>solveNumberLineFigure({rows:[{kind:'SET',pieces:[{lo:open('1'),hi:open('3')}],hideSetLabel:bad}]}),code('NUMBER_LINE_HIDE_SET_LABEL_INVALID'),JSON.stringify(bad));
  for(const bad of ['yes',1,null])assert.throws(()=>solveNumberLineFigure({parameter:{name:'a',value:'1',hideNote:bad},rows:[{kind:'SET',pieces:[{lo:{param:{mul:'1',add:'0'},state:'OPEN'},hi:null}]}]}),code('NUMBER_LINE_PARAMETER_INVALID'),JSON.stringify(bad));
  for(const bad of ['LEFT','above','',1,null,true])assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','1',{valueSide:bad}],['B','2']])]}),code('NUMBER_LINE_VALUE_SIDE_INVALID'),JSON.stringify(bad));
  // names: a word of 2 to 5 Hangul syllables is fine; a longer or mixed one is not; two points cannot share a name
  const named=name=>solveNumberLineFigure({rows:[pts([['A','1',{name}],['B','2']])]});
  for(const good of ['뉴욕','그리니치','ㄱ'])assert.doesNotThrow(()=>named(good),good);
  for(const bad of ['가','여섯글자이름이','ab','뉴욕1','뉴 욕','',7])assert.throws(()=>named(bad),code('NUMBER_LINE_POINT_NAME_INVALID'),JSON.stringify(bad));
  assert.throws(()=>solveNumberLineFigure({rows:[pts([['A','1',{name:'뉴욕'}],['B','2',{name:'뉴욕'}]])]}),code('NUMBER_LINE_POINT_NAME_DUPLICATE'));
});

test('a figure with word names and a brace composes; the observer recomputes the brace from the plan',async()=>{
  const composed=await compose(cities,'cities');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.match(svg,/id="r1-span-1" data-role="span-brace"/);
  for(const word of ['뉴욕','그리니치','두바이','시차'])assert.ok(svg.includes(`data-text="${word}"`),word);
  assert.equal((svg.match(/data-label-role="span-label"/g)||[]).length,1);
  const pass=await audit(svg,cities);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // the same plan without its span draws no span at all, and the observer says an unexpected one is an error
  const bare=clone(cities);delete bare.rows[0].spans;
  const bareComposed=await compose(bare,'cities-bare');
  assert.ok(!/span-/.test(bareComposed.svg));
  assert.ok(has(await audit(svg,bare),'NL_SPAN_UNEXPECTED'));
});

test('braces, arrows, double arrows above and below the row and values above the names all compose and pass',async()=>{
  const composed=await compose(styles,'styles');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));assert.equal(composed.renderedLayout.status,'PASS');
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="span-brace"/g)||[]).length,2);assert.equal((svg.match(/data-role="span-arrow"/g)||[]).length,2);
  assert.equal((svg.match(/data-role="span-head"/g)||[]).length,3,'one head for the arrow, two for the double arrow');
  const pass=await audit(svg,styles);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  // a span between two points that sit too close for its shape is refused at composing
  const close=await compose({rows:[pts([['A','0'],['B','1/50'],['C','9']],{spans:[{from:'A',to:'B'}]})]},'close');
  assert.equal(close.status,'NUMBER_LINE_SPAN_TOO_SHORT',JSON.stringify(close.detail));
});

test('hideSetLabel and hideNote leave the label and the note out; a fraction in the note fits the note row',async()=>{
  const moved=await compose(moving,'moving');
  assert.equal(moved.status,'COMPOSED',JSON.stringify(moved.detail));
  assert.ok(!/data-label-role="note"/.test(moved.svg),'the sample value of the parameter is written nowhere');
  assert.equal((moved.svg.match(/data-label-role="set"/g)||[]).length,2,'only the note is hidden: each row keeps its own inequality');
  const movedPass=await audit(moved.svg,moving);assert.equal(movedPass.status,'PASS',JSON.stringify(movedPass.errors));
  const fraction=await compose(fractionNote,'fraction');
  assert.equal(fraction.status,'COMPOSED',JSON.stringify(fraction.detail));
  assert.equal((fraction.svg.match(/data-label-role="note"/g)||[]).length,2);
  assert.ok(!/data-label-role="set"/.test(fraction.svg),'hideSetLabel: no inequality over the row');
  assert.match(fraction.svg,/data-tex="n=\\frac\{1\}\{2\}"/,'the fraction is written small (text style), not in display style');
  const fractionPass=await audit(fraction.svg,fractionNote);assert.equal(fractionPass.status,'PASS',JSON.stringify(fractionPass.errors));
  // an integer value keeps the display style (a plan using none of the new fields draws as before)
  const whole=await compose({parameter:{name:'a',value:'-1'},rows:[{kind:'SET',pieces:[{lo:{param:{mul:'1',add:'0'},state:'OPEN'},hi:null}]}]},'whole');
  assert.equal(whole.status,'COMPOSED',JSON.stringify(whole.detail));
  assert.match(whole.svg,/data-tex="\\displaystyle a=-1"/);
  // 19 연향중 q8: the set -9/2<x<9/2 with its integers and no inequality label
  const q8={axisVariable:false,rows:[{kind:'SET',pieces:[{lo:open('-9/2'),hi:open('9/2')}],integerPoints:true,hideSetLabel:true}]};
  const composedQ8=await compose(q8,'q8');
  assert.equal(composedQ8.status,'COMPOSED',JSON.stringify(composedQ8.detail));
  assert.ok(!/data-label-role="set"/.test(composedQ8.svg));
  assert.equal((await audit(composedQ8.svg,q8)).status,'PASS');
  const labelled=clone(q8);delete labelled.rows[0].hideSetLabel;
  assert.ok(has(await audit(composedQ8.svg,labelled),'NL_SET_LABEL_COUNT'),'the plan without hideSetLabel needs the label');
});

test('tamper: a moved, wrongly sided or wrongly shaped span, a wrong label, a drawn note or set label make the observer fail',async()=>{
  const {svg}=await compose(cities,'tamper');
  const braceD=/(id="r1-span-1"[^>]*? d=")([^"]*)"/;
  // the brace: its end moved, its depth changed, its middle moved, a different side asked by the plan
  assert.ok(has(await audit(svg.replace(braceD,(m,head,d)=>head+d.replace(/^M ([\d.]+)/,(mm,x)=>'M '+(Number(x)+4))+'"'),cities),'NL_SPAN_SHAPE'));
  assert.ok(has(await audit(svg.replace(braceD,(m,head,d)=>head+d.replace(/([\d.]+)$/,(mm,y)=>String(Number(y)+3))+'"'),cities),'NL_SPAN_SHAPE'));
  const aboveSide=clone(cities);aboveSide.rows[0].spans[0].side='ABOVE';
  assert.ok(has(await audit(svg,aboveSide),'NL_SPAN_ATTRIBUTES'));
  const toB=clone(cities);toB.rows[0].spans[0].to='B';
  assert.ok(has(await audit(svg,toB),'NL_SPAN_ATTRIBUTES'));
  const styleArrow=clone(cities);styleArrow.rows[0].spans[0].style='ARROW';
  assert.ok(has(await audit(svg,styleArrow),'NL_SPAN_ATTRIBUTES'));
  // the label: other text, moved off its centre, missing from the plan, asked for by the plan
  assert.ok(has(await audit(svg.replace('data-text="시차"','data-text="시간"'),cities),'NL_SPAN_LABEL_TEXT'));
  assert.ok(has(await audit(svg.replace(/(id="r1-span-1-label"[^>]*?transform="translate\()([\d.]+)/,(m,head,x)=>head+(Number(x)+9)),cities),'NL_SPAN_LABEL_NOT_CENTRED'));
  const noLabel=clone(cities);delete noLabel.rows[0].spans[0].label;
  assert.ok(has(await audit(svg,noLabel),'NL_SPAN_LABEL_UNEXPECTED'));
  const otherLabel=clone(cities);otherLabel.rows[0].spans[0].label='차이';
  assert.ok(has(await audit(svg,otherLabel),'NL_SPAN_LABEL_TEXT'));
  // the label pushed up into the brace
  assert.ok(has(await audit(svg.replace(/(id="r1-span-1-label"[^>]*?transform="translate\([\d.]+ )([\d.]+)/,(m,head,y)=>head+(Number(y)-26)),cities),'NL_SPAN_'));
  // a point name: a different word, a missing one
  assert.ok(has(await audit(svg.replace('data-text="뉴욕"','data-text="뉴옥"'),cities),'NL_POINT_NAME_LABEL'));
  const renamed=clone(cities);renamed.rows[0].points[1].name='런던';
  assert.ok(has(await audit(svg,renamed),'NL_POINT_NAME_LABEL'));
  // arrows: the head moved off its end, the shaft shortened, the style changed
  const arrows=await compose(styles,'tamper-arrows');
  assert.equal(arrows.status,'COMPOSED',JSON.stringify(arrows.detail));
  const headOf=/(id="r1-span-2-head-1"[^>]*? points=")([\d.]+),([\d.]+)/;
  assert.ok(has(await audit(arrows.svg.replace(headOf,(m,head,x,y)=>head+(Number(x)+3)+','+y),styles),'NL_SPAN_HEAD'));
  assert.ok(has(await audit(arrows.svg.replace(/(id="r1-span-2"[^>]*? x2=")([\d.]+)/,(m,head,x)=>head+(Number(x)-6)),styles),'NL_SPAN_ENDS'));
  assert.ok(has(await audit(arrows.svg.replace(/<polygon id="r2-span-1-head-2"[^>]*\/>/,''),styles),'NL_SPAN_HEAD_COUNT'));
  // the values above the names: the plan asks for them below, or the label sits where it should not
  const below=clone(styles);delete below.rows[0].points[0].valueSide;
  assert.ok(has(await audit(arrows.svg,below),'NL_LABEL_NOT_BELOW_AXIS'));
  const above=clone(styles);above.rows[1].points[0].valueSide='ABOVE';
  assert.ok(has(await audit(arrows.svg,above),'NL_LABEL_NOT_ABOVE_DOT'));
  // the hidden note and the hidden set label: the plan must say so
  const {svg:movingSvg}=await compose(moving,'tamper-moving');
  const shown=clone(moving);delete shown.parameter.hideNote;
  assert.ok(has(await audit(movingSvg,shown),'NL_NOTE_LABELS'));
  const {svg:fractionSvg}=await compose(fractionNote,'tamper-fraction');
  const hiddenNote=clone(fractionNote);hiddenNote.parameter.hideNote=true;
  assert.ok(has(await audit(fractionSvg,hiddenNote),'NL_NOTE_HIDDEN_BUT_DRAWN'));
  const wrongValue=clone(fractionNote);wrongValue.parameter.value='1/3';
  assert.ok(has(await audit(fractionSvg,wrongValue),'NL_NOTE_VALUE'));
});

test('a plan without the new fields draws exactly as before',async()=>{
  const plain={rows:[pts([['A','-2'],['B','4']])]};
  const composed=await compose(plain,'plain');
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(!/span-|data-span-style|hideNote/.test(composed.svg));
  assert.equal((await audit(composed.svg,plain)).status,'PASS');
});
