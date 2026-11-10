/* Server-backed saved-paper library. It deliberately does not load the catalog. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2Library = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
  const dateLabel = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value || "") : new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
  };
  const COPY_PENDING_KEY = "archive2.saved-paper-copy-pending.v1";
  const SAVED_LIBRARY_INVALIDATION_KEY = "archive2.saved-paper-list-invalidated.v1";
  let savedLibraryContextInvalidated = false;
  let savedLibraryContextPatch = null;
  let activeListState = null;
  let libraryViewVersion = 0;
  let activeLibraryMutation = false;
  let outsideCloseDocument = null;
  function writeSavedLibraryListContextInvalidation(patch) {
    savedLibraryContextInvalidated = true;
    savedLibraryContextPatch = patch;
    try { window.sessionStorage?.setItem(SAVED_LIBRARY_INVALIDATION_KEY, JSON.stringify(patch)); } catch {}
  }
  function invalidateSavedLibraryListContext(patch = null) {
    const previous = readSavedLibraryContextPatch();
    const next = savedLibraryContextInvalidated || previous
      ? { kind: "reload" }
      : (patch || { kind: "reload" });
    writeSavedLibraryListContextInvalidation(next);
  }
  function savedLibraryListContextIsInvalidated() {
    if (savedLibraryContextInvalidated) return true;
    try { return window.sessionStorage?.getItem(SAVED_LIBRARY_INVALIDATION_KEY) != null; } catch { return false; }
  }
  function clearSavedLibraryListContextInvalidation() {
    savedLibraryContextInvalidated = false;
    savedLibraryContextPatch = null;
    try { window.sessionStorage?.removeItem(SAVED_LIBRARY_INVALIDATION_KEY); } catch {}
  }
  function readSavedLibraryContextPatch() {
    if (savedLibraryContextPatch) return savedLibraryContextPatch;
    try {
      const value = JSON.parse(window.sessionStorage?.getItem(SAVED_LIBRARY_INVALIDATION_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch { return null; }
  }
  function patchSavedLibraryListContext(context, statusFilter) {
    const patch = readSavedLibraryContextPatch();
    if (!patch || !Array.isArray(context?.papers)) return null;
    if (patch.kind === "reload") return null;
    let papers = context.papers.slice();
    if (patch.kind === "rename") {
      papers = papers.map((paper) => paper.id === patch.paperId
        ? { ...paper, library_display_name: patch.displayName }
        : paper);
    } else if (patch.kind === "remove") {
      papers = papers.filter((paper) => paper.id !== patch.paperId);
    } else if (patch.kind === "status" && patch.paper?.id) {
      if (patch.paper.library_status === statusFilter) {
        const currentIndex = papers.findIndex((paper) => paper.id === patch.paper.id);
        if (currentIndex >= 0) {
          papers[currentIndex] = { ...papers[currentIndex], ...patch.paper };
        } else {
          papers = [patch.paper, ...papers];
        }
      } else {
        papers = papers.filter((paper) => paper.id !== patch.paper.id);
      }
    } else if (patch.kind === "insert" && statusFilter === "ACTIVE" && patch.paper?.id) {
      papers = [patch.paper, ...papers.filter((paper) => paper.id !== patch.paper.id)];
    } else return null;
    return { ...context, statusFilter, papers };
  }
  const paperMetaLabel = (paper) => [
    paper.grade,
    paper.subject,
    `${Number(paper.question_count)}문항`,
    `${dateLabel(paper.created_at)} 저장`,
  ].filter(Boolean).join(" · ");

  function apiClient() {
    const client = window.Archive2Api;
    if (!client?.request) throw new Error("교사 로그인 정보를 확인한 뒤 다시 시도해 주세요.");
    return client;
  }

  function outputUrl(paper, envelope, mode, preview = true) {
    const O = window.Archive2Output;
    const url = O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, {
      studio: true,
      preview,
    });
    url.searchParams.set("archive2SavedStorageVersion", "3");
    return url.href;
  }

  async function openOutput(paperId, mode = "exam", knownPaper = null) {
    const id = String(paperId || "");
    if (!id) throw new Error("출력할 시험지를 확인할 수 없습니다. 목록으로 돌아가 다시 선택해 주세요.");
    const popup = window.open("about:blank", "_blank");
    if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
    try {
      const data = knownPaper?.id === id
        ? { paper: knownPaper }
        : await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id));
      const paper = data.paper;
      if (paper?.id !== id || !paper.snapshot)
        throw new Error("저장한 시험지 내용을 확인할 수 없습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
      const envelope = await preparePreview(paper, mode);
      popup.location.href = outputUrl(paper, envelope, envelope.mode, false);
      return { paperId: id, outputRequestId: envelope.outputRequestId };
    } catch (error) {
      popup.close();
      throw error;
    }
  }

  async function preparePreview(paper, mode = "exam") {
    const snapshot = paper?.snapshot;
    if (!snapshot || !Array.isArray(snapshot.questions) || !snapshot.questions.length)
      throw new Error("저장한 시험지 내용을 확인할 수 없습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
    const questionUids = snapshot.meta?.questionUids || snapshot.questions.map((question) =>
      question.questionUid || question.source_question_uid || question._sourceQuestionUid || null,
    );
    return window.Archive2Output.publishOutputEnvelope({
      sourceKind: "saved-paper",
      sourceId: paper.id,
      paperId: paper.id,
      mode,
      questionCount: snapshot.questions.length,
      questionUids,
      meta: snapshot.meta,
      questions: snapshot.questions,
    });
  }

  function detailMarkup(paper, envelope, mode = "exam") {
    const title = paper.library_display_name || paper.title || paper.snapshot.meta.title || "저장한 시험지";
    const status = paper.library_status || "ACTIVE";
    if (status === "TRASHED") {
      const restore = paper.legacy_tombstone
        ? '<span class="muted">기존 삭제 항목은 복원할 수 없습니다.</span>'
        : `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ACTIVE">복원</button>`;
      return `<section class="panel saved-paper-detail"><div class="intro"><div><p class="muted"><button type="button" class="saved-library-back" data-library-action="list">보관함</button> / 휴지통</p><h1>${esc(title)}</h1><p class="muted">휴지통 항목에서는 출력과 출제를 사용할 수 없습니다.</p></div><div class="actions">${restore}</div></div></section>`;
    }
    const statusLabel = status === "ARCHIVED" ? "보관 중" : "내 보관함";
    const statusAction = status === "ARCHIVED"
      ? `<button type="button" data-library-action="library-status" data-status="ACTIVE">보관함으로 복원</button>`
      : `<button type="button" data-library-action="library-status" data-status="ARCHIVED">보관</button>`;
    return `<section class="panel saved-paper-detail">
      <div class="intro"><div><p class="muted"><button type="button" class="saved-library-back" data-library-action="list">보관함</button> / ${statusLabel}</p><h1>${esc(title)}</h1><p class="muted">${esc(paperMetaLabel(paper))}</p></div>
        <div class="actions saved-paper-more-wrap"><button type="button" class="primary" data-library-action="distribute" data-paper-id="${esc(paper.id)}">출제</button><details class="saved-paper-more"><summary>더보기</summary><div class="saved-paper-more-menu">${batchAction(paper, esc(paper.id))}<a class="button-like" href="workspace.html?view=compose&amp;edit_saved_paper=${encodeURIComponent(paper.id)}">수정본 만들기</a><button type="button" data-library-action="copy">정확히 복사</button><button type="button" data-library-action="rename" data-paper-id="${esc(paper.id)}">이름 변경</button>${statusAction}<button type="button" data-library-action="list">목록</button></div></details></div></div>
      <div class="actions saved-paper-modes" role="group" aria-label="출력 미리보기">
        ${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([value, label]) => `<button type="button" data-library-action="mode" data-mode="${value}" class="small ${mode === value ? "active" : ""}">${label}</button>`).join("")}
        <button type="button" data-library-action="print" data-mode="${esc(mode)}" class="small">새 창에서 출력</button>
      </div>
      <iframe class="saved-paper-preview" title="저장한 시험지 미리보기" src="${esc(outputUrl(paper, envelope, mode))}"></iframe>
    </section>`;
  }

  // ---- 출제 이력 (2026-11-10): the issue history sits inside each saved-paper row ----------------------
  // One recent-summary request per list (never one per card); rows are grouped by saved_paper_id here.
  // The server has no per-paper filter, so the window is the last 90 days (limit 1000 assignments).
  const HISTORY_DAYS = 90;
  const HISTORY_LIMIT = 1000;
  const HISTORY_STATUSES = ["ACTIVE", "ARCHIVED"];
  const HISTORY_VISIBLE = 3;
  const GRADE_CLASS = { 중1: "grade-m1", 중2: "grade-m2", 중3: "grade-m3", 고1: "grade-h1", 고2: "grade-h2", 고3: "grade-h3" };
  const gradeClassOf = (grade) => GRADE_CLASS[String(grade || "").slice(0, 2)] || "grade-none";
  function dayLabel(value, now = new Date()) {
    const text = String(value ?? "").trim();
    let year, month, day;
    const plain = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/);
    if (plain && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(text.slice(10))) {
      [year, month, day] = [Number(plain[1]), Number(plain[2]), Number(plain[3])];
    } else {
      const date = new Date(text);
      if (!text || Number.isNaN(date.getTime())) return "";
      [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    }
    return `${year === now.getFullYear() ? "" : `${year}년 `}${month}월 ${day}일`;
  }
  const countOrNull = (value) => {
    if (value == null || String(value).trim() === "" || typeof value === "boolean") return null;
    const count = Number(value);
    return Number.isInteger(count) && count >= 0 ? count : null;
  };
  function historyFromDate(now = new Date()) {
    const from = new Date(now.getTime() - HISTORY_DAYS * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`;
  }
  // Assignments of saved papers only, newest first, keyed by saved_paper_id. Papers never mix.
  function groupIssuesByPaper(assignments) {
    const byPaper = new Map();
    for (const row of Array.isArray(assignments) ? assignments : []) {
      const paperId = String(row?.saved_paper_id ?? "").trim();
      const id = String(row?.id ?? "").trim();
      if (!paperId || !id) continue;
      if (!byPaper.has(paperId)) byPaper.set(paperId, []);
      byPaper.get(paperId).push({
        id,
        classId: String(row.class_id ?? "").trim(),
        className: String(row.class_name ?? "").trim(),
        date: String(row.exam_date ?? "").slice(0, 10),
        recipients: countOrNull(row.recipient_count),
        submitted: countOrNull(row.submitted_count),
        cancelled: Boolean(String(row.cancelled_at ?? "").trim()) || Number(row.is_cancelled) === 1,
      });
    }
    for (const rows of byPaper.values()) rows.sort((a, b) => b.date.localeCompare(a.date));
    return byPaper;
  }
  function issueRowMarkup(issue) {
    const klass = issue.className || "반 이름 없음";
    const date = dayLabel(issue.date);
    const progress = issue.cancelled ? ""
      : issue.submitted !== null && issue.recipients !== null
        ? `<span class="paper-issue-count">제출 <strong>${issue.submitted}</strong> / ${issue.recipients}</span>`
        : issue.recipients !== null ? `<span class="paper-issue-count">대상 ${issue.recipients}명</span>` : "";
    return `<li class="paper-issue${issue.cancelled ? " is-cancelled" : ""}"><span class="paper-issue-class">${esc(klass)}</span>${date ? `<span class="paper-issue-date">${esc(date)}</span>` : ""}${issue.cancelled ? '<span class="paper-issue-cancelled">취소됨</span>' : progress}<button type="button" class="paper-issue-check" data-library-action="issue-status" data-assignment-id="${esc(issue.id)}" aria-label="${esc(klass)} ${esc(date)} 출제 학생별 확인">학생별 확인</button></li>`;
  }
  function issuesMarkup(paperId, history) {
    if (!history || history.state !== "ready") return "";
    const rows = history.byPaper.get(String(paperId)) || [];
    // Only the last HISTORY_DAYS days are known, so do not claim "never issued"; when the summary hit the
    // server cap even that is unknown, so say nothing.
    if (!rows.length) return history.truncated ? "" : `<p class="paper-issues-note">최근 ${HISTORY_DAYS}일 안에 출제한 기록이 없습니다.</p>`;
    const active = rows.filter((row) => !row.cancelled).length;
    const cancelled = rows.length - active;
    const summary = active
      ? `출제 ${active}회${cancelled ? ` · 취소 ${cancelled}회` : ""}`
      : `출제 없음 · 취소 ${cancelled}회`;
    const recent = rows.slice(0, HISTORY_VISIBLE), older = rows.slice(HISTORY_VISIBLE);
    return `<p class="paper-issues-summary">${esc(summary)}</p><ul class="paper-issue-list">${recent.map(issueRowMarkup).join("")}</ul>${older.length
      ? `<details class="paper-issues-older"><summary aria-expanded="false"><span class="when-closed">이전 출제 ${older.length}개 더 보기</span><span class="when-open">접기</span></summary><ul class="paper-issue-list">${older.map(issueRowMarkup).join("")}</ul></details>`
      : ""}`;
  }
  // The one line above the list: what the history covers, that it is loading, or that it failed (with 다시 시도).
  function historyNoteMarkup(history) {
    if (history?.state === "error")
      return '<span class="is-error" role="alert">출제 이력을 불러오지 못했습니다.</span> <button type="button" class="paper-issues-retry" data-library-action="history-retry">다시 시도</button>';
    if (!history || history.state === "loading")
      return `<span role="status">출제 이력 확인 중… (최근 ${HISTORY_DAYS}일까지 보입니다)</span>`;
    return history.truncated
      ? `출제 이력은 최근 ${HISTORY_DAYS}일까지 보입니다. 출제가 매우 많아 일부는 보이지 않을 수 있습니다.`
      : `출제 이력은 최근 ${HISTORY_DAYS}일까지 보입니다.`;
  }

  // 여러 권으로 저장된 묶음이면 더보기에 "이 묶음 n권 모두 출제"를 둔다(같은 반에 권마다 차례로 낸다).
  function batchAction(paper, id) {
    const parts = Number(paper.part_count);
    if (!(parts > 1) || !paper.save_batch_id) return "";
    return `<button type="button" data-library-action="distribute-batch" data-paper-id="${id}">이 묶음 ${parts}권 모두 출제</button>`;
  }

  function paperRowMarkup(paper, history) {
    const status = paper.library_status || "ACTIVE";
    const title = paper.library_display_name || paper.title || "저장한 시험지";
    const id = esc(paper.id);
    const statusAction = status === "ACTIVE"
      ? `<button type="button" data-library-action="library-status" data-paper-id="${id}" data-status="ARCHIVED">보관</button>`
      : status === "ARCHIVED"
        ? `<button type="button" data-library-action="library-status" data-paper-id="${id}" data-status="ACTIVE">보관함으로 복원</button>`
        : paper.legacy_tombstone
          ? '<span class="muted">기존 삭제 항목은 복원할 수 없습니다.</span>'
          : `<button type="button" data-library-action="library-status" data-paper-id="${id}" data-status="ACTIVE">복원</button>`;
    const trashed = status === "TRASHED";
    const parts = Number(paper.part_count) > 1 ? `${Number(paper.part_count)}권 중 ${Number(paper.part_index) + 1}권` : "";
    const meta = [paper.subject, dayLabel(paper.created_at) ? `${dayLabel(paper.created_at)} 저장` : "", parts]
      .filter(Boolean).map((value) => `<span>${esc(value)}</span>`).join('<span aria-hidden="true">·</span>');
    const stateBadge = status === "ARCHIVED" ? '<span class="badge">보관</span>' : trashed ? '<span class="badge">휴지통</span>' : "";
    const count = Number.isFinite(Number(paper.question_count)) ? String(Number(paper.question_count)) : "–";
    const actions = trashed
      ? `<div class="exam-row-actions" role="group" aria-label="${esc(title)} 휴지통 메뉴">${statusAction}</div>`
      : `<div class="exam-row-actions" role="group" aria-label="${esc(title)} 시험지·해설·정답·출제">
          ${[["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]].map(([mode, label]) => `<button type="button" data-library-action="output" data-paper-id="${id}" data-mode="${mode}">${label}</button>`).join("")}
          <button type="button" class="primary" data-library-action="distribute" data-paper-id="${id}">반에 출제</button>
          <details class="saved-paper-more"><summary>더보기</summary><div class="saved-paper-more-menu">
            <button type="button" data-library-action="detail" data-paper-id="${id}">상세 보기</button>
            ${batchAction(paper, id)}
            <a class="button-like" href="workspace.html?view=compose&amp;edit_saved_paper=${encodeURIComponent(paper.id)}">수정본 만들기</a>
            <button type="button" data-library-action="rename" data-paper-id="${id}">이름 변경</button>
            ${statusAction}
            <button type="button" data-library-action="delete" data-paper-id="${id}" class="danger">휴지통으로</button>
          </div></details>
        </div>`;
    return `<article class="exam-row saved-row ${gradeClassOf(paper.grade)}${trashed ? " no-issues" : ""}" data-paper-id="${id}">
      <div class="exam-row-spine"><span class="exam-row-grade">${esc(paper.grade || "")}</span><span class="exam-row-year">${esc(count)}</span><span class="exam-row-unit">문항</span></div>
      <div class="exam-row-main"><h2 class="saved-row-title">${esc(title)}</h2><div class="exam-row-meta">${meta}${stateBadge}</div></div>
      ${actions}
      ${trashed ? "" : `${(() => { const body = issuesMarkup(paper.id, history); return `<div class="paper-issues" data-issue-slot data-paper-id="${id}" aria-label="${esc(title)} 출제 이력"${body ? "" : " hidden"}>${body}</div>`; })()}`}
    </article>`;
  }

  function listMarkup(papers, cursor, message = "", statusFilter = "ACTIVE", history = null) {
    const withHistory = HISTORY_STATUSES.includes(statusFilter) ? history : null;
    const cards = papers.map((paper) => paperRowMarkup(paper, withHistory)).join("");
    const tabs = [["ACTIVE", "내 보관함"], ["ARCHIVED", "보관"], ["TRASHED", "휴지통"]];
    const emptyCopy = statusFilter === "ACTIVE"
      ? "저장한 문제지가 없습니다. 문제지 만들기에서 문제지를 저장해 주세요."
      : statusFilter === "ARCHIVED" ? "보관한 문제지가 없습니다." : "휴지통이 비어 있습니다.";
    const note = HISTORY_STATUSES.includes(statusFilter) && papers.length
      ? `<p class="muted saved-library-history-note" data-history-note>${historyNoteMarkup(history)}</p>` : "";
    return `<div class="saved-library">${window.Archive2Navigation?.libraryTabs?.("saved") || ""}<div class="intro"><div><h1>보관함</h1><p class="muted">저장한 문제지를 다시 열어 출력하거나 반에 출제하고, 누구에게 언제 냈는지 바로 확인합니다.</p></div><a class="button-like primary" href="workspace.html?view=compose">문제지 만들기</a></div>
      ${message ? `<p class="callout" role="status" aria-live="polite">${esc(message)}</p>` : ""}
      <div class="actions" role="tablist" aria-label="보관함 상태">${tabs.map(([value, label]) => `<button type="button" data-library-action="status" data-status="${value}" class="${statusFilter === value ? "active" : ""}">${label}</button>`).join("")}</div>
      ${note}
      <section class="saved-paper-list exam-rows" aria-label="저장한 문제지 목록">${cards || `<div class="empty">${emptyCopy}</div>`}</section>
      ${cursor ? '<div class="actions saved-library-more"><button type="button" data-library-action="more">더 불러오기</button></div>' : ""}</div>`;
  }

  // Fill the history slots in place so open 더보기 menus, focus and scroll are not disturbed.
  // A host without querySelectorAll (a bare test stub) just redraws the list.
  function paintHistory(host, viewState) {
    const history = viewState.history;
    if (typeof host.querySelectorAll !== "function") {
      host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", viewState.statusFilter, history);
      return;
    }
    host.querySelectorAll("[data-issue-slot]").forEach((slot) => {
      const body = issuesMarkup(slot.dataset?.paperId, history);
      slot.innerHTML = body;
      slot.hidden = !body;
    });
    host.querySelectorAll("[data-history-note]").forEach((note) => { note.innerHTML = historyNoteMarkup(history); });
  }

  let historyRequestSeq = 0;
  let activeListHost = null;
  let activeListVersion = -1;
  async function loadHistory(host, viewState) {
    if (!HISTORY_STATUSES.includes(viewState.statusFilter || "ACTIVE")) return;
    const version = libraryViewVersion;
    const token = ++historyRequestSeq;
    const stale = () => version !== libraryViewVersion || activeListState !== viewState || viewState.history?.token !== token;
    // First load: the list markup already says "확인 중…". A refresh keeps showing the last history until
    // the new one arrives; a retry after an error shows "확인 중…" again.
    const before = viewState.history;
    viewState.history = before?.state === "ready"
      ? { ...before, token }
      : { state: "loading", token, byPaper: new Map(), truncated: false };
    if (before?.state === "error") paintHistory(host, viewState);
    let data;
    try {
      data = await apiClient().request(
        `/class-exam-assignments/recent-summary?limit=${HISTORY_LIMIT}&from=${historyFromDate()}`,
      );
    } catch (error) {
      if (stale()) return;
      viewState.history = { state: "error", token, byPaper: new Map(), truncated: false };
      paintHistory(host, viewState);
      return;
    }
    if (stale()) return;
    const assignments = Array.isArray(data?.assignments) ? data.assignments : [];
    viewState.history = {
      state: "ready", token, byPaper: groupIssuesByPaper(assignments),
      truncated: assignments.length >= HISTORY_LIMIT,
    };
    paintHistory(host, viewState);
  }
  // The list is already drawn when this runs: the history never blocks the list.
  function startHistory(host, viewState) {
    activeListHost = host;
    activeListVersion = libraryViewVersion;
    loadHistory(host, viewState).catch(() => {});
  }
  // The workspace calls this when an issue dialog closes so a new issue shows up without a reload.
  // 지금 목록의 출제 이력(준비된 것만). 출제 패널이 "이미 냈습니다" 표시에 쓴다.
  function currentHistory() {
    const history = activeListState?.history;
    return history?.state === "ready" ? history : null;
  }
  function refreshHistory() {
    if (!activeListHost || !activeListState || activeListVersion !== libraryViewVersion) return false;
    loadHistory(activeListHost, activeListState).catch(() => {});
    return true;
  }

  async function render(host, paperId = "", statusFilter = "ACTIVE", options = {}) {
    if (!host) return;
    const version = ++libraryViewVersion;
    host.innerHTML = '<div class="panel loading" role="status">저장한 문제지를 불러오고 있습니다.</div>';
    const client = apiClient();
    if (paperId) {
      let data;
      try {
        data = await client.request("/archive-saved-papers/" + encodeURIComponent(paperId));
      } catch (error) {
        if (version !== libraryViewVersion) return false;
        throw error;
      }
      if (version !== libraryViewVersion) return false;
      const paper = data.paper;
      if (!paper?.snapshot) throw new Error("저장한 시험지 내용을 확인할 수 없습니다.");
      let envelope = null;
      if (paper.library_status !== "TRASHED") {
        try {
          envelope = await preparePreview(paper);
        } catch (error) {
          if (version !== libraryViewVersion) return false;
          throw error;
        }
        if (version !== libraryViewVersion) return false;
      }
      host.innerHTML = detailMarkup(paper, envelope);
      bind(host, { paper, envelope, paperId, cursor: null, papers: [], statusFilter });
      return;
    }
    const invalidated = savedLibraryListContextIsInvalidated();
    const restored = options.forceRefresh || typeof history === "undefined"
      ? null : history.state?.archive2SavedLibrary;
    const matchingContext = restored && restored.statusFilter === statusFilter && Array.isArray(restored.papers)
      ? restored : null;
    const patchedContext = invalidated && matchingContext
      ? patchSavedLibraryListContext(matchingContext, statusFilter)
      : null;
    if (patchedContext) {
      const viewState = {
        paper: null,
        key: "",
        paperId: "",
        cursor: patchedContext.cursor || null,
        papers: patchedContext.papers,
        statusFilter,
      };
      activeListState = viewState;
      host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", statusFilter);
      bind(host, viewState);
      startHistory(host, viewState);
      if (!history.state?.archive2SavedLibraryDetail)
        clearSavedLibraryListContextInvalidation();
      saveContext(viewState);
      const restoreScroll = () => window.scrollTo(0, Math.max(0, Number(patchedContext.scrollY) || 0));
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(restoreScroll);
      else restoreScroll();
      return;
    }
    if (matchingContext && !invalidated) {
      const restored = matchingContext;
      const viewState = {
        paper: null,
        key: "",
        paperId: "",
        cursor: restored.cursor || null,
        papers: restored.papers,
        statusFilter,
      };
      activeListState = viewState;
      host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", statusFilter);
      bind(host, viewState);
      startHistory(host, viewState);
      const restoreScroll = () => window.scrollTo(0, Math.max(0, Number(restored.scrollY) || 0));
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(restoreScroll);
      else restoreScroll();
      return;
    }
    let data;
    try {
      data = await client.request(
        "/archive-saved-papers?limit=20&status=" + encodeURIComponent(statusFilter),
      );
    } catch (error) {
      if (version !== libraryViewVersion) return false;
      throw error;
    }
    if (version !== libraryViewVersion) return false;
    const viewState = {
      paper: null,
      key: "",
      paperId: "",
      cursor: data.next_cursor || null,
      papers: data.papers || [],
      statusFilter,
    };
    activeListState = viewState;
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", statusFilter);
    bind(host, viewState);
    startHistory(host, viewState);
    if (typeof history === "undefined" || !history.state?.archive2SavedLibraryDetail)
      clearSavedLibraryListContextInvalidation();
    saveContext(viewState);
  }

  function invalidatePendingRequests() {
    libraryViewVersion++;
  }

  function saveContext(viewState = activeListState) {
    if (!viewState || viewState.paperId || typeof history === "undefined") return;
    const papers = (viewState.papers || []).map((paper) => {
      const summary = { ...paper };
      delete summary.snapshot;
      delete summary.questions;
      delete summary.mixed_payload_json;
      return summary;
    });
    const context = {
      statusFilter: viewState.statusFilter || "ACTIVE",
      papers,
      cursor: viewState.cursor || null,
      scrollY: Math.max(0, Number(window.scrollY) || 0),
    };
    try {
      history.replaceState({ ...(history.state || {}), archive2SavedLibrary: context }, "", location.href);
    } catch {}
  }

  async function loadMore(host, viewState) {
    if (!viewState.cursor) return;
    const version = libraryViewVersion;
    const cursor = viewState.cursor;
    let data;
    try {
      data = await apiClient().request(
        "/archive-saved-papers?limit=20&status=" + encodeURIComponent(viewState.statusFilter || "ACTIVE") +
        "&cursor=" + encodeURIComponent(cursor),
      );
    } catch (error) {
      if (version !== libraryViewVersion || activeListState !== viewState || viewState.cursor !== cursor) return;
      throw error;
    }
    if (version !== libraryViewVersion || activeListState !== viewState || viewState.cursor !== cursor) return;
    viewState.papers.push(...(data.papers || []));
    viewState.cursor = data.next_cursor || null;
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", viewState.statusFilter, viewState.history);
    bind(host, viewState);
    activeListState = viewState;
    saveContext(viewState);
  }

  async function renderAfterMutation(...args) {
    try {
      return await render(...args);
    } catch (error) {
      if (error && typeof error === "object") {
        try { error.savedMutationRefresh = true; } catch {}
      }
      throw error;
    }
  }

  function bind(host, viewState) {
    const ownerDocument = host.ownerDocument || (typeof document === "undefined" ? null : document);
    if (ownerDocument?.addEventListener && ownerDocument !== outsideCloseDocument) {
      ownerDocument.addEventListener("click", (event) => {
        if (event.target.closest?.(".saved-paper-more")) return;
        ownerDocument.querySelectorAll(".saved-paper-more[open]").forEach((menu) => { menu.open = false; });
      });
      outsideCloseDocument = ownerDocument;
    }
    if (typeof host.addEventListener === "function" && !host.archive2ToggleBound) {
      host.archive2ToggleBound = true;
      host.addEventListener("toggle", (event) => {
        const summary = event.target?.querySelector?.(":scope > summary");
        if (summary && event.target.classList?.contains("paper-issues-older"))
          summary.setAttribute("aria-expanded", String(Boolean(event.target.open)));
      }, true);
    }
    host.onclick = async (event) => {
      if (!event.target.closest(".saved-paper-more"))
        host.querySelectorAll(".saved-paper-more[open]").forEach((menu) => { menu.open = false; });
      const button = event.target.closest("[data-library-action]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const action = button.dataset.libraryAction;
      const id = button.dataset.paperId || viewState.paperId;
      const currentView = viewState.statusFilter || "ACTIVE";
      const authorityVersion = libraryViewVersion;
      const mutationAction = ["rename", "copy", "library-status", "delete"].includes(action);
      if (mutationAction && activeLibraryMutation) return;
      if (mutationAction) {
        activeLibraryMutation = true;
        host.querySelectorAll?.('[data-library-action="rename"],[data-library-action="copy"],[data-library-action="library-status"],[data-library-action="delete"]')
          .forEach((item) => { item.disabled = true; });
      }
      try {
        if (action === "list") {
          if (typeof history !== "undefined" && history.state?.archive2SavedLibraryDetail) history.back();
          else if (typeof window.Archive2WorkspaceShowSavedLibrary === "function")
            window.Archive2WorkspaceShowSavedLibrary(currentView);
          else await render(document.getElementById("content"), "", currentView);
        } else if (action === "status") {
          if (typeof window.Archive2WorkspaceShowSavedLibrary === "function")
            window.Archive2WorkspaceShowSavedLibrary(button.dataset.status || "ACTIVE");
          else await render(host, "", button.dataset.status || "ACTIVE");
        } else if (action === "distribute") {
          if (typeof window.Archive2WorkspaceSavedPaperIssue !== "function")
            throw new Error("저장한 시험지 출제 화면을 열 수 없습니다. 목록에서 다시 시도해 주세요.");
          // 보관함이 이미 가진 문제지 정보와 출제 이력을 넘겨 패널이 서버를 다시 부르지 않게 한다.
          const row = viewState.paper || viewState.papers.find((item) => item.id === id);
          await window.Archive2WorkspaceSavedPaperIssue(id, { papers: row ? [row] : [], history: currentHistory() });
        } else if (action === "distribute-batch") {
          if (typeof window.Archive2WorkspaceSavedPaperIssue !== "function")
            throw new Error("저장한 시험지 출제 화면을 열 수 없습니다. 목록에서 다시 시도해 주세요.");
          const row = viewState.paper || viewState.papers.find((item) => item.id === id);
          if (!row?.save_batch_id) throw new Error("이 묶음의 문제지를 확인할 수 없습니다. 새로고침한 뒤 다시 시도해 주세요.");
          button.disabled = true;
          button.closest?.("details")?.removeAttribute?.("open");
          try {
            const data = await apiClient().request("/archive-saved-papers/save-batches/" + encodeURIComponent(row.save_batch_id));
            // 휴지통에 있는 권은 서버가 출제를 거절하므로 뺀다.
            const parts = (Array.isArray(data?.papers) ? data.papers : []).filter((item) => (item.library_status || "ACTIVE") !== "TRASHED");
            if (!parts.length) throw new Error("이 묶음에서 출제할 수 있는 문제지가 없습니다.");
            await window.Archive2WorkspaceSavedPaperIssue(parts[0].id, { papers: parts, history: currentHistory() });
          } finally {
            button.disabled = false;
          }
        } else if (action === "output") {
          await openOutput(id, button.dataset.mode || "exam");
        } else if (action === "detail") {
          if (typeof window.Archive2WorkspaceShowSavedPaper === "function")
            window.Archive2WorkspaceShowSavedPaper(id, currentView);
          else await render(host, id, currentView);
        } else if (action === "issue-status") {
          if (typeof window.Archive2WorkspaceOpenAssignmentStatus !== "function")
            throw new Error("학생별 확인 화면을 열 수 없습니다. 새로고침한 뒤 다시 시도해 주세요.");
          await window.Archive2WorkspaceOpenAssignmentStatus(button.dataset.assignmentId);
        } else if (action === "history-retry") {
          if (activeListState === viewState) await loadHistory(host, viewState);
        } else if (action === "more") {
          button.disabled = true;
          await loadMore(host, viewState);
        } else if (action === "rename") {
          const paper = viewState.paper || viewState.papers.find((row) => row.id === id);
          const currentName = paper?.library_display_name || paper?.title || "";
          const nextName = window.prompt("보관함에서 표시할 이름", currentName);
          if (nextName === null) return;
          const renamed = await apiClient().request(
            "/archive-saved-papers/" + encodeURIComponent(id) + "/library",
            { display_name: nextName },
            "PATCH",
          );
          const displayName = Object.hasOwn(renamed?.paper || {}, "library_display_name")
            ? renamed.paper.library_display_name || ""
            : nextName.trim();
          invalidateSavedLibraryListContext({ kind: "rename", paperId: id, displayName });
          if (authorityVersion !== libraryViewVersion) return;
          if (viewState.paperId) await renderAfterMutation(host, viewState.paperId, currentView);
          else await renderAfterMutation(host, "", currentView, { forceRefresh: true });
        } else if (action === "copy") {
          const paper = viewState.paper;
          if (!paper?.id || !/^[0-9a-f]{64}$/i.test(String(paper.snapshot_hash || "")))
            throw new Error("복사할 시험지의 저장 내용을 확인할 수 없습니다. 새로고침한 뒤 다시 시도해 주세요.");
          let pending = {};
          try {
            const parsed = JSON.parse(localStorage.getItem(COPY_PENDING_KEY) || "{}");
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) pending = parsed;
          } catch {}
          const batchId = pending[paper.id] || window.crypto?.randomUUID?.() || crypto.randomUUID();
          pending[paper.id] = batchId;
          localStorage.setItem(COPY_PENDING_KEY, JSON.stringify(pending));
          const data = await apiClient().request(
            "/archive-saved-papers/" + encodeURIComponent(paper.id) + "/copy",
            { save_batch_id: batchId, expected_snapshot_hash: paper.snapshot_hash },
            "POST",
          );
          const copyId = data.papers?.[0]?.id;
          if (!copyId) {
            invalidateSavedLibraryListContext({ kind: "reload" });
            throw new Error("시험지 사본 생성 결과를 확인하지 못했습니다.");
          }
          const copiedPaper = data.papers[0];
          invalidateSavedLibraryListContext({ kind: "insert", paper: copiedPaper });
          delete pending[paper.id];
          if (Object.keys(pending).length) localStorage.setItem(COPY_PENDING_KEY, JSON.stringify(pending));
          else localStorage.removeItem(COPY_PENDING_KEY);
          if (authorityVersion !== libraryViewVersion) return;
          if (typeof window.Archive2WorkspaceShowSavedPaper === "function")
            window.Archive2WorkspaceShowSavedPaper(copyId, currentView);
          else await renderAfterMutation(host, copyId, currentView);
        } else if (action === "library-status") {
          const result = await apiClient().request(
            "/archive-saved-papers/" + encodeURIComponent(id) + "/library",
            { status: button.dataset.status },
            "PATCH",
          );
          const updatedPaper = result.paper?.id ? result.paper : viewState.paper
            ? {
              id: viewState.paper.id,
              title: viewState.paper.title,
              library_display_name: viewState.paper.library_display_name,
              library_status: button.dataset.status,
            }
            : null;
          invalidateSavedLibraryListContext(updatedPaper?.id
            ? { kind: "status", paper: updatedPaper }
            : null);
          if (authorityVersion !== libraryViewVersion) return;
          if (viewState.paperId) await renderAfterMutation(host, viewState.paperId, currentView, { forceRefresh: true });
          else await renderAfterMutation(host, "", currentView, { forceRefresh: true });
        } else if (action === "delete") {
          if (!confirm("이 시험지를 휴지통으로 이동할까요? 학생에게 이미 출제한 시험지와 오답 기록은 그대로 유지됩니다.")) return;
          await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id), undefined, "DELETE");
          invalidateSavedLibraryListContext({ kind: "remove", paperId: id });
          if (authorityVersion !== libraryViewVersion) return;
          await renderAfterMutation(host, "", currentView, { forceRefresh: true });
        } else if (action === "mode") {
          const mode = button.dataset.mode;
          const frame = host.querySelector(".saved-paper-preview");
          const envelope = await preparePreview(viewState.paper, mode);
          if (authorityVersion !== libraryViewVersion || !frame?.isConnected) return;
          frame.src = outputUrl(viewState.paper, envelope, mode);
          viewState.envelope = envelope;
          host.querySelectorAll('[data-library-action="mode"]').forEach((item) => item.classList.toggle("active", item === button));
          const printButton = host.querySelector('[data-library-action="print"]');
          if (printButton) printButton.dataset.mode = mode;
        } else if (action === "print") {
          await openOutput(id, button.dataset.mode || "exam", viewState.paper);
        }
      } catch (error) {
        if (mutationAction) invalidateSavedLibraryListContext({ kind: "reload" });
        if (authorityVersion !== libraryViewVersion && !error?.savedMutationRefresh) return;
        const message = document.createElement("p");
        message.className = "callout danger";
        message.setAttribute("role", "alert");
        // Codes and English never reach the teacher; the original stays in the console for diagnosis.
        const raw = String(error?.message || "");
        const teacherText = /[가-힣]/.test(raw) && !/^[A-Z][A-Z0-9_]{3,}:/.test(raw) ? raw : "요청을 처리하지 못했습니다. 다시 시도하고, 계속되면 관리자에게 알려 주세요.";
        if (raw && teacherText !== raw) console.warn("[archive2] library request failed:", raw);
        message.textContent = teacherText;
        host.prepend(message);
      } finally {
        if (mutationAction) {
          activeLibraryMutation = false;
          if (authorityVersion === libraryViewVersion)
            host.querySelectorAll?.('[data-library-action="rename"],[data-library-action="copy"],[data-library-action="library-status"],[data-library-action="delete"]')
              .forEach((item) => { item.disabled = false; });
        }
      }
    };
  }

  return {
    render, preparePreview, outputUrl, openOutput, saveContext, invalidatePendingRequests, refreshHistory, currentHistory,
    // exposed for tests and for the workspace: pure helpers of the issue history
    groupIssuesByPaper, dayLabel,
  };
});
