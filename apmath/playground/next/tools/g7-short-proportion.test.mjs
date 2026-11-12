import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import{createRequire}from'node:module';
const require=createRequire(import.meta.url),api=require('../kit/apl-g7-short-proportion.js'),ctx={window:{},console};vm.createContext(ctx);for(const f of ['core','g7'])vm.runInContext(fs.readFileSync(new URL(`../labs/middle-functions/${f}.js`,import.meta.url),'utf8'),ctx);
const M=ctx.window.APL_MF,def=M.labs['g7-proportion'],near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`),area=ps=>Math.abs(ps.reduce((s,p,i)=>{const q=ps[(i+1)%ps.length];return s+p.x*q.y-p.y*q.x},0))/2;
const samples=spec=>{const v=M.defaults(spec),out=[v,...(spec.presets||[]).map(p=>({...v,...p.values}))];for(const[k,p]of Object.entries(spec.vars||{}))for(const x of [p.min,p.max,p.min+Math.floor((p.max-p.min)/(2*p.step))*p.step])out.push({...v,[k]:x});return out;};
function check(id,v,m){switch(id){
case'direct-change':near(m.P.y,v.sign*v.magnitude*v.x);near(m.U.y,m.a);break;
case'inverse-change':near(m.P.x*m.P.y,v.sign*v.magnitude);assert.notEqual(m.P.x,0);break;
case'relation-sort':for(const x of [1,2,3,5])near(m.f(x),v.mode===0?2*x:v.mode===1?12/x:x+3);break;
case'inverse-area':near(m.P.x*m.P.y,v.k);break;
case'direct-table':near(m.Q.y*v.givenX,v.targetX*v.givenY);break;
case'direct-points':near(m.Q.y*m.A.x,m.Q.x*m.A.y);near(m.C.y-m.Q.y,v.offset);break;
case'inverse-points':near(m.Q.x*m.Q.y,m.A.x*m.A.y);near(m.C.y-m.Q.y,v.offset);break;
case'graph-signs':near(m.k,v.sign*v.mag);break;
case'shared-point':near(m.product,m.A.y**2);near(m.k,m.A.x*m.A.y);near(m.a*m.A.x,m.A.y);break;
case'direct-triangle':near(area([{x:0,y:0},m.A,m.B]),m.area);break;
case'work-product':near(m.P.x*m.P.y,10*12);break;
case'gear-product':near(m.P.y*v.teeth,18*6);break;
case'physical-inverse':near(m.Q.y,m.k/v.x);near(m.k,v.mode===1?300:24);break;
case'integer-points':{const independent=[];for(let x=-v.k;x<=v.k;x++)for(let y=-v.k;y<=v.k;y++)if(x*y===v.k&&(!v.negativeOnly||(x<0&&y<0)))independent.push(`${x},${y}`);assert.deepEqual(Array.from(m.points,p=>`${p.x},${p.y}`).sort(),independent.sort());break;}
case'lattice-below':{let n=0;for(let x=1;x<13;x++)for(let y=1;y<13;y++)if(x*y<v.target)n++;assert.equal(m.pts.length,n);const matches=[];for(let k=2;k<=12;k++)if(api.clippedIntegerPoints(k).points.length===n)matches.push(k);assert.deepEqual(matches,[v.target]);break;}
case'remaining-work':near(m.left,24*(20-v.elapsed));near(m.required*v.remainingTime,m.left);near(m.extra,m.left/v.remainingTime-24);assert.ok(def.scenes.find(s=>s.id===id).answer(v,m).includes(String(Math.max(0,Math.ceil(m.left/v.remainingTime-1e-9)-24))));break;
case'between-graphs-area':near(m.k,v.area+v.x*v.x/3);near(area([m.A,m.B,m.C,m.D]),v.area);break;
case'bisect-rectangle':near(area([m.rect[0],m.L,m.U,m.rect[3]]),m.area/2);near(area([m.L,m.rect[1],m.rect[2],m.U]),m.area/2);near(m.a*m.C.x,m.C.y);break;
case'square-graphs':near(m.product,m.A.y*m.B.y);near(area([m.A,m.B,m.C,m.D]),v.side*v.side);break;
case'area-ratio':near(area([{x:0,y:0},m.A,m.B])/area([{x:0,y:0},m.A,m.C]),2/5);near(m.C.y/m.C.x,m.c);break;
case'horizontal-division':near((m.K.x-m.A.x)/(m.B.x-m.K.x),v.ratio);assert.equal(m.H.y,0);near(m.H.x,m.K.x);break;
default:assert.fail('Missing independent check '+id);
}}
for(const spec of def.scenes)test(`proportion ${spec.id}: presets and parameter boundaries`,()=>{for(const v of samples(spec)){
const state=Object.fromEntries(Object.entries(v).map(([k,x])=>[M.prefix(spec,k),x])),before=JSON.stringify(state),[plan]=api.build({M,scene:{_mf:spec}},state);assert.ok(plan);check(spec.id,v,plan.model.m);assert.equal(plan.duration,9);assert.equal(plan.frame(9,plan.model).formula,spec.answer(v,plan.model.m));
const coords=[],b={W:390,H:600,k:50,setPanes(){},setInsets(){},setFocus(f){this.focus=f},grid(){},axes(){},seg(a,z){coords.push(a,z)},path(ps){coords.push(...ps)},poly(ps){coords.push(...ps)},point(q){coords.push(q)},text(q){coords.push(q)},line(p,a){assert.ok(Number.isFinite(a));coords.push(p)},vline(x){assert.ok(Number.isFinite(x))},hline(y){assert.ok(Number.isFinite(y))},plot(fn,o){const a=o.from??-10,z=o.to??10;if(z<a)return;for(let i=0;i<=30;i++){const x=a+(z-a)*i/30;if(x!==0)assert.ok(Number.isFinite(fn(x)));}}};
for(const t of [0,.8,2.5,4.5,6.8,9])plan.draw(b,t,plan.model);assert.ok(coords.every(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)));assert.equal(JSON.stringify(state),before);
}});
test('continuous equal-product rectangles preserve area rather than only endpoints',()=>{for(const k of [12,24,120,360])for(const a of [1,2,10])for(const z of [3,5,30])for(let i=0;i<=100;i++){const p=api.productPose(a,z,k,i/100);near(p.x*p.y,k);assert.ok(p.x>0&&p.y>0)}});
test('bisector piece is rigid under every sampled half-turn and matches opposite vertices',()=>{const spec=def.scenes.find(s=>s.id==='bisect-rectangle');for(const v of samples(spec)){const m=spec.model(v),left=[m.rect[0],m.L,m.U,m.rect[3]],right=[m.rect[2],m.U,m.L,m.rect[1]];for(let j=0;j<=60;j++){const moved=left.map(p=>api.halfTurn(p,m.C,Math.PI*j/60));near(area(moved),m.area/2);moved.forEach((p,i)=>{const q=moved[(i+1)%4],a=left[i],z=left[(i+1)%4];near(Math.hypot(p.x-q.x,p.y-q.y),Math.hypot(a.x-z.x,a.y-z.y))});}left.map(p=>api.halfTurn(p,m.C,Math.PI)).forEach((p,i)=>{near(p.x,right[i].x);near(p.y,right[i].y)});}});
test('gear tooth throughput agrees in opposite directions throughout rotation',()=>{for(let teeth=12;teeth<=54;teeth+=3)for(let i=0;i<=100;i++){const g=api.gearPose(teeth,i/100);near(g.a*18/(2*Math.PI),g.passed);near(-g.b*teeth/(2*Math.PI),g.passed)}});
test('twenty-one distinct constructions and correct raw mathematical escapes',()=>{assert.equal(def.scenes.length,21);assert.equal(new Set(Object.values(api.recipes).map(r=>r.motion)).size,21);for(const spec of def.scenes){const[plan]=api.build({M,scene:{_mf:spec}},{});for(const t of [0,2,5,9]){const f=plan.frame(t,plan.model);assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(f.label+f.formula));}}});
