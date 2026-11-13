import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,canonicalJson,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {compositePanelBytes} from './composite-candidate-svg-v1.mjs';
import {parseQuestionUidV2,SOURCE_QUESTION_ID_PATTERN} from '../../pipeline-core/question-uid.mjs';
import {loadBank,bankAliasSuffix} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence,measureArchiveDisplayEnvelope,normalizeArchiveImageUrlPath,archiveAssetSha256} from '../record-visual-browser-evidence.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {assetIdentity} from './contracts.mjs';
import {DISPLAY_SIZE_CLASSES,requestedProfileTypographyPolicy} from './display-envelope.mjs';
import {validateProblemReaderEvidence} from './problem-output-envelope.mjs';

export const ARCHIVE_CAPTURE_VERSION='construction-archive-capture-v1';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const HASH=/^sha256:[0-9a-f]{64}$/;
const RUN_ID=/^[A-Za-z0-9_-]{1,80}$/;
const EXAM_UID=/^[\p{L}\p{N}_.-]{1,180}$/u;
export const DISPLAY_SCALE_TOLERANCE_CSS_PX=1;// compareActualDisplayEnvelope's default toleranceCssPx
const FLOAT_SLACK=1e-9;// exactly 1 px must not be refused for float noise (a 1 px difference of 174/384 computes to 1.000000000000007)
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});// the matrix row below, as in phase2.mjs 739
export const PROBLEM_CAPTURE_VIEWPORTS=Object.freeze([{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844},{name:'tablet',width:768,height:1024}].map(Object.freeze));
const PROTECTED_FIELDS=['content','choices','answer','solution','image'];
const PATCHED_FIELDS=['solutionImage','solutionImageSize','solutionImageAlt'];
const LINEAGE_KEYS=['l1SvgSha256','policySha256','candidateBankSha256','assetPath','assetResponseSha256','archiveRowSha256','screenshotSha256s','matrixSha256','engineSha256'];

// Internal control flow only: every domain outcome is returned as a status; anything else is a defect and propagates.
class Stop extends Error{constructor(status,detail=null){super(status);this.status=status;this.detail=detail;}}
// onProgress runs caller code inside the capture: a result produced with it is not operating evidence.
const flags=onProgress=>({evidenceIntegrity:onProgress===undefined?'NO_CALLER_HOOK':'CALLER_HOOK_PRESENT',uidAuthority:'STRUCTURAL_ONLY',independentInverseObservation:'NOT_RUN',qualification:'NOT_RUN',publication:'NOT_RUN',productionAuthorized:false});
const errorText=error=>String(error?.message??error);
const isCancel=error=>error?.code==='ARCHIVE_CAPTURE_CANCELLED';
// A domain refusal is a plain Error whose message is an UPPER_SNAKE code (optionally ':detail'); TypeError and friends are defects.
const isDomainCode=error=>error?.constructor===Error&&/^[A-Z][A-Z0-9_]*(?::|$)/.test(error.message);
const rel=file=>path.relative(root,file).replaceAll('\\','/');
const bare=sha=>sha.slice(7);
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>canonicalJson(a)===canonicalJson(b);
// The SHA of the one response in `list`, as the Archive recorded it; null if there is not exactly one or it is not a bare 64-hex digest.
const responseSha=list=>{if(list.length!==1)return null;try{return 'sha256:'+archiveAssetSha256(list[0].sha256);}catch{return null;}};

/** Observed vs expected display scale, in CSS px of the larger side. Exactly the tolerance passes; anything above it does not. */
export function displayScaleDifference({observed,expected,intrinsic,toleranceCssPx=DISPLAY_SCALE_TOLERANCE_CSS_PX}){
  const deltaCssPx=Math.abs(observed-expected)*Math.max(intrinsic.width,intrinsic.height);
  return {deltaCssPx,withinTolerance:deltaCssPx<=toleranceCssPx+FLOAT_SLACK};
}

// Same rule as L1: the identity must be exactly what contracts.mjs assetIdentity() derives from its own questionUid, surface and visualRole.
function checkIdentity(identity){
  const bad=(reason,fields)=>{throw new Stop('ARCHIVE_IDENTITY_INVALID',{reason,...(fields?{fields}:{})});};
  if(!identity||typeof identity!=='object'||Array.isArray(identity))bad('MISSING');
  let expected;
  try{expected=assetIdentity(identity.questionUid,identity.surface,identity.visualRole);}
  catch(error){bad('NOT_RECOMPUTABLE',[errorText(error)]);}
  const fields=[...Object.keys(expected).filter(key=>identity[key]!==expected[key]),...Object.keys(identity).filter(key=>!Object.hasOwn(expected,key))];
  if(fields.length)bad('FIELD_MISMATCH',fields);
}

// Input checks shared by both functions. Nothing is created here: a refusal leaves no run directory behind.
function checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress,requireOriginal=false},surface='SOLUTION_VISUAL'){
  checkIdentity(identity);
  const invalid=(reason,extra)=>{throw new Stop('ARCHIVE_INPUT_INVALID',{reason,...extra});};
  if(!DISPLAY_SIZE_CLASSES.includes(requestedSizeClass))invalid('SIZE_CLASS');
  // ordinal: the question's integer id, or its string id exactly as the bank writes it ("q01", "s01").
  if(!(Number.isSafeInteger(ordinal)&&ordinal>=1)&&!(typeof ordinal==='string'&&SOURCE_QUESTION_ID_PATTERN.test(ordinal)))invalid('ORDINAL');
  if(typeof runId!=='string'||!RUN_ID.test(runId))invalid('RUN_ID');
  if(onProgress!==undefined&&typeof onProgress!=='function')invalid('ON_PROGRESS');
  if(typeof sourcePath!=='string'||!sourcePath.startsWith('archive/exams/')||!sourcePath.endsWith('.js')||requireOriginal&&!sourcePath.startsWith('archive/exams/original/'))invalid('SOURCE_SCOPE');
  let sourceRef,raw;
  try{sourceRef=fileRef(root,sourcePath);raw=readBoundFile(root,sourceRef).toString('utf8');}catch(error){invalid('SOURCE_NOT_A_FILE',{code:errorText(error)});}
  // Structural binding only: the UID is not checked against the source-exam registry (uidAuthority STRUCTURAL_ONLY).
  const examUid=path.posix.basename(sourcePath,'.js'),parsed=parseQuestionUidV2(identity.questionUid);
  if(!EXAM_UID.test(examUid))invalid('EXAM_UID_NOT_PATH_SAFE');
  if(parsed.sourceExamId!==examUid.normalize('NFC')||parsed.sourceQuestionOrdinal!==ordinal)throw new Stop('IDENTITY_SOURCE_MISMATCH',{questionUid:identity.questionUid,sourceExamId:examUid,ordinal});
  let bank;
  try{bank=loadBank(raw);}catch(error){invalid('SOURCE_BANK_UNREADABLE',{code:errorText(error)});}
  if(!Array.isArray(bank)||!bank.some(question=>question.id===ordinal))invalid('ORDINAL_NOT_IN_BANK');
  if(identity.surface!==surface)invalid('SURFACE_NOT_'+surface);
  // Problem figures replace an existing source image only. A separate author/reviewer must establish source parity;
  // neither a successful geometry audit nor this capture authorizes adding facts to a student problem.
  if(surface==='PROBLEM_VISUAL'&&!bank.find(question=>question.id===ordinal)?.image)invalid('PROBLEM_SOURCE_IMAGE_REQUIRED');
  const runRoot=path.join(root,'.tmp/archive',runId);
  if(fs.existsSync(runRoot))throw new Stop('ARCHIVE_RUN_EXISTS',{runId});
  const examRoot=path.join(runRoot,examUid);
  return {examUid,sourceRef,raw,bank,runRoot,examRoot,productionDir:path.join(examRoot,'visual-engine/production')};
}
// New directory or nothing: an existing run is never reused or overwritten.
function createRun(runRoot,runId){
  fs.mkdirSync(path.dirname(runRoot),{recursive:true});
  try{fs.mkdirSync(runRoot);}catch(error){if(error.code==='EEXIST')throw new Stop('ARCHIVE_RUN_EXISTS',{runId});throw error;}
}
const writeNew=(file,data)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data,{flag:'wx'});};

/**
 * Measure the real Archive mode=sol size of one question's solution image and turn it into the typography policy L1 takes.
 * LOCAL_ONLY. The policy provenance is ARCHIVE_MEASURED: the evidence refs name the raw Archive row and screenshot of this run.
 */
export const measureArchiveTypographyPolicy=options=>measureTypography(options);
export const measureProblemTypographyPolicy=options=>measureTypography(options,'PROBLEM_VISUAL');
async function measureTypography({identity,sourcePath,ordinal,requestedSizeClass,intrinsicSvg,runId,signal,onProgress}={},surface='SOLUTION_VISUAL'){
  const state={policy:null,policySha256:null,provenance:null,paths:null,evidence:{observationSha256:null,matrixSha256:null,archiveRow:null,screenshot:null,engineSha256:null}};
  const outcome=(status,detail=null)=>({schemaVersion:ARCHIVE_CAPTURE_VERSION,status,detail,policy:state.policy,policySha256:state.policySha256,provenance:state.provenance,evidence:{...state.evidence},paths:state.paths,...flags(onProgress)});
  try{
    const input=checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress,requireOriginal:true},surface);// measureArchiveDisplayEnvelope takes archive/exams/original/ only
    if(!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||intrinsicSvg.width<1||intrinsicSvg.height<1)throw new Stop('ARCHIVE_INPUT_INVALID',{reason:'INTRINSIC_SVG'});
    createRun(input.runRoot,runId);
    const preflightRun=path.join(input.productionDir,'display-envelope-preflight');fs.mkdirSync(preflightRun,{recursive:true});
    state.paths={runRoot:rel(input.runRoot),matrix:rel(path.join(preflightRun,'archive-render-matrix.json'))};
    let measured;
    const problemMeasurements=[];
    try{
      if(surface==='PROBLEM_VISUAL'){
        // Choose the actual smallest slot scale, retaining the exact raw observation that produced it.
        // No synthetic combined profile is ever handed to the typography policy.
        for(const viewport of PROBLEM_CAPTURE_VIEWPORTS){
          const run=path.join(preflightRun,viewport.name);fs.mkdirSync(run);
          const current=await measureArchiveDisplayEnvelope({run,sourceRef:input.sourceRef,sourceOrdinal:ordinal,targetId:identity.assetId,questionUid:identity.questionUid,intrinsicSvg,signal,onProgress,blockExternalRequests:true,surface,problemViewport:viewport});
          const profile=current.observation.profiles.find(p=>p.sizeClass===requestedSizeClass);
          const scale=Math.min(profile.imageRect.width/intrinsicSvg.width,profile.imageRect.height/intrinsicSvg.height);
          problemMeasurements.push({viewport,current,scale});
        }
        measured=problemMeasurements.reduce((a,b)=>a.scale<=b.scale?a:b).current;
      }else measured=await measureArchiveDisplayEnvelope({run:preflightRun,sourceRef:input.sourceRef,sourceOrdinal:ordinal,targetId:identity.assetId,questionUid:identity.questionUid,intrinsicSvg,signal,onProgress,blockExternalRequests:true});
    }
    catch(error){if(isCancel(error))throw error;throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:errorText(error)});}
    if(measured.status!=='PASS')throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:'MEASUREMENT_NOT_PASS'});
    const names=fs.readdirSync(measured.captureFolder),rowName=names.find(name=>name===measured.rowEvidence.id+'.json'),shotName=names.find(name=>name.endsWith('-'+identity.assetId+'-envelope-context.png'));
    if(!rowName||!shotName)throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:'ENVELOPE_RAW_CAPTURE_MISSING'});
    const measuredMatrix=surface==='PROBLEM_VISUAL'?path.join(preflightRun,problemMeasurements.find(p=>p.current===measured).viewport.name,'archive-render-matrix.json'):path.join(preflightRun,'archive-render-matrix.json');
    state.evidence={observationSha256:objectSha(measured.observation),matrixSha256:bytesSha(fs.readFileSync(measuredMatrix)),archiveRow:fileRef(root,rel(path.join(measured.captureFolder,rowName))),screenshot:fileRef(root,rel(path.join(measured.captureFolder,shotName))),engineSha256:'sha256:'+measured.rowEvidence.engineSha256};
    if(surface==='PROBLEM_VISUAL'){
      const selected=problemMeasurements.find(p=>p.current===measured);
      state.evidence.matrixSha256=bytesSha(fs.readFileSync(path.join(preflightRun,selected.viewport.name,'archive-render-matrix.json')));
      state.evidence.problemViewportMeasurements=problemMeasurements.map(({viewport,current,scale})=>({viewport,scale,archiveRow:fileRef(root,rel(path.join(current.captureFolder,current.rowEvidence.id+'.json'))),matrix:fileRef(root,rel(path.join(preflightRun,viewport.name,'archive-render-matrix.json'))),screenshots:{context:fileRef(root,rel(path.join(current.captureFolder,current.rowEvidence.id+'-'+identity.assetId+'-envelope-context.png'))),page:fileRef(root,rel(path.join(current.captureFolder,current.rowEvidence.id+'.png')))}}));
      state.paths.matrix=rel(path.join(preflightRun,selected.viewport.name,'archive-render-matrix.json'));
    }
    let policy;
    try{policy=requestedProfileTypographyPolicy({requestedSizeClass,intrinsicSvg,observation:measured.observation,fontFloorCssPx:11});}
    catch(error){if(!isDomainCode(error))throw error;throw new Stop('ARCHIVE_POLICY_UNSUPPORTED',{message:errorText(error)});}
    state.policy=policy;state.policySha256=objectSha(policy);state.provenance='ARCHIVE_MEASURED';
    return outcome('MEASURED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }
}

// The L1 SVG must be what it claims to be: COMPOSED, with bytes that hash to its own lineage.
function checkComposed(composed,lineage){
  const bad=reason=>{throw new Stop('COMPOSED_INPUT_INVALID',{reason});};
  if(!composed||typeof composed!=='object'||Array.isArray(composed))bad('NOT_AN_OBJECT');
  if(HASH.test(composed.lineage?.svgSha256))lineage.l1SvgSha256=composed.lineage.svgSha256;// as claimed by L1
  // A composite figure (composite-candidate-svg-v1) stacks L1 panels; its svg and lineage bind exactly like one L1 figure's.
  if(composed.schemaVersion!=='construction-candidate-svg-v1'&&composed.schemaVersion!=='composite-candidate-svg-v1')bad('SCHEMA_VERSION');
  if(composed.status!=='COMPOSED')bad('STATUS_NOT_COMPOSED');
  if(typeof composed.svg!=='string'||!composed.svg)bad('SVG_MISSING');
  if(!composed.lineage||typeof composed.lineage!=='object')bad('LINEAGE_MISSING');
  if(composed.lineage.svgSha256!==bytesSha(Buffer.from(composed.svg,'utf8')))bad('SVG_SHA_MISMATCH');
  // The panels inside a composite are the exact bytes L1 audited: decode each embedded panel and re-hash it.
  if(composed.schemaVersion==='composite-candidate-svg-v1'){
    const shas=composed.lineage.panelSvgSha256s,embedded=compositePanelBytes(composed.svg);
    if(!Array.isArray(shas)||!shas.length||embedded.length!==shas.length||embedded.some((item,i)=>item.panel!==i+1||bytesSha(item.bytes)!==shas[i]))bad('COMPOSITE_PANEL_BYTES_MISMATCH');
  }
}
// Integer pixel size from the root <svg> attributes: the size the Archive probe measured, taken from the bytes themselves.
function svgIntrinsic(svg){
  const tag=svg.match(/<svg\b[^>]*>/i)?.[0];
  const attr=name=>tag?.match(new RegExp(`\\s${name}\\s*=\\s*"(\\d+)"`))?.[1];
  const width=Number(attr('width')),height=Number(attr('height'));
  return width>=1&&height>=1?{width,height}:null;
}
// The Archive's layout replay of this SVG runs in a page that does not block requests, so LOCAL_ONLY does not cover what the SVG itself loads:
// an SVG with a script, or with an href that is neither a #fragment nor a data: URL, is refused before anything is written. A static filter, not a sandbox.
function checkSvgReferences(svg){
  const point=number=>number<=0x10ffff?String.fromCodePoint(number):'\ufffd';
  const reference=raw=>raw.replace(/&#x([0-9a-f]+);/gi,(_,hex)=>point(parseInt(hex,16))).replace(/&#(\d+);/g,(_,digits)=>point(Number(digits))).replace(/&amp;/gi,'&').replace(/[\s\u0000-\u001f]/g,'');
  const found=[];
  if(/<(?:[\w.-]+:)?script\b/i.test(svg))found.push({kind:'SCRIPT'});
  for(const match of svg.matchAll(/\s(?:xlink:)?href\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)){
    const value=reference(match[1]??match[2]);
    if(!value.startsWith('#')&&!/^data:/i.test(value))found.push({kind:'HREF',value:value.slice(0,200)});
  }
  if(found.length)throw new Stop('SVG_EXTERNAL_REFERENCE',{found});
}
// A measured policy is accepted only if it is exactly what the raw Archive row it points to derives, for this identity, source and engine.
function checkMeasuredPolicy({measuredPolicy,composed,identity,sourceRef,engineRef,intrinsic}){
  const bad=(reason,extra)=>{throw new Stop('POLICY_PROVENANCE_MISMATCH',{reason,...extra});};
  if(!measuredPolicy||typeof measuredPolicy!=='object'||measuredPolicy.status!=='MEASURED'||!measuredPolicy.policy||typeof measuredPolicy.policy!=='object'||!HASH.test(measuredPolicy.policySha256))bad('MEASURED_POLICY_SHAPE');
  if(measuredPolicy.provenance!=='ARCHIVE_MEASURED')bad('PROVENANCE_NOT_ARCHIVE_MEASURED');
  let policySha;
  try{policySha=objectSha(measuredPolicy.policy);}catch(error){bad('POLICY_NOT_CANONICAL',{code:errorText(error)});}
  if(policySha!==measuredPolicy.policySha256)bad('POLICY_SHA_NOT_OF_POLICY');
  if(composed.lineage.typographyPolicySha256!==measuredPolicy.policySha256)bad('COMPOSED_POLICY_SHA_DIFFERS',{composed:composed.lineage.typographyPolicySha256,measured:measuredPolicy.policySha256});
  const evidence=measuredPolicy.evidence,ref=evidence?.archiveRow;
  if(typeof ref?.path!=='string'||!ref.path.startsWith('.tmp/archive/'))bad('EVIDENCE_REF_INVALID');
  let row;
  try{row=JSON.parse(readBoundFile(root,ref).toString('utf8'));}catch(error){bad('EVIDENCE_REF_STALE',{code:errorText(error)});}
  if(evidence.engineSha256!==engineRef.sha256||row.engineSha256!==bare(engineRef.sha256))bad('EVIDENCE_ENGINE_CHANGED');
  if(row.sourceSha256!==bare(sourceRef.sha256))bad('EVIDENCE_SOURCE_CHANGED');
  const envelope=row.state?.displayEnvelopes?.find(item=>item.id===identity.assetId);
  if(row.status!=='PASS'||row.network?.policy!=='LOCAL_ONLY'||envelope?.status!=='PASS')bad('EVIDENCE_TARGET_NOT_THIS_IDENTITY');
  if(identity.surface==='PROBLEM_VISUAL'&&(row.mode!=='exam'||envelope.surface!=='PROBLEM_VISUAL'))bad('EVIDENCE_SURFACE_MISMATCH');
  if(identity.surface==='PROBLEM_VISUAL'){
    const measurements=evidence.problemViewportMeasurements;
    if(!Array.isArray(measurements)||measurements.length!==PROBLEM_CAPTURE_VIEWPORTS.length)bad('PROBLEM_VIEWPORT_MEASUREMENTS_REQUIRED');
    const scales=[];
    for(const viewport of PROBLEM_CAPTURE_VIEWPORTS){
      const entries=measurements.filter(m=>same(m.viewport,viewport));if(entries.length!==1)bad('PROBLEM_VIEWPORT_MEASUREMENT_MISMATCH');
      const entry=entries[0];let raw,matrix;
      try{
        raw=JSON.parse(readBoundFile(root,entry.archiveRow));matrix=JSON.parse(readBoundFile(root,entry.matrix));
        validateProblemReaderEvidence(raw,{root,sourcePath:sourceRef.path});
        for(const name of ['context','page']){const png=readBoundFile(root,entry.screenshots?.[name]);if(png.length<24||png.toString('hex',0,8)!=='89504e470d0a1a0a')bad('PROBLEM_PREFLIGHT_PNG_INVALID');}
      }catch{bad('PROBLEM_VIEWPORT_EVIDENCE_STALE');}
      const observed=raw.state?.displayEnvelopes?.find(e=>e.id===identity.assetId),profile=observed?.profiles?.find(p=>p.sizeClass===measuredPolicy.policy.requestedSizeClass);
      if(raw.status!=='PASS'||raw.mode!=='exam'||raw.viewport!==viewport.name+'-envelope'||raw.network?.policy!=='LOCAL_ONLY'||raw.state?.solutionVisualCount!==0||raw.engineSha256!==bare(engineRef.sha256)||raw.sourceSha256!==bare(sourceRef.sha256)||observed?.surface!=='PROBLEM_VISUAL'||observed.status!=='PASS'||!same(observed.intrinsicSvg,intrinsic)||profile?.status!=='PASS'||matrix.rows?.length!==1||matrix.rows[0].width!==viewport.width||matrix.rows[0].height!==viewport.height)bad('PROBLEM_VIEWPORT_MEASUREMENT_MISMATCH');
      const scale=Math.min(profile.imageRect.width/intrinsic.width,profile.imageRect.height/intrinsic.height);
      if(!Number.isFinite(scale)||scale<=0||scale!==entry.scale)bad('PROBLEM_VIEWPORT_SCALE_MISMATCH');scales.push(scale);
    }
    if(Math.min(...scales)!==measuredPolicy.policy.displayScale)bad('PROBLEM_POLICY_NOT_MINIMUM_VIEWPORT_SCALE');
  }
  const observation={...envelope,questionUid:identity.questionUid,synthetic:false,runtime:row.runtime,browserVersion:row.browserVersion,sourceRef,sourceAuthorityStatus:'MEASUREMENT_ONLY'};
  if(objectSha(observation)!==evidence.observationSha256)bad('OBSERVATION_SHA_DIFFERS');
  let derived;
  try{derived=requestedProfileTypographyPolicy({requestedSizeClass:measuredPolicy.policy.requestedSizeClass,intrinsicSvg:envelope.intrinsicSvg,observation,fontFloorCssPx:measuredPolicy.policy.fontFloorCssPx});}
  catch(error){bad('POLICY_NOT_DERIVED_FROM_EVIDENCE',{code:errorText(error)});}
  if(!same(derived,measuredPolicy.policy))bad('POLICY_NOT_DERIVED_FROM_EVIDENCE');
  if(!same(envelope.intrinsicSvg,intrinsic))bad('INTRINSIC_SVG_DIFFERS_FROM_MEASURED',{measured:envelope.intrinsicSvg,svg:intrinsic});
  // L1 relocates an owner label only under this measured policy and this source (its repairContext): re-check every such binding here.
  // A composite carries its repairs per panel, each bound to that panel's plan and SVG; one L1 figure carries them at the top.
  const composite=composed.schemaVersion==='composite-candidate-svg-v1';
  if(composite&&(!Array.isArray(composed.panels)||!Array.isArray(composed.lineage.panelSvgSha256s)||composed.panels.length!==composed.lineage.panelSvgSha256s.length))bad('COMPOSITE_PANELS_INVALID');
  const repairSets=composite?composed.panels.map((panel,i)=>({repairs:panel?.layoutRepairs,planSha256:panel?.lineage?.planSha256,svgSha256:composed.lineage.panelSvgSha256s[i],panelSvg:panel?.lineage?.svgSha256})):[{repairs:composed.layoutRepairs,planSha256:composed.lineage.planSha256,svgSha256:composed.lineage.svgSha256,panelSvg:composed.lineage.svgSha256}];
  for(const set of repairSets){
  if(set.panelSvg!==set.svgSha256)bad('COMPOSITE_PANEL_SVG_MISMATCH');
  if(set.repairs!==undefined&&!Array.isArray(set.repairs))bad('LAYOUT_REPAIRS_NOT_A_LIST');
  // A record that is not canonical JSON is a mismatch, never a thrown defect. (No record means no repair was claimed.)
  for(const repair of set.repairs??[]){
    const input=repair?.repairInput,output=repair?.repairOutput;let consistent=false;
    try{
      consistent=!!input&&!!output&&objectSha(input)===repair.repairInputSha256&&objectSha(output)===repair.repairOutputSha256&&output.repairInputSha256===repair.repairInputSha256
        &&input.questionUid===identity.questionUid&&input.visualAssetKey===identity.visualAssetKey&&input.planSha256===set.planSha256
        &&input.profilePolicySha256===measuredPolicy.policySha256&&input.policyRefsSha256===objectSha(evidence)&&same(input.measurementRef,evidence.archiveRow)
        &&input.sourceSha256===sourceRef.sha256&&input.solutionSha256===sourceRef.sha256&&input.requestedSizeClass===measuredPolicy.policy.requestedSizeClass
        &&repair.candidateSvgSha256===set.svgSha256&&output.candidateSvgSha256===set.svgSha256
        &&repair.audit?.status==='PASS'&&repair.audit.candidateSvgSha256===set.svgSha256&&repair.audit.labelId===input.labelId;
    }catch{}
    if(!consistent)bad('LAYOUT_REPAIR_BINDING_MISMATCH',{labelId:typeof input?.labelId==='string'?input.labelId:null});
  }
  }
}

/**
 * Put one L1 COMPOSED SVG into the real Archive mode=sol (LOCAL_ONLY) and bind, from the raw row, that the bytes the Archive received are the L1 bytes,
 * that the size class is the requested one and that the displayed scale is the one the measured policy used. Nothing outside .tmp/archive/<runId> is written.
 */
export const captureArchiveCandidate=options=>captureCandidate(options);
export const captureProblemCandidate=options=>captureCandidate(options,'PROBLEM_VISUAL');
async function captureCandidate({composed,identity,sourcePath,ordinal,requestedSizeClass,measuredPolicy,alt,runId,signal,onProgress,fixtureClassification=null}={},surface='SOLUTION_VISUAL'){
  const lineage=Object.fromEntries(LINEAGE_KEYS.map(key=>[key,null]));
  const state={paths:null,protectedParity:null,sizeClass:null,observedDisplayScale:null,expectedDisplayScale:null,displayScaleDeltaCssPx:null,layout:null,checks:null};
  const outcome=(status,detail=null)=>({schemaVersion:ARCHIVE_CAPTURE_VERSION,status,detail,lineage:{...lineage},paths:state.paths,protectedParity:state.protectedParity,sizeClass:state.sizeClass,observedDisplayScale:state.observedDisplayScale,expectedDisplayScale:state.expectedDisplayScale,displayScaleDeltaCssPx:state.displayScaleDeltaCssPx,layout:state.layout,checks:state.checks,fixtureClassification,...(state.problemViewports?{problemViewports:state.problemViewports}:{}),...(state.typographyMeasurement?{typographyMeasurement:state.typographyMeasurement}:{}),...flags(onProgress)});
  try{
    const input=checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress},surface);
    if(typeof alt!=='string'||!alt.trim())throw new Stop('ARCHIVE_INPUT_INVALID',{reason:'ALT'});
    checkComposed(composed,lineage);
    const intrinsic=svgIntrinsic(composed.svg),engineRef=fileRef(root,'archive/engine.html');
    if(!intrinsic)throw new Stop('COMPOSED_INPUT_INVALID',{reason:'SVG_INTRINSIC_UNREADABLE'});
    checkSvgReferences(composed.svg);
    if(HASH.test(measuredPolicy?.policySha256))lineage.policySha256=measuredPolicy.policySha256;
    checkMeasuredPolicy({measuredPolicy,composed,identity,sourceRef:input.sourceRef,engineRef,intrinsic});
    if(surface==='PROBLEM_VISUAL')state.typographyMeasurement=clone(measuredPolicy);
    lineage.engineSha256=engineRef.sha256;
    const problem=surface==='PROBLEM_VISUAL',mode=problem?'exam':'sol';
    const patchedFields=problem?['image','imageSize','imageAlt']:PATCHED_FIELDS;
    const protectedFields=problem?['content','choices','answer','solution','solutionImage','solutionImageSize','solutionImageAlt','solutionImageCaption']:PROTECTED_FIELDS;
    const assetId=identity.assetId,policy=measuredPolicy.policy,svgSha256=composed.lineage.svgSha256;

    createRun(input.runRoot,runId);
    // asset: the L1 bytes, written once, read back
    const suffix=problem?'problem':'solution';
    const assetName=typeof ordinal==='string'?`${ordinal}-${suffix}.svg`:`q${String(ordinal).padStart(2,'0')}-${suffix}.svg`,archiveAssetRef=`assets/images/${input.examUid}/${assetName}`;// phase2.mjs 690-691
    const assetFile=path.join(input.examRoot,archiveAssetRef);
    writeNew(assetFile,Buffer.from(composed.svg,'utf8'));lineage.assetPath=rel(assetFile);
    const written=bytesSha(fs.readFileSync(assetFile));
    if(written!==svgSha256)throw new Stop('ARCHIVE_ASSET_WRITE_MISMATCH',{expected:svgSha256,written});
    // candidate bank: only the three solutionImage* fields of the target question change (phase2.mjs 727-734)
    const patch=problem?{image:archiveAssetRef,imageSize:requestedSizeClass,imageAlt:alt}:{solutionImage:archiveAssetRef,solutionImageSize:requestedSizeClass,solutionImageAlt:alt};
    const candidate=input.raw+bankAliasSuffix(input.raw)+'\n;Object.assign(window.questionBank.find(q=>q.id==='+JSON.stringify(ordinal)+'),'+JSON.stringify(patch)+');\n';
    const patched=clone(loadBank(candidate)),original=clone(input.bank);
    if(patched.length!==original.length)throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{reason:'QUESTION_COUNT'});
    original.forEach((question,index)=>{
      const before={...question},after={...patched[index]};
      if(question.id===ordinal){
        for(const field of patchedFields){delete before[field];delete after[field];}
        if(!patchedFields.every(field=>patched[index][field]===patch[field]))throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{reason:'PATCH_NOT_APPLIED',questionId:question.id});
      }
      if(!same(before,after))throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{questionId:question.id});
    });
    state.protectedParity={status:'PASS',sourceRef:input.sourceRef,originalQuestionSha256:objectSha(original.find(question=>question.id===ordinal)),questionCount:original.length,protectedFields,changedFields:patchedFields,targetOrdinal:ordinal};
    const candidateFile=path.join(input.examRoot,'candidates',input.examUid+'.js'),candidateBytes=Buffer.from(candidate,'utf8');
    writeNew(candidateFile,candidateBytes);lineage.candidateBankSha256=bytesSha(candidateBytes);
    // matrix: phase2.mjs 738-740, except that the asset carries no sizeClass, so the row reports the class of the rendered wrapper instead of echoing the request
    const info={id:assetId,sourcePath,sourceSha256:bare(input.sourceRef.sha256),candidatePath:rel(candidateFile),candidateSha256:bare(lineage.candidateBankSha256),questionCount:input.bank.length,assets:[{id:assetId,path:lineage.assetPath,archivePath:archiveAssetRef,sha256:bare(svgSha256),questionId:ordinal,...(problem?{surface}:{})}]};
    const urlPath='/archive/engine.html?mode='+mode+'&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))+(problem?'&fit=screen':'');
    const matrix={synthetic:false,legacyHashAlgorithm:'SHA256_RAW_HEX_v1',engineSha256:bare(engineRef.sha256),sources:[info],rows:problem?PROBLEM_CAPTURE_VIEWPORTS.map(({name,...size})=>({...info,mode,viewport:name,...size,problemEnvelope:true,requireLocalResources:true,requireQrRenderer:true,urlPath})):[{...info,mode,viewport:'desktop',...PUBLICATION_VIEWPORT,requireLocalResources:true,requireQrRenderer:true,urlPath}]};
    const archiveRun=path.join(input.productionDir,'archive-capture'),matrixFile=path.join(archiveRun,'archive-render-matrix.json'),matrixBytes=Buffer.from(canonicalJson(matrix),'utf8');
    writeNew(matrixFile,matrixBytes);lineage.matrixSha256=bytesSha(matrixBytes);
    state.paths={runRoot:rel(input.runRoot),asset:lineage.assetPath,candidateBank:rel(candidateFile),matrix:rel(matrixFile),archiveRow:null,screenshots:null};

    // capture, once
    onProgress?.({event:'ARCHIVE_CANDIDATE_READY',runId,assetPath:lineage.assetPath});
    let archive;
    try{archive=await recordArchiveEvidence({run:archiveRun,signal,onProgress,blockExternalRequests:true});}
    catch(error){if(isCancel(error))throw error;throw new Stop('ARCHIVE_CAPTURE_ERROR',{message:errorText(error)});}
    const captureFolder=path.join(archiveRun,'archive-render/attempt-01'),prefix=assetId+'-'+mode+'-desktop',rowFile=path.join(captureFolder,prefix+'.json');
    if(!fs.existsSync(rowFile))throw new Stop('ARCHIVE_CAPTURE_ERROR',{message:'ARCHIVE_ROW_MISSING'});
    const rowBytes=fs.readFileSync(rowFile),row=JSON.parse(rowBytes.toString('utf8'));
    lineage.archiveRowSha256=bytesSha(rowBytes);state.paths.archiveRow=rel(rowFile);state.paths.screenshots={};lineage.screenshotSha256s={};
    for(const [name,file] of [['image',`${prefix}-${assetId}.png`],['context',`${prefix}-${assetId}-context.png`],['page',`${prefix}.png`]])if(fs.existsSync(path.join(captureFolder,file))){state.paths.screenshots[name]=rel(path.join(captureFolder,file));lineage.screenshotSha256s[name]=bytesSha(fs.readFileSync(path.join(captureFolder,file)));}
    // the asset and the exam JS (the candidate bank) the Archive really received, as recorded by the page's own response listener
    const received=urlPath=>(row.responses||[]).filter(response=>normalizeArchiveImageUrlPath(response.url)===urlPath);
    const responses=received('/archive/'+archiveAssetRef),bankResponses=received('/'+sourcePath);
    lineage.assetResponseSha256=responseSha(responses);
    if(archive.status!=='PASS')throw new Stop('ARCHIVE_CAPTURE_FAIL',{rows:archive.rows,errors:archive.rows.flatMap(item=>item.errors??[])});
    if(problem){
      state.problemViewports=PROBLEM_CAPTURE_VIEWPORTS.map(viewport=>{
        const prefix=assetId+'-exam-'+viewport.name,rowFile=path.join(captureFolder,prefix+'.json'),raw=JSON.parse(fs.readFileSync(rowFile));
        validateProblemReaderEvidence(raw,{root,sourcePath});
        const target=raw.state?.targets?.find(t=>t.id===assetId),layout=raw.layouts?.find(l=>l.id===assetId),rect=target?.rect;
        const expected=measuredPolicy.evidence.problemViewportMeasurements.find(m=>m.viewport.name===viewport.name).scale;
        const scale=rect?Math.min(rect.width/intrinsic.width,rect.height/intrinsic.height):NaN;
        const difference=displayScaleDifference({observed:scale,expected,intrinsic});
        const labels=layout?.labelMeasurements;
        const assetResponses=(raw.responses??[]).filter(r=>normalizeArchiveImageUrlPath(r.url)==='/archive/'+archiveAssetRef);
        const bankResponses=(raw.responses??[]).filter(r=>normalizeArchiveImageUrlPath(r.url)==='/'+sourcePath);
        const checks={runtime:raw.status==='PASS'&&raw.runtime==='playwright-chromium'&&raw.synthetic===false,network:raw.network?.policy==='LOCAL_ONLY'&&raw.network.externalRequests?.length===0,surface:raw.mode==='exam'&&target?.surface==='PROBLEM_VISUAL'&&target.problemWrapper===true&&raw.state.solutionVisualCount===0,naturalSize:target?.loaded===true&&target.naturalWidth===intrinsic.width&&target.naturalHeight===intrinsic.height,sizeClass:target?.sizeClass===requestedSizeClass,displayScale:difference.withinTolerance,layout:layout?.status==='PASS',fontFloor:Array.isArray(labels)&&labels.every(l=>Number.isFinite(l.finalViewportCssFontPx)&&l.finalViewportCssFontPx>=11-1e-7),assetResponse:assetResponses.length===1&&assetResponses[0].status===200&&responseSha(assetResponses)===svgSha256,bankResponse:bankResponses.length===1&&bankResponses[0].status===200&&responseSha(bankResponses)===lineage.candidateBankSha256};
        const screenshots=Object.fromEntries([['image',`${prefix}-${assetId}.png`],['context',`${prefix}-${assetId}-context.png`],['page',`${prefix}.png`]].map(([name,file])=>[name,fileRef(root,rel(path.join(captureFolder,file)))]));
        return {viewport,status:Object.values(checks).every(Boolean)?'PASS':'FAIL',checks,archiveRow:fileRef(root,rel(rowFile)),screenshots,expectedDisplayScale:expected,observedDisplayScale:Number.isFinite(scale)?scale:null,labelMeasurements:labels??[]};
      });
      if(state.problemViewports.some(v=>v.status!=='PASS'))throw new Stop('ARCHIVE_PROBLEM_VIEWPORT_FAIL',{viewports:state.problemViewports});
    }

    // bind
    const target=row.state?.targets?.find(item=>item.id===assetId),rect=target?.rect;
    state.sizeClass=target?.sizeClass??null;
    let difference=null;
    const finite=rect&&['width','height'].every(key=>Number.isFinite(rect[key])&&rect[key]>0);
    if(finite){
      state.observedDisplayScale=Math.min(rect.width/intrinsic.width,rect.height/intrinsic.height);state.expectedDisplayScale=problem?measuredPolicy.evidence.problemViewportMeasurements.find(m=>m.viewport.name==='desktop').scale:policy.displayScale;
      difference=displayScaleDifference({observed:state.observedDisplayScale,expected:state.expectedDisplayScale,intrinsic});state.displayScaleDeltaCssPx=difference.deltaCssPx;
    }
    let layout;
    const recorded=row.layouts?.find(item=>item.id===assetId);
    if(recorded)layout={source:'ARCHIVE_ROW_ISOLATED_REPLAY',status:recorded.status,errors:recorded.errors??[]};
    else if(finite){// the row has no analysis of this asset: replay the same bytes at the real image rect
      const browser=await launchBrowser();
      try{
        const page=await browser.newPage({viewport:{width:Math.ceil(rect.width),height:Math.ceil(rect.height)}});
        const analysis=analyzeRenderedLayout(await captureAtDisplaySize(page,composed.svg,rect,{publicationViewport:PUBLICATION_VIEWPORT}));
        layout={source:'MODULE_REPLAY_AT_ACTUAL_RECT',status:analysis.status,errors:analysis.errors};
      }finally{await browser.close();}
    }else layout={source:'NONE',status:'FAIL',errors:['NO_TARGET_RECT']};
    state.layout=layout;
    const pass=value=>value?'PASS':'FAIL';
    state.checks={
      network:pass(row.network?.policy==='LOCAL_ONLY'&&Array.isArray(row.network.externalRequests)&&row.network.externalRequests.length===0),
      assetResponse:pass(responses.length===1&&responses[0].status===200&&lineage.assetResponseSha256===svgSha256),
      bankResponse:pass(bankResponses.length===1&&bankResponses[0].status===200&&responseSha(bankResponses)===lineage.candidateBankSha256),
      naturalSize:pass(target?.loaded===true&&target.naturalWidth===intrinsic.width&&target.naturalHeight===intrinsic.height),
      ...(problem?{surface:pass(row.mode==='exam'&&target?.surface==='PROBLEM_VISUAL'&&target?.problemWrapper===true&&row.state.solutionVisualCount===0)}:{}),
      sizeClass:pass(target?.sizeClass===requestedSizeClass),
      displayScale:pass(finite&&difference.withinTolerance),
      layout:pass(layout.status==='PASS')
    };
    const detail={
      network:{policy:row.network?.policy??null,externalRequests:row.network?.externalRequests??null},
      assetResponse:{expected:svgSha256,responses:responses.map(({status,sha256,bytes})=>({status,sha256,bytes}))},
      bankResponse:{expected:lineage.candidateBankSha256,responses:bankResponses.map(({status,sha256,bytes})=>({status,sha256,bytes}))},
      naturalSize:{expected:intrinsic,observed:target?{loaded:target.loaded,width:target.naturalWidth,height:target.naturalHeight}:null},
      sizeClass:{requested:requestedSizeClass,observed:target?.sizeClass??null},
      displayScale:{expected:state.expectedDisplayScale,observed:state.observedDisplayScale,deltaCssPx:state.displayScaleDeltaCssPx,toleranceCssPx:DISPLAY_SCALE_TOLERANCE_CSS_PX,imageRect:rect??null},
      layout:{source:layout.source,errors:layout.errors}
    };
    const failed=[['network','ARCHIVE_NETWORK_NOT_LOCAL'],['assetResponse','ARCHIVE_ASSET_RESPONSE_MISMATCH'],['bankResponse','ARCHIVE_BANK_RESPONSE_MISMATCH'],['naturalSize','ARCHIVE_ASSET_RESPONSE_MISMATCH'],...(problem?[['surface','ARCHIVE_PROBLEM_SURFACE_MISMATCH']]:[]),['sizeClass','ARCHIVE_SIZE_CLASS_MISMATCH'],['displayScale','ARCHIVE_DISPLAY_SCALE_MISMATCH'],['layout','ARCHIVE_LAYOUT_FAIL']].find(([key])=>state.checks[key]!=='PASS');
    if(failed)throw new Stop(failed[1],{check:failed[0],...detail[failed[0]]});
    return outcome('ARCHIVE_BOUND');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }
}
