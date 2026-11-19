// Archive2 workspace, main part: render dispatch, URL routing, event listeners, boot. Loaded last.
(function () {
  "use strict";
  if (!window.Archive2Workspace) {
    // workspace.html is older than this file (cached page): the other workspace scripts were not loaded
    console.error("[archive2] workspace scripts are missing; reload the page");
    const notice = document.getElementById("status");
    if (notice) notice.textContent = "화면을 구성하는 파일을 모두 받지 못했습니다. 새로고침해 주세요.";
    return;
  }
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const Boot = window.Archive2Boot;
  const C = window.Archive2Core;
  const History = window.Archive2History;
  const O = window.Archive2Output;
  const Parts = window.Archive2Papers;
  const ProblemBankMeta = window.ProblemBankMeta;
  const Unified = window.Archive2UnifiedUnits;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, ASSESSMENT_RECIPE_KEYS, ASSESSMENT_RECIPE_TITLES, HOME_PRODUCT_REGISTRY, META_FACET_FILTERS, Quick,
    UNKNOWN_RESULT_ALLOWED_ACTIONS, activeAssessmentRecipe, advanceRecentPdfMutationVersion, api,
    applyDefaultFinderMaterial, applyDraft, applyFinderFilterChange, applyRecentPdfMutationResult,
    askCancelAssignment, askDeleteDraft, assign, assignmentStatus, button, cancelRecentAssignment,
    changeComposeFilter, changeRecentFilter, composeCountChanged, composeLoadGroups, composeMetaQueryCache,
    deleteDraft, describeError, download, draft, drafts, ensureHealthStats, ensureMetaIndex, esc,
    fillHomeFromCatalog, generate, hideErrorToast, invalidate, invalidateRecentRequests,
    isAssessmentRecipeMode, isCurrentAuthorityError, isCurrentPdfRetryAuthority, isQuickAssessmentView,
    loadRecent, lockedIndex, navViewActive, newDraft, openAssignmentOutput, openFinderOutput,
    openOriginalAssign, openQuickAssessment, openRecentAssignmentStatus, openSavedPaperAssign,
    openSavedPaperRevision, openSimilarList, originalIssueBusy, originalPrint, ownHistoryContext,
    pdfRetryAuthority, preparingMarkup, print, quickLoadGroups, quickProduct, quickState, recentTarget,
    reconcileFinderFilters, reconcileFinderSchool, reconcileUnifiedFilters, refreshComposeSaveContinuity,
    refreshHistory, rememberRecentExam, rememberRecentSubjectOptions, renderAssignmentStatus, renderCompose,
    renderFind, renderHealth, renderHome, renderOriginalReceipts, renderQuick, renderRecent,
    renderResultFinish, renderResultSummary, replace, replaceWith, request, restoreCurrentHistoryScroll,
    save, saveAndAssign, savePapers, scheduleFinderFilterRender, scheduleRecentRefetch, scheduleSave,
    scopeIsSelected, scopeOpenState, scopeOptions, session, setOriginalStep, showDialog, showSavedPaper,
    state, status, stepComposeCount, teacherErrorMessage, unifiedIndex, unique, updateOriginalPreview,
    updatePreview, updateRecentResults, withDefaultComposeSubject, withoutShadowedChildren,
    workspaceEligibility, setContentKeepingPreview, rememberComposeConditions, restoreClearedResult, discardClearedResult;
  WS.links.push(() => {
    ({
      $, ASSESSMENT_RECIPE_KEYS, ASSESSMENT_RECIPE_TITLES, HOME_PRODUCT_REGISTRY, META_FACET_FILTERS, Quick,
      UNKNOWN_RESULT_ALLOWED_ACTIONS, activeAssessmentRecipe, advanceRecentPdfMutationVersion, api,
      applyDefaultFinderMaterial, applyDraft, applyFinderFilterChange, applyRecentPdfMutationResult,
      askCancelAssignment, askDeleteDraft, assign, assignmentStatus, button, cancelRecentAssignment,
      changeComposeFilter, changeRecentFilter, composeCountChanged, composeLoadGroups, composeMetaQueryCache,
      deleteDraft, describeError, download, draft, drafts, ensureHealthStats, ensureMetaIndex, esc,
      fillHomeFromCatalog, generate, hideErrorToast, invalidate, invalidateRecentRequests,
      isAssessmentRecipeMode, isCurrentAuthorityError, isCurrentPdfRetryAuthority, isQuickAssessmentView,
      loadRecent, lockedIndex, navViewActive, newDraft, openAssignmentOutput, openFinderOutput,
      openOriginalAssign, openQuickAssessment, openRecentAssignmentStatus, openSavedPaperAssign,
      openSavedPaperRevision, openSimilarList, originalIssueBusy, originalPrint, ownHistoryContext,
      pdfRetryAuthority, preparingMarkup, print, quickLoadGroups, quickProduct, quickState, recentTarget,
      reconcileFinderFilters, reconcileFinderSchool, reconcileUnifiedFilters, refreshComposeSaveContinuity,
      refreshHistory, rememberRecentExam, rememberRecentSubjectOptions, renderAssignmentStatus,
      renderCompose, renderFind, renderHealth, renderHome, renderOriginalReceipts, renderQuick, renderRecent,
      renderResultFinish, renderResultSummary, replace, replaceWith, request, restoreCurrentHistoryScroll,
      save, saveAndAssign, savePapers, scheduleFinderFilterRender, scheduleRecentRefetch, scheduleSave,
      scopeIsSelected, scopeOpenState, scopeOptions, session, setOriginalStep, showDialog, showSavedPaper,
      state, status, stepComposeCount, teacherErrorMessage, unifiedIndex, unique, updateOriginalPreview,
      updatePreview, updateRecentResults, withDefaultComposeSubject, withoutShadowedChildren,
      workspaceEligibility, setContentKeepingPreview, rememberComposeConditions, restoreClearedResult, discardClearedResult
    } = WS.api);
  });
  // function declarations are hoisted: export them now so the other parts (and this file's own load-time code) see them
  Object.assign(WS.api, {
    applyFiveMinuteViewGuard,
    renderControls,
    noteRenderedViewTransition,
    render,
    teacherSessionOk,
    loginNoticeMarkup,
    showLoginNotice,
    syncViewNavigation,
    renderContent,
    quickFocusKey,
    quickFocusRestore,
    routeUrl,
    rememberCurrentHistoryEntry,
    urlState,
    replaceUrlState,
    deferUntilCatalog,
    dropStaleDeferredClick,
    replayDeferredClick,
    openRouteInPage,
    changeOutput,
    resumeAfterLogin,
    readUrl,
    replaceFinderUrlState,
    resolveUidRoute,
    applyUidRoute,
    clearUidRoute,
    syncUidRoute,
    renderUidRoute,
    applySourceRoute,
    loadRecentOnBoot,
    refreshRecentRowsFromCatalog,
    settleIndexesForView,
    scheduleIndexWarmUp,
  });
  WS.link();
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
    if (V.lastRenderedView === state.view) return;
    const previousView = V.lastRenderedView;
    V.lastRenderedView = state.view;
    state.assignmentStatusLoadVersion++;
    if (previousView === "recent" && state.view !== "recent")
      invalidateRecentRequests();
  }
  function render() {
    dropStaleDeferredClick();
    // Reuse scope counts only within this render. Every interaction rechecks
    // the current filters, catalog quality gates and previous-round exclusions.
    V.scopeRenderCache = null;
    V.displayedScopes = null;
    V.renderPoolCache = null;
    V.renderEligibilityCache = new WeakMap();
    V.renderComposeMetaFilters = new WeakMap();
    V.renderTaxonomyRowsCache = new Map();
    V.renderingScopes = true;
    try {
      renderContent();
      applyFiveMinuteViewGuard();
    } finally {
      V.renderingScopes = false;
      V.scopeRenderCache = null;
      V.renderPoolCache = null;
      V.renderEligibilityCache = null;
      V.renderComposeMetaFilters = null;
      V.renderTaxonomyRowsCache = null;
    }
  }
  // 보관함 and 출제 내역 are teacher-only. A session that is not a teacher's (none, expired, student, parent) is
  // not an error: the screen says so once and never calls the API. Without archive2-session.js nothing is judged.
  function teacherSessionOk() {
    const rule = window.Archive2Session;
    if (!rule?.state) return true;
    // 토큰이 없는 세션은 로그인한 것으로 보지 않는다(요청도 보내지 않고 로그인 안내를 낸다).
    const current = session();
    return Boolean(current?.session_token) && rule.state(current).loggedIn;
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
          const failure = describeError(error, "문제지를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
          $("content").innerHTML = `<section class="panel">${window.Archive2Navigation?.libraryTabs?.("saved") || ""}<h1>보관함</h1><p class="callout danger" role="alert">${esc(failure.message)}</p>${failure.hasDetail && window.Archive2ErrorDetail ? window.Archive2ErrorDetail.markup(failure) : ""}<p><button type="button" class="primary" data-action="library-reload">다시 시도</button></p></section>`;
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
    const focusedAction = ["scope-all", "scope-clear", "scope-group", "scope-range", "scope-expand"]
      .includes(document.activeElement?.dataset?.action)
      ? document.activeElement.dataset.action : null;
    const focusedGroupIndex = document.activeElement?.dataset?.groupIndex ?? document.activeElement?.dataset?.scopeKey;
    const scopeListScroll = document.querySelector(".cz-scope .scope-list")?.scrollTop || 0;
    document.querySelectorAll("[data-view]").forEach((b) => {
      b.classList.toggle("active", navViewActive(b));
      b.setAttribute(
        "aria-current",
        navViewActive(b) ? "page" : "false",
      );
    });
    document.body.dataset.archiveView = state.view;
    window.Archive2Navigation?.sync?.(state.view);
    const quickFocus = isQuickAssessmentView() ? quickFocusKey() : null;
    setContentKeepingPreview(
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
              : renderCompose());
    if (state.view === "compose") {
      const focusTarget = [...document.querySelectorAll('[data-group="compose"][data-filter], [data-scope]')]
        .find((el) => focusedFilter ? el.dataset.filter === focusedFilter : focusedScope && el.dataset.scope === focusedScope)
        || [...document.querySelectorAll('[data-action]')]
          .find((el) => focusedAction && el.dataset.action === focusedAction && (el.dataset.groupIndex ?? el.dataset.scopeKey) === focusedGroupIndex);
      focusTarget?.focus?.({ preventScroll: true });
      // 목록 안쪽 스크롤은 다시 그려도 그 자리에 둔다(중단원을 펼칠 때마다 맨 위로 돌아가지 않게).
      const scopeList = document.querySelector(".cz-scope .scope-list");
      if (scopeList && scopeListScroll) scopeList.scrollTop = scopeListScroll;
      document.querySelectorAll("input[data-scope-partial]").forEach((input) => { input.indeterminate = true; });
    }
    if (state.view === "compose" && state.selected.length) updatePreview();
    if (quickFocus) quickFocusRestore(quickFocus);
  }
  // A quick-assessment click re-draws the screen; keyboard focus returns to the same button or check box.
  function quickFocusKey() {
    const el = document.activeElement;
    if (!el?.closest?.(".qk") || !el.dataset) return null;
    const key = el.dataset.unitKey || el.dataset.quickBundle || el.dataset.grade || el.dataset.subject || el.dataset.view || "";
    return { action: el.dataset.action || "", key, id: el.id || "" };
  }
  function quickFocusRestore(focus) {
    const all = [...document.querySelectorAll(".qk [data-action], .qk [data-quick-bundle], .qk [data-view], .qk input[id]")];
    const target = all.find(el => el.id && el.id === focus.id)
      || all.find(el => (el.dataset.action || "") === focus.action
        && (el.dataset.unitKey || el.dataset.quickBundle || el.dataset.grade || el.dataset.subject || el.dataset.view || "") === focus.key);
    target?.focus?.({ preventScroll: true });
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
    rememberComposeConditions();
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
        if (!assignmentId || V.recentPdfRetryIds.has(assignmentId)) return;
        V.recentPdfRetryIds.add(assignmentId);
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
          V.recentPdfRetryIds.delete(assignmentId);
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
      } else if (a === "quick-pick") {
        quickState.pick = b.dataset.unitKey || "";
        render();
      } else if (a === "quick-open-pick") {
        await openQuickAssessment(quickState.pick ? [quickState.pick] : []);
      } else if (a === "quick-short-toggle") {
        quickState.shortOpen = !quickState.shortOpen;
        render();
      } else if (a === "quick-level-toggle") {
        quickState.levelOpen = !quickState.levelOpen;
        render();
      } else if (a === "quick-open-all") {
        await openQuickAssessment("all");
      } else if (a === "quick-open-selected") {
        await openQuickAssessment([...quickState.bundle]);
      } else if (a === "quick-open-b") {
        // The second window of an A·B pair cannot open with the same click everywhere; this click opens it.
        const formB = quickState.formB;
        if (formB?.url && window.open(formB.url, "_blank")) { quickState.formB = null; status(`${formB.title}를 열었습니다.`); render(); }
        else status("새 창을 열 수 없습니다. 팝업 설정을 확인하세요.", true);
      } else if (a === "quick-grade") {
        quickState.grade = b.dataset.grade || "";
        quickState.subject = "";
        quickState.bundle.clear();
        quickState.pick = "";
        quickState.shortOpen = false;
        replaceUrlState();
        render();
      } else if (a === "quick-semester") {
        quickState.semester = ["1", "2"].includes(b.dataset.semester) ? b.dataset.semester : "";
        quickState.bundle.clear();
        quickState.pick = "";
        quickState.shortOpen = false;
        render();
      } else if (a === "quick-subject") {
        quickState.subject = b.dataset.subject || "";
        quickState.bundle.clear();
        quickState.pick = "";
        quickState.shortOpen = false;
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
        discardClearedResult();
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
      } else if (a === "scope-expand") {
        const scope = (V.displayedScopes || scopeOptions()).find((item) => item.key === b.dataset.scopeKey);
        if (scope) state.scopeUnitOpen[scope.key] = !scopeOpenState(scope);
        render();
      } else if (
        a === "scope-all" ||
        a === "scope-clear" ||
        a === "scope-group" ||
        a === "scope-range"
      ) {
        if (state.sealed) return;
        const scopes = V.displayedScopes || scopeOptions();
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
        state.scopes = withoutShadowedChildren(state.scopes, scopes);
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
      else if (a === "restore-cleared") restoreClearedResult();
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
        replaceWith(V.candidateRecords[Number(b.dataset.candidate)]);
      else if (a === "candidate-preview") {
        const r = V.candidateRecords[Number(b.dataset.candidate)];
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
        // state.prepared는 그대로 둔다: 되돌린 문항 하나만 다시 복원하고 나머지는 확인 뒤 재사용한다(replaceWith와 같다).
        scheduleSave();
        render();
      } else if (a === "output-mode") {
        state.outputMode = b.dataset.mode;
        render();
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
      if (isCurrentAuthorityError(e)) status(e.message, true, e);
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
    rememberComposeConditions();
    try {
      if (isQuickAssessmentView() && el.id === "five-minute-level") {
        quickState.presets[state.view] = quickProduct().order[Number(el.value)] || "standard";
        render();
        return;
      }
      if (isQuickAssessmentView() && el.dataset.quickTwoForms !== undefined) {
        quickState.twoForms = Boolean(el.checked);
        quickState.formB = null;
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
        const scope = (V.displayedScopes || scopeOptions()).find((item) => item.key === el.dataset.scope);
        const legacyPaths = scope?.unified ? [] : scope?.paths || [];
        // 대단원을 고르면 그 안의 중단원 키는 뺀다(대단원이 전체를 포함한다).
        const ownChildren = (scope?.children || []).map((child) => child.key);
        // 대단원이 체크된 채로 중단원 하나를 풀면, 대단원 체크는 "나머지 중단원 전부(+ 중단원 미지정)"로 바뀐다.
        const checkedParent = !el.checked && !scope
          ? (V.displayedScopes || scopeOptions()).find((item) => scopeIsSelected(item) &&
              (item.children || []).some((child) => child.key === el.dataset.scope))
          : null;
        if (checkedParent) {
          const keep = checkedParent.children.filter((child) => child.key !== el.dataset.scope && child.count > 0).map((child) => child.key);
          state.scopes = [
            ...state.scopes.filter((x) => x !== checkedParent.key && !(!checkedParent.unified && checkedParent.paths.includes(x))),
            ...keep,
          ];
        } else state.scopes = el.checked
          ? [
              ...state.scopes.filter((x) => !legacyPaths.includes(x) && !ownChildren.includes(x)),
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
      } else if (el.id === "qpp") {
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
      status(e.message, true, e);
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
    rememberComposeConditions();
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
      syncComposeHeading();
    }
    state.prepared = [];
    scheduleSave();
    clearTimeout(V.previewTimer);
    V.previewTimer = setTimeout(updatePreview, 600);
  });
  // 출력 설정 접힘은 다시 그려도 유지한다(열림 여부를 state에 기억).
  document.addEventListener("toggle", (event) => {
    const target = event.target;
    if (target?.matches?.("[data-cz-output]")) state.outputSettingsOpen = Boolean(target.open);
    else if (target?.matches?.("[data-scope-group]")) state.scopeGroupOpen[target.dataset.scopeGroup] = Boolean(target.open);
  }, true);
  // 제목을 바꾸면 화면 맨 위 제목도 바로 새 이름을 보여 준다(출력 설정의 제목 칸과 머리글 칸 모두).
  function syncComposeHeading() {
    const heading = document.querySelector(".intro h1");
    if (heading?.firstChild) heading.firstChild.textContent = state.title + " ";
  }
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
      clearTimeout(V.previewTimer);
      V.previewTimer = setTimeout(updateOriginalPreview, 450);
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
      syncComposeHeading();
      state.prepared = [];
      scheduleSave();
      refreshComposeSaveContinuity();
      clearTimeout(V.previewTimer);
      V.previewTimer = setTimeout(updatePreview, 450);
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
      } catch (e) { if (isCurrentAuthorityError(e)) status(e.message, true, e); }
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
    state.view = ["home", "find", "compose", "saved", "recent", "health", "five-minute", "subunit-test", "unit-test", "monthly-test", "diagnostic"].includes(p.get("view"))
      ? p.get("view")
      : "home";
    if (isQuickAssessmentView()) {
      const grade = p.get(QUICK_URL_KEYS.grade) || "";
      quickState.grade = Unified?.GRADES.includes(grade) ? grade : "";
      quickState.subject = quickState.grade ? p.get(QUICK_URL_KEYS.subject) || "" : "";
      quickState.bundle.clear();
      quickState.pick = "";
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
    const clear = button("uid-route-clear", "전체 범위에서 직접 고르기", 'class="small"');
    if (route.error) {
      const rows = route.rejected.slice(0, 10).map((item) =>
        `<li><code>${esc(item.uid.length > 24 ? item.uid.slice(0, 24) + "…" : item.uid)}</code> · ${esc(UID_ROUTE_REASONS[item.reason] || item.reason)}</li>`).join("");
      const more = route.rejected.length > 10 ? `<li>외 ${route.rejected.length - 10}문항</li>` : "";
      return `<div class="resultbar"><h2>단원</h2></div><div class="callout danger" role="alert" data-uid-route="rejected"><strong>선택한 문항으로 문제지를 만들 수 없습니다.</strong><p>${esc(route.error)}</p>${rows || more ? `<ul>${rows}${more}</ul>` : ""}<p>${clear}</p></div>`;
    }
    const names = route.records.slice(0, 8).map((record, i) =>
      `${esc([record.year, record.school].filter(Boolean).join(" "))} ${esc(record.sourceQuestionNo ?? record.sourceOrdinal)}번`).join(" · ");
    const rest = route.records.length > 8 ? ` 외 ${route.records.length - 8}문항` : "";
    const scope = route.scopes[0];
    return `<div class="resultbar"><h2>단원</h2></div><div class="callout" role="status" data-uid-route="accepted">검색에서 선택한 ${route.records.length}문항으로 범위가 고정되었습니다. ${names}${rest}<p>${clear}</p></div>
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
    } catch (e) { if (isCurrentAuthorityError(e)) status(e.message, true, e); }
  }
  // The catalog adds the exam lookup the recent rows use for grade/subject: normalize again (cheap).
  function refreshRecentRowsFromCatalog() {
    if (state.view !== "recent" || state.recentLoading || !state.recentAssignments?.length) return;
    state.recentRows = History.normalizeAssignments(state.recentAssignments, V.classRows, state.catalog.exams, C);
    rememberRecentSubjectOptions(state.recentRows);
    updateRecentResults();
  }
  // Screens that read the unified unit index / recorded-meta index get them built before they are drawn,
  // while the progress text ("문항 목록 정리 중") is already on screen. The rest builds them when idle.
  const viewNeedsUnifiedIndex = () => ["find", "compose", "health"].includes(state.view) || isQuickAssessmentView();
  async function settleIndexesForView() {
    const unified = viewNeedsUnifiedIndex(), meta = isQuickAssessmentView() || state.view === "compose";
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

  Object.assign(WS.api, {
    FIVE_MINUTE_GUARD,
    isAuthError,
    FINDER_URL_KEYS,
    RECENT_URL_KEYS,
    QUICK_URL_KEYS,
    CATALOG_FREE_ACTIONS,
    DEFERRED_NOTICE,
    UID_ROUTE_SCOPE_KEY,
    UID_ROUTE_MAX,
    UID_ROUTE_REASONS,
    viewNeedsUnifiedIndex,
  });
  WS.link(); // again: the constants exported by this file are now visible to the other parts
  (async () => {
    readUrl();
    if (isQuickAssessmentView()) quickLoadGroups();
    else if (state.view === "compose") composeLoadGroups();
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
  })();})();
