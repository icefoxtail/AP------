// Minimum independent coordinate checks and source-Board cue smoke checks.
// Full browser/mobile visual QA remains a separate follow-up.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/spatial-lesson-runtime.mjs';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['s3-1', 's3-2', 's3-3', 's3-4', 's3-5', 's3-6', 's4-1', 's4-2', 's4-3', 's4-4'];
const sub = (a, b) => [a.x - b.x, a.y - b.y, a.z - b.z];
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => Math.hypot(...a);
const distance = (a, b) => norm(sub(a, b));
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const has = (frame, re) => re.test(frame.texts.join(' '));
const signature = frame => JSON.stringify(frame.paths.map(p => p.points));
const normal = polygon => { const n = cross(sub(polygon[1], polygon[0]), sub(polygon[2], polygon[0])); return n.map(v => v / norm(n)); };

function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const source = lab.scene.sp, lesson = core.lessonList(lab.def.lessons[id])[index];
  const compiled = core.compileLesson(lesson), initial = { ...lab.s, ...compiled.start };
  const value = core.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false };
  const model = source.model(s), quiz = source.prob(model, s);
  return { source, lesson, compiled, s, model, quiz };
}
function draw(id, index, time, entry = false) {
  const current = state(id, index, time);
  Object.assign(lab.s, current.s, { lessonOn: !entry, lessonEntry: entry });
  if (entry) for (const key of current.compiled.setKeys) if (typeof lab.s[key] === 'boolean') lab.s[key] = true;
  lab.tab = 'review'; return lab.draw();
}
function gate(id, index, key, expression) {
  const { compiled } = state(id, index), cue = compiled.cues.find(c => c.set?.[key] === true);
  assert.ok(cue, `${id}/${index}: ${key} cue exists`);
  assert.equal(has(draw(id, index, 0, true), expression), false, `${id}/${index}: entry`);
  assert.equal(has(draw(id, index, cue.at - 0.001), expression), false, `${id}/${index}: before ${key}`);
  assert.equal(has(draw(id, index, cue.at), expression), true, `${id}/${index}: at ${key}`);
}
function edgeRelation(sol, ref, edge) {
  if (edge.key === ref.key) return 'self';
  if ([ref.u, ref.v].some(k => k === edge.u || k === edge.v)) return 'meet';
  const u = sub(sol.verts[ref.v], sol.verts[ref.u]), v = sub(sol.verts[edge.v], sol.verts[edge.u]);
  const w = sub(sol.verts[edge.u], sol.verts[ref.u]), n = cross(u, v);
  if (norm(n) < 1e-8) return 'parallel';
  return Math.abs(dot(w, n)) < 1e-8 ? 'extended-meet' : 'skew';
}
function counts(sol, ref) {
  const out = { self: 0, meet: 0, parallel: 0, 'extended-meet': 0, skew: 0 };
  for (const edge of sol.edges) out[edgeRelation(sol, ref, edge)]++;
  return out;
}

test('ten scenes have twenty-six valid lessons with fixed problem objects and complete resets', () => {
  let n = 0;
  for (const id of ids) {
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    const lessons = core.lessonList(lab.def.lessons[id]); n += lessons.length;
    for (const [index] of lessons.entries()) {
      const first = state(id, index, 0), end = state(id, index);
      assert.ok(Object.hasOwn(first.compiled.cues[0].set, 'spPq'));
      assert.equal(first.s.spShowAnswer, false); assert.equal(end.s.spShowAnswer, true);
      assert.ok(Number.isFinite(first.compiled.start.spYaw));
      assert.ok(Number.isFinite(first.compiled.start[id.startsWith('s4') ? 'spPitchN' : 'spPitch']));
      const reveals = end.compiled.cues.filter(c => c.set?.spShowAnswer);
      assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, end.lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}/${index}: ${key}`);
      assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
    }
  }
  assert.equal(n, 26);
});

test('point and line conditions agree with actual independent vector ranks and fixed spPq', () => {
  for (const id of ['s3-1', 's3-2']) for (const index of [0, 1]) {
    const { model, s, quiz } = state(id, index), F = model.F;
    const A = id === 's3-1' ? F.A : F.lines[0].p, B = id === 's3-1' ? F.B : F.lines[0].q;
    const extra = id === 's3-1' ? F.pts[2].p : F.pts[0].p;
    assert.equal(norm(cross(sub(B, A), sub(extra, A))) < 1e-8, index === 1);
    assert.equal(F.nPl, index === 1 ? 'inf' : 1);
    assert.equal(id === 's3-1' ? s.spPq.col : s.spPq.on, index === 1);
    assert.equal(quiz.choices.find(c => c.ok).h, index === 1 ? '무수히 많다' : '1개');
  }
  const intersect = state('s3-3', 0).model.F.lines, parallel = state('s3-4', 0).model.F.lines;
  const iu = sub(intersect[0].q, intersect[0].p), iv = sub(intersect[1].q, intersect[1].p);
  assert.ok(norm(cross(iu, iv)) > 1); near(dot(sub(intersect[1].p, intersect[0].p), cross(iu, iv)), 0);
  const pu = sub(parallel[0].q, parallel[0].p), pv = sub(parallel[1].q, parallel[1].p);
  near(norm(cross(pu, pv)), 0); assert.ok(norm(cross(pu, sub(parallel[1].p, parallel[0].p))) > 1);
  assert.equal(state('s3-3', 0).model.F.nPl, 1); assert.equal(state('s3-4', 0).model.F.nPl, 1);
});

test('the actual three- and five-line problem coordinates give one distinct plane for every pair', () => {
  for (const id of ['s3-3', 's3-4']) for (const [index, k, expected] of [[1, 3, 3], [2, 5, 10]]) {
    const { source, s, model, quiz } = state(id, index), lines = model.problemLines, pairs = new Set();
    assert.equal(s.spLessonMode, 'problem'); assert.equal(lines.length, k); assert.equal(s.spPq.k, k);
    assert.equal(source.lessonQuestion(model, s, quiz), quiz.stem);
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
      const a = lines[i], b = lines[j], u = sub(a.q, a.p), v = sub(b.q, b.p);
      const n = id === 's3-3' ? cross(u, v) : cross(u, sub(b.p, a.p));
      assert.ok(norm(n) > 1e-8);
      const members = [];
      for (let m = 0; m < k; m++) if ([lines[m].p, lines[m].q].every(p => Math.abs(dot(n, sub(p, a.p))) < 1e-8)) members.push(m);
      assert.deepEqual(members, [i, j], 'no third line is coplanar'); pairs.add(members.join(','));
    }
    assert.equal(pairs.size, expected); assert.equal(quiz.choices.find(c => c.ok).p, `${expected}개`);
  }
});

test('skew and coincident line ranks differ, while the actual cuboid AB problem counts seven coplanar edges', () => {
  for (const index of [0, 1]) {
    const F = state('s3-5', index).model.F, [a, b] = F.lines;
    const u = sub(a.q, a.p), v = sub(b.q, b.p), w = sub(b.p, a.p);
    if (index === 0) { assert.ok(Math.abs(dot(w, cross(u, v))) > 1e-4); assert.equal(F.nPl, 0); }
    else { near(norm(cross(u, v)), 0); near(norm(cross(u, w)), 0); assert.equal(F.nPl, 'inf'); }
  }
  const current = state('s3-5', 2), { sol, ref } = current.model.problemSolid, c = counts(sol, ref);
  assert.equal(ref.name, 'AB'); assert.deepEqual(c, { self: 1, meet: 4, parallel: 3, 'extended-meet': 0, skew: 4 });
  assert.equal(c.meet + c.parallel + c['extended-meet'], 7); assert.equal(current.quiz.choices.find(c => c.ok).p, '7개');
});

test('independent coplanar-vertex sets give 20, 7 and 4 planes rather than counting repeated triples', () => {
  for (const [index, total, expected, duplicates] of [[0, 56, 20, 36], [1, 10, 7, 3], [2, 4, 4, 0]]) {
    const { model, quiz } = state('s3-6', index), keys = Array.from(model.sol.order), groups = new Map();
    let triples = 0;
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) for (let k = j + 1; k < keys.length; k++) {
      const a = model.sol.verts[keys[i]], n = cross(sub(model.sol.verts[keys[j]], a), sub(model.sol.verts[keys[k]], a));
      assert.ok(norm(n) > 1e-8, 'all selected triples are non-collinear');
      const members = keys.filter(key => Math.abs(dot(n, sub(model.sol.verts[key], a))) < 1e-8).sort().join('');
      groups.set(members, (groups.get(members) || 0) + 1); triples++;
    }
    assert.equal(triples, total); assert.equal(groups.size, expected);
    assert.equal([...groups.values()].reduce((sum, count) => sum + count - 1, 0), duplicates);
    assert.equal(model.ans, expected); assert.equal(model.dup, duplicates); assert.equal(quiz.choices.find(c => c.ok).p, `${expected}개`);
    if (index === 0) assert.equal(Array.from(model.cur.set).sort().join(''), 'ABGH');
  }
});

test('the actual folding paths preserve face edges and close to the expected solid vertices', () => {
  for (const [id, vertices, edges] of [['s4-1', 8, 12], ['s4-3', 6, 9], ['s4-4', 5, 8]]) {
    const { net } = state(id, 0).model, flat = net.at(0), folded = net.at(1), byName = new Map(), edgeSet = new Set();
    folded.forEach((face, fi) => face.forEach((p, vi) => {
      const next = (vi + 1) % face.length, name = net.vname(fi, vi), other = net.vname(fi, next);
      near(distance(p, face[next]), distance(flat[fi][vi], flat[fi][next]), 'hinges preserve lengths');
      if (byName.has(name)) near(distance(byName.get(name), p), 0, `same ${name} joins`); else byName.set(name, p);
      edgeSet.add([name, other].sort().join(','));
    }));
    assert.equal(byName.size, vertices); assert.equal(edgeSet.size, edges);
    assert.equal(vertices - edges + folded.length, 2);
    if (id === 's4-4') assert.equal(folded.flatMap((face, fi) => face.map((_, vi) => net.vname(fi, vi))).filter(n => n === 'V').length, 4);
  }
});

test('folded normals verify cube opposite/perpendicular faces and the triangular prism base-side relations', () => {
  const cube = state('s4-2', 0).model, end = cube.net.at(1), base = normal(end[cube.base]);
  const parallel = [], perpendicular = [];
  end.forEach((face, i) => {
    if (i === cube.base) return;
    const cosine = Math.abs(dot(base, normal(face)));
    if (Math.abs(cosine - 1) < 1e-8) { parallel.push(i); assert.ok(Math.abs(dot(base, sub(face[0], end[cube.base][0]))) > 1e-4); }
    else { near(cosine, 0); perpendicular.push(i); }
  });
  assert.deepEqual(parallel, [cube.par]); assert.equal(cube.net.faceName[cube.par], 'ㅂ'); assert.equal(perpendicular.length, 4);
  const prism = state('s4-3', 0).model.net.at(1), n = normal(prism[3]);
  near(Math.abs(dot(n, normal(prism[4]))), 1);
  for (let i = 0; i < 3; i++) near(dot(n, normal(prism[i])), 0);
});

test('folded edge coordinates verify all named/count answers and pyramid lateral edges share V', () => {
  for (const [id, index, expected, name] of [['s4-1', 0, 4, 'DG'], ['s4-3', 2, 3, null], ['s4-4', 2, 2, 'VD']]) {
    const { source, s, model, quiz } = state(id, index), c = counts(model.sol, model.ref);
    assert.equal(model.ref.name, 'AB'); assert.equal(c.skew, expected); assert.equal(c.skew, model.c.nSkew);
    if (name) {
      assert.equal(quiz.choices.find(c => c.ok).p, name);
      assert.equal(edgeRelation(model.sol, model.ref, model.sol.edges.find(e => e.name === name)), 'skew');
      const question = source.lessonQuestion(model, s, quiz);
      assert.equal(quiz.choices.length, 5);
      for (const option of quiz.choices) assert.ok(question.includes(option.p), 'actual options remain in the lesson question');
    } else assert.equal(quiz.choices.find(c => c.ok).p, `${expected}개`);
  }
  const pyramid = state('s4-4', 1).model, side = pyramid.sol.edges.filter(e => e.u === 'V' || e.v === 'V');
  assert.equal(side.length, 4);
  for (let i = 0; i < side.length; i++) for (let j = i + 1; j < side.length; j++) assert.equal(edgeRelation(pyramid.sol, side[i], side[j]), 'meet');
});

test('all twenty-six lessons move actual geometry in the first second and keep the answer panels hidden', () => {
  let n = 0;
  for (const id of ids) for (const [index] of core.lessonList(lab.def.lessons[id]).entries()) {
    const first = draw(id, index, 0), moved = draw(id, index, 1);
    assert.notEqual(signature(first), signature(moved), `${id}/${index}: first-second motion`);
    assert.equal(moved.value.readouts.length, 0); assert.equal(moved.value.formula, null);
    if (id.startsWith('s4')) { const s = state(id, index, 1).s; assert.ok(s.spFold > 0 && s.spFold < 1); }
    n++;
  }
  assert.equal(n, 26);
});

test('final answers and the essential intermediate counts follow their caption cues', () => {
  const finals = {
    's3-1': [/평면 1개/, /무수히 많아요/], 's3-2': [/평면 1개/, /무수히 많아요/],
    's3-3': [/평면 1개/, /평면 3개/, /평면 10개/], 's3-4': [/평면 1개/, /평면 3개/, /평면 10개/],
    's3-5': [/평면 0개/, /무수히 많아요/, /한 평면 위의 모서리 7개/],
    's3-6': [/서로 다른 평면 20개/, /서로 다른 평면 7개/, /서로 다른 평면 4개/],
    's4-1': [/보기의 정답: DG/, /꼬인 모서리 4개/], 's4-2': [/평행한 면: ㅂ/, /수직인 면:.*4개/],
    's4-3': [/두 삼각형 밑면은 서로 평행해요/, /세 옆면은 밑면과 수직이에요/, /꼬인 모서리 3개/],
    's4-4': [/V라는 한 점으로 모여요/, /옆모서리들은 V에서 만나므로 꼬인 위치가 아니에요/, /보기의 정답: VD/]
  };
  for (const [id, patterns] of Object.entries(finals)) patterns.forEach((pattern, index) => gate(id, index, 'spShowAnswer', pattern));
  for (const id of ['s3-3', 's3-4']) for (const [index, count] of [[1, 6], [2, 20]]) gate(id, index, 'spCountReady', new RegExp(`선택 .* = ${count}가지`));
  for (const [index, total, repeats, dup] of [[0, 56, 12, 36], [1, 10, 1, 3]]) {
    gate('s3-6', index, 'spFirstReady', new RegExp(`세 점을 고르는 방법 ${total}가지`));
    gate('s3-6', index, 'spSecondReady', new RegExp(`네 점 이상이 놓인 평면 ${repeats}개`));
    gate('s3-6', index, 'spDupReady', new RegExp(`중복해서 센 것 ${dup}가지 제외`));
  }
  gate('s3-5', 2, 'spFirstReady', /만나는 모서리 4개/); gate('s3-5', 2, 'spSecondReady', /평행한 모서리 3개/);
  for (const [id, index, parallel] of [['s4-1', 0, 3], ['s4-1', 1, 3], ['s4-3', 2, 1], ['s4-4', 2, 1]]) {
    gate(id, index, 'spMeetReady', /만나는 모서리 4개/); gate(id, index, 'spParReady', new RegExp(`평행한 모서리 ${parallel}개`));
  }
});

test('manual review and direct net manipulation keep the original behavior', () => {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go('s3-1'); lab.tab = 'review'; lab.s.step = 3;
  assert.ok(has(lab.draw(), /무수히 많아요/)); near(lab.s.spCd, 1.2, 'manual step uses a copy of the given state');
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go('s4-1'); lab.s.spFold = 0.45;
  const frame = lab.draw(); assert.ok(frame.handles.some(h => h.id === 'ref')); near(lab.s.spFold, 0.45);
});
