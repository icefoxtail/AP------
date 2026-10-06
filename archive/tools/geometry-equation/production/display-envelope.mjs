import {objectSha} from '../../pipeline-core/canonical.mjs';

export const DISPLAY_SIZE_CLASSES=Object.freeze(['small','medium','large','full']);

const finiteRect=rect=>rect&&['x','y','width','height'].every(key=>Number.isFinite(rect[key]))&&rect.width>0&&rect.height>0;
const near=(a,b,tolerance)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance;

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

/** Resolve a measured, Archive-bound planning envelope. This is not a support verdict. */
export function planDisplayEnvelope({questionUid,requestedSizeClass='medium',intrinsicSvg,candidateLabelInventory,observation,fontFloorCssPx=11,archiveEngineSha256,sourceRef=null}){
  if(typeof questionUid!=='string'||!questionUid||!DISPLAY_SIZE_CLASSES.includes(requestedSizeClass))throw Error('DISPLAY_ENVELOPE_INPUT_INVALID');
  if(!Number.isInteger(intrinsicSvg?.width)||!Number.isInteger(intrinsicSvg?.height)||intrinsicSvg.width<1||intrinsicSvg.height<1||!Number.isFinite(fontFloorCssPx)||fontFloorCssPx<11)throw Error('DISPLAY_ENVELOPE_INTRINSIC_INVALID');
  if(observation?.status!=='PASS'||observation?.synthetic!==false||observation?.runtime!=='playwright-chromium'||observation?.questionId===undefined||!finiteRect(observation.qBoxRect)||!finiteRect(observation.solutionMetaRect)||!Array.isArray(observation.profiles))throw Error('ACTUAL_ARCHIVE_ENVELOPE_OBSERVATION_REQUIRED');
  const profiles=measuredProfiles(observation,intrinsicSvg,candidateLabelInventory),start=DISPLAY_SIZE_CLASSES.indexOf(requestedSizeClass);
  const provisional=profiles.slice(start).find(profile=>profile.provisionalMinimumCssFontPx>=fontFloorCssPx-1e-7);
  return {
    schemaVersion:'DISPLAY_ENVELOPE_v1',status:provisional?'PLANNED':'PLANNED_RECOMPOSITION_REQUIRED',questionUid,occurrence:0,
    requestedSizeClass,plannedSizeClass:provisional?.sizeClass||null,
    policyChange:provisional&&provisional.sizeClass!==requestedSizeClass?{from:requestedSizeClass,to:provisional.sizeClass,reason:'PROVISIONAL_LABEL_INVENTORY_FLOOR_ONLY'}:null,
    intrinsicSvg:{...intrinsicSvg},candidateLabelInventory:candidateLabelInventory.map(v=>({id:v.id,fontPx:v.fontPx})),fontFloorCssPx,
    provisionalMinimumCssFontPx:provisional?.provisionalMinimumCssFontPx??null,
    fit:'NONE',container:{qBoxRect:observation.qBoxRect,solutionMetaRect:observation.solutionMetaRect},
    profiles,archiveEngineSha256,sourceRef,
    measurementStatus:'ACTUAL_ARCHIVE_DOM_PREFLIGHT_NOT_FINAL_SUPPORT',
    provenance:{runtime:observation.runtime,browserVersion:observation.browserVersion,archiveSourceRef:observation.sourceRef,sourceAuthorityStatus:observation.sourceAuthorityStatus||'MEASUREMENT_ONLY'}
  };
}

/** Support is determined from the final candidate rendered at each measured profile size. */
export function qualifyDisplayEnvelope(plannedEnvelope,profileAudits){
  if(plannedEnvelope?.schemaVersion!=='DISPLAY_ENVELOPE_v1'||!['PLANNED','PLANNED_RECOMPOSITION_REQUIRED'].includes(plannedEnvelope.status)||!Array.isArray(profileAudits))throw Error('DISPLAY_ENVELOPE_PLAN_REQUIRED');
  const byClass=new Map(profileAudits.map(audit=>[audit.sizeClass,audit]));
  if(DISPLAY_SIZE_CLASSES.some(sizeClass=>!byClass.has(sizeClass)))throw Error('DISPLAY_ENVELOPE_FINAL_PROFILE_AUDITS_INCOMPLETE');
  const expectedIds=plannedEnvelope.candidateLabelInventory.map(v=>v.id).sort();
  const profiles=plannedEnvelope.profiles.map(profile=>{
    const audit=byClass.get(profile.sizeClass),errors=[];
    const labels=audit.labelMeasurements;
    if(!Array.isArray(labels)||!labels.length)errors.push('FINAL_LABEL_MEASUREMENTS_REQUIRED');
    const actualIds=Array.isArray(labels)?labels.map(v=>v.id).sort():[];
    if(JSON.stringify(actualIds)!==JSON.stringify(expectedIds))errors.push('FINAL_LABEL_INVENTORY_MISMATCH');
    const fonts=Array.isArray(labels)?labels.map(v=>v.finalViewportCssFontPx).filter(Number.isFinite):[];
    const minimumCssFontPx=fonts.length?Math.min(...fonts):null;
    if(minimumCssFontPx===null||minimumCssFontPx<plannedEnvelope.fontFloorCssPx-1e-7)errors.push('FONT_FLOOR_FAIL');
    if(audit.layoutStatus!=='PASS')errors.push('LAYOUT_AUDIT_FAIL');
    if(audit.graphRequired&&audit.graphStatus!=='PASS')errors.push('GRAPH_PROFILE_AUDIT_FAIL');
    if(audit.topologyRequired&&audit.topologyStatus!=='PASS')errors.push('TOPOLOGY_PROFILE_AUDIT_FAIL');
    if(audit.strokeStatus!=='PASS')errors.push('STROKE_PROFILE_AUDIT_FAIL');
    return {
      ...profile,
      supportStatus:errors.length?'FAIL':'PASS',
      finalAudit:{layoutStatus:audit.layoutStatus,minimumCssFontPx,minimumCssFontLabelId:labels?.find(v=>v.finalViewportCssFontPx===minimumCssFontPx)?.id||null,labelMeasurements:labels||[],graphRequired:!!audit.graphRequired,graphStatus:audit.graphStatus||'NOT_APPLICABLE',graphEvidence:audit.graphEvidence||null,topologyRequired:!!audit.topologyRequired,topologyStatus:audit.topologyStatus||'NOT_APPLICABLE',strokeStatus:audit.strokeStatus,strokeMeasurements:audit.strokeMeasurements||[],errors:[...(audit.errors||[]),...errors]}
    };
  });
  const start=DISPLAY_SIZE_CLASSES.indexOf(plannedEnvelope.requestedSizeClass),selected=profiles.slice(start).find(profile=>profile.supportStatus==='PASS');
  const policyChange=selected&&selected.sizeClass!==plannedEnvelope.requestedSizeClass?{from:plannedEnvelope.requestedSizeClass,to:selected.sizeClass,reason:'REQUESTED_PROFILE_FAILED_FINAL_CANDIDATE_AUDIT'}:null;
  return {
    ...plannedEnvelope,status:selected?'PASS':'UNSUPPORTED_DISPLAY_ENVELOPE',sizeClass:selected?.sizeClass||null,
    policyChange:policyChange||plannedEnvelope.policyChange,
    expectedMinimumScale:selected?.displayScale??null,expectedMinimumCssFontPx:selected?.finalAudit.minimumCssFontPx??null,
    selectedProfile:selected||null,profiles,
    measurementStatus:selected?'ACTUAL_ARCHIVE_PREFLIGHT_PLUS_FINAL_CANDIDATE_PROFILE_AUDITS':'FINAL_CANDIDATE_PROFILE_AUDITS_FAILED',
    errors:selected?[]:['NO_PROFILE_PASSED_FINAL_CANDIDATE_AUDITS']
  };
}

export function compareActualDisplayEnvelope(envelope,actual,{toleranceCssPx=1}={}){
  if(!envelope||!actual)return {status:'FAIL',errors:['DISPLAY_ENVELOPE_INPUT_REQUIRED']};
  const errors=[];
  if(envelope?.schemaVersion!=='DISPLAY_ENVELOPE_v1'||envelope.status!=='PASS')errors.push('DISPLAY_ENVELOPE_NOT_RESOLVED');
  if(actual?.status!=='PASS'||actual?.questionUid!==envelope.questionUid)errors.push('ACTUAL_DISPLAY_OBSERVATION_MISMATCH');
  if(actual?.sizeClass!==envelope.sizeClass)errors.push('ACTUAL_DISPLAY_SIZE_CLASS_MISMATCH');
  if(!finiteRect(actual?.imageRect)||!finiteRect(actual?.solutionMetaRect)||!finiteRect(actual?.qBoxRect))errors.push('ACTUAL_DISPLAY_GEOMETRY_MISSING');
  if(finiteRect(actual?.imageRect)&&!near(actual.imageRect.width,envelope.selectedProfile?.imageRect.width,toleranceCssPx))errors.push('ACTUAL_DISPLAY_WIDTH_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.imageRect)&&!near(actual.imageRect.height,envelope.selectedProfile?.imageRect.height,toleranceCssPx))errors.push('ACTUAL_DISPLAY_HEIGHT_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.solutionMetaRect)&&!near(actual.solutionMetaRect.width,envelope.container.solutionMetaRect.width,toleranceCssPx))errors.push('ACTUAL_SOLUTION_CONTAINER_WIDTH_DIFFERS_FROM_PREFLIGHT');
  if(finiteRect(actual?.qBoxRect)&&!near(actual.qBoxRect.width,envelope.container.qBoxRect.width,toleranceCssPx))errors.push('ACTUAL_QBOX_WIDTH_DIFFERS_FROM_PREFLIGHT');
  const style=envelope.selectedProfile?.computedStyle;
  for(const key of ['maxWidth','maxHeight','objectFit','transform'])if(actual?.computedStyle?.[key]!==style?.[key])errors.push('ACTUAL_DISPLAY_POLICY_DIFFERS_FROM_PREFLIGHT:'+key);
  if(Number.isFinite(actual?.minimumCssFontPx)&&actual.minimumCssFontPx<envelope.fontFloorCssPx-1e-7)errors.push('ACTUAL_FONT_BELOW_ENVELOPE_FLOOR');
  return {status:errors.length?'FAIL':'PASS',errors,questionUid:envelope?.questionUid,sizeClass:envelope?.sizeClass,expectedImageRect:envelope?.selectedProfile?.imageRect,actualImageRect:actual?.imageRect,toleranceCssPx};
}
