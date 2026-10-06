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
const sourceQuestion=sourceBank.find(row=>row.id===1);
const sourceRef=fileRef(root,sourcePath);
const sourceHex=sourceRef.sha256.slice(7);
const localQrRef=fileRef(root,'archive/vendor/qrious/qrious.min.js');
const observerScript=fileURLToPath(new URL('../production/graph-observer-worker.py',import.meta.url));
const preflightTypographyPx=24.9;
const profileOrder=['small','medium','large','full'];

function archiveUrl(){return '/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));}
function observerTransform(transform,displayScale){const {aspectPolicy,...frame}=transform;return{...frame,displayScale};}
function patchBank(runId,examUid,svgPath,assetPath,sizeClass,content,answer,solution){
  const directory=path.join(root,'.tmp/archive',runId,examUid,'candidates',sizeClass);
  fs.mkdirSync(directory,{recursive:true});
  const candidatePath=`.tmp/archive/${runId}/${examUid}/candidates/${sizeClass}/${examUid}.js`;
  const patch={content,choices:['선택지 1','선택지 2','선택지 3','선택지 4','선택지 5'],answer,solution,solutionImage:assetPath,solutionImageAlt:'합성 cubic/quartic 오버뷰 검증',solutionImageCaption:'실험용 합성 그래프',solutionImageSize:sizeClass};
  fs.writeFileSync(path.join(root,candidatePath),rawSource+'\n;Object.assign(window.questionBank.find(q=>q.id===1),'+JSON.stringify(patch)+');\n',{flag:'wx'});
  const candidateRef=fileRef(root,candidatePath),svgRef=fileRef(root,svgPath);
  const assetId='p4-'+sizeClass+'-'+examUid;
  const info={id:assetId,sourcePath,sourceSha256:sourceHex,candidatePath,candidateSha256:candidateRef.sha256.slice(7),questionCount:sourceBank.length,fixtureClassification:'CONTROLLED_SYNTHETIC_CONTENT',protectedParity:'NOT_APPLICABLE_SYNTHETIC_FIXTURE',assets:[{id:assetId,path:svgPath,archivePath:assetPath,sha256:svgRef.sha256.slice(7),questionId:1,sizeClass}]};
  return {candidateRef,svgRef,info,assetId};
}

async function buildFinalSvg(graphPlan,family,coefficients,runId,examUid){
  const graphModel=(await pythonWorker({action:'graph',graphPlan})).result;
  const modelAudit=(await pythonWorker({graphPlan,svg:graphModel.svg,transform:observerTransform(graphModel.transform,1)},{script:observerScript})).result;
  assert.equal(modelAudit.status,'PASS',modelAudit.errors);
  const plan={capability:'polynomial-spike-v1',graphPlan,caption:family==='cubic'?'3차 함수 오버뷰':'4차 함수 오버뷰'};
  let spec=specFor(plan,graphModel,'phase4-'+family+'-fixture');
  let prepared=(await pythonWorker({action:'prepare',spec})).result;
  const setTypeset=typesetter(),identity={visualAssetKey:objectSha({fixture:family,coefficients})};
  const fragments={},measurements={};
  for(const label of prepared.labels){
    const numericTick=label.kind==='GRAPH_ANNOTATION'&&/^[-−\d.]+$/.test(label.text);
    const fragment=setTypeset({id:label.id,owner:label.target||label.id,factRole:spec.displayFacts.factRolesByLabel?.[label.id]||'DERIVED_INTERMEDIATE',fontPx:preflightTypographyPx,...(label.math||label.kind==='POINT_NAME'||numericTick?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    fragments[label.id]=fragment;
  }
  const browser=await launchBrowser(),browserVersion=browser.version(),observedFragments={};
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    for(const [id,fragment] of Object.entries(fragments)){
      await page.setContent(fragment.svg);
      const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});
      if(!(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0))throw Error('FRAGMENT_BROWSER_MEASUREMENT_MISSING:'+id);
      fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];observedFragments[id]={fragmentSha256:fragment.fragmentSha256,owner:fragment.owner,factRole:fragment.factRole,observedBBox:bbox};
    }
    await page.close();
  }finally{await browser.close();}
  const examRoot=`.tmp/archive/${runId}/${examUid}`,measurementPath=`${examRoot}/visual-engine/production/${family}-frozen-fragment-browser-measurements.json`;
  const measurementReceipt={schemaVersion:'PHASE4_CUBIC_QUARTIC_FRAGMENT_BROWSER_MEASUREMENT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runtime:'playwright-chromium',browserVersion,viewport:{width:1440,height:1000},candidateLabelIds:prepared.labels.map(label=>label.id),measurements,observedFragments,typesetterInventory:Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,{fragmentSha256:fragment.fragmentSha256,fontSha256:fragment.fontSha256,fontPx:fragment.fontPx,intrinsic:fragment.intrinsic}]))};
  const measurementFile=path.join(root,measurementPath);fs.mkdirSync(path.dirname(measurementFile),{recursive:true});fs.writeFileSync(measurementFile,JSON.stringify(measurementReceipt,null,2)+'\n',{flag:'wx'});
  const formulaLabel=prepared.labels.find(label=>label.kind==='EQUATION_LABEL');
  let composition=null;
  if(formulaLabel){
    const priorPanelPx=spec.viewport.panel,panelPaddingPx=24,maximumPanelPx=200;
    const measuredFormulaWidthPx=measurements[formulaLabel.id][0];
    const selectedPanelPx=Math.ceil((measuredFormulaWidthPx+panelPaddingPx)*10)/10;
    if(selectedPanelPx>maximumPanelPx)throw Error('PHASE4_FIXTURE_FORMULA_PANEL_CAP');
    const repairInput={schemaVersion:'PHASE4_CUBIC_QUARTIC_MEASURED_PANEL_INPUT_v1',family,coefficients,graphPlanSha256:objectSha(graphPlan),sourceConditionsSha256:objectSha([]),formulaLabelId:formulaLabel.id,formulaFragmentSha256:fragments[formulaLabel.id].fragmentSha256,measuredFormulaWidthPx,priorPanelPx,panelPaddingPx,maximumPanelPx};
    const repairInputSha256=objectSha(repairInput),repairOutput={repairInputSha256,selectedPanelPx,graphPlanSha256:objectSha(graphPlan),sourceConditionsSha256:objectSha([])};
    const repairOutputSha256=objectSha(repairOutput);
    if(selectedPanelPx>priorPanelPx){
      spec={...spec,viewport:{...spec.viewport,panel:selectedPanelPx}};
      const adjusted=(await pythonWorker({action:'prepare',spec})).result;
      const inventory=labels=>labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text}));
      if(JSON.stringify(inventory(prepared.labels))!==JSON.stringify(inventory(adjusted.labels)))throw Error('PHASE4_FIXTURE_PANEL_LABEL_INVENTORY_CHANGED');
      prepared=adjusted;
    }
    composition={repairInput,repairInputSha256,repairOutput,repairOutputSha256,priorPanelPx,selectedPanelPx,repairReason:'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW'};
  }
  const built=(await pythonWorker({action:'build',spec,measurements,fragments})).result;
  assert.equal(built.witness.layout.status,'PASS',built.witness.layout.unresolved);
  const staticAudit=(await pythonWorker({graphPlan,svg:built.svg,transform:observerTransform(built.witness.coordinateModel,1)},{script:observerScript})).result;
  assert.equal(staticAudit.status,'PASS',JSON.stringify(staticAudit));
  const modelRoot=path.join(root,`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}`);fs.mkdirSync(modelRoot,{recursive:true});
  const modelArtifacts={graphPlan:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/graph-plan.json`,value:graphPlan},graphModelSvg:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/graph-model.svg`,value:graphModel.svg},graphModelTransform:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/graph-model-transform.json`,value:graphModel.transform},modelAudit:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/model-audit.json`,value:modelAudit},visualSpec:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/visual-spec.json`,value:spec},finalSvg:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/final.svg`,value:built.svg},staticAudit:{path:`.tmp/archive/${runId}/${examUid}/visual-engine/production/p4-model/${family}/static-audit.json`,value:staticAudit}};
  for(const artifact of Object.values(modelArtifacts)){const target=path.join(root,artifact.path);fs.writeFileSync(target,typeof artifact.value==='string'?artifact.value:JSON.stringify(artifact.value,null,2)+'\n',{flag:'wx'});}
  return {svg:built.svg,graphModel,modelAudit,spec,prepared,built,staticAudit,fragments,measurements,measurementReceipt,measurementPath,composition,modelArtifacts};
}

async function captureArchive({runId,examUid,svgPath,assetPath,sizeClass,family,coefficients,content,answer,solution}){
  const run=`.tmp/archive/${runId}/${examUid}/visual-engine/production/archive-${sizeClass}`;
  fs.mkdirSync(path.join(root,run),{recursive:true});
  const candidate=patchBank(runId,examUid,svgPath,assetPath,sizeClass,content,answer,solution);
  const envelopeTarget={id:candidate.assetId,questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:profileOrder,sourceAuthorityStatus:'CONTROLLED_SYNTHETIC_FIXTURE'};
  const row={...candidate.info,mode:'sol',viewport:'phase4-'+family+'-'+sizeClass,width:1440,height:1000,urlPath:archiveUrl(),requireLocalResources:true,requireQrRenderer:true,envelopeTargets:[envelopeTarget]};
  const matrix={schemaVersion:'APMATH_PHASE4_POLY34_ARCHIVE_MATRIX_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',synthetic:false,engineSha256:fileRef(root,'archive/engine.html').sha256.slice(7),sources:[candidate.info],rows:[row]};
  fs.writeFileSync(path.join(root,run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n',{flag:'wx'});
  const capture=await recordArchiveEvidence({run,attempt:'phase4-'+sizeClass,blockExternalRequests:true});
  assert.equal(capture.status,'PASS');
  const captureFolder=path.join(root,run,'archive-render','phase4-'+sizeClass);
  const archiveRow=JSON.parse(fs.readFileSync(path.join(captureFolder,candidate.info.id+'-sol-phase4-'+family+'-'+sizeClass+'.json'),'utf8'));
  assert.equal(archiveRow.status,'PASS');assert.equal(archiveRow.network.policy,'LOCAL_ONLY');assert.deepEqual(archiveRow.network.externalRequests,[]);
  assert.equal(archiveRow.state.qrRendererAvailable,true);assert.equal(archiveRow.state.mathJaxSource,'local');assert.equal(archiveRow.state.mathJaxCdnFallback,false);
  assert.equal(archiveRow.state.targets[0].sizeClass,sizeClass);
  const normalized=response=>decodeURIComponent(new URL(response.url).pathname);
  const loaded=archiveRow.responses.find(response=>normalized(response)==='/archive/'+assetPath);
  assert.ok(loaded);assert.equal(loaded.status,200);assert.equal(loaded.sha256,candidate.svgRef.sha256.slice(7));
  const qr=archiveRow.responses.find(response=>normalized(response).endsWith('/archive/vendor/qrious/qrious.min.js'));
  assert.ok(qr);assert.equal(qr.status,200);assert.equal(qr.sha256,localQrRef.sha256.slice(7));
  const envelopes=archiveRow.state.displayEnvelopes[0];assert.equal(envelopes.status,'PASS');
  return {runId,run,candidate,capture,archiveRow,captureFolder,envelopeProfiles:envelopes.profiles};
}

test('cubic/quartic final SVGs pass the measured Archive CSS/profile publication boundary in a synthetic fixture',async()=>{
  assert.ok(sourceQuestion);
  const fixtures=[
    {family:'cubic',coefficients:['0','-3','0','1'],content:'합성 자료에서 함수 y=x³-3x의 그래프를 해석한다.',answer:'x=0, ±√3',solution:'실험용 cubic 그래프 fixture.'},
    {family:'quartic',coefficients:['0','-1','0','0','1'],content:'합성 자료에서 함수 y=x⁴-x의 그래프를 해석한다.',answer:'x=0, 1',solution:'실험용 quartic 그래프 fixture.'}
  ];
  const outcomes=[];
  for(const fixture of fixtures){
    const rawPlan={family:'polynomial',coefficients:fixture.coefficients,domain:[-1,1],viewport:[-1,1,-1,1],sourceDomain:{kind:'ALL_REALS'},requiredPoints:[]};
    const framed=(await pythonWorker({action:'frame_graph',graphPlan:rawPlan})).result;
    assert.equal(framed.policy,'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1');assert.equal(framed.sourceDomainPreserved,true);
    const graphPlan=framed.graphPlan;
    const runId='phase4-poly34-'+fixture.family+'-'+crypto.randomUUID();
    const examUid=path.basename(sourcePath,'.js');
    const candidate=await buildFinalSvg(graphPlan,fixture.family,fixture.coefficients,runId,examUid);
    const examRoot=`.tmp/archive/${runId}/${examUid}`;
    const assetPath=`assets/images/${examUid}/q01-solution.svg`;
    const svgRelative=`${examRoot}/${assetPath}`;
    fs.mkdirSync(path.dirname(path.join(root,svgRelative)),{recursive:true});
    fs.writeFileSync(path.join(root,svgRelative),candidate.svg,{flag:'wx'});
    const svgRef=fileRef(root,svgRelative);
    const preflightId=runId+'-preflight';
    const preflight=await captureArchive({runId:preflightId,examUid,svgPath:svgRelative,assetPath,sizeClass:'full',family:fixture.family,coefficients:fixture.coefficients,content:fixture.content,answer:fixture.answer,solution:fixture.solution});
    const perProfile=[];
    const screenshotProfiles=[];
    for(const profile of profileOrder){
      const measured=preflight.envelopeProfiles.find(row=>row.sizeClass===profile);
      assert.ok(measured?.imageRect&&measured.imageRect.width>0&&measured.imageRect.height>0);
      const displayScale=measured.imageRect.width/384;
      const graphResult=(await pythonWorker({graphPlan,svg:candidate.svg,transform:observerTransform(candidate.built.witness.coordinateModel,displayScale)},{script:observerScript})).result;
      const render=await captureDisplayProfiles({svg:candidate.svg,profiles:[{sizeClass:profile,imageRect:measured.imageRect}]});
      const row=render.rows[0];const cssFonts=row.layout.labelMeasurements.map(label=>label.finalViewportCssFontPx).filter(Number.isFinite);
      const minimumCssFontPx=cssFonts.length?Math.min(...cssFonts):null;
      const status=graphResult.status==='PASS'&&row.status==='PASS'&&minimumCssFontPx>=11?'PASS':'FAIL';
      perProfile.push({sizeClass:profile,status,displayScale,actualImageRect:measured.imageRect,minimumCssFontPx,graphStatus:graphResult.status,graphErrors:graphResult.errors,layoutErrors:row.layout.errors});
      const capturePath=path.join(root,examRoot,'visual-engine','production','profile-captures',fixture.family,profile+'.png');
      fs.mkdirSync(path.dirname(capturePath),{recursive:true});fs.writeFileSync(capturePath,row.screenshot,{flag:'wx'});
      screenshotProfiles.push({sizeClass:profile,path:path.relative(root,capturePath).replaceAll('\\','/'),bytes:row.screenshot.length,sha256:bytesSha(row.screenshot)});
    }
    const requestedIndex=profileOrder.indexOf('medium');
    const selected=profileOrder.slice(requestedIndex).find(profile=>perProfile.find(row=>row.sizeClass===profile)?.status==='PASS');
    assert.ok(selected,JSON.stringify({family:fixture.family,perProfile}));
    const finalRunId=runId+'-final';
    const final=await captureArchive({runId:finalRunId,examUid,svgPath:svgRelative,assetPath,sizeClass:selected,family:fixture.family,coefficients:fixture.coefficients,content:fixture.content,answer:fixture.answer,solution:fixture.solution});
    const result={schemaVersion:'APMATH_PHASE4_CUBIC_QUARTIC_FIXTURE_RESULT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runId,examUid,family:fixture.family,coefficients:fixture.coefficients,sourceDomain:{kind:'ALL_REALS'},overviewPolicy:framed.policy,featureInventory:graphPlan.overviewFeatures,independentMath:{status:candidate.modelAudit.status,topology:candidate.modelAudit.topology,overview:candidate.modelAudit.overview},frozenFragmentMeasurement:{path:candidate.measurementPath,receipt:candidate.measurementReceipt,bytes:fs.statSync(path.join(root,candidate.measurementPath)).size,sha256:fileRef(root,candidate.measurementPath).sha256},modelArtifacts:candidate.modelArtifacts,measuredPanelComposition:candidate.composition,candidateSvgRef:svgRef,candidateSvgSha256:svgRef.sha256,profileAudits:perProfile,selectedSizeClass:selected,selectionPolicy:'smallest passing class at or above medium',archivePreflight:{run:preflight.run,captureStatus:preflight.capture.status,assetResponseSha256:preflight.archiveRow.responses.find(response=>decodeURIComponent(new URL(response.url).pathname)==='/archive/'+assetPath)?.sha256},actualArchive:{run:final.run,status:final.capture.status,rowId:final.archiveRow.id,loadedAsset:final.archiveRow.state.targets[0],network:final.archiveRow.network,qrResponse:final.archiveRow.responses.find(response=>decodeURIComponent(new URL(response.url).pathname).endsWith('/archive/vendor/qrious/qrious.min.js')),mathJaxSource:final.archiveRow.state.mathJaxSource,mathJaxCdnFallback:final.archiveRow.state.mathJaxCdnFallback},profileScreenshots:screenshotProfiles,qualificationStatus:'NOT_QUALIFIED',productionAuthorized:false};
    const resultPath=path.join(root,examRoot,'visual-engine','production',fixture.family+'-publication-result.json');fs.mkdirSync(path.dirname(resultPath),{recursive:true});fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
    outcomes.push({family:fixture.family,selectedSizeClass:selected,profiles:perProfile,archiveStatus:final.capture.status,resultPath:path.relative(root,resultPath).replaceAll('\\','/')});
  }
  console.log('CUBIC_QUARTIC_ACTUAL_ARCHIVE_PUBLICATION='+JSON.stringify({classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',outcomes}));
});
