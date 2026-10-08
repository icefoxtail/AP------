import {HASH_PATTERN,objectSha,bytesSha,canonicalJson} from '../../pipeline-core/canonical.mjs';

export const MEASURED_OWNER_REPAIR_GAPS=Object.freeze([64,80,96,128]);
export const OWNER_POINT_DISTANCE_TOLERANCE_PX2=1e-6;

const DIRECTIONS=new Set(['N','NE','E','SE','S','SW','W','NW']);
const FACT_ROLES=new Set(['GIVEN','DERIVED_INTERMEDIATE','CONCLUSION']);
const KEY_REFS=['bytes','path','sha256'];
const fail=code=>{throw Error(code);};
function exactKeys(value,keys){return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===[...keys].sort().join(',');}
function validRef(ref){return exactKeys(ref,KEY_REFS)&&typeof ref.path==='string'&&ref.path.length>0&&Number.isSafeInteger(ref.bytes)&&ref.bytes>=0&&HASH_PATTERN.test(ref.sha256);}
function finitePoint(value,length){return Array.isArray(value)&&value.length===length&&value.every(Number.isFinite);}
function finiteBox(box){return exactKeys(box,['x','y','width','height'])&&['x','y','width','height'].every(key=>Number.isFinite(box[key]))&&box.width>0&&box.height>0;}
function close(a,b,epsilon=1e-9){return Math.abs(a-b)<=epsilon;}
function markerMap(markers){
  if(!Array.isArray(markers))fail('MEASURED_OWNER_LAYOUT_OWNER_MARKERS_INVALID');
  const ids=new Set(),map=new Map();
  for(const marker of markers){
    if(!exactKeys(marker,['id','geometry'])||typeof marker.id!=='string'||!marker.id||!finitePoint(marker.geometry,3)||marker.geometry[2]<0||ids.has(marker.id))fail('MEASURED_OWNER_LAYOUT_OWNER_MARKERS_INVALID');
    ids.add(marker.id);map.set(marker.id,marker.geometry);
  }
  return map;
}
function selectedBox(sourceAt,width,height,direction,gap){
  const dx=direction.includes('E')?1:direction.includes('W')?-1:0;
  const dy=direction.includes('S')?1:direction.includes('N')?-1:0;
  return{x:sourceAt[0]+(dx>0?gap:dx<0?-gap-width:-width/2),y:sourceAt[1]+(dy>0?gap:dy<0?-gap-height:-height/2),width,height};
}
function labelSearchPolicy(expectedLabel){
  if(!expectedLabel||!finitePoint(expectedLabel.at,2)||typeof expectedLabel.id!=='string'||typeof expectedLabel.kind!=='string'||typeof expectedLabel.target!=='string')fail('MEASURED_OWNER_LAYOUT_SOURCE_ANCHOR_MISMATCH');
  const preferred=expectedLabel.preferred??null,rawDirections=expectedLabel.directions??['N','NE','E','SE','S','SW','W','NW'];
  if((preferred!==null&&!DIRECTIONS.has(preferred))||!Array.isArray(rawDirections)||rawDirections.some(direction=>!DIRECTIONS.has(direction))||new Set(rawDirections).size!==rawDirections.length)fail('MEASURED_OWNER_LAYOUT_DEFAULT_SEARCH_SOURCE_INVALID');
  const directions=(preferred===null?[]:[preferred]).concat(rawDirections.filter(direction=>direction!==preferred));
  const hasCandidateCenters=Object.hasOwn(expectedLabel,'candidateCenters');
  if(hasCandidateCenters&&(!Array.isArray(expectedLabel.candidateCenters)||expectedLabel.candidateCenters.length))fail('MEASURED_OWNER_LAYOUT_UNSUPPORTED_CANDIDATE_CENTERS');
  const gaps=hasCandidateCenters?[]:(expectedLabel.gaps??[12,8,20,32,48]);
  if(!Array.isArray(gaps)||gaps.some(gap=>!Number.isFinite(gap)||gap<=0)||new Set(gaps).size!==gaps.length)fail('MEASURED_OWNER_LAYOUT_DEFAULT_SEARCH_SOURCE_INVALID');
  return{id:expectedLabel.id,kind:expectedLabel.kind,target:expectedLabel.target,sourceAt:[...expectedLabel.at],preferred,directions,gaps,candidateCenters:hasCandidateCenters?[]:null};
}
function ownerRelationClosed(box,ownerPoint,competingPoints,tolerance){
  const [ox,oy]=ownerPoint;
  for(const [x,y] of [[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]]){
    const ownerDistance2=(x-ox)**2+(y-oy)**2;
    for(const marker of competingPoints){const [cx,cy]=marker.geometry;const competitorDistance2=(x-cx)**2+(y-cy)**2;if(ownerDistance2+tolerance>=competitorDistance2)return false;}
  }
  return true;
}
function validateRepair({repair,expectedLabel,pointMarkers,measurement,fragment}){
  const repairKeys=['schemaVersion','failureClass','labelId','labelKind','ownerId','factRole','sourceAt','ownerPoint','competingPoints','measuredFragmentSha256','measuredBox','defaultSearch','supportedExtendedGaps','selected','ownerPolicy','tolerancePxSquared'];
  if(!exactKeys(repair,repairKeys)||repair.schemaVersion!=='MEASURED_OWNER_SAFE_LABEL_RELOCATION_v1'||repair.failureClass!=='OWNER_LABEL_NO_DEFAULT_CANDIDATE')fail('MEASURED_OWNER_LAYOUT_REPAIR_ACTION_INVALID');
  if(!['POINT_NAME','COORDINATE_LABEL'].includes(repair.labelKind)||typeof repair.labelId!=='string'||!/^[-A-Za-z0-9_]+$/.test(repair.labelId)||typeof repair.ownerId!=='string'||!/^[-A-Za-z0-9_]+$/.test(repair.ownerId)||!FACT_ROLES.has(repair.factRole)||!HASH_PATTERN.test(repair.measuredFragmentSha256))fail('MEASURED_OWNER_LAYOUT_REPAIR_ACTION_INVALID');
  if(!exactKeys(repair.measuredBox,['width','height'])||!Number.isFinite(repair.measuredBox.width)||!Number.isFinite(repair.measuredBox.height)||repair.measuredBox.width<=0||repair.measuredBox.height<=0)fail('MEASURED_OWNER_LAYOUT_REPAIR_ACTION_INVALID');
  if(!Array.isArray(measurement)||measurement.length!==2||!measurement.every(Number.isFinite)||measurement[0]!==repair.measuredBox.width||measurement[1]!==repair.measuredBox.height)fail('MEASURED_OWNER_LAYOUT_MEASUREMENT_MISMATCH');
  if(!fragment||fragment.labelId!==repair.labelId||fragment.owner!==repair.ownerId||fragment.factRole!==repair.factRole||fragment.fragmentSha256!==repair.measuredFragmentSha256||!exactKeys(fragment.intrinsic,['baseline','height','width'])||fragment.intrinsic.width!==repair.measuredBox.width||fragment.intrinsic.height!==repair.measuredBox.height||typeof fragment.svg!=='string'||bytesSha(Buffer.from(fragment.svg))!==fragment.fragmentSha256)fail('MEASURED_OWNER_LAYOUT_FRAGMENT_MISMATCH');
  if(!expectedLabel||expectedLabel.id!==repair.labelId||expectedLabel.kind!==repair.labelKind||expectedLabel.target!==repair.ownerId||!finitePoint(expectedLabel.at,2)||!finitePoint(repair.sourceAt,2)||repair.sourceAt[0]!==expectedLabel.at[0]||repair.sourceAt[1]!==expectedLabel.at[1])fail('MEASURED_OWNER_LAYOUT_SOURCE_ANCHOR_MISMATCH');
  const labelPolicy=labelSearchPolicy(expectedLabel);
  if(repair.ownerPolicy!=='EXACT_POINT_VORONOI_BOX_CORNERS'||repair.tolerancePxSquared!==OWNER_POINT_DISTANCE_TOLERANCE_PX2)fail('MEASURED_OWNER_LAYOUT_OWNER_POLICY_INVALID');
  if(!exactKeys(repair.defaultSearch,['directions','gaps'])||!Array.isArray(repair.defaultSearch.directions)||repair.defaultSearch.directions.length===0||repair.defaultSearch.directions.some(direction=>!DIRECTIONS.has(direction))||new Set(repair.defaultSearch.directions).size!==repair.defaultSearch.directions.length||!Array.isArray(repair.defaultSearch.gaps)||repair.defaultSearch.gaps.some(gap=>!Number.isFinite(gap)||gap<=0)||new Set(repair.defaultSearch.gaps).size!==repair.defaultSearch.gaps.length)fail('MEASURED_OWNER_LAYOUT_DEFAULT_SEARCH_INVALID');
  if(canonicalJson(repair.defaultSearch.directions)!==canonicalJson(labelPolicy.directions)||canonicalJson(repair.defaultSearch.gaps)!==canonicalJson(labelPolicy.gaps))fail('MEASURED_OWNER_LAYOUT_DEFAULT_SEARCH_SOURCE_MISMATCH');
  if(!Array.isArray(repair.supportedExtendedGaps)||canonicalJson(repair.supportedExtendedGaps)!==canonicalJson(MEASURED_OWNER_REPAIR_GAPS)||repair.defaultSearch.gaps.some(gap=>repair.supportedExtendedGaps.includes(gap)))fail('MEASURED_OWNER_LAYOUT_EXTENDED_GAP_POLICY_INVALID');
  if(!exactKeys(repair.selected,['direction','gap','box'])||!DIRECTIONS.has(repair.selected.direction)||!repair.defaultSearch.directions.includes(repair.selected.direction)||!repair.supportedExtendedGaps.includes(repair.selected.gap)||!finiteBox(repair.selected.box))fail('MEASURED_OWNER_LAYOUT_SELECTED_PLACEMENT_INVALID');
  const recomputed=selectedBox(repair.sourceAt,repair.measuredBox.width,repair.measuredBox.height,repair.selected.direction,repair.selected.gap);
  if(repair.selected.box.width!==repair.measuredBox.width||repair.selected.box.height!==repair.measuredBox.height||!close(repair.selected.box.x,recomputed.x)||!close(repair.selected.box.y,recomputed.y))fail('MEASURED_OWNER_LAYOUT_SELECTED_PLACEMENT_MISMATCH');
  const actualMarkers=markerMap(pointMarkers),ownerGeometry=actualMarkers.get(repair.ownerId);
  if(!ownerGeometry||canonicalJson(ownerGeometry)!==canonicalJson(repair.ownerPoint))fail('MEASURED_OWNER_LAYOUT_EXACT_OWNER_LOOKUP_FAIL');
  if(repair.sourceAt[0]!==ownerGeometry[0]||repair.sourceAt[1]!==ownerGeometry[1])fail('MEASURED_OWNER_LAYOUT_SOURCE_OWNER_ANCHOR_MISMATCH');
  const expectedCompetitors=[...actualMarkers.entries()].filter(([id])=>id!==repair.ownerId).sort(([a],[b])=>a.localeCompare(b)).map(([id,geometry])=>({id,geometry}));
  if(!Array.isArray(repair.competingPoints)||repair.competingPoints.some(value=>!exactKeys(value,['geometry','id'])||typeof value.id!=='string'||!finitePoint(value.geometry,3)||value.geometry[2]<0)||canonicalJson(repair.competingPoints)!==canonicalJson(expectedCompetitors))fail('MEASURED_OWNER_LAYOUT_COMPETITOR_LOOKUP_FAIL');
  if(!ownerRelationClosed(repair.selected.box,repair.ownerPoint,repair.competingPoints,repair.tolerancePxSquared))fail('MEASURED_OWNER_LAYOUT_VORONOI_BOX_FAIL');
}

export function bindMeasuredOwnerSafeLabelRepair({identity,sourceRef,solutionRef,planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256,baseMathSvgSha256,measurementRef,policyRefsSha256,profilePolicySha256,requestedSizeClass,repair,candidateSvgBytes,expectedLabel,pointMarkers,measurement,fragment}){
  if(!identity?.questionUid||!identity?.visualAssetKey||!validRef(sourceRef)||!validRef(solutionRef)||!HASH_PATTERN.test(planSha256)||!HASH_PATTERN.test(sourceConditionsSha256)||!HASH_PATTERN.test(sourceFactsSha256)||!HASH_PATTERN.test(labelInventorySha256)||!HASH_PATTERN.test(baseMathSvgSha256)||!validRef(measurementRef)||!HASH_PATTERN.test(policyRefsSha256)||!HASH_PATTERN.test(profilePolicySha256)||!['small','medium','large','full'].includes(requestedSizeClass)||!Buffer.isBuffer(candidateSvgBytes))fail('MEASURED_OWNER_LAYOUT_REPAIR_INPUT_INVALID');
  validateRepair({repair,expectedLabel,pointMarkers,measurement,fragment});
  const semanticBindings={questionUid:identity.questionUid,visualAssetKey:identity.visualAssetKey,sourceSha256:sourceRef.sha256,solutionSha256:solutionRef.sha256,planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256};
  const repairInput={schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_INPUT_v1',...semanticBindings,baseMathSvgSha256,labelId:repair.labelId,labelKind:repair.labelKind,ownerId:repair.ownerId,factRole:repair.factRole,sourceAt:repair.sourceAt,ownerPoint:repair.ownerPoint,competingPoints:repair.competingPoints,measuredFragmentSha256:repair.measuredFragmentSha256,measuredBox:repair.measuredBox,defaultSearch:repair.defaultSearch,supportedExtendedGaps:repair.supportedExtendedGaps,selected:repair.selected,measurementRef,requestedSizeClass,profilePolicySha256,policyRefsSha256,ownerPolicy:repair.ownerPolicy,tolerancePxSquared:repair.tolerancePxSquared};
  const candidateSvgSha256=bytesSha(candidateSvgBytes);
  repairInput.labelPolicy=labelSearchPolicy(expectedLabel);repairInput.labelPolicySha256=objectSha(repairInput.labelPolicy);
  const finalRepairInputSha256=objectSha(repairInput);
  const repairOutput={schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_OUTPUT_v1',repairInputSha256:finalRepairInputSha256,...semanticBindings,labelId:repair.labelId,labelKind:repair.labelKind,ownerId:repair.ownerId,factRole:repair.factRole,measuredFragmentSha256:repair.measuredFragmentSha256,selected:repair.selected,candidateSvgSha256,sourceConditionParity:true,sourceFactParity:true,semanticPlanParity:true,labelInventoryParity:true,requiredLabelPreserved:true,ownerRelation:'EXACT_TARGET_POINT_VORONOI'};
  return{repairInput,repairInputSha256:finalRepairInputSha256,repairOutput,repairOutputSha256:objectSha(repairOutput),candidateSvgSha256};
}
