import test from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {objectSha,canonicalJson} from '../../pipeline-core/canonical.mjs';
import {applyConstructionParameters,recomputeConstructionParameters} from '../production/construction-parameters-v1.mjs';
import {constructionV1Graph,int,node,pointNode} from './construction-v1-fixture.mjs';

const HASH=/^sha256:[0-9a-f]{64}$/;
const rat=(numerator,denominator)=>({kind:'rational',numerator:String(numerator),denominator:String(denominator)});
const sqrtOf=value=>({kind:'expression',op:'sqrt',args:[int(value)]});
const nodeArg=(nodeId,path)=>({kind:'NODE_ARG',nodeId,path});
const expectedOf=conditionId=>({kind:'CONDITION_EXPECTED',conditionId});
const typed=value=>typeof value==='object'?value:int(value);
const slot=(id,target,min,max)=>({id,target,domain:{min:typed(min),max:typed(max)}});
const makeSpec=(slots,baseGraph=constructionV1Graph)=>({schemaVersion:'construction-parameter-spec-v1',baseGraphSha256:objectSha(baseGraph),slots});
const makeValues=(parameterSpec,values)=>({schemaVersion:'construction-parameter-values-v1',parameterSpecSha256:objectSha(parameterSpec),values});
const input=(slots,values,baseGraph=constructionV1Graph)=>{const parameterSpec=makeSpec(slots,baseGraph);return {baseGraph,parameterSpec,values:makeValues(parameterSpec,values)};};
const Px=(min=0,max=10)=>slot('Px',nodeArg('P',['coordinates',0]),min,max);
const Py=slot('Py',nodeArg('P',['coordinates',1]),0,10);
const Bx=slot('Bx',nodeArg('B',['coordinates',0]),0,10);
const Ay=slot('Ay',nodeArg('A',['coordinates',1]),0,10);
const dAB=slot('dAB',expectedOf('distance-AB-4'),0,10);
const sorted=list=>[...list].sort();
const patched=(mutate,graph=constructionV1Graph)=>{const copy=structuredClone(graph);mutate(copy);return copy;};
const deepFreeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
const engine=async graph=>{const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const outputOf=(model,id)=>canonicalJson([model.points[id]??null,model.scalars[id]??null,model.lines[id]??null,model.circles[id]??null,model.pointSets[id]??null]);

// Spy around the real SymPy worker. `tamper` is fault injection for guards that real inputs cannot reach.
function spyWorker(baseGraph=constructionV1Graph,tamper){
  const baseSha=objectSha(baseGraph),calls=[];
  const worker=async(payload,options)=>{
    const role=objectSha(payload.graph)===baseSha?'base':'derived';calls.push(role);
    const response=await pythonWorker(payload,options);
    return tamper?(tamper(role,response)??response):response;
  };
  return {worker,calls};
}
async function inputError(args,code,slotId){
  assert.throws(()=>applyConstructionParameters(args),error=>error.code===code&&error.message===code,code);
  const spy=spyWorker(args.baseGraph),result=await recomputeConstructionParameters({...args,worker:spy.worker});
  assert.equal(result.status,code);assert.deepEqual(spy.calls,[],code+': the engine must not run');
  assert.equal(result.lineage,null);assert.equal(result.impact,null);assert.equal(result.downstream,null);
  assert.equal(result.productionAuthorized,false);assert.equal(result.qualification,'NOT_RUN');
  if(slotId!==undefined)assert.equal(result.detail.slotId,slotId);
  return result;
}
// Independent re-derivation of every success result: bind the hashes to real engine snapshots and check outputs.
async function verifySuccess(args,result,graph=args.baseGraph){
  assert.equal(result.status,'RECOMPUTED',JSON.stringify(result));
  assert.equal(result.schemaVersion,'construction-parameter-recompute-v1');assert.equal(result.capability,'construction-spike-v1');
  assert.equal(result.productionAuthorized,false);assert.equal(result.qualification,'NOT_RUN');assert.deepEqual(result.peer,{status:'PASS'});
  const applied=applyConstructionParameters(args),base=await engine(args.baseGraph),derived=await engine(applied.derivedGraph);
  assert.deepEqual(result.lineage,{...applied.lineage,baseSnapshotSha256:objectSha(base),derivedSnapshotSha256:objectSha(derived),peerComparisonSha256:objectSha(compareReconstruction(derived,reconstruct(applied.derivedGraph)))});
  for(const key of Object.keys(result.lineage))assert.match(result.lineage[key],HASH,key);
  const {seedNodeIds,seedConditionIds,affectedNodeIds,affectedChanged,affectedSameValue,unaffectedNodeIds}=result.impact;
  assert.deepEqual(seedNodeIds,applied.seedNodeIds);assert.deepEqual(seedConditionIds,applied.seedConditionIds);
  assert.deepEqual(sorted([...seedNodeIds,...affectedNodeIds,...unaffectedNodeIds]),sorted(graph.nodes.map(n=>n.id)));
  assert.deepEqual(sorted([...affectedChanged,...affectedSameValue]),sorted(affectedNodeIds));
  for(const id of unaffectedNodeIds)assert.equal(outputOf(base,id),outputOf(derived,id),'unaffected '+id);
  for(const id of affectedChanged)assert.notEqual(outputOf(base,id),outputOf(derived,id),'changed '+id);
  for(const id of affectedSameValue)assert.equal(outputOf(base,id),outputOf(derived,id),'same value '+id);
  assert.ok(derived.conditionAudits.every(row=>row.status==='PASS'));
  return {applied,base,derived};
}
const INVALIDATED={layout:'INVALIDATED_NOT_RUN',svg:'INVALIDATED_NOT_RUN',render:'NOT_RUN',review:'NOT_RUN'};

const N1_AFFECTED=['mid','diameterCircle','contacts','contact','contactOther','externalTangent','externalTangentOther'];
const N1_UNAFFECTED=['A','B','C','D','O','V','X','Y','axisX','axisY','circle3','circleO','crossLine','externalBisector','internalBisector','lengthAB','lengthAC','parallel','radiusLine','ratio','tangentAtA'];

test('N1 P.x 5 to 6 recomputes exactly the dependent closure and leaves every other output byte-identical',async()=>{
  const args=input([Px()],{Px:int(6)}),result=await recomputeConstructionParameters(args);
  const {applied,base,derived}=await verifySuccess(args,result);
  assert.equal(canonicalJson(applied.derivedGraph),canonicalJson(patched(g=>{g.nodes.find(n=>n.id==='P').args.coordinates[0]=int(6);})));
  assert.deepEqual(applied.changedSlots,['Px']);assert.deepEqual(applied.unchangedSlots,[]);
  assert.deepEqual(result.impact.seedNodeIds,['P']);assert.deepEqual(result.impact.seedConditionIds,[]);
  assert.deepEqual(sorted(result.impact.affectedNodeIds),sorted(N1_AFFECTED));
  assert.deepEqual(sorted(result.impact.affectedChanged),sorted(N1_AFFECTED));assert.deepEqual(result.impact.affectedSameValue,[]);
  assert.deepEqual(sorted(result.impact.unaffectedNodeIds),sorted(N1_UNAFFECTED));
  assert.deepEqual(sorted(result.impact.recheckedConditions),sorted(['equal-external-tangent-lengths','midpoint-OP-half','external-tangent-contact','contact-positive-side','contact-other-negative-side']));
  assert.deepEqual(result.downstream,INVALIDATED);assert.equal(result.engineCode,null);
  // New tangent points: x = r^2/6 = 2/3 and y = +-sqrt(32/9) = +-4*sqrt(2)/3, derived by hand rather than copied into an audit.
  assert.deepEqual(derived.points.contact.exact,[rat(2,3),{kind:'expression',op:'mul',args:[rat(4,3),sqrtOf(2)]}]);
  assert.deepEqual(derived.points.contactOther.exact,[rat(2,3),{kind:'expression',op:'mul',args:[rat(-4,3),sqrtOf(2)]}]);
  for(const [id,sign] of [['contact',1],['contactOther',-1]])assert.ok(Math.abs(derived.points[id].approximation[1]-sign*Math.sqrt(32/9))<1e-12);
  assert.equal(derived.conditionAudits.length,11);
  assert.notEqual(canonicalJson(base.points.contact),canonicalJson(derived.points.contact));
});

test('N2 B.x 4 to 5 with its distance expectation changes ratio and circle3, and some recomputed nodes keep their value',async()=>{
  const args=input([Bx,dAB],{Bx:int(5),dAB:int(5)}),result=await recomputeConstructionParameters(args);
  const {applied,base,derived}=await verifySuccess(args,result);
  assert.equal(canonicalJson(applied.derivedGraph),canonicalJson(patched(g=>{g.nodes.find(n=>n.id==='B').args.coordinates[0]=int(5);g.conditionAudits.find(c=>c.id==='distance-AB-4').expected=int(5);})));
  assert.deepEqual(applied.changedSlots,['Bx','dAB']);assert.deepEqual(result.impact.seedNodeIds,['B']);assert.deepEqual(result.impact.seedConditionIds,['distance-AB-4']);
  assert.deepEqual(sorted(result.impact.affectedChanged),['circle3','lengthAB','ratio']);
  // axisX, parallel and crossLine are recomputed because they depend on B but SymPy returns identical exact values.
  assert.deepEqual(sorted(result.impact.affectedSameValue),['axisX','crossLine','parallel']);
  assert.deepEqual(sorted(result.impact.recheckedConditions),sorted(['incidence-B-axisX','distance-AB-4','perpendicular-coordinate-axes','parallel-through-C']));
  assert.deepEqual(base.scalars.ratio.exact,rat(4,3));assert.deepEqual(derived.scalars.ratio.exact,rat(5,3));
  assert.deepEqual(derived.circles.circle3.centerExact,[rat(5,2),rat(3,2)]);assert.notDeepEqual(base.circles.circle3.centerExact,derived.circles.circle3.centerExact);
  assert.deepEqual(result.downstream,INVALIDATED);
});

test('N3 slot values equal to the base keep the graph, every output and the downstream state unchanged',async()=>{
  // Px is given as the non-reduced rational 10/2: equal to 5 exactly, so it is unchanged and the base literal is kept.
  const args=input([Px(),Bx,dAB],{Px:rat(10,2),Bx:int(4),dAB:int(4)}),result=await recomputeConstructionParameters(args);
  const {applied,base,derived}=await verifySuccess(args,result);
  assert.deepEqual(applied.changedSlots,[]);assert.deepEqual(applied.unchangedSlots,['Px','Bx','dAB']);
  assert.deepEqual(applied.seedNodeIds,[]);assert.deepEqual(applied.seedConditionIds,[]);
  assert.equal(canonicalJson(applied.derivedGraph),canonicalJson(constructionV1Graph));
  assert.equal(result.lineage.derivedGraphSha256,result.lineage.baseGraphSha256);assert.equal(result.lineage.derivedSnapshotSha256,result.lineage.baseSnapshotSha256);
  assert.equal(canonicalJson(base),canonicalJson(derived));
  assert.deepEqual(result.impact.affectedNodeIds,[]);assert.deepEqual(result.impact.recheckedConditions,[]);
  assert.equal(result.impact.unaffectedNodeIds.length,constructionV1Graph.nodes.length);
  assert.equal(result.downstream,'NOT_INVALIDATED');
});

test('N4 identical inputs give identical results; a different value moves only the derived lineage',async()=>{
  const six=input([Px()],{Px:int(6)}),seven=input([Px()],{Px:int(7)});
  const first=await recomputeConstructionParameters(six),second=await recomputeConstructionParameters(six),other=await recomputeConstructionParameters(seven);
  assert.equal(first.status,'RECOMPUTED');assert.equal(other.status,'RECOMPUTED',JSON.stringify(other));
  assert.deepEqual(first,second);assert.equal(canonicalJson(first),canonicalJson(second));
  for(const key of ['baseGraphSha256','parameterSpecSha256','baseSnapshotSha256'])assert.equal(first.lineage[key],other.lineage[key],key);
  for(const key of ['valuesSha256','derivedGraphSha256','derivedSnapshotSha256','peerComparisonSha256'])assert.notEqual(first.lineage[key],other.lineage[key],key);
  assert.deepEqual(first.impact.seedNodeIds,other.impact.seedNodeIds);
});

test('N5 an expression literal in the base is conservatively changed even when the replacement is value-equal',async()=>{
  // sqrt(16) is not provably equal to 4 by exact rational comparison, so the slot is seeded; the expectation slot alone forces a recheck.
  const baseGraph=patched(g=>{g.conditionAudits.find(c=>c.id==='distance-AB-4').expected={kind:'expression',op:'sqrt',args:[int(16)]};});
  const args=input([dAB],{dAB:int(4)},baseGraph),result=await recomputeConstructionParameters(args);
  const {applied}=await verifySuccess(args,result);
  assert.deepEqual(applied.changedSlots,['dAB']);assert.deepEqual(applied.seedNodeIds,[]);assert.deepEqual(applied.seedConditionIds,['distance-AB-4']);
  assert.deepEqual(result.impact.affectedNodeIds,[]);assert.deepEqual(result.impact.recheckedConditions,['distance-AB-4']);
  assert.deepEqual(result.downstream,INVALIDATED);assert.equal(result.lineage.derivedSnapshotSha256,result.lineage.baseSnapshotSha256);
});

test('apply partitions changed and unchanged slots without running any engine',()=>{
  const args=input([Px(),Py,dAB],{Px:int(6),Py:int(0),dAB:int(4)}),applied=applyConstructionParameters(args);
  assert.deepEqual(applied.changedSlots,['Px']);assert.deepEqual(applied.unchangedSlots,['Py','dAB']);
  assert.deepEqual(applied.seedNodeIds,['P']);assert.deepEqual(applied.seedConditionIds,[]);
  assert.deepEqual(Object.keys(applied.lineage).sort(),['baseGraphSha256','derivedGraphSha256','parameterSpecSha256','valuesSha256']);
  assert.equal(applied.lineage.baseGraphSha256,objectSha(constructionV1Graph));assert.equal(applied.lineage.derivedGraphSha256,objectSha(applied.derivedGraph));
  assert.equal(applied.lineage.parameterSpecSha256,objectSha(args.parameterSpec));assert.equal(applied.lineage.valuesSha256,objectSha(args.values));
});

test('free targets cover the three NODE_ARG kinds and both condition expectations, and closure follows branch refs',async()=>{
  const smallGraph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true},nodes:[
    node('O','NORMALIZATION_ORIGIN',[],'POINT'),node('X','NORMALIZATION_AXIS',[],'POINT',{length:int(4)}),pointNode('S',1,0),
    node('axisLine','LINE_THROUGH',['O','X'],'LINE'),node('len','SEGMENT_LENGTH',['O','X'],'SCALAR'),
    node('circleO','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(3)}),node('circleX','CIRCLE_CENTER_RADIUS',['X'],'CIRCLE',{radius:int(3)}),
    node('Roots','INTERSECTION',['circleO','circleX'],'POINT_SET'),
    node('U','SELECT_POINT',['Roots'],'POINT',{},{kind:'SIDE_OF_ORIENTED_LINE',refs:['O','X'],sign:1}),
    node('V','SELECT_POINT',['Roots'],'POINT',{},{kind:'SIDE_OF_ORIENTED_LINE',refs:['O','X'],sign:-1}),
    node('W','SELECT_POINT',['Roots'],'POINT',{},{kind:'SIDE_OF_ORIENTED_LINE',refs:['O','S'],sign:1})
  ],conditionAudits:[
    {id:'U-on-circleX',sourceConditionId:'U-on-circleX',kind:'CIRCLE_MEMBERSHIP',refs:['circleX','U']},
    {id:'W-side',sourceConditionId:'W-side',kind:'ORIENTED_SIDE',refs:['O','S','W'],sign:1}
  ]};
  const slots=[slot('Xlen',nodeArg('X',['length']),1,10),slot('rO',nodeArg('circleO',['radius']),1,10),slot('Sy',nodeArg('S',['coordinates',1]),-5,5)];
  const run=async values=>{const args=input(slots,values,smallGraph),result=await recomputeConstructionParameters(args);const checked=await verifySuccess(args,result,smallGraph);return {result,...checked};};
  // The authority transcript, not a second parser, makes W depend on S: its only link to S is branch.refs.
  const {base}=await run({Xlen:int(4),rO:int(3),Sy:int(0)});
  assert.deepEqual(base.transcript.find(row=>row.nodeId==='W').dependencies,['O','Roots','S']);
  const length=await run({Xlen:int(5),rO:int(3),Sy:int(0)});
  assert.deepEqual(length.result.impact.seedNodeIds,['X']);assert.deepEqual(sorted(length.result.impact.affectedNodeIds),['Roots','U','V','W','axisLine','circleX','len']);
  assert.deepEqual(length.result.impact.affectedSameValue,['axisLine']);assert.deepEqual(sorted(length.result.impact.unaffectedNodeIds),['O','S','circleO']);
  assert.deepEqual(sorted(length.result.impact.recheckedConditions),['U-on-circleX','W-side']);
  const radius=await run({Xlen:int(4),rO:int(4),Sy:int(0)});
  assert.deepEqual(radius.result.impact.seedNodeIds,['circleO']);assert.deepEqual(sorted(radius.result.impact.affectedNodeIds),['Roots','U','V','W']);
  assert.deepEqual(sorted(radius.result.impact.unaffectedNodeIds),['O','S','X','axisLine','circleX','len']);
  assert.deepEqual(radius.derived.points.U.exact[0],rat(23,8));
  const branch=await run({Xlen:int(4),rO:int(3),Sy:int(1)});
  assert.deepEqual(branch.result.impact.seedNodeIds,['S']);assert.deepEqual(branch.result.impact.affectedNodeIds,['W']);assert.deepEqual(branch.result.impact.affectedSameValue,['W']);
  assert.deepEqual(branch.result.impact.recheckedConditions,['W-side']);
  // MIDPOINT_RATIO.expected is the second free condition target; apply only, no engine needed.
  const midpoint=applyConstructionParameters(input([slot('half',expectedOf('midpoint-OP-half'),0,4)],{half:int(2)}));
  assert.deepEqual(midpoint.seedConditionIds,['midpoint-OP-half']);assert.deepEqual(midpoint.seedNodeIds,[]);
  assert.deepEqual(midpoint.derivedGraph.conditionAudits.find(c=>c.id==='midpoint-OP-half').expected,int(2));
});

test('E1 derived-node, structural and non-expected targets are not free',async()=>{
  const targets=[
    nodeArg('mid',['coordinates',0]),nodeArg('mid',['inputs',0]),nodeArg('P',['inputs',0]),nodeArg('P',['op']),nodeArg('contact',['branch','sign']),
    nodeArg('P',['coordinates',2]),nodeArg('P',['coordinates']),nodeArg('circleO',['radius']),nodeArg('internalBisector',['mode']),nodeArg('Nope',['coordinates',0]),
    expectedOf('perpendicular-coordinate-axes'),expectedOf('nope')
  ];
  for(const target of targets){
    const result=await inputError(input([slot('S',target,-10,10)],{S:int(1)}),'PARAMETER_TARGET_NOT_FREE','S');
    assert.equal(result.detail.slotId,'S',canonicalJson(target));
  }
});

test('E1b spec shape errors stay distinct from non-free targets',()=>{
  const free=nodeArg('P',['coordinates',0]);
  const cases=[
    [[slot('S',free,5,1)],'INVALID_PARAMETER_DOMAIN'],
    [[{id:'S',target:free,domain:{min:{kind:'expression',op:'sqrt',args:[int(4)]},max:int(9)}}],'INVALID_PARAMETER_DOMAIN'],
    [[slot('S',free,0,10),slot('S',nodeArg('P',['coordinates',1]),0,10)],'DUPLICATE_PARAMETER_SLOT'],
    [[slot('S',free,0,10),slot('T',free,0,10)],'DUPLICATE_PARAMETER_TARGET'],
    [[{id:'S',target:free}],'INVALID_PARAMETER_SPEC'],
    [[],'INVALID_PARAMETER_SPEC']
  ];
  for(const [slots,code] of cases)assert.throws(()=>applyConstructionParameters(input(slots,{S:int(1)})),error=>error.code===code,code);
});

test('E2 an unchanged expectation makes the exact audit fail as MATH_INVALID, not UNSUPPORTED',async()=>{
  const args=input([Bx],{Bx:int(5)}),spy=spyWorker(),result=await recomputeConstructionParameters({...args,worker:spy.worker});
  assert.equal(result.status,'MATH_INVALID');assert.equal(result.engineCode,'CONDITION_AUDIT_FAIL:distance-AB-4:DISTANCE_EQUALS');
  assert.deepEqual(spy.calls,['base','derived']);assert.notEqual(result.status,'UNSUPPORTED_NUMERIC_SCOPE');
  assert.match(result.lineage.baseSnapshotSha256,HASH);assert.equal(result.lineage.derivedSnapshotSha256,null);assert.equal(result.lineage.peerComparisonSha256,null);
  assert.deepEqual(result.peer,{status:'NOT_RUN'});assert.equal(result.impact,null);assert.deepEqual(result.downstream,INVALIDATED);
  assert.equal(result.productionAuthorized,false);assert.equal(result.qualification,'NOT_RUN');
});

test('E3 degenerate parameters reach the engine degeneracy axis: A or P equal to O is MATH_INVALID with DEGENERATE_CIRCLE_RADIUS',async()=>{
  // A -> O makes circleO = CIRCLE_THROUGH_POINT(O, A) degenerate: a real engine error code.
  const circle=await recomputeConstructionParameters({...input([Ay],{Ay:int(0)})});
  assert.equal(circle.status,'MATH_INVALID');assert.equal(circle.engineCode,'DEGENERATE_CIRCLE_RADIUS');
  // P -> O makes mid = MIDPOINT(O, P) equal to P, so diameterCircle = CIRCLE_THROUGH_POINT(mid, P) is degenerate in the same way.
  // (Before M1-E the coincident midpoint was a bound method and worker.py died with an uncaught AttributeError, reported as WORKER_ERROR.)
  const midpoint=await recomputeConstructionParameters({...input([Px(),Py],{Px:int(0),Py:int(0)})});
  assert.equal(midpoint.status,'MATH_INVALID');assert.equal(midpoint.engineCode,'DEGENERATE_CIRCLE_RADIUS');
  assert.equal(midpoint.detail,null);assert.notEqual(midpoint.status,'WORKER_ERROR');assert.equal(midpoint.peer.status,'NOT_RUN');
  assert.equal(midpoint.impact,null);assert.equal(midpoint.lineage.derivedSnapshotSha256,null);
  assert.equal(midpoint.productionAuthorized,false);assert.equal(midpoint.qualification,'NOT_RUN');
});

test('E4 a point inside the circle leaves no tangent contact and reaches the branch axis',async()=>{
  const result=await recomputeConstructionParameters(input([Px()],{Px:int(1)}));
  assert.equal(result.status,'MATH_INVALID');assert.equal(result.engineCode,'AMBIGUOUS_BRANCH');
  assert.ok(!result.engineCode.startsWith('DEGENERATE_'));assert.deepEqual(result.impact,null);
});

test('E5 domain checks use exact rational comparison',async()=>{
  const outside=[int(11),int(-1),rat(21,2),rat(-1,2)];
  for(const value of outside)await inputError(input([Px(0,10)],{Px:value}),'PARAMETER_OUT_OF_RANGE','Px');
  const third=slot('Px',nodeArg('P',['coordinates',0]),0,rat(1,3));
  // A binary float cannot tell these apart, so this proves the comparison is exact BigInt arithmetic.
  assert.equal(Number('333333333333333334')/1e18,1/3);
  await inputError(input([third],{Px:rat('333333333333333334','1000000000000000000')}),'PARAMETER_OUT_OF_RANGE','Px');
  assert.doesNotThrow(()=>applyConstructionParameters(input([third],{Px:rat(2,6)})));
  assert.doesNotThrow(()=>applyConstructionParameters(input([third],{Px:rat('333333333333333333','1000000000000000000')})));
  assert.doesNotThrow(()=>applyConstructionParameters(input([Px(0,10)],{Px:int(10)})));assert.doesNotThrow(()=>applyConstructionParameters(input([Px(0,10)],{Px:int(0)})));
});

test('E6 a changed base or a changed spec is stale',async()=>{
  const ok=input([Px()],{Px:int(6)});
  const movedBase=patched(g=>{g.nodes.find(n=>n.id==='P').args.coordinates[0]=int(7);});
  await inputError({...ok,baseGraph:movedBase},'STALE_PARAMETER_BASE');
  await inputError({...ok,parameterSpec:makeSpec([Px(0,20)])},'STALE_PARAMETER_VALUES');
  await inputError({...ok,values:{...ok.values,parameterSpecSha256:'sha256:'+'0'.repeat(64)}},'STALE_PARAMETER_VALUES');
});

test('E7 missing, unknown and unsupported-kind values keep separate codes',async()=>{
  const slots=[Px(),Bx],full={Px:int(6),Bx:int(4)};
  await inputError(input(slots,{Px:int(6)}),'PARAMETER_VALUES_INCOMPLETE','Bx');
  await inputError(input(slots,{...full,Zed:int(1)}),'UNKNOWN_PARAMETER_SLOT','Zed');
  await inputError(input(slots,{...full,Px:{kind:'expression',op:'sqrt',args:[int(4)]}}),'PARAMETER_VALUE_KIND_UNSUPPORTED','Px');
  await inputError(input(slots,{...full,Bx:{kind:'constant',name:'pi'}}),'PARAMETER_VALUE_KIND_UNSUPPORTED','Bx');
  // Malformed typed scalars keep the existing validateScalar error instead of being renamed.
  for(const bad of [{kind:'integer',value:'06'},6,{kind:'rational',numerator:'1',denominator:'0'},{kind:'expression',op:'sqrt',args:[]}])await inputError(input(slots,{...full,Px:bad}),'INVALID_EXACT_SCALAR','Px');
});

test('E8 a value outside the Cindy numeric envelope is UNSUPPORTED_NUMERIC_SCOPE, distinct from MATH_INVALID and PASS',async()=>{
  const args=input([Px(0,3000000)],{Px:int(2000000)}),result=await recomputeConstructionParameters(args);
  assert.equal(result.status,'UNSUPPORTED_NUMERIC_SCOPE');assert.deepEqual(result.peer,{status:'UNSUPPORTED_NUMERIC_SCOPE',code:'UNSUPPORTED_CINDY_EXACT_INTEGER'});
  // The exact engine did accept the derived graph with every audit PASS; only the independent numeric peer could not run.
  const derived=await engine(applyConstructionParameters(args).derivedGraph);
  assert.ok(derived.conditionAudits.every(row=>row.status==='PASS'));assert.equal(result.engineCode,null);
  assert.equal(result.lineage.derivedSnapshotSha256,objectSha(derived));assert.equal(result.lineage.peerComparisonSha256,null);
  assert.throws(()=>reconstruct(applyConstructionParameters(args).derivedGraph),/^Error: UNSUPPORTED_CINDY_/);
  assert.ok(!['RECOMPUTED','MATH_INVALID','PEER_MISMATCH'].includes(result.status));assert.equal(result.impact,null);
  assert.equal(result.productionAuthorized,false);assert.equal(result.qualification,'NOT_RUN');
});

test('E9 caller objects are never mutated or aliased by apply or recompute',async()=>{
  const args=input([Px(),Bx,dAB],{Px:int(6),Bx:int(4),dAB:int(4)});
  for(const key of ['baseGraph','parameterSpec','values'])args[key]=deepFreeze(structuredClone(args[key]));
  const before=['baseGraph','parameterSpec','values'].map(key=>canonicalJson(args[key]));
  const applied=applyConstructionParameters(args);
  assert.notEqual(applied.derivedGraph.nodes.find(n=>n.id==='P').args.coordinates[0],args.values.values.Px);
  applied.derivedGraph.nodes.find(n=>n.id==='P').args.coordinates[0].value='99';applied.derivedGraph.nodes.pop();
  const result=await recomputeConstructionParameters(args);assert.equal(result.status,'RECOMPUTED');
  await inputError({...args,values:{...args.values,values:{Px:int(11),Bx:int(4),dAB:int(4)}}},'PARAMETER_OUT_OF_RANGE','Px');
  assert.deepEqual(['baseGraph','parameterSpec','values'].map(key=>canonicalJson(args[key])),before);
  assert.equal(objectSha(args.baseGraph),objectSha(constructionV1Graph));
});

// The cases below are fault injection around the real worker for guards that real inputs cannot reach.
test('X1 a derived snapshot the peer disagrees with is PEER_MISMATCH, not UNSUPPORTED and not PASS',async()=>{
  const spy=spyWorker(constructionV1Graph,(role,response)=>{if(role==='derived')response.result.points.mid.approximation[0]+=0.5;});
  const result=await recomputeConstructionParameters({...input([Px()],{Px:int(6)}),worker:spy.worker});
  assert.equal(result.status,'PEER_MISMATCH');assert.equal(result.peer.status,'FAIL');assert.ok(result.detail.failedIds.includes('mid'));
  assert.match(result.lineage.peerComparisonSha256,HASH);assert.equal(result.impact,null);
});

test('X2 an unaffected node whose output differs is reported by id',async()=>{
  const spy=spyWorker(constructionV1Graph,(role,response)=>{if(role==='derived')response.result.points.O.exact[0]=int(1);});
  const result=await recomputeConstructionParameters({...input([Px()],{Px:int(6)}),worker:spy.worker});
  assert.equal(result.status,'UNAFFECTED_NODE_CHANGED:O');assert.deepEqual(result.detail.nodeIds,['O']);assert.deepEqual(result.peer,{status:'PASS'});
  assert.notEqual(result.status,'RECOMPUTED');
});

test('X3 a changed dependency structure is rejected before any closure is trusted',async()=>{
  const spy=spyWorker(constructionV1Graph,(role,response)=>{if(role==='derived')response.result.transcript.find(row=>row.nodeId==='mid').dependencies=['P'];});
  const result=await recomputeConstructionParameters({...input([Px()],{Px:int(6)}),worker:spy.worker});
  assert.equal(result.status,'DEPENDENCY_STRUCTURE_CHANGED');assert.equal(result.impact,null);
});

test('X4 base failure, worker UNSUPPORTED and worker transport errors are separate axes',async()=>{
  const badBase=patched(g=>{g.conditionAudits.find(c=>c.id==='distance-AB-4').expected=int(5);});
  const baseSpy=spyWorker(badBase),baseResult=await recomputeConstructionParameters({...input([Px()],{Px:int(6)},badBase),worker:baseSpy.worker});
  assert.equal(baseResult.status,'BASE_CONSTRUCTION_NOT_OK');assert.equal(baseResult.engineCode,'CONDITION_AUDIT_FAIL:distance-AB-4:DISTANCE_EQUALS');assert.deepEqual(baseSpy.calls,['base']);
  const unsupported=spyWorker(constructionV1Graph,(role)=>role==='derived'?{wireVersion:'x',inputObjectSha256:'x',status:'UNSUPPORTED',result:{code:'UNSUPPORTED_WORKER_ACTION'}}:undefined);
  const unsupportedResult=await recomputeConstructionParameters({...input([Px()],{Px:int(6)}),worker:unsupported.worker});
  assert.equal(unsupportedResult.status,'WORKER_UNSUPPORTED');assert.equal(unsupportedResult.engineCode,'UNSUPPORTED_WORKER_ACTION');assert.notEqual(unsupportedResult.status,'MATH_INVALID');
  const timeout=spyWorker(constructionV1Graph,role=>{if(role==='derived')throw Error('WORKER_TIMEOUT');});
  const timeoutResult=await recomputeConstructionParameters({...input([Px()],{Px:int(6)}),worker:timeout.worker});
  assert.equal(timeoutResult.status,'WORKER_ERROR');assert.deepEqual(timeoutResult.detail,{phase:'derived',code:'WORKER_TIMEOUT'});assert.equal(timeoutResult.engineCode,null);
});

test('X5 a caller-aborted signal rejects instead of returning a result',async()=>{
  const controller=new AbortController();controller.abort();
  await assert.rejects(recomputeConstructionParameters({...input([Px()],{Px:int(6)}),signal:controller.signal}),/WORKER_CANCELLED/);
});
