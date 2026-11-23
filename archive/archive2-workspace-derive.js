// Archive2 workspace, derive part: "이 시험지로 다시 만들기" (기준 시험지로 다시 만들기) 작은 창, 진입, 문제지 만들기로 넘기기.
// 선정 규칙은 archive2-derive.js(순수 함수)에 있고, 여기는 화면·원본 확인(정답·해설 빈 문항)·넘기기만 맡는다.
(function () {
  "use strict";
  // ---- shared namespace: window.Archive2Workspace is created by archive2-workspace-core.js ----
  const WS = window.Archive2Workspace;
  const V = WS.v;
  const C = window.Archive2Core;
  const O = window.Archive2Output;
  const Source = window.Archive2Source;
  const Unified = window.Archive2UnifiedUnits;
  // names defined in other parts; WS.link() fills them in before the first call
  let
    $, api, applyUidRoute, button, esc, generate, rememberCurrentHistoryEntry, replaceUrlState, resetWorkingDraft,
    render, routeUrl, save, showDialog, state, status, teacherErrorMessage, unifiedIndex, workspaceEligibility;
  WS.links.push(() => {
    ({
      $, api, applyUidRoute, button, esc, generate, rememberCurrentHistoryEntry, replaceUrlState, resetWorkingDraft,
      render, routeUrl, save, showDialog, state, status, teacherErrorMessage, unifiedIndex, workspaceEligibility
    } = WS.api);
  });
  const Derive = () => window.Archive2Derive;
  const LEVEL_NAME = Object.freeze({ same: "기본", "up-some": "응용", "up-one": "심화" });
  const LEVEL_HINT = Object.freeze({
    same: "기준과 같은 난이도 분포",
    "up-some": "절반쯤 한 단계 위로",
    "up-one": "모두 한 단계 위로 (5단계는 그대로)",
  });
  const TYPE_NAME = Object.freeze({ same: "같은 유형", different: "다른 유형" });
  const TYPE_HINT = Object.freeze({
    same: "같은 단원·같은 세부 유형의 다른 문항으로",
    different: "같은 단원에서 유형이 다른 문항으로",
  });
  // mock = 학교 모의고사: 학교 기출 + 유사 + 교재(교과서는 빼고), 같은 시험의 유사·유형 문항과 한 벌 안의 원본-유사 짝을 넣지 않는다.
  const SOURCE_NAME = Object.freeze({ all: "전체", school: "학교 기출", similar: "유사", textbook: "교과서", workbook: "교재", mock: "학교 모의고사(기출·유사·교재)" });
  const MOCK_LEVELS = Object.freeze(["same", "up-some", "up-one"]);
  const MOCK_LEVEL_HINT = Object.freeze({
    same: "거의 같은 난이도로",
    "up-some": "같거나 한 단계 어렵게 섞어서",
    "up-one": "한 단계 어렵게(같은 유형)",
  });
  const KIND_NAME = Object.freeze({ school: "학교 기출", similar: "유사", textbook: "교과서", workbook: "교재" });
  const OLD_FORMAT_MESSAGE = "옛 형식 출제본이라 다시 뽑기를 지원하지 않습니다.";
  const MAX_BASE = 400;
  // dlg: the open dialog's choices and result.
  // pendingMock: 주소의 ?mock=<시험지 원본 파일>은 읽는 순간(이 파일을 불러올 때) 붙잡아 둔다. 자료가 오기 전에 화면이 주소를 다시 쓰면 사라지기 때문이다.
  const urlMock = (() => { try { return new URLSearchParams(location.search).get("mock") || ""; } catch { return ""; } })();
  V.derive = { dlg: null, index: null, indexFor: null, unifiedFor: null, publishers: null, pending: null, busy: false, fileIndex: null, restored: new Map(), pendingMock: String(urlMock).trim() };

  const text = (value) => (value == null ? "" : String(value)).trim();

  // ---- 색인 ----
  function eligible(record) {
    return Boolean(C.difficultyEligible && C.difficultyEligible(record)) && workspaceEligibility(record).ok;
  }
  function deriveIndex() {
    const D = Derive();
    const unified = unifiedIndex();
    if (!D || !unified || !state.catalog?.records) return null;
    const V2 = V.derive;
    if (V2.indexFor !== state.catalog.records || V2.unifiedFor !== unified) {
      V2.index = D.buildDeriveIndex(state.catalog.records, { unified, projectionPolicy: state.catalog.projectionPolicy, eligible });
      V2.indexFor = state.catalog.records;
      V2.unifiedFor = unified;
      V2.publishers = null;
      V2.fileIndex = null;
      V2.restored.clear();
    }
    return V2.index;
  }
  function publishers() {
    const index = deriveIndex();
    if (!index) return [];
    if (!V.derive.publishers) {
      const found = new Set();
      for (const cand of index.byUid.values()) if (cand.srcKind === "textbook" && cand.publisher) found.add(cand.publisher);
      V.derive.publishers = [...found].sort((a, b) => a.localeCompare(b, "ko"));
    }
    return V.derive.publishers;
  }

  // ---- 기준 문항 되찾기: UID가 없는 옛 출제본은 원본 파일 + 문항 순번(번호)으로 찾는다 ----
  function fileIndex() {
    if (!V.derive.fileIndex) {
      const byOrdinal = new Map(), byNo = new Map();
      for (const record of state.catalog?.records || []) {
        const file = text(record.sourceFile);
        if (!record.questionUid || !file) continue;
        byOrdinal.set(`${file}#${record.sourceOrdinal}`, record.questionUid);
        const no = text(record.sourceQuestionNo);
        if (no) byNo.set(`${file}@${no}`, byNo.has(`${file}@${no}`) ? "" : record.questionUid);
      }
      V.derive.fileIndex = { byOrdinal, byNo };
    }
    return V.derive.fileIndex;
  }
  function normalizeFile(file) {
    return text(file).replace(/\\/g, "/").replace(/^\/?(?:archive\/)?exams\//, "").replace(/^\/+/, "");
  }
  // item: { uid, file, ordinal, no } → the catalog UID, or "" when it cannot be told.
  function resolveBaseItem(item) {
    const uid = text(item?.uid);
    if (uid && state.byUid?.has(uid)) return uid;
    const file = normalizeFile(item?.file);
    if (!file) return "";
    const index = fileIndex();
    const ordinal = Number(item?.ordinal);
    if (Number.isInteger(ordinal) && ordinal > 0) {
      const hit = index.byOrdinal.get(`${file}#${ordinal}`) || index.byOrdinal.get(`exams/${file}#${ordinal}`);
      if (hit) return hit;
    }
    const no = text(item?.no);
    return no ? index.byNo.get(`${file}@${no}`) || "" : "";
  }
  // The questions of an envelope / a message → identity items (never the problem text).
  function deriveItemsFromEnvelope(envelope) {
    const uids = Array.isArray(envelope?.questionUids) ? envelope.questionUids : [];
    const questions = Array.isArray(envelope?.questions) ? envelope.questions : [];
    const count = Math.max(uids.length, questions.length);
    const items = [];
    for (let i = 0; i < count; i++) {
      const q = questions[i] || {};
      items.push({
        uid: text(uids[i] || q.questionUid || q.source_question_uid || q._sourceQuestionUid),
        file: text(q.sourceArchiveFile || q.sourceFile || q._sourceFile),
        ordinal: Number(q.sourceOrdinal || q._sourceQuestionOrdinal) || 0,
        no: text(q.sourceQuestionNo ?? q._sourceQuestionNo),
      });
    }
    return items;
  }
  function deriveResolveBase(items) {
    const uids = [], seen = new Set();
    let unresolved = 0, recovered = 0;
    for (const item of (items || []).slice(0, MAX_BASE)) {
      const direct = text(item?.uid) && state.byUid?.has(text(item.uid));
      const uid = resolveBaseItem(item);
      if (!uid) { unresolved++; continue; }
      if (!direct) recovered++;
      if (seen.has(uid)) continue;
      seen.add(uid);
      uids.push(uid);
    }
    return { uids, unresolved, recovered };
  }

  // ---- 문구 ----
  const unitLabelOf = (uid) => unifiedIndex()?.byUid.get(uid)?.unitLabel || "";
  function sourceLabelOf(record) {
    const D = Derive();
    const src = D.sourceKindOf(record, null);
    const kind = KIND_NAME[src.kind] || "";
    if (src.kind === "school") {
      const no = record.sourceQuestionNo ?? record.sourceOrdinal;
      return [[record.year, record.school].filter(Boolean).join(" ") || kind, no ? `${no}번` : ""].filter(Boolean).join(" ");
    }
    return [kind, src.publisher].filter(Boolean).join(" ");
  }
  // 옛 출제 행의 시험 이름이 내부 키여도 새 문제지 제목에는 한글 제목이 들어간다(저장되는 제목이기 때문).
  const baseTitleOf = (dlg) => (window.ExamDisplayTitle?.displayTitleOf?.(dlg.baseTitle || "") || dlg.baseTitle) || "기준 시험지";

  // ---- 진입 ----
  function openDialog(dlg) {
    V.derive.dlg = dlg;
    renderDialog();
  }
  const isMock = (dlg) => dlg?.source === "mock";
  // 새 문제지 제목: 학교 모의고사는 "<시험> 기본 모의고사", 그 밖은 "<기준> 다시 만들기".
  const paperTitleOf = (dlg, level = dlg.level) => (isMock(dlg) ? `${baseTitleOf(dlg)} ${LEVEL_NAME[level] || ""} 모의고사` : `${baseTitleOf(dlg)} 다시 만들기`);
  function newDialog({ baseUids, baseTitle, note, preset }) {
    return {
      sets: {}, choose: false,
      baseUids, baseTitle, note: note || "",
      typeMode: preset?.typeMode || "same",
      level: preset?.level || "same",
      source: preset?.source || "all",
      publisher: preset?.publisher || "",
      seed: preset?.seed || freshSeed(),
      exclude: [...(preset?.exclude || [])],
      result: null, error: "",
    };
  }
  const freshSeed = () => crypto.randomUUID().slice(0, 8);
  // items: identity items from a window message or an envelope. A paper that cannot be traced says so and stops there.
  function deriveStartFromItems(items, { title, note } = {}) {
    if (!state.catalog?.records) { status("자료를 준비하는 중입니다. 준비가 끝나면 이어서 진행합니다."); V.derive.pending = { items, title, note }; return; }
    const base = deriveResolveBase(items);
    if (!base.uids.length) {
      showDialog("이 시험지로 다시 만들기",
        `<p class="error" role="alert" data-derive-unsupported>${esc(OLD_FORMAT_MESSAGE)}</p><p class="muted">시험지를 새로 만들려면 문제지 만들기에서 직접 고르세요.</p>`);
      return;
    }
    const notes = [];
    if (base.recovered) notes.push(`옛 출제본이라 원본 파일·번호로 ${base.recovered}문항을 찾았습니다.`);
    if (base.unresolved) notes.push(`기준 문항 ${base.unresolved}개는 지금 자료에서 찾지 못해 뺐습니다.`);
    if (note) notes.push(note);
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    openDialog(newDialog({ baseUids: base.uids, baseTitle: title, note: notes.join(" ") }));
  }
  function openDeriveFromUrl() {
    const wanted = [...new Set(new URLSearchParams(location.search).getAll("derive").map(text).filter(Boolean))].slice(0, MAX_BASE);
    // A request that arrived before the catalog was ready waits here; an address with ?derive= is the fallback of the output window.
    startFromPending();
    openMockFromUrl();
    if (!wanted.length) return;
    deriveStartFromItems(wanted.map((uid) => ({ uid })), { title: "기준 시험지" });
    try { replaceUrlState(); } catch {}
  }
  function startFromPending() {
    const pending = V.derive.pending;
    if (!pending || !state.catalog?.records) return;
    V.derive.pending = null;
    deriveStartFromItems(pending.items, pending);
  }
  // A small window (mixed_engine) asks this page, which holds the catalog, to open the dialog.
  // (A named handler, not an inline one: tests/archive2-assignment-handoff.test.cjs cuts the main script's message listener out by its opening text.)
  function onDeriveRequest(event) {
    const data = event.data;
    if (!data || data.type !== "archive2-derive-request" || event.origin !== location.origin) return;
    if (!Array.isArray(data.items) || !data.items.length || data.items.length > MAX_BASE) return;
    try { event.source?.postMessage({ type: "archive2-derive-ack" }, location.origin); } catch {}
    const items = data.items.map((item) => ({ uid: text(item?.uid), file: text(item?.file), ordinal: Number(item?.ordinal) || 0, no: text(item?.no) }));
    try { window.focus(); } catch {}
    deriveStartFromItems(items, { title: text(data.title).slice(0, 80), note: data.assignment ? "출제한 시험지의 유형·난이도는 지금 자료 기준입니다." : "" });
  }
  window.addEventListener("message", onDeriveRequest);
  // 출제 내역 row: the assignment's own paper (the server replays what was issued).
  async function startFromAssignment(assignmentId) {
    const id = text(assignmentId);
    if (!id) return;
    const row = (state.recentRows || []).find((a) => String(a.id) === id);
    status("출제한 시험지를 불러오고 있습니다.");
    try {
      const data = await api(`/class-exam-assignments/${encodeURIComponent(id)}/output?mode=exam`);
      const envelope = data?.envelope;
      if (!envelope) throw new Error("출제 당시 내용을 불러오지 못했습니다. 새로고침한 뒤 다시 시도하고, 계속되면 관리자에게 알려 주세요.");
      status("");
      deriveStartFromItems(deriveItemsFromEnvelope(envelope), { title: row?.title || envelope.meta?.title || "출제한 시험지", note: "출제한 시험지의 유형·난이도는 지금 자료 기준입니다." });
    } catch (error) {
      status(teacherErrorMessage(error, "출제한 시험지를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요."), true, error);
    }
  }
  // 문제지 만들기의 "다시 뽑기": same choices, new seed, and what was already given is left out (the chain).
  async function startFromCompose() {
    const info = state.derive;
    if (!info || !Array.isArray(info.baseUids) || !info.baseUids.length) return;
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    const dlg = newDialog({
      baseUids: info.baseUids, baseTitle: info.baseTitle,
      preset: { typeMode: info.typeMode, level: info.level, source: info.source, publisher: info.publisher, exclude: [...(info.exclude || []), ...(info.resultUids || [])] },
    });
    openDialog(dlg);
    await runDerive();
  }

  // ---- 학교 모의고사: 학교 시험지 한 줄 → 기본 / 응용 / 심화 (2026-11-23) ----
  // 기준 = 그 시험지의 문항 전부(카탈로그 레코드, 시험지 번호 순). 유형·난이도 선정은 위 "다시 만들기"와 같은 archive2-derive.js 하나를 쓴다.
  // 다른 점은 한 가지 묶음 설정뿐이다: 출처 = 학교 기출 + 유사 + 교재, 같은 시험의 유사·유형 문항과 한 벌 안의 원본-유사 짝은 뺀다.
  function mockBaseUids(exam) {
    const file = text(exam?.file);
    if (!file) return [];
    return (state.catalog?.records || [])
      .filter((record) => record.sourceFile === file && record.questionUid)
      .sort((a, b) => (Number(a.sourceOrdinal) || 0) - (Number(b.sourceOrdinal) || 0))
      .map((record) => record.questionUid);
  }
  function startMockForExam(exam) {
    if (!exam) return;
    if (!state.catalog?.records) { status("자료를 준비하는 중입니다. 준비가 끝나면 이어서 진행합니다."); V.derive.pendingMock = exam.file; return; }
    const uids = mockBaseUids(exam);
    if (!uids.length) { status("이 시험지의 문항을 자료에서 찾지 못했습니다.", true); return; }
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    const dlg = newDialog({ baseUids: uids, baseTitle: O.displayTitle(exam), preset: { typeMode: "same", level: "same", source: "mock" } });
    dlg.choose = true;
    openDialog(dlg);
  }
  // ?mock=<시험지 원본 파일> (옛 홈의 시험지 카드, 즐겨찾기 주소). 카탈로그가 올 때까지 기다렸다가 연다.
  function openMockFromUrl() {
    const wanted = text(V.derive.pendingMock);
    if (!wanted || !state.catalog?.records) return;
    V.derive.pendingMock = "";
    const exam = (state.catalog.exams || []).find((item) => item.file === wanted || item.file === normalizeFile(wanted));
    if (new URLSearchParams(location.search).has("mock")) { try { replaceUrlState(); } catch {} }
    if (!exam) { status("모의고사를 만들 시험지를 자료에서 찾지 못했습니다.", true); return; }
    startMockForExam(exam);
  }
  // 한 난이도의 세트를 골라 둔다(다른 세트가 이미 골라 둔 문항은 뺀다: 세 벌이 서로 다른 문항이 되게).
  function computeMockSet(dlg, level) {
    const saved = dlg.level;
    dlg.level = level;
    try { return computeDerive(dlg); } finally { dlg.level = saved; }
  }
  function selectMockLevel(level) {
    const dlg = V.derive.dlg;
    if (!dlg || !MOCK_LEVELS.includes(level)) return;
    dlg.choose = false;
    dlg.level = level;
    dlg.error = "";
    dlg.result = dlg.sets[level] || null;
    if (dlg.result) { renderDialog(); return; }
    return runDerive();
  }
  async function mockAll() {
    const dlg = V.derive.dlg;
    if (!dlg || V.derive.busy) return;
    dlg.choose = false;
    dlg.error = "";
    try {
      for (const level of MOCK_LEVELS) computeMockSet(dlg, level);
      dlg.level = "same";
      dlg.result = dlg.sets.same;
    } catch (error) {
      dlg.error = teacherErrorMessage(error, "문항을 고르지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      console.warn("[archive2] mock failed:", error);
    }
    renderDialog();
  }
  function mockChooseMarkup(dlg) {
    const levels = MOCK_LEVELS.map((level) => button("derive-mock-level", `<strong>${esc(LEVEL_NAME[level])}</strong><span>${esc(MOCK_LEVEL_HINT[level])}</span>`,
      `type="button" class="mock-level" data-level="${level}"`)).join("");
    return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${dlg.baseUids.length}문항</p>
      <p class="muted">이 시험과 같은 유형·같은 문항 수로 다른 문항을 골라 모의고사를 만듭니다. 이 시험의 문항과 그 유사문제는 넣지 않습니다.</p>
      <div class="mock-levels" role="group" aria-label="모의고사 난이도">${levels}</div>
      <div class="actions">${button("derive-mock-all", "세 벌 한꺼번에 만들기", 'type="button"')}</div>`;
  }
  function mockTabsMarkup(dlg) {
    return `<div class="mock-tabs" role="group" aria-label="난이도">${MOCK_LEVELS.map((level) => button("derive-mock-level",
      `${esc(LEVEL_NAME[level])}${dlg.sets[level] ? "" : " (만들기)"}`, `type="button" class="mock-tab" data-level="${level}" aria-pressed="${dlg.level === level}"`)).join("")}</div>`;
  }

  // 문제지 만들기 화면에서 같은 시험의 다른 난이도 모의고사로 넘어간다(세 벌을 차례로 저장·출제할 때). 지금 문제지 문항은 새 세트에서 뺀다.
  async function mockSwitch(level) {
    const info = state.derive;
    if (!info || info.source !== "mock" || !MOCK_LEVELS.includes(level) || V.derive.busy) return;
    if (!deriveIndex()) { status("문항 목록을 준비하지 못했습니다. 새로고침한 뒤 다시 시도해 주세요.", true); return; }
    const dlg = newDialog({
      baseUids: info.baseUids, baseTitle: info.baseTitle,
      preset: { typeMode: "same", level, source: "mock", exclude: [...(info.exclude || []), ...(info.resultUids || [])] },
    });
    V.derive.dlg = dlg;
    try { dlg.result = computeDerive(dlg); } catch (error) { status(teacherErrorMessage(error, "문항을 고르지 못했습니다. 잠시 뒤 다시 시도해 주세요."), true, error); return; }
    if (!dlg.result.items.length) { status("이 난이도로는 뽑을 문항을 찾지 못했습니다.", true); return; }
    await toCompose();
  }

  // ---- 화면 ----
  function optionRadios(name, values, names, hints, current) {
    return values.map((value) => `<label class="derive-choice"><input type="radio" name="derive-${name}" value="${esc(value)}" data-derive-field="${name}"${current === value ? " checked" : ""}> <span><strong>${esc(names[value])}</strong>${hints[value] ? `<small>${esc(hints[value])}</small>` : ""}</span></label>`).join("");
  }
  function optionsMarkup(dlg) {
    const pubs = publishers();
    const pubOptions = [`<option value="">전체 출판사</option>`, ...pubs.map((name) => `<option value="${esc(name)}"${dlg.publisher === name ? " selected" : ""}>${esc(name)}</option>`)].join("");
    return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · 기준 ${dlg.baseUids.length}문항</p>
      ${dlg.note ? `<p class="muted derive-note">${esc(dlg.note)}</p>` : ""}
      <fieldset class="derive-group"><legend>유형</legend><div class="derive-choices">${optionRadios("typeMode", ["same", "different"], TYPE_NAME, TYPE_HINT, dlg.typeMode)}</div></fieldset>
      <fieldset class="derive-group"><legend>난이도</legend><div class="derive-choices">${optionRadios("level", ["same", "up-some", "up-one"], LEVEL_NAME, LEVEL_HINT, dlg.level)}</div></fieldset>
      <div class="derive-group derive-source"><label>어디서 뽑을지
        <select data-derive-field="source">${Object.keys(SOURCE_NAME).map((key) => `<option value="${key}"${dlg.source === key ? " selected" : ""}>${esc(SOURCE_NAME[key])}</option>`).join("")}</select></label>
        <label class="derive-publisher"${dlg.source === "textbook" ? "" : " hidden"}>출판사<select data-derive-field="publisher"${dlg.source === "textbook" ? "" : " disabled"}>${pubOptions}</select></label></div>
      <p id="derive-error" class="error" role="alert"${dlg.error ? "" : " hidden"}>${esc(dlg.error)}</p>
      <div class="actions">${button("derive-run", "다시 뽑기", 'class="primary"')}</div>`;
  }
  function resultMarkup(dlg) {
    const out = dlg.result;
    const summary = out.summary;
    const count = out.items.length;
    const choices = `${TYPE_NAME[dlg.typeMode]} · ${LEVEL_NAME[dlg.level]}${dlg.source !== "all" ? ` · ${SOURCE_NAME[dlg.source]}${dlg.source === "textbook" && dlg.publisher ? ` ${esc(dlg.publisher)}` : ""}` : ""}`;
    if (!count) {
      return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${esc(choices)}</p>
        <p class="error" role="alert" data-derive-empty>이 조건에서는 뽑을 문항을 찾지 못했습니다. 유형·난이도·출처를 바꿔 다시 시도해 보세요.</p>
        ${noteList(dlg)}<div class="actions">${button("derive-edit", "조건 바꾸기", 'class="primary"')}</div>`;
    }
    const rows = out.perItem.map((item, i) => ({ item, i })).filter(({ item }) => item.pickedUid).map(({ item }, n) => {
      const record = out.items.find((r) => r.questionUid === item.pickedUid);
      const unit = unitLabelOf(item.pickedUid);
      const step = record?.difficultyBucket ? `${record.difficultyBucket}단계` : "";
      const rung = Derive().RUNG_LABEL[item.rung] || "";
      return `<li><span class="derive-q">${esc([unit, record ? sourceLabelOf(record) : ""].filter(Boolean).join(" · "))}</span> <span class="derive-meta">${esc([step, rung].filter(Boolean).join(" · "))}</span></li>`;
    }).join("");
    const mark = (summary.text || "").trim();
    return `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${esc(choices)}</p>
      <p class="derive-total" data-derive-summary><strong>${count}문항</strong>${count < dlg.baseUids.length ? ` (기준 ${dlg.baseUids.length}문항)` : ""}${mark ? ` · ${esc(mark)}` : ""}</p>
      <p class="derive-level" data-derive-level>${esc(summary.levelText)}</p>
      ${noteList(dlg)}
      <details class="derive-list"><summary>뽑힌 문항 ${count}개 보기</summary><ol>${rows}</ol></details>
      <p id="derive-error" class="error" role="alert"${dlg.error ? "" : " hidden"}>${esc(dlg.error)}</p>
      <div class="actions derive-actions">${button("derive-popup", "시험지 열기", 'class="primary"')}${button("derive-compose", "문제지 만들기에서 이어서")}${button("derive-again", "다시 뽑기")}${button("derive-edit", "조건 바꾸기")}</div>`;
  }
  // 학교 모의고사 결과: 난이도 탭 + 한 줄 요약 + 자리별 목록(못 채운 자리 표시) + 열기·이어서·다시 뽑기.
  function mockResultMarkup(dlg) {
    const out = dlg.result;
    const summary = out.summary;
    const count = out.items.length;
    const tabs = mockTabsMarkup(dlg);
    const head = `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · ${esc(LEVEL_NAME[dlg.level])} 모의고사 · 기준 ${dlg.baseUids.length}문항</p>${tabs}`;
    if (!count) {
      return `${head}<p class="error" role="alert" data-derive-empty>이 시험지로는 뽑을 문항을 찾지 못했습니다. 같은 학년·과목의 문항이 부족합니다.</p>
        ${noteList(dlg)}<div class="actions">${button("derive-again", "다시 뽑기", 'class="primary"')}</div>`;
    }
    const unfilled = new Set(summary.unfilledSlots || []);
    const rows = out.perItem.map((item, i) => {
      const slot = i + 1;
      if (!item.pickedUid) return `<li class="mock-unfilled" data-mock-unfilled="${slot}"><span class="derive-q">${slot}번 자리</span> <span class="derive-meta">후보가 없어 비워 둠</span></li>`;
      const record = out.items.find((r) => r.questionUid === item.pickedUid);
      const unit = unitLabelOf(item.pickedUid);
      const step = record?.difficultyBucket ? `${record.difficultyBucket}단계` : "";
      const rung = Derive().RUNG_LABEL[item.rung] || "";
      return `<li><span class="derive-q">${slot}번 · ${esc([unit, record ? sourceLabelOf(record) : ""].filter(Boolean).join(" · "))}</span> <span class="derive-meta">${esc([step, rung].filter(Boolean).join(" · "))}</span></li>`;
    }).join("");
    const gaps = unfilled.size
      ? `<p class="warn mock-gap" role="status" data-mock-gap>못 채운 자리: ${[...unfilled].map((slot) => `${slot}번`).join(", ")}. 문제지 만들기에서 직접 골라 채울 수 있습니다.</p>` : "";
    const all = MOCK_LEVELS.every((level) => dlg.sets[level]?.items.length) ? button("derive-mock-open-all", "세 벌 모두 열기") : "";
    return `${head}
      <p class="derive-total" data-derive-summary><strong>${esc(summary.headline || `${count}문항`)}</strong></p>
      <p class="derive-level" data-derive-level>${esc(summary.levelText)}</p>
      ${gaps}${noteList(dlg)}
      <details class="derive-list"><summary>뽑힌 문항 ${count}개 보기</summary><ol class="mock-slots">${rows}</ol></details>
      <p id="derive-error" class="error" role="alert"${dlg.error ? "" : " hidden"}>${esc(dlg.error)}</p>
      <div class="actions derive-actions">${button("derive-popup", "시험지 열기", 'class="primary"')}${button("derive-compose", "문제지 만들기에서 이어서")}${all}${button("derive-again", "다시 뽑기")}${button("derive-edit", "조건 바꾸기")}</div>`;
  }
  function noteList(dlg) {
    const notes = [...(dlg.result?.notes || [])];
    return notes.length ? `<ul class="derive-notes" data-derive-notes>${notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : "";
  }
  function renderDialog() {
    const dlg = V.derive.dlg;
    if (!dlg) return;
    const body = V.derive.busy
      ? `<p class="derive-base"><strong>${esc(baseTitleOf(dlg))}</strong> · 기준 ${dlg.baseUids.length}문항</p><p class="muted" role="status" aria-busy="true">문항을 준비하고 있습니다…</p>`
      : dlg.choose ? mockChooseMarkup(dlg)
      : dlg.result ? (isMock(dlg) ? mockResultMarkup(dlg) : resultMarkup(dlg)) : optionsMarkup(dlg);
    showDialog(isMock(dlg) ? "학교 모의고사 만들기" : "이 시험지로 다시 만들기", `<div class="derive-dialog${isMock(dlg) ? " derive-mock" : ""}">${body}</div>`);
  }
  document.addEventListener("change", (event) => {
    const field = event.target?.closest?.("[data-derive-field]");
    const dlg = V.derive.dlg;
    if (!field || !dlg || dlg.result) return;
    const name = field.dataset.deriveField;
    dlg[name] = field.value;
    if (name === "source") {
      const select = document.querySelector('select[data-derive-field="publisher"]');
      const label = document.querySelector(".derive-publisher");
      if (select) select.disabled = dlg.source !== "textbook";
      if (label) label.hidden = dlg.source !== "textbook";
      if (dlg.source !== "textbook") dlg.publisher = "";
    }
  });

  // ---- 뽑기 ----
  function sourceSpec(dlg) {
    if (dlg.source === "textbook") return dlg.publisher ? { kind: "textbook", publisher: dlg.publisher } : "textbook";
    if (dlg.source === "mock") return ["school", "similar", "workbook"];
    return dlg.source === "all" ? "all" : dlg.source;
  }
  // 한 번 뽑는다(동기, 원본 시험 파일을 열지 않는다). 학교 모의고사는 다른 난이도 세트가 이미 고른 문항을 뺀다(세 벌이 서로 다른 문항이 되게).
  function computeDerive(dlg) {
    const D = Derive();
    const index = deriveIndex();
    if (!D || !index) throw new Error("DERIVE_INDEX_MISSING");
    const mock = isMock(dlg);
    const others = mock ? Object.entries(dlg.sets || {}).filter(([level]) => level !== dlg.level).flatMap(([, set]) => set.items.map((record) => record.questionUid)) : [];
    // Picking reads the catalog only: no source exam file is requested here (the originals are read when the paper is opened).
    const out = D.deriveFromPaper(dlg.baseUids, {
      typeMode: dlg.typeMode, level: dlg.level, sources: sourceSpec(dlg), seed: dlg.seed,
      exclude: [...dlg.exclude, ...others], includeBlank: true,
      ...(mock ? { pairExclusive: true, excludeBaseFamily: true, preferSchool: true } : {}),
    }, index);
    // The screen tells only what the teacher can act on: the "정식/참고용 유형" split stays an internal measure.
    const notes = (out.summary.notes || []).filter((note) => !/확정 전/.test(note) && !/^다른 유형이 모자라/.test(note));
    if (dlg.typeMode === "different" && out.summary.relaxed > 0)
      notes.unshift(`다른 유형 문항이 모자라 ${out.summary.relaxed}문항은 이 시험지의 다른 문항과 유형이 겹칩니다.`);
    if (dlg.typeMode === "same" && out.summary.counts && out.items.length &&
        out.summary.counts.type + out.summary.counts.concept + out.summary.counts.subunit + out.summary.counts.unit + out.summary.counts.none > 0)
      notes.unshift("같은 세부 유형이 모자란 자리는 한 단계씩 넓혀(같은 유형 → 같은 개념 → 같은 단원) 채웠습니다.");
    out.notes = notes;
    if (mock) { dlg.sets ||= {}; dlg.sets[dlg.level] = out; }
    return out;
  }
  async function runDerive() {
    const dlg = V.derive.dlg;
    if (!dlg || !Derive() || !deriveIndex() || V.derive.busy) return;
    V.derive.busy = true;
    dlg.error = "";
    renderDialog();
    try {
      dlg.result = computeDerive(dlg);
    } catch (error) {
      dlg.error = teacherErrorMessage(error, "문항을 고르지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      console.warn("[archive2] derive failed:", error);
    } finally {
      V.derive.busy = false;
      renderDialog();
    }
  }
  function again() {
    const dlg = V.derive.dlg;
    if (!dlg?.result) return;
    // What was just given is left out of the next result, and the seed changes (a different tie-break too).
    dlg.exclude = [...new Set([...dlg.exclude, ...dlg.result.items.map((record) => record.questionUid)])];
    dlg.seed = freshSeed();
    if (dlg.sets) delete dlg.sets[dlg.level];
    dlg.result = null;
    runDerive();
  }

  // ---- 시험지 열기(작은 창) ----
  function gradeSubjectOf(records) {
    const entry = unifiedIndex()?.byUid.get(records[0]?.questionUid);
    const subject = entry && Unified?.subjectByValue ? Unified.subjectByValue(entry.grade, entry.subject)?.label || "" : "";
    return { grade: entry?.grade || "", subject };
  }
  // 시험지 순서: 객관식 먼저, 서술형 뒤. 각 묶음 안은 기준 시험지의 자리 순서(= 뽑은 순서) 그대로. 객관식인지는 원본 문항으로만 알 수 있어
  // (카탈로그에는 없다) 시험지로 만들 때 고른 문항만 읽어 정한다. 뽑는 단계는 원본을 열지 않는다.
  const isObjective = (q) => Boolean(q) && ((Array.isArray(q.choices) && q.choices.length > 0) || /^[①②③④⑤]$/.test(text(q.answer)));
  async function restoreForPaper(records) {
    const need = records.filter((record) => !V.derive.restored.has(record.questionUid));
    if (!need.length) return;
    const questions = await Source.restore(need, state.catalog);
    need.forEach((record, i) => { if (questions[i]) V.derive.restored.set(record.questionUid, questions[i]); });
  }
  function paperOrder(records) {
    const objective = [], other = [];
    for (const record of records) (isObjective(V.derive.restored.get(record.questionUid)) ? objective : other).push(record);
    return [...objective, ...other];
  }
  // The window is opened here, before the first await, while the click is still a user gesture.
  function openPopup() {
    const dlg = V.derive.dlg;
    if (!dlg?.result?.items.length || V.derive.busy) return;
    openPapers([{ level: dlg.level, result: dlg.result }]);
  }
  // 학교 모의고사 세 벌을 한 번 눌러 창 셋으로 연다(창은 모두 이 눌림 안에서, 첫 await 전에 연다).
  function openAllPapers() {
    const dlg = V.derive.dlg;
    if (!dlg || V.derive.busy) return;
    const papers = MOCK_LEVELS.map((level) => ({ level, result: dlg.sets?.[level] })).filter((paper) => paper.result?.items.length);
    if (papers.length) openPapers(papers);
  }
  function openPapers(papers) {
    const dlg = V.derive.dlg;
    const popups = papers.map(() => window.open("about:blank", "_blank"));
    if (!popups[0]) { popups.forEach((popup) => popup?.close()); setError("새 창을 열 수 없습니다. 팝업 설정을 확인하세요."); return; }
    const blocked = popups.filter((popup) => !popup).length;
    papers.forEach((paper, n) => {
      const popup = popups[n];
      if (!popup) return;
      popup.document.body.textContent = "시험지를 준비하고 있습니다.";
      openPaperIn(dlg, paper.result, paper.level, popup);
    });
    if (blocked) setError(`새 창 ${blocked}개를 열 수 없어 나머지만 열었습니다. 팝업 설정을 확인하고 다시 눌러 주세요.`);
  }
  function openPaperIn(dlg, result, level, popup) {
    (async () => {
      try {
        // The only place the originals are read for a window: the questions of the paper being opened.
        await restoreForPaper(result.items);
        const records = paperOrder(result.items);
        const questions = records.map((record) => V.derive.restored.get(record.questionUid));
        if (questions.some((q) => !q)) throw new Error("원본 문항을 불러오지 못했습니다. 다시 뽑아 주세요.");
        const questionUids = records.map((record) => record.questionUid);
        const { grade, subject } = gradeSubjectOf(records);
        const title = paperTitleOf(dlg, level).slice(0, 70);
        const meta = {
          title, customTitle: title, identityTitle: title, count: records.length, grade, subject, questionUids,
          printHeaderOptions: { title, subtitle: "", metaRight: "AP수학", showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
          includeQr: false, qpp: 4, sourceType: "mixed", indexVersion: state.catalog.indexVersion,
        };
        const envelope = await O.publishOutputEnvelope({
          sourceKind: "archive2-compose", sourceId: crypto.randomUUID(), mode: "exam",
          questionCount: records.length, questionUids, meta, questions,
        });
        popup.location.replace(O.outputEnvelopeUrl("mixed_engine.html", location.href, envelope, { studio: true }).href);
        status(isMock(dlg) ? `${LEVEL_NAME[level]} 모의고사 ${records.length}문항 시험지를 열었습니다.` : `다시 만든 ${records.length}문항 시험지를 열었습니다.`);
      } catch (error) {
        popup.close();
        setError(teacherErrorMessage(error, "시험지를 준비하지 못했습니다. 잠시 뒤 다시 시도해 주세요."));
        console.warn("[archive2] derive popup failed:", error);
      }
    })();
  }
  function setError(message) {
    const dlg = V.derive.dlg;
    if (dlg) dlg.error = message;
    const slot = $("derive-error");
    if (slot) { slot.textContent = message; slot.hidden = false; }
    else status(message, true);
  }

  // ---- 문제지 만들기로 넘기기: 고른 문항 UID 목록이 범위(검색에서 고른 문항과 같은 길)이고, 서버가 같은 목록으로 다시 확인한다 ----
  async function toCompose() {
    const dlg = V.derive.dlg;
    if (!dlg?.result?.items.length || V.derive.busy) return;
    if (state.saveResultState === "RESULT_UNKNOWN") { setError("현재 저장 결과를 먼저 확인한 뒤 이어서 진행하세요."); return; }
    const uids = dlg.result.items.map((record) => record.questionUid);
    // 객관식 먼저·서술형 뒤로 정렬하려고 이 문항들의 원본만 읽는다. 못 읽으면 뽑은 순서 그대로 두고 막지 않는다.
    let ordered = dlg.result.items;
    V.derive.busy = true;
    renderDialog();
    try { await restoreForPaper(ordered); ordered = paperOrder(ordered); } catch (error) { console.warn("[archive2] derive order skipped:", error); }
    finally { V.derive.busy = false; }
    const info = {
      baseUids: [...dlg.baseUids], baseTitle: dlg.baseTitle.slice(0, 120), typeMode: dlg.typeMode, level: dlg.level, source: dlg.source, publisher: dlg.publisher,
      seed: dlg.seed, exclude: [...dlg.exclude].slice(-4000), resultUids: uids,
      text: (isMock(dlg) ? dlg.result.summary.headline : dlg.result.summary.text) || "", levelText: dlg.result.summary.levelText || "", notes: (dlg.result.notes || []).slice(0, 6).map((note) => String(note).slice(0, 300)),
    };
    if (state.selected.length) save();
    rememberCurrentHistoryEntry();
    resetWorkingDraft();
    state.view = "compose";
    state.editSavedPaperId = "";
    state.urlUids = uids;
    applyUidRoute();
    if (state.uidRoute?.error) { renderDialog(); setError(state.uidRoute.error); return; }
    state.derive = info;
    state.title = paperTitleOf(dlg).slice(0, 80);
    state.header = { ...state.header, title: state.title };
    if ($("modal")?.open) $("modal").close();
    history.pushState({ archive2ScrollY: 0 }, "", routeUrl());
    generate(false);
    const rank = new Map(ordered.map((record, i) => [record.questionUid, i]));
    if (state.selected.length) {
      state.selected = [...state.selected].sort((a, b) => (rank.get(a.questionUid) ?? 1e9) - (rank.get(b.questionUid) ?? 1e9));
      state.previewIndex = 0;
      save();
      render();
    }
    status(state.selected.length === uids.length
      ? `다시 만든 ${uids.length}문항으로 문제지를 만들었습니다.`
      : `다시 만든 ${uids.length}문항 중 ${state.selected.length}문항이 문제지에 들어갔습니다.`);
  }

  // 문제지 만들기 결과 요약에 붙는 안내(지금 문항이 다시 만든 그대로일 때만)
  function deriveNoteMarkup() {
    const info = state.derive;
    if (!info || !Array.isArray(info.resultUids) || !state.selected.length) return "";
    const current = new Set(state.selected.map((record) => record.questionUid));
    if (current.size !== info.resultUids.length || info.resultUids.some((uid) => !current.has(uid))) return "";
    const parts = [info.text, info.levelText].filter(Boolean);
    return `<div class="callout derive-compose-note" role="status" data-derive-compose-note><strong>${esc(info.baseTitle || "기준 시험지")} ${info.source === "mock" ? "모의고사" : "다시 만들기"}</strong> · ${esc(TYPE_NAME[info.typeMode] || "")} · ${esc(LEVEL_NAME[info.level] || "")}${parts.length ? `<p>${parts.map(esc).join("<br>")}</p>` : ""}${(info.notes || []).length ? `<ul>${info.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>` : ""}<p>${button("derive-compose-again", "다시 뽑기", 'class="small"')}${info.source === "mock" ? MOCK_LEVELS.filter((level) => level !== info.level).map((level) => ` ${button("derive-mock-switch", `${esc(LEVEL_NAME[level])}으로 새로 만들기`, `class="small" data-level="${level}"`)}`).join("") : ""}</p></div>`;
  }

  // ---- 단추 ----
  async function deriveAction(name, element) {
    if (name === "derive-run") return runDerive();
    if (name === "derive-again") return again();
    if (name === "derive-edit") { const dlg = V.derive.dlg; if (dlg) { dlg.result = null; dlg.error = ""; if (isMock(dlg)) dlg.choose = true; renderDialog(); } return undefined; }
    if (name === "derive-mock-open") {
      const exam = state.catalog?.exams?.[Number(element?.dataset?.exam)];
      return startMockForExam(exam);
    }
    if (name === "derive-mock-level") return selectMockLevel(element?.dataset?.level);
    if (name === "derive-mock-all") return mockAll();
    if (name === "derive-mock-switch") return mockSwitch(element?.dataset?.level);
    if (name === "derive-mock-open-all") return openAllPapers();
    if (name === "derive-popup") return openPopup();
    if (name === "derive-compose") return toCompose();
    if (name === "derive-compose-again") return startFromCompose();
    if (name === "assignment-derive") return startFromAssignment(element?.dataset?.assignment);
    return undefined;
  }
  Object.assign(WS.api, {
    deriveAction,
    deriveNoteMarkup,
    deriveStartFromItems,
    startMockForExam,
    deriveResolveBase,
    deriveItemsFromEnvelope,
    openDeriveFromUrl,
  });
})();
