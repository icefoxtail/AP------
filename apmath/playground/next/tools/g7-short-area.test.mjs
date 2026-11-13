import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/area-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const api = require('../kit/apl-g7-short-area.js');
const near = (actual, expected, eps = 1e-8) => assert.ok(Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
const area = p => Math.abs(p.reduce((s, v, i) => {
  const w = p[(i + 1) % p.length]; return s + v.x * w.y - v.y * w.x;
}, 0)) / 2;
const length = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const rigid = (source, result) => {
  near(area(source), area(result));
  for (let i = 0; i < source.length; i++) for (let j = i + 1; j < source.length; j++) near(length(source[i], source[j]), length(result[i], result[j]));
};

// Independent convex-polygon clipping detects overlaps that area sums alone miss.
function intersection(subject, clip) {
  let points = subject.map(p => ({ ...p }));
  const signed = clip.reduce((s, p, i) => { const q = clip[(i + 1) % clip.length]; return s + p.x * q.y - p.y * q.x; }, 0);
  const sign = Math.sign(signed) || 1;
  for (let i = 0; i < clip.length && points.length; i++) {
    const A = clip[i], B = clip[(i + 1) % clip.length];
    const side = p => sign * ((B.x - A.x) * (p.y - A.y) - (B.y - A.y) * (p.x - A.x));
    const output = [];
    for (let j = 0; j < points.length; j++) {
      const P = points[j], Q = points[(j + 1) % points.length], u = side(P), v = side(Q);
      if (u >= -1e-9) output.push(P);
      if ((u > 1e-9 && v < -1e-9) || (u < -1e-9 && v > 1e-9)) {
        const t = u / (u - v); output.push({ x: P.x + (Q.x - P.x) * t, y: P.y + (Q.y - P.y) * t });
      }
    }
    points = output;
  }
  return points;
}
function disjoint(parts) {
  for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) near(area(intersection(parts[i], parts[j])), 0);
}
function nativeModel(lab, id, state = {}) {
  lab.go(id); Object.assign(lab.s, state);
  const model = api.bind(id, lab, lab.s);
  assert.ok(model, `${id} binds the real model`); return model;
}

test('area shorts preserve every existing individual lesson label and current inputs', async () => {
  const lab = await load(), sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const part of ['a', 'b', 'c']) vm.runInContext(fs.readFileSync(new URL(`../labs/g7-area/lesson-${part}.js`, import.meta.url), 'utf8'), sandbox);
  const lessons = sandbox.window.APL_LESSONS['g7-area'];
  assert.deepEqual(Object.keys(api.registry).sort(), Object.keys(lessons).map(id => `g7-area/${id}`).sort());
  for (const [id, value] of Object.entries(lessons)) {
    lab.go(id);
    // Non-default inputs expose accidental reuse of the legacy fixed-number script.
    for (const key of lab.scene.ar.ctl) {
      const p = lab.params[key];
      if (p && key !== lab.scene.ar.anim?.key) lab.s[key] = p.max;
    }
    const before = JSON.stringify(lab.s), actual = lab.scene.ar.model(lab.s), plans = api.registry[`g7-area/${id}`](lab, lab.s);
    assert.deepEqual(plans.map(p => p.legacyLabel).sort(), Array.from(Array.isArray(value) ? value : [value], p => p.label).sort());
    assert.deepEqual(api.lessonInfo[`g7-area/${id}`], plans.map(p => ({ legacyLabel:p.legacyLabel, duration:p.duration })));
    for (const plan of plans) {
      for (const [key, v] of Object.entries(actual)) assert.equal(plan.model[key], v, `${id}: live ${key}`);
      assert.ok(plan.duration > 0 && plan.duration <= 10);
      assert.ok(plan.stops.every(t => t >= 0 && t < plan.duration));
      assert.equal(plan.frame(0, plan.model).answer, false, `${id}/${plan.label}: no initial conclusion`);
      assert.equal(plan.frame(plan.duration, plan.model).answer, true, `${id}/${plan.label}: finished conclusion`);
      assert.ok(plan.frame(plan.duration, plan.model).formula);
    }
    assert.equal(JSON.stringify(lab.s), before, `${id}: explorer preserved`);
  }
});

test('cut parallelogram pieces tile the final rectangle without stretching or overlap', async () => {
  const lab = await load();
  for (const [B, H, S] of [[6,2,0],[8,4,3],[6,8,6],[12,7,5]]) {
    const m = nativeModel(lab, 'a2-para', { a2B:B, a2H:H, a2S:S }), start = api.paraPieces(m, 0);
    near(area(m.geometry.para), B * H);
    for (const t of [0,.17,.5,.89,1]) {
      const moved = api.paraPieces(m, t); rigid(start.cut, moved.cut);
      near(area(moved.fixed) + area(moved.cut), B * H);
    }
    const end = api.paraPieces(m, 1);
    disjoint([end.fixed, end.cut]);
    for (const p of end.fixed.concat(end.cut)) assert.ok(p.x >= S - 1e-8 && p.x <= S + B + 1e-8 && p.y >= -H - 1e-8 && p.y <= 1e-8);
  }
});

test('rotated triangle and trapezoid copies are congruent and tile a parallelogram', async () => {
  const lab = await load();
  for (const [id, values] of [
    ['a3-tri',{a3B:8,a3H:4,a3P:3}], ['a3-tri',{a3B:6,a3H:8,a3P:6}],
    ['a6-obt',{a6B:3,a6H:8,a6P:-4}], ['a6-obt',{a6B:8,a6H:2,a6P:12}],
    ['a4-trap',{a4A:6,a4B:6,a4H:8,a4P:6}], ['c1-trap',{c1A:3,c1B:11,c1H:7}]
  ]) {
    const m = nativeModel(lab,id,values), source = m.geometry.trap || m.geometry.tri;
    for (const p of [0,.11,.45,.8,1]) rigid(source, api.doubled(m,p));
    const other = api.doubled(m,1); disjoint([source,other]);
    near(area(source) + area(other), (m.geometry.trap ? m.B + m.a : m.B) * m.H);
  }
});

test('four rhombus corner rotations fill its interior exactly', async () => {
  const lab = await load();
  for (const [X,Y] of [[3,2],[8,6],[12,10],[3,10]]) {
    const m = nativeModel(lab,'a5-rhomb',{a5X:X,a5Y:Y});
    for (const t of [0,.2,.5,.8,1]) api.rhombPieces(m,t).forEach((p,i) => rigid(m.geometry.corners[i].tri,p));
    const end = api.rhombPieces(m,1); disjoint(end);
    near(end.reduce((s,p)=>s+area(p),0), area(m.geometry.rh));
    for (const p of end) near(area(intersection(p,m.geometry.rh)),area(p));
    near(area(m.geometry.rh),X*Y/2);
  }
});

test('equal-height motions and fan partitions keep the mathematical area', async () => {
  const lab = await load();
  for (const [B,H] of [[4,2],[8,5],[12,8]]) {
    const m = nativeModel(lab,'b3-rail',{b3B:B,b3H:H,b3T:.1,b3U:.95});
    for (const t of [0,.2,.5,.8,1]) near(area(api.railPose(m,t)),B*H/2);
  }
  for (const [left,right,h] of [[1,6,2],[3,2,8],[6,6,6]]) {
    const m = nativeModel(lab,'b5-ratio',{b5M:left,b5N:right,b5H:h}), parts = api.ratioPieces(m);
    disjoint(parts); for (const p of parts) near(area(p),h/2);
    near(parts.slice(0,left).reduce((s,p)=>s+area(p),0),m.S1);
    near(parts.slice(left).reduce((s,p)=>s+area(p),0),m.S2);
  }
});

test('two height problems use perpendicular distances rather than oblique edges', async () => {
  const lab=await load();
  for(const k of [1,2,3]){
    const m=nativeModel(lab,'b1-rt',{b1K:k}),[B,C,A]=m.geometry.tri;
    near((B.x-A.x)*(C.x-A.x)+(B.y-A.y)*(C.y-A.y),0);
    near(area(m.geometry.tri),m.a*m.bb/2);near(Math.abs(A.y),m.h);
  }
  for(const [a,K] of [[6,0],[12,0],[10,1],[11,2]]){
    const m=nativeModel(lab,'b2-para',{b2A:a,b2K:K}),[,C,D,A]=m.geometry.pg,F=api.secondFoot(m);
    near((A.x-F.x)*(D.x-C.x)+(A.y-F.y)*(D.y-C.y),0);
    near(length(A,F),m.A/m.c);near(area(m.geometry.pg),a*m.h1);
  }
});

test('wing subtraction and three-corner subtraction agree with independent shoelace areas', async () => {
  const lab=await load();
  for(const [B,d,H,p] of [[6,8,3,4],[10,5,6,2],[12,3,8,0]]){
    const m=nativeModel(lab,'b4-wing',{b4B:B,b4D:d,b4H:H,b4P:p}),g=m.geometry;
    near(area([g.Av,g.Bv,g.O]),area([g.Dv,g.Cv,g.O]));
    near(area([g.Av,g.Bv,g.O]),area([g.Av,g.Bv,g.Cv])-area([g.Bv,g.Cv,g.O]));
    near(m.w,B*d*H/(2*(B+d)));
  }
  for(const [W,H,a,x] of [[8,6,2,3],[6,5,4,5],[12,8,1,1]]){
    const m=nativeModel(lab,'c2-frame',{c2W:W,c2H:H,c2A:a,c2X:x}),g=m.geometry;
    disjoint([g.tri,g.c1,g.c2,g.c3]);
    near(area(g.tri),W*H-area(g.c1)-area(g.c2)-area(g.c3)); near(area(g.tri),m.A);
  }
});

test('straight and slanted road pieces stay rigid and pack into the correct rectangle', async () => {
  const lab=await load();
  for(const [W,H,x,mode] of [[14,8,2,0],[14,8,2,1],[10,6,4,1],[18,10,1,1]]){
    const m=nativeModel(lab,'c3-road',{c3W:W,c3H:H,c3X:x,c3Mode:mode});
    const source=[m.parts.UL,m.parts.UR,m.parts.LL,m.parts.LR];
    for(const t of [0,1.9,3.3,4,4.8,5.6,6.6,9])api.roadPose(m,t).forEach((p,i)=>rigid(source[i],p));
    // Once rotation has ended, every point's second translation is horizontal.
    const before=api.roadPose(m,4.8),after=api.roadPose(m,6.6);
    after.forEach((p,i)=>p.forEach((v,j)=>near(v.y,before[i][j].y)));
    disjoint(after);near(after.reduce((s,p)=>s+area(p),0),(W-x)*(H-x));
    const all=after.flat(),xs=all.map(p=>p.x),ys=all.map(p=>p.y);
    near(Math.max(...xs)-Math.min(...xs),H-x);near(Math.max(...ys)-Math.min(...ys),W-x);
  }
});

test('every area proof renders a real initial figure and finite geometry at its phase boundaries', async () => {
  const lab=await load();
  for(const [route,build] of Object.entries(api.registry)){
    lab.go(route.split('/')[1]); const before=JSON.stringify(lab.s),plans=build(lab,lab.s);
    for(const plan of plans){
      for(const width of [390,1440]){
        lab.board.resize(width,width===390?540:720);
        for(const t of [0,...plan.stops,plan.duration]){
          let paths=0;const original=lab.board.path;
          lab.board.path=function(points,options){
            if(points.length>=3)paths++;
            assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),`${route}/${plan.label}@${t}`);
            return original.call(this,points,options);
          };
          try{lab.board.begin();plan.draw(lab.board,t,plan.model);lab.board.end();}
          finally{lab.board.path=original;}
          assert.ok(paths>0,`${route}/${plan.label}: visible geometry at ${t}`);
        }
      }
    }
    assert.equal(JSON.stringify(lab.s),before,`${route}: playback does not change input state`);
  }
});

test('missing scene bindings and invalid live model values do not become guessed proofs',()=>{
  assert.deepEqual(api.registry['g7-area/a1-rect']({scene:{}},{}),[]);
  assert.deepEqual(api.registry['g7-area/a1-rect']({scene:{ar:{id:'a1-rect',model:()=>({W:NaN,H:4})}}},{}),[]);
});
