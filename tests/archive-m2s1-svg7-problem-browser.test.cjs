'use strict';
// Closed-scope/provenance regressions only; these tests make no visual finding.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const H=require('../tools/check-m2s1-svg7-problem-browser.cjs');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),clone=x=>JSON.parse(JSON.stringify(x));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/archive-m2s1-svg7-problem-ui.json'),'utf8'));
test('fixed seven UID manifest declares fourteen views and no approval effect',()=>{
 assert.equal(H.validateManifest(manifest),manifest);assert.equal(manifest.scope,'M2S1_SVG7_EXISTING_SOURCE_REPAIR_DISPLAY_ONLY');
 assert.equal(manifest.items.length,7);assert.equal(new Set(manifest.items.map(x=>x.questionUid)).size,7);
 assert.deepEqual(manifest.viewports,[{name:'desktop',width:1365,height:1000},{name:'mobile',width:390,height:844}]);
 for(const key of ['sourceWrites','newMathQa','newMetadataApprovals','newDifficultyJudgments','newFourSlotApprovals'])assert.equal(manifest[key],0);
});
for(const [name,alter]of[
 ['outside UID',m=>m.items[0].questionUid='qid_v1_'+'f'.repeat(64)],
 ['missing selected item',m=>m.items.pop()],
 ['another source edition',m=>m.items[0].sourceGitBlobSha1='0'.repeat(40)],
 ['a narrower viewport',m=>m.viewports[1].width=320],
 ['the former desktop width',m=>m.viewports[0].width=1440],
 ['approval promotion',m=>m.newFourSlotApprovals=1]
])test('closed manifest rejects '+name,()=>{const m=clone(manifest);alter(m);assert.throws(()=>H.validateManifest(m),/UI_CLOSED_MANIFEST/);});
function carriers(q){return sha(stable(Object.fromEntries(['image','images','figureSvg','svg'].map(k=>[k,Object.hasOwn(q,k)?{present:true,value:q[k]}:{present:false}]))));}
function pointer(content='<p>synthetic statement</p><img src="assets/images/synthetic.svg">'){
 const question={content};return{question,item:{pointerField:'content',pointerKind:'EXACT_SINGLE_IMG_SRC_URI',contentSha256:sha(content),inheritedProblemCarriersSha256:carriers(question),assetPath:'archive/assets/images/synthetic.svg'}};
}
test('one explicit inline image uses the declared current source pointer',()=>{const f=pointer();H.validateInlinePointer(f.question,f.item);});
for(const [name,content]of[
 ['second inline image','<img src="assets/images/synthetic.svg"><img src="assets/images/other.svg">'],
 ['wrong file','<img src="assets/images/other.svg">'],
 ['remote image','<img src="https://outside.invalid/synthetic.svg">'],
 ['srcset alternate','<img src="assets/images/synthetic.svg" srcset="assets/images/other.svg 2x">'],
 ['unquoted URI','<img src=assets/images/synthetic.svg>'],
 ['inline SVG alternate','<img src="assets/images/synthetic.svg"><svg></svg>']
])test('inline source pointer rejects '+name,()=>{const f=pointer(content);assert.throws(()=>H.validateInlinePointer(f.question,f.item),/UI_/);});
test('content digest drift remains fatal even when the image path matches',()=>{const f=pointer();f.question.content='<span>changed</span>'+f.question.content;assert.throws(()=>H.validateInlinePointer(f.question,f.item),/UI_CONTENT_DRIFT/);});
test('an undeclared top-level renderer cannot bypass the fixed existing carrier binding',()=>{const f=pointer();f.question.svg={opaque:true};assert.throws(()=>H.validateInlinePointer(f.question,f.item),/UI_INHERITED_PROBLEM_CARRIER_DRIFT/);});
test('an original inherited carrier is authenticated as exact bytes without being rewritten',()=>{const f=pointer();f.question.svg='<svg>synthetic existing carrier</svg>';f.item.inheritedProblemCarriersSha256=carriers(f.question);H.validateInlinePointer(f.question,f.item);});
for(const[name,alter]of[['replacement',q=>q.svg='changed'],['removal',q=>delete q.svg]])test('inherited carrier '+name+' remains fatal',()=>{const f=pointer();f.question.svg='<svg>synthetic existing carrier</svg>';f.item.inheritedProblemCarriersSha256=carriers(f.question);alter(f.question);assert.throws(()=>H.validateInlinePointer(f.question,f.item),/UI_INHERITED_PROBLEM_CARRIER_DRIFT/);});
function identity(){const item={...manifest.items[0]},row={questionUid:item.questionUid,sourceArchiveFile:item.sourcePath.slice('archive/exams/'.length),sourceOrdinal:item.sourceOrdinal,sourceFingerprint:'synthetic'};item.identityRowSha256=sha(stable(row));return{item,identity:{records:[row]}};}
test('a unique exact raw identity row is authenticated without inventing status',()=>{const f=identity();H.validateIdentity(f.identity,f.item);});
for(const [name,alter]of[
 ['duplicate source ordinal',f=>f.identity.records.push({...f.identity.records[0],questionUid:'outside'})],
 ['same UID in another source',f=>f.identity.records.push({...f.identity.records[0],sourceArchiveFile:'other'})],
 ['changed selected fingerprint',f=>f.identity.records[0].sourceFingerprint='changed'],
 ['invented status',f=>f.identity.records[0].status='VERIFIED']
])test('identity binding refuses '+name,()=>{const f=identity();alter(f);assert.throws(()=>H.validateIdentity(f.identity,f.item),/UI_/);});
function execution(){const head='1'.repeat(40),repo={full_name:'icefoxtail/AP------',fork:false};return{head,env:{GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'pull_request',GITHUB_REPOSITORY:repo.full_name,GITHUB_RUN_ID:'100',GITHUB_RUN_ATTEMPT:'1',GITHUB_WORKFLOW:'M2S1 SVG7',GITHUB_JOB:'m2s1_svg7',GITHUB_SHA:'2'.repeat(40)},event:{number:1,pull_request:{head:{sha:head,repo},base:{sha:'3'.repeat(40),repo}}}};}
test('exact same-repository pull request head yields explicit CI provenance',()=>{const f=execution();assert.equal(H.executionProvenance(f.head,f.env,f.event).headSha,f.head);});
for(const [name,alter]of[
 ['non-Actions execution',f=>f.env.GITHUB_ACTIONS='false'],
 ['fork pull request',f=>f.event.pull_request.head.repo={...f.event.pull_request.head.repo,fork:true}],
 ['different checked-out head',f=>f.event.pull_request.head.sha='4'.repeat(40)],
 ['unidentified attempt',f=>delete f.env.GITHUB_RUN_ATTEMPT]
])test('execution provenance rejects '+name,()=>{const f=execution();alter(f);assert.throws(()=>H.executionProvenance(f.head,f.env,f.event),/UI_/);});
