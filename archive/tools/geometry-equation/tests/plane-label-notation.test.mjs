// Plane-figure label notation (EXT-20261122): a length unit written after a sum or difference is bracketed ("(4+x) cm"), a degree label carries exactly one degree sign and never stands on a
// pi value, and the independent observer reads each of those back from the glyphs of the final SVG (with its tamper cases). Real SymPy/Cindy workers and real Chrome; the typography policy
// is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
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
const OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},observation:OBSERVATION});
const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});

// O at the origin, B on the x axis, C at 130 degrees (angle BOC is 130), A on the opposite side of B.
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),source('A',-6,0),source('B',6,0),polar('C','O','B',6,130)]};
const SEGMENTS=[{id:'sAO',refs:['A','O']},{id:'sOB',refs:['O','B']},{id:'sOC',refs:['O','C']}];
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'각 BOC는 130도이다.',mathPlan:graph,displayPoints:['A','O','B','C'],displayLines:[],displayCircles:[],
  displaySegments:SEGMENTS,coordinateCanvas:{width:640,height:380},planeMarks});
const marks={
  angles:[{id:'aBOC',refs:['B','O','C'],value:130,label:'130',arcs:1}],
  expressionLabels:[{id:'nOB',ownerSegment:'sOB',text:'4+x',unit:'cm'},{id:'nOC',ownerSegment:'sOC',text:'6',unit:'cm'},{id:'nAO',ownerSegment:'sAO',text:'x',unit:'cm'}]};

let model,browser,composed,transform;
before(async()=>{
  const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;
  browser=await launchBrowser();
  composed=await composeConstructionCandidate({plan:planOf(marks),model,identity,typographyPolicy:policy,browser});
  const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(marks),model,identity.assetId)});assert.equal(prepared.status,'OK');transform=prepared.result.coordinateModel;
});
after(async()=>{await browser?.close();});
const observe=async(svg,planeMarks=marks)=>{
  const response=await pythonWorker({action:'planeMarksAudit',svg,points:reconstruct(graph).points,marks:planeMarks,segments:SEGMENTS,transform},{script:OBSERVER});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
};
const codes=report=>report.errors.map(error=>error.split(':')[0]);
const groupOf=(svg,id)=>new RegExp('<g id="'+id+'"[^>]*>').exec(svg)[0];
const bodyOf=(svg,id)=>{const start=svg.indexOf('id="'+id+'"');return [start,svg.indexOf('</g>',svg.indexOf('</g>',start)+1)+4];};
const tex=id=>/data-tex="([^"]*)"/.exec(groupOf(composed.svg,id))?.[1];
const glyphs=(svg,id)=>{const start=svg.indexOf('id="'+id+'"'),next=svg.indexOf('<g id="',start+10);return [...svg.slice(start,next<0?svg.length:next).matchAll(/data-c="([0-9A-F]+)"/g)].map(m=>m[1]);};   // a degree label carries no data-tex, only glyphs
const spliceLabel=(svg,id,change)=>{const [start]=bodyOf(svg,id),end=svg.indexOf('</svg>',start);return svg.slice(0,start)+change(svg.slice(start,end))+svg.slice(end);};

test('a unit after a sum is bracketed, a unit after a number or letter is as before, and the degree label has one sign',()=>{
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.planeMarks.status,'PASS',JSON.stringify(composed.staticAudit.planeMarks.errors));
  assert.equal(tex('nOB'),'(4+x)\\,\\mathrm{cm}');
  assert.equal(tex('nOC'),'6\\mathrm{cm}');
  assert.equal(tex('nAO'),'x\\,\\mathrm{cm}');
  assert.deepEqual(glyphs(composed.svg,'aBOC-label'),['31','33','30','2218'],'1, 3, 0 and one degree circle');
});

test('the observer reads the bracket and the single degree sign from the glyphs, and fails a label that lost them',async()=>{
  assert.deepEqual((await observe(composed.svg)).errors,[]);
  // the opening bracket of "(4+x) cm" turned into another glyph, and the closing one
  assert.ok(codes(await observe(spliceLabel(composed.svg,'nOB',text=>text.replace('data-c="28"','data-c="5B"')))).includes('LABEL_UNIT_SUM_NOT_BRACKETED'));
  assert.ok(codes(await observe(spliceLabel(composed.svg,'nOB',text=>text.replace('data-c="29"','data-c="5D"')))).includes('LABEL_UNIT_SUM_NOT_BRACKETED'));
  // a degree label whose circle glyph is gone, and one that stands on a pi glyph
  assert.ok(codes(await observe(spliceLabel(composed.svg,'aBOC-label',text=>text.replace('data-c="2218"','data-c="2219"')))).includes('LABEL_DEGREE_SIGN_MISMATCH'));
  assert.ok(codes(await observe(spliceLabel(composed.svg,'aBOC-label',text=>text.replace('data-c="31"','data-c="1D70B"')))).includes('LABEL_DEGREE_OF_RADIAN_VALUE'));
  // a sum the plan already brackets is not asked to be bracketed again
  const bracketed=JSON.parse(JSON.stringify(marks));bracketed.expressionLabels[0].text='(4+x)';
  assert.ok(!codes(await observe(composed.svg,bracketed)).includes('LABEL_UNIT_SUM_NOT_BRACKETED'));
  // a sum whose term is spelled like the unit (cm+1 beside cm) still has to stand in brackets: the unbracketed drawing fails
  const spelled=JSON.parse(JSON.stringify(marks));spelled.expressionLabels[0].text='cm+1';
  const bare=spliceLabel(spliceLabel(composed.svg,'nOB',text=>text.replace('data-c="28"','data-c="5B"')),'nOB',text=>text.replace('data-c="29"','data-c="5D"'));
  assert.ok(codes(await observe(bare,spelled)).includes('LABEL_UNIT_SUM_NOT_BRACKETED'));
});

test('a degree sign on a pi value is refused before drawing, and a degree sign already written is not doubled',async()=>{
  const radians=JSON.parse(JSON.stringify(marks));radians.expressionLabels[2]={id:'nAO',ownerSegment:'sAO',text:'pi/3°'};
  let message='';try{specFor(planOf(radians),model,identity.assetId);const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(radians),model,identity.assetId)});message=prepared.status+':'+JSON.stringify(prepared.result);}catch(error){message=String(error.message);}
  assert.match(message,/DEGREE_OF_RADIAN_VALUE/);
  const written=JSON.parse(JSON.stringify(marks));written.angles[0].label='130°';
  const again=await composeConstructionCandidate({plan:planOf(written),model,identity,typographyPolicy:policy,browser});
  assert.equal(again.status,'COMPOSED',JSON.stringify(again.detail));
  assert.deepEqual(glyphs(again.svg,'aBOC-label'),['31','33','30','2218'],'one degree circle, not two');
});

test('a product of two numbers keeps its dot, and the observer fails a label that drew them side by side',async()=>{
  const product=JSON.parse(JSON.stringify(marks));product.expressionLabels=[{id:'nOB',ownerSegment:'sOB',text:'3*2^(2)'},{id:'nOC',ownerSegment:'sOC',text:'6',unit:'cm'},{id:'nAO',ownerSegment:'sAO',text:'x',unit:'cm'}];
  const drawn=await composeConstructionCandidate({plan:planOf(product),model,identity,typographyPolicy:policy,browser});
  assert.equal(drawn.status,'COMPOSED',JSON.stringify(drawn.detail));
  assert.ok(glyphs(drawn.svg,'nOB').includes('22C5'),'the dot between 3 and 2 is drawn');
  assert.deepEqual((await observe(drawn.svg,product)).errors,[]);
  const joined=spliceLabel(drawn.svg,'nOB',text=>text.replace('data-c="22C5"','data-c="2E"'));
  assert.ok(codes(await observe(joined,product)).includes('LABEL_PRODUCT_SIGN_MISSING'));
});

test('a coefficient of 1 is left out of the drawn label, and the observer fails a label that lost any other digit',async()=>{
  const withText=text=>{const copy=JSON.parse(JSON.stringify(marks));copy.expressionLabels=[{id:'nOB',ownerSegment:'sOB',text},{id:'nOC',ownerSegment:'sOC',text:'6',unit:'cm'},{id:'nAO',ownerSegment:'sAO',text:'x',unit:'cm'}];return copy;};
  for(const [text,digits] of [['y=(-1)*x^2',['32']],['y=(1)*x+3',['33']],['y=1*x+3',['33']],['y=(2)*x+3',['32','33']]]){
    const plan=withText(text),drawn=await composeConstructionCandidate({plan:planOf(plan),model,identity,typographyPolicy:policy,browser});
    assert.equal(drawn.status,'COMPOSED',text+JSON.stringify(drawn.detail));
    assert.deepEqual(glyphs(drawn.svg,'nOB').filter(code=>/^3[0-9]$/.test(code)),digits,text+': no 1x / -1x is drawn');
    assert.deepEqual((await observe(drawn.svg,plan)).errors,[],text);
  }
  // 2x drawn as x (the 2 glyph gone) and a 1 dropped from 12x are both mismatches
  const two=withText('y=(2)*x+3'),drawnTwo=await composeConstructionCandidate({plan:planOf(two),model,identity,typographyPolicy:policy,browser});
  const lost=spliceLabel(drawnTwo.svg,'nOB',text=>text.replace('data-c="32"','data-c="2E"'));
  assert.ok(codes(await observe(lost,two)).includes('LABEL_TEXT_MISMATCH'));
  const twelve=withText('y=(12)*x'),drawnTwelve=await composeConstructionCandidate({plan:planOf(twelve),model,identity,typographyPolicy:policy,browser});
  assert.deepEqual((await observe(drawnTwelve.svg,twelve)).errors,[]);
  assert.ok(codes(await observe(spliceLabel(drawnTwelve.svg,'nOB',text=>text.replace('data-c="31"','data-c="2E"')),twelve)).includes('LABEL_TEXT_MISMATCH'));
});

test('a fraction times a letter or function is read by its stacked order, and the observer still fails swapped or lost digits',async()=>{
  const withText=text=>{const copy=JSON.parse(JSON.stringify(marks));copy.expressionLabels=[{id:'nOB',ownerSegment:'sOB',text},{id:'nOC',ownerSegment:'sOC',text:'6',unit:'cm'},{id:'nAO',ownerSegment:'sAO',text:'x',unit:'cm'}];return copy;};
  const draw=async text=>{const plan=withText(text),drawn=await composeConstructionCandidate({plan:planOf(plan),model,identity,typographyPolicy:policy,browser});assert.equal(drawn.status,'COMPOSED',text+JSON.stringify(drawn.detail));return {plan,drawn};};
  const digitsOf=svg=>glyphs(svg,'nOB').filter(code=>/^3[0-9]$/.test(code)).map(code=>code[1]).join('');
  // drawn digits: numerator (left out when 1), the digits of the factor, then the denominator
  const forms={'(1/2)*sqrt(3)':'32','(8/5)*sqrt(10)':'8105','(-1/2)*x':'2','(3/4)*sqrt(2)':'324','(2/5)*sqrt(15)':'2155','(12/5)*sqrt(10)':'12105','y=(8/5)*sqrt(10)+1':'81051','x=(5/2)*sqrt(3)':'532',
    '(1/3)*x+(2/3)':'323','(1/2)*a*b*sin(60)':'260','(1/2)*x^2':'122','-(1/2)*x':'12','(1/2)*x/3':'23'};
  for(const [text,digits] of Object.entries(forms)){
    const {plan,drawn}=await draw(text);
    assert.equal(digitsOf(drawn.svg),digits,text);
    assert.deepEqual((await observe(drawn.svg,plan)).errors,[],text);
  }
  // numerator and denominator swapped, and one digit lost
  const {plan,drawn}=await draw('(8/5)*sqrt(10)');
  const swapped=spliceLabel(drawn.svg,'nOB',text=>text.replace('data-c="38"','data-c="@"').replace('data-c="35"','data-c="38"').replace('data-c="@"','data-c="35"'));
  assert.equal(digitsOf(swapped),'5108');assert.ok(codes(await observe(swapped,plan)).includes('LABEL_TEXT_MISMATCH'));
  assert.ok(codes(await observe(spliceLabel(drawn.svg,'nOB',text=>text.replace('data-c="38"','data-c="2E"')),plan)).includes('LABEL_TEXT_MISMATCH'));
  assert.ok(codes(await observe(spliceLabel(drawn.svg,'nOB',text=>text.replace('data-c="35"','data-c="2E"')),plan)).includes('LABEL_TEXT_MISMATCH'));
  // a 1 beside a unit word is a length and is drawn; losing it fails
  for(const text of ['(1)*cm','1*cm','(1)m']){
    const one=await draw(text);
    assert.equal(digitsOf(one.drawn.svg),'1',text);
    assert.deepEqual((await observe(one.drawn.svg,one.plan)).errors,[],text);
    assert.ok(codes(await observe(spliceLabel(one.drawn.svg,'nOB',body=>body.replace('data-c="31"','data-c="2E"')),one.plan)).includes('LABEL_TEXT_MISMATCH'),text);
  }
});
