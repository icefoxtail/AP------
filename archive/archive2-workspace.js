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
    composeDetailOpen: false,
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
    for (const level of ["L3", "L4"])
      if (state.filters[level] && !/^(mf|rpm):/.test(state.filters[level]))
        state.filters[level] = `rpm:${state.filters[level]}`;
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
    if (compose === "primary")
      return `<div class="compose-step compose-grade"><div class="compose-step-head"><span class="compose-step-number">1</span><h2>학년</h2></div><label>학년<select data-filter="grade" data-group="compose">${options(["중1", "중2", "중3", "고1", "고2", "고3"], filters.grade, null)}</select></label></div>
        <div class="compose-step compose-subject"><div class="compose-step-head"><span class="compose-step-number">2</span><h2>교육과정 / 과목</h2></div><div class="compose-subject-fields"><label>교육과정<select data-filter="curriculumKey" data-group="compose">${options(["2015", "2022"], filters.curriculumKey, "전체 교육과정")}</select></label>${courseField}</div></div>`;
    if (compose === "detail")
      return `<div class="compose-detail-fields"><label>학교<select data-filter="school" data-group="compose">${options(finderSchoolValues(filters), filters.school, "전체 학교")}</select></label>
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
    const url = O.applyUrl(O.engineUrl("engine.html", location.href), s);
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
    } catch (error) { popup?.close(); throw error; }
  }

  function renderHome() {
    const recent = drafts().slice(0, 3);
    const grades = ["중1", "중2", "중3", "고1", "고2", "고3"];
    return `<section class="archive-home">
      <header class="archive-home-heading"><h1>홈</h1></header>
      <section class="panel archive-home-start">
        <form id="archive-home-search" class="archive-home-search" role="search">
          <label class="archive-home-search-box" aria-label="학교·단원·과목 검색"><span aria-hidden="true">⌕</span><input id="archive-home-query" placeholder="학교명, 과목, 단원으로 검색" autocomplete="off"></label>
          ${button("home-search", "검색", 'type="button" class="primary archive-home-search-submit"')}
        </form>
        <div class="archive-home-grades" aria-label="학년 빠른 진입">${grades.map((grade) => button("home-grade", grade, `data-grade="${grade}"`)).join("")}</div>
      </section>
      <section class="archive-home-products-section">
        <div class="archive-home-section-head"><h2>바로 쓰는 자료·평가</h2></div>
        <div class="archive-home-products">${HOME_PRODUCT_REGISTRY.map(homeProductMarkup).join("")}</div>
      </section>
      <section class="archive-home-drafts-section">
        <div class="archive-home-section-head"><h2>만들던 문제지</h2></div>
        <div class="archive-home-drafts">${recent.length
          ? recent.map((d, i) => `<article class="archive-home-draft"><div><h3>${esc(d.header?.title || d.title || "문제지")}</h3><p class="muted">${esc(new Date(d.updatedAt).toLocaleString("ko-KR"))} · ${d.selected?.length || 0}문항 · ${d.round || 1}차</p></div>${button("restore", "이어하기", `data-draft="${i}"`)}</article>`).join("")
          : '<div class="empty archive-home-empty">저장된 작업이 없습니다.</div>'}</div>
      </section>
    </section>`;
  }

  function renderFind() {
    reconcileFinderSchool(state.find);
    const exams = findExams(),
      page = exams.slice(state.page * 18, (state.page + 1) * 18),
      detailOpen = matchMedia("(max-width: 700px)").matches ? "" : " open";
    return `<div class="finder-surface"><div class="intro finder-intro"><div><h1>기출·자료 찾기</h1><p class="muted">제목을 눌러 시험지를 확인하고, 반·학생을 골라 출제하세요.</p></div>${button("go-compose", "문제지 만들기")}</div>
      <section class="panel finder-panel"><div class="material-switch" aria-label="찾을 시험지 종류">${[["exam","학교 기출"],["nonexam","기출 외 시험지"],["","전체"]].map(([value,label]) => button("material",label,`data-material="${value}" aria-pressed="${value === "nonexam" ? !!state.find.material && state.find.material !== "exam" : (state.find.material || "") === value}"`)).join("")}</div><div class="material-nav" ${!state.find.material || state.find.material === "exam" ? "hidden" : ""}><label>자료 종류<select data-filter="material" data-group="find">${options([{value:"exam",label:"학교 기출"},{value:"nonexam",label:"기출 외 전체"},{value:"similar",label:"유사문제 · 유형"},{value:"unit",label:"단원평가"},{value:"other",label:"기타 자료"}],state.find.material,"전체 자료")}</select></label></div>${finderSearchMarkup(state.find)}${finderActiveMarkup(state.find)}${finderPrimaryFilterMarkup(state.find)}<details class="finder-detail-filters"${detailOpen}><summary>상세 필터</summary>${finderDetailFilterMarkup(state.find)}</details></section>
      ${state.find.material && state.find.material !== "exam" ? '<a class="assessment-entry" href="assessment/assessment-mvp.html"><span><strong>평가 보관함</strong><small>진단·단원·학기 평가용으로 준비된 시험지</small></span><span>시험지 보기 →</span></a>' : ""}
      <div class="resultbar finder-resultbar"><strong>${state.find.material && state.find.material !== "exam" ? "기출 외 시험지" : "시험지"} ${exams.length.toLocaleString()}개</strong><span class="muted">시험지 확인 · 반·학생 출제</span></div>
      <div class="finder-results-wrap"><div class="exam-list">${page
        .map((e) => {
          const n = state.catalog.exams.indexOf(e),
            selected = state.sources.includes(e.file);
          return `<article class="exam ${selected ? "selected" : ""}"><div class="exam-identity"><div class="head">${badge(e.grade)}${badge(e.contentType)}${e.gradeConflict ? badge("학년 충돌", "warn") : ""}</div><h2><button class="exam-title" data-action="source-preview" data-exam="${n}">${esc(O.displayTitle(e))}</button></h2></div><div class="exam-range"><div class="inline"><strong>${esc(e.primaryStandardCourse || unique((e.courseRanges || []).map((r) => r.standardCourse)).join(" · ") || e.subject)}</strong><span class="muted">${esc(e.semester || "")}학기 ${e.examType === "mid" ? "중간" : e.examType === "final" ? "기말" : "자료"}</span></div><p class="range">${(e.courseRanges || []).map((r) => esc(`${r.standardCourse} · ${r.rangeStartUnit || ""}${r.rangeEndUnit !== r.rangeStartUnit ? " ~ " + r.rangeEndUnit : ""}`)).join("<br>")}</p></div><div class="exam-count"><strong>${e.qCount}<small>문항</small></strong><span class="muted">${O.materialKind(e) === "exam" ? "원본 전체" : "시험지 전체"}</span></div><div class="actions">${button("source-issue", "바로 출제", `data-exam="${n}" class="small primary"`)}${button("source-preview", "시험지 확인", `data-exam="${n}" class="small"`)}${button("source-toggle", selected ? "선택됨" : "문항 선택", `data-exam="${n}" aria-pressed="${selected}" class="small"`)}</div></article>`;
        })
        .join("")}</div></div>
      ${!exams.length ? '<div class="empty">현재 조건에 맞는 자료가 없습니다. 학교·연도·교육과정 중 하나를 넓혀 보세요.</div>' : ""}
      <div class="pager">${button("page-prev", "이전", state.page === 0 ? "disabled" : "")}<span>${state.page + 1} / ${Math.max(1, Math.ceil(exams.length / 18))}</span>${button("page-next", "다음", (state.page + 1) * 18 >= exams.length ? "disabled" : "")}</div>
      ${state.sources.length ? `<div class="floating finder-selection-bar"><strong>선택한 시험 ${state.sources.length}개</strong><div class="actions">${button("sources-clear", "선택 비우기")}${button("go-compose", "선택한 자료로 문제지 만들기")}</div></div>` : ""}</div>`;
  }

  function renderScopes() {
    if (
      C.isHighSemanticSubjectGrade?.(state.filters.grade) &&
      !state.filters.semanticSubject
    )
      return `<div class="resultbar"><h2>출제 범위</h2></div><p class="muted">고2·고3은 과목을 먼저 선택하면 해당 과목의 2015·2022 범위를 하나로 묶어 보여줍니다.</p>`;
    const scopes = scopeOptions(),
      groups = unique(scopes.map((s) => s.L1));
    return `<div class="resultbar"><h2>출제 범위</h2><div class="actions">${button("scope-all", "전체 선택", 'class="small"')}${button("scope-clear", "초기화", 'class="small"')}</div></div>
      <p class="muted">학년의 1·2학기 전체 범위입니다. 교육과정 전체에서는 실질적으로 같은 2015·2022 범위를 하나로 묶습니다. 숫자는 현재 출제 조건을 반영한 검수 문항 수입니다.</p>
      <div class="range-controls"><label>범위 시작<select id="scope-start">${options(
        scopes.map((s, i) => ({ value: i, label: s.L1 + " · " + s.label })),
        0,
        null,
      )}</select></label><label>범위 끝<select id="scope-end">${options(
        scopes.map((s, i) => ({ value: i, label: s.L1 + " · " + s.label })),
        Math.max(0, scopes.length - 1),
        null,
      )}</select></label>${button("scope-range", "연속 범위 선택")}</div>
      <div class="scope-list">${groups
        .map(
          (g, gi) =>
            `<div class="scope-group"><div class="group-head"><h3>${esc(g)}</h3>${button("scope-group", "모두", `data-group-index="${gi}" class="small"`)}</div>${scopes
              .filter((s) => s.L1 === g)
              .map(
                (s) =>
                  `<div class="scope-item"><label class="check"><input type="checkbox" data-scope="${esc(s.key)}" ${scopeIsSelected(s) ? "checked" : ""} ${state.sealed ? "disabled" : ""}>${esc(s.label)}</label><small>${s.count}문항</small></div>`,
              )
              .join("")}</div>`,
        )
        .join("")}</div>`;
  }
  function bucketButtons(current, row = "") {
    return `<div class="bucket-set" aria-label="5단계 난이도">${[1, 2, 3, 4, 5].map((n) => button("bucket", n, `data-bucket="${n}" data-row="${esc(row)}" aria-pressed="${current.includes(n)}" ${state.sealed ? "disabled" : ""}`)).join("")}</div>`;
  }
  function composeAdvancedChoices(selectionFilters) {
    const baseFilters = { ...selectionFilters, L3: "", L4: "" };
    const excluded = C.composeExclusions(context()).union;
    const eligible = pool().filter(r =>
      C.matches(r, baseFilters) && C.eligibility(r, state).ok && !excluded.has(r.questionUid));
    const labels = window.ARCHIVE_META_FOUNDATION_LABELS || { problemTypes: {}, templates: {} };
    const concepts = new Map(), types = new Map();
    for (const record of eligible) {
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
  const displayTemplate = record =>
    C.advancedAuthority(record) === "mf"
      ? window.ARCHIVE_META_FOUNDATION_LABELS?.templates?.[record.templateKey]?.label || record.L4
      : record.L4;
  function renderComposition() {
    const selectionFilters = {
      ...state.filters,
      sourceFiles: state.sources,
      primaryPaths: selectedScopePaths(),
    };
    const rows = planRows(),
      total = rows.reduce((n, r) => n + r.count, 0);
    const excluded = C.composeExclusions(context()).union;
    const candidates = pool().filter(
      (r) =>
        C.matches(r, selectionFilters) &&
        C.eligibility(r).ok &&
        !excluded.has(r.questionUid),
    );
    const shortages = rows
      .map((row) => ({
        row,
        available: candidates.filter((r) => C.rowMatches(r, row)).length,
      }))
      .filter((item) => item.available < item.row.count);
    const advanced = composeAdvancedChoices(selectionFilters);
    return `<section class="panel compose-composition"><div class="compose-step-head"><span class="compose-step-number">4</span><h2>구성</h2><span class="muted">출제 범위 · 문항 수</span></div><div class="inline"><label>배분 방식<select id="distribution" ${state.sealed ? "disabled" : ""}>${options(
      [
        { value: "equal", label: "단원별 균등" },
        { value: "pool", label: "전체에서 선택" },
        { value: "custom", label: "직접 배분" },
        { value: "all", label: "조건 일치 전부" },
      ],
      state.distribution,
      null,
    )}</select></label><label>${state.distribution === "pool" ? "총 문항 수" : "단원당 문항 수"}<input id="count" type="number" min="1" max="400" value="${state.count}" ${state.distribution === "all" || state.sealed ? "disabled" : ""}></label><label>난이도 (1~5)${bucketButtons(state.buckets)}</label></div>
      <details class="compose-detail" ${state.composeDetailOpen ? "open" : ""}><summary>세부 조건</summary>${filterMarkup(state.filters, "compose", "detail")}<div class="compose-taxonomy"><strong>개념·유형으로 더 좁히기</strong><div class="compose-detail-fields"><label>개념<select data-filter="L3" data-group="compose" ${state.sealed ? "disabled" : ""}>${advancedOptions(advanced.concepts, state.filters.L3, "전체 개념")}</select></label><label>유형<select data-filter="L4" data-group="compose" ${state.sealed ? "disabled" : ""}>${advancedOptions(advanced.types, state.filters.L4, "전체 유형")}</select></label></div></div></details>
      ${rows.length ? `<table class="composition"><thead><tr><th>범위</th><th>난이도</th><th>요청</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${esc(row.label || "선택한 전체 범위")}</td><td>${state.distribution === "custom" ? bucketButtons(row.difficultyBuckets, row.id) : row.difficultyBuckets.join(" · ")}</td><td>${state.distribution === "custom" ? `<input type="number" min="1" max="400" data-row-count="${esc(row.id)}" value="${row.count}" aria-label="${esc(row.label)} 문항 수" ${state.sealed ? "disabled" : ""}>` : row.count}</td></tr>`).join("")}</tbody></table>` : '<p class="muted">위에서 출제할 범위를 선택하세요.</p>'}
      ${shortages.length ? `<div class="callout danger"><strong>현재 조건에서 ${shortages.reduce((n, s) => n + s.row.count - s.available, 0)}문항이 부족합니다.</strong>${shortages.map((s) => `<div>${esc(s.row.label || "선택 범위")} · 요청 ${s.row.count} / 신규 가능 ${s.available}</div>`).join("")}<p>문항 수를 낮추거나, 난이도·출처 범위를 직접 조정하세요.</p></div>` : ""}
      <div class="resultbar compose-create-bar"><strong>총 ${total}문항 · ${Math.max(1, Math.ceil(total / 50))}개 문제지</strong>${button("generate", state.selected.length ? "다시 만들기" : "문제지 만들기", `class="primary" ${!rows.length || state.sealed || state.busy || shortages.length ? "disabled" : ""}`)}</div><p class="muted">조건에 맞는 최신 연도 문항부터 선택합니다. 같은 연도 안에서는 문항을 섞고, 연도 미상 자료는 마지막에 선택합니다. 50문항 기준으로 분할하며, 단원·난이도·출처 조건을 그대로 지킵니다.</p></section>`;
  }
  function renderInspector() {
    const r = state.selected.length ? review() : null;
    const summary = `<h2>${state.round}차 테스트</h2><div class="summary-number">${state.selected.length}<small class="muted" style="font-size:14px"> 문항</small></div>
      <div class="summary-line"><span>선택 범위</span><strong>${selectedScopeOptions().length}개</strong></div><div class="summary-line"><span>고정 문항</span><strong>${state.pins.length}개</strong></div><div class="summary-line"><span>이전 회차 사용</span><strong>${unique(state.rounds.flatMap((r) => r.questionUids)).length}문항</strong></div>
      ${r ? `<div class="callout ${r.status === "HARD_BLOCK" ? "danger" : r.status === "PASS" ? "good" : ""}"><strong>${r.status === "PASS" ? "검증 통과" : r.status === "WARN" ? "확인할 내용이 있습니다" : "출력·출제 차단"}</strong>${[...r.hardFailures, ...r.warnings].map((m) => `<div>${esc(m)}</div>`).join("")}<div>중복 없이 ${r.metrics.uniqueUidCount}문항 · 원본 ${r.metrics.sourceCount}개 시험</div></div>` : ""}
      ${r?.warnings.length ? `<label class="check"><input type="checkbox" id="ack-warnings" ${state.ackWarnings ? "checked" : ""}>안내를 확인했습니다.</label>` : ""}`;
    const historyOverlapCount = state.history?.union_question_uids?.length || 0;
    const historyNotice = !state.studentIds.length
      ? ""
      : state.historyMode === "off"
        ? '<div class="callout">이전 출제 문항 확인을 사용하지 않습니다. 생성된 시험지는 그대로 출제할 수 있습니다.</div>'
        : state.historyError
          ? `<div class="callout">이력 확인 실패: ${esc(state.historyError)}<br>확인 결과와 관계없이 이 시험지는 출제할 수 있습니다.</div>`
          : !state.historyReady
            ? '<div class="callout">이전 출제 이력을 확인하고 있습니다. 확인 중에도 출제할 수 있습니다.</div>'
            : `<div class="callout">현재 시험지 중 이전 출제와 겹치는 문항 <strong>${historyOverlapCount}개</strong><br>참고 정보이며 출제를 차단하지 않습니다.</div>`;
    const targeting = `<h3>출제 대상</h3><p>${esc(state.studentLabels.join(" · ") || "문제지를 만든 뒤 학생을 선택해 출제합니다.")}</p><div class="actions">${button("targets", "학생 선택", 'class="small"')}${state.studentIds.length ? button("targets-clear", "해제", 'class="small"') : ""}</div>
      <details style="margin-top:12px">
        <summary>고급 설정</summary>
        <label style="margin-top:12px">이전 출제 문항 확인<select id="history-mode" ${state.sealed ? "disabled" : ""}>${options(
          [
            { value: "off", label: "확인 안 함" },
            { value: "all", label: "전체 이력 확인" },
            { value: "90", label: "최근 90일 확인" },
            { value: "30", label: "최근 30일 확인" },
          ],
          state.historyMode === "recent"
            ? String(state.recentDays)
            : state.historyMode,
          null,
        )}</select></label>
        ${state.studentIds.length && state.historyMode !== "off" ? button("history-refresh", "이력 다시 확인", 'class="small"') : ""}
      </details>
      ${historyNotice}`;
    const frozen = Parts.receipt(state.receipts, state.previewIndex),
      frozenPaper = frozen && frozenPaperCache.get(frozen.key);
    const header =
      (frozen
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
      );
    return `<aside class="inspector ${state.mobileInspectorOpen ? "mobile-open" : ""}"><section class="panel">${button("close-inspector", "설정 닫기", 'class="mobile-sheet-close"')}<div class="tabs" role="tablist">${[
      ["summary", "출제 확인"],
      ["targets", "대상"],
      ["header", "출력 설정"],
    ]
      .map(([k, l]) =>
        button(
          "inspector",
          l,
          `data-tab="${k}" role="tab" aria-selected="${state.inspector === k}" class="${state.inspector === k ? "active" : ""}"`,
        ),
      )
      .join(
        "",
      )}</div><div>${state.inspector === "header" ? header : state.inspector === "targets" ? targeting : summary + `<hr style="border:0;border-top:1px solid var(--line);margin:18px 0">` + targeting}</div>
      ${state.selected.length ? `<div class="actions" style="margin-top:18px">${button("print", "일반 출력", `class="primary" ${r.status === "HARD_BLOCK" || (r.warnings.length && !state.ackWarnings) ? "disabled" : ""}`)}${button("assign", state.receipts.length && !state.sealed ? "남은 문제지 출제" : state.receipts.some((r) => !r.ready) ? "PDF 다시 준비" : "학생에게 출제", `${!state.studentIds.length || r.status === "HARD_BLOCK" || (r.warnings.length && !state.ackWarnings) ? "disabled" : ""}`)}</div>${state.sealed ? '<p class="callout">확정된 회차입니다. 다음 회차에서 새 문제지를 만드세요.</p>' : ""}<div class="actions" style="margin-top:12px">${button("next-round", "같은 조건으로 다음 회차", !state.sealed ? "disabled" : "")}${button("backup", "작업 파일 저장", 'class="small"')}</div>` : ""}
      ${renderDeliveryProgress()}</section></aside>`;
  }
  function renderDeliveryProgress() {
    if (!state.receipts.length && !state.failedPart) return "";
    const p = Parts.status(state.selected.length, state.receipts);
    return `<section class="delivery-progress"><h3>${p.saved} / ${p.total}개 문제지 출제 저장</h3><p>${p.pending ? "아직 출제하지 않은 문제지만 수정하고 이어서 출제할 수 있습니다." : "선택한 학생의 내 시험지에서 확인할 수 있습니다."}</p>${Array.from(
      { length: p.total },
      (_, i) => {
        const r = Parts.receipt(state.receipts, i);
        return `<div class="callout"><strong>${i + 1}권 · ${r ? "출제 저장됨" : "아직 출제하지 않음"}</strong><p>${r ? (r.ready ? "PDF 준비 완료" : "PDF 파일 재시도 필요") : state.failedPart?.index === i ? esc(state.failedPart.message) : "문항 수정 가능"}</p>${r ? button("assignment-status", "학생별 확인 · 출력", `data-assignment="${r.id}" class="small"`) : button("recover-part", "이 문제지 수정", `data-part="${i}" class="small"`)}</div>`;
      },
    ).join("")}</section>`;
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
          `data-mode="${k}" class="small ${state.outputMode === k ? "active" : ""}"`,
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
          : `<div data-question-uid="${r.questionUid}" class="paper-row ${state.pins.includes(r.questionUid) ? "pinned" : ""}"><strong>${(i % 50) + 1}</strong><div class="description">${esc(r.L2)} · 난이도 ${r.difficultyBucket}<br><span class="muted">${esc(r.year)} ${esc(r.school)} · 원본 ${esc(r.sourceQuestionNo)}번 · ${esc(displayTemplate(r))}</span></div><div class="actions">${button("pin", state.pins.includes(r.questionUid) ? "고정됨" : "고정", `data-index="${i}" aria-pressed="${state.pins.includes(r.questionUid)}" class="small" ${state.sealed || lockedIndex(i) ? "disabled" : ""}`)}${button("replace", "교체", `data-index="${i}" class="small" ${state.sealed || lockedIndex(i) ? "disabled" : ""}`)}</div></div>`,
      )
      .join("");
    return `<section class="panel paper-panel"><div class="paper-toolbar"><div class="actions mode-switch">${modes}</div><span class="muted paper-count">${state.selected.length}문항</span><label class="part-select">문제지<select id="preview-index">${options(
      Array.from({ length: parts }, (_, i) => ({
        value: i,
        label: `${i + 1}권 / ${parts}권${Parts.receipt(state.receipts, i) ? " · 출제됨" : ""}`,
      })),
      state.previewIndex,
      null,
    )}</select></label></div><details id="question-list" class="question-manager" ${state.questionListOpen ? "open" : ""}><summary>문항별 고정·교체 (${state.selected.length}문항)</summary><div class="actions batch-tools">${tools}</div><div class="paper-list">${rows}</div></details><div id="preview-host"><div class="loading">실제 출력 엔진으로 미리보기를 준비합니다.</div></div></section>`;
  }
  function renderMobileActions() {
    if (!state.selected.length) return "";
    const r = review(),
      blocked =
        r.status === "HARD_BLOCK" || (r.warnings.length && !state.ackWarnings);
    return `<div class="mobile-actions">${button("mobile-inspector", "출력·출제 설정")}${button("print", "일반 출력", `class="primary" ${blocked ? "disabled" : ""}`)}${button("assign", state.receipts.length && !state.sealed ? "남은 문제지 출제" : state.receipts.some((r) => !r.ready) ? "PDF 재시도" : "학생 출제", blocked || !state.studentIds.length ? "disabled" : "")}</div>`;
  }
  function renderCompose() {
    return `<div class="intro"><div><h1>${esc(state.title)} <span class="badge">${state.round}차</span></h1><p class="muted">범위를 정하고, 실제 문제지를 보며 필요한 문항만 바꾸세요.</p></div><div class="actions">${button("new-draft", "새 작업")}${button("backup", "작업 파일 저장")}${button("import", "백업 불러오기")}</div></div>
    <div class="workspace"><div>${!state.selected.length ? `<section class="panel compose-setup">${filterMarkup(state.filters, "compose", "primary")}${state.sources.length ? `<div class="callout">선택한 시험 ${state.sources.length}개 안에서 선택합니다. ${button("sources-clear", "전체 아카이브로 변경", 'class="small"')}</div>` : ""}<div class="compose-step compose-range"><div class="compose-step-head"><span class="compose-step-number">3</span><h2>범위</h2></div>${renderScopes()}</div></section>${renderComposition()}` : `<details class="panel plan-panel"><summary>출제 범위·문항 수 설정 ${state.sealed ? "(확정)" : ""}</summary>${filterMarkup(state.filters, "compose", "primary")}<div class="compose-step compose-range"><div class="compose-step-head"><span class="compose-step-number">3</span><h2>범위</h2></div>${renderScopes()}</div>${renderComposition()}</details>${renderPaper()}`}</div>${renderInspector()}</div>${renderMobileActions()}`;
  }
  function recentClassOptions() {
    const grade = state.recentFilters.grade;
    const availableIds = new Set(state.recentRows
      .filter((row) => !grade || row.targetGrade === grade)
      .map((row) => row.classId).filter(Boolean));
    const byId = new Map();
    for (const cls of classRows) {
      const id = String(cls.id || "");
      if (id && availableIds.has(id)) byId.set(id, { value: id, label: cls.name || id });
    }
    for (const row of state.recentRows) {
      if (!row.classId || (grade && row.targetGrade !== grade)) continue;
      if (!byId.has(row.classId)) byId.set(row.classId, { value: row.classId, label: row.className || row.classId });
    }
    return [...byId.values()];
  }
  function renderRecent() {
    const list = drafts(), f = state.recentFilters;
    return `<div class="history-surface"><div class="intro history-intro"><div><h1>최근 출제 · 작업</h1><p class="muted">출제한 시험의 대상과 제출 상태를 확인하거나 만들던 문제지를 이어서 작업하세요.</p></div><div class="actions">${button("new-draft", "새 문제지", 'class="primary"')}${button("import", "작업 파일 불러오기")}</div></div>
      <section class="panel history-panel" aria-labelledby="history-heading"><div class="history-heading"><h2 id="history-heading">최근 출제</h2></div>
      <div class="history-filters">
        <label class="history-period-filter">기간<span class="history-period"><input type="date" data-recent-filter="from" aria-label="시작일" value="${esc(f.from)}"><span aria-hidden="true">~</span><input type="date" data-recent-filter="to" aria-label="끝일" value="${esc(f.to)}"></span></label>
        <label>학년<select data-recent-filter="grade">${options(History.grades, f.grade, "전체 학년")}</select></label>
        <label>반<select id="recent-class">${options(recentClassOptions(), state.recentClassId, "전체 반")}</select></label>
        <label class="history-subject-filter">과목<select data-recent-filter="subject">${options(History.subjectOptions(state.recentRows, f.grade, C), f.subject, "전체 과목")}</select></label>
        <label class="history-title-filter">제목 검색<input type="search" data-recent-filter="query" value="${esc(f.query)}"></label>
      </div><div id="recent-assignments" aria-live="polite" aria-busy="${state.recentLoading}">${recentAssignmentMarkup()}</div></section>
      <aside class="history-drafts" aria-labelledby="history-drafts-heading"><h2 id="history-drafts-heading">만들던 문제지</h2>${list.length ? list.map((d, i) => `<div class="history-draft"><div><h3>${esc(d.header?.title || d.title)}</h3><p class="muted">${esc(new Date(d.updatedAt).toLocaleString("ko-KR"))} · ${d.selected?.length || 0}문항 · ${d.round || 1}차</p></div><div class="actions">${button("restore", "이어하기", `data-draft="${i}"`)}${button("delete-draft", "삭제", `data-draft="${i}" class="danger"`)}</div></div>`).join("") : '<div class="empty">저장된 작업이 없습니다.</div>'}</aside></div>`;
  }
  function recentAssignmentMarkup() {
    if (state.recentLoading) return '<p class="muted history-result-state">출제 내역을 불러오는 중…</p>';
    if (state.recentError) return `<p class="error history-result-state">${esc(state.recentError)}</p>`;
    const rows = History.filterAssignments(state.recentRows, {
      ...state.recentFilters, classId: state.recentClassId,
    });
    return History.groupByDate(rows).map((group) =>
      `<section class="history-date-group"><h3 class="history-date-heading">${group.date ? `<time datetime="${esc(group.date)}">${esc(group.date)}</time>` : "—"}<small class="muted">${group.rows.length}개</small></h3><div class="history-grid">${group.rows.map((a) => {
        const paperMeta = [a.contentGrade, a.subjectLabel].filter(Boolean).join(" · ");
        const metadata = [a.targetGrade ? `대상 ${a.targetGrade}` : "",
          paperMeta ? `시험지 ${paperMeta}` : "", a.className,
          a.questionCount === null ? "" : `${a.questionCount}문항`,
          a.recipientCount === null ? "" : `대상 ${a.recipientCount}명`,
          a.submittedCount === null ? "" : `제출 ${a.submittedCount}명`].filter(Boolean);
        return `<article class="history-card"><h3>${esc(a.title)}</h3><div class="history-card-meta muted">${metadata.map((value) => `<span>${esc(value)}</span>`).join("")}</div><div class="history-card-footer"><span class="history-pdf ${a.pdfReady ? "" : "muted"}">${a.pdfReady ? "PDF 준비 완료" : "출제 저장됨 · PDF 확인 필요"}</span>${button("assignment-status", "학생별 확인 · 출력", `data-assignment="${esc(a.id)}" class="small"`)}</div></article>`;
      }).join("")}</div></section>`
    ).join("") || '<p class="muted history-result-state">현재 조건에 맞는 출제 내역이 없습니다.</p>';
  }
  function updateRecentResults() {
    const host = $("recent-assignments");
    if (host) {
      host.innerHTML = recentAssignmentMarkup();
      host.setAttribute("aria-busy", String(state.recentLoading));
    }
  }
  function changeRecentFilter(el) {
    const key = el.dataset.recentFilter;
    if (!Object.hasOwn(state.recentFilters, key)) return;
    state.recentFilters[key] = el.value;
    if (key === "grade") {
      const subjects = History.subjectOptions(state.recentRows, el.value, C);
      if (!subjects.some((item) => item.value === state.recentFilters.subject))
        state.recentFilters.subject = "";
      const field = document.querySelector('[data-recent-filter="subject"]');
      if (field) field.innerHTML = options(subjects, state.recentFilters.subject, "전체 과목");
      const classes = recentClassOptions();
      if (state.recentClassId && !classes.some((item) => item.value === state.recentClassId))
        state.recentClassId = "";
      const classField = $("recent-class");
      if (classField) classField.innerHTML = options(classes, state.recentClassId, "전체 반");
    }
    // Update only the result host: date/search inputs retain focus and IME state.
    updateRecentResults();
  }
  async function loadRecent() {
    const version = ++state.recentLoadVersion;
    state.recentLoading = true;
    state.recentError = "";
    state.recentAssignments = [];
    state.recentRows = [];
    updateRecentResults();
    try {
      if (!classRows.length) {
        const data = await api("/qr-classes");
        if (version !== state.recentLoadVersion) return;
        classRows = Array.isArray(data.classes) ? data.classes : [];
      }
      const data = await api("/class-exam-assignments?history=1");
      if (version !== state.recentLoadVersion) return;
      state.recentAssignments = Array.isArray(data.assignments) ? data.assignments : [];
      state.recentRows = History.normalizeAssignments(
        state.recentAssignments, classRows, state.catalog.exams, C,
      );
      if (state.recentClassId && !state.recentRows.some((row) => row.classId === state.recentClassId))
        state.recentClassId = "";
      const subjects = History.subjectOptions(state.recentRows, state.recentFilters.grade, C);
      if (state.recentFilters.subject && !subjects.some((item) => item.value === state.recentFilters.subject))
        state.recentFilters.subject = "";
    } catch (error) {
      if (version !== state.recentLoadVersion) return;
      state.recentError = error.message || "출제 내역을 불러오지 못했습니다.";
      throw error;
    } finally {
      if (version === state.recentLoadVersion) {
        state.recentLoading = false;
        if (state.view === "recent") render();
      }
    }
  }
  async function assignmentStatus(id) {
    const data = await api(
      "/class-exam-assignments/" + encodeURIComponent(id) + "/status",
    );
    state.openAssignment = data;
    const a = data.assignment,
      active = data.students.filter((s) => !s.excluded),
      excluded = data.students.filter((s) => s.excluded);
    showDialog(
      a.exam_title,
      `<p>${esc(a.exam_date)} · ${a.question_count}문항 · 출제 대상 ${active.length}명 · 제외 ${excluded.length}명</p><div class="callout">학생 포털의 ‘내 시험지’에 표시됩니다. ${a.pdf_status === "ready" ? "PDF 준비 완료" : "PDF 파일은 아직 준비되지 않았지만 온라인 문제·정답·해설과 오답 입력을 사용할 수 있습니다."}</div><div class="actions">${["exam", "ans", "sol"].map((m, i) => button("assignment-output", ["문제지", "정답", "해설"][i], `data-mode="${m}"`)).join("")}${a.pdf_status !== "ready" ? button("assignment-pdf", "PDF 다시 준비", `data-assignment="${a.id}"`) : ""}</div><h3>학생별 확인</h3><div class="assignment-students">${active.map((s) => `<div class="recent-row"><span>${esc(s.name)}</span><span>${s.session_id ? "오답 입력 완료" : "오답 입력 전"}</span><a href="../apmath/student/index.html?teacher_preview=1&student_id=${encodeURIComponent(s.student_id)}" target="_blank">학생 화면 확인</a></div>`).join("")}</div>${excluded.length ? `<details><summary>제외한 학생 ${excluded.length}명</summary><p>${excluded.map((s) => esc(s.name)).join(" · ")}</p></details>` : ""}`,
    );
  }
  function assignmentOutput(mode) {
    const a = state.openAssignment.assignment,
      p = JSON.parse(a.mixed_payload_json || "null"),
      u = O.engineUrl(
        a.archive_file.startsWith("MIXED:")
          ? "mixed_engine.html"
          : "engine.html",
        location.href,
      );
    if (a.archive_file.startsWith("MIXED:")) {
      const key = a.archive_file.slice(6);
      localStorage.setItem(
        "mixedQuestions_" + key,
        JSON.stringify(p.questions),
      );
      localStorage.setItem("mixedMeta_" + key, JSON.stringify(p.meta));
      u.searchParams.set("key", key);
    } else {
      u.searchParams.set("data", a.archive_file);
      if (p?.meta?.sourceKind === "archive2-original") {
        const key = "original-" + a.id;
        localStorage.setItem("archive2Original_" + key, JSON.stringify(p));
        u.searchParams.set("originalSnapshot", key);
      }
    }
    O.applyUrl(u, {
      header: p?.meta?.printHeaderOptions,
      qpp: p?.meta?.qpp || a.pdf_qpp,
      includeQr: p?.meta?.includeQr,
    });
    if (a.archive_file.startsWith("MIXED:")) u.searchParams.set("studio", "1");
    u.searchParams.set("mode", mode);
    u.searchParams.set("assignmentId", a.id);
    window.open(u.href, "_blank");
  }
  function renderHealth() {
    const h = state.catalog.health,
      reasons = {
        identity: "문항 등록 확인 필요",
        grade: "출처·단원 학년 충돌",
        source: "원본 일치 여부 확인 필요",
        taxonomy: "단원 분류 확인 필요",
        review: "검수 승인 전",
        difficulty: "난이도 규칙 확인 필요",
        applicability: "기본 출력 범위 밖",
        conflict: "원본 분류 정보 충돌",
      };
    return `<div class="intro"><div><h1>데이터 상태</h1><p class="muted">전체 자료와 문제지 만들기에 사용 가능 범위를 구분합니다. 제외 사유는 서로 중복될 수 있습니다.</p></div>${button("health-export", "진단 JSON 내보내기")}</div><div class="metrics">${[
      ["시험", h.exams],
      ["전체 문항", h.questions],
      ["자동출제 가능", h.automatic],
      ["metadata records", h.metadataRecords],
    ]
      .map(
        ([l, n]) =>
          `<div class="metric"><span class="muted">${l}</span><strong>${Number(n || 0).toLocaleString()}</strong></div>`,
      )
      .join(
        "",
      )}</div><section class="panel"><h2>자동출제 제외 근거</h2><table class="health-table"><tbody>${Object.entries(
      reasons,
    )
      .map(([k, l]) => `<tr><th>${l}</th><td>${h[k] || 0}</td></tr>`)
      .join(
        "",
      )}</tbody></table><div class="callout">미분류는 보류와 다른 상태입니다. 기존 난이도 하·중·상을 숫자로 추정하지 않습니다. 검수 대기나 원본 불일치는 원본 시험 열기를 막지 않으며 문제지 자동 선택에서 제외합니다.</div><div class="callout">교육과정 간 연결 검수: 기존 연결 ${state.crosswalkInventory?.total ?? "확인 불가"}개 · 승인된 EXACT ${state.crosswalkInventory?.reviewedExact ?? "확인 불가"}개. 문제지 자동 선택은 선택한 교육과정 안에서 수행합니다. <a href="data/archive2-crosswalk-inventory.json" target="_blank">연결 근거 보기</a></div><p class="muted">정본: RPM Primary v1.0 · Difficulty v1.3 · Metadata Contract v2<br>catalog ${esc(state.catalog.indexVersion.slice(0, 16))}</p></section>`;
  }
  function renderControls() {
    const inspector = document.querySelector(".inspector");
    if (inspector) inspector.outerHTML = renderInspector();
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
  function render() {
    if (!state.catalog) return;
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
      b.classList.toggle("active", b.dataset.view === state.view);
      b.setAttribute(
        "aria-current",
        b.dataset.view === state.view ? "page" : "false",
      );
    });
    document.body.dataset.archiveView = state.view;
    $("content").innerHTML =
      state.view === "home"
        ? renderHome()
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
      ]);
    if (state.prepared.signature === signature) return state.prepared;
    const prepared = [];
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
              "이미 출제한 문제지의 문항이 변경되었습니다. 최근 출제에서 원본을 확인해 주세요.",
            );
          frozenPaperCache.set(saved.key, {
            key: saved.key,
            index,
            questions: payload.questions,
            meta: payload.meta,
          });
        }
        const frozen = frozenPaperCache.get(saved.key);
        localStorage.setItem(
          "mixedQuestions_" + frozen.key,
          JSON.stringify(frozen.questions),
        );
        localStorage.setItem(
          "mixedMeta_" + frozen.key,
          JSON.stringify(frozen.meta),
        );
        prepared.push(frozen);
        continue;
      }
      const part = await Source.restore(
          records.slice(i, i + 50),
          state.catalog,
        ),
        partSignature = JSON.stringify([
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
        subject: C.subjectProjectionLabel(state.filters),
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
      localStorage.setItem("mixedQuestions_" + key, JSON.stringify(part));
      localStorage.setItem("mixedMeta_" + key, JSON.stringify(meta));
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
      ])
    )
      throw new Error("편집 내용이 변경되었습니다. 다시 시도하세요.");
    prepared.signature = signature;
    state.prepared = prepared;
    return prepared;
  }
  function outputUrl(paper, mode = state.outputMode, preview = true) {
    const url = O.engineUrl("mixed_engine.html", location.href);
    url.searchParams.set("key", paper.key);
    url.searchParams.set("qpp", state.qpp);
    url.searchParams.set("q", paper.questions.length);
    url.searchParams.set("mode", mode);
    url.searchParams.set("studio", "1");
    O.applyUrl(url, {
      header: paper.meta.printHeaderOptions,
      qpp: paper.meta.qpp,
      includeQr: paper.meta.includeQr,
    });
    if (preview) url.searchParams.set("archive2Review", "1");
    return url.href;
  }
  async function updatePreview() {
    const host = $("preview-host");
    if (!host) return;
    const token = (state.previewToken = (state.previewToken || 0) + 1);
    try {
      const papers = await prepare();
      if (host !== $("preview-host") || token !== state.previewToken) return;
      state.previewIndex = Math.min(state.previewIndex, papers.length - 1);
      const frame = document.createElement("iframe");
      frame.className = "preview";
      frame.title = "실제 문제지 미리보기";
      frame.src = outputUrl(papers[state.previewIndex]);
      frame.addEventListener("load", () => {
        const doc = frame.contentDocument;
        if (!doc) return;
        const complete = () => {
          if (token === state.previewToken)
            host.setAttribute("aria-busy", "false");
        };
        const observer = new MutationObserver(() => {
          if (!doc.querySelector("#print-area .page")) return;
          observer.disconnect();
          const ready = frame.contentWindow.__AP_RENDER_READY__;
          if (ready && typeof ready.then === "function")
            ready.then(complete, complete);
          else complete();
        });
        if (doc.querySelector("#print-area .page")) complete();
        else observer.observe(doc.body, { childList: true, subtree: true });
        doc.addEventListener("click", (event) => {
          if (state.sealed || state.busy) return;
          const box = event.target.closest?.(".q-box[data-source-ref]");
          if (!box) return;
          const i = state.selected.findIndex((r) =>
            box.dataset.sourceRef.endsWith("#" + r.questionUid),
          );
          if (i >= 0) replace(i);
        });
      });
      const progress = document.createElement("div");
      progress.className = "preview-progress";
      progress.textContent = "문제지를 준비하고 있습니다.";
      host.setAttribute("aria-busy", "true");
      host.replaceChildren(frame, progress);
    } catch (e) {
      if (host === $("preview-host") && token === state.previewToken) {
        host.setAttribute("aria-busy", "false");
        host.textContent = e.message;
        status(e.message, true);
      }
    }
  }
  function generate(rebuild = false) {
    if (state.sealed) return;
    if (state.receipts.length || (rebuild && state.selected.length > 50)) {
      rebuildUnissued();
      return;
    }
    state.seed = crypto.randomUUID();
    const req = request();
    if (!rebuild) req.pins = [];
    const ctx = context();
    if (rebuild)
      ctx.current = state.selected
        .filter((r) => !state.pins.includes(r.questionUid))
        .map((r) => r.questionUid);
    const result = C.selectBlueprint(pool(), req, ctx);
    if (!result.ok) {
      showDialog(
        "현재 조건에서 문항이 부족합니다",
        `<p>${result.errors.map(esc).join("<br>")}</p>${result.shortages.map((s) => `<div class="callout">${esc(req.rows.find((r) => r.id === s.id)?.label || "선택 범위")} · 요청 ${s.requested}, 선택 가능 ${s.selected}, 부족 ${s.shortage}</div>`).join("")}<p>문항 수·난이도·범위 또는 이력 정책을 직접 변경한 뒤 다시 만들어 주세요.</p>`,
      );
      return;
    }
    state.selected = result.selected;
    state.rows = req.rows;
    state.indexVersion = state.catalog.indexVersion;
    state.prepared = [];
    state.undo = [];
    state.previewIndex = 0;
    state.ackWarnings = false;
    if (!rebuild) state.pins = [];
    save();
    render();
    status(
      `${result.selected.length}문항 선택 · 중복 없음 · ${result.diagnostics.elapsedMs}ms`,
    );
  }
  function showDialog(title, body) {
    $("modal").classList.remove("original-issue-dialog");
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
        C.eligibility(r).ok &&
        C.matches(r, selectionFilters) &&
        C.rowMatches(r, row) &&
        !used.has(r.questionUid) &&
        !excluded.has(r.questionUid),
    ).sort(C.compareNewest);
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
  async function print() {
    const popup = window.open("about:blank", "_blank");
    try {
      const papers = await finalGate();
      if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
      popup.location.href = outputUrl(
        papers[state.previewIndex],
        state.outputMode,
        false,
      );
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
        `<p>${esc(e.message)}</p><a href="index.html" target="_blank">기존 아카이브에서 로그인</a><p class="muted">로그인 후 이 창으로 돌아와 학생 선택을 다시 누르세요.</p>`,
      );
    }
  }
  async function loadRoster(id) {
    const data = await api(
      "/class-exam-assignments/roster?class_id=" + encodeURIComponent(id),
    );
    rosterRows = data.students || [];
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
          subject: C.subjectProjectionLabel(state.filters),
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
    const result = C.selectBlueprint(pool(), req, ctx);
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
  function urlState() {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("view", state.view);
    if (state.view === "find")
      for (const [k, v] of Object.entries(state.find))
        if (v) url.searchParams.set(k, v);
    history.pushState(null, "", url);
  }
  function newDraft() {
    if (state.selected.length) save();
    Object.assign(state, {
      draftId: crypto.randomUUID(),
      selected: [],
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
      indexVersion: state.catalog.indexVersion,
      view: "compose",
    });
    render();
    scheduleSave();
  }
  document.addEventListener("click", async (event) => {
    const b = event.target.closest("button");
    if (!b || b.disabled || state.busy) return;
    try {
      if (b.dataset.view) {
        state.view = b.dataset.view;
        urlState();
        render();
        if (state.view === "recent") await loadRecent();
        return;
      }
      const a = b.dataset.action;
      if (a === "assignment-status") {
        await assignmentStatus(b.dataset.assignment);
        return;
      }
      if (a === "assignment-output") {
        assignmentOutput(b.dataset.mode);
        return;
      }
      if (a === "assignment-pdf") {
        b.disabled = true;
        await api(
          "/class-exam-assignments/" + b.dataset.assignment + "/pdf",
          {},
        );
        await assignmentStatus(b.dataset.assignment);
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
      if (a === "close-inspector") {
        state.mobileInspectorOpen = false;
        renderControls();
        return;
      }
      if (
        state.receipts.length &&
        [
          "scope-all",
          "scope-clear",
          "scope-range",
          "scope-group",
          "bucket",
          "source-toggle",
          "sources-clear",
          "targets-clear",
        ].includes(a)
      )
        throw new Error(
          "이미 출제한 문제지를 보존하려면 남은 문제지의 문항을 교체해 주세요. 범위나 대상을 바꾸려면 새 작업을 시작하세요.",
        );
      if (["generate", "rebuild", "assign", "print"].includes(a) && state.busy)
        return;
      if (a === "mobile-inspector") {
        state.mobileInspectorOpen = !state.mobileInspectorOpen;
        renderControls();
        return;
      }
      if (a === "close-dialog") {
        if (!originalIssueBusy()) $("modal").close();
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
        if (target) location.href = String(target);
      } else if (a === "home-grade") {
        state.find = { grade: b.dataset.grade || "" };
        state.view = "find";
        state.page = 0;
        urlState();
        render();
      } else if (a === "home-search") {
        const query = $("archive-home-query")?.value.trim() || "";
        state.find = query ? { query } : {};
        state.view = "find";
        state.page = 0;
        urlState();
        render();
      } else if (a === "go-compose") {
        state.view = "compose";
        if (state.find.grade) state.filters.grade = state.find.grade;
        if (C.hasSubjectProjection?.(state.find.grade)) {
          state.filters.semanticSubject = state.find.semanticSubject || "";
          state.filters.courseKey = "";
          state.filters.family = "";
        } else {
          state.filters.semanticSubject = "";
          state.filters.family = "";
          if (state.find.courseKey) state.filters.courseKey = state.find.courseKey;
        }
        state.filters = C.reconcileFinderFilters(
          state.filters,
          state.catalog.taxonomy,
        );
        if (!state.receipts.length && !state.sealed)
          reconcileFinderSchool(state.filters);
        state.scopes = [];
        delete state.filters.L3;
        delete state.filters.L4;
        urlState();
        render();
      } else if (a === "finder-search") {
        state.find.query = $("finder-query")?.value || "";
        state.page = 0;
        urlState();
        render();
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
        ])
          state.find[key] = "";
        state.page = 0;
        urlState();
        render();
      } else if (a === "page-prev") {
        state.page--;
        render();
      } else if (a === "material") {
        state.find.material = b.dataset.material;
        reconcileFinderSchool(state.find);
        state.page = 0;
        urlState();
        render();
      } else if (a === "page-next") {
        state.page++;
        render();
      } else if (a === "source-toggle") {
        const f = state.catalog.exams[Number(b.dataset.exam)].file;
        state.sources = state.sources.includes(f)
          ? state.sources.filter((x) => x !== f)
          : [...state.sources, f];
        invalidate();
        render();
      } else if (a === "source-issue") {
        openOriginalIssue(state.catalog.exams[Number(b.dataset.exam)], "targets");
      } else if (a === "original-print") {
        await originalPrint();
      } else if (a === "source-preview") {
        openOriginalIssue(state.catalog.exams[Number(b.dataset.exam)], "review");
      } else if (a === "original-review" || a === "original-targets") {
        setOriginalStep(a === "original-review" ? "review" : "targets");
      } else if (a === "sources-clear") {
        state.sources = [];
        invalidate();
        render();
      } else if (
        a === "scope-all" ||
        a === "scope-clear" ||
        a === "scope-group" ||
        a === "scope-range"
      ) {
        if (state.sealed) return;
        const scopes = scopeOptions();
        if (a === "scope-clear") state.scopes = [];
        else if (a === "scope-all") state.scopes = scopes.map((s) => s.key);
        else if (a === "scope-group") {
          const g = unique(scopes.map((s) => s.L1))[
            Number(b.dataset.groupIndex)
          ];
          state.scopes = unique([
            ...state.scopes,
            ...scopes.filter((s) => s.L1 === g).map((s) => s.key),
          ]);
        } else {
          const from = Number($("scope-start").value),
            to = Number($("scope-end").value);
          if (from > to)
            throw new Error("끝 단원은 시작 단원 뒤에 있어야 합니다.");
          state.scopes = scopes.slice(from, to + 1).map((s) => s.key);
        }
        invalidate();
        render();
      } else if (a === "bucket") {
        const n = Number(b.dataset.bucket),
          row = b.dataset.row;
        const values = row
          ? state.custom[row]?.buckets || state.buckets
          : state.buckets;
        const next = values.includes(n)
          ? values.filter((v) => v !== n)
          : [...values, n].sort();
        if (!next.length) throw new Error("난이도를 하나 이상 선택하세요.");
        if (row) state.custom[row] = { ...state.custom[row], buckets: next };
        else state.buckets = next;
        invalidate();
        render();
      } else if (a === "generate" || a === "rebuild") generate(a === "rebuild");
      else if (a === "inspector") {
        state.inspector = b.dataset.tab;
        renderControls();
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
      else if (a === "print") await print();
      else if (a === "assign") await assign();
      else if (a === "next-round") {
        if (!state.sealed) return;
        state.rounds.push({
          roundNo: state.round,
          questionUids: state.selected.map((r) => r.questionUid),
        });
        state.round++;
        state.issueDate = "";
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
      } else if (a === "delete-draft") {
        const list = drafts();
        list.splice(Number(b.dataset.draft), 1);
        localStorage.setItem(storageKey(), JSON.stringify(list));
        render();
      } else if (a === "new-draft") newDraft();
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
                reasons: C.eligibility(r).reasons,
              })),
          },
          "archive2-health.json",
        );
    } catch (e) {
      status(e.message, true);
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.id !== "archive-home-search") return;
    event.preventDefault();
    const query = $("archive-home-query")?.value.trim() || "";
    state.find = query ? { query } : {};
    state.view = "find";
    state.page = 0;
    urlState();
    render();
  });
  document.addEventListener("change", async (event) => {
    if (state.busy) return;
    const el = event.target;
    try {
      if (el.dataset.outputField) {
        changeOutput(el);
        return;
      }
      if (el.id === "recent-class") {
        state.recentClassId = el.value;
        updateRecentResults();
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
        if (state.sealed && el.dataset.group === "compose") {
          render();
          return;
        }
        const dest = el.dataset.group === "find" ? state.find : state.filters;
        dest[el.dataset.filter] = el.value;
        if (el.dataset.group === "compose") {
          if (el.dataset.filter === "L3") delete state.filters.L4;
          if (
            ["grade", "curriculumKey", "courseKey", "semanticSubject"].includes(
              el.dataset.filter,
            )
          ) {
            state.scopes = [];
            delete state.filters.L3;
            delete state.filters.L4;
            if (el.dataset.filter === "grade") {
              state.filters.curriculumKey = "";
              state.filters.courseKey = "";
              state.filters.semanticSubject = "";
              state.filters.family = "";
              state.filters.school = "";
            }
            if (
              el.dataset.filter === "curriculumKey" &&
              !C.hasSubjectProjection?.(state.filters.grade)
            )
              state.filters.courseKey = "";
            if (el.dataset.filter === "semanticSubject") {
              state.filters.courseKey = "";
              state.filters.family = "";
            }
            state.filters = C.reconcileFinderFilters(
              state.filters,
              state.catalog.taxonomy,
            );
            reconcileFinderSchool(state.filters);
          }
          invalidate();
        } else {
          if (el.dataset.filter === "grade") {
            state.find.semanticSubject = "";
            state.find.family = "";
          }
          if (el.dataset.filter === "semanticSubject") {
            state.find.courseKey = "";
            state.find.family = "";
          }
          if (
            ["grade", "curriculumKey", "courseKey", "semanticSubject"].includes(
              el.dataset.filter,
            )
          )
            Object.assign(
              state.find,
              C.reconcileFinderFilters(state.find, state.catalog.taxonomy),
            );
          if (
            ["material", "grade", "curriculumKey", "courseKey", "semanticSubject"].includes(
              el.dataset.filter,
            )
          )
            reconcileFinderSchool(state.find);
          state.page = 0;
          urlState();
        }
        render();
      } else if (el.dataset.scope) {
        const scope = scopeOptions().find((item) => item.key === el.dataset.scope);
        const legacyPaths = scope?.paths || [];
        state.scopes = el.checked
          ? [
              ...state.scopes.filter((x) => !legacyPaths.includes(x)),
              el.dataset.scope,
            ]
          : state.scopes.filter(
              (x) => x !== el.dataset.scope && !legacyPaths.includes(x),
            );
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
    if (event.target.dataset.recentFilter === "query") {
      if (!event.isComposing) changeRecentFilter(event.target);
      return;
    }
    const el = event.target;
    if (el.dataset.outputField) {
      changeOutput(el);
      return;
    }
    if (el.id === "count" && !state.busy && !state.receipts.length) {
      state.count = Number(el.value);
      state.rows = [];
      state.selected = [];
      state.prepared = [];
      scheduleSave();
      const panel = el.closest(".panel"),
        fragment = document.createElement("template");
      fragment.innerHTML = renderComposition();
      const fresh = fragment.content.firstElementChild;
      for (const selector of [".composition", ".resultbar"]) {
        const old = panel?.querySelector(selector),
          next = fresh.querySelector(selector);
        if (old && next) old.replaceWith(next);
      }
      panel?.querySelectorAll(".callout.danger").forEach((n) => n.remove());
      const shortage = fresh.querySelector(".callout.danger");
      if (shortage)
        panel.insertBefore(shortage, panel.querySelector(".resultbar"));
      if (
        !Number.isInteger(state.count) ||
        state.count < 1 ||
        state.count > 400
      ) {
        const action = panel.querySelector('[data-action="generate"]');
        if (action) action.disabled = true;
      }
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
      clearTimeout(previewTimer);
      previewTimer = setTimeout(updatePreview, 450);
    }
  }
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
  window.addEventListener("message", (event) => {
    const frame = $("original-issue-frame");
    if (
      event.origin !== location.origin ||
      !frame ||
      event.source !== frame.contentWindow
    )
      return;
    if (event.data?.type === "archive2-original-close") $("modal").close();
    if (event.data?.type === "archive2-original-ready")
      frame.contentWindow.setArchive2OriginalSettings?.(state.originalSettings);
    if (event.data?.type === "archive2-original-saved") {
      const a = event.data.assignment;
      state.originalReceipts = (state.originalReceipts || []).filter(
        (r) => r.id !== a.id,
      );
      state.originalReceipts.push({ id: a.id, key: event.data.key });
      $("modal")
        .querySelectorAll(
          "[data-output-settings] input,[data-output-settings] select",
        )
        .forEach((el) => (el.disabled = true));
      $("original-receipts").innerHTML =
        `<div class="callout"><strong>${state.originalReceipts.length}개 반에 출제 저장 완료</strong><p>선택한 학생의 ‘내 시험지’에 표시됩니다. 문제·정답·해설 확인과 오답 입력이 가능합니다.${a.pdf_status === "ready" ? "" : " PDF 파일은 다시 준비해야 합니다."}</p>${state.originalReceipts.map((r) => button("assignment-status", "학생별 확인 · 출력", `data-assignment="${r.id}"`)).join("")}</div>`;
    }
  });
  $("modal").addEventListener("cancel", (event) => {
    if (originalIssueBusy()) event.preventDefault();
  });
  window.addEventListener("pagehide", save);
  window.addEventListener("popstate", async () => {
    readUrl();
    render();
    if(state.view==='recent'){try{await loadRecent();}catch(e){status(e.message,true);}}
  });
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.view = ["home", "find", "compose", "recent", "health"].includes(p.get("view"))
      ? p.get("view")
      : "home";
    state.find = {};
    for (const k of [
      "grade",
      "curriculumKey",
      "courseKey",
      "semanticSubject",
      "school",
      "yearFrom",
      "yearTo",
      "axis",
      "query",
      "family",
      "material",
    ])
      if (p.has(k)) state.find[k] = p.get(k);
    state.page = 0;
    if (state.catalog?.taxonomy) {
      const before = JSON.stringify(state.find);
      Object.assign(
        state.find,
        C.reconcileFinderFilters(state.find, state.catalog.taxonomy),
      );
      if (state.view === "find" && before !== JSON.stringify(state.find))
        replaceFinderUrlState();
    }
  }
  function replaceFinderUrlState() {
    if (state.view !== "find") return;
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("view", state.view);
    for (const [key, value] of Object.entries(state.find))
      if (value) url.searchParams.set(key, value);
    history.replaceState(null, "", url);
  }
  (async () => {
    try {
      const response = await fetch("data/archive2-catalog.json", {
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("문항 목록을 불러오지 못했습니다");
      state.catalog = C.decodeCatalog(await response.json());
      if (window.applyArchiveMetaFoundationCatalog) {
        state.catalog = await window.applyArchiveMetaFoundationCatalog(state.catalog);
      }
      state.crosswalkInventory = await fetch(
        "data/archive2-crosswalk-inventory.json",
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      state.indexVersion = state.catalog.indexVersion;
      state.finderIndex = C.buildFinderIndex(state.catalog);
      state.byUid = new Map(
        state.catalog.records
          .filter((r) => r.questionUid)
          .map((r) => [r.questionUid, r]),
      );
      readUrl();
      render();
      status(
        `시험 ${state.catalog.health.exams}개 · 전체 ${state.catalog.health.questions.toLocaleString()}문항 · 문제지 만들기에 사용 가능 ${state.catalog.health.automatic.toLocaleString()}문항`,
      );
      const previous = drafts();
      if(state.view==='recent'){try{await loadRecent();}catch(e){status(e.message,true);}}
      if (previous.length && state.view === "compose")
        showDialog(
          "이전 작업이 있습니다",
          `<p>${esc(previous[0].header?.title || previous[0].title)} · ${previous[0].selected?.length || 0}문항</p>${button("restore", "이전 작업 복원", 'data-draft="0" class="primary"')} ${button("close-dialog", "새로 시작")}`,
        );
    } catch (e) {
      $("content").innerHTML =
        `<div class="empty">${esc(e.message)}<p><a href="index.html">기존 아카이브 열기</a></p></div>`;
      status(e.message, true);
    }
  })();
})();
