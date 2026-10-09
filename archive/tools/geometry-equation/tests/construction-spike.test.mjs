import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {stageKey} from '../production/contracts.mjs';
const int=n=>({kind:'integer',value:String(n)});
const node=(id,op,inputs,outputType,args={},branch)=>({id,op,inputs,outputType,args,factRole:inputs.length?'DERIVED_INTERMEDIATE':'GIVEN',...(branch?{branch}:{})});
export const sourceGraph={schemaVersion:'construction-spike-v1',nodes:[
  node('A','SOURCE_POINT',[],'POINT',{coordinates:[int(0),int(0)]}),
  node('B','SOURCE_POINT',[],'POINT',{coordinates:[int(6),int(0)]}),
  node('P','SOURCE_POINT',[],'POINT',{coordinates:[int(2),int(4)]}),
  node('l','LINE_THROUGH',['A','B'],'LINE'),
  node('H','PERPENDICULAR_FOOT',['P','l'],'POINT'),
  node('M','MIDPOINT',['A','B'],'POINT'),
  node('c','CIRCLE_CENTER_RADIUS',['A'],'CIRCLE',{radius:int(5)}),
  node('d','CIRCLE_CENTER_RADIUS',['B'],'CIRCLE',{radius:int(5)}),
  node('I','INTERSECTION',['c','d'],'POINT_SET'),
  node('C','SELECT_POINT',['I'],'POINT',{}, {kind:'SIDE_OF_ORIENTED_LINE',refs:['A','B'],sign:1}),
]};
export const realizationGraph={...structuredClone(sourceGraph),realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true},nodes:sourceGraph.nodes.filter(n=>!['P','l','H','M'].includes(n.id)).map(n=>n.id==='A'?node('A','NORMALIZATION_ORIGIN',[],'POINT'):n.id==='B'?node('B','NORMALIZATION_AXIS',[],'POINT',{length:int(6)}):structuredClone(n))};
async function execute(graph){return pythonWorker({action:'construction',graph});}
test('SymPy and Cindy independently reconstruct foot, midpoint, and circle branch',async()=>{
  const {status,result}=await execute(sourceGraph);assert.equal(status,'OK');
  assert.deepEqual(result.points.H.approximation,[2,0]);assert.deepEqual(result.points.M.approximation,[3,0]);
  assert.deepEqual(result.points.C.approximation,[3,4]);
  assert.equal(compareReconstruction(result,reconstruct(sourceGraph)).status,'PASS');
});
test('coordinate-free SSS recipe produces source-length-preserving realization',async()=>{
  const {result}=await execute(realizationGraph);
  assert.equal(result.coordinateMode,'CONSTRUCTED_REALIZATION');
  assert.equal(compareReconstruction(result,reconstruct(realizationGraph)).status,'PASS');
  assert.equal(Math.hypot(...result.points.C.approximation),5);
});
test('source free inputs recalculate at three values without copying derived points',async()=>{
  for(const x of [1,2,5]){
    const graph=structuredClone(sourceGraph);graph.nodes.find(n=>n.id==='P').args.coordinates[0]=int(x);
    const {result}=await execute(graph);assert.equal(result.points.H.approximation[0],x);
    assert.equal(compareReconstruction(result,reconstruct(graph)).status,'PASS');
  }
});
test('branch-only ref mutation flips root and invalidates math projection',async()=>{
  const changed=structuredClone(sourceGraph);changed.nodes.find(n=>n.id==='C').branch.refs.reverse();
  const a=(await execute(sourceGraph)).result,b=(await execute(changed)).result;
  assert.deepEqual(b.points.C.approximation,[3,-4]);
  assert.notEqual(stageKey('MATH',sourceGraph,'v1'),stageKey('MATH',changed,'v1'));
  assert.equal(compareReconstruction(a,reconstruct(changed)).status,'FAIL');
});
test('unknown refs, hidden branch cycles, derived overrides and scalar refs fail closed',async()=>{
  for(const mutate of [
    g=>g.nodes.find(n=>n.id==='C').branch.refs[0]='UNKNOWN',
    g=>g.nodes.find(n=>n.id==='C').branch.refs[0]='C',
    g=>g.nodes.find(n=>n.id==='H').at=[2,0],
    g=>g.nodes.find(n=>n.id==='c').args.radius={ref:'C'},
    g=>g.nodes.find(n=>n.id==='H').op='UNIMPLEMENTED',
  ]){const graph=structuredClone(sourceGraph);mutate(graph);assert.equal((await execute(graph)).status,'ERROR');}
});
test('producer coordinate mutation is detected by Cindy reconstruction',async()=>{
  const {result}=await execute(sourceGraph);result.points.H.approximation[1]=0.2;
  assert.equal(compareReconstruction(result,reconstruct(sourceGraph)).status,'FAIL');
});
test('node order is stable; coincident geometry and missing recipe rejected',async()=>{
  const reversed=structuredClone(sourceGraph);reversed.nodes.reverse();
  assert.deepEqual((await execute(reversed)).result,(await execute(sourceGraph)).result);
  const g=structuredClone(realizationGraph);delete g.realization;assert.equal((await execute(g)).status,'ERROR');
  const same=structuredClone(sourceGraph);same.nodes.find(n=>n.id==='d').inputs=['A'];assert.equal((await execute(same)).status,'ERROR');
});
