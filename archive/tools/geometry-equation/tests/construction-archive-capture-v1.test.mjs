// R1-a tests: real Chrome, the real archive/engine.html and a LOCAL_ONLY server. No provider is ever called.
// FIXTURE: the exam is the real 25_효천고_2학기_중간_고1_기출 and question 1 keeps its ORIGINAL content: only the three solutionImage* fields are patched
// (the protected-parity path). The construction SVG is a mathematically UNRELATED technical fixture (a triangle with a midpoint): nothing here claims
// that it means anything for question 1. That is fixtureClassification 'CONTROLLED_TECHNICAL_FIXTURE'.
// The base graph is the Bx=6 triangle on purpose: at the real medium-class policy (24.9 px base font) the Bx=4 triangle of the L1 tests is reported by
// L1 itself as LAYOUT_INVENTORY_INCOMPLETE, so it cannot be composed for this class.
// Cases marked INJECTED hand the module a forged object or swap bytes on disk to reach an axis that real inputs cannot reach.
// The module is imported lazily so that every case fails on its own while the module does not exist.
import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,fileRef} from '../../pipeline-core/canonical.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {applyConstructionParameters,recomputeConstructionParameters} from '../production/construction-parameters-v1.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {node,pointNode,int} from './construction-v1-fixture.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const MODULE_URL=new URL('../production/construction-archive-capture-v1.mjs',import.meta.url);
const sourcePath='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js';
const examUid=path.basename(sourcePath,'.js'),ORDINAL=1;
const uidOf=(id,n=ORDINAL)=>`${id}|${n}`;
const identity=assetIdentity(uidOf(examUid),'SOLUTION_VISUAL','decisive-relation');
const INTRINSIC={width:384,height:320};
const ALT='기술 fixture: 삼각형과 중점(원 문항과 무관)';
const FIXTURE='CONTROLLED_TECHNICAL_FIXTURE';
const HASH=/^sha256:[0-9a-f]{64}$/;
const LINEAGE_KEYS=['l1SvgSha256','policySha256','candidateBankSha256','assetPath','assetResponseSha256','archiveRowSha256','screenshotSha256s','matrixSha256','engineSha256'];
const PATCHED=['solutionImage','solutionImageAlt','solutionImageSize'];
const archiveAssetUrlPath=`/archive/assets/images/${examUid}/q01-solution.svg`;
const bankUrlPath='/'+sourcePath;
const sourceBefore=fileRef(root,sourcePath),engineBefore=fileRef(root,'archive/engine.html');
const rect=(width,height)=>({x:20,y:30,width,height});
// The L1-test fixture observation: used ONLY to compose a candidate with a DIFFERENT (large-class) policy for the mismatch cases.
const FIXTURE_OBSERVATION={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',384,320]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:384,naturalHeight:320}))};
const largeFixturePolicy=requestedProfileTypographyPolicy({requestedSizeClass:'large',intrinsicSvg:INTRINSIC,observation:FIXTURE_OBSERVATION});

const load=()=>import(MODULE_URL.href);
const runIdOf=tag=>`r1a-${tag}-${crypto.randomUUID()}`;
const runRootOf=runId=>path.join(root,'.tmp/archive',runId);
const assetFileOf=runId=>`.tmp/archive/${runId}/${examUid}/assets/images/${examUid}/q01-solution.svg`;
const candidateFileOf=runId=>`.tmp/archive/${runId}/${examUid}/candidates/${examUid}.js`;
const read=relative=>fs.readFileSync(path.join(root,relative));
const bare=sha=>sha.slice(7);
const clone=value=>JSON.parse(JSON.stringify(value));
const pngSize=bytes=>{assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a','PNG signature');return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};};
function treeHash(dir){const out={},walk=current=>{for(const entry of fs.readdirSync(current,{withFileTypes:true})){const file=path.join(current,entry.name);if(entry.isDirectory())walk(file);else out[path.relative(dir,file)]=bytesSha(fs.readFileSync(file));}};walk(dir);return out;}
const triangle=(bx,cy)=>({schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',bx,0),pointNode('C',0,cy),node('M','MIDPOINT',['A','B'],'POINT')]});
const planOf=mathPlan=>({capability:'construction-spike-v1',caption:'기술 fixture 삼각형',mathPlan,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']},{id:'sCM',refs:['C','M']}],coordinateLabels:['A','B','C','M']});
const modelOf=async graph=>{const response=await pythonWorker({action:'construction',graph});assert.equal(response.status,'OK',JSON.stringify(response.result));return response.result;};
const baseGraph=triangle(6,3),basePlan=planOf(baseGraph);

let shared,contextPromise;
const context=()=>contextPromise??=(async()=>{
  const api=await load();shared=await launchBrowser();
  const model=await modelOf(baseGraph),measureRunId=runIdOf('measure-medium');
  const measured=await api.measureArchiveTypographyPolicy({identity,sourcePath,ordinal:ORDINAL,requestedSizeClass:'medium',intrinsicSvg:INTRINSIC,runId:measureRunId});
  const composed=await composeConstructionCandidate({plan:basePlan,model,identity,typographyPolicy:measured.policy,browser:shared});
  console.log('R1A_MEASURED_MEDIUM='+JSON.stringify({status:measured.status,policy:measured.policy,composedStatus:composed.status,composedDetail:composed.detail}));
  return {api,model,measured,measureRunId,composed};
})();
after(async()=>{await shared?.close();});
const capture=(c,overrides={})=>c.api.captureArchiveCandidate({composed:c.composed,identity,sourcePath,ordinal:ORDINAL,requestedSizeClass:'medium',measuredPolicy:c.measured,alt:ALT,fixtureClassification:FIXTURE,runId:runIdOf('capture'),...overrides});
const measure=(c,overrides={})=>c.api.measureArchiveTypographyPolicy({identity,sourcePath,ordinal:ORDINAL,requestedSizeClass:'medium',intrinsicSvg:INTRINSIC,runId:runIdOf('measure'),...overrides});

function assertFlags(result){
  assert.ok(['NO_CALLER_HOOK','CALLER_HOOK_PRESENT'].includes(result.evidenceIntegrity),String(result.evidenceIntegrity));
  assert.equal(result.productionAuthorized,false);assert.equal(result.uidAuthority,'STRUCTURAL_ONLY');
  for(const key of ['independentInverseObservation','qualification','publication'])assert.equal(result[key],'NOT_RUN',key);
}
function assertShape(result){
  assert.equal(result.schemaVersion,'construction-archive-capture-v1');assertFlags(result);
  assert.deepEqual(Object.keys(result.lineage),LINEAGE_KEYS);
}
// Every failure that happens BEFORE the run directory is created must leave nothing behind.
const assertNoResidue=runId=>assert.equal(fs.existsSync(runRootOf(runId)),false,'no run directory '+runId);

// One bound capture, verified against the RAW files on disk and a fresh read of the exam, not against the module's own report.
function assertBound(result,{runId,composed,policy,evidenceIntegrity='NO_CALLER_HOOK'}){
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));assertShape(result);assert.equal(result.detail,null);
  assert.equal(result.fixtureClassification,FIXTURE);assert.equal(result.evidenceIntegrity,evidenceIntegrity);
  const L=result.lineage,svgSha=composed.lineage.svgSha256;
  assert.equal(svgSha,bytesSha(Buffer.from(composed.svg,'utf8')));
  for(const key of ['l1SvgSha256','assetResponseSha256','policySha256','candidateBankSha256','archiveRowSha256','matrixSha256','engineSha256'])assert.match(L[key],HASH,key);
  assert.equal(L.l1SvgSha256,svgSha);assert.equal(L.assetResponseSha256,svgSha);
  assert.equal(L.policySha256,objectSha(policy));assert.equal(L.policySha256,composed.lineage.typographyPolicySha256);assert.equal(L.engineSha256,engineBefore.sha256);
  // the written asset is exactly the L1 bytes
  assert.equal(L.assetPath,assetFileOf(runId));assert.equal(read(L.assetPath).toString('utf8'),composed.svg);assert.equal(bytesSha(read(L.assetPath)),svgSha);
  // the raw Archive row
  const paths=result.paths,rowBytes=read(paths.archiveRow);assert.equal(bytesSha(rowBytes),L.archiveRowSha256);
  const row=JSON.parse(rowBytes.toString('utf8'));
  assert.equal(row.status,'PASS');assert.equal(row.mode,'sol');assert.equal(row.runtime,'playwright-chromium');assert.equal(row.synthetic,false);assert.equal(row.engineSha256,bare(engineBefore.sha256));
  assert.equal(row.network.policy,'LOCAL_ONLY');assert.deepEqual(row.network.externalRequests,[]);
  assert.equal(row.state.qrRendererAvailable,true);assert.equal(row.state.mathJaxSource,'local');assert.equal(row.state.mathJaxCdnFallback,false);
  const matches=row.responses.filter(response=>{try{return decodeURIComponent(new URL(response.url).pathname)===archiveAssetUrlPath;}catch{return false;}});
  assert.equal(matches.length,1,'exactly one response for the candidate asset');
  assert.equal(matches[0].status,200);assert.equal('sha256:'+matches[0].sha256,svgSha,'the bytes the Archive RECEIVED are the L1 bytes');assert.equal(matches[0].bytes,Buffer.byteLength(composed.svg,'utf8'));
  // the candidate bank too: the bytes the Archive received for the exam JS are the bank that was parity-checked
  const bankMatches=row.responses.filter(response=>{try{return decodeURIComponent(new URL(response.url).pathname)===bankUrlPath;}catch{return false;}});
  assert.equal(bankMatches.length,1,'exactly one response for the candidate bank');
  assert.equal(bankMatches[0].status,200);assert.equal('sha256:'+bankMatches[0].sha256,L.candidateBankSha256);assert.equal('sha256:'+bankMatches[0].sha256,bytesSha(read(result.paths.candidateBank)));
  const target=row.state.targets.find(item=>item.id===identity.assetId);
  assert.ok(target?.loaded);assert.equal(target.naturalWidth,INTRINSIC.width);assert.equal(target.naturalHeight,INTRINSIC.height);
  const observed=Math.min(target.rect.width/INTRINSIC.width,target.rect.height/INTRINSIC.height);
  assert.equal(result.sizeClass,target.sizeClass);assert.equal(result.observedDisplayScale,observed);
  assert.ok(Math.abs(observed-policy.displayScale)*Math.max(INTRINSIC.width,INTRINSIC.height)<=1,`observed ${observed} vs policy ${policy.displayScale}`);
  // the size class comes from the rendered wrapper class: the matrix does not carry one to echo
  const matrix=JSON.parse(read(paths.matrix).toString('utf8'));assert.equal(bytesSha(read(paths.matrix)),L.matrixSha256);
  assert.equal(matrix.sources[0].assets[0].sizeClass,undefined);assert.equal(matrix.synthetic,false);assert.equal(matrix.engineSha256,bare(engineBefore.sha256));
  assert.equal(matrix.sources[0].assets[0].sha256,bare(svgSha));
  // screenshots: raw PNG bytes whose hashes are in the lineage; the image shot has the size of the measured rect
  assert.deepEqual(Object.keys(L.screenshotSha256s).sort(),['context','image','page']);
  for(const [name,sha] of Object.entries(L.screenshotSha256s)){const bytes=read(paths.screenshots[name]);assert.equal(bytesSha(bytes),sha,name);pngSize(bytes);}
  const image=pngSize(read(paths.screenshots.image));assert.ok(Math.abs(image.width-target.rect.width)<=2&&Math.abs(image.height-target.rect.height)<=2,JSON.stringify({image,rect:target.rect}));
  // layout: the Archive row's own isolated replay at the actual rect
  assert.equal(result.layout.source,'ARCHIVE_ROW_ISOLATED_REPLAY');assert.equal(result.layout.status,'PASS');assert.deepEqual(result.layout.errors,[]);
  assert.equal(row.layouts.find(item=>item.id===identity.assetId).status,'PASS');
  // protected parity, from a fresh read of the exam and the candidate bank on disk
  const original=loadBank(fs.readFileSync(path.join(root,sourcePath),'utf8')),candidateText=read(paths.candidateBank).toString('utf8');
  assert.equal(bytesSha(Buffer.from(candidateText,'utf8')),L.candidateBankSha256);
  const candidate=loadBank(candidateText);assert.equal(candidate.length,original.length);
  original.forEach((question,index)=>{const before=clone(question),after=clone(candidate[index]);if(question.id===ORDINAL)for(const field of PATCHED){delete before[field];delete after[field];}assert.deepEqual(after,before,'question '+question.id);});
  assert.equal(original[0].solutionImage,undefined,'the original question carried no solution image');
  assert.deepEqual(Object.fromEntries(PATCHED.map(field=>[field,candidate[0][field]])),{solutionImage:`assets/images/${examUid}/q01-solution.svg`,solutionImageAlt:ALT,solutionImageSize:'medium'});
  assert.equal(result.protectedParity.status,'PASS');assert.equal(result.protectedParity.questionCount,original.length);assert.equal(result.protectedParity.originalQuestionSha256,objectSha(clone(original[0])));
  assert.deepEqual([...result.protectedParity.changedFields].sort(),PATCHED);assert.equal(result.protectedParity.targetOrdinal,ORDINAL);
  assert.deepEqual(Object.keys(result.checks),['network','assetResponse','bankResponse','naturalSize','sizeClass','displayScale','layout']);
  assert.deepEqual(Object.values(result.checks),Object.values(result.checks).map(()=>'PASS'));
  return {row,target,observed};
}

test('M the measured medium policy comes from the raw Archive row of this exam, this question identity and this engine',async()=>{
  const c=await context(),m=c.measured;
  assert.equal(m.status,'MEASURED');assert.equal(m.provenance,'ARCHIVE_MEASURED');assertFlags(m);assert.equal(m.evidenceIntegrity,'NO_CALLER_HOOK');assert.equal(m.policySha256,objectSha(m.policy));
  assert.equal(m.policy.schemaVersion,'REQUESTED_PROFILE_TYPOGRAPHY_v1');assert.equal(m.policy.requestedSizeClass,'medium');
  const rowBytes=read(m.evidence.archiveRow.path);assert.equal(bytesSha(rowBytes),m.evidence.archiveRow.sha256);assert.equal(rowBytes.length,m.evidence.archiveRow.bytes);
  const row=JSON.parse(rowBytes.toString('utf8')),envelope=row.state.displayEnvelopes.find(item=>item.id===identity.assetId);
  assert.ok(envelope,'the measured target is this identity.assetId');assert.deepEqual(envelope.intrinsicSvg,INTRINSIC);
  const medium=envelope.profiles.find(item=>item.sizeClass==='medium');
  assert.equal(m.policy.displayScale,Math.min(medium.imageRect.width/INTRINSIC.width,medium.imageRect.height/INTRINSIC.height));
  // the policy and the observation hash re-derived by the TEST from the raw row
  const observation={...envelope,questionUid:identity.questionUid,synthetic:false,runtime:row.runtime,browserVersion:row.browserVersion,sourceRef:sourceBefore,sourceAuthorityStatus:'MEASUREMENT_ONLY'};
  assert.deepEqual(m.policy,requestedProfileTypographyPolicy({requestedSizeClass:'medium',intrinsicSvg:INTRINSIC,observation,fontFloorCssPx:11}));
  assert.equal(m.evidence.observationSha256,objectSha(observation));
  assert.equal(m.evidence.engineSha256,engineBefore.sha256);assert.equal(row.engineSha256,bare(engineBefore.sha256));assert.equal(row.sourceSha256,bare(sourceBefore.sha256));
  assert.equal(row.network.policy,'LOCAL_ONLY');assert.deepEqual(row.network.externalRequests,[]);assert.equal(row.state.qrRendererAvailable,true);assert.equal(row.state.mathJaxSource,'local');
  const matrixFile=path.join('.tmp/archive',c.measureRunId,examUid,'visual-engine/production/display-envelope-preflight/archive-render-matrix.json').replaceAll('\\','/');
  assert.equal(bytesSha(read(matrixFile)),m.evidence.matrixSha256);
  const screenshot=read(m.evidence.screenshot.path);assert.equal(bytesSha(screenshot),m.evidence.screenshot.sha256);assert.equal(screenshot.length,m.evidence.screenshot.bytes);pngSize(screenshot);
  assert.ok(m.policy.baseFontPx>=m.policy.minimumBaseFontPx&&m.policy.baseFontPx<=m.policy.maximumBaseFontPx);
  assert.equal(c.composed.status,'COMPOSED',JSON.stringify(c.composed.detail));assert.equal(c.composed.lineage.typographyPolicySha256,m.policySha256);
});

test('C1 the L1 SVG composed with the measured policy is the asset the real Archive received; same revision, local only, protected parity',async()=>{
  const c=await context(),runId=runIdOf('capture-c1');
  const result=await capture(c,{runId});
  const {observed}=assertBound(result,{runId,composed:c.composed,policy:c.measured.policy});
  console.log('R1A_C1='+JSON.stringify({sizeClass:result.sizeClass,observedDisplayScale:observed,policyDisplayScale:c.measured.policy.displayScale,checks:result.checks,lineage:result.lineage}));
  // E6 on this very run: a used runId is refused and the earlier evidence is left byte for byte as it was
  const before=treeHash(runRootOf(runId));
  const again=await capture(c,{runId});
  assert.equal(again.status,'ARCHIVE_RUN_EXISTS');assertShape(again);assert.deepEqual(treeHash(runRootOf(runId)),before);
  c.c1={runId,result};
});

test('C2 an M1 derived snapshot (C.y 3->4) composes with the same measured policy and binds a DIFFERENT asset response',async()=>{
  const c=await context();assert.ok(c.c1,'C1 ran first');
  const parameterSpec={schemaVersion:'construction-parameter-spec-v1',baseGraphSha256:objectSha(baseGraph),slots:[{id:'Cy',target:{kind:'NODE_ARG',nodeId:'C',path:['coordinates',1]},domain:{min:int(0),max:int(10)}}]};
  const args={baseGraph,parameterSpec,values:{schemaVersion:'construction-parameter-values-v1',parameterSpecSha256:objectSha(parameterSpec),values:{Cy:int(4)}}};
  const {derivedGraph}=applyConstructionParameters(args),recomputed=await recomputeConstructionParameters(args);
  assert.equal(recomputed.status,'RECOMPUTED');
  const derivedModel=await modelOf(derivedGraph);assert.equal(objectSha(derivedModel),recomputed.lineage.derivedSnapshotSha256);
  const derived=await composeConstructionCandidate({plan:planOf(derivedGraph),model:derivedModel,identity,typographyPolicy:c.measured.policy,browser:shared});
  assert.equal(derived.status,'COMPOSED',JSON.stringify(derived.detail));assert.notEqual(derived.lineage.svgSha256,c.composed.lineage.svgSha256);
  const runId=runIdOf('capture-c2'),result=await capture(c,{composed:derived,runId});
  assertBound(result,{runId,composed:derived,policy:c.measured.policy});
  assert.notEqual(result.lineage.assetResponseSha256,c.c1.result.lineage.assetResponseSha256,'a different revision is a different response');
  assert.equal(result.lineage.policySha256,c.c1.result.lineage.policySha256);
  assert.equal(result.lineage.candidateBankSha256,c.c1.result.lineage.candidateBankSha256,'the bank text names the asset path only; the bytes are bound by the response');
  assert.notEqual(result.lineage.screenshotSha256s.image,c.c1.result.lineage.screenshotSha256s.image);
});

test('E1 a composed result whose status or SVG bytes do not hold together is refused before anything is written',async()=>{
  const c=await context(),good=c.composed;
  const swappedSvg=good.svg.replace('<svg ','<svg data-forged="1" ');assert.notEqual(swappedSvg,good.svg);
  const cases=[
    ['INJECTED svg bytes changed, lineage hash kept',{...good,svg:swappedSvg},'SVG_SHA_MISMATCH'],
    ['INJECTED lineage svg hash forged, bytes kept',{...good,lineage:{...good.lineage,svgSha256:'sha256:'+'0'.repeat(64)}},'SVG_SHA_MISMATCH'],
    ['INJECTED schema version of another producer',{...good,schemaVersion:'other-producer-v1'},'SCHEMA_VERSION'],
    ['INJECTED status is a failure with the svg still attached',{...good,status:'RENDERED_LAYOUT_FAIL'},'STATUS_NOT_COMPOSED'],
    ['INJECTED svg missing',{...good,svg:null},'SVG_MISSING'],
    ['INJECTED lineage missing',{...good,lineage:undefined},'LINEAGE_MISSING'],
    ['INJECTED not an object',null,'NOT_AN_OBJECT']
  ];
  for(const [name,composed,reason] of cases){
    const runId=runIdOf('e1'),result=await capture(c,{composed,runId});
    assert.equal(result.status,'COMPOSED_INPUT_INVALID',name);assert.equal(result.detail.reason,reason,name);assertShape(result);assertNoResidue(runId);
  }
});

test('E2 a composed result of ANOTHER policy, and a forged measured policy, are refused as POLICY_PROVENANCE_MISMATCH on the intended axis',async()=>{
  const c=await context(),composedLarge=await composeConstructionCandidate({plan:basePlan,model:c.model,identity,typographyPolicy:largeFixturePolicy,browser:shared});
  assert.equal(composedLarge.status,'COMPOSED',JSON.stringify(composedLarge.detail));assert.notEqual(composedLarge.lineage.typographyPolicySha256,c.measured.policySha256);
  // The measured row holds all four classes, so a REAL large policy is also derivable from it. A forged one must not be: baseFontPx 21 is not what any measured scale gives.
  const forgedPolicy={...largeFixturePolicy,baseFontPx:21},composedForged=await composeConstructionCandidate({plan:basePlan,model:c.model,identity,typographyPolicy:forgedPolicy,browser:shared});
  assert.equal(composedForged.status,'COMPOSED',JSON.stringify(composedForged.detail));
  const cases=[
    ['composed was built with a different (fixture, large) policy',{composed:composedLarge},'COMPOSED_POLICY_SHA_DIFFERS'],
    ['INJECTED measured policy edited after the fact, its hash kept',{measuredPolicy:{...c.measured,policy:{...c.measured.policy,baseFontPx:c.measured.policy.baseFontPx+1}}},'POLICY_SHA_NOT_OF_POLICY'],
    ['INJECTED provenance claims the caller supplied it',{measuredPolicy:{...c.measured,provenance:'CALLER_SUPPLIED_UNVERIFIED'}},'PROVENANCE_NOT_ARCHIVE_MEASURED'],
    ['INJECTED self-consistent forged policy: composed and hash agree, only the evidence disagrees',{composed:composedForged,measuredPolicy:{...c.measured,policy:forgedPolicy,policySha256:objectSha(forgedPolicy)}},'POLICY_NOT_DERIVED_FROM_EVIDENCE'],
    ['INJECTED evidence ref with a wrong hash',{measuredPolicy:{...c.measured,evidence:{...c.measured.evidence,archiveRow:{...c.measured.evidence.archiveRow,sha256:'sha256:'+'1'.repeat(64)}}}},'EVIDENCE_REF_STALE'],
    ['INJECTED observation hash that is not the one of the raw row',{measuredPolicy:{...c.measured,evidence:{...c.measured.evidence,observationSha256:'sha256:'+'2'.repeat(64)}}},'OBSERVATION_SHA_DIFFERS']
  ];
  for(const [name,overrides,reason] of cases){
    const runId=runIdOf('e2'),result=await capture(c,{...overrides,runId});
    assert.equal(result.status,'POLICY_PROVENANCE_MISMATCH',name+' '+JSON.stringify(result.detail));assert.equal(result.detail.reason,reason,name);assertShape(result);assertNoResidue(runId);
  }
  // INJECTED: a self-consistent composed whose SVG intrinsic size is not the measured one
  const wide=c.composed.svg.replace('width="384"','width="400"');assert.notEqual(wide,c.composed.svg);
  const forged={...c.composed,svg:wide,lineage:{...c.composed.lineage,svgSha256:bytesSha(Buffer.from(wide,'utf8'))}},runId=runIdOf('e2-intrinsic'),result=await capture(c,{composed:forged,runId});
  assert.equal(result.status,'POLICY_PROVENANCE_MISMATCH');assert.equal(result.detail.reason,'INTRINSIC_SVG_DIFFERS_FROM_MEASURED');assertNoResidue(runId);
});

test('E3 a tampered identity and a question UID that is not this exam/ordinal are refused by both functions',async()=>{
  const c=await context();
  const tamper=[
    ['assetId changed',{...identity,assetId:'va-'+'0'.repeat(64)}],['visualAssetKey changed',{...identity,visualAssetKey:'sha256:'+'0'.repeat(64)}],['extra field',{...identity,extra:1}],
    ['visualRole changed, derived fields kept',{...identity,visualRole:'other-role'}],['missing',undefined]
  ];
  for(const [name,bad] of tamper){
    const a=runIdOf('e3a'),b=runIdOf('e3b'),captured=await capture(c,{identity:bad,runId:a}),measured=await measure(c,{identity:bad,runId:b});
    assert.equal(captured.status,'ARCHIVE_IDENTITY_INVALID',name);assert.equal(measured.status,'ARCHIVE_IDENTITY_INVALID',name);assertShape(captured);assertFlags(measured);assertNoResidue(a);assertNoResidue(b);
  }
  const mismatched=[['another ordinal of this exam',assetIdentity(uidOf(examUid,2),'SOLUTION_VISUAL','decisive-relation')],['another exam, same ordinal',assetIdentity(uidOf('other_exam'),'SOLUTION_VISUAL','decisive-relation')]];
  for(const [name,bad] of mismatched){
    const a=runIdOf('e3c'),b=runIdOf('e3d'),captured=await capture(c,{identity:bad,runId:a}),measured=await measure(c,{identity:bad,runId:b});
    assert.equal(captured.status,'IDENTITY_SOURCE_MISMATCH',name);assert.equal(measured.status,'IDENTITY_SOURCE_MISMATCH',name);assert.equal(captured.uidAuthority,'STRUCTURAL_ONLY');assertNoResidue(a);assertNoResidue(b);
  }
});

test('E4a INJECTED asset bytes swapped right before the capture are refused by the capture own matrix check (STALE_ASSET_MATRIX)',async()=>{
  const c=await context(),runId=runIdOf('e4a'),swapped=c.composed.svg.replace(/<\/svg>\s*$/,'<!-- INJECTED SWAP --></svg>');assert.notEqual(swapped,c.composed.svg);
  const result=await capture(c,{runId,onProgress:event=>{if(event.event==='ARCHIVE_CANDIDATE_READY')fs.writeFileSync(path.join(root,assetFileOf(runId)),swapped);}});
  console.log('R1A_E4A='+JSON.stringify({status:result.status,detail:result.detail}));
  assert.equal(result.status,'ARCHIVE_CAPTURE_ERROR');assert.match(result.detail.message,/STALE_ASSET_MATRIX/);assertShape(result);assert.equal(result.evidenceIntegrity,'CALLER_HOOK_PRESENT');
  assert.equal(result.lineage.l1SvgSha256,c.composed.lineage.svgSha256);assert.equal(result.lineage.assetResponseSha256,null,'no response exists');
});

test('E4b INJECTED asset bytes swapped while Chrome is already running: the response the Archive received differs from the L1 bytes',async()=>{
  const c=await context(),runId=runIdOf('e4b'),swapped=c.composed.svg.replace(/<\/svg>\s*$/,'<!-- INJECTED SWAP --></svg>');assert.notEqual(swapped,c.composed.svg);
  const result=await capture(c,{runId,onProgress:event=>{if(event.event==='BROWSER_LAUNCHED')fs.writeFileSync(path.join(root,assetFileOf(runId)),swapped);}});
  console.log('R1A_E4B='+JSON.stringify({status:result.status,errors:result.detail?.errors,lineage:result.lineage}));
  assert.equal(result.status,'ARCHIVE_CAPTURE_FAIL');assertShape(result);assert.equal(result.evidenceIntegrity,'CALLER_HOOK_PRESENT');
  assert.ok(result.detail.errors.some(error=>error.startsWith('ACTUAL_LOADED_ASSET_SHA_MISMATCH:'+identity.assetId)),JSON.stringify(result.detail.errors));
  assert.equal(result.lineage.l1SvgSha256,c.composed.lineage.svgSha256);
  assert.equal(result.lineage.assetResponseSha256,bytesSha(Buffer.from(swapped,'utf8')),'the lineage records what the Archive really received');
  assert.notEqual(result.lineage.assetResponseSha256,result.lineage.l1SvgSha256);assert.match(result.lineage.archiveRowSha256,HASH);
});

test('E4c INJECTED candidate bank changed after the parity check, while Chrome is already running: the bank the Archive received is not the bank that was checked',async()=>{
  const c=await context(),runId=runIdOf('e4c'),tail='\n;window.questionBank.find(q=>q.id===1).answer="9999";\n';
  let swappedBank=null;
  const result=await capture(c,{runId,onProgress:event=>{if(event.event==='BROWSER_LAUNCHED'){const file=path.join(root,candidateFileOf(runId));swappedBank=fs.readFileSync(file,'utf8')+tail;fs.writeFileSync(file,swappedBank);}}});
  console.log('R1A_E4C='+JSON.stringify({status:result.status,checks:result.checks,parity:result.protectedParity?.status,detail:result.detail}));
  assert.ok(swappedBank);assert.equal(result.status,'ARCHIVE_BANK_RESPONSE_MISMATCH',JSON.stringify(result.detail));assertShape(result);assert.equal(result.evidenceIntegrity,'CALLER_HOOK_PRESENT');
  // the parity statement is about the bank the module wrote; it is the bank response check that refuses the swapped one
  assert.equal(result.protectedParity.status,'PASS');assert.equal(result.checks.bankResponse,'FAIL');assert.equal(result.checks.assetResponse,'PASS');
  const swappedSha=bytesSha(Buffer.from(swappedBank,'utf8'));
  assert.equal(result.detail.check,'bankResponse');assert.equal(result.detail.expected,result.lineage.candidateBankSha256);assert.notEqual(swappedSha,result.lineage.candidateBankSha256);
  assert.deepEqual(result.detail.responses.map(item=>[item.status,'sha256:'+item.sha256]),[[200,swappedSha]],'the detail records what the Archive really received');
  assert.equal(result.lineage.assetResponseSha256,c.composed.lineage.svgSha256);
});

test('E5 medium policy, large capture: size class matches the request and the asset bytes match, the actual display scale does not',async()=>{
  const c=await context(),runId=runIdOf('e5'),result=await capture(c,{requestedSizeClass:'large',runId});
  console.log('R1A_E5='+JSON.stringify({status:result.status,sizeClass:result.sizeClass,observed:result.observedDisplayScale,expected:result.expectedDisplayScale,deltaCssPx:result.displayScaleDeltaCssPx,checks:result.checks}));
  assert.equal(result.status,'ARCHIVE_DISPLAY_SCALE_MISMATCH',JSON.stringify(result.detail));assertShape(result);
  assert.equal(result.sizeClass,'large');assert.equal(result.checks.assetResponse,'PASS');assert.equal(result.checks.bankResponse,'PASS');assert.equal(result.checks.sizeClass,'PASS');assert.equal(result.checks.displayScale,'FAIL');
  assert.equal(result.lineage.assetResponseSha256,c.composed.lineage.svgSha256);
  const row=JSON.parse(read(result.paths.archiveRow).toString('utf8')),target=row.state.targets.find(item=>item.id===identity.assetId);
  const observed=Math.min(target.rect.width/INTRINSIC.width,target.rect.height/INTRINSIC.height);
  assert.equal(result.observedDisplayScale,observed);assert.equal(result.expectedDisplayScale,c.measured.policy.displayScale);
  const delta=Math.abs(observed-c.measured.policy.displayScale)*Math.max(INTRINSIC.width,INTRINSIC.height);assert.ok(delta>1,'a real display difference: '+delta);assert.equal(result.displayScaleDeltaCssPx,delta);
  assert.equal(result.detail.toleranceCssPx,1);
});

test('E6 a used runId is refused by both functions and the earlier evidence is untouched',async()=>{
  const c=await context(),before=treeHash(runRootOf(c.measureRunId));
  const result=await measure(c,{runId:c.measureRunId,onProgress(){}});
  assert.equal(result.status,'ARCHIVE_RUN_EXISTS');assertFlags(result);assert.equal(result.evidenceIntegrity,'CALLER_HOOK_PRESENT');assert.deepEqual(treeHash(runRootOf(c.measureRunId)),before);
  assert.ok(c.c1,'the capture side of E6 runs inside C1');
});

test('E7 each invalid input reaches its own ARCHIVE_INPUT_INVALID reason (size class, ordinal, source scope, source file, surface, alt, runId, intrinsic size) and leaves no run directory',async()=>{
  const c=await context(),rawOutside='archive/tools/geometry-equation/tests/construction-v1-fixture.mjs';
  const idFor=(id,n=ORDINAL,surface='SOLUTION_VISUAL')=>assetIdentity(uidOf(id,n),surface,'decisive-relation');
  const cases=[
    ['unknown size class',{requestedSizeClass:'huge'},'SIZE_CLASS'],['size class case',{requestedSizeClass:'MEDIUM'},'SIZE_CLASS'],['size class missing',{requestedSizeClass:undefined},'SIZE_CLASS'],
    ['ordinal not in the bank',{ordinal:999,identity:idFor(examUid,999)},'ORDINAL_NOT_IN_BANK'],['ordinal zero',{ordinal:0,identity:idFor(examUid,1)},'ORDINAL'],['ordinal as string',{ordinal:'1'},'ORDINAL'],
    ['source outside archive/exams (not a .js under it)',{sourcePath:rawOutside,identity:idFor('construction-v1-fixture')},'SOURCE_SCOPE'],
    ['source with a dot-dot segment and no .js suffix',{sourcePath:'archive/exams/../tools/geometry-equation/tests/construction-v1-fixture.mjs',identity:idFor('construction-v1-fixture')},'SOURCE_SCOPE'],
    ['source with a dot-dot segment that stays inside archive/exams',{sourcePath:'archive/exams/original/../original/high/h1/2mid/'+examUid+'.js'},'SOURCE_NOT_A_FILE'],
    ['absolute source path',{sourcePath:path.join(root,sourcePath)},'SOURCE_SCOPE'],['missing file under archive/exams',{sourcePath:'archive/exams/original/high/h1/2mid/no_such_exam.js',identity:idFor('no_such_exam')},'SOURCE_NOT_A_FILE'],
    ['directory path without a .js suffix',{sourcePath:'archive/exams/original/high/h1/2mid',identity:idFor('2mid')},'SOURCE_SCOPE'],
    ['PROBLEM_VISUAL surface',{identity:idFor(examUid,ORDINAL,'PROBLEM_VISUAL')},'SURFACE_NOT_SOLUTION_VISUAL'],['empty alt',{alt:''},'ALT'],['alt missing',{alt:undefined},'ALT'],['onProgress that is not a function',{onProgress:'no'},'ON_PROGRESS']
  ];
  for(const [name,overrides,reason] of cases){
    const runId=runIdOf('e7'),result=await capture(c,{...overrides,runId});
    assert.equal(result.status,'ARCHIVE_INPUT_INVALID',name+' '+JSON.stringify(result.detail));assert.equal(result.detail.reason,reason,name);assertShape(result);assertNoResidue(runId);
  }
  for(const runId of ['../escape','','a/b','x'.repeat(81),'has space']){
    const captured=await capture(c,{runId}),measured=await measure(c,{runId});
    for(const result of [captured,measured]){assert.equal(result.status,'ARCHIVE_INPUT_INVALID','runId '+JSON.stringify(runId));assert.equal(result.detail.reason,'RUN_ID');}
  }
  for(const intrinsicSvg of [{width:384.5,height:320},{width:0,height:320},{width:384},undefined,null]){
    const runId=runIdOf('e7m'),result=await measure(c,{intrinsicSvg,runId});assert.equal(result.status,'ARCHIVE_INPUT_INVALID','intrinsic '+JSON.stringify(intrinsicSvg));assert.equal(result.detail.reason,'INTRINSIC_SVG');assertNoResidue(runId);
  }
  for(const [name,overrides,reason] of [['unknown size class',{requestedSizeClass:'huge'},'SIZE_CLASS'],['source outside archive/exams',{sourcePath:rawOutside,identity:idFor('construction-v1-fixture')},'SOURCE_SCOPE'],['PROBLEM_VISUAL surface',{identity:idFor(examUid,ORDINAL,'PROBLEM_VISUAL')},'SURFACE_NOT_SOLUTION_VISUAL']]){
    const runId=runIdOf('e7n'),result=await measure(c,{...overrides,runId});assert.equal(result.status,'ARCHIVE_INPUT_INVALID','measure '+name);assert.equal(result.detail.reason,reason,'measure '+name);assertNoResidue(runId);
  }
});

test('E10 an SVG with a script, or with an href that is neither a #fragment nor a data: URL, is refused as SVG_EXTERNAL_REFERENCE before anything is written',async()=>{
  const c=await context(),good=c.composed;
  const withTail=tail=>{const svg=good.svg.replace(/<\/svg>\s*$/,tail+'</svg>');assert.notEqual(svg,good.svg);return {...good,svg,lineage:{...good.lineage,svgSha256:bytesSha(Buffer.from(svg,'utf8'))}};};
  // The hosts are a closed local port and the reserved .invalid TLD: even the pre-repair module, which does not look, cannot reach a real host with them.
  const rejected=[
    ['INJECTED script element','<script>fetch("http://127.0.0.1:1/x")</script>','SCRIPT'],
    ['INJECTED prefixed script element','<svg:script xmlns:svg="http://www.w3.org/2000/svg">1</svg:script>','SCRIPT'],
    ['INJECTED image href http','<image href="http://127.0.0.1:1/x.png" width="1" height="1"/>','HREF'],
    ['INJECTED image xlink:href https','<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://x.invalid/x.png" width="1" height="1"/>','HREF'],
    ['INJECTED image href protocol-relative','<image href="//x.invalid/x.png" width="1" height="1"/>','HREF'],
    ['INJECTED image href file scheme','<image href="file:///x.png" width="1" height="1"/>','HREF'],
    ['INJECTED image href relative path (anything but #fragment or data: is refused)','<image href="relative.png" width="1" height="1"/>','HREF'],
    ['INJECTED image href with the scheme hidden by a character reference and a tab','<image href="ht&#9;tp&#58;//127.0.0.1:1/x.png" width="1" height="1"/>','HREF']
  ];
  for(const [name,tail,kind] of rejected){
    const runId=runIdOf('e10'),result=await capture(c,{composed:withTail(tail),runId});
    assert.equal(result.status,'SVG_EXTERNAL_REFERENCE',name+' '+JSON.stringify(result.detail));assertShape(result);assert.equal(result.detail.found[0].kind,kind,name);assertNoResidue(runId);
  }
  // Allowed: #fragment references and data: URLs. They are not refused by this check, so the call goes on to the next axis; a measured policy that claims
  // to be caller supplied stops it there, cheaply (POLICY_PROVENANCE_MISMATCH, no capture, no run directory). The unchanged L1 SVG has no href at all and is captured in C1.
  const allowed=[['#fragment use','<use href="#a"/>'],['#fragment xlink:href','<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#a"/>'],['data: URL image','<image href="data:image/png;base64,AAAA" width="1" height="1"/>']];
  for(const [name,tail] of allowed){
    const runId=runIdOf('e10a'),result=await capture(c,{composed:withTail(tail),measuredPolicy:{...c.measured,provenance:'CALLER_SUPPLIED_UNVERIFIED'},runId});
    assert.equal(result.status,'POLICY_PROVENANCE_MISMATCH',name+' '+JSON.stringify(result.detail));assert.equal(result.detail.reason,'PROVENANCE_NOT_ARCHIVE_MEASURED',name);assertNoResidue(runId);
  }
});

test('B the 1 CSS px display-scale tolerance holds at exactly 1 px despite float noise and refuses anything above',async()=>{
  const api=await load(),observed=174/384,diff=expectedPx=>api.displayScaleDifference({observed,expected:expectedPx/384,intrinsic:INTRINSIC});
  assert.equal(api.DISPLAY_SCALE_TOLERANCE_CSS_PX,1);
  assert.equal(diff(174).withinTolerance,true);assert.equal(diff(174).deltaCssPx,0);
  assert.equal(diff(174.5).withinTolerance,true);
  for(const px of [173,175]){const result=diff(px);assert.ok(result.deltaCssPx>1,'float noise puts exactly 1 px above 1: '+result.deltaCssPx);assert.ok(result.deltaCssPx-1<1e-9);assert.equal(result.withinTolerance,true,'exactly 1 px: '+px);}
  for(const px of [175.001,172.999,176,170]){assert.equal(diff(px).withinTolerance,false,'more than 1 px: '+px);}
  assert.equal(api.displayScaleDifference({observed,expected:175/384,intrinsic:INTRINSIC,toleranceCssPx:0.5}).withinTolerance,false);
});

test('E8 the small class cannot host the minimum font for this SVG: the measurement is kept, the policy is refused',async()=>{
  const c=await context(),runId=runIdOf('e8'),result=await measure(c,{requestedSizeClass:'small',runId});
  console.log('R1A_E8='+JSON.stringify({status:result.status,detail:result.detail}));
  assert.equal(result.status,'ARCHIVE_POLICY_UNSUPPORTED');assert.match(result.detail.message,/UNSUPPORTED_DISPLAY_ENVELOPE/);
  assert.equal(result.policy,null);assert.equal(result.policySha256,null);assert.equal(result.provenance,null);assertFlags(result);
  assert.match(result.evidence.archiveRow.sha256,HASH);assert.equal(bytesSha(read(result.evidence.archiveRow.path)),result.evidence.archiveRow.sha256);
});

test('E9 a caller abort propagates as a cancellation, never as a status, and nothing is bound',async()=>{
  const c=await context(),controller=new AbortController();controller.abort();
  await assert.rejects(()=>capture(c,{signal:controller.signal,runId:runIdOf('e9')}),{code:'ARCHIVE_CAPTURE_CANCELLED'});
  await assert.rejects(()=>measure(c,{signal:controller.signal,runId:runIdOf('e9m')}),{code:'ARCHIVE_CAPTURE_CANCELLED'});
});

test('Z no exam JS, asset or engine write; no provider import; every artefact is under .tmp/archive',async()=>{
  const c=await context();assert.ok(c.c1);
  assert.deepEqual(fileRef(root,sourcePath),sourceBefore);assert.deepEqual(fileRef(root,'archive/engine.html'),engineBefore);
  const status=execFileSync('git',['status','--porcelain','--','archive/exams','archive/assets','archive/engine.html'],{cwd:root,encoding:'utf8'});
  assert.equal(status,'');
  assert.equal(fs.existsSync(path.join(root,'archive/assets/images',examUid,'q01-solution.svg')),false);
  const moduleSource=fs.readFileSync(fileURLToPath(MODULE_URL),'utf8');
  assert.doesNotMatch(moduleSource,/^import[^\n]*(provider|codex-appserver|phase2)/m);
  assert.equal(c.c1.result.lineage.assetPath.startsWith('.tmp/archive/'),true);
});
