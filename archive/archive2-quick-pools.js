(function (root, factory) {
  const isNode = typeof module === "object" && module.exports;
  const api = factory(
    isNode ? require("./archive2-core.js") : root.Archive2Core,
    isNode ? require("./archive2-unified-units.js") : root.Archive2UnifiedUnits,
    isNode ? require("./archive2-unit-tree.js") : root.Archive2UnitTree,
  );
  if (isNode) module.exports = api;
  else root.Archive2QuickPools = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core, Unified, Tree) {
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
    "five-minute": Object.freeze({ title: "5분 테스트", count: 4, unitKind: "unit", unitLabel: "단원", pick: "any",
      order: Object.freeze(["basic", "standard", "application"]), presets: Object.freeze({
        basic: [[1, 2], [2, 2]], standard: [[2, 2], [3, 2]], application: [[2, 1], [3, 3]],
      }) }),
    "subunit-test": Object.freeze({ title: "소단원 평가", count: 12, unitKind: "subunit", unitLabel: "소단원", pick: "child",
      order: Object.freeze(["basic", "standard", "application"]), presets: Object.freeze({
        basic: [[1, 6], [2, 6], [3, 0]], standard: [[1, 3], [2, 6], [3, 3]],
        application: [[1, 1], [2, 5], [3, 6]],
      }) }),
    "unit-test": Object.freeze({ title: "중단원 평가", count: 20, unitKind: "unit", unitLabel: "단원", pick: "unit",
      order: Object.freeze(["basic", "standard", "application", "advanced"]), presets: Object.freeze({
        basic: [[1, 8], [2, 10], [3, 2], [4, 0]],
        standard: [[1, 4], [2, 10], [3, 6], [4, 0]],
        application: [[1, 2], [2, 6], [3, 9], [4, 3]],
        advanced: [[1, 0], [2, 4], [3, 10], [4, 6]],
      }) }),
    "monthly-test": Object.freeze({ title: "종합평가", count: 24, unitKind: "unit", unitLabel: "단원", combine: true, pick: "any",
      order: Object.freeze(["basic", "standard", "application", "advanced"]), presets: Object.freeze({
        basic: [[1, 8], [2, 12], [3, 4], [4, 0]],
        standard: [[1, 4], [2, 12], [3, 8], [4, 0]],
        application: [[1, 2], [2, 8], [3, 10], [4, 4]],
        advanced: [[1, 0], [2, 4], [3, 12], [4, 8]],
      }) }),
    // 진단평가 (first-consultation test, user decisions 2026-11-19): 24 questions from ORIGINAL past exams first (originalOnly), several
    // units like 종합평가 (combine), the 4~5단계 slot counts 4단계 and 5단계 questions together (mergeTop, this product only), and the
    // paper is printed from the lowest step up. The step counts are set here and nowhere else; 기본 is the default.
    // fillFrom (2026-11-20): only when a step of the chosen range has fewer original questions than the preset asks, exactly the missing
    // number of that step is filled from 유형 (types/) and 유사 (similar/) questions of the same grade, semester and unit.
    diagnostic: Object.freeze({ title: "진단평가", count: 24, unitKind: "unit", unitLabel: "단원", combine: true, pick: "any",
      originalOnly: true, mergeTop: true, fillFrom: Object.freeze(["types/", "similar/"]), stepLabels: Object.freeze({ 4: "4~5" }),
      order: Object.freeze(["basic", "standard", "advanced"]), presets: Object.freeze({
        basic: [[1, 5], [2, 5], [3, 10], [4, 4]],
        standard: [[1, 3], [2, 5], [3, 10], [4, 6]],
        advanced: [[1, 2], [2, 4], [3, 10], [4, 8]],
      }) }),
  });
  const VIEWS = Object.freeze(Object.keys(PRODUCTS));
  const BUCKETS = Object.freeze([1, 2, 3, 4]);
  const text = (value) => String(value ?? "").trim();
  const hasHangul = (value) => /[가-힣]/.test(value);

  // Quick assessment selection uses the one shared difficulty gate (Core.difficultyEligible:
  // integer bucket, intact identity/source) and then
  // takes the 1~4 buckets. Confidence, boundary, compatibility, approval status and review
  // annotations are labels, not gates. No legacy 하/중/상 inference is allowed. The
  // `difficultyMode` argument/option is kept for caller compatibility; every value gives the
  // same result. 5단계 has no quick-assessment preset and remains out of scope.
  // mergeTop (진단평가 only): a 5단계 question sits in the 4~5단계 slot (bucket 4); every other product keeps 5단계 out.
  function usableBucket(record, difficultyMode = "recorded", mergeTop = false) {
    if (!Core.difficultyEligible(record)) return 0;
    const bucket = record.difficultyBucket;
    if (mergeTop) return bucket >= 1 && bucket <= 5 ? Math.min(bucket, 4) : 0;
    return bucket >= 1 && bucket <= 4 ? bucket : 0;
  }
  // 원본 기출 = a question of an original school exam (similar, textbook, type and generated sources are not).
  const isOriginalExam = (record) => text(record?.sourceFile).startsWith("original/");
  // "1" / "2": the semester of the exam a question comes from (1학기·2학기 중간/기말); "" for sources without one.
  const examSemester = (record) => { const axis = text(record?.examAxis); return /^1-/.test(axis) ? "1" : /^2-(mid|final)/.test(axis) ? "2" : ""; };
  // A question that may fill a short step of a product with fillFrom: a 유형 / 유사 source (never an original, textbook or generated one).
  const isFillSource = (record, product) => Boolean(product?.fillFrom) && product.fillFrom.some((prefix) => text(record?.sourceFile).startsWith(prefix));
  // The semester of a fill question: a similar set keeps its exam's semester; a 유형 file has none (it follows its unit). A question with a
  // semester must match the chosen one; "" (1·2학기) takes every semester.
  const fillSemesterOk = (record, semester) => !semester || !examSemester(record) || examSemester(record) === semester;
  // Is a chosen question still allowed in this product (the pools are cached per catalog load; checked again before printing).
  function stillUsable(record, product) {
    const merge = Boolean(product?.mergeTop), expected = merge ? Math.min(record.difficultyBucket, 4) : record.difficultyBucket;
    return usableBucket(record, "recorded", merge) === expected &&
      (!product?.originalOnly || isOriginalExam(record) || isFillSource(record, product));
  }

  const emptyBuckets = () => ({ 1: [], 2: [], 3: [], 4: [] });
  const countsOf = (buckets) => ({ 1: buckets[1].length, 2: buckets[2].length, 3: buckets[3].length, 4: buckets[4].length });
  const compareKo = (a, b) => String(a).localeCompare(String(b), "ko");

  // One pass over the unified index. Pools are per grade view, so a 고3 source question that is
  // browsable in the 고2 view is a candidate there too, exactly as in 문제지 만들기.
  // The pools are the 대단원 (high school: 단원) level only. The 중단원 / 소단원 level is a view over these
  // same records built by buildScopes() from the shared unit tree (archive2-unit-tree.js), so every
  // screen names, orders and groups units the same way (2026-11-16: no more 2015 "이전 분류" cards,
  // no duplicated or English sub-unit names; the 2015 legacy keys fold into the tree's 중단원).
  // options.product: a product with originalOnly/mergeTop (진단평가) builds its own pools; options.semester ("1" | "2") keeps one
  // semester's exams. Without a product the pools are the common ones every other product shares.
  function buildPools(index, options = {}) {
    const difficultyMode = options.difficultyMode === "eligible" ? "eligible" : "recorded";
    const only = options.product?.originalOnly ? options.product : null;
    const pools = {
      difficultyMode,
      units: {},
      stats: { records: 0, usable: 0, noSubject: 0, difficultyUnusable: 0, bucket5: 0, byBucket: { 1: 0, 2: 0, 3: 0, 4: 0 } },
    };
    const countedRecords = new Set();
    for (const grade of Unified.GRADES) {
      const unitMap = new Map(), seen = new Set(), fillRows = [];
      for (const entry of index.views[grade] || []) {
        const record = entry.record;
        if (only && !isOriginalExam(record)) {
          // A 유형 / 유사 question waits here; it joins a unit only when that unit has original questions (see below).
          if (isFillSource(record, only) && fillSemesterOk(record, options.semester) && entry.subject) {
            const bucket = usableBucket(record, difficultyMode, Boolean(only.mergeTop));
            const uid = text(record.questionUid);
            if (bucket && uid) fillRows.push({ key: Unified.scopeKey(grade, entry.subject, entry.unclassified ? "" : entry.unitKey), bucket, record, uid });
          }
          continue;
        }
        if (only && options.semester && examSemester(record) !== options.semester) continue;
        const first = !countedRecords.has(record);
        if (first) { countedRecords.add(record); pools.stats.records++; }
        const bucket = usableBucket(record, difficultyMode, Boolean(only?.mergeTop));
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
      }
      const list = [...unitMap.values()];
      if (only?.fillFrom) {
        const seenFill = new Set();
        for (const unit of list) unit.fillBuckets = emptyBuckets();
        for (const row of fillRows) {
          const unit = unitMap.get(row.key);
          if (!unit || seenFill.has(row.uid)) continue;
          seenFill.add(row.uid);
          unit.fillBuckets[row.bucket].push(row.record);
        }
      }
      for (const unit of list) {
        unit.counts = countsOf(unit.buckets);
        unit.total = BUCKETS.reduce((sum, bucket) => sum + unit.counts[bucket], 0);
        if (unit.fillBuckets) unit.fillCounts = countsOf(unit.fillBuckets);
      }
      list.sort((a, b) => compareKo(a.subject, b.subject) || a.order - b.order ||
        compareKo(a.label, b.label) || compareKo(a.key, b.key));
      pools.units[grade] = groupBySubject(list);
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
  // 대단원(고등은 단원) pools of a grade/subject in curriculum order; the unclassified pool is last. Every product
  // shares them; what a teacher can pick inside them (중단원 / 소단원) is buildScopes().
  function unitsFor(pools, view, grade, subject) {
    if (!PRODUCTS[view]) return [];
    return (pools.units[grade]?.[subject] || []).slice();
  }

  function sumCounts(units) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const unit of units) for (const bucket of BUCKETS) counts[bucket] += unit.counts[bucket];
    return counts;
  }
  // Pools of different units of one grade are disjoint (a question sits in exactly one unit), so
  // counts add. Returns the exact shortage per difficulty step for the chosen preset.
  // A product with fillFrom (진단평가) counts the 유형/유사 questions of the same units as a reserve: a step with fewer original questions
  // than the preset asks is still possible when the reserve covers the rest. `fills` names those steps and exactly how many questions
  // the reserve has to give (the missing number only); `counts` stays the original questions.
  function sumFill(units) {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const unit of units) if (unit.fillCounts) for (const bucket of BUCKETS) counts[bucket] += unit.fillCounts[bucket] || 0;
    return counts;
  }
  function evaluate(units, product, presetName) {
    const preset = product.presets[presetName] || product.presets.standard;
    const counts = sumCounts(units);
    const reserve = product.fillFrom ? sumFill(units) : { 1: 0, 2: 0, 3: 0, 4: 0 };
    const stepLabel = (bucket) => (product.stepLabels?.[bucket] ? { label: product.stepLabels[bucket] } : {});
    const shortages = preset.filter(([bucket, need]) => need > 0 && counts[bucket] + reserve[bucket] < need)
      .map(([bucket, need]) => ({ bucket, need, have: counts[bucket] + reserve[bucket], ...stepLabel(bucket) }));
    const fills = shortages.length ? [] : preset.filter(([bucket, need]) => need > 0 && counts[bucket] < need)
      .map(([bucket, need]) => ({ bucket, count: need - counts[bucket], ...stepLabel(bucket) }));
    return { ok: shortages.length === 0, counts, shortages, fills };
  }
  // "4~5단계 2문항은 유형·유사 문항으로 채웁니다": one fact line for the steps a fill covers (empty when nothing is filled).
  const fillText = (fills, verb = "채웁니다") => fills.length
    ? `${fills.map(({ bucket, label, count }) => `${label || bucket}단계 ${count}문항`).join(" · ")}은 원본 기출이 모자라 유형·유사 문항으로 ${verb}.` : "";
  const shortageText = (shortages) =>
    shortages.map(({ bucket, label, need, have }) => `${label || bucket}단계 ${need}문항 필요 · ${have}문항 가능`).join(" / ");
  const presetMix = (product, presetName) => (product.presets[presetName] || [])
    .filter(([, count]) => count).map(([bucket, count]) => `${product.stepLabels?.[bucket] || bucket}단계 ${count}문항`).join(" · ");

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

  // ---- 중단원 / 소단원 scopes (shared unit tree, 2026-11-16) -----------------------------------------------------
  // A scope is something a teacher can pick: a 대단원 (high school: 단원), one of its 중단원 (middle school, the
  // official RPM 2022 table of contents) or one of its 소단원 groups (high school, archive2-subunit-groups.json).
  // Scopes are views over the pooled records, not copies: every record appears in exactly one child of its
  // unit, so the counts of sibling scopes add up. Names, order and membership come from Archive2UnitTree, the
  // same module that draws the rows of 단원별 기출, so no screen invents its own list.
  // A record the tree cannot place ("중단원 미지정" / "기타") stays inside its 대단원 scope and is not
  // offered as a scope of its own. Nothing here changes a record, its keys or its metadata.
  function flatRecords(unit) {
    const rows = [];
    for (const bucket of BUCKETS) for (const record of unit.buckets[bucket]) rows.push([bucket, record]);
    return rows;
  }
  // The tree reads `subUnitKey` (high school sub-unit groups, 2015 legacy 중단원 folding) and
  // `rpmParentResolution` (middle school exact parents) off the record. A thin wrapper supplies the recorded
  // meta value and the unified index's judgement without copying or touching the record itself.
  function wrapRecord(record, middle, index, metaByUid) {
    const wrapped = Object.create(record);
    const uid = text(record.questionUid);
    wrapped.subUnitKey = text(metaByUid?.get(uid)?.subUnitKey) || text(record.subUnitKey);
    if (middle) {
      const entry = index?.byUid?.get(uid);
      if (entry?.rpmParentStatus) wrapped.rpmParentResolution = { status: entry.rpmParentStatus, parent: entry.rpmParent || null,
        ...(entry.reviewedMiddleParent ? { reviewedParent: entry.reviewedMiddleParent } : {}) };
    }
    return wrapped;
  }
  const finishNode = (node) => {
    node.counts = countsOf(node.buckets);
    node.total = BUCKETS.reduce((sum, bucket) => sum + node.counts[bucket], 0);
    if (node.fillBuckets) node.fillCounts = countsOf(node.fillBuckets);
    return node;
  };
  // The 유형 / 유사 reserve of a unit (진단평가) as [bucket, record] rows, like flatRecords().
  function flatFillRecords(unit) {
    const rows = [];
    if (unit.fillBuckets) for (const bucket of BUCKETS) for (const record of unit.fillBuckets[bucket]) rows.push([bucket, record]);
    return rows;
  }
  function buildScopes(pools, grade, subject, options = {}) {
    const all = pools.units[grade]?.[subject] || [];
    const unclassified = all.find((unit) => unit.kind === "unclassified") || null;
    // Every unit of the table of contents is listed, also one with no usable question yet (it then shows as
    // "문항 부족" instead of silently missing from the list).
    const pooled = all.filter((unit) => unit.kind === "unit");
    const known = new Set(pooled.map((unit) => unit.unitKey));
    const subjectLabel = Unified.subjectByValue(grade, subject)?.label || "";
    const empty = Unified.unitsForSubject(grade, subject).filter((row) => !known.has(row.key)).map((row) => finishNode({
      key: Unified.scopeKey(grade, subject, row.key), kind: "unit", grade, subject, subjectLabel, unitKey: row.key,
      label: row.name, order: row.order, buckets: emptyBuckets(),
    }));
    const classified = [...pooled, ...empty].sort((a, b) => a.order - b.order || compareKo(a.label, b.label));
    const middle = /^중[123]$/.test(grade);
    const profileId = Unified.GRADE_PROFILE[grade];
    const prepared = new Map();
    let tree = null;
    if (Tree && profileId && classified.length) {
      const treeUnits = classified.map((unit) => {
        const rows = flatRecords(unit);
        const wrapped = rows.map(([, record]) => wrapRecord(record, middle, options.index, options.metaByUid));
        const fillRows = flatFillRecords(unit);
        const fillWrapped = fillRows.map(([, record]) => wrapRecord(record, middle, options.index, options.metaByUid));
        prepared.set(unit.key, { rows, wrapped, fillRows, fillWrapped });
        return { key: unit.unitKey, name: unit.label, course: unit.subjectLabel, selectableRecords: wrapped };
      });
      try { tree = Tree.createTree(profileId, treeUnits); } catch (error) { tree = null; }
    }
    const byKey = new Map(), order = [];
    const sections = classified.map((unit) => {
      byKey.set(unit.key, unit);
      order.push(unit);
      const children = [];
      if (tree && tree.hasChildren(unit.unitKey)) {
        const nodes = new Map();
        for (const child of tree.childrenOf(unit.unitKey)) {
          const node = {
            key: `${unit.key}~${child.key}`, kind: ["none", "other", "moved"].includes(child.kind) ? "other" : "child",
            grade, subject, subjectLabel: unit.subjectLabel, unitKey: unit.unitKey, unitLabel: unit.label,
            childKey: child.key, label: child.name, section: child.section || "", order: unit.order,
            orderInUnit: child.rank, root: unit, buckets: emptyBuckets(),
            ...(unit.fillBuckets ? { fillBuckets: emptyBuckets() } : {}),
          };
          nodes.set(child.key, node);
          children.push(node);
        }
        const { rows, wrapped, fillRows, fillWrapped } = prepared.get(unit.key);
        rows.forEach(([bucket, record], i) => {
          nodes.get(tree.childKeyOf(unit.unitKey, wrapped[i]))?.buckets[bucket].push(record);
        });
        fillRows.forEach(([bucket, record], i) => {
          nodes.get(tree.childKeyOf(unit.unitKey, fillWrapped[i]))?.fillBuckets[bucket].push(record);
        });
        for (const node of children) { finishNode(node); byKey.set(node.key, node); if (node.kind === "child") order.push(node); }
      }
      return { key: unit.key, label: unit.label, unit, children };
    });
    if (unclassified) { byKey.set(unclassified.key, unclassified); order.push(unclassified); }
    return {
      grade, subject, middle, tree, sections, unclassified, byKey, order,
      groupsMissing: Boolean(tree?.groupsMissing),
      // "과목 전체" = every 대단원 plus the unclassified pool; they are disjoint, so counts add.
      roots: [...classified, ...(unclassified ? [unclassified] : [])],
    };
  }
  // What a product lets a teacher pick, in table-of-contents order, grouped under the 대단원 heading.
  //   five-minute / monthly-test: the 대단원 as a whole and each 중단원 (소단원 group) of it
  //   subunit-test: 중단원 (middle) / 소단원 group (high) only
  //   unit-test: 중단원 (middle) / 단원 (high)
  // Each group is { section, items: [{ node, role: "root" | "child" }] }. "단원 미분류" is a last group (not for 소단원 평가).
  function pickableGroups(scopes, view) {
    const product = PRODUCTS[view];
    const groups = [];
    if (!product) return groups;
    for (const section of scopes.sections) {
      const kids = section.children.filter((node) => node.kind === "child").map((node) => ({ node, role: "child" }));
      const root = { node: section.unit, role: "root" };
      let items;
      if (product.pick === "child") items = kids.length ? kids : (scopes.groupsMissing || !scopes.tree ? [root] : []);
      else if (product.pick === "unit") items = scopes.middle && kids.length ? kids : [root];
      else items = [root, ...kids];
      if (items.length) groups.push({ section, items });
    }
    if (scopes.unclassified && product.pick !== "child")
      groups.push({ section: { key: scopes.unclassified.key, label: scopes.unclassified.label, unit: scopes.unclassified, children: [] },
        items: [{ node: scopes.unclassified, role: "root" }], unclassified: true });
    return groups;
  }
  // Scopes for a list of keys, in table-of-contents order. A 대단원 chosen as a whole swallows its own children
  // (the union stays disjoint, so evaluate() can simply add the counts).
  function selectNodes(scopes, keys) {
    const wanted = new Set(keys);
    return scopes.order.filter((node) => wanted.has(node.key) && !(node.root && wanted.has(node.root.key)));
  }
  // The word a teacher sees for the thing a product lets them pick.
  function unitNoun(view, grade) {
    const middle = /^중[123]$/.test(grade);
    if (view === "subunit-test") return middle ? "중단원" : "소단원";
    if (view === "unit-test") return middle ? "중단원" : "단원";
    return "단원";
  }
  // "2단계 문항 부족" / "2·3단계 문항 부족": the short reason for a list. shortageText() has the exact numbers.
  const shortReason = (shortages) => `${shortages.map(({ bucket, label }) => label || bucket).join("·")}단계 문항 부족`;

  // Print order of a selection (every quick product): lowest difficulty first (the recorded step, so a 5단계 question follows the
  // 4단계 ones); inside a step the unit (and 중단원) table-of-contents order; ties keep the selection order. The set of
  // questions never changes. units are the chosen scope nodes the selection was drawn from.
  function orderByStep(units, selected) {
    const place = new Map();
    for (const unit of units) for (const bucket of BUCKETS) for (const record of [...unit.buckets[bucket], ...(unit.fillBuckets?.[bucket] || [])])
      if (!place.has(record.questionUid)) place.set(record.questionUid, [Number(unit.order) || 0, Number(unit.orderInUnit) || 0]);
    return selected.map((record, index) => ({ record, index, key: place.get(record.questionUid) || [Infinity, 0] }))
      .sort((a, b) => a.record.difficultyBucket - b.record.difficultyBucket || a.key[0] - b.key[0] || a.key[1] - b.key[1] || a.index - b.index)
      .map((row) => row.record);
  }

  // Everything a product needs for measurement across all grades/subjects (used by tests and the
  // before/after report).
  function summarize(pools, view, presetName, options = {}) {
    const product = PRODUCTS[view];
    const rows = [];
    for (const grade of Unified.GRADES) for (const subject of subjectsFor(pools, grade)) {
      const scopes = buildScopes(pools, grade, subject.value, options);
      const units = pickableGroups(scopes, view).flatMap((group) => group.items.map((item) => item.node));
      const parts = partition(units, product, presetName);
      const combined = product.combine ? evaluate(scopes.roots, product, presetName).ok : null;
      rows.push({
        grade, subject: subject.value, label: subject.label, units: units.length,
        readyUnits: parts.ready.length, readyItems: parts.ready.reduce((sum, row) => sum + row.unit.total, 0),
        items: scopes.roots.reduce((sum, unit) => sum + unit.total, 0), combined,
      });
    }
    return rows;
  }

  return {
    PRESET_LABELS, PRODUCTS, VIEWS, BUCKETS,
    isQuickView: (view) => VIEWS.includes(view),
    usableBucket, isOriginalExam, isFillSource, examSemester, stillUsable, orderByStep, fillText, buildPools, subjectsFor, unitsFor, evaluate, partition, summarize,
    buildScopes, wrapRecord, pickableGroups, selectNodes, unitNoun, shortReason,
    shortageText, presetMix,
  };
});
