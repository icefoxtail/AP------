// Production HTML/source/Board checks. Browser and mobile visual audits are NOT_RUN.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/sine-cosine-law-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = {
  'bas-1': 3, 'bas-2': 3, 'bas-3': 2, 'bas-4': 2, 'bas-5': 3, 'bas-6': 2, 'bas-7': 3, 'bas-8': 2,
  'adv-1': 3, 'adv-2': 2, 'adv-3': 3, 'adv-4': 3, 'adv-5': 3, 'adv-6': 2, 'adv-7': 2, 'adv-8': 3,
  'ext-1': 2, 'ext-2': 2
};
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-8, `${message}: ${a} ≠ ${b}`);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
function triangle(a, b, c) {
  const x = (a * a + c * c - b * b) / (2 * a);
  return { A: { x, y: Math.sqrt(c * c - x * x) }, B: { x: 0, y: 0 }, C: { x: a, y: 0 } };
}
function foot(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, k = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return { x: a.x + k * dx, y: a.y + k * dy };
}
function orthic(a, cosA) {
  const halfA = Math.acos(cosA) / 2, side = a / (2 * Math.sin(halfA));
  const T = triangle(a, side, side), D = foot(T.B, T.A, T.C), E = foot(T.C, T.A, T.B);
  return { ...T, D, E };
}
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.lsConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, t, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, t, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, points: frame.points, arcs: frame.arcs, handles: frame.handles });

test('production inline HTML loads all lesson modules and registers 18 scenes / 45 valid lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'alg-sine-cosine-law');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), Object.keys(counts));
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Object.keys(counts).sort());
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'alg-sine-cosine-law/lesson-core.js', 'alg-sine-cosine-law/lesson-a.js', 'alg-sine-cosine-law/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, examples = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id]);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lsConcept ? concepts++ : examples++;
      for (const key of ['lsQuestion', 'lsConcept', 'lsExplore', 'lsTarget', 'lsShowAnswer']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lsShowAnswer, false);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15, 'each authored chapter lasts 8–15 seconds');
      const compiled = video.compileLesson(lesson);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: numeric ${key} initialized`);
    }
  }
  assert.equal(concepts, 18); assert.equal(examples, 27);
});

test('all 18 first original packets agree with independent coordinate and length calculations', () => {
  const oracle = {
    'bas-1': v => {
      assert.deepEqual(plain(v.q), { AB: 5, BH: 3, AH: 4, CH: 2 });
      const AB = 5, cosB = 3 / 5, AC = 2 * Math.sqrt(5), BH = AB * cosB;
      const h = Math.sqrt(AB * AB - BH * BH), CH = Math.sqrt(AC * AC - h * h);
      return [BH + CH, (BH + CH) * h / 2];
    },
    'bas-2': v => { assert.deepEqual([v.AB, v.AC, v.BC], [13, 15, 14]); const T = triangle(v.BC, v.AC, v.AB); return [T.A.y, area(T.A, T.B, T.C)]; },
    'bas-3': v => { const q = v.q; return [q.R2 / (q.p / q.q)]; },
    'bas-4': v => { const q = v.q, chord = q.r1n * q.sbn / q.sbd; return [chord, chord / (2 * q.R2)]; },
    'bas-5': v => { const T = orthic(v.q.a, Math.cos(v.q.rad)), M = { x: v.q.a / 2, y: 0 }; near(dist(M, T.D), v.q.a / 2, 'D lies on the diameter circle'); near(dist(M, T.E), v.q.a / 2, 'E lies on the diameter circle'); return [dist(M, T.B), dist(T.D, T.E)]; },
    'bas-6': v => { const q = v.q, T = triangle(q.a, q.b, q.c); return [dist(T.A, { x: q.a / 2, y: 0 })]; },
    'bas-7': v => {
      const q = v.q, T = triangle(q.a, q.b, q.c), perimeter = q.a + q.b + q.c;
      const I = { x: (q.a * T.A.x + q.b * T.B.x + q.c * T.C.x) / perimeter, y: q.a * T.A.y / perimeter };
      const F = foot(I, T.A, T.B); return [dist(T.A, F), I.y];
    },
    'bas-8': v => { const q = v.q, hyp = Math.hypot(q.b, q.c), S = q.b * q.c / 2, semi = (hyp + q.b + q.c) / 2; return [hyp / 2 + S / semi]; },
    'adv-1': v => { const q = v.q, T = orthic(q.a, q.cn / q.cd); return [dist(T.D, T.E), area(T.A, T.D, T.E) / area(T.A, T.B, T.C)]; },
    'adv-2': v => { const q = v.q, T = triangle(q.a, q.b, q.c), D = { x: q.a * q.m / (q.m + q.n), y: 0 }; return [dist(T.A, D) ** 2]; },
    'adv-3': v => {
      const q = v.q, R = Math.sqrt(q.R2), O = { x: 0, y: 0 }, P = { x: q.PO, y: 0 };
      const T = { x: q.R2 / q.PO, y: Math.sqrt(q.R2 - q.R2 ** 2 / q.PO ** 2) };
      near(dist(O, T), R, 'tangent point belongs to the circle');
      near((T.x - P.x) * T.x + T.y * T.y, 0, 'tangent is perpendicular to the radius');
      return [dist(P, T), (q.PO - R) * (q.PO + R)];
    },
    'adv-4': v => { const q = v.q, PD = q.PA * q.PB / q.PC, theta = 0.7; const A = { x: q.PA, y: 0 }, B = { x: q.PB, y: 0 }, C = { x: q.PC * Math.cos(theta), y: q.PC * Math.sin(theta) }, D = { x: PD * Math.cos(theta), y: PD * Math.sin(theta) }; return [PD, dist(A, D) / dist(B, C)]; },
    'adv-5': v => { const q = v.q, A = { x: q.pa, y: 0 }, C = { x: q.pc * Math.cos(2 * Math.PI / 3), y: q.pc * Math.sin(2 * Math.PI / 3) }; const L = dist(A, C), pb = (q.pa + Math.sqrt(4 * L * L - 3 * q.pa * q.pa)) / 2; return [L, pb]; },
    'adv-6': v => { const q = v.q, B = triangle(q.AC, q.BC, q.AB).A, D = triangle(q.AC, q.CD, q.DA).A; D.y *= -1; return [dist(B, D)]; },
    'adv-7': v => { const q = v.q, cosB = (q.AB ** 2 + q.BC ** 2 - q.AC ** 2) / (2 * q.AB * q.BC); const D = { x: q.AB + q.BC * cosB, y: q.BC * Math.sqrt(1 - cosB ** 2) }; return [Math.hypot(D.x, D.y)]; },
    'adv-8': v => { const q = v.q, angle = { 'π/3': Math.PI / 3, 'π/6': Math.PI / 6, 'π/4': Math.PI / 4, '2π/3': 2 * Math.PI / 3 }[q.ang]; const C = { x: q.AB + q.AD * Math.cos(angle), y: q.AD * Math.sin(angle) }, E = { x: 2 * q.AB, y: 0 }; return [E.x, area({ x: 0, y: 0 }, C, E)]; },
    'ext-1': v => { assert.deepEqual(plain(v.set), [5, 6]); return [6 / (2 * (3 / 5))]; },
    'ext-2': v => { assert.deepEqual(plain(v.set), [5, 6]); const R = 5, chord = 2 * R * (3 / 5), distance = Math.sqrt(R * R - (chord / 2) ** 2); return [chord * (R + distance) / 2]; }
  };
  const known = { 'bas-1': [5, 10], 'bas-2': [12, 84], 'bas-3': [4], 'bas-4': [5, 5 / 6], 'bas-5': [3, 3], 'bas-6': [2 * Math.sqrt(7)], 'bas-7': [3, 2 * Math.sqrt(6) / 3], 'bas-8': [7], 'adv-1': [3, 9 / 25], 'adv-2': [62 / 3], 'adv-3': [2 * Math.sqrt(6), 24], 'adv-4': [6, 3 / 4], 'adv-5': [7, 8], 'adv-6': [39 / 7], 'adv-7': [Math.sqrt(19)], 'adv-8': [8, 6 * Math.sqrt(3)], 'ext-1': [5], 'ext-2': [27] };
  for (const scene of lab.list) {
    lab.go(scene.id);
    const packet = lab.api.first(scene.id), expected = oracle[scene.id](packet), actual = packet.val || [packet.ans];
    assert.equal(packet, scene.vary.first());
    assert.equal(actual.length, expected.length);
    for (let i = 0; i < actual.length; i++) { near(actual[i], expected[i], `${scene.id} independently derived result ${i}`); near(actual[i], known[scene.id][i], `${scene.id} exact first original ${i}`); }
  }
});

test('every lesson cue draws finite geometry and raw canvas labels without old answer cards', t => {
  let frames = 0;
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base); const initial = lab.draw();
    apply(compiled, 0.8, base); const motion = lab.draw();
    assert.notEqual(signature(motion), signature(initial), `${scene.id}/${lesson.label}: actual geometry moves within one second`);
    const times = new Set([0, 0.8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + cue.dur / 2)); }
    for (const time of times) {
      apply(compiled, time, base);
      const frame = lab.draw(); frames++;
      assert.ok(frame.paths.length || frame.arcs.length, `${scene.id}/${lesson.label}@${time}: actual shape is present`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), 'the real Board draws to canvas');
      assert.ok(frame.canvasText.length, 'direct canvas text is included in the frame');
      assert.deepEqual(plain(frame.value), {}, 'draw cannot reinsert METRIC/summary/formula answers');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.equal(scene.vary.cur(), packet, 'the first source packet is used throughout playback');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lsShowAnswer, false, 'no early answer flag');
      if (time === compiled.length) assert.equal(lab.s.lsShowAnswer, true, 'final chapter concludes the lesson');
    }
    assert.deepEqual(plain(packet), before, 'source packet is never mutated by lesson drawing');
  }
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; full browser/mobile visual audit NOT_RUN`);
});

test('actual new-problem clicks preserve the manual variant across fixed first-source lessons and replay', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0];
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3;
    lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab);
    assert.notEqual(manual, first, `${scene.id}: actual button generates a new variant`);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const question = scene.question(lab.s, lab), initial = signature(lab.draw());
    assert.equal(scene.vary.cur(), first);
    assert.ok(question.includes(lab.api.question(scene.id)), `${scene.id}: original condition text is preserved`);
    assert.ok(!question.includes('data-ls-new'), 'lesson question omits the manual new-problem button');
    if (scene.tick) { lab.s.playing = true; const before = plain(lab.s); assert.equal(scene.tick(lab.s, 1, lab), false); assert.deepEqual(plain(lab.s), before); }
    apply(compiled, compiled.length, base); apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(signature(lab.draw()), initial, `${scene.id}: replay restores the exact initial geometry`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual, `${scene.id}: manual problem survives playback`);
    assert.equal(scene.problem.text(lab.s, lab), manualText);
  }
});

test('source subquestions hide their numeric canvas answer until the final chapter', () => {
  // Fractions are physically painted as separate numerator/denominator text calls.
  const patterns = {
    'bas-1/bc': /BC\s*=\s*3\s*\+\s*2\s*=\s*5/,
    'bas-1/area': /넓이\s*=[\s\S]{0,40}=\s*10/,
    'bas-2/height': /AH\s*=\s*12/,
    'bas-2/area': /넓이\s*=[\s\S]{0,40}=\s*84/,
    'bas-3/radius': /R₁\s*=\s*3\s*×\s*4[\s/]+3\s*=\s*4/,
    'bas-4/sine': /sin D\s*=\s*5[\s/]+6/,
    'bas-5/radius': /R\s*=\s*3(?:\D|$)/,
    'bas-5/de': /DE\s*=[\s\S]{0,28}=\s*3/,
    'bas-6/median': /AM\s*=\s*2√7/,
    'bas-7/tangent': /AF\s*=\s*3/,
    'bas-7/inradius': /r\s*=\s*2√6[\s/]+3/,
    'bas-8/sum': /R\s*\+\s*r\s*=\s*7/,
    'adv-1/de': /DE\s*=\s*5\s*×\s*3[\s/]+5\s*=\s*3/,
    'adv-1/ratio': /넓이의 비\s*=[\s\S]{0,25}=\s*9[\s/]+25/,
    'adv-2/cevian': /AD²\s*=\s*62[\s/]+3/,
    'adv-3/tangent': /PT\s*=\s*2√6/,
    'adv-3/product': /PA\s*·\s*PB\s*=\s*PT²\s*=\s*24/,
    'adv-4/pd': /PD\s*=\s*6/,
    'adv-4/ratio': /AD\s*:\s*BC\s*=\s*PA\s*:\s*PC\s*=\s*3\s*:\s*4/,
    'adv-5/side': /한 변 AC\s*=\s*7/,
    'adv-5/pb': /PB\s*=\s*PK\s*\+\s*BK\s*=\s*3\s*\+\s*5\s*=\s*8/,
    'adv-6/diagonal': /BD\s*=\s*39[\s/]+7/,
    'adv-7/diagonal': /BD\s*=\s*√19/,
    'adv-8/ae': /AE\s*=\s*4\s*\+\s*4\s*=\s*8/,
    'adv-8/area': /넓이\(△ACE\)\s*=[\s\S]{0,65}6√3/,
    'ext-1/radius': /R\s*=\s*5/,
    'ext-2/area': /S\s*=[\s\S]{0,35}=\s*27/
  };
  const seen = new Set();
  for (const scene0 of lab.list) for (const lesson of sourceLessons(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const key = scene.id + '/' + lab.s.lsTarget, pattern = patterns[key];
    assert.ok(pattern, key + ': numeric answer assertion exists'); seen.add(key);
    lab.s.step = 99;
    assert.ok(!pattern.test(lab.draw().canvasText.join(' ')), key + ': high legacy step cannot reveal the requested answer');
    apply(compiled, compiled.length, base);
    const final = lab.draw().canvasText.join(' ');
    assert.ok(pattern.test(final), key + ': final source diagram displays its numeric answer; ' + final);
    lab.s.lessonOn = false; lab.s.lessonEntry = true;
    assert.ok(!pattern.test(lab.draw().canvasText.join(' ')), key + ': entry suppresses stale final answer flags');
  }
  assert.equal(seen.size, lab.list.reduce((total, scene) => total + sourceLessons(scene.id).length, 0), 'every authored subquestion has its own target assertion');
});

test('each first-motion highlight follows an actual source edge with no separate geometry', () => {
  function onSegment(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
    if (len2 < 1e-9) return false;
    const u = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    return u >= -1e-8 && u <= 1 + 1e-8 && Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) < 1e-6;
  }
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    lab.go(scene0.id);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0.8, base);
    const frame = lab.draw(), marker = frame.points.find(p => p.options.color === 'violet' && p.options.r === 4.5);
    assert.ok(marker, `${scene0.id}/${lesson.label}: visible marker exists`);
    const sourcePaths = frame.paths.filter(p => !(p.options.color === 'violet' && p.options.width === 4.6));
    assert.ok(sourcePaths.some(path => path.points.slice(1).some((p, i) => onSegment(marker.point, path.points[i], p))), `${scene0.id}/${lesson.label}: marker is on a source edge`);
    assert.ok(lab.s.t >= 0 && lab.s.t <= 1, 'the authored slider stays in the existing exploration range');
  }
});
