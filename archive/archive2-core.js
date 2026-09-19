(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("./mixer-selector.js")
      : root.ArchiveMixerSelector,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Core = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (selector) {
  "use strict";
  const VERSION = "archive2-v1";
  const TAXONOMY_VERSION = "rpm-primary-v1.0";
  const UID = /^qid_v1_[a-f0-9]{64}$/;
  const PATH_FIELDS = ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4"];
  const META_FIELDS = [
    ...PATH_FIELDS,
    "secondaryConceptKeys",
    "curriculumApplicability",
    "defaultSelectable",
    "difficultyBucket",
    "difficultyConfidence",
    "difficultyBoundaryFlag",
    "legacyLevelCompatibility",
    "tagConfidence",
    "tagStatus",
    "reviewStatus",
    "metadataRevision",
  ];
  const text = (value) => String(value ?? "").trim();
  const pathKey = (record, depth = 6) =>
    JSON.stringify(PATH_FIELDS.slice(0, depth).map((k) => text(record[k])));
  const normalizeFile = (value) =>
    text(value)
      .normalize("NFC")
      .replace(/\\/g, "/")
      .replace(/[?#].*$/, "")
      .replace(/^\/?(?:archive\/)?exams\//, "")
      .replace(/^\/+/, "");
  const normalizeSearch = (value) =>
    text(value)
      .normalize("NFC")
      .toLowerCase()
      .replace(/고등학교/g, "고")
      .replace(/중학교/g, "중")
      .replace(/확통/g, "확률과통계")
      .replace(/(\d)학기\s*기말/g, "$1기말")
      .replace(/(\d)학기\s*중간/g, "$1중간")
      .replace(/\s+/g, "");
  const gradeRank = (grade) =>
    ({ 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6 })[grade] || 0;
  const normalizeCourseIdentity = (value) =>
    text(value)
      .normalize("NFC")
      .replace(/Ⅰ/g, "I")
      .replace(/Ⅱ/g, "II")
      .replace(/\s+/g, "");
  const HIGH_SEMANTIC_SUBJECTS = Object.freeze([
    Object.freeze({ value: "ALGEBRA", label: "대수", grades: Object.freeze(["고2"]), courseKeys: Object.freeze(["대수", "수학I"]) }),
    Object.freeze({ value: "CALCULUS", label: "미적분Ⅰ", grades: Object.freeze(["고2"]), courseKeys: Object.freeze(["미적분I", "수학II"]) }),
    Object.freeze({ value: "PROB_STATS", label: "확률과 통계", grades: Object.freeze(["고2"]), courseKeys: Object.freeze(["확률과통계"]) }),
    Object.freeze({ value: "CALCULUS_ADVANCED", label: "미적분Ⅱ", grades: Object.freeze(["고3"]), courseKeys: Object.freeze(["미적분II", "미적분"]) }),
    Object.freeze({ value: "GEOMETRY", label: "기하", grades: Object.freeze(["고3"]), courseKeys: Object.freeze(["기하", "기하와 벡터"]) }),
  ]);
  const isHighSemanticSubjectGrade = (grade) =>
    ["고2", "고3"].includes(text(grade));
  const highSemanticSubjectAllowed = (grade, subjectValue) => {
    const subject = HIGH_SEMANTIC_SUBJECTS.find(
      (item) => item.value === text(subjectValue),
    );
    return Boolean(
      subject &&
        (!isHighSemanticSubjectGrade(grade) ||
          subject.grades.includes(text(grade))),
    );
  };
  const highSemanticSubjectOptions = (grade = "") =>
    HIGH_SEMANTIC_SUBJECTS.filter(
      (subject) =>
        !isHighSemanticSubjectGrade(grade) ||
        subject.grades.includes(text(grade)),
    ).map(({ value, label }) => ({ value, label }));
  const highSemanticSubjectForCourseKey = (courseKey) => {
    const identity = normalizeCourseIdentity(courseKey);
    return (
      HIGH_SEMANTIC_SUBJECTS.find((subject) =>
        subject.courseKeys.some(
          (key) => normalizeCourseIdentity(key) === identity,
        ),
      )?.value || ""
    );
  };
  const highSemanticSubjectCourseKeys = (subjectValue) => {
    const subject = HIGH_SEMANTIC_SUBJECTS.find(
      (item) => item.value === text(subjectValue),
    );
    return new Set(
      (subject?.courseKeys || []).map((key) => normalizeCourseIdentity(key)),
    );
  };
  const finderCourseGrades = Object.freeze({
    공통수학1: "고1",
    공통수학2: "고1",
    "수학(상)": "고1",
    "수학(하)": "고1",
    대수: "고2",
    수학I: "고2",
    "확률과통계": "고2",
    미적분: "고3",
    미적분I: "고3",
    미적분II: "고3",
    수학II: "고3",
    기하: "고3",
    "기하와 벡터": "고3",
  });
  const finderCourseGrade = (courseKey, curriculumKey = "") => {
    const middle = text(courseKey).match(/^M([123])-[12]$/);
    if (middle) return `중${middle[1]}`;
    if (
      text(curriculumKey) === "2015" &&
      normalizeCourseIdentity(courseKey) === "수학II"
    )
      return "고2";
    return finderCourseGrades[courseKey] || "";
  };
  const middleCourseRange = (range) => {
    const startKey = text(range?.rangeStartUnitKey),
      endKey = text(range?.rangeEndUnitKey),
      unitKeys = [startKey, endKey].filter(Boolean),
      base = text(range?.courseCode).match(/^M([123])$/)?.[0] ||
        unitKeys.map((key) => key.match(/^(M[123])-\d{1,2}$/)?.[1]).find(Boolean),
      numbers = unitKeys
        .map((key) => key.match(new RegExp(`^${base || "M[123]"}-(\\d{1,2})$`))?.[1])
        .filter(Boolean)
        .map(Number);
    if (!base || !numbers.length) return [];
    const first = Math.min(...numbers), last = Math.max(...numbers);
    return [1, 2]
      .filter((semester) => {
        const start = semester === 1 ? 1 : 5,
          end = semester === 1 ? 4 : 8;
        return first <= end && last >= start;
      })
      .map((semester) => `${base}-${semester}`);
  };
  const middleCurriculumRolloutYear = Object.freeze({
    중1: 2025,
    중2: 2026,
    중3: 2027,
  });
  function middleCurriculumFromYear(grade, year) {
    const rolloutYear = middleCurriculumRolloutYear[text(grade)],
      sourceYearValue = Number(year);
    if (
      !rolloutYear ||
      !Number.isInteger(sourceYearValue) ||
      sourceYearValue < 1900 ||
      sourceYearValue > 2100
    )
      return "";
    return sourceYearValue >= rolloutYear ? "2022" : "2015";
  }
  function finderCourseKeys(taxonomy, filters = {}) {
    return new Set(
      (taxonomy || [])
        .filter(
          (row) =>
            (!filters.grade || finderCourseGrade(row.courseKey, row.curriculumKey) === filters.grade) &&
            (!filters.curriculumKey || row.curriculumKey === filters.curriculumKey),
        )
        .map((row) => row.courseKey)
        .filter(Boolean),
    );
  }
  function reconcileFinderFilters(filters = {}, taxonomy = []) {
    const next = { ...filters };
    if (isHighSemanticSubjectGrade(next.grade)) {
      if (
        !next.semanticSubject &&
        HIGH_SEMANTIC_SUBJECTS.some(
          (subject) => subject.value === next.family,
        )
      )
        next.semanticSubject = next.family;
      if (!next.semanticSubject && next.courseKey) {
        next.semanticSubject = highSemanticSubjectForCourseKey(next.courseKey);
      }
      if (
        next.semanticSubject &&
        !highSemanticSubjectAllowed(next.grade, next.semanticSubject)
      )
        next.semanticSubject = "";
      if (next.semanticSubject) {
        next.courseKey = "";
        next.family = "";
      }
    } else {
      next.semanticSubject = "";
      if (next.courseKey && !finderCourseKeys(taxonomy, next).has(next.courseKey))
        next.courseKey = "";
    }
    return next;
  }
  function finderCourseCodeCurriculum(courseCode) {
    const match = text(courseCode).match(/^H(15|22)(?:-|$)/);
    return match ? `20${match[1]}` : "";
  }
  function buildFinderIndex(catalog = {}) {
    const taxonomy = Array.isArray(catalog.taxonomy) ? catalog.taxonomy : [],
      canonicalByIdentity = new Map(),
      curriculaByCourse = new Map(),
      recordsByFile = new Map();
    for (const row of taxonomy) {
      const key = text(row.courseKey),
        identity = normalizeCourseIdentity(key);
      if (!key) continue;
      if (!canonicalByIdentity.has(identity))
        canonicalByIdentity.set(identity, new Set());
      canonicalByIdentity.get(identity).add(key);
      if (!curriculaByCourse.has(key)) curriculaByCourse.set(key, new Set());
      if (row.curriculumKey)
        curriculaByCourse.get(key).add(row.curriculumKey);
    }
    for (const record of catalog.records || []) {
      const file = normalizeFile(record.sourceFile);
      if (!recordsByFile.has(file)) recordsByFile.set(file, []);
      recordsByFile.get(file).push(record);
    }
    const byFile = new Map();
    for (const exam of catalog.exams || []) {
      const file = normalizeFile(exam.file),
        courseKeys = new Set(),
        curriculumKeys = new Set(exam.curriculums || []);
      for (const record of recordsByFile.get(file) || []) {
        if (record.courseKey) courseKeys.add(record.courseKey);
        if (record.curriculumKey) curriculumKeys.add(record.curriculumKey);
      }
      let hasNeutralMiddleRange = false;
      for (const range of exam.courseRanges || []) {
        if (/^M[123]$/.test(text(range.courseCode)))
          hasNeutralMiddleRange = true;
        const middleKeys = middleCourseRange(range).filter((key) =>
          curriculaByCourse.has(key),
        );
        if (middleKeys.length) {
          middleKeys.forEach((key) => courseKeys.add(key));
          continue;
        }
        // The current catalog has no canonical courseKey on courseRanges for
        // high-school rows. Resolve the range's display label to the matching
        // taxonomy identity here; Finder filters compare that identity set,
        // never the display label directly.
        const identity = normalizeCourseIdentity(range.standardCourse),
          candidates = canonicalByIdentity.get(identity) || [];
        for (const key of candidates) courseKeys.add(key);
        const curriculum = finderCourseCodeCurriculum(range.courseCode);
        if (curriculum && candidates.size)
          curriculumKeys.add(curriculum);
      }
      if (!curriculumKeys.size && hasNeutralMiddleRange) {
        const curriculum = middleCurriculumFromYear(
          exam.effectiveBrowseGrade || exam.grade,
          exam.year,
        );
        if (curriculum) curriculumKeys.add(curriculum);
      }
      byFile.set(file, { courseKeys, curriculumKeys });
    }
    return byFile;
  }
  function finderMatches(exam, filters = {}, index = new Map()) {
    const identity = index.get(normalizeFile(exam?.file));
    const semanticMatch =
      !filters.semanticSubject ||
      [...(identity?.courseKeys || [])].some(
        (courseKey) =>
          highSemanticSubjectForCourseKey(courseKey) ===
          filters.semanticSubject,
      );
    return (
      (!filters.curriculumKey ||
        identity?.curriculumKeys?.has(filters.curriculumKey)) &&
      (!filters.courseKey || identity?.courseKeys?.has(filters.courseKey)) &&
      semanticMatch
    );
  }
  const sourceYear = (record) => {
    const year = Number(record.year);
    return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : 0;
  };
  const compareNewest = (a, b) => sourceYear(b) - sourceYear(a);
  function taxonomyPaths(master) {
    const paths = [];
    for (const row of master.records || [])
      for (const concept of row.concepts || [])
        for (const type of concept.problemTypes || []) {
          // Canonical pack filesystem scope aliases; never a legacy unit-depth mapping.
          const courseKey =
            { 수학_상: "수학(상)", 수학_하: "수학(하)" }[row.scope] ||
            row.scope;
          paths.push({
            curriculumKey: row.curriculum,
            courseKey,
            L1: row.majorUnit,
            L2: row.midUnit,
            L3: concept.concept,
            L4: type.problemType,
            curriculumApplicability:
              type.curriculumApplicability ||
              concept.curriculumApplicability ||
              row.curriculumApplicability,
            defaultSelectable:
              type.defaultSelectable ??
              concept.defaultSelectable ??
              row.defaultSelectable,
          });
        }
    return paths;
  }
  function eligibility(record, options = {}) {
    const reasons = [];
    if (
      !UID.test(record.questionUid || "") ||
      record.identityStatus !== "VERIFIED"
    )
      reasons.push("identity");
    if (record.sourceStatus !== "VERIFIED") reasons.push("source");
    if (record.taxonomyStatus !== "CONFIRMED") reasons.push("taxonomy");
    if (record.gradeConflict) reasons.push("grade");
    if (record.reviewStatus !== "reviewed_pass") reasons.push("review");
    if (
      !Number.isInteger(record.difficultyBucket) ||
      record.difficultyBucket < 1 ||
      record.difficultyBucket > 5 ||
      !["high", "medium", "low"].includes(record.difficultyConfidence) ||
      !["NONE", "B12", "B23", "B34", "B45"].includes(
        record.difficultyBoundaryFlag,
      ) ||
      !["NORMAL", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT"].includes(
        record.legacyLevelCompatibility,
      )
    )
      reasons.push("difficulty");
    if (
      !(
        record.curriculumApplicability === "DEFAULT_SCOPE" &&
        record.defaultSelectable === true
      ) &&
      !(
        options.includeExtended &&
        record.curriculumApplicability === "RPM_EXTENDED"
      )
    )
      reasons.push("applicability");
    if (record.metadataConflicts?.length) reasons.push("conflict");
    return { ok: reasons.length === 0, reasons };
  }
  function matches(record, filters = {}) {
    if (
      filters.primaryPaths?.length &&
      !filters.primaryPaths.includes(pathKey(record, 4))
    )
      return false;
    if (filters.grade && record.effectiveBrowseGrade !== filters.grade)
      return false;
    if (
      filters.sourceFiles?.length &&
      !filters.sourceFiles.includes(record.sourceFile)
    )
      return false;
    if (filters.school && record.school !== filters.school) return false;
    if (filters.yearFrom && sourceYear(record) < Number(filters.yearFrom))
      return false;
    if (filters.yearTo && (!sourceYear(record) || sourceYear(record) > Number(filters.yearTo)))
      return false;
    if (filters.axis && record.examAxis !== filters.axis) return false;
    if (
      filters.semanticSubject &&
      highSemanticSubjectForCourseKey(record.courseKey) !==
        filters.semanticSubject
    )
      return false;
    if (filters.family && !record.courseFamilies?.includes(filters.family))
      return false;
    for (const field of PATH_FIELDS) {
      if (field === "courseKey" && filters.semanticSubject) continue;
      if (filters[field] && record[field] !== filters[field]) return false;
    }
    if (
      filters.difficultyBuckets?.length &&
      !filters.difficultyBuckets.includes(record.difficultyBucket)
    )
      return false;
    if (
      filters.query &&
      !normalizeSearch(
        [
          record.school,
          record.year,
          record.courseKey,
          record.L1,
          record.L2,
          record.L3,
          record.L4,
          record.subject,
          record.topic,
          record.sourceFile,
          record.examAxis?.replace("-final", "기말").replace("-mid", "중간"),
        ].join(" "),
      ).includes(normalizeSearch(filters.query))
    )
      return false;
    return true;
  }
  function composeExclusions(context = {}) {
    const sets = {};
    const union = new Set();
    for (const name of ["current", "series", "student", "manual", "quality"]) {
      sets[name] = new Set(context[name] || []);
      sets[name].forEach((uid) => union.add(uid));
    }
    return { sets, union };
  }
  function rowMatches(record, row) {
    const pathsMatch = row.paths?.length
      ? row.paths.includes(pathKey(record, row.depth || 4))
      : !row.path || pathKey(record, row.depth || 4) === row.path;
    return (
      pathsMatch &&
      (!row.difficultyBuckets?.length ||
        row.difficultyBuckets.includes(record.difficultyBucket))
    );
  }
  function validatePlan(request) {
    const errors = [];
    if (!request.filters?.grade) errors.push("학년을 선택하세요.");
    for (const key of ["yearFrom", "yearTo"])
      if (
        request.filters?.[key] &&
        (!Number.isInteger(Number(request.filters[key])) ||
          Number(request.filters[key]) < 1900 ||
          Number(request.filters[key]) > 2100)
      )
        errors.push("연도는 1900~2100 사이 정수여야 합니다.");
    if (
      request.filters?.yearFrom &&
      request.filters?.yearTo &&
      Number(request.filters.yearFrom) > Number(request.filters.yearTo)
    )
      errors.push("시작 연도는 끝 연도보다 늦을 수 없습니다.");
    if (!Array.isArray(request.rows) || !request.rows.length)
      errors.push("출제 범위를 추가하세요.");
    const rowIds = new Set();
    for (const row of request.rows || []) {
      if (!text(row.id) || rowIds.has(row.id))
        errors.push("출제 조건 ID가 중복되거나 없습니다.");
      rowIds.add(row.id);
      if (!Number.isInteger(row.count) || row.count < 1 || row.count > 400)
        errors.push("문항 수는 1~400 사이 정수여야 합니다.");
    }
    if ((request.rows || []).reduce((n, r) => n + r.count, 0) > 400)
      errors.push("한 회차는 최대 400문항입니다.");
    if (
      request.targetStudentIds?.length &&
      request.historyMode !== "off" &&
      request.historyReady !== true
    )
      errors.push("선택 학생의 출제 이력을 먼저 확인해야 합니다.");
    return errors;
  }
  function selectBlueprint(records, request, context = {}) {
    const started = Date.now();
    const errors = validatePlan(request);
    const exclusions = composeExclusions(context);
    const reasons = {};
    const used = new Set();
    const candidates = records.filter((record) => {
      if (!matches(record, request.filters)) return false;
      const gate = eligibility(record, request);
      gate.reasons.forEach((reason) => {
        reasons[reason] = (reasons[reason] || 0) + 1;
      });
      for (const [name, set] of Object.entries(exclusions.sets))
        if (set.has(record.questionUid))
          reasons[name] = (reasons[name] || 0) + 1;
      return gate.ok && !exclusions.union.has(record.questionUid);
    });
    const byUid = new Map(
      candidates.map((record) => [record.questionUid, record]),
    );
    if (byUid.size !== candidates.length) errors.push("후보 UID가 중복됩니다.");
    const selected = [];
    const rows = request.rows || [];
    const rowResults = rows.map((row) => ({
      id: row.id,
      requested: row.count,
      available: candidates.filter((r) => rowMatches(r, row)).length,
      selected: 0,
    }));
    for (const pin of request.pins || []) {
      const record = byUid.get(pin.questionUid);
      const row = rows.find((r) => r.id === pin.rowId);
      if (
        !record ||
        !row ||
        !rowMatches(record, row) ||
        used.has(pin.questionUid)
      ) {
        errors.push("고정 문항이 현재 범위·이력 조건과 충돌합니다.");
        continue;
      }
      const result = rowResults.find((r) => r.id === row.id);
      if (result.selected >= row.count) {
        errors.push("고정 문항 수가 문항 수 설정보다 많습니다.");
        continue;
      }
      selected.push({ ...record, rowId: row.id });
      used.add(record.questionUid);
      result.selected++;
    }
    // Constrained rows go first; each UID is consumed at most once across rows.
    for (const row of [...rows].sort(
      (a, b) =>
        rowResults.find((r) => r.id === a.id).available -
        rowResults.find((r) => r.id === b.id).available,
    )) {
      const result = rowResults.find((r) => r.id === row.id);
      const count = row.count - result.selected;
      if (count <= 0 || errors.length) continue;
      const pool = candidates.filter(
        (record) => !used.has(record.questionUid) && rowMatches(record, row),
      );
      // Recency is a priority after hard scope/quality/history gates. Preserve
      // the existing seeded selection within each year; unknown years go last.
      for (const year of [...new Set(pool.map(sourceYear))].sort((a, b) => b - a)) {
        const remaining = row.count - result.selected;
        if (!remaining) break;
        const selection = selector.selectCandidates(
          pool.filter((record) => sourceYear(record) === year),
          { count: remaining },
          { selectionSeed: request.seed || VERSION },
        );
        for (const record of selection.selected) {
          selected.push({ ...record, rowId: row.id });
          used.add(record.questionUid);
          result.selected++;
        }
      }
    }
    selected.sort(
      (a, b) =>
        rows.findIndex((r) => r.id === a.rowId) -
        rows.findIndex((r) => r.id === b.rowId) || compareNewest(a, b),
    );
    const shortages = rowResults
      .filter((r) => r.selected < r.requested)
      .map((r) => ({ ...r, shortage: r.requested - r.selected }));
    return {
      ok: !errors.length && !shortages.length,
      selected,
      errors,
      shortages,
      rowResults,
      diagnostics: {
        eligibleCount: candidates.length,
        selectedCount: selected.length,
        excludedByReason: reasons,
        elapsedMs: Date.now() - started,
      },
      seed: request.seed,
      selectorVersion: VERSION,
    };
  }
  function review(selected, request, context = {}) {
    const hardFailures = validatePlan(request);
    const warnings = [];
    const exclusions = composeExclusions(context).union;
    const seen = new Set();
    for (const record of selected) {
      if (seen.has(record.questionUid)) hardFailures.push("중복 UID");
      seen.add(record.questionUid);
      if (!eligibility(record, request).ok || !matches(record, request.filters))
        hardFailures.push("문항의 승인·범위 조건이 일치하지 않습니다.");
      if (exclusions.has(record.questionUid))
        hardFailures.push("학생·시리즈·수동 제외 이력과 중복됩니다.");
      const row = request.rows.find((r) => r.id === record.rowId);
      if (!row || !rowMatches(record, row))
        hardFailures.push("출제 조건과 문항이 일치하지 않습니다.");
    }
    for (const row of request.rows || [])
      if (selected.filter((r) => r.rowId === row.id).length !== row.count)
        hardFailures.push("요청한 문항 수가 충족되지 않았습니다.");
    if (selected.some((r) => r.curriculumApplicability === "RPM_EXTENDED"))
      warnings.push("검수된 확장 유형을 포함합니다.");
    if (
      (context.coverage?.legacy_inferred || 0) +
        (context.coverage?.unresolved || 0) >
      0
    )
      warnings.push(
        "추정·미복원 과거 이력이 있습니다. 전체 과거 중복 방지를 보장하지 않습니다.",
      );
    const schools = new Set(selected.map((r) => r.school));
    if (selected.length >= 10 && schools.size === 1)
      warnings.push("한 학교의 문항으로 선택했습니다.");
    return {
      status: hardFailures.length
        ? "HARD_BLOCK"
        : warnings.length
          ? "WARN"
          : "PASS",
      hardFailures: [...new Set(hardFailures)],
      warnings,
      metrics: {
        count: selected.length,
        uniqueUidCount: seen.size,
        schoolCount: schools.size,
        sourceCount: new Set(selected.map((r) => r.sourceFile)).size,
      },
    };
  }
  function decodeCatalog(data) {
    if (data.encoding !== "column-dictionary-v1") return data;
    const decode = (value) =>
      Array.isArray(value) && value.length === 1 && Number.isInteger(value[0])
        ? data.strings[value[0]]
        : value;
    return {
      ...data,
      records: data.records.map((row) =>
        Object.fromEntries(
          data.columns
            .map((column, i) => [column, decode(row[i])])
            .filter(([, value]) => value !== null),
        ),
      ),
    };
  }
  return {
    VERSION,
    TAXONOMY_VERSION,
    UID,
    PATH_FIELDS,
    META_FIELDS,
    pathKey,
    normalizeFile,
    normalizeSearch,
    gradeRank,
    normalizeCourseIdentity,
    HIGH_SEMANTIC_SUBJECTS,
    isHighSemanticSubjectGrade,
    highSemanticSubjectAllowed,
    highSemanticSubjectOptions,
    highSemanticSubjectForCourseKey,
    highSemanticSubjectCourseKeys,
    finderCourseGrade,
    middleCurriculumFromYear,
    finderCourseKeys,
    reconcileFinderFilters,
    buildFinderIndex,
    finderMatches,
    sourceYear,
    compareNewest,
    taxonomyPaths,
    eligibility,
    matches,
    composeExclusions,
    rowMatches,
    validatePlan,
    selectBlueprint,
    review,
    decodeCatalog,
  };
});
