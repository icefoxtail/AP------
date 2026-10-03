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
  let outsideCloseDocument = null;
  function invalidateSavedLibraryListContext(patch = null) {
    savedLibraryContextInvalidated = true;
    savedLibraryContextPatch = patch;
    try { window.sessionStorage?.setItem(SAVED_LIBRARY_INVALIDATION_KEY, JSON.stringify(patch || {})); } catch {}
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
    if (!id) throw new Error("출력할 Saved Paper ID를 확인할 수 없습니다.");
    const popup = window.open("about:blank", "_blank");
    if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
    try {
      const data = knownPaper?.id === id
        ? { paper: knownPaper }
        : await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id));
      const paper = data.paper;
      if (paper?.id !== id || !paper.snapshot)
        throw new Error("저장한 시험지 snapshot을 확인할 수 없습니다.");
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
      throw new Error("저장한 시험지 snapshot을 확인할 수 없습니다.");
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
      return `<section class="panel saved-paper-detail"><div class="intro"><div><p class="muted"><button type="button" class="saved-library-back" data-library-action="list">저장한 시험지</button> / 휴지통</p><h1>${esc(title)}</h1><p class="muted">휴지통 항목에서는 출력과 출제를 사용할 수 없습니다.</p></div><div class="actions">${restore}</div></div></section>`;
    }
    const statusLabel = status === "ARCHIVED" ? "보관 중" : "내 보관함";
    const statusAction = status === "ARCHIVED"
      ? `<button type="button" data-library-action="library-status" data-status="ACTIVE">보관함으로 복원</button>`
      : `<button type="button" data-library-action="library-status" data-status="ARCHIVED">보관</button>`;
    return `<section class="panel saved-paper-detail">
      <div class="intro"><div><p class="muted"><button type="button" class="saved-library-back" data-library-action="list">저장한 시험지</button> / ${statusLabel}</p><h1>${esc(title)}</h1><p class="muted">${esc(paperMetaLabel(paper))}</p></div>
        <div class="actions saved-paper-more-wrap"><button type="button" class="primary" data-library-action="distribute" data-paper-id="${esc(paper.id)}">출제</button><details class="saved-paper-more"><summary>더보기</summary><div class="saved-paper-more-menu"><a class="button-like" href="workspace.html?view=compose&amp;edit_saved_paper=${encodeURIComponent(paper.id)}">수정본 만들기</a><button type="button" data-library-action="copy">정확히 복사</button><button type="button" data-library-action="rename" data-paper-id="${esc(paper.id)}">이름 변경</button>${statusAction}<button type="button" data-library-action="list">목록</button></div></details></div></div>
      <div class="actions saved-paper-modes" role="group" aria-label="출력 미리보기">
        ${[["exam", "시험"], ["sol", "해설"], ["ans", "정답"]].map(([value, label]) => `<button type="button" data-library-action="mode" data-mode="${value}" class="small ${mode === value ? "active" : ""}">${label}</button>`).join("")}
        <button type="button" data-library-action="print" data-mode="${esc(mode)}" class="small">새 창에서 출력</button>
      </div>
      <iframe class="saved-paper-preview" title="저장한 시험지 미리보기" src="${esc(outputUrl(paper, envelope, mode))}"></iframe>
    </section>`;
  }

  function listMarkup(papers, cursor, message = "", statusFilter = "ACTIVE") {
    const cards = papers.map((paper) => {
      const status = paper.library_status || "ACTIVE";
      const title = paper.library_display_name || paper.title || "저장한 시험지";
      const statusAction = status === "ACTIVE"
        ? `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ARCHIVED">보관</button>`
        : status === "ARCHIVED"
          ? `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ACTIVE">보관함으로 복원</button>`
          : paper.legacy_tombstone
            ? '<span class="muted">기존 삭제 항목은 복원할 수 없습니다.</span>'
            : `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ACTIVE">복원</button>`;
      const useActions = status === "TRASHED"
        ? `<div class="saved-paper-primary-actions" role="group" aria-label="${esc(title)} 휴지통 action">${statusAction}</div>`
        : `<div class="saved-paper-primary-actions" role="group" aria-label="${esc(title)} 시험·해설·정답·출제">
            ${[["exam", "시험"], ["sol", "해설"], ["ans", "정답"]].map(([mode, label]) => `<button type="button" data-library-action="output" data-paper-id="${esc(paper.id)}" data-mode="${mode}">${label}</button>`).join("")}
            <button type="button" class="primary" data-library-action="distribute" data-paper-id="${esc(paper.id)}">출제</button>
          </div>
          <details class="saved-paper-more"><summary>더보기</summary><div class="saved-paper-more-menu">
            <button type="button" data-library-action="detail" data-paper-id="${esc(paper.id)}">상세 보기</button>
            <a class="button-like" href="workspace.html?view=compose&amp;edit_saved_paper=${encodeURIComponent(paper.id)}">수정본 만들기</a>
            <button type="button" data-library-action="rename" data-paper-id="${esc(paper.id)}">이름 변경</button>
            ${statusAction}
            <button type="button" data-library-action="delete" data-paper-id="${esc(paper.id)}" class="danger">휴지통으로</button>
          </div></details>`;
      return `<article class="saved-paper-card">
        <div class="saved-paper-copy"><h2>${esc(title)}${Number(paper.part_count) > 1 ? ` <span class="badge">${Number(paper.part_index) + 1}권 / ${Number(paper.part_count)}권</span>` : ""}</h2>
        <p class="muted">${esc(paperMetaLabel(paper))} · ${esc(status === "ACTIVE" ? "사용 중" : status === "ARCHIVED" ? "보관" : "휴지통")}</p></div>
        <div class="saved-paper-card-actions">${useActions}</div>
      </article>`;
    }).join("");
    const tabs = [["ACTIVE", "내 보관함"], ["ARCHIVED", "보관"], ["TRASHED", "휴지통"]];
    const emptyCopy = statusFilter === "ACTIVE"
      ? "저장한 시험지가 없습니다. 문제지 만들기에서 시험지를 저장해 주세요."
      : statusFilter === "ARCHIVED" ? "보관한 시험지가 없습니다." : "휴지통이 비어 있습니다.";
    return `<div class="saved-library"><div class="intro"><div><h1>저장한 시험지</h1><p class="muted">저장한 완성본을 다시 열고 출력하거나, 기존 아카이브에서 학생을 선택해 배포합니다.</p></div><a class="button-like primary" href="workspace.html?view=compose">문제지 만들기</a></div>
      ${message ? `<p class="callout" role="status" aria-live="polite">${esc(message)}</p>` : ""}
      <div class="actions" role="tablist" aria-label="보관함 상태">${tabs.map(([value, label]) => `<button type="button" data-library-action="status" data-status="${value}" class="${statusFilter === value ? "active" : ""}">${label}</button>`).join("")}</div>
      <section class="panel saved-paper-list" aria-label="저장한 시험지 목록">${cards || `<div class="empty">${emptyCopy}</div>`}</section>
      ${cursor ? '<div class="actions saved-library-more"><button type="button" data-library-action="more">더 불러오기</button></div>' : ""}</div>`;
  }

  async function render(host, paperId = "", statusFilter = "ACTIVE", options = {}) {
    if (!host) return;
    host.innerHTML = '<div class="panel loading" role="status">저장한 시험지를 불러오고 있습니다.</div>';
    const client = apiClient();
    if (paperId) {
      const data = await client.request("/archive-saved-papers/" + encodeURIComponent(paperId));
      const paper = data.paper;
      if (!paper?.snapshot) throw new Error("저장한 시험지 내용을 확인할 수 없습니다.");
      const envelope = paper.library_status === "TRASHED" ? null : await preparePreview(paper);
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
      const restoreScroll = () => window.scrollTo(0, Math.max(0, Number(restored.scrollY) || 0));
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(restoreScroll);
      else restoreScroll();
      return;
    }
    const data = await client.request(
      "/archive-saved-papers?limit=20&status=" + encodeURIComponent(statusFilter),
    );
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
    if (typeof history === "undefined" || !history.state?.archive2SavedLibraryDetail)
      clearSavedLibraryListContextInvalidation();
    saveContext(viewState);
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
    const data = await apiClient().request(
      "/archive-saved-papers?limit=20&status=" + encodeURIComponent(viewState.statusFilter || "ACTIVE") +
      "&cursor=" + encodeURIComponent(viewState.cursor),
    );
    viewState.papers.push(...(data.papers || []));
    viewState.cursor = data.next_cursor || null;
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", viewState.statusFilter);
    bind(host, viewState);
    activeListState = viewState;
    saveContext(viewState);
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
          await window.Archive2WorkspaceSavedPaperIssue(id);
        } else if (action === "output") {
          await openOutput(id, button.dataset.mode || "exam");
        } else if (action === "detail") {
          if (typeof window.Archive2WorkspaceShowSavedPaper === "function")
            window.Archive2WorkspaceShowSavedPaper(id, currentView);
          else await render(host, id, currentView);
        } else if (action === "more") {
          button.disabled = true;
          await loadMore(host, viewState);
        } else if (action === "rename") {
          const paper = viewState.paper || viewState.papers.find((row) => row.id === id);
          const currentName = paper?.library_display_name || paper?.title || "";
          const nextName = window.prompt("보관함에서 표시할 이름", currentName);
          if (nextName === null) return;
          await apiClient().request(
            "/archive-saved-papers/" + encodeURIComponent(id) + "/library",
            { display_name: nextName },
            "PATCH",
          );
          invalidateSavedLibraryListContext({ kind: "rename", paperId: id, displayName: nextName.trim() });
          if (viewState.paperId) await render(host, viewState.paperId, currentView);
          else await render(host, "", currentView, { forceRefresh: true });
        } else if (action === "copy") {
          const paper = viewState.paper;
          if (!paper?.id || !/^[0-9a-f]{64}$/i.test(String(paper.snapshot_hash || "")))
            throw new Error("복사할 immutable snapshot identity를 확인할 수 없습니다.");
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
          if (!copyId) throw new Error("시험지 사본 생성 결과를 확인하지 못했습니다.");
          const copiedPaper = data.papers[0];
          invalidateSavedLibraryListContext({ kind: "insert", paper: copiedPaper });
          delete pending[paper.id];
          if (Object.keys(pending).length) localStorage.setItem(COPY_PENDING_KEY, JSON.stringify(pending));
          else localStorage.removeItem(COPY_PENDING_KEY);
          if (typeof window.Archive2WorkspaceShowSavedPaper === "function")
            window.Archive2WorkspaceShowSavedPaper(copyId, currentView);
          else await render(host, copyId, currentView);
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
          if (viewState.paperId) await render(host, viewState.paperId, currentView, { forceRefresh: true });
          else await render(host, "", currentView, { forceRefresh: true });
        } else if (action === "delete") {
          if (!confirm("이 시험지를 휴지통으로 이동할까요? 학생에게 이미 배포한 시험지와 오답 기록은 그대로 유지됩니다.")) return;
          await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id), undefined, "DELETE");
          invalidateSavedLibraryListContext({ kind: "remove", paperId: id });
          await render(host, "", currentView, { forceRefresh: true });
        } else if (action === "mode") {
          const mode = button.dataset.mode;
          const frame = host.querySelector(".saved-paper-preview");
          const envelope = await preparePreview(viewState.paper, mode);
          frame.src = outputUrl(viewState.paper, envelope, mode);
          viewState.envelope = envelope;
          host.querySelectorAll('[data-library-action="mode"]').forEach((item) => item.classList.toggle("active", item === button));
          const printButton = host.querySelector('[data-library-action="print"]');
          if (printButton) printButton.dataset.mode = mode;
        } else if (action === "print") {
          await openOutput(id, button.dataset.mode || "exam", viewState.paper);
        }
      } catch (error) {
        const message = document.createElement("p");
        message.className = "callout danger";
        message.setAttribute("role", "alert");
        message.textContent = error.message || "요청을 처리하지 못했습니다.";
        host.prepend(message);
      }
    };
  }

  return { render, preparePreview, outputUrl, openOutput, saveContext };
});
