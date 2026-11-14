import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/polygons-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const shorts = require('../kit/apl-g7-short-polygons.js');
const near = (a, b, eps = 1e-7) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), `${a} != ${b}`);
const length = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// These checks measure the actual source geometry, independently of the proof's
// angle helper and formula text. The shoelace and dot-product methods are not
// copied from the native question's displayed answer.
const measuredAngle = (v, a, b) => {
  const ax = a.x - v.x, ay = a.y - v.y, bx = b.x - v.x, by = b.y - v.y;
  return Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (Math.hypot(ax, ay) * Math.hypot(bx, by))))) * 180 / Math.PI;
};
const area = V => Math.abs(V.reduce((s, p, i) => { const q = V[(i + 1) % V.length]; return s + p.x * q.y - p.y * q.x; }, 0)) / 2;
const signedArea = V => V.reduce((s, p, i) => { const q = V[(i + 1) % V.length]; return s + p.x * q.y - p.y * q.x; }, 0) / 2;

function legacyLessons() {
  const context = {}; context.window = context; vm.createContext(context);
  for (const f of ['lesson-a.js', 'lesson-b.js', 'lesson-c.js']) {
    vm.runInContext(fs.readFileSync(new URL(`../labs/g7-polygons/${f}`, import.meta.url), 'utf8'), context, { filename: f });
  }
  return context.APL_LESSONS['g7-polygons'];
}
function plans(lab, id, values = {}) {
  lab.go(id); Object.assign(lab.s, values);
  const before = JSON.stringify(lab.s), output = shorts.registry[`g7-polygons/${id}`](lab, lab.s);
  assert.equal(JSON.stringify(lab.s), before, `${id}: building must not reset current values`);
  return output;
}
function capture(board, plan, t) {
  const texts = [], paths = [], originalText = board._text, originalPath = board.path;
  board._text = function (x, y, text, options = {}, ...rest) {
    if (text != null) texts.push({ x, y, text: String(text), options });
    return originalText.call(this, x, y, text, options, ...rest);
  };
  board.path = function (points, options = {}) {
    paths.push(points.map(p => board.toS(p)));
    return originalPath.call(this, points, options);
  };
  try { board.begin(); plan.draw(board, t, plan.model); board.end(); return { texts, paths }; }
  finally { board._text = originalText; board.path = originalPath; }
}

test('all 18 actual polygon screens and 31 registered labels have individual short proofs and TOC metadata', async () => {
  const lab = await load(), lessons = legacyLessons();
  assert.equal(lab.list.length, 18); assert.equal(Object.keys(shorts.registry).length, 18);
  let count = 0;
  for (const scene of lab.list) {
    const result = plans(lab, scene.id);
    const legacy = Array.isArray(lessons[scene.id]) ? lessons[scene.id] : [lessons[scene.id]];
    assert.deepEqual(result.map(p => p.legacyLabel).sort(), Array.from(legacy, p => p.label).sort());
    assert.deepEqual(shorts.lessonInfo[`g7-polygons/${scene.id}`].map(x => x.legacyLabel).sort(), result.map(x => x.legacyLabel).sort());
    const ids = new Set();
    for (const plan of result) {
      count++; assert.ok(!ids.has(plan.id)); ids.add(plan.id);
      assert.ok(plan.duration > 0 && plan.duration <= 10); assert.ok(plan.motion);
      assert.ok(plan.given); assert.ok(plan.stops.every(x => x >= 0 && x <= plan.duration));
      assert.equal(plan.frame(0, plan.model).formula, '', `${plan.id}: no conclusion at entry`);
      assert.notEqual(plan.frame(0, plan.model).label, plan.frame(plan.duration, plan.model).label);
      assert.ok(capture(lab.board, plan, 0).paths.length > 0, `${plan.id}: the given diagram is visible at t=0`);
    }
  }
  assert.equal(count, 31);
  const context = { window: { APLab: {} } }; vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-g7-short-polygons.js', import.meta.url), 'utf8'), context);
  assert.equal(Object.keys(context.window.APLab.G7Shorts).length, 18);
  assert.equal(Object.keys(context.window.APLab.G7ShortInfo).length, 18);
});

test('diagonal incidence counting and fan partitions are independently valid for all vertex choices', async () => {
  const lab = await load();
  for (let n = 3; n <= 12; n++) {
    const V = lab.api.regUp(n, 1), pairs = shorts.diagonalPairs(n), incidences = Array(n).fill(0), unique = new Set();
    pairs.forEach(([i, j]) => {
      assert.ok(j > i && j - i > 1 && !(i === 0 && j === n - 1));
      assert.ok(!unique.has(`${i},${j}`)); unique.add(`${i},${j}`); incidences[i]++; incidences[j]++;
    });
    assert.ok(incidences.every(x => x === n - 3)); assert.equal(incidences.reduce((a, b) => a + b, 0), pairs.length * 2);
    for (let v = 0; v < n; v++) {
      const triangles = shorts.fanTriangles(V, v);
      assert.equal(triangles.length, n - 2); near(triangles.reduce((s, tri) => s + area(tri), 0), area(V));
      assert.ok(triangles.every(tri => signedArea(tri) > 0));
      const all = plans(lab, 'p1-one', { pgN: n, pgV: v });
      assert.ok(all.every(p => p.model.m.n === n && p.model.m.v === v));
    }
  }
  for (const target of [9, 14, 20, 27, 35, 44, 54]) {
    const p = plans(lab, 'p1-find', { pgM: target, pgN: 4 })[0], m = p.model.m;
    assert.equal(shorts.diagonalPairs(m.ns).length, target); assert.equal(m.n, 4);
    assert.equal(lab.s.pgN, 4, 'trying another candidate is confined to the proof');
  }
});

test('moving angle sectors preserve their opening and every chord throughout rotation and translation', async () => {
  const lab = await load();
  const p = plans(lab, 'p2-ext', { pgEa: 78, pgEb: 33 })[0], { A, B, C } = p.model.m.tri;
  const source = shorts.angle(A, B, C), vertices = shorts.sectorPoints(source, .4);
  for (const u of [0, .17, .5, .83, 1]) {
    const w = shorts.transport(source, { x: 1.2, y: .3 }, 317, u), moved = shorts.sectorPoints(w, .4);
    near(w.sweep, 78); assert.equal(moved.length, vertices.length);
    for (let i = 0; i < vertices.length; i++) for (let j = i + 1; j < vertices.length; j++) near(length(vertices[i], vertices[j]), length(moved[i], moved[j]));
    near(measuredAngle(w.c, moved[1], moved.at(-1)), 78);
  }
});

test('triangle exterior, star regrouping, all three bisectors, and chained isosceles angles match measured geometry', async () => {
  const lab = await load();
  for (const a of [30, 50, 80]) for (const b of [30, 45, 65]) {
    const m = plans(lab, 'p2-ext', { pgEa: a, pgEb: b })[0].model.m, { A, B, C } = m.tri;
    near(measuredAngle(A, B, C), a); near(measuredAngle(B, A, C), b);
    near(measuredAngle(C, A, { x: C.x + 1, y: C.y }), a + b);
  }
  for (const a of [30, 35, 40]) for (const b of [30, 40]) for (const c of [30, 40]) for (const d of [30, 40]) {
    const m = plans(lab, 'p2-star', { pgSa: a, pgSb: b, pgSc: c, pgSd: d })[0].model.m;
    const { A, B, C, D, E, P, S } = m.pts;
    [measuredAngle(A, D, C), measuredAngle(B, E, D), measuredAngle(C, A, E), measuredAngle(D, B, A), measuredAngle(E, C, B)].forEach((value, i) => near(value, [a, b, c, d, m.e][i]));
    near(measuredAngle(P, A, S), c + m.e); near(measuredAngle(S, A, P), b + d);
    near(measuredAngle(A, P, S) + measuredAngle(P, A, S) + measuredAngle(S, A, P), 180);
  }
  for (const a of [40, 64, 90]) for (const b of [40, 50, 60]) for (const k of [1, 2, 3]) {
    const result = plans(lab, 'p2-bis', { pgKa: a, pgKb: b, pgK: k });
    assert.equal(result[0].model.variant, k, 'current bisector kind comes first');
    result.forEach(p => {
      const m = p.model.m, { A, B, C, X, extB, extC, F } = m.g;
      assert.equal(m.a, a); assert.equal(m.bb, b); assert.equal(lab.s.pgK, k);
      near(measuredAngle(X, B, C), m.x); near(measuredAngle(A, B, C), a);
      if (m.k === 1) { near(measuredAngle(B, C, X), b / 2); near(measuredAngle(C, B, X), m.c / 2); }
      if (m.k === 2) { near(measuredAngle(B, C, X), (180 - b) / 2); near(measuredAngle(C, B, X), (180 - m.c) / 2); near(measuredAngle(B, X, extB), (180 - b) / 2); near(measuredAngle(C, X, extC), (180 - m.c) / 2); }
      if (m.k === 3) near(measuredAngle(C, X, F), measuredAngle(B, C, X) + measuredAngle(X, B, C));
    });
  }
  for (let x = 14; x <= 20; x++) {
    const m = plans(lab, 'p2-chain', { pgCx: x })[0].model.m, { A, B, C, D, E, F } = m.p;
    near(length(A, B), length(B, C)); near(length(B, C), length(C, D)); near(length(C, D), length(D, E)); near(length(D, E), length(E, F));
    near(measuredAngle(A, B, C), x); near(measuredAngle(B, C, D), 2 * x); near(measuredAngle(C, D, E), 3 * x); near(measuredAngle(D, E, F), 4 * x);
  }
  for (const b of [40, 54, 70]) {
    const m = plans(lab, 'p2-iso', { pgIb: b })[0].model.m;
    near(length(m.A, m.B), length(m.A, m.C)); near(length(m.A, m.C), length(m.C, m.D));
    near(measuredAngle(m.D, m.A, m.C) * 2, b);
  }
});

test('interior point and concave fans cover the exact given area, with flat and reflex cases retained', async () => {
  const lab = await load();
  for (let n = 3; n <= 12; n++) for (const [x, y] of [[0, 0], [.4, -.2], [-.7, .5]]) {
    const m = plans(lab, 'p3-inO', { pgOn: n, pgOx: x, pgOy: y })[0].model.m;
    const triangles = m.V.map((v, i) => [m.O, v, m.V[(i + 1) % n]]);
    assert.ok(triangles.every(tri => signedArea(tri) > 0)); near(triangles.reduce((sum, tri) => sum + area(tri), 0), area(m.V));
    near(m.V.reduce((sum, v, i) => sum + measuredAngle(m.O, v, m.V[(i + 1) % n]), 0), 360);
  }
  for (const n of [4, 5, 6]) for (const f of [0, .14, (Math.cos(2 * Math.PI / n) + .5) / 1.5, .7, 1]) {
    const all = plans(lab, 'p3-concave', { pgCn: n, pgCf: f }), m = all[0].model.m;
    const triangles = shorts.fanTriangles(m.g.V);
    near(triangles.reduce((sum, tri) => sum + area(tri), 0), area(m.g.V));
    near(measuredAngle(m.g.V[0], m.g.V.at(-1), m.g.V[1]), m.x);
    assert.equal(all[1].model.m.g.concave, m.g.concave);
    if (m.g.flat) assert.match(all[1].frame(9.6, all[1].model).formula, /180/);
  }
});

test('unequal exterior sectors and given/mixed pentagon conditions close one actual full turn', async () => {
  const lab = await load();
  for (let n = 3; n <= 12; n++) {
    const m = plans(lab, 'p3-ext360', { pgXn: n })[0].model.m, wedges = shorts.exteriorWedges(m.V);
    near(wedges.reduce((s, w) => s + w.sweep, 0), 360);
    wedges.forEach((w, i) => near(w.sweep, m.eps[i]));
  }
  for (const id of ['p3-given', 'p3-mixed']) for (const offset of [0, 1, 2]) {
    lab.go(id);
    const keys = id === 'p3-given' ? ['pgGa', 'pgGb', 'pgGc', 'pgGd'] : ['pgMa', 'pgMb', 'pgMc', 'pgMd'];
    const values = Object.fromEntries(keys.map(k => [k, offset === 0 ? lab.params[k].min : offset === 1 ? lab.params[k].value : lab.params[k].max]));
    const p = plans(lab, id, values)[0], m = p.model.m, wedges = shorts.exteriorWedges(m.V);
    wedges.forEach((w, i) => near(w.sweep, m.eps[i]));
    near(wedges.reduce((s, w) => s + w.sweep, 0), 360);
    near(measuredAngle(m.V[4], m.V[3], m.V[0]), m.x);
    m.given.forEach((g, i) => near(g.v, g.kind === 'ext' ? wedges[i].sweep : 180 - wedges[i].sweep));
  }
});

test('regular polygon angle, ratio validity, diagonal intersections and all joined combinations match geometry', async () => {
  const lab = await load();
  for (let n = 3; n <= 20; n++) {
    const m = plans(lab, 'p4-reg', { pgRn: n })[0].model.m, V = lab.api.regUp(n, 1);
    near(measuredAngle(V[0], V.at(-1), V[1]), m.I); near(shorts.exteriorWedges(V)[0].sweep, m.e);
    const fraction = shorts.frac(m.I).split('/').map(Number); near(fraction.length === 1 ? fraction[0] : fraction[0] / fraction[1], m.I);
  }
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 4; b++) {
    const m = plans(lab, 'p4-ratio', { pgQa: a, pgQb: b })[0].model.m;
    const matching = Array.from({ length: 58 }, (_, i) => i + 3).filter(n => Math.abs((180 - 360 / n) / (360 / n) - a / b) < 1e-8);
    assert.equal(m.valid, matching.length === 1);
    const turn = shorts.ratioTurns(m); near(turn.complete * m.eps + turn.remainder, 360);
    if (m.valid) { assert.equal(m.nn, matching[0]); near(turn.remainder, 0); }
    else assert.ok(turn.remainder > 1e-8 || m.nn < 3);
  }
  for (let n = 5; n <= 12; n++) for (const v of [0, n - 1]) {
    const m = plans(lab, 'p4-diag', { pgDn: n, pgDv: v })[0].model.m;
    near(measuredAngle(m.P, m.A, m.B), m.x); near(measuredAngle(m.A, m.B, m.C), m.h); near(measuredAngle(m.B, m.A, m.D), m.ab);
    for (const k of [2, Math.min(4, n - 2)]) {
      const fan = plans(lab, 'p4-fan', { pgFn: n, pgFv: v, pgFk: k })[0].model.m;
      for (let j = 1; j <= n - 2; j++) near(measuredAngle(fan.at(0), fan.at(j), fan.at(j + 1)), fan.h);
      near(measuredAngle(fan.at(0), fan.at(1), fan.at(k + 1)), fan.kk);
    }
  }
  for (let n = 3; n <= 8; n++) for (let k = 3; k <= 8; k++) {
    const result = plans(lab, 'p4-join', { pgJn: n, pgJm: k, pgJl: 7 });
    result.forEach(p => { assert.equal(p.model.m.n, n); assert.equal(p.model.m.m, k); assert.equal(p.model.m.L, 7); });
    const m = result[0].model.m, { A, B, P, Q } = m.g;
    near(length(A, P), length(A, Q)); near(length(A, B), length(A, P)); near(measuredAngle(A, P, Q), m.x);
    if (m.valid) near(measuredAngle(P, A, Q), m.base);
    else near(Math.abs((P.x - A.x) * (Q.y - A.y) - (P.y - A.y) * (Q.x - A.x)), 0);
    assert.match(result[2].given, new RegExp(`정${n}각형·정${k}각형`));
  }
});

test('production Board draws all new proofs and dangerous state boundaries at four screen sizes without resets or off-canvas geometry', async () => {
  const lab = await load();
  const cases = lab.list.map(s => [s.id, {}]).concat([
    ['p1-one', { pgN: 3 }], ['p1-all', { pgN: 12 }], ['p1-find', { pgM: 54, pgN: 3 }],
    ['p2-ext', { pgEa: 80, pgEb: 65 }], ['p2-star', { pgSa: 40, pgSb: 40, pgSc: 40, pgSd: 40 }],
    ['p2-bis', { pgKa: 90, pgKb: 40, pgK: 3 }], ['p2-bis', { pgKa: 40, pgKb: 60, pgK: 2 }],
    ['p2-chain', { pgCx: 20 }], ['p2-iso', { pgIb: 40 }], ['p3-inO', { pgOn: 12, pgOx: .6, pgOy: .3 }],
    ['p3-concave', { pgCn: 6, pgCf: 0 }], ['p3-concave', { pgCn: 4, pgCf: 1 / 3 }],
    ['p3-concave', { pgCn: 5, pgCf: 1 }], ['p3-ext360', { pgXn: 3 }], ['p3-ext360', { pgXn: 12 }],
    ['p4-reg', { pgRn: 20 }], ['p4-reg', { pgRn: 7 }], ['p4-ratio', { pgQa: 1, pgQb: 4 }],
    ['p4-ratio', { pgQa: 9, pgQb: 1 }], ['p4-ratio', { pgQa: 2, pgQb: 3 }],
    ['p4-join', { pgJn: 3, pgJm: 3 }], ['p4-join', { pgJn: 4, pgJm: 4 }], ['p4-join', { pgJn: 3, pgJm: 8 }],
    ['p4-fan', { pgFn: 12, pgFv: 9, pgFk: 4 }]
  ]);
  for (const [width, height] of [[1440, 900], [820, 1180], [1024, 768], [390, 844]]) {
    lab.setViewportWidth(width); lab.board.resize(width, height);
    for (const [id, values] of cases) {
      const result = plans(lab, id, values), before = JSON.stringify(lab.s);
      for (const p of result) for (const t of [0, .8, 2.5, 4.5, 5.9, 6.6, 7.3, 9.6]) {
        const output = capture(lab.board, p, t), prefix = `${id}/${p.legacyLabel} ${width}×${height} t=${t}`;
        for (const path of output.paths) for (const q of path) {
          assert.ok(Number.isFinite(q.x) && Number.isFinite(q.y), prefix);
          assert.ok(q.x >= -2 && q.x <= width + 2 && q.y >= -2 && q.y <= height + 2, `${prefix}: geometry outside Board (${q.x},${q.y})`);
        }
        for (const text of output.texts) {
          assert.ok(Number.isFinite(text.x) && Number.isFinite(text.y), prefix);
          assert.ok(text.x >= 0 && text.x <= width && text.y >= 0 && text.y <= height, `${prefix}: label anchor outside Board: ${text.text}`);
          assert.ok(!/NaN|Infinity|undefined/.test(text.text), `${prefix}: invalid label`);
        }
        const frame = p.frame(t, p.model);
        assert.ok(!/NaN|Infinity|undefined/.test(frame.label + frame.formula), `${prefix}: invalid caption`);
      }
      assert.equal(JSON.stringify(lab.s), before, `${id}: drawing leaves student state unchanged`);
    }
  }
});
