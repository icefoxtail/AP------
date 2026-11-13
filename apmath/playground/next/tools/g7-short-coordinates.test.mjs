import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url), api=require('../kit/apl-g7-short-coordinates.js');
const ctx={window:{},console};vm.createContext(ctx);for(const f of ['core','g7'])vm.runInContext(fs.readFileSync(new URL(`../labs/middle-functions/${f}.js`,import.meta.url),'utf8'),ctx);
const M=ctx.window.APL_MF,def=M.labs['g7-coordinate-graphs'];
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const area=pts=>Math.abs(pts.reduce((n,p,i)=>{const q=pts[(i+1)%pts.length];return n+p.x*q.y-p.y*q.x},0))/2;
const signq=q=>!q.x||!q.y?0:q.y>0?(q.x>0?1:2):(q.x>0?4:3);
const sample=spec=>{
 const v=M.defaults(spec),out=[v,...(spec.presets||[]).map(p=>({...v,...p.values}))];
 for(const [key,p]of Object.entries(spec.vars||{}))for(const n of [p.min,p.max,p.min+Math.floor((p.max-p.min)/(2*p.step))*p.step])out.push({...v,[key]:n});
 return out;
};
function check(spec,v,m){
 switch(spec.id){
 case'coord-order':case'read-coordinates':case'quadrants-boundary':case'axis-distance':
  near(m.P.x,v.x);near(m.P.y,v.y);if('dx'in m){near(m.dx,Math.hypot(v.x,0));near(m.dy,Math.hypot(0,v.y));}if(m.q)assert.ok(m.q===(!signq(m.P)?'어느 사분면에도 속하지 않음':`제${signq(m.P)}사분면`));break;
 case'point-move':near(m.B.x-m.A.x,v.dx);near(m.B.y-m.A.y,v.dy);break;
 case'axis-pair':near(m.A.y,0);near(m.B.x,0);near(3*v.a,4*v.a-v.a);near(2*v.b+2,-2*v.b+4*v.b+2);break;
 case'graph-story':assert.deepEqual(Array.from(m.points.slice(1,3),q=>q.y),[8,8]);break;
 case'water-vessels':{
  // A(height) is the horizontal area, not the width of the cross-section.
  let integral=0;const n=4000;for(let i=0;i<n;i++){const h=m.h*(i+.5)/n;integral+=(v.mode===0?1:v.mode===1?(h<=2?2:.5):1+h/4)*m.h/n;}
  assert.ok(Math.abs(integral-m.time)<.002);near(m.height(m.total),4);break;}
 case'read-time':{
  const a=[0,3,9,15,21,24],y=[12,10,14,22,16,18];let i=Math.min(4,a.findIndex((x,k)=>k<5&&v.time>=x&&v.time<=a[k+1]));if(i<0)i=4;
  near(m.P.y,y[i]+(v.time-a[i])*(y[i+1]-y[i])/(a[i+1]-a[i]));break;}
 case'baseline-change':near(m.actual,9+[0,-.5,-1,-1,0,1,1.5][v.week]);break;
 case'quantity-table':near(m.P.y,v.count+1);assert.equal(m.points.length,6);break;
 case'sign-reasoning':assert.equal(signq(m.B),2);if(v.mode){assert.ok(m.a+m.b<0&&m.a*m.b>0)}else assert.ok(m.a>0&&m.b<0);break;
 case'coordinate-area':near(area(v.mode?[m.A,m.B,m.C,m.D]:[m.A,m.B,m.Q]),m.area);break;
 case'repeated-graph':near(m.height(v.period/2),30);for(let i=1;i<m.topTimes.length;i++)near(m.topTimes[i]-m.topTimes[i-1],v.period);break;
 case'journey-compare':if(v.mode){near(6000/400,15);near(6000/80,75);near(m.fast(15),6);near(m.slow(75),6)}else{near(m.fast(20),m.slow(20));near(m.fast(60),m.slow(60))}break;
 default:assert.fail('Missing independent mathematical check '+spec.id);
 }
}
for(const spec of def.scenes)test(`coordinate short ${spec.id}: all explicit variants and parameter boundaries`,()=>{
 assert.ok(api.recipes[spec.id]);const motion=api.recipes[spec.id].motion;assert.ok(motion.length>15);
 for(const v of sample(spec)){
  const state=Object.fromEntries(Object.entries(v).map(([k,x])=>[M.prefix(spec,k),x]));const before=JSON.stringify(state),lab={M,scene:{_mf:spec}},plans=api.build(lab,state);
  assert.equal(plans.length,1);const plan=plans[0];assert.ok(plan.duration<=9&&plan.duration>=6);check(spec,v,plan.model.m);
  assert.equal(plan.frame(plan.duration,plan.model).formula,spec.answer(v,plan.model.m));assert.equal(JSON.stringify(state),before);
  // Reject non-finite constructions at every significant temporal boundary.
  const coordinates=[];const board={W:390,H:600,kind:'cartesian',aspect:'1:1',setPanes(){},setInsets(){},setFocus(f){this.focus=f},grid(){},axes(){},path(pts){coordinates.push(...pts)},poly(pts){coordinates.push(...pts)},seg(a,b){coordinates.push(a,b)},point(q){coordinates.push(q)},text(q){coordinates.push(q)},vline(x){assert.ok(Number.isFinite(x))},plot(fn,o){for(let i=0;i<=30;i++){const x=(o.from??0)+((o.to??10)-(o.from??0))*i/30;assert.ok(Number.isFinite(fn(x)))}}};
  for(const t of [0,.8,2.6,4.3,5.8,6.8,plan.duration])plan.draw(board,t,plan.model);
  assert.ok(coordinates.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)));assert.equal(JSON.stringify(state),before);
 }
});
test('all fifteen scenes have explicit distinct motion contracts, no legacy timeline fallback',()=>{assert.equal(def.scenes.length,15);assert.equal(Object.keys(api.registry).length,15);assert.equal(new Set(Object.values(api.recipes).map(r=>r.motion)).size,15)});

// Exercise the production grid/axis renderer, so a visible 2.5-unit regression
// cannot pass merely because a scene carries an unused configuration object.
const boardContext=vm.createContext({window:{APLab:{clamp:(v,lo,hi)=>Math.max(lo,Math.min(hi,v))}}});
vm.runInContext(fs.readFileSync(new URL('../kit/apl-board.js',import.meta.url),'utf8'),boardContext);
const nativeScenes=M.compile('g7-coordinate-graphs').groups.flatMap(g=>g.scenes);
function coordinateBoard(width=390,height=510){
 const b=Object.create(boardContext.window.APLab.Board.prototype),labels=[],gridLines=[];
 let from=null,inGrid=false;
 const c=new Proxy({font:'11.5px sans-serif',textAlign:'center',textBaseline:'top',
  measureText:t=>({width:String(t).length*6.5}),getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),
  fillText(text,x,y){labels.push({text:String(text),x,y,align:this.textAlign,baseline:this.textBaseline})},
  moveTo(x,y){from={x,y}},lineTo(x,y){if(inGrid&&from)gridLines.push({from,to:{x,y}})}
 },{get:(target,key)=>key in target?target[key]:(()=>{})});
 Object.assign(b,{W:width,H:height,ctx:c,canvas:{width,height,getBoundingClientRect:()=>({left:0,top:0,width,height})},
  kind:'cartesian',aspect:'1:1',focus:{x:[-6,6],y:[-6,6]},pad:.09,zoom:1,panX:0,panY:0,
  insets:{top:74,right:36,bottom:100,left:40},panes:null,paneId:null,fs:1,lw:1,font:'sans-serif',
  colors:{grid:'grid',gridMajor:'major',axis:'axis',tick:'tick'}});
 const grid=b.grid;b.grid=function(options){inGrid=true;try{return grid.call(this,options)}finally{inGrid=false}};
 for(const name of ['seg','point','handle','text','path','vline','plot'])b[name]=()=>b;
 return{b,labels,gridLines};
}
function drawCoordinates(id,mode,width=390,height=510,values={}){
 const spec=def.scenes.find(s=>s.id===id),v={...M.defaults(spec),...values};
 const state=Object.fromEntries(Object.entries(v).map(([k,x])=>[M.prefix(spec,k),x]));
 const result=coordinateBoard(width,height);result.b.aspect=spec.aspect||'1:1';
 if(mode==='native')nativeScenes.find(s=>s.id===id).draw(result.b,state,{},null);
 else {const p=api.build({M,scene:{_mf:spec}},state)[0];p.draw(result.b,id==='quantity-table'?6.8:0,p.model)}
 return{...result,state,spec,v};
}
const axisValues=(labels,align)=>labels.filter(l=>l.align===align&&/^−?\d+(?:\.\d+)?$/.test(l.text)).map(l=>Number(l.text.replace('−','-')));
test('integer-coordinate lessons render consecutive unit ticks and matching unit grid in native and short views',()=>{
 for(const id of ['coord-order','read-coordinates','quadrants-boundary','point-move','axis-pair','axis-distance','coordinate-area','quantity-table']){
  for(const mode of ['native','short']){
   const {b,labels,gridLines}=drawCoordinates(id,mode);
   for(const align of ['center','right']){
    const ticks=axisValues(labels,align).sort((a,z)=>a-z);
    assert.ok(ticks.length>=5,`${id}/${mode}: readable coordinate ticks`);
    assert.ok(ticks.every(Number.isInteger),`${id}/${mode}: no fractional coordinate ticks`);
    for(let i=1;i<ticks.length;i++)assert.equal(ticks[i]-ticks[i-1],ticks[i-1]===-1&&ticks[i]===1?2:1,`${id}/${mode}: consecutive unit labels`);
   }
   for(const x of [0,1,2,3]){
    const pixel=Math.round(b.toS(x,0).x)+.5;
    assert.ok(gridLines.some(l=>l.from.x===pixel&&l.to.x===pixel),`${id}/${mode}: grid at x=${x}`);
   }
  }
 }
});
test('the initial P(3,2) and P(4,3) can be read without zoom on narrow boards',()=>{
 for(const [id,x,y] of [['coord-order',3,2],['read-coordinates',4,3]])for(const mode of ['native','short'])for(const width of [320,390]){
  const {b,labels,spec,v}=drawCoordinates(id,mode,width,450),q=spec.model(v).P,pixel=b.toS(q);
  near(q.x,x);near(q.y,y);
  assert.ok(axisValues(labels,'center').includes(x)&&axisValues(labels,'right').includes(y),`${id}/${mode}/${width}: actual point coordinates labelled`);
  assert.ok(pixel.x>10&&pixel.x<width-10&&pixel.y>10&&pixel.y<b.H-10,`${id}/${mode}/${width}: point inside the initial board`);
 }
});
test('coordinate exploration retains zoom and pan, while physical graphs retain their own axis scales',()=>{
 const {b,state}=drawCoordinates('read-coordinates','native'),before=JSON.stringify(state);
 b.zoom=1.7;b.panX=17;b.panY=-11;
 nativeScenes.find(s=>s.id==='read-coordinates').draw(b,state,{},null);
 assert.deepEqual([b.zoom,b.panX,b.panY],[1.7,17,-11]);assert.equal(JSON.stringify(state),before);
 for(const mode of ['native','short']){
  const temperature=drawCoordinates('read-time',mode),change=drawCoordinates('baseline-change',mode,390,880);
  assert.ok(axisValues(temperature.labels,'center').some(x=>x>1)&&!axisValues(temperature.labels,'center').includes(1),'time axis keeps its wider interval');
  assert.ok(axisValues(change.labels,'right').some(x=>!Number.isInteger(x)),'weight changes keep fractional axis labels');
 }
});
