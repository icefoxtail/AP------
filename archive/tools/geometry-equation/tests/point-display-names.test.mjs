// Point display names (T₁, A′ ...) on construction, graph and number-line figures. Chrome-using (renders figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {typesetter} from '../production/typography.mjs';
import {parsePointName,pointNameModel,canonicalPointNameText} from '../production/point-names.mjs';
import {expectedNameTokens,glyphTokens,observeDisplayedPointNames,planNameExpectations,labelGroups} from '../production/point-name-observer.mjs';
import {normalizeObservedText} from '../production/archive-inverse-observation-v1.mjs';
import {expandNumberLineFigure} from '../production/number-line-v1.mjs';
import {compositePanelBytes} from '../production/composite-candidate-svg-v1.mjs';
import {fileURLToPath} from 'node:url';

const observer=fileURLToPath(new URL('../production/number-line-observer-worker.py',import.meta.url));
const item={sourcePath:'archive/exams/original/high/h1/1final/21_매산여고_1학기_기말_고1_기출.js',ordinal:13,dir:'pn'};
const tmp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'point-names-'));
const typeset=typesetter(),identity={visualAssetKey:'sha256:test'};
const fragmentFor=tex=>typeset({id:'x-name',owner:'x',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'MATH',tex},identity).svg;
const group=(tex,kind='POINT_NAME')=>`<g id="x-name" data-label-kind="${kind}" data-priority="1" data-owner="x" transform="translate(0 0)">${fragmentFor(tex)}</g></g>`;
const thrown=fn=>{try{fn();}catch(error){return error.message;}return null;};

// 22 매산여고 기말 13: the two tangent points are T1 and T2 in the solution, drawn as T₁ and T₂.
const int=value=>({kind:'integer',value:String(value)});
const node=(id,op,inputs,args,outputType,factRole,extra={})=>({id,op,inputs,args,outputType,factRole,...extra});
const tangentPlan=(pointNames,extra={})=>({
  capability:'construction-spike-v1',
  mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
    node('O','NORMALIZATION_ORIGIN',[],{},'POINT','GIVEN'),node('U','NORMALIZATION_AXIS',[],{length:int(1)},'POINT','GIVEN'),
    node('P','SOURCE_POINT',[],{coordinates:[int(6),int(0)]},'POINT','GIVEN'),node('M','MIDPOINT',['O','P'],{},'POINT','DERIVED_INTERMEDIATE'),
    node('k1','CIRCLE_CENTER_RADIUS',['O'],{radius:{kind:'expression',op:'mul',args:[int(3),{kind:'expression',op:'sqrt',args:[int(2)]}]}},'CIRCLE','GIVEN'),
    node('k2','CIRCLE_CENTER_RADIUS',['O'],{radius:int(6)},'CIRCLE','CONCLUSION'),node('k3','CIRCLE_CENTER_RADIUS',['M'],{radius:int(3)},'CIRCLE','DERIVED_INTERMEDIATE'),
    node('XX','INTERSECTION',['k1','k3'],{},'POINT_SET','DERIVED_INTERMEDIATE'),
    node('T1','SELECT_POINT',['XX'],{},'POINT','DERIVED_INTERMEDIATE',{branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['O','P'],sign:1}}),
    node('T2','SELECT_POINT',['XX'],{},'POINT','DERIVED_INTERMEDIATE',{branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['O','P'],sign:-1}})]},
  displayPoints:['O','P','T1','T2'],displayLines:[],displayCircles:['k1','k2'],
  displaySegments:[{id:'sOT1',refs:['O','T1']},{id:'sOT2',refs:['O','T2']},{id:'sPT1',refs:['P','T1']},{id:'sPT2',refs:['P','T2']}],
  coordinateLabels:['P','T1','T2'],coordinatePlacement:'PANEL',axisTickValues:{x:[],y:[]},
  caption:'점 P에서 원에 그은 두 접선의 접점 T1, T2',sourceConditions:[{id:'c1',condition:'원 x^2+y^2=18',mappedTo:['k1']},{id:'c2',condition:'OP=6',mappedTo:['P','T1','T2']}],
  newVisualInformation:['접점 T1, T2'],...(pointNames===undefined?{}:{pointNames}),...extra});

test('display names: one capital letter, primes, subscript digits; every spelling of a name is equivalent',()=>{
  for(const same of [['T_1','T_{1}','T₁'],["A'",'A′'],["A''",'A″','A′′'],["A'_1","A′₁",'A′_{1}'],['T₁₂','T_{12}']]){
    const texes=new Set(same.map(name=>JSON.stringify(parsePointName(name))));
    assert.equal(texes.size,1,same.join(' '));
    assert.equal(new Set(same.map(name=>normalizeObservedText(name))).size,1,'observation normalization: '+same.join(' '));
  }
  assert.equal(normalizeObservedText('T_{1}(3,2)'),normalizeObservedText('T₁(3,2)'));
  assert.equal(canonicalPointNameText("A'"),'A′');
  for(const bad of ['t_1','T_0','T_12','T_123','TT','T1','T_','1','A_1\'','','T_{1','Ap','A‴','T_a','가']){assert.equal(parsePointName(bad),null,'not a display name: '+bad);}
  const model=pointNameModel({pointNames:{A:"A'",B:'B_1'}},['A','B','C']);
  assert.deepEqual([model.tex('A'),model.expr('B'),model.text('A'),model.text('B'),model.tex('C')],["A'",'B_1','A′','B₁','C']);
});

test('rejections carry explicit codes',()=>{
  const ids=['A','B'];
  assert.equal(thrown(()=>pointNameModel({pointNames:{A:'a_1'}},ids)),'POINT_DISPLAY_NAME_INVALID:A');
  assert.equal(thrown(()=>pointNameModel({pointNames:{A:'Ap'}},ids)),'POINT_DISPLAY_NAME_INVALID:A');
  assert.equal(thrown(()=>pointNameModel({pointNames:{Z:'T_1'}},ids)),'POINT_NAME_TARGET_UNKNOWN:Z');
  assert.equal(thrown(()=>pointNameModel({pointNames:{A:'B'}},ids)),'POINT_DISPLAY_NAME_DUPLICATE:B');
  assert.equal(thrown(()=>pointNameModel({pointNames:{A:'T_1',B:'T₁'}},ids)),'POINT_DISPLAY_NAME_DUPLICATE:T₁');
  assert.equal(thrown(()=>pointNameModel({pointNames:['T_1']},ids)),'POINT_DISPLAY_NAME_INVALID:pointNames');
  assert.equal(thrown(()=>pointNameModel({pointNames:{A:5}},ids)),'POINT_DISPLAY_NAME_INVALID:A');
  const rows=[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'}]}],figure=pointNames=>({capability:'number-line-figure-v1',numberLine:{rows},pointNames,caption:'c',sourceConditions:[],newVisualInformation:[]});
  assert.equal(thrown(()=>expandNumberLineFigure(figure({A:'A_0'}))),'POINT_DISPLAY_NAME_INVALID:A');
  assert.equal(thrown(()=>expandNumberLineFigure(figure({Q:'A_1'}))),'POINT_NAME_TARGET_UNKNOWN:Q');
  assert.equal(expandNumberLineFigure(figure({A:"A'"})).panels[0].plan.pointNames.A,"A'");
});

test('the observer reads subscripts and primes back from the glyphs, not from the name text',()=>{
  const want=expectedNameTokens('T_1'),got=glyphTokens(fragmentFor('T_{1}'));
  assert.deepEqual(got,want);
  assert.deepEqual(glyphTokens(fragmentFor("A''_{12}")),expectedNameTokens("A''₁₂"));
  assert.equal(observeDisplayedPointNames(group('T_{1}'),[{owner:'x',name:'T₁'}]).status,'PASS');
  assert.equal(observeDisplayedPointNames(group("A'"),[{owner:'x',name:'A′'}]).status,'PASS');
  // a coordinate band label starts with the name, then "("
  assert.equal(observeDisplayedPointNames(group('T_{1}(3,2)','EQUATION_LABEL'),[{owner:'x',name:'T_1'}]).status,'PASS');
  // T1 drawn as a plain digit is NOT T_1, a different subscript or a missing prime fails, and so does a missing label
  assert.equal(observeDisplayedPointNames(group('T1'),[{owner:'x',name:'T_1'}]).status,'FAIL');
  assert.match(observeDisplayedPointNames(group('T_{2}'),[{owner:'x',name:'T_1'}]).errors[0],/^POINT_DISPLAY_NAME_MISMATCH:x-name:/);
  assert.equal(observeDisplayedPointNames(group('A'),[{owner:'x',name:"A'"}]).status,'FAIL');
  assert.equal(observeDisplayedPointNames(group("A'"),[{owner:'x',name:'A'}]).status,'FAIL');
  assert.deepEqual(observeDisplayedPointNames(group('T_{1}'),[{owner:'y',name:'T_1'}]).errors,['POINT_DISPLAY_NAME_NOT_SHOWN:y']);
  assert.deepEqual(observeDisplayedPointNames(group('T_{1}'),[{owner:'x',name:'t_1'}]).errors,['POINT_DISPLAY_NAME_INVALID:x']);
  assert.deepEqual(planNameExpectations({pointNames:{B:'B_1'},graphPlan:{requiredPoints:[{id:'A'},{id:'B'}]}}),[{owner:'required-point-2',name:'B_1'}]);
});

test('construction: T1, T2 are drawn as T₁, T₂ (point names and the coordinate band)',async()=>{
  const out=tmp(),r=await renderPlan({item,plan:tangentPlan({T1:'T_1',T2:'T₂'}),outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  const svg=fs.readFileSync(path.join(out,'pn-solution.svg'),'utf8');
  const groups=labelGroups(svg),byId=id=>groups.find(g=>g.id===id);
  assert.deepEqual(glyphTokens(byId('T1-name').markup),expectedNameTokens('T₁'));
  assert.deepEqual(glyphTokens(byId('T2-name').markup),expectedNameTokens('T_2'));
  const band=groups.find(g=>g.owner==='T1'&&g.kind==='EQUATION_LABEL');
  assert.ok(band,'T1 coordinate band label');
  assert.deepEqual(glyphTokens(band.markup).slice(0,2),expectedNameTokens('T_1'));
  assert.equal(observeDisplayedPointNames(svg,planNameExpectations(tangentPlan({T1:'T_1',T2:'T₂'}))).status,'PASS');
  // the label text carries no raw "T1" text: the plan id is not what the figure shows
  assert.equal(observeDisplayedPointNames(svg,[{owner:'T1',name:'T1'}]).status,'FAIL');
  // layout used the real glyph metrics: no label is left unplaced and the figure was bound to the Archive row
  assert.equal(r.layoutRepairs,0);
});

test('construction: invalid / unknown / duplicate / hidden names are explicit errors at the spec stage',async()=>{
  for(const [names,extra,code] of [[{T1:'T_0'},{},'POINT_DISPLAY_NAME_INVALID:T1'],[{T9:'T_1'},{},'POINT_NAME_TARGET_UNKNOWN:T9'],[{T1:'T_1',T2:'T_1'},{},'POINT_DISPLAY_NAME_DUPLICATE:T₁'],[{T1:'T_1'},{hiddenPointNames:['T1'],coordinateLabels:['P']},'POINT_NAME_TARGET_HIDDEN:T1']]){
    const r=await renderPlan({item,plan:tangentPlan(names,extra),outDir:tmp()});
    assert.equal(r.status,'FAILED');assert.equal(r.stage,'spec');
    assert.ok(String(r.detail).includes(code),code+' in '+r.detail);
  }
});

test('graph: key points A, T drawn as A′ and T₁ in the dot labels and the coordinate band',async()=>{
  const plan={capability:'piecewise-polynomial-spike-v1',
    graphPlan:{family:'piecewise-polynomial',pieces:[{coefficients:['0','4','2']},{coefficients:['0','-2','-1']}],breakpoints:[{x:'-2',y:'0'}],sourceDomain:{kind:'ALL_REALS'},
      referenceLines:[{id:'l',slope:'6-2*sqrt(7)',intercept:'23-8*sqrt(7)',intersectionX:['(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2','-4+sqrt(7)']}],
      requiredPoints:[{id:'A',x:-2,y:0},{id:'T',x:'-4+sqrt(7)',y:'-15+6*sqrt(7)'},{id:'V',x:-1,y:1}],axisTickValues:{x:[],y:[]}},
    coordinatePlacement:'PANEL',pointNames:{A:"A'",T:'T_1'},caption:'접선 l과 접점 T1',sourceQuote:'접점을 T1이라 하자'};
  const out=tmp(),r=await renderPlan({item:{...item,dir:'pg'},plan,outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  const svg=fs.readFileSync(path.join(out,'pg-solution.svg'),'utf8'),groups=labelGroups(svg);
  assert.deepEqual(glyphTokens(groups.find(g=>g.id==='required-point-1-name').markup),expectedNameTokens('A′'));
  assert.deepEqual(glyphTokens(groups.find(g=>g.id==='required-point-2-name').markup),expectedNameTokens('T₁'));
  const bands=groups.filter(g=>g.kind==='EQUATION_LABEL'&&/^required-point-/.test(g.owner??''));
  assert.equal(bands.length,3);
  assert.deepEqual(glyphTokens(bands.find(g=>g.owner==='required-point-1').markup).slice(0,2),expectedNameTokens("A'"));
  // an invalid name stops the figure before it is drawn
  const bad=await renderPlan({item:{...item,dir:'pb'},plan:{...plan,pointNames:{A:'Ap'}},outDir:tmp()});
  assert.equal(bad.status,'FAILED');assert.ok(String(bad.detail).includes('POINT_DISPLAY_NAME_INVALID:A'),bad.detail);
});

test('number line: names A′ B₁ P₂ are checked against the final SVG by the independent observer',async()=>{
  const numberLine={rows:[{kind:'POINTS',points:[{id:'A',value:'-2'},{id:'B',value:'4'},{id:'P',divides:{from:'A',to:'B',ratio:['1','2']}}]}]};
  const plan={capability:'number-line-figure-v1',numberLine,pointNames:{A:"A'",B:'B_1',P:'P₂'},caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'numberLine.rows'}],newVisualInformation:['n']};
  const out=tmp(),r=await renderPlan({item:{...item,dir:'pn2'},plan,outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r.detail));
  // a number-line figure is a one-panel composite: the panel's own SVG is what the observer audits
  const svg=compositePanelBytes(fs.readFileSync(path.join(out,'pn2-solution.svg'),'utf8'))[0].bytes.toString('utf8');
  const texOf=id=>new RegExp(`id="r1-pt-${id}-name"[^>]*data-tex="([^"]*)"`).exec(svg)[1];
  assert.deepEqual(['A','B','P'].map(texOf),["A'",'B_{1}','P_{2}']);
  const audit=pointNames=>pythonWorker({numberLine,svg,...(pointNames?{pointNames}:{})},{script:observer});
  assert.equal((await audit(plan.pointNames)).result.status,'PASS');
  // the same svg judged against other names (or no names) fails: the observer reads the displayed name from the SVG, not from the engine
  assert.ok((await audit({A:"A'",B:'B_2',P:'P_2'})).result.errors.includes('NL_POINT_NAME_LABEL:B'));
  assert.ok((await audit()).result.errors.includes('NL_POINT_NAME_LABEL:A'));
  assert.equal((await audit({A:'A_0'})).status,'ERROR');
  assert.equal((await audit({Q:'A_1'})).result.code,'POINT_NAME_TARGET_UNKNOWN:Q');
});
