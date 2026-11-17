"use strict";
// Closed, read-only current rendering evidence for forty existing-approval
// items. Source files are parsed only as JSON data; no source JS is evaluated.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const H=require('./check-reviewed-problem-renderer-browser.cjs');
const Capture=require('./capture-m2s1-stale-forty-surfaces.cjs');
const Fragments=require('./m2s1-text3-solution-fragments.cjs');
const {stable,sha256,gitBlob,createGitReader,checkedStudentFontRefs,studentFontResourcePath,createStudentRouteLifecycle,
  serveStudentFont,closeStudentContext,readScreenshotArtifacts,assertScreenshotInventory,FONT_DIR,FONT_STYLESHEET}=H;
const sha=sha256;
const MANIFEST_PATH='tests/fixtures/archive-m2s1-stale-forty-current-ui.json';
const CHECKER_PATH='tools/check-m2s1-stale-forty-current-browser.cjs';
const ADAPTER_PATH='tools/capture-m2s1-stale-forty-surfaces.cjs';
const SHARED_CHECKER_PATH='tools/check-reviewed-problem-renderer-browser.cjs';
const SURFACE_PATH='tools/capture-m1s2-problem-surface.cjs';
const FRAGMENT_PATH='tools/m2s1-text3-solution-fragments.cjs';
const FRAGMENT_MANIFEST_PATH='tests/fixtures/archive-m2s1-text-solution3-ui.json';
const IDENTITY_PATH='archive/data/question_identity_map.json',METADATA_PATH='archive/data/question_metadata.json';
const MANIFEST_SHA='69cc73bd5f3a1d4b32a46ef016b6e44efbb1a9cca5e7144a49069f96be78e8f6';
const SCHEMA='archive-m2s1-stale-forty-github-ui-raw-v1',FONT_FAMILY='Nanum Myeongjo';
const OPS_REF='refs/heads/ops/m2s1-stale40-current-renderer-26fc-20261117';
const EXPECTED_UIDS=["qid_v1_0622e195cd91d697a36aa43e1c5fa8e9d9e937e549fb56f082fbfc6c608a3730", "qid_v1_19d960620b30288e76f690ead3d1dde40f594661c564b36897f89fc8eed7c9ef", "qid_v1_1d200d70d5357c645e8169c12bc2bea9e5b6c3650e3c39c7b163cfa74e7e2b55", "qid_v1_23395ed63df72bb131b2d8af13d18c5563a0452b37996fc33161c4e34972ab9e", "qid_v1_57a15c359d0e1be6119b2006116f66c9eef6c21e85b8b63beca84b67d23ab70a", "qid_v1_6b336f85f0c33eee6ee25bc0bbaad9f692ba6e41f33c1d664a7c72540dd839c6", "qid_v1_7cd254bca88a1c5ef7c6fc3e149025a5f407e49654c165e8f065b34e4d028d36", "qid_v1_8ee1cd8663adcbfb43e38ac836e5a2329acddaa21b83c1a54687cc8a40716a09", "qid_v1_9a118037d255406dd4b83c4a158ee3f1e5d4fb6a161432cc31feb258b430af8b", "qid_v1_9a4120c029bbc4cb495be923220b348878dfdc307f47f7ce1f5115304c316083", "qid_v1_c56f8d08291cffb89de1583112e9319acfeac879f2f82a1d60951eaeb6d300e1", "qid_v1_ee6b3f2406bf9b9a9a9527cabc40f48be14fb4ebfc72b766988ecf61e99e44eb", "qid_v1_ff9f4324b5d06f255c852bac1f2dbb88641ebba07809cd76ce3d0ee2dca85c41", "qid_v1_1554811ec6e62874443dc420e0fb4252a3f65e4279e3c1dd3c06bd30127c073a", "qid_v1_701fa52b3cf00c9407fde2156d8d30dc54a985ded3be81a324eaf7cf39050b32", "qid_v1_a34dd926bbebe44733ec9bc8421e99b688f5d9bea46e0d6ae0c5e89c80bc173e", "qid_v1_ddfc75db18d706c5d984ba07512d710b102f0565be4c56f72a106b80157ffb22", "qid_v1_33e0b0ea10cb416d35ed6b6f767d477594af0bf46b56bc89c0ea6a0ba55a1740", "qid_v1_590c1da4c27b9362aa8e026235f59747689441db6bfeff832c22d2ac847af7dd", "qid_v1_599cbb16d00e59562d0f0c6333ba220ba22af9bc82ba81a220bc70c9ae5b49d5", "qid_v1_69b3232970c01fe6e8a23789f3f04163dffd28799c679399333233658802dcbb", "qid_v1_c4d43a4784a1e7d273f13c800e65aa59b5e832f6e75d6825e0e4eb4dce92aeef", "qid_v1_49e36e2eb2e7cacc9e0b24eeaccde9a71785ad38266d2b6130cff7e01dfeed3f", "qid_v1_6d24de40d61c8689c8bd129af58e495cee463c88761d4d3e7e537b64af2a00d4", "qid_v1_b24f83ce58820c087018e9b78f654a595164a79e4195c09e8ec8a079d9552ec6", "qid_v1_c45ffbe499795ed9a6823ef24b7099ef2b27331bb91b6d5d0c559a13b92b6b95", "qid_v1_f8054e3d22f12134e9805090782719fcbe298a8bc4c9eb35674db6539158665c", "qid_v1_5ab21156e6dbc2a03265131a47dd14bfaded86a2d24537ff8bc3c031e8cb352b", "qid_v1_670d367bd0fda423aa0897817e80a681a2c27d6bdbf29e462ad0ab82da5e44be", "qid_v1_b33a5e6831583bc0f52b6011c39172eea78f6829d9248b5fc3c5e5b22af0ae11", "qid_v1_d8fdbc567096c1e56a463bba2aa8a5227e5cd198c0a0670615a59bf69678a467", "qid_v1_ff2e3c86f4b7f401238bc51e36e097110b7bff052a53e9ad45be5859ef0cb0ae", "qid_v1_601c10f61fe55a4f0550bacce238ebf3c01ecc6c18d693511ffe385189bef3c0", "qid_v1_836a6103350d4c71c5c61a8dafb82f8fc35c83eeffd4e9c815af721e571429c0", "qid_v1_acd906ebe60f77ca44b21c04159968372898acda8cd4d875bc595b7a2a9c5060", "qid_v1_afdacbb3734acfe658f8d1f2f820c0f23554c0d762412e449d0993e7e757c957", "qid_v1_afff133cfd80f573157e1994606d22ae331d63f66f67ee87cc2362e515e6f7f8", "qid_v1_d2d1bc31052327237918791d5fff44510e8e28a307480e63123eddf36edb98e5", "qid_v1_fd1b64c0f8298556be66546d494cc80c7e7a997d4fed32e3f88952a7941e4432", "qid_v1_eff16cb34d23543b88c1ec860d9c271078746a16c8dfd13ceb01a6cecbf7c108"];
const REQUIRED_HELPERS=[{"path": "tools/check-reviewed-problem-renderer-browser.cjs", "gitBlobSha1": "56c80b40d53fa88e8054a16f7b7267f968696f3f", "sha256": "e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673", "bytes": 56735}, {"path": "tools/capture-m1s2-problem-surface.cjs", "gitBlobSha1": "ffeb072d7b94df6491ab7eeacb73ed1750f598ca", "sha256": "86b0e6761544480a688930928484e1f944e9e47e0ab2347aa22a35331891f5cf", "bytes": 10218}, {"path": "tools/m2s1-text3-solution-fragments.cjs", "gitBlobSha1": "8ccfc5b09602b3f348b8b842007123cbc7d9ecd1", "sha256": "b7fbc927ec795bca33fd923c971efee8ec94cd6aeb1a606f6be6ec3760caa4d9", "bytes": 22828}, {"path": "tests/fixtures/archive-m2s1-text-solution3-ui.json", "gitBlobSha1": "6c8859829f369a0843bcd0a9faeb77cc293ca2ff", "sha256": "043f04f67127dd003e79432e7c72c21bf7f29ee8e364d66e371fbae5557970dd", "bytes": 3325}];
const stripCommit=r=>{const {commit,...rest}=r;return rest;};
function safeFailureCode(error,fallback='UI_STALE40_CAPTURE_FAILED'){
  const message=typeof error?.message==='string'?error.message:'';
  if(/^UI_[A-Z0-9_]+$/.test(message))return message;
  const codes=[...new Set(message.match(/\bUI_(?:STALE40|E051|NATIVE|CAPTURE|SCROLL|PROBLEM|REQUIRED|RENDER)_[A-Z0-9_]+\b/g)||[])];
  return codes.length===1?codes[0]:fallback;
}
function validateManifest(m){
  assert.equal(sha256(stable(m)),MANIFEST_SHA,'UI_STALE40_CLOSED_MANIFEST');
  assert.equal(m.schemaVersion,'archive-m2s1-stale-forty-current-ui-fixture-v1','UI_STALE40_MANIFEST_SCHEMA');
  assert.equal(m.authority,'TECHNICAL_CAPTURE_ONLY_NO_NEW_APPROVAL','UI_STALE40_MANIFEST_AUTHORITY');
  assert.equal(m.expectedItems,40,'UI_STALE40_ITEM_COUNT');assert.equal(m.expectedBanks,12,'UI_STALE40_BANK_COUNT');
  assert.equal(m.expectedLogicalCases,83,'UI_STALE40_CASE_COUNT');assert.equal(m.expectedProblemCases,80,'UI_STALE40_PROBLEM_COUNT');
  assert.equal(m.expectedSolutionCases,3,'UI_STALE40_SOLUTION_COUNT');assert.equal(m.originalAssets,43,'UI_STALE40_ASSET_COUNT');
  assert.equal(m.maxOriginalTilesPerCase,8,'UI_STALE40_TILE_LIMIT');
  assert.deepEqual(m.items.map(i=>i.questionUid),EXPECTED_UIDS,'UI_STALE40_EXACT_UIDS');
  assert.equal(new Set(m.items.map(i=>i.sourcePath)).size,12,'UI_STALE40_EXACT_BANKS');
  assert.equal(m.items.reduce((n,i)=>n+i.assets.length,0),43,'UI_STALE40_EXACT_ASSETS');
  return m;
}
function planCases(m){
  validateManifest(m);const groups=[];
  for(const surface of ['PROBLEM','SOLUTION'])for(const viewport of m.viewports[surface]){
    const selected=m.items.filter(i=>i.surfaces.includes(surface));
    for(const sourcePath of [...new Set(selected.map(i=>i.sourcePath))])groups.push({surface,mode:surface==='PROBLEM'?'exam':'sol',viewport,
      sourcePath,items:selected.filter(i=>i.sourcePath===sourcePath)});
  }
  const cases=groups.flatMap(g=>g.items.map(i=>({key:i.key,questionUid:i.questionUid,sourceOrdinal:i.sourceOrdinal,surface:g.surface,viewport:g.viewport.name})));
  assert.equal(cases.length,83,'UI_STALE40_CASE_PLAN');
  assert.equal(new Set(cases.map(c=>[c.questionUid,c.surface,c.viewport].join(':'))).size,83,'UI_STALE40_UNIQUE_CASE_PLAN');
  assert.equal(cases.filter(c=>c.surface==='PROBLEM').length,80,'UI_STALE40_PROBLEM_PLAN');
  assert.deepEqual(cases.filter(c=>c.surface==='SOLUTION').map(c=>c.key),['E044-Q21','E044-Q24','E051-Q15'],'UI_STALE40_SOLUTION_PLAN');
  return groups;
}
function assertScopedScreenshotInventory(results,artifacts,manifest){
  // The raw proof keeps the question key. Only this closed adapter adds the
  // captured surface to the filename key consumed by the unchanged H guard.
  const expected=new Map(planCases(manifest).flatMap(group=>group.items.map(item=>{
    const id=[item.key,group.surface,group.viewport.name].join(':');
    return[id,{item,surface:group.surface,mode:group.mode,viewport:group.viewport}];
  })));
  assert(Array.isArray(results)&&results.length===83&&expected.size===83,'UI_STALE40_SCREENSHOT_CASE_COUNT');
  const seen=new Set();
  const adapted=results.map(row=>{
    const id=[row?.key,row?.surface,row?.viewport?.name].join(':');
    const bound=expected.get(id);
    assert(bound&&!seen.has(id),'UI_STALE40_SCREENSHOT_CASE_BINDING');seen.add(id);
    assert.equal(row.questionUid,bound.item.questionUid,'UI_STALE40_SCREENSHOT_UID');
    assert.equal(row.sourceOrdinal,bound.item.sourceOrdinal,'UI_STALE40_SCREENSHOT_ORDINAL');
    assert.equal(row.mode,bound.mode,'UI_STALE40_SCREENSHOT_MODE');
    assert.deepEqual(row.viewport,bound.viewport,'UI_STALE40_SCREENSHOT_VIEWPORT');
    const key=bound.surface==='SOLUTION'&&bound.item.questionUid===Fragments.UID
      ?bound.item.key:`${bound.item.key}-${bound.surface}`;
    return{...row,key};
  });
  assert.equal(seen.size,expected.size,'UI_STALE40_SCREENSHOT_COMPLETE_PLAN');
  return assertScreenshotInventory(adapted,artifacts);
}
function validateIdentity(identity,item){
  assert(Array.isArray(identity?.records),'UI_STALE40_IDENTITY_RECORDS');
  const rows=identity.records.filter(r=>r.sourceArchiveFile===item.sourcePath.slice('archive/exams/'.length)&&Number(r.sourceOrdinal)===item.sourceOrdinal);
  assert.equal(rows.length,1,'UI_STALE40_UNIQUE_IDENTITY_LOCATOR');
  assert.equal(rows[0].questionUid,item.questionUid,'UI_STALE40_IDENTITY_UID');
  assert.equal(identity.records.filter(r=>r.questionUid===item.questionUid).length,1,'UI_STALE40_GLOBAL_UID_UNIQUE');
  assert.equal(sha256(stable(rows[0])),item.identityRowSha256,'UI_STALE40_IDENTITY_ROW_DRIFT');return rows[0];
}
function validateAssetPointers(question,item){
  const content=question.content??question.question??'';
  assert.equal(typeof content,'string','UI_STALE40_CONTENT_REQUIRED');
  const images=[...content.matchAll(/<img\b[^>]*>/gi)].map(m=>{
    assert(!/\bsrcset\s*=/i.test(m[0]),'UI_STALE40_ALTERNATE_IMAGE_CARRIER');
    const a=m[0].match(/\bsrc\s*=\s*(["'])([^"']+)\1/i);assert(a,'UI_STALE40_QUOTED_IMAGE_SRC');return a[2];
  });
  for(const a of item.assets){const uri=a.ref.path.slice('archive/'.length);
    if(a.surface==='SOLUTION')assert.equal(question.solutionImage,uri,'UI_STALE40_SOLUTION_IMAGE_POINTER');
    else if(item.sourceShape.topImage){assert.equal(question.image,uri,'UI_STALE40_TOP_IMAGE_POINTER');assert.equal(images.length,0,'UI_STALE40_ONE_PROBLEM_CARRIER');}
    else{assert.equal(images.length,1,'UI_STALE40_ONE_INLINE_IMAGE');assert.equal(images[0],uri,'UI_STALE40_INLINE_IMAGE_POINTER');}
  }
}
function preflight(reader,manifest){
  validateManifest(manifest);
  const identityBytes=reader.read(IDENTITY_PATH),metadataBytes=reader.read(METADATA_PATH);
  const identity=JSON.parse(identityBytes),metadata=JSON.parse(metadataBytes);
  assert(Array.isArray(identity.records)&&Array.isArray(metadata.records),'UI_STALE40_CURRENT_DATA_ROWS');
  for(const rows of [identity.records,metadata.records]){
    const uids=rows.map(r=>r.questionUid);assert(uids.every(u=>typeof u==='string')&&new Set(uids).size===uids.length,'UI_STALE40_GLOBAL_DATA_DUPLICATE');
  }
  const banks=new Map(),items=[];
  for(const item of manifest.items){
    if(!banks.has(item.sourcePath)){const bytes=reader.read(item.sourcePath);banks.set(item.sourcePath,{bytes,questions:loadQuestions(bytes)});}
    const {bytes,questions}=banks.get(item.sourcePath);
    assert.deepEqual(stripCommit(reader.ref(item.sourcePath,bytes)),item.sourceRef,'UI_STALE40_SOURCE_BYTES_DRIFT');
    assert.equal(questions.length,item.expectedBankCount,'UI_STALE40_BANK_COUNT_DRIFT');
    const question=questions[item.sourceOrdinal-1];assert(question&&Number(question.id??question.number)===item.sourceQuestionNo,'UI_STALE40_QUESTION_NUMBER');
    assert.equal(sha256(stable(question)),item.questionSha256,'UI_STALE40_WHOLE_QUESTION_DRIFT');
    assert.equal(sha256(stable({content:question.content??question.question,choices:question.choices??[]})),item.problemPayloadSha256,'UI_STALE40_PROBLEM_PAYLOAD_DRIFT');
    assert.deepEqual(shape(question),item.sourceShape,'UI_STALE40_SOURCE_SHAPE_DRIFT');validateAssetPointers(question,item);
    const id=validateIdentity(identity,item),md=metadata.records.filter(r=>r.questionUid===item.questionUid);
    assert.equal(md.length,1,'UI_STALE40_METADATA_UID');assert.equal(sha256(stable(md[0])),item.metadataRowSha256,'UI_STALE40_METADATA_ROW_DRIFT');
    const assets=item.assets.map(a=>{const b=reader.read(a.ref.path),ref=reader.ref(a.ref.path,b);assert.deepEqual(stripCommit(ref),a.ref,'UI_STALE40_ORIGINAL_ASSET_DRIFT');return{surface:a.surface,ref};});
    items.push({key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,sourceQuestionNo:item.sourceQuestionNo,
      questionSha256:item.questionSha256,problemPayloadSha256:item.problemPayloadSha256,identityRowSha256:sha256(stable(id)),metadataRowSha256:sha256(stable(md[0])),
      sourceRef:reader.ref(item.sourcePath,bytes),assets});
  }
  return{identityRef:reader.ref(IDENTITY_PATH,identityBytes),metadataRef:reader.ref(METADATA_PATH,metadataBytes),items};
}
function executionProvenance(expectedCommit,env=process.env,event=null){
  assert.equal(env.GITHUB_ACTIONS,'true','UI_GITHUB_ACTIONS_REQUIRED');
  assert.equal(env.GITHUB_EVENT_NAME,'push','UI_STALE40_PUSH_EVENT_REQUIRED');
  assert.equal(env.GITHUB_REPOSITORY,'icefoxtail/AP------','UI_REPOSITORY');assert.equal(env.GITHUB_REF,OPS_REF,'UI_STALE40_PUSH_REF');
  assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ID||''),'UI_RUN_ID');assert(/^[1-9][0-9]*$/.test(env.GITHUB_RUN_ATTEMPT||''),'UI_RUN_ATTEMPT');
  assert(String(env.GITHUB_WORKFLOW||'').trim()&&/^[A-Za-z0-9_-]+$/.test(env.GITHUB_JOB||''),'UI_WORKFLOW_JOB');
  assert(/^[a-f0-9]{40}$/.test(expectedCommit||'')&&env.GITHUB_SHA===expectedCommit,'UI_STALE40_EXACT_PUSH_HEAD');
  const payload=event||JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
  assert(payload?.repository?.full_name===env.GITHUB_REPOSITORY&&payload.repository.fork===false,'UI_STALE40_SAME_REPOSITORY_PUSH');
  assert(payload.deleted===false&&payload.ref===OPS_REF&&payload.after===expectedCommit&&!payload.pull_request,'UI_STALE40_PUSH_PAYLOAD');
  return{provider:'GITHUB_ACTIONS',eventName:'push',repository:env.GITHUB_REPOSITORY,workflow:env.GITHUB_WORKFLOW,job:env.GITHUB_JOB,
    runId:env.GITHUB_RUN_ID,runAttempt:Number(env.GITHUB_RUN_ATTEMPT),ref:OPS_REF,capturedHead:expectedCommit,eventSha:env.GITHUB_SHA,
    pullRequest:null,headSha:expectedCommit,baseSha:null,runUrl:'https://github.com/'+env.GITHUB_REPOSITORY+'/actions/runs/'+env.GITHUB_RUN_ID};
}
function checkoutEvidence(actual,env=process.env,event=null){const expected=env.ARCHIVE_M2S1_STALE40_UI_EXPECTED_SHA;
  assert.equal(actual,expected,'UI_STALE40_CHECKOUT_HEAD');return executionProvenance(expected,env,event);}

function loadQuestions(bytes){
 let text=bytes.toString('utf8').replace(/^\uFEFF/,'').trim(),values=Object.create(null),steps=[];
 while(text.startsWith('//')||text.startsWith('/*')){
  const end=text.startsWith('//')?text.indexOf('\n'):text.indexOf('*/')+2;
  assert(end>0,'UI_SOURCE_HEADER');text=text.slice(end).trim();
 }
 function takeJson(s){
  let quoted=false,escape=false,depth=0,end=-1;
  for(let i=0;i<s.length;i++){
   const ch=s[i];
   if(quoted){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch==='"')quoted=false;}
   else if(ch==='"')quoted=true;else if(ch==='['||ch==='{')depth++;else if(ch===']'||ch==='}')depth--;
   if(!quoted&&depth===0&&(s[0]==='"'||s[0]==='['||s[0]==='{')){end=i+1;break;}
  }
  assert(end>0&&!quoted&&depth===0,'UI_SOURCE_JSON_VALUE');return{value:JSON.parse(s.slice(0,end)),rest:s.slice(end).trim()};
 }
 while(text){
  if(/^window\.questionBank\s*=\s*window\.examData\.questions\s*;?\s*$/.test(text)){
   assert(!Object.hasOwn(values,'questionBank')&&Array.isArray(values.examData?.questions),'UI_SOURCE_ALIAS');
   values.questionBank=values.examData.questions;steps.push('questionBankAlias');text='';break;
  }
  const m=text.match(/^window\.(examTitle|examData|questionBank)\s*=\s*/);assert(m,'UI_SOURCE_DATA_WRAPPER');
  assert(!Object.hasOwn(values,m[1]),'UI_SOURCE_DUPLICATE_ASSIGNMENT');const parsed=takeJson(text.slice(m[0].length));
  assert(parsed.rest.startsWith(';'),'UI_SOURCE_TERMINATOR');text=parsed.rest.slice(1).trim();values[m[1]]=parsed.value;steps.push(m[1]);
 }
 assert(!Object.hasOwn(values,'examTitle')||typeof values.examTitle==='string','UI_SOURCE_TITLE_TYPE');
 assert(!Object.hasOwn(values,'examData')||values.examData&&typeof values.examData==='object'&&!Array.isArray(values.examData),'UI_SOURCE_DOCUMENT');
 const rows=values.questionBank??values.examData?.questions;assert(Array.isArray(rows),'UI_SOURCE_QUESTIONS');
 if(values.questionBank&&values.examData?.questions)assert.equal(stable(values.questionBank),stable(values.examData.questions),'UI_SOURCE_DUPLICATE_BANK_DRIFT');
 return rows;
}

function shape(q){
 const content=q.content??q.question??'';assert.equal(typeof content,'string');
 const tokens=[...content.matchAll(/<\/?([a-zA-Z][\w:-]*)\b[^>]*>/g)].map(m=>m[1].toUpperCase());
 return{choiceCount:Array.isArray(q.choices)?q.choices.length:0,choicesEmbeddedInImage:q.choicesEmbeddedInImage===true,
  topImage:typeof q.image==='string'&&!!q.image,contentImageCount:(content.match(/<img\b/gi)||[]).length,
  contentHasText:!!content.replace(/<[^>]*>/g,'').trim(),contentTagSequence:tokens,
  contentSha256:sha(content),solutionSha256:sha(stable(q.solution??q.explanation??null)),
  problemCarriersSha256:sha(stable(Object.fromEntries(['image','images','figureSvg','svg'].map(k=>[k,Object.hasOwn(q,k)?{present:true,value:q[k]}:{present:false}])))),
  presentationSha256:sha(stable(Object.fromEntries(['imageAlt','imageSize','layoutTag','choicesEmbeddedInImage'].map(k=>[k,Object.hasOwn(q,k)?{present:true,value:q[k]}:{present:false}]))))};
}

const mime=rel=>({'.js':'text/javascript','.json':'application/json','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(rel)]||'application/octet-stream');

async function inspectStudentUi({ root, out, expectedCommit, executablePath }) {
  const execution=executionProvenance(expectedCommit);
  assert(executablePath && path.isAbsolute(executablePath) && fs.statSync(executablePath).isFile(), 'UI_SUPPORTED_CHROME_REQUIRED');
  const reader = createGitReader(root, expectedCommit);
  const manifestBytes = reader.read(MANIFEST_PATH), manifest = JSON.parse(manifestBytes);
  const inputs = preflight(reader, manifest);
  for(const ref of REQUIRED_HELPERS)assert.deepEqual(stripCommit(reader.ref(ref.path)),ref,'UI_STALE40_HELPER_DRIFT');
  assert.equal(Capture.MANIFEST_SHA,MANIFEST_SHA,'UI_STALE40_ADAPTER_MANIFEST');
  const { refs: fontRefs, weights: fontWeights, licenseRef: fontLicenseRef } = checkedStudentFontRefs(reader);
  const served = new Map(), mirrored = new Map(), studentFontResources = new Map(), failures = [], results = [], surfaceDiagnostics=[];
  let activeCase = null;
  fs.mkdirSync(out, { recursive: true });
  const proofBase = { schemaVersion: SCHEMA, executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', execution, checkoutCommit: reader.commit, inputSourceSnapshot:manifest.sourceSnapshot,
    manifestRef: reader.ref(MANIFEST_PATH, manifestBytes), checkerRef: reader.ref(CHECKER_PATH), captureHelperRef: reader.ref(SHARED_CHECKER_PATH), surfaceHelperRef:reader.ref(SURFACE_PATH), scopedSurfaceHelperRef:reader.ref(ADAPTER_PATH),fragmentHelperRef:reader.ref(FRAGMENT_PATH),fragmentManifestRef:reader.ref(FRAGMENT_MANIFEST_PATH), ...inputs,
    modes:['exam','sol'],studentReview:true,screenshotsScope:'EXACT_PROBLEM_80_AND_SOLUTION_3_ALL_ORIGINAL_TILES',problemOnlyScreenshots:false,
    sourceOverlay:false,sourceOverlayCount:0,sourceWrites:0,domWrites:0,cssWrites:0,metadataWrites:0,identityWrites:0,
    solutionsOpened:true,solutionQuestionUids:manifest.items.filter(i=>i.surfaces.includes('SOLUTION')).map(i=>i.questionUid),productionCdnTest:false, assetTransport: 'EXACT_CHECKOUT_BYTES_FOR_DEFAULT_IMAGE_ORIGIN',
    fontTransport: 'EXACT_CHECKOUT_CHROMIUM_NANUM_MYEONGJO_V31_SUBSETS', fontLicenseRef,
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0 };
  const writeProof = (status, code = null) => {
    const screenshotArtifacts = readScreenshotArtifacts(out);
    if (status === 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING') assertScopedScreenshotInventory(results, screenshotArtifacts,manifest);
    const proof = { ...proofBase, status, ...(code ? { failureCode: code, activeCase } : {}), expectedLogicalCases:manifest.expectedLogicalCases,expectedProblemCases:80,expectedSolutionCases:3,
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
  const watchdog = setTimeout(() => { writeProof('FAIL', 'UI_TOTAL_TIMEOUT'); process.exit(1); }, 2100000);
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('playwright');
    browser = await chromium.launch({ executablePath, headless: true, timeout: 30000 });
    proofBase.browserVersion = browser.version();
    const groups=planCases(manifest);
    for(const group of groups){const {surface,mode,viewport,sourcePath}=group;
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
        const url = `${origin}/archive/engine.html?data=${encodeURIComponent(sourcePath.slice('archive/'.length))}&mode=${mode}&fit=screen&studentReview=1`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForFunction(expectedMode=>{const readiness=JSON.parse(document.documentElement.dataset.apPrintReadiness||'{}');return readiness.state==='RENDER_READY'&&typeof AppState!=='undefined'&&AppState.mode===expectedMode&&AppState.data.length>0;},mode,{timeout:40000});
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
            problemFontFamilies: [...new Set([...document.querySelectorAll('#print-area .q-content,#print-area [data-semantic-content="1"],#print-area .sol-exp')].map(node => getComputedStyle(node).fontFamily))] };
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
        assert.equal(technical.mode,mode,'UI_STALE40_RENDER_MODE');
        assert.equal(technical.questions,group.items[0].expectedBankCount,'UI_STALE40_RENDERED_BANK_COUNT');
        assert(technical.pages > 0 && technical.imagesComplete, 'UI_RENDERED_IMAGES');
        assert.equal(technical.mathErrors, 0, 'UI_MATH_ERRORS');
        assert.equal(technical.unrenderedMath, 0, 'UI_UNRENDERED_MATH');
        assert.equal(technical.mathJaxSource, 'local', 'UI_LOCAL_MATHJAX');
        if(surface==='PROBLEM')assert.equal(technical.solutionNodes,0,'UI_PROBLEM_ONLY');else assert(technical.solutionNodes>0,'UI_STALE40_SOLUTION_REQUIRED');
        assert.equal(pageErrors.length + requestFailures.length + externalRequests.length + failures.length, 0, 'UI_NETWORK_OR_PAGE_FAILURE');
        for(const item of group.items){
          const bound=inputs.items.find(i=>i.questionUid===item.questionUid),assetRef=bound.assets.find(a=>a.surface===surface).ref;
          activeCase={key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,surface,viewport:viewport.name};
          const target=page.locator(`#print-area img[src*="${path.posix.basename(assetRef.path)}"]`);
          assert.equal(await target.count(),1,'UI_STALE40_UNIQUE_SURFACE_IMAGE');
          const box=target.locator('xpath=ancestor::div[contains(concat(" ",normalize-space(@class)," ")," q-box ")][1]');
          assert.equal(await box.count(),1,'UI_STALE40_UNIQUE_QUESTION_BOX');
          const selection=await target.evaluate((image,scope)=>{
            const box=image.closest('.q-box'),expected='https://img.wangjiedu.com/exams/images/'+scope.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
            return{sourceMatchesSelected:box.dataset.sourceRef===getArchiveQuestionSourceRef(AppState.data[scope.ordinal-1],scope.ordinal-1,AppState),
              sourceFragments:[...document.querySelectorAll('#print-area .q-box')].filter(n=>n.dataset.sourceRef===box.dataset.sourceRef).length,
              sourceRefSha256:null,imagePathMatches:image.src===expected&&(image.currentSrc||image.src)===expected,
              questionNumber:box.querySelector('.q-num')?.textContent?.trim(),solutionBox:box.classList.contains('sol-box'),
              selectedImageCount:box.querySelectorAll('img').length};
          },{assetPath:assetRef.path,ordinal:item.sourceOrdinal});
          assert(selection.sourceMatchesSelected&&selection.imagePathMatches,'UI_STALE40_DOM_SOURCE_ASSET_BINDING');
          assert.equal(selection.solutionBox,surface==='SOLUTION','UI_STALE40_DOM_MODE');
          assert.equal(Number((selection.questionNumber||'').match(/^\d+/)?.[0]),item.sourceOrdinal,'UI_VISIBLE_ORDINAL');
          if(surface==='PROBLEM'){assert.equal(selection.sourceFragments,1,'UI_STALE40_PROBLEM_FRAGMENT');assert.equal(selection.selectedImageCount,1,'UI_STALE40_ONE_PROBLEM_IMAGE');}
          const policy=Capture.makePolicy(reader,item,surface,viewport);
          let fragmentPolicy=null;
          if(surface==='SOLUTION'&&item.questionUid===Fragments.UID)fragmentPolicy=Fragments.makePolicy(reader,{...item,sourceRef:bound.sourceRef,assetRefs:[assetRef]});
          const screenshotPath=surface==='SOLUTION'&&item.questionUid===Fragments.UID?`${item.key}-${viewport.name}.png`:`${item.key}-${surface}-${viewport.name}.png`;
          let captured;
          try{captured=await Capture.capture(page,target,path.join(out,screenshotPath),policy,fragmentPolicy);}
          catch(error){
            surfaceDiagnostics.push({...activeCase,selection,failureCode:safeFailureCode(error),errorMessageSha256:sha256(error.message||'')});
            throw error;
          }
          const {capture,surface:surfaceStructure}=captured;
          const geometry=await target.evaluate(image=>{const box=image.closest('.q-box'),a=image.getBoundingClientRect(),b=box.getBoundingClientRect();
            return{naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,image:{x:a.x,y:a.y,width:a.width,height:a.height},
              question:{x:b.x,y:b.y,width:b.width,height:b.height},imageInsideQuestion:a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1,
              questionNumber:box.querySelector('.q-num')?.textContent?.trim()};});
          assert(geometry.imageInsideQuestion&&geometry.naturalWidth>0&&geometry.naturalHeight>0&&geometry.image.width>0,'UI_IMAGE_CLIPPED');
          assert.equal(Number((geometry.questionNumber||'').match(/^\d+/)?.[0]),item.sourceOrdinal,'UI_VISIBLE_ORDINAL');
          await routeLifecycle.drain();routeLifecycle.assertSettled();
          const screenshots=capture.tiles.map(tile=>{const bytes=fs.readFileSync(path.join(out,tile.filename));return{tileIndex:tile.tileIndex,path:tile.filename,sha256:sha256(bytes),bytes:bytes.length};});
          results.push({status:'PASS',key:item.key,questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,viewport,sourceRef:bound.sourceRef,
            assetRef,assetRefs:[assetRef],questionSha256:item.questionSha256,identityRowSha256:bound.identityRowSha256,metadataRowSha256:bound.metadataRowSha256,
            surface,surfaceStructure,mode,screenshots,technical:{...technical,fontReadiness,fontResourceIds:[...fontState.fontResources.values()].sort()},geometry,capture,
            visualReview:'PENDING',pageErrors,requestFailures,externalRequests});activeCase=null;
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
    assert.equal(results.length,83,'UI_STALE40_ALL_EIGHTY_THREE_REQUIRED');
    assert.equal(new Set(results.map(row=>`${row.key}:${row.surface}:${row.viewport.name}`)).size,83,'UI_STALE40_UNIQUE_EIGHTY_THREE_REQUIRED');
    assert.equal(results.filter(r=>r.surface==='PROBLEM').length,80,'UI_STALE40_ALL_PROBLEM_CASES');
    assert.equal(results.filter(r=>r.surface==='SOLUTION').length,3,'UI_STALE40_ALL_SOLUTION_CASES');
    assertScopedScreenshotInventory(results, readScreenshotArtifacts(out),manifest);
    // Re-read all served and bound inputs after the screenshots. No cache can
    // turn a mutable working-tree file into immutable provenance.
    for (const ref of [proofBase.manifestRef,proofBase.checkerRef,proofBase.captureHelperRef,proofBase.surfaceHelperRef,proofBase.scopedSurfaceHelperRef,proofBase.fragmentHelperRef,proofBase.fragmentManifestRef,inputs.identityRef,inputs.metadataRef,fontLicenseRef,...fontRefs.values(),...inputs.items.flatMap(row=>[row.sourceRef,...row.assets.map(a=>a.ref)]),...served.values(),...mirrored.values()]) {
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


async function main(){
  const a=process.argv.slice(2);assert(a.length===4&&a[0]==='--root'&&a[2]==='--output','UI_ARGUMENTS');
  const root=path.resolve(a[1]),out=path.resolve(a[3]);assert(out!==root&&!out.startsWith(root+path.sep),'UI_OUTPUT_OUTSIDE_CHECKOUT');
  assert(!fs.existsSync(out)||fs.readdirSync(out).length===0,'UI_EMPTY_OUTPUT');
  for(let p=out;p!==path.dirname(p);p=path.dirname(p))if(fs.existsSync(p))assert(!fs.lstatSync(p).isSymbolicLink(),'UI_OUTPUT_SYMLINK');
  const expectedCommit=process.env.ARCHIVE_M2S1_STALE40_UI_EXPECTED_SHA;assert(/^[a-f0-9]{40}$/.test(expectedCommit||''),'UI_EXPECTED_COMMIT');
  try{const p=await inspectStudentUi({root,out,expectedCommit,executablePath:process.env.CHROME_BIN});
    console.log(JSON.stringify({status:p.status,cases:p.completedLogicalCases,screenshotArtifactCount:p.screenshotArtifactCount,checkoutCommit:p.checkoutCommit,newApprovals:0}));}
  catch(error){fs.mkdirSync(out,{recursive:true});const file=path.join(out,'technical-proof.json');if(!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify({schemaVersion:SCHEMA,
    status:'FAIL',failureCode:safeFailureCode(error),errorMessageSha256:sha256(error.message||''),checkoutCommit:expectedCommit,
    expectedLogicalCases:83,completedLogicalCases:0,sourceWrites:0,metadataWrites:0,newApprovals:0},null,2)+'\n');throw error;}
}
module.exports={MANIFEST_PATH,MANIFEST_SHA,CHECKER_PATH,ADAPTER_PATH,OPS_REF,SCHEMA,EXPECTED_UIDS,REQUIRED_HELPERS,
  validateManifest,planCases,assertScopedScreenshotInventory,loadQuestions,shape,validateIdentity,validateAssetPointers,preflight,executionProvenance,checkoutEvidence,safeFailureCode,inspectStudentUi};
if(require.main===module)main().catch(error=>{console.error(JSON.stringify({status:'FAIL',failureCode:safeFailureCode(error),errorMessageSha256:sha256(error.message||'')}));process.exitCode=1;});
