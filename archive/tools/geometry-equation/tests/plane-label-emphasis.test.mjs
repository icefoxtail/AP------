// Plane-figure label kinds (E8): plain Korean TEXT labels (labelKind:'TEXT') and units (cm, m, mm) on expression labels, circular-arc labels and
// construction traces, with the independent observer reading what each label says back from the final SVG (and its tamper cases); segment
// emphasis (E10: displaySegments[].emphasis BOLD / ACCENT); framing room for labels on arcs outside their circle (E11).
// Real SymPy/Cindy workers and real Chrome; the typography policy is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {arcLabelFraming,arcLabelSites} from '../production/plane-marks.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});

// A half circle on the diameter AB (centre O, radius 6) with C at 130 degrees and D at 80 degrees (the 26_신흥중 q15 figure).
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),source('A',-6,0),source('B',6,0),polar('C','O','B',6,130),polar('D','O','B',6,80),
  derived('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(6)})]};
const SEGMENTS=[{id:'sAO',refs:['A','O']},{id:'sOB',refs:['O','B']},{id:'sOC',refs:['O','C']},{id:'sBD',refs:['B','D']}];
const planOf=(planeMarks,{canvas={width:640,height:380},segments=SEGMENTS}={})=>({capability:'construction-spike-v1',caption:'반원 O에서 호 AC와 호 BD이다.',mathPlan:graph,
  displayPoints:['A','O','B','C','D'],displayLines:[],displayCircles:[],displaySegments:segments,coordinateCanvas:canvas,planeMarks});
const SEMICIRCLE={id:'arcAB',circle:'k',center:'O',from:'A',to:'B',side:'CW',highlight:false};
const marks={
  arcs:[SEMICIRCLE,{id:'arcAC',circle:'k',center:'O',from:'A',to:'C',side:'MINOR',label:'호 AC',labelKind:'TEXT'},
    {id:'arcBD',circle:'k',center:'O',from:'B',to:'D',side:'MINOR',label:'16',labelKind:'MATH',unit:'cm'}],
  expressionLabels:[{id:'nOB',ownerSegment:'sOB',text:'6',unit:'cm'},{id:'nOC',ownerSegment:'sOC',text:'x',unit:'cm'},{id:'nBD',ownerSegment:'sBD',text:'㉠',labelKind:'TEXT'}]};
const clone=value=>JSON.parse(JSON.stringify(value));

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,{planeMarks=marks,segments=SEGMENTS,points}={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(graph).points,marks:planeMarks,segments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const groupOf=(svg,id)=>new RegExp('<g id="'+id+'"[^>]*>').exec(svg)[0];
const regroup=(svg,id,change)=>{const tag=groupOf(svg,id);return svg.replace(tag,change(tag));};
const specError=(planeMarks,options)=>{try{specFor(planOf(planeMarks,options),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);

test('TEXT and unit labels on expression labels and arcs compose; the observer reads each back from the final SVG',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS');assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const tex=id=>/data-tex="([^"]*)"/.exec(groupOf(composed.svg,id))?.[1],text=id=>/data-text="([^"]*)"/.exec(groupOf(composed.svg,id))?.[1];
  assert.equal(tex('nOB'),'6\\mathrm{cm}','a number takes the unit attached');
  assert.equal(tex('nOC'),'x\\,\\mathrm{cm}','a letter keeps one space before the unit');
  assert.equal(tex('arcBD-label'),'16\\mathrm{cm}');
  assert.equal(text('nBD'),'㉠');assert.equal(text('arcAC-label'),'호 AC');
  assert.ok(!/data-tex=/.test(groupOf(composed.svg,'nBD')),'a TEXT label is plain text, not math');
  assert.ok(!/data-c="/.test(composed.svg.slice(composed.svg.indexOf('id="nBD"'),composed.svg.indexOf('</svg>',composed.svg.indexOf('id="nBD"')))),'no math glyphs in a TEXT label');
  const rows=Object.fromEntries(composed.staticAudit.planeMarks.observations.filter(row=>row.id).map(row=>[row.id,row]));
  assert.equal(rows.nBD.labelKind,'TEXT');assert.equal(rows.nOB.unit,'cm');
});

test('the observer fails a changed TEXT string, a math glyph in a TEXT label, a wrong unit and a wrong spacing',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  assert.ok(codes(await observe(regroup(composed.svg,'nBD',tag=>tag.replace('data-text="㉠"','data-text="㉡"')))).includes('LABEL_TEXT_MISMATCH'));
  assert.ok(codes(await observe(regroup(composed.svg,'arcAC-label',tag=>tag.replace('data-text="호 AC"','data-tex="AC"')))).includes('LABEL_TEXT_MISMATCH'));
  // a unit label whose unit glyphs are not the declared unit (the first c of "cm" turned into a d)
  const start=composed.svg.indexOf('id="nOB"'),end=composed.svg.indexOf('</svg>',start);
  const wrongUnit=composed.svg.slice(0,start)+composed.svg.slice(start,end).replace('data-c="63"','data-c="64"')+composed.svg.slice(end);
  assert.ok(codes(await observe(wrongUnit)).includes('LABEL_UNIT_MISMATCH'));
  assert.ok(codes(await observe(regroup(composed.svg,'nOC',tag=>tag.replace('x\\,\\mathrm{cm}','x\\mathrm{cm}')))).includes('LABEL_UNIT_SPACING_MISMATCH'));
  assert.ok(codes(await observe(regroup(composed.svg,'nOB',tag=>tag.replace('6\\mathrm{cm}','6\\,\\mathrm{cm}')))).includes('LABEL_UNIT_SPACING_MISMATCH'));
  // the plan says TEXT but the SVG label was typeset as math (and the reverse)
  const asMath=clone(marks);asMath.expressionLabels[2].labelKind='MATH';
  assert.ok(codes(await observe(composed.svg,{planeMarks:asMath})).includes('LABEL_KIND_MISMATCH'));
  const asText=clone(marks);asText.expressionLabels[0].labelKind='TEXT';delete asText.expressionLabels[0].unit;
  assert.ok(codes(await observe(composed.svg,{planeMarks:asText})).includes('LABEL_KIND_MISMATCH'));
});

test('a label stays beside its own arc and own segment: moved away it fails the observer',async()=>{
  const moved=regroup(composed.svg,'arcAC-label',tag=>{const match=/translate\(([-\d.]+) ([-\d.]+)\)/.exec(tag);return tag.replace(match[0],`translate(${Number(match[1])+330} ${Number(match[2])})`);});
  const found=codes(await observe(moved));
  assert.ok(found.some(code=>['ARC_LABEL_AMBIGUOUS_OWNER','ARC_LABEL_INSIDE_CIRCLE','MARK_LABEL_OVERLAPS','MARK_LEADER_NOT_ON_OWNER','MARK_LEADER_NOT_ON_LABEL'].includes(code)),found.join());
});

test('a TEXT or unit trace label is drawn outside its arc and read back (an order sign ㉡, a radius 3cm)',async()=>{
  const traced=clone(marks);
  traced.traces=[{id:'tO',center:'O',radius:{point:'C'},through:['C','D'],spanDeg:30,label:'㉡',labelKind:'TEXT'}];
  const plan=planOf(traced),result=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
  assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));assert.equal(result.staticAudit.planeMarks.status,'PASS',JSON.stringify(result.staticAudit.planeMarks.errors));
  assert.match(groupOf(result.svg,'tO-label'),/data-text="㉡"/);
  const radius=clone(marks);radius.traces=[{id:'tO',center:'O',radius:{point:'C'},through:['C'],spanDeg:30,label:'6',unit:'cm'}];
  const second=await composeConstructionCandidate({plan:planOf(radius),model,identity,typographyPolicy:policy,browser});
  assert.equal(second.status,'COMPOSED',JSON.stringify(second.detail));assert.equal(second.staticAudit.planeMarks.status,'PASS',JSON.stringify(second.staticAudit.planeMarks.errors));
  assert.match(groupOf(second.svg,'tO-label'),/data-tex="6\\mathrm\{cm\}"/);
  const wrong=await observe(regroup(second.svg,'tO-label',tag=>tag.replace('6\\mathrm{cm}','6\\,\\mathrm{cm}')),{planeMarks:radius});
  assert.ok(codes(wrong).includes('LABEL_UNIT_SPACING_MISMATCH'));
});

test('error codes: a bad kind, unit or label is refused with an explicit code',()=>{
  const with_=change=>{const copy=clone(marks);change(copy);return copy;};
  expectCode(specError(with_(m=>{m.expressionLabels[0].unit='km';})),'MARK_UNIT_INVALID');
  expectCode(specError(with_(m=>{m.expressionLabels[2].unit='cm';})),'MARK_UNIT_REQUIRES_MATH_LABEL');
  expectCode(specError(with_(m=>{m.arcs[1].unit='cm';})),'MARK_UNIT_REQUIRES_MATH_LABEL');
  expectCode(specError(with_(m=>{m.arcs[2].labelKind='DEGREE';})),'MARK_UNIT_REQUIRES_MATH_LABEL');
  expectCode(specError(with_(m=>{delete m.arcs[2].label;})),'MARK_UNIT_REQUIRES_LABEL');
  expectCode(specError(with_(m=>{m.expressionLabels[0].labelKind='SYMBOL';})),'MARK_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.expressionLabels[2].text='a'.repeat(41);})),'MARK_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.expressionLabels[2].text='$x$';})),'MARK_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.arcs[1].label='가\n나';})),'MARK_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.arcs[1].labelKind='SYMBOL';})),'MARK_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.traces=[{id:'tO',center:'O',radius:{point:'C'},through:['C'],label:'0'}];})),'TRACE_LABEL_INVALID');
  expectCode(specError(with_(m=>{m.traces=[{id:'tO',center:'O',radius:{point:'C'},through:['C'],label:'㉠'}];})),'TRACE_LABEL_INVALID');
  expectCode(specError(with_(m=>{m.traces=[{id:'tO',center:'O',radius:{point:'C'},through:['C'],label:'㉠',labelKind:'TEXT',unit:'cm'}];})),'MARK_UNIT_REQUIRES_MATH_LABEL');
  expectCode(specError(with_(m=>{m.angles=[{id:'aOC',refs:['A','O','C'],value:50,label:'50',unit:'cm'}];})),'MARK_FIELD_UNKNOWN');
  // the defaults are unchanged: no labelKind and no unit is the old math label
  assert.doesNotThrow(()=>specFor(planOf({arcs:[SEMICIRCLE,{id:'arcAC',circle:'k',center:'O',from:'A',to:'C',label:'50'}]}),model,identity.assetId));
  assert.doesNotThrow(()=>specFor(planOf({arcs:[SEMICIRCLE],traces:[{id:'tO',center:'O',radius:{point:'C'},through:['C'],label:'3'}]}),model,identity.assetId));
});

test('E10: displaySegments emphasis singles out the declared segments; the observer fails an undeclared or missing emphasis',async()=>{
  const segments=SEGMENTS.map(row=>row.id==='sOB'?{...row,emphasis:'BOLD'}:row.id==='sOC'?{...row,emphasis:'ACCENT'}:row);
  const plan=planOf({arcs:[SEMICIRCLE]},{segments}),result=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
  assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));assert.equal(result.staticAudit.planeMarks.status,'PASS',JSON.stringify(result.staticAudit.planeMarks.errors));
  const style=id=>{const tag=new RegExp('<line\\s(?:[^>]*\\s)?id="'+id+'"[^>]*/>').exec(result.svg)[0];return [/stroke="([^"]*)"/.exec(tag)[1],Number(/stroke-width="([^"]*)"/.exec(tag)[1])];};
  assert.deepEqual(style('sOB'),['#111',3.2]);assert.deepEqual(style('sOC'),['#c0392b',3.2]);
  assert.deepEqual(style('sAO'),['#111',1.6]);assert.deepEqual(style('sBD'),['#111',1.6]);
  const rows=result.staticAudit.planeMarks.observations.filter(row=>row.type==='SEGMENT_EMPHASIS').map(row=>[row.id,row.emphasis]);
  assert.deepEqual(rows,[['sOB','BOLD'],['sOC','ACCENT']]);
  const observeSegments=async(svg,list)=>observe(svg,{planeMarks:{arcs:[SEMICIRCLE]},segments:list});
  assert.deepEqual(codes(await observeSegments(result.svg,segments)),[]);
  assert.ok(codes(await observeSegments(result.svg,SEGMENTS)).filter(code=>code==='SEGMENT_EMPHASIS_UNDECLARED').length===2,'the plan no longer singles them out');
  assert.ok(codes(await observeSegments(result.svg,segments.map(row=>row.id==='sAO'?{...row,emphasis:'BOLD'}:row))).includes('SEGMENT_EMPHASIS_MISSING'));
  assert.ok(codes(await observeSegments(result.svg,segments.map(row=>row.id==='sOB'?{...row,emphasis:'ACCENT'}:row))).includes('SEGMENT_EMPHASIS_COLOR_MISMATCH'));
  // a plan without emphasis keeps its old frame, segment styles and bytes
  const plain=await composeConstructionCandidate({plan:planOf({arcs:[SEMICIRCLE]}),model,identity,typographyPolicy:policy,browser});
  assert.ok(!plain.svg.includes('c0392b')&&!/stroke-width="3\.2"/.test(plain.svg.replace(/<polyline[^>]*>/g,'')));
});

test('E10 error codes: a bad emphasis is refused with an explicit code',()=>{
  const bad=value=>{try{specFor(planOf({arcs:[SEMICIRCLE]},{segments:SEGMENTS.map(row=>row.id==='sOB'?{...row,emphasis:value}:row)}),model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the emphasis');};
  expectCode(bad('RED'),'DISPLAY_SEGMENT_EMPHASIS_INVALID');expectCode(bad(true),'DISPLAY_SEGMENT_EMPHASIS_INVALID');expectCode(bad('bold'),'DISPLAY_SEGMENT_EMPHASIS_INVALID');
  assert.doesNotThrow(()=>specFor(planOf({arcs:[SEMICIRCLE]},{segments:SEGMENTS.map(row=>row.id==='sOB'?{...row,emphasis:'ACCENT'}:row)}),model,identity.assetId));
  // not on a graph plan: the plane styles need a plane figure or a coordinate construction
  const notPlane={...planOf({arcs:[SEMICIRCLE]}),mathPlan:{...graph,realization:undefined}};delete notPlane.mathPlan.realization;
  assert.throws(()=>specFor({...notPlane,displaySegments:SEGMENTS.map(row=>row.id==='sOB'?{...row,emphasis:'BOLD'}:row)},model,identity.assetId));
});

// ---- E11: framing room for a label on an arc outside its circle
const TIGHT={width:384,height:320};
const LABELLED_ARCS=[SEMICIRCLE,{id:'arcAC',circle:'k',center:'O',from:'A',to:'C',side:'MINOR',label:'10',labelKind:'MATH',unit:'cm'},
  {id:'arcCD',circle:'k',center:'O',from:'C',to:'D',side:'MINOR',label:'6',labelKind:'MATH',unit:'cm'},{id:'arcBD',circle:'k',center:'O',from:'B',to:'D',side:'MINOR',label:'16',labelKind:'MATH',unit:'cm'}];
const viewportOf=(planeMarks,canvas)=>specFor(planOf(planeMarks,{canvas}),model,identity.assetId).viewport;
const boundsOf=viewport=>({xMin:viewport.xMin,xMax:viewport.xMax,yMin:viewport.yMin,yMax:viewport.yMax});

test('E11: a plan without an arc label keeps the tight plane frame (6% of the span around the displayed points)',()=>{
  const points=['A','O','B','C','D'].map(id=>model.points[id].approximation),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys)),pad=span*.06;
  const legacy={xMin:Math.min(...xs)-pad,xMax:Math.max(...xs)+pad,yMin:Math.min(...ys)-pad,yMax:Math.max(...ys)+pad};
  assert.deepEqual(boundsOf(viewportOf({arcs:[SEMICIRCLE]},TIGHT)),legacy);
  assert.deepEqual(boundsOf(viewportOf({arcs:[SEMICIRCLE]},{width:640,height:380})),legacy);
  assert.deepEqual(boundsOf(viewportOf({arcs:[SEMICIRCLE],expressionLabels:[{id:'nOB',ownerSegment:'sOB',text:'6',unit:'cm'}]},TIGHT)),legacy,'a segment label does not widen the frame');
  // an arc without a label does not either
  assert.deepEqual(boundsOf(viewportOf({arcs:[SEMICIRCLE,{id:'arcAC',circle:'k',center:'O',from:'A',to:'C'}]},TIGHT)),legacy);
});

test('E11: labelled arcs widen the frame only on the sides their labels hang, and leave every label its room',()=>{
  const plain=boundsOf(viewportOf({arcs:[SEMICIRCLE]},TIGHT)),framed=boundsOf(viewportOf({arcs:LABELLED_ARCS},TIGHT));
  assert.ok(framed.xMin<plain.xMin&&framed.xMax>plain.xMax,JSON.stringify([plain,framed]));
  assert.ok(framed.yMin>=plain.yMin-1e-9&&framed.yMax>=plain.yMax-1e-9,'the frame never shrinks');
  assert.ok(framed.yMin===plain.yMin,'nothing hangs below the diameter: no room is added there');
  // recompute the screen position of every label anchor from the returned frame and check the room (independently of the growth loop)
  const sites=arcLabelSites(planOf({arcs:LABELLED_ARCS},{canvas:TIGHT}),model,Object.fromEntries(['A','O','B','C','D'].map(id=>[id,model.points[id]])));
  assert.equal(sites.length,3);
  const M=32,plotW=TIGHT.width-2*M,plotH=TIGHT.height-2*M,sx=Math.min(plotW/(framed.xMax-framed.xMin),plotH/(framed.yMax-framed.yMin));
  const left=M+(plotW-sx*(framed.xMax-framed.xMin))/2,top=M+(plotH-sx*(framed.yMax-framed.yMin))/2;
  for(const site of sites){
    const X=left+(site.anchor[0]-framed.xMin)*sx,Y=top+(framed.yMax-site.anchor[1])*sx;
    if(site.outward[0]>.38)assert.ok(X+18+site.width<=TIGHT.width-12+.06,site.id+' right');
    if(site.outward[0]<-.38)assert.ok(X-18-site.width>=12-.06,site.id+' left');
    if(site.outward[1]>.38)assert.ok(Y-18-site.height>=12-.06,site.id+' top');
    assert.ok(site.width>0&&site.height>0);
  }
});

test('E11: the framing function is exact about what it changes (pure unit checks)',()=>{
  const plan=planOf({arcs:LABELLED_ARCS},{canvas:TIGHT}),points=Object.fromEntries(['A','O','B','C','D'].map(id=>[id,model.points[id]]));
  const bounds={xMin:-6.72,xMax:6.72,yMin:-.72,yMax:6.63};
  assert.deepEqual(arcLabelFraming({...plan,planeMarks:{arcs:[SEMICIRCLE]}},model,points,bounds,TIGHT),bounds,'no labelled arc: unchanged');
  const notPlane={...plan,mathPlan:{...plan.mathPlan,realization:{...plan.mathPlan.realization,recipeId:'SOURCE_COORDINATE_AXES_v1'}}};
  assert.deepEqual(arcLabelFraming(notPlane,model,points,bounds,TIGHT),bounds,'only a plane figure is reframed');
  const framed=arcLabelFraming(plan,model,points,bounds,TIGHT);
  assert.ok(framed.xMin<=bounds.xMin&&framed.xMax>=bounds.xMax&&framed.yMin<=bounds.yMin&&framed.yMax>=bounds.yMax,'bounds only grow');
  assert.deepEqual(arcLabelFraming(plan,model,points,framed,TIGHT),framed,'a framed plan is already framed (idempotent)');
  // a wider canvas needs less widening
  const wide=arcLabelFraming(plan,model,points,bounds,{width:720,height:380});
  assert.ok(wide.xMax-wide.xMin<=framed.xMax-framed.xMin+1e-9);
  // an arc label that cannot be placed (an unknown circle) is left to planeMarkSpec's own error
  assert.deepEqual(arcLabelFraming({...plan,planeMarks:{arcs:[{id:'x',circle:'nope',center:'O',from:'A',to:'C',label:'3'}]}},model,points,bounds,TIGHT),bounds);
});

test('E11: labels hung outside the half circle compose on a tight canvas and pass the observer',async()=>{
  const plan=planOf({arcs:LABELLED_ARCS},{canvas:TIGHT}),result=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
  assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));
  assert.equal(result.staticAudit.planeMarks.status,'PASS',JSON.stringify(result.staticAudit.planeMarks.errors));
  for(const id of ['arcAC-label','arcCD-label','arcBD-label']){
    const match=new RegExp('<g id="'+id+'"[^>]*transform="translate\\(([-\\d.]+) ([-\\d.]+)\\)"').exec(result.svg);assert.ok(match,id);
    assert.ok(Number(match[1])>=12-1e-6&&Number(match[2])>=12-1e-6,id+' inside the safe area');
  }
});
