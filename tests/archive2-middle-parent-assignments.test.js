const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// 문항별 중단원 지정표: 지정표(정본) -> 카탈로그 reviewedMiddleParentKey(파생) -> 단원 표의 중단원 칸.
// 운영 데이터의 정확한 개수는 고정하지 않고 결함 조건(정본이 아닌 키, 깨진 참조, 중복, 지문이 다른 문항에 적용)만 본다.
const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const Toc = require(path.join(archiveRoot, 'rpm-middle-toc.js'));
const Tree = require(path.join(archiveRoot, 'archive2-unit-tree.js'));
const Unified = require(path.join(archiveRoot, 'archive2-unified-units.js'));
const Quick = require(path.join(archiveRoot, 'archive2-quick-pools.js'));
const Archive2Core = require(path.join(archiveRoot, 'archive2-core.js'));

const lib = () => import(pathToFileURL(path.join(archiveRoot, 'tools', 'middle-parent-assignments-lib.mjs')).href);
const parentKeyOf = (grade, l2) => Toc.parents(grade).find(parent => parent.L2 === l2).parentKey;
const CIRCLE_ANGLE = parentKeyOf('중3', '원주각');
const CIRCLE_APPLY = parentKeyOf('중3', '원주각의 활용');
const CIRCLE_BIG_UNIT = Toc.parent(CIRCLE_ANGLE).unitKey;
const fp = char => char.repeat(64);

// 정본 판정이 못 정하는(OUT_OF_SCOPE) 중3 원의 성질 문항. 옛 키는 중단원 둘 이상에 걸쳐 있다.
const ambiguousRecord = (id, extra = {}) => ({
  sourceFile: `original/middle/m3/1mid/y${id}.js`, sourceOrdinal: id, sourceQuestionNo: String(id), id,
  sourceGrade: '중3', effectiveBrowseGrade: '중3', questionUid: `qid_v1_${String(id).padStart(64, '0')}`,
  assignmentFingerprint: fp('a'), ...extra,
});

test('지정표가 있는 문항은 지정된 중단원 칸으로 가고, EXACT 판정과 다른 대단원 지정, 없는 문항은 예전과 같다', () => {
  const unitKey = CIRCLE_BIG_UNIT;
  const outOfScope = { status: 'OUT_OF_SCOPE', parent: null };
  const records = [
    // 지정됨 -> 원주각
    ambiguousRecord(1, { rpmParentResolution: { ...outOfScope, reviewedParent: Toc.parent(CIRCLE_ANGLE) } }),
    // 지정됨 -> 원주각의 활용
    ambiguousRecord(2, { rpmParentResolution: { ...outOfScope, reviewedParent: Toc.parent(CIRCLE_APPLY) } }),
    // 지정표에 없음 -> 예전처럼 중단원 미지정(옛 키 매핑이 둘 이상이거나 없음)
    ambiguousRecord(3, { rpmParentResolution: outOfScope, subUnitKey: 'NOT-IN-CANONICAL' }),
    // 정본 EXACT가 1순위: 지정이 달라도 EXACT를 따른다
    ambiguousRecord(4, { rpmParentResolution: { status: 'EXACT', parent: Toc.parent(CIRCLE_ANGLE), reviewedParent: Toc.parent(CIRCLE_APPLY) } }),
    // 지정된 중단원이 이 대단원이 아니면 이 줄에서는 쓰지 않는다
    ambiguousRecord(5, { rpmParentResolution: { ...outOfScope, reviewedParent: Toc.parent(parentKeyOf('중3', '이차방정식의 활용')) } }),
  ];
  const tree = Tree.createTree('m3', [{ key: unitKey, name: '원의 성질', course: '중3 수학', selectableRecords: records }]);
  const child = name => tree.childrenOf(unitKey).find(row => row.name === name).key;
  assert.equal(tree.childKeyOf(unitKey, records[0]), child('원주각'));
  assert.equal(tree.childKeyOf(unitKey, records[1]), child('원주각의 활용'));
  assert.equal(tree.childKeyOf(unitKey, records[2]), Tree.NONE_KEY);
  assert.equal(tree.childKeyOf(unitKey, records[3]), child('원주각'), 'EXACT 판정이 먼저다');
  assert.equal(tree.childKeyOf(unitKey, records[4]), Tree.NONE_KEY, '다른 대단원 중단원은 이 단원 줄에 넣지 않는다');
});

test('core: 지정 중단원은 정본 판정이 EXACT가 아닐 때만 붙고, 정본 키가 아니거나 학년이 다르면 무시한다', () => {
  const base = ambiguousRecord(10, { originalCurriculum: '2015' });
  const withKey = key => ({ ...base, reviewedMiddleParentKey: key });
  const resolved = core.resolveRpmParent(withKey(CIRCLE_ANGLE), 'm3');
  assert.notEqual(resolved.status, 'EXACT');
  assert.equal(resolved.reviewedParent && resolved.reviewedParent.parentKey, CIRCLE_ANGLE, '판정 상태는 그대로이고 지정만 덧붙는다');
  assert.equal(core.resolveRpmParent(base, 'm3').reviewedParent, undefined, '필드가 없으면 예전과 같다');
  assert.equal(core.resolveRpmParent(withKey('["2022","M3-2","원의 성질","없는 중단원"]'), 'm3').reviewedParent, undefined, '정본 키가 아니면 무시');
  assert.equal(core.resolveRpmParent(withKey(parentKeyOf('중2', '피타고라스 정리')), 'm3').reviewedParent, undefined, '다른 학년 중단원이면 무시');
  // 대단원 분류도 지정된 중단원이 속한 대단원을 따른다
  const classified = core.classifyRecord({ ...withKey(CIRCLE_ANGLE), rpmParentResolution: resolved }, 'm3');
  assert.equal(classified.status, 'classified');
  assert.equal(classified.unitKey, CIRCLE_BIG_UNIT);
  assert.equal(classified.reason, 'reviewed-middle-parent');
});

test('통합 단원: 지정표가 있는 문항은 지정 중단원의 대단원에 들어가고 지문이 같은 정본 판정(EXACT)은 건드리지 않는다', () => {
  const record = ambiguousRecord(20, { originalCurriculum: '2015', year: 2018, legacyStandardUnitKey: 'M3-RAW-X', legacyStandardUnit: '원' });
  const plain = Unified.classify(record);
  const reviewed = Unified.classify({ ...record, reviewedMiddleParentKey: CIRCLE_ANGLE });
  assert.equal(reviewed.placed, true);
  assert.equal(reviewed.entry.unitKey, CIRCLE_BIG_UNIT);
  assert.equal(reviewed.entry.reason, 'reviewed-middle-parent');
  assert.equal(reviewed.entry.reviewedMiddleParent.parentKey, CIRCLE_ANGLE);
  assert.equal(plain.entry.reviewedMiddleParent, undefined);
  assert.notEqual(plain.entry.reason, 'reviewed-middle-parent');
  // 표 쪽 포장도 같은 지정을 그대로 넘긴다
  const index = Unified.buildIndex([{ ...record, reviewedMiddleParentKey: CIRCLE_APPLY }]);
  const wrapped = Quick.wrapRecord(index.byRecord.keys().next().value, true, index, new Map());
  const tree = Tree.createTree('m3', [{ key: CIRCLE_BIG_UNIT, name: '원의 성질', course: '중3 수학', selectableRecords: [wrapped] }]);
  assert.equal(tree.childName(CIRCLE_BIG_UNIT, tree.childKeyOf(CIRCLE_BIG_UNIT, wrapped)), '원주각의 활용');
});

test('도구: 본문 지문이 판정 당시와 다르면 지정을 쓰지 않는다', async () => {
  const { applyAssignment, loadToc } = await lib();
  const toc = loadToc();
  const assignment = { parentKey: CIRCLE_ANGLE, assignmentFingerprint: fp('a') };
  assert.deepEqual(applyAssignment(assignment, { effectiveBrowseGrade: '중3', assignmentFingerprint: fp('a') }, toc), { key: CIRCLE_ANGLE });
  assert.deepEqual(applyAssignment(assignment, { effectiveBrowseGrade: '중3', assignmentFingerprint: fp('b') }, toc), { stale: true }, '본문이 바뀐 문항은 낡은 지정이다');
  assert.equal(applyAssignment(assignment, { effectiveBrowseGrade: '중2', assignmentFingerprint: fp('a') }, toc), null, '학년이 다르면 쓰지 않는다');
  assert.equal(applyAssignment(undefined, { effectiveBrowseGrade: '중3', assignmentFingerprint: fp('a') }, toc), null);
  assert.equal(applyAssignment({ parentKey: 'nope', assignmentFingerprint: fp('a') }, { effectiveBrowseGrade: '중3', assignmentFingerprint: fp('a') }, toc), null);
});

test('도구: 원장 변환은 이름이 정확히 하나로 맞는 OTHER_BIG_UNIT만 풀고 나머지는 추정 없이 unresolved로 낸다', async () => {
  const { buildAssignmentsDocument, resolveOtherBigUnit, loadToc, validateAssignments } = await lib();
  const toc = loadToc();
  assert.deepEqual(resolveOtherBigUnit({ suggestBigUnit: '중3 다항식의 곱셈과 인수분해', suggestParent: '다항식의 곱셈' }, '중3', toc), { parentKey: parentKeyOf('중3', '다항식의 곱셈') });
  assert.deepEqual(resolveOtherBigUnit({ suggestBigUnit: '이차방정식', suggestParent: '이차방정식의 활용' }, '중3', toc), { parentKey: parentKeyOf('중3', '이차방정식의 활용') }, '학년 접두어는 없어도 된다');
  assert.equal(resolveOtherBigUnit({ suggestBigUnit: '중2 도형의 닮음과 피타고라스 정리', suggestParent: '피타고라스 정리' }, '중3', toc).reason, 'SUGGESTED_GRADE_DIFFERS', '문항 학년은 바꾸지 않는다');
  assert.equal(resolveOtherBigUnit({ suggestBigUnit: '', suggestParent: '' }, '중3', toc).reason, 'NO_SUGGESTED_PARENT');
  assert.equal(resolveOtherBigUnit({ suggestBigUnit: '원의 성질', suggestParent: '원' }, '중3', toc).reason, 'SUGGESTED_PARENT_UNKNOWN', '비슷한 이름으로 추정하지 않는다');
  assert.equal(resolveOtherBigUnit({ suggestBigUnit: '없는 대단원', suggestParent: '원주각' }, '중3', toc).reason, 'SUGGESTED_BIG_UNIT_UNKNOWN');

  const uid = n => `qid_v1_${String(n).padStart(64, '0')}`;
  const catalogByUid = new Map([1, 2, 3, 4, 5].map(n => [uid(n), { questionUid: uid(n), sourceGrade: '중3', effectiveBrowseGrade: '중3', sourceFingerprint: fp(String(n)), assignmentFingerprint: fp('a') }]));
  const row = (n, extra) => ({ uid: uid(n), sourceFile: 'x.js', no: n, contentFingerprint: fp(String(n)), confidence: 'high', round: 'first', ...extra });
  const { doc, unresolved, skipped } = buildAssignmentsDocument([
    row(1, { parentKey: CIRCLE_ANGLE }),
    row(2, { parentKey: 'OTHER_BIG_UNIT', suggestBigUnit: '중3 이차방정식', suggestParent: '이차방정식의 활용' }),
    row(3, { parentKey: 'OTHER_BIG_UNIT', suggestBigUnit: '중2 도형의 닮음과 피타고라스 정리', suggestParent: '피타고라스 정리' }),
    row(4, { parentKey: 'NOT_IN_2022' }),
    row(5, { parentKey: CIRCLE_APPLY, contentFingerprint: fp('f') }),
    row(6, { parentKey: CIRCLE_APPLY }),
  ], { catalogByUid, toc, basis: {} });
  assert.deepEqual(doc.rows.map(r => r[0]), [uid(1), uid(2)]);
  assert.equal(skipped.notIn2022, 1);
  assert.deepEqual(unresolved.map(r => [r.questionUid, r.reason]), [[uid(3), 'SUGGESTED_GRADE_DIFFERS'], [uid(5), 'CONTENT_CHANGED_SINCE_JUDGMENT'], [uid(6), 'UID_NOT_IN_CATALOG']]);
  assert.deepEqual(validateAssignments(doc, { toc, catalogByUid }).errors, []);
  // 검증은 결함을 잡는다: 정본이 아닌 키, 중복, 깨진 참조
  const broken = JSON.parse(JSON.stringify(doc));
  broken.parents[0] = '["2022","M3-2","원의 성질","없는 중단원"]';
  broken.rows.push([uid(9), 0, fp('a'), fp('a'), 'high', 'first']);
  const errors = validateAssignments(broken, { toc, catalogByUid }).errors.join('\n');
  assert.match(errors, /정본 중단원 키가 아닙니다/);
  assert.match(errors, /카탈로그에 없는 questionUid/);
  const duplicated = JSON.parse(JSON.stringify(doc));
  duplicated.rows.push(duplicated.rows[0]);
  assert.match(validateAssignments(duplicated, { toc, catalogByUid }).errors.join('\n'), /같은 문항이 두 번/);
});

test('지정표 파일: 모든 키가 정본 중단원이고 모든 문항이 카탈로그에 있으며, 카탈로그 필드는 지정표에서 파생된 값과 같다', async () => {
  const { validateAssignments, indexAssignments, applyAssignment, loadToc, ASSIGNMENTS_RELATIVE_PATH } = await lib();
  const toc = loadToc();
  const doc = JSON.parse(fs.readFileSync(path.join(archiveRoot, '..', ASSIGNMENTS_RELATIVE_PATH), 'utf8'));
  const catalog = Archive2Core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'archive2-catalog.json'), 'utf8')));
  const byUid = new Map(catalog.records.map(record => [record.questionUid, record]));
  const result = validateAssignments(doc, { toc, catalogByUid: byUid });
  assert.deepEqual(result.errors, [], '지정표 결함');
  const assignments = indexAssignments(doc);
  assert.ok(assignments.size > 0);
  // 파생 일관성: 지문이 같으면 카탈로그 필드가 있고 값이 같으며, 지문이 다르거나 지정이 없으면 필드가 없다
  for (const record of catalog.records) {
    const applied = applyAssignment(assignments.get(record.questionUid), record, toc);
    const expected = applied && applied.key ? applied.key : undefined;
    assert.equal(record.reviewedMiddleParentKey, expected, `${record.questionUid} 카탈로그 필드가 지정표와 다르다`);
  }
});

test('실제 자료: 지정표가 실린 문항은 모두 지정된 중단원 칸에 들어가고, 대단원도 그 중단원의 대단원이다', () => {
  const catalog = Archive2Core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'archive2-catalog.json'), 'utf8')));
  const reviewed = catalog.records.filter(record => record.reviewedMiddleParentKey);
  assert.ok(reviewed.length > 0);
  const index = Unified.buildIndex(reviewed);
  const byUnit = new Map();
  for (const record of reviewed) {
    const entry = index.byRecord.get(record);
    assert.ok(entry && !entry.unclassified, `${record.questionUid} 대단원이 정해지지 않았다`);
    const parent = Toc.parent(record.reviewedMiddleParentKey);
    const exact = entry.rpmParentStatus === 'EXACT';
    // 정본 판정이 EXACT면 그 판정이 1순위이므로 지정표는 쓰이지 않는다
    if (!exact) assert.equal(entry.unitKey, parent.unitKey, `${record.questionUid} 대단원이 지정 중단원의 대단원이 아니다`);
    const wrapped = Quick.wrapRecord(record, true, index, new Map());
    const key = `${entry.grade}|${entry.unitKey}`;
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key).push({ record, wrapped, entry, exact, parent });
  }
  for (const [key, rows] of byUnit) {
    const [grade, unitKey] = key.split('|');
    const tree = Tree.createTree(Unified.GRADE_PROFILE[grade], [{ key: unitKey, name: unitKey, course: `${grade} 수학`, selectableRecords: rows.map(row => row.wrapped) }]);
    for (const row of rows) {
      if (row.exact) continue;
      assert.equal(tree.childName(unitKey, tree.childKeyOf(unitKey, row.wrapped)), row.parent.L2, `${row.record.questionUid} 중단원 칸`);
    }
  }
});
test('a stale assignment fingerprint is still applied when a rebind record confirmed the same stem and choices', async () => {
  const { applyAssignment, loadToc } = await lib();
  const toc = loadToc();
  const assignment = { parentKey: CIRCLE_ANGLE, assignmentFingerprint: fp('a') };
  const record = { effectiveBrowseGrade: '중3', assignmentFingerprint: fp('b') };
  assert.deepEqual(applyAssignment(assignment, record, toc), { stale: true });
  assert.deepEqual(applyAssignment(assignment, record, toc, { textBound: true }), { key: CIRCLE_ANGLE });
  assert.equal(applyAssignment(assignment, { ...record, effectiveBrowseGrade: '중2' }, toc, { textBound: true }), null, '학년이 다르면 확인이 있어도 쓰지 않는다');
});
