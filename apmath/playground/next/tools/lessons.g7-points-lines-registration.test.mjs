// Minimal release safety: actual HTML loader, all registered lessons, and real
// Board draw calls. These checks do not certify mobile layout or visual quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/points-lines-lesson-runtime.mjs';
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

test('HTML, catalog and lesson map cover every points and lines scene without duplicates', async t => {
  const lab = await load();
  const catalog = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), catalog);
  const declared = catalog.window.APLab.catalog.labs.find(x => x.id === lab.def.id);
  const html = fs.readFileSync(new URL('../labs/g7-points-lines.html', import.meta.url), 'utf8');
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
      assert.ok(result.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0), `${id}/${lesson.label || lesson.title}: visible core points and lines figure is drawn`);
      assert.equal(result.value.card, null, id + ': exploration card hidden');
      assert.deepEqual(Array.from(result.value.readouts), [], id + ': exploration readouts hidden');
      assert.equal(result.value.formula, null, id + ': explanation owns formula timing');
      assert.equal(result.value.rule, null, id + ': concept conclusion follows the explanation timing');
      assert.equal(result.value.status, null, id + ': manual progress does not reveal a result');
      if (entry) assert.equal(lab.s.plShowAnswer, false, id + ': prior conclusion reset');
      count++;
    }
  }
  t.diagnostic(`${count} source/Board safety frames; actual mobile playback quality NOT_RUN`);
});

test('a previous manual answer does not reset lesson steps or change the fixed figure', async () => {
  const lab = await load();
  for (const [id, value] of Object.entries(lab.def.lessons)) for (const lesson of core.lessonList(value)) {
    const initial = frame(lab, id, lesson, 1);
    const step = lab.s.step;
    const manualPick = { key: 'previous-manual-problem', idx: 2 };
    if (lab.scene._pl) {
      Object.assign(lab.s, { plQuestionKey: 'previous-manual-problem', plPick: manualPick });
    } else {
      const q = lab.scene.__sv(lab.s);
      q.questionKey = 'previous-manual-problem'; q.pk = 'previous-manual-problem'; q.pi = 2;
    }
    const again = lab.draw();
    assert.deepEqual(again.texts, initial.texts, id + ': lesson labels ignore a previous answer');
    assert.deepEqual(again.paths.map(x => x.points), initial.paths.map(x => x.points), id + ': lesson figure keeps its fixed givens');
    assert.equal(lab.s.step, step, id + ': changed givens do not reset the lesson stage');
    if (lab.scene._pl) {
      assert.equal(lab.s.plQuestionKey, 'previous-manual-problem', id + ': manual question key is preserved');
      assert.equal(lab.s.plPick, manualPick, id + ': manual answer choice is preserved');
    } else {
      const q = lab.scene.__sv(lab.s);
      assert.equal(q.questionKey, 'previous-manual-problem', id + ': prefixed manual question key is preserved');
      assert.equal(q.pk, 'previous-manual-problem', id + ': prefixed manual answer key is preserved');
      assert.equal(q.pi, 2, id + ': prefixed manual answer choice is preserved');
    }
  }
});
