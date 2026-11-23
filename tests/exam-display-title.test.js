// 원본 기출 머리글 제목: 파일 이름 모양("22_강남여고_1학기_중간_고1_기출")을 사람이 읽는 이름으로 바꾸고,
// 해석할 수 없는 이름은 지어내지 않고 원문 그대로 돌려준다. 시험지 JS와 식별 값(identityTitle)은 바꾸지 않는다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { readableExamTitle } = require('../archive/exam-display-title.js');
const { assertLoads } = require('./helpers/html-asset-refs.cjs');

const root = path.resolve(__dirname, '..');

test('대표 파일 이름 열 가지 이상: 연도 2자리 -> 2000+, 학교 학년 학기 시험, 과목은 뒤에 붙인다', () => {
  const cases = [
    ['22_강남여고_1학기_중간_고1_기출', '2022 강남여고 고1 1학기 중간'],
    ['26_팔마고_1학기_중간_고3_미적분2', '2026 팔마고 고3 1학기 중간 · 미적분2'],
    ['19_금당중_1학기_기말_중1_수학', '2019 금당중 중1 1학기 기말 · 수학'],
    ['24_효천고_2학기_기말_고1_수학', '2024 효천고 고1 2학기 기말 · 수학'],
    ['21_강남여고_1학기_기말_고2_수학I', '2021 강남여고 고2 1학기 기말 · 수학I'],
    ['22_매산고_1학기_중간_고2_기하와벡터_기출', '2022 매산고 고2 1학기 중간 · 기하와벡터'],
    ['25_강남여고_1학기_기말_고1_기출c', '2025 강남여고 고1 1학기 기말'],
    ['26_금당고_1학기_중간_고1_기출_content', '2026 금당고 고1 1학기 중간'],
    ['26_강남여고_1학기_2차_고2_대수', '2026 강남여고 고2 1학기 2차 · 대수'],
    ['2023_한영고_1학기_중간_고1_수학상', '2023 한영고 고1 1학기 중간 · 수학상'],
    ['23_금당고_2학기_중간_고2_수학II', '2023 금당고 고2 2학기 중간 · 수학II'],
  ];
  for (const [raw, expected] of cases) assert.equal(readableExamTitle(raw), expected, raw);
});

test('학교 이름에 밑줄이 있어도 학교로 읽는다', () => {
  assert.equal(readableExamTitle('22_순천_여고_1학기_중간_고1_기출'), '2022 순천_여고 고1 1학기 중간');
});

test('해석할 수 없는 이름은 원문 그대로: 자연어 제목, 학기 없음, 모의고사, 3자리 학년, 빈 값', () => {
  const same = [
    '2025학년도 2학기 기말고사 순천여자고등학교 1학년 공통수학2',
    '2023학년도 풍덕중학교 3학년 1학기 기말고사 수학',
    '22_강남여고_중간_고1_기출',            // 학기 없음
    '23_3월_모의고사_고1',                  // 모의고사
    '22_강남여고_1학기_중간_고등1_기출',     // 학년 표기가 다르다
    '22_강남여고_1학기_중간_고11_기출',      // 3자리 학년 표기
    '수학 시험지',
    '시험지',
    '',
  ];
  for (const raw of same) assert.equal(readableExamTitle(raw), raw, JSON.stringify(raw));
  assert.equal(readableExamTitle(undefined), '');
  assert.equal(readableExamTitle(null), '');
});

test('원본 기출 전체: 모두 읽기 쉬운 이름으로 바뀌거나 원문 그대로이고, 바뀐 이름에는 밑줄과 학기 표기 빠짐이 없다', () => {
  const dir = path.join(root, 'archive', 'exams', 'original');
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const files = walk(dir).filter(f => f.endsWith('.js'));
  assert.ok(files.length > 0);
  let changed = 0;
  for (const file of files) {
    const name = path.basename(file, '.js');
    const out = readableExamTitle(name);
    if (out === name) continue;
    changed += 1;
    assert.match(out, /^\d{4} \S+ (고|중)[1-3] [12]학기 (중간|기말|\d차)( · .+)?$/, name);
    assert.doesNotMatch(out, /_/, `${name}: 읽는 이름에 밑줄이 남지 않는다`);
  }
  assert.ok(changed > files.length * 0.9, '대부분의 원본 기출 이름은 읽는 이름으로 바뀐다');
});

test('엔진: 시험지 JS는 건드리지 않고 표시 제목만 바꾼다(examDisplayTitle 우선, 식별 제목 유지)', () => {
  const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
  assertLoads(engine, 'exam-display-title.js', 'engine', { tag: 'script' });
  assert.match(engine, /AppState\.identityTitle = AppState\.title;/, '식별 제목은 원래 값 그대로');
  assert.match(engine, /AppState\.displayTitle = window\.examDisplayTitle \|\| readableTitle\(AppState\.title\);/);
  // 실제로 쓰이는 길은 화면 실행기 어댑터다: 식별 제목(title)은 그대로, 표시 제목만 읽는 이름으로.
  const adapter = fs.readFileSync(path.join(root, 'archive', 'screen-runtime-adapter.js'), 'utf8');
  assert.match(adapter, /displayTitle = window\.examDisplayTitle \|\| window\.ExamDisplayTitle\?\.displayTitleOf\?\.\(title, \{ hint: input\.title \}\) \|\| title;/);
  assert.match(adapter, /title, identityTitle: title, displayTitle,/, '식별 제목은 원래 값 그대로');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'archive-pages-release-manifest.json'), 'utf8'));
  assert.ok(manifest.archiveRootFiles.includes('exam-display-title.js'), '배포 manifest에 새 파일이 들어 있다');
});
