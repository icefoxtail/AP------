import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {showConstructionCircles,specFor,verifyConstructionConditionBindings,normalizeScalarLabelPrefix,displayGeometryInventory,compileConstructionWirePlan} from '../production/phase2.mjs';
import {constructionV1Graph,int} from './construction-v1-fixture.mjs';

test('bounded V1 constructions rebuild parallel, angle bisectors, circles, tangents and explicit intersections in Cindy',async()=>{
  const response=await pythonWorker({action:'construction',graph:constructionV1Graph});assert.equal(response.status,'OK',JSON.stringify(response.result));
  const model=response.result,peer=reconstruct(constructionV1Graph),comparison=compareReconstruction(model,peer);
  assert.equal(comparison.status,'PASS',JSON.stringify(comparison.errors));
  assert.deepEqual(model.points.crossLine.approximation,[0,0]);
  assert.deepEqual(model.points.contact.approximation,[.8,Math.sqrt(3.36)]);
  assert.deepEqual(model.lines.parallel.approximation,[0,1,-3]);
  assert.equal(model.circles.circle3.approximation[0],2);assert.equal(model.circles.circle3.approximation[1],1.5);assert.equal(model.circles.circle3.approximation[2],2.5);
  const [internalA,internalB]=model.lines.internalBisector.approximation,[externalA,externalB]=model.lines.externalBisector.approximation;
  assert.ok(Math.abs(internalA+internalB)<1e-12);assert.ok(Math.abs(externalA-externalB)<1e-12);
  assert.ok(Math.abs(model.lines.tangentAtA.approximation[0])<1e-12);
  assert.ok(Math.abs(model.lines.tangentAtA.approximation[1]*2+model.lines.tangentAtA.approximation[2])<1e-12);
  assert.equal(model.pointSets.contacts.length,2);
  assert.ok(Math.abs(model.scalars.ratio.approximation-4/3)<1e-12);
  assert.equal(model.conditionAudits.length,11);
  const labelSpec=specFor({caption:'source point labels',mathPlan:constructionV1Graph,coordinateLabels:['A','B']},model,'source-point-labels');
  for(const id of ['A','B']){
    assert.deepEqual(labelSpec.objects.find(object=>object.id===id+'-name'),{id:id+'-name',kind:'POINT_NAME',target:id,text:id,priority:0});
    assert.equal(labelSpec.objects.find(object=>object.id===id+'-coordinate').kind,'COORDINATE_LABEL');
  }
  const sssPlan={caption:'SSS realization',mathPlan:{...constructionV1Graph,realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true}}};
  const sssSpec=specFor(sssPlan,model,'sss-realization');
  assert.equal(showConstructionCircles(sssPlan),false);
  assert.equal(sssSpec.objects.some(object=>object.kind==='CIRCLE'),false);
  const ordinarySpec=specFor({caption:'circle construction',mathPlan:constructionV1Graph},model,'ordinary-construction');
  assert.equal(showConstructionCircles({mathPlan:constructionV1Graph}),true);
  assert.equal(ordinarySpec.objects.some(object=>object.kind==='CIRCLE'),true);
  const hiddenAuxiliaryCircles=specFor({caption:'source-only construction',mathPlan:constructionV1Graph,displayCircles:[]},model,'source-only-construction');
  assert.equal(hiddenAuxiliaryCircles.objects.some(object=>object.kind==='CIRCLE'),false);
  const derivedSpec=specFor({caption:'verified derived point',mathPlan:constructionV1Graph,coordinateLabels:['crossLine']},model,'derived-point-coordinates');
  assert.deepEqual(derivedSpec.objects.find(object=>object.id==='crossLine-coordinate').exact,['0','0']);
  const geometrySpan=Math.max(...Object.values(model.points).map(p=>p.approximation[0]))-Math.min(...Object.values(model.points).map(p=>p.approximation[0]));
  const verticalSpan=Math.max(...Object.values(model.points).map(p=>p.approximation[1]))-Math.min(...Object.values(model.points).map(p=>p.approximation[1]));
  const span=Math.max(geometrySpan,verticalSpan,1);
  assert.ok(Math.abs(ordinarySpec.viewport.xMin-(Math.min(...Object.values(model.points).map(p=>p.approximation[0]))-span*.35))<1e-12);
});

test('degenerate Construction V1 inputs remain explicit errors',async()=>{
  const cases=[
    [g=>g.nodes.find(n=>n.id==='parallel').inputs=['C','unknown'],'UNKNOWN_REFERENCE'],
    [g=>g.nodes.find(n=>n.id==='internalBisector').inputs=['V','V','Y'],'DEGENERATE_ANGLE_RAY'],
    [g=>g.nodes.find(n=>n.id==='circle3').inputs=['O','B','P'],'COLLINEAR_CIRCLE_POINTS'],
    [g=>g.nodes.find(n=>n.id==='circleO').inputs=['O','O'],'DEGENERATE_CIRCLE_RADIUS'],
    [g=>g.nodes.find(n=>n.id==='tangentAtA').inputs=['circleO','B'],'TANGENT_POINT_NOT_ON_CIRCLE'],
    [g=>g.nodes.find(n=>n.id==='lengthAC').inputs=['O','O'],'SCALAR_RATIO_DIVISION_ZERO'],
    [g=>g.nodes.find(n=>n.id==='crossLine').inputs=['axisX','parallel'],'UNIQUE_LINE_INTERSECTION_REQUIRED'],
  ];
  for(const [mutate,code] of cases){const graph=structuredClone(constructionV1Graph);mutate(graph);const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'ERROR',code+':'+response.result.code);assert.equal(response.result.code,code);}
  const badAudit=structuredClone(constructionV1Graph);badAudit.conditionAudits[1].expected=int(5);const badResponse=await pythonWorker({action:'construction',graph:badAudit});assert.equal(badResponse.status,'ERROR');assert.equal(badResponse.result.code,'CONDITION_AUDIT_FAIL:distance-AB-4:DISTANCE_EQUALS');
});

test('source-coordinate axes preserve the original frame and reject invented unit scales in both reconstructions',async()=>{
 const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  {id:'A',op:'SOURCE_POINT',inputs:[],args:{coordinates:[int(6),int(5)]},outputType:'POINT',factRole:'GIVEN'},
  {id:'O',op:'NORMALIZATION_ORIGIN',inputs:[],args:{},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
  {id:'X',op:'NORMALIZATION_AXIS',inputs:[],args:{length:int(1)},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'}
 ]};
 const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK');
 assert.equal(response.result.coordinateMode,'SOURCE_COORDINATES');assert.deepEqual(response.result.points.A.approximation,[6,5]);
 assert.equal(compareReconstruction(response.result,reconstruct(graph)).status,'PASS');
 const framed=specFor({caption:'source coordinate frame',mathPlan:graph,coordinateLabels:['A'],coordinateCanvas:{width:512,height:420}},response.result,'source-coordinate-framed');
 assert.equal(framed.viewport.width,512);assert.equal(framed.viewport.height,420);
 assert.throws(()=>specFor({caption:'invalid source frame',mathPlan:graph,coordinateCanvas:{width:721,height:420}},response.result,'invalid-source-frame'),/COORDINATE_CANVAS_BOUNDS_INVALID/);
 graph.nodes[2].args.length=int(2);
 assert.equal((await pythonWorker({action:'construction',graph})).status,'ERROR');
 assert.throws(()=>reconstruct(graph),/SOURCE_COORDINATE_UNIT_AXIS_INVALID/);
 const missingAxis=structuredClone(graph);missingAxis.nodes=missingAxis.nodes.filter(n=>n.op!=='NORMALIZATION_AXIS');
 assert.equal((await pythonWorker({action:'construction',graph:missingAxis})).result.code,'SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED');
 assert.throws(()=>reconstruct(missingAxis),/SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED/);
 const missingOrigin=structuredClone(graph);missingOrigin.nodes=missingOrigin.nodes.filter(n=>n.op!=='NORMALIZATION_ORIGIN');
 assert.equal((await pythonWorker({action:'construction',graph:missingOrigin})).result.code,'SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED');
 assert.throws(()=>reconstruct(missingOrigin),/SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED/);
});

test('Cindy resolves selected circle branches before a dependent line intersection',async()=>{
 const sqrt13={kind:'expression',op:'sqrt',args:[int(13)]};
 const twiceSqrt13={kind:'expression',op:'mul',args:[int(2),sqrt13]};
 const graph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false},nodes:[
  {id:'O',op:'NORMALIZATION_ORIGIN',inputs:[],args:{},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
  {id:'X',op:'NORMALIZATION_AXIS',inputs:[],args:{length:int(1)},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
  {id:'A',op:'SOURCE_POINT',inputs:[],args:{coordinates:[int(6),int(5)]},outputType:'POINT',factRole:'GIVEN'},
  {id:'B',op:'SOURCE_POINT',inputs:[],args:{coordinates:[int(2),int(-1)]},outputType:'POINT',factRole:'GIVEN'},
  {id:'XAxis',op:'LINE_THROUGH',inputs:['O','X'],args:{},outputType:'LINE',factRole:'DERIVED_INTERMEDIATE'},
  {id:'CircleA',op:'CIRCLE_CENTER_RADIUS',inputs:['A'],args:{radius:twiceSqrt13},outputType:'CIRCLE',factRole:'DERIVED_INTERMEDIATE'},
  {id:'CircleB',op:'CIRCLE_CENTER_RADIUS',inputs:['B'],args:{radius:twiceSqrt13},outputType:'CIRCLE',factRole:'DERIVED_INTERMEDIATE'},
  {id:'Roots',op:'INTERSECTION',inputs:['CircleA','CircleB'],args:{},outputType:'POINT_SET',factRole:'DERIVED_INTERMEDIATE'},
  {id:'U',op:'SELECT_POINT',inputs:['Roots'],args:{},branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['A','B'],sign:1},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
  {id:'V',op:'SELECT_POINT',inputs:['Roots'],args:{},branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:['A','B'],sign:-1},outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
  {id:'Bisector',op:'LINE_THROUGH',inputs:['U','V'],args:{},outputType:'LINE',factRole:'DERIVED_INTERMEDIATE'},
  {id:'P',op:'LINE_INTERSECTION',inputs:['XAxis','Bisector'],args:{},outputType:'POINT',factRole:'CONCLUSION'},
  {id:'LengthPA',op:'SEGMENT_LENGTH',inputs:['P','A'],args:{},outputType:'SCALAR',factRole:'CONCLUSION'},
  {id:'LengthPB',op:'SEGMENT_LENGTH',inputs:['P','B'],args:{},outputType:'SCALAR',factRole:'CONCLUSION'}
 ],conditionAudits:[
  {type:'INCIDENCE_POINT_ON_LINE',refs:['P','XAxis'],sourceConditionId:'OnXAxis'},
  {type:'EQUAL_DISTANCE',refs:['P','A','P','B'],sourceConditionId:'EqualDistances'}
 ]};
 const compiled=compileConstructionWirePlan({mathPlan:graph}).mathPlan,model=await pythonWorker({action:'construction',graph:compiled});
 assert.equal(model.status,'OK',JSON.stringify(model.result));
 const peer=reconstruct(compiled),comparison=compareReconstruction(model.result,peer);
 assert.equal(comparison.status,'PASS',JSON.stringify(comparison.errors));
 assert.ok(Math.abs(peer.points.P[0]-7)<1e-12);assert.ok(Math.abs(peer.points.P[1])<1e-12);
 assert.ok(Math.abs(peer.scalars.LengthPA-Math.sqrt(26))<1e-12);
 assert.ok(Math.abs(peer.scalars.LengthPB-Math.sqrt(26))<1e-12);
 assert.deepEqual(peer.conditionAudits.map(row=>({kind:row.kind,sourceConditionId:row.sourceConditionId,status:row.status})),[
  {kind:'INCIDENCE_POINT_ON_LINE',sourceConditionId:'OnXAxis',status:'PASS'},
  {kind:'EQUAL_DISTANCE',sourceConditionId:'EqualDistances',status:'PASS'}
 ]);
});

test('display inventory cannot hide given or conclusion points and scalar notation keeps powers and pure values',()=>{
 const plan={mathPlan:{nodes:[{id:'A',op:'SOURCE_POINT',outputType:'POINT',factRole:'GIVEN'},{id:'O',op:'NORMALIZATION_ORIGIN',outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},{id:'P',op:'LINE_INTERSECTION',outputType:'POINT',factRole:'CONCLUSION'}]},displayPoints:['A','P'],displayLines:[]};
 const model={points:{A:{},O:{},P:{}},lines:{},circles:{}};
 assert.deepEqual(Object.keys(displayGeometryInventory(plan,model).points),['A','P']);
 assert.throws(()=>displayGeometryInventory({...plan,displayPoints:['P']},model),/REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED/);
 assert.throws(()=>displayGeometryInventory({...plan,displayPoints:['A']},model),/REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED/);
 assert.equal(normalizeScalarLabelPrefix('k² = '),'k^2');assert.equal(normalizeScalarLabelPrefix(''),'');
 assert.throws(()=>normalizeScalarLabelPrefix('debug label'),/UNSUPPORTED_SCALAR_LABEL_PREFIX/);
});

test('wire audit aliases normalize without changing mathematical refs or guessing conflicting condition kinds',()=>{
 const input={mathPlan:{nodes:[],conditionAudits:[{type:'EQUAL_DISTANCE',refs:['P','A','P','B'],sourceConditionId:'equal'}]},sourceConditions:[{id:'equal',condition:'PA=PB'}]};
 const compiled=compileConstructionWirePlan(input);
 assert.deepEqual(compiled.mathPlan.conditionAudits,[{id:'conditionAudit1',kind:'EQUAL_DISTANCE',refs:['P','A','P','B'],sourceConditionId:'equal'}]);
 assert.equal(input.mathPlan.conditionAudits[0].type,'EQUAL_DISTANCE');assert.deepEqual(compiled.sourceConditions,input.sourceConditions);
 assert.throws(()=>compileConstructionWirePlan({mathPlan:{conditionAudits:[{type:'EQUAL_DISTANCE',kind:'PARALLEL'}]}}),/TYPE_ALIAS_CONFLICT/);
 assert.throws(()=>compileConstructionWirePlan({mathPlan:{conditionAudits:[{refs:['A','B']}]}}),/CONDITION_AUDIT_KIND_REQUIRED/);
 assert.throws(()=>compileConstructionWirePlan({mathPlan:{conditionAudits:[{id:'same',kind:'EQUAL_DISTANCE'},{id:'same',kind:'PARALLEL'}]}}),/CONDITION_AUDIT_ID_DUPLICATE/);
});

test('typed condition audit IDs must resolve to frozen source condition IDs',()=>{
  const sourceConditions=constructionV1Graph.conditionAudits.map(audit=>({id:audit.sourceConditionId,condition:audit.kind+' source fact',mappedTo:audit.refs.join('|')}));
  assert.doesNotThrow(()=>verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions}));
  const multiTargetConditions=sourceConditions.map((row,index)=>({...row,mappedTo:index===0?['A','coordinateLabels']:['PRESERVED_ARCHIVE_BANK',row.mappedTo]}));
  assert.doesNotThrow(()=>verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions:multiTargetConditions}));
  assert.throws(()=>verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions:sourceConditions.slice(1)}),/CONDITION_AUDIT_SOURCE_BINDING_REQUIRED/);
  assert.throws(()=>verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions:sourceConditions.map((row,index)=>index?row:{...row,extra:true})}),/INVALID_SOURCE_CONDITION_BINDING/);
  for(const mappedTo of [[],['A',''],['A','A'],{}]){
    assert.throws(()=>verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions:sourceConditions.map((row,index)=>index?row:{...row,mappedTo})}),/INVALID_SOURCE_CONDITION_BINDING/);
  }
});

// M1-E: MIDPOINT of two coincident points. SymPy Segment(P, P) collapses to a Point2D, so the old `Segment(*a).midpoint` was a bound method:
// `mid` was silently missing from the output, or a dependent operation failed. Point.midpoint(P, P) is P itself, the value Cindy `Mid` gives too.
const m1eNode=(id,op,inputs,outputType,args={})=>({id,op,inputs,outputType,args,factRole:inputs.length?'DERIVED_INTERMEDIATE':'GIVEN'});
const m1ePoint=(id,x,y)=>m1eNode(id,'SOURCE_POINT',[],'POINT',{coordinates:[x,y]});
const m1eGraph=nodes=>({schemaVersion:'construction-spike-v1',nodes});
const m1eCoincident=()=>[m1ePoint('O',int(0),int(0)),m1ePoint('P',int(0),int(0)),m1eNode('mid','MIDPOINT',['O','P'],'POINT')];

test('M1-E D1 MIDPOINT of two coincident points is that point: emitted, exact [0,0], confirmed by Cindy',async()=>{
  const graph=m1eGraph(m1eCoincident()),response=await pythonWorker({action:'construction',graph});
  assert.equal(response.status,'OK',JSON.stringify(response.result));
  assert.deepEqual(Object.keys(response.result.points).sort(),['O','P','mid']);
  assert.deepEqual(response.result.points.mid.exact,[int(0),int(0)]);assert.deepEqual(response.result.points.mid.approximation,[0,0]);
  const comparison=compareReconstruction(response.result,reconstruct(graph));assert.equal(comparison.status,'PASS',JSON.stringify(comparison.errors));
});

test('M1-E D2 a circle through the coincident midpoint is the DEGENERATE_CIRCLE_RADIUS engine error, not a worker crash',async()=>{
  const graph=m1eGraph([...m1eCoincident(),m1eNode('c','CIRCLE_THROUGH_POINT',['mid','P'],'CIRCLE')]);
  const response=await pythonWorker({action:'construction',graph});
  assert.equal(response.status,'ERROR',JSON.stringify(response.result));assert.equal(response.result.code,'DEGENERATE_CIRCLE_RADIUS');
});

test('M1-E D3 a line through the coincident midpoint and another point is emitted and confirmed by Cindy',async()=>{
  const graph=m1eGraph([...m1eCoincident(),m1ePoint('Q',int(3),int(1)),m1eNode('l','LINE_THROUGH',['mid','Q'],'LINE')]);
  const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));
  assert.deepEqual(Object.keys(response.result.points).sort(),['O','P','Q','mid']);assert.deepEqual(response.result.points.mid.exact,[int(0),int(0)]);
  // The emitted line a*x+b*y+c=0 must pass through (0,0) and (3,1) and be a real line; the coefficient sign is not part of the contract.
  const [a,b,c]=response.result.lines.l.approximation;
  assert.ok(Math.abs(c)<1e-12,'through the origin');assert.ok(Math.abs(3*a+b+c)<1e-12,'through (3,1)');assert.ok(Math.abs(a)+Math.abs(b)>0,'nonzero normal');
  const comparison=compareReconstruction(response.result,reconstruct(graph));assert.equal(comparison.status,'PASS',JSON.stringify(comparison.errors));
});

test('M1-E D4 MIDPOINT of two irrational points keeps the exact output it had before the fix',async()=>{
  const sqrt=value=>({kind:'expression',op:'sqrt',args:[int(value)]}),rat=(numerator,denominator)=>({kind:'rational',numerator:String(numerator),denominator:String(denominator)});
  const halfSqrt=value=>({kind:'expression',op:'mul',args:[rat(1,2),sqrt(value)]});
  const graph=m1eGraph([m1ePoint('A',sqrt(2),int(1)),m1ePoint('B',int(3),sqrt(3)),m1eNode('mid','MIDPOINT',['A','B'],'POINT')]);
  const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));
  // Pinned from the engine before the change (M1-E builder d4-before): (3 + sqrt 2)/2 and (1 + sqrt 3)/2 in SymPy's own exact form.
  assert.deepEqual(response.result.points.mid.exact,[{kind:'expression',op:'add',args:[rat(3,2),halfSqrt(2)]},{kind:'expression',op:'add',args:[rat(1,2),halfSqrt(3)]}]);
  assert.deepEqual(response.result.points.mid.approximation,[2.2071067811865475,1.3660254037844386]);
  assert.equal(response.result.points.mid.precisionDigits,17);
  // Independent derivation of the same point by hand, so the pinned literal is not only a copy of the engine.
  assert.ok(Math.abs(response.result.points.mid.approximation[0]-(Math.SQRT2+3)/2)<1e-15);assert.ok(Math.abs(response.result.points.mid.approximation[1]-(1+Math.sqrt(3))/2)<1e-15);
  const comparison=compareReconstruction(response.result,reconstruct(graph));assert.equal(comparison.status,'PASS',JSON.stringify(comparison.errors));
});
