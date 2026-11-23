// Archive2 workspace, recent part: 출제 내역 screen and its assignment status.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const C = window.Archive2Core;
  const History = window.Archive2History;
  const O = window.Archive2Output;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, HANGUL, api, button, drafts, errorDetailMarkup, esc, gradeClass, isAuthError, loginNoticeMarkup,
    options, rememberCurrentHistoryEntry, rememberErrorInfo, replaceUrlState, routeUrl, showDialog,
    showLoginNotice, state, status, teacherErrorMessage, teacherSessionOk;
  WS.links.push(() => {
    ({
      $, HANGUL, api, button, drafts, errorDetailMarkup, esc, gradeClass, isAuthError, loginNoticeMarkup,
      options, rememberCurrentHistoryEntry, rememberErrorInfo, replaceUrlState, routeUrl, showDialog,
      showLoginNotice, state, status, teacherErrorMessage, teacherSessionOk
    } = WS.api);
  });
  let recentSubjectOptionUniverse = new Map();
  let recentPdfMutationVersions = new Map();
  V.recentPdfRetryIds = new Set();
  let recentRefetchTimer = null;
  function recentClassOptions() {
    const grade = state.recentFilters.grade;
    return V.classRows
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
    if (state.recentError) return `<p class="error history-result-state" role="alert">${esc(teacherErrorMessage(state.recentError))} ${button("recent-retry", "다시 시도", 'class="small"')}</p>${errorDetailMarkup(state.recentError)}`;
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
        a.replacementAssignmentId ? `<span class="history-state-chip">대체됨</span>` : "",
        a.replacesAssignmentId ? `<span class="history-state-chip">다른 출제를 대체한 출제</span>` : "",
        a.isReviewOnly ? `<span class="history-state-chip review-only">열람 전용${a.reviewOnlyCount === null ? "" : ` · ${a.reviewOnlyCount}명`}</span>` : "",
      ].filter(Boolean).join("");
      const pdfLabel = a.pdfReady ? "" : a.pdfStatus === "failed"
        ? "PDF 준비 실패" : a.pdfStatus === "generating" ? "PDF 준비 중" : "PDF 준비 필요";
      const pdfRetryPending = V.recentPdfRetryIds.has(String(a.id));
      const pdfRetry = !a.pdfReady && a.pdfStatus !== "generating"
        ? button("assignment-pdf", "PDF 다시 준비", `data-assignment="${esc(a.id)}" class="small"${pdfRetryPending ? " disabled aria-busy=\"true\"" : ""}`)
        : "";
      const sourceLine = !source ? "" : source.kind === "saved"
        ? `<button type="button" class="history-source is-link" data-action="recent-open-saved" data-paper-id="${esc(source.paperId)}" aria-label="보관함에서 이 문제지 열기">${esc(source.label)}</button>`
        : `<span class="history-source">${esc(source.label)}</span>`;
      const day = /^\d{4}-(\d{2})-(\d{2})$/.exec(a.date);
      const spineDate = day ? [`${Number(day[1])}월`, String(Number(day[2]))] : ["", "–"];
      return `<article class="history-card exam-row no-sim ${gradeClass(a.targetGrade || a.contentGrade)}" data-assignment-id="${esc(a.id)}" title="출제 번호 ${esc(a.id)}"><div class="exam-row-spine"${a.date ? ` title="${esc(a.date)}"` : ""}><span class="exam-row-grade">${esc(spineDate[0])}</span><span class="exam-row-year">${esc(spineDate[1])}</span><span class="exam-row-unit">${esc(a.targetGrade || a.contentGrade || "")}</span></div><div class="exam-row-main"><h3 class="history-title">${esc(shownTitle(a.title))}</h3>${sourceLine}<div class="history-card-meta exam-row-meta">${metadata.map((value, index) => `${index ? '<span aria-hidden="true">·</span>' : ""}<span${index === 0 && value === a.className ? ' class="history-class"' : ""}>${esc(value)}</span>`).join("")}</div>${lifecycle ? `<div class="history-card-states" aria-label="출제 상태">${lifecycle}</div>` : ""}${pdfLabel ? `<div class="history-pdf-actions"><span class="history-pdf">${pdfLabel}</span>${a.pdfError ? `<span class="history-pdf-error">${esc(pdfErrorText(a.pdfError))}</span>` : ""}${pdfRetry}</div>` : ""}</div><div class="exam-row-actions" role="group" aria-label="출제 ${esc(a.id)} 시험지·해설·정답·학생별 확인">${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([mode, label]) => button("assignment-output-direct", label, `data-assignment="${esc(a.id)}" data-mode="${mode}" class="small"`)).join("")}${button("assignment-status", "학생별 확인", `data-assignment="${esc(a.id)}" class="small"`)}${button("assignment-derive", "다시 만들기", `data-assignment="${esc(a.id)}" class="small" title="이 시험지로 다시 만들기" aria-label="${esc(a.title)} ${esc(a.className || "")} 이 시험지로 다시 만들기"`)}${a.isCancelled ? "" : button("assignment-cancel", "출제 취소", `data-assignment="${esc(a.id)}" class="small danger" aria-label="${esc(a.title)} ${esc(a.className || "")} 출제 취소"`)}</div></article>`;
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
    showDialog("출제 취소", `<p><strong>${esc(shownTitle(row.title))}</strong>${row.className ? ` · ${esc(row.className)}` : ""}${row.date ? ` · ${esc(row.date)}` : ""}</p>
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
      else status(message, true, error);
      return false;
    } finally {
      assignmentCancelBusy = false;
    }
  }
  // Where an assignment came from: a saved paper (link back to 보관함), a school exam, or 단원별 기출.
  // 출제 내역에 보이는 시험 이름: 저장된 exam_title이 내부 키(파일 이름 등)면 한글 제목으로 푼다. 저장값은 그대로.
  function shownTitle(value) {
    const text = String(value ?? "");
    return window.ExamDisplayTitle?.displayTitleOf?.(text, { fallback: text }) || text;
  }
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
          status(error.message || "출제 내역을 불러오지 못했습니다.", true, error);
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
      if (!V.classRows.length) {
        const data = await api("/qr-classes");
        if (!isCurrentRequest()) return false;
        V.classRows = Array.isArray(data.classes) ? data.classes : [];
      }
      if (state.recentClassId) {
        const selectedClass = V.classRows.find((row) => String(row.id || "") === state.recentClassId);
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
        state.recentAssignments, V.classRows, state.catalog?.exams || [], C,
      );
      rememberRecentSubjectOptions(state.recentRows);
      return true;
    } catch (error) {
      if (!isCurrentRequest()) return false;
      state.recentError = error.message || "출제 내역을 불러오지 못했습니다.";
      rememberErrorInfo(state.recentError, error);
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
      summary?.replacementAssignmentId ? `<span class="history-state-chip">대체됨</span>` : "",
      summary?.replacesAssignmentId ? `<span class="history-state-chip">다른 출제를 대체한 출제</span>` : "",
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
    const pdfRetryPending = V.recentPdfRetryIds.has(assignmentId);
    showDialog(
      shownTitle(a.exam_title),
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
  Object.assign(WS.api, {
    recentClassOptions,
    renderRecent,
    recentAssignmentMarkup,
    pdfErrorText,
    askCancelAssignment,
    cancelRecentAssignment,
    recentSourceOf,
    updateRecentResults,
    recentSubjectTerms,
    recentSubjectOptions,
    rememberRecentSubjectOptions,
    updateRecentFilterOptions,
    changeRecentFilter,
    invalidateRecentRequests,
    isStatusView,
    recentRequestIsCurrent,
    recentAuthorityError,
    assignmentStatusAuthorityError,
    recentPdfMutationVersion,
    advanceRecentPdfMutationVersion,
    isCurrentAuthorityError,
    scheduleRecentRefetch,
    loadRecent,
    renderAssignmentStatus,
    pdfRetryAuthority,
    isCurrentPdfRetryAuthority,
    applyRecentPdfMutationResult,
    assignmentStatus,
    openAssignmentOutput,
    openRecentAssignmentStatus,
  });
})();
