(function (root, factory) {
  const api = factory(
    typeof module === "object" && module.exports
      ? require("./mixer-selector.js")
      : root.ArchiveMixerSelector,
    typeof module === "object" && module.exports
      ? require("./archive2-canonical.js")
      : root.Archive2Canonical,
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Core = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (selector, canonical) {
  "use strict";
  const VERSION = "archive2-v1";
  const TAXONOMY_VERSION = "rpm-primary-v1.0";
  const UID = /^qid_v1_[a-f0-9]{64}$/;
  const PATH_FIELDS = ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4"];
  const OPTIONAL_METADATA_FIELDS = Object.freeze([
    "L3", "L4", "secondaryConceptKeys", "problemTypeKey", "templateKey", "crossConceptKeys",
    "conditionKeys", "integrationPattern", "foundationTaxonomy", "foundationTaxonomyStatus",
    "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility",
    "tagConfidence", "tagStatus", "reviewStatus", "metadataRevision", "defaultSelectable",
  ]);
  const META_FIELDS = [
    ...PATH_FIELDS,
    "secondaryConceptKeys",
    "problemTypeKey",
    "templateKey",
    "crossConceptKeys",
    "conditionKeys",
    "integrationPattern",
    "foundationTaxonomyStatus",
    "rpmPathStatus",
    "metaFoundationHoldReason",
    "metaFoundationPackVersion",
    "curriculumApplicability",
    "defaultSelectable",
    "difficultyBucket",
    "difficultyConfidence",
    "difficultyBoundaryFlag",
    "legacyLevelCompatibility",
    "tagConfidence",
    "tagStatus",
    "reviewStatus",
    "sourceQualityDisposition",
    "sourceIssueHold",
    "sourceDefectCandidate",
    "basicSemanticDisposition",
    "semanticDisposition",
    "metadataRevision",
  ];
  const text = (value) => String(value ?? "").trim();
  const pathKey = (record, depth = 6) =>
    JSON.stringify(PATH_FIELDS.slice(0, depth).map((k) => text(record[k])));
  function basicScopeParent(record, links = [], authority = null) {
    if (!authority || !canonical?.validateBasicAssignment) return null;
    const result = canonical.validateBasicAssignment(record, authority);
    return result.ok ? result.parent : null;
  }
  const advancedAuthority = (record) =>
    record.metaFoundationPackVersion && record.problemTypeKey && record.templateKey
      ? "mf" : "rpm";
  const advancedFilterValue = (record, level) => {
    const authority = advancedAuthority(record);
    const key = authority === "mf"
      ? record[level === 3 ? "problemTypeKey" : "templateKey"]
      : record[level === 3 ? "L3" : "L4"];
    return key ? `${authority}:${key}` : "";
  };
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
    Object.freeze({ value: "ALGEBRA", label: "대수", courseKeys: Object.freeze(["대수", "수학I"]) }),
    Object.freeze({ value: "CALCULUS", label: "미적분Ⅰ", courseKeys: Object.freeze(["미적분I", "수학II"]) }),
    Object.freeze({ value: "PROB_STATS", label: "확률과 통계", courseKeys: Object.freeze(["확률과통계"]) }),
    Object.freeze({ value: "CALCULUS_ADVANCED", label: "미적분Ⅱ", courseKeys: Object.freeze(["미적분II", "미적분"]) }),
    Object.freeze({ value: "GEOMETRY", label: "기하", courseKeys: Object.freeze(["기하", "기하와 벡터"]) }),
  ]);
  const isHighSemanticSubjectGrade = (grade) =>
    ["고2", "고3"].includes(text(grade));
  const highSemanticSubjectOptions = () =>
    HIGH_SEMANTIC_SUBJECTS.map(({ value, label }) => ({ value, label }));
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
  const HIGH1_SUBJECT_PROJECTIONS = Object.freeze([
    Object.freeze({ value: "COMMON_MATH_1", label: "공통수학1" }),
    Object.freeze({ value: "COMMON_MATH_2", label: "공통수학2" }),
    Object.freeze({ value: "H1_2015_MATH_UP", label: "수학(상)" }),
    Object.freeze({ value: "H1_2015_MATH_DOWN", label: "수학(하)" }),
  ]);
  const hasSubjectProjection = (grade) =>
    ["고1", "고2", "고3"].includes(text(grade));
  const subjectProjectionOptions = (grade) => {
    if (text(grade) === "고1")
      return HIGH1_SUBJECT_PROJECTIONS.map(({ value, label }) => ({ value, label }));
    if (isHighSemanticSubjectGrade(grade)) return highSemanticSubjectOptions();
    return [];
  };
  // resolveSubjectProjection is a pure function of the policy and five record
  // fields, but compose evaluates it for every catalog record several times
  // per render (~25k records, multi-second for 고2/고3). Memoize per policy
  // object by the exact resolver inputs. The cache is dropped when the policy
  // arrays the resolver reads are replaced or resized, and resolver outputs are
  // never altered.
  const subjectProjectionCaches = new WeakMap();
  function subjectProjectionCacheFor(policy) {
    if (!policy || typeof policy !== "object") return null;
    const arrays = [
      policy.gradeCourseAllowlist,
      policy.allowedGradeCourses,
      policy.high1CompatibilityProjections,
      policy.high23SharedSubjects,
    ];
    const signature = [policy.canonicalMasterSha256, canonical, ...arrays,
      ...arrays.map((rows) => (Array.isArray(rows) ? rows.length : -1))];
    let entry = subjectProjectionCaches.get(policy);
    if (entry && entry.signature.length === signature.length &&
        entry.signature.every((value, index) => value === signature[index]))
      return entry.values;
    entry = { signature, values: new Map() };
    subjectProjectionCaches.set(policy, entry);
    return entry.values;
  }
  function resolveSubjectProjectionCached(record, policy) {
    const resolve = canonical?.resolveSubjectProjection;
    if (!resolve) return "";
    const cache = subjectProjectionCacheFor(policy);
    if (!cache) return resolve(record, policy) || "";
    const key = `${record.sourceGrade ?? ""}\u0000${record.curriculumKey ?? ""}\u0000${
      record.courseKey ?? ""}\u0000${record.standardUnitKey ?? ""}\u0000${
      record.legacyStandardUnitKey ?? ""}`;
    let value = cache.get(key);
    if (value === undefined) {
      value = resolve(record, policy) || "";
      cache.set(key, value);
    }
    return value;
  }
  function subjectProjectionForRecord(record = {}, grade = "", projectionPolicy = null) {
    const sourceGrade = text(record.sourceGrade);
    if (!sourceGrade || (grade && text(grade) !== sourceGrade)) return "";
    return resolveSubjectProjectionCached(
      record,
      projectionPolicy || record.projectionPolicy || null,
    );
  }
  function browseGradeMatchesRecord(record = {}, grade = "", projectionPolicy = null) {
    const sourceGrade = text(record.sourceGrade),
      browseGrade = text(grade);
    if (!browseGrade || sourceGrade === browseGrade) return true;
    return isHighSemanticSubjectGrade(sourceGrade) &&
      isHighSemanticSubjectGrade(browseGrade) &&
      Boolean(subjectProjectionForRecord(record, "", projectionPolicy));
  }
  function subjectProjectionLabel(filters = {}) {
    const grade = text(filters.grade);
    if (!hasSubjectProjection(grade)) return text(filters.courseKey);
    if (!filters.semanticSubject) return "";
    return (
      subjectProjectionOptions(grade).find(
        (item) => item.value === text(filters.semanticSubject),
      )?.label || ""
    );
  }
  function subjectProjectionMatches(record, filters = {}, projectionPolicy = null) {
    if (!filters.semanticSubject) return true;
    if (!hasSubjectProjection(filters.grade)) return false;
    const grade = isHighSemanticSubjectGrade(filters.grade) &&
      isHighSemanticSubjectGrade(record.sourceGrade) ? "" : filters.grade;
    return (
      subjectProjectionForRecord(record, grade, projectionPolicy) ===
      text(filters.semanticSubject)
    );
  }
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
    const next = { ...filters },
      grade = text(next.grade);
    if (isHighSemanticSubjectGrade(grade)) {
      if (
        !next.semanticSubject &&
        HIGH_SEMANTIC_SUBJECTS.some(
          (subject) => subject.value === next.family,
        )
      )
        next.semanticSubject = next.family;
      if (!next.semanticSubject && next.courseKey)
        next.semanticSubject = highSemanticSubjectForCourseKey(next.courseKey);
      if (
        next.semanticSubject &&
        !HIGH_SEMANTIC_SUBJECTS.some(
          (subject) => subject.value === next.semanticSubject,
        )
      )
        next.semanticSubject = "";
      if (next.semanticSubject) next.courseKey = "";
      next.family = "";
    } else if (grade === "고1") {
      if (!next.semanticSubject && next.courseKey) {
        const courseIdentity = normalizeCourseIdentity(next.courseKey);
        if (courseIdentity === normalizeCourseIdentity("공통수학1"))
          next.semanticSubject = "COMMON_MATH_1";
        else if (courseIdentity === normalizeCourseIdentity("공통수학2"))
          next.semanticSubject = "COMMON_MATH_2";
      }
      if (
        next.semanticSubject &&
        !HIGH1_SUBJECT_PROJECTIONS.some(
          (subject) => subject.value === next.semanticSubject,
        )
      )
        next.semanticSubject = "";
      next.family = "";
      if (next.semanticSubject) next.courseKey = "";
      else if (next.courseKey) {
        const identity = normalizeCourseIdentity(next.courseKey);
        if (
          identity === normalizeCourseIdentity("수학(상)") ||
          identity === normalizeCourseIdentity("수학(하)") ||
          !finderCourseKeys(taxonomy, next).has(next.courseKey)
        )
          next.courseKey = "";
      }
    } else {
      next.semanticSubject = "";
      if (/^중[123]$/.test(grade)) next.family = "";
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
      let hasExplicitRecordCurriculum = false;
      const file = normalizeFile(exam.file),
        courseKeys = new Set(),
        curriculumKeys = new Set(exam.curriculums || []),
        sourceGrades = new Set(),
        subjectProjections = new Set(),
        subjectCurriculumPairs = new Set();
      for (const record of recordsByFile.get(file) || []) {
        if (text(record.sourceGrade)) sourceGrades.add(text(record.sourceGrade));
        if (record.courseKey) courseKeys.add(record.courseKey);
        if (record.curriculumKey) {
          curriculumKeys.add(record.curriculumKey);
          hasExplicitRecordCurriculum = true;
        }
        const subjectProjection = subjectProjectionForRecord(record, "", catalog.projectionPolicy);
        if (subjectProjection) {
          subjectProjections.add(subjectProjection);
          if (record.curriculumKey)
            subjectCurriculumPairs.add(
              `${subjectProjection}|${record.curriculumKey}`,
            );
        }
      }
      let hasExplicitMiddleCurriculumRange = false;
      for (const range of exam.courseRanges || []) {
        if (/^H(?:15|22)(?:-|$)/.test(text(range.courseCode)))
          hasExplicitMiddleCurriculumRange = true;
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
        if (curriculum && candidates.size && !exam.curriculums?.length)
          curriculumKeys.add(curriculum);
      }
      const middleGrade = text(exam.effectiveBrowseGrade || exam.grade);
      if (
        !exam.curriculums?.length &&
        !hasExplicitRecordCurriculum &&
        !hasExplicitMiddleCurriculumRange &&
        /^중[123]$/.test(middleGrade)
      ) {
        const curriculum = middleCurriculumFromYear(
          middleGrade,
          exam.year,
        );
        if (curriculum) {
          curriculumKeys.clear();
          curriculumKeys.add(curriculum);
        }
      }
      if (!sourceGrades.size) {
        const registeredGrade = text(exam.sourceGrade || exam.grade);
        if (registeredGrade) sourceGrades.add(registeredGrade);
      }
      byFile.set(file, {
        courseKeys,
        curriculumKeys,
        sourceGrades,
        subjectProjections,
        subjectCurriculumPairs,
      });
    }
    return byFile;
  }
  function finderMatches(exam, filters = {}, index = new Map()) {
    const identity = index.get(normalizeFile(exam?.file)),
      sourceGrades = identity?.sourceGrades || new Set(
        [text(exam?.sourceGrade || exam?.grade)].filter(Boolean),
      ),
      exactGradeMatch = !filters.grade ||
        (sourceGrades.size === 1 && sourceGrades.has(text(filters.grade))),
      sharedHighGradeMatch = !exactGradeMatch &&
        isHighSemanticSubjectGrade(filters.grade) &&
        sourceGrades.size === 1 &&
        isHighSemanticSubjectGrade([...sourceGrades][0]) &&
        Boolean(identity?.subjectProjections?.size),
      indexedSubjectProjections = identity?.subjectProjections,
      semanticMatch =
        !filters.semanticSubject ||
        (indexedSubjectProjections?.size
          ? indexedSubjectProjections.has(filters.semanticSubject)
          : (Array.isArray(exam?.courseFamilies) &&
              exam.courseFamilies.includes(filters.semanticSubject))),
      semanticCurriculumMatch =
        !filters.semanticSubject ||
        !filters.curriculumKey ||
        identity?.subjectCurriculumPairs?.has(
          `${filters.semanticSubject}|${filters.curriculumKey}`,
        );
    return (
      (exactGradeMatch || sharedHighGradeMatch) &&
      (!filters.curriculumKey ||
        identity?.curriculumKeys?.has(filters.curriculumKey)) &&
      (!filters.courseKey || identity?.courseKeys?.has(filters.courseKey)) &&
      semanticMatch &&
      semanticCurriculumMatch
    );
  }
  const sourceYear = (record) => {
    const year = Number(record.year);
    return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : 0;
  };
  const compareNewest = (a, b) => sourceYear(b) - sourceYear(a);
  // Recency policy (user decision 2026-10-29): exam preparation prefers the most recent COMPLETE
  // school year first (2025, 2024, 2023, ... descending), then the current year (its exams can
  // still be incomplete), then years newer than the configured current year (only possible when
  // this constant is stale), and unknown years last. This is the single definition used by
  // 문제지 만들기, 단원별 기출 and the quick assessments; bump currentExamYear once per school year.
  const RECENCY_POLICY = Object.freeze({
    currentExamYear: 2026,
    order: "완결된 최근 연도(2025, 2024, 2023 순)를 먼저, 올해 자료는 그다음, 연도를 알 수 없는 자료는 마지막",
  });
  const RECENCY_CURRENT_BAND = 1000;
  const RECENCY_UNKNOWN = 1000000;
  function recencyRank(year, currentExamYear = RECENCY_POLICY.currentExamYear) {
    const value = Number(year);
    if (!Number.isInteger(value) || value < 1900 || value > 2100) return RECENCY_UNKNOWN;
    return value < currentExamYear
      ? currentExamYear - 1 - value
      : RECENCY_CURRENT_BAND + (value - currentExamYear);
  }
  const compareRecency = (a, b) => recencyRank(sourceYear(a)) - recencyRank(sourceYear(b));
  // Years ordered by recencyRank, e.g. [2026, 2024, 2025, 0] -> [2025, 2024, 2026, 0].
  const sortYearsByRecency = (years) => [...years].sort((a, b) => recencyRank(a) - recencyRank(b));
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
  function basicEligibility(record, options = {}) {
    const reasons = [];
    if (
      !UID.test(record.questionUid || "") ||
      record.identityStatus !== "VERIFIED"
    )
      reasons.push("identity");
    // Raw source identity/integrity and approved release content are separate
    // gates from the narrower taxonomy assignment fingerprint. sourceStatus is
    // the current approved full-payload release fingerprint; it includes answer
    // and solution bytes and must remain VERIFIED for BASIC selection.
    if (record.sourceIntegrityStatus !== "VERIFIED")
      reasons.push("source");
    if (record.sourceStatus !== "VERIFIED")
      reasons.push("source_release");
    const canonicalAuthority = options.canonicalAuthority || options.catalog?.canonicalAuthority;
    const assignment = canonical?.validateBasicAssignment
      ? canonical.validateBasicAssignment(record, canonicalAuthority)
      : { ok: false, reasons: ["canonical_validator_unavailable"] };
    if (!assignment.ok) {
      reasons.push("taxonomy");
      reasons.push(...assignment.reasons);
    }
    // Missing metadata and a pending classification are not source defects.
    if (["HOLD", "reviewed_hold", "route_out", "ROUTE_OUT",
      "SOURCE_DEFECT_CANDIDATE"].includes(record.reviewStatus)) reasons.push("review");
    if (["HOLD", "ROUTE_OUT"].includes(record.semanticDisposition) ||
        ["HOLD", "ROUTE_OUT"].includes(record.basicSemanticDisposition))
      reasons.push("semantic");
    if (["SOURCE_BLOCKED", "SOURCE_REPAIR_REQUIRED", "SOLUTION_REPAIR_REQUIRED",
      "ANSWER_REPAIR_REQUIRED"].includes(record.sourceQualityDisposition))
      reasons.push("solution");
    if (record.sourceIssueHold === true || record.sourceDefectCandidate === true)
      reasons.push("source_issue");
    const applicability = record.basicScopeApplicability || record.curriculumApplicability;
    if (record.basicScopeDefaultSelectable === false ||
      (applicability && applicability !== "UNKNOWN" && applicability !== "DEFAULT_SCOPE" &&
        !(options.includeExtended && applicability === "RPM_EXTENDED")))
      reasons.push("applicability");
    if ((record.metadataConflicts || []).some(field => !OPTIONAL_METADATA_FIELDS.includes(field)))
      reasons.push("conflict");
    return { ok: reasons.length === 0, reasons };
  }
  // General archive use is a source-availability path, not a canonical
  // metadata approval path. Keep identity/integrity and the source payload
  // contract hard, while leaving taxonomy/approval/version status as
  // supplemental metadata state for later repair.
  //
  // User decision 2026-10-29: review/quality annotations about the ORIGINAL source
  // (sourceIssueHold, sourceDefectCandidate, sourceQualityDisposition, source-release
  // fingerprint HOLD, "pending review" metadata) are NOT usage gates. They are handled
  // upstream by the correction protocol and the scheduled meta/SVG review lines; the
  // records and the strict basicEligibility() approval metric are left untouched. Only
  // technical gates remain here: the question must have a verified identity, an intact
  // source reference and a fingerprint so it can load, be restored and render.
  function generalUseEligibility(record = {}) {
    const reasons = [];
    if (!UID.test(record.questionUid || "") || record.identityStatus !== "VERIFIED")
      reasons.push("identity");
    if (record.sourceIntegrityStatus !== "VERIFIED")
      reasons.push("source");
    if (
      !normalizeFile(record.sourceFile) ||
      !Number.isInteger(Number(record.sourceOrdinal)) ||
      !text(record.sourceFingerprint)
    )
      reasons.push("source");
    return { ok: reasons.length === 0, reasons: [...new Set(reasons)] };
  }
  const eligibility = basicEligibility;
  // metaBinding "content": only the answer/solution bytes changed after the metadata was approved;
  // the stem/choices/image the difficulty describes are byte-identical (see build-archive2-catalog).
  // In general use mode that still counts as a recorded difficulty; strict mode and every other
  // caller (APMS recommendations) keep requiring the exactly verified source.
  function difficultyEligible(record, options = {}) {
    return (record.sourceStatus === "VERIFIED" ||
      (options.useMode === "general" && record.metaBinding === "content")) &&
      Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5 &&
      ["high", "medium", "low"].includes(record.difficultyConfidence) &&
      ["NONE", "B12", "B23", "B34", "B45"].includes(record.difficultyBoundaryFlag) &&
      ["NORMAL", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT"].includes(record.legacyLevelCompatibility) &&
      !(record.metadataConflicts || []).some(field => [
        "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility",
      ].includes(field));
  }
  function advancedEligible(record, options = {}) {
    const authority = options.canonicalAuthority || options.catalog?.canonicalAuthority;
    return record.sourceIntegrityStatus === "VERIFIED" && record.sourceStatus === "VERIFIED" &&
      Boolean(canonical?.validateAdvancedAssignment?.(record, authority)?.ok) &&
      (advancedAuthority(record) !== "mf" || !record.foundationTaxonomyStatus || record.foundationTaxonomyStatus === "CONFIRMED") &&
      !(record.metadataConflicts || []).some(field => ["L3", "L4", "problemTypeKey", "templateKey", "foundationTaxonomy"].includes(field));
  }
  // ---- S14: recorded concept (L3) / problem type (PT) / solution template (TPL) facets ----------
  // The catalog carries the recorded values in an additive, content-bound lane (metaHint*). They
  // are DISPLAY/SELECTION facets: never canonical assignments, never an approval. Every value keeps
  // its own status ("approved" = approved field status, "pending" = recorded, not approved) so the
  // UI can label it 승인 / 검토 대기. Records whose metadata row is not bound to the current stem,
  // choices and image carry no facets (they stay usable, only meta-based filtering skips them).
  const META_FACET_KEYS = Object.freeze(["metaL3", "metaPT", "metaTPL", "metaApprovedOnly"]);
  const META_STATUS_LABEL = Object.freeze({ approved: "승인", pending: "검토 대기" });
  const facetStatusOf = (code) => (code === "A" ? "approved" : code === "P" ? "pending" : "");
  const metaFacetCache = new WeakMap();
  function metaFacetsOf(record) {
    if (!record || typeof record !== "object") return null;
    if (metaFacetCache.has(record)) return metaFacetCache.get(record);
    const code = text(record.metaHintStatus);
    // Canonically validated values (the strict path) are approved by construction and win.
    const strictPt = text(record.problemTypeKey), strictTpl = text(record.templateKey);
    const hintL3 = text(record.metaHintL3);
    const pt = strictPt || text(record.metaHintPT);
    const tpl = strictTpl || text(record.metaHintTPL);
    const l3 = hintL3 || text(record.L3);
    let result = null;
    if (l3 || pt || tpl) {
      result = {
        l3, pt, tpl,
        l3Status: hintL3 ? facetStatusOf(code[0]) : l3 ? "approved" : "",
        ptStatus: strictPt ? "approved" : pt ? facetStatusOf(code[1]) : "",
        tplStatus: strictTpl ? "approved" : tpl ? facetStatusOf(code[2]) : "",
        binding: text(record.metaBinding),
      };
      // A hint without a readable status code is never shown as approved.
      for (const facet of ["l3", "pt", "tpl"])
        if (result[facet] && !result[facet + "Status"]) result[facet + "Status"] = "pending";
    }
    metaFacetCache.set(record, result);
    return result;
  }
  const hasMetaFacetFilter = (filters = {}) =>
    META_FACET_KEYS.some((key) => filters[key]);
  const approvedOnlyOn = (filters = {}) =>
    filters.metaApprovedOnly === true || filters.metaApprovedOnly === "1" || filters.metaApprovedOnly === "true";
  // skip: a facet name whose own selection is ignored (faceted option counts).
  function metaFacetPasses(facets, filters = {}, skip = "") {
    const selected = {
      l3: skip === "l3" ? "" : text(filters.metaL3),
      pt: skip === "pt" ? "" : text(filters.metaPT),
      tpl: skip === "tpl" ? "" : text(filters.metaTPL),
    };
    const any = selected.l3 || selected.pt || selected.tpl;
    const approvedOnly = approvedOnlyOn(filters);
    if (!any && !approvedOnly) return true;
    if (!facets) return false;
    for (const name of ["l3", "pt", "tpl"])
      if (selected[name] && facets[name] !== selected[name]) return false;
    if (approvedOnly) {
      const required = any ? ["l3", "pt", "tpl"].filter((name) => selected[name])
        : ["l3", "pt", "tpl"].filter((name) => facets[name]);
      if (!required.length || required.some((name) => facets[name + "Status"] !== "approved")) return false;
    }
    return true;
  }
  const metaFacetMatches = (record, filters = {}) =>
    !hasMetaFacetFilter(filters) || metaFacetPasses(metaFacetsOf(record), filters);
  // Option lists for the three facet selectors over an already scope/eligibility filtered list.
  // Selections are faceted: each list ignores its own selection but honours the others.
  // labelOf(kind, key) names PT/TPL keys; keys without a name are skipped, never invented.
  function metaFacetOptions(records, filters = {}, labelOf = () => "") {
    const buckets = { l3: new Map(), pt: new Map(), tpl: new Map() };
    let facetRecords = 0;
    for (const record of records) {
      const facets = metaFacetsOf(record);
      if (!facets) continue;
      facetRecords++;
      for (const name of ["l3", "pt", "tpl"]) {
        const key = facets[name];
        if (!key || !metaFacetPasses(facets, filters, name)) continue;
        const bucket = buckets[name];
        let option = bucket.get(key);
        if (!option) {
          const label = name === "l3" ? key : text(labelOf(name, key));
          if (!label) continue;
          option = { value: key, label, total: 0, approved: 0, pending: 0 };
          bucket.set(key, option);
        }
        option.total++;
        if (facets[name + "Status"] === "approved") option.approved++; else option.pending++;
      }
    }
    const sort = (map) => [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "ko"));
    return { l3: sort(buckets.l3), pt: sort(buckets.pt), tpl: sort(buckets.tpl), facetRecords };
  }
  // "12문항 · 승인 5 · 검토 대기 7": the status mix of one facet option, "승인" only if all are.
  function metaFacetStatusText(option) {
    const mix = option.pending === 0 ? "승인" : option.approved === 0 ? "검토 대기"
      : `승인 ${option.approved} · 검토 대기 ${option.pending}`;
    return `${option.total}문항 · ${mix}`;
  }
  // Problem-type key used to spread one paper over different types (no type = never repeats).
  const selectionTypeKey = (record) => metaFacetsOf(record)?.pt || "";
  // Overlays are rebuilt only when the fallback taxonomy object or its values
  // change; every other field is read live from the record via the prototype.
  const generalOverlays = new WeakMap();
  const GENERAL_FALLBACK_FIELDS = ["curriculumKey", "courseKey", "L1", "L2"];
  // Same truthiness as text(value) without allocating a trimmed copy when the
  // value is already a non-blank string; this runs ~100k times per render.
  const hasText = (value) => typeof value === "string"
    ? value.trim().length > 0
    : value != null && text(value) !== "";
  function generalFilterRecord(record, options = {}) {
    if (options.useMode !== "general") return record;
    const fallback = record?.unverifiedTaxonomy;
    const fields = GENERAL_FALLBACK_FIELDS;
    if (!fallback) return record;
    for (const field of fields) if (hasText(record[field])) return record;
    for (const field of fields) if (!hasText(fallback[field])) return record;
    const cached = generalOverlays.get(record);
    if (cached && cached.fallback === fallback &&
        fields.every((field, index) => cached.values[index] === fallback[field]))
      return cached.overlay;
    // Read-only overlay: filters only read properties, so inherit the record
    // through the prototype instead of copying every field for every record.
    const overlay = Object.create(record);
    for (const field of fields)
      Object.defineProperty(overlay, field, {
        value: fallback[field], enumerable: true, writable: true, configurable: true,
      });
    generalOverlays.set(record, {
      fallback, overlay, values: fields.map((field) => fallback[field]),
    });
    return overlay;
  }
  // Path key a record carries when general-use filtering overlays its unverified fallback
  // taxonomy. Selection requests (and the server-side replay of them) must name exactly this key.
  function generalPathKey(record, depth = 4) {
    return pathKey(generalFilterRecord(record, { useMode: "general" }), depth);
  }
  // The general-purpose Archive is a usage surface: recorded 1..5 difficulty is
  // sufficient for a selected difficulty filter. Strict approval/difficultyEligible
  // remains unchanged for certification and external consumers such as APMS.
  function difficultyFilterMatches(record, buckets, options = {}) {
    if (!Array.isArray(buckets) || !buckets.length) return true;
    const bucket = record?.difficultyBucket;
    if (!Number.isInteger(bucket) || bucket < 1 || bucket > 5 || !buckets.includes(bucket))
      return false;
    return options.useMode === "general" || difficultyEligible(record, options);
  }
  function matches(record, filters = {}, options = {}) {
    const filterRecord = options.useMode === "general"
      ? generalFilterRecord(record, options)
      : record;
    if (Array.isArray(filters.scopeQuestionUids) && !uidSetFor(filters.scopeQuestionUids).has(record.questionUid))
      return false;
    if (
      filters.primaryPaths?.length &&
      !filters.primaryPaths.includes(pathKey(filterRecord, 4))
    )
      return false;
    const projectionPolicy = options.projectionPolicy ||
      options.canonicalAuthority?.projectionPolicy || options.catalog?.projectionPolicy;
    if (!browseGradeMatchesRecord(filterRecord, filters.grade, projectionPolicy)) return false;
    if (
      filters.sourceFiles?.length &&
      !filters.sourceFiles.includes(filterRecord.sourceFile)
    )
      return false;
    if (filters.school && filterRecord.school !== filters.school) return false;
    if (filters.yearFrom && sourceYear(filterRecord) < Number(filters.yearFrom))
      return false;
    if (filters.yearTo && (!sourceYear(filterRecord) || sourceYear(filterRecord) > Number(filters.yearTo)))
      return false;
    if (filters.axis && filterRecord.examAxis !== filters.axis) return false;
    if (!subjectProjectionMatches(
      filterRecord,
      filters,
      projectionPolicy,
    )) return false;
    if (filters.family && !filterRecord.courseFamilies?.includes(filters.family))
      return false;
    for (const level of [3, 4]) {
      const selected = filters[`L${level}`];
      if (selected && (!advancedEligible(record, options) || advancedFilterValue(record, level) !==
        (selected.startsWith("mf:") || selected.startsWith("rpm:") ? selected : `rpm:${selected}`)))
        return false;
    }
    if (hasMetaFacetFilter(filters) && !metaFacetMatches(record, filters)) return false;
    for (const field of PATH_FIELDS) {
      if (field === "L3" || field === "L4") continue;
      if (
        field === "courseKey" &&
        filters.semanticSubject &&
        hasSubjectProjection(filters.grade)
      )
        continue;
      if (filters[field] && filterRecord[field] !== filters[field]) return false;
    }
    if (!difficultyFilterMatches(record, filters.difficultyBuckets, options))
      return false;
    if (
      filters.query &&
      !normalizeSearch(
        [
          filterRecord.school,
          filterRecord.year,
          filterRecord.courseKey,
          filterRecord.L1,
          filterRecord.L2,
          filterRecord.L3,
          filterRecord.L4,
          filterRecord.subject,
          filterRecord.topic,
          filterRecord.sourceFile,
          record.examAxis?.replace("-final", "기말").replace("-mid", "중간"),
        ].join(" "),
      ).includes(normalizeSearch(filters.query))
    )
      return false;
    return true;
  }
  function migrateLegacyAdvancedFilters(filters, records, scopePaths, sourceFiles = [], canonicalAuthority = null) {
    const next = { ...filters };
    const legacy = ["L3", "L4"].filter(field => next[field] && !/^(mf|rpm):/.test(next[field]));
    if (!legacy.length) return next;
    if (!scopePaths?.length) throw new Error("저장된 개념·유형 조건의 출제 범위를 확인할 수 없습니다. 새 작업에서 조건을 다시 선택해 주세요.");
    const candidates = records.filter(record =>
      eligibility(record, { canonicalAuthority }).ok &&
      matches(record, { ...next, L3: "", L4: "", primaryPaths: scopePaths, sourceFiles }, { canonicalAuthority }) &&
      (!next.L3 || (legacy.includes("L3") ? record.L3 === next.L3 : advancedFilterValue(record, 3) === next.L3)) &&
      (!next.L4 || (legacy.includes("L4") ? record.L4 === next.L4 : advancedFilterValue(record, 4) === next.L4))
    );
    for (const field of legacy) {
      const values = new Set(candidates.map(record => advancedFilterValue(record, field === "L3" ? 3 : 4)).filter(Boolean));
      if (values.size !== 1)
        throw new Error("저장된 개념·유형 조건을 현재 문항 분류에 안전하게 연결할 수 없습니다. 새 작업에서 조건을 다시 선택해 주세요.");
      next[field] = [...values][0];
    }
    return next;
  }
  // `scopeQuestionUids` lists can hold thousands of UIDs and are tested once per record and per
  // row on every render. Membership is answered from a Set cached per array; the cache entry is
  // rebuilt if the array's length changes, so an array extended in place is never answered stale.
  const uidSets = new WeakMap();
  function uidSetFor(list) {
    let entry = uidSets.get(list);
    if (!entry || entry.size !== list.length) {
      entry = { size: list.length, set: new Set(list) };
      uidSets.set(list, entry);
    }
    return entry.set;
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
  function rowMatches(record, row, options = {}) {
    // The UID scope is the cheapest test and every condition is required, so test it first:
    // most records belong to no scope row and never reach the path-key computation.
    if (Array.isArray(row.scopeQuestionUids) && !uidSetFor(row.scopeQuestionUids).has(record.questionUid))
      return false;
    const filterRecord = options.useMode === "general"
      ? generalFilterRecord(record, options)
      : record;
    const pathsMatch = row.paths?.length
      ? row.paths.includes(pathKey(filterRecord, row.depth || 4))
      : !row.path || pathKey(filterRecord, row.depth || 4) === row.path;
    return (
      pathsMatch &&
      difficultyFilterMatches(record, row.difficultyBuckets, options)
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
  // S14 type diversity. The recency order is untouched: this only reorders WITHIN the year being
  // consumed, replacing a pick whose problem type was already chosen (earlier in the paper, in an
  // earlier row or by a pin) by another candidate of the same year whose type is new, when one
  // exists. Questions without a recorded type never count as repeats, and when no new type is
  // left the originally chosen questions stay, so the count and the year spread never change.
  function diversifyByType(picked, yearPool, usedTypes, seed) {
    const seen = new Set(usedTypes);
    const kept = [], repeats = [];
    for (const record of picked) {
      const type = selectionTypeKey(record);
      if (type && seen.has(type)) repeats.push(record);
      else { kept.push(record); if (type) seen.add(type); }
    }
    if (!repeats.length) return picked;
    const pickedUids = new Set(picked.map((record) => record.questionUid));
    const isNewType = (record) => { const type = selectionTypeKey(record); return !type || !seen.has(type); };
    let rest = yearPool.filter((record) => !pickedUids.has(record.questionUid) && isNewType(record));
    let need = repeats.length;
    while (need > 0 && rest.length) {
      const more = selector.selectCandidates(rest, { count: need }, { selectionSeed: seed }).selected;
      if (!more.length) break;
      const moreUids = new Set(more.map((record) => record.questionUid));
      for (const record of more) {
        const type = selectionTypeKey(record);
        if (type && seen.has(type)) continue;
        kept.push(record);
        if (type) seen.add(type);
        need--;
      }
      rest = rest.filter((record) => !moreUids.has(record.questionUid) && isNewType(record));
    }
    for (const record of repeats) {
      if (kept.length >= picked.length) break;
      kept.push(record);
    }
    return kept;
  }
  function selectBlueprint(records, request, context = {}, options = {}) {
    const started = Date.now();
    const errors = validatePlan(request);
    const exclusions = composeExclusions(context);
    const reasons = {};
    const used = new Set();
    const candidates = records.filter((record) => {
      if (!matches(record, request.filters, request)) return false;
      const gate = request.useMode === "general"
        ? generalUseEligibility(record, request)
        : eligibility(record, request);
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
    const usedTypes = new Set();
    const noteType = (record) => { const type = selectionTypeKey(record); if (type) usedTypes.add(type); };
    const rows = request.rows || [];
    const rowResults = rows.map((row) => ({
      id: row.id,
      requested: row.count,
      available: candidates.filter((r) => rowMatches(r, row, request)).length,
      selected: 0,
    }));
    for (const pin of request.pins || []) {
      const record = byUid.get(pin.questionUid);
      const row = rows.find((r) => r.id === pin.rowId);
      if (
        !record ||
        !row ||
        !rowMatches(record, row, request) ||
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
      noteType(record);
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
        (record) => !used.has(record.questionUid) && rowMatches(record, row, request),
      );
      if (typeof options.representativeGroupFor === "function") {
        const groups = new Map();
        const conceptCounts = new Map();
        const selectedGroups = new Set();
        const groupOf = record => {
          const value = options.representativeGroupFor(record);
          if (!value?.concept) return null;
          return { concept: value.concept, key: JSON.stringify([value.concept, value.type || ""]) };
        };
        for (const record of selected.filter(item => item.rowId === row.id)) {
          const group = groupOf(record);
          if (!group) continue;
          selectedGroups.add(group.key);
          conceptCounts.set(group.concept, (conceptCounts.get(group.concept) || 0) + 1);
        }
        for (const record of pool) {
          const group = groupOf(record);
          if (!group || selectedGroups.has(group.key)) continue;
          if (!groups.has(group.key)) groups.set(group.key, { ...group, records: [] });
          groups.get(group.key).records.push(record);
        }
        while (result.selected < row.count && groups.size) {
          const group = [...groups.values()].sort((a, b) =>
            (conceptCounts.get(a.concept) || 0) - (conceptCounts.get(b.concept) || 0) ||
            Math.min(...a.records.map(record => recencyRank(sourceYear(record)))) -
              Math.min(...b.records.map(record => recencyRank(sourceYear(record)))) ||
            a.key.localeCompare(b.key, "en"))[0];
          groups.delete(group.key);
          const bestRank = Math.min(...group.records.map(record => recencyRank(sourceYear(record))));
          const selection = selector.selectCandidates(
            group.records.filter(record => recencyRank(sourceYear(record)) === bestRank),
            { count: 1 },
            { selectionSeed: request.seed || VERSION },
          );
          const record = selection.selected[0];
          if (!record || used.has(record.questionUid)) continue;
          selected.push({ ...record, rowId: row.id });
          used.add(record.questionUid);
          noteType(record);
          result.selected++;
          selectedGroups.add(group.key);
          conceptCounts.set(group.concept, (conceptCounts.get(group.concept) || 0) + 1);
        }
      }
      // Recency is a priority after hard scope/quality/history gates (RECENCY_POLICY: complete
      // years newest first, then the current year, unknown years last). The existing seeded
      // selection is preserved within each year.
      for (const year of sortYearsByRecency(new Set(pool.map(sourceYear)))) {
        const remaining = row.count - result.selected;
        if (!remaining) break;
        const yearPool = pool.filter((record) => !used.has(record.questionUid) && sourceYear(record) === year);
        const seed = request.seed || VERSION;
        const selection = selector.selectCandidates(yearPool, { count: remaining }, { selectionSeed: seed });
        for (const record of diversifyByType(selection.selected, yearPool, usedTypes, seed)) {
          selected.push({ ...record, rowId: row.id });
          used.add(record.questionUid);
          noteType(record);
          result.selected++;
        }
      }
    }
    selected.sort(
      (a, b) =>
        rows.findIndex((r) => r.id === a.rowId) -
        rows.findIndex((r) => r.id === b.rowId) || compareRecency(a, b),
    );
    const shortages = rowResults
      .filter((r) => r.selected < r.requested)
      .map((r) => ({ ...r, shortage: r.requested - r.selected }));
    const representativeCoverage = typeof options.representativeGroupFor === "function"
      ? rows.map(row => {
          const groupKey = record => {
            const group = options.representativeGroupFor(record);
            return group?.concept ? JSON.stringify([group.concept, group.type || ""]) : null;
          };
          const known = new Set(candidates.filter(record => rowMatches(record, row, request)).map(groupKey).filter(Boolean));
          const covered = new Set(selected.filter(record => record.rowId === row.id).map(groupKey).filter(Boolean));
          return { rowId: row.id, knownGroupCount: known.size, coveredGroupCount: covered.size,
            complete: known.size > 0 && row.count >= known.size && [...known].every(key => covered.has(key)) };
        })
      : [];
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
        representativeCoverage,
        typeCoverage: typeCoverage(selected),
      },
      seed: request.seed,
      selectorVersion: VERSION,
    };
  }
  // Problem-type spread of a paper: how many questions carry a recorded type and how many distinct
  // types they cover (informational; questions without a type are neither repeats nor coverage).
  function typeCoverage(selected) {
    const counts = new Map();
    for (const record of selected || []) {
      const type = selectionTypeKey(record);
      if (type) counts.set(type, (counts.get(type) || 0) + 1);
    }
    const typed = [...counts.values()].reduce((sum, n) => sum + n, 0);
    return { typedCount: typed, distinctTypes: counts.size, repeatedCount: typed - counts.size };
  }
  function review(selected, request, context = {}) {
    const hardFailures = validatePlan(request);
    const warnings = [];
    const exclusions = composeExclusions(context).union;
    const seen = new Set();
    for (const record of selected) {
      if (seen.has(record.questionUid)) hardFailures.push("중복 UID");
      seen.add(record.questionUid);
      const gate = request.useMode === "general"
        ? generalUseEligibility(record, request)
        : eligibility(record, request);
      if (!gate.ok || !matches(record, request.filters, request))
        hardFailures.push("문항의 승인·범위 조건이 일치하지 않습니다.");
      if (exclusions.has(record.questionUid))
        hardFailures.push("학생·시리즈·수동 제외 이력과 중복됩니다.");
      const row = request.rows.find((r) => r.id === record.rowId);
      if (!row || !rowMatches(record, row, request))
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
    Canonical: canonical,
    VERSION,
    TAXONOMY_VERSION,
    UID,
    PATH_FIELDS,
    META_FIELDS,
    OPTIONAL_METADATA_FIELDS,
    pathKey,
    generalPathKey,
    basicScopeParent,
    normalizeFile,
    normalizeSearch,
    gradeRank,
    normalizeCourseIdentity,
    HIGH_SEMANTIC_SUBJECTS,
    isHighSemanticSubjectGrade,
    highSemanticSubjectOptions,
    highSemanticSubjectForCourseKey,
    highSemanticSubjectCourseKeys,
    HIGH1_SUBJECT_PROJECTIONS,
    hasSubjectProjection,
    subjectProjectionOptions,
    subjectProjectionForRecord,
    browseGradeMatchesRecord,
    subjectProjectionLabel,
    subjectProjectionMatches,
    finderCourseGrade,
    middleCurriculumFromYear,
    finderCourseKeys,
    reconcileFinderFilters,
    buildFinderIndex,
    finderMatches,
    sourceYear,
    compareNewest,
    RECENCY_POLICY,
    recencyRank,
    compareRecency,
    sortYearsByRecency,
    taxonomyPaths,
    eligibility,
    basicEligibility,
    generalUseEligibility,
    difficultyEligible,
    advancedEligible,
    advancedAuthority,
    advancedFilterValue,
    META_FACET_KEYS,
    META_STATUS_LABEL,
    metaFacetsOf,
    metaFacetPasses,
    metaFacetMatches,
    metaFacetOptions,
    metaFacetStatusText,
    selectionTypeKey,
    typeCoverage,
    matches,
    migrateLegacyAdvancedFilters,
    composeExclusions,
    rowMatches,
    validatePlan,
    selectBlueprint,
    review,
    decodeCatalog,
  };
});
