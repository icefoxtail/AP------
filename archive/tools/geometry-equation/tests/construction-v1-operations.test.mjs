import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {verifyConstructionConditionBindings} from '../production/phase2.mjs';
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
