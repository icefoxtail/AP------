'use strict';
// 기하 유형은행 반입 도구(archive/tools/aistudio-typebank): 순수 함수와 TPL 대응표의 결함 조건만 본다.
// 대응표·대기열·생성 결과 같은 저장소 밖 자료는 읽지 않는다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const toolUrl = name => pathToFileURL(path.join(root, 'archive/tools/aistudio-typebank', name)).href;
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

test('발문의 난이도 꼬리표만 걸러 내고 수식·[보기] 는 둔다', async () => {
  const { stripDifficultyTag } = await import(toolUrl('typebank-geo.mjs'));
  assert.equal(stripDifficultyTag('포물선의 초점은? [중]'), '포물선의 초점은?');
  assert.equal(stripDifficultyTag('[상] 구의 방정식은?'), '구의 방정식은?');
  assert.equal(stripDifficultyTag('다음 [보기]에서 옳은 것은?\n[보기]\nㄱ. $a<b$'), '다음 [보기]에서 옳은 것은?\n[보기]\nㄱ. $a<b$');
});

test('[그림: …] 설명은 대괄호 짝으로 꺼내고 본문은 그대로 둔다', async () => {
  const { figureSpecs } = await import(toolUrl('typebank-geo.mjs'));
  const specs = figureSpecs('그림과 같이 점 A가 있다. [그림: 구간 [0,2] 위의 점 A(1,2)와 직선 l] 일 때 구하라.');
  assert.equal(specs.length, 1);
  assert.equal(specs[0].spec, '구간 [0,2] 위의 점 A(1,2)와 직선 l');
  assert.equal(figureSpecs('그림 없음').length, 0);
});

test('기계 검산: 정답 범위·해설 마지막 줄 정답 번호·난이도 정수', async () => {
  const { mechanicalChecks } = await import(toolUrl('typebank-geo.mjs'));
  const ok = { answer: '②', choices: ['1', '2', '3', '4', '5'], solution: '계산하면 2이다.\n따라서 정답은 ②이다.', difficultyBucket: 2 };
  assert.deepEqual(mechanicalChecks(ok).filter(i => !i.warn), []);
  const codes = q => mechanicalChecks(q).map(i => i.code);
  assert.ok(codes({ ...ok, solution: '따라서 정답은 ③이다.' }).includes('SOLUTION_ANSWER_MISMATCH'));
  assert.ok(codes({ ...ok, answer: '⑥' }).includes('ANSWER_FORMAT'));
  assert.ok(codes({ ...ok, difficultyBucket: '중' }).includes('DIFFICULTY_RANGE'));
  assert.ok(codes({ ...ok, choices: ['1', '2', '3', '4'] }).includes('CHOICE_COUNT'));
});

test('geo-tpl-map: alias 는 등록된 TPL 을 가리키고 newTpl 은 레지스트리에 있다(누락·깨진 참조 0)', () => {
  const map = readJson('archive/tools/aistudio-typebank/geo-tpl-map.json');
  const tax = readJson('archive/data/meta-foundation/canonical/packs/geometry/taxonomy.json');
  const tpls = new Map(tax.templates.map(t => [t.templateKey, t]));
  const pts = new Set(tax.problemTypes.map(p => p.problemTypeKey));
  for (const [from, to] of Object.entries(map.alias)) {
    assert.ok(tpls.has(to) || map.newTpl[to], `alias ${from} → ${to} 가 레지스트리에도 newTpl 에도 없다`);
    assert.ok(!tpls.has(from), `alias ${from} 는 이미 등록된 키다(alias 불필요)`);
  }
  for (const [key, def] of Object.entries(map.newTpl)) {
    // 아직 그 유형 파일이 반입되지 않은 newTpl 은 레지스트리에 없을 수 있다(그 유형이 올 때 keys-geo 가 더한다). 있으면 부모가 같아야 한다.
    const have = tpls.get(key);
    if (have) assert.equal(have.parentProblemTypeKey, def.parentProblemTypeKey);
    assert.ok(pts.has(def.parentProblemTypeKey) || map.newPt?.[def.parentProblemTypeKey], `newTpl ${key} 의 부모 PT 가 없다`);
  }
});

test('크로스워크: 유형 은행용 DIRECT_ACTIVE 행은 RPM_ONLY 리프를 가리키고 PT/TPL 이 등록돼 있다', () => {
  const tax = readJson('archive/data/meta-foundation/canonical/packs/geometry/taxonomy.json');
  const cw = readJson('archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-geometry.json');
  const ids = new Map(cw.records.map(r => [r.id, r]));
  assert.equal(ids.size, cw.records.length, '크로스워크 행 id 중복');
  const tpls = new Map(tax.templates.map(t => [t.templateKey, t]));
  for (const r of cw.records.filter(x => x.curriculum === '2022' && x.mappingStatus === 'DIRECT_ACTIVE')) {
    const t = tpls.get(r.templateKey);
    assert.ok(t && t.parentProblemTypeKey === r.problemTypeKey, `${r.id}: TPL ${r.templateKey} 가 PT ${r.problemTypeKey} 의 것이 아니다`);
    if (r.promotesRpmOnlyRowId) {
      const leaf = ids.get(r.promotesRpmOnlyRowId);
      assert.ok(leaf && leaf.mappingStatus === 'RPM_ONLY', `${r.id}: 승격 대상 ${r.promotesRpmOnlyRowId} 가 RPM_ONLY 행이 아니다`);
      assert.deepEqual(leaf.rpmPath, r.rpmPath);
    }
  }
});
