// Independently recalculate the source vector conditions and their extrema.
// Native rendering is tested separately; this is not a visual QA claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/vector-dot-lesson-runtime.mjs';
const { api } = await load({ sourceOnly: true });
const P=(x,y)=>({x,y}),V=a=>P(...a),add=(a,b)=>P(a.x+b.x,a.y+b.y),sub=(a,b)=>P(a.x-b.x,a.y-b.y),mul=(a,t)=>P(a.x*t,a.y*t);
const dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,norm=a=>Math.hypot(a.x,a.y),dist=(a,b)=>norm(sub(a,b));
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${msg}: ${a} ≈ ${b}`);
const rad=d=>d*Math.PI/180,polar=(c,r,t)=>add(c,P(r*Math.cos(t),r*Math.sin(t)));

test('m1: all six source answers use the signed component and are independent of height',()=>{
  assert.equal(api.variants.m1.length,6);
  for(const p of api.variants.m1){
    const a=P(p.a,0),b=P(p.xh,p.yb);near(dot(a,b),p.val);assert.ok(p.a>0);
    for(const y of [-4,0,1,4])near(dot(a,P(p.xh,y)),p.val);
    if(p.xh<0){assert.ok(p.val<0);assert.notEqual(p.a*Math.abs(p.xh),p.val,'ordinary length loses the projection sign');}
    if(p.xh===0){near(p.val,0);assert.ok(norm(b)>0);near(dot(a,b),0);}
  }
  near(api.first('m1').val,18);near(dot(P(6,0),P(-2,4)),-12);
});

test('m2: source angles follow from independent atan2 and zero vectors have no angle',()=>{
  assert.equal(api.variants.m2.length,5);
  const angle=(a,b)=>norm(a)*norm(b)>0?Math.atan2(Math.abs(cross(a,b)),dot(a,b))*180/Math.PI:null;
  for(const p of api.variants.m2){const a=P(p.ax,p.ay),b=P(p.bx,p.by);near(dot(a,b),p.d);near(angle(a,b),p.th);near(Math.cos(rad(p.th)),p.d/(norm(a)*norm(b)));}
  const a=P(4,2);near(norm(a),Math.sqrt(20));near(norm(P(1,3)),Math.sqrt(10));near(angle(a,P(1,3)),45);
  near(dot(a,P(-1.5,3)),0);near(angle(a,P(-1.5,3)),90);near(angle(a,P(-3,1)),135);
  near(angle(a,P(2,1)),0);near(angle(a,P(-2,-1)),180);assert.equal(angle(a,P(0,0)),null);near(dot(a,P(0,0)),0);
});

test('m3: all six circle packets attain both Cauchy bounds at actual radius endpoints',()=>{
  assert.equal(api.variants.m3.length,6);
  for(const p of api.variants.m3){
    const a=P(p.ax,p.ay),c=P(p.cx,p.cy),u=mul(a,1/norm(a)),hi=add(c,mul(u,p.r)),lo=sub(c,mul(u,p.r));
    near(norm(a),p.la);near(dot(a,c),p.k);near(dist(hi,c),p.r);near(dist(lo,c),p.r);
    near(dot(a,hi),p.M);near(dot(a,lo),p.m);near(p.M-p.m,2*norm(a)*p.r);
    for(const t of [0,.7,2,3.9,5.5]){const q=polar(c,p.r,t);near(dot(a,q),dot(a,c)+dot(a,sub(q,c)));assert.ok(dot(a,q)>=p.m-1e-9&&dot(a,q)<=p.M+1e-9);}
  }
  for(const r of [1,2,3.5]){const a=P(3,4),c=P(2,1);near(dot(a,add(c,mul(a,r/5))),10+5*r);near(dot(a,sub(c,mul(a,r/5))),10-5*r);}
  near(api.first('m3').M,20);near(api.first('m3').m,0);
});

test('m4: actual coordinates cancel the cross terms and attain the advertised distance bounds',()=>{
  assert.equal(api.variants.m4.length,5);
  for(const p of api.variants.m4){
    const a=P(-p.L,0),b=P(p.L,0),c=P(.6*p.d,.8*p.d),u=mul(c,1/norm(c)),hi=add(c,mul(u,p.r)),lo=sub(c,mul(u,p.r));
    assert.ok(p.d>p.r);near(norm(c),p.d);near(norm(hi),p.d+p.r);near(norm(lo),p.d-p.r);
    near(dot(sub(a,hi),sub(b,hi)),p.hi);near(dot(sub(a,lo),sub(b,lo)),p.lo);
    for(const t of [0,.6,2.1,4,5.8]){const q=polar(c,p.r,t),v=dot(sub(a,q),sub(b,q));near(v,dot(q,q)-p.L*p.L);assert.ok(v>=p.lo-1e-9&&v<=p.hi+1e-9);}
  }
  const m=P(0,-2.5),a=P(-2,-2.5),b=P(2,-2.5),c=P(3,1.5);
  near(dist(m,c),5);
  for(const r of [2,3.5])for(const t of [rad(53.130102354156),rad(233.130102354156),rad(240)]){const q=polar(c,r,t);near(dot(sub(a,q),sub(b,q)),dist(q,m)**2-4);}
  near(api.first('m4').hi,45);near(api.first('m4').lo,5);
});

test('cmp5: 17 registered packets satisfy the direction equations and independent distance minimum',()=>{
  let count=0;
  for(const[kind,pool]of Object.entries(api.variants.cmp))for(const d of pool){
    count++;const p=api.math.cmpPacket(kind,d),a=V(d.a),b=V(d.b),c=d.c?V(d.c):null;
    if(kind==='min'){
      const distance=Math.abs(cross(a,b))/norm(b),k=-dot(a,b)/dot(b,b),f=add(a,mul(b,k)),g=api.math.cmp(a,b,c,0);
      near(distance,d.m);near(norm(f),d.m);near(dot(f,b),0);near(g.uMin,distance);near(g.kMin,k);
      for(const delta of [-3,-.4,1,4])near(norm(add(a,mul(b,k+delta)))**2,distance**2+dot(b,b)*delta**2);
    }else{
      const u=add(a,mul(b,d.k));assert.ok(norm(u)>0&&norm(c)>0);near(kind==='par'?cross(u,c):dot(u,c),0);
      const g=api.math.cmp(a,b,c,d.k);assert.equal(g[kind].kind,'unique');near(g[kind].k,d.k);near(p.k,d.k);
    }
  }
  assert.equal(count,17);
  const g=api.math.cmp(P(-3,1),P(2,-1),P(-2,2),1.4);near(norm(g.F),Math.sqrt(5)/5);near(dot(g.F,P(2,-1)),0);
  const all=api.math.cmp(P(1,0),P(1,0),P(0,1),-1);assert.equal(all.perp.kind,'all');near(all.perp.excluded,-1);near(norm(all.U),0);
  assert.equal(api.math.cmp(P(1,0),P(1,0),P(1,0),-1).perp.kind,'zero');
  assert.equal(api.math.cmp(P(1,0),P(0,1),P(1,0),0).perp.kind,'none');
  assert.equal(api.math.cmp(P(1,0),P(1,0),P(0,0),0).perp.kind,'undefined');
  for(const k of [-2,0,2]){const z=api.math.cmp(P(-3,1),P(0,0),P(-2,2),k);assert.equal(z.constant,true);assert.equal(z.kMin,null);near(norm(z.U),Math.sqrt(10));near(z.uMin,Math.sqrt(10));}
});

test('loc6: 48 registered form/type packets and endpoint exceptions describe the same precise locus',()=>{
  let count=0;
  for(const[kind,pool]of Object.entries(api.variants.locus))for(const d of pool)for(const form of ['dot','diff','len']){
    count++;const p=api.math.locusPacket(kind,d,form),m=mul(add(p.A,p.B),.5),r=dist(p.A,p.B)/2;
    near(dist(p.M,m),0);near(p.R,r);
    for(const t of [.25,1.2,2.6,4.7]){const q=polar(m,r,t),pa=sub(p.A,q),pb=sub(p.B,q);near(dot(pa,pb),0);near(dot(sub(q,p.A),sub(q,p.B)),dot(pa,pb));near(norm(add(pa,pb)),norm(sub(pa,pb)));near(dot(pa,pb),dist(q,m)**2-r*r);}
    near(dot(sub(p.A,p.A),sub(p.B,p.A)),0);near(dot(sub(p.A,p.B),sub(p.B,p.B)),0);
    let extreme;
    if(kind==='dist'){
      const [axis,k]=d.line,h=axis==='x'?P(k,m.y):P(m.x,k),d0=dist(m,h);assert.ok(d0>r);
      extreme=add(m,mul(sub(h,m),r/d0));near(dist(extreme,h),p.ans);near(p.dist,d0);
    }else{
      const D=norm(m);assert.ok(D>r);extreme=add(m,mul(m,(kind==='omax'?1:-1)*r/D));near(norm(extreme),p.ans);
    }
    near(dist(extreme,m),r);near(dot(sub(p.A,extreme),sub(p.B,extreme)),0);
  }
  assert.equal(count,48);near(api.first('loc6').ans,2);near(api.first('loc6','omax').ans,8);near(api.first('loc6','omin').ans,2);
  const a=P(-3,1),b=P(3,3),m=P(0,2);for(const[q,expected]of [[P(1,-2),7],[m,-10],[P(Math.sqrt(10),2),0]])near(dot(sub(a,q),sub(b,q)),expected);
  for(const s of [0,.25,.5,1]){const a=P(-1+s,1),b=P(1-s,1),q=P(0,2-s);near(dot(sub(a,q),sub(b,q)),0);}
  const same=P(0,1);near(dot(sub(same,P(1,2)),sub(same,P(1,2))),2);near(dot(sub(same,same),sub(same,same)),0);
});

test('prj7: all 192 quarter-disk packets agree with independent positive/negative coordinate support',()=>{
  let count=0;
  for(const u of api.variants.sector)for(const R of [3,4,5])for(const q of [0,1,2,3])for(const ask of ['M-m','M+m']){
    count++;const p=api.math.sectorPacket(u,R,q,ask),rot=[[u[0],u[1]],[u[1],-u[0]],[-u[0],-u[1]],[-u[1],u[0]]][q];
    const max=R*Math.hypot(...rot.map(x=>Math.max(0,x))),min=-R*Math.hypot(...rot.map(x=>Math.min(0,x)));
    near(p.e.M,max);near(p.e.m,min);near(p.ans,ask==='M-m'?max-min:max+min);
    for(const[v,target]of [[p.e.mx.p,max],[p.e.mn.p,min]]){near(dot(V(u),v),target);assert.ok(norm(v)<=R+1e-9);assert.ok(v.x*[1,-1,-1,1][q]>=-1e-9&&v.y*[1,1,-1,-1][q]>=-1e-9);}
  }
  assert.equal(count,192);near(api.first('prj7').ans,20);near(api.first('prj7','sum').ans,-4);
  const mixed=api.first('prj7','sum');assert.notEqual(mixed.e.M,5*4);assert.notEqual(mixed.e.m,-5*4,'a circle bound cannot be used outside the sector');
});

test('prj7 inquiry: native chords satisfy the actual region and level equation; zero u has no direction',()=>{
  for(const u of [P(3,2),P(3,-2),P(-3,-2),P(0,0)])for(const th of [45,90,150,180]){
    const e=api.math.extGen(u,4,th),samples=[0];
    for(let i=0;i<=1200;i++)samples.push(dot(u,polar(P(0,0),4,rad(th)*i/1200)));
    assert.ok(Math.abs(e.M-Math.max(...samples))<.00004);assert.ok(Math.abs(e.m-Math.min(...samples))<.00004);
    for(const t of [-4,-1,0,1.2,3,4]){
      const chord=api.math.chord(u,4,th,t);
      if(norm(u)===0){assert.equal(chord,null);continue;}
      if(!chord){assert.ok(t*norm(u)<e.m+1e-8||t*norm(u)>e.M-1e-8);continue;}
      for(const p of chord){near(dot(u,p),t*norm(u));assert.ok(norm(p)<=4+1e-8);assert.ok(p.y>=-1e-8);assert.ok(cross(p,P(Math.cos(rad(th)),Math.sin(rad(th))))>=-1e-8);assert.ok(Math.min(Math.abs(norm(p)-4),Math.abs(p.y),Math.abs(cross(p,P(Math.cos(rad(th)),Math.sin(rad(th))))))<1e-7);}
    }
  }
  near(api.math.extGen(P(3,2),4,90).M,4*Math.sqrt(13));near(api.math.extGen(P(3,-2),4,90).M,12);near(api.math.extGen(P(3,-2),4,90).m,-8);
  const zero=api.math.extGen(P(0,0),4,90);near(zero.M,0);near(zero.m,0);
});
