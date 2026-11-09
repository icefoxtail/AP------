// Actual c459 360px exploration: a wrapped caption covers tangent length BD and point D.
// Real Board layout/geometry contracts; actual Chromium review remains a separate gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const dir='apmath/playground/next/labs/g8-triangles';
const arg=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const plain=x=>JSON.parse(JSON.stringify(x));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const close=(a,b,why)=>assert.ok(Math.abs(a-b)<1e-7,`${why}: ${a}/${b}`);
function load(ref){
 let seed=173;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 const document={documentElement:{dataset:{}},getElementById(){},createElement(){return{};},head:{append(){}},addEventListener(){}};
 const ctx=vm.createContext({window:{},document,Math:math});
 for(const name of ['core','t1','t2','t3','t4','t5','t6','t7']){
  const file=`${dir}/${name}.js`,source=ref&&name==='t6'?execFileSync('git',['show',`${ref}:${file}`],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,file),'utf8');
  vm.runInContext(source,ctx,{filename:file});
 }
 ctx.window.APLab={clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
 vm.runInContext(fs.readFileSync(path.join(root,'apmath/playground/next/kit/apl-board.js'),'utf8'),ctx);
 const groups=ctx.window.APL_TR_GROUPS,scenes=groups.flatMap(g=>g.scenes),params=Object.assign({},...groups.map(g=>g.params));
 return {ctx,G:ctx.window.APL_TR,scenes,scene:id=>scenes.find(s=>s.id===id),state(id,patch={}){const s=Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value]));this.scene(id).enter(s);return Object.assign(s,{step:1,revealed:false,playing:false},patch);}};
}
const rt=load(arg('--baseline'));
const views=[[1039,672,56,16],[820,461,60,0],[683,548,56,16],[390,411,60,0],[360,387,60,0]];
function draw(runtime,id,s,view,tab='explore',thumb=false){
 const [W,H,bottom,right]=view,proto=runtime.ctx.window.APLab.Board.prototype,b=Object.create(proto);
 Object.assign(b,{W,H,pad:.02,kind:'figure',aspect:'1:1',insets:{left:0,right,top:0,bottom},zoom:1,panX:0,panY:0,fs:1,thumb,panes:null,paneId:null,focus:{x:[-6,6],y:[-6,6]},paths:[],arcs:[],texts:[],marks:[],leaders:[]});
 b.path=(ps,o={})=>{b.paths.push({points:ps.map(p=>b.toS(p)),world:ps,options:o});return b;};
 b.seg=(a,z,o={})=>b.path([a,z],o);
 b.arc=(p,r,a,z,o={})=>{b.arcs.push({at:b.toS(p),r:r*b.k,a,z,options:o});return b;};
 b.circle=(p,r,o={})=>{b.marks.push({method:'circle',p,r,options:o});return b;};
 for(const name of ['point','ticks','right','handle'])b[name]=(...args)=>{b.marks.push({method:name,args});return b;};
 const saved=[];b.ctx={font:'16px sans-serif',save(){saved.push({font:this.font});},restore(){Object.assign(this,saved.pop()||{});},measureText(value){const size=Number(this.font.match(/([\d.]+)px/)?.[1]||16);return{width:runtime.G.textW(value,size)};}};
 b.text=(p,value,o={})=>{const at=b.toS(p),box=proto.annotationSize.call(b,value,{...o,weight:800}),x=at.x+(o.dx||0),y=at.y+(o.dy||0);b.texts.push({text:String(value),p,x,y,box:{l:x-box.width/2,r:x+box.width/2,t:y-box.height/2,b:y+box.height/2},options:o});return b;};
 b.leader=(a,z,o={})=>{const result=proto.leader.call(b,a,z,o);b.leaders.push({a,z,options:o,result});return result;};
 const sc=runtime.scene(id);sc.draw(b,s,{}, {tab,s,scene:sc});return b;
}
const picture=b=>plain({paths:b.paths,arcs:b.arcs,texts:b.texts,marks:b.marks,leaders:b.leaders});
const overlap=(a,b)=>Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))*Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t));
const label=(b,str)=>{const q=b.trLabels.find(q=>q.text===str);assert.ok(q,`visible ${str}`);return q;};
function atLabel(b,str,p,color){
 const t=b.texts.find(t=>t.text===str&&distance(t.p,p)<1e-7&&(!color||t.options.color===color));assert.ok(t,`visible ${str} at its actual segment/point`);
 const q=b.trLabels.find(q=>q.text===str&&Math.abs((q.l+q.r)/2-t.x)<1e-7&&Math.abs((q.t+q.b)/2-t.y)<1e-7);assert.ok(q,'actual placed bounds');return q;
}
function readable(b,M){
 const summaries=b.trLabels.filter(q=>q.text.includes('AF=')&&q.text.includes('BD='));
 assert.equal(summaries.length,1,'the complete tangent-length relationship is visible once');
 const summary=summaries[0];
 const mid=(p,q)=>({x:(p.x+q.x)/2,y:(p.y+q.y)/2});
 const protectedLabels=[atLabel(b,'D',M.g.D),atLabel(b,String(M.y),mid(M.g.B,M.g.D),'sky'),atLabel(b,`${M.a} cm`,mid(M.g.B,M.g.C),'ink')];
 for(const q of protectedLabels){
  assert.equal(overlap(summary,q),0,`caption must not hide ${q.text}`);
  assert.ok(summary.t>=q.b+3,`caption stays below ${q.text}, with a clear gap ${JSON.stringify({W:b.W,sides:[M.a,M.b,M.c],summary,q})}`);
 }
 assert.ok(summary.l>=6&&summary.r<=b.W-6&&summary.b<=b.H-b.insets.bottom-6,'complete caption stays above the toolbar');
 for(const str of [`${M.c} cm`,`${M.a} cm`,`${M.b} cm`])label(b,str);
 const source=b.paths.find(p=>p.options.close&&p.options.color==='ink'&&p.options.width===3.6);
 assert.ok(source,'the original triangle remains drawn');
 const circle=b.marks.find(q=>q.method==='circle');assert.ok(circle&&circle.r>0,'the original incircle remains drawn');
 const dy=label(b,'D'), at=b.toS(M.g.D);assert.ok(Math.abs((dy.l+dy.r)/2-at.x)<20,'D identifies the actual base tangency');
 return summary;
}
test('360px initial exploration keeps the actual BD length, D and summary distinct',()=>{
 const s=rt.state('t6-8'),M=rt.scene('t6-8').tr.model(s),b=draw(rt,'t6-8',s,views[4]);
 const summary=readable(b,M);assert.ok(summary.text.includes(`AF=${M.x}`)&&summary.text.includes(`BD=${M.y}`)&&summary.text.includes(`CE=${M.z}`));
 close(b.k,26.522747637117504,'observed native scale remains unchanged');
});
test('selected side-range corners and slider values preserve tangent geometry, caption clearance and reentry',t=>{
 const cases=new Map();
 for(const c of [4,8,12])for(const bb of [4,8,12])for(const a of [3,8,14,20])cases.set(`${c}/${bb}/${a}`,[c,bb,a]);
 for(let c=4;c<=12;c++)cases.set(`${c}/7/8`,[c,7,8]);
 for(let bb=4;bb<=12;bb++)cases.set(`9/${bb}/8`,[9,bb,8]);
 for(let a=3;a<=20;a++)cases.set(`9/7/${a}`,[9,7,a]);
 let count=0;
 for(const [c,bb,a]of cases.values())for(const view of views.slice(-2)){
  const s=rt.state('t6-8',{trNp:c,trNq:bb,trNs:a}),sc=rt.scene('t6-8'),M=sc.tr.model(s),b=draw(rt,sc.id,s,view);
  readable(b,M);const v=sc.tr.verify(s);close(v.ans,v.model,'AF actual tangent distance');for(const[x,y]of v.extra)close(x,y,'side/tangent lengths retain the exact model');
  close(M.x+M.y,M.c,'AF+BF=AB');close(M.y+M.z,M.a,'BD+DC=BC');close(M.x+M.z,M.b,'AE+CE=AC');
  sc.enter(s);const again=draw(rt,sc.id,s,view);assert.deepEqual(picture(again),picture(draw(rt,sc.id,rt.state(sc.id),view)),'reentry restores initial picture');count++;
 }
 t.diagnostic(`${count} allowed native-size side/corner states`);
});
if(arg('--compare-scope'))test('only an overlong narrow exploration caption changes; geometry and question/reveal stages are exact',t=>{
 const old=load(arg('--compare-scope'));let scope=0;
 for(const sc of rt.scenes){const prev=old.scene(sc.id),s=rt.state(sc.id),z=plain(s);
  assert.deepEqual(plain(sc.tr.model(s)),plain(prev.tr.model(z)));assert.equal(sc.problem.text(s),prev.problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const view of views)for(const tab of ['explore','problem','review']){
   const a=draw(rt,sc.id,s,view,tab),b=draw(old,sc.id,z,view,tab);
   assert.deepEqual(plain(sc.view(s,{tab,s,scene:sc})),plain(prev.view(z,{tab,s:z,scene:prev})),`${sc.id}: DOM math/conditions unchanged`);
   if(sc.id==='t6-8'&&tab==='explore'&&view[0]===360){
    assert.deepEqual(plain(a.paths),plain(b.paths),'triangle and colored tangent segments retain exact screen geometry');assert.deepEqual(plain(a.marks),plain(b.marks),'incircle, points and equal-length ticks are unchanged');
    assert.deepEqual(plain(a.texts.filter(q=>!q.text.includes('='))),plain(b.texts.filter(q=>!q.text.includes('='))),'every original point/given/tangent label retains exact coordinates');
   }else assert.deepEqual(picture(a),picture(b),`${sc.id}/${view[0]}/${tab}: unrelated frame changed`);
   scope++;
  }
 }
 const sc=rt.scene('t6-8'),prev=old.scene('t6-8');
 for(const v of [0,1,2])for(const values of [[9,7,8],[4,4,3],[12,4,20],[12,12,20]])for(const view of views){
  const s=rt.state(sc.id,{trV:v,trNp:values[0],trNq:values[1],trNs:values[2]}),z=plain(s),steps=sc.steps(s).length;
  assert.equal(sc.problem.text(s),prev.problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const [tab,step]of [['problem',1],['review',1],['review',steps]]){
   s.step=z.step=step;assert.deepEqual(picture(draw(rt,sc.id,s,view,tab)),picture(draw(old,sc.id,z,view,tab)),'current question and reveal stage unchanged');scope++;
  }
 }
 for(const view of [[200,150,0,0],[360,280,0,0]])assert.deepEqual(picture(draw(rt,sc.id,rt.state(sc.id),view,'explore',true)),picture(draw(old,sc.id,old.state(sc.id),view,'explore',true)),'thumbnail unchanged');
 t.diagnostic(`${scope} scope pictures;43 models/questions/steps;2 thumbnails`);
});
