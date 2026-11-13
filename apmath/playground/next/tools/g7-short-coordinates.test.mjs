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
