// Minimum source/Board checks; these do not replace mobile visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/construction-lesson-runtime.mjs';
const require = createRequire(import.meta.url), video = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['c4-1', 'c4-2', 'c4-3', 'c6-1', 'c6-2', 'c6-3', 'c6-4'];
const close = (a, b, label = '') => assert.ok(Math.abs(a - b) < 1e-8, `${label}: ${a} != ${b}`);
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const angle = (o, p, q) => {
  const u = [p.x - o.x, p.y - o.y], v = [q.x - o.x, q.y - o.y];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)))) * 180 / Math.PI;
};
const rotate = (p, o, deg) => {
  const a = deg * Math.PI / 180, x = p.x - o.x, y = p.y - o.y;
  return { x: o.x + x * Math.cos(a) - y * Math.sin(a), y: o.y + x * Math.sin(a) + y * Math.cos(a) };
};
const pointEqual = (p, q) => distance(p, q) < 1e-8;
const area = points => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const source = lab.scene.cn, lesson = video.lessonList(lab.def.lessons[id])[index], compiled = video.compileLesson(lesson);
  const initial = { ...lab.s, ...compiled.start };
  const value = video.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false };
  const original = source.model(s), model = s.cnLessonProblem && source.reviewModel ? source.reviewModel(original, s) : original;
  return { s, source, lesson, compiled, model, quiz: source.prob(original, s) };
}
function draw(id, index = 0, time, entry = false, stale = false) {
  const value = state(id, index, time);
  Object.assign(lab.s, value.s, { lessonOn: !entry, lessonEntry: entry });
  if (stale) lab.s.cnShowAnswer = true;
  lab.tab = 'review';
  return { ...value, frame: lab.draw() };
}
const triangles = frame => frame.paths.filter(p => p.points.length === 3 && p.options.close && p.options.color === 'ink').map(p => p.points);

test('seven correspondence and hidden-congruence scenes have twenty-four valid independently reset lessons', () => {
  let count = 0;
  for (const id of ids) {
    const valid = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(valid.errors, [], id); assert.deepEqual(valid.warnings, [], id);
    for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
      count++;
      const first = state(id, i, 0), end = state(id, i);
      assert.equal(typeof first.s.cnLessonProblem, 'boolean');
      assert.equal(first.s.cnShowAnswer, false); assert.equal(end.s.cnShowAnswer, true);
      const reveal = end.compiled.cues.filter(c => c.set?.cnShowAnswer === true);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, end.lesson.chapters.length - 1);
      const previous = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous playback']));
      const rewind = video.stateAt(end.compiled, 0, { nums: first.s, sets: previous, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key]);
      if (first.s.cnLessonProblem) {
        assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
        const question = first.source.lessonQuestion(first.model, first.s, first.quiz);
        assert.ok(question.includes(first.quiz.stem));
        assert.doesNotMatch(question, /\b(?:undefined|NaN)\b/, `${id}/${i}: no missing choice data`);
      }
    }
  }
  assert.equal(count, 24);
});

test('lesson questions retain all five formatted choices from the original problem at entry and during playback', () => {
  let checked = 0;
  for (const id of ids) for (const [index] of video.lessonList(lab.def.lessons[id]).entries()) {
    const first = state(id, index, 0);
    if (!first.s.cnLessonProblem) continue;
    for (const [time, entry] of [[0, true], [0, false], [first.compiled.length, false]]) {
      const value = state(id, index, time);
      Object.assign(lab.s, value.s, { lessonOn: !entry, lessonEntry: entry });
      const question = lab.scene.question(lab.s), manual = lab.scene.problem.text(lab.s);
      const originalChoices = [...manual.matchAll(/<span class="v">([\s\S]*?)<\/span>/g)].map(match => match[1]);
      const lessonChoices = [...question.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(match => match[1]);
      assert.equal(originalChoices.length, 5, `${id}/${index}: five original choices`);
      assert.deepEqual(lessonChoices, originalChoices, `${id}/${index}: choice text, math formatting and order are preserved`);
      assert.doesNotMatch(question, /\b(?:undefined|NaN)\b/);
      checked++;
    }
  }
  assert.ok(checked >= 30, 'both text and numeric problems are checked in all three states');
});

test('actual correspondence labels and drawn side/angle conditions agree with the three original problem types', () => {
  const expected = ['점 E', '$\\overline{EF}$', '$\\angle D$'];
  for (let i = 1; i <= 3; i++) {
    const value = state('c4-1', i), first = draw('c4-1', i, 0), end = draw('c4-1', i);
    assert.equal(value.quiz.choices.find(c => c.ok).h, expected[i - 1]);
    assert.equal(value.model.imageNames, 'EFD');
    const tr = triangles(first.frame), merged = triangles(end.frame);
    assert.ok(tr.length >= 2); assert.ok(distance(tr[0][0], tr[tr.length - 1][0]) > 1);
    assert.ok(merged[0].every((p, index) => pointEqual(p, merged[merged.length - 1][index])));
  }
  for (const [i, expectedX] of [[0, 4], [1, 15]]) {
    const { frame, s, model } = draw('c4-3', i, 0), tr = triangles(frame);
    assert.equal(tr.length, 2);
    if (!i) {
      close(distance(tr[0][1], tr[0][2]), 9); close(distance(tr[1][1], tr[1][2]), 9);
      close((distance(tr[1][1], tr[1][2]) - model.pk.m) / model.pk.k, expectedX);
    } else {
      close(angle(tr[0][1], tr[0][0], tr[0][2]), 50); close(angle(tr[1][1], tr[1][0], tr[1][2]), 50);
      close((angle(tr[1][1], tr[1][0], tr[1][2]) - model.pk.q) / model.pk.p, expectedX);
    }
    assert.equal(s.cnLessonProblem, true);
  }
});

test('c4-3 angle conditions stay distinct and inside the canvas throughout mobile and desktop playback', () => {
  const separate = (a, b) => a.r + 3 <= b.l || b.r + 3 <= a.l || a.b + 3 <= b.t || b.b + 3 <= a.t;
  const box = item => {
    const w = [...item.text].reduce((sum, ch) => sum + item.size * (/\s/.test(ch) ? .32 : ch.charCodeAt(0) >= 0x1100 ? 1 : .7), 0) + 4;
    return { text: item.text, l: item.x - w / 2, r: item.x + w / 2, t: item.y - item.size / 2 - 2, b: item.y + item.size / 2 + 2 };
  };
  const value = state('c4-3', 1, 0), times = new Set([0, 18, value.compiled.length]);
  for (let time = 0; time < value.compiled.length; time += .25) times.add(time);
  for (const cue of value.compiled.cues) times.add(Math.min(cue.at + .001, value.compiled.length));
  try {
    for (const [width, height] of [[360, 326], [390, 529], [390, 629], [1024, 650]]) {
      lab.setViewportWidth(width); lab.board.resize(width, height);
      for (const time of times) {
        const { frame } = draw('c4-3', 1, time), labels = frame.textItems.map(box);
        const conditions = ['60°', '(3x+5)°', '50°'].map(text => {
          const label = labels.find(item => item.text === text); assert.ok(label, `${width}/${time}: ${text} remains visible`); return label;
        });
        const names = labels.filter(item => /^[A-F]$/.test(item.text));
        for (const label of [...conditions, ...names]) assert.ok(label.l >= 2 && label.r <= width - 2 && label.t >= 2 && label.b <= height - 2, `${width}/${time}: ${label.text} remains inside canvas`);
        for (const label of conditions) for (const other of [...conditions, ...names]) if (label !== other) assert.ok(separate(label, other), `${width}/${time}: ${label.text} overlaps ${other.text}`);
        const [original, image] = triangles(frame);
        close(angle(original[0], original[1], original[2]), 60, 'original angle A');
        close(angle(original[1], original[0], original[2]), 50, 'original angle B');
        close(angle(image[1], image[0], image[2]), 50, 'corresponding angle E');
      }
    }
  } finally { lab.setViewportWidth(1440); lab.board.resize(1000, 650); }
});

test('equal-area counterexamples use actual unequal triangles and correspondence order matches measured sides', () => {
  const { model } = state('c4-2', 0), { g } = model;
  assert.deepEqual(Array.from(g.sg), [1, 2, 0]);
  for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) close(distance(g.Tr[a], g.Tr[b]), distance(g.posOf[g.sg[a]], g.posOf[g.sg[b]]));
  const rectangle = state('c4-2', 1).model;
  assert.equal(rectangle.Rw * rectangle.Rh, 24); assert.equal(rectangle.Rw2, 8);
  assert.notDeepEqual([rectangle.Rw, rectangle.Rh].sort(), [rectangle.Rw2, 24 / rectangle.Rw2].sort());
  const tr = triangles(draw('c4-2', 2).frame);
  assert.equal(tr.length, 2); close(area(tr[0]), 12); close(area(tr[1]), 12);
  const sides = t => t.map((p, i) => distance(p, t[(i + 1) % 3])).sort((a, b) => a - b);
  assert.notDeepEqual(sides(tr[0]), sides(tr[1]));
});

test('independent rigid transforms map each hidden triangle to its named correspondence', () => {
  for (const id of ['c6-1', 'c6-2', 'c6-3', 'c6-4']) for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
    const { model } = state(id, i), g = model.g || model;
    let before, after, transformed;
    if (id === 'c6-1') { before = [g.B, g.C, g.D]; after = [g.A, g.C, g.E]; transformed = before.map(p => rotate(p, g.C, 60)); }
    if (id === 'c6-2') { before = [g.A, g.B, g.D]; after = [g.A, g.C, g.E]; transformed = before.map(p => rotate(p, g.A, -60)); }
    if (id === 'c6-3') { before = [g.A, g.B, g.E]; after = [g.A, g.D, g.G]; transformed = before.map(p => rotate(p, g.A, -90)); }
    if (id === 'c6-4') { before = [g.A, g.B, g.E]; after = [g.D, g.C, g.E]; transformed = before.map(p => ({ x: p.x, y: -model.a - p.y })); }
    for (let j = 0; j < 3; j++) { assert.ok(pointEqual(transformed[j], after[j]), `${id}/${i} endpoint ${j}`); close(distance(before[j], before[(j + 1) % 3]), distance(after[j], after[(j + 1) % 3])); }
    const end = draw(id, i).frame;
    assert.ok(end.paths.some(path => path.points.length === 3 && path.options.color !== null && path.points.every((p, j) => pointEqual(p, after[j]))), `${id}/${i}: production Board draws the final overlaid triangle`);
    const initial = draw(id, i, 0).frame;
    assert.notEqual(JSON.stringify(initial.paths), JSON.stringify(end.paths), `${id}/${i}: visible proof progression`);
  }
});

test('original numeric questions agree with independent distances and angle measurements', () => {
  let m = state('c6-1', 1).model;
  close(angle(m.D, m.B, m.C), 35); close(angle(m.E, m.D, m.A), 25);
  m = state('c6-1', 2).model; close(angle(m.P, m.A, m.B), 60);
  m = state('c6-1', 3).model; close(angle(m.P, m.B, m.E), 120);
  m = state('c6-2', 1).model; close(distance(m.g.C, m.g.E), 5); close(distance(m.g.C, m.g.D), 3);
  m = state('c6-2', 2).model; close(distance(m.g.C, m.g.E), 3); close(distance(m.g.C, m.g.D), 5);
  m = state('c6-2', 3).model; close(angle(m.g.C, m.g.D, m.g.E), 120);
  m = state('c6-3', 1).model; close(distance(m.g.B, m.g.E), 9); close(distance(m.g.D, m.g.G), 9); close((distance(m.g.D, m.g.G) - m.pk.m) / m.pk.k, 4);
  m = state('c6-3', 2).model; close(angle(m.g.A, m.g.B, m.g.E), 50); close(angle(m.g.A, m.g.D, m.g.G), 50); close((angle(m.g.A, m.g.D, m.g.G) - m.pk.q) / m.pk.p, 15);
  m = state('c6-4', 1).model; close(angle(m.g.A, m.g.B, m.g.E), 75);
  m = state('c6-4', 2).model; close(angle(m.g.E, m.g.A, m.g.D), 150); close(angle(m.g.A, m.g.E, m.g.D), 15);
  m = state('c6-4', 3).model; close(angle(m.g.E, m.g.A, m.g.D), 30); close(angle(m.g.A, m.g.E, m.g.D), 75);
});

for (const id of ids) test(`${id}: actual Board draws every cue and reveals only in the final chapter`, () => {
  for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
    const end = state(id, i), reveal = end.compiled.cues.find(c => c.set?.cnShowAnswer);
    for (const time of [0, ...end.compiled.cues.map(c => c.at), end.compiled.length]) {
      const { frame } = draw(id, i, time);
      assert.ok(frame.paths.some(p => p.options.color !== null && p.points.length > 1), `${id}/${i} time ${time}`);
    }
    const answer = end.s.cnLessonAnswer;
    assert.equal(draw(id, i, 0, true, true).frame.texts.includes(answer), false, `${id}/${i}: entry ignores stale reveal`);
    assert.equal(draw(id, i, reveal.at - 0.001).frame.texts.includes(answer), false, `${id}/${i}: before final reveal`);
    assert.equal(draw(id, i, reveal.at).frame.texts.includes(answer), true, `${id}/${i}: final reveal`);
  }
});
