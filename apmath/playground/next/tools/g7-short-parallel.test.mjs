import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/parallel-lesson-runtime.mjs';
const require = createRequire(import.meta.url), shorts = require('../kit/apl-g7-short-parallel.js');
const DEG = Math.PI / 180;
const near = (a, b, eps = 1e-7) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), `${a} != ${b}`);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
const direction = d => ({ x: Math.cos(d * DEG), y: -Math.sin(d * DEG) });
const endpoint = (p, d, length = 1) => ({ x: p.x + length * Math.cos(d * DEG), y: p.y - length * Math.sin(d * DEG) });
const rayAngle = (a, v, b) => {
  const u = [a.x - v.x, a.y - v.y], w = [b.x - v.x, b.y - v.y];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / Math.hypot(...u) / Math.hypot(...w)))) / DEG;
};
const measured = w => rayAngle(endpoint(w.V, w.d1), w.V, endpoint(w.V, w.d2));
function capture(board, plan, time) {
  const paths = [], texts = [], arcs = [], original = { path: board.path, _text: board._text, arc: board.arc };
  board.path = function (points, options = {}) { paths.push({ points, options }); return original.path.call(this, points, options); };
  board._text = function (x, y, text, ...rest) { texts.push(String(text)); return original._text.call(this, x, y, text, ...rest); };
  board.arc = function (...args) { arcs.push(args); return original.arc.apply(this, args); };
  try { board.begin(); plan.draw(board, time, plan.model); board.end(); return { paths, texts, arcs }; }
  finally { Object.assign(board, original); }
}
function plans(lab) { return shorts.registry[`g7-parallel/${lab.scene.id}`](lab, lab.s); }

// Contract coverage comes from the production loader, not a hand-maintained count.
test('every native parallel lesson has a scene-bound short and matching lightweight duration metadata', async () => {
  const lab = await load();
  assert.deepEqual(Object.keys(shorts.registry).sort(), Array.from(lab.list, s => `g7-parallel/${s.id}`).sort());
  for (const scene of lab.list) {
    lab.go(scene.id);
    const before = JSON.stringify(lab.s), clips = plans(lab), legacy = lab.def.lessons[scene.id];
    assert.deepEqual(clips.map(p => p.legacyLabel).sort(), Array.from(legacy, p => p.label).sort());
    assert.deepEqual(shorts.lessonInfo[`g7-parallel/${scene.id}`], clips.map(p => ({ legacyLabel: p.legacyLabel, duration: p.duration })));
    for (const p of clips) {
      assert.ok(p.duration > 0 && p.duration <= 9.8, 'leave a normal-clock frame margin below 10 seconds');
      assert.ok(p.motion && p.given && p.model.G, `${p.id}: actual source model and proof mechanism`);
      assert.ok(p.stops.every(t => t > 0 && t < p.duration));
      const first = capture(lab.board, p, 0);
      assert.ok(first.paths.length >= 2, `${p.id}: recognizable source figure at entry`);
      assert.notDeepEqual(p.frame(0, p.model), p.frame(p.duration, p.model), `${p.id}: proof precedes conclusion`);
      for (const [w, h] of [[1000, 650], [700, 500], [390, 420]]) {
        lab.board.resize(w, h);
        for (const t of new Set([0, .4, 1.5, 3.1, 5.4, 7.5, p.duration, ...p.stops])) capture(lab.board, p, t);
        assert.deepEqual(capture(lab.board, p, 0).texts, first.texts, `${p.id}: seeking back hides later labels`);
      }
    }
    assert.equal(JSON.stringify(lab.s), before, 'drawing and seeking never reset live controls or choices');
  }
});

test('corresponding and alternate angle copies retain their shape and reach the correct native angle', async () => {
  const lab = await load(); lab.go('p1-1');
  for (const theta of [45, 65, 90, 115, 135]) for (const x of [-1.8, 0, 1.8]) {
    Object.assign(lab.s, { pT: theta, pX: x });
    for (const [kind, targets] of [['corr', 'abcdefgh'], ['alt', 'cdef']]) for (const target of targets) {
      Object.assign(lab.s, { pKind: kind, pTar: target });
      const p = plans(lab).find(p => p.model.kind === kind), m = p.model, source = m.G.G.W[m.from], targetWedge = m.G.G.W[m.to];
      assert.equal(m.from, target, 'current target letter is retained');
      near(measured(source), measured(targetWedge));
      const sourceChord = dist(endpoint(source.V, source.d1), endpoint(source.V, source.d2));
      for (const u of [0, .2, .5, .8, 1]) {
        const pose = shorts.pose(source, targetWedge.V, kind === 'alt' ? 180 : 0, u);
        near(measured(pose), measured(source)); near(dist(endpoint(pose.V, pose.d1), endpoint(pose.V, pose.d2)), sourceChord);
        if (u === 1) {
          near(dist(pose.V, targetWedge.V), 0);
          const a = endpoint(pose.V, pose.d1), z = endpoint(pose.V, pose.d2), ta = endpoint(targetWedge.V, targetWedge.d1), tz = endpoint(targetWedge.V, targetWedge.d2);
          near(Math.min(dist(a, ta) + dist(z, tz), dist(a, tz) + dist(z, ta)), 0);
        }
      }
    }
  }
});

test('parallel angle-size targets use the actual given and ask letters, including supplementary pairs', async () => {
  const lab = await load(); lab.go('p1-2');
  for (const theta of [45, 90, 135]) for (const phi of [-25, 14, 25]) for (const given of 'abcd') for (const ask of 'efgh') {
    Object.assign(lab.s, { qT: theta, qPhi: phi, qGiven: given, qAsk: ask });
    const snapshot = JSON.stringify(lab.s), p = plans(lab).find(p => p.legacyLabel === '각크기'), m = p.model;
    const nativeQuestion = lab.scene.pa.model({ ...lab.s, qPhi: 0 });
    near(m.answer, measured(nativeQuestion.G.W[ask]));
    assert.equal(m.from, given); assert.equal(m.to, ask); assert.equal(m.proof.phi, 0);
    assert.ok(p.given.includes('l ∥ m'), 'the numeric question explicitly supplies parallel lines');
    assert.equal(JSON.stringify(lab.s), snapshot, 'imposing the question condition is proof-local');
    if (m.relation === 'straight') {
      near(measured(m.proof.W[given]) + m.answer, 180);
      near(measured(m.straight), 180);
      const joined = [m.proof.W[m.carried], m.proof.W[ask]], flat = shorts.sector(m.straight);
      // Both component interiors must lie in the displayed half-plane. A
      // horizontal 180° arc is wrong when the outer rays are the transversal.
      for (const w of joined) {
        const part = shorts.sector(w), middle = ((part.start + part.sweep / 2 - flat.start) % 360 + 360) % 360;
        assert.ok(middle >= -1e-8 && middle <= 180 + 1e-8);
      }
    }
    else near(measured(m.proof.W[given]), m.answer);
  }
});

test('judgement uses the current five choices and does not confuse a 180-degree sum with equality', async () => {
  const lab = await load(); lab.go('p1-3');
  for (const p of [50, 70, 90, 110, 130]) for (const kind of ['corr', 'alt']) {
    Object.assign(lab.s, { rA: p, rB: 80, rMode: kind });
    const listBefore = JSON.stringify(lab.s.rList), clips = plans(lab), trap = clips[1].model, five = clips[2].model;
    assert.equal(trap.p, p); assert.equal(trap.q, 180 - p); assert.equal(trap.equal, p === 90);
    near(measured(trap.proof.W[trap.from]), trap.p); near(measured(trap.proof.W.f), trap.q);
    assert.deepEqual(five.cases.map(q => [q.kind, q.vP, q.vQ]), Array.from(lab.s.rList, q => [q.kind, q.vP, q.vQ]));
    assert.deepEqual(five.answer, Array.from(lab.s.rList).flatMap((q, i) => q.vP === q.vQ ? [i + 1] : []));
    assert.equal(JSON.stringify(lab.s.rList), listBefore);
    lab.scene.pa.reroll(lab.s);
  }
});

test('bends and zigzags agree with direct vector angles for changed controls and every target location', async () => {
  const lab = await load();
  lab.go('p2-1');
  Object.assign(lab.s, { bA: 75, bB: 65, bP: -.4 });
  for (const p of plans(lab)) near(p.model.answer, rayAngle(p.model.G.A, p.model.G.P, p.model.G.B));
  lab.go('p2-3');
  Object.assign(lab.s, { cA: 32, cB: 71, cP: 1.4, cDir: -1, cPsi: -37 });
  const source = JSON.stringify(lab.s);
  for (const p of plans(lab).slice(1)) {
    const G = p.model.G;
    near(p.model.answer, rayAngle(G.A, G.P, G.B)); near(G.a, 32); near(G.b, 71);
    assert.equal(Math.sign(G.P.x), G.sx); // positive native cP retained under the named side variant
  }
  assert.equal(JSON.stringify(lab.s), source);
  lab.go('p2-2');
  Object.assign(lab.s, { uA: 31, uB: 76, uC: 43, uD: 68 });
  for (let target = 0; target <= 4; target++) {
    lab.s.zTar = target;
    for (const p of plans(lab)) {
      const m = p.model, G = m.G;
      const R = G.W.filter(w => w.side === 'R').reduce((sum, w) => sum + measured(w), 0);
      const L = G.W.filter(w => w.side === 'L').reduce((sum, w) => sum + measured(w), 0);
      near(R, L); near(m.answer, measured(G.W[G.tar]));
      assert.deepEqual([...m.right].sort(), Array.from({ length: G.k + 1 }, (_, j) => j));
      assert.deepEqual([...m.left].sort(), Array.from({ length: G.k + 1 }, (_, j) => j));
      assert.equal(G.tar, Math.min(target, G.k + 1));
    }
  }
});

test('regular-polygon proofs use actual n and tilt; independent side/interior geometry verifies subtraction', async () => {
  const lab = await load();
  lab.go('p3-1');
  for (const a of [10, 24, 50]) {
    Object.assign(lab.s, { tA: a, tX: .4 });
    const p = plans(lab)[1], G = p.model.G;
    near(dist(G.A, G.B), dist(G.B, G.C)); near(dist(G.B, G.C), dist(G.C, G.A));
    near(rayAngle(G.B, G.A, G.C), 60); near(p.model.answer, rayAngle(endpoint(G.C, 0), G.C, G.A));
  }
  for (const [id, nkey, tkey, ns] of [['p3-2', 'gN', 'gT', [4, 5, 6]], ['p3-3', 'hN', 'hT', [5, 6, 8]]]) {
    lab.go(id);
    for (const n of ns) for (const tilt of [0, 40, 100]) {
      Object.assign(lab.s, { [nkey]: n, [tkey]: tilt });
      const p = plans(lab)[1], G = p.model.G, V = G.V;
      assert.equal(G.n, n);
      for (let i = 0; i < n; i++) {
        near(dist(V[i], V[(i + 1) % n]), dist(V[0], V[1]));
        near(rayAngle(V[(i + n - 1) % n], V[i], V[(i + 1) % n]), G.I);
      }
      near(V[0].y, -1.7); near(V[G.end].y, 1.7);
      const direct = rayAngle(endpoint(V[G.end], 0), V[G.end], V[G.end - 1]);
      near(p.model.answer, direct);
      if (id === 'p3-3') {
        const c = rayAngle(endpoint(V[1], 180), V[1], V[2]), d = rayAngle(endpoint(V[2], 180), V[2], V[1]);
        near(c + d, 180); near(G.a + direct, rayAngle(V[0], V[1], V[2]) + rayAngle(V[1], V[2], V[3]) - c - d);
      } else near(G.a + direct, rayAngle(V[0], V[1], V[2]));
    }
  }
});

test('paper motion is a rigid 3-D hinge with fixed crease and exact native reflected endpoints', async () => {
  const lab = await load();
  for (const id of ['p4-1', 'p4-2', 'p4-3']) {
    lab.go(id);
    for (const controls of id === 'p4-1' ? [{ fA: 40, fX: -2.4 }, { fA: 55, fX: -1.2 }, { fA: 70, fX: -.2 }] : id === 'p4-2' ? [{ kA: 15, kW: 3 }, { kA: 30, kW: 4.2 }] : [{ k2A: 8, k2B: 20, kW: 3 }, { k2A: 20, k2B: 20, kW: 4.2 }]) {
      Object.assign(lab.s, controls, { pat: .37 });
      const before = JSON.stringify(lab.s), clips = plans(lab), G = clips[0].model.G;
      const folds = id === 'p4-1' ? [[G.B, G.u, [G.B, G.C, G.F, G.E], [G.B, G.C]]] : [[G.A, G.u1, [G.A, G.B, G.E1], [G.A, G.E1]], ...(G.two ? [[G.A, G.u2, [G.A, G.D, G.F2], [G.A, G.F2]]] : [])];
      for (const [origin, u, polygon, crease] of folds) for (const f of [0, .13, .37, .5, .82, 1]) {
        const rotated = polygon.map(p => shorts.spin(p, origin, u, f));
        polygon.forEach((p, i) => near(dist(p, polygon[(i + 1) % polygon.length]), dist(rotated[i], rotated[(i + 1) % polygon.length])));
        crease.forEach(p => near(dist(p, shorts.spin(p, origin, u, f)), 0));
      }
      if (id === 'p4-1') {
        const reflected = shorts.spin(G.E, G.B, G.u, 1);
        near(rayAngle(G.C, G.B, reflected), rayAngle(G.E, G.B, G.C));
        near(rayAngle(G.A, G.B, reflected), 0, 1e-6);
        near(dist(G.A, G.B), dist(G.A, G.C));
        near(clips.at(-1).model.answer, rayAngle(G.B, G.A, G.C));
      } else {
        near(dist(shorts.spin(G.B, G.A, G.u1, 1), G.B1), 0);
        if (G.two) near(dist(shorts.spin(G.D, G.A, G.u2, 1), G.D2), 0);
        near(clips.at(-1).model.answer, rayAngle(G.B1, G.A, G.two ? G.D2 : G.D));
      }
      for (const p of clips) for (const t of [0, 1.35, 2.6, 3.6, 4.5, 5.6, p.duration]) capture(lab.board, p, t);
      assert.equal(JSON.stringify(lab.s), before);
    }
  }
});
