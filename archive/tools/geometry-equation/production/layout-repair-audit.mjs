import {HASH_PATTERN,objectSha,bytesSha,canonicalJson} from '../../pipeline-core/canonical.mjs';

const OWNER_TOLERANCE_PX2=1e-6;
const SVG_LAYOUT_TOLERANCE_PX=0.25;
const DIRECTIONS=new Set(['N','NE','E','SE','S','SW','W','NW']);
const EXTENDED_GAPS=[64,80,96,128];
const exactKeys=(value,keys)=>!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===[...keys].sort().join(',');
const close=(a,b,tolerance=1e-9)=>Math.abs(a-b)<=tolerance;
function expectedBox(input){
  const [x,y]=input.sourceAt,{width,height}=input.measuredBox,{direction,gap}=input.selected;
  const dx=direction.includes('E')?1:direction.includes('W')?-1:0,dy=direction.includes('S')?1:direction.includes('N')?-1:0;
  return{x:x+(dx>0?gap:dx<0?-gap-width:-width/2),y:y+(dy>0?gap:dy<0?-gap-height:-height/2),width,height};
}
function decodeXml(value){return value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');}
function attributes(tag){
  const out={};for(const match of tag.matchAll(/([A-Za-z_:][A-Za-z0-9_.:-]*)="([^"]*)"/g)){if(Object.hasOwn(out,match[1]))throw Error('LAYOUT_REPAIR_SVG_DUPLICATE_ATTRIBUTE');out[match[1]]=decodeXml(match[2]);}
  return out;
}
function verifyOwner(input,pointMarkers,box=input.selected.box){
  if(!Array.isArray(pointMarkers))throw Error('LAYOUT_REPAIR_OWNER_AUDIT_MARKERS_MISSING');
  const ids=new Set(),actual=new Map();for(const marker of pointMarkers){if(!exactKeys(marker,['id','geometry'])||typeof marker.id!=='string'||!Array.isArray(marker.geometry)||marker.geometry.length!==3||marker.geometry.some(value=>!Number.isFinite(value))||marker.geometry[2]<0||ids.has(marker.id))throw Error('LAYOUT_REPAIR_OWNER_AUDIT_MARKERS_INVALID');ids.add(marker.id);actual.set(marker.id,marker.geometry);}
  if(canonicalJson(actual.get(input.ownerId))!==canonicalJson(input.ownerPoint)||input.sourceAt[0]!==input.ownerPoint[0]||input.sourceAt[1]!==input.ownerPoint[1])throw Error('LAYOUT_REPAIR_OWNER_AUDIT_TARGET_MISMATCH');
  const competitors=[...actual].filter(([id])=>id!==input.ownerId).sort(([a],[b])=>a.localeCompare(b)).map(([id,geometry])=>({id,geometry}));
  if(canonicalJson(competitors)!==canonicalJson(input.competingPoints))throw Error('LAYOUT_REPAIR_OWNER_AUDIT_COMPETITOR_MISMATCH');
  const [ox,oy]=input.ownerPoint;
  for(const [x,y] of [[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]]){
    const ownerD2=(x-ox)**2+(y-oy)**2;for(const marker of input.competingPoints){const [cx,cy]=marker.geometry;if(ownerD2+OWNER_TOLERANCE_PX2>=(x-cx)**2+(y-cy)**2)throw Error('LAYOUT_REPAIR_OWNER_AUDIT_VORONOI_FAIL');}
  }
}

export async function auditMeasuredOwnerSafeLabelRepair({binding,candidateSvgBytes,pointMarkers,page}){
  const input=binding?.repairInput,output=binding?.repairOutput;
  if(!input||!output||objectSha(input)!==binding.repairInputSha256||objectSha(output)!==binding.repairOutputSha256||output.repairInputSha256!==binding.repairInputSha256)throw Error('LAYOUT_REPAIR_AUDIT_BINDING_HASH_MISMATCH');
  if(!Buffer.isBuffer(candidateSvgBytes)||!HASH_PATTERN.test(binding.candidateSvgSha256)||bytesSha(candidateSvgBytes)!==binding.candidateSvgSha256||output.candidateSvgSha256!==binding.candidateSvgSha256)throw Error('LAYOUT_REPAIR_AUDIT_CANDIDATE_SHA_MISMATCH');
  if(input.schemaVersion!=='MEASURED_OWNER_SAFE_LAYOUT_REPAIR_INPUT_v1'||!exactKeys(input,['schemaVersion','questionUid','visualAssetKey','sourceSha256','solutionSha256','planSha256','sourceConditionsSha256','sourceFactsSha256','labelInventorySha256','baseMathSvgSha256','labelId','labelKind','ownerId','factRole','sourceAt','ownerPoint','competingPoints','measuredFragmentSha256','measuredBox','defaultSearch','supportedExtendedGaps','selected','measurementRef','requestedSizeClass','profilePolicySha256','policyRefsSha256','ownerPolicy','tolerancePxSquared','labelPolicy','labelPolicySha256']))throw Error('LAYOUT_REPAIR_AUDIT_INPUT_SCHEMA_INVALID');
  const expectedOutput={schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_OUTPUT_v1',repairInputSha256:binding.repairInputSha256,questionUid:input.questionUid,visualAssetKey:input.visualAssetKey,sourceSha256:input.sourceSha256,solutionSha256:input.solutionSha256,planSha256:input.planSha256,sourceConditionsSha256:input.sourceConditionsSha256,sourceFactsSha256:input.sourceFactsSha256,labelInventorySha256:input.labelInventorySha256,labelId:input.labelId,labelKind:input.labelKind,ownerId:input.ownerId,factRole:input.factRole,measuredFragmentSha256:input.measuredFragmentSha256,selected:input.selected,candidateSvgSha256:binding.candidateSvgSha256,sourceConditionParity:true,sourceFactParity:true,semanticPlanParity:true,labelInventoryParity:true,requiredLabelPreserved:true,ownerRelation:'EXACT_TARGET_POINT_VORONOI'};
  if(!exactKeys(output,Object.keys(expectedOutput))||canonicalJson(output)!==canonicalJson(expectedOutput))throw Error('LAYOUT_REPAIR_AUDIT_OUTPUT_SCHEMA_INVALID');
  const labelPolicy=input.labelPolicy;
  if(!HASH_PATTERN.test(input.labelPolicySha256)||objectSha(labelPolicy)!==input.labelPolicySha256||!exactKeys(labelPolicy,['id','kind','target','sourceAt','preferred','directions','gaps','candidateCenters'])||labelPolicy.id!==input.labelId||labelPolicy.kind!==input.labelKind||labelPolicy.target!==input.ownerId||canonicalJson(labelPolicy.sourceAt)!==canonicalJson(input.sourceAt)||(labelPolicy.preferred!==null&&!DIRECTIONS.has(labelPolicy.preferred))||!Array.isArray(labelPolicy.directions)||labelPolicy.directions.some(direction=>!DIRECTIONS.has(direction))||new Set(labelPolicy.directions).size!==labelPolicy.directions.length||!Array.isArray(labelPolicy.gaps)||labelPolicy.gaps.some(gap=>!Number.isFinite(gap)||gap<=0)||new Set(labelPolicy.gaps).size!==labelPolicy.gaps.length||!(labelPolicy.candidateCenters===null||Array.isArray(labelPolicy.candidateCenters)&&labelPolicy.candidateCenters.length===0)||canonicalJson(input.defaultSearch?.directions)!==canonicalJson(labelPolicy.directions)||canonicalJson(input.defaultSearch?.gaps)!==canonicalJson(labelPolicy.gaps))throw Error('LAYOUT_REPAIR_AUDIT_LABEL_POLICY_INVALID');
  if(input.ownerPolicy!=='EXACT_POINT_VORONOI_BOX_CORNERS'||input.tolerancePxSquared!==OWNER_TOLERANCE_PX2||canonicalJson(input.supportedExtendedGaps)!==canonicalJson(EXTENDED_GAPS)||!exactKeys(input.defaultSearch,['directions','gaps'])||!Array.isArray(input.defaultSearch.directions)||input.defaultSearch.directions.some(direction=>!DIRECTIONS.has(direction))||new Set(input.defaultSearch.directions).size!==input.defaultSearch.directions.length||!Array.isArray(input.defaultSearch.gaps)||input.defaultSearch.gaps.some(gap=>!Number.isFinite(gap)||gap<=0)||new Set(input.defaultSearch.gaps).size!==input.defaultSearch.gaps.length||!exactKeys(input.selected,['direction','gap','box'])||!DIRECTIONS.has(input.selected.direction)||!input.defaultSearch.directions.includes(input.selected.direction)||!EXTENDED_GAPS.includes(input.selected.gap)||input.defaultSearch.gaps.some(gap=>EXTENDED_GAPS.includes(gap))||!exactKeys(input.measuredBox,['width','height'])||!Number.isFinite(input.measuredBox.width)||!Number.isFinite(input.measuredBox.height)||input.measuredBox.width<=0||input.measuredBox.height<=0||!Array.isArray(input.sourceAt)||input.sourceAt.length!==2||input.sourceAt.some(value=>!Number.isFinite(value))||!exactKeys(input.measurementRef,['bytes','path','sha256'])||!Number.isSafeInteger(input.measurementRef.bytes)||input.measurementRef.bytes<0||typeof input.measurementRef.path!=='string'||!HASH_PATTERN.test(input.measurementRef.sha256))throw Error('LAYOUT_REPAIR_AUDIT_POLICY_INVALID');
  const box=input.selected.box,recomputed=expectedBox(input);
  if(!close(box.x,recomputed.x)||!close(box.y,recomputed.y)||box.width!==input.measuredBox.width||box.height!==input.measuredBox.height)throw Error('LAYOUT_REPAIR_AUDIT_SELECTED_BOX_MISMATCH');
  verifyOwner(input,pointMarkers);
  if(!page||typeof page.setContent!=='function')throw Error('LAYOUT_REPAIR_AUDIT_BROWSER_REQUIRED');
  await page.setContent(candidateSvgBytes.toString('utf8'),{waitUntil:'load'});
  await page.evaluate(()=>document.fonts?.ready.then(()=>true));
  const observed=await page.evaluate(labelId=>{
    const roots=[...document.querySelectorAll('svg')],root=roots.find(node=>node.parentElement===document.body)||roots[0];
    const groups=[...document.querySelectorAll('g')].filter(node=>node.getAttribute('id')===labelId);
    if(!root||groups.length!==1)return{error:'TARGET_GROUP_NOT_UNIQUE'};
    const group=groups[0],fragment=group.firstElementChild,groupRect=group.getBoundingClientRect(),fragmentGraphicRect=fragment?.getBoundingClientRect(),rootRect=root.getBoundingClientRect();
    if(!fragment||fragment.localName!=='svg')return{error:'NESTED_FRAGMENT_SVG_MISSING'};
    const vb=(fragment.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);
    const rootViewBox=(root.getAttribute('viewBox')||'').trim().split(/[\s,]+/).map(Number);
    const width=Number(fragment.getAttribute('width')),height=Number(fragment.getAttribute('height')),m=fragment.getScreenCTM();
    const viewportCorners=[[0,0],[width,0],[0,height],[width,height]].map(([x,y])=>({x:m.a*x+m.c*y+m.e-rootRect.x,y:m.b*x+m.d*y+m.f-rootRect.y}));
    const left=Math.min(...viewportCorners.map(p=>p.x)),right=Math.max(...viewportCorners.map(p=>p.x)),top=Math.min(...viewportCorners.map(p=>p.y)),bottom=Math.max(...viewportCorners.map(p=>p.y));
    return{group:{id:group.getAttribute('id'),kind:group.getAttribute('data-label-kind'),owner:group.getAttribute('data-owner'),fragmentSha256:group.getAttribute('data-fragment-sha'),transform:group.getAttribute('transform'),rect:{x:groupRect.x-rootRect.x,y:groupRect.y-rootRect.y,width:groupRect.width,height:groupRect.height}},fragment:{owner:fragment.getAttribute('data-owner'),factRole:fragment.getAttribute('data-fact-role'),width,height,viewBox:vb,viewportRect:{x:left,y:top,width:right-left,height:bottom-top},graphicRect:{x:fragmentGraphicRect.x-rootRect.x,y:fragmentGraphicRect.y-rootRect.y,width:fragmentGraphicRect.width,height:fragmentGraphicRect.height}},root:{width:Number(root.getAttribute('width')),height:Number(root.getAttribute('height')),viewBox:rootViewBox,rect:{x:rootRect.x,y:rootRect.y,width:rootRect.width,height:rootRect.height}}};
  },input.labelId);
  if(observed.error)throw Error('LAYOUT_REPAIR_AUDIT_'+observed.error);
  if(observed.group.id!==input.labelId||observed.group.kind!==input.labelKind||observed.group.owner!==input.ownerId||observed.group.fragmentSha256!==input.measuredFragmentSha256||observed.fragment.owner!==input.ownerId||observed.fragment.factRole!==input.factRole)throw Error('LAYOUT_REPAIR_AUDIT_FRAGMENT_OWNER_MISMATCH');
  if(!Number.isFinite(observed.fragment.width)||!Number.isFinite(observed.fragment.height)||!close(observed.fragment.width,input.measuredBox.width)||!close(observed.fragment.height,input.measuredBox.height)||!close(observed.fragment.viewBox[0],0)||!close(observed.fragment.viewBox[1],0)||!close(observed.fragment.viewBox[2],input.measuredBox.width)||!close(observed.fragment.viewBox[3],input.measuredBox.height))throw Error('LAYOUT_REPAIR_AUDIT_FRAGMENT_BOUNDS_MISMATCH');
  if(observed.root.viewBox.length!==4||!observed.root.viewBox.every(Number.isFinite)||!close(observed.root.viewBox[0],0)||!close(observed.root.viewBox[1],0)||!Number.isFinite(observed.root.viewBox[2])||!Number.isFinite(observed.root.viewBox[3])||observed.root.viewBox[2]<=0||observed.root.viewBox[3]<=0||!Number.isFinite(observed.root.rect.width)||!Number.isFinite(observed.root.rect.height)||observed.root.rect.width<=0||observed.root.rect.height<=0)throw Error('LAYOUT_REPAIR_AUDIT_ROOT_VIEWPORT_INVALID');
  const scaleX=observed.root.rect.width/observed.root.viewBox[2],scaleY=observed.root.rect.height/observed.root.viewBox[3];
  const normalized={x:observed.fragment.viewportRect.x/scaleX,y:observed.fragment.viewportRect.y/scaleY,width:observed.fragment.viewportRect.width/scaleX,height:observed.fragment.viewportRect.height/scaleY};
  if(!['x','y','width','height'].every(key=>Math.abs(normalized[key]-box[key])<=SVG_LAYOUT_TOLERANCE_PX))throw Error('LAYOUT_REPAIR_AUDIT_FINAL_SVG_BOUNDS_MISMATCH:'+JSON.stringify({expected:box,observed:normalized,group:observed.group.rect,fragment:observed.fragment,root:observed.root}));
  verifyOwner(input,pointMarkers,normalized);
  const transform=observed.group.transform?.match(/^translate\(\s*(-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s+(-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)\s*\)$/);
  if(!transform||!close(Number(transform[1]),box.x)||!close(Number(transform[2]),box.y))throw Error('LAYOUT_REPAIR_AUDIT_FINAL_SVG_TRANSFORM_MISMATCH');
  return{schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_AUDIT_v1',status:'PASS',candidateSvgSha256:binding.candidateSvgSha256,labelId:input.labelId,fragmentSha256:observed.group.fragmentSha256,ownerId:observed.group.owner,selectedBox:box,observedGroupGraphicBoundsIntrinsicUnits:{x:observed.group.rect.x/scaleX,y:observed.group.rect.y/scaleY,width:observed.group.rect.width/scaleX,height:observed.group.rect.height/scaleY},observedFragmentGraphicBoundsIntrinsicUnits:{x:observed.fragment.graphicRect.x/scaleX,y:observed.fragment.graphicRect.y/scaleY,width:observed.fragment.graphicRect.width/scaleX,height:observed.fragment.graphicRect.height/scaleY},observedFragmentViewportBoundsIntrinsicUnits:normalized,svgBoundsTolerancePx:SVG_LAYOUT_TOLERANCE_PX,ownerPolicy:input.ownerPolicy,tolerancePxSquared:OWNER_TOLERANCE_PX2,ownerCornerRelation:'PASS'};
}
