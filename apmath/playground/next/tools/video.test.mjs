// 영상 목차 대본 검사 (node --test, 브라우저 불필요)
// labs/g7-circle-sector/video.js 의 대본을 kit/apl-video-core.js 로 검사하고,
// 대본이 참조하는 상태값 이름이 장면이 lab.s 에 실제로 등록하는 이름인지 확인합니다.
// 실행: node --test apmath/playground/next/tools/catalog.test.mjs apmath/playground/next/tools/video.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const labsDir = path.resolve(DIR, '../labs');
const SCENE_DIR = path.join(labsDir, 'g7-circle-sector');

// 장면이 lab.s 에 등록하는 상태값 이름과 값 범위.
// 아래 표는 사람이 적되, 테스트가 장면 소스(basic.js / f04.js)를 읽어 표가 소스와 어긋나면(상태값 접두어·이름·범위가 바뀌면) 실패시킵니다.
//   1209     (basic.js) build() → 'b'+id+'_' + params(r 3~12, th thMin(10)~thMax(350))
//   f4-swirl (f04.js)  makeScene() → 'f4_'+id+'_' + vars(R 4~10) + t(0~1)/mode/seed/pick
// 새 장면의 대본을 추가할 때는 여기에 그 장면의 상태값(범위)도 함께 적어 주세요.
const SCENE_STATE = {
  '1209': { b1209_r: [3, 12], b1209_th: [10, 350] },
  'f4-swirl': { f4_swirl_R: [4, 10], f4_swirl_t: [0, 1], f4_swirl_mode: null, f4_swirl_seed: null, f4_swirl_pick: null }
};
const SCENE_STATE_KEYS = Object.fromEntries(Object.entries(SCENE_STATE).map(([k, v]) => [k, new Set(Object.keys(v))]));

function loadVideos() {
  const src = fs.readFileSync(path.join(SCENE_DIR, 'video.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return (sandbox.window.APL_VIDEOS || {})['g7-circle-sector'] || {};
}

const videos = loadVideos();

test('대본이 실려 있는 장면이 예상한 두 장면이다', () => {
  assert.deepEqual(Object.keys(videos).sort(), ['1209', 'f4-swirl']);
});

for (const [id, script] of Object.entries(videos)) {
  test(`영상 대본 ${id}: 형식·길이·자막·시각`, () => {
    const { errors } = core.validate(script);
    assert.deepEqual(errors, [], `대본 오류:\n${errors.join('\n')}`);
    // 길이 15~30초
    assert.ok(core.LIMITS.minLen <= script.length && script.length <= core.LIMITS.maxLen, `length ${script.length}초`);
    // 자막이 비어 있지 않음 (validate가 say 없음·빈 줄도 잡지만 명시 확인)
    const says = script.cues.filter((c) => c.say);
    assert.ok(says.length >= 3, '자막 3줄 이상');
    says.forEach((c) => assert.ok(typeof c.say === 'string' && c.say.trim(), '빈 자막'));
    // cue 시각이 증가함
    for (let i = 1; i < script.cues.length; i++) assert.ok(script.cues[i].at > script.cues[i - 1].at, `cues[${i}].at 증가`);
  });

  test(`영상 대본 ${id}: 상태값 이름이 장면 상태에 있다`, () => {
    const known = SCENE_STATE_KEYS[id];
    assert.ok(known, `알 수 없는 장면 id ${id}: SCENE_STATE_KEYS 에 상태값 목록을 채우세요`);
    const keys = [];
    Object.keys(script.start || {}).forEach((k) => keys.push(`start.${k}`));
    for (const c of script.cues) {
      Object.keys(c.to || {}).forEach((k) => keys.push(`to.${k}`));
      Object.keys(c.set || {}).forEach((k) => keys.push(`set.${k}`));
    }
    for (const k of keys) {
      const name = k.split('.').pop();
      assert.ok(known.has(name), `${k} 은 장면 ${id} 의 상태값이 아닙니다`);
    }
  });
}

test('실험실 HTML이 영상 대본을 videos 로 연결한다', () => {
  const html = fs.readFileSync(path.join(SCENE_DIR + '.html'), 'utf8');
  assert.ok(/videos:\s*\(window\.APL_VIDEOS\s*\|\|\s*\{\}\)\['g7-circle-sector'\]/.test(html), 'createLab 의 videos 연결');
  assert.ok(/MODULES\s*=\s*\[[^\]]*'video'/.test(html), 'MODULES 에 video 포함');
});

test('상태값 표가 장면 소스와 같다', () => {
  const basic = fs.readFileSync(path.join(SCENE_DIR, 'basic.js'), 'utf8');
  const f04 = fs.readFileSync(path.join(SCENE_DIR, 'f04.js'), 'utf8');
  // 1209: 장면 id, 상태값 접두어 'b', params r/th 와 범위
  assert.ok(/id:\s*'1209'/.test(basic), "basic.js 에 id '1209' 장면");
  assert.ok(/'b'\s*\+\s*[\w.]+\s*\+\s*'_'/.test(basic) || /`b\$\{[^}]+\}_/.test(basic) || /'b'\s*\+/.test(basic), "상태값 접두어 'b' 규칙");
  assert.ok(/r:\s*\{\s*value:\s*o\.def\.r,\s*min:\s*3,\s*max:\s*12/.test(basic), '1209 r 범위 3~12');
  assert.ok(/th:\s*\{\s*value:\s*o\.def\.th,\s*min:\s*thMin,\s*max:\s*thMax/.test(basic) && /thMin\s*=\s*o\.thMin\s*\|\|\s*10,\s*thMax\s*=\s*o\.thMax\s*\|\|\s*350/.test(basic), '1209 th 범위 10~350');
  // f4-swirl: 접두어 f4, id swirl, 변수 R(4~10), t 0~1
  assert.ok(/const PFX\s*=\s*'f4'/.test(f04), "f04.js 접두어 'f4'");
  const swirl = f04.slice(f04.indexOf("id: 'swirl'"));
  assert.ok(/vars:\s*\[\{\s*k:\s*'R'[^}]*min:\s*4,\s*max:\s*10/.test(swirl.slice(0, 600)), 'swirl R 범위 4~10');
  assert.ok(/PARAMS\[kt\]\s*=\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(f04), 't 범위 0~1');
});

for (const [id, script] of Object.entries(videos)) {
  test(`영상 대본 ${id}: 상태값이 장면 값 범위 안이다`, () => {
    const ranges = SCENE_STATE[id];
    const check = (where, name, v) => {
      const r = ranges[name];
      if (r) assert.ok(v >= r[0] && v <= r[1], `${where}.${name}=${v} 이 장면 범위 ${r[0]}~${r[1]} 밖입니다`);
    };
    Object.entries(script.start || {}).forEach(([k, v]) => check('start', k, v));
    script.cues.forEach((c, i) => Object.entries(c.to || {}).forEach(([k, v]) => check(`cues[${i}].to`, k, v)));
  });

  test(`영상 대본 ${id}: 대본을 끝까지 돌리면 값이 끝 값에 닿고 시각이 거꾸로 가지 않는다`, () => {
    const cs = core.compile(script);
    const base = { nums: { ...script.start }, sets: {}, step: 0, part: null };
    let prev = null;
    for (let t = 0; t <= script.length + 1e-9; t += 0.25) {
      const st = core.stateAt(cs, Math.min(t, script.length), base);
      Object.entries(st.nums).forEach(([k, v]) => assert.ok(Number.isFinite(v), `t=${t} ${k} 가 숫자가 아님`));
      if (prev) assert.ok(st.say >= prev.say, `t=${t} 자막이 거꾸로 감`);
      prev = st;
    }
    const end = core.stateAt(cs, script.length, base);
    script.cues.forEach((c) => Object.entries(c.to || {}).forEach(([k]) => {
      const last = [...script.cues].reverse().find((x) => x.to && k in x.to).to[k];
      assert.ok(Math.abs(end.nums[k] - last) < 1e-9, `${k}: 끝 값 ${end.nums[k]} ≠ 마지막 목표 ${last}`);
    }));
    // start 에만 있는 값(움직이지 않는 값)도 처음부터 끝까지 그 값
    Object.entries(script.start || {}).forEach(([k, v]) => {
      if (!script.cues.some((c) => c.to && k in c.to)) assert.equal(core.stateAt(cs, 0, base).nums[k], v, `${k} 시작 값`);
    });
  });
}

// 1209 자막이 말하는 수가 장면의 정답식(rule: 호 = 2πr·θ/360, 넓이 = πr²·θ/360)과 같은지 다시 계산합니다.
test('1209 자막의 수치(8π→16π, 48π→96π)가 공식과 같다', () => {
  const script = videos['1209'];
  const l = (r, th) => (2 * r * th) / 360;      // π 의 계수
  const S = (r, th) => (r * r * th) / 360;
  const r = script.start.b1209_r, th0 = script.start.b1209_th;
  const th1 = script.cues.find((c) => c.to && c.to.b1209_th).to.b1209_th;
  assert.equal(r, 12);
  assert.equal(th1, 2 * th0, '자막이 「2배」라고 말하므로 중심각 목표는 시작의 2배');
  const text = script.cues.map((c) => c.say || '').join(' ');
  assert.ok(text.includes(`${l(r, th0)}π → ${l(r, th1)}π`), `호 ${l(r, th0)}π → ${l(r, th1)}π`);
  assert.ok(text.includes(`${S(r, th0)}π → ${S(r, th1)}π`), `넓이 ${S(r, th0)}π → ${S(r, th1)}π`);
  assert.ok(text.includes(`${r} cm`) && text.includes(`${th0}°`), '반지름·중심각 값');
});
