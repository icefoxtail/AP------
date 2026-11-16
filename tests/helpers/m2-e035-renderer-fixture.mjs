// All questions, observations, screenshots and approvals here are synthetic.
// The fixed production UID is used solely to exercise the closed routing gate.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {execFileSync} from 'node:child_process';
import {M2_E035_SCOPE, M2_E035_RENDERER_SCHEMA, M2_E035_TRANSPORT_SCHEMA,
  M2_E035_REVIEW_SCHEMA, M2_E035_RENDERER_FIELDS} from '../../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';
import {REASSESSED_STUDENT_FIELDS} from '../../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {REVIEWED_META_VALUE_FIELDS} from '../../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';
import {sourceFingerprint, contentFingerprint} from '../../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {loadActiveMetaRegistry, validateActiveMetaFields} from '../../archive/tools/meta-foundation/active-registry.mjs';

export const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
export const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const clone = v => JSON.parse(stable(v));
const blob = v => crypto.createHash('sha1').update(`blob ${v.length}\0`).update(v).digest('hex');
const payload = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, q[k] ?? null]));
const delta = (a,b) => Object.fromEntries([...new Set([...Object.keys(a),...Object.keys(b)])].sort()
  .filter(k => stable(a[k]) !== stable(b[k])).map(k => [k,{before:{present:Object.hasOwn(a,k),value:a[k]??null},after:{present:Object.hasOwn(b,k),value:b[k]??null}}]));
const crc = bytes => {let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
export function fixturePng(width,height) {
  const chunk=(name,bytes)=>{const n=Buffer.from(name),len=Buffer.alloc(4),sum=Buffer.alloc(4);len.writeUInt32BE(bytes.length);sum.writeUInt32BE(crc(Buffer.concat([n,bytes])));return Buffer.concat([len,n,bytes,sum]);};
  const h=Buffer.alloc(13);h.writeUInt32BE(width);h.writeUInt32BE(height,4);h[8]=8;h[9]=2;
  const data=Buffer.alloc((width*3+1)*height,255);for(let y=0;y<height;y++)data[y*(width*3+1)]=0;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',zlib.deflateSync(data)),chunk('IEND',Buffer.alloc(0))]);
}

// Synthetic measurements only. This models the v2 producer's distinct context,
// layout and visual coordinate systems without claiming a real screenshot run.
export function fixtureViewportEvidence(result, options={}) {
  const context={width:result.viewport.width,height:result.viewport.height};
  const layout=options.layoutViewport||context,visual=options.visualViewport||{width:context.width,height:context.height,offsetLeft:0,offsetTop:0,scale:1};
  const shape={layoutViewport:{...layout},documentClient:{...(options.documentClient||layout)},visualViewport:{...visual},screen:{...context},devicePixelRatio:1};
  const cap=result.capture;cap.viewport={...layout};cap.coordinateSystem='LAYOUT_CSS_PIXELS';
  cap.viewportEvidence={contextViewport:{...context},isMobile:result.viewport.name==='mobile',hasTouch:result.viewport.name==='mobile',deviceScaleFactor:1,beforeScroll:clone(shape),afterScroll:clone(shape)};
  for(const tile of cap.tiles){
    const metrics={...clone(shape),visualViewport:{...visual,pageLeft:tile.scroll.x+visual.offsetLeft,pageTop:tile.scroll.y+visual.offsetTop}};
    tile.screenshotEvidence={api:'PAGE_SCREENSHOT',fullPage:true,scale:'css',coordinateSystem:'DOCUMENT_CSS_PIXELS',
      documentClip:{x:tile.clip.x+tile.scroll.x,y:tile.clip.y+tile.scroll.y,width:tile.clip.width,height:tile.clip.height},
      contextViewportBefore:{...context},contextViewportAfter:{...context},metricsBefore:clone(metrics),metricsAfter:clone(metrics),
      pngDimensions:{width:Math.floor(tile.clip.width),height:Math.floor(tile.clip.height)},visibleRoiContained:true,postprocessing:false};
  }
  return result;
}

// Synthetic v3 measurements use the same strict viewport space as the observed
// producer. The copied helper fixture is real immutable algorithm bytes only;
// the question, approval and screenshot remain entirely synthetic.
export function fixtureViewportEvidenceV3(result, options={}) {
  const context={width:result.viewport.width,height:result.viewport.height};
  const layout=options.layoutViewport||context,visual=options.visualViewport||{width:context.width,height:context.height,offsetLeft:0,offsetTop:0,scale:1};
  const shape={layoutViewport:{...layout},documentClient:{...(options.documentClient||layout)},visualViewport:{...visual},screen:{...context},devicePixelRatio:1};
  const cap=result.capture;cap.viewport={...layout};cap.coordinateSystem='LAYOUT_CSS_PIXELS';
  cap.viewportEvidence={contextViewport:{...context},isMobile:result.viewport.name==='mobile',hasTouch:result.viewport.name==='mobile',deviceScaleFactor:1,beforeScroll:clone(shape),afterScroll:clone(shape)};
  for(const tile of cap.tiles){
    const metrics={...clone(shape),visualViewport:{...visual,pageLeft:tile.scroll.x+visual.offsetLeft,pageTop:tile.scroll.y+visual.offsetTop}};
    tile.screenshotEvidence={api:'PAGE_SCREENSHOT',fullPage:false,scale:'css',coordinateSystem:'VIEWPORT_CSS_PIXELS',viewportClip:{...tile.clip},
      documentClip:{x:tile.clip.x+tile.scroll.x,y:tile.clip.y+tile.scroll.y,width:tile.clip.width,height:tile.clip.height},documentClipRole:'DERIVED_VISIBLE_ROI_ONLY',
      contextViewportBefore:{...context},contextViewportAfter:{...context},metricsBefore:clone(metrics),metricsAfter:clone(metrics),
      pngDimensions:{width:Math.floor(tile.clip.width+.001),height:Math.floor(tile.clip.height+.001)},pixelRule:'FLOOR_CSS_PX_PLUS_0_001',playwrightVersion:'1.62.1',visibleRoiContained:true,postprocessing:false};
  }
  return result;
}

export function e035Fixture(t, options={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'synthetic-e035-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',['-c','protocol.allow=never',...args],{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
  git('init','-q');git('config','user.name','Synthetic fixture');git('config','user.email','fixture@example.invalid');
  const put=(p,value)=>{const full=path.join(root,p);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,Buffer.isBuffer(value)||typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');return{path:p,sha256:sha(fs.readFileSync(full))};};
  const raw=p=>fs.readFileSync(path.join(root,p)),read=p=>JSON.parse(raw(p));
  const commit=()=>{git('add','-A');git('commit','--allow-empty','-qm','Synthetic E035 fixture, no actual approval');return git('rev-parse','HEAD');};
  const ref=(c,p)=>{const bytes=execFileSync('git',['show',c+':'+p],{cwd:root});return{commit:c,path:p,gitBlobSha1:blob(bytes),sha256:sha(bytes)};};
  const bankFromBytes=b=>{const c={window:{}};vm.runInNewContext(b.toString(),c);return JSON.parse(JSON.stringify(c.window.questionBank));};
  const S=M2_E035_SCOPE,uid=S.questionUid,sourcePath='archive/exams/'+S.sourceArchiveFile,base='.archive-meta-register/evidence/m2-e035-current-renderer-fixture/';
  const uiHelperPath='tools/check-reviewed-problem-renderer-browser.cjs';
  if(options.uiVersion==='v3'){
    const helper=fs.readFileSync(new URL('../fixtures/e035-ui-tile-helper-94ec.cjs',import.meta.url));
    if(sha(helper)!=='94ec31b0e66d1461e7e9757e10af194ac2de47d9b614da4ab191e4615a17dfa4')throw Error('pinned test helper bytes changed');
    put(uiHelperPath,helper);
  }
  const source=bank=>'// Synthetic fixture only.\nwindow.questionBank = '+JSON.stringify(bank,null,2)+';\n';
  const snapshot=(c)=>{const r=ref(c,sourcePath),bytes=execFileSync('git',['show',c+':'+sourcePath],{cwd:root});return{...r,questionSha256:sha(stable(bankFromBytes(bytes)[11]))};};
  const owner='MIDDLE_GEOMETRY',CANON='archive/data/meta-foundation/canonical/',packPath=CANON+'packs/middle-geometry/',definitionPath=CANON+'concepts/plane-geometry.json';
  const pt={problemTypeKey:'PT_EXISTING',canonicalLabelKo:'Synthetic existing primary',definition:'Synthetic unchanged primary definition.',ownerPack:owner,status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const tpl={templateKey:'TPL_EXISTING',canonicalLabelKo:'Synthetic existing method',definition:'Synthetic unchanged method.',ownerPack:owner,status:'ACTIVE',parentProblemTypeKey:pt.problemTypeKey,supportingQuestionUids:[uid],supportingItemCount:1};
  const binding={curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',problemTypeKey:pt.problemTypeKey,status:'ACTIVE',ownerPack:owner,L1:'Synthetic unit',L2:'Synthetic subunit'};
  const concept={conceptKey:'CC_FINAL',canonicalLabelKo:'Synthetic existing concept',definition:'Synthetic separately finalized existing relation.',ownerConceptShard:'PLANE_GEOMETRY',status:'ACTIVE',supportingQuestionUids:['synthetic-provider'],supportingItemCount:1};
  const pack={schemaVersion:'meta-foundation-pack-v1',packId:owner,packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중2 수학','M2-2']};
  const canonicalSources=[put(packPath+'pack.json',pack),put(packPath+'taxonomy.json',{status:'ACTIVE',problemTypes:[pt],templates:[tpl]}),
    put(packPath+'bindings.json',{status:'ACTIVE',bindings:[binding]}),put(packPath+'aliases.json',{aliases:[]}),
    put(definitionPath,{shardId:'PLANE_GEOMETRY',shardVersion:'1.0.0',concepts:[concept]}),
    put(CANON+'condition_registry.json',{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0}),
    put(CANON+'metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL']})];
  put(CANON+'registry_index.json',{status:'ACTIVE',activePacks:[{id:owner,version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[{id:'PLANE_GEOMETRY',version:'1.0.0',status:'ACTIVE'}],conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:`archive/data/meta-foundation/compiled/${n}.json`}))});
  put('archive/data/master_tables/js_archive_tag_master.json',[{key:'M2-05',keyType:'standardUnitKey',status:'active',labelKo:'Synthetic unit'},
    {key:'M2-05-TRIANGLE_PROPERTIES',keyType:'subUnitKey',status:'active',parentKey:'M2-05',labelKo:'Synthetic subunit'}]);
  const masterPath='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  put(masterPath,{records:[{curriculum:'2015',scope:'M2-2',majorUnit:'Synthetic major',midUnit:'Synthetic middle',defaultSelectable:true,concepts:[{concept:'Synthetic concept',defaultSelectable:true,problemTypes:[{problemType:'Synthetic type',defaultSelectable:true}]}]}]});
  const rpmPath='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const rpmRecord={id:'M2-RPM-001',curriculum:'2015',scope:'M2-2',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',rpmPath:{majorUnit:'Synthetic major',midUnit:'Synthetic middle',l3:'Synthetic concept',l4:'Synthetic type'}};
  const rpmRef=put(rpmPath,{records:[rpmRecord]});
  const oldAsset='archive/assets/images/synthetic-e035/old-problem.png',oldSolution='archive/assets/images/synthetic-e035/old-solution.svg',newAsset='archive/assets/images/synthetic-e035/current-problem.svg',newSolution='archive/assets/images/synthetic-e035/current-solution.svg';
  put(oldAsset,fixturePng(40,40));put(oldSolution,options.oldSolutionSvg||'<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="10" y2="10"/></svg>');
  const old={id:12,content:'Synthetic immutable stem.',choices:['Synthetic A','Synthetic B'],answer:'Synthetic A',solution:'Synthetic unchanged written explanation.',image:oldAsset.slice(8),solutionImage:oldSolution.slice(8),solutionImageAlt:'Synthetic old diagram.',solutionImageCaption:'Synthetic original whole-segment relation.',layoutTag:'grid',
    curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',standardUnit:'Synthetic unit',subUnit:'Synthetic subunit',problemTypeKey:pt.problemTypeKey,templateKey:tpl.templateKey,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',level:'중',difficultyBucket:2,primaryMethod:'Synthetic prior method.',decisiveStep:'Synthetic prior method.'};
  const oldBank=Array.from({length:21},(_,i)=>i===11?clone(old):{id:i+1,content:`Synthetic unchanged peer ${i+1}.`,choices:[],answer:'Synthetic',solution:'Synthetic peer explanation.'});
  put(sourcePath,source(oldBank));const nativeBase=commit();
  const proposal={id:'B-E035-CC-CENTROID',type:'CC',name:'Synthetic auxiliary proposal',definition:concept.definition,supportingQuestionUids:[uid],supportOrdinals:[12]};
  const nativeRow={questionUid:uid,sourceOrdinal:12,rpmDecision:'KEEP',rpmRecordId:rpmRecord.id,primaryMethod:old.primaryMethod,decisiveStep:old.decisiveStep,
    after:{crossConceptKeys:[],level:'중',difficultyBucket:2},proposalRefs:[proposal.id],fieldReview:{classification:'Synthetic immutable primary context.',binding:'Synthetic exact ACTIVE binding.',difficulty:'Synthetic retained difficulty.',condition:'Synthetic empty condition.',integration:'Synthetic original integration.'},
    activeDefinitionMatch:{problemTypeKey:pt.problemTypeKey,templateKey:tpl.templateKey,problemTypeStatus:'ACTIVE',templateStatus:'ACTIVE',templateParent:pt.problemTypeKey,exactBindings:[{curriculum:'2015',standardCourse:old.standardCourse,standardUnitKey:old.standardUnitKey,subUnitKey:old.subUnitKey,problemTypeKey:pt.problemTypeKey,status:'ACTIVE'}]}};
  Object.assign(nativeRow,options.nativeRowDelta||{});
  const nativeRows=oldBank.map((q,i)=>i===11?nativeRow:{questionUid:'qid_v1_'+sha('synthetic-peer-'+i),sourceOrdinal:i+1,rpmDecision:'KEEP',decisiveStep:'Synthetic peer decision.',after:{},fieldReview:{classification:'Synthetic peer.',difficulty:'Synthetic peer.'}});
  const nativePath='archive/data/meta-review/synthetic-e035/E035/review.json',nativeDoc={schemaVersion:'m2-s2-meta-review-v1',examId:'E035',owner:'synthetic-native-author',sourceArchiveFile:S.sourceArchiveFile,baseSha:nativeBase,sourceGitBlobSha:git('rev-parse',nativeBase+':'+sourcePath),reviewedQuestionCount:21,items:nativeRows,proposals:[proposal]};
  put(nativePath,nativeDoc);const nativeRef=put(base+'native-copy.json',raw(nativePath)),nativeCommit=commit();
  const selection={documentRef:{path:nativePath,sha256:nativeRef.sha256},index:0,proposalSha256:sha(stable(proposal)),questionUid:uid,sourceOrdinal:12,proposalId:proposal.id};
  const providerChange={path:definitionPath,collection:'concepts',match:{conceptKey:concept.conceptKey},before:null,after:concept};
  const prerequisite=put(base+'prior-provider-proposal.json',{registryChanges:[providerChange]}),prerequisiteCommit=commit();
  const choice={selection,disposition:'REUSE_ACTIVE',reason:'Synthetic unchanged finalized application.',definition:concept,canonicalPath:definitionPath,
    prerequisiteDefinitionRef:{commit:prerequisiteCommit,...prerequisite,definitionSha256:sha(stable(concept))}};
  const sourceSnapshot={commit:nativeCommit,sourcePath,blob:ref(nativeCommit,sourcePath).gitBlobSha1,sha256:ref(nativeCommit,sourcePath).sha256,questionSha256:sha(stable(old))};
  const nativeBinding={commit:nativeCommit,path:nativePath,sha256:nativeRef.sha256};
  const rendererAssets=[oldAsset,oldSolution].map(p=>({...ref(nativeCommit,p),visuallyInspected:true})).map(({commit,...r})=>r);
  const primary=Object.fromEntries(['standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey'].map(k=>[k,old[k]]));
  const definitionRow={examId:'E035',questionUid:uid,sourceOrdinal:12,sourcePath,nativeReviewRef:nativeBinding,nativeItemStableSha256:sha(stable(nativeRow)),nativeProposal:proposal,proposalSelection:selection,nativeAfter:clone(nativeRow.after),nativeActiveDefinitionMatch:clone(nativeRow.activeDefinitionMatch),nativeRpmContext:{...rpmRef,record:rpmRecord},sourceSnapshot,rendererAssets,textOnlyItem:false,protectedPayloadFieldsUnchanged:true,reviewedPrimaryContext:primary,decision:choice,independentRationale:'Synthetic original separate definition review.',newFullMathematicalQa:false,newReview2:false,newMetadataApproval:false,newDifficultyJudgment:false,sourceWrites:0};
  const definitionWitness={schemaVersion:'archive-independent-m2-native-definition-finalization-v1',decision:'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS',reviewer:'synthetic-definition-reviewer',currentMainChecked:nativeCommit,newFullMathematicalQa:false,newReview2Claims:0,newMetadataApprovals:0,newDifficultyJudgments:0,existingDefinitionsModified:0,sourceWrites:0,canonicalWrites:0,officialCompilerResolverConsumerStillRequired:true,actualMainRegistrationClaimed:false,approvedRegistryChanges:[],rows:[definitionRow]};
  const definitionRef=put(base+'definition-review.json',definitionWitness);
  const app={examId:'E035',questionUid:uid,sourceOrdinal:12,sourcePath,nativeReviewRef:nativeBinding,nativeItemStableSha256:definitionRow.nativeItemStableSha256,sourceSnapshot,rendererAssets,reviewedPrimaryContext:primary,reviewer:definitionWitness.reviewer,reason:definitionRow.independentRationale,proposalSelections:[selection],decisions:[choice],newMathematicalQa:false,newMetadataApproval:false,difficultyChanged:false,nativeProtectedStudentFieldsChanges:[],independentReviewRef:definitionRef};
  const disposition={schemaVersion:'archive-independent-m2-native-proposal-disposition-v1',status:'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING',scope:{newFullMathematicalQa:false,newReview2Claims:0,newMetadataApprovals:0,newDifficultyJudgments:0,newSourceContentEdits:0},applications:[app]},finalizationRef=put(base+'finalized-disposition.json',disposition),finalizationCommit=commit();
  const append={courseKey:'M2-2',crossConceptKeys:['CC_FINAL'],curriculumKey:'2015',...(options.metadataAppend||{})};
  const suffix=Buffer.from('\n// Synthetic immutable approved source appendix.\nObject.assign(window.questionBank[11], '+JSON.stringify(append,null,2)+');\n'+(options.suffixExtraStatement||''));
  const beforeSource=Buffer.from(source(oldBank)),prefigureBank=bankFromBytes(Buffer.concat([beforeSource,suffix])),prefigure=prefigureBank[11];
  const metadata={...clone(old),questionUid:uid,sourceArchiveFile:S.sourceArchiveFile,sourceOrdinal:12,sourceQuestionNo:'12',reviewStatus:'review_required',sourceFingerprint:sourceFingerprint(old),contentFingerprint:contentFingerprint(old)};
  for(const k of ['id','content','choices','answer','solution','image','layoutTag','solutionImage','solutionImageAlt','solutionImageCaption'])delete metadata[k];
  const valueKeys=['curriculum','standardCourse','standardUnitKey','subUnitKey','standardUnit','subUnit','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','level','difficultyBucket','primaryMethod','decisiveStep'];
  const after={...Object.fromEntries(valueKeys.map(k=>[k,clone(prefigure[k])])),...append,sourceFingerprint:sourceFingerprint(prefigure),contentFingerprint:contentFingerprint(prefigure)};
  const originalEvidence=[nativeRef,definitionRef,finalizationRef,prerequisite,...[oldAsset,oldSolution].map(p=>({path:p,sha256:sha(raw(p))}))];
  const patch={questionUid:uid,sourceOrdinal:12,before:Object.fromEntries(Object.keys(after).map(k=>[k,metadata[k]??null])),after,identityBefore:{sourceFingerprint:metadata.sourceFingerprint},reason:'Synthetic existing v3 consumer; no actual approval.',evidenceRefs:clone(originalEvidence),
    sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativePath,reviewRef:nativeRef,proposalFinalization:{schemaVersion:'archive-native-proposal-finalization-v3',finalizationCommit,finalizationRef,proposalSelections:[selection]}}};
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',scope:'PARTIAL_UIDS',requestId:'m2s2-follow6-20261115-E035',examUid:'synthetic-e035',sourceArchiveFile:S.sourceArchiveFile,expectedQuestionCount:21,expectedSourceBlobSha1:blob(Buffer.concat([beforeSource,suffix])),approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-approver',evidenceRefs:clone(originalEvidence)},items:[patch],registryChanges:[]};
  const frozenPath='.archive-meta-register/inbox/m2s2-follow6-20261115-E035.json';put(sourcePath,Buffer.concat([beforeSource,suffix]));put(frozenPath,request);const frozenCommit=commit(),frozenRaw=raw(frozenPath);
  const presentation={image:newAsset.slice(8),imageAlt:'Synthetic current problem.',imageSize:'tall',layoutTag:'fullwidth',solutionImage:newSolution.slice(8),solutionImageAlt:'Synthetic whole relation.',solutionImageCaption:'Synthetic retained explanation.'};
  const productionBank=clone(oldBank);Object.assign(productionBank[11],presentation,options.productionDelta||{});
  for(const ordinal of [3,4,5,6,9,10,11,13,16,17,18,19,20])productionBank[ordinal-1].imageAlt='Synthetic current owner presentation '+ordinal;
  const production=productionBank[11],productionBytes=Buffer.from(source(productionBank));put(sourcePath,productionBytes);
  put(newAsset,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="10" y1="10" x2="80" y2="80"/></svg>');
  const plain='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Synthetic only</title><line x1="10" y1="10" x2="80" y2="80"/>';
  const tick='<line x1="45" y1="48" x2="51" y2="42"/>',end='<text x="20" y="80">AB</text>';
  const badSvg=plain+tick+end+'</svg>',repairedSvg=options.currentSolutionSvg||plain+end+'<text x="10" y="95">'+(options.repairAddedText||'AD = BD = DC')+'</text>'+(options.repairExtraXml||'')+'</svg>';
  put(newSolution,badSvg);put('archive/mixed_engine.html','<!doctype html><title>Synthetic production UI only</title>');
  const producerPath=base+'synthetic-ui-producer.mjs';put(producerPath,'// Synthetic UI measurement fixture, never an actual browser run.\n');
  const preRepairCommit=commit();
  const beforeRef=snapshot(nativeCommit),preRepairRef=snapshot(preRepairCommit),nativeFullRef=ref(nativeCommit,nativePath);
  const beforeAssets={problem:ref(nativeCommit,oldAsset),solution:ref(nativeCommit,oldSolution)},badAssets={problem:ref(preRepairCommit,newAsset),solution:ref(preRepairCommit,newSolution)};
  const capturePaths={beforeProblem:base+'captures/before-problem.png',beforeSolution:base+'captures/before-solution.png',currentProblem:base+'captures/current-problem.png',currentSolution:base+'captures/current-solution.png'};
  for(const p of Object.values(capturePaths))put(p,fixturePng(120,100));
  const observed=Object.fromEntries(['beforeProblemViewed','beforeSolutionViewed','currentProblemViewed','currentSolutionViewed','currentStemAndChoicesRead','currentWrittenSolutionRead','currentAltAndCaptionsRead'].map(k=>[k,true]));
  const continuity=Object.fromEntries(['labelsAndGivenValuesPreserved','givenGeometryRelationsPreserved','choiceOrderUnchanged','noNewGivenConditions','noNewAnswerHint','currentDiagramsSupportedByExistingWrittenSolution','currentAltAndCaptionsSupported'].map(k=>[k,true]));
  const views=(currentAssets,repaired=false)=>['before','current'].flatMap(phase=>['problem','solution'].map(role=>{
    const cap=repaired&&phase==='current'&&role==='solution'?base+'captures/repaired-current-solution.png':capturePaths[phase+role[0].toUpperCase()+role.slice(1)];
    return{phase,role,assetRef:(phase==='before'?beforeAssets:currentAssets)[role],captureRef:{path:cap,sha256:sha(raw(cap))},renderer:'Synthetic fixture only; NOT_AN_ACTUAL_VIEW',width:120,height:100};}));
  const negative={schemaVersion:M2_E035_REVIEW_SCHEMA,scope:'EXACT_E035_EXISTING_APPROVED_PRESENTATION_CONTINUITY',observer:'synthetic-independent-observer',observedAt:'2000-01-01T00:00:00Z',decision:'HOLD',...S,nativeReviewRef:nativeFullRef,beforeSourceRef:beforeRef,currentSourceRef:preRepairRef,beforeAssets,currentAssets:badAssets,renderedViews:views(badAssets),observed:clone(observed),continuity:{...continuity,givenGeometryRelationsPreserved:false},observations:{problem:'Synthetic fixture.',solution:'Synthetic ambiguity fixture.',writtenContext:'Synthetic original context.',altAndCaptions:'Synthetic captions.',unresolvedIssue:'Synthetic partial-segment marker.'},newMathematicalQa:false,newMetadataApprovals:0,newDefinitionApprovals:0,newDifficultyJudgments:0,newFourSlotApprovals:0};
  const negativePath=base+'independent-observation.json',negativeRef=put(negativePath,negative);
  put(newSolution,repairedSvg);
  const repairPath='.archive-meta-register/evidence/m2-e035-renderer-repair-fixture/root-asset-repair.json',repairDoc={schemaVersion:'archive-e035-root-minimal-asset-repair-v1',producer:'synthetic-root-observer',stage:'NARROW_ASSET_REPAIR_ONLY_STUDENT_UI_PENDING',...S,publicParent:preRepairCommit,sourceBlobUnchangedFrom0343:blob(productionBytes),priorNegativeObservationPath:negativePath,priorNegativeObservationSha256:negativeRef.sha256,changedAssetPath:newSolution,beforeSha256:sha(badSvg),afterSha256:sha(repairedSvg),xmlChanges:{removedLineElements:1,addedTextElements:1,allOtherNodesOrderedExact:true,rootAttributesExact:true},actualRootRead:{originalProblemAndSolutionViewed:true,currentProblemAndSolutionViewed:true,repairedSolutionRasterViewed:true,ambiguousSubsegmentTickRemoved:true,fullEndpointRelationNowExplicit:true,existingLabelsAndMeasuresPreserved:true,newNumericalValues:0,visibleOverlapOrClippingObserved:false},independentNarrowReadSha256:sha('Synthetic prior candidate observation.'),sourceAndProblemAssetChanges:0,metadataChanges:0,newMathematicalQa:false,newMetadataApprovals:0,newFourSlotApprovals:0,studentUiTechnical:'NOT_RUN',studentUiIndependent:'NOT_RUN',registration:'NOT_RUN'};
  put(repairPath,repairDoc);const productionCommit=commit(),productionRef=snapshot(productionCommit),currentAssets={problem:ref(productionCommit,newAsset),solution:ref(productionCommit,newSolution)};
  put(base+'captures/repaired-current-solution.png',fixturePng(120,100));
  const positive={...clone(negative),decision:'RETAIN_EXISTING_APPROVED_METADATA',currentSourceRef:productionRef,currentAssets,renderedViews:views(currentAssets,true),continuity:clone(continuity),observations:{problem:'Synthetic fixture.',solution:'Synthetic scoped resolution.',writtenContext:'Synthetic original context.',altAndCaptions:'Synthetic captions.',unresolvedIssue:null}};
  const positivePath=base+'independent-repaired-observation.json';put(positivePath,positive);
  const cases=[],records=[];
  for(const name of ['desktop','mobile'])for(const view of ['problem','solution']){
    const viewport={name,width:name==='desktop'?1280:390,height:name==='desktop'?900:844},width=viewport.width-40,height=120,id=`${name}-${view}`,filename=`e035-${view}-${name}-tile-01.png`,bytes=fixturePng(width,height),screenshot={tileIndex:1,path:filename,sha256:sha(bytes),bytes:bytes.length};put(base+filename,bytes);
    const dom=sha('Synthetic DOM '+id),scroll={x:0,y:0},clip={x:20,y:50,width,height},tile={tileIndex:1,relativeInterval:[0,height],filename,clip:{...clip},scroll:{...scroll},scrollOperations:0,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:3,foreignContentHits:0,domSha256:dom};
    const capture={schemaVersion:'archive-problem-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,overlapCssPixels:32,tileCount:1,content:{...clip},question:{...clip},viewport:{width:viewport.width,height:viewport.height},visibleChildren:1,coverage:{requiredInterval:[0,height],coveredInterval:[0,height],complete:true},tiles:[tile],scrollBefore:{...scroll},scrollAfter:{...scroll},scrollOperations:0,domSha256:dom,feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};
    cases.push((options.uiVersion==='v3'?fixtureViewportEvidenceV3:fixtureViewportEvidence)({caseId:id,questionUid:uid,sourceOrdinal:12,view,viewport,status:'PASS',visualReview:'PENDING',questionCount:21,readiness:'RENDER_READY',imagesComplete:true,mathJaxSource:'local',mathErrors:0,unrenderedMath:0,fontStatus:'loaded',fontFamilies:['Synthetic fixture font'],solutionNodes:view==='solution'?1:0,pageErrors:[],requestFailures:[],capture,screenshots:[screenshot]}));
    records.push({caseId:id,view,coverageReview:{questionUid:uid,sourceOrdinal:12,viewport:name,screenshots:[screenshot],decision:'PASS',conditionsAndLabelsPreserved:true,legible:true,notClipped:true,completeProblemCoverage:true},completeSolutionCoverage:view==='solution',glyphsLegible:true,observations:'Synthetic fixture only; NOT_AN_ACTUAL_UI_REVIEW'});
  }
  const technicalPath=base+'student-ui-technical.json',visualPath=base+'student-ui-independent.json';
  const uiSource=ref(productionCommit,sourcePath),rendererRef=ref(productionCommit,'archive/mixed_engine.html');
  const technical={schemaVersion:'archive-e035-current-renderer-student-ui-technical-v2',status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',producer:'synthetic-ui-producer',observedAt:'2000-01-01T00:00:01Z',executionOwner:'ROOT_CLOUD_CHROME',checkoutCommit:productionCommit,rendererRef,sourceRef:uiSource,currentAssets,
    browserVersion:'Synthetic fixture; no browser executed',producerRef:ref(preRepairCommit,producerPath),servedFiles:[rendererRef,uiSource,...Object.values(currentAssets)],mirroredAssets:[],transportMetadata:{mode:'LEGACY_MIXED_STORAGE',storageKeys:['mixedQuestions','mixedMeta'],questionCount:21,mixedQuestionsSha256:sha(stable(productionBank)),mixedMetaSha256:sha('Synthetic storage metadata'),sourceOverlayCount:0},
    sourceOverlayCount:0,cssWrites:0,domWrites:0,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,cases};
  if(options.uiVersion==='v3')Object.assign(technical,{schemaVersion:'archive-e035-current-renderer-student-ui-technical-v3',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',playwrightVersion:'1.62.1',helperRef:ref(preRepairCommit,uiHelperPath),helperVersion:'archive-problem-scroll-coverage-v1'});
  put(technicalPath,technical);const technicalCommit=commit();
  const visual={schemaVersion:'archive-independent-e035-current-renderer-student-ui-review-v1',scope:'EXACT_E035_FOUR_CURRENT_UI_CASES',decision:'RETAIN_EXISTING_APPROVED_PRESENTATION',observer:'synthetic-independent-ui-observer',observedAt:'2000-01-01T00:00:02Z',producer:technical.producer,technicalRef:ref(technicalCommit,technicalPath),records,newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newFourSlotApprovals:0};
  put(visualPath,visual);const frozenCopy=base+'frozen-request.json';put(frozenCopy,frozenRaw);
  const currentBank=bankFromBytes(Buffer.concat([productionBytes,suffix])),current=currentBank[11];
  put(sourcePath,Buffer.concat([productionBytes,suffix]));const currentCommit=commit();
  const change=delta(old,production),transport={schemaVersion:M2_E035_TRANSPORT_SCHEMA,scope:'EXACT_E035_V3_CONSUMER_PRESENTATION_ONLY',...S,nativeReviewRef:nativeFullRef,nativeItemSha256:sha(stable(nativeRow)),frozenRequestRef:{commit:frozenCommit,gitPath:frozenPath,path:frozenCopy,gitBlobSha1:blob(frozenRaw),sha256:sha(frozenRaw)},productionBeforeSourceRef:beforeRef,preRepairSourceRef:preRepairRef,productionCurrentSourceRef:productionRef,prefigureSourceRef:snapshot(frozenCommit),currentSourceRef:snapshot(currentCommit),metadataSuffixSha256:sha(suffix),metadataSuffixBytes:suffix.length,metadataPatchSha256:sha(stable(delta(old,prefigure))),fieldDeltaHashes:Object.fromEntries(M2_E035_RENDERER_FIELDS.map(k=>[k,{before:sha(stable(change[k].before)),after:sha(stable(change[k].after))}])),observationRef:ref(technicalCommit,positivePath),priorNegativeObservationRef:ref(productionCommit,negativePath),repairClosureRef:ref(productionCommit,repairPath),studentUiTechnicalRef:ref(technicalCommit,technicalPath),studentUiVisualRef:ref(currentCommit,visualPath),newMathematicalQa:false,newMetadataApprovals:0,newDefinitionApprovals:0,newDifficultyJudgments:0,newFourSlotApprovals:0};
  const transportPath=base+'transport.json';
  const allLivePaths=[...originalEvidence.map(r=>r.path),frozenCopy,transportPath,negativePath,positivePath,repairPath,technicalPath,visualPath,
    ...Object.values(capturePaths),base+'captures/repaired-current-solution.png',oldAsset,oldSolution,newAsset,newSolution,...cases.flatMap(c=>c.screenshots.map(s=>base+s.path))];
  const refresh=()=>{put(transportPath,transport);const c=commit();patch.sourceReview.m2E035RendererContinuity={schemaVersion:M2_E035_RENDERER_SCHEMA,transportCommit:c,transportRef:{path:transportPath,sha256:sha(raw(transportPath))}};
    const evidence=[...new Set(allLivePaths)].map(p=>({path:p,sha256:sha(raw(p))}));patch.evidenceRefs=clone(evidence);request.approval.evidenceRefs=clone(evidence);args.cache=new Map();};
  request.expectedSourceBlobSha1=blob(raw(sourcePath));Object.assign(after,{sourceFingerprint:sourceFingerprint(current),contentFingerprint:contentFingerprint(current)});
  const key=stable(['2015',old.standardCourse,old.standardUnitKey,old.subUnitKey,pt.problemTypeKey]),tables={pt:new Map([[pt.problemTypeKey,pt]]),tpl:new Map([[tpl.templateKey,tpl]]),cc:new Map([[concept.conceptKey,concept]]),cond:new Map(),bindings:new Map([[key,binding]]),packs:new Map([[owner,{meta:pack}]]),master:new Map()};
  const native={spec:{reviewCommit:nativeCommit,reviewPath:nativePath,reviewRef:nativeRef},review:nativeDoc,reviewer:nativeDoc.owner,committedBank:clone(oldBank),reviewedBank:clone(oldBank)};
  const args={root,request,patch,native,row:nativeRow,question:current,metadata,final:{...metadata,...after},studentPayload:payload,bankFromBytes,canonicalBefore:tables,canonicalAfter:tables,supportedFields:new Set(REVIEWED_META_VALUE_FIELDS),cache:new Map()};refresh();
  const identities=oldBank.map((q,i)=>({questionUid:nativeRows[i].questionUid,sourceArchiveFile:S.sourceArchiveFile,sourceOrdinal:i+1,sourceQuestionNo:String(i+1),status:'VERIFIED',sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q)}));
  put('archive/data/question_metadata.json',{records:identities.map(r=>r.questionUid===uid?metadata:{...r,reviewStatus:'review_required'}),counts:{}});
  put('archive/data/question_identity_map.json',{records:identities});fs.mkdirSync(path.join(root,'archive/data/meta-foundation/runtime'),{recursive:true});
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json`;
  const runtimeContext=()=>{const metadataDoc=read('archive/data/question_metadata.json'),identityMap=read('archive/data/question_identity_map.json'),currentMeta=metadataDoc.records.find(r=>r.questionUid===uid),identity=identityMap.records.find(r=>r.questionUid===uid),receipt=read(receiptPath),registry=loadActiveMetaRegistry(root),runtimePath=fs.readdirSync(path.join(root,'archive/data/meta-foundation/runtime')).filter(p=>p.endsWith('.json')).map(p=>'archive/data/meta-foundation/runtime/'+p).find(p=>read(p).records?.some(r=>r.questionUid===uid)),runtime=read(runtimePath),runtimeRecord=runtime.records.find(r=>r.questionUid===uid),bytes=raw(sourcePath),bank=bankFromBytes(bytes);
    const nativeSource={root,bytes,blobSha1:blob(bytes),bank,runtimeRecord,runtimeStatus:runtime.status,identityByJoin:new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r])),identityMap};
    return{question:clone(current),previous:clone(old),current:currentMeta,identity,registry,pt,tpl,ownerPack:owner,validate:validateActiveMetaFields,nativeSource,source:S.sourceArchiveFile,ordinal:12,runtimeOwner:owner,receipt,receiptPath,runtimePath};};
  const reseal=(kind,fn)=>{
    const map={positive:[positive,positivePath,'observationRef'],negative:[negative,negativePath,'priorNegativeObservationRef'],technical:[technical,technicalPath,'studentUiTechnicalRef'],visual:[visual,visualPath,'studentUiVisualRef']};
    if(kind==='transport'){fn(transport);refresh();return;}
    const [value,p,key]=map[kind];fn(value);put(p,value);const c=commit();transport[key]=ref(c,p);
    if(kind==='technical'){visual.technicalRef=transport.studentUiTechnicalRef;put(visualPath,visual);const vc=commit();transport.studentUiVisualRef=ref(vc,visualPath);}
    refresh();
  };
  return{root,git,put,raw,read,commit,ref,snapshot,source,sourcePath,old,oldBank,prefigure,prefigureBank,production,productionBank,productionBytes,current,currentBank,suffix,
    nativeBase,nativeCommit,nativeDoc,nativeRow,nativePath,nativeRef,definitionWitness,definitionRef,disposition,finalizationRef,finalizationCommit,
    beforeRef,preRepairRef,productionRef,preRepairCommit,productionCommit,frozenCommit,currentCommit,frozenRaw,frozenPath,frozenCopy,
    oldAsset,oldSolution,newAsset,newSolution,badSvg,repairedSvg,negative,negativePath,positive,positivePath,repairDoc,repairPath,
    technical,technicalPath,visual,visualPath,transport,transportPath,request,patch,args,after,metadata,tables,concept,definitionPath,allLivePaths,refresh,reseal,receiptPath,runtimeContext,uiHelperPath};
}
