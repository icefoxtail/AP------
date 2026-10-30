(function (root, factory) {
  const isNode = typeof module === "object" && module.exports;
  const api = factory(
    isNode ? require("./archive2-core.js") : root.Archive2Core,
    isNode ? require("./archive2-unified-units.js") : root.Archive2UnifiedUnits,
  );
  if (isNode) module.exports = api;
  else root.Archive2QuickPools = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core, Unified) {
  "use strict";
  if (!Core || !Unified || typeof Unified.buildIndex !== "function")
    throw new Error("Archive2QuickPools requires Archive2Core and Archive2UnifiedUnits.");

  // Quick assessments (5분 테스트 / 소단원 평가 / 중단원 평가 / 종합평가) on the shared unified unit
  // layer (user decision 2026-10-29). 2015 and 2022 questions share one 2022-based unit list per
  // grade and subject; every record keeps its original curriculum, keys and metadata. This module
  // only builds the candidate pools and judges whether a pool satisfies a difficulty preset. It
  // never reads the legacy 하/중/상 label and never infers a numeric difficulty.
  const PRESET_LABELS = Object.freeze({ basic: "기초", standard: "기본", application: "응용", advanced: "심화" });
  // [difficultyBucket, count] pairs. 5단계 is not part of any preset, so it never enters a pool.
  const PRODUCTS = Object.freeze({
    "five-minute": Object.freeze({ title: "5분 테스트", count: 4, unitKind: "unit", unitLabel: "단원",
      order: Object.freeze(["basic", "standard", "application"]), presets: Object.freeze({
        basic: [[1, 2], [2, 2]], standard: [[2, 2], [3, 2]], application: [[2, 1], [3, 3]],
      }) }),
    "subunit-test": Object.freeze({ title: "소단원 평가", count: 12, unitKind: "subunit", unitLabel: "소단원",
      order: Object.freeze(["basic", "standard", "application"]), presets: Object.freeze({
        basic: [[1, 6], [2, 6], [3, 0]], standard: [[1, 3], [2, 6], [3, 3]],
        application: [[1, 1], [2, 5], [3, 6]],
      }) }),
    "unit-test": Object.freeze({ title: "중단원 평가", count: 20, unitKind: "unit", unitLabel: "단원",
      order: Object.freeze(["basic", "standard", "application", "advanced"]), presets: Object.freeze({
        basic: [[1, 8], [2, 10], [3, 2], [4, 0]],
        standard: [[1, 4], [2, 10], [3, 6], [4, 0]],
        application: [[1, 2], [2, 6], [3, 9], [4, 3]],
        advanced: [[1, 0], [2, 4], [3, 10], [4, 6]],
      }) }),
    "monthly-test": Object.freeze({ title: "종합평가", count: 24, unitKind: "unit", unitLabel: "단원", combine: true,
      order: Object.freeze(["basic", "standard", "application", "advanced"]), presets: Object.freeze({
        basic: [[1, 8], [2, 12], [3, 4], [4, 0]],
        standard: [[1, 4], [2, 12], [3, 8], [4, 0]],
        application: [[1, 2], [2, 8], [3, 10], [4, 4]],
        advanced: [[1, 0], [2, 4], [3, 12], [4, 8]],
      }) }),
  });
  const VIEWS = Object.freeze(Object.keys(PRODUCTS));
  const BUCKETS = Object.freeze([1, 2, 3, 4]);
  const GENERAL = Object.freeze({ useMode: "general" });
  const text = (value) => String(value ?? "").trim();
  const hasHangul = (value) => /[가-힣]/.test(value);

  // difficultyMode "eligible" (the only mode the screens use): the S14 definition, i.e. a recorded
  // 1~5 bucket with its confidence / boundary / compatibility fields and no difficulty conflict,
  // bound to the verified (or content-bound) source. "recorded" accepts every integer bucket,
  // including the ones whose supporting fields are missing; it exists to MEASURE what that wider
  // reading would add and is not reachable from the UI.
  function usableBucket(record, difficultyMode = "eligible") {
    if (!Core.generalUseEligibility(record).ok) return 0;
    const bucket = record.difficultyBucket;
    if (!Number.isInteger(bucket) || bucket < 1 || bucket > 4) return 0;
    if (difficultyMode === "recorded") return bucket;
    return Core.difficultyEligible(record, GENERAL) ? bucket : 0;
  }

  const emptyBuckets = () => ({ 1: [], 2: [], 3: [], 4: [] });
  const countsOf = (buckets) => ({ 1: buckets[1].length, 2: buckets[2].length, 3: buckets[3].length, 4: buckets[4].length });
  const compareKo = (a, b) => String(a).localeCompare(String(b), "ko");

  // One pass over the unified index. Pools are per grade view, so a 고3 source question that is
  // browsable in the 고2 view is a candidate there too, exactly as in 문제지 만들기.
  // metaByUid (optional, uid -> projected meta row) supplies the recorded 소단원; records without
  // one are simply not part of any 소단원 pool (never guessed).
  function buildPools(index, options = {}) {
    const difficultyMode = options.difficultyMode === "recorded" ? "recorded" : "eligible";
    const metaByUid = options.metaByUid || null;
    const pools = {
      difficultyMode,
      units: {},
      subunits: {},
      stats: { records: 0, usable: 0, noSubject: 0, difficultyUnusable: 0, bucket5: 0, byBucket: { 1: 0, 2: 0, 3: 0, 4: 0 } },
    };
    const countedRecords = new Set();
    for (const grade of Unified.GRADES) {
      const unitMap = new Map(), subMap = new Map(), seen = new Set();
      for (const entry of index.views[grade] || []) {
        const record = entry.record;
        const first = !countedRecords.has(record);
        if (first) { countedRecords.add(record); pools.stats.records++; }
        const bucket = usableBucket(record, difficultyMode);
        if (!bucket) {
          if (first) {
            if (record.difficultyBucket === 5 && Core.generalUseEligibility(record).ok) pools.stats.bucket5++;
            else if (Core.generalUseEligibility(record).ok) pools.stats.difficultyUnusable++;
          }
          continue;
        }
        if (!entry.subject) { if (first) pools.stats.noSubject++; continue; }
        const uid = text(record.questionUid);
        if (!uid || seen.has(uid)) continue;
        seen.add(uid);
        if (first) { pools.stats.usable++; pools.stats.byBucket[bucket]++; }
        const unitKey = entry.unclassified ? "" : entry.unitKey;
        const key = Unified.scopeKey(grade, entry.subject, unitKey);
        let unit = unitMap.get(key);
        if (!unit) unitMap.set(key, unit = {
          key, kind: unitKey ? "unit" : "unclassified", grade, subject: entry.subject,
          subjectLabel: entry.subjectLabel, unitKey, label: unitKey ? entry.unitLabel : Unified.UNCLASSIFIED_LABEL,
          order: unitKey ? entry.unitOrder : 9999, buckets: emptyBuckets(),
        });
        unit.buckets[bucket].push(record);
        const meta = metaByUid?.get(uid);
        const subKey = text(meta?.subUnitKey);
        if (subKey) {
          const subId = `${key}:${subKey}`;
          let sub = subMap.get(subId);
          if (!sub) subMap.set(subId, sub = {
            key: subId, kind: "subunit", grade, subject: entry.subject, subjectLabel: entry.subjectLabel,
            unitKey, unitLabel: unit.label, subUnitKey: subKey, label: "", order: unit.order,
            buckets: emptyBuckets(), names: new Map(),
          });
          sub.buckets[bucket].push(record);
          const name = text(meta.subUnit);
          if (name) sub.names.set(name, (sub.names.get(name) || 0) + 1);
        }
      }
      const finish = (list) => {
        for (const unit of list) {
          unit.counts = countsOf(unit.buckets);
          unit.total = BUCKETS.reduce((sum, bucket) => sum + unit.counts[bucket], 0);
          if (unit.names) {
            // The recorded name can be an English variant of the same key; prefer a Korean one,
            // then the most frequent.
            unit.label = [...unit.names.entries()].sort((a, b) =>
              hasHangul(b[0]) - hasHangul(a[0]) || b[1] - a[1] || compareKo(a[0], b[0]))[0]?.[0] || unit.subUnitKey;
            delete unit.names;
          }
        }
        return list.sort((a, b) => compareKo(a.subject, b.subject) || a.order - b.order ||
          compareKo(a.label, b.label) || compareKo(a.key, b.key));
      };
      pools.units[grade] = groupBySubject(finish([...unitMap.values()]));
      pools.subunits[grade] = groupBySubject(finish([...subMap.values()]));
    }
    return pools;
  }
  function groupBySubject(list) {
    const bySubject = {};
    for (const unit of list) (bySubject[unit.subject] ||= []).push(unit);
    return bySubject;
  }

  // Unified subjects of a grade, in curriculum order, each with the number of usable questions.
  function subjectsFor(pools, grade) {
    return Unified.subjectsForGrade(grade).map((subject) => {
      const units = pools.units[grade]?.[subject.value] || [];
      return { value: subject.value, label: subject.label, items: units.reduce((sum, unit) => sum + unit.total, 0) };
    });
  }
  // Units of one product for a grade/subject. Unclassified questions form a last "단원 미분류"
  // unit for the unit based products; 소단원 are only the recorded ones.
  function unitsFor(pools, view, grade, subject) {
    const product = PRODUCTS[view];
    if (!product) return [];
    const source = product.unitKind === "subunit" ? pools.subunits : pools.units;
    return (source[grade]?.[subject] || []).slice();
  }

  function sumCounts(units) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const unit of units) for (const bucket of BUCKETS) counts[bucket] += unit.counts[bucket];
    return counts;
  }
  // Pools of different units of one grade are disjoint (a question sits in exactly one unit), so
  // counts add. Returns the exact shortage per difficulty step for the chosen preset.
  function evaluate(units, product, presetName) {
    const preset = product.presets[presetName] || product.presets.standard;
    const counts = sumCounts(units);
    const shortages = preset.filter(([bucket, need]) => need > 0 && counts[bucket] < need)
      .map(([bucket, need]) => ({ bucket, need, have: counts[bucket] }));
    return { ok: shortages.length === 0, counts, shortages };
  }
  const shortageText = (shortages) =>
    shortages.map(({ bucket, need, have }) => `${bucket}단계 ${need}문항 필요 · ${have}문항 가능`).join(" / ");
  const presetMix = (product, presetName) => (product.presets[presetName] || [])
    .filter(([, count]) => count).map(([bucket, count]) => `${bucket}단계 ${count}문항`).join(" · ");

  // Splits a unit list for the screen: units that can make this preset, and the rest with the
  // reason. For combinable products (종합평가) the caller evaluates a chosen union instead.
  function partition(units, product, presetName) {
    const ready = [], short = [];
    for (const unit of units) {
      const verdict = evaluate([unit], product, presetName);
      (verdict.ok ? ready : short).push({ unit, verdict });
    }
    return { ready, short };
  }

  // Everything a product needs for measurement across all grades/subjects (used by tests and the
  // before/after report).
  function summarize(pools, view, presetName) {
    const product = PRODUCTS[view];
    const rows = [];
    for (const grade of Unified.GRADES) for (const subject of subjectsFor(pools, grade)) {
      const units = unitsFor(pools, view, grade, subject.value);
      const parts = partition(units, product, presetName);
      const combined = product.combine ? evaluate(units, product, presetName).ok : null;
      rows.push({
        grade, subject: subject.value, label: subject.label, units: units.length,
        readyUnits: parts.ready.length, readyItems: parts.ready.reduce((sum, row) => sum + row.unit.total, 0),
        items: units.reduce((sum, unit) => sum + unit.total, 0), combined,
      });
    }
    return rows;
  }

  return {
    PRESET_LABELS, PRODUCTS, VIEWS, BUCKETS,
    isQuickView: (view) => VIEWS.includes(view),
    usableBucket, buildPools, subjectsFor, unitsFor, evaluate, partition, summarize,
    shortageText, presetMix,
  };
});
