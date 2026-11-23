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

  // 기본값 규칙: 열면 모든 문항이 정답(O)으로 채워진 "입력 중(draft)"이다. 선생님이 ‘결과표 만들기’를 눌러 confirmed가 된 뒤에야
  // 결과표가 나온다. 확인 전의 O는 결과가 아니다(안 열어 본 학생이 만점 결과지가 되지 않게). 규칙 계산은 DiagnosticReportData.inputStatus.
  const state = { questions: [], responses: Object.create(null), confirmed: false, labelOf: null, labelNote: "", grade: "", unitCount: 0, report: null };

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

  const levelLabel = (d) => (d == null ? "단계 없음" : `${d}단계`);

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
  // 단계 0~5(5가 가장 촘촘). 5단계로도 넘치면 마지막 수단으로 본문 전체를 비율(--shrink)로 줄여 쪽 아래 푸터가 잘리지 않게 한다.
  const MAX_LEVEL = 5;
  const MIN_SHRINK = 0.55; // 이보다 작으면 글자를 읽기 어려워 더 줄이지 않고 화면 경고만 남긴다
  function measureHeight(sheet, level, shrink) {
    const host = document.createElement("div");
    host.className = "sheetbox";
    host.style.cssText = "position:absolute;left:-10000px;top:0;width:794px;visibility:hidden;pointer-events:none;margin:0";
    const clone = sheet.cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("data-fit", String(level));
    clone.removeAttribute("data-shrink");
    clone.style.removeProperty("--shrink");
    if (shrink < 1) {
      clone.setAttribute("data-shrink", "");
      clone.style.setProperty("--shrink", String(shrink));
    }
    clone.style.minHeight = "0";
    host.appendChild(clone);
    document.body.appendChild(host);
    const height = clone.getBoundingClientRect().height;
    host.remove();
    return height;
  }
  function fitSheet(sheet) {
    let chosen = MAX_LEVEL;
    let height = 0;
    for (let level = 0; level <= MAX_LEVEL; level++) {
      height = measureHeight(sheet, level, 1);
      if (height <= A4_FIT_PX) { chosen = level; break; }
    }
    let shrink = 1;
    if (height > A4_FIT_PX) {
      // 줄일 부분은 푸터를 뺀 본문이라 비율이 정확히 맞지 않는다. 몇 번 다시 재서 맞춘다.
      for (let i = 0; i < 6 && height > A4_FIT_PX && shrink > MIN_SHRINK; i++) {
        shrink = Math.max(MIN_SHRINK, Math.floor(shrink * (A4_FIT_PX / height) * 0.99 * 1000) / 1000);
        height = measureHeight(sheet, chosen, shrink);
      }
    }
    sheet.setAttribute("data-fit", String(chosen));
    sheet.toggleAttribute("data-shrink", shrink < 1);
    if (shrink < 1) sheet.style.setProperty("--shrink", String(shrink));
    else sheet.style.removeProperty("--shrink");
    const overflow = height > A4_FIT_PX;
    sheet.toggleAttribute("data-overflow", overflow);
    return { level: chosen, height, shrink, overflow };
  }
  let fitTimer = 0;
  function fitAll() {
    state.fit = [fitSheet($("sheet1")), fitSheet($("sheet2"))];
    const over = state.fit.some((f) => f.overflow);
    $("printBtn").disabled = !state.report;
    const shrunk = state.fit.some((f) => f.shrink < 1);
    if (over) setState("내용이 아주 많아 글자를 줄여도 한 쪽에 다 담지 못했습니다. 인쇄 전에 확인하세요.", true);
    else if (shrunk) setState("내용이 많아 글자를 줄여 한 쪽에 맞췄습니다. 인쇄 전에 확인하세요.");
    else if (state.report) setState("");
    return state.fit;
  }
  function refitSoon() {
    if (!state.report) return;
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitAll, 120);
  }

  // ---- 그리기 ----
  function wrongNosText() {
    return state.questions.filter((q) => state.responses[q.no] === "X").map((q) => q.no).join(" ");
  }
  function statusLine(s) {
    const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    const score = `${s.total}문항 중 ${s.correct}개 정답 · ${s.wrong}개 오답 (${pct}%)`;
    if (s.phase === "empty") return `<span class="phase">미입력</span>아직 입력하지 않았습니다. 결과표·집계에 들어가지 않습니다.`;
    if (s.phase === "partial") return `<span class="phase partial">입력 중</span>입력 ${s.answered} / ${s.total} · 남은 ${s.unanswered}문항이 비어 있습니다.`;
    if (s.phase === "draft") return `<span class="phase draft">입력 중</span>확인 전: 결과표 만들기를 누르면 ${s.total}문항 중 ${s.correct}개 정답으로 만들어집니다.`;
    return `<span class="phase confirmed">입력 완료</span>${score}`;
  }
  function recompute() {
    const total = state.questions.length;
    const s = Data.inputStatus({ questions: state.questions, responses: state.responses, confirmed: state.confirmed });
    $("progress").innerHTML = statusLine(s);
    $("clearBtn").disabled = s.answered === 0;
    $("allOkBtn").textContent = s.answered === 0 ? "모두 정답으로" : "남은 문항 모두 정답으로";
    $("allOkBtn").disabled = s.unanswered === 0;
    $("confirmBtn").disabled = s.phase !== "draft";
    $("confirmBtn").hidden = s.phase === "confirmed";
    if ($("inWrong") !== document.activeElement) $("inWrong").value = wrongNosText();
    syncButtons();
    if (s.phase !== "confirmed") {
      state.report = null;
      $("sheets").hidden = true;
      $("printBtn").disabled = true;
      if (s.phase === "draft") setState(`모두 입력되어 있습니다(기본은 정답 O). 틀린 문항만 X로 바꾼 뒤 ‘결과표 만들기’를 누르세요. 누르기 전에는 결과표·집계에 쓰이지 않습니다. (지금 ${s.correct} / ${total}개 정답)`);
      else if (s.phase === "partial") setState(`비어 있는 문항이 있습니다. ‘남은 문항 모두 정답으로’나 O/X로 채운 뒤 ‘결과표 만들기’를 누르세요. (${s.answered} / ${total})`);
      else setState("입력하지 않은 상태입니다. ‘모두 정답으로’를 누르거나 문항마다 O/X를 눌러 주세요.");
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

  // X를 누르면 오답, 이미 X인 칸을 다시 누르면 정답(O)으로 돌아온다. O를 누르면 정답. 입력 칸을 비우는 일은 ‘정오 모두 지우기’만 한다.
  function setAnswer(no, value) {
    state.responses[no] = value === "X" && state.responses[no] === "X" ? "O" : value;
    recompute();
  }
  function setWrongMessage(text, error) {
    const el = $("wrongMsg");
    el.textContent = text;
    el.classList.toggle("err", Boolean(error));
  }
  function applyWrongLine() {
    const result = Data.applyWrongNumbers(state.questions, $("inWrong").value);
    if (!result.ok) { setWrongMessage(result.error, true); return; }
    state.responses = result.responses;
    $("inWrong").value = result.wrongNos.join(" ");
    setWrongMessage(result.wrongNos.length ? `${result.wrongNos.join(", ")}번을 X로, 나머지는 O로 맞췄습니다.` : "틀린 번호가 없어 모두 O로 맞췄습니다.", false);
    recompute();
  }

  function bindInputs() {
    $("qlist").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-no]");
      if (button) setAnswer(button.dataset.no, button.dataset.v);
    });
    $("allOkBtn").addEventListener("click", () => {
      state.responses = Data.fillRemainingCorrect(state.questions, state.responses);
      recompute();
    });
    $("clearBtn").addEventListener("click", () => {
      state.responses = Object.create(null);
      state.confirmed = false;
      setWrongMessage("적으면 그 번호만 X, 나머지는 모두 O가 됩니다.", false);
      recompute();
    });
    $("confirmBtn").addEventListener("click", () => {
      if (Data.inputStatus({ questions: state.questions, responses: state.responses }).unanswered) return;
      state.confirmed = true;
      recompute();
      // 좁은 화면에서는 결과표가 입력 칸 아래에 있어, 만든 직후 그 자리로 옮겨 준다.
      if (window.innerWidth <= 1160 && !$("sheets").hidden) $("sheets").scrollIntoView({ block: "start" });
    });
    $("wrongBtn").addEventListener("click", applyWrongLine);
    $("inWrong").addEventListener("keydown", (event) => {
      if (event.key === "Enter") { event.preventDefault(); applyWrongLine(); }
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
    state.responses = Data.allCorrectResponses(state.questions);
    state.confirmed = false;
    $("panel").hidden = false;
    renderTexts();
    recompute();
    if (state.labelNote && !state.report) setState(`${state.labelNote} ${$("state").textContent}`);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitSoon);
  }
  main();
})();
