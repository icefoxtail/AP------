// 중1 2학기 기말 모의고사 1~5회 팩 결함 검사.
// 결함 조건만 본다: 개수·유형 구성, 팩 간 문항 중복, 한 팩 안 세부 유형 중복, 빈 정답, 없는 그림 파일, 범위 밖 단원, 선정 목록과 자료 파일의 불일치.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const archiveRoot = path.join(root, 'archive');
const packsPath = path.join(archiveRoot, 'assessment', 'assessment-packs-2sem-final-mock.generated.js');
const selectionPath = path.join(archiveRoot, 'tools', 'assessment-mock', 'selection-m1-2final-mock.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(packsPath, 'utf8'), context, { filename: packsPath });
const data = context.window.APMATH_ASSESSMENT_PACKS_MOCK_2SEM_FINAL;
assert(data && Array.isArray(data.packs), '모의고사 자료 객체가 없습니다.');
// 이 검사는 선정 목록(selection-m1-2final-mock.json)의 기본 5회만 본다. 시험 범위 맞춤 모의고사(MOCK_..._S1_NN)는 tests/assessment-scoped-mock-packs.test.js가 본다.
const basePacks = data.packs.filter((pack) => /^MOCK_2026_2SEM_FINAL_M1_\d\d$/.test(pack.id));
assert(basePacks.length > 0 && data.packs.slice(0, basePacks.length).every((pack, i) => pack === basePacks[i]), `기본 모의고사는 자료의 앞부분에 있어야 합니다: ${basePacks.length}`);
assert(JSON.stringify(data.categoryOrder) === JSON.stringify(['26년 2학기 기말 모의고사']), '탭 이름이 다릅니다.');

const allowedUnits = new Set(['M1-06', 'M1-07', 'M1-08']);
const domainOrder = ['다각형', '원과 부채꼴', '다면체·회전체', '입체도형의 겉넓이와 부피', '히스토그램·도수분포다각형', '상대도수'];
const seenKeys = new Map();
const imageRe = /<img[^>]+src="([^"]+)"/g;
const sourceBanks = new Map();
function sourceQuestion(q) {
  if (!sourceBanks.has(q._sourceFile)) {
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'exams', q._sourceFile), 'utf8'), ctx);
    sourceBanks.set(q._sourceFile, ctx.window.questionBank || ctx.window.questions || ctx.window.examData?.questions || []);
  }
  return sourceBanks.get(q._sourceFile).find((x) => String(x.id) === String(q._sourceQuestionNo));
}

function assertFile(rel, label) {
  assert(rel && !/^[a-z]+:\/\//i.test(rel), `${label}: 경로 형식 이상: ${rel}`);
  assert(fs.existsSync(path.join(archiveRoot, rel)), `${label}: 그림 파일이 없습니다: ${rel}`);
}

basePacks.forEach((pack, index) => {
  const tag = pack.id;
  assert(pack.id === `MOCK_2026_2SEM_FINAL_M1_${String(index + 1).padStart(2, '0')}`, `팩 id 이상: ${pack.id}`);
  assert(pack.title === `중1 2학기 기말 모의고사 ${index + 1}회`, `${tag}: 제목 이상: ${pack.title}`);
  assert(pack.category === '26년 2학기 기말 모의고사' && pack.grade === '중1', `${tag}: 분류·학년 이상`);
  const qs = pack.questions;
  assert(qs.length === 24 && pack.questionCount === 24, `${tag}: 24문항이어야 합니다: ${qs.length}`);
  const subjective = qs.filter((q) => q.questionType === '서술형');
  assert(subjective.length === 4, `${tag}: 서술형 4개여야 합니다: ${subjective.length}`);
  assert(qs.slice(0, 20).every((q) => q.questionType === '객관식'), `${tag}: 1~20번은 객관식이어야 합니다.`);
  assert(qs.slice(20).every((q) => q.questionType === '서술형'), `${tag}: 21~24번은 서술형이어야 합니다.`);
  assert(Object.values(pack.difficultyMix).reduce((a, b) => a + b, 0) === 24, `${tag}: difficultyMix 합이 24가 아닙니다.`);

  const subtypes = new Set();
  const fileCount = new Map();
  let lastDomain = -1;
  let lastLevelRank = -1;
  const levelRank = { 하: 0, 중: 1, 상: 2 };
  qs.forEach((q, i) => {
    const where = `${tag} ${i + 1}번(${q._sourceFile} #${q._sourceQuestionNo})`;
    assert(q._qKey && q._sourceFile && q._sourceQuestionNo, `${where}: 출처 필드 누락`);
    assert(!seenKeys.has(q._qKey), `${where}: 다른 회차(${seenKeys.get(q._qKey)})와 문항이 겹칩니다.`);
    seenKeys.set(q._qKey, tag);
    assert(String(q.answer ?? '').trim() !== '', `${where}: 정답이 비어 있습니다.`);
    assert(String(q.content ?? '').trim() !== '', `${where}: 발문이 비어 있습니다.`);
    if (q.questionType === '객관식') {
      // 보기가 그림 안에 든 문항은 choices가 빈 배열이다(그림 + 답 ①~⑤ 꼴일 때만 허용: archive/figure-size.js emptyChoicesAreFigure).
      const choicesInFigure = Array.isArray(q.choices) && q.choices.length === 0 && (q.image || /<img\b/i.test(String(q.content))) && /^\s*[①-⑤](?:\s*[,，、]?\s*[①-⑤])*\s*$/.test(String(q.answer));
      assert(choicesInFigure || (Array.isArray(q.choices) && q.choices.length >= 4), `${where}: 객관식 보기가 부족합니다.`);
    }
    assert(allowedUnits.has(q.standardUnitKey), `${where}: 범위 밖 단원입니다: ${q.standardUnitKey}`);
    assert(Number(q._sourceYear) >= 22 && Number(q._sourceYear) <= 25, `${where}: 쓸 수 없는 연도입니다: ${q._sourceYear}`);
    assert(q.l3Disposition !== 'HOLD' && q.l4Disposition !== 'HOLD' && !q.itemHold, `${where}: 보류 표시가 있는 문항입니다.`);
    assert(['하', '중', '상'].includes(q.level), `${where}: level 이상`);
    assert(!/^\s*(\[[^\]]*(서술|논술|서답)[^\]]*\]|(서·논술형|서술형|서답형|서술|논술)\s*\d+\s*[.．])/.test(String(q.content)), `${where}: 서술형 앞머리 번호 표기가 남았습니다.`);
    // 배점 표기 0: 발문 속 [3점], (5점), [4.5점], [5점, 부분점수 있음], (과정: 2점, ...) 같은 원 시험지 배점. 발문 속 "60점 이상" 같은 점수 말은 허용한다.
    const maskedStem = String(q.content).replace(/\$[^$]*\$/g, ' ');
    assert(!/[[(][^[\]()]*\d(?:\.\d+)?\s*점[^[\]()]*[\])]/.test(maskedStem), `${where}: 발문에 배점 표기가 남았습니다.`);
    // 그림 크기는 원본 그대로다(생성기가 imageScale·data-scale을 덧붙이지 않는다, 사용자 2026-11-20).
    if (q.image) { const src = sourceQuestion(q); assert(String(q.imageScale ?? '') === String(src?.imageScale ?? ''), `${where}: imageScale이 원본(${src?.imageScale})과 다릅니다: ${q.imageScale}`); }
    if (q.image) assertFile(q.image, `${where} image`);
    if (q.solutionImage) assertFile(q.solutionImage, `${where} solutionImage`);
    for (const m of String(q.content).matchAll(imageRe)) assertFile(m[1], `${where} content img`);
    for (const c of q.choices || []) for (const m of String(c).matchAll(imageRe)) assertFile(m[1], `${where} choice img`);

    const domainKey = `${q._assessmentDomain}|${q._assessmentSkill}`;
    assert(q._assessmentSkill && domainOrder.includes(q._assessmentDomain), `${where}: 세부 유형·단원 표기 누락`);
    assert(!subtypes.has(domainKey), `${where}: 한 회차 안에 같은 세부 유형이 있습니다: ${domainKey}`);
    subtypes.add(domainKey);
    fileCount.set(q._sourceFile, (fileCount.get(q._sourceFile) || 0) + 1);

    // 배열: 객관식(1~20)·서술형(21~24) 각 구간에서 단원 순서, 같은 단원 안에서는 쉬운 것부터
    if (i === 20) { lastDomain = -1; lastLevelRank = -1; }
    const d = domainOrder.indexOf(q._assessmentDomain);
    assert(d >= lastDomain, `${where}: 단원 순서가 거꾸로입니다.`);
    if (d === lastDomain) assert(levelRank[q.level] >= lastLevelRank, `${where}: 같은 단원에서 어려운 문항이 먼저 나왔습니다.`);
    lastDomain = d;
    lastLevelRank = levelRank[q.level];
  });
  const domains = new Set(subjective.map((q) => q._assessmentDomain));
  assert(domains.size === 4, `${tag}: 서술형 4개는 서로 다른 단원이어야 합니다.`);
  for (const [file, n] of fileCount) assert(n <= 3, `${tag}: 한 시험지(${file}) 문항이 ${n}개입니다(최대 3).`);
});

// 선정 목록과 자료 파일 일치
const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf8'));
assert(selection.sets.length === basePacks.length, `선정 목록 회차(${selection.sets.length})와 기본 모의고사(${basePacks.length})가 다릅니다.`);
selection.sets.forEach((setDef, i) => {
  const pack = basePacks[i];
  assert(setDef.items.length === pack.questions.length, `선정 목록 ${i + 1}회 문항 수가 자료와 다릅니다.`);
  setDef.items.forEach((item, k) => {
    const q = pack.questions[k];
    assert(q._sourceFile === item.file && q._sourceQuestionNo === item.q && q._assessmentSkill === item.subtype,
      `선정 목록 ${i + 1}회 ${k + 1}번이 자료와 다릅니다.`);
  });
});

// 자료 파일은 생성기로 다시 만들 수 있어야 하고, 원본 문항과 같아야 한다(서술형 앞머리 번호 제거 제외).
// 자료 파일 앞 5회는 선정 목록에서 다시 만든 결과와 같아야 한다(뒤의 시험 범위 맞춤 모의고사는 카탈로그에 달려 있어 여기서 다시 만들지 않는다).
const { buildPacks } = require(path.join(archiveRoot, 'tools', 'assessment-mock', 'build-m1-2final-mock.cjs'));
const rebuilt = buildPacks();
assert(JSON.stringify(rebuilt.packs) === JSON.stringify(basePacks),
  '기본 5회가 선정 목록·원본과 다릅니다. node archive/tools/assessment-mock/build-m1-2final-mock.cjs 로 다시 만드세요.');

console.log('assessment-mock-2sem-final-packs.test.js: OK (기본 모의고사 x 24문항, 객관식 20 + 서술형 4)');
