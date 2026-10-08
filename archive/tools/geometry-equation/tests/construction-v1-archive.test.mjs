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
import {specFor,verifyConstructionConditionBindings} from '../production/phase2.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {typesetter} from '../production/typography.mjs';
import {captureDisplayProfiles} from '../production/display-profile-audit.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {constructionV1Graph,int} from './construction-v1-fixture.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const sourcePath='archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js';
const rawSource=fs.readFileSync(path.join(root,sourcePath),'utf8');
const sourceBank=loadBank(rawSource);
const localQrRef=fileRef(root,'archive/vendor/qrious/qrious.min.js');
const primitiveObserver=fileURLToPath(new URL('../production/primitive-observer-worker.py',import.meta.url));
const profileOrder=['small','medium','large','full'];
const fontPx=24.9;
const fixture={content:'좌표평면에서 O(0,0), A(0,2), B(4,0), C(0,3), X(2,0), Y(0,3), P(5,0)이다. O 중심의 원과 P에서 그은 접선을 작도하고, OB와 평행한 C통과 직선 및 ∠XOY의 내·외각이등분선을 표시하시오. 접선의 길이 PT를 구하시오.',answer:'√21',solution:'접점 T에서 반지름 OT와 접선 PT는 수직이다.\nOP=5, OT=2\nPT²=OP²−OT²\nPT²=21\nPT=√21'};
const sourceConditions=constructionV1Graph.conditionAudits.map(audit=>({id:audit.sourceConditionId,condition:`${audit.kind} 검수: ${audit.refs.join(', ')}`,mappedTo:`construction-node-refs:${audit.refs.join(',')}`}));

function archiveUrl(){return '/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));}
function observerTransform(transform,displayScale){const {aspectPolicy,...frame}=transform;return{...frame,displayScale};}
function patchBank(runId,examUid,svgPath,assetPath,sizeClass){
  const candidatePath=`.tmp/archive/${runId}/${examUid}/candidates/${sizeClass}/${examUid}.js`;fs.mkdirSync(path.dirname(path.join(root,candidatePath)),{recursive:true});
  const patch={content:fixture.content,choices:['√21','21','3','5','해당 없음'],answer:fixture.answer,solution:fixture.solution,solutionImage:assetPath,solutionImageAlt:'원과 외부 점에서 그은 접선의 해설 구성',solutionImageCaption:'원에서 외부 점으로 그은 접선과 반지름의 수직 관계',solutionImageSize:sizeClass};
  fs.writeFileSync(path.join(root,candidatePath),rawSource+'\n;Object.assign(window.questionBank.find(q=>q.id===1),'+JSON.stringify(patch)+');\n',{flag:'wx'});
  const candidateRef=fileRef(root,candidatePath),svgRef=fileRef(root,svgPath),assetId='p4-construction-tangent-'+sizeClass+'-'+examUid;
  const info={id:assetId,sourcePath,sourceSha256:fileRef(root,sourcePath).sha256.slice(7),candidatePath,candidateSha256:candidateRef.sha256.slice(7),questionCount:sourceBank.length,fixtureClassification:'CONTROLLED_SYNTHETIC_CONTENT',protectedParity:'NOT_APPLICABLE_SYNTHETIC_FIXTURE',assets:[{id:assetId,path:svgPath,archivePath:assetPath,sha256:svgRef.sha256.slice(7),questionId:1,sizeClass}]};
  return {candidateRef,svgRef,info,assetId};
}
async function captureArchive({runId,examUid,svgPath,assetPath,sizeClass}){
  const run=`.tmp/archive/${runId}/${examUid}/visual-engine/production/archive-${sizeClass}`;fs.mkdirSync(path.join(root,run),{recursive:true});const candidate=patchBank(runId,examUid,svgPath,assetPath,sizeClass);
  const matrix={schemaVersion:'APMATH_PHASE4_CONSTRUCTION_V1_ARCHIVE_MATRIX_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',synthetic:false,engineSha256:fileRef(root,'archive/engine.html').sha256.slice(7),sources:[candidate.info],rows:[{...candidate.info,mode:'sol',viewport:'construction-tangent-'+sizeClass,width:1440,height:1000,urlPath:archiveUrl(),requireLocalResources:true,requireQrRenderer:true,envelopeTargets:[{id:candidate.assetId,questionId:1,displayOrdinal:1,intrinsicSvg:{width:384,height:320},sizeClasses:profileOrder,sourceAuthorityStatus:'CONTROLLED_SYNTHETIC_FIXTURE'}]}]};
  fs.writeFileSync(path.join(root,run,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n',{flag:'wx'});
  const capture=await recordArchiveEvidence({run,attempt:'construction-tangent-'+sizeClass,blockExternalRequests:true});assert.equal(capture.status,'PASS');
  const captureFolder=path.join(root,run,'archive-render',`construction-tangent-${sizeClass}`),rowName=fs.readdirSync(captureFolder).find(name=>name.endsWith(`-sol-construction-tangent-${sizeClass}.json`));assert.ok(rowName);
  const archiveRow=JSON.parse(fs.readFileSync(path.join(captureFolder,rowName),'utf8'));assert.equal(archiveRow.status,'PASS');assert.equal(archiveRow.network.policy,'LOCAL_ONLY');assert.deepEqual(archiveRow.network.externalRequests,[]);
  assert.equal(archiveRow.state.qrRendererAvailable,true);assert.equal(archiveRow.state.mathJaxSource,'local');assert.equal(archiveRow.state.mathJaxCdnFallback,false);assert.equal(archiveRow.state.targets[0].sizeClass,sizeClass);
  const normalize=response=>decodeURIComponent(new URL(response.url).pathname),loaded=archiveRow.responses.find(response=>normalize(response)==='/archive/'+assetPath),qr=archiveRow.responses.find(response=>normalize(response).endsWith('/archive/vendor/qrious/qrious.min.js'));
  assert.ok(loaded);assert.equal(loaded.status,200);assert.equal(loaded.sha256,candidate.svgRef.sha256.slice(7));assert.ok(qr);assert.equal(qr.status,200);assert.equal(qr.sha256,localQrRef.sha256.slice(7));
  return {run,candidate,capture,archiveRow,profiles:archiveRow.state.displayEnvelopes[0].profiles};
}

test('Construction V1 composite tangent graph passes measured profiles and local Archive as a controlled fixture',async()=>{
  assert.ok(sourceBank.find(row=>row.id===1));
  const math=(await pythonWorker({action:'construction',graph:constructionV1Graph})).result,peer=reconstruct(constructionV1Graph),peerAudit=compareReconstruction(math,peer);
  assert.equal(peerAudit.status,'PASS',JSON.stringify(peerAudit.errors));assert.equal(math.conditionAudits.length,11);assert.ok(math.conditionAudits.every(row=>row.status==='PASS'));
  verifyConstructionConditionBindings({mathPlan:constructionV1Graph,sourceConditions});
  const visualPlan={capability:'construction-spike-v1',mathPlan:constructionV1Graph,sourceConditions,newVisualInformation:['외부 점에서 원에 그은 접선의 접점, 반지름 수직 관계, 접선 길이'],caption:'원 밖의 점에서 그은 접선',displaySegments:[{id:'segment-OP',refs:['O','P']},{id:'segment-OT',refs:['O','contact']},{id:'segment-PT',refs:['P','contact']}],coordinateLabels:['A','P']};
  const spec=specFor(visualPlan,math,'construction-v1-tangent-fixture');
  const visiblePointIds=new Set(['O','A','P','contact']);
  spec.objects=spec.objects.filter(object=>object.kind==='POINT'?visiblePointIds.has(object.id):object.kind==='LINE'?['axisX','axisY','externalTangent','tangentAtA','radiusLine'].includes(object.id):object.kind==='CIRCLE'?['circleO','diameterCircle'].includes(object.id):object.kind==='SEGMENT'||object.kind==='COORDINATE_LABEL');
  spec.axes=false;
  spec.objects.push({id:'T-name',kind:'POINT_NAME',target:'contact',text:'T',priority:0});
  const prepareResponse=await pythonWorker({action:'prepare',spec});assert.equal(prepareResponse.status,'OK',JSON.stringify(prepareResponse.result));const prepared=prepareResponse.result,identity={visualAssetKey:objectSha({fixture:'construction-v1-tangent',nodes:constructionV1Graph.nodes,conditionAudits:constructionV1Graph.conditionAudits})},fragments={},measurements={};
  for(const label of prepared.labels){const role=spec.displayFacts.factRolesByLabel?.[label.id]||'DERIVED_INTERMEDIATE';fragments[label.id]=typesetter()({id:label.id,owner:label.target||label.id,factRole:role,fontPx,...(label.math||label.kind==='POINT_NAME'?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);}
  const browser=await launchBrowser(),browserVersion=browser.version(),observedFragments={};
  try{const page=await browser.newPage({viewport:{width:1440,height:1000}});for(const[id,fragment]of Object.entries(fragments)){await page.setContent(fragment.svg);const bbox=await page.locator('svg').first().evaluate(element=>{const box=element.getBBox(),rect=element.getBoundingClientRect();return{x:box.x,y:box.y,width:box.width,height:box.height,viewportWidth:rect.width,viewportHeight:rect.height};});if(!(bbox.viewportWidth>0&&bbox.viewportHeight>0&&bbox.width>0&&bbox.height>0))throw Error('CONSTRUCTION_FRAGMENT_BROWSER_MEASUREMENT_MISSING:'+id);fragment.observedBBox=bbox;measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];observedFragments[id]={fragmentSha256:fragment.fragmentSha256,owner:fragment.owner,factRole:fragment.factRole,observedBBox:bbox};}await page.close();}finally{await browser.close();}
  const runId=`phase4-construction-v1-${crypto.randomUUID()}`,examUid=path.basename(sourcePath,'.js'),examRoot=`.tmp/archive/${runId}/${examUid}`;console.log('CONSTRUCTION_V1_FIXTURE_STARTED='+JSON.stringify({runId,examUid,operationIds:constructionV1Graph.nodes.map(node=>node.id),conditionAudits:math.conditionAudits,classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE'}));
  const measurementPath=`${examRoot}/visual-engine/production/construction-v1-frozen-fragment-browser-measurements.json`,measurementReceipt={schemaVersion:'PHASE4_CONSTRUCTION_V1_FRAGMENT_BROWSER_MEASUREMENT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runtime:'playwright-chromium',browserVersion,viewport:{width:1440,height:1000},candidateLabelIds:prepared.labels.map(label=>label.id),measurements,observedFragments,typesetterInventory:Object.fromEntries(Object.entries(fragments).map(([id,fragment])=>[id,{fragmentSha256:fragment.fragmentSha256,fontSha256:fragment.fontSha256,fontPx:fragment.fontPx,intrinsic:fragment.intrinsic}]))};
  fs.mkdirSync(path.dirname(path.join(root,measurementPath)),{recursive:true});fs.writeFileSync(path.join(root,measurementPath),JSON.stringify(measurementReceipt,null,2)+'\n',{flag:'wx'});
  const built=(await pythonWorker({action:'build',spec,measurements,fragments})).result;assert.equal(built.witness.layout.status,'PASS',JSON.stringify(built.witness.layout));
  const visiblePoints=Object.fromEntries(spec.objects.filter(object=>object.kind==='POINT').map(object=>[object.id,peer.points[object.id]]));
  const visibleLines=Object.fromEntries(spec.objects.filter(object=>object.kind==='LINE').map(object=>[object.id,peer.lines[object.id]]));
  const visibleCircles=Object.fromEntries(spec.objects.filter(object=>object.kind==='CIRCLE').map(object=>[object.id,peer.circles[object.id]]));
  const staticAudit=(await pythonWorker({svg:built.svg,points:visiblePoints,lines:visibleLines,circles:visibleCircles,segments:visualPlan.displaySegments,rightAngles:[],transform:built.witness.coordinateModel,fragments,coordinateMode:math.coordinateMode},{script:primitiveObserver})).result;
  assert.equal(staticAudit.status,'PASS',JSON.stringify(staticAudit.errors));
  const modelDir=path.join(root,`${examRoot}/visual-engine/production/construction-v1-model`);fs.mkdirSync(modelDir,{recursive:true});
  const modelArtifacts={typedConstructionGraph:{path:`${examRoot}/visual-engine/production/construction-v1-model/typed-graph.json`,value:constructionV1Graph},sympyModel:{path:`${examRoot}/visual-engine/production/construction-v1-model/sympy-model.json`,value:math},cindyPeer:{path:`${examRoot}/visual-engine/production/construction-v1-model/cindy-peer.json`,value:peer},cindyConditionComparison:{path:`${examRoot}/visual-engine/production/construction-v1-model/cindy-comparison.json`,value:peerAudit},visualSpec:{path:`${examRoot}/visual-engine/production/construction-v1-model/visual-spec.json`,value:spec},staticSvgAudit:{path:`${examRoot}/visual-engine/production/construction-v1-model/static-svg-audit.json`,value:staticAudit},finalSvg:{path:`${examRoot}/visual-engine/production/construction-v1-model/final.svg`,value:built.svg}};
  for(const artifact of Object.values(modelArtifacts)){const target=path.join(root,artifact.path);fs.writeFileSync(target,typeof artifact.value==='string'?artifact.value:JSON.stringify(artifact.value,null,2)+'\n',{flag:'wx'});}
  const assetPath=`assets/images/${examUid}/q01-solution.svg`,svgPath=`${examRoot}/${assetPath}`;fs.mkdirSync(path.dirname(path.join(root,svgPath)),{recursive:true});fs.writeFileSync(path.join(root,svgPath),built.svg,{flag:'wx'});const svgRef=fileRef(root,svgPath);assert.equal(svgRef.sha256,'sha256:'+crypto.createHash('sha256').update(built.svg).digest('hex'));
  const preflight=await captureArchive({runId:runId+'-preflight',examUid,svgPath,assetPath,sizeClass:'full'}),profileAudits=[],profileScreenshots=[];
  for(const profile of profileOrder){const measured=preflight.profiles.find(row=>row.sizeClass===profile);assert.ok(measured?.imageRect?.width>0&&measured?.imageRect?.height>0);const capture=await captureDisplayProfiles({svg:built.svg,profiles:[{sizeClass:profile,imageRect:measured.imageRect}]}),row=capture.rows[0],fonts=row.layout.labelMeasurements.map(label=>label.finalViewportCssFontPx).filter(Number.isFinite),minimumCssFontPx=fonts.length?Math.min(...fonts):null,status=row.status==='PASS'&&minimumCssFontPx>=11?'PASS':'FAIL';profileAudits.push({sizeClass:profile,status,imageRect:measured.imageRect,displayScale:measured.imageRect.width/384,minimumCssFontPx,layoutErrors:row.layout.errors});const screenshotPath=path.join(root,examRoot,'visual-engine','production','profile-captures',profile+'.png');fs.mkdirSync(path.dirname(screenshotPath),{recursive:true});fs.writeFileSync(screenshotPath,row.screenshot,{flag:'wx'});profileScreenshots.push({sizeClass:profile,path:path.relative(root,screenshotPath).replaceAll('\\','/'),bytes:row.screenshot.length,sha256:bytesSha(row.screenshot)});}
  const selected=profileOrder.find(profile=>profileAudits.find(row=>row.sizeClass===profile)?.status==='PASS');assert.ok(selected,JSON.stringify(profileAudits));const final=await captureArchive({runId:runId+'-final',examUid,svgPath,assetPath,sizeClass:selected});
  const result={schemaVersion:'APMATH_PHASE4_CONSTRUCTION_V1_FIXTURE_RESULT_v1',classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',runId,examUid,capability:'construction-spike-v1',sourceConditions,typedGraph:constructionV1Graph,conditionAudits:math.conditionAudits,cindyComparison:peerAudit,staticSvgAudit:staticAudit,modelArtifacts,candidateSvgRef:svgRef,candidateSvgSha256:svgRef.sha256,frozenFragmentMeasurement:{path:measurementPath,receipt:measurementReceipt,bytes:fs.statSync(path.join(root,measurementPath)).size,sha256:fileRef(root,measurementPath).sha256},profileAudits,selectedSizeClass:selected,archivePreflight:{run:preflight.run,status:preflight.capture.status},actualArchive:{run:final.run,status:final.capture.status,rowId:final.archiveRow.id,loadedAsset:final.archiveRow.state.targets[0],network:final.archiveRow.network,mathJaxSource:final.archiveRow.state.mathJaxSource,mathJaxCdnFallback:final.archiveRow.state.mathJaxCdnFallback},profileScreenshots,qualificationStatus:'NOT_QUALIFIED',productionAuthorized:false};
  const resultPath=path.join(root,examRoot,'visual-engine/production/construction-v1-publication-result.json');fs.mkdirSync(path.dirname(resultPath),{recursive:true});fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log('CONSTRUCTION_V1_ACTUAL_ARCHIVE='+JSON.stringify({classification:'CONTROLLED_SYNTHETIC_CONTENT_FIXTURE',conditionAuditCount:math.conditionAudits.length,profileAudits,selectedSizeClass:selected,archiveStatus:final.capture.status,resultPath:path.relative(root,resultPath).replaceAll('\\','/')}));
});
