// Archive2 workspace, preview part: preview, print, original exam output.
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
    $, api, button, composeFinishButtons, composeUnitLabel, currentSavedPaperIds, displayTemplate, esc,
    frozenPaperCache, lockedIndex, openAssignmentOutput, options, originalSettingsForExam, ownHistoryContext,
    clearedResult, prepare, prepareSignature, render, replace, request, review, state, status, teacherErrorMessage;
  WS.links.push(() => {
    ({
      $, api, button, composeFinishButtons, composeUnitLabel, currentSavedPaperIds, displayTemplate, esc,
      frozenPaperCache, lockedIndex, openAssignmentOutput, options, originalSettingsForExam,
      ownHistoryContext, clearedResult, prepare, prepareSignature, render, replace, request, review, state, status,
      teacherErrorMessage
    } = WS.api);
  });
  let previewOutputEnvelope = null;
  V.previewTimer = undefined;
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
      const info = V.composeLiveInfo;
      const disabled = !info || info.disabled || Boolean(state.shardBusy);
      // 좁은 화면에서 조건을 바꿔 문제지가 지워졌다면, 스크롤 없이 보이는 이 띠에도 되돌리기를 둔다(안내 줄 자리에). 띠는 넓은 화면에서 숨는다.
      const restorable = Boolean(clearedResult());
      const note = (text) => state.shardBusy ? '<span class="cz-bar-note">문항 목록을 불러오는 중</span>' : restorable ? button("restore-cleared", "방금 문제지 되돌리기", 'class="cz-bar-restore"') : `<span class="cz-bar-note">${text}</span>`;
      return `<div class="cz-bar" role="region" aria-label="문제지 작업"><div class="cz-bar-text">${info?.hasRows && info.overLimit
        ? `<strong class="cz-bar-count">최대 400문항</strong>${note(`지금 요청 ${info.requested}문항`)}`
        : info?.hasRows
        ? `<strong class="cz-bar-count">${info.possible}문항 가능</strong>${note(`요청 ${info.requested}문항`)}`
        : `<strong class="cz-bar-count">조건을 고르세요</strong>${note("단원을 고르면 문항 수가 보입니다")}`}</div>${button("generate", "문제지 만들기", `class="primary cz-bar-main" ${disabled ? "disabled" : ""}`)}</div>`;
    }
    const buttons = composeFinishButtons(r);
    const parts = Math.max(1, Math.ceil(state.selected.length / 50));
    const saved = currentSavedPaperIds().length > 0;
    return `<div class="cz-bar" role="region" aria-label="문제지 작업"><div class="cz-bar-text"><strong class="cz-bar-count">${state.selected.length}문항 · ${parts}권</strong>${saved ? '<span class="cz-bar-note">저장했습니다</span>' : ""}</div>${button("print", "출력", `class="cz-bar-sub" ${buttons.printDisabled ? "disabled" : ""}`)}<details class="cz-more cz-bar-more"><summary>더보기</summary><div class="cz-more-menu">${buttons.save}${buttons.assign}${button("backup", "작업 백업 다운로드", 'class="small"')}</div></details></div>`;
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
  // 미리보기가 그려진 내용의 서명: 준비 서명(문항 순서·머리글·쪽당 문항·회차·QR·파생 원본)에 보는 권, 출력 종류,
  // 그 권의 출제 영수증, 카탈로그 판을 더한 값이다. 이 값이 같으면 미리보기를 다시 그리지 않는다.
  // 인쇄·저장·상태줄처럼 문제지 내용이 그대로인 다시 그리기는 iframe을 건드리지 않는다.
  function previewSignature() {
    return JSON.stringify([
      prepareSignature(),
      state.previewIndex,
      state.outputMode,
      Parts.receipt(state.receipts, state.previewIndex)?.key || "",
      state.catalog?.indexVersion || "",
    ]);
  }
  // render()가 #content 전체를 새로 쓸 때, 이미 그려진 미리보기(같은 서명)는 iframe째 그 자리에 남기고 나머지만 바꾼다.
  // iframe은 DOM에서 빠졌다 들어오면 다시 불러오므로, 미리보기 칸으로 이어지는 조상 요소는 유지하고 그 곁가지만 교체한다.
  function setContentKeepingPreview(html) {
    const content = $("content");
    const oldHost = content.querySelector?.("#preview-host");
    if (!oldHost || state.view !== "compose" || oldHost.dataset.previewSignature !== previewSignature()) {
      content.innerHTML = html;
      return;
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    const newHost = template.content.querySelector("#preview-host");
    const chain = (node, root) => {
      const path = [];
      for (let n = node; n && n !== root; n = n.parentNode) path.unshift(n);
      return path;
    };
    const oldPath = chain(oldHost, content);
    const newPath = chain(newHost, template.content);
    if (
      !newHost || oldPath.length !== newPath.length ||
      oldPath.some((node, i) => node.nodeName !== newPath[i].nodeName)
    ) {
      content.innerHTML = html;
      return;
    }
    let oldParent = content;
    for (let i = 0; i < oldPath.length - 1; i += 1) {
      const oldNode = oldPath[i],
        newNode = newPath[i];
      const before = [],
        after = [];
      for (let n = newNode.previousSibling; n; n = n.previousSibling) before.unshift(n);
      for (let n = newNode.nextSibling; n; n = n.nextSibling) after.push(n);
      while (oldNode.previousSibling) oldNode.previousSibling.remove();
      while (oldNode.nextSibling) oldNode.nextSibling.remove();
      for (const n of before) oldParent.insertBefore(n, oldNode);
      for (const n of after) oldParent.appendChild(n);
      for (const attribute of [...oldNode.attributes]) if (!newNode.hasAttribute(attribute.name)) oldNode.removeAttribute(attribute.name);
      for (const attribute of [...newNode.attributes]) oldNode.setAttribute(attribute.name, attribute.value);
      oldParent = oldNode;
    }
    // 미리보기 칸(#preview-host) 자신과 그 안의 iframe은 그대로 둔다. 같은 부모 아래의 앞뒤 형제만 바꾼다.
    const lastNew = newPath.at(-1),
      lastOld = oldPath.at(-1);
    const before = [],
      after = [];
    for (let n = lastNew.previousSibling; n; n = n.previousSibling) before.unshift(n);
    for (let n = lastNew.nextSibling; n; n = n.nextSibling) after.push(n);
    while (lastOld.previousSibling) lastOld.previousSibling.remove();
    while (lastOld.nextSibling) lastOld.nextSibling.remove();
    for (const n of before) oldParent.insertBefore(n, lastOld);
    for (const n of after) oldParent.appendChild(n);
  }
  async function updatePreview() {
    const host = $("preview-host");
    if (!host) return;
    // 같은 서명으로 이미 그렸거나 그리는 중이면 아무것도 하지 않는다(깜박임·"준비 중" 되돌아감·두 번째 준비 없음).
    const signature = previewSignature();
    if (host.dataset.previewSignature === signature) return;
    host.dataset.previewSignature = signature;
    const token = (state.previewToken = (state.previewToken || 0) + 1);
    const progress = document.createElement("div");
    progress.className = "preview-progress";
    progress.textContent = "문제지를 준비하고 있습니다.";
    // 다시 그리는 동안 칸 높이를 지켜 화면이 위아래로 튀지 않게 한다(그리기가 끝나거나 실패하면 푼다).
    if (host.offsetHeight) host.style.minHeight = host.offsetHeight + "px";
    host.setAttribute("aria-busy", "true");
    host.replaceChildren(progress);
    try {
      const papers = await prepare();
      if (host !== $("preview-host") || token !== state.previewToken) return;
      state.previewIndex = Math.min(state.previewIndex, papers.length - 1);
      host.dataset.previewSignature = previewSignature();
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
          if (token === state.previewToken) {
            host.setAttribute("aria-busy", "false");
            host.style.minHeight = "";
          }
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
            status(error.message, true, error);
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
        host.style.minHeight = "";
        // 그리지 못한 서명은 남기지 않는다: 다음 다시 그리기가 새로 시도한다.
        delete host.dataset.previewSignature;
        host.textContent = teacherErrorMessage(e);
        status(e.message, true, e);
      }
    }
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
  Object.assign(WS.api, {
    buildOriginalSourceOutput,
    originalOutputUrl,
    updateOriginalPreview,
    originalPrint,
    openFinderOutput,
    renderOutputSettings,
    renderPaper,
    renderMobileActions,
    outputUrl,
    updatePreview,
    previewSignature,
    setContentKeepingPreview,
    finalGate,
    print,
    printOnce,
    download,
  });
})();
