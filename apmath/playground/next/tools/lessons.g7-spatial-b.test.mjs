// Minimal math/cue/production Board safety, not a browser or mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/spatial-lesson-runtime.mjs';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load(), ids = ['s2-1', 's2-2', 's2-3', 's2-4', 's2-5', 's2-6', 's2-7', 's5-1', 's5-2', 's5-3'];
const lessons = Object.fromEntries(ids.map(id => [id, lab.def.lessons[id]]));
const plain = x => JSON.parse(JSON.stringify(x));
const norm = x => String(x).replace(/\s/g, '');
const near = (value, expected = 0, message = '') => assert.ok(Math.abs(value - expected) < 1e-8, `${message}: ${value} ≈ ${expected}`);
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const length = a => Math.hypot(a.x, a.y, a.z);
const unit = a => { const r = length(a); return { x: a.x / r, y: a.y / r, z: a.z / r }; };
const parallel = (a, b) => near(length(cross(unit(a), unit(b))));
const perpendicular = (a, b) => near(dot(unit(a), unit(b)));
const normal = points => unit(cross(sub(points[1], points[0]), sub(points[2], points[0])));
const signed = (point, panel) => dot(sub(point, panel.pts[0]), normal(panel.pts));
const named = (g, name) => { const line = g.lines.find(x => x.name === name); assert.ok(line, `source line ${name}`); return line; };
const direction = line => sub(line.q, line.p);
const coplanar = (a, b) => near(dot(sub(b.p, a.p), cross(direction(a), direction(b))));
const geo = (id, t) => { const st = lab.api.stmt.STM[id]; return st.geo(st.init.a + (st.cex.a - st.init.a) * t, st.init.b + (st.cex.b - st.init.b) * t); };

function init(id, lesson) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  return { scene: lab.scene, cs: core.compileLesson(lesson), s: { ...lab.s } };
}
function at(cs, s, time) {
  const state = core.stateAt(cs, time, { nums: { ...s }, sets: { ...s }, step: 0, part: null });
  return { ...s, ...state.nums, ...state.sets, step: state.step, part: state.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(state, width = 1000) {
  Object.assign(lab.s, state); lab.setViewportWidth(width); lab.board.resize(width, 650); return lab.draw();
}
const visible = frame => frame.paths.some(p => (p.options.color !== null && (p.options.alpha ?? 1) > 0) || (p.options.fill && (p.options.fillAlpha ?? 1) > 0));
const signature = frame => JSON.stringify(frame.paths.filter(p => p.options.color !== null || p.options.fill).map(p => p.points));

test('ten original scenes have twenty valid explanations and replay resets every sibling flag', () => {
  assert.deepEqual(ids.map(id => lessons[id].length), [2, 2, 2, 2, 2, 2, 1, 3, 2, 2]);
  for (const [id, list] of Object.entries(lessons)) {
    const report = core.validateLessonSet(list); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of list) {
      const cs = core.compileLesson(lesson), initial = lesson.chapters[0].cues[0].set;
      assert.equal(initial.spShowAnswer, false); assert.equal(initial.spBStage, 0); assert.equal(initial.spSpin, false);
      assert.equal(lesson.chapters[0].start.spT, 0); assert.equal(lesson.chapters[0].start.spBTrace, 0);
      assert.equal(lesson.chapters[0].start.spYaw, -30); assert.equal(lesson.chapters[0].start.spPitch, 24);
      const answer = cs.cues.find(c => c.set?.spShowAnswer === true);
      assert.ok(answer.at >= cs.chapters.at(-1).at, `${id}: answer is confined to the last chapter`);
    }
  }
});

test('counterexample motion keeps all given perpendicular conditions for p1 and p4', () => {
  for (const t of [0, .5, 1]) {
    const g1 = geo('p1', t), l = named(g1, 'l'), m = named(g1, 'm'), n = named(g1, 'n');
    for (const line of [m, n]) { perpendicular(direction(l), direction(line)); coplanar(l, line); }
    if (t > 0) assert.ok(Math.abs(dot(sub(n.p, m.p), cross(direction(m), direction(n)))) > .1, 'm and n are genuinely skew');
    const g4 = geo('p4', t), [P, Q, R] = g4.panels;
    perpendicular(normal(P.pts), normal(Q.pts)); perpendicular(normal(P.pts), normal(R.pts));
    if (t > 0) assert.ok(length(cross(normal(Q.pts), normal(R.pts))) > .1, 'two vertical planes meet');
  }
});

test('p2 and p6 distinguish a line outside a plane from a line contained in it', () => {
  for (const t of [0, .5, 1]) {
    const g2 = geo('p2', t), P = g2.panels[0], l = named(g2, 'l'), m = named(g2, 'm');
    for (const line of [l, m]) { perpendicular(direction(line), normal(P.pts)); assert.ok(Math.abs(signed(line.p, P)) > .1); }
    if (t > 0) assert.ok(Math.abs(dot(sub(m.p, l.p), cross(direction(l), direction(m)))) > .1, 'the two lines can be skew despite both avoiding P');
    const g6 = geo('p6', t), wall = g6.panels[0], a = named(g6, 'l'), b = named(g6, 'm');
    parallel(direction(a), normal(wall.pts)); perpendicular(direction(a), direction(b)); coplanar(a, b);
    if (t === 1) { near(signed(b.p, wall)); near(signed(b.q, wall)); }
    else assert.ok(Math.abs(signed(b.p, wall)) > .1);
  }
});

test('p3 and p5 preserve distinct objects and a unique normal direction', () => {
  for (const t of [0, .5, 1]) {
    const g3 = geo('p3', t), P = g3.panels[0], l = named(g3, 'l'), m = named(g3, 'm');
    parallel(direction(l), normal(P.pts)); parallel(direction(m), normal(P.pts)); parallel(direction(l), direction(m));
    assert.ok(length(cross(sub(m.p, l.p), direction(l))) > 1, 'the two lines are distinct');
    const g5 = geo('p5', t), [a, b] = g5.panels, line = named(g5, 'l');
    parallel(direction(line), normal(a.pts)); parallel(direction(line), normal(b.pts));
    assert.ok(Math.abs(signed(b.pts[0], a)) > .1, 'the two planes are distinct');
  }
});

test('one perpendicular line is insufficient, while the two-line lesson keeps both right angles fixed', () => {
  const g = geo('perp', 1), l = named(g, 'l'), m = named(g, 'm'), n = named(g, 'n');
  perpendicular(direction(l), direction(m)); coplanar(l, m);
  assert.ok(Math.abs(dot(unit(direction(l)), unit(direction(n)))) > .1);
  assert.ok(length(cross(unit(direction(l)), normal(g.panels[0].pts))) > .1);
  const { cs, s, scene } = init('s5-1', lessons['s5-1'][1]);
  for (const time of [0, .99, cs.length]) {
    const state = at(cs, s, time), M = scene.sp.model(state);
    assert.equal(state.spT, 0); perpendicular(direction(named(M.cur, 'l')), direction(named(M.cur, 'm'))); perpendicular(direction(named(M.cur, 'l')), direction(named(M.cur, 'n')));
    parallel(direction(named(M.cur, 'l')), normal(M.cur.panels[0].pts));
  }
  assert.notEqual(at(cs, s, .99).spYaw, at(cs, s, 0).spYaw, 'camera changes without changing the given conditions');
});

test('door and parallel-cut diagrams satisfy their source conditions including the exact l/m labels', () => {
  for (const t of [0, .5, 1]) {
    const d = geo('door', t), l = named(d, 'l');
    parallel(direction(l), normal(d.panels[0].pts)); near(signed(l.p, d.panels[1])); near(signed(l.q, d.panels[1])); perpendicular(normal(d.panels[0].pts), normal(d.panels[1].pts));
    const g = geo('planes', t), [P, Q, R] = g.panels, lower = named(g, 'm'), upper = named(g, 'l');
    parallel(normal(P.pts), normal(Q.pts)); assert.ok(Math.abs(signed(Q.pts[0], P)) > .1);
    for (const point of [lower.p, lower.q]) { near(signed(point, P)); near(signed(point, R)); }
    for (const point of [upper.p, upper.q]) { near(signed(point, Q)); near(signed(point, R)); }
    parallel(direction(lower), direction(upper));
  }
  assert.match(lessons['s5-3'][0].chapters[0].cues[1].say, /P의 교선은 m.*Q의 교선은 l/);
});

test('seven five-choice lessons retain all original statement texts and only the fifth choice is correct', () => {
  for (const id of ids.filter(id => id.startsWith('s2-'))) {
    const lesson = lessons[id].at(-1), { scene, cs, s } = init(id, lesson), state = at(cs, s, 0), M = scene.sp.model(state), Q = scene.sp.prob(M);
    assert.equal(Q.choices.length, 5); assert.deepEqual(Array.from(Q.choices, q => q.ok), [false, false, false, false, true]);
    assert.deepEqual(Array.from(Q.choices, q => q.h), Array.from(state.spBank, k => lab.api.stmt.STM[k].text));
    if (id !== 's2-7') assert.ok(state.spBank.includes('p' + id.at(-1)), `${id}: its own statement is included`);
    for (let index = 0; index < 5; index++) {
      const time = cs.chapters[index].at, first = at(cs, s, time), current = at(cs, s, time + .99);
      assert.equal(first.spSel, index); assert.equal(first.spT, 0); assert.ok(current.spT > 0 && current.spT < 1);
      assert.ok(scene.question(current).includes(lab.api.stmt.STM[current.spBank[index]].text));
      const f = draw(current); assert.ok(visible(f));
      const names = current.spBank[index] === 'p4' ? ['평면 P', '평면 Q', '평면 R'] : current.spBank[index] === 'p5' ? ['평면 P', '평면 Q', 'l'] : ['l', 'm'];
      for (const name of names) assert.ok(f.texts.includes(name), `${id}/${index + 1}: source object ${name} is drawn`);
    }
  }
});

test('actual fixed solid questions independently give three perpendicular edges, four perpendicular faces, three parallel pairs', () => {
  const cases = [['s5-1', 2, { kind: 'prism', n: 3, face: 0 }, 3], ['s5-2', 1, { kind: 'cuboid', n: 4, face: 2 }, 4], ['s5-3', 1, { kind: 'cuboid', n: 4, face: 0 }, 3]];
  for (const [id, index, q, expected] of cases) {
    const { cs, s, scene } = init(id, lessons[id][index]), state = at(cs, s, 0), M = scene.sp.model(state), { sol } = M;
    assert.deepEqual(plain(state.spQ), q); assert.deepEqual(plain(M.q), q);
    const normals = Array.from(sol.faces, f => normal(f.v.map(k => sol.verts[k]))), reference = normals[q.face];
    let found;
    if (id === 's5-1') {
      found = Array.from(sol.edges).filter(e => length(cross(unit(sub(sol.verts[e.v], sol.verts[e.u])), reference)) < 1e-8).map(e => e.u + e.v);
      assert.deepEqual(found, ['AD', 'BE', 'CF']);
    } else if (id === 's5-2') {
      found = Array.from(sol.faces).filter((_, i) => i !== q.face && Math.abs(dot(normals[i], reference)) < 1e-8).map(f => f.v.join(''));
      assert.deepEqual(found, ['ABCD', 'EFGH', 'ADHE', 'BCGF']);
    } else {
      found = [];
      for (let i = 0; i < sol.faces.length; i++) for (let j = i + 1; j < sol.faces.length; j++) if (length(cross(normals[i], normals[j])) < 1e-8) found.push([sol.faces[i].v.join(''), sol.faces[j].v.join('')]);
      assert.deepEqual(found, [['ABCD', 'EFGH'], ['ABFE', 'DCGH'], ['ADHE', 'BCGF']]);
    }
    assert.equal(found.length, expected);
    const Q = scene.sp.prob(M), correct = Q.choices.filter(c => c.ok);
    assert.equal(correct.length, 1); assert.ok(norm(correct[0].p).includes(String(expected)));
    assert.equal(scene.question(state), Q.stem, 'the question above the solid is the actual source problem');
  }
});

for (const [id, list] of Object.entries(lessons)) for (const [index, lesson] of list.entries()) test(`${id}/${index + 1}: visible first-second motion and final-only answer`, () => {
  const { cs, s } = init(id, lesson), answerAt = cs.cues.find(c => c.set?.spShowAnswer === true).at, target = norm(lesson.answerText);
  const initial = at(cs, s, 0), moving = at(cs, s, .99), before = at(cs, s, answerAt - .01), end = at(cs, s, cs.length);
  for (const width of [390, 1000]) {
    const entry = draw({ ...initial, lessonOn: false, lessonEntry: true, step: 99 }, width), motion = draw(moving, width), pre = draw(before, width), last = draw(end, width);
    assert.ok(visible(entry)); assert.ok(visible(last)); assert.notEqual(signature(entry), signature(motion), 'actual geometry or auxiliary trace moves in the first second');
    for (const key of ['card', 'formula', 'rule', 'status']) assert.equal(entry.value[key], null);
    assert.equal(entry.value.readouts.length, 0);
    for (const frame of [entry, motion, pre]) assert.ok(!norm(frame.texts.join('')).includes(target), `${width}: final answer ${target} stays hidden`);
    assert.ok(norm(last.texts.join('')).includes(target), `${width}: final answer ${target} is visible`);
  }
});

test('solid highlight groups follow the explanation cues instead of appearing on entry', () => {
  for (const [id, index, time, target] of [['s5-1', 2, 25, '수직인 모서리: AD, BE, CF'], ['s5-2', 1, 25, '수직인 면: ABCD, EFGH, ADHE, BCGF'], ['s5-3', 1, 15, '평행한 두 면: ABCD, EFGH'], ['s5-3', 1, 25, '평행한 두 면: ABFE, DCGH'], ['s5-3', 1, 35, '평행한 두 면: ADHE, BCGF']]) {
    const { cs, s } = init(id, lessons[id][index]);
    assert.ok(!norm(draw(at(cs, s, time - .01)).texts.join('')).includes(norm(target)), `${id}: group is hidden until its cue`);
    assert.ok(norm(draw(at(cs, s, time)).texts.join('')).includes(norm(target)), `${id}: group appears with its cue`);
  }
});

test('previous practice review cannot change the fixed bank, solid question, or timeline', () => {
  for (const [id, index] of [['s2-7', 0], ['s5-2', 1]]) {
    const { cs, s, scene } = init(id, lessons[id][index]), fixed = at(cs, s, 15.5), before = draw(fixed);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.tab = 'problem'; scene.view(lab.s, lab);
    const selection = { key: 'prior-manual-question', idx: 2 };
    lab.tab = 'review'; const again = draw({ ...fixed, spPick: selection });
    assert.equal(signature(again), signature(before)); assert.deepEqual(again.texts, before.texts); assert.equal(lab.s.spPick, selection);
    assert.equal(lab.s.step, fixed.step); assert.deepEqual(plain(lab.s.spBank), plain(fixed.spBank)); assert.deepEqual(plain(lab.s.spQ), plain(fixed.spQ));
    const serialized = JSON.stringify(lab.s); assert.equal(scene.tick(lab.s, .5, lab), false); assert.equal(JSON.stringify(lab.s), serialized);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.tab = 'explore';
    const manual = lab.draw(); assert.ok(manual.value.formula, 'manual explanation formula remains available'); assert.ok(manual.value.readouts.length > 0);
  }
});
