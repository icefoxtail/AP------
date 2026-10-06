import {HASH_PATTERN,objectSha,readBoundFile,bytesSha,canonicalJson} from '../../pipeline-core/canonical.mjs';

export const DISPLAY_SIZE_CLASSES=Object.freeze(['small','medium','large','full']);

const finiteRect=rect=>rect&&['x','y','width','height'].every(key=>Number.isFinite(rect[key]))&&rect.width>0&&rect.height>0;
const near=(a,b,tolerance)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance;
const same=(a,b)=>canonicalJson(a)===canonicalJson(b);
const validRef=ref=>ref&&typeof ref.path==='string'&&Number.isSafeInteger(ref.bytes)&&ref.bytes>=0&&HASH_PATTERN.test(ref.sha256);
const pngSignature=Buffer.from([137,80,78,71,13,10,26,10]);

function measuredProfiles(observation,intrinsicSvg,candidateLabelInventory){
  const byClass=new Map(observation.profiles.map(profile=>[profile.sizeClass,profile]));
  if(DISPLAY_SIZE_CLASSES.some(sizeClass=>!byClass.has(sizeClass)))throw Error('DISPLAY_ENVELOPE_PROFILE_INVENTORY_INCOMPLETE');
  const labelIds=new Set();
  for(const label of candidateLabelInventory){
    if(typeof label?.id!=='string'||!label.id||!Number.isFinite(label.fontPx)||label.fontPx<11||labelIds.has(label.id))throw Error('DISPLAY_ENVELOPE_LABEL_INVENTORY_INVALID');
    labelIds.add(label.id);
  }
  if(!candidateLabelInventory.length)throw Error('DISPLAY_ENVELOPE_LABEL_INVENTORY_REQUIRED');
  return DISPLAY_SIZE_CLASSES.map(sizeClass=>{
    const profile=byClass.get(sizeClass);
    if(profile.status!=='PASS'||!finiteRect(profile.imageRect)||profile.naturalWidth!==intrinsicSvg.width||profile.naturalHeight!==intrinsicSvg.height||!profile.computedStyle||!['maxWidth','maxHeight','objectFit','transform'].every(key=>typeof profile.computedStyle[key]==='string'))throw Error('DISPLAY_ENVELOPE_PROFILE_MEASUREMENT_INVALID:'+sizeClass);
    const scaleX=profile.imageRect.width/intrinsicSvg.width,scaleY=profile.imageRect.height/intrinsicSvg.height,displayScale=Math.min(scaleX,scaleY);
    const provisionalLabelFonts=candidateLabelInventory.map(label=>({id:label.id,baseFontPx:label.fontPx,provisionalCssFontPx:label.fontPx*displayScale}));
    return {...profile,scaleX,scaleY,displayScale,provisionalLabelFonts,provisionalMinimumCssFontPx:Math.min(...provisionalLabelFonts.map(v=>v.provisionalCssFontPx)),profilePolicySha256:objectSha(profile.computedStyle),supportStatus:'NOT_AUDITED'};
  });
}

export function requestedProfileTypographyPolicy({requestedSizeClass,intrinsicSvg,observation,fontFloorCssPx=11,comfortCssPx=.25,minimumBaseFontPx=20,maximumBaseFontPx=32}){
  if(!DISPLAY_SIZE_CLASSES.includes(requestedSizeClass)||!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||intrinsicSvg.width<1||intrinsicSvg.height<1)throw Error('REQUESTED_PROFILE_TYPOGRAPHY_INPUT_INVALID');
  if(observation?.status!=='PASS'||observation.synthetic!==false||observation.runtime!=='playwright-chromium'||!Array.isArray(observation.profiles))throw Error('ACTUAL_ARCHIVE_PROFILE_TYPOGRAPHY_MEASUREMENT_REQUIRED');
  if(!Number.isFinite(fontFloorCssPx)||fontFloorCssPx<11||!Number.isFinite(comfortCssPx)||comfortCssPx<0||!Number.isFinite(minimumBaseFontPx)||minimumBaseFontPx<11||!Number.isFinite(maximumBaseFontPx)||maximumBaseFontPx<minimumBaseFontPx)throw Error('REQUESTED_PROFILE_TYPOGRAPHY_POLICY_INVALID');
  const profile=observation.profiles.find(value=>value.sizeClass===requestedSizeClass);
  if(profile?.status!=='PASS'||!finiteRect(profile.imageRect)||profile.naturalWidth!==intrinsicSvg.width||profile.naturalHeight!==intrinsicSvg.height)throw Error('REQUESTED_PROFILE_TYPOGRAPHY_MEASUREMENT_INVALID');
  const displayScale=Math.min(profile.imageRect.width/intrinsicSvg.width,profile.imageRect.height/intrinsicSvg.height);
  const cssTargetFontPx=fontFloorCssPx+comfortCssPx,requiredBaseFontPx=cssTargetFontPx/displayScale;
  const baseFontPx=Math.max(minimumBaseFontPx,Math.ceil((requiredBaseFontPx-1e-9)*10)/10);
  if(!Number.isFinite(displayScale)||displayScale<=0||!Number.isFinite(baseFontPx)||baseFontPx>maximumBaseFontPx)throw Error('UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE');
  return{schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',requestedSizeClass,displayScale,cssTargetFontPx,fontFloorCssPx,comfortCssPx,minimumBaseFontPx,maximumBaseFontPx,baseFontPx,rounding:'CEIL_TO_TENTH_BASE_PX'};
}

function normalizePolicyRefs(policyRefs){
  if(!Array.isArray(policyRefs)||policyRefs.length===0)throw Error('DISPLAY_ENVELOPE_POLICY_REFS_REQUIRED');
  const refs=policyRefs.map(item=>{
    const name=item?.name,ref=item?.ref;
    if(typeof name!=='string'||!name||!validRef(ref))throw Error('DISPLAY_ENVELOPE_POLICY_REF_INVALID');
    return {name,ref};
  }).sort((a,b)=>a.name.localeCompare(b.name));
  if(new Set(refs.map(item=>item.name)).size!==refs.length)throw Error('DISPLAY_ENVELOPE_POLICY_NAMES_DUPLICATE');
  return refs;
}

function createInputIdentity({questionUid,sourceRef,solutionRef,policyRefs}){
  if(!validRef(sourceRef)||!validRef(solutionRef))throw Error('DISPLAY_ENVELOPE_SOURCE_SOLUTION_REFS_REQUIRED');
  const normalizedPolicyRefs=normalizePolicyRefs(policyRefs);
  const archiveEngine=normalizedPolicyRefs.find(item=>item.name==='archive-engine');
  if(!archiveEngine)throw Error('DISPLAY_ENVELOPE_ARCHIVE_ENGINE_POLICY_REF_REQUIRED');
  const identity={questionUid,sourceRef,solutionRef,policyRefs:normalizedPolicyRefs};
  return {identity,inputIdentitySha256:objectSha(identity),archiveEngineSha256:archiveEngine.ref.sha256};
}

function readJson(root,ref){
  const bytes=readBoundFile(root,ref);
  return JSON.parse(bytes.toString('utf8'));
}

function decodedUrlPath(value){
  try{return decodeURIComponent(new URL(value,'http://archive.invalid').pathname);}catch{return null;}
}

function verifyInputIdentity(root,plannedEnvelope){
  const identity=plannedEnvelope.inputIdentity;
  if(!identity||identity.questionUid!==plannedEnvelope.questionUid||!validRef(identity.sourceRef)||!validRef(identity.solutionRef)||!Array.isArray(identity.policyRefs)||objectSha(identity)!==plannedEnvelope.inputIdentitySha256)throw Error('DISPLAY_ENVELOPE_INPUT_IDENTITY_INVALID');
  const policies=normalizePolicyRefs(identity.policyRefs);
  if(policies.find(item=>item.name==='archive-engine')?.ref.sha256!==plannedEnvelope.archiveEngineSha256)throw Error('DISPLAY_ENVELOPE_ARCHIVE_ENGINE_POLICY_MISMATCH');
  readBoundFile(root,identity.sourceRef);
  readBoundFile(root,identity.solutionRef);
  for(const item of policies)readBoundFile(root,item.ref);
  return identity;
}

function verifyActualArchivePreflight(root,preflightEvidence,{questionUid,sourceRef,archiveEngineSha256}){
  if(!preflightEvidence||!validRef(preflightEvidence.measurementRef)||!validRef(preflightEvidence.archiveRowRef)||!validRef(preflightEvidence.screenshotRef))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_REFS_REQUIRED');
  const measurement=readJson(root,preflightEvidence.measurementRef),row=readJson(root,preflightEvidence.archiveRowRef);
  const screenshot=readBoundFile(root,preflightEvidence.screenshotRef),screenshotSize=pngInfo(screenshot);
  if(!screenshotSize||measurement.screenshotViewport?.width!==screenshotSize.width||measurement.screenshotViewport?.height!==screenshotSize.height)throw Error('ACTUAL_ARCHIVE_PREFLIGHT_SCREENSHOT_INVALID');
  if(measurement.schemaVersion!=='DISPLAY_ENVELOPE_PREFLIGHT_v1'||measurement.status!=='PASS'||measurement.synthetic!==false||measurement.runtime!=='playwright-chromium'||measurement.questionUid!==questionUid||!same(measurement.sourceRef,sourceRef))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_BINDING_INVALID');
  if(!same(measurement.archiveRowRef,preflightEvidence.archiveRowRef)||!same(measurement.screenshotRef,preflightEvidence.screenshotRef))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_REF_MISMATCH');
  if(!validRef(measurement.candidateRef)||!measurement.candidateRef.path.startsWith('.tmp/archive/'))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_TEMP_CANDIDATE_REQUIRED');
  const sourceBytes=readBoundFile(root,sourceRef),candidateBytes=readBoundFile(root,measurement.candidateRef);
  if(!sourceBytes.equals(candidateBytes))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_SOURCE_COPY_MISMATCH');
  if(row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||row.browserVersion!==measurement.browserVersion||row.engineSha256!==archiveEngineSha256.slice(7))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_ROW_INVALID');
  if(row.sourceSha256!==sourceRef.sha256.slice(7)||!same(row.sourceRef||measurement.sourceRef,sourceRef))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_SOURCE_MISMATCH');
  const observed=(row.state?.displayEnvelopes||[]).find(value=>value.id===measurement.targetId);
  if(!observed||observed.status!=='PASS'||!same(observed.profiles,measurement.observation?.profiles)||!same(observed.qBoxRect,measurement.observation?.qBoxRect)||!same(observed.solutionMetaRect,measurement.observation?.solutionMetaRect)||observed.solutionMetaContentWidth!==measurement.observation?.solutionMetaContentWidth||!same(observed.intrinsicSvg,measurement.observation?.intrinsicSvg))throw Error('ACTUAL_ARCHIVE_PREFLIGHT_MEASUREMENT_MISMATCH');
  if(measurement.observation?.sourceRef&&measurement.observation.sourceRef.path!==sourceRef.path)throw Error('ACTUAL_ARCHIVE_PREFLIGHT_SOURCE_PATH_MISMATCH');
  return measurement;
}

function verifyPlannedPreflight(root,plannedEnvelope){
  if(!plannedEnvelope.preflightEvidence||objectSha(plannedEnvelope.preflightEvidence)!==plannedEnvelope.preflightEvidenceSha256)throw Error('DISPLAY_ENVELOPE_PREFLIGHT_IDENTITY_INVALID');
  const preflight=verifyActualArchivePreflight(root,plannedEnvelope.preflightEvidence,{questionUid:plannedEnvelope.questionUid,sourceRef:plannedEnvelope.sourceRef,archiveEngineSha256:plannedEnvelope.archiveEngineSha256});
  if(!same(preflight.observation.qBoxRect,plannedEnvelope.container.qBoxRect)||!same(preflight.observation.solutionMetaRect,plannedEnvelope.container.solutionMetaRect)||preflight.observation.solutionMetaContentWidth!==plannedEnvelope.container.solutionMetaContentWidth)throw Error('DISPLAY_ENVELOPE_PREFLIGHT_CONTAINER_MISMATCH');
  for(const profile of plannedEnvelope.profiles){
    const observed=preflight.observation.profiles.find(value=>value.sizeClass===profile.sizeClass);
    if(!observed||observed.status!==profile.status||!same(observed.imageRect,profile.imageRect)||!same(observed.computedStyle,profile.computedStyle)||observed.naturalWidth!==profile.naturalWidth||observed.naturalHeight!==profile.naturalHeight||profile.profilePolicySha256!==objectSha(observed.computedStyle))throw Error('DISPLAY_ENVELOPE_PREFLIGHT_PROFILE_MISMATCH:'+profile.sizeClass);
  }
  return preflight;
}

function crc32(bytes){
  let crc=0xffffffff;
  for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc&1)?(crc>>>1)^0xedb88320:crc>>>1;}
  return (crc^0xffffffff)>>>0;
}

function pngInfo(bytes){
  if(!Buffer.isBuffer(bytes)||bytes.length<45||!bytes.subarray(0,8).equals(pngSignature))return null;
  let offset=8,width=0,height=0,seenHeader=false,seenData=false,seenEnd=false;
  while(offset<bytes.length){
    if(offset+12>bytes.length)return null;
    const length=bytes.readUInt32BE(offset),end=offset+12+length;
    if(end>bytes.length)return null;
    const type=bytes.toString('ascii',offset+4,offset+8),body=bytes.subarray(offset+8,offset+8+length),expected=bytes.readUInt32BE(offset+8+length),actual=crc32(bytes.subarray(offset+4,offset+8+length));
    if(expected!==actual||seenEnd)return null;
    if(!seenHeader){
      if(type!=='IHDR'||length!==13)return null;
      width=body.readUInt32BE(0);height=body.readUInt32BE(4);if(!width||!height)return null;seenHeader=true;
    }else if(type==='IHDR')return null;
    if(type==='IDAT'){if(!length)return null;seenData=true;}
    if(type==='IEND'){if(length!==0||!seenData)return null;seenEnd=true;if(end!==bytes.length)return null;}
    offset=end;
  }
  return seenHeader&&seenData&&seenEnd?{width,height}:null;
}

function svgIntrinsic(bytes){
  const source=bytes.toString('utf8'),tag=source.match(/<svg\b([^>]*)>/i)?.[1];
  if(!tag)return null;
  const attr=name=>tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`,'i'))?.[2]??null;
  const dimension=value=>{
    if(typeof value!=='string'||!/^\d+(?:\.\d+)?(?:px)?$/i.test(value.trim()))return null;
    const number=Number.parseFloat(value);
    return Number.isFinite(number)&&number>0?number:null;
  };
  const width=dimension(attr('width')),height=dimension(attr('height'));
  const viewBoxText=attr('viewBox');
  const viewBox=typeof viewBoxText==='string'?viewBoxText.trim().split(/[\s,]+/).map(Number):[];
  if(!Number.isFinite(width)||!Number.isFinite(height)||viewBox.length!==4||viewBox.some(v=>!Number.isFinite(v))||viewBox[0]!==0||viewBox[1]!==0||viewBox[2]!==width||viewBox[3]!==height)return null;
  return {width,height,viewBox};
}

function profileEvidence(root,ref,expectedSizeClass){
  if(!validRef(ref))throw Error('PROFILE_MEASUREMENT_REF_REQUIRED');
  let measurement;
  try{measurement=readJson(root,ref);}catch{throw Error('PROFILE_MEASUREMENT_REF_INVALID');}
  if(measurement?.schemaVersion!=='DISPLAY_PROFILE_AUDIT_v1'||measurement.sizeClass!==expectedSizeClass)throw Error('PROFILE_MEASUREMENT_BINDING_INVALID');
  if(!validRef(measurement.screenshotRef))throw Error('PROFILE_SCREENSHOT_REF_REQUIRED');
  let screenshot;
  try{screenshot=readBoundFile(root,measurement.screenshotRef);}catch{throw Error('PROFILE_SCREENSHOT_REF_INVALID');}
  const image=pngInfo(screenshot);
  if(!image)throw Error('PROFILE_SCREENSHOT_PNG_INVALID');
  if(measurement.screenshotViewport?.width!==image.width||measurement.screenshotViewport?.height!==image.height)throw Error('PROFILE_SCREENSHOT_DIMENSION_MISMATCH');
  return {measurement,screenshotRef:measurement.screenshotRef};
}

function profileAuditErrors({audit,measurement,screenshotRef,plannedProfile,plannedEnvelope,candidateSvgRef,candidateIntrinsic,identity}){
  const errors=[];
  if(measurement.synthetic!==false)errors.push('PROFILE_SYNTHETIC_EVIDENCE_REJECTED');
  if(measurement.runtime!=='playwright-chromium'||typeof measurement.browserVersion!=='string'||!measurement.browserVersion)errors.push('PROFILE_PLAYWRIGHT_RUNTIME_REQUIRED');
  if(measurement.status!=='PASS')errors.push('PROFILE_BROWSER_MEASUREMENT_FAILED');
  if(measurement.questionUid!==plannedEnvelope.questionUid)errors.push('PROFILE_QUESTION_IDENTITY_MISMATCH');
  if(!same(measurement.candidateSvgRef,candidateSvgRef)||measurement.candidateSvgSha256!==candidateSvgRef.sha256)errors.push('PROFILE_CANDIDATE_SVG_BINDING_MISMATCH');
  if(measurement.naturalWidth!==candidateIntrinsic.width||measurement.naturalHeight!==candidateIntrinsic.height)errors.push('PROFILE_CANDIDATE_INTRINSIC_MISMATCH');
  if(measurement.rawCapture?.viewBox?.width!==candidateIntrinsic.width||measurement.rawCapture?.viewBox?.height!==candidateIntrinsic.height||!finiteRect(measurement.rawCapture?.svg)||!near(measurement.rawCapture.svg.width,plannedProfile.imageRect.width,1)||!near(measurement.rawCapture.svg.height,plannedProfile.imageRect.height,1))errors.push('PROFILE_BROWSER_CANDIDATE_RENDER_MISMATCH');
  if(!same(measurement.sourceRef,identity.sourceRef)||!same(measurement.solutionRef,identity.solutionRef)||!same(measurement.policyRefs,identity.policyRefs)||measurement.inputIdentitySha256!==plannedEnvelope.inputIdentitySha256)errors.push('PROFILE_SOURCE_SOLUTION_POLICY_IDENTITY_MISMATCH');
  if(!finiteRect(measurement.imageRect)||!near(measurement.imageRect.width,plannedProfile.imageRect.width,1)||!near(measurement.imageRect.height,plannedProfile.imageRect.height,1))errors.push('PROFILE_IMAGE_RECT_MISMATCH');
  if(!same(measurement.computedStyle,plannedProfile.computedStyle)||measurement.profilePolicySha256!==plannedProfile.profilePolicySha256)errors.push('PROFILE_DISPLAY_POLICY_MISMATCH');
  if(!measurement.screenshotViewport||!Number.isFinite(measurement.screenshotViewport.width)||!Number.isFinite(measurement.screenshotViewport.height)||measurement.screenshotViewport.width<1||measurement.screenshotViewport.height<1)errors.push('PROFILE_SCREENSHOT_VIEWPORT_MISSING');
  if(!screenshotRef||audit.screenshotRef&& !same(audit.screenshotRef,screenshotRef))errors.push('PROFILE_SCREENSHOT_BINDING_MISMATCH');
  if(audit.sizeClass!==plannedProfile.sizeClass)errors.push('PROFILE_AUDIT_SIZE_CLASS_MISMATCH');
  return errors;
}

function checkProfileWorkerArtifact(root,ref,{kind,plannedProfile,plannedEnvelope,candidateSvgRef}){
  const code=kind==='GRAPH'?'GRAPH':'TOPOLOGY';
  if(!validRef(ref))return [`${code}_PROFILE_EVIDENCE_REF_REQUIRED`];
  let record;
  try{record=readJson(root,ref);}catch{return [`${code}_PROFILE_EVIDENCE_REF_INVALID`];}
  const errors=[];
  if(record.schemaVersion!==`DISPLAY_PROFILE_${code}_AUDIT_v1`||record.status!=='PASS')errors.push(`${code}_PROFILE_EVIDENCE_STATUS_INVALID`);
  if(record.questionUid!==plannedEnvelope.questionUid||record.sizeClass!==plannedProfile.sizeClass)errors.push(`${code}_PROFILE_EVIDENCE_IDENTITY_MISMATCH`);
  if(!same(record.candidateSvgRef,candidateSvgRef)||record.candidateSvgSha256!==candidateSvgRef.sha256)errors.push(`${code}_PROFILE_EVIDENCE_SVG_MISMATCH`);
  if(record.inputIdentitySha256!==plannedEnvelope.inputIdentitySha256)errors.push(`${code}_PROFILE_EVIDENCE_INPUT_MISMATCH`);
  if(!near(record.displayScale,plannedProfile.displayScale,1e-7))errors.push(`${code}_PROFILE_EVIDENCE_SCALE_MISMATCH`);
  return errors;
}

/** Resolve a measured, Archive-bound planning envelope. This is not a support verdict. */
export function planDisplayEnvelope({root,questionUid,requestedSizeClass='medium',intrinsicSvg,candidateLabelInventory,observation,preflightEvidence,fontFloorCssPx=11,typographyPolicy=null,archiveEngineSha256,sourceRef,solutionRef,policyRefs}){
  if(typeof questionUid!=='string'||!questionUid||!DISPLAY_SIZE_CLASSES.includes(requestedSizeClass))throw Error('DISPLAY_ENVELOPE_INPUT_INVALID');
  if(!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||intrinsicSvg.width<1||intrinsicSvg.height<1||!Number.isFinite(fontFloorCssPx)||fontFloorCssPx<11)throw Error('DISPLAY_ENVELOPE_INTRINSIC_INVALID');
  if(observation?.status!=='PASS'||observation?.synthetic!==false||observation?.runtime!=='playwright-chromium'||observation?.questionUid!==questionUid||!validRef(observation.sourceRef)||!finiteRect(observation.qBoxRect)||!finiteRect(observation.solutionMetaRect)||!Number.isFinite(observation.solutionMetaContentWidth)||observation.solutionMetaContentWidth<=0||!Array.isArray(observation.profiles))throw Error('ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED');
  if(!same(observation.sourceRef,sourceRef))throw Error('DISPLAY_ENVELOPE_SOURCE_OBSERVATION_MISMATCH');
  if(!HASH_PATTERN.test(archiveEngineSha256||''))throw Error('DISPLAY_ENVELOPE_ARCHIVE_ENGINE_SHA_REQUIRED');
  const {identity,inputIdentitySha256,archiveEngineSha256:policyArchiveEngineSha256}=createInputIdentity({questionUid,sourceRef,solutionRef,policyRefs});
  if(archiveEngineSha256!==policyArchiveEngineSha256)throw Error('DISPLAY_ENVELOPE_ARCHIVE_ENGINE_POLICY_MISMATCH');
  if(!root)throw Error('DISPLAY_ENVELOPE_ROOT_REQUIRED');
  const preflight=verifyActualArchivePreflight(root,preflightEvidence,{questionUid,sourceRef,archiveEngineSha256});
  if(!same(preflight.observation.profiles,observation.profiles)||!same(preflight.observation.qBoxRect,observation.qBoxRect)||!same(preflight.observation.solutionMetaRect,observation.solutionMetaRect)||preflight.observation.solutionMetaContentWidth!==observation.solutionMetaContentWidth)throw Error('ACTUAL_ARCHIVE_PREFLIGHT_OBSERVATION_NOT_BOUND');
  const profiles=measuredProfiles(observation,intrinsicSvg,candidateLabelInventory),start=DISPLAY_SIZE_CLASSES.indexOf(requestedSizeClass);
  if(typographyPolicy){
    const requested=profiles.find(profile=>profile.sizeClass===requestedSizeClass);
    if(typographyPolicy.schemaVersion!=='REQUESTED_PROFILE_TYPOGRAPHY_v1'||typographyPolicy.requestedSizeClass!==requestedSizeClass||!near(typographyPolicy.displayScale,requested.displayScale,1e-9)||typographyPolicy.fontFloorCssPx!==fontFloorCssPx||candidateLabelInventory.some(label=>label.fontPx!==typographyPolicy.baseFontPx)||typographyPolicy.baseFontPx*requested.displayScale<typographyPolicy.cssTargetFontPx-1e-7||typographyPolicy.cssTargetFontPx<fontFloorCssPx||typographyPolicy.baseFontPx<typographyPolicy.minimumBaseFontPx||typographyPolicy.baseFontPx>typographyPolicy.maximumBaseFontPx)throw Error('REQUESTED_PROFILE_TYPOGRAPHY_BINDING_INVALID');
  }
  const provisional=profiles.slice(start).find(profile=>profile.provisionalMinimumCssFontPx>=fontFloorCssPx-1e-7);
  return {
    schemaVersion:'DISPLAY_ENVELOPE_v1',status:provisional?'PLANNED':'PLANNED_RECOMPOSITION_REQUIRED',questionUid,occurrence:0,
    requestedSizeClass,plannedSizeClass:provisional?.sizeClass||null,
    policyChange:provisional&&provisional.sizeClass!==requestedSizeClass?{from:requestedSizeClass,to:provisional.sizeClass,reason:'PROVISIONAL_LABEL_INVENTORY_FLOOR_ONLY'}:null,
    intrinsicSvg:{...intrinsicSvg},candidateLabelInventory:candidateLabelInventory.map(v=>({id:v.id,fontPx:v.fontPx})),fontFloorCssPx,typographyPolicy,
    provisionalMinimumCssFontPx:provisional?.provisionalMinimumCssFontPx??null,
    fit:'NONE',container:{qBoxRect:observation.qBoxRect,solutionMetaRect:observation.solutionMetaRect,solutionMetaContentWidth:observation.solutionMetaContentWidth},
    profiles,archiveEngineSha256,sourceRef,solutionRef,policyRefs:identity.policyRefs,inputIdentity:identity,inputIdentitySha256,preflightEvidence,preflightEvidenceSha256:objectSha(preflightEvidence),
    measurementStatus:'ACTUAL_ARCHIVE_DOM_PREFLIGHT_NOT_FINAL_SUPPORT',
    provenance:{runtime:observation.runtime,browserVersion:observation.browserVersion,archiveSourceRef:observation.sourceRef,sourceAuthorityStatus:observation.sourceAuthorityStatus||'MEASUREMENT_ONLY'}
  };
}

/**
 * A profile can pass only from bound raw Playwright profile JSON and its raw PNG.
 * `profileAudits` is an array of {sizeClass, measurementRef}; inline verdicts alone
 * are deliberately insufficient.
 */
export function qualifyDisplayEnvelope(plannedEnvelope,{root,candidateSvgRef,profileAudits}={}){
  if(plannedEnvelope?.schemaVersion!=='DISPLAY_ENVELOPE_v1'||!['PLANNED','PLANNED_RECOMPOSITION_REQUIRED'].includes(plannedEnvelope.status)||!Array.isArray(profileAudits)||!root)throw Error('DISPLAY_ENVELOPE_PLAN_REQUIRED');
  const identity=verifyInputIdentity(root,plannedEnvelope);
  verifyPlannedPreflight(root,plannedEnvelope);
  if(!validRef(candidateSvgRef)||!candidateSvgRef.path.endsWith('.svg'))throw Error('DISPLAY_ENVELOPE_CANDIDATE_SVG_REF_REQUIRED');
  const svgBytes=readBoundFile(root,candidateSvgRef);
  const candidateIntrinsic=svgIntrinsic(svgBytes);
  if(bytesSha(svgBytes)!==candidateSvgRef.sha256||!candidateIntrinsic)throw Error('DISPLAY_ENVELOPE_CANDIDATE_SVG_INVALID');
  if(candidateIntrinsic.width!==plannedEnvelope.intrinsicSvg.width||candidateIntrinsic.height!==plannedEnvelope.intrinsicSvg.height)throw Error('DISPLAY_ENVELOPE_CANDIDATE_INTRINSIC_MISMATCH');
  const byClass=new Map(profileAudits.map(audit=>[audit.sizeClass,audit]));
  if(byClass.size!==profileAudits.length||DISPLAY_SIZE_CLASSES.some(sizeClass=>!byClass.has(sizeClass)))throw Error('DISPLAY_ENVELOPE_FINAL_PROFILE_AUDITS_INCOMPLETE');
  const measurementPaths=new Set(),screenshotPaths=new Set();
  const expectedIds=plannedEnvelope.candidateLabelInventory.map(v=>v.id).sort();
  const profiles=plannedEnvelope.profiles.map(plannedProfile=>{
    const audit=byClass.get(plannedProfile.sizeClass),errors=[];
    let evidence=null;
    try{
      evidence=profileEvidence(root,audit.measurementRef,plannedProfile.sizeClass);
      if(measurementPaths.has(audit.measurementRef.path))errors.push('PROFILE_MEASUREMENT_REF_REUSED');
      if(screenshotPaths.has(evidence.screenshotRef.path))errors.push('PROFILE_SCREENSHOT_REF_REUSED');
      measurementPaths.add(audit.measurementRef.path);screenshotPaths.add(evidence.screenshotRef.path);
    }catch(error){errors.push(error.message||'PROFILE_RAW_EVIDENCE_INVALID');}
    const measurement=evidence?.measurement;
    if(measurement)errors.push(...profileAuditErrors({audit,measurement,screenshotRef:evidence.screenshotRef,plannedProfile,plannedEnvelope,candidateSvgRef,candidateIntrinsic,identity}));
    const labels=measurement?.labelMeasurements;
    if(!Array.isArray(labels)||!labels.length)errors.push('FINAL_LABEL_MEASUREMENTS_REQUIRED');
    const actualIds=Array.isArray(labels)?labels.map(v=>v?.id).sort():[];
    if(JSON.stringify(actualIds)!==JSON.stringify(expectedIds))errors.push('FINAL_LABEL_INVENTORY_MISMATCH');
    const allFontsValid=Array.isArray(labels)&&labels.length===expectedIds.length&&labels.every(v=>typeof v?.id==='string'&&Number.isFinite(v.finalViewportCssFontPx)&&v.finalViewportCssFontPx>0);
    if(!allFontsValid)errors.push('FINAL_LABEL_FONT_METRIC_MISSING_OR_NONFINITE');
    const fonts=allFontsValid?labels.map(v=>v.finalViewportCssFontPx):[];
    const minimumCssFontPx=fonts.length?Math.min(...fonts):null;
    if(minimumCssFontPx===null||minimumCssFontPx<plannedEnvelope.fontFloorCssPx-1e-7)errors.push('FONT_FLOOR_FAIL');
    if(measurement?.layoutStatus!=='PASS')errors.push('LAYOUT_AUDIT_FAIL');
    if(measurement?.graphRequired){
      if(measurement.graphStatus!=='PASS')errors.push('GRAPH_PROFILE_AUDIT_FAIL');
      else errors.push(...checkProfileWorkerArtifact(root,measurement.graphEvidenceRef,{kind:'GRAPH',plannedProfile,plannedEnvelope,candidateSvgRef}));
    }
    if(measurement?.topologyRequired){
      if(measurement.topologyStatus!=='PASS')errors.push('TOPOLOGY_PROFILE_AUDIT_FAIL');
      else errors.push(...checkProfileWorkerArtifact(root,measurement.topologyEvidenceRef,{kind:'TOPOLOGY',plannedProfile,plannedEnvelope,candidateSvgRef}));
    }
    const strokes=measurement?.strokeMeasurements;
    const strokeBindingsValid=Array.isArray(strokes)&&strokes.length>0&&strokes.every(row=>typeof row?.id==='string'&&row.id&&row.sizeClass===plannedProfile.sizeClass&&row.candidateSvgSha256===candidateSvgRef.sha256&&row.inputIdentitySha256===plannedEnvelope.inputIdentitySha256&&Number.isFinite(row.finalViewportCssStrokePx)&&row.finalViewportCssStrokePx>=0)&&strokes.some(row=>row.finalViewportCssStrokePx>0);
    if(measurement?.strokeStatus!=='PASS'||!strokeBindingsValid)errors.push('STROKE_PROFILE_AUDIT_FAIL');
    const auditErrors=[...(measurement?.errors||[]),...errors];
    return {
      ...plannedProfile,
      supportStatus:auditErrors.length?'FAIL':'PASS',
      finalAudit:{runtime:measurement?.runtime||null,synthetic:measurement?.synthetic??null,browserVersion:measurement?.browserVersion||null,layoutStatus:measurement?.layoutStatus||'NOT_RUN',minimumCssFontPx,minimumCssFontLabelId:labels?.find(v=>v?.finalViewportCssFontPx===minimumCssFontPx)?.id||null,labelMeasurements:labels||[],graphRequired:!!measurement?.graphRequired,graphStatus:measurement?.graphStatus||'NOT_APPLICABLE',graphEvidenceRef:measurement?.graphEvidenceRef||null,topologyRequired:!!measurement?.topologyRequired,topologyStatus:measurement?.topologyStatus||'NOT_APPLICABLE',topologyEvidenceRef:measurement?.topologyEvidenceRef||null,strokeStatus:measurement?.strokeStatus||'NOT_RUN',strokeMeasurements:measurement?.strokeMeasurements||[],measurementRef:audit.measurementRef||null,screenshotRef:evidence?.screenshotRef||null,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plannedEnvelope.inputIdentitySha256,errors:auditErrors}
    };
  });
  const start=DISPLAY_SIZE_CLASSES.indexOf(plannedEnvelope.requestedSizeClass),selected=profiles.slice(start).find(profile=>profile.supportStatus==='PASS');
  const policyChange=selected&&selected.sizeClass!==plannedEnvelope.requestedSizeClass?{from:plannedEnvelope.requestedSizeClass,to:selected.sizeClass,reason:'REQUESTED_PROFILE_FAILED_FINAL_CANDIDATE_AUDIT'}:null;
  return {
    ...plannedEnvelope,status:selected?'PASS':'UNSUPPORTED_DISPLAY_ENVELOPE',sizeClass:selected?.sizeClass||null,
    policyChange:policyChange||plannedEnvelope.policyChange,
    expectedMinimumScale:selected?.displayScale??null,expectedMinimumCssFontPx:selected?.finalAudit.minimumCssFontPx??null,
    candidateSvgRef,selectedProfile:selected||null,profiles,
    measurementStatus:selected?'ACTUAL_ARCHIVE_PREFLIGHT_PLUS_BOUND_FINAL_PLAYWRIGHT_PROFILE_AUDITS':'FINAL_CANDIDATE_PROFILE_AUDITS_FAILED',
    errors:selected?[]:['NO_PROFILE_PASSED_FINAL_CANDIDATE_AUDITS']
  };
}

export function compareActualDisplayEnvelope(envelope,{root,actualRef}={}, {toleranceCssPx=1}={}){
  if(!envelope||!root||!validRef(actualRef))return {status:'FAIL',errors:['DISPLAY_ENVELOPE_ACTUAL_CAPTURE_REF_REQUIRED']};
  const errors=[];
  if(envelope?.schemaVersion!=='DISPLAY_ENVELOPE_v1'||envelope.status!=='PASS')errors.push('DISPLAY_ENVELOPE_NOT_RESOLVED');
  const identity=verifyInputIdentity(root,envelope);
  let candidateIntrinsic=null;
  try{candidateIntrinsic=svgIntrinsic(readBoundFile(root,envelope.candidateSvgRef));if(!candidateIntrinsic||candidateIntrinsic.width!==envelope.intrinsicSvg.width||candidateIntrinsic.height!==envelope.intrinsicSvg.height)errors.push('ACTUAL_DISPLAY_FINAL_SVG_REF_INVALID');}catch{errors.push('ACTUAL_DISPLAY_FINAL_SVG_REF_INVALID');}
  let actual=null;
  try{actual=readJson(root,actualRef);}catch{errors.push('ACTUAL_DISPLAY_CAPTURE_REF_INVALID');}
  if(actual){
    if(actual.schemaVersion!=='DISPLAY_ARCHIVE_ACTUAL_v1'||actual.status!=='PASS')errors.push('ACTUAL_DISPLAY_OBSERVATION_MISMATCH');
    if(actual.synthetic!==false||actual.runtime!=='playwright-chromium'||!actual.browserVersion)errors.push('ACTUAL_DISPLAY_PLAYWRIGHT_RUNTIME_REQUIRED');
    if(actual.questionUid!==envelope.questionUid)errors.push('ACTUAL_DISPLAY_QUESTION_IDENTITY_MISMATCH');
    if(!same(actual.candidateSvgRef,envelope.candidateSvgRef)||actual.candidateSvgSha256!==envelope.candidateSvgRef?.sha256)errors.push('ACTUAL_DISPLAY_CANDIDATE_SVG_MISMATCH');
    if(candidateIntrinsic&&(actual.naturalWidth!==candidateIntrinsic.width||actual.naturalHeight!==candidateIntrinsic.height))errors.push('ACTUAL_DISPLAY_CANDIDATE_INTRINSIC_MISMATCH');
    if(!same(actual.sourceRef,identity.sourceRef)||!same(actual.solutionRef,identity.solutionRef)||!same(actual.policyRefs,identity.policyRefs)||actual.inputIdentitySha256!==envelope.inputIdentitySha256)errors.push('ACTUAL_DISPLAY_SOURCE_SOLUTION_POLICY_MISMATCH');
    if(!validRef(actual.screenshotRef))errors.push('ACTUAL_DISPLAY_SCREENSHOT_REF_REQUIRED');
    else{
      try{
        const png=readBoundFile(root,actual.screenshotRef),image=pngInfo(png);
        if(!image)errors.push('ACTUAL_DISPLAY_SCREENSHOT_PNG_INVALID');
        else if(actual.screenshotViewport?.width!==image.width||actual.screenshotViewport?.height!==image.height)errors.push('ACTUAL_DISPLAY_SCREENSHOT_DIMENSION_MISMATCH');
      }catch{errors.push('ACTUAL_DISPLAY_SCREENSHOT_REF_INVALID');}
    }
    if(!validRef(actual.archiveRowRef))errors.push('ACTUAL_DISPLAY_ARCHIVE_ROW_REF_REQUIRED');
    else{
      try{
        const row=readJson(root,actual.archiveRowRef),expectedPath=typeof actual.archiveAssetPath==='string'?'/archive/'+actual.archiveAssetPath:null;
        if(row.status!=='PASS'||row.synthetic!==false||row.runtime!=='playwright-chromium'||row.browserVersion!==actual.browserVersion)errors.push('ACTUAL_DISPLAY_ARCHIVE_ROW_INVALID');
        const target=(row.state?.targets||[]).find(value=>value.id===actual.targetId);
        if(!target||target.loaded!==true||target.sizeClass!==actual.sizeClass||!same(target.rect,actual.imageRect)||!same(target.solutionMetaRect,actual.solutionMetaRect)||target.solutionMetaContentWidth!==actual.solutionMetaContentWidth||!same(target.qBoxRect,actual.qBoxRect)||!same(target.computedStyle,actual.computedStyle)||target.naturalWidth!==candidateIntrinsic?.width||target.naturalHeight!==candidateIntrinsic?.height)errors.push('ACTUAL_DISPLAY_ARCHIVE_TARGET_MISMATCH');
        if(!expectedPath||decodedUrlPath(target?.src)!==expectedPath)errors.push('ACTUAL_DISPLAY_ARCHIVE_ASSET_PATH_MISMATCH');
        const responseVerified=(row.responses||[]).some(response=>response.status===200&&response.sha256===envelope.candidateSvgRef.sha256.slice(7)&&decodedUrlPath(response.url)===expectedPath);
        if(!responseVerified)errors.push('ACTUAL_DISPLAY_ARCHIVE_ASSET_SHA_MISMATCH');
      }catch{errors.push('ACTUAL_DISPLAY_ARCHIVE_ROW_REF_INVALID');}
    }
  }
  if(actual?.sizeClass!==envelope.sizeClass)errors.push('ACTUAL_DISPLAY_SIZE_CLASS_MISMATCH');
  if(!finiteRect(actual?.imageRect)||!finiteRect(actual?.solutionMetaRect)||!finiteRect(actual?.qBoxRect))errors.push('ACTUAL_DISPLAY_GEOMETRY_MISSING');
  if(finiteRect(actual?.imageRect)&&!near(actual.imageRect.width,envelope.selectedProfile?.imageRect.width,toleranceCssPx))errors.push('ACTUAL_DISPLAY_WIDTH_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.imageRect)&&!near(actual.imageRect.height,envelope.selectedProfile?.imageRect.height,toleranceCssPx))errors.push('ACTUAL_DISPLAY_HEIGHT_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.solutionMetaRect)&&!near(actual.solutionMetaRect.width,envelope.container.solutionMetaRect.width,toleranceCssPx))errors.push('ACTUAL_SOLUTION_CONTAINER_WIDTH_DIFFERS_FROM_PREFLIGHT');
  if(!near(actual?.solutionMetaContentWidth,envelope.container.solutionMetaContentWidth,toleranceCssPx))errors.push('ACTUAL_SOLUTION_CONTENT_WIDTH_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.qBoxRect)&&!near(actual.qBoxRect.width,envelope.container.qBoxRect.width,toleranceCssPx))errors.push('ACTUAL_QBOX_WIDTH_DIFFERS_FROM_PREFLIGHT');
  const style=envelope.selectedProfile?.computedStyle;
  for(const key of ['maxWidth','maxHeight','objectFit','transform'])if(actual?.computedStyle?.[key]!==style?.[key])errors.push('ACTUAL_DISPLAY_POLICY_DIFFERS_FROM_PREFLIGHT:'+key);
  if(!Number.isFinite(actual?.minimumCssFontPx)||actual.minimumCssFontPx<envelope.fontFloorCssPx-1e-7)errors.push('ACTUAL_FONT_BELOW_ENVELOPE_FLOOR');
  return {status:errors.length?'FAIL':'PASS',errors,questionUid:envelope?.questionUid,sizeClass:envelope?.sizeClass,actualRef,expectedImageRect:envelope?.selectedProfile?.imageRect,actualImageRect:actual?.imageRect,toleranceCssPx};
}
