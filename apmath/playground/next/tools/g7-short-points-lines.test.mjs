import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/points-lines-lesson-runtime.mjs';
const api = createRequire(import.meta.url)('../kit/apl-g7-short-points-lines.js');
const plain = x => JSON.parse(JSON.stringify(x));
const near = (a, b, eps = 1e-8) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} != ${b}`);
const length = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
function native(lab, id, values = {}) {
  lab.go(id); Object.assign(lab.s, plain(values)); return api.bind(id, lab, lab.s);
}
const variants = {
  'b1-1': { p1k: 1, p1n: 8, p1e: 2, plYaw: 135, plPit: 65 },
  'b1-2': { p2t: 18, p2x: 1.2, p2m: 1, p2par: 0 },
  'b1-3': { p3ka: 2, p3a: 8, p3kb: 1, p3b: 3 },
  'l-ray': { lrA: 11, lrB: 2 }, 'l-types': { lrA: 11, ltL: 10 },
  'l-same': { lp0: 0, lp1: 2, lp2: 9, lp3: 12, lsS: 3 },
  'l-common': { lp0: 0, lp1: 2, lp2: 9, lp3: 12, lcs: 3 },
  'l-short': { lrA: 11, lrB: 12, lsH: 3 },
  'l-col': { lcn: 7, lcf: 6, lcx: [0, 1, 2, 5, 8, 10, 12] },
  'l-gen': { lgn: 8, lgm: 3, lgr: -1.2 },
  'l-mix': { lkn: 7, lkk: 3, lkx: [0, 5, 12] },
  'm-mid': { mL: 20, mC: 2 }, 'm-dbl': { dL: 24 },
  'm-tri': { tL: 36 }, 'm-ratio': { rK: 6, rU: 5 },
  'm-eq': { eA: 2, eB: 9, eC: 4, eD: 1, eX: 0 },
  ck1: { ck1_h: 12, ck1_m: 59, ck1_seed: 3 },
  ck2: { ck2_h: 11, ck2_m: 1, ck2_seed: 3 },
  vt: { vt_th: 150, vt_n: 6, vt_seed: 3 },
  ve: { ve_a1: 2, ve_b1: 30, ve_a2: 5, ve_b2: -15, ve_x: 8, ve_seed: 1 },
  th: { th_a: 15, th_bb: 120, th_seed: 13 },
  pd: { pd_d: 2, pd_q: -4, pd_px: -2, pd_seed: 3 },
  bs: { bs_g: 15, bs_T: 60, bs_seed: 3 },
  tr: { tr_b: 6, tr_h: 2, tr_sa: -2, tr_ti: 2, tr_seed: 3 }
};

test('all 24 production scenes and 63 labels bind live inputs without applying legacy starts', async () => {
  const lab = await load();
  assert.equal(lab.list.length, 24);
  assert.deepEqual(Object.keys(api.registry).sort(), Object.keys(lab.def.lessons).map(id => `g7-points-lines/${id}`).sort());
  let total = 0;
  for (const scene of lab.list) {
    lab.go(scene.id); Object.assign(lab.s, plain(variants[scene.id]), { plSeed: 13 });
    const before = JSON.stringify(lab.s), plans = api.registry[`g7-points-lines/${scene.id}`](lab, lab.s);
    assert.deepEqual(plans.map(p => p.legacyLabel), Array.from(lab.def.lessons[scene.id], p => p.label || ''));
    assert.deepEqual(api.lessonInfo[`g7-points-lines/${scene.id}`], plans.map(p => ({ legacyLabel: p.legacyLabel, duration: p.duration })));
    total += plans.length;
    for (const plan of plans) {
      assert.ok(plan.duration <= 9.8 && plan.duration > 7.4);
      assert.deepEqual(plan.stops, [1.4, 3.4, 5.4, 7.4]);
      assert.ok(plan.given && !/undefined|NaN/.test(plan.given));
      assert.deepEqual(plan.model.sourceState, plain(lab.s));
      for (const t of [0, 1.4, 3.4, 5.4, 7.39]) assert.equal(plan.frame(t, plan.model).answer, false);
      assert.equal(plan.frame(9.6, plan.model).answer, true);
      assert.ok(plan.frame(9.6, plan.model).formula);
    }
    const snapshot = plain(lab.s);
    const expectedQuestion = scene._pl
      ? scene._pl.quiz(scene._pl.model(snapshot), snapshot, lab.api.rng(lab.api.hash(scene.id) + 14 * 7919))
      : scene.__spec.problem(scene.__sv(snapshot));
    assert.deepEqual(plain(plans[0].model.question), plain(expectedQuestion));
    assert.equal(JSON.stringify(lab.s), before, `${scene.id}: input/seed/pick preserved`);
  }
  assert.equal(total, 63);
  const col = native(lab, 'l-col', variants['l-col']);
  lab.s.lcx[0] = -999;
  assert.equal(col.xs[0], 0, 'a later drag cannot change an existing proof');
});

test('polyhedron enumeration uses actual vertices, edges and two incident faces', async () => {
  const lab = await load();
  for (let kind = 0; kind < 3; kind++) for (const n of [3, 5, 8]) {
    const m = native(lab, 'b1-1', { p1k: kind, p1n: n, p1e: 2 });
    const s = m.solid, keys = new Set();
    assert.equal(s.V.length, m.a); assert.equal(s.E.length, m.b);
    assert.equal(s.V.length - s.E.length + s.F.length, 2);
    for (const e of s.E) {
      const key = [e.u, e.v].sort((a,b) => a-b).join(':'); assert.ok(!keys.has(key)); keys.add(key);
      assert.equal(s.F.filter(f => f.some((v,i) => v === e.u && f[(i+1)%f.length] === e.v || v === e.v && f[(i+1)%f.length] === e.u)).length, 2);
    }
    for (const [yaw, pitch] of [[-35,30],[145,5],[0,80]]) {
      const view = api.solidVisibility(s, { yaw, pitch });
      const expected = lab.api.solids.visibility(s, lab.api.solids.rot(yaw*Math.PI/180, pitch*Math.PI/180));
      assert.deepEqual(view.front, Array.from(expected.edgeVis));
      view.q.forEach((p,i) => { near(p.x,expected.Q[i].x); near(p.y,-expected.Q[i].y); near(p.d,expected.Q[i].d); });
    }
  }
});

test('plane/line intersections satisfy both actual plane equations', async () => {
  const lab = await load();
  for (const phi of [18,60,90]) for (const hx of [-1.2,1.2]) for (const mode of [0,1]) {
    const m = native(lab, 'b1-2', { p2t:phi, p2x:hx, p2m:mode, p2par:0 });
    const geometry = api.planeGeometry(m), u = -.9 / Math.sin(phi*Math.PI/180);
    for (const z of [-2.1,0,2.1]) {
      const point = geometry.point(u,z); near(point.y,0); near(point.x,m.xHit); near(point.z,z);
    }
    assert.ok(geometry.point(u-.1,0).y < 0 && geometry.point(u+.1,0).y > 0);
    const parallel = native(lab, 'b1-2', { p2t:phi, p2x:hx, p2m:mode, p2par:1 });
    for (const point of api.planeGeometry(parallel).Q) near(point.y,.9);
    assert.equal(parallel.xHit, null);
  }
});

test('seeded ray names and all intersection cases agree with physical rays', async () => {
  const lab = await load();
  for (const S of [0,1,2,3]) for (const seed of [0,3,13]) {
    const m = native(lab, 'l-same', { lsS:S, plSeed:seed, lp0:0, lp1:2, lp2:9, lp3:12 });
    assert.equal(m.asked[0], 'ABCD'[S]);
    const [sameA,sameB] = api.sameComparison(m,0);
    assert.equal(sameA.x,sameB.x); assert.equal(sameA.d,sameB.d);
    const [startA,startB] = api.sameComparison(m,1);
    assert.notEqual(startA.x,startB.x); assert.equal(startA.d,startB.d); assert.ok(!startB.name.includes('undefined'));
    const [dirA,dirB] = api.sameComparison(m,2);
    assert.equal(dirA.x,dirB.x); assert.equal(dirA.d,-dirB.d);
  }
  for (let lcs = 0; lcs < 4; lcs++) {
    const m = native(lab, 'l-common', { lcs, lp0:0, lp1:2, lp2:9, lp3:12 });
    const a = { x:m.xs[m.r1.s], d:m.r1.d }, b = { x:m.xs[m.r2.s], d:m.r2.d }, intersection = api.rayIntersection(a,b);
    assert.equal(intersection.kind,m.sh.kind);
    for (let x=-3;x<=15;x+=.5) {
      const contains = intersection.kind==='none' ? false : intersection.kind==='point' ? x===intersection.x : intersection.kind==='seg' ? x>=intersection.lo&&x<=intersection.hi : (x-intersection.x)*intersection.d>=0;
      assert.equal(contains,(x-a.x)*a.d>=0&&(x-b.x)*b.d>=0);
    }
  }
});

// Deduplicate actual coordinate geometry; do not recalculate the same count
// formulas as the implementation. Collinear names must collapse geometrically.
function geometricCounts(points) {
  const round = n => Math.round(n*1e8)/1e8, lines=new Set(), rays=new Set(), segments=new Set();
  for (let i=0;i<points.length;i++) for (let j=0;j<points.length;j++) if(i!==j) {
    const p=points[i],q=points[j],L=length(p,q),dx=(q.x-p.x)/L,dy=(q.y-p.y)/L;
    rays.add([p.x,p.y,dx,dy].map(round).join(':'));
    const sign=dx>1e-9||Math.abs(dx)<1e-9&&dy>0?1:-1;
    lines.add([dx*sign,dy*sign,(dy*p.x-dx*p.y)*sign].map(round).join(':'));
    segments.add([i,j].sort((a,b)=>a-b).join(':'));
  }
  return {line:lines.size,ray:rays.size,seg:segments.size};
}
test('line, ray and segment counts match coordinate deduplication, including active subsets', async () => {
  const lab=await load();
  for(const [id,state] of [
    ['l-col',{lcn:3}],['l-col',variants['l-col']],
    ['l-gen',{lgn:3,lgm:2,lgr:.2}],['l-gen',variants['l-gen']],['l-gen',{lgn:8,lgm:8,lgr:1.3}],
    ['l-mix',{lkn:4,lkk:3}],['l-mix',variants['l-mix']],['l-mix',{lkn:7,lkk:6}]
  ]) {
    const m=native(lab,id,state),g=api.countGeometry(id,m),counts=geometricCounts(g.points.slice(0,g.n));
    assert.deepEqual(counts,{line:m.line,ray:m.ray,seg:m.seg});
  }
});

test('unfolding a broken route preserves each link and exposes its excess length', async () => {
  const lab=await load();
  for(const [A,B,h] of [[2,9,2],[0,12,3],[11,12,3]]) {
    const m=native(lab,'l-short',{lrA:A,lrB:B,lsH:h}),start=api.unfoldPath(m,0);
    for(const u of [0,.13,.4,.5,.76,1]) {
      const p=api.unfoldPath(m,u); near(length(p[0],p[1]),length(start[0],start[1])); near(length(p[1],p[2]),length(start[1],start[2]));
      assert.deepEqual(p[0],start[0]);
    }
    const end=api.unfoldPath(m,1);near(end[1].y,0);near(end[2].y,0);
    near(end[2].x-A,length(start[0],start[1])+length(start[1],start[2]));
    assert.ok(end[2].x>B);
  }
});

test('midpoint copies preserve lengths, meet exactly, and partition the actual whole', async () => {
  const lab=await load();
  for(const [L,C] of [[12,4],[20,2],[20,18]]) {
    const m=native(lab,'m-mid',{mL:L,mC:C});
    near(m.M,C/2);near(m.N,(C+L)/2);near(m.N-m.M,L/2);
    for(const u of [0,.2,.6,1]) {
      const p=api.midpointPieces(m,u);near(length(...p.first),C/2);near(length(...p.second),(L-C)/2);
      p.first.concat(p.second).forEach(q=>near(q.y,3));
    }
    const p=api.midpointPieces(m,1);near(p.first[1].x,p.second[0].x);near(p.second[1].x,m.N-m.M);
  }
  for(const [id,state] of [['m-dbl',{dL:24}],['m-tri',{tL:36}],['m-ratio',{rK:6,rU:5}]]) {
    const m=native(lab,id,state),layout=api.midLayout(id,m),p=Object.fromEntries(layout.points.map(([x,name])=>[name,x]));
    if(id==='m-dbl'){near(p.M,(p.A+p.B)/2);near(p.N,(p.M+p.B)/2);near(m.q,(p.B-p.A)/4);}
    if(id==='m-tri'){near(p.P-p.A,p.Q-p.P);near(p.Q-p.P,p.B-p.Q);near(p.M,(p.A+p.B)/2);near(p.M-p.P,p.Q-p.M);}
    if(id==='m-ratio'){near(p.M,(p.A+p.C)/2);near(p.C-p.A,m.k*(p.B-p.C));near(m.MB,p.B-p.M);}
  }
});

test('clock angles agree with vector separation and continuous hand speeds', async () => {
  const lab=await load();
  for(const [h,m] of [[12,0],[12,59],[11,1],[3,39],[6,0],[2,20]]) {
    const c=native(lab,'ck1',{ck1_h:h,ck1_m:m});
    const hour=2*Math.PI*((h%12)+m/60)/12,minute=2*Math.PI*m/60;
    near(c.gap,Math.acos(Math.max(-1,Math.min(1,Math.cos(hour-minute))))*180/Math.PI);
    assert.ok(c.gap>=0&&c.gap<=180);
    const next=api.clock(h,m+1);near(next.th-c.th,.5);near(next.tm-c.tm,6);
    near((next.tm-c.tm)-(next.th-c.th),5.5);
  }
});

test('equation solutions satisfy original geometry and seeded three-line questions', async () => {
  const lab=await load();
  for(const state of [variants['m-eq'],{eA:6,eB:2,eC:3,eD:29,eX:14}]) {
    const m=native(lab,'m-eq',state);near(m.a*m.x0+m.bb,m.c*m.x0+m.d);near(m.AB0,m.a*m.x0+m.bb+m.c*m.x0+m.d);
  }
  const ve=native(lab,'ve',variants.ve);near(ve.a1*ve.solution+ve.b1,ve.a2*ve.solution+ve.b2);near(ve.value,ve.question.choices.find(c=>c.ok).v);
  const equations=new Set();
  for(const seed of [0,1,7,13]) {
    const m=native(lab,'th',{th_a:15,th_bb:120,th_seed:seed}),c=m.cfg;
    near(c.xs+c.p,m.a);near(c.r*c.xs+c.s,180-m.a-m.bb);
    near((1+c.r)*c.xs+c.p+c.B+c.s,180);
    near(c.xs,m.question.choices.find(q=>q.ok).v); equations.add(`${c.xs},${c.r},${c.p},${c.s}`);
  }
  assert.ok(equations.size>1,'different seeds retain their different actual equations');
});

test('perpendicular rotations, angle bisectors and selected triangle conditions are exact', async () => {
  const lab=await load();
  for(const [d,q,px] of [[2,-4,-2],[5,4,2],[3,0,1]]) {
    const m=native(lab,'pd',{pd_d:d,pd_q:q,pd_px:px}),P={x:px,y:-d},Q={x:px+q,y:0},H={x:px,y:0};
    for(const u of [0,.3,.7,1])near(length(P,api.swingToPerpendicular(P,Q,H,u)),length(P,Q));
    const end=api.swingToPerpendicular(P,Q,H,1);near(end.x,px);assert.ok(end.y>=-1e-9);
  }
  for(const [T,g] of [[180,15],[180,165],[60,15],[120,95]]) {
    const m=native(lab,'bs',{bs_T:T,bs_g:g}),a=api.bisectorAngles(m);
    near(a.A-a.M,a.M-a.C);near(a.C-a.N,a.N-a.B);near(a.M-a.N,T/2);
  }
  for(let ti=0;ti<4;ti++) {
    const m=native(lab,'tr',{...variants.tr,tr_ti:ti}),explore=api.triangleFor(m,0),problem=api.triangleFor(m,1);
    assert.deepEqual(explore,{b:6,h:2,sa:-2});
    near(problem.h,m.question.choices.find(q=>q.ok).v);near(problem.b**2+problem.h**2,problem.ab**2);near(problem.sa,problem.b);
    assert.notEqual(problem.h,explore.h,'the current question triangle and exploration are explicitly distinguished');
  }
});

test('production Board renders full given figures and all proof stages at narrow and wide sizes', async () => {
  const lab=await load(),board=lab.board;
  const originalPath=board.path,originalText=board._text,originalPoint=board.point;
  let paths=[],labels=[],points=[];
  board.path=function(points,o={}) { paths.push(points.map(p=>({x:p.x??p[0],y:p.y??p[1]})));return originalPath.call(this,points,o); };
  board._text=function(x,y,value,o={},screen=false) { labels.push({x,y,value:String(value),o});return originalText.call(this,x,y,value,o,screen); };
  board.point=function(p,o={}) {points.push({x:p.x??p[0],y:p.y??p[1]});return originalPoint.call(this,p,o);};
  try {
    for(const width of [390,1440]) for(const changed of [false,true]) for(const scene of lab.list) {
      lab.go(scene.id);if(changed)Object.assign(lab.s,plain(variants[scene.id]),{plSeed:13});
      const before=JSON.stringify(lab.s),plans=api.registry[`g7-points-lines/${scene.id}`](lab,lab.s);
      board.resize(width,width===390?600:760);
      for(const plan of plans) for(const t of [0,1.4,2.4,3.4,4.4,5.4,6.5,7.4,9.6]) {
        paths=[];labels=[];points=[];board.begin();plan.draw(board,t,plan.model);board.end();
        assert.ok(paths.length+points.length>0,`${scene.id}/${plan.label}: full given geometry at ${t}`);
        if(scene.id==='l-gen'&&t===0)for(const p of plan.model.pts)assert.ok(points.some(q=>length(p,q)<1e-9),'all active and inactive given points exist before counting starts');
        for(const p of paths.flat())assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
        for(const label of labels){
          assert.ok(Number.isFinite(label.x)&&Number.isFinite(label.y));
          assert.ok(!/undefined|NaN|Infinity/.test(label.value));
          assert.ok(label.x>=0&&label.x<=board.W&&label.y>=0&&label.y<=board.H,`${scene.id}/${plan.label}: label anchor stays on the canvas (${label.value})`);
        }
        const f=plan.frame(t,plan.model);assert.ok(!/undefined|NaN|Infinity/.test(f.label+f.formula));
      }
      assert.equal(JSON.stringify(lab.s),before,`${scene.id}: rendering never writes the explorer`);
    }
  } finally { board.path=originalPath;board._text=originalText;board.point=originalPoint; }
});
