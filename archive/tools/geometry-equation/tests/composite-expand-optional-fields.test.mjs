// A single figure (number line / quadratic chain / solid) expanded to composite-panels-v1 copies sourceConditions and newVisualInformation only when
// the author wrote them: an absent field used to be copied as undefined, which is not canonical JSON, and every such plan failed to render
// (COMPOSITE_INPUT_NOT_CANONICAL). No browser needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {objectSha} from '../../pipeline-core/canonical.mjs';
import {expandNumberLineFigure} from '../production/number-line-v1.mjs';
import {expandInequalityChain} from '../production/quadratic-inequality-chain-v1.mjs';
import {expandSolidFigure} from '../production/solid-figure-v1.mjs';
import {presentFields,OPTIONAL_COMPOSITE_FIELDS} from '../production/composite-expand-fields.mjs';

const SC=[{id:'c1',condition:'조건',mappedTo:['x']}],NVI=['새 정보'];
const KINDS={
  'number-line-figure-v1':{expand:expandNumberLineFigure,plan:{capability:'number-line-figure-v1',numberLine:{variable:'x',rows:[{kind:'SET',pieces:[{lo:{value:'-1',state:'OPEN'},hi:null}]},{kind:'SET',pieces:[{lo:null,hi:{value:'4',state:'CLOSED'}}]},{kind:'RESULT',integerPoints:true}]},caption:'공통 범위'}},
  'quadratic-inequality-chain-v1':{expand:expandInequalityChain,plan:{capability:'quadratic-inequality-chain-v1',inequality:{coefficients:['-15','-2','1'],comparator:'<',variable:'a',adjoinedPoints:['-3'],integerPoints:true},caption:'D/4<0 이므로 -3≤a<5'}},
  'solid-figure-v1':{expand:expandSolidFigure,plan:{capability:'solid-figure-v1',solids:[{kind:'REGULAR_POLYHEDRON',faces:4,side:12,names:'BCDA',points:[{id:'H',at:{base:'centroid'}}]}],segments:[{from:'A',to:'H',style:'DASHED',role:'ACCENT'}],caption:'정사면체 ABCD의 꼭짓점 A에서 밑면에 내린 수선의 발 H'}},
};

test('presentFields keeps the order of the keys and drops what the author did not write',()=>{
  assert.deepEqual([...OPTIONAL_COMPOSITE_FIELDS],['sourceConditions','newVisualInformation']);
  assert.deepEqual(Object.keys(presentFields({newVisualInformation:NVI,sourceConditions:SC})),['sourceConditions','newVisualInformation']);
  assert.deepEqual(presentFields({}),{});assert.deepEqual(presentFields({sourceConditions:SC}),{sourceConditions:SC});
  assert.deepEqual(presentFields({newVisualInformation:[]}),{newVisualInformation:[]},'an empty list was written, so it stays');
  assert.deepEqual(presentFields({sourceConditions:undefined,newVisualInformation:undefined}),{});
});

for(const [capability,{expand,plan}] of Object.entries(KINDS))test(`${capability}: both fields absent / one / both give a canonical composite`,()=>{
  for(const [name,extra] of [['neither',{}],['conditions only',{sourceConditions:SC}],['information only',{newVisualInformation:NVI}],['both',{sourceConditions:SC,newVisualInformation:NVI}]]){
    const expanded=expand({...plan,...extra});
    assert.equal(expanded.capability,'composite-panels-v1',name);
    assert.doesNotThrow(()=>objectSha(expanded),`${name}: canonical JSON`);
    for(const key of OPTIONAL_COMPOSITE_FIELDS)assert.equal(Object.hasOwn(expanded,key),Object.hasOwn(extra,key),`${name}: ${key} is there exactly when the author wrote it`);
    if(extra.sourceConditions)assert.deepEqual(expanded.sourceConditions,SC);
    if(extra.newVisualInformation)assert.deepEqual(expanded.newVisualInformation,NVI);
  }
  // a plan that had both fields expands as before: the same keys in the same order, so its digests do not move
  const both=expand({...plan,sourceConditions:SC,newVisualInformation:NVI});
  const keys=Object.keys(both);assert.deepEqual(keys.slice(keys.indexOf('sourceConditions')),['sourceConditions','newVisualInformation']);
  assert.ok(keys.indexOf('caption')<keys.indexOf('sourceConditions'));
});
