(function () {
  "use strict";
  const C = window.Archive2Core,
    Source = window.Archive2Source;
  const ProblemBankMeta = window.ProblemBankMeta;
  const AssessmentRecipes = window.ProblemBankAssessmentRecipes;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const History = window.Archive2History;
  // Similar-problem sets paired with their original exams (computed once per catalog load).
  const Similar = window.Archive2Similar;
  // Unified 2022-based unit layer (user decision 2026-10-29). When the shared module is not
  // loaded the compose screen falls back to the canonical-parent scope list.
  const Unified = window.Archive2UnifiedUnits;
  // First screen first (2026-11-10): archive2-boot.js owns progress, timing marks and the paint gate.
  // Every use is optional so test harnesses and pages without it keep working.
  const Boot = window.Archive2Boot;
  const frozenPaperCache = new Map();
  const composeMetaQueryCache = new Map();
  let renderComposeMetaFilters = null;
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
  let renderEligibilityCache = null;
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
    if (!renderEligibilityCache) return evaluate(record, state);
    if (!renderEligibilityCache.has(record))
      renderEligibilityCache.set(record, evaluate(record, state));
    return renderEligibilityCache.get(record);
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
    if (!hasMetaFacetFilter(filters)) return filters;
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
  function assessmentSelectionOptions() {
    if (!isAssessmentRecipeMode() || !AssessmentRecipes?.representativeGroup) return {};
    const byUid = new Map((ensureMetaIndex() || []).map(row => [row.questionUid || row.uid, row]));
    return { representativeGroupFor: record =>
      AssessmentRecipes.representativeGroup(byUid.get(record.questionUid)) };
  }
  const HOME_PRODUCT_REGISTRY = Object.freeze([
    Object.freeze({
      productKey: "school-exams",
      label: "학교 기출",
      availability: true,
      routeOwner: "finder",
      routeResolver: () =>
        new URL("workspace.html?view=find&material=exam", location.href).href,
    }),
    Object.freeze({
      productKey: "generated-bank",
      label: "모의고사",
      availability: true,
      routeOwner: "generated-consumer",
      routeResolver: () => new URL("generated-bank.html", location.href).href,
    }),
    Object.freeze({
      productKey: "five-minute-test",
      label: "5분 테스트",
      availability: true,
      routeOwner: "five-minute-test",
      routeResolver: () =>
        new URL("workspace.html?view=five-minute", location.href).href,
    }),
    Object.freeze({
      productKey: "subunit-assessment",
      label: "소단원 평가",
      availability: true,
      routeOwner: "subunit-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=subunit-test", location.href).href,
    }),
    Object.freeze({
      productKey: "unit-assessment",
      label: "중단원 평가",
      availability: true,
      routeOwner: "unit-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=unit-test", location.href).href,
    }),
    Object.freeze({
      productKey: "exam-prep",
      label: "종합평가",
      availability: true,
      routeOwner: "monthly-assessment",
      routeResolver: () =>
        new URL("workspace.html?view=monthly-test", location.href).href,
    }),
  ]);
  function homeProductMarkup(product) {
    const attrs = `data-product-key="${esc(product.productKey)}" data-route-owner="${esc(product.routeOwner || "")}" data-availability="${String(product.availability)}"`;
    if (product.availability && typeof product.routeResolver === "function")
      return button(
        "home-product",
        esc(product.label),
        `type="button" class="archive-home-product is-available" ${attrs}`,
      );
    return `<div class="archive-home-product is-unavailable" ${attrs} aria-disabled="true"><span>${esc(product.label)}</span></div>`;
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
  let renderTaxonomyRowsCache = null;
  const taxonomyRowsForFilters = (filters) => {
    if (!renderTaxonomyRowsCache) return computeTaxonomyRowsForFilters(filters);
    let key;
    try {
      key = JSON.stringify(filters, (name, value) =>
        value === "" || value === null || value === undefined ? undefined : value);
    } catch { return computeTaxonomyRowsForFilters(filters); }
    if (!renderTaxonomyRowsCache.has(key))
      renderTaxonomyRowsCache.set(key, computeTaxonomyRowsForFilters(filters));
    return renderTaxonomyRowsCache.get(key);
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
    composeAnnounce: "",
    assignBusy: false,
  };
  let finderFilterRenderTimer = null;
  // Quick assessments (5분 테스트 / 소단원 / 중단원 / 종합평가) draw from pools built on the
  // unified unit layer (archive2-quick-pools.js) and use the existing catalog and output engine
  // without changing the compose draft or its selection controls.
  const Quick = window.Archive2QuickPools;
  const quickState = { grade: "", subject: "", busy: false, bundle: new Set(),
    presets: { "five-minute": "standard", "subunit-test": "standard", "unit-test": "standard", "monthly-test": "standard" } };
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

  function scheduleFinderFilterRender() {
    clearTimeout(finderFilterRenderTimer);
    finderFilterRenderTimer = setTimeout(() => {
      finderFilterRenderTimer = null;
      if (state.view !== "find") return;
      const activeFilter = document.activeElement?.dataset?.group === "find"
        ? document.activeElement.dataset.filter
        : null;
      render();
      if (activeFilter) {
        [...document.querySelectorAll('[data-group="find"][data-filter]')]
          .find((el) => el.dataset.filter === activeFilter)
          ?.focus?.({ preventScroll: true });
      }
    }, 0);
  }
  let lastRenderedView = state.view;
  let autosaveTimer,
    previewTimer,
    recentRefetchTimer = null,
    recentPdfRetryIds = new Set(),
    recentPdfMutationVersions = new Map(),
    recentSubjectOptionUniverse = new Map(),
    derivedBaseLoad = null,
    previewOutputEnvelope = null,
    candidateRecords = [],
    replacementIndex = -1,
    classRows = [],
    rosterRows = [];
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
    if (s?.session_token) return { Authorization: "Bearer " + s.session_token };
    const mem = window.__APMATH_AUTH_MEMORY || {},
      login = mem.login_id || s?.login_id || s?.loginId,
      password = mem.raw_password || s?.raw_password;
    if (login && password)
      return {
        Authorization:
          "Basic " + btoa(unescape(encodeURIComponent(login + ":" + password))),
      };
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
      const result = await fetch(base + route, {
        method,
        headers: {
          ...headers(),
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
        },
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
  const HANGUL = /[가-힣]/;
  // Text for teachers: Korean messages are already written for them; anything else (a code, English) is replaced by
  // `fallback`. The original error keeps its `code`/`message` for diagnosis.
  const GENERIC_ERROR = "작업을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
  function teacherErrorMessage(error, fallback = GENERIC_ERROR) {
    // Same rule as status(): a leading CODE: is dropped and the Korean reason behind it is kept.
    const text = String(typeof error === "string" ? error : error?.message || "").replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
    return HANGUL.test(text) ? text : fallback;
  }
  // Errors also get a fixed, dismissible alert so a failure below the fold (or behind a dialog) is not missed.
  let errorToastEl = null;
  let errorToastCloseHooked = false;
  function hideErrorToast() {
    try { errorToastEl?.parentNode?.removeChild(errorToastEl); } catch {}
  }
  function showErrorToast(message) {
    try {
      if (typeof document.createElement !== "function" || !document.body) return;
      if (!errorToastEl) {
        const box = document.createElement("div");
        box.className = "error-toast";
        box.setAttribute("role", "alert");
        const text = document.createElement("p");
        text.className = "error-toast-text";
        const close = document.createElement("button");
        close.type = "button";
        close.className = "error-toast-close";
        close.setAttribute("aria-label", "오류 알림 닫기");
        close.textContent = "닫기";
        close.addEventListener("click", hideErrorToast);
        box.append(text, close);
        errorToastEl = box;
      }
      errorToastEl.firstChild.textContent = message;
      // A modal <dialog> makes everything outside it inert, so the alert lives inside the open dialog when there is one.
      const host = document.querySelector("dialog[open]") || document.body;
      hideErrorToast();
      host.appendChild(errorToastEl);
      if (!errorToastCloseHooked) {
        errorToastCloseHooked = true;
        // When that dialog closes, keep the alert on screen (until the teacher dismisses it).
        document.addEventListener("close", (event) => {
          if (errorToastEl && errorToastEl.parentNode === event.target) document.body.appendChild(errorToastEl);
        }, true);
      }
    } catch (e) { console.warn("[archive2] error alert unavailable:", e); }
  }
  function status(message, error = false) {
    if (error) {
      // Last line of defence: a leading CODE: or a non-Korean (English) message never reaches the teacher as-is.
      const raw = String(message ?? "");
      const stripped = raw.replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
      message = HANGUL.test(stripped) ? stripped
        : "작업을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
      if (message !== raw) console.warn("[archive2] error text replaced for display:", raw);
    }
    $("status").textContent = message;
    $("status").classList.toggle("error", error);
    if (error) showErrorToast(message);
    else hideErrorToast();
  }
  function draft() {
    const keys = [
      "draftId",
      "filters",
      "scopes",
      "distribution",
      "count",
      "buckets",
      "difficultyFilterVersion",
      "includeExtended",
      "custom",
      "seed",
      "rows",
      "round",
      "rounds",
      "sealed",
      "title",
      "qpp",
      "includeQr",
      "header",
      "studentIds",
      "classId",
      "studentLabels",
      "historyMode",
      "recentDays",
      "sources",
      "receipts",
      "failedPart",
      "issueDate",
      "saveBatchId",
      "saveSignature",
      "savedPaperIds",
      "lastSavedPaperIds",
      "saveMessage",
      "saveError",
      "saveResultSignature",
      "saveResultState",
      "derivationSource",
      "composeShortage",
    ];
    return {
      schemaVersion: C.VERSION,
      taxonomyVersion: C.TAXONOMY_VERSION,
      indexVersion: state.indexVersion,
      updatedAt: new Date().toISOString(),
      ...Object.fromEntries(keys.map((k) => [k, state[k]])),
      scopeSourcePaths: selectedScopePaths(),
      scopeQuestionUids: selectedScopeQuestionUids(),
      selected: state.selected.map((r) => ({
        questionUid: r.questionUid,
        rowId: r.rowId,
        sourceFingerprint: r.sourceFingerprint,
      })),
      pins: [...state.pins],
    };
  }
  function drafts() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey()) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
  function save() {
    if (
      !state.catalog ||
      (!state.scopes.length && !state.selected.length && !state.receipts.length)
    )
      return;
    const record = draft();
    try {
      localStorage.setItem(
        storageKey(),
        JSON.stringify(
          [
            record,
            ...drafts().filter((d) => d.draftId !== record.draftId),
          ].slice(0, 20),
        ),
      );
    } catch {
      status(
        "브라우저 저장 공간이 부족합니다. 작업 파일 저장으로 보관하세요.",
        true,
      );
    }
  }
  function scheduleSave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(save, 450);
  }
  // A backup file (or a stored draft) is untrusted input: its values end up in form fields, counters
  // and requests. Every key is checked against the type draft() produces before anything is copied
  // into state. The whole file is refused (nothing is applied) when a single value does not fit.
  function validateDraftTypes(data) {
    const fail = (key) => {
      throw new Error(`이 작업 파일은 형식이 올바르지 않아 불러올 수 없습니다(항목: ${key}). 이 화면에서 내려받은 작업 백업 파일인지 확인해 주세요.`);
    };
    if (!data || typeof data !== "object" || Array.isArray(data)) fail("파일 전체");
    const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
    const isInt = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
    const isFiniteNumber = (v) => typeof v === "number" && Number.isFinite(v);
    const isStr = (v, max = 4000) => typeof v === "string" && v.length <= max;
    const isStrArr = (v, max = 60000) => Array.isArray(v) && v.length <= max && v.every((x) => isStr(x, 2000));
    const isBuckets = (v) => Array.isArray(v) && v.length <= 5 && v.every((x) => isInt(x, 1, 5));
    const isScalar = (v) => v === null || typeof v === "boolean" || isStr(v) || (typeof v === "number" && Number.isFinite(v));
    const rules = {
      draftId: (v) => typeof v === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(v),
      indexVersion: (v) => isStr(v, 200),
      filters: (v) => isObj(v) && Object.values(v).every((x) =>
        isScalar(x) || (Array.isArray(x) && x.length <= 500 && x.every(isScalar))),
      scopes: (v) => isStrArr(v, 5000),
      scopeSourcePaths: (v) => isStrArr(v),
      scopeQuestionUids: (v) => isStrArr(v),
      distribution: (v) => ["equal", "pool", "custom", "all"].includes(v),
      // The count inputs do not stop typing 10.5, -3 or 1200, and autosave stores that; such a draft
      // must still open. Any finite number passes here and normalizeDraftNumbers() clamps it.
      count: isFiniteNumber,
      buckets: isBuckets,
      difficultyFilterVersion: (v) => isStr(v, 100),
      includeExtended: (v) => typeof v === "boolean",
      custom: (v) => isObj(v) && Object.values(v).every((x) => isObj(x) &&
        (x.count === undefined || isFiniteNumber(x.count)) &&
        (x.buckets === undefined || isBuckets(x.buckets))),
      seed: (v) => isStr(v, 200),
      rows: (v) => Array.isArray(v) && v.length <= 5000 && v.every((row) => isObj(row) &&
        isStr(row.id, 2000) &&
        (row.label === undefined || isStr(row.label)) &&
        (row.count === undefined || isFiniteNumber(row.count)) &&
        (row.difficultyBuckets === undefined || isBuckets(row.difficultyBuckets)) &&
        (row.paths === undefined || isStrArr(row.paths)) &&
        (row.scopeQuestionUids === undefined || isStrArr(row.scopeQuestionUids))),
      round: (v) => isInt(v, 1, 999),
      rounds: (v) => Array.isArray(v) && v.length <= 999 && v.every((round) => isObj(round) &&
        isStrArr(round.questionUids) && (round.roundNo === undefined || isInt(round.roundNo, 1, 999))),
      sealed: (v) => typeof v === "boolean",
      title: (v) => isStr(v, 500),
      qpp: (v) => [1, 2, 4, 6, 8].includes(v),
      includeQr: (v) => typeof v === "boolean",
      header: (v) => isObj(v) && ["title", "subtitle", "metaRight"].every((k) => v[k] === undefined || isStr(v[k], 500)) &&
        ["showNameLine", "showScoreLine", "applyToSolution", "applyToAnswer"].every((k) => v[k] === undefined || typeof v[k] === "boolean"),
      studentIds: (v) => isStrArr(v, 2000),
      classId: (v) => isStr(v, 200),
      studentLabels: (v) => isStrArr(v, 2000),
      historyMode: (v) => isStr(v, 40),
      recentDays: (v) => isInt(v, 0, 3650),
      sources: (v) => isStrArr(v, 5000),
      receipts: (v) => Array.isArray(v) && v.length <= 999 && v.every((r) => isObj(r) &&
        ["key", "classId", "className", "id"].every((k) => r[k] === undefined || isStr(r[k], 500)) &&
        (r.partIndex === undefined || isInt(r.partIndex, 0, 999)) &&
        (r.questionUids === undefined || isStrArr(r.questionUids)) &&
        (r.ready === undefined || typeof r.ready === "boolean")),
      failedPart: (v) => v === null || (isObj(v) && isInt(v.index, 0, 999) && isStr(v.message)),
      issueDate: (v) => isStr(v, 40),
      saveBatchId: (v) => isStr(v, 200),
      saveSignature: (v) => typeof v === "string",
      savedPaperIds: (v) => isStrArr(v, 999),
      lastSavedPaperIds: (v) => isStrArr(v, 999),
      saveMessage: (v) => isStr(v),
      saveError: (v) => isStr(v),
      saveResultSignature: (v) => typeof v === "string",
      saveResultState: (v) => ["", "SAVED", "FAILED", "SAVING", "RESULT_UNKNOWN"].includes(v),
      derivationSource: (v) => v === null || isObj(v),
      composeShortage: (v) => Array.isArray(v) && v.length <= 200 && v.every((item) => isObj(item) &&
        isStr(item.label, 500) && isBuckets(item.difficultyBuckets) && isInt(item.requested, 0, 100000) && isInt(item.got, 0, 100000)),
      pins: (v) => isStrArr(v, 5000),
      selected: (v) => Array.isArray(v) && v.length <= 400 && v.every((r) => isObj(r) &&
        isStr(r.questionUid, 200) && (r.rowId === undefined || isStr(r.rowId, 2000)) &&
        (r.sourceFingerprint === undefined || isStr(r.sourceFingerprint, 500))),
    };
    for (const [key, ok] of Object.entries(rules)) {
      if (data[key] === undefined) continue;
      if (!ok(data[key])) fail(key);
    }
  }
  // Brings the counts a teacher could type (10.5, -3, 1200) back into the range the screen allows.
  function normalizeDraftNumbers(data) {
    const clamp = (v, min, max) => Math.min(max, Math.max(min, Math.round(v)));
    const out = { ...data };
    if (out.count !== undefined) out.count = clamp(out.count, 1, 400);
    if (out.custom)
      out.custom = Object.fromEntries(Object.entries(out.custom).map(([key, value]) =>
        [key, value.count === undefined ? value : { ...value, count: clamp(value.count, 1, 400) }]));
    if (out.rows)
      out.rows = out.rows.map((row) => row.count === undefined ? row : { ...row, count: clamp(row.count, 0, 100000) });
    return out;
  }
  function applyDraft(data) {
    validateDraftTypes(data);
    data = normalizeDraftNumbers(data);
    if (
      data.schemaVersion !== C.VERSION ||
      data.taxonomyVersion !== C.TAXONOMY_VERSION ||
      !Array.isArray(data.selected) ||
      !Array.isArray(data.scopes) ||
      !data.filters ||
      !Array.isArray(data.rounds) ||
      data.selected.length > 400
    )
      throw new Error("지원하지 않는 작업 파일입니다.");
    if (
      data.selected.some(
        (r) => !C.UID.test(r.questionUid) || !state.byUid.has(r.questionUid),
      )
    )
      throw new Error("현재 아카이브에 없는 문항이 포함되어 있습니다.");
    if (
      data.selected.some(
        (r) =>
          r.sourceFingerprint &&
          r.sourceFingerprint !==
            state.byUid.get(r.questionUid).sourceFingerprint,
      )
    )
      throw new Error(
        "원본 문항이 변경되었습니다. 과거 작업을 조용히 새 문항으로 복원하지 않습니다. 새 작업에서 다시 만들어 주세요.",
      );
    if (
      !Array.isArray(data.rows) ||
      !Array.isArray(data.pins) ||
      !Array.isArray(data.studentIds) ||
      !Array.isArray(data.sources) ||
      !Array.isArray(data.receipts) ||
      !data.header ||
      !data.custom
    )
      throw new Error("작업 파일의 필수 정보가 없습니다.");
    if (
      data.rounds.some(
        (round) =>
          !Array.isArray(round.questionUids) ||
          round.questionUids.some((uid) => !C.UID.test(uid)),
      )
    )
      throw new Error("시리즈 이력 정보가 잘못되었습니다.");
    const unifiedDraft = Boolean(unifiedIndex());
    const restoredFilters = unifiedDraft
      ? reconcileUnifiedFilters({ ...data.filters })
      : C.reconcileFinderFilters(
        { ...data.filters },
        state.catalog.taxonomy,
      );
    const hasLegacyDetail = ["L3", "L4"].some(
      field => restoredFilters[field] && !/^(mf|rpm):/.test(restoredFilters[field]),
    );
    if (hasLegacyDetail) {
      const scopePaths = unique(data.scopeSourcePaths || data.rows.flatMap(row => row.paths || (row.path ? [row.path] : [])));
      if (!scopePaths.length)
        throw new Error("현재 분류 기준이 변경되어 범위를 다시 선택해야 합니다.");
      Object.assign(restoredFilters, C.migrateLegacyAdvancedFilters(
        restoredFilters, state.catalog.records, scopePaths, data.sources, state.catalog.canonicalAuthority,
      ));
    }
    const savedScopePaths = unique(data.scopeSourcePaths || data.rows.flatMap(row => row.paths || (row.path ? [row.path] : [])));
    if (!unifiedDraft && data.scopes.length && !savedScopePaths.length)
      throw new Error("현재 분류 기준이 변경되어 범위를 다시 선택해야 합니다.");
    let currentScopes = [];
    const previousScopeState = {
      filters: state.filters,
      scopes: state.scopes,
      sources: state.sources,
      buckets: state.buckets,
      rounds: state.rounds,
      includeExtended: state.includeExtended,
      uidRoute: state.uidRoute,
    };
    try {
      // The restored draft's own scopes are listed, not the UID route's fixed scope.
      state.uidRoute = null;
      state.filters = restoredFilters;
      state.scopes = [];
      state.sources = data.sources;
      state.buckets = Array.isArray(data.buckets) ? data.buckets : [];
      state.rounds = data.rounds;
      state.includeExtended = data.includeExtended === true;
      currentScopes = scopeOptions();
    } finally {
      Object.assign(state, previousScopeState);
    }
    let restoredScopeKeys;
    let droppedScopeCount = 0;
    if (unifiedDraft) {
      // Scope keys from the previous (per-curriculum) list are not valid unit keys any more.
      // Drop them with a visible notice instead of rejecting the whole draft; selected
      // questions and their frozen rows are kept as saved.
      const currentKeys = new Set(currentScopes.map(scope => scope.key));
      restoredScopeKeys = data.scopes.filter(key => currentKeys.has(key));
      droppedScopeCount = data.scopes.length - restoredScopeKeys.length;
    } else {
      const currentScopePaths = new Set(currentScopes.flatMap(scope => scope.paths));
      if (savedScopePaths.some(path => !currentScopePaths.has(path)))
        throw new Error("현재 분류 기준이 변경되어 범위를 다시 선택해야 합니다.");
      restoredScopeKeys = currentScopes
        .filter(scope => scope.paths.some(path => savedScopePaths.includes(path)))
        .map(scope => scope.key);
      if (data.scopes.length && !restoredScopeKeys.length)
        throw new Error("현재 분류 기준이 변경되어 범위를 다시 선택해야 합니다.");
    }
    const allowed = Object.keys(draft()).filter(
      (k) =>
        !["schemaVersion", "taxonomyVersion", "updatedAt", "selected", "scopeSourcePaths", "scopeQuestionUids"].includes(
          k,
        ),
    );
    for (const key of allowed)
      if (data[key] !== undefined) state[key] = data[key];
    state.derivationSource = data.derivationSource || null;
    // 모자라게 뽑은 문제지는 모자람 안내도 함께 복원한다(결과가 없으면 안내할 것도 없다).
    state.composeShortage = data.selected.length && Array.isArray(data.composeShortage)
      ? data.composeShortage.map((item) => ({ label: item.label, difficultyBuckets: item.difficultyBuckets, requested: item.requested, got: item.got }))
      : [];
    state.composeStale = false;
    state.composeNotice = "";
    state.includeExtended = data.includeExtended === true;
    state.derivedBaseQuestions = null;
    derivedBaseLoad = null;
    if (state.derivationSource && (
      state.derivationSource.parentKind !== "SAVED_PAPER" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(state.derivationSource.parentId || "")) ||
      !/^[0-9a-f]{64}$/i.test(String(state.derivationSource.parentSnapshotHash || "")) ||
      !["REVISION", "FORK"].includes(state.derivationSource.derivationType) ||
      (state.derivationSource.parentDisplayName != null && typeof state.derivationSource.parentDisplayName !== "string")
    )) throw new Error("저장 시험지 계보 정보를 확인할 수 없습니다.");
    state.lastSavedPaperIds = savedPaperIds(
      Array.isArray(data.lastSavedPaperIds)
        ? data.lastSavedPaperIds
        : data.savedPaperIds?.length
          ? data.savedPaperIds
          : state.derivationSource?.parentKind === "SAVED_PAPER"
            ? [state.derivationSource.parentId]
            : [],
    );
    if (data.saveResultSignature === undefined) {
      state.saveBatchId = "";
      state.saveSignature = "";
      state.savedPaperIds = [];
      state.saveMessage = "";
      state.saveError = "";
      state.saveResultSignature = "";
      state.saveResultState = "";
    } else if (data.saveResultState === undefined) {
      state.saveResultState = data.savedPaperIds?.length ? "SAVED" : data.saveError ? "FAILED" : "";
    }
    if (state.saveResultState === "SAVING") state.saveResultState = "RESULT_UNKNOWN";
    const hadUidRoute = Boolean(state.uidRoute || state.urlUids.length);
    state.uidRoute = null;
    state.urlUids = [];
    state.filters = restoredFilters;
    state.scopes = restoredScopeKeys;
    state.scopeNotice = droppedScopeCount
      ? `이전 작업의 출제 범위 ${droppedScopeCount}개는 새 단원 목록에 없어 선택에서 제외했습니다. 필요한 단원을 다시 선택해 주세요.`
      : "";
    // Old unopened drafts inherited [2, 3] without a user choosing difficulty.
    if (!data.selected.length && data.difficultyFilterVersion !== "optional-v1" &&
        data.distribution !== "custom" && JSON.stringify(data.buckets) === "[2,3]") {
      state.buckets = [];
      state.rows = state.rows.map(row => ({ ...row, difficultyBuckets: [] }));
    }
    state.difficultyFilterVersion = "optional-v1";
    if (!state.receipts.length && !state.sealed)
      reconcileFinderSchool(state.filters);
    state.selected = data.selected.map((r) => ({
      ...state.byUid.get(r.questionUid),
      rowId: r.rowId,
    }));
    state.receipts = state.receipts.map((r) => {
      const partIndex = Number.isInteger(r.partIndex)
        ? r.partIndex
        : Number(r.key?.match(/-(\d+)-(\d+)-[a-f0-9]{12}$/)?.[2] || 0);
      return {
        ...r,
        partIndex,
        questionUids:
          r.questionUids ||
          state.selected
            .slice(partIndex * 50, partIndex * 50 + 50)
            .map((q) => q.questionUid),
      };
    });
    state.sealed = Parts.status(state.selected.length, state.receipts).complete;
    state.history = null;
    state.historyReady = false;
    state.targetVersion++;
    state.prepared = [];
    state.undo = [];
    state.ackWarnings = false;
    state.view = "compose";
    state.inspector = "summary";
    if (hadUidRoute) replaceUrlState();
    render();
    status(
      (data.indexVersion === state.catalog.indexVersion
        ? "이전 작업을 복원했습니다. 이전 출제 확인은 필요할 때 고급 설정에서 실행할 수 있습니다."
        : "문항 목록이 갱신되었습니다. 다시 만들기한 뒤 출력하세요.") +
        (state.scopeNotice ? " " + state.scopeNotice : ""),
      data.indexVersion !== state.catalog.indexVersion || Boolean(state.scopeNotice),
    );
    if (state.studentIds.length) refreshHistory();
  }
  function validateSavedPaperRevision(paper) {
    const snapshot = paper?.snapshot;
    if (!paper?.id || !/^[0-9a-f]{64}$/i.test(String(paper.snapshot_hash || "")) ||
        !Array.isArray(snapshot?.questions) || !snapshot.questions.length || snapshot.questions.length > 50 ||
        !snapshot.meta || !snapshot.selectionFilters)
      throw new Error("저장한 시험지를 수정용으로 열 수 없습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
    const questionUids = snapshot.meta.questionUids || snapshot.questions.map(question => question.questionUid);
    if (!Array.isArray(questionUids) || questionUids.length !== snapshot.questions.length ||
        questionUids.some((uid, index) => uid !== snapshot.questions[index]?.questionUid) ||
        new Set(questionUids).size !== questionUids.length)
      throw new Error("저장한 시험지의 문항 순서를 확인할 수 없습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
    const records = snapshot.questions.map((question) => {
      const record = state.byUid.get(question.questionUid);
      const sourceFile = String(question.sourceArchiveFile || question.sourceFile || question._sourceFile || "");
      if (!record || !question.sourceFingerprint ||
          String(question.sourceFingerprint) !== String(record.sourceFingerprint) ||
          sourceFile !== String(record.sourceFile || "") ||
          Number(question.sourceOrdinal) !== Number(record.sourceOrdinal))
        throw new Error("원본 문항이 바뀌어, 저장 당시 내용 그대로는 수정본을 열 수 없습니다. 저장한 시험지는 그대로 출력할 수 있습니다.");
      return { ...record, rowId: "saved-paper-revision" };
    });
    const selectionFilters = snapshot.selectionFilters;
    const paths = Array.isArray(selectionFilters.primaryPaths) && selectionFilters.primaryPaths.length
      ? [...new Set(selectionFilters.primaryPaths.map(String))]
      : [...new Set(records.map(record => C.pathKey(record, 4)))];
    const scopeQuestionUids = Array.isArray(selectionFilters.scopeQuestionUids) && selectionFilters.scopeQuestionUids.length
      ? [...new Set(selectionFilters.scopeQuestionUids.map(String))]
      : records.map(record => record.questionUid);
    const row = {
      id: "saved-paper-revision",
      label: "원본 저장 시험지 범위",
      depth: 4,
      count: records.length,
      paths,
      scopeQuestionUids,
      difficultyBuckets: [],
    };
    for (const record of records)
      // Papers saved before the unified list recorded raw path keys; unified papers record the
      // general-mode keys of their fallback taxonomy. Either must be accepted.
      if (!C.rowMatches(record, row) && !C.rowMatches(record, row, workspaceMatchOptions()))
        throw new Error("저장 당시의 범위가 지금의 단원·분류 기준과 달라 수정본을 안전하게 열 수 없습니다. 저장한 시험지는 그대로 출력할 수 있습니다.");
    const filters = { ...selectionFilters };
    delete filters.sourceFiles;
    delete filters.primaryPaths;
    delete filters.scopeQuestionUids;
    delete filters.difficultyBuckets;
    return { snapshot, records, row, filters, selectionFilters };
  }
  function applySavedPaperRevision(paper) {
    const validated = validateSavedPaperRevision(paper);
    const snapshot = validated.snapshot;
    state.uidRoute = null;
    state.urlUids = [];
    const title = String(snapshot.meta.title || paper.title || "저장 시험지 수정본");
    const header = snapshot.meta.printHeaderOptions || { title };
    state.draftId = crypto.randomUUID();
    state.filters = unifiedIndex() ? reconcileUnifiedFilters(validated.filters) : validated.filters;
    state.scopes = [];
    state.sources = Array.isArray(validated.selectionFilters.sourceFiles)
      ? [...validated.selectionFilters.sourceFiles]
      : [...new Set(validated.records.map(record => record.sourceFile))];
    state.distribution = "custom";
    state.count = validated.records.length;
    state.buckets = [];
    state.includeExtended = validated.records.some(record => record.curriculumApplicability === "RPM_EXTENDED") ||
      snapshot.meta.includeExtended === true;
    state.custom = {};
    state.rows = [validated.row];
    state.selected = validated.records;
    state.pins = [];
    state.round = 1;
    state.rounds = [];
    state.sealed = false;
    state.title = title;
    state.header = { ...header, title: String(header.title || title) };
    state.qpp = Number(snapshot.meta.qpp) || 4;
    state.includeQr = snapshot.meta.includeQr === true;
    state.indexVersion = state.catalog.indexVersion;
    state.studentIds = [];
    state.classId = "";
    state.studentLabels = [];
    state.receipts = [];
    state.saveBatchId = "";
    state.saveSignature = "";
    state.savedPaperIds = [];
    state.lastSavedPaperIds = [paper.id];
    state.saveMessage = "";
    state.saveError = "";
    state.saveResultSignature = "";
    state.saveResultState = "";
    state.derivationSource = {
      parentKind: "SAVED_PAPER",
      parentId: paper.id,
      parentRevision: null,
      parentSnapshotHash: String(paper.snapshot_hash).toLowerCase(),
      parentDisplayName: String(paper.library_display_name || paper.title || title),
      derivationType: "REVISION",
    };
    state.derivedBaseQuestions = structuredClone(snapshot.questions);
    derivedBaseLoad = null;
    state.prepared = [];
    state.undo = [];
    state.previewIndex = 0;
    state.ackWarnings = false;
    state.view = "compose";
    state.inspector = "summary";
    save();
    render();
    status("저장한 시험지로 새 문제지를 만들었습니다. 원래 시험지는 그대로 유지되고, 수정본을 저장하면 원본과의 관계가 기록됩니다.");
  }
  async function openSavedPaperRevision(id) {
    const data = await api("/archive-saved-papers/" + encodeURIComponent(id));
    applySavedPaperRevision(data.paper);
    state.editSavedPaperId = "";
    history.replaceState(null, "", `workspace.html?view=compose${state.assignLegacy ? "&assign=legacy" : ""}`);
  }
  async function ensureDerivedBaseQuestions() {
    if (!state.derivationSource) return null;
    if (Array.isArray(state.derivedBaseQuestions)) return state.derivedBaseQuestions;
    if (!derivedBaseLoad) derivedBaseLoad = (async () => {
      const data = await api("/archive-saved-papers/" + encodeURIComponent(state.derivationSource.parentId));
      const paper = data.paper;
      if (paper?.id !== state.derivationSource.parentId ||
          String(paper.snapshot_hash || "").toLowerCase() !== state.derivationSource.parentSnapshotHash)
        throw new Error("수정본의 원본 시험지 정보가 맞지 않습니다. 새로고침한 뒤 다시 시도해 주세요.");
      if (!Array.isArray(paper.snapshot?.questions) || !paper.snapshot.questions.length)
        throw new Error("수정본의 원본 시험지 내용을 확인할 수 없습니다. 새로고침한 뒤 다시 시도해 주세요.");
      return structuredClone(paper.snapshot.questions);
    })();
    try {
      state.derivedBaseQuestions = await derivedBaseLoad;
      return state.derivedBaseQuestions;
    } finally {
      derivedBaseLoad = null;
    }
  }
  function invalidate() {
    if (state.receipts.length)
      throw new Error(
        "이미 출제한 문제지는 보존됩니다. 아직 출제하지 않은 문제지에서 문항을 교체하거나 다시 만들어 주세요.",
      );
    // 결과가 있었는데 조건이 바뀌면 오른쪽이 빈 화면이 되지 않게 "조건이 바뀌었습니다" 안내를 띄운다.
    if (state.selected.length) {
      state.composeStale = true;
      state.composeStalePins = state.pins.length;
    }
    state.composeNotice = "";
    state.composeShortage = [];
    state.selected = [];
    state.pins = [];
    state.prepared = [];
    state.undo = [];
    state.rows = [];
    state.ackWarnings = false;
    state.indexVersion = state.catalog.indexVersion;
    scheduleSave();
  }
  function context() {
    return {
      series: state.rounds.flatMap((r) => r.questionUids),
      student: [],
      coverage: null,
    };
  }
  let scopeRenderCache = null;
  let displayedScopes = null;
  let renderingScopes = false;
  let renderPoolCache = null;
  function scopeOptions() {
    // S9: a UID route is one fixed scope over exactly the requested questions (no per-click scan).
    if (state.uidRoute) {
      const result = state.uidRoute.scopes;
      if (renderingScopes) {
        scopeRenderCache = result;
        displayedScopes = result;
      }
      return result;
    }
    const index = unifiedIndex();
    return index ? unifiedScopeOptions(index) : canonicalScopeOptions();
  }
  // PRIMARY scope source (user decision 2026-10-29): one 2022-based unit list per grade built by
  // Archive2UnifiedUnits. 2015 and 2022 items share a unit; a UID is counted once; items without
  // unit evidence stay selectable in a per-subject "단원 미분류" scope instead of disappearing.
  function unifiedScopeOptions(index) {
    if (renderingScopes && scopeRenderCache) return scopeRenderCache;
    const grade = state.filters.grade || "";
    const structure = grade ? Unified.structure(grade) : [];
    const excluded = C.composeExclusions(context()).union;
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      difficultyBuckets: state.buckets,
    };
    delete selectionFilters.scopeQuestionUids;
    // Facet filters decide scopeQuestionUids and the unit counts; the facet OPTION pool ignores
    // them (faceted search), so it is kept separately as facetQuestionUids.
    const metaActive = hasMetaFacetFilter(selectionFilters);
    const preMetaFilters = withoutMetaFacets(selectionFilters);
    const recipeUids = activeAssessmentRecipeUids();
    const seenUids = new Set();
    const drafts = new Map();
    if (grade) {
      for (const entry of Unified.candidates(index, {
        grade,
        semanticSubject: state.filters.semanticSubject,
        originalCurriculum: state.filters.originalCurriculum,
      })) {
        const record = entry.record;
        const uid = record.questionUid;
        if (!uid || seenUids.has(uid)) continue;
        if (recipeUids && !recipeUids.has(uid)) continue;
        if (!composeMetaMatches(record) || !workspaceMatches(record, preMetaFilters) ||
            !workspaceEligibility(record).ok || excluded.has(uid)) continue;
        seenUids.add(uid);
        const key = Unified.scopeKey(grade, entry.subject, entry.unitKey);
        let draft = drafts.get(key);
        if (!draft) {
          const subjectIndex = structure.findIndex((group) => group.subject === entry.subject);
          draft = {
            key, entry, subjectIndex: subjectIndex < 0 ? structure.length : subjectIndex,
            uids: [], facetUids: metaActive ? [] : null, paths: new Set(),
          };
          drafts.set(key, draft);
        }
        if (draft.facetUids) draft.facetUids.push(uid);
        if (metaActive && !C.metaFacetMatches(record, selectionFilters)) continue;
        draft.uids.push(uid);
        draft.paths.add(C.generalPathKey(record));
      }
    }
    const singleSubject = structure.length === 1;
    const result = [...drafts.values()]
      .sort((a, b) => a.subjectIndex - b.subjectIndex ||
        Number(a.entry.unclassified) - Number(b.entry.unclassified) ||
        a.entry.unitOrder - b.entry.unitOrder)
      .map((draft) => ({
        key: draft.key,
        L1: draft.entry.subjectLabel,
        L2: draft.entry.unitLabel,
        label: draft.entry.unitLabel,
        fullLabel: singleSubject ? draft.entry.unitLabel : `${draft.entry.subjectLabel} · ${draft.entry.unitLabel}`,
        basicScope: true,
        unified: true,
        unclassified: draft.entry.unclassified,
        paths: [...draft.paths],
        scopeQuestionUids: draft.uids,
        facetQuestionUids: draft.facetUids || draft.uids,
        count: draft.uids.length,
        eligibleCount: draft.uids.length,
        supplemental: false,
      }));
    if (renderingScopes) {
      scopeRenderCache = result;
      displayedScopes = result;
    }
    return result;
  }
  function canonicalScopeOptions() {
    if (renderingScopes && scopeRenderCache) return scopeRenderCache;
    const canonicalRows = taxonomyRowsForFilters(state.filters);
    const units = new Map();
    for (const row of canonicalRows) {
      const key = scopeParentKey(row);
      if (!units.has(key)) units.set(key, { ...row, records: new Map(), facetRecords: new Map() });
    }
    const excluded = C.composeExclusions(context()).union;
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      difficultyBuckets: state.buckets,
    };
    const metaActive = hasMetaFacetFilter(selectionFilters);
    const preMetaFilters = withoutMetaFacets(selectionFilters);
    const seenUids = new Set();
      const recipeUids = activeAssessmentRecipeUids();
    for (const record of state.catalog.records || []) {
      if (!record.questionUid || seenUids.has(record.questionUid)) continue;
      if (recipeUids && !recipeUids.has(record.questionUid)) continue;
      if (!composeMetaMatches(record) || !workspaceMatches(record, preMetaFilters) || !workspaceEligibility(record).ok) continue;
      // workspaceMatches already applies the selected difficulty buckets.
      if (excluded.has(record.questionUid)) continue;
      const parent = workspaceScopeParent(record);
      if (!parent) continue;
      const key = scopeParentKey({ ...record, ...parent });
      let unit = units.get(key);
      if (!unit && isSourceRoutedGeneralRange() && parent.supplemental) {
        const candidates = [...units.values()].filter((candidate) =>
          String(candidate.curriculumKey || "") === String(parent.curriculumKey || "") &&
          scopeText(candidate.L1) === scopeText(parent.L1) &&
          scopeText(candidate.L2) === scopeText(parent.L2),
        );
        if (candidates.length === 1) unit = candidates[0];
      }
      if (!unit) continue;
      unit.facetRecords.set(record.questionUid, record);
      if (!metaActive || C.metaFacetMatches(record, selectionFilters))
        unit.records.set(record.questionUid, record);
      unit.supplemental = unit.supplemental || parent.supplemental === true;
      seenUids.add(record.questionUid);
    }
    for (const [key, unit] of units)
      if (!unit.records.size && !(metaActive && unit.facetRecords.size)) units.delete(key);

    const semanticGroups = new Map();
    const displayGroups = state.catalog.basicScopeGroups || [];
    const displayGroupFor = unit => !state.filters.curriculumKey && displayGroups.findIndex(group =>
      group.members.some(member => (!unit.curriculumKey || member.curriculumKey === unit.curriculumKey) &&
        scopeCourseKey(member) === unit.courseKey && scopeText(member.L1) === scopeText(unit.L1) && scopeText(member.L2) === scopeText(unit.L2)));
    for (const unit of units.values()) {
      const displayGroup = displayGroupFor(unit);
      const key = displayGroup !== false && displayGroup >= 0
        ? `display-group-${displayGroup}`
        : [unit.curriculumKey, unit.courseKey, scopeText(unit.L1), scopeText(unit.L2)].join("|");
      if (!semanticGroups.has(key)) semanticGroups.set(key, []);
      semanticGroups.get(key).push(unit);
    }
    const groups = [];
    for (const candidates of semanticGroups.values()) {
      if (!state.filters.curriculumKey && candidates.length > 1) {
        const displayGroup = displayGroupFor(candidates[0]);
        const preferred = displayGroup >= 0 ? displayGroups[displayGroup].preferredCurriculum : "";
        const first = candidates.find(unit => unit.curriculumKey === preferred) || candidates[0];
        groups.push({
          curriculumKey: "all",
          courseKey: "all",
          L1: first.L1,
          L2: first.L2,
          units: candidates,
        });
      } else {
        groups.push(...candidates.map((unit) => ({ ...unit, units: [unit] })));
      }
    }
    const displayKeys = new Map();
    for (const group of groups) {
      const key = scopeText(group.L1) + "|" + scopeText(group.L2);
      displayKeys.set(key, (displayKeys.get(key) || 0) + 1);
    }
    const result = groups.map((group, index) => {
      const sources = unique(group.units.flatMap((unit) => [...unit.records.values()]));
      const supplemental = sources.some((record) => workspaceScopeParent(record)?.supplemental === true);
      const paths = supplemental ? [] : unique(sources.map((record) => C.pathKey(record, 4)));
      const displayKey = scopeText(group.L1) + "|" + scopeText(group.L2);
      const suffix =
        displayKeys.get(displayKey) > 1
          ? ` · ${group.curriculumKey === "all" ? "통합" : group.curriculumKey}`
          : !state.filters.curriculumKey && !sources.length && ["2015", "2022"].includes(group.curriculumKey)
            ? ` · ${group.curriculumKey}`
          : "";
      return {
        key: `scope-${index}-${scopeText(group.L1)}-${scopeText(group.L2)}-${group.curriculumKey}`,
        L1: group.L1,
        L2: group.L2,
        label: `${group.L2}${suffix}`,
        basicScope: true,
        paths,
        scopeQuestionUids: unique(sources.map(r => r.questionUid)),
        facetQuestionUids: unique(group.units.flatMap((unit) => [...unit.facetRecords.keys()])),
        count: sources.length,
        eligibleCount: sources.length,
        supplemental,
      };
    });
    if (renderingScopes) {
      scopeRenderCache = result;
      displayedScopes = result;
    }
    return result;
  }
  function scopeIsSelected(scope) {
    return (
      state.scopes.includes(scope.key) ||
      (!scope.unified && scope.paths.some((path) => state.scopes.includes(path)))
    );
  }
  function selectedScopeOptions() {
    return scopeOptions().filter((scope) => scopeIsSelected(scope) && scope.count > 0);
  }
  function selectedScopePaths() {
    const scopes = selectedScopeOptions();
    return scopes.some((scope) => scope.supplemental)
      ? []
      : unique(scopes.flatMap((scope) => scope.paths));
  }
  function selectedScopeQuestionUids() {
    return unique(selectedScopeOptions().flatMap(scope => scope.scopeQuestionUids));
  }
  function planRows() {
    const scopes = selectedScopeOptions();
    if (state.distribution === "pool")
      return scopes.length
        ? [
            {
              id: "pool",
              count: Number(state.count),
              difficultyBuckets: state.buckets,
              paths: selectedScopePaths(),
              scopeQuestionUids: selectedScopeQuestionUids(),
            },
          ]
        : [];
    return scopes
      .map((s) => ({
        id: s.key,
        paths: s.paths,
        scopeQuestionUids: s.scopeQuestionUids,
        depth: 4,
        label: s.fullLabel || s.label,
        count:
          state.distribution === "all"
            ? s.eligibleCount
            : Number(
                state.distribution === "custom"
                  ? (state.custom[s.key]?.count ?? state.count)
                  : state.count,
              ),
        difficultyBuckets:
          state.distribution === "custom"
            ? state.custom[s.key]?.buckets || state.buckets
            : state.buckets,
      }))
      .filter((r) => r.count > 0 || state.distribution !== "all");
  }
  function pool() {
    if (renderingScopes && renderPoolCache) return renderPoolCache;
    // A failed UID route never falls back to the whole catalog.
    if (state.uidRoute && !state.uidRoute.scopes.length) return [];
    const scopes = selectedScopeOptions();
    const recipeUids = activeAssessmentRecipeUids();
    const uids = scopes.length ? new Set(scopes.flatMap(scope => scope.scopeQuestionUids)) : null;
    const result = !scopes.length
      ? state.catalog.records.filter(record =>
        (!recipeUids || recipeUids.has(record.questionUid)) && composeMetaMatches(record))
      : state.catalog.records.filter(
        (r) => uids.has(r.questionUid) && (!recipeUids || recipeUids.has(r.questionUid)) && composeMetaMatches(r),
      );
    if (renderingScopes) renderPoolCache = result;
    return result;
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
    let allowed = renderComposeMetaFilters?.get(filters);
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
      renderComposeMetaFilters?.set(filters, allowed);
    }
    return allowed.has(record.questionUid);
  }
  function request(useFrozen = false) {
    const rows = useFrozen ? state.rows : planRows();
    const paths = useFrozen ? unique(rows.flatMap(row => row.paths || (row.path ? [row.path] : []))) : selectedScopePaths();
    const scopeQuestionUids = useFrozen
      ? unique(rows.flatMap(row => row.scopeQuestionUids || state.catalog.records.filter(r => C.rowMatches(r, row, workspaceMatchOptions())).map(r => r.questionUid)))
      : selectedScopeQuestionUids();
    const routedFilters = unifiedIndex()
      ? omitUnifiedFilters(state.filters)
      : isSourceRoutedGeneralRange()
        ? { ...state.filters, courseKey: "" }
        : state.filters;
    return {
      filters: {
        ...withoutMetaFacets(routedFilters),
        sourceFiles: state.sources,
        primaryPaths: paths,
        scopeQuestionUids,
      },
      rows,
      pins: state.selected
        .filter((r) => state.pins.includes(r.questionUid))
        .map((r) => ({ questionUid: r.questionUid, rowId: r.rowId })),
      canonicalAuthority: state.catalog?.canonicalAuthority,
      projectionPolicy: state.catalog?.projectionPolicy,
      useMode: workspaceUseMode(),
      seed: state.seed,
    };
  }
  function saveWorkSignature() {
    const req = request(state.selected.length > 0);
    return JSON.stringify({
      indexVersion: state.indexVersion || state.catalog?.indexVersion || "",
      selectionFilters: req.filters,
      selected: state.selected.map((record) => [record.questionUid, record.sourceFingerprint]),
      rows: state.rows,
      scopes: state.scopes,
      sources: state.sources,
      distribution: state.distribution,
      count: state.count,
      buckets: state.buckets,
      custom: state.custom,
      round: state.round,
      rounds: state.rounds,
      title: state.title,
      header: state.header,
      qpp: state.qpp,
      includeQr: state.includeQr,
      derivationSource: state.derivationSource,
    });
  }
  function review() {
    const ctx = ownHistoryContext(),
      req = request(true);
    if (state.receipts.length && state.sealed) {
      req.historyReady = true;
    }
    const result = C.review(state.selected, req, ctx);
    if (state.indexVersion !== state.catalog.indexVersion) {
      result.status = "HARD_BLOCK";
      result.hardFailures.push(
        "문항 목록이 갱신되었습니다. 다시 만들어 주세요.",
      );
    }
    return result;
  }
  async function refreshHistory() {
    const token = ++state.targetVersion;
    state.historyReady = false;
    state.history = null;
    state.historyError = "";
    if (!state.studentIds.length || state.historyMode === "off") {
      state.historyReady = true;
      render();
      return;
    }
    const candidateQuestionUids = unique(
      state.selected.map((record) => record.questionUid),
    );
    status("현재 시험지와 이전 출제 이력을 확인하고 있습니다.");
    try {
      const result = await api("/class-exam-assignments/question-history", {
        student_ids: state.studentIds,
        candidate_question_uids: candidateQuestionUids,
        history_mode: state.historyMode,
        recent_days: state.recentDays,
      });
      if (token !== state.targetVersion) return;
      state.history = result;
      state.historyReady = true;
      state.historyError = "";
      render();
      status(
        `현재 시험지 중 이전 출제와 겹치는 문항 ${result.union_question_uids.length}개를 확인했습니다.`,
      );
    } catch (e) {
      if (token !== state.targetVersion) return;
      state.historyError = e.message || "이전 출제 이력을 확인하지 못했습니다.";
      state.historyReady = false;
      render();
      status("이전 출제 이력을 확인하지 못했습니다. 시험지는 그대로 출제할 수 있습니다.");
    }
  }
  function unifiedPrimaryMarkup(filters) {
    // 학년은 학년 색 버튼(학교별 기출·단원별 기출과 같은 구성요소), 과목은 2과목이면 2칸 전환·그 이상이면 칩이다.
    const subjects = Unified.subjectsForGrade(filters.grade);
    const locked = state.sealed || state.receipts.length > 0 ? "disabled" : "";
    const pressed = (value) => `aria-pressed="${String(filters.semanticSubject || "") === String(value)}"`;
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

  function finderCourseOptions(filters) {
    const courseLabel = (value) =>
      /^M([123])-([12])$/.test(value)
        ? value.replace(/^M([123])-([12])$/, "중$1 · $2학기")
        : value;
    const projected = C.hasSubjectProjection?.(filters.grade) === true;
    return projected
      ? C.subjectProjectionOptions(filters.grade)
      : unique(
          taxonomyRowsForFilters({ ...filters, courseKey: "" })
            .map((r) => r.courseKey),
        ).map((value) => ({ value, label: courseLabel(value) }));
  }
  // Grade / curriculum / subject identity of an exam. With the unified layer the subject is the
  // unified (2022-based) subject of the units the exam covers, so a 2015 수학(상) exam with 도형의
  // 방정식 questions is found under 공통수학2 as well. Exams without any placed question keep the
  // shared matcher's own subject projection.
  function finderIdentityMatch(exam, filters) {
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
  // Finder filters in the unified vocabulary: the subject comes from the unified list for the
  // chosen grade (all unified subjects while no grade is chosen); the old subject family, the
  // semester-course select and shared-matcher subject rules no longer apply.
  function reconcileFinderFilters(filters) {
    if (!unifiedIndex()) return C.reconcileFinderFilters(filters, state.catalog.taxonomy);
    const next = C.reconcileFinderFilters(
      { ...filters, semanticSubject: "", family: "", courseKey: "" },
      state.catalog.taxonomy,
    );
    const subject = filters.semanticSubject || Unified.subjectForFamily(filters.family);
    next.semanticSubject = Unified.isKnownSubject(next.grade || "", subject) ? subject : "";
    next.family = "";
    next.courseKey = "";
    return next;
  }
  function finderSchoolValues(filters = state.find) {
    return unique(
      state.catalog.exams
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
  // What changing one finder filter (a select, the grade buttons) does besides storing the value.
  function applyFinderFilterChange(key) {
    if (key === "grade") {
      state.sources = [];
      state.find.semanticSubject = "";
      state.find.family = "";
    }
    if (key === "semanticSubject") {
      state.find.courseKey = "";
      state.find.family = "";
    }
    if (["grade", "curriculumKey", "courseKey", "semanticSubject"].includes(key))
      Object.assign(state.find, reconcileFinderFilters(state.find));
    if (["material", "grade", "curriculumKey", "courseKey", "semanticSubject"].includes(key))
      reconcileFinderSchool(state.find);
    state.page = 0;
    urlState();
  }
  function finderFamilyLabel(value) {
    return (
      {
        COMMON_1: "공통수학1 계열",
        COMMON_2: "공통수학2 계열",
        ALGEBRA: "대수 계열",
        CALCULUS: "미적분 기초 계열",
        CALCULUS_ADVANCED: "미적분 심화 계열",
        PROB_STATS: "확률과통계",
        GEOMETRY: "기하",
      }[value] || value
    );
  }
  function finderAxisLabel(value) {
    return (
      {
        "1-mid": "1학기 중간",
        "1-final": "1학기 기말",
        "2-mid": "2학기 중간",
        "2-final": "2학기 기말",
      }[value] || value
    );
  }
  function finderResettable(filters = state.find) {
    return Boolean(
      filters.curriculumKey ||
        filters.courseKey ||
        filters.semanticSubject ||
        filters.school ||
        filters.axis ||
        filters.yearFrom ||
        filters.yearTo ||
        filters.family ||
        filters.file ||
        filters.query ||
        filters.grade ||
        filters.similarOnly,
    );
  }
  // Same look as the home search: a large pill box and 찾기. Words are matched together (AND).
  function finderSearchMarkup(filters) {
    return `<div class="find-search-row"><label class="visually-hidden" for="finder-query">학교, 학년, 시험으로 검색</label><input id="finder-query" type="search" value="${esc(filters.query || "")}" placeholder="순천고 고1 1학기 중간" autocomplete="off" enterkeyhint="search">${button("finder-search", "찾기", 'type="button" class="primary find-search-submit"')}</div>`;
  }
  const FINDER_TERMS = Object.freeze([
    ["1-mid", "1학기 중간"], ["1-final", "1학기 기말"], ["2-mid", "2학기 중간"], ["2-final", "2학기 기말"],
  ]);
  // Grade buttons (grade colors, press again to clear) and the four exam terms.
  function finderQuickMarkup(filters) {
    const grades = HOME_GRADES.map(([label, id]) =>
      button("finder-grade", esc(label), `type="button" class="find-grade grade-${id}" data-grade="${label}" aria-pressed="${filters.grade === label}"`)).join("");
    const terms = FINDER_TERMS.map(([value, label]) =>
      button("finder-axis-quick", esc(label), `type="button" class="find-term" data-axis="${value}" aria-pressed="${filters.axis === value}"`)).join("");
    return `<div class="find-quick"><div class="find-grades" role="group" aria-label="학년">${grades}</div><span class="find-divider" aria-hidden="true"></span><div class="find-terms" role="group" aria-label="시험 시기">${terms}</div></div>`;
  }
  // The one-exam filter (a link to a file) is shown by the exam's title, never by its file name.
  function finderFileLabel(file) {
    const exam = (state.catalog?.exams || []).find((item) => C.normalizeFile(item.file) === C.normalizeFile(file));
    return exam ? O.displayTitle(exam) : "선택한 시험지";
  }
  function finderActiveMarkup(filters) {
    const active = [
      ["학교", filters.school],
      ["시험지", filters.file ? finderFileLabel(filters.file) : ""],
      [
        "연도",
        filters.yearFrom || filters.yearTo
          ? `${filters.yearFrom || "…"}~${filters.yearTo || "…"}`
          : "",
      ],
      unifiedIndex()
        ? ["", ""]
        : ["과목 계열", filters.family ? finderFamilyLabel(filters.family) : ""],
    ].filter(([, value]) => value);
    return `<div class="finder-active-zone"><div class="finder-active-row">${active
      .map(
        ([label, value]) =>
          `<span class="finder-chip">${esc(label)} ${esc(value)}</span>`,
      )
      .join("")}</div>${
      finderResettable(filters)
        ? button(
            "finder-reset",
            "검색 조건 지우기",
            'class="finder-reset-action"',
          )
        : ""
    }</div>`;
  }
  // The filters that stay out of the way: 교육과정, 과목, 학교, 연도 (and the old 과목 계열 while no unified list exists).
  // Grade and term are the buttons above; nothing was dropped, only moved.
  function finderMoreFiltersMarkup(filters) {
    const schools = finderSchoolValues(filters);
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    let subjectField = "";
    if (unifiedIndex()) {
      const subjects = Unified.subjectChoices(filters.grade || "");
      if (subjects.length)
        subjectField = `<label class="finder-field finder-course"><span>과목</span><select data-filter="semanticSubject" data-group="find">${options(subjects, filters.semanticSubject || Unified.subjectForFamily(filters.family), "전체 과목")}</select></label>`;
    } else {
      const courses = finderCourseOptions(filters);
      subjectField = projected
        ? `<label class="finder-field finder-course"><span>과목</span><select data-filter="semanticSubject" data-group="find">${options(courses, filters.semanticSubject, highSemantic ? "과목 선택" : "전체 과목")}</select></label>`
        : `<label class="finder-field finder-course"><span>과목</span><select data-filter="courseKey" data-group="find">${options(courses, filters.courseKey, "전체 과목")}</select></label>`;
    }
    const familyField = filters.grade || unifiedIndex()
      ? ""
      : `<label class="finder-field finder-family"><span>과목 계열</span><select data-filter="family" data-group="find">${options(
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
        )}</select></label>`;
    const open = state.findMoreOpen || filters.curriculumKey || filters.courseKey || filters.semanticSubject || filters.school || filters.yearFrom || filters.yearTo || filters.family;
    return `<details class="find-more"${open ? " open" : ""}><summary>과목 · 학교 · 연도</summary><div class="find-more-fields"><label class="finder-field"><span>교육과정</span><select data-filter="curriculumKey" data-group="find">${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>${subjectField}<label class="finder-field finder-school"><span>학교</span><select data-filter="school" data-group="find">${options(schools, filters.school, "전체 학교")}</select></label><label class="finder-field finder-year"><span>연도</span><span class="finder-year-range"><input type="number" min="2000" max="2100" data-filter="yearFrom" data-group="find" value="${esc(filters.yearFrom || "")}" placeholder="시작 연도"><b>~</b><input type="number" min="2000" max="2100" data-filter="yearTo" data-group="find" value="${esc(filters.yearTo || "")}" placeholder="끝 연도"></span></label>${familyField}</div></details>`;
  }


  // Search text per exam, built once per catalog: the exam's visible values (never JSON keys) plus
  // the uid and L1-L4 text of its questions. Exact current middle-school parents are search
  // aliases from the shared selection index; stored source/request paths remain unchanged.
  let findSearchIndex = null;
  function findSearchText(exam) {
    const catalog = state.catalog;
    if (!findSearchIndex || findSearchIndex.exams !== catalog.exams || findSearchIndex.records !== catalog.records) {
      const questionsByFile = new Map();
      const index = unifiedIndex();
      for (const r of catalog.records) {
        const entry = index?.byUid.get(r.questionUid);
        const parent = entry?.rpmParentStatus === "EXACT" ? entry.rpmParent : null;
        const text = C.normalizeSearch([r.questionUid, r.L1, r.L2, r.L3, r.L4, parent?.L1, parent?.L2].filter(Boolean).join(" "));
        if (!text) continue;
        const list = questionsByFile.get(r.sourceFile);
        if (list) list.push(text);
        else questionsByFile.set(r.sourceFile, [text]);
      }
      findSearchIndex = { exams: catalog.exams, records: catalog.records, questionsByFile, text: new WeakMap() };
    }
    let text = findSearchIndex.text.get(exam);
    if (text === undefined) {
      const parts = [];
      const collect = (value, depth) => {
        if (typeof value === "string" || typeof value === "number") {
          const piece = C.normalizeSearch(value);
          if (piece) parts.push(piece);
        } else if (depth < 4 && value && typeof value === "object") {
          for (const item of Array.isArray(value) ? value : Object.values(value)) collect(item, depth + 1);
        }
      };
      collect(exam, 0);
      // The card title ("2026 팔마고 고3 1학기 중간고사") is built from separate fields, so words
      // such as "1학기" or "중간고사" only exist in the displayed title.
      collect(O.displayTitle(exam), 0);
      parts.push(...(findSearchIndex.questionsByFile.get(exam.file) || []));
      text = parts.join("\n");
      findSearchIndex.text.set(exam, text);
    }
    return text;
  }
  // One rule for every way into the finder (menu, address, back button): without a material it lists
  // 학교 기출; a link to one exam file keeps listing every kind so the file is found.
  function applyDefaultFinderMaterial() {
    if (state.find.material === undefined && !state.find.file) state.find.material = "exam";
  }
  function findExams(f = state.find) {
    // Words are separated by spaces and may come in any order; "1학기 기말" stays one word.
    const terms = String(f.query || "")
      .replace(/(\d)\s*학기\s*(기말|중간)/g, "$1학기$2")
      .split(/\s+/)
      .map(C.normalizeSearch)
      .filter(Boolean);
    return state.catalog.exams.filter((exam) => {
      const hasYearFilter = Boolean(f.yearFrom || f.yearTo);
      const examYear = Number(exam.year);
      if (
        !O.matchesMaterial(exam, f.material) ||
        (f.school && f.school !== exam.school) ||
        (hasYearFilter && !Number.isFinite(examYear)) ||
        (f.yearFrom && examYear < Number(f.yearFrom)) ||
        (f.yearTo && examYear > Number(f.yearTo))
      )
        return false;
      if (f.file && C.normalizeFile(exam.file) !== C.normalizeFile(f.file)) return false;
      if (f.axis && `${exam.semester}-${exam.examType}` !== f.axis)
        return false;
      if (!unifiedIndex() && f.family && !f.grade && !exam.courseFamilies.includes(f.family))
        return false;
      if (!finderIdentityMatch(exam, f)) return false;
      if (f.similarOnly && findSimilarFilterApplies(f) && !similarPairs().setsFor(exam.file).length) return false;
      if (!terms.length) return true;
      const text = findSearchText(exam);
      return terms.every((term) => text.includes(term));
    }).sort(compareFindRows);
  }
  // Newest year first (the shared rule); inside one year the later term comes first (2학기 기말 → 1학기 중간).
  function compareFindRows(a, b) {
    const byYear = C.compareNewest(a, b);
    if (byYear) return byYear;
    const term = (exam) => (Number(exam.semester) || 0) * 2 + (exam.examType === "final" ? 1 : 0);
    return term(b) - term(a);
  }
  function originalSettingsForExam(exam) {
    let storedQpp = 4;
    try {
      storedQpp = Number(localStorage.getItem("APMATH_ARCHIVE2_ORIGINAL_QPP") || 4);
    } catch {}
    const qpp = [4, 6, 8].includes(storedQpp) ? storedQpp : 4;
    return O.settings({
      header: {
        title: O.displayTitle(exam),
        subtitle: exam.subject || exam.primaryStandardCourse,
      },
      qpp,
    });
  }
  function renderOriginalReceipts() {
    const host = $("original-receipts");
    if (!host) return;
    const receipts = state.originalReceipts || [];
    if (!receipts.length) {
      host.replaceChildren();
      return;
    }
    const pdfPending = receipts.some((receipt) => receipt.pdfStatus !== "ready");
    host.innerHTML = `<div class="callout original-receipts-callout">
      <strong>${receipts.length}개 반에 출제했습니다</strong>
      <p>학생에게는 출제할 때 저장한 내용 그대로 나갑니다.${pdfPending ? " PDF 준비가 필요한 반은 그 반의 PDF만 다시 준비할 수 있습니다." : ""}</p>
      <div class="original-receipt-list">${receipts.map((receipt) => {
        const ready = receipt.pdfStatus === "ready";
        return `<article class="original-receipt-row" data-assignment-id="${esc(receipt.id)}">
          <div><strong>${esc(receipt.className || "선택한 반")}</strong><div class="muted">출제 번호 · <code>${esc(receipt.id)}</code></div>
            <div class="muted">${ready ? "PDF 준비 완료" : "출제 완료 · PDF 확인 필요"}${receipt.pdfError ? ` · ${esc(receipt.pdfError)}` : ""}</div></div>
          <div class="actions" role="group" aria-label="${esc(receipt.className || "선택한 반")} 출제 ${esc(receipt.id)} 시험지·해설·정답·학생별 확인">
            ${[ ["exam", "시험지"], ["sol", "해설"], ["ans", "정답"] ].map(([mode, label]) => button("assignment-output-direct", label, `data-assignment="${esc(receipt.id)}" data-mode="${mode}" class="small"`)).join("")}
            ${ready ? "" : button("assignment-pdf", "PDF 다시 준비", `data-assignment="${esc(receipt.id)}" class="small"`)}
            ${button("assignment-status", "학생별 확인", `data-assignment="${esc(receipt.id)}" class="small"`)}
          </div>
        </article>`;
      }).join("")}</div>
    </div>`;
  }
  function openOriginalIssue(exam, step = "review") {
    state.originalExam = exam;
    const settings = originalSettingsForExam(exam);
    const qpp = settings.qpp;
    const url = new URL("index.html", location.href);
    url.searchParams.set("archive2Issue", exam.file);
    url.searchParams.set("archive2Embedded", "1");
    url.searchParams.set("index_version", state.catalog.indexVersion);
    url.searchParams.set("qpp", String(qpp));
    state.originalSettings = settings;
    state.originalReceipts = [];
    state.originalPreviewEnvelope = null;
    showDialog(
      O.displayTitle(exam),
      `<div class="original-issue-toolbar"><span>${exam.qCount}문항 · 수록 순서 그대로</span><div class="actions">${button("original-review", "시험지 확인", 'aria-pressed="true"')}${button("original-targets", "반·학생 선택", 'class="primary" aria-pressed="false"')}</div><details class="original-output"><summary>출력 설정</summary>${O.markup(state.originalSettings, "original")}</details></div><div id="original-receipts"></div><section id="original-review"><div class="resultbar"><p class="muted">학생에게 나갈 시험지입니다. 출력 설정을 바꾸면 여기에 반영됩니다.</p>${button("original-print", "새 창·출력", 'class="small"')}</div><div id="original-preview-status" role="status">시험지를 불러오는 중…</div><iframe id="original-preview-frame" title="학생에게 나갈 시험지"></iframe></section><iframe id="original-issue-frame" title="원본 기출 반·학생 출제" src="${esc(url.href)}"></iframe>`,
    );
    $("modal").classList.add("original-issue-dialog");
    setOriginalStep(step);
  }
  function openSavedPaperIssue(id) {
    const paperId = String(id || "").trim();
    if (!paperId) throw new Error("출제할 저장한 시험지를 확인할 수 없습니다. 목록으로 돌아가 다시 선택해 주세요.");
    state.originalReceipts = [];
    state.originalPreviewEnvelope = null;
    state.originalPreviewToken = (state.originalPreviewToken || 0) + 1;
    const url = new URL("index.html", location.href);
    url.searchParams.set("savedPaper", paperId);
    url.searchParams.set("archive2Embedded", "1");
    showDialog(
      "저장한 시험지 출제",
      `<div class="original-issue-toolbar"><span>저장한 시험지 · 저장 당시 내용 그대로</span><div class="actions">${button("original-review", "시험지 확인", 'disabled aria-pressed="false"')}${button("original-targets", "반·학생 선택", 'class="primary" aria-pressed="true"')}</div></div><div id="original-receipts"></div><section id="original-review" hidden><div class="resultbar"><p class="muted">각 반에 출제한 내용(저장 당시 내용 그대로)을 보여 줍니다.</p>${button("original-print", "새 창·출력", 'class="small"')}</div><div id="original-preview-status" role="status">시험지를 불러오는 중…</div><iframe id="original-preview-frame" title="출제한 시험지"></iframe></section><iframe id="saved-paper-issue-frame" title="저장한 시험지 반·학생 출제" src="${esc(url.href)}"></iframe>`,
    );
    $("modal").classList.add("saved-paper-issue-dialog");
    setOriginalStep("targets");
  }
  window.Archive2WorkspaceSavedPaperIssue = openSavedPaperAssign;
  // 저장본 출제(보관함 줄·상세·문제지 만들기 저장 뒤)는 화면 안 패널(archive2-assign.js)로 연다. 옛 iframe 모달은
  // 주소에 assign=legacy가 있을 때(되돌릴 길)와 학교 기출·단원별 출제에서 그대로 쓴다.
  function assignRequest(route, opt = {}) {
    // 로그인이 없으면 요청을 보내지 않고 401로 알려 패널이 로그인 안내를 그린다(headers()의 일반 Error가 '응답 없음'으로 읽히지 않게).
    if (!teacherSessionOk()) {
      const error = new Error("교사 로그인이 필요합니다.");
      error.status = 401;
      return Promise.reject(error);
    }
    return api(route, opt.body, opt.method || (opt.body ? "POST" : "GET"), { headers: opt.headers, timeoutMs: opt.timeoutMs });
  }
  async function openSavedPaperAssign(id, options = {}) {
    const paperId = String(id || "").trim();
    if (!paperId) throw new Error("출제할 저장한 시험지를 확인할 수 없습니다. 목록으로 돌아가 다시 선택해 주세요.");
    const Assign = window.Archive2Assign;
    if (!Assign?.open || state.assignLegacy || Assign.useLegacy(location.search)) return openSavedPaperIssue(paperId);
    if (Assign.isOpen()) return undefined;
    state.originalReceipts = [];
    let papers = Array.isArray(options.papers) ? options.papers : [];
    if (!papers.length) {
      // 문제지 만들기에서 저장한 직후처럼 목록 정보가 없을 때는 한 권만 서버에서 읽어 이름·학년·문항 수를 얻는다.
      const data = await api("/archive-saved-papers/" + encodeURIComponent(paperId));
      const paper = data.paper;
      if (!paper?.id) throw new Error("저장한 시험지를 확인할 수 없습니다. 새로고침한 뒤 다시 시도해 주세요.");
      if (paper.library_status === "TRASHED") throw new Error("휴지통의 시험지는 출제할 수 없습니다. 보관함으로 복원한 뒤 출제해 주세요.");
      papers = [paper];
    }
    const opener = document.activeElement;
    Assign.open({
      papers,
      history: options.history || window.Archive2Library?.currentHistory?.() || null,
      request: assignRequest,
      opener,
      // 출제가 하나라도 저장되면(끝났을 때·닫을 때) 보관함 줄의 출제 이력을 새로 고친다.
      onDone: () => { window.Archive2Library?.refreshHistory?.(); },
    });
    return undefined;
  }
  // 학교 기출·유사문제 줄·홈의 `출제`(source-issue)도 같은 패널로 낸다(2026-11-11). 옛 iframe(openOriginalIssue)은
  // 주소에 assign=legacy가 있거나 패널 스크립트가 없을 때만 쓴다. 본문 만들기·재전송·이력은 archive2-assign.js(원본 항목).
  // 원본 문항은 옛 iframe이 부모에게서 받던 것과 같은 방법(Source.load(file, sourceHash))으로 받고, 해시는 그대로 검증된다.
  function openOriginalAssign(exam) {
    const Assign = window.Archive2Assign;
    if (!Assign?.open || state.assignLegacy || Assign.useLegacy(location.search)) return openOriginalIssue(exam, "targets");
    if (Assign.isOpen()) return undefined;
    const sourceHash = new Map(state.catalog.sourceHashes).get(exam.file);
    if (!sourceHash || !state.catalog.indexVersion) {
      status("이 시험지의 원본 정보를 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.", true);
      return undefined;
    }
    state.originalReceipts = [];
    // 쪽당 문항은 늘 4로 시작한다: 옛 모달이 기억해 둔 값(APMATH_ARCHIVE2_ORIGINAL_QPP)은 쓰지 않는다.
    const settings = { ...originalSettingsForExam(exam), qpp: 4 };
    Assign.open({
      items: [{
        kind: "original", file: exam.file, title: O.displayTitle(exam), identityTitle: exam.identityTitle || exam.file.split("/").pop().replace(/\.js$/, ""),
        grade: exam.grade, subject: exam.subject, count: exam.qCount, sourceHash, settings,
      }],
      original: { indexVersion: state.catalog.indexVersion, loadQuestions: (item) => Source.load(item.file, item.sourceHash) },
      request: assignRequest,
      opener: document.activeElement,
    });
    return undefined;
  }
  function originalIssueBusy() {
    return Boolean(
      $("original-issue-frame")?.contentWindow?.isArchive2OriginalBusy?.() ||
      $("saved-paper-issue-frame")?.contentWindow?.isArchive2OriginalBusy?.(),
    );
  }
  function setOriginalStep(step) {
    $("original-review").hidden = step !== "review";
    const issueFrame = $("original-issue-frame") || $("saved-paper-issue-frame");
    if (issueFrame) issueFrame.hidden = step !== "targets";
    document.querySelector('[data-action="original-review"]')?.setAttribute("aria-pressed", String(step === "review"));
    document.querySelector('[data-action="original-targets"]')?.setAttribute("aria-pressed", String(step === "targets"));
    $("modal").scrollTop = 0;
    // Equal-slot layout requires measurable width. A hidden iframe cannot
    // render; refresh only after the review panel becomes visible.
    if (step === "review") updateOriginalPreview();
  }
  async function buildOriginalSourceOutput(exam, mode, settings, preview = true) {
    const questions = await Source.load(
      exam.file,
      new Map(state.catalog.sourceHashes).get(exam.file),
    );
    const questionUids = state.catalog.records
      .filter((record) => record.sourceFile === exam.file)
      .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)
      .map((record) => record.identityStatus === "VERIFIED" ? record.questionUid : null);
    const meta = {
      sourceKind: "archive2-original",
      sourceArchiveFile: exam.file,
      questionUids,
      identityTitle: exam.identityTitle || exam.file.split("/").pop().replace(/\.js$/, ""),
      printHeaderOptions: settings.header,
      qpp: settings.qpp,
      includeQr: settings.includeQr,
    };
    const envelope = await O.publishOutputEnvelope({
      sourceKind: "archive2-original",
      sourceId: exam.file,
      mode,
      questionCount: questions.length,
      questionUids,
      meta,
      questions,
    });
    const url = O.outputEnvelopeUrl("engine.html", location.href, envelope, { preview });
    return { url, envelope };
  }
  async function originalOutputUrl(mode = "exam", preview = true) {
    const e = state.originalExam, s = state.originalSettings;
    const saved = state.originalReceipts?.[0];
    if (!saved) return buildOriginalSourceOutput(e, mode, s, preview);
    let sourceKind = "assignment";
    let sourceId = saved.id;
    let assignmentId;
    let questions;
    let meta;
    assignmentId = saved.id;
    const result = await api(`/class-exam-assignments/${encodeURIComponent(saved.id)}/status`);
    const payload = JSON.parse(result.assignment?.mixed_payload_json || "null");
    if (!Array.isArray(payload?.questions) || !payload.meta)
      throw new Error("출제 당시 내용을 확인할 수 없습니다. 출제 내역에서 다시 열어 주세요.");
    questions = payload.questions;
    meta = payload.meta;
    const envelope = await O.publishOutputEnvelope({
      sourceKind,
      sourceId,
      ...(assignmentId ? { assignmentId } : {}),
      mode,
      questionCount: questions.length,
      questionUids: meta.questionUids,
      meta,
      questions,
    });
    const url = O.outputEnvelopeUrl("engine.html", location.href, envelope, {
      preview,
      assignmentId,
    });
    return { url, envelope };
  }
  async function updateOriginalPreview() {
    const token = state.originalPreviewToken = (state.originalPreviewToken || 0) + 1;
    const frame = $("original-preview-frame");
    if (!frame || $("original-review").hidden) return;
    const status = $("original-preview-status");
    status.textContent = "시험지를 불러오는 중…";
    try {
      const output = await originalOutputUrl();
      if (token !== state.originalPreviewToken || !frame.isConnected || $("original-review").hidden) {
        await O.createOutputStore().cleanup(output.envelope.ownerId, output.envelope.outputRequestId);
        return;
      }
      const previousEnvelope = state.originalPreviewEnvelope;
      state.originalPreviewEnvelope = output.envelope;
      // Refresh after an output setting changes, even though snapshot identity stays stable.
      output.url.searchParams.set("revision", String(token));
      frame.onload = () => {
        status.textContent = "출제할 문항과 출력 설정을 확인하세요.";
        if (!$("original-review")?.hidden) $("modal").scrollTop = 0;
      };
      frame.src = output.url.href;
      if (previousEnvelope)
        await O.createOutputStore().cleanup(previousEnvelope.ownerId, previousEnvelope.outputRequestId);
    } catch (error) { status.textContent = "시험지를 표시하지 못했습니다. " + teacherErrorMessage(error, "새로고침한 뒤 다시 시도해 주세요."); }
  }
  async function originalPrint() {
    const popup = window.open("about:blank", "_blank");
    try {
      const output = await originalOutputUrl("exam", false);
      if (!popup) throw new Error("팝업을 허용해 주세요.");
      popup.location.href = output.url.href;
    } catch (error) { popup?.close(); throw error; }
  }
  async function openFinderOutput(exam, mode = "exam") {
    const safeMode = ["exam", "sol", "ans"].includes(mode) ? mode : "exam";
    const file = String(exam?.file || "");
    if (!file || file.includes("..") || /^(?:[a-z]+:|[\\/])/i.test(file))
      throw new Error("원본 기출 경로를 확인할 수 없습니다.");
    // The same original-file route used by Archive 1 goEngine: no copied
    // question bank, IndexedDB or localStorage is needed to open a raw source.
    const url = new URL("engine.html", location.href);
    url.searchParams.set("data", "exams/" + file);
    url.searchParams.set("mode", safeMode);
    url.searchParams.set("title", O.displayTitle(exam));
    url.searchParams.set("subject", exam.subject || "");
    if (exam.qCount) url.searchParams.set("q", String(exam.qCount));
    O.applyUrl(url, originalSettingsForExam(exam));
    url.searchParams.set("v", "20261006-interaction-audit-2");
    if (!window.open(url.href, "_blank"))
      throw new Error("팝업을 허용한 뒤 다시 열어 주세요.");
  }

  let quickPoolCache = { index: null, meta: null, metaByUid: null, pools: null };
  // Pools are built once per catalog load (and recorded-meta load) from the unified index; a
  // click or a preset change only reads them.
  function quickPools() {
    const index = unifiedIndex();
    if (!Quick || !index) return null;
    // Quick pools use the recorded-meta index; it is built here (not at boot) so it can never be missing.
    const metaIndex = ensureMetaIndex();
    if (quickPoolCache.index !== index || quickPoolCache.meta !== metaIndex) {
      const metaByUid = new Map((metaIndex || []).map(row => [row.questionUid || row.uid, row]));
      quickPoolCache = { index, meta: metaIndex, metaByUid, pools: Quick.buildPools(index, { metaByUid }) };
    }
    return quickPoolCache.pools;
  }
  // The grade / subject choice is shared by the four products; the difficulty preset is per product.
  function quickEnsureSelection(pools) {
    if (!Unified.GRADES.includes(quickState.grade)) { quickState.grade = ""; quickState.subject = ""; return []; }
    const subjects = Quick.subjectsFor(pools, quickState.grade);
    if (!subjects.some(subject => subject.value === quickState.subject))
      quickState.subject = (subjects.find(subject => subject.items > 0) || subjects[0] || {}).value || "";
    return subjects;
  }
  function renderQuick() {
    const product = quickProduct();
    const tabs = `<div class="quick-tabs" role="group" aria-label="평가 종류">${Quick?.VIEWS.map(view =>
      `<button type="button" class="quick-tab" data-view="${view}" aria-pressed="${view === state.view}">${esc(Quick.PRODUCTS[view].title)}</button>`).join("") || ""}</div>`;
    const pools = quickPools();
    if (!pools) return `${tabs}<section class="panel"><h1>${esc(product?.title || "빠른 평가")}</h1><p class="muted">단원 목록을 준비하지 못했습니다. 페이지를 새로 고쳐 주세요.</p></section>`;
    const subjects = quickEnsureSelection(pools);
    const preset = quickPreset();
    const busy = quickState.busy;
    const mix = Quick.presetMix(product, preset);
    const units = quickState.grade && quickState.subject
      ? Quick.unitsFor(pools, state.view, quickState.grade, quickState.subject) : [];
    const gradeChips = Unified.GRADES.map(grade =>
      `<button type="button" class="quick-chip" data-action="quick-grade" data-grade="${grade}" aria-pressed="${grade === quickState.grade}">${grade}</button>`).join("");
    const subjectChips = subjects.length > 1 ? `<div class="quick-chips" role="group" aria-label="과목">${subjects.map(subject =>
      `<button type="button" class="quick-chip" data-action="quick-subject" data-subject="${esc(subject.value)}" aria-pressed="${subject.value === quickState.subject}"${subject.items || subject.value === quickState.subject ? "" : " disabled"}>${esc(subject.label)} <small>${subject.items}</small></button>`).join("")}</div>` : "";
    let body;
    if (!quickState.grade) body = '<p class="muted">학년을 선택하세요.</p>';
    else if (!units.length)
      body = `<p class="muted">이 과목에는 ${esc(product.title)}에 쓸 수 있는 ${esc(product.unitLabel)}가 아직 없습니다.</p>`;
    else if (product.combine) {
      const selectedUnits = units.filter(unit => quickState.bundle.has(unit.key));
      const verdictAll = Quick.evaluate(units, product, preset);
      const verdictSel = Quick.evaluate(selectedUnits, product, preset);
      const subjectLabel = subjects.find(subject => subject.value === quickState.subject)?.label || "";
      const rows = units.map(unit => `<label class="quick-unit quick-unit-check"><input type="checkbox" data-quick-bundle="${esc(unit.key)}"
        ${quickState.bundle.has(unit.key) ? "checked" : ""}><span><strong>${esc(unit.label)}</strong><small>${quickCountsText(unit, product)}</small></span></label>`).join("");
      body = `<p class="muted">범위를 고르세요. 과목 전체에서 출제하거나, 원하는 단원만 골라 묶을 수 있습니다.</p>
        <div class="quick-units">${rows}</div>
        <div class="quick-actions">
          ${button("quick-open-all", `${esc(subjectLabel)} 전체에서 ${product.count}문항 출력`,
            `type="button" class="primary" ${verdictAll.ok && !busy ? "" : "disabled"}`)}
          ${button("quick-open-selected", `선택한 단원 ${selectedUnits.length}개에서 ${product.count}문항 출력`,
            `type="button" class="primary" ${selectedUnits.length && verdictSel.ok && !busy ? "" : "disabled"}`)}
        </div>
        ${!verdictAll.ok ? `<p class="muted quick-reason">과목 전체: ${esc(Quick.shortageText(verdictAll.shortages))}</p>` : ""}
        ${selectedUnits.length && !verdictSel.ok ? `<p class="muted quick-reason">선택한 단원: ${esc(Quick.shortageText(verdictSel.shortages))}</p>` : ""}`;
    } else {
      const { ready, short } = Quick.partition(units, product, preset);
      const itemsReady = ready.reduce((sum, row) => sum + row.unit.total, 0);
      const parent = unit => product.unitKind === "subunit" ? `<span class="quick-unit-parent">${esc(unit.unitLabel)}</span>` : "";
      const readyCards = ready.map(({ unit }) => `<button type="button" class="quick-unit" data-action="quick-unit"
        data-unit-key="${esc(unit.key)}" ${busy ? "disabled" : ""}>${parent(unit)}<strong>${esc(unit.label)}</strong><small>${quickCountsText(unit, product)}</small></button>`).join("");
      const shortCards = short.map(({ unit, verdict }) => `<button type="button" class="quick-unit is-short" disabled aria-disabled="true">
        ${parent(unit)}<strong>${esc(unit.label)}</strong><small>${quickCountsText(unit, product)}</small><em class="quick-reason">${esc(Quick.shortageText(verdict.shortages))}</em></button>`).join("");
      body = `<p class="muted" id="quick-ready-summary">이 난이도로 만들 수 있는 ${esc(product.unitLabel)} ${ready.length}개 (문항 ${itemsReady}개) · 전체 ${units.length}개</p>
        ${ready.length ? `<div class="quick-units">${readyCards}</div>` : '<p class="callout">이 난이도로 만들 수 있는 단원이 없습니다. 난이도를 바꾸거나 다른 과목을 선택해 보세요.</p>'}
        ${short.length ? `<details class="quick-short" open><summary>문항이 부족한 ${esc(product.unitLabel)} ${short.length}개</summary><div class="quick-units">${shortCards}</div></details>` : ""}`;
    }
    return `${tabs}<div class="intro"><div><h1>${esc(product.title)}</h1></div>${state.view === "subunit-test"
      ? '<a href="assessment/assessment-mvp.html?scope=subunit">기존 소단원 평가팩 45개 보기</a>' : ""}</div>
      <section class="panel"><h2>학년 · 과목</h2>
        <div class="quick-chips" role="group" aria-label="학년">${gradeChips}</div>${subjectChips}
        <p class="muted">2015·2022 개정 문항은 2022 개정 단원 기준으로 함께 묶어 보여줍니다.</p></section>
      <section class="panel"><h2>난이도 · <span id="five-minute-level-current">${Quick.PRESET_LABELS[preset]}</span></h2>
        <div class="five-minute-slider"><div class="five-minute-slider-labels">${product.order.map(key => `<span>${Quick.PRESET_LABELS[key]}</span>`).join("")}</div>
          <div class="five-minute-slider-rail">${product.order.map(() => "<span></span>").join("")}
            <input id="five-minute-level" type="range" min="0" max="${product.order.length - 1}" step="1"
              value="${product.order.indexOf(preset)}" aria-label="${esc(product.title)} 난이도" aria-valuetext="${Quick.PRESET_LABELS[preset]}">
          </div>
        </div><p class="muted" id="quick-assessment-mix">${mix}</p><p class="muted">문항은 최신 연도(2026년, 2025년 순)부터 고릅니다. 같은 연도에서는 무작위로 섞습니다. 난이도는 기록된 1~5단계만 쓰며 하·중·상 표시로 추정하지 않습니다.</p></section>
      <section class="panel"><h2>${esc(product.unitLabel)}</h2>${body}</section>`;
  }
  function fiveMinuteShuffle(rows) {
    const result = rows.slice();
    const value = new Uint32Array(1);
    for (let i = result.length - 1; i > 0; i--) {
      const range = i + 1, limit = Math.floor(4294967296 / range) * range;
      do { crypto.getRandomValues(value); } while (value[0] >= limit);
      const j = value[0] % range;
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  // Recency policy (C.RECENCY_POLICY, user decision 2026-11-10): newest year first, unknown years
  // last; random within the same year.
  function recencyShuffle(rows) {
    return fiveMinuteShuffle(rows).sort(C.compareRecency);
  }
  // Coarse recency tier for the balanced score: 0..8 for known years (newest year 0, capped at 8),
  // 9 for unknown. Always below one "type already used" step (100) of the score.
  function quickRecencyTier(record) {
    const rank = C.recencyRank(C.sourceYear(record));
    return rank >= 1000000 ? 9 : Math.max(0, Math.min(rank, 8));
  }
  function quickCountsText(unit, product) {
    return Quick.BUCKETS.filter(bucket => bucket < 4 || product.count >= 20)
      .map(bucket => `${bucket}단계 ${unit.counts[bucket]}`).join(" · ");
  }
  // Selection inputs come from the cached pool records of the chosen units only (no catalog scan).
  function balancedQuickSelection(units, preset) {
    const pools = { 1: [], 2: [], 3: [], 4: [] }, scopeByUid = new Map(), gradeByUid = new Map();
    for (const unit of units) for (const bucket of Quick.BUCKETS)
      for (const record of unit.buckets[bucket]) {
        pools[bucket].push(record);
        scopeByUid.set(record.questionUid, unit.key);
        gradeByUid.set(record.questionUid, unit.grade);
      }
    const typeByUid = new Map(), subunitByUid = new Map();
    const metaByUid = quickPoolCache.metaByUid;
    for (const uid of scopeByUid.keys()) {
      const row = metaByUid?.get(uid);
      const group = AssessmentRecipes?.representativeGroup?.(row);
      if (group?.concept || group?.type) typeByUid.set(uid, group.concept || group.type);
      const grade = gradeByUid.get(uid);
      if (/^중[123]$/.test(grade)) {
        const entry = quickPoolCache.index?.byUid?.get(uid);
        const parent = entry?.rpmParentStatus === "EXACT" && entry.rpmParent?.grade === grade
          ? entry.rpmParent : null;
        const legacy = entry?.rpmParentStatus === "OUT_OF_SCOPE" && entry.originalCurriculum === "2015";
        // The empty key is the unresolved group, not a guessed legacy L2. Keep its records
        // available in the unit pool while balancing exact current subunits independently.
        subunitByUid.set(uid, String(parent?.L2 || "").trim() ? String(parent.parentKey || "").trim()
          : legacy && row?.subUnitKey ? `legacy:2015:${row.subUnitKey}` : "");
      } else if (row?.subUnitKey) subunitByUid.set(uid, row.subUnitKey);
    }
    const scopeUse = new Map(), subunitUse = new Map(), typeUse = new Map(),
      sourceUse = new Map(), selected = [];
    for (const [bucket, count] of preset) {
      const candidates = recencyShuffle([...new Map(pools[bucket]
        .map(record => [record.questionUid, record])).values()]);
      for (let i = 0; i < count; i++) {
        let best = 0, bestScore = Infinity;
        for (let j = 0; j < candidates.length; j++) {
          const record = candidates[j], type = typeByUid.get(record.questionUid);
          const scope = scopeByUid.get(record.questionUid);
          const subunit = subunitByUid.get(record.questionUid) ?? record.L2;
          const score = (scopeUse.get(scope) || 0) * 1000000 +
            (subunitUse.get(subunit) || 0) * 10000 +
            (type ? (typeUse.get(type) || 0) : 0) * 100 +
            quickRecencyTier(record) * 10 +
            Math.min(sourceUse.get(record.sourceFile) || 0, 9);
          if (score < bestScore) { best = j; bestScore = score; }
        }
        const [record] = candidates.splice(best, 1);
        selected.push(record);
        const scope = scopeByUid.get(record.questionUid);
        scopeUse.set(scope, (scopeUse.get(scope) || 0) + 1);
        const subunit = subunitByUid.get(record.questionUid) ?? record.L2;
        subunitUse.set(subunit, (subunitUse.get(subunit) || 0) + 1);
        const type = typeByUid.get(record.questionUid);
        if (type) typeUse.set(type, (typeUse.get(type) || 0) + 1);
        sourceUse.set(record.sourceFile, (sourceUse.get(record.sourceFile) || 0) + 1);
      }
    }
    return selected;
  }
  function quickUnitsLabel(units, subjectLabel, all) {
    if (all) return `${subjectLabel} 전체`;
    const names = units.map(unit => unit.kind === "subunit" ? unit.label : unit.label);
    return names.length > 3 ? `${names.slice(0, 3).join(" · ")} 외 ${names.length - 3}개` : names.join(" · ");
  }
  // unitKeys: an array of unit keys, or "all" (every unit of the chosen subject, 종합평가).
  async function openQuickAssessment(unitKeys) {
    const product = quickProduct();
    if (!product || quickState.busy) return;
    const pools = quickPools();
    if (!pools || !quickState.grade || !quickState.subject) return;
    const preset = quickPreset();
    const all = Quick.unitsFor(pools, state.view, quickState.grade, quickState.subject);
    const everything = unitKeys === "all";
    const units = everything ? all : all.filter(unit => unitKeys.includes(unit.key));
    const subjectLabel = Unified.subjectByValue(quickState.grade, quickState.subject)?.label || "";
    const label = quickUnitsLabel(units, subjectLabel, everything);
    if (!units.length || (!product.combine && units.length !== 1)) return;
    const verdict = Quick.evaluate(units, product, preset);
    if (!verdict.ok) {
      status(`${label}: ${Quick.shortageText(verdict.shortages)}`, true);
      return;
    }
    const presetPairs = product.presets[preset];
    const pick = () => product.combine || state.view === "unit-test"
      ? balancedQuickSelection(units, presetPairs)
      : presetPairs.flatMap(([bucket, count]) => recencyShuffle([...new Map(
        units.flatMap(unit => unit.buckets[bucket]).map(record => [record.questionUid, record])).values()])
        .slice(0, count));
    const selected = pick();
    if (new Set(selected.map(record => record.questionUid)).size !== product.count) {
      status("같은 문항이 중복되어 시험지를 열 수 없습니다.", true);
      return;
    }
    // The pools are cached per catalog load; every chosen question is checked against the
    // current usage and difficulty conditions before it is printed.
    if (selected.some(record => Quick.usableBucket(record) !== record.difficultyBucket)) {
      quickPoolCache = { index: null, meta: null, metaByUid: null, pools: null };
      status("문항 상태가 바뀌어 목록을 다시 확인합니다. 다시 선택하세요.", true);
      render();
      return;
    }
    const popup = window.open("about:blank", "_blank");
    if (!popup) { status("새 창을 열 수 없습니다. 팝업 설정을 확인하세요.", true); return; }
    popup.document.body.textContent = "시험지를 준비하고 있습니다.";
    quickState.busy = true;
    status("선택한 문항의 원본을 확인하고 있습니다.");
    render();
    try {
      const questions = await Source.restore(selected, state.catalog);
      const questionUids = selected.map(record => record.questionUid);
      const title = `${product.title} · ${label}`;
      const meta = {
        title, customTitle: title, identityTitle: title, count: product.count,
        grade: quickState.grade, subject: subjectLabel, questionUids,
        scopeKeys: units.map(unit => unit.key),
        printHeaderOptions: { title, subtitle: "", metaRight: "AP수학",
          showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
        includeQr: false, qpp: 4, sourceType: "mixed", indexVersion: state.catalog.indexVersion,
      };
      const envelope = await O.publishOutputEnvelope({
        sourceKind: "archive2-compose", sourceId: crypto.randomUUID(), mode: "exam",
        questionCount: product.count, questionUids, meta, questions,
      });
      const url = O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, { studio: true });
      popup.location.replace(url.href);
      status(`${label} · ${questionUids.length}문항 시험지를 열었습니다.`);
    } catch (error) {
      popup.close();
      status(error.message || "시험지를 준비하지 못했습니다.", true);
    } finally {
      quickState.busy = false;
      if (isQuickAssessmentView()) render();
    }
  }
  // ---- Home ----------------------------------------------------------------------------------
  // "Recently opened" is a light record kept only in this browser. Every read and write is
  // guarded: a blocked or full storage must never stop an exam from opening (runtime contract).
  const RECENT_EXAMS_KEY = "APMATH_ARCHIVE2_RECENT_EXAMS_v1";
  const RECENT_EXAMS_MAX = 8;
  function readRecentExams() {
    try {
      const rows = JSON.parse(localStorage.getItem(RECENT_EXAMS_KEY) || "[]");
      return (Array.isArray(rows) ? rows : [])
        .filter((row) => row && typeof row.file === "string" && row.file)
        .slice(0, RECENT_EXAMS_MAX);
    } catch {
      return [];
    }
  }
  function rememberRecentExam(exam, now = Date.now()) {
    try {
      const file = String(exam?.file || "");
      if (!file) return;
      const rows = readRecentExams().filter((row) => row.file !== file);
      rows.unshift({ file, at: now });
      localStorage.setItem(RECENT_EXAMS_KEY, JSON.stringify(rows.slice(0, RECENT_EXAMS_MAX)));
    } catch {
      /* a recent-open record is optional */
    }
  }
  const HOME_GRADES = Object.freeze([
    ["중1", "m1"], ["중2", "m2"], ["중3", "m3"], ["고1", "h1"], ["고2", "h2"], ["고3", "h3"],
  ]);
  const gradeClass = (grade) => {
    const found = HOME_GRADES.find(([label]) => label === String(grade || "").slice(0, 2));
    return found ? `grade-${found[1]}` : "grade-none";
  };
  // Schools with the most original exams, computed from the loaded catalog (never a fixed list).
  function homeSchoolChips(limit = 8) {
    const counts = new Map();
    for (const exam of state.catalog?.exams || []) {
      if (!exam.school || !O.matchesMaterial(exam, "exam")) continue;
      counts.set(exam.school, (counts.get(exam.school) || 0) + 1);
    }
    return [...counts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
      .slice(0, limit)
      .map(([school, count]) => ({ school, count }));
  }
  function relativeDayLabel(at, now = Date.now()) {
    const days = Math.floor((startOfDay(now) - startOfDay(at)) / 86400000);
    if (!Number.isFinite(days) || days < 0) return "";
    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;
    if (days < 14) return "지난주";
    const date = new Date(at);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  function startOfDay(value) {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
  // Recently opened exams that still exist in the catalog; with no record yet, the newest exams.
  function homeExamList(limit = 5) {
    const exams = state.catalog?.exams || [];
    const indexByFile = new Map(exams.map((exam, index) => [exam.file, index]));
    const opened = [];
    for (const row of readRecentExams()) {
      const index = indexByFile.get(row.file);
      if (index !== undefined) opened.push({ index, exam: exams[index], at: row.at });
      if (opened.length >= limit) break;
    }
    if (opened.length) return { kind: "opened", rows: opened };
    const newest = exams
      .map((exam, index) => ({ index, exam }))
      .filter((row) => O.matchesMaterial(row.exam, "exam"))
      .sort((a, b) => C.compareNewest(a.exam, b.exam))
      .slice(0, Math.min(limit, 3));
    return { kind: "newest", rows: newest };
  }
  // ---- One exam row (shared by 학교별 기출 and the home list) -------------------------------------
  // Spine (year + grade), title, subject · count · range, the exam buttons and, on the right, the
  // similar problems of this exam. Both screens draw rows with this one function so they never drift.
  const NO_SIMILAR = Object.freeze({
    setsFor: () => [], originalFileFor: () => null, unlinked: [],
    stats: Object.freeze({ sets: 0, linked: 0, unlinked: 0, originalsWithSimilar: 0, byRule: {} }),
  });
  function similarPairs() {
    return Similar?.pairsFor?.(state.catalog) || NO_SIMILAR;
  }
  // The "유사문제 있는 시험만" check only means something for original exams.
  const findSimilarFilterApplies = (filters) => !filters.material || filters.material === "exam";
  let examIndexCache = null;
  function examIndexOf(exam) {
    const exams = state.catalog?.exams || [];
    if (!examIndexCache || examIndexCache.exams !== exams)
      examIndexCache = { exams, byFile: new Map(exams.map((item, index) => [item.file, index])) };
    return examIndexCache.byFile.get(exam?.file) ?? -1;
  }
  // Opening a similar set counts as opening its exam for the home "최근 연 기출" list.
  function recentTarget(exam) {
    const originalFile = similarPairs().originalFileFor(exam?.file);
    const index = originalFile ? examIndexOf({ file: originalFile }) : -1;
    return index >= 0 ? state.catalog.exams[index] : exam;
  }
  function examRowRangeText(exam) {
    const units = (list) => unique(list.map((value) => String(value || "").trim())).join(" ~ ");
    const ranges = (exam.courseRanges || [])
      .map((range) => ({ course: range.standardCourse || "", text: units([range.rangeStartUnit, range.rangeEndUnit]) }))
      .filter((range) => range.text);
    if (!ranges.length) return units([exam.rangeStartUnit, exam.rangeEndUnit]);
    return ranges.length === 1 ? ranges[0].text : ranges.map((range) => `${range.course} ${range.text}`.trim()).join(" · ");
  }
  function similarCellMarkup(exam, index, pairs) {
    const sets = pairs.setsFor(exam.file);
    if (!sets.length) return '<div class="exam-row-sim none">유사문제 없음</div>';
    if (sets.length === 1) {
      const set = sets[0];
      const setIndex = examIndexOf(set);
      const setTitle = O.displayTitle(set);
      return `<div class="exam-row-sim has"><div class="exam-row-sim-head"><strong>유사문제</strong>${set.qCount ? ` <span>· ${esc(set.qCount)}문항</span>` : ""}</div><div class="exam-row-sim-actions" role="group" aria-label="${esc(setTitle)} 열기·출제">${button("source-output-direct", "열기", `type="button" data-exam="${setIndex}" data-mode="exam" aria-label="${esc(setTitle)} 시험지 열기"`)}${button("source-issue", "출제", `type="button" class="primary" data-exam="${setIndex}" aria-label="${esc(setTitle)} 반에 출제"`)}</div></div>`;
    }
    return `<div class="exam-row-sim has"><div class="exam-row-sim-head"><strong>유사문제</strong> <span>${sets.length}세트</span></div><div class="exam-row-sim-actions">${button("similar-list", "보기", `type="button" data-exam="${index}" aria-label="${esc(O.displayTitle(exam))} 유사문제 ${sets.length}세트 보기"`)}</div></div>`;
  }
  // options: { at } relative-day label, { range } show the unit range, { more } 더보기 menu, { selected }.
  function examRowMarkup(exam, index, options = {}) {
    const pairs = options.pairs || similarPairs();
    const kind = O.materialKind?.(exam) || "exam";
    const year = String(exam.year || "").slice(-2);
    const title = O.displayTitle(exam);
    // The spine already shows year and grade, so an exam row title is school + term only; any missing field keeps the full title.
    const period = exam.examType === "mid" ? "중간고사" : exam.examType === "final" ? "기말고사" : "";
    const shortTitle = exam.school && period && exam.semester && kind === "exam"
      ? `${exam.school} ${exam.semester}학기 ${period}` : title;
    const subject = exam.primaryStandardCourse || unique((exam.courseRanges || []).map((range) => range.standardCourse)).join(" · ") || exam.subject;
    const meta = [subject, exam.qCount ? `${exam.qCount}문항` : "", options.at ? relativeDayLabel(options.at) : ""]
      .filter(Boolean).join(" · ");
    const badges = `${kind !== "exam" && exam.contentType ? badge(exam.contentType) : ""}${exam.gradeConflict ? badge("학년 충돌", "warn") : ""}`;
    const originalFile = kind === "similar" ? pairs.originalFileFor(exam.file) : null;
    const original = originalFile ? state.catalog.exams[examIndexOf({ file: originalFile })] : null;
    const tag = original ? `<div class="exam-row-tag">${esc(O.displayTitle(original))} 기출의 유사문제</div>` : "";
    const range = options.range ? examRowRangeText(exam) : "";
    const withSimilarCell = kind === "exam";
    const similarCount = withSimilarCell ? pairs.setsFor(exam.file).length : 0;
    const direct = ([mode, label]) =>
      button("source-output-direct", label, `type="button" data-exam="${index}" data-mode="${mode}"`);
    const more = options.more
      ? `<details class="finder-card-more"><summary>더보기</summary><div class="finder-card-more-menu">${button("source-toggle", options.selected ? "선택됨" : "문항 선택", `data-exam="${index}" aria-pressed="${!!options.selected}" class="small"`)}</div></details>`
      : "";
    return `<article class="exam-row ${gradeClass(exam.grade)}${options.selected ? " selected" : ""}${withSimilarCell ? "" : " no-sim"}" data-similar-count="${similarCount}">
      <div class="exam-row-spine"><span class="exam-row-year">${esc(year || "–")}</span><span class="exam-row-grade">${esc(exam.grade || "")}</span></div>
      <div class="exam-row-main">${button("source-output-direct", esc(shortTitle), `type="button" class="exam-row-title" title="${esc(title)}" aria-label="${esc(title)} 시험지 열기" data-exam="${index}" data-mode="exam"`)}${tag}<div class="exam-row-meta">${esc(meta)}${badges}</div>${range ? `<div class="exam-row-range">범위 ${esc(range)}</div>` : ""}</div>
      <div class="exam-row-actions" role="group" aria-label="${esc(title)} 시험지·해설·정답·출제">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(direct).join("")}${button("source-issue", "출제", `type="button" class="primary" data-exam="${index}" aria-label="${esc(title)} 반에 출제"`)}${more}</div>
      ${withSimilarCell ? similarCellMarkup(exam, index, pairs) : ""}
    </article>`;
  }
  // Two or more similar sets: one dialog lists them with the same four buttons as the exam.
  function openSimilarList(exam) {
    const sets = similarPairs().setsFor(exam?.file);
    if (!sets.length) return;
    const rows = sets.map((set) => {
      const setIndex = examIndexOf(set);
      const setTitle = O.displayTitle(set);
      const detail = [set.primaryStandardCourse || set.subject, set.qCount ? `${set.qCount}문항` : ""].filter(Boolean).join(" · ");
      const direct = ([mode, label]) =>
        button("source-output-direct", label, `type="button" data-exam="${setIndex}" data-mode="${mode}"`);
      return `<article class="similar-set"><div class="similar-set-main"><strong>${esc(setTitle)}</strong><div class="muted">${esc(detail)}</div></div><div class="similar-set-actions" role="group" aria-label="${esc(setTitle)} 시험지·해설·정답·출제">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(direct).join("")}${button("source-issue", "출제", `type="button" class="primary" data-exam="${setIndex}" aria-label="${esc(setTitle)} 반에 출제"`)}</div></article>`;
    }).join("");
    showDialog(`${O.displayTitle(exam)} · 유사문제`, `<p class="muted">이 기출의 유사문제 ${sets.length}세트입니다.</p><div class="similar-sets">${rows}</div>`);
  }
  const homeExamRowMarkup = ({ index, exam, at }) => examRowMarkup(exam, index, { at });
  // ---- First screen first (2026-11-10) ----------------------------------------------------------
  // The catalog (tens of thousands of questions) takes seconds to download, verify and resolve. The home,
  // 보관함 and 출제 내역 do not need it, so they are drawn first. The two home parts that read the catalog
  // (school chips, recent exam rows) start as placeholders of the final height and are filled in place.
  const HOME_CHIP_PLACEHOLDERS = 8; // homeSchoolChips() returns at most 8
  const bootWaitText = '<p class="boot-wait-text"><span data-boot-label>자료 준비 중</span> <span data-boot-count aria-hidden="true"></span></p><div class="boot-progress-track" aria-hidden="true"><span class="boot-progress-bar" data-boot-bar></span></div>';
  function homeChipsMarkup() {
    if (!state.catalog)
      return state.bootError ? "" : '<span class="home-chip is-pending" aria-hidden="true"></span>'.repeat(HOME_CHIP_PLACEHOLDERS);
    return homeSchoolChips().map(({ school }) => button("home-school", esc(school), `type="button" class="home-chip" data-school="${esc(school)}"`)).join("");
  }
  function homeRecentTitle() {
    if (!state.catalog) return readRecentExams().length ? "최근 연 기출" : "최근 연도 기출";
    return homeExamList().kind === "opened" ? "최근 연 기출" : "최근 연도 기출";
  }
  function homeRecentBodyMarkup() {
    if (!state.catalog) {
      if (state.bootError)
        return `<p class="callout danger" role="alert">${esc(state.bootError)} ${button("boot-retry", "다시 시도", 'class="small"')}</p>`;
      return `<div class="home-recent-pending" data-boot-wait="loading" aria-busy="true"><div class="home-recent-skeleton" aria-hidden="true"><span></span><span></span><span></span></div><div class="home-recent-status">${bootWaitText}</div></div>`;
    }
    const examList = homeExamList();
    return examList.rows.length
      ? `<div class="exam-rows">${examList.rows.map(homeExamRowMarkup).join("")}</div>`
      : '<p class="muted">기출 목록을 불러오면 이곳에 표시됩니다.</p>';
  }
  // Called when the catalog arrives (or fails): replaces only the two placeholder hosts, so text typed in
  // the search box and keyboard focus stay where they are.
  function fillHomeFromCatalog() {
    if (state.view !== "home") return;
    const chips = document.querySelector('[data-home-fill="chips"]');
    const body = document.querySelector('[data-home-fill="recent"]');
    const title = document.getElementById("home-recent-title");
    if (chips) chips.innerHTML = homeChipsMarkup();
    if (title) title.textContent = homeRecentTitle();
    if (body) body.innerHTML = homeRecentBodyMarkup();
  }
  const PREPARING_TITLES = { find: "학교별 기출", compose: "문제지 만들기", health: "자료 점검" };
  // Body of a screen that cannot be drawn before the catalog: the screen name and the live progress.
  // The menu already switched; when the catalog is ready the real screen replaces this by itself.
  function preparingMarkup() {
    const title = (isQuickAssessmentView() && Quick?.PRODUCTS[state.view]?.title) || PREPARING_TITLES[state.view] || "아카이브";
    if (state.bootError)
      return `<section class="panel boot-wait" data-boot-wait="failed"><h1>${esc(title)}</h1><p class="callout danger" role="alert">${esc(state.bootError)}</p><p>${button("boot-retry", "다시 시도", 'class="primary"')} <a href="index.html?legacy=1">기존 아카이브 열기</a></p></section>`;
    return `<section class="panel boot-wait" data-boot-wait="loading" aria-busy="true"><h1>${esc(title)}</h1>${bootWaitText}<p class="muted">자료 준비가 끝나면 이 화면이 저절로 열립니다.</p></section>`;
  }
  function renderHome() {
    const recent = drafts().slice(0, 3);
    // 학교 기출 is the search above; the four quick assessments come first, 모의고사(생성문제) last.
    const products = HOME_PRODUCT_REGISTRY
      .filter((product) => product.productKey !== "school-exams")
      .sort((a, b) => (a.productKey === "generated-bank") - (b.productKey === "generated-bank"));
    const productMarkup = (product) => {
      const count = Quick?.PRODUCTS?.[
        { "five-minute-test": "five-minute", "subunit-assessment": "subunit-test", "unit-assessment": "unit-test", "exam-prep": "monthly-test" }[product.productKey]
      ]?.count;
      return button(
        "home-product",
        `<span>${esc(product.label)}</span>${count ? `<span class="home-quick-count"><span class="home-quick-num">${count}</span>문항</span>` : '<span class="home-quick-open">열기</span>'}`,
        `type="button" class="home-quick-item" data-product-key="${esc(product.productKey)}" data-route-owner="${esc(product.routeOwner || "")}" data-availability="${String(product.availability)}"`,
      );
    };
    return `<div class="archive-home">
      <h1 class="visually-hidden">JS 아카이브 홈</h1>
      <div class="home-top">
        <section class="home-find" aria-labelledby="home-find-title">
          <h2 id="home-find-title" class="home-title">학교 기출 찾기</h2>
          <form id="archive-home-search" class="home-search" role="search">
            <label class="visually-hidden" for="archive-home-query">학교, 학년, 시험으로 검색</label>
            <input id="archive-home-query" type="search" placeholder="순천고 고1 1학기 중간" autocomplete="off" enterkeyhint="search">
            ${button("home-search", "찾기", 'type="button" class="primary home-search-submit"')}
          </form>
          <p class="home-hint">학교, 학년, 시험을 띄어 쓰면 모두 맞는 시험지만 나옵니다. 유사문제가 있는 기출은 옆에 함께 나옵니다.</p>
          <div class="home-chips" aria-label="시험지가 많은 학교"><span class="home-chip-list" data-home-fill="chips">${homeChipsMarkup()}</span>${button("home-all-schools", "전체 학교", 'type="button" class="home-link"')}</div>
        </section>
        <section class="home-units" aria-labelledby="home-units-title">
          <h2 id="home-units-title" class="home-title">단원별로 난이도 골라 주기</h2>
          <div class="home-grades">${HOME_GRADES.map(([label, id]) => `<a class="home-grade grade-${id}" href="unit-past-exams.html?ready=1&amp;grade=${id}">${label}</a>`).join("")}</div>
          <p class="home-hint">학년을 누르면 그 학년의 단원별 기출이 열립니다.</p>
        </section>
      </div>
      <section class="home-recent" aria-labelledby="home-recent-title">
        <div class="home-section-head"><h2 id="home-recent-title">${homeRecentTitle()}</h2>${button("home-all-schools", "학교별 기출 전체 보기", 'type="button" class="home-link"')}</div>
        <div data-home-fill="recent">${homeRecentBodyMarkup()}</div>
      </section>
      <div class="home-bottom">
        <section class="home-drafts" aria-labelledby="home-drafts-title">
          <h2 id="home-drafts-title">만들던 문제지</h2>
          ${recent.length
            ? recent.map((d, i) => `<div class="home-draft"><div class="home-draft-main"><div class="home-draft-title">${esc(d.header?.title || d.title || "문제지")}</div><div class="home-draft-meta">${esc(new Date(d.updatedAt).toLocaleString("ko-KR"))} · ${d.selected?.length || 0}문항 · ${d.round || 1}차</div></div><div class="home-draft-actions">${button("restore", "이어하기", `type="button" data-draft="${i}"`)}${button("delete-draft", "삭제", `type="button" data-draft-id="${esc(d.draftId)}" class="danger" aria-label="${esc(d.header?.title || d.title || "문제지")} 삭제"`)}</div></div>`).join("")
            : '<p class="muted home-empty">저장된 작업이 없습니다.</p>'}
        </section>
        <section class="home-quick" aria-labelledby="home-quick-title">
          <h2 id="home-quick-title">빠른 평가</h2>
          <div class="home-quick-list">${products.map(productMarkup).join("")}</div>
        </section>
      </div>
      <nav class="home-tools" aria-label="그 밖의 도구"><a href="problem-bank-search.html">유형·개념으로 문항 찾기</a><button type="button" class="home-link" data-view="health">자료 점검</button><a href="index.html?legacy=1">아카이브 1.0</a></nav>
    </div>`;
  }

  // "순천고 고1 기출 14개": the conditions in words, then what is being counted.
  function findSummaryText(filters, count) {
    const query = String(filters.query || "").trim();
    const squash = (value) => String(value || "").replace(/\s+/g, "");
    const parts = [];
    if (query) parts.push(query);
    if (filters.school && !squash(query).includes(squash(filters.school))) parts.push(filters.school);
    if (filters.grade && !squash(query).includes(filters.grade)) parts.push(filters.grade);
    if (filters.axis) {
      const label = finderAxisLabel(filters.axis);
      if (!squash(query).includes(squash(label))) parts.push(label);
    }
    if (filters.yearFrom || filters.yearTo) parts.push(`${filters.yearFrom || "…"}~${filters.yearTo || "…"}년`);
    const material = filters.material;
    const kind = material === "exam" ? "기출" : material === "textbook" ? "교과서" : material ? "기출 외 시험지" : "시험지";
    // With no condition the heading uses the name of the view the teacher chose.
    const viewName = material === "exam" ? "학교 기출" : material === "textbook" ? "교과서" : material ? "기출 외 시험지" : "전체 시험지";
    return `${parts.length ? `${parts.join(" ")} ${kind}` : viewName} ${count.toLocaleString()}개`;
  }
  // Nothing in 학교 기출: say so, and tell the teacher when the same conditions do match other material
  // (counted only now, never during a normal render).
  function emptyFindMarkup() {
    const f = state.find;
    if (f.material === "exam" && !f.similarOnly) {
      const other = findExams({ ...f, material: "nonexam" }).length;
      if (other)
        return `<div class="empty find-empty-other"><p>학교 기출에는 없습니다. 기출 외 시험지에 ${other.toLocaleString()}개가 있습니다.</p>${button("material", "기출 외 시험지 보기", 'data-material="nonexam" class="primary"')}</div>`;
    }
    return '<div class="empty">현재 조건에 맞는 자료가 없습니다. 학교·연도·교육과정 중 하나를 넓혀 보세요.</div>';
  }
  function renderFind() {
    reconcileFinderSchool(state.find);
    const exams = findExams();
    const lastPage = Math.max(0, Math.ceil(exams.length / 18) - 1);
    if (state.page > lastPage) {
      state.page = lastPage;
      replaceFinderUrlState();
    }
    const page = exams.slice(state.page * 18, (state.page + 1) * 18);
    const pairs = similarPairs();
    const withSimilar = exams.filter((exam) => pairs.setsFor(exam.file).length).length;
    const showSimilarFilter = findSimilarFilterApplies(state.find);
    const rows = page
      .map((e) => examRowMarkup(e, examIndexOf(e), {
        pairs, range: true, more: true, selected: state.sources.includes(e.file),
      }))
      .join("");
    return `<div class="finder-surface find-surface"><div class="intro finder-intro"><h1>학교별 기출</h1>${button("go-compose", "문제지 만들기")}</div>
      <div class="material-switch" aria-label="찾을 시험지 종류">${[["exam","학교 기출"],["nonexam","기출 외 시험지"],["","전체"]].map(([value,label]) => button("material",label,`data-material="${value}" aria-pressed="${value === "nonexam" ? !!state.find.material && state.find.material !== "exam" : (state.find.material || "") === value}"`)).join("")}</div><div class="material-nav" ${!state.find.material || state.find.material === "exam" ? "hidden" : ""}><label>자료 종류<select data-filter="material" data-group="find">${options([{value:"exam",label:"학교 기출"},{value:"textbook",label:"교과서"},{value:"nonexam",label:"기출 외 전체"},{value:"similar",label:"유사문제 · 유형"},{value:"unit",label:"단원평가"},{value:"other",label:"기타 자료"}],state.find.material,"전체 자료")}</select></label></div>
      <section class="find-panel" aria-label="검색 조건">${finderSearchMarkup(state.find)}${finderQuickMarkup(state.find)}<div class="find-options">${showSimilarFilter ? `<label class="find-check"><input type="checkbox" data-filter="similarOnly" data-group="find"${state.find.similarOnly ? " checked" : ""}>유사문제 있는 시험만</label>` : ""}${finderMoreFiltersMarkup(state.find)}</div>${finderActiveMarkup(state.find)}</section>
      ${state.find.material && state.find.material !== "exam" ? '<a class="assessment-entry" href="assessment/assessment-mvp.html"><span><strong>평가 보관함</strong><small>진단·단원·학기 평가용으로 준비된 시험지</small></span><span>시험지 보기</span></a>' : ""}
      <div class="find-resultbar"><h2>${esc(findSummaryText(state.find, exams.length))}</h2>${showSimilarFilter && withSimilar ? `<span class="find-sim-count">유사문제 있는 시험 ${withSimilar.toLocaleString()}개</span>` : ""}</div>
      <div class="exam-rows find-rows">${showSimilarFilter && exams.length ? '<div class="exam-rows-head" aria-hidden="true"><span>기출</span><span>이 시험의 유사문제</span></div>' : ""}${rows}</div>
      ${!exams.length ? emptyFindMarkup() : ""}
      <div class="pager">${button("page-prev", "이전", state.page === 0 ? "disabled" : "")}<span>${state.page + 1} / ${Math.max(1, Math.ceil(exams.length / 18))}</span>${button("page-next", "다음", (state.page + 1) * 18 >= exams.length ? "disabled" : "")}</div>
      ${state.sources.length ? `<div class="floating finder-selection-bar"><strong>선택한 시험 ${state.sources.length}개</strong><div class="actions">${button("sources-clear", "선택 비우기")}${button("go-compose", "선택한 자료로 문제지 만들기", 'data-use-sources="true"')}</div></div>` : ""}</div>`;
  }

  function renderScopes() {
    if (state.uidRoute) return renderUidRoute();
    if (
      !unifiedIndex() &&
      C.isHighSemanticSubjectGrade?.(state.filters.grade) &&
      !state.filters.semanticSubject
    )
      return `<div class="resultbar"><h2>단원</h2></div><p class="muted">과목을 먼저 선택해 주세요. 선택한 과목의 단원이 여기에 나타납니다.</p>`;
    const scopes = scopeOptions(),
      groups = unique(scopes.map((s) => s.L1)),
      basic = scopes;
    // Range start/end only list real units: "단원 미분류" is selectable by checkbox but is never
    // the default end of a range.
    const rangeOptions = scopes.flatMap((s, i) => s.basicScope && !s.unclassified
      ? [{ value: i, label: s.fullLabel || `${s.L1} · ${s.label}` }] : []);
    // 과목 묶음은 접을 수 있다. 직접 접고 펼친 것을 먼저 따르고, 아니면 넓은 화면(PC)은 모두 펼치며 좁은 화면은
    // 고른 단원이 있는 묶음·현재 과목 묶음·첫 묶음만 펼친다(휴대폰에서 목록이 끝없이 길어지지 않게).
    const wideScreen = Boolean(window.matchMedia?.("(min-width: 1100px)")?.matches);
    const groupMarkup = (rows, detail) => {
      const names = unique(rows.map(s => s.L1)), currentSubject = composeSubjectLabel();
      return `<div class="scope-list">${names.map(g => {
        const members = rows.filter(s => s.L1 === g);
        const explicit = state.scopeGroupOpen[g];
        const open = explicit !== undefined ? explicit
          : wideScreen || names.length === 1 || g === names[0] || g === currentSubject || members.some(scopeIsSelected);
        return `<details class="scope-group" data-scope-group="${esc(g)}"${open ? " open" : ""}><summary class="group-head"><h3>${esc(g)}</h3>${button("scope-group", "모두", `data-group-index="${groups.indexOf(g)}" data-scope-kind="${detail ? "detail" : "basic"}" class="small"`)}</summary>${members.map(s =>
          `<div class="scope-item"><label class="check"><input type="checkbox" data-scope="${esc(s.key)}" ${scopeIsSelected(s) ? "checked" : ""} ${state.sealed ? "disabled" : ""}>${esc(s.label)}${s.unclassified ? ' <span class="scope-hint">단원 정보가 아직 없는 문항 · 선택하면 함께 출제</span>' : ""}</label><small>${s.count}문항</small></div>`
        ).join("")}</details>`;
      }).join("")}</div>`;
    };
    const unifiedNotice = unifiedIndex()
      ? `<p class="muted">단원을 고르세요. 숫자는 지금 낼 수 있는 문항 수입니다.</p>${state.scopeNotice ? `<div class="callout" role="status">${esc(state.scopeNotice)}</div>` : ""}${!scopes.length ? '<p class="muted">현재 조건에 맞는 단원이 없습니다. 세부 조건(학교·시험 시기·연도·난이도)을 넓혀 보세요.</p>' : ""}`
      : "";
    return `<div class="resultbar"><h2>단원</h2><div class="actions">${button("scope-all", "전체 선택", 'class="small"')}${button("scope-clear", "초기화", 'class="small"')}</div></div>
      ${unifiedNotice || '<p class="muted">학년의 1·2학기 전체 단원입니다. 숫자는 지금 출제할 수 있는 문항 수이며, 같은 문항은 한 번만 셉니다. 난이도를 고르지 않으면 난이도가 정해지지 않은 문항까지 포함해 전체에서 고릅니다.</p>'}
      ${groupMarkup(basic, false)}
      ${rangeOptions.length ? `<details class="range-more"><summary>연속 범위로 고르기</summary><div class="range-controls"><label>범위 시작<select id="scope-start">${options(
        rangeOptions,
        rangeOptions[0]?.value ?? 0,
        null,
      )}</select></label><label>범위 끝<select id="scope-end">${options(
        rangeOptions,
        rangeOptions.at(-1)?.value ?? 0,
        null,
      )}</select></label>${button("scope-range", "연속 범위 선택")}</div></details>` : ""}`;
  }
  function bucketButtons(current, row = "") {
    return `<div class="bucket-set" role="group" aria-label="난이도 선택">${button("bucket-all", "전체", `data-row="${esc(row)}" aria-pressed="${!current.length}" ${state.sealed ? "disabled" : ""}`)}${[1, 2, 3, 4, 5].map((n) => button("bucket", n, `data-bucket="${n}" data-row="${esc(row)}" aria-pressed="${current.includes(n)}" ${state.sealed ? "disabled" : ""}`)).join("")}</div>`;
  }
  function composeAdvancedChoices(selectionFilters) {
    const baseFilters = { ...selectionFilters, L3: "", L4: "" };
    const excluded = C.composeExclusions(context()).union;
    const eligible = pool().filter(r =>
      workspaceMatches(r, baseFilters) && composeMetaMatches(r) && workspaceEligibility(r).ok && !excluded.has(r.questionUid));
    const labels = window.ARCHIVE_META_FOUNDATION_LABELS || { problemTypes: {}, templates: {} };
    const concepts = new Map(), types = new Map();
    for (const record of eligible) {
      if (!C.advancedEligible(record, state)) continue;
      const authority = C.advancedAuthority(record);
      const l3 = C.advancedFilterValue(record, 3), l4 = C.advancedFilterValue(record, 4);
      const l3Label = authority === "mf" ? labels.problemTypes[record.problemTypeKey] : record.L3;
      const template = authority === "mf" ? labels.templates[record.templateKey] : null;
      const l4Label = authority === "mf" && template?.parentProblemTypeKey === record.problemTypeKey
        ? template.label : authority === "rpm" ? record.L4 : "";
      if (l3 && l3Label) concepts.set(l3, { value: l3, label: l3Label, authority });
      if (l4 && l4Label && (!state.filters.L3 || l3 === state.filters.L3))
        types.set(l4, { value: l4, label: l4Label, authority });
    }
    const sort = rows => [...rows.values()].sort((a, b) => a.label.localeCompare(b.label, "ko"));
    return { concepts: sort(concepts), types: sort(types) };
  }
  // Recorded concept/type/template facets (S14) over the questions of the selected units, or of
  // every listed unit while none is selected, with per-option status mixes (승인 / 검토 대기).
  // Faceted: each list ignores its own selection and honours the other selections.
  function composeMetaFacets() {
    const scopes = scopeOptions();
    const picked = scopes.filter(scopeIsSelected);
    const uids = new Set((picked.length ? picked : scopes).flatMap((scope) => scope.facetQuestionUids || scope.scopeQuestionUids || []));
    const index = unifiedIndex();
    const records = index
      ? [...uids].map((uid) => index.byUid.get(uid)?.record).filter(Boolean)
      : (state.catalog.records || []).filter((record) => uids.has(record.questionUid));
    const options = C.metaFacetOptions(records, state.filters, metaFacetLabel);
    // A stored selection that no longer exists in the current units is dropped (never silently
    // kept as an invisible zero-result filter).
    let cleared = false;
    for (const [key, list] of [["metaL3", options.l3], ["metaPT", options.pt], ["metaTPL", options.tpl]])
      if (state.filters[key] && !list.some((option) => option.value === state.filters[key])) {
        state.filters[key] = "";
        cleared = true;
      }
    return { ...options, poolSize: records.length, cleared };
  }
  const facetOptionMarkup = (list, current, emptyLabel) =>
    `<option value="">${esc(emptyLabel)}</option>${list.map((option) =>
      `<option value="${esc(option.value)}"${current === option.value ? " selected" : ""}>${esc(option.label)} · ${esc(C.metaFacetStatusText(option))}</option>`).join("")}`;
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
  function renderDerivedComposition() {
    const sourceTitle = state.derivationSource?.parentDisplayName || "저장한 시험지";
    return `<section class="panel compose-composition"><div class="compose-step-head"><span class="compose-step-number">4</span><h2>원본 저장 시험지의 고정된 범위</h2></div><p class="muted">원본 ${esc(sourceTitle)}의 범위와 ${state.selected.length}문항으로 새 문제지를 만들었습니다. 문항 교체와 출력 설정을 바꿔 새 시험지로 저장할 수 있습니다.</p><p class="muted">바꾸지 않은 문항은 저장 당시 내용 그대로 사용합니다. 원래 저장한 시험지는 바뀌지 않습니다.</p></section>`;
  }
  // ---- 문제지 만들기 한 화면 (2026-11-10) -----------------------------------------------------------------
  // 왼쪽은 조건(renderPrimary·renderScopes·renderComposition), 오른쪽은 결과와 마무리(renderResult). 로직(선택 엔진·저장·
  // 초안 자동저장·고정/교체)은 그대로이고 마크업만 이 두 칸으로 재배치했다. 조건을 바꿔도 자동으로 다시 뽑지 않는다
  // (교사가 고정·교체한 문항이 사라지기 때문). 대신 "지금 조건으로 N문항 가능 · 요청 M문항"을 항상 보인다.
  // 선택된 문항의 단원 이름: 통합 단원 목록의 이름을 먼저 쓰고, 없으면 기록된 L2를 쓴다.
  const composeUnitLabel = (record) => unifiedIndex()?.byUid.get(record.questionUid)?.unitLabel || record.L2 || "";
  function composeStepLabel(row) {
    const label = row.label || "선택한 전체 범위";
    const buckets = row.difficultyBuckets || [];
    return buckets.length ? `${label} · ${buckets.join("·")}단계` : label;
  }
  let composeLiveInfo = null;
  function composeLiveMarkup(info) {
    const { rows, perRow, shortages } = info;
    const requested = rows.reduce((n, row) => n + row.count, 0);
    const possible = perRow.reduce((n, item) => n + Math.min(item.row.count, item.available), 0);
    const countValid = state.distribution === "all" ||
      (Number.isInteger(state.count) && state.count >= 1 && state.count <= 400);
    const regenerate = state.selected.length > 0;
    const overLimit = countValid && requested > 400;
    let line;
    if (!rows.length)
      line = '<p class="cz-feasible muted" data-cz-feasible="empty">단원을 고르면 뽑을 수 있는 문항 수가 여기에 보입니다.</p>';
    else if (!countValid)
      line = '<p class="cz-feasible muted" data-cz-feasible="count">문항 수는 1~400 사이로 입력해 주세요.</p>';
    else if (overLimit)
      line = `<p class="cz-feasible danger-text" data-cz-feasible="limit">한 번에 최대 400문항입니다(지금 요청 ${requested}문항). 단원이나 문항 수를 줄여 주세요.</p>`;
    else if (!possible)
      line = '<p class="cz-feasible danger-text" data-cz-feasible="none">고른 조건에 맞는 문항이 없습니다. 단원이나 난이도 단계 조건을 넓혀 보세요.</p>';
    else {
      const unitsNote = rows.length > 1 && state.distribution !== "pool" ? ` (단원 ${rows.length}개)` : "";
      line = `<p class="cz-feasible" data-cz-feasible="ok"><span class="cz-feasible-n">${possible}문항</span> 가능 <span aria-hidden="true">·</span> 요청 ${requested}문항${unitsNote}</p>`;
      if (shortages.length)
        line += `<p class="cz-feasible-note" data-cz-feasible-short>모자라도 막지 않고 있는 만큼만 넣습니다. ${shortages.slice(0, 3).map((item) =>
          `${esc(composeStepLabel(item.row))}: 요청 ${item.row.count} · 가능 ${item.available}`).join(" / ")}${shortages.length > 3 ? ` 외 ${shortages.length - 3}곳` : ""}</p>`;
    }
    const disabled = !rows.length || state.sealed || state.busy || !countValid || !possible || overLimit;
    composeLiveInfo = { requested, possible, disabled, hasRows: rows.length > 0, overLimit };
    return `<div class="cz-live" data-cz-live>${line}${button(
      "generate",
      regenerate ? "같은 조건으로 다시 뽑기" : "문제지 만들기",
      `class="${regenerate ? "cz-generate" : "primary cz-generate"}" ${disabled ? "disabled" : ""}`,
    )}</div>`;
  }
  function composeFilesMarkup() {
    return `<div class="cz-files" role="group" aria-label="작업 파일">${button("backup", "작업 백업 다운로드", 'class="small"')}${button("import", "백업 불러오기", 'class="small"')}</div>`;
  }
  // 조건 순서: 학년 → 과목 → 난이도 단계 → 문항 수 → 단원(긴 목록) → 더 자세한 조건 → 요약 + 문제지 만들기.
  // 짧은 조작을 위에 두고 긴 단원 목록을 마지막에 두어, 목록이 길어도 단계·문항 수가 화면 아래로 밀리지 않는다.
  function renderComposition() {
    const parts = composeParts();
    return parts.amount + parts.tail;
  }
  function composeParts() {
    if (state.derivationSource) return { amount: renderDerivedComposition(), tail: "" };
    const fixedAssessment = isAssessmentRecipeMode();
    if (fixedAssessment) {
      state.distribution = "pool";
      state.count = activeAssessmentRecipe()?.defaultCount || 4;
    }
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      primaryPaths: selectedScopePaths(),
    };
    const rows = planRows();
    const excluded = C.composeExclusions(context()).union;
    const candidates = pool().filter(
      (r) =>
        workspaceMatches(r, selectionFilters) &&
        composeMetaMatches(r) &&
        workspaceEligibility(r).ok &&
        !excluded.has(r.questionUid),
    );
    const perRow = rows.map((row) => ({
      row,
      available: candidates.filter((r) => C.rowMatches(r, row, workspaceMatchOptions())).length,
    }));
    const shortages = perRow.filter((item) => item.available < item.row.count);
    // Older drafts may still carry the strict concept/type pair; it is only shown while set.
    const legacyAdvanced = state.filters.L3 || state.filters.L4 ? composeAdvancedChoices(selectionFilters) : null;
    const facets = composeMetaFacets();
    if (facets.cleared) queueMicrotask(render);
    const detailFilters = state.filters;
    const detailCount = [
      detailFilters.originalCurriculum, detailFilters.school, detailFilters.axis,
      detailFilters.yearFrom || detailFilters.yearTo, detailFilters.L3, detailFilters.L4,
      detailFilters.metaL3, detailFilters.metaPT, detailFilters.metaTPL, detailFilters.metaApprovedOnly,
    ].filter(Boolean).length;
    const facetDisabled = state.sealed ? "disabled" : "";
    const facetNote = !facets.poolSize
      ? "선택할 수 있는 단원이 없습니다."
      : facets.l3.length || facets.pt.length || facets.tpl.length
        ? `이 범위 ${facets.poolSize}문항 중 기록된 분류가 있는 문항에서 고를 수 있습니다. ‘검토 대기’는 아직 승인되지 않은 분류이며, 승인된 분류와 같은 방식으로 사용할 수 있습니다.`
        : "이 범위의 문항에는 기록된 개념·유형·풀이 분류가 아직 없습니다.";
    const amountNote = state.distribution === "pool"
      ? `전체 ${esc(state.count)}문항`
      : state.distribution === "all"
        ? "조건에 맞는 문항 전부"
        : `단원마다 ${esc(state.count)}문항씩`;
    const countDisabled = state.distribution === "all" || state.sealed ? "disabled" : "";
    const stepper = `<span class="cz-stepper" role="group" aria-labelledby="compose-count-label">${button("count-step", "", `type="button" class="cz-step-btn is-minus" data-step="-1" aria-label="문항 한 개 줄이기" ${countDisabled}`)}<input id="count" type="number" inputmode="numeric" min="1" max="400" value="${esc(state.count)}" aria-labelledby="compose-count-label" ${countDisabled}>${button("count-step", "", `type="button" class="cz-step-btn is-plus" data-step="1" aria-label="문항 한 개 늘리기" ${countDisabled}`)}</span>`;
    const detail = `<details class="compose-detail cz-detail" ${state.composeDetailOpen ? "open" : ""}><summary>더 자세한 조건${detailCount ? ` <span class="badge" aria-label="적용 중인 세부 조건 ${detailCount}개">${detailCount}개 적용 중</span>` : ""}</summary><div class="cz-detail-body">
      <div class="inline"><label>배분 방식<select id="distribution" ${state.sealed ? "disabled" : ""}>${options(
        [
          { value: "equal", label: "단원별 균등" },
          { value: "pool", label: "전체에서 선택" },
          { value: "custom", label: "직접 배분" },
          { value: "all", label: "조건 일치 전부" },
        ],
        state.distribution,
        null,
      )}</select></label></div>
      ${state.uidRoute ? "" : `${filterMarkup(state.filters, "compose", "detail")}<div class="compose-taxonomy" data-meta-facets><strong>개념·유형·풀이로 더 좁히기</strong><div class="compose-detail-fields"><label>개념<select data-filter="metaL3" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.l3, state.filters.metaL3, "전체 개념")}</select></label><label>유형<select data-filter="metaPT" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.pt, state.filters.metaPT, "전체 유형")}</select></label><label>풀이<select data-filter="metaTPL" data-group="compose" ${facetDisabled}>${facetOptionMarkup(facets.tpl, state.filters.metaTPL, "전체 풀이")}</select></label><label class="check"><input type="checkbox" data-filter="metaApprovedOnly" data-group="compose" ${state.filters.metaApprovedOnly ? "checked" : ""} ${facetDisabled}>승인된 분류만</label></div><p class="muted">${esc(facetNote)}</p>${legacyAdvanced ? `<div class="compose-detail-fields"><label>기존 개념 조건<select data-filter="L3" data-group="compose" ${facetDisabled}>${advancedOptions(legacyAdvanced.concepts, state.filters.L3, "전체 개념")}</select></label><label>기존 유형 조건<select data-filter="L4" data-group="compose" ${facetDisabled}>${advancedOptions(legacyAdvanced.types, state.filters.L4, "전체 유형")}</select></label></div>` : ""}</div>`}
      ${rows.length ? `<table class="composition"><thead><tr><th>범위</th><th>난이도</th><th>요청</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${esc(row.label || "선택한 전체 범위")}</td><td>${state.distribution === "custom" ? bucketButtons(row.difficultyBuckets, row.id) : esc(row.difficultyBuckets.join(" · ")) || "전체"}</td><td>${state.distribution === "custom" ? `<input type="number" min="1" max="400" data-row-count="${esc(row.id)}" value="${esc(row.count)}" aria-label="${esc(row.label)} 문항 수" ${state.sealed ? "disabled" : ""}>` : esc(row.count)}</td></tr>`).join("")}</tbody></table>` : '<p class="muted">위에서 출제할 범위를 선택하세요.</p>'}
      <p class="muted">조건에 맞는 문항을 최신 연도부터(2026년, 2025년, 2024년 순) 선택하고, 연도를 알 수 없는 자료는 마지막에 선택합니다. 같은 연도 안에서는 문항을 섞습니다. 50문항 기준으로 분할하며, 단원·난이도·출처 조건을 그대로 지킵니다.</p>
      ${composeFilesMarkup()}</div></details>`;
    const amount = `<div class="cz-block cz-amount"><div class="compose-difficulty cz-levels"><div class="cz-levels-head"><strong id="compose-difficulty-label">난이도 단계</strong><span class="muted">고르지 않으면 모든 단계에서 뽑습니다.</span></div>${bucketButtons(state.buckets)}</div>
      <div class="cz-amount-row"><span class="cz-label" id="compose-count-label">문항 수</span>${stepper}<span class="cz-amount-note">${amountNote}</span></div></div>`;
    return { amount, tail: `${detail}${composeLiveMarkup({ rows, perRow, shortages })}` };
  }
  // Year spread of the generated paper, in the recency order the selection used.
  function yearDistribution(records) {
    const counts = new Map();
    for (const record of records) {
      const year = C.sourceYear(record);
      counts.set(year, (counts.get(year) || 0) + 1);
    }
    return C.sortYearsByRecency(counts.keys())
      .map((year) => ({ year, label: year ? `${year}년` : "연도 미상", count: counts.get(year) }));
  }
  // Problem-type spread of the generated paper (only questions with a recorded type count).
  function typeCoverageLine() {
    if (!state.selected.length || !C.typeCoverage) return "";
    const coverage = C.typeCoverage(state.selected);
    if (!coverage.typedCount) return "";
    const repeated = coverage.repeatedCount ? ` (같은 유형 중복 ${coverage.repeatedCount}문항)` : "";
    return `<div class="summary-line" data-type-coverage><span>기록된 유형</span><strong>${coverage.typedCount}문항 · 서로 다른 유형 ${coverage.distinctTypes}가지${repeated}</strong></div>`;
  }
  // 요약: 문항 수·권 수·단원/단계 구성, 모자랐던 곳, 검증 결과. 저장 확인 탭이 하던 일을 오른쪽 위로 옮겼다.
  function renderResultSummary(r = state.selected.length ? review() : null) {
    const parts = Math.max(1, Math.ceil(state.selected.length / 50));
    const tally = (keyOf) => {
      const counts = new Map();
      for (const record of state.selected) counts.set(keyOf(record), (counts.get(keyOf(record)) || 0) + 1);
      return counts;
    };
    const units = [...tally((record) => composeUnitLabel(record) || "단원 미분류")];
    const unitText = units.length > 4
      ? `${units.slice(0, 4).map(([name, n]) => `${esc(name)} ${n}`).join(" · ")} 외 ${units.length - 4}개 단원`
      : units.map(([name, n]) => `${esc(name)} ${n}`).join(" · ");
    const steps = [...tally((record) => Number(record.difficultyBucket) || 0)]
      .sort((a, b) => (a[0] || 99) - (b[0] || 99));
    const stepText = steps.map(([step, n]) => `${step ? `${step}단계` : "단계 미지정"} ${n}`).join(" · ");
    const shortage = state.composeShortage.length
      ? `<div class="callout cz-shortage" role="status" data-compose-shortage><strong>모자라서 있는 만큼만 넣었습니다.</strong><ul>${state.composeShortage.map((item) =>
        `<li>${esc(composeStepLabel(item))}: ${item.requested - item.got}문항 모자람 (요청 ${item.requested}, 넣은 문항 ${item.got})</li>`).join("")}</ul></div>`
      : "";
    return `<div class="cz-summary" data-cz-summary><h2 class="cz-result-title" data-cz-result-title>만들어진 문제지</h2>
      <div class="cz-count"><span class="cz-big">${state.selected.length}문항</span><span class="cz-parts">${parts}권</span></div>
      <p class="cz-mix">${unitText}</p><p class="cz-mix">${stepText}</p>
      ${shortage}
      <div class="cz-facts"><div class="summary-line"><span>회차</span><strong>${esc(state.round)}차</strong></div><div class="summary-line"><span>선택 범위</span><strong>${state.derivationSource ? "원본 유지" : `${selectedScopeOptions().length}개`}</strong></div><div class="summary-line"><span>고정 문항</span><strong>${state.pins.length}개</strong></div><div class="summary-line"><span>이전 회차 사용</span><strong>${unique(state.rounds.flatMap((round) => round.questionUids)).length}문항</strong></div>
      ${typeCoverageLine()}
      ${state.selected.length ? `<div class="summary-line" data-year-distribution><span>출제 연도</span><strong>${yearDistribution(state.selected).map((item) => `${esc(item.label)} ${item.count}문항`).join(" · ")}</strong></div>` : ""}</div>
      ${r ? `<div class="callout ${r.status === "HARD_BLOCK" ? "danger" : r.status === "PASS" ? "good" : ""}"><strong>${r.status === "PASS" ? "검증 통과" : r.status === "WARN" ? "확인할 내용이 있습니다" : "출력·출제 차단"}</strong>${[...r.hardFailures, ...r.warnings].map((m) => `<div>${esc(m)}</div>`).join("")}<div>중복 없이 ${r.metrics.uniqueUidCount}문항 · 원본 ${r.metrics.sourceCount}개 시험</div></div>` : ""}
      ${r?.warnings.length ? `<label class="check"><input type="checkbox" id="ack-warnings" ${state.ackWarnings ? "checked" : ""}>안내를 확인했습니다.</label>` : ""}</div>`;
  }
  // 출력 설정(제목·머리말·쪽당 문항·QR 등)은 접어 둔다. 열림 여부는 toggle 이벤트로 state에 기억한다.
  function renderOutputSettings() {
    const frozen = Parts.receipt(state.receipts, state.previewIndex),
      frozenPaper = frozen && frozenPaperCache.get(frozen.key);
    return `<details class="cz-output" data-cz-output ${state.outputSettingsOpen ? "open" : ""}><summary>출력 설정</summary>${(frozen
      ? '<p class="callout">이미 출제한 문제지의 출력 설정입니다. 수정할 문제지를 먼저 선택하세요.</p>'
      : "") +
      O.markup(
        frozenPaper
          ? {
              header: frozenPaper.meta.printHeaderOptions,
              qpp: frozenPaper.meta.qpp,
              includeQr: frozenPaper.meta.includeQr,
            }
          : state,
        "studio",
        Boolean(frozen) || state.sealed,
      )}</details>`;
  }
  // 현재 편집본이 이미 저장되어 있으면 그 저장본의 id들(권 순서)을, 아니면 빈 배열을 준다.
  function currentSavedPaperIds() {
    const saved = state.saveResultState === "SAVED" &&
      Boolean(state.saveResultSignature) && state.saveResultSignature === saveWorkSignature();
    return saved ? savedPaperIds(state.lastSavedPaperIds) : [];
  }
  // 마무리 버튼 세 개: 출력 · 보관함에 저장 · 저장하고 반에 출제(이 화면의 주 버튼).
  function composeFinishButtons(r, { compact = false } = {}) {
    const warnBlocked = r.warnings.length > 0 && !state.ackWarnings;
    const saveHardFailures = r.hardFailures.filter((failure) => failure !== "문항 목록이 갱신되었습니다. 다시 만들어 주세요.");
    const saveBlocked = !state.selected.length || saveHardFailures.length > 0 || warnBlocked;
    const printDisabled = r.status === "HARD_BLOCK" || warnBlocked;
    const alreadySaved = currentSavedPaperIds().length > 0;
    const assignDisabled = state.assignBusy || state.saveBusy || (!alreadySaved && saveBlocked);
    return {
      printDisabled,
      print: button("print", "출력", `class="cz-secondary" ${printDisabled ? "disabled" : ""}`),
      save: button("save-paper", state.saveBusy ? "저장 중…" : "보관함에 저장", `class="cz-secondary" ${state.saveBusy || saveBlocked ? "disabled" : ""}`),
      assign: button("save-and-assign", state.assignBusy ? "여는 중…" : alreadySaved ? "저장한 문제지 출제" : "저장하고 출제", `class="primary cz-primary"${state.assignBusy ? "" : ` aria-label="${alreadySaved ? "저장한 문제지 반에 출제" : "저장하고 반에 출제"}"`} ${assignDisabled ? "disabled" : ""}`),
    };
  }
  function renderResultFinish(r = state.selected.length ? review() : null) {
    if (!r) return '<div class="cz-finish" data-cz-finish></div>';
    const buttons = composeFinishButtons(r);
    const saveResultCurrent = Boolean(state.saveResultSignature) &&
      state.saveResultSignature === saveWorkSignature();
    const savedResult = state.saveResultState === "RESULT_UNKNOWN"
      ? '<div class="callout danger" role="status" aria-live="polite">저장 응답을 확인하지 못했습니다. 작업 중인 문제지의 편집은 잠겨 있습니다. 위의 ‘저장 결과 확인’을 눌러 주세요. 출력과 작업 백업은 사용할 수 있습니다.</div>'
      : state.saveError && saveResultCurrent
        ? `<div class="callout danger" role="alert">저장하지 못했습니다. 편집한 문제지는 유지됩니다.<br>${esc(teacherErrorMessage(state.saveError))}</div>`
        : ""; // 저장했다는 안내는 위의 "마지막 저장본"이 이미 말한다(같은 문장을 두 곳에 쓰지 않는다).
    const saveStaleNotice = state.indexVersion !== state.catalog.indexVersion
      ? '<div class="callout">문항 목록 버전이 달라 서버가 저장 시 각 문항 내용과 출제 범위를 다시 확인합니다.</div>'
      : "";
    // 저장 결과를 모를 때는 위 복구 영역의 버튼(저장 결과 확인·출력·백업)만 쓴다.
    if (state.saveResultState === "RESULT_UNKNOWN") return `<div class="cz-finish" data-cz-finish>${savedResult}</div>`;
    return `<div class="cz-finish" data-cz-finish>${saveStaleNotice}${savedResult}<div class="cz-actions" role="group" aria-label="마무리">${buttons.print}${buttons.save}${buttons.assign}<details class="cz-more cz-finish-more"><summary>더보기</summary><div class="cz-more-menu">${button("backup", "작업 백업 다운로드", 'class="small"')}${button("import", "백업 불러오기", 'class="small"')}</div></details></div></div>`;
  }
  // 예전 오른쪽 패널(요약 + 마무리). 화면은 요약과 마무리를 따로 놓지만 함수명은 유지한다.
  function renderInspector() {
    return renderResultSummary() + renderOutputSettings() + renderResultFinish();
  }
  // Local output and backup stay available while the save result is unknown (they do not change it).
  function recoveryOutputMarkup() {
    if (!state.selected.length) return button("backup", "작업 백업 다운로드", 'class="small"');
    const r = review();
    return `${button("print", "출력", `class="small" ${r.status === "HARD_BLOCK" ? "disabled" : ""}`)}${button("backup", "작업 백업 다운로드", 'class="small"')}${
      r.warnings.length && r.status !== "HARD_BLOCK"
        ? `<label class="check"><input type="checkbox" id="ack-warnings-recovery" ${state.ackWarnings ? "checked" : ""}>출력 전 안내를 확인했습니다.</label>`
        : ""}`;
  }
  function renderSaveRecovery() {
    if (state.saveResultState !== "RESULT_UNKNOWN") return "";
    return `<section class="callout danger compose-save-recovery" role="status" aria-live="polite">
      <strong>저장 결과를 확인할 수 없습니다.</strong>
      <p>이미 저장되었는지 확인하거나, 중복 없이 다시 저장합니다. 확인될 때까지 작업 중인 문제지는 수정할 수 없지만, 출력과 작업 백업은 지금도 할 수 있습니다.</p>
      <div class="actions">${button("save-paper", "저장 결과 확인", 'class="primary"')}${recoveryOutputMarkup()}</div>
    </section>`;
  }
  function renderSavedContinuity() {
    const ids = savedPaperIds(state.lastSavedPaperIds);
    if (!ids.length) return "";
    const currentSaved = state.saveResultState === "SAVED" &&
      Boolean(state.saveResultSignature) && state.saveResultSignature === saveWorkSignature();
    const statusCopy = currentSaved
      ? state.saveMessage || "현재 편집본을 시험지로 저장했습니다."
      : state.saveResultState === "RESULT_UNKNOWN"
        ? "지금 저장한 결과를 아직 확인하지 못했습니다. 아래 버튼은 직전에 확인된 저장본을 엽니다."
        : state.saveResultState === "SAVING"
          ? "지금 저장하는 중입니다. 직전 저장본은 그대로 사용할 수 있습니다."
          : "현재 편집본은 저장되지 않았습니다. 아래 버튼은 마지막으로 저장한 내용 그대로 사용합니다.";
    return `<section class="panel compose-saved-continuity" aria-labelledby="compose-saved-continuity-title">
      <div class="compose-saved-continuity-head"><h2 id="compose-saved-continuity-title">마지막 저장본</h2><p class="muted">${esc(statusCopy)}</p></div>
      <div class="compose-saved-continuity-list">${ids.map((id, index) => {
        const part = ids.length > 1 ? `${index + 1}권` : "저장본";
        return `<article class="compose-saved-continuity-paper" data-saved-paper-id="${esc(id)}">
          <strong>${part}</strong>
          <div class="actions" role="group" aria-label="${part} 출제·출력">
            ${button("saved-paper-issue", ids.length > 1 ? `${index + 1}권 출제` : "이 저장본 출제", `data-paper-id="${esc(id)}" class="primary" aria-label="${ids.length > 1 ? `${index + 1}권 반에 출제` : "이 저장본 반에 출제"}"`)}
            ${button("saved-output", "시험지", `data-paper-id="${esc(id)}" data-mode="exam" class="small"`)}
            ${button("saved-output", "해설", `data-paper-id="${esc(id)}" data-mode="sol" class="small"`)}
            ${button("saved-output", "정답", `data-paper-id="${esc(id)}" data-mode="ans" class="small"`)}
            <details class="compose-saved-continuity-more"><summary>더보기</summary><div>${button("saved-paper-view", "저장본 보기", `data-paper-id="${esc(id)}"`)}</div></details>
          </div>
        </article>`;
      }).join("")}</div>
    </section>`;
  }
  function refreshComposeSaveContinuity() {
    const host = document.getElementById("compose-save-continuity");
    if (host) host.innerHTML = renderSaveRecovery() + renderSavedContinuity();
    refreshComposeBar();
  }
  // 하단 고정 띠(휴대폰·좁은 화면)만 새로 그린다.
  function refreshComposeBar() {
    const bar = document.querySelector(".cz-bar");
    const markup = renderMobileActions();
    if (bar) {
      if (markup) bar.outerHTML = markup;
      else bar.remove();
    } else if (markup) {
      document.querySelector("#content")?.insertAdjacentHTML("beforeend", markup);
    }
  }
  function renderPaper() {
    const modes = [
      ["exam", "문제지"],
      ["sol", "해설"],
      ["ans", "정답"],
    ]
      .map(([k, l]) =>
        button(
          "output-mode",
          l,
          `data-mode="${k}" class="small ${state.outputMode === k ? "active" : ""}" aria-pressed="${state.outputMode === k}"`,
        ),
      )
      .join("");
    const parts = Math.ceil(state.selected.length / 50);
    const tools =
      button("pin-all", "전체 고정", 'class="small"') +
      button("pin-clear", "고정 해제", 'class="small"') +
      button("rebuild", "고정 외 다시 만들기", state.sealed ? "disabled" : "") +
      button(
        "undo",
        "교체 되돌리기",
        !state.undo.length || state.sealed ? "disabled" : "",
      );
    const rows = state.selected
      .map((r, i) =>
        Parts.partIndex(i) !== state.previewIndex
          ? ""
          : `<div data-question-uid="${r.questionUid}" class="paper-row ${state.pins.includes(r.questionUid) ? "pinned" : ""}"><strong>${(i % 50) + 1}</strong><div class="description">${esc(composeUnitLabel(r))} · 난이도 ${r.difficultyBucket}<br><span class="muted">${esc(r.year)} ${esc(r.school)} · 원본 ${esc(r.sourceQuestionNo)}번 · ${esc(displayTemplate(r))}</span></div><div class="actions">${button("pin", state.pins.includes(r.questionUid) ? "고정됨" : "고정", `data-index="${i}" aria-pressed="${state.pins.includes(r.questionUid)}" class="small" ${state.sealed || lockedIndex(i) ? "disabled" : ""}`)}${button("replace", "교체", `data-index="${i}" class="small" ${state.sealed || lockedIndex(i) ? "disabled" : ""}`)}</div></div>`,
      )
      .join("");
    // 권 고르기: 여러 권일 때만 보인다(한 권이면 고를 것이 없다). 선택값은 미리보기·출력·교체 목록이 따른다.
    const partSelect = parts < 2 ? "" : `<label class="part-select">문제지<select id="preview-index">${options(
      Array.from({ length: parts }, (_, i) => ({
        value: i,
        label: `${i + 1}권 / ${parts}권${Parts.receipt(state.receipts, i) ? " · 출제됨" : ""}`,
      })),
      state.previewIndex,
      null,
    )}</select></label>`;
    return `<section class="paper-panel cz-paper">${partSelect}<details id="question-list" class="question-manager" ${state.questionListOpen ? "open" : ""}><summary>문항별 고정·교체 (${state.selected.length}문항)</summary><div class="actions batch-tools">${tools}</div><div class="paper-list">${rows}</div></details>
      <div class="paper-toolbar cz-preview-bar"><div class="actions mode-switch" role="group" aria-label="미리보기 종류">${modes}</div><span class="muted paper-count">${state.selected.length}문항</span>${button("preview-toggle", state.previewOpen ? "미리보기 접기" : "미리보기 펼치기", `class="small cz-preview-toggle" aria-expanded="${state.previewOpen}" aria-controls="preview-host"`)}</div>
      ${state.previewOpen ? '<div id="preview-host"><div class="loading">실제 출력 엔진으로 미리보기를 준비합니다.</div></div>' : ""}</section>`;
  }
  // 하단 고정 띠(960~1100px 사이와 그보다 좁은 화면): 결과 전에는 "N문항 가능 + 문제지 만들기",
  // 결과 뒤에는 "20문항 · 1권 + 출력 + 더보기". 폭이 넓으면 CSS가 숨긴다.
  function renderMobileActions(r = state.selected.length ? review() : null) {
    if (state.saveResultState === "RESULT_UNKNOWN")
      return '<div class="cz-bar" role="region" aria-label="문제지 작업"><div class="cz-bar-text"><strong class="cz-bar-count">저장 결과 확인 필요</strong></div>' +
        button("save-paper", "저장 결과 확인", 'class="primary cz-bar-main"') +
        (state.selected.length ? button("print", "출력", 'class="cz-bar-sub"') : "") + "</div>";
    if (!r) {
      if (state.derivationSource) return "";
      const info = composeLiveInfo;
      const disabled = !info || info.disabled;
      return `<div class="cz-bar" role="region" aria-label="문제지 작업"><div class="cz-bar-text">${info?.hasRows && info.overLimit
        ? `<strong class="cz-bar-count">최대 400문항</strong><span class="cz-bar-note">지금 요청 ${info.requested}문항</span>`
        : info?.hasRows
        ? `<strong class="cz-bar-count">${info.possible}문항 가능</strong><span class="cz-bar-note">요청 ${info.requested}문항</span>`
        : '<strong class="cz-bar-count">조건을 고르세요</strong><span class="cz-bar-note">단원을 고르면 문항 수가 보입니다</span>'}</div>${button("generate", "문제지 만들기", `class="primary cz-bar-main" ${disabled ? "disabled" : ""}`)}</div>`;
    }
    const buttons = composeFinishButtons(r);
    const parts = Math.max(1, Math.ceil(state.selected.length / 50));
    const saved = currentSavedPaperIds().length > 0;
    return `<div class="cz-bar" role="region" aria-label="문제지 작업"><div class="cz-bar-text"><strong class="cz-bar-count">${state.selected.length}문항 · ${parts}권</strong>${saved ? '<span class="cz-bar-note">저장했습니다</span>' : ""}</div>${button("print", "출력", `class="cz-bar-sub" ${buttons.printDisabled ? "disabled" : ""}`)}<details class="cz-more cz-bar-more"><summary>더보기</summary><div class="cz-more-menu">${buttons.save}${buttons.assign}${button("backup", "작업 백업 다운로드", 'class="small"')}</div></details></div>`;
  }
  function composeSourceNote() {
    if (state.uidRoute && !state.uidRoute.error)
      return `<p class="cz-entry" data-cz-entry="uid">검색에서 고른 ${state.uidRoute.records.length}문항으로 범위가 고정되어 있습니다.</p>`;
    if (state.sources.length)
      return `<p class="cz-entry" data-cz-entry="sources">학교별 기출에서 고른 시험 ${state.sources.length}개 안에서 문항을 뽑습니다.</p>`;
    return "";
  }
  function renderResultEmpty() {
    const earlier = drafts().filter((item) => item.draftId !== state.draftId && item.selected?.length).length;
    return `${state.composeStale
      ? `<div class="callout cz-stale" role="status" data-compose-stale><strong>조건이 바뀌었습니다.</strong> <strong>문제지 만들기</strong>를 누르면 새로 뽑습니다.${state.composeStalePins ? ` 고정해 둔 ${state.composeStalePins}문항도 함께 지워졌습니다.` : ""}</div>`
      : ""}<div class="cz-empty"><h2>만들어진 문제지가 여기에 나옵니다</h2><p data-cz-empty-guide><span class="cz-dir-wide">왼쪽</span><span class="cz-dir-narrow">위</span>에서 조건을 고르고 <strong>문제지 만들기</strong>를 누르면 여기에 문제지가 나옵니다.</p>${composeSourceNote()}${earlier ? `<p class="cz-entry" data-cz-entry="drafts">이어서 할 수 있는 이전 작업이 ${earlier}개 있습니다. ${`<button type="button" class="cz-link" data-view="recent">출제 내역에서 이어하기</button>`}</p>` : ""}</div>`;
  }
  function renderResult(r = state.selected.length ? review() : null) {
    const unknown = state.saveResultState === "RESULT_UNKNOWN";
    const notice = state.composeNotice
      ? `<div class="callout cz-notice" role="status" data-compose-notice>${esc(state.composeNotice)}</div>`
      : "";
    const top = `<div id="compose-save-continuity">${renderSaveRecovery()}${renderSavedContinuity()}</div>${notice}`;
    if (!r) return `${top}${renderResultEmpty()}`;
    return `${top}<div class="cz-result-body" ${unknown ? "inert" : ""}>${renderResultSummary(r)}${renderPaper()}${renderOutputSettings()}${renderResultFinish(r)}</div>`;
  }
  function renderConditions() {
    if (state.derivationSource) return `<div class="cz-block">${renderDerivedComposition()}</div>`;
    const receiptNote = state.receipts.length
      ? '<p class="callout" role="status">이미 출제한 문제지가 있어 조건은 바꿀 수 없습니다. 남은 문제지의 문항을 교체하거나 새 작업을 시작하세요.</p>'
      : "";
    const sources = state.sources.length
      ? `<div class="callout">선택한 시험 ${state.sources.length}개 안에서 선택합니다. ${button("sources-clear", "전체 아카이브로 변경", 'class="small"')}</div>`
      : "";
    const parts = composeParts();
    return `${receiptNote}${state.uidRoute ? "" : filterMarkup(state.filters, "compose", "primary")}${sources}${parts.amount}<div class="cz-block compose-range cz-scope">${renderScopes()}</div>${parts.tail}`;
  }
  function renderCompose() {
    const unknown = state.saveResultState === "RESULT_UNKNOWN";
    const r = state.selected.length ? review() : null;
    return `<p class="visually-hidden" role="status" aria-live="polite" data-cz-announce>${esc(state.composeAnnounce)}</p><div class="intro cz-intro"><div><h1>${esc(state.title)} <span class="badge">${esc(state.round)}차</span></h1><p class="muted">${state.derivationSource ? "저장한 시험지에서 만든 새 문제지입니다. 원래 시험지는 그대로 보존됩니다." : ""}</p></div><div class="actions"><button type="button" class="phone-quick-link" data-view="five-minute">빠른 평가</button>${button("new-draft", "새 작업")}</div></div>
    <div class="cz${state.selected.length ? " has-result" : ""}"><section class="cz-conditions" aria-label="문제지 조건" data-cz-conditions ${unknown ? "inert" : ""}>${renderConditions()}</section><section class="cz-result" aria-label="만들어진 문제지" data-cz-result>${renderResult(r)}</section></div>${renderMobileActions(r)}`;
  }
  function recentClassOptions() {
    const grade = state.recentFilters.grade;
    return classRows
      .filter((cls) => !grade || History.classGrade(cls) === grade)
      .map((cls) => {
        const id = String(cls.id || "");
        return id ? { value: id, label: cls.name || id } : null;
      })
      .filter(Boolean);
  }
  function renderRecent() {
    if (!teacherSessionOk()) return loginNoticeMarkup("recent");
    const list = drafts(), f = state.recentFilters;
    return `<div class="history-surface">${window.Archive2Navigation?.libraryTabs?.("recent") || ""}<div class="intro history-intro"><div><h1>출제 내역</h1><p class="muted">출제한 시험의 대상과 제출 상태를 확인하거나 만들던 문제지를 이어서 작업하세요.</p></div><div class="actions">${button("new-draft", "새 문제지", 'class="primary"')}${button("import", "작업 파일 불러오기")}</div></div>
      <section class="panel history-panel" aria-labelledby="history-heading"><div class="history-heading"><h2 id="history-heading">최근 출제</h2></div>
      <div class="history-filters">
        <label class="history-period-filter">기간<span class="history-period"><input type="date" data-recent-filter="from" aria-label="시작일" value="${esc(f.from)}"><span aria-hidden="true">~</span><input type="date" data-recent-filter="to" aria-label="끝일" value="${esc(f.to)}"></span></label>
        <label>학년<select data-recent-filter="grade">${options(History.grades, f.grade, "전체 학년")}</select></label>
        <label>반<select id="recent-class">${options(recentClassOptions(), state.recentClassId, "전체 반")}</select></label>
        <label class="history-subject-filter">과목<select data-recent-filter="subject">${options(recentSubjectOptions(), f.subject, "전체 과목")}</select></label>
        <label class="history-title-filter">제목 검색<input type="search" data-recent-filter="query" value="${esc(f.query)}"></label>
      </div><div id="recent-assignments" aria-live="polite" aria-busy="${state.recentLoading}">${recentAssignmentMarkup()}</div></section>
      <aside class="history-drafts" aria-labelledby="history-drafts-heading"><h2 id="history-drafts-heading">만들던 문제지</h2>${list.length ? list.map((d, i) => `<div class="history-draft"><div><h3>${esc(d.header?.title || d.title)}</h3><p class="muted">${esc(new Date(d.updatedAt).toLocaleString("ko-KR"))} · ${d.selected?.length || 0}문항 · ${d.round || 1}차</p></div><div class="actions history-draft-actions">${button("restore", "이어하기", `data-draft="${i}"`)}${button("delete-draft", "삭제", `data-draft-id="${esc(d.draftId)}" class="danger" aria-label="${esc(d.header?.title || d.title || "문제지")} 삭제"`)}</div></div>`).join("") : '<div class="empty">저장된 작업이 없습니다.</div>'}</aside></div>`;
  }
  function recentAssignmentMarkup() {
    if (state.recentLoading) return '<p class="muted history-result-state">출제 내역을 불러오는 중…</p>';
    if (state.recentError) return `<p class="error history-result-state" role="alert">${esc(teacherErrorMessage(state.recentError))} ${button("recent-retry", "다시 시도", 'class="small"')}</p>`;
    const rows = History.filterAssignments(state.recentRows, {
      ...state.recentFilters, classId: state.recentClassId,
    });
    // One row per assignment, newest date first. The raw list keeps saved_paper_id / archive_file, which the
    // normalized rows drop (archive2-history.js stays untouched so the Worker is not redeployed).
    const rawById = new Map((state.recentAssignments || []).map((raw) => [String(raw?.id ?? "").trim(), raw]));
    // 취소한 출제는 학생에게 보이지 않는 건이라 목록에서 기본으로 뺀다. 잘못 낸 건을 취소하면 눈앞에서 사라지고,
    // 필요하면 아래 버튼으로 다시 본다(기록 자체는 서버에 남는다).
    const all = History.groupByDate(rows).flatMap((group) => group.rows);
    const cancelledCount = all.filter((a) => a.isCancelled).length;
    const ordered = state.recentShowCancelled ? all : all.filter((a) => !a.isCancelled);
    const cancelledToggle = !cancelledCount ? "" : `<p class="history-cancelled-toggle">${button("recent-toggle-cancelled",
      state.recentShowCancelled ? "취소한 출제 숨기기" : `취소한 출제 ${cancelledCount}건 보기`,
      `class="small" aria-pressed="${state.recentShowCancelled}"`)}</p>`;
    if (!ordered.length) return `<p class="muted history-result-state">현재 조건에 맞는 출제 내역이 없습니다.</p>${cancelledToggle}`;
    return `<div class="exam-rows history-rows">${ordered.map((a) => {
        const source = recentSourceOf(rawById.get(a.id));
        const progress = a.submittedCount !== null && a.recipientCount !== null
          ? [`제출 ${a.submittedCount}/${a.recipientCount}`]
          : [a.recipientCount === null ? "" : `대상 ${a.recipientCount}명`,
            a.submittedCount === null ? "" : `제출 ${a.submittedCount}명`];
        // The spine and the class name already say the students' grade; the paper's grade is named only when it differs.
        const otherGrade = a.contentGrade && a.targetGrade && a.contentGrade !== a.targetGrade
          ? `시험지는 ${a.contentGrade}` : "";
        const metadata = [a.className, ...progress,
          a.questionCount === null ? "" : `${a.questionCount}문항`,
          a.subjectLabel, otherGrade].filter(Boolean);
      const lifecycle = [
        a.isCancelled ? '<span class="history-state-chip cancelled">취소됨</span>' : "",
        a.replacementAssignmentId ? `<span class="history-state-chip">대체됨 · ${esc(a.replacementAssignmentId)}</span>` : "",
        a.replacesAssignmentId ? `<span class="history-state-chip">대체본 · 원본 ${esc(a.replacesAssignmentId)}</span>` : "",
        a.isReviewOnly ? `<span class="history-state-chip review-only">열람 전용${a.reviewOnlyCount === null ? "" : ` · ${a.reviewOnlyCount}명`}</span>` : "",
      ].filter(Boolean).join("");
      const pdfLabel = a.pdfReady ? "" : a.pdfStatus === "failed"
        ? "PDF 준비 실패" : a.pdfStatus === "generating" ? "PDF 준비 중" : "PDF 준비 필요";
      const pdfRetryPending = recentPdfRetryIds.has(String(a.id));
      const pdfRetry = !a.pdfReady && a.pdfStatus !== "generating"
        ? button("assignment-pdf", "PDF 다시 준비", `data-assignment="${esc(a.id)}" class="small"${pdfRetryPending ? " disabled aria-busy=\"true\"" : ""}`)
        : "";
      const sourceLine = !source ? "" : source.kind === "saved"
        ? `<button type="button" class="history-source is-link" data-action="recent-open-saved" data-paper-id="${esc(source.paperId)}" aria-label="보관함에서 이 문제지 열기">${esc(source.label)}</button>`
        : `<span class="history-source">${esc(source.label)}</span>`;
      const day = /^\d{4}-(\d{2})-(\d{2})$/.exec(a.date);
      const spineDate = day ? [`${Number(day[1])}월`, String(Number(day[2]))] : ["", "–"];
      return `<article class="history-card exam-row no-sim ${gradeClass(a.targetGrade || a.contentGrade)}" data-assignment-id="${esc(a.id)}" title="출제 번호 ${esc(a.id)}"><div class="exam-row-spine"${a.date ? ` title="${esc(a.date)}"` : ""}><span class="exam-row-grade">${esc(spineDate[0])}</span><span class="exam-row-year">${esc(spineDate[1])}</span><span class="exam-row-unit">${esc(a.targetGrade || a.contentGrade || "")}</span></div><div class="exam-row-main"><h3 class="history-title">${esc(a.title)}</h3>${sourceLine}<div class="history-card-meta exam-row-meta">${metadata.map((value, index) => `${index ? '<span aria-hidden="true">·</span>' : ""}<span${index === 0 && value === a.className ? ' class="history-class"' : ""}>${esc(value)}</span>`).join("")}</div>${lifecycle ? `<div class="history-card-states" aria-label="출제 상태">${lifecycle}</div>` : ""}${pdfLabel ? `<div class="history-pdf-actions"><span class="history-pdf">${pdfLabel}</span>${a.pdfError ? `<span class="history-pdf-error">${esc(pdfErrorText(a.pdfError))}</span>` : ""}${pdfRetry}</div>` : ""}</div><div class="exam-row-actions" role="group" aria-label="출제 ${esc(a.id)} 시험지·해설·정답·학생별 확인">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([mode, label]) => button("assignment-output-direct", label, `data-assignment="${esc(a.id)}" data-mode="${mode}" class="small"`)).join("")}${button("assignment-status", "학생별 확인", `data-assignment="${esc(a.id)}" class="small"`)}${a.isCancelled ? "" : button("assignment-cancel", "출제 취소", `data-assignment="${esc(a.id)}" class="small danger" aria-label="${esc(a.title)} ${esc(a.className || "")} 출제 취소"`)}</div></article>`;
      }).join("")}</div>${cancelledToggle}`;
  }
  // 서버가 남긴 PDF 오류는 영어 원문일 수 있다. 교사에게는 무엇을 하면 되는지만 알린다.
  function pdfErrorText(raw) {
    const text = String(raw || "");
    if (/429|rate limit/i.test(text)) return "PDF를 만드는 서버가 잠시 바쁩니다. 조금 뒤 'PDF 다시 준비'를 눌러 주세요.";
    return HANGUL.test(text) ? text : "PDF를 준비하지 못했습니다. 'PDF 다시 준비'를 눌러 주세요.";
  }
  // 출제 취소: 서버가 그 출제에 취소 시각을 남긴다. 아직 풀지 않은 학생에게는 더 이상 보이지 않고, 이미 제출한 학생의
  // 기록은 지워지지 않는다(열람 전용). 되돌리는 길이 없으므로 한 번 확인받는다.
  function askCancelAssignment(assignmentId) {
    const row = state.recentRows.find((a) => String(a.id) === String(assignmentId));
    if (!row || row.isCancelled) return;
    const submitted = Number(row.submittedCount) > 0
      ? `<p>이미 제출한 학생 ${Number(row.submittedCount)}명의 기록은 지워지지 않습니다.</p>` : "";
    showDialog("출제 취소", `<p><strong>${esc(row.title)}</strong>${row.className ? ` · ${esc(row.className)}` : ""}${row.date ? ` · ${esc(row.date)}` : ""}</p>
      <p>취소하면 아직 풀지 않은 학생에게 더 이상 보이지 않고, 출제 내역에서도 숨겨집니다. 되돌릴 수 없습니다.</p>${submitted}
      <p id="assignment-cancel-error" class="error" role="alert" hidden></p>
      <div class="actions">${button("assignment-cancel-confirm", "출제 취소", `data-assignment="${esc(row.id)}" class="primary"`)}</div>`);
  }
  let assignmentCancelBusy = false;
  async function cancelRecentAssignment(assignmentId) {
    const id = String(assignmentId || "");
    if (!id || assignmentCancelBusy) return false;
    assignmentCancelBusy = true;
    try {
      // 같은 출제를 다시 취소해도 서버는 같은 결과를 돌려준다(이미 취소된 건이면 그대로 성공).
      await api("/class-exam-assignments/" + encodeURIComponent(id) + "/cancel", { operation_identity: crypto.randomUUID() });
      const row = state.recentRows.find((a) => String(a.id) === id);
      if (row) row.isCancelled = true;
      const raw = (state.recentAssignments || []).find((a) => String(a?.id ?? "").trim() === id);
      if (raw && !raw.cancelled_at) raw.cancelled_at = new Date().toISOString();
      if ($("modal")?.open) $("modal").close();
      updateRecentResults();
      status("출제를 취소했습니다. 학생에게 더 이상 보이지 않습니다.");
      return true;
    } catch (error) {
      const message = Number(error?.status) === 409 && /Saved Paper Assignments only/i.test(String(error?.message || ""))
        ? "이 출제는 아직 여기서 취소할 수 없습니다. 잠시 뒤 다시 시도해 주세요."
        : teacherErrorMessage(error, "출제를 취소하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      const slot = $("assignment-cancel-error");
      if (slot && $("modal")?.open) { slot.textContent = message; slot.hidden = false; }
      else status(message, true);
      return false;
    } finally {
      assignmentCancelBusy = false;
    }
  }
  // Where an assignment came from: a saved paper (link back to 보관함), a school exam, or 단원별 기출.
  function recentSourceOf(raw) {
    if (!raw) return null;
    const paperId = String(raw.saved_paper_id ?? "").trim();
    if (paperId) return { kind: "saved", label: "보관함 문제지", paperId };
    const file = String(raw.archive_file ?? "").trim();
    if (/^MIXED:/i.test(file)) return { kind: "unit", label: "단원별 기출" };
    if (file) return { kind: "school", label: "학교 기출" };
    return null;
  }
  function updateRecentResults() {
    updateRecentFilterOptions();
    const host = $("recent-assignments");
    if (host) {
      host.innerHTML = recentAssignmentMarkup();
      host.setAttribute("aria-busy", String(state.recentLoading));
    }
  }
  function recentSubjectTerms(subjectKey) {
    const key = String(subjectKey || "").trim();
    if (!key) return [];
    if (key.startsWith("raw:")) return [key.slice(4)];
    const high1 = C.subjectProjectionOptions("고1").find((row) => row.value === key);
    if (high1) return [high1.label];
    const shared = C.HIGH_SEMANTIC_SUBJECTS.find((row) => row.value === key);
    if (shared) return [...new Set([shared.label, ...(shared.courseKeys || [])])];
    return [key];
  }
  function recentSubjectOptions({ preserveSelected = true } = {}) {
    const grade = state.recentFilters.grade;
    const values = new Map();
    for (const option of C.subjectProjectionOptions(grade) || [])
      values.set(option.value, option);
    for (const [optionGrade, optionsByKey] of recentSubjectOptionUniverse) {
      if (grade && optionGrade !== grade) continue;
      for (const option of optionsByKey.values())
        if (!values.has(option.value)) values.set(option.value, option);
    }
    for (const option of History.subjectOptions(state.recentRows, grade, C))
      if (!values.has(option.value)) values.set(option.value, option);
    const selected = state.recentFilters.subject;
    if (preserveSelected && selected && !values.has(selected)) {
      const [label] = recentSubjectTerms(selected);
      values.set(selected, { value: selected, label: label || selected });
    }
    return [...values.values()];
  }
  function rememberRecentSubjectOptions(rows) {
    for (const row of rows || []) {
      const grade = String(row.targetGrade || "");
      if (!recentSubjectOptionUniverse.has(grade)) recentSubjectOptionUniverse.set(grade, new Map());
      const optionsByKey = recentSubjectOptionUniverse.get(grade);
      for (const option of History.subjectOptions([row], grade, C))
        if (!optionsByKey.has(option.value)) optionsByKey.set(option.value, option);
    }
  }
  function updateRecentFilterOptions() {
    const classField = $("recent-class");
    const classMarkup = options(recentClassOptions(), state.recentClassId, "전체 반");
    if (classField && classField.innerHTML !== classMarkup) classField.innerHTML = classMarkup;
    const subjectField = document.querySelector('[data-recent-filter="subject"]');
    const subjectMarkup = options(recentSubjectOptions(), state.recentFilters.subject, "전체 과목");
    if (subjectField && subjectField.innerHTML !== subjectMarkup) subjectField.innerHTML = subjectMarkup;
  }
  function changeRecentFilter(el) {
    if (state.view !== "recent") return;
    const key = el.dataset.recentFilter;
    if (!Object.hasOwn(state.recentFilters, key)) return;
    state.recentFilters[key] = el.value;
    if (key === "grade") {
      const subjects = recentSubjectOptions({ preserveSelected: false });
      if (!subjects.some((item) => item.value === state.recentFilters.subject))
        state.recentFilters.subject = "";
      const classes = recentClassOptions();
      if (state.recentClassId && !classes.some((item) => item.value === state.recentClassId))
        state.recentClassId = "";
    }
    // Update only the result host: date/search inputs retain focus and IME state.
    updateRecentResults();
    replaceUrlState();
    scheduleRecentRefetch();
  }
  function invalidateRecentRequests() {
    state.recentLoadVersion++;
    if (recentRefetchTimer !== null) {
      clearTimeout(recentRefetchTimer);
      recentRefetchTimer = null;
    }
    state.recentLoading = false;
  }
  // 학생별 확인 opens from 출제 내역 and from the issue history inside each 보관함 row.
  const isStatusView = (view) => view === "recent" || view === "saved";
  function recentRequestIsCurrent(version, requestedView, expectedSelection) {
    return version === state.recentLoadVersion &&
      requestedView === "recent" && state.view === requestedView &&
      String(state.recentSelectedAssignmentId || "") === expectedSelection;
  }
  function recentAuthorityError(error, authority) {
    if (error && typeof error === "object") {
      try { error.archive2Authority = { kind: "recent", ...authority }; } catch {}
    }
    return error;
  }
  function assignmentStatusAuthorityError(error, authority) {
    if (error && typeof error === "object") {
      try { error.archive2Authority = { kind: "assignment-status", ...authority }; } catch {}
    }
    return error;
  }
  function recentPdfMutationVersion(assignmentId) {
    return recentPdfMutationVersions.get(assignmentId) || 0;
  }
  function advanceRecentPdfMutationVersion(assignmentId) {
    const next = recentPdfMutationVersion(assignmentId) + 1;
    recentPdfMutationVersions.set(assignmentId, next);
    return next;
  }
  function isCurrentAuthorityError(error) {
    // A failure the list already shows (or the login notice) is never announced a second time.
    if (error?.archive2ShownInline) return false;
    const authority = error?.archive2Authority;
    if (authority?.kind === "recent")
      return recentRequestIsCurrent(authority.version, authority.view, authority.selection);
    if (authority?.kind === "assignment-status")
      return authority.version === state.assignmentStatusLoadVersion &&
        isStatusView(authority.view) && state.view === authority.view &&
        String(state.recentSelectedAssignmentId || "") === authority.selection &&
        (!authority.selection || authority.selection === authority.assignmentId) &&
        authority.pdfMutationVersion === recentPdfMutationVersion(authority.assignmentId);
    return true;
  }
  function scheduleRecentRefetch() {
    invalidateRecentRequests();
    if (state.view !== "recent") return;
    updateRecentResults();
    const scheduledVersion = state.recentLoadVersion;
    recentRefetchTimer = setTimeout(() => {
      recentRefetchTimer = null;
      if (state.view !== "recent" || scheduledVersion !== state.recentLoadVersion) return false;
      return loadRecent().catch((error) => {
        if (isCurrentAuthorityError(error))
          status(error.message || "출제 내역을 불러오지 못했습니다.", true);
        return false;
      });
    }, 300);
  }
  async function loadRecent() {
    if (state.view !== "recent") return false;
    if (!teacherSessionOk()) {
      state.recentLoading = false;
      state.recentError = "";
      state.recentAuth = true;
      showLoginNotice("recent");
      return false;
    }
    state.recentAuth = false;
    if (recentRefetchTimer !== null) {
      clearTimeout(recentRefetchTimer);
      recentRefetchTimer = null;
    }
    const version = ++state.recentLoadVersion;
    const requestedView = state.view;
    const expectedSelection = String(state.recentSelectedAssignmentId || "");
    const isCurrentRequest = () => recentRequestIsCurrent(version, requestedView, expectedSelection);
    state.recentLoading = true;
    state.recentError = "";
    state.recentAssignments = [];
    state.recentRows = [];
    updateRecentResults();
    try {
      if (!classRows.length) {
        const data = await api("/qr-classes");
        if (!isCurrentRequest()) return false;
        classRows = Array.isArray(data.classes) ? data.classes : [];
      }
      if (state.recentClassId) {
        const selectedClass = classRows.find((row) => String(row.id || "") === state.recentClassId);
        if (!selectedClass || (state.recentFilters.grade && History.classGrade(selectedClass) !== state.recentFilters.grade)) {
          state.recentClassId = "";
          replaceUrlState();
        }
      }
      const params = new URLSearchParams({ limit: "1000" });
      for (const key of ["from", "to", "grade", "query"])
        if (state.recentFilters[key]) params.set(key, state.recentFilters[key]);
      if (state.recentClassId) params.set("class", state.recentClassId);
      if (state.recentFilters.subject) {
        params.set("subject", state.recentFilters.subject);
        for (const term of recentSubjectTerms(state.recentFilters.subject))
          params.append("subject_term", term);
      }
      const data = await api("/class-exam-assignments/recent-summary?" + params.toString());
      if (!isCurrentRequest()) return false;
      state.recentAssignments = Array.isArray(data.assignments) ? data.assignments : [];
      // Without the catalog the exam lookup is empty (grade/subject fall back to the saved fields);
      // refreshRecentRowsFromCatalog() normalizes again when the catalog arrives.
      state.recentRows = History.normalizeAssignments(
        state.recentAssignments, classRows, state.catalog?.exams || [], C,
      );
      rememberRecentSubjectOptions(state.recentRows);
      return true;
    } catch (error) {
      if (!isCurrentRequest()) return false;
      state.recentError = error.message || "출제 내역을 불러오지 못했습니다.";
      state.recentAuth = isAuthError(error);
      if (state.recentAuth) showLoginNotice("recent");
      // The list shows this failure (or the login notice); callers must not raise a second alert for it.
      try { error.archive2ShownInline = true; } catch {}
      throw recentAuthorityError(error, {
        version,
        view: requestedView,
        selection: expectedSelection,
      });
    } finally {
      if (isCurrentRequest()) {
        state.recentLoading = false;
        updateRecentResults();
      }
    }
  }
  function renderAssignmentStatus(data, assignmentId) {
    const a = data.assignment,
      active = data.students.filter((s) => !s.excluded),
      excluded = data.students.filter((s) => s.excluded);
    const summary = state.recentRows.find((row) => row.id === assignmentId);
    const lifecycle = [
      a.cancelled_at ? '<span class="history-state-chip cancelled">취소됨</span>' : "",
      summary?.replacementAssignmentId ? `<span class="history-state-chip">대체됨 · ${esc(summary.replacementAssignmentId)}</span>` : "",
      summary?.replacesAssignmentId ? `<span class="history-state-chip">대체본 · 원본 ${esc(summary.replacesAssignmentId)}</span>` : "",
      (summary?.reviewOnlyCount || 0) > 0 ? `<span class="history-state-chip review-only">열람 전용 · ${summary.reviewOnlyCount}명</span>` : "",
    ].filter(Boolean).join("");
    const studentStatus = (student) => student.session_id
      ? (a.cancelled_at || student.excluded ? "제출 완료 · 열람 전용" : "제출 완료")
      : (student.excluded ? "제외됨" : "제출 전");
    const studentPreviewUrl = (studentId) => {
      const url = new URL("../apmath/student/index.html", location.href);
      url.searchParams.set("teacher_preview", "1");
      url.searchParams.set("student_id", String(studentId || ""));
      url.searchParams.set("assignment_id", String(a.id || assignmentId));
      url.searchParams.set("omr", "1");
      return url.href;
    };
    const studentRow = (student) => `<div class="recent-row"><span>${esc(student.name)}</span><span>${studentStatus(student)}</span><a href="${esc(studentPreviewUrl(student.student_id))}" target="_blank" rel="noopener">이 출제 확인</a></div>`;
    const pdfRetryPending = recentPdfRetryIds.has(assignmentId);
    showDialog(
      a.exam_title,
      `<p>${esc(a.exam_date)} · ${a.question_count}문항 · 출제 대상 ${active.length}명 · 제외 ${excluded.length}명</p>${lifecycle ? `<div class="history-card-states" aria-label="출제 상태">${lifecycle}</div>` : ""}<div class="callout">학생 포털의 ‘내 시험지’에 표시됩니다. ${a.pdf_status === "ready" ? "PDF 준비 완료" : a.pdf_status === "generating" ? "PDF 준비 중" : a.pdf_status === "failed" ? "PDF 준비 실패 · 다시 준비할 수 있습니다." : "PDF 준비 필요 · 온라인 문제·정답·해설은 사용할 수 있습니다."}</div><div class="actions" role="group" aria-label="출제 ${esc(a.id)} 시험지·해설·정답">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([mode, label]) => button("assignment-output", label, `data-mode="${mode}"`)).join("")}${a.pdf_status !== "ready" && a.pdf_status !== "generating" ? button("assignment-pdf", "PDF 다시 준비", `data-assignment="${esc(a.id)}"${pdfRetryPending ? " disabled aria-busy=\"true\"" : ""}`) : ""}</div><h3>학생별 확인 · ${esc(a.id)}</h3><div class="assignment-students">${active.map(studentRow).join("")}</div>${excluded.length ? `<details><summary>제외한 학생 ${excluded.length}명</summary><div class="assignment-students">${excluded.map(studentRow).join("")}</div></details>` : ""}`,
    );
  }
  function pdfRetryAuthority(assignmentId) {
    return {
      assignmentId,
      view: state.view,
      selection: String(state.recentSelectedAssignmentId || ""),
      modalWasOpen: Boolean($("modal")?.open),
      modalAssignmentId: String(state.openAssignment?.assignment?.id || ""),
    };
  }
  function isCurrentPdfRetryAuthority(authority) {
    return Boolean(authority &&
      isStatusView(authority.view) && state.view === authority.view &&
      String(state.recentSelectedAssignmentId || "") === authority.selection &&
      (!authority.selection || authority.selection === authority.assignmentId) &&
      (!authority.modalWasOpen || (
        $("modal")?.open && authority.modalAssignmentId === authority.assignmentId &&
        state.openAssignment?.assignment?.id === authority.assignmentId
      )));
  }
  function applyRecentPdfMutationResult(assignmentId, result, authority) {
    if (!isCurrentPdfRetryAuthority(authority)) return false;
    const assignment = result?.assignment || {};
    const pdfStatus = assignment.pdf_status || "pending";
    const pdfError = assignment.pdf_error || "";
    const row = state.recentRows.find((item) => item.id === assignmentId);
    if (row) {
      row.pdfStatus = pdfStatus;
      row.pdfError = pdfError;
      row.pdfReady = pdfStatus === "ready";
    }
    const openAssignment = state.openAssignment;
    if (authority.modalWasOpen && openAssignment?.assignment?.id === assignmentId) {
      state.openAssignment = {
        ...openAssignment,
        assignment: { ...openAssignment.assignment, ...assignment, pdf_status: pdfStatus, pdf_error: pdfError },
      };
      if ($("modal")?.open) renderAssignmentStatus(state.openAssignment, assignmentId);
    }
    if (state.view === "recent") updateRecentResults();
    return true;
  }
  async function assignmentStatus(id) {
    const assignmentId = String(id || "").trim();
    if (!assignmentId) return null;
    const version = ++state.assignmentStatusLoadVersion;
    const requestedView = state.view;
    const expectedSelection = String(state.recentSelectedAssignmentId || "");
    const pdfMutationVersion = recentPdfMutationVersion(assignmentId);
    const isCurrentRequest = () =>
      version === state.assignmentStatusLoadVersion &&
      isStatusView(requestedView) && state.view === requestedView &&
      String(state.recentSelectedAssignmentId || "") === expectedSelection &&
      (!expectedSelection || expectedSelection === assignmentId) &&
      pdfMutationVersion === recentPdfMutationVersion(assignmentId);
    if (!isCurrentRequest()) return null;
    let data;
    try {
      data = await api(
        "/class-exam-assignments/" + encodeURIComponent(assignmentId) + "/status",
      );
    } catch (error) {
      if (!isCurrentRequest()) return null;
      throw assignmentStatusAuthorityError(error, {
        version,
        view: requestedView,
        selection: expectedSelection,
        assignmentId,
        pdfMutationVersion,
      });
    }
    if (!isCurrentRequest()) return null;
    state.openAssignment = data;
    const recentRow = state.recentRows.find((row) => row.id === assignmentId);
    if (recentRow && Object.hasOwn(data.assignment || {}, "pdf_status")) {
      recentRow.pdfStatus = data.assignment.pdf_status || "pending";
      recentRow.pdfError = data.assignment.pdf_error || "";
      recentRow.pdfReady = recentRow.pdfStatus === "ready";
      updateRecentResults();
    }
    renderAssignmentStatus(data, assignmentId);
    return data;
  }
  async function openAssignmentOutput(assignmentId, mode) {
    const popup = window.open("about:blank", "_blank");
    if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
    try {
      const data = await api(`/class-exam-assignments/${encodeURIComponent(assignmentId)}/output?mode=${encodeURIComponent(mode)}`);
      const envelope = data.envelope;
      if (!envelope) throw new Error("출제 당시 내용을 불러오지 못했습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
      await O.storeOutputEnvelope(envelope);
      const url = O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, {
        studio: true,
        assignmentId,
      });
      popup.location.href = url.href;
    } catch (error) {
      popup.close();
      throw error;
    }
  }
  // Korean labels for every exclusion reason code that basicEligibility and the
  // canonical assignment validator can emit. An unknown code is still shown
  // (with its raw code) so a nonzero reason can never be hidden.
  const HEALTH_REASON_LABELS = {
    identity: "문항 식별 정보 확인 필요",
    source: "원본 무결성 확인 필요",
    source_release: "승인된 원본 버전과 불일치",
    source_issue: "원본 문제 의심(보류)",
    solution: "정답·해설 수리 필요",
    SOURCE_GRADE_UNRESOLVED: "출처 학년 확인 불가",
    SOURCE_GRADE_CONFLICT: "출처 학년과 문항 학년 충돌",
    taxonomy: "승인된 단원 분류 없음(분류 항목 종합)",
    course_namespace_invalid: "학년·교육과정·과목 조합 확인 필요",
    assignment_missing: "승인된 단원 배정 없음",
    assignment_conflict: "단원 배정이 둘 이상",
    assignment_identity_mismatch: "단원 배정과 문항 식별 불일치",
    assignment_fingerprint_mismatch: "단원 배정 지문 불일치",
    assignment_not_approved: "단원 배정 미승인",
    assignment_review_evidence_missing: "단원 배정 검수 근거 없음",
    assignment_taxonomy_version_mismatch: "단원 배정의 분류 버전 불일치",
    assignment_target_mismatch: "단원 배정과 문항 분류 불일치",
    canonical_parent_missing: "기준 단원 목록에 없음",
    canonical_authority_missing: "기준 분류 정보 없음",
    canonical_validator_unavailable: "기준 분류 검사기 사용 불가",
    source_identity_unverified: "문항 식별 미검증",
    source_identity_conflict: "문항 식별 충돌",
    review: "검수 보류·제외",
    semantic: "의미 분류 보류·제외",
    applicability: "기본 출력 범위 밖",
    conflict: "원본 분류 정보 충돌",
  };
  function healthExclusionRows(reasons) {
    return Object.entries(reasons || {})
      .filter(([, count]) => Number(count) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]) || a[0].localeCompare(b[0]))
      .map(([code, count]) => ({ code, count: Number(count), label: HEALTH_REASON_LABELS[code] || "" }));
  }
  // Counts of general-use records (one per UID) by how the unified unit list places them.
  function unifiedHealth() {
    const index = unifiedIndex();
    if (!index) return null;
    const result = { placed: 0, unit: 0, unclassified: 0, unplaced: 0, unplacedReasons: {} };
    const seen = new Set();
    for (const record of state.catalog.records) {
      if (!record.questionUid || seen.has(record.questionUid) || !C.generalUseEligibility(record).ok) continue;
      seen.add(record.questionUid);
      const entry = index.byUid.get(record.questionUid);
      if (!entry) {
        const reason = Unified.classify(record).reason || "UNPLACED";
        result.unplaced++;
        result.unplacedReasons[reason] = (result.unplacedReasons[reason] || 0) + 1;
        continue;
      }
      result.placed++;
      if (entry.unclassified) result.unclassified++;
      else result.unit++;
    }
    return result;
  }
  // Both counts are needed only by the 자료 점검 screen; they used to be computed at boot (about 1s).
  function ensureHealthStats() {
    if (state.healthComposeScope !== null || !state.catalog?.records) return;
    state.healthUnified = unifiedHealth();
    state.healthComposeScope = state.healthUnified
      ? state.healthUnified.placed
      : state.catalog.records.reduce(
        (n, record) => n + (C.generalUseEligibility(record).ok && workspaceScopeParent(record) ? 1 : 0), 0);
  }
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
  function renderHealth() {
    ensureHealthStats();
    const h = state.catalog.health,
      total = Number(h.questions) || 0,
      fmt = (n) => Number(n || 0).toLocaleString(),
      composeScope = state.healthComposeScope,
      rows = healthExclusionRows(h.exclusionReasons);
    return `<div class="intro"><div><h1>데이터 상태</h1><p class="muted">전체 자료, 자동출제 승인 범위, 문제지 만들기 범위를 구분합니다. 제외 사유는 서로 중복될 수 있습니다.</p></div>${button("health-export", "진단 JSON 내보내기")}</div><div class="metrics">${[
      ["시험", h.exams],
      ["전체 문항", h.questions],
      ["자동출제 승인", h.automatic],
      ["문제지 만들기 범위에 포함", composeScope],
      ...(state.healthUnified
        ? [["단원에 배치", state.healthUnified.unit], ["단원 미분류로 제공", state.healthUnified.unclassified], ["학년 근거 없어 제외", state.healthUnified.unplaced]]
        : []),
      ["metadata records", h.metadataRecords],
    ]
      .map(
        ([l, n]) =>
          `<div class="metric"><span class="muted">${l}</span><strong>${n == null ? "확인 불가" : fmt(n)}</strong></div>`,
      )
      .join(
        "",
      )}</div><section class="panel"><h2>자동출제 승인 제외 근거</h2><table class="health-table"><tbody>${rows.length
      ? rows
          .map(
            ({ code, count, label }) =>
              `<tr><th>${label ? `${esc(label)} <span class="muted">(${esc(code)})</span>` : esc(code)}</th><td>${fmt(count)}${total ? ` <span class="muted">· ${((count / total) * 100).toFixed(1)}%</span>` : ""}</td></tr>`,
          )
          .join("")
      : '<tr><th>제외 사유 없음</th><td>0</td></tr>'}</tbody></table><div class="callout">자동출제 승인은 단원 분류와 검수까지 모두 승인된 문항입니다(엄격한 승인 지표이며 사용 조건이 아닙니다). 문제지 만들기는 원본 식별·무결성이 확인된 모든 문항을 제공합니다. 원본에 대한 검수·품질 표시(보류 표시 등)와 메타데이터 검수 대기는 사용을 막지 않고 별도 검수 라인에서 처리합니다. 미분류는 보류와 다른 상태이며 기존 난이도 하·중·상을 숫자로 추정하지 않습니다. 검수 대기나 원본 불일치는 원본 시험 열기를 막지 않습니다.</div><div class="callout">${state.healthUnified ? `교육과정 통합 표시: 문제지 만들기는 2015·2022 개정 문항을 2022 개정 단원 기준 하나의 목록으로 묶어 보여줍니다. 묶음은 표시와 선택에만 적용하며 문항의 원본 교육과정·키·메타데이터는 바꾸지 않습니다. 원본 교육과정은 세부 조건에서 고를 수 있습니다. 단원 근거가 없는 문항은 학년·과목별 ‘단원 미분류’로 제공합니다.${Object.entries(state.healthUnified.unplacedReasons).map(([code, count]) => ` ${esc(UNPLACED_REASON_LABELS[code] || code)} ${fmt(count)}개는 학년이 없어 학년별 목록에 넣지 못했습니다.`).join("")} ` : ""}교육과정 간 연결 검수(엄격한 승인 지표): 기존 연결 ${state.crosswalkInventory?.total ?? "확인 불가"}개 · 승인된 EXACT ${state.crosswalkInventory?.reviewedExact ?? "확인 불가"}개. <a href="data/archive2-crosswalk-inventory.json" target="_blank">연결 근거 보기</a> · <a href="data/archive2-unified-unit-policy.json" target="_blank">통합 표시 정책</a></div><p class="muted">정본: RPM Primary v1.0 · Difficulty v1.3 · Metadata Contract v2<br>문항 목록 버전 ${esc(state.catalog.indexVersion.slice(0, 16))}</p></section>${renderUnlinkedSimilar()}`;
  }
  // Similar sets whose original exam could not be told for certain (see archive2-similar.js).
  function renderUnlinkedSimilar() {
    const pairs = similarPairs();
    const rows = pairs.unlinked || [];
    const title = `원본 기출과 연결되지 않은 유사문제 ${rows.length.toLocaleString()}개`;
    if (!rows.length) return `<p class="muted health-unlinked-none">${esc(title)}</p>`;
    return `<details class="health-unlinked"><summary>${esc(title)}</summary><p class="muted">같은 학교·학년·연도·학기·시험의 기출을 하나로 정할 수 없는 유사문제입니다. 틀린 짝보다 짝이 없는 편이 안전해서 연결하지 않았습니다. 파일 이름을 <code>&lt;원본 기출 이름&gt;_유사</code> 꼴로 고치면 연결됩니다.</p><table class="health-table"><tbody>${rows.map(({ exam, reason }) =>
      `<tr><th>${esc(String(exam.file || "").split("/").pop().replace(/\.js$/i, ""))}</th><td>${esc(reason)}</td></tr>`).join("")}</tbody></table></details>`;
  }
  // 빠른 평가(?recipe=) 진입: 문항 수·배분은 평가 방식이 정하고, 저장·백업·새 작업은 없다. 아래 선택자는 문제지 만들기 마크업
  // (renderComposition·renderResultEmpty·renderResultSummary·renderResultFinish·renderMobileActions)에 실제로 있는 표식이어야 하고,
  // tests/archive2-compose-one-screen.test.js가 마크업과 이 목록이 어긋나지 않는지 지킨다.
  const FIVE_MINUTE_GUARD = Object.freeze({
    disable: ["#distribution", "#count", '[data-action="count-step"]'],
    remove: [
      '[data-action="save-paper"]', '[data-action="save-and-assign"]', '[data-action="backup"]',
      '[data-action="import"]', '[data-action="new-draft"]',
    ],
    emptyGuide: "[data-cz-empty-guide]",
    heading: "[data-cz-result-title]",
    menu: ".cz-more",
  });
  function applyFiveMinuteViewGuard() {
    if (!isAssessmentRecipeMode()) return;
    for (const selector of FIVE_MINUTE_GUARD.disable)
      document.querySelectorAll(selector).forEach((element) => element.setAttribute("disabled", ""));
    document.querySelectorAll(FIVE_MINUTE_GUARD.remove.join(", ")).forEach((element) => element.remove());
    // 저장·백업 버튼만 들어 있던 더보기 메뉴는 빈 채로 남기지 않는다.
    document.querySelectorAll(FIVE_MINUTE_GUARD.menu).forEach((menu) => {
      if (!menu.querySelector("button")) menu.remove();
    });
    const emptyGuide = document.querySelector(FIVE_MINUTE_GUARD.emptyGuide);
    if (emptyGuide)
      emptyGuide.textContent = "\uBB38\uD56D\uC744 \uC120\uD0DD\uD558\uBA74 \uBB38\uC81C\u00B7\uC815\uB2F5\u00B7\uD574\uC124 \uCD9C\uB825\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.";
    const heading = document.querySelector(FIVE_MINUTE_GUARD.heading);
    if (heading) heading.textContent = `${state.title} ${state.round}\uCC28`;
  }
  // 고정·되돌리기처럼 결과 일부만 바뀔 때: 요약과 마무리 버튼만 새로 그린다(미리보기·열린 접힘은 건드리지 않는다).
  function renderControls() {
    const summary = document.querySelector("[data-cz-summary]");
    if (summary) summary.outerHTML = renderResultSummary();
    const finish = document.querySelector("[data-cz-finish]");
    if (finish) finish.outerHTML = renderResultFinish();
    applyFiveMinuteViewGuard();
    document
      .querySelectorAll(".paper-row[data-question-uid]")
      .forEach((row) => {
        const pinned = state.pins.includes(row.dataset.questionUid);
        row.classList.toggle("pinned", pinned);
        const control = row.querySelector('[data-action="pin"]');
        if (control) {
          control.textContent = pinned ? "고정됨" : "고정";
          control.setAttribute("aria-pressed", String(pinned));
        }
      });
  }
  function noteRenderedViewTransition() {
    if (lastRenderedView === state.view) return;
    const previousView = lastRenderedView;
    lastRenderedView = state.view;
    state.assignmentStatusLoadVersion++;
    if (previousView === "recent" && state.view !== "recent")
      invalidateRecentRequests();
  }
  function render() {
    dropStaleDeferredClick();
    // Reuse scope counts only within this render. Every interaction rechecks
    // the current filters, catalog quality gates and previous-round exclusions.
    scopeRenderCache = null;
    displayedScopes = null;
    renderPoolCache = null;
    renderEligibilityCache = new WeakMap();
    renderComposeMetaFilters = new WeakMap();
    renderTaxonomyRowsCache = new Map();
    renderingScopes = true;
    try {
      renderContent();
      applyFiveMinuteViewGuard();
    } finally {
      renderingScopes = false;
      scopeRenderCache = null;
      renderPoolCache = null;
      renderEligibilityCache = null;
      renderComposeMetaFilters = null;
      renderTaxonomyRowsCache = null;
    }
  }
  // 보관함 and 출제 내역 are teacher-only. A session that is not a teacher's (none, expired, student, parent) is
  // not an error: the screen says so once and never calls the API. Without archive2-session.js nothing is judged.
  function teacherSessionOk() {
    const rule = window.Archive2Session;
    if (!rule?.state) return true;
    const memory = window.__APMATH_AUTH_MEMORY || {};
    if (memory.login_id && memory.raw_password) return true;
    return rule.state(session()).loggedIn;
  }
  const isAuthError = (error) => error?.status === 401 || error?.status === 403;
  function loginNoticeMarkup(kind) {
    const saved = kind === "saved";
    return `<section class="panel login-notice" data-login-notice="${kind}">${window.Archive2Navigation?.libraryTabs?.(kind) || ""}<h1>${saved ? "보관함" : "출제 내역"}</h1><p>선생님 계정으로 로그인하면 ${saved ? "보관함" : "출제 내역"}을 볼 수 있습니다.</p><p><a class="button-like primary" href="../apmath/" target="_blank" rel="noopener">선생님 로그인</a></p><p class="muted">로그인한 뒤 이 화면으로 돌아오면 됩니다.</p></section>`;
  }
  function showLoginNotice(kind) {
    hideErrorToast();
    $("status").textContent = "";
    $("status").classList.remove("error");
    $("content").innerHTML = loginNoticeMarkup(kind);
  }
  function syncViewNavigation() {
    document.body.dataset.archiveView = state.view;
    window.Archive2Navigation?.sync?.(state.view);
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.classList.toggle("active", navViewActive(button));
      button.setAttribute("aria-current", navViewActive(button) ? "page" : "false");
    });
  }
  function renderContent() {
    noteRenderedViewTransition();
    if (state.view !== "saved") window.Archive2Library?.invalidatePendingRequests?.();
    if (state.view === "saved") {
      syncViewNavigation();
      if (!teacherSessionOk()) {
        window.Archive2Library?.invalidatePendingRequests?.();
        showLoginNotice("saved");
        return;
      }
      window.Archive2Library.render(
        $("content"),
        state.savedPaperId || "",
        state.savedLibraryStatusFilter || "ACTIVE",
      )
        .catch((error) => {
          if (state.view !== "saved") return;
          // Not signed in as a teacher (or the session expired): one notice. Anything else: one alert with a retry.
          if (isAuthError(error) || /교사 로그인이 필요/.test(String(error?.message || ""))) {
            showLoginNotice("saved");
            return;
          }
          hideErrorToast();
          $("content").innerHTML = `<section class="panel">${window.Archive2Navigation?.libraryTabs?.("saved") || ""}<h1>보관함</h1><p class="callout danger" role="alert">${esc(teacherErrorMessage(error, "문제지를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요."))}</p><p><button type="button" class="primary" data-action="library-reload">다시 시도</button></p></section>`;
        });
      return;
    }
    if (!state.catalog) {
      // First screen first: home and 출제 내역 are drawn without the catalog; every other screen shows its
      // name and the progress, and render() draws it for real as soon as the catalog is ready.
      syncViewNavigation();
      $("content").innerHTML = state.view === "home" ? renderHome()
        : state.view === "recent" ? renderRecent()
          : preparingMarkup();
      Boot?.refresh?.();
      return;
    }
    const questionList = $("question-list");
    if (questionList) state.questionListOpen = questionList.open;
    const detail = document.querySelector(".compose-detail");
    if (detail) state.composeDetailOpen = detail.open;
    const focusedFilter = document.activeElement?.dataset?.group === "compose"
      ? document.activeElement.dataset.filter : null;
    const focusedScope = document.activeElement?.dataset?.scope;
    const focusedAction = ["scope-all", "scope-clear", "scope-group", "scope-range"]
      .includes(document.activeElement?.dataset?.action)
      ? document.activeElement.dataset.action : null;
    const focusedGroupIndex = document.activeElement?.dataset?.groupIndex;
    document.querySelectorAll("[data-view]").forEach((b) => {
      b.classList.toggle("active", navViewActive(b));
      b.setAttribute(
        "aria-current",
        navViewActive(b) ? "page" : "false",
      );
    });
    document.body.dataset.archiveView = state.view;
    window.Archive2Navigation?.sync?.(state.view);
    $("content").innerHTML =
      state.view === "home"
        ? renderHome()
        : isQuickAssessmentView()
          ? renderQuick()
        : state.view === "find"
          ? renderFind()
          : state.view === "recent"
            ? renderRecent()
            : state.view === "health"
              ? renderHealth()
              : renderCompose();
    if (state.view === "compose") {
      const focusTarget = [...document.querySelectorAll('[data-group="compose"][data-filter], [data-scope]')]
        .find((el) => focusedFilter ? el.dataset.filter === focusedFilter : focusedScope && el.dataset.scope === focusedScope)
        || [...document.querySelectorAll('[data-action]')]
          .find((el) => focusedAction && el.dataset.action === focusedAction && el.dataset.groupIndex === focusedGroupIndex);
      focusTarget?.focus?.({ preventScroll: true });
    }
    if (state.view === "compose" && state.selected.length) updatePreview();
  }
  async function prepare() {
    const records = state.selected,
      signature = JSON.stringify([
        records.map((r) => r.questionUid),
        state.header,
        state.qpp,
        state.round,
        state.includeQr,
        state.derivationSource,
      ]);
    if (state.prepared.signature === signature) return state.prepared;
    const prepared = [];
    const derivedBaseQuestions = await ensureDerivedBaseQuestions();
    const derivedBaseByUid = new Map((derivedBaseQuestions || []).map(question => [question.questionUid, question]));
    for (let i = 0; i < records.length; i += 50) {
      const index = i / 50,
        saved = Parts.receipt(state.receipts, index);
      if (saved) {
        if (!frozenPaperCache.has(saved.key)) {
          const data = await api(
            "/class-exam-assignments/" +
              encodeURIComponent(saved.id) +
              "/status",
          );
          const payload = JSON.parse(data.assignment.mixed_payload_json);
          if (
            JSON.stringify(payload.meta.questionUids) !==
            JSON.stringify(records.slice(i, i + 50).map((r) => r.questionUid))
          )
            throw new Error(
              "이미 출제한 문제지의 문항이 바뀌었습니다. 출제 내역에서 원본을 확인해 주세요.",
            );
          frozenPaperCache.set(saved.key, {
            key: saved.key,
            index,
            questions: payload.questions,
            meta: payload.meta,
          });
        }
        const frozen = frozenPaperCache.get(saved.key);
        prepared.push({ ...frozen, assignmentId: saved.id });
        continue;
      }
      const partRecords = records.slice(i, i + 50);
      const part = derivedBaseQuestions
        ? await Promise.all(partRecords.map(async record => {
            const frozen = derivedBaseByUid.get(record.questionUid);
            if (frozen) {
              const sourceFile = String(frozen.sourceArchiveFile || frozen.sourceFile || frozen._sourceFile || "");
              if (!frozen.sourceFingerprint || String(frozen.sourceFingerprint) !== String(record.sourceFingerprint) ||
                  sourceFile !== String(record.sourceFile || "") || Number(frozen.sourceOrdinal) !== Number(record.sourceOrdinal))
                throw new Error("원본 문항이 바뀌어, 저장 당시 문항을 현재 문항으로 바꾸지 않았습니다. 저장한 시험지는 그대로 출력할 수 있습니다.");
              return structuredClone(frozen);
            }
            return (await Source.restore([record], state.catalog))[0];
          }))
        : await Source.restore(partRecords, state.catalog);
      const partSignature = JSON.stringify([
          part.map((q) => q.questionUid),
          state.header,
          state.qpp,
          state.includeQr,
        ]),
        key = `archive2-${state.draftId}-${state.round}-${index}-${(await Source.digest(partSignature)).slice(0, 12)}`;
      const meta = {
        title:
          records.length > 50
            ? `${state.header.title} · ${index + 1}권`
            : state.header.title,
        customTitle: state.header.title,
        identityTitle: state.header.title,
        count: part.length,
        grade: state.filters.grade,
        subject: C.subjectProjectionLabel(state.filters) || composeSubjectLabel(),
        questionUids: part.map((q) => q.questionUid),
        printHeaderOptions: {
          ...state.header,
          title:
            records.length > 50
              ? `${state.header.title} · ${index + 1}권`
              : state.header.title,
        },
        includeQr: state.includeQr === true,
        qpp: state.qpp,
        sourceType: "mixed",
        seriesId: state.draftId,
        roundNo: state.round,
        outputContractVersion: C.VERSION,
        indexVersion: state.catalog.indexVersion,
      };
      prepared.push({ key, index, questions: part, meta });
    }
    if (
      signature !==
      JSON.stringify([
        state.selected.map((r) => r.questionUid),
        state.header,
        state.qpp,
        state.round,
        state.includeQr,
        state.derivationSource,
      ])
    )
      throw new Error("편집 내용이 변경되었습니다. 다시 시도하세요.");
    prepared.signature = signature;
    state.prepared = prepared;
    return prepared;
  }
  async function savePapers() {
    if (state.saveBusy) return;
    const recoveringUnknown = state.saveResultState === "RESULT_UNKNOWN";
    const pendingBatchId = state.saveBatchId;
    if (!state.selected.length && !recoveringUnknown)
      throw new Error("저장할 문항을 먼저 선택해 주세요.");
    const setConfirmed = (data, expectedCount, workSignature) => {
      const rows = Array.isArray(data?.papers) ? data.papers : [];
      if (data?.saved !== true || !rows.length || (expectedCount && rows.length !== expectedCount))
        throw new Error("저장 결과의 시험지 수를 확인하지 못했습니다.");
      state.savedPaperIds = rows.map((paper) => paper.id);
      if (state.savedPaperIds.some((id) => !SAVED_PAPER_UUID.test(String(id || ""))))
        throw new Error("저장된 시험지를 확인하지 못했습니다. 저장한 시험지 목록을 새로고침해 확인해 주세요.");
      state.lastSavedPaperIds = state.savedPaperIds.slice();
      state.saveMessage = state.savedPaperIds.length > 1
        ? "시험지 " + state.savedPaperIds.length + "권을 저장했습니다."
        : "시험지 1개를 저장했습니다.";
      state.saveError = "";
      state.saveResultState = "SAVED";
      state.saveResultSignature = workSignature || state.saveResultSignature;
      save();
      status(state.saveMessage + " 아직 학생에게 출제되지는 않았습니다.");
    };
    const resolveBatch = async (batchId = state.saveBatchId) => {
      if (!batchId) return { found: false, saved: false, papers: [] };
      return api("/archive-saved-papers/save-batches/" + encodeURIComponent(batchId));
    };

    state.saveBusy = true;
    $("content").inert = true;
    status(recoveringUnknown
      ? "저장 요청의 기존 결과를 확인하고 있습니다."
      : "문항과 출력 정보를 확인한 뒤 시험지를 저장합니다.");
    let requestStarted = false;
    let recoveryConfirmedAbsent = !recoveringUnknown;
    let attemptedWorkSignature = state.saveResultSignature;
    try {
      if (recoveringUnknown) {
        try {
          const prior = await resolveBatch(pendingBatchId);
          recoveryConfirmedAbsent = prior.found === false && prior.saved !== true;
          if (prior.saved) {
            setConfirmed(prior, null, attemptedWorkSignature);
            return;
          }
        } catch {
          // The saved batch ID is idempotent, so a same-body POST can also resolve an unavailable lookup.
        }
      }
      if (!state.selected.length) throw new Error("저장할 문항을 먼저 선택해 주세요.");
      const reviewResult = review();
      const blocking = reviewResult.hardFailures.filter((failure) => failure !== "문항 목록이 갱신되었습니다. 다시 만들어 주세요.");
      if (blocking.length) throw new Error(blocking.join(" "));
      if (reviewResult.warnings.length && !state.ackWarnings) {
        state.inspector = "summary";
        render();
        throw new Error("저장 전에 안내를 확인해 주세요.");
      }
      const papers = await prepare();
      const filters = compactSaveFilters(request(true).filters);
      const saveIndexVersion = state.indexVersion || state.catalog?.indexVersion || "";
      if (!saveIndexVersion) throw new Error("현재 문항 목록 버전을 확인할 수 없습니다.");
      const signature = JSON.stringify({
        indexVersion: saveIndexVersion,
        filters,
        includeExtended: state.includeExtended === true,
        papers: papers.map((paper) => ({ part_index: paper.index, questions: paper.questions, meta: paper.meta })),
      });
      if (recoveringUnknown && state.saveSignature !== signature)
        throw new Error("저장 결과를 확인하는 중에 작업 내용이 바뀌었습니다. 원래 내용으로 되돌린 뒤 '저장 결과 확인'을 다시 눌러 주세요.");
      if (!recoveringUnknown && (state.saveSignature !== signature || !state.saveBatchId)) {
        state.saveSignature = signature;
        state.saveBatchId = crypto.randomUUID();
        state.savedPaperIds = [];
        state.saveMessage = "";
        state.saveResultSignature = "";
      }
      state.saveError = "";
      state.saveResultSignature = saveWorkSignature();
      attemptedWorkSignature = state.saveResultSignature;
      state.saveResultState = "SAVING";
      save();
      status("시험지 문항과 출제 범위를 서버에서 확인하고 저장하고 있습니다.");
      const payload = {
        schema_version: "archive-saved-paper-v1",
        save_batch_id: state.saveBatchId,
        index_version: saveIndexVersion,
        selection_filters: filters,
        include_extended: state.includeExtended === true,
        papers: papers.map((paper) => ({
          part_index: paper.index,
          questions: paper.questions,
          meta: paper.meta,
          ...(state.derivationSource ? {
            lineage: {
              parent_kind: state.derivationSource.parentKind,
              parent_id: state.derivationSource.parentId,
              parent_revision: state.derivationSource.parentRevision,
              parent_snapshot_hash: state.derivationSource.parentSnapshotHash,
              derivation_type: state.derivationSource.derivationType,
            },
          } : {}),
        })),
      };
      requestStarted = true;
      const data = await api("/archive-saved-papers", payload);
      setConfirmed(data, papers.length, attemptedWorkSignature);
    } catch (error) {
      let recovered = false;
      if (requestStarted && (!error.status || error.status >= 500)) {
        try {
          const result = await resolveBatch();
          if (result.saved) {
            setConfirmed(result, null, attemptedWorkSignature);
            recovered = true;
          }
        } catch {
          // The outcome stays unknown until the same owner/batch can be read.
        }
      }
      if (!recovered) {
        const responseStatus = Number(error.status);
        const definiteHttpFailure = requestStarted &&
          Number.isInteger(responseStatus) && responseStatus >= 400 && responseStatus < 500;
        const keepUnknown = !definiteHttpFailure && (
          (recoveringUnknown && !recoveryConfirmedAbsent) ||
          (!requestStarted && recoveringUnknown) ||
          (requestStarted && (!error.status || responseStatus >= 500))
        );
        state.saveResultState = keepUnknown ? "RESULT_UNKNOWN" : "FAILED";
        state.saveMessage = "";
        state.saveError = error.message || "저장 요청에 실패했습니다.";
        save();
        status(
          keepUnknown
            ? "저장 결과를 확인하지 못했습니다. 중복 저장을 막기 위해 같은 저장 요청을 유지합니다. '저장 결과 확인'을 다시 눌러 주세요."
            : "시험지를 저장하지 못했습니다. 작업과 미리보기는 유지했습니다.",
          true,
        );
      }
    } finally {
      state.saveBusy = false;
      $("content").inert = false;
      render();
    }
  }
  async function outputUrl(paper, mode = state.outputMode, preview = true) {
    const questionUids = paper.meta.questionUids || paper.questions.map((question) =>
      question.questionUid || question.source_question_uid || question._sourceQuestionUid || null,
    );
    const envelope = await O.publishOutputEnvelope({
      sourceKind: paper.assignmentId ? "assignment" : "archive2-compose",
      sourceId: paper.assignmentId || paper.key,
      ...(paper.assignmentId ? { assignmentId: paper.assignmentId } : {}),
      mode,
      questionCount: paper.questions.length,
      questionUids,
      meta: paper.meta,
      questions: paper.questions,
    });
    const url = O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, {
      studio: true,
      preview,
      assignmentId: paper.assignmentId,
    });
    return { href: url.href, envelope };
  }
  async function updatePreview() {
    const host = $("preview-host");
    if (!host) return;
    const token = (state.previewToken = (state.previewToken || 0) + 1);
    const progress = document.createElement("div");
    progress.className = "preview-progress";
    progress.textContent = "문제지를 준비하고 있습니다.";
    host.setAttribute("aria-busy", "true");
    host.replaceChildren(progress);
    try {
      const papers = await prepare();
      if (host !== $("preview-host") || token !== state.previewToken) return;
      state.previewIndex = Math.min(state.previewIndex, papers.length - 1);
      const frame = document.createElement("iframe");
      frame.className = "preview";
      frame.title = "실제 문제지 미리보기";
      const output = await outputUrl(papers[state.previewIndex]);
      if (host !== $("preview-host") || token !== state.previewToken) {
        await O.createOutputStore().cleanup(output.envelope.ownerId, output.envelope.outputRequestId);
        return;
      }
      const previousEnvelope = previewOutputEnvelope;
      previewOutputEnvelope = output.envelope;
      frame.addEventListener("load", () => {
        const doc = frame.contentDocument;
        if (!doc) return;
        const complete = () => {
          if (token === state.previewToken)
            host.setAttribute("aria-busy", "false");
        };
        const observer = new MutationObserver(() => {
          const failed = frame.contentWindow.__AP_OUTPUT_RENDER_ERROR__ || doc.documentElement.dataset.apRenderError;
          if (!doc.querySelector("#print-area .page") && !failed) return;
          observer.disconnect();
          const ready = frame.contentWindow.__AP_RENDER_READY__;
          if (ready && typeof ready.then === "function")
            ready.then(complete, complete);
          else complete();
        });
        if (doc.querySelector("#print-area .page") || frame.contentWindow.__AP_OUTPUT_RENDER_ERROR__ || doc.documentElement.dataset.apRenderError) complete();
        else observer.observe(doc.body, { childList: true, subtree: true });
        doc.addEventListener("click", (event) => {
          if (state.sealed || state.busy) return;
          const box = event.target.closest?.(".q-box[data-source-ref]");
          if (!box) return;
          const i = state.selected.findIndex((r) =>
            box.dataset.sourceRef.endsWith("#" + r.questionUid),
          );
          if (i < 0) return;
          try {
            if (state.saveResultState === "RESULT_UNKNOWN")
              throw new Error("저장 결과를 확인할 때까지 문항을 바꿀 수 없습니다.");
            replace(i);
          } catch (error) {
            status(error.message, true);
          }
        });
      });
      frame.src = output.href;
      host.replaceChildren(frame, progress);
      if (previousEnvelope)
        void O.createOutputStore().cleanup(previousEnvelope.ownerId, previousEnvelope.outputRequestId).catch(() => {});
    } catch (e) {
      if (host === $("preview-host") && token === state.previewToken) {
        host.setAttribute("aria-busy", "false");
        host.textContent = teacherErrorMessage(e);
        status(e.message, true);
      }
    }
  }
  // The saved-paper endpoint rejects selection filters above 200 KB. A unified unit can hold
  // thousands of UIDs, so when the filters would not fit, record only the UIDs the papers use
  // (the server still replays every saved question against them).
  const SAVE_FILTER_BYTE_LIMIT = 150000;
  function compactSaveFilters(filters) {
    if (!Array.isArray(filters.scopeQuestionUids)) return filters;
    // UIDs and path keys are ASCII, so the string length is the byte length for the large parts.
    if (JSON.stringify(filters).length <= SAVE_FILTER_BYTE_LIMIT) return filters;
    const used = new Set(state.selected.map((record) => record.questionUid));
    return { ...filters, scopeQuestionUids: filters.scopeQuestionUids.filter((uid) => used.has(uid)) };
  }
  function generate(rebuild = false) {
    if (state.sealed) return;
    if (state.receipts.length || (rebuild && state.selected.length > 50)) {
      rebuildUnissued();
      return;
    }
    state.composeNotice = "";
    state.seed = crypto.randomUUID();
    const req = request();
    if (!rebuild) req.pins = [];
    const ctx = context();
    if (rebuild)
      ctx.current = state.selected
        .filter((r) => !state.pins.includes(r.questionUid))
        .map((r) => r.questionUid);
    const result = C.selectBlueprint(pool(), req, ctx, assessmentSelectionOptions());
    // 선택 엔진이 거절한 것(학년 없음·고정 문항 충돌 등)은 그대로 알린다. 문항이 모자란 것은 거절이 아니다.
    if (result.errors.length) {
      showDialog(
        "문제지를 만들 수 없습니다",
        `<p>${result.errors.map(esc).join("<br>")}</p><p>범위·난이도·고정 문항을 확인한 뒤 다시 만들어 주세요.</p>`,
      );
      return;
    }
    // 고정 외 다시 만들기는 지금 문항을 후보에서 빼고 뽑으므로 새 문항이 모자라면 문제지가 조용히 줄어든다. 줄어들면 적용하지 않고
    // 지금 문제지를 그대로 둔다("모자라도 막지 않음"은 새로 만들 때만 적용한다).
    if (rebuild && result.selected.length < state.selected.length) {
      state.composeNotice = "바꿔 넣을 문항이 모자라 지금 문제지를 그대로 둡니다. 문항을 하나씩 교체하거나 조건을 넓혀 주세요.";
      render();
      return;
    }
    // 모자라도 막지 않는다(단원별 기출과 같은 원칙): 있는 만큼만 넣고, 어디가 얼마나 모자랐는지 결과 위에 알린다.
    // 뽑힌 만큼으로 줄인 행(0인 행은 뺀다)으로 검증해야 C.review가 "요청한 문항 수가 충족되지 않았습니다"로 막지 않는다.
    const picked = new Map(result.rowResults.map((item) => [item.id, item.selected]));
    const usedRows = req.rows
      .filter((row) => (picked.get(row.id) || 0) > 0)
      .map((row) => (picked.get(row.id) === row.count ? row : { ...row, count: picked.get(row.id) }));
    if (!result.selected.length || !usedRows.length) {
      state.composeStale = false;
      status("고른 조건에 맞는 문항이 없습니다. 단원이나 난이도 단계 조건을 넓혀 주세요.", true);
      render();
      return;
    }
    state.composeShortage = req.rows
      .filter((row) => (picked.get(row.id) || 0) < row.count)
      .map((row) => ({
        label: row.label || "",
        difficultyBuckets: row.difficultyBuckets || [],
        requested: row.count,
        got: picked.get(row.id) || 0,
      }));
    state.composeStale = false;
    state.questionListOpen = true;
    state.selected = result.selected;
    state.rows = usedRows;
    state.indexVersion = state.catalog.indexVersion;
    state.prepared = [];
    state.undo = [];
    state.previewIndex = 0;
    state.ackWarnings = false;
    if (!rebuild) state.pins = [];
    save();
    render();
    if (!rebuild) focusComposeResult();
    // 화면 상태 줄에는 내지 않는다(오른쪽 결과 요약과 겹치고, 처리 시간은 교사에게 필요 없다). 화면 읽기 프로그램용
    // 숨은 안내(composeAnnounce)에만 두고, 처리 시간은 콘솔과 ?perf=1에서만 보인다.
    state.composeAnnounce = `${result.selected.length}문항을 선택했습니다.`;
    status("");
    if (new URLSearchParams(location.search).get("perf") === "1") status(`${result.selected.length}문항 선택 · 중복 없음 · ${result.diagnostics.elapsedMs}ms`);
    else console.debug("[archive2] generate", result.selected.length, "questions", result.diagnostics.elapsedMs + "ms");
  }
  // 좁은 화면(조건이 위, 결과가 아래)에서는 뽑은 결과가 화면 밖 아래에 생기므로 결과 머리로 옮기고 포커스를 둔다. 두 칸(PC)은
  // 결과가 바로 옆에 보여 스크롤하지 않는다. 움직임 줄이기 설정이면 부드러운 스크롤 없이 바로 이동한다.
  function focusComposeResult() {
    try {
      if (window.matchMedia?.("(min-width: 1100px)")?.matches) return;
      const target = document.querySelector("[data-cz-result-title]");
      if (!target) return;
      target.setAttribute("tabindex", "-1");
      const reduce = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
      target.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" });
      target.focus?.({ preventScroll: true });
    } catch {}
  }
  function showDialog(title, body) {
    $("modal").classList.remove("original-issue-dialog", "saved-paper-issue-dialog");
    $("modal-body").innerHTML =
      `<h2 id="modal-title">${esc(title)}</h2>${body}`;
    if (!$("modal").open) $("modal").showModal();
  }
  function replace(index) {
    if (lockedIndex(index))
      throw new Error("이미 학생에게 출제한 문제지는 변경할 수 없습니다.");
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      primaryPaths: selectedScopePaths(),
    };
    replacementIndex = index;
    const current = state.selected[index],
      row = state.rows.find((r) => r.id === current.rowId),
      used = new Set(state.selected.map((r) => r.questionUid)),
      excluded = C.composeExclusions(context()).union;
    candidateRecords = pool().filter(
      (r) =>
      workspaceEligibility(r).ok &&
      workspaceMatches(r, selectionFilters) &&
      C.rowMatches(r, row, workspaceMatchOptions()) &&
        !used.has(r.questionUid) &&
        !excluded.has(r.questionUid),
    ).sort(C.compareRecency);
    showDialog(
      `${Math.floor(index / 50) + 1}권 ${(index % 50) + 1}번 교체 · ${current.L2}`,
      `<p class="muted">현재 출제 조건·출처·학생 이력을 유지합니다. 후보 ${candidateRecords.length}문항</p>${
        candidateRecords
          .slice(0, 30)
          .map(
            (r, i) =>
              `<div class="candidate"><div><strong>${esc(r.year)} ${esc(r.school)} · 원본 ${esc(r.sourceQuestionNo)}번</strong><p class="muted">${esc(displayTemplate(r))} · 난이도 ${r.difficultyBucket}</p></div><div>${button("candidate-preview", "원본 확인", `data-candidate="${i}" class="small"`)}${button("candidate-use", "교체", `data-candidate="${i}" class="small"`)}</div></div>`,
          )
          .join("") ||
        '<div class="empty">같은 조건으로 교체할 새 문항이 없습니다.</div>'
      }`,
    );
  }
  function replaceWith(candidate) {
    if (lockedIndex(replacementIndex))
      throw new Error("이미 출제한 문항입니다.");
    const before = state.selected[replacementIndex],
      after = { ...candidate, rowId: before.rowId };
    const next = state.selected.slice();
    next[replacementIndex] = after;
    const check = C.review(next, request(true), ownHistoryContext());
    if (!candidateRecords.some((r) => r.questionUid === candidate.questionUid))
      throw new Error("현재 교체 후보가 아닙니다.");
    state.undo.push({
      index: replacementIndex,
      before,
      after,
      wasPinned: state.pins.includes(before.questionUid),
    });
    state.composeNotice = "";
    state.selected = next;
    state.pins = state.pins.map((uid) =>
      uid === before.questionUid ? after.questionUid : uid,
    );
    state.prepared = [];
    state.ackWarnings = false;
    save();
    $("modal").close();
    render();
    status("문항을 교체했습니다. 필요하면 되돌릴 수 있습니다.");
  }
  function seal() {
    state.sealed = Parts.status(state.selected.length, state.receipts).complete;
    save();
  }
  async function finalGate() {
    // Student history is advisory only. A committed immutable paper may retry its own PDF without excluding itself.
    const ctx = ownHistoryContext();
    const req = request(true);
    if (state.sealed) req.historyReady = true;
    const r = C.review(state.selected, req, ctx);
    if (state.indexVersion !== state.catalog.indexVersion)
      throw new Error("문항 목록이 갱신되었습니다. 다시 검증하세요.");
    if (r.status === "HARD_BLOCK") throw new Error(r.hardFailures.join(" "));
    if (r.warnings.length && !state.ackWarnings) {
      state.inspector = "summary";
      render();
      throw new Error("출력 전 안내를 확인해 주세요.");
    }
    return prepare();
  }
  let printInFlight = false;
  async function print() {
    // A double click must not open two output windows.
    if (printInFlight) return;
    printInFlight = true;
    try {
      await printOnce();
    } finally {
      printInFlight = false;
    }
  }
  async function printOnce() {
    const receipt = state.receipts.find((row) =>
      row.partIndex === state.previewIndex && row.classId === state.classId,
    );
    if (receipt?.id) return openAssignmentOutput(receipt.id, state.outputMode);
    const popup = window.open("about:blank", "_blank");
    try {
      const papers = await finalGate();
      if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
      const output = await outputUrl(
        papers[state.previewIndex],
        state.outputMode,
        false,
      );
      popup.location.href = output.href;
      render();
      status(
        "출력 창을 열었습니다. 학생 출제 전까지 문항을 수정할 수 있습니다.",
      );
    } catch (e) {
      popup?.close();
      throw e;
    }
  }
  async function targets() {
    if (state.receipts.length)
      throw new Error(
        "확정 회차의 대상은 변경할 수 없습니다. 다음 회차를 시작하세요.",
      );
    try {
      const data = await api("/qr-classes");
      classRows = data.classes || data.data || [];
      if (!Array.isArray(classRows)) classRows = [];
      rosterRequestSeq++;
      rosterLoading = false;
      rosterRows = [];
      showDialog(
        "출제 대상 학생",
        `<label>반<select id="target-class" aria-label="반">${options(
          classRows.map((r) => ({
            value: r.id,
            label: r.name || r.class_name || r.id,
          })),
          state.classId,
          "반 선택",
        )}</select></label><div id="target-roster"><p class="muted">반을 선택하면 현재 명단을 불러옵니다.</p></div>${button("target-apply", "선택한 학생 적용", 'class="primary"')}`,
      );
      if (state.classId) await loadRoster(state.classId);
    } catch (e) {
      showDialog(
        "교사 로그인",
        `<p>${esc(teacherErrorMessage(e))}</p><a href="index.html" target="_blank">기존 아카이브에서 로그인</a><p class="muted">로그인 후 이 창으로 돌아와 학생 선택을 다시 누르세요.</p>`,
      );
    }
  }
  // Only the newest class selection may fill the roster; a slow answer for an earlier class
  // must never show (or apply) that class's students under the class now selected.
  let rosterRequestSeq = 0;
  let rosterLoading = false;
  async function loadRoster(id) {
    const seq = ++rosterRequestSeq;
    rosterRows = [];
    const box = $("target-roster");
    if (!id) {
      rosterLoading = false;
      if (box) box.innerHTML = '<p class="muted">반을 선택하면 현재 명단을 불러옵니다.</p>';
      return;
    }
    rosterLoading = true;
    if (box) box.innerHTML = '<p class="muted">명단을 불러오는 중입니다.</p>';
    let data;
    try {
      data = await api(
        "/class-exam-assignments/roster?class_id=" + encodeURIComponent(id),
      );
    } catch (error) {
      if (seq !== rosterRequestSeq) return;
      rosterLoading = false;
      if (box) box.innerHTML = '<p class="muted">명단을 불러오지 못했습니다. 반을 다시 선택해 주세요.</p>';
      throw error;
    }
    if (seq !== rosterRequestSeq) return;
    rosterLoading = false;
    rosterRows = Array.isArray(data.students) ? data.students : [];
    if (!$("target-roster")) return;
    $("target-roster").innerHTML =
      `<div class="actions" style="margin-top:12px">${button("target-all", "전체 선택", 'class="small"')}</div><div class="roster">${rosterRows.map((s, i) => `<label class="check"><input type="checkbox" data-target-index="${i}" aria-label="${esc(s.name)}" ${state.studentIds.includes(s.id) ? "checked" : ""}>${esc(s.name)} <span class="muted">${esc(s.school_name || "")}</span></label>`).join("")}</div>`;
  }
  async function assign() {
    if (!state.studentIds.length || !state.classId)
      throw new Error("출제 대상 학생을 선택하세요.");
    state.busy = true;
    $("content").inert = true;
    status("출제 정보를 저장하고 PDF를 준비하고 있습니다.");
    try {
      const papers = await finalGate();
      status("출제 정보를 저장하고 PDF를 준비하고 있습니다.");
      for (const paper of papers) {
        const existing = state.receipts.find(
          (r) => r.key === paper.key && r.classId === state.classId,
        );
        if (existing) {
          if (!existing.ready) {
            try {
              const d = await api(
                "/class-exam-assignments/" + existing.id + "/pdf",
                {},
              );
              existing.ready = d.assignment?.pdf_status === "ready";
            } catch {
              /* A PDF retry never changes the saved paper or recipients. */
            }
          }
          continue;
        }
        const body = {
          contract_version: C.VERSION,
          index_version: state.catalog.indexVersion,
          selection_filters: request(true).filters,
          class_id: state.classId,
          student_ids: state.studentIds,
          exam_title: paper.meta.title,
          exam_date:
            state.issueDate ||
            (state.issueDate = new Date(Date.now() + 9 * 3600000)
              .toISOString()
              .slice(0, 10)),
          question_count: paper.questions.length,
          archive_file: "MIXED:" + paper.key,
          subject: C.subjectProjectionLabel(state.filters) || composeSubjectLabel(),
          pdf_qpp: paper.meta.qpp,
          history_mode: "off",
          mixed_payload_json: { questions: paper.questions, meta: paper.meta },
        };
        let data;
        try {
          data = await api("/class-exam-assignments/studio", body);
        } catch (e) {
          if (e.data?.saved) {
            rememberReceipt(paper, e.data.assignment);
            seal();
            continue;
          }
          state.failedPart = { index: paper.index, message: e.message };
          save();
          state.previewIndex = paper.index;
          e.message = `${paper.index + 1}권은 아직 출제되지 않았습니다. ${state.receipts.length}개 문제지는 저장됐습니다. 이 문제지만 수정한 뒤 이어서 출제하세요. ${e.message}`;
          throw e;
        }
        rememberReceipt(paper, data.assignment);
        seal();
      }
      status(
        state.receipts.some((r) => !r.ready)
          ? "학생의 내 시험지에 표시됐습니다. PDF 파일은 다시 준비해야 합니다."
          : "선택한 학생의 내 시험지에 출제했습니다.",
      );
    } finally {
      state.busy = false;
      $("content").inert = false;
      state.historyReady = false;
      save();
      render();
      if (!state.sealed) await refreshHistory();
    }
  }
  function rememberReceipt(paper, a) {
    frozenPaperCache.set(paper.key, structuredClone(paper));
    state.failedPart = null;
    state.receipts = state.receipts.filter(
      (r) => !(r.key === paper.key && r.classId === state.classId),
    );
    state.receipts.push({
      key: paper.key,
      partIndex: paper.index,
      questionUids: paper.questions.map((q) => q.questionUid),
      classId: state.classId,
      className:
        classRows.find((r) => r.id === state.classId)?.name || "선택한 반",
      id: a.id,
      ready: a.pdf_status === "ready",
    });
  }
  function rebuildUnissued() {
    const saved = Parts.lockedUids(state.receipts),
      req = request(true),
      ctx = ownHistoryContext();
    const pending = state.selected.filter(
        (q, i) =>
          Parts.partIndex(i) === state.previewIndex &&
          !saved.has(q.questionUid),
      ),
      pins = pending.filter((q) => state.pins.includes(q.questionUid));
    if (!pending.length)
      throw new Error("이미 출제한 문제지입니다. 수정할 문제지를 선택하세요.");
    const pendingUids = new Set(pending.map((q) => q.questionUid));
    req.rows = req.rows
      .map((row) => ({
        ...row,
        count: pending.filter((q) => q.rowId === row.id).length,
      }))
      .filter((row) => row.count > 0);
    req.pins = pins.map((q) => ({
      questionUid: q.questionUid,
      rowId: q.rowId,
    }));
    req.seed = crypto.randomUUID();
    ctx.current = state.selected
      .filter(
        (q) =>
          !pendingUids.has(q.questionUid) ||
          !state.pins.includes(q.questionUid),
      )
      .map((q) => q.questionUid);
    const result = C.selectBlueprint(pool(), req, ctx, assessmentSelectionOptions());
    if (!result.ok)
      throw new Error(
        "같은 조건의 새 문항이 부족합니다. 필요한 문항만 개별 교체해 주세요.",
      );
    const available = result.selected.slice();
    state.selected = state.selected.map((q) => {
      if (!pendingUids.has(q.questionUid)) return q;
      const i = available.findIndex((r) => r.rowId === q.rowId);
      return available.splice(i, 1)[0];
    });
    state.prepared = [];
    state.undo = [];
    state.failedPart = null;
    save();
    render();
    status(
      `${state.previewIndex + 1}권에서 고정한 문항을 유지하고 나머지를 다시 만들었습니다.`,
    );
  }
  function download(data, name) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const FINDER_URL_KEYS = [
    "grade", "curriculumKey", "courseKey", "semanticSubject", "school",
    "yearFrom", "yearTo", "axis", "query", "family", "material", "file", "similarOnly",
  ];
  const RECENT_URL_KEYS = ["from", "to", "grade", "subject", "query"];
  const QUICK_URL_KEYS = { grade: "qgrade", subject: "qsubject" };
  function routeUrl() {
    const url = new URL("workspace.html", location.href);
    url.searchParams.set("view", state.view);
    if (state.assignLegacy) url.searchParams.set("assign", "legacy");
    if (state.view === "compose" && state.assessmentRecipe)
      url.searchParams.set("recipe", state.assessmentRecipe);
    if (isQuickAssessmentView()) {
      // Quick-only names: `grade`/`subject` belong to the Finder and 출제 내역.
      if (quickState.grade) url.searchParams.set(QUICK_URL_KEYS.grade, quickState.grade);
      if (quickState.subject) url.searchParams.set(QUICK_URL_KEYS.subject, quickState.subject);
    }
    if (state.view === "find") {
      for (const key of FINDER_URL_KEYS)
        if (state.find[key]) url.searchParams.set(key, state.find[key]);
      // 전체 (every kind of material) is an explicit choice; without a material the finder lists 학교 기출.
      if (state.find.material === "") url.searchParams.set("material", "all");
      if (state.page > 0) url.searchParams.set("page", String(state.page));
    } else if (state.view === "recent") {
      for (const key of RECENT_URL_KEYS)
        if (state.recentFilters[key]) url.searchParams.set(key, state.recentFilters[key]);
      if (state.recentClassId) url.searchParams.set("class", state.recentClassId);
      if (state.recentSelectedAssignmentId)
        url.searchParams.set("assignment_id", state.recentSelectedAssignmentId);
    } else if (state.view === "saved") {
      if (state.savedPaperId) url.searchParams.set("paper_id", state.savedPaperId);
      if (state.savedLibraryStatusFilter !== "ACTIVE")
        url.searchParams.set("status", state.savedLibraryStatusFilter);
    } else if (state.view === "compose" && state.editSavedPaperId) {
      url.searchParams.set("edit_saved_paper", state.editSavedPaperId);
    } else if (state.view === "compose" && state.uidRoute) {
      for (const uid of state.uidRoute.requested) url.searchParams.append("uid", uid);
    } else if (state.view === "compose" && state.sources.length) {
      for (const source of state.sources) url.searchParams.append("source", source);
      if (state.distribution === "all") url.searchParams.set("range", "all");
    }
    return url;
  }
  function rememberCurrentHistoryEntry() {
    if (new URLSearchParams(location.search).get("view") === "saved")
      window.Archive2Library?.saveContext?.();
    try {
      history.replaceState(
        { ...(history.state || {}), archive2ScrollY: Math.max(0, Number(window.scrollY) || 0) },
        "",
        location.href,
      );
    } catch {}
  }
  function urlState() {
    rememberCurrentHistoryEntry();
    history.pushState({ archive2ScrollY: 0 }, "", routeUrl());
  }
  function replaceUrlState() {
    history.replaceState(
      { ...(history.state || {}), archive2ScrollY: Math.max(0, Number(window.scrollY) || 0) },
      "",
      routeUrl(),
    );
  }
  async function openRecentAssignmentStatus(id) {
    const assignmentId = String(id || "").trim();
    if (!assignmentId) return;
    if (state.view === "recent") {
      invalidateRecentRequests();
      updateRecentResults();
      rememberCurrentHistoryEntry();
      state.recentSelectedAssignmentId = assignmentId;
      history.pushState(
        { archive2ScrollY: Math.max(0, Number(window.scrollY) || 0), archive2RecentSelection: true },
        "",
        routeUrl(),
      );
    } else if (state.view === "saved") {
      // Opened from an issue-history row in 보관함: a leftover 출제 내역 selection must not block it.
      state.recentSelectedAssignmentId = "";
    }
    await assignmentStatus(assignmentId);
  }
  window.Archive2WorkspaceOpenAssignmentStatus = openRecentAssignmentStatus;
  function restoreCurrentHistoryScroll() {
    const top = Math.max(0, Number(history.state?.archive2ScrollY) || 0);
    const restore = () => window.scrollTo(0, top);
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(restore);
    else restore();
  }
  function showSavedLibrary(statusFilter = "ACTIVE") {
    rememberCurrentHistoryEntry();
    state.view = "saved";
    state.savedPaperId = "";
    state.savedLibraryStatusFilter = ["ACTIVE", "ARCHIVED", "TRASHED"].includes(statusFilter)
      ? statusFilter : "ACTIVE";
    history.pushState({ archive2ScrollY: 0 }, "", routeUrl());
    render();
    window.scrollTo(0, 0);
  }
  function showSavedPaper(id, statusFilter = state.savedLibraryStatusFilter || "ACTIVE") {
    const paperId = String(id || "").trim();
    if (!paperId) return;
    rememberCurrentHistoryEntry();
    state.view = "saved";
    state.savedPaperId = paperId;
    state.savedLibraryStatusFilter = ["ACTIVE", "ARCHIVED", "TRASHED"].includes(statusFilter)
      ? statusFilter : "ACTIVE";
    history.pushState({ archive2ScrollY: 0, archive2SavedLibraryDetail: true }, "", routeUrl());
    render();
    window.scrollTo(0, 0);
  }
  window.Archive2WorkspaceShowSavedLibrary = showSavedLibrary;
  window.Archive2WorkspaceShowSavedPaper = showSavedPaper;
  const UNKNOWN_RESULT_ALLOWED_ACTIONS = new Set([
    "save-paper", "saved-output", "saved-paper-issue", "saved-paper-view",
    "print", "backup", "close-dialog",
  ]);
  function newDraft() {
    if (state.saveResultState === "RESULT_UNKNOWN") {
      status("현재 저장 결과를 먼저 확인한 뒤 새 작업을 시작하세요.", true);
      return;
    }
    if (state.selected.length) save();
    const hadUidRoute = resetWorkingDraft();
    state.view = "compose";
    if (hadUidRoute) replaceUrlState();
    render();
    scheduleSave();
  }
  // 작업 중인 문제지를 빈 새 작업으로 되돌린다(화면 이동·저장은 부르는 쪽이 한다).
  function resetWorkingDraft() {
    const hadUidRoute = Boolean(state.uidRoute || state.urlUids.length);
    clearUidRoute({ url: false });
    delete state.filters.L3;
    delete state.filters.L4;
    for (const key of META_FACET_FILTERS) state.filters[key] = "";
    Object.assign(state, {
      draftId: crypto.randomUUID(),
      composeShortage: [],
      composeStale: false,
      composeNotice: "",
      selected: [],
      sources: [],
      scopes: [],
      buckets: [],
      includeExtended: false,
      custom: {},
      pins: [],
      rows: [],
      round: 1,
      rounds: [],
      sealed: false,
      issueDate: "",
      prepared: [],
      undo: [],
      receipts: [],
      failedPart: null,
      includeQr: false,
      historyMode: "off",
      recentDays: 90,
      history: null,
      historyReady: true,
      historyError: "",
      ackWarnings: false,
      previewIndex: 0,
      indexVersion: state.catalog?.indexVersion ?? state.indexVersion,
      saveBatchId: "",
      saveSignature: "",
      savedPaperIds: [],
      lastSavedPaperIds: [],
      saveMessage: "",
      saveError: "",
      saveResultSignature: "",
      saveResultState: "",
      derivationSource: null,
      derivedBaseQuestions: null,
    });
    derivedBaseLoad = null;
    return hadUidRoute;
  }
  // 만들던 문제지 삭제: 이 기기(브라우저)에 저장된 작업만 지운다. 보관함 문제지와 이미 낸 출제는 건드리지 않는다.
  function askDeleteDraft(draftId) {
    const record = drafts().find((d) => d.draftId === draftId);
    if (!record) { render(); return; }
    showDialog("만들던 문제지 삭제", `<p><strong>${esc(record.header?.title || record.title || "문제지")}</strong> · ${record.selected?.length || 0}문항</p>
      <p>이 기기에 저장된 작업을 지웁니다. 되돌릴 수 없습니다. 보관함에 저장한 문제지와 이미 낸 출제는 그대로 남습니다.</p>
      <div class="actions">${button("delete-draft-confirm", "삭제", `data-draft-id="${esc(record.draftId)}" class="primary"`)}</div>`);
  }
  function deleteDraft(draftId) {
    const id = String(draftId || "");
    if (!id) return false;
    if (id === state.draftId) {
      if (state.saveResultState === "RESULT_UNKNOWN") {
        status("현재 저장 결과를 먼저 확인한 뒤 삭제하세요.", true);
        return false;
      }
      // 지금 작업 중인 문제지를 지웠다: 메모리에 남은 선택이 자동 저장으로 되살아나지 않게 빈 작업으로 되돌린다.
      clearTimeout(autosaveTimer);
      resetWorkingDraft();
    }
    try {
      localStorage.setItem(storageKey(), JSON.stringify(drafts().filter((d) => d.draftId !== id)));
    } catch {
      status("만들던 문제지를 삭제하지 못했습니다. 다시 시도해 주세요.", true);
      return false;
    }
    if ($("modal")?.open) $("modal").close();
    render();
    status("만들던 문제지를 삭제했습니다.");
    return true;
  }
  // 문항 수가 바뀔 때(입력·− / +): 전체를 다시 그리지 않고(입력 중인 칸과 포커스를 지키려고) 지금 조건의 요약·버튼과
  // 오른쪽 안내, 하단 띠만 새로 그린다. 이미 뽑은 결과는 지금 동작대로 비우고 "조건이 바뀌었습니다"를 보인다.
  function composeCountChanged() {
    invalidate();
    patchComposeLive();
  }
  function patchComposeLive() {
    const live = document.querySelector("[data-cz-live]");
    const fresh = document.createElement("template");
    fresh.innerHTML = renderComposition();
    const nextLive = fresh.content.querySelector("[data-cz-live]");
    if (live && nextLive) live.replaceWith(nextLive);
    const note = document.querySelector(".cz-amount-note"), nextNote = fresh.content.querySelector(".cz-amount-note");
    if (note && nextNote) note.replaceWith(nextNote);
    const result = document.querySelector("[data-cz-result]");
    if (result) result.innerHTML = renderResult();
    document.querySelector(".cz")?.classList.toggle("has-result", state.selected.length > 0);
    refreshComposeBar();
  }
  function stepComposeCount(delta) {
    if (state.sealed || state.receipts.length || state.distribution === "all") return;
    const current = Number.isInteger(Number(state.count)) ? Number(state.count) : 0;
    state.count = Math.min(400, Math.max(1, current + delta));
    const input = document.getElementById("count");
    if (input) input.value = String(state.count);
    composeCountChanged();
  }
  // 저장하고 반에 출제: 저장이 확인된 뒤에만 출제 패널을 연다. 이미 현재 편집본이 저장되어 있으면 다시 저장하지 않고
  // 그 저장본으로 바로 연다. 저장이 실패했거나 결과를 모르면(RESULT_UNKNOWN) 출제로 넘어가지 않는다.
  async function saveAndAssign() {
    if (state.assignBusy || state.saveBusy) return;
    if (state.saveResultState === "RESULT_UNKNOWN") {
      status("저장 결과를 먼저 확인해 주세요.", true);
      return;
    }
    state.assignBusy = true;
    try {
      let ids = currentSavedPaperIds();
      if (!ids.length) {
        await savePapers();
        ids = currentSavedPaperIds();
        // 저장 실패·결과 모름: savePapers가 이미 화면과 알림으로 사정을 알렸다. 출제 패널은 열지 않는다.
        if (!ids.length) return;
      }
      if (ids.length === 1) {
        await openSavedPaperAssign(ids[0]);
        return;
      }
      // 여러 권: 저장 묶음에서 권 정보를 받아 한 패널에 모두 넘긴다(권마다 따로 열지 않는다).
      const data = await api("/archive-saved-papers/save-batches/" + encodeURIComponent(state.saveBatchId));
      const byId = new Map((Array.isArray(data?.papers) ? data.papers : []).map((paper) => [paper.id, paper]));
      const parts = ids.map((id) => byId.get(id)).filter((paper) => paper && (paper.library_status || "ACTIVE") !== "TRASHED");
      if (parts.length !== ids.length)
        throw new Error("저장한 문제지 " + ids.length + "권을 모두 확인하지 못했습니다. 위의 권별 출제 버튼이나 보관함에서 출제해 주세요.");
      await openSavedPaperAssign(parts[0].id, { papers: parts });
    } finally {
      state.assignBusy = false;
      renderControls();
      refreshComposeBar();
    }
  }
  // 문제지 만들기 조건(학년·과목·교육과정·세부 조건) 변경. 선택 상자의 change와 학년·과목 버튼이 같이 쓴다.
  function changeComposeFilter(key, value) {
    if (state.sealed) {
      render();
      return;
    }
    state.filters[key] = value;
    if (key === "L3") delete state.filters.L4;
    // PT -> TPL: a template belongs to one problem type, so a new type resets the template.
    if (key === "metaPT") state.filters.metaTPL = "";
    if (["grade", "curriculumKey", "courseKey", "semanticSubject", "originalCurriculum"].includes(key)) {
      state.scopes = [];
      state.scopeNotice = "";
      delete state.filters.L3;
      delete state.filters.L4;
      for (const facet of META_FACET_FILTERS) state.filters[facet] = "";
      if (key === "grade") {
        state.sources = [];
        state.buckets = [];
        state.custom = {};
        state.filters.curriculumKey = "";
        state.filters.courseKey = "";
        state.filters.semanticSubject = "";
        state.filters.originalCurriculum = "";
        state.filters.family = "";
        state.filters.school = "";
      }
      if (unifiedIndex()) {
        // The unified unit list owns subject and curriculum; the finder reconcile
        // rules (2015/2022 course keys) do not apply to it.
        state.filters = reconcileUnifiedFilters(state.filters);
        if (key === "grade") state.filters = withDefaultComposeSubject(state.filters);
      } else {
        if (key === "curriculumKey" && !C.hasSubjectProjection?.(state.filters.grade))
          state.filters.courseKey = "";
        if (key === "semanticSubject") {
          state.filters.courseKey = "";
          state.filters.family = "";
        }
        state.filters = C.reconcileFinderFilters(state.filters, state.catalog.taxonomy);
      }
      reconcileFinderSchool(state.filters);
    }
    invalidate();
    render();
  }
  // Actions that never read the catalog; everything else waits for it (see deferUntilCatalog).
  const CATALOG_FREE_ACTIONS = new Set([
    "boot-retry", "home-product", "home-school", "home-all-schools", "home-search", "delete-draft", "delete-draft-confirm", "close-dialog",
    "recent-toggle-cancelled", "assignment-cancel", "assignment-cancel-confirm",
    "assignment-status", "assignment-output-direct", "assignment-output", "assignment-pdf", "library-reload",
    "recent-retry", "recent-open-saved", "saved-output", "saved-paper-issue", "saved-paper-view",
  ]);
  let deferredClick = null;
  const DEFERRED_NOTICE = "자료를 준비하는 중입니다. 준비가 끝나면 이어서 진행합니다.";
  // A button that needs the catalog was pressed before it is ready: say so and press it again when it is.
  function deferUntilCatalog(b) {
    if (state.bootError) { status(state.bootError, true); return; }
    deferredClick = { dataset: { ...b.dataset }, view: state.view };
    status(DEFERRED_NOTICE);
  }
  // Leaving the screen cancels the pending press: it must not fire later when the teacher comes back to
  // that screen, and its notice must not stay on the screen they moved to.
  function dropStaleDeferredClick() {
    if (!deferredClick || deferredClick.view === state.view) return;
    deferredClick = null;
    if ($("status")?.textContent === DEFERRED_NOTICE) status("");
  }
  function replayDeferredClick() {
    const pending = deferredClick;
    deferredClick = null;
    if (!pending || pending.view !== state.view) return;
    const el = document.createElement("button");
    el.type = "button";
    el.hidden = true;
    for (const [key, value] of Object.entries(pending.dataset)) el.dataset[key] = value;
    document.body.appendChild(el);
    try { el.click(); } finally { el.remove(); }
  }
  // Opens a route of this same page without reloading it, so the catalog that is being prepared is not
  // thrown away (a reload would start the whole download, hash check and resolve again).
  function openRouteInPage(target) {
    let url;
    try { url = new URL(String(target), location.href); } catch { return false; }
    if (url.origin !== location.origin || url.pathname !== location.pathname) return false;
    if (state.assignLegacy && !url.searchParams.has("assign")) url.searchParams.set("assign", "legacy");
    rememberCurrentHistoryEntry();
    history.pushState({ archive2ScrollY: 0 }, "", url.href);
    readUrl();
    syncUidRoute();
    render();
    window.scrollTo(0, 0);
    return true;
  }
  document.addEventListener("click", async (event) => {
    if (!event.target.closest(".finder-card-more, .compose-saved-continuity-more, .history-draft-actions details, .cz-more"))
      document.querySelectorAll(".finder-card-more[open], .compose-saved-continuity-more[open], .history-draft-actions details[open], .cz-more[open]")
        .forEach((menu) => { menu.open = false; });
    const b = event.target.closest("button");
    const savedPaperAction = ["saved-paper-issue", "saved-paper-view", "saved-output"].includes(b?.dataset?.action);
    if (!b || b.disabled || ((state.busy || state.saveBusy) && !savedPaperAction)) return;
    // 더보기 메뉴 안의 버튼을 누르면 메뉴는 닫는다.
    b.closest?.(".cz-more")?.removeAttribute?.("open");
    try {
      if (b.dataset.view) {
        if (b.dataset.view === state.view && !(state.view === "saved" && state.savedPaperId))
          return;
        if (b.dataset.navKey === "quick" && isQuickAssessmentView()) return;
        state.assignmentStatusLoadVersion++;
        rememberCurrentHistoryEntry();
        if (b.dataset.view === "compose" && state.view !== "compose" && !state.selected.length) {
          state.sources = [];
          clearUidRoute({ url: false });
        }
        state.view = b.dataset.view;
        if (state.view === "find") applyDefaultFinderMaterial();
        if (state.view === "saved") state.savedPaperId = "";
        urlState();
        render();
        window.scrollTo(0, 0);
        if (state.view === "recent") await loadRecent();
        return;
      }
      const a = b.dataset.action;
      if (a === "boot-retry") { location.reload(); return; }
      if (!state.catalog && a && !CATALOG_FREE_ACTIONS.has(a)) {
        deferUntilCatalog(b);
        return;
      }
      // While a save result is unknown only actions that change the saved contents stay locked.
      // Local output, work backup, closing a dialog and sheet toggles never touch the save identity.
      if (state.saveResultState === "RESULT_UNKNOWN" && !UNKNOWN_RESULT_ALLOWED_ACTIONS.has(a)) {
        status("저장 결과를 확인할 때까지 작업 중인 문제지의 편집을 잠급니다. 출력과 작업 백업은 사용할 수 있습니다.", true);
        return;
      }
      if (a === "assignment-status") {
        await openRecentAssignmentStatus(b.dataset.assignment);
        return;
      }
      if (a === "library-reload") {
        render();
        return;
      }
      if (a === "recent-retry") {
        await loadRecent().catch(() => false);
        return;
      }
      if (a === "recent-toggle-cancelled") {
        state.recentShowCancelled = !state.recentShowCancelled;
        updateRecentResults();
        return;
      }
      if (a === "assignment-cancel") {
        askCancelAssignment(b.dataset.assignment);
        return;
      }
      if (a === "assignment-cancel-confirm") {
        b.disabled = true;
        const done = await cancelRecentAssignment(b.dataset.assignment);
        if (!done) b.disabled = false;
        return;
      }
      if (a === "recent-open-saved") {
        // 출제 내역 row made from a saved paper: back to that paper in 보관함.
        invalidateRecentRequests();
        showSavedPaper(b.dataset.paperId);
        return;
      }
      if (a === "assignment-output-direct") {
        await openAssignmentOutput(b.dataset.assignment, b.dataset.mode || "exam");
        return;
      }
      if (a === "assignment-output") {
        await openAssignmentOutput(state.openAssignment.assignment.id, b.dataset.mode);
        return;
      }
      if (a === "assignment-pdf") {
        const assignmentId = String(b.dataset.assignment || "");
        if (!assignmentId || recentPdfRetryIds.has(assignmentId)) return;
        recentPdfRetryIds.add(assignmentId);
        b.disabled = true;
        const retryAuthority = pdfRetryAuthority(assignmentId);
        const receipt = state.originalReceipts?.find((row) => row.id === assignmentId);
        try {
          if (receipt) {
            try {
              const result = await api(
                "/class-exam-assignments/" + assignmentId + "/pdf",
                {},
              );
              advanceRecentPdfMutationVersion(assignmentId);
              receipt.pdfStatus = result.assignment?.pdf_status || "pending";
              receipt.pdfError = result.assignment?.pdf_error || result.error || "";
            } catch (error) {
              receipt.pdfStatus = "pending";
              receipt.pdfError = error.message || "PDF를 다시 준비하지 못했습니다.";
              if (state.view === retryAuthority.view && $("modal")?.open)
                status("출제는 완료되어 있습니다. PDF만 다시 준비해 주세요.", true);
            }
            return;
          }
          let pdfResult;
          try {
            pdfResult = await api(
              "/class-exam-assignments/" + assignmentId + "/pdf",
              {},
            );
            advanceRecentPdfMutationVersion(assignmentId);
          } catch (error) {
            if (isCurrentPdfRetryAuthority(retryAuthority)) {
              applyRecentPdfMutationResult(assignmentId, {
                assignment: { pdf_status: "failed", pdf_error: error.message || "PDF를 다시 준비하지 못했습니다." },
              }, retryAuthority);
              status("출제는 완료되어 있습니다. PDF만 다시 준비해 주세요.", true);
            }
            return;
          }
          applyRecentPdfMutationResult(assignmentId, pdfResult, retryAuthority);
          try {
            if (isCurrentPdfRetryAuthority(retryAuthority))
              await assignmentStatus(assignmentId);
          } catch (error) {
            if (isCurrentAuthorityError(error) && isCurrentPdfRetryAuthority(retryAuthority))
              status("PDF 상태는 저장되었습니다. 학생별 확인 화면만 새로고침하지 못했습니다.", true);
          }
        } finally {
          recentPdfRetryIds.delete(assignmentId);
          b.disabled = false;
          if (receipt) {
            if (state.originalReceipts?.includes(receipt) && $("modal")?.open)
              renderOriginalReceipts();
          } else {
            if (isCurrentPdfRetryAuthority(retryAuthority)) updateRecentResults();
            if (retryAuthority.modalWasOpen && isCurrentPdfRetryAuthority(retryAuthority))
              renderAssignmentStatus(state.openAssignment, assignmentId);
          }
        }
        return;
      }
      if (a === "recover-part") {
        state.previewIndex = Number(b.dataset.part);
        state.questionListOpen = true;
        if ($("question-list")) $("question-list").open = true;
        state.inspector = "header";
        render();
        return;
      }
      if (
        state.receipts.length &&
        [
          "compose-grade",
          "compose-subject",
          "count-step",
          "scope-all",
          "scope-clear",
          "scope-range",
          "scope-group",
          "bucket",
          "bucket-all",
          "source-toggle",
          "sources-clear",
          "uid-route-clear",
          "targets-clear",
        ].includes(a)
      )
        throw new Error(
          "이미 출제한 문제지를 보존하려면 남은 문제지의 문항을 교체해 주세요. 범위나 대상을 바꾸려면 새 작업을 시작하세요.",
        );
      if (["generate", "rebuild", "assign", "print"].includes(a) && state.busy)
        return;
      if (a === "close-dialog") {
        if (state.view === "recent" && state.recentSelectedAssignmentId) {
          state.assignmentStatusLoadVersion++;
          invalidateRecentRequests();
          if (history.state?.archive2RecentSelection) history.back();
          else {
            state.recentSelectedAssignmentId = "";
            replaceUrlState();
            $("modal").close();
          }
        } else if (!originalIssueBusy()) $("modal").close();
      } else if (a === "home-product") {
        const product = HOME_PRODUCT_REGISTRY.find(
          (item) => item.productKey === b.dataset.productKey,
        );
        if (
          !product?.availability ||
          typeof product.routeResolver !== "function"
        )
          return;
        const target = product.routeResolver();
        if (target && !state.catalog && openRouteInPage(target)) return;
        if (target) location.href = String(target);
      } else if (a === "quick-unit") {
        await openQuickAssessment([b.dataset.unitKey]);
      } else if (a === "quick-open-all") {
        await openQuickAssessment("all");
      } else if (a === "quick-open-selected") {
        await openQuickAssessment([...quickState.bundle]);
      } else if (a === "quick-grade") {
        quickState.grade = b.dataset.grade || "";
        quickState.subject = "";
        quickState.bundle.clear();
        replaceUrlState();
        render();
      } else if (a === "quick-subject") {
        quickState.subject = b.dataset.subject || "";
        quickState.bundle.clear();
        replaceUrlState();
        render();
      } else if (a === "home-school" || a === "home-all-schools") {
        // A school chip searches that school by name (the same search the box runs); 전체 학교 opens everything.
        rememberCurrentHistoryEntry();
        state.sources = [];
        const school = a === "home-school" ? b.dataset.school || "" : "";
        state.find = school ? { query: school, material: "exam" } : { material: "exam" };
        state.view = "find";
        state.page = 0;
        urlState();
        render();
        window.scrollTo(0, 0);
      } else if (a === "home-search") {
        rememberCurrentHistoryEntry();
        const query = $("archive-home-query")?.value.trim() || "";
        state.find = query ? { query, material: "exam" } : { material: "exam" };
        state.view = "find";
        state.page = 0;
        urlState();
        render();
        window.scrollTo(0, 0);
      } else if (a === "go-compose") {
        rememberCurrentHistoryEntry();
        const sources = b.dataset.useSources === "true" ? state.sources.slice() : [];
        if (state.selected.length || state.receipts.length || state.sealed) newDraft();
        state.sources = sources;
        state.buckets = [];
        state.custom = {};
        state.view = "compose";
        state.filters = { school: "", ...state.find };
        delete state.filters.similarOnly; // a finder-only choice, not a compose condition
        let findSubject = state.find.semanticSubject || "";
        if (!state.filters.grade) {
          // A subject chosen without a grade opens compose on the grade that teaches it.
          const subject = findSubject || Unified?.subjectForFamily?.(state.find.family) || "";
          state.filters.grade = /^COMMON_MATH_/.test(subject) ? "고1"
            : ["ALGEBRA", "PROB_STATS"].includes(subject) ? "고2"
            : subject ? "고3" : "고1";
          findSubject = subject;
        }
        if (C.hasSubjectProjection?.(state.find.grade)) {
          state.filters.semanticSubject = findSubject;
          state.filters.courseKey = "";
          state.filters.family = "";
        } else if (findSubject) {
          state.filters.semanticSubject = findSubject;
          state.filters.courseKey = "";
          state.filters.family = "";
        } else {
          state.filters.semanticSubject = "";
          state.filters.family = "";
          if (state.find.courseKey) state.filters.courseKey = state.find.courseKey;
        }
        if (unifiedIndex()) {
          // A finder curriculum choice is a search aid, not a compose restriction: compose
          // starts from the unified list (original curriculum "전체").
          state.filters.curriculumKey = "";
          state.filters.originalCurriculum = "";
          state.filters = withDefaultComposeSubject(reconcileUnifiedFilters(state.filters));
        } else
          state.filters = C.reconcileFinderFilters(
            state.filters,
            state.catalog.taxonomy,
          );
        state.scopeNotice = "";
        state.sources = state.sources.filter(file => state.catalog.records.some(record =>
          record.sourceFile === file && C.browseGradeMatchesRecord(
            record,
            state.filters.grade,
            state.catalog.projectionPolicy,
          )));
        if (!state.receipts.length && !state.sealed)
          reconcileFinderSchool(state.filters);
        state.scopes = [];
        delete state.filters.L3;
        delete state.filters.L4;
        for (const key of META_FACET_FILTERS) state.filters[key] = "";
        urlState();
        render();
      } else if (a === "finder-search") {
        state.find.query = $("finder-query")?.value || "";
        state.page = 0;
        urlState();
        render();
      } else if (a === "finder-axis-quick") {
        const axis = b.dataset.axis;
        state.find.axis = axis === state.find.axis ? "" : axis;
        state.page = 0;
        urlState();
        render();
        document.querySelector(`[data-action="finder-axis-quick"][data-axis="${axis}"]`)?.focus?.({ preventScroll: true });
      } else if (a === "finder-grade") {
        // Same effect as choosing the grade in the old select; pressing the chosen grade again clears it.
        const grade = b.dataset.grade || "";
        state.find.grade = state.find.grade === grade ? "" : grade;
        applyFinderFilterChange("grade");
        render();
        document.querySelector(`[data-action="finder-grade"][data-grade="${grade}"]`)?.focus?.({ preventScroll: true });
      } else if (a === "similar-list") {
        openSimilarList(state.catalog.exams[Number(b.dataset.exam)]);
      } else if (a === "finder-reset") {
        for (const key of [
          "curriculumKey",
          "courseKey",
          "semanticSubject",
          "school",
          "axis",
          "yearFrom",
          "yearTo",
          "family",
          "query",
          "grade",
          "similarOnly",
        ])
          state.find[key] = "";
        state.page = 0;
        urlState();
        render();
      } else if (a === "page-prev") {
        state.page = Math.max(0, state.page - 1);
        urlState();
        render();
        window.scrollTo(0, 0);
        window.scrollTo(0, 0);
      } else if (a === "material") {
        state.find.material = b.dataset.material;
        reconcileFinderSchool(state.find);
        state.page = 0;
        urlState();
        render();
      } else if (a === "page-next") {
        state.page++;
        urlState();
        render();
        window.scrollTo(0, 0);
        window.scrollTo(0, 0);
      } else if (a === "source-toggle") {
        const f = state.catalog.exams[Number(b.dataset.exam)].file;
        state.sources = state.sources.includes(f)
          ? state.sources.filter((x) => x !== f)
          : [...state.sources, f];
        invalidate();
        render();
      } else if (a === "source-issue") {
        rememberRecentExam(recentTarget(state.catalog.exams[Number(b.dataset.exam)]));
        openOriginalAssign(state.catalog.exams[Number(b.dataset.exam)]);
      } else if (a === "source-output-direct") {
        rememberRecentExam(recentTarget(state.catalog.exams[Number(b.dataset.exam)]));
        await openFinderOutput(state.catalog.exams[Number(b.dataset.exam)], b.dataset.mode || "exam");
      } else if (a === "original-print") {
        await originalPrint();
      } else if (a === "original-review" || a === "original-targets") {
        setOriginalStep(a === "original-review" ? "review" : "targets");
      } else if (a === "sources-clear") {
        state.sources = [];
        invalidate();
        render();
      } else if (a === "uid-route-clear") {
        invalidate();
        clearUidRoute();
        render();
      } else if (
        a === "scope-all" ||
        a === "scope-clear" ||
        a === "scope-group" ||
        a === "scope-range"
      ) {
        if (state.sealed) return;
        const scopes = displayedScopes || scopeOptions();
        if (a === "scope-clear") state.scopes = [];
        else if (a === "scope-all") state.scopes = scopes.filter(s => s.basicScope).map((s) => s.key);
        else if (a === "scope-group") {
          const g = unique(scopes.map((s) => s.L1))[
            Number(b.dataset.groupIndex)
          ];
          state.scopes = unique([
            ...state.scopes,
            ...scopes.filter((s) => s.L1 === g &&
              s.basicScope === (b.dataset.scopeKind !== "detail")).map((s) => s.key),
          ]);
        } else {
          const from = Number($("scope-start").value),
            to = Number($("scope-end").value);
          if (from > to)
            throw new Error("끝 단원은 시작 단원 뒤에 있어야 합니다.");
          state.scopes = scopes.slice(from, to + 1).filter(s => s.basicScope && !s.unclassified).map((s) => s.key);
        }
        invalidate();
        render();
      } else if (a === "bucket" || a === "bucket-all") {
        const n = Number(b.dataset.bucket),
          row = b.dataset.row;
        const values = row
          ? state.custom[row]?.buckets || state.buckets
          : state.buckets;
        const next = a === "bucket-all" ? [] : values.includes(n)
          ? values.filter((v) => v !== n)
          : [...values, n].sort();
        if (row) state.custom[row] = { ...state.custom[row], buckets: next };
        else state.buckets = next;
        invalidate();
        render();
      } else if (a === "generate" || a === "rebuild") generate(a === "rebuild");
      else if (a === "compose-grade" || a === "compose-subject") {
        if (state.sealed) return;
        const filter = a === "compose-grade" ? "grade" : "semanticSubject";
        const value = a === "compose-grade" ? b.dataset.grade : b.dataset.subject;
        if (String(state.filters[filter] || "") === String(value ?? "")) return;
        changeComposeFilter(filter, value ?? "");
        // 다시 그린 뒤에도 키보드 위치가 그 버튼에 남게 한다.
        document.querySelector(`[data-action="${a}"][data-${a === "compose-grade" ? "grade" : "subject"}="${value ?? ""}"]`)?.focus?.({ preventScroll: true });
      } else if (a === "count-step") {
        stepComposeCount(Number(b.dataset.step));
      } else if (a === "preview-toggle") {
        state.previewOpen = !state.previewOpen;
        render();
      } else if (a === "save-and-assign") {
        await saveAndAssign();
      } else if (a === "pin") {
        if (lockedIndex(Number(b.dataset.index))) return;
        const uid = state.selected[Number(b.dataset.index)].questionUid;
        state.pins = state.pins.includes(uid)
          ? state.pins.filter((x) => x !== uid)
          : [...state.pins, uid];
        scheduleSave();
        renderControls();
      } else if (a === "pin-all" || a === "pin-clear") {
        if (state.sealed) return;
        const currentPart = state.selected
          .filter(
            (r, i) =>
              Parts.partIndex(i) === state.previewIndex && !lockedIndex(i),
          )
          .map((r) => r.questionUid);
        state.pins =
          a === "pin-all"
            ? unique([...state.pins, ...currentPart])
            : state.pins.filter((uid) => !currentPart.includes(uid));
        scheduleSave();
        renderControls();
      } else if (a === "replace") replace(Number(b.dataset.index));
      else if (a === "candidate-use")
        replaceWith(candidateRecords[Number(b.dataset.candidate)]);
      else if (a === "candidate-preview") {
        const r = candidateRecords[Number(b.dataset.candidate)];
        const url = O.engineUrl("engine.html", location.href);
        url.searchParams.set("data", "exams/" + r.sourceFile);
        window.open(url.href, "_blank");
      } else if (a === "undo") {
        const change = state.undo.at(-1);
        if (!change) return;
        if (lockedIndex(change.index)) return;
        const next = state.selected.slice();
        next[change.index] = change.before;
        const r = C.review(next, request(true), ownHistoryContext());
        if (r.status === "HARD_BLOCK")
          throw new Error(r.hardFailures.join(" "));
        state.undo.pop();
        state.selected = next;
        if (change.wasPinned)
          state.pins = state.pins.map((uid) =>
            uid === change.after.questionUid ? change.before.questionUid : uid,
          );
        state.prepared = [];
        scheduleSave();
        render();
      } else if (a === "output-mode") {
        state.outputMode = b.dataset.mode;
        render();
      } else if (a === "targets") await targets();
      else if (a === "target-all")
        $("target-roster")
          .querySelectorAll("input[type=checkbox]")
          .forEach((i) => {
            i.checked = true;
          });
      else if (a === "target-apply") {
        if (rosterLoading) {
          status("학생 명단을 불러오는 중입니다. 잠시 뒤 다시 눌러 주세요.", true);
          return;
        }
        state.classId = $("target-class").value;
        const selected = [
          ...$("target-roster").querySelectorAll("input:checked"),
        ].map((i) => rosterRows[Number(i.dataset.targetIndex)]);
        state.studentIds = selected.map((s) => s.id);
        state.studentLabels = selected.map((s) => s.name);
        $("modal").close();
        scheduleSave();
        await refreshHistory();
      } else if (a === "targets-clear") {
        if (state.sealed) return;
        state.studentIds = [];
        state.studentLabels = [];
        state.classId = "";
        scheduleSave();
        await refreshHistory();
      } else if (a === "history-refresh") await refreshHistory();
      else if (a === "saved-output") await window.Archive2Library.openOutput(
        b.dataset.paperId,
        b.dataset.mode || "exam",
      );
      else if (a === "saved-paper-issue") await openSavedPaperAssign(b.dataset.paperId);
      else if (a === "saved-paper-view") showSavedPaper(b.dataset.paperId);
      else if (a === "print") await print();
      else if (a === "save-paper") await savePapers();
      else if (a === "assign") await assign();
      else if (a === "next-round") {
        if (!state.sealed) return;
        state.rounds.push({
          roundNo: state.round,
          questionUids: state.selected.map((r) => r.questionUid),
        });
        state.round++;
        state.issueDate = "";
        state.composeShortage = [];
        state.composeStale = false;
        state.composeNotice = "";
        state.selected = [];
        state.pins = [];
        state.rows = [];
        state.sealed = false;
        state.prepared = [];
        state.receipts = [];
        state.undo = [];
        state.ackWarnings = false;
        state.previewIndex = 0;
        state.historyReady = false;
        save();
        render();
        if (state.studentIds.length) await refreshHistory();
      } else if (a === "backup") {
        save();
        download(draft(), `archive2-${state.draftId}.json`);
      } else if (a === "import") $("import-file").click();
      else if (a === "restore") {
        $("modal").close();
        applyDraft(drafts()[Number(b.dataset.draft)]);
      } else if (a === "delete-draft") askDeleteDraft(b.dataset.draftId);
      else if (a === "delete-draft-confirm") deleteDraft(b.dataset.draftId);
      else if (a === "new-draft") newDraft();
      else if (a === "health-export")
        download(
          {
            indexVersion: state.catalog.indexVersion,
            health: state.catalog.health,
            issues: state.catalog.records
              .filter((r) => !r.automatic)
              .map((r) => ({
                questionUid: r.questionUid,
                sourceFile: r.sourceFile,
                sourceOrdinal: r.sourceOrdinal,
                reasons: C.eligibility(r, state).reasons,
              })),
          },
          "archive2-health.json",
        );
    } catch (e) {
      if (isCurrentAuthorityError(e)) status(e.message, true);
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.id !== "archive-home-search") return;
    event.preventDefault();
    rememberCurrentHistoryEntry();
    const query = $("archive-home-query")?.value.trim() || "";
    state.find = query ? { query, material: "exam" } : { material: "exam" };
    state.view = "find";
    state.page = 0;
    urlState();
    render();
    window.scrollTo(0, 0);
  });
  document.addEventListener("change", async (event) => {
    if (state.saveResultState === "RESULT_UNKNOWN") {
      // Acknowledging the warnings only unlocks local output; it does not edit the paper.
      if (event.target.id === "ack-warnings-recovery") {
        state.ackWarnings = event.target.checked;
        refreshComposeSaveContinuity();
        return;
      }
      render();
      return;
    }
    if (state.busy) return;
    const el = event.target;
    try {
      if (isQuickAssessmentView() && el.id === "five-minute-level") {
        quickState.presets[state.view] = quickProduct().order[Number(el.value)] || "standard";
        render();
        return;
      }
      if (isQuickAssessmentView() && el.dataset.quickBundle) {
        if (el.checked) quickState.bundle.add(el.dataset.quickBundle);
        else quickState.bundle.delete(el.dataset.quickBundle);
        render();
        return;
      }
      if (el.dataset.outputField) {
        changeOutput(el);
        return;
      }
      if (el.id === "recent-class") {
        if (state.view !== "recent") return;
        state.recentClassId = el.value;
        updateRecentResults();
        replaceUrlState();
        scheduleRecentRefetch();
        return;
      }
      if (el.dataset.recentFilter) {
        changeRecentFilter(el);
        return;
      }
      if (
        state.receipts.length &&
        (el.dataset.group === "compose" ||
          el.dataset.scope ||
          el.dataset.rowCount ||
          ["count", "distribution", "history-mode"].includes(el.id))
      ) {
        render();
        throw new Error(
          "출제한 문제지는 보존됩니다. 남은 문제지의 문항을 수정해 주세요.",
        );
      }
      if (el.dataset.filter) {
        const value = el.type === "checkbox" ? (el.checked ? "1" : "") : el.value;
        if (el.dataset.group === "compose") {
          changeComposeFilter(el.dataset.filter, value);
          return;
        }
        state.find[el.dataset.filter] = value;
        applyFinderFilterChange(el.dataset.filter);
        if (el.dataset.group === "find") {
          scheduleFinderFilterRender();
          return;
        }
        render();
      } else if (el.dataset.scope) {
        const scope = (displayedScopes || scopeOptions()).find((item) => item.key === el.dataset.scope);
        const legacyPaths = scope?.unified ? [] : scope?.paths || [];
        state.scopes = el.checked
          ? [
              ...state.scopes.filter((x) => !legacyPaths.includes(x)),
              el.dataset.scope,
            ]
          : state.scopes.filter(
              (x) => x !== el.dataset.scope && !legacyPaths.includes(x),
            );
        state.scopeNotice = "";
        invalidate();
        render();
      } else if (el.id === "distribution" || el.id === "count") {
        state[el.id] = el.id === "count" ? Number(el.value) : el.value;
        invalidate();
        render();
      } else if (el.dataset.rowCount) {
        state.custom[el.dataset.rowCount] = {
          ...state.custom[el.dataset.rowCount],
          count: Number(el.value),
        };
        invalidate();
        render();
      } else if (el.id === "history-mode") {
        state.historyMode = ["90", "30"].includes(el.value)
          ? "recent"
          : el.value;
        state.recentDays = Number(el.value) || 90;
        scheduleSave();
        await refreshHistory();
      } else if (el.id === "original-qpp") {
        const value = Number(el.value);
        localStorage.setItem("APMATH_ARCHIVE2_ORIGINAL_QPP", String(value));
        $("original-issue-frame")?.contentWindow?.setArchive2OriginalQpp?.(
          value,
        );
      } else if (el.id === "target-class") await loadRoster(el.value);
      else if (el.id === "qpp") {
        if (state.sealed) return;
        state.qpp = Number(el.value);
        state.prepared = [];
        scheduleSave();
        updatePreview();
      } else if (el.id === "preview-index") {
        state.previewIndex = Number(el.value);
        render();
      } else if (el.id === "ack-warnings") {
        state.ackWarnings = el.checked;
        render();
      } else if (el.id === "import-file" && el.files[0]) {
        if (el.files[0].size > 1000000)
          throw new Error("작업 파일이 너무 큽니다.");
        applyDraft(JSON.parse(await el.files[0].text()));
        save();
        el.value = "";
      }
    } catch (e) {
      status(e.message, true);
    }
  });
  document.addEventListener("input", (event) => {
    if (!isQuickAssessmentView() || event.target.id !== "five-minute-level") return;
    const preset = quickProduct().order[Number(event.target.value)] || "standard";
    const label = Quick.PRESET_LABELS[preset] || "기본";
    event.target.setAttribute("aria-valuetext", label);
    const current = $("five-minute-level-current");
    if (current) current.textContent = label;
    const mix = $("quick-assessment-mix");
    if (mix) mix.textContent = Quick.presetMix(quickProduct(), preset);
  });
  document.addEventListener("input", (event) => {
    if (state.saveResultState === "RESULT_UNKNOWN") {
      // The warning checkbox of the recovery area fires input before change. Re-rendering here
      // would replace it, so its change event would never reach the handler.
      if (event.target.id === "ack-warnings-recovery") return;
      render();
      return;
    }
    if (event.target.dataset.recentFilter === "query") {
      if (state.view !== "recent") return;
      if (event.isComposing) {
        invalidateRecentRequests();
        updateRecentResults();
      } else changeRecentFilter(event.target);
      return;
    }
    const el = event.target;
    if (el.dataset.outputField) {
      changeOutput(el);
      return;
    }
    if (el.id === "count" && !state.busy && !state.receipts.length) {
      state.count = Number(el.value);
      composeCountChanged();
      return;
    }
    if (!el.dataset.header || state.sealed || state.busy) return;
    state.header[el.dataset.header] =
      el.type === "checkbox" ? el.checked : el.value;
    if (el.dataset.header === "title") {
      state.title = el.value;
      const heading = document.querySelector(".intro h1");
      if (heading?.firstChild)
        heading.firstChild.textContent = state.title + " ";
    }
    state.prepared = [];
    scheduleSave();
    clearTimeout(previewTimer);
    previewTimer = setTimeout(updatePreview, 600);
  });
  // 출력 설정 접힘은 다시 그려도 유지한다(열림 여부를 state에 기억).
  document.addEventListener("toggle", (event) => {
    const target = event.target;
    if (target?.matches?.("[data-cz-output]")) state.outputSettingsOpen = Boolean(target.open);
    else if (target?.matches?.("[data-scope-group]")) state.scopeGroupOpen[target.dataset.scopeGroup] = Boolean(target.open);
  }, true);
  function changeOutput(el) {
    if (state.busy) return;
    if (
      el.closest("[data-output-settings]")?.dataset.outputSettings ===
      "original"
    ) {
      if (originalIssueBusy() || state.originalReceipts?.length) return;
      state.originalSettings = O.read(el, state.originalSettings);
      $("original-issue-frame")?.contentWindow?.setArchive2OriginalSettings?.(
        state.originalSettings,
      );
      clearTimeout(previewTimer);
      previewTimer = setTimeout(updateOriginalPreview, 450);
    } else {
      if (state.sealed || Parts.receipt(state.receipts, state.previewIndex))
        return;
      const s = O.read(el, state);
      Object.assign(state, {
        header: s.header,
        qpp: s.qpp,
        includeQr: s.includeQr,
      });
      state.title = s.header.title;
      state.prepared = [];
      scheduleSave();
      refreshComposeSaveContinuity();
      clearTimeout(previewTimer);
      previewTimer = setTimeout(updatePreview, 450);
    }
  }
  document.addEventListener("compositionstart", (event) => {
    if (event.target.dataset.recentFilter === "query" && state.view === "recent") {
      invalidateRecentRequests();
      updateRecentResults();
    }
  });
  document.addEventListener("compositionend", (event) => {
    if (event.target.dataset.recentFilter === "query") changeRecentFilter(event.target);
  });
  document.addEventListener("keydown", (event) => {
    if (
      state.busy ||
      event.isComposing ||
      event.key !== "Enter" ||
      event.target.id !== "finder-query"
    )
      return;
    event.preventDefault();
    state.find.query = event.target.value;
    state.page = 0;
    urlState();
    render();
  });
  // The "과목 · 학교 · 연도" fold stays open across the re-render a filter change causes.
  document.addEventListener("toggle", (event) => {
    if (event.target?.classList?.contains("find-more")) state.findMoreOpen = event.target.open;
  }, true);
  window.addEventListener("message", (event) => {
    const frame = $("original-issue-frame");
    const savedPaperFrame = $("saved-paper-issue-frame");
    const fromOriginalFrame = Boolean(frame && event.source === frame.contentWindow);
    const fromSavedPaperFrame = Boolean(savedPaperFrame && event.source === savedPaperFrame.contentWindow);
    if (
      event.origin !== location.origin ||
      (!fromOriginalFrame && !fromSavedPaperFrame)
    )
      return;
    if (event.data?.type === "archive2-original-close") {
      $("modal").classList.remove("original-issue-dialog", "saved-paper-issue-dialog");
      $("modal").close();
      return;
    }
    if (fromOriginalFrame && event.data?.type === "archive2-original-ready") {
      frame.contentWindow.setArchive2OriginalSettings?.(state.originalSettings);
      const exam = state.originalExam;
      const sourceHash = exam && new Map(state.catalog.sourceHashes).get(exam.file);
      if (exam && sourceHash)
        frame.contentWindow.setArchive2OriginalSource?.({
          file: exam.file,
          sourceHash,
          identityTitle: exam.identityTitle || exam.file.split("/").pop().replace(/\.js$/, ""),
        });
    }
    if ((fromOriginalFrame || fromSavedPaperFrame) && event.data?.type === "archive2-original-saved") {
      const a = event.data.assignment;
      state.originalReceipts = (state.originalReceipts || []).filter(
        (r) => r.id !== a.id,
      );
      state.originalReceipts.push({
        id: a.id,
        classId: String(event.data.classId || a.class_id || ""),
        className: String(event.data.className || "선택한 반"),
        pdfStatus: String(a.pdf_status || "pending"),
        pdfError: String(event.data.pdfFailure || a.pdf_error || ""),
      });
      $("modal")
        .querySelectorAll(
          "[data-output-settings] input,[data-output-settings] select",
        )
        .forEach((el) => (el.disabled = true));
      renderOriginalReceipts();
    }
    if ((fromOriginalFrame || fromSavedPaperFrame) && event.data?.type === "archive2-original-complete") {
      const receiptCount = Number(event.data.receiptCount);
      if (
        $("original-review").hidden &&
        Number.isInteger(receiptCount) &&
        receiptCount > 0 &&
        state.originalReceipts?.length === receiptCount
      ) {
        if (fromSavedPaperFrame)
          document.querySelector('[data-action="original-review"]')?.removeAttribute("disabled");
        setOriginalStep("review");
      }
    }
  });
  $("modal").addEventListener?.("close", () => {
    state.assignmentStatusLoadVersion++;
    if (state.view === "recent") updateRecentResults();
    // An issue made from a 보관함 row shows up in that row's history without a reload.
    if (state.view === "saved" && state.originalReceipts?.length) {
      state.originalReceipts = [];
      window.Archive2Library?.refreshHistory?.();
    }
  });
  $("modal").addEventListener("cancel", (event) => {
    if (originalIssueBusy()) event.preventDefault();
    else if (state.view === "recent" && state.recentSelectedAssignmentId) {
      event.preventDefault();
      state.assignmentStatusLoadVersion++;
      invalidateRecentRequests();
      if (history.state?.archive2RecentSelection) history.back();
      else {
        state.recentSelectedAssignmentId = "";
        replaceUrlState();
        $("modal").close();
      }
    }
  });
  window.addEventListener("pagehide", save);
  // A login made in another tab: coming back to a login notice shows the real screen.
  function resumeAfterLogin() {
    if (document.hidden || !document.querySelector?.("[data-login-notice]") || !teacherSessionOk()) return;
    render();
    if (state.view === "recent") loadRecent().catch(() => false);
  }
  document.addEventListener("visibilitychange", resumeAfterLogin);
  window.addEventListener("storage", (event) => { if (!event.key || event.key === "APMATH_SESSION") resumeAfterLogin(); });
  window.addEventListener("popstate", async () => {
    // 반에 출제 패널이 열려 있으면 뒤로 가기는 패널이 처리한다(진행 중이면 막고, 아니면 패널만 닫는다).
    if (window.Archive2Assign?.handlePopState?.()) return;
    state.assignmentStatusLoadVersion++;
    const previousSelection = state.recentSelectedAssignmentId;
    readUrl();
    syncUidRoute();
    if ($("modal")?.open && previousSelection !== state.recentSelectedAssignmentId)
      $("modal").close();
    render();
    if (state.view === "recent") {
      const selectedAssignmentId = state.recentSelectedAssignmentId;
      try {
        const loaded = await loadRecent();
        if (loaded && selectedAssignmentId && state.view === "recent" &&
          state.recentSelectedAssignmentId === selectedAssignmentId)
          await assignmentStatus(selectedAssignmentId);
      } catch (e) { if (isCurrentAuthorityError(e)) status(e.message, true); }
    }
    restoreCurrentHistoryScroll();
  });
  function readUrl() {
    const p = new URLSearchParams(location.search);
    const requestedRecipe = p.get("recipe");
    const nextRecipe = ASSESSMENT_RECIPE_KEYS.has(requestedRecipe) ? requestedRecipe : "";
    const recipeChanged = nextRecipe !== state.assessmentRecipe;
    state.assessmentRecipe = nextRecipe;
    if (recipeChanged && ASSESSMENT_RECIPE_KEYS.has(nextRecipe)) {
      const recipe = activeAssessmentRecipe();
      const title = ASSESSMENT_RECIPE_TITLES[nextRecipe] || "";
      state.distribution = "pool";
      state.count = recipe?.defaultCount || 4;
      state.title = title;
      state.header.title = title;
      state.header.subtitle = "";
      state.sources = [];
      state.scopes = [];
      state.buckets = [];
      state.selected = [];
      state.rows = [];
    }
    state.view = ["home", "find", "compose", "saved", "recent", "health", "five-minute", "subunit-test", "unit-test", "monthly-test"].includes(p.get("view"))
      ? p.get("view")
      : "home";
    if (isQuickAssessmentView()) {
      const grade = p.get(QUICK_URL_KEYS.grade) || "";
      quickState.grade = Unified?.GRADES.includes(grade) ? grade : "";
      quickState.subject = quickState.grade ? p.get(QUICK_URL_KEYS.subject) || "" : "";
      quickState.bundle.clear();
    }
    state.savedPaperId = p.get("paper_id") || "";
    state.savedLibraryStatusFilter = ["ACTIVE", "ARCHIVED", "TRASHED"].includes(p.get("status"))
      ? p.get("status") : "ACTIVE";
    state.editSavedPaperId = p.get("edit_saved_paper") || "";
    state.urlSources = [...new Set(p.getAll("source").map((value) => String(value || "").trim()).filter(Boolean))];
    state.urlRange = p.get("range") === "all" ? "all" : "";
    state.urlUids = [...new Set(p.getAll("uid").map((value) => String(value || "").trim()).filter(Boolean))];
    state.find = {};
    // Finder / 출제 내역 filters are never read from a quick-assessment URL.
    const quickRoute = isQuickAssessmentView();
    for (const k of FINDER_URL_KEYS)
      if (!quickRoute && p.has(k)) state.find[k] = p.get(k);
    if (!quickRoute && state.view === "find") {
      if (state.find.material === "all") state.find.material = "";
      else applyDefaultFinderMaterial();
    }
    const requestedPage = Number.parseInt(p.get("page") || "0", 10);
    state.page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 0;
    state.recentFilters = Object.fromEntries(
      RECENT_URL_KEYS.map((key) => [key, quickRoute ? "" : p.get(key) || ""]),
    );
    state.recentClassId = p.get("class") || "";
    state.recentSelectedAssignmentId = p.get("assignment_id") || "";
    if (state.catalog?.taxonomy) {
      const before = JSON.stringify(state.find);
      Object.assign(state.find, reconcileFinderFilters(state.find));
      if (state.view === "find" && before !== JSON.stringify(state.find))
        replaceFinderUrlState();
    }
  }
  function replaceFinderUrlState() {
    if (state.view !== "find") return;
    history.replaceState(history.state || {}, "", routeUrl());
  }
  // S9: compose restricted to exactly the questions named by repeated `uid` URL parameters
  // (Meta search page -> "선택한 문항으로 문제지 만들기"). The restriction reuses the
  // scopeQuestionUids machinery: one fixed scope whose UID list is the request. Unknown or
  // technically unusable UIDs (identity / source reference / unit placement) and selections that
  // cannot form one paper fail closed with a visible message; nothing is selected silently.
  const UID_ROUTE_SCOPE_KEY = "uid-selection";
  const UID_ROUTE_MAX = 400;
  const UID_ROUTE_REASONS = Object.freeze({
    UNKNOWN_UID: "현재 아카이브 목록에 없는 문항입니다.",
    IDENTITY: "문항 식별 정보를 확인할 수 없습니다.",
    SOURCE: "원본 파일 연결을 확인할 수 없습니다.",
    NO_UNIT_PLACEMENT: "학년·단원 위치를 확인할 수 없습니다.",
  });
  function resolveUidRoute(requested) {
    const index = unifiedIndex();
    const route = { requested: [...requested], records: [], rejected: [], error: "", grade: "", scopes: [], entries: [] };
    if (requested.length > UID_ROUTE_MAX) {
      route.error = `한 번에 ${UID_ROUTE_MAX}문항까지만 선택할 수 있습니다. (요청 ${requested.length}문항)`;
      return route;
    }
    for (const uid of requested) {
      const record = state.byUid?.get(uid);
      if (!record) { route.rejected.push({ uid, reason: "UNKNOWN_UID" }); continue; }
      const check = workspaceEligibility(record);
      if (!check.ok) {
        route.rejected.push({ uid, reason: check.reasons?.includes("identity") ? "IDENTITY" : "SOURCE" });
        continue;
      }
      const entry = index ? index.byUid.get(uid) : null;
      if (index && !entry) { route.rejected.push({ uid, reason: "NO_UNIT_PLACEMENT" }); continue; }
      route.records.push(record);
      route.entries.push(entry);
    }
    if (route.rejected.length) {
      route.error = `요청한 ${requested.length}문항 중 ${route.rejected.length}문항을 사용할 수 없어 문제지를 만들지 않았습니다.`;
      route.records = [];
      route.entries = [];
      return route;
    }
    // One paper is one grade (the plan validator and the selection matcher both require it).
    let grades = null;
    route.records.forEach((record, i) => {
      const views = route.entries[i]?.views ||
        [record.effectiveBrowseGrade || record.sourceGrade || record.grade].filter(Boolean);
      grades = grades ? grades.filter((grade) => views.includes(grade)) : [...views];
    });
    if (!grades?.length) {
      route.error = "선택한 문항이 서로 다른 학년에 걸쳐 있어 한 문제지로 만들 수 없습니다. 학년별로 나누어 선택해 주세요.";
      route.records = [];
      route.entries = [];
      return route;
    }
    const primary = route.entries[0]?.grade;
    route.grade = grades.includes(primary) ? primary : grades[0];
    const uids = route.records.map((record) => record.questionUid);
    route.scopes = [{
      key: UID_ROUTE_SCOPE_KEY,
      L1: "선택한 문항",
      L2: `선택한 문항 ${uids.length}개`,
      label: `선택한 문항 ${uids.length}개`,
      fullLabel: `선택한 문항 ${uids.length}개`,
      basicScope: true,
      unified: true,
      unclassified: false,
      paths: unique(route.records.map((record) => C.generalPathKey(record))),
      scopeQuestionUids: uids,
      facetQuestionUids: uids,
      count: uids.length,
      eligibleCount: uids.length,
      supplemental: false,
    }];
    return route;
  }
  function applyUidRoute() {
    if (state.view !== "compose" || !state.urlUids.length || !state.catalog?.records || state.editSavedPaperId)
      return;
    const route = resolveUidRoute(state.urlUids);
    state.uidRoute = route;
    state.sources = [];
    state.urlSources = [];
    state.urlRange = "";
    state.buckets = [];
    state.custom = {};
    state.selected = [];
    state.pins = [];
    state.rows = [];
    state.prepared = [];
    state.undo = [];
    state.ackWarnings = false;
    // A failed route keeps the current filters, so clearing it returns to the normal unit list.
    if (route.grade) state.filters = { grade: route.grade };
    state.scopes = route.scopes.map((scope) => scope.key);
    state.distribution = "all";
    state.title = "선택한 문항 문제지";
    state.header.title = state.title;
    state.scopeNotice = "";
  }
  function clearUidRoute({ url = true } = {}) {
    if (!state.uidRoute && !state.urlUids.length) return;
    state.uidRoute = null;
    state.urlUids = [];
    state.scopes = [];
    state.distribution = "equal";
    if (url && state.view === "compose") replaceUrlState();
  }
  // Boot and popstate: make the route match the URL (apply, replace or drop it).
  function syncUidRoute() {
    const wanted = state.view === "compose" && !state.editSavedPaperId ? state.urlUids : [];
    const current = state.uidRoute?.requested || [];
    if (wanted.length === current.length && wanted.every((uid, i) => uid === current[i])) return;
    if (!wanted.length) { clearUidRoute({ url: false }); return; }
    if (state.receipts.length || !state.catalog?.records) return;
    applyUidRoute();
  }
  function renderUidRoute() {
    const route = state.uidRoute;
    const back = '<a href="problem-bank-search.html">검색으로 돌아가기</a>';
    const clear = button("uid-route-clear", "전체 범위에서 직접 고르기", 'class="small"');
    if (route.error) {
      const rows = route.rejected.slice(0, 10).map((item) =>
        `<li><code>${esc(item.uid.length > 24 ? item.uid.slice(0, 24) + "…" : item.uid)}</code> · ${esc(UID_ROUTE_REASONS[item.reason] || item.reason)}</li>`).join("");
      const more = route.rejected.length > 10 ? `<li>외 ${route.rejected.length - 10}문항</li>` : "";
      return `<div class="resultbar"><h2>단원</h2></div><div class="callout danger" role="alert" data-uid-route="rejected"><strong>선택한 문항으로 문제지를 만들 수 없습니다.</strong><p>${esc(route.error)}</p>${rows || more ? `<ul>${rows}${more}</ul>` : ""}<p>${back} · ${clear}</p></div>`;
    }
    const names = route.records.slice(0, 8).map((record, i) =>
      `${esc([record.year, record.school].filter(Boolean).join(" "))} ${esc(record.sourceQuestionNo ?? record.sourceOrdinal)}번`).join(" · ");
    const rest = route.records.length > 8 ? ` 외 ${route.records.length - 8}문항` : "";
    const scope = route.scopes[0];
    return `<div class="resultbar"><h2>단원</h2></div><div class="callout" role="status" data-uid-route="accepted">검색에서 선택한 ${route.records.length}문항으로 범위가 고정되었습니다. ${names}${rest}<p>${back} · ${clear}</p></div>
      <div class="scope-list"><div class="scope-group"><div class="scope-item"><label class="check"><input type="checkbox" data-scope="${esc(scope.key)}" ${scopeIsSelected(scope) ? "checked" : ""} ${state.sealed ? "disabled" : ""}>${esc(scope.label)}</label><small>${scope.count}문항</small></div></div></div>`;
  }
  function applySourceRoute() {
    if (state.view !== "compose" || !state.urlSources.length || !state.catalog?.records) return;
    const catalogFiles = new Set(state.catalog.records.map((record) => record.sourceFile).filter(Boolean));
    const files = state.urlSources.filter((file) => catalogFiles.has(file));
    if (!files.length) return;
    state.sources = files;
    // A routed range already names the exact source intersection. Let the
    // existing compose selector own scope filtering and output generation.
    const routedRecords = state.catalog.records.filter((record) =>
      files.includes(record.sourceFile),
    );
    const routedExams = (state.catalog.exams || []).filter((exam) =>
      files.includes(exam.file),
    );
    const routedGrades = new Set(
      [
        ...routedRecords.map((record) =>
          record.effectiveBrowseGrade || record.sourceGrade || record.grade,
        ),
        ...routedExams.map((exam) => exam.sourceGrade || exam.grade),
      ]
        .filter(Boolean),
    );
    const routedCurriculumCourses = new Set(
      routedRecords
        .filter((record) => record.curriculumKey && record.courseKey)
        .map((record) => `${record.curriculumKey}\u0000${record.courseKey}`),
    );
    state.filters = {};
    if (routedGrades.size === 1)
      state.filters.grade = [...routedGrades][0];
    if (routedCurriculumCourses.size === 1 && !unifiedIndex()) {
      const [curriculumKey, courseKey] = [...routedCurriculumCourses][0].split("\u0000");
      state.filters.curriculumKey = curriculumKey;
      state.filters.courseKey = courseKey;
    }
    if (state.urlRange === "all") {
      state.distribution = "all";
      state.scopes = scopeOptions().filter((scope) => scope.basicScope).map((scope) => scope.key);
      state.title = "현재 범위 문제지";
      state.header.title = state.title;
    }
  }
  // 출제 내역 list: started at boot when the URL opens it. It never waits for the catalog.
  async function loadRecentOnBoot() {
    const selectedAssignmentId = state.recentSelectedAssignmentId;
    try {
      const loaded = await loadRecent();
      if (loaded && selectedAssignmentId && state.view === "recent" &&
        state.recentSelectedAssignmentId === selectedAssignmentId)
        await assignmentStatus(selectedAssignmentId);
    } catch (e) { if (isCurrentAuthorityError(e)) status(e.message, true); }
  }
  // The catalog adds the exam lookup the recent rows use for grade/subject: normalize again (cheap).
  function refreshRecentRowsFromCatalog() {
    if (state.view !== "recent" || state.recentLoading || !state.recentAssignments?.length) return;
    state.recentRows = History.normalizeAssignments(state.recentAssignments, classRows, state.catalog.exams, C);
    rememberRecentSubjectOptions(state.recentRows);
    updateRecentResults();
  }
  // Screens that read the unified unit index / recorded-meta index get them built before they are drawn,
  // while the progress text ("문항 목록 정리 중") is already on screen. The rest builds them when idle.
  const viewNeedsUnifiedIndex = () => ["find", "compose", "health"].includes(state.view) || isQuickAssessmentView();
  async function settleIndexesForView() {
    const unified = viewNeedsUnifiedIndex(), meta = isQuickAssessmentView();
    if (!unified && !meta) return;
    Boot?.setStage?.("index");
    await Boot?.nextPaint?.();
    if (unified) unifiedIndex();
    if (meta) ensureMetaIndex();
  }
  // Idle warm-up, one step per idle slot, so the next screen does not pay for them (each step is skipped
  // when something already built it). Nothing here is needed for correctness.
  function scheduleIndexWarmUp() {
    if (!Boot?.idle) return;
    const steps = [() => unifiedIndex(), () => ensureHealthStats(), () => ensureMetaIndex()];
    const next = () => {
      const step = steps.shift();
      if (!step) return;
      try { step(); } catch (e) { console.warn("[archive2] index warm-up skipped:", e); }
      Boot.idle(next, 10000);
    };
    Boot.idle(next, 10000);
  }
  (async () => {
    readUrl();
    Boot?.mountProgress?.($("boot-progress"));
    // 1) First screen: home / 보관함 / 출제 내역 are drawn now; every other screen shows its progress.
    render();
    Boot?.firstPaint?.();
    if (state.view === "recent") loadRecentOnBoot();
    try {
      if (typeof window.applyArchiveMetaFoundationCatalog !== "function")
        throw Object.assign(new Error("단원·분류 기준을 불러오지 못했습니다. 새로고침해 다시 시도하고, 계속되면 관리자에게 알려 주세요."), { code: "CANONICAL_AUTHORITY_UNAVAILABLE" });
      const catalog = await window.applyArchiveMetaFoundationCatalog();
      if (!ProblemBankMeta) throw Object.assign(new Error("문항 분류 자료를 불러오지 못했습니다. 새로고침해 다시 시도하고, 계속되면 관리자에게 알려 주세요."), { code: "PROBLEM_BANK_META_UNAVAILABLE" });
      Boot?.begin?.("index");
      Boot?.setStage?.("index");
      state.useMode = "general";
      state.indexVersion = catalog.indexVersion;
      state.byUid = new Map(
        catalog.records
          .filter((r) => r.questionUid)
          .map((r) => [r.questionUid, r]),
      );
      state.finderIndex = C.buildFinderIndex(catalog);
      // The recorded-meta index and the 자료 점검 counts are built when a screen needs them (or when idle).
      state.metaIndex = [];
      state.metaIndexSource = null;
      state.healthUnified = null;
      state.healthComposeScope = null;
      composeMetaQueryCache.clear();
      state.crosswalkInventory = await fetch(
        "data/archive2-crosswalk-inventory.json",
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      // The catalog becomes visible to every handler only now, with its derived maps already in place.
      state.catalog = catalog;
      await settleIndexesForView();
      readUrl();
      applySourceRoute();
      syncUidRoute();
      if (state.uidRoute?.error) status(state.uidRoute.error, true);
      // 2) Draw what the catalog adds. Home fills its two placeholders in place; 보관함 and 출제 내역
      // are already on screen; every other screen is drawn now.
      if (state.view === "home") fillHomeFromCatalog();
      else if (state.view === "recent") refreshRecentRowsFromCatalog();
      else if (state.view !== "saved") render();
      // The catalog totals live on the "자료 점검" screen; the status line only reports progress and problems.
      if (!state.uidRoute?.error) status("");
      Boot?.end?.("index");
      Boot?.finish?.(false);
      replayDeferredClick();
      scheduleIndexWarmUp();
      const previous = drafts();
      restoreCurrentHistoryScroll();
      if (state.view === "compose" && state.editSavedPaperId) {
        const sourceId = state.editSavedPaperId;
        status("저장한 시험지를 확인해 수정할 새 문제지를 준비하고 있습니다.");
        await openSavedPaperRevision(sourceId);
      } else if (previous.length && state.view === "compose" && !state.uidRoute)
        showDialog(
          "이전 작업이 있습니다",
          `<p>${esc(previous[0].header?.title || previous[0].title)} · ${previous[0].selected?.length || 0}문항</p>${button("restore", "이전 작업 복원", 'data-draft="0" class="primary"')} ${button("close-dialog", "새로 시작")}`,
        );
    } catch (e) {
      Boot?.finish?.(true);
      if (state.view === "saved") {
        status("문항 목록을 사용할 수 없어도 저장한 시험지는 서버에서 열 수 있습니다.");
        return;
      }
      console.error("[archive2] startup failed:", e?.code || "", e);
      const startupMessage = teacherErrorMessage(e, "아카이브 자료를 불러오지 못했습니다. 새로고침해 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
      state.bootError = startupMessage;
      // Home and 출제 내역 stay usable; the home placeholders turn into the message, any other screen shows it.
      // The reason is written where the screen is waiting (home: the recent-exam block, others: the body), so
      // no alert repeats it. 출제 내역 and 보관함 have no such place and keep the alert.
      if (state.view === "home") fillHomeFromCatalog();
      else if (state.view !== "recent")
        $("content").innerHTML = preparingMarkup();
      if (state.view === "recent") status(startupMessage, true);
    }
  })();
})();
