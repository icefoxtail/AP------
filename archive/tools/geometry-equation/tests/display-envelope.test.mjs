// These fixture-backed tests exercise qualification logic and hash binding only.
// They are not browser evidence and do not claim an actual Playwright capture.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {canonicalJson,fileRef} from '../../pipeline-core/canonical.mjs';
import {compareActualDisplayEnvelope,planDisplayEnvelope,qualifyDisplayEnvelope} from '../production/display-envelope.mjs';

const intrinsic={width:384,height:320};
const rect=(width,height)=>({x:20,y:30,width,height});
const classes=[
  ['small',126,105,'48%','105px'],
  ['medium',174,145,'72%','145px'],
  ['large',216,180,'92%','180px'],
  ['full',384,320,'100%','none']
];
const profile=([sizeClass,width,height,maxWidth,maxHeight])=>({
  status:'PASS',sizeClass,imageRect:rect(width,height),naturalWidth:intrinsic.width,naturalHeight:intrinsic.height,
  computedStyle:{maxWidth,maxHeight,objectFit:'contain',transform:'none'},transformChain:['none','none','none']
});
const labelInventory=[{id:'A-name',fontPx:20},{id:'axis-x',fontPx:20}];
const write=(root,relative,bytes)=>{
  const full=path.join(root,...relative.split('/'));
  fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);
  return fileRef(root,relative);
};
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc&1)?(crc>>>1)^0xedb88320:crc>>>1;}return(crc^0xffffffff)>>>0;}
function pngChunk(name,data){
  const type=Buffer.from(name,'ascii'),chunk=Buffer.alloc(12+data.length);chunk.writeUInt32BE(data.length,0);type.copy(chunk,4);data.copy(chunk,8);chunk.writeUInt32BE(crc32(Buffer.concat([type,data])),8+data.length);return chunk;
}
const fakePng=(width,height)=>{
  const signature=Buffer.from([137,80,78,71,13,10,26,10]),header=Buffer.alloc(13);
  header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
  const pixels=zlib.deflateSync(Buffer.alloc(height*(1+width*4)));
  return Buffer.concat([signature,pngChunk('IHDR',header),pngChunk('IDAT',pixels),pngChunk('IEND',Buffer.alloc(0))]);
};

function fixture(t,{minimumByClass={small:6.56,medium:9.06,large:11.25,full:20},patches={},candidateSize=intrinsic}={}){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'apmath-display-envelope-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const sourceRef=write(root,'archive/source.js','window.questionBank=[];');
  const solutionRef=write(root,'evidence/solution.txt','verified solution input');
  const policyRefs=[
    {name:'archive-engine',ref:write(root,'archive/engine.html','<img class="solution">')},
    {name:'display-envelope-policy',ref:write(root,'policy/display-envelope.json','{"policy":"fixture"}')}
  ];
  const candidateSvgRef=write(root,'candidate/q01-solution.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="${candidateSize.width}" height="${candidateSize.height}" viewBox="0 0 ${candidateSize.width} ${candidateSize.height}"></svg>`);
  const uid='fixture-exam|1';
  const observedProfiles=classes.map(profile);
  const observation={status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',questionUid:uid,questionId:1,sourceRef,qBoxRect:rect(820,460),solutionMetaRect:rect(790,370),solutionMetaContentWidth:772,intrinsicSvg:intrinsic,profiles:observedProfiles};
  const candidateSourceRef=write(root,'.tmp/archive/control-fixture/exam/visual-engine/production/source.js',fs.readFileSync(path.join(root,...sourceRef.path.split('/'))));
  const preflightScreenshotRef=write(root,'.tmp/archive/control-fixture/exam/visual-engine/production/capture/context.png',fakePng(1440,1000));
  const rawObservation={id:'control-target',questionId:1,status:'PASS',qBoxRect:observation.qBoxRect,solutionMetaRect:observation.solutionMetaRect,solutionMetaContentWidth:observation.solutionMetaContentWidth,intrinsicSvg:intrinsic,profiles:observedProfiles};
  const archiveRowRef=write(root,'.tmp/archive/control-fixture/exam/visual-engine/production/capture/archive-row.json',canonicalJson({status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',engineSha256:policyRefs[0].ref.sha256.slice(7),sourceSha256:sourceRef.sha256.slice(7),state:{displayEnvelopes:[rawObservation]}}));
  const preflightMeasurementRef=write(root,'.tmp/archive/control-fixture/exam/visual-engine/production/capture/preflight.json',canonicalJson({schemaVersion:'DISPLAY_ENVELOPE_PREFLIGHT_v1',status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',questionUid:uid,targetId:'control-target',sourceRef,candidateRef:candidateSourceRef,archiveRowRef,screenshotRef:preflightScreenshotRef,screenshotViewport:{width:1440,height:1000},observation,sourceAuthorityStatus:'CONTROL_FIXTURE'}));
  const preflightEvidence={measurementRef:preflightMeasurementRef,archiveRowRef,screenshotRef:preflightScreenshotRef};
  const plan=planDisplayEnvelope({root,questionUid:uid,requestedSizeClass:'medium',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation,preflightEvidence,archiveEngineSha256:policyRefs[0].ref.sha256,sourceRef,solutionRef,policyRefs});
  const profileAudits=classes.map(([sizeClass,width,height],index)=>{
    const pngRef=write(root,`capture/${sizeClass}.png`,fakePng(width,height));
    const base={
      schemaVersion:'DISPLAY_PROFILE_AUDIT_v1',status:'PASS',questionUid:uid,sizeClass,
      synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',
      candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,naturalWidth:intrinsic.width,naturalHeight:intrinsic.height,sourceRef,solutionRef,policyRefs:plan.policyRefs,inputIdentitySha256:plan.inputIdentitySha256,
      imageRect:observedProfiles[index].imageRect,computedStyle:observedProfiles[index].computedStyle,profilePolicySha256:plan.profiles[index].profilePolicySha256,
      rawCapture:{viewBox:{x:0,y:0,width:intrinsic.width,height:intrinsic.height},svg:observedProfiles[index].imageRect},
      screenshotViewport:{width,height},screenshotRef:pngRef,
      labelMeasurements:labelInventory.map(label=>({id:label.id,finalViewportCssFontPx:minimumByClass[sizeClass]})),
      layoutStatus:'PASS',graphRequired:false,topologyRequired:false,strokeStatus:'PASS',strokeMeasurements:[{id:'axis-x',sizeClass,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,finalViewportCssStrokePx:1}],
      ...(patches[sizeClass]||{})
    };
    const measurementRef=write(root,`measurement/${sizeClass}.json`,canonicalJson(base));
    return {sizeClass,measurementRef};
  });
  return {root,plan,profileAudits,candidateSvgRef,sourceRef,solutionRef,policyRefs,preflightEvidence,uid};
}
const qualify=fx=>qualifyDisplayEnvelope(fx.plan,{root:fx.root,candidateSvgRef:fx.candidateSvgRef,profileAudits:fx.profileAudits});
const mutateAudit=(fx,sizeClass,mutate)=>{
  const row=fx.profileAudits.find(a=>a.sizeClass===sizeClass),measurement=JSON.parse(fs.readFileSync(path.join(fx.root,...row.measurementRef.path.split('/')),'utf8'));
  mutate(measurement);
  fs.writeFileSync(path.join(fx.root,...row.measurementRef.path.split('/')),canonicalJson(measurement));
  row.measurementRef=fileRef(fx.root,row.measurementRef.path);
};
const addWorkerEvidence=(fx,sizeClass,kind,patch={})=>{
  const planned=fx.plan.profiles.find(v=>v.sizeClass===sizeClass),row=fx.profileAudits.find(v=>v.sizeClass===sizeClass);
  const audit={schemaVersion:`DISPLAY_PROFILE_${kind}_AUDIT_v1`,status:'PASS',questionUid:fx.uid,sizeClass,candidateSvgRef:fx.candidateSvgRef,candidateSvgSha256:fx.candidateSvgRef.sha256,inputIdentitySha256:fx.plan.inputIdentitySha256,displayScale:planned.displayScale,...patch};
  const ref=write(fx.root,`worker/${kind}-${sizeClass}.json`,canonicalJson(audit));
  mutateAudit(fx,sizeClass,m=>{if(kind==='GRAPH'){m.graphRequired=true;m.graphStatus='PASS';m.graphEvidenceRef=ref;}else{m.topologyRequired=true;m.topologyStatus='PASS';m.topologyEvidenceRef=ref;}});
  return ref;
};

test('logic: preflight remains provisional and independently selects the smallest passing profile',t=>{
  const fx=fixture(t),plan=fx.plan;
  assert.equal(plan.status,'PLANNED');
  assert.equal(plan.plannedSizeClass,'large');
  assert.equal(plan.profiles.find(v=>v.sizeClass==='medium').supportStatus,'NOT_AUDITED');
  const envelope=qualify(fx);
  assert.equal(envelope.status,'PASS');
  assert.equal(envelope.sizeClass,'large');
  assert.equal(envelope.policyChange.from,'medium');
  assert.equal(envelope.policyChange.to,'large');
  assert.equal(envelope.expectedMinimumCssFontPx,11.25);
  assert.equal(envelope.profiles.find(v=>v.sizeClass==='medium').supportStatus,'FAIL');
  assert.ok(envelope.profiles.find(v=>v.sizeClass==='medium').finalAudit.errors.includes('FONT_FLOOR_FAIL'));
  assert.equal(envelope.selectedProfile.computedStyle.maxHeight,'180px');
});

test('logic: full-only success does not qualify medium or silently change to full',t=>{
  const fx=fixture(t,{minimumByClass:{small:6.56,medium:9.06,large:9.5,full:20}});
  const preflight=JSON.parse(fs.readFileSync(path.join(fx.root,...fx.preflightEvidence.measurementRef.path.split('/')),'utf8')).observation;
  fx.plan=planDisplayEnvelope({root:fx.root,questionUid:fx.uid,requestedSizeClass:'full',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:preflight,preflightEvidence:fx.preflightEvidence,archiveEngineSha256:fx.policyRefs[0].ref.sha256,sourceRef:fx.sourceRef,solutionRef:fx.solutionRef,policyRefs:fx.policyRefs});
  const envelope=qualify(fx);
  assert.equal(envelope.sizeClass,'full');
  assert.equal(envelope.policyChange,null);
  assert.equal(envelope.selectedProfile.computedStyle.maxHeight,'none');
  assert.equal(envelope.profiles.find(v=>v.sizeClass==='medium').supportStatus,'FAIL');
});

test('logic: all profile floors below threshold remain unsupported',t=>{
  const fx=fixture(t,{minimumByClass:{small:8,medium:8.5,large:9,full:10}}),envelope=qualify(fx);
  assert.equal(envelope.status,'UNSUPPORTED_DISPLAY_ENVELOPE');
  assert.equal(envelope.sizeClass,null);
  assert.ok(envelope.errors.includes('NO_PROFILE_PASSED_FINAL_CANDIDATE_AUDITS'));
});

test('logic: final candidate inventory and graph/topology/stroke gates fail closed',t=>{
  const fx=fixture(t,{patches:{large:{labelMeasurements:[{id:'A-name',finalViewportCssFontPx:11.25}],graphRequired:true,graphStatus:'FAIL',topologyRequired:true,topologyStatus:'FAIL'}}}),envelope=qualify(fx);
  const large=envelope.profiles.find(v=>v.sizeClass==='large');
  assert.notEqual(envelope.sizeClass,'large');
  assert.equal(large.supportStatus,'FAIL');
  assert.ok(large.finalAudit.errors.includes('FINAL_LABEL_INVENTORY_MISMATCH'));
  assert.ok(large.finalAudit.errors.includes('GRAPH_PROFILE_AUDIT_FAIL'));
  assert.ok(large.finalAudit.errors.includes('TOPOLOGY_PROFILE_AUDIT_FAIL'));
});

test('logic: graph and topology worker records bind the same candidate SVG and display scale',t=>{
  const graph=fixture(t);addWorkerEvidence(graph,'large','GRAPH',{candidateSvgSha256:'sha256:'+'0'.repeat(64)});
  const graphResult=qualify(graph).profiles.find(v=>v.sizeClass==='large');
  assert.equal(graphResult.supportStatus,'FAIL');
  assert.ok(graphResult.finalAudit.errors.includes('GRAPH_PROFILE_EVIDENCE_SVG_MISMATCH'));

  const topology=fixture(t);addWorkerEvidence(topology,'full','TOPOLOGY',{displayScale:0.5});
  const topologyResult=qualify(topology).profiles.find(v=>v.sizeClass==='full');
  assert.equal(topologyResult.supportStatus,'FAIL');
  assert.ok(topologyResult.finalAudit.errors.includes('TOPOLOGY_PROFILE_EVIDENCE_SCALE_MISMATCH'));
});

test('logic: stroke measurements bind the final candidate and profile',t=>{
  const fx=fixture(t);mutateAudit(fx,'large',m=>{m.strokeMeasurements[0].candidateSvgSha256='sha256:'+'0'.repeat(64);});
  const profile=qualify(fx).profiles.find(v=>v.sizeClass==='large');
  assert.equal(profile.supportStatus,'FAIL');
  assert.ok(profile.finalAudit.errors.includes('STROKE_PROFILE_AUDIT_FAIL'));
});

test('logic: provisional evidence rejects synthetic or non-Playwright Archive measurements',()=>{
  const base={status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',questionUid:'fixture-exam|1',sourceRef:{path:'archive/source.js',bytes:23,sha256:'sha256:'+'a'.repeat(64)},qBoxRect:rect(820,460),solutionMetaRect:rect(790,370),profiles:classes.map(profile)};
  const engineRef={path:'policy/engine.html',bytes:1,sha256:'sha256:'+'c'.repeat(64)};
  const args={questionUid:'fixture-exam|1',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,archiveEngineSha256:engineRef.sha256,sourceRef:base.sourceRef,solutionRef:{path:'solution.txt',bytes:1,sha256:'sha256:'+'b'.repeat(64)},policyRefs:[{name:'archive-engine',ref:engineRef}]};
  assert.throws(()=>planDisplayEnvelope({...args,observation:{...base,synthetic:true}}),/ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED/);
  assert.throws(()=>planDisplayEnvelope({...args,observation:{...base,runtime:'fixture'}}),/ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED/);
});

test('logic: archive-engine policy hash and candidate SVG intrinsic/viewBox match the plan',t=>{
  const fx=fixture(t);
  const mismatchedPolicy={...fx.plan,archiveEngineSha256:'sha256:'+'0'.repeat(64)};
  assert.throws(()=>qualifyDisplayEnvelope(mismatchedPolicy,{root:fx.root,candidateSvgRef:fx.candidateSvgRef,profileAudits:fx.profileAudits}),/DISPLAY_ENVELOPE_ARCHIVE_ENGINE_POLICY_MISMATCH/);
  const mismatch=fixture(t,{candidateSize:{width:400,height:320}});
  assert.throws(()=>qualify(mismatch),/DISPLAY_ENVELOPE_CANDIDATE_INTRINSIC_MISMATCH/);
});

test('logic: the measured solution-meta content box is bound as the CSS scaling denominator',t=>{
  const fx=fixture(t);
  assert.equal(fx.plan.container.solutionMetaRect.width,790);
  assert.equal(fx.plan.container.solutionMetaContentWidth,772);
  const preflight=JSON.parse(fs.readFileSync(path.join(fx.root,...fx.preflightEvidence.measurementRef.path.split('/')),'utf8'));
  preflight.observation.solutionMetaContentWidth=790;
  fs.writeFileSync(path.join(fx.root,...fx.preflightEvidence.measurementRef.path.split('/')),canonicalJson(preflight));
  fx.preflightEvidence.measurementRef=fileRef(fx.root,fx.preflightEvidence.measurementRef.path);
  assert.throws(()=>planDisplayEnvelope({root:fx.root,questionUid:fx.uid,requestedSizeClass:'medium',intrinsicSvg:intrinsic,candidateLabelInventory:labelInventory,observation:preflight.observation,preflightEvidence:fx.preflightEvidence,archiveEngineSha256:fx.policyRefs[0].ref.sha256,sourceRef:fx.sourceRef,solutionRef:fx.solutionRef,policyRefs:fx.policyRefs}),/ACTUAL_ARCHIVE_PREFLIGHT_MEASUREMENT_MISMATCH/);
});

test('logic: final support rereads and verifies the actual Archive preflight refs',t=>{
  const staleHash=fixture(t),mutatedPlan={...staleHash.plan,preflightEvidenceSha256:'sha256:'+'0'.repeat(64)};
  assert.throws(()=>qualifyDisplayEnvelope(mutatedPlan,{root:staleHash.root,candidateSvgRef:staleHash.candidateSvgRef,profileAudits:staleHash.profileAudits}),/DISPLAY_ENVELOPE_PREFLIGHT_IDENTITY_INVALID/);
  const staleBytes=fixture(t),screenshot=staleBytes.preflightEvidence.screenshotRef;
  fs.appendFileSync(path.join(staleBytes.root,...screenshot.path.split('/')),Buffer.from([0]));
  assert.throws(()=>qualify(staleBytes),/STALE_FILE/);
});

test('logic: every expected label requires a finite final viewport CSS font metric',t=>{
  for(const badValue of [null,'not-a-number',0]){
    const fx=fixture(t);
    mutateAudit(fx,'large',m=>{m.labelMeasurements[1].finalViewportCssFontPx=badValue;});
    const large=qualify(fx).profiles.find(v=>v.sizeClass==='large');
    assert.equal(large.supportStatus,'FAIL');
    assert.ok(large.finalAudit.errors.includes('FINAL_LABEL_FONT_METRIC_MISSING_OR_NONFINITE'));
  }
  const missing=fixture(t);
  mutateAudit(missing,'large',m=>{m.labelMeasurements=m.labelMeasurements.slice(0,1);});
  assert.ok(qualify(missing).profiles.find(v=>v.sizeClass==='large').finalAudit.errors.includes('FINAL_LABEL_INVENTORY_MISMATCH'));
});

test('logic: candidate SHA, source, solution and policy identity mutations cannot support a profile',t=>{
  const mutations=[
    ['candidate SVG SHA',m=>{m.candidateSvgSha256='sha256:'+'0'.repeat(64);},'PROFILE_CANDIDATE_SVG_BINDING_MISMATCH'],
    ['candidate SVG ref',m=>{m.candidateSvgRef={...m.candidateSvgRef,sha256:'sha256:'+'0'.repeat(64)};},'PROFILE_CANDIDATE_SVG_BINDING_MISMATCH'],
    ['source',m=>{m.sourceRef={...m.sourceRef,sha256:'sha256:'+'0'.repeat(64)};},'PROFILE_SOURCE_SOLUTION_POLICY_IDENTITY_MISMATCH'],
    ['solution',m=>{m.solutionRef={...m.solutionRef,sha256:'sha256:'+'0'.repeat(64)};},'PROFILE_SOURCE_SOLUTION_POLICY_IDENTITY_MISMATCH'],
    ['policy',m=>{m.policyRefs=[{...m.policyRefs[0],ref:{...m.policyRefs[0].ref,sha256:'sha256:'+'0'.repeat(64)}}];},'PROFILE_SOURCE_SOLUTION_POLICY_IDENTITY_MISMATCH'],
    ['identity digest',m=>{m.inputIdentitySha256='sha256:'+'0'.repeat(64);},'PROFILE_SOURCE_SOLUTION_POLICY_IDENTITY_MISMATCH']
  ];
  for(const [name,mutate,errorCode] of mutations){
    const fx=fixture(t);mutateAudit(fx,'large',mutate);
    const profile=qualify(fx).profiles.find(v=>v.sizeClass==='large');
    assert.equal(profile.supportStatus,'FAIL',name);
    assert.ok(profile.finalAudit.errors.includes(errorCode),name);
  }
});

test('logic: synthetic and wrong-runtime final audits cannot pass even with good numeric metrics',t=>{
  for(const [field,value,code] of [['synthetic',true,'PROFILE_SYNTHETIC_EVIDENCE_REJECTED'],['runtime','fixture','PROFILE_PLAYWRIGHT_RUNTIME_REQUIRED']]){
    const fx=fixture(t);mutateAudit(fx,'full',m=>{m[field]=value;});
    const row=qualify(fx).profiles.find(v=>v.sizeClass==='full');
    assert.equal(row.supportStatus,'FAIL');assert.ok(row.finalAudit.errors.includes(code));
  }
});

test('logic: raw measurement and screenshot refs are mandatory, unique, hash-bound PNG evidence',t=>{
  const missing=fixture(t);missing.profileAudits[3].measurementRef=null;
  const failed=qualify(missing).profiles.find(v=>v.sizeClass==='full');
  assert.equal(failed.supportStatus,'FAIL');assert.ok(failed.finalAudit.errors.includes('PROFILE_MEASUREMENT_REF_REQUIRED'));

  const noPng=fixture(t);mutateAudit(noPng,'full',m=>{m.screenshotRef={path:'capture/missing.png',bytes:1,sha256:'sha256:'+'0'.repeat(64)};});
  const broken=qualify(noPng).profiles.find(v=>v.sizeClass==='full');
  assert.equal(broken.supportStatus,'FAIL');
  assert.ok(broken.finalAudit.errors.includes('PROFILE_SCREENSHOT_REF_INVALID'));

  const stub=fixture(t),stubBytes=Buffer.alloc(24);Buffer.from([137,80,78,71,13,10,26,10]).copy(stubBytes,0);stubBytes.writeUInt32BE(13,8);stubBytes.write('IHDR',12,'ascii');stubBytes.writeUInt32BE(1,16);stubBytes.writeUInt32BE(1,20);
  const stubRef=write(stub.root,'capture/header-only.png',stubBytes);mutateAudit(stub,'full',m=>{m.screenshotRef=stubRef;m.screenshotViewport={width:1,height:1};});
  assert.ok(qualify(stub).profiles.find(v=>v.sizeClass==='full').finalAudit.errors.includes('PROFILE_SCREENSHOT_PNG_INVALID'));

  const reused=fixture(t),largeMeasure=reused.profileAudits.find(a=>a.sizeClass==='large').measurementRef;
  const largeAudit=JSON.parse(fs.readFileSync(path.join(reused.root,...largeMeasure.path.split('/')),'utf8'));
  mutateAudit(reused,'full',m=>{m.screenshotRef=largeAudit.screenshotRef;m.screenshotViewport=largeAudit.screenshotViewport;});
  const duplicate=qualify(reused);
  assert.ok(duplicate.profiles.find(v=>v.sizeClass==='full').finalAudit.errors.includes('PROFILE_SCREENSHOT_REF_REUSED'));
});

function actualCaptureRef(fx,patch={}){
  const envelope=qualify(fx),pngRef=write(fx.root,'actual/archive-context.png',fakePng(1440,1000)),archiveAssetPath='assets/images/fixture-exam/q01-solution.svg',targetId='fixture-asset';
  const target={id:targetId,src:`http://archive.invalid/archive/${archiveAssetPath}`,loaded:true,sizeClass:'large',naturalWidth:intrinsic.width,naturalHeight:intrinsic.height,rect:rect(216,180),computedStyle:{maxWidth:'92%',maxHeight:'180px',objectFit:'contain',transform:'none'},solutionMetaRect:rect(790,430),solutionMetaContentWidth:772,qBoxRect:rect(820,470)};
  const archiveRowRef=write(fx.root,'actual/archive-row.json',canonicalJson({status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',state:{targets:[target]},responses:[{url:target.src,status:200,sha256:fx.candidateSvgRef.sha256.slice(7)}]}));
  const actual={schemaVersion:'DISPLAY_ARCHIVE_ACTUAL_v1',status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'Chromium fixture',questionUid:fx.uid,sizeClass:'large',candidateSvgRef:fx.candidateSvgRef,candidateSvgSha256:fx.candidateSvgRef.sha256,naturalWidth:intrinsic.width,naturalHeight:intrinsic.height,sourceRef:fx.sourceRef,solutionRef:fx.solutionRef,policyRefs:envelope.policyRefs,inputIdentitySha256:envelope.inputIdentitySha256,screenshotRef:pngRef,screenshotViewport:{width:1440,height:1000},archiveRowRef,archiveAssetPath,targetId,qBoxRect:rect(820,470),solutionMetaRect:rect(790,430),solutionMetaContentWidth:772,imageRect:rect(216,180),computedStyle:{maxWidth:'92%',maxHeight:'180px',objectFit:'contain',transform:'none'},minimumCssFontPx:11.25,...patch};
  const actualRef=write(fx.root,'actual/archive-capture.json',canonicalJson(actual));
  return {envelope,actualRef};
}

test('logic: final actual Archive comparison reads bound runtime, lineage and raw capture assets',t=>{
  const fx=fixture(t),{envelope,actualRef}=actualCaptureRef(fx);
  assert.equal(compareActualDisplayEnvelope(envelope,{root:fx.root,actualRef}).status,'PASS');
  const mutate=patch=>{
    const bytes=fs.readFileSync(path.join(fx.root,...actualRef.path.split('/'))),record=JSON.parse(bytes.toString('utf8'));
    const next=write(fx.root,'actual/mutated-'+Math.random().toString(16).slice(2)+'.json',canonicalJson({...record,...patch}));
    return compareActualDisplayEnvelope(envelope,{root:fx.root,actualRef:next});
  };
  const wrongRuntime=mutate({runtime:'fixture'});
  assert.ok(wrongRuntime.errors.includes('ACTUAL_DISPLAY_PLAYWRIGHT_RUNTIME_REQUIRED'));
  const wrongIdentity=mutate({solutionRef:{...fx.solutionRef,sha256:'sha256:'+'0'.repeat(64)}});
  assert.ok(wrongIdentity.errors.includes('ACTUAL_DISPLAY_SOURCE_SOLUTION_POLICY_MISMATCH'));
  const missingScreenshot=mutate({screenshotRef:null});
  assert.ok(missingScreenshot.errors.includes('ACTUAL_DISPLAY_SCREENSHOT_REF_REQUIRED'));
});

test('logic: actual loaded image rect, container width, size class and computed policy match selected profile',t=>{
  const fx=fixture(t),envelope=qualify(fx),base=actualCaptureRef(fx).actualRef;
  const original=JSON.parse(fs.readFileSync(path.join(fx.root,...base.path.split('/')),'utf8'));
  const actualRef=write(fx.root,'actual/mutated-geometry.json',canonicalJson({...original,sizeClass:'full',imageRect:rect(384,320),computedStyle:{...original.computedStyle,maxHeight:'none'}}));
  const rejected=compareActualDisplayEnvelope(envelope,{root:fx.root,actualRef});
  assert.equal(rejected.status,'FAIL');
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_SIZE_CLASS_MISMATCH'));
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_WIDTH_DIFFERS_FROM_PREFLIGHT'));
  assert.ok(rejected.errors.includes('ACTUAL_DISPLAY_POLICY_DIFFERS_FROM_PREFLIGHT:maxHeight'));
});
