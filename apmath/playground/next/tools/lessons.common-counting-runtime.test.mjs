// Production script loading and native Board checks; not a browser/mobile audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/counting-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const lessons = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const baseline = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
const signature = f => JSON.stringify({ paths: f.paths, circles: f.circles, arcs: f.arcs, texts: f.boardTexts });
function apply(compiled, time, base, entry = false) {
  const value = video.stateAt(compiled, time, base);
  Object.assign(lab.s, value.nums, value.sets, { lessonOn: !entry, lessonEntry: entry, step: value.step, part: value.part });
  lab.tab = 'review';
  return lab.draw();
}

test('catalog scenes, actual source packets and automatic lessons are completely bound', t => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-counting');
  const ids = Array.from(lab.list, sc => sc.id);
  assert.equal(ids.length, catalog.sceneTotal);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  for (const script of ['../kit/apl-video-core.js', '../kit/apl-player.js', 'common-counting/lesson-core.js', 'common-counting/lesson-a.js', 'common-counting/lesson-b.js']) assert.ok(lab.loaded.includes(script), script);
  let total = 0;
  for (const id of ids) {
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])), { errors: [], warnings: [] }, id);
    assert.ok(lessons(id).some(lesson => !firstSet(lesson).lccConcept), `${id}: first problem is covered`);
    assert.ok(lessons(id).some(lesson => firstSet(lesson).lccConcept), `${id}: source exploration is covered`);
    for (const lesson of lessons(id)) {
      total++;
      const init = firstSet(lesson), compiled = video.compileLesson(lesson);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of ['lccQuestion', 'lccConcept', 'lccExplore', 'lccTarget', 'lccShowAnswer', 'lccStage', 'lccMode', 'lccRows', 'lccSlots', 'lccBoxWays', 'lccKnownNumbers', 'lccInitial']) assert.ok(Object.hasOwn(init, key), `${id}/${lesson.label}/${key}`);
      assert.equal(init.lccShowAnswer, false);
      if (!init.lccConcept) assert.equal(init.lccQuestion, lab.api.question(id));
      assert.ok(compiled.pins.length > 0, `${id}/${lesson.label}: mathematical steps are pinned`);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${id}/${key}`);
    }
  }
  t.diagnostic(`${ids.length} scenes / ${total} lessons; source problems and exploration concepts are separately labelled`);
  const player = fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8');
  assert.match(player, /const DEFAULT_PLAYBACK_RATE = 2;/, 'the existing shared Player retains its default 2× speed');
});

test('every authored cue paints finite native geometry and first-second motion', t => {
  let frames = 0;
  for (const sc of lab.list) for (const lesson of lessons(sc.id)) {
    lab.go(sc.id);
    const compiled = video.compileLesson(lesson), base = baseline(), original = plain(lab.api.first(sc.id));
    const times = new Set([0, .9, compiled.length]);
    for (const [i, chapter] of compiled.chapters.entries()) {
      for (const cue of lesson.chapters[i].cues) {
        times.add(chapter.at + cue.at);
        if (cue.to) times.add(chapter.at + cue.at + cue.dur / 2);
      }
    }
    let first, motion;
    for (const time of [...times].sort((a, b) => a - b)) {
      const frame = apply(compiled, time, base); frames++;
      if (time === 0) first = signature(frame);
      if (time === .9) motion = signature(frame);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), `${sc.id}/${lesson.label}@${time}: figure exists`);
      assert.deepEqual(plain(frame.value), {}, 'manual result cards do not disclose conclusions during lessons');
      assert.equal(sc.reviewTop(lab.s, lab), '');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lccShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.lccShowAnswer, true);
      assert.deepEqual(plain(sc.vary.cur()), original, 'the first source question remains selected');
      assert.ok(Object.values(frame.focus).flat().every(Number.isFinite), 'the automatic diagram focus is finite');
    }
    assert.ok(first !== motion, `${sc.id}/${lesson.label}: actual source geometry moves or is traced`);
    assert.deepEqual(plain(lab.api.first(sc.id)), original);
  }
  t.diagnostic(`${frames} production Board/canvas states; full browser/mobile and independent visual QA NOT_RUN`);
});

test('new problem, arrays, replay and manual board transform survive automatic lessons', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem();
    const selected = plain(sc.vary.cur()), source = plain(sc.vary.first()), question = sc.problem.text();
    assert.notDeepEqual(selected, source, `${sc.id}: actual new-problem handler changes the packet`);
    lab.board.zoom = 1.25; lab.board.panX = 17; lab.board.panY = -9;
    const originalLesson = lessons(sc.id).find(lesson => !firstSet(lesson).lccConcept);
    const compiled = video.compileLesson(originalLesson), base = baseline();
    const initial = apply(compiled, 0, base);
    apply(compiled, compiled.length, base);
    assert.equal(signature(apply(compiled, 0, base)), signature(initial), 'replay has deterministic geometry');
    assert.deepEqual(plain(sc.vary.cur()), source);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    lab.draw();
    assert.equal(lab.board.zoom, 1.25); assert.equal(lab.board.panX, 17); assert.equal(lab.board.panY, -9);
    assert.deepEqual(plain(sc.vary.cur()), selected); assert.equal(sc.problem.text(), question);
    // Finish one concept, then start each sibling. Mutable selection arrays
    // must come from that sibling's initial state, not the previous lesson.
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson);
      apply(cs, cs.length, baseline());
      const start = apply(cs, 0, baseline());
      assert.equal(lab.s.lccShowAnswer, false);
      for (const key of ['seat2', 'cyc7', 'tab6', 'cnt6']) assert.deepEqual(plain(lab.s[key]), plain(firstSet(lesson)[key]));
      assert.ok(start.canvas.length);
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.tab = 'explore'; lab.draw();
  }
});

test('numbers, table cases and conclusions follow their captions', () => {
  lab.go('rule');
  let lesson = lessons('rule').find(x => x.label === '도로'), cs = video.compileLesson(lesson), base = baseline();
  assert.ok(!apply(cs, 24, base).boardTexts.some(t => t.includes('4 × 3 = 12')));
  assert.ok(apply(cs, 30, base).boardTexts.some(t => t.includes('4 × 3 = 12')));
  assert.ok(!apply(cs, 42, base).boardTexts.some(t => t.includes('12 + 2 = 14')));
  assert.ok(apply(cs, 48, base).boardTexts.some(t => t.includes('12 + 2 = 14')));
  lab.go('perm'); lesson = lessons('perm').find(x => x.label === '짝수조건'); cs = video.compileLesson(lesson); base = baseline();
  const candidateDots = time => apply(cs, time, base).circles.filter(circle => circle.radius === .13).length;
  assert.equal(candidateDots(12), 0); assert.equal(candidateDots(18), 3);
  assert.equal(candidateDots(24), 8); assert.equal(candidateDots(30), 12);
  lab.go('grid'); lesson = lessons('grid').find(x => x.label === '신청서'); cs = video.compileLesson(lesson); base = baseline();
  apply(cs, cs.chapters[2].at, base); assert.equal(lab.s.lccRows, 0);
  apply(cs, cs.chapters[3].at, base); assert.equal(lab.s.lccRows, 1);
  apply(cs, cs.chapters[3].at + 5, base); assert.equal(lab.s.lccRows, 4);
  apply(cs, cs.chapters[4].at, base); assert.equal(lab.s.lccRows, 6);
  assert.ok(!apply(cs, cs.chapters[4].at + 6, base).boardTexts.some(t => t.includes('= 220')));
  assert.ok(apply(cs, cs.chapters[5].at, base).boardTexts.some(t => t.includes('= 220')));
  lesson = lessons('grid').find(x => x.label === '상자배분'); cs = video.compileLesson(lesson); base = baseline();
  const rowCount = time => apply(cs, time, base).boardTexts.filter(text => /^\(\d,\d\)$/.test(text)).length;
  assert.equal(rowCount(24), 3); assert.equal(rowCount(30), 6);
  assert.equal(apply(cs, 48, base).boardTexts.filter(text => text === '× 6').length, 0);
  assert.equal(apply(cs, 54, base).boardTexts.filter(text => text === '× 6').length, 6);
  for (const [label, end] of [['두점선분', 10], ['세점삼각형', 10], ['대각선', 5], ['평행사변형', 18]]) {
    lab.go('shape'); lesson = lessons('shape').find(x => x.label === label); cs = video.compileLesson(lesson); base = baseline();
    apply(cs, cs.chapters.at(-1).at, base);
    assert.equal(lab.s.k5, end, 'the final count already matches the final numerical caption');
  }
  lab.go('circ'); lesson = lessons('circ').find(x => x.label === '한명고정'); cs = video.compileLesson(lesson); base = baseline();
  assert.ok(!apply(cs, 42, base).boardTexts.some(t => t.includes('4! = 24')));
  assert.ok(apply(cs, 48, base).boardTexts.some(t => t.includes('4! = 24')));
  const entry = apply(cs, 0, base, true);
  assert.equal(lab.s.lccShowAnswer, false);
  assert.ok(!entry.boardTexts.some(t => t.includes('4! = 24')));
});

test('source-only loading preserves manual scenes and zero triangles really means zero', async () => {
  const source = await load({ sourceOnly: true });
  assert.equal(Object.keys(source.def.lessons).length, 0);
  for (const sc of source.list) { source.go(sc.id); source.draw(); }
  source.go('shape');
  source.s.mode5 = 'tri'; source.s.k5 = 0;
  const zero = source.draw();
  assert.ok(!zero.paths.some(p => p.options.fill === 'amber' || p.options.color === 'sky'), 'zero selection paints no selected or previous triangle');
  source.s.k5 = 1;
  const one = source.draw();
  assert.equal(one.paths.filter(p => p.options.fill === 'amber').length, 1);
  source.go('grid'); source.s.mode6 = 'box'; source.s.cnt6 = [2, 0, 0, 2, 0, 0];
  assert.ok(source.draw().boardTexts.some(t => t.includes('4!÷(2!)^2 = 6')));
});

test('stale final-to-entry draws each sibling first snapshot without changing retained or manual state', () => {
  for (const sc of lab.list) {
    lab.go(sc.id); lab.tab = 'problem'; lab.newProblem();
    const selected = plain(sc.vary.cur()), question = sc.problem.text();
    for (const lesson of lessons(sc.id)) {
      const cs = video.compileLesson(lesson), base = baseline();
      const initial = apply(cs, 0, base, true);
      apply(cs, cs.length, base);
      lab.s.lessonOn = false; lab.s.lessonEntry = true;
      const held = plain(lab.s), entry = lab.draw();
      assert.equal(signature(entry), signature(initial), `${sc.id}/${lesson.label}: entry hides final-stage geometry and counts`);
      assert.deepEqual(plain(lab.s), held, 'the entry drawing snapshot does not overwrite the retained Player state');
      if (sc.id === 'comb' && lesson.label === '조합원리') assert.ok(!entry.boardTexts.some(text => text.includes('묶음은 모두')));
    }
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem'; lab.draw();
    assert.deepEqual(plain(sc.vary.cur()), selected, 'the manual variant survives sibling entry snapshots');
    assert.equal(sc.problem.text(), question);
  }
});
