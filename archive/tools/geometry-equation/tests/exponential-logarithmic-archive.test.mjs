import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {fileRef,bytesSha,objectSha} from '../../pipeline-core/canonical.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence} from '../record-visual-browser-evidence.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {specFor} from '../production/phase2.mjs';
import {typesetter} from '../production/typography.mjs';
import {captureDisplayProfiles} from '../production/display-profile-audit.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const sourcePath='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js';
const rawSource=fs.readFileSync(path.join(root,sourcePath),'utf8');
const sourceBank=loadBank(rawSource);
const localQrRef=fileRef(root,'archive/vendor/qrious/qrious.min.js');
const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const profileOrder=['small','medium','large','full'];
const fontPx=24.9;
const cases=[
  {kind:'exponential',capability:'exponential-affine-spike-v1',family:'exponential-affine',coefficients:['1','1','0'],sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-3,3,-2,12],caption:'지수함수의 증가와 점근선',content:'함수 f(x)=eˣ의 그래프에서 f(0)의 값을 구하시오.',answer:'1',solution:'x=0을 대입한다.\nf(0)=e⁰\nf(0)=1'},
  {kind:'logarithmic',capability:'logarithmic-affine-spike-v1',family:'logarithmic-affine',coefficients:['1','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'},domain:[.1,4],viewport:[-1,5,-5,5],caption:'자연로그 함수의 정의역 경계와 기준점',content:'함수 f(x)=ln x의 그래프에서 f(1)의 값을 구하시오.',answer:'0',solution:'x=1은 정의역에 속한다.\nf(1)=ln 1\nf(1)=0'}
];

function archiveUrl(){return '/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));}
function observerTransform(transform,displayScale){const {aspectPolicy,...frame}=transform;return{...frame,displayScale};}
function patchBank(runId,examUid,svgPath,assetPath,sizeClass,item){
  const candidatePath=`.tmp/archive/${runId}/${examUid}/candidates/${sizeClass}/${examUid}.js`;
  fs.mkdirSync(path.dirname(path.join(root,candidatePath)),{recursive:true});
  const patch={content:item.content,choices:[item.answer,'−1','0','2','해당 없음'],answer:item.answer,solution:item.solution,solutionImage:assetPath,solutionImageAlt:'실험용 지수·로그 함수 그래프',solutionImageCaption:item.caption,solutionImageSize:sizeClass};
  fs.writeFileSync(path.join(root,candidatePath),rawSource+'\n;Object.assign(window.questionBank.find(q=>q.id===1),'+JSON.stringify(patch)+');\n',{flag:'wx'});
  const candidateRef=fileRef(root,candidatePath),svgRef=fileRef(root,svgPath),assetId=`p4-${item.kind}-${sizeClass}-${examUid}`;
  const info={id:assetId,sourcePath,sourceSha256:fileRef(root,sourcePath).sha256.slice(7),candidatePath,candidateSha256:candidateRef.sha256.slice(7),questionCount:sourceBank.length,fixtureClassification:'CONTROLLED_SYNTHETIC_CONTENT',protectedParity:'NOT_APPLICABLE_SYNTHETIC_FIXTURE',assets:[{id:assetId,path:svgPath,archivePath:assetPath,sha256:svgRef.sha256.slice(7),questionId:1,sizeClass}]};
  return {candidateRef,svgRef,info,assetId};
}
async function captureArchive({runId,examUid,svgPath,assetPath,sizeClass,item}){
  const run=`.tmp/archive/${runId}/${examUid}/visual-engine/production/archive-${sizeClass}`;fs.mkdirSync(path.join(root,run),{recursive:true});
  const candidate=patchBank(runId,examUid,svgPath,assetPath,sizeClass,item);
  const matrix={schemaVersion:`APMATH_PHASE4_${item.kind.toUpperCase()}_ARCHIVE_MATRIX_v1`,classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',synthetic:false,engineSha256:fileRef(root,'archive/engine.html').sha256.slice(7),sources:[candidate.info],rows:[{...candidate.info,mode:'sol',viewport:item.kind+'-'+sizeClass,width:1440,height:1000,urlPath:archiveUrl(),requireLocalResources:true,requireQrRenderer:true,envelopeTargets:[{id:candidate.assetId,questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:profileOrder,sourceAuthorityStatus:'CONTROLLED_SYNTHETIC_FIXTURE'}]}]};
  fs.writeFileSync(path.join(root,run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n',{flag:'wx'});
  const capture=await recordArchiveEvidence({run,attempt:item.kind+'-'+sizeClass,blockExternalRequests:true});assert.equal(capture.status,'PASS');
  const captureFolder=path.join(root,run,'archive-render',`${item.kind}-${sizeClass}`),rowName=fs.readdirSync(captureFolder).find(name=>name.endsWith(`-sol-${item.kind}-${sizeClass}.json`));assert.ok(rowName);
  const archiveRow=JSON.parse(fs.readFileSync(path.join(captureFolder,rowName),'utf8'));
  assert.equal(archiveRow.status,'PASS');assert.equal(archiveRow.network.policy,'LOCAL_ONLY');assert.deepEqual(archiveRow.network.externalRequests,[]);
  assert.equal(archiveRow.state.qrRendererAvailable,true);assert.equal(archiveRow.state.mathJaxSource,'local');assert.equal(archiveRow.state.mathJaxCdnFallback,false);
  assert.equal(archiveRow.state.targets[0].sizeClass,sizeClass);
  const normalize=response=>decodeURIComponent(new URL(response.url).pathname);
  const loaded=archiveRow.responses.find(response=>normalize(response)==='/archive/'+assetPath);assert.ok(loaded);assert.equal(loaded.status,200);assert.equal(loaded.sha256,candidate.svgRef.sha256.slice(7));
  const qr=archiveRow.responses.find(response=>normalize(response).endsWith('/archive/vendor/qrious/qrious.min.js'));assert.ok(qr);assert.equal(qr.status,200);assert.equal(qr.sha256,localQrRef.sha256.slice(7));
  return {run,candidate,capture,archiveRow,profiles:archiveRow.state.displayEnvelopes[0].profiles};
}

for(const item of cases)test(`${item.kind} affine graph survives measured Archive profiles as a controlled fixture`,async()=>{
  assert.ok(sourceBank.find(row=>row.id===1));
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:item})).result;
  assert.equal(framed.policy,item.kind==='exponential'?'EXPONENTIAL_AFFINE_OVERVIEW_v1':'LOGARITHMIC_AFFINE_OVERVIEW_v1');
  const plan=framed.graphPlan,graphModel=(await pythonWorker({action:'graph',graphPlan:plan})).result;
  const modelAudit=(await pythonWorker({graphPlan:plan,svg:graphModel.svg,transform:observerTransform(graphModel.transform,1)},{script:observerScript})).result;
  assert.equal(modelAudit.status,'PASS',JSON.stringify(modelAudit.errors));
  const visualPlan={capability:item.capability,graphPlan:plan,caption:item.caption};
  const spec=specFor(visualPlan,graphModel,item.kind+'-overview-fixture'),prepared=(await pythonWorker({action:'prepare',spec})).result;
  const identity={visualAssetKey:objectSha({fixture:item.kind,coefficients:plan.coefficients,sourceDomain:plan.sourceDomain})};
  const fragments={},measurements={};
  for(const label of prepared.labels){
    fragments[label.id]=typesetter()({id:label.id,owner:label.target||label.id,factRole:'DERIVED_INTERMEDIATE',fontPx,...(label.math||label.kind==='POINT_NAME'?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
  }
  const browser=await launchBrowser(),browserVersion=browser.version(),observedFragments={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const [id,fragment] of Object.entries(fragments)){
      await page.setContent(fragment.svg);
      const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
      if(!(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0))throw Error('EXP_LOG_FRAGMENT_BROWSER_MEASUREMENT_MISSING:'+id);
      fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];observedFragments[id]={fragmentSha256:fragment.fragmentSha256,owner:fragment.owner,factRole:fragment.factRole,observedBBox:bbox};
    }
    await page.close();
  }finally{await browser.close();}
  const runId=`phase4-${item.kind}-${crypto.randomUUID()}`,examUid=path.basename(sourcePath,'.js'),examRoot=`.tmp/archive/${runId}/${examUid}`;
  console.log('EXP_LOG_FIXTURE_STARTED='+JSON.stringify({capability:item.capability,runId,examUid,sourceDomain:plan.sourceDomain,domain:plan.domain,profileOrder,classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE'}));
  const measurementPath=`${examRoot}/visual-engine/production/${item.kind}-frozen-fragment-browser-measurements.json`;
  const measurementReceipt={schemaVersion:'PHASE4_EXP_LOG_FRAGMENT_BROWSER_MEASUREMENT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',capability:item.capability,runtime:'playwright-chromium',browserVersion,viewport:{width:1440,height:1000},candidateLabelIds:prepared.labels.map(label=>label.id),measurements,observedFragments,typesetterInventory:Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,{fragmentSha256:fragment.fragmentSha256,fontSha256:fragment.fontSha256,fontPx:fragment.fontPx,intrinsic:fragment.intrinsic}]))};
  fs.mkdirSync(path.dirname(path.join(root,measurementPath)),{recursive:true});fs.writeFileSync(path.join(root,measurementPath),JSON.stringify(measurementReceipt,null,2)+'\n',{flag:'wx'});
  const built=(await pythonWorker({action:'build',spec,measurements,fragments})).result;assert.equal(built.witness.layout.status,'PASS',JSON.stringify(built.witness.layout));
  const staticAudit=(await pythonWorker({graphPlan:plan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,1)},{script:observerScript})).result;assert.equal(staticAudit.status,'PASS',JSON.stringify(staticAudit.errors));
  const modelDir=path.join(root,`${examRoot}/visual-engine/production/${item.kind}-model`);fs.mkdirSync(modelDir,{recursive:true});
  const modelArtifacts={graphPlan:{path:`${examRoot}/visual-engine/production/${item.kind}-model/graph-plan.json`,value:plan},graphModelSvg:{path:`${examRoot}/visual-engine/production/${item.kind}-model/graph-model.svg`,value:graphModel.svg},graphModelTransform:{path:`${examRoot}/visual-engine/production/${item.kind}-model/graph-model-transform.json`,value:graphModel.transform},modelAudit:{path:`${examRoot}/visual-engine/production/${item.kind}-model/model-audit.json`,value:modelAudit},visualSpec:{path:`${examRoot}/visual-engine/production/${item.kind}-model/visual-spec.json`,value:spec},finalSvg:{path:`${examRoot}/visual-engine/production/${item.kind}-model/final.svg`,value:built.svg},staticAudit:{path:`${examRoot}/visual-engine/production/${item.kind}-model/static-audit.json`,value:staticAudit}};
  for(const artifact of Object.values(modelArtifacts)){const target=path.join(root,artifact.path);fs.writeFileSync(target,typeof artifact.value==='string'?artifact.value:JSON.stringify(artifact.value,null,2)+'\n',{flag:'wx'});}
  const assetPath=`assets/images/${examUid}/q01-solution.svg`,svgPath=`${examRoot}/${assetPath}`;fs.mkdirSync(path.dirname(path.join(root,svgPath)),{recursive:true});fs.writeFileSync(path.join(root,svgPath),built.svg,{flag:'wx'});
  const svgRef=fileRef(root,svgPath);assert.equal(svgRef.sha256,'sha256:'+crypto.createHash('sha256').update(built.svg).digest('hex'));
  const preflight=await captureArchive({runId:runId+'-preflight',examUid,svgPath,assetPath,sizeClass:'full',item});
  const profileAudits=[],profileScreenshots=[];
  for(const profile of profileOrder){
    const measured=preflight.profiles.find(row=>row.sizeClass===profile);assert.ok(measured?.imageRect?.width>0&&measured?.imageRect?.height>0);
    const displayScale=measured.imageRect.width/384;
    const graph=(await pythonWorker({graphPlan:plan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,displayScale)},{script:observerScript})).result;
    const capture=await captureDisplayProfiles({svg:built.svg,profiles:[{sizeClass:profile,imageRect:measured.imageRect}]});
    const row=capture.rows[0],fonts=row.layout.labelMeasurements.map(label=>label.finalViewportCssFontPx).filter(Number.isFinite),minimumCssFontPx=fonts.length?Math.min(...fonts):null;
    const status=graph.status==='UNSUPPORTED'?'UNSUPPORTED':graph.status==='PASS'&&row.status==='PASS'&&minimumCssFontPx>=11?'PASS':'FAIL';
    profileAudits.push({sizeClass:profile,status,displayScale,imageRect:measured.imageRect,minimumCssFontPx,graphStatus:graph.status,graphErrors:graph.errors,layoutErrors:row.layout.errors,overview:graph});
    const screenshotPath=path.join(root,examRoot,'visual-engine','production','profile-captures',profile+'.png');fs.mkdirSync(path.dirname(screenshotPath),{recursive:true});fs.writeFileSync(screenshotPath,row.screenshot,{flag:'wx'});profileScreenshots.push({sizeClass:profile,path:path.relative(root,screenshotPath).replaceAll('\\','/'),bytes:row.screenshot.length,sha256:bytesSha(row.screenshot)});
  }
  const selected=profileOrder.slice(profileOrder.indexOf('medium')).find(profile=>profileAudits.find(row=>row.sizeClass===profile)?.status==='PASS');assert.ok(selected,JSON.stringify(profileAudits));
  const final=await captureArchive({runId:runId+'-final',examUid,svgPath,assetPath,sizeClass:selected,item});
  const features=plan.exponentialFeatures||plan.logarithmicFeatures,policy=plan.exponentialFeaturePolicy||plan.logarithmicFeaturePolicy;
  const result={schemaVersion:'APMATH_PHASE4_EXP_LOG_FIXTURE_RESULT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runId,examUid,capability:item.capability,family:item.family,coefficients:plan.coefficients,sourceDomain:plan.sourceDomain,domain:plan.domain,features,featurePolicy:policy,independentMath:{modelAudit,staticAudit},frozenFragmentMeasurement:{path:measurementPath,receipt:measurementReceipt,bytes:fs.statSync(path.join(root,measurementPath)).size,sha256:fileRef(root,measurementPath).sha256},modelArtifacts,candidateSvgRef:svgRef,candidateSvgSha256:svgRef.sha256,profileAudits,selectedSizeClass:selected,archivePreflight:{run:preflight.run,status:preflight.capture.status},actualArchive:{run:final.run,status:final.capture.status,rowId:final.archiveRow.id,loadedAsset:final.archiveRow.state.targets[0],network:final.archiveRow.network,mathJaxSource:final.archiveRow.state.mathJaxSource,mathJaxCdnFallback:final.archiveRow.state.mathJaxCdnFallback},profileScreenshots,qualificationStatus:'NOT_QUALIFIED',productionAuthorized:false};
  const resultPath=path.join(root,examRoot,'visual-engine/production/exp-log-publication-result.json');fs.mkdirSync(path.dirname(resultPath),{recursive:true});fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  console.log('EXP_LOG_ACTUAL_ARCHIVE='+JSON.stringify({classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',capability:item.capability,features,profileAudits:profileAudits.map(row=>({sizeClass:row.sizeClass,status:row.status,displayScale:row.displayScale,errors:row.graphErrors})),selectedSizeClass:selected,archiveStatus:final.capture.status,resultPath:path.relative(root,resultPath).replaceAll('\\','/')}));
});
