(function (root, factory) {
  const isNode = typeof module === "object" && module.exports;
  const api = factory(
    isNode ? require("./archive2-core.js") : root.Archive2Core,
    isNode ? require("./unit-past-exams-core.js") : root.UnitPastExamsCore,
  );
  if (isNode) module.exports = api;
  else root.Archive2UnifiedUnits = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core, UnitCore) {
  "use strict";
  if (!Core || !UnitCore || !UnitCore.PROFILES || typeof UnitCore.classifyRecord !== "function")
    throw new Error("Archive2UnifiedUnits requires Archive2Core and UnitPastExamsCore.");

  // User decision 2026-10-29 (recorded in archive/data/archive2-unified-unit-policy.json, which
  // must stay byte-for-byte equal to this object; see tests/archive2-unified-units.test.cjs).
  // The 2015 and 2022 curricula are presented as ONE 2022-based unit list. This is a display and
  // selection grouping only: every record keeps its original curriculum, keys and metadata.
  const POLICY = Object.freeze({
    schemaVersion: "archive2-unified-unit-policy-v1",
    decidedBy: "user",
    decidedAt: "2026-10-29",
    scope: "DISPLAY_AND_SELECTION_GROUPING_ONLY",
    unitBasis: "2022 revised curriculum units (UnitPastExamsCore PROFILES, shared with 단원별 기출)",
    keysUnchanged: true,
    curriculumKeyConversion: false,
    originalCurriculumFilter: "OPTIONAL_DETAIL_FILTER_DEFAULT_ALL",
    unclassifiedScope: "PER_GRADE_SUBJECT_UNIT_UNCLASSIFIED",
    canonicalRuleReference: "docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md:242",
    description:
      "문제지 만들기의 단원 목록은 2015·2022 교육과정을 2022 기준 하나의 목록으로 묶어 보여줍니다. " +
      "묶음은 표시와 선택에만 적용하며 문항의 원본 교육과정·키·메타데이터는 변경하지 않습니다. " +
      "원본 교육과정은 세부 조건에서 선택적으로 거를 수 있습니다.",
  });

  const GRADE_PROFILE = Object.freeze({
    중1: "m1", 중2: "m2", 중3: "m3", 고1: "h1", 고2: "h2", 고3: "h3",
  });
  const GRADES = Object.freeze(Object.keys(GRADE_PROFILE));
  const UNCLASSIFIED_LABEL = "단원 미분류";
  const NO_SUBJECT_LABEL = "기타 문항";
  const HIGH1_SUBJECTS = Object.freeze([
    Object.freeze({ value: "COMMON_MATH_1", label: "공통수학1", course: "공통수학1" }),
    Object.freeze({ value: "COMMON_MATH_2", label: "공통수학2", course: "공통수학2" }),
  ]);
  const text = (value) => String(value ?? "").trim();
  const isMiddle = (grade) => /^중[123]$/.test(grade);
  const compact = (value) => text(value).normalize("NFC").replace(/\s+/g, "");

  const subjectCache = new Map();
  function subjectsForGrade(grade) {
    if (subjectCache.has(grade)) return subjectCache.get(grade);
    let rows = [];
    if (grade === "고1") rows = HIGH1_SUBJECTS;
    else if (grade === "고2" || grade === "고3")
      rows = Core.highSemanticSubjectOptions().map(({ value, label }) =>
        Object.freeze({ value, label, course: label }));
    else if (isMiddle(grade))
      rows = [Object.freeze({ value: "MIDDLE", label: `${grade} 수학`, course: `${grade} 수학` })];
    rows = Object.freeze(rows.slice());
    subjectCache.set(grade, rows);
    return rows;
  }
  function subjectByCourse(grade, course) {
    return subjectsForGrade(grade).find((subject) => subject.course === course) || null;
  }
  function subjectByValue(grade, value) {
    return subjectsForGrade(grade).find((subject) => subject.value === value) || null;
  }
  function subjectFromName(grade, name) {
    const identity = Core.normalizeCourseIdentity(name).replace(/c$/, "");
    if (!identity) return null;
    if (grade === "고1") {
      if (identity === Core.normalizeCourseIdentity("공통수학1")) return HIGH1_SUBJECTS[0];
      if (identity === Core.normalizeCourseIdentity("공통수학2")) return HIGH1_SUBJECTS[1];
      return null;
    }
    if (grade === "고2" || grade === "고3") {
      const value = Core.highSemanticSubjectForCourseKey(identity);
      return value ? subjectByValue(grade, value) : null;
    }
    return null;
  }
  function unitsForGrade(grade) {
    const profile = UnitCore.PROFILES[GRADE_PROFILE[grade]];
    return profile ? profile.units : [];
  }
  function unitsForSubject(grade, subjectValue) {
    const subject = subjectByValue(grade, subjectValue);
    return subject ? unitsForGrade(grade).filter((unit) => unit.course === subject.course) : [];
  }

  // Second-tier crosswalk used only when UnitPastExamsCore leaves a record unclassified.
  // Exact, unambiguous source labels / legacy 2015 keys only; anything ambiguous stays in
  // the per-subject "단원 미분류" scope instead of being guessed.
  const norm = compact;
  const label = (unit, names) => Object.fromEntries(names.map((name) => [norm(name), unit]));
  const HIGH_SEMANTIC_LABELS = Object.freeze({
    ...label("H22-A-04", ["삼각함수", "삼각함수의 활용", "일반각과 호도법", "삼각함수의 그래프"]),
    ...label("H22-PS-01", ["순열과 조합"]),
    ...label("H22-PS-02", ["이항정리"]),
  });
  const SUPPLEMENTAL_LABELS = Object.freeze({
    h2: HIGH_SEMANTIC_LABELS,
    h3: HIGH_SEMANTIC_LABELS,
    h1: Object.freeze({
      ...label("H22-C-09", ["행렬", "행렬과 그 연산"]),
    }),
    m1: Object.freeze({
      ...label("M22-1-03", ["문자의 사용과 식의 계산"]),
    }),
    m2: Object.freeze({
      ...label("M22-2-05", ["일차함수와 그 그래프", "일차함수와 일차방정식", "일차함수와 일차방정식의 관계", "일차함수의 활용"]),
      ...label("M22-2-06", ["여러 가지 사각형", "사각형의 성질", "삼각형의 성질", "도형의 성질"]),
      ...label("M22-2-07", ["평행선 사이의 선분의 길이의 비"]),
      ...label("M22-2-09", ["확률과 그 기본 성질", "경우의 수"]),
    }),
    m3: Object.freeze({
      ...label("M22-3-01", ["실수와 그 연산", "근호를 포함한 식의 계산"]),
      ...label("M22-3-03", ["식의 계산과 이차방정식", "이차방정식의 풀이", "이차방정식의 활용"]),
      ...label("M22-3-04", ["이차함수", "이차함수와 그 그래프", "이차함수의 활용"]),
      ...label("M22-3-05", ["삼각비의 활용", "직각삼각형의 성질", "직각삼각형과 도형의 넓이"]),
      ...label("M22-3-06", ["원주각", "원의 접선", "정다각형과 원", "원과 직선", "다각형과 원", "원의 성질과 도형의 넓이"]),
      ...label("M22-3-07", ["대푯값과 산포도", "자료의 대표값", "자료의 산포도"]),
    }),
  });
  // Legacy 2015 기하와 벡터 unit codes. 06/07 (성분/내적 spanning two 2022 units) stay unclassified.
  const HIGH_SEMANTIC_KEYS = Object.freeze({
    "H15-GV-01": "H22-GE-01", "H15-GV-02": "H22-GE-01", "H15-GV-03": "H22-GE-01",
    "H15-GV-04": "H22-GE-02", "H15-GV-05": "H22-GE-05",
    "H15-GV-08": "H22-GE-03", "H15-GV-09": "H22-GE-04",
  });
  const SUPPLEMENTAL_KEYS = Object.freeze({ h2: HIGH_SEMANTIC_KEYS, h3: HIGH_SEMANTIC_KEYS });
  const SUPPLEMENTAL_KEY_PREFIXES = Object.freeze({
    m1: Object.freeze([["M1-2-GEOM-SOLID-", "M22-1-07"], ["M1-2-STAT-", "M22-1-08"]]),
  });

  // Classification of everything except per-question identity rules depends only on the
  // profile, legacy key and legacy label, so identical triples are classified once per page.
  const unitMemo = new Map();
  function unitFor(record, grade) {
    const pid = GRADE_PROFILE[grade];
    const profile = UnitCore.PROFILES[pid];
    const key = text(record.legacyStandardUnitKey);
    const unitLabel = text(record.legacyStandardUnit);
    const numbered = Number(record.sourceQuestionNo);
    const identityRecord = {
      sourceFile: record.sourceFile,
      id: Number.isInteger(numbered) && numbered > 0 ? numbered : Number(record.sourceOrdinal),
    };
    if (UnitCore.hasIdentityRule(identityRecord, pid))
      return computeUnit(record, grade, pid, profile, key, unitLabel);
    const memoKey = `${pid}\u0000${key}\u0000${unitLabel}`;
    if (!unitMemo.has(memoKey)) unitMemo.set(memoKey, computeUnit(record, grade, pid, profile, key, unitLabel));
    return unitMemo.get(memoKey);
  }
  function computeUnit(record, grade, pid, profile, key, unitLabel) {
    const numberedId = Number(record.sourceQuestionNo);
    const base = {
      sourceFile: record.sourceFile,
      id: Number.isInteger(numberedId) && numberedId > 0 ? numberedId : Number(record.sourceOrdinal),
      standardUnitKey: key,
      standardUnit: unitLabel,
    };
    const result = UnitCore.classifyRecord(base, pid);
    if (result.status === "classified") return { unitKey: result.unitKey, reason: result.reason };
    const known = new Set(profile.units.map((unit) => unit.key));
    const accept = (unitKey, reason) => (known.has(unitKey) ? { unitKey, reason } : null);
    // "HH15-SA-01" is "H15-SA-01" with a stray prefix character.
    if (/^HH15-/.test(key)) {
      const retry = UnitCore.classifyRecord({ ...base, standardUnitKey: key.slice(1) }, pid);
      if (retry.status === "classified") return { unitKey: retry.unitKey, reason: "crosswalk-key" };
    }
    const byKey = (SUPPLEMENTAL_KEYS[pid] || {})[key];
    if (byKey) return accept(byKey, "crosswalk-key");
    for (const [prefix, unitKey] of SUPPLEMENTAL_KEY_PREFIXES[pid] || [])
      if (key.startsWith(prefix)) return accept(unitKey, "crosswalk-key");
    const byLabel = (SUPPLEMENTAL_LABELS[pid] || {})[norm(unitLabel)];
    if (byLabel) return accept(byLabel, "crosswalk-label");
    return null;
  }

  const ROLLOUT_YEAR = Object.freeze({ 고1: 2025, 고2: 2026, 고3: 2027 });
  const HIGH_2015_SUBJECTS = /^(?:수학\(상\)|수학\(하\)|수학I|수학II|기하와벡터|미적분|미적분I|미적분II)$/;
  const HIGH_2022_ONLY_SUBJECTS = /^(?:공통수학1|공통수학2)$/;
  // Original curriculum is evidence about the SOURCE, never a key conversion. Order of evidence:
  // 1) a validated canonical curriculumKey, 2) the exam-year roll-out rule (2022 curriculum:
  // 중1 2025, 중2 2026, 중3 2027, 고1 2025, 고2 2026, 고3 2027), 3) the exam subject name, 4) a
  // curriculum-specific legacy key prefix. Legacy "H22-*" unit keys are a 2022-based unit
  // vocabulary that also tags 2015-era exams, so a key prefix alone is the weakest evidence.
  function originalCurriculum(record, grade) {
    const canonical = text(record.curriculumKey);
    if (canonical === "2015" || canonical === "2022") return { value: canonical, basis: "canonical-key" };
    const year = Number(record.year);
    if (isMiddle(grade)) {
      const value = Core.middleCurriculumFromYear(grade, year);
      if (value) return { value, basis: "middle-year-rule" };
    } else if (ROLLOUT_YEAR[grade] && Number.isInteger(year) && year >= 1900 && year <= 2100)
      return { value: year >= ROLLOUT_YEAR[grade] ? "2022" : "2015", basis: "high-year-rule" };
    const subject = Core.normalizeCourseIdentity(record.subject).replace(/c$/, "");
    if (HIGH_2015_SUBJECTS.test(subject)) return { value: "2015", basis: "subject-name" };
    if (HIGH_2022_ONLY_SUBJECTS.test(subject))
      return { value: "2022", basis: "subject-name" };
    const key = text(record.legacyStandardUnitKey);
    if (/^HH?15-|^H21-/.test(key)) return { value: "2015", basis: "key-prefix" };
    if (/^HH?22-/.test(key)) return { value: "2022", basis: "key-prefix" };
    return { value: "", basis: "unknown" };
  }

  function inferSubject(record, grade) {
    const subjects = subjectsForGrade(grade);
    if (subjects.length === 1) return subjects[0];
    for (const hint of [record.subject, record.courseKey, record.unverifiedTaxonomy?.courseKey, record.standardCourse]) {
      const subject = subjectFromName(grade, hint);
      if (subject) return subject;
    }
    if ((grade === "고2" || grade === "고3") && /^H15-GV-/.test(text(record.legacyStandardUnitKey)))
      return subjectByValue(grade, "GEOMETRY");
    return null;
  }

  function viewGradesFor(record, grade, projectionPolicy) {
    const views = [grade];
    if (grade === "고2" || grade === "고3") {
      const other = grade === "고2" ? "고3" : "고2";
      if (Core.browseGradeMatchesRecord(record, other, projectionPolicy)) views.push(other);
    }
    return views;
  }

  function classify(record, options = {}) {
    const grade = text(record?.effectiveBrowseGrade || record?.sourceGrade);
    if (!GRADE_PROFILE[grade])
      return { placed: false, reason: "GRADE_UNRESOLVED", grade: "" };
    const unit = unitFor(record, grade);
    const curriculum = originalCurriculum(record, grade);
    let subject, unitKey = "", unitLabel = UNCLASSIFIED_LABEL, unitOrder = 9999, unitReason = "";
    if (unit) {
      const row = unitsForGrade(grade).find((candidate) => candidate.key === unit.unitKey);
      subject = subjectByCourse(grade, row.course);
      unitKey = row.key;
      unitLabel = row.name;
      unitOrder = row.order;
      unitReason = unit.reason;
    } else {
      subject = inferSubject(record, grade);
      unitReason = "unclassified";
    }
    const entry = {
      record,
      uid: text(record.questionUid),
      grade,
      subject: subject ? subject.value : "",
      subjectLabel: subject ? subject.label : NO_SUBJECT_LABEL,
      unitKey,
      unitLabel,
      unitOrder,
      unclassified: !unit,
      reason: unitReason,
      originalCurriculum: curriculum.value,
      curriculumBasis: curriculum.basis,
      views: viewGradesFor(record, grade, options.projectionPolicy),
    };
    return { placed: true, entry };
  }

  function scopeKey(view, subjectValue, unitKey) {
    return `u:${view}:${subjectValue || "-"}:${unitKey || "UNCLASSIFIED"}`;
  }
  const isUnifiedScopeKey = (key) => /^u:(?:중[123]|고[123]):/.test(String(key || ""));

  function emptyStats() {
    return { total: 0, placed: 0, unitPlaced: 0, unclassifiedWithSubject: 0, unclassifiedNoSubject: 0, unplaced: 0, unplacedReasons: {} };
  }
  function buildIndex(records, options = {}) {
    const views = Object.fromEntries(GRADES.map((grade) => [grade, []]));
    const byRecord = new Map();
    const byUid = new Map();
    const stats = { overall: emptyStats(), byGrade: Object.fromEntries(GRADES.map((grade) => [grade, emptyStats()])) };
    const unplacedRecords = [];
    for (const record of records || []) {
      stats.overall.total++;
      const result = classify(record, options);
      if (!result.placed) {
        stats.overall.unplaced++;
        stats.overall.unplacedReasons[result.reason] = (stats.overall.unplacedReasons[result.reason] || 0) + 1;
        unplacedRecords.push(record);
        continue;
      }
      const entry = result.entry;
      byRecord.set(record, entry);
      if (entry.uid && !byUid.has(entry.uid)) byUid.set(entry.uid, entry);
      for (const view of entry.views) views[view].push(entry);
      for (const bucket of [stats.overall, stats.byGrade[entry.grade]]) {
        if (bucket !== stats.overall) bucket.total++;
        bucket.placed++;
        if (!entry.unclassified) bucket.unitPlaced++;
        else if (entry.subject) bucket.unclassifiedWithSubject++;
        else bucket.unclassifiedNoSubject++;
      }
    }
    return { policy: POLICY, views, byRecord, byUid, stats, unplacedRecords };
  }

  // Entries visible in a grade view, narrowed by the optional subject and original-curriculum
  // filters. The result is only a candidate list; callers still apply the usage gate and the
  // remaining detail filters (school, exam period, years, difficulty, source files).
  function candidates(index, filters = {}) {
    const rows = index.views[filters.grade] || [];
    const subject = text(filters.semanticSubject);
    const curriculum = text(filters.originalCurriculum);
    if (!subject && !curriculum) return rows;
    return rows.filter((entry) =>
      (!subject || entry.subject === subject) &&
      (!curriculum || entry.originalCurriculum === curriculum));
  }

  // Ordered group/unit skeleton for a grade view; used to sort scopes deterministically.
  function structure(grade) {
    const subjects = subjectsForGrade(grade);
    const groups = subjects.map((subject) => ({
      subject: subject.value,
      label: subject.label,
      units: unitsForSubject(grade, subject.value).map((unit) => ({ key: unit.key, label: unit.name, order: unit.order })),
    }));
    return groups;
  }

  function policyNotice() {
    return POLICY.description;
  }

  // ---- Shared selection helpers (compose and finder; also reusable by other consumers) ----
  // All unified subjects, grade independent (공통수학1/2 for 고1, the five 고2/고3 subjects).
  const ALL_SUBJECTS = Object.freeze([
    ...HIGH1_SUBJECTS.map(({ value, label }) => Object.freeze({ value, label })),
    ...Core.highSemanticSubjectOptions().map(({ value, label }) => Object.freeze({ value, label })),
  ]);
  // Subject choices for a finder filter: the grade's own list, or every unified subject while no
  // grade is chosen. 중1~중3 have a single subject, so no choice is offered.
  function subjectChoices(grade) {
    if (!grade) return ALL_SUBJECTS;
    if (isMiddle(grade)) return [];
    return subjectsForGrade(grade).map(({ value, label }) => ({ value, label }));
  }
  function isKnownSubject(grade, value) {
    const subject = text(value);
    if (!subject) return false;
    return grade ? Boolean(subjectByValue(grade, subject)) : ALL_SUBJECTS.some((row) => row.value === subject);
  }
  // Old "과목 계열" values (family) that name exactly one unified subject. The remaining legacy
  // families are not subjects and are simply dropped.
  const FAMILY_SUBJECT = Object.freeze({
    COMMON_1: "COMMON_MATH_1", COMMON_2: "COMMON_MATH_2", ALGEBRA: "ALGEBRA", CALCULUS: "CALCULUS",
    CALCULUS_ADVANCED: "CALCULUS_ADVANCED", PROB_STATS: "PROB_STATS", GEOMETRY: "GEOMETRY",
  });
  const subjectForFamily = (family) => FAMILY_SUBJECT[text(family)] || "";

  // Default subject for grades whose list would otherwise be long (고2/고3 have five subjects):
  // the subject with the most questions of that grade itself. Ties keep the curriculum order.
  const defaultSubjectCache = new WeakMap();
  function defaultSubject(index, grade) {
    if (grade !== "고2" && grade !== "고3") return "";
    let byGrade = defaultSubjectCache.get(index);
    if (!byGrade) defaultSubjectCache.set(index, (byGrade = new Map()));
    if (byGrade.has(grade)) return byGrade.get(grade);
    const counts = new Map();
    for (const entry of index.views[grade] || [])
      if (entry.grade === grade && entry.subject && !entry.unclassified)
        counts.set(entry.subject, (counts.get(entry.subject) || 0) + 1);
    let best = "", bestCount = 0;
    for (const subject of subjectsForGrade(grade))
      if ((counts.get(subject.value) || 0) > bestCount) {
        best = subject.value;
        bestCount = counts.get(subject.value);
      }
    byGrade.set(grade, best);
    return best;
  }

  // Unified subjects an exam covers, decided by the subjects of its questions' units (a 2015
  // 수학(상) exam with 도형의 방정식 questions covers 공통수학2 as well as 공통수학1). Built once
  // per index; exams without any placed question are absent and the caller falls back.
  const examSubjectCache = new WeakMap();
  function examSubjects(index) {
    if (examSubjectCache.has(index)) return examSubjectCache.get(index);
    const byFile = new Map();
    for (const entry of index.byRecord.values()) {
      if (!entry.subject) continue;
      const file = Core.normalizeFile(entry.record.sourceFile);
      let set = byFile.get(file);
      if (!set) byFile.set(file, (set = new Set()));
      set.add(entry.subject);
    }
    examSubjectCache.set(index, byFile);
    return byFile;
  }

  return {
    POLICY,
    GRADES,
    GRADE_PROFILE,
    UNCLASSIFIED_LABEL,
    NO_SUBJECT_LABEL,
    SUPPLEMENTAL_LABELS,
    SUPPLEMENTAL_KEYS,
    subjectsForGrade,
    subjectByValue,
    unitsForGrade,
    unitsForSubject,
    classify,
    originalCurriculum,
    buildIndex,
    candidates,
    structure,
    ALL_SUBJECTS,
    subjectChoices,
    isKnownSubject,
    subjectForFamily,
    defaultSubject,
    examSubjects,
    scopeKey,
    isUnifiedScopeKey,
    policyNotice,
  };
});
