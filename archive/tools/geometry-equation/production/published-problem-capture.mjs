// Read-only verification of current canonical problem links. No model, spec,
// typography/composer, publication or operational-asset writer is invoked here.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {bytesSha,fileRef,objectSha} from '../../pipeline-core/canonical.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence,normalizeArchiveImageUrlPath} from '../record-visual-browser-evidence.mjs';
import {assertOutput} from '../visual-browser-runtime.mjs';
import {verifyMeasuredLabelInventory} from '../nested-panel-measurement.mjs';
import {assetIdentity} from './contracts.mjs';
import {validateProblemReaderEvidence} from './problem-output-envelope.mjs';
import {loadProblemManifest,discoverProblemManifests,selectChangedProblemManifests} from './problem-figure-runner.mjs';
const repo=fileURLToPath(new URL('../../../../',import.meta.url));
const PREFIX='archive/tools/geometry-equation/ops/problem-figures/';
const HASH=/^sha256:[a-f0-9]{64}$/;
export const PUBLISHED_CAPTURE_VIEWPORTS=Object.freeze([{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:1024}].map(Object.freeze));
const fail=code=>{throw Error(code);};
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
function readLocal(root,relative){
 if(typeof relative!=='string'||path.isAbsolute(relative)||relative.includes('\\')||relative.includes('\0')||relative.split('/').some(p=>!p||p==='.'||p==='..'))fail('PUBLISHED_PATH_INVALID');
 const base=fs.realpathSync(root),absolute=path.resolve(base,relative),real=fs.realpathSync(absolute);
 if(real!==absolute||!real.startsWith(base+path.sep)||!fs.statSync(real).isFile())fail('PUBLISHED_PATH_REDIRECT');
 return fs.readFileSync(real);
}
function bound(root,ref){
 if(!exact(ref,['path','bytes','sha256'])||!Number.isSafeInteger(ref.bytes)||ref.bytes<=0||!HASH.test(ref.sha256))fail('PUBLISHED_REF_SCHEMA');
 const bytes=readLocal(root,ref.path);if(bytes.length!==ref.bytes||bytesSha(bytes)!==ref.sha256)fail('PUBLISHED_REF_STALE');return bytes;
}
export function publishedCompanionPath(manifestPath){
 if(typeof manifestPath!=='string'||!manifestPath.startsWith(PREFIX)||!manifestPath.endsWith('/manifest.json')||manifestPath.includes('\\')||manifestPath.split('/').some(p=>!p||p==='.'||p==='..'))fail('PUBLISHED_MANIFEST_SCOPE');
 return path.posix.dirname(manifestPath)+'/published.json';
}
function svgSize(bytes){
 const text=bytes.toString('utf8'),tag=text.match(/^<svg\b[^>]*>/)?.[0];
 const number=name=>Number(tag?.match(new RegExp('(?:^|\\s)'+name+'="([0-9.]+)"'))?.[1]);const width=number('width'),height=number('height');
 if(!tag||![width,height].every(v=>Number.isInteger(v)&&v>0&&v<=10000))fail('PUBLISHED_SVG_INTRINSIC_REQUIRED');return {width,height};
}
/** Pure, closed-schema validation. Input refs are the current checked-in bytes. */
export function loadPublishedProblemCapture(manifestPath,{root=repo}={}){
 const companionPath=publishedCompanionPath(manifestPath),manifest=loadProblemManifest(manifestPath,{root});
 const notRequested={status:'NOT_REQUESTED',stage:'PUBLISHED_CAPTURE',manifestPath,companionPath,productionAuthorized:false,qualityReview:'NOT_RUN'};
 let companionStat;try{companionStat=fs.lstatSync(path.join(root,companionPath));}catch(error){if(error.code==='ENOENT')return notRequested;throw error;}
 if(!companionStat.isFile()||companionStat.isSymbolicLink())fail('PUBLISHED_PATH_REDIRECT');
 const companionBytes=readLocal(root,companionPath),companion=JSON.parse(companionBytes);
 if(!exact(companion,['schemaVersion','manifestRef','sourceRef','items'])||companion.schemaVersion!=='PUBLISHED_PROBLEM_CAPTURE_v1'||!Array.isArray(companion.items)||companion.items.length!==manifest.items.length)fail('PUBLISHED_SCHEMA');
 if(companion.manifestRef?.path!==manifestPath)fail('PUBLISHED_MANIFEST_BINDING');bound(root,companion.manifestRef);
 if(companion.manifestRef.sha256!==manifest.manifestSha256)fail('PUBLISHED_MANIFEST_BINDING');
 const sourcePaths=new Set(manifest.items.map(item=>item.item.sourcePath));
 if(sourcePaths.size!==1||!sourcePaths.has(companion.sourceRef?.path))fail('PUBLISHED_SOURCE_SET');
 const sourceBytes=bound(root,companion.sourceRef),bank=loadBank(sourceBytes.toString('utf8'));
 if(!Array.isArray(bank)||!bank.length)fail('PUBLISHED_BANK_EMPTY');
 const sourceInput=manifest.inputs.find(input=>input.path===companion.sourceRef.path);
 if(sourceInput?.sha256!==companion.sourceRef.sha256)fail('PUBLISHED_SOURCE_BINDING');
 const examId=path.posix.basename(companion.sourceRef.path,'.js'),seen=new Set();
 const items=companion.items.map(entry=>{
  if(!exact(entry,['ordinal','svgRef']))fail('PUBLISHED_ITEM_SCHEMA');
  const key=typeof entry.ordinal+':'+entry.ordinal;if(seen.has(key))fail('PUBLISHED_ITEM_DUPLICATE');seen.add(key);
  const matches=manifest.items.filter(item=>item.item.ordinal===entry.ordinal);if(matches.length!==1)fail('PUBLISHED_QUESTION_SET');
  const loaded=matches[0],question=bank.find(q=>q.id===entry.ordinal),name=typeof entry.ordinal==='string'?entry.ordinal:'q'+String(entry.ordinal).padStart(2,'0');
  const archivePath=`assets/images/${examId}/${name}-problem.svg`,expected='archive/'+archivePath;
  if(entry.svgRef?.path!==expected||question?.image!==archivePath)fail('PUBLISHED_CANONICAL_IMAGE_LINK');
  if(question.imageSize!=='full'||question.imageAlt!==loaded.plan.caption)fail('PUBLISHED_IMAGE_FIELDS');
  const svgBytes=bound(root,entry.svgRef),imageInput=manifest.inputs.find(input=>input.path===loaded.sourceImagePath);
  if(imageInput?.sha256!==entry.svgRef.sha256)fail('PUBLISHED_IMAGE_MANIFEST_BINDING');
  const sourceFile=String(question.sourceArchiveFile||question.source_archive_file||companion.sourceRef.path.replace(/^archive\/exams\//,'')).trim(),index=bank.indexOf(question),sourceOrdinal=Number(question.sourceOrdinal||question.sourceQuestionOrdinal||question.source_question_ordinal||index+1)||index+1,sourceUid=String(question.questionUid||question.sourceQuestionUid||question.source_question_uid||`legacy:${sourceFile}#ordinal:${sourceOrdinal}`).trim(),expectedSourceRef=question.reviewSourceRef?String(question.reviewSourceRef):`${sourceFile}#${sourceUid}`;
  return {ordinal:entry.ordinal,svgRef:entry.svgRef,archivePath,expectedSourceRef,intrinsicSvg:svgSize(svgBytes),identity:assetIdentity(examId+'|'+entry.ordinal,'PROBLEM_VISUAL')};
 });
 const inputs=[...manifest.inputs,{path:companionPath,sha256:bytesSha(companionBytes)}];
 for(const input of inputs)readLocal(root,input.path);
 return {status:'PUBLISHED_INPUTS_BOUND',manifestPath,companionPath,manifestRef:companion.manifestRef,companionRef:{path:companionPath,bytes:companionBytes.length,sha256:bytesSha(companionBytes)},sourceRef:companion.sourceRef,questionCount:bank.length,examId,items,inputs:[...new Map(inputs.map(ref=>[ref.path,ref])).values()],productionAuthorized:false,qualityReview:'NOT_RUN'};
}
/** Data-only matrix: a byte-identical source and all exact published SVGs in each row. */
export function publishedCaptureMatrix(loaded,{runRelative,engineSha256}){
 if(loaded?.status!=='PUBLISHED_INPUTS_BOUND'||!/^\.tmp\/archive\/[A-Za-z0-9_-]{1,80}\/[\p{L}\p{N}_.-]{1,180}\/published-capture$/u.test(runRelative)||!HASH.test(engineSha256))fail('PUBLISHED_MATRIX_INPUT');
 const source={id:'published-exam',sourcePath:loaded.sourceRef.path,sourceSha256:loaded.sourceRef.sha256.slice(7),candidatePath:runRelative+'/input-snapshots/'+loaded.sourceRef.path,candidateSha256:loaded.sourceRef.sha256.slice(7),questionCount:loaded.questionCount,assets:loaded.items.map(item=>({id:item.identity.assetId,path:runRelative+'/input-snapshots/'+item.svgRef.path,archivePath:item.archivePath,sha256:item.svgRef.sha256.slice(7),questionId:item.ordinal,surface:'PROBLEM_VISUAL'}))};
 return {schemaVersion:'READ_ONLY_PUBLISHED_PROBLEM_MATRIX_v1',synthetic:false,engineSha256:engineSha256.slice(7),sources:[source],rows:PUBLISHED_CAPTURE_VIEWPORTS.map(({name,...viewport})=>({...source,mode:'exam',viewport:name,...viewport,problemEnvelope:true,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=exam&qpp=4&fit=screen&data='+encodeURIComponent(loaded.sourceRef.path.replace(/^archive\//,''))}))};
}
const finiteRect=r=>r&&['x','y','width','height'].every(k=>Number.isFinite(r[k]))&&r.width>0&&r.height>0;
const contained=(outer,inner)=>finiteRect(outer)&&finiteRect(inner)&&inner.x>=outer.x-.5&&inner.y>=outer.y-.5&&inner.x+inner.width<=outer.x+outer.width+.5&&inner.y+inner.height<=outer.y+outer.height+.5;
/** Actual raw target observations; useful for independent negative tests, never a browser simulator. */
export function verifyPublishedTarget(row,item,svgBytes){
 const targets=row.state?.targets?.filter(t=>t.id===item.identity.assetId),layouts=row.layouts?.filter(l=>l.id===item.identity.assetId);
 if(targets?.length!==1||layouts?.length!==1)fail('PUBLISHED_TARGET_INVENTORY');const target=targets[0],layout=layouts[0];
 if(target.surface!=='PROBLEM_VISUAL'||target.problemWrapper!==true||target.loaded!==true||target.sizeClass!=='full'||target.naturalWidth!==item.intrinsicSvg.width||target.naturalHeight!==item.intrinsicSvg.height||!finiteRect(target.rect)||!contained(target.wrapperRect,target.rect)||!contained(target.qBoxRect,target.rect))fail('PUBLISHED_ACTUAL_TARGET_GEOMETRY');
 if(normalizeArchiveImageUrlPath(target.src)!=='/archive/'+item.archivePath||target.sourceRef!==item.expectedSourceRef||new URL(target.src).origin!==row.network?.localOrigin)fail('PUBLISHED_ACTUAL_IMAGE_URL');
 const responses=row.responses?.filter(r=>normalizeArchiveImageUrlPath(r.url)==='/archive/'+item.archivePath);
 if(responses?.length!==1||responses[0].status!==200||responses[0].sha256!==item.svgRef.sha256.slice(7)||responses[0].bytes!==item.svgRef.bytes||responses[0].url!==target.src)fail('PUBLISHED_ASSET_RESPONSE_BINDING');
 if(layout.status!=='PASS'||layout.svgSha256!==item.svgRef.sha256.slice(7)||layout.measurementMode!=='ISOLATED_SVG_REPLAY_AT_ACTUAL_ARCHIVE_IMAGE_SIZE'||!finiteRect(layout.renderedContainer)||Object.keys(target.rect).some(k=>Math.abs(layout.renderedContainer[k]-target.rect[k])>1e-7))fail('PUBLISHED_LAYOUT_BINDING');
 verifyMeasuredLabelInventory(svgBytes.toString('utf8'),layout);
 const labels=layout.labelMeasurements;
 if(!Array.isArray(labels)||!labels.length||labels.some(label=>!Number.isFinite(label.finalViewportCssFontPx)||label.finalViewportCssFontPx<11-1e-7||!finiteRect(label.client)))fail('PUBLISHED_ACTUAL_FONT_FLOOR');
 if(!Array.isArray(layout.errors)||layout.errors.length||['missingGlyphCount','labelCollisionCount','criticalCollisionCount','clippedTextCount','overflowCount'].some(k=>layout[k]!==0))fail('PUBLISHED_LAYOUT_CHECKS');
 return {ordinal:item.ordinal,assetId:item.identity.assetId,svgSha256:item.svgRef.sha256,naturalWidth:target.naturalWidth,naturalHeight:target.naturalHeight,imageRect:target.rect,glyphCount:labels.length,minimumCssFontPx:Math.min(...labels.map(label=>label.finalViewportCssFontPx))};
}
function pngRef(root,relative){const bytes=readLocal(root,relative);if(bytes.length<24||bytes.toString('hex',0,8)!=='89504e470d0a1a0a')fail('PUBLISHED_PNG_REQUIRED');return fileRef(root,relative);}
export function verifyPublishedCaptureRows(loaded,matrix,{root=repo,runRelative,attempt='final-linked'}={}){
 if(!/^[A-Za-z0-9_-]+$/.test(attempt))fail('PUBLISHED_ATTEMPT_INVALID');
 const engineRef=fileRef(root,'archive/engine.html'),expectedMatrix=publishedCaptureMatrix(loaded,{runRelative,engineSha256:engineRef.sha256});if(objectSha(matrix)!==objectSha(expectedMatrix))fail('PUBLISHED_MATRIX_BINDING');
 if(bytesSha(readLocal(root,matrix.sources[0].candidatePath))!==loaded.sourceRef.sha256)fail('PUBLISHED_SOURCE_SNAPSHOT_BINDING');
 for(const item of loaded.items)if(bytesSha(readLocal(root,runRelative+'/input-snapshots/'+item.svgRef.path))!==item.svgRef.sha256)fail('PUBLISHED_ASSET_SNAPSHOT_BINDING');
 const rows=[];
 for(const viewport of PUBLISHED_CAPTURE_VIEWPORTS){
  const expected=matrix.rows.find(row=>row.viewport===viewport.name);if(!expected)fail('PUBLISHED_VIEWPORT_MATRIX');
  const prefix=expected.id+'-exam-'+viewport.name,folder=runRelative+'/archive-render/'+attempt,rowPath=folder+'/'+prefix+'.json',row=JSON.parse(readLocal(root,rowPath));
  const geometry=row.state?.viewportGeometry;
  if(row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||!row.browserVersion||row.mode!=='exam'||row.viewport!==viewport.name||row.sourceSha256!==loaded.sourceRef.sha256.slice(7)||row.candidateSha256!==loaded.sourceRef.sha256.slice(7)||row.engineSha256!==matrix.engineSha256||!Array.isArray(row.errors)||row.errors.length||row.network?.policy!=='LOCAL_ONLY'||!Array.isArray(row.network.externalRequests)||row.network.externalRequests.length||row.state?.questionBlocks!==loaded.questionCount||row.state.solutionVisualCount!==0||row.state.horizontalOverflow!==false||row.state.allImagesLoaded!==true||geometry?.innerWidth!==viewport.width||geometry.innerHeight!==viewport.height||geometry.screenWidth!==viewport.width||![geometry.documentScrollWidth,geometry.bodyScrollWidth,geometry.documentClientWidth,geometry.bodyClientWidth].every(Number.isFinite)||geometry.documentScrollWidth>viewport.width+2||geometry.bodyScrollWidth>viewport.width+2)fail('PUBLISHED_ACTUAL_ROW_REQUIRED');
  if(row.state.targets?.length!==loaded.items.length||row.layouts?.length!==loaded.items.length)fail('PUBLISHED_TARGET_INVENTORY');
  if(new URL(row.url).origin!==row.network.localOrigin)fail('PUBLISHED_READER_ORIGIN');
  const reader=validateProblemReaderEvidence(row,{root,sourcePath:loaded.sourceRef.path});
  const items=loaded.items.map(item=>verifyPublishedTarget(row,item,bound(root,item.svgRef)));
  const screenshots={page:pngRef(root,folder+'/'+prefix+'.png'),items:loaded.items.map(item=>({ordinal:item.ordinal,image:pngRef(root,folder+'/'+prefix+'-'+item.identity.assetId+'.png'),context:pngRef(root,folder+'/'+prefix+'-'+item.identity.assetId+'-context.png')}))};
  rows.push({viewport,rowRef:fileRef(root,rowPath),reader,geometry,items,screenshots});
 }
 return {status:'READ_ONLY_PUBLISHED_CAPTURE',rowCount:rows.length,targetCount:rows.reduce((n,row)=>n+row.items.length,0),rows,productionAuthorized:false,qualityReview:'NOT_RUN',sourceAssetPreservation:'NOT_ASSESSED_BY_THIS_CAPTURE'};
}
function outputOnly(relative){const absolute=assertOutput(path.join(repo,relative));let cursor=repo;for(const part of path.relative(repo,absolute).split(path.sep)){cursor=path.join(cursor,part);try{if(fs.lstatSync(cursor).isSymbolicLink())fail('PUBLISHED_OUTPUT_REDIRECT');}catch(error){if(error.code==='ENOENT')break;throw error;}}let existing=absolute;while(!fs.existsSync(existing))existing=path.dirname(existing);if(fs.realpathSync(existing)!==existing)fail('PUBLISHED_OUTPUT_REDIRECT');return absolute;}
function writeSnapshot(relative,bytes){const absolute=outputOnly(relative);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,bytes,{flag:'wx'});if(bytesSha(readLocal(repo,relative))!==bytesSha(bytes))fail('PUBLISHED_SNAPSHOT_MISMATCH');}
/** Browser work is available only here, with fixed output scope and no caller hooks. */
export async function capturePublishedProblemManifest(manifestPath,{runId='published-'+Date.now()}={}){
 if(!/^[A-Za-z0-9_-]{1,80}$/.test(runId))fail('PUBLISHED_RUN_ID_INVALID');
 const loaded=loadPublishedProblemCapture(manifestPath);if(loaded.status==='NOT_REQUESTED')return loaded;
 for(const input of loaded.inputs)execFileSync('git',['ls-files','--error-unmatch','--',input.path],{cwd:repo,stdio:'pipe'});
 const runRelative=`.tmp/archive/${runId}/${loaded.examId}/published-capture`,run=outputOnly(runRelative);if(fs.existsSync(run))fail('PUBLISHED_OUTPUT_EXISTS');
 const engineRef=fileRef(repo,'archive/engine.html'),matrix=publishedCaptureMatrix(loaded,{runRelative,engineSha256:engineRef.sha256});
 for(const input of loaded.inputs){const bytes=readLocal(repo,input.path);if(bytesSha(bytes)!==input.sha256)fail('PUBLISHED_INPUT_CHANGED');writeSnapshot(runRelative+'/input-snapshots/'+input.path,bytes);}
 writeSnapshot(runRelative+'/input-snapshots/'+engineRef.path,bound(repo,engineRef));
 const matrixRelative=runRelative+'/archive-render-matrix.json';writeSnapshot(matrixRelative,Buffer.from(JSON.stringify(matrix,null,2)+'\n'));
 const raw=await recordArchiveEvidence({run,attempt:'final-linked',blockExternalRequests:true});
 if(raw.status!=='PASS')fail('PUBLISHED_BROWSER_CAPTURE_FAILED');
 const verified=verifyPublishedCaptureRows(loaded,matrix,{runRelative});
 for(const input of loaded.inputs)if(bytesSha(readLocal(repo,input.path))!==input.sha256)fail('PUBLISHED_INPUT_MUTATED');bound(repo,engineRef);
 const result={schemaVersion:'READ_ONLY_PUBLISHED_CAPTURE_v1',...verified,manifestRef:loaded.manifestRef,companionRef:loaded.companionRef,sourceRef:loaded.sourceRef,sourceSnapshotRef:fileRef(repo,matrix.sources[0].candidatePath),assetRefs:loaded.items.map(item=>({ordinal:item.ordinal,canonicalRef:item.svgRef,snapshotRef:fileRef(repo,runRelative+'/input-snapshots/'+item.svgRef.path)})),engineRef,engineSnapshotRef:fileRef(repo,runRelative+'/input-snapshots/'+engineRef.path),matrixRef:fileRef(repo,matrixRelative),commit:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),inputIdentitySha256:objectSha(loaded.inputs)};
 writeSnapshot(runRelative+'/published-capture.json',Buffer.from(JSON.stringify(result,null,2)+'\n'));return result;
}
/** Fixed git reads, matching the renderer's PR scope; no arbitrary command input. */
export function selectedProblemManifests(baseSha=process.env.PROBLEM_PR_BASE_SHA){
 if(!/^[a-f0-9]{40}$/.test(baseSha??''))fail('PUBLISHED_PR_BASE_SHA_REQUIRED');execFileSync('git',['cat-file','-e',baseSha+'^{commit}'],{cwd:repo,stdio:'pipe'});
 const parents=execFileSync('git',['rev-list','--parents','-n','1','HEAD'],{cwd:repo,encoding:'utf8'}).trim().split(' '),baseline=parents.length===3?parents[1]:baseSha;
 const changed=execFileSync('git',['diff','--name-only','-z',baseline,'HEAD','--',PREFIX],{cwd:repo}).toString('utf8').split('\0').filter(Boolean);
 return selectChangedProblemManifests(discoverProblemManifests(),changed);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{
  if(process.argv.length!==4||!['--validate','--capture'].includes(process.argv[2]))fail('PUBLISHED_CLI_ARGUMENTS');
  const value=process.argv[2]==='--validate'?loadPublishedProblemCapture(process.argv[3]):await capturePublishedProblemManifest(process.argv[3]);
  console.log(JSON.stringify(value));
 }catch(error){console.error(JSON.stringify({status:'FAIL',stage:'PUBLISHED_CAPTURE',code:error.message,productionAuthorized:false,qualityReview:'NOT_RUN'}));process.exitCode=1;}
}
