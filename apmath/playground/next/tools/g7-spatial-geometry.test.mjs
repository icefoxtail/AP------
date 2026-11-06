import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Load the production scene registrations. This is a geometry test, not a browser substitute.
const base = new URL('../labs/g7-spatial/', import.meta.url);
const document = { documentElement: { dataset: {} }, head: { append() {} },
  getElementById() { return null; }, createElement() { return {}; }, addEventListener() {} };
const context = vm.createContext({ window: {}, document, console });
vm.runInContext('let randomSeed = 260711; Math.random = () => { randomSeed = (1664525 * randomSeed + 1013904223) >>> 0; return randomSeed / 4294967296; };', context);
for (const name of ['core', 'stmt', 't1', 't2', 't3', 't4', 't5']) {
  const path = new URL(name + '.js', base);
  vm.runInContext(readFileSync(path, 'utf8'), context, { filename: fileURLToPath(path) });
}
const G = context.window.APL_SP;
const scenes = context.window.APL_SP_GROUPS.flatMap(g => g.scenes);
const scene = id => scenes.find(s => s.id === id);
const state = id => { const s = {}; scene(id).sp.init(s); return s; };
const xyz = p => [p.x, p.y, p.z];
const diff = (a, b) => xyz(a).map((v, i) => v - xyz(b)[i]);
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const dist = (a, b) => Math.hypot(...diff(a, b));

// Independent affine-rank oracle, using row reduction rather than production cross products.
function rank(rows) {
  const m = rows.map(r => r.slice()); let row = 0;
  for (let col = 0; col < 3 && row < m.length; col++) {
    let pivot = row;
    for (let i = row + 1; i < m.length; i++) if (Math.abs(m[i][col]) > Math.abs(m[pivot][col])) pivot = i;
    if (Math.abs(m[pivot][col]) < 1e-9) continue;
    [m[row], m[pivot]] = [m[pivot], m[row]];
    const n = m[row][col]; m[row] = m[row].map(v => v / n);
    for (let i = 0; i < m.length; i++) if (i !== row) {
      const f = m[i][col]; m[i] = m[i].map((v, j) => v - f * m[row][j]);
    }
    row++;
  }
  return row;
}
function edgeRelation(sol, a, b) {
  if (a.key === b.key) return 'ref';
  const u = diff(sol.verts[a.v], sol.verts[a.u]), v = diff(sol.verts[b.v], sol.verts[b.u]);
  if (rank([u, v]) === 1) return 'par';
  if (rank([u, v, diff(sol.verts[b.u], sol.verts[a.u])]) === 3) return 'skew';
  return [a.u, a.v].some(p => p === b.u || p === b.v) ? 'meet' : 'ext';
}

test('all six edges of the named regular tetrahedron have the same length', () => {
  const sol = G.buildSolid('tetra');
  for (const e of sol.edges) assert.ok(Math.abs(dist(sol.verts[e.u], sol.verts[e.v]) - 3.5) < 1e-9, e.name);
  for (const f of sol.faces) {
    const [a, b, c] = f.v.map(k => sol.verts[k]);
    assert.ok(Math.abs(dot(diff(b, a), diff(c, a)) / (dist(a, b) * dist(a, c)) - 0.5) < 1e-9);
  }
});

test('a nonzero point offset always determines exactly one plane', () => {
  for (const id of ['s3-1', 's3-2']) for (let i = 0; i <= 36; i++) {
    const F = scene(id).sp.model({ ...state(id), spCd: i / 20 }).F;
    assert.equal(F.nPl, i === 0 ? 'inf' : 1, `${id} offset=${i / 20}`);
    assert.equal(F.contains(0), true);
    assert.equal(F.contains(1), i === 0, `${id} one degree is not the containing plane`);
  }
});

test('skew, intersecting, parallel and coincident lines match independent affine rank', () => {
  for (const spDs of [0, 0.05, 0.9, 1.8]) for (const spGm of [0, 1, 55, 90]) for (const spTl of [0, 1, 35, 60]) {
    const F = scene('s3-5').sp.model({ ...state('s3-5'), spDs, spGm, spTl }).F;
    const r = rank([[1, 0, 0], xyz(F.extra.dm), xyz(F.extra.Q)]);
    assert.equal(F.nPl, r === 1 ? 'inf' : r === 2 ? 1 : 0, JSON.stringify({ spDs, spGm, spTl }));
    if (F.nPl === 1) assert.equal(F.contains(F.phi), true);
  }
});

test('small nonzero slider tilts do not acquire exact perpendicular or parallel marks', () => {
  for (let i = 0; i <= 100; i++) {
    const x = i / 100, isZero = i === 0;
    for (const id of ['p3', 'p5']) {
      const g = G.stmt.STM[id].geo(0.5, x);
      assert.equal(g.given, isZero, `${id} tilt=${x}`);
      assert.equal(g.holds, isZero, `${id} conclusion at tilt=${x}`);
      assert.equal(g.rights.length, isZero ? 2 : 1);
    }
    assert.equal(G.stmt.STM.p6.geo(x, 0.2).rel, isZero ? 'sub' : 'parallel');
    const p = G.stmt.STM.perp.geo(x, 0);
    assert.equal(p.holds, i === 100, `perpendicular at ${x}`);
    assert.ok(Math.abs(p.angN - (54 + 36 * x)) < 1e-9);
  }
  const same = G.stmt.STM.p1.geo(0, 0.5);
  assert.equal(same.rel, 'same');
  assert.equal(same.given, false, 'a claim about distinct lines excludes coincident lines');
});

test('all solid edge relationships agree with the affine-rank oracle', () => {
  const solids = ['cuboid', 'trap', 'tri', 'pyr4', 'tetra'].map(k => G.buildSolid(k));
  for (let n = 3; n <= 8; n++) solids.push(G.buildSolid('prism', n));
  for (const sol of solids) for (const ref of sol.edges) for (const e of sol.edges) {
    assert.equal(G.relEdges(sol, ref, e), edgeRelation(sol, ref, e), `${sol.name} ${ref.name}/${e.name}`);
  }
});

test('vertex plane counts agree with independent coplanar vertex sets', () => {
  const expected = { cuboid: 20, tri: 11, pyr4: 7, tetra: 4 };
  for (const [spK6, count] of Object.entries(expected)) {
    const M = scene('s3-6').sp.model({ ...state('s3-6'), spK6 }), V = M.sol.verts, keys = M.sol.order, planes = new Set();
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) for (let k = j + 1; k < keys.length; k++) {
      const a = V[keys[i]], ab = diff(V[keys[j]], a), ac = diff(V[keys[k]], a);
      if (rank([ab, ac]) !== 2) continue;
      planes.add(keys.filter(key => rank([ab, ac, diff(V[key], a)]) === 2).join('|'));
    }
    assert.equal(planes.size, count, spK6);
    assert.equal(M.ans, count, spK6);
    assert.equal(M.T - M.dup, count, spK6);
  }
});

test('true statements retain their conclusion under the given condition and false statements have counterexamples', () => {
  for (const [id, st] of Object.entries(G.stmt.STM)) {
    const g = st.geo(st.cex.a, st.cex.b);
    assert.equal(g.given, true, id + ' example must obey the condition');
    assert.equal(g.holds, st.truth, id + ' conclusion');
    if (st.truth) for (const a of [0, 0.01, 0.25, 0.5, 0.99, 1]) for (const b of [0, 0.01, 0.5, 1]) {
      const sample = st.geo(a, b);
      assert.ok(!sample.given || sample.holds, `${id} ${a},${b}`);
    }
  }
});

test('folded nets close as manifolds and preserve every face edge while folding', () => {
  const nets = ['cross', 'off', 'n231', 'stair'].map(k => G.netOf('cube', k));
  nets.push(G.netOf('prism3'), G.netOf('pyr4'));
  for (const net of nets) {
    const sol = net.sol;
    assert.equal(sol.order.length - sol.edges.length + net.faces.length, 2, net.name);
    const uses = new Map();
    for (let fi = 0; fi < net.faces.length; fi++) {
      const face = net.faces[fi].poly;
      for (let vi = 0; vi < face.length; vi++) {
        const key = [net.vname(fi, vi), net.vname(fi, (vi + 1) % face.length)].sort().join('|');
        uses.set(key, (uses.get(key) || 0) + 1);
      }
    }
    for (const count of uses.values()) assert.equal(count, 2, 'each closed edge belongs to two faces');
    for (const t of [0, 0.25, 0.5, 0.75, 1]) net.at(t).forEach((face, fi) => {
      for (let vi = 0; vi < face.length; vi++) {
        const j = (vi + 1) % face.length;
        assert.ok(Math.abs(dist(face[vi], face[j]) - dist(net.faces[fi].poly[vi], net.faces[fi].poly[j])) < 1e-9);
      }
    });
    for (const ref of sol.edges) for (const e of sol.edges) assert.equal(G.relEdges(sol, ref, e), edgeRelation(sol, ref, e));
  }
});

test('every registered scene retains five unique choices, one answer, and no initial answer styling', () => {
  assert.ok(scenes.length > 0);
  assert.equal(new Set(scenes.map(s => s.id)).size, scenes.length);
  for (const sc of scenes) {
    const s = state(sc.id);
    for (let sample = 0; sample < 30; sample++) {
      const M = sc.sp.model(s), Q = sc.sp.prob(M, s);
      assert.equal(Q.choices.length, 5, sc.id);
      assert.equal(Q.choices.filter(c => c.ok).length, 1, sc.id);
      assert.equal(new Set(Q.choices.map(c => c.h)).size, 5, sc.id);
      if (sc.id.startsWith('s1-')) {
        const expected = M.sol.edges.filter(e => edgeRelation(M.sol, M.ref, e) === 'skew').length;
        assert.equal(parseInt(Q.choices.find(c => c.ok).h, 10), expected, sc.id);
      }
      if (sc.id === 's5-1') assert.equal(parseInt(Q.choices.find(c => c.ok).h, 10), M.q.kind === 'cuboid' ? 4 : M.q.n);
      if (sc.id === 's5-2') assert.equal(parseInt(Q.choices.find(c => c.ok).h, 10), M.q.kind === 'cuboid' || M.q.n === 4 && M.q.kind === 'prism' ? 4 : M.q.face < 2 ? M.q.n : 2);
      if (sc.id === 's5-3') assert.equal(parseInt(Q.choices.find(c => c.ok).h, 10), M.q.kind === 'cuboid' ? 3 : M.q.kind === 'trap' ? 2 : M.q.n % 2 ? 1 : 1 + M.q.n / 2);
      assert.doesNotMatch(sc.problem.text(s), /class="sp-ch (?:ok|bad)"|class="sp-fb/);
      assert.ok(sc.steps(s).length >= 3, sc.id);
      sc.sp.reroll(s);
    }
  }
});
