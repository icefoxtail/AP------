// Actual HTML/modules/native Board. Browser/mobile and independent visual QA are separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/log-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const signature = f => JSON.stringify({ paths: f.paths, plots: f.plots, points: f.points, texts: f.boardTexts });
function apply(compiled, time, base, entry = false) {
  const value = video.stateAt(compiled, time, base);
  Object.assign(lab.s, value.nums, value.sets, { lessonOn: !entry, lessonEntry: entry, step: value.step, part: value.part });
  lab.tab = 'review';
  return lab.draw();
}
function prepare(id, label) {
  lab.go(id);
  const lesson = lessons(id).find(item => item.label === label);
  return { lesson, cs: video.compileLesson(lesson), base: baseline() };
}

test('actual catalog, first packets, lesson modules and validators are completely bound', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'alg-log');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  for (const script of ['alg-log-var.js', '../kit/apl-video-core.js', '../kit/apl-player.js', 'alg-log/lesson-core.js', 'alg-log/lesson-a.js']) assert.ok(lab.loaded.includes(script), script);
  let count = 0, sourceGoals = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(lesson => !firstSet(lesson).lglConcept));
    assert.ok(lessons(id).some(lesson => firstSet(lesson).lglConcept));
    for (const lesson of lessons(id)) {
      count++;
      const init = firstSet(lesson), cs = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(cs.length >= 60 && cs.length <= 90);
      for (const key of ['lglQuestion', 'lglConcept', 'lglTarget', 'lglShowAnswer', 'lglStage', 'lglMode', 'lglRows', 'lglColumns', 'lglCountRows', 'lglRowOnly', 'lglLeft', 'lglRight', 'lglMidpoint', 'lglM0', 'lglMirror', 'lglInitial']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}/${key}`);
      assert.equal(init.lglShowAnswer, false);
      if (!init.lglConcept) { sourceGoals++; assert.equal(init.lglQuestion, lab.api.question(id)); }
      assert.ok(cs.pins.length > 0, 'intermediate mathematical expressions are pinned');
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${id}/${key}`);
      // Parse every authored mathematical expression with the actual vendor.
      const texts = [lesson.answer, init.lglQuestion, ...lesson.chapters.flatMap(ch => ch.cues.map(cue => cue.say || ''))];
      for (const text of texts) for (const math of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(math[1], { throwOnError: true }), `${id}/${lesson.label}: ${math[1]}`);
    }
  }
  t.diagnostic(`${ids.length} scenes / ${count} lessons (${sourceGoals} original goals, ${count - sourceGoals} source inquiry concepts)`);
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /const DEFAULT_PLAYBACK_RATE = 2;/);
});

test('all cues paint finite native geometry, retain original functions and move in the first second', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const cs = video.compileLesson(lesson), base = baseline(), original = sc.vary.first(), snapshot = plain(original);
    const times = new Set([0, .9, cs.length]);
    for (const [i, chapter] of cs.chapters.entries()) for (const cue of lesson.chapters[i].cues) {
      times.add(chapter.at + cue.at);
      if (cue.to) times.add(chapter.at + cue.at + cue.dur / 2);
    }
    let start, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(cs, time, base); frames++;
      if (time === 0) start = signature(frame);
      if (time === .9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), `${sc.id}/${lesson.label}@${time}: source figure exists`);
      assert.deepEqual(plain(frame.value), {}, 'native result cards are not copied into the lesson view');
      assert.equal(sc.reviewTop(lab.s, lab), '');
      if (time < cs.chapters.at(-1).at) assert.equal(lab.s.lglShowAnswer, false);
      if (time === cs.length) assert.equal(lab.s.lglShowAnswer, true);
      assert.equal(sc.vary.cur(), original, 'the first source packet keeps its function fields and identity');
      assert.ok(Object.values(frame.focus).flat().every(Number.isFinite));
    }
    assert.notEqual(start, motion, `${sc.id}/${lesson.label}: source curve is actually traced`);
    assert.deepEqual(plain(original), snapshot);
  }
  t.diagnostic(`${frames} actual Board/canvas states; browser/mobile/independent visual audit NOT_RUN`);
});

test('new-problem selections and manual board transforms survive replay and sibling transitions', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw();
    const selected = sc.vary.cur(), question = sc.problem.text();
    assert.notEqual(selected, sc.vary.first(), `${sc.id}: the existing new-problem handler selected another packet`);
    lab.board.zoom = 1.25; lab.board.panX = 17; lab.board.panY = -9;
    const focus = plain(lab.board.focus), alvKey = lab.board._alvKey;
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base));
      apply(cs, cs.length, base);
      assert.equal(signature(apply(cs, 0, base)), initial, `${sc.id}/${lesson.label}: replay starts identically`);
      assert.equal(lab.s.lglShowAnswer, false);
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
    assert.deepEqual(plain(lab.board.focus), focus); assert.equal(lab.board._alvKey, alvKey);
    assert.equal(lab.board.zoom, 1.25); assert.equal(lab.board.panX, 17); assert.equal(lab.board.panY, -9);
  }
});

test('stale final-to-entry uses each first snapshot without overwriting retained or manual state', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem(); lab.draw();
    const selected = sc.vary.cur(), question = sc.problem.text();
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = signature(apply(cs, 0, base, true));
      apply(cs, cs.length, base);
      lab.s.lessonOn = false; lab.s.lessonEntry = true;
      const held = plain(lab.s);
      assert.equal(signature(lab.draw()), initial, `${sc.id}/${lesson.label}: final labels cannot leak into entry`);
      assert.deepEqual(plain(lab.s), held);
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem'; lab.draw();
    assert.equal(sc.vary.cur(), selected); assert.equal(sc.problem.text(), question);
  }
});

test('root, midpoint, axis and lattice labels appear after their own mathematical captions', () => {
  let { cs, base } = prepare('log1', '넓이');
  assert.ok(!apply(cs, 12, base).boardTexts.some(text => text.startsWith('AB =')));
  assert.ok(apply(cs, 18, base).boardTexts.includes('AB = 2'));
  ({ cs, base } = prepare('log2', '두근곱'));
  assert.ok(apply(cs, 24, base).boardTexts.includes('x₁ = 1/4'));
  assert.ok(!apply(cs, 24, base).boardTexts.includes('x₂ = 4'));
  assert.ok(apply(cs, 30, base).boardTexts.includes('x₂ = 4'));
  assert.ok(!apply(cs, cs.length, base).boardTexts.some(text => text.includes('17/8')), 'the product lesson does not disclose the sibling midpoint');
  ({ cs, base } = prepare('log2', '중점'));
  assert.ok(!apply(cs, 42, base).boardTexts.some(text => text.includes('17/8')));
  assert.ok(apply(cs, 48, base).boardTexts.some(text => text.includes('17/8')));
  ({ cs, base } = prepare('log2', '진수조건'));
  assert.ok(apply(cs, 24, base).boardTexts.includes('(−2, 2)'));
  assert.ok(!apply(cs, 24, base).boardTexts.includes('(2, 2)'));
  assert.ok(apply(cs, 30, base).boardTexts.includes('(2, 2)'));
  ({ cs, base } = prepare('log3', '대칭축'));
  const end = cs.chapters.at(-1).at;
  assert.ok(!apply(cs, end - .1, base).boardTexts.some(text => text.includes('대칭축 y =')));
  assert.ok(apply(cs, end, base).boardTexts.includes('대칭축 y = x − 2'));
  assert.ok(!apply(cs, end, base).boardTexts.includes('M(4, 2)'), 'the axis lesson does not disclose the sibling midpoint');
  ({ cs, base } = prepare('log3', '교점중점'));
  assert.ok(!apply(cs, cs.chapters.at(-1).at - .1, base).boardTexts.includes('M(4, 2)'));
  assert.ok(apply(cs, cs.chapters.at(-1).at, base).boardTexts.includes('M(4, 2)'));
  ({ cs, base } = prepare('log4', '격자점'));
  const counts = time => apply(cs, time, base).boardTexts.filter(text => /^\d+개$/.test(text));
  assert.deepEqual(counts(24), []); assert.deepEqual(counts(30), ['8개']);
  assert.deepEqual(counts(36), ['8개']); assert.deepEqual(counts(42), ['8개', '6개']);
  assert.deepEqual(counts(48), ['8개', '6개']); assert.deepEqual(counts(54), ['8개', '6개', '2개']);
  assert.ok(!apply(cs, 54, base).boardTexts.some(text => text.includes('= 16')));
  assert.ok(apply(cs, 60, base).boardTexts.includes('8 + 6 + 2 = 16개'));
});

test('source-only loading preserves manual inquiry, every variant pool and new-problem functionality', async () => {
  const source = await load({ sourceOnly: true });
  assert.equal(Object.keys(source.def.lessons).length, 0);
  for (const sc of source.list) {
    source.go(sc.id); source.draw();
    const first = sc.vary.cur(); source.tab = 'problem'; source.newProblem();
    assert.notEqual(sc.vary.cur(), first);
    source.draw(); source.tab = 'review'; source.s.step = 3; source.draw();
    source.tab = 'explore'; source.s.step = 3; source.draw();
  }
});
