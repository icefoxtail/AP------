// Archive2 workspace, save part: error wording, drafts, save, assign panel, saved-paper revision.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const Source = window.Archive2Source;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, META_FACET_FILTERS, QuickTree, SAVED_PAPER_UUID, api, assessmentSelectionOptions, button,
    clearUidRoute, composeSubjectLabel, ensureShardFiles, esc, finalGate, frozenPaperCache, originalSettingsForExam,
    ownHistoryContext, planRows, pool, prepare, reconcileFinderSchool, reconcileUnifiedFilters, refreshHistory,
    rememberCurrentHistoryEntry, render, renderControls, renderMobileActions, replaceUrlState, request,
    review, routeUrl, saveWorkSignature, savedPaperIds, scopeOptions, seal, selectedScopePaths,
    selectedScopeQuestionUids, showDialog, state, storageKey, teacherSessionOk, unifiedIndex, unique,
    updateOriginalPreview, workspaceMatchOptions;
  WS.links.push(() => {
    ({
      $, META_FACET_FILTERS, QuickTree, SAVED_PAPER_UUID, api, assessmentSelectionOptions, button,
      clearUidRoute, composeSubjectLabel, ensureShardFiles, esc, finalGate, frozenPaperCache, originalSettingsForExam,
      ownHistoryContext, planRows, pool, prepare, reconcileFinderSchool, reconcileUnifiedFilters, refreshHistory,
      rememberCurrentHistoryEntry, render, renderControls, renderMobileActions, replaceUrlState, request,
      review, routeUrl, saveWorkSignature, savedPaperIds, scopeOptions, seal, selectedScopePaths,
      selectedScopeQuestionUids, showDialog, state, storageKey, teacherSessionOk, unifiedIndex, unique,
      updateOriginalPreview, workspaceMatchOptions
    } = WS.api);
  });
  V.classRows = [];
  let autosaveTimer;
  const HANGUL = /[가-힣]/;
  // Text for teachers: Korean messages are already written for them; anything else (a code, English) is replaced by
  // `fallback`. The original error keeps its `code`/`message` for diagnosis.
  const GENERIC_ERROR = "작업을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
  // The text for a teacher AND the folded detail come from one place, archive2-error-detail.js:
  //   headline (one Korean sentence) + which exam/question failed (when the error knows) + the original text for the detail.
  // Without that module the old rule applies: Korean as written, anything else replaced by `fallback`.
  function describeError(error, fallback = GENERIC_ERROR, extra = {}) {
    const detailApi = typeof window !== "undefined" ? window.Archive2ErrorDetail : null;
    if (detailApi) return detailApi.describe(error, { fallback, screen: typeof screenLabel === "function" ? screenLabel() : "", ...extra });
    // Same rule as status(): a leading CODE: is dropped and the Korean reason behind it is kept.
    const text = String(typeof error === "string" ? error : error?.message || "").replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
    const message = HANGUL.test(text) ? text : fallback;
    return { headline: message, where: "", message, hasDetail: false };
  }
  function teacherErrorMessage(error, fallback = GENERIC_ERROR) {
    return describeError(error, fallback).message;
  }
  // Errors also get a fixed, dismissible alert so a failure below the fold (or behind a dialog) is not missed.
  let errorToastEl = null;
  let errorToastCloseHooked = false;
  let errorToastLoginEl = null;
  function hideErrorToast() {
    try { errorToastEl?.parentNode?.removeChild(errorToastEl); } catch {}
  }
  // `info` is describeError()'s result: when it has a detail, the folded "상세 보기" block (original text, file, question
  // number, code, copy button) goes under the sentence. Without a detail the box stays one line, as before.
  // options.login: 로그인이 없거나 만료돼 막힌 경우. 보관함·출제 패널의 로그인 안내와 같은 "선생님 로그인" 단추(새 탭)를 함께 보인다.
  function showErrorToast(message, info = null, options = {}) {
    try {
      if (typeof document.createElement !== "function" || !document.body) return;
      if (!errorToastEl) {
        const box = document.createElement("div");
        box.className = "error-toast";
        box.setAttribute("role", "alert");
        const text = document.createElement("p");
        text.className = "error-toast-text";
        const detail = document.createElement("div");
        detail.className = "error-toast-detail";
        const login = document.createElement("a");
        login.className = "button-like primary error-toast-login";
        login.href = "../apmath/";
        login.target = "_blank";
        login.rel = "noopener";
        login.textContent = "선생님 로그인";
        login.hidden = true;
        errorToastLoginEl = login;
        const close = document.createElement("button");
        close.type = "button";
        close.className = "error-toast-close";
        close.setAttribute("aria-label", "오류 알림 닫기");
        close.textContent = "닫기";
        close.addEventListener("click", hideErrorToast);
        box.append(text, detail, login, close);
        errorToastEl = box;
      }
      errorToastEl.firstChild.textContent = message;
      if (errorToastLoginEl) errorToastLoginEl.hidden = !options.login;
      const detailSlot = errorToastEl.children[1];
      if (detailSlot) detailSlot.innerHTML = info?.hasDetail && window.Archive2ErrorDetail ? window.Archive2ErrorDetail.markup(info) : "";
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
  // `cause` is the caught error: it carries the file / question number (error.apDetail) and the original text for the folded detail.
  function status(message, error = false, cause = null) {
    let info = null;
    if (error) {
      // Last line of defence: a leading CODE: or a non-Korean (English) message never reaches the teacher as-is
      // (the original text moves to the folded detail and the console).
      const raw = String(message ?? "");
      const stripped = raw.replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
      // A Korean sentence the caller wrote itself stays the headline, even when the caught error adds the location.
      // (When the caller just passed error.message along, describeError() decides, so the text is not said twice.)
      const callerWrote = cause && HANGUL.test(stripped) && stripped !== String(cause.message ?? "").replace(/^[A-Z][A-Z0-9_]{3,}:\s*/, "");
      info = cause && typeof cause === "object"
        ? describeError(cause, GENERIC_ERROR, callerWrote ? { headline: stripped } : {})
        : describeError(raw, GENERIC_ERROR);
      message = info.message;
      if (message !== raw) console.warn("[archive2] error text replaced for display:", raw);
    }
    $("status").textContent = message;
    $("status").classList.toggle("error", error);
    // 요청이 나가기 전 로그인 없음(requestNotSent)과 401(로그인 만료)에는 로그인 단추를 붙인다. 403(권한 없음)에는 붙이지 않는다.
    const needsLogin = Boolean(cause && typeof cause === "object" && (cause.requestNotSent === true || Number(cause.status) === 401));
    if (error) showErrorToast(message, info, { login: needsLogin });
    else hideErrorToast();
  }
  // The screen name that goes into the folded detail ("화면: 문제지 만들기"), so a pasted report says where it happened.
  const SCREEN_LABELS = {
    home: "홈", find: "기출 찾기", compose: "문제지 만들기", saved: "보관함", recent: "출제 내역", health: "점검",
    "five-minute": "5분 테스트", "subunit-test": "소단원 테스트", "unit-test": "단원 테스트", "monthly-test": "월말 테스트", diagnostic: "진단평가",
  };
  function screenLabel() {
    try { return SCREEN_LABELS[state.view] || String(state.view || ""); } catch { return ""; }
  }
  // Error text kept for places that store a message string (state.saveError, state.recentError): the folded detail
  // is looked up by that same string when the screen is drawn again.
  const errorInfoByMessage = new Map();
  function rememberErrorInfo(message, cause, extra = {}) {
    if (!message || !cause || typeof cause !== "object") return;
    const info = describeError(cause, GENERIC_ERROR, extra);
    if (info.hasDetail) errorInfoByMessage.set(String(message), info);
    if (errorInfoByMessage.size > 20) errorInfoByMessage.delete(errorInfoByMessage.keys().next().value);
  }
  function errorDetailMarkup(message) {
    const info = errorInfoByMessage.get(String(message || ""));
    return info && window.Archive2ErrorDetail ? window.Archive2ErrorDetail.markup(info) : "";
  }
  // rows[].scopeQuestionUids = 그 행의 범위 안 문항 uid 전체(초안 크기의 큰 몫). 읽는 곳은 (1) 선정을 바꿀 때의 범위 검사(C.review, rowMatches),
  // (2) 저장 요청의 selection_filters(request(true)), (3) 서버가 저장 문항을 그 범위로 다시 맞춰 보는 검사다. 현재 단원 목록(planRows)이
  // 만들었고 선정 문항은 언제나 그 안에 있으므로, 단원 목록으로 다시 만들 수 있는 행은 목록을 빼고 저장한다(행에 scopeUidsOmitted 표시).
  // 열 때 현재 카탈로그의 planRows() 목록 + 그 행에서 뽑은 문항으로 채운다(applyDraft). 단원 목록으로 못 만드는 범위(uid 경로로 고른 범위,
  // 저장 시험지 수정본, 학교별 기출로 고른 시험, 행이 현재 범위·분배와 안 맞는 경우)는 지금처럼 목록을 그대로 저장한다.
  // 열 때 그 범위 키를 못 만드는 경우도 목록을 그대로 저장한다: 고등 소단원 묶음 키(대단원키~묶음키)는 묶음표를 비동기로 읽은 뒤에야 만들어지고,
  // 조건을 바꾸고 다시 만들지 않은 문제지(composeStale)는 저장된 목록이 지금 조건의 계산과 다르다.
  function rowsRebuildableFromScopes() {
    if (state.uidRoute || state.derivationSource || state.urlUids?.length || state.sources.length || !state.scopes.length) return false;
    if (state.composeStale) return false;
    if (!/^중[123]$/.test(state.filters.grade || "") && state.scopes.some((key) => String(key).includes("~"))) return false;
    if (!Array.isArray(state.rows) || !state.rows.length) return false;
    const pooled = state.distribution === "pool";
    return state.rows.every((row) => row && typeof row === "object" && Array.isArray(row.scopeQuestionUids) &&
      (pooled ? row.id === "pool" : row.id !== "pool" && state.scopes.includes(row.id)));
  }
  function draftRows() {
    if (!rowsRebuildableFromScopes()) return state.rows;
    return state.rows.map(({ scopeQuestionUids, ...rest }) => ({ ...rest, scopeUidsOmitted: true }));
  }
  // 열 때 위 표시가 있는 행의 목록을 채운다: 현재 단원 목록으로 다시 만든 목록(저장 당시와 같은 함수)에 그 행에서 뽑힌 문항을 합친다.
  // 합치므로 선정 문항은 항상 범위 안에 남고(서버의 범위 검사 통과), 카탈로그가 바뀌었으면 새 목록을 따른다.
  function rebuildOmittedRowScopeUids() {
    if (!state.rows.some((row) => row && row.scopeUidsOmitted === true)) return;
    const fresh = new Map(planRows().map((row) => [row.id, row.scopeQuestionUids || []]));
    // 묶음표를 아직 못 읽은 채 소단원 묶음 키가 있으면 합친 목록(pool)은 그 묶음의 문항이 빠진 채로 만들어지므로 쓰지 않는다.
    const childScopesPending = !/^중[123]$/.test(state.filters.grade || "") && Boolean(QuickTree?.loadGroups) && !QuickTree.groupsLoaded?.() &&
      state.scopes.some((key) => String(key).includes("~"));
    const picked = new Map();
    for (const record of state.selected) {
      if (!picked.has(record.rowId)) picked.set(record.rowId, []);
      picked.get(record.rowId).push(record.questionUid);
    }
    state.rows = state.rows.map((row) => {
      if (!row || row.scopeUidsOmitted !== true) return row;
      const { scopeUidsOmitted, ...rest } = row;
      // 지금 단원 목록에서 그 행을 못 만들면(예: 고등 소단원 묶음표를 아직 못 읽음) 선정 문항만으로 좁히지 않고 목록 없이 둔다.
      // 목록 없는 행은 저장 요청이 경로 조건으로 범위를 다시 계산한다(더 넓다).
      if (!fresh.has(row.id) || (row.id === "pool" && childScopesPending)) return rest;
      const list = [...fresh.get(row.id)];
      const have = new Set(list);
      for (const uid of picked.get(row.id) || []) if (!have.has(uid)) { have.add(uid); list.push(uid); }
      return { ...rest, scopeQuestionUids: list };
    });
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
      "derive",
      "composeShortage",
    ];
    return {
      schemaVersion: C.VERSION,
      taxonomyVersion: C.TAXONOMY_VERSION,
      indexVersion: state.indexVersion,
      updatedAt: new Date().toISOString(),
      ...Object.fromEntries(keys.map((k) => [k, state[k]])),
      rows: draftRows(),
      scopeSourcePaths: selectedScopePaths(),
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
  // 초안의 최상위 scopeQuestionUids(범위 안 문항 uid 전체 목록)는 쓰기만 하고 읽는 곳이 없다: applyDraft가 복원 대상에서 빼고
  // 현재 카탈로그로 범위를 다시 구한다. 초안 크기의 큰 몫이라 새 초안에는 넣지 않고, 이미 저장된 초안도 배열을 다시 쓸 때 이 키만 뺀다
  // (다른 필드는 그대로, 열 수 있는 정보는 줄지 않는다). 옛 초안·작업 백업 파일에 이 키가 있어도 열린다(검증에서 선택 항목).
  function withoutUnreadDraftFields(record) {
    if (!record || typeof record !== "object" || Array.isArray(record) || !("scopeQuestionUids" in record)) return record;
    const { scopeQuestionUids, ...rest } = record;
    return rest;
  }
  function save() {
    if (
      !state.catalog ||
      (!state.scopes.length && !state.selected.length && !state.receipts.length)
    )
      return;
    const record = draft();
    try {
      // 새 초안과 기존 초안 모두 위 정리를 거쳐 쓴다. 공간이 모자라 쓰지 못하면 아무것도 지우지 않고(기존 초안은 그대로) 안내만 한다.
      localStorage.setItem(
        storageKey(),
        JSON.stringify(
          [
            record,
            ...drafts().filter((d) => d.draftId !== record.draftId),
          ].slice(0, 20).map(withoutUnreadDraftFields),
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
        (row.scopeQuestionUids === undefined || isStrArr(row.scopeQuestionUids)) &&
        (row.scopeUidsOmitted === undefined || row.scopeUidsOmitted === true)),
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
      // 기준 시험지로 다시 만들기: 같은 결과를 다시 열고, 다시 뽑을 때 앞서 준 문항을 빼기 위한 기록.
      derive: (v) => v === null || (isObj(v) && isStrArr(v.baseUids, 400) && isStrArr(v.exclude, 5000) && isStrArr(v.resultUids, 400) &&
        ["same", "different"].includes(v.typeMode) && ["same", "up-some", "up-one"].includes(v.level) &&
        isStr(v.baseTitle, 200) && isStr(v.source, 40) && isStr(v.publisher, 200) && isStr(v.seed, 200) &&
        isStr(v.text, 2000) && isStr(v.levelText, 2000) && Array.isArray(v.notes) && v.notes.length <= 12 && v.notes.every((note) => isStr(note, 2000))),
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
    if (data.selected.some((r) => !C.UID.test(r.questionUid)))
      throw new Error("지원하지 않는 작업 파일입니다.");
    // 2026-11-24 원장 결정: 그사이 고쳐진 문항은 거절하지 않고 지금의 내용으로 연다. 아카이브에서 사라진 문항만 빼고 나머지는 연다.
    const droppedNumbers = [];
    data.selected.forEach((r, index) => { if (!state.byUid.has(r.questionUid)) droppedNumbers.push(index + 1); });
    const fixedCount = data.selected.filter((r) => r.sourceFingerprint && state.byUid.has(r.questionUid) &&
      r.sourceFingerprint !== state.byUid.get(r.questionUid).sourceFingerprint).length;
    if (droppedNumbers.length) {
      if (droppedNumbers.length === data.selected.length)
        throw new Error("이 작업의 문항이 아카이브에서 모두 사라져 열 수 없습니다.");
      const gone = new Set(data.selected.filter((r) => !state.byUid.has(r.questionUid)).map((r) => r.questionUid));
      const kept = data.selected.length - droppedNumbers.length;
      // 빠진 문항이 속한 행의 요청 개수를 그만큼 줄인다(안 줄이면 "요청한 문항 수가 충족되지 않았습니다"로 저장·출력이 막힌다).
      const lost = new Map();
      for (const r of data.selected) if (gone.has(r.questionUid)) lost.set(r.rowId, (lost.get(r.rowId) || 0) + 1);
      data = {
        ...data,
        selected: data.selected.filter((r) => !gone.has(r.questionUid)),
        pins: Array.isArray(data.pins) ? data.pins.filter((uid) => !gone.has(uid)) : data.pins,
        ...(Array.isArray(data.rows)
          ? { rows: data.rows.map((row) => (lost.has(row?.id) && Number.isFinite(row.count) ? { ...row, count: Math.max(0, row.count - lost.get(row.id)) } : row)) }
          : {}),
        ...(data.derivationSource ? { count: kept } : {}),
      };
    }
    const reopenNotice = revisionOpenNotice(fixedCount, droppedNumbers);
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
      const currentKeys = new Set(currentScopes.flatMap(scope => [scope.key, ...(scope.children || []).map(child => child.key)]));
      // 고등 소단원 묶음표를 아직 못 읽었으면 자식 키(대단원 키~묶음 키)를 버리지 않고 둔다(읽으면 그대로 살아난다).
      const groupsPending = !/^중[123]$/.test(restoredFilters.grade || "") && Boolean(QuickTree?.loadGroups) && !QuickTree.groupsLoaded?.();
      const parentKeys = new Set(currentScopes.map(scope => scope.key));
      restoredScopeKeys = data.scopes.filter(key => currentKeys.has(key) ||
        (groupsPending && key.includes("~") && parentKeys.has(key.slice(0, key.indexOf("~")))));
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
    state.derive = data.derive || null;
    // 모자라게 뽑은 문제지는 모자람 안내도 함께 복원한다(결과가 없으면 안내할 것도 없다).
    state.composeShortage = data.selected.length && Array.isArray(data.composeShortage)
      ? data.composeShortage.map((item) => ({ label: item.label, difficultyBuckets: item.difficultyBuckets, requested: item.requested, got: item.got }))
      : [];
    state.composeStale = false;
    state.composeNotice = reopenNotice;
    state.includeExtended = data.includeExtended === true;
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
    rebuildOmittedRowScopeUids();
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
        (state.scopeNotice ? " " + state.scopeNotice : "") + (reopenNotice ? " " + reopenNotice : ""),
      data.indexVersion !== state.catalog.indexVersion || Boolean(state.scopeNotice),
    );
    if (state.studentIds.length) refreshHistory();
  }
  // 저장본·이전 작업을 열 때 선생님에게 보이는 한 줄 안내(막는 경고가 아니다). 내부 용어 없이.
  function revisionOpenNotice(fixedCount, droppedNumbers) {
    const parts = [];
    if (fixedCount) parts.push(`문항 ${fixedCount}개가 저장 뒤 고쳐져 최신 내용으로 열었습니다.`);
    if (droppedNumbers.length) parts.push(`${droppedNumbers.map((n) => n + "번").join(", ")} 문항은 아카이브에서 찾을 수 없어 빼고 열었습니다.`);
    return parts.join(" ");
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
    // 2026-11-24 원장 결정: 수정본은 항상 지금의 문항 내용으로 연다(저장 뒤 고쳐진 문항을 거절하지 않는다).
    // 아카이브에서 사라진 문항만 빼고 나머지를 열고, 몇 번이 빠졌는지 알린다.
    const droppedNumbers = [];
    let fixedCount = 0;
    const records = snapshot.questions.map((question, index) => {
      const record = state.byUid.get(question.questionUid);
      if (!record) { droppedNumbers.push(index + 1); return null; }
      if (question.sourceFingerprint && String(question.sourceFingerprint) !== String(record.sourceFingerprint)) fixedCount++;
      return { ...record, rowId: "saved-paper-revision" };
    }).filter(Boolean);
    if (!records.length)
      throw new Error("이 시험지의 문항이 아카이브에서 모두 사라져 수정본을 열 수 없습니다. 저장한 시험지는 그대로 출력할 수 있습니다.");
    const selectionFilters = snapshot.selectionFilters;
    const paths = Array.isArray(selectionFilters.primaryPaths) && selectionFilters.primaryPaths.length
      ? [...new Set(selectionFilters.primaryPaths.map(String))]
      : [...new Set(records.map(record => C.pathKey(record, 4)))];
    const scopeQuestionUids = Array.isArray(selectionFilters.scopeQuestionUids) && selectionFilters.scopeQuestionUids.length
      ? [...new Set(selectionFilters.scopeQuestionUids.map(String))]
      : records.map(record => record.questionUid);
    // 넓은 범위(단원 두 개로도 필터가 150KB를 넘는 경우)는 저장할 때 목록이 사용한 문항만으로 줄어든다(compactSaveFilters).
    // 그 목록 그대로 열면 교체 후보가 저장 문항뿐이라 "같은 조건으로 교체할 새 문항이 없습니다"가 된다. 목록이 사용 문항 안에 다 들어 있으면
    // (줄어든 목록이거나 목록이 없던 저장본) 저장해 둔 경로·조건으로 지금 카탈로그에서 범위를 다시 만든다. 저장할 때는 다시 줄어들고,
    // 서버는 줄어든 목록(교체한 문항 포함)과 경로 조건으로 대조한다.
    const usedUids = new Set(snapshot.questions.map(question => question.questionUid));
    const scopeWasCompacted = scopeQuestionUids.every(uid => usedUids.has(uid));
    // 저장 뒤 분류가 고쳐져 옛 범위에 안 맞는 문항도 거절하지 않고, 그 문항의 지금 단원을 범위에 보탠다(서버는 이 범위로 다시 대조한다).
    // 맞는지 미리 판정하지 않고 모든 문항의 원시 키·일반 키를 둘 다 보탠다: 저장본 범위에 원시 모드로는 맞는 빈 키가 이미 들어 있어도,
    // 실제 판정(C.review)과 서버(core.matches)는 일반 모드라 그 키로 맞지 않을 수 있다. 범위는 scopeQuestionUids가 함께 좁힌다.
    for (const record of records) {
      if (!scopeQuestionUids.includes(record.questionUid)) scopeQuestionUids.push(record.questionUid);
      for (const key of [C.pathKey(record, 4), C.generalPathKey(record, 4)]) if (!paths.includes(key)) paths.push(key);
    }
    if (scopeWasCompacted) {
      const rangeFilters = { ...selectionFilters, primaryPaths: paths };
      delete rangeFilters.scopeQuestionUids;
      delete rangeFilters.difficultyBuckets;
      const have = new Set(scopeQuestionUids);
      for (const record of state.catalog.records) {
        if (!have.has(record.questionUid) && C.matches(record, rangeFilters, workspaceMatchOptions())) {
          have.add(record.questionUid);
          scopeQuestionUids.push(record.questionUid);
        }
      }
    }
    const row = {
      id: "saved-paper-revision",
      label: "원본 저장 시험지 범위",
      depth: 4,
      count: records.length,
      paths,
      scopeQuestionUids,
      difficultyBuckets: [],
    };
    const filters = { ...selectionFilters };
    delete filters.sourceFiles;
    delete filters.primaryPaths;
    delete filters.scopeQuestionUids;
    delete filters.difficultyBuckets;
    return { snapshot, records, row, filters, selectionFilters, notice: revisionOpenNotice(fixedCount, droppedNumbers) };
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
    state.derive = null;
    state.prepared = [];
    state.undo = [];
    state.previewIndex = 0;
    state.ackWarnings = false;
    state.composeNotice = validated.notice;
    state.view = "compose";
    state.inspector = "summary";
    save();
    render();
    status("저장한 시험지로 새 문제지를 만들었습니다. 원래 시험지는 그대로 유지되고, 수정본을 저장하면 원본과의 관계가 기록됩니다." + (validated.notice ? " " + validated.notice : ""));
  }
  async function openSavedPaperRevision(id) {
    const data = await api("/archive-saved-papers/" + encodeURIComponent(id));
    // 조각 경로: 저장본의 문항이 속한 시험지의 조각을 더 받는다(다른 학년이 섞여 있어도). 전체 목록이면 아무것도 하지 않는다.
    await ensureShardFiles(data.paper?.snapshot?.questions);
    applySavedPaperRevision(data.paper);
    state.editSavedPaperId = "";
    history.replaceState(null, "", `workspace.html?view=compose${state.assignLegacy ? "&assign=legacy" : ""}`);
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
  // 사이트가 새로 배포되면 서버의 기준 버전(index_version)이 이 화면이 읽은 것과 달라져 출제가 409로 거절된다.
  // 패널이 그 거절을 받았을 때 현재 배포된 기준 버전만 가볍게 다시 읽는다: 목록 전체를 다시 만들지 않고, 로더(loadInputBundle)와 같은
  // 검사(매니페스트 형식·resolver 버전·projectionVersion 재계산)를 거친다. 화면의 목록·catalog는 바꾸지 않는다.
  async function fetchCurrentProjectionVersion() {
    const Canon = window.Archive2Canonical;
    if (!Canon?.computeProjectionVersion) throw new Error("canonical loader unavailable");
    const response = await fetch(new URL("data/archive2-canonical-input-manifest.json", document.baseURI).toString(), { cache: "no-cache" });
    if (!response.ok) throw new Error("canonical manifest unavailable (" + response.status + ")");
    const manifest = JSON.parse(await response.text());
    if (
      manifest?.schemaVersion !== "archive2-canonical-input-manifest-v1" ||
      manifest.resolverVersion !== Canon.RESOLVER_VERSION ||
      !Array.isArray(manifest.files)
    ) throw new Error("canonical manifest version mismatch");
    const version = await Canon.computeProjectionVersion(manifest.files);
    if (version !== manifest.projectionVersion) throw new Error("canonical manifest digest mismatch");
    return version;
  }
  // 출제 패널 항목 하나(원본 또는 유사 세트: 둘 다 카탈로그의 시험 파일이다). 원본 정보를 확인할 수 없으면 null.
  function originalAssignItem(exam) {
    const sourceHash = new Map(state.catalog.sourceHashes).get(exam.file);
    if (!sourceHash || !state.catalog.indexVersion) return null;
    // 쪽당 문항은 늘 4로 시작한다: 옛 모달이 기억해 둔 값(APMATH_ARCHIVE2_ORIGINAL_QPP)은 쓰지 않는다.
    const settings = { ...originalSettingsForExam(exam), qpp: 4 };
    return {
      kind: "original", file: exam.file, title: O.displayTitle(exam), identityTitle: exam.identityTitle || exam.file.split("/").pop().replace(/\.js$/, ""),
      grade: exam.grade, subject: exam.subject, count: exam.qCount, sourceHash, settings,
    };
  }
  function openOriginalAssign(exam) {
    const Assign = window.Archive2Assign;
    if (!Assign?.open || state.assignLegacy || Assign.useLegacy(location.search)) return openOriginalIssue(exam, "targets");
    if (Assign.isOpen()) return undefined;
    const item = originalAssignItem(exam);
    if (!item) {
      status("이 시험지의 원본 정보를 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.", true);
      return undefined;
    }
    state.originalReceipts = [];
    Assign.open({
      items: [item],
      original: { indexVersion: state.catalog.indexVersion, loadQuestions: (it) => Source.load(it.file, it.sourceHash), refreshIndexVersion: fetchCurrentProjectionVersion },
      request: assignRequest,
      opener: document.activeElement,
    });
    return undefined;
  }
  // 학교별 기출에서 고른 여러 시험지(원본·유사 섞여도 된다)를 한 번에 같은 패널로 낸다(2026-11-22).
  // 항목 모양과 패널의 항목별 문항 로드·중복일 제외는 한 장 출제와 같다. 하나라도 원본 정보를 확인할 수 없으면 아무것도 열지 않는다.
  function openOriginalAssignMany(exams) {
    const Assign = window.Archive2Assign;
    const list = (Array.isArray(exams) ? exams : []).filter((exam) => exam?.file);
    if (!list.length) return undefined;
    if (!Assign?.open || state.assignLegacy || Assign.useLegacy(location.search)) {
      status("여러 시험지를 한꺼번에 내려면 새 출제 화면이 필요합니다. 한 장씩 출제해 주세요.", true);
      return undefined;
    }
    if (Assign.isOpen()) return undefined;
    const items = [];
    for (const exam of list) {
      const item = originalAssignItem(exam);
      if (!item) {
        status(`「${O.displayTitle(exam)}」의 원본 정보를 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.`, true);
        return undefined;
      }
      items.push(item);
    }
    state.originalReceipts = [];
    Assign.open({
      items,
      original: { indexVersion: state.catalog.indexVersion, loadQuestions: (it) => Source.load(it.file, it.sourceHash), refreshIndexVersion: fetchCurrentProjectionVersion },
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
        ? `<div class="callout danger" role="alert">저장하지 못했습니다. 편집한 문제지는 유지됩니다.<br>${esc(teacherErrorMessage(state.saveError))}${errorDetailMarkup(state.saveError)}</div>`
        : ""; // 저장했다는 안내는 위의 "마지막 저장본"이 이미 말한다(같은 문장을 두 곳에 쓰지 않는다).
    // 저장 결과를 모를 때는 위 복구 영역의 버튼(저장 결과 확인·출력·백업)만 쓴다.
    if (state.saveResultState === "RESULT_UNKNOWN") return `<div class="cz-finish" data-cz-finish>${savedResult}</div>`;
    return `<div class="cz-finish" data-cz-finish>${savedResult}<div class="cz-actions" role="group" aria-label="마무리">${buttons.print}${buttons.save}${buttons.assign}<details class="cz-more cz-finish-more"><summary>더보기</summary><div class="cz-more-menu">${button("backup", "작업 백업 다운로드", 'class="small"')}${button("import", "백업 불러오기", 'class="small"')}</div></details></div></div>`;
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
  // options.papers: 이미 만든 [{ index, questions, meta }](학교 모의고사 "보관함에 저장"이 한 요청에 여러 권을 보낼 때). 없으면 지금 문제지에서 만든다.
  // 요청 본문은 어느 쪽이든 아래 payloadFor 하나로 만든다(같은 직렬화·같은 검증).
  async function savePapers(options = {}) {
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
      // 서버가 저장 때 읽지 못한 그림은 저장을 막지 않는다. 그 그림만 "확인 못 함"으로 저장되고 응답이 위치를 알려 준다(옛 서버는 이 필드가 없다).
      const missing = data?.missing_images;
      if (Number(missing?.count) > 0 && Array.isArray(missing.items)) {
        const places = [...new Set(missing.items.map((item) => String(item?.place || "")).filter(Boolean))];
        state.saveMessage += " 그림 " + Number(missing.count) + "개를 확인하지 못했습니다(" +
          places.slice(0, 3).join(", ") + (places.length > 3 ? " 외 " + (places.length - 3) + "곳" : "") + ").";
      }
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
      const papers = Array.isArray(options.papers) && options.papers.length ? options.papers : await prepare();
      const filters = saveRequestFilters(request(true).filters);
      // 보내는 값은 "이 화면이 문항을 대조한 목록의 버전"이다: prepare()가 문항마다 지금 카탈로그(state.catalog)와 지문(fingerprint)을
      // 대조해 만들므로 그 카탈로그의 버전이 맞고, 초안을 만든 때의 값(state.indexVersion)은 옛 값일 수 있어 보내지 않는다.
      // 서버가 이미 더 새 버전으로 앞서간 것을 한 번 확인했다면(아래 자동 재전송) 이 화면에서는 그 값을 계속 쓴다.
      let saveIndexVersion = savedIndexVersionFor(state.catalog?.indexVersion || "");
      if (!saveIndexVersion) throw new Error("현재 문항 목록 버전을 확인할 수 없습니다.");
      const signatureFor = (version) => JSON.stringify({
        indexVersion: version,
        filters,
        includeExtended: state.includeExtended === true,
        papers: papers.map((paper) => ({ part_index: paper.index, questions: paper.questions, meta: paper.meta })),
      });
      const signature = signatureFor(saveIndexVersion);
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
      // 한 요청에는 버전 값이 하나만 들어간다: index_version과 papers[].meta.indexVersion이 같다.
      const payloadFor = (version) => ({
        schema_version: "archive-saved-paper-v1",
        save_batch_id: state.saveBatchId,
        index_version: version,
        selection_filters: filters,
        include_extended: state.includeExtended === true,
        papers: papers.map((paper, paperIndex) => ({
          part_index: paper.index,
          questions: papers[paperIndex].questions.map(saveWireQuestion),
          meta: { ...paper.meta, indexVersion: version },
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
      });
      requestStarted = true;
      let data;
      try {
        data = await api("/archive-saved-papers", payloadFor(saveIndexVersion));
      } catch (first) {
        // 서버가 "분류 기준 갱신"(409)으로 거절한 경우: 서버는 저장 전에 거절하므로 만들어진 건이 없다. 현재 배포된 기준 버전만 다시 읽어
        // 한 번만 다시 보낸다(원본 출제의 자동 재전송과 같은 방식, 무한 반복 없음). 서버가 문항·메타를 새 기준으로 다시 검증하므로
        // 문항은 그대로 보낸다: 분류가 실제로 바뀌었다면 서버가 다시 거절하고 교사는 새로고침 안내를 받는다.
        // 저장 결과를 확인하던 중(RESULT_UNKNOWN 복구)에는 같은 요청을 유지해야 하므로 자동으로 바꿔 보내지 않는다.
        if (recoveringUnknown || Number(first?.status) !== 409 || !SAVE_STALE_VERSION.test(String(first?.data?.error || first?.message || ""))) throw first;
        let fresh = "";
        try { fresh = String(await fetchCurrentProjectionVersion() || ""); } catch (refreshError) { console.warn("[archive2] could not read the current projection version:", refreshError?.message); }
        if (!fresh || fresh === saveIndexVersion) throw first;
        status("문항 목록이 새로 갱신되어 다시 확인하고 있습니다.");
        saveIndexVersion = fresh;
        savedIndexVersionCache = { catalog: state.catalog?.indexVersion || "", version: fresh };
        // 값이 바뀌면 요청 내용이 달라지므로(서버의 요청 해시에 index_version이 들어간다) 새 batch id로 보낸다. 첫 요청은 저장 전에 거절됐다.
        state.saveSignature = signatureFor(saveIndexVersion);
        state.saveBatchId = crypto.randomUUID();
        save();
        data = await api("/archive-saved-papers", payloadFor(saveIndexVersion));
      }
      setConfirmed(data, papers.length, attemptedWorkSignature);
    } catch (error) {
      let recovered = false;
      // 로그인 정보가 없어 요청이 나가기 전에 난 실패(requestNotSent)는 결과를 모르는 것이 아니다: 서버에 아무것도 가지 않았으므로
      // 확인할 것이 없고 중복 저장 걱정도 없다. 요청이 나간 뒤의 끊김·시간 초과·5xx만 아래에서 RESULT_UNKNOWN으로 둔다.
      const notSent = error?.requestNotSent === true && !recoveringUnknown;
      if (requestStarted && !notSent && (!error.status || error.status >= 500)) {
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
        const keepUnknown = !definiteHttpFailure && !notSent && (
          (recoveringUnknown && !recoveryConfirmedAbsent) ||
          (!requestStarted && recoveringUnknown) ||
          (requestStarted && (!error.status || responseStatus >= 500))
        );
        state.saveResultState = keepUnknown ? "RESULT_UNKNOWN" : "FAILED";
        state.saveMessage = "";
        state.saveError = error.message || "저장 요청에 실패했습니다.";
        // 서버가 이유를 알려 준 거절(로그인 만료·너무 큼·분류 기준 갱신·분류 자료 불일치)은 할 일이 담긴 문구로 바꾼다.
        // 서버 원문(영어 포함)은 화면 문구에 내지 않고 콘솔과 접힌 상세에만 남긴다. 문구는 SAVE_FAILURE_TEXT 표 한 곳에 있다.
        const failureText = saveFailureMessage(error);
        if (failureText) {
          console.warn("[archive2] save rejected:", responseStatus || "", state.saveError);
          state.saveError = failureText;
        }
        // 서버 원문(영문 포함)은 화면 문구에서 빠지므로, 어느 문제지를 저장하다 난 일인지와 함께 접힌 상세로 남긴다.
        window.Archive2ErrorDetail?.annotate(error, { title: state.header?.title });
        rememberErrorInfo(state.saveError, error, { headline: state.saveError });
        save();
        status(
          keepUnknown
            ? "저장 결과를 확인하지 못했습니다. 중복 저장을 막기 위해 같은 저장 요청을 유지합니다. '저장 결과 확인'을 다시 눌러 주세요."
            : failureText ? `시험지를 저장하지 못했습니다. ${failureText}` : "시험지를 저장하지 못했습니다. 작업과 미리보기는 유지했습니다.",
          true,
          error,
        );
      }
    } finally {
      state.saveBusy = false;
      $("content").inert = false;
      render();
    }
  }
  // 전송 본문만 서버 계약에 맞춘다(화면·미리보기·인쇄에 쓰는 문항 객체는 그대로 둔다). Source.restore는 카탈로그 값이 비어 있으면
  // 출력용으로 원본 JS의 값을 남기지만, 서버는 정본(카탈로그) 값과 한 글자라도 다르면(빈 문자열 포함) 409로 거절한다.
  // 그래서 보내는 사본의 정본 메타 필드(C.META_FIELDS)를 브라우저 카탈로그 레코드 값 그대로 맞춘다: 값이 비어 있으면 빈 값 그대로,
  // 필드가 없으면 사본에서도 뺀다. 카탈로그 레코드가 없는 문항은 손대지 않는다. 필드를 통째로 빼지 않으므로 서버 검사는 그대로 살아 있다.
  // 수정본(state.derivationSource)의 문항도 prepare()가 지금의 원본에서 복원한 것을 쓴다(2026-11-24 원장 결정: 항상 고쳐진 내용으로 연다). 그래서 저장본에 내장된 그림(data: URL)을 되돌려 보내는 단계는 없다.
  function saveWireQuestion(question) {
    const record = state.byUid.get(question?.questionUid);
    if (!record) return question;
    const copy = { ...question };
    for (const field of C.META_FIELDS) {
      if (record[field] === undefined) delete copy[field];
      else copy[field] = record[field];
    }
    return copy;
  }
  // 찾기 화면의 선택(시험지 종류 material, 시험지 file, similarOnly)은 문제지 만들기로 넘어올 때 state.filters에 같이 복사된다.
  // 서버는 이 키들을 허용하지 않는다(409 "허용되지 않은 출제 조건"). 문항을 뽑는 데는 쓰이지 않으므로 저장 요청에서만 뺀다.
  const SAVE_FINDER_ONLY_FILTER_KEYS = ["material", "file", "similarOnly"];
  function saveRequestFilters(filters) {
    const next = { ...filters };
    for (const key of SAVE_FINDER_ONLY_FILTER_KEYS) delete next[key];
    return compactSaveFilters(next);
  }
  // 서버의 기준 버전이 이 화면의 목록보다 앞선 것을 이미 한 번 확인했다면 그 값을 저장에 계속 쓴다(같은 목록 버전일 때만).
  let savedIndexVersionCache = { catalog: "", version: "" };
  function savedIndexVersionFor(catalogVersion) {
    return savedIndexVersionCache.catalog === catalogVersion && savedIndexVersionCache.version
      ? savedIndexVersionCache.version
      : catalogVersion;
  }
  const SAVE_STALE_VERSION = /분류 기준이 갱신/;
  const SAVE_PARITY_MISMATCH = /canonical metadata parity mismatch/i;
  // 저장이 서버에서 거절됐을 때 교사가 읽는 문구: 거절 이유 → "무엇을 하면 되는지"가 든 한 문장. 문구는 이 표 한 곳에만 있다.
  // 서버 원문(영어 포함)은 여기에 넣지 않고 접힌 상세에만 남는다. 요청·재시도 동작은 이 표와 무관하다(문구만 고른다).
  // 네트워크 끊김·시간 초과·서버 오류(5xx)는 거절이 아니라 "결과를 모름"이라 표가 아닌 저장 결과 확인 흐름(RESULT_UNKNOWN)이 안내한다.
  const SAVE_FAILURE_TEXT = {
    loginMissing: "로그인이 필요합니다. 로그인한 뒤 저장해 주세요. 작업은 초안에 남아 있습니다.",
    loginExpired: "로그인이 만료됐습니다. 다시 로그인한 뒤 저장해 주세요. 지금까지 작업한 내용은 초안에 남아 있습니다.",
    forbidden: "이 계정에는 시험지를 저장할 권한이 없습니다. 관리자에게 확인해 주세요. 지금까지 작업한 내용은 초안에 남아 있습니다.",
    tooLarge: "문제지가 너무 커서 저장하지 못했습니다. 권을 나누거나 문항 수를 줄여서 다시 저장해 주세요.",
    staleCatalog: "문항 목록이 갱신되었습니다. 새로고침한 뒤 다시 저장해 주세요.",
    metaMismatch: "분류 자료가 서버와 다릅니다. 새로고침한 뒤 다시 저장해 주세요.",
  };
  const SAVE_STALE_MESSAGE = SAVE_FAILURE_TEXT.staleCatalog;
  const SAVE_PARITY_MESSAGE = SAVE_FAILURE_TEXT.metaMismatch;
  // 저장 거절 → 위 표의 문구. 표에 없는 거절(그 밖의 4xx)은 빈 문자열이고, 화면은 서버 문장이 한글이면 그대로, 아니면 일반 문구를 쓴다.
  function saveFailureMessage(error) {
    const code = Number(error?.status);
    const serverText = String(error?.data?.error || error?.message || "");
    // 요청이 나가기 전(로그인 정보 없음)에 난 실패. 요청이 나간 뒤의 실패에는 이 표시가 없다.
    if (error?.requestNotSent === true) return SAVE_FAILURE_TEXT.loginMissing;
    if (code === 401) return SAVE_FAILURE_TEXT.loginExpired;
    if (code === 403) return SAVE_FAILURE_TEXT.forbidden;
    if (code === 413) return SAVE_FAILURE_TEXT.tooLarge;
    if (code === 409 && SAVE_STALE_VERSION.test(serverText)) return SAVE_FAILURE_TEXT.staleCatalog;
    if (SAVE_PARITY_MISMATCH.test(String(error?.message || ""))) return SAVE_FAILURE_TEXT.metaMismatch;
    return "";
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
        V.classRows.find((r) => r.id === state.classId)?.name || "선택한 반",
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
      derive: null,
    });
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
  // 화면을 건드리지 않고 초안 한 건만 지운다(바로 저장한 모의고사가 "이전 작업이 있습니다"로 남지 않게).
  function discardDraftSilently(draftId) {
    const id = String(draftId || "");
    if (!id) return;
    try { localStorage.setItem(storageKey(), JSON.stringify(drafts().filter((d) => d.draftId !== id))); } catch {}
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
  Object.assign(WS.api, {
    HANGUL,
    GENERIC_ERROR,
    describeError,
    teacherErrorMessage,
    hideErrorToast,
    showErrorToast,
    status,
    SCREEN_LABELS,
    screenLabel,
    errorInfoByMessage,
    rememberErrorInfo,
    errorDetailMarkup,
    draft,
    drafts,
    save,
    scheduleSave,
    validateDraftTypes,
    normalizeDraftNumbers,
    applyDraft,
    validateSavedPaperRevision,
    applySavedPaperRevision,
    openSavedPaperRevision,
    openOriginalIssue,
    openSavedPaperIssue,
    assignRequest,
    openSavedPaperAssign,
    fetchCurrentProjectionVersion,
    openOriginalAssign,
    openOriginalAssignMany,
    originalIssueBusy,
    setOriginalStep,
    currentSavedPaperIds,
    composeFinishButtons,
    renderResultFinish,
    recoveryOutputMarkup,
    renderSaveRecovery,
    renderSavedContinuity,
    refreshComposeSaveContinuity,
    refreshComposeBar,
    savePapers,
    saveWireQuestion,
    SAVE_FINDER_ONLY_FILTER_KEYS,
    saveRequestFilters,
    savedIndexVersionFor,
    SAVE_STALE_VERSION,
    SAVE_STALE_MESSAGE,
    SAVE_PARITY_MISMATCH,
    SAVE_PARITY_MESSAGE,
    SAVE_FAILURE_TEXT,
    saveFailureMessage,
    SAVE_FILTER_BYTE_LIMIT,
    compactSaveFilters,
    assign,
    rememberReceipt,
    rebuildUnissued,
    restoreCurrentHistoryScroll,
    showSavedLibrary,
    showSavedPaper,
    UNKNOWN_RESULT_ALLOWED_ACTIONS,
    newDraft,
    resetWorkingDraft,
    askDeleteDraft,
    deleteDraft,
    discardDraftSilently,
    saveAndAssign,
  });
})();
