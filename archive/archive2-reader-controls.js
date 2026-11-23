/* Minimal standalone reading controls. Rendering and print actions stay in the existing engines. */
(function (root) {
  "use strict";

  const modes = [
    ["exam", "시험"],
    ["sol", "해설"],
    ["ans", "정답"],
  ];
  const text = (value) => String(value ?? "");

  function envelope() {
    return root.AppState?.outputEnvelope || root.__AP_OUTPUT_ENVELOPE__ || null;
  }

  function selectedMode() {
    const params = new URLSearchParams(location.search);
    if (params.get("qr") === "1") return "sol";
    const requested = params.get("mode");
    if (modes.some(([value]) => value === requested)) return requested;
    return modes.some(([value]) => value === root.AppState?.mode) ? root.AppState.mode : "exam";
  }

  function fallbackUrl() {
    const output = envelope();
    const params = new URLSearchParams(location.search);
    if (params.get("studentReview") === "1") {
      const returnTarget = params.get("studentReturnTo");
      if (returnTarget) {
        try {
          const target = new URL(returnTarget, location.href);
          const portalPath = new URL("../apmath/student/", location.href).pathname;
          if (target.origin === location.origin && [portalPath, portalPath + "index.html"].includes(target.pathname))
            return target.href;
        } catch {}
      }
      const portal = new URL("../apmath/student/index.html?omr=1", location.href);
      return portal.href;
    }
    if (output?.assignmentId)
      return `workspace.html?view=recent&assignment_id=${encodeURIComponent(output.assignmentId)}`;
    if (output?.paperId)
      return `workspace.html?view=saved&paper_id=${encodeURIComponent(output.paperId)}`;
    if (output?.sourceKind === "unit-past") {
      const grade = text(output.meta?.grade);
      const match = grade.match(/^(중|고)([123])$/);
      const unit = text(output.meta?.unitKey);
      if (match && unit)
        return `unit-past-exams.html?ready=1&grade=${match[1] === "고" ? "h" : "m"}${match[2]}&unit=${encodeURIComponent(unit)}`;
      return "unit-past-exams.html?ready=1";
    }
    const file = new URLSearchParams(location.search).get("data") || output?.meta?.sourceArchiveFile;
    return file
      ? `workspace.html?view=find&file=${encodeURIComponent(file)}`
      : "workspace.html?view=find";
  }

  function returnToSource() {
    if (new URLSearchParams(location.search).get("studentReview") === "1") {
      location.href = fallbackUrl();
      return;
    }
    if (root.opener && root.opener !== root && !root.opener.closed) {
      try { root.opener.focus(); } catch {}
      root.close();
      if (root.closed) return;
    }
    if (history.length > 1) {
      history.back();
      return;
    }
    location.href = fallbackUrl();
  }

  function printCurrentMode() {
    setMenu(false);
    if (typeof root.safePrint === "function") return root.safePrint("vector");
    const button = document.getElementById("btn-print");
    if (button) return button.click();
    root.alert?.("이 화면에서 인쇄를 시작할 수 없습니다.");
  }

  function openCurrentOutput() {
    setMenu(false);
    const popup = root.open(location.href, "_blank");
    if (!popup) root.alert?.("새 창을 허용한 뒤 다시 열어 주세요.");
  }

  // 쪽당 문항 수(2·4)는 원본 기출을 연 engine.html에서만 나온다. 보이는 조건(qppSwitchEligible)과 바꾸는 동작(chooseArchiveQpp)은
  // engine.html 것을 그대로 쓰므로, 그 함수가 없는 화면(mixed_engine 등)에서는 항목이 나타나지 않는다. 해설·정답 탭에서도 쪽당 값은 쓰이지 않아 숨긴다.
  function qppItemsAvailable() {
    if (typeof root.qppSwitchEligible !== "function" || typeof root.chooseArchiveQpp !== "function") return false;
    try {
      if (!root.qppSwitchEligible()) return false;
    } catch { return false; }
    const select = document.getElementById("archive2-reader-mode");
    return (select ? select.value : selectedMode()) === "exam";
  }

  function syncQpp() {
    const group = document.getElementById("archive2-reader-qpp");
    if (!group) return;
    group.hidden = !qppItemsAvailable();
    // AppState는 engine.html의 const라 window 속성이 아니다. 이름으로 직접 읽는다.
    const current = Number(typeof AppState !== "undefined" ? AppState.qpp : root.AppState?.qpp);
    for (const item of group.querySelectorAll("[data-qpp]")) {
      const on = Number(item.dataset.qpp) === current;
      item.setAttribute("aria-checked", String(on));
      item.classList.toggle("is-active", on);
    }
  }

  async function chooseQpp(value) {
    setMenu(false);
    if (!qppItemsAvailable()) return;
    try { await root.chooseArchiveQpp(Number(value)); } finally { syncQpp(); }
  }

  function setMenu(open) {
    const button = document.getElementById("archive2-reader-more");
    const menu = document.getElementById("archive2-reader-menu");
    if (!button || !menu) return;
    if (open) syncQpp();
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
  }

  function syncMode(mode = selectedMode()) {
    const select = document.getElementById("archive2-reader-mode");
    if (select && modes.some(([value]) => value === mode)) select.value = mode;
  }

  function setReady(ready, mode) {
    const controls = document.getElementById("archive2-reader-controls");
    if (!controls) return;
    controls.dataset.ready = String(Boolean(ready));
    const select = document.getElementById("archive2-reader-mode");
    if (select) {
      select.disabled = !ready || new URLSearchParams(location.search).get("qr") === "1";
      if (mode) syncMode(mode);
    }
    const printButton = document.getElementById("archive2-reader-print");
    if (printButton) printButton.disabled = !ready;
    const newWindowButton = document.getElementById("archive2-reader-open");
    if (newWindowButton) newWindowButton.disabled = !ready;
  }

  let modeChangeGeneration = 0;
  async function changeMode(mode) {
    const generation = ++modeChangeGeneration;
    const select = document.getElementById("archive2-reader-mode");
    const requested = modes.some(([value]) => value === mode) ? mode : "exam";
    if (select) select.disabled = true;
    try {
      if (typeof root.switchMode !== "function") throw new Error("출력 종류를 바꿀 수 없습니다.");
      const outcome = await root.switchMode(requested);
      if (generation !== modeChangeGeneration) return { ok: false, code: "DISCARDED_STALE" };
      if (outcome?.ok === false) {
        if (outcome.code === "DISCARDED_STALE") return outcome;
        const error = new Error("출력 종류를 바꾸지 못했습니다.");
        error.code = outcome.code;
        throw error;
      }
      syncMode(requested);
      return outcome || { ok: true, mode: requested };
    } catch (error) {
      if (generation !== modeChangeGeneration) return { ok: false, code: "DISCARDED_STALE" };
      syncMode(selectedMode());
      const outcome = { ok: false, code: error?.code || error?.message || "MODE_CHANGE_FAILED" };
      if (outcome.code !== "DISCARDED_STALE") {
        if (root.APArchiveRenderFeedback?.track) {
          root.APArchiveRenderFeedback.track(Promise.resolve(outcome), {
            mode: requested,
            questionCount: envelope()?.questionCount,
            // A committed mode can still fail PDF readiness. Re-enter initialization
            // because the public mode switch returns early for the active mode.
            retry: () => selectedMode() === requested ? root.location.reload() : changeMode(requested),
          });
        } else root.alert?.("출력 종류를 바꾸지 못했습니다. 다시 시도해 주세요.");
      }
      return outcome;
    } finally {
      if (generation === modeChangeGeneration) {
        const controls = document.getElementById("archive2-reader-controls");
        setReady(controls?.dataset.ready === "true", selectedMode());
      }
    }
  }

  function init() {
    const params = new URLSearchParams(location.search);
    if (root.parent !== root || params.get("preview") === "1") return;
    const toolbar = document.getElementById("mode-ctrl");
    if (!toolbar || document.getElementById("archive2-reader-controls")) return;
    document.documentElement.classList.add("archive2-mobile-reader-enabled");
    const controls = document.createElement("div");
    controls.id = "archive2-reader-controls";
    controls.className = "archive2-mobile-reader-controls";
    controls.innerHTML = `
      <button id="archive2-reader-back" class="archive2-reader-back" type="button" aria-label="돌아가기">
        <span aria-hidden="true">‹</span><span>돌아가기</span>
      </button>
      <label class="archive2-reader-mode-label">
        <span class="sr-only">출력 종류</span>
        <select id="archive2-reader-mode" class="archive2-reader-mode" aria-label="출력 종류">
          ${modes.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
        </select>
      </label>
      <button id="archive2-reader-more" class="archive2-reader-more" type="button"
        aria-label="더보기" aria-haspopup="menu" aria-expanded="false" aria-controls="archive2-reader-menu">⋯</button>
      <div id="archive2-reader-menu" class="archive2-reader-menu" role="menu" aria-label="출력 도구" hidden>
        <button id="archive2-reader-print" type="button" role="menuitem">인쇄 / PDF 저장</button>
        <button id="archive2-reader-open" type="button" role="menuitem">새 창 열기</button>
        <div id="archive2-reader-qpp" class="archive2-reader-qpp" role="group" aria-label="쪽당 문항 수" hidden>
          <button type="button" role="menuitemradio" aria-checked="false" data-qpp="2">쪽당 2문항</button>
          <button type="button" role="menuitemradio" aria-checked="false" data-qpp="4">쪽당 4문항</button>
        </div>
        <button id="archive2-reader-derive" type="button" role="menuitem" hidden>이 시험지로 다시 만들기</button>
      </div>`;
    toolbar.appendChild(controls);
    controls.querySelector("#archive2-reader-back").addEventListener("click", returnToSource);
    controls.querySelector("#archive2-reader-mode").addEventListener("change", (event) => changeMode(event.currentTarget.value));
    controls.querySelector("#archive2-reader-more").addEventListener("click", (event) => {
      event.stopPropagation();
      setMenu(document.getElementById("archive2-reader-menu").hidden);
    });
    controls.querySelector("#archive2-reader-print").addEventListener("click", printCurrentMode);
    controls.querySelector("#archive2-reader-open").addEventListener("click", openCurrentOutput);
    controls.querySelector("#archive2-reader-qpp").addEventListener("click", (event) => {
      const item = event.target.closest?.("[data-qpp]");
      if (item) chooseQpp(item.dataset.qpp);
    });
    // The output window of the teacher workspace (archive2-derive-entry.js is loaded there) offers a re-make of the paper.
    const deriveItem = controls.querySelector("#archive2-reader-derive");
    if (root.Archive2DeriveEntry?.available?.()) {
      deriveItem.hidden = false;
      deriveItem.addEventListener("click", () => { setMenu(false); root.Archive2DeriveEntry.start(); });
    }
    document.addEventListener("click", (event) => {
      if (!controls.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
    syncMode();
    setReady(false);
  }

  root.Archive2ReaderControls = { init, setReady, syncMode, syncQpp };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(typeof window !== "undefined" ? window : globalThis);
