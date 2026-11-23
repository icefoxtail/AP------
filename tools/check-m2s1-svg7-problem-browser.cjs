'use strict';
// Closed M2S1 SVG7 GitHub Actions producer. Reuses the unchanged capture, font,
// lifecycle and surface geometry functions. Technical capture grants no approval.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const Surface=require('./capture-m1s2-problem-surface.cjs');
const Q15Surface=require('./capture-m2s1-svg7-problem-surface.cjs');
const {stable,sha256,gitBlob,createGitReader,checkedStudentFontRefs,studentFontResourcePath,createStudentRouteLifecycle,serveStudentFont,closeStudentContext,captureProblemTiles,readScreenshotArtifacts,assertScreenshotInventory,FONT_DIR,FONT_STYLESHEET}=H;
const BASE_COMMIT='d7111057c89ad4f4a418e2805eeeb1b04447f99f';
const SURFACE_PATH='tools/capture-m1s2-problem-surface.cjs';
const Q15_SURFACE_PATH='tools/capture-m2s1-svg7-problem-surface.cjs';
function surfaceRoute(item,viewport){
 if(item.questionUid===Q15Surface.UID){Q15Surface.assertQ15Binding(item);return 'Q15_EMBEDDED_CHOICES';}
 if(item.questionUid===Q15Surface.Q24_UID&&viewport?.name==='mobile'){Q15Surface.assertQ24Binding(item,viewport);return 'Q24_MOBILE_NATIVE_ATOMS';}
 if(item.questionUid===Q15Surface.E045_Q24_UID&&viewport?.name==='mobile'){Q15Surface.assertE045Q24Binding(item,viewport);return 'E045_Q24_MOBILE_NATIVE_PARAGRAPHS';}
 return 'SHARED_SURFACE';
}
// Preserve only known failure codes from Playwright's error wrapper. Neither
// the original message nor browser/student text is written to public proof.
const Q15_FAILURE_CODES=new Set(['SCOPE','EMBEDDED_CHOICES','WHOLE_QUESTION','SURFACE_REQUIRED','SURFACE_KEYS','SURFACE_SCOPE',
 'SURFACE_COMPLETENESS','STATEMENT_REQUIRED','DIRECT_TOPOLOGY','CHILD_ORDER','EXTRA_ELEMENT','OUTSIDE_TEXT','EXTRA_NODE',
 'OUTER_TWO','ROLE_TOPOLOGY','VISIBLE_ORDINAL','PARAGRAPHS_TWO','PARAGRAPH_ROLES','IMAGE_ROLE','IMAGE_PATH','IMAGE_READY',
 'REQUIRED_ELEMENT_HIDDEN','ROLE_CLIPPED','STATEMENT_HIDDEN','STATEMENT_RANGE','STATEMENT_NODE','MATH_ATOM',
 'STATEMENT_ELEMENT','BREAK_NODE','SEMANTIC_ROLES_OVERLAP'].map(code=>'UI_Q15_'+code));
const Q24_FAILURE_CODES=new Set(['SCOPE','VIEWPORT','SUBJECTIVE_SCOPE','WHOLE_QUESTION','SURFACE_REQUIRED','SURFACE_KEYS','SURFACE_SCOPE',
 'SURFACE_COMPLETENESS','CONTENT_ACCOUNTING','DIRECT_TOPOLOGY','OUTER_THREE','ROLE_TOPOLOGY','EXTRA_ELEMENT','OUTSIDE_TEXT','EXTRA_NODE',
 'VISIBLE_ORDINAL','CONTENT_TOPOLOGY','IMAGE_ROLE','IMAGE_PATH','IMAGE_READY','REQUIRED_ELEMENT_HIDDEN','ROLE_CLIPPED','ANSWER_NOT_EMPTY',
 'EMPTY_ANSWER_GEOMETRY','CONTENT_RANGE','DUPLICATE_ATOM','DUPLICATE_NODE','CONTENT_HIDDEN','CONTENT_NODE','MATH_ATOM','CONTENT_ELEMENT','BREAK_NODE'].map(code=>'UI_Q24_'+code));
const E045_Q24_FAILURE_CODES=new Set(['SCOPE','VIEWPORT','SUBJECTIVE_SCOPE','WHOLE_QUESTION','SURFACE_REQUIRED','SURFACE_KEYS','SURFACE_SCOPE',
 'SURFACE_COMPLETENESS','PARAGRAPH_ACCOUNTING','CONTENT_ACCOUNTING','DIRECT_TOPOLOGY','CHILD_ORDER','EXTRA_ELEMENT','OUTSIDE_TEXT','EXTRA_NODE',
 'OUTER_THREE','ROLE_TOPOLOGY','VISIBLE_ORDINAL','PARAGRAPHS_FIVE','IMAGE_ROLE','IMAGE_PATH','IMAGE_READY','REQUIRED_ELEMENT_HIDDEN','ROLE_CLIPPED',
 'ANSWER_NOT_EMPTY','EMPTY_ANSWER_GEOMETRY','SEMANTIC_ROLES_OVERLAP','CONTENT_RANGE','DUPLICATE_ATOM','DUPLICATE_NODE','CONTENT_HIDDEN',
 'CONTENT_NODE','MATH_ATOM','CONTENT_ELEMENT','BREAK_NODE'].map(code=>'UI_E045_Q24_'+code));
function safeFailureCode(error,fallback){
 const message=typeof error?.message==='string'?error.message:'';
 if(/^UI_[A-Z0-9_]+$/.test(message))return message;
 const codes=[...new Set(message.match(/\bUI_(?:Q15|Q24|E045_Q24)_[A-Z0-9_]+\b/g)||[])];
 return codes.length===1&&(Q15_FAILURE_CODES.has(codes[0])||Q24_FAILURE_CODES.has(codes[0])||E045_Q24_FAILURE_CODES.has(codes[0]))?codes[0]:fallback;
}
// Failure-only browser reader: no text, HTML, URLs, choices or solutions leave
// the page. It neither mutates DOM nor decides whether capture can proceed.
function inspectQ15FailureMetadata(image,scope){
 const box=image.closest('.q-box');
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return Object.fromEntries(['x','y','width','height'].map(k=>[k,Number.isFinite(r[k])?r[k]:null]));};
 const css=e=>{if(!e)return null;const s=getComputedStyle(e);return{displayNone:s.display==='none',visibilityHidden:s.visibility==='hidden'||s.visibility==='collapse',opacityZero:Number(s.opacity)===0};};
 const visible=e=>{for(let n=e;n&&box?.contains(n);n=n.parentElement){const r=rect(n),s=css(n);if(s.displayNone||s.visibilityHidden||s.opacityZero||!(r.width>0&&r.height>0))return false;}return Boolean(e&&box?.contains(e));};
 const role=e=>e?{nodeType:e.nodeType,tagName:e.tagName,elementChildren:e.children.length,
  nonemptyDirectTextNodes:[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&Boolean(n.textContent.trim())).length,
  rect:rect(e),css:css(e),visibleWithinQuestion:visible(e)}:null;
 const number=box?.querySelectorAll('.q-num')[0],content=box?.querySelectorAll('.q-content')[0];
 const statement=content?.children[0],figure=content?.children[1];
 const atoms=[];let visitedNodes=0,truncated=false;
 const walk=(node,depth)=>{
  if(visitedNodes>=128||depth>16||atoms.length>=64){truncated=true;return;}visitedNodes++;
  if(node.nodeType===Node.TEXT_NODE){if(!node.textContent.trim())return;const range=document.createRange();range.selectNodeContents(node);
   const all=[...range.getClientRects()];if(all.length>16)truncated=true;
   atoms.push({kind:'NONEMPTY_TEXT_RANGE',parentTag:node.parentElement?.tagName||null,visibleWithinQuestion:visible(node.parentElement),
    rects:all.slice(0,16).map(r=>Object.fromEntries(['x','y','width','height'].map(k=>[k,Number.isFinite(r[k])?r[k]:null])))});return;}
  if(node.nodeType!==Node.ELEMENT_NODE)return;
  if(node.tagName==='MJX-CONTAINER'){atoms.push({kind:'GENERATED_MATH_ATOM',rect:rect(node),visibleWithinQuestion:visible(node)});return;}
  for(const child of node.childNodes)walk(child,depth+1);
 };
 if(statement)for(const child of statement.childNodes)walk(child,0);
 let imagePathMatchesScope=false;
 try{const url=new URL(image.currentSrc||image.src,document.baseURI),expected='https://img.wangjiedu.com/exams/images/'+scope.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
  imagePathMatchesScope=url.href===expected&&(image.currentSrc||image.src)===expected&&image.src===expected;
 }catch{}
 return{schemaVersion:'archive-m2s1-q15-failure-diagnostic-v1',status:'OBSERVATION_ONLY_NO_ACCEPTANCE',
  outerElementCount:box?.children.length??null,numberCount:box?.querySelectorAll('.q-num').length??null,
  contentCount:box?.querySelectorAll('.q-content').length??null,paragraphCount:content?.children.length??null,
  nestedQuestionCount:box?.querySelectorAll('.q-box').length??null,imageCount:box?.querySelectorAll('img').length??null,
  roles:{question:role(box),number:role(number),content:role(content),statement:role(statement),figure:role(figure),image:role(image)},
  statementAtoms:atoms,visitedNodes,truncated,imagePathMatchesScope,imageComplete:Boolean(image.complete),
  naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,
  viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},domWrites:0};
}
async function captureQ15WithDiagnostics(page,target,file,item,activeCase,diagnostics){
 try{return await Q15Surface.captureQ15Tiles(page,target,file,item);}
 catch(error){
  const row={key:activeCase.key,questionUid:activeCase.questionUid,sourceOrdinal:activeCase.sourceOrdinal,viewport:activeCase.viewport,
   kind:'Q15_CAPTURE_FAILURE',failureCode:safeFailureCode(error,'UI_BROWSER_CHECK_FAILED'),errorMessageSha256:sha256(error.message||'')};
  try{row.observation=await target.evaluate(inspectQ15FailureMetadata,Q15Surface.BROWSER_SCOPE);}
  catch(diagnosticError){row.observation={status:'UNAVAILABLE',errorMessageSha256:sha256(diagnosticError.message||'')};}
  diagnostics.push(row);
  throw error;
 }
}
// The shared capture remains strict. Observe the known Q24 mobile failure only
// after it has failed; record no DOM text/HTML/URL and never replace the error.
async function inspectQ24FailureMetadata(image){
 const box=image.closest('.q-box'),wrappers=box?[...box.children].filter(n=>n.matches('.ap-slot-content')):[];
 const equalSlot=Boolean(box?.classList.contains('ap-equal-slot'));
 const container=equalSlot&&wrappers.length===1?wrappers[0]:box;
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return Object.fromEntries(['x','y','width','height'].map(k=>[k,Number.isFinite(r[k])?r[k]:null]));};
 const role=e=>{
  if(!e)return null;const r=rect(e),s=getComputedStyle(e),opacity=Number(s.opacity);
  const visible=s.display!=='none'&&!['hidden','collapse'].includes(s.visibility)&&opacity!==0&&r.width>0&&r.height>0;
  return{nodeType:e.nodeType,tagName:['DIV','P','SPAN','IMG','SVG','MATH','MJX-CONTAINER','UL','OL','TABLE'].includes(e.tagName)?e.tagName:'OTHER',
   roles:{number:e.matches('.q-num'),content:e.matches('.q-content'),answerBox:e.matches('.answer-box'),choices:e.matches('.choices'),imageWrapper:e.matches('.q-image-wrap')},
   rect:r,css:{displayNone:s.display==='none',visibilityHidden:s.visibility==='hidden',visibilityCollapse:s.visibility==='collapse',opacity:Number.isFinite(opacity)?opacity:null},
   visibleBySharedRule:visible,nonemptyText:Boolean(e.textContent.trim()),elementChildren:e.children.length,
   directNonemptyTextNodes:[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&Boolean(n.textContent.trim())).length,
   imageCount:e.querySelectorAll('img').length,mathCount:e.querySelectorAll('math,mjx-container').length};
 };
 const children=container?[...container.children]:[];
 const digest=box?await crypto.subtle.digest('SHA-256',new TextEncoder().encode(box.outerHTML)):null;
 return{schemaVersion:'archive-m2s1-q24-failure-diagnostic-v1',status:'OBSERVATION_ONLY_NO_ACCEPTANCE',
  equalSlot,wrapperCount:wrappers.length,outerElementCount:box?.children.length??null,containerElementCount:children.length,
  roles:{question:role(box),container:role(container),targetImage:role(image)},
  children:children.slice(0,16).map((e,index)=>({index,...role(e)})),truncated:children.length>16,
  numberCount:box?.querySelectorAll('.q-num').length??null,contentCount:box?.querySelectorAll('.q-content').length??null,
  answerBoxCount:box?.querySelectorAll('.answer-box').length??null,nestedQuestionCount:box?.querySelectorAll('.q-box').length??null,
  domSha256:digest?[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join(''):null,
  viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},domWrites:0};
}
async function captureSharedWithDiagnostics(page,target,file,item,activeCase,diagnostics,measuredSurface){
 try{Surface.assertSurfaceTopology(measuredSurface.surface);return await Surface.captureM1ProblemTiles(page,target,file);}
 catch(error){
  const selected=item.key==='E048-Q24'&&item.questionUid==='qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad'&&item.sourceOrdinal===24&&
   item.questionSha256==='6af32349e8c99b6a75b05aae09dec93eb95cf45b28399e1cfc5d897494440d7a'&&
   activeCase.key===item.key&&activeCase.questionUid===item.questionUid&&activeCase.sourceOrdinal===24&&activeCase.viewport==='mobile'&&
   measuredSurface.viewport?.width===390&&measuredSurface.viewport?.height===844;
  const selectedE045=item.key==='E045-Q24'&&item.questionUid==='qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd'&&item.sourceOrdinal===24&&
   item.questionSha256==='6bbba32d209bd4dedfd6b154d86c986a059e69ac883b52bc963b67db17a36ae8'&&
   item.sourceRef?.path==='archive/exams/original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js'&&
   item.sourceRef.gitBlobSha1==='c8945961f52f7efca83d66ea045d070e74718de6'&&item.sourceRef.sha256==='c1d8ce4c3de70c67d7a3ecf02031fd48327103785fec40505e1576043625618a'&&item.sourceRef.bytes===44656&&
   item.assetRef?.path==='archive/assets/images/21_팔마중_1학기_기말_중2_수학/q24-problem-visual-v2-source-repair-r2.svg'&&
   item.assetRef.gitBlobSha1==='6ddf55bc8a7575124342f996cd654b6df3ca5013'&&item.assetRef.sha256==='a7f34be6ce3556987911922fe8df74cfca412de47f8ce1af3d0dd4bccc8c3749'&&item.assetRef.bytes===10634&&
   activeCase.key===item.key&&activeCase.questionUid===item.questionUid&&activeCase.sourceOrdinal===24&&activeCase.viewport==='mobile'&&
   measuredSurface.viewport?.width===390&&measuredSurface.viewport?.height===844;
  if(selected||selectedE045){
   const row={key:item.key,questionUid:item.questionUid,sourceOrdinal:24,viewport:'mobile',kind:'Q24_SHARED_CAPTURE_FAILURE',
    failureCode:safeFailureCode(error,'UI_BROWSER_CHECK_FAILED'),errorMessageSha256:sha256(error.message||'')};
   try{row.observation=await target.evaluate(inspectQ24FailureMetadata);row.sameDomAsInitialMeasurement=row.observation.domSha256===measuredSurface.domSha256;}
   catch(diagnosticError){row.observation={status:'UNAVAILABLE',errorMessageSha256:sha256(diagnosticError.message||'')};}
   diagnostics.push(row);
  }
  throw error;
 }
}
async function captureQ24WithDiagnostics(page,target,file,item,activeCase,diagnostics,measuredSurface,viewport){
 try{return await Q15Surface.captureQ24Tiles(page,target,file,item,viewport);}
 catch(error){
  const row={key:activeCase.key,questionUid:activeCase.questionUid,sourceOrdinal:activeCase.sourceOrdinal,viewport:activeCase.viewport,
   kind:'Q24_NATIVE_CAPTURE_FAILURE',failureCode:safeFailureCode(error,'UI_BROWSER_CHECK_FAILED'),errorMessageSha256:sha256(error.message||'')};
  try{row.observation=await target.evaluate(inspectQ24FailureMetadata);row.sameDomAsInitialMeasurement=row.observation.domSha256===measuredSurface.domSha256;}
  catch(diagnosticError){row.observation={status:'UNAVAILABLE',errorMessageSha256:sha256(diagnosticError.message||'')};}
  diagnostics.push(row);throw error;
 }
}
async function captureE045Q24WithDiagnostics(page,target,file,item,activeCase,diagnostics,measuredSurface,viewport){
 try{return await Q15Surface.captureE045Q24Tiles(page,target,file,item,viewport);}
 catch(error){
  const row={key:activeCase.key,questionUid:activeCase.questionUid,sourceOrdinal:activeCase.sourceOrdinal,viewport:activeCase.viewport,
   kind:'E045_Q24_NATIVE_CAPTURE_FAILURE',failureCode:safeFailureCode(error,'UI_BROWSER_CHECK_FAILED'),errorMessageSha256:sha256(error.message||'')};
  try{row.observation=await target.evaluate(inspectQ24FailureMetadata);row.sameDomAsInitialMeasurement=row.observation.domSha256===measuredSurface.domSha256;}
  catch(diagnosticError){row.observation={status:'UNAVAILABLE',errorMessageSha256:sha256(diagnosticError.message||'')};}
  diagnostics.push(row);throw error;
 }
}
const MANIFEST_PATH='tests/fixtures/archive-m2s1-svg7-problem-ui.json',CHECKER_PATH='tools/check-m2s1-svg7-problem-browser.cjs',SHARED_CHECKER_PATH='tools/check-reviewed-problem-renderer-browser.cjs';
const MANIFEST_SHA="6d79b0597fcdf0fe90490a408c467f223f753c0b81a0be06f0da49a64a88701b",CAPTURE_SHA='e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673',IDENTITY_PATH='archive/data/question_identity_map.json';
const SCHEMA='archive-m2s1-svg7-problem-github-ui-raw-v1',FONT_FAMILY='Nanum Myeongjo';
const EXPECTED_UIDS=["qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6","qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5","qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec","qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637","qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad","qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd","qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569"];
function validateManifest(m){assert.equal(sha256(stable(m)),MANIFEST_SHA,'UI_CLOSED_MANIFEST');assert.equal(m.expectedCases,14,'UI_CASES');assert.deepEqual(m.items.map(r=>r.questionUid),EXPECTED_UIDS,'UI_EXACT_SEVEN');return m;}
function validateInlinePointer(question,item){
  assert.equal(item.pointerField,'content','UI_POINTER_FIELD');assert.equal(item.pointerKind,'EXACT_SINGLE_IMG_SRC_URI','UI_POINTER_KIND');
  assert.equal(typeof question.content,'string','UI_CONTENT_REQUIRED');assert.equal(sha256(question.content),item.contentSha256,'UI_CONTENT_DRIFT');
  const tags=question.content.match(/<img\b[^>]*>/gi)||[];assert.equal(tags.length,1,'UI_SINGLE_INLINE_PROBLEM_IMAGE');
  const src=tags[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);assert(src,'UI_EXPLICIT_QUOTED_IMAGE_SRC');
  assert.equal(src[2],item.assetPath.slice('archive/'.length),'UI_IMAGE_POINTER_MISMATCH');
  assert(!/\bsrcset\s*=|<(?:svg|object|iframe|image)\b/i.test(question.content),'UI_ALTERNATE_IMAGE_CARRIER');
  const carriers=Object.fromEntries(['image','images','figureSvg','svg'].map(k=>[k,Object.hasOwn(question,k)?{present:true,value:question[k]}:{present:false}]));
  assert.equal(sha256(stable(carriers)),item.inheritedProblemCarriersSha256,'UI_INHERITED_PROBLEM_CARRIER_DRIFT');
}
function validateIdentity(identity,item){
  assert(Array.isArray(identity?.records),'UI_IDENTITY_RECORDS');
  const matched=identity.records.filter(r=>r.sourceArchiveFile===item.sourcePath.slice('archive/exams/'.length)&&Number(r.sourceOrdinal)===item.sourceOrdinal);
  assert.equal(matched.length,1,'UI_UNIQUE_IDENTITY_RECORD');assert.equal(matched[0].questionUid,item.questionUid,'UI_IDENTITY_UID_MISMATCH');
  assert.equal(identity.records.filter(r=>r.questionUid===item.questionUid).length,1,'UI_GLOBAL_UID_USE_ONE');
  assert.equal(sha256(stable(matched[0])),item.identityRowSha256,'UI_IDENTITY_ROW_DRIFT');
  return matched[0];
}
function loadQuestions(bytes){const s={window:{}};vm.runInNewContext(bytes.toString('utf8'),s,{timeout:1500,filename:'selected-source.js',contextCodeGeneration:{strings:false,wasm:false}});const b=s.window.questionBank??s.questionBank??s.window.examData?.questions??s.examData?.questions;assert(Array.isArray(b),'UI_BANK_REQUIRED');return JSON.parse(JSON.stringify(b));}
const mime=rel=>({'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(rel)]||'application/octet-stream');
function preflight(reader, manifest) {
  validateManifest(manifest);
  const identityBytes = reader.read(IDENTITY_PATH);
  const identity = JSON.parse(identityBytes);
  assert(Array.isArray(identity.records), 'UI_IDENTITY_RECORDS');
  const banks = new Map();
  const items = manifest.items.map(item => {
    if (!banks.has(item.sourcePath)) {
      const bytes = reader.read(item.sourcePath);
      banks.set(item.sourcePath, { bytes, questions: loadQuestions(bytes) });
    }
    const { bytes, questions } = banks.get(item.sourcePath);
    assert.equal(gitBlob(bytes),item.sourceGitBlobSha1,'UI_SOURCE_GIT_DRIFT');assert.equal(sha256(bytes),item.sourceSha256,'UI_SOURCE_RAW_DRIFT');assert.equal(bytes.length,item.sourceBytes,'UI_SOURCE_SIZE_DRIFT');assert.equal(questions.length,item.expectedBankCount,'UI_BANK_COUNT');
    const question = questions[item.sourceOrdinal - 1];
    assert.equal(sha256(stable(question)),item.questionSha256,'UI_WHOLE_QUESTION_DRIFT');
    assert(question && String(question.id ?? question.number) === String(item.sourceOrdinal), 'UI_QUESTION_ORDINAL_MISMATCH');
    validateIdentity(identity,item);
    assert.equal(sha256(stable({ content: question.content ?? question.question, choices: question.choices ?? [] })), item.problemPayloadSha256, 'UI_PROBLEM_PAYLOAD_DRIFT');
    validateInlinePointer(question,item);
    if(item.questionUid===Q15Surface.UID)Q15Surface.assertQ15Preflight(question,item);
    if(item.questionUid===Q15Surface.Q24_UID)Q15Surface.assertQ24Preflight(question,item);
    if(item.questionUid===Q15Surface.E045_Q24_UID)Q15Surface.assertE045Q24Preflight(question,item);
    assert.equal(sha256(stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag })), item.presentationSha256, 'UI_PRESENTATION_DRIFT');
    const asset = reader.read(item.assetPath);
    assert.equal(sha256(asset), item.assetSha256, 'UI_REVIEWED_ASSET_DRIFT');assert.equal(gitBlob(asset),item.assetGitBlobSha1,'UI_ASSET_GIT_DRIFT');assert.equal(asset.length,item.assetBytes,'UI_ASSET_SIZE_DRIFT');
    return { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
      questionSha256:item.questionSha256, problemPayloadSha256: item.problemPayloadSha256, presentationSha256: item.presentationSha256,
      sourceRef: reader.ref(item.sourcePath, bytes), assetRef: reader.ref(item.assetPath, asset) };
  });
  return { identityRef: reader.ref(IDENTITY_PATH, identityBytes), items };
}

function executionProvenance(expectedCommit,env=process.env,event=null){
  assert.equal(env.GITHUB_ACTIONS,'true','UI_GITHUB_ACTIONS_REQUIRED');
  assert.equal(env.GITHUB_EVENT_NAME,'pull_request','UI_PR_EVENT_REQUIRED');
  assert.equal(env.GITHUB_REPOSITORY,'icefoxtail/AP------','UI_REPOSITORY');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||''),'UI_RUN_ID');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||''),'UI_RUN_ATTEMPT');
  assert(String(env.GITHUB_WORKFLOW||'').trim()&&/^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'UI_WORKFLOW_JOB');
  assert(/^[a-f0-9]{40}$/.test(expectedCommit||'')&&/^[a-f0-9]{40}$/.test(env.GITHUB_SHA||''),'UI_HEAD_SHA');
  const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
  const pr=payload.pull_request;
  assert(pr&&!pr.head?.repo?.fork&&pr.head?.repo?.full_name===env.GITHUB_REPOSITORY&&pr.base?.repo?.full_name===env.GITHUB_REPOSITORY,'UI_SAME_REPOSITORY_PR');
  assert.equal(pr.head.sha,expectedCommit,'UI_EXACT_PR_HEAD');
  assert(Number.isSafeInteger(payload.number)&&payload.number>0&&/^[a-f0-9]{40}$/.test(pr.base.sha||''),'UI_PR_IDENTITY');
  return{provider:'GITHUB_ACTIONS',eventName:'pull_request',repository:env.GITHUB_REPOSITORY,workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB,
    runId:env.GITHUB_RUN_ID,runAttempt:Number(env.GITHUB_RUN_ATTEMPT),pullRequest:payload.number,headSha:expectedCommit,baseSha:pr.base.sha,eventSha:env.GITHUB_SHA,
    runUrl:'https://github.com/'+env.GITHUB_REPOSITORY+'/actions/runs/'+env.GITHUB_RUN_ID};
}
async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  const execution=executionProvenance(expectedCommit);
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  assert.equal(reader.ref(SHARED_CHECKER_PATH).sha256, CAPTURE_SHA, 'UI_CAPTURE_HELPER_DRIFT');
  assert.equal(reader.ref(SURFACE_PATH).sha256,'86b0e6761544480a688930928484e1f944e9e47e0ab2347aa22a35331891f5cf','UI_SURFACE_HELPER_DRIFT');
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [], surfaceDiagnostics=[];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_CHROMIUM_EXACT_PR_HEAD', execution, checkoutCommit: reader.commit, baseCommit: BASE_COMMIT,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef: reader.ref(SHARED_CHECKER_PATH), surfaceHelperRef:reader.ref(SURFACE_PATH), scopedSurfaceHelperRef:reader.ref(Q15_SURFACE_PATH), ...inputs,
    mode: 'exam', studentReview: true, screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0,
    solutionsOpened: false, productionCdnTest: false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertScreenshotInventory(results, screenshotArtifacts);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases: manifest.expectedCases,
      completedLogicalCases: results.length, screenshotArtifactCount: screenshotArtifacts.length, screenshotArtifacts,
      results, surfaceDiagnostics, servedFiles: [...served.values()], mirroredAssets: [...mirrored.values()],
      studentFontResources: [...studentFontResources.values()], externalFontResources: [], failures };
    fs.writeFileSync(path.join(out, 'technical-proof.json'), JSON.stringify(proof, null, 2) + '\n');
    return proof;
  };
  let browser;
  const server = http.createServer((request, response) => {
    try {
      const rel = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\//, '');
      if (rel === 'favicon.ico') { response.writeHead(204); response.end(); return; }
      // The engine also loads its tracked ../apmath navigation resources.
      // read() requires an exact regular file in this immutable checkout tree;
      // it cannot expose an untracked file, symlink, traversal or Git internals.
      const bytes = reader.read(rel);
      served.set(rel, reader.ref(rel, bytes));
      response.writeHead(200, { 'Content-Type': mime(rel), 'Cache-Control': 'no-store' });
      response.end(bytes);
    } catch {
      failures.push({ code: 'UI_STATIC_FILE_UNAVAILABLE', requestSha256: sha256(request.url || '') });
      response.writeHead(404); response.end();
    }
  });
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 600000);
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath, headless: true, timeout: 30000 });
    proofBase.browserVersion = browser.version();
    const banks = [...new Set(manifest.items.map(item => item.sourcePath))];
    for (const viewport of manifest.viewports) for (const sourcePath of banks) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
        isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', serviceWorkers: 'block' });
      let page, casesCompleted = false, caseFailure = null;
      const pageErrors = [], requestFailures = [], externalRequests = [];
      const fontState = { declaredFonts: new Set(), fontRefs, fontWeights, studentFontResources, fontResources: new Map(), failures };
      const routeLifecycle = createStudentRouteLifecycle(failures);
      try {
        page = await context.newPage();
        page.setDefaultTimeout(10000);
        page.on('pageerror', error => pageErrors.push({ messageSha256: sha256(error.message) }));
        page.on('requestfailed', request => requestFailures.push({ urlSha256: sha256(request.url()), errorSha256: sha256(request.failure()?.errorText || '') }));
        await page.route('**/*', routeLifecycle.wrap(async route => {
          const url = new URL(route.request().url());
          const fontPath = studentFontResourcePath(url.href, origin, fontRefs);
          if (fontPath) {
            return serveStudentFont(route, url, fontPath, fontState);
          }
          if (url.origin === origin) {
            if (url.pathname.startsWith('/' + FONT_DIR)) {
              failures.push({ code: 'UI_FONT_NOT_DECLARED', requestSha256: sha256(url.href) });
              return route.abort('blockedbyclient');
            }
            return route.continue();
          }
          if (url.protocol === 'https:' && url.hostname === 'img.wangjiedu.com' && url.pathname.startsWith('/exams/images/')) {
            try {
              const rel = 'archive/assets/images/' + decodeURIComponent(url.pathname.slice('/exams/images/'.length));
              const bytes = reader.read(rel);
              mirrored.set(rel, reader.ref(rel, bytes));
              return route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' }, contentType: mime(rel), body: bytes });
            } catch { failures.push({ code: 'UI_MIRRORED_ASSET_UNAVAILABLE', requestSha256: sha256(route.request().url()) }); }
          }
          externalRequests.push({ host: url.hostname, urlSha256: sha256(url.href) });
          return route.abort('blockedbyclient');
        }));
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=exam&fit=screen&studentReview=1&figureZoom=0`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(() => {
          const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}');
          return readiness.state === 'RENDER_READY' && typeof AppState !== 'undefined' && AppState.mode === 'exam' && AppState.data.length > 0;
        }, null, { timeout: 40000 });
        const fontReadiness = await page.evaluate(async family => {
          await document.fonts.ready;
          const weights = [];
          for (const weight of [400, 700, 800]) {
            const faces = await document.fonts.load(`${weight} 12px "${family}"`, '한글 ABC 123');
            weights.push({ weight, loadedFaces: faces.length, allLoaded: faces.length > 0 && faces.every(face =>
              face.status === 'loaded' && face.family.replace(/["']/g, '') === family &&
              face.weight === String(weight) && face.style === 'normal'), checked: document.fonts.check(`${weight} 12px "${family}"`, '한글 ABC 123') });
          }
          await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return { status: document.fonts.status, family, weights,
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content')].map(node => getComputedStyle(node).fontFamily))] };
        }, FONT_FAMILY);
        assert.equal(fontReadiness.status, 'loaded', 'UI_DOCUMENT_FONTS_READY');
        assert(fontReadiness.weights.every(row => row.allLoaded && row.checked), 'UI_STUDENT_FONT_NOT_LOADED');
        assert(fontReadiness.problemFontFamilies.length > 0 && fontReadiness.problemFontFamilies.every(value => value.includes(FONT_FAMILY)), 'UI_STUDENT_FONT_NOT_APPLIED');
        // Resource evidence is recorded when Playwright's fulfillment settles.
        await routeLifecycle.drain();
        routeLifecycle.assertSettled();
        const respondingWeights = [...fontState.fontResources.keys()].map(file => fontWeights.get(file));
        assert(fontState.fontResources.has(FONT_STYLESHEET) && fontReadiness.weights.every(row =>
          respondingWeights.filter(weight => weight === row.weight).length >= row.loadedFaces),
          'UI_FONT_RESPONSES_REQUIRED');
        await page.waitForFunction(() => JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state === 'RENDER_READY', null, { timeout: 30000 });
        const technical = await page.evaluate(() => ({
          mode: AppState.mode, questions: AppState.data.length, pages: document.querySelectorAll('#print-area .page').length,
          readiness: JSON.parse(document.documentElement.dataset.apPrintReadiness || '{}').state,
          imagesComplete: [...document.querySelectorAll('#print-area img')].every(image => image.complete && image.naturalWidth > 0),
          mathErrors: document.querySelectorAll('#print-area mjx-merror,#print-area [data-mjx-error]').length,
          unrenderedMath: window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')),
          mathJaxSource: window.__AP_MATHJAX_SOURCE__,
          solutionNodes: document.querySelectorAll('#print-area .sol-box,#print-area .sol-meta,#print-area .sol-ans,#print-area .sol-exp,#print-area .ans-v').length
        }));
        assert.equal(technical.mode, 'exam', 'UI_EXAM_MODE');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        assert.equal(technical.solutionNodes, 0, 'UI_PROBLEM_ONLY');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for (const item of inputs.items.filter(row => row.sourceRef.path === sourcePath)) {
          activeCase = { key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport: viewport.name };
          const target = page.locator(`#print-area img[src*="${path.posix.basename(item.assetRef.path)}"]`);
          assert.equal(await target.count(), 1, 'UI_UNIQUE_PROBLEM_IMAGE');
          const box = target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(), 1, 'UI_UNIQUE_PROBLEM_BOX');
          const screenshotPath = `${item.key}-${viewport.name}.png`;
          const measuredSurface=await target.evaluate(Surface.measureM1ProblemCapture);
          surfaceDiagnostics.push({key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,viewport:viewport.name,surface:measuredSurface.surface});
          const route=surfaceRoute(item,viewport);
          let captured;
          if(route==='Q15_EMBEDDED_CHOICES')captured=await captureQ15WithDiagnostics(page,target,path.join(out,screenshotPath),item,activeCase,surfaceDiagnostics);
          else if(route==='Q24_MOBILE_NATIVE_ATOMS')captured=await captureQ24WithDiagnostics(page,target,path.join(out,screenshotPath),item,activeCase,surfaceDiagnostics,measuredSurface,viewport);
          else if(route==='E045_Q24_MOBILE_NATIVE_PARAGRAPHS')captured=await captureE045Q24WithDiagnostics(page,target,path.join(out,screenshotPath),item,activeCase,surfaceDiagnostics,measuredSurface,viewport);
          else captured=await captureSharedWithDiagnostics(page,target,path.join(out,screenshotPath),item,activeCase,surfaceDiagnostics,measuredSurface);
          const {capture,surface:surfaceStructure}=captured;
          const geometry = await target.evaluate(image => {
            const box = image.closest('.q-box'), a = image.getBoundingClientRect(), b = box.getBoundingClientRect();
            return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
              image: { x: a.x, y: a.y, width: a.width, height: a.height }, question: { x: b.x, y: b.y, width: b.width, height: b.height },
              imageInsideQuestion: a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1,
              questionNumber: box.querySelector('.q-num')?.textContent?.trim() };
          });
          assert(geometry.imageInsideQuestion && geometry.naturalWidth > 0 && geometry.image.width > 0, 'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber || '').match(/^\d+/)?.[0]), item.sourceOrdinal, 'UI_VISIBLE_ORDINAL');
          const screenshots = capture.tiles.map(tile => { const bytes = fs.readFileSync(path.join(out, tile.filename));
            return { tileIndex: tile.tileIndex, path: tile.filename, sha256: sha256(bytes), bytes: bytes.length }; });
          results.push({ status: 'PASS', key: item.key, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, viewport,
            sourceRef: item.sourceRef, assetRef: item.assetRef, assetRefs:[item.assetRef], questionSha256:item.questionSha256, surface:'PROBLEM', surfaceStructure, mode:'exam', screenshots,
            technical: { ...technical, fontReadiness, fontResourceIds: [...fontState.fontResources.values()].sort() }, geometry, capture,
            visualReview: 'PENDING', pageErrors, requestFailures, externalRequests });
          activeCase = null;
        }
        casesCompleted = true;
      } catch (error) {
        caseFailure = error;
        throw error;
      } finally {
        await closeStudentContext(page, context, () => {
          // Inspect real late failures after route settlement and before teardown.
          // If the case already failed, retain that original failure instead.
          if (casesCompleted) assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_LATE_NETWORK_OR_PAGE_FAILURE');
        }, routeLifecycle, caseFailure);
      }
    }
    assert.equal(results.length, manifest.expectedCases, 'UI_ALL_FOURTEEN_REQUIRED');
    assert.equal(new Set(results.map(row => `${row.key}:${row.viewport.name}`)).size, 14, 'UI_UNIQUE_FOURTEEN_REQUIRED');
    assertScreenshotInventory(results, readScreenshotArtifacts(out));
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef, proofBase.checkerRef, proofBase.captureHelperRef, proofBase.surfaceHelperRef, proofBase.scopedSurfaceHelperRef, inputs.identityRef, ...inputs.items.flatMap(row => [row.sourceRef, row.assetRef]), ...served.values(), ...mirrored.values()]) {
      assert.deepEqual(reader.ref(ref.path), ref, 'UI_INPUT_CHANGED_DURING_RUN');
    }
    return writeProof('TECHNICAL_PASS_VISUAL_REVIEW_PENDING');
  } catch (error) {
    writeProof('FAIL', safeFailureCode(error,'UI_BROWSER_CHECK_FAILED'));
    throw error;
  } finally {
    clearTimeout(watchdog);
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}

async function main(){const a=process.argv.slice(2);assert(a.length===4&&a[0]==='--root'&&a[2]==='--output','UI_ARGUMENTS');const root=path.resolve(a[1]),out=path.resolve(a[3]);assert(!out.startsWith(root+path.sep)&&out!==root,'UI_OUTPUT_OUTSIDE_CHECKOUT');assert(!fs.existsSync(out)||fs.readdirSync(out).length===0,'UI_EMPTY_OUTPUT');for(let p=out;p!==path.dirname(p);p=path.dirname(p))if(fs.existsSync(p))assert(!fs.lstatSync(p).isSymbolicLink(),'UI_OUTPUT_SYMLINK');const expectedCommit=process.env.ARCHIVE_M2S1_SVG7_UI_EXPECTED_SHA;assert(/^[a-f0-9]{40}$/.test(expectedCommit||''),'UI_EXPECTED_COMMIT');const p=await inspectStudentUi({root,out,expectedCommit,executablePath:process.env.CHROME_BIN});console.log(JSON.stringify({status:p.status,cases:p.completedLogicalCases,checkoutCommit:p.checkoutCommit,newApprovals:0}));}
module.exports={surfaceRoute,safeFailureCode,inspectQ15FailureMetadata,captureQ15WithDiagnostics,inspectQ24FailureMetadata,captureSharedWithDiagnostics,captureQ24WithDiagnostics,captureE045Q24WithDiagnostics,validateManifest,validateInlinePointer,validateIdentity,preflight,executionProvenance,inspectStudentUi,CAPTURE_SHA,MANIFEST_SHA,BASE_COMMIT};
if(require.main===module)main().catch(e=>{console.error(JSON.stringify({status:'FAIL',failureCode:safeFailureCode(e,'UI_GITHUB_CHROME_FAILED'),errorMessageSha256:sha256(e.message||'')}));process.exitCode=1;});
