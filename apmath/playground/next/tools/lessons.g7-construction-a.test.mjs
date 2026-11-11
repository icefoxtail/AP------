// Independent compass/triangle calculations and essential production Board cues.
// These checks do not certify mobile layout or physical-device playback quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/construction-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['c1-1', 'c1-2', 'c1-3', 'c1-4', 'c1-5', 'c2-1', 'c2-2', 'c2-3'];
const list = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => list(id).find(l => l.label === label);
const items = ids.flatMap(id => list(id).map(lesson => ({ id, lesson })));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} versus ${b}`);
const length = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const plus = (a, b) => a.map((x, i) => x + b[i]);
const times = (a, k) => a.map(x => x * k);
const paths = frame => JSON.stringify({ paths: frame.paths.map(({ points, options }) => ({ points, options })), arcs: frame.arcs });
function frame(id, lesson, time = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const timeline = video.compileLesson(lesson);
  const state = video.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, playing: false, dragging: !entry });
  lab.tab = entry ? 'explore' : 'review'; lab.scene.view(lab.s, lab); lab.s.step = entry ? 0 : state.step;
  const D = lab.scene.cn, raw = D.model(lab.s), M = D.lessonModel ? D.lessonModel(raw, lab.s) : lab.s.cnLessonProblem && D.reviewModel ? D.reviewModel(raw, lab.s) : raw;
  const arcs = [], originalArc = lab.board.arc;
  lab.board.arc = function (center, radius, from, to, options) {
    arcs.push({ center: { x: center.x, y: center.y }, radius, from, to, options });
    return originalArc.call(this, center, radius, from, to, options);
  };
  try { return { ...lab.draw(), arcs, D, M, raw, state, timeline, question: lab.scene.question(lab.s), Q: D.prob(raw) }; }
  finally { lab.board.arc = originalArc; }
}
const end = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
function answerTime(lesson) {
  let offset = 0;
  for (const chapter of lesson.chapters) {
    const cue = chapter.cues.find(c => c.set?.cnShowAnswer === true);
    if (cue) return offset + cue.at;
    offset += chapter.length;
  }
  assert.fail('a conclusion cue is required');
}
function assertEqualityChoices(Q, points) {
  const segLength = name => length(points[name[0]], points[name[1]]);
  for (const choice of Q.choices) {
    const segments = [...choice.p.matchAll(/\\overline\{([A-Z]{2})\}/g)].map(m => m[1]);
    assert.equal(segments.length, 2);
    const equal = Math.abs(segLength(segments[0]) - segLength(segments[1])) < 1e-7;
    assert.equal(choice.ok, !equal, 'the source asks for the incorrect equality');
  }
  assert.equal(Q.choices.filter(c => c.ok).length, 1);
}
// Heron's area calculation is independent of production's longest-side comparison.
function areaSquared(a, b, c) { const s = (a + b + c) / 2; return s * (s - a) * (s - b) * (s - c); }
const possible = (a, b, c) => a > 0 && b > 0 && c > 0 && areaSquared(a, b, c) > 1e-8;

test('all authored lessons reset their model branch and visibly move actual geometry in the first second', () => {
  for (const id of ids) {
    const report = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
  }
  for (const { id, lesson } of items) {
    const zero = frame(id, lesson), moving = frame(id, lesson, 0.75);
    assert.ok(zero.paths.length > 0, `${id}/${lesson.label}: first frame retains the figure`);
    assert.notEqual(paths(zero), paths(moving), `${id}/${lesson.label}: a visible line, arc or rod really moves`);
    assert.equal(typeof zero.state.sets.cnLessonProblem, 'boolean');
    assert.equal(zero.state.sets.cnShowAnswer, false);
    const time = answerTime(lesson), lastStart = lesson.chapters.slice(0, -1).reduce((n, c) => n + c.length, 0);
    assert.ok(time >= lastStart, 'final-answer cue occurs in the final chapter');
    frame(id, lesson, time - .01); assert.equal(lab.s.cnShowAnswer, false);
    end(id, lesson); assert.equal(lab.s.cnShowAnswer, true);
    const entry = frame(id, lesson, 0, true);
    assert.equal(lab.s.cnShowAnswer, false); assert.equal(entry.value.card, null);
    assert.deepEqual(Array.from(entry.value.readouts), []);
    if (lab.s.cnLessonProblem) {
      assert.ok(entry.question.includes(entry.Q.html || entry.Q.stem), 'fixed original question is retained');
      for (const c of entry.Q.choices) assert.ok(entry.question.includes(c.h != null ? c.h : '$' + c.t + '$'), 'all original choices are visible without revealing a selected answer');
    }
  }
});

test('tool questions and copied lengths agree with the original fixed choices', () => {
  const L = end('c1-1', find('c1-1', '길이문제'));
  const phi = L.M.phi * Math.PI / 180, P = [.6, 0], Q = [.6 + L.M.L * Math.cos(phi), -L.M.L * Math.sin(phi)];
  close(length(P, Q), 3, 'compass radius is preserved');
  close(parseFloat(L.Q.choices.find(c => c.ok).p), length(P, Q), 'source correct length');
  assert.ok(L.texts.includes('PQ = 3 cm'));
  const choices = end('c1-1', find('c1-1', '도구판별')).Q.choices;
  assert.equal(choices.findIndex(c => c.ok), 4);
  assert.equal(choices.find(c => c.ok).p, '두 점을 지나는 직선을 긋는다.');
  const before = frame('c1-1', find('c1-1', '길이문제'), 29.49);
  assert.ok(before.texts.includes('AB = 3 cm'), 'given length stays visible');
  assert.ok(!before.texts.some(t => /^PQ =/.test(t)), 'copied numerical answer waits for its cue');
});

test('copied angles use equal radii and equal chords, and the source wrong equality is genuinely false', () => {
  for (const lesson of list('c1-2')) {
    const final = end('c1-2', lesson), { th, r } = final.M, rad = -th * Math.PI / 180;
    const O = [0, 0], P = [6, 0], A = [r, 0], B = [r * Math.cos(rad), r * Math.sin(rad)], C = [6 + r, 0], D = plus(P, B);
    for (const [center, point] of [[O, A], [O, B], [P, C], [P, D]]) close(length(center, point), r, 'fixed compass radius');
    close(length(A, B), length(C, D), 'transferred chord');
    const ray = final.paths.find(p => p.options.color === 'green' && p.options.width === 3.4);
    assert.ok(ray, 'completed ray is drawn');
    const [origin, tip] = ray.points;
    close(origin.x, P[0], 'ray starts at P'); close(origin.y, P[1], 'ray starts at P');
    close(-Math.atan2(tip.y - origin.y, tip.x - origin.x) * 180 / Math.PI, th, 'drawn copied angle');
    if (lesson.label === '선분관계') {
      assert.equal(th, 40); assertEqualityChoices(final.Q, { O, P, A, B, C, D });
      assert.ok(Math.abs(length(O, A) - length(A, B)) > .1, 'radius and chord are not accidentally equal');
    } else assert.equal(th, 55, 'concept uses its original exploration angle');
    const pre = frame('c1-2', lesson, 45.49), after = frame('c1-2', lesson, 45.5);
    assert.equal(pre.texts.filter(t => t === `${th}°`).length, 1, 'only the given angle is labeled before the conclusion');
    assert.equal(after.texts.filter(t => t === `${th}°`).length, 2);
  }
});

test('parallel constructions retain the chosen corresponding or alternate angle and the actual equal-length choices', () => {
  for (const id of ['c1-3', 'c1-4']) for (const lesson of list(id)) {
    const final = end(id, lesson), M = final.M, a = -M.al * Math.PI / 180, dl = [Math.cos(a), Math.sin(a)], n = [dl[1], -dl[0]];
    const Q = [0, 0], P = plus(times(dl, M.px), times(n, M.ph)), magnitude = Math.hypot(...P), u = times(P, 1 / magnitude), sign = M.mode === 'alt' ? -1 : 1;
    const A = times(dl, M.r), B = times(u, M.r), C = plus(P, times(u, sign * M.r)), D = plus(P, times(dl, sign * M.r));
    for (const [center, point] of [[Q, A], [Q, B], [P, C], [P, D]]) close(length(center, point), M.r, 'parallel construction radius');
    close(length(A, B), length(C, D), 'equal chords produce equal angles');
    const ray = final.paths.find(p => p.options.color === 'green' && p.options.width === 3.4);
    assert.ok(ray); const [U, V] = ray.points;
    close((V.x - U.x) * dl[1] - (V.y - U.y) * dl[0], 0, 'new line is parallel to l');
    close((P[0] - U.x) * (V.y - U.y) - (P[1] - U.y) * (V.x - U.x), 0, 'new line passes through P');
    if (lesson.label === '선분관계') assertEqualityChoices(final.Q, { Q, P, A, B, C, D });
    if (id === 'c1-4' && lesson.label !== '엇각작도') {
      const property = sign < 0 ? '엇각' : '동위각';
      assert.ok(final.Q.choices.find(c => c.ok).p.startsWith(property));
      assert.ok(lesson.answer.startsWith(property));
    }
  }
});

test('construction-order choices obey the actual prerequisites and keep both radius-copy orders possible', () => {
  const lesson = find('c1-5', '순서문제'), final = end('c1-5', lesson), symbols = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const prerequisites = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [4, 5]];
  const valid = order => new Set(order).size === 6 && prerequisites.every(([before, after]) => order.indexOf(before) < order.indexOf(after));
  assert.ok(valid([0, 1, 2, 3, 4, 5])); assert.ok(valid([0, 2, 1, 3, 4, 5]));
  for (const c of final.Q.choices) {
    const order = c.p.split(' → ').map(symbol => final.M.perm[symbols.indexOf(symbol)]);
    assert.equal(c.ok, valid(order), c.p);
  }
  assert.equal(final.Q.choices.findIndex(c => c.ok), 1);
  for (const t of [5.5, 15.5, 25.5, 35.5, 45.5, 55.5]) {
    const f = frame('c1-5', lesson, t);
    close(lab.s.cnOrderT, (Math.floor(t / 10) + 1) / 6, 'each original construction stage reaches its end');
    assert.ok(f.paths.length > 0);
  }
});

test('triangle questions agree with independent area and integer enumeration instead of copied formulas', () => {
  for (const lesson of list('c2-1')) {
    const final = end('c2-1', lesson), sides = Array.from(final.M.it, p => p.v);
    assert.equal(final.M.ok, possible(...sides));
    if (lab.s.cnLessonProblem) {
      const { a, b, kind } = final.M.pk;
      for (const c of final.Q.choices) assert.equal(c.ok, kind ? possible(a, b, parseFloat(c.p)) : !possible(a, b, parseFloat(c.p)), c.p);
      assert.ok(lesson.answer.startsWith(final.Q.choices.find(c => c.ok).p.split(' ')[0]));
    } else if (lesson.label === '같은합') close(areaSquared(...sides), 0, 'equality produces zero area');
  }
  for (const lesson of list('c2-2')) {
    const final = end('c2-2', lesson), M = final.M;
    const integers = Array.from({ length: 30 }, (_, i) => i + 1).filter(x => possible(M.a, M.b, x));
    assert.deepEqual(integers, lab.s.cnLessonProblem ? [5, 6, 7, 8, 9] : [4, 5, 6, 7, 8, 9, 10]);
    close(areaSquared(M.a, M.b, M.lo), 0, 'lower endpoint is degenerate');
    close(areaSquared(M.a, M.b, M.hi), 0, 'upper endpoint is degenerate');
    if (lab.s.cnLessonProblem) {
      const wanted = M.pk.kind === 1 ? Math.max(...integers) : M.pk.kind === 2 ? Math.min(...integers) : integers.length;
      assert.equal(parseFloat(final.Q.choices.find(c => c.ok).p), wanted);
    }
  }
  for (const lesson of list('c2-3')) {
    const final = end('c2-3', lesson), measured = Array.from(final.M.cards, c => possible(...c.t));
    assert.deepEqual(measured, lab.s.cnLessonProblem ? [true, false, false, false] : [true, false, true, true]);
    for (const [i, c] of final.M.cards.entries()) assert.equal(c.ok, measured[i]);
    assert.equal(final.M.n, measured.filter(Boolean).length);
    if (lab.s.cnLessonProblem) assert.equal(parseInt(final.Q.choices.find(c => c.ok).p, 10), measured.filter(Boolean).length);
  }
});

test('intermediate sums, intervals, card verdicts and answers appear at their spoken cues', () => {
  const concept = find('c2-1', '성립조건');
  assert.ok(!frame('c2-1', concept, 11.99).texts.some(t => t.startsWith('나머지 두 막대의 합')));
  const sum = frame('c2-1', concept, 12);
  assert.ok(sum.texts.some(t => t.includes('4+6 = 10')));
  assert.ok(!sum.texts.some(t => t.startsWith('가장 긴 막대 =')));
  assert.ok(frame('c2-1', concept, 24).texts.some(t => t.includes('9  <  10')));
  assert.ok(!frame('c2-1', concept, 29.49).texts.some(t => t.includes('삼각형을 만들 수 있어요')));
  assert.ok(frame('c2-1', concept, 29.5).texts.some(t => t.includes('삼각형을 만들 수 있어요')));
  for (const label of ['불가능값', '가능한값']) {
    const lesson = find('c2-1', label), pre = frame('c2-1', lesson, 23.99);
    assert.ok(pre.texts.includes('? cm'), 'unknown third length is not drawn from the review answer early');
    assert.ok(pre.texts.includes('2 < x < 12'));
    assert.ok(!pre.texts.some(t => t.startsWith('c=')));
    assert.ok(frame('c2-1', lesson, 24).texts.some(t => t.startsWith('c=')));
  }
  const range = find('c2-2', '범위'), count = find('c2-2', '정수개수');
  assert.ok(!frame('c2-2', range, 29.49).texts.some(t => t.startsWith('x의 범위:')));
  assert.ok(frame('c2-2', range, 29.5).texts.includes('x의 범위: 3 < x < 11'));
  assert.ok(frame('c2-2', count, 24).texts.includes('x의 범위: 4 < x < 10'));
  assert.ok(!frame('c2-2', count, 41.49).texts.includes('정수 x는 5개'));
  assert.ok(frame('c2-2', count, 41.5).texts.includes('정수 x는 5개'));
  const four = find('c2-3', '조합문제');
  for (const [time, count] of [[15.99, 0], [16, 1], [20, 2], [24, 3], [29.5, 4]]) {
    const f = frame('c2-3', four, time);
    assert.equal(f.texts.filter(t => t === '✓' || t === '✗').length, count, 'card comparisons follow their own cue');
  }
  assert.ok(!frame('c2-3', four, 41.49).texts.some(t => t.startsWith('삼각형을 만들 수 있는 경우:')));
  assert.ok(frame('c2-3', four, 41.5).texts.includes('삼각형을 만들 수 있는 경우: 1가지'));
});
