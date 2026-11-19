(function () {
  "use strict";

  // 진단평가 결과표 화면. 입력: 주소의 `uids`(진단평가 시험지의 문항 UID, 쉼표로 구분, 순서 = 문항 번호)와
  // 선생님이 누르는 문항별 O/X. 계산은 DiagnosticReportData, 문구·그림은 DiagnosticReportView가 맡고
  // 이 파일은 읽어 오기·입력 칸·그리기·쪽 맞춤·인쇄만 한다.
  //
  // 저장하지 않는다: 학생 이름·O/X는 서버·localStorage·sessionStorage·URL·document.title 어디에도 남기지 않는다.
  // 새로고침하면 사라지는 것이 맞다. 문항 UID는 시험지 식별값이며 학생 정보가 아니다.
  const $ = (id) => document.getElementById(id);
  const Data = window.DiagnosticReportData;
  const View = window.DiagnosticReportView;
  const esc = View.esc;
  const A4_FIT_PX = 1112; // 296mm(약 1118px)에서 여유 6px
  const MAX_UIDS = 100;
  // 결과지 머리에 찍는 학원명. 입력·설정 없이 이 상수 한 곳에서만 정한다(2026-11-20 사용자 확정).
  const ORG_NAME = "AP 수학학원";

  const state = { questions: [], responses: Object.create(null), labelOf: null, labelNote: "", grade: "", unitCount: 0, report: null };

  function setState(text, error) {
    const el = $("state");
    el.hidden = !text;
    el.textContent = text || "";
    el.classList.toggle("err", Boolean(error));
  }

  function parseUids() {
    const raw = new URLSearchParams(location.search).get("uids") || "";
    const uids = raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    return uids;
  }

  const levelLabel = (d) => (d == null ? "단계 없음" : d >= 4 ? "4~5단계" : `${d}단계`);

  async function fetchJson(rel) {
    const response = await fetch(new URL(rel, document.baseURI), { cache: "no-cache" });
    if (!response.ok) throw new Error(`fetch ${response.status} ${rel}`);
    return response.json();
  }
  async function loadLabelOf() {
    try {
      const [taxonomy, concepts, conditions, extensions] = await Promise.all([
        fetchJson("data/meta-foundation/compiled/taxonomy_registry.json"),
        fetchJson("data/meta-foundation/compiled/concept_registry.json"),
        fetchJson("data/meta-foundation/compiled/condition_registry.json"),
        fetchJson("data/archive2-extension-keys.json"),
      ]);
      return { labelOf: Data.createLabelOf({ taxonomy, concepts, conditions, extensions }, window.Archive2KeyResolver), note: "" };
    } catch (error) {
      return { labelOf: null, note: "유형 이름을 불러오지 못해 모든 문항을 ‘유형 미분류’로 묶었습니다." };
    }
  }

  async function loadQuestions(uids) {
    if (typeof window.applyArchiveMetaFoundationCatalog !== "function") throw new Error("단원·분류 자료를 불러오지 못했습니다. 새로고침해 다시 시도하세요.");
    const catalog = await window.applyArchiveMetaFoundationCatalog();
    const wanted = new Set(uids);
    const byUid = new Map();
    for (const record of catalog.records) {
      const uid = record.questionUid;
      if (uid && wanted.has(uid) && !byUid.has(uid)) byUid.set(uid, record);
    }
    const missing = uids.filter((uid) => !byUid.has(uid));
    if (missing.length) throw new Error(`문항 ${missing.length}개를 자료에서 찾지 못했습니다. 주소를 확인하세요.`);
    const found = uids.map((uid) => byUid.get(uid));
    const Unified = window.Archive2UnifiedUnits;
    const Core = window.Archive2Core;
    const index = Unified.buildIndex(found, { projectionPolicy: catalog.projectionPolicy });
    const grades = {};
    const questions = uids.map((uid, i) => {
      const record = byUid.get(uid);
      const entry = index.byUid.get(uid) || null;
      if (entry && entry.grade) grades[entry.grade] = (grades[entry.grade] || 0) + 1;
      const facets = Core.metaFacetsOf(record);
      return {
        no: i + 1,
        questionUid: uid,
        unit: entry && !entry.unclassified ? entry.unitLabel : "",
        unitOrder: entry && !entry.unclassified ? entry.unitOrder : 9999,
        difficulty: Number.isInteger(record.difficultyBucket) ? record.difficultyBucket : null,
        problemTypeKey: (facets && facets.pt) || "",
      };
    });
    const grade = Object.entries(grades).sort((a, b) => b[1] - a[1])[0];
    return { questions, grade: grade ? grade[0] : "" };
  }

  // ---- 입력 칸 ----
  function typeNameOf(q) {
    const label = state.labelOf && q.problemTypeKey ? state.labelOf(q.problemTypeKey) : "";
    return label || View.UNCLASSIFIED_TYPE;
  }
  function buildQuestionList() {
    $("qlist").innerHTML = state.questions.map((q) => `<div class="qrow" data-no="${q.no}"><span class="no num">${q.no}</span><div class="info"><b>${esc(q.unit || View.UNCLASSIFIED_UNIT)}</b><span>${levelLabel(q.difficulty)} · ${esc(typeNameOf(q))}</span></div><div class="ox" role="group" aria-label="${q.no}번 정오"><button type="button" class="o" data-no="${q.no}" data-v="O" aria-pressed="false" aria-label="${q.no}번 정답">O</button><button type="button" class="x" data-no="${q.no}" data-v="X" aria-pressed="false" aria-label="${q.no}번 오답">X</button></div></div>`).join("");
  }
  function syncButtons() {
    for (const button of $("qlist").querySelectorAll("button[data-no]")) {
      button.setAttribute("aria-pressed", String(state.responses[button.dataset.no] === button.dataset.v));
    }
  }
  const answeredCount = () => state.questions.filter((q) => state.responses[q.no]).length;

  // ---- 날짜·글 ----
  const todayIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const fmtDate = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? `${m[1]}. ${Number(m[2])}. ${Number(m[3])}.` : "";
  };

  function renderTexts() {
    const name = $("inName").value.trim();
    const grade = $("inGrade").value.trim();
    const date = fmtDate($("inDate").value);
    const testDate = fmtDate($("inTestDate").value);
    const n = state.questions.length;
    $("wName").textContent = name;
    $("wGrade").textContent = grade;
    $("wScope").textContent = `${state.grade ? state.grade + " 수학 " : "수학 "}${state.unitCount}개 단원`;
    $("wTest").textContent = `${testDate ? testDate + " · " : ""}${n}문항`;
    $("title").textContent = state.grade ? `${state.grade} 과정 종합 진단` : "수학 종합 진단";
    $("orgLine").innerHTML = `${esc(ORG_NAME)}<br>${date ? "상담일 " + esc(date) : ""}`;
    $("orgLine2").textContent = [name, state.grade ? `${state.grade} 과정 종합 진단` : "종합 진단"].filter(Boolean).join(" · ");
  }

  // ---- 쪽 맞춤: A4 폭(794px)으로 따로 재서, 한 쪽에 들어가는 가장 여유 있는 단계를 고른다 ----
  function measureHeight(sheet, level) {
    const host = document.createElement("div");
    host.className = "sheetbox";
    host.style.cssText = "position:absolute;left:-10000px;top:0;width:794px;visibility:hidden;pointer-events:none;margin:0";
    const clone = sheet.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("data-fit", String(level));
    clone.style.minHeight = "0";
    host.appendChild(clone);
    document.body.appendChild(host);
    const height = clone.getBoundingClientRect().height;
    host.remove();
    return height;
  }
  function fitSheet(sheet) {
    let chosen = 3;
    let height = 0;
    for (let level = 0; level <= 3; level++) {
      height = measureHeight(sheet, level);
      if (height <= A4_FIT_PX) { chosen = level; break; }
    }
    sheet.setAttribute("data-fit", String(chosen));
    sheet.toggleAttribute("data-overflow", height > A4_FIT_PX);
    return { level: chosen, height, overflow: height > A4_FIT_PX };
  }
  let fitTimer = 0;
  function fitAll() {
    state.fit = [fitSheet($("sheet1")), fitSheet($("sheet2"))];
    const over = state.fit.some((f) => f.overflow);
    $("printBtn").disabled = !state.report;
    if (over) setState("내용이 많아 한 쪽에 다 담지 못했습니다. 인쇄 전에 확인하세요.", true);
    else if (state.report) setState("");
    return state.fit;
  }
  function refitSoon() {
    if (!state.report) return;
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitAll, 120);
  }

  // ---- 그리기 ----
  function recompute() {
    const total = state.questions.length;
    const done = answeredCount();
    $("progress").innerHTML = `입력 <b>${done}</b> / ${total}`;
    $("clearBtn").disabled = done === 0;
    syncButtons();
    if (done < total) {
      state.report = null;
      $("sheets").hidden = true;
      $("printBtn").disabled = true;
      setState(`문항별 O/X를 모두 입력하면 결과표가 나타납니다. (${done} / ${total})`);
      return;
    }
    const report = Data.computeDiagnosticReport({ questions: state.questions, responses: state.responses, labelOf: state.labelOf || undefined });
    if (!report.consistency.ok) {
      state.report = null;
      $("sheets").hidden = true;
      setState("집계가 맞지 않아 결과표를 만들지 않았습니다. 새로고침해 다시 입력하세요.", true);
      return;
    }
    state.report = report;
    const out = View.render(report);
    $("donutSvg").innerHTML = out.donut;
    $("donutBig").innerHTML = out.donutBig;
    $("donutSub").textContent = out.donutSub;
    $("summary").innerHTML = out.summary;
    $("facts").innerHTML = out.facts;
    $("levels").style.setProperty("--cols", out.levelsCols);
    $("levels").innerHTML = out.levels;
    $("line").innerHTML = out.line;
    $("lineCap").textContent = out.lineCap;
    $("units").innerHTML = out.units;
    $("unitCap").textContent = out.unitCap;
    $("heat").innerHTML = out.heat;
    $("types").innerHTML = out.types;
    $("wrongN").textContent = out.wrongN;
    $("wrong").innerHTML = out.wrong;
    $("plan").innerHTML = out.plan;
    renderTexts();
    $("sheets").hidden = false;
    fitAll();
  }

  function setAnswer(no, value) {
    if (state.responses[no] === value) delete state.responses[no];
    else state.responses[no] = value;
    recompute();
  }

  function bindInputs() {
    $("qlist").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-no]");
      if (button) setAnswer(button.dataset.no, button.dataset.v);
    });
    $("clearBtn").addEventListener("click", () => {
      state.responses = Object.create(null);
      recompute();
    });
    for (const id of ["inName", "inGrade", "inDate", "inTestDate"]) {
      $(id).addEventListener("input", () => {
        if (!state.report) return;
        renderTexts();
        refitSoon();
      });
    }
    $("printBtn").addEventListener("click", async () => {
      if (!state.report) return;
      if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
      fitAll();
      window.print();
    });
  }

  async function main() {
    bindInputs();
    $("inDate").value = todayIso();
    $("panel").hidden = true;
    const uids = parseUids();
    if (!uids.length) {
      setState("진단평가 시험지의 문항 목록이 필요합니다. 주소 뒤에 ?uids=문항UID,문항UID,… 형식으로 문항 목록을 붙여 열어 주세요. 문항 순서가 문항 번호가 됩니다.", true);
      return;
    }
    if (uids.length > MAX_UIDS || new Set(uids).size !== uids.length) {
      setState("문항 목록이 올바르지 않습니다. 같은 문항이 두 번 들어 있거나 문항이 너무 많습니다.", true);
      return;
    }
    try {
      const [loaded, labels] = await Promise.all([loadQuestions(uids), loadLabelOf()]);
      state.questions = loaded.questions;
      state.grade = loaded.grade;
      state.unitCount = new Set(loaded.questions.map((q) => q.unit).filter(Boolean)).size || 0;
      state.labelOf = labels.labelOf;
      state.labelNote = labels.note;
    } catch (error) {
      setState(error && error.message ? error.message : "문항 정보를 불러오지 못했습니다.", true);
      return;
    }
    buildQuestionList();
    $("panel").hidden = false;
    renderTexts();
    recompute();
    if (state.labelNote && !state.report) setState(`${state.labelNote} ${$("state").textContent}`);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitSoon);
  }
  main();
})();
