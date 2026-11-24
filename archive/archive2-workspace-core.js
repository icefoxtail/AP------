// Archive2 workspace, shared part: state, helpers, API client, filter and match rules. Loaded first (see docs/agents/archive2-code.md).
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = (window.Archive2Workspace = { api: {}, v: {}, links: [], link() { for (const fn of this.links) fn(); } });
  const V = WS.v;
  const AssessmentRecipes = window.ProblemBankAssessmentRecipes;
  const Boot = window.Archive2Boot;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const ProblemBankMeta = window.ProblemBankMeta;
  const Unified = window.Archive2UnifiedUnits;
  const frozenPaperCache = new Map();
  const composeMetaQueryCache = new Map();
  V.renderComposeMetaFilters = null;
  let workspaceMatchCatalog = null;
  let workspaceStrictMatchOptions = null;
  let workspaceGeneralMatchOptions = null;
  function workspaceMatchOptions() {
    if (workspaceMatchCatalog !== state.catalog) {
      workspaceMatchCatalog = state.catalog;
      const shared = {
        canonicalAuthority: state.catalog?.canonicalAuthority,
        projectionPolicy: state.catalog?.projectionPolicy,
      };
      workspaceStrictMatchOptions = { ...shared, useMode: "strict" };
      workspaceGeneralMatchOptions = { ...shared, useMode: "general" };
    }
    return workspaceUseMode() === "general"
      ? workspaceGeneralMatchOptions
      : workspaceStrictMatchOptions;
  }
  const lockedIndex = (index) =>
    Boolean(Parts.receipt(state.receipts, Parts.partIndex(index)));
  const ownHistoryContext = () => {
    const ctx = context(),
      own = Parts.lockedUids(state.receipts);
    ctx.student = ctx.student.filter((uid) => !own.has(uid));
    return ctx;
  };
  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const options = (values, current, empty = "전체") =>
    `${empty !== null ? `<option value="">${esc(empty)}</option>` : ""}${values
      .map((v) => {
        const value = typeof v === "object" ? v.value : v,
          label = typeof v === "object" ? v.label : v;
        return `<option value="${esc(value)}"${String(current) === String(value) ? " selected" : ""}>${esc(label)}</option>`;
      })
      .join("")}`;
  const advancedOptions = (values, current, empty) =>
    `<option value="">${esc(empty)}</option>${["mf", "rpm"].map(authority => {
      const group = values.filter(row => row.authority === authority);
      return group.length
        ? `<optgroup label="${authority === "mf" ? "Meta Foundation" : "RPM"}">${group.map(row =>
          `<option value="${esc(row.value)}"${current === row.value ? " selected" : ""}>${esc(row.label)}</option>`).join("")}</optgroup>`
        : "";
    }).join("")}`;
  const button = (action, label, extra = "") =>
    `<button data-action="${action}" ${extra}>${label}</button>`;
  const badge = (label, type = "") =>
    `<span class="badge ${type}">${esc(label)}</span>`;
  const unique = (values) => [...new Set(values.filter(Boolean))];
  V.renderEligibilityCache = null;
  const workspaceScopeParentCache = new WeakMap();
  function workspaceUseMode() {
    // Assessment recipes shape the teacher-facing UI (fixed count/QPP and
    // recipe UID pool); they do not certify metadata. Certification remains
    // owned by ProblemBankMeta's VERIFIED profile and external validators.
    return state.useMode || "strict";
  }
  function isSourceRoutedGeneralRange() {
    return workspaceUseMode() === "general" &&
      state.view === "compose" &&
      state.urlRange === "all" &&
      state.sources.length > 0;
  }
  function sourceRoutedFallbackMatches(record, filters = state.filters) {
    if (!isSourceRoutedGeneralRange() || !state.sources.includes(record.sourceFile))
      return false;
    const fallback = record?.unverifiedTaxonomy;
    if (!fallback || (filters.curriculumKey && fallback.curriculumKey &&
        fallback.curriculumKey !== filters.curriculumKey))
      return false;
    // The exact source list is authoritative for this routed range. Keep the
    // fallback taxonomy attached to its source without inventing a canonical
    // course/path assignment in the global catalog.
    const relaxed = {
      ...filters,
      courseKey: "",
      L1: "",
      L2: "",
      L3: "",
      L4: "",
      primaryPaths: [],
    };
    return C.matches(record, relaxed, workspaceMatchOptions());
  }
  function workspaceEligibility(record) {
    const mode = workspaceUseMode();
    const evaluate = mode === "general" ? C.generalUseEligibility : C.eligibility;
    if (!V.renderEligibilityCache) return evaluate(record, state);
    if (!V.renderEligibilityCache.has(record))
      V.renderEligibilityCache.set(record, evaluate(record, state));
    return V.renderEligibilityCache.get(record);
  }
  // canonicalOnly: the finder's taxonomy scan keeps the canonical matcher even while compose
  // uses the unified unit list.
  function workspaceMatches(record, filters = state.filters, canonicalOnly = false) {
    const options = workspaceMatchOptions();
    const index = canonicalOnly ? null : unifiedIndex();
    if (index) {
      // Subject and original curriculum are decided by the unified layer (display and
      // selection grouping only); everything else is the unchanged shared matcher.
      const entry = index.byUid.get(record.questionUid);
      if (!entry) return false;
      if (filters.semanticSubject && entry.subject !== filters.semanticSubject) return false;
      if (filters.originalCurriculum && entry.originalCurriculum !== filters.originalCurriculum)
        return false;
      return C.matches(record, stripUnifiedFilters(filters), options);
    }
    return C.matches(record, filters, options) ||
      sourceRoutedFallbackMatches(record, filters);
  }
  let unifiedIndexCache = { records: null, projectionPolicy: null, index: null };
  function unifiedIndex() {
    if (!Unified || !state.catalog?.records) return null;
    const { records, projectionPolicy } = state.catalog;
    if (unifiedIndexCache.records !== records || unifiedIndexCache.projectionPolicy !== projectionPolicy)
      unifiedIndexCache = {
        records,
        projectionPolicy,
        index: Unified.buildIndex(records, { projectionPolicy }),
      };
    return unifiedIndexCache.index;
  }
  // Curriculum/course/subject/family are resolved by the unified layer, so they must not reach
  // the shared matcher, the replayed server request or the saved-paper filters.
  const UNIFIED_ONLY_FILTERS = ["curriculumKey", "courseKey", "semanticSubject", "originalCurriculum", "family"];
  // Always returns a copy without the unified-only keys (request and saved-paper filters).
  function omitUnifiedFilters(filters) {
    const stripped = { ...filters };
    for (const key of UNIFIED_ONLY_FILTERS) delete stripped[key];
    return stripped;
  }
  // S14 recorded concept / problem type / solution template facets (display and selection only).
  // They are applied by the shared matcher, but the saved-paper server contract does not know
  // them: the selection they produce travels as the scope UID list, never as a filter key.
  const META_FACET_FILTERS = C.META_FACET_KEYS || [];
  const hasMetaFacetFilter = (filters) => META_FACET_FILTERS.some((key) => filters?.[key]);
  function withoutMetaFacets(filters) {
    // Also when the keys exist with empty values (a grade/subject button clears them to ""): the saved-paper server rejects an unknown key
    // (409) whatever its value, so the key itself must not travel.
    if (!filters || !META_FACET_FILTERS.some((key) => Object.hasOwn(filters, key))) return filters;
    const stripped = { ...filters };
    for (const key of META_FACET_FILTERS) delete stripped[key];
    return stripped;
  }
  const META_FOUNDATION_LABELS = () => window.ARCHIVE_META_FOUNDATION_LABELS || { problemTypes: {}, templates: {} };
  const metaFacetLabel = (kind, key) => kind === "pt"
    ? META_FOUNDATION_LABELS().problemTypes?.[key] || ""
    : META_FOUNDATION_LABELS().templates?.[key]?.label || "";
  // The matcher treats empty values as "no constraint", so a copy is only needed while one of
  // the unified-only filters actually carries a value. Filter objects are mutated in place by
  // the filter controls, so nothing here may be cached by object identity.
  function stripUnifiedFilters(filters) {
    return UNIFIED_ONLY_FILTERS.some((key) => filters?.[key]) ? omitUnifiedFilters(filters) : filters;
  }
  // Maps filters from older drafts, URLs and the finder onto the unified vocabulary: the old
  // curriculum select becomes the optional original-curriculum filter, a subject the unified
  // list does not know is dropped (the list then shows every subject).
  function reconcileUnifiedFilters(filters) {
    const next = { ...filters };
    const grade = next.grade || "";
    if (!next.originalCurriculum && ["2015", "2022"].includes(next.curriculumKey))
      next.originalCurriculum = next.curriculumKey;
    if (!["2015", "2022"].includes(next.originalCurriculum)) next.originalCurriculum = "";
    let subject = next.semanticSubject || "";
    if (!subject && next.courseKey) {
      const identity = C.normalizeCourseIdentity(next.courseKey);
      subject = Unified.subjectsForGrade(grade)
        .find((candidate) => C.normalizeCourseIdentity(candidate.course) === identity)?.value ||
        C.highSemanticSubjectForCourseKey?.(next.courseKey) || "";
    }
    // 고1 과목 목록이 4과목(공통수학1·2, 수학(상)·(하))이던 때 저장된 옛 초안의 값은 묶음 규칙(수학(상)→공통수학1, 수학(하)→공통수학2)의 과목으로 받는다.
    if (subject && grade === "고1" && !Unified.subjectByValue(grade, subject))
      subject = { H1_2015_MATH_UP: "COMMON_MATH_1", H1_2015_MATH_DOWN: "COMMON_MATH_2" }[subject] || subject;
    if (subject && !Unified.subjectByValue(grade, subject)) subject = "";
    next.semanticSubject = subject;
    next.curriculumKey = "";
    next.courseKey = "";
    next.family = "";
    return next;
  }
  // 고2/고3 start on the grade's first subject (대수) instead of a long all-subject list (the
  // subject select still offers "전체 과목"). Only applied when the grade is chosen or compose is
  // opened from the finder without a subject, never while whole exams are selected as sources.
  function withDefaultComposeSubject(filters) {
    const index = unifiedIndex();
    if (!index || filters.semanticSubject || state.sources.length) return filters;
    const subject = Unified.defaultSubject(index, filters.grade || "");
    return subject ? { ...filters, semanticSubject: subject } : filters;
  }
  // Subject label of the unified list for grades the shared projection does not name (중1~중3 have
  // a single subject; 고1~고3 name it once a subject is chosen).
  function composeSubjectLabel() {
    if (!unifiedIndex()) return "";
    const grade = state.filters.grade || "";
    const subjects = Unified.subjectsForGrade(grade);
    if (subjects.length === 1) return subjects[0].label;
    return Unified.subjectByValue(grade, state.filters.semanticSubject)?.label || "";
  }
  function workspaceScopeParent(record) {
    if (workspaceScopeParentCache.has(record)) return workspaceScopeParentCache.get(record);
    const assignmentList = state.catalog?.canonicalAuthority?.assignmentsByUid?.[record.questionUid];
    const canonicalParent = Array.isArray(assignmentList) && assignmentList.length === 1
      ? C.basicScopeParent(
        record,
        state.catalog.basicScopeLinks,
        state.catalog.canonicalAuthority,
      )
      : null;
    if (canonicalParent) {
      const result = { ...canonicalParent, supplemental: false };
      workspaceScopeParentCache.set(record, result);
      return result;
    }
    const fallback = record?.unverifiedTaxonomy;
    const fields = ["curriculumKey", "courseKey", "L1", "L2"];
    if (!fallback || fields.some((field) => !String(fallback[field] || "").trim())) {
      workspaceScopeParentCache.set(record, null);
      return null;
    }
    const result = {
      grade: record.effectiveBrowseGrade || record.sourceGrade || record.grade || "",
      ...Object.fromEntries(fields.map((field) => [field, fallback[field]])),
      supplemental: true,
    };
    workspaceScopeParentCache.set(record, result);
    return result;
  }
  const SAVED_PAPER_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const savedPaperIds = (values) => unique(
    (Array.isArray(values) ? values : []).map(String).filter((id) => SAVED_PAPER_UUID.test(id)),
  );
  const FIVE_MINUTE_RECIPE_KEY = "FIVE_MINUTE";
  const FIVE_MINUTE_TITLE = "\u0035\uBD84 \uD14C\uC2A4\uD2B8";
  const SUBUNIT_RECIPE_KEY = "SUBUNIT";
  const SUBUNIT_TITLE = "\uC18C\uB2E8\uC6D0 \uD3C9\uAC00";
  const UNIT_RECIPE_KEY = "UNIT";
  const UNIT_TITLE = "\uC911\uB2E8\uC6D0 \uD3C9\uAC00";
  const MONTHLY_RECIPE_KEY = "MONTHLY";
  const MONTHLY_TITLE = "\uC885\uD569\uD3C9\uAC00";
  const ASSESSMENT_RECIPE_TITLES = Object.freeze({
    [FIVE_MINUTE_RECIPE_KEY]: FIVE_MINUTE_TITLE,
    [SUBUNIT_RECIPE_KEY]: SUBUNIT_TITLE,
    [UNIT_RECIPE_KEY]: UNIT_TITLE,
    [MONTHLY_RECIPE_KEY]: MONTHLY_TITLE,
  });
  const ASSESSMENT_RECIPE_KEYS = new Set(Object.keys(ASSESSMENT_RECIPE_TITLES));
  let assessmentRecipeCache = { key: "", uids: null, coverage: null };
  function activeAssessmentRecipe() {
    if (!state.assessmentRecipe || !AssessmentRecipes) return null;
    try { return AssessmentRecipes.getRecipe(state.assessmentRecipe); } catch { return null; }
  }
  function isAssessmentRecipeMode() {
    return ASSESSMENT_RECIPE_KEYS.has(state.assessmentRecipe);
  }
  function activeAssessmentRecipeUids() {
    const recipe = activeAssessmentRecipe();
    const metaIndex = recipe ? ensureMetaIndex() : null;
    if (!recipe || !metaIndex?.length) return null;
    const key = `${recipe.key}:${state.indexVersion}`;
    if (assessmentRecipeCache.key === key) return assessmentRecipeCache.uids;
    const result = AssessmentRecipes.queryRecipe(
      metaIndex,
      recipe.key,
      {},
      { profile: "DIRECT", count: recipe.defaultCount },
    );
    assessmentRecipeCache = {
      key,
      uids: new Set(result.candidates.map((row) => row.questionUid || row.uid).filter(Boolean)),
      coverage: result.coverage,
    };
    return assessmentRecipeCache.uids;
  }
  // 선정 옵션. familyRecords는 원본-유사 짝 계산용 전체 카탈로그다(고른 단원 밖에 있는 원본 때문에 유사 둘이 함께 뽑히지 않게).
  function assessmentSelectionOptions() {
    const familyRecords = state.catalog?.records;
    if (!isAssessmentRecipeMode() || !AssessmentRecipes?.representativeGroup) return { familyRecords };
    const byUid = new Map((ensureMetaIndex() || []).map(row => [row.questionUid || row.uid, row]));
    return { familyRecords, representativeGroupFor: record =>
      AssessmentRecipes.representativeGroup(byUid.get(record.questionUid)) };
  }

  const scopeText = (value) =>
    String(value ?? "")
      .normalize("NFC")
      .replace(/\s+/g, "")
      .replace(/[·・ㆍ]/g, "");
  const scopeCourseKey = (row) => C.normalizeCourseIdentity(row.courseKey);
  const scopeParentKey = (row) => [
    row.grade || row.sourceGrade || "",
    row.curriculumKey || "",
    scopeCourseKey(row),
    scopeText(row.L1),
    scopeText(row.L2),
  ].join("|");
  // One render asks for the same taxonomy rows several times (scope list, course
  // options); each ask scans the whole catalog. Reuse the answer within a render
  // only: render() installs and clears this cache, so every interaction still
  // re-evaluates the current filters and quality gates.
  V.renderTaxonomyRowsCache = null;
  const taxonomyRowsForFilters = (filters) => {
    if (!V.renderTaxonomyRowsCache) return computeTaxonomyRowsForFilters(filters);
    let key;
    try {
      key = JSON.stringify(filters, (name, value) =>
        value === "" || value === null || value === undefined ? undefined : value);
    } catch { return computeTaxonomyRowsForFilters(filters); }
    if (!V.renderTaxonomyRowsCache.has(key))
      V.renderTaxonomyRowsCache.set(key, computeTaxonomyRowsForFilters(filters));
    return V.renderTaxonomyRowsCache.get(key);
  };
  const computeTaxonomyRowsForFilters = (filters) => {
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true;
    if (highSemantic && !filters.semanticSubject) return [];
    const allowedParents = new Set();
    const includeSupplemental = workspaceUseMode() === "general";
    const supplementalRows = new Map();
    const selectionFilters = {
      ...filters,
      L3: "",
      L4: "",
      difficultyBuckets: [],
      primaryPaths: [],
    };
    delete selectionFilters.scopeQuestionUids;
    for (const record of state.catalog.records || []) {
      if (!workspaceMatches(record, selectionFilters, true) || !composeMetaMatches(record) || !workspaceEligibility(record).ok) continue;
      const parent = workspaceScopeParent(record);
      if (parent) {
        const key = scopeParentKey({ ...record, ...parent });
        allowedParents.add(key);
        if (includeSupplemental && parent.supplemental === true && !supplementalRows.has(key))
          supplementalRows.set(key, { ...record, ...parent, supplemental: true });
      }
    }
    const canonicalRows = (state.catalog.basicTaxonomy || []).filter((row) =>
      (!filters.grade || row.grade === filters.grade ||
        (highSemantic && C.isHighSemanticSubjectGrade?.(row.grade) === true)) &&
      (!filters.curriculumKey || row.curriculumKey === filters.curriculumKey) &&
      (!filters.courseKey || filters.semanticSubject || row.courseKey === filters.courseKey) &&
      allowedParents.has(scopeParentKey(row)),
    );
    const canonicalKeys = includeSupplemental ? new Set(canonicalRows.map(scopeParentKey)) : new Set();
    const supplemental = [...supplementalRows.entries()]
      .filter(([key, row]) => !canonicalKeys.has(key) &&
        (!filters.grade || row.grade === filters.grade) &&
        (!filters.curriculumKey || row.curriculumKey === filters.curriculumKey) &&
        (!filters.courseKey || filters.semanticSubject || row.courseKey === filters.courseKey))
      .map(([, row]) => row);
    return [...canonicalRows, ...supplemental];
  };
  const state = {
    catalog: null,
    // 시험지 목록만 먼저 받은 홈(가벼운 진입, 2026-11-23): { exams, identityDigest }. 전체 카탈로그가 오면 catalog가 우선한다.
    light: null,
    // 학교별 기출 표(조각 3단계): common.json의 finder 부분을 풀어 둔 것. 있으면 홈·학교별 기출이 조각 없이 시험지 목록만으로 정확히 답한다.
    finderTable: null,
    // ?assign=legacy(옛 출제 화면으로 되돌리는 스위치)는 페이지를 열 때 읽어 둔다. 시작할 때 routeUrl()이 주소를
    // 다시 쓰면 location.search에서 사라지므로, 이 값을 보고 주소를 다시 쓸 때마다 assign=legacy를 붙여 유지한다.
    assignLegacy: new URLSearchParams(location.search).get("assign") === "legacy",
    recentRows: [],
    recentClassId: "",
    recentFilters: { from: "", to: "", grade: "", subject: "", query: "" },
    recentShowCancelled: false, // 취소한 출제는 기본으로 숨긴다(아래 줄의 버튼으로 다시 본다)
    recentSelectedAssignmentId: "",
    recentLoadVersion: 0,
    assignmentStatusLoadVersion: 0,
    recentLoading: false,
    recentError: "",
    byUid: new Map(),
    busy: false,
    view: "home",
    useMode: "strict",
    healthComposeScope: null,
    healthUnified: null,
    assessmentRecipe: "",
    page: 0,
    savedPaperId: "",
    savedLibraryStatusFilter: "ACTIVE",
    find: { grade: "고1" },
    sources: [],
    filters: { grade: "고1" },
    scopes: [],
    distribution: "equal",
    count: 10,
    buckets: [],
    difficultyFilterVersion: "optional-v1",
    includeExtended: false,
    custom: {},
    selected: [],
    pins: [],
    seed: "archive2",
    rows: [],
    round: 1,
    rounds: [],
    sealed: false,
    title: "시험 대비 문제지",
    qpp: 4,
    includeQr: false,
    header: {
      title: "시험 대비 문제지",
      subtitle: "",
      metaRight: "AP수학",
      showNameLine: true,
      showScoreLine: true,
      applyToSolution: true,
      applyToAnswer: true,
    },
    draftId: crypto.randomUUID(),
    indexVersion: "",
    studentIds: [],
    classId: "",
    studentLabels: [],
    historyMode: "off",
    recentDays: 90,
    history: null,
    historyReady: false,
    historyError: "",
    targetVersion: 0,
    finderIndex: new Map(),
    metaIndex: [],
    metaIndexSource: null,
    inspector: "summary",
    previewIndex: 0,
    outputMode: "exam",
    composeDetailOpen: false,
    prepared: [],
    undo: [],
    receipts: [],
    ackWarnings: false,
    saveBusy: false,
    saveBatchId: "",
    saveSignature: "",
    savedPaperIds: [],
    lastSavedPaperIds: [],
    saveMessage: "",
    saveError: "",
    saveResultSignature: "",
    saveResultState: "",
    derivationSource: null,
    derive: null,
    derivedBaseQuestions: null,
    editSavedPaperId: "",
    urlSources: [],
    urlRange: "",
    // S9: repeatable `uid` URL parameter (per-item selection from the Meta search page) and the
    // resolved route (accepted records + rejected UIDs). Null while the compose pool is unrestricted.
    urlUids: [],
    uidRoute: null,
    scopeNotice: "",
    // 문제지 만들기 한 화면: 뽑은 뒤 모자랐던 곳, 뽑은 결과가 있었는데 조건이 바뀌어 비워졌는지, 미리보기·출력 설정 접힘.
    composeShortage: [],
    composeStale: false,
    composeStalePins: 0,
    composeNotice: "",
    previewOpen: true,
    outputSettingsOpen: false,
    scopeGroupOpen: {},
    scopeUnitOpen: {},
    composeAnnounce: "",
    assignBusy: false,
  };
  V.finderFilterRenderTimer = null;
  // Quick assessments (5분 테스트 / 소단원 / 중단원 / 종합평가) draw from pools built on the
  // unified unit layer (archive2-quick-pools.js) and use the existing catalog and output engine
  // without changing the compose draft or its selection controls.
  const Quick = window.Archive2QuickPools;
  const QuickTree = window.Archive2UnitTree;
  const quickState = { grade: "", subject: "", semester: "1", busy: false, bundle: new Set(), pick: "", shortOpen: false, levelOpen: false, groupsFailed: false,
    // 진단평가 A·B형 두 벌 (a check box, not a mode); formB: the B paper when its window could not open with A's click.
    twoForms: false, formB: null,
    // 진단평가 결과표 link: the question UIDs of the paper(s) just made ({ title, a, b }), cleared when the next one starts.
    report: null,
    presets: { "five-minute": "standard", "subunit-test": "standard", "unit-test": "standard", "monthly-test": "standard", diagnostic: "standard" } };
  const quickProduct = () => Quick?.PRODUCTS[state.view] || null;
  const quickPreset = () => quickState.presets[state.view] || "standard";
  const isQuickAssessmentView = () => Boolean(Quick?.isQuickView(state.view));
  // One navigation tab ("빠른 평가") stays active on all four products.
  // Menu entries carry data-nav-key; 빠른 평가 covers the four quick products and 보관함 covers
  // 저장한 시험지 + 출제 내역. Other [data-view] buttons (view switch, quick tabs) match their own view.
  const navViewActive = (el) => {
    const key = el.dataset.navKey;
    if (key === "quick") return isQuickAssessmentView();
    if (key && window.Archive2Navigation?.matches) return window.Archive2Navigation.matches(key, state.view);
    return el.dataset.view === state.view;
  };
  V.lastRenderedView = state.view;
  function session() {
    try {
      return JSON.parse(localStorage.getItem("APMATH_SESSION") || "null");
    } catch {
      return null;
    }
  }
  const storageKey = () =>
    "APMATH_ARCHIVE2_DRAFTS_v1:" +
    (session()?.id || session()?.user?.id || "local");
  function headers() {
    const s = session();
    // 교사 로그인의 인증은 토큰(Bearer)뿐이다. 토큰이 없는 세션(옛 세션)은 비밀번호로 대신하지 않고 다시 로그인하게 한다.
    if (s?.session_token) return { Authorization: "Bearer " + s.session_token };
    throw new Error(
      "교사 로그인이 필요합니다. 선생님 계정으로 로그인한 뒤 돌아와 주세요.",
    );
  }
  // options (optional): { headers, timeoutMs } for one call. The 반에 출제 panel (archive2-assign.js) sends the
  // X-Archive2-Contract header and its own time limits through it; every other caller is unchanged.
  async function api(route, body, method = body ? "POST" : "GET", options = {}) {
    const base = (
      window.APMATH_API_BASE ||
      "https://ap-math-os-v2612.js-pdf.workers.dev/api"
    ).replace(/\/$/, "");
    // Read requests give up after 30s so a stalled server cannot freeze the page. The saved-paper
    // POST is idempotent by save_batch_id and a timeout (no HTTP status) already falls into the
    // RESULT_UNKNOWN recovery path of savePapers(), so it gets a longer limit. Other writes
    // (assignment, PDF) keep waiting unless the caller gives a limit: aborting them could hide a half-finished issue,
    // so the assign panel treats a timeout as "결과 확인 필요" and re-sends the same batch id.
    const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs
      : method === "GET" ? 30000
      : route === "/archive-saved-papers" ? 90000 : 0;
    const controller = timeoutMs && typeof AbortController === "function" ? new AbortController() : null;
    const perform = async () => {
      // headers() throws when there is no login. That happens before fetch(), so nothing was sent: the error is marked
      // (requestNotSent) so a caller can tell "the request never left" from "sent, answer unknown" (network cut, timeout).
      let requestHeaders;
      try {
        requestHeaders = {
          ...headers(),
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
        };
      } catch (error) {
        if (error && typeof error === "object") error.requestNotSent = true;
        throw error;
      }
      const result = await fetch(base + route, {
        method,
        headers: requestHeaders,
        ...(body ? { body: JSON.stringify(body) } : {}),
        ...(controller ? { signal: controller.signal } : {}),
      });
      return { response: result, data: await result.json().catch(() => ({})) };
    };
    let response, data;
    if (timeoutMs) {
      let timer;
      const pending = perform();
      pending.catch(() => {});
      try {
        ({ response, data } = await Promise.race([
          pending,
          new Promise((_, reject) => {
            timer = setTimeout(() => {
              controller?.abort();
              const timeout = new Error("응답이 늦습니다. 잠시 뒤 다시 시도해 주세요.");
              timeout.timeout = true;
              reject(timeout);
            }, timeoutMs);
          }),
        ]));
      } finally {
        clearTimeout(timer);
      }
    } else ({ response, data } = await perform());
    if (!response.ok || data.success === false) {
      // error.message keeps the server text for diagnosis; screens show it through teacherErrorMessage()/status().
      const error = new Error(data.error || `요청 실패 (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }
  window.Archive2Api = { request: api };
  function context() {
    return {
      series: state.rounds.flatMap((r) => r.questionUids),
      student: [],
      coverage: null,
    };
  }
  function composeMetaMatches(record, filters = state.filters) {
    // A recorded numeric difficulty is an ordinary usage filter, independent of
    // metadata approval, source-bound display projection and the DIRECT meta index.
    // Strict semantic L1-L4 faceting continues to use its existing meta query.
    if (state.buckets.length && !state.buckets.includes(record.difficultyBucket)) return false;
    const hasMetaFilter = Boolean(filters.L1 || filters.L2 || filters.L3 || filters.L4);
    if (!hasMetaFilter) return true;
    const supplementalParent = record?.unverifiedTaxonomy ? workspaceScopeParent(record) : null;
    if (supplementalParent?.supplemental) {
      // A fallback L1/L2 classification is not a verified advanced taxonomy.
      // Recorded difficulty is independent and was checked above.
      if (filters.L3 || filters.L4) return false;
      return (!filters.L1 || scopeText(supplementalParent.L1) === scopeText(filters.L1)) &&
        (!filters.L2 || scopeText(supplementalParent.L2) === scopeText(filters.L2));
    }
    ensureMetaIndex();
    let allowed = V.renderComposeMetaFilters?.get(filters);
    if (!allowed) {
      // Existing MF-qualified selectors keep their established canonical authority path.
      const directFilters = {};
      for (const level of [1, 2, 3, 4]) {
        const value = filters[`L${level}`];
        if (value && !(level >= 3 && /^(?:mf|rpm):/.test(value)))
          directFilters[`rpmL${level}`] = value.replace(/^rpm:/, "");
      }
      const key = JSON.stringify([state.indexVersion, directFilters]);
      allowed = composeMetaQueryCache.get(key);
      if (!allowed) {
        allowed = new Set(ProblemBankMeta.query(state.metaIndex, directFilters, { profile: "DIRECT" })
          .map(row => row.questionUid));
        if (composeMetaQueryCache.size >= 8) composeMetaQueryCache.clear();
        composeMetaQueryCache.set(key, allowed);
      }
      V.renderComposeMetaFilters?.set(filters, allowed);
    }
    return allowed.has(record.questionUid);
  }
  function unifiedPrimaryMarkup(filters) {
    // 학년은 학년 색 버튼(학교별 기출·단원별 기출과 같은 구성요소), 과목은 2과목이면 2칸 전환·그 이상이면 칩이다.
    const subjects = Unified.subjectsForGrade(filters.grade);
    const locked = state.sealed || state.derivationSource || state.receipts.length > 0 ? "disabled" : "";
    // 과목이 둘뿐인 학년(고1: 공통수학1·공통수학2)은 눌린 단추가 목록에 들어 있는 과목이다. 과목을 따로 고르지 않은 상태(전체)는
    // 두 단추가 모두 눌린 상태이고, 한 과목만 고르면 그 단추만 눌린다. 필터 값은 단일 값 그대로다(새 상태 없음).
    const bothOn = subjects.length === 2 && !filters.semanticSubject;
    const pressed = (value) => `aria-pressed="${bothOn || String(filters.semanticSubject || "") === String(value)}"`;
    const subjectButton = ({ value, label }) =>
      button("compose-subject", esc(label), `type="button" data-subject="${esc(value)}" ${pressed(value)} ${locked}`);
    const subjectField = subjects.length === 2
      ? `<div class="cz-seg" role="group" aria-label="과목">${subjects.map(subjectButton).join("")}</div>`
      : subjects.length > 2
        ? `<div class="cz-chips" role="group" aria-label="과목">${[{ value: "", label: "전체 과목" }, ...subjects].map(subjectButton).join("")}</div>`
        : `<p class="compose-subject-note">${esc(subjects[0]?.label || "")}</p>`;
    const grades = HOME_GRADES.map(([label, id]) =>
      button("compose-grade", esc(label), `type="button" class="find-grade grade-${id}" data-grade="${label}" aria-pressed="${filters.grade === label}" ${locked}`)).join("");
    return `<div class="cz-block cz-who"><div class="cz-grades" role="group" aria-label="학년">${grades}</div>${subjectField}</div>`;
  }
  function filterMarkup(filters, prefix, compose = false) {
    if (compose === "primary" && unifiedIndex()) return unifiedPrimaryMarkup(filters);
    const unifiedDetail = compose === "detail" && Boolean(unifiedIndex());
    const courseLabel = (value) =>
      /^M([123])-([12])$/.test(value)
        ? value.replace(/^M([123])-([12])$/, "중$1 · $2학기")
        : value;
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    const courses = unifiedDetail ? [] : projected
      ? C.subjectProjectionOptions(filters.grade)
      : unique(
          taxonomyRowsForFilters({ ...filters, courseKey: "" })
            .map((r) => r.courseKey),
        ).map((value) => ({ value, label: courseLabel(value) }));
    const courseField = projected
      ? `<label>과목<select data-filter="semanticSubject" data-group="${prefix}">${options(courses, filters.semanticSubject, highSemantic ? "과목 선택" : "전체 과목")}</select></label>`
      : `<label>과목<select data-filter="courseKey" data-group="${prefix}">${options(courses, filters.courseKey, "전체 과목")}</select></label>`;
    if (compose === "primary")
      return `<div class="compose-step compose-grade"><div class="compose-step-head"><span class="compose-step-number">1</span><h2>학년</h2></div><label>학년<select data-filter="grade" data-group="compose">${options(["중1", "중2", "중3", "고1", "고2", "고3"], filters.grade, null)}</select></label></div>
        <div class="compose-step compose-subject"><div class="compose-step-head"><span class="compose-step-number">2</span><h2>교육과정 / 과목</h2></div><div class="compose-subject-fields"><label>교육과정<select data-filter="curriculumKey" data-group="compose">${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>${courseField}</div></div>`;
    if (compose === "detail")
      return `<div class="compose-detail-fields">${unifiedDetail ? `<label>교육과정<select data-filter="originalCurriculum" data-group="compose">${options([{ value: "2015", label: "2015 개정" }, { value: "2022", label: "2022 개정" }], filters.originalCurriculum, "전체")}</select></label>` : ""}<label>학교<select data-filter="school" data-group="compose">${options(finderSchoolValues(filters), filters.school, "전체 학교")}</select></label>
        <label>시험 시기<select data-filter="axis" data-group="compose">${options([{ value: "1-mid", label: "1학기 중간" }, { value: "1-final", label: "1학기 기말" }, { value: "2-mid", label: "2학기 중간" }, { value: "2-final", label: "2학기 기말" }], filters.axis, "전체 시험")}</select></label>
        <label>시작 연도<input type="number" min="2000" max="2100" data-filter="yearFrom" data-group="compose" value="${esc(filters.yearFrom || "")}" placeholder="전체"></label>
        <label>끝 연도<input type="number" min="2000" max="2100" data-filter="yearTo" data-group="compose" value="${esc(filters.yearTo || "")}" placeholder="전체"></label></div>`;
    return `<div class="filters"><label>학년<select data-filter="grade" data-group="${prefix}">${options(["중1", "중2", "중3", "고1", "고2", "고3"], filters.grade, compose ? null : "전체 학년")}</select></label>
      <label>교육과정<select data-filter="curriculumKey" data-group="${prefix}">${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>
      ${courseField}
      <label>학교<select data-filter="school" data-group="${prefix}">${options(
        finderSchoolValues(filters),
        filters.school,
        "전체 학교",
      )}</select></label>
      <label>시작 연도<input type="number" min="2000" max="2100" data-filter="yearFrom" data-group="${prefix}" value="${esc(filters.yearFrom || "")}" placeholder="전체"></label>
      <label>끝 연도<input type="number" min="2000" max="2100" data-filter="yearTo" data-group="${prefix}" value="${esc(filters.yearTo || "")}" placeholder="전체"></label>
      ${
        !compose && !filters.grade
          ? `<label>과목 계열<select data-filter="family" data-group="find">${options(
              [
                { value: "COMMON_1", label: "공통수학1 계열" },
                { value: "COMMON_2", label: "공통수학2 계열" },
                { value: "ALGEBRA", label: "대수 계열" },
                { value: "CALCULUS", label: "미적분 기초 계열" },
                { value: "CALCULUS_ADVANCED", label: "미적분 심화 계열" },
                { value: "PROB_STATS", label: "확률과통계" },
                { value: "GEOMETRY", label: "기하" },
              ],
              filters.family,
              "전체 계열",
            )}</select></label><label class="search">학교·단원·과목 검색<input data-filter="query" data-group="find" value="${esc(filters.query || "")}" placeholder="학교명, 과목, 단원으로 검색"></label>`
          : ""
      }
      <label>시험 시기<select data-filter="axis" data-group="${prefix}">${options(
        [
          { value: "1-mid", label: "1학기 중간" },
          { value: "1-final", label: "1학기 기말" },
          { value: "2-mid", label: "2학기 중간" },
          { value: "2-final", label: "2학기 기말" },
        ],
        filters.axis,
        "전체 시험",
      )}</select></label></div>`;
  }
  // Grade / curriculum / subject identity of an exam. With the unified layer the subject is the
  // unified (2022-based) subject of the units the exam covers, so a 2015 수학(상) exam with 도형의
  // 방정식 questions is found under 공통수학2 as well. Exams without any placed question keep the
  // shared matcher's own subject projection.
  // The exam list the home screen draws from: the full catalog once it is ready, else the small exam list it opened on.
  // Both keep the same order, so an index (data-exam) means the same exam in either.
  // 목록 모드(조각 3단계): 홈·학교별 기출은 시험지 목록(state.light)에서 그리고, 문항 조각은 눌린 단추가 필요로 할 때만 받는다. 카탈로그가
  // 아직 없거나, 단추 하나를 위해 받은 일부 조각(complete === false)만 있는 동안이다. 이때 시험지 줄의 순서·번호는 목록의 것이고(일부 조각의
  // exams는 일부라서 번호가 어긋난다), 학년·과목·검색은 finderTable(없으면 시험지 값만)로 판정한다. 다른 화면(문제지 만들기 등)은 영향 없다.
  function listMode() {
    if (!state.light) return false;
    if (!state.catalog) return true;
    return state.catalog.complete === false && (state.view === "find" || state.view === "home");
  }
  function catalogExams() {
    if (listMode()) return state.light.exams;
    return state.catalog?.exams || state.light?.exams || [];
  }
  function finderIdentityMatch(exam, filters) {
    // 목록 모드: 표가 있으면 아래 전체 규칙과 같은 규칙을 표로 판정하고(교육과정·과목·계열도), 아직 없으면 학년만 시험지 줄 값으로 가린다.
    if (listMode()) {
      const table = state.finderTable;
      if (!table) return C.finderMatches(exam, { grade: filters.grade }, new Map());
      const subject = filters.semanticSubject || Unified.subjectForFamily(filters.family);
      const matched = C.finderMatches(exam, { grade: filters.grade, curriculumKey: filters.curriculumKey, courseKey: filters.courseKey, semanticSubject: "" }, table.finderIndex);
      if (!matched || !subject) return matched;
      const covered = table.examSubjects.get(C.normalizeFile(exam.file));
      return covered?.size ? covered.has(subject) : C.finderMatches(exam, { semanticSubject: subject }, table.finderIndex);
    }
    if (!state.catalog) return C.finderMatches(exam, { grade: filters.grade }, new Map());
    const index = unifiedIndex();
    const subject = index ? filters.semanticSubject || Unified.subjectForFamily(filters.family) : "";
    const matched = C.finderMatches(
      exam,
      {
        grade: filters.grade,
        curriculumKey: filters.curriculumKey,
        courseKey: filters.courseKey,
        semanticSubject: index ? "" : filters.semanticSubject,
      },
      state.finderIndex,
    );
    if (!matched || !subject) return matched;
    const covered = Unified.examSubjects(index).get(C.normalizeFile(exam.file));
    return covered?.size
      ? covered.has(subject)
      : C.finderMatches(exam, { semanticSubject: subject }, state.finderIndex);
  }
  function finderUpstreamMatch(exam, filters) {
    if (!O.matchesMaterial(exam, filters.material)) return false;
    return finderIdentityMatch(exam, filters);
  }
  function finderSchoolValues(filters = state.find) {
    return unique(
      catalogExams()
        .filter((exam) => finderUpstreamMatch(exam, filters))
        .map((exam) => exam.school),
    ).sort((a, b) => a.localeCompare(b, "ko"));
  }
  function reconcileFinderSchool(filters = state.find) {
    const schools = finderSchoolValues(filters);
    if (filters.school && !schools.includes(filters.school))
      filters.school = "";
    return filters;
  }
  function originalSettingsForExam(exam) {
    let storedQpp = 4;
    try {
      storedQpp = Number(localStorage.getItem("APMATH_ARCHIVE2_ORIGINAL_QPP") || 4);
    } catch {}
    const qpp = [2, 4, 6, 8].includes(storedQpp) ? storedQpp : 4;
    return O.settings({
      header: {
        title: O.displayTitle(exam),
        subtitle: globalThis.ExamDisplayTitle?.displaySubjectOfExam?.(exam) ?? (exam.subject || exam.primaryStandardCourse),
      },
      qpp,
    });
  }
  const HOME_GRADES = Object.freeze([
    ["중1", "m1"], ["중2", "m2"], ["중3", "m3"], ["고1", "h1"], ["고2", "h2"], ["고3", "h3"],
  ]);
  const gradeClass = (grade) => {
    const found = HOME_GRADES.find(([label]) => label === String(grade || "").slice(0, 2));
    return found ? `grade-${found[1]}` : "grade-none";
  };
  // Recorded concept / type / template of one question for the preview rows and replacement
  // candidates, each tagged "(검토 대기)" unless its field status is approved.
  function metaTypeText(record) {
    const facets = C.metaFacetsOf(record);
    if (!facets) return "";
    const tag = (status) => (status === "approved" ? "" : " (검토 대기)");
    const parts = [];
    if (facets.l3) parts.push(`개념 ${facets.l3}${tag(facets.l3Status)}`);
    const pt = facets.pt && (metaFacetLabel("pt", facets.pt) || (C.advancedAuthority(record) === "rpm" ? record.L3 : ""));
    if (pt) parts.push(`유형 ${pt}${tag(facets.ptStatus)}`);
    const tpl = facets.tpl && (metaFacetLabel("tpl", facets.tpl) || (C.advancedAuthority(record) === "rpm" ? record.L4 : ""));
    if (tpl) parts.push(`풀이 ${tpl}${tag(facets.tplStatus)}`);
    return parts.join(" · ");
  }
  const displayTemplate = record => metaTypeText(record) ||
    (C.advancedAuthority(record) === "mf"
      ? window.ARCHIVE_META_FOUNDATION_LABELS?.templates?.[record.templateKey]?.label || record.L4
      : record.L4);
  // ---- 문제지 만들기 한 화면 (2026-11-10) -----------------------------------------------------------------
  // 왼쪽은 조건(renderPrimary·renderScopes·renderComposition), 오른쪽은 결과와 마무리(renderResult). 로직(선택 엔진·저장·
  // 초안 자동저장·고정/교체)은 그대로이고 마크업만 이 두 칸으로 재배치했다. 조건을 바꿔도 자동으로 다시 뽑지 않는다
  // (교사가 고정·교체한 문항이 사라지기 때문). 대신 "지금 조건으로 N문항 가능 · 요청 M문항"을 항상 보인다.
  // 선택된 문항의 단원 이름: 통합 단원 목록의 이름을 먼저 쓰고, 없으면 기록된 L2를 쓴다.
  const composeUnitLabel = (record) => unifiedIndex()?.byUid.get(record.questionUid)?.unitLabel || record.L2 || "";
  // The recorded-meta index is built the first time a screen needs it (quick assessments, compose meta
  // filters), never at boot. Tests that set metaIndex and metaIndexSource together keep their index.
  function ensureMetaIndex() {
    if (!state.catalog?.records || !ProblemBankMeta) return state.metaIndex;
    if (state.metaIndexSource !== state.catalog.records) {
      Boot?.begin?.("meta-index");
      state.metaIndex = ProblemBankMeta.buildIndex(state.catalog.records, []);
      state.metaIndexSource = state.catalog.records;
      composeMetaQueryCache.clear();
      Boot?.end?.("meta-index");
    }
    return state.metaIndex;
  }
  const UNPLACED_REASON_LABELS = {
    GRADE_UNRESOLVED: "학년 근거 없음(등록 학년 미확정)",
  };
  function showDialog(title, body) {
    $("modal").classList.remove("original-issue-dialog", "saved-paper-issue-dialog");
    $("modal-body").innerHTML =
      `<h2 id="modal-title">${esc(title)}</h2>${body}`;
    if (!$("modal").open) $("modal").showModal();
  }
  Object.assign(WS.api, {
    frozenPaperCache,
    composeMetaQueryCache,
    workspaceMatchOptions,
    lockedIndex,
    ownHistoryContext,
    $,
    esc,
    options,
    advancedOptions,
    button,
    badge,
    unique,
    workspaceScopeParentCache,
    workspaceUseMode,
    isSourceRoutedGeneralRange,
    sourceRoutedFallbackMatches,
    workspaceEligibility,
    workspaceMatches,
    unifiedIndex,
    UNIFIED_ONLY_FILTERS,
    omitUnifiedFilters,
    META_FACET_FILTERS,
    hasMetaFacetFilter,
    withoutMetaFacets,
    META_FOUNDATION_LABELS,
    metaFacetLabel,
    stripUnifiedFilters,
    reconcileUnifiedFilters,
    withDefaultComposeSubject,
    composeSubjectLabel,
    workspaceScopeParent,
    SAVED_PAPER_UUID,
    savedPaperIds,
    FIVE_MINUTE_RECIPE_KEY,
    FIVE_MINUTE_TITLE,
    SUBUNIT_RECIPE_KEY,
    SUBUNIT_TITLE,
    UNIT_RECIPE_KEY,
    UNIT_TITLE,
    MONTHLY_RECIPE_KEY,
    MONTHLY_TITLE,
    ASSESSMENT_RECIPE_TITLES,
    ASSESSMENT_RECIPE_KEYS,
    activeAssessmentRecipe,
    isAssessmentRecipeMode,
    activeAssessmentRecipeUids,
    assessmentSelectionOptions,
    scopeText,
    scopeCourseKey,
    scopeParentKey,
    taxonomyRowsForFilters,
    computeTaxonomyRowsForFilters,
    state,
    catalogExams,
    listMode,
    Quick,
    QuickTree,
    quickState,
    quickProduct,
    quickPreset,
    isQuickAssessmentView,
    navViewActive,
    session,
    storageKey,
    headers,
    api,
    context,
    composeMetaMatches,
    unifiedPrimaryMarkup,
    filterMarkup,
    finderIdentityMatch,
    finderUpstreamMatch,
    finderSchoolValues,
    reconcileFinderSchool,
    originalSettingsForExam,
    HOME_GRADES,
    gradeClass,
    metaTypeText,
    displayTemplate,
    composeUnitLabel,
    ensureMetaIndex,
    UNPLACED_REASON_LABELS,
    showDialog,
  });
})();
