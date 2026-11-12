// Minimum release checks using production HTML, modules, Board and canvas calls.
// Actual browser/mobile playback and independent visual review remain NOT_RUN.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/irrational-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
const list = id => video.lessonList(lab.def.lessons[id]);
const original = id => list(id).find(lesson => !lesson.chapters[0].cues[0].set.lirConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base, entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, plots: frame.plots, points: frame.points, handles: frame.handles });

test('catalog, production registration, shared player and all 12 scripts agree', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-irrational');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ['i1', 'i2', 'i3']);
  assert.deepEqual(Object.keys(lab.def.lessons), ['i1', 'i2', 'i3']);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-irrational/lesson-core.js', 'common-irrational/lesson-a.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  assert.match(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), /DEFAULT_PLAYBACK_RATE\s*=\s*1\.5/);
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(list(scene.id).length, 4);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] });
    assert.equal(lab.api.steps(scene.id).length, 4, 'the original four-step solution remains available');
    for (const lesson of list(scene.id)) {
      const first = lesson.chapters[0].cues[0], cs = video.compileLesson(lesson);
      first.set.lirConcept ? concepts++ : originals++;
      assert.equal(first.at, 0); assert.equal(first.set.lirShowAnswer, false);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      assert.ok(cs.length >= 60 && cs.length <= 72);
      if (!first.set.lirConcept) assert.equal(first.set.lirQuestion, lab.api.question(scene.id));
      for (const key of Object.keys(cs.tracks)) assert.ok(Number.isFinite(cs.start[key]), `${scene.id}/${lesson.label}: ${key}`);
      for (const text of [lesson.answer, ...lesson.chapters.flatMap(chapter => chapter.cues.map(cue => cue.say || ''))]) {
        for (const match of text.matchAll(/\$([^$]+)\$/g)) assert.doesNotThrow(() => lab.katex.renderToString(match[1], { throwOnError: true }), match[1]);
      }
    }
  }
  assert.equal(concepts, 9); assert.equal(originals, 3);
});

test('all cues draw finite geometry and the first movement traces the actual source curve', t => {
  let frames = 0;
  for (const scene0 of lab.list) for (const lesson of list(scene0.id)) {
    const scene = lab.go(scene0.id), cs = video.compileLesson(lesson), base = baseState();
    const packet = lab.api.first(scene.id), packetBefore = plain(packet);
    apply(cs, 0, base); const first = lab.draw();
    apply(cs, .8, base); const motion = lab.draw();
    assert.notEqual(signature(first), signature(motion), `${scene.id}/${lesson.label}: visible movement within one second`);
    const marker = motion.points.find(p => p.options.r === 4.5 && p.options.color === 'violet' && !p.options.label);
    assert.ok(marker, `${scene.id}/${lesson.label}: original-curve trace point exists`);
    assert.ok(motion.plots.some(plot => plot.options.color === 'sky' && marker.point.x >= plot.from - 1e-8 && marker.point.x <= plot.to + 1e-8 && Math.abs(plot.evaluate(marker.point.x) - marker.point.y) < 1e-8));
    const times = new Set([0, .8, cs.length]);
    for (const cue of cs.cues) { times.add(cue.at); if (cue.dur) times.add(cue.at + cue.dur / 2); }
    for (const time of times) {
      apply(cs, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.plots.length > 0, `${scene.id}/${lesson.label}@${time}: the core function is visible`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo'));
      assert.deepEqual(plain(frame.value), {}, 'legacy answer chips and count readouts are hidden during playback');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')));
      assert.equal(scene.vary.cur(), packet, 'the retained original is selected during playback');
      assert.equal(lab.s.lirShowAnswer, time >= cs.chapters.at(-1).at, 'the result flag opens only in the last chapter');
      if (scene.id === 'i1') assert.ok([-1, 1].includes(lab.s.i1d) && [-1, 1].includes(lab.s.i1s), 'reflection switches are discrete');
      if (scene.id === 'i2') assert.ok([-1, 1].includes(lab.s.i2m), 'no lesson interpolates through the zero-slope singularity');
    }
    assert.deepEqual(plain(packet), packetBefore, 'playback does not change source conditions');
  }
  t.diagnostic(`${frames} production Board/raw-canvas cue states; browser/mobile visual review NOT_RUN`);
});

test('actual new-problem clicks, replay, sibling lessons and entry preserve the original/manual split', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first();
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 4;
    lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab), manualSteps = Array.from(scene.steps(lab.s, lab));
    assert.notEqual(manual, first);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    for (const lesson of list(scene.id)) {
      const cs = video.compileLesson(lesson), base = baseState();
      apply(cs, 0, base); const initial = signature(lab.draw()), question = scene.question(lab.s, lab);
      assert.equal(scene.vary.cur(), first);
      apply(cs, cs.length, base); apply(cs, 0, base);
      assert.equal(signature(lab.draw()), initial, `${scene.id}/${lesson.label}: replay starts identically`);
      assert.equal(scene.question(lab.s, lab), question);
      apply(cs, 0, base, true); const entry = signature(lab.draw());
      apply(cs, cs.length, base);
      lab.s.lessonOn = false; lab.s.lessonEntry = true; lab.s.step = 99;
      assert.equal(signature(lab.draw()), entry, `${scene.id}/${lesson.label}: entry ignores stale final flags and coordinates`);
      lab.s.lessonEntry = false; lab.tab = 'problem';
      assert.equal(scene.vary.cur(), manual);
      assert.equal(scene.problem.text(lab.s, lab), manualText);
      assert.deepEqual(Array.from(scene.steps(lab.s, lab)), manualSteps);
    }
    lab.tab = 'explore'; lab.draw();
    assert.ok(scene.presets(lab.s, lab).length > 0, 'manual presets are still present');
    assert.ok(scene.view(lab.s, lab).readouts.length > 0, 'manual readouts are restored');
  }
});

test('source construction steps, inverse curves and intersection markers follow the authored captions', () => {
  lab.go('i2');
  let cs = video.compileLesson(original('i2')), base = baseState();
  apply(cs, 17.9, base); assert.ok(!lab.draw().texts.includes('k=−2'));
  apply(cs, 18, base); assert.ok(lab.draw().texts.includes('k=−2'));
  apply(cs, 41.9, base); assert.ok(!lab.draw().texts.includes('k=−1'));
  apply(cs, 42, base); assert.ok(lab.draw().texts.includes('k=−1'));
  lab.go('i3'); cs = video.compileLesson(original('i3')); base = baseState();
  apply(cs, 0, base); assert.ok(!lab.draw().plots.some(plot => plot.options.ref === 'g'));
  apply(cs, 6, base); assert.ok(lab.draw().plots.some(plot => plot.options.ref === 'g'));
  apply(cs, 29.9, base); assert.equal(lab.draw().points.filter(p => p.options.ref === 'cross').length, 0);
  apply(cs, 30, base); assert.equal(lab.draw().points.filter(p => p.options.ref === 'cross').length, 1);
  apply(cs, 53.9, base); assert.equal(lab.draw().points.filter(p => p.options.ref === 'cross').length, 1);
  apply(cs, 54, base); assert.equal(lab.draw().points.filter(p => p.options.ref === 'cross').length, 3);
  lab.go('i1'); cs = video.compileLesson(original('i1')); base = baseState();
  apply(cs, 35.9, base); assert.ok(!lab.draw().paths.some(p => p.options.fill === 'green'));
  apply(cs, 36, base); assert.ok(lab.draw().paths.some(p => p.options.fill === 'green'));
});

test('manual four-direction labels describe the translated curves, not the unshifted templates', () => {
  lab.go('i1'); Object.assign(lab.s, { i1all: true, i1a: 2, i1p: 1, i1q: 1 });
  const frame = lab.draw();
  for (const label of ['y=√(2x−2)+1', 'y=√(−2x+2)+1', 'y=−√(2x−2)+1', 'y=−√(−2x+2)+1']) assert.ok(frame.texts.includes(label), label);
  const curves = frame.plots.filter(plot => ['sky', 'green', 'rose', 'violet'].includes(plot.options.color));
  assert.equal(curves.length, 4);
  for (const curve of curves) near(curve.evaluate(1), 1);
});

test('manual one/two/none questions receive their own quick-solution range', () => {
  const scene = lab.go('i2'), seen = new Set();
  for (let i = 0; i < 120 && seen.size < 3; i++) {
    const packet = scene.vary.cur(), quick = scene.solution.quick();
    const expected = packet.ans.tex.replace(/</g, '\\lt ').replace(/>/g, '\\gt ');
    assert.ok(quick.steps.includes(expected), `${packet.ask}: the displayed answer follows the selected question`);
    if (packet.ask === 'one') assert.match(quick.steps, /한 점/);
    if (packet.ask === 'two') assert.match(quick.steps, /제외/);
    if (packet.ask === 'none') assert.match(quick.steps, /만나지/);
    seen.add(packet.ask); lab.newProblem();
  }
  assert.deepEqual([...seen].sort(), ['none', 'one', 'two']);
});
