/* 빠른 평가의 "준비된 평가지" 구역 (2026-11-19).
   시험지 보관함(assessment/assessment-mvp.html)에 있던 완성된 평가팩(중간·기말·모의고사)을 빠른 평가 화면 안에서
   쓴다. 단원평가 팩은 즉석 조립(소단원·중단원 평가)과 겹치고 진단평가는 즉석 조립 상품으로 만들어져서 이 구역에 넣지 않는다(자료 파일에는 그대로 있고 옛 보관함 화면이 연다). 즉석 조립(5분·소단원·중단원·종합 평가)과 같은 화면에서 "준비된 문항으로 평가 한 장을 뽑아 출제"하는 일을 한다.
   - 구역은 닫힌 채로 시작한다. 열 때만 공용 코드(assessment/assessment-pack-core.js)와 팩 자료 파일 2개(합쳐 3.5MB)를 받는다.
     빠른 평가의 첫 화면은 이 파일(작은 표시·로드 담당)만 더 받는다.
   - 시험지 확인·정답·해설은 보관함과 같은 mixed_engine 출력(같은 키, 같은 packId 대체), 출제는 보관함과 같은 출제 패널 경로다
     (같은 MIXED 키 assessment_<팩>_<해시>, pack_id·pack_hash). 그 로직은 공용 코드 하나를 두 화면이 같이 쓴다.
   - 분석표는 보관함과 같은 주소(assessment/assessment-analysis.html?packId=)로 연결만 한다.
   작업공간(archive2-workspace*.js)의 상태에 값을 더하지 않는다: 이 구역의 상태는 이 파일 안에만 있고, 작업공간이 화면을 다시 그릴 때마다
   markup()으로 같은 모습을 다시 낸다. 눌림은 문서 단위 위임으로 이 구역 안(#quick-packs [data-qp])만 처리한다. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2QuickPacks = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const CORE_SRC = "assessment/assessment-pack-core.js?v=20261119-pack-core-1";
  const PACK_SOURCES = [
    { src: "assessment/assessment-packs-1sem.generated.js", required: true },
    { src: "assessment/assessment-packs-2sem-final-mock.generated.js", required: false },
  ];
  const ANALYSIS_PATH = "assessment/assessment-analysis.html";
  // 탭 이름(자료의 category 이름 → 화면 이름). 모의고사 category 이름은 공용 코드가 가진다.
  const BASE_TABS = [["중간·기말평가", "중간·기말"]];
  const GRADE_COLORED = new Set(["중1", "중2", "중3", "고1", "고2", "고3"]);

  const state = { open: false, status: "idle", category: "중간·기말평가", grade: "", query: "", packs: [], data: null, note: "" };
  let core = null;
  let loading = null;
  let bound = false;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const doc = () => root.document;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = doc().createElement("script");
      script.src = new URL(src, doc().baseURI).href;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); reject(new Error("script load failed: " + src)); };
      doc().head.appendChild(script);
    });
  }
  // 공용 코드와 팩 자료를 이 구역을 열 때 처음 한 번만 받는다. 실패하면 다시 시도할 수 있다(상태를 error로 둔다).
  function ensureLoaded() {
    if (state.status === "ready") return Promise.resolve();
    if (loading) return loading;
    state.status = "loading";
    loading = (async () => {
      try {
        if (!root.AssessmentPackCore) await loadScript(CORE_SRC);
        await Promise.all(PACK_SOURCES.map((source) => loadScript(source.src).catch((error) => { if (source.required) throw error; })));
        const Core = root.AssessmentPackCore;
        state.data = Core.mergeData(root.APMATH_ASSESSMENT_PACKS_1SEM, root.APMATH_ASSESSMENT_PACKS_MOCK_2SEM_FINAL);
        state.packs = shownPacks(state.data.packs);
        if (!state.packs.length) throw new Error("no packs");
        core = Core.create({
          window: root,
          engineUrl: () => new URL("mixed_engine.html", doc().baseURI),
          getPacks: () => state.packs,
          // 작업공간의 출제 요청 함수(로그인 확인·서버 주소·시간 제한이 다른 출제 화면과 같다).
          request: (route, opt) => root.Archive2Workspace.api.assignRequest(route, opt),
        });
        core.bindPanelEvents();
        const tabs = tabList();
        if (!tabs.some((tab) => tab.key === state.category)) state.category = tabs[0] ? tabs[0].key : "";
        state.status = "ready";
      } catch (error) {
        console.error(error);
        state.status = "error";
      } finally {
        loading = null;
        refresh();
      }
    })();
    return loading;
  }

  // 탭이 있는 종류만 쓴다(단원평가·진단평가 팩은 이 구역에 넣지 않는다). 팩 수·문항 구성은 자료에서 읽고 고정하지 않는다.
  function shownPacks(packs) {
    const shown = new Set([...BASE_TABS.map(([key]) => key), root.AssessmentPackCore.MOCK_CATEGORY]);
    return (packs || []).filter((pack) => shown.has(pack.category));
  }

  function tabList() {
    const Core = root.AssessmentPackCore;
    const present = new Set((state.packs || []).map((pack) => pack.category));
    const tabs = BASE_TABS.map(([key, label]) => ({ key, label }));
    if (Core) tabs.push({ key: Core.MOCK_CATEGORY, label: "모의고사" });
    return tabs.filter((tab) => present.has(tab.key));
  }

  function visiblePacks() {
    return root.AssessmentPackCore.filterPacks(state.packs, { category: state.category, grade: state.grade, query: state.query });
  }

  function difficultyChips(mix) {
    if (!mix || typeof mix !== "object") return "";
    return ["하", "중", "상"].filter((key) => mix[key] != null)
      .map((key) => `<span class="qk-pack-dx is-${key === "하" ? "low" : key === "중" ? "mid" : "high"}">${esc(key)}${esc(String(mix[key]))}</span>`).join("");
  }

  function cardMarkup(pack) {
    const Core = root.AssessmentPackCore;
    const id = esc(pack.id);
    const scope = Core.plainScopeText(pack.scopeLabel || pack.unitLabel) || "범위 확인 필요";
    const grade = pack.grade ? `<span class="qk-pack-badge is-grade"${GRADE_COLORED.has(pack.grade) ? ` data-grade="${esc(pack.grade)}"` : ""}>${esc(pack.grade)}</span>` : "";
    const course = pack.courseLabel ? `<span class="qk-pack-badge">${esc(pack.courseLabel)}</span>` : "";
    const dx = difficultyChips(pack.difficultyMix);
    const btn = (action, label, extra = "") => `<button type="button" class="qk-pack-btn${extra}" data-qp="${action}" data-pack-id="${id}">${label}</button>`;
    const analysis = pack.category === Core.MOCK_CATEGORY ? ""
      : `<a class="qk-pack-btn" href="${ANALYSIS_PATH}?packId=${encodeURIComponent(pack.id)}">분석표</a>`;
    return `<article class="qk-pack" data-pack-id="${id}">
      <div class="qk-pack-meta">${grade}<span class="qk-pack-badge">${esc(pack.questionCount || (pack.questions || []).length || 0)}문항</span>${course}</div>
      <h3 class="qk-pack-title">${esc(pack.title)}</h3>
      <p class="muted qk-pack-scope">${esc(scope)}</p>
      ${dx ? `<div class="qk-pack-mix">${dx}</div>` : ""}
      <p class="muted qk-pack-skill">유형: ${esc(Core.countText(pack.skillMix))}</p>
      <div class="qk-pack-actions">${btn("preview", "시험지 확인")}${btn("assign", "출제", " is-primary")}${btn("ans", "정답")}${btn("sol", "해설")}${analysis}</div>
    </article>`;
  }

  function listMarkup() {
    const list = visiblePacks();
    const summary = `<p class="muted qk-packs-count" role="status">${list.length}개</p>`;
    if (!list.length) return `${summary}<div class="callout qk-packs-empty">조건에 맞는 평가지가 없습니다.</div>`;
    return `${summary}<div class="qk-pack-grid">${list.map(cardMarkup).join("")}</div>`;
  }

  function bodyMarkup() {
    if (!state.open) return "";
    if (state.status === "loading" || state.status === "idle") return '<p class="muted qk-packs-state" role="status">평가지 목록을 불러오는 중입니다…</p>';
    if (state.status === "error") {
      return '<div class="callout qk-packs-state"><p role="alert">평가지 목록을 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.</p><button type="button" class="qk-pack-btn" data-qp="retry">다시 시도</button></div>';
    }
    const tabs = tabList();
    const grades = [...new Set(state.packs.map((pack) => pack.grade).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
    const tabMarkup = `<div class="qk-seg qk-packs-tabs" role="group" aria-label="평가지 종류">${tabs.map((tab) =>
      `<button type="button" class="qk-seg-btn" data-qp="tab" data-category="${esc(tab.key)}" aria-pressed="${tab.key === state.category}">${esc(tab.label)}</button>`).join("")}</div>`;
    const filter = `<div class="qk-packs-filter">
      <label class="qk-packs-field"><span class="qk-packs-label">검색</span><input type="search" id="quick-packs-query" data-qp="query" value="${esc(state.query)}" placeholder="평가명, 학년, 단원, 범위 검색" autocomplete="off"></label>
      <label class="qk-packs-field"><span class="qk-packs-label">학년</span><select data-qp="grade" id="quick-packs-grade"><option value="">전체 학년</option>${grades.map((grade) =>
        `<option value="${esc(grade)}"${grade === state.grade ? " selected" : ""}>${esc(grade)}</option>`).join("")}</select></label>
    </div>`;
    const note = state.note ? `<p class="callout qk-packs-note" role="status">${esc(state.note)}</p>` : "";
    return `${tabMarkup}${filter}${note}<div data-qp-list>${listMarkup()}</div>`;
  }

  // 작업공간이 빠른 평가 화면을 그릴 때 끼워 넣는 구역. 닫힌 상태는 제목과 열기 단추뿐이다.
  function markup() {
    const open = state.open;
    return `<section class="qk-packs" id="quick-packs" aria-labelledby="quick-packs-title">
      <div class="qk-packs-head"><div><h2 class="qk-h" id="quick-packs-title">준비된 평가지</h2>
        <p class="muted">미리 만들어 둔 완성 평가(중간·기말·모의고사)를 확인하고 바로 출제합니다.</p></div>
        <button type="button" class="qk-packs-toggle" data-qp="toggle" aria-expanded="${open}" aria-controls="quick-packs-body">${open ? "접기" : "열기"}</button></div>
      <div id="quick-packs-body" class="qk-packs-body"${open ? "" : " hidden"}>${bodyMarkup()}</div></section>`;
  }

  function refresh() {
    const section = doc() && doc().getElementById("quick-packs");
    if (!section) return;
    const focusId = doc().activeElement && doc().activeElement.id;
    const wrap = doc().createElement("div");
    wrap.innerHTML = markup();
    section.replaceWith(wrap.firstElementChild);
    if (focusId) doc().getElementById(focusId)?.focus?.({ preventScroll: true });
  }
  function refreshList() {
    const list = doc().querySelector("#quick-packs [data-qp-list]");
    if (list) list.innerHTML = listMarkup();
  }

  function packOf(id) { return (state.packs || []).find((pack) => pack.id === id); }

  function act(el) {
    const action = el.dataset.qp;
    if (action === "toggle") {
      state.open = !state.open;
      if (state.open && state.status !== "ready") { refresh(); ensureLoaded(); return; }
      refresh();
      return;
    }
    if (action === "retry") { state.status = "idle"; ensureLoaded(); refresh(); return; }
    if (action === "tab") { state.category = el.dataset.category || state.category; refresh(); return; }
    const pack = packOf(el.dataset.packId);
    if (!pack || !core) return;
    state.note = "";
    if (action === "preview") core.openEngine(pack, "exam", 4, { preview: true }).catch((error) => console.error(error));
    else if (action === "ans") core.openEngine(pack, "ans", 2).catch((error) => console.error(error));
    else if (action === "sol") core.openEngine(pack, "sol", 2).catch((error) => console.error(error));
    else if (action === "assign") {
      if (core.assignPanelAvailable()) core.openAssignPanel(pack, el);
      else { state.note = "이 화면에서는 출제 패널을 쓸 수 없습니다(주소의 assign=legacy). 시험지 보관함에서 출제해 주세요."; refresh(); }
    }
  }

  function bind() {
    if (bound || !doc()) return;
    bound = true;
    doc().addEventListener("click", (event) => {
      const el = event.target && event.target.closest ? event.target.closest("#quick-packs [data-qp]") : null;
      if (!el || el.tagName === "INPUT" || el.tagName === "SELECT") return;
      act(el);
    });
    doc().addEventListener("input", (event) => {
      const el = event.target;
      if (!el || !el.matches || !el.matches("#quick-packs [data-qp='query']")) return;
      state.query = el.value;
      refreshList(); // 입력 칸은 다시 그리지 않는다(글자 입력과 커서가 끊기지 않게).
    });
    doc().addEventListener("change", (event) => {
      const el = event.target;
      if (!el || !el.matches || !el.matches("#quick-packs [data-qp='grade']")) return;
      state.grade = el.value;
      refreshList();
    });
  }
  if (doc()) {
    if (doc().readyState === "loading") doc().addEventListener("DOMContentLoaded", bind);
    else bind();
  }

  return { markup, state, shownPacks, ensureLoaded, refresh, cardMarkup, listMarkup, bodyMarkup, tabList, bind, _setCore: (value) => { core = value; } };
});
