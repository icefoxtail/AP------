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
function coordinateBoard(width=390,height=510,{viewportWidth=width,insets={}}={}){
 const b=Object.create(boardContext.window.APLab.Board.prototype),labels=[],gridLines=[];
 let from=null,inGrid=false;
 // Native shell margins depend on the viewport, not the narrower canvas.
 // Without chips: wide tools are 42px tall, narrow tools 46px, plus 14px.
 // Glyph widths below are a deterministic proxy; CI measures real font glyphs.
 const nativeInsets={top:0,right:viewportWidth>=860?16:0,bottom:viewportWidth>=860?56:60,left:0,...insets};
 const c=new Proxy({font:'11.5px sans-serif',textAlign:'center',textBaseline:'top',
  measureText:t=>({width:String(t).length*6.5}),getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),
  fillText(text,x,y){labels.push({text:String(text),x,y,align:this.textAlign,baseline:this.textBaseline,width:this.measureText(text).width,fontSize:+(this.font.match(/([\d.]+)px/)?.[1]||11.5)})},
  moveTo(x,y){from={x,y}},lineTo(x,y){if(inGrid&&from)gridLines.push({from,to:{x,y}})}
 },{get:(target,key)=>key in target?target[key]:(()=>{})});
 Object.assign(b,{W:width,H:height,ctx:c,canvas:{width,height,getBoundingClientRect:()=>({left:0,top:0,width,height})},
  kind:'cartesian',aspect:'1:1',focus:{x:[-6,6],y:[-6,6]},pad:.09,zoom:1,panX:0,panY:0,
  insets:nativeInsets,panes:null,paneId:null,fs:1,lw:1,font:'sans-serif',
  colors:{grid:'grid',gridMajor:'major',axis:'axis',tick:'tick'}});
 const grid=b.grid;b.grid=function(options){inGrid=true;try{return grid.call(this,options)}finally{inGrid=false}};
 for(const name of ['seg','point','handle','text','path','vline','plot'])b[name]=()=>b;
 return{b,labels,gridLines};
}
function drawCoordinates(id,mode,width=390,height=510,values={},options={}){
 const spec=def.scenes.find(s=>s.id===id),v={...M.defaults(spec),...values};
 const state=Object.fromEntries(Object.entries(v).map(([k,x])=>[M.prefix(spec,k),x]));
 const result=coordinateBoard(width,height,options);result.b.aspect=spec.aspect||'1:1';
 if(mode==='native')nativeScenes.find(s=>s.id===id).draw(result.b,state,{},null);
 // The papers-and-pins construction becomes a coordinate plot at 5.8 s.
 // Inspect its first coordinate frame; other proofs start on their axes at 0 s.
 else {const p=api.build({M,scene:{_mf:spec}},state)[0];p.draw(result.b,id==='quantity-table'?5.8:0,p.model)}
 return{...result,state,spec,v};
}
const axisValues=(labels,align)=>labels.filter(l=>l.align===align&&/^−?\d+(?:\.\d+)?$/.test(l.text)).map(l=>Number(l.text.replace('−','-')));
// Also cover the narrower native canvas at each desktop viewport. The last
// case stresses a 64px occupied chip area; it is not a claimed CI measurement.
const coordinateBoardSizes=[[390,363],[320,363],[320,300],[1024,399],[820,460],[1120,468],[683,399,1024],[1039,468,1440],[683,399,1024,64]];
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
test('integer-coordinate tick labels do not overlap on phone and short wide canvases',()=>{
 for(const id of ['coord-order','read-coordinates','quadrants-boundary','point-move','axis-pair','axis-distance','coordinate-area','quantity-table']){
  for(const mode of ['native','short'])for(const [width,height,viewportWidth,top=0]of coordinateBoardSizes){
   const {labels}=drawCoordinates(id,mode,width,height,{},{viewportWidth,insets:{top}});
   for(const align of ['center','right']){
    const ticks=labels.filter(l=>l.align===align&&/^−?\d+$/.test(l.text));
    const bounds=ticks.map(l=>align==='center'?{lo:l.x-l.width/2,hi:l.x+l.width/2,text:l.text}:{lo:l.y-l.fontSize*.6,hi:l.y+l.fontSize*.6,text:l.text}).sort((a,z)=>a.lo-z.lo);
    assert.ok(bounds.length>=5,`${id}/${mode}/${width}x${height}: enough labelled unit ticks`);
    for(let i=1;i<bounds.length;i++)assert.ok(bounds[i].lo>=bounds[i-1].hi-1e-7,`${id}/${mode}/${width}x${height}/${align}: ${bounds[i-1].text} overlaps ${bounds[i].text}`);
   }
  }
 }
});
test('axis-pair compact proof leaves room for the measured two-digit negative glyphs',()=>{
 // Real Chromium at 1024x768 measured a 24.637451px ink box for −21/−20.
 // The failed proof placed these ticks only 20.705px apart; the generic
 // 6.5px-per-character VM proxy above cannot catch that font-specific overlap.
 const negativeInkWidth=24.637451171875;
 for(const [width,height]of [[1024,399],[820,460],[1120,468]]){
  const {labels}=drawCoordinates('axis-pair','short',width,height);
  const ticks=labels.filter(l=>l.align==='center'&&/^−?\d+$/.test(l.text)).sort((a,z)=>a.x-z.x);
  assert.ok(ticks.length>1,'the actual axis tick positions are exercised');
  if(width===1024)assert.ok(ticks.filter(l=>/^−\d{2}$/.test(l.text)).length>1,'the failed viewport still exercises adjacent negative two-digit labels');
  for(let i=1;i<ticks.length;i++)assert.ok(ticks[i].x-ticks[i-1].x>=negativeInkWidth,`${width}x${height}: the drawn tick spacing clears the measured glyph ink`);
 }
 const spec=def.scenes.find(s=>s.id==='axis-pair');
 for(const values of sample(spec)){
  const {b,v}=drawCoordinates('axis-pair','short',1024,399,values),m=spec.model(v);
  for(const point of [{x:0,y:0},...(v.mode?[m.Q]:[m.A,m.B])])assert.ok(point.x>=b.focus.x[0]&&point.x<=b.focus.x[1]&&point.y>=b.focus.y[0]&&point.y<=b.focus.y[1],'compact proof retains the origin and active model points');
 }
 const {b,v}=drawCoordinates('axis-pair','short',1120,560);
 assert.equal(JSON.stringify(b.focus),JSON.stringify(spec.focus(v,spec.model(v))),'the large-canvas authored range stays unchanged');
});
test('coordinate fits keep positive and negative initial points visible and preserve the authored proof ranges',()=>{
 for(const id of ['coord-order','read-coordinates'])for(const [width,height,viewportWidth,top=0]of coordinateBoardSizes){
  for(const values of [{},{x:-3,y:2},{x:0,y:-4}]){
   for(const mode of ['native','short']){
    const {b,labels,spec,v}=drawCoordinates(id,mode,width,height,values,{viewportWidth,insets:{top}}),q=spec.model(v).P,pixel=b.toS(q);
    assert.equal(b.zoom,1);
    assert.ok(q.x===0||axisValues(labels,'center').includes(q.x));
    assert.ok(q.y===0||axisValues(labels,'right').includes(q.y));
    assert.ok(pixel.x>10&&pixel.x<width-10&&pixel.y>10&&pixel.y<height-10,`${id}/${mode}: the chosen point remains in the initial view`);
    if(mode==='native')assert.equal(JSON.stringify(b.focus),JSON.stringify({x:[-5,5],y:[-5,5]}));
   }
  }
 }
 for(const id of ['coord-order','read-coordinates','quadrants-boundary','axis-distance']){
  const {b}=drawCoordinates(id,'short',1120,560);
  assert.equal(JSON.stringify(b.focus),JSON.stringify({x:[-6,6],y:[-6,6]}),`${id}: large canvases keep the original focus`);
  assert.deepEqual(b.insets,{top:74,right:36,bottom:100,left:40},`${id}: large canvases keep the original margins`);
 }
 for(const id of ['graph-story','read-time','baseline-change'])for(const [width,height]of [[390,363],[1024,399],[1120,560]]){
  const {b,spec,v}=drawCoordinates(id,'short',width,height);
  const focus=typeof spec.focus==='function'?spec.focus(v,spec.model(v)):spec.focus;
  assert.equal(JSON.stringify(b.focus),JSON.stringify(focus),`${id}: retain its own physical axis range`);
  assert.deepEqual(b.insets,{top:74,right:36,bottom:100,left:40},`${id}: retain the existing graph layout`);
 }
});
test('native coordinate fits preserve model points, zoom and pan while physical graphs retain their own axis scales',()=>{
 for(const id of ['coord-order','read-coordinates','quadrants-boundary','axis-distance','axis-pair']){
  const spec=def.scenes.find(s=>s.id===id),scene=nativeScenes.find(s=>s.id===id);
  for(const values of sample(spec)){
   const {b,state,v}=drawCoordinates(id,'native',683,399,values,{viewportWidth:1024,insets:{top:64}}),model=spec.model(v),before=JSON.stringify(state);
   const points=[{x:0,y:0},...(id==='axis-pair'?(v.mode?[model.Q]:[model.A,model.B]):[model.P])];
   assert.equal(JSON.stringify(scene.focus(state)),JSON.stringify(b.focus),'entry and native drawing use the same fit');
   for(const point of points){
    assert.ok(point.x>=b.focus.x[0]&&point.x<=b.focus.x[1]&&point.y>=b.focus.y[0]&&point.y<=b.focus.y[1],`${id}: preserve the origin and every drawn model point`);
    const pixel=b.toS(point);assert.ok(pixel.x>0&&pixel.x<b.W&&pixel.y>0&&pixel.y<b.H);
   }
   b.zoom=1.7;b.panX=17;b.panY=-11;
   scene.draw(b,state,{},null);
   assert.deepEqual([b.zoom,b.panX,b.panY],[1.7,17,-11]);assert.equal(JSON.stringify(state),before);
  }
 }
 for(const mode of ['native','short']){
  const temperature=drawCoordinates('read-time',mode),change=drawCoordinates('baseline-change',mode,390,880);
  assert.ok(axisValues(temperature.labels,'center').some(x=>x>1)&&!axisValues(temperature.labels,'center').includes(1),'time axis keeps its wider interval');
  assert.ok(axisValues(change.labels,'right').some(x=>!Number.isInteger(x)),'weight changes keep fractional axis labels');
 }
});
