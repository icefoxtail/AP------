const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const adapter = import('../archive/tools/meta-foundation/reviewed-m2-problem-renderer-continuity.mjs');
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const clone = x => structuredClone(x);
const SCOPE = 'EXACT_M2_PROBLEM_RENDERER_THREE';
const presence = (q, key) => Object.hasOwn(q, key) ? { present:true, sha256:sha(stable(q[key])) } : { present:false };
const delta = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
  .filter(key => stable(presence(before, key)) !== stable(presence(after, key)))
  .map(field => ({field, before:presence(before, field), after:presence(after, field)}));
const sourceText = bank => 'window.questionBank = ' + JSON.stringify(bank, null, 2) + ';\n';
const loadBank = bytes => { const c={window:{}};vm.runInNewContext(bytes.toString(),c);return JSON.parse(JSON.stringify(c.window.questionBank)); };

test('M2 renderer CI registration scope includes its existing finite-time command', async()=>{
 const {selectTechnicalCommands}=await import('../tools/ci/run-scoped-tests.mjs');
 const target={label:'tests/archive-m2-problem-renderer-continuity.test.js',args:['tests/archive-m2-problem-renderer-continuity.test.js'],timeout:180000};
 const irrelevant={label:'tests/unrelated.test.js',args:['tests/unrelated.test.js'],timeout:60000};
 assert.deepEqual(selectTechnicalCommands({groups:['registration']},[target,irrelevant]),[target]);
});

async function fixture(t) {
  const {M2_PROBLEM_RENDERER_ITEMS, M2_PROBLEM_RENDERER_SCHEMA} = await adapter;
  const supported=M2_PROBLEM_RENDERER_ITEMS.map(clone), root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-renderer3-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...a)=>execFileSync('git',a,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
  git('init','-q');git('config','user.name','Synthetic fixture');git('config','user.email','test@example.invalid');
  const put=(p,value)=>{const raw=Buffer.isBuffer(value)?value:Buffer.from(typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');
    fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),raw);return{path:p,sha256:sha(raw)};};
  const commit=label=>{git('add','.');git('commit','--allow-empty','-qm',label);return git('rev-parse','HEAD');};
  const fileRef=(c,p)=>{const bytes=execFileSync('git',['show',`${c}:${p}`],{cwd:root});return{commit:c,path:p,gitBlobSha1:blob(bytes),sha256:sha(bytes),bytes:bytes.length};};
  const sourceRef=(c,p,ordinal)=>{const {bytes,...ref}=fileRef(c,p);const bank=loadBank(execFileSync('git',['show',`${c}:${p}`],{cwd:root}));return{...ref,questionSha256:sha(stable(bank[ordinal-1]))};};
  const assetRef=(c,p)=>{const{commit,...ref}=fileRef(c,p);return ref;};
  const sources=[...new Set(supported.map(row=>'archive/exams/'+row.sourceArchiveFile))],original=new Map();
  for(const p of sources) original.set(p,Array.from({length:supported.find(row=>'archive/exams/'+row.sourceArchiveFile===p).expectedQuestionCount},(_,index)=>({id:index+1,content:'Synthetic question '+(index+1),choices:['A','B'],answer:'A',solution:'Synthetic explanation',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',problemTypeKey:'PT_OLD',templateKey:'TPL_OLD',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',level:'중',difficultyBucket:3})));
  const oldAssets=[],newAssets=[];
  for(const [index,row] of supported.entries()){
    row.key='synthetic-'+index;row.sourcePath='archive/exams/'+row.sourceArchiveFile;
    oldAssets[index]=`archive/assets/fixture/${index}-old.svg`;newAssets[index]=`archive/assets/fixture/${index}-new.svg`;
    put(oldAssets[index],`<svg xmlns="http://www.w3.org/2000/svg"><text x="1" y="2">old ${index}</text></svg>`);
    Object.assign(original.get(row.sourcePath)[row.sourceOrdinal-1],{image:oldAssets[index].slice('archive/'.length),imageAlt:'original',imageSize:100,layoutTag:'original'});
  }
  for(const[p,bank]of original)put(p,sourceText(bank));const nativeBase=commit('synthetic original native sources');
  const rpmPath='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const rpmRecord={id:'M2-RPM-SYNTHETIC',curriculum:'2015',scope:'M2-2',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',ownerPack:'MIDDLE_GEOMETRY',rpmPath:{majorUnit:'Synthetic unit',midUnit:'Synthetic subunit',l3:'Synthetic concept',l4:'Synthetic method'}};
  const rpmRef=put(rpmPath,{records:[rpmRecord]});
  const nativeRows=new Map(),nativeDocuments=new Map(),nativeRefs=new Map();
  for(const p of sources){const bank=original.get(p),items=bank.map((q,i)=>({sourceOrdinal:i+1,questionUid:supported.find(s=>s.sourcePath===p&&s.sourceOrdinal===i+1)?.questionUid||`synthetic-${path.basename(p)}-${i+1}`,rpmDecision:'KEEP',fieldReview:{classification:'synthetic exact native',difficulty:'synthetic original'},primaryMethod:'Original native method',decisiveStep:'Original native step',after:{},finalDifficulty:{}}));
    for(const row of supported.filter(s=>s.sourcePath===p)){const item=items[row.sourceOrdinal-1];if(row.lane==='M2_FINALIZED_V3'){
      item.after={curriculum:'2015',problemTypeKey:'PT_OLD',templateKey:'TPL_OLD',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE'};
      item.rpmRecordId=rpmRecord.id;item.proposalRefs=['P1'];item.activeDefinitionMatch={problemTypeKey:'PT_OLD',templateKey:'TPL_OLD',problemTypeStatus:'ACTIVE',templateStatus:'ACTIVE',templateParent:'PT_OLD',exactBindings:[]};
    }else{item.rpmRecordId=rpmRecord.id;item.activeDefinitionMatch=null;item.fieldReview.binding='Synthetic independent existing primary required';item.after={standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE'};}nativeRows.set(row.questionUid,item);}
    const d={schemaVersion:'m2-s2-meta-review-v1',baseSha:nativeBase,sourceArchiveFile:p.slice('archive/exams/'.length),sourceGitBlobSha:fileRef(nativeBase,p).gitBlobSha1,reviewedQuestionCount:bank.length,owner:'native-author',items};
    if(p===supported[0].sourcePath)d.proposals=[{id:'P1',type:'CC',parent:'PT_OLD',definition:'Synthetic independently reviewed concept',supportingQuestionUids:[supported[0].questionUid],ordinals:[supported[0].sourceOrdinal]}];
    const reviewPath=`docs/native-${sources.indexOf(p)}.json`;nativeDocuments.set(p,d);nativeRefs.set(p,put(reviewPath,d));}
  const nativeCommit=commit('synthetic unchanged native source and complete native review');
  const prefigure=new Map([...original].map(([p,bank])=>[p,clone(bank)]));
  for(const row of supported){const q=prefigure.get(row.sourcePath)[row.sourceOrdinal-1],native=nativeRows.get(row.questionUid);if(row.lane==='M2_FINALIZED_V3')q.curriculum='2015';q.primaryMethod=native.primaryMethod;q.decisiveStep=native.decisiveStep;}
  for(const[p,bank]of prefigure)put(p,sourceText(bank));const prefigureCommit=commit('synthetic exact original native metadata transport');
  const current=new Map([...prefigure].map(([p,bank])=>[p,clone(bank)]));
  for(const[index,row]of supported.entries()){put(newAssets[index],`<svg xmlns="http://www.w3.org/2000/svg"><text x="3" y="4">new ${index}</text></svg>`);Object.assign(current.get(row.sourcePath)[row.sourceOrdinal-1],{image:newAssets[index].slice('archive/'.length),imageAlt:'new verified problem renderer',imageSize:220,layoutTag:'diagram'});}
  for(const[p,bank]of current)put(p,sourceText(bank));const publicBeforeLabel=commit('synthetic public renderer intersections');
  const oldPublicQ3Asset=newAssets[1];newAssets[1]='archive/assets/fixture/1-new-label.svg';put(newAssets[1],'<svg xmlns="http://www.w3.org/2000/svg"><text x="4" y="4">new 1</text></svg>');
  current.get(supported[1].sourcePath)[supported[1].sourceOrdinal-1].image=newAssets[1].slice('archive/'.length);
  for(const[p,bank]of current)put(p,sourceText(bank));
  const checkerPath='tools/synthetic-ui-checker.cjs',manifestPath='docs/synthetic-ui-inputs.json',identityPath='archive/data/question_identity_map.json';
  put(checkerPath,'// synthetic test-only checker bytes\n');put(manifestPath,{testOnly:true,questionUids:supported.map(s=>s.questionUid)});put(identityPath,{records:supported.map(s=>({questionUid:s.questionUid,sourceArchiveFile:s.sourceArchiveFile,sourceOrdinal:s.sourceOrdinal}))});
  const currentCommit=commit('synthetic label repair and exact student UI checkout');
  const originalReview={schemaVersion:'archive-independent-problem-renderer-review-v1',reviewer:'independent-observer',producerAndVerifierAreDifferent:true,newFullMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Count:0,rows:supported.map((row,index)=>({key:row.key,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,decision:index===1?'FAIL_NARROW_LABEL_CLEARANCE':'PASS_NARROW_PROBLEM_RENDERER_CONTINUITY',geometryAndGivenConditions:'PASS',newMetadataApproval:false,newDifficultyJudgment:false,newFullMathematicalQa:false,newReview2:false,beforeAsset:fileRef(prefigureCommit,oldAssets[index]),afterAsset:fileRef(publicBeforeLabel,index===1?oldPublicQ3Asset:newAssets[index]),sourceBinding:{beforeSourceRef:fileRef(prefigureCommit,row.sourcePath),currentSourceRef:fileRef(publicBeforeLabel,row.sourcePath)}}))};
  const labelReview={schemaVersion:'archive-independent-problem-renderer-label-repair-review-v1',reviewer:'independent-observer',producer:'separate-label-author',questionUid:supported[1].questionUid,sourceOrdinal:supported[1].sourceOrdinal,decision:'PASS_NARROW_PROBLEM_RENDERER_LABEL_REPAIR',producerAndVerifierAreDifferent:true,reversePatchByteExact:true,geometryAndTextAndDescriptionUnchanged:true,newFullMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Count:0,originalPublicAssetRef:fileRef(publicBeforeLabel,oldPublicQ3Asset),candidateAssetRef:{...fileRef(currentCommit,newAssets[1]),repositoryPath:newAssets[1]}};
  const technical={schemaVersion:'archive-problem-renderer-student-ui-preview-v2',status:'TECHNICAL_PASS_VISUAL_REVIEW_PENDING',executionOwner:'GITHUB_ACTIONS_SUPPORTED_CHROME',checkoutCommit:currentCommit,manifestRef:fileRef(currentCommit,manifestPath),checkerRef:fileRef(currentCommit,checkerPath),identityRef:fileRef(currentCommit,identityPath),mode:'exam',sourceOverlayCount:0,sourceOverlay:false,sourceWrites:0,problemOnlyScreenshots:true,solutionsOpened:false,newFullMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReviewPassCount:0,newFourSlotApprovals:0,failures:[],items:[],results:[]};
  for(const[index,row]of supported.entries()){
    const item={key:row.key,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceRef:fileRef(currentCommit,row.sourcePath),assetRef:fileRef(currentCommit,newAssets[index])};technical.items.push(item);
    for(const viewport of [{name:'desktop',width:1280,height:900},{name:'mobile',width:390,height:844}]){
      const height=row.sourceOrdinal===21&&viewport.name==='desktop'?1000:180;
      const spans=height>700?[[0,700],[668,height]]:[[0,height]],domSha256=sha('synthetic exact unchanged DOM '+index+viewport.name);
      const screenshots=spans.map((span,i)=>({tileIndex:i+1,path:`${row.key}-${viewport.name}-tile-${String(i+1).padStart(2,'0')}.png`,bytes:123+i,sha256:sha(`synthetic original tile ${index} ${viewport.name} ${i}`)}));
      const tiles=spans.map((span,i)=>({tileIndex:i+1,relativeInterval:span,filename:screenshots[i].path,clip:{x:30,y:100,width:300,height:span[1]-span[0]},scroll:{x:0,y:1900+span[0]},scrollOperations:1,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:100,foreignContentHits:0,domSha256}));
      const capture={schemaVersion:'archive-problem-scroll-coverage-v1',method:'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',tileLimit:8,overlapCssPixels:32,tileCount:tiles.length,content:{x:30,y:2000,width:300,height},question:{x:30,y:1990,width:300,height:height+20},viewport:{width:viewport.width,height:viewport.height},visibleChildren:3,coverage:{requiredInterval:[0,height],coveredInterval:[0,height],complete:true},tiles,scrollBefore:{x:0,y:0},scrollAfter:clone(tiles.at(-1).scroll),scrollOperations:tiles.length,domSha256,feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};
      technical.results.push({...clone(item),viewport,status:'PASS',visualReview:'PENDING',screenshots,capture,technical:{mode:'exam',questions:row.expectedQuestionCount,pages:8,readiness:'RENDER_READY',imagesComplete:true,mathErrors:0,unrenderedMath:0,mathJaxSource:'local',solutionNodes:0},geometry:{imageInsideQuestion:true,naturalWidth:200,naturalHeight:180,image:{width:180,height:160},questionNumber:String(row.sourceOrdinal)+'.'},pageErrors:[],requestFailures:[],externalRequests:[]});
    }
  }
  technical.expectedLogicalCases=technical.completedLogicalCases=6;
  technical.screenshotArtifacts=technical.results.flatMap(r=>r.screenshots.map(({tileIndex,...ref})=>ref)).sort((a,b)=>a.path.localeCompare(b.path));
  technical.screenshotArtifactCount=technical.screenshotArtifacts.length;
  technical.fontTransport='EXACT_STUDENT_GOOGLE_STYLESHEET_AND_ITS_DECLARED_NANUM_MYEONGJO_FILES';
  technical.externalFontResources=[{kind:'STYLESHEET',host:'fonts.googleapis.com',mime:'text/css'},{kind:'FONT',host:'fonts.gstatic.com',mime:'font/woff2'}].map((entry,index)=>{const value={...entry,urlSha256:sha('synthetic-font-url-'+index),sha256:sha('synthetic-font-response-'+index),bytes:123,status:200};return{...value,resourceId:sha(stable({urlSha256:value.urlSha256,responseSha256:value.sha256,mime:value.mime}))};});
  for(const row of technical.results){row.technical.fontReadiness={status:'loaded',family:'Nanum Myeongjo',weights:[400,700,800].map(weight=>({weight,loadedFaces:1,allLoaded:true,checked:true})),problemFontFamilies:['Nanum Myeongjo, serif']};row.technical.fontResourceIds=technical.externalFontResources.map(r=>r.resourceId);}
  const visual={schemaVersion:'archive-independent-m2-problem-renderer-student-ui-review-v2',scope:SCOPE,decision:'APPROVE_EXACT_STUDENT_UI_RENDERERS',reviewer:'independent-ui-observer',producerOwner:'synthetic-ui-producer',records:technical.results.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,viewport:r.viewport.name,screenshots:clone(r.screenshots),decision:'PASS',conditionsAndLabelsPreserved:true,legible:true,notClipped:true,completeProblemCoverage:true})),newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0};
  const document={schemaVersion:'archive-independent-m2-problem-renderer-continuity-v1',scope:SCOPE,decision:'APPROVE_EXACT_PROBLEM_RENDERER_CONTINUITY',reviewer:'independent-finalizer',rows:supported.map((row,index)=>({questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceArchiveFile:row.sourceArchiveFile,expectedQuestionCount:row.expectedQuestionCount,nativeReviewRef:{commit:nativeCommit,...nativeRefs.get(row.sourcePath)},nativeItemSha256:sha(stable(nativeRows.get(row.questionUid))),nativeReviewedSource:sourceRef(nativeBase,row.sourcePath,row.sourceOrdinal),nativeCommittedSource:sourceRef(nativeCommit,row.sourcePath,row.sourceOrdinal),prefigureSource:sourceRef(prefigureCommit,row.sourcePath,row.sourceOrdinal),currentSource:sourceRef(currentCommit,row.sourcePath,row.sourceOrdinal),nativeToPrefigureMetadata:delta(original.get(row.sourcePath)[row.sourceOrdinal-1],prefigure.get(row.sourcePath)[row.sourceOrdinal-1]).map(d=>({...d,authority:['primaryMethod','decisiveStep'].includes(d.field)?'NATIVE_ITEM_RATIONALE':'NATIVE_AFTER'})),prefigureToCurrentFields:delta(prefigure.get(row.sourcePath)[row.sourceOrdinal-1],current.get(row.sourcePath)[row.sourceOrdinal-1]),nativeAssets:[assetRef(nativeBase,oldAssets[index])],prefigureAssets:[assetRef(prefigureCommit,oldAssets[index])],currentAssets:[assetRef(currentCommit,newAssets[index])]})),newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReview2Claims:0,sourceWrites:0,canonicalWrites:0,actualMainRegistrationClaimed:false};
  const contexts=[];
  for(const row of supported){const question=clone(current.get(row.sourcePath)[row.sourceOrdinal-1]);if(row.lane==='M2_FINALIZED_V3')question.crossConceptKeys=['CC_FINAL'];
    const review={schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativeRefs.get(row.sourcePath).path,reviewRef:nativeRefs.get(row.sourcePath)};
    if(row.lane==='M2_FINALIZED_V3')review.proposalFinalization={schemaVersion:'archive-native-proposal-finalization-v3',scopeParentTransport:{schemaVersion:'archive-native-m2-finalized-scope-parent-v1'}};
    else Object.assign(review,{retainedFields:{schemaVersion:'archive-reviewed-native-retained-fields-v1',fields:['problemTypeKey','templateKey'],independentPrimary:{schemaVersion:'archive-reviewed-existing-primary-disposition-v1'}},retainedScopeTransport:{schemaVersion:'archive-reviewed-retained-scope-transport-v1',fields:['curriculum','curriculumKey','courseKey']}});
    const patch={questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceReview:review,after:{...question,sourceFingerprint:'f'.repeat(64)},before:{},evidenceRefs:[]};
    const request={scope:'PARTIAL_UIDS',sourceArchiveFile:row.sourceArchiveFile,expectedQuestionCount:row.expectedQuestionCount,approval:{type:'FINAL_QA',metadataReviewed:true,evidenceRefs:[]},registryChanges:[],items:[patch]};
    contexts.push({root,request,patch,question,row:nativeRows.get(row.questionUid),native:{review:nativeDocuments.get(row.sourcePath),spec:review,reviewer:'native-author',reviewedBank:clone(original.get(row.sourcePath)),committedBank:clone(original.get(row.sourcePath)),sourceBlob:fileRef(nativeBase,row.sourcePath).gitBlobSha1,committedBlob:fileRef(nativeCommit,row.sourcePath).gitBlobSha1},cache:new Map(),bankFromBytes:loadBank,studentPayload:q=>Object.fromEntries(['id','content','choices','answer','solution','image','imageSize','layoutTag'].map(k=>[k,Object.hasOwn(q,k)?q[k]:null]))});}
  const restoreLive=()=>{for(const[p,bank]of current)put(p,sourceText(bank));for(const ctx of contexts)if(ctx.patch.sourceReview.proposalFinalization){const bank=clone(current.get('archive/exams/'+ctx.request.sourceArchiveFile));bank[ctx.patch.sourceOrdinal-1]=clone(ctx.question);put('archive/exams/'+ctx.request.sourceArchiveFile,sourceText(bank));}for(const ctx of contexts)ctx.request.expectedSourceBlobSha1=blob(fs.readFileSync(path.join(root,'archive/exams/'+ctx.request.sourceArchiveFile)));};
  const reseal=()=>{
    // Commit only immutable witness/current input bytes; generated live metadata
    // is restored after sealing and is never substituted into a reviewed source.
    for(const[p,bank]of current)put(p,sourceText(bank));
    const originalRef=put('docs/original-independent.json',originalReview);
    labelReview.priorIndependentReviewRef={path:'/original-author-workspace/independent-review.json',sha256:originalRef.sha256,bytes:fs.statSync(path.join(root,originalRef.path)).size};
    const labelRef=put('docs/label-independent.json',labelReview),technicalRef=put('docs/technical-ui.json',technical);
    visual.technicalRef=technicalRef;const visualRef=put('docs/visual-ui.json',visual);
    for(const row of document.rows){row.originalReviewRefs=[originalRef,labelRef];row.studentUiTechnicalRef=technicalRef;row.studentUiVisualRef=visualRef;}
    const reviewRef=put('docs/renderer-continuity.json',document),reviewCommit=commit('synthetic exact renderer witness');
    for(const ctx of contexts){ctx.patch.sourceReview.m2ProblemRendererContinuity={schemaVersion:M2_PROBLEM_RENDERER_SCHEMA,reviewCommit,reviewRef};
      ctx.request.approval.evidenceRefs=ctx.patch.evidenceRefs=[ctx.native.spec.reviewRef,originalRef,labelRef,technicalRef,visualRef,reviewRef];ctx.cache=new Map();}
    restoreLive();
  };
  reseal();return{root,contexts,document,technical,visual,originalReview,labelReview,supported,oldAssets,newAssets,original,prefigure,current,nativeRows,nativeRefs,nativeDocuments,nativeBase,nativeCommit,prefigureCommit,currentCommit,rpmPath,rpmRecord,rpmRef,put,git,commit,fileRef,sourceRef,reseal,restoreLive};
}

async function finalizedSourceFixture(t) {
  const f=await fixture(t),ctx=f.contexts[0],uid=ctx.patch.questionUid,ordinal=ctx.patch.sourceOrdinal;
  const CANON='archive/data/meta-foundation/canonical/',packRoot=CANON+'packs/middle-geometry/';
  const native=f.nativeRows.get(uid),proposal=f.nativeDocuments.get(f.supported[0].sourcePath).proposals[0];
  const selection={documentRef:f.nativeRefs.get(f.supported[0].sourcePath),index:0,proposalSha256:sha(stable(proposal)),questionUid:uid,sourceOrdinal:ordinal,proposalId:'P1'};
  const pt={problemTypeKey:'PT_OLD',canonicalLabelKo:'Synthetic parent',definition:'Existing synthetic primary',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const tpl={templateKey:'TPL_OLD',parentProblemTypeKey:'PT_OLD',canonicalLabelKo:'Synthetic method',definition:'Existing synthetic method',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const binding={curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-05',subUnitKey:'M2-05-TRIANGLE_PROPERTIES',problemTypeKey:'PT_OLD',ownerPack:'MIDDLE_GEOMETRY',status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const concept={conceptKey:'CC_FINAL',canonicalLabelKo:'Synthetic reviewed concept',definition:proposal.definition,ownerConceptShard:'PLANE_GEOMETRY',status:'ACTIVE',supportingQuestionUids:[uid],supportingItemCount:1};
  const change={path:CANON+'concepts/plane-geometry.json',collection:'concepts',match:{conceptKey:'CC_FINAL'},before:null,after:concept};
  const snapshotRef=f.sourceRef(f.prefigureCommit,f.supported[0].sourcePath,ordinal),snapshot={commit:snapshotRef.commit,sourcePath:snapshotRef.path,blob:snapshotRef.gitBlobSha1,sha256:snapshotRef.sha256,questionSha256:snapshotRef.questionSha256};
  const rendererAssets=f.document.rows[0].prefigureAssets.map(({bytes,...a})=>({...a,visuallyInspected:true}));
  const primary=Object.fromEntries(['standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey'].map(k=>[k,ctx.question[k]]));
  const nativeRef={commit:f.nativeCommit,...f.nativeRefs.get(f.supported[0].sourcePath)},choice={selection,disposition:'ADD_ONLY',reason:'Synthetic exact independent definition',definition:concept,registryChange:change};
  const row={examId:'E005',questionUid:uid,sourceOrdinal:ordinal,sourcePath:snapshot.sourcePath,nativeReviewRef:nativeRef,nativeItemStableSha256:sha(stable(native)),nativeProposal:proposal,proposalSelection:selection,nativeAfter:clone(native.after),nativeActiveDefinitionMatch:clone(native.activeDefinitionMatch),nativeRpmContext:{...f.rpmRef,record:f.rpmRecord},sourceSnapshot:snapshot,rendererAssets,textOnlyItem:false,protectedPayloadFieldsUnchanged:true,reviewedPrimaryContext:primary,decision:choice,independentRationale:'Synthetic independent original metadata authority',newFullMathematicalQa:false,newReview2:false,newMetadataApproval:false,newDifficultyJudgment:false,sourceWrites:0};
  const definitionWitness={schemaVersion:'archive-independent-m2-native-definition-finalization-v1',decision:'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS',reviewer:'independent-definition-reviewer',currentMainChecked:snapshot.commit,newFullMathematicalQa:false,newReview2Claims:0,newMetadataApprovals:0,newDifficultyJudgments:0,existingDefinitionsModified:0,sourceWrites:0,canonicalWrites:0,officialCompilerResolverConsumerStillRequired:true,actualMainRegistrationClaimed:false,approvedRegistryChanges:[change],rows:[row]};
  const witnessRef=f.put('docs/synthetic-definition-review.json',definitionWitness);
  const app={examId:row.examId,questionUid:uid,sourceOrdinal:ordinal,sourcePath:snapshot.sourcePath,nativeReviewRef:nativeRef,nativeItemStableSha256:row.nativeItemStableSha256,sourceSnapshot:snapshot,rendererAssets,reviewedPrimaryContext:primary,reviewer:definitionWitness.reviewer,reason:row.independentRationale,proposalSelections:[selection],decisions:[choice],newMathematicalQa:false,newMetadataApproval:false,difficultyChanged:false,nativeProtectedStudentFieldsChanges:[],independentReviewRef:witnessRef};
  const disposition={schemaVersion:'archive-independent-m2-native-proposal-disposition-v1',status:'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING',scope:{newFullMathematicalQa:false,newReview2Claims:0,newMetadataApprovals:0,newDifficultyJudgments:0,newSourceContentEdits:0},applications:[app]},dispositionRef=f.put('docs/synthetic-definition-disposition.json',disposition),finalizationCommit=f.commit('synthetic separate original definition authority');
  const masterPath='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',master={records:[{curriculum:'2015',scope:'M2-2',majorUnit:f.rpmRecord.rpmPath.majorUnit,midUnit:f.rpmRecord.rpmPath.midUnit,defaultSelectable:true,concepts:[{concept:f.rpmRecord.rpmPath.l3,defaultSelectable:true,problemTypes:[{problemType:f.rpmRecord.rpmPath.l4,defaultSelectable:true}]}]}]},masterRef=f.put(masterPath,master);
  const fp=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,answer:q.answer??null,solution:q.solution??null,image:q.image??null}));
  const body=q=>sha(JSON.stringify({content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null}));
  const original=f.original.get(f.supported[0].sourcePath)[ordinal-1],metadata={questionUid:uid,sourceArchiveFile:ctx.request.sourceArchiveFile,sourceOrdinal:ordinal,sourceQuestionNo:ordinal,sourceFingerprint:fp(original),contentFingerprint:body(original),...primary,reviewStatus:'review_required'};
  const after={...primary,standardUnit:'Synthetic unit',subUnit:'Synthetic subunit',level:'중',curriculum:'2015',courseKey:'M2-2',crossConceptKeys:['CC_FINAL'],conditionKeys:[],integrationPattern:'NONE',primaryMethod:native.primaryMethod,decisiveStep:native.decisiveStep,sourceFingerprint:fp(ctx.question),contentFingerprint:body(ctx.question)};
  Object.assign(metadata,{standardUnit:after.standardUnit,subUnit:after.subUnit,level:'중',difficultyBucket:3});
  ctx.patch.after=after;ctx.patch.before=Object.fromEntries(Object.keys(after).map(k=>[k,metadata[k]??null]));ctx.patch.identityBefore={sourceFingerprint:fp(original)};
  ctx.patch.targetParentRef={...masterRef,curriculum:'2015',scope:'M2-2',majorUnit:master.records[0].majorUnit,midUnit:master.records[0].midUnit,finalizedScopeParent:{schemaVersion:'archive-native-m2-finalized-scope-parent-v1'}};
  ctx.patch.sourceReview.proposalFinalization={schemaVersion:'archive-native-proposal-finalization-v3',finalizationCommit,finalizationRef:dispositionRef,proposalSelections:[selection],scopeParentTransport:{schemaVersion:'archive-native-m2-finalized-scope-parent-v1'}};
  ctx.patch.evidenceRefs=ctx.request.approval.evidenceRefs=[...ctx.patch.evidenceRefs,witnessRef,dispositionRef,masterRef];
  ctx.request.registryChanges=[{...change,evidenceRefs:[witnessRef,dispositionRef]}];ctx.request.schemaVersion='archive-reviewed-exam-meta-register-request-v2';ctx.request.requestId='synthetic-m2-renderer-v3';ctx.request.examUid='synthetic-exam';ctx.request.partialUidCount=1;ctx.request.approval.approvedBy='synthetic-approved-definition';ctx.patch.reason='Synthetic original metadata with separately verified renderer';
  const pack={meta:{schemaVersion:'meta-foundation-pack-v1',packId:'MIDDLE_GEOMETRY',packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중2 수학','M2-2']}},key=stable(['2015','중2 수학','M2-05','M2-05-TRIANGLE_PROPERTIES','PT_OLD']);
  ctx.canonicalBefore={pt:new Map([['PT_OLD',pt]]),tpl:new Map([['TPL_OLD',tpl]]),cc:new Map(),bindings:new Map([[key,binding]]),packs:new Map([['MIDDLE_GEOMETRY',pack]])};ctx.canonicalAfter={...ctx.canonicalBefore,cc:new Map([['CC_FINAL',concept]])};ctx.metadata=metadata;ctx.final={...metadata,...after,curriculumKey:'2015'};
  const ids=[];for(const[p,bank]of f.original)for(const[qIndex,q]of bank.entries()){const u=f.nativeDocuments.get(p).items[qIndex].questionUid;ids.push({questionUid:u,sourceArchiveFile:p.slice('archive/exams/'.length),sourceOrdinal:qIndex+1,sourceQuestionNo:qIndex+1,sourceFingerprint:fp(q),contentFingerprint:body(q)});}
  f.put('archive/data/question_metadata.json',{records:ids.map(r=>r.questionUid===uid?metadata:{...r,reviewStatus:'review_required'}),counts:{}});f.put('archive/data/question_identity_map.json',{records:ids});
  f.put(CANON+'registry_index.json',{status:'ACTIVE',activePacks:[{id:'MIDDLE_GEOMETRY',version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[{id:'PLANE_GEOMETRY',version:'1.0.0',status:'ACTIVE'}],conditionRegistry:{id:'CONDITION_CORE',version:'1.0.0',status:'ACTIVE'},canonicalSources:[{path:CANON+'condition_registry.json'},{path:CANON+'metadata_rules.json'},...['pack','taxonomy','bindings','aliases'].map(n=>({path:packRoot+n+'.json'})),{path:CANON+'concepts/plane-geometry.json'}],compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:'archive/data/meta-foundation/compiled/'+n+'.json'}))});
  f.put(packRoot+'pack.json',pack.meta);f.put(packRoot+'taxonomy.json',{status:'ACTIVE',problemTypes:[pt],templates:[tpl]});f.put(packRoot+'bindings.json',{status:'ACTIVE',bindings:[binding]});f.put(packRoot+'aliases.json',{aliases:[]});f.put(CANON+'concepts/plane-geometry.json',{shardId:'PLANE_GEOMETRY',shardVersion:'1.0.0',concepts:[]});f.put(CANON+'condition_registry.json',{status:'ACTIVE',schemaVersion:'meta-foundation-condition-registry-v1',owner:'CONDITION_CORE',conditions:[],conditionCount:0});
  f.put(CANON+'metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL']});
  f.put('archive/data/master_tables/js_archive_tag_master.json',[{key:'M2-05',keyType:'standardUnitKey',labelKo:'Synthetic unit',status:'active'},{key:'M2-05-TRIANGLE_PROPERTIES',keyType:'subUnitKey',parentKey:'M2-05',standardUnitKey:'M2-05',labelKo:'Synthetic subunit',status:'active'}]);fs.mkdirSync(path.join(f.root,'archive/data/meta-foundation/runtime'),{recursive:true});
  return{...f,ctx,metadata,after,definitionWitness,disposition,witnessRef,dispositionRef,master,masterRef,fp,body};
}

async function retainedSourceFixture(t) {
 const f=await finalizedSourceFixture(t),{REASSESSED_STUDENT_FIELDS}=await import('../archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
 const primaryFields=['standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey'];
 const pt=f.ctx.canonicalBefore.pt.get('PT_OLD'),tpl=f.ctx.canonicalBefore.tpl.get('TPL_OLD'),binding=[...f.ctx.canonicalBefore.bindings.values()][0];
 const taxPath='archive/data/meta-foundation/compiled/taxonomy_registry.json',bindingPath='archive/data/meta-foundation/compiled/curriculum_bindings.json';
 f.put(taxPath,{problemTypes:[pt],templates:[tpl]});f.put(bindingPath,{bindings:[binding]});
 for(const[p,bank]of f.prefigure)f.put(p,sourceText(bank));const snapshotCommit=f.commit('synthetic independent retained original source and ACTIVE definitions');
 const convert=(c,p,o)=>{const{gitBlobSha1,questionSha256,...ref}=f.sourceRef(c,p,o);return{...ref,blob:gitBlobSha1,questionStableSha256:questionSha256};};
 const core=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,Object.hasOwn(q,k)?q[k]:null]));
 const apps=f.supported.slice(1).map((item,index)=>{
  const native=f.nativeRows.get(item.questionUid),q=f.prefigure.get(item.sourcePath)[item.sourceOrdinal-1];
  const file=p=>{const{gitBlobSha1,bytes,...ref}=f.fileRef(snapshotCommit,p);return{...ref,blob:gitBlobSha1};};
  return{questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,nativeReviewRef:{commit:f.nativeCommit,...f.nativeRefs.get(item.sourcePath)},
   nativeItemStableSha256:sha(stable(native)),nativeAfterSha256:sha(stable(native.after)),nativeActiveDefinitionMatchSha256:sha(stable(native.activeDefinitionMatch)),
   nativeActiveDefinitionMatchDisposition:'Original null preserved; separately reviewed existing primary only',originalNativeAfterPreserved:true,
   sourcePayloadChangeApproved:false,newMathematicalQa:false,newReview2:false,newDifficultyApproval:false,decision:'APPROVED_EXISTING_PRIMARY',rationale:'Synthetic independently checked exact existing primary',
   immutableSourceBefore:convert(f.nativeBase,item.sourcePath,item.sourceOrdinal),immutableReviewedSource:convert(f.nativeCommit,item.sourcePath,item.sourceOrdinal),currentSource:convert(snapshotCommit,item.sourcePath,item.sourceOrdinal),
   studentPayloadFields:REASSESSED_STUDENT_FIELDS,studentPayloadSha256:sha(stable(core(q))),canonicalRefs:{taxonomy:file(taxPath),bindings:file(bindingPath)},
   existingPrimary:{problemTypeKey:'PT_OLD',templateKey:'TPL_OLD',problemTypeRecordSha256:sha(stable(pt)),templateRecordSha256:sha(stable(tpl)),bindingRecordSha256:sha(stable(binding)),
    exactBinding:{curriculum:'2015',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,problemTypeKey:q.problemTypeKey,status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY'},
    uidExplicitlySupportedByProblemType:false,uidExplicitlySupportedByTemplate:false,uidExplicitlySupportedByBinding:false},allowedRetentionFields:['problemTypeKey','templateKey'],approvedValues:{problemTypeKey:'PT_OLD',templateKey:'TPL_OLD'},
   rendererReview:'Synthetic original renderer independently inspected',rendererAssets:f.document.rows[index+1].prefigureAssets.map(({bytes,...a})=>({...a,visuallyInspected:true}))};
 });
 const independent={schemaVersion:'archive-independent-existing-primary-disposition-v1',scope:'EXISTING_PRIMARY_RETENTION_ONLY',reviewerRole:'independent',reviewerOwner:'separate-retained-author',sourceWrites:0,canonicalWrites:0,newDefinitions:0,newMathematicalQa:false,newReview2:false,newDifficultyApproval:false,officialRegistrationRequired:true,actualMainRegistered:false,canonicalSnapshotCommit:snapshotCommit,applications:apps};
 const independentRef=f.put('docs/retained-original-independent.json',independent),independentCommit=f.commit('synthetic original retained independent authority');f.restoreLive();
 const metadataPath='archive/data/question_metadata.json',md=JSON.parse(fs.readFileSync(path.join(f.root,metadataPath)));
 const familyContexts=f.contexts.slice(1).map(ctx=>{
  const item=f.supported.find(s=>s.questionUid===ctx.patch.questionUid),original=f.original.get(item.sourcePath)[item.sourceOrdinal-1],native=f.nativeRows.get(item.questionUid);
  const metadata={questionUid:item.questionUid,sourceArchiveFile:item.sourceArchiveFile,sourceOrdinal:item.sourceOrdinal,sourceQuestionNo:item.sourceOrdinal,sourceFingerprint:f.fp(original),contentFingerprint:f.body(original),
   ...Object.fromEntries(primaryFields.map(k=>[k,original[k]])),standardUnit:'Synthetic unit',subUnit:'Synthetic subunit',level:'중',difficultyBucket:3,reviewStatus:'review_required'};
  const after={...Object.fromEntries(primaryFields.map(k=>[k,original[k]])),standardUnit:'Synthetic unit',subUnit:'Synthetic subunit',level:'중',curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2',
   L1:f.rpmRecord.rpmPath.majorUnit,L2:f.rpmRecord.rpmPath.midUnit,crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',primaryMethod:native.primaryMethod,decisiveStep:native.decisiveStep,sourceFingerprint:f.fp(ctx.question),contentFingerprint:f.body(ctx.question)};
  Object.assign(ctx.patch,{after,before:Object.fromEntries(Object.keys(after).map(k=>[k,metadata[k]??null])),identityBefore:{sourceFingerprint:f.fp(original)},reason:'Synthetic retained primary with separate exact renderer continuity',
   targetParentRef:{path:f.masterRef.path,curriculum:'2015',scope:'M2-2',majorUnit:f.rpmRecord.rpmPath.majorUnit,midUnit:f.rpmRecord.rpmPath.midUnit}});
  ctx.patch.sourceReview.retainedFields.independentPrimary={schemaVersion:'archive-reviewed-existing-primary-disposition-v1',reviewCommit:independentCommit,reviewRef:independentRef};
  ctx.patch.evidenceRefs=[...ctx.patch.evidenceRefs,f.rpmRef,f.masterRef,independentRef];
  ctx.metadata=metadata;ctx.final={...metadata,...after};ctx.canonicalBefore={...f.ctx.canonicalBefore,master:new Map(JSON.parse(fs.readFileSync(path.join(f.root,'archive/data/master_tables/js_archive_tag_master.json'))).map(r=>[r.key,r]))};ctx.canonicalAfter=ctx.canonicalBefore;
  md.records[md.records.findIndex(r=>r.questionUid===item.questionUid)]=metadata;return ctx;
 });
 const request={...familyContexts[0].request,schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-m2-renderer-retained',examUid:'synthetic-family-exam',partialUidCount:2,
  approval:{...familyContexts[0].request.approval,approvedBy:'synthetic-original-independent-primary',evidenceRefs:familyContexts[0].patch.evidenceRefs},registryChanges:[],items:familyContexts.map(ctx=>ctx.patch)};
 for(const ctx of familyContexts)ctx.request=request;f.put(metadataPath,md);
 return{...f,ctx:familyContexts[0],familyContexts,request,independent,independentRef};
}

test('M2 renderer retains original independent primary and exact native scope for both family items',async t=>{
 const f=await retainedSourceFixture(t),{validateReviewedSourceReassessment}=await import('../archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
 for(const ctx of f.familyContexts){const proof=validateReviewedSourceReassessment(ctx);assert.equal(proof.m2ProblemRendererContinuity.memoryOnlyNormalization,true);assert.equal(proof.retainedNativeFields.independentPrimary.originalNativeMatchPreserved,true);assert.equal(proof.retainedScopeTransport.fields,undefined);assert.equal(proof.retainedScopeTransport.nativeCourseField,'records[0].scope');}
});

test('M2 renderer official retained pair writes and replays original independent authority with no canonical changes',async t=>{
 const f=await retainedSourceFixture(t),{registerReviewedExamV2}=await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).totalQuestions,2);
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).totalQuestions,2);
 assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).replay,true);
 const r=JSON.parse(fs.readFileSync(path.join(f.root,'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+f.request.requestId+'.json')));
 assert.deepEqual(r.registryChanges,[]);assert.equal(r.fingerprintRepairs.length,2);
 for(const repair of r.fingerprintRepairs){assert.equal(repair.sourceReview.m2ProblemRendererContinuity.memoryOnlyNormalization,true);assert.equal(repair.sourceReview.retainedNativeFields.independentPrimary.originalNativeMatchPreserved,true);}
 const old=fs.readFileSync(path.join(f.root,f.oldAssets[1]));fs.appendFileSync(path.join(f.root,f.oldAssets[1]),'<!-- changed -->');
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/renderer|asset|source-review|source review|changed|mismatch/);
 fs.writeFileSync(path.join(f.root,f.oldAssets[1]),old);assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).replay,true);
});

test('M2 renderer comparison replays the original v3 and exact scope-parent authority',async t=>{
 const f=await finalizedSourceFixture(t),{validateReviewedSourceReassessment}=await import('../archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
 const sourcePath='archive/exams/'+f.ctx.request.sourceArchiveFile,before=sha(fs.readFileSync(path.join(f.root,sourcePath)));
 const proof=validateReviewedSourceReassessment(f.ctx);
 assert.equal(proof.m2ProblemRendererContinuity.memoryOnlyNormalization,true);
 assert.equal(proof.proposalFinalization.scopeParentTransport.parent.courseKey,'M2-2');
 assert.equal(proof.proposalFinalization.scopeParentTransport.nativeCurriculumCarry.newCurriculumJudgment,false);
 assert.equal(sha(fs.readFileSync(path.join(f.root,sourcePath))),before);
});

test('M2 renderer official write and replay retain both original and current proof obligations',async t=>{
 const f=await finalizedSourceFixture(t),{registerReviewedExamV2}=await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
 const dry=registerReviewedExamV2({root:f.root,request:f.ctx.request});assert.equal(dry.totalQuestions,1);
 const written=registerReviewedExamV2({root:f.root,request:f.ctx.request,write:true});assert.equal(written.totalQuestions,1);
 const replay=registerReviewedExamV2({root:f.root,request:f.ctx.request,write:true});assert.equal(replay.status,'PASS');assert.equal(replay.replay,true);
 const p='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+f.ctx.request.requestId+'.json',r=JSON.parse(fs.readFileSync(path.join(f.root,p)));
 assert.equal(r.fingerprintRepairs[0].sourceReview.m2ProblemRendererContinuity.memoryOnlyNormalization,true);
 assert.equal(r.fingerprintRepairs[0].sourceReview.proposalFinalization.scopeParentTransport.nativeCurriculumCarry.newCurriculumJudgment,false);
 const sidecar=p.replace(/\.json$/,'.source-review-binding.json');assert(r.appliedRecords[0].approvalEvidence.includes(sidecar));assert(r.runtimeRecords[0].approvalEvidence.includes(sidecar));
 const bytes=fs.readFileSync(path.join(f.root,f.oldAssets[0]));fs.appendFileSync(path.join(f.root,f.oldAssets[0]),'<!-- changed -->');
 assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.ctx.request,write:true}),/renderer|asset|source-review|source review|mismatch|changed/);
 fs.writeFileSync(path.join(f.root,f.oldAssets[0]),bytes);assert.equal(registerReviewedExamV2({root:f.root,request:f.ctx.request,write:true}).replay,true);
});

async function issuedFinalizedFixture(t, familyOrdinal) {
 const f=familyOrdinal?await retainedSourceFixture(t):await finalizedSourceFixture(t);
 if(familyOrdinal)f.ctx=f.familyContexts.find(ctx=>ctx.patch.sourceOrdinal===familyOrdinal);
 const {registerReviewedExamV2}=await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
 registerReviewedExamV2({root:f.root,request:f.ctx.request,write:true});
 const {loadActiveMetaRegistry,validateActiveMetaFields}=await import('../archive/tools/meta-foundation/active-registry.mjs');
 const {planQuestion}=await import('../archive/tools/meta-foundation/auto-register-merged-source.mjs');
 const read=p=>JSON.parse(fs.readFileSync(path.join(f.root,p)));
 const source=f.ctx.request.sourceArchiveFile,raw=fs.readFileSync(path.join(f.root,'archive/exams/'+source)),bank=loadBank(raw);
 const identityMap=read('archive/data/question_identity_map.json'),uid=f.ctx.patch.questionUid,ordinal=f.ctx.patch.sourceOrdinal;
 const current=read('archive/data/question_metadata.json').records.find(row=>row.questionUid===uid),identity=identityMap.records.find(row=>row.questionUid===uid);
 const runtime=read('archive/data/meta-foundation/runtime/middle-geometry-v1.json');
 const registry=loadActiveMetaRegistry(f.root);assert.equal(registry.status,'ACTIVE',JSON.stringify(registry.errors));
 const context={question:bank[ordinal-1],current,identity,registry,validate:validateActiveMetaFields,source,ordinal,runtimeOwner:'MIDDLE_GEOMETRY',
  nativeSource:{root:f.root,bytes:raw,blobSha1:blob(raw),bank,identityMap,identityByJoin:new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r])),runtimeRecord:runtime.records.find(r=>r.questionUid===uid),runtimeStatus:runtime.status}};
 const receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+f.ctx.request.requestId+'.json';
 return{...f,read,context,planQuestion,registry,receiptPath,sidecarPath:receiptPath.replace(/\.json$/,'.source-review-binding.json'),old:f.prefigure.get('archive/exams/'+source)[ordinal-1],
  evaluate(previous){return planQuestion({...context,previous});}};
}

test('M2 renderer issued native approval reuses only exact original or prefigure old cursors and caught-up state',async t=>{
 const f=await issuedFinalizedFixture(t);
 for(const previous of [f.old,f.original.get('archive/exams/'+f.context.source)[f.context.ordinal-1],f.context.question]){
  const result=f.evaluate(previous);assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,f.receiptPath);
 }
 const changed=clone(f.old);changed.imageAlt+=' unreviewed';const bad=f.evaluate(changed);
 assert.equal(bad.status,'SUPPLEMENT_PENDING');assert.equal(bad.nativeReviewReceipt,undefined);
});

for(const kind of ['MISSING_RECEIPT','MISSING_SIDECAR','MISSING_ISSUED_RENDERER_PROOF','CHANGED_CURRENT_ASSET','CHANGED_ORIGINAL_ASSET','MISSING_UI_VISUAL_WITNESS','MISSING_CURRENT_PARENT'])
 test('M2 renderer issued native approval refuses '+kind+' at old and caught-up cursors',async t=>{
  const f=await issuedFinalizedFixture(t),r=f.read(f.receiptPath),files=new Map();
  const alter=(p,change)=>{const full=path.join(f.root,p),raw=fs.readFileSync(full);files.set(p,raw);if(change===null)fs.unlinkSync(full);else fs.writeFileSync(full,change(raw));};
  assert.equal(f.evaluate(f.old).status,'ALREADY_REGISTERED');assert.equal(f.evaluate(f.context.question).status,'ALREADY_REGISTERED');
  if(kind==='MISSING_RECEIPT')alter(f.receiptPath,null);
  else if(kind==='MISSING_SIDECAR')alter(f.sidecarPath,null);
  else if(kind==='MISSING_ISSUED_RENDERER_PROOF')alter(f.receiptPath,raw=>{const d=JSON.parse(raw);delete d.fingerprintRepairs[0].sourceReview.m2ProblemRendererContinuity;return JSON.stringify(d,null,2)+'\n';});
  else if(kind==='CHANGED_CURRENT_ASSET')alter(f.newAssets[0],raw=>Buffer.concat([raw,Buffer.from('<!-- changed -->')]));
  else if(kind==='CHANGED_ORIGINAL_ASSET')alter(f.oldAssets[0],raw=>Buffer.concat([raw,Buffer.from('<!-- changed -->')]));
  else if(kind==='MISSING_UI_VISUAL_WITNESS')alter('docs/visual-ui.json',null);
  else alter(f.masterRef.path,null);
  for(const previous of [f.old,f.context.question]){const result=f.evaluate(previous);assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,undefined);}
  for(const[p,raw]of files)fs.writeFileSync(path.join(f.root,p),raw);
  assert.equal(f.evaluate(f.old).status,'ALREADY_REGISTERED');assert.equal(f.evaluate(f.context.question).status,'ALREADY_REGISTERED');
 });

for(const ordinal of [3,21])test('M2 retained renderer exact original and current proof survive old and caught-up cursors for Q'+ordinal,async t=>{
 const f=await issuedFinalizedFixture(t,ordinal);
 for(const previous of [f.old,f.original.get('archive/exams/'+f.context.source)[ordinal-1],f.context.question]){
  const result=f.evaluate(previous);assert.equal(result.status,'ALREADY_REGISTERED',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,f.receiptPath);
 }
 const protectedPaths=[f.sidecarPath,f.independentRef.path,f.oldAssets[ordinal===3?1:2],f.newAssets[ordinal===3?1:2]];
 for(const p of protectedPaths){const raw=fs.readFileSync(path.join(f.root,p));fs.unlinkSync(path.join(f.root,p));
  for(const previous of [f.old,f.context.question]){const result=f.evaluate(previous);assert.equal(result.status,'SUPPLEMENT_PENDING',JSON.stringify(result));assert.equal(result.nativeReviewReceipt,undefined);}
  fs.writeFileSync(path.join(f.root,p),raw);assert.equal(f.evaluate(f.old).status,'ALREADY_REGISTERED');assert.equal(f.evaluate(f.context.question).status,'ALREADY_REGISTERED');
 }
});

test('M2 renderer comparison validates three independent original/UI witnesses without mutating inputs', async t=>{
 const f=await fixture(t),{validateM2ProblemRendererContinuity}=await adapter;
 const protectedFiles=[...f.current.keys(),...f.oldAssets,...f.newAssets,'docs/renderer-continuity.json','docs/original-independent.json','docs/label-independent.json','docs/technical-ui.json','docs/visual-ui.json'];
 const before=Object.fromEntries(protectedFiles.map(p=>[p,sha(fs.readFileSync(path.join(f.root,p)))]));
 for(const ctx of f.contexts){const q=clone(ctx.question),result=validateM2ProblemRendererContinuity(ctx);assert.equal(result.proof.memoryOnlyNormalization,true);assert.equal(result.proof.newMetadataApprovals,0);
  assert.deepEqual(ctx.question,q);assert.deepEqual(ctx.studentPayload(result.normalizedQuestion),ctx.studentPayload(ctx.native.reviewedBank[ctx.patch.sourceOrdinal-1]));assert.equal(Object.hasOwn(result.normalizedPatch.sourceReview,'m2ProblemRendererContinuity'),false);assert.equal(result.proof.ui.screenshots.length,6);assert.equal(result.proof.ui.screenshotArtifactCount,7);}
 assert.deepEqual(Object.fromEntries(protectedFiles.map(p=>[p,sha(fs.readFileSync(path.join(f.root,p)))])),before);
});

const resealedNegatives=[
 ['legacy v1 technical evidence',f=>{f.technical.schemaVersion='archive-problem-renderer-student-ui-preview-v1';}],
 ['legacy v1 independent review',f=>{f.visual.schemaVersion='archive-independent-m2-problem-renderer-student-ui-review-v1';}],
 ['legacy single screenshot alias',f=>{f.technical.results[0].screenshot=clone(f.technical.results[0].screenshots[0]);}],
 ['logical completed count',f=>{f.technical.completedLogicalCases=5;}],
 ['logical expected count',f=>{f.technical.expectedLogicalCases=7;}],
 ['PNG missing inventory item',f=>{f.technical.screenshotArtifacts.pop();}],
 ['PNG duplicate inventory item',f=>{f.technical.screenshotArtifacts[1]=clone(f.technical.screenshotArtifacts[0]);}],
 ['PNG changed bytes inventory',f=>{f.technical.screenshotArtifacts[0].bytes++;}],
 ['PNG changed SHA inventory',f=>{f.technical.screenshotArtifacts[0].sha256='0'.repeat(64);}],
 ['PNG count disagrees with original tiles',f=>{f.technical.screenshotArtifactCount++;}],
 ['extra tile in visual review',f=>{f.visual.records[0].screenshots.push(clone(f.visual.records[0].screenshots[0]));}],
 ['tile index alias',f=>{f.technical.results[0].screenshots[0].tileIndex=2;}],
 ['tile filename alias',f=>{f.technical.results[0].screenshots[0].path='foreign.png';}],
 ['tile file count',f=>{f.technical.results[0].capture.tileCount=2;}],
 ['tile bound above eight',f=>{f.technical.results[0].capture.tileLimit=9;}],
 ['wrong coverage schema',f=>{f.technical.results[0].capture.schemaVersion='synthetic-unknown';}],
 ['resized screenshot method',f=>{f.technical.results[0].capture.method='RESIZED_VIEWPORT';}],
 ['missing complete independent coverage',f=>{f.visual.records[0].completeProblemCoverage=false;}],
 ['false claimed content coverage',f=>{f.technical.results[0].capture.coverage.coveredInterval[0]=1;}],
 ['top content gap',f=>{f.technical.results[0].capture.tiles[0].relativeInterval[0]=1;}],
 ['bottom content gap',f=>{f.technical.results[0].capture.tiles[0].relativeInterval[1]--;}],
 ['wrong exact overlap',f=>{f.technical.results.find(r=>r.capture.tiles.length===2).capture.tiles[1].relativeInterval[0]++;}],
 ['reordered original tiles',f=>{f.technical.results.find(r=>r.capture.tiles.length===2).capture.tiles.reverse();}],
 ['tile scroll coordinate mismatch',f=>{f.technical.results[0].capture.tiles[0].scroll.y++;}],
 ['tile viewport clipping',f=>{f.technical.results[0].capture.tiles[0].clip.y=899;}],
 ['tile hidden content substitution',f=>{f.technical.results[0].capture.tiles[0].clip.width--;}],
 ['tile blocked by chrome',f=>{f.technical.results[0].capture.tiles[0].obstructionsIntersectingClip=1;}],
 ['tile DOM changed',f=>{f.technical.results[0].capture.tiles[0].domSha256='0'.repeat(64);}],
 ['tile hit-test unavailable',f=>{f.technical.results[0].capture.tiles[0].hitTestSamples=0;}],
 ['tile foreign content',f=>{f.technical.results[0].capture.tiles[0].foreignContentHits=1;}],
 ['tile render feedback active',f=>{f.technical.results[0].capture.tiles[0].feedbackIdle=false;}],
 ['scroll end inconsistent',f=>{f.technical.results[0].capture.scrollAfter.y++;}],
 ['scroll operation count inconsistent',f=>{f.technical.results[0].capture.scrollOperations++;}],
 ['changed viewport',f=>{f.technical.results[0].capture.viewport.width++;}],
 ['student CSS changed',f=>{f.technical.results[0].capture.cssWrites=1;}],
 ['student DOM changed',f=>{f.technical.results[0].capture.domWrites=1;}],
 ['viewport resized',f=>{f.technical.results[0].capture.viewportChanges=1;}],
 ['composite image substituted',f=>{f.technical.results[0].capture.compositeImageCreated=true;}],
 ['child envelope exceeds question',f=>{f.technical.results[0].capture.content.width++;}],
 ['independent metadata approval',f=>{f.document.newMetadataApprovals=1;}],
 ['independent mathematics approval',f=>{f.document.newMathematicalQa=true;}],
 ['unknown independent key',f=>{f.document.allow=true;}],
 ['missing supported row',f=>{f.document.rows.pop();}],
 ['duplicate supported row',f=>{f.document.rows[2]=clone(f.document.rows[1]);}],
 ['wrong independent reviewer',f=>{f.document.reviewer='native-author';}],
 ['native item digest',f=>{f.document.rows[0].nativeItemSha256='0'.repeat(64);}],
 ['missing original asset',f=>{f.document.rows[0].nativeAssets=[];}],
 ['missing current asset',f=>{f.document.rows[0].currentAssets=[];}],
 ['extra current asset',f=>{f.document.rows[0].currentAssets.push(clone(f.document.rows[0].currentAssets[0]));}],
 ['missing metadata presence inventory',f=>{f.document.rows[0].nativeToPrefigureMetadata.pop();}],
 ['changed metadata authority',f=>{f.document.rows[0].nativeToPrefigureMetadata[0].authority='SOURCE_INFERRED';}],
 ['missing renderer delta',f=>{f.document.rows[0].prefigureToCurrentFields.pop();}],
 ['original renderer refusal',f=>{f.originalReview.rows[0].decision='HOLD';}],
 ['original geometry contradicted despite PASS',f=>{f.originalReview.rows[0].geometryAndGivenConditions='FAIL';}],
 ['original renderer UID',f=>{f.originalReview.rows[0].questionUid='foreign';}],
 ['original renderer source digest',f=>{f.originalReview.rows[0].sourceBinding.beforeSourceRef.sha256='0'.repeat(64);}],
 ['UI visual approval missing',f=>{f.visual.records[0].decision='PENDING';}],
 ['UI clipped screenshot',f=>{f.visual.records[0].notClipped=false;}],
 ['UI screenshot hash mismatch',f=>{f.visual.records[0].screenshots[0].sha256='0'.repeat(64);}],
 ['UI visual observer equals producer',f=>{f.visual.reviewer=f.visual.producerOwner;}],
 ['UI visual metadata approval',f=>{f.visual.newMetadataApprovals=1;}],
 ['UI technical incomplete count',f=>{f.technical.results.pop();}],
 ['UI technical FAIL status',f=>{f.technical.status='FAIL';}],
 ['UI source overlay',f=>{f.technical.sourceOverlayCount=1;}],
 ['UI wrong E006 denominator despite PASS',f=>{f.technical.results.find(r=>r.sourceOrdinal===3).technical.questions=24;}],
 ['UI incorrect mode',f=>{f.technical.mode='solution';}],
 ['UI unready image',f=>{f.technical.results[0].technical.imagesComplete=false;}],
 ['UI math error despite PASS',f=>{f.technical.results[0].technical.mathErrors=1;}],
 ['UI screenshot geometry despite PASS',f=>{f.technical.results[0].geometry.imageInsideQuestion=false;}],
 ['UI request failure despite PASS',f=>{f.technical.results[0].requestFailures.push({code:'FAIL'});}],
 ['UI source Git binding',f=>{f.technical.items[0].sourceRef.gitBlobSha1='0'.repeat(40);}],
 ['UI executed checker digest',f=>{f.technical.checkerRef.sha256='0'.repeat(64);}],
 ['UI executed manifest commit',f=>{f.technical.manifestRef.commit='0'.repeat(40);}],
 ['UI font readiness missing',f=>{delete f.technical.results[0].technical.fontReadiness;}],
 ['UI font weight missing',f=>{f.technical.results[0].technical.fontReadiness.weights.pop();}],
 ['UI font faces not loaded',f=>{f.technical.results[0].technical.fontReadiness.weights[0].loadedFaces=0;}],
 ['UI font not applied to questions',f=>{f.technical.results[0].technical.fontReadiness.problemFontFamilies=['serif'];}],
 ['UI font requests absent',f=>{f.technical.results[0].technical.fontResourceIds=[];}],
 ['UI font response digest changed',f=>{f.technical.externalFontResources[0].sha256='0'.repeat(64);}],
 ['UI font response host changed',f=>{f.technical.externalFontResources[0].host='foreign.invalid';}],

];
for(const[label,mutate]of resealedNegatives)test(`M2 renderer comparison refuses resealed ${label}`,async t=>{const f=await fixture(t);mutate(f);f.reseal();const {validateM2ProblemRendererContinuity}=await adapter;assert.throws(()=>validateM2ProblemRendererContinuity(f.contexts[0]),/M2 problem renderer continuity:/);});

const liveNegatives=[
 ['missing current renderer',f=>fs.unlinkSync(path.join(f.root,f.newAssets[0]))],
 ['same-path current renderer change',f=>fs.appendFileSync(path.join(f.root,f.newAssets[0]),'<!-- changed -->')],
 ['same-path original renderer change',f=>fs.appendFileSync(path.join(f.root,f.oldAssets[0]),'<!-- changed -->')],
 ['missing live independent review',f=>fs.unlinkSync(path.join(f.root,'docs/original-independent.json'))],
 ['missing live UI review',f=>fs.unlinkSync(path.join(f.root,'docs/visual-ui.json'))],
 ['changed live UI technical bytes',f=>fs.appendFileSync(path.join(f.root,'docs/technical-ui.json'),' ')],
 ['current question mismatch after source rebind',f=>{const c=f.contexts[0],p='archive/exams/'+c.request.sourceArchiveFile,bank=loadBank(fs.readFileSync(path.join(f.root,p)));bank[c.patch.sourceOrdinal-1].answer='B';c.question.answer='B';c.patch.after.answer='B';f.put(p,sourceText(bank));c.request.expectedSourceBlobSha1=blob(fs.readFileSync(path.join(f.root,p)));}],
 ['unselected question change after source rebind',f=>{const c=f.contexts[0],p='archive/exams/'+c.request.sourceArchiveFile,bank=loadBank(fs.readFileSync(path.join(f.root,p)));bank[0].content+=' changed';f.put(p,sourceText(bank));c.request.expectedSourceBlobSha1=blob(fs.readFileSync(path.join(f.root,p)));}],
 ['source wrapper change after source rebind',f=>{const c=f.contexts[0],p='archive/exams/'+c.request.sourceArchiveFile;fs.appendFileSync(path.join(f.root,p),'// changed wrapper\n');c.request.expectedSourceBlobSha1=blob(fs.readFileSync(path.join(f.root,p)));}],
 ['unknown opt-in key',f=>{f.contexts[0].patch.sourceReview.m2ProblemRendererContinuity.allow=true;}],
 ['null opt-in',f=>{f.contexts[0].patch.sourceReview.m2ProblemRendererContinuity=null;}],
 ['mixed renderer proof',f=>{f.contexts[0].patch.sourceReview.rendererProof={schemaVersion:'foreign'};}],
 ['mixed source-only approval',f=>{f.contexts[0].request.approval.sourceRebind={};}],
 ['mixed item rebind',f=>{f.contexts[0].patch.rebind={};}],
 ['foreign native profile',f=>{f.contexts[0].native.review.schemaVersion='m3-s2-meta-review-v1';}],
 ['full-scope approval',f=>{f.contexts[0].request.scope='FULL_EXAM';}],
 ['foreign UID',f=>{f.contexts[0].patch.questionUid='qid_v1_'+'0'.repeat(64);}],
 ['wrong source ordinal',f=>{f.contexts[0].patch.sourceOrdinal=11;}],
 ['wrong full denominator',f=>{f.contexts[0].request.expectedQuestionCount=23;}],
 ['missing original v3 authority',f=>{delete f.contexts[0].patch.sourceReview.proposalFinalization;}],
 ['missing scope-parent authority',f=>{delete f.contexts[0].patch.sourceReview.proposalFinalization.scopeParentTransport;}],
 ['missing approval evidence reference',f=>{f.contexts[0].request.approval.evidenceRefs=[];}],
 ['missing item evidence reference',f=>{f.contexts[0].patch.evidenceRefs=[];}],
];
for(const[label,mutate]of liveNegatives)test(`M2 renderer comparison refuses ${label}`,async t=>{const f=await fixture(t),{validateM2ProblemRendererContinuity}=await adapter;mutate(f);assert.throws(()=>validateM2ProblemRendererContinuity(f.contexts[0]),/M2 problem renderer continuity:/);});
for(const[label,mutate]of [
 ['wrong immutable E006 denominator',c=>{c.request.expectedQuestionCount=24;}],
 ['missing independent primary',c=>{delete c.patch.sourceReview.retainedFields.independentPrimary;}],
 ['missing retained scope',c=>{delete c.patch.sourceReview.retainedScopeTransport;}],
 ['extra canonical change',c=>{c.request.registryChanges=[{path:'foreign'}];}],
 ['new rationale opt-in',c=>{c.patch.sourceReview.rationaleContinuity={schemaVersion:'archive-native-rationale-continuity-v1'};}],
])test(`M2 retained renderer refuses ${label}`,async t=>{const f=await fixture(t),{validateM2ProblemRendererContinuity}=await adapter;mutate(f.contexts[2]);assert.throws(()=>validateM2ProblemRendererContinuity(f.contexts[2]),/M2 problem renderer continuity:/);});
for(const[label,mutate]of [
 ['missing original checked geometry',f=>{f.originalReview.rows[1].geometryAndGivenConditions='HOLD';}],
 ['missing separate label repair',f=>{f.labelReview.decision='PENDING';}],
 ['changed original public asset binding',f=>{f.labelReview.originalPublicAssetRef.sha256='0'.repeat(64);}],
 ['new mathematical approval in label review',f=>{f.labelReview.newFullMathematicalQa=true;}],
])test(`M2 Q3 label repair refuses ${label}`,async t=>{const f=await fixture(t),{validateM2ProblemRendererContinuity}=await adapter;mutate(f);f.reseal();assert.throws(()=>validateM2ProblemRendererContinuity(f.contexts[1]),/M2 problem renderer continuity:/);});
