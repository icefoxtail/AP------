// 기준 시험지로 다시 만들기: 선정 모듈(archive/archive2-derive.js) 결함 조건 테스트.
// 합성 픽스처로 사다리·난이도 예산·경계·제외·출처·seed를 보고, 실카탈로그로 두 시나리오(개수 고정 없음)를 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { performance } = require('node:perf_hooks');
const D = require('../archive/archive2-derive.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

// ---- 합성 픽스처 ----
// row: { uid, file, tpl, pt, hTpl, hPt, l4, sub, unit, b, grade, subject, curr, cc, cond, type }
function fixture(rows) {
  const records = [];
  const unified = { byRecord: new Map(), byUid: new Map() };
  for (const row of rows) {
    const record = {
      questionUid: row.uid,
      sourceFile: row.file || `original/high/h1/${row.uid}.js`,
      contentType: row.type || '기출',
      templateKey: row.tpl || '',
      problemTypeKey: row.pt || '',
      metaHintTPL: row.hTpl || '',
      metaHintPT: row.hPt || '',
      L4: row.l4 || '',
      subUnitKey: row.sub || '',
      difficultyBucket: row.b,
      crossConceptKeys: row.cc || [],
      conditionKeys: row.cond || [],
    };
    const entry = { uid: row.uid, grade: row.grade || '고1', subject: row.subject || 'ALG', originalCurriculum: row.curr || '2022', unitKey: row.unit || 'U1', unclassified: false };
    records.push(record);
    unified.byRecord.set(record, entry);
    unified.byUid.set(row.uid, entry);
  }
  return { records, index: D.buildDeriveIndex(records, { unified, eligible: () => true }) };
}
const base = (uid, extra) => ({ uid, tpl: 'T1', pt: 'P1', l4: 'L1', sub: 'S1', unit: 'U1', b: 2, file: `original/high/h1/base_${uid}.js`, ...extra });
const pick = (out, i = 0) => out.perItem[i];

test('사다리: 각 칸에서 후보를 찾고 어느 칸인지 사실대로 기록한다', () => {
  const cases = [
    ['template', { tpl: 'T1', pt: 'PX', l4: 'LX', sub: 'SX' }],
    ['type', { tpl: 'TX', pt: 'P1', l4: 'LX', sub: 'SX' }],
    ['concept', { tpl: 'TX', pt: 'PX', l4: 'L1', sub: 'SX' }],
    ['subunit', { tpl: 'TX', pt: 'PX', l4: 'LX', sub: 'S1' }],
    ['unit', { tpl: 'TX', pt: 'PX', l4: 'LX', sub: 'SX' }],
  ];
  for (const [rung, cand] of cases) {
    const { index } = fixture([base('b1'), { uid: 'c1', b: 2, unit: 'U1', ...cand }]);
    const out = D.deriveFromPaper(['b1'], {}, index);
    assert.equal(out.items.length, 1, rung);
    assert.equal(pick(out).pickedUid, 'c1', rung);
    assert.equal(pick(out).rung, rung, rung);
    assert.equal(pick(out).hintOnly, false, rung);
  }
  // 대단원에도 없으면 범위 안(기준이 덮는 다른 단원) 아무 문항, rung none
  const { index } = fixture([base('b1'), base('b2', { unit: 'U2', tpl: 'T2', pt: 'P2', l4: 'L2', sub: 'S2' }), { uid: 'c1', b: 2, unit: 'U2', tpl: 'TX', pt: 'PX', sub: 'SX' }]);
  const out = D.deriveFromPaper(['b1'], {}, index);
  assert.equal(pick(out).pickedUid, null, '기준이 U1만 덮으면 U2 문항은 경계 밖');
});

test('경계 안 다른 단원은 none으로 채우고, 문항 수는 유지된다', () => {
  const { index } = fixture([
    base('b1'), base('b2', { unit: 'U2', tpl: 'T2', pt: 'P2', l4: 'L2', sub: 'S2' }),
    { uid: 'c2', b: 2, unit: 'U2', tpl: 'TX', pt: 'PX', sub: 'SX' }, // U2 후보만 있음
  ]);
  const out = D.deriveFromPaper(['b1', 'b2'], {}, index);
  assert.equal(out.items.length, 2 - 1, 'U2 후보 하나뿐이라 둘 중 하나만 채울 수 있다');
  const rungs = out.perItem.map((p) => p.rung);
  assert.ok(rungs.includes('none') || out.perItem.some((p) => p.pickedUid === null));
  const more = fixture([
    base('b1'), base('b2', { unit: 'U2', tpl: 'T2', pt: 'P2', l4: 'L2', sub: 'S2' }),
    { uid: 'c2a', b: 2, unit: 'U2', tpl: 'TX', pt: 'PX', sub: 'SX' }, { uid: 'c2b', b: 2, unit: 'U2', tpl: 'TY', pt: 'PY', sub: 'SY' },
  ]);
  const full = D.deriveFromPaper(['b1', 'b2'], {}, more.index);
  assert.equal(full.items.length, 2, '후보가 없는 칸이 있어도 범위 안 아무 문항으로 수를 유지');
  assert.equal(full.perItem.find((p) => p.baseUid === 'b1').rung, 'none');
  assert.ok(full.summary.notes.some((n) => /다른 단원/.test(n)));
});

test('힌트 일치는 같은 칸 안에서 정식 일치보다 뒤이고 hintOnly로 기록된다', () => {
  const rows = [base('b1'), { uid: 'hint', b: 2, unit: 'U1', hTpl: 'T1', hPt: 'PX' }, { uid: 'formal', b: 2, unit: 'U1', tpl: 'T1', pt: 'PX' }];
  const out = D.deriveFromPaper(['b1'], {}, fixture(rows).index);
  assert.equal(pick(out).pickedUid, 'formal');
  assert.equal(pick(out).hintOnly, false);
  const onlyHint = D.deriveFromPaper(['b1'], {}, fixture([base('b1'), rows[1]]).index);
  assert.equal(pick(onlyHint).pickedUid, 'hint');
  assert.equal(pick(onlyHint).rung, 'template');
  assert.equal(pick(onlyHint).hintOnly, true);
  assert.ok(onlyHint.summary.notes.some((n) => /확정 전/.test(n)));
});

test('CrossConcept·Condition은 같은 칸 안 동점 깨기 가산점이다', () => {
  const rows = [base('b1', { cc: ['CC1'], cond: ['K1'] }), { uid: 'plain', b: 2, unit: 'U1', tpl: 'T1' }, { uid: 'cross', b: 2, unit: 'U1', tpl: 'T1', cc: ['CC1'], cond: ['K1'] }];
  for (const seed of ['a', 'b', 'c', 'd', 'e']) assert.equal(pick(D.deriveFromPaper(['b1'], { seed }, fixture(rows).index)).pickedUid, 'cross');
  // 칸을 바꾸지는 않는다: 가산점이 있어도 세부 유형이 다른 후보는 템플릿 칸에 못 든다
  const rows2 = [base('b1', { cc: ['CC1'] }), { uid: 'tplOnly', b: 2, unit: 'U1', tpl: 'T1' }, { uid: 'ccOnly', b: 2, unit: 'U1', tpl: 'TZ', pt: 'PZ', cc: ['CC1'] }];
  assert.equal(pick(D.deriveFromPaper(['b1'], {}, fixture(rows2).index)).pickedUid, 'tplOnly');
});

test('난이도 예산: 세부 유형이 맞으면 ±1을 허용하되 전체에서 상쇄한다', () => {
  const rows = [];
  for (let i = 1; i <= 4; i++) {
    rows.push(base(`b${i}`, { tpl: `T${i}`, pt: `P${i}`, l4: `L${i}`, sub: `S${i}`, b: 3 }));
    rows.push({ uid: `lo${i}`, b: 2, unit: 'U1', tpl: `T${i}`, pt: `P${i}`, sub: `S${i}` });
    rows.push({ uid: `hi${i}`, b: 4, unit: 'U1', tpl: `T${i}`, pt: `P${i}`, sub: `S${i}` });
  }
  const out = D.deriveFromPaper(['b1', 'b2', 'b3', 'b4'], { seed: 'budget' }, fixture(rows).index);
  assert.equal(out.items.length, 4);
  assert.ok(out.perItem.every((p) => p.rung === 'template' && Math.abs(p.levelDelta) === 1));
  assert.equal(out.perItem.reduce((sum, p) => sum + p.levelDelta, 0), 0, '±1이 전체에서 상쇄');
  assert.equal(out.summary.difficulty.easier, 2);
  assert.equal(out.summary.difficulty.harder, 2);
  // 세부 유형 칸이 아니면 ±1을 허용하지 않는다(유형 칸 후보가 단계가 다르면 더 낮은 칸의 같은 단계를 택한다)
  const strict = [base('b1', { b: 3 }), { uid: 'typeOff', b: 4, unit: 'U1', tpl: 'TX', pt: 'P1' }, { uid: 'unitExact', b: 3, unit: 'U1', tpl: 'TY', pt: 'PY', sub: 'SY' }];
  const s = D.deriveFromPaper(['b1'], {}, fixture(strict).index);
  assert.equal(pick(s).pickedUid, 'unitExact');
  assert.equal(pick(s).rung, 'unit');
});

test('난이도 프리셋: same / up-some / up-one (5는 5)', () => {
  const baseRows = [1, 2, 3, 4, 5].map((b, i) => base(`b${i}`, { tpl: `T${i}`, pt: `P${i}`, l4: `L${i}`, sub: `S${i}`, b }));
  const rows = [...baseRows];
  for (let b = 1; b <= 5; b++) for (let i = 0; i < 5; i++) rows.push({ uid: `c${b}_${i}`, b, unit: 'U1', tpl: `T${i}`, pt: `P${i}`, sub: `S${i}` });
  const { index } = fixture(rows);
  const uids = baseRows.map((r) => r.uid);
  const same = D.deriveFromPaper(uids, { level: 'same' }, index);
  assert.deepEqual(same.perItem.map((p) => p.levelDelta), [0, 0, 0, 0, 0]);
  const one = D.deriveFromPaper(uids, { level: 'up-one' }, index);
  assert.deepEqual(one.perItem.map((p) => p.levelDelta), [1, 1, 1, 1, 0], '5는 5');
  const some = D.deriveFromPaper(uids, { level: 'up-some', seed: 'x' }, index);
  const raised = some.perItem.filter((p) => p.levelDelta === 1).length;
  assert.equal(raised, 2, '5가 아닌 4문항 중 절반');
  assert.deepEqual(D.levelTargets([{ bucket: 5, uid: 'a' }], 'up-one', 's'), [5]);
});

test('필수 경계: 다른 교육과정·과목·시험 범위 밖 문항은 어느 단에서도 금지', () => {
  const rows = [
    base('b1'),
    { uid: 'otherUnit', b: 2, unit: 'U9', tpl: 'T1', pt: 'P1', l4: 'L1', sub: 'S1' },
    { uid: 'otherCurr', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', l4: 'L1', sub: 'S1', curr: '2015' },
    { uid: 'otherSubject', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', l4: 'L1', sub: 'S1', subject: 'GEO' },
    { uid: 'otherGrade', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', l4: 'L1', sub: 'S1', grade: '고2' },
  ];
  const out = D.deriveFromPaper(['b1'], {}, fixture(rows).index);
  assert.equal(out.items.length, 0, '경계 안 후보가 없으면 경계 밖에서 채우지 않는다');
  assert.equal(pick(out).pickedUid, null);
  assert.equal(out.summary.shortfall, 1);
  assert.ok(out.summary.notes.some((n) => /채우지 못했습니다/.test(n)));
});

test('제외: 기준 문항 자체와 exclude는 뽑지 않고, 기준 문항의 유사 사본은 쓴다', () => {
  const rows = [
    base('b1'),
    { uid: 'twin', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', file: 'similar/high/h1/twin_유사.js', type: '유형' },
    { uid: 'other', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1' },
  ];
  const { index } = fixture(rows);
  const all = new Set();
  for (const seed of ['1', '2', '3', '4', '5', '6']) all.add(pick(D.deriveFromPaper(['b1'], { seed }, index)).pickedUid);
  assert.ok(!all.has('b1'), '기준 문항 자체는 제외');
  assert.ok(all.has('twin'), '기준 문항의 유사 사본은 정상 후보');
  const ex = D.deriveFromPaper(['b1'], { exclude: ['twin'] }, index);
  assert.equal(pick(ex).pickedUid, 'other');
  const both = D.deriveFromPaper(['b1'], { exclude: new Set(['twin', 'other']) }, index);
  assert.equal(pick(both).pickedUid, null);
  // 한 시험지 안에서는 같은 문항을 두 번 뽑지 않는다
  const dup = D.deriveFromPaper(['b1', 'b1'], {}, index);
  assert.equal(new Set(dup.items.map((r) => r.questionUid)).size, dup.items.length);
});

test('다른 유형 모드: 기준의 세부 유형을 피하고, 모자라면 완화하고 기록한다', () => {
  const rows = [base('b1'), { uid: 'same', b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', sub: 'S1' }, { uid: 'diff', b: 2, unit: 'U1', tpl: 'T2', pt: 'P2', sub: 'S1' }];
  const out = D.deriveFromPaper(['b1'], { typeMode: 'different' }, fixture(rows).index);
  assert.equal(pick(out).pickedUid, 'diff');
  assert.equal(pick(out).rung, 'subunit');
  assert.equal(pick(out).relaxed, false);
  assert.equal(out.summary.relaxed, 0);
  const only = D.deriveFromPaper(['b1'], { typeMode: 'different' }, fixture([rows[0], rows[1]]).index);
  assert.equal(pick(only).pickedUid, 'same', '다른 유형이 없으면 막지 않는다');
  assert.equal(pick(only).relaxed, true);
  assert.equal(only.summary.relaxed, 1);
  assert.ok(only.summary.notes.some((n) => /같은 유형을 허용/.test(n)));
  // 세부 유형이 없는 기준은 유형(PT)을 피한다
  const noTpl = [base('b1', { tpl: '' }), { uid: 'samePt', b: 2, unit: 'U1', pt: 'P1' }, { uid: 'otherPt', b: 2, unit: 'U1', pt: 'P2' }];
  assert.equal(pick(D.deriveFromPaper(['b1'], { typeMode: 'different' }, fixture(noTpl).index)).pickedUid, 'otherPt');
  // 단원 구성은 유지: 다른 단원 후보보다 같은 단원 후보를 앞세운다
  const unitKeep = [base('b1'), { uid: 'u2', b: 2, unit: 'U2', tpl: 'T3', pt: 'P3' }, { uid: 'u1', b: 2, unit: 'U1', tpl: 'T2', pt: 'P2' }, base('b2', { unit: 'U2', tpl: 'T9', pt: 'P9', sub: 'S9', l4: 'L9' })];
  const keep = D.deriveFromPaper(['b1', 'b2'], { typeMode: 'different' }, fixture(unitKeep).index);
  assert.equal(keep.perItem[0].pickedUid, 'u1');
  assert.equal(keep.perItem[1].pickedUid, 'u2');
});

test('같은 seed + 같은 입력은 같은 결과, seed가 다르면 다른 결과', () => {
  const rows = [base('b1', { b: 2 }), base('b2', { tpl: 'T2', pt: 'P2', l4: 'L2', sub: 'S2' })];
  for (let i = 0; i < 12; i++) {
    rows.push({ uid: `a${i}`, b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', sub: 'S1', file: `original/high/h1/a${i}.js` });
    rows.push({ uid: `d${i}`, b: 2, unit: 'U1', tpl: 'T2', pt: 'P2', sub: 'S2', file: `original/high/h1/d${i}.js` });
  }
  const { index } = fixture(rows);
  const run = (seed) => D.deriveFromPaper(['b1', 'b2'], { seed }, index).perItem.map((p) => p.pickedUid).join(',');
  assert.equal(run('s1'), run('s1'));
  assert.equal(run(7), run('7'));
  const outputs = new Set(['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'].map(run));
  assert.ok(outputs.size > 1, 'seed가 다르면 결과도 달라진다');
  // 입력 배열을 거꾸로 줘도 문항별 결과는 같은 기준에 같은 후보를 고른다(후보 정렬이 입력 순서에 매이지 않음)
  const rev = fixture([...rows].reverse()).index;
  assert.equal(D.deriveFromPaper(['b1', 'b2'], { seed: 's1' }, rev).perItem.map((p) => p.pickedUid).join(','), run('s1'));
});

test('같은 원본 파일 몰림은 감점', () => {
  const rows = [base('b1', { tpl: 'T1' }), base('b2', { tpl: 'T1' })];
  rows.push({ uid: 'x1', b: 2, unit: 'U1', tpl: 'T1', file: 'original/high/h1/X.js' }, { uid: 'x2', b: 2, unit: 'U1', tpl: 'T1', file: 'original/high/h1/X.js' }, { uid: 'y1', b: 2, unit: 'U1', tpl: 'T1', file: 'original/high/h1/Y.js' });
  for (const seed of ['1', '2', '3', '4', '5', '6']) {
    const files = D.deriveFromPaper(['b1', 'b2'], { seed }, fixture(rows).index).items.map((r) => r.sourceFile);
    assert.equal(new Set(files).size, 2, '두 문항이 같은 파일에서 나오지 않는다');
  }
});

test('출처 선택: 학교 기출 / 유사 / 교과서(출판사별) / 교재·유형', () => {
  const manifest = { folders: { 비상교육_공통수학1: { publisher: '비상교육' }, 미래엔_공통수학1: { publisher: '미래엔' }, 백발백중_공통수학2: { publisher: '백발백중' } } };
  const mk = (uid, file, type) => ({ uid, b: 2, unit: 'U1', tpl: 'T1', pt: 'P1', file, type });
  const rows = [
    base('b1'),
    mk('school', 'original/high/h1/s.js', '기출'),
    mk('sim', 'similar/high/h1/sim_유사.js', '유형'),
    mk('tbA', 'textbooks/비상교육_공통수학1/a/a.js', '교과서'),
    mk('tbB', 'textbooks/미래엔_공통수학1/b/b.js', '교과서'),
    mk('wb', 'textbooks/백발백중_공통수학2/c/c.js', '교과서'),
    mk('types', 'types/high/h1/t.js', '유형'),
  ];
  const { records, index: plain } = fixture(rows);
  const unified = { byRecord: new Map(), byUid: new Map() };
  for (const record of records) {
    const entry = { uid: record.questionUid, grade: '고1', subject: 'ALG', originalCurriculum: '2022', unitKey: 'U1', unclassified: false };
    unified.byRecord.set(record, entry);
  }
  const index = D.buildDeriveIndex(records, { unified, eligible: () => true, manifest });
  const picked = (sources) => {
    const got = new Set();
    for (let s = 0; s < 12; s++) { const p = pick(D.deriveFromPaper(['b1'], { sources, seed: `s${s}` }, index)).pickedUid; if (p) got.add(p); }
    return [...got].sort();
  };
  assert.deepEqual(picked('school'), ['school']);
  assert.deepEqual(picked('similar'), ['sim']);
  assert.deepEqual(picked('textbook'), ['tbA', 'tbB']);
  assert.deepEqual(picked({ kind: 'textbook', publisher: '미래엔' }), ['tbB']);
  assert.deepEqual(picked({ kind: 'textbook', publishers: ['비상교육'] }), ['tbA']);
  assert.deepEqual(picked('workbook'), ['types', 'wb']);
  assert.deepEqual(picked(['school', { kind: 'similar' }]), ['school', 'sim']);
  assert.ok(picked('all').length >= 2, '전체는 모든 출처를 후보로 본다');
  // 후보 출처가 없으면 채우지 못하고 사실대로 알린다
  const none = D.deriveFromPaper(['b1'], { sources: { kind: 'textbook', publisher: '동아출판' } }, index);
  assert.equal(none.items.length, 0);
  assert.ok(plain);
});

test('summary: 화면 문구에 내부 키 이름이 없고, 일치율·난이도 개수를 낸다', () => {
  const rows = [base('b1', { tpl: 'T_SECRET_KEY', pt: 'PT_SECRET' }), { uid: 'c1', b: 3, unit: 'U1', tpl: 'T_SECRET_KEY', pt: 'PT_SECRET' }];
  const out = D.deriveFromPaper(['b1'], { level: 'up-one' }, fixture(rows).index);
  const s = out.summary;
  assert.equal(s.text, '같은 세부 유형 1');
  assert.equal(s.levelText, '기준보다 쉬움 0 · 같음 0 · 어려움 1');
  assert.ok(!/(PT_|TPL_|T_SECRET|template|rung|bucket|uid)/i.test(`${s.text} ${s.levelText} ${s.notes.join(' ')} ${s.rungRows.map((r) => r.label).join(' ')}`));
  assert.deepEqual(s.match, { template: 1, type: 1, unit: 1, level: 1, levelDistribution: 0 });
  assert.deepEqual(s.rungRows.map((r) => r.label), ['같은 세부 유형', '같은 유형', '같은 개념', '같은 단원']);
});

test('기준 문항을 자료에서 못 찾으면 만들지 않고 이유를 알린다', () => {
  const out = D.deriveFromPaper(['nope'], {}, fixture([base('b1')]).index);
  assert.equal(out.items.length, 0);
  assert.equal(out.summary.error, 'BASE_UNRESOLVED');
});

// ---- 실카탈로그 ----
let catalogPromise;
const realCatalog = () => (catalogPromise ||= (async () => {
  const { data } = await productionCatalog();
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../archive/data/textbook-source-manifest-v1.json'), 'utf8'));
  const t0 = performance.now();
  const index = D.buildDeriveIndex(data.records, { projectionPolicy: data.projectionPolicy, manifest });
  return { data, manifest, index, indexMs: performance.now() - t0 };
})());

test('실카탈로그: 교과서 폴더의 출판사 판정이 기존 폴더 표와 같다', async () => {
  const { manifest } = await realCatalog();
  for (const [folder, row] of Object.entries(manifest.folders)) {
    assert.equal(D.publisherOf(`textbooks/${folder}/x/y.js`, manifest), row.publisher, folder);
    assert.equal(D.publisherOf(`textbooks/${folder}/x/y.js`, null), folder.split('_')[0], folder);
  }
});

test('실카탈로그: 원본 기출 시험지 하나 → same/same 결과가 기준과 0개 겹치고 시험 범위 안이다', async () => {
  const { data, index } = await realCatalog();
  const byFile = new Map();
  for (const record of data.records) if (/^original\//.test(record.sourceFile)) (byFile.get(record.sourceFile) || byFile.set(record.sourceFile, []).get(record.sourceFile)).push(record);
  const files = [...byFile.entries()].filter(([, rows]) => rows.length >= 15);
  assert.ok(files.length > 20);
  for (const [, rows] of [files[0], files[Math.floor(files.length / 2)], files[files.length - 1]]) {
    const baseUids = rows.map((r) => r.questionUid);
    const out = D.deriveFromPaper(baseUids, { typeMode: 'same', level: 'same', seed: 'real' }, index);
    assert.equal(out.items.length + out.summary.shortfall, rows.length);
    assert.ok(out.items.length >= rows.length * 0.9, '실카탈로그에서는 거의 항상 채워진다');
    const baseSet = new Set(baseUids);
    assert.ok(out.items.every((r) => !baseSet.has(r.questionUid)), '기준 문항 0개 겹침');
    assert.equal(new Set(out.items.map((r) => r.questionUid)).size, out.items.length, '중복 없음');
    const boundary = new Map();
    for (const uid of baseUids) { const b = index.byUid.get(uid); if (!boundary.has(b.ck)) boundary.set(b.ck, new Set()); boundary.get(b.ck).add(b.unit); }
    for (const item of out.items) {
      const cand = index.byUid.get(item.questionUid);
      assert.ok(boundary.has(cand.ck) && boundary.get(cand.ck).has(cand.unit), '시험 범위(과정·대단원) 안');
    }
    for (const p of out.perItem) if (p.pickedUid) assert.ok(D.RUNGS.includes(p.rung));
    assert.ok(out.summary.match.unit === null || out.summary.match.unit >= 0);
  }
});

test('실카탈로그: 교과서 단원 기준 → 교과서만 출처로 뽑는다', async () => {
  const { data, index, manifest } = await realCatalog();
  const byFile = new Map();
  for (const record of data.records) if (/^textbooks\/(비상교육|미래엔|동아출판)_/.test(record.sourceFile)) (byFile.get(record.sourceFile) || byFile.set(record.sourceFile, []).get(record.sourceFile)).push(record);
  const rows = [...byFile.values()].filter((list) => list.length >= 8).sort((a, b) => b.length - a.length)[0];
  assert.ok(rows, '교과서 단원 기준 표본이 있다');
  const out = D.deriveFromPaper(rows.map((r) => r.questionUid), { sources: 'textbook', level: 'same', seed: 'tb' }, index);
  assert.ok(out.items.length > 0);
  for (const item of out.items) {
    const kind = D.sourceKindOf(item, manifest);
    assert.equal(kind.kind, 'textbook', item.sourceFile);
    assert.ok(/^textbooks\/(비상교육|미래엔|동아출판)_/.test(item.sourceFile));
  }
  const pub = rows[0].sourceFile.split('/')[1].split('_')[0];
  const onePub = D.deriveFromPaper(rows.map((r) => r.questionUid), { sources: { kind: 'textbook', publisher: pub }, seed: 'tb' }, index);
  for (const item of onePub.items) assert.equal(D.publisherOf(item.sourceFile, manifest), pub);
});

test('실카탈로그: 시험지 한 벌 선정은 색인 뒤 빠르다', async () => {
  const { data, index, indexMs } = await realCatalog();
  const byFile = new Map();
  for (const record of data.records) if (/^original\//.test(record.sourceFile)) (byFile.get(record.sourceFile) || byFile.set(record.sourceFile, []).get(record.sourceFile)).push(record);
  const sample = [...byFile.values()].filter((rows) => rows.length >= 20).slice(0, 40);
  const times = [];
  for (const rows of sample) {
    for (const level of ['same', 'up-one']) {
      const t0 = performance.now();
      D.deriveFromPaper(rows.map((r) => r.questionUid), { level, seed: 'perf' }, index);
      times.push(performance.now() - t0);
    }
  }
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  const p95 = times[Math.floor(times.length * 0.95)];
  console.log(`derive perf: index ${indexMs.toFixed(0)}ms, median ${median.toFixed(1)}ms, p95 ${p95.toFixed(1)}ms, runs ${times.length}`);
  assert.ok(median < 50, `median ${median}`);
  assert.ok(p95 < 250, `p95 ${p95}`);
});
