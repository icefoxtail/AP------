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

// Q15 alone measures three distinct native elements inside its two-child box.
// Synthetic DOM geometry tests are not screenshot or display acceptance.
const vm=require('node:vm'),Q15=require('../tools/capture-m2s1-svg7-problem-surface.cjs');
const q15Manifest=manifest.items.find(row=>row.questionUid===Q15.UID);
function q15Binding(){const r=q15Manifest;return{key:r.key,questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,questionSha256:r.questionSha256,
 sourceRef:{path:r.sourcePath,gitBlobSha1:r.sourceGitBlobSha1,sha256:r.sourceSha256,bytes:r.sourceBytes},
 assetRef:{path:r.assetPath,gitBlobSha1:r.assetGitBlobSha1,sha256:r.assetSha256,bytes:r.assetBytes}};}
test('Q15 surface keeps the exact source, whole question and problem asset pins',()=>{
 assert.equal(Q15.assertQ15Binding(q15Binding()),true);assert.equal(H.surfaceRoute(q15Binding()),'Q15_EMBEDDED_CHOICES');
 for(const row of manifest.items.filter(row=>row.questionUid!==Q15.UID))assert.equal(H.surfaceRoute(row),'SHARED_SURFACE');
});
for(const[name,alter]of[
 ['another UID',x=>x.questionUid=manifest.items[0].questionUid],['another ordinal',x=>x.sourceOrdinal=24],
 ['a changed whole question',x=>x.questionSha256='0'.repeat(64)],['a changed source path',x=>x.sourceRef.path='archive/exams/other.js'],
 ['a changed source blob',x=>x.sourceRef.gitBlobSha1='0'.repeat(40)],['a changed source digest',x=>x.sourceRef.sha256='0'.repeat(64)],
 ['a changed source size',x=>x.sourceRef.bytes++],['a changed asset path',x=>x.assetRef.path='archive/assets/other.svg'],
 ['a changed asset digest',x=>x.assetRef.sha256='0'.repeat(64)]
])test('Q15 surface rejects '+name,()=>{const b=q15Binding();alter(b);assert.throws(()=>Q15.assertQ15Binding(b),/UI_Q15_SCOPE/);});
for(const[name,q]of[['missing embedded flag',{choices:Array(5).fill('synthetic')}],['false embedded flag',{choicesEmbeddedInImage:false,choices:Array(5).fill('synthetic')}],['missing option',{choicesEmbeddedInImage:true,choices:Array(4).fill('synthetic')}],['invented whole question',{choicesEmbeddedInImage:true,choices:Array(5).fill('synthetic')}]])
 test('Q15 preflight refuses '+name,()=>assert.throws(()=>Q15.assertQ15Preflight(q,q15Manifest),/UI_Q15_(EMBEDDED_CHOICES|WHOLE_QUESTION)/));

function q15Dom(){
 const state={scrollX:0,scrollY:0,foreignHit:false,onScroll:null,onScreenshot:null,screenshots:[]};
 const rect=(x,y,width,height)=>({x,y,width,height});
 class TextNode{
  constructor(text){this.nodeType=3;this.textContent=text;this.parentElement=null;this.textRects=null;}
 }
 class Element{
  constructor(tag,classes='',r=rect(0,0,1,1)){this.nodeType=1;this.tagName=tag.toUpperCase();this.attrs={};this.classes=classes;this.childNodes=[];this.parentElement=null;this.r=r;this.style={display:'block',visibility:'visible',opacity:'1',position:'static'};this.classList={contains:c=>this.classes.split(/\s+/).includes(c)};}
  get children(){return this.childNodes.filter(x=>x.nodeType===1);}
  append(...nodes){for(const n of nodes){n.parentElement=this;this.childNodes.push(n);}return this;}
  get textContent(){return this.childNodes.map(x=>x.textContent||'').join('');}
  get outerHTML(){return '<'+this.tagName+' class="'+this.classes+'" data-style="'+JSON.stringify(this.style)+'">'+this.childNodes.map(x=>x.outerHTML||x.textContent).join('')+'</'+this.tagName+'>';}
  matches(s){if(s.startsWith('.'))return this.classList.contains(s.slice(1));if(s.startsWith('['))return this.hasAttribute(s.slice(1,-1));return this.tagName===s.toUpperCase();}
  querySelectorAll(selectors){const choices=selectors.split(',');const out=[];const visit=e=>{for(const c of e.children){if(choices.some(s=>c.matches(s)))out.push(c);visit(c);}};visit(this);return out;}
  contains(node){for(let n=node;n;n=n.parentElement)if(n===this)return true;return false;}
  closest(s){for(let n=this;n;n=n.parentElement)if(n.matches(s))return n;return null;}
  getBoundingClientRect(){return {...this.r,x:this.r.x-state.scrollX,y:this.r.y-state.scrollY};}
  hasAttribute(k){return Object.hasOwn(this.attrs,k);}
 }
 const body=new Element('body','',rect(0,0,390,2000)),box=new Element('div','q-box',rect(10,10,380,600)),num=new Element('div','q-num',rect(20,20,50,20));num.append(new TextNode('15.'));
 const content=new Element('div','q-content',rect(20,60,360,500)),statement=new Element('p','',rect(20,60,360,40)),text=new TextNode('Synthetic statement only');statement.append(text);
 const figure=new Element('p','',rect(20,120,360,420)),image=new Element('img','',rect(30,125,340,400));image.src='https://img.wangjiedu.com/exams/images/'+q15Manifest.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';image.currentSrc=image.src;image.complete=true;image.naturalWidth=680;image.naturalHeight=800;
 figure.append(image);content.append(statement,figure);box.append(num,content);body.append(box);
 const document={baseURI:'http://localhost/archive/engine.html',documentElement:{dataset:{apPrintReadiness:JSON.stringify({state:'RENDER_READY'})}},getElementById:()=>null,
  querySelectorAll:s=>s==='body *'?body.querySelectorAll('div,p,img,span,mjx-container'):[],elementFromPoint:()=>state.foreignHit?body:box,
  createRange:()=>{let node;return{selectNodeContents:n=>{node=n;},getClientRects:()=>node.textRects||[node.parentElement.getBoundingClientRect()]};}};
 const context=vm.createContext({document,Node:{ELEMENT_NODE:1,TEXT_NODE:3,COMMENT_NODE:8},URL,crypto:crypto.webcrypto,TextEncoder,
  getComputedStyle:e=>e.style,innerWidth:390,innerHeight:844,requestAnimationFrame:fn=>fn(),__image:image,__arg:null});
 Object.defineProperties(context,{scrollX:{get:()=>state.scrollX},scrollY:{get:()=>state.scrollY}});
 context.window={scrollBy:d=>{state.scrollY+=d.top;state.scrollX+=d.left;state.onScroll?.();}};
 const evaluate=async(fn,arg)=>{context.__arg=arg;return vm.runInContext('('+fn.toString()+')(__image,__arg)',context);};
 const page={waitForFunction:async()=>{},evaluate:async(fn,arg)=>{context.__arg=arg;return vm.runInContext('('+fn.toString()+')(__arg)',context);},screenshot:async opts=>{state.screenshots.push(opts);state.onScreenshot?.();}};
 return{state,body,box,num,content,statement,text,figure,image,document,context,Element,TextNode,rect,target:{evaluate},page,
  measure:()=>evaluate(Q15.measureQ15Capture,Q15.BROWSER_SCOPE)};
}
function normalize(value){return JSON.parse(JSON.stringify(value));}
test('Q15 native reader uses actual number and two paragraph rectangles without counting the content parent',async()=>{
 const f=q15Dom(),frame=normalize(await f.measure());Q15.assertQ15Topology(frame.surface);
 assert.equal(frame.surface.outerElementCount,2);assert.equal(frame.surface.semanticChildCount,3);
 assert.deepEqual(frame.children,[f.num.r,f.statement.r,f.figure.r]);assert(!frame.children.some(x=>stable(x)===stable(f.content.r)));
 assert.equal(frame.surface.embeddedChoiceCount,5);assert.equal(frame.surface.statementTextNodes,1);
});
for(const[name,alter,code]of[
 ['an extra outer element',f=>f.box.append(new f.Element('div')),/UI_Q15_OUTER_TWO/],
 ['an outer nonempty text node',f=>f.box.append(new f.TextNode('uncaptured')),/UI_Q15_OUTSIDE_TEXT/],
 ['a third paragraph',f=>f.content.append(new f.Element('p')),/UI_Q15_PARAGRAPHS_TWO/],
 ['text outside the two paragraphs',f=>f.content.append(new f.TextNode('uncaptured')),/UI_Q15_OUTSIDE_TEXT/],
 ['swapped paragraph roles',f=>f.content.childNodes.reverse(),/UI_Q15_IMAGE_ROLE/],
 ['a non-paragraph statement',f=>f.statement.tagName='DIV',/UI_Q15_PARAGRAPH_ROLES/],
 ['hidden statement',f=>f.statement.style.display='none',/UI_Q15_REQUIRED_ELEMENT_HIDDEN/],
 ['hidden text inside visible paragraph',f=>{const s=new f.Element('span','',f.statement.r);s.style.visibility='hidden';s.append(new f.TextNode('hidden'));f.statement.append(s);},/UI_Q15_STATEMENT_HIDDEN/],
 ['an empty statement',f=>f.statement.childNodes=[],/UI_Q15_STATEMENT_REQUIRED/],
 ['unmeasurable statement text',f=>f.text.textRects=[],/UI_Q15_STATEMENT_RANGE/],
 ['statement range outside paragraph',f=>f.text.textRects=[f.rect(0,60,360,40)],/UI_Q15_STATEMENT_RANGE/],
 ['a second image',f=>f.figure.append(new f.Element('img')),/UI_Q15_IMAGE_ROLE/],
 ['a nested image wrapper',f=>{const w=new f.Element('span');f.figure.childNodes=[];w.append(f.image);f.figure.append(w);},/UI_Q15_IMAGE_ROLE/],
 ['hidden image',f=>f.image.style.opacity='0',/UI_Q15_REQUIRED_ELEMENT_HIDDEN/],
 ['nonempty text in the image paragraph',f=>f.figure.append(new f.TextNode('unmeasured')),/UI_Q15_OUTSIDE_TEXT/],
 ['a changed image path',f=>f.image.currentSrc='https://img.wangjiedu.com/exams/images/other.svg',/UI_Q15_IMAGE_PATH/],
 ['an alternate image source',f=>f.image.attrs.srcset='other.svg 2x',/UI_Q15_IMAGE_ROLE/],
 ['an incomplete image',f=>f.image.complete=false,/UI_Q15_IMAGE_READY/],
 ['an image outside its paragraph',f=>f.image.r.width=500,/UI_Q15_ROLE_CLIPPED/],
 ['overlapping semantic roles',f=>{f.figure.r.y=80;f.image.r.y=85;},/UI_Q15_SEMANTIC_ROLES_OVERLAP/],
 ['a nested question',f=>f.statement.append(new f.Element('div','q-box')),/UI_Q15_ROLE_TOPOLOGY/],
 ['a duplicate number role',f=>f.statement.classes='q-num',/UI_Q15_ROLE_TOPOLOGY/],
 ['the equal-slot wrapper route',f=>f.box.classes+=' ap-equal-slot',/UI_Q15_DIRECT_TOPOLOGY/],
 ['an active statement element',f=>f.statement.append(new f.Element('iframe')),/UI_Q15_STATEMENT_ELEMENT/]
])test('Q15 native reader refuses '+name,async()=>{const f=q15Dom();alter(f);await assert.rejects(f.measure,code);});
test('Q15 visible MathJax atom keeps generated assistive copy out of visible counting',async()=>{
 const f=q15Dom(),math=new f.Element('mjx-container','',f.rect(20,60,100,30)),assistive=new f.Element('mjx-assistive-mml');assistive.style.visibility='hidden';assistive.append(new f.TextNode('synthetic assistive formula'));math.append(assistive);f.statement.append(math);
 const frame=await f.measure();assert.equal(frame.surface.statementMathAtoms,1);assert.equal(frame.surface.statementTextNodes,1);assert.equal(frame.children.length,3);
});
test('Q15 synthetic scroll capture retains complete tiles, hit tests, original PNG settings and zero DOM writes',async()=>{
 const f=q15Dom();const result=await Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding());
 assert.equal(result.capture.coverage.complete,true);assert.equal(result.capture.visibleChildren,3);assert.equal(result.capture.foreignContentHits,0);
 assert.equal(result.capture.domWrites,0);assert.equal(result.capture.cssWrites,0);assert.equal(result.capture.viewportChanges,0);assert.equal(result.capture.compositeImageCreated,false);
 assert.equal(f.state.screenshots.length,1);assert.equal(f.state.screenshots[0].fullPage,false);assert.equal(f.state.screenshots[0].caret,'initial');
});
test('Q15 scroll remeasurement refuses changed semantic topology',async()=>{
 const f=q15Dom();f.state.scrollY=-1000;f.state.onScroll=()=>f.content.append(new f.Element('p'));
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_Q15_PARAGRAPHS_TWO/);assert.equal(f.state.screenshots.length,0);
});
test('Q15 postcapture topology change stays fatal',async()=>{
 const f=q15Dom();f.state.onScreenshot=()=>f.figure.append(new f.TextNode('late extra text'));
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_Q15_OUTSIDE_TEXT/);
});
test('Q15 postcapture geometry change stays fatal',async()=>{
 const f=q15Dom();f.state.onScreenshot=()=>{f.image.r.width-=5;};
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/);
});
test('Q15 foreign-content hit remains fatal before a screenshot',async()=>{
 const f=q15Dom();f.state.foreignHit=true;
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_CAPTURE_FOREIGN_CONTENT/);assert.equal(f.state.screenshots.length,0);
});
test('Q15 pending render state is refused by the shared capture kernel',async()=>{
 const f=q15Dom();f.document.documentElement.dataset.apPrintReadiness=JSON.stringify({state:'PENDING'});
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_CAPTURE_RENDER_STATE/);assert.equal(f.state.screenshots.length,0);
});

test('Q15 solution nodes remain a fatal problem-only violation',async()=>{
 const f=q15Dom(),query=f.document.querySelectorAll;f.document.querySelectorAll=s=>s.startsWith('#print-area .sol-box')?[{}]:query(s);
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_CAPTURE_RENDER_STATE/);assert.equal(f.state.screenshots.length,0);
});
test('Q15 a fully obstructed viewport cannot be captured as a success',async()=>{
 const f=q15Dom(),overlay=new f.Element('div','',f.rect(0,0,390,844));overlay.style.position='fixed';f.body.append(overlay);
 await assert.rejects(()=>Q15.captureQ15Tiles(f.page,f.target,'/tmp/synthetic-q15.png',q15Binding()),/UI_SCROLL_TILE_VISIBLE_AREA/);assert.equal(f.state.screenshots.length,0);
});

test('Q15 binding refuses the prior E045 source header after the exact Q24 revision',()=>{
 const b=q15Binding();b.sourceRef.gitBlobSha1='76638fe5ba4c770d7f6f9875b0cc8baae8430797';b.sourceRef.sha256='fc8cad2a1f43bd2b4d0f9331bba55c151201183a279008339822da32736613b9';
 assert.throws(()=>Q15.assertQ15Binding(b),/UI_Q15_SCOPE/);
});
test('Q24 r2 pins reuse the closed official worker without changing the seven UID selection',()=>{
 const q=manifest.items.find(r=>r.key==='E045-Q24');assert.equal(manifest.candidateSourceCommit,'89508c9b2af9ade9372cd147f1f766a69849ab88');
 assert.equal(q.assetGitBlobSha1,'6ddf55bc8a7575124342f996cd654b6df3ca5013');assert.equal(q.questionSha256,'6bbba32d209bd4dedfd6b154d86c986a059e69ac883b52bc963b67db17a36ae8');
 assert.equal(manifest.staticEvidenceRef.commit,'b13247a6c8bc7793f011395c0c0b68fa8c0352d6');assert.equal(manifest.priorStaticEvidenceRef.commit,'34b9e6ab851d78f90bba4975416cbeb5ee8817e3');
 const old=clone(manifest);old.items.find(r=>r.key==='E045-Q24').assetPath=old.items.find(r=>r.key==='E045-Q24').assetPath.replace('-r2.svg','-r1.svg');assert.throws(()=>H.validateManifest(old),/UI_CLOSED_MANIFEST/);
});
// A failed real capture stays failed. These observations intentionally expose
// only enum codes and geometry, never the browser's original message/text.
for(const[name,message,expected]of[
 ['known wrapped error','locator.evaluate: Error: UI_Q15_ROLE_CLIPPED\n    at need (<anonymous>:2:1)','UI_Q15_ROLE_CLIPPED'],
 ['repeated same enum','UI_Q15_STATEMENT_RANGE\nUI_Q15_STATEMENT_RANGE','UI_Q15_STATEMENT_RANGE'],
 ['unknown wrapped enum','locator.evaluate: UI_Q15_UNKNOWN_FUTURE','FALLBACK'],
 ['two different wrapped enums','UI_Q15_ROLE_CLIPPED UI_Q15_STATEMENT_RANGE','FALLBACK'],
 ['ordinary exception','locator.evaluate: ReferenceError: hidden value','FALLBACK'],
 ['embedded non-token','PREFIX_UI_Q15_ROLE_CLIPPED_SUFFIX','FALLBACK'],
 ['existing direct code','UI_NETWORK_OR_PAGE_FAILURE','UI_NETWORK_OR_PAGE_FAILURE']
])test('Q15 failure diagnostic preserves '+name,()=>assert.equal(H.safeFailureCode(new Error(message),'FALLBACK'),expected));
test('Q15 failure diagnostic records geometry without text HTML URLs or mutation',async()=>{
 const f=q15Dom(),before=f.box.outerHTML;
 const observed=normalize(await f.target.evaluate(H.inspectQ15FailureMetadata,Q15.BROWSER_SCOPE));
 assert.equal(observed.status,'OBSERVATION_ONLY_NO_ACCEPTANCE');assert.equal(observed.outerElementCount,2);
 assert.equal(observed.roles.statement.tagName,'P');assert.deepEqual(observed.roles.statement.rect,f.statement.r);
 assert.equal(observed.statementAtoms.length,1);assert.equal(observed.imagePathMatchesScope,true);
 const raw=JSON.stringify(observed);for(const secret of [f.text.textContent,f.image.src,'<DIV','textContent','outerHTML'])assert(!raw.includes(secret));
 assert.equal(f.box.outerHTML,before);assert.equal(observed.domWrites,0);assert.equal(f.state.screenshots.length,0);
});
test('Q15 failure diagnostic reports hidden and extra roles without accepting them',async()=>{
 const f=q15Dom();f.statement.style.visibility='hidden';f.content.append(new f.Element('p'));
 const observed=normalize(await f.target.evaluate(H.inspectQ15FailureMetadata,Q15.BROWSER_SCOPE));
 assert.equal(observed.paragraphCount,3);assert.equal(observed.roles.statement.visibleWithinQuestion,false);
 assert.equal(observed.status,'OBSERVATION_ONLY_NO_ACCEPTANCE');await assert.rejects(f.measure(),/UI_Q15_PARAGRAPHS_TWO/);
});
test('Q15 failure diagnostic bounds the amount of metadata',async()=>{
 const f=q15Dom();for(let i=0;i<200;i++)f.statement.append(new f.TextNode('private synthetic text '+i));
 const observed=normalize(await f.target.evaluate(H.inspectQ15FailureMetadata,Q15.BROWSER_SCOPE));
 assert.equal(observed.truncated,true);assert(observed.statementAtoms.length<=64);assert(observed.visitedNodes<=128);
 assert(!JSON.stringify(observed).includes('private synthetic'));
});
test('Q15 failure diagnostic keeps a real rejected capture rejected',async()=>{
 const f=q15Dom(),rows=[];f.content.append(new f.Element('p'));
 await assert.rejects(H.captureQ15WithDiagnostics(f.page,f.target,'/tmp/not-written.png',q15Binding(),
  {key:'E045-Q15',questionUid:Q15.UID,sourceOrdinal:15,viewport:'desktop'},rows),/UI_Q15_PARAGRAPHS_TWO/);
 assert.equal(rows.length,1);assert.equal(rows[0].failureCode,'UI_Q15_PARAGRAPHS_TWO');
 assert.equal(rows[0].observation.paragraphCount,3);assert.equal(f.state.screenshots.length,0);
});
test('Q15 failure diagnostic preserves the exact original wrapped exception',async()=>{
 const f=q15Dom(),rows=[],original=new Error('locator.evaluate: Error: UI_Q15_STATEMENT_RANGE\n private raw browser detail'),prior=Q15.captureQ15Tiles;
 Q15.captureQ15Tiles=async()=>{throw original;};
 try{await assert.rejects(H.captureQ15WithDiagnostics(f.page,f.target,'/tmp/not-written.png',q15Binding(),
  {key:'E045-Q15',questionUid:Q15.UID,sourceOrdinal:15,viewport:'desktop'},rows),e=>e===original);}
 finally{Q15.captureQ15Tiles=prior;}
 assert.equal(rows[0].failureCode,'UI_Q15_STATEMENT_RANGE');assert.equal(rows[0].errorMessageSha256,sha(original.message));
 assert(!JSON.stringify(rows).includes('private raw'));assert.equal(f.state.screenshots.length,0);
});
test('Q15 failure diagnostic cannot replace an original failure when observation fails',async()=>{
 const f=q15Dom(),rows=[],original=new Error('locator.evaluate: Error: UI_Q15_ROLE_CLIPPED'),prior=Q15.captureQ15Tiles;
 Q15.captureQ15Tiles=async()=>{throw original;};
 const target={evaluate:async()=>{throw new Error('private diagnostic failure');}};
 try{await assert.rejects(H.captureQ15WithDiagnostics(f.page,target,'/tmp/not-written.png',q15Binding(),
  {key:'E045-Q15',questionUid:Q15.UID,sourceOrdinal:15,viewport:'desktop'},rows),e=>e===original);}
 finally{Q15.captureQ15Tiles=prior;}
 assert.equal(rows[0].observation.status,'UNAVAILABLE');assert(!JSON.stringify(rows).includes('private diagnostic failure'));
});
test('Q15 failure diagnostic leaves the successful return and evaluations unchanged',async()=>{
 const f=q15Dom(),rows=[],result={syntheticCapture:'unchanged'},prior=Q15.captureQ15Tiles;let evaluations=0;
 Q15.captureQ15Tiles=async()=>result;
 try{assert.equal(await H.captureQ15WithDiagnostics(f.page,{evaluate:async()=>{evaluations++;}},'/tmp/not-written.png',q15Binding(),
  {key:'E045-Q15',questionUid:Q15.UID,sourceOrdinal:15,viewport:'desktop'},rows),result);}
 finally{Q15.captureQ15Tiles=prior;}
 assert.equal(evaluations,0);assert.equal(rows.length,0);
});
test('Q15 URL accepts only the official default runtime cache URL',async()=>{
 const f=q15Dom();assert.equal(sha(f.image.src),'68102e0ec9b12f6f5789f45fe94d78f0b45f6ae12015af2a0bb9ce51a17ab2c4');
 const frame=normalize(await f.measure());assert.equal(frame.surface.imageCount,1);assert.equal(frame.surface.semanticChildCount,3);
 const diagnostic=normalize(await f.target.evaluate(H.inspectQ15FailureMetadata,Q15.BROWSER_SCOPE));assert.equal(diagnostic.imagePathMatchesScope,true);
});
for(const[name,alter]of[
 ['unversioned legacy URL',s=>s.split('?')[0]],['another version',s=>s.replace('20261014.1','20261116.1')],
 ['extra query',s=>s+'&x=1'],['duplicate version query',s=>s+'&v=20261014.1'],['encoded query value',s=>s.replace('v=2','v=%32')],
 ['fragment',s=>s+'#part'],['empty fragment marker',s=>s+'#'],['username',s=>s.replace('https://','https://user@')],
 ['password',s=>s.replace('https://','https://user:pass@')],['another origin',s=>s.replace('img.wangjiedu.com','example.invalid')],
 ['another port',s=>s.replace('.com/','.com:444/')],['insecure protocol',s=>s.replace('https:','http:')],
 ['same-origin fallback',s=>'http://localhost/archive/assets/images/'+s.split('/exams/images/')[1]],
 ['path prefix',s=>s.replace('/exams/images/','/other/exams/images/')],['another problem image',s=>s.replace('/q15-','/q24-')],
 ['file suffix',s=>s.replace('.svg?','.svg.extra?')],['encoded separator',s=>s.replace('/q15-','%2Fq15-')],
 ['double-encoded path',s=>s.replace(/%/g,'%25')],['another exam folder',s=>s.replace('/exams/images/21_','/exams/images/22_')]
])test('Q15 URL refuses '+name,async()=>{const f=q15Dom();f.image.src=alter(f.image.src);f.image.currentSrc=f.image.src;await assert.rejects(f.measure(),/UI_Q15_IMAGE_PATH/);});
test('Q15 URL refuses differing source and loaded URLs',async()=>{
 const f=q15Dom();f.image.src=f.image.src.replace('/q15-','/q24-');await assert.rejects(f.measure(),/UI_Q15_IMAGE_PATH/);
});

// Diagnostics cannot accept a missing native child. No student bytes are read.
const SharedSurface=require('../tools/capture-m1s2-problem-surface.cjs');
function q24Diagnostic(){
 const f=q15Dom(),item=manifest.items.find(r=>r.key==='E048-Q24');
 const answer=new f.Element('div','answer-box',f.rect(20,580,360,0));f.box.append(answer);
 const active={key:item.key,questionUid:item.questionUid,sourceOrdinal:24,viewport:'mobile'};
 const measured={surface:{schemaVersion:'archive-m1s2-native-problem-surface-v1',kind:'DIRECT_CHILDREN',equalSlot:false,wrapperCount:0,outerElementCount:3,
  nonemptyOutsideNodes:0,numberCount:1,contentCount:1,nestedQuestionCount:0,targetInsideContainer:true,semanticChildCount:2},
  viewport:{width:390,height:844},domSha256:sha(f.box.outerHTML)};
 return{...f,answer,item,active,measured};
}
test('Q24 failure diagnostic distinguishes real empty zero-height answer role without accepting it',async()=>{
 const f=q24Diagnostic(),before=f.box.outerHTML,observed=normalize(await f.target.evaluate(H.inspectQ24FailureMetadata));
 assert.equal(observed.status,'OBSERVATION_ONLY_NO_ACCEPTANCE');assert.equal(observed.outerElementCount,3);
 assert.equal(observed.children[2].roles.answerBox,true);assert.equal(observed.children[2].nonemptyText,false);
 assert.equal(observed.children[2].rect.height,0);assert.equal(observed.children[2].visibleBySharedRule,false);
 assert.equal(observed.children[0].roles.number,true);assert.equal(observed.children[0].visibleBySharedRule,true);
 assert.equal(observed.children[1].roles.content,true);assert.equal(observed.children[1].visibleBySharedRule,true);
 assert.equal(observed.domSha256,sha(before));assert.equal(f.box.outerHTML,before);assert.equal(observed.domWrites,0);
 const raw=JSON.stringify(observed);for(const secret of [f.text.textContent,f.image.src,'<DIV','textContent','outerHTML'])assert(!raw.includes(secret));
 assert.equal(f.state.screenshots.length,0);
});
for(const[name,alter]of[
 ['number display none',f=>f.num.style.display='none'],['content hidden',f=>f.content.style.visibility='hidden'],
 ['number collapsed',f=>f.num.style.visibility='collapse'],['content zero opacity',f=>f.content.style.opacity='0'],
 ['number zero width',f=>f.num.r.width=0],['content zero height',f=>f.content.r.height=0]
])test('Q24 failure diagnostic reports '+name+' as unavailable geometry',async()=>{
 const f=q24Diagnostic();alter(f);const o=normalize(await f.target.evaluate(H.inspectQ24FailureMetadata));
 assert(o.children.slice(0,2).some(row=>row.visibleBySharedRule===false));assert.equal(o.status,'OBSERVATION_ONLY_NO_ACCEPTANCE');
});
test('Q24 failure diagnostic bounds role metadata and excludes added private text',async()=>{
 const f=q24Diagnostic();for(let i=0;i<40;i++){const child=new f.Element('div');child.append(new f.TextNode('private-'+i));f.box.append(child);}
 const o=normalize(await f.target.evaluate(H.inspectQ24FailureMetadata));assert.equal(o.containerElementCount,43);assert.equal(o.children.length,16);
 assert.equal(o.truncated,true);assert(!JSON.stringify(o).includes('private-'));
});
test('Q24 failure diagnostic retains the real shared completeness rejection and no screenshot',async()=>{
 const f=q24Diagnostic(),rows=[];
 await assert.rejects(H.captureSharedWithDiagnostics(f.page,f.target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),/UI_NATIVE_SURFACE_COMPLETENESS/);
 assert.equal(rows.length,1);assert.equal(rows[0].failureCode,'UI_NATIVE_SURFACE_COMPLETENESS');assert.equal(rows[0].sameDomAsInitialMeasurement,true);
 assert.equal(rows[0].observation.children[2].rect.height,0);assert.equal(f.state.screenshots.length,0);
});
test('Q24 failure diagnostic reports a changed DOM without making the rejected capture pass',async()=>{
 const f=q24Diagnostic(),rows=[];f.measured.domSha256='0'.repeat(64);
 await assert.rejects(H.captureSharedWithDiagnostics(f.page,f.target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),/UI_NATIVE_SURFACE_COMPLETENESS/);
 assert.equal(rows[0].sameDomAsInitialMeasurement,false);assert.equal(f.state.screenshots.length,0);
});
test('Q24 failure diagnostic preserves an exact capture exception and hides its raw message',async()=>{
 const f=q24Diagnostic(),rows=[],original=new Error('private browser detail'),prior=SharedSurface.captureM1ProblemTiles;
 f.measured.surface.semanticChildCount=3;SharedSurface.captureM1ProblemTiles=async()=>{throw original;};
 try{await assert.rejects(H.captureSharedWithDiagnostics(f.page,f.target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),e=>e===original);}
 finally{SharedSurface.captureM1ProblemTiles=prior;}
 assert.equal(rows[0].errorMessageSha256,sha(original.message));assert(!JSON.stringify(rows).includes(original.message));
});
test('Q24 failure diagnostic cannot replace the original exception when evaluation also fails',async()=>{
 const f=q24Diagnostic(),rows=[],original=new Error('UI_NATIVE_SURFACE_COMPLETENESS'),prior=SharedSurface.assertSurfaceTopology;
 SharedSurface.assertSurfaceTopology=()=>{throw original;};
 try{await assert.rejects(H.captureSharedWithDiagnostics(f.page,{evaluate:async()=>{throw new Error('private observation');}},'/tmp/not-written.png',f.item,f.active,rows,f.measured),e=>e===original);}
 finally{SharedSurface.assertSurfaceTopology=prior;}
 assert.equal(rows[0].observation.status,'UNAVAILABLE');assert(!JSON.stringify(rows).includes('private observation'));
});
test('Q24 failure diagnostic leaves successful topology and capture calls in the original order',async()=>{
 const f=q24Diagnostic(),rows=[],calls=[],result={exact:'capture'},a=SharedSurface.assertSurfaceTopology,c=SharedSurface.captureM1ProblemTiles;
 SharedSurface.assertSurfaceTopology=s=>{assert.equal(s,f.measured.surface);calls.push('topology');};
 SharedSurface.captureM1ProblemTiles=async(p,t,file)=>{assert.equal(p,f.page);assert.equal(t,target);assert.equal(file,'/tmp/not-written.png');calls.push('capture');return result;};
 const target={evaluate:async()=>{throw new Error('diagnostic must not run on success');}};
 try{assert.equal(await H.captureSharedWithDiagnostics(f.page,target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),result);}
 finally{SharedSurface.assertSurfaceTopology=a;SharedSurface.captureM1ProblemTiles=c;}
 assert.deepEqual(calls,['topology','capture']);assert.equal(rows.length,0);
});
for(const[name,alter]of[
 ['other UID',f=>f.item={...f.item,questionUid:Q15.UID}],['other key',f=>f.item={...f.item,key:'E045-Q24'}],
 ['other ordinal',f=>f.item={...f.item,sourceOrdinal:13}],['other whole question',f=>f.item={...f.item,questionSha256:'0'.repeat(64)}],
 ['desktop',f=>f.active={...f.active,viewport:'desktop'}],['different width',f=>f.measured.viewport.width=391],
 ['different height',f=>f.measured.viewport.height=843],['active UID disagreement',f=>f.active={...f.active,questionUid:Q15.UID}]
])test('Q24 failure diagnostic does not observe '+name,async()=>{
 const f=q24Diagnostic(),rows=[];alter(f);let observations=0;
 await assert.rejects(H.captureSharedWithDiagnostics(f.page,{evaluate:async()=>{observations++;}},'/tmp/not-written.png',f.item,f.active,rows,f.measured),/UI_NATIVE_SURFACE_COMPLETENESS/);
 assert.equal(observations,0);assert.equal(rows.length,0);assert.equal(f.state.screenshots.length,0);
});

// The mobile Q24 reader measures actual atoms and preserves the empty answer
// slot as empty. This synthetic DOM is not an actual Chrome/visual approval.
const q24Manifest=manifest.items.find(r=>r.key==='E048-Q24'),mobile={name:'mobile',width:390,height:844};
function q24Binding(){const r=q24Manifest;return{key:r.key,questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,questionSha256:r.questionSha256,
 sourceRef:{path:r.sourcePath,gitBlobSha1:r.sourceGitBlobSha1,sha256:r.sourceSha256,bytes:r.sourceBytes},
 assetRef:{path:r.assetPath,gitBlobSha1:r.assetGitBlobSha1,sha256:r.assetSha256,bytes:r.assetBytes}};}
function q24Dom(){
 const f=q15Dom();f.num.childNodes[0].textContent='24.';f.content.childNodes=[];
 f.image.src='https://img.wangjiedu.com/exams/images/'+q24Manifest.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';
 f.image.currentSrc=f.image.src;f.image.r=f.rect(30,160,340,200);
 const texts=[],maths=[],breaks=[];
 function text(x,y,width){const t=new f.TextNode('private synthetic Q24 atom '+texts.length);t.textRects=[f.rect(x,y,width,20)];texts.push(t);return t;}
 function math(x,y){const n=new f.Element('mjx-container','',f.rect(x,y,40,20)),a=new f.Element('mjx-assistive-mml');a.style.visibility='hidden';a.append(new f.TextNode('private assistive formula'));n.append(a);maths.push(n);return n;}
 function br(){const n=new f.Element('br');breaks.push(n);return n;}
 f.content.append(text(20,65,80),math(110,65),text(155,65,180),br(),text(20,110,80),math(110,110),text(155,110,180),br(),f.image,br(),text(20,400,80),math(110,400),text(155,400,180),br());
 const answer=new f.Element('div','answer-box',f.rect(20,580,360,0));f.box.append(answer);
 f.document.createRange=()=>{let n;return{selectNodeContents:x=>{n=x;},getClientRects:()=>
  n.textRects?n.textRects.map(r=>({...r,x:r.x-f.state.scrollX,y:r.y-f.state.scrollY})):[n.parentElement.getBoundingClientRect()]};};
 return{...f,texts,maths,breaks,answer,measure:()=>f.target.evaluate(Q15.measureQ24Capture,Q15.Q24_BROWSER_SCOPE)};
}
test('Q24 native fixed binding and route are limited to one exact mobile viewport',()=>{
 const b=q24Binding();assert.equal(Q15.assertQ24Binding(b,mobile),true);assert.equal(H.surfaceRoute(b,mobile),'Q24_MOBILE_NATIVE_ATOMS');
 assert.equal(H.surfaceRoute(b,{name:'desktop',width:1365,height:1000}),'SHARED_SURFACE');
 for(const item of manifest.items.filter(r=>![Q15.UID,Q15.Q24_UID,Q15.E045_Q24_UID].includes(r.questionUid)))assert.equal(H.surfaceRoute(item,mobile),'SHARED_SURFACE');
 assert.equal(H.surfaceRoute(q15Binding(),mobile),'Q15_EMBEDDED_CHOICES');
});
for(const[name,alter]of[
 ['outside UID',b=>b.questionUid=Q15.UID],['outside key',b=>b.key='E045-Q24'],['other ordinal',b=>b.sourceOrdinal=15],
 ['whole drift',b=>b.questionSha256='0'.repeat(64)],['source path drift',b=>b.sourceRef.path='archive/exams/other.js'],
 ['source Git drift',b=>b.sourceRef.gitBlobSha1='0'.repeat(40)],['source raw drift',b=>b.sourceRef.sha256='0'.repeat(64)],
 ['source length drift',b=>b.sourceRef.bytes++],['asset path drift',b=>b.assetRef.path='archive/assets/other.svg'],
 ['asset Git drift',b=>b.assetRef.gitBlobSha1='0'.repeat(40)],['asset raw drift',b=>b.assetRef.sha256='0'.repeat(64)]
])test('Q24 native binding refuses '+name,()=>{const b=q24Binding();alter(b);assert.throws(()=>Q15.assertQ24Binding(b,mobile),/UI_Q24_SCOPE/);});
for(const[name,viewport]of[['desktop',{name:'desktop',width:1365,height:1000}],['different width',{...mobile,width:391}],['different height',{...mobile,height:845}]])
 test('Q24 native binding refuses '+name+' viewport',()=>assert.throws(()=>Q15.assertQ24Binding(q24Binding(),viewport),/UI_Q24_VIEWPORT/));
for(const[name,q]of[['choices added',{choices:['synthetic']}],['embedded flag',{choices:[],choicesEmbeddedInImage:true}],
 ['nested embedded flag',{choices:[],sourcePayload:{choicesEmbeddedInImage:true}}],['top image added',{choices:[],image:'other.svg'}],['whole object changed',{choices:[]}]])
 test('Q24 preflight refuses '+name,()=>assert.throws(()=>Q15.assertQ24Preflight(q,q24Manifest),/UI_Q24_(SUBJECTIVE_SCOPE|WHOLE_QUESTION)/));
test('Q24 native reader accounts for every real text range math atom and image without parent or empty-box duplication',async()=>{
 const f=q24Dom(),frame=normalize(await f.measure());Q15.assertQ24Topology(frame.surface);
 assert.equal(frame.surface.outerElementCount,3);assert.equal(frame.surface.answerBoxHeight,0);assert.equal(frame.surface.semanticChildCount,11);
 assert.equal(frame.surface.contentTextNodes,6);assert.equal(frame.surface.contentTextRanges,6);assert.equal(frame.surface.contentMathAtoms,3);assert.equal(frame.surface.contentImageAtoms,1);
 assert.equal(frame.children.length,11);assert.deepEqual(frame.children[0],f.num.r);assert.deepEqual(frame.emptyAnswerBox,f.answer.r);
 assert(!frame.children.some(r=>stable(r)===stable(f.content.r)||stable(r)===stable(f.answer.r)));
 assert.equal(new Set(frame.children.map(stable)).size,frame.children.length);assert.equal(f.state.screenshots.length,0);
 const serialized=JSON.stringify(frame);assert(!serialized.includes('private synthetic'));assert(!serialized.includes('private assistive'));
});
test('Q24 native reader retains each line fragment of a wrapped nonempty text node',async()=>{
 const f=q24Dom();f.texts[5].textRects=[f.rect(155,400,80,20),f.rect(20,430,100,20)];
 const frame=await f.measure();assert.equal(frame.surface.contentTextNodes,6);assert.equal(frame.surface.contentTextRanges,7);assert.equal(frame.children.length,12);
});
for(const[name,alter,code]of[
 ['extra outer role',f=>f.box.append(new f.Element('div')),/UI_Q24_OUTER_THREE/],
 ['outside text',f=>f.box.append(new f.TextNode('uncaptured')),/UI_Q24_OUTSIDE_TEXT/],
 ['duplicate number',f=>f.content.classes+=' q-num',/UI_Q24_ROLE_TOPOLOGY/],
 ['nested question',f=>f.maths[0].classes='q-box',/UI_Q24_ROLE_TOPOLOGY/],
 ['choice element',f=>f.breaks[0].classes='choices',/UI_Q24_ROLE_TOPOLOGY/],
 ['wrong ordinal',f=>f.num.childNodes[0].textContent='25.',/UI_Q24_VISIBLE_ORDINAL/],
 ['extra direct text',f=>f.content.append(new f.TextNode('uncaptured')),/UI_Q24_CONTENT_TOPOLOGY/],
 ['missing direct text',f=>f.texts[0].textContent='',/UI_Q24_CONTENT_TOPOLOGY/],
 ['extra direct element',f=>f.content.append(new f.Element('span')),/UI_Q24_CONTENT_TOPOLOGY/],
 ['unknown content element',f=>f.breaks[0].tagName='IFRAME',/UI_Q24_CONTENT_ELEMENT/],
 ['unknown content node',f=>f.content.childNodes.push({nodeType:7,parentElement:f.content}),/UI_Q24_CONTENT_NODE/],
 ['hidden number',f=>f.num.style.display='none',/UI_Q24_REQUIRED_ELEMENT_HIDDEN/],
 ['hidden content',f=>f.content.style.visibility='hidden',/UI_Q24_REQUIRED_ELEMENT_HIDDEN/],
 ['hidden nested text',f=>{const n=f.breaks[0];n.tagName='SPAN';n.style.visibility='hidden';n.append(new f.TextNode('hidden'));},/UI_Q24_CONTENT_HIDDEN/],
 ['hidden attribute',f=>f.maths[0].attrs.hidden='',/UI_Q24_CONTENT_HIDDEN/],
 ['hidden math',f=>f.maths[0].style.opacity='0',/UI_Q24_MATH_ATOM/],
 ['active math descendant',f=>f.maths[0].append(new f.Element('script')),/UI_Q24_MATH_ATOM/],
 ['missing generated math atom',f=>{const m=f.maths[0];m.tagName='BR';m.childNodes=[];},/UI_Q24_CONTENT_ACCOUNTING/],
 ['extra generated math atom',f=>{const m=f.breaks[0];m.tagName='MJX-CONTAINER';m.r=f.rect(20,140,50,15);},/UI_Q24_CONTENT_ACCOUNTING/],
 ['empty text range',f=>f.texts[0].textRects=[],/UI_Q24_CONTENT_RANGE/],
 ['outside text range',f=>f.texts[0].textRects=[f.rect(0,65,80,20)],/UI_Q24_CONTENT_RANGE/],
 ['duplicate atom rectangle',f=>f.texts[1].textRects=f.texts[0].textRects,/UI_Q24_DUPLICATE_ATOM/],
 ['duplicate atom node',f=>{const i=f.content.childNodes.indexOf(f.breaks[0]);f.content.childNodes[i]=f.maths[0];},/UI_Q24_DUPLICATE_NODE/],
 ['nonempty break',f=>f.breaks[0].append(new f.TextNode('hidden')),/UI_Q24_BREAK_NODE/],
 ['answer text added',f=>f.answer.append(new f.TextNode('must not ignore')),/UI_Q24_ANSWER_NOT_EMPTY/],
 ['answer element added',f=>f.answer.append(new f.Element('span')),/UI_Q24_ANSWER_NOT_EMPTY/],
 ['answer hidden by CSS',f=>f.answer.style.display='none',/UI_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['answer hidden attribute',f=>f.answer.attrs.hidden='',/UI_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['answer positive height',f=>f.answer.r.height=1,/UI_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['answer outside question',f=>f.answer.r.x=-10,/UI_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['wrong image URL',f=>{f.image.src=f.image.currentSrc='https://img.wangjiedu.com/exams/images/other.svg?v=20261014.1';},/UI_Q24_IMAGE_PATH/],
 ['unversioned image URL',f=>{f.image.src=f.image.currentSrc=f.image.src.split('?')[0];},/UI_Q24_IMAGE_PATH/],
 ['different loaded image',f=>f.image.currentSrc+='&other=1',/UI_Q24_IMAGE_PATH/],
 ['srcset alternate',f=>f.image.attrs.srcset='other.svg 2x',/UI_Q24_IMAGE_ROLE/],
 ['incomplete image',f=>f.image.complete=false,/UI_Q24_IMAGE_READY/],
 ['image outside content',f=>f.image.r.x=0,/UI_Q24_ROLE_CLIPPED/],
 ['different actual viewport',f=>f.context.innerWidth=391,/UI_Q24_VIEWPORT/]
])test('Q24 native reader refuses '+name,async()=>{const f=q24Dom();alter(f);await assert.rejects(f.measure,code);assert.equal(f.state.screenshots.length,0);});
test('Q24 native synthetic capture preserves original tiles hit tests and zero DOM writes',async()=>{
 const f=q24Dom(),r=await Q15.captureQ24Tiles(f.page,f.target,'/tmp/synthetic-q24.png',q24Binding(),mobile);
 assert.equal(r.capture.coverage.complete,true);assert.equal(r.capture.visibleChildren,11);assert.equal(r.surface.answerBoxHeight,0);
 assert.equal(r.capture.foreignContentHits,0);assert.equal(r.capture.domWrites,0);assert.equal(r.capture.cssWrites,0);assert.equal(r.capture.viewportChanges,0);
 assert.equal(r.capture.compositeImageCreated,false);assert.equal(f.state.screenshots[0].fullPage,false);assert.equal(f.state.screenshots[0].caret,'initial');
});
test('Q24 native scroll rejects new content in the initially empty answer-box',async()=>{
 const f=q24Dom();f.state.scrollY=-1000;f.state.onScroll=()=>f.answer.append(new f.TextNode('late change'));
 await assert.rejects(Q15.captureQ24Tiles(f.page,f.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_Q24_ANSWER_NOT_EMPTY/);assert.equal(f.state.screenshots.length,0);
});
test('Q24 native postcapture text mutation remains fatal even when all rectangles are unchanged',async()=>{
 const f=q24Dom();f.state.onScreenshot=()=>f.texts[0].textContent+='changed';
 await assert.rejects(Q15.captureQ24Tiles(f.page,f.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE/);
});
test('Q24 native postcapture atom geometry change remains fatal',async()=>{
 const f=q24Dom();f.state.onScreenshot=()=>f.maths[0].r.width-=1;
 await assert.rejects(Q15.captureQ24Tiles(f.page,f.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/);
});
test('Q24 native postcapture empty-answer geometry is still part of the exact frame',async()=>{
 const f=q24Dom();f.state.onScreenshot=()=>f.answer.r.y-=1;
 await assert.rejects(Q15.captureQ24Tiles(f.page,f.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/);
});
test('Q24 native foreign hit and pending render readiness remain fatal',async()=>{
 const a=q24Dom();a.state.foreignHit=true;await assert.rejects(Q15.captureQ24Tiles(a.page,a.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_CAPTURE_FOREIGN_CONTENT/);
 const b=q24Dom();b.document.documentElement.dataset.apPrintReadiness=JSON.stringify({state:'PENDING'});
 await assert.rejects(Q15.captureQ24Tiles(b.page,b.target,'/tmp/synthetic-q24.png',q24Binding(),mobile),/UI_CAPTURE_RENDER_STATE/);
 assert.equal(a.state.screenshots.length+b.state.screenshots.length,0);
});
test('Q24 native known errors are preserved while mixed unknown wrapped errors stay generic',()=>{
 assert.equal(H.safeFailureCode(new Error('locator.evaluate: Error: UI_Q24_CONTENT_RANGE'),'FALLBACK'),'UI_Q24_CONTENT_RANGE');
 assert.equal(H.safeFailureCode(new Error('locator.evaluate: UI_Q24_FUTURE_UNKNOWN'),'FALLBACK'),'FALLBACK');
 assert.equal(H.safeFailureCode(new Error('UI_Q24_CONTENT_RANGE UI_Q15_IMAGE_PATH'),'FALLBACK'),'FALLBACK');
});
test('Q24 native failure wrapper records only diagnostics and rethrows the exact error',async()=>{
 const f=q24Dom(),rows=[],original=new Error('locator.evaluate: Error: UI_Q24_CONTENT_RANGE'),prior=Q15.captureQ24Tiles;
 Q15.captureQ24Tiles=async()=>{throw original;};
 try{await assert.rejects(H.captureQ24WithDiagnostics(f.page,f.target,'/tmp/not-written.png',q24Binding(),
  {key:'E048-Q24',questionUid:Q15.Q24_UID,sourceOrdinal:24,viewport:'mobile'},rows,{domSha256:sha(f.box.outerHTML)},mobile),e=>e===original);}
 finally{Q15.captureQ24Tiles=prior;}
 assert.equal(rows[0].failureCode,'UI_Q24_CONTENT_RANGE');assert.equal(rows[0].sameDomAsInitialMeasurement,true);assert.equal(f.state.screenshots.length,0);
});

// This synthetic observation tests failure transport only. The actual E045
// mobile child roles and dimensions have not yet been observed.
function e045Q24Diagnostic(){
 const f=q24Diagnostic(),r=manifest.items.find(row=>row.key==='E045-Q24');
 f.item={key:r.key,questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,questionSha256:r.questionSha256,
  sourceRef:{path:r.sourcePath,gitBlobSha1:r.sourceGitBlobSha1,sha256:r.sourceSha256,bytes:r.sourceBytes},
  assetRef:{path:r.assetPath,gitBlobSha1:r.assetGitBlobSha1,sha256:r.assetSha256,bytes:r.assetBytes}};
 f.active={key:r.key,questionUid:r.questionUid,sourceOrdinal:24,viewport:'mobile'};
 return f;
}
test('E045 Q24 failure diagnostic retains the real shared rejection and does not capture',async()=>{
 const f=e045Q24Diagnostic(),rows=[];
 await assert.rejects(H.captureSharedWithDiagnostics(f.page,f.target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),/UI_NATIVE_SURFACE_COMPLETENESS/);
 assert.equal(rows.length,1);assert.equal(rows[0].key,'E045-Q24');assert.equal(rows[0].questionUid,f.item.questionUid);
 assert.equal(rows[0].failureCode,'UI_NATIVE_SURFACE_COMPLETENESS');assert.equal(rows[0].sameDomAsInitialMeasurement,true);
 assert.equal(rows[0].observation.status,'OBSERVATION_ONLY_NO_ACCEPTANCE');assert.equal(f.state.screenshots.length,0);
 const raw=JSON.stringify(rows);for(const secret of [f.text.textContent,f.image.src,'<DIV','textContent','outerHTML'])assert(!raw.includes(secret));
});
test('E045 Q24 failure diagnostic preserves the exact original exception when observation also fails',async()=>{
 const f=e045Q24Diagnostic(),rows=[],original=new Error('UI_NATIVE_SURFACE_COMPLETENESS'),prior=SharedSurface.assertSurfaceTopology;
 SharedSurface.assertSurfaceTopology=()=>{throw original;};
 try{await assert.rejects(H.captureSharedWithDiagnostics(f.page,{evaluate:async()=>{throw new Error('private observation');}},'/tmp/not-written.png',f.item,f.active,rows,f.measured),e=>e===original);}
 finally{SharedSurface.assertSurfaceTopology=prior;}
 assert.equal(rows.length,1);assert.equal(rows[0].observation.status,'UNAVAILABLE');assert.equal(rows[0].errorMessageSha256,sha(original.message));
 assert(!JSON.stringify(rows).includes('private observation'));assert.equal(f.state.screenshots.length,0);
});
test('E045 Q24 failure diagnostic leaves the successful call order and return unchanged',async()=>{
 const f=e045Q24Diagnostic(),rows=[],calls=[],result={exact:'capture'},a=SharedSurface.assertSurfaceTopology,c=SharedSurface.captureM1ProblemTiles;
 SharedSurface.assertSurfaceTopology=s=>{assert.equal(s,f.measured.surface);calls.push('topology');};
 SharedSurface.captureM1ProblemTiles=async(p,t,file)=>{assert.equal(p,f.page);assert.equal(t,target);assert.equal(file,'/tmp/not-written.png');calls.push('capture');return result;};
 const target={evaluate:async()=>{throw new Error('diagnostic must not run on success');}};
 try{assert.equal(await H.captureSharedWithDiagnostics(f.page,target,'/tmp/not-written.png',f.item,f.active,rows,f.measured),result);}
 finally{SharedSurface.assertSurfaceTopology=a;SharedSurface.captureM1ProblemTiles=c;}
 assert.deepEqual(calls,['topology','capture']);assert.equal(rows.length,0);
});
for(const[name,alter]of[
 ['other UID',f=>f.item.questionUid=Q15.UID],['other key',f=>f.item.key='E048-Q24'],
 ['other ordinal',f=>f.item.sourceOrdinal=15],['other whole question',f=>f.item.questionSha256='0'.repeat(64)],
 ['missing source reference',f=>delete f.item.sourceRef],['different source path',f=>f.item.sourceRef.path='archive/exams/other.js'],
 ['different source Git',f=>f.item.sourceRef.gitBlobSha1='0'.repeat(40)],['different source raw',f=>f.item.sourceRef.sha256='0'.repeat(64)],
 ['different source byte count',f=>f.item.sourceRef.bytes++],['missing asset reference',f=>delete f.item.assetRef],
 ['former asset revision',f=>f.item.assetRef.path=f.item.assetRef.path.replace('-r2.svg','-r1.svg')],
 ['different asset Git',f=>f.item.assetRef.gitBlobSha1='0'.repeat(40)],['different asset raw',f=>f.item.assetRef.sha256='0'.repeat(64)],
 ['different asset byte count',f=>f.item.assetRef.bytes++],['active key disagreement',f=>f.active.key='E048-Q24'],
 ['active UID disagreement',f=>f.active.questionUid=Q15.UID],['active ordinal disagreement',f=>f.active.sourceOrdinal=15],
 ['desktop',f=>f.active.viewport='desktop'],['different width',f=>f.measured.viewport.width=391],
 ['different height',f=>f.measured.viewport.height=843],['missing measured viewport',f=>delete f.measured.viewport]
])test('E045 Q24 failure diagnostic does not observe '+name,async()=>{
 const f=e045Q24Diagnostic(),rows=[];alter(f);let observations=0;
 await assert.rejects(H.captureSharedWithDiagnostics(f.page,{evaluate:async()=>{observations++;}},'/tmp/not-written.png',f.item,f.active,rows,f.measured),/UI_NATIVE_SURFACE_COMPLETENESS/);
 assert.equal(observations,0);assert.equal(rows.length,0);assert.equal(f.state.screenshots.length,0);
});

const e045Q24Manifest=manifest.items.find(r=>r.key==='E045-Q24');
function e045Q24Binding(){return e045Q24Diagnostic().item;}
function e045Q24Dom(){
 const f=q15Dom();f.Element.prototype.getAttribute=function(k){return Object.hasOwn(this.attrs,k)?this.attrs[k]:null;};
 f.num.childNodes[0].textContent='24.';for(const n of f.content.childNodes)n.parentElement=null;f.content.childNodes=[];
 const positions=[[20,60,360,45],[20,115,360,250],[20,375,360,45],[20,430,360,50],[20,490,360,50]];
 const paragraphs=positions.map(r=>new f.Element('p','',f.rect(...r))),texts=[],maths=[];
 f.image.r=f.rect(30,120,340,240);f.image.src='https://img.wangjiedu.com/exams/images/'+e045Q24Manifest.assetPath.slice('archive/assets/images/'.length).split('/').map(encodeURIComponent).join('/')+'?v=20261014.1';f.image.currentSrc=f.image.src;
 for(const[i,p]of paragraphs.entries()){
  if(i===1){p.append(f.image);continue;}
  const text=new f.TextNode('private synthetic paragraph '+i);text.textRects=[f.rect(20,p.r.y+2,100,15)];texts.push(text);p.append(text);
  for(let j=0;j<[2,0,1,2,1][i];j++){
   const math=new f.Element('mjx-container','',f.rect(140+j*60,p.r.y+20,45,18)),assistive=new f.Element('mjx-assistive-mml');
   assistive.style.visibility='hidden';assistive.append(new f.TextNode('private assistive formula'));math.append(assistive);maths.push(math);p.append(math);
  }
 }
 f.content.append(...paragraphs);const answer=new f.Element('div','answer-box',f.rect(20,580,360,0));f.box.append(answer);
 f.document.createRange=()=>{let n;return{selectNodeContents:x=>{n=x;},getClientRects:()=>
  n.textRects?n.textRects.map(r=>({...r,x:r.x-f.state.scrollX,y:r.y-f.state.scrollY})):[n.parentElement.getBoundingClientRect()]};};
 return{...f,paragraphs,texts,maths,answer,measure:()=>f.target.evaluate(Q15.measureE045Q24Capture,Q15.E045_Q24_BROWSER_SCOPE)};
}
test('E045 Q24 native binding routes only its exact mobile edition while old routes remain unchanged',()=>{
 const b=e045Q24Binding();assert.equal(Q15.assertE045Q24Binding(b,mobile),true);assert.equal(H.surfaceRoute(b,mobile),'E045_Q24_MOBILE_NATIVE_PARAGRAPHS');
 assert.equal(H.surfaceRoute(b,{name:'desktop',width:1365,height:1000}),'SHARED_SURFACE');
 assert.equal(H.surfaceRoute(q15Binding(),mobile),'Q15_EMBEDDED_CHOICES');assert.equal(H.surfaceRoute(q24Binding(),mobile),'Q24_MOBILE_NATIVE_ATOMS');
 for(const item of manifest.items.filter(r=>![Q15.UID,Q15.Q24_UID,Q15.E045_Q24_UID].includes(r.questionUid)))assert.equal(H.surfaceRoute(item,mobile),'SHARED_SURFACE');
});
for(const[name,alter]of[
 ['outside UID',b=>b.questionUid=Q15.Q24_UID],['outside key',b=>b.key='E048-Q24'],['other ordinal',b=>b.sourceOrdinal=15],
 ['whole drift',b=>b.questionSha256='0'.repeat(64)],['source path drift',b=>b.sourceRef.path='archive/exams/other.js'],
 ['source Git drift',b=>b.sourceRef.gitBlobSha1='0'.repeat(40)],['source raw drift',b=>b.sourceRef.sha256='0'.repeat(64)],['source length drift',b=>b.sourceRef.bytes++],
 ['previous asset edition',b=>b.assetRef.path=b.assetRef.path.replace('-r2.svg','-r1.svg')],['asset Git drift',b=>b.assetRef.gitBlobSha1='0'.repeat(40)],
 ['asset raw drift',b=>b.assetRef.sha256='0'.repeat(64)],['asset length drift',b=>b.assetRef.bytes++]
])test('E045 Q24 native binding refuses '+name,()=>{const b=e045Q24Binding();alter(b);assert.throws(()=>Q15.assertE045Q24Binding(b,mobile),/UI_E045_Q24_SCOPE/);});
for(const[name,viewport]of[['desktop',{name:'desktop',width:1365,height:1000}],['different width',{...mobile,width:391}],['different height',{...mobile,height:845}]])
 test('E045 Q24 native binding refuses '+name+' viewport',()=>assert.throws(()=>Q15.assertE045Q24Binding(e045Q24Binding(),viewport),/UI_E045_Q24_VIEWPORT/));
for(const[name,q]of[['choices added',{choices:['synthetic']}],['embedded flag',{choices:[],choicesEmbeddedInImage:true}],
 ['nested embedded flag',{choices:[],sourcePayload:{choicesEmbeddedInImage:true}}],['top image added',{choices:[],image:'other.svg'}],['whole object changed',{choices:[]}]])
 test('E045 Q24 preflight refuses '+name,()=>assert.throws(()=>Q15.assertE045Q24Preflight(q,e045Q24Manifest),/UI_E045_Q24_(SUBJECTIVE_SCOPE|WHOLE_QUESTION)/));
test('E045 Q24 native reader measures the real six surfaces and authenticates every descendant without parent or empty-box duplication',async()=>{
 const f=e045Q24Dom(),frame=normalize(await f.measure());Q15.assertE045Q24Topology(frame.surface);
 assert.equal(frame.surface.semanticChildCount,6);assert.equal(frame.surface.contentMathAtoms,6);assert.equal(frame.surface.contentImageAtoms,1);
 assert.equal(frame.surface.contentTextNodes,4);assert.equal(frame.surface.contentTextRanges,4);assert.equal(frame.semanticAtoms.length,11);
 assert.equal(frame.surface.paragraphCount,5);assert.equal(frame.surface.answerBoxHeight,0);assert.equal(frame.emptyAnswerBox.height,0);
 assert.deepEqual(frame.children,[f.num.r,...f.paragraphs.map(p=>p.r)]);assert(!frame.children.some(r=>stable(r)===stable(f.content.r)));
 assert(!JSON.stringify(frame).includes('private'));assert.equal(f.state.screenshots.length,0);
});
test('E045 Q24 native reader preserves every wrapped text line and ignores only generated assistive descendants',async()=>{
 const f=e045Q24Dom();f.texts[0].textRects=[f.rect(20,62,80,8),f.rect(20,72,80,8)];
 const frame=normalize(await f.measure());assert.equal(frame.surface.contentTextNodes,4);assert.equal(frame.surface.contentTextRanges,5);assert.equal(frame.surface.contentMathAtoms,6);
 assert.equal(frame.semanticAtoms.length,12);assert.equal(frame.children.length,6);
});
for(const[name,alter,code]of[
 ['another viewport',f=>f.context.innerWidth=391,/UI_E045_Q24_VIEWPORT/],
 ['extra outer child',f=>f.box.append(new f.Element('div')),/UI_E045_Q24_OUTER_THREE/],
 ['outer text',f=>f.box.append(new f.TextNode('unaccounted')),/UI_E045_Q24_OUTSIDE_TEXT/],
 ['equal-slot route',f=>f.box.classes+=' ap-equal-slot',/UI_E045_Q24_DIRECT_TOPOLOGY/],
 ['nested question',f=>f.paragraphs[0].classes='q-box',/UI_E045_Q24_ROLE_TOPOLOGY/],
 ['choice carrier',f=>f.paragraphs[0].classes='choices',/UI_E045_Q24_ROLE_TOPOLOGY/],
 ['duplicate number',f=>f.paragraphs[0].classes='q-num',/UI_E045_Q24_ROLE_TOPOLOGY/],
 ['missing paragraph',f=>f.content.childNodes.pop(),/UI_E045_Q24_PARAGRAPHS_FIVE/],
 ['extra paragraph',f=>f.content.append(new f.Element('p')),/UI_E045_Q24_PARAGRAPHS_FIVE/],
 ['non-paragraph wrapper',f=>f.paragraphs[2].tagName='DIV',/UI_E045_Q24_PARAGRAPHS_FIVE/],
 ['outside paragraph text',f=>f.content.append(new f.TextNode('unaccounted')),/UI_E045_Q24_OUTSIDE_TEXT/],
 ['swapped image paragraph',f=>{[f.content.childNodes[0],f.content.childNodes[1]]=[f.content.childNodes[1],f.content.childNodes[0]];},/UI_E045_Q24_CHILD_ORDER/],
 ['extra figure text',f=>f.paragraphs[1].append(new f.TextNode('unaccounted')),/UI_E045_Q24_OUTSIDE_TEXT/],
 ['second image',f=>f.paragraphs[3].append(new f.Element('img')),/UI_E045_Q24_IMAGE_ROLE/],
 ['alternate image source',f=>f.image.attrs.srcset='other.svg 2x',/UI_E045_Q24_IMAGE_ROLE/],
 ['changed asset path',f=>f.image.src=f.image.currentSrc=f.image.src.replace('-r2.svg','-r1.svg'),/UI_E045_Q24_IMAGE_PATH/],
 ['extra image query',f=>f.image.src=f.image.currentSrc=f.image.src+'&x=1',/UI_E045_Q24_IMAGE_PATH/],
 ['image fragment',f=>f.image.src=f.image.currentSrc=f.image.src+'#x',/UI_E045_Q24_IMAGE_PATH/],
 ['incomplete image',f=>f.image.complete=false,/UI_E045_Q24_IMAGE_READY/],
 ['hidden paragraph',f=>f.paragraphs[3].style.visibility='hidden',/UI_E045_Q24_REQUIRED_ELEMENT_HIDDEN/],
 ['zero-height paragraph',f=>f.paragraphs[3].r.height=0,/UI_E045_Q24_REQUIRED_ELEMENT_HIDDEN/],
 ['paragraph outside content',f=>f.paragraphs[4].r.x=0,/UI_E045_Q24_ROLE_CLIPPED/],
 ['image outside its paragraph',f=>f.image.r.width=500,/UI_E045_Q24_ROLE_CLIPPED/],
 ['nonempty answer text',f=>f.answer.append(new f.TextNode('new answer content')),/UI_E045_Q24_ANSWER_NOT_EMPTY/],
 ['answer child',f=>f.answer.append(new f.Element('span')),/UI_E045_Q24_ANSWER_NOT_EMPTY/],
 ['nonzero answer height',f=>f.answer.r.height=1,/UI_E045_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['hidden answer box',f=>f.answer.style.display='none',/UI_E045_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['hidden answer attribute',f=>f.answer.attrs.hidden='',/UI_E045_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['zero-width answer box',f=>f.answer.r.width=0,/UI_E045_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['moved answer outside question',f=>f.answer.r.y=1000,/UI_E045_Q24_EMPTY_ANSWER_GEOMETRY/],
 ['overlapping paragraphs',f=>{f.paragraphs[3].r.y=400;},/UI_E045_Q24_SEMANTIC_ROLES_OVERLAP/],
 ['unmeasurable text',f=>f.texts[0].textRects=[],/UI_E045_Q24_CONTENT_RANGE/],
 ['text outside its paragraph',f=>f.texts[0].textRects=[f.rect(0,62,80,15)],/UI_E045_Q24_CONTENT_RANGE/],
 ['duplicate text range',f=>f.texts[0].textRects.push({...f.texts[0].textRects[0]}),/UI_E045_Q24_DUPLICATE_ATOM/],
 ['duplicate node',f=>f.paragraphs[0].childNodes.push(f.texts[0]),/UI_E045_Q24_DUPLICATE_NODE/],
 ['hidden text wrapper',f=>{const e=new f.Element('span','',f.paragraphs[4].r);e.style.opacity='0';e.append(new f.TextNode('hidden'));f.paragraphs[4].append(e);},/UI_E045_Q24_CONTENT_HIDDEN/],
 ['active node',f=>f.paragraphs[4].append(new f.Element('iframe')),/UI_E045_Q24_CONTENT_ELEMENT/],
 ['unknown inline SVG',f=>f.paragraphs[4].append(new f.Element('svg')),/UI_E045_Q24_CONTENT_ELEMENT/],
 ['hidden math',f=>f.maths[0].style.visibility='hidden',/UI_E045_Q24_CONTENT_HIDDEN/],
 ['math outside paragraph',f=>f.maths[0].r.y=1000,/UI_E045_Q24_MATH_ATOM/],
 ['active content inside generated math',f=>f.maths[0].append(new f.Element('iframe')),/UI_E045_Q24_MATH_ATOM/],
 ['math rendering error',f=>f.maths[0].append(new f.Element('mjx-merror')),/UI_E045_Q24_MATH_ATOM/],
 ['missing math atom',f=>{const m=f.maths[0];m.parentElement.childNodes=m.parentElement.childNodes.filter(n=>n!==m);},/UI_E045_Q24_CONTENT_ACCOUNTING/],
 ['extra math atom',f=>f.paragraphs[4].append(new f.Element('mjx-container','',f.rect(250,510,40,18))),/UI_E045_Q24_CONTENT_ACCOUNTING/],
 ['empty semantic paragraph',f=>f.paragraphs[4].childNodes=[],/UI_E045_Q24_PARAGRAPH_ACCOUNTING/]
])test('E045 Q24 native reader refuses '+name,async()=>{const f=e045Q24Dom();alter(f);await assert.rejects(f.measure,code);assert.equal(f.state.screenshots.length,0);});
test('E045 Q24 native capture keeps the original scroll tiles hit tests and zero DOM writes',async()=>{
 const f=e045Q24Dom(),r=await Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile);
 assert.equal(r.capture.visibleChildren,6);assert.equal(r.capture.coverage.complete,true);assert.equal(r.capture.foreignContentHits,0);
 for(const k of ['domWrites','cssWrites','viewportChanges'])assert.equal(r.capture[k],0);assert.equal(r.capture.compositeImageCreated,false);
 assert.equal(f.state.screenshots.length,1);assert.equal(f.state.screenshots[0].fullPage,false);assert.equal(f.state.screenshots[0].caret,'initial');
});
test('E045 Q24 native scroll rejects changed empty answer content before capture',async()=>{
 const f=e045Q24Dom();f.state.scrollY=-1000;f.state.onScroll=()=>f.answer.append(new f.TextNode('changed'));
 await assert.rejects(()=>Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_E045_Q24_ANSWER_NOT_EMPTY/);
 assert.equal(f.state.screenshots.length,0);
});
test('E045 Q24 native postcapture text mutation remains fatal',async()=>{
 const f=e045Q24Dom();f.state.onScreenshot=()=>f.texts[0].textContent+=' changed';
 await assert.rejects(()=>Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_PROBLEM_DOM_CHANGED_DURING_CAPTURE/);
});
test('E045 Q24 native postcapture descendant movement is fatal even with fixed paragraph rectangles',async()=>{
 const f=e045Q24Dom();f.state.onScreenshot=()=>{f.texts[0].textRects[0].x+=2;};
 await assert.rejects(()=>Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/);
});
test('E045 Q24 native postcapture empty-answer movement remains part of the exact frame',async()=>{
 const f=e045Q24Dom();f.state.onScreenshot=()=>{f.answer.r.y+=1;};
 await assert.rejects(()=>Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_SCROLL_TILE_DOCUMENT_GEOMETRY_CHANGED/);
});
test('E045 Q24 native foreign hit and pending readiness remain fatal',async()=>{
 const f=e045Q24Dom();f.state.foreignHit=true;
 await assert.rejects(()=>Q15.captureE045Q24Tiles(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_CAPTURE_FOREIGN_CONTENT/);assert.equal(f.state.screenshots.length,0);
 const g=e045Q24Dom();g.document.documentElement.dataset.apPrintReadiness=JSON.stringify({state:'PENDING'});
 await assert.rejects(()=>Q15.captureE045Q24Tiles(g.page,g.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),mobile),/UI_CAPTURE_RENDER_STATE/);assert.equal(g.state.screenshots.length,0);
});
test('E045 Q24 native known wrapped errors remain exact and failure diagnostics preserve original identity',async()=>{
 assert.equal(H.safeFailureCode(new Error('locator.evaluate: Error: UI_E045_Q24_PARAGRAPHS_FIVE'),'FALLBACK'),'UI_E045_Q24_PARAGRAPHS_FIVE');
 assert.equal(H.safeFailureCode(new Error('UI_E045_Q24_NOT_KNOWN: wrapped'),'FALLBACK'),'FALLBACK');
 assert.equal(H.safeFailureCode(new Error('UI_E045_Q24_PARAGRAPHS_FIVE UI_Q24_CONTENT_RANGE'),'FALLBACK'),'FALLBACK');
 const f=e045Q24Dom(),rows=[],original=new Error('locator.evaluate: Error: UI_E045_Q24_CONTENT_RANGE'),prior=Q15.captureE045Q24Tiles;
 Q15.captureE045Q24Tiles=async()=>{throw original;};
 try{await assert.rejects(()=>H.captureE045Q24WithDiagnostics(f.page,f.target,'/tmp/synthetic-e045-q24.png',e045Q24Binding(),
  {key:'E045-Q24',questionUid:Q15.E045_Q24_UID,sourceOrdinal:24,viewport:'mobile'},rows,{domSha256:sha(f.box.outerHTML)},mobile),e=>e===original);}
 finally{Q15.captureE045Q24Tiles=prior;}
 assert.equal(rows.length,1);assert.equal(rows[0].failureCode,'UI_E045_Q24_CONTENT_RANGE');assert.equal(rows[0].sameDomAsInitialMeasurement,true);
 assert(!JSON.stringify(rows).includes('private'));assert.equal(f.state.screenshots.length,0);
});
