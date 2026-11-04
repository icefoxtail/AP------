// 영상 목차 대본 검사 (node --test, 브라우저 불필요)
// 원과 부채꼴 및 겉넓이·부피 대본을 kit/apl-video-core.js 로 검사하고,
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
  'f4-swirl': { f4_swirl_R: [4, 10], f4_swirl_t: [0, 1], f4_swirl_mode: null, f4_swirl_seed: null, f4_swirl_pick: null },
  // 다음 대본(DeepSeek 시험) 대상: 1210(basic.js, 1209 와 같은 sectorSpec) · f1-ss2(f01.js 부채꼴에서 반원 파내기, 장면 id 는 'f1-ss2')
  '1210': { b1210_r: [3, 12], b1210_th: [10, 350] },
  'f1-ss2': { f1_ss2_a: [4, 12], f1_ss2_t: [0, 1], f1_ss2_mode: null, f1_ss2_seed: null, f1_ss2_pick: null },
  // 지시서 A (video-a.js): 끈의 길이(f05.js 'f5-sq4', 이름 f5A 반지름 2~8 · f5T 0~1) · 굴리기(rolling.js 'rl-rect', rlT 0~1. 직사각형 크기는 s.cfg 라 대본으로 못 바꿈)
  'f5-sq4': { f5A: [2, 8], f5T: [0, 1] },
  'rl-rect': { rlT: [0, 1] },
  // 지시서 B (video-b.js): 묶인 동물의 영역(swept.js 'gt-kennel', gtQ 개집 한 변 1~6 · gtL 끈 1~16 · gtT 0~1) · 잎 모양(f03.js 'f3-leaf-len', f3a 한 변 2~12 · f3t 0~1)
  'gt-kennel': { gtT: [0, 1], gtQ: [1, 6], gtL: [1, 16] },
  'f3-leaf-len': { f3a: [2, 12], f3t: [0, 1] },
  'sv1-1': { sR: [1, 15], sH: [2, 20], sT: [0, 1], svYaw: [-180, 180], svPitch: [-30, 85], svShape: null }
};
const SCENE_STATE_KEYS = Object.fromEntries(Object.entries(SCENE_STATE).map(([k, v]) => [k, new Set(Object.keys(v))]));

// 대본 파일: video.js(견본·시험) + video-a.js, video-b.js(DeepSeek 두 작업이 따로 쓰는 파일). html 의 MODULES 순서와 같게 한 sandbox 에서 차례로 읽어 합칩니다.
const VIDEO_FILES = ['video.js', 'video-a.js', 'video-b.js'];
function loadVideos() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of VIDEO_FILES) vm.runInContext(fs.readFileSync(path.join(SCENE_DIR, f), 'utf8'), sandbox, { filename: f });
  return (sandbox.window.APL_VIDEOS || {})['g7-circle-sector'] || {};
}

const videos = loadVideos();
const surfaceDir = path.join(labsDir, 'g7-surface-volume');
const surfaceSandbox = { window: {} };
vm.createContext(surfaceSandbox);
vm.runInContext(fs.readFileSync(path.join(surfaceDir, 'video.js'), 'utf8'), surfaceSandbox, { filename: 'g7-surface-volume/video.js' });
const surfaceVideos = (surfaceSandbox.window.APL_VIDEOS || {})['g7-surface-volume'] || {};
const allVideos = { ...videos, ...surfaceVideos };

test('원기둥 대본이 있고 장면 id가 다른 실험실과 충돌하지 않는다', () => {
  assert.ok(surfaceVideos['sv1-1'], 'sv1-1 대본');
  for (const id of Object.keys(surfaceVideos)) {
    assert.ok(!Object.hasOwn(videos, id), `${id}: 실험실 간 장면 id 충돌`);
    assert.ok(SCENE_STATE[id], `${id}: 상태값 표가 없습니다`);
  }
});

test('견본 두 장면(1209, f4-swirl)의 대본이 있고, 대본이 있는 장면은 모두 SCENE_STATE 표에 있다', () => {
  const ids = Object.keys(videos);
  assert.ok(ids.includes('1209') && ids.includes('f4-swirl'), '견본 대본 1209, f4-swirl');
  ids.forEach((id) => assert.ok(SCENE_STATE[id], `${id}: 이 테스트 파일 SCENE_STATE 표에 상태값이 없습니다`));
});

for (const [id, script] of Object.entries(allVideos)) {
  test(`영상 대본 ${id}: 형식·길이·자막·시각`, () => {
    const { errors } = core.validate(script);
    assert.deepEqual(errors, [], `대본 오류:\n${errors.join('\n')}`);
    // 쇼츠: 길이 8~15초
    assert.ok(core.LIMITS.minLen <= script.length && script.length <= core.LIMITS.maxLen, `length ${script.length}초`);
    // 자막이 비어 있지 않음 (validate가 say 없음·빈 줄도 잡지만 명시 확인)
    const says = script.cues.filter((c) => c.say);
    assert.ok(says.length >= core.LIMITS.minSay && says.length <= core.LIMITS.maxSay, `자막 ${core.LIMITS.minSay}~${core.LIMITS.maxSay}줄`);
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
  VIDEO_FILES.forEach((f) => {
    const m = f.replace(/\.js$/, '');
    assert.ok(new RegExp(`MODULES\\s*=\\s*\\[[^\\]]*'${m}'`).test(html), `MODULES 에 ${m} 포함`);
    assert.ok(fs.existsSync(path.join(SCENE_DIR, f)), `${f} 파일`);
  });
});

test('겉넓이·부피 HTML이 원기둥 영상 대본을 연결한다', () => {
  const html = fs.readFileSync(surfaceDir + '.html', 'utf8');
  assert.match(html, /videos:\s*\(window\.APL_VIDEOS\s*\|\|\s*\{\}\)\['g7-surface-volume'\]/);
  assert.match(html, /MODULES\s*=\s*\[[^\]]*'video'/);
});

test('원기둥 상태값 표가 실제 장면과 시점 소스에 일치한다', () => {
  const t1 = fs.readFileSync(path.join(surfaceDir, 't1.js'), 'utf8');
  const source = fs.readFileSync(path.join(surfaceDir, 'core.js'), 'utf8');
  const html = fs.readFileSync(surfaceDir + '.html', 'utf8');
  assert.match(source, /const P\s*=\s*\(label, min, max, step, value/);
  for (const [key, min, max] of [['sR', 1, 15], ['sH', 2, 20], ['sT', 0, 1]]) {
    assert.match(t1, new RegExp(`${key}:\\s*P\\('[^']+',\\s*${min},\\s*${max},`), `${key} 범위`);
  }
  assert.match(t1, /id:\s*'sv1-1'/);
  assert.match(t1, /SHAPE_ORDER\s*=\s*\[[^\]]*'circ'/);
  assert.match(t1, /s\.svShape\s*=\s*'rect'/);
  assert.match(source, /s\.svYaw\s*=\s*c0\.yaw;\s*s\.svPitch\s*=\s*c0\.pitch/);
  assert.match(html, /s\.svYaw\s*>\s*180/);
  assert.match(html, /s\.svYaw\s*<\s*-180/);
  assert.match(html, /clamp\([^;]+-30,\s*85\)/);
});

test('상태값 표가 장면 소스와 같다', () => {
  const basic = fs.readFileSync(path.join(SCENE_DIR, 'basic.js'), 'utf8');
  const f04 = fs.readFileSync(path.join(SCENE_DIR, 'f04.js'), 'utf8');
  // 1209: 장면 id, 상태값 접두어 'b', params r/th 와 범위
  assert.ok(/id:\s*'1209'/.test(basic), "basic.js 에 id '1209' 장면");
  assert.ok(/'b'\s*\+\s*[\w.]+\s*\+\s*'_'/.test(basic) || /`b\$\{[^}]+\}_/.test(basic) || /'b'\s*\+/.test(basic), "상태값 접두어 'b' 규칙");
  assert.ok(/r:\s*\{\s*value:\s*o\.def\.r,\s*min:\s*3,\s*max:\s*12/.test(basic), '1209 r 범위 3~12');
  assert.ok(/th:\s*\{\s*value:\s*o\.def\.th,\s*min:\s*thMin,\s*max:\s*thMax/.test(basic) && /thMin\s*=\s*o\.thMin\s*\|\|\s*10,\s*thMax\s*=\s*o\.thMax\s*\|\|\s*350/.test(basic), '1209 th 범위 10~350');
  // 1210: 1209 와 같은 sectorSpec(r 3~12, th 10~350)이고 장면 id 가 있다
  assert.ok(/id:\s*'1210'/.test(basic), "basic.js 에 id '1210' 장면");
  // f1-ss2: f01.js 접두어 f1, id ss2, 변수 a(4~12), t 0~1
  const f01 = fs.readFileSync(path.join(SCENE_DIR, 'f01.js'), 'utf8');
  assert.ok(/const PFX\s*=\s*'f1'/.test(f01), "f01.js 접두어 'f1'");
  const ss2 = f01.slice(f01.indexOf("id: 'ss2'"));
  assert.ok(/vars:\s*\[\{\s*k:\s*'a'[^}]*min:\s*4,\s*max:\s*12/.test(ss2.slice(0, 600)), 'ss2 a 범위 4~12');
  assert.ok(/PARAMS\[kt\]\s*=\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(f01), 'f01 t 범위 0~1');
  // f4-swirl: 접두어 f4, id swirl, 변수 R(4~10), t 0~1
  assert.ok(/const PFX\s*=\s*'f4'/.test(f04), "f04.js 접두어 'f4'");
  const swirl = f04.slice(f04.indexOf("id: 'swirl'"));
  assert.ok(/vars:\s*\[\{\s*k:\s*'R'[^}]*min:\s*4,\s*max:\s*10/.test(swirl.slice(0, 600)), 'swirl R 범위 4~10');
  assert.ok(/PARAMS\[kt\]\s*=\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(f04), 't 범위 0~1');
  // 지시서 A·B 장면: 장면 id 와 상태값 이름·범위가 소스에 있다
  const f05 = fs.readFileSync(path.join(SCENE_DIR, 'f05.js'), 'utf8');
  const rolling = fs.readFileSync(path.join(SCENE_DIR, 'rolling.js'), 'utf8');
  const swept = fs.readFileSync(path.join(SCENE_DIR, 'swept.js'), 'utf8');
  const f03 = fs.readFileSync(path.join(SCENE_DIR, 'f03.js'), 'utf8');
  assert.ok(/id:\s*'f5-sq4'/.test(f05) && /f5A:\s*\{[^}]*value:\s*A\.r0|min:\s*2,\s*max:\s*8,\s*step:\s*1,\s*value:\s*A\.r0/.test(f05), "f05.js 'f5-sq4' 와 반지름 f5A 2~8");
  assert.ok(/f5T:\s*DEF_T|const DEF_T/.test(f05), 'f05.js f5T');
  assert.ok(/id:\s*'rl-rect'/.test(rolling) && /rlT:\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(rolling), "rolling.js 'rl-rect' 와 rlT 0~1");
  assert.ok(/id:\s*'gt-kennel'/.test(swept) && /gtT:\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(swept) && /gtQ:\s*\{\s*value:\s*2,\s*min:\s*1,\s*max:\s*6/.test(swept) && /gtL:\s*\{\s*value:\s*5,\s*min:\s*1,\s*max:\s*16/.test(swept), "swept.js 'gt-kennel' 와 gtT·gtQ·gtL 범위");
  assert.ok(/id:\s*'f3-leaf-len'/.test(f03) && /f3a:\s*\{\s*value:\s*6,\s*min:\s*2,\s*max:\s*12/.test(f03) && /f3t:\s*PARAM_T/.test(f03) && /PARAM_T\s*=\s*\{\s*value:\s*0,\s*min:\s*0,\s*max:\s*1/.test(f03), "f03.js 'f3-leaf-len' 와 f3a 2~12 · f3t 0~1");
});

for (const [id, script] of Object.entries(allVideos)) {
  test(`영상 대본 ${id}: 상태값이 장면 값 범위 안이다`, () => {
    const ranges = SCENE_STATE[id];
    const check = (where, name, v) => {
      const r = ranges[name];
      if (r) assert.ok(typeof v === 'number' && Number.isFinite(v) && v >= r[0] && v <= r[1], `${where}.${name}=${v} 이 장면 범위 ${r[0]}~${r[1]} 밖입니다`);
      if (id === 'sv1-1' && name === 'svShape') assert.equal(v, 'circ', `${where}.svShape 는 원기둥이어야 합니다`);
    };
    Object.entries(script.start || {}).forEach(([k, v]) => check('start', k, v));
    script.cues.forEach((c, i) => Object.entries(c.to || {}).forEach(([k, v]) => check(`cues[${i}].to`, k, v)));
    script.cues.forEach((c, i) => Object.entries(c.set || {}).forEach(([k, v]) => check(`cues[${i}].set`, k, v)));
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

// 1209의 중심각과 넓이 비율을 장면 정답식에서 다시 계산합니다.
test('1209 중심각과 색칠한 넓이의 절반이 공식과 같다', () => {
  const script = videos['1209'];
  const S = (r, th) => (r * r * th) / 360;
  const r = script.start.b1209_r, th0 = script.start.b1209_th;
  const th1 = script.cues.find((c) => c.to && c.to.b1209_th).to.b1209_th;
  assert.equal(r, 12);
  assert.ok(th1 <= 200, '240° 근처는 라벨이 맞닿음(VIDEO_FINDINGS.md): 쇼츠 견본은 180°까지');
  assert.equal(th1, 2 * th0);
  const text = script.cues.map((c) => c.say || '').join(' ');
  assert.equal(th1 / 360, 1 / 2);
  assert.equal(S(r, th1), r * r / 2);
  assert.equal(S(r, th0), r * r / 4);
  assert.match(text, /180°.*절반.*넓이.*절반/);
  assert.ok(text.includes(`${th0}°`) && text.includes(`${th1}°`), '중심각 시작·끝 값');
  const cs = core.compile(script);
  const st = core.stateAt(cs, script.cues.find((c) => /넓이도 절반/.test(c.say || '')).at, { nums: {}, sets: {}, step: 0, part: null });
  assert.equal(st.nums.b1209_th, th1, '절반 자막에서 그림이 180°');
});

test('sv1-1 원기둥의 전개도 자막과 겉넓이 계산이 실제 상태에 맞다', () => {
  const script = surfaceVideos['sv1-1'];
  const cs = core.compile(script);
  const say = script.cues.find((c) => /가로는 밑면 둘레/.test(c.say || ''));
  assert.ok(say, '전개도 치수 자막');
  const st = core.stateAt(cs, say.at, { nums: {}, sets: { svShape: 'rect' }, step: 0, part: null });
  assert.equal(st.sets.svShape, 'circ');
  assert.equal(st.nums.sT, 1, '치수 자막에서 완전히 펼쳐짐');
  assert.equal(st.nums.sR, 3);
  assert.equal(st.nums.sH, 5);
  const r = st.nums.sR, h = st.nums.sH;
  assert.ok(say.say.includes(`${2 * r}\\pi`), '가로 = 밑면 둘레 6π');
  assert.ok(say.say.includes(`$${h}$`), '세로 = 높이 5');
  assert.equal(2 * r * r + 2 * r * h, 48, '겉넓이 π의 계수 48');
  assert.match(script.summary, /밑넓이\s*×\s*2\s*\+\s*밑면 둘레\s*×\s*높이/);
  assert.match(script.cues.at(-1).say, /밑넓이\s*2개\s*\+\s*옆넓이/);
});

// 영상 제목(title): 대본마다 있고(견본 8개), 20자 이하이며, 검증이 긴 제목·빈 제목·태그를 막는다.
test('모든 영상 대본에 짧은 제목(title, 20자 이하)이 있다', () => {
  for (const [id, script] of Object.entries(allVideos)) {
    assert.ok(typeof script.title === 'string' && script.title.trim(), `${id}: title 이 없습니다`);
    assert.ok(script.title.trim().length <= core.LIMITS.maxTitleChars, `${id}: title ${script.title.length}자`);
  }
});

test('title 검증: 없어도 통과, 20자 초과·빈 글·태그·수식은 오류, compile 이 title 을 돌려준다', () => {
  const base = videos['1209'];
  const withTitle = (t) => ({ ...base, title: t });
  assert.deepEqual(core.validate({ ...base, title: undefined }).errors, [], 'title 생략 가능');
  assert.deepEqual(core.validate(withTitle('중심각이 2배면 호는?')).errors, []);
  assert.ok(core.validate(withTitle('가'.repeat(core.LIMITS.maxTitleChars + 1))).errors.some((e) => e.includes('title')), '너무 긴 title');
  assert.ok(core.validate(withTitle('   ')).errors.some((e) => e.includes('title')), '빈 title');
  assert.ok(core.validate(withTitle('<b>호</b>')).errors.some((e) => e.includes('title')), '태그 title');
  assert.ok(core.validate(withTitle('$x$')).errors.some((e) => e.includes('title')), '수식 title');
  assert.equal(core.compile(withTitle(' 제목 ')).title, '제목');
  assert.equal(core.compile({ ...base, title: undefined }).title, null);
});

// snap: to 로 움직이는 동안 시작값 기준 snap 의 배수로만 지나가고(소수 방지), 끝 값은 정확히 to.
test('snap 검증: 양수 숫자·to 와 함께만, compile·stateAt 이 계단식으로 넘긴다', () => {
  const base = videos['1209'];
  const withSnap = (snap) => ({ ...base, cues: base.cues.map((c, i) => (i === 0 ? { ...c, snap } : c)) });
  assert.deepEqual(core.validate(withSnap(15)).errors, []);
  assert.ok(core.validate(withSnap(0)).errors.some((e) => e.includes('snap')), 'snap 0');
  assert.ok(core.validate(withSnap('x')).errors.some((e) => e.includes('snap')), 'snap 문자');
  assert.ok(core.validate({ ...base, cues: base.cues.map((c, i) => (i === 1 ? { ...c, snap: 5 } : c)) }).errors.some((e) => e.includes('snap')), 'to 없는 칸의 snap');
  const cs = core.compile(withSnap(15));
  const b = { nums: { ...base.start }, sets: {}, step: 0, part: null };
  const vals = new Set();
  for (let t = 0; t <= 4 + 1e-9; t += 0.05) vals.add(core.stateAt(cs, t, b).nums.b1209_th);
  assert.deepEqual([...vals].sort((a, c) => a - c), [90, 105, 120, 135, 150, 165, 180]);
});

// 움직이는 동안 소수가 보이지 않게 snap 을 쓴 영상은, 지나가는 모든 값에서 호·넓이(π 계수)가 정수여야 한다(1209·1210).
test('1209·1210 snap: 지나가는 모든 중심각에서 호·넓이의 π 계수가 정수', () => {
  for (const [id, key, r] of [['1209', 'b1209_th', 12], ['1210', 'b1210_th', 9]]) {
    const script = videos[id];
    assert.ok(script.cues.some((c) => c.snap > 0), `${id}: snap 이 있어야 합니다`);
    const cs = core.compile(script);
    const b = { nums: { ...script.start }, sets: {}, step: 0, part: null };
    for (let t = 0; t <= script.length + 1e-9; t += 0.05) {
      const th = core.stateAt(cs, Math.min(t, script.length), b).nums[key];
      const arc = (2 * r * th) / 360, area = (r * r * th) / 360;
      assert.ok(Math.abs(arc - Math.round(arc)) < 1e-9 && Math.abs(area - Math.round(area)) < 1e-9, `${id} t=${t.toFixed(2)} θ=${th}: 호 ${arc}π, 넓이 ${area}π 가 정수가 아님`);
    }
  }
});
