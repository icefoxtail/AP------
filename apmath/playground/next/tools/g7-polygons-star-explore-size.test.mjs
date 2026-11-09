// Actual c459 initial/reentry: the narrow exploration star is only about70px wide.
// Geometry, tip annotations and real Board projection; new browser review remains separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const dir='apmath/playground/next/labs/g7-polygons';
const arg=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const plain=x=>JSON.parse(JSON.stringify(x));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const close=(a,b,why)=>assert.ok(Math.abs(a-b)<1e-7,`${why}: ${a}/${b}`);
function load(ref){
 let seed=173;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 const document={documentElement:{dataset:{}},getElementById(){},createElement(){return{};},head:{append(){}},addEventListener(){}};
 const ctx=vm.createContext({window:{},document,Math:math});
 for(const name of ['core','t1','t2','t3','t4']){
  const file=`${dir}/${name}.js`,source=ref&&name==='t2'?execFileSync('git',['show',`${ref}:${file}`],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,file),'utf8');
  vm.runInContext(source,ctx,{filename:file});
 }
 ctx.window.APLab={clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
 vm.runInContext(fs.readFileSync(path.join(root,'apmath/playground/next/kit/apl-board.js'),'utf8'),ctx);
 const groups=ctx.window.APL_PG_GROUPS,scenes=groups.flatMap(g=>g.scenes),params=Object.assign({},...groups.map(g=>g.params));
 return {ctx,G:ctx.window.APL_PG,scenes,scene:id=>scenes.find(s=>s.id===id),state(id,patch={}){const s=Object.fromEntries(Object.entries(params).map(([k,p])=>[k,p.value]));this.scene(id).enter(s);return Object.assign(s,{step:1,revealed:false,playing:false},patch);}};
}
const rt=load(arg('--baseline'));
const views=[[1039,663,56,16],[820,420,60,0],[683,493,56,16],[390,326,60,0],[360,307,60,0]];
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
const text=(b,value)=>{const t=b.texts.find(t=>t.text===value);assert.ok(t,`visible ${value}`);return t;};
const overlaps=(a,b,gap=0)=>a.l<b.r+gap&&a.r>b.l-gap&&a.t<b.b+gap&&a.b>b.t-gap;
const keys=['pgSa','pgSb','pgSc','pgSd'];
function sourceSize(b){const paths=b.paths.filter(p=>p.options.color==='ink'&&p.options.width===3.4);assert.equal(paths.length,5,'all five crossing star segments remain');const points=paths.flatMap(p=>p.points);return{width:Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x)),height:Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y))};}
function legible(b,M){
 const values=[M.a,M.b,M.c,M.d,M.e];
 for(const [i,name]of['A','B','C','D','E'].entries()){
  const t=text(b,`${name} ${values[i]}°`);close(distance(t.p,M.pts[name]),0,`${name} label attached to its actual tip`);
  const angle=b.arcs.find(a=>distance(a.at,b.toS(M.pts[name]))<1e-7&&a.options.color==='sky');assert.ok(angle,'all original tip angle arcs remain');close(angle.r,18,'compact exploration arc radius');
 }
 assert.ok(b.texts.some(t=>t.text==='A+B+C+D+E = 180°'),'visible sum relation retained');
 for(const t of b.texts){assert.ok(t.box.l>=2&&t.box.r<=b.W-2&&t.box.t>=2&&t.box.b<=b.H-b.insets.bottom-2,`clipped ${t.text}: ${JSON.stringify(t.box)}`);}
 for(let i=0;i<b.texts.length;i++)for(let j=i+1;j<b.texts.length;j++)assert.ok(!overlaps(b.texts[i].box,b.texts[j].box),`${b.texts[i].text} overlaps ${b.texts[j].text}`);
 for(const p of b.paths.flatMap(p=>p.points))assert.ok(p.x>=2&&p.x<=b.W-2&&p.y>=2&&p.y<=b.H-b.insets.bottom-2,'star outline remains inside usable stage');
}
for(const view of views.slice(-2))test(`${view[0]}px initial exploration has a clearly sized star and nearby tip conditions`,t=>{
 const s=rt.state('p2-star'),M=rt.scene('p2-star').pg.model(s),b=draw(rt,'p2-star',s,view),size=sourceSize(b);
 assert.ok(size.width>=125&&size.height>=120,`original star ${size.width}×${size.height}px`);legible(b,M);t.diagnostic(`initial star ${size.width.toFixed(2)}×${size.height.toFixed(2)}px`);
});
test('all slider values, asymmetrical corners and reentry retain readable tips and the180° invariant',t=>{
 const cases=[];
 for(const a of[30,35,40])for(const b of[30,35,40])for(const c of[30,35,40])for(const d of[30,35,40])cases.push([a,b,c,d]);
 for(let i=0;i<4;i++)for(let v=30;v<=40;v++){const q=[36,36,36,36];q[i]=v;cases.push(q);}
 let count=0,minWidth=1e9,minHeight=1e9;
 for(const q of cases)for(const view of views.slice(-2)){
  const s=rt.state('p2-star',Object.fromEntries(keys.map((k,i)=>[k,q[i]]))),sc=rt.scene('p2-star'),M=sc.pg.model(s),b=draw(rt,sc.id,s,view),size=sourceSize(b);
  assert.ok(Math.max(size.width,size.height)>=120,`the star's main span remains readable: ${size.width}×${size.height}`); const tips=['A','B','C','D','E'].map(n=>b.toS(M.pts[n]));for(let i=0;i<tips.length;i++)for(let j=i+1;j<tips.length;j++)assert.ok(distance(tips[i],tips[j])>=28,'all five point markers and labels have distinct tips');legible(b,M);close(M.a+M.b+M.c+M.d+M.e,180,'five actual tip angles sum to180');
  const oracle=sc.pg.verify(s);close(oracle.ans,oracle.model,'independent coordinate angle agrees');for(const[a,z]of oracle.extra)close(a,z,'all actual triangle/star angles preserved');
  const old=M;sc.enter(s);assert.deepEqual(keys.map(k=>s[k]),[36,36,36,36]);assert.equal(s.playing,false);assert.equal(s.revealed,false);
  const reset=draw(rt,sc.id,s,view);assert.deepEqual(picture(reset),picture(draw(rt,sc.id,rt.state(sc.id),view)),'reentry restores the same original star');
  minWidth=Math.min(minWidth,size.width);minHeight=Math.min(minHeight,size.height);count++;
 }
 t.diagnostic(`${count} native-size slider/corner states; minimum star ${minWidth.toFixed(2)}×${minHeight.toFixed(2)}px`);
});
if(arg('--compare-scope'))test('only narrow exploration framing changes; original models, formulas, questions and answer stages remain exact',t=>{
 const old=load(arg('--compare-scope'));let comparisons=0;
 for(const sc of rt.scenes){const prev=old.scene(sc.id),s=rt.state(sc.id),z=plain(s);
  assert.deepEqual(plain(sc.pg.model(s)),plain(prev.pg.model(z)));assert.equal(sc.problem.text(s),prev.problem.text(z));assert.deepEqual(plain(sc.steps(s)),plain(prev.steps(z)));
  for(const view of views)for(const tab of['explore','problem','review']){
   s.step=z.step=1;assert.deepEqual(plain(sc.view(s,{tab,scene:sc,s})),plain(prev.view(z,{tab,scene:prev,s:z})),`${sc.id}: all DOM values/formula unchanged`);
   const a=draw(rt,sc.id,s,view,tab),b=draw(old,sc.id,z,view,tab);
   if(sc.id==='p2-star'&&tab==='explore'&&view[0]<560){
    assert.deepEqual(plain(a.paths.map(p=>({world:p.world,options:p.options}))),plain(b.paths.map(p=>({world:p.world,options:p.options}))),'the exact five source segments remain');
    const beforeValues=b.texts.map(t=>t.text).filter(s=>s!=='36+36+36+36+36 = 180');assert.deepEqual(a.texts.map(t=>t.text),beforeValues,'only the duplicate canvas arithmetic row is removed');
   }else assert.deepEqual(picture(a),picture(b),`${sc.id}/${view[0]}/${tab}: unrelated frame changed`);comparisons++;
  }
 }
 for(const q of[[30,30,30,30],[40,40,40,40],[30,40,40,30],[36,36,36,36]])for(const view of views)for(let step=0;step<=3;step++){
  const s=rt.state('p2-star',Object.fromEntries(keys.map((k,i)=>[k,q[i]]))),z=plain(s),tab=step?'review':'problem';s.step=z.step=step;
  const a=draw(rt,'p2-star',s,view,tab),b=draw(old,'p2-star',z,view,tab);assert.deepEqual(picture(a),picture(b),'current problem/review disclosure preserved');
  if(view[0]<560){const m=rt.scene('p2-star').pg.model(s);assert.equal(a.texts.some(t=>t.text==='E x'),step<3);assert.equal(a.texts.some(t=>t.text===`E ${m.e}°`),step===3);}comparisons++;
 }
 for(const view of[[200,150,0,0],[360,280,0,0]])assert.deepEqual(picture(draw(rt,'p2-star',rt.state('p2-star'),view,'explore',true)),picture(draw(old,'p2-star',old.state('p2-star'),view,'explore',true)),'thumbnail unchanged');
 t.diagnostic(`${comparisons} picture/view comparisons plus${rt.scenes.length} models/questions/steps and2 thumbnails`);
});
