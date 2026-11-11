// Minimal release safety: actual HTML loader, all registered lessons, and real
// Board draw calls. These checks do not certify mobile layout or visual quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/spatial-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');

function frame(lab, id, lesson, time, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = core.compileLesson(lesson);
  const state = core.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, playing: false, dragging: !entry });
  lab.tab = entry ? 'explore' : timeline.tab || 'explore';
  // Set the fixed problem before its stage, as the production lesson does.
  lab.scene.view(lab.s, lab);
  lab.s.step = entry ? 0 : state.step;
  lab.s.part = state.part;
  return { ...lab.draw(), state, timeline };
}

test('HTML, catalog and lesson map cover every spatial scene without duplicates', async t => {
  const lab = await load();
  const catalog = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), catalog);
  const declared = catalog.window.APLab.catalog.labs.find(x => x.id === lab.def.id);
  const html = fs.readFileSync(new URL('../labs/g7-spatial.html', import.meta.url), 'utf8');
  for (const file of ['apl-video-core.js', 'apl-player.js', 'apl-toc.js', 'apl-video.css']) assert.ok(html.includes('../kit/' + file), file + ': production kit is connected');
  const ids = Array.from(lab.list, x => x.id), known = new Set(ids);
  assert.equal(known.size, ids.length, 'scene IDs are unique');
  assert.equal(ids.length, declared.sceneTotal, 'catalog denominator matches actual HTML modules');
  assert.deepEqual(ids.filter(id => !lab.def.lessons[id]), [], 'no unimplemented scenes');
  assert.deepEqual(Object.keys(lab.def.lessons).filter(id => !known.has(id)), [], 'no dangling lesson IDs');
  let count = 0;
  for (const [id, value] of Object.entries(lab.def.lessons)) {
    const report = core.validateLessonSet(value);
    assert.deepEqual(report.errors, [], id + ': full set validator');
    for (const lesson of core.lessonList(value)) {
      assert.deepEqual(core.validateLesson(lesson).warnings, [], id + ': validator warnings');
      count++;
    }
  }
  t.diagnostic(`${ids.length} actual scenes / ${count} registered explanations`);
});

test('each explanation loads and draws at entry, first cue and conclusion without exposing entry calculation panels', async t => {
  const lab = await load(); let count = 0;
  for (const [id, value] of Object.entries(lab.def.lessons)) for (const lesson of core.lessonList(value)) {
    const length = core.compileLesson(lesson).length;
    for (const [time, entry] of [[0, true], [0, false], [length, false]]) {
      const result = frame(lab, id, lesson, time, entry);
      assert.ok(result.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0), `${id}/${lesson.label || lesson.title}: visible core spatial figure is drawn`);
      assert.equal(result.value.card, null, id + ': exploration card hidden');
      assert.deepEqual(Array.from(result.value.readouts), [], id + ': exploration readouts hidden');
      assert.equal(result.value.formula, null, id + ': explanation owns formula timing');
      assert.equal(result.value.rule, null, id + ': concept conclusion follows the explanation timing');
      assert.equal(result.value.status, null, id + ': manual progress does not reveal a result');
      if (entry) assert.equal(lab.s.spShowAnswer, false, id + ': prior conclusion reset');
      count++;
    }
  }
  t.diagnostic(`${count} source/Board safety frames; actual mobile playback quality NOT_RUN`);
});

test('a prior problem review cannot replace lesson geometry, reset its stage, or animate it independently', async () => {
  const lab = await load();
  for (const [id, value] of Object.entries(lab.def.lessons)) for (const lesson of core.lessonList(value)) {
    const initial = frame(lab, id, lesson, 1);
    const step = lab.s.step;
    // Retain an actual prior problem-review membership in the production WeakSet.
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'problem'; lab.scene.view(lab.s, lab);
    const manualPick = { key: 'previous-manual-problem', idx: 2 };
    Object.assign(lab.s, { spPick: manualPick, lessonOn: true, lessonEntry: false, step });
    lab.tab = 'review';
    const again = lab.draw();
    assert.deepEqual(again.texts, initial.texts, id + ': lesson labels ignore the previous problem');
    assert.deepEqual(again.paths.map(x => x.points), initial.paths.map(x => x.points), id + ': lesson geometry keeps its own conditions');
    assert.equal(lab.s.step, step, id + ': old question does not reset the lesson step');
    assert.equal(lab.s.spPick, manualPick, id + ': manual choice is preserved');
    assert.equal(lab.scene.reviewTop(lab.s), '', id + ': unrelated problem review stays hidden');
    assert.equal(JSON.stringify(lab.scene.steps(lab.s)), JSON.stringify(lab.scene.sp.steps(lab.scene.sp.model(lab.s))), id + ': manual problemSteps do not replace the lesson stages');
    lab.s.playing = true; lab.s.spSpin = true;
    const before = JSON.stringify(lab.s);
    assert.equal(lab.scene.tick(lab.s, .25, lab), false, id + ': legacy tick is inactive during the lesson');
    assert.equal(JSON.stringify(lab.s), before, id + ': legacy animation does not overwrite the timeline');
    lab.s.playing = false; lab.s.spSpin = false;
  }
});
