'use strict';
// Closed GitHub-Chromium evidence reader. A technical result alone never grants
// display acceptance. Original captured tiles need a separate visual record.
const crypto=require('node:crypto');
const path=require('node:path');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),eq=(a,b)=>stable(a)===stable(b);
const HEX=/^[a-f0-9]{64}$/,OID=/^[a-f0-9]{40}$/;
const DECISION='ACCEPT_DISPLAY_CONTINUITY_ONLY';
const PINS=Object.freeze({
 checker:{path:'tools/check-m1s2-problem-seven-browser.cjs',sha256:'282463f5278063bb2b97e2031c108a9f37cdd30eeb4062c5065976f843655b76'},
 capture:{path:'tools/check-reviewed-problem-renderer-browser.cjs',sha256:'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673'},
 surface:{path:'tools/capture-m1s2-problem-surface.cjs',sha256:'86b0e6761544480a688930928484e1f944e9e47e0ab2347aa22a35331891f5cf'},
 manifest:{path:'tests/fixtures/archive-m1s2-problem-seven-ui.json',sha256:'a315e169b8b4666f54c81a68a2579ccab1fa85d4de8521b7002373e82f8802ef'}
});
const withoutCommit=({commit,...ref})=>ref;
const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json',SVG_INDEX='archive/data/svg-accessibility-index.js';
const PNG_SIGNATURE=Buffer.from('89504e470d0a1a0a','hex');
function fail(code){throw Error('M1S2_PROBLEM_UI_'+code);}
function object(x){return !!x&&typeof x==='object'&&!Array.isArray(x);}
function exact(x,keys,code){if(!object(x)||!eq(Object.keys(x).sort(),[...keys].sort()))fail(code+'_KEYS');}
function integer(x,min=0){return Number.isSafeInteger(x)&&x>=min;}
function unique(rows,match,code){const found=(rows||[]).filter(match);if(found.length!==1)fail(code);return found[0];}
const isRenderEngineFile=p=>p==='archive/engine.html'||p==='archive/mixed_engine.html'||p==='apmath/wrong_print_engine.html'||/^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p)||/^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p)||/^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
function capturedRef(reader,ref,checkoutCommit,live=false){
 if(!ref||ref.commit!==checkoutCommit||!OID.test(checkoutCommit))fail('CAPTURE_COMMIT');
 // The historical Git tree is authenticated before comparing current bytes.
 const bytes=reader.read(ref);if(live)reader.read(withoutCommit(ref),true);return bytes;
}
function visualTechnicalRef(reader,published,current,ancestor){
 if(!object(published)||!object(current)||Object.hasOwn(current,'commit')||!eq(withoutCommit(published),current))fail('VISUAL_TECHNICAL_REF');
 if(Object.hasOwn(published,'commit')){if(!OID.test(published.commit))fail('VISUAL_TECHNICAL_COMMIT');ancestor(published.commit,reader.head);}
 // A separately published visual review may pin its technical evidence to an
 // immutable Git commit. Authenticate that exact tree and current file bytes.
 reader.read(published,true);
}
function selectedDataRows(before,after,subjects,kind){
 if(!Array.isArray(before?.records)||!Array.isArray(after?.records))fail('DATA_RECORDS');
 for(const s of subjects){const old=unique(before.records,r=>r.questionUid===s.questionUid,'CAPTURE_'+kind),cur=unique(after.records,r=>r.questionUid===s.questionUid,'CURRENT_'+kind);
  if(old.sourceArchiveFile!==s.sourceArchiveFile||old.sourceOrdinal!==s.sourceOrdinal||!eq(old,cur))fail('SELECTED_'+kind+'_DRIFT');
 }
}
function svgRecords(bytes,assets){
 // This is the exact generated data wrapper, not executable JavaScript input.
 const m=bytes.toString('utf8').match(/^\(function\(root\)\{\s*'use strict';\s*root\.APSvgAccessibilityIndex = Object\.freeze\((\{[\s\S]*\})\);\s*\}\(typeof window !== 'undefined' \? window : globalThis\)\);\s*$/);
 if(!m)fail('SVG_INDEX_WRAPPER');let d;try{d=JSON.parse(m[1]);}catch{fail('SVG_INDEX_JSON');}
 if(d.schemaVersion!=='SVG_STUDENT_ACCESSIBILITY_V1'||!Array.isArray(d.records))fail('SVG_INDEX_SCHEMA');
 const seen=new Set(),selected=[];
 for(const r of d.records){if(!object(r)||typeof r.assetRef!=='string'||!r.assetRef.startsWith('assets/')||!['problem','solution'].includes(r.visualRole))fail('SVG_INDEX_RECORD');
  let normalized;try{normalized=decodeURIComponent(new URL(r.assetRef,'https://svg-accessibility.invalid/archive/').pathname).replace(/^\/archive\//,'');}catch{fail('SVG_INDEX_PATH');}
  if(normalized!==r.assetRef)fail('SVG_INDEX_PATH');const key=normalized+'\0'+r.visualRole;if(seen.has(key))fail('SVG_INDEX_DUPLICATE');seen.add(key);
  if(r.visualRole==='problem'&&assets.has('archive/'+normalized))selected.push(r);
 }
 return selected.sort((a,b)=>a.assetRef.localeCompare(b.assetRef));
}
function currentData(reader,p){
 if(p!==SVG_INDEX)fail('GENERATED_DATA_PATH');
 // The writer generates this data before fourSlot and commits it afterwards.
 // Keep the captured whole file Git-authenticated; the current regular file
 // is checked by the fixed JSON wrapper and exact selected-record comparison.
 return reader.local(SVG_INDEX);
}
function svgContinuity(before,after,assets){if(!eq(svgRecords(before,assets),svgRecords(after,assets)))fail('SELECTED_SVG_INDEX_DRIFT');}
function capturedArtifacts(reader,refs,artifacts,ancestor){
 if(!Array.isArray(refs)||refs.length!==artifacts.length||new Set(refs.map(r=>r.path)).size!==refs.length)fail('PNG_REF_INVENTORY');
 for(const a of artifacts){const ref=unique(refs,r=>path.posix.basename(r.path||'')===a.path&&r.sha256===a.sha256&&r.bytes===a.bytes,'PNG_REF');
  if(Object.hasOwn(ref,'commit'))ancestor(ref.commit,reader.head);
  const bytes=reader.read(ref,true);if(bytes.length<PNG_SIGNATURE.length||!bytes.subarray(0,PNG_SIGNATURE.length).equals(PNG_SIGNATURE))fail('PNG_BYTES');
 }
}
function surfaceTopology(s,visibleChildren){
 exact(s,['schemaVersion','kind','equalSlot','wrapperCount','outerElementCount','nonemptyOutsideNodes','numberCount','contentCount','nestedQuestionCount','targetInsideContainer','semanticChildCount'],'SURFACE');
 if(s.schemaVersion!=='archive-m1s2-native-problem-surface-v1'||!['DIRECT_CHILDREN','AP_EQUAL_SLOT_CONTENT'].includes(s.kind)||
    !['wrapperCount','outerElementCount','nonemptyOutsideNodes','numberCount','contentCount','nestedQuestionCount','semanticChildCount'].every(k=>integer(s[k]))||
    s.numberCount!==1||s.contentCount!==1||s.nestedQuestionCount!==0||s.targetInsideContainer!==true||s.semanticChildCount<3||s.semanticChildCount!==visibleChildren)fail('SURFACE_COMPLETENESS');
 if(s.kind==='AP_EQUAL_SLOT_CONTENT'?(s.equalSlot!==true||s.wrapperCount!==1||s.outerElementCount!==1||s.nonemptyOutsideNodes!==0):
   (s.equalSlot!==false||s.wrapperCount!==0||s.nonemptyOutsideNodes!==0||s.outerElementCount<3))fail('SURFACE_TOPOLOGY');
}
function artifact(x){exact(x,['path','sha256','bytes'],'ARTIFACT');if(typeof x.path!=='string'||!/^[A-Za-z0-9_./-]+\.png$/.test(x.path)||x.path.startsWith('/')||x.path.split('/').some(p=>!p||p==='.'||p==='..')||!HEX.test(x.sha256)||!integer(x.bytes,1))fail('ARTIFACT');return x;}
function screenshot(x){exact(x,['tileIndex','path','sha256','bytes'],'SCREENSHOT');if(!integer(x.tileIndex,1))fail('SCREENSHOT');const{tileIndex,...a}=x;artifact(a);return a;}
function rect(x){exact(x,['x','y','width','height'],'RECT');if(!Object.values(x).every(Number.isFinite)||x.x<0||x.y<0||x.width<=0||x.height<=0)fail('RECT');}
function scroll(x){exact(x,['x','y'],'SCROLL');if(!Object.values(x).every(Number.isFinite)||x.x<0||x.y<0)fail('SCROLL');}
function coverage(c,screenshots,viewport){
 exact(c,['schemaVersion','method','tileLimit','overlapCssPixels','tileCount','content','question','viewport','visibleChildren','coverage','tiles','scrollBefore','scrollAfter','scrollOperations','domSha256','feedbackIdle','foreignContentHits','cssWrites','domWrites','viewportChanges','compositeImageCreated'],'CAPTURE');
 if(c.schemaVersion!=='archive-problem-scroll-coverage-v1'||c.method!=='UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES'||c.tileLimit!==8||c.overlapCssPixels!==32||
    !integer(c.tileCount,1)||c.tileCount>8||!integer(c.visibleChildren,3)||!HEX.test(c.domSha256)||!Array.isArray(c.tiles)||c.tiles.length!==c.tileCount||screenshots.length!==c.tileCount||
    c.feedbackIdle!==true||c.foreignContentHits!==0||c.cssWrites!==0||c.domWrites!==0||c.viewportChanges!==0||c.compositeImageCreated!==false||!integer(c.scrollOperations))fail('CAPTURE');
 exact(c.viewport,['width','height'],'VIEWPORT');if(!eq(c.viewport,{width:viewport.width,height:viewport.height}))fail('VIEWPORT');
 rect(c.content);rect(c.question);scroll(c.scrollBefore);scroll(c.scrollAfter);
 const close=(a,b)=>Math.abs(a-b)<=1e-6,height=c.content.height;
 if(!close(c.content.x,c.question.x)||!close(c.content.width,c.question.width)||c.content.y<c.question.y-1e-6||c.content.y+c.content.height>c.question.y+c.question.height+1e-6)fail('CONTENT_GEOMETRY');
 if(!eq(c.coverage,{requiredInterval:[0,height],coveredInterval:[0,height],complete:true}))fail('COVERAGE');
 let previousEnd=null,previousScroll=c.scrollBefore,operations=0;
 for(let i=0;i<c.tileCount;i++){const t=c.tiles[i],s=screenshots[i];screenshot(s);
  exact(t,['tileIndex','relativeInterval','filename','clip','scroll','scrollOperations','feedbackIdle','obstructionsIntersectingClip','hitTestSamples','foreignContentHits','domSha256'],'TILE');
  if(t.tileIndex!==i+1||s.tileIndex!==i+1||t.filename!==s.path||t.feedbackIdle!==true||t.obstructionsIntersectingClip!==0||t.foreignContentHits!==0||!integer(t.hitTestSamples,2)||!integer(t.scrollOperations)||t.scrollOperations>3||t.domSha256!==c.domSha256)fail('TILE');
  if(!Array.isArray(t.relativeInterval)||t.relativeInterval.length!==2||!t.relativeInterval.every(Number.isFinite))fail('INTERVAL');
  const[start,end]=t.relativeInterval;if(start<0||end<=start||end>height||(i===0?start!==0:start!==previousEnd-32)||(i>0&&end<=previousEnd))fail('INTERVAL');
  rect(t.clip);scroll(t.scroll);
  if(t.clip.x+t.clip.width>viewport.width||t.clip.y+t.clip.height>viewport.height||!close(t.clip.height,end-start)||!close(t.clip.width,c.content.width)||
     !close(t.clip.x+t.scroll.x,c.content.x)||!close(t.clip.y+t.scroll.y,c.content.y+start)||(t.scrollOperations===0&&!eq(t.scroll,previousScroll)))fail('CLIP');
  previousEnd=end;previousScroll=t.scroll;operations+=t.scrollOperations;
 }
 if(previousEnd!==height||!eq(c.scrollAfter,previousScroll)||c.scrollOperations!==operations)fail('INCOMPLETE_COVERAGE');
}
function verify({reader,doc,current,subjects,ancestor}){
 const t=reader.json(doc.uiTechnicalRef,true),v=reader.json(doc.uiVisualRef,true);
 const currentBinding=currentReuseRequested(doc,t,v);
 if(currentBinding)verifyCurrentVisualReuse({reader,doc,t,v,ancestor});
 if(t.schemaVersion!=='archive-m1s2-problem-seven-github-ui-raw-v1'||t.status!=='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'||t.executionOwner!==(currentBinding?CURRENT_OWNER:'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD')||
    !OID.test(t.checkoutCommit)||!OID.test(t.baseCommit)||!String(t.browserVersion||'').trim()||t.mode!=='exam'||t.studentReview!==true||t.problemOnlyScreenshots!==true||
    t.sourceOverlay!==false||t.sourceOverlayCount!==0||t.sourceWrites!==0||t.solutionsOpened!==false||t.productionCdnTest!==false||t.newFullMathematicalQa!==false||
    t.newMetadataApprovals!==0||t.newDifficultyJudgments!==0||t.newReviewPassCount!==0||t.newFourSlotApprovals!==0||
    t.expectedLogicalCases!==14||t.completedLogicalCases!==14||!Array.isArray(t.results)||t.results.length!==14||!Array.isArray(t.screenshotArtifacts)||t.screenshotArtifactCount!==t.screenshotArtifacts.length||
    !Array.isArray(t.failures)||t.failures.length||!Array.isArray(t.externalFontResources)||t.externalFontResources.length)fail('TECHNICAL');
 if(currentBinding)verifyCurrentCaptureExecution(t);
 else{
 exact(t.execution,['provider','eventName','repository','workflow','job','runId','runAttempt','pullRequest','headSha','baseSha','eventSha','runUrl'],'CI_EXECUTION');
 if(t.execution.provider!=='GITHUB_ACTIONS'||t.execution.eventName!=='pull_request'||t.execution.repository!=='icefoxtail/AP------'||
    !String(t.execution.workflow||'').trim()||t.execution.job!=='m1s2-problem-seven'||!/^[1-9][0-9]*$/.test(t.execution.runId||'')||
    !integer(t.execution.runAttempt,1)||!integer(t.execution.pullRequest,1)||t.execution.headSha!==t.checkoutCommit||
    !OID.test(t.execution.baseSha||'')||!OID.test(t.execution.eventSha||'')||
    t.execution.runUrl!=='https://github.com/icefoxtail/AP------/actions/runs/'+t.execution.runId)fail('CI_EXECUTION');
 }
 if(v.schemaVersion!==(currentBinding?CURRENT_VISUAL_SCHEMA:'archive-independent-m1s2-problem-seven-ui-review-v1')||v.decision!==DECISION||!String(v.reviewer||'').trim()||v.reviewer===doc.author||v.reviewer===t.executionOwner||
    v.newMathQa!==0||v.newSemanticApproval!==0||v.newFourSlotVector!==0||!Array.isArray(v.records)||v.records.length!==14)fail('VISUAL');
 visualTechnicalRef(reader,v.technicalRef,doc.uiTechnicalRef,ancestor);
 ancestor(doc.reviewedSourceRef.commit,t.baseCommit);ancestor(t.baseCommit,t.checkoutCommit);ancestor(t.checkoutCommit,reader.head);
 const implementationPins=currentBinding?CURRENT_PINS:PINS;
 for(const[ref,pin]of[[t.checkerRef,implementationPins.checker],[t.captureHelperRef,implementationPins.capture],[t.surfaceHelperRef,implementationPins.surface],[t.manifestRef,implementationPins.manifest]]){
  if(ref?.commit!==t.checkoutCommit||ref.path!==pin.path||ref.sha256!==pin.sha256)fail('IMPLEMENTATION');capturedRef(reader,ref,t.checkoutCommit,true);
 }
 const manifest=reader.json(withoutCommit(t.manifestRef),true);
 if(manifest.schemaVersion!=='archive-m1s2-problem-seven-ui-manifest-v1'||manifest.scope!=='M1S2_SEVEN_EXISTING_PROBLEM_RENDERERS_ONLY'||manifest.expectedCases!==14||manifest.items?.length!==7)fail('MANIFEST');
 if(!Array.isArray(t.servedFiles)||!Array.isArray(t.mirroredAssets)||!Array.isArray(t.studentFontResources))fail('RUNTIME_INVENTORY');
 const mdRef=unique(t.servedFiles,r=>r.path===MD,'METADATA_REQUIRED');
 if(mdRef.commit!==t.checkoutCommit||t.identityRef?.commit!==t.checkoutCommit||t.identityRef.path!==ID)fail('DATA_CAPTURE_REF');
 // Full captured Git bytes stay authenticated. Only the seven selected rows
 // are authority inputs; unrelated generated rows may legitimately advance.
 selectedDataRows(reader.projection(mdRef,'metadata'),reader.projection(null,'metadata'),subjects,'METADATA');
 selectedDataRows(reader.projection(t.identityRef,'identity'),reader.projection(null,'identity'),subjects,'IDENTITY');
 const svgRef=unique(t.servedFiles,r=>r.path===SVG_INDEX,'SVG_INDEX_REQUIRED'),assets=new Set(manifest.items.map(r=>r.assetPath));
 svgContinuity(capturedRef(reader,svgRef,t.checkoutCommit),currentData(reader,SVG_INDEX),assets);
 const runtimePaths=new Set();let engine=0;
 for(const ref of t.servedFiles){if(ref.commit!==t.checkoutCommit||runtimePaths.has(ref.path))fail('RUNTIME_INVENTORY');runtimePaths.add(ref.path);
  // Own source/assets are checked by each selected sidecar. Recheck the exact
  // shared student runtime without coupling one UID to another exam's bytes.
  if(![MD,ID,SVG_INDEX].includes(ref.path))capturedRef(reader,ref,t.checkoutCommit,!ref.path.startsWith('archive/exams/')&&!ref.path.startsWith('archive/assets/images/')&&!isRenderEngineFile(ref.path));
  if(ref.path==='archive/engine.html')engine++;
 }if(engine!==1)fail('ENGINE_REQUIRED');
 const mirroredPaths=new Set();for(const ref of t.mirroredAssets){if(!ref.path?.startsWith('archive/assets/images/')||mirroredPaths.has(ref.path))fail('MIRRORED_INVENTORY');mirroredPaths.add(ref.path);capturedRef(reader,ref,t.checkoutCommit);}
 if(t.fontLicenseRef?.path!=='archive/vendor/nanum-myeongjo/OFL.txt')fail('FONT_LICENSE');capturedRef(reader,t.fontLicenseRef,t.checkoutCommit,true);
 const fontResources=new Map();
 for(const f of t.studentFontResources){
  if(!HEX.test(f.resourceId)||fontResources.has(f.resourceId)||f.commit!==t.checkoutCommit||f.status!==200||!['STYLESHEET','FONT'].includes(f.kind)||
     !f.path?.startsWith('archive/vendor/nanum-myeongjo/')||f.kind==='FONT'&&![400,700,800].includes(f.weight)||f.kind==='STYLESHEET'&&f.weight!==null)fail('FONT_RESOURCE');
  const ref=Object.fromEntries(['commit','path','gitBlobSha1','sha256','bytes'].map(k=>[k,f[k]]));
  if(f.resourceId!==sha(stable({path:f.path,responseSha256:f.sha256,mime:f.mime})))fail('FONT_RESOURCE_ID');capturedRef(reader,ref,t.checkoutCommit,true);fontResources.set(f.resourceId,f);
 }
 const byUid=new Map(subjects.map(s=>[s.questionUid,s])),seen=new Set(),visualSeen=new Set(),artifacts=[];
 for(const r of t.results){
  const subject=byUid.get(r.questionUid),key=r.questionUid+':'+r.viewport?.name,viewport=r.viewport?.name==='desktop'?{name:'desktop',width:1365,height:1000}:{name:'mobile',width:390,height:844};
  if(!subject||r.sourceOrdinal!==subject.sourceOrdinal||seen.has(key)||!eq(r.viewport,viewport)||r.surface!=='PROBLEM'||r.mode!=='exam'||r.status!=='PASS'||r.visualReview!=='PENDING')fail('CASE');seen.add(key);
  if(!Array.isArray(r.pageErrors)||r.pageErrors.length||!Array.isArray(r.requestFailures)||r.requestFailures.length||!Array.isArray(r.externalRequests)||r.externalRequests.length)fail('CASE_ERRORS');
  const item=unique(manifest.items,x=>x.questionUid===r.questionUid,'MANIFEST_ITEM');
  if(item.sourceOrdinal!==r.sourceOrdinal||item.sourcePath!=='archive/exams/'+subject.sourceArchiveFile||r.sourceRef?.path!==item.sourcePath||r.sourceRef.commit!==t.checkoutCommit||
     r.sourceRef.gitBlobSha1!==item.sourceGitBlobSha1||r.sourceRef.sha256!==item.sourceSha256||r.sourceRef.bytes!==item.sourceBytes||r.questionSha256!==item.questionSha256||
     !Array.isArray(r.assetRefs)||r.assetRefs.length!==1||r.assetRefs[0].commit!==t.checkoutCommit||r.assetRefs[0].path!==item.assetPath||r.assetRefs[0].gitBlobSha1!==item.assetGitBlobSha1||r.assetRefs[0].sha256!==item.assetSha256||r.assetRefs[0].bytes!==item.assetBytes)fail('MANIFEST_BINDING');
  capturedRef(reader,r.sourceRef,t.checkoutCommit);for(const ref of r.assetRefs)capturedRef(reader,ref,t.checkoutCommit);
  const tech=r.technical;
  if(tech?.mode!=='exam'||tech.questions!==item.expectedBankCount||tech.readiness!=='RENDER_READY'||!integer(tech.pages,1)||tech.imagesComplete!==true||tech.mathErrors!==0||tech.unrenderedMath!==0||tech.mathJaxSource!=='local'||tech.solutionNodes!==0||
     tech.fontReadiness?.status!=='loaded'||tech.fontReadiness.family!=='Nanum Myeongjo'||tech.fontReadiness.weights?.length!==3||
     tech.fontReadiness.weights.some((f,i)=>f.weight!==[400,700,800][i]||!integer(f.loadedFaces,1)||f.allLoaded!==true||f.checked!==true)||
     !Array.isArray(tech.fontReadiness.problemFontFamilies)||!tech.fontReadiness.problemFontFamilies.length||tech.fontReadiness.problemFontFamilies.some(f=>!f.includes('Nanum Myeongjo'))||
     !Array.isArray(tech.fontResourceIds)||new Set(tech.fontResourceIds).size!==tech.fontResourceIds.length||tech.fontResourceIds.some(k=>!fontResources.has(k)))fail('RENDER_STATE');
  const fonts=tech.fontResourceIds.map(k=>fontResources.get(k));
  if(!fonts.some(f=>f.kind==='STYLESHEET')||tech.fontReadiness.weights.some(w=>fonts.filter(f=>f.kind==='FONT'&&f.weight===w.weight).length<w.loadedFaces))fail('FONT_RESPONSES');
  if(!Array.isArray(r.screenshots))fail('SCREENSHOTS');surfaceTopology(r.surfaceStructure,r.capture?.visibleChildren);coverage(r.capture,r.screenshots,r.viewport);artifacts.push(...r.screenshots.map(screenshot));
  const visual=unique(v.records,x=>x.questionUid===r.questionUid&&x.viewport?.name===r.viewport.name,'VISUAL_CASE');visualSeen.add(key);
  if(visual.sourceOrdinal!==r.sourceOrdinal||visual.surface!=='PROBLEM'||!eq(visual.viewport,r.viewport)||visual.captureSha256!==sha(stable(r.capture))||visual.decision!==DECISION||
     !Array.isArray(visual.screenshots)||!eq(visual.screenshots.map(s=>{if(s.decision!==DECISION)fail('VISUAL_TILE');const{decision,...ref}=s;return ref;}),r.screenshots))fail('VISUAL_BINDING');
  if(r.questionUid===doc.questionUid&&(!eq(withoutCommit(r.sourceRef),doc.currentSourceRef)||r.questionSha256!==sha(stable(current))||
     !eq(r.assetRefs.map(withoutCommit),doc.currentAssets.filter(a=>a.path==='archive/'+current.image))))fail('SELECTED_SOURCE_BINDING');
 }
 const sorted=rows=>rows.slice().sort((a,b)=>a.path.localeCompare(b.path));
 if(seen.size!==14||visualSeen.size!==14||new Set(artifacts.map(x=>x.path)).size!==artifacts.length||!eq(sorted(artifacts),sorted(t.screenshotArtifacts.map(artifact))))fail('ARTIFACT_INVENTORY');
 capturedArtifacts(reader,v.artifactRefs,artifacts,ancestor);
 return{logicalCases:2,newSemanticApproval:0,newFourSlotVector:0};
}

// One immutable current ops capture reuses exactly the prior accepted pixels.
const CURRENT_OWNER="GITHUB_ACTIONS_CHROMIUM_CLOSED_OPS_PUSH_HEAD";
const CURRENT_VISUAL_SCHEMA="archive-independent-m1s2-current-ui-reuse-v1";
const CURRENT_CAPTURE_HEAD="48d18ccdc7eafffe3d1d8ae32e65a4dc23437502";
const CURRENT_BASE_COMMIT="a66a389b96525f67e2868a000184039e08627e9f";
const CURRENT_EXECUTION=Object.freeze({"provider":"GITHUB_ACTIONS","eventName":"push","repository":"icefoxtail/AP------","workflow":"Middle Protected Current Renderer","job":"current-ui","runId":"44015662986","runAttempt":1,"pullRequest":null,"headSha":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","baseSha":null,"eventSha":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502","runUrl":"https://github.com/icefoxtail/AP------/actions/runs/44015662986","ref":"refs/heads/ops/middle-protected9-current-renderer-26fc-20261117","capturedHead":"48d18ccdc7eafffe3d1d8ae32e65a4dc23437502"});
const CURRENT_ARTIFACT_PREFIX="docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/";
const CURRENT_TECHNICAL_REF=Object.freeze({"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/technical-proof.json","gitBlobSha1":"82fe4a6929e1d7b800bbba4f3a2634ffea04cc77","sha256":"6d7281d12281f6ceb454d3cc79244a66a8a5013327120a4b5bfde98671d8fa42","bytes":222310});
const CURRENT_VISUAL_REF=Object.freeze({"commit":"d3d625ceb7315ffddbcd4a0a8c9960527fe0c9ed","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/visual-current-reuse-v1.json","gitBlobSha1":"e626233f7aeaddf7d7d81bab5daf59e7ed2996bc","sha256":"ca40535462ab65d42ddac642fe640dbcb49dee9ae03dd3f611813aab778d6807","bytes":18296});
const CURRENT_EQUIVALENCE_REF=Object.freeze({"commit":"d22e6702b1a8cb5e06f658bd3d3bf8a1a7b3a543","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/exact-display-equivalence-v1.json","gitBlobSha1":"7b299baaa116756e2527a77c5181ed03ec1ae91d","sha256":"873fabbec304705ea3e12ff4621849b040fdd4f7096006bfd8b00f07d2f55dec","bytes":53093});
const CURRENT_INDEPENDENT_REF=Object.freeze({"commit":"d22e6702b1a8cb5e06f658bd3d3bf8a1a7b3a543","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/m1/root-independent-equivalence-v1.json","gitBlobSha1":"2cb1d70d666c5742ef57b0bce2b4dbf9231c5afe","sha256":"83bb6258be37609abfda71527f65165f1658b5caf5da572ee93fe1f60bc7f4ac","bytes":16257});
const CURRENT_REASSEMBLY_REF=Object.freeze({"commit":"90baaac80f0dac03a968c2c5ad6ccf9ca3ddb3c3","path":"docs/operations/middle-current-ui-26fc-20261117/run-44015662986/root-reassembly-v1.json","gitBlobSha1":"f07ff335d4abab50048d700d5a526d3f9fa68790","sha256":"fa841847643c673948650c4d70a1ae00fc578e3ee627ccfc820d2b2fda081910","bytes":7306});
const PRIOR_TECHNICAL_REF=Object.freeze({"commit":"a019663b1c3940b57a47a3b8abc025a56e2673c3","path":"docs/operations/m1s2-problem-seven-ui-26fc-20261116/technical-proof.json","gitBlobSha1":"1dfbe22d89b9d8f229724796dc559fe3799483b8","sha256":"d379e5f05e1e59e74b635452e535fc676fec502542ff7a25c0d77cb63a898f9a","bytes":222136});
const PRIOR_VISUAL_REF=Object.freeze({"commit":"c4e1838e9245c877c98c96e7cb9d8b4c6b426758","path":"docs/operations/m1s2-problem-seven-ui-26fc-20261116/independent-visual-review.json","gitBlobSha1":"77f810ff113e15ee894d21c8bab591ab8132539b","sha256":"7f30419f07e71faf441418ed07b30366037413fb99f9448b39a7ba208bb646a9","bytes":15105});
const CURRENT_PINS=Object.freeze({...PINS,checker:Object.freeze({path:"tools/check-m1s2-problem-seven-browser.cjs",sha256:"130fcab0be811c537ddce05f5c1f17a26e18cf9862ea690dbefcea419bde73e9"})});

function currentReuseRequested(doc,t,v){
 return doc.uiTechnicalRef?.path===CURRENT_TECHNICAL_REF.path||
  t.executionOwner===CURRENT_OWNER||v.schemaVersion===CURRENT_VISUAL_SCHEMA;
}
function verifyCurrentCaptureExecution(t){
 exact(t.execution,['provider','eventName','repository','workflow','job','runId','runAttempt','pullRequest','headSha','baseSha','eventSha','runUrl','ref','capturedHead'],'CURRENT_CI_EXECUTION');
 if(t.executionOwner!==CURRENT_OWNER||t.checkoutCommit!==CURRENT_CAPTURE_HEAD||t.baseCommit!==CURRENT_BASE_COMMIT||
    !eq(t.execution,CURRENT_EXECUTION))fail('CURRENT_CI_EXECUTION');
}
function verifyCurrentVisualReuse({reader,doc,t,v,ancestor}){
 if(!eq(doc.uiTechnicalRef,withoutCommit(CURRENT_TECHNICAL_REF))||
    !eq(doc.uiVisualRef,withoutCommit(CURRENT_VISUAL_REF)))fail('CURRENT_REF_SCOPE');
 for(const ref of[CURRENT_TECHNICAL_REF,CURRENT_VISUAL_REF,CURRENT_EQUIVALENCE_REF,CURRENT_INDEPENDENT_REF,
   CURRENT_REASSEMBLY_REF,PRIOR_TECHNICAL_REF,PRIOR_VISUAL_REF])ancestor(ref.commit,reader.head);
 // Authenticate immutable publication paths and current regular-file bytes;
 // the raw push result is never relabelled or projected into PR provenance.
 const sealedTechnical=reader.json(CURRENT_TECHNICAL_REF,true),sealedVisual=reader.json(CURRENT_VISUAL_REF,true);
 if(!eq(t,sealedTechnical)||!eq(v,sealedVisual))fail('CURRENT_RAW_BINDING');
 verifyCurrentCaptureExecution(t);
 exact(v,['schemaVersion','reviewer','derivationAuthor','decision','reviewMethod','technicalRef','priorTechnicalRef',
  'priorVisualRef','equivalenceRef','rootReassemblyRef','actualExecution','newMathQa','newSemanticApproval','newFourSlotVector',
  'newVisualInspection','priorVisualRecordsCopiedExactly','currentRawTechnicalUnchanged','sharedCodeEquivalenceClaimed',
  'currentRuntimeAndFontLiveGuardsRequired','records','artifactRefs','continuingContentHolds','officialAuthorityBuilderConsumerStatus',
  'independentEquivalenceRef','currentCaptureFilesWereModified'],'CURRENT_VISUAL');
 if(v.schemaVersion!==CURRENT_VISUAL_SCHEMA||v.derivationAuthor!=='GPT_M1_RELEASE_CLOSEOUT'||v.decision!==DECISION||
    v.reviewMethod!=='EXACT_ORIGINAL_PNG_AND_CAPTURE_REUSE_OF_PRIOR_SEPARATE_VISUAL_INSPECTION'||
    !eq(v.technicalRef,CURRENT_TECHNICAL_REF)||!eq(v.priorTechnicalRef,PRIOR_TECHNICAL_REF)||!eq(v.priorVisualRef,PRIOR_VISUAL_REF)||
    !eq(v.equivalenceRef,CURRENT_EQUIVALENCE_REF)||!eq(v.independentEquivalenceRef,CURRENT_INDEPENDENT_REF)||
    !eq(v.rootReassemblyRef,CURRENT_REASSEMBLY_REF)||!eq(v.actualExecution,CURRENT_EXECUTION)||
    v.newMathQa!==0||v.newSemanticApproval!==0||v.newFourSlotVector!==0||v.newVisualInspection!==0||
    v.priorVisualRecordsCopiedExactly!==true||v.currentRawTechnicalUnchanged!==true||v.currentCaptureFilesWereModified!==false||
    v.sharedCodeEquivalenceClaimed!==false||v.currentRuntimeAndFontLiveGuardsRequired!==true||
    v.continuingContentHolds!=='FOUR_PREEXISTING_CONTENT_OR_SOLUTION_HOLDS_UNCHANGED'||
    v.officialAuthorityBuilderConsumerStatus!=='CURRENT_BINDING_NOT_RUN')fail('CURRENT_VISUAL');
 const prior=reader.json(PRIOR_TECHNICAL_REF),oldVisual=reader.json(PRIOR_VISUAL_REF);
 const witness=reader.json(CURRENT_EQUIVALENCE_REF),independent=reader.json(CURRENT_INDEPENDENT_REF),assembly=reader.json(CURRENT_REASSEMBLY_REF);
 if(witness.schemaVersion!=='archive-m1s2-current-fourteen-byte-equivalence-v1'||
    witness.status!=='EXACT_CURRENT_DISPLAY_BYTES_PRIOR_VISUAL_RECORDS_REUSABLE_INDEPENDENT_REVIEW_REQUIRED'||
    witness.currentCapture?.commit!==CURRENT_CAPTURE_HEAD||!eq(witness.refs?.currentTechnical,CURRENT_TECHNICAL_REF)||
    !eq(witness.refs?.priorTechnical,PRIOR_TECHNICAL_REF)||!eq(witness.refs?.priorVisual,PRIOR_VISUAL_REF)||
    independent.decision!=='ACCEPT_REUSE_OF_IDENTICAL_EXISTING_DISPLAY_OBSERVATIONS_ONLY'||
    independent.currentEvidenceCommit!==CURRENT_TECHNICAL_REF.commit)fail('CURRENT_EQUIVALENCE');
 if(oldVisual.schemaVersion!=='archive-independent-m1s2-problem-seven-ui-review-v1'||oldVisual.decision!==DECISION||
    oldVisual.newMathQa!==0||oldVisual.newSemanticApproval!==0||oldVisual.newFourSlotVector!==0||
    !eq(oldVisual.technicalRef,PRIOR_TECHNICAL_REF)||v.reviewer!==oldVisual.reviewer||
    !Array.isArray(oldVisual.records)||oldVisual.records.length!==14||!eq(v.records,oldVisual.records))fail('CURRENT_PRIOR_VISUAL');
 if(prior.schemaVersion!=='archive-m1s2-problem-seven-github-ui-raw-v1'||
    prior.status!=='TECHNICAL_PASS_VISUAL_REVIEW_PENDING'||!Array.isArray(prior.results)||prior.results.length!==14||
    !Array.isArray(t.results)||t.results.length!==14||!eq(prior.screenshotArtifacts,t.screenshotArtifacts))fail('CURRENT_CAPTURE_REUSE');
 const stripItem=x=>({...x,sourceRef:withoutCommit(x.sourceRef),assetRef:withoutCommit(x.assetRef)});
 if(!Array.isArray(t.items)||!Array.isArray(prior.items)||!eq(t.items.map(stripItem),prior.items.map(stripItem))||
    !eq(withoutCommit(t.manifestRef),withoutCommit(prior.manifestRef))||
    !Array.isArray(t.mirroredAssets)||!eq(t.mirroredAssets.map(withoutCommit),prior.mirroredAssets.map(withoutCommit)))fail('CURRENT_APPROVED_INPUTS');
 const oldFonts=new Map((prior.studentFontResources||[]).map(f=>[f.resourceId,f]));
 const newFonts=new Map((t.studentFontResources||[]).map(f=>[f.resourceId,f]));
 if(oldFonts.size!==prior.studentFontResources?.length||newFonts.size!==t.studentFontResources?.length||
    oldFonts.size!==newFonts.size||[...newFonts].some(([id,f])=>!oldFonts.has(id)||!eq(withoutCommit(f),withoutCommit(oldFonts.get(id)))))fail('CURRENT_FONT_INVENTORY');
 for(let i=0;i<14;i++){
  const a=prior.results[i],b=t.results[i];
  if(a.questionUid!==b.questionUid||a.sourceOrdinal!==b.sourceOrdinal||!eq(a.viewport,b.viewport)||
     a.surface!==b.surface||a.mode!==b.mode||a.questionSha256!==b.questionSha256||
     !eq(withoutCommit(a.sourceRef),withoutCommit(b.sourceRef))||
     !eq(a.assetRefs.map(withoutCommit),b.assetRefs.map(withoutCommit))||
     !['capture','screenshots','geometry','surfaceStructure','pageErrors','requestFailures','externalRequests'].every(k=>eq(a[k],b[k])))fail('CURRENT_CAPTURE_REUSE');
  const before={...a.technical},after={...b.technical};delete before.fontResourceIds;delete after.fontResourceIds;
  if(!eq(before,after)||!Array.isArray(b.technical.fontResourceIds)||
     new Set(b.technical.fontResourceIds).size!==b.technical.fontResourceIds.length||
     b.technical.fontResourceIds.some(id=>!a.technical.fontResourceIds.includes(id)||!newFonts.has(id)))fail('CURRENT_FONT_CASE_REUSE');
 }
 if(!Array.isArray(oldVisual.artifactRefs)||oldVisual.artifactRefs.length!==14)fail('CURRENT_PRIOR_PNG');
 const expectedArtifacts=oldVisual.artifactRefs.map(ref=>({...ref,commit:CURRENT_TECHNICAL_REF.commit,
  path:CURRENT_ARTIFACT_PREFIX+path.posix.basename(ref.path)}));
 const byPath=refs=>refs.slice().sort((a,b)=>a.path.localeCompare(b.path));
 if(!Array.isArray(v.artifactRefs)||new Set(v.artifactRefs.map(r=>r.path)).size!==14||!eq(byPath(v.artifactRefs),byPath(expectedArtifacts)))fail('CURRENT_PNG_REUSE');
 const profile=unique(assembly.profileReceipts,x=>x.profile==='m1','CURRENT_TRANSPORT_PROFILE');
 if(assembly.checkoutCommit!==CURRENT_CAPTURE_HEAD||String(assembly.runId)!==CURRENT_EXECUTION.runId||
    profile.logical!==14||profile.png!==14||profile.files!==15||profile.technicalGit!==CURRENT_TECHNICAL_REF.gitBlobSha1||
    profile.technicalRaw!==CURRENT_TECHNICAL_REF.sha256||assembly.checks?.pngFullRemoteReadback!==true)fail('CURRENT_TRANSPORT');
 for(const ref of oldVisual.artifactRefs){
  const bytes=reader.read(ref),name=path.posix.basename(ref.path);
  if(bytes.length<PNG_SIGNATURE.length||!bytes.subarray(0,PNG_SIGNATURE.length).equals(PNG_SIGNATURE))fail('CURRENT_PRIOR_PNG');
  const rb=unique(assembly.pngReadbacks,x=>x.profile==='m1'&&x.path===name,'CURRENT_TRANSPORT_PNG');
  if(rb.git!==ref.gitBlobSha1||rb.raw!==ref.sha256||rb.bytes!==ref.bytes||rb.readback!==true)fail('CURRENT_TRANSPORT_PNG');
 }
 return true;
}

module.exports={verify,coverage,PINS,DECISION,capturedRef,visualTechnicalRef,selectedDataRows,svgRecords,svgContinuity,capturedArtifacts,surfaceTopology,currentData,
 currentReuseRequested,verifyCurrentCaptureExecution,verifyCurrentVisualReuse,CURRENT_OWNER,CURRENT_VISUAL_SCHEMA,CURRENT_CAPTURE_HEAD,CURRENT_PINS,
 CURRENT_TECHNICAL_REF,CURRENT_VISUAL_REF,CURRENT_EQUIVALENCE_REF,CURRENT_INDEPENDENT_REF,CURRENT_REASSEMBLY_REF,PRIOR_TECHNICAL_REF,PRIOR_VISUAL_REF};
