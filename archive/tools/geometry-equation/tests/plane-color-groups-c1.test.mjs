// Colour groups of plane figures (C1): the plan-side rules of palette.mjs, planeMarks.equalAreas / equalAngles / segmentColors and the colour of
// equalLengths / parallels rows. The engine and the independent observers are covered by tests/test_palette_c1.py (no Chrome there either).
// Real SymPy worker for the model, no browser. Run with --test-concurrency=1.
import test,{before} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {PALETTE,PALETTE_NAMES,isPaletteName} from '../production/palette.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
// circle k (centre O, radius 5); A(30) B(150) C(210) D(330) degrees: AOB = COD = 120, AOD = BOC = 60; AB parallel to CD, BC parallel to DA and equal to it
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),{...node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)}),factRole:'GIVEN'},
  polar('A','O','X',5,30),polar('B','O','X',5,150),polar('C','O','X',5,210),polar('D','O','X',5,330)]};
const marks={
  regions:[
    {id:'rA',fill:'BLUE',shapes:[{sector:{center:'O',from:'A',to:'B'}}]},
    {id:'rB',fill:'BLUE',shapes:[{sector:{center:'O',from:'C',to:'D'}}]}],
  equalAreas:[['rA','rB']],
  angles:[{id:'aAOD',refs:['A','O','D'],value:60,noLabel:true},{id:'aBOC',refs:['B','O','C'],value:60,noLabel:true}],
  equalAngles:[{angles:['aAOD','aBOC'],color:'WARM'}],
  parallels:[{id:'pAB',count:1,segments:['sAB','sCD'],color:'VIOLET'}],
  equalLengths:[{id:'eBC',count:1,segments:['sBC','sDA'],color:'GREEN'}],
  segmentColors:[{segments:['sOA','sOB'],color:'ROSE'}]};
const segment=(id,a,b)=>({id,refs:[a,b]});
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'원 O 안의 같은 넓이의 부채꼴, 같은 크기의 각, 평행한 현을 색으로 나타냈다.',mathPlan:graph,
  displayPoints:['O','A','B','C','D'],displayLines:[],displayCircles:['k'],
  displaySegments:[segment('sOA','O','A'),segment('sOB','O','B'),segment('sOC','O','C'),segment('sOD','O','D'),segment('sAB','A','B'),segment('sCD','C','D'),segment('sBC','B','C'),segment('sDA','D','A')],planeMarks});
const clone=value=>JSON.parse(JSON.stringify(value));
let model;
before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});
const specOf=planeMarks=>specFor(planOf(planeMarks),model,identity.assetId);
const specError=planeMarks=>{try{specOf(planeMarks);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);
const with_=change=>{const copy=clone(marks);change(copy);return copy;};

test('the palette names and the table the plans read',()=>{
  assert.deepEqual(PALETTE_NAMES,['BLUE','WARM','GREEN','ROSE','VIOLET']);
  for(const name of PALETTE_NAMES){assert.ok(isPaletteName(name));assert.match(PALETTE[name].fill,/^#[0-9a-f]{6}$/);assert.match(PALETTE[name].line,/^#[0-9a-f]{6}$/);}
  assert.ok(!isPaletteName('LIGHT')&&!isPaletteName('TEAL')&&!isPaletteName(1));
  // the solid figures' highlight table is the source of the fills
  const solid=fs.readFileSync(new URL('../production/solid-figure-v1.mjs',import.meta.url),'utf8');
  const row=name=>new RegExp(name+":\\['(#[0-9a-f]{6})',([0-9.]+)\\]").exec(solid);
  assert.deepEqual([row('LIGHT')[1],Number(row('LIGHT')[2])],[PALETTE.BLUE.fill,PALETTE.BLUE.opacity]);
  for(const name of ['WARM','GREEN','ROSE','VIOLET'])assert.deepEqual([row(name)[1],Number(row(name)[2])],[PALETTE[name].fill,PALETTE[name].opacity],name);
});

test('a plan with colour groups becomes engine objects that carry the palette names',()=>{
  const objects=specOf(marks).objects,byId=id=>objects.find(o=>o.id===id);
  assert.equal(byId('rA').fill,'BLUE');assert.equal(byId('rB').fill,'BLUE');
  assert.equal(byId('aAOD').color,'WARM');assert.equal(byId('aBOC').color,'WARM');          // equalAngles colours the whole group
  assert.equal(byId('pAB').color,'VIOLET');assert.equal(byId('eBC').color,'GREEN');
  for(const id of ['sAB','sCD'])assert.equal(byId(id).color,'VIOLET');
  for(const id of ['sBC','sDA'])assert.equal(byId(id).color,'GREEN');
  for(const id of ['sOA','sOB'])assert.equal(byId(id).color,'ROSE');
  assert.equal(byId('sOC').color,undefined);                                                // a segment nobody declared stays plain
});

test('regions: equalAreas needs equal areas, one palette colour and a colour nobody else uses',()=>{
  expectCode(specError(with_(m=>{m.regions[1]={id:'rB',fill:'BLUE',shapes:[{polygon:['O','C','D']}]};})),'REGION_EQUAL_AREA_MISMATCH');      // a triangle is smaller than the sector
  expectCode(specError(with_(m=>{m.regions[1].fill='WARM';})),'REGION_EQUAL_AREA_COLOR_MISMATCH');
  expectCode(specError(with_(m=>{m.regions[0].fill='LIGHT';m.regions[1].fill='LIGHT';})),'REGION_EQUAL_AREA_COLOR_MISMATCH');                 // gray is no colour group
  expectCode(specError(with_(m=>{m.regions.push({id:'rC',fill:'BLUE',shapes:[{sector:{center:'O',from:'B',to:'C'}}]});})),'REGION_COLOR_GROUP_AMBIGUOUS');
  expectCode(specError(with_(m=>{m.equalAreas=[['rA','rZ']];})),'REGION_EQUAL_AREA_UNKNOWN_REGION');
  expectCode(specError(with_(m=>{m.equalAreas=[['rA']];})),'REGION_EQUAL_AREA_INVALID');
  expectCode(specError(with_(m=>{m.equalAreas='rA';})),'REGION_EQUAL_AREA_INVALID');
  expectCode(specError(with_(m=>{m.regions[0].fill='TEAL';})),'REGION_FILL_UNSUPPORTED');
  expectCode(specError(with_(m=>{m.regions[0].fill=3;})),'REGION_FILL_INVALID');
});

test('regions: a region with a hole and a circular segment shape are accepted next to each other (their exact areas are covered in test_palette_c1.py)',()=>{
  // sector AOB (120 degrees) minus its triangle is the same area as the circular segment between A and B drawn as a segment shape
  const m=with_(x=>{
    x.regions=[{id:'rA',fill:'BLUE',shapes:[{sector:{center:'O',from:'A',to:'B'}}],holes:[{polygon:['O','A','B']}]},{id:'rB',fill:'BLUE',shapes:[{segment:{center:'O',from:'C',to:'D'}}]}];
  });
  assert.equal(specOf(m).objects.filter(o=>o.kind==='FILL_REGION').length,2);
});

test('angles: a colour is a palette name, one colour is one size, and it excludes emphasisGroup',()=>{
  expectCode(specError(with_(m=>{m.equalAngles[0].color='TEAL';})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.equalAngles[0].angles=['aAOD','aZZ'];})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.equalAngles[0].angles=['aAOD'];})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.angles[0].emphasisGroup=1;})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.angles[0].color='BLUE';})),'ANGLE_COLOR_INVALID');                                                          // differs from its equalAngles group
  expectCode(specError(with_(m=>{m.angles.push({id:'aAOB',refs:['A','O','B'],value:120,noLabel:true});m.equalAngles[0].angles=['aAOD','aAOB'];})),'ANGLE_COLOR_GROUP_MISMATCH');
  expectCode(specError(with_(m=>{m.angles.push({id:'aAOB',refs:['A','O','B'],value:120,noLabel:true,color:'WARM'});})),'ANGLE_COLOR_GROUP_MISMATCH');   // WARM is the 60 degree colour
  expectCode(specError(with_(m=>{m.equalAngles.push({angles:['aAOD','aBOC'],color:'WARM'});})),'ANGLE_COLOR_GROUP_MISMATCH');                  // an angle in two groups
  // a single angle may carry its own colour
  const own=with_(m=>{delete m.equalAngles;m.angles[0].color='GREEN';});
  assert.equal(specOf(own).objects.find(o=>o.id==='aAOD').color,'GREEN');
});

test('segments: unknown, repeated, styled or doubly coloured segments are refused',()=>{
  expectCode(specError(with_(m=>{m.segmentColors=[{segments:['sXX'],color:'ROSE'}];})),'SEGMENT_COLOR_UNKNOWN_SEGMENT');
  expectCode(specError(with_(m=>{m.segmentColors=[{segments:['sOA'],color:'ROSE'},{segments:['sOA'],color:'BLUE'}];})),'SEGMENT_COLOR_DUPLICATE');
  expectCode(specError(with_(m=>{m.segmentColors=[{segments:['sAB'],color:'ROSE'}];})),'SEGMENT_COLOR_DUPLICATE');                                 // sAB is already VIOLET through pAB
  expectCode(specError(with_(m=>{m.segmentColors=[{segments:['sOA'],color:'TEAL'}];})),'SEGMENT_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.segmentColors=[{segments:['sOA'],color:'VIOLET'}];})),'SEGMENT_COLOR_GROUP_MISMATCH');                         // VIOLET already means pAB
  expectCode(specError(with_(m=>{m.segmentColors=[];})),'SEGMENT_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.segmentColors[0].bogus=1;})),'MARK_FIELD_UNKNOWN');
  expectCode(specError(with_(m=>{m.parallels[0].color='TEAL';})),'SEGMENT_COLOR_INVALID');
  const styled=planOf(marks);styled.displaySegments[0].emphasis='BOLD';
  assert.throws(()=>specFor(styled,model,identity.assetId),error=>String(error.message).startsWith('SEGMENT_COLOR_INVALID'));
});

test('a coloured equalLengths / parallels row still has to be true',()=>{
  expectCode(specError(with_(m=>{m.equalLengths[0].segments=['sBC','sAB'];delete m.parallels[0].color;})),'EQUAL_MARK_LENGTH_MISMATCH');
  expectCode(specError(with_(m=>{m.parallels[0].segments=['sAB','sOC'];})),'PARALLEL_MARK_NOT_PARALLEL');
  expectCode(specError(with_(m=>{m.equalLengths[0].color='VIOLET';})),'SEGMENT_COLOR_GROUP_MISMATCH');                                          // one colour, two relations
});
