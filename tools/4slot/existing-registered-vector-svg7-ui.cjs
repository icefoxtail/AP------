'use strict';
// The already observed SVG7 problem surface has its own sealed capture and
// original root observation. This does not approve a vector or metadata row.
const crypto = require('node:crypto');
const SCHEMA = 'archive-m2s1-svg7-problem-ui-preview-v1';
const COMMIT = '45e976a5981701bef9c755d50c11636116ee788f';
const PUBLIC = 'b9bd24223d4e523db6577682c1a30e74c11d25db';
const PREFIX = 'docs/operations/m2s1-svg7-source-repair-20261116/';
const TECHNICAL_REF = Object.freeze({commit:PUBLIC,path:PREFIX+'student-ui-technical-v3.json',
  gitBlobSha1:'06cf5c2b0e38e4113ddf1fdd519a31cfa5196f39',
  sha256:'c96dcff0275aeac68bb1cd527594ebf000b0ea36e7e7be4cec943e00d9303864',bytes:303157});
const VISUAL_REF = Object.freeze({commit:PUBLIC,path:PREFIX+'student-ui-independent-v3.json',
  gitBlobSha1:'e7c7b463065f0e6cd25e8e58101c999045f2e341',
  sha256:'072f7eb06db26f18728ca3cb142154956baf9ae2916b0805f18e14a41d63732e',bytes:5966});
const MANIFEST_REF = Object.freeze({commit:COMMIT,path:'tests/fixtures/archive-m2s1-svg7-problem-ui.json',
  gitBlobSha1:'ee309be654c7f340edced96d44d7f3fcd13aa228',
  sha256:'d13bd86db38720754b4ad529209be63c29362a3bf5b04003dbfd88ef883e372b',bytes:12696});
const ITEMS = Object.freeze([
  ['E037-Q3','qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6',3,25],
  ['E037-Q15','qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5',15,25],
  ['E045-Q15','qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569',15,24],
  ['E045-Q24','qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd',24,24],
  ['E048-Q11','qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec',11,26],
  ['E048-Q13','qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637',13,26],
  ['E048-Q24','qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad',24,26]
]);
const VIEWPORTS = [{name:'desktop',width:1365,height:1000},{name:'mobile',width:390,height:844}];
const REF_KEYS = ['commit','path','gitBlobSha1','sha256','bytes'];
const stable = v => JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const eq = (a,b) => stable(a)===stable(b);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const own = (o,k) => Object.prototype.hasOwnProperty.call(o||{},k);
const refOnly = r => Object.fromEntries(REF_KEYS.map(k=>[k,r[k]]));
function fail(code){throw Error('EXISTING_VECTOR_SVG7_UI_'+code);}
function need(v,code){if(!v)fail(code);}
function exact(v,keys,code){need(v&&typeof v==='object'&&!Array.isArray(v)&&eq(Object.keys(v).sort(),keys.slice().sort()),code);}
function one(rows,p,code){const a=(rows||[]).filter(p);need(a.length===1,code);return a[0];}
function document(readRef,ref,argument){
  const raw=readRef(ref);
  need(Buffer.isBuffer(raw)&&raw.length===ref.bytes&&sha(raw)===ref.sha256&&blob(raw)===ref.gitBlobSha1,'PINNED_DOCUMENT_BYTES');
  const parsed=JSON.parse(raw);
  if(argument!==undefined)need(eq(parsed,argument),'PINNED_DOCUMENT_ARGUMENT');
  return parsed;
}
function closedRoles(value,row,technical,manifest,readRef){
  const embedded=row.questionUid===ITEMS[2][1];
  need(embedded || (row.viewport.name==='mobile' && [ITEMS[3][1],ITEMS[6][1]].includes(row.questionUid)),'EXACT_TWO_ROLE_CASE');
  const keys=['schemaVersion','key','questionUid','sourceOrdinal','manifestRef','sourceRef','assetRef','helperRef',
    'initialFrameSha256','numberRoleCount','contentRoleCount','targetImageCount','emptyZeroHeightNodeCount',
    'expectedChoiceCount','originalSharedHelperUnchanged',...(embedded?['embeddedChoiceBinding','choiceState']:[])];
  exact(value,keys,'ROLE_KEYS');
  need(value.schemaVersion===(embedded?'archive-m2s1-svg7-embedded-image-choices-v1':'archive-m2s1-svg7-two-direct-roles-v1') &&
    value.key===row.key&&value.questionUid===row.questionUid&&value.sourceOrdinal===row.sourceOrdinal&&
    eq(value.sourceRef,row.sourceRef)&&eq(value.assetRef,row.assetRefs[0])&&eq(value.manifestRef,MANIFEST_REF)&&
    eq(value.helperRef,technical.roleCaptureHelperRef)&&/^[a-f0-9]{64}$/.test(value.initialFrameSha256||'')&&
    value.numberRoleCount===1&&value.contentRoleCount===1&&value.targetImageCount===1&&
    value.emptyZeroHeightNodeCount===(embedded?0:1)&&value.expectedChoiceCount===(embedded?5:0)&&
    value.originalSharedHelperUnchanged===true,'ROLE_BINDING');
  const m=one(manifest.items,x=>x.questionUid===row.questionUid&&x.sourceOrdinal===row.sourceOrdinal,'ROLE_MANIFEST_ITEM');
  need(m.key===row.key&&m.sourcePath===row.sourceRef.path&&m.assetPath===row.assetRefs[0].path,'ROLE_MANIFEST_BINDING');
  readRef(value.helperRef);readRef(technical.captureHelperRef);
  if(embedded){
    const b=value.embeddedChoiceBinding,c=value.choiceState;
    exact(b,['schemaVersion','sourceFlag','choiceCount','choicesSha256','beforeSourceRef','beforeQuestionSha256','oldAssetRef'],'EMBEDDED_KEYS');
    exact(c,['choiceCount','allChoicesNonemptyStrings','ownEmbeddedFlag','embeddedFlagValue','nestedEmbeddedFlag','choicesSha256'],'CHOICE_KEYS');
    need(b.schemaVersion==='archive-m2s1-svg7-e045-q15-embedded-choices-v1'&&b.sourceFlag==='choicesEmbeddedInImage'&&
      b.choiceCount===5&&c.choiceCount===5&&c.allChoicesNonemptyStrings===true&&c.ownEmbeddedFlag===true&&
      c.embeddedFlagValue===true&&c.nestedEmbeddedFlag===false&&b.choicesSha256===c.choicesSha256&&
      b.choicesSha256==='f0fe7a77a17aad0c53993ce7ddb1c9c397a846f6b723f4519ff892a2757bdbaa'&&
      b.beforeQuestionSha256==='ed83a08ad8162891c0dfae499756549c46fe7f28f2edb6d88b6242078b9f9a85', 'EMBEDDED_BINDING');
    readRef(b.beforeSourceRef);readRef(b.oldAssetRef);
  }
}
function verifySvg7Ui({technical,visual,technicalRef,readRef,readLiveRef,questionUid,sourceOrdinal,surface,sourceRef,assetRefs,validateCapture}){
  need(surface==='PROBLEM'&&ITEMS.some(x=>x[1]===questionUid&&x[2]===sourceOrdinal),'EXACT_SEVEN_PROBLEMS');
  need(typeof readRef==='function'&&typeof readLiveRef==='function'&&typeof validateCapture==='function','READERS_REQUIRED');
  need(eq(technicalRef,TECHNICAL_REF),'PUBLIC_TECHNICAL_REF');
  const t=document(readRef,TECHNICAL_REF,technical),v=document(readRef,VISUAL_REF,visual),manifest=document(readRef,MANIFEST_REF);
  need(t.schemaVersion===SCHEMA&&t.checkoutCommit===COMMIT&&t.status==='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'&&
    t.executionOwner==='GITHUB_ACTIONS_SUPPORTED_CHROME'&&t.mode==='exam'&&t.problemOnlyScreenshots===true&&
    t.sourceOverlay===false&&t.sourceOverlayCount===0&&t.sourceWrites===0&&t.solutionsOpened===false&&
    t.newNativeApprovals===undefined&&t.newFullMathematicalQa===false&&t.newMetadataApprovals===0&&
    t.newFourSlotApprovals===0&&t.expectedLogicalCases===14&&t.completedLogicalCases===14&&t.results.length===14&&
    t.items.length===7&&t.screenshotArtifactCount===16&&t.screenshotArtifacts.length===16&&
    t.failures.length===0&&t.externalFontResources.length===0,'TECHNICAL_SCOPE');
  need(v.schemaVersion==='archive-root-original-png-observation-v2'&&v.head===COMMIT&&v.runId===43910682487&&
    v.technicalSha256===TECHNICAL_REF.sha256&&v.technicalStatus==='PASS'&&v.logicalCases===14&&
    v.completeVisualRelease==='PASS_DISPLAY_SCOPE_7_OF_7'&&v.observations.length===7&&v.originalPngs.length===16&&
    v.newNativeApprovals===0&&v.newMetadataApprovals===0&&v.sourceWrites===0&&v.blindQaClaim===false&&
    v.priorObservationPreserved===true,'ROOT_OBSERVATION');
  for(const key of ['manifestRef','checkerRef','captureHelperRef','roleCaptureHelperRef','identityRef','sourceTransportReceiptRef',
    'staticEvidenceRef','priorStaticEvidenceRef','engineRef','fontLicenseRef']){
    need(t[key].commit===COMMIT,'CHECKOUT_REF');readRef(t[key]);
  }
  need(eq(t.manifestRef,MANIFEST_REF),'CAPTURE_MANIFEST');
  const dynamic=new Set(['archive/data/question_metadata.json',...t.items.map(x=>x.sourceRef.path)]);
  need(t.servedFiles.length===99&&new Set(t.servedFiles.map(x=>x.path)).size===99,'SERVED_INVENTORY');
  for(const ref of t.servedFiles){need(ref.commit===COMMIT,'SERVED_COMMIT');readRef(ref);if(!dynamic.has(ref.path))readLiveRef(ref);}
  const fontIds=new Set();
  need(t.studentFontResources.length===40,'FONT_INVENTORY');
  for(const font of t.studentFontResources){
    need(font.status===200&&font.commit===COMMIT&&['STYLESHEET','FONT'].includes(font.kind)&&
      /^[a-f0-9]{64}$/.test(font.resourceId||'')&&!fontIds.has(font.resourceId),'FONT_REF');
    fontIds.add(font.resourceId);readRef(refOnly(font));readLiveRef(refOnly(font));
  }
  const shotRefs=[];
  for(const item of ITEMS){
    const im=one(t.items,x=>x.questionUid===item[1]&&x.sourceOrdinal===item[2],'ITEM');
    need(im.key===item[0]&&im.expectedBankCount===item[3],'ITEM_BINDING');
    const observation=one(v.observations,x=>x.key===item[0],'OBSERVATION_ITEM');need(observation.verdict==='ACCEPT_DISPLAY','OBSERVATION_VERDICT');
    for(const viewport of VIEWPORTS){
      const row=one(t.results,x=>x.questionUid===item[1]&&x.sourceOrdinal===item[2]&&x.viewport.name===viewport.name,'CASE');
      need(row.key===item[0]&&eq(row.viewport,viewport)&&row.status==='PASS'&&row.visualReview==='PENDING'&&
        eq(row.sourceRef,im.sourceRef)&&eq(row.assetRef,im.assetRef)&&row.sourceRef.commit===COMMIT&&row.assetRef.commit===COMMIT,'CASE_BINDING');
      readRef(row.sourceRef);readRef(row.assetRef);
      const state=row.technical,font=state.fontReadiness;
      need(state.mode==='exam'&&state.questions===item[3]&&state.readiness==='RENDER_READY'&&state.imagesComplete===true&&
        state.mathErrors===0&&state.unrenderedMath===0&&state.mathJaxSource==='local'&&state.solutionNodes===0&&
        font.status==='loaded'&&font.family==='Nanum Myeongjo'&&eq(font.weights.map(x=>x.weight),[400,700,800])&&
        font.weights.every(x=>x.loadedFaces>0&&x.allLoaded===true&&x.checked===true)&&
        state.fontResourceIds.length>0&&state.fontResourceIds.every(x=>fontIds.has(x)),'READINESS');
      need(row.geometry.imageInsideQuestion===true&&row.geometry.naturalWidth>0&&row.geometry.naturalHeight>0&&
        [row.pageErrors,row.requestFailures,row.externalRequests].every(x=>Array.isArray(x)&&x.length===0),'CASE_GEOMETRY');
      const logical={key:row.key,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,surface:'PROBLEM',mode:'exam',
        viewport:row.viewport,sourceRef:row.sourceRef,assetRefs:[row.assetRef]};
      validateCapture(row.capture,row.screenshots,row.viewport,{row:logical,checkoutCommit:COMMIT,readRef,
        validateClosedRoles:(value,context)=>closedRoles(value,context,t,manifest,readRef)});
      shotRefs.push(...row.screenshots.map(({tileIndex,...ref})=>ref));
    }
  }
  const sorted=a=>a.slice().sort((a,b)=>a.path.localeCompare(b.path,'en'));
  need(shotRefs.length===16&&new Set(shotRefs.map(x=>x.path)).size===16&&eq(sorted(shotRefs),sorted(t.screenshotArtifacts)),'ORIGINAL_TILE_INVENTORY');
  need(v.originalPngs.every(x=>x.rootDirectlyViewed===true)&&eq(sorted(v.originalPngs.map(({rootDirectlyViewed,...x})=>x)),sorted(shotRefs)),'ROOT_ORIGINAL_TILE_INVENTORY');
  const selected=t.results.filter(x=>x.questionUid===questionUid&&x.sourceOrdinal===sourceOrdinal);
  need(selected.length===2&&Array.isArray(assetRefs)&&assetRefs.length===1&&selected.every(x=>eq(x.sourceRef,sourceRef)&&eq(x.assetRef,assetRefs[0])),'CURRENT_SELECTED_BINDING');
  return {logicalCases:2,originalTiles:selected.reduce((n,x)=>n+x.screenshots.length,0)};
}
module.exports={SCHEMA,TECHNICAL_REF,VISUAL_REF,MANIFEST_REF,verifySvg7Ui};
