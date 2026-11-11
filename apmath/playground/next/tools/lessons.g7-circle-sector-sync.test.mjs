// Integration of actual HTML modules, lesson timeline, scene draw, and Board.
// These are source/runtime contracts. Browser rendering, autoplay, touch,
// clipping and manual before/after screenshots remain separate required gates.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');

function frame(lab, id, t, k = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[k];
  assert.ok(lesson, id + ': registered lesson');
  const cs = core.compileLesson(lesson);
  const state = core.stateAt(cs, t, { nums: { ...lab.s }, sets: { ...lab.s }, step: lab.s.step, part: lab.s.part });
  Object.assign(lab.s, state.nums, state.sets, {
    lessonOn: !entry, lessonEntry: entry, playing: false,
    dragging: !entry && cs.tab === 'review'
  });
  lab.tab = entry ? 'explore' : cs.tab || 'explore';
  if (!entry && cs.usesStep) lab.s.step = state.step;
  if (!entry && cs.usesPart) lab.s.part = state.part;
  const result = lab.draw();
  return { ...result, joined: result.texts.join('\n'), state: { ...lab.s }, cs, lesson };
}

test('actual loader registers each lesson against a real scene and accepts the unfiltered validator', async () => {
  const lab = await load();
  const ids = new Set(lab.list.map(sc => sc.id));
  for (const [id, data] of Object.entries(lab.def.lessons)) {
    assert.ok(ids.has(id), id + ': actual registered scene');
    for (const lesson of core.lessonList(data)) {
      const result = core.validateLesson(lesson);
      assert.deepEqual(result.errors, [], id + ': validation');
      assert.deepEqual(result.warnings, [], id + ': warnings');
    }
  }
});

test('entry/replay does not expose the auxiliary exploration calculation panels', async () => {
  const lab = await load();
  for (const [id, data] of Object.entries(lab.def.lessons)) {
    for (const [k, lesson] of core.lessonList(data).entries()) {
      frame(lab, id, core.compileLesson(lesson).length, k);
      const entry = frame(lab, id, 0, k, true);
      assert.equal(entry.value.readouts.length, 0, id);
      assert.equal(entry.value.chips.length, 0, id);
      assert.equal(entry.value.formula, '', id);
      assert.equal(entry.value.guide, '', id);
      assert.equal(entry.value.notes, '', id);
      assert.equal(entry.value.parts.length, 0, id);
      assert.equal(entry.value.status, null, id);
    }
  }
});

test('z3 arc and width calculations appear at their captions, independently of geometry motion', async () => {
  const lab = await load();
  for (const [id, arc, width] of [
    ['z3-sectorProof', /호 l = 4π/, /가로.*2π/],
    ['z3-circleProof', /원주 = 12π/, /가로.*6π/]
  ]) {
    assert.doesNotMatch(frame(lab, id, 0, 0, true).joined, arc);
    assert.doesNotMatch(frame(lab, id, 4.49).joined, arc);
    assert.match(frame(lab, id, 4.5).joined, arc);
    assert.doesNotMatch(frame(lab, id, 23.49).joined, width);
    assert.match(frame(lab, id, 23.5).joined, width);
  }
});

test('1102 keeps x unknown while the proportion is introduced', async () => {
  const lab = await load();
  assert.doesNotMatch(frame(lab, '1102', 15.99).joined, /x = 9/);
  assert.match(frame(lab, '1102', 16).joined, /x = 9/);
});

test('1104/1105 identify the two equal base angles before calculating the central angle', async () => {
  const lab = await load();
  for (const [id, base, central] of [['1104', '40°', '100°'], ['1105', '42°', '96°']]) {
    const before = frame(lab, id, 4.99).texts.filter(t => t === base).length;
    const shown = frame(lab, id, 5);
    assert.ok(shown.texts.filter(t => t === base).length >= before + 2, id + ': both base angles');
    assert.ok(!shown.texts.includes(central), id + ': central angle is not yet calculated');
    assert.ok(frame(lab, id, 10).texts.includes(central), id + ': central angle calculation');
  }
});

test('the 1209 area lesson does not disclose the separate arc-length answer', async () => {
  const lab = await load();
  assert.doesNotMatch(frame(lab, '1209', 28, 1).joined, /호[^\n]*8π/);
  assert.match(frame(lab, '1209', 28, 1).joined, /48π/);
});

test('1808 shows the full circumference when its calculation is spoken', async () => {
  const lab = await load();
  assert.doesNotMatch(frame(lab, '1808', 13.49).joined, /원주 24π/);
  assert.match(frame(lab, '1808', 13.5).joined, /원주 24π/);
  assert.doesNotMatch(frame(lab, '1808', 13.5).joined, /r = 12/);
});

test('z2 tracing does not reveal the arc result before its calculation', async () => {
  const lab = await load();
  for (const [id, at, arc] of [
    ['z2-sector', 4.5, /3π/], ['z2-quarter', 4.5, /3π/],
    ['z2-semi', 5, /6π/], ['z2-segment', 5, /2π/]
  ]) {
    assert.doesNotMatch(frame(lab, id, at - 0.01).joined, arc, id);
    assert.match(frame(lab, id, at).joined, arc, id);
  }
});

test('f05 straight lengths are on the actual drawn segments at the first calculation cue', async () => {
  const lab = await load();
  for (const [id, length] of [['f5-sq4', '6'], ['f5-rect', '8'], ['f5-tri3', '10'], ['f5-line', '8']]) {
    assert.ok(!frame(lab, id, 4.49).texts.includes(length), id + ': held');
    assert.ok(frame(lab, id, 4.5).texts.includes(length), id + ': spoken straight length');
  }
});

test('step-based lessons reset shared-link input values before the first frame', async () => {
  const defaults = {
    '1103': { b1103_a: 3, b1103_b: 5, b1103_c: 7 },
    '1106': { b1106_al: 120, b1106_be: 40, b1106_S: 72 },
    '1807': { b1807_cof: 105 }, '1104': { b1104_al: 40, b1104_r: 18 },
    '1105': { b1105_be: 42, b1105_r: 30 }, '1719': { b1719_n: 4 },
    '1809': { b1809_i: 3, b1809_r: 10 },
    rot: { f02_rot_r: 3, f02_rot_th: 60, f02_rot_sw: 1 },
    y12: { f02_y12_p: 2, f02_y12_q: 3 },
    cc08: { f02_cc08_R: 10 }, sj1: { f02_sj1_a: 2, f02_sj1_b: 4 },
    petal15: { f02_petal15_a: 8 },
    'rl-rect': { rlW: 3, rlH: 4 }, 'rl-tri': { rlA: 3 },
    'rl-turn60': { rlTd: 9, rlTc: 60 }
  };
  for (const [id, values] of Object.entries(defaults)) {
    const params = new URLSearchParams({ s: id });
    for (const [key, value] of Object.entries(values)) params.set(key, String(value === 1 ? 0 : value + 1));
    const lab = await load('#' + params.toString());
    for (let k = 0; k < core.lessonList(lab.def.lessons[id]).length; k++) {
      const got = frame(lab, id, 0, k);
      for (const [key, value] of Object.entries(values)) assert.equal(got.state[key], value, id + ': ' + key);
    }
  }
});
