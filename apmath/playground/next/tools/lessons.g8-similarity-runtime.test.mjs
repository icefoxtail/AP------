// Release integration: real HTML registration and the manual-question boundary.
// This does not claim browser rendering or full mobile visual verification.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/similarity-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const video = require('../kit/apl-video-core.js');
const lab = await load();
const plain = value => JSON.parse(JSON.stringify(value));

test('production HTML registers every catalog scene with valid player lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'g8-similarity');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Array.from(lab.list, scene => scene.id).sort());
  for (const scene of lab.list) assert.deepEqual(video.validateLessonSet(lab.def.lessons[scene.id]), { errors: [], warnings: [] }, scene.id);
  const html = fs.readFileSync(new URL('../labs/g8-similarity.html', import.meta.url), 'utf8');
  for (const filename of ['apl-video.css', 'apl-video-core.js', 'apl-player.js', 'apl-toc.js']) {
    assert.ok(html.includes('../kit/' + filename), filename + ' loaded by the real page');
    assert.ok(fs.existsSync(new URL('../kit/' + filename, import.meta.url)));
  }
});

test('new manual questions cannot replace a fixed lesson, erase a choice or advance its timeline', () => {
  for (const id of ['sm1-solid', 'sm3-foldrect', 'sm4-conv', 'sm8-proof']) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    const scene = lab.go(id);
    const lesson = video.lessonList(lab.def.lessons[id]).find(item => item.chapters[0].cues[0].set.smLessonProblem);
    const compiled = video.compileLesson(lesson);
    const apply = () => {
      const state = video.stateAt(compiled, 0, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
      Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, step: state.step });
      lab.tab = 'review';
    };
    apply();
    const original = plain(scene.sm.questionOf(lab.s)), question = scene.question(lab.s);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    lab.tab = 'problem';
    lab.newProblem();
    assert.notEqual(scene.sm.questionOf(lab.s).key, original.key, id + ': actual new-question click ran');
    const picked = { key: scene.sm.questionOf(lab.s).key, idx: 1 };
    lab.s.smPick = picked;
    apply();
    assert.deepEqual(plain(scene.sm.questionOf(lab.s)), original, id + ': fixed question restored');
    assert.equal(scene.question(lab.s), question, id + ': original wording and choices restored');
    assert.equal(lab.s.smPick, picked, id + ': playback does not erase a manual choice');
    lab.s.playing = true;
    const before = plain(lab.s);
    assert.equal(scene.tick(lab.s, 2, lab), false);
    assert.deepEqual(plain(lab.s), before, id + ': lesson owns numeric animation and step');
    const view = scene.view(lab.s, lab);
    assert.equal(view.formula, null);
    assert.equal(view.status, null);
    assert.equal(scene.reviewTop(lab.s), '');
    const frame = lab.draw();
    assert.ok(frame.paths.length > 0, id + ': source figure stays present');
  }
});
