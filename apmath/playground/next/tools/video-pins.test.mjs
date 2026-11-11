// K4: pinned formula history follows playback time, never a previous UI visit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');

function script() {
  return {
    length: 12, title: '식의 관계', start: { x: 0 }, summary: '앞 식을 보며 이어 계산해요.', task: '조건을 바꾸어 계산해 보세요.',
    cues: [
      { at: 0, say: '첫 관계는 $a=1$이에요.', to: { x: 2 }, dur: 3 },
      { at: 6, say: '이어지는 관계를 살펴봐요.' }
    ]
  };
}
function lesson() {
  const first = script(), second = script();
  first.cues = [
    { at: 0, say: '$a=1$을 남겨 두어요.', pin: true, to: { x: 2 }, dur: 3 },
    { at: 3, to: { x: 5 }, dur: 2 },
    { at: 6, say: '$b=2$와 $c=3$을 함께 봐요.', pin: true }
  ];
  second.cues = [
    { at: 0, say: '처음 식 $a=1$을 다시 써요.', pin: true },
    { at: 6, say: '다음 관계는 $d=4$예요.', pin: true },
    { at: 9, to: { x: 6 }, dur: 3 }
  ];
  delete second.start;
  return { title: '관계를 이어 보기', summary: '수식의 순서를 확인해요.', task: '앞 식으로 돌아가 다시 계산해 보세요.', chapters: [first, second] };
}
const formulas = (cs, time) => core.pinnedAt(cs, time).map((p) => p.tex);
const clone = (value) => JSON.parse(JSON.stringify(value));
function withoutPins(value) {
  const copy = clone(value);
  for (const chapter of copy.chapters || [copy]) for (const cue of chapter.cues) delete cue.pin;
  return copy;
}
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}

test('pin is optional; true requires a nonempty formula in the same caption', () => {
  const valid = script(); valid.cues[0].pin = true;
  assert.deepEqual(core.validate(valid), { errors: [], warnings: [] });
  valid.cues[1].pin = false;
  assert.deepEqual(core.validate(valid), { errors: [], warnings: [] });
  // A motion-only cue may explicitly opt out without creating a caption or formula.
  valid.cues.splice(1, 0, { at: 3, pin: false, to: { x: 4 }, dur: 2 });
  assert.deepEqual(core.validate(valid), { errors: [], warnings: [] });
  assert.deepEqual(core.validateLesson(lesson()), { errors: [], warnings: [] });
});

test('nonboolean pins and pins without single-dollar math are rejected', () => {
  for (const pin of [null, 0, 1, 'true', {}, []]) {
    const s = script(); s.cues[0].pin = pin;
    assert.ok(core.validate(s).errors.some((m) => /pin.*true.*false/.test(m)), String(pin));
  }
  for (const say of [undefined, null, 3, '', '수식이 없어요.', '$$', '$   $', '$끝나지 않은 식', '\\(x=1\\)', '$$x=1$$']) {
    const s = script(); s.cues[1] = { at: 6, say, pin: true };
    assert.ok(core.validate(s).errors.some((m) => /pin.*같은 칸 say/.test(m)), String(say));
  }
  const s = script(); s.cues[1] = { at: 6, pin: true };
  assert.ok(core.validate(s).errors.some((m) => /pin.*같은 칸 say/.test(m)), 'a preceding formula does not satisfy the same-cue requirement');
});

test('compile stores only raw math, in caption order, and retains original cue indices', () => {
  const s = script();
  s.cues = [
    { at: 0, say: '**조건**: $ \\frac{a}{b} $와 $c=d$.', pin: true, to: { x: 2 }, dur: 3 },
    { at: 3, to: { x: 4 }, dur: 2 },
    { at: 6, say: '결과는 $c=d$예요. $   $', pin: true }
  ];
  assert.deepEqual(core.validate(s), { errors: [], warnings: [] });
  const cs = core.compile(s);
  assert.deepEqual(cs.pins, [
    { at: 0, tex: ' \\frac{a}{b} ', cue: 0 },
    { at: 0, tex: 'c=d', cue: 0 },
    { at: 6, tex: 'c=d', cue: 2 }
  ]);
  assert.ok(cs.pins.every((p) => Object.keys(p).sort().join(',') === 'at,cue,tex'));
  const { pins, ...rest } = cs;
  assert.deepEqual(rest, core.compile(withoutPins(s)), 'pin metadata does not alter existing compiled fields');
  const html = script(); html.cues[0].pin = true; html.cues[0].say = '<b>조건</b> $a=1$';
  assert.ok(core.validate(html).errors.some((m) => /HTML/.test(m)), 'pin does not bypass the existing HTML prohibition');
});

test('compileLesson offsets pin times and cue indices across chapters', () => {
  const cs = core.compileLesson(lesson());
  assert.deepEqual(cs.pins, [
    { at: 0, tex: 'a=1', cue: 0 },
    { at: 6, tex: 'b=2', cue: 2 },
    { at: 6, tex: 'c=3', cue: 2 },
    { at: 12, tex: 'a=1', cue: 3 },
    { at: 18, tex: 'd=4', cue: 4 }
  ]);
  assert.equal(cs.cues[cs.pins[3].cue].ch, 1);
  assert.equal(cs.cues[cs.pins[4].cue].at, 18);
  const { pins, ...rest } = cs;
  assert.deepEqual(rest, core.compileLesson(withoutPins(lesson())));
});

test('pinnedAt keeps the latest three formulas, including duplicates, at exact cue boundaries', () => {
  const cs = core.compileLesson(lesson());
  for (const [time, expected] of [
    [-1, []], [0, ['a=1']], [5.999, ['a=1']], [6, ['a=1', 'b=2', 'c=3']],
    [11.999, ['a=1', 'b=2', 'c=3']], [12, ['b=2', 'c=3', 'a=1']], [18, ['c=3', 'a=1', 'd=4']]
  ]) assert.deepEqual(formulas(cs, time), expected, 'time ' + time);
  const s = script(); s.cues[0].say = '$a$ $b$ $c$ $d$'; s.cues[0].pin = true;
  assert.deepEqual(formulas(core.compile(s), 0), ['b', 'c', 'd'], 'one cue can roll out an older line');
});

test('seek, rewind, replay and switching lessons never carry future or foreign formulas', () => {
  const cs = freeze(core.compileLesson(lesson())), before = JSON.stringify(cs);
  const other = script(); other.cues[0].say = '$u=8$을 살펴봐요.'; other.cues[0].pin = true;
  const second = core.compile(other), plain = core.compile(script());
  assert.deepEqual(formulas(cs, 24), ['c=3', 'a=1', 'd=4'], 'skip to end');
  assert.deepEqual(formulas(cs, 5), ['a=1'], 'rewind to first chapter');
  assert.deepEqual(formulas(cs, 12), ['b=2', 'c=3', 'a=1'], 'seek to chapter boundary');
  assert.deepEqual(formulas(cs, 0), ['a=1'], 'replay from start');
  assert.deepEqual(formulas(second, 0), ['u=8'], 'a different lesson has its own history');
  assert.deepEqual(formulas(plain, 12), [], 'a non-pin script has no retained formulas');
  assert.deepEqual(formulas(cs, 0), ['a=1'], 'returning to the first lesson starts clean');
  const result = core.pinnedAt(cs, 24); result.length = 0;
  assert.deepEqual(formulas(cs, 24), ['c=3', 'a=1', 'd=4'], 'returned array is not the compiled history');
  assert.equal(JSON.stringify(cs), before, 'history lookups never mutate the timeline');
});

test('no-pin and pin:false keep compiled shapes and legacy stateAt results unchanged', () => {
  const plain = script(), optedOut = clone(plain); optedOut.cues.forEach((c) => { c.pin = false; });
  const original = core.compile(plain), disabled = core.compile(optedOut);
  assert.deepEqual(disabled, original);
  assert.equal(Object.hasOwn(original, 'pins'), false); assert.equal(Object.hasOwn(disabled, 'pins'), false);
  const pinned = core.compileLesson(lesson()), unpinned = core.compileLesson(withoutPins(lesson()));
  assert.equal(Object.hasOwn(unpinned, 'pins'), false);
  const base = { nums: { x: 20 }, sets: { flag: true }, step: 2, part: 'given' };
  for (const time of [0, 1, 3, 5.999, 6, 12, 18, 24]) {
    assert.deepEqual(core.stateAt(pinned, time, base), core.stateAt(unpinned, time, base), 'time ' + time);
    assert.deepEqual(Object.keys(core.stateAt(pinned, time, base)).sort(), ['nums', 'part', 'say', 'sets', 'step']);
  }
  // Two formulas in one caption retain the existing 2.5s validator rule; high-school timing is authored separately.
  const short = script(); short.cues[0].say = '$a$와 $b$'; short.cues[0].pin = true; short.cues[1].at = 3;
  assert.deepEqual(core.validate(short), { errors: [], warnings: [] });
});

test('pin never bypasses the existing final-chapter answer disclosure check', () => {
  const early = lesson(); early.answer = '$z=99$'; early.chapters[0].cues[0].say = '결론은 $z=99$예요.';
  assert.ok(core.validateLesson(early).errors.some((m) => /정답이 마지막 장보다 먼저/.test(m)));
  const final = lesson(); final.answer = '$z=99$'; final.chapters[1].cues[1].say = '결론은 $z=99$예요.';
  assert.deepEqual(core.validateLesson(final), { errors: [], warnings: [] });
  const cs = core.compileLesson(final);
  assert.ok(!formulas(cs, 17.999).includes('z=99')); assert.ok(formulas(cs, 18).includes('z=99'));
});
