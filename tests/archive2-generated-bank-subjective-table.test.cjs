'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../archive/generated-bank.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const code = scripts.at(-1)?.[1];
const base = 'data/generated-lite-consumer/v1/';
const index = {
 schemaVersion:'ALIVE_GENERATED_CONSUMER_INDEX_V1',sourceKind:'generated',approvedCount:2,
 excludedHoldUids:['ALITE-BSG26-B05R2-Q22-S01'],
 records:[
  {uid:'ALITE-TEST-OBJECTIVE',school:'복성고',sourceQid:20,l2:'H22-C-09-MATRIX_APPLICATION',localOrdinal:1,shard:base+'shards/test-objective.json'},
  {uid:'ALITE-TEST-SUBJECTIVE',school:'복성고',sourceQid:23,l2:'H22-C-09-MATRIX_APPLICATION',localOrdinal:1,shard:base+'shards/test-subjective.json'}
 ]
};
const table='<div class="question-table-wrap"><table class="question-table"><thead><tr><th>코스</th><th>가</th><th>나</th></tr></thead><tbody><tr><th>출발</th><td>1</td><td>2</td></tr></tbody></table></div>';
const sample = {
 [base+'shards/test-objective.json']:{schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',records:[{generatedUid:'ALITE-TEST-OBJECTIVE',localOrdinal:1,sourceKind:'generated',question:{questionType:'객관식',content:'행렬곱의 값은?',choices:['1','2','3','4','5'],answer:'③',solution:'3이다.'}}]},
 [base+'shards/test-subjective.json']:{schemaVersion:'ALIVE_GENERATED_CONSUMER_SHARD_V1',records:[{generatedUid:'ALITE-TEST-SUBJECTIVE',localOrdinal:1,sourceKind:'generated',question:{questionType:'서술형',content:'코스를 확인하시오.'+table+'경우의 수를 구하시오.',choices:[],answer:'$8$',solution:'경우를 나누어 8을 얻는다.'}}]}
};
class Node {
 constructor(tag='div',fragment=false){this.tag=tag;this.fragment=fragment;this.children=[];this.listeners=Object.create(null);this.textContent='';this.value='';this.checked=false;this.disabled=false;}
 appendChild(child){if(child.fragment)this.children.push(...child.children);else this.children.push(child);return child;}
 replaceChildren(...nodes){this.children=[];this.textContent='';for(const n of nodes)this.appendChild(n);}
 addEventListener(kind,fn){this.listeners[kind]=fn;}
 setAttribute(key,val){this[key]=val;}
}
test('approved objective and subjective generated questions render safely; HOLD excluded',async()=>{
 assert.ok(code);
 new vm.Script(code);
 const nodes=Object.create(null);
 const document={
  getElementById:id=>nodes[id]??(nodes[id]=new Node()),
  createElement:tag=>new Node(tag),
  createDocumentFragment:()=>new Node('fragment',true)
 };
 let printed=0;
 const fetch=async url=>({ok:url===base+'index.json'||!!sample[url],status:404,json:async()=>url===base+'index.json'?index:sample[url]});
 const context=vm.createContext({document,fetch,window:{print:()=>printed++},Map,Set,Promise,console});
 vm.runInContext(code,context,{timeout:2000});
 await new Promise(resolve=>setTimeout(resolve,20));
 const el=id=>document.getElementById(id);
 assert.equal(el('count').textContent,2);
 el('query').value='ALITE-TEST-SUBJECTIVE';el('query').listeners.input();
 assert.equal(el('count').textContent,1);
 const item=el('items').children[0];
 await item.children[2].onclick();
 assert.equal(el('toggle-answer').disabled,false);
 const stem=el('detail').children.find(x=>x.className==='stem');
 assert.ok(stem);
 const wrap=stem.children.find(x=>x.className==='question-table-wrap');
 assert.ok(wrap,'must render a real table, not raw HTML tags');
 const t=wrap.children[0];assert.equal(t.tag,'table');assert.equal(t.children.length,2);
 assert.equal(t.children[0].children[0].textContent,'코스');
 assert.equal(t.children[1].children[1].textContent,'1');
 assert.ok(stem.children.some(x=>x.textContent.includes('경우의 수를 구하시오.')));
 assert.ok(!stem.children.some(x=>x.textContent.includes('<table')));
 await el('toggle-answer').listeners.click();
 assert.ok(el('detail').children.some(x=>x.textContent.includes('정답: $8$')));
 item.children[0].checked=true;item.children[0].listeners.change();
 await el('print').listeners.click();assert.equal(printed,1);
 el('query').value='ALITE-BSG26-B05R2-Q22-S01';el('query').listeners.input();
 assert.equal(el('count').textContent,0);
 el('query').value='ALITE-TEST-OBJECTIVE';el('query').listeners.input();
 assert.equal(el('count').textContent,1);
 await el('items').children[0].children[2].onclick();
 assert.equal(el('toggle-answer').disabled,false);
 const oldStem=el('detail').children.find(x=>x.className==='stem');
 assert.ok(oldStem.children.some(x=>x.textContent==='행렬곱의 값은?'));
 const c=el('detail').children.filter(x=>x.className==='choice');assert.equal(c.length,5);
 assert.ok(c[2].textContent.startsWith('③ '));
});
test('table parser escapes HTML-like content instead of executing arbitrary tags',()=>{
 const nodes=Object.create(null);
 const document={getElementById:id=>nodes[id]??(nodes[id]=new Node()),createElement:tag=>new Node(tag),createDocumentFragment:()=>new Node('fragment',true)};
 const fetch=async()=>({ok:true,json:async()=>({...index,approvedCount:1,records:index.records.slice(0,1)})});
 const context=vm.createContext({document,fetch,window:{print:()=>{}},Map,Set,Promise,console});
 vm.runInContext(code,context,{timeout:2000});
 const box=new Node();
 context.__parent=box;
 vm.runInContext("questionStem(__parent,'앞<span onmouseover=alert(1)>오염</span>뒤')",context,{timeout:2000});
 assert.ok(box.children[0].children.every(n=>n.tag==='span'));
 assert.equal(box.children[0].children[0].textContent,'앞<span onmouseover=alert(1)>오염</span>뒤');
});
