'use strict';
// Synthetic DOM topology and original capture geometry only; no item approval.
const test=require('node:test'),assert=require('node:assert/strict');
const crypto=require('node:crypto');
const S=require('../tools/capture-m1s2-problem-surface.cjs');
const H=require('../tools/check-reviewed-problem-renderer-browser.cjs');
function topology(){return{schemaVersion:'archive-m1s2-native-problem-surface-v1',kind:'AP_EQUAL_SLOT_CONTENT',equalSlot:true,wrapperCount:1,outerElementCount:1,nonemptyOutsideNodes:0,numberCount:1,contentCount:1,nestedQuestionCount:0,targetInsideContainer:true,semanticChildCount:3};}
test('official single wrapper preserves three actual semantic children',()=>assert.equal(S.assertSurfaceTopology(topology()).semanticChildCount,3));
test('ordinary direct children retain the original capture contract',()=>S.assertSurfaceTopology({...topology(),kind:'DIRECT_CHILDREN',equalSlot:false,wrapperCount:0,outerElementCount:3}));
for(const[name,change]of[
 ['arbitrary wrapper',s=>{s.kind='CUSTOM_WRAPPER';}],['slot without official wrapper',s=>{s.wrapperCount=0;}],['duplicate wrappers',s=>{s.wrapperCount=2;}],
 ['nonempty outside text',s=>{s.nonemptyOutsideNodes=1;}],['outside element',s=>{s.outerElementCount=2;}],['nested question',s=>{s.nestedQuestionCount=1;}],
 ['duplicate number',s=>{s.numberCount=2;}],['missing statement',s=>{s.contentCount=0;}],['target outside envelope',s=>{s.targetInsideContainer=false;}],
 ['two-child threshold bypass',s=>{s.semanticChildCount=2;}],['false equal-slot marker',s=>{s.equalSlot=false;}],['unknown field',s=>{s.waiver=true;}]
])test('surface rejects '+name,()=>{const s=topology();change(s);assert.throws(()=>S.assertSurfaceTopology(s),/UI_NATIVE_/);});
function node(classes,rect,children=[],tag='DIV'){
 const n={nodeType:1,tagName:tag,childNodes:children,textContent:tag==='IMG'?'':'SYNTHETIC',outerHTML:'<synthetic/>',classList:{contains:c=>classes.split(' ').includes(c)},getBoundingClientRect:()=>rect};
 Object.defineProperty(n,'children',{get(){return n.childNodes.filter(x=>x.nodeType===1);}});
 n.matches=s=>s.startsWith('.')&&n.classList.contains(s.slice(1));
 n.querySelectorAll=s=>{const result=[];for(const c of n.children){if(s==='img'?c.tagName==='IMG':c.matches(s))result.push(c);result.push(...c.querySelectorAll(s));}return result;};
 n.querySelector=s=>n.querySelectorAll(s)[0]||null;n.contains=x=>n===x||n.children.some(c=>c.contains(x));
 n.closest=s=>n.matches(s)?n:n.parent?.closest(s)||null;for(const c of children)c.parent=n;return n;
}
function dom(t,mode='official'){
 const old=new Map();const replace=(k,v)=>{old.set(k,Object.getOwnPropertyDescriptor(globalThis,k));Object.defineProperty(globalThis,k,{value:v,writable:true,configurable:true});};
 t.after(()=>{for(const[k,d]of old)d?Object.defineProperty(globalThis,k,d):delete globalThis[k];});
 const rect={x:20,y:30,width:300,height:200};const image=node('',{x:30,y:110,width:120,height:90},[],'IMG');
 const parts=[node('q-num',{x:20,y:30,width:30,height:18}),node('q-content',{x:20,y:50,width:300,height:50}),node('q-image-wrap',{x:20,y:105,width:300,height:95},[image])];
 const wrapped=mode!=='direct',container=wrapped?node(mode==='arbitrary'?'unknown':'ap-slot-content',rect,parts):null;
 const box=node('q-box'+(wrapped?' ap-equal-slot':''),{...rect,height:220},wrapped?[container]:parts);
 if(mode==='outside-text')box.childNodes.push({nodeType:3,textContent:'UNEXPECTED'});
 if(mode==='duplicate'){const another=node('ap-slot-content',rect,[]);another.parent=box;box.childNodes.push(another);}
 if(mode==='outside-element'){const another=node('unexpected',rect,[]);another.parent=box;box.childNodes.push(another);}
 replace('Node',{ELEMENT_NODE:1,TEXT_NODE:3});replace('getComputedStyle',()=>({display:'block',visibility:'visible',opacity:'1',position:'static'}));
 replace('innerWidth',1365);replace('innerHeight',1000);replace('scrollX',0);replace('scrollY',0);replace('crypto',crypto.webcrypto);
 replace('document',{querySelectorAll:()=>[],getElementById:()=>null,documentElement:{dataset:{apPrintReadiness:JSON.stringify({state:'RENDER_READY'})}},createRange:()=>({selectNodeContents(){},getBoundingClientRect:()=>rect})});
 return{image,box,container};
}
for(const mode of ['official','direct'])test('browser measurement reads '+mode+' original nodes without mutations',async t=>{const f=dom(t,mode),before=f.box.outerHTML,frame=await S.measureM1ProblemCapture(f.image);S.assertSurfaceTopology(frame.surface);assert.equal(frame.children.length,3);assert.equal(f.box.outerHTML,before);assert.equal(frame.mandatoryChildrenVisible,true);const plan=H.planProblemTiles(frame);assert.equal(plan.tiles.length,1);assert.deepEqual(plan.coverage.coveredInterval,plan.coverage.requiredInterval);assert.equal(S.documentM1ProblemFrame(frame).surface.kind,mode==='official'?'AP_EQUAL_SLOT_CONTENT':'DIRECT_CHILDREN');});
for(const mode of ['arbitrary','outside-text','outside-element','duplicate'])test('browser measurement refuses '+mode+' topology',async t=>{const f=dom(t,mode),frame=await S.measureM1ProblemCapture(f.image);assert.throws(()=>S.documentM1ProblemFrame(frame),/UI_NATIVE_/);});
test('a changed capture topology cannot reuse the original document frame',async t=>{const f=dom(t),frame=await S.measureM1ProblemCapture(f.image),initial=S.documentM1ProblemFrame(frame);const changed=structuredClone(frame);changed.surface.kind='DIRECT_CHILDREN';changed.surface.equalSlot=false;changed.surface.wrapperCount=0;changed.surface.outerElementCount=3;assert.throws(()=>assert.deepEqual(S.documentM1ProblemFrame(changed),initial));});
