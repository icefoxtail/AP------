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
const sourceRef=fileRef(root,sourcePath);
const sourceHex=sourceRef.sha256.slice(7);
const localQrRef=fileRef(root,'archive/vendor/qrious/qrious.min.js');
const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const profileOrder=['small','medium','large','full'];
const fontPx=24.9;

function archiveUrl(){return '/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));}
function observerTransform(transform,displayScale){const {aspectPolicy,...frame}=transform;return{...frame,displayScale};}
function patchBank(runId,examUid,svgPath,assetPath,sizeClass,content,answer,solution){
  const candidatePath=`.tmp/archive/${runId}/${examUid}/candidates/${sizeClass}/${examUid}.js`;
  fs.mkdirSync(path.dirname(path.join(root,candidatePath)),{recursive:true});
  const patch={content,choices:['선택지 1','선택지 2','선택지 3','선택지 4','선택지 5'],answer,solution,solutionImage:assetPath,solutionImageAlt:'합성 유리함수 그래프 검증',solutionImageCaption:'실험용 유리함수 그래프',solutionImageSize:sizeClass};
  fs.writeFileSync(path.join(root,candidatePath),rawSource+'\n;Object.assign(window.questionBank.find(q=>q.id===1),'+JSON.stringify(patch)+');\n',{flag:'wx'});
  const candidateRef=fileRef(root,candidatePath),svgRef=fileRef(root,svgPath),assetId='p4-rational-'+sizeClass+'-'+examUid;
  const info={id:assetId,sourcePath,sourceSha256:sourceHex,candidatePath,candidateSha256:candidateRef.sha256.slice(7),questionCount:sourceBank.length,fixtureClassification:'CONTROLLED_SYNTHETIC_CONTENT',protectedParity:'NOT_APPLICABLE_SYNTHETIC_FIXTURE',assets:[{id:assetId,path:svgPath,archivePath:assetPath,sha256:svgRef.sha256.slice(7),questionId:1,sizeClass}]};
  return {candidateRef,svgRef,info,assetId};
}
async function buildCandidate(plan,fixture,runId,examUid){
  const graphModel=(await pythonWorker({action:'graph',graphPlan:plan})).result;
  const modelAudit=(await pythonWorker({graphPlan:plan,svg:graphModel.svg,transform:observerTransform(graphModel.transform,1)},{script:observerScript})).result;
  assert.equal(modelAudit.status,'PASS',JSON.stringify(modelAudit.errors));
  const visualPlan={capability:'rational-spike-v1',graphPlan:plan,caption:fixture.caption};
  let spec=specFor(visualPlan,graphModel,'rational-'+fixture.kind+'-fixture');
  let prepared=(await pythonWorker({action:'prepare',spec})).result;
  const setTypeset=typesetter(),identity={visualAssetKey:objectSha({fixture:fixture.kind,numerator:fixture.numerator,denominator:fixture.denominator})};
  const fragments={},measurements={};
  for(const label of prepared.labels){
    const fragment=setTypeset({id:label.id,owner:label.target||label.id,factRole:'DERIVED_INTERMEDIATE',fontPx,...(label.math||label.kind==='POINT_NAME'?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    fragments[label.id]=fragment;
  }
  const browser=await launchBrowser(),browserVersion=browser.version(),observedFragments={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const [id,fragment] of Object.entries(fragments)){
      await page.setContent(fragment.svg);
      const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
      if(!(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0))throw Error('RATIONAL_FRAGMENT_BROWSER_MEASUREMENT_MISSING:'+id);
      fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];observedFragments[id]={fragmentSha256:fragment.fragmentSha256,owner:fragment.owner,factRole:fragment.factRole,observedBBox:bbox};
    }
    await page.close();
  }finally{await browser.close();}
  const examRoot=`.tmp/archive/${runId}/${examUid}`,measurementPath=`${examRoot}/visual-engine/production/${fixture.kind}-frozen-fragment-browser-measurements.json`;
  const measurementReceipt={schemaVersion:'PHASE4_RATIONAL_FRAGMENT_BROWSER_MEASUREMENT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runtime:'playwright-chromium',browserVersion,viewport:{width:1440,height:1000},candidateLabelIds:prepared.labels.map(label=>label.id),measurements,observedFragments,typesetterInventory:Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,{fragmentSha256:fragment.fragmentSha256,fontSha256:fragment.fontSha256,fontPx:fragment.fontPx,intrinsic:fragment.intrinsic}]))};
  fs.mkdirSync(path.dirname(path.join(root,measurementPath)),{recursive:true});fs.writeFileSync(path.join(root,measurementPath),JSON.stringify(measurementReceipt,null,2)+'\n',{flag:'wx'});
  const formulaLabel=prepared.labels.find(label=>label.id==='formula');
  let composition=null;
  if(formulaLabel){
    const measuredWidth=measurements[formulaLabel.id][0],padding=24,cap=200,selected=Math.ceil((measuredWidth+padding)*10)/10;
    if(selected>cap)throw Error('RATIONAL_FIXTURE_FORMULA_PANEL_CAP');
    const before=prepared.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text}));
    if(selected>spec.viewport.panel){spec={...spec,viewport:{...spec.viewport,panel:selected}};const adjusted=(await pythonWorker({action:'prepare',spec})).result;const after=adjusted.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text}));if(JSON.stringify(before)!==JSON.stringify(after))throw Error('RATIONAL_PANEL_LABEL_INVENTORY_CHANGED');prepared=adjusted;}
    composition={reason:'MEASURED_FORMULA_PANEL',measuredWidth,padding,priorPanel:140,selectedPanel:selected,cap};
  }
  const built=(await pythonWorker({action:'build',spec,measurements,fragments})).result;
  const expectedNoSafeTickLabel=['pole','hole'].includes(fixture.kind);assert.equal(built.witness.layout.status,expectedNoSafeTickLabel?'POLISH_REQUIRED':'PASS',JSON.stringify(built.witness.layout));
  const staticAudit=(await pythonWorker({graphPlan:plan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,1)},{script:observerScript})).result;
  assert.equal(staticAudit.status,'PASS',JSON.stringify(staticAudit.errors));
  const modelRoot=path.join(root,`${examRoot}/visual-engine/production/rational-model/${fixture.kind}`);fs.mkdirSync(modelRoot,{recursive:true});
  const modelArtifacts={graphPlan:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/graph-plan.json`,value:plan},graphModelSvg:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/graph-model.svg`,value:graphModel.svg},graphModelTransform:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/graph-model-transform.json`,value:graphModel.transform},modelAudit:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/model-audit.json`,value:modelAudit},visualSpec:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/visual-spec.json`,value:spec},finalSvg:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/final.svg`,value:built.svg},staticAudit:{path:`${examRoot}/visual-engine/production/rational-model/${fixture.kind}/static-audit.json`,value:staticAudit}};
  for(const artifact of Object.values(modelArtifacts)){const target=path.join(root,artifact.path);fs.writeFileSync(target,typeof artifact.value==='string'?artifact.value:JSON.stringify(artifact.value,null,2)+'\n',{flag:'wx'});}
  return {graphModel,modelAudit,spec,prepared,built,staticAudit,fragments,measurements,measurementReceipt,measurementPath,composition,modelArtifacts};
}
async function captureArchive({runId,examUid,svgPath,assetPath,sizeClass,fixture}){
  const run=`.tmp/archive/${runId}/${examUid}/visual-engine/production/archive-${sizeClass}`;fs.mkdirSync(path.join(root,run),{recursive:true});
  const candidate=patchBank(runId,examUid,svgPath,assetPath,sizeClass,fixture.content,fixture.answer,fixture.solution);
  const matrix={schemaVersion:'APMATH_PHASE4_RATIONAL_ARCHIVE_MATRIX_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',synthetic:false,engineSha256:fileRef(root,'archive/engine.html').sha256.slice(7),sources:[candidate.info],rows:[{...candidate.info,mode:'sol',viewport:'rational-'+fixture.kind+'-'+sizeClass,width:1440,height:1000,urlPath:archiveUrl(),requireLocalResources:true,requireQrRenderer:true,envelopeTargets:[{id:candidate.assetId,questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:profileOrder,sourceAuthorityStatus:'CONTROLLED_SYNTHETIC_FIXTURE'}]}]};
  fs.writeFileSync(path.join(root,run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n',{flag:'wx'});
  const capture=await recordArchiveEvidence({run,attempt:'rational-'+sizeClass,blockExternalRequests:true});
  const captureFolder=path.join(root,run,'archive-render',`rational-${sizeClass}`),rowName=fs.readdirSync(captureFolder).find(name=>name.endsWith(`-sol-rational-${fixture.kind}-${sizeClass}.json`));assert.ok(rowName);
  const archiveRow=JSON.parse(fs.readFileSync(path.join(captureFolder,rowName),'utf8'));
  assert.ok(archiveRow.id);assert.equal(archiveRow.network.policy,'LOCAL_ONLY');assert.deepEqual(archiveRow.network.externalRequests,[]);
  assert.equal(archiveRow.state.qrRendererAvailable,true);assert.equal(archiveRow.state.mathJaxSource,'local');assert.equal(archiveRow.state.mathJaxCdnFallback,false);
  assert.equal(archiveRow.state.targets[0].sizeClass,sizeClass);
  const normalize=response=>decodeURIComponent(new URL(response.url).pathname);
  const loaded=archiveRow.responses.find(response=>normalize(response)==='/archive/'+assetPath);assert.ok(loaded);assert.equal(loaded.status,200);assert.equal(loaded.sha256,candidate.svgRef.sha256.slice(7));
  const qr=archiveRow.responses.find(response=>normalize(response).endsWith('/archive/vendor/qrious/qrious.min.js'));assert.ok(qr);assert.equal(qr.status,200);assert.equal(qr.sha256,localQrRef.sha256.slice(7));
  return {run,runId,candidate,capture,archiveRow,captureFolder,profiles:archiveRow.state.displayEnvelopes[0].profiles};
}

test('rational pole and removable-hole candidates pass measured Archive profiles in controlled fixtures',async()=>{
  assert.ok(sourceBank.find(row=>row.id===1));
  const fixtures=[
    {kind:'pole',numerator:['1','1'],denominator:['-1','1'],caption:'합성 유리함수 오버뷰',content:'합성 자료에서 함수 y=(x+1)/(x-1)의 그래프를 해석한다.',answer:'x=-1',solution:'실험용 유리함수 그래프 fixture.'},
    {kind:'hole',numerator:['-1','1'],denominator:['-1','1'],caption:'합성 유리함수의 뚫린 점',content:'합성 자료에서 함수 y=(x-1)/(x-1)의 정의역과 그래프를 해석한다.',answer:'x=1 제외',solution:'실험용 removable-hole 그래프 fixture.'}
  ];
  const outcomes=[];
  for(const fixture of fixtures){
    const expectedNoSafeTickLabel=['pole','hole'].includes(fixture.kind);
    const rawPlan={family:'rational',numerator:fixture.numerator,denominator:fixture.denominator,domain:[-4,4],viewport:[-4,4,-4,4],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[]};
    const framed=(await pythonWorker({action:'frame_graph',graphPlan:rawPlan})).result;assert.equal(framed.policy,'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1');
    const runId=`phase4-rational-${fixture.kind}-${crypto.randomUUID()}`,examUid=path.basename(sourcePath,'.js'),candidate=await buildCandidate(framed.graphPlan,fixture,runId,examUid);
    const examRoot=`.tmp/archive/${runId}/${examUid}`,assetPath=`assets/images/${examUid}/q01-solution.svg`,svgPath=`${examRoot}/${assetPath}`;
    fs.mkdirSync(path.dirname(path.join(root,svgPath)),{recursive:true});fs.writeFileSync(path.join(root,svgPath),candidate.built.svg,{flag:'wx'});
    const svgRef=fileRef(root,svgPath);assert.equal(svgRef.sha256,'sha256:'+crypto.createHash('sha256').update(candidate.built.svg).digest('hex'));
    const preflight=await captureArchive({runId:runId+'-preflight',examUid,svgPath,assetPath,sizeClass:'full',fixture});
    const profileAudits=[],profileScreenshots=[];
    for(const profile of profileOrder){
      const measured=preflight.profiles.find(item=>item.sizeClass===profile);assert.ok(measured?.imageRect?.width>0&&measured?.imageRect?.height>0);
      const displayScale=measured.imageRect.width/384;
      const graph=(await pythonWorker({graphPlan:framed.graphPlan,svg:candidate.built.svg,transform:observerTransform(candidate.built.witness.coordinateModel,displayScale)},{script:observerScript})).result;
      const capture=await captureDisplayProfiles({svg:candidate.built.svg,profiles:[{sizeClass:profile,imageRect:measured.imageRect}]});
      const row=capture.rows[0],fonts=row.layout.labelMeasurements.map(label=>label.finalViewportCssFontPx).filter(Number.isFinite),minimumCssFontPx=fonts.length?Math.min(...fonts):null;
      const requiredTickLabelFailures=row.layout.tickLabelEvidence?.filter(entry=>entry.status==='FAIL')||[];if(expectedNoSafeTickLabel)assert.ok(requiredTickLabelFailures.length,JSON.stringify({kind:fixture.kind,profile,layout:row.layout}));
      const status=graph.status==='UNSUPPORTED'?'UNSUPPORTED':graph.status==='PASS'&&row.status==='PASS'&&minimumCssFontPx>=11&&requiredTickLabelFailures.length===0?'PASS':'FAIL';if(expectedNoSafeTickLabel)assert.notEqual(status,'PASS');
      profileAudits.push({sizeClass:profile,status,renderStatus:row.status,displayScale,imageRect:measured.imageRect,minimumCssFontPx,graphStatus:graph.status,graphErrors:graph.errors,layoutErrors:row.layout.errors,requiredTickLabelFailures,rationalOverview:graph.overview});
      const shotPath=path.join(root,examRoot,'visual-engine','production','profile-captures',fixture.kind,profile+'.png');fs.mkdirSync(path.dirname(shotPath),{recursive:true});fs.writeFileSync(shotPath,row.screenshot,{flag:'wx'});
      profileScreenshots.push({sizeClass:profile,path:path.relative(root,shotPath).replaceAll('\\','/'),bytes:row.screenshot.length,sha256:bytesSha(row.screenshot)});
    }
    const passingProfile=profileOrder.slice(profileOrder.indexOf('medium')).find(profile=>profileAudits.find(row=>row.sizeClass===profile)?.status==='PASS'),selectionStatus=passingProfile?'QUALIFYING_PROFILE_SELECTED':'NO_QUALIFYING_PROFILE',selected=passingProfile||'full';
    const final=await captureArchive({runId:runId+'-final',examUid,svgPath,assetPath,sizeClass:selected,fixture});
    const result={schemaVersion:'APMATH_PHASE4_RATIONAL_FIXTURE_RESULT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runId,examUid,capability:'rational-spike-v1',family:fixture.kind,sourceDomain:{kind:'ALL_REALS'},rationalFeatures:framed.graphPlan.rationalFeatures,featurePolicy:framed.graphPlan.rationalFeaturePolicy,candidateLayoutStatus:candidate.built.witness.layout.status,unresolvedTickLabelIds:candidate.built.witness.layout.unresolved,independentMath:{modelAudit:candidate.modelAudit,staticAudit:candidate.staticAudit},frozenFragmentMeasurement:{path:candidate.measurementPath,receipt:candidate.measurementReceipt,bytes:fs.statSync(path.join(root,candidate.measurementPath)).size,sha256:fileRef(root,candidate.measurementPath).sha256},modelArtifacts:candidate.modelArtifacts,measuredPanelComposition:candidate.composition,candidateSvgRef:svgRef,candidateSvgSha256:svgRef.sha256,profileAudits,selectedSizeClass:selected,selectionStatus,archivePreflight:{run:preflight.run,status:preflight.capture.status,archiveRowStatus:preflight.archiveRow.status},actualArchive:{run:final.run,status:final.archiveRow.status,captureStatus:final.capture.status,rowId:final.archiveRow.id,loadedAsset:final.archiveRow.state.targets[0],network:final.archiveRow.network,mathJaxSource:final.archiveRow.state.mathJaxSource,mathJaxCdnFallback:final.archiveRow.state.mathJaxCdnFallback},profileScreenshots,qualificationStatus:'NOT_QUALIFIED',productionAuthorized:false};
    const resultPath=path.join(root,examRoot,'visual-engine','production',fixture.kind+'-publication-result.json');fs.mkdirSync(path.dirname(resultPath),{recursive:true});fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
    outcomes.push({kind:fixture.kind,selectedSizeClass:selected,selectionStatus,profileAudits:profileAudits.map(row=>({sizeClass:row.sizeClass,status:row.status,minimumCssFontPx:row.minimumCssFontPx,graphStatus:row.graphStatus,graphErrors:row.graphErrors,layoutErrors:row.layoutErrors,requiredTickLabelFailures:row.requiredTickLabelFailures})),archiveStatus:final.capture.status,resultPath:path.relative(root,resultPath).replaceAll('\\','/')});
  }
  console.log('RATIONAL_ACTUAL_ARCHIVE_PUBLICATION='+JSON.stringify({classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',outcomes}));
});
