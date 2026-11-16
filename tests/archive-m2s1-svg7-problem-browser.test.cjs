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
 const figure=new Element('p','',rect(20,120,360,420)),image=new Element('img','',rect(30,125,340,400));image.src='https://img.wangjiedu.com/exams/images/'+q15Manifest.assetPath.slice('archive/assets/images/'.length);image.currentSrc=image.src;image.complete=true;image.naturalWidth=680;image.naturalHeight=800;
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
