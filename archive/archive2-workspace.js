(function () {
  "use strict";
  const C = window.Archive2Core,
    Source = window.Archive2Source;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const History = window.Archive2History;
  const frozenPaperCache = new Map();
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
  const button = (action, label, extra = "") =>
    `<button data-action="${action}" ${extra}>${label}</button>`;
  const badge = (label, type = "") =>
    `<span class="badge ${type}">${esc(label)}</span>`;
  const unique = (values) => [...new Set(values.filter(Boolean))];
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
      productKey: "five-minute-test",
      label: "5분 테스트",
      availability: false,
      routeOwner: "common-pack",
      routeResolver: null,
    }),
    Object.freeze({
      productKey: "unit-assessment",
      label: "단원평가",
      availability: false,
      routeOwner: "unit-assessment-v2",
      routeResolver: null,
    }),
    Object.freeze({
      productKey: "exam-prep",
      label: "시험 대비",
      availability: false,
      routeOwner: "exam-prep-v2",
      routeResolver: null,
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

  const courseGrades = Object.freeze({
    "공통수학1": "고1",
    "공통수학2": "고1",
    "수학(상)": "고1",
    "수학(하)": "고1",
    대수: "고2",
    수학I: "고2",
    "확률과통계": "고2",
    미적분: "고3",
    "미적분I": "고3",
    "미적분II": "고3",
    수학II: "고3",
    기하: "고3",
    "기하와 벡터": "고3",
  });
  const courseGrade = (courseKey, curriculumKey = "") => {
    if (typeof C.finderCourseGrade === "function") {
      const shared = C.finderCourseGrade(courseKey, curriculumKey);
      if (shared) return shared;
    }
    const middle = String(courseKey || "").match(/^M([123])-[12]$/);
    return middle ? `중${middle[1]}` : courseGrades[courseKey] || "";
  };
  const scopeText = (value) =>
    String(value ?? "")
      .normalize("NFC")
      .replace(/\s+/g, "")
      .replace(/[·・ㆍ]/g, "");
  const taxonomyRowsForFilters = (filters) => {
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    if (highSemantic && !filters.semanticSubject) return [];
    const high1ProjectionPaths =
      filters.grade === "고1" && filters.semanticSubject
        ? new Set(
            state.catalog.records
              .filter(
                (record) =>
                  record.effectiveBrowseGrade === "고1" &&
                  (!filters.curriculumKey ||
                    record.curriculumKey === filters.curriculumKey) &&
                  C.subjectProjectionMatches(record, filters),
              )
              .map((record) => C.pathKey(record, 4)),
          )
        : null;
    return state.catalog.taxonomy.filter((r) => {
      const projectionMatch =
        !filters.semanticSubject ||
        (filters.grade === "고1"
          ? high1ProjectionPaths.has(C.pathKey(r, 4))
          : C.subjectProjectionForRecord?.(r, filters.grade) ===
            filters.semanticSubject);
      const gradeMatch =
        projected && filters.semanticSubject
          ? true
          : !filters.grade ||
            courseGrade(r.courseKey, r.curriculumKey) === filters.grade;
      return (
        gradeMatch &&
        projectionMatch &&
        (!filters.curriculumKey || r.curriculumKey === filters.curriculumKey) &&
        (!filters.courseKey ||
          filters.semanticSubject ||
          r.courseKey === filters.courseKey)
      );
    });
  };
  const state = {
    catalog: null,
    recentRows: [],
    recentClassId: "",
    recentFilters: { from: "", to: "", grade: "", subject: "", query: "" },
    recentLoadVersion: 0,
    recentLoading: false,
    recentError: "",
    byUid: new Map(),
    busy: false,
    view: "home",
    page: 0,
    find: { grade: "고1" },
    sources: [],
    filters: { grade: "고1" },
    scopes: [],
    distribution: "equal",
    count: 10,
    buckets: [2, 3],
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
    inspector: "summary",
    previewIndex: 0,
    outputMode: "exam",
    prepared: [],
    undo: [],
    receipts: [],
    ackWarnings: false,
  };
  let autosaveTimer,
    previewTimer,
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
      "교사 로그인이 필요합니다. 기존 아카이브에서 로그인한 뒤 돌아와 주세요.",
    );
  }
  async function api(route, body) {
    const base = (
      window.APMATH_API_BASE ||
      "https://ap-math-os-v2612.js-pdf.workers.dev/api"
    ).replace(/\/$/, "");
    const response = await fetch(base + route, {
      method: body ? "POST" : "GET",
      headers: {
        ...headers(),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      const error = new Error(data.error || `요청 실패 (${response.status})`);
      error.data = data;
      throw error;
    }
    return data;
  }
  function status(message, error = false) {
    $("status").textContent = message;
    $("status").classList.toggle("error", error);
  }
  function draft() {
    const keys = [
      "draftId",
      "filters",
      "scopes",
      "distribution",
      "count",
      "buckets",
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
    ];
    return {
      schemaVersion: C.VERSION,
      taxonomyVersion: C.TAXONOMY_VERSION,
      indexVersion: state.indexVersion,
      updatedAt: new Date().toISOString(),
      ...Object.fromEntries(keys.map((k) => [k, state[k]])),
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
  function applyDraft(data) {
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
      throw new Error("현재 아카이브에 등록되지 않은 UID가 있습니다.");
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
      throw new Error("시리즈 이력 UID가 잘못되었습니다.");
    const allowed = Object.keys(draft()).filter(
      (k) =>
        !["schemaVersion", "taxonomyVersion", "updatedAt", "selected"].includes(
          k,
        ),
    );
    for (const key of allowed)
      if (data[key] !== undefined) state[key] = data[key];
    state.filters = C.reconcileFinderFilters(
      state.filters,
      state.catalog.taxonomy,
    );
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
    render();
    status(
      data.indexVersion === state.catalog.indexVersion
        ? "이전 작업을 복원했습니다. 이전 출제 확인은 필요할 때 고급 설정에서 실행할 수 있습니다."
        : "문항 목록이 갱신되었습니다. 다시 만들기한 뒤 출력하세요.",
      data.indexVersion !== state.catalog.indexVersion,
    );
    if (state.studentIds.length) refreshHistory();
  }
  function invalidate() {
    if (state.receipts.length)
      throw new Error(
        "이미 출제한 문제지는 보존됩니다. 아직 출제하지 않은 문제지에서 문항을 교체하거나 다시 만들어 주세요.",
      );
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
  function scopeOptions() {
    const counts = new Map(),
      excluded = C.composeExclusions(context()).union;
    const pool = state.catalog.records.filter((r) =>
      C.matches(r, { ...state.filters, sourceFiles: state.sources }),
    );
    for (const r of pool)
      if (C.eligibility(r, state).ok && !excluded.has(r.questionUid))
        counts.set(C.pathKey(r, 4), (counts.get(C.pathKey(r, 4)) || 0) + 1);
    const units = new Map();
    for (const r of taxonomyRowsForFilters(state.filters)) {
      const key = [
        r.curriculumKey,
        r.courseKey,
        scopeText(r.L1),
        scopeText(r.L2),
      ].join("|");
      if (!units.has(key))
        units.set(key, {
          curriculumKey: r.curriculumKey,
          courseKey: r.courseKey,
          L1: r.L1,
          L2: r.L2,
          rows: [],
        });
      units.get(key).rows.push(r);
    }
    const semanticGroups = new Map();
    for (const unit of units.values()) {
      const semanticKey = [scopeText(unit.L1), scopeText(unit.L2)].join("|");
      const key = state.filters.curriculumKey
        ? [unit.curriculumKey, unit.courseKey, semanticKey].join("|")
        : semanticKey;
      if (!semanticGroups.has(key)) semanticGroups.set(key, []);
      semanticGroups.get(key).push(unit);
    }
    const groups = [];
    for (const candidates of semanticGroups.values()) {
      if (!state.filters.curriculumKey && candidates.length > 1) {
        const first = candidates[0];
        groups.push({
          curriculumKey: "all",
          courseKey: "all",
          L1: first.L1,
          L2: first.L2,
          rows: candidates.flatMap((unit) => unit.rows),
        });
      } else {
        groups.push(...candidates);
      }
    }
    const displayKeys = new Map();
    for (const group of groups) {
      const key = scopeText(group.L1) + "|" + scopeText(group.L2);
      displayKeys.set(key, (displayKeys.get(key) || 0) + 1);
    }
    return groups.map((group, index) => {
      const paths = unique(group.rows.map((r) => C.pathKey(r, 4)));
      const displayKey = scopeText(group.L1) + "|" + scopeText(group.L2);
      const suffix =
        displayKeys.get(displayKey) > 1
          ? ` · ${group.curriculumKey === "all" ? "통합" : group.curriculumKey}`
          : "";
      return {
        key: `scope-${index}-${scopeText(group.L1)}-${scopeText(group.L2)}-${group.curriculumKey}`,
        L1: group.L1,
        L2: group.L2,
        label: `${group.L2}${suffix}`,
        paths,
        count: paths.reduce((sum, path) => sum + (counts.get(path) || 0), 0),
      };
    });
  }
  function scopeIsSelected(scope) {
    return (
      state.scopes.includes(scope.key) ||
      scope.paths.some((path) => state.scopes.includes(path))
    );
  }
  function selectedScopeOptions() {
    return scopeOptions().filter(scopeIsSelected);
  }
  function selectedScopePaths() {
    return unique(selectedScopeOptions().flatMap((scope) => scope.paths));
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
            },
          ]
        : [];
    return scopes
      .map((s) => ({
        id: s.key,
        paths: s.paths,
        depth: 4,
        label: s.label,
        count:
          state.distribution === "all"
            ? state.catalog.records.filter(
                (r) =>
                  C.matches(r, {
                    ...state.filters,
                    sourceFiles: state.sources,
                    primaryPaths: s.paths,
                  }) &&
                  state.buckets.includes(r.difficultyBucket) &&
                  C.eligibility(r, state).ok &&
                  !C.composeExclusions(context()).union.has(r.questionUid),
              ).length
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
    const paths = selectedScopePaths();
    return state.catalog.records.filter(
      (r) => !paths.length || paths.includes(C.pathKey(r, 4)),
    );
  }
  function request(useFrozen = false) {
    return {
      filters: {
        ...state.filters,
        sourceFiles: state.sources,
        primaryPaths: selectedScopePaths(),
      },
      rows: useFrozen ? state.rows : planRows(),
      pins: state.selected
        .filter((r) => state.pins.includes(r.questionUid))
        .map((r) => ({ questionUid: r.questionUid, rowId: r.rowId })),
      seed: state.seed,
    };
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
  function filterMarkup(filters, prefix, compose = false) {
    const courseLabel = (value) =>
      /^M([123])-([12])$/.test(value)
        ? value.replace(/^M([123])-([12])$/, "중$1 · $2학기")
        : value;
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    const courses = projected
      ? C.subjectProjectionOptions(filters.grade)
      : unique(
          taxonomyRowsForFilters({ ...filters, courseKey: "" })
            .map((r) => r.courseKey),
        ).map((value) => ({ value, label: courseLabel(value) }));
    const courseField = projected
      ? `<label>과목<select data-filter="semanticSubject" data-group="${prefix}">${options(courses, filters.semanticSubject, highSemantic ? "과목 선택" : "전체 과목")}</select></label>`
      : `<label>과목<select data-filter="courseKey" data-group="${prefix}">${options(courses, filters.courseKey, "전체 과목")}</select></label>`;
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
  function finderUpstreamMatch(exam, filters) {
    if (!O.matchesMaterial(exam, filters.material)) return false;
    if (filters.grade && exam.effectiveBrowseGrade !== filters.grade) return false;
    return C.finderMatches(
      exam,
      {
        grade: filters.grade,
        curriculumKey: filters.curriculumKey,
        courseKey: filters.courseKey,
        semanticSubject: filters.semanticSubject,
      },
      state.finderIndex,
    );
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
        filters.query,
    );
  }
  function finderSearchMarkup(filters) {
    return `<div class="finder-search-zone"><div class="finder-search-row"><label class="finder-search-box" aria-label="학교·단원·과목 검색"><span aria-hidden="true">⌕</span><input id="finder-query" value="${esc(filters.query || "")}" placeholder="학교명, 과목, 단원으로 검색"></label>${button("finder-search", "검색", 'class="primary finder-search-submit"')}</div></div>`;
  }
  function finderActiveMarkup(filters) {
    const active = [
      ["학교", filters.school],
      ["시험", filters.axis ? finderAxisLabel(filters.axis) : ""],
      [
        "연도",
        filters.yearFrom || filters.yearTo
          ? `${filters.yearFrom || "…"}~${filters.yearTo || "…"}`
          : "",
      ],
      ["과목 계열", filters.family ? finderFamilyLabel(filters.family) : ""],
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
  function finderPrimaryFilterMarkup(filters) {
    const highSemantic = C.isHighSemanticSubjectGrade?.(filters.grade) === true,
      projected = C.hasSubjectProjection?.(filters.grade) === true;
    const courses = finderCourseOptions(filters);
    const courseField = projected
      ? `<label class="finder-field finder-course"><span>과목</span><select data-filter="semanticSubject" data-group="find">${options(courses, filters.semanticSubject, highSemantic ? "과목 선택" : "전체 과목")}</select></label>`
      : `<label class="finder-field finder-course"><span>과목</span><select data-filter="courseKey" data-group="find">${options(courses, filters.courseKey, "전체 과목")}</select></label>`;
    return `<div class="finder-filter-core"><label class="finder-field"><span>학년</span><select data-filter="grade" data-group="find">${options(["중1", "중2", "중3", "고1", "고2", "고3"], filters.grade, "전체 학년")}</select></label><label class="finder-field"><span>교육과정</span><select data-filter="curriculumKey" data-group="find">${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>${courseField}</div>`;
  }
  function finderDetailFilterMarkup(filters) {
    const schools = finderSchoolValues(filters);
    return `<div class="finder-filter-detail"><label class="finder-field finder-school"><span>학교</span><select data-filter="school" data-group="find">${options(schools, filters.school, "전체 학교")}</select></label><label class="finder-field"><span>시험 시기</span><select data-filter="axis" data-group="find">${options(
      [
        { value: "1-mid", label: "1학기 중간" },
        { value: "1-final", label: "1학기 기말" },
        { value: "2-mid", label: "2학기 중간" },
        { value: "2-final", label: "2학기 기말" },
      ],
      filters.axis,
      "전체 시험",
    )}</select></label><label class="finder-field finder-year"><span>연도</span><span class="finder-year-range"><input type="number" min="2000" max="2100" data-filter="yearFrom" data-group="find" value="${esc(filters.yearFrom || "")}" placeholder="시작 연도"><b>~</b><input type="number" min="2000" max="2100" data-filter="yearTo" data-group="find" value="${esc(filters.yearTo || "")}" placeholder="끝 연도"></span></label>${
      filters.grade
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
          )}</select></label>`
    }</div>`;
  }

  function findExams() {
    const f = state.find;
    const query = C.normalizeSearch(f.query || "");
    const matchingSources = query
      ? new Set(
          state.catalog.records
            .filter((r) =>
              C.normalizeSearch(
                [r.questionUid, r.L1, r.L2, r.L3, r.L4]
                  .filter(Boolean)
                  .join(" "),
              ).includes(query),
            )
            .map((r) => r.sourceFile),
        )
      : null;
    return state.catalog.exams.filter((exam) => {
      if (
        !O.matchesMaterial(exam, f.material) ||
        (f.grade && exam.effectiveBrowseGrade !== f.grade) ||
        (f.school && f.school !== exam.school) ||
        (f.yearFrom && exam.year < Number(f.yearFrom)) ||
        (f.yearTo && exam.year > Number(f.yearTo))
      )
        return false;
      if (f.axis && `${exam.semester}-${exam.examType}` !== f.axis)
        return false;
      if (f.family && !f.grade && !exam.courseFamilies.includes(f.family)) return false;
      if (
        !C.finderMatches(
          exam,
          {
            grade: f.grade,
            curriculumKey: f.curriculumKey,
            courseKey: f.courseKey,
            semanticSubject: f.semanticSubject,
          },
          state.finderIndex,
        )
      )
        return false;
      return (
        !query ||
        matchingSources.has(exam.file) ||
        C.normalizeSearch(JSON.stringify(exam)).includes(
          C.normalizeSearch(f.query),
        )
      );
    }).sort(C.compareNewest);
  }
  function openOriginalIssue(exam, step = "review") {
    state.originalExam = exam;
    const stored = Number(
      localStorage.getItem("APMATH_ARCHIVE2_ORIGINAL_QPP") || 4,
    );
    const qpp = [4, 6, 8].includes(stored) ? stored : 4;
    const url = new URL("index.html", location.href);
    url.searchParams.set("archive2Issue", exam.file);
    url.searchParams.set("archive2Embedded", "1");
    url.searchParams.set("qpp", String(qpp));
    state.originalSettings = O.settings({
      header: {
        title: O.displayTitle(exam),
        subtitle: exam.subject || exam.primaryStandardCourse,
      },
      qpp,
    });
    state.originalReceipts = [];
    state.originalPreviewKey = "preview-" + crypto.randomUUID();
    showDialog(
      O.displayTitle(exam),
      `<div class="original-issue-toolbar"><span>${exam.qCount}문항 · 수록 순서 그대로</span><div class="actions">${button("original-review", "시험지 확인", 'aria-pressed="true"')}${button("original-targets", "반·학생 선택", 'class="primary" aria-pressed="false"')}</div><details class="original-output"><summary>출력 설정</summary>${O.markup(state.originalSettings, "original")}</details></div><div id="original-receipts"></div><section id="original-review"><div class="resultbar"><p class="muted">학생에게 나갈 시험지입니다. 출력 설정을 바꾸면 여기에 반영됩니다.</p>${button("original-print", "새 창·출력", 'class="small"')}</div><div id="original-preview-status" role="status">시험지를 불러오는 중…</div><iframe id="original-preview-frame" title="학생에게 나갈 시험지"></iframe></section><iframe id="original-issue-frame" title="원본 기출 반·학생 출제" src="${esc(url.href)}"></iframe>`,
    );
    $("modal").classList.add("original-issue-dialog");
    setOriginalStep(step);
  }
  function originalIssueBusy() {
    return Boolean(
      $("original-issue-frame")?.contentWindow?.isArchive2OriginalBusy?.(),
    );
  }
  function setOriginalStep(step) {
    $("original-review").hidden = step !== "review";
    $("original-issue-frame").hidden = step !== "targets";
    document.querySelector('[data-action="original-review"]').setAttribute("aria-pressed", String(step === "review"));
    document.querySelector('[data-action="original-targets"]').setAttribute("aria-pressed", String(step === "targets"));
    $("modal").scrollTop = 0;
    // Equal-slot layout requires measurable width. A hidden iframe cannot
    // render; refresh only after the review panel becomes visible.
    if (step === "review") updateOriginalPreview();
  }
  async function originalOutputUrl() {
    const e = state.originalExam, s = state.originalSettings;
    const saved = state.originalReceipts?.[0];
    const key = saved?.key || state.originalPreviewKey;
    if (!saved) {
      const questions = await Source.load(e.file, new Map(state.catalog.sourceHashes).get(e.file));
      const questionUids = state.catalog.records.filter(r => r.sourceFile === e.file)
        .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)
        .map(r => r.identityStatus === "VERIFIED" ? r.questionUid : null);
      localStorage.setItem("archive2Original_" + key, JSON.stringify({ questions, meta: {
        sourceKind: "archive2-original", sourceArchiveFile: e.file, questionUids,
        identityTitle: e.identityTitle || e.file.split("/").pop().replace(/\.js$/, ""),
        printHeaderOptions: s.header, qpp: s.qpp, includeQr: s.includeQr,
      }}));
    }
    const url = O.applyUrl(new URL("engine.html", location.href), s);
    url.searchParams.set("originalSnapshot", key);
    url.searchParams.set("data", "exams/" + e.file);
    url.searchParams.set("mode", "exam");
    return url;
  }
  async function updateOriginalPreview() {
    const token = state.originalPreviewToken = (state.originalPreviewToken || 0) + 1;
    const frame = $("original-preview-frame");
    if (!frame || $("original-review").hidden) return;
    const status = $("original-preview-status");
    status.textContent = "시험지를 불러오는 중…";
    try {
      const url = await originalOutputUrl();
      if (token !== state.originalPreviewToken || !frame.isConnected || $("original-review").hidden) return;
      url.searchParams.set("archive2Review", "1");
      // Refresh after an output setting changes, even though snapshot identity stays stable.
      url.searchParams.set("revision", String(token));
      frame.onload = () => {
        status.textContent = "출제할 문항과 출력 설정을 확인하세요.";
        if (!$("original-review")?.hidden) $("modal").scrollTop = 0;
      };
      frame.src = url.href;
    } catch (error) { status.textContent = "시험지를 표시하지 못했습니다: " + error.message; }
  }
  async function originalPrint() {
    const popup = window.open("about:blank", "_blank");
    try {
      const url = await originalOutputUrl();
      if (!popup) throw new Error("팝업을 허용해 주세요.");
      popup.location.href = url.href;