// 영상 목차 대본 검사 (node --test, 브라우저 불필요)
// 원과 부채꼴 영상 대본·해설(lesson, 장 여러 개를 이어 정답까지)을 kit/apl-video-core.js 로 검사하고,
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
  // 1210(basic.js sectorSpec). 1209·f4-swirl·f1-ss2 는 해설(lesson)로 대체되어 표에서 뺐습니다(해설은 tools/lessons.g7-circle-sector.test.mjs 가 검사)
  '1210': { b1210_r: [3, 12], b1210_th: [10, 350] },
  'sv1-1': { sR: [1, 15], sH: [2, 20], sT: [0, 1], svYaw: [-180, 180], svPitch: [-30, 85], svShape: null, sv11Mode: null, sv11Started: null, svShowV: null },
  // 해설(lesson) 장면: g7-circle-sector.html proofScene('sector')의 params csR 2~12 · csS 30~180(15 단위) · csT 0~100, 해설이 켜는 csShowS(결론 라벨을 아끼는 장면 표시)
  'z3-sectorProof': { csR: [2, 12], csS: [30, 180], csT: [0, 100], csShowS: null, csShowArc: null, csShowWidth: null }
};
const SCENE_STATE_KEYS = Object.fromEntries(Object.entries(SCENE_STATE).map(([k, v]) => [k, new Set(Object.keys(v))]));

// 과거 쇼츠 1210의 형식 회귀 자료. 실제 학생 장면은 lesson-basic-more.js의 1210 해설을 불러옵니다.
// 단일 영상 규칙을 검증하던 분모는 유지하되 학생 화면에 과거 쇼츠를 중복 등록하지 않습니다.
const VIDEO_FILES = ['video.js'];
function loadVideos() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of VIDEO_FILES) vm.runInContext(fs.readFileSync(path.join(SCENE_DIR, f), 'utf8'), sandbox, { filename: f });
  return (sandbox.window.APL_VIDEOS || {})['g7-circle-sector'] || {};
}

const videos = loadVideos();
const surfaceDir = path.join(labsDir, 'g7-surface-volume');
const allVideos = { ...videos };

// 해설(lesson) 파일: 실험실마다 labs/<id>/lesson.js (window.APL_LESSONS[실험실 id] = { 장면 id: 해설 })
function loadLessons(lab) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(labsDir, lab, 'lesson.js'), 'utf8'), sandbox, { filename: `${lab}/lesson.js` });
  return (sandbox.window.APL_LESSONS || {})[lab] || {};
}
const sectorLessons = loadLessons('g7-circle-sector');
const surfaceLessons = loadLessons('g7-surface-volume');
// 새 원과 부채꼴 해설은 tools/lessons.g7-circle-sector.test.mjs 가 검사합니다(상태값 표·자막 숫자·정답 조기 노출). 이 파일의 일반 해설 검사는 기존 해설만 봅니다.
const legacySectorLessons = { 'z3-sectorProof': sectorLessons['z3-sectorProof'] };
const allLessons = { ...legacySectorLessons, ...surfaceLessons };

// 쇼츠 규칙·snap 검사용 견본: 해설로 대체되어 video.js 에서 지운 1209 쇼츠 그대로(kit 의 title·snap 검사가 쓰는 입력)
const FIXTURE_1209 = {
  length: 12,
  title: '부채꼴 넓이는 원의 얼마?',
  start: { b1209_r: 12, b1209_th: 90 },
  summary: '부채꼴 넓이 = 원의 넓이 × 중심각 ÷ 360',
  task: '중심각을 바꾸며 색칠한 넓이가 원의 몇 분의 일인지 살펴보세요',
  cues: [
    { at: 0, say: '중심각을 **90°에서 180°**로 키워요.', to: { b1209_th: 180 }, dur: 4, ease: 'linear', snap: 15 },
    { at: 4.5, say: '180°는 한 바퀴의 절반, 색칠한 넓이도 절반이에요.' },
    { at: 8.5, say: '부채꼴 넓이 = 원의 넓이 × 중심각 ÷ 360' }
  ]
};

test('해설 파일이 있고 장면 id가 다른 실험실과 충돌하지 않으며, 깨진 옛 원기둥 영상 대본은 남아 있지 않다', () => {
  assert.equal(core.lessonList(surfaceLessons['sv1-1']).length, 2, 'sv1-1 은 겉넓이·부피 해설 둘');
  assert.deepEqual(Array.from(core.lessonList(surfaceLessons['sv1-1']).map((l) => l.label)), ['겉넓이', '부피']);
  assert.deepEqual(core.validateLessonSet(surfaceLessons['sv1-1']).errors, [], '해설 묶음 검사');
  assert.ok(sectorLessons['z3-sectorProof'], 'z3-sectorProof 해설');
  assert.ok(!fs.existsSync(path.join(surfaceDir, 'video.js')), 'sv1-1 옛 영상 대본(sv11Started 를 켜지 않아 펼쳐지지 않던 것)은 해설로 대체되어 지워졌습니다');
  for (const id of Object.keys(allLessons)) {
    assert.ok(!Object.hasOwn(videos, id), `${id}: 해설 id 가 영상 대본 id 와 충돌`);
    assert.ok(SCENE_STATE[id], `${id}: 상태값 표가 없습니다`);
  }
});

test('남은 영상 대본이 모두 SCENE_STATE 표에 있다(1209·f4-swirl·f1-ss2 는 해설로 대체됨)', () => {
  const ids = Object.keys(videos);
  assert.ok(ids.includes('1210'), '견본 대본 1210');
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

test('1210은 학생 HTML에서 해설로 연결하고 과거 쇼츠 형식 검사는 유지한다', async () => {
  const html = fs.readFileSync(path.join(SCENE_DIR + '.html'), 'utf8');
  assert.match(html, /MODULES\s*=\s*\[[^\]]*'lesson-basic-more'/, '1210 실제 해설 모듈 포함');
  assert.doesNotMatch(html, /MODULES\s*=\s*\[[^\]]*'video'/, '과거 쇼츠 중복 로드 없음');
  VIDEO_FILES.forEach((f) => {
    assert.ok(fs.existsSync(path.join(SCENE_DIR, f)), `${f} 형식 회귀 자료 보존`);
  });
  const { load } = await import('./helpers/circle-lesson-runtime.mjs');
  const lab = await load();
  assert.equal(lab.def.videos, undefined, '학생 런타임에 과거 쇼츠가 등록되지 않음');
  const current = core.lessonList(lab.def.lessons['1210']);
  assert.equal(current.length, 1, '1210 원클릭 해설 하나');
  assert.deepEqual(core.validateLesson(current[0]).errors, []);
  assert.equal(core.compileLesson(current[0]).kind, 'lesson');
});

test('실험실 HTML이 해설을 lessons 로 연결하고 lesson 모듈을 불러온다', () => {
  for (const lab of ['g7-circle-sector', 'g7-surface-volume']) {
    const html = fs.readFileSync(path.join(labsDir, lab + '.html'), 'utf8');
    assert.ok(html.includes(`lessons: (window.APL_LESSONS || {})['${lab}']`), `${lab}: createLab 의 lessons 연결`);
    assert.match(html, /MODULES\s*=\s*\[[^\]]*'lesson'/, `${lab}: MODULES 에 lesson 포함`);
    assert.ok(fs.existsSync(path.join(labsDir, lab, 'lesson.js')), `${lab}/lesson.js`);
  }
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
  // 1210: sectorSpec(r 3~12, th 10~350)이고 장면 id 가 있다
  assert.ok(/'b'\s*\+/.test(basic), "상태값 접두어 'b' 규칙");
  assert.ok(/thMin\s*=\s*o\.thMin\s*\|\|\s*10,\s*thMax\s*=\s*o\.thMax\s*\|\|\s*350/.test(basic), 'sectorSpec th 범위 10~350');
  assert.ok(/id:\s*'1210'/.test(basic), "basic.js 에 id '1210' 장면");
});

for (const [id, script] of Object.entries(allVideos)) {
  test(`영상 대본 ${id}: 상태값이 장면 값 범위 안이다`, () => {
    const ranges = SCENE_STATE[id];
    const check = (where, name, v) => {
      const r = ranges[name];
      if (r) assert.ok(typeof v === 'number' && Number.isFinite(v) && v >= r[0] && v <= r[1], `${where}.${name}=${v} 이 장면 범위 ${r[0]}~${r[1]} 밖입니다`);
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

// 영상 제목(title): 대본마다 있고(견본 8개), 20자 이하이며, 검증이 긴 제목·빈 제목·태그를 막는다.
test('모든 영상 대본에 짧은 제목(title, 20자 이하)이 있다', () => {
  for (const [id, script] of Object.entries(allVideos)) {
    assert.ok(typeof script.title === 'string' && script.title.trim(), `${id}: title 이 없습니다`);
    assert.ok(script.title.trim().length <= core.LIMITS.maxTitleChars, `${id}: title ${script.title.length}자`);
  }
});

test('title 검증: 없어도 통과, 20자 초과·빈 글·태그·수식은 오류, compile 이 title 을 돌려준다', () => {
  const base = FIXTURE_1209;
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
  const base = FIXTURE_1209;
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
    const script = id === '1209' ? FIXTURE_1209 : videos[id];
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

/* ==========================================================================
   해설(lesson): 장 여러 개를 이어 정답까지 (validateLesson · compileLesson)
   ========================================================================== */
const baseOf = (lesson) => ({ nums: { ...(lesson.chapters[0].start || {}) }, sets: {}, step: 1, part: null });
const chapterCues = (lesson) => lesson.chapters.flatMap((ch) => ch.cues);
const sayList = (lesson) => lesson.chapters.map((ch) => ch.cues.filter((c) => c.say).map((c) => c.say));
const plainText = (say) => String(say).replace(/\\frac(\d)(\d)/g, '$1/$2').replace(/\*\*/g, '');
const numbersOf = (say) => (plainText(say).match(/\d+(?:\.\d+)?/g) || []).map(Number);
const mk = (len, title, cues, extra = {}) => ({ length: len, title, cues, ...extra });
const goodLesson = () => ({
  title: '시험 해설', answer: '$42$', summary: '요약', task: '해 볼 일',
  chapters: [
    mk(9, '조건', [{ at: 0, say: '값을 키워요.', to: { x: 10 }, dur: 4 }, { at: 4.5, say: '그림이 변해요.' }], { start: { x: 0 } }),
    mk(9, '과정', [{ at: 0, say: '다시 키워요.', to: { x: 20 }, dur: 4 }, { at: 4.5, say: '또 변해요.' }]),
    mk(9, '결론', [{ at: 0, say: '더 키워요.', to: { x: 30 }, dur: 4 }, { at: 4.5, say: '정답은 $42$.' }])
  ]
});

// 한 장면의 해설이 배열이어도(여럿) 해설마다 같은 검사를 합니다.
for (const [id, lesson] of Object.entries(allLessons).flatMap(([k, v]) => core.lessonList(v).map((l) => [k, l]))) {
  test(`해설 ${id}: 형식 검사(장 수·장별 쇼츠 규칙·경고 없음)`, () => {
    const v = core.validateLesson(lesson);
    assert.deepEqual(v.errors, [], `해설 오류:\n${v.errors.join('\n')}`);
    assert.deepEqual(v.warnings, [], `경고(같은 칸의 to+step 등):\n${v.warnings.join('\n')}`);
    assert.ok(lesson.chapters.length >= 2 && lesson.chapters.length <= 6, '장 2~6개');
    lesson.chapters.forEach((ch, i) => {
      assert.ok(ch.length >= 8 && ch.length <= 15, `chapters[${i}] ${ch.length}초`);
      assert.ok(typeof ch.title === 'string' && ch.title.trim().length > 0 && ch.title.length <= core.LIMITS.maxTitleChars, `chapters[${i}] title`);
    });
    assert.ok(lesson.answer, '문항형 해설은 answer 를 적어 조기 노출 검사를 받습니다');
  });

  test(`해설 ${id}: 상태값 이름·값 범위가 장면과 같고 정리 탭(tab) 사용은 정리 탭이 그림을 바꾸는 장면에 한정`, () => {
    const ranges = SCENE_STATE[id], known = SCENE_STATE_KEYS[id];
    assert.ok(known, `${id}: SCENE_STATE 표`);
    const seen = [];
    lesson.chapters.forEach((ch, i) => {
      Object.entries(ch.start || {}).forEach(([k, v]) => seen.push([`chapters[${i}].start`, k, v]));
      ch.cues.forEach((c, j) => {
        Object.entries(c.to || {}).forEach(([k, v]) => seen.push([`chapters[${i}].cues[${j}].to`, k, v]));
        Object.entries(c.set || {}).forEach(([k, v]) => seen.push([`chapters[${i}].cues[${j}].set`, k, v]));
      });
    });
    for (const [where, k, v] of seen) {
      assert.ok(known.has(k), `${where}.${k} 은 장면 ${id} 의 상태값이 아닙니다`);
      const r = ranges[k];
      if (r) assert.ok(typeof v === 'number' && Number.isFinite(v) && v >= r[0] && v <= r[1], `${where}.${k}=${v} 이 장면 범위 ${r[0]}~${r[1]} 밖입니다`);
    }
    if (id === 'sv1-1') {
      assert.equal(lesson.tab, 'review', '원기둥 해설은 길이 표시가 있는 정리 탭 그림을 씁니다');
      assert.ok(seen.some(([, k, v]) => k === 'svShape' && v === 'circ'), '원기둥');
      assert.ok(seen.some(([, k, v]) => k === 'sv11Started' && v === true), '전개도를 시작해야 펼쳐집니다(옛 영상 대본이 빠뜨렸던 값)');
      const steps = chapterCues(lesson).filter((c) => c.step !== undefined).map((c) => c.step);
      assert.deepEqual(Array.from(steps), lesson.label === '부피' ? [1, 2, 3] : [2, 3], '정리 탭 단계: 겉넓이는 2 → 3(장면에 들어갈 때 그림이 이미 전개도), 부피는 1 → 2 → 3(1단계에서 밑면·밑넓이·반지름을 그림)');
    } else assert.equal(lesson.tab, undefined, `${id}: tab 은 정리 탭이 같은 문제를 그리는 것을 확인한 장면에만 켭니다`);
  });

  test(`해설 ${id}: 이어 붙인 시간 계산(길이·장 경계·시각이 거꾸로 가지 않음·경계에서 값이 이어짐)`, () => {
    const cs = core.compileLesson(lesson), base = baseOf(lesson);
    assert.equal(cs.kind, 'lesson');
    assert.equal(cs.length, lesson.chapters.reduce((a, ch) => a + ch.length, 0));
    assert.equal(cs.chapters.length, lesson.chapters.length);
    let at = 0;
    cs.chapters.forEach((c, i) => { assert.equal(c.at, at, `chapters[${i}].at`); assert.equal(c.title, lesson.chapters[i].title); at += c.length; });
    for (let i = 1; i < cs.cues.length; i++) assert.ok(cs.cues[i].at > cs.cues[i - 1].at, `cues[${i}] 시각 증가`);
    for (let i = 1; i < cs.says.length; i++) assert.ok(cs.says[i].at > cs.says[i - 1].at && cs.says[i - 1].end === cs.says[i].at, `says[${i}] 이어짐`);
    assert.equal(cs.says.at(-1).end, cs.length);
    for (const [k, segs] of Object.entries(cs.tracks)) segs.forEach((g, i) => { assert.ok(g.t1 >= g.t0, `${k}[${i}] 구간`); if (i) assert.ok(g.t0 >= segs[i - 1].t1 - 1e-9, `${k}[${i}] 앞 구간과 겹치지 않음`); });
    let prevSay = -1;
    for (let t = 0; t <= cs.length + 1e-9; t += 0.1) {
      const st = core.stateAt(cs, Math.min(t, cs.length), base);
      Object.entries(st.nums).forEach(([k, v]) => assert.ok(Number.isFinite(v), `t=${t.toFixed(1)} ${k}`));
      assert.ok(st.say >= prevSay, `t=${t.toFixed(1)} 자막이 거꾸로 감`);
      prevSay = st.say;
    }
    // 장 경계 연속성: 경계 직전·직후 값이 같다(다음 장의 start 가 즉시 바꾸지 않는 값)
    cs.chapters.slice(1).forEach((c, i) => {
      const before = core.stateAt(cs, c.at - 1e-6, base), after = core.stateAt(cs, c.at + 1e-6, base);
      const restarted = new Set(Object.keys(lesson.chapters[i + 1].start || {}));
      for (const k of Object.keys(before.nums)) if (!restarted.has(k)) assert.ok(Math.abs(before.nums[k] - after.nums[k]) < 1e-3, `장 ${i + 1}→${i + 2} 경계에서 ${k} 가 ${before.nums[k]} → ${after.nums[k]} 로 튐`);
    });
    // 끝 값 = 각 상태값의 마지막 목표값/설정값
    const end = core.stateAt(cs, cs.length, base), want = { nums: {}, sets: {} };
    lesson.chapters.forEach((ch) => { Object.assign(want.nums, ch.start || {}); ch.cues.forEach((c) => { Object.assign(want.nums, c.to || {}); Object.assign(want.sets, c.set || {}); }); });
    Object.entries(want.nums).forEach(([k, v]) => assert.ok(Math.abs(end.nums[k] - v) < 1e-9, `${k}: 끝 값 ${end.nums[k]} ≠ ${v}`));
    Object.entries(want.sets).forEach(([k, v]) => assert.deepEqual(end.sets[k], v, `${k} 끝 설정`));
  });

  test(`해설 ${id}: 정답은 마지막 장에서만 나온다`, () => {
    const ans = core.normAnswer(lesson.answer);
    assert.ok(ans.length > 0);
    assert.ok(!core.normAnswer(lesson.title).includes(ans), '해설 제목에 정답');
    lesson.chapters.forEach((ch, i) => {
      const early = i < lesson.chapters.length - 1;
      if (early) assert.ok(!core.normAnswer(ch.title).includes(ans), `chapters[${i}] 제목에 정답`);
      sayList(lesson)[i].forEach((s) => { if (early) assert.ok(!core.normAnswer(s).includes(ans), `chapters[${i}] 자막에 정답: ${s}`); });
    });
    assert.ok(sayList(lesson).at(-1).some((s) => core.normAnswer(s).includes(ans)), '마지막 장에는 정답이 있어야 합니다');
    // 정답은 마지막 장의 마지막 자막(결론)에서 나온다
    assert.ok(core.normAnswer(sayList(lesson).at(-1).at(-1)).includes(ans), '마지막 자막이 결론');
  });
}

test('validateLesson: 장 수 2~6 · 장마다 title · 장 규칙 · 알 수 없는 필드 · tab · 첫 장만 「첫 1초 안에 움직임」', () => {
  assert.deepEqual(core.validateLesson(goodLesson()).errors, []);
  const L = goodLesson();
  assert.ok(core.validateLesson({ ...L, chapters: [L.chapters[0]] }).errors.some((e) => e.includes('장 1개')), '장 1개');
  assert.ok(core.validateLesson({ ...L, chapters: Array.from({ length: 7 }, () => L.chapters[1]) }).errors.some((e) => e.includes('장 7개')), '장 7개');
  assert.ok(core.validateLesson({ ...L, chapters: [L.chapters[0], { ...L.chapters[1], title: undefined }, L.chapters[2]] }).errors.some((e) => e.includes('title')), '장 title 없음');
  assert.ok(core.validateLesson({ ...L, chapters: [L.chapters[0], { ...L.chapters[1], length: 20 }, L.chapters[2]] }).errors.some((e) => e.includes('8~15')), '장 길이');
  assert.ok(core.validateLesson({ ...L, extra: 1 }).errors.some((e) => e.includes('extra')), '알 수 없는 필드');
  assert.ok(core.validateLesson({ ...L, tab: 'problem' }).errors.some((e) => e.includes('tab')), 'tab');
  assert.deepEqual(core.validateLesson({ ...L, tab: 'review' }).errors, []);
  assert.ok(core.validateLesson({ ...L, summary: '' }).errors.some((e) => e.includes('summary')), 'summary');
  // 첫 장은 첫 1초 안에 움직여야 하고, 둘째 장 이후는 조건을 짚고 단계만 바꾸는 장도 가능
  // (2026-11-11) 해설의 첫 장은 to 뿐 아니라 step·part 바꿈도 첫 움직임으로 인정합니다(정리 탭 그림이 정지한 부피 장면 등). 움직임이 전혀 없는 장만 실패합니다. 세부 사례: tools/lessons.g7-surface-volume.test.mjs
  const still = mk(9, '정지', [{ at: 0, say: '말만 해요.' }, { at: 4.5, say: '그림을 봐요.' }]);
  assert.ok(core.validateLesson({ ...L, chapters: [still, L.chapters[1], L.chapters[2]] }).errors.some((e) => e.includes('첫 1초')), '첫 장은 움직여야 함');
  assert.deepEqual(core.validateLesson({ ...L, chapters: [L.chapters[0], still, L.chapters[2]] }).errors, [], '둘째 장 이후는 움직임 없이 가능');
  // 같은 칸에 to 와 step 을 함께 쓰면 경고(값이 바뀌며 장면이 step 을 되돌릴 수 있음)
  const both = mk(9, '둘 다', [{ at: 0, say: '같이 써요.', to: { x: 5 }, step: 2, dur: 4 }, { at: 4.5, say: '경고가 떠요.' }]);
  assert.ok(core.validateLesson({ ...L, chapters: [L.chapters[0], both, L.chapters[2]] }).warnings.some((w) => w.includes('to 와 step')), 'to+step 경고');
  assert.ok(core.validate(both, { chapter: true, first: false }).warnings.some((w) => w.includes('to 와 step')), '단일 대본에서도 경고');
  // 단일 영상 대본은 예전과 같이 검사됩니다(summary·task 필수, 첫 1초 규칙)
  assert.ok(core.validate({ length: 9, title: '제목', cues: both.cues }).errors.some((e) => e.includes('summary')), '영상 대본은 summary 필수');
});

test('validateLesson: 정답이 마지막 장보다 먼저(자막·장 제목·해설 제목) 나오면 실패, 마지막 장은 허용', () => {
  const L = goodLesson();
  const at = (i, patch) => ({ ...L, chapters: L.chapters.map((c, k) => (k === i ? { ...c, ...patch(c) } : c)) });
  assert.deepEqual(core.validateLesson(L).errors, []);
  assert.ok(core.validateLesson(at(0, (c) => ({ cues: [c.cues[0], { ...c.cues[1], say: '정답은 $42$일까요?' }] }))).errors.some((e) => e.includes('정답')), '첫 장 자막');
  assert.ok(core.validateLesson(at(1, (c) => ({ title: '답은 42' }))).errors.some((e) => e.includes('정답')), '가운데 장 제목');
  assert.ok(core.validateLesson({ ...L, title: '답 42 구하기' }).errors.some((e) => e.includes('정답')), '해설 제목');
  assert.ok(core.validateLesson(at(2, (c) => ({ title: '정답 42' }))).errors.length === 0, '마지막 장 제목은 허용');
  // 표기가 달라도(공백·$·\\pi·π) 같은 정답으로 봄
  assert.equal(core.normAnswer('$12\\pi$ cm²'), core.normAnswer('12 π cm²'));
  const P = { ...L, answer: '$12\\pi$' };
  assert.ok(core.validateLesson({ ...P, chapters: [{ ...P.chapters[0], cues: [P.chapters[0].cues[0], { ...P.chapters[0].cues[1], say: '넓이는 12π예요.' }] }, P.chapters[1], P.chapters[2]] }).errors.some((e) => e.includes('정답')), 'π 표기 차이');
});

test('validateLesson: set 키는 첫 장 at:0 칸에 시작값이 있어야 한다(다시 보기가 앞선 재생의 값에서 시작하지 않게), answerText 검사', () => {
  const L = goodLesson();
  const withSet = (c0, laterSet) => ({ ...L, chapters: [{ ...L.chapters[0], cues: [{ ...L.chapters[0].cues[0], ...c0 }, L.chapters[0].cues[1]] }, L.chapters[1], { ...L.chapters[2], cues: [L.chapters[2].cues[0], { ...L.chapters[2].cues[1], ...laterSet }] }] });
  assert.ok(core.validateLesson(withSet({}, { set: { reveal: true } })).errors.some((e) => e.includes('set.reveal')), 'at:0 에 시작값 없는 set 키');
  assert.deepEqual(core.validateLesson(withSet({ set: { reveal: false } }, { set: { reveal: true } })).errors, [], 'at:0 에 시작값이 있으면 통과');
  // 재생 시작 상태는 장면에 남은 값(base)과 상관없이 같다: 앞선 재생이 reveal 을 true 로 남겨도 t=0 과 결론 직전은 false
  const lesson = withSet({ set: { reveal: false } }, { set: { reveal: true } });
  const cs = core.compileLesson(lesson);
  for (const left of [undefined, false, true]) {
    const base = { nums: { x: 0 }, sets: { reveal: left }, step: 0, part: null };
    assert.equal(core.stateAt(cs, 0, base).sets.reveal, false, `base=${left}: t=0`);
    assert.equal(core.stateAt(cs, cs.length - 5, base).sets.reveal, false, `base=${left}: 결론 자막 직전`);
    assert.equal(core.stateAt(cs, cs.length - 0.1, base).sets.reveal, true, `base=${left}: 결론 자막`);
  }
  assert.ok(core.validateLesson({ ...L, answerText: '값은 7' }).errors.some((e) => e.includes('answerText')), 'answerText 에 answer 없음');
  assert.deepEqual(core.validateLesson({ ...L, answerText: '$42$ cm²' }).errors, []);
  assert.equal(core.compileLesson(L).answerText, '$42$', 'answerText 기본값은 answer');
});

// ---------- 한 장면에 해설이 여럿(배열) ----------
const withSets = (label, sets, patch = {}) => {
  const L = goodLesson();
  L.chapters[0].cues[0] = { ...L.chapters[0].cues[0], ...(sets ? { set: sets } : {}) };
  return { ...L, ...(label ? { label } : {}), ...patch };
};

test('validateLesson: to 로 움직이는 숫자 상태값은 모두 첫 장 start 에 시작값이 있어야 한다(다시 보기가 남은 값에서 시작하지 않게)', () => {
  const L = goodLesson();
  assert.deepEqual(core.validateLesson(L).errors, []);
  const noStart = { ...L, chapters: [{ ...L.chapters[0], start: undefined }, L.chapters[1], L.chapters[2]] };
  assert.ok(core.validateLesson(noStart).errors.some((e) => e.includes('to.x') && e.includes('start')), '첫 장 start 가 없으면 오류');
  const lateKey = { ...L, chapters: [L.chapters[0], { ...L.chapters[1], cues: [{ ...L.chapters[1].cues[0], to: { y: 3 } }, L.chapters[1].cues[1]] }, L.chapters[2]] };
  assert.ok(core.validateLesson(lateKey).errors.some((e) => e.includes('to.y')), '뒷장에서만 움직이는 값도 첫 장 start 에 있어야 함');
  const ok = { ...lateKey, chapters: [{ ...L.chapters[0], start: { x: 0, y: 0 } }, lateKey.chapters[1], L.chapters[2]] };
  assert.deepEqual(core.validateLesson(ok).errors, [], 'start 에 적으면 통과');
  // 실제 해설 셋(부채꼴 · 겉넓이 · 부피)은 이미 이 규칙을 지킨다(위 해설별 형식 검사가 같은 규칙으로 통과)
  for (const l of [...core.lessonList(sectorLessons['z3-sectorProof']), ...core.lessonList(surfaceLessons['sv1-1'])]) assert.deepEqual(core.validateLesson(l).errors, [], l.title);
});

test('validateLessonSet: 해설 1~8개, 둘 이상이면 label 필수·6자 이하·겹침 금지, 한 해설의 set 키는 나머지도 at:0 에서 정해야 한다', () => {
  const A = withSets('겉넓이', { mode: 'a', open: false }), B = withSets('부피', { mode: 'b', open: false });
  assert.deepEqual(core.validateLessonSet(goodLesson()).errors, [], '해설 하나(객체)는 label 없이 통과');
  assert.deepEqual(core.validateLessonSet([goodLesson()]).errors, [], '배열 하나도 label 없이 통과');
  assert.deepEqual(core.validateLessonSet([A, B]).errors, [], '둘');
  assert.deepEqual(core.validateLessonSet([A, B, withSets('둘레', { mode: 'c', open: false })]).errors, [], '셋');
  const four = [A, B, withSets('둘레', { mode: 'c', open: false }), withSets('넓이', { mode: 'd', open: false })];
  assert.deepEqual(core.validateLessonSet(four).errors, [], '다른 개념 넷은 각각 재생 가능');
  const eight = [...four, ...['다섯째', '여섯째', '일곱째', '여덟째'].map((label, i) => withSets(label, { mode: String(i + 4), open: false }))];
  assert.deepEqual(core.validateLessonSet(eight).errors, [], '구별되는 여덟 개념까지 각각 재생 가능');
  assert.ok(core.validateLessonSet([...eight, withSets('아홉째', { mode: 'i', open: false })]).errors.some((e) => e.includes('8개까지')), '아홉은 오류');
  assert.ok(core.validateLessonSet([]).errors.length, '빈 배열');
  assert.ok(core.validateLessonSet([A, withSets(null, { mode: 'b', open: false })]).errors.some((e) => e.includes('label 이 필수')), '둘 이상이면 label 필수');
  assert.ok(core.validateLessonSet([A, withSets('겉넓이', { mode: 'b', open: false })]).errors.some((e) => e.includes('겹칩니다')), 'label 겹침');
  assert.ok(core.validateLessonSet([A, withSets('가나다라마바사', { mode: 'b', open: false })]).errors.some((e) => e.includes('label')), 'label 7자');
  assert.ok(core.validateLessonSet([A, withSets('$x$', { mode: 'b', open: false })]).errors.some((e) => e.includes('label')), 'label 에 수식');
  assert.deepEqual(core.validateLessonSet([A, withSets('여섯글자여섯', { mode: 'b', open: false })]).errors, [], 'label 6자는 허용');
  // 한 해설만 바꾸는 set 키(다른 해설은 at:0 에 시작값이 없음)는 해설을 오갈 때 값이 샐 수 있어 오류
  const leak = core.validateLessonSet([withSets('겉넓이', { mode: 'a', reveal: false }, { answer: '$42$' }), withSets('부피', { mode: 'b' })]);
  assert.ok(leak.errors.some((e) => e.includes('set.reveal')), `다른 해설이 정하지 않은 set 키: ${leak.errors.join('/')}`);
  // 각 해설은 해설 단위로도 검사된다(정답 조기 노출은 해설마다)
  const early = withSets('부피', { mode: 'b', open: false });
  early.chapters[0].cues[1] = { ...early.chapters[0].cues[1], say: '정답은 $42$일까요?' };
  assert.ok(core.validateLessonSet([A, early]).errors.some((e) => e.includes('lessons[1]') && e.includes('정답')), '둘째 해설의 정답 조기 노출');
  assert.deepEqual(core.lessonList(A), [A]);
  assert.deepEqual(core.lessonList([A, B]), [A, B]);
  assert.deepEqual(core.lessonList(null), []);
  assert.equal(core.compileLesson(A).label, '겉넓이');
  assert.equal(core.compileLesson(goodLesson()).label, null);
});

test('네 번째 해설도 독립 버튼, 번호 주소, 이름 주소와 다음 재생으로 선택된다', () => {
  const lessons = ['범위', '개수', '최댓값', '최솟값'].map((label, mode) => withSets(label, { mode, open: false }));
  const APLab = {
    videoCore: core, icon: () => '', esc: String,
    h: (tag, props) => ({ tag, props, innerHTML: '' })
  };
  vm.runInNewContext(fs.readFileSync(path.resolve(DIR, '../kit/apl-player.js'), 'utf8'), { window: { APLab }, console });
  const player = Object.create(APLab.Player.prototype);
  player.lab = { id: 'fixture', list: [{ id: 'one', lesson: lessons }], def: {} };
  player._cache = new WeakMap(); player.index = 0; player.lessonIndex = 2;
  const buttons = [];
  player.ui = { entryBtns: { childElementCount: 0, innerHTML: '', append: b => buttons.push(b) } };
  let selected = -1; player._entryGo = k => { selected = k; };
  const entries = player.entries(0);
  assert.equal(entries.length, 4);
  player._buildEntryButtons(entries);
  assert.equal(buttons.length, 4, '네 개의 실제 player 버튼 생성');
  buttons[3].props.onclick();
  assert.equal(selected, 3, '네 번째 버튼이 네 번째 해설 선택');
  assert.equal(player._playParam('4', 0), 3);
  assert.equal(player._playParam('최솟값', 0), 3);
  for (const invalid of ['0', '5', '04', '-1', '4.0']) assert.equal(player._playParam(invalid, 0), -1);
  assert.equal(player.nextTarget().k, 3, '세 번째의 다음은 네 번째');
  player.lessonIndex = 3;
  assert.equal(player.nextTarget(), null, '마지막 해설 뒤에는 목차');
  const bad = structuredClone(lessons);
  delete bad[3].chapters[0].cues[0].set.open;
  assert.ok(core.validateLessonSet(bad).errors.some(e => e.includes('lessons[3]') && e.includes('set.open')), '네 번째도 형제 상태 초기화 검사');
  const early = structuredClone(lessons);
  early[3].chapters[0].cues[1].say = '정답은 $42$일까요?';
  assert.ok(core.validateLessonSet(early).errors.some(e => e.includes('lessons[3]') && e.includes('정답')), '네 번째도 조기 정답 검사');
});

test('여덟 번째 해설도 독립 버튼, 번호 주소, 이름 주소와 다음 재생으로 선택된다', () => {
  const lessons = ['RHA', 'RHS', 'SAS', 'ASA', '두예각', '빗변만', '한예각', '한직각변'].map((label, mode) => withSets(label, { mode, open: false }));
  const APLab = { videoCore: core, icon: () => '', esc: String, h: (tag, props) => ({ tag, props, innerHTML: '' }) };
  vm.runInNewContext(fs.readFileSync(path.resolve(DIR, '../kit/apl-player.js'), 'utf8'), { window: { APLab }, console });
  const player = Object.create(APLab.Player.prototype);
  player.lab = { id: 'fixture', list: [{ id: 'one', lesson: lessons }], def: {} };
  player._cache = new WeakMap(); player.index = 0; player.lessonIndex = 6;
  const buttons = [];
  player.ui = { entryBtns: { childElementCount: 0, innerHTML: '', append: button => buttons.push(button) } };
  let selected = -1; player._entryGo = index => { selected = index; };
  const entries = player.entries(0);
  assert.equal(entries.length, 8);
  player._buildEntryButtons(entries);
  assert.equal(buttons.length, 8, '여덟 개의 실제 player 버튼 생성');
  buttons[7].props.onclick();
  assert.equal(selected, 7, '여덟 번째 버튼이 여덟 번째 해설 선택');
  assert.equal(player._playParam('8', 0), 7);
  assert.equal(player._playParam('한직각변', 0), 7);
  for (const invalid of ['0', '9', '08', '-1', '8.0']) assert.equal(player._playParam(invalid, 0), -1);
  assert.equal(player.nextTarget().k, 7, '일곱 번째의 다음은 여덟 번째');
  player.lessonIndex = 7;
  assert.equal(player.nextTarget(), null, '마지막 해설 뒤에는 목차');
  const bad = structuredClone(lessons);
  delete bad[7].chapters[0].cues[0].set.open;
  assert.ok(core.validateLessonSet(bad).errors.some(e => e.includes('lessons[7]') && e.includes('set.open')), '여덟 번째도 형제 상태 초기화 검사');
  const early = structuredClone(lessons);
  early[7].chapters[0].cues[1].say = '정답은 $42$일까요?';
  assert.ok(core.validateLessonSet(early).errors.some(e => e.includes('lessons[7]') && e.includes('정답')), '여덟 번째도 조기 정답 검사');
});

test('해설 여럿: 두 해설을 오가며 재생해도(겉넓이 → 부피 → 겉넓이) 장면에 남은 값과 상관없이 각 해설의 t=0·결론 직전이 같다', () => {
  const A = withSets('겉넓이', { mode: 'a', open: false }, { answer: '$42$' }), B = withSets('부피', { mode: 'b', open: false }, { answer: '$42$' });
  A.chapters[2].cues[1] = { ...A.chapters[2].cues[1], set: { open: true } };
  B.chapters[2].cues[1] = { ...B.chapters[2].cues[1], set: { open: true } };
  assert.deepEqual(core.validateLessonSet([A, B]).errors, []);
  const [ca, cb] = [core.compileLesson(A), core.compileLesson(B)];
  // 앞 해설을 끝까지 본 뒤 장면에 남은 값(open:true, mode:'b')에서 시작해도 같다
  let left = { open: true, mode: 'b' };
  for (const [cs, mode] of [[ca, 'a'], [cb, 'b'], [ca, 'a'], [cb, 'b']]) {
    const base = { nums: { x: 0 }, sets: { ...left }, step: 0, part: null };
    assert.deepEqual({ ...core.stateAt(cs, 0, base).sets }, { mode, open: false }, `${mode}: t=0`);
    assert.equal(core.stateAt(cs, cs.length - 5, base).sets.open, false, `${mode}: 결론 직전`);
    left = { ...core.stateAt(cs, cs.length, base).sets };
    assert.equal(left.open, true, `${mode}: 끝`);
  }
});

test('player·toc: 해설 단추 · 다음 해설 · play=<label> · 목차의 해설별 단추가 소스에 있다', () => {
  const player = fs.readFileSync(path.resolve(DIR, '../kit/apl-player.js'), 'utf8');
  assert.match(player, /nextTarget\(\) \{[\s\S]*lessonIndex \+ 1 < list\.length/, '같은 장면의 다음 해설이 먼저');
  assert.match(player, /_playParam\(v, i\)/, 'play=<label|번호>');
  assert.match(player, /this\.play\(this\.index, this\.lessonIndex\)/, '다시 보기는 방금 본 해설');
  assert.match(player, /_entryGo\(k\)/, '해설 단추 하나가 그 해설을 바로 재생');
  const toc = fs.readFileSync(path.resolve(DIR, '../kit/apl-toc.js'), 'utf8');
  assert.match(toc, /this\.go\(i, lab\.learning\?\.enabled\(\) \? x\.choice : x\.k\)/, '목차: 해설별 단추가 자기 해설을 재생');
});

test('compileLesson: 둘째 장 이후의 start 는 장이 시작하는 순간의 즉시 설정이고, 장 사이 값은 이어진다', () => {
  const L = goodLesson();
  L.chapters[1] = { ...L.chapters[1], start: { x: 5, y: 7 } };
  assert.deepEqual(core.validateLesson(L).errors, []);
  const cs = core.compileLesson(L), base = { nums: { x: 0, y: 0 }, sets: {}, step: 0, part: null };
  assert.equal(core.stateAt(cs, 8.99, base).nums.x, 10, '1장 끝 값');
  assert.equal(core.stateAt(cs, 9.0, base).nums.x, 5, '2장 시작에서 즉시 5');
  assert.equal(core.stateAt(cs, 8.99, base).nums.y, 0, 'y 는 아직 그대로');
  assert.equal(core.stateAt(cs, 9.0, base).nums.y, 7);
  assert.equal(core.stateAt(cs, 18.0, base).nums.x, 20, '2장 끝 값에서 3장이 이어짐');
  const mid = core.stateAt(cs, 20, base).nums.x;
  assert.ok(mid > 20 && mid < 30, '3장 도중 값');
  assert.deepEqual(cs.chapters.map((c) => c.at), [0, 9, 18]);
  assert.equal(core.chapterAt(cs, 8.99), 0);
  assert.equal(core.chapterAt(cs, 9), 1);
  assert.equal(core.chapterAt(cs, 27), 2);
});

test('compileLesson: step·set 은 장을 넘어 시간 순서대로 이어지고, 단일 영상 대본(compile)은 그대로다', () => {
  const L = goodLesson();
  L.chapters[0].cues.push({ at: 6, set: { flag: 'a' } });
  L.chapters[1].cues.push({ at: 6, step: 2 });
  L.chapters[2].cues.push({ at: 6, step: 3, set: { flag: 'b' } });
  const cs = core.compileLesson(L), base = { nums: { x: 0 }, sets: { flag: 'z' }, step: 1, part: null };
  assert.equal(core.stateAt(cs, 1, base).sets.flag, 'z');
  assert.equal(core.stateAt(cs, 7, base).sets.flag, 'a');
  assert.equal(core.stateAt(cs, 20, base).step, 1 + 1, '2장에서 step 2');
  assert.equal(core.stateAt(cs, 26, base).step, 3);
  assert.equal(core.stateAt(cs, 26, base).sets.flag, 'b');
  assert.equal(cs.usesStep, true);
  // 단일 영상 대본은 compile 결과가 이전과 같은 모양(해설 전용 필드 없음)
  const v = core.compile(FIXTURE_1209);
  assert.equal(v.kind, undefined);
  assert.equal(v.chapters, undefined);
  assert.equal(v.length, 12);
});

// 자막이 말하는 모든 숫자를 장면 공식으로 다시 계산해 대조합니다(새 수학 주장 금지: 장면의 question·steps·rule 에 있는 계산만).
test('해설 z3-sectorProof: 자막의 모든 숫자가 부채꼴 공식(r=6, 120°)으로 다시 계산한 값이다', () => {
  const lesson = sectorLessons['z3-sectorProof'], start = lesson.chapters[0].start;
  const r = start.csR, th = start.csS;
  const pieces = Math.max(2, 2 * Math.ceil(th / 20)); // 장면의 Kof
  const l = (r * th) / 180, half = (r * th) / 360, S = (r * r * th) / 360; // 호 = 2πr·θ/360 = (rθ/180)π, 가로 = l÷2, 넓이 = πr²·θ/360 = ½·r·l
  assert.deepEqual([r, th, pieces, l, half, S], [6, 120, 12, 4, 2, 12]);
  assert.equal((r * l) / 2, S, 'S = ½rl 과 πr²θ/360 이 같다');
  const html = fs.readFileSync(SCENE_DIR + '.html', 'utf8');
  assert.match(html, /Kof\s*=\s*\(s\)\s*=>\s*Math\.max\(2,\s*2\s*\*\s*Math\.ceil\(s\.csS\s*\/\s*20\)\)/, '조각 수 공식이 장면 소스와 같다');
  const says = sayList(lesson);
  assert.ok(says[0][0].includes(`${r} cm`) && says[0][0].includes(`${th}°`), '1장 첫 자막: 반지름·중심각');
  assert.ok(says[0][1].includes(`2\\pi\\times${r}\\times\\frac{${th}}{360}=${l}\\pi`), '1장 둘째 자막: 주어진 반지름·중심각으로 호 길이를 계산');
  assert.ok(says[1].join(' ').includes('가까운'), '직사각형에 가까운 모양(직사각형이라고 단정하지 않음)');
  assert.ok(says[2][0].includes('가로는 호 $l$의 절반') && says[2][0].includes('세로는 반지름 $r$'), '3장 첫 자막: 가로 l÷2, 세로 r');
  assert.ok(says[2][1].includes(`l=${l}\\pi`) && says[2][1].includes(`$${half}\\pi$`) && says[2][1].includes('가까워져요'), '3장 둘째 자막: 유한 조각의 가로는 l÷2에 가까워진다');
  assert.ok(says[2][2].includes(`\\frac12\\times${r}\\times${l}\\pi=${S}\\pi`), '3장 마지막 자막: ½·r·l = 12π');
  const allowed = new Set([r, th, pieces, l, half, S, 1, 2, 360]);
  for (const s of says.flat()) numbersOf(s).forEach((n) => assert.ok(allowed.has(n), `자막 「${s}」 의 숫자 ${n} 은 장면 공식으로 나오는 값이 아닙니다`));
  // 단계: 1장은 나눔(csT 0→20), 2장은 맞물림(→54, 라벨이 그려지기 전), 3장에서 라벨(55 이상)과 정답
  const ends = lesson.chapters.map((ch) => ch.cues.flatMap((c) => (c.to && c.to.csT != null ? [c.to.csT] : [])).at(-1));
  assert.deepEqual(Array.from(ends), [20, 54, 100]);
  assert.ok(ends[1] < 55, '맞물림 장은 가로·세로·넓이 라벨(csT ≥ 55)이 그려지기 전에 끝난다');
  assert.ok(/csT\s*>=\s*55/.test(html), '라벨이 csT 55 부터 그려진다는 전제가 장면 소스와 같다');
  // 결론 라벨은 해설이 csShowS 를 켤 때까지 아낀다(탐구 화면은 그대로)
  assert.match(html, /if \(!guided \|\| \(st\.lessonOn && st\.csShowS\)\) T\(b, \{ x: xc, y: Yb \}/, '진입 화면과 재생 중 S 라벨 표시 조건');
  assert.ok(chapterCues(lesson).some((c) => c.set && c.set.csShowS === true && c.say && c.say.includes(`${S}\\pi`)), '결론 자막과 함께 csShowS');
  assert.ok(lesson.chapters.slice(0, 2).every((ch) => ch.cues.every((c) => !(c.set && c.set.csShowS === true))), '앞 두 장은 csShowS 를 켜지 않는다(첫 장 at:0 의 false 제외)');
  assert.deepEqual(JSON.parse(JSON.stringify(lesson.chapters[0].cues[0].set)), { csShowS: false, csShowArc: false, csShowWidth: false }, '다시 보기에서 호·가로·정답이 먼저 보이지 않도록 공개 상태를 초기화');
  const compiled = core.compileLesson(lesson), base = baseOf(lesson);
  assert.equal(core.stateAt(compiled, 4.49, base).sets.csShowArc, false);
  assert.equal(core.stateAt(compiled, 4.5, base).sets.csShowArc, true);
  assert.equal(core.stateAt(compiled, 23.49, base).sets.csShowWidth, false);
  assert.equal(core.stateAt(compiled, 23.5, base).sets.csShowWidth, true);
  assert.equal(core.stateAt(compiled, 26.99, base).sets.csShowS, false);
  assert.equal(core.stateAt(compiled, 27, base).sets.csShowS, true);
});

test('해설 sv1-1: 자막의 모든 숫자가 원기둥 공식(r=3, h=5)으로 다시 계산한 값이다', () => {
  const lesson = core.lessonList(surfaceLessons['sv1-1'])[0], start = lesson.chapters[0].start;
  const r = start.sR, h = start.sH;
  const base = r * r, two = 2 * base, per = 2 * r, lat = per * h, total = two + lat; // 밑넓이 πr², 밑면 2개, 둘레 2πr, 옆넓이 둘레×높이 (모두 π 의 계수)
  assert.deepEqual([r, h, base, two, per, lat, total], [3, 5, 9, 18, 6, 30, 48]);
  assert.equal(total, 2 * r * (r + h), '겉넓이 = 2πr(r+h) 와 같다');
  const say = sayList(lesson);
  assert.ok(say[1][0].includes('둘레'), '옆면의 가로는 밑면의 둘레(한 변이 아님)');
  assert.ok(say[1][1].includes(`2\\pi\\times${r}=${per}\\pi`) && say[1][1].includes(`$${h}$`), '2장: 둘레 6π, 세로 높이 5');
  assert.ok(say[2][1].includes(`${base}\\pi\\times2=${two}\\pi`) && say[2][1].includes(`${per}\\pi\\times${h}=${lat}\\pi`), '3장: 밑면 2개 18π, 옆넓이 30π');
  assert.ok(say[2][2].includes(`${two}\\pi+${lat}\\pi=${total}\\pi`), '3장 마지막: 18π + 30π = 48π');
  const allowed = new Set([r, h, base, two, per, lat, total, 1, 2]);
  for (const s of say.flat()) numbersOf(s).forEach((n) => assert.ok(allowed.has(n), `자막 「${s}」 의 숫자 ${n} 은 장면 공식으로 나오는 값이 아닙니다`));
  assert.match(lesson.summary, /밑넓이\s*×\s*2\s*\+\s*옆넓이/);
  // 장면 소스: 정리 탭 단계 3개와 길이 표시, 해설이 켜야 하는 전개도 시작 값
  const t1 = fs.readFileSync(path.join(surfaceDir, 't1.js'), 'utf8');
  assert.match(t1, /밑면의 둘레 = \$\{sum\} = \$\{plainVal\(M\.P\)\}/, '정리 탭 그림의 「밑면의 둘레」 라벨');
  assert.match(t1, /높이 \$\{M\.h\}/, '정리 탭 그림의 「높이」 라벨');
  assert.match(t1, /밑넓이', plainVal\(M\.S\)/, '정리 탭 그림의 「밑넓이」 라벨');
  assert.match(t1, /if\(!s\.sv11Started\)\{/, '전개도는 sv11Started 가 켜져야 그려진다');
  assert.match(t1, /stepT:\s*\(\)\s*=>\s*1/, '정리 탭 tick 이 sT 를 1 로 끌어당기므로 재생 중에는 dragging 으로 막는다');
});

test('해설 sv1-1 부피: 자막의 모든 숫자가 원기둥 부피 공식(r=3, h=5)으로 다시 계산한 값이고, 그림이 그 값을 단계마다 그린다', () => {
  const lesson = core.lessonList(surfaceLessons['sv1-1']).find((l) => l.label === '부피'), start = lesson.chapters[0].start;
  const r = start.sR, h = start.sH, base = r * r, vol = base * h; // 밑넓이 πr² 의 π 계수, 부피 = 밑넓이 × 높이
  assert.deepEqual([r, h, base, vol], [3, 5, 9, 45]);
  assert.equal(vol, r * r * h, '부피 = πr²h');
  const say = sayList(lesson);
  assert.ok(say[0][0].includes(`반지름 ${r}`), '1장: 반지름');
  assert.ok(say[0][1].includes(`\\pi\\times${r}^2=${base}\\pi`), '1장: 밑넓이 π×3² = 9π(장면 풀이 1단계)');
  assert.ok(say[1][1].includes(`$${h}$`) && say[1][1].includes(`$${base}\\pi$`), '2장: 높이 5, 밑넓이 9π');
  assert.ok(say[2][1].includes(`${base}\\pi\\times${h}=${vol}\\pi`), '3장: 9π × 5 = 45π(장면 풀이 3단계)');
  const allowed = new Set([r, h, base, vol, 2]);
  for (const s of say.flat()) numbersOf(s).forEach((n) => assert.ok(allowed.has(n), `자막 「${s}」 의 숫자 ${n} 은 장면 공식으로 나오는 값이 아닙니다`));
  assert.equal(lesson.chapters[0].cues[0].set.sv11Mode, 'vol', '부피 모드는 해설이 스스로 정한다');
  assert.equal(core.lessonList(surfaceLessons['sv1-1'])[0].chapters[0].cues[0].set.sv11Mode, 'surf', '겉넓이 해설은 겉넓이 모드');
  // 장면 소스: 장면의 부피 풀이와 같은 식, 단계별 그림(밑면 강조·밑넓이·반지름 → 높이 → 결과), 결과는 해설이 svShowV 를 켤 때까지 아낌
  const t1 = fs.readFileSync(path.join(surfaceDir, 't1.js'), 'utf8');
  assert.ok(t1.includes('(부피) $=${tx(M.S)}') && t1.includes('=${tx(M.vol)}'), '장면의 부피 풀이 3단계(9π × 5 = 45π)');
  assert.match(t1, /const volLabels = \(b,s,M,C,D,g\) =>/, '부피 그림 라벨');
  assert.match(t1, /if \(st >= 3 && \(!s\.lessonOn \|\| s\.svShowV\)\)/, '결과 라벨 조건(해설 재생 중에는 svShowV)');
  assert.match(t1, /if\(lab\) volLabels\(/, '정리 탭에서만 그림');
  const final = chapterCues(lesson).filter((c) => c.set && c.set.svShowV === true);
  assert.equal(final.length, 1, 'svShowV 는 한 번만 켠다');
  assert.ok(final[0].say.includes(`${vol}\\pi`), '결과 라벨은 결론 자막과 함께 켜진다');
  assert.ok(lesson.chapters.slice(0, 2).every((ch) => ch.cues.every((c) => !(c.set && c.set.svShowV === true))), '앞 두 장은 결과를 켜지 않는다');
});

test('player·shell: 해설 재생기는 해설을 영상보다 먼저 찾고, 재생 중 dragging 을 쥐었다 반드시 되돌린다(소스 확인)', () => {
  const player = fs.readFileSync(path.resolve(DIR, '../kit/apl-player.js'), 'utf8');
  assert.match(player, /scriptOf\(i\)\s*\{\s*return this\.lessonOf\(i\)\s*\|\|\s*this\.videoOf\(i\);/, '해설 우선 조회');
  const release = player.slice(player.indexOf('_release() {'), player.indexOf('/** 중간에 나갈 때'));
  assert.match(release, /s\.dragging = false/, '_release 가 dragging 을 되돌림');
  for (const where of ['finish() {', '_leave(rebuild) {']) {
    const body = player.slice(player.indexOf(where), player.indexOf(where) + 2500);
    assert.match(body, /this\._release\(\)/, `${where} 가 _release 를 부른다`);
  }
  assert.match(player, /const pv = urlParam\('play'\);\s*if \(pv && !lab\.teach && !lab\._g7LearningEntry\)/, 'play=… 가 있을 때만 자동 재생(없으면 재생하지 않음)');
  assert.match(player, /urlParam\('manual'\) === '1'/, 'manual=1');
});
