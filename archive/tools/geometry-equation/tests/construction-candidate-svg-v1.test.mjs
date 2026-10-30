// Unit tests for the construction candidate SVG path. They run the real SymPy/Cindy workers and real Chrome and never call a provider.
// The typography policy is a FIXTURE built from a hand-written observation (the display-envelope.test.mjs approach).
// It is NOT an actual Archive observation: nothing here says anything about real Archive display sizes.
// Cases marked INJECTED alter a prepare/build worker response through a wrapper to reach an axis that the real inputs below do not reach.
// The static observer always runs on the real pythonWorker, so it cannot be injected; its results are compared with independent runs.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor,displayGeometryInventory} from '../production/phase2.mjs';
import {typesetter} from '../production/typography.mjs';
import {reconstruct} from '../production/cindy-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {applyConstructionParameters,recomputeConstructionParameters} from '../production/construction-parameters-v1.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {launchBrowser,playwright} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {int,node,pointNode} from './construction-v1-fixture.mjs';

const HASH=/^sha256:[0-9a-f]{64}$/;
const OBSERVER_SCRIPT=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const rect=(width,height)=>({x:20,y:30,width,height});
const FIXTURE_OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const policy=requestedProfileTypographyPolicy({requestedSizeClass:'large',intrinsicSvg:{width:384,height:320},observation:FIXTURE_OBSERVATION});
const uid=n=>'l1_unit_exam|'+n;
const idOf=(n,surface='SOLUTION_VISUAL',role='decisive-relation')=>assetIdentity(uid(n),surface,role);
const triangle=bx=>({schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',bx,0),pointNode('C',0,3),node('M','MIDPOINT',['A','B'],'POINT')]});
const planOf=mathPlan=>({capability:'construction-spike-v1',caption:'삼각형과 중점',mathPlan,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']},{id:'sCM',refs:['C','M']}],coordinateLabels:['A','B','C','M']});
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const baseGraph=triangle(4),basePlan=planOf(baseGraph);
// A REAL coordinate-free SSS realization (the snapshot's coordinateMode is CONSTRUCTED_REALIZATION): A origin, B at length 6, C on the positive side of two circles.
const sssGraph={schemaVersion:'construction-spike-v1',realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true},nodes:[
  node('A','NORMALIZATION_ORIGIN',[],'POINT'),node('B','NORMALIZATION_AXIS',[],'POINT',{length:int(6)}),
  node('c','CIRCLE_CENTER_RADIUS',['A'],'CIRCLE',{radius:int(5)}),node('d','CIRCLE_CENTER_RADIUS',['B'],'CIRCLE',{radius:int(5)}),
  node('I','INTERSECTION',['c','d'],'POINT_SET'),node('C','SELECT_POINT',['I'],'POINT',{},{kind:'SIDE_OF_ORIENTED_LINE',refs:['A','B'],sign:1})]};
const sssPlan={capability:'construction-spike-v1',caption:'SSS 삼각형',mathPlan:sssGraph,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']}],coordinateLabels:['A','B','C']};
let baseModel,sssModel,shared;
before(async()=>{baseModel=await modelOf(baseGraph);sssModel=await modelOf(sssGraph);shared=await launchBrowser();});
after(async()=>{await shared?.close();});

// Records every prepare/build call with its payload and response; `intercept[kind]` may return a replacement response (INJECTED).
// A call with a script option would be the primitive observer: the module must never route it through the injected worker.
function spy(intercept={}){
  const calls=[];
  const worker=async(payload,options)=>{
    const kind=options?.script?'observer-via-injected-worker':payload.action,entry={kind,payload};calls.push(entry);
    let response=await pythonWorker(payload,options);entry.response=response;
    const replaced=intercept[kind]?.(structuredClone(response),payload);
    if(replaced!==undefined){response=replaced;entry.injected=replaced;}
    return response;
  };
  return {worker,calls,of:kind=>calls.filter(entry=>entry.kind===kind)};
}
const compose=(overrides={})=>composeConstructionCandidate({plan:basePlan,model:baseModel,identity:idOf(1),typographyPolicy:policy,browser:shared,...overrides});
function assertNotRun(result){
  assert.equal(result.schemaVersion,'construction-candidate-svg-v1');
  assert.equal(result.typographyPolicyProvenance,'CALLER_SUPPLIED_UNVERIFIED');
  for(const key of ['sizeSelection','actualArchive','independentVisualReview'])assert.equal(result[key],'NOT_RUN',key);
  assert.equal(result.productionAuthorized,false);assert.equal(result.qualification,'NOT_RUN');
  assert.deepEqual(Object.keys(result.lineage),['planSha256','modelSha256','typographyPolicySha256','specSha256','fragmentSha256s','measurementsSha256','svgSha256','witnessSha256','staticAuditSha256','renderedLayoutSha256']);
}
// Every fragment wrapper in the final XML carries its fragment hash, and the inner <svg> bytes hash to it.
function fragmentHashesInSvg(svg){
  const found={};
  for(const match of svg.matchAll(/<g id="([^"]+)"[^>]*? data-fragment-sha="(sha256:[0-9a-f]{64})"[^>]*>(<svg [\s\S]*?<\/svg>)<\/g>/g))found[match[1]]={attribute:match[2],innerBytes:bytesSha(Buffer.from(match[3],'utf8'))};
  return found;
}
async function renderIndependently(svg,scale){
  const display={width:384*scale,height:320*scale},page=await shared.newPage({viewport:{width:Math.ceil(display.width),height:Math.ceil(display.height)}});
  try{return analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:{width:1440,height:1000}}));}finally{await page.close();}
}
// The render record the module hashes: the analysis plus the bytes it analysed.
const renderRecordSha=(svgSha256,layout)=>objectSha({svgSha256,layout});
// Independent run of the real observer on given bytes, with the runPhase2 708-713 input written out again.
async function independentAudit({plan,model,svg,coordinateModel,fragments}){
  const peer=reconstruct(plan.mathPlan),displayed=displayGeometryInventory(plan,model),pick=(ids,values)=>Object.fromEntries(Object.keys(ids).map(id=>[id,values[id]]));
  const response=await pythonWorker({svg,points:pick(displayed.points,peer.points),lines:pick(displayed.lines,peer.lines),circles:pick(displayed.circles,peer.circles),segments:plan.displaySegments||[],rightAngles:plan.rightAngles||[],transform:coordinateModel,fragments,coordinateMode:model.coordinateMode??'FUNCTION_GRAPH'},{script:OBSERVER_SCRIPT});
  assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;
}
// The 14 labels of the base triangle with the owner, role and TeX the runPhase2 622-628 rule gives them, written out literally.
const BASE_LABELS=[
  ['axis-x','axis-x','DERIVED_INTERMEDIATE','x'],['axis-y','axis-y','DERIVED_INTERMEDIATE','y'],
  ['tick-x-1-label','tick-x-1','DERIVED_INTERMEDIATE','2'],['tick-x-2-label','tick-x-2','DERIVED_INTERMEDIATE','4'],['tick-y-1-label','tick-y-1','DERIVED_INTERMEDIATE','2'],['tick-y-2-label','tick-y-2','DERIVED_INTERMEDIATE','4'],
  ['A-name','A','GIVEN','A'],['A-coordinate','A','GIVEN','(0,0)'],['B-name','B','GIVEN','B'],['B-coordinate','B','GIVEN','(4,0)'],
  ['C-name','C','GIVEN','C'],['C-coordinate','C','GIVEN','(0,3)'],['M-name','M','DERIVED_INTERMEDIATE','M'],['M-coordinate','M','DERIVED_INTERMEDIATE','(2,0)']
];
function referenceFragments(identity,fontPx=policy.baseFontPx){
  const typeset=typesetter();
  return Object.fromEntries(BASE_LABELS.map(([id,owner,factRole,tex])=>[id,typeset({id,owner,factRole,fontPx,kind:'MATH',tex},identity)]));
}

test('C1 triangle with midpoint composes; every lineage hash matches the real object or bytes, the fragments match independent typesetter calls',async()=>{
  assert.equal(policy.baseFontPx,20);assert.equal(policy.displayScale,0.5625);// fixture sanity
  const identity=idOf(1),s=spy(),result=await composeConstructionCandidate({plan:basePlan,model:baseModel,identity,typographyPolicy:policy,worker:s.worker});// module-owned Chrome
  assertNotRun(result);
  assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));assert.equal(result.detail,null);
  assert.deepEqual(result.staticAudit,{status:'PASS',errors:[]});
  assert.equal(result.renderedLayout.status,'PASS');assert.deepEqual(result.renderedLayout.display,{width:384*policy.displayScale,height:320*policy.displayScale});assert.deepEqual(result.renderedLayout.errors,[]);
  const {lineage}=result;
  for(const key of Object.keys(lineage))if(key!=='fragmentSha256s')assert.match(lineage[key],HASH,key);
  const [prepare,build]=[s.of('prepare'),s.of('build')];
  assert.deepEqual(s.calls.map(call=>call.kind),['prepare','build'],'only prepare and build go through the injectable worker');
  // inputs
  assert.equal(lineage.planSha256,objectSha(basePlan));assert.equal(lineage.modelSha256,objectSha(baseModel));assert.equal(lineage.typographyPolicySha256,objectSha(policy));
  // the spec that was prepared is the spec that was built, it is the spec specFor derives from the inputs, and its id is identity.assetId
  assert.equal(lineage.specSha256,objectSha(specFor(basePlan,baseModel,identity.assetId)));
  assert.equal(objectSha(prepare[0].payload.spec),lineage.specSha256);assert.equal(objectSha(build[0].payload.spec),lineage.specSha256);assert.equal(prepare[0].payload.spec.id,identity.assetId);
  // fragments: one per prepared label; hashes equal independent typesetter calls with the FULL identity and the literal owner/role/TeX table
  const labelIds=prepare[0].response.result.labels.map(label=>label.id),sent=build[0].payload.fragments;
  assert.deepEqual(labelIds,BASE_LABELS.map(row=>row[0]));assert.deepEqual(Object.keys(lineage.fragmentSha256s),labelIds);
  const reference=referenceFragments(identity);
  for(const [id,owner,factRole] of BASE_LABELS){
    assert.equal(lineage.fragmentSha256s[id],reference[id].fragmentSha256,id);assert.equal(sent[id].fragmentSha256,reference[id].fragmentSha256,id);
    assert.equal(sent[id].svg,reference[id].svg,id);assert.equal(sent[id].owner,owner,id);assert.equal(sent[id].factRole,factRole,id);assert.equal(sent[id].fontPx,policy.baseFontPx,id);
  }
  assert.notEqual(referenceFragments({visualAssetKey:identity.assetId})['A-name'].fragmentSha256,reference['A-name'].fragmentSha256,'the identity really is part of the fragment bytes');
  const inSvg=fragmentHashesInSvg(result.svg);assert.deepEqual(Object.keys(inSvg).sort(),[...labelIds].sort());
  for(const id of labelIds){assert.equal(inSvg[id].attribute,lineage.fragmentSha256s[id],id);assert.equal(inSvg[id].innerBytes,lineage.fragmentSha256s[id],id);}
  assert.deepEqual(Object.keys(build[0].payload.measurements),labelIds);assert.equal(lineage.measurementsSha256,objectSha(build[0].payload.measurements));
  // build output: the returned SVG is the built SVG; the witness is the built witness
  assert.equal(result.svg,build[0].response.result.svg);assert.equal(lineage.svgSha256,bytesSha(Buffer.from(result.svg,'utf8')));
  assert.equal(lineage.witnessSha256,objectSha(build[0].response.result.witness));
  assert.deepEqual(build[0].response.result.witness.layout.unresolved,[]);assert.deepEqual(build[0].response.result.witness.layout.suppressed,[]);assert.deepEqual(build[0].response.result.witness.layout.repairs,[]);
  // static audit: an independent run of the real observer on the returned bytes reproduces the hashed result, so it audited exactly these bytes
  const audit=await independentAudit({plan:basePlan,model:baseModel,svg:result.svg,coordinateModel:build[0].response.result.witness.coordinateModel,fragments:sent});
  assert.equal(audit.status,'PASS');assert.equal(audit.finalSvgSha256,lineage.svgSha256);assert.equal(lineage.staticAuditSha256,objectSha(audit));
  assert.deepEqual(audit.observations.filter(row=>row.expected).map(row=>row.id),['A','B','C','M']);assert.equal(audit.fragmentCount,14);
  // rendered layout: an independent Chrome render of the returned bytes at the same display size reproduces the hashed record, which carries the svg hash
  const independent=await renderIndependently(result.svg,policy.displayScale);
  assert.equal(independent.status,'PASS');assert.equal(renderRecordSha(lineage.svgSha256,independent),lineage.renderedLayoutSha256);
  assert.notEqual(objectSha(independent),lineage.renderedLayoutSha256,'the render record is bound to the svg bytes, not only to the analysis');
});

test('C1 determinism: the same input twice, on one external Chrome, gives byte-identical SVG and equal lineage',async()=>{
  const first=await compose({identity:idOf(7)}),second=await compose({identity:idOf(7)});
  assert.equal(first.status,'COMPOSED');assert.equal(second.status,'COMPOSED');
  assert.equal(second.lineage.svgSha256,first.lineage.svgSha256);assert.equal(second.svg,first.svg);assert.deepEqual(second.lineage,first.lineage);
  assert.equal(shared.isConnected(),true,'an externally supplied browser is never closed by the module');
});

test('C2 an M1 derived graph recomputes to a different SVG whose changed-point coordinate fragments are re-typeset and re-measured',async()=>{
  const parameterSpec={schemaVersion:'construction-parameter-spec-v1',baseGraphSha256:objectSha(baseGraph),slots:[{id:'Bx',target:{kind:'NODE_ARG',nodeId:'B',path:['coordinates',0]},domain:{min:int(0),max:int(10)}}]};
  const args={baseGraph,parameterSpec,values:{schemaVersion:'construction-parameter-values-v1',parameterSpecSha256:objectSha(parameterSpec),values:{Bx:int(6)}}};
  const {derivedGraph}=applyConstructionParameters(args),recomputed=await recomputeConstructionParameters(args);
  assert.equal(recomputed.status,'RECOMPUTED');
  const derivedModel=await modelOf(derivedGraph);
  assert.equal(objectSha(derivedModel),recomputed.lineage.derivedSnapshotSha256);
  const identity=idOf(2),derivedPlan=planOf(derivedGraph),baseSpy=spy(),derivedSpy=spy();
  const base=await compose({identity,worker:baseSpy.worker}),derived=await compose({plan:derivedPlan,model:derivedModel,identity,worker:derivedSpy.worker});
  assert.equal(base.status,'COMPOSED',JSON.stringify(base.detail));assert.equal(derived.status,'COMPOSED',JSON.stringify(derived.detail));
  assert.equal(derived.lineage.modelSha256,recomputed.lineage.derivedSnapshotSha256);
  assert.equal(derived.lineage.planSha256,objectSha(derivedPlan));assert.notEqual(derived.lineage.planSha256,base.lineage.planSha256);
  assert.notEqual(derived.lineage.svgSha256,base.lineage.svgSha256);assert.notEqual(derived.svg,base.svg);
  assert.notEqual(derived.lineage.specSha256,base.lineage.specSha256);assert.notEqual(derived.lineage.measurementsSha256,base.lineage.measurementsSha256);
  // B and M move; A and C do not. The new text is what the derived worker prepared, typeset and measured again.
  const texOf=(spyRun,id)=>spyRun.of('prepare')[0].response.result.labels.find(label=>label.id===id).tex;
  assert.deepEqual(['A','B','C','M'].map(id=>texOf(baseSpy,id+'-coordinate')),['(0,0)','(4,0)','(0,3)','(2,0)']);
  assert.deepEqual(['A','B','C','M'].map(id=>texOf(derivedSpy,id+'-coordinate')),['(0,0)','(6,0)','(0,3)','(3,0)']);
  for(const id of ['B-coordinate','M-coordinate'])assert.notEqual(derived.lineage.fragmentSha256s[id],base.lineage.fragmentSha256s[id],id);
  for(const id of ['A-coordinate','C-coordinate'])assert.equal(derived.lineage.fragmentSha256s[id],base.lineage.fragmentSha256s[id],id);
  const typeset=typesetter();
  assert.equal(derived.lineage.fragmentSha256s['B-coordinate'],typeset({id:'B-coordinate',owner:'B',factRole:'GIVEN',fontPx:20,kind:'MATH',tex:'(6,0)'},identity).fragmentSha256,'the new text, typeset again with the same identity');
  assert.equal(derived.lineage.fragmentSha256s['M-coordinate'],typeset({id:'M-coordinate',owner:'M',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'MATH',tex:'(3,0)'},identity).fragmentSha256);
  assert.ok(Array.isArray(derivedSpy.of('build')[0].payload.measurements['B-coordinate']));
  assert.equal(derivedSpy.of('build')[0].payload.fragments['B-coordinate'].fragmentSha256,derived.lineage.fragmentSha256s['B-coordinate']);
  assert.equal(fragmentHashesInSvg(derived.svg)['B-coordinate'].innerBytes,derived.lineage.fragmentSha256s['B-coordinate']);
  assert.equal(derived.staticAudit.status,'PASS');assert.equal(derived.renderedLayout.status,'PASS');
});

test('C3 the policy base font and display scale drive the fragments and the render size',async()=>{
  const custom={...policy,baseFontPx:22,displayScale:0.6};// hand-modified fixture, not an Archive observation
  const s=spy(),result=await compose({typographyPolicy:custom,identity:idOf(3),worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));
  assert.equal(result.lineage.typographyPolicySha256,objectSha(custom));
  const sent=s.of('build')[0].payload.fragments;assert.ok(Object.values(sent).every(fragment=>fragment.fontPx===22));
  assert.ok([...result.svg.matchAll(/data-font-px="([^"]+)"/g)].every(match=>match[1]==='22'));
  assert.deepEqual(result.renderedLayout.display,{width:384*0.6,height:320*0.6});
  const independent=await renderIndependently(result.svg,0.6);assert.equal(renderRecordSha(result.lineage.svgSha256,independent),result.lineage.renderedLayoutSha256);
  assert.notEqual(result.lineage.svgSha256,(await compose({identity:idOf(3)})).lineage.svgSha256);
});

test('D1 the identity is bound into the fragments: a different questionUid, surface or visualRole changes every fragment and the SVG',async()=>{
  const base=idOf(1),variants=[['questionUid',idOf(2)],['surface',idOf(1,'PROBLEM_VISUAL')],['visualRole',idOf(1,'SOLUTION_VISUAL','other-role')]];
  const first=await compose({identity:base});assert.equal(first.status,'COMPOSED');
  for(const [what,identity] of variants){
    assert.notEqual(identity.visualAssetKey,base.visualAssetKey,what);
    const s=spy(),other=await compose({identity,worker:s.worker});
    assert.equal(other.status,'COMPOSED',what+JSON.stringify(other.detail));
    const reference=referenceFragments(identity);
    for(const [id] of BASE_LABELS){assert.notEqual(other.lineage.fragmentSha256s[id],first.lineage.fragmentSha256s[id],what+' '+id);assert.equal(other.lineage.fragmentSha256s[id],reference[id].fragmentSha256,what+' '+id);}
    assert.notEqual(other.lineage.svgSha256,first.lineage.svgSha256,what);assert.notEqual(other.lineage.witnessSha256,first.lineage.witnessSha256,what);
    assert.equal(s.of('prepare')[0].payload.spec.id,identity.assetId,what);assert.notEqual(other.lineage.specSha256,first.lineage.specSha256,what);
    // the geometry itself is the same: plan, model, policy and every measured fragment size
    for(const key of ['planSha256','modelSha256','typographyPolicySha256','measurementsSha256'])assert.equal(other.lineage[key],first.lineage[key],what+' '+key);
  }
});

test('D1b a tampered, partial or missing identity is FRAGMENT_IDENTITY_INVALID before any worker call or Chrome',async()=>{
  const good=idOf(1),other=idOf(2);
  const bad=[
    ['missing',undefined],['null',null],['string','l1_unit_exam|1'],['array',[good]],
    ['tampered visualAssetKey',{...good,visualAssetKey:other.visualAssetKey}],['tampered assetId',{...good,assetId:other.assetId}],
    ['questionUid changed, derived fields kept',{...good,questionUid:uid(2)}],['extra field',{...good,extra:1}],
    ['derived fields missing',{questionUid:good.questionUid,surface:good.surface,visualRole:good.visualRole}],['visualAssetKey undefined',{...good,visualAssetKey:undefined}],
    ['unknown surface',{...good,surface:'OTHER_VISUAL'}],['bad visualRole',{...good,visualRole:'Bad Role'}],['questionUid without ordinal',{...good,questionUid:'no-ordinal'}],
    ['assetId only (the v1 argument)',{assetId:good.assetId}]
  ];
  for(const [name,identity] of bad){
    const s=spy(),result=await compose({identity,worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'FRAGMENT_IDENTITY_INVALID',name);assert.equal(typeof result.detail.reason,'string',name);assert.equal(s.calls.length,0,name);
    assert.equal(result.svg,null,name);assert.match(result.lineage.planSha256,HASH,name);assert.match(result.lineage.typographyPolicySha256,HASH,name);
    for(const key of ['modelSha256','specSha256','fragmentSha256s','measurementsSha256','svgSha256'])assert.equal(result.lineage[key],null,name+' '+key);
  }
  // the v1 call shape (assetId, no identity) is refused too
  const v1=await composeConstructionCandidate({plan:basePlan,model:baseModel,assetId:good.assetId,typographyPolicy:policy,browser:shared});
  assert.equal(v1.status,'FRAGMENT_IDENTITY_INVALID');assert.equal(v1.detail.reason,'MISSING');
});

test('E1 a model that belongs to another plan is refused before any worker call',async()=>{
  const otherModel=await modelOf(triangle(5));
  const noMidpoint=await modelOf({schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',4,0),pointNode('C',0,3)]});
  for(const [name,model,check] of [['same ids, different coordinates',otherModel,detail=>assert.ok(detail.failedIds.includes('B'))],['different point set',noMidpoint,detail=>assert.deepEqual(detail.errors,['POINT_COVERAGE_MISMATCH'])]]){
    const s=spy(),result=await compose({model,worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'MODEL_PLAN_MISMATCH',name);check(result.detail);assert.equal(s.calls.length,0,name);
    assert.equal(result.svg,null);assert.equal(result.lineage.modelSha256,objectSha(model));assert.equal(result.lineage.specSha256,null);
  }
  // the M1 derived plan drawn from the base snapshot is the realistic forgery
  const s=spy(),result=await compose({plan:planOf(triangle(6)),worker:s.worker});
  assert.equal(result.status,'MODEL_PLAN_MISMATCH');assert.equal(s.calls.length,0);
});

test('E1b the Cindy numeric envelope is reported as UNSUPPORTED_NUMERIC_SCOPE, not as a mismatch',async()=>{
  const wide=triangle(2000000),model=await modelOf(wide),s=spy(),result=await compose({plan:planOf(wide),model,worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'UNSUPPORTED_NUMERIC_SCOPE');assert.match(result.detail.code,/^UNSUPPORTED_CINDY_/);assert.equal(s.calls.length,0);
});

test('E1c a CINDY_ domain error of the peer is MODEL_PLAN_MISMATCH; any other exception is a defect and propagates',async()=>{
  // REAL: the model was computed for distance 4, the plan now claims 5; the Cindy peer refuses its own condition audit.
  const audited=expected=>({...baseGraph,conditionAudits:[{id:'ab',sourceConditionId:'ab',kind:'DISTANCE_EQUALS',refs:['A','B'],expected:int(expected)}]});
  const model=await modelOf(audited(4)),s=spy(),result=await compose({plan:planOf(audited(5)),model,worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'MODEL_PLAN_MISMATCH');assert.equal(result.detail.code,'CINDY_CONDITION_AUDIT_FAIL:ab:DISTANCE_EQUALS');assert.equal(s.calls.length,0);
  // programmer defects are not hidden behind a domain status
  await assert.rejects(compose({model:null,worker:s.worker}),TypeError);
  await assert.rejects(compose({plan:{...basePlan,mathPlan:{...baseGraph,nodes:'not an array'}},worker:s.worker}),TypeError);
  assert.equal(s.calls.length,0);
});

test('E2 an invalid typography policy is refused before any worker call',async()=>{
  const bad=[
    ['schema mismatch',{...policy,schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v0'}],
    ['missing',undefined],['null',null],
    ['NaN base font',{...policy,baseFontPx:NaN}],['Infinity scale',{...policy,displayScale:Infinity}],['string floor',{...policy,fontFloorCssPx:'11'}],['missing floor',{...policy,fontFloorCssPx:undefined}],
    ['font below floor (20 x 0.5 = 10 < 11)',{...policy,displayScale:0.5}],
    ['floor below 11',{...policy,fontFloorCssPx:10}],['non-positive scale',{...policy,displayScale:0}],
    ['base font below 11 even though the product reaches the floor',{...policy,baseFontPx:6,displayScale:2}]
  ];
  for(const [name,typographyPolicy] of bad){
    const s=spy(),result=await compose({typographyPolicy,worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'TYPOGRAPHY_POLICY_INVALID',name);assert.equal(typeof result.detail.reason,'string',name);assert.equal(s.calls.length,0,name);
    assert.equal(result.lineage.typographyPolicySha256,null,name);
  }
});

test('E6r REAL input, Chrome 1/64px layout snap dependent (environment dependent): a policy whose font product sits exactly on the floor fails the real render',async()=>{
  // ENVIRONMENT DEPENDENT: this relies on Blink laying the 211.2px wide SVG out on a 1/64px grid (211.1875px) at browser scale factor 1.
  // A Chrome update or another scale factor can flip it; then re-derive the input, do not loosen the assertion.
  // The deterministic proof that the RENDERED_LAYOUT_FAIL axis is reached is the INJECTED E6 below.
  // 20 x 0.55 === 11, so the policy check accepts it; the real policy builder targets the floor plus 0.25px, so a real policy never sits here.
  const edge={...policy,displayScale:0.55};assert.equal(edge.baseFontPx*edge.displayScale,edge.fontFloorCssPx);
  const s=spy(),result=await compose({typographyPolicy:edge,identity:idOf(4),worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'RENDERED_LAYOUT_FAIL',JSON.stringify(result.detail));
  assert.equal(result.staticAudit.status,'PASS');assert.equal(result.renderedLayout.status,'FAIL');
  const labelIds=s.of('prepare')[0].response.result.labels.map(label=>label.id);
  assert.deepEqual([...result.renderedLayout.errors].sort(),labelIds.map(id=>'PUBLICATION_FONT_BELOW_11_CSS_PX:'+id).sort());assert.deepEqual(result.detail.errors,result.renderedLayout.errors);// every label fails, reported in DOM order
  assert.equal(result.svg,null);assert.match(result.lineage.svgSha256,HASH);assert.match(result.lineage.renderedLayoutSha256,HASH);
  const independent=await renderIndependently(s.of('build')[0].response.result.svg,edge.displayScale);
  assert.equal(renderRecordSha(result.lineage.svgSha256,independent),result.lineage.renderedLayoutSha256);
  const sizes=independent.labelMeasurements.map(label=>label.finalViewportCssFontPx);assert.ok(sizes.every(size=>size<11&&size>10.99),JSON.stringify(sizes));
  // a hair more scale is enough to compose, so the failure is the font floor and nothing else
  assert.equal((await compose({typographyPolicy:{...policy,displayScale:0.56},identity:idOf(4)})).status,'COMPOSED');
});

test('E3 a graph plan outside the supported quadratic route, and a construction plan without a usable mathPlan, are UNSUPPORTED_CAPABILITY',async()=>{
  // The polynomial and function-family graph capabilities are supported (graph route); an unknown graph capability is not.
  const graphPlan={capability:'conic-spike-v1',caption:'x',graphPlan:{family:'polynomial',coefficients:['0','0','1'],domain:[-3,3],viewport:[-4,4,-2,10]}};
  for(const [name,plan] of [['unsupported graph capability',graphPlan],['construction capability without mathPlan',{capability:'construction-spike-v1',caption:'x'}],['construction capability plus graphPlan',{...basePlan,graphPlan:graphPlan.graphPlan}],['wrong mathPlan schema',{...basePlan,mathPlan:{...baseGraph,schemaVersion:'other'}}],['no plan',undefined]]){
    const s=spy(),result=await compose({plan,worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'UNSUPPORTED_CAPABILITY',name);assert.equal(s.calls.length,0,name);assert.equal(result.lineage.planSha256,null,name);
  }
});

test('E4a INJECTED build witness with unresolved or suppressed labels is LAYOUT_INVENTORY_INCOMPLETE',async()=>{
  for(const field of ['unresolved','suppressed']){
    const s=spy({build:response=>{response.result.witness.layout[field]=[{id:'INJECTED-'+field}];return response;}}),result=await compose({worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'LAYOUT_INVENTORY_INCOMPLETE',field);assert.deepEqual(result.detail[field],[{id:'INJECTED-'+field}]);
    assert.equal(result.staticAudit.status,'NOT_RUN');assert.equal(result.renderedLayout.status,'NOT_RUN');
    assert.equal(result.svg,null);assert.match(result.lineage.svgSha256,HASH);assert.match(result.lineage.witnessSha256,HASH);assert.equal(result.lineage.staticAuditSha256,null);assert.equal(result.lineage.renderedLayoutSha256,null);
  }
});

// (E20: a tick label that has no centred box now slides along its axis; at this font the x=1 tick label is placed that way and the crowded M coordinate label is the one left over.)
test('E4r REAL input: the medium-class fixture policy (24.9px base font) leaves a label unresolved and the path stops at the layout',async()=>{
  const medium=requestedProfileTypographyPolicy({requestedSizeClass:'medium',intrinsicSvg:{width:384,height:320},observation:FIXTURE_OBSERVATION});
  assert.equal(medium.baseFontPx,24.9);
  const s=spy(),result=await compose({typographyPolicy:medium,identity:idOf(5),worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'LAYOUT_INVENTORY_INCOMPLETE');assert.deepEqual(result.detail,{unresolved:['M-coordinate'],suppressed:[]});
  assert.deepEqual(s.of('build')[0].response.result.witness.layout.unresolved,['M-coordinate'],'the worker itself reported it, nothing was injected');
  assert.equal(result.staticAudit.status,'NOT_RUN');assert.equal(result.renderedLayout.status,'NOT_RUN');assert.equal(result.svg,null);assert.equal(result.lineage.staticAuditSha256,null);
});

test('E4b INJECTED build witness with a layout repair is LAYOUT_REPAIR_NOT_BOUND and never silently accepted',async()=>{
  const repair={labelId:'A-name',labelKind:'POINT_NAME',ownerId:'A'};
  const s=spy({build:response=>{response.result.witness.layout.repairs=[repair];return response;}}),result=await compose({worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'LAYOUT_REPAIR_NOT_BOUND');assert.deepEqual(result.detail.repairs,[repair]);
  assert.equal(result.staticAudit.status,'NOT_RUN');assert.equal(result.renderedLayout.status,'NOT_RUN');assert.equal(result.svg,null);assert.equal(result.lineage.staticAuditSha256,null);
});

test('E4c INJECTED layout repair with a repairContext that is not the composed Archive-measured policy is LAYOUT_REPAIR_CONTEXT_INVALID',async()=>{
  const repair={labelId:'A-name',labelKind:'POINT_NAME',ownerId:'A'},inject={build:response=>{response.result.witness.layout.repairs=[repair];return response;}};
  const sourceRef={path:'archive/exams/x.js',bytes:1,sha256:'sha256:'+'0'.repeat(64)},archiveRow={path:'.tmp/archive/x.json',bytes:1,sha256:'sha256:'+'1'.repeat(64)};
  const measured=p=>({status:'MEASURED',provenance:'ARCHIVE_MEASURED',policy:p,policySha256:objectSha(p),evidence:{archiveRow}});
  const other={...policy,baseFontPx:policy.baseFontPx+1};
  for(const [label,measuredPolicy,reason] of [['caller supplied',{...measured(policy),provenance:'CALLER_SUPPLIED'},'NOT_ARCHIVE_MEASURED'],['another policy',measured(other),'POLICY_NOT_THE_COMPOSED_POLICY'],['no source ref',measured(policy),'REFS_MISSING']]){
    const result=await compose({worker:spy(inject).worker,repairContext:{measuredPolicy,sourceRef:reason==='REFS_MISSING'?null:sourceRef}});
    assertNotRun(result);assert.equal(result.status,'LAYOUT_REPAIR_CONTEXT_INVALID',label);assert.equal(result.detail.reason,reason,label);
    assert.equal(result.svg,null);assert.deepEqual(result.layoutRepairs,[]);assert.equal(result.lineage.staticAuditSha256,null);
  }
});

test('E5 INJECTED point coordinate tamper in the build SVG is caught by the real static observer, which stops before the render',async()=>{
  let tampered;
  const s=spy({build:response=>{
    const svg=response.result.svg;tampered=svg.replace(/(<circle id="A"[^>]*? cx=")([^"]+)(")/,(match,head,value,tail)=>head+(Number(value)+10)+tail);
    assert.notEqual(tampered,svg);response.result.svg=tampered;return response;
  }}),result=await compose({worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'STATIC_PRIMITIVE_AUDIT_FAIL');
  assert.equal(result.staticAudit.status,'FAIL');assert.ok(result.staticAudit.errors.includes('POINT_COORDINATE_MISMATCH:A'),JSON.stringify(result.staticAudit.errors));assert.deepEqual(result.detail.errors,result.staticAudit.errors);
  assert.equal(result.renderedLayout.status,'NOT_RUN');assert.equal(result.svg,null);
  assert.equal(result.lineage.svgSha256,bytesSha(Buffer.from(tampered,'utf8')),'lineage binds the bytes the observer saw');assert.equal(result.lineage.renderedLayoutSha256,null);
  const build=s.of('build')[0],independent=await independentAudit({plan:basePlan,model:baseModel,svg:tampered,coordinateModel:build.response.result.witness.coordinateModel,fragments:build.payload.fragments});
  assert.equal(independent.finalSvgSha256,result.lineage.svgSha256);assert.deepEqual(independent.errors,result.staticAudit.errors);assert.equal(result.lineage.staticAuditSha256,objectSha(independent));
  assert.deepEqual(s.calls.map(call=>call.kind),['prepare','build'],'the observer never went through the injected worker');
});

test('E5b the observer cannot be replaced by the injected worker: a worker that would fake or refuse every observer call is never asked',async()=>{
  const asked=[],worker=async(payload,options)=>{if(options?.script){asked.push(options.script);throw Error('OBSERVER_VIA_INJECTED_WORKER');}return pythonWorker(payload,options);};
  const clean=await compose({worker});assert.equal(clean.status,'COMPOSED',JSON.stringify(clean.detail));assert.deepEqual(asked,[]);
  const tamperedWorker=async(payload,options)=>{
    if(options?.script){asked.push(options.script);return {wireVersion:'APMATH_VISUAL_WIRE_v1',status:'OK',result:{status:'PASS',errors:[],finalSvgSha256:'sha256:'+'0'.repeat(64)}};}
    const response=await pythonWorker(payload,options);
    if(payload.action==='build')response.result.svg=response.result.svg.replace(/(<circle id="A"[^>]*? cx=")([^"]+)(")/,(match,head,value,tail)=>head+(Number(value)+10)+tail);
    return response;
  };
  const faked=await compose({worker:tamperedWorker});
  assert.equal(faked.status,'STATIC_PRIMITIVE_AUDIT_FAIL','a faked PASS from the injected worker does not help a tampered SVG');assert.deepEqual(asked,[]);
});

test('E6 INJECTED label wrappers moved in the build SVG pass the static audit but fail the real rendered layout analysis',async()=>{
  const move=edit=>spy({build:response=>{
    const svg=response.result.svg,edited=edit(svg);assert.notEqual(edited,svg);response.result.svg=edited;return response;
  }});
  const transformOf=(svg,id)=>svg.match(new RegExp('<g id="'+id+'"[^>]*? transform="([^"]+)"'))[1];
  // B-name is placed on top of A-name
  const overlap=move(svg=>svg.replace(transformOf(svg,'B-name'),transformOf(svg,'A-name'))),overlapped=await compose({worker:overlap.worker});
  assertNotRun(overlapped);assert.equal(overlapped.status,'RENDERED_LAYOUT_FAIL');assert.equal(overlapped.staticAudit.status,'PASS','the audit has no label placement check, so the render is what catches this');
  assert.ok(overlapped.renderedLayout.errors.some(error=>error.startsWith('LABEL_OVERLAP:')&&error.includes('A-name')&&error.includes('B-name')),JSON.stringify(overlapped.renderedLayout.errors));
  assert.equal(overlapped.renderedLayout.status,'FAIL');assert.deepEqual(overlapped.detail.errors,overlapped.renderedLayout.errors);assert.equal(overlapped.svg,null);
  const overlapSvg=overlap.of('build')[0].injected.result.svg;assert.equal(overlapped.lineage.svgSha256,bytesSha(Buffer.from(overlapSvg,'utf8')));
  assert.equal(overlapped.lineage.renderedLayoutSha256,renderRecordSha(overlapped.lineage.svgSha256,await renderIndependently(overlapSvg,policy.displayScale)),'the failed render record is bound to the failed bytes');
  // B-name is moved outside the canvas
  const away=move(svg=>svg.replace(transformOf(svg,'B-name'),'translate(1000 1000)')),clipped=await compose({worker:away.worker});
  assert.equal(clipped.status,'RENDERED_LAYOUT_FAIL');assert.equal(clipped.staticAudit.status,'PASS');assert.ok(clipped.renderedLayout.errors.includes('TEXT_CLIPPED:B-name'),JSON.stringify(clipped.renderedLayout.errors));
});

test('E7 INJECTED prepare and build worker failures are WORKER_ERROR with the stage and the original code',async()=>{
  for(const kind of ['prepare','build']){
    const s=spy({[kind]:response=>({...response,status:'ERROR',result:{code:'INJECTED_'+kind}})}),result=await compose({worker:s.worker});
    assertNotRun(result);assert.equal(result.status,'WORKER_ERROR',kind);assert.deepEqual(result.detail,{stage:kind,workerStatus:'ERROR',code:'INJECTED_'+kind},kind);assert.equal(result.svg,null);
  }
  const unsupported=await compose({worker:spy({build:response=>({...response,status:'UNSUPPORTED',result:{code:'UNSUPPORTED_WORKER_ACTION'}})}).worker});
  assert.deepEqual(unsupported.detail,{stage:'build',workerStatus:'UNSUPPORTED',code:'UNSUPPORTED_WORKER_ACTION'});
  // transport failure (a spawn, timeout or output-limit rejection) is not an exception for the caller
  const transport=await compose({worker:async(payload,options)=>{if(payload.action==='build')throw Error('WORKER_TIMEOUT');return pythonWorker(payload,options);}});
  assert.equal(transport.status,'WORKER_ERROR');assert.deepEqual(transport.detail,{stage:'build',code:'WORKER_TIMEOUT'});
  assert.match(transport.lineage.measurementsSha256,HASH,'earlier lineage survives a later stage failure');assert.equal(transport.lineage.svgSha256,null);assert.deepEqual(Object.keys(transport.lineage.fragmentSha256s).length,14);
  assert.equal((await compose({worker:async()=>{throw Error('WORKER_EXIT:1:boom');}})).detail.stage,'prepare');
});

test('E7b INJECTED unparsable build SVG makes the REAL observer answer ERROR, which is WORKER_ERROR at the staticAudit stage',async()=>{
  const s=spy({build:response=>{response.result.svg=response.result.svg.replace('</svg>','');return response;}}),result=await compose({worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'WORKER_ERROR');assert.equal(result.detail.stage,'staticAudit');assert.equal(result.detail.workerStatus,'ERROR');assert.equal(typeof result.detail.code,'string');
  assert.equal(result.staticAudit.status,'NOT_RUN');assert.equal(result.renderedLayout.status,'NOT_RUN');assert.equal(result.svg,null);assert.match(result.lineage.svgSha256,HASH);assert.equal(result.lineage.staticAuditSha256,null);
});

test('E7r REAL worker error: a snapshot whose derived exact coordinate disagrees with its position is refused by the real prepare worker',async()=>{
  // compareReconstruction binds approximations, so the forged exact value passes the model-plan binding; the engine's own parity check refuses it.
  const forged=structuredClone(baseModel);forged.points.M.exact=[int(7),int(0)];
  const s=spy(),result=await compose({model:forged,identity:idOf(6),worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'WORKER_ERROR');assert.deepEqual(result.detail,{stage:'prepare',workerStatus:'ERROR',code:'DISPLAY_COORDINATE_PARITY_FAIL'});
  assert.equal(s.of('prepare')[0].injected,undefined,'nothing was injected');assert.equal(s.of('build').length,0);
  assert.equal(result.lineage.modelSha256,objectSha(forged));assert.match(result.lineage.specSha256,HASH);assert.equal(result.lineage.fragmentSha256s,null);
});

test('E8 INJECTED prepare labels reach the multiline, typeset and measurement refusals',async()=>{
  const inject=label=>spy({prepare:response=>{response.result.labels.push(label);return response;}});
  const box=await compose({worker:inject({id:'box',kind:'CONDITION_BOX',text:'a\nb',at:[10,10]}).worker});
  assert.equal(box.status,'UNSUPPORTED_MULTILINE_LABEL');assert.deepEqual(box.detail,{labelId:'box'});assert.equal(box.lineage.fragmentSha256s,null);assert.equal(box.lineage.specSha256.length,71);
  const tex=await compose({worker:inject({id:'bad-tex',kind:'POINT_NAME',target:'A',text:'x',tex:'\\href{u}{x}',math:true,at:[10,10]}).worker});
  assert.equal(tex.status,'FRAGMENT_TYPESET_ERROR');assert.deepEqual(tex.detail,{labelId:'bad-tex',code:'UNSUPPORTED_TEX'});
  // an empty TeX label typesets to a zero-width fragment, which Chrome measures as zero
  const empty=await compose({worker:inject({id:'empty',kind:'POINT_NAME',target:'A',text:'',math:true,at:[10,10]}).worker});
  assert.equal(empty.status,'FRAGMENT_BROWSER_MEASUREMENT_MISSING');assert.deepEqual(empty.detail,{labelId:'empty'});assert.equal(empty.lineage.measurementsSha256,null);assert.match(empty.lineage.fragmentSha256s.empty,HASH);
});

test('E8b INJECTED extra labels pin the fragment rule: numeric tick is MATH, other text is TEXT, owner is target or id, role comes from the target node',async()=>{
  const identity=idOf(8),extra=[
    {id:'inj-num',kind:'GRAPH_ANNOTATION',text:'−12',at:[10,10]},// numeric, not flagged math: must be typeset as MATH with a hyphen-minus
    {id:'inj-txt',kind:'EQUATION_LABEL',text:'가나',at:[20,20]},// Korean text: TEXT outlines
    {id:'inj-owned',kind:'POINT_NAME',target:'B',text:'B',at:[30,30]},// owner B, role of node B (GIVEN)
    {id:'inj-derived',kind:'POINT_NAME',target:'M',text:'M',at:[40,40]}// owner M, role of node M (DERIVED_INTERMEDIATE)
  ];
  const s=spy({prepare:response=>{response.result.labels.push(...extra);return response;}}),result=await compose({identity,worker:s.worker});
  // the engine rebuilds its own labels, so build refuses the extra inventory; the fragments were already typeset
  assert.equal(result.status,'WORKER_ERROR');assert.deepEqual(result.detail,{stage:'build',workerStatus:'ERROR',code:'FROZEN_FRAGMENT_INVENTORY_MISMATCH'});
  const typeset=typesetter(),expected={
    'inj-num':typeset({id:'inj-num',owner:'inj-num',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'MATH',tex:'-12'},identity),
    'inj-txt':typeset({id:'inj-txt',owner:'inj-txt',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'TEXT',text:'가나'},identity),
    'inj-owned':typeset({id:'inj-owned',owner:'B',factRole:'GIVEN',fontPx:20,kind:'MATH',tex:'B'},identity),
    'inj-derived':typeset({id:'inj-derived',owner:'M',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'MATH',tex:'M'},identity)
  };
  for(const [id,fragment] of Object.entries(expected)){assert.equal(result.lineage.fragmentSha256s[id],fragment.fragmentSha256,id);assert.equal(s.of('build')[0].payload.fragments[id].svg,fragment.svg,id);}
  assert.notEqual(expected['inj-num'].fragmentSha256,typeset({id:'inj-num',owner:'inj-num',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'TEXT',text:'-12'},identity).fragmentSha256,'MATH and TEXT really differ for the numeric tick');
  assert.notEqual(expected['inj-owned'].fragmentSha256,typeset({id:'inj-owned',owner:'B',factRole:'DERIVED_INTERMEDIATE',fontPx:20,kind:'MATH',tex:'B'},identity).fragmentSha256,'the role is part of the bytes');
});

test('E9 real inputs the path itself refuses: an annotation point that is not displayed',async()=>{
  const s=spy(),hidden=await compose({plan:{...basePlan,coordinateLabels:['A','Z']},worker:s.worker});
  assertNotRun(hidden);assert.equal(hidden.status,'SPEC_ERROR');assert.match(hidden.detail.code,/DISPLAY_ANNOTATION_POINT_NOT_VISIBLE:Z/);assert.equal(s.calls.length,0);
  // a defect inside specFor (a null display segment) is not a domain error and propagates
  await assert.rejects(compose({plan:{...basePlan,displaySegments:[null]},worker:s.worker}),TypeError);assert.equal(s.calls.length,0);
});

// A richer REAL plan: a displayed line, a right-angle mark, segments and coordinate labels.
const richGraph={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',4,0),pointNode('C',0,3),node('M','MIDPOINT',['A','B'],'POINT'),node('lineBC','LINE_THROUGH',['B','C'],'LINE')]};
const richPlan={capability:'construction-spike-v1',caption:'직각삼각형과 직선',mathPlan:richGraph,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sCA',refs:['C','A']}],displayLines:['lineBC'],rightAngles:[{id:'raA',refs:['B','A','C']}],coordinateLabels:['A','B','C']};

test('C4 a plan with a displayed line and a right-angle mark composes; lines and rightAngles reach the real observer',async()=>{
  const model=await modelOf(richGraph),s=spy(),result=await compose({plan:richPlan,model,identity:idOf(9),worker:s.worker});
  assertNotRun(result);assert.equal(result.status,'COMPOSED',JSON.stringify(result.detail));
  const build=s.of('build')[0],audit=await independentAudit({plan:richPlan,model,svg:result.svg,coordinateModel:build.response.result.witness.coordinateModel,fragments:build.payload.fragments});
  assert.equal(audit.status,'PASS');assert.equal(result.lineage.staticAuditSha256,objectSha(audit));
  const ids=audit.observations.map(row=>row.id);assert.ok(ids.includes('lineBC'),'the displayed line is audited');assert.ok(ids.includes('raA'),'the right-angle mark is audited');assert.ok(ids.includes('sAB'));
  const tamper=async(name,edit,expectedError)=>{
    const t=spy({build:response=>{const svg=response.result.svg,edited=edit(svg);assert.notEqual(edited,svg,name);response.result.svg=edited;return response;}}),broken=await compose({plan:richPlan,model,identity:idOf(9),worker:t.worker});
    assert.equal(broken.status,'STATIC_PRIMITIVE_AUDIT_FAIL',name);assert.ok(broken.staticAudit.errors.includes(expectedError),name+JSON.stringify(broken.staticAudit.errors));
    const tb=t.of('build')[0],again=await independentAudit({plan:richPlan,model,svg:tb.injected.result.svg,coordinateModel:tb.response.result.witness.coordinateModel,fragments:tb.payload.fragments});
    assert.deepEqual(broken.staticAudit.errors,again.errors,name);assert.equal(broken.lineage.staticAuditSha256,objectSha(again),name);
  };
  await tamper('right-angle mark removed',svg=>svg.replace(/<polyline[^>]*id="raA"[^>]*\/>/,''),'RIGHT_ANGLE_MARK_MISSING:raA');
  await tamper('line endpoint moved',svg=>svg.replace(/(<line id="lineBC"[^>]*? x1=")([^"]+)(")/,(match,head,value,tail)=>head+(Number(value)+25)+tail),'LINE_EQUATION_MISMATCH:lineBC');
});

test('E10 INJECTED uneven coordinate model: the observer receives the built transform and the model coordinateMode',async()=>{
  const uneven=spy({build:response=>{const model=response.result.witness.coordinateModel;response.result.witness.coordinateModel={...model,sy:model.sx*1.5};return response;}});
  const result=await compose({identity:idOf(10),worker:uneven.worker}),build=uneven.of('build')[0];
  assertNotRun(result);assert.equal(result.status,'STATIC_PRIMITIVE_AUDIT_FAIL');assert.equal(baseModel.coordinateMode,'SOURCE_COORDINATES');
  const independent=await independentAudit({plan:basePlan,model:baseModel,svg:build.response.result.svg,coordinateModel:build.injected.result.witness.coordinateModel,fragments:build.payload.fragments});
  assert.equal(independent.status,'FAIL');assert.deepEqual(result.staticAudit.errors,independent.errors);assert.equal(result.lineage.staticAuditSha256,objectSha(independent));
  assert.ok(result.staticAudit.errors.some(error=>error.startsWith('POINT_COORDINATE_MISMATCH:')),'the injected transform, not the true one, reached the observer');
  assert.ok(!result.staticAudit.errors.includes('UNEQUAL_GEOMETRY_UNITS'),'a SOURCE_COORDINATES model is not held to equal units');
  // the same transform with a constructed-realization snapshot is held to equal units (REAL mode; see the SSS plan below)
  const constructed=await compose({plan:sssPlan,model:sssModel,identity:idOf(11),worker:spy({build:response=>{const model=response.result.witness.coordinateModel;response.result.witness.coordinateModel={...model,sy:model.sx*1.5};return response;}}).worker});
  assert.equal(sssModel.coordinateMode,'CONSTRUCTED_REALIZATION');assert.equal(constructed.status,'STATIC_PRIMITIVE_AUDIT_FAIL',JSON.stringify(constructed.detail));
  assert.ok(constructed.staticAudit.errors.includes('UNEQUAL_GEOMETRY_UNITS'),JSON.stringify(constructed.staticAudit.errors));
});

test('the module closes only a browser it opened itself, and opens none when nothing needs one',async()=>{
  const chromium=playwright().chromium,realLaunch=chromium.launch.bind(chromium),opened=[];
  chromium.launch=async(...args)=>{const instance=await realLaunch(...args);opened.push(instance);return instance;};
  try{
    const identity=idOf(12),early=await composeConstructionCandidate({plan:basePlan,model:baseModel,identity,typographyPolicy:{...policy,displayScale:0.5}});
    assert.equal(early.status,'TYPOGRAPHY_POLICY_INVALID');assert.equal(opened.length,0,'no Chrome is started for an input error');
    const badIdentity=await composeConstructionCandidate({plan:basePlan,model:baseModel,identity:{...identity,assetId:'x'},typographyPolicy:policy});
    assert.equal(badIdentity.status,'FRAGMENT_IDENTITY_INVALID');assert.equal(opened.length,0);
    const composed=await composeConstructionCandidate({plan:basePlan,model:baseModel,identity,typographyPolicy:policy});
    const failed=await composeConstructionCandidate({plan:basePlan,model:baseModel,identity,typographyPolicy:policy,worker:spy({build:response=>({...response,status:'ERROR',result:{code:'INJECTED_build'}})}).worker});
    assert.equal(composed.status,'COMPOSED');assert.equal(failed.status,'WORKER_ERROR');
    assert.equal(opened.length,2);assert.deepEqual(opened.map(instance=>instance.isConnected()),[false,false],'success and failure paths both close the module-owned browser');
    const connected=shared.isConnected();await compose({identity});assert.equal(opened.length,2,'an external browser means the module launches nothing');assert.equal(connected&&shared.isConnected(),true);
  }finally{chromium.launch=realLaunch;}
});
