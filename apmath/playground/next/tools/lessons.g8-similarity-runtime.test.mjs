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

test('final similar-family highlight follows the actual mobile and desktop choice columns', () => {
  let rightColumn = false;
  for (const width of [360, 1000]) for (const lesson of video.lessonList(lab.def.lessons['sm1-always'])) {
    if (!lesson.chapters[0].cues[0].set.smLessonProblem) continue;
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
    const scene = lab.go('sm1-always');
    lab.board.resize(width, 650);
    const compiled = video.compileLesson(lesson);
    const state = video.stateAt(compiled, compiled.length, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
    Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, step: state.step });
    const index = scene.sm.questionOf(lab.s).choices.findIndex(choice => choice.ok);
    const narrow = lab.api.phone(lab.board), cols = narrow ? 2 : 5;
    const marks = [], figures = [], original = lab.board.circle;
    lab.board.circle = function (at, radius, options = {}) {
      if (radius === 1.55 && options.color === 'amber' && options.dash) marks.push({ x: at.x, y: at.y });
      if (options.fill === 'sky') figures.push({ x: at.x, y: at.y });
      return original.call(this, at, radius, options);
    };
    let frame;
    try { frame = lab.draw(); } finally { lab.board.circle = original; }
    for (const path of frame.paths.filter(item => item.options.fill === 'sky')) {
      const xs = path.points.map(p => p.x), ys = path.points.map(p => p.y);
      figures.push({ x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 });
    }
    const number = frame.textItems.find(item => item.text === lab.api.NUM[index]);
    assert.ok(number && figures.length >= 5, 'real choice numbers and source shapes are drawn');
    const anchor = lab.board.toW(number.x, number.y);
    const closest = figures.sort((a, b) => Math.hypot(a.x - anchor.x, a.y - anchor.y) - Math.hypot(b.x - anchor.x, b.y - anchor.y))[0];
    assert.equal(marks.length, 1);
    assert.ok(Math.hypot(marks[0].x - closest.x, marks[0].y - closest.y) < .6, 'answer marker is centered on the shape beside the correct source number');
    if (narrow && index % cols === 1) rightColumn = true;
  }
  assert.ok(rightColumn, 'a real authored answer exercises the previously misplaced mobile column');
  lab.board.resize(1000, 650);
});
