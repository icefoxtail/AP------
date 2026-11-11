// 실제 정점 좌표로 접힘·평행·꼬임을 독립 검산합니다. 모바일 시각검수는 별도입니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/polyhedra-lesson-runtime.mjs';
const core = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load(), G = lab.api, bank = lab.def.lessons;
const ids = Array.from({ length: 8 }, (_, i) => `p3-${i + 1}`);
const list = id => core.lessonList(bank[id]);
const end = l => l.chapters.reduce((n, c) => n + c.length, 0);
const state = (id, lesson, time = 0) => {
  lab.go(id);
  const c = core.compileLesson(lesson), s = core.stateAt(c, time, { nums: c.start, sets: {}, step: 0 });
  Object.assign(lab.s, c.start, s.nums, s.sets, { step: s.step || 0, lessonOn: true, lessonEntry: false });
  lab.tab = 'review';
  return lab.scene.ph.model(lab.s);
};
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const norm = a => Math.hypot(a.x, a.y, a.z);
const near = (a, b) => norm(sub(a, b)) < 1e-6;
const center = points => points.reduce((c, p) => ({ x: c.x + p.x / points.length, y: c.y + p.y / points.length, z: c.z + p.z / points.length }), { x: 0, y: 0, z: 0 });
const normal = p => cross(sub(p[1], p[0]), sub(p[2], p[0]));
const unique = points => points.reduce((out, p) => out.some(q => near(p, q)) ? out : out.concat(p), []);
function pointPositions(net) {
  const faces = net.at(1), positions = [];
  net.ptOf.forEach((pts, fi) => pts.forEach((k, vi) => { positions[k] ??= faces[fi][vi]; }));
  return positions;
}

test('t3: all 8 scenes have 15 valid lessons, with independent resets and final-only disclosure', () => {
  assert.equal(ids.reduce((n, id) => n + list(id).length, 0), 15);
  for (const id of ids) {
    assert.deepEqual(core.validateLessonSet(bank[id]), { errors: [], warnings: [] }, id);
    for (const l of list(id)) {
      state(id, l);
      assert.equal(lab.s.phShowAnswer, false, id);
      assert.equal(l.chapters[0].cues[0].to.phFold === undefined, false, id + ' starts by actually folding/unfolding');
      const beforeLast = end(l) - l.chapters.at(-1).length - 0.01;
      state(id, l, beforeLast); assert.equal(lab.s.phShowAnswer, false);
      state(id, l, end(l)); assert.equal(lab.s.phShowAnswer, true);
    }
  }
});

test('p3-1: all eleven catalog nets occupy six distinct face positions; the fixed invalid net overlaps', () => {
  const groups = {};
  for (const spec of G.CUBE_NETS) {
    groups[spec.g] = (groups[spec.g] || 0) + 1;
    const net = G.cubeNetOf(spec.key), centers = net.at(1).map(center);
    assert.equal(unique(centers).length, 6, spec.key);
  }
  assert.deepEqual(groups, { '1-4-1형': 6, '2-3-1형': 3, '2-2-2형': 1, '3-3형': 1 });
  const invalid = state('p3-1', list('p3-1')[1]);
  assert.equal(invalid.valid, false);
  assert.ok(unique(invalid.net.at(1).map(center)).length < 6);
});

test('p3-2 and p3-5: folded coordinates independently give B with D/L and A with E', () => {
  for (const [id, base, expected, vertices] of [['p3-2', 'B', ['D', 'L'], 8], ['p3-5', 'A', ['E'], 4]]) {
    const m = state(id, list(id)[0]), pts = pointPositions(m.net);
    const partners = pts.flatMap((p, k) => k !== m.k && near(p, pts[m.k]) ? [m.net.ptName[k]] : []).sort();
    assert.equal(m.net.ptName[m.k], base);
    assert.deepEqual(partners, expected);
    assert.equal(unique(pts).length, vertices);
  }
});

test('p3-6: each selected Platonic net has the stated vertex group and actual vertex count', () => {
  const expected = [ { kind: 'octa', partners: ['I'], vertices: 6 }, { kind: 'dodeca', partners: ['M', 'O'], vertices: 20 }, { kind: 'icosa', partners: ['G'], vertices: 12 } ];
  list('p3-6').forEach((l, i) => {
    const m = state('p3-6', l), pts = pointPositions(m.net);
    const partners = pts.flatMap((p, k) => k !== m.k && near(p, pts[m.k]) ? [m.net.ptName[k]] : []).sort();
    assert.equal(m.net.kind, expected[i].kind);
    assert.deepEqual(partners, expected[i].partners);
    assert.equal(unique(pts).length, expected[i].vertices);
    if (i === 1) assert.equal(m.letters, false, 'large net describes selected points without alphabet labels');
  });
});

test('p3-3: face normals give D parallel to B and A/C/E/F perpendicular to B', () => {
  for (const l of list('p3-3')) {
    const m = state('p3-3', l), normals = m.net.at(1).map(normal), ref = normals[m.fR];
    const same = [], perpendicular = [];
    normals.forEach((n, i) => {
      if (i === m.fR) return;
      const cosine = Math.abs(dot(ref, n) / (norm(ref) * norm(n))), name = 'ABCDEF'[m.net.num[i] - 1];
      if (Math.abs(cosine - 1) < 1e-6) same.push(name);
      else { assert.ok(cosine < 1e-6); perpendicular.push(name); }
    });
    assert.equal('ABCDEF'[m.net.num[m.fR] - 1], 'B');
    assert.deepEqual(same.sort(), ['D']);
    assert.deepEqual(perpendicular.sort(), ['A', 'C', 'E', 'F']);
  }
});

test('p3-4: segment directions and scalar triple products independently verify all three skew counts', () => {
  const expected = [ { total: 12, meet: 4, par: 3, skew: 4 }, { total: 6, meet: 4, par: 0, skew: 1 }, { total: 12, meet: 6, par: 1, skew: 4 } ];
  list('p3-4').forEach((l, i) => {
    const m = state('p3-4', l), verts = m.sol.verts, a = verts[m.ref.u], u = sub(verts[m.ref.v], a), count = { total: m.sol.edges.length, meet: 0, par: 0, skew: 0 };
    for (const e of m.sol.edges) {
      if (e.key === m.ref.key) continue;
      const p = verts[e.u], v = sub(verts[e.v], p), n = cross(u, v);
      if (norm(n) < 1e-6) count.par++;
      else if (Math.abs(dot(sub(p, a), n)) < 1e-6) count.meet++;
      else count.skew++;
    }
    assert.equal(m.ref.name, 'AB');
    assert.deepEqual(count, expected[i]);
    assert.equal(count.total - 1 - count.meet - count.par, count.skew);
    assert.equal(m.c.nSkew, count.skew);
  });
});

test('p3-7: two-square diagonal and midpoint give EP=4 for the fixed original edge 8', () => {
  for (const l of list('p3-7')) {
    const m = state('p3-7', l, end(l));
    assert.equal(m.a, 8); assert.equal(m.r, 0.5); assert.equal(m.ep, 4);
    assert.ok(Math.abs(m.minLen - Math.hypot(8, 16)) < 1e-9);
    for (const r of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const path = Math.hypot(8 * r, 8) + Math.hypot(8 * (1 - r), 8);
      assert.ok(path >= m.minLen - 1e-9);
    }
  }
});

test('p3-8: the chosen eye 2 and the opposite face eye 5 sum to 7', () => {
  const m = state('p3-8', list('p3-8')[0]), faces = m.net.at(1), a = normal(faces[m.fR]), b = normal(faces[m.opp]);
  assert.ok(Math.abs(Math.abs(dot(a, b) / (norm(a) * norm(b))) - 1) < 1e-6);
  assert.equal(m.vals[m.fR], 2); assert.equal(m.vals[m.opp], 5);
  m.vals.forEach((v, i) => assert.equal(v + m.vals[m.net.opposite[i]], 7));
});

test('p3-7: the lesson drawing follows its fold and P state, and ignores the previous random problem', () => {
  const l = list('p3-7')[1];
  state('p3-7', l, 0); lab.s.phQ.a = 14;
  const first = lab.draw();
  assert.match(first.texts.join(' '), /한 모서리 a = 8/);
  assert.doesNotMatch(first.texts.join(' '), /EP =|a = 14/);
  const paths0 = JSON.stringify(first.paths.map(p => p.points));
  state('p3-7', l, 1);
  assert.notEqual(JSON.stringify(lab.draw().paths.map(p => p.points)), paths0);
  state('p3-7', l, 18);
  assert.equal(lab.s.phAnt, 0.3, 'review step 2 must not force P to the midpoint');
  state('p3-7', l, end(l)); lab.s.phQ.a = 14;
  assert.match(lab.draw().texts.join(' '), /EP = 8 ÷ 2 = 4/);
});

test('t3: merged point names and the missing die value are revealed only with the final cue', () => {
  const point = list('p3-2')[0];
  state('p3-2', point, 24.5);
  assert.doesNotMatch(lab.draw().texts.join(' '), /B·D·L/);
  state('p3-2', point, end(point));
  assert.match(lab.draw().texts.join(' '), /B·D·L/);
  const die = list('p3-8')[0];
  state('p3-8', die, 0);
  assert.ok(lab.draw().texts.includes('?'));
  state('p3-8', die, end(die));
  const final = lab.draw().texts;
  assert.ok(!final.includes('?'));
  assert.match(final.join(' '), /눈 2의 맞은편은 눈 5/);
});
