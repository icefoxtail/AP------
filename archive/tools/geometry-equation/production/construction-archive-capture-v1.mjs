import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha,canonicalJson,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {compositePanelBytes} from './composite-candidate-svg-v1.mjs';
import {acceptArchiveViolations,scoredAcceptanceEnabled} from './score-candidate.mjs';
import {parseQuestionUidV2,SOURCE_QUESTION_ID_PATTERN} from '../../pipeline-core/question-uid.mjs';
import {loadBank,bankAliasSuffix} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence,measureArchiveDisplayEnvelope,measureArchiveDisplayEnvelopeBatch,normalizeArchiveImageUrlPath,archiveAssetSha256,isArchiveExamSourcePath} from '../record-visual-browser-evidence.mjs';
import {currentBatchSession} from './exam-batch.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {assetIdentity} from './contracts.mjs';
import {DISPLAY_SIZE_CLASSES,requestedProfileTypographyPolicy} from './display-envelope.mjs';

export const ARCHIVE_CAPTURE_VERSION='construction-archive-capture-v1';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const HASH=/^sha256:[0-9a-f]{64}$/;
const RUN_ID=/^[A-Za-z0-9_-]{1,80}$/;
const EXAM_UID=/^[\p{L}\p{N}_.-]{1,180}$/u;
export const DISPLAY_SCALE_TOLERANCE_CSS_PX=1;// compareActualDisplayEnvelope's default toleranceCssPx
const FLOAT_SLACK=1e-9;// exactly 1 px must not be refused for float noise (a 1 px difference of 174/384 computes to 1.000000000000007)
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});// the matrix row below, as in phase2.mjs 739
// Why a phone row failed, one short code per error (the part after ARCHIVE_PHONE_DISPLAY_FAIL:), so a scorer can tell a figure that is cut off or lost (blocking) from labels that touch (a deduction).
// An error is "<assetId>:<CODE>:<detail>" (layout replay) or "<CODE>:<assetId>" (row checks); a page exception text has no code at all.
const PHONE_REASON_ORDER=['IMAGE_LOAD_FAIL','TARGET_OUTSIDE_SCREEN','TARGET_HORIZONTAL_OVERFLOW','TEXT_CLIPPED','GEOMETRY_VIEWPORT_CLIPPING'];
export function phoneFailureReasons(errors,assetId){
  const reasons=[];
  for(const error of errors){
    const text=String(error),stripped=text.startsWith(assetId+':')?text.slice(assetId.length+1):text,head=stripped.split(':')[0];
    const reason=head==='TARGET_SVG_LOAD_FAIL'?'IMAGE_LOAD_FAIL':/^[A-Z][A-Z0-9_]*$/.test(head)?head:'PAGE_ERROR';
    if(!reasons.includes(reason))reasons.push(reason);
  }
  return reasons.sort((a,b)=>{const ia=PHONE_REASON_ORDER.indexOf(a),ib=PHONE_REASON_ORDER.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib);});
}
// A phone (<= 640 px wide: archive2-preview-mobile.css shows the solution figure at most 92% of the box wide and 340 px high). 390 x 844 is the common modern phone.
export const PHONE_VIEWPORT=Object.freeze({width:390,height:844});
const PROTECTED_FIELDS=['content','choices','answer','solution','image'];
const PATCHED_FIELDS=['solutionImage','solutionImageSize','solutionImageAlt'];
const SCALE_FIELD='solutionImageScale';// added to the patch only when the measured policy carries a scale (% of the column, 30-100)
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

/**
 * Does the SHA of what the Archive received equal the bank this module wrote? Chrome hands a script's body to the page recorder as decoded text, so a file that starts with a
 * UTF-8 byte order mark (EF BB BF) arrives without it (2026-11-23: 22_효천고_2학기_중간_고2_확률과통계.js). Exactly ONE leading BOM is ignored; any other byte difference, and a second BOM, still refuse.
 */
export function bankResponseMatches(responseSha256,candidateBytes){
  if(!HASH.test(responseSha256))return false;
  if(bytesSha(candidateBytes)===responseSha256)return true;
  const bom=candidateBytes.length>=3&&candidateBytes[0]===0xef&&candidateBytes[1]===0xbb&&candidateBytes[2]===0xbf;
  return bom&&bytesSha(candidateBytes.subarray(3))===responseSha256;
}

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
function checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress,requireOriginal=false}){
  checkIdentity(identity);
  const invalid=(reason,extra)=>{throw new Stop('ARCHIVE_INPUT_INVALID',{reason,...extra});};
  if(!DISPLAY_SIZE_CLASSES.includes(requestedSizeClass))invalid('SIZE_CLASS');
  // ordinal: the question's integer id, or its string id exactly as the bank writes it ("q01", "s01").
  if(!(Number.isSafeInteger(ordinal)&&ordinal>=1)&&!(typeof ordinal==='string'&&SOURCE_QUESTION_ID_PATTERN.test(ordinal)))invalid('ORDINAL');
  if(typeof runId!=='string'||!RUN_ID.test(runId))invalid('RUN_ID');
  if(onProgress!==undefined&&typeof onProgress!=='function')invalid('ON_PROGRESS');
  if(typeof sourcePath!=='string'||!sourcePath.startsWith('archive/exams/')||!sourcePath.endsWith('.js')||requireOriginal&&!isArchiveExamSourcePath(sourcePath,root))invalid('SOURCE_SCOPE');
  let sourceRef,raw;
  try{sourceRef=fileRef(root,sourcePath);raw=readBoundFile(root,sourceRef).toString('utf8');}catch(error){invalid('SOURCE_NOT_A_FILE',{code:errorText(error)});}
  // Structural binding only: the UID is not checked against the source-exam registry (uidAuthority STRUCTURAL_ONLY).
  const examUid=path.posix.basename(sourcePath,'.js'),parsed=parseQuestionUidV2(identity.questionUid);
  if(!EXAM_UID.test(examUid))invalid('EXAM_UID_NOT_PATH_SAFE');
  if(parsed.sourceExamId!==examUid.normalize('NFC')||parsed.sourceQuestionOrdinal!==ordinal)throw new Stop('IDENTITY_SOURCE_MISMATCH',{questionUid:identity.questionUid,sourceExamId:examUid,ordinal});
  let bank;
  try{bank=loadBank(raw);}catch(error){invalid('SOURCE_BANK_UNREADABLE',{code:errorText(error)});}
  if(!Array.isArray(bank)||!bank.some(question=>question.id===ordinal))invalid('ORDINAL_NOT_IN_BANK');
  if(identity.surface!=='SOLUTION_VISUAL')invalid('SURFACE_NOT_SOLUTION_VISUAL');
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
export async function measureArchiveTypographyPolicy({identity,sourcePath,ordinal,requestedSizeClass,intrinsicSvg,runId,signal,onProgress}={}){
  const state={policy:null,policySha256:null,provenance:null,paths:null,solutionImageScale:undefined,evidence:{observationSha256:null,matrixSha256:null,archiveRow:null,screenshot:null,engineSha256:null}};
  const outcome=(status,detail=null)=>({schemaVersion:ARCHIVE_CAPTURE_VERSION,status,detail,policy:state.policy,policySha256:state.policySha256,provenance:state.provenance,evidence:{...state.evidence},paths:state.paths,...(state.solutionImageScale!==undefined?{solutionImageScale:state.solutionImageScale}:{}),...flags(onProgress)});
  try{
    const input=checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress,requireOriginal:true});// measureArchiveDisplayEnvelope takes any .js under archive/exams/ (original, similar, textbooks, other folders; no path escape or link out of it)
    if(!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||intrinsicSvg.width<1||intrinsicSvg.height<1)throw new Stop('ARCHIVE_INPUT_INVALID',{reason:'INTRINSIC_SVG'});
    createRun(input.runRoot,runId);
    // One real-Archive measurement of the target at the given solutionImageScale (undefined = the page's default rule: 80% of the column since 2026-11-21, 60% before); the evidence it leaves is what the policy is derived from.
    const measureAt=async scale=>{
      const preflightRun=path.join(input.productionDir,scale===undefined?'display-envelope-preflight':'display-envelope-preflight-scale'+scale);fs.mkdirSync(preflightRun,{recursive:true});
      state.paths={runRoot:rel(input.runRoot),matrix:rel(path.join(preflightRun,'archive-render-matrix.json'))};
      let measured;
      try{measured=await measureEnvelope({run:preflightRun,sourceRef:input.sourceRef,sourceOrdinal:ordinal,targetId:identity.assetId,questionUid:identity.questionUid,intrinsicSvg,signal,onProgress,blockExternalRequests:true,sizeClasses:[requestedSizeClass],...(scale!==undefined?{solutionImageScale:scale}:{})});}
      catch(error){if(isCancel(error))throw error;throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:errorText(error)});}
      if(measured.status!=='PASS')throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:'MEASUREMENT_NOT_PASS'});
      const names=fs.readdirSync(measured.captureFolder),rowName=names.find(name=>name===identity.assetId+'-sol-desktop-envelope.json'),shotName=names.find(name=>name.endsWith('-'+identity.assetId+'-envelope-context.png'));
      if(!rowName||!shotName)throw new Stop('ARCHIVE_PREFLIGHT_FAIL',{message:'ENVELOPE_RAW_CAPTURE_MISSING'});
      state.evidence={observationSha256:objectSha(measured.observation),matrixSha256:bytesSha(fs.readFileSync(path.join(preflightRun,'archive-render-matrix.json'))),archiveRow:fileRef(root,rel(path.join(measured.captureFolder,rowName))),screenshot:fileRef(root,rel(path.join(measured.captureFolder,shotName))),engineSha256:'sha256:'+measured.rowEvidence.engineSha256};
      return measured;
    };
    // The default A4 display (80% of the column = 253 css px) is always the binding side (the phone shows a canvas at that same 253 px at most, with a lower font floor), so it keeps the policy's own minimum base font; a scaled display also keeps phone labels readable.
    const derive=(measured,scale)=>requestedProfileTypographyPolicy({requestedSizeClass,intrinsicSvg,observation:measured.observation,fontFloorCssPx:11,...(scale!==undefined?{minimumBaseFontPx:phoneMinimumBaseFontPx(intrinsicSvg.width)}:{})});
    // A question that already carries a valid solutionImageScale (a figure published under the 60% rule with 85 or 90) is displayed at that scale by the page, and a republished figure keeps the field
    // (the patch only ever adds it), so the capture would show it at that scale while a default measurement assumed the 80% default: ARCHIVE_DISPLAY_SCALE_MISMATCH. Such a question is measured at
    // its own scale first; when that scale cannot carry the figure the default path below runs as before (the capture's candidate then writes the scale it chose).
    const carried=carriedSolutionImageScale(input.bank.find(question=>question.id===ordinal));
    let measured=null,policy=null,refusal=null;
    if(carried!==undefined){
      measured=await measureAt(carried);
      try{policy=derive(measured,carried);state.solutionImageScale=carried;}
      catch(error){if(!isDomainCode(error))throw error;policy=null;}
      // 2026-11-23: a carried scale whose labels still display below the floor is treated like the old refusal: the default path below runs and may find a larger scale.
      if(policy?.displayTextBelow11px){policy=null;delete state.solutionImageScale;}
    }
    if(!policy){
      measured=await measureAt(undefined);
      try{policy=derive(measured,undefined);}
      catch(error){if(!isDomainCode(error))throw error;refusal=error;}
    }
    // 2026-11-19 (60% then, 80% since 2026-11-21: figure-size.css --ap-fig-sol): A4 shows a solution figure at a fixed share of the column, so a wide canvas (> about 720 px at 80%) would need a base font above the cap. The default is always the page's own, measured, never assumed.
    // Instead of refusing, the question carries solutionImageScale (% of the column, the same per-figure override the page reads): the figure is measured again
    // at that scale in the real Archive, and the scale is handed to the capture and to publication. Phone layouts ignore it (they size by natural width), so their labels only get larger.
    // 2026-11-23 (owner: the displayed font floor is released, never a refusal): the search stays, but its trigger is no longer a refusal, it is policy.displayTextBelow11px (the default display cannot show 11.25 CSS px labels even at the base font cap).
    // Candidates are tried smallest first and the first one whose labels display at 11.25 or more is taken; when none does, the largest candidate is taken (the figure is shown as large as the column allows) and displayTextBelow11px stays recorded.
    // A candidate that errors is skipped; if every candidate fails the default policy is kept.
    if((policy?.displayTextBelow11px)||(!policy&&refusal?.message==='UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE')){
      const observation=measured.observation;
      const chosen=await selectSolutionImageScale({defaultPolicy:policy,scales:solutionImageScaleCandidatesWithMaximum({intrinsicSvg,observation}),derivePolicy:async scale=>derive(await measureAt(scale),scale),isDomainCode});
      if(chosen.refusal)refusal=chosen.refusal;
      policy=chosen.policy;if(chosen.scale!==undefined)state.solutionImageScale=chosen.scale;
    }
    if(!policy)throw new Stop('ARCHIVE_POLICY_UNSUPPORTED',{message:errorText(refusal)});
    state.policy=policy;state.policySha256=objectSha(policy);state.provenance='ARCHIVE_MEASURED';
    return outcome('MEASURED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }
}

// The display measurement of one figure. Inside an exam batch (exam-batch.mjs) the figures of one exam that ask in the same round share one open Archive page;
// anything the batch cannot vouch for (and every figure outside a batch) is measured by measureArchiveDisplayEnvelope alone, as it always was.
function measureEnvelope(args){
  const single=()=>measureArchiveDisplayEnvelope(args);
  // A scored re-render (render-plan --accept-scored) is captured alone, as outside a batch: its layout violations are scored per figure, which one shared page cannot do.
  const session=args.signal===undefined&&args.onProgress===undefined&&!scoredAcceptanceEnabled()?currentBatchSession():null;
  if(!session)return single();
  const {run,sourceRef,sourceOrdinal,targetId,questionUid,intrinsicSvg,sizeClasses,solutionImageScale}=args;
  return session.submit({kind:'measure',group:sourceRef.path+'|'+args.blockExternalRequests,dupKey:targetId,payload:{run,sourceRef,sourceOrdinal,targetId,questionUid,intrinsicSvg,sizeClasses,solutionImageScale},
    batch:payloads=>measureArchiveDisplayEnvelopeBatch({requests:payloads,blockExternalRequests:args.blockExternalRequests}),single});
}

// A4 column the figure scale is a ratio of (figure-size.css --ap-col-w: 83.65mm = 316.2 px), the figure width a 375 px phone gives a 600+ px canvas
// (phone layouts ignore the scale and show the figure at 90% of the column, viewport - 94 px: measured at 360/375/390 px), and the base label font the scale aims at
// (the policy allows 20-32 SVG units; the middle of the range keeps labels in the proportion the standard 384-wide canvases have).
export const A4_FIGURE_COLUMN_CSS_PX=316.2;
/** Candidate scales for a figure whose default display shows labels under the floor: solutionImageScaleCandidates plus the largest whole percent the column allows (a figure too wide for any listed candidate is still shown as large as possible). Ascending. */
export function solutionImageScaleCandidatesWithMaximum({intrinsicSvg,observation}){
  const column=Math.min(A4_FIGURE_COLUMN_CSS_PX,Number.isFinite(observation?.solutionMetaContentWidth)&&observation.solutionMetaContentWidth>0?observation.solutionMetaContentWidth:A4_FIGURE_COLUMN_CSS_PX);
  const maximumScale=Math.min(100,Math.floor(column/A4_FIGURE_COLUMN_CSS_PX*100+1e-9));
  const scales=solutionImageScaleCandidates({intrinsicSvg,observation});
  if(maximumScale>=30&&!scales.includes(maximumScale))scales.push(maximumScale);
  return scales.sort((x,y)=>x-y);
}
/**
 * 2026-11-23 (owner: the displayed font floor is released, never a refusal). Pick the display scale (% of the column) once the default display shows labels under the floor:
 * candidates are tried smallest first; the first whose policy has no displayTextBelow11px is taken, otherwise the largest candidate (displayTextBelow11px stays recorded).
 * A candidate whose derivation fails with a domain code is skipped. A candidate that still shows labels under the floor is taken only if it displays larger than the default.
 * Returns {policy,scale,refusal}: scale is undefined when the default is kept; policy is null only when there is no default and every candidate failed.
 */
export async function selectSolutionImageScale({defaultPolicy,scales,derivePolicy,isDomainCode:domain=()=>true}){
  let largest=null,refusal=null;
  for(const scale of scales){
    let candidate;
    try{candidate=await derivePolicy(scale);}
    catch(error){if(!domain(error))throw error;refusal=error;continue;}
    largest={policy:candidate,scale};
    if(!candidate.displayTextBelow11px)break;
  }
  if(largest&&(!largest.policy.displayTextBelow11px||!defaultPolicy||largest.policy.displayScale>defaultPolicy.displayScale+1e-9))return {policy:largest.policy,scale:largest.scale,refusal};
  return {policy:defaultPolicy??null,scale:undefined,refusal};
}
/** The valid per-figure A4 scale (30-100, % of the column) a bank question already carries, else undefined. */
export const carriedSolutionImageScale=question=>Number.isFinite(question?.[SCALE_FIELD])&&question[SCALE_FIELD]>=30&&question[SCALE_FIELD]<=100?question[SCALE_FIELD]:undefined;
export const PHONE_FIGURE_WIDTH_CSS_PX=253;
export const PHONE_FONT_FLOOR_CSS_PX=10;// below the A4 floor (11): a phone shows a 600+ px canvas at about 250 px whatever the base font, and a base font above ~25 leaves labels no room on the canvas
export const SOLUTION_SCALE_TARGET_BASE_FONT_PX=24;
export const SOLUTION_SCALE_STEP=5;
const ceilTenth=value=>Math.ceil((value-1e-9)*10)/10;
/** Smallest base label font (SVG units) that still shows PHONE_FONT_FLOOR_CSS_PX labels when a phone fits the canvas into PHONE_FIGURE_WIDTH_CSS_PX; the policy cap (32) is the ceiling. */
export function phoneMinimumBaseFontPx(canvasWidth,{minimumBaseFontPx=20,maximumBaseFontPx=32}={}){
  return Math.min(maximumBaseFontPx,Math.max(minimumBaseFontPx,ceilTenth(PHONE_FONT_FLOOR_CSS_PX*canvasWidth/PHONE_FIGURE_WIDTH_CSS_PX)));
}
/** Scales (% of the column, multiples of 5, at most 100) to try when the default display cannot reach the font floor: the smallest that aims at the target base font, then one or two bigger, never more than the column can show. */
export function solutionImageScaleCandidates({intrinsicSvg,observation,fontFloorCssPx=11,comfortCssPx=.25,targetBaseFontPx=SOLUTION_SCALE_TARGET_BASE_FONT_PX}){
  const first=widthScaleCandidates({intrinsicSvg,observation,fontFloorCssPx,comfortCssPx,targetBaseFontPx});
  // (P-A) What the width-only list above cannot reach is appended AFTER it, so a figure that a listed scale already carried keeps choosing the same scale (same bytes): (1) a figure the
  // HEIGHT limits (a tall stack: the page's override box is a square of scale% of the column, so 410x788 is limited by its 788) and (2) the largest whole percent the column allows, which
  // is not always a multiple of 5 (a 828-wide grid needs 92% of a 298 px column; 90 is the last multiple of 5). Each extra scale must still be able to show the labels at the font floor:
  // the page shows the figure at most min(column, scale% of the column) wide and scale% of the column high, so the base font that floor needs may not pass the policy cap (32).
  // The Archive measurement that follows each candidate stays the judge; this only decides which scales are worth measuring.
  const column=Math.min(A4_FIGURE_COLUMN_CSS_PX,Number.isFinite(observation?.solutionMetaContentWidth)&&observation.solutionMetaContentWidth>0?observation.solutionMetaContentWidth:A4_FIGURE_COLUMN_CSS_PX);
  const {width,height}=intrinsicSvg;
  const needed=value=>{const box=A4_FIGURE_COLUMN_CSS_PX*value/100;return (fontFloorCssPx+comfortCssPx)/Math.min(Math.min(column,box)/width,box/height);};
  const largestWhole=Math.min(100,Math.floor(column/A4_FIGURE_COLUMN_CSS_PX*100+1e-9));
  const extra=[];
  for(let value=Math.max(30,Math.max(0,...first)+SOLUTION_SCALE_STEP);value<=largestWhole&&extra.length<2;value+=SOLUTION_SCALE_STEP)if(needed(value)<=32&&!first.includes(value))extra.push(value);
  if(largestWhole>=30&&needed(largestWhole)<=32&&!first.includes(largestWhole)&&!extra.includes(largestWhole))extra.push(largestWhole);
  return [...first,...extra];
}
function widthScaleCandidates({intrinsicSvg,observation,fontFloorCssPx,comfortCssPx,targetBaseFontPx}){
  const column=Math.min(A4_FIGURE_COLUMN_CSS_PX,Number.isFinite(observation?.solutionMetaContentWidth)&&observation.solutionMetaContentWidth>0?observation.solutionMetaContentWidth:A4_FIGURE_COLUMN_CSS_PX);
  const baseWanted=Math.min(32,Math.max(targetBaseFontPx,phoneMinimumBaseFontPx(intrinsicSvg.width)));
  const wantedWidth=(fontFloorCssPx+comfortCssPx)/baseWanted*intrinsicSvg.width;
  const first=Math.max(SOLUTION_SCALE_STEP*Math.ceil(wantedWidth/A4_FIGURE_COLUMN_CSS_PX*100/SOLUTION_SCALE_STEP),30);
  // The figure can never be shown wider than the column, so a larger scale does nothing more: the list stops at the largest step that fits (and starts there when the wanted one does not).
  const largest=Math.min(100,SOLUTION_SCALE_STEP*Math.floor(column/A4_FIGURE_COLUMN_CSS_PX*100/SOLUTION_SCALE_STEP+1e-9));
  return [...new Set([first,first+SOLUTION_SCALE_STEP,first+2*SOLUTION_SCALE_STEP].map(value=>Math.min(value,largest)))].filter(value=>value>=30&&(fontFloorCssPx+comfortCssPx)*intrinsicSvg.width/(A4_FIGURE_COLUMN_CSS_PX*value/100)<=32);
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
  const observation={...envelope,questionUid:identity.questionUid,synthetic:false,runtime:row.runtime,browserVersion:row.browserVersion,sourceRef,sourceAuthorityStatus:'MEASUREMENT_ONLY'};
  if(objectSha(observation)!==evidence.observationSha256)bad('OBSERVATION_SHA_DIFFERS');
  let derived;
  try{derived=requestedProfileTypographyPolicy({requestedSizeClass:measuredPolicy.policy.requestedSizeClass,intrinsicSvg:envelope.intrinsicSvg,observation,fontFloorCssPx:measuredPolicy.policy.fontFloorCssPx,...(envelope.solutionImageScale!==undefined?{minimumBaseFontPx:phoneMinimumBaseFontPx(envelope.intrinsicSvg.width)}:{})});}
  catch(error){bad('POLICY_NOT_DERIVED_FROM_EVIDENCE',{code:errorText(error)});}
  if(!same(derived,measuredPolicy.policy))bad('POLICY_NOT_DERIVED_FROM_EVIDENCE');
  // The display scale the policy was measured at must be the one the row recorded (none = the default rule of the page): a different scale would display differently from what the policy assumed.
  if(measuredPolicy.solutionImageScale!==envelope.solutionImageScale)bad('SOLUTION_IMAGE_SCALE_NOT_IN_EVIDENCE',{claimed:measuredPolicy.solutionImageScale??null,measured:envelope.solutionImageScale??null});
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
export async function captureArchiveCandidate(args={}){
  const session=args.signal===undefined&&args.onProgress===undefined?currentBatchSession():null;
  if(!session)return captureCore(args,null,null);
  // Inside an exam batch the figures of one exam that are ready in the same round are shown to one open Archive page. A figure the batch did not carry through to ARCHIVE_BOUND
  // is captured alone, from the start, exactly as outside a batch (a new run directory, so its refusal is the one it gets alone). A refusal from before the page was needed is the same either way.
  const trace={recorded:false};
  const outcome=await captureCore(args,session,trace);
  if(outcome.status==='ARCHIVE_BOUND'||!trace.recorded)return outcome;
  return captureCore({...args,runId:args.runId+'-s'},null,null);
}
async function captureCore({composed,identity,sourcePath,ordinal,requestedSizeClass,measuredPolicy,alt,runId,signal,onProgress,fixtureClassification=null}={},session,trace){
  const lineage=Object.fromEntries(LINEAGE_KEYS.map(key=>[key,null]));
  const state={paths:null,protectedParity:null,solutionImageScale:undefined,phone:null,pageNotes:[],sizeClass:null,observedDisplayScale:null,expectedDisplayScale:null,displayScaleDeltaCssPx:null,layout:null,checks:null};
  const outcome=(status,detail=null)=>({schemaVersion:ARCHIVE_CAPTURE_VERSION,status,detail,lineage:{...lineage},paths:state.paths,protectedParity:state.protectedParity,...(state.solutionImageScale!==undefined?{solutionImageScale:state.solutionImageScale}:{}),sizeClass:state.sizeClass,observedDisplayScale:state.observedDisplayScale,expectedDisplayScale:state.expectedDisplayScale,displayScaleDeltaCssPx:state.displayScaleDeltaCssPx,layout:state.layout,checks:state.checks,...(state.phone?{phone:state.phone}:{}),...(state.pageNotes.length?{pageNotes:state.pageNotes}:{}),fixtureClassification,...flags(onProgress)});
  try{
    const input=checkInput({identity,sourcePath,ordinal,requestedSizeClass,runId,onProgress});
    if(typeof alt!=='string'||!alt.trim())throw new Stop('ARCHIVE_INPUT_INVALID',{reason:'ALT'});
    checkComposed(composed,lineage);
    const intrinsic=svgIntrinsic(composed.svg),engineRef=fileRef(root,'archive/engine.html');
    if(!intrinsic)throw new Stop('COMPOSED_INPUT_INVALID',{reason:'SVG_INTRINSIC_UNREADABLE'});
    checkSvgReferences(composed.svg);
    if(HASH.test(measuredPolicy?.policySha256))lineage.policySha256=measuredPolicy.policySha256;
    checkMeasuredPolicy({measuredPolicy,composed,identity,sourceRef:input.sourceRef,engineRef,intrinsic});
    lineage.engineSha256=engineRef.sha256;
    const assetId=identity.assetId,policy=measuredPolicy.policy,svgSha256=composed.lineage.svgSha256;

    createRun(input.runRoot,runId);
    // asset: the L1 bytes, written once, read back
    const assetName=typeof ordinal==='string'?`${ordinal}-solution.svg`:`q${String(ordinal).padStart(2,'0')}-solution.svg`,archiveAssetRef=`assets/images/${input.examUid}/${assetName}`;// phase2.mjs 690-691
    const assetFile=path.join(input.examRoot,archiveAssetRef);
    writeNew(assetFile,Buffer.from(composed.svg,'utf8'));lineage.assetPath=rel(assetFile);
    const written=bytesSha(fs.readFileSync(assetFile));
    if(written!==svgSha256)throw new Stop('ARCHIVE_ASSET_WRITE_MISMATCH',{expected:svgSha256,written});
    // candidate bank: only the three solutionImage* fields of the target question change (phase2.mjs 727-734)
    state.solutionImageScale=measuredPolicy.solutionImageScale;
    const patch={solutionImage:archiveAssetRef,solutionImageSize:requestedSizeClass,solutionImageAlt:alt,...(state.solutionImageScale!==undefined?{[SCALE_FIELD]:state.solutionImageScale}:{})};
    const patchedFields=Object.keys(patch);
    const candidate=input.raw+bankAliasSuffix(input.raw)+'\n;Object.assign(window.questionBank.find(q=>q.id==='+JSON.stringify(ordinal)+'),'+JSON.stringify(patch)+');\n';
    const patched=clone(loadBank(candidate)),original=clone(input.bank);
    if(patched.length!==original.length)throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{reason:'QUESTION_COUNT'});
    original.forEach((question,index)=>{
      const before={...question},after={...patched[index]};
      if(question.id===ordinal){
        for(const field of [...PATCHED_FIELDS,SCALE_FIELD]){delete before[field];delete after[field];}
        if(!patchedFields.every(field=>patched[index][field]===patch[field]))throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{reason:'PATCH_NOT_APPLIED',questionId:question.id});
      }
      if(!same(before,after))throw new Stop('ARCHIVE_PROTECTED_FIELD_MUTATION',{questionId:question.id});
    });
    state.protectedParity={status:'PASS',sourceRef:input.sourceRef,originalQuestionSha256:objectSha(original.find(question=>question.id===ordinal)),questionCount:original.length,protectedFields:PROTECTED_FIELDS,changedFields:patchedFields,targetOrdinal:ordinal};
    const archiveRun=path.join(input.productionDir,'archive-capture'),matrixFile=path.join(archiveRun,'archive-render-matrix.json');
    let candidateFile,candidateBytes,archive;
    if(session){
      // exam batch: the page is opened for every figure of the exam that is ready now; the figure's own run directory gets the record of its part of it (batchCapture)
      trace.recorded=true;
      const answered=await session.submit({kind:'capture',group:sourcePath,dupKey:assetId,payload:{input,assetId,ordinal,patch,archiveAssetRef,assetPath:lineage.assetPath,svgSha256,sourcePath,engineSha256:bare(engineRef.sha256),archiveRun},
        batch:batchCapture,single:async()=>({fallback:true})});
      if(answered.fallback)throw new Stop('ARCHIVE_BATCH_FALLBACK');
      ({archive,candidateFile,candidateBytes}=answered);
      lineage.candidateBankSha256=bytesSha(candidateBytes);lineage.matrixSha256=bytesSha(answered.matrixBytes);
      state.paths={runRoot:rel(input.runRoot),asset:lineage.assetPath,candidateBank:rel(candidateFile),matrix:rel(matrixFile),archiveRow:null,screenshots:null};
    }else{
      candidateFile=path.join(input.examRoot,'candidates',input.examUid+'.js');candidateBytes=Buffer.from(candidate,'utf8');
      writeNew(candidateFile,candidateBytes);lineage.candidateBankSha256=bytesSha(candidateBytes);
      // matrix: phase2.mjs 738-740, except that the asset carries no sizeClass, so the row reports the class of the rendered wrapper instead of echoing the request
      const info={id:assetId,sourcePath,sourceSha256:bare(input.sourceRef.sha256),candidatePath:rel(candidateFile),candidateSha256:bare(lineage.candidateBankSha256),questionCount:input.bank.length,assets:[{id:assetId,path:lineage.assetPath,archivePath:archiveAssetRef,sha256:bare(svgSha256),questionId:ordinal}]};
      const matrix={synthetic:false,legacyHashAlgorithm:'SHA256_RAW_HEX_v1',engineSha256:bare(engineRef.sha256),sources:[info],rows:[{...info,mode:'sol',viewport:'desktop',...PUBLICATION_VIEWPORT,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))},
        // the same exam page on a phone: the figure must load, stay inside its question box and the screen, and keep its labels whole at the size the phone shows it
        {...info,mode:'sol',viewport:'phone',...PHONE_VIEWPORT,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))}]};
      const matrixBytes=Buffer.from(canonicalJson(matrix),'utf8');
      writeNew(matrixFile,matrixBytes);lineage.matrixSha256=bytesSha(matrixBytes);
      state.paths={runRoot:rel(input.runRoot),asset:lineage.assetPath,candidateBank:rel(candidateFile),matrix:rel(matrixFile),archiveRow:null,screenshots:null};

      // capture, once
      onProgress?.({event:'ARCHIVE_CANDIDATE_READY',runId,assetPath:lineage.assetPath});
      try{archive=await recordArchiveEvidence({run:archiveRun,signal,onProgress,blockExternalRequests:true});}
      catch(error){if(isCancel(error))throw error;throw new Stop('ARCHIVE_CAPTURE_ERROR',{message:errorText(error)});}
    }
    const captureFolder=path.join(archiveRun,'archive-render/attempt-01'),prefix=assetId+'-sol-desktop',phonePrefix=assetId+'-sol-phone',rowFile=path.join(captureFolder,prefix+'.json');
    if(!fs.existsSync(rowFile))throw new Stop('ARCHIVE_CAPTURE_ERROR',{message:'ARCHIVE_ROW_MISSING'});
    const rowBytes=fs.readFileSync(rowFile),row=JSON.parse(rowBytes.toString('utf8'));
    lineage.archiveRowSha256=bytesSha(rowBytes);state.paths.archiveRow=rel(rowFile);state.paths.screenshots={};lineage.screenshotSha256s={};
    for(const [name,file] of [['image',`${prefix}-${assetId}.png`],['context',`${prefix}-${assetId}-context.png`],['page',`${prefix}.png`]])if(fs.existsSync(path.join(captureFolder,file))){state.paths.screenshots[name]=rel(path.join(captureFolder,file));lineage.screenshotSha256s[name]=bytesSha(fs.readFileSync(path.join(captureFolder,file)));}
    // the asset and the exam JS (the candidate bank) the Archive really received, as recorded by the page's own response listener
    const received=urlPath=>(row.responses||[]).filter(response=>normalizeArchiveImageUrlPath(response.url)===urlPath);
    const responses=received('/archive/'+archiveAssetRef),bankResponses=received('/'+sourcePath);
    lineage.assetResponseSha256=responseSha(responses);
    const desktopRows=archive.rows.filter(item=>item.id===prefix),phoneRows=archive.rows.filter(item=>item.id===phonePrefix);
    if(desktopRows.some(item=>item.status!=='PASS'))throw new Stop('ARCHIVE_CAPTURE_FAIL',{rows:desktopRows,errors:desktopRows.flatMap(item=>item.errors??[])});

    // bind
    const target=row.state?.targets?.find(item=>item.id===assetId),rect=target?.rect;
    state.sizeClass=target?.sizeClass??null;
    let difference=null;
    const finite=rect&&['width','height'].every(key=>Number.isFinite(rect[key])&&rect[key]>0);
    if(finite){
      state.observedDisplayScale=Math.min(rect.width/intrinsic.width,rect.height/intrinsic.height);state.expectedDisplayScale=policy.displayScale;
      difference=displayScaleDifference({observed:state.observedDisplayScale,expected:state.expectedDisplayScale,intrinsic});state.displayScaleDeltaCssPx=difference.deltaCssPx;
    }
    let layout;
    const recorded=row.layouts?.find(item=>item.id===assetId);
    if(recorded)layout={source:'ARCHIVE_ROW_ISOLATED_REPLAY',status:recorded.status,errors:recorded.errors??[],...(recorded.scoredAccepted===true?{scoredAccepted:true}:{})};
    else if(finite){// the row has no analysis of this asset: replay the same bytes at the real image rect
      const browser=await launchBrowser();
      try{
        const page=await browser.newPage({viewport:{width:Math.ceil(rect.width),height:Math.ceil(rect.height)}});
        const analysis=analyzeRenderedLayout(await captureAtDisplaySize(page,composed.svg,rect,{publicationViewport:PUBLICATION_VIEWPORT}));
        layout={source:'MODULE_REPLAY_AT_ACTUAL_RECT',status:analysis.status,errors:analysis.errors,...(analysis.status!=='PASS'&&acceptArchiveViolations(analysis.violations)?{scoredAccepted:true}:{})};
      }finally{await browser.close();}
    }else layout={source:'NONE',status:'FAIL',errors:['NO_TARGET_RECT']};
    state.layout=layout;
    const pass=value=>value?'PASS':'FAIL';
    state.checks={
      network:pass(row.network?.policy==='LOCAL_ONLY'&&Array.isArray(row.network.externalRequests)&&row.network.externalRequests.length===0),
      assetResponse:pass(responses.length===1&&responses[0].status===200&&lineage.assetResponseSha256===svgSha256),
      bankResponse:pass(bankResponses.length===1&&bankResponses[0].status===200&&bankResponseMatches(responseSha(bankResponses),candidateBytes)),
      naturalSize:pass(target?.loaded===true&&target.naturalWidth===intrinsic.width&&target.naturalHeight===intrinsic.height),
      displayScale:pass(finite&&difference.withinTolerance),
      layout:pass(layout.status==='PASS'||layout.scoredAccepted===true)
    };
    const detail={
      network:{policy:row.network?.policy??null,externalRequests:row.network?.externalRequests??null},
      assetResponse:{expected:svgSha256,responses:responses.map(({status,sha256,bytes})=>({status,sha256,bytes}))},
      bankResponse:{expected:lineage.candidateBankSha256,responses:bankResponses.map(({status,sha256,bytes})=>({status,sha256,bytes}))},
      naturalSize:{expected:intrinsic,observed:target?{loaded:target.loaded,width:target.naturalWidth,height:target.naturalHeight}:null},
      displayScale:{expected:state.expectedDisplayScale,observed:state.observedDisplayScale,deltaCssPx:state.displayScaleDeltaCssPx,toleranceCssPx:DISPLAY_SCALE_TOLERANCE_CSS_PX,imageRect:rect??null},
      layout:{source:layout.source,errors:layout.errors}
    };
    const failed=[['network','ARCHIVE_NETWORK_NOT_LOCAL'],['assetResponse','ARCHIVE_ASSET_RESPONSE_MISMATCH'],['bankResponse','ARCHIVE_BANK_RESPONSE_MISMATCH'],['naturalSize','ARCHIVE_ASSET_RESPONSE_MISMATCH'],['displayScale','ARCHIVE_DISPLAY_SCALE_MISMATCH'],['layout','ARCHIVE_LAYOUT_FAIL']].find(([key])=>state.checks[key]!=='PASS');
    if(failed)throw new Stop(failed[1],{check:failed[0],...detail[failed[0]]});
    // Notes about the rest of the exam page (not this figure) travel with the result but never fail it.
    state.pageNotes=[...(row.pageNotes||[])];
    // The same page on a phone (<= 640 px): the figure loaded, inside its question box and the screen, with whole labels (isolated replay at the rect the phone really gives it).
    const phoneFile=path.join(captureFolder,phonePrefix+'.json');
    if(fs.existsSync(phoneFile)){
      const phoneRow=JSON.parse(fs.readFileSync(phoneFile,'utf8')),phoneTarget=phoneRow.state?.targets?.find(item=>item.id===assetId),phoneRect=phoneTarget?.rect;
      const phoneRectOk=phoneRect&&['width','height'].every(key=>Number.isFinite(phoneRect[key])&&phoneRect[key]>0);
      const outsideScreenPx=phoneRectOk?Math.max(0,-phoneRect.x,phoneRect.x+phoneRect.width-PHONE_VIEWPORT.width):null;
      const phoneErrors=[...(phoneRow.errors||[])];
      if(phoneRectOk&&outsideScreenPx>DISPLAY_SCALE_TOLERANCE_CSS_PX)phoneErrors.push('TARGET_OUTSIDE_SCREEN:'+assetId);
      if(!phoneRectOk&&!phoneErrors.length)phoneErrors.push('NO_TARGET_RECT');
      const phoneReasons=phoneFailureReasons(phoneErrors,assetId);
      state.phone={status:phoneErrors.length?'FAIL':'PASS',viewport:{...PHONE_VIEWPORT},imageRect:phoneRect??null,displayScale:phoneRectOk?Math.min(phoneRect.width/intrinsic.width,phoneRect.height/intrinsic.height):null,outsideScreenPx,reasons:phoneReasons,errors:phoneErrors,...(phoneRow.pageNotes?.length?{pageNotes:phoneRow.pageNotes}:{})};
      if(phoneErrors.length)throw new Stop('ARCHIVE_PHONE_DISPLAY_FAIL:'+phoneReasons[0],{...state.phone});
    }else if(phoneRows.length){const rowErrors=phoneRows.flatMap(item=>item.errors??[]),reasons=phoneFailureReasons(rowErrors,assetId);throw new Stop('ARCHIVE_PHONE_DISPLAY_FAIL:'+(reasons[0]??'NO_PHONE_ROW'),{reasons,errors:rowErrors});}
    return outcome('ARCHIVE_BOUND');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }
}

// ---- exam batch (exam-batch.mjs): one open Archive page for the figures of ONE exam that are ready in the same round ----
// The exam page is opened once (desktop row and phone row) with every figure of the round in the candidate bank, and each figure gets, in its OWN run directory, the record it would
// have had alone: its row (errors, targets and layouts of this figure only), its screenshots, its candidate bank and its matrix. Everything captureCore binds afterwards is read from those
// files exactly as for a single capture. A figure with any error of its own, or with an error that belongs to no figure, gets {ok:false}: it is then captured alone from the start.
const capturedCount=(layouts,key)=>layouts.reduce((sum,item)=>sum+(item[key]??0),0);
function figureRowView(row,payload,all,id){
  const owns=error=>{const text=String(error);return text.includes(payload.assetId)||!all.some(other=>other!==payload&&text.includes(other.assetId));};
  const errors=(row.errors||[]).filter(owns);
  const layouts=(row.layouts||[]).filter(item=>item.id===payload.assetId);
  const state={...row.state,targets:(row.state?.targets||[]).filter(item=>item.id===payload.assetId)};
  if(Array.isArray(row.state?.targetBoxOverflows))state.targetBoxOverflows=row.state.targetBoxOverflows.filter(item=>item.id===payload.assetId);
  const notes=(row.pageNotes||[]).filter(note=>note.scope!=='TARGET_BOX'||note.targetId===payload.assetId);
  const {pageNotes:_all,...rest}=row;
  const capture=Object.keys(row.state||{}).length?{status:'MEASURED',missingGlyphCount:capturedCount(layouts,'missingGlyphCount'),labelCollisionCount:capturedCount(layouts,'labelCollisionCount'),criticalCollisionCount:capturedCount(layouts,'criticalCollisionCount'),observedLabelCollisionCount:layouts.reduce((s,v)=>s+(v.observedLabelCollisionCount??v.labelCollisionCount),0),observedCriticalCollisionCount:layouts.reduce((s,v)=>s+(v.observedCriticalCollisionCount??v.criticalCollisionCount),0),clippedTextCount:capturedCount(layouts,'clippedTextCount'),overflowCount:Number(state.horizontalOverflow||false)+capturedCount(layouts,'overflowCount'),loadedSvgCount:row.mode==='sol'?state.targets.filter(v=>v.loaded).length:0,failedSvgCount:row.mode==='sol'?state.targets.filter(v=>!v.loaded).length:0}:row.capture;
  return {...rest,id,status:errors.length?'FAIL':'PASS',...(notes.length?{pageNotes:notes}:{}),state,layouts,errors,capture};
}
const placeFile=(from,to)=>{try{fs.linkSync(from,to);}catch{fs.copyFileSync(from,to);}};
async function batchCapture(payloads){
  const refuse=()=>payloads.map(()=>({ok:false}));
  let batchRoot=null;
  try{
    const first=payloads[0];
    if(payloads.length<2||payloads.some(item=>item.sourcePath!==first.sourcePath||item.input.sourceRef.sha256!==first.input.sourceRef.sha256||item.engineSha256!==first.engineSha256))return refuse();
    const {examUid,raw,bank}=first.input,sourcePath=first.sourcePath;
    const batchId='bc-'+crypto.randomUUID().slice(0,8);
    batchRoot=path.join(root,'.tmp/archive',batchId);
    const examRoot=path.join(batchRoot,examUid),archiveRun=path.join(examRoot,'visual-engine/production/archive-capture');
    fs.mkdirSync(batchRoot,{recursive:true});
    const candidate=raw+bankAliasSuffix(raw)+payloads.map(item=>'\n;Object.assign(window.questionBank.find(q=>q.id==='+JSON.stringify(item.ordinal)+'),'+JSON.stringify(item.patch)+');\n').join('');
    // the same protected-field parity as for one figure, over the bank with every figure of the round written
    const patched=clone(loadBank(candidate)),original=clone(bank);
    if(patched.length!==original.length)return refuse();
    const byOrdinal=new Map(payloads.map(item=>[item.ordinal,item]));
    for(const [index,question] of original.entries()){
      const before={...question},after={...patched[index]},own=byOrdinal.get(question.id);
      if(own){
        for(const field of [...PATCHED_FIELDS,SCALE_FIELD]){delete before[field];delete after[field];}
        if(!Object.keys(own.patch).every(field=>patched[index][field]===own.patch[field]))return refuse();
      }
      if(!same(before,after))return refuse();
    }
    const candidateFile=path.join(examRoot,'candidates',examUid+'.js'),candidateBytes=Buffer.from(candidate,'utf8');
    writeNew(candidateFile,candidateBytes);
    const info={id:batchId,sourcePath,sourceSha256:bare(first.input.sourceRef.sha256),candidatePath:rel(candidateFile),candidateSha256:bare(bytesSha(candidateBytes)),questionCount:bank.length,assets:payloads.map(item=>({id:item.assetId,path:item.assetPath,archivePath:item.archiveAssetRef,sha256:bare(item.svgSha256),questionId:item.ordinal}))};
    const urlPath='/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''));
    const matrix={synthetic:false,legacyHashAlgorithm:'SHA256_RAW_HEX_v1',engineSha256:first.engineSha256,sources:[info],rows:[{...info,mode:'sol',viewport:'desktop',...PUBLICATION_VIEWPORT,requireLocalResources:true,requireQrRenderer:true,urlPath},{...info,mode:'sol',viewport:'phone',...PHONE_VIEWPORT,requireLocalResources:true,requireQrRenderer:true,urlPath}]};
    const matrixBytes=Buffer.from(canonicalJson(matrix),'utf8');
    writeNew(path.join(archiveRun,'archive-render-matrix.json'),matrixBytes);
    await recordArchiveEvidence({run:archiveRun,blockExternalRequests:true});
    const folder=path.join(archiveRun,'archive-render/attempt-01');
    const desktopRow=JSON.parse(fs.readFileSync(path.join(folder,batchId+'-sol-desktop.json'),'utf8')),phoneRow=JSON.parse(fs.readFileSync(path.join(folder,batchId+'-sol-phone.json'),'utf8'));
    return payloads.map(item=>{
      try{
        const desktop=figureRowView(desktopRow,item,payloads,item.assetId+'-sol-desktop'),phone=figureRowView(phoneRow,item,payloads,item.assetId+'-sol-phone');
        if(desktop.status!=='PASS'||phone.status!=='PASS'||!desktop.state.targets.length||!phone.state.targets.length)return {ok:false};
        const ownFolder=path.join(item.archiveRun,'archive-render/attempt-01');fs.mkdirSync(ownFolder,{recursive:true});
        const ownCandidate=path.join(item.input.examRoot,'candidates',item.input.examUid+'.js');
        writeNew(ownCandidate,candidateBytes);writeNew(path.join(item.archiveRun,'archive-render-matrix.json'),matrixBytes);
        fs.writeFileSync(path.join(ownFolder,desktop.id+'.json'),JSON.stringify(desktop,null,2)+'\n');
        fs.writeFileSync(path.join(ownFolder,phone.id+'.json'),JSON.stringify(phone,null,2)+'\n');
        for(const viewport of ['desktop','phone'])for(const suffix of ['.png','-'+item.assetId+'.png','-'+item.assetId+'-context.png']){
          const from=path.join(folder,batchId+'-sol-'+viewport+suffix);
          if(fs.existsSync(from))placeFile(from,path.join(ownFolder,item.assetId+'-sol-'+viewport+suffix));
        }
        return {ok:true,value:{archive:{rows:[{id:desktop.id,status:'PASS',capture:desktop.capture,errors:[]},{id:phone.id,status:'PASS',capture:phone.capture,errors:[]}]},candidateFile:ownCandidate,candidateBytes,matrixBytes}};
      }catch{return {ok:false};}
    });
  }catch{
    return refuse();
  }finally{
    if(batchRoot)try{fs.rmSync(batchRoot,{recursive:true,force:true});}catch{/* a later prune removes it */}
  }
}
