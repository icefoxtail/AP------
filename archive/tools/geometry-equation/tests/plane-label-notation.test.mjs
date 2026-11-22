// Plane-figure label notation (EXT-20261122): a length unit written after a sum or difference is bracketed ("(4+x) cm"), a degree label carries exactly one degree sign and never stands on a
// pi value, and the independent observer reads each of those back from the glyphs of the final SVG (with its tamper cases). Real SymPy/Cindy workers and real Chrome; the typography policy
// is the same FIXTURE as plane-marks.test.mjs. Run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {defaultHangulLabelKinds,dimensionLabelParts} from '../production/plane-marks.mjs';
import {regionLabelText} from '../production/plane-regions.mjs';
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
  // g and h that are called are functions, not units: their 1 is left out and the observer accepts it
  for(const text of ['(1)*g(x)','1*g(x)','y=(1)*h(x)']){
    const call=await draw(text);
    assert.equal(digitsOf(call.drawn.svg),'',text);
    assert.deepEqual((await observe(call.drawn.svg,call.plan)).errors,[],text);
  }
});

// ---- (P-B) a label that already ends in its unit, an angle named by its own letters, two names on one point -------------------------------------------------------------------------

test('a label that already ends in its unit is refused before drawing, and the observer fails one that was drawn twice',async()=>{
  for(const [text,unit] of [['6cm','cm'],['6cm','m'],['x cm','cm']]){
    const twice=JSON.parse(JSON.stringify(marks));twice.expressionLabels[1]={id:'nOC',ownerSegment:'sOC',text,unit};
    let refused='';
    try{const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(twice),model,identity.assetId)});refused=prepared.status+':'+JSON.stringify(prepared.result);}catch(error){refused=String(error?.message??error);}
    assert.match(refused,/LABEL_UNIT_WRITTEN_TWICE/,text+' '+unit);
    // the observer reads the plan text by its own rule: the drawing of a label that was not doubled is judged against a doubled plan text
    assert.ok(codes(await observe(composed.svg,twice)).includes('LABEL_UNIT_WRITTEN_TWICE'),text+' '+unit);
  }
  // not doubled: a number with its unit, a variable spelled like a unit letter, a sum
  const fine=JSON.parse(JSON.stringify(marks));fine.expressionLabels[1]={id:'nOC',ownerSegment:'sOC',text:'6',unit:'cm'};fine.expressionLabels[2]={id:'nAO',ownerSegment:'sAO',text:'m',unit:'cm'};
  assert.ok(!codes(await observe(composed.svg,fine)).includes('LABEL_UNIT_WRITTEN_TWICE'));
});

test('a MATH angle label that is exactly the letters of its three points is drawn with the angle sign, and the observer fails a drawing that lost it',async()=>{
  const named=JSON.parse(JSON.stringify(marks));named.angles[0]={id:'aBOC',refs:['B','O','C'],value:130,label:'BOC',labelKind:'MATH',arcs:1};
  const drawn=await composeConstructionCandidate({plan:planOf(named),model,identity,typographyPolicy:policy,browser});
  assert.equal(drawn.status,'COMPOSED',JSON.stringify(drawn.detail));
  assert.equal(glyphs(drawn.svg,'aBOC-label')[0],'2220','the angle sign leads: the angle BOC, not the three points');
  assert.deepEqual((await observe(drawn.svg,named)).errors,[]);
  assert.ok(codes(await observe(spliceLabel(drawn.svg,'aBOC-label',text=>text.replace('data-c="2220"','data-c="2E"')),named)).includes('ANGLE_NAME_SIGN_MISSING'));
  // the reversed spelling is the same angle
  const reversed=JSON.parse(JSON.stringify(named));reversed.angles[0].label='COB';
  const back=await composeConstructionCandidate({plan:planOf(reversed),model,identity,typographyPolicy:policy,browser});
  assert.equal(glyphs(back.svg,'aBOC-label')[0],'2220');
  // anything else under MATH is left as written: a symbol, an expression, letters that are not these three points
  for(const label of ['x','2x','AOB']){
    const other=JSON.parse(JSON.stringify(named));other.angles[0].label=label;
    const kept=await composeConstructionCandidate({plan:planOf(other),model,identity,typographyPolicy:policy,browser});
    assert.equal(kept.status,'COMPOSED',label+JSON.stringify(kept.detail));
    assert.ok(!glyphs(kept.svg,'aBOC-label').includes('2220'),label+' stays without an angle sign');
    assert.deepEqual((await observe(kept.svg,other)).errors,[],label);
  }
});

test('two drawn points at one place are refused, a hidden point there is not',async()=>{
  const twin={schemaVersion:'construction-spike-v1',realization:graph.realization,nodes:[...graph.nodes,{...node('M','MIDPOINT',['A','B'],'POINT',{}),factRole:'DERIVED_INTERMEDIATE'}]};
  const response=await pythonWorker({action:'construction',graph:twin},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const shown={...planOf(marks),mathPlan:twin,displayPoints:['A','O','B','C','M']};
  assert.throws(()=>specFor(shown,response.result,identity.assetId),/DISPLAY_POINTS_COINCIDE:O,M|DISPLAY_POINTS_COINCIDE:M,O/);
  assert.doesNotThrow(()=>specFor({...shown,hiddenPointNames:['M']},response.result,identity.assetId));
  // a point drawn at its own place is untouched
  assert.doesNotThrow(()=>specFor(planOf(marks),model,identity.assetId));
});

test('a digit written after a space is refused before drawing, and the observer fails a drawing made from such a text',async()=>{
  for(const text of ['x 3','(x+1) 2','2x 3']){
    const spaced=JSON.parse(JSON.stringify(marks));spaced.expressionLabels[0]={id:'nOB',ownerSegment:'sOB',text};
    let refused='';
    try{const prepared=await pythonWorker({action:'prepare',spec:specFor(planOf(spaced),model,identity.assetId)});refused=prepared.status+':'+JSON.stringify(prepared.result);}catch(error){refused=String(error?.message??error);}
    assert.match(refused,/NUMBER_JUXTAPOSITION_UNCLEAR/,text);
    assert.ok(codes(await observe(composed.svg,spaced)).includes('LABEL_DIGIT_AFTER_SPACE'),text);
  }
  // spaces that are not between a letter or bracket and a digit change nothing
  const fine=JSON.parse(JSON.stringify(marks));fine.expressionLabels[0]={id:'nOB',ownerSegment:'sOB',text:'x + 3'};
  assert.ok(!codes(await observe(composed.svg,fine)).includes('LABEL_DIGIT_AFTER_SPACE'));
});

// ---- (P-C) the units a plane label may carry: one table, typed here, fed to the generator and (through prepare) the semantic model; the observers get the same table in test_plane_marks.py ----
const UNITS_ACCEPTED=['cm','m','mm','km','kg','g','mg','mL','L','dL','s','min','h','ha','km/h','m/s','cm/s','m/min','cm^2','m^2','mm^2','km^2','cm^3','m^3','mm^3'];
const UNITS_REFUSED=['','CM','cm^4','c m','초','inch','lb','sec','m^2/s','cm2'];
test('every unit of the shared table is carried by an expression label, and a unit outside it is refused with the old code',async()=>{
  for(const unit of UNITS_ACCEPTED){
    const withUnit=JSON.parse(JSON.stringify(marks));withUnit.expressionLabels[1]={id:'nOC',ownerSegment:'sOC',text:'6',unit};
    const spec=specFor(planOf(withUnit),model,identity.assetId);
    const prepared=await pythonWorker({action:'prepare',spec});
    assert.equal(prepared.status,'OK',unit+' '+JSON.stringify(prepared.result));
  }
  for(const unit of UNITS_REFUSED){
    const withUnit=JSON.parse(JSON.stringify(marks));withUnit.expressionLabels[1]={id:'nOC',ownerSegment:'sOC',text:'6',unit};
    let message='';try{specFor(planOf(withUnit),model,identity.assetId);message='accepted';}catch(error){message=String(error?.message??error);}
    assert.match(message,/^MARK_UNIT_INVALID:expressionLabels:nOC$/,JSON.stringify(unit));
  }
});

test('a km or area unit is drawn after the value and the observer reads it back from the glyphs',async()=>{
  const km=JSON.parse(JSON.stringify(marks));km.expressionLabels[1]={id:'nOC',ownerSegment:'sOC',text:'6',unit:'km'};km.expressionLabels[2]={id:'nAO',ownerSegment:'sAO',text:'12',unit:'cm^2'};
  const drawn=await composeConstructionCandidate({plan:planOf(km),model,identity,typographyPolicy:policy,browser});
  assert.equal(drawn.status,'COMPOSED',JSON.stringify(drawn.detail));
  assert.deepEqual(glyphs(drawn.svg,'nOC'),['36','6B','6D'],'6 k m');
  assert.deepEqual((await observe(drawn.svg,km)).errors,[]);
  assert.ok(codes(await observe(spliceLabel(drawn.svg,'nOC',text=>text.replace('data-c="6B"','data-c="63"')),km)).includes('LABEL_UNIT_MISMATCH'));
});

test('a label that only states a relation to a value (the approximate 0.84) is drawn, and the observer reads its digits',async()=>{
  const approx=JSON.parse(JSON.stringify(marks));approx.expressionLabels[0]={id:'nOB',ownerSegment:'sOB',text:'≈0.84'};
  const drawn=await composeConstructionCandidate({plan:planOf(approx),model,identity,typographyPolicy:policy,browser});
  assert.equal(drawn.status,'COMPOSED',JSON.stringify(drawn.detail));
  assert.ok(glyphs(drawn.svg,'nOB').includes('2248'),'the approximate sign is drawn');
  assert.deepEqual((await observe(drawn.svg,approx)).errors,[]);
  assert.ok(codes(await observe(spliceLabel(drawn.svg,'nOB',text=>text.replace('data-c="38"','data-c="39"')),approx)).includes('LABEL_TEXT_MISMATCH'));
});

test('a Hangul label that does not say MATH is a plain-text label, and one that says MATH is still refused',async()=>{
  const kor=JSON.parse(JSON.stringify(marks));kor.expressionLabels[0]={id:'nOB',ownerSegment:'sOB',text:'공통'};
  const plan=defaultHangulLabelKinds(planOf(kor));
  assert.equal(plan.planeMarks.expressionLabels[0].labelKind,'TEXT');
  const drawn=await composeConstructionCandidate({plan,model,identity,typographyPolicy:policy,browser});
  assert.equal(drawn.status,'COMPOSED',JSON.stringify(drawn.detail));
  assert.deepEqual((await observe(drawn.svg,plan.planeMarks)).errors,[]);
  // the rows that were never refused do not change: no Hangul, an explicit kind, a unit
  const same=planOf(marks);assert.equal(defaultHangulLabelKinds(same),same,'the same object comes back when nothing changes');
  const explicit=JSON.parse(JSON.stringify(marks));explicit.expressionLabels[0]={id:'nOB',ownerSegment:'sOB',text:'공통',labelKind:'MATH'};
  const stillMath=planOf(explicit);assert.equal(defaultHangulLabelKinds(stillMath),stillMath);
  let message='';try{specFor(stillMath,model,identity.assetId);const prepared=await pythonWorker({action:'prepare',spec:specFor(stillMath,model,identity.assetId)});message=JSON.stringify(prepared.result);}catch(error){message=String(error?.message??error);}
  assert.match(message,/KOREAN_WORD_NEEDS_TEXT_LABEL/);
});

test('a dimension label written with its thin-space unit reads every unit of the table, and only those',()=>{
  const thin=String.raw`\,`;
  for(const unit of UNITS_ACCEPTED)assert.deepEqual(dimensionLabelParts({label:'24'+thin+unit}),{label:'24',unit},unit);
  for(const unit of ['inch','lb','CM','cm^4','x'])assert.deepEqual(dimensionLabelParts({label:'24'+thin+unit}),{label:'24'+thin+unit,unit:undefined},unit);
  assert.equal(dimensionLabelParts({label:'24'+thin+'km',unit:'cm'}).conflict,true);
});

test('the region label units are the table minus the ratios, and a region label draws them as the observer reads them',()=>{
  const regionUnits=UNITS_ACCEPTED.filter(unit=>!unit.includes('/'));
  for(const unit of regionUnits)assert.equal(regionLabelText({label:'6',unit}).startsWith('6'+unit.split('^')[0]),true,unit);
  assert.equal(regionLabelText({label:'6',unit:'km^2'}),'6km\u00B2');
  assert.equal(regionLabelText({label:'6',unit:'mL'}),'6mL');
});
