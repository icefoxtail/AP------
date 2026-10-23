import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyConstructionConditionBindings} from '../production/phase2.mjs';

const bodyRef=()=>({kind:'PRESERVED_ARCHIVE_BANK',field:'content'});
const row=(overrides={})=>({
  sourceConditionId:'given-a',factId:'A',factRole:'GIVEN',displayDisposition:'SVG_REQUIRED',
  expectedOwner:'A',preservedLocationRef:null,reason:null,...overrides
});
function plan({rows,map=true,sourceConditions,nodes,audits=[]}={}){
  const source=sourceConditions??[
    {id:'given-a',condition:'A is given',mappedTo:'A'},
    {id:'body-b',condition:'body condition',mappedTo:['PRESERVED_ARCHIVE_BANK','body-b']}
  ];
  const mathNodes=nodes??[
    {id:'A',outputType:'POINT',factRole:'GIVEN'},
    {id:'M',outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
    {id:'L',outputType:'LINE',factRole:'CONCLUSION'},
    {id:'C',outputType:'CIRCLE',factRole:'DERIVED_INTERMEDIATE'}
  ];
  const value={mathPlan:{nodes:mathNodes,conditionAudits:audits},sourceConditions:source};
  if(map)value.factDisplayMap={schemaVersion:'VISUAL_FACT_DISPLAY_MAP_v1',rows:rows??[
    row(),
    row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()}),
    row({sourceConditionId:null,factId:'L',factRole:'CONCLUSION',expectedOwner:'L'}),
    row({sourceConditionId:null,factId:'M',factRole:'DERIVED_INTERMEDIATE',displayDisposition:'OMITTED_AUXILIARY',expectedOwner:null,preservedLocationRef:null,reason:'intermediate construction aid'})
  ]};
  return value;
}

test('opt-in map accepts explicit SVG, Archive body, and auxiliary dispositions without issuing a verdict',()=>{
  assert.equal(verifyConstructionConditionBindings(plan()),undefined);
});

test('legacy plans without a map retain opaque string and string-array mappedTo values',()=>{
  const legacy=plan({map:false,sourceConditions:[
    {id:'opaque-1',condition:'legacy',mappedTo:'construction-node-refs:A,B'},
    {id:'opaque-2',condition:'legacy',mappedTo:['PRESERVED_ARCHIVE_BANK','not parsed']}
  ]});
  assert.equal(verifyConstructionConditionBindings(legacy),undefined);
});

test('every supplied source condition needs an explicit non-omitted disposition',()=>{
  const p=plan({rows:[row()]});
  assert.throws(()=>verifyConstructionConditionBindings(p),/SOURCE_CONDITION_DISPLAY_COVERAGE_MISSING/);
});

test('a source condition cannot be omitted or hidden by a null source id',()=>{
  const p=plan({rows:[
    row({displayDisposition:'OMITTED_AUXILIARY',factId:'A',factRole:'DERIVED_INTERMEDIATE',expectedOwner:null,reason:'hide source fact'}),
    row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()})
  ]});
  assert.throws(()=>verifyConstructionConditionBindings(p),/OMITTED_AUXILIARY_SOURCE_LINKED/);
  const hidden=plan({sourceConditions:[
    {id:'given-a',condition:'A is given',mappedTo:['A','M']},
    {id:'body-b',condition:'body condition',mappedTo:['PRESERVED_ARCHIVE_BANK','body-b']}
  ],rows:[
    row(),
    row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()}),
    row({sourceConditionId:null,factId:'M',factRole:'DERIVED_INTERMEDIATE',displayDisposition:'OMITTED_AUXILIARY',expectedOwner:null,preservedLocationRef:null,reason:'claimed auxiliary'})
  ]});
  assert.throws(()=>verifyConstructionConditionBindings(hidden),/OMITTED_AUXILIARY_SOURCE_LINKED/);
});

test('SVG_REQUIRED binds exact source target, supported node, role, and entity owner',()=>{
  const body=row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()});
  const sourceConditions=(target='A',id='given-a')=>[
    {id,condition:'A is given',mappedTo:target},
    {id:'body-b',condition:'body condition',mappedTo:['PRESERVED_ARCHIVE_BANK','body-b']}
  ];
  const construct=(givenRow,conditions=sourceConditions(),nodes=[
    {id:'A',outputType:'POINT',factRole:'GIVEN'},
    {id:'M',outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
    {id:'scalar',outputType:'SCALAR',factRole:'GIVEN'}
  ])=>plan({rows:[givenRow,body],sourceConditions:conditions,nodes});

  assert.throws(()=>verifyConstructionConditionBindings(construct(row({sourceConditionId:'missing'}),sourceConditions('A'))),/UNKNOWN_FACT_DISPLAY_SOURCE_CONDITION:missing/);
  assert.throws(()=>verifyConstructionConditionBindings(construct(row({factId:'missing',expectedOwner:'missing'}),sourceConditions('missing'))),/UNKNOWN_FACT_DISPLAY_CONSTRUCTION_NODE:missing/);
  assert.throws(()=>verifyConstructionConditionBindings(construct(row({expectedOwner:'M'}))),/FACT_DISPLAY_EXPECTED_OWNER_MISMATCH:A/);
  assert.throws(()=>verifyConstructionConditionBindings(construct(row({factRole:'CONCLUSION'}))),/FACT_DISPLAY_NODE_ROLE_MISMATCH:A/);
  assert.throws(()=>verifyConstructionConditionBindings(construct(row({factId:'scalar',expectedOwner:'scalar'}),sourceConditions('scalar'))),/UNSUPPORTED_FACT_DISPLAY_NODE_TYPE:scalar:SCALAR/);

  const wrongLegacyTarget=plan({sourceConditions:[
    {id:'given-a',condition:'A is given',mappedTo:'B'},
    {id:'body-b',condition:'body condition',mappedTo:'PRESERVED_ARCHIVE_BANK'}
  ]});
  assert.throws(()=>verifyConstructionConditionBindings(wrongLegacyTarget),/LEGACY_MAPPING_TARGET_MISMATCH/);
});

test('body preservation requires the exact source identity, legacy token, and supported field ref',()=>{
  const valid=row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()});
  const p=plan({rows:[row(),valid]});
  assert.equal(verifyConstructionConditionBindings(p),undefined);
  for(const patch of [
    {factId:'another-id'},
    {preservedLocationRef:{kind:'PRESERVED_ARCHIVE_BANK',field:'unknown'}},
    {preservedLocationRef:null},
    {expectedOwner:'body-b'},
    {reason:'inactive field must be null'}
  ]){
    const bad=plan({rows:[row(),{...valid,...patch}]});
    assert.throws(()=>verifyConstructionConditionBindings(bad),/PRESERVED|CONDITIONAL|FACT_DISPLAY/);
  }
  const opaque=plan({sourceConditions:[
    {id:'given-a',condition:'A is given',mappedTo:'A'},
    {id:'body-b',condition:'body condition',mappedTo:'archive-body'}
  ],rows:[row(),valid]});
  assert.throws(()=>verifyConstructionConditionBindings(opaque),/PRESERVED_ARCHIVE_BANK_MAPPING_REQUIRED/);
});

test('one source condition may be preserved in the body and displayed with a consistent role',()=>{
  const conditions=[
    {id:'given-a',condition:'A is given',mappedTo:'A'},
    {id:'body-b',condition:'body condition',mappedTo:['PRESERVED_ARCHIVE_BANK','body-b','A']}
  ];
  const rows=[
    row(),
    row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()}),
    row({sourceConditionId:'body-b',factId:'A',factRole:'GIVEN',expectedOwner:'A'})
  ];
  assert.equal(verifyConstructionConditionBindings(plan({sourceConditions:conditions,rows})),undefined);
});

test('auxiliary omission is restricted to unreferenced DERIVED_INTERMEDIATE construction nodes with a reason',()=>{
  const base=plan(),auxiliary=base.factDisplayMap.rows.find(value=>value.displayDisposition==='OMITTED_AUXILIARY');
  for(const patch of [
    {sourceConditionId:'given-a'},
    {factRole:'GIVEN'},
    {factRole:'CONCLUSION'},
    {factId:'unknown'},
    {factId:'L'},
    {reason:''}
  ]){
    const omission={...auxiliary,...patch};
    const bad={...base,factDisplayMap:{...base.factDisplayMap,rows:[base.factDisplayMap.rows[0],base.factDisplayMap.rows[1],omission]}};
    assert.throws(()=>verifyConstructionConditionBindings(bad),/OMITTED_AUXILIARY|FACT_DISPLAY|UNSUPPORTED/);
  }
  const sourceMapped=plan({sourceConditions:[
    {id:'given-a',condition:'A is given',mappedTo:['A','M']},
    {id:'body-b',condition:'body condition',mappedTo:'PRESERVED_ARCHIVE_BANK'}
  ]});
  assert.throws(()=>verifyConstructionConditionBindings(sourceMapped),/OMITTED_AUXILIARY_SOURCE_LINKED/);
});

test('schema, row shape, enums, duplicate rows, conflicting roles, and duplicate referenced node IDs fail closed',()=>{
  const valid=plan();
  const invalidMaps=[
    null,
    {...valid.factDisplayMap,schemaVersion:'future'},
    {...valid.factDisplayMap,extra:true},
    {...valid.factDisplayMap,rows:[]},
    {...valid.factDisplayMap,rows:[{...valid.factDisplayMap.rows[0],extra:true}]},
    {...valid.factDisplayMap,rows:[{...valid.factDisplayMap.rows[0],displayDisposition:'UNKNOWN'}]},
    {...valid.factDisplayMap,rows:[valid.factDisplayMap.rows[0],valid.factDisplayMap.rows[0],valid.factDisplayMap.rows[1],valid.factDisplayMap.rows[2]]},
    {...valid.factDisplayMap,rows:[valid.factDisplayMap.rows[0],row({sourceConditionId:'body-b',factId:'A',factRole:'CONCLUSION'}),valid.factDisplayMap.rows[1],valid.factDisplayMap.rows[2]]}
  ];
  for(const factDisplayMap of invalidMaps)assert.throws(()=>verifyConstructionConditionBindings({...valid,factDisplayMap}),/FACT_DISPLAY|INVALID_SOURCE|CONTRADICTORY/);
  const duplicateNode=plan({nodes:[
    {id:'A',outputType:'POINT',factRole:'GIVEN'},
    {id:'A',outputType:'LINE',factRole:'GIVEN'},
    {id:'M',outputType:'POINT',factRole:'DERIVED_INTERMEDIATE'},
    {id:'L',outputType:'LINE',factRole:'CONCLUSION'},
    {id:'C',outputType:'CIRCLE',factRole:'DERIVED_INTERMEDIATE'}
  ]});
  assert.throws(()=>verifyConstructionConditionBindings(duplicateNode),/DUPLICATE_CONSTRUCTION_NODE_ID/);
});

test('SVG_REQUIRED and OMITTED_AUXILIARY conflict per fact independent of row order',()=>{
  const body=row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()});
  const svg=row({sourceConditionId:null,factId:'M',factRole:'DERIVED_INTERMEDIATE',expectedOwner:'M'});
  const omitted=row({sourceConditionId:null,factId:'M',factRole:'DERIVED_INTERMEDIATE',displayDisposition:'OMITTED_AUXILIARY',expectedOwner:null,reason:'auxiliary'});
  for(const rows of [[row(),body,svg,omitted],[row(),body,omitted,svg]])
    assert.throws(()=>verifyConstructionConditionBindings(plan({rows})),/SVG_REQUIRED_OMITTED_CONFLICT/);
});

test('tuple identity does not split punctuation-bearing source and fact IDs',()=>{
  const conditions=[
    {id:'a|b',condition:'first fact',mappedTo:'A'},
    {id:'a',condition:'second fact',mappedTo:'M'},
    {id:'body-b',condition:'body condition',mappedTo:'PRESERVED_ARCHIVE_BANK'}
  ];
  const rows=[
    row({sourceConditionId:'a|b'}),
    row({sourceConditionId:'a',factId:'M',factRole:'DERIVED_INTERMEDIATE',displayDisposition:'SVG_REQUIRED',expectedOwner:'M'}),
    row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()})
  ];
  assert.equal(verifyConstructionConditionBindings(plan({sourceConditions:conditions,rows})),undefined);
  const duplicate=[...rows,{...rows[0]}];
  assert.throws(()=>verifyConstructionConditionBindings(plan({sourceConditions:conditions,rows:duplicate})),/DUPLICATE_FACT_DISPLAY_ROW/);
});

test('new-map identifier fields must already be NFC',()=>{
  const p=plan({rows:[row({factId:'e\u0301',expectedOwner:'e\u0301'}),row({sourceConditionId:'body-b',factId:'body-b',factRole:'GIVEN',displayDisposition:'PRESERVED_ARCHIVE_BANK',expectedOwner:null,preservedLocationRef:bodyRef()})]});
  assert.throws(()=>verifyConstructionConditionBindings(p),/IDENTIFIER_NOT_NFC/);
});

test('present maps reject root, nested proxy, and accessor input without executing traps or getters',()=>{
  let traps=0,getters=0;
  const hostileMap=new Proxy({schemaVersion:'VISUAL_FACT_DISPLAY_MAP_v1',rows:[]},{get(){traps++;throw Error('trap ran');},ownKeys(){traps++;throw Error('trap ran');},getOwnPropertyDescriptor(){traps++;throw Error('trap ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(new Proxy({factDisplayMap:hostileMap},{get(){traps++;throw Error('trap ran');},ownKeys(){traps++;throw Error('trap ran');},getOwnPropertyDescriptor(){traps++;throw Error('trap ran');}})),/PROXY|JSON_DATA/);
  assert.equal(traps,0);

  const withGetter=plan();
  Object.defineProperty(withGetter,'factDisplayMap',{enumerable:true,configurable:true,get(){getters++;throw Error('getter ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(withGetter),/ACCESSOR|JSON_DATA/);
  const sourceGetter=plan();
  Object.defineProperty(sourceGetter,'sourceConditions',{enumerable:true,configurable:true,get(){getters++;throw Error('getter ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(sourceGetter),/ACCESSOR|JSON_DATA/);
  const mathGetter=plan();
  Object.defineProperty(mathGetter,'mathPlan',{enumerable:true,configurable:true,get(){getters++;throw Error('getter ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(mathGetter),/ACCESSOR|JSON_DATA/);
  const nodeGetter=plan();
  Object.defineProperty(nodeGetter.mathPlan.nodes[0],'id',{enumerable:true,configurable:true,get(){getters++;throw Error('getter ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(nodeGetter),/ACCESSOR|JSON_DATA/);
  assert.equal(getters,0);

  let nestedTraps=0;
  const nestedProxy=plan();
  nestedProxy.mathPlan.nodes[0]=new Proxy(nestedProxy.mathPlan.nodes[0],{get(){nestedTraps++;throw Error('nested trap ran');},ownKeys(){nestedTraps++;throw Error('nested trap ran');},getOwnPropertyDescriptor(){nestedTraps++;throw Error('nested trap ran');}});
  assert.throws(()=>verifyConstructionConditionBindings(nestedProxy),/PROXY|JSON_DATA/);
  assert.equal(nestedTraps,0);
  for(const field of ['mathPlan','sourceConditions']){
    const nested=plan();
    const proxyValue=new Proxy(nested[field],{get(){nestedTraps++;throw Error('nested trap ran');},ownKeys(){nestedTraps++;throw Error('nested trap ran');},getOwnPropertyDescriptor(){nestedTraps++;throw Error('nested trap ran');}});
    nested[field]=proxyValue;
    assert.throws(()=>verifyConstructionConditionBindings(nested),/PROXY|JSON_DATA/);
    assert.equal(nestedTraps,0);
  }
});

test('a present map without typed construction scope and non-JSON data fail explicitly',()=>{
  assert.throws(()=>verifyConstructionConditionBindings({sourceConditions:[],factDisplayMap:{schemaVersion:'VISUAL_FACT_DISPLAY_MAP_v1',rows:[]}}),/UNSUPPORTED_FACT_DISPLAY_MAP_SCOPE/);
  const cyclic=plan();cyclic.factDisplayMap.self=cyclic.factDisplayMap;
  assert.throws(()=>verifyConstructionConditionBindings(cyclic),/JSON_DATA|CYCLIC/);
  const nonFinite=plan();nonFinite.factDisplayMap.rows[0].reason=Number.NaN;
  assert.throws(()=>verifyConstructionConditionBindings(nonFinite),/JSON_DATA/);
});
