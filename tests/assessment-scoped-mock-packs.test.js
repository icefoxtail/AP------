// 시험 범위 맞춤 모의고사 팩 결함 검사 (범위 정의: archive/tools/assessment-mock/scoped-mock-scopes.json).
// 결함 조건만 본다: 중복 pack id·제목, 깨진 문항 참조(원본 시험지·그림 파일), 빈 정답·해설, 회차 안 문항 중복,
// 범위 정의 밖 단원 문항, 범위 밖 낱말(글자 가드), 객관식 뒤 서술형 배열. 회차 수·문항 내용은 고정하지 않는다.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const archiveRoot = path.join(root, 'archive');
const packsPath = path.join(archiveRoot, 'assessment', 'assessment-packs-2sem-final-mock.generated.js');
const toolsDir = path.join(archiveRoot, 'tools', 'assessment-mock');
const config = JSON.parse(fs.readFileSync(path.join(toolsDir, 'scoped-mock-scopes.json'), 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(packsPath, 'utf8'), context, { filename: packsPath });
const data = context.window.APMATH_ASSESSMENT_PACKS_MOCK_2SEM_FINAL;
assert(data && Array.isArray(data.packs), '모의고사 자료 객체가 없습니다.');
assert(data.categoryOrder.includes(config.category), '모의고사 탭 이름이 범위 정의와 다릅니다.');

// 전체: pack id·제목 중복 0
const ids = new Set();
const titles = new Set();
for (const pack of data.packs) {
  assert(!ids.has(pack.id), `pack id가 겹칩니다: ${pack.id}`);
  assert(!titles.has(pack.title), `제목이 겹칩니다: ${pack.title}`);
  ids.add(pack.id);
  titles.add(pack.title);
  assert(pack.category === config.category, `${pack.id}: 분류가 다릅니다: ${pack.category}`);
  // 학년 판정(AssessmentPackCore.assignGrade)이 pack id의 _M1_ / _M2_ 표기를 읽는다.
  assert(/(?:^|_)M[123](?:_|$)/.test(pack.id), `${pack.id}: id에 학년 표기(_M1_ 등)가 없습니다.`);
}

const imageRe = /<img[^>]+src="([^"]+)"/g;
function assertFile(rel, label) {
  assert(rel && !/^[a-z]+:\/\//i.test(rel), `${label}: 경로 형식 이상: ${rel}`);
  assert(fs.existsSync(path.join(archiveRoot, rel)), `${label}: 그림 파일이 없습니다: ${rel}`);
}
const sourceBanks = new Map();
function sourceQuestion(q) {
  if (!sourceBanks.has(q._sourceFile)) {
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'exams', q._sourceFile), 'utf8'), ctx);
    sourceBanks.set(q._sourceFile, ctx.window.questionBank || []);
  }
  return sourceBanks.get(q._sourceFile).find((x) => String(x.id) === String(q._sourceQuestionNo));
}
const norm = (text) => String(text ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');

// 범위 정의 안에서 팩을 찾는다(맞춤 모의고사 id: MOCK_2026_2SEM_FINAL_<학년>_<idKey>_<회차>)
const { loadCatalogRecords, groupIndexOf } = require(path.join(toolsDir, 'scoped-units.cjs'));
const builder = require(path.join(toolsDir, 'build-scoped-mock.cjs'));
const prefixes = [...new Set(config.scopes.flatMap((s) => s.sourceDirs))];
const { records: catalog } = loadCatalogRecords(prefixes);

let scopedPackCount = 0;
let scopedQuestionCount = 0;
for (const scope of config.scopes) {
  const idPrefix = `MOCK_2026_2SEM_FINAL_${scope.gradeKey.toUpperCase()}_${scope.idKey}_`;
  const packs = data.packs.filter((pack) => pack.id.startsWith(idPrefix));
  assert(packs.length >= 1, `${scope.id}: 팩이 하나도 없습니다.`);
  assert(packs.length === scope.rounds, `${scope.id}: 회차 수(${packs.length})가 범위 정의(${scope.rounds})와 다릅니다. 자료 파일을 다시 조립하세요.`);
  const labels = scope.groups.map((g) => g.label);
  packs.forEach((pack, idx) => {
    scopedPackCount += 1;
    const tag = pack.id;
    assert(pack.id === `${idPrefix}${String(idx + 1).padStart(2, '0')}`, `${tag}: 회차 번호가 이어지지 않습니다.`);
    assert(pack.title === scope.titleTemplate.replace('{grade}', scope.grade).replace('{school}', scope.school).replace('{n}', String(idx + 1)), `${tag}: 제목이 범위 정의와 다릅니다: ${pack.title}`);
    assert(pack.grade === scope.grade, `${tag}: 학년이 다릅니다.`);
    const qs = pack.questions;
    assert(qs.length === pack.questionCount && qs.length === config.common.items, `${tag}: 문항 수 이상: ${qs.length}`);
    const subjective = qs.filter((q) => q.questionType === '서술형');
    assert(subjective.length === config.common.subjective, `${tag}: 서술형 개수 이상: ${subjective.length}`);
    assert(qs.slice(0, qs.length - subjective.length).every((q) => q.questionType === '객관식') && qs.slice(qs.length - subjective.length).every((q) => q.questionType === '서술형'), `${tag}: 객관식 뒤에 서술형이어야 합니다.`);
    assert(JSON.stringify(pack.scopeUnits) === JSON.stringify(labels), `${tag}: scopeUnits가 범위 정의와 다릅니다.`);
    assert(Object.values(pack.difficultyBucketMix).reduce((a, b) => a + b, 0) === qs.length, `${tag}: difficultyBucketMix 합이 문항 수와 다릅니다.`);

    const keys = new Set();
    const dups = new Set();
    qs.forEach((q, i) => {
      scopedQuestionCount += 1;
      const where = `${tag} ${i + 1}번(${q._sourceFile} #${q._sourceQuestionNo})`;
      assert(q._qKey && q._sourceFile && q._sourceQuestionNo, `${where}: 출처 필드 누락`);
      assert(!keys.has(q._qKey), `${where}: 한 회차 안에 같은 문항이 두 번 있습니다.`);
      keys.add(q._qKey);
      const dup = norm(q.content) + '|' + (q.choices || []).map(norm).join('|');
      assert(!dups.has(dup), `${where}: 한 회차 안에 같은 발문·보기가 있습니다.`);
      dups.add(dup);
      assert(String(q.answer ?? '').trim() !== '' && String(q.solution ?? '').trim() !== '' && String(q.content ?? '').trim() !== '', `${where}: 정답·해설·발문이 비어 있습니다.`);
      assert(Number.isInteger(q.difficultyBucket) && q.difficultyBucket >= 1 && q.difficultyBucket <= 5, `${where}: 난이도가 1~5 정수가 아닙니다: ${q.difficultyBucket}`);
      // level(하·중·상)은 카드 칩 표시용 파생값: difficultyBucket 1 하, 2 중, 3~5 상
      assert(q.level === (q.difficultyBucket <= 1 ? '하' : q.difficultyBucket === 2 ? '중' : '상'), `${where}: level이 difficultyBucket에서 파생된 값이 아닙니다: ${q.level}`);
      assert(Number(q._sourceYear) + 2000 >= scope.yearMin && Number(q._sourceYear) + 2000 <= config.common.yearMax, `${where}: 쓸 수 없는 연도입니다: ${q._sourceYear}`);
      assert(q.l3Disposition !== 'HOLD' && q.l4Disposition !== 'HOLD' && !q.itemHold, `${where}: 보류 표시가 있는 문항입니다.`);
      assert(!/^\s*(?:<p[^>]*>\s*)?(\[[^\]]*(서술|논술|서답)[^\]]*\]|(?:&lt;|<)[^&<>]*(서술|논술|서답)[^&<>]*(?:&gt;|>)|(서·논술형|서술형|서답형|서술|논술)\s*\d+\s*[.．])/.test(String(q.content)), `${where}: 서술형 앞머리 번호 표기가 남았습니다.`);
      assert(!/[[(][^[\]()]*\d(?:\.\d+)?\s*점[^[\]()]*[\])]/.test(String(q.content).replace(/\$[^$]*\$/g, ' ').replace(/\([^()]*\|[^()]*\)/g, ' ')), `${where}: 발문에 배점 표기가 남았습니다.`);
      if (q.questionType === '객관식') {
        const choicesInFigure = Array.isArray(q.choices) && q.choices.length === 0 && (q.image || /<img\b/i.test(String(q.content))) && /^\s*[①-⑤](?:\s*[,，、]?\s*[①-⑤])*\s*$/.test(String(q.answer));
        assert(choicesInFigure || (Array.isArray(q.choices) && q.choices.length >= 4), `${where}: 객관식 보기가 부족합니다.`);
      }
      // 그림 파일·그림 크기(원본 그대로)·원본 문항 존재
      if (q.image) assertFile(q.image, `${where} image`);
      if (q.solutionImage) assertFile(q.solutionImage, `${where} solutionImage`);
      for (const m of String(q.content).matchAll(imageRe)) assertFile(m[1], `${where} content img`);
      for (const c of q.choices || []) for (const m of String(c).matchAll(imageRe)) assertFile(m[1], `${where} choice img`);
      const src = sourceQuestion(q);
      assert(src, `${where}: 원본 시험지에 문항이 없습니다.`);
      assert(String(src.answer) === String(q.answer), `${where}: 정답이 원본과 다릅니다.`);
      if (q.image) assert(String(q.imageScale ?? '') === String(src.imageScale ?? ''), `${where}: imageScale이 원본과 다릅니다.`);

      // 범위: 묶음 이름이 정의에 있고, 카탈로그의 중단원·유형 키로 다시 판정해도 같은 묶음이어야 한다.
      assert(labels.includes(q._scopeGroup) && q._scopeId === scope.id && q._assessmentDomain === q._scopeGroup, `${where}: 범위 묶음 표기 이상: ${q._scopeGroup}`);
      const rec = catalog.get(`${q._sourceFile}#${q._sourceQuestionNo}`);
      assert(rec, `${where}: 카탈로그에 없는 문항입니다.`);
      const judged = groupIndexOf(scope, rec);
      assert(judged.index >= 0 && labels[judged.index] === q._scopeGroup && judged.l2.l2 === q._scopeL2, `${where}: 범위 밖 단원입니다(카탈로그 판정: ${judged.l2 && judged.l2.l2}, 묶음 ${judged.index >= 0 ? labels[judged.index] : '없음'}).`);
      assert(!builder.rejectReason(src, rec), `${where}: 쓸 수 없는 문항입니다: ${builder.rejectReason(src, rec)}`);
      assert(!builder.textGuardHit(scope, src, judged.rule), `${where}: 범위 밖 낱말이 들어 있습니다: ${builder.textGuardHit(scope, src, judged.rule)}`);
      assert(!builder.ruleTextCheck(judged.rule, src), `${where}: 범위 규칙의 글자 조건에 맞지 않습니다.`);
    });
  });
}
assert(scopedPackCount >= 1, '시험 범위 맞춤 모의고사가 없습니다.');

// 카드 난이도 칩이 모든 문항을 센다(하·중·상 합 = 문항 수)
for (const pack of data.packs.filter((p) => p.questions.some((q) => q._scopeId))) {
  assert(Object.values(pack.difficultyMix).reduce((a, b) => a + b, 0) === pack.questions.length, `${pack.id}: 난이도 칩(difficultyMix) 합이 문항 수와 다릅니다.`);
}

// 도구로 다시 조립한 결과(기본 5회 + 맞춤 팩 + sourceSummary)가 커밋된 자료와 JSON으로 같아야 한다. 카탈로그가 바뀌어 달라지면 다시 조립한다.
const rebuilt = require(path.join(toolsDir, 'build-m1-2final-mock.cjs')).buildAllPacks();
const REBUILD_MSG = '자료 파일이 도구로 다시 조립한 결과와 다릅니다. node archive/tools/assessment-mock/build-m1-2final-mock.cjs 로 다시 조립하세요.';
assert(JSON.stringify(rebuilt.packs) === JSON.stringify(data.packs), `맞춤 팩: ${REBUILD_MSG}`);
assert(JSON.stringify(rebuilt.summary) === JSON.stringify(data.sourceSummary), `sourceSummary: ${REBUILD_MSG}`);

console.log(`assessment-scoped-mock-packs.test.js: OK (범위 ${config.scopes.length}개, 팩 ${scopedPackCount}개, 문항 ${scopedQuestionCount}개)`);
