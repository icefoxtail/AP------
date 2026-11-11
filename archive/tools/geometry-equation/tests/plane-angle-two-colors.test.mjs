// An angle in two relations (fillColor): angles[].color is the arc (stroke) colour, angles[].fillColor the sector fill colour, each role from the C1 palette.
// Equal-size is checked per role. Real SymPy worker for the model, no browser. Run with --test-concurrency=1.
import test,{before} from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {int,node} from './construction-v1-fixture.mjs';

const identity=assetIdentity('l1_unit_exam|1','SOLUTION_VISUAL','decisive-relation');
const source=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const polar=(id,center,reference,length,angle,turn='CCW')=>({...node(id,'POLAR_POINT',[center,reference],'POINT',{length:int(length),angleDeg:int(angle),turn}),factRole:'GIVEN'});
const derived=(id,op,inputs,type,args={})=>({...node(id,op,inputs,type,args),factRole:'DERIVED_INTERMEDIATE'});
// circle k (centre O): A(30) B(150) C(210) D(330) degrees: AOB = COD = 120, AOD = BOC = 60
const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  source('O',0,0),derived('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)}),{...node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)}),factRole:'GIVEN'},
  polar('A','O','X',5,30),polar('B','O','X',5,150),polar('C','O','X',5,210),polar('D','O','X',5,330)]};
// two relations at once: the 60 degree pair wears one BLUE arc colour and the 120 degree pair one WARM sector fill; aAOD also fills in GREEN? no: aAOD is in both roles
const marks={
  angles:[
    {id:'aAOD',refs:['A','O','D'],value:60,noLabel:true,color:'BLUE',fillColor:'WARM'},                  // arc relation BLUE and fill relation WARM at once
    {id:'aBOC',refs:['B','O','C'],value:60,noLabel:true,color:'BLUE',style:'ARC'},                       // only the arc relation
    {id:'aAOB',refs:['A','O','B'],value:120,noLabel:true},
    {id:'aCOD',refs:['C','O','D'],value:120,noLabel:true,style:'SECTOR'}],
  equalAngles:[{angles:['aAOB','aCOD'],fillColor:'GREEN'}]};
const segment=(id,a,b)=>({id,refs:[a,b]});
const planOf=planeMarks=>({capability:'construction-spike-v1',caption:'원 O 안의 같은 크기의 각을 파란 호와 부채꼴 색으로 나타냈다.',mathPlan:graph,
  displayPoints:['O','A','B','C','D'],displayLines:[],displayCircles:['k'],
  displaySegments:[segment('sOA','O','A'),segment('sOB','O','B'),segment('sOC','O','C'),segment('sOD','O','D')],planeMarks});
const clone=value=>JSON.parse(JSON.stringify(value));
let model;
before(async()=>{const response=await pythonWorker({action:'construction',graph},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));model=response.result;});
const specOf=planeMarks=>specFor(planOf(planeMarks),model,identity.assetId);
const specError=planeMarks=>{try{specOf(planeMarks);}catch(error){return String(error.message);}assert.fail('specFor accepted the marks');};
const expectCode=(message,code)=>assert.ok(String(message).startsWith(code),`${code} expected, got ${message}`);
const with_=change=>{const copy=clone(marks);change(copy);return copy;};

test('arc colour and sector fill colour are two roles of one angle mark',()=>{
  const objects=specOf(marks).objects,byId=id=>objects.find(o=>o.id===id);
  assert.equal(byId('aAOD').color,'BLUE');assert.equal(byId('aAOD').fillColor,'WARM');
  assert.equal(byId('aBOC').color,'BLUE');assert.equal(byId('aBOC').fillColor,undefined);
  assert.equal(byId('aAOB').color,undefined);assert.equal(byId('aAOB').fillColor,'GREEN');         // equalAngles with fillColor only colours the fill
  assert.equal(byId('aCOD').fillColor,'GREEN');
});

test('without fillColor an angle plan is unchanged: color still colours the arcs and the sector',()=>{
  const plain=with_(m=>{delete m.equalAngles;m.angles=[{id:'aAOD',refs:['A','O','D'],value:60,noLabel:true,color:'BLUE'},{id:'aBOC',refs:['B','O','C'],value:60,noLabel:true,color:'BLUE'}];});
  for(const object of specOf(plain).objects.filter(o=>o.kind==='ANGLE_MARK')){assert.equal(object.color,'BLUE');assert.ok(!('fillColor' in object));}
});

test('equal size is checked inside each role',()=>{
  expectCode(specError(with_(m=>{m.angles[2].fillColor='WARM';delete m.equalAngles;})),'ANGLE_COLOR_GROUP_MISMATCH');        // WARM fill is the 60 degree fill
  expectCode(specError(with_(m=>{m.angles[2].color='BLUE';})),'ANGLE_COLOR_GROUP_MISMATCH');                                 // BLUE arc is the 60 degree arc
  expectCode(specError(with_(m=>{m.angles[1].fillColor='GREEN';m.angles[1].style='SECTOR';})),'ANGLE_COLOR_GROUP_MISMATCH');   // GREEN fill is the 120 degree fill
  expectCode(specError(with_(m=>{m.equalAngles.push({angles:['aAOB','aCOD'],fillColor:'GREEN'});})),'ANGLE_COLOR_GROUP_MISMATCH');   // an angle in two fill groups
});

test('both roles take palette names only',()=>{
  expectCode(specError(with_(m=>{m.angles[0].fillColor='TEAL';})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.angles[0].fillColor='LIGHT';})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.angles[0].color='TEAL';})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.equalAngles[0].fillColor='TEAL';})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{delete m.equalAngles[0].fillColor;})),'ANGLE_COLOR_INVALID');                              // a group with neither colour
  expectCode(specError(with_(m=>{m.angles[0].fillColor=7;})),'ANGLE_COLOR_INVALID');
});

test('the fill needs a sector, the arc a colour it does not share with a fill, and emphasisGroup stays apart',()=>{
  expectCode(specError(with_(m=>{m.angles[1].fillColor='WARM';})),'ANGLE_COLOR_INVALID');                                    // aBOC is an ARC style mark: no sector to fill
  expectCode(specError(with_(m=>{m.angles[0].emphasisGroup=1;})),'ANGLE_COLOR_INVALID');
  expectCode(specError(with_(m=>{m.angles[3].fillColor='BLUE';m.angles[2].fillColor='BLUE';delete m.equalAngles;})),'ANGLE_COLOR_ROLE_CLASH');   // BLUE is an arc colour of the 60 degree pair
});
