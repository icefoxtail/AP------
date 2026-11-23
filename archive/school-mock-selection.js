'use strict';

/* 학교 모의고사 자동 선정 (학교 시험지 하나 -> 기본 / 응용 / 심화 모의고사).
   기준 시험지의 문항 자리마다 그 자리의 유형(TPL / PT)과 난이도(정수 1~5)를 읽고, 같은 유형의 다른 문항으로 채운다.
   - 기본: 자리마다 같은 난이도. 응용: 자리의 절반쯤은 한 단계 어렵게(나머지는 같은 난이도). 심화: 모든 자리를 한 단계 어렵게(5단계는 그대로).
   - 후보가 없으면 조건을 단계적으로 넓힌다: 같은 TPL -> 같은 PT -> (난이도 한 단계 차이) -> 같은 단원. 그래도 없으면 그 자리는
     못 채움으로 두고 알린다. 값이 있으면 쓰고 막는 것은 실제 결함뿐이다(docs/agents/metadata.md): 후보 풀의 자격(difficultyEligible 등)은 부르는 쪽이 정한다.
   - 이 파일은 순수 함수다: 풀을 읽지도 화면을 만지지도 않는다. 같은 입력(seed 포함)이면 같은 결과다.
   - 짝 규칙: 기준 시험지 자기 문항과 그 시험지의 유사·유형 문항(같은 stem)은 후보에서 뺀다. 한 벌 안에서는 같은 문항과
     같은 stem+번호(원본과 그 유사본)를 두 번 넣지 않는다. 카탈로그에는 짝 링크가 없어서 파일 이름의 stem(확장자·'_유사N' 제거)과
     sourceOrdinal로 짝을 안다. */
(function expose(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.SchoolMockSelection = api;
})(typeof globalThis === 'object' ? globalThis : this, function createApi() {
  const MODES = Object.freeze(['basic', 'applied', 'advanced']);
  const MODE_LABELS = Object.freeze({ basic: '기본', applied: '응용', advanced: '심화' });
  const LEVELS = Object.freeze(['tpl', 'pt', 'unit', 'none']);
  const LEVEL_LABELS = Object.freeze({ tpl: '같은 유형(TPL)', pt: '같은 유형(PT)', unit: '같은 단원', none: '못 채움' });
  const text = value => String(value ?? '').trim();

  function defaultFacets(record) {
    return { pt: text(record?.problemTypeKey) || text(record?.metaHintPT), tpl: text(record?.templateKey) || text(record?.metaHintTPL) };
  }
  function difficultyOf(record) {
    const value = Number(record?.difficultyBucket);
    return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
  }
  // 'original/high/h1/1mid/26_순천고_..._수학.js' / 'similar/.../..._유사2.js' -> '26_순천고_..._수학'.
  function stemOf(record) {
    return text(record?.sourceFile).replace(/^[^/]+\//, '').replace(/\.js$/i, '').replace(/_유사\d*$/, '');
  }
  const kindOf = record => text(record?.sourceFile).split('/')[0];
  const pairKeyOf = record => `${stemOf(record)}#${text(record?.sourceOrdinal)}`;
  const KIND_RANK = Object.freeze({ original: 0, types: 1, similar: 2 });
  const kindRank = record => KIND_RANK[kindOf(record)] ?? 3;

  function hashSeed(seed) {
    let h = 2166136261;
    for (const ch of text(seed)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function makeRandom(seed) {
    let a = hashSeed(seed) || 0x9e3779b9;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 자리마다 목표 난이도. base 난이도가 없으면 null(난이도를 보지 않는다).
  function targetDifficulties(difficulties, mode, random) {
    const up = d => (d === null ? null : Math.min(d + 1, 5));
    if (mode === 'basic') return difficulties.slice();
    if (mode === 'advanced') return difficulties.map(up);
    // applied: 올릴 수 있는 자리(5단계가 아닌 자리) 중 절반을 올린다. 어느 자리인지는 seed가 정한다.
    const raisable = difficulties.map((d, i) => (d !== null && d < 5 ? i : -1)).filter(i => i >= 0);
    for (let i = raisable.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [raisable[i], raisable[j]] = [raisable[j], raisable[i]];
    }
    const raised = new Set(raisable.slice(0, Math.ceil(raisable.length / 2)));
    return difficulties.map((d, i) => (raised.has(i) ? up(d) : d));
  }

  function buildIndexes(candidates, facets, unitOf) {
    const byTpl = new Map(), byPt = new Map(), byUnit = new Map();
    const add = (map, key, row) => { if (key) (map.get(key) || map.set(key, []).get(key)).push(row); };
    for (const record of candidates) {
      const f = facets(record) || {};
      const row = { record, uid: text(record.questionUid), d: difficultyOf(record), pair: pairKeyOf(record), stem: stemOf(record), year: Number(record.year) || 0, kind: kindRank(record), tpl: text(f.tpl), pt: text(f.pt) };
      add(byTpl, row.tpl, row);
      add(byPt, row.pt, row);
      add(byUnit, text(unitOf(record)), row);
    }
    return { byTpl, byPt, byUnit };
  }

  // 한 자리의 후보 단계(좁은 것부터). 난이도 t가 null이면 난이도 조건 없이 단계마다 한 번만 본다.
  function tiersFor(slot, target, idx) {
    const tiers = [];
    const diffs = target === null ? [null] : [target];
    const near = target === null ? [] : [target - 1, target + 1].filter(d => d >= 1 && d <= 5);
    const pools = [
      ['tpl', slot.tpl ? idx.byTpl.get(slot.tpl) : null],
      ['pt', slot.pt ? idx.byPt.get(slot.pt) : null],
    ];
    for (const [level, list] of pools) if (list) tiers.push({ level, near: false, list, diffs });
    for (const [level, list] of pools) if (list && near.length) tiers.push({ level, near: true, list, diffs: near });
    const unitList = slot.unit ? idx.byUnit.get(slot.unit) : null;
    if (unitList) {
      tiers.push({ level: 'unit', near: false, list: unitList, diffs });
      if (near.length) tiers.push({ level: 'unit', near: true, list: unitList, diffs: near });
    }
    return tiers;
  }

  /* selectSchoolMock({ base, candidates, mode, seed, facets?, unitOf? })
     base: 기준 시험지 문항(시험지 순서). candidates: 후보 풀(자격 확인된 문항). mode: basic | applied | advanced.
     facets(record) -> { pt, tpl }, unitOf(record) -> 단원 키(같은 단원 넓힘에만 쓰인다). */
  function selectSchoolMock(input = {}) {
    const mode = MODES.includes(input.mode) ? input.mode : 'basic';
    const base = Array.isArray(input.base) ? input.base : [];
    const candidates = Array.isArray(input.candidates) ? input.candidates : [];
    const facets = typeof input.facets === 'function' ? input.facets : defaultFacets;
    const unitOf = typeof input.unitOf === 'function' ? input.unitOf : record => text(record?.legacyStandardUnitKey);
    const seed = text(input.seed) || 'school-mock';
    const random = makeRandom(`${seed}|${mode}`);

    const baseUids = new Set(base.map(record => text(record?.questionUid)).filter(Boolean));
    const baseStems = new Set(base.map(stemOf).filter(Boolean));
    const baseFiles = new Set(base.map(record => text(record?.sourceFile)).filter(Boolean));
    // 자기 문항·자기 시험의 유사·유형 문항은 빼고, 같은 문항이 두 번 들어와도 한 번만 둔다.
    const seenUid = new Set();
    const pool = [];
    let excludedOwn = 0;
    for (const record of candidates) {
      const uid = text(record?.questionUid);
      if (!uid || seenUid.has(uid)) continue;
      seenUid.add(uid);
      if (baseUids.has(uid) || baseFiles.has(text(record.sourceFile)) || baseStems.has(stemOf(record))) { excludedOwn += 1; continue; }
      pool.push(record);
    }
    const idx = buildIndexes(pool, facets, unitOf);

    const slots = base.map((record, index) => {
      const f = facets(record) || {};
      return { index, record, uid: text(record?.questionUid), d: difficultyOf(record), pt: text(f.pt), tpl: text(f.tpl), unit: text(unitOf(record)) };
    });
    const targets = targetDifficulties(slots.map(slot => slot.d), mode, random);

    // 후보가 적은 자리부터 채운다(흔한 유형이 희귀한 유형의 후보를 먼저 가져가지 않게). 같은 수면 시험지 순서.
    const scarcity = slots.map((slot, i) => {
      const tiers = tiersFor(slot, targets[i], idx);
      let count = 0;
      for (const tier of tiers) { if (tier.level === 'unit') break; count += tier.list.filter(row => tier.diffs[0] === null || tier.diffs.includes(row.d)).length; }
      return { i, count };
    });
    const order = scarcity.sort((a, b) => a.count - b.count || a.i - b.i).map(entry => entry.i);

    const usedUid = new Set(), usedPair = new Set();
    const spread = new Map(); // 같은 시험지에서 이미 가져온 문항 수: 같은 조건이면 여러 시험지에 고루 퍼지게
    const results = new Array(slots.length);
    // 1단계: 모든 자리를 유형(TPL/PT) 단계로 먼저 채운다. 2단계: 남은 자리만 같은 단원으로 넓힌다
    // (같은 단원 후보가 다른 자리의 같은 유형 후보를 먼저 가져가지 않게 나눈다).
    const pickFor = (i, wantUnit) => {
      const target = targets[i];
      for (const tier of tiersFor(slots[i], target, idx)) {
        if ((tier.level === 'unit') !== wantUnit) continue;
        const eligible = tier.list.filter(row => !usedUid.has(row.uid) && !usedPair.has(row.pair) && (tier.diffs[0] === null || tier.diffs.includes(row.d)));
        if (!eligible.length) continue;
        // 난이도가 목표에서 가까운 것 -> 원본 기출 우선 -> 최신 연도 -> 시험지 분산 -> seed 무작위.
        const keyed = eligible.map(row => ({ row, rand: random() }));
        keyed.sort((a, b) => {
          const da = target === null || a.row.d === null ? 0 : Math.abs(a.row.d - target);
          const db = target === null || b.row.d === null ? 0 : Math.abs(b.row.d - target);
          return da - db || a.row.kind - b.row.kind || b.row.year - a.row.year ||
            (spread.get(a.row.stem) || 0) - (spread.get(b.row.stem) || 0) || a.rand - b.rand;
        });
        const chosen = keyed[0].row;
        usedUid.add(chosen.uid);
        usedPair.add(chosen.pair);
        spread.set(chosen.stem, (spread.get(chosen.stem) || 0) + 1);
        return { chosen, level: tier.level, exact: target === null || chosen.d === target };
      }
      return null;
    };
    const found = new Array(slots.length).fill(null);
    for (const i of order) found[i] = pickFor(i, false);
    for (const i of order) if (!found[i]) found[i] = pickFor(i, true);
    slots.forEach((slot, i) => {
      const hit = found[i], target = targets[i];
      results[i] = {
        slot: i + 1,
        base: slot.record,
        baseUid: slot.uid,
        baseDifficulty: slot.d,
        targetDifficulty: target,
        pick: hit ? hit.chosen.record : null,
        pickUid: hit ? hit.chosen.uid : '',
        pickDifficulty: hit ? hit.chosen.d : null,
        level: hit ? hit.level : 'none',
        levelLabel: LEVEL_LABELS[hit ? hit.level : 'none'],
        difficultyMatch: hit ? hit.exact : false,
      };
    });
    return { ok: true, mode, modeLabel: MODE_LABELS[mode], seed, picks: results, summary: summarize(results, excludedOwn, pool.length) };
  }

  function histogram(values) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, unknown: 0 };
    for (const value of values) { if (value === null || value === undefined) counts.unknown += 1; else counts[value] += 1; }
    return counts;
  }
  function summarize(picks, excludedOwn = 0, poolSize = 0) {
    const levels = { tpl: 0, pt: 0, unit: 0, none: 0 };
    for (const pick of picks) levels[pick.level] += 1;
    const total = picks.length;
    const sameType = levels.tpl + levels.pt;
    const filled = total - levels.none;
    const unfilledSlots = picks.filter(pick => pick.level === 'none').map(pick => pick.slot);
    const widenedSlots = picks.filter(pick => pick.level === 'unit').map(pick => pick.slot);
    const parts = [`${total}문항 중 ${sameType}문항 같은 유형`];
    if (levels.unit) parts.push(`${levels.unit}문항 같은 단원`);
    if (levels.none) parts.push(`${levels.none}문항 못 채움`);
    return {
      total, filled, sameType, levels, unfilledSlots, widenedSlots, excludedOwn, poolSize,
      difficultyBefore: histogram(picks.map(pick => pick.baseDifficulty)),
      difficultyAfter: histogram(picks.filter(pick => pick.pick).map(pick => pick.pickDifficulty)),
      differenceCount: picks.filter(pick => pick.pick && !pick.difficultyMatch).length,
      text: parts.join(', '),
    };
  }

  // 결과를 시험지 순서의 문항 목록(못 채운 자리는 뺀다)으로.
  const pickedRecords = result => (result?.picks || []).filter(pick => pick.pick).map(pick => pick.pick);

  return { MODES, MODE_LABELS, LEVELS, LEVEL_LABELS, selectSchoolMock, pickedRecords, stemOf, pairKeyOf, defaultFacets, makeRandom };
});
