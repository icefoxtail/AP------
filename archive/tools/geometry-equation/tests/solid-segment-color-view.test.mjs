// solid-figure-v1: coloured segments (segments[].color), a turned view (view.yawDeg) and the BLUE highlight fill.
// Chrome-using (composes solid figure panels): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {PALETTE} from '../production/palette.mjs';
import {solveSolidFigure,composeSolidFigurePanel,project,figurePanelSize,YAW_DEG} from '../production/solid-figure-v1.mjs';

const observer=fileURLToPath(new URL('../production/solid_figure_observer_worker.py',import.meta.url));
const code=expected=>error=>String(error.message).startsWith(expected);
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const meta={caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:['A']}],newVisualInformation:['n']};
const identity=assetIdentity('solid-fixture|1','SOLUTION_VISUAL','decisive-relation');
const prism=()=>({kind:'PRISM',base:{kind:'REGULAR',n:5,side:3},height:5,names:'HIJFGCDEAB'});
const figure=over=>({capability:'solid-figure-v1',solids:[prism()],...over,...meta});
const audit=async(plan,svg)=>{const r=await pythonWorker({solidFigure:plan,svg},{script:observer,timeoutMs:30000});assert.equal(r.status,'OK');return r.result;};
const panel=async plan=>{const model=solveSolidFigure(plan);const out=await composeSolidFigurePanel({plan,model,identity,typographyPolicy:policy});assert.equal(out.status,'COMPOSED',JSON.stringify(out.detail));return out.svg;};
const segmentTag=(svg,id)=>new RegExp(`<line id="segment-${id}"[^>]*>`).exec(svg)?.[0];

test('a segment colour is one of the five palette names; plans without it are unchanged',()=>{
  const plain=solveSolidFigure(figure({segments:[{from:'B',to:'C',style:'AUTO'}]}));
  assert.equal('color' in plain.segments[0],false);
  const coloured=solveSolidFigure(figure({segments:[{from:'B',to:'C',style:'AUTO',color:'BLUE'}]}));
  assert.equal(coloured.segments[0].color,'BLUE');
  for(const color of ['RED','blue','LIGHT','',7,null])assert.throws(()=>solveSolidFigure(figure({segments:[{from:'B',to:'C',color}]})),code('SOLID_SEGMENT_COLOR_INVALID'),String(color));
});
test('a coloured segment is stroked in the palette line colour, a hidden one stays dashed, and the observer reads the colour back',async()=>{
  const plan=figure({segments:[{from:'B',to:'C',style:'AUTO',role:'REF',color:'BLUE'},{from:'B',to:'G',style:'AUTO',color:'WARM'},{from:'A',to:'F',style:'AUTO',color:'ROSE'},{from:'D',to:'I',style:'AUTO',color:'GREEN'},{from:'E',to:'J',style:'AUTO',color:'VIOLET'}]});
  const svg=await panel(plan);
  for(const [id,color,hidden] of [['BC','BLUE',false],['BG','WARM',true],['AF','ROSE',true],['DI','GREEN',false],['EJ','VIOLET',false]]){
    const tag=segmentTag(svg,id);
    assert.ok(tag,id);
    assert.ok(tag.includes(`data-color="${color}"`)&&tag.includes(`stroke="${PALETTE[color].line}"`),id+' '+tag);
    assert.equal(tag.includes('stroke-dasharray'),hidden,id+' dashed only when hidden');
  }
  assert.equal((await audit(plan,svg)).status,'PASS');
  // tampering: another stroke, or a colour that the plan did not ask for
  const wrongStroke=svg.replace(`data-color="BLUE" stroke="${PALETTE.BLUE.line}"`,`data-color="BLUE" stroke="#c0392b"`);
  assert.notEqual(wrongStroke,svg);
  assert.ok((await audit(plan,wrongStroke)).errors.some(e=>e.startsWith('SOLID_SEGMENT_COLOR_MISMATCH:BC')));
  const plainPlan=figure({segments:[{from:'B',to:'C',style:'AUTO',role:'REF'}]});
  const plainSvg=await panel(plainPlan);
  assert.equal(plainSvg.includes('data-color'),false);
  const claimed=plainSvg.replace('<line id="segment-BC"','<line data-color="BLUE" id="segment-BC"');
  assert.notEqual(claimed,plainSvg);
  assert.ok((await audit(plainPlan,claimed)).errors.some(e=>e.startsWith('SOLID_SEGMENT_COLOR_NOT_IN_PLAN:BC')));
});
test('the BLUE highlight fill is the LIGHT tint: the same bytes, the same observer verdict',async()=>{
  const light=figure({highlights:[{face:'top'}]}),blue=figure({highlights:[{face:'top',fill:'BLUE'}]});
  const a=await panel(light),b=await panel(blue);
  assert.equal(b,a);
  assert.equal((await audit(blue,b)).status,'PASS');
  assert.throws(()=>solveSolidFigure(figure({highlights:[{face:'top',fill:'RED'}]})),code('SOLID_HIGHLIGHT_FILL_INVALID'));
  // a translucent tint: the dashed back edges under a highlighted face stay visible (fill opacity below one half, drawn under the lines)
  assert.ok(/fill-opacity="0\.\d+"/.test(b)&&Number(/data-role="highlight-face"[^>]*fill-opacity="([\d.]+)"/.exec(b)[1])<0.5);
});
test('view.yawDeg turns the figure; 28 is the default and changes nothing; every other stage uses its own figure\'s yaw',async()=>{
  const plain=solveSolidFigure(figure({}));
  assert.equal(plain.yawDeg,28);
  assert.equal(JSON.stringify(solveSolidFigure(figure({view:{yawDeg:28}}))),JSON.stringify(plain));
  const front=solveSolidFigure(figure({view:{yawDeg:0}}));
  assert.equal(front.yawDeg,0);assert.equal(YAW_DEG,0);
  assert.equal(project([1,0,0])[1],0);// at yaw 0 the x axis is the screen's horizontal
  // the next plan without a view is back at 28 degrees, whatever was solved before it
  solveSolidFigure(figure({}));
  assert.equal(YAW_DEG,28);assert.ok(Math.abs(project([1,0,0])[1])>0.1);
  // the frame of a model is measured in the model's own view
  const sizeFront=figurePanelSize(front);solveSolidFigure(figure({}));
  assert.deepEqual(figurePanelSize(front),sizeFront);
});
test('a turned figure is composed in its view, read back by the observer, and the observer refuses a wrong yaw',async()=>{
  const plan=figure({view:{yawDeg:0},segments:[{from:'B',to:'C',style:'AUTO',color:'BLUE'},{from:'A',to:'F',style:'AUTO',color:'WARM'}]});
  const svg=await panel(plan);
  assert.ok(svg.includes('data-yaw="0"'));
  assert.equal((await audit(plan,svg)).status,'PASS');
  // hidden edges stay dashed in the turned view: the back edges AF, FG, FJ
  assert.ok(segmentTag(svg,'AF').includes('stroke-dasharray'));
  const defaultSvg=await panel(figure({segments:[{from:'B',to:'C',style:'AUTO',color:'BLUE'},{from:'A',to:'F',style:'AUTO',color:'WARM'}]}));
  assert.notEqual(defaultSvg,svg);
  assert.ok((await audit(plan,defaultSvg)).errors.includes('SOLID_PROJECTION_NOT_DECLARED_FIXED'));
  assert.ok((await audit(figure({segments:[{from:'B',to:'C',style:'AUTO',color:'BLUE'},{from:'A',to:'F',style:'AUTO',color:'WARM'}]}),svg)).errors.includes('SOLID_PROJECTION_NOT_DECLARED_FIXED'));
  // and the 28 degree figure still passes after a turned one was audited in the same worker
  assert.equal((await audit(figure({}),await panel(figure({})))).status,'PASS');
});
test('a view that cannot be drawn is refused with explicit codes',()=>{
  for(const yawDeg of [61,-61,1.5,'0',null,Number.NaN])assert.throws(()=>solveSolidFigure(figure({view:{yawDeg}})),code('SOLID_VIEW_INVALID'),String(yawDeg));
  assert.throws(()=>solveSolidFigure(figure({view:{}})),code('SOLID_VIEW_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({view:{yawDeg:0,pitchDeg:20}})),code('SOLID_VIEW_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({view:{yawDeg:10},solids:[{kind:'CYLINDER',radius:3,height:5}]})),code('SOLID_VIEW_UNSUPPORTED'));
  // a cuboid turned to 0 degrees shows its left and right faces edge-on
  assert.throws(()=>solveSolidFigure(figure({view:{yawDeg:0},solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:{base:'FGHE',top:'BCDA'}}]})),code('SOLID_VIEW_DEGENERATE'));
  solveSolidFigure(figure({view:{yawDeg:15},solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:{base:'FGHE',top:'BCDA'}}]}));
});
