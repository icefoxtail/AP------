// Minimum math and production-Board checks for the authored t1/t2/t3 lessons.
// These checks do not certify browser layout, mobile playback or visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/triangles-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const video = require('../kit/apl-video-core.js');
const own = id => /^t[123]-/.test(id);
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-7, `${why}: ${a} = ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angle = (v, a, b) => {
  const x = { x: a.x - v.x, y: a.y - v.y }, y = { x: b.x - v.x, y: b.y - v.y };
  return Math.acos(Math.max(-1, Math.min(1, (x.x * y.x + x.y * y.y) / Math.hypot(x.x, x.y) / Math.hypot(y.x, y.y)))) * 180 / Math.PI;
};
const area = p => Math.abs(p.reduce((sum, a, i) => { const b = p[(i + 1) % p.length]; return sum + a.x * b.y - a.y * b.x; }, 0)) / 2;
const plain = x => String(x).replace(/\s/g, '');
function prepare(lab, id, label) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const lessons = video.lessonList(lab.def.lessons[id]);
  const lesson = typeof label === 'number' ? lessons[label] : lessons.find(x => x.label === label);
  assert.ok(lesson, id + '/' + label + ': lesson exists');
  const timeline = video.compileLesson(lesson), base = { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null };
  const frame = (time, entry = false) => {
    const state = video.stateAt(timeline, time, base);
    Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, dragging: true, playing: false, step: entry ? 0 : state.step, part: state.part });
    lab.tab = entry ? 'explore' : timeline.tab;
    return { ...lab.draw(), state };
  };
  return { lesson, timeline, frame };
}
function sourceModel(lab, id, label = 0) {
  prepare(lab, id, label).frame(0);
  return lab.scene.tr.model(lab.s);
}
function cueTimes(lesson) {
  let offset = 0;
  return lesson.chapters.flatMap(ch => { const out = ch.cues.map(c => ({ ...c, time: offset + c.at })); offset += ch.length; return out; });
}
function compared(result) {
  return result.paths.filter(p => p.options.close && p.options.width === 3.2 && p.points.length === 3).map(p => p.points);
}

test('A registers the 17 source scenes and 59 valid explanations with complete first-cue resets', async () => {
  const lab = await load(), all = Object.entries(lab.def.lessons).filter(([id]) => own(id));
  assert.equal(all.length, 17);
  assert.equal(all.reduce((n, [, ls]) => n + video.lessonList(ls).length, 0), 59);
  for (const [id, ls] of all) {
    assert.deepEqual(video.validateLessonSet(ls).errors, [], id);
    for (const l of video.lessonList(ls)) {
      assert.deepEqual(video.validateLesson(l).warnings, [], id + '/' + l.label);
      const first = l.chapters[0].cues[0];
      assert.equal(first.at, 0);
      assert.equal(first.set.trShowAnswer, false);
      assert.equal(first.set.trCalculationReady, false);
      assert.equal(first.set.trCompare, false);
      assert.equal(first.set.trSeed, 0);
      assert.equal(typeof first.set.trLessonProblem, 'boolean');
      assert.ok(!('trPick' in first.set) && !('trShow' in first.set));
    }
  }
});

test('each A lesson keeps a visible figure, moves a real segment during its first second and keeps the conditions fixed', async () => {
  const lab = await load();
  for (const [id, ls] of Object.entries(lab.def.lessons).filter(([id]) => own(id))) for (const l of video.lessonList(ls)) {
    const { frame } = prepare(lab, id, l.label), entry = frame(0, true);
    assert.ok(entry.paths.length > 0, id + '/' + l.label + ': entry geometry');
    const first = frame(0), model = JSON.stringify(lab.scene.tr.model(lab.s)), next = frame(.75);
    assert.notDeepEqual(next.paths.map(p => p.points), first.paths.map(p => p.points), id + '/' + l.label + ': physical first motion');
    assert.equal(JSON.stringify(lab.scene.tr.model(lab.s)), model, id + '/' + l.label + ': motion does not change a given');
    const trace = next.paths.find(p => p.options.color === 'rose' && p.options.width === 4.4);
    assert.ok(trace && distance(trace.points[0], trace.points[1]) > 0, id + '/' + l.label + ': actual partial source segment');
    assert.doesNotMatch(next.texts.join(' '), /undefined|NaN|Infinity|√/);
  }
});

const numeric = {
  't1-1': { 밑각: 50, 꼭지각: 80, 외각: 130 },
  't1-2': { 변의길이: 8, 필요조건: 8 },
  't1-3': { 밑각: 65, 수직: 90, 중점: 12 },
  't1-4': { 빗변: 10, 중선: 5, 반쪽각: 45 },
  't1-5': { 밑각: 50, 꼭지각: 80 },
  't1-6': { 남은밑각: 40, 안쪽꼭지각: 140 },
  't1-7': { 길이의식: 3 },
  't2-1': { 마지막외각: 80, 거꾸로: 20 },
  't2-2': { 마지막외각: 74, 안쪽밑각: 42, 거꾸로: 32 },
  't2-3': { 꼭지각부터: 29, 밑각부터: 29, 합친각: 93 },
  't3-1': { 대응변: 7, 대응각: 50 },
  't3-2': { 밑변길이: 8, 밑각: 40, 반쪽각: 50 },
  't3-4': { 전체길이: 8, 사다리꼴: 32, 대응각: 40 },
  't3-5': { 수선발사이: 8, 한수선길이: 5, 사다리꼴: 32 },
  't3-6': { 마주보는각: 100, 대응변: 5, 반쪽각: 50 },
  't3-7': { 가운데넓이: 26, 사다리꼴: 50 }
};
test('the 40 numerical explanations match the actual source question and show the numerical x only in the final chapter', async () => {
  const lab = await load(); let count = 0;
  for (const [id, targets] of Object.entries(numeric)) for (const [label, expected] of Object.entries(targets)) {
    const { lesson, timeline, frame } = prepare(lab, id, label);
    frame(0);
    const D = lab.scene.tr, q = D.prob(D.model(lab.s), lab.s), answer = q.choices.find(c => c.ok);
    near(Number.parseFloat(answer.p), expected, id + '/' + label + ': source answer');
    const question = lab.scene.question(lab.s);
    assert.ok(question.includes(q.stem), id + ': original conditions and question');
    for (const c of q.choices) assert.ok(question.includes(c.t) || question.includes(c.h) || question.includes(c.p), id + ': original options');
    const last = lesson.chapters.slice(0, -1).reduce((n, c) => n + c.length, 0), pattern = new RegExp('x=' + expected + '(?![0-9.])');
    for (const c of cueTimes(lesson).filter(c => c.time < last)) {
      const result = frame(c.time);
      assert.equal(lab.s.trShowAnswer, false, id + '/' + label + ': conclusion flag stays closed');
      assert.ok(!result.texts.some(t => pattern.test(plain(t))), id + '/' + label + ': no early numerical x at ' + c.time);
    }
    const final = frame(timeline.length);
    assert.ok(final.texts.some(t => pattern.test(plain(t))), id + '/' + label + ': final numerical answer on Board');
    assert.equal(lab.s.trShowAnswer, true);
    count++;
  }
  assert.equal(count, 40);
});

test('isosceles source coordinates independently give the authored angles, midpoint ratio and positive expression solution', async () => {
  const lab = await load();
  let M = sourceModel(lab, 't1-1'); let g = M.tri;
  near(distance(g.A, g.B), distance(g.A, g.C)); near(angle(g.A, g.B, g.C), 80); near(angle(g.B, g.A, g.C), 50); near(180 - angle(g.C, g.A, g.B), 130);
  M = sourceModel(lab, 't1-2'); g = M.tri;
  near(angle(g.B, g.A, g.C), angle(g.C, g.A, g.B)); near(distance(g.A, g.B), distance(g.A, g.C));
  M = sourceModel(lab, 't1-3'); g = M.g;
  near(angle(g.A, g.B, g.D), 25); near(angle(g.D, g.A, g.B), 90); near(angle(g.B, g.A, g.D), 65); near(distance(g.B, g.C) / distance(g.B, g.D) * 6, 12);
  M = sourceModel(lab, 't1-4'); g = M.g;
  near(angle(g.A, g.B, g.C), 90); near(angle(g.A, g.B, g.D), 45); near(distance(g.A, g.D), distance(g.B, g.D)); near(distance(g.B, g.C) / distance(g.A, g.D), 2);
  M = sourceModel(lab, 't1-5'); g = M.g;
  near(distance(g.A, g.B), distance(g.A, g.C)); near(angle(g.A, g.B, g.C), 80); near(angle(g.B, g.A, g.C), 50);
  M = sourceModel(lab, 't1-6'); g = M.g;
  near(distance(M.P, g.B), distance(M.P, g.C)); near(angle(g.B, g.A, M.P), 40); near(angle(M.P, g.B, g.C), 140);
  M = sourceModel(lab, 't1-7');
  const x = (M.Q.sv - M.Q.q) / (M.Q.p - M.Q.r), left = M.Q.p * x + M.Q.q, right = M.Q.r * x + M.Q.sv;
  near(x, 3); near(left, 9); near(left, right); assert.ok(left > 0);
});

test('chain, shared-vertex and extension angles follow the actual source coordinates', async () => {
  const lab = await load();
  let M = sourceModel(lab, 't2-1'), p = M.pts;
  for (let i = 0; i < 4; i++) near(distance(p[i], p[i + 1]), 1, 'each link retains its length');
  near(angle(p[3], p[4], M.ext), 80); near(angle(p[0], p[1], p[2]), 20);
  M = sourceModel(lab, 't2-2'); let g = M.g;
  for (const [a, b] of [[g.A, g.B], [g.A, g.C], [g.C, g.D], [g.C, g.E]]) near(distance(a, b), 1);
  near(angle(g.A, g.C, g.D), 64); near(angle(g.C, g.D, g.E), 96); near(angle(g.D, g.C, g.E), 42); near(angle(g.D, g.E, g.F), 74);
  M = sourceModel(lab, 't2-3');
  near(distance(M.A, M.C), distance(M.C, M.D)); near(angle(M.C, M.A, M.D), 122); near(angle(M.A, M.C, M.D), 29); near(angle(M.A, M.B, M.D), 93);
});

test('congruence comparisons start apart, preserve all side lengths and coincide only for genuine congruent pairs', async () => {
  const lab = await load(); let checked = 0;
  for (const [id, ls] of Object.entries(lab.def.lessons).filter(([id]) => own(id))) for (const lesson of video.lessonList(ls)) {
    const move = cueTimes(lesson).find(c => c.to?.trMatch === 1);
    if (!move) continue;
    const { frame } = prepare(lab, id, lesson.label), before = compared(frame(move.time)), after = compared(frame(move.time + move.dur));
    assert.equal(before.length, 2, id + '/' + lesson.label + ': two separate source triangles');
    assert.equal(after.length, 2);
    assert.ok(distance(before[0][0], before[1][0]) > .2, 'initial separation');
    for (let t = 0; t < 2; t++) for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) near(distance(before[t][a], before[t][b]), distance(after[t][a], after[t][b]), 'rigid translation');
    const mismatched = after[0].some((p, i) => distance(p, after[1][i]) > 1e-7);
    assert.equal(mismatched, id === 't3-3' && ['두예각', '빗변만', '한예각', '한직각변'].includes(lesson.label), id + '/' + lesson.label + ': congruence conclusion');
    checked++;
  }
  assert.ok(checked > 20, 'all authored comparisons were exercised');
});

test('the eight fixed condition questions use real trQi values, and every counterexample retains its stated condition', async () => {
  const lab = await load();
  const ids = { RHA: 0, RHS: 4, SAS: 6, ASA: 20, 두예각: 23, 빗변만: 5, 한예각: 21, 한직각변: 15 };
  for (const [label, qi] of Object.entries(ids)) {
    const { frame } = prepare(lab, 't3-3', label); frame(0);
    assert.equal(lab.s.trQi, qi);
    const D = lab.scene.tr, q = D.prob(D.model(lab.s), lab.s), question = lab.scene.question(lab.s);
    assert.equal(question, q.stem);
    assert.ok(!question.includes(q.ansHTML), 'the empty-t answer placeholder is not a displayed option');
    const [p, r] = compared(frame(34));
    if (label === '두예각' || label === '한예각') { near(angle(p[0], p[1], p[2]), angle(r[0], r[1], r[2])); if (label === '두예각') near(angle(p[1], p[0], p[2]), angle(r[1], r[0], r[2])); assert.ok(Math.abs(distance(p[0], p[1]) - distance(r[0], r[1])) > 1); }
    if (label === '빗변만') { near(distance(p[0], p[1]), distance(r[0], r[1])); near(angle(p[2], p[0], p[1]), 90); near(angle(r[2], r[0], r[1]), 90); assert.ok(Math.abs(distance(p[1], p[2]) - distance(r[1], r[2])) > .5); }
    if (label === '한직각변') { near(distance(p[0], p[1]), distance(r[0], r[1])); near(angle(p[1], p[0], p[2]), 90); near(angle(r[1], r[0], r[2]), 90); assert.ok(Math.abs(distance(p[1], p[2]) - distance(r[1], r[2])) > .5); }
  }
});

test('trapezoid, perpendicular feet and kite drawings independently match the authored lengths, areas and angle target', async () => {
  const lab = await load();
  let M = sourceModel(lab, 't3-4'), g = M.g;
  near(distance(g.E, g.B), distance(g.B, g.D)); near(angle(g.B, g.E, g.D), 90); near(distance(g.A, g.C), 8); near(area([g.A, g.E, g.D, g.C]), 32);
  const frame = prepare(lab, 't3-4', '대응각').frame(.75);
  const edges = frame.paths.filter(p => p.options.color === 'ink' && p.options.width === 3.4 && p.points.length === 2);
  const [A, C] = edges[0].points, E = edges[1].points[1], D = edges[2].points[1], B = edges[3].points[1];
  near(angle(B, A, E), 40, 'numeric angle variant uses its actual 40-degree shape'); near(angle(D, C, B), 40); near(angle(B, C, D), 50); near(distance(B, E), distance(B, D));
  M = sourceModel(lab, 't3-5'); g = M.g;
  near(distance(g.A, g.B), distance(g.A, g.C)); near(angle(g.A, g.B, g.C), 90); near(distance(g.D, g.E), 8); near(distance(g.C, g.E), 5); near(area([g.B, g.D, g.E, g.C]), 32);
  const kite = prepare(lab, 't3-6', '마주보는각').frame(0).paths.find(p => p.options.close && p.options.color === 'ink' && p.options.width === 3.6).points;
  near(angle(kite[2], kite[1], kite[3]), 100); near(angle(kite[2], kite[0], kite[3]), 50); near(distance(kite[1], kite[2]), distance(kite[3], kite[2]));
  M = sourceModel(lab, 't3-7'); g = M.g;
  near(area([g.A, g.B, g.C]), 26); near(area([g.B, g.D, g.E, g.C]), 50); near(area([g.A, g.B, g.D]) + area([g.A, g.C, g.E]), 24);
});

test('derived figures reveal the new value at the caption that names it', async () => {
  const lab = await load();
  const checks = [
    ['t1-3', '밑각', 29.5, '90°'],
    ['t2-2', '안쪽밑각', 41.5, '42°'],
    ['t2-3', '꼭지각부터', 17.5, '122°'],
    ['t3-4', '대응각', 12, '50°'],
    ['t3-5', '사다리꼴', 36, '8 cm'],
    ['t3-7', '가운데넓이', 36, '10 cm']
  ];
  for (const [id, label, time, value] of checks) {
    const { frame, lesson } = prepare(lab, id, label), previous = frame(time - .01), now = frame(time);
    assert.ok(!previous.texts.some(t => plain(t).includes(plain(value))), id + '/' + label + ': not before the corresponding stage');
    assert.ok(now.texts.some(t => plain(t).includes(plain(value))), id + '/' + label + ': value exists on its actual source figure');
    assert.ok(cueTimes(lesson).find(c => c.time === time).say.includes(value), id + '/' + label + ': matching spoken caption');
  }
  const { frame, lesson } = prepare(lab, 't3-2', '반쪽각');
  assert.ok(frame(36).texts.some(t => t.includes('50°')));
  assert.ok(cueTimes(lesson).find(c => c.time === 36).say.includes('50°'));
});
