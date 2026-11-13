import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/spatial-lesson-runtime.mjs';

const shorts = createRequire(import.meta.url)('../kit/apl-g7-short-spatial.js');
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, eps = 1e-7) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), `${a} != ${b}`);
const vector = (a, b) => [b.x - a.x, b.y - a.y, b.z - a.z];
const coordinates = p => [p.x, p.y, p.z];
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const magnitude = a => Math.hypot(...a);
const distance = (a, b) => magnitude(vector(a, b));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const direction = l => vector(l.p, l.q);
const normal = points => {
  const n = cross(vector(points[0], points[1]), vector(points[0], points[2]));
  return n.map(x => x / magnitude(n));
};
const signedDistance = (points, p) => dot(normal(points), vector(points[0], p));
const combinations = (n, k, prefix = [], start = 0) => k === 0 ? [prefix] : Array.from({ length: Math.max(0, n - start - k + 1) }, (_, offset) => combinations(n, k - 1, [...prefix, start + offset], start + offset + 1)).flat();

// Gaussian elimination is independent of the proof's scalar-triple-product
// classifier. Equal ranks decide whether two infinite lines can meet, including
// intersections outside the displayed segments.
function rank(rows) {
  const matrix = rows.map(row => row.slice()); let pivot = 0;
  for (let col = 0; col < 3 && pivot < matrix.length; col++) {
    let best = pivot;
    for (let i = pivot + 1; i < matrix.length; i++) if (Math.abs(matrix[i][col]) > Math.abs(matrix[best][col])) best = i;
    if (Math.abs(matrix[best][col]) < 1e-11) continue;
    [matrix[pivot], matrix[best]] = [matrix[best], matrix[pivot]];
    const value = matrix[pivot][col]; matrix[pivot] = matrix[pivot].map(x => x / value);
    for (let i = 0; i < matrix.length; i++) if (i !== pivot) {
      const factor = matrix[i][col]; matrix[i] = matrix[i].map((x, j) => x - factor * matrix[pivot][j]);
    }
    pivot++;
  }
  return pivot;
}
function independentRelation(a, b, c, d) {
  const u = vector(a, b), v = vector(c, d), w = vector(a, c), directions = rank([u, v]), withOffset = rank([u, v, w]);
  return directions === 1 ? withOffset === 1 ? 'same' : 'parallel' : withOffset === 2 ? 'meet' : 'skew';
}
function independentPlaneGroups(sol) {
  const result = new Map();
  for (const ids of combinations(sol.order.length, 3)) {
    const names = ids.map(i => sol.order[i]), points = names.map(n => sol.verts[n]);
    if (rank([vector(points[0], points[1]), vector(points[0], points[2])]) < 2) continue;
    const members = sol.order.filter(n => rank([vector(points[0], points[1]), vector(points[0], points[2]), vector(points[0], sol.verts[n])]) === 2);
    const key = members.slice().sort().join(','); result.set(key, (result.get(key) || 0) + 1);
  }
  return result;
}
function legacyLessons() {
  const context = {}; context.window = context; vm.createContext(context);
  for (const file of ['lesson-a.js', 'lesson-b.js', 'lesson-c.js']) vm.runInContext(fs.readFileSync(new URL(`../labs/g7-spatial/${file}`, import.meta.url), 'utf8'), context, { filename: file });
  return context.APL_LESSONS['g7-spatial'];
}
function plans(lab, id, values = {}) {
  lab.go(id); Object.assign(lab.s, plain(values));
  const saved = JSON.stringify(lab.s), output = shorts.registry[`g7-spatial/${id}`](lab, lab.s);
  assert.equal(JSON.stringify(lab.s), saved, `${id}: building preserves the student's state`);
  return output;
}
function capture(board, plan, t) {
  const paths = [], texts = [], originalPath = board.path, originalText = board._text;
  board.path = function (points, options = {}) { paths.push({ points: points.map(p => board.toS(p)), options }); return originalPath.call(this, points, options); };
  board._text = function (x, y, text, options, screen) { if (text != null) texts.push({ x, y, text: String(text), options, screen }); return originalText.call(this, x, y, text, options, screen); };
  try { board.begin(); plan.draw(board, t, plan.model); board.end(); return { paths, texts }; }
  finally { board.path = originalPath; board._text = originalText; }
}

test('all 27 native spatial scenes and 62 actual labels have short plans, metadata, and complete entry geometry', async () => {
  const lab = await load(), lessons = legacyLessons();
  assert.equal(lab.list.length, 27); assert.equal(Object.keys(shorts.registry).length, 27);
  let count = 0; const ids = new Set();
  for (const scene of lab.list) {
    const result = plans(lab, scene.id), legacy = Array.isArray(lessons[scene.id]) ? lessons[scene.id] : [lessons[scene.id]];
    assert.deepEqual(result.map(p => p.legacyLabel).sort(), Array.from(legacy, p => p.label || '').sort());
    assert.deepEqual(shorts.lessonInfo[`g7-spatial/${scene.id}`].map(x => x.legacyLabel).sort(), result.map(x => x.legacyLabel).sort());
    for (const p of result) {
      count++; assert.ok(!ids.has(p.id)); ids.add(p.id);
      assert.ok(p.duration > 0 && p.duration <= 9.8); assert.ok(p.motion && p.given && p.title && p.label);
      assert.ok(p.stops.every(t => t >= 0 && t <= p.duration));
      assert.equal(p.frame(0, p.model).formula, '', `${p.id}: no answer on entry`);
      assert.ok(p.frame(p.duration, p.model).formula, `${p.id}: a delayed conclusion exists`);
      assert.ok(capture(lab.board, p, 0).paths.length > 0, `${p.id}: entry geometry is visible`);
    }
  }
  assert.equal(count, 62);
  const context = { window: { APLab: {} } }; vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-g7-short-spatial.js', import.meta.url), 'utf8'), context);
  assert.equal(Object.keys(context.window.APLab.G7Shorts).length, 27);
  assert.equal(Object.keys(context.window.APLab.G7ShortInfo).length, 27);
});

test('every solid edge relation agrees with independent line-system ranks, including extensions and current prism size', async () => {
  const lab = await load();
  const solids = ['cuboid', 'tri', 'trap', 'pyr4', 'tetra'].map(kind => lab.api.buildSolid(kind, 4)).concat(Array.from({ length: 6 }, (_, i) => lab.api.buildSolid('prism', i + 3)));
  let extensionCount = 0;
  for (const sol of solids) for (const ref of sol.edges) {
    const groups = shorts.classifyEdges(sol, ref), a = sol.verts[ref.u], b = sol.verts[ref.v];
    assert.equal(Object.values(groups).flat().length, sol.edges.length - 1);
    const unique = new Set();
    for (const [kind, edges] of Object.entries(groups)) for (const e of edges) {
      assert.ok(!unique.has(e.key)); unique.add(e.key);
      const c = sol.verts[e.u], d = sol.verts[e.v], independent = independentRelation(a, b, c, d);
      assert.equal(kind === 'ext' ? 'meet' : kind, independent, `${sol.name} ${ref.name}/${e.name}`);
      if (kind === 'meet' || kind === 'ext') {
        const point = shorts.lineIntersection(a, b, c, d); assert.ok(point);
        assert.equal(rank([vector(a, b), vector(a, point)]), 1);
        assert.equal(rank([vector(c, d), vector(c, point)]), 1);
      }
      if (kind === 'ext') { extensionCount++; assert.ok(![e.u, e.v].some(n => n === ref.u || n === ref.v)); }
    }
  }
  assert.ok(extensionCount > 0, 'same-plane extension intersections are exercised');
  for (let n = 3; n <= 8; n++) {
    const result = plans(lab, 's1-7', { spN: n, spRef: 's2', spTgt: 't1', spSeed: 9341 });
    assert.ok(result.every(p => p.model.sol.n === n));
    assert.equal(result[1].model.ref.key, 's2', 'the current lateral reference is retained');
    assert.equal(result[1].model.answer, 2 * n - 4);
    assert.equal(result[0].model.answer, n % 2 ? 2 * n - 3 : 2 * n - 4);
    assert.equal(result[2].model.ref.key, 's2'); assert.equal(result[2].model.target.key, 't1');
    assert.equal(result[2].model.relation, independentRelation(...[result[2].model.ref, result[2].model.target].flatMap(e => [result[2].model.sol.verts[e.u], result[2].model.sol.verts[e.v]])));
    assert.equal(lab.s.spSeed, 9341);
  }
  const trap = plans(lab, 's1-3')[0].model;
  assert.equal(trap.groups.ext.length, 1); assert.equal(trap.answer, 5);
  const same = plans(lab, 's1-7', { spN: 4, spRef: 't2', spTgt: 't2' })[2];
  assert.equal(same.model.relation, 'same'); capture(lab.board, same, 9.8);
});

test('current statement controls lead to valid counterexamples or constrained proofs without changing the live controls', async () => {
  const lab = await load();
  for (const id of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'perp', 'door', 'planes']) for (const a of [0, .5, 1]) for (const b of [0, .5, 1]) {
    const st = lab.api.stmt.STM[id], s = { ...lab.s, [st.keys[0]]: a, ...(st.keys[1] ? { [st.keys[1]]: b } : {}) }, before = JSON.stringify(s);
    const data = shorts.statementData({ G: lab.api, s }, id), end = shorts.statementPose(data, 1), lines = Object.fromEntries(end.lines.filter(l => l.name).map(l => [l.name, l]));
    assert.equal(data.initial.a, a); assert.equal(data.initial.b, st.keys[1] ? b : 0);
    assert.equal(end.given, true, `${id}: the final hypothesis holds`); assert.equal(end.holds, st.truth, `${id}: actual final conclusion matches truth`);
    assert.equal(JSON.stringify(s), before);
    for (const r of end.rights) near(dot(coordinates(r.a), coordinates(r.c)), 0);
    if (id === 'p1') {
      near(dot(direction(lines.l), direction(lines.m)), 0); near(dot(direction(lines.l), direction(lines.n)), 0);
      assert.ok(['meet', 'skew'].includes(independentRelation(lines.m.p, lines.m.q, lines.n.p, lines.n.q)));
    } else if (id === 'p2') {
      for (const l of [lines.l, lines.m]) { near(dot(direction(l), normal(end.panels[0].pts)), 0); assert.ok(Math.abs(signedDistance(end.panels[0].pts, l.p)) > .1); }
      assert.ok(['meet', 'skew'].includes(independentRelation(lines.l.p, lines.l.q, lines.m.p, lines.m.q)));
    } else if (id === 'p3') {
      for (const l of [lines.l, lines.m]) assert.equal(rank([direction(l), normal(end.panels[0].pts)]), 1);
      assert.equal(independentRelation(lines.l.p, lines.l.q, lines.m.p, lines.m.q), 'parallel');
    } else if (id === 'p4') {
      const normals = end.panels.map(p => normal(p.pts)); near(dot(normals[0], normals[1]), 0); near(dot(normals[0], normals[2]), 0);
      assert.equal(rank([normals[1], normals[2]]), 2);
      const complete = shorts.completeWallIntersection(end), intersection = complete.lines.find(l => l.name === '교선');
      assert.ok(intersection);
      for (const panel of end.panels.slice(1)) for (const p of [intersection.p, intersection.q]) near(signedDistance(panel.pts, p), 0);
    } else if (id === 'p5') {
      for (const p of end.panels) assert.equal(rank([normal(p.pts), direction(lines.l)]), 1);
      assert.ok(Math.abs(signedDistance(end.panels[0].pts, end.panels[1].pts[0])) > .1);
    } else if (id === 'p6') {
      assert.equal(rank([direction(lines.l), normal(end.panels[0].pts)]), 1); near(dot(direction(lines.l), direction(lines.m)), 0);
      for (const p of [lines.m.p, lines.m.q]) near(signedDistance(end.panels[0].pts, p), 0);
    } else if (id === 'perp') {
      near(dot(direction(lines.l), direction(lines.m)), 0); assert.ok(Math.abs(dot(direction(lines.l), direction(lines.n))) > .1);
      const two = shorts.statementPose(shorts.statementData({ G: lab.api, s }, id, 'two'), 1), ls = Object.fromEntries(two.lines.map(l => [l.name, l]));
      near(dot(direction(ls.l), direction(ls.m)), 0); near(dot(direction(ls.l), direction(ls.n)), 0);
      assert.equal(rank([direction(ls.l), normal(two.panels[0].pts)]), 1);
    } else if (id === 'door') {
      near(dot(normal(end.panels[0].pts), normal(end.panels[1].pts)), 0);
      for (const p of [lines.l.p, lines.l.q]) near(signedDistance(end.panels[1].pts, p), 0);
    } else {
      assert.equal(independentRelation(lines.l.p, lines.l.q, lines.m.p, lines.m.q), 'parallel');
      for (const [l, index] of [[lines.m, 0], [lines.l, 1]]) for (const p of [l.p, l.q]) { near(signedDistance(end.panels[index].pts, p), 0); near(signedDistance(end.panels[2].pts, p), 0); }
    }
  }
  for (const [scene, control] of [['s2-3', 'spP3b'], ['s2-5', 'spP5b']]) {
    const p = plans(lab, scene, { [control]: .8 })[0]; assert.equal(p.model.start.given, false); assert.match(p.frame(0, p.model).label, /조건이 깨졌/); assert.equal(lab.s[control], .8);
  }
});

test('five-choice proofs keep the generated statement order, selected item, seed, and each actual current starting pose', async () => {
  const lab = await load();
  for (const bank of [['p5', 'p6', 'p1', 'p4', 'p2'], ['door', 'p1', 'p2', 'p4', 'perp'], ['p2', 'p6', 'planes', 'p4', 'p1']]) {
    const p = plans(lab, 's2-7', { spBank: bank, spSel: 3, spSeed: 1907, spP1a: .41, spP1b: .5, spP2a: .7, spP5b: .4 })[0], saved = JSON.stringify(lab.s);
    assert.deepEqual(Array.from(p.model.bank), bank);
    p.model.cases.forEach((q, i) => {
      assert.equal(q.statement, bank[i]); assert.deepEqual(plain(q.start), plain(lab.api.stmt.STM[bank[i]].geo(q.initial.a, q.initial.b)));
    });
    assert.equal(p.model.answer.length, 1);
    assert.match(capture(lab.board, p, 0).texts.map(x => x.text).join(' '), /결론|조건 불충족/);
    for (const t of [0, 2.3, 5.5, 9.8]) capture(lab.board, p, t);
    assert.equal(JSON.stringify(lab.s), saved);
  }
});

test('rotating plane pencils contain entire current objects, including collinear, intersecting, parallel and skew limits', async () => {
  const lab = await load();
  const inputs = [
    ['s3-1', { spCd: 0 }], ['s3-1', { spCd: 1e-8 }], ['s3-1', { spCd: 1.8 }],
    ['s3-2', { spCd: 0 }], ['s3-2', { spCd: .8 }],
    ['s3-3', { spAl: 20 }], ['s3-3', { spAl: 160 }], ['s3-4', { spCl: .4 }],
    ...[0, .8].flatMap(spDs => [0, 55].flatMap(spGm => [0, 35].map(spTl => ['s3-5', { spDs, spGm, spTl }])))
  ];
  for (const [id, values] of inputs) {
    const p = plans(lab, id, { ...values, spTh: 123 })[0], F = p.model.final, obj = F.objs[0];
    const dimension = rank([[1, 0, 0], coordinates(obj.p), ...(obj.k === 'ln' ? [coordinates(obj.d)] : [])]);
    assert.equal(p.model.answer, dimension <= 1 ? 'inf' : dimension === 2 ? 1 : 0);
    assert.deepEqual(plain(shorts.fanPose(p.model, 0)), plain(p.model.m.F), 'entry pose is the current native geometry');
    if (p.model.answer === 'inf') for (const angle of [0, 27, 63, 126, 180]) assert.equal(F.contains(angle), true);
    if (p.model.answer === 1) {
      const n = [0, -Math.sin(F.phi * Math.PI / 180), Math.cos(F.phi * Math.PI / 180)];
      near(dot(n, coordinates(obj.p)), 0); if (obj.k === 'ln') near(dot(n, coordinates(obj.d)), 0);
      assert.equal(F.contains(F.phi), true); assert.equal(F.contains(F.phi + 25), false);
    }
    capture(lab.board, p, 6.5);
  }
  const on = plans(lab, 's3-2', { spCd: 1.65 })[1], saved = JSON.stringify(lab.s);
  near(shorts.fanPose(on.model, 0).objs[0].p.y, 1.65); near(shorts.fanPose(on.model, 9.8).objs[0].p.y, 0); assert.equal(on.model.answer, 'inf');
  assert.equal(JSON.stringify(lab.s), saved);
  const same = plans(lab, 's3-5', { spDs: 1.2, spGm: 45, spTl: 50 })[1];
  assert.equal(shorts.fanPose(same.model, 0).extra.rel, 'skew'); assert.equal(shorts.fanPose(same.model, 9.8).extra.rel, 'same');
});

test('numeric legacy labels retain the actual 3, 4 or 5 line question and enumerate genuinely distinct planes', async () => {
  const lab = await load();
  for (const id of ['s3-3', 's3-4']) for (const k of [3, 4, 5]) {
    const result = plans(lab, id, { spPq: { k }, spSeed: 4172 }).slice(1);
    assert.notEqual(result[0].motion, result[1].motion);
    for (const p of result) {
      assert.equal(p.model.k, k); assert.equal(p.model.answer, k * (k - 1) / 2); assert.match(p.title, new RegExp(`${k}직선`)); assert.match(p.given, new RegExp(`${k}직선`));
      const planes = [];
      for (const [i, j] of p.model.pairs) {
        const a = p.model.lines[i], b = p.model.lines[j], panel = shorts.spanningPanel([a.p, a.q, b.p, b.q]);
        assert.ok(panel); [a.p, a.q, b.p, b.q].forEach(point => near(signedDistance(panel, point), 0));
        assert.ok(!planes.some(old => panel.every(point => Math.abs(signedDistance(old, point)) < 1e-8))); planes.push(panel);
      }
      assert.equal(planes.length, p.model.answer); assert.equal(lab.s.spPq.k, k); assert.equal(lab.s.spSeed, 4172);
    }
  }
});

test('vertex triples are grouped by actual affine planes, and coplanar edge counting stays pairwise with the current reference', async () => {
  const lab = await load();
  const result = plans(lab, 's3-6', { spK6: 'tri', spSel3: ['A', 'C', 'F'], spSeed: 123 });
  for (const p of result) {
    const independent = independentPlaneGroups(p.model.sol);
    assert.equal(p.model.groups.length, independent.size);
    p.model.groups.forEach(g => assert.equal(g.triples.length, independent.get(g.members.slice().sort().join(','))));
    assert.equal(p.model.T - p.model.duplicates, independent.size);
  }
  assert.deepEqual(result.map(p => p.model.answer), [20, 7, 4]); assert.equal(lab.s.spK6, 'tri'); assert.deepEqual(Array.from(lab.s.spSel3), ['A', 'C', 'F']);
  for (const kind of ['cuboid', 'tri', 'trap', 'pyr4', 'prism6']) {
    const sol = lab.api.buildSolid(kind === 'prism6' ? 'prism' : kind, 6);
    const ref = sol.edges.at(-2), p = plans(lab, 's3-5', { spPq: { kind, ref: ref.key, pickKey: ref.key } })[2];
    assert.equal(p.model.ref.key, ref.key);
    const [a, b] = [p.model.sol.verts[ref.u], p.model.sol.verts[ref.v]];
    const expected = p.model.sol.edges.filter(e => e.key !== ref.key && independentRelation(a, b, p.model.sol.verts[e.u], p.model.sol.verts[e.v]) !== 'skew').length;
    assert.equal(p.model.answer, expected); assert.match(p.frame(9.8, p.model).label, /서로 달라도/);
  }
});

test('all native nets fold rigidly with consistent vertex names and preserve the selected reference, face and initial fold', async () => {
  const lab = await load();
  for (const [kind, keys] of [['cube', ['cross', 'off', 'n231', 'stair']], ['prism3', ['']], ['pyr4', ['']]]) for (const key of keys) {
    const net = lab.api.netOf(kind, key), solid = shorts.netSolid(net), flat = net.at(0), closed = net.at(1);
    const totals = { cube: [8, 12, 6], prism3: [6, 9, 5], pyr4: [5, 8, 5] }[kind];
    assert.deepEqual([solid.order.length, solid.edges.length, solid.faces.length], totals);
    assert.ok(Object.values(solid.edgeFaces).every(fs => fs.length === 2));
    for (const f of [0, .17, .5, .83, 1]) net.at(f).forEach((points, i) => {
      for (const [a, b] of combinations(points.length, 2)) near(distance(points[a], points[b]), distance(flat[i][a], flat[i][b]));
      points.forEach(p => near(signedDistance(points, p), 0));
    });
    closed.forEach((face, i) => face.forEach((p, j) => near(distance(p, solid.verts[net.vname(i, j)]), 0)));
    for (const initial of [0, .43, 1]) { near(shorts.foldAt(0, initial), initial); near(shorts.foldAt(1.8, initial), 0); near(shorts.foldAt(5.7, initial), 1); }
    const id = kind === 'cube' ? 's4-1' : kind === 'prism3' ? 's4-3' : 's4-4', ref = solid.edges.at(-1), ps = plans(lab, id, { spNet: key, spRefN: ref.key, spFold: .43, spYaw: -47, spPitchN: 72 });
    const saved = JSON.stringify(lab.s);
    ps.forEach(p => { assert.equal(p.model.ref.key, ref.key); assert.equal(p.model.initialFold, .43); for (const t of [0, 1.8, 4, 6.4, 9.8]) capture(lab.board, p, t); });
    assert.equal(JSON.stringify(lab.s), saved);
    const name = ps.find(p => p.model.goal === 'name');
    if (name) { const e = name.model.sol.edges.find(e => e.name === name.model.answer); assert.ok(e); assert.equal(independentRelation(...[ref, e].flatMap(e => [solid.verts[e.u], solid.verts[e.v]])), 'skew'); }
    if (kind === 'cube') for (const base of [-1, 0, 2, 5]) {
      const p = plans(lab, 's4-2', { spNet: key, spBase: base, spFold: .65 })[0], m = p.model;
      assert.equal(m.parallel.length, 1); assert.equal(m.perpendicular.length, 4);
      const n = normal(closed[m.base]); assert.equal(rank([n, normal(closed[m.parallel[0]])]), 1);
      m.perpendicular.forEach(i => near(dot(n, normal(closed[i])), 0)); assert.equal(lab.s.spBase, base);
    }
  }
});

test('solid line-plane and plane-plane counts follow actual face geometry for every generated problem kind and face', async () => {
  const lab = await load();
  const cases = [{ kind: 'cuboid', n: 4 }, { kind: 'trap', n: 4 }, { kind: 'pyr4', n: 4 }, { kind: 'tetra', n: 3 }, ...[3, 4, 5, 6].map(n => ({ kind: 'prism', n }))];
  for (const q of cases) {
    const sol = lab.api.buildSolid(q.kind, q.n), faces = sol.faces.map(f => f.v.map(n => sol.verts[n]));
    for (let fi = 0; fi < faces.length; fi++) {
      const result = shorts.solidFaceRelations(sol, fi), [a, b, c] = faces[fi], u = vector(a, b), v = vector(a, c);
      const edgeKeys = sol.edges.filter(e => { const direction = vector(sol.verts[e.u], sol.verts[e.v]); return Math.abs(dot(direction, u)) < 1e-8 && Math.abs(dot(direction, v)) < 1e-8; }).map(e => e.key);
      assert.deepEqual(Array.from(result.edges, e => e.key), Array.from(edgeKeys));
      const perpendicular = faces.map((f, i) => i !== fi && Math.abs(dot(normal(f), normal(faces[fi]))) < 1e-8 ? i : -1).filter(i => i >= 0);
      assert.deepEqual(Array.from(result.perpendicular), Array.from(perpendicular));
      result.parallelPairs.forEach(([i, j]) => { assert.equal(rank([normal(faces[i]), normal(faces[j])]), 1); assert.ok(Math.abs(signedDistance(faces[i], faces[j][0])) > 1e-7); });
      for (const [id, label] of [['s5-1', '수직 모서리'], ['s5-2', '수직인 면'], ['s5-3', '평행한 면']]) {
        const question = { ...q, face: fi }, p = plans(lab, id, { spQ: question }).find(p => p.legacyLabel === label);
        assert.deepEqual(plain(p.model.q), question);
        assert.equal(p.model.answer, id === 's5-1' ? edgeKeys.length : id === 's5-2' ? perpendicular.length : result.parallelPairs.length);
      }
    }
  }
});

test('production Board draws all 62 proofs through construction and conclusion at desktop and narrow viewport sizes', async () => {
  const lab = await load();
  for (const [width, height] of [[1280, 720], [1000, 650], [640, 480], [390, 650]]) {
    lab.board.resize(width, height); lab.setViewportWidth(width);
    for (const scene of lab.list) {
      const output = plans(lab, scene.id), saved = JSON.stringify(lab.s);
      for (const p of output) for (const t of [0, 1.8, 3.6, 5.9, 6.5, 7.8, 9.8]) {
        const rendered = capture(lab.board, p, t);
        assert.ok(rendered.paths.length > 0, `${p.id} at ${t}: a geometry drawing exists`);
        rendered.paths.flatMap(path => path.points).forEach(point => { assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y)); });
        assert.ok(!rendered.texts.some(text => /NaN|undefined|Infinity/.test(text.text)), `${p.id} at ${t}: displayed values are defined`);
      }
      assert.equal(JSON.stringify(lab.s), saved, `${scene.id}: playback leaves current question and controls intact`);
    }
  }
});
