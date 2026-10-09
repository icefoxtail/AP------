'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../archive/generated-bank.html'),'utf8');
const mixedHtml=fs.readFileSync(path.join(__dirname,'../archive/mixed_engine.html'),'utf8');
const solutionExecutor=fs.readFileSync(path.join(__dirname,'../archive/solution-render-executor.js'),'utf8');
const commonFastRuntime=fs.readFileSync(path.join(__dirname,'../archive/common-fast-runtime.js'),'utf8');
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].at(-1)?.[1];
const base='data/generated-lite-consumer/v1/',bs='8266fa476906e9134b94f23e803bd3b2fb26ece4',hy='69ad80ffa9ec80b2592bee26ffce247f8d7013d1';
const table='<div class="question-table-wrap"><table class="question-table"><thead><tr><th>코스</th><th>가</th></tr></thead><tbody><tr><th>출발</th><td>1</td></tr></tbody></table></div>';
const fixture=()=>{
 const records=[],shards={};
 for(const [school,sourceSha,count,shardName] of [['복성고',bs,23,'bsg'],['효천고',hy,26,'hyc']]){
  const shard=base+'shards/'+shardName+'.json',items=[];
  for(let i=1;i<=count;i++){
   const uid='ALITE-TEST-'+shardName.toUpperCase()+'-'+String(i).padStart(3,'0');
   const subjective=school==='복성고'&&i===23;
   records.push({uid,school,year:2026,grade:'고1',subject:'공통수학1',sourceQid:i,sourceExamBlobSha:sourceSha,localOrdinal:i,shard,sourceKind:'generated',consumerSelectable:true,approval:'REVIEW_APPROVED',reviewStatus:'REVIEW_PASS'});
   items.push({generatedUid:uid,localOrdinal:i,sourceKind:'generated',question:{uid,questionType:subjective?'서술형':'객관식',content:subjective?'표를 확인하세요. '+table+'경우의 수를 구하시오.':'값을 구하시오.',choices:subjective?[]:['1','2','3','4','5'],answer:subjective?'$8$':'③',solution:'해설',image:'assets/generated-lite/'+uid+'.svg',solutionImage:'assets/generated-lite/'+uid+'-solution.svg',solutionImageAlt:'해설 그림 '+uid,solutionImageCaption:'해설 캡션'}});
  }
  shards[shard]={schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',records:items};
 }
 return {index:{schemaVersion:'ALIVE_GENERATED_CONSUMER_INDEX_V1',sourceKind:'generated',approvedCount:49,excludedHoldUids:['ALITE-TEST-HOLD'],records},shards};
};
class Node{
 constructor(tag='div',fragment=false){this.tag=tag;this.fragment=fragment;this.children=[];this.listeners={};this.textContent='';this.disabled=false;this.attributes={};}
 appendChild(node){if(node.fragment)this.children.push(...node.children);else this.children.push(node);return node;}
 replaceChildren(...nodes){this.children=[];this.textContent='';for(const n of nodes)this.appendChild(n);}
 addEventListener(type,fn){this.listeners[type]=fn;}
 setAttribute(key,value){this.attributes[key]=value;}
}
function runFixture({session=null,holdShard=false,popupStartsClosed=false}={}){
 const {index,shards}=fixture(),nodes={};
 const document={getElementById:id=>nodes[id]??(nodes[id]=new Node()),createElement:tag=>new Node(tag),createDocumentFragment:()=>new Node('fragment',true)};
 let printed=0,popup=null,published=null,publishCalls=0,cleanups=[];let releaseShard;
 const fetch=async url=>{
  if(url===base+'index.json')return {ok:true,status:200,json:async()=>index};
  if(shards[url])return {ok:true,status:200,json:holdShard?()=>new Promise(resolve=>{releaseShard=()=>resolve(shards[url])}):async()=>shards[url]};
  return {ok:false,status:404,json:async()=>({})};
 };
 const output={
  publishOutputEnvelope:async value=>{publishCalls++;published={...value,outputRequestId:'test-request',ownerId:'test-owner'};return published;},
  outputEnvelopeUrl:(path,href,envelope,options)=>{const url=new URL(path,href);url.searchParams.set('archive2Context','archive2');url.searchParams.set('archive2OutputContract','archive2-output-envelope-v1');url.searchParams.set('mode',envelope.mode);url.searchParams.set('q',String(envelope.questionCount));url.searchParams.set('outputRequestId',envelope.outputRequestId);url.searchParams.set('outputOwnerId',envelope.ownerId);if(options.preview){url.searchParams.set('preview','1');url.searchParams.set('archive2Review','1');}return url;},
  createOutputStore:()=>({cleanup:async(...args)=>{cleanups.push(args);return true;}})
 };
 const localStorage={getItem:key=>key==='APMATH_SESSION'&&session?JSON.stringify(session):null};
 const window={print:()=>printed++,Archive2Output:output,open:()=>{popup={closed:popupStartsClosed,location:{href:''},close(){this.closed=true;}};return popup;}};
 const context=vm.createContext({document,fetch,window,localStorage,location:{href:'https://example.test/archive/generated-bank.html',search:''},URL,URLSearchParams,Map,Set,Promise,console});
 vm.runInContext(inline,context,{timeout:2000});
 return {el:id=>document.getElementById(id),context,getPrinted:()=>printed,getPublished:()=>published,getPublishCalls:()=>publishCalls,getPopup:()=>popup,getCleanups:()=>cleanups,releaseShard:()=>releaseShard?.()};
}
test('only exam selection and print appear; source counts match 23/26',async()=>{
 assert.ok(inline);new vm.Script(inline);
 assert.ok(!html.includes('개별 문항 검색'));assert.ok(!html.includes('검수 승인'));assert.ok(!html.includes('id="advanced"'));
 const {el,getPrinted}=runFixture();await new Promise(resolve=>setTimeout(resolve,25));
 assert.equal(el('exam-cards').children.length,2);
 assert.equal(el('print').disabled,true);
 const cards=el('exam-cards').children;
 const bok=cards.find(c=>c.children[0]?.textContent.includes('복성고'));
 const hyo=cards.find(c=>c.children[0]?.textContent.includes('효천고'));
 assert.ok(bok&&hyo);
 assert.match(bok.children[1].textContent,/23문항/);
 assert.match(hyo.children[1].textContent,/26문항/);
 bok.onclick();await el('print').listeners.click();
 assert.equal(getPrinted(),1);
 assert.equal(el('paper-items').children.length,23);
 assert.match(el('paper-title').textContent,/복성고/);
 assert.equal(el('paper-items').children.at(-1).children.some(c=>c.className==='stem'),true);
 hyo.onclick();await el('print').listeners.click();
 assert.equal(getPrinted(),2);
 assert.equal(el('paper-items').children.length,26);
 assert.match(el('paper-title').textContent,/효천고/);
});
test('subjective HTML table is parsed as safe real table; unknown tags are escaped',()=>{
 const {context}=runFixture(),p=new Node();
 context.__p=p;context.__table=table;
 vm.runInContext("questionStem(__p,'표 '+__table+' 답하시오.')",context,{timeout:2000});
 const stem=p.children[0],wrap=stem.children.find(c=>c.className==='question-table-wrap');
 assert.ok(wrap);assert.equal(wrap.children[0].tag,'table');
 assert.equal(wrap.children[0].children.length,2);
 const p2=new Node();context.__p2=p2;
 vm.runInContext("questionStem(__p2,'앞<span onmouseover=alert(1)>오염</span>뒤')",context,{timeout:2000});
 assert.ok(p2.children[0].children.every(c=>c.tag==='span'));
 assert.match(p2.children[0].children[0].textContent,/onmouseover/);
});
test('student preview never exposes answers or solution SVG and cannot open solution mode',async()=>{
 const {el,context,getPopup,getPublishCalls}=runFixture(),indexReady=new Promise(resolve=>setTimeout(resolve,25));await indexReady;
 const row=vm.runInContext("selectableRows[0]",context);context.__testRow=row;
 await vm.runInContext('openGeneratedPreview(__testRow)',context,{timeout:2000});
 const preview=el('generated-preview');
 assert.equal(preview.children.some(c=>c.textContent?.includes('교사용 해설 미리보기')),false);
 assert.equal(JSON.stringify(preview.children).includes('해설 그림'),false);
 assert.equal(JSON.stringify(preview.children).includes('해설'),false);
 assert.equal(JSON.stringify(preview.children).includes('정답:'),false);
 await vm.runInContext('openGeneratedSolution(__testRow)',context,{timeout:2000});
 assert.equal(getPopup(),null);assert.equal(getPublishCalls(),0);
});
test('teacher solution preview uses approved Consumer question in shared single-column sol envelope',async()=>{
 const {el,context,getPublished,getPopup}=runFixture({session:{role:'teacher',session_token:'test-session'}});await new Promise(resolve=>setTimeout(resolve,25));
 const row=vm.runInContext("selectableRows[0]",context);context.__testRow=row;
 await vm.runInContext('openGeneratedPreview(__testRow)',context,{timeout:2000});
 assert.ok(el('generated-preview').children.some(c=>c.textContent==='교사용 해설 미리보기'));
 await vm.runInContext('openGeneratedSolution(__testRow)',context,{timeout:2000});
 const output=getPublished(),question=output.questions[0],url=new URL(getPopup().location.href);
 assert.equal(output.mode,'sol');assert.equal(output.meta.qpp,1);assert.equal(output.questionUids[0],row.uid);
 assert.equal(question.uid,row.uid);assert.equal(question.image,'assets/generated-lite/'+row.uid+'.svg');assert.deepEqual(Array.from(question.choices),['1','2','3','4','5']);assert.equal(question.solutionImage,'assets/generated-lite/'+row.uid+'-solution.svg');
 assert.equal(question.solutionImageSize,'full');assert.equal(question.solutionImageLayout,'fullwidth');
 assert.equal(question.solutionImageAlt,'해설 그림 '+row.uid);assert.equal(question.solutionImageCaption,'해설 캡션');
 assert.equal(question.content,'값을 구하시오.');assert.equal(question.answer,'③');
 assert.equal(url.pathname,'/archive/mixed_engine.html');assert.equal(url.searchParams.get('mode'),'sol');assert.equal(url.searchParams.get('preview'),'1');
 assert.equal(url.searchParams.get('outputOwnerId'),output.ownerId);assert.equal(url.searchParams.get('archive2Context'),'archive2');assert.equal(url.searchParams.get('archive2OutputContract'),'archive2-output-envelope-v1');
});
test('mixed solution renderer gives qpp=1 a full-width single column and retains default two-column layout',()=>{
 assert.match(mixedHtml,/const singleColumn = normalizeMixedQpp\(AppState\.qpp\) === 1/);
 assert.match(mixedHtml,/\.grid-container\.sol-fullwidth-grid/);
 assert.match(mixedHtml,/q\.solutionImageLayout === 'fullwidth'/);
 assert.match(mixedHtml,/grid-template-columns: 1fr 1fr/);
 assert.match(solutionExecutor,/const singleColumn = Number\(appState\?\.qpp\) === 1/);
 assert.match(solutionExecutor,/grid-container\$\{singleColumn \? ' sol-fullwidth-grid' : ''\}/);
 assert.match(solutionExecutor,/if \(!singleColumn\) grid\.appendChild\(r\)/);
 assert.match(solutionExecutor,/if \(colIdx === 0 && cols\.length > 1\) colIdx = 1/);
});
test('typeset failure keeps exact one-question TeX diagnostics and still fails closed',()=>{
 assert.match(commonFastRuntime,/const unrenderedMathCount = root\.APRenderLoop\.unrenderedMathCount\(ctx\.targetArea\)/);
 assert.match(commonFastRuntime,/root\.__AP_SOLUTION_TYPESET_DIAGNOSTICS__/);
 assert.match(commonFastRuntime,/sourceQuestions\.length === 1 \? sourceQuestions\[0\] : null/);
 assert.match(commonFastRuntime,/dollarTextNodes: dollarTextNodes\(box\)/);
 assert.match(commonFastRuntime,/sourceSolutionTeX: String\(question\?\.solution \|\| question\?\.explanation \|\| question\?\.sol \|\| ''\)/);
 assert.match(commonFastRuntime,/throw Error\('MATH_TYPESET_INCOMPLETE'\)/);
});
test('closing the teacher popup while its Consumer shard is loading cancels output publication',async()=>{
 const {context,getPopup,getPublishCalls,releaseShard}=runFixture({session:{role:'teacher',session_token:'test-session'},holdShard:true});await new Promise(resolve=>setTimeout(resolve,25));
 const row=vm.runInContext("selectableRows[0]",context);context.__testRow=row;
 const pending=vm.runInContext('openGeneratedSolution(__testRow)',context,{timeout:2000});
 await new Promise(resolve=>setTimeout(resolve,0));getPopup().closed=true;releaseShard();await pending;
 assert.equal(getPublishCalls(),0);
});
