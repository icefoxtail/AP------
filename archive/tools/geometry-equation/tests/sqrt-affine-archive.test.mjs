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
const fixture={content:'함수 y=√(2x−200)의 그래프가 x축과 만나는 점의 x좌표를 구하시오.',answer:'100',solution:'x축과 만나는 점에서는 y=0이다.\n√(2x−200)=0\n2x−200=0\nx=100',caption:'양의 정의역 경계가 있는 제곱근 함수'};

function archiveUrl(){return '/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));}
function observerTransform(transform,displayScale){const {aspectPolicy,...frame}=transform;return{...frame,displayScale};}
function patchBank(runId,examUid,svgPath,assetPath,sizeClass){
  const candidatePath=`.tmp/archive/${runId}/${examUid}/candidates/${sizeClass}/${examUid}.js`;
  fs.mkdirSync(path.dirname(path.join(root,candidatePath)),{recursive:true});
  const patch={content:fixture.content,choices:['100','200','−100','0','해당 없음'],answer:fixture.answer,solution:fixture.solution,solutionImage:assetPath,solutionImageAlt:'실험용 제곱근 함수 그래프',solutionImageCaption:'실험용 제곱근 함수 그래프',solutionImageSize:sizeClass};
  fs.writeFileSync(path.join(root,candidatePath),rawSource+'\n;Object.assign(window.questionBank.find(q=>q.id===1),'+JSON.stringify(patch)+');\n',{flag:'wx'});
  const candidateRef=fileRef(root,candidatePath),svgRef=fileRef(root,svgPath),assetId='p4-sqrt-affine-'+sizeClass+'-'+examUid;
  const info={id:assetId,sourcePath,sourceSha256:fileRef(root,sourcePath).sha256.slice(7),candidatePath,candidateSha256:candidateRef.sha256.slice(7),questionCount:sourceBank.length,fixtureClassification:'CONTROLLED_SYNTHETIC_CONTENT',protectedParity:'NOT_APPLICABLE_SYNTHETIC_FIXTURE',assets:[{id:assetId,path:svgPath,archivePath:assetPath,sha256:svgRef.sha256.slice(7),questionId:1,sizeClass}]};
  return {candidateRef,svgRef,info,assetId};
}
async function captureArchive({runId,examUid,svgPath,assetPath,sizeClass}){
  const run=`.tmp/archive/${runId}/${examUid}/visual-engine/production/archive-${sizeClass}`;fs.mkdirSync(path.join(root,run),{recursive:true});
  const candidate=patchBank(runId,examUid,svgPath,assetPath,sizeClass);
  const matrix={schemaVersion:'APMATH_PHASE4_SQRT_AFFINE_ARCHIVE_MATRIX_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',synthetic:false,engineSha256:fileRef(root,'archive/engine.html').sha256.slice(7),sources:[candidate.info],rows:[{...candidate.info,mode:'sol',viewport:'sqrt-affine-'+sizeClass,width:1440,height:1000,urlPath:archiveUrl(),requireLocalResources:true,requireQrRenderer:true,envelopeTargets:[{id:candidate.assetId,questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:profileOrder,sourceAuthorityStatus:'CONTROLLED_SYNTHETIC_FIXTURE'}]}]};
  fs.writeFileSync(path.join(root,run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n',{flag:'wx'});
  const capture=await recordArchiveEvidence({run,attempt:'sqrt-affine-'+sizeClass,blockExternalRequests:true});assert.equal(capture.status,'PASS');
  const captureFolder=path.join(root,run,'archive-render',`sqrt-affine-${sizeClass}`),rowName=fs.readdirSync(captureFolder).find(name=>name.endsWith(`-sol-sqrt-affine-${sizeClass}.json`));assert.ok(rowName);
  const archiveRow=JSON.parse(fs.readFileSync(path.join(captureFolder,rowName),'utf8'));
  assert.equal(archiveRow.status,'PASS');assert.equal(archiveRow.network.policy,'LOCAL_ONLY');assert.deepEqual(archiveRow.network.externalRequests,[]);
  assert.equal(archiveRow.state.qrRendererAvailable,true);assert.equal(archiveRow.state.mathJaxSource,'local');assert.equal(archiveRow.state.mathJaxCdnFallback,false);
  assert.equal(archiveRow.state.targets[0].sizeClass,sizeClass);
  const normalize=response=>decodeURIComponent(new URL(response.url).pathname);
  const loaded=archiveRow.responses.find(response=>normalize(response)==='/archive/'+assetPath);assert.ok(loaded);assert.equal(loaded.status,200);assert.equal(loaded.sha256,candidate.svgRef.sha256.slice(7));
  const qr=archiveRow.responses.find(response=>normalize(response).endsWith('/archive/vendor/qrious/qrious.min.js'));assert.ok(qr);assert.equal(qr.status,200);assert.equal(qr.sha256,localQrRef.sha256.slice(7));
  return {run,candidate,capture,archiveRow,profiles:archiveRow.state.displayEnvelopes[0].profiles};
}

test('sqrt-affine natural boundary candidate passes measured Archive profiles as a controlled fixture',async()=>{
  assert.ok(sourceBank.find(row=>row.id===1));
  const request={family:'sqrt-affine',radicand:['-200','2'],sourceDomain:{kind:'NATURAL_SQRT_AFFINE'},domain:[100,120],viewport:[0,130,-1,10],requiredPoints:[]};
  const framed=(await pythonWorker({action:'frame_graph',graphPlan:request})).result;assert.equal(framed.policy,'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1');
  const plan=framed.graphPlan;assert.equal(plan.domain[0],100);assert.ok(plan.viewport[0]>0&&plan.viewport[0]<100);
  const runId=`phase4-sqrt-affine-${crypto.randomUUID()}`,examUid=path.basename(sourcePath,'.js');
  const graphModel=(await pythonWorker({action:'graph',graphPlan:plan})).result;
  const modelAudit=(await pythonWorker({graphPlan:plan,svg:graphModel.svg,transform:observerTransform(graphModel.transform,1)},{script:observerScript})).result;
  assert.equal(modelAudit.status,'PASS',JSON.stringify(modelAudit.errors));
  const visualPlan={capability:'sqrt-affine-spike-v1',graphPlan:plan,caption:fixture.caption};
  const spec=specFor(visualPlan,graphModel,'sqrt-affine-natural-boundary-fixture');
  assert.deepEqual(spec.axes,{x:true,y:false});
  const prepared=(await pythonWorker({action:'prepare',spec})).result;
  const identity={visualAssetKey:objectSha({fixture:'natural-positive-boundary',radicand:plan.radicand,sourceDomain:plan.sourceDomain})};
  const fragments={},measurements={};
  for(const label of prepared.labels){
    const fragment=typesetter()({id:label.id,owner:label.target||label.id,factRole:'DERIVED_INTERMEDIATE',fontPx,...(label.math||label.kind==='POINT_NAME'?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    fragments[label.id]=fragment;
  }
  const browser=await launchBrowser(),browserVersion=browser.version(),observedFragments={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const [id,fragment] of Object.entries(fragments)){
      await page.setContent(fragment.svg);
      const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
      if(!(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0))throw Error('SQRT_FRAGMENT_BROWSER_MEASUREMENT_MISSING:'+id);
      fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];observedFragments[id]={fragmentSha256:fragment.fragmentSha256,owner:fragment.owner,factRole:fragment.factRole,observedBBox:bbox};
    }
    await page.close();
  }finally{await browser.close();}
  const examRoot=`.tmp/archive/${runId}/${examUid}`,measurementPath=`${examRoot}/visual-engine/production/sqrt-frozen-fragment-browser-measurements.json`;
  const measurementReceipt={schemaVersion:'PHASE4_SQRT_FRAGMENT_BROWSER_MEASUREMENT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runtime:'playwright-chromium',browserVersion,viewport:{width:1440,height:1000},candidateLabelIds:prepared.labels.map(label=>label.id),measurements,observedFragments,typesetterInventory:Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,{fragmentSha256:fragment.fragmentSha256,fontSha256:fragment.fontSha256,fontPx:fragment.fontPx,intrinsic:fragment.intrinsic}]))};
  fs.mkdirSync(path.dirname(path.join(root,measurementPath)),{recursive:true});fs.writeFileSync(path.join(root,measurementPath),JSON.stringify(measurementReceipt,null,2)+'\n',{flag:'wx'});
  const built=(await pythonWorker({action:'build',spec,measurements,fragments})).result;
  assert.equal(built.witness.layout.status,'PASS',built.witness.layout.unresolved);
  const staticAudit=(await pythonWorker({graphPlan:plan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,1)},{script:observerScript})).result;
  assert.equal(staticAudit.status,'PASS',JSON.stringify(staticAudit.errors));
  const modelDir=path.join(root,`${examRoot}/visual-engine/production/sqrt-affine-model`);fs.mkdirSync(modelDir,{recursive:true});
  const modelArtifacts={graphPlan:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/graph-plan.json`,value:plan},graphModelSvg:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/graph-model.svg`,value:graphModel.svg},graphModelTransform:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/graph-model-transform.json`,value:graphModel.transform},modelAudit:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/model-audit.json`,value:modelAudit},visualSpec:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/visual-spec.json`,value:spec},finalSvg:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/final.svg`,value:built.svg},staticAudit:{path:`${examRoot}/visual-engine/production/sqrt-affine-model/static-audit.json`,value:staticAudit}};
  for(const artifact of Object.values(modelArtifacts)){const target=path.join(root,artifact.path);fs.writeFileSync(target,typeof artifact.value==='string'?artifact.value:JSON.stringify(artifact.value,null,2)+'\n',{flag:'wx'});}
  const assetPath=`assets/images/${examUid}/q01-solution.svg`,svgPath=`${examRoot}/${assetPath}`;
  fs.mkdirSync(path.dirname(path.join(root,svgPath)),{recursive:true});fs.writeFileSync(path.join(root,svgPath),built.svg,{flag:'wx'});
  const svgRef=fileRef(root,svgPath);assert.equal(svgRef.sha256,'sha256:'+crypto.createHash('sha256').update(built.svg).digest('hex'));
  const preflight=await captureArchive({runId:runId+'-preflight',examUid,svgPath,assetPath,sizeClass:'full'});
  const profileAudits=[],profileScreenshots=[];
  for(const profile of profileOrder){
    const measured=preflight.profiles.find(item=>item.sizeClass===profile);assert.ok(measured?.imageRect?.width>0&&measured?.imageRect?.height>0);
    const displayScale=measured.imageRect.width/384;
    const graph=(await pythonWorker({graphPlan:plan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,displayScale)},{script:observerScript})).result;
    const capture=await captureDisplayProfiles({svg:built.svg,profiles:[{sizeClass:profile,imageRect:measured.imageRect}]});
    const row=capture.rows[0],fonts=row.layout.labelMeasurements.map(label=>label.finalViewportCssFontPx).filter(Number.isFinite),minimumCssFontPx=fonts.length?Math.min(...fonts):null;
    const status=graph.status==='UNSUPPORTED'?'UNSUPPORTED':graph.status==='PASS'&&row.status==='PASS'&&minimumCssFontPx>=11?'PASS':'FAIL';
    profileAudits.push({sizeClass:profile,status,displayScale,imageRect:measured.imageRect,minimumCssFontPx,graphStatus:graph.status,graphErrors:graph.errors,layoutErrors:row.layout.errors,sqrtOverview:graph.overview});
    const shotPath=path.join(root,examRoot,'visual-engine','production','profile-captures',profile+'.png');fs.mkdirSync(path.dirname(shotPath),{recursive:true});fs.writeFileSync(shotPath,row.screenshot,{flag:'wx'});
    profileScreenshots.push({sizeClass:profile,path:path.relative(root,shotPath).replaceAll('\\','/'),bytes:row.screenshot.length,sha256:bytesSha(row.screenshot)});
  }
  const selected=profileOrder.slice(profileOrder.indexOf('medium')).find(profile=>profileAudits.find(row=>row.sizeClass===profile)?.status==='PASS');
  assert.ok(selected,JSON.stringify(profileAudits));
  const final=await captureArchive({runId:runId+'-final',examUid,svgPath,assetPath,sizeClass:selected});
  const result={schemaVersion:'APMATH_PHASE4_SQRT_AFFINE_FIXTURE_RESULT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runId,examUid,capability:'sqrt-affine-spike-v1',family:'SQRT_AFFINE_NATURAL_BOUNDARY',radicand:plan.radicand,sourceDomain:plan.sourceDomain,sqrtFeatures:plan.sqrtFeatures,featurePolicy:plan.sqrtFeaturePolicy,independentMath:{modelAudit,staticAudit},frozenFragmentMeasurement:{path:measurementPath,receipt:measurementReceipt,bytes:fs.statSync(path.join(root,measurementPath)).size,sha256:fileRef(root,measurementPath).sha256},modelArtifacts, candidateSvgRef:svgRef,candidateSvgSha256:svgRef.sha256,profileAudits,selectedSizeClass:selected,archivePreflight:{run:preflight.run,status:preflight.capture.status},actualArchive:{run:final.run,status:final.capture.status,rowId:final.archiveRow.id,loadedAsset:final.archiveRow.state.targets[0],network:final.archiveRow.network,mathJaxSource:final.archiveRow.state.mathJaxSource,mathJaxCdnFallback:final.archiveRow.state.mathJaxCdnFallback},profileScreenshots,qualificationStatus:'NOT_QUALIFIED',productionAuthorized:false};
  const resultPath=path.join(root,examRoot,'visual-engine','production/sqrt-affine-publication-result.json');fs.mkdirSync(path.dirname(resultPath),{recursive:true});fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  console.log('SQRT_AFFINE_ACTUAL_ARCHIVE='+JSON.stringify({classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',positiveBoundary:plan.sqrtFeatures.radicandBoundaryX,viewport:plan.viewport,profileAudits:profileAudits.map(row=>({sizeClass:row.sizeClass,status:row.status,displayScale:row.displayScale,graphStatus:row.graphStatus,endpointToTailSpanCss:row.sqrtOverview?.endpointToTailSpanCss,errors:row.graphErrors})),selectedSizeClass:selected,archiveStatus:final.capture.status,resultPath:path.relative(root,resultPath).replaceAll('\\','/')}));
});
