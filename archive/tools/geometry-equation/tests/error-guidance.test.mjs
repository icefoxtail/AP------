// Failure results tell the author what to fix (roadmap 1-1): result.hint, result.fix, result.detailFull / errors / code, and the same hint + fix on the final attempts.jsonl line.
// Every failure here is a refusal raised before Chrome is needed (frame / spec stage), so the file runs in seconds; the layout and canonical-JSON codes are checked on the
// guidance function with the detail shape the composer really throws. Existing result fields keep their values: detail is still the 600 character clip.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPlan} from '../production/render-plan.mjs';
import {failureGuidance,validateFix,PLACER_SUGGESTIONS} from '../production/error-guidance.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {CANVAS_RANGE} from '../production/phase2.mjs';
import {HINTS,hintFor} from '../ops/tools/hints.mjs';
import {ATTEMPT_LOG_FILE} from '../production/attempt-log.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const golden=name=>JSON.parse(fs.readFileSync(path.join(here,'..','ops','golden',name,'plan.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(here,'..','ops','golden.manifest.json'),'utf8'));
const itemOf=(dir,as)=>{const x=manifest.items.find(i=>i.dir===dir);return {sourcePath:x.sourcePath,ordinal:x.ordinal,dir:as};};
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'error-guidance-'));
const run=async(dir,plan)=>{const out=tmp(),r=await renderPlan({item:itemOf(dir,'f'),plan,outDir:out});return {r,out,file:JSON.parse(fs.readFileSync(path.join(out,'f-result.json'),'utf8')),log:fs.readFileSync(path.join(out,ATTEMPT_LOG_FILE),'utf8').split('\n').filter(Boolean).map(l=>JSON.parse(l))};};
const cleanKeys=['status','stage','detail','capability','sizeClass','fallback','layoutRepairs','panels','identity'];

test('validateFix accepts the documented shapes and rejects anything else',()=>{
  const good=[
    {path:'graphPlan.requiredPoints',op:'add',value:[{x:'-3/2+sqrt(3)/2',y:'1/2'}],needs:['id']},
    {path:'coordinateCanvas',op:'set',value:{width:384,height:320},range:{width:[384,720],height:[320,600]},current:{width:100,height:100}},
    {path:'displayPoints',op:'add',ids:['A','B1']},
    {path:'panels[1].plan.graphPlan.axisRatio',op:'compare',current:0.5,required:1},
    {path:'coordinateLeader',op:'choose',labels:['required-point-2-coordinates'],options:[{suggestion:'LEADER_LINE',steps:[{path:'coordinateLeader',op:'add',ids:['T']}]}]},
    {path:'graphPlan.sharedCurve.nameLabel.anchorX',op:'set',range:{x:[[null,'1'],['2',null]]}},
    {path:'a.b[0].c',op:'set',expects:'SAFE_FINITE_NUMBER'},
  ];
  for(const fix of good)assert.deepEqual(validateFix(fix),[],JSON.stringify(fix));
  const bad=[
    {path:'graphPlan.requiredPoints',op:'add',value:[{x:'the answer is 5',y:'1'}]},
    {path:'graphPlan.requiredPoints',op:'add',value:'a = 5'},
    {path:'displayPoints',op:'add',ids:['A B']},
    {path:'displayPoints',op:'add',ids:[]},
    {path:'displayPoints',op:'add',note:'free text'},
    {path:'displayPoints',op:'delete'},
    {path:'bad path',op:'set'},
    {path:'x',op:'set',expects:'anything'},
    {path:'x',op:'set',suggestion:'DO_IT'},
    {path:'x',op:'choose',options:[]},
    {path:'x',op:'choose',options:[{steps:[{path:'y',op:'add',value:'free text'}]}]},
    {path:'x',op:'add',value:{caption:'1'}},
    {path:'x',op:'set',range:{height:['a lot']}},
    {path:'x',op:'set',current:'5'},
    'not an object',
  ];
  for(const fix of bad)assert.notDeepEqual(validateFix(fix),[],JSON.stringify(fix));
});

test('wording: no hint tells the author to show fewer labels; the placer suggestions and canvas range match their sources',()=>{
  const all=HINTS.map(([,h])=>h).join('\n');
  assert.equal(all.match(/Show fewer labels|fewer panel lines|Drop some names|drop that tick/)?.[0],undefined);
  const placer=fs.readFileSync(path.join(here,'..','visual_engine','label_layout.py'),'utf8');
  // the unplaced-label trace row (the general case; the other 'suggestions' list in that file is the owner-leader clearance case)
  const rows=[...placer.matchAll(/'fallback':'POLISH_REQUIRED','suggestions':\[([^\]]*)\]/g)].map(m=>m[1].split(',').map(s=>s.trim().replace(/'/g,'')));
  assert.ok(rows.some(row=>JSON.stringify(row)===JSON.stringify(PLACER_SUGGESTIONS)),JSON.stringify(rows));
  const phase2=fs.readFileSync(path.join(here,'..','production','phase2.mjs'),'utf8');
  assert.match(phase2,/export const CANVAS_RANGE=\{width:\[384,720\],height:\[320,600\]\}/);
  assert.deepEqual(CANVAS_RANGE,{width:[384,720],height:[320,600]});
});

test('every covered code has a hint',()=>{
  const codes=['PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:2','PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:1/2','PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS:g:1','PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:g:1','PIECEWISE_POLY_REFERENCE_CURVE_EXTREMUM_NOT_IN_REQUIRED_POINTS:g:1','PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1','COORDINATE_CANVAS_BOUNDS_INVALID','COORDINATE_PANEL_TOO_TALL','LAYOUT_INVENTORY_INCOMPLETE','COMPOSITE_INPUT_NOT_CANONICAL','REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayPoints','CURVE_NAME_LEADER_ANCHOR_OFF_CURVE','PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL','EQUAL_UNIT_SCALE_MISMATCH','RENDERED_LAYOUT_FAIL'];
  for(const code of codes)assert.ok(hintFor(code).length>=1,code);
  // the first hint of the codes that carry a fix points to result.fix
  for(const code of ['COORDINATE_CANVAS_BOUNDS_INVALID','COMPOSITE_INPUT_NOT_CANONICAL','PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:2','LAYOUT_INVENTORY_INCOMPLETE','COORDINATE_PANEL_TOO_TALL'])assert.match(hintFor(code)[0],/result\.fix/,code);
});

test('NOT_IN_REQUIRED_POINTS: the fix adds the exact points, and adding them gets past the refusal',async()=>{
  const plan=golden('item16');plan.graphPlan.requiredPoints=plan.graphPlan.requiredPoints.filter(point=>point.id!=='V');
  const detailBefore='{"code":"PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1"}';
  const {r,file,log}=await run('item16',plan);
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'frame');
  assert.equal(r.detail,detailBefore,'detail is exactly what it was (no hintData in it)');
  assert.equal(r.code,'PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1');
  assert.deepEqual(r.fix,[{path:'graphPlan.requiredPoints',op:'add',value:[{x:'-1',y:'1'}],needs:['id']}]);
  assert.match(r.hint[0],/graphPlan\.requiredPoints/);
  assert.equal(r.detailFull,detailBefore);
  assert.deepEqual(file,JSON.parse(JSON.stringify(r)),'the file holds what renderPlan returned');
  const final=log.find(line=>line.kind==='final');
  assert.deepEqual(final.fix,r.fix);assert.ok(final.hint.length>=1&&final.hint[0].length<=300);
  // apply the fix: the point gets an id and the frame step no longer refuses
  const fixed=golden('item16'),[{value:[point]}]=[r.fix[0]];
  fixed.graphPlan.requiredPoints=[...plan.graphPlan.requiredPoints,{id:'V',x:point.x,y:point.y}];
  const framed=await pythonWorker({action:'frame_graph',graphPlan:fixed.graphPlan});
  assert.equal(framed.status,'OK');
});

test('NOT_IN_REQUIRED_POINTS in a discontinuous function and in a stacked pair',async()=>{
  const bowl={family:'piecewise-discontinuous',pieces:[{coefficients:['0','0','1'],domain:[null,2],end:'OPEN'},{coefficients:['3','-1'],domain:[2,null],start:'CLOSED'}],jumpValues:[],requiredPoints:[],axisTickValues:{x:[],y:[]}};
  const {r}=await run('item31',{capability:'piecewise-discontinuous-spike-v1',graphPlan:bowl,caption:'x'});
  assert.equal(r.stage,'frame');assert.match(r.code,/^PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS/);
  assert.deepEqual(r.fix,[{path:'graphPlan.requiredPoints',op:'add',value:[{x:'0',y:'0'}],needs:['id']}]);
  // g of a STACKED pair is panel 1: the author's field is graphPlan.referenceCurves[0].requiredPoints
  const pair={capability:'piecewise-discontinuous-spike-v1',graphPlan:{family:'piecewise-discontinuous',pieces:[{coefficients:['1','1'],domain:[0,2]}],requiredPoints:[],axisTickValues:{x:[],y:[]},layout:'STACKED',xWindow:[-1,4],referenceCurves:[{id:'g',pieces:[{coefficients:['0','0','1'],domain:[null,2],end:'OPEN'},{coefficients:['3','-1'],domain:[2,null],start:'CLOSED'}],requiredPoints:[],axisTickValues:{x:[],y:[]}}]},caption:'x'};
  const second=await run('item31',pair);
  assert.equal(second.r.stage,'frame');
  const f=second.r.fix?.[0];
  assert.ok(f,JSON.stringify(second.r));
  assert.equal(f.path,'graphPlan.referenceCurves[0].requiredPoints');assert.deepEqual(f.value,[{x:'0',y:'0'}]);
});

test('COORDINATE_CANVAS_BOUNDS_INVALID: the fix carries the range and the nearest allowed size',async()=>{
  const plan=golden('item01');plan.coordinateCanvas={width:100,height:900};
  const {r}=await run('item01',plan);
  assert.equal(r.stage,'spec');assert.equal(r.detail,'COORDINATE_CANVAS_BOUNDS_INVALID');assert.equal(r.detailFull,'COORDINATE_CANVAS_BOUNDS_INVALID');
  assert.deepEqual(r.fix,[{path:'coordinateCanvas',op:'set',value:{width:384,height:600},range:{width:[384,720],height:[320,600]},current:{width:100,height:900}}]);
  assert.match(r.hint[0],/384 to 720/);
  // a canvas that is not numbers still gets the range and the default size
  const odd=golden('item01');odd.coordinateCanvas={width:'wide',height:null};
  const second=await run('item01',odd);
  assert.deepEqual(second.r.fix,[{path:'coordinateCanvas',op:'set',value:{width:384,height:320},range:{width:[384,720],height:[320,600]}}]);
});

test('COORDINATE_PANEL_TOO_TALL: the fix carries the limit, the current height and options that lower or move',async()=>{
  const plan=golden('item01');plan.coordinateCanvas={width:384,height:600};plan.coordinatePlacement='PANEL';
  const {r}=await run('item01',plan);
  assert.equal(r.stage,'spec');assert.equal(r.detail,'COORDINATE_PANEL_TOO_TALL');
  const [fix]=r.fix;
  assert.equal(fix.op,'choose');assert.equal(fix.limit,600);assert.ok(fix.current>600&&fix.overBy===fix.current-600,JSON.stringify(fix));
  const paths=fix.options.flatMap(option=>option.steps.map(step=>step.path+':'+step.op));
  assert.ok(paths.includes('coordinateCanvas.height:set'),paths.join());
  assert.ok(paths.includes('coordinatePlacement:remove'),paths.join());
  const lower=fix.options[0].steps[0];
  assert.ok(lower.value<600&&lower.value>=320,JSON.stringify(lower));assert.equal(lower.current,600);
});

test('REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED: the fix lists the missing ids',async()=>{
  const plan=golden('item01');plan.displayPoints=['A','B'];
  const {r}=await run('item01',plan);
  assert.equal(r.stage,'spec');assert.equal(r.detail,'REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayPoints');
  assert.deepEqual(r.fix,[{path:'displayPoints',op:'add',ids:['C']}]);
});

test('PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL: the fix says which window holds every key point',async()=>{
  const g={family:'piecewise-discontinuous',pieces:[{coefficients:['2','1'],domain:[-3,1],end:'OPEN'},{coefficients:['0','0','1'],domain:[1,3],start:'OPEN'}],jumpValues:[{x:'1',y:'1'}],requiredPoints:[{id:'P',x:1,y:1}],axisTickValues:{x:[],y:[]},xWindow:[0.5,0.75]};
  const {r}=await run('item31',{capability:'piecewise-discontinuous-spike-v1',graphPlan:g,caption:'x'});
  assert.equal(r.stage,'frame');assert.match(r.detail,/PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL/);
  const [fix]=r.fix;
  assert.equal(fix.path,'graphPlan.xWindow');assert.equal(fix.op,'choose');assert.deepEqual(fix.current,[0.5,0.75]);
  assert.ok(fix.contains[0]<=0&&fix.contains[1]>=1,JSON.stringify(fix.contains));
  const set=fix.options.flatMap(option=>option.steps).find(step=>step.op==='set');
  assert.ok(set.value[0]<=fix.contains[0]&&set.value[1]>=fix.contains[1]);
  assert.ok(fix.options.some(option=>option.steps[0].op==='remove'));
});

test('CURVE_NAME_LEADER_ANCHOR_OFF_CURVE: the fix names the field and where the curve is defined',async()=>{
  const plan=golden('item76g7c');plan.graphPlan.referenceCurves[0].nameLabel.anchorX='10';
  const {r}=await run('item76g7c',plan);
  assert.equal(r.stage,'frame');assert.match(r.detail,/CURVE_NAME_LEADER_ANCHOR_OFF_CURVE/);
  const [fix]=r.fix;
  assert.equal(fix.path,'graphPlan.referenceCurves[0].nameLabel.anchorX');
  assert.ok(fix.options.some(option=>option.steps.some(step=>step.op==='remove')));
  assert.ok(fix.options.some(option=>option.steps.some(step=>step.op==='set'&&Array.isArray(step.range?.x)&&step.range.x.length>=1)),JSON.stringify(fix));
});

test('LAYOUT_INVENTORY_INCOMPLETE: the failed labels and the options the plan really has, mapped from the placer suggestions',()=>{
  const unresolved=['required-point-2-coordinates','required-point-3-coordinates'];
  const detail={status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved,suppressed:[]}};
  const graph={capability:'piecewise-polynomial-spike-v1',graphPlan:{requiredPoints:[{id:'A',x:0,y:0},{id:'T',x:1,y:1},{id:'V',x:2,y:2}]},coordinatePanel:['V']};
  const {hint,fix}=failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail,authored:graph,plan:graph,fallback:[]});
  assert.match(hint[0],/Do not delete them/);
  assert.equal(fix.length,1);
  const [choice]=fix;
  assert.equal(choice.op,'choose');assert.deepEqual(choice.labels,unresolved);
  const bySuggestion=Object.fromEntries(choice.options.map(option=>[option.suggestion,option.steps]));
  assert.deepEqual(Object.keys(bySuggestion).sort(),['LEADER_LINE','PANEL_SPLIT']);
  assert.deepEqual(bySuggestion.LEADER_LINE,[{path:'coordinateLeader',op:'add',ids:['T','V']},{path:'coordinatePanel',op:'remove',ids:['V']}]);
  assert.deepEqual(bySuggestion.PANEL_SPLIT,[{path:'coordinatePanel',op:'add',ids:['T']}]);
  for(const option of choice.options)assert.ok(PLACER_SUGGESTIONS.includes(option.suggestion));
  assert.equal(choice.path,choice.options[0].steps[0].path);
  // steps the render already tried by itself are not offered again
  const tried=failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail,authored:graph,plan:graph,fallback:['COORDINATE_LEADER','COORDINATE_PANEL_PARTIAL','COORDINATE_PANEL']});
  assert.deepEqual(tried.fix,[]);
  // a construction: coordinate labels go to the band or the canvas grows (to the contract maximum), a plane figure's mark labels are pulled out with planeMarks.callouts
  const construction={capability:'construction-spike-v1',mathPlan:{nodes:[]},coordinateLabels:['A','B'],planeMarks:{angles:[{id:'a1'}]},coordinateCanvas:{width:480,height:400}};
  const second=failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail:{status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['B-coordinate','a1-label'],suppressed:[]}},authored:construction,plan:construction,fallback:['COORDINATE_PANEL_PARTIAL','COORDINATE_PANEL']});
  const kinds=Object.fromEntries(second.fix[0].options.map(option=>[option.suggestion,option.steps]));
  assert.deepEqual(kinds.LEADER_LINE,[{path:'planeMarks.callouts',op:'add',ids:['a1']}]);
  assert.deepEqual(kinds.VIEWPORT_EXPANSION[0].value,{width:720,height:600});assert.deepEqual(kinds.VIEWPORT_EXPANSION[0].current,{width:480,height:400});
  assert.equal(kinds.PANEL_SPLIT,undefined,'the band was already tried');
  // inside a composite the path points into the panel
  const composite={capability:'composite-panels-v1',panels:[{plan:{}},{plan:{capability:'piecewise-polynomial-spike-v1',graphPlan:{requiredPoints:[{id:'A',x:0,y:0}]}}}]};
  const third=failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail:{status:'COMPOSITE_PANEL_NOT_COMPOSED',detail:{panel:1,status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['required-point-1-coordinates'],suppressed:[]}}},authored:composite,plan:composite,fallback:[]});
  assert.deepEqual(third.fix[0].options.map(option=>option.steps[0].path),['panels[1].plan.coordinatePanel']);
});

test('LAYOUT_INVENTORY_INCOMPLETE on a real crowded figure: the result file and the log carry the failed labels and the options',async()=>{
  // five points, four of them within 1-2 units of each other in a window 30 wide: their coordinate labels cannot stand beside the dots, and coordinatePanel:[] fixes the placement,
  // so the render's own band steps are off and only the canvas steps run before it gives up
  const plan=golden('item01'),node=(id,x,y,role='GIVEN')=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[{kind:'integer',value:String(x)},{kind:'integer',value:String(y)}]},outputType:'POINT',factRole:role});
  plan.mathPlan.nodes=[node('A',0,0),node('B',1,0),node('C',0,1),node('D',2,1),node('E',30,30,'CONCLUSION')];
  delete plan.mathPlan.conditionAudits;delete plan.scalarLabels;
  plan.displaySegments=[{id:'sAB',refs:['A','B']}];plan.coordinateLabels=['A','B','C','D','E'];plan.coordinatePanel=[];plan.sourceConditions=plan.sourceConditions.slice(0,1);
  const {r,file,log}=await run('item01',plan);
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'compose');assert.equal(r.code,'LAYOUT_INVENTORY_INCOMPLETE');
  assert.ok(r.detail.length<=600&&r.detailFull.startsWith(r.detail.slice(0,50)));
  assert.match(r.hint[0],/Do not delete them/);assert.doesNotMatch(r.hint.join(' '),/Show fewer labels/);
  const [fix]=r.fix;
  assert.equal(fix.op,'choose');assert.ok(fix.labels.includes('A-coordinate'));
  const bySuggestion=Object.fromEntries(fix.options.map(option=>[option.suggestion,option.steps]));
  assert.deepEqual(bySuggestion.PANEL_SPLIT,[{path:'coordinatePanel',op:'add',ids:['A','B','C','D']}]);
  assert.deepEqual(bySuggestion.VIEWPORT_EXPANSION[0].value,{width:720,height:600});
  for(const option of fix.options)assert.ok(PLACER_SUGGESTIONS.includes(option.suggestion));
  assert.deepEqual(validateFix(fix),[]);
  assert.deepEqual(file.fix,r.fix);
  const final=log.find(line=>line.kind==='final');assert.deepEqual(final.fix,r.fix);assert.equal(final.code,'LAYOUT_INVENTORY_INCOMPLETE');
});

test('COMPOSITE_INPUT_NOT_CANONICAL: the fix names the field that is not canonical JSON',()=>{
  const composite={capability:'composite-panels-v1',panels:[{plan:{graphPlan:{a:1}}},{plan:{graphPlan:{requiredPoints:[{id:'A',x:1e300,y:1}]}}}]};
  const detail={status:'COMPOSITE_INPUT_NOT_CANONICAL',detail:{reason:'panelPlan'}};
  const {hint,fix}=failureGuidance({code:'COMPOSITE_INPUT_NOT_CANONICAL',detail,authored:composite,plan:composite});
  assert.match(hint[0],/canonical JSON/);
  assert.deepEqual(fix,[{path:'panels[1].plan.graphPlan.requiredPoints[0].x',op:'set',expects:'SAFE_FINITE_NUMBER'}]);
  const whole=failureGuidance({code:'COMPOSITE_INPUT_NOT_CANONICAL',detail:{status:'COMPOSITE_INPUT_NOT_CANONICAL',detail:{reason:'plan'}},authored:composite,plan:composite});
  assert.equal(whole.fix[0].path,'panels[1].plan.graphPlan.requiredPoints[0].x');
  // an engine value (the model) is not the author's field: hint only
  assert.deepEqual(failureGuidance({code:'COMPOSITE_INPUT_NOT_CANONICAL',detail:{status:'COMPOSITE_INPUT_NOT_CANONICAL',detail:{reason:'model'}},authored:composite,plan:composite}).fix,[]);
});

test('EQUAL_UNIT_SCALE_MISMATCH: the declared ratio against the one the declaration requires',()=>{
  const plan={capability:'piecewise-polynomial-spike-v1',graphPlan:{equalUnits:true,axisRatio:0.5,axisSqueeze:true}};
  const {fix}=failureGuidance({code:'EQUAL_UNIT_SCALE_MISMATCH',detail:{status:'STATIC_GRAPH_AUDIT_FAIL',detail:{errors:['EQUAL_UNIT_SCALE_MISMATCH']}},authored:plan,plan});
  assert.deepEqual(fix[0],{path:'graphPlan.axisRatio',op:'compare',current:0.5,required:1});
  assert.deepEqual(fix[1].options,[{steps:[{path:'graphPlan.axisSqueeze',op:'remove'}]}]);
  const scaled={capability:'multi-curve-figure-v1',graphPlan:{axisScale:{x:'1',y:'2'},axisRatio:2}};
  assert.equal(failureGuidance({code:'EQUAL_UNIT_SCALE_MISMATCH',detail:{errors:['EQUAL_UNIT_SCALE_MISMATCH']},authored:scaled,plan:scaled}).fix[0].required,2);
});

test('fixes never carry text outside the shape, whatever the plan says',()=>{
  // a plan full of text where ids go: nothing of it may reach a fix
  const hostile={capability:'piecewise-polynomial-spike-v1',graphPlan:{requiredPoints:[{id:'the answer is 7',x:0,y:0},{id:'B',x:1,y:1}]},coordinatePanel:['x = 7'],displayPoints:['y=5']};
  const detail={status:'LAYOUT_INVENTORY_INCOMPLETE',detail:{unresolved:['required-point-1-coordinates','required-point-2-coordinates','a is 5 label'],suppressed:[{id:'B-coordinate'}]}};
  const {fix}=failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail,authored:hostile,plan:hostile});
  for(const item of fix)assert.deepEqual(validateFix(item),[]);
  const text=JSON.stringify(fix);
  assert.doesNotMatch(text,/answer|x = 7|a is 5|y=5/);
  assert.deepEqual(failureGuidance({code:'REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED',detail:'REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayPoints x',authored:hostile,plan:hostile,hintData:{kind:'SOURCE_GEOMETRY_NOT_DISPLAYED',field:'displayPoints',missing:['seven is 7','C']}}).fix,[{path:'displayPoints',op:'add',ids:['C']}]);
  assert.deepEqual(failureGuidance({code:'X',detail:'x',hintData:{kind:'ADD_REQUIRED_POINTS',points:[{x:'7 apples',y:'1'},{x:'1/2',y:'sqrt(2)'}]}}).fix,[{path:'graphPlan.requiredPoints',op:'add',value:[{x:'1/2',y:'sqrt(2)'}],needs:['id']}]);
  // guidance never throws
  assert.deepEqual(failureGuidance({code:'LAYOUT_INVENTORY_INCOMPLETE',detail:undefined,authored:undefined,plan:undefined,hintData:undefined}).fix,[]);
});

test('detail keeps its 600 character clip; detailFull and the log keep everything',async()=>{
  const out=tmp(),long=path.join(out,'x'.repeat(900)+'.json');
  const r=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:long,outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'read-plan');
  assert.equal(r.detail.length,600);
  assert.ok(r.detailFull.length>900&&r.detailFull.startsWith(r.detail));
  const file=JSON.parse(fs.readFileSync(path.join(out,'t-result.json'),'utf8'));
  assert.equal(file.detailFull,r.detailFull);assert.equal(file.detail,r.detail);
  assert.deepEqual(Object.keys(file).filter(key=>cleanKeys.includes(key)),['status','stage','detail','identity']);
  assert.equal(file.hint,undefined);assert.equal(file.fix,undefined);
});
