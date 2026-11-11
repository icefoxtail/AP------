// Independent closest-line calculations and essential production Board frames.
// This is not a physical-device visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/spatial-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['s1-1', 's1-2', 's1-3', 's1-4', 's1-5', 's1-6', 's1-7'];
const list = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => list(id).find(l => l.label === label);
const items = ids.flatMap(id => list(id).map(lesson => ({ id, lesson })));
const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
const sub = (a, b) => [a.x - b.x, a.y - b.y, a.z - b.z];
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const norm = a => Math.sqrt(dot(a, a));
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-7, `${msg}: ${a} versus ${b}`);
// Solve the two closest-point parameters with a 2×2 Gram matrix.
// Production uses a cross/scalar-triple product instead.
function relation(V, ref, edge) {
  if (ref.key === edge.key) return { kind: 'ref', distance: 0 };
  const A = V[ref.u], B = V[ref.v], C = V[edge.u], D = V[edge.v];
  const u = sub(B, A), v = sub(D, C), w = sub(A, C);
  const a = dot(u, u), b = dot(u, v), c = dot(v, v), d = dot(u, w), e = dot(v, w), det = a * c - b * b;
  if (Math.abs(det) < 1e-9 * a * c) return { kind: 'par' };
  const t = (b * e - c * d) / det, q = (a * e - b * d) / det;
  const gap = w.map((x, i) => x + t * u[i] - q * v[i]);
  const distance = norm(gap);
  return { kind: distance > 1e-7 ? 'skew' : t >= -1e-7 && t <= 1 + 1e-7 && q >= -1e-7 && q <= 1 + 1e-7 ? 'meet' : 'ext', distance, t, q };
}
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const timeline = video.compileLesson(lesson), state = video.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review'; lab.scene.view(lab.s, lab); lab.s.step = state.step;
  const model = lab.scene.sp.model(lab.s);
  return { model, timeline, question: lab.scene.question(lab.s), solidPoints: JSON.stringify(model.sol.verts), ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const rows = r => r.textItems.filter(t => t.screen && t.options?.color === 'green');

test('each numeric explanation agrees with independent line distances and its actual source question', () => {
  for (const { id, lesson } of items.filter(x => x.lesson.label !== '두모서리')) {
    const start = frame(id, lesson), end = final(id, lesson), M = end.model;
    const measured = { meet: [], ext: [], par: [], skew: [] };
    for (const edge of M.sol.edges) {
      const rel = relation(M.sol.verts, M.ref, edge);
      if (rel.kind !== 'ref') measured[rel.kind].push(edge.name);
    }
    for (const key of Object.keys(measured)) assert.deepEqual(measured[key].sort(), Array.from(M.g[key], e => e.name).sort(), `${id}/${lesson.label} ${key}`);
    assert.equal(Object.values(measured).reduce((n, a) => n + a.length, 0) + 1, M.total);
    assert.equal(M.nSkew, measured.skew.length);
    const Q = lab.scene.sp.prob(M, lab.s);
    assert.equal(Q.choices.filter(c => c.ok).length, 1);
    assert.equal(parseInt(Q.choices.find(c => c.ok).p, 10), measured.skew.length);
    assert.equal(end.question, Q.stem, 'numeric question uses the original problem');
    assert.ok(lesson.answer.includes(`${measured.skew.length}개`));
    assert.equal(start.solidPoints, end.solidPoints, 'given solid stays fixed');
    assert.equal(start.model.ref.key, M.ref.key, 'reference edge stays fixed');
    assert.equal(M.tgt, null, 'counting does not inherit the previous comparison edge');
    assert.equal(lab.s.spYaw, lesson.chapters[0].start.spYaw, 'source camera is not silently moved');
  }
});

test('all reference presets resolve to actual edge keys, including the trapezoid long base', () => {
  for (const id of ids) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
    for (const preset of lab.scene.sp.presets(lab.s)) {
      const s = { ...lab.s }; preset.apply(s); const M = lab.scene.sp.model(s);
      assert.ok(M.sol.edges.some(e => e.key === s.spRef), `${id} actual preset key`);
      assert.equal(M.ref.key, s.spRef, 'no silent fallback to another edge');
    }
  }
  const M = final('s1-3', find('s1-3', '긴밑변')).model;
  assert.equal(M.ref.key, 'DA');
  assert.equal(M.ref.name, 'DA');
  assert.deepEqual(Array.from(M.g.par, e => e.name).sort(), ['BC', 'FG', 'HE']);
  assert.equal(M.nSkew, 4);
});

test('trap edges are coplanar and intersect on extension, and their actual extension is animated', () => {
  for (const [id, label, names] of [['s1-3', '다리기준', ['CD']], ['s1-4', '밑면기준', ['CD', 'EF']], ['s1-7', '밑면기준', ['CD', 'DE']]]) {
    const lesson = find(id, label), zero = frame(id, lesson, 24), mid = frame(id, lesson, 26), full = frame(id, lesson, 28), M = full.model;
    assert.deepEqual(Array.from(M.g.ext, e => e.name).sort(), names);
    for (const e of M.g.ext) {
      const r = relation(M.sol.verts, M.ref, e);
      assert.equal(r.kind, 'ext'); close(r.distance, 0, 'extended lines meet');
      assert.ok(r.t < 0 || r.t > 1 || r.q < 0 || r.q > 1, 'meeting is outside at least one finite edge');
      close(M.sol.verts[M.ref.u].z, M.sol.verts[e.u].z, 'same base plane');
    }
    const ext = x => x.paths.filter(p => p.options.color === 'violet' && p.options.width === 3.2);
    assert.equal(ext(zero).length, 0); assert.ok(ext(mid).length > 0);
    assert.notEqual(geometry({ paths: ext(mid) }), geometry({ paths: ext(full) }), 'actual line extension grows');
    assert.ok(!frame(id, lesson, 29.49).texts.some(t => /만나요/.test(t)), 'relationship text waits for its caption');
    assert.ok(frame(id, lesson, 29.5).texts.some(t => /만나요/.test(t)));
  }
});

test('the selected pentagonal-prism pair is skew by closest distance and by its base-plane intersection', () => {
  const lesson = find('s1-7', '두모서리'), end = final('s1-7', lesson), M = end.model, V = M.sol.verts;
  assert.equal(M.n, 5); assert.equal(M.ref.name, 'AB'); assert.equal(M.tgt.name, 'DI');
  const measured = relation(V, M.ref, M.tgt);
  assert.equal(measured.kind, 'skew'); assert.ok(measured.distance > .1); assert.equal(M.tgtRel, 'skew');
  close(V.D.x, V.I.x, 'comparison edge vertical x'); close(V.D.y, V.I.y, 'comparison edge vertical y');
  close(V.A.z, V.D.z, 'D lies in the reference base plane'); assert.notEqual(V.I.z, V.D.z);
  const u = sub(V.B, V.A), w = sub(V.D, V.A), t = dot(w, u) / dot(u, u);
  assert.ok(norm(w.map((x, i) => x - t * u[i])) > .1, 'D is not on the infinite line AB');
  assert.ok(end.question.includes('AB') && end.question.includes('DI'));
  assert.ok(rows(end).some(r => r.text.includes('꼬인 위치')));
});

test('meet and parallel labels are cued, while final counts and green skew edges wait for the last cue', t => {
  let frames = 0;
  for (const { id, lesson } of items) {
    const v = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(v.errors, []); assert.deepEqual(v.warnings, []);
    const first = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(first.paths.some(p => p.options.color && p.points.length > 1), `${id}/${lesson.label} initial solid`);
    assert.notEqual(geometry(first), geometry(moving), `${id}/${lesson.label} first-second edge construction`);
    const reveal = first.timeline.cues.find(c => c.set?.spShowAnswer);
    assert.ok(reveal.at >= first.timeline.chapters.at(-1).at);
    const before = frame(id, lesson, reveal.at - .01), end = final(id, lesson);
    assert.equal(rows(before).length, 0);
    assert.equal(before.paths.filter(p => p.options.color === 'green').length, 0, 'skew classification is not pre-highlighted');
    assert.ok(rows(end).some(r => video.normAnswer(r.text).includes(video.normAnswer(lesson.answer))));
    assert.ok(end.paths.some(p => p.options.color === 'green'), 'actual skew edge is shown with the result');
    Object.assign(lab.s, { lessonOn: false, lessonEntry: true });
    const entry = lab.draw(); assert.equal(rows(entry).length, 0); assert.ok(!entry.paths.some(p => p.options.color === 'green'));
    const reset = video.stateAt(first.timeline, 0, { nums: lab.s, sets: lab.s, step: 99 });
    for (const key of ['spShowAnswer', 'spMeetReady', 'spExtReady', 'spParallelReady']) assert.equal(reset.sets[key], false);
    assert.equal(reset.nums.spTrace, 0); assert.equal(reset.nums.spExt, 0); assert.equal(reset.nums.spSeed, 0);
    frames += 5;
  }
  const cube = find('s1-1', '밑면기준');
  assert.ok(!frame('s1-1', cube, 11.99).texts.some(t => t.includes('끝점에서 만남:')));
  assert.ok(frame('s1-1', cube, 12).texts.some(t => t.includes('끝점에서 만남:') && t.includes('4개')));
  assert.ok(!frame('s1-1', cube, 23.99).texts.some(t => t.startsWith('평행:')));
  assert.ok(frame('s1-1', cube, 24).texts.some(t => t.startsWith('평행:') && t.includes('3개')));
  t.diagnostic(`${items.length} explanations, ${frames} essential Board frames plus intermediate cues; physical mobile visual QA NOT_RUN`);
});

test('lesson-only state does not change manual solids, handles or questions', () => {
  for (const id of ids) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'explore';
    const before = lab.draw(), question = lab.scene.question(lab.s);
    Object.assign(lab.s, { spShowAnswer: true, spMeetReady: true, spExtReady: true, spParallelReady: true, spLessonMode: 'unused-manual-mode', spTrace: .3 });
    const after = lab.draw();
    assert.equal(geometry(after), geometry(before), `${id} manual geometry`);
    assert.ok(after.handles.length > 0, `${id} manual reference-edge handle`);
    assert.equal(lab.scene.question(lab.s), question, `${id} original question`);
  }
});
