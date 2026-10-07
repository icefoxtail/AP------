import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {invokeVisualContinuation,nativeImageInput} from '../../../../alive/runtime/provider-bridge/codex-appserver-adapter.mjs';
import {canonicalJson,objectSha,bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {questionUidV2} from '../../pipeline-core/question-uid.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence,measureArchiveDisplayEnvelope} from '../record-visual-browser-evidence.mjs';
import {assetIdentity,planHash} from './contracts.mjs';
import {commitStage,generatedPath,currentWorkRoot,bindRunWorkspace,withWorkRoot,isEngineOutputPath,calculationStage} from './store.mjs';
import {pythonWorker} from './worker.mjs';
import {reconstruct,compareReconstruction} from './cindy-observer.mjs';
import {dependency,dependencyRoot} from './dependencies.mjs';
import {typesetter} from './typography.mjs';
import {scopeFingerprint,mathFingerprint} from './fingerprint.mjs';
import {captureDisplayProfiles} from './display-profile-audit.mjs';
import {planDisplayEnvelope,qualifyDisplayEnvelope,compareActualDisplayEnvelope,requestedProfileTypographyPolicy} from './display-envelope.mjs';
import {RepairBudget} from './repair-budget.mjs';
import {bindMeasuredOwnerSafeLabelRepair} from './layout-repair.mjs';
import {auditMeasuredOwnerSafeLabelRepair} from './layout-repair-audit.mjs';
import {SOURCE_REVIEW_INSTRUCTION,sourcePolicyFingerprint,verifiedSolutionPolicyFingerprint,sourceReviewClosed,verificationClosed} from './source-policy.mjs';

import {resolveQuestion,runQuestion} from './resolve-request.mjs';
import {blindThenCompare,reuseReviewAuthority,verificationBinding,conditionBinding} from './blinded-review.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const schema={type:'object',properties:{status:{type:'string',enum:['PASS','FAIL','UNSUPPORTED']},payload:{type:'string'}},required:['status','payload'],additionalProperties:false};
const compilerContract=`Return payload as a JSON object. For geometry: {capability:'construction-spike-v1',mathPlan:{schemaVersion:'construction-spike-v1',nodes:[...]},displaySegments:[{id,refs:[pointId,pointId]}],coordinateLabels:[pointId],caption:string}. Each node has id (ASCII alphanumeric starts letter), op, inputs, args, outputType, factRole GIVEN/DERIVED_INTERMEDIATE/CONCLUSION. Supported ops SOURCE_POINT (args coordinates=[typedScalar,typedScalar]), NORMALIZATION_ORIGIN(args {}), NORMALIZATION_AXIS(args length=typedScalar), MIDPOINT, LINE_THROUGH, PERPENDICULAR_FOOT, CIRCLE_CENTER_RADIUS(args radius=typedScalar), INTERSECTION (POINT_SET), SELECT_POINT (branch {kind:'SIDE_OF_ORIENTED_LINE',refs:[A,B],sign:1|-1}). All other point outputs POINT, lines LINE, circles CIRCLE. Derived points must never have raw coordinates. typedScalar={kind:'integer',value:'decimal integer'} or {kind:'rational',numerator:'...',denominator:'...'} or {kind:'expression',op:'sqrt'|'add'|'sub'|'mul'|'div'|'neg'|'pow',args:[typedScalars]}. For coordinate-free SSS use realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true} inside mathPlan, A origin, B positive x at source AB distance, C selected positive side of two circles. Use source length values, and compute any necessary missing distance exactly from verified solution (e.g sqrt(34)). Explicitly state source bindings for each introduced normalization/label in conditions. Do not add unused construction circles to displaySegments. For a polynomial source graph only: {capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['constant','x coefficient','x squared coefficient',...],domain:[lo,hi],viewport:[xmin,xmax,ymin,ymax]},caption:string}. Coefficients are exact integer or rational strings; max degree4. Domain/viewports must show the source's decisive structure. Declare sourceDomain:{kind:'ALL_REALS'} only when the source polynomial has no restriction; otherwise declare {kind:'INTERVAL',range:[lo,hi]}. Preserve all source-required points/tangency anchors/intercepts as requiredPoints:[{id:string,x:number,y:number}]; these are independently reviewed source/solution features, never convenient invented points. The main overview must show the vertex and enough of both arms to make the opening and symmetry legible. A local detail cannot replace the overview. Do not guess symbolic coefficients. Reject unsupported source. caption is short student-facing Korean, with no internal/debug terms. Either plan must have sourceConditions:[{id,condition,mappedTo}] and newVisualInformation:[string] and no unsupported source condition. No SVG, raw derived coordinates, or measurements.`;
const CUBIC_QUARTIC_CONTRACT=` IF AND ONLY IF the source visual is a polynomial graph of exact degree 3 or 4, apply this separate bounded contract; otherwise ignore this clause and follow the existing geometry/quadratic rules. Such cubic/quartic graph coefficients must have exact degree 3 or 4 and sourceDomain must be exactly {kind:'ALL_REALS'}; restricted intervals are unsupported in this slice. Do not apply quadratic vertex framing to these graphs. The overview framer derives and binds all real roots, derivative roots (extrema or stationary inflections), inflection points, multiplicities, and left/right tail directions from the exact coefficient strings. The independent observer must recompute this inventory from the source polynomial and check every feature and tail against the final rendered polyline. Repeated source roots and root/feature separations below one actual CSS pixel at the audited profile are unsupported. Do not invent source-required points; preserve those separately in requiredPoints.`;
const RATIONAL_CONTRACT=` IF AND ONLY IF the source visual is a rational graph of capability 'rational-spike-v1', apply this separate bounded contract. graphPlan.family must be 'rational', numerator and denominator must each be exactly two integer/rational coefficient strings in ascending powers, the x coefficient of each must be nonzero, and sourceDomain must be exactly {kind:'ALL_REALS'} (meaning no additional interval restriction; natural denominator exclusions remain). The denominator therefore has exactly one simple real root. The numerator either does not vanish there (one vertical pole) or vanishes there (one removable hole); the overview must mark that pole or open hole and the exact horizontal asymptote y=numeratorLeading/denominatorLeading. Preserve the original denominator exclusion even when it cancels. The observer independently recomputes the singularity kind/location, horizontal asymptote, numerator zero, and visible branch coverage from exact coefficients, then checks pole-side separation, asymptote markers, and hole marker on the final SVG. Numerator/denominator degree above one, multiple denominator roots, nonreal denominator roots, oblique asymptotes, additional source intervals, and sub-resolution features are unsupported. No polynomial quadratic/cubic framing clause applies to this rational family.`;
const SQRT_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is the square root of a positive-slope affine radicand, use the distinct capability 'sqrt-affine-spike-v1' and graphPlan.family 'sqrt-affine'. radicand must be exactly [constant,positive x coefficient] as integer/rational strings. sourceDomain must be exactly {kind:'NATURAL_SQRT_AFFINE'} for the full natural x>=root domain, or {kind:'CLOSED_INTERVAL',range:[exact lower,exact upper]} for a closed finite source interval at or above the exact radicand root. For the natural mode the sampled domain starts exactly at that root; for CLOSED_INTERVAL the sampled domain must equal the source interval byte-for-byte in numeric value and must never be expanded. Open intervals, intervals below the root, nonpositive slopes, nonlinear or mixed radicands, and unreviewed compositions are unsupported. Derive and mark every closed source endpoint. Independently verify the final curve begins/ends at the bound endpoint(s), contains no points before the radicand root, and increases rightward. The viewport may have a display-only left margin before the root, but that margin is not part of the sampled domain.`;async function provider(purpose,packet,images,traceDir,allowFailure=false){
  const response=await invokeVisualContinuation({root,traceDir,purpose,input:[{type:'text',text:canonicalJson(packet)},...images.map(nativeImageInput)],outputSchema:schema});
  const payload=parseVisualProviderPayload(response,purpose);
  if(response.output.status!=='PASS'&&!allowFailure)throw Error(purpose+':'+response.output.status+':'+response.output.payload);
  return {...response,payload,inputPacket:packet,inputSha256:objectSha(packet),imageShas:images.map(i=>bytesSha(Buffer.from(i.split(',')[1],'base64')))};
}
export function parseVisualProviderPayload(response,purpose='UNKNOWN_PROVIDER_PURPOSE'){
  const text=typeof response?.output?.payload==='string'?response.output.payload:null;
  try{if(text===null)throw Error('VISUAL_PROVIDER_PAYLOAD_STRING_REQUIRED');return JSON.parse(text);}
  catch(error){
    const safeError=Error('VISUAL_PROVIDER_PAYLOAD_JSON_INVALID');
    safeError.code='VISUAL_PROVIDER_PAYLOAD_JSON_INVALID';
    safeError.providerParserErrorName=error?.name||'Error';
    safeError.providerParserErrorCode=error?.code||null;
    safeError.providerPurpose=purpose;
    safeError.providerPayloadSha256=text===null?null:bytesSha(Buffer.from(text,'utf8'));
    safeError.providerRawOutputSha256=typeof response?.rawOutput==='string'?bytesSha(Buffer.from(response.rawOutput,'utf8')):null;
    safeError.providerInvocationId=response?.providerInvocationId??null;
    safeError.providerContextId=response?.contextId??null;
    safeError.providerTerminalStatus=response?.providerTerminalStatus??null;
    safeError.providerProcessCleanup=response?.providerProcessCleanup??null;
    throw safeError;
  }
}
function receipt(stage,outputs,provenance){return commitStage(root,{stage,key:objectSha({outputsSha:Object.fromEntries(Object.entries(outputs).map(([k,v])=>[k,bytesSha(Buffer.from(v))])),invocation:crypto.randomUUID()}),outputs,provenance});}
function freeze(stage,value,provenance){return receipt(stage,{[stage.toLowerCase()+'.json']:canonicalJson(value)},provenance);}
async function worker(payload){const r=await pythonWorker(payload);if(r.status!=='OK')throw Error(r.result.code);return r.result;}
function envelopePolicyRefs(){
  return [
    {name:'archive-engine',ref:fileRef(root,'archive/engine.html')},
    {name:'archive-capture',ref:fileRef(root,'archive/tools/geometry-equation/record-visual-browser-evidence.mjs')},
    {name:'display-envelope-contract',ref:fileRef(root,'archive/tools/geometry-equation/production/display-envelope.mjs')},
    {name:'display-typography',ref:fileRef(root,'archive/tools/geometry-equation/production/typography.mjs')},
    {name:'rendered-layout-observer',ref:fileRef(root,'archive/tools/geometry-equation/verify-rendered-layout.mjs')},
    {name:'source-review-policy',ref:fileRef(root,'archive/tools/geometry-equation/production/source-policy.mjs')},
    {name:'verified-solution-policy',ref:fileRef(root,'archive/tools/geometry-equation/production/blinded-review.mjs')}
  ];
}
function pngSize(bytes){
  if(!Buffer.isBuffer(bytes)||bytes.length<24||bytes.toString('hex',0,8)!=='89504e470d0a1a0a'||bytes.toString('ascii',12,16)!=='IHDR')throw Error('ARCHIVE_SCREENSHOT_PNG_REQUIRED');
  return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
}
async function actualArchiveEnvelopePreflight({identity,folder,questionUid,sourcePath,ordinal,sourceRef,solutionRef,intrinsicSvg,sourceAuthorityStatus,signal,onProgress}){
  process.env.GEOMETRY_NODE_MODULES ||= path.join(dependencyRoot,'node_modules');
  const targetId=identity.assetId,preflightRun=path.join(folder,'display-envelope-preflight');fs.mkdirSync(preflightRun,{recursive:true});
  const measured=await measureArchiveDisplayEnvelope({run:preflightRun,sourceRef,sourceOrdinal:ordinal,targetId,questionUid,intrinsicSvg,sourceAuthorityStatus,signal,onProgress,blockExternalRequests:true});
  if(measured.status!=='PASS')throw Error('ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL');
  const rowName=fs.readdirSync(measured.captureFolder).find(name=>name.endsWith('-sol-desktop-envelope.json'));
  const contextName=fs.readdirSync(measured.captureFolder).find(name=>name.endsWith('-'+targetId+'-envelope-context.png'));
  if(!rowName||!contextName)throw Error('ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_RAW_CAPTURE_REQUIRED');
  const screenshotBytes=fs.readFileSync(path.join(measured.captureFolder,contextName));
  const captureReceipt=receipt('DISPLAY_ENVELOPE_CAPTURE',{
    'archive-row.json':fs.readFileSync(path.join(measured.captureFolder,rowName)),
    'archive-context.png':screenshotBytes,
    'archive-matrix.json':fs.readFileSync(path.join(preflightRun,'archive-render-matrix.json'))
  },{identity,questionUid,sourceRef,solutionRef,measurementOnly:true});
  const archiveRowRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/archive-row.json'));
  const screenshotRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/archive-context.png'));
  const policyRefs=envelopePolicyRefs(),archiveEngineSha256=policyRefs.find(item=>item.name==='archive-engine').ref.sha256;
  const measurement={schemaVersion:'DISPLAY_ENVELOPE_PREFLIGHT_v1',status:'PASS',synthetic:false,runtime:measured.observation.runtime,browserVersion:measured.observation.browserVersion,questionUid,targetId,sourceRef,solutionRef,candidateRef:measured.candidateRef,archiveRowRef,screenshotRef,screenshotViewport:pngSize(screenshotBytes),observation:measured.observation,sourceAuthorityStatus,matrixSha256:measured.matrixSha256};
  const measurementReceipt=receipt('DISPLAY_ENVELOPE_PREFLIGHT',{'preflight.json':canonicalJson(measurement)},{identity,questionUid,sourceRef,solutionRef,policyRefs,archiveEngineSha256,measurementOnly:true});
  const preflightEvidence={measurementRef:measurementReceipt.outputs[0],archiveRowRef,screenshotRef};
  return {status:'PASS',measurement,observation:measured.observation,preflightEvidence,policyRefs,archiveEngineSha256,stages:[captureReceipt,measurementReceipt]};
}
async function auditCandidateProfiles({svg,plan,candidateSvgRef,sourceRef,solutionRef,policyRefs,identity,provenance,graphPlan,geometryStaticAudit,coordinateModel,expectedPrimitiveIds}){
  const browserCaptures=await captureDisplayProfiles({svg,profiles:plan.profiles}),profileAudits=[],stageReceipts=[];
  for(const capture of browserCaptures.rows){
    const profile=plan.profiles.find(item=>item.sizeClass===capture.sizeClass),profileProvenance={...provenance,identity,candidateSvgRef,questionUid:identity.questionUid,sizeClass:profile.sizeClass,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale};
    const screenshotReceipt=receipt('DISPLAY_PROFILE_SCREENSHOT',{[profile.sizeClass+'.png']:capture.screenshot},profileProvenance);stageReceipts.push(screenshotReceipt);
    const screenshotRef=screenshotReceipt.outputs[0];let graphRequired=!!graphPlan,graphStatus='NOT_APPLICABLE',graphEvidenceRef=null,topologyStatus='FAIL',topologyEvidenceRef=null,topologyPayload;
    if(graphPlan){
      const graph=await workerGraphAudit(graphPlan,svg,{...coordinateModel,displayScale:profile.displayScale});
      graphStatus=graph.status==='PASS'?'PASS':'FAIL';
      const graphEvidence={schemaVersion:'DISPLAY_PROFILE_GRAPH_AUDIT_v1',status:graphStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,graph};
      const graphReceipt=receipt('DISPLAY_PROFILE_GRAPH',{[profile.sizeClass+'.json']:canonicalJson(graphEvidence)},profileProvenance);stageReceipts.push(graphReceipt);graphEvidenceRef=graphReceipt.outputs[0];
      const nonOverviewErrors=(graph.errors||[]).filter(error=>!String(error).startsWith('OVERVIEW_'));
      topologyStatus=graph.topology&&nonOverviewErrors.length===0?'PASS':'FAIL';
      topologyPayload={schemaVersion:'DISPLAY_PROFILE_TOPOLOGY_AUDIT_v1',status:topologyStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,graphStatus,overviewStatus:graph.overview?.status||'NOT_REPORTED',topologyErrors:nonOverviewErrors,topology:graph.topology||null,observedGraphSegments:graph.segments||[]};
    }else{
      const observedIds=new Set(capture.capture.geometry.map(item=>item.id)),missingPrimitiveIds=expectedPrimitiveIds.filter(id=>!observedIds.has(id));
      const validGeometry=capture.capture.geometry.length>0&&capture.capture.geometry.every(item=>item.id&&Number.isFinite(item.strokeWidthPx)&&item.strokeWidthPx>=0&&item.client&&['x','y','width','height'].every(key=>Number.isFinite(item.client[key])));
      topologyStatus=geometryStaticAudit.status==='PASS'&&validGeometry&&missingPrimitiveIds.length===0?'PASS':'FAIL';
      topologyPayload={schemaVersion:'DISPLAY_PROFILE_TOPOLOGY_AUDIT_v1',status:topologyStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,expectedPrimitiveIds,missingPrimitiveIds,geometry:capture.capture.geometry,svgRect:capture.capture.svg,viewBox:capture.capture.viewBox};
    }
    const topologyReceipt=receipt('DISPLAY_PROFILE_TOPOLOGY',{[profile.sizeClass+'.json']:canonicalJson(topologyPayload)},profileProvenance);stageReceipts.push(topologyReceipt);topologyEvidenceRef=topologyReceipt.outputs[0];
    const strokeMeasurements=capture.capture.geometry.map(item=>({id:item.id,sizeClass:profile.sizeClass,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,kind:item.kind,finalViewportCssStrokePx:item.strokeWidthPx,client:item.client,displayScale:profile.displayScale}));
    const strokeValid=strokeMeasurements.length>0&&strokeMeasurements.every(item=>Number.isFinite(item.finalViewportCssStrokePx)&&item.finalViewportCssStrokePx>=0);
    const errors=[...capture.layout.errors,...(topologyStatus==='PASS'?[]:['PROFILE_TOPOLOGY_INVENTORY_FAIL']),...(graphRequired&&graphStatus!=='PASS'?['PROFILE_GRAPH_AUDIT_FAIL']:[]),...(strokeValid?[]:['PROFILE_STROKE_MEASUREMENT_FAIL'])];
    const measurement={schemaVersion:'DISPLAY_PROFILE_AUDIT_v1',status:errors.length?'FAIL':'PASS',questionUid:identity.questionUid,sizeClass:profile.sizeClass,synthetic:false,runtime:capture.runtime,browserVersion:capture.browserVersion,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,naturalWidth:plan.intrinsicSvg.width,naturalHeight:plan.intrinsicSvg.height,sourceRef,solutionRef,policyRefs,inputIdentitySha256:plan.inputIdentitySha256,archiveEngineSha256:plan.archiveEngineSha256,imageRect:capture.imageRect,computedStyle:profile.computedStyle,profilePolicySha256:profile.profilePolicySha256,screenshotViewport:capture.screenshotViewport,screenshotRef,labelMeasurements:capture.layout.labelMeasurements.map(item=>({id:item.id,finalViewportCssFontPx:item.finalViewportCssFontPx,baseFontPx:item.baseFontPx,kind:item.kind,client:item.client,bbox:item.bbox})),layoutStatus:capture.layout.status,graphRequired,graphStatus,graphEvidenceRef,topologyRequired:true,topologyStatus,topologyEvidenceRef,strokeStatus:strokeValid?'PASS':'FAIL',strokeMeasurements,rawCapture:capture.capture,errors};
    const measurementReceipt=receipt('DISPLAY_PROFILE_MEASUREMENT',{[profile.sizeClass+'.json']:canonicalJson(measurement)},profileProvenance);stageReceipts.push(measurementReceipt);profileAudits.push({sizeClass:profile.sizeClass,measurementRef:measurementReceipt.outputs[0]});
  }
  const envelope=qualifyDisplayEnvelope(plan,{root,candidateSvgRef,profileAudits});
  const envelopeReceipt=freeze('DISPLAY_ENVELOPE_AUDIT',{schemaVersion:'DISPLAY_ENVELOPE_CANDIDATE_AUDIT_v1',classification:'ACTUAL_CANDIDATE_PROFILE_AUDITS',candidateSvgRef,planSha256:objectSha(plan),profileAudits,envelope},provenance);stageReceipts.push(envelopeReceipt);
  return {envelope,profileAudits,stageReceipts,browserCaptures:{status:browserCaptures.status,runtime:browserCaptures.runtime,synthetic:browserCaptures.synthetic,browserVersion:browserCaptures.browserVersion}};
}
export function specFor(plan,model,id){
  if(plan.capability==='sqrt-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.sqrtFeatures;
    if(!features||features.schemaVersion!=='SQRT_AFFINE_FEATURES_v1')throw Error('SQRT_ENDPOINT_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const polynomialText=values=>{const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');};
    const expression='sqrt('+polynomialText(p.radicand)+')',showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const boundary=exactNumber(features.radicandBoundaryX),start=exactNumber(features.sourceEndpoints[0].x),slope=exactNumber(p.radicand[1]),plotSy=256/(v[3]-v[2]);
    const criticalX=features.sourceEndpoints.map(endpoint=>exactNumber(endpoint.x));
    if(Math.abs(start-boundary)<1e-10){const boundaryStep=(1.2/(plotSy*Math.sqrt(slope)))**2;if(boundary+boundaryStep<p.domain[1])criticalX.push(boundary+boundaryStep);}
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'formula',kind:'EQUATION_LABEL',text:'y='+expression,at:[v[0]+(v[1]-v[0])*.22,v[3]-(v[3]-v[2])*.12],priority:0}];
    if(features.sourceEndpoints.length>1){const end=features.sourceEndpoints[1];objects.push({id:'sqrt-source-end-label',kind:'GRAPH_ANNOTATION',text:'x='+end.x,at:[exactNumber(end.x)-(v[1]-v[0])*.08,exactNumber(end.y)+(v[3]-v[2])*.08],math:true,priority:0});}
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{sqrtFeatures:features,sqrtFeaturePolicy:p.sqrtFeaturePolicy},objects};
  }
  if(plan.capability==='rational-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.rationalFeatures;
    if(!features||features.schemaVersion!=='RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1')throw Error('RATIONAL_FEATURE_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const polynomialText=values=>{
      const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
      return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');
    };
    const numerator=polynomialText(p.numerator),denominator=polynomialText(p.denominator),expression='('+numerator+')/('+denominator+')';
    const singularity=features.singularity,xSingularity=exactNumber(singularity.x),yAsymptote=exactNumber(features.horizontalAsymptoteY),objects=[
      {id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,breaks:[xSingularity],criticalX:features.xIntercept===null?[]:[exactNumber(features.xIntercept)]},
      {id:'formula',kind:'EQUATION_LABEL',text:'y='+expression,at:[v[0]+(v[1]-v[0])*.25,v[3]-(v[3]-v[2])*.12],priority:0},
      {id:'horizontal-asymptote-label',kind:'GRAPH_ANNOTATION',text:'y='+features.horizontalAsymptoteY,at:[v[0]+(v[1]-v[0])*.72,yAsymptote+(v[3]-v[2])*.07],math:true,priority:0}
    ];
    if(singularity.kind==='VERTICAL_POLE')objects.push({id:'vertical-asymptote-label',kind:'GRAPH_ANNOTATION',text:'x='+singularity.x,at:[xSingularity+(v[1]-v[0])*.07,v[3]-(v[3]-v[2])*.08],math:true,priority:0});
    else if(singularity.kind==='REMOVABLE_HOLE')objects.push({id:'removable-hole-label',kind:'GRAPH_ANNOTATION',text:'뚫린 점',at:[xSingularity+(v[1]-v[0])*.08,exactNumber(singularity.y)+(v[3]-v[2])*.08],priority:0});
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{rationalGraphFeatures:features,rationalGraphPolicy:p.rationalFeaturePolicy},objects};
  }
  if(plan.capability==='polynomial-spike-v1'){
    const p=plan.graphPlan,v=p.viewport;const terms=p.coefficients.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    const expr=terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c;const coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join('');
    const framedCriticalX=(p.overviewFeatures||[]).filter(feature=>feature.kind==='POLYNOMIAL_FEATURE').map(feature=>feature.x);
    const criticalX=[...new Set([...(p.requiredPoints||[]).map(point=>point.x),...framedCriticalX])];
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{},objects:[{id:'f',kind:'FUNCTION_GRAPH',expression:expr,domain:p.domain,criticalX},{id:'formula',kind:'EQUATION_LABEL',text:'y='+expr,at:[v[0]+(v[1]-v[0])*.3,v[3]-(v[3]-v[2])*.12]}]};
  }
  const points=model.points;const xs=Object.values(points).map(p=>p.approximation[0]),ys=Object.values(points).map(p=>p.approximation[1]);
  const span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1),pad=span*.35;
  const objects=Object.entries(points).map(([name,p])=>({id:name,kind:'POINT',at:p.approximation}));const notationByLabel={},factRolesByLabel={};
  for(const s of plan.displaySegments||[]){if(!points[s.refs[0]]||!points[s.refs[1]])throw Error('DISPLAY_SEGMENT_UNKNOWN_REF');objects.push({id:s.id,kind:'SEGMENT',from:points[s.refs[0]].approximation,to:points[s.refs[1]].approximation});}
  for(const id of plan.coordinateLabels||[]){const node=plan.mathPlan.nodes.find(n=>n.id===id);if(node?.op!=='SOURCE_POINT')throw Error('ONLY_SOURCE_COORDINATE_LABEL_SUPPORTED');objects.push({id:id+'-coordinate',kind:'COORDINATE_LABEL',target:id,exact:node.args.coordinates.map(v=>v.kind==='integer'?v.value:v.kind==='rational'?v.numerator+'/'+v.denominator:(()=>{throw Error('UNSUPPORTED_COORDINATE_NOTATION');})())});}
  for(const label of plan.scalarLabels||[]){
    const scalar=model.scalars[label.nodeId];if(!scalar)throw Error('SCALAR_LABEL_UNKNOWN_NODE');
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment)throw Error('SCALAR_LABEL_OWNER_MISSING');
    const [a,b]=segment.refs.map(r=>points[r].approximation);
    const role=plan.mathPlan.nodes.find(n=>n.id===label.nodeId).factRole;
    const sourceLength=!!label.unit&&role!=='CONCLUSION';
    const id=label.nodeId+'-value';objects.push({id,kind:sourceLength?'LENGTH_LABEL':'EQUATION_LABEL',target:label.ownerSegment,...(sourceLength?{refs:[label.ownerSegment],value:scalar.approximation}:{}),text:(sourceLength?'':label.prefix+'=')+scalarExpression(scalar.exact),at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[id]={...(!sourceLength&&/^[A-Z]{2}$/.test(label.prefix)?{entity:label.prefix}:{}),...(label.unit?{unit:label.unit}:{})};factRolesByLabel[id]=role;
  }
  for(const label of plan.segmentLabels||[]){
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment||!/^[A-Za-z]$/.test(label.variable))throw Error('UNSUPPORTED_SEGMENT_NOTATION');
    const [a,b]=segment.refs.map(r=>points[r].approximation);objects.push({id:label.id,kind:'EQUATION_LABEL',target:label.ownerSegment,text:label.variable,at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[label.id]=label.unit?{unit:label.unit}:{};factRolesByLabel[label.id]=label.factRole;
  }
  for(const angle of plan.rightAngles||[])objects.push({id:angle.id,kind:'ANGLE_MARK',refs:angle.refs,value:90});
  return {id,visualType:'line_circle_geometry',viewport:{xMin:Math.min(...xs)-pad,xMax:Math.max(...xs)+pad,yMin:Math.min(...ys)-pad,yMax:Math.max(...ys)+pad,width:384,height:320,panel:0},axes:model.coordinateMode==='SOURCE_COORDINATES',title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{notationByLabel,factRolesByLabel,squareAngleIds:(plan.rightAngles||[]).map(a=>a.id)},objects};
}

export async function runPhase2(options){
  const {questionUid,sourcePath,ordinal,replayResultRef,runId}=options;
  const requestedUid=questionUid||(sourcePath&&ordinal!==undefined?questionUidV2(path.basename(sourcePath,'.js'),ordinal):null);
  const workspace=bindRunWorkspace(root,{questionUid:requestedUid,sourcePath,replayResultRef,runId});
  return withWorkRoot(workspace.workRoot,()=>runPhase2InWorkspace({...options,requestedUid,workspace}));
}

async function runPhase2InWorkspace({questionUid,sourceRegistryRef=null,sourcePath,ordinal,replayResultRef=null,experimentalLocator=false,requestedUid,workspace,signal,onArchiveProgress}){
  let authority=null;
  if(sourceRegistryRef){
    if(isEngineOutputPath(sourceRegistryRef.path))throw Error('ENGINE_SCOPED_REGISTRY_NOT_AUTHORITY');
    authority=resolveQuestion(root,{questionUid:requestedUid,sourceRegistryRef});
    sourcePath=authority.sourceRef.path;ordinal=authority.question.id;
  }else if(!experimentalLocator){
    return runQuestion(root,{questionUid:requestedUid});
  }

  const sourceRef=fileRef(root,sourcePath),raw=readBoundFile(root,sourceRef).toString('utf8'),bank=loadBank(raw),question=JSON.parse(JSON.stringify(bank.find(q=>q.id===ordinal)));
  if(!question)throw Error('SOURCE_QUESTION_NOT_FOUND');
  const uid=authority?.questionUid||requestedUid,identity=assetIdentity(uid,'SOLUTION_VISUAL');
  const journal=currentWorkRoot()+'/phase2/'+identity.assetId+'/'+crypto.randomUUID();const folder=generatedPath(root,journal);fs.mkdirSync(folder,{recursive:true});
  const provenance={identity,sourceRef};let stages=[],result,repairBudget=new RepairBudget();
  try{
    if(authority)stages.push(freeze('UID_AUTHORITY',{sourceRegistryRef,entry:authority.sourceRegistryEntry,status:'CANONICAL_CURRENT'},provenance));
    else stages.push(freeze('SOURCE_LOCATOR',{sourceRef,status:'EXPERIMENTAL_LOCATOR',authority:false},provenance));
    const images=[];for(const imagePath of [question.image].filter(Boolean)){const relative='archive/'+imagePath;const bytes=readBoundFile(root,fileRef(root,relative));images.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));}
    const sourceOnly={content:question.content,choices:question.choices??null,sourceImageRequired:!!question.image};
    const verifyPolicy=verifiedSolutionPolicyFingerprint(root);
    const verificationInputSha256=verificationBinding({sourceRef,source:sourceOnly,images,answer:question.answer,solution:question.solution,policySha256:verifyPolicy});
    const reviewCall=(purpose,packet,pixels)=>provider(purpose,packet,pixels,folder,true);
    const reviewFreeze=(stage,value)=>{const r=freeze(stage,value,provenance);stages.push(r);return r;};
    const verify=async()=>{
      const record=await blindThenCompare({root,kind:'SOLUTION',source:sourceOnly,images,comparison:{answer:question.answer,solution:question.solution},policySha256:verifyPolicy,inputBindingSha256:verificationInputSha256,call:reviewCall,freeze:reviewFreeze});
      const r=reviewFreeze('VERIFIED_SOLUTION',record);
      if(!verificationClosed(record))throw Error('VERIFIED_SOLUTION_COMPARE_FAIL');
      return {record,receipt:r};
    };
    const reviewConditions=async proposedPlan=>{
      const policy=sourcePolicyFingerprint(root);
      const binding=conditionBinding({sourceRef,source:sourceOnly,images,plan:proposedPlan,policySha256:policy});
      return blindThenCompare({root,kind:'CONDITIONS',source:sourceOnly,images,comparison:{proposedPlan},policySha256:policy,inputBindingSha256:binding,call:reviewCall,freeze:reviewFreeze});
    };
    let frozen,plan,planReceipt,solutionRef,priorLayoutComposition=null,finalCompositionBinding=null;
    if(replayResultRef){
      const previous=JSON.parse(readBoundFile(root,replayResultRef));
      if(previous.identity.questionUid!==uid||previous.sourceRef.sha256!==sourceRef.sha256)throw Error('REPLAY_SOURCE_MISMATCH');
      if(!Array.isArray(previous.repairLedger))throw Error('REPLAY_REPAIR_LEDGER_REQUIRED');
      repairBudget=new RepairBudget(previous.repairLedger);
      const priorStages=previous.stages.map(ref=>({ref,value:JSON.parse(readBoundFile(root,ref))}));
      const plans=priorStages.filter(s=>s.value.stage==='PLAN');if(!plans.length)throw Error('REPLAY_PLAN_REQUIRED');
      const priorCompositions=priorStages.filter(s=>s.value.stage==='PROFILE_COMPOSITION');
      if(priorCompositions.length)priorLayoutComposition=JSON.parse(readBoundFile(root,priorCompositions.at(-1).value.outputs[0]));
      const ref=plans.at(-1).value.outputs[0];frozen=JSON.parse(readBoundFile(root,ref));
      if(planHash(frozen)!==frozen.planSha256)throw Error('REPLAY_PLAN_HASH_MISMATCH');
      const {schemaVersion,questionUid:planUid,visualAssetKey,sourceRef:sourceBinding,solutionRef:solutionBinding,verifiedSolutionRef,verifiedSolutionPolicySha256,verificationInputSha256:priorVerificationBinding,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistry,planSha256,...semantic}=frozen;plan=semantic;
      if(planUid!==uid||sourceBinding.sha256!==sourceRef.sha256)throw Error('REPLAY_PLAN_SOURCE_MISMATCH');
      stages.push(...priorStages.filter(s=>['PLAN','SOURCE_REVIEW','VERIFIED_SOLUTION','PLANNER','SOLUTION_BLIND_FREEZE','SOLUTION_COMPARE','CONDITIONS_BLIND_FREEZE','CONDITIONS_COMPARE'].includes(s.value.stage)).map(s=>({...s.value,manifestRef:s.ref})));
      const priorVerification=JSON.parse(readBoundFile(root,frozen.verifiedSolutionRef));
      const verificationReplay=await reuseReviewAuthority({root,record:priorVerification,kind:'SOLUTION',policySha256:verifyPolicy,inputBindingSha256:verificationInputSha256,closed:verificationClosed,refresh:verify});
      if(!verificationReplay.reused)frozen={...frozen,verifiedSolutionRef:verificationReplay.refreshResult.receipt.outputs[0]};
      solutionRef=receipt('SOLUTION_INPUT',{'solution.txt':question.solution},provenance).outputs[0];
      const currentPolicy=sourcePolicyFingerprint(root);
      const binding=conditionBinding({sourceRef,source:sourceOnly,images,plan,policySha256:currentPolicy});
      const reviews=priorStages.filter(s=>s.value.stage==='SOURCE_REVIEW').map(s=>JSON.parse(readBoundFile(root,s.value.outputs[0])));
      const priorSourceReview=reviews.find(r=>r.inputSha256===frozen.sourceReviewInputSha256);
      const sourceReviewReplay=await reuseReviewAuthority({root,record:priorSourceReview,kind:'CONDITIONS',policySha256:currentPolicy,inputBindingSha256:binding,closed:sourceReviewClosed,refresh:async()=>{const value=await reviewConditions(plan);reviewFreeze('SOURCE_REVIEW',value);return value;}});
      const sourceReview=sourceReviewReplay.record;
      frozen={...frozen,solutionRef,sourceRegistryRef,verifiedSolutionPolicySha256:verifyPolicy,verificationInputSha256,sourceReviewInputSha256:sourceReview.inputSha256,sourceReviewPolicySha256:currentPolicy};
      delete frozen.planSha256;frozen.planSha256=planHash(frozen);
      planReceipt=freeze('PLAN',frozen,provenance);stages.push(planReceipt);
      console.log(JSON.stringify({stage:'FROZEN_PLAN_REPLAY',uid}));
    }else{
    console.log(JSON.stringify({stage:'VERIFIED_SOLUTION',uid}));
    const verification=await verify();const verified=verification.record,verifiedReceipt=verification.receipt;
    solutionRef=receipt('SOLUTION_INPUT',{'solution.txt':question.solution},provenance).outputs[0];
    console.log(JSON.stringify({stage:'PLANNER',uid}));
    let extendedContract=compilerContract+' Also supported: SEGMENT_LENGTH(inputs two POINT, args{}, outputType SCALAR) and SCALAR_SQUARE(inputs one SCALAR,args{},outputType SCALAR). Geometry must actually calculate decisive distance/length using these nodes when relevant; scalarLabels:[{nodeId,ownerSegment,prefix,unit?:string}] displays that exact result near the owner segment. prefix is source entity, e.g AB or x^2. Also supported rightAngles:[{id,refs:[rayPoint,vertex,rayPoint],factRole:GIVEN|DERIVED_INTERMEDIATE}] for square markers and segmentLabels:[{id,ownerSegment,variable:single-letter,unit?:cm|m,factRole:GIVEN}] for source variable/unit labels. Do not create duplicate labels with same owner and content. Avoid unnecessary LINE_THROUGH nodes when only a display segment is needed. All scalar node dependencies may follow SELECT_POINT. Display segments must use distinct IDs from mathPlan point/scalar IDs. Original question content, score, choices, answer and solution remain unchanged in the actual Archive bank. You need not redraw those as visual labels; map these conditions to PRESERVED_ARCHIVE_BANK.';
    extendedContract+=CUBIC_QUARTIC_CONTRACT;
    extendedContract+=RATIONAL_CONTRACT;
    extendedContract+=SQRT_AFFINE_CONTRACT;
    let planner=await provider('PLAN_VISUAL',{instruction:extendedContract,source:sourceOnly,verifiedSolution:question.solution,verification:verified.payload},images,folder);
    plan=planner.payload;
    stages.push(freeze('PLANNER',planner,provenance));
    if(!plan.sourceConditions?.length||!plan.newVisualInformation?.length){
      const repair=repairBudget.consume('PLANNER_SCHEMA',objectSha(plan),'MISSING_COVERAGE_OR_BENEFIT');
      planner=await provider('REPAIR_PLAN_SCHEMA',{instruction:extendedContract+' REQUIRED TOP-LEVEL sourceConditions:[{id,condition,mappedTo}] AND newVisualInformation:[string]. No wrapper around plan. Include them in your full corrected output.',source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,defect:'PLANNER_SOURCE_COVERAGE_OR_BENEFIT_MISSING'},images,folder);plan=planner.payload;
      stages.push(freeze('PLANNER',planner,provenance));
      repairBudget.complete(repair,objectSha(plan));
      if(!plan.sourceConditions?.length||!plan.newVisualInformation?.length)throw Error('PLANNER_SOURCE_COVERAGE_OR_BENEFIT_MISSING');
    }
    if(!['construction-spike-v1','polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1'].includes(plan.capability))throw Error('UNSUPPORTED_CAPABILITY');
    console.log(JSON.stringify({stage:'INDEPENDENT_SOURCE_CONDITIONS',uid}));
    let sourceReview;
    for(let revision=0;revision<=3;revision++){
      stages.push(freeze('PLANNER',planner,provenance));
      if(plan.mathPlan){
        const normalized=await pythonWorker({action:'construction',graph:plan.mathPlan});
        if(normalized.status!=='OK'){
          stages.push(freeze('NORMALIZATION_REJECTION',normalized,provenance));
          if(revision===3)throw Error('NORMALIZATION_REPAIR_BUDGET_EXHAUSTED');
          const repair=repairBudget.consume('NORMALIZER',objectSha(plan),normalized.result.code);
          planner=await provider('REPAIR_TYPED_PLAN',{instruction:extendedContract+' IMPORTANT SELECT_POINT must have args:{} and branch:{kind,refs,sign} at the NODE TOP LEVEL. Never put branch inside args. Return full corrected plan.',source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,normalizerError:normalized.result},images,folder);plan=planner.payload;repairBudget.complete(repair,objectSha(plan));continue;
        }
      }
      sourceReview=await reviewConditions(plan);
      stages.push(freeze('SOURCE_REVIEW',sourceReview,provenance));
      if(sourceReviewClosed(sourceReview))break;
      if(revision===3)throw Error('SOURCE_REVIEW_REPAIR_BUDGET_EXHAUSTED');
      console.log(JSON.stringify({stage:'PLAN_REPAIR',uid,revision:revision+1}));
      const repair=repairBudget.consume('SOURCE_REVIEW',objectSha(plan),objectSha(sourceReview.payload));
      planner=await provider('REPAIR_VISUAL_PLAN',{instruction:extendedContract,source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,defects:sourceReview.payload},images,folder);plan=planner.payload;repairBudget.complete(repair,objectSha(plan));
    }
    if(!sourceReviewClosed(sourceReview))throw Error('SOURCE_REVIEW_NOT_CLOSED');
    frozen={...plan,schemaVersion:'VISUAL_PHASE2_PLAN_v1',questionUid:uid,visualAssetKey:identity.visualAssetKey,sourceRef,solutionRef,sourceRegistryRef,verifiedSolutionRef:verifiedReceipt.outputs[0],verifiedSolutionPolicySha256:verifyPolicy,verificationInputSha256,sourceReviewInputSha256:sourceReview.inputSha256,sourceReviewPolicySha256:sourcePolicyFingerprint(root)};
    frozen.planSha256=planHash(frozen);planReceipt=freeze('PLAN',frozen,provenance);stages.push(planReceipt);
    }
    let materialPlan=plan;
    if(plan.graphPlan){
      const framing=await worker({action:'frame_graph',graphPlan:plan.graphPlan});
      stages.push(freeze('GRAPH_OVERVIEW_FRAME',framing,provenance));
      materialPlan={...plan,graphPlan:framing.graphPlan};
    }
    const fingerprint=scopeFingerprint(root,plan.capability);
    console.log(JSON.stringify({stage:'MATH',uid}));
    const action=plan.mathPlan?{action:'construction',graph:plan.mathPlan}:{action:'graph',graphPlan:materialPlan.graphPlan};
    const math=await calculationStage(root,{stage:'MATH',key:objectSha({action,implementation:mathFingerprint(root,plan.capability)}),provenance},async()=>({'model.json':canonicalJson(await worker(action))}));stages.push(math.receipt);
    const model=JSON.parse(readBoundFile(root,math.receipt.outputs[0]));
    let reconstruction;
    if(plan.mathPlan){const peer=reconstruct(plan.mathPlan);reconstruction={...compareReconstruction(model,peer),peer};}
    else reconstruction=await workerGraphAudit(materialPlan.graphPlan,model.svg,model.transform);
    stages.push(freeze('MATH_REVIEW',reconstruction,provenance));if(reconstruction.status!=='PASS')throw Error('MATH_RECONSTRUCTION_FAIL');
    let spec=specFor(materialPlan,model,identity.assetId);stages.push(freeze('NORMALIZE',spec,provenance));
    let prepared=await worker({action:'prepare',spec});
    const envelopePreflight=await actualArchiveEnvelopePreflight({identity,folder,questionUid:uid,sourcePath,ordinal,sourceRef,solutionRef,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},sourceAuthorityStatus:authority?'CANONICAL_CURRENT':'EXPERIMENTAL_LOCATOR',signal,onProgress:onArchiveProgress});
    stages.push(...envelopePreflight.stages);
    const requestedSizeClass=question.solutionImageSize||'medium';
    const typographyPolicy=requestedProfileTypographyPolicy({requestedSizeClass,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},observation:envelopePreflight.observation,fontFloorCssPx:11});
    stages.push(freeze('DISPLAY_TYPOGRAPHY_POLICY',typographyPolicy,{...provenance,requestedSizeClass,preflightEvidence:envelopePreflight.preflightEvidence}));
    const candidateLabelInventory=prepared.labels.map(label=>({id:label.id,fontPx:typographyPolicy.baseFontPx}));
    const displayEnvelopePlan=planDisplayEnvelope({root,questionUid:uid,requestedSizeClass,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},candidateLabelInventory,observation:envelopePreflight.observation,preflightEvidence:envelopePreflight.preflightEvidence,archiveEngineSha256:envelopePreflight.archiveEngineSha256,sourceRef,solutionRef,policyRefs:envelopePreflight.policyRefs,fontFloorCssPx:11,typographyPolicy});
    const displayEnvelopeReceipt=freeze('DISPLAY_ENVELOPE',displayEnvelopePlan,{...provenance,preflightEvidence:envelopePreflight.preflightEvidence,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(displayEnvelopeReceipt);
    const t=typesetter(),fragments={};
    for(const label of prepared.labels){
      if(label.kind==='CONDITION_BOX')throw Error('UNSUPPORTED_MULTILINE_PHASE2_LABEL');
      const numericTick=label.kind==='GRAPH_ANNOTATION'&&/^[-−\d.]+$/.test(label.text);
      const role=spec.displayFacts.factRolesByLabel?.[label.id]||plan.mathPlan?.nodes.find(n=>n.id===label.target)?.factRole||'DERIVED_INTERMEDIATE';
      fragments[label.id]=t({id:label.id,owner:label.target||label.id,factRole:role,fontPx:typographyPolicy.baseFontPx,...(label.math||label.kind==='POINT_NAME'||numericTick?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    }
    stages.push(freeze('TYPESET',fragments,provenance));
    const browser=await dependency('playwright').chromium.launch({channel:'chrome',headless:true});const measurements={};
    try{const page=await browser.newPage();for(const [id,fragment] of Object.entries(fragments)){await page.setContent(fragment.svg);const bbox=await page.locator('svg').first().evaluate(e=>{const b=e.getBBox(),r=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,viewportWidth:r.width,viewportHeight:r.height};});if(bbox.width<=0||bbox.height<=0)throw Error('FRAGMENT_BROWSER_MEASUREMENT_MISSING');measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];fragment.observedBBox=bbox;}}finally{await browser.close();}
    const measurementReceipt=freeze('MEASURE',{measurements,observedFragments:fragments,displayEnvelope:displayEnvelopePlan,preflightEvidence:envelopePreflight.preflightEvidence},provenance);stages.push(measurementReceipt);
    if(materialPlan.graphPlan){
      const formulaId=prepared.labels.find(label=>label.kind==='EQUATION_LABEL')?.id;
      const measuredFormula=measurements[formulaId];
      if(formulaId&&measuredFormula){
        const panelPaddingPx=24,maximumPanelPx=200,requiredPanelPx=Math.ceil((measuredFormula[0]+panelPaddingPx)*10)/10;
        if(requiredPanelPx>maximumPanelPx)throw Error('UNSUPPORTED_DISPLAY_ENVELOPE:GRAPH_FORMULA_PANEL_LIMIT');
        if(requiredPanelPx>spec.viewport.panel){
          const priorPanelPx=spec.viewport.panel,priorLabelInventory=prepared.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text,sourceMath:label.sourceMath??null}));
          const sourcePlanSha256=objectSha(plan),sourceConditionsSha256=objectSha(plan.sourceConditions||[]),graphPlanSha256=objectSha(materialPlan.graphPlan);
          const sourceFactSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],graphPlan:materialPlan.graphPlan});
          const labelInventorySha256=objectSha(priorLabelInventory),baseSvgSha256=bytesSha(Buffer.from(model.svg));
          const requestedProfile=displayEnvelopePlan.profiles.find(profile=>profile.sizeClass===requestedSizeClass);
          const repairInput={schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_INPUT_v2',questionUid:uid,sourceSha256:sourceRef.sha256,solutionSha256:solutionRef.sha256,sourcePlanSha256,sourceConditionsSha256,sourceFactSha256,graphPlanSha256,baseSvgSha256,formulaLabelId:formulaId,formulaFragmentSha256:fragments[formulaId].fragmentSha256,formulaText:prepared.labels.find(label=>label.id===formulaId)?.text,measuredFormula:{widthPx:measuredFormula[0],heightPx:measuredFormula[1]},requestedSizeClass,profilePolicySha256:requestedProfile.profilePolicySha256,typographyPolicySha256:objectSha(typographyPolicy),sourcePolicySha256:sourcePolicyFingerprint(root),verifiedSolutionPolicySha256:verifiedSolutionPolicyFingerprint(root),displayPolicyRefsSha256:objectSha(displayEnvelopePlan.policyRefs),currentPanelPx:priorPanelPx,panelPaddingPx,maximumPanelPx};
          const repairInputSha256=objectSha(repairInput),selectedPanelPx=requiredPanelPx;
          spec={...spec,viewport:{...spec.viewport,panel:requiredPanelPx}};
          const adjusted=await worker({action:'prepare',spec}),adjustedLabelInventory=adjusted.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text,sourceMath:label.sourceMath??null}));
          const sourcePlanAfterSha256=objectSha(plan),sourceConditionsAfterSha256=objectSha(plan.sourceConditions||[]),graphPlanAfterSha256=objectSha(materialPlan.graphPlan);
          const sourceFactAfterSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],graphPlan:materialPlan.graphPlan});
          const adjustedLabelInventorySha256=objectSha(adjustedLabelInventory);
          const sourceConditionParity=sourceConditionsSha256===sourceConditionsAfterSha256;
          const sourceFactParity=sourceFactSha256===sourceFactAfterSha256&&graphPlanSha256===graphPlanAfterSha256;
          const semanticPlanParity=sourcePlanSha256===sourcePlanAfterSha256;
          const labelInventoryParity=canonicalJson(priorLabelInventory)===canonicalJson(adjustedLabelInventory);
          if(!sourceConditionParity||!sourceFactParity||!semanticPlanParity||!labelInventoryParity)throw Error('GRAPH_PANEL_COMPOSITION_SEMANTIC_PARITY_FAIL');
          const repairOutput={schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_OUTPUT_v2',repairInputSha256,sourcePlanSha256:sourcePlanAfterSha256,sourceConditionsSha256:sourceConditionsAfterSha256,sourceFactSha256:sourceFactAfterSha256,graphPlanSha256:graphPlanAfterSha256,labelInventorySha256:adjustedLabelInventorySha256,formulaLabelId:formulaId,formulaFragmentSha256:fragments[formulaId].fragmentSha256,formulaText:adjusted.labels.find(label=>label.id===formulaId)?.text,measuredFormulaWidthPx:measuredFormula[0],panelPaddingPx,priorPanelPx,selectedPanelPx};
          const repairOutputSha256=objectSha(repairOutput),repairAction=repairBudget.record('LAYOUT',repairInputSha256,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',repairOutputSha256);
          const priorCompositionCurrentSchema=priorLayoutComposition?.schemaVersion==='MEASURED_GRAPH_FORMULA_PANEL_v2';
          const samePriorRepairInput=priorCompositionCurrentSchema&&priorLayoutComposition.repairInputSha256===repairInputSha256;
          if(samePriorRepairInput&&(priorLayoutComposition.repairOutputSha256!==repairOutputSha256||priorLayoutComposition.selectedPanelPx!==selectedPanelPx))throw Error('LAYOUT_REPAIR_REPLAY_MISMATCH');
          if(priorCompositionCurrentSchema&&!samePriorRepairInput&&repairAction.replayed)throw Error('LAYOUT_REPAIR_REPLAY_MISMATCH');
          const repairReplayRelation=!priorCompositionCurrentSchema?'FIRST_BUDGETED_REPAIR':samePriorRepairInput?'EXACT_REPLAY':'NEW_INPUT_DISTINCT_BUDGET';
          prepared=adjusted;
          stages.push(freeze('PROFILE_COMPOSITION',{schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_v2',status:'PASS',compositionOnly:true,sourceRef,solutionRef,sourcePlanSha256,sourceConditionsSha256,sourceFactSha256,graphPlanSha256,labelInventoryBeforeSha256:labelInventorySha256,labelInventoryAfterSha256:adjustedLabelInventorySha256,sourceConditionParity,sourceFactParity,semanticPlanParity,labelInventoryParity,requestedSizeClass,typographyPolicy,formulaLabelId:formulaId,fragmentRef:fragments[formulaId].fragmentSha256,measurementRef:measurementReceipt.outputs[0],formulaTextWidthPx:measuredFormula[0],panelPaddingPx,priorPanelPx,selectedPanelPx,repairInput,repairInputSha256,repairOutput,repairOutputSha256,repairIteration:repairAction.row.iteration,repairReplayed:repairAction.replayed,repairResumed:repairAction.resumed,repairReplayRelation,previousRepairInputSha256:priorLayoutComposition?.repairInputSha256??null,displayEnvelopeInputIdentitySha256:displayEnvelopePlan.inputIdentitySha256},provenance));
          finalCompositionBinding={repairInputSha256,repairOutputSha256};
          stages.push(freeze('NORMALIZE_FINAL',spec,{...provenance,compositionStage:'PROFILE_COMPOSITION',displayEnvelopeInputIdentitySha256:displayEnvelopePlan.inputIdentitySha256}));
        }
      }
    }
    const built=await worker({action:'build',spec,measurements,fragments});
    const layoutRepairBindings=[];
    const ownerPointMarkers=prepared.prepared.primitives.filter(value=>value.role==='point').map(value=>({id:value.id,geometry:[...value.at,value.radius]}));
    for(const repair of built.witness.layout.repairs||[]){
      const label=prepared.labels.find(value=>value.id===repair.labelId),fragment=fragments[repair.labelId],measurement=measurements[repair.labelId];
      if(!label||label.kind!==repair.labelKind||label.target!==repair.ownerId||!fragment||fragment.fragmentSha256!==repair.measuredFragmentSha256||!measurement||measurement.length!==2||measurement[0]!==repair.measuredBox.width||measurement[1]!==repair.measuredBox.height)throw Error('MEASURED_OWNER_LAYOUT_REPAIR_EVIDENCE_MISMATCH');
      const requestedProfile=displayEnvelopePlan.profiles.find(value=>value.sizeClass===requestedSizeClass);
      if(!requestedProfile)throw Error('MEASURED_OWNER_LAYOUT_PROFILE_REQUIRED');
      const sourceConditionsSha256=objectSha(plan.sourceConditions||[]);
      const sourceFactsSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],mathPlan:plan.mathPlan||null,graphPlan:materialPlan.graphPlan||null});
      const labelInventory=prepared.labels.map(value=>({id:value.id,kind:value.kind,target:value.target??null,text:value.text,sourceMath:value.sourceMath??null,factRole:spec.displayFacts.factRolesByLabel?.[value.id]??null}));
      const binding=bindMeasuredOwnerSafeLabelRepair({identity,sourceRef,solutionRef,planSha256:frozen.planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256:objectSha(labelInventory),baseMathSvgSha256:bytesSha(Buffer.from(model.svg)),measurementRef:measurementReceipt.outputs[0],policyRefsSha256:objectSha(displayEnvelopePlan.policyRefs),profilePolicySha256:requestedProfile.profilePolicySha256,requestedSizeClass,repair,candidateSvgBytes:Buffer.from(built.svg),expectedLabel:label,pointMarkers:ownerPointMarkers,measurement,fragment});
      const action=repairBudget.record('LAYOUT',binding.repairInputSha256,'MEASURED_OWNER_SAFE_LABEL_RELOCATION',binding.repairOutputSha256);
      const repairReceipt=freeze('LAYOUT_REPAIR',{schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_STAGE_v1',status:'PASS',sourceRef,solutionRef,planSha256:frozen.planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256:objectSha(labelInventory),repairInput:binding.repairInput,repairInputSha256:binding.repairInputSha256,repairOutput:binding.repairOutput,repairOutputSha256:binding.repairOutputSha256,repairIteration:action.row.iteration,repairReplayed:action.replayed,repairResumed:action.resumed,repairReplayRelation:action.replayed?'EXACT_REPLAY':action.resumed?'RESUMED':'NEW_INPUT_DISTINCT_BUDGET',candidateSvgSha256:binding.candidateSvgSha256,selectedSizeClass:requestedSizeClass,profilePolicySha256:requestedProfile.profilePolicySha256,policyRefs:displayEnvelopePlan.policyRefs},provenance);
      stages.push(repairReceipt);layoutRepairBindings.push({binding,repairReceiptRef:repairReceipt.outputs[0]});
    }
    if(built.witness.layout.unresolved.length||built.witness.layout.suppressed.length)throw Error('LAYOUT_INVENTORY_INCOMPLETE:'+JSON.stringify(built.witness.layout));
    const solutionImageName=`q${String(ordinal).padStart(2,'0')}-solution.svg`;
    const archiveAssetRef=`assets/images/${workspace.examUid}/${solutionImageName}`;
    const builtReceipt=receipt('BUILD',{[solutionImageName]:built.svg,'witness.json':canonicalJson(built.witness)},provenance);stages.push(builtReceipt);const asset=builtReceipt.outputs.find(r=>r.path.endsWith('/'+solutionImageName));
    const measuredOwnerLayoutRepairAudits=[];
    if(layoutRepairBindings.length){
      let repairAuditBrowser;
      try{
        repairAuditBrowser=await dependency('playwright').chromium.launch({channel:'chrome',headless:true});
        const repairAuditPage=await repairAuditBrowser.newPage();
        for(const item of layoutRepairBindings){
          try{
            const audit=await auditMeasuredOwnerSafeLabelRepair({binding:item.binding,candidateSvgBytes:Buffer.from(built.svg),pointMarkers:ownerPointMarkers,page:repairAuditPage});
            if(audit.candidateSvgSha256!==asset.sha256)throw Error('LAYOUT_REPAIR_AUDIT_BUILD_ASSET_SHA_MISMATCH');
            measuredOwnerLayoutRepairAudits.push({...audit,candidateSvgRef:asset,repairReceiptRef:item.repairReceiptRef});
          }catch(error){measuredOwnerLayoutRepairAudits.push({schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_AUDIT_v1',status:'FAIL',candidateSvgRef:asset,repairReceiptRef:item.repairReceiptRef,error:error.message});}
        }
      }finally{if(repairAuditBrowser)await repairAuditBrowser.close();}
    }
    const staticAudit=await workerPrimitiveAudit({svg:built.svg,points:reconstruction.peer?.points??null,segments:plan.displaySegments||[],rightAngles:plan.rightAngles||[],transform:built.witness.coordinateModel,fragments,coordinateMode:model.coordinateMode??'FUNCTION_GRAPH'});
    staticAudit.measuredOwnerLayoutRepairAudits=measuredOwnerLayoutRepairAudits;
    if(measuredOwnerLayoutRepairAudits.some(value=>value.status!=='PASS')){staticAudit.status='FAIL';staticAudit.errors=[...(staticAudit.errors||[]),'MEASURED_OWNER_LAYOUT_REPAIR_AUDIT_FAIL'];}
    if(plan.graphPlan){
      staticAudit.graph=await workerGraphAudit(materialPlan.graphPlan,built.svg,{...built.witness.coordinateModel,displayScale:1});
      staticAudit.graphCompositionBinding={phase:'POST_COMPOSITION_BUILD',candidateSvgRef:asset,candidateSvgSha256:asset.sha256,graphPlanSha256:objectSha(materialPlan.graphPlan),...(finalCompositionBinding||{})};
    }
    stages.push(freeze('STATIC_AUDIT',staticAudit,provenance));if(staticAudit.status!=='PASS'||staticAudit.graph&&staticAudit.graph.status!=='PASS')throw Error('STATIC_AUDIT_FAIL:'+JSON.stringify(staticAudit.errors));
    const expectedPrimitiveIds=[...Object.keys(reconstruction.peer?.points||{}),...(plan.displaySegments||[]).map(value=>value.id),...(plan.rightAngles||[]).map(value=>value.id)];
    const profileAudit=await auditCandidateProfiles({svg:built.svg,plan:displayEnvelopePlan,candidateSvgRef:asset,sourceRef,solutionRef,policyRefs:displayEnvelopePlan.policyRefs,identity,provenance,graphPlan:materialPlan.graphPlan??null,geometryStaticAudit:staticAudit,coordinateModel:built.witness.coordinateModel,expectedPrimitiveIds});
    stages.push(...profileAudit.stageReceipts);
    const finalDisplayEnvelope=profileAudit.envelope;
    if(finalDisplayEnvelope.status!=='PASS')throw Error('UNSUPPORTED_DISPLAY_ENVELOPE:'+canonicalJson({sizeClassStatus:finalDisplayEnvelope.status,profiles:finalDisplayEnvelope.profiles.map(value=>({sizeClass:value.sizeClass,status:value.supportStatus,errors:value.finalAudit.errors}))}));
    console.log(JSON.stringify({stage:'ACTUAL_ARCHIVE',uid}));
    const patch={solutionImage:archiveAssetRef,solutionImageSize:finalDisplayEnvelope.sizeClass,solutionImageAlt:plan.caption};
    const candidate=raw+'\n;Object.assign(window.questionBank.find(q=>q.id==='+ordinal+'),'+JSON.stringify(patch)+');\n';
    const patched=JSON.parse(JSON.stringify(loadBank(candidate))),original=JSON.parse(JSON.stringify(bank));
    const touched=['solutionImage','solutionImageSize','solutionImageAlt'];
    for(let i=0;i<original.length;i++){const before={...original[i]},after={...patched[i]};if(before.id===ordinal)for(const field of touched){delete before[field];delete after[field];}if(canonicalJson(before)!==canonicalJson(after))throw Error('ARCHIVE_PROTECTED_FIELD_MUTATION');}
    const protectedParity={status:'PASS',sourceRef,originalQuestionSha256:objectSha(question),questionCount:bank.length,protectedFields:['content','choices','answer','solution','image'],changedFields:touched,targetOrdinal:ordinal};
    const examFileName=workspace.examUid+'.js';
    const candidateReceipt=receipt('ARCHIVE_BANK',{[examFileName]:candidate,'protected-parity.json':canonicalJson(protectedParity)},provenance);const candidateRef=candidateReceipt.outputs.find(o=>o.path.endsWith('/'+examFileName));stages.push(candidateReceipt);
    // Existing collector uses bare RAW-file hex, not the Python object hash.
    // This explicit adapter preserves that legacy meaning and keeps new refs intact.
    const rawHex=ref=>ref.sha256.slice(7);
    const bankInfo={id:identity.assetId,sourcePath,sourceSha256:rawHex(sourceRef),candidatePath:candidateRef.path,candidateSha256:rawHex(candidateRef),questionCount:bank.length,assets:[{id:identity.assetId,path:asset.path,archivePath:archiveAssetRef,sha256:rawHex(asset),questionId:ordinal}]};
    const matrix={synthetic:false,legacyHashAlgorithm:'SHA256_RAW_HEX_v1',engineSha256:rawHex(fileRef(root,'archive/engine.html')),sources:[{...bankInfo,assets:[{...bankInfo.assets[0],sizeClass:finalDisplayEnvelope.sizeClass}]}],rows:[{...bankInfo,assets:[{...bankInfo.assets[0],sizeClass:finalDisplayEnvelope.sizeClass}],mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))}]};
    fs.writeFileSync(path.join(folder,'archive-render-matrix.json'),canonicalJson(matrix));
    process.env.GEOMETRY_NODE_MODULES ||= path.join(dependencyRoot,'node_modules');
    const archive=await recordArchiveEvidence({run:folder,signal,onProgress:onArchiveProgress,blockExternalRequests:true});
    const captureFolder=path.join(folder,'archive-render/attempt-01'),captureOutputs={};
    for(const name of fs.readdirSync(captureFolder))captureOutputs[name]=fs.readFileSync(path.join(captureFolder,name));
    const captureReceipt=receipt('CAPTURE',captureOutputs,provenance);stages.push(captureReceipt);
    const actualRowName=fs.readdirSync(captureFolder).find(name=>name===identity.assetId+'-sol-desktop.json');
    const actualScreenshotName=fs.readdirSync(captureFolder).find(name=>name.endsWith('-'+identity.assetId+'.png'));
    if(!actualRowName)throw Error('ACTUAL_DISPLAY_RAW_ARCHIVE_ROW_REQUIRED');
    const actualRowRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/'+actualRowName));
    const actualScreenshotRef=actualScreenshotName?captureReceipt.outputs.find(ref=>ref.path.endsWith('/'+actualScreenshotName)):null;
    const actualRow=JSON.parse(readBoundFile(root,actualRowRef).toString('utf8'));
    const actualTarget=actualRow.state?.targets?.find(target=>target.id===identity.assetId)||null;
    const actualScreenshotBytes=actualScreenshotRef?readBoundFile(root,actualScreenshotRef):null;
    const actualRecord={schemaVersion:'DISPLAY_ARCHIVE_ACTUAL_v1',status:archive.status==='PASS'&&actualRow.status==='PASS'?'PASS':'FAIL',synthetic:actualRow.synthetic,runtime:actualRow.runtime,browserVersion:actualRow.browserVersion,questionUid:uid,sizeClass:finalDisplayEnvelope.sizeClass,candidateSvgRef:asset,candidateSvgSha256:asset.sha256,naturalWidth:actualTarget?.naturalWidth??null,naturalHeight:actualTarget?.naturalHeight??null,sourceRef,solutionRef,policyRefs:displayEnvelopePlan.policyRefs,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256,screenshotRef:actualScreenshotRef,screenshotViewport:actualScreenshotBytes?pngSize(actualScreenshotBytes):null,archiveRowRef:actualRowRef,archiveAssetPath:archiveAssetRef,targetId:identity.assetId,qBoxRect:actualTarget?.qBoxRect??null,solutionMetaRect:actualTarget?.solutionMetaRect??null,solutionMetaContentWidth:actualTarget?.solutionMetaContentWidth??null,imageRect:actualTarget?.rect??null,computedStyle:actualTarget?.computedStyle??null,minimumCssFontPx:finalDisplayEnvelope.expectedMinimumCssFontPx};
    const actualReceipt=receipt('DISPLAY_ENVELOPE_ACTUAL',{'actual-archive.json':canonicalJson(actualRecord)},{...provenance,identity,candidateSvgRef:asset,displayEnvelopePlanSha256:objectSha(displayEnvelopePlan),inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(actualReceipt);
    const actualComparison=compareActualDisplayEnvelope(finalDisplayEnvelope,{root,actualRef:actualReceipt.outputs[0]});
    const displayFinalReceipt=freeze('DISPLAY_ENVELOPE_FINAL',{schemaVersion:'DISPLAY_ENVELOPE_FINAL_v1',status:actualComparison.status,selectedSizeClass:finalDisplayEnvelope.sizeClass,policyChange:finalDisplayEnvelope.policyChange,candidateSvgRef:asset,actualRef:actualReceipt.outputs[0],archiveRowRef:actualRowRef,screenshotRef:actualScreenshotRef,comparison:actualComparison},{...provenance,identity,candidateSvgRef:asset,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(displayFinalReceipt);
    if(archive.status!=='PASS')throw Error('ACTUAL_ARCHIVE_FAIL:'+JSON.stringify(archive.rows));
    if(actualComparison.status!=='PASS')throw Error('ACTUAL_DISPLAY_ENVELOPE_MISMATCH:'+canonicalJson(actualComparison.errors));
    if(plan.graphPlan){
      const rowFile=fs.readdirSync(captureFolder).find(n=>n.endsWith('desktop.json'));
      const row=JSON.parse(fs.readFileSync(path.join(captureFolder,rowFile),'utf8'));const rect=row.state.targets[0].rect;
      const observedScale=Math.min(rect.width/spec.viewport.width,rect.height/spec.viewport.height);
      const displayAudit=await workerGraphAudit(materialPlan.graphPlan,built.svg,{...built.witness.coordinateModel,displayScale:observedScale});
      stages.push(freeze('DISPLAY_GRAPH_REVIEW',displayAudit,provenance));if(displayAudit.status!=='PASS')throw Error('ACTUAL_DISPLAY_GRAPH_BOUND_FAIL');
    }
    const screenshotName=fs.readdirSync(captureFolder).find(n=>n.endsWith('-'+identity.assetId+'.png'));const screenshot=fs.readFileSync(path.join(captureFolder,screenshotName));
    const contextName=fs.readdirSync(captureFolder).find(n=>n.endsWith('-'+identity.assetId+'-context.png'));if(!contextName)throw Error('NATIVE_ARCHIVE_CONTEXT_SCREENSHOT_REQUIRED');
    const contextScreenshot=fs.readFileSync(path.join(captureFolder,contextName));
    console.log(JSON.stringify({stage:'INDEPENDENT_VISUAL_REVIEW',uid}));
    const visualReview=await provider('REVIEW_FINAL_VISUAL',{instruction:'Review the actual frozen Archive solution-image and native solution block screenshots against the supplied original source and verified solution. Check decisive relation, all geometry/curve/axis semantics, source names, owner ambiguity, Korean and math glyph readability, clipping/collision, density, integration with surrounding solution, and black-white meaning. Check the family-specific overview contract in publicationGraphPlan. For rational graphs, verify the pole or open hole, separated branches, exact horizontal asymptote and visible full-domain coverage. For polynomial graphs, verify every required root/extremum/inflection and the required tails. For square-root graphs, verify the exact radicand boundary, closed source endpoint marker, no curve points before the root, and an increasing right branch. A local detail cannot replace the required overview. The actual required mode is sol. Its native reminder deliberately omits answer choices and original problem images; those appear in exam mode and are supplied in the original source packet for this review. Original body/choices/answer/solution/image fields remain byte-equivalent in the candidate bank; do not require exam-mode content to appear in sol-mode screenshots. This is a candidate review, not engine qualification or publication authority. Return PASS only if satisfactory. payload {observations:[string],errors:[]}.',source:sourceOnly,solution:question.solution,archiveMode:'sol',protectedParity,finalSvgSha256:asset.sha256,screenshotSha256:bytesSha(screenshot),nativeContextScreenshotSha256:bytesSha(contextScreenshot),plan:frozen,publicationGraphPlan:materialPlan.graphPlan??null},[...images,'data:image/png;base64,'+screenshot.toString('base64'),'data:image/png;base64,'+contextScreenshot.toString('base64')],folder,true);
    stages.push(freeze('VISUAL_REVIEW',visualReview,provenance));
    if(visualReview.output.status!=='PASS')throw Error('INDEPENDENT_VISUAL_REVIEW_FAIL:'+canonicalJson(visualReview.payload));
    if(!Array.isArray(visualReview.payload.errors)||visualReview.payload.errors.length||!Array.isArray(visualReview.payload.observations)||!visualReview.payload.observations.length)throw Error('INDEPENDENT_VISUAL_REVIEW_FAIL');
    result={status:authority?'PHASE2_SLICE_COMPLETE':'EXPERIMENTAL_LOCATOR_COMPLETE',identityStatus:authority?'CANONICAL_CURRENT':'EXPERIMENTAL_LOCATOR',sourceRegistryRef,workRoot:workspace.workRoot,runId:workspace.runId,examUid:workspace.examUid,productionAuthorized:false,qualificationStatus:'NOT_QUALIFIED',identity,sourceRef,solutionRef,planRef:planReceipt.outputs[0],fingerprint,finalSvgRef:asset,displayEnvelopePlanRef:displayEnvelopeReceipt.outputs[0],displayEnvelopeAuditRef:profileAudit.stageReceipts.at(-1).outputs[0],displayEnvelopeFinalRef:displayFinalReceipt.outputs[0],selectedSizeClass:finalDisplayEnvelope.sizeClass,displayPolicyChange:finalDisplayEnvelope.policyChange,actualArchive:archive,independentVisualReviewRef:stages.at(-1).outputs[0],stages:stages.map(s=>s.manifestRef)};
  }catch(error){result={status:error.message.startsWith('UNSUPPORTED_CINDY_')?'UNSUPPORTED_NUMERIC_SCOPE':error.message.startsWith('UNSUPPORTED_DISPLAY_ENVELOPE:')?'UNSUPPORTED_DISPLAY_ENVELOPE':'UNRESOLVED',productionAuthorized:false,identity,sourceRef,error:error.message,errorCode:error.code||null,archiveAbortEvidenceRef:error.abortEvidenceRef||null,archiveCleanup:error.cleanup||null,providerProcessCleanup:error.providerProcessCleanup||null,providerRemoteCancellation:error.providerRemoteCancellation||null,providerPurpose:error.providerPurpose||null,providerParserErrorName:error.providerParserErrorName||null,providerParserErrorCode:error.providerParserErrorCode||null,providerPayloadSha256:error.providerPayloadSha256||null,providerRawOutputSha256:error.providerRawOutputSha256||null,providerInvocationId:error.providerInvocationId||null,providerContextId:error.providerContextId||null,providerTerminalStatus:error.providerTerminalStatus||null,stages:stages.map(s=>s.manifestRef)};}
  result.repairLedger=repairBudget.ledger;
  Object.assign(result,{schemaVersion:'VISUAL_RESULT_v1',phase:2,engineStatus:'EXPERIMENTAL',workRoot:workspace.workRoot,runId:workspace.runId,examUid:workspace.examUid});
  const final=freeze('RESULT',result,provenance);console.log(JSON.stringify({uid,status:result.status,error:result.error,resultRef:final.outputs[0]}));return {result,receipt:final};
}
function scalarExpression(v){
  if(v.kind==='integer')return v.value;if(v.kind==='rational')return '('+v.numerator+'/'+v.denominator+')';
  if(v.kind==='constant')return v.name;
  if(v.kind==='expression'){const a=v.args.map(scalarExpression);if(v.op==='sqrt')return 'sqrt('+a[0]+')';if(v.op==='neg')return '-('+a[0]+')';const ops={add:'+',sub:'-',mul:'*',div:'/',pow:'^'};if(ops[v.op])return '('+a.join(ops[v.op])+')';}
  throw Error('UNSUPPORTED_SCALAR_NOTATION');
}
async function workerGraphAudit(graphPlan,svg,transform){const {aspectPolicy,...frame}=transform;return (await pythonWorker({graphPlan,svg,transform:frame},{script:fileURLToPath(new URL('graph-observer-worker.py',import.meta.url))})).result;}
async function workerPrimitiveAudit(payload){return (await pythonWorker(payload,{script:fileURLToPath(new URL('primitive-observer-worker.py',import.meta.url))})).result;}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const index=process.argv.indexOf('--source'),ordinal=Number(process.argv[process.argv.indexOf('--ordinal')+1]);
  const resume=process.argv.indexOf('--resume');const output=await runPhase2({sourcePath:process.argv[index+1],ordinal,replayResultRef:resume>=0?fileRef(root,process.argv[resume+1]):null,experimentalLocator:process.argv.includes('--experimental-locator')});if(output.result.status!=='PHASE2_SLICE_COMPLETE')process.exitCode=1;
}
