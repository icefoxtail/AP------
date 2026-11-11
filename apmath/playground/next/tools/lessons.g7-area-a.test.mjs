// Fixed-question mathematics and essential Board cues, not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/area-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['a1-rect', 'a2-para', 'a3-tri', 'a4-trap', 'a5-rhomb', 'a6-obt'];
const lessons = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => lessons(id).find(l => l.label === label);
const items = ids.flatMap(id => lessons(id).map(lesson => ({ id, lesson })));
const close = (a, b, reason) => assert.ok(Math.abs(a - b) < 1e-8, `${reason}: ${a} versus ${b}`);
const area = p => Math.abs(p.reduce((a, x, i) => { const q = p[(i + 1) % p.length]; return a + x.x * q.y - x.y * q.x; }, 0)) / 2;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
function hull(points) {
  const pts = [...new Map(points.map(p => [`${p.x.toFixed(8)},${p.y.toFixed(8)}`, p])).values()].sort((a, b) => a.x - b.x || a.y - b.y);
  const half = seq => {
    const result = [];
    for (const p of seq) { while (result.length >= 2 && cross(result.at(-2), result.at(-1), p) <= 1e-8) result.pop(); result.push(p); }
    return result.slice(0, -1);
  };
  return [...half(pts), ...half([...pts].reverse())];
}
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = video.compileLesson(lesson), state = video.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review'; lab.scene.view(lab.s, lab); lab.s.step = state.step;
  return { model: lab.scene.ar.model(lab.s), timeline, ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const fills = (result, colors) => result.paths.filter(p => colors.includes(p.options.fill) && p.options.fillAlpha > 0).map(p => p.points);
const row = result => result.textItems.filter(t => t.screen && t.options?.color === 'green' && Math.abs(t.y - lab.board.insets.top - 17) < 1e-9);

test('the six fixed questions agree with independently measured areas and the registered numeric answers', () => {
  const expected = { 'a1-rect': 24, 'a2-para': 32, 'a3-tri': 16, 'a4-trap': 24, 'a5-rhomb': 24, 'a6-obt': 12 };
  for (const id of ids) {
    const lesson = find(id, id === 'a1-rect' ? '넓이공식' : '넓이');
    const result = final(id, lesson), M = result.model, original = lab.scene.ar.geo?.(M);
    const polygon = original?.para || original?.tri || original?.trap || original?.rh;
    const measured = polygon ? area(polygon) : fills(result, ['green']).reduce((sum, cell) => sum + area(cell), 0);
    close(measured, expected[id], id + ' geometric area');
    close(M.A ?? M.S, expected[id], id + ' model formula');
    assert.equal(lesson.answer, expected[id] + 'cm²');
  }
  const count = final('a1-rect', find('a1-rect', '칸세기'));
  const cells = fills(count, ['green']);
  assert.equal(cells.length, 24);
  for (const cell of cells) close(area(cell), 1, 'unit square');
});

test('cutting and doubling produce the actual rectangle or parallelogram without lost or overlapping area', () => {
  for (const id of ['a2-para', 'a3-tri', 'a4-trap']) for (const lesson of lessons(id)) {
    const result = final(id, lesson), M = result.model, pieces = fills(result, ['sky', 'green']);
    assert.equal(pieces.length, 2, id + ' has two actual pieces');
    const boundary = hull(pieces.flat()), expected = id === 'a2-para' ? M.B * M.H : id === 'a3-tri' ? 2 * M.A : 2 * M.S;
    assert.equal(boundary.length, 4, id + ' assembled boundary has four corners');
    close(area(boundary), expected, id + ' assembled boundary area');
    close(pieces.reduce((sum, p) => sum + area(p), 0), area(boundary), id + ' pieces fill the boundary');
    close(boundary[0].x + boundary[2].x, boundary[1].x + boundary[3].x, id + ' diagonals share x midpoint');
    close(boundary[0].y + boundary[2].y, boundary[1].y + boundary[3].y, id + ' diagonals share y midpoint');
    if (id === 'a2-para') {
      const [a, b, c] = boundary;
      close((a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y), 0, 'cut pieces make a right angle');
    } else close(area(pieces[0]), area(pieces[1]), id + ' copy has equal area');
  }
});

test('the four rotated outer triangles exactly cover the inner rhombus', () => {
  const result = final('a5-rhomb', find('a5-rhomb', '직사각형비')), M = result.model;
  const inner = fills(result, ['sky']), copies = fills(result, ['rose']);
  assert.equal(inner.length, 1); assert.equal(copies.length, 4);
  const quadrants = new Set();
  for (const tri of copies) {
    assert.ok(tri.some(p => Math.hypot(p.x, p.y) < 1e-8), 'rotated corner reaches the diagonal intersection');
    for (const p of tri) if (Math.hypot(p.x, p.y) > 1e-8) close(Math.abs(p.x) / (M.X / 2) + Math.abs(p.y) / (M.Y / 2), 1, 'other vertices are on rhombus boundary');
    const cx = tri.reduce((sum, p) => sum + p.x, 0), cy = tri.reduce((sum, p) => sum + p.y, 0);
    quadrants.add(`${Math.sign(cx)},${Math.sign(cy)}`);
    close(area(tri), 6, 'one equal corner triangle');
  }
  assert.equal(quadrants.size, 4, 'one triangle covers each quadrant');
  close(copies.reduce((sum, tri) => sum + area(tri), 0), area(inner[0]), 'outside and inside have equal area');
  close(area(inner[0]) * 2, M.X * M.Y, 'rhombus occupies half the enclosing rectangle');
});

test('the 5 cm side is a genuine given and the 4 cm height is perpendicular, including outside the triangle', () => {
  for (const id of ['a2-para', 'a3-tri', 'a4-trap', 'a6-obt']) {
    const result = frame(id, find(id, '넓이')), M = result.model, g = lab.scene.ar.geo(M);
    assert.equal(M.c, 5); assert.equal(M.H, 4);
    assert.ok(result.texts.some(t => t.includes('옆변 5cm')), id + ' given side is shown');
    assert.ok(result.texts.some(t => t.includes('높이 4cm')), id + ' given height is shown');
    const shape = g.para || g.tri || g.trap, a = id === 'a2-para' ? shape[2] : shape.at(-1), b = id === 'a2-para' ? shape[1] : shape[0];
    close(distance(a, b), 5, id + ' actual sloping side');
    const foot = { x: a.x, y: 0 }, baseVector = { x: shape[1].x - shape[0].x, y: shape[1].y - shape[0].y };
    close(distance(a, foot), 4, id + ' actual height');
    close((a.x - foot.x) * baseVector.x + (a.y - foot.y) * baseVector.y, 0, id + ' height perpendicular to base');
  }
  const preserve = find('a6-obt', '넓이유지');
  for (const time of [0, 5.5, 17.5]) {
    const M = frame('a6-obt', preserve, time).model;
    close(area(lab.scene.ar.geo(M).tri), 12, 'horizontal motion preserves area');
    assert.equal(M.H, 4); assert.equal(M.B, 6);
  }
  assert.deepEqual([frame('a6-obt', preserve, 0).model.p, frame('a6-obt', preserve, 5.5).model.p, frame('a6-obt', preserve, 17.5).model.p], [3, -3, 9]);
});

test('new intermediate lengths and areas wait for their explanatory caption', () => {
  const tri = find('a3-tri', '넓이');
  assert.ok(!frame('a3-tri', tri, 17.49).texts.some(t => t.includes('32cm²')));
  assert.ok(frame('a3-tri', tri, 17.5).texts.includes('8×4 = 32cm² (두 개)'));
  const trap = find('a4-trap', '넓이');
  assert.ok(!frame('a4-trap', trap, 17.49).texts.some(t => t.includes('밑변 4+8 = 12')));
  assert.ok(frame('a4-trap', trap, 17.5).texts.includes('밑변 4+8 = 12'));
  assert.ok(!frame('a4-trap', trap, 23.99).texts.some(t => t.includes('48cm²')));
  assert.ok(frame('a4-trap', trap, 24).texts.includes('12×4 = 48cm² (두 개)'));
  const rhomb = find('a5-rhomb', '넓이');
  assert.ok(!frame('a5-rhomb', rhomb, 11.99).texts.some(t => t.includes('48cm²')));
  assert.ok(frame('a5-rhomb', rhomb, 12).texts.includes('직사각형 8×6 = 48cm²'));
});

test('all twelve explanations animate promptly, reset their flags and reveal the answer at the final cue', t => {
  assert.equal(items.length, 12);
  let frames = 0;
  const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
  for (const { id, lesson } of items) {
    const validation = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id + ' errors'); assert.deepEqual(validation.warnings, [], id + ' warnings');
    const first = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(first.paths.length > 0, `${id}:${lesson.label} first-frame polygon`);
    assert.notEqual(geometry(first), geometry(moving), `${id}:${lesson.label} actual first-second motion`);
    const reveal = first.timeline.cues.find(c => c.set?.arShowAnswer === true);
    const before = frame(id, lesson, reveal.at - .01), end = final(id, lesson);
    assert.equal(row(before).length, 0, `${id}:${lesson.label} no early result`);
    assert.equal(row(end).length, 1, `${id}:${lesson.label} final result row`);
    assert.ok(video.normAnswer(row(end)[0].text).includes(video.normAnswer(lesson.answer)), `${id}:${lesson.label} final answer agrees`);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: true });
    assert.equal(row(lab.draw()).length, 0, `${id}:${lesson.label} entry ignores stale answer`);
    const reset = video.stateAt(first.timeline, 0, { nums: lab.s, sets: lab.s, step: 0 });
    assert.equal(reset.sets.arShowAnswer, false); assert.equal(reset.sets.arBaseReady, false); assert.equal(reset.sets.arAreaReady, false); assert.equal(reset.nums.arHeightT, 0);
    frames += 5;
  }
  t.diagnostic(`${frames} essential Board frames plus intermediate-value cues; physical mobile visual QA NOT_RUN`);
});

test('lesson reveal flags do not change the existing manual drawings', () => {
  for (const id of ids) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, arShowAnswer: false, arBaseReady: false, arAreaReady: false, arHeightT: 0, arLessonMode: 'area' });
    lab.go(id); lab.tab = 'explore';
    const initial = lab.draw();
    Object.assign(lab.s, { arShowAnswer: true, arBaseReady: true, arAreaReady: true, arHeightT: 1 });
    const flagsOn = lab.draw();
    assert.deepEqual(flagsOn.texts, initial.texts, id + ' original manual labels');
    assert.deepEqual(flagsOn.paths.map(p => ({ points: p.points, options: p.options })), initial.paths.map(p => ({ points: p.points, options: p.options })), id + ' original manual geometry');
  }
});
