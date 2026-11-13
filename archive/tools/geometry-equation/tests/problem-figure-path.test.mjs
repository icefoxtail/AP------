import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {bytesSha} from '../../pipeline-core/canonical.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {loadProblemManifest,verifyProblemEvidence,selectChangedProblemManifests} from '../production/problem-figure-runner.mjs';
import {measureArchiveTypographyPolicy,captureArchiveCandidate,measureProblemTypographyPolicy,captureProblemCandidate,PROBLEM_CAPTURE_VIEWPORTS} from '../production/construction-archive-capture-v1.mjs';
import {renderPlan} from '../production/render-plan.mjs';
import {verifyPublishedProblemEnvelope} from '../production/problem-output-envelope.mjs';
import {extractFontNamePairs,matchesFontNamePair} from '../production/font-name-table.mjs';
const outputContract=createRequire(import.meta.url)('../../../archive2-output-contract.js');

const prefix='archive/tools/geometry-equation/ops/problem-figures/';
function fixture(t){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'problem-manifest-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const write=(name,data)=>{const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data);return bytesSha(fs.readFileSync(target));};
  const sourcePath='archive/exams/original/middle/source.js',image='assets/images/source/q1.png';
  const sourceSha256=write(sourcePath,'window.questionBank='+JSON.stringify([{id:1,content:'주어진 삼각형',image,answer:'보호 정답',solution:'보호 해설',solutionImage:'keep.svg'},{id:2,content:'다른 문제'}])+';');
  const sourceImageSha256=write('archive/'+image,'unit-fixture-original-image');
  const manifestPath=prefix+'test/manifest.json',planPath='q1/plan.json';
  const planSha256=write(prefix+'test/'+planPath,JSON.stringify({capability:'construction-spike-v1',caption:'주어진 삼각형',mathPlan:{}}));
  const manifest={schemaVersion:'PROBLEM_FIGURE_MANIFEST_v1',items:[{item:{sourcePath,ordinal:1,dir:'q1',surface:'PROBLEM_VISUAL'},planPath,sourceSha256,sourceImageSha256,planSha256}]};
  const save=()=>write(manifestPath,JSON.stringify(manifest));save();
  return {root,write,manifestPath,manifest,save};
}

test('hash-bound problem manifest reads only its source, original image and adjacent plan',t=>{
  const f=fixture(t),loaded=loadProblemManifest(f.manifestPath,{root:f.root});
  assert.equal(loaded.items[0].item.surface,'PROBLEM_VISUAL');assert.equal(loaded.inputs.length,4);
  assert.match(loaded.manifestSha256,/^sha256:[a-f0-9]{64}$/);
});
test('problem manifest rejects solution scope, duplicate targets, unbound bytes and arbitrary fields',t=>{
  const f=fixture(t),load=()=>loadProblemManifest(f.manifestPath,{root:f.root}),entry=f.manifest.items[0];
  entry.item.surface='SOLUTION_VISUAL';f.save();assert.throws(load,/PROBLEM_MANIFEST_ITEM_INVALID/);entry.item.surface='PROBLEM_VISUAL';
  entry.command='arbitrary';f.save();assert.throws(load,/PROBLEM_MANIFEST_ITEM_SCHEMA/);delete entry.command;
  f.manifest.items.push({...entry});f.save();assert.throws(load,/PROBLEM_MANIFEST_DUPLICATE/);f.manifest.items.pop();
  entry.planSha256='sha256:'+'0'.repeat(64);f.save();assert.throws(load,/PROBLEM_MANIFEST_HASH_MISMATCH/);
});
test('problem manifest rejects path traversal, absolute paths and symlink escapes',t=>{
  const f=fixture(t),load=()=>loadProblemManifest(f.manifestPath,{root:f.root});
  for(const planPath of ['../plan.json','/tmp/plan.json','q1\\plan.json','q1/../../plan.json']){f.manifest.items[0].planPath=planPath;f.save();assert.throws(load,/PROBLEM_PLAN_PATH_INVALID/);}
  f.manifest.items[0].planPath='q1/link.json';f.save();
  fs.symlinkSync(path.join(f.root,prefix+'test/q1/plan.json'),path.join(f.root,prefix+'test/q1/link.json'));
  assert.throws(load,/PROBLEM_MANIFEST_PATH_ESCAPE/);
  assert.throws(()=>loadProblemManifest('/tmp/manifest.json',{root:f.root}),/PROBLEM_MANIFEST_SCOPE/);
});
test('original PNG mutation is rejected independently from source and plan hashes',t=>{
  const f=fixture(t);f.write('archive/assets/images/source/q1.png','changed-original');
  assert.throws(()=>loadProblemManifest(f.manifestPath,{root:f.root}),/PROBLEM_SOURCE_IMAGE_HASH_MISMATCH/);
});
test('PR scope selects changed manifest families and never re-renders an unrelated historical source',()=>{
  const a=prefix+'a/manifest.json',b=prefix+'b/manifest.json';
  assert.deepEqual(selectChangedProblemManifests([a,b],[prefix+'a/q2/plan.json']),[a]);
  assert.deepEqual(selectChangedProblemManifests([a,b],[b]),[b]);
  assert.deepEqual(selectChangedProblemManifests([a,b],['archive/tools/geometry-equation/production/render-plan.mjs']),[]);
});

const sourcePath='archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js';
const sourceId=path.basename(sourcePath,'.js');
const options=surface=>({identity:assetIdentity(sourceId+'|2',surface),sourcePath,ordinal:2,requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},runId:'problem-guard-'+crypto.randomUUID()});
test('solution APIs keep rejecting problem identity before any browser or file output',async()=>{
  for(const api of [measureArchiveTypographyPolicy,captureArchiveCandidate]){
    const result=await api(options('PROBLEM_VISUAL'));
    assert.equal(result.status,'ARCHIVE_INPUT_INVALID');assert.equal(result.detail.reason,'SURFACE_NOT_SOLUTION_VISUAL');
  }
});
test('problem APIs reject solution identity and missing source image before browser work',async()=>{
  for(const api of [measureProblemTypographyPolicy,captureProblemCandidate]){
    const result=await api(options('SOLUTION_VISUAL'));
    assert.equal(result.status,'ARCHIVE_INPUT_INVALID');assert.equal(result.detail.reason,'SURFACE_NOT_PROBLEM_VISUAL');
    const missing=options('PROBLEM_VISUAL');missing.identity=assetIdentity(sourceId+'|1','PROBLEM_VISUAL');missing.ordinal=1;
    const rejected=await api(missing);assert.equal(rejected.status,'ARCHIVE_INPUT_INVALID');assert.equal(rejected.detail.reason,'PROBLEM_SOURCE_IMAGE_REQUIRED');
  }
});
test('problem opt-in identity and refusals never create a solution SVG or solution observation packet',async t=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'problem-render-'));t.after(()=>fs.rmSync(out,{recursive:true,force:true}));
  const item={sourcePath,ordinal:2,dir:'figure',surface:'PROBLEM_VISUAL'};
  const result=await renderPlan({item,plan:{status:'UNSUPPORTED',reason:'technical refusal'},outDir:out});
  assert.equal(result.status,'UNSUPPORTED');assert.equal(result.identity.surface,'PROBLEM_VISUAL');assert.equal(fs.existsSync(path.join(out,'figure-solution.svg')),false);
  const packet=await renderPlan({item,plan:{},outDir:out,packetDir:out});
  assert.equal(packet.status,'FAILED');assert.match(packet.detail,/PROBLEM_SOLUTION_OBSERVER_PACKET_UNSUPPORTED/);
  const invalid=await renderPlan({item:{...item,surface:'other'},plan:{},outDir:out});
  assert.equal(invalid.status,'FAILED');assert.match(invalid.detail,/INVALID_RENDER_SURFACE/);
});
test('problem evidence verifier rejects status-only, caller-injected and missing-raw evidence',()=>{
  assert.throws(()=>verifyProblemEvidence({capture:{status:'ARCHIVE_BOUND'}}),/PROBLEM_BOUND_CAPTURE_REQUIRED/);
  const state={identity:{surface:'PROBLEM_VISUAL'},composed:{status:'COMPOSED'},capture:{status:'ARCHIVE_BOUND',evidenceIntegrity:'CALLER_HOOK_PRESENT',productionAuthorized:false}};
  assert.throws(()=>verifyProblemEvidence(state),/PROBLEM_BOUND_CAPTURE_REQUIRED/);
  state.capture.evidenceIntegrity='NO_CALLER_HOOK';assert.throws(()=>verifyProblemEvidence(state),/PROBLEM_CAPTURE_CHECK_FAILED/);
});
test('problem viewport inventory includes exact desktop, phone and tablet sizes',()=>{
  assert.deepEqual(PROBLEM_CAPTURE_VIEWPORTS.map(({width,height})=>[width,height]),[[1440,1000],[390,844],[768,1024]]);
  assert.ok(Object.isFrozen(PROBLEM_CAPTURE_VIEWPORTS));
});

test('problem reader consumes the official envelope and rejects missing IDs, wrong owner and changed source questions',async()=>{
  const bank=[{id:1,content:'한글 문제'}],sourceId='original/middle/fixture.js';
  const envelope=await outputContract.createOutputEnvelope({sourceKind:'archive2-original',sourceId,mode:'exam',questionCount:1,questionUids:[null],meta:{sourceArchiveFile:sourceId,qpp:4},questions:bank});
  const url=new URL('http://127.0.0.1/archive/engine.html');
  for(const [key,value] of Object.entries({archive2Context:'archive2',archive2OutputContract:envelope.contractVersion,outputRequestId:envelope.outputRequestId,outputOwnerId:envelope.ownerId,mode:'exam',q:'1'}))url.searchParams.set(key,value);
  await assert.doesNotReject(verifyPublishedProblemEnvelope(envelope,{bank,sourceId,url:url.href}));
  const missing=new URL(url);missing.searchParams.delete('outputRequestId');
  await assert.rejects(verifyPublishedProblemEnvelope(envelope,{bank,sourceId,url:missing.href}),/PROBLEM_OUTPUT_ENVELOPE_BINDING_MISMATCH/);
  const wrongOwner=new URL(url);wrongOwner.searchParams.set('outputOwnerId',crypto.randomUUID());
  await assert.rejects(verifyPublishedProblemEnvelope(envelope,{bank,sourceId,url:wrongOwner.href}),/PROBLEM_OUTPUT_ENVELOPE_BINDING_MISMATCH/);
  await assert.rejects(outputContract.validateOutputEnvelope(envelope,{ownerId:crypto.randomUUID()}),/ownerId/);
  await assert.rejects(verifyPublishedProblemEnvelope({...envelope,outputRequestId:''},{bank,sourceId,url:url.href}),/outputRequestId/);
  await assert.rejects(verifyPublishedProblemEnvelope(envelope,{bank:[{id:1,content:'다른 문제'}],sourceId,url:url.href}),/PROBLEM_OUTPUT_ENVELOPE_BINDING_MISMATCH/);
});

test('font identity comes from exact paired sfnt names, not CSS family aliases or prefixes',()=>{
  // Synthetic parser unit fixture only; this is not measured browser/font evidence.
  const names=[[1,'Noto Sans KR Thin'],[6,'NotoSansKR-Thin'],[16,'Noto Sans KR']];
  const strings=names.map(([,s])=>Buffer.from(s,'utf16le').swap16()),start=6+12*names.length,table=Buffer.alloc(start+strings.reduce((n,b)=>n+b.length,0));
  table.writeUInt16BE(names.length,2);table.writeUInt16BE(start,4);let offset=0;
  names.forEach(([id],i)=>{const at=6+12*i;[3,1,1033,id,strings[i].length,offset].forEach((v,k)=>table.writeUInt16BE(v,at+2*k));strings[i].copy(table,start+offset);offset+=strings[i].length;});
  const bytes=Buffer.alloc(28+table.length);bytes.writeUInt32BE(0x00010000,0);bytes.writeUInt16BE(1,4);bytes.write('name',12);bytes.writeUInt32BE(28,20);bytes.writeUInt32BE(table.length,24);table.copy(bytes,28);
  const pairs=extractFontNamePairs(bytes);assert.deepEqual(pairs,[{platform:3,encoding:1,language:1033,familyName:'Noto Sans KR Thin',postScriptName:'NotoSansKR-Thin'}]);
  const actual={familyName:'Noto Sans KR Thin',postScriptName:'NotoSansKR-Thin',glyphCount:7,isCustomFont:false};
  assert.equal(matchesFontNamePair(actual,pairs),true);
  for(const change of [{familyName:'Noto Sans KR'},{familyName:'Noto Sans KR Thin Extra'},{postScriptName:'NotoSansKR-Other'},{glyphCount:0},{isCustomFont:true}])assert.equal(matchesFontNamePair({...actual,...change},pairs),false);
  assert.throws(()=>extractFontNamePairs(bytes.subarray(0,bytes.length-1)),/FONT_NAME_TABLE_INVALID/);
});
