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
    const statusLabel = status === "ARCHIVED" ? "보관 중" : "내 보관함";
    const statusAction = status === "ARCHIVED"
      ? `<button type="button" data-library-action="library-status" data-status="ACTIVE">보관함으로 복원</button>`
      : `<button type="button" data-library-action="library-status" data-status="ARCHIVED">보관</button>`;
    return `<section class="panel saved-paper-detail">
      <div class="intro"><div><p class="muted"><a href="workspace.html?view=saved">저장한 시험지</a> / ${statusLabel}</p><h1>${esc(title)}</h1><p class="muted">${esc(paperMetaLabel(paper))}</p></div><div class="actions"><a class="button-like primary" href="index.html?savedPaper=${encodeURIComponent(paper.id)}">학생에게 배포</a><a class="button-like" href="workspace.html?view=compose&amp;edit_saved_paper=${encodeURIComponent(paper.id)}">수정본 만들기</a><button type="button" data-library-action="copy">정확히 복사</button><button type="button" data-library-action="rename" data-paper-id="${esc(paper.id)}">이름 변경</button>${statusAction}<button type="button" data-library-action="list">목록</button></div></div>
      <div class="actions saved-paper-modes" role="group" aria-label="출력 미리보기">
        ${[["exam", "문제"], ["sol", "해설"], ["ans", "정답"]].map(([value, label]) => `<button type="button" data-library-action="mode" data-mode="${value}" class="small ${mode === value ? "active" : ""}">${label}</button>`).join("")}
        <button type="button" data-library-action="print" data-mode="${esc(mode)}" class="small">새 창에서 출력</button>
      </div>
      <iframe class="saved-paper-preview" title="저장한 시험지 미리보기" src="${esc(outputUrl(paper, envelope, mode))}"></iframe>
    </section>`;
  }

  function listMarkup(papers, cursor, message = "", statusFilter = "ACTIVE") {
    const cards = papers.map((paper) => {
      const status = paper.library_status || "ACTIVE";
      const title = paper.library_display_name || paper.title || "저장한 시험지";
      const useActions = status === "TRASHED"
        ? '<span class="muted">휴지통의 시험지는 새 배포와 출력을 할 수 없습니다.</span>'
        : `<a class="button-like" href="workspace.html?view=saved&paper_id=${encodeURIComponent(paper.id)}">열기</a><button type="button" data-library-action="print" data-paper-id="${esc(paper.id)}" data-mode="exam">출력</button><a class="button-like primary" href="index.html?savedPaper=${encodeURIComponent(paper.id)}">학생에게 배포</a>`;
      const statusAction = status === "ACTIVE"
        ? `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ARCHIVED">보관</button>`
        : status === "ARCHIVED"
          ? `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ACTIVE">보관함으로 복원</button>`
          : paper.legacy_tombstone
            ? '<span class="muted">기존 삭제 항목은 복원할 수 없습니다.</span>'
            : `<button type="button" data-library-action="library-status" data-paper-id="${esc(paper.id)}" data-status="ACTIVE">복원</button>`;
      const rename = status === "TRASHED" ? "" : `<button type="button" data-library-action="rename" data-paper-id="${esc(paper.id)}">이름 변경</button>`;
      const deleteButton = status === "TRASHED" ? "" : `<button type="button" data-library-action="delete" data-paper-id="${esc(paper.id)}" class="small danger">휴지통으로</button>`;
      return `<article class="saved-paper-card">
        <div class="saved-paper-copy"><h2>${esc(title)}${Number(paper.part_count) > 1 ? ` <span class="badge">${Number(paper.part_index) + 1}권 / ${Number(paper.part_count)}권</span>` : ""}</h2>
        <p class="muted">${esc(paperMetaLabel(paper))} · ${esc(status === "ACTIVE" ? "사용 중" : status === "ARCHIVED" ? "보관" : "휴지통")}</p></div>
        <div class="actions">${useActions}${rename}${statusAction}${deleteButton}</div>
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

  async function render(host, paperId = "", statusFilter = "ACTIVE") {
    if (!host) return;
    host.innerHTML = '<div class="panel loading" role="status">저장한 시험지를 불러오고 있습니다.</div>';
    const client = apiClient();
    if (paperId) {
      const data = await client.request("/archive-saved-papers/" + encodeURIComponent(paperId));
      const paper = data.paper;
      if (!paper?.snapshot) throw new Error("저장한 시험지 내용을 확인할 수 없습니다.");
      const envelope = await preparePreview(paper);
      host.innerHTML = detailMarkup(paper, envelope);
      bind(host, { paper, envelope, paperId, cursor: null, papers: [], statusFilter });
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
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor, "", statusFilter);
    bind(host, viewState);
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
  }

  function bind(host, viewState) {
    host.onclick = async (event) => {
      const button = event.target.closest("[data-library-action]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const action = button.dataset.libraryAction;
      const id = button.dataset.paperId || viewState.paperId;
      const currentView = viewState.statusFilter || "ACTIVE";
      try {
        if (action === "list") {
          history.pushState(null, "", "workspace.html?view=saved");
          await render(document.getElementById("content"), "", currentView);
        } else if (action === "status") {
          await render(host, "", button.dataset.status || "ACTIVE");
        } else if (action === "distribute") {
          location.href = "index.html?savedPaper=" + encodeURIComponent(id);
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
          if (viewState.paperId) await render(host, viewState.paperId);
          else await render(host, "", currentView);
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
          delete pending[paper.id];
          if (Object.keys(pending).length) localStorage.setItem(COPY_PENDING_KEY, JSON.stringify(pending));
          else localStorage.removeItem(COPY_PENDING_KEY);
          history.pushState(null, "", "workspace.html?view=saved&paper_id=" + encodeURIComponent(copyId));
          await render(host, copyId);
        } else if (action === "library-status") {
          await apiClient().request(
            "/archive-saved-papers/" + encodeURIComponent(id) + "/library",
            { status: button.dataset.status },
            "PATCH",
          );
          if (viewState.paperId) await render(host, viewState.paperId);
          else await render(host, "", currentView);
        } else if (action === "delete") {
          if (!confirm("이 시험지를 휴지통으로 이동할까요? 학생에게 이미 배포한 시험지와 오답 기록은 그대로 유지됩니다.")) return;
          await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id), undefined, "DELETE");
          await render(host, "", currentView);
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
          const popup = window.open("about:blank", "_blank");
          if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
          try {
            const data = viewState.paper ? { paper: viewState.paper } : await apiClient().request("/archive-saved-papers/" + encodeURIComponent(id));
            const paper = data.paper;
            const envelope = await preparePreview(paper, button.dataset.mode || "exam");
            popup.location.href = outputUrl(paper, envelope, envelope.mode, false);
          } catch (error) {
            popup.close();
            throw error;
          }
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

  return { render, preparePreview, outputUrl };
});
