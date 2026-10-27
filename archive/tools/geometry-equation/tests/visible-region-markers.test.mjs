// Visible region markers on a plane figure: a source that names its parts (가)/(나) and says 빗금친 must show plain-text region labels and a real
// hatch pattern clipped to that region (planeMarks.regions labelKind:'TEXT' + pattern:'HATCH'). Real SymPy/Cindy workers and real Chrome; the
// typography policy is the same FIXTURE as region-fill.test.mjs (not an Archive observation). Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const OBSERVER=fileURLToPath(new URL('../production/plane-marks-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',520,520]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:520,naturalHeight:520}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:520,height:520},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});

// Concentric circles about O: the annulus 1<|OP|<=3 is the hatched (가), the inner disk r=1 is the coloured (나).
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),source('P',0,-1),source('Q',0,-3),
  {...node('kInner','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(1)}),factRole:'DERIVED_INTERMEDIATE'},
  {...node('kOuter','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(3)}),factRole:'DERIVED_INTERMEDIATE'}]};
const whole=point=>({loop:{start:point,steps:[{to:point,arc:{center:'O',side:'FULL'}}]}});
const marks={regions:[
  {id:'ring',fill:'LIGHT',pattern:'HATCH',label:'(가) 8πr²',labelKind:'TEXT',factRole:'CONCLUSION',shapes:[whole('Q')],holes:[whole('P')]},
  {id:'inner',fill:'LIGHT',label:'(나)',labelKind:'TEXT',factRole:'CONCLUSION',shapes:[whole('P')]}]};
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'두 원의 중심이 O이고 2OP=PQ일 때 빗금친 고리 (가)의 넓이는 8πr², 색칠한 부분 (나)의 넓이는 πr²이므로 넓이의 비는 8:1이다.',
  mathPlan:graph,displayPoints:['O','P','Q'],displaySegments:[{id:'sOP',refs:['O','P']},{id:'sOQ',refs:['O','Q']}],displayCircles:['kOuter','kInner'],
  planeMarks,coordinateCanvas:{width:520,height:520},sourceConditions:[{id:'c1',condition:'2OP=PQ',mappedTo:['O','P','Q']}],newVisualInformation:['(가)는 빗금, (나)는 색칠']});
const clone=value=>JSON.parse(JSON.stringify(value));

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,{points,planeMarks=marks}={})=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:points??reconstruct(graph).points,marks:planeMarks,segments:planOf(marks).displaySegments,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const specError=(planeMarks,plan=planOf(planeMarks))=>{try{specFor(plan,model,identity.assetId);}catch(error){return String(error.message);}assert.fail('specFor accepted the regions');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);
const with_=change=>{const copy=clone(marks);change(copy);return copy;};

test('a named + hatched source composes: plain-text (가)/(나) labels and real hatch strokes clipped to the region',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  const svg=composed.svg;
  const hatch=[...svg.matchAll(/<line id="(ring-hatch-\d+)"[^>]*data-mark="region-hatch"[^>]*\/>/g)].map(match=>match[0]);
  assert.ok(hatch.length>=3,'the hatched region carries real strokes: '+hatch.length);
  assert.ok(hatch.every(tag=>/stroke-width="0\.8"/.test(tag)),'hatch strokes use the thin indicator width');
  assert.ok(hatch.every(tag=>!/stroke-dasharray/.test(tag)),'hatch strokes are solid');
  const fill=composed.staticAudit.planeMarks.observations.filter(row=>row.type==='REGION');
  assert.deepEqual(fill.map(row=>row.id),['ring','inner']);
  assert.equal(fill[0].pattern,'HATCH');assert.equal(fill[0].labelKind,'TEXT');assert.equal(fill[1].pattern,null);
  const hatchObservation=composed.staticAudit.planeMarks.observations.find(row=>row.type==='REGION_HATCH');
  assert.equal(hatchObservation.id,'ring');assert.ok(hatchObservation.strokes>=3);
  // the plain-text labels are frozen TEXT fragments (a drawn outline path, no math markup), not math typesetting
  for(const [id,text] of [['ring-label','(가) 8πr²'],['inner-label','(나)']]){
    const group=new RegExp('<g id="'+id+'"[^>]*data-owner="'+id.split('-')[0]+'"[^>]*>([\\s\\S]*?)</g>').exec(svg);
    assert.ok(group,id+' label group exists');
    assert.ok(/<path d="[^"]+"/.test(group[1]),id+' carries glyph outlines');
    assert.equal(/data-c=/.test(group[1]),false,id+' must be plain text, not a math fragment');
    assert.ok(text.length>0);
  }
  // the hatch is painted after its fill and beneath every boundary stroke
  assert.ok(svg.indexOf('id="ring-hatch-1"')>svg.indexOf('id="ring"'),'hatch above the fill');
  assert.ok(svg.indexOf('id="ring-hatch-1"')<svg.indexOf('id="kOuter"'),'hatch beneath the strokes');
});

test('the genuine SVG passes the standalone observer; an undeclared hatch or a wrong fill still fails',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  const noPattern=clone(marks);delete noPattern.regions[0].pattern;
  assert.ok(codes(await observe(composed.svg,{planeMarks:noPattern})).includes('UNDECLARED_MARK'));
  const darker=clone(marks);darker.regions[1].fill='MEDIUM';assert.ok(codes(await observe(composed.svg,{planeMarks:darker})).includes('REGION_FILL_MISMATCH'));
});

test('tamper: the hatch must stay inside its region, evenly spaced and above the fill; the labels must belong to their own regions',async()=>{
  const lines=[...composed.svg.matchAll(/<line id="ring-hatch-\d+"[^>]*data-mark="region-hatch"[^>]*\/>/g)].map(match=>match[0]);
  // every hatch stroke removed: the (가) region is no longer hatched
  const stripped=lines.reduce((svg,tag)=>svg.replace(tag,''),composed.svg);
  assert.ok(codes(await observe(stripped)).includes('REGION_HATCH_MISSING'));
  // one stroke pushed outside the annulus
  const moved=composed.svg.replace(lines[Math.floor(lines.length/2)],lines[Math.floor(lines.length/2)].replace(/x1="([-\d.]+)"/,(_,x)=>`x1="${Number(x)+140}"`).replace(/x2="([-\d.]+)"/,(_,x)=>`x2="${Number(x)+140}"`));
  assert.ok(codes(await observe(moved)).includes('REGION_HATCH_OUTSIDE'));
  // one stroke shifted across its neighbours: the spacing is no longer even
  const uneven=composed.svg.replace(lines[1],lines[1].replace(/y1="([-\d.]+)"/,(_,y)=>`y1="${Number(y)+5}"`).replace(/y2="([-\d.]+)"/,(_,y)=>`y2="${Number(y)+5}"`));
  assert.ok(codes(await observe(uneven)).includes('REGION_HATCH_UNEVEN'));
  // a dashed hatch stroke
  const dashed=composed.svg.replace(lines[0],lines[0].replace('/>',' stroke-dasharray="4 3"/>'));
  assert.ok(codes(await observe(dashed)).includes('REGION_HATCH_DASHED'));
  // the hatch moved beneath the fill it belongs to
  const ringFill=/<path id="ring"[^>]*\/>/.exec(composed.svg)[0];
  const sunk=lines.reduce((svg,tag)=>svg.replace(tag,''),composed.svg).replace(ringFill,lines.join('')+ringFill);
  assert.ok(codes(await observe(sunk)).includes('REGION_HATCH_COVERED_BY_FILL'));
  // the (가) label dragged into the inner disk: outside the annulus and inside the other region
  const ring=/<g id="ring-label"[^>]*transform="translate\(([-\d.]+) ([-\d.]+)\)"/.exec(composed.svg);
  const centre=/<g id="inner-label"[^>]*>/.exec(composed.svg);
  const centreAt=/transform="translate\(([-\d.]+) ([-\d.]+)\)"/.exec(centre[0]);
  const dragged=composed.svg.replace(ring[0],ring[0].replace(`translate(${ring[1]} ${ring[2]})`,`translate(${centreAt[1]} ${centreAt[2]})`));
  const draggedCodes=codes(await observe(dragged));
  assert.ok(draggedCodes.includes('REGION_LABEL_OUTSIDE'),'the (가) label left its own region');
  assert.ok(draggedCodes.includes('REGION_LABEL_IN_OTHER_REGION'),'the (가) label sits inside the (나) region');
});

test('schema: a bad pattern or labelKind is refused, a plain HATCH fill is still unsupported, and a labelKind needs a label',()=>{
  expectCode(specError(with_(m=>{m.regions[0].pattern='DOTS';})),'REGION_PATTERN_UNSUPPORTED');
  expectCode(specError(with_(m=>{m.regions[0].labelKind='KOREAN';})),'REGION_FIELD_INVALID');
  expectCode(specError(with_(m=>{delete m.regions[0].label;})),'REGION_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.regions[0].fill='HATCH';})),'REGION_FILL_UNSUPPORTED');
  expectCode(specError(with_(m=>{m.regions[0].label='';})),'REGION_FIELD_INVALID');
  expectCode(specError(with_(m=>{m.regions[0].labelKind='TEXT';m.regions[0].label='(가) '.repeat(12);})),'REGION_FIELD_INVALID');
});
