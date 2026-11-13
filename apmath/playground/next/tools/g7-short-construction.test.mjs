import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/construction-lesson-runtime.mjs';
const require=createRequire(import.meta.url),shorts=require('../kit/apl-g7-short-construction.js');
const DEG=Math.PI/180,near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,(a.z||0)-(b.z||0));
const angle=(a,v,z)=>{const u=[a.x-v.x,a.y-v.y],w=[z.x-v.x,z.y-v.y];return Math.acos(Math.max(-1,Math.min(1,(u[0]*w[0]+u[1]*w[1])/Math.hypot(...u)/Math.hypot(...w))))/DEG;};
const rotate=(p,v,a)=>{const x=p.x-v.x,y=p.y-v.y;return{x:v.x+x*Math.cos(a*DEG)-y*Math.sin(a*DEG),y:v.y+x*Math.sin(a*DEG)+y*Math.cos(a*DEG)};};
const plans=lab=>shorts.registry[`g7-construction/${lab.scene.id}`](lab,lab.s);
const plan=(lab,label)=>plans(lab).find(p=>p.legacyLabel===label);
function capture(board,p,t){
  const result={paths:[],texts:[],arcs:[]},old={path:board.path,_text:board._text,arc:board.arc};
  board.path=function(ps,o){result.paths.push({points:ps,options:o});return old.path.call(this,ps,o);};
  board._text=function(x,y,text,...rest){result.texts.push(String(text));return old._text.call(this,x,y,text,...rest);};
  board.arc=function(...args){result.arcs.push(args);return old.arc.apply(this,args);};
  try{board.begin();p.draw(board,t,p.model);board.end();return result;}finally{Object.assign(board,old);}
}
function triangleCongruent(A,B){
  // Congruence is checked independently by sorted squared Euclidean side lengths,
  // without trusting either native candidate flags or the short's permutation.
  const metric=T=>[distance(T[0],T[1])**2,distance(T[1],T[2])**2,distance(T[2],T[0])**2].sort((a,b)=>a-b);
  const a=metric(A),b=metric(B);return a.every((x,i)=>Math.abs(x-b[i])<1e-7*Math.max(1,x));
}

test('all production construction lessons have current-state shorts, exact labels and duration metadata',async()=>{
  const lab=await load();
  assert.deepEqual(Object.keys(shorts.registry).sort(),Array.from(lab.list,s=>`g7-construction/${s.id}`).sort());
  let count=0;
  for(const scene of lab.list){lab.go(scene.id);const snapshot=JSON.stringify(lab.s),ps=plans(lab);count+=ps.length;
    assert.deepEqual(ps.map(p=>p.legacyLabel).sort(),Array.from(lab.def.lessons[scene.id],p=>p.label||'').sort());
    assert.deepEqual(shorts.lessonInfo[`g7-construction/${scene.id}`],ps.map(p=>({legacyLabel:p.legacyLabel,duration:p.duration})));
    for(const p of ps){assert.ok(p.duration<=9.8&&p.duration>0);assert.ok(p.model.m&&p.given&&p.motion);assert.ok(p.stops.every(t=>t>0&&t<p.duration));
      assert.notDeepEqual(p.frame(0,p.model),p.frame(p.duration,p.model));
      for(const [w,h] of [[1000,650],[700,500],[390,440]]){lab.board.resize(w,h);const first=capture(lab.board,p,0);assert.ok(first.paths.length>=1,`${p.id}: meaningful source figure`);
        for(const t of new Set([.4,1.3,3.6,5.6,7.8,p.duration,...p.stops]))capture(lab.board,p,t);
        assert.deepEqual(capture(lab.board,p,0).texts,first.texts,'seeking back removes later conclusions');
      }
    }
    assert.equal(JSON.stringify(lab.s),snapshot,'playback does not overwrite controls, progress, choices or cnPk');
  }
  assert.equal(count,70);assert.equal(lab.list.length,23);
});

test('compass transfers preserve all four radii, chord and current angle for tilted parallel lines',async()=>{
  const lab=await load();lab.go('c1-2');
  for(const th of [20,55,90,110])for(const r of [1.4,2,2.6]){Object.assign(lab.s,{cnTh:th,cnR:r,cnS:.63});const snapshot=JSON.stringify(lab.s),g=plan(lab,'각옮기기').model.geo;
    near(angle(g.a,g.origin,g.z),th);near(angle(g.c,g.target,g.e),th);near(distance(g.a,g.z),2*r*Math.sin(th*DEG/2));
    [[g.origin,g.a],[g.origin,g.z],[g.target,g.c],[g.target,g.e]].forEach(([a,b])=>near(distance(a,b),r));near(distance(g.a,g.z),distance(g.c,g.e));assert.equal(JSON.stringify(lab.s),snapshot);
  }
  for(const [id,label] of [['c1-3','동위각작도'],['c1-4','엇각작도']]){lab.go(id);for(const al of [-20,0,20])for(const px of [-1.8,1.6]){Object.assign(lab.s,{cnPAl:al,cnPx:px,cnPh:3.7,cnPR:1.6});const g=plan(lab,label).model.geo;
    near(angle(g.a,g.origin,g.z),angle(g.c,g.target,g.e));near(distance(g.a,g.z),distance(g.c,g.e));
    const v={x:g.e.x-g.target.x,y:g.e.y-g.target.y};near(v.x*g.dl.y-v.y*g.dl.x,0);
  }}
  lab.go('c1-5');for(let i=0;i<16;i++){lab.scene.cn.reroll(lab.s);const p=plan(lab,'순서문제'),m=p.model;assert.ok(shorts.validOrder(m.order));assert.deepEqual(Array.from(m.order),Array.from(lab.s.cnPk.good));assert.equal(m.answer,m.Q.choices.findIndex(c=>c.ok)+1);capture(lab.board,p,2);}
  assert.equal(shorts.validOrder([0,1,3,2,4,5]),false,'measuring the chord before both equal-radius arcs changes the required compass opening');
});

test('rigid rod endpoints give strict triangle inequalities and exact integer bounds',async()=>{
  for(const values of [[3,4,5],[2,3,5],[2,3,6],[5,5,5],[2,8,9],[9,2,8]]){
    const m=shorts.rodModel(values),sorted=[...values].sort((a,b)=>a-b),valid=sorted[0]+sorted[1]>sorted[2];assert.equal(m.ok,valid);
    for(const u of [0,.2,.5,.8,1]){const p=shorts.rodPose(m,u);near(distance(p.A,p.C),sorted[0]);near(distance(p.B,p.D),sorted[1]);near(distance(p.A,p.B),sorted[2]);}
    const last=shorts.rodPose(m,1);near(distance(last.C,last.D),valid?0:sorted[2]-sorted[0]-sorted[1]);
  }
  const lab=await load();lab.go('c2-2');for(const a of [2,5,10])for(const b of [2,7,10]){lab.s.cnPk={a,b,kind:0};Object.assign(lab.s,{cnXa:a,cnXb:b});const feasible=Array.from({length:a+b},(_,i)=>i).filter(x=>x>0&&a+b>x&&a+x>b&&b+x>a);
    assert.equal(plan(lab,'정수개수').model.answer,feasible.length);assert.equal(plan(lab,'최댓값').model.answer,Math.max(...feasible));assert.equal(plan(lab,'최솟값').model.answer,Math.min(...feasible));
  }
  for(const id of ['c2-1','c2-3']){lab.go(id);for(let i=0;i<12;i++){lab.scene.cn.reroll(lab.s);for(const p of plans(lab)){if(p.model.cards)for(const c of p.model.cards){const [a,b,z]=c.rods.values;assert.equal(c.rods.ok,a+b>z&&b+z>a&&z+a>b);}capture(lab.board,p,7.8);}}}
});

test('SSA circle-ray intersections and generated construction choices match independent Euclidean measurements',async()=>{
  for(const [adj,opp,A] of [[7,5,40],[6,3,60],[5,7,40],[8,4,30],[7,5,110]]){
    const m=shorts.ssaModel(adj,opp,A);for(const p of m.points){near(distance(p,{x:adj,y:0}),opp);near(angle({x:adj,y:0},{x:0,y:0},p),A);}assert.equal(new Set(m.lengths.map(n=>n.toFixed(8))).size,m.count);
    const h=adj*Math.sin(A*DEG);const expected=A>=90?(opp>adj?1:0):opp<h-1e-7?0:Math.abs(opp-h)<1e-7?1:opp<adj?2:1;assert.equal(m.count,expected);
  }
  const lab=await load();for(const id of ['c3-1','c3-2','c3-3','c3-4']){lab.go(id);for(let k=0;k<12;k++){lab.s.cnPk={...lab.s.cnPk,k,g:['sss','sas','asa'][k%3]};const p=plan(lab,'보기 판별'),m=p.model,Q=lab.scene.cn.prob(lab.scene.cn.model(lab.s),lab.s);
    assert.equal(m.answer,Q.choices.findIndex(q=>q.ok)+1);assert.deepEqual(JSON.parse(JSON.stringify(m.conditions)),JSON.parse(JSON.stringify(Q.sourceChoices)));
    for(const c of m.conditions){if(c.kind==='ssa'){const roots=shorts.ssaModel(c.adjacent,c.opposite,c.A);assert.equal(roots.count,2);for(const v of roots.points)near(distance(v,{x:c.adjacent,y:0}),c.opposite);}else if(c.kind==='sss')assert.ok(c.a+c.b>c.c&&c.a+c.c>c.b&&c.b+c.c>c.a);else if(c.kind==='sssx')assert.ok(Math.max(c.a,c.b,c.c)*2>=c.a+c.b+c.c);}
    capture(lab.board,p,0);capture(lab.board,p,5.8);capture(lab.board,p,9.6);
  }}
  lab.go('c3-4');Object.assign(lab.s,{cnAA:80,cnMA:35,cnMb:5,cnMc:7});near(plan(lab,'끼인각 아님').model.condition.A,35);
  lab.go('c3-5');for(const [g,expected] of [[0,3],[1,2],[2,3],[3,2]])for(const rot of [0,1,2]){lab.s.cnPk={g,rot,k:2};const p=plan(lab,'조건 개수');assert.equal(p.model.answer,expected);const Q=lab.scene.cn.prob(lab.scene.cn.model(lab.s));assert.equal(parseInt(Q.choices.find(c=>c.ok).p),expected);capture(lab.board,p,8);}
});

test('rigid triangle and rectangle motions preserve metric size, including projected 3-D reflections',async()=>{
  const lab=await load();lab.go('c4-1');const T=[{x:0,y:0},{x:6,y:0},{x:2.4,y:-3.6}];
  for(const reflect of [false,true]){const other=T.map(p=>({x:12+(reflect?-p.x:p.x),y:p.y+2}));for(const u of [0,.15,.5,.85,1]){const pose=shorts.rigidPose(other,T,u);for(const [a,b] of [[0,1],[1,2],[2,0]])near(distance(pose[a],pose[b]),distance(T[a],T[b]));if(u===1)pose.forEach((p,i)=>near(distance(p,T[i]),0));}}
  for(const [w,h,w2] of [[6,4,8],[6,4,4],[6,4,6],[7,5,12]]){const h2=w*h/w2;for(const u of [0,.25,.5,.75,1]){const T=shorts.rectanglePose(w,h,w2,h2,u),edges=[distance(T[0],T[1]),distance(T[1],T[2])].sort((a,b)=>a-b),expected=[w2,h2].sort((a,b)=>a-b);near(edges[0],expected[0]);near(edges[1],expected[1]);near(distance(T[0],T[2])**2,w2*w2+h2*h2);}}
  assert.equal(shorts.rational(35,12),'35/12');
  for(const p of [[1,2,0],[2,1,0],[0,2,1]])for(const q of [0,1,2]){lab.s.cnPk={p,q,k:9};const ps=plans(lab);assert.equal(ps.find(p=>p.legacyLabel==='대응점').model.answer,'DEF'[p[q]]);assert.equal(ps.find(p=>p.legacyLabel==='대응변').model.answer,'DEF'[p[q]]+'DEF'[p[(q+1)%3]]);}
});

test('one active equation type uses current cnPk; the other is an explicitly labelled exploration auxiliary',async()=>{
  const lab=await load();
  for(const scene of ['c4-3','c6-3']){lab.go(scene);for(let i=0;i<20;i++){lab.scene.cn.reroll(lab.s);const snapshot=JSON.stringify(lab.s),ps=plans(lab).filter(p=>['길이식','각도식'].includes(p.legacyLabel));
    for(const p of ps){const m=p.model;assert.equal(m.active,m.kind===lab.s.cnPk.kind);if(m.active){near(m.coefficient*m.answer+m.constant,m.target);const native=lab.scene.cn.prob(lab.scene.cn.model(lab.s));near(Number(native.choices.find(q=>q.ok).p),m.answer);assert.equal(m.auxiliary,false);}else{assert.match(p.given,/현재 탐구 도형.*보조 문제/);assert.equal(m.coefficient,1);assert.equal(m.constant,0);near(m.answer,m.target);}
      const first=capture(lab.board,p,0),last=capture(lab.board,p,9.6);assert.ok(!first.texts.some(s=>s.startsWith('x=')),'unknown is not prematurely revealed');assert.ok(p.frame(9.6,m).formula.includes('x'));assert.notDeepEqual(last,first);
    }assert.equal(JSON.stringify(lab.s),snapshot);
  }}
});

test('all actual five-candidate congruence sets match independent side-distance classification at current settings',async()=>{
  const lab=await load();lab.go('c5-3');for(let k=0;k<14;k++){lab.scene.cn.reroll(lab.s);const snapshot=JSON.stringify(lab.s);for(const p of plans(lab)){const m=p.model;
    assert.equal(m.m.pk.k,lab.s.cnPk.k);const verdict=Array.from(m.set.cands,c=>triangleCongruent(m.set.base.pts,c.dsc.pts));assert.equal(verdict.filter(Boolean).length,1);assert.equal(verdict.indexOf(true),m.answer);
    for(const c of [m.set.base,...m.set.cands.map(c=>c.dsc)]){for(const [i,j,n] of c.sides)near(distance(c.pts[i],c.pts[j]),n);for(const [i,n] of c.angs)near(angle(c.pts[(i+1)%3],c.pts[i],c.pts[(i+2)%3]),n);}
    for(const width of [1000,390]){lab.board.resize(width,500);capture(lab.board,p,0);capture(lab.board,p,3);capture(lab.board,p,6);capture(lab.board,p,9.6);}
  }assert.equal(JSON.stringify(lab.s),snapshot);}
  lab.go('c5-2');for(const A of [30,55,80])for(const B of [30,65,80]){Object.assign(lab.s,{cnEA:A,cnEB:B});const p=plan(lab,'셋째 각');near(angle(p.model.T[0],p.model.T[2],p.model.T[1]),p.model.answer);near(p.model.answer,180-A-B);}
});

test('hidden equilateral/square congruences and every current angle variant agree with coordinate geometry',async()=>{
  const lab=await load();
  lab.go('c6-1');for(const a of [3,5,8])for(const b of [2,4,6]){Object.assign(lab.s,{cnGa:a,cnGb:b});const g=plan(lab,'합동찾기').model.geo;near(distance(rotate(g.B,g.C,60),g.A),0);near(distance(rotate(g.D,g.C,60),g.E),0);near(angle(g.A,g.P,g.B),60);near(angle(g.B,g.P,g.E),120);}
  for(const y of [25,30,35,40,45]){lab.s.cnPk={y,kind:0,q:0};const p=plan(lab,'대응각'),g=p.model.geo;near(angle(g.D,g.E,g.A),p.model.answer);near(angle(g.B,g.D,g.C),y);}
  lab.go('c6-2');for(const L of [6,9,12])for(const c of [2,3,4]){lab.s.cnPk={L,c,kind:0,k:2};for(const p of plans(lab)){if(p.model.goal==='congruence')continue;const g=p.model.geo;near(distance(rotate(g.B,g.A,-60),g.C),0);near(distance(rotate(g.D,g.A,-60),g.E),0);near(p.model.answer,p.model.goal==='angle'?angle(g.D,g.C,g.E):p.model.goal==='CE'?distance(g.C,g.E):distance(g.C,g.D));}}
  lab.go('c6-3');for(const a of [4,6,9])for(const e of [2,3])for(const th of [20,35,65]){Object.assign(lab.s,{cnKa:a,cnKe:e,cnKth:th});const g=plan(lab,'합동찾기').model.geo;near(distance(rotate(g.B,g.A,-90),g.D),0);near(distance(rotate(g.E,g.A,-90),g.G),0);near(distance(g.B,g.E),distance(g.D,g.G));}
  lab.go('c6-4');for(const m of ['in','out'])for(const q of [0,1,2,3]){lab.s.cnPk={m,q,k:2};const p=plan(lab,'기본각'),g=p.model.geo,n=p.model.target.split('').map(n=>g[n]);near(p.model.answer,angle(n[0],n[1],n[2]));const from=[g.A,g.B,g.E],to=[g.D,g.C,g.E];
    for(const u of [0,.25,.5,.75,1]){const folded=shorts.horizontalFold(from,-p.model.m.a/2,u);for(const [i,j] of [[0,1],[1,2],[2,0]])near(distance(folded[i],folded[j]),distance(from[i],from[j]));if(u===1)folded.forEach((v,i)=>near(distance(v,to[i]),0));}
    capture(lab.board,p,0);capture(lab.board,p,5.5);capture(lab.board,p,9.6);
  }
});
