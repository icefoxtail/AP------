// Actual c459 phone screenshots: A's15° label lies on E's150° arc.
// Geometry and real Board leader contracts; new browser review remains separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const dir='apmath/playground/next/labs/g8-quadrilaterals';
const arg=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const plain=x=>JSON.parse(JSON.stringify(x));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const close=(a,b,why)=>assert.ok(Math.abs(a-b)<1e-7,`${why}: ${a}/${b}`);
function load(ref){
 let seed=173;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 const document={documentElement:{dataset:{}},getElementById(){},createElement(){return{};},head:{append(){}},addEventListener(){}};
 const ctx=vm.createContext({window:{},document,Math:math});
 for(const name of ['core','t1','t2','t3','t4','t5','t6','solutions']){
  const file=`${dir}/${name}.js`,source=ref&&name==='t6'?execFileSync('git',['show',`${ref}:${file}`],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,file),'utf8');
  vm.runInContext(source,ctx,{filename:file});
 }
 ctx.window.APLab={clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
 vm.runInContext(fs.readFileSync(path.join(root,'apmath/playground/next/kit/apl-board.js'),'utf8'),ctx);
 const groups=ctx.window.APL_QD_GROUPS,scenes=groups.flatMap(g=>g.scenes),params=Object.assign({},...groups.map(g=>g.params));
 return {ctx,G:ctx.window.APL_QD,scenes,scene:id=>scenes.find(s=>s.id===id),state(id,patch={}){const s=Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value]));this.scene(id).enter(s);return Object.assign(s,{step:1},patch);}};
}
const rt=load(arg('--baseline'));
const views=[[1039,718,56,16],[820,461,60,0],[683,548,56,16],[390,411,60,0],[360,387,60,0]];
function draw(runtime,id,s,view,tab='explore',thumb=false){
 const [W,H,bottom,right]=view,proto=runtime.ctx.window.APLab.Board.prototype,b=Object.create(proto);
 Object.assign(b,{W,H,pad:.02,kind:'figure',aspect:'1:1',insets:{left:0,right,top:0,bottom},zoom:1,panX:0,panY:0,fs:1,thumb,panes:null,paneId:null,focus:{x:[-6,6],y:[-6,6]},paths:[],arcs:[],texts:[],marks:[],leaders:[]});
 b.path=(ps,o={})=>{b.paths.push({points:ps.map(p=>b.toS(p)),options:o});return b;};
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
const text=(b,value)=>{const t=b.texts.find(t=>t.text===value);assert.ok(t,`visible ${value}`);return t;};
const overlaps=(a,b,gap=0)=>a.l<b.r+gap&&a.r>b.l-gap&&a.t<b.b+gap&&a.b>b.t-gap;
function ownsA(b,M){
 const t=text(b,'15°'),A=b.toS(M.A),E=b.toS(M.E),eGap=Math.hypot(Math.max(0,t.box.l-E.x,E.x-t.box.r),Math.max(0,t.box.t-E.y,E.y-t.box.b));
 assert.ok(eGap>=32,`15° must clear E's26px arc by6px: gap${eGap}`);
 assert.ok(distance(t,A)<distance(t,E),'the15° callout stays closer to its actual vertexA');
 const a0=Math.atan2(M.E.y-M.A.y,M.E.x-M.A.x),a1=0,mid=(a0+a1)/2,expected={x:A.x+30*Math.cos(mid),y:A.y+30*Math.sin(mid)};
 const l=b.leaders.find(l=>l.result?.label&&distance(l.result.label,t)<1e-7);assert.ok(l?.result.drawn,'a relocated15° has a painted actual Board leader');
 close(distance(l.result.anchor,expected),0,'leader starts at the midpoint of the actual A angle arc');
 close(distance(l.result.anchor,A),30,'A arc radius unchanged');
 close(distance(l.result.label,t),0,'returned leader label equals actual label center');
 assert.ok(l.options.width>0&&l.options.height>0&&l.options.lineWidth===1.2,'actual leader box and line width are supplied');
 assert.ok(b.paths.some(p=>p.options.width===1.2&&distance(p.points[0],l.result.anchor)<1e-7&&distance(p.points[1],l.result.end)<1e-7),'actual painted path equals returned anchor/end');
 assert.ok(b.arcs.some(a=>distance(a.at,A)<1e-7&&Math.abs(a.r-30)<1e-7&&a.options.color==='amber'),'the original A angle arc remains');
 assert.ok(b.arcs.some(a=>distance(a.at,E)<1e-7&&Math.abs(a.r-26)<1e-7&&a.options.color==='amber'),'E150° arc remains unchanged');
 for(const q of[l.result.anchor,l.result.label,l.result.end])assert.ok(q.x>=0&&q.x<=b.W&&q.y>=0&&q.y<=b.H-b.insets.bottom,'leader is inside usable stage');
 assert.ok(t.box.l>=3&&t.box.r<=b.W-3&&t.box.t>=3&&t.box.b<=b.H-b.insets.bottom-3,'15° is not clipped');
 for(const other of b.texts.filter(v=>v!==t&&!v.text.includes('∠')))assert.ok(!overlaps(t.box,other.box,4),`15° separated from ${other.text}`);
}
for(const view of views.slice(-2))test(`${view[0]}px initial15° belongs clearly to A, with a real arc-to-label connector`,()=>{
 const s=rt.state('q6-4'),M=rt.scene('q6-4').qd.model(s);ownsA(draw(rt,'q6-4',s,view),M);
});
test('all valid square sizes and question variants retain A-angle ownership and mathematical conditions',t=>{
 let count=0;for(let S=3;S<=6;S++)for(let K=0;K<=3;K++)for(const view of views.slice(-2)){
  const s=rt.state('q6-4',{qfS:S,qfK:K}),sc=rt.scene('q6-4'),M=sc.qd.model(s),b=draw(rt,sc.id,s,view);ownsA(b,M);
  close(distance(M.A,M.B),distance(M.B,M.C),'square equal sides');close(distance(M.B,M.C),distance(M.B,M.E),'equilateral equality');
  assert.ok(Math.abs(rt.G.angBetween(M.A,M.E,M.D)-15)<1e-6,'A angle is15° within the existing rounded equilateral coordinate precision');
  const initial=picture(b);s.qfS=S===6?3:6;sc.enter(s);const reset=rt.scene('q6-4').qd.model(s);assert.equal(reset.S,4);assert.equal(s.playing,false);if(S===4&&K===0)assert.deepEqual(picture(draw(rt,sc.id,s,view)),initial,'reentry restores original picture');count++;
 }
 t.diagnostic(`${count} native-size variants preserve conditions, angle mark and reset`);
});
if(arg('--compare-scope'))test('all32 scenes, current problem/review steps, wide frames and thumbnails retain their prior behavior',t=>{
 const old=load(arg('--compare-scope'));let comparisons=0;
 for(const sc of rt.scenes){const prev=old.scene(sc.id),s=rt.state(sc.id),question=sc.problem.text(s),z=plain(s);
  assert.deepEqual(plain(sc.qd.model(s)),plain(prev.qd.model(z)));assert.equal(question,prev.problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const view of views)for(const tab of['explore','problem','review']){
   s.step=z.step=1;const a=draw(rt,sc.id,s,view,tab),b=draw(old,sc.id,z,view,tab);
   if(sc.id==='q6-4'&&tab==='explore'&&view[0]<560){assert.deepEqual(plain(a.arcs),plain(b.arcs));assert.deepEqual(plain(a.marks),plain(b.marks));assert.deepEqual(plain(a.paths.filter(x=>x.options.width!==1.2)),plain(b.paths));assert.deepEqual(plain(a.texts.filter(x=>x.text!=='15°')),plain(b.texts.filter(x=>x.text!=='15°')));}
   else assert.deepEqual(picture(a),picture(b),`${sc.id}/${view[0]}/${tab}`);comparisons++;
  }
 }
 for(let S=3;S<=6;S++)for(let K=0;K<=3;K++){
  const s=rt.state('q6-4',{qfS:S,qfK:K}),z=plain(s),sc=rt.scene('q6-4');
  assert.equal(sc.problem.text(s),old.scene('q6-4').problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(old.scene('q6-4').steps(z)));
  for(const view of views)for(let step=0;step<=sc.steps(s).length;step++){
   s.step=z.step=Math.max(1,step);const tab=step?'review':'problem',a=draw(rt,'q6-4',s,view,tab),b=draw(old,'q6-4',z,view,tab);
   assert.deepEqual(picture(a),picture(b),`current question${K}/${S}/${view[0]}/${tab}${step}: answer disclosure unchanged`);comparisons++;
  }
 }
 for(const view of[[200,150,0,0],[360,280,0,0]])assert.deepEqual(picture(draw(rt,'q6-4',rt.state('q6-4'),view,'explore',true)),picture(draw(old,'q6-4',old.state('q6-4'),view,'explore',true)),'thumbnail unchanged');
 t.diagnostic(`${comparisons} picture comparisons plus32 models/questions/steps and2 thumbnails`);
});
