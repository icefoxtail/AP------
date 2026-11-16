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


const embeddedChoiceContinuity=(()=>{
// A single already observed choice-display transition. This grants no new
// vector, question metadata, Native authority, or general renderer exception.
const crypto=require('node:crypto');
const ui={TECHNICAL_REF,VISUAL_REF};
const OPTION='svg7EmbeddedChoiceContinuity';
const SCHEMA='archive-svg7-e045-q15-embedded-choices-continuity-v1';
const UID='qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569';
const FIELD='choicesEmbeddedInImage';
// Immutable prior/native/current pins from the exact original seven-item preparation.
// No runtime caller can supply these authority pins.
const SEALED = {
  "nativeSourceRef": {
    "commit": "150b22a57f1a7075cae4ea89810bacc3bb7fff15",
    "path": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
    "gitBlobSha1": "a2d48ee6c1414eb9b5e89ca5f6824ebe0368a4d2",
    "sha256": "eb6f8d268dba2b23b8375d87bc61c48de9cf252912675dde20854af588f59506",
    "bytes": 43798
  },
  "priorSourceRef": {
    "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
    "path": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
    "gitBlobSha1": "e2d87dde2c1f96cebe86ca8ae06c858f0e1adacc",
    "sha256": "5df6a0d6f052889a0ffedca7ba5b8361e9f0fec69401e3a52b04d2f77ae6bb25",
    "bytes": 44299
  },
  "currentSourceRef": {
    "commit": "45e976a5981701bef9c755d50c11636116ee788f",
    "path": "archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
    "gitBlobSha1": "c8945961f52f7efca83d66ea045d070e74718de6",
    "sha256": "c1d8ce4c3de70c67d7a3ecf02031fd48327103785fec40505e1576043625618a",
    "bytes": 44656
  },
  "nativeQuestionSha256": "21bd7ec872c0447f4b144dc89755f250975628aa4e41a279aa3246cbd85962f3",
  "priorQuestionSha256": "43756b4e27e6e6f7a4115d5278f059a5ed976b487b8bdd4a84ff61a7e6f5bf2d",
  "currentQuestionSha256": "2db11d3dcd68f9aaf35c5d68e69d30f2e550ed3b42b956797fc81b41a62365fb",
  "choicesSha256": "f0fe7a77a17aad0c53993ce7ddb1c9c397a846f6b723f4519ff892a2757bdbaa",
  "technicalRef": {
    "commit": "b9bd24223d4e523db6577682c1a30e74c11d25db",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/student-ui-technical-v3.json",
    "gitBlobSha1": "06cf5c2b0e38e4113ddf1fdd519a31cfa5196f39",
    "sha256": "c96dcff0275aeac68bb1cd527594ebf000b0ea36e7e7be4cec943e00d9303864",
    "bytes": 303157
  },
  "visualRef": {
    "commit": "b9bd24223d4e523db6577682c1a30e74c11d25db",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/student-ui-independent-v3.json",
    "gitBlobSha1": "e7c7b463065f0e6cd25e8e58101c999045f2e341",
    "sha256": "072f7eb06db26f18728ca3cb142154956baf9ae2916b0805f18e14a41d63732e",
    "bytes": 5966
  },
  "staticRef": {
    "commit": "45e976a5981701bef9c755d50c11636116ee788f",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/independent-static-v1.json",
    "gitBlobSha1": "c0f84ef234a430067e79e563712bb2c95b0ae3a0",
    "sha256": "2fa5c28da0a4d22c6443a6a164caa300fadc3642201265224b7351eb273b520e",
    "bytes": 13196
  },
  "originalObservationRef": {
    "commit": "fe358c718d68de9d73cc9d0990b7a4df716bf4e3",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/root-original7-observation-v1.json",
    "gitBlobSha1": "49dad86c674e9d8b63ca69f5b32422f665b2e0c3",
    "sha256": "4fd7aaedd5666a65ccb32c5eefaf413cddd6e38f43b422f47ab146d23bf07344",
    "bytes": 3793
  },
  "priorProblemAssetRef": {
    "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
    "path": "archive/assets/images/21_팔마중_1학기_기말_중2_수학/q15.png",
    "gitBlobSha1": "694cf60ffd6c1ba661ff2732b0c108ab8c307108",
    "sha256": "fa4b5d271533f39c091189c7ccb00805d2c85cd339fcfe475fb3e76b5a81b272",
    "bytes": 150607
  },
  "originalGivenPng": {
    "sha256": "3d944e4f8b1858d051437c5b035e2de33057e08f6bfa16b86aabe2823194de74",
    "bytes": 382741
  }
};
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const eq=(a,b)=>stable(a)===stable(b),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const fail=code=>{throw Error('SVG7_EMBEDDED_CHOICES_'+code);};
const need=(x,code)=>{if(!x)fail(code);};
function exact(x,keys,code){need(x&&typeof x==='object'&&!Array.isArray(x)&&eq(Object.keys(x).sort(),keys.slice().sort()),code);}
function document(readRef,ref){const b=readRef(ref);need(Buffer.isBuffer(b)&&b.length===ref.bytes&&sha(b)===ref.sha256&&blob(b)===ref.gitBlobSha1,'IMMUTABLE_BYTES');return JSON.parse(b);}
function one(rows,p,code){const found=(rows||[]).filter(p);need(found.length===1,code);return found[0];}
function withoutCommit(ref){const {commit,...rest}=ref;return rest;}
function state(nativeQuestion,priorQuestion,currentQuestion){
  const model=q=>({wholeQuestionSha256:sha(stable(q)),flagOwn:own(q,FIELD),flagValue:own(q,FIELD)?q[FIELD]:null,
    choicesSha256:sha(stable(q.choices)),choicesCount:Array.isArray(q.choices)?q.choices.length:-1,
    choicesNonempty:Array.isArray(q.choices)&&q.choices.every(x=>typeof x==='string'&&x.trim())});
  return {native:model(nativeQuestion),prior:model(priorQuestion),current:model(currentQuestion)};
}
function claim(){need(SEALED,'UNFROZEN_CANDIDATE');return {schemaVersion:SCHEMA,...structuredClone(SEALED)};}
function verify({claim:input,questionUid,sourceOrdinal,boundState,nativeSourceRef,priorSourceRef,currentSourceRef,
  priorProblemAssets,currentProblemAssets,readRef,readLiveRef}){
  need(SEALED,'UNFROZEN_CANDIDATE');exact(input,['schemaVersion',...Object.keys(SEALED)],'CLAIM_KEYS');
  need(eq(input,claim())&&questionUid===UID&&sourceOrdinal===15,'EXACT_SCOPE_AND_PINS');
  need(eq(nativeSourceRef,SEALED.nativeSourceRef)&&eq(priorSourceRef,SEALED.priorSourceRef)&&eq(currentSourceRef,SEALED.currentSourceRef),'SOURCE_BINDING');
  exact(boundState,['native','prior','current'],'STATE_KEYS');
  for(const [role,hash] of [['native',SEALED.nativeQuestionSha256],['prior',SEALED.priorQuestionSha256],['current',SEALED.currentQuestionSha256]]){
    const s=boundState[role];exact(s,['wholeQuestionSha256','flagOwn','flagValue','choicesSha256','choicesCount','choicesNonempty'],'STATE_ROLE_KEYS');
    need(s.wholeQuestionSha256===hash&&s.choicesSha256===SEALED.choicesSha256&&s.choicesCount===5&&s.choicesNonempty===true,'WHOLE_QUESTION_OR_CHOICES');
    need(role==='current'?s.flagOwn===true&&s.flagValue===true:s.flagOwn===false&&s.flagValue===null,'ABSENT_TO_TRUE_ONLY');
  }
  need(typeof readRef==='function'&&typeof readLiveRef==='function','IMMUTABLE_READERS');
  for(const r of [nativeSourceRef,priorSourceRef,currentSourceRef])readRef(r);readLiveRef(currentSourceRef);
  const t=document(readRef,ui.TECHNICAL_REF),v=document(readRef,ui.VISUAL_REF);
  need(eq(SEALED.technicalRef,ui.TECHNICAL_REF)&&eq(SEALED.visualRef,ui.VISUAL_REF)&&eq(SEALED.staticRef,t.priorStaticEvidenceRef),'OBSERVATION_PINS');
  const s=document(readRef,SEALED.staticRef),original=document(readRef,SEALED.originalObservationRef);
  need(s.schemaVersion==='archive-independent-m2s1-svg7-image-pointer-static-v1'&&s.rootOriginalFreezeSha256===SEALED.originalObservationRef.sha256&&
    s.producer!==s.reviewer&&s.newNativeApprovals===0&&s.newMetadataApprovals===0&&s.newFourSlotVectors===0,'STATIC_AUTHORITY');
  const sr=one(s.rows,x=>x.questionUid===UID&&x.sourceOrdinal===15,'STATIC_SELECTED');
  need(sr.key==='E045-Q15'&&sr.pointerField==='content'&&sr.pointerKind==='EXACT_SINGLE_IMG_SRC_URI'&&
    sr.staticDecision==='ACCEPT_STATIC_DISPLAY_REPAIR','STATIC_SELECTED_DECISION');
  const before=one(original.references,x=>x.key==='E045-Q15','ORIGINAL_SELECTED');
  need(original.candidateImagesViewedBeforeFreeze===false&&typeof original.observer==='string'&&original.observer===s.reviewer,'ORIGINAL_PHASE');
  need(Array.isArray(priorProblemAssets)&&priorProblemAssets.length===1&&Array.isArray(currentProblemAssets)&&currentProblemAssets.length===1,'PROBLEM_ASSET_INVENTORY');
  // The observed original is a full given-only crop, not the prior standalone figure.
  need(eq(priorProblemAssets[0],SEALED.priorProblemAssetRef),'PRIOR_PROBLEM_ASSET');
  need(before.sha256===SEALED.originalGivenPng.sha256&&before.bytes===SEALED.originalGivenPng.bytes,'ORIGINAL_GIVEN_PNG');
  readRef(SEALED.priorProblemAssetRef);
  need(eq(withoutCommit(sr.newAssetRef),withoutCommit(currentProblemAssets[0])),'STATIC_NEW_ASSET');
  const item=one(t.items,x=>x.questionUid===UID&&x.sourceOrdinal===15,'UI_ITEM');
  need(eq(item.sourceRef,currentSourceRef)&&eq(item.assetRef,currentProblemAssets[0])&&item.expectedBankCount===24,'UI_CURRENT_INPUT');
  for(const viewport of ['desktop','mobile']){
    const row=one(t.results,x=>x.questionUid===UID&&x.sourceOrdinal===15&&x.viewport.name===viewport,'UI_CASE');
    const role=row.capture?.closedProblemRoles,binding=role?.embeddedChoiceBinding,choices=role?.choiceState;
    need(row.status==='PASS'&&role?.schemaVersion==='archive-m2s1-svg7-embedded-image-choices-v1'&&
      role.expectedChoiceCount===5&&role.numberRoleCount===1&&role.contentRoleCount===1&&role.targetImageCount===1&&
      binding?.schemaVersion==='archive-m2s1-svg7-e045-q15-embedded-choices-v1'&&binding.sourceFlag===FIELD&&
      binding.choiceCount===5&&binding.choicesSha256===SEALED.choicesSha256&&
      choices?.choiceCount===5&&choices.choicesSha256===SEALED.choicesSha256&&choices.allChoicesNonemptyStrings===true&&
      choices.ownEmbeddedFlag===true&&choices.embeddedFlagValue===true&&choices.nestedEmbeddedFlag===false,'ACTUAL_EMBEDDED_CASE');
    readRef(binding.beforeSourceRef);readRef(binding.oldAssetRef);
  }
  need(v.completeVisualRelease==='PASS_DISPLAY_SCOPE_7_OF_7'&&v.newNativeApprovals===0&&v.newMetadataApprovals===0&&
    one(v.observations,x=>x.key==='E045-Q15','VISUAL_SELECTED').verdict==='ACCEPT_DISPLAY','INDEPENDENT_ACTUAL_PNG');
  return {schemaVersion:SCHEMA,questionUid:UID,sourceOrdinal:15,field:FIELD,
    nativeQuestionSha256:SEALED.nativeQuestionSha256,priorQuestionSha256:SEALED.priorQuestionSha256,currentQuestionSha256:SEALED.currentQuestionSha256,
    choicesSha256:SEALED.choicesSha256,sourceWrites:0,newNativeApprovals:0,newSemanticApprovals:0,newFourSlotVectors:0};
}
return Object.freeze({OPTION,SCHEMA,UID,FIELD,state,claim,verify});

})();

// The three E048 sources already contain an own inline SVG. Their empty file
// inventory is not a missing original figure and is never relabeled as a file.
const inlineFigureContinuity=(()=>{
const crypto=require('node:crypto');
const OPTION='svg7InlineFigureContinuity';
const SCHEMA='archive-svg7-e048-inline-figure-continuity-v1';
const ROWS=[
  {
    "key": "E048-Q11",
    "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
    "sourceOrdinal": 11,
    "nativeSourceRef": {
      "commit": "150b22a57f1a7075cae4ea89810bacc3bb7fff15",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "currentSourceRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "4a20adbce9e5a7f07744143cef611d453e454250",
      "sha256": "bb0904139d63eee938b33add6a9b48e1129bfa7d7e9dd9d6939045f66c50f88b",
      "bytes": 40797
    },
    "nativeWholeQuestionSha256": "8bd1edd558e7ebd7e4f5dcafddb9f8e26ff7dc4581ed688e9a39cf37350949b6",
    "priorWholeQuestionSha256": "8bd1edd558e7ebd7e4f5dcafddb9f8e26ff7dc4581ed688e9a39cf37350949b6",
    "currentWholeQuestionSha256": "204df6ce83ba0c3b0c7c0f2b36b6b727d22629017e57d20a74810abfb19583fa",
    "sourceQuestionCount": 26,
    "inlineSvgOwnFieldSha256": "c95eb589a39cb409f00008a7e3fcbd03868cb2f48be329cce3687d101bfb4944",
    "inlineSvgUtf8Bytes": 951,
    "currentProblemAssetRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q11-problem-visual-v2-source-repair-r1.svg",
      "gitBlobSha1": "1f7d7e789339248ae3b45d8d45f292fbb9170077",
      "sha256": "8b31d959fdd7a6530f41fe27b118c6a7e4fb6c965c4fe83d3e89581a399edb18",
      "bytes": 3708
    },
    "originalGivenPng": {
      "sha256": "e37c3414ccacca2011c732d3b78da6376d1149d9f4501b846256b8b247c71db6",
      "bytes": 4307
    }
  },
  {
    "key": "E048-Q13",
    "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
    "sourceOrdinal": 13,
    "nativeSourceRef": {
      "commit": "150b22a57f1a7075cae4ea89810bacc3bb7fff15",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "currentSourceRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "4a20adbce9e5a7f07744143cef611d453e454250",
      "sha256": "bb0904139d63eee938b33add6a9b48e1129bfa7d7e9dd9d6939045f66c50f88b",
      "bytes": 40797
    },
    "nativeWholeQuestionSha256": "898dd45b83d05fccf4aacdc8f5f1f55bf1d610bf26ad138c8bd305b49b805e27",
    "priorWholeQuestionSha256": "898dd45b83d05fccf4aacdc8f5f1f55bf1d610bf26ad138c8bd305b49b805e27",
    "currentWholeQuestionSha256": "d9d927d29c120afda98c485b2e17853602c8061f01312e5043060a7972d22918",
    "sourceQuestionCount": 26,
    "inlineSvgOwnFieldSha256": "fbcc12f746afed4d0919fa0780fa471d78cb12d9a2f738611e1ff5110f4d8ab6",
    "inlineSvgUtf8Bytes": 592,
    "currentProblemAssetRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q13-problem-visual-v2-source-repair-r1.svg",
      "gitBlobSha1": "e28d5f2f62da3197ea2fd2a1571288e6023d479a",
      "sha256": "81346a2433a587cb88772e20fa4c6f164c0a6fb96fd07c118d49b34192642639",
      "bytes": 1715
    },
    "originalGivenPng": {
      "sha256": "b1d4580eb09515d29973328de7f06e82c324d3dfa94b7c03989a38a15a360e5b",
      "bytes": 856
    }
  },
  {
    "key": "E048-Q24",
    "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
    "sourceOrdinal": 24,
    "nativeSourceRef": {
      "commit": "150b22a57f1a7075cae4ea89810bacc3bb7fff15",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "priorSourceRef": {
      "commit": "b967d9fe4ded4c389416b567d4c98d8bfd9433d6",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "5a9f269222f1b7a2a685a8c0c88ad845a234b493",
      "sha256": "5149180b31ceeec68c9ec4ab92bbccd4e6dafb35f3f0226b7c1861149bd16c02",
      "bytes": 39003
    },
    "currentSourceRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "gitBlobSha1": "4a20adbce9e5a7f07744143cef611d453e454250",
      "sha256": "bb0904139d63eee938b33add6a9b48e1129bfa7d7e9dd9d6939045f66c50f88b",
      "bytes": 40797
    },
    "nativeWholeQuestionSha256": "e5111d68258d8bf8649ae66f70a72530f11ee635cf8c0b6cdbe10efc3355adb1",
    "priorWholeQuestionSha256": "e5111d68258d8bf8649ae66f70a72530f11ee635cf8c0b6cdbe10efc3355adb1",
    "currentWholeQuestionSha256": "6af32349e8c99b6a75b05aae09dec93eb95cf45b28399e1cfc5d897494440d7a",
    "sourceQuestionCount": 26,
    "inlineSvgOwnFieldSha256": "540edf1c1f9cb816ef9ff64523a242e8713855599919a25ea762644fb5ca7ba2",
    "inlineSvgUtf8Bytes": 1173,
    "currentProblemAssetRef": {
      "commit": "45e976a5981701bef9c755d50c11636116ee788f",
      "path": "archive/assets/images/21_금당중_1학기_중간_중2_기출/q24-problem-visual-v2-source-repair-r1.svg",
      "gitBlobSha1": "e77c366e63ffa891cb53ccd3b8b334e4c541a57a",
      "sha256": "2b6aa6539acbc4f713ef09d9c1968825b1138416dc953449bb0392209ea28ca0",
      "bytes": 3555
    },
    "originalGivenPng": {
      "sha256": "b17c75b0f7ce6d80028b6462ef16d68e745ef27e56322b07096d15c00fd5fec0",
      "bytes": 53993
    }
  }
];
const EVIDENCE={
  "staticRef": {
    "commit": "45e976a5981701bef9c755d50c11636116ee788f",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/independent-static-v1.json",
    "gitBlobSha1": "c0f84ef234a430067e79e563712bb2c95b0ae3a0",
    "sha256": "2fa5c28da0a4d22c6443a6a164caa300fadc3642201265224b7351eb273b520e",
    "bytes": 13196
  },
  "originalObservationRef": {
    "commit": "fe358c718d68de9d73cc9d0990b7a4df716bf4e3",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/root-original7-observation-v1.json",
    "gitBlobSha1": "49dad86c674e9d8b63ca69f5b32422f665b2e0c3",
    "sha256": "4fd7aaedd5666a65ccb32c5eefaf413cddd6e38f43b422f47ab146d23bf07344",
    "bytes": 3793
  },
  "technicalRef": {
    "commit": "b9bd24223d4e523db6577682c1a30e74c11d25db",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/student-ui-technical-v3.json",
    "gitBlobSha1": "06cf5c2b0e38e4113ddf1fdd519a31cfa5196f39",
    "sha256": "c96dcff0275aeac68bb1cd527594ebf000b0ea36e7e7be4cec943e00d9303864",
    "bytes": 303157
  },
  "visualRef": {
    "commit": "b9bd24223d4e523db6577682c1a30e74c11d25db",
    "path": "docs/operations/m2s1-svg7-source-repair-20261116/student-ui-independent-v3.json",
    "gitBlobSha1": "e7c7b463065f0e6cd25e8e58101c999045f2e341",
    "sha256": "072f7eb06db26f18728ca3cb142154956baf9ae2916b0805f18e14a41d63732e",
    "bytes": 5966
  }
};
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const eq=(a,b)=>stable(a)===stable(b),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const fail=code=>{throw Error('SVG7_INLINE_FIGURE_'+code);};
const need=(x,code)=>{if(!x)fail(code);};
function exact(x,keys,code){need(x&&typeof x==='object'&&!Array.isArray(x)&&eq(Object.keys(x).sort(),keys.slice().sort()),code);}
function document(readRef,ref){const b=readRef(ref);need(Buffer.isBuffer(b)&&b.length===ref.bytes&&sha(b)===ref.sha256&&blob(b)===ref.gitBlobSha1,'IMMUTABLE_BYTES');return JSON.parse(b);}
function one(rows,p,code){const found=(rows||[]).filter(p);need(found.length===1,code);return found[0];}
function withoutCommit(ref){const {commit,...rest}=ref;return rest;}
function fixed(uid){return one(ROWS,r=>r.questionUid===uid,'EXACT_THREE_SUBJECTS');}
function claim(uid){return {schemaVersion:SCHEMA,...structuredClone(fixed(uid)),...structuredClone(EVIDENCE)};}
function state(nativeQuestion,priorQuestion,currentQuestion){
  const model=q=>({wholeQuestionSha256:sha(stable(q)),inlineSvgOwn:own(q,'svg'),inlineSvgType:typeof q.svg,
    inlineSvgOwnFieldSha256:own(q,'svg')?sha(stable(q.svg)):null,
    inlineSvgUtf8Bytes:typeof q.svg==='string'?Buffer.byteLength(q.svg):null,
    inlineSvgElementCount:typeof q.svg==='string'?(q.svg.match(/<svg\b/gi)||[]).length:0});
  return {native:model(nativeQuestion),prior:model(priorQuestion),current:model(currentQuestion)};
}
function verify({claim:input,questionUid,sourceOrdinal,boundState,nativeSourceRef,priorSourceRef,currentSourceRef,
  priorProblemAssets,currentProblemAssets,readRef,readLiveRef}){
  const pin=fixed(questionUid),expected=claim(questionUid);
  exact(input,Object.keys(expected),'CLAIM_KEYS');need(eq(input,expected)&&sourceOrdinal===pin.sourceOrdinal,'EXACT_SCOPE_AND_PINS');
  need(eq(nativeSourceRef,pin.nativeSourceRef)&&eq(priorSourceRef,pin.priorSourceRef)&&eq(currentSourceRef,pin.currentSourceRef),'SOURCE_BINDING');
  exact(boundState,['native','prior','current'],'STATE_KEYS');
  for(const role of ['native','prior','current']){
    const s=boundState[role];exact(s,['wholeQuestionSha256','inlineSvgOwn','inlineSvgType','inlineSvgOwnFieldSha256','inlineSvgUtf8Bytes','inlineSvgElementCount'],'STATE_ROLE_KEYS');
    need(s.wholeQuestionSha256===pin[role+'WholeQuestionSha256'],'WHOLE_QUESTION');
    need(s.inlineSvgOwn===true&&s.inlineSvgType==='string'&&s.inlineSvgOwnFieldSha256===pin.inlineSvgOwnFieldSha256&&
      s.inlineSvgUtf8Bytes===pin.inlineSvgUtf8Bytes&&s.inlineSvgElementCount===1,'ORIGINAL_INLINE_SVG_RETAINED');
  }
  need(Array.isArray(priorProblemAssets)&&priorProblemAssets.length===0&&Array.isArray(currentProblemAssets)&&
    currentProblemAssets.length===1&&eq(currentProblemAssets[0],pin.currentProblemAssetRef),'EXACT_INLINE_TO_FILE_INVENTORY');
  need(typeof readRef==='function'&&typeof readLiveRef==='function','IMMUTABLE_READERS');
  for(const r of [nativeSourceRef,priorSourceRef,currentSourceRef,pin.currentProblemAssetRef])readRef(r);
  readLiveRef(currentSourceRef);readLiveRef(pin.currentProblemAssetRef);
  const t=document(readRef,EVIDENCE.technicalRef),v=document(readRef,EVIDENCE.visualRef),s=document(readRef,EVIDENCE.staticRef),o=document(readRef,EVIDENCE.originalObservationRef);
  need(eq(EVIDENCE.technicalRef,TECHNICAL_REF)&&eq(EVIDENCE.visualRef,VISUAL_REF)&&eq(EVIDENCE.staticRef,t.priorStaticEvidenceRef),'OBSERVATION_PINS');
  need(s.schemaVersion==='archive-independent-m2s1-svg7-image-pointer-static-v1'&&s.rootOriginalFreezeSha256===EVIDENCE.originalObservationRef.sha256&&
    s.producer!==s.reviewer&&s.newNativeApprovals===0&&s.newMetadataApprovals===0&&s.newFourSlotVectors===0,'STATIC_AUTHORITY');
  const sr=one(s.rows,r=>r.key===pin.key&&r.questionUid===questionUid&&r.sourceOrdinal===sourceOrdinal,'STATIC_SELECTED');
  need(sr.staticDecision==='ACCEPT_STATIC_DISPLAY_REPAIR'&&eq(withoutCommit(sr.newAssetRef),withoutCommit(pin.currentProblemAssetRef)),'STATIC_NEW_ASSET');
  readRef(sr.beforeSourceRef);readRef(sr.oldAssetRef);readRef(sr.newAssetRef);
  const original=one(o.references,r=>r.key===pin.key,'ORIGINAL_SELECTED');
  need(o.candidateImagesViewedBeforeFreeze===false&&o.observer===s.reviewer&&original.sha256===pin.originalGivenPng.sha256&&
    original.bytes===pin.originalGivenPng.bytes,'ORIGINAL_GIVEN_FREEZE');
  const item=one(t.items,r=>r.key===pin.key&&r.questionUid===questionUid&&r.sourceOrdinal===sourceOrdinal,'UI_ITEM');
  need(eq(item.sourceRef,currentSourceRef)&&eq(item.assetRef,pin.currentProblemAssetRef)&&item.expectedBankCount===26,'UI_CURRENT_INPUT');
  for(const viewport of ['desktop','mobile']){
    const row=one(t.results,r=>r.questionUid===questionUid&&r.sourceOrdinal===sourceOrdinal&&r.viewport.name===viewport,'UI_CASE');
    need(row.status==='PASS'&&eq(row.sourceRef,currentSourceRef)&&eq(row.assetRef,pin.currentProblemAssetRef),'UI_CURRENT_INPUT');
  }
  need(v.completeVisualRelease==='PASS_DISPLAY_SCOPE_7_OF_7'&&v.newNativeApprovals===0&&v.newMetadataApprovals===0&&
    one(v.observations,r=>r.key===pin.key,'VISUAL_SELECTED').verdict==='ACCEPT_DISPLAY','INDEPENDENT_ACTUAL_PNG');
  return {schemaVersion:SCHEMA,questionUid,sourceOrdinal,priorRepresentation:'OWN_INLINE_SVG',priorFileAssetCount:0,
    currentRepresentation:'FILE_IMG_WITH_ORIGINAL_INLINE_SVG_RETAINED',currentFileAssetCount:1,
    inlineSvgOwnFieldSha256:pin.inlineSvgOwnFieldSha256,sourceWrites:0,newNativeApprovals:0,newSemanticApprovals:0,newFourSlotVectors:0};
}
return Object.freeze({OPTION,SCHEMA,claim,state,verify});
})();
module.exports={SCHEMA,TECHNICAL_REF,VISUAL_REF,MANIFEST_REF,verifySvg7Ui,embeddedChoiceContinuity,inlineFigureContinuity};

