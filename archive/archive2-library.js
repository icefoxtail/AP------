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

  function outputUrl(paper, key, mode) {
    const O = window.Archive2Output;
    const url = O.engineUrl("mixed_engine.html", location.href);
    url.searchParams.set("key", key);
    url.searchParams.set("q", String(paper.question_count));
    url.searchParams.set("mode", mode);
    url.searchParams.set("studio", "1");
    url.searchParams.set("archive2SavedStorageVersion", "2");
    O.applyUrl(url, {
      header: paper.snapshot.meta.printHeaderOptions,
      qpp: paper.snapshot.meta.qpp,
      includeQr: paper.snapshot.meta.includeQr,
    });
    url.searchParams.set("archive2Review", "1");
    return url.href;
  }

  function writeTemporarySnapshot(target, key, paper) {
    const storage = target?.sessionStorage;
    if (!storage) throw new Error("이 브라우저에서 시험지 미리보기를 위한 임시 저장 공간을 사용할 수 없습니다.");
    const questionKey = `mixedQuestions_${key}`;
    const metaKey = `mixedMeta_${key}`;
    const savedPrefixes = ["mixedQuestions_archive2-saved-", "mixedMeta_archive2-saved-"];
    try {
      for (let i = storage.length - 1; i >= 0; i--) {
        const existingKey = storage.key(i);
        if (savedPrefixes.some((prefix) => existingKey?.startsWith(prefix)) && existingKey !== questionKey && existingKey !== metaKey)
          storage.removeItem(existingKey);
      }
      storage.setItem(questionKey, JSON.stringify(paper.snapshot.questions));
      storage.setItem(metaKey, JSON.stringify(paper.snapshot.meta));
    } catch {
      try {
        storage.removeItem(questionKey);
        storage.removeItem(metaKey);
      } catch {}
      throw new Error("저장한 시험지 미리보기를 위한 임시 저장 공간이 부족합니다.");
    }
  }

  function preparePreview(paper, target = window) {
    const key = `archive2-saved-${paper.id}-preview`;
    writeTemporarySnapshot(target, key, paper);
    return key;
  }

  function detailMarkup(paper, key, mode = "exam") {
    const title = paper.title || paper.snapshot.meta.title || "저장한 시험지";
    return `<section class="panel saved-paper-detail">
      <div class="intro"><div><p class="muted"><a href="workspace.html?view=saved">저장한 시험지</a> / 상세</p><h1>${esc(title)}</h1><p class="muted">${esc(paperMetaLabel(paper))}</p></div><div class="actions"><a class="button-like primary" href="index.html?savedPaper=${encodeURIComponent(paper.id)}">학생에게 배포</a><button type="button" data-library-action="list">목록</button></div></div>
      <div class="actions saved-paper-modes" role="group" aria-label="출력 미리보기">
        ${[["exam", "문제"], ["sol", "해설"], ["ans", "정답"]].map(([value, label]) => `<button type="button" data-library-action="mode" data-mode="${value}" class="small ${mode === value ? "active" : ""}">${label}</button>`).join("")}
        <button type="button" data-library-action="print" data-mode="${esc(mode)}" class="small">새 창에서 출력</button>
      </div>
      <iframe class="saved-paper-preview" title="저장한 시험지 미리보기" src="${esc(outputUrl(paper, key, mode))}"></iframe>
    </section>`;
  }

  function listMarkup(papers, cursor, message = "") {
    const cards = papers.map((paper) => `<article class="saved-paper-card">
      <div class="saved-paper-copy"><h2>${esc(paper.title)}${Number(paper.part_count) > 1 ? ` <span class="badge">${Number(paper.part_index) + 1}권 / ${Number(paper.part_count)}권</span>` : ""}</h2>
      <p class="muted">${esc(paperMetaLabel(paper))}</p></div>
      <div class="actions"><a class="button-like" href="workspace.html?view=saved&paper_id=${encodeURIComponent(paper.id)}">열기</a><button type="button" data-library-action="print" data-paper-id="${esc(paper.id)}" data-mode="exam">출력</button><a class="button-like primary" href="index.html?savedPaper=${encodeURIComponent(paper.id)}">학생에게 배포</a><button type="button" data-library-action="delete" data-paper-id="${esc(paper.id)}" class="small danger">삭제</button></div>
    </article>`).join("");
    return `<div class="saved-library"><div class="intro"><div><h1>저장한 시험지</h1><p class="muted">저장한 완성본을 다시 열고 출력하거나, 기존 아카이브에서 학생을 선택해 배포합니다.</p></div><a class="button-like primary" href="workspace.html?view=compose">문제지 만들기</a></div>
      ${message ? `<p class="callout" role="status" aria-live="polite">${esc(message)}</p>` : ""}
      <section class="panel saved-paper-list" aria-label="저장한 시험지 목록">${cards || '<div class="empty">저장한 시험지가 없습니다. 문제지 만들기에서 시험지를 저장해 주세요.</div>'}</section>
      ${cursor ? '<div class="actions saved-library-more"><button type="button" data-library-action="more">더 불러오기</button></div>' : ""}</div>`;
  }

  async function render(host, paperId = "") {
    if (!host) return;
    host.innerHTML = '<div class="panel loading" role="status">저장한 시험지를 불러오고 있습니다.</div>';
    const client = apiClient();
    if (paperId) {
      const data = await client.request(`/archive-saved-papers/${encodeURIComponent(paperId)}`);
      const paper = data.paper;
      if (!paper?.snapshot) throw new Error("저장한 시험지 내용을 확인할 수 없습니다.");
      const key = preparePreview(paper);
      host.innerHTML = detailMarkup(paper, key);
      bind(host, { paper, key, paperId, cursor: null, papers: [] });
      return;
    }
    const data = await client.request("/archive-saved-papers?limit=20");
    const viewState = { paper: null, key: "", paperId: "", cursor: data.next_cursor || null, papers: data.papers || [] };
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor);
    bind(host, viewState);
  }

  async function loadMore(host, viewState) {
    if (!viewState.cursor) return;
    const data = await apiClient().request(`/archive-saved-papers?limit=20&cursor=${encodeURIComponent(viewState.cursor)}`);
    viewState.papers.push(...(data.papers || []));
    viewState.cursor = data.next_cursor || null;
    host.innerHTML = listMarkup(viewState.papers, viewState.cursor);
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
      try {
        if (action === "list") {
          history.pushState(null, "", "workspace.html?view=saved");
          await render(document.getElementById("content"));
        } else if (action === "distribute") {
          location.href = `index.html?savedPaper=${encodeURIComponent(id)}`;
        } else if (action === "more") {
          button.disabled = true;
          await loadMore(host, viewState);
        } else if (action === "delete") {
          if (!confirm("이 시험지를 보관함에서 삭제할까요? 이미 학생에게 배포한 시험지와 오답 기록은 그대로 유지됩니다.")) return;
          await apiClient().request(`/archive-saved-papers/${encodeURIComponent(id)}`, undefined, "DELETE");
          await render(host);
        } else if (action === "mode") {
          const mode = button.dataset.mode;
          const frame = host.querySelector(".saved-paper-preview");
          frame.src = outputUrl(viewState.paper, viewState.key, mode);
          host.querySelectorAll('[data-library-action="mode"]').forEach((item) => item.classList.toggle("active", item === button));
          const printButton = host.querySelector('[data-library-action="print"]');
          if (printButton) printButton.dataset.mode = mode;
        } else if (action === "print") {
          const popup = window.open("about:blank", "_blank");
          if (!popup) throw new Error("팝업을 허용한 뒤 다시 출력하세요.");
          try {
            const data = viewState.paper ? { paper: viewState.paper } : await apiClient().request(`/archive-saved-papers/${encodeURIComponent(id)}`);
            const paper = data.paper;
            const key = viewState.key || preparePreview(paper);
            writeTemporarySnapshot(popup, key, paper);
            popup.location.href = outputUrl(paper, key, button.dataset.mode || "exam");
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

  return { render, preparePreview };
});
