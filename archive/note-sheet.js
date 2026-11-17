/* 빈 풀이노트: blank A4 note sheets (no questions). Teacher picks forms and a count per form, previews one page of each,
   and prints. Nothing is read from the question bank and nothing is stored: the page only builds markup.
   The paper markup below is the approved layout; wording, boxes and sizes are not to be changed here.
   Screen: one preview page per selected form. Print: the real count, built into #ns-print (hidden on screen). */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.ArchiveNoteSheet = api;
    if (typeof document === "undefined") return;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => api.init(document));
    else api.init(document);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const MAX_SHEETS = 30;
  const DEFAULT_KEY = "two";

  const WHY = ["개념 모름", "조건 놓침", "계산 실수", "시간 부족"];
  const WHYS = ["개념", "조건", "계산", "시간"];
  const cb = (s) => `<span><i class="cb"></i>${s}</span>`;
  const two = (f) => f() + f();
  const head = (sub) => `<div class="head"><span class="ttl">AP수학학원<span class="sub">${sub}</span></span>
  <span class="fill"><span>날짜<i style="width:22mm"></i></span><span>단원<i style="width:36mm"></i></span><span>이름<i style="width:24mm"></i></span></span></div>`;
  const ref = () => `<div class="ref"><span>교재<i style="width:30mm"></i></span><span>쪽<i style="width:11mm"></i></span><span>번호<i style="width:11mm"></i></span></div>`;
  const mark = `<span class="mark"><span>○</span><span>△</span><span>✕</span></span>`;
  const retry = (h) => `<div class="retry"${h ? ` style="height:${h}mm"` : ""}><div class="rl"><strong>다시 풀기</strong>${WHY.map(cb).join("")}</div><div class="dots"></div></div>`;

  const tall = () => `<div class="grid tall">
  ${two(ref)}
  ${two(() => `<div class="box thin"><div class="lab">① 구하는 것 · 조건</div></div>`)}
  ${two(() => `<div class="box thin"><div class="lab">② 쓸 개념 <em>정의·공식을 문장으로</em></div></div>`)}
  ${two(() => `<div class="box workwrap"><div class="work dots"><div><div class="lab">③ 풀이 <em>한 줄에 식 하나</em></div></div><div><div class="lab">근거</div></div></div>
    <div class="selfchk"><strong>점검</strong>${cb("식마다 근거")}${cb("조건 확인")}${cb("답을 문장으로")}</div></div>`)}
  ${two(() => `<div class="box ans"><div class="lab">④ 답</div>${mark}</div>`)}
  ${two(() => retry())}
</div>`;

  const quad = () => `<div class="grid quad">
  ${two(ref)}
  ${two(() => `<div class="two"><div class="box thin"><div class="lab">① 조건</div></div><div class="box thin"><div class="lab">② 쓸 개념</div></div></div>`)}
  ${two(() => `<div class="box work dots"><div><div class="lab">③ 풀이</div></div><div><div class="lab">근거</div></div></div>`)}
  ${two(() => `<div class="endrow"><span><strong>④ 답</strong> <i class="u" style="width:18mm"></i></span><span class="why"><strong>틀린 이유</strong>${WHYS.map(cb).join("")}</span></div>`)}
</div>`;

  const DESC = [
    ["조건 찾기", "주어진 것과 구하는 것을 쓴다.", 0.8],
    ["식 세우기", "조건을 식으로 옮기고, 쓰는 개념이나 근거를 쓴다.", 1],
    ["계산", "한 줄에 식 하나씩 쓴다.", 1.5],
    ["답 쓰기", "\"따라서\"로 시작해 단위와 함께 문장으로 쓴다.", 0.6],
  ];
  const desc = () => `<div class="grid desc">
  ${two(ref)}
  ${two(() => `<div class="steps">${DESC.map((s, i) => `<div class="st" style="--f:${s[2]}"><div class="sh">${i + 1} ${s[0]}</div><div class="hint">${s[1]}</div><div class="dots"></div></div>`).join("")}</div>`)}
  ${two(() => `<div class="box ans"><div class="lab">점수 <i class="u" style="width:10mm"></i> / <i class="u" style="width:8mm"></i>점</div>${mark}</div>`)}
  ${two(() => retry(30))}
</div>`;

  const back = () => `<div class="grid back">${two(() => `<div class="retry"><div class="rl"><strong>다시 풀기 &nbsp; 교재<i class="u" style="width:22mm"></i> 쪽<i class="u" style="width:9mm"></i> 번호<i class="u" style="width:9mm"></i></strong>${WHY.map(cb).join("")}</div><div class="dots"></div></div>`)}</div>`;

  const page = (id, sub, inner, foot) => `<section class="ns-page" data-p="${id}">${head(sub)}${inner}<div class="foot"><span>${foot}</span><span></span></div></section>`;

  // Menu order is also the print order.
  const KINDS = [
    { key: "two", name: "풀이노트 2문항", note: "한 쪽에 2문제. 풀이 칸이 넓은 양식", markup: () => page("two", "풀이노트", tall(), "풀이노트 · 2문항") },
    { key: "four", name: "풀이노트 4문항", note: "한 쪽에 4문제. 문제마다 칸이 작은 양식", markup: () => page("four", "풀이노트", quad() + '<div class="hr"></div>' + quad(), "풀이노트 · 4문항") },
    { key: "desc", name: "서술형 풀이노트 2문항", note: "조건 찾기 · 식 세우기 · 계산 · 답 쓰기 단계로 나뉜 양식", markup: () => page("desc", "서술형 풀이노트", desc(), "서술형 풀이노트 · 2문항") },
    { key: "back", name: "다시 풀기 4문항", note: "틀린 문제를 다시 풀 칸만 있는 양식", markup: () => page("back", "풀이노트", back() + '<div class="hr"></div>' + back(), "다시 풀기 · 4문항") },
  ];
  const byKey = (key) => KINDS.find((kind) => kind.key === key);

  function clampSheets(value) {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(MAX_SHEETS, n));
  }

  // state: { two: { on, n }, ... }
  function defaultState() {
    const state = {};
    KINDS.forEach((kind) => { state[kind.key] = { on: kind.key === DEFAULT_KEY, n: 1 }; });
    return state;
  }
  const selectedKinds = (state) => KINDS.filter((kind) => state[kind.key]?.on);
  const totalSheets = (state) => selectedKinds(state).reduce((sum, kind) => sum + clampSheets(state[kind.key].n), 0);

  // One page per selected form (screen preview).
  function previewMarkup(state) {
    return selectedKinds(state).map((kind) => {
      const n = clampSheets(state[kind.key].n);
      return `<figure class="ns-thumb-card" data-kind="${kind.key}">
        <div class="ns-thumb" data-thumb>${kind.markup()}</div>
        <figcaption><strong>${kind.name}</strong><span>${n}장</span></figcaption>
      </figure>`;
    }).join("");
  }

  // The real sheets in print order: each selected form repeated its own count.
  function printMarkup(state) {
    return selectedKinds(state).map((kind) => kind.markup().repeat(clampSheets(state[kind.key].n))).join("");
  }

  function init(doc) {
    const state = defaultState();
    const preview = doc.getElementById("ns-preview");
    const printHost = doc.getElementById("ns-print");
    const printButton = doc.getElementById("ns-print-button");
    const summary = doc.getElementById("ns-summary");
    if (!preview || !printHost || !printButton) return;
    let printDirty = true;
    let printTimer = 0;
    let resizeObserver = null;

    const row = (key) => doc.querySelector(`[data-kind-row="${key}"]`);

    function fitThumbs() {
      doc.querySelectorAll("[data-thumb]").forEach((thumb) => {
        const paper = thumb.firstElementChild;
        if (!paper || !thumb.clientWidth) return;
        thumb.style.setProperty("--ns-scale", String(thumb.clientWidth / paper.offsetWidth));
      });
    }

    function syncPrint() {
      window.clearTimeout(printTimer);
      printTimer = 0;
      if (!printDirty) return;
      printHost.innerHTML = printMarkup(state);
      printDirty = false;
    }

    function update(options = {}) {
      KINDS.forEach((kind) => {
        const el = row(kind.key);
        if (!el) return;
        const cell = state[kind.key];
        el.classList.toggle("is-on", cell.on);
        const check = el.querySelector("input[type=checkbox]");
        if (check) check.checked = cell.on;
        el.querySelectorAll("[data-count] input, [data-count] button").forEach((control) => { control.disabled = !cell.on; });
        const input = el.querySelector("[data-count] input");
        // Typing keeps its own text (keepInputs / focused field); a -/+ press passes force because focus may stay in the field (iOS Safari).
        if (input && !options.keepInputs && (options.force || doc.activeElement !== input)) input.value = String(cell.n);
      });
      const kinds = selectedKinds(state);
      const total = totalSheets(state);
      summary.textContent = kinds.length
        ? `양식 ${kinds.length}가지 · 모두 ${total}장`
        : "양식을 하나 이상 골라 주세요.";
      printButton.disabled = !kinds.length;
      preview.innerHTML = previewMarkup(state);
      preview.hidden = !kinds.length;
      fitThumbs();
      if (resizeObserver) {
        resizeObserver.disconnect();
        preview.querySelectorAll("[data-thumb]").forEach((thumb) => resizeObserver.observe(thumb));
      }
      // The print copy is built a moment after the last change (typing a number must not rebuild every key).
      printDirty = true;
      window.clearTimeout(printTimer);
      printTimer = window.setTimeout(syncPrint, 250);
    }

    doc.addEventListener("change", (event) => {
      const target = event.target;
      const holder = target.closest?.("[data-kind-row]");
      if (!holder) return;
      const cell = state[holder.dataset.kindRow];
      if (!cell) return;
      if (target.matches("input[type=checkbox]")) cell.on = target.checked;
      else if (target.matches("[data-count] input")) { cell.n = clampSheets(target.value); target.value = String(cell.n); }
      update();
    });
    doc.addEventListener("input", (event) => {
      const target = event.target;
      if (!target.matches?.("[data-count] input")) return;
      const holder = target.closest("[data-kind-row]");
      const cell = state[holder?.dataset.kindRow];
      const text = String(target.value).trim();
      // Only a complete 1..30 number redraws; half-typed text waits for "change".
      if (!cell || !/^\d{1,2}$/.test(text) || Number(text) < 1 || Number(text) > MAX_SHEETS) return;
      cell.n = Number(text);
      update({ keepInputs: true });
    });
    doc.addEventListener("click", (event) => {
      const step = event.target.closest?.("[data-step]");
      if (step) {
        const holder = step.closest("[data-kind-row]");
        const cell = state[holder?.dataset.kindRow];
        if (!cell || !cell.on) return;
        cell.n = clampSheets(cell.n + Number(step.dataset.step));
        update({ force: true });
        return;
      }
      if (event.target.closest?.("#ns-print-button")) {
        if (printButton.disabled) return;
        syncPrint();
        window.print();
      }
    });
    window.addEventListener("beforeprint", () => { printDirty = true; syncPrint(); });
    if (typeof ResizeObserver === "function") resizeObserver = new ResizeObserver(fitThumbs);
    window.addEventListener("resize", fitThumbs);
    if (doc.fonts?.ready) doc.fonts.ready.then(fitThumbs).catch(() => {});

    update();
    syncPrint();
  }

  return { KINDS, MAX_SHEETS, clampSheets, defaultState, selectedKinds, totalSheets, previewMarkup, printMarkup, init };
});
