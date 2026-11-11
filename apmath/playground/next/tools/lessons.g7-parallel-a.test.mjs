// Source-angle mathematics and essential cues, not a physical mobile audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/parallel-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['p1-1', 'p1-2', 'p1-3', 'p2-1', 'p2-3', 'p2-2'];
const list = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => list(id).find(l => l.label === label);
const items = ids.flatMap(id => list(id).map(lesson => ({ id, lesson })));
const close = (a, b, reason) => assert.ok(Math.abs(a - b) < 1e-7, `${reason}: ${a} versus ${b}`);
const at = (p, d) => ({ x: p.x + Math.cos(d * Math.PI / 180), y: p.y - Math.sin(d * Math.PI / 180) });
const angle = (v, a, b) => {
  const u = [a.x - v.x, a.y - v.y], w = [b.x - v.x, b.y - v.y];
  return Math.atan2(Math.abs(u[0] * w[1] - u[1] * w[0]), u[0] * w[0] + u[1] * w[1]) * 180 / Math.PI;
};
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = video.compileLesson(lesson), state = video.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review'; lab.scene.view(lab.s, lab); lab.s.step = state.step;
  return { model: lab.scene.pa.model(lab.s), timeline, ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const row = result => result.textItems.filter(t => t.screen && t.options?.color === 'green' && Math.abs(t.y - lab.board.insets.top - 17) < 1e-9);

test('position buttons and the numeric parallel-line question agree with the actual angle rays and choices', () => {
  for (const lesson of list('p1-1')) {
    const M = final('p1-1', lesson).model, target = lesson.label === '동위각' ? 'g' : 'f';
    assert.equal(M.tar, 'c'); assert.equal(M.tkind, lesson.label === '동위각' ? 'corr' : 'alt');
    assert.notEqual(M.G.W.c.at, M.G.W[target].at, 'pair comes from different intersections');
    const values = [M.G.W.c, M.G.W[target]].map(w => angle(w.V, at(w.V, w.d1), at(w.V, w.d2)));
    close(values[0], 65, 'first angle'); close(values[1], 65, 'partner angle');
    assert.equal(lab.scene.pa.prob(M).choices.find(x => x.ok).p, '∠' + target);
  }
  for (const label of ['동위각조건', '엇각조건']) {
    const M = final('p1-2', find('p1-2', label)).model;
    assert.equal(M.phi, 0); assert.equal(M.v1, 65); assert.equal(M.v2, 65);
    close(angle(M.G.P, at(M.G.P, M.G.W[M.n1].d1), at(M.G.P, M.G.W[M.n1].d2)), 65, 'upper angle');
    close(angle(M.G.Q, at(M.G.Q, M.G.W[M.n2].d1), at(M.G.Q, M.G.W[M.n2].d2)), 65, 'lower angle');
  }
  const M = final('p1-2', find('p1-2', '각크기')).model;
  assert.equal(M.given, 'a'); assert.equal(M.ask, 'f');
  assert.equal(M.G.W.a.val, 115); assert.equal(M.G.W.e.val, 115); assert.equal(M.G.W.f.val, 65);
  close(M.G.W.e.val + M.G.W.f.val, 180, 'adjacent angles form a straight angle');
  assert.equal(lab.scene.pa.prob(M).choices.find(x => x.ok).v, 65);
});

test('all five actual judge choices are bound to the lesson and leave the prior random question untouched', () => {
  const lesson = find('p1-3', '보기판별'), first = frame('p1-3', lesson);
  const manual = lab.s.rList, serialized = JSON.stringify(manual), definition = lab.scene.pa;
  const expected = [[70, 90, 'corr'], [70, 110, 'alt'], [60, 80, 'corr'], [100, 115, 'alt'], [65, 65, 'corr']];
  const timeline = first.timeline;
  for (let i = 0; i < expected.length; i++) {
    const state = video.stateAt(timeline, i * 10, { nums: lab.s, sets: lab.s, step: 0 });
    Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, rReviewQuestion: true, rReviewTab: 'review', step: 6, papick: { idx: 2 } });
    const M = definition.model(lab.s), rendered = lab.draw();
    assert.equal(M.pickIdx, i, 'lesson case wins over stale manual answer selection');
    assert.deepEqual([M.vP, M.vQ, M.kind], expected[i]);
    const base = rendered.paths.filter(p => p.options.color === 'sky' && p.options.width === 3.4);
    assert.equal(base.length, 2, 'two actual straight lines');
    const slope = base[1].points.at(-1).y - base[1].points[0].y;
    if (i === 4) close(slope, 0, 'only the fifth pair is parallel'); else assert.ok(Math.abs(slope) > .1, 'different angles give nonparallel lines');
    const problem = definition.prob(M, lab.s);
    assert.equal(problem.choices.length, 5); assert.equal(problem.choices.filter(c => c.ok).length, 1); assert.equal(problem.choices.findIndex(c => c.ok), 4);
    for (let j = 0; j < 5; j++) assert.ok(problem.choices[j].html.includes(`${expected[j][0]}°와 ${expected[j][1]}°`), 'SVG contains the corresponding given angles');
    assert.equal(lab.s.rList, manual); assert.equal(JSON.stringify(lab.s.rList), serialized);
    assert.equal(lab.s.rReviewQuestion, true, 'manual review state is preserved');
  }
  const trap = final('p1-3', find('p1-3', '합180함정')).model;
  assert.equal(trap.vP + trap.vQ, 180); assert.equal(trap.eq, false);
});

test('both bend directions preserve the given angles and the rotating helper does not change them', () => {
  for (const id of ['p2-1', 'p2-3']) for (const lesson of list(id)) {
    const first = frame(id, lesson), end = final(id, lesson), M = end.model;
    assert.deepEqual([first.model.a, first.model.b, first.model.P.x], [M.a, M.b, M.P.x], 'given angles and bend location stay fixed');
    close(angle(M.P, M.A, M.B), 80, 'actual bend angle');
    const horizontal = { x: M.P.x - M.sx, y: M.P.y };
    close(angle(M.P, M.A, horizontal), M.a, 'first alternate angle');
    close(angle(M.P, horizontal, M.B), M.b, 'second alternate angle');
    if (lesson.label === '보조선조건') {
      assert.equal(first.model.psi, 28); assert.equal(M.psi, 0); assert.equal(M.ok, true);
    } else assert.equal(M.xf, 80);
  }
  assert.equal(final('p2-3', find('p2-3', '오른쪽꺾임')).model.sx, 1);
  assert.equal(final('p2-3', find('p2-3', '왼쪽꺾임')).model.sx, -1);
});

test('one, two and three bends have matching open-direction sums from independent coordinate angles', () => {
  for (const [index, lesson] of list('p2-2').entries()) {
    const M = final('p2-2', lesson).model, V = M.V, n = V.length;
    const measured = V.map((p, i) => i === 0 ? angle(p, { x: p.x + 1, y: p.y }, V[1]) : i === n - 1 ? angle(p, { x: p.x + (M.k % 2 ? 1 : -1), y: p.y }, V[i - 1]) : angle(p, V[i - 1], V[i + 1]));
    const right = measured.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0), left = measured.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0);
    close(right, left, 'right and left opening sums'); close(right, M.sumR, 'source right sum'); close(left, M.sumL, 'source left sum');
    measured.forEach((value, i) => close(value, M.W[i].val, 'actual angle ' + i));
    assert.equal(M.k, index + 1); assert.equal(M.tar, index === 2 ? 3 : 1);
    close(measured[M.tar], index === 2 ? 105 : 95, 'unknown angle');
    assert.equal(lab.scene.pa.prob(M).choices.find(c => c.ok).v, index === 2 ? 105 : 95);
  }
});

test('given angles remain visible and derived angles or sums wait for their captions', () => {
  const condition = find('p1-2', '각크기');
  const first = frame('p1-2', condition);
  assert.ok(first.texts.includes('a=115°')); assert.ok(first.texts.includes('x'));
  assert.ok(!frame('p1-2', condition, 11.99).texts.includes('e=115°'));
  assert.ok(frame('p1-2', condition, 12).texts.includes('e=115°'));
  assert.ok(!frame('p1-2', condition, 29).texts.includes('x=65°'));
  for (const [i, lesson] of list('p2-2').entries()) {
    const first = frame('p2-2', lesson);
    assert.ok(first.texts.includes('55°') && first.texts.includes('x'));
    assert.ok(!first.texts.includes(i === 2 ? '105°' : '95°'), 'unknown bend has no early numeric label');
    if (i === 1) {
      assert.ok(first.texts.includes('100°') && first.texts.includes('60°'), 'interior and endpoint givens are retained');
      assert.ok(!frame('p2-2', lesson, 17.49).texts.some(t => t.includes('= 155°')));
      assert.ok(frame('p2-2', lesson, 17.5).texts.some(t => t.includes('= 155°')));
    }
  }
});

test('sixteen explanations draw immediately, animate in the first second, and disclose their answer only at the final cue', t => {
  assert.equal(items.length, 16);
  let frames = 0;
  const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
  for (const { id, lesson } of items) {
    const validation = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id + ' errors'); assert.deepEqual(validation.warnings, [], id + ' warnings');
    const start = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(start.paths.length > 0, `${id}:${lesson.label} first geometry`);
    assert.notEqual(geometry(start), geometry(moving), `${id}:${lesson.label} actual motion`);
    const reveal = start.timeline.cues.find(c => c.set?.paShowAnswer === true);
    const before = frame(id, lesson, reveal.at - .01), end = final(id, lesson);
    assert.equal(row(before).length, 0, `${id}:${lesson.label} hides final answer`);
    assert.equal(row(end).length, 1, `${id}:${lesson.label} final answer row`);
    assert.ok(video.normAnswer(row(end)[0].text).includes(video.normAnswer(lesson.answer)), `${id}:${lesson.label} final answer agrees`);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: true });
    assert.equal(row(lab.draw()).length, 0, `${id}:${lesson.label} entry masks stale conclusion`);
    const reset = video.stateAt(start.timeline, 0, { nums: lab.s, sets: lab.s, step: 0 });
    assert.equal(reset.sets.paShowAnswer, false); assert.equal(reset.sets.paSupportReady, false); assert.equal(reset.sets.paCaseReady, false); assert.equal(reset.sets.paCase, 0);
    frames += 5;
  }
  t.diagnostic(`${frames} essential Board frames plus intermediate cues; physical mobile visual QA NOT_RUN`);
});
