'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../archive/generated-bank.html'),'utf8');
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
   records.push({uid,school,year:2026,grade:'고1',subject:'공통수학1',sourceQid:i,sourceExamBlobSha:sourceSha,localOrdinal:i,shard,sourceKind:'generated'});
   items.push({generatedUid:uid,localOrdinal:i,sourceKind:'generated',question:{questionType:subjective?'서술형':'객관식',content:subjective?'표를 확인하세요. '+table+'경우의 수를 구하시오.':'값을 구하시오.',choices:subjective?[]:['1','2','3','4','5'],answer:subjective?'$8$':'③',solution:'해설'}});
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
function runFixture(){
 const {index,shards}=fixture(),nodes={};
 const document={getElementById:id=>nodes[id]??(nodes[id]=new Node()),createElement:tag=>new Node(tag),createDocumentFragment:()=>new Node('fragment',true)};
 let printed=0;
 const fetch=async url=>({ok:url===base+'index.json'||!!shards[url],status:404,json:async()=>url===base+'index.json'?index:shards[url]});
 const context=vm.createContext({document,fetch,window:{print:()=>printed++},Map,Set,Promise,console});
 vm.runInContext(inline,context,{timeout:2000});
 return {el:id=>document.getElementById(id),context,getPrinted:()=>printed};
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
