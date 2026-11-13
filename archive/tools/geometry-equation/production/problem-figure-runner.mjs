// A fixed production renderer, not an arbitrary CI command runner. Only hash-bound, repository-local
// problem manifests are accepted. Browser evidence remains unqualified until independent visual review.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bytesSha,objectSha} from '../../pipeline-core/canonical.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {SOURCE_QUESTION_ID_PATTERN} from '../../pipeline-core/question-uid.mjs';
import {requestedProfileTypographyPolicy} from './display-envelope.mjs';
import {validateProblemReaderEvidence} from './problem-output-envelope.mjs';
import {verifyMeasuredLabelInventory} from '../nested-panel-measurement.mjs';

const repo=fileURLToPath(new URL('../../../../',import.meta.url));
const PREFIX='archive/tools/geometry-equation/ops/problem-figures/';
const HASH=/^sha256:[0-9a-f]{64}$/;
const keys=(value,allowed)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(k=>allowed.includes(k));
const fail=code=>{throw Error(code);};

function readLocal(root,relative){
  if(typeof relative!=='string'||relative.startsWith('/')||relative.includes('\\')||relative.includes('\0')||relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('PROBLEM_MANIFEST_PATH_INVALID');
  const absolute=path.resolve(root,relative),real=fs.realpathSync(absolute),realRoot=fs.realpathSync(root);
  if(real!==absolute||!real.startsWith(realRoot+path.sep)||!fs.statSync(real).isFile())fail('PROBLEM_MANIFEST_PATH_ESCAPE');
  return {path:relative,absolute,bytes:fs.readFileSync(real)};
}

/** Pure input validation and hash readback; no browser, output files or external service calls. */
export function loadProblemManifest(manifestPath,{root=repo}={}){
  if(typeof manifestPath!=='string'||!manifestPath.startsWith(PREFIX)||!manifestPath.endsWith('/manifest.json'))fail('PROBLEM_MANIFEST_SCOPE');
  const manifestFile=readLocal(root,manifestPath),manifest=JSON.parse(manifestFile.bytes);
  if(!keys(manifest,['schemaVersion','items'])||manifest.schemaVersion!=='PROBLEM_FIGURE_MANIFEST_v1'||!Array.isArray(manifest.items)||!manifest.items.length||manifest.items.length>100)fail('PROBLEM_MANIFEST_SCHEMA');
  const directory=path.posix.dirname(manifestPath),seen=new Set(),names=new Set(),inputs=[manifestFile];
  const items=manifest.items.map(entry=>{
    if(!keys(entry,['item','planPath','sourceSha256','planSha256','sourceImageSha256'])||!keys(entry.item,['sourcePath','ordinal','dir','surface']))fail('PROBLEM_MANIFEST_ITEM_SCHEMA');
    const item=entry.item;
    if(item.surface!=='PROBLEM_VISUAL'||!/^[-A-Za-z0-9_]{1,64}$/.test(item.dir)||typeof item.sourcePath!=='string'||!item.sourcePath.startsWith('archive/exams/original/')||!item.sourcePath.endsWith('.js')||!(Number.isSafeInteger(item.ordinal)&&item.ordinal>=1||typeof item.ordinal==='string'&&SOURCE_QUESTION_ID_PATTERN.test(item.ordinal)))fail('PROBLEM_MANIFEST_ITEM_INVALID');
    if(![entry.sourceSha256,entry.planSha256,entry.sourceImageSha256].every(v=>HASH.test(v)))fail('PROBLEM_MANIFEST_HASH_REQUIRED');
    const uid=item.sourcePath+'|'+item.ordinal;
    if(seen.has(uid)||names.has(item.dir))fail('PROBLEM_MANIFEST_DUPLICATE');seen.add(uid);names.add(item.dir);
    if(typeof entry.planPath!=='string'||entry.planPath.startsWith('/')||entry.planPath.includes('\\')||entry.planPath.split('/').some(p=>!p||p==='.'||p==='..')||!entry.planPath.endsWith('.json'))fail('PROBLEM_PLAN_PATH_INVALID');
    const source=readLocal(root,item.sourcePath),planFile=readLocal(root,directory+'/'+entry.planPath);
    if(bytesSha(source.bytes)!==entry.sourceSha256||bytesSha(planFile.bytes)!==entry.planSha256)fail('PROBLEM_MANIFEST_HASH_MISMATCH');
    const bank=loadBank(source.bytes.toString('utf8')),question=bank?.find(q=>q.id===item.ordinal);
    if(typeof question?.image!=='string'||!question.image.startsWith('assets/images/'))fail('PROBLEM_SOURCE_IMAGE_REQUIRED');
    const originalImage=readLocal(root,'archive/'+question.image);
    if(bytesSha(originalImage.bytes)!==entry.sourceImageSha256)fail('PROBLEM_SOURCE_IMAGE_HASH_MISMATCH');
    const plan=JSON.parse(planFile.bytes);
    if(!plan||typeof plan!=='object'||Array.isArray(plan)||typeof plan.capability!=='string'||typeof plan.caption!=='string'||!plan.caption.trim()||plan.status)fail('PROBLEM_PLAN_SCHEMA');
    inputs.push(source,planFile,originalImage);
    return {item:{...item},plan,planPath:planFile.path,sourceImagePath:originalImage.path};
  });
  return {manifestPath,manifestSha256:bytesSha(manifestFile.bytes),items,inputs:inputs.map(f=>({path:f.path,sha256:bytesSha(f.bytes)}))};
}

function readEvidence(root,relative,sha){
  if(typeof relative!=='string'||!relative.startsWith('.tmp/archive/'))fail('PROBLEM_EVIDENCE_SCOPE');
  if(!HASH.test(sha))fail('PROBLEM_EVIDENCE_HASH_REQUIRED');
  const file=readLocal(root,relative);
  if(bytesSha(file.bytes)!==sha)fail('PROBLEM_EVIDENCE_HASH_MISMATCH');
  return file.bytes;
}

/** Re-read the actual production output and raw browser artifacts; never accept result status alone. */
export function verifyProblemEvidence(state,{root=repo}={}){
  const capture=state?.capture,composed=state?.composed,identity=state?.identity;
  if(identity?.surface!=='PROBLEM_VISUAL'||capture?.status!=='ARCHIVE_BOUND'||composed?.status!=='COMPOSED'||capture.evidenceIntegrity!=='NO_CALLER_HOOK'||capture.productionAuthorized!==false)fail('PROBLEM_BOUND_CAPTURE_REQUIRED');
  if(!capture.checks||!['network','assetResponse','bankResponse','naturalSize','surface','sizeClass','displayScale','layout'].every(k=>capture.checks[k]==='PASS'))fail('PROBLEM_CAPTURE_CHECK_FAILED');
  if(capture.protectedParity?.status!=='PASS'||JSON.stringify(capture.protectedParity.changedFields)!==JSON.stringify(['image','imageSize','imageAlt']))fail('PROBLEM_PROTECTED_PARITY_REQUIRED');
  const svg=readEvidence(root,capture.paths?.asset,capture.lineage?.l1SvgSha256);
  if(bytesSha(svg)!==composed.lineage?.svgSha256||bytesSha(svg)!==capture.lineage?.assetResponseSha256||svg.toString('utf8')!==composed.svg)fail('PROBLEM_SVG_LINEAGE_MISMATCH');
  const candidateBytes=readEvidence(root,capture.paths?.candidateBank,capture.lineage?.candidateBankSha256);
  const sourceRef=capture.protectedParity.sourceRef;
  if(typeof sourceRef?.path!=='string'||!sourceRef.path.startsWith('archive/exams/original/'))fail('PROBLEM_ORIGINAL_SOURCE_REQUIRED');
  const source=readLocal(root,sourceRef.path);if(bytesSha(source.bytes)!==sourceRef.sha256)fail('PROBLEM_ORIGINAL_SOURCE_CHANGED');
  const measured=capture.typographyMeasurement;
  if(measured?.status!=='MEASURED'||measured.provenance!=='ARCHIVE_MEASURED'||measured.evidenceIntegrity!=='NO_CALLER_HOOK'||objectSha(measured.policy)!==capture.lineage.policySha256||measured.policySha256!==capture.lineage.policySha256||measured.policySha256!==composed.lineage.typographyPolicySha256)fail('PROBLEM_TYPOGRAPHY_LINEAGE_REQUIRED');
  const selectedRaw=JSON.parse(readEvidence(root,measured.evidence?.archiveRow?.path,measured.evidence?.archiveRow?.sha256));
  validateProblemReaderEvidence(selectedRaw,{root,sourcePath:sourceRef.path});
  const selected=selectedRaw.state?.displayEnvelopes?.find(v=>v.id===identity.assetId);
  if(selected?.surface!=='PROBLEM_VISUAL'||selectedRaw.mode!=='exam'||selectedRaw.status!=='PASS'||selectedRaw.sourceSha256!==sourceRef.sha256.slice(7)||selectedRaw.state.solutionVisualCount!==0)fail('PROBLEM_TYPOGRAPHY_LINEAGE_REQUIRED');
  const observation={...selected,questionUid:identity.questionUid,synthetic:false,runtime:selectedRaw.runtime,browserVersion:selectedRaw.browserVersion,sourceRef,sourceAuthorityStatus:'MEASUREMENT_ONLY'};
  if(objectSha(observation)!==measured.evidence.observationSha256||objectSha(requestedProfileTypographyPolicy({requestedSizeClass:measured.policy.requestedSizeClass,intrinsicSvg:selected.intrinsicSvg,observation,fontFloorCssPx:11}))!==measured.policySha256)fail('PROBLEM_TYPOGRAPHY_POLICY_MISMATCH');
  const preflights=measured.evidence.problemViewportMeasurements;
  if(!Array.isArray(preflights)||preflights.length!==3)fail('PROBLEM_PREFLIGHT_VIEWPORTS_REQUIRED');
  for(const preflight of preflights){
    const raw=JSON.parse(readEvidence(root,preflight.archiveRow?.path,preflight.archiveRow?.sha256));validateProblemReaderEvidence(raw,{root,sourcePath:sourceRef.path});readEvidence(root,preflight.matrix?.path,preflight.matrix?.sha256);
    for(const name of ['context','page']){const ref=preflight.screenshots?.[name],png=readEvidence(root,ref?.path,ref?.sha256);if(png.length<24||png.toString('hex',0,8)!=='89504e470d0a1a0a')fail('PROBLEM_PNG_INVALID');}
  }
  const before=JSON.parse(JSON.stringify(loadBank(source.bytes.toString('utf8')))),after=JSON.parse(JSON.stringify(loadBank(candidateBytes.toString('utf8'))));
  if(before.length!==after.length)fail('PROBLEM_PROTECTED_SOURCE_MUTATION');
  for(let i=0;i<before.length;i++){
    if(before[i].id===state.meta?.ordinal)for(const key of ['image','imageSize','imageAlt']){delete before[i][key];delete after[i][key];}
    if(objectSha(before[i])!==objectSha(after[i]))fail('PROBLEM_PROTECTED_SOURCE_MUTATION');
  }
  readEvidence(root,capture.paths?.matrix,capture.lineage?.matrixSha256);
  const row=JSON.parse(readEvidence(root,capture.paths?.archiveRow,capture.lineage?.archiveRowSha256));
  const target=row.state?.targets?.find(t=>t.id===identity.assetId),layout=row.layouts?.find(l=>l.id===identity.assetId);
  if(row.mode!=='exam'||row.runtime!=='playwright-chromium'||row.synthetic!==false||row.status!=='PASS'||!row.browserVersion||row.state?.solutionVisualCount!==0||target?.surface!=='PROBLEM_VISUAL'||target.problemWrapper!==true||target.loaded!==true||layout?.status!=='PASS')fail('PROBLEM_ACTUAL_EXAM_EVIDENCE_REQUIRED');
  verifyMeasuredLabelInventory(svg.toString('utf8'),layout);
  if(!Array.isArray(layout.labelMeasurements)||layout.labelMeasurements.some(l=>!Number.isFinite(l.finalViewportCssFontPx)||l.finalViewportCssFontPx<11-1e-7))fail('PROBLEM_ACTUAL_FONT_FLOOR_FAILED');
  for(const name of ['image','context','page']){
    const sha=capture.lineage?.screenshotSha256s?.[name];if(!HASH.test(sha))fail('PROBLEM_PNG_REQUIRED');
    const png=readEvidence(root,capture.paths?.screenshots?.[name],sha);
    if(png.length<24||png.toString('hex',0,8)!=='89504e470d0a1a0a')fail('PROBLEM_PNG_INVALID');
  }
  if(!Array.isArray(capture.problemViewports)||capture.problemViewports.length!==3)fail('PROBLEM_VIEWPORT_EVIDENCE_REQUIRED');
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024]]){
    const matches=capture.problemViewports.filter(v=>v.viewport?.name===name);
    if(matches.length!==1)fail('PROBLEM_VIEWPORT_EVIDENCE_REQUIRED');const view=matches[0];
    if(view.status!=='PASS'||view.viewport.width!==width||view.viewport.height!==height||!view.checks||Object.values(view.checks).some(v=>v!==true))fail('PROBLEM_VIEWPORT_CHECK_FAILED');
    const raw=JSON.parse(readEvidence(root,view.archiveRow?.path,view.archiveRow?.sha256)),target=raw.state?.targets?.find(t=>t.id===identity.assetId),layout=raw.layouts?.find(l=>l.id===identity.assetId);
    validateProblemReaderEvidence(raw,{root,sourcePath:sourceRef.path});
    if(raw.status!=='PASS'||raw.synthetic!==false||raw.mode!=='exam'||raw.viewport!==name||raw.runtime!=='playwright-chromium'||raw.state.solutionVisualCount!==0||target?.problemWrapper!==true||target.surface!=='PROBLEM_VISUAL'||layout?.status!=='PASS')fail('PROBLEM_VIEWPORT_RAW_EVIDENCE_INVALID');
    verifyMeasuredLabelInventory(svg.toString('utf8'),layout);
    if(!Array.isArray(layout.labelMeasurements)||layout.labelMeasurements.some(l=>!Number.isFinite(l.finalViewportCssFontPx)||l.finalViewportCssFontPx<11-1e-7))fail('PROBLEM_ACTUAL_FONT_FLOOR_FAILED');
    for(const shot of ['image','context','page']){
      const ref=view.screenshots?.[shot];if(!HASH.test(ref?.sha256))fail('PROBLEM_PNG_REQUIRED');
      const png=readEvidence(root,ref.path,ref.sha256);if(png.length<24||png.toString('hex',0,8)!=='89504e470d0a1a0a')fail('PROBLEM_PNG_INVALID');
    }
  }
  return {status:'ARCHIVE_BOUND',svgSha256:bytesSha(svg),archiveRowSha256:capture.lineage.archiveRowSha256,screenshotSha256s:capture.lineage.screenshotSha256s,typographyMeasurement:measured,viewports:capture.problemViewports,independentVisualReview:'NOT_RUN',publication:'NOT_RUN'};
}

export async function runProblemManifest(manifestPath){
  const loaded=loadProblemManifest(manifestPath);
  // A remote dispatch accepts only files from the checked-out commit, never a downloaded plan or shell payload.
  for(const input of loaded.inputs)execFileSync('git',['ls-files','--error-unmatch','--',input.path],{cwd:repo,stdio:'pipe'});
  const {renderPlan}=await import('./render-plan.mjs');
  const out=path.join(repo,'.tmp/svg-problem',path.basename(path.dirname(manifestPath)));
  if(fs.existsSync(out))fail('PROBLEM_OUTPUT_EXISTS');fs.mkdirSync(out,{recursive:true});
  for(const input of loaded.inputs){
    const snapshot=path.join(out,'input-snapshots',input.path);fs.mkdirSync(path.dirname(snapshot),{recursive:true});
    const raw=readLocal(repo,input.path).bytes;if(bytesSha(raw)!==input.sha256)fail('PROBLEM_INPUT_CHANGED');
    fs.writeFileSync(snapshot,raw);if(bytesSha(fs.readFileSync(snapshot))!==input.sha256)fail('PROBLEM_INPUT_SNAPSHOT_MISMATCH');
  }
  const results=[];let failed=false;
  for(const entry of loaded.items){
    const dir=path.join(out,entry.item.dir),result=await renderPlan({item:entry.item,plan:entry.plan,outDir:dir});
    let evidence=null,error=null;
    try{
      if(result.status!=='ARCHIVE_BOUND')fail('PROBLEM_RENDER_NOT_BOUND');
      evidence=verifyProblemEvidence(JSON.parse(fs.readFileSync(path.join(dir,entry.item.dir+'-state.json'))));
      if(bytesSha(fs.readFileSync(path.join(dir,entry.item.dir+'-problem.svg')))!==evidence.svgSha256)fail('PROBLEM_OUTPUT_SVG_MISMATCH');
    }catch(e){failed=true;error=e.message;}
    results.push({item:entry.item,renderStatus:result.status,evidence,error});
  }
  // The original source/PNG and every plan must still be the committed bytes after all rendering.
  for(const input of loaded.inputs)if(bytesSha(readLocal(repo,input.path).bytes)!==input.sha256)fail('PROBLEM_INPUT_MUTATED');
  const summary={schemaVersion:'PROBLEM_FIGURE_RUN_v1',status:failed?'FAIL':'ARCHIVE_BOUND',commit:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),manifestPath,manifestSha256:loaded.manifestSha256,inputIdentitySha256:objectSha(loaded.inputs),inputs:loaded.inputs,results,independentVisualReview:'NOT_RUN',publication:'NOT_RUN'};
  fs.writeFileSync(path.join(out,'run-summary.json'),JSON.stringify(summary,null,2)+'\n');
  return summary;
}

export function discoverProblemManifests(){
  return execFileSync('git',['ls-files','-z','--',PREFIX+'**/manifest.json'],{cwd:repo}).toString('utf8').split('\0').filter(Boolean).sort();
}

export function selectChangedProblemManifests(manifests,changedPaths){
  return manifests.filter(manifest=>changedPaths.some(changed=>changed.startsWith(path.posix.dirname(manifest)+'/')));
}
function pullRequestManifests(){
  const base=process.env.PROBLEM_PR_BASE_SHA;if(!/^[a-f0-9]{40}$/.test(base??''))fail('PROBLEM_PR_BASE_SHA_REQUIRED');
  execFileSync('git',['cat-file','-e',base+'^{commit}'],{cwd:repo,stdio:'pipe'});
  const parents=execFileSync('git',['rev-list','--parents','-n','1','HEAD'],{cwd:repo,encoding:'utf8'}).trim().split(' ');
  // GitHub checks out a merge snapshot. Compare that snapshot with its own base parent, so a moving main
  // does not charge this PR for unrelated source updates. A direct branch checkout uses the event base.
  const baseline=parents.length===3?parents[1]:base;
  const changed=execFileSync('git',['diff','--name-only','-z',baseline,'HEAD','--',PREFIX],{cwd:repo}).toString('utf8').split('\0').filter(Boolean);
  return selectChangedProblemManifests(discoverProblemManifests(),changed);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    const manifestPath=process.env.PROBLEM_FIGURE_MANIFEST;
    if(process.argv.length===3&&['--all','--validate-all','--pr','--validate-pr'].includes(process.argv[2])){
      const pr=process.argv[2].endsWith('pr'),paths=pr?pullRequestManifests():discoverProblemManifests();
      if(!paths.length){if(!pr)fail('PROBLEM_MANIFESTS_MISSING');console.log(JSON.stringify({status:'NO_CHANGED_PROBLEM_MANIFESTS',requested:0}));}
      let failed=false;
      for(const path of paths){
        if(process.argv[2].startsWith('--validate')){const input=loadProblemManifest(path);console.log(JSON.stringify({status:'INPUTS_VALID',manifestPath:path,manifestSha256:input.manifestSha256,count:input.items.length}));}
        else{const summary=await runProblemManifest(path);console.log(JSON.stringify({status:summary.status,manifestPath:path,count:summary.results.length}));if(summary.status!=='ARCHIVE_BOUND')failed=true;}
      }
      if(failed)process.exitCode=1;
    }else if(process.argv.length===3&&process.argv[2]==='--validate'){
      const input=loadProblemManifest(manifestPath);console.log(JSON.stringify({status:'INPUTS_VALID',manifestPath,manifestSha256:input.manifestSha256,count:input.items.length}));
    }else if(process.argv.length===2){const summary=await runProblemManifest(manifestPath);console.log(JSON.stringify({status:summary.status,count:summary.results.length,manifestSha256:summary.manifestSha256}));if(summary.status!=='ARCHIVE_BOUND')process.exitCode=1;}
    else fail('PROBLEM_RUNNER_ARGUMENTS_INVALID');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
